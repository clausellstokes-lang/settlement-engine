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
vi.mock('../../src/lib/consent.js', () => ({ getConsent: () => ({ essential: true, research: true }) }));

import {
  enqueueEvent, enqueueSnapshot, flush, debugSnapshot, __resetQueueForTests,
} from '../../src/lib/analyticsQueue.js';

beforeEach(() => {
  __resetQueueForTests();
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
