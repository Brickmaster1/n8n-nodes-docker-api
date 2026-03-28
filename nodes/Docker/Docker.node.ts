import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import { createDockerClient } from '../../utils/dockerClient';
import { containerOperations, containerFields } from './descriptions';
import { executeContainerOperation } from './actions';
import { enforceAccessMode } from './helpers/accessGuard';

export class Docker implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Docker API',
    name: 'docker',
    icon: 'file:docker.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Docker via direct API (no Portainer required)',
    defaults: {
      name: 'Docker API',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'dockerApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Container',
            value: 'container',
          },
        ],
        default: 'container',
      },
      ...containerOperations,
      ...containerFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const credentials = await this.getCredentials('dockerApi');
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    enforceAccessMode(credentials, operation);

    const docker = createDockerClient(credentials);
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const result = await executeContainerOperation.call(this, docker, operation, i);
        returnData.push(...result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: i });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
      }
    }

    return [returnData];
  }
}
