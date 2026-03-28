import { INodeProperties } from 'n8n-workflow';

export const listContainerFields: INodeProperties[] = [
  {
    displayName: 'Show All Containers',
    name: 'showAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['list'],
      },
    },
    default: false,
    description: 'Whether to show stopped and exited containers in addition to running ones',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Filter containers by name (partial match supported)',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: 'Running', value: 'running' },
          { name: 'Exited', value: 'exited' },
          { name: 'Paused', value: 'paused' },
        ],
        default: '',
        description: 'Filter containers by status',
      },
    ],
  },
  {
    displayName: 'Include Labels',
    name: 'includeLabels',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['list'],
      },
    },
    default: true,
    description: 'Whether to include container labels in the output (can be verbose)',
  },
];
