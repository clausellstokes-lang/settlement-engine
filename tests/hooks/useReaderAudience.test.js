/**
 * useReaderAudience.test.js — Behavior-signal → audience archetype contract.
 *
 * Verifies the pure `computeReaderAudience` over a fixture matrix. Tests
 * the rules directly so a future refactor of the hook plumbing (selectors,
 * memoization) can't silently shift the audience boundaries.
 */

import { describe, it, expect } from 'vitest';
import { computeReaderAudience } from '../../src/hooks/useReaderAudience.js';

const base = {
  savedCount: 0, exportCount: 0, narrateCount: 0,
  hasUsedNeighbours: false, hasUsedLocks: false, tier: 'free',
};

describe('computeReaderAudience', () => {
  it('anonymous → new regardless of behavior', () => {
    expect(computeReaderAudience({ ...base, tier: 'anon' })).toBe('new');
    expect(computeReaderAudience({ ...base, tier: 'anon', savedCount: 999 })).toBe('new');
  });

  it('default empty → new', () => {
    expect(computeReaderAudience(base)).toBe('new');
    expect(computeReaderAudience({})).toBe('new');
    expect(computeReaderAudience(null)).toBe('new');
  });

  it('first save bumps to intermediate', () => {
    expect(computeReaderAudience({ ...base, savedCount: 2 })).toBe('intermediate');
    expect(computeReaderAudience({ ...base, savedCount: 1 })).toBe('new'); // not yet
  });

  it('first export bumps to intermediate', () => {
    expect(computeReaderAudience({ ...base, exportCount: 1 })).toBe('intermediate');
  });

  it('first narrate spend bumps to intermediate', () => {
    expect(computeReaderAudience({ ...base, narrateCount: 1 })).toBe('intermediate');
  });

  it('5 saves alone → still intermediate (no campaign signal yet)', () => {
    expect(computeReaderAudience({ ...base, savedCount: 5 })).toBe('intermediate');
  });

  it('5 saves + neighbours → worldbuilder', () => {
    expect(computeReaderAudience({ ...base, savedCount: 5, hasUsedNeighbours: true })).toBe('worldbuilder');
  });

  it('5 saves + locks → worldbuilder', () => {
    expect(computeReaderAudience({ ...base, savedCount: 5, hasUsedLocks: true })).toBe('worldbuilder');
  });

  it('5 saves + 3 exports → worldbuilder', () => {
    expect(computeReaderAudience({ ...base, savedCount: 5, exportCount: 3 })).toBe('worldbuilder');
  });

  it('4 saves + locks → not yet worldbuilder (save threshold matters)', () => {
    expect(computeReaderAudience({ ...base, savedCount: 4, hasUsedLocks: true })).toBe('intermediate');
  });

  it('premium tier with new-DM behavior → still new (tier ≠ audience)', () => {
    // Tier is paid-or-not; audience is reader archetype. A new DM who
    // bought Cartographer on day one still gets the new-DM teaching.
    expect(computeReaderAudience({ ...base, tier: 'premium' })).toBe('new');
  });
});
