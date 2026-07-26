/**
 * outboxColumnGate.test.js — store-hooks-state-2 pin (interleaved kinds).
 *
 * The outbox op "kind" used to be the sorted set of RAW partial keys, so:
 *  (a) a NON-persisted key like `timestamp` perturbed the kind — destroy
 *      {campaignState,settlement,timestamp} and applyEvent {campaignState,settlement}
 *      write IDENTICAL columns {campaign_state,data} yet got DIFFERENT keys, so a
 *      backed-off applyEvent retry could land AFTER destroy and RESURRECT a deleted
 *      settlement; and
 *  (b) a map-edit {settlement} and a later applyEvent {campaignState,settlement}
 *      both write the `data` column but never shared a supersede, so a stale
 *      map-edit retry could REVERT the settlement column.
 *
 * The kind is now the mapped COLUMN set (timestamp stripped), and enqueue supersedes
 * an older non-inflight op whose columns a newer op fully covers. Disjoint-column
 * ops (version_history vs data) still COEXIST.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

let updateBehavior = () => Promise.resolve();
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: (...a) => updateBehavior(...a), isConfigured: true },
}));

import {
  OP_KIND_BARRIER,
  activateOutboxOwner,
  enqueue,
  peekOps,
  peekPayloads,
  resetOutbox,
  setOutboxClock,
  setOutboxScheduler,
} from '../../src/store/outbox.js';
import { persistSaveUpdate } from '../../src/store/campaignSliceShared.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: k => (data.has(String(k)) ? data.get(String(k)) : null),
    setItem: (k, v) => { data.set(String(k), String(v)); },
    removeItem: k => { data.delete(String(k)); },
    clear: () => { data.clear(); },
  };
}
const liveOps = () => peekOps().filter(o => o.kind !== OP_KIND_BARRIER);

beforeEach(() => {
  installLocalStorage();
  setOutboxClock(() => 1_000_000);
  setOutboxScheduler(null);
  resetOutbox();
  activateOutboxOwner('test-owner');
  updateBehavior = () => Promise.resolve();
});

describe('outbox column-set supersede (store-hooks-state-2)', () => {
  test('a newer applyEvent {campaign_state,data} supersedes an older map-edit {data} (subset) — no stale revert', () => {
    enqueue({ saveId: 's1', kind: 'data', payload: { blob: 'stale-mapedit' }, fingerprint: null });
    enqueue({ saveId: 's1', kind: 'campaign_state+data', payload: { blob: 'fresh-applyEvent' }, fingerprint: null });
    const ops = liveOps();
    expect(ops).toHaveLength(1);
    expect(ops[0].kind).toBe('campaign_state+data');
    expect(peekPayloads()['s1:data']).toBeUndefined(); // the stale map-edit payload is GC'd
  });

  test('a destroy op supersedes a backed-off applyEvent that writes the SAME columns — no resurrection', () => {
    // Post-fix both map to {campaign_state,data} (timestamp does not perturb the kind).
    enqueue({ saveId: 's1', kind: 'campaign_state+data', payload: { state: 'alive' }, fingerprint: null });
    enqueue({ saveId: 's1', kind: 'campaign_state+data', payload: { state: 'destroyed' }, fingerprint: null });
    const ops = liveOps();
    expect(ops).toHaveLength(1);
    expect(peekPayloads()['s1:campaign_state+data']).toEqual({ state: 'destroyed' }); // the destroy wins
  });

  test('disjoint columns COEXIST: a version_history write does not drop a data write', () => {
    enqueue({ saveId: 's1', kind: 'data', payload: { blob: 'x' }, fingerprint: null });
    enqueue({ saveId: 's1', kind: 'version_history', payload: { h: [] }, fingerprint: null });
    expect(liveOps()).toHaveLength(2);
  });

  test('supersede is scoped to ONE saveId — a covering op never touches another save', () => {
    enqueue({ saveId: 's1', kind: 'data', payload: { blob: 's1' }, fingerprint: null });
    enqueue({ saveId: 's2', kind: 'campaign_state+data', payload: { blob: 's2' }, fingerprint: null });
    expect(liveOps()).toHaveLength(2); // different saves — no cross-save supersede
  });
});

describe('persistSaveUpdate maps partial keys to COLUMNS (timestamp stripped)', () => {
  test('a {settlement, timestamp} write enqueues under kind "data" — timestamp does not perturb it', async () => {
    updateBehavior = () => Promise.reject(new Error('offline')); // fail so the op stays queued to inspect
    await persistSaveUpdate('s1', { settlement: { x: 1 }, timestamp: '2026-01-01T00:00:00.000Z' });
    const ops = liveOps();
    expect(ops).toHaveLength(1);
    expect(ops[0].kind).toBe('data'); // NOT 'data+timestamp' / 'settlement+timestamp'
  });

  test('the cloud update carries the outbox owner into the saves boundary', async () => {
    const calls = [];
    updateBehavior = (...args) => {
      calls.push(args);
      return Promise.resolve();
    };
    await persistSaveUpdate('s1', { settlement: { x: 1 } });
    expect(calls[0][2]).toEqual({ expectedOwnerId: 'test-owner' });
  });

  test('a {campaignState, settlement, timestamp} destroy and a {campaignState, settlement} applyEvent share the "campaign_state+data" kind', async () => {
    updateBehavior = () => Promise.reject(new Error('offline'));
    await persistSaveUpdate('s1', { campaignState: { phase: 'canon' }, settlement: { x: 1 } });   // applyEvent (older)
    await persistSaveUpdate('s1', { campaignState: { destroyed: true }, settlement: { x: 1 }, timestamp: 't' }); // destroy (newer)
    const ops = liveOps();
    expect(ops).toHaveLength(1); // the destroy superseded the backed-off applyEvent — no resurrection
    expect(ops[0].kind).toBe('campaign_state+data');
    expect(peekPayloads()['s1:campaign_state+data'].campaignState).toEqual({ destroyed: true });
  });
});
