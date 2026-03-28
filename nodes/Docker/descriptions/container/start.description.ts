import { INodeProperties } from 'n8n-workflow';

export const startContainerFields: INodeProperties[] = [
  {
    displayName: 'Container ID or Name',
    name: 'containerId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['start'],
      },
    },
    default: '',
    description: 'The ID or name of the container to start',
    placeholder: 'my-container or abc123def456',
  },
];
