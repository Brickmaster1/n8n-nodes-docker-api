import { INodeProperties } from 'n8n-workflow';

export const getLogsContainerFields: INodeProperties[] = [
  {
    displayName: 'Container ID or Name',
    name: 'containerId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['getLogs'],
      },
    },
    default: '',
    description: 'The ID or name of the container to retrieve logs from',
    placeholder: 'my-container or abc123def456',
  },
  {
    displayName: 'Tail (Lines)',
    name: 'tail',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['getLogs'],
      },
    },
    default: 100,
    description: 'Number of lines from the end of the log to return. Use 0 for all lines.',
  },
  {
    displayName: 'Include Timestamps',
    name: 'timestamps',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['getLogs'],
      },
    },
    default: false,
    description: 'Whether to prepend timestamps to each log line',
  },
  {
    displayName: 'Stream',
    name: 'stream',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['getLogs'],
      },
    },
    options: [
      { name: 'Both (stdout + stderr)', value: 'both' },
      { name: 'stdout Only', value: 'stdout' },
      { name: 'stderr Only', value: 'stderr' },
    ],
    default: 'both',
    description: 'Which output stream(s) to include in the logs',
  },
];
