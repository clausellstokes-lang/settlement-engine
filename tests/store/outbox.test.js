/**
 * outbox.test.js — the durable persistence outbox engine (Track K §C3).
 *
 * These pins lock the outbox's guarantees independently of the store/UI that
 * drives it: deterministic op identity, supersede-dedup, the WS31 bounded drain,
 * exponential backoff + park, the Retry revive, a schema-versioned + tolerant +
 * bounded localStorage mirror, and boot replay from that mirror.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  enqueue,
  enqueueBarrier,
  attemptOps,
  drainReady,
  readyOps,
  resolveBarrier,
  reviveAllPending,
  getStatus,
  loadMirror,
  resetOutbox,
  peekOps,
  peekPayloads,
  setOutboxClock,
  setOutboxScheduler,
  DRAIN_CAP,
  OP_KIND_BARRIER,
} from '../../src/store/outbox.js';

const MIRROR_KEY = 'sf_outbox_v1';
const PAYLOAD_KEY = 'sf_outbox_payloads_v1';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => (data.has(String(key)) ? data.get(String(key)) : null),
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
  return data;
}

// A deterministic, movable clock so backoff timing is fully controlled.
let now = 0;
const clock = () => now;

const okRunner = vi.fn(async () => true);
const failRunner = vi.fn(async () => false);

beforeEach(() => {
  installLocalStorage();
  now = 1_000_000;
  setOutboxClock(clock);
  setOutboxScheduler(null);
  resetOutbox();
  okRunner.mockClear();
  failRunner.mockClear();
});

afterEach(() => {
  setOutboxClock(null);
  setOutboxScheduler(null);
  delete globalThis.localStorage;
});

function enq(saveId, kind = 'settlement', payload = { v: 1 }, extra = {}) {
  return enqueue({ saveId, kind, payload, fingerprint: `${saveId}:${JSON.stringify(payload)}`, ...extra });
}

describe('op identity + enqueue', () => {
  test('op ids are deterministic (monotonic counter, no Date.now)', () => {
    const a = enq('s1');
    const b = enq('s2');
    expect(a.id).toBe('s1::settlement::0');
    expect(b.id).toBe('s2::settlement::1');
    // Reset rewinds the counter — a fresh run reproduces the same ids.
    resetOutbox();
    expect(enq('s1').id).toBe('s1::settlement::0');
  });

  test('enqueue writes a schema-versioned mirror + a referenced (not duplicated) payload', () => {
    enq('s1', 'settlement', { blob: 'x' });
    const mirror = JSON.parse(localStorage.getItem(MIRROR_KEY));
    const payloads = JSON.parse(localStorage.getItem(PAYLOAD_KEY));
    expect(mirror.version).toBe(1);
    expect(mirror.ops).toHaveLength(1);
    // The op carries a payload REFERENCE (key), never the blob inline.
    expect(mirror.ops[0].payloadKey).toBe('s1:settlement');
    expect(mirror.ops[0]).not.toHaveProperty('payload');
    // The blob lives once, in the payload cache under that key.
    expect(payloads.version).toBe(1);
    expect(payloads.payloads['s1:settlement']).toEqual({ blob: 'x' });
  });
});

describe('supersede-dedup', () => {
  test('a newer op for the same saveId+kind replaces the queued older one (one payload)', () => {
    enq('s1', 'settlement', { v: 1 });
    enq('s1', 'settlement', { v: 2 });
    const ops = peekOps().filter(o => o.kind !== OP_KIND_BARRIER);
    expect(ops).toHaveLength(1);
    expect(peekPayloads()['s1:settlement']).toEqual({ v: 2 });
  });

  test('different kinds for the same save COEXIST (they write different columns)', () => {
    enq('s1', 'settlement', { v: 1 });
    enq('s1', 'versionHistory', { h: [] });
    expect(peekOps().filter(o => o.kind !== OP_KIND_BARRIER)).toHaveLength(2);
  });
});

describe('bounded drain (WS31 pool, cap 4)', () => {
  test('never exceeds DRAIN_CAP in flight, but attempts every op', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const resolvers = [];
    const runner = vi.fn(() => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      return new Promise(res => resolvers.push(() => { inFlight -= 1; res(true); }));
    });
    const ops = Array.from({ length: 10 }, (_, i) => enq(`s${i}`));
    const pending = attemptOps(ops, runner);
    let settled = false;
    pending.then(() => { settled = true; });
    while (!settled) {
      if (resolvers.length) resolvers.splice(0).forEach(fn => fn());
      await Promise.resolve();
    }
    await pending;
    expect(maxInFlight).toBe(DRAIN_CAP);
    expect(runner).toHaveBeenCalledTimes(10);
    expect(peekOps()).toHaveLength(0); // all done → pruned
  });

  test('a successful attempt prunes the op and its payload from the mirror', async () => {
    enq('s1');
    await drainReady(okRunner);
    expect(peekOps()).toHaveLength(0);
    expect(peekPayloads()).toEqual({});
    expect(JSON.parse(localStorage.getItem(MIRROR_KEY)).ops).toHaveLength(0);
  });
});

describe('backoff + park', () => {
  test('failed attempts back off 1s/5s/30s then park as failed', async () => {
    const op = enq('s1');

    await attemptOps([op], failRunner);
    expect(op.status).toBe('queued');
    expect(op.attempts).toBe(1);
    expect(op.nextAttemptAt).toBe(now + 1000);
    expect(readyOps()).toHaveLength(0); // not ready until the clock advances

    now = op.nextAttemptAt;
    await drainReady(failRunner);
    expect(op.attempts).toBe(2);
    expect(op.nextAttemptAt).toBe(now + 5000);

    now = op.nextAttemptAt;
    await drainReady(failRunner);
    expect(op.attempts).toBe(3);
    expect(op.nextAttemptAt).toBe(now + 30000);

    now = op.nextAttemptAt;
    await drainReady(failRunner);
    expect(op.attempts).toBe(4);
    expect(op.status).toBe('failed'); // ladder exhausted → parked
    expect(getStatus()).toMatchObject({ failed: 1, queued: 0 });
  });

  test('a wired scheduler is asked to retry after the backoff delay', async () => {
    const scheduled = [];
    setOutboxScheduler((fn, delayMs) => scheduled.push({ fn, delayMs }));
    await attemptOps([enq('s1')], failRunner);
    expect(scheduled).toHaveLength(1);
    expect(scheduled[0].delayMs).toBe(1000);
  });

  test('reviveAllPending resets parked ops for a fresh drain (the Retry affordance)', async () => {
    const op = enq('s1');
    // Burn through the ladder to park it.
    for (const t of [0, 1000, 6000, 36000]) {
      now = 1_000_000 + t;
      await drainReady(failRunner);
    }
    expect(op.status).toBe('failed');

    const revived = reviveAllPending();
    expect(revived).toHaveLength(1);
    expect(op).toMatchObject({ status: 'queued', attempts: 0, nextAttemptAt: 0 });

    await drainReady(okRunner);
    expect(peekOps()).toHaveLength(0);
    expect(getStatus()).toMatchObject({ queued: 0, failed: 0 });
  });

  test('reviveAllPending also force-readies a still-backing-off op (not only parked)', async () => {
    const op = enq('s1');
    await drainReady(failRunner);          // one failure → queued, backing off 1s
    expect(op.status).toBe('queued');
    expect(op.nextAttemptAt).toBeGreaterThan(now);
    expect(readyOps()).toHaveLength(0);    // not ready yet

    reviveAllPending();                    // Retry forces it ready now
    expect(readyOps()).toHaveLength(1);
    await drainReady(okRunner);
    expect(peekOps()).toHaveLength(0);
  });
});

describe('barrier ordering', () => {
  test('a barrier clears once no predecessor is in flight, then prunes', async () => {
    const resolvers = [];
    const runner = vi.fn(() => new Promise(res => resolvers.push(() => res(true))));
    const ops = ['a', 'b'].map(id => enq(id));
    const barrier = enqueueBarrier();
    expect(barrier.kind).toBe(OP_KIND_BARRIER);

    const pending = attemptOps(ops, runner);
    await Promise.resolve();
    // Members are inflight → the barrier must not clear yet.
    expect(resolveBarrier(barrier)).toBe(false);

    resolvers.forEach(fn => fn());
    await pending;
    // Members settled (none inflight) → the barrier clears and is pruned.
    expect(resolveBarrier(barrier)).toBe(true);
    expect(peekOps().some(o => o.kind === OP_KIND_BARRIER)).toBe(false);
  });
});

describe('mirror: tolerant + bounded', () => {
  test('a corrupt mirror is discarded (fresh queue, no crash) and scrubbed', () => {
    localStorage.setItem(MIRROR_KEY, '{not valid json');
    expect(() => loadMirror()).not.toThrow();
    expect(peekOps()).toHaveLength(0);
    expect(localStorage.getItem(MIRROR_KEY)).toBeNull();
  });

  test('an incompatible schema version is rejected as a fresh queue', () => {
    localStorage.setItem(MIRROR_KEY, JSON.stringify({ version: 999, ops: [{ saveId: 'x' }] }));
    loadMirror();
    expect(peekOps()).toHaveLength(0);
  });

  test('missing localStorage is tolerated (in-memory queue still works)', async () => {
    delete globalThis.localStorage;
    resetOutbox();
    enq('s1');
    expect(peekOps().filter(o => o.kind !== OP_KIND_BARRIER)).toHaveLength(1);
    await drainReady(okRunner);
    expect(peekOps()).toHaveLength(0);
    installLocalStorage(); // restore for afterEach symmetry
  });

  test('the op list is size-bounded (oldest superseded/pruned past the cap)', () => {
    // 250 distinct saves > MAX_QUEUED (200): the queue caps and drops the oldest.
    for (let i = 0; i < 250; i++) enq(`s${i}`);
    const live = peekOps().filter(o => o.kind !== OP_KIND_BARRIER);
    expect(live.length).toBe(200);
    // The oldest ids were dropped; the newest survive.
    expect(live.some(o => o.saveId === 's0')).toBe(false);
    expect(live.some(o => o.saveId === 's249')).toBe(true);
    // Dropped ops' payloads are garbage-collected too (no orphan blobs).
    expect(Object.keys(peekPayloads())).toHaveLength(200);
  });
});

describe('boot replay from the mirror (dead-tab crash-safety)', () => {
  test('a pending op survives a simulated reload and re-drains against the payload cache', async () => {
    // A prior tab enqueued a write that never reached the cloud, then died.
    enq('s1', 'settlement', { blob: 'unsynced' });
    expect(JSON.parse(localStorage.getItem(MIRROR_KEY)).ops).toHaveLength(1);

    // Fresh boot: in-memory state is gone; loadMirror repopulates from disk.
    loadMirror();
    const [op] = peekOps();
    expect(op.saveId).toBe('s1');
    expect(op.nextAttemptAt).toBe(0);       // parked-on-disk ops boot immediately ready
    expect(peekPayloads()['s1:settlement']).toEqual({ blob: 'unsynced' });

    // Boot replay drains it; the runner receives the durable payload.
    const seen = [];
    await drainReady(async (o, payload) => { seen.push(payload); return true; });
    expect(seen).toEqual([{ blob: 'unsynced' }]);
    expect(peekOps()).toHaveLength(0);
  });

  test('barriers are not replayed (intra-session ordering markers only)', () => {
    enq('s1');
    enqueueBarrier();
    loadMirror();
    expect(peekOps().some(o => o.kind === OP_KIND_BARRIER)).toBe(false);
    expect(peekOps().filter(o => o.kind !== OP_KIND_BARRIER)).toHaveLength(1);
  });
});
