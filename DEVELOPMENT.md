# Development Notes

## Quick Start

```bash
# Install dependencies
npm install

# Build (watch mode for development)
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

## n8n Local Development

This project is linked to local n8n via `npm link`:

```bash
# In this project directory
npm link

# In n8n source directory (adjust path as needed)
npm link n8n-nodes-docker-api
```

After changes, rebuild and restart n8n:
```bash
npm run build
# Restart n8n dev server
```

## Project Structure

- `credentials/` - Docker API credential type (socket, TCP, TLS)
- `nodes/Docker/` - Main node implementation
  - `actions/` - Operation implementations (list, getLogs, start, stop)
  - `descriptions/` - Node UI field definitions
  - `helpers/` - Utilities (normalize, error handling, access guard)
- `utils/` - Shared utilities (dockerode client factory)
- `test/unit/` - Unit tests for helpers

## v1 Implementation Status

✅ Complete:
- DockerApi credentials (socket + TCP, TLS schema ready)
- List Containers operation
- Get Container Logs operation
- Start Container operation
- Stop Container operation (with dry run)
- Access mode enforcement (readonly vs full-control)
- Error handling with human-readable messages
- Output normalization

Not yet implemented (v2+):
- TLS authentication (schema exists, not implemented)
- Restart Container
- Remove Container
- Image operations (list, pull, remove)
- Container name autocomplete
- Trigger node

## Testing

```bash
# Unit tests only
npm test -- --testPathPattern=unit

# Integration tests (requires Docker daemon)
npm test -- --testPathPattern=integration

# Remote Docker testing
DOCKER_TEST_MODE=tcp DOCKER_TEST_HOST=192.168.x.x npm test
```

## Common Issues

**Node not appearing in n8n:**
1. Ensure `npm run build` completed successfully
2. Check n8n dev server is restarted
3. Verify npm link is correct

**Docker connection errors:**
- Socket mode: Ensure n8n process has access to `/var/run/docker.sock`
- TCP mode: Ensure Docker daemon is running with `-H tcp://0.0.0.0:2375`

## Next Session Starting Point

When continuing development:
1. Read the spec: `n8n-docker-node-plan.md`
2. Check current implementation in `nodes/Docker/`
3. Review what's working in n8n at localhost:5678
4. Pick next v2 feature from roadmap
