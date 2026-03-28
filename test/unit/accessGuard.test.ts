import { enforceAccessMode } from '../../nodes/Docker/helpers/accessGuard';

describe('enforceAccessMode', () => {
  it('allows list operation with readonly access', () => {
    const credentials = { accessMode: 'readonly' };
    expect(() => enforceAccessMode(credentials, 'list')).not.toThrow();
  });

  it('allows getLogs operation with readonly access', () => {
    const credentials = { accessMode: 'readonly' };
    expect(() => enforceAccessMode(credentials, 'getLogs')).not.toThrow();
  });

  it('blocks start operation with readonly access', () => {
    const credentials = { accessMode: 'readonly' };
    expect(() => enforceAccessMode(credentials, 'start')).toThrow('requires Full Control access');
  });

  it('blocks stop operation with readonly access', () => {
    const credentials = { accessMode: 'readonly' };
    expect(() => enforceAccessMode(credentials, 'stop')).toThrow('requires Full Control access');
  });

  it('blocks remove operation with readonly access', () => {
    const credentials = { accessMode: 'readonly' };
    expect(() => enforceAccessMode(credentials, 'remove')).toThrow('requires Full Control access');
  });

  it('allows start operation with full access', () => {
    const credentials = { accessMode: 'full' };
    expect(() => enforceAccessMode(credentials, 'start')).not.toThrow();
  });

  it('allows stop operation with full access', () => {
    const credentials = { accessMode: 'full' };
    expect(() => enforceAccessMode(credentials, 'stop')).not.toThrow();
  });

  it('allows all write operations with full access', () => {
    const credentials = { accessMode: 'full' };
    const writeOps = ['start', 'stop', 'remove', 'restart', 'run', 'pull', 'build', 'prune'];
    
    writeOps.forEach((op) => {
      expect(() => enforceAccessMode(credentials, op)).not.toThrow();
    });
  });

  it('includes operation name in error message', () => {
    const credentials = { accessMode: 'readonly' };
    try {
      enforceAccessMode(credentials, 'stop');
    } catch (error) {
      expect((error as Error).message).toContain('"stop"');
    }
  });

  it('includes guidance in error message', () => {
    const credentials = { accessMode: 'readonly' };
    try {
      enforceAccessMode(credentials, 'start');
    } catch (error) {
      expect((error as Error).message).toContain('Update your Docker API credential');
    }
  });
});
