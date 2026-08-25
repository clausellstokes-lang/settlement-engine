/**
 * campaignPulsePersist.test.js — the world-pulse persist ladder (steps 1, 2).
 *
 * The world-pulse flush uploads each member's full settlement blob + campaignState
 * and THEN syncs the campaign snapshot (the commit point). These pins lock the
 * behaviour of the parallelised + differential persistSaveUpdates:
 *
 *   • Parallel-flush contract — every update is attempted (no fail-fast even when
 *     one rejects), and the failure is reported (campaignSyncError) so the banner
 *     ends up set on a partial failure.
 *   • Seam ordering — syncCampaignSnapshot runs ONLY after every member persist
 *     has resolved (proved with deferred promises).
 *   • Differential skip — an identical payload is not re-uploaded; a real change
 *     (even a lone worldTick stamp) is; a FAILED persist never records its
 *     fingerprint, so the retry re-uploads.
 *   • Micro-benchmark — capped-parallel wall-clock beats strict-sequential.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: true },
}));

vi.mock('../../src/lib/campaigns.js', () => ({
  isCampaignActive: c => (c?.accessState || 'active') === 'active',
  campaigns: {
    upsert: vi.fn(c => Promise.resolve(c?.id)),
    cache: vi.fn(),
    isConfigured: true,
    recordTombstone: vi.fn(),
    delete: vi.fn(() => Promise.resolve()),
  },
}));

import { saves } from '../../src/lib/saves.js';
import { campaigns } from '../../src/lib/campaigns.js';
import {
  persistSaveUpdate,
  persistSaveUpdates,
  flushWorldPulsePersist,
  clearPersistFingerprintCache,
  clearCampaignSyncBookkeeping,
  initPersistFailureReporter,
  retryOutboxPersist,
} from '../../src/store/campaignSliceShared.js';
import { resetOutbox, peekOps, getStatus } from '../../src/store/outbox.js';

function makeUpdate(saveId, { tick = 1, blob = 'x'.repeat(200) } = {}) {
  return {
    saveId,
    settlement: { id: saveId, name: saveId, blob },
    campaignState: { worldPulse: { lastTick: tick, updatedAt: '2026-01-01T00:00:00.000Z' } },
  };
}

beforeEach(() => {
  saves.update.mockReset();
  saves.update.mockResolvedValue(undefined);
  campaigns.upsert.mockReset();
  campaigns.upsert.mockImplementation(c => Promise.resolve(c?.id));
  clearPersistFingerprintCache();
  clearCampaignSyncBookkeeping();
  initPersistFailureReporter(null);
  resetOutbox();
});

describe('parallel-flush contract', () => {
  test('every member upload is attempted despite one failing, and the failure is reported', async () => {
    const report = vi.fn();
    initPersistFailureReporter(report);
    // The middle member rejects; the rest resolve. No update may be abandoned.
    saves.update.mockImplementation(saveId =>
      saveId === 'c' ? Promise.reject(new Error('network down')) : Promise.resolve(),
    );

    const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
    const summary = await persistSaveUpdates(ids.map(id => makeUpdate(id)));

    // Bounded concurrency (cap 4) still drains ALL updates.
    expect(saves.update).toHaveBeenCalledTimes(6);
    const attempted = saves.update.mock.calls.map(call => call[0]).sort();
    expect(attempted).toEqual(ids);
    // The one failure surfaced (→ campaignSyncError banner would be set).
    expect(report).toHaveBeenCalledTimes(1);
    expect(summary).toMatchObject({ attempted: 6, failed: 1, skipped: 0 });
  });

  test('saturates but never exceeds the concurrency cap of 4 in flight', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const resolvers = [];
    saves.update.mockImplementation(() => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      return new Promise(res => {
        resolvers.push(() => { inFlight -= 1; res(); });
      });
    });

    const pending = persistSaveUpdates(
      Array.from({ length: 10 }, (_, i) => makeUpdate(`s${i}`)),
    );
    // Drain: resolve everything currently in flight, yield a microtask so the freed
    // lanes pull the next update, and repeat until the whole flush has settled.
    let settled = false;
    pending.then(() => { settled = true; });
    while (!settled) {
      if (resolvers.length) resolvers.splice(0).forEach(fn => fn());
      await Promise.resolve();
    }
    await pending;

    // 10 updates across a cap of 4 → the pool saturates at exactly 4, never more.
    expect(maxInFlight).toBe(4);
    expect(saves.update).toHaveBeenCalledTimes(10);
  });
});

describe('seam ordering — snapshot is the commit point', () => {
  test('syncCampaignSnapshot runs only after EVERY member persist resolves', async () => {
    const resolvers = [];
    saves.update.mockImplementation(() => new Promise(res => { resolvers.push(res); }));

    const snapshot = [{
      id: 'camp-1', name: 'Realm', accessState: 'active',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }];
    const flushed = flushWorldPulsePersist({
      result: true,
      campaignPersist: { snapshot },
      persistUpdates: ['a', 'b', 'c'].map(id => makeUpdate(id)),
      campaignId: 'camp-1',
    });

    // Let microtasks settle: all three member persists are in flight (cap 4)…
    await Promise.resolve();
    await Promise.resolve();
    expect(saves.update).toHaveBeenCalledTimes(3);
    // …but the campaign snapshot has NOT been synced while any member is pending.
    expect(campaigns.upsert).not.toHaveBeenCalled();

    // Resolve every member persist → only now may the commit point run.
    resolvers.forEach(res => res());
    await flushed;
    expect(campaigns.upsert).toHaveBeenCalledTimes(1);
    expect(campaigns.upsert.mock.calls[0][0]).toMatchObject({ id: 'camp-1' });
  });

  test('even a member FAILURE does not let the snapshot jump ahead', async () => {
    initPersistFailureReporter(vi.fn());
    const resolvers = [];
    saves.update.mockImplementation(saveId => new Promise((res, rej) => {
      resolvers.push(saveId === 'b' ? () => rej(new Error('down')) : res);
    }));

    const snapshot = [{ id: 'camp-1', name: 'Realm', accessState: 'active', updatedAt: '2026-01-02T00:00:00.000Z' }];
    const flushed = flushWorldPulsePersist({
      result: true,
      campaignPersist: { snapshot },
      persistUpdates: ['a', 'b'].map(id => makeUpdate(id)),
      campaignId: 'camp-1',
    });

    await Promise.resolve();
    await Promise.resolve();
    expect(campaigns.upsert).not.toHaveBeenCalled();

    resolvers.forEach(fn => fn());
    await flushed;
    // Snapshot still commits (local truth is durable), but only after both settled.
    expect(campaigns.upsert).toHaveBeenCalledTimes(1);
  });
});

describe('differential persistence', () => {
  test('an identical payload is not re-uploaded on the next flush', async () => {
    const updates = [makeUpdate('a')];

    const first = await persistSaveUpdates(updates);
    expect(saves.update).toHaveBeenCalledTimes(1);
    expect(first).toMatchObject({ attempted: 1, skipped: 0 });

    // Same bytes → the second flush skips the upload entirely.
    const second = await persistSaveUpdates(updates);
    expect(saves.update).toHaveBeenCalledTimes(1);
    expect(second).toMatchObject({ attempted: 0, skipped: 1 });
  });

  test('a real change (worldTick stamp only) still persists', async () => {
    await persistSaveUpdates([makeUpdate('a', { tick: 1 })]);
    expect(saves.update).toHaveBeenCalledTimes(1);

    // Same settlement blob, only campaignState.worldPulse.lastTick changed — this
    // is a genuine change and the fingerprint catches it without special-casing.
    await persistSaveUpdates([makeUpdate('a', { tick: 2 })]);
    expect(saves.update).toHaveBeenCalledTimes(2);
  });

  test('a FAILED persist does not record the fingerprint — the retry re-uploads', async () => {
    initPersistFailureReporter(vi.fn());
    saves.update.mockRejectedValueOnce(new Error('down')); // first attempt fails
    saves.update.mockResolvedValue(undefined);             // retry succeeds

    const updates = [makeUpdate('a')];

    const first = await persistSaveUpdates(updates);
    expect(saves.update).toHaveBeenCalledTimes(1);
    expect(first).toMatchObject({ attempted: 1, failed: 1, skipped: 0 });

    // Identical payload, but the prior attempt FAILED → must not be skipped.
    const second = await persistSaveUpdates(updates);
    expect(saves.update).toHaveBeenCalledTimes(2);
    expect(second).toMatchObject({ attempted: 1, skipped: 0, failed: 0 });

    // Now that it succeeded, a third identical flush is finally skipped.
    const third = await persistSaveUpdates(updates);
    expect(saves.update).toHaveBeenCalledTimes(2);
    expect(third).toMatchObject({ attempted: 0, skipped: 1 });
  });
});

describe('micro-benchmark — capped-parallel beats strict-sequential', () => {
  test('10 updates with 50ms-latency mock persist', async () => {
    const LATENCY_MS = 50;
    const N = 10;
    saves.update.mockImplementation(() => new Promise(res => setTimeout(res, LATENCY_MS)));
    const updates = Array.from({ length: N }, (_, i) => makeUpdate(`s${i}`, { blob: String(i) }));

    // Strict-sequential baseline: await each single-save persist in turn.
    clearPersistFingerprintCache();
    const seqStart = Date.now();
    for (const u of updates) {
      await persistSaveUpdate(u.saveId, { settlement: u.settlement, campaignState: u.campaignState });
    }
    const seqMs = Date.now() - seqStart;

    // Capped-parallel via the new persistSaveUpdates (unique payloads → no skips).
    clearPersistFingerprintCache();
    const parStart = Date.now();
    await persistSaveUpdates(updates);
    const parMs = Date.now() - parStart;

    console.log(`[bench] sequential=${seqMs}ms  capped-parallel(cap=4)=${parMs}ms  speedup=${(seqMs / parMs).toFixed(2)}x`);

    // Sequential ≈ N×50 = 500ms; capped-parallel ≈ ceil(10/4)×50 = 150ms.
    expect(parMs).toBeLessThan(seqMs * 0.6);
  }, 10000);
});

describe('durable outbox integration (Track K C3)', () => {
  test('a failed member leaves a durable op that a later drain re-attempts (not lost)', async () => {
    initPersistFailureReporter(vi.fn());
    // First flush: member "b" fails its single attempt; a and c succeed.
    saves.update.mockImplementation(saveId =>
      saveId === 'b' ? Promise.reject(new Error('down')) : Promise.resolve(),
    );
    const first = await persistSaveUpdates(['a', 'b', 'c'].map(id => makeUpdate(id)));
    expect(first).toMatchObject({ attempted: 3, failed: 1, skipped: 0 });

    // The failed member survives IN the outbox (backing off), a/c drained clean.
    const pendingIds = peekOps().filter(op => op.kind !== 'barrier').map(op => op.saveId);
    expect(pendingIds).toEqual(['b']);
    expect(getStatus().failed + getStatus().queued).toBe(1);

    // Connectivity returns; the Retry affordance revives + re-drains it.
    saves.update.mockResolvedValue(undefined);
    await retryOutboxPersist();
    expect(peekOps().filter(op => op.kind !== 'barrier')).toHaveLength(0);
    expect(getStatus()).toMatchObject({ queued: 0, failed: 0 });
  });

  test('re-flushing the SAME save+kind supersedes the stale queued op (no duplicate)', async () => {
    initPersistFailureReporter(vi.fn());
    // First attempt for "a" fails → op parks in the queue (attempts=1, backing off).
    saves.update.mockRejectedValueOnce(new Error('down'));
    saves.update.mockImplementation(() => new Promise(() => {})); // subsequent attempts hang
    await persistSaveUpdate('a', { settlement: { v: 1 } });

    const afterFirst = peekOps().filter(op => op.kind !== 'barrier');
    expect(afterFirst).toHaveLength(1);
    expect(afterFirst[0].saveId).toBe('a');

    // A newer write for the same save+kind supersedes it — still exactly ONE op,
    // carrying the newer payload; the stale intent is dropped.
    persistSaveUpdate('a', { settlement: { v: 2 } });
    const afterSecond = peekOps().filter(op => op.kind !== 'barrier' && op.saveId === 'a');
    expect(afterSecond).toHaveLength(1);
  });
});
