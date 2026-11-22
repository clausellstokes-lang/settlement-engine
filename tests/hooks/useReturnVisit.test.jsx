/**
 * @vitest-environment jsdom
 *
 * tests/hooks/useReturnVisit.test.jsx — return-detection contract (review C6).
 *
 * The finding: return detection keyed ONLY off the device-local localStorage
 * stamp (`sf:last_visit_at`), so a cross-device return, a cleared cache, or a
 * private window read prior=null and the return went silently unrewarded. The
 * fix: when this device has no stamp, a signed-in user's most-recent
 * cloud-synced save timestamp stands in as the prior-visit evidence. Pins:
 *   1. stamp-based detection still works (the original path),
 *   2. no stamp + old cloud save ⇒ isReturn (the cross-device fix),
 *   3. a fresh stamp beats an old save (the stamp refreshes every load),
 *   4. anon stays excluded by design (the card resumes a saved settlement),
 *   5. no stamp + no saves ⇒ quiet first visit,
 *   6. mount re-stamps the visit, and the fallback path fires the
 *      RETURN_VISIT_DETECTED funnel event exactly once.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  track: vi.fn(),
  storeState: {
    savedSettlements: /** @type {any[]} */ ([]),
    auth: { tier: 'free' },
  },
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(mocks.storeState),
}));
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { track: mocks.track },
  EVENTS: { RETURN_VISIT_DETECTED: 'return_visit_detected' },
}));

import { useReturnVisit } from '../../src/hooks/useReturnVisit.js';

const STORAGE_KEY = 'sf:last_visit_at';
const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-07-21T12:00:00Z');

/** A saved-settlement row shaped like the savedSettlements slice entries. */
function saveRow(id, ts, { iso = false } = {}) {
  return iso
    ? { id, settlement: { name: id }, campaignState: { editedAt: new Date(ts).toISOString() } }
    : { id, settlement: { name: id }, savedAt: ts };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(NOW));
  localStorage.clear();
  mocks.track.mockClear();
  mocks.storeState.savedSettlements = [];
  mocks.storeState.auth = { tier: 'free' };
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('useReturnVisit', () => {
  test('stamp path: a 3-day-old device stamp reads as a return', () => {
    localStorage.setItem(STORAGE_KEY, String(NOW - 3 * DAY));
    const { result } = renderHook(() => useReturnVisit());
    expect(result.current.isReturn).toBe(true);
    expect(result.current.daysSinceLastVisit).toBe(3);
  });

  test('cross-device fallback: no stamp, 5-day-old cloud save ⇒ return', () => {
    mocks.storeState.savedSettlements = [saveRow('fen-hollow', NOW - 5 * DAY)];
    const { result } = renderHook(() => useReturnVisit());
    expect(result.current.isReturn).toBe(true);
    expect(result.current.daysSinceLastVisit).toBe(5);
    expect(result.current.lastSettlement?.id).toBe('fen-hollow');
    // The fallback-detected return still lands in the funnel, once.
    expect(mocks.track).toHaveBeenCalledTimes(1);
    expect(mocks.track).toHaveBeenCalledWith('return_visit_detected', {
      daysSinceLastVisit: 5,
      hasLastSettlement: true,
    });
  });

  test('fallback ranks editedAt (ISO) over savedAt (epoch) across saves', () => {
    mocks.storeState.savedSettlements = [
      saveRow('older', NOW - 9 * DAY),
      saveRow('newer', NOW - 2 * DAY, { iso: true }),
    ];
    const { result } = renderHook(() => useReturnVisit());
    expect(result.current.lastSettlement?.id).toBe('newer');
    expect(result.current.isReturn).toBe(true);
    expect(result.current.daysSinceLastVisit).toBe(2);
  });

  test('a fresh stamp beats an old save: same-day visit is not a return', () => {
    localStorage.setItem(STORAGE_KEY, String(NOW - 60 * 60 * 1000));
    mocks.storeState.savedSettlements = [saveRow('fen-hollow', NOW - 10 * DAY)];
    const { result } = renderHook(() => useReturnVisit());
    expect(result.current.isReturn).toBe(false);
    expect(mocks.track).not.toHaveBeenCalled();
  });

  test('anon stays excluded by design, even with an old local save', () => {
    mocks.storeState.auth = { tier: 'anon' };
    mocks.storeState.savedSettlements = [saveRow('fen-hollow', NOW - 10 * DAY)];
    const { result } = renderHook(() => useReturnVisit());
    expect(result.current.isReturn).toBe(false);
    expect(mocks.track).not.toHaveBeenCalled();
  });

  test('no stamp + no saves ⇒ quiet first visit, and mount re-stamps', () => {
    const { result } = renderHook(() => useReturnVisit());
    expect(result.current.isReturn).toBe(false);
    expect(result.current.daysSinceLastVisit).toBe(0);
    expect(result.current.lastSettlement).toBe(null);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(String(NOW));
  });
});
