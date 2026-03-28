export function translateDockerError(error: unknown): string {
  const msg = (error as Error)?.message ?? String(error);

  if (msg.includes('ECONNREFUSED')) {
    return 'Cannot connect to Docker daemon. Is Docker running? Check your connection settings.';
  }
  if (msg.includes('ENOENT') && msg.includes('docker.sock')) {
    return 'Docker socket not found at the specified path. Verify the socket path in your credential.';
  }
  if (msg.toLowerCase().includes('permission denied')) {
    return 'Permission denied accessing Docker socket. Ensure the n8n process has permission to access the socket.';
  }
  if (msg.includes('No such container') || msg.includes('not found')) {
    return 'Container not found. Verify the container ID or name is correct and the container exists.';
  }
  if (msg.includes('is not running')) {
    return 'Container is not running. Start the container before performing this operation.';
  }
  if (msg.includes('already started') || msg.includes('already running')) {
    return 'Container is already running.';
  }
  if (msg.includes('404')) {
    return 'Resource not found. The container or image may have been removed.';
  }
  if (msg.includes('409')) {
    return 'Conflict: The container may already be in the requested state.';
  }
  if (msg.includes('timeout') || msg.includes('ETIMEDOUT')) {
    return 'Connection timed out. Check network connectivity to the Docker host.';
  }

  // Fallback: return original message without prefix for cleaner output
  return msg;
}
