import { ContainerInfo, ContainerInspectInfo } from 'dockerode';

export interface NormalizedContainer {
  id: string;
  shortId: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'exited' | 'paused' | 'restarting' | 'dead' | 'created' | 'unknown';
  createdAt: string;
  ports: Array<{ containerPort: number; hostPort?: number; protocol: string }>;
  labels?: Record<string, string>;
}

export function normalizeContainerInfo(raw: ContainerInfo | ContainerInspectInfo, includeLabels: boolean = true): NormalizedContainer {
  // Handle both ContainerInfo (from listContainers) and ContainerInspectInfo (from inspect)
  const isInspectInfo = 'Name' in raw;
  
  const name = isInspectInfo 
    ? (raw as ContainerInspectInfo).Name.replace(/^\//, '')
    : (raw as ContainerInfo).Names?.[0]?.replace(/^\//, '') ?? 'unknown';
    
  const dockerState = isInspectInfo 
    ? (raw as ContainerInspectInfo).State?.Status ?? 'unknown'
    : (raw as ContainerInfo).State ?? 'unknown';
    
  const status = mapStatus(dockerState);

  // Handle ports - only available in ContainerInfo
  const portsInfo = (raw as ContainerInfo).Ports;
  const seenPorts = new Set<string>();
  const uniquePorts: Array<{ containerPort: number; hostPort?: number; protocol: string }> = [];

  if (portsInfo) {
    for (const port of portsInfo) {
      const key = `${port.PrivatePort}-${port.PublicPort ?? 'none'}-${port.Type}`;
      if (!seenPorts.has(key)) {
        seenPorts.add(key);
        uniquePorts.push({
          containerPort: port.PrivatePort,
          hostPort: port.PublicPort,
          protocol: port.Type,
        });
      }
    }
  }

  // Handle image
  const image = isInspectInfo 
    ? (raw as ContainerInspectInfo).Config?.Image ?? 'unknown'
    : (raw as ContainerInfo).Image ?? 'unknown';

  // Handle created timestamp
  const created = isInspectInfo
    ? (raw as ContainerInspectInfo).Created ?? new Date().toISOString()
    : new Date(((raw as ContainerInfo).Created ?? 0) * 1000).toISOString();

  // Handle labels - only include if requested
  const labelsData = isInspectInfo
    ? (raw as ContainerInspectInfo).Config?.Labels ?? {}
    : (raw as ContainerInfo).Labels ?? {};

  const result: NormalizedContainer = {
    id: raw.Id,
    shortId: raw.Id.substring(0, 12),
    name,
    image,
    status,
    createdAt: created,
    ports: uniquePorts,
  };

  // Only add labels field if includeLabels is true
  if (includeLabels) {
    result.labels = labelsData;
  }

  return result;
}

function mapStatus(dockerState: string): NormalizedContainer['status'] {
  const map: Record<string, NormalizedContainer['status']> = {
    running: 'running',
    exited: 'exited',
    stopped: 'stopped',
    paused: 'paused',
    restarting: 'restarting',
    dead: 'dead',
    created: 'created',
  };
  return map[dockerState?.toLowerCase()] ?? 'unknown';
}
