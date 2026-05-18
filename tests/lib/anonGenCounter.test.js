/** @vitest-environment jsdom */
/**
 * tests/lib/anonGenCounter.test.js — Anonymous gen counter contract.
 *
 * The counter governs the homepage hero's "free generations" gate.
 * Edge cases that matter:
 *   - Day rolls reset the counter (without requiring an extra reset call)
 *   - Reading the count does not persist anything
 *   - Cap helpers respect a custom cap (so flag-driven overrides work)
 *   - Private-mode / quota errors don't blow up
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getAnonGenCount, anonGensRemaining, anonAtCap,
  incrementAnonGen, resetAnonGenCounter, DEFAULT_DAILY_CAP,
} from '../../src/lib/anonGenCounter.js';

beforeEach(() => {
  resetAnonGenCounter();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('getAnonGenCount()', () => {
  it('returns 0 when nothing stored', () => {
    expect(getAnonGenCount()).toBe(0);
  });

  it('returns the persisted count for today', () => {
    incrementAnonGen();
    incrementAnonGen();
    expect(getAnonGenCount()).toBe(2);
  });

  it('returns 0 if the stored date is not today (without persisting)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T12:00:00'));
    incrementAnonGen();
    expect(getAnonGenCount()).toBe(1);

    vi.setSystemTime(new Date('2026-01-02T08:00:00'));
    expect(getAnonGenCount()).toBe(0);
    // Storage still holds yesterday's row — read-only access doesn't write.
    const raw = JSON.parse(window.localStorage.getItem('sf.anon.gens'));
    expect(raw.date).toBe('2026-01-01');
  });
});

describe('incrementAnonGen()', () => {
  it('starts at 1 on a fresh day', () => {
    expect(incrementAnonGen()).toBe(1);
  });

  it('counts up monotonically within a day', () => {
    incrementAnonGen();
    incrementAnonGen();
    expect(incrementAnonGen()).toBe(3);
  });

  it('resets to 1 across a day boundary', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T23:00:00'));
    incrementAnonGen();
    incrementAnonGen();
    vi.setSystemTime(new Date('2026-01-02T00:30:00'));
    expect(incrementAnonGen()).toBe(1);
  });
});

describe('anonGensRemaining() / anonAtCap()', () => {
  it('respects the default cap', () => {
    expect(anonGensRemaining()).toBe(DEFAULT_DAILY_CAP);
    expect(anonAtCap()).toBe(false);
    for (let i = 0; i < DEFAULT_DAILY_CAP; i++) incrementAnonGen();
    expect(anonGensRemaining()).toBe(0);
    expect(anonAtCap()).toBe(true);
  });

  it('respects a custom cap', () => {
    incrementAnonGen();
    expect(anonGensRemaining(5)).toBe(4);
    expect(anonAtCap(5)).toBe(false);
    expect(anonAtCap(1)).toBe(true);
  });
});

describe('storage resilience', () => {
  it('tolerates malformed JSON in storage', () => {
    window.localStorage.setItem('sf.anon.gens', '{not json');
    expect(getAnonGenCount()).toBe(0);
    expect(() => incrementAnonGen()).not.toThrow();
  });

  it('tolerates a setItem that throws (private mode)', () => {
    const orig = window.localStorage.setItem;
    window.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    expect(() => incrementAnonGen()).not.toThrow();
    window.localStorage.setItem = orig;
  });
});
