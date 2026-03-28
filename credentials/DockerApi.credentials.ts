import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class DockerApi implements ICredentialType {
  name = 'dockerApi';
  displayName = 'Docker API';
  documentationUrl = 'https://github.com/ramygamal231/n8n-nodes-docker-api';
  properties: INodeProperties[] = [
    {
      displayName: 'Connection Mode',
      name: 'authMode',
      type: 'options',
      options: [
        {
          name: 'Unix Socket (Local)',
          value: 'socket',
          description: 'Connect to Docker via local Unix socket',
        },
        {
          name: 'TCP (Remote)',
          value: 'tcp',
          description: 'Connect to a remote Docker daemon over TCP',
        },
        {
          name: 'TLS (Secure Remote)',
          value: 'tls',
          description: 'Connect to a remote Docker daemon with TLS authentication',
        },
      ],
      default: 'socket',
    },
    // --- Socket mode fields ---
    {
      displayName: 'Socket Path',
      name: 'socketPath',
      type: 'string',
      default: '/var/run/docker.sock',
      displayOptions: { show: { authMode: ['socket'] } },
      description: 'Path to the Docker Unix socket',
    },
    // --- TCP mode fields ---
    {
      displayName: 'Host',
      name: 'host',
      type: 'string',
      default: '',
      placeholder: '192.168.1.100',
      displayOptions: { show: { authMode: ['tcp', 'tls'] } },
      description: 'IP address or hostname of the Docker host',
    },
    {
      displayName: 'Port',
      name: 'port',
      type: 'number',
      default: 2375,
      displayOptions: { show: { authMode: ['tcp'] } },
      description: 'Docker daemon TCP port (default: 2375)',
    },
    // --- TLS mode fields (v2 implementation, schema defined now) ---
    {
      displayName: 'TLS Port',
      name: 'tlsPort',
      type: 'number',
      default: 2376,
      displayOptions: { show: { authMode: ['tls'] } },
      description: 'Docker daemon TLS port (default: 2376)',
    },
    {
      displayName: 'CA Certificate',
      name: 'ca',
      type: 'string',
      typeOptions: { rows: 4 },
      default: '',
      displayOptions: { show: { authMode: ['tls'] } },
      description: 'TLS CA certificate (PEM format)',
    },
    {
      displayName: 'Client Certificate',
      name: 'cert',
      type: 'string',
      typeOptions: { rows: 4 },
      default: '',
      displayOptions: { show: { authMode: ['tls'] } },
      description: 'TLS client certificate (PEM format)',
    },
    {
      displayName: 'Client Key',
      name: 'clientKey',
      type: 'string',
      typeOptions: { rows: 4, password: true },
      default: '',
      displayOptions: { show: { authMode: ['tls'] } },
      description: 'TLS client private key (PEM format)',
    },
    // --- Access control ---
    {
      displayName: 'Access Mode',
      name: 'accessMode',
      type: 'options',
      options: [
        {
          name: 'Read Only',
          value: 'readonly',
          description: 'Only list and inspect operations are allowed',
        },
        {
          name: 'Full Control',
          value: 'full',
          description: 'All operations including start, stop, and remove are allowed',
        },
      ],
      default: 'readonly',
      description: 'Controls which operations this credential permits',
    },
    {
      displayName: '',
      name: 'securityNotice',
      type: 'notice',
      default: '⚠️ This credential connects to the Docker daemon. Full Control mode grants the ability to start, stop, and remove containers. Use Read Only mode unless write access is explicitly required.',
    },
  ];
}
