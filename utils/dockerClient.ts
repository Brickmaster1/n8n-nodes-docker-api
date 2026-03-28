import Docker from 'dockerode';
import { ICredentialDataDecryptedObject } from 'n8n-workflow';

export function createDockerClient(credentials: ICredentialDataDecryptedObject): Docker {
  const { authMode, socketPath, host, port, tlsPort, ca, cert, clientKey } = credentials;

  if (authMode === 'socket') {
    return new Docker({ socketPath: socketPath as string });
  }

  if (authMode === 'tcp') {
    return new Docker({
      host: host as string,
      port: port as number,
      protocol: 'http',
    });
  }

  if (authMode === 'tls') {
    return new Docker({
      host: host as string,
      port: tlsPort as number,
      ca: ca as string,
      cert: cert as string,
      key: clientKey as string,
      protocol: 'https',
    });
  }

  throw new Error(`Unknown authMode: ${authMode}`);
}
