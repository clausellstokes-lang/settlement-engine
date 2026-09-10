/**
 * Deployment JSON-boundary tests.
 *
 * scripts/deploy.sh intentionally delegates structured system_config and RPC
 * response handling to scripts/deploy-config.mjs. These tests execute that real
 * command boundary: valid migration-seeded rows retain tuning fields, while
 * malformed or drifted responses fail closed instead of activating a worker.
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SCRIPT = fileURLToPath(
  new URL('../../scripts/deploy-config.mjs', import.meta.url),
);

function run(operation, env = {}) {
  return spawnSync(process.execPath, [SCRIPT, operation], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

describe('deploy-config JSON boundary', () => {
  it('reads an existing dispatcher secret without printing other configuration', () => {
    const result = run('read-dispatcher-secret', {
      DEPLOY_DISPATCHER_ROWS: JSON.stringify([
        { value: { enabled: true, secret: 'kept-secret', maxJobsPerRun: 25 } },
      ]),
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('kept-secret');
  });

  it('activates a seeded dispatcher while preserving its tuning knobs', () => {
    const result = run('merge-dispatcher', {
      DEPLOY_DISPATCHER_ROWS: JSON.stringify([
        { value: { enabled: false, maxJobsPerRun: 25 } },
      ]),
      DEPLOY_WORKER_URL: 'https://example.test/functions/v1/worker',
      DEPLOY_WORKER_SECRET: 'fresh-secret',
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      value: {
        enabled: true,
        maxJobsPerRun: 25,
        url: 'https://example.test/functions/v1/worker',
        secret: 'fresh-secret',
      },
    });
  });

  it('fails closed when persisted dispatcher state does not match deployment', () => {
    const result = run('verify-dispatcher', {
      DEPLOY_DISPATCHER_ROWS: JSON.stringify([
        {
          value: {
            enabled: true,
            url: 'https://example.test/functions/v1/worker',
            secret: 'stale-secret',
          },
        },
      ]),
      DEPLOY_WORKER_URL: 'https://example.test/functions/v1/worker',
      DEPLOY_WORKER_SECRET: 'fresh-secret',
    });

    expect(result.status).not.toBe(0);
  });

  it('accepts only the lease RPC validation response used by deploy readiness', () => {
    const accepted = run('verify-lease-probe', {
      DEPLOY_RPC_PROBE_BODY: JSON.stringify({
        code: 'P0001',
        message: 'event id is required',
      }),
    });
    const rejected = run('verify-lease-probe', {
      DEPLOY_RPC_PROBE_BODY: JSON.stringify({
        code: 'PGRST202',
        message: 'function not found',
      }),
    });

    expect(accepted.status).toBe(0);
    expect(rejected.status).not.toBe(0);
  });
});
