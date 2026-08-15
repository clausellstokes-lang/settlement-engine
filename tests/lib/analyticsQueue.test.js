/**
 * analyticsQueue.test.js — A+ P0.3.
 *
 * The first-party queue must never permanently wedge: (1) an oversize envelope is
 * FORCE-DRAINED to fit the byte ceiling instead of the old no-op early-return that
 * could stall delivery forever; (2) overlapping flushes are guarded so the batch
 * isn't double-POSTed; (3) a single oversize record is rejected at enqueue.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));
// Mutable consent so a test can revoke research mid-flight (lib-infra-2 purge pin).
const _h = vi.hoisted(() => ({ consent: { essential: true, research: true, market: false } }));
vi.mock('../../src/lib/consent.js', () => ({ getConsent: () => _h.consent }));

import {
  enqueueEvent, enqueueSnapshot, flush, flushOnLeave, debugSnapshot, setAnalyticsElevated,
  setAnalyticsSessionId, __resetQueueForTests, __loadFlushForTests, __unloadFlushForTests,
} from '../../src/lib/analyticsQueue.js';
// The flush-time half of the eager-leaf/lazy-applier split — the cap lives there.
import { MAX_SNAPSHOTS_PER_ENVELOPE } from '../../src/lib/analyticsFlush.js';

beforeEach(async () => {
  // Resolve the lazy flush module up front so flush() delegates synchronously in
  // each test (production primes it on first enqueue; the not-yet-loaded path is
  // pinned explicitly via __unloadFlushForTests below).
  await __loadFlushForTests();
  __resetQueueForTests();
  _h.consent = { essential: true, research: true, market: false }; // restore default consent
  setAnalyticsSessionId(null); // clear any cross-test session-id getter
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.unstubAllGlobals();
});

afterEach(() => { vi.useRealTimers(); });

// Drain microtasks so a fetch promise's .then/.catch (drain / scheduleRetry) runs
// even under fake timers.
const settle = async () => { for (let i = 0; i < 4; i++) await Promise.resolve(); };

describe('in-flight guard', () => {
  test('overlapping flushes POST the batch only once', () => {
    const fetchMock = vi.fn(() => new Promise(() => {})); // never resolves → stays in-flight
    vi.stubGlobal('fetch', fetchMock);

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();
    flush(); // should bail — a flush is already in flight

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('success drains the queue', () => {
  test('a 200 drains, and the next flush sends fresh events', async () => {
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();
    await Promise.resolve(); await Promise.resolve(); // let the .then run
    expect(debugSnapshot().depth).toBe(0);

    enqueueEvent('generation_completed', {}, { _class: 'essential' });
    flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('oversize envelope is force-drained, never a no-op stall', () => {
  test('a >256KB backlog still POSTs a <=256KB body (largest records dropped)', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    // ~30KB each, within the 64KB per-record cap, but ~12 of them = ~360KB > 256KB.
    for (let i = 0; i < 12; i++) {
      enqueueSnapshot({ id: `s${i}`, blob: 'x'.repeat(30 * 1024) });
    }
    flush();

    // The old code would capQueue() (count is fine: 12 < 300) and return WITHOUT
    // calling fetch — a permanent stall. Now it force-drains and sends.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const sentBody = fetchMock.mock.calls[0][1].body;
    expect(sentBody.length).toBeLessThanOrEqual(256 * 1024);
    expect(debugSnapshot().dropped).toBeGreaterThan(0);
  });
});

describe('force-drain preserves essential events over research data', () => {
  test('research records are shed before essential events under byte pressure', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    enqueueEvent('homepage_view', { a: 1 }, { _class: 'essential' });
    enqueueEvent('generation_completed', { a: 2 }, { _class: 'essential' });
    enqueueEvent('world_pulse_advanced', { a: 3 }, { _class: 'essential' });
    for (let i = 0; i < 12; i++) enqueueSnapshot({ id: `s${i}`, blob: 'x'.repeat(30 * 1024) });

    flush();

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.events.length).toBe(3);          // all essential events preserved
    expect(sent.droppedCount).toBeGreaterThan(0); // research snapshots shed to fit
  });
});

describe('per-record cap rejects an oversize record at enqueue', () => {
  test('a record larger than 64KB is dropped, not queued', () => {
    enqueueSnapshot({ id: 'huge', blob: 'x'.repeat(100 * 1024) });
    expect(debugSnapshot().depth).toBe(0);
    expect(debugSnapshot().dropped).toBe(1);
  });
});

describe('provenance corpus stamp (PHASE6_DATA_LIFECYCLE.md §1)', () => {
  const VALID = ['synthetic', 'dogfood', 'production'];
  const flushAndReadCorpus = () => {
    const fetchMock = vi.fn(() => new Promise(() => {})); // stay in-flight
    vi.stubGlobal('fetch', fetchMock);
    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();
    return JSON.parse(fetchMock.mock.calls[0][1].body).corpus;
  };

  test('every emitted envelope carries a valid corpus stamp', () => {
    expect(VALID).toContain(flushAndReadCorpus());
  });

  test('under the vitest/e2e harness the stamp is synthetic (detection is wired, not hardcoded)', () => {
    // import.meta.env.MODE === 'test' (+ process.env.VITEST) is the synthetic signal.
    expect(flushAndReadCorpus()).toBe('synthetic');
  });

  test('synthetic precedence: an elevated actor under a synthetic run still stamps synthetic', () => {
    setAnalyticsElevated(() => true);
    try {
      expect(flushAndReadCorpus()).toBe('synthetic');
    } finally {
      setAnalyticsElevated(null);
    }
  });

  test('outside a synthetic context: elevated → dogfood, everyone else → production', () => {
    // Turn OFF the synthetic signals so the dogfood/production branch is reached.
    vi.stubEnv('MODE', 'production');
    const origVitest = process.env.VITEST;
    delete process.env.VITEST;
    try {
      expect(flushAndReadCorpus()).toBe('production');

      __resetQueueForTests();
      setAnalyticsElevated(() => true);
      expect(flushAndReadCorpus()).toBe('dogfood');
    } finally {
      setAnalyticsElevated(null);
      if (origVitest !== undefined) process.env.VITEST = origVitest;
      vi.unstubAllEnvs();
    }
  });
});

describe('retry timer lifecycle (A+ lib.4b/lib.5)', () => {
  test('a successful flush cancels a pending backoff retry (no double-fire)', async () => {
    vi.useFakeTimers();
    let n = 0;
    const fetchMock = vi.fn(() => (++n === 1 ? Promise.reject(new Error('net')) : Promise.resolve({ ok: true })));
    vi.stubGlobal('fetch', fetchMock);

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();                       // call 1 → rejects → schedules a backoff retry
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await settle();                // .catch runs: scheduleRetry sets _retryTimer, _inFlight cleared

    flush();                       // call 2 → 200 → drain() must cancel the pending retry
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await settle();

    enqueueEvent('generation_completed', {}, { _class: 'essential' }); // queue non-empty again
    // Advance past the 1s retry backoff but under the 30s flush interval, so only a
    // LEAKED retry could fire here. Cancelled on drain → no call 3.
    vi.advanceTimersByTime(2_000);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('reset cancels a pending retry so it cannot flush into the next test', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(() => Promise.reject(new Error('net')));
    vi.stubGlobal('fetch', fetchMock);

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();                       // call 1 → rejects → schedules retry
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await settle();

    __resetQueueForTests();        // must clear the pending retry timer (+ spill timer)
    enqueueEvent('generation_completed', {}, { _class: 'essential' });
    // Past the 1s retry backoff, under the 30s interval — a leaked retry would
    // flush() the new event here → call 2. Cleared by reset → stays 1.
    vi.advanceTimersByTime(2_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('consent purge — research snapshots (lib-infra-2)', () => {
  test('a snapshot carrying a `structural` payload is purged on research revoke; a product one survives', () => {
    const fetchMock = vi.fn(() => new Promise(() => {})); // stay in-flight so purge runs but no drain
    vi.stubGlobal('fetch', fetchMock);

    // A research snapshot carries a `structural` payload (researchCapture only builds it
    // under research consent, alongside research-tier hot columns) — the flush-time purge
    // keys on that payload directly. A product snapshot has none and must legitimately
    // survive a research revocation.
    enqueueSnapshot({ settlementUuid: 'u-research', capturePoint: 'saved', structural: { power: {} }, fingerprintHash: 'h1' });
    enqueueSnapshot({ settlementUuid: 'u-product', capturePoint: 'saved', fingerprintHash: 'h2' });

    _h.consent = { essential: true, research: false, market: false }; // user revokes research
    flush(); // purgeRevoked runs inside flush before the envelope is built

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    const uuids = sent.snapshots.map((s) => s.settlementUuid);
    expect(uuids).toContain('u-product');     // product-tier snapshot survives revocation
    expect(uuids).not.toContain('u-research'); // research-tier snapshot is purged
  });
});

describe('snapshot cap per envelope (lib-infra-3)', () => {
  test('buildEnvelope caps snapshots at MAX_SNAPSHOTS_PER_ENVELOPE; the overflow stays queued', async () => {
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    const OVERFLOW = 5;
    const N = MAX_SNAPSHOTS_PER_ENVELOPE + OVERFLOW;
    for (let i = 0; i < N; i++) {
      enqueueSnapshot({ settlementUuid: `u${i}`, capturePoint: 'exported', fingerprintHash: `h${i}` });
    }
    flush();

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.snapshots.length).toBe(MAX_SNAPSHOTS_PER_ENVELOPE); // capped, never all N
    await settle();
    // The overflow beyond the cap is NOT dropped by drain — it survives for the next flush.
    expect(debugSnapshot().depth).toBe(OVERFLOW);
  });
});

describe('sessionId envelope stamp (lib-infra-5)', () => {
  test('a registered getter overrides the built-in default', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    setAnalyticsSessionId(() => 'sess-123');
    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).sessionId).toBe('sess-123');
  });

  test('with no getter registered, the lazy flush half stamps the built-in lib/sessionId id', () => {
    // The default is analyticsFlush's own import of lib/sessionId.js (zero eager
    // bytes) — give it a sessionStorage to mint into and assert the stamp is real.
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);
    const store = new Map();
    vi.stubGlobal('sessionStorage', {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    });

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();
    const sid = JSON.parse(fetchMock.mock.calls[0][1].body).sessionId;
    expect(typeof sid).toBe('string');
    expect(sid.length).toBeGreaterThan(0);
  });

  test('a throwing session-id getter never breaks transport (envelope still sends)', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    setAnalyticsSessionId(() => { throw new Error('boom'); });
    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).sessionId).toBeUndefined();
  });
});

describe('pagehide before the flush module resolves — synchronous spill, no loss', () => {
  test('flushOnLeave falls back to an immediate spill write when the lazy half is not loaded', () => {
    // Simulate the narrow first-enqueue-to-module-load window at pagehide: the
    // enqueue primes the import (unresolved at this tick), the user leaves, and the
    // backlog must be PERSISTED synchronously — not lost to an import that will
    // never resolve on a dying page. It restores + delivers on the next boot.
    __unloadFlushForTests();
    const store = new Map();
    vi.stubGlobal('localStorage', {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    });
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flushOnLeave(); // module not loaded → must spill synchronously, not beacon/fetch

    const spilled = JSON.parse(store.get('sf_evt_queue_v1'));
    expect(spilled.events.length).toBe(1);
    expect(spilled.events[0].event).toBe('homepage_view');
    expect(fetchMock).not.toHaveBeenCalled(); // nothing raced onto the network
  });
});

describe('subjectId envelope stamp (A2 deferral — the k=200-campaigns floor)', () => {
  // The campaign-grain v2 events (world_pulse_advanced / world_canonized) now pass a
  // { subjectId: campaignId } opts to track(); track forwards it to enqueueEvent, which
  // stashes it on the record, and buildEnvelope surfaces it as events[i].subjectId. The
  // ingest fn then uuid-validates it into the subject_id column so the sellable market
  // reports' distinct-campaign floor can form cells. This pins the client half of that
  // seam end to end (enqueue → envelope).
  test('enqueueEvent(opts.subjectId) surfaces on the POSTed envelope event', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    const CAMPAIGN_UUID = '11111111-1111-4111-8111-111111111111';
    enqueueEvent('world_pulse_advanced', { events_applied_count: 0 }, { _class: 'essential', subjectId: CAMPAIGN_UUID });
    flush();

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.events).toHaveLength(1);
    expect(sent.events[0].event).toBe('world_pulse_advanced');
    expect(sent.events[0].subjectId).toBe(CAMPAIGN_UUID);
  });

  test('an event enqueued without a subjectId omits it (undefined, not null) — legacy shape preserved', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.events[0].subjectId).toBeUndefined();
  });
});
