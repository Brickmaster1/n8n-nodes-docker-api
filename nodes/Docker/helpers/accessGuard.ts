import { ICredentialDataDecryptedObject } from 'n8n-workflow';

// Operations that require full-control access
const WRITE_OPERATIONS = ['start', 'stop', 'remove', 'restart', 'run', 'pull', 'build', 'prune'];

export function enforceAccessMode(
  credentials: ICredentialDataDecryptedObject,
  operation: string,
): void {
  const accessMode = credentials.accessMode as string;

  if (accessMode === 'readonly' && WRITE_OPERATIONS.includes(operation)) {
    throw new Error(
      `Operation "${operation}" requires Full Control access. ` +
      `This credential is configured as Read Only. ` +
      `Update your Docker API credential to enable write operations.`
    );
  }
}
