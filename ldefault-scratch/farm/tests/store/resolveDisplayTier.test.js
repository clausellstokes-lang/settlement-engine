/**
 * tests/store/resolveDisplayTier.test.js — Store cluster finding #2.
 *
 * resolveDisplayTier had a dead branch: the `t === 'custom'` clause in the
 * `!t || t === 'random' || t === 'custom'` guard was unreachable, because a
 * 'custom' settType is fully handled by the early population-band return above
 * it. The fix drops the dead clause. These tests pin the OBSERVABLE contract so
 * the simplification is proven behaviour-preserving (and stays that way).
 */
import { describe, test, expect } from 'vitest';
import { resolveDisplayTier } from '../../src/store/selectors.js';

describe('resolveDisplayTier (finding #2 — dead-branch removal is behaviour-preserving)', () => {
  test("custom always resolves via the population band, never falls through to 'all'", () => {
    // A tiny population maps to the smallest tier (thorp), not 'all' — proving
    // the early custom return owns every custom case.
    expect(resolveDisplayTier({ settType: 'custom', population: 10 })).toBe('thorp');
    // A large population maps to the largest tier.
    expect(resolveDisplayTier({ settType: 'custom', population: 1_000_000 })).toBe('metropolis');
    // Missing population defaults (1500) and still resolves to a real tier.
    expect(resolveDisplayTier({ settType: 'custom' })).not.toBe('all');
  });

  test("random and empty settType resolve to 'all'", () => {
    expect(resolveDisplayTier({ settType: 'random' })).toBe('all');
    expect(resolveDisplayTier({ settType: '' })).toBe('all');
    expect(resolveDisplayTier({})).toBe('all');
  });

  test('a manual tier passes through unchanged', () => {
    expect(resolveDisplayTier({ settType: 'town' })).toBe('town');
    expect(resolveDisplayTier({ settType: 'city' })).toBe('city');
  });
});
