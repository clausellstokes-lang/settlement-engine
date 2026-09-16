/**
 * snapshotCapContract.test.js — the snapshot-cap CROSS-CONTRACT pin (lib-infra-3,
 * DESIGN_ANALYTICS_V2 §6).
 *
 * The client (analyticsFlush.buildEnvelope — the flush-time half of the transport
 * split) must never batch more snapshots per envelope than the ingest fn keeps, or
 * a multi-settlement export silently loses member snapshots (the old
 * client-sends-all vs server-slice(0,2) mismatch). This pins BOTH sides to the
 * same cap so they can't drift apart, and asserts each side actually APPLIES its
 * cap (slice) — a value pinned but unused would be vacuous.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MAX_SNAPSHOTS_PER_ENVELOPE } from '../../src/lib/analyticsFlush.js';

const read = (rel) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('snapshot-cap cross-contract (lib-infra-3)', () => {
  const serverSrc = read('supabase/functions/ingest-events/index.ts');
  // The client cap lives in the flush-time half of the eager-leaf/lazy-applier split.
  const clientSrc = read('src/lib/analyticsFlush.js');

  it('the ingest fn declares SERVER_SNAPSHOT_CAP', () => {
    expect(serverSrc).toMatch(/SERVER_SNAPSHOT_CAP\s*=\s*\d+/);
  });

  it('client MAX_SNAPSHOTS_PER_ENVELOPE ≤ server SERVER_SNAPSHOT_CAP', () => {
    const m = serverSrc.match(/SERVER_SNAPSHOT_CAP\s*=\s*(\d+)/);
    const serverCap = Number(m[1]);
    expect(MAX_SNAPSHOTS_PER_ENVELOPE).toBeLessThanOrEqual(serverCap);
  });

  it('the client actually caps the batch in buildEnvelope (not a vacuous constant)', () => {
    expect(clientSrc).toMatch(/slice\(0,\s*MAX_SNAPSHOTS_PER_ENVELOPE\)/);
  });

  it('the server applies its cap and COUNTS the overflow (never a silent drop)', () => {
    expect(serverSrc).toMatch(/slice\(0,\s*SERVER_SNAPSHOT_CAP\)/);
    expect(serverSrc).toMatch(/snapshot_cap_exceeded/);
  });
});
