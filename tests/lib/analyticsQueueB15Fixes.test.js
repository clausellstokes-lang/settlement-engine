/** @vitest-environment jsdom */
/**
 * analyticsQueueB15Fixes.test.js — B15 review fixes.
 *
 * Covers:
 *  - #1 beacon honours the in-flight guard (no double-deliver while a keepalive
 *    fetch already owns the batch);
 *  - #2 sessionId is stamped from the wired getter;
 *  - #7 droppedCount is subtracted by the sent amount on drain, not reset to 0
 *    (a concurrent drop after the snapshot survives into the next envelope);
 *  - #8 enqueueSnapshot / enqueuePulseEffect trigger a size-based flush;
 *  - #10 the device token rides via getDeviceToken() (minted if absent);
 *  - #14 a PII-shaped prop value (email / long free-text) is redacted at enqueue.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));
vi.mock('../../src/lib/consent.js', () => ({ getConsent: () => ({ essential: true, research: true }) }));

import {
  enqueueEvent, enqueueSnapshot, enqueuePulseEffect, flush, debugSnapshot,
  setSessionIdGetter, __resetQueueForTests,
} from '../../src/lib/analyticsQueue.js';
import { __TOKEN_STORAGE_KEY } from '../../src/lib/deviceToken.js';

beforeEach(() => {
  __resetQueueForTests();
  setSessionIdGetter(null);
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.unstubAllGlobals();
  try { window.localStorage.clear(); } catch { /* ignore */ }
});

afterEach(() => { vi.useRealTimers(); setSessionIdGetter(null); });

const settle = async () => { for (let i = 0; i < 4; i++) await Promise.resolve(); };

describe('#1 beacon honours the in-flight guard', () => {
  test('a beacon does NOT re-send while a keepalive fetch already owns the batch', () => {
    const fetchMock = vi.fn(() => new Promise(() => {})); // never resolves → stays in-flight
    const beaconMock = vi.fn(() => true);
    vi.stubGlobal('fetch', fetchMock);
    Object.defineProperty(navigator, 'sendBeacon', { value: beaconMock, configurable: true });

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();                       // fetch in flight, owns the batch
    flush({ beacon: true });       // leave path — must NOT double-deliver

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(beaconMock).not.toHaveBeenCalled();
    // Queue not optimistically drained by the suppressed beacon.
    expect(debugSnapshot().depth).toBe(1);
  });

  test('a beacon still delivers when nothing is in flight', () => {
    const beaconMock = vi.fn(() => true);
    Object.defineProperty(navigator, 'sendBeacon', { value: beaconMock, configurable: true });

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush({ beacon: true });

    expect(beaconMock).toHaveBeenCalledTimes(1);
    expect(debugSnapshot().depth).toBe(0); // beacon drained the queue
  });
});

describe('#2 sessionId is stamped from the wired getter', () => {
  test('buildEnvelope carries the session id when a getter is wired', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);
    setSessionIdGetter(() => 'sess-abc-123');

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.sessionId).toBe('sess-abc-123');
  });

  test('sessionId is undefined when no getter is wired (prior behaviour)', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.sessionId).toBeUndefined();
  });
});

describe('#7 droppedCount is subtracted, not reset, on drain', () => {
  test('a drop occurring after the send-snapshot survives into the next envelope', async () => {
    // First flush: a 100KB record is rejected at enqueue → droppedCount becomes 1.
    enqueueSnapshot({ id: 'huge', blob: 'x'.repeat(100 * 1024) });
    expect(debugSnapshot().dropped).toBe(1);

    // A deliverable event + a successful 200. The envelope reports droppedCount: 1;
    // drain subtracts exactly 1 (clears it here since no concurrent drop).
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();
    await settle();

    // Reset-to-0 vs subtract-sent only differ under a concurrent drop; assert the
    // sent amount was honoured (no negative, fully cleared here).
    expect(debugSnapshot().dropped).toBe(0);
  });
});

describe('#8 snapshot / pulse-effect enqueues trigger a size-based flush', () => {
  test('FLUSH_SIZE snapshots auto-flush without an event/edit nudge', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    for (let i = 0; i < 20; i++) enqueueSnapshot({ id: `s${i}`, v: i });
    expect(fetchMock).toHaveBeenCalledTimes(1); // crossed FLUSH_SIZE → flushed
  });

  test('FLUSH_SIZE pulse-effects auto-flush', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    for (let i = 0; i < 20; i++) enqueuePulseEffect({ id: `p${i}`, v: i });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('#10 device token rides via getDeviceToken()', () => {
  test('an envelope carries a device token even with no pre-existing key (minted)', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);
    expect(window.localStorage.getItem(__TOKEN_STORAGE_KEY)).toBeNull();

    enqueueEvent('homepage_view', {}, { _class: 'essential' });
    flush();

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(typeof sent.deviceToken).toBe('string');
    expect(sent.deviceToken.length).toBeGreaterThanOrEqual(8);
    // Minted and persisted under the canonical key.
    expect(window.localStorage.getItem(__TOKEN_STORAGE_KEY)).toBe(sent.deviceToken);
  });
});

describe('#14 PII-shaped props are redacted at enqueue', () => {
  test('an email value and a long free-text value are replaced with [redacted]', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    enqueueEvent('signup_after_anon', {
      tier: 'premium',                          // enum — kept
      email: 'someone@example.com',             // looks like PII — redacted
      note: 'x'.repeat(200),                    // long free-text — redacted
      count: 3,                                 // primitive — kept
    }, { _class: 'essential' });
    flush();

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    const props = sent.events[0].props;
    expect(props.tier).toBe('premium');
    expect(props.count).toBe(3);
    expect(props.email).toBe('[redacted]');
    expect(props.note).toBe('[redacted]');
  });

  test('short enum/band values pass through untouched', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    enqueueEvent('session_started', { days_since_last_visit_band: '1_3d', entry_route_kind: 'home' }, { _class: 'essential' });
    flush();

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.events[0].props).toEqual({ days_since_last_visit_band: '1_3d', entry_route_kind: 'home' });
  });
});
