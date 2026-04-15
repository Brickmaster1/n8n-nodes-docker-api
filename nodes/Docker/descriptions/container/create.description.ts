import { INodeProperties } from 'n8n-workflow';

export const createContainerFields: INodeProperties[] = [
  {
    displayName: 'Name',
    name: 'containerName',
    type: 'string',
    required: false,
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Custom name for the container',
    placeholder: 'my-container',
  },
  {
    displayName: 'Image',
    name: 'containerImage',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The OCI image of the container to create',
    placeholder: 'docker.io/library/hello-world or ghcr.io/podman/hello',
  },
  {
    displayName: 'Environment',
    name: 'containerEnvs',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    required: false,
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['create'],
      },
    },
    options: [
      {
        name: 'envValues',
        displayName: 'Env',
        values: [
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            description: 'The environment variable string (e.g., KEY=VALUE)',
          },
        ],
      },
    ],
    default: {},
  },
  {
    displayName: 'Command',
    name: 'containerCmd',
    type: 'string',
    required: false,
    displayOptions: {
      show: {
        resource: ['container'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Custom name for the container',
    placeholder: 'my-container',
  },
];
