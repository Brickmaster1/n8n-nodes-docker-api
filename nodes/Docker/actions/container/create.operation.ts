import Docker from 'dockerode'
import { IExecuteFunctions } from 'n8n-workflow';
import { translateDockerError } from '../../helpers/errorHandler';
import { normalizeContainerInfo } from '../../helpers/normalizeContainer';


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