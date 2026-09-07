/**
 * tests/lib/debounce.test.js — Tier 3.8 coverage.
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle } from '../../src/lib/debounce.js';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(()  => { vi.useRealTimers(); });

describe('debounce()', () => {
  test('only fires once after rapid calls within the delay window', () => {
    const spy = vi.fn();
    const d = debounce(spy, 100);
    d('a'); d('b'); d('c');
    vi.advanceTimersByTime(99);
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('c');
  });

  test('fires twice when calls are separated by more than the delay', () => {
    const spy = vi.fn();
    const d = debounce(spy, 50);
    d('x');
    vi.advanceTimersByTime(100);
    d('y');
    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('default delay is 300ms', () => {
    const spy = vi.fn();
    const d = debounce(spy);
    d('x');
    vi.advanceTimersByTime(299);
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2);
    expect(spy).toHaveBeenCalled();
  });
});

describe('throttle() — leading + trailing edge', () => {
  test('first call fires immediately (leading edge)', () => {
    const spy = vi.fn();
    const t = throttle(spy, 100);
    t('a');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('a');
  });

  test('fires the leading call immediately and the LAST in-window call on the trailing edge', () => {
    const spy = vi.fn();
    const t = throttle(spy, 100);
    // Burst of three within one window: leading 'a' fires now, 'b'/'c' are
    // coalesced and the LAST ('c') fires when the window closes.
    t('a'); t('b'); t('c');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('a');

    // Trailing edge — the final call in the burst is NOT dropped (the fix).
    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('c');
  });

  test('a lone leading call does NOT double-fire on the trailing edge', () => {
    const spy = vi.fn();
    const t = throttle(spy, 100);
    t('a');
    vi.advanceTimersByTime(100);
    // No call arrived during the window, so nothing trails.
    expect(spy).toHaveBeenCalledTimes(1);
    // …and the window has fully closed: the next call is a fresh leading edge.
    t('b');
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('b');
  });

  test('calls spaced beyond the limit each fire on their own leading edge', () => {
    const spy = vi.fn();
    const t = throttle(spy, 100);
    t('a');
    vi.advanceTimersByTime(150);
    t('b');
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('b');
  });

  test('cancel() drops a pending trailing call', () => {
    const spy = vi.fn();
    const t = throttle(spy, 100);
    t('a'); t('b'); // 'a' leads, 'b' is pending for the trailing edge
    expect(spy).toHaveBeenCalledTimes(1);
    t.cancel();
    vi.advanceTimersByTime(200);
    // The trailing 'b' was cancelled — still only the leading call ran.
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('a');
  });

  test('default limit is 300ms', () => {
    const spy = vi.fn();
    const t = throttle(spy);
    t('a'); t('b');
    vi.advanceTimersByTime(299);
    // Still inside the 300ms window: only the leading 'a' has fired.
    expect(spy).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(2);
    // Window closed → trailing 'b' fires.
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('b');
  });
});
