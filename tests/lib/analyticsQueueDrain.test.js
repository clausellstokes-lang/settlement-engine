/**
 * analyticsQueueDrain.test.js — drain-by-identity (concurrency, LOW).
 *
 * flush() snapshots the queue, POSTs it, then on success removes the sent records.
 * The old drain removed by COUNT from the front (splice(0, n)). Any record enqueued
 * DURING the in-flight fetch — or a front-shifting capQueue() drop-oldest between
 * send and drain — made splice(0, n) remove the WRONG records and silently drop
 * newly-enqueued events. drain() now removes exactly the sent records by IDENTITY,
 * so a concurrent enqueue is never lost.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));
vi.mock('../../src/lib/consent.js', () => ({ getConsent: () => ({ essential: true, research: true }) }));

import {
  enqueueEvent, flush, debugSnapshot, __resetQueueForTests,
} from '../../src/lib/analyticsQueue.js';

beforeEach(() => {
  __resetQueueForTests();
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.unstubAllGlobals();
});

afterEach(() => { vi.useRealTimers(); });

// Drain microtasks so the fetch promise's .then (drain) runs.
const settle = async () => { for (let i = 0; i < 4; i++) await Promise.resolve(); };

describe('drain removes the SENT records by identity, not the front N', () => {
  test('an event enqueued DURING an in-flight flush survives the drain', async () => {
    // Resolve the fetch only after the test enqueues a second event mid-flight, so the
    // .then(drain) runs against a queue that grew while the POST was in flight.
    let resolveFetch;
    const fetchMock = vi.fn(() => new Promise(r => { resolveFetch = r; }));
    vi.stubGlobal('fetch', fetchMock);

    enqueueEvent('homepage_view', { n: 1 }, { _class: 'essential' }); // will be sent
    flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Concurrent enqueue while the fetch is still in flight.
    enqueueEvent('generation_completed', { n: 2 }, { _class: 'essential' }); // must NOT be lost
    expect(debugSnapshot().depth).toBe(2);

    resolveFetch({ ok: true });
    await settle();

    // Old code: splice(0, 1) drops the FIRST record (the just-enqueued one survives
    // here by luck, since the sent record is also at the front). The real loss shows
    // under a front-shift — see the next test — but depth must still be exactly 1.
    expect(debugSnapshot().depth).toBe(1);
  });

  test('a capQueue drop-oldest during the in-flight fetch does not drop a fresh event', async () => {
    let resolveFetch;
    const fetchMock = vi.fn(() => new Promise(r => { resolveFetch = r; }));
    vi.stubGlobal('fetch', fetchMock);

    // Send a single event.
    enqueueEvent('homepage_view', { sent: true }, { _class: 'essential' }); // the sent record
    flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // While in flight, push the queue PAST MAX_RECORDS (300) so capQueue() drops the
    // oldest — which is precisely the in-flight sent record — front-shifting the lane.
    // Every record here is enqueued AFTER the snapshot and must survive the drain.
    for (let i = 0; i < 300; i++) enqueueEvent('generation_completed', { fresh: i }, { _class: 'essential' });

    resolveFetch({ ok: true });
    await settle();

    const snap = debugSnapshot();
    // Identity drain: the sent record was already shifted out by capQueue, so drain
    // removes nothing extra. Count drain would splice(0, 1) off the FRONT, destroying
    // a fresh record that was never delivered.
    expect(snap.depth).toBe(300);

    // Prove the survivors are the FRESH events, not a corrupted set: flush again and
    // read the envelope. None of them is the original sent record.
    let body = null;
    const fetchMock2 = vi.fn((_u, opts) => { body = opts.body; return new Promise(() => {}); });
    vi.stubGlobal('fetch', fetchMock2);
    flush();
    const env = JSON.parse(body);
    expect(env.events.every(e => e.props && e.props.fresh !== undefined)).toBe(true);
    expect(env.events.some(e => e.props && e.props.sent === true)).toBe(false);
  });
});
