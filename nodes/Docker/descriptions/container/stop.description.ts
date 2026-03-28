import { INodeProperties } from 'n8n-workflow';

export const stopContainerFields: INodeProperties[] = [
  {
    displayName: 'Container ID or Name',
    name: 'containerId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['stop'],
      },
    },
    default: '',
    description: 'The ID or name of the container to stop',
    placeholder: 'my-container or abc123def456',
  },
  {
    displayName: 'Timeout (Seconds)',
    name: 'timeout',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['stop'],
      },
    },
    default: 10,
    description: 'Seconds to wait before force-killing the container. Default is 10.',
  },
  {
    displayName: 'Dry Run',
    name: 'dryRun',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['stop'],
      },
    },
    default: false,
    description: 'Whether to preview the action without executing it. No changes will be made.',
  },
];
