# Contributing to n8n-nodes-docker-api

Thank you for considering contributing to this project! This guide will help you get started.

## Branch Structure

- **`main`** - Production-ready, stable releases only
- **`staging`** - Integration branch for testing before release
- **Feature branches** - Created from `staging` for new features or fixes

## How to Contribute

### 1. Fork and Clone

```bash
git clone https://github.com/ramygamal231/n8n-nodes-docker-api.git
cd n8n-nodes-docker-api
```

### 2. Create a Feature Branch

Always branch from `staging`:

```bash
git checkout staging
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `test/description` - Test additions

### 3. Make Your Changes

Follow the existing code style and project conventions.

### 4. Commit Your Changes

Use clear commit messages with a type prefix:

```bash
git commit -m "feat: add volume mount support"
git commit -m "fix: network configuration issue"
git commit -m "docs: update README examples"
git commit -m "test: add unit tests for Docker node"
```

**Commit types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `test` - Adding or updating tests
- `refactor` - Code refactoring (no functional changes)
- `chore` - Maintenance tasks

### 5. Push and Open a Pull Request

```bash
git push origin feature/your-feature-name
```

**Important:** Open your PR against the **`staging`** branch, not `main`.

## Pull Request Guidelines

### Before Submitting

- [ ] Build succeeds (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Tests pass (`npm run test`)
- [ ] New nodes/credentials include unit tests

### PR Description

Please include in your PR description:

- **What** changed and **why**
- **How to test** the changes
- Any **breaking changes** or migration notes
- Relevant logs, screenshots, or examples

### Review Process

1. PRs are reviewed against `staging` branch
2. Maintainers test the changes
3. Approved PRs are merged into `staging`
4. Periodically, `staging` is merged into `main` with a version tag

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- Docker (for testing Docker-related functionality)
- npm or yarn

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm run test
```

## Creating New Nodes or Credentials

### Requirements

- **Tests required** - All new nodes/credentials must include unit tests
- **TypeScript** - Follow existing TypeScript patterns
- **Error handling** - Graceful error messages for Docker-specific issues

### File Structure

```
nodes/
  YourNode/
    YourNode.node.ts      # Node implementation
    YourNode.node.json    # Node configuration
    test/
      YourNode.node.test.ts  # Unit tests

credentials/
  YourCredential.credentials.ts
```

## Code Style

- Follow the existing code style in the project
- Use TypeScript types/interfaces consistently
- Keep functions focused and testable
- Add JSDoc comments for public methods when helpful

## Questions?

Feel free to open an issue if you have questions or need clarification on contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
