import Docker from 'dockerode'
import { IExecuteFunctions } from 'n8n-workflow';
import { translateDockerError } from '../../helpers/errorHandler';
import { normalizeContainerInfo } from '../../helpers/normalizeContainer';

async function initImage(docker: Docker, imageName: string): Promise<void> {
  try {
    await docker.getImage(imageName).inspect();
    return;
  } catch (error) {
    const message = (error as Error)?.message ?? String(error);

    if (!message.includes('404') && !message.toLowerCase().includes('no such image')) {
      throw error;
    }
  }

  await new Promise<void>((resolve, reject) => {
    docker.pull(imageName, (err: any, stream: NodeJS.ReadableStream) => {
      if (err) {
        reject(err);
        return;
      }

      if (!stream) {
        reject(new Error(`Docker did not return a pull stream for image '${imageName}'.`));
        return;
      }

      docker.modem.followProgress(
        stream,
        (pullError) => {
          if (pullError) {
            reject(pullError);
            return;
          }
          resolve();
        },
        () => undefined
      );
    });
  });
}

export async function createContainer(
  this: IExecuteFunctions,
  docker: Docker,
  itemIndex: number
): Promise<any> {
  try {
    const containerName = this.getNodeParameter('containerName', itemIndex, ) as string;

    const containerImage = this.getNodeParameter('containerImage', itemIndex) as string;

    // { envValues: [{ value: 'KEY=VAL' }, ...]; }
    const envData = this.getNodeParameter('containerEnvs', itemIndex, {}) as any;
    const containerEnvs = (envData.envValues || []).map((env: { value: string }) => env.value) as string[];

    const containerCmd = this.getNodeParameter('containerCmd', itemIndex, []) as string[];

    await initImage(docker, containerImage);

    const container = await docker.createContainer({
      name: containerName || undefined,
      Image: containerImage,
      Env: containerEnvs,
      Cmd: containerCmd.length > 0 ? containerCmd : undefined,
    });

    const containerInfo = await container.inspect();
    return normalizeContainerInfo(containerInfo);
  } catch (error) {
    throw new Error(translateDockerError(error));
  }
}