/**
 * tests/lib/debounce.test.js - Tier 3.8 coverage.
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

describe('throttle()', () => {
  test('first call fires immediately', () => {
    const spy = vi.fn();
    const t = throttle(spy, 100);
    t('a');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('calls within the limit are dropped', () => {
    const spy = vi.fn();
    const t = throttle(spy, 100);
    t('a'); t('b'); t('c');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('a');
  });

  test('calls after the limit fire again', () => {
    const spy = vi.fn();
    const t = throttle(spy, 100);
    t('a');
    vi.advanceTimersByTime(150);
    t('b');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('default limit is 300ms', () => {
    const spy = vi.fn();
    const t = throttle(spy);
    t('a'); t('b');
    vi.advanceTimersByTime(299);
    t('c');
    expect(spy).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(2);
    t('d');
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
