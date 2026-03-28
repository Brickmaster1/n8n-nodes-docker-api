import Docker from 'dockerode';
import { IExecuteFunctions } from 'n8n-workflow';

import { translateDockerError } from '../../helpers/errorHandler';
import { resolveContainer } from '../../helpers/resolveContainer';

/**
 * Demultiplexes Docker log buffer format.
 * Docker logs use an 8-byte header: [stream type (1 byte)][0,0,0,0][size (4 bytes)][payload]
 * Stream type: 1 = stdout, 2 = stderr
 */
function demuxDockerLogs(buffer: Buffer): Array<{ message: string; stream: 'stdout' | 'stderr' }> {
  const logs: Array<{ message: string; stream: 'stdout' | 'stderr' }> = [];
  let offset = 0;

  while (offset < buffer.length) {
    // Need at least 8 bytes for header
    if (offset + 8 > buffer.length) {
      break;
    }

    const streamType = buffer[offset];
    // Bytes 1-4 are zeros
    // Bytes 5-8 are the payload size (big-endian uint32)
    const payloadSize = buffer.readUInt32BE(offset + 4);

    // Validate we have enough data for the payload
    if (offset + 8 + payloadSize > buffer.length) {
      break;
    }

    const payload = buffer.slice(offset + 8, offset + 8 + payloadSize);
    const message = payload.toString('utf8');

    // Split message into lines and add each line separately
    const lines = message.split('\n').filter((line) => line.length > 0);
    for (const line of lines) {
      logs.push({
        message: line,
        stream: streamType === 1 ? 'stdout' : 'stderr',
      });
    }

    offset += 8 + payloadSize;
  }

  return logs;
}

export async function getContainerLogs(
  this: IExecuteFunctions,
  docker: Docker,
  itemIndex: number,
): Promise<any> {
  try {
    const containerId = this.getNodeParameter('containerId', itemIndex) as string;
    const tail = this.getNodeParameter('tail', itemIndex, 100) as number;
    const timestamps = this.getNodeParameter('timestamps', itemIndex, false) as boolean;
    const stream = this.getNodeParameter('stream', itemIndex, 'both') as 'both' | 'stdout' | 'stderr';

    // Resolve name to ID first
    const resolved = await resolveContainer(docker, containerId);
    const container = docker.getContainer(resolved.id);

    const logOptions = {
      stdout: stream === 'both' || stream === 'stdout',
      stderr: stream === 'both' || stream === 'stderr',
      tail: tail === 0 ? undefined : tail,
      follow: false as false,
      timestamps,
    };

    // Get logs as a Buffer (follow: false returns Buffer)
    const logsBuffer = await container.logs(logOptions);

    // Demultiplex the Docker log format
    const allLogs = demuxDockerLogs(logsBuffer);

    // Filter logs based on stream selection
    let logs: Array<{ message: string; stream: 'stdout' | 'stderr' }> = allLogs;

    if (stream === 'stdout') {
      logs = allLogs.filter((log) => log.stream === 'stdout');
    } else if (stream === 'stderr') {
      logs = allLogs.filter((log) => log.stream === 'stderr');
    }

    return {
      containerId: resolved.id,
      shortId: resolved.id.substring(0, 12),
      containerName: resolved.name,
      logs,
      lineCount: logs.length,
      stream,
      retrievedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(translateDockerError(error));
  }
}
