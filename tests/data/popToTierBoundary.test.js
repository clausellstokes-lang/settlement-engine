import { describe, expect, test } from 'vitest';

import { popToTier, POPULATION_RANGES, TIER_ORDER } from '../../src/data/constants.js';

// Regression + invariant: popToTier's boundaries must agree with
// POPULATION_RANGES exactly, or a settlement is stamped with a tier whose own
// max it exceeds. The thorp/hamlet boundary was previously 80 (thorp), leaking
// pop 61-80 into `thorp` while POPULATION_RANGES.thorp maxes at 60.
describe('popToTier boundaries agree with POPULATION_RANGES', () => {
  test('the 61-80 window classifies as hamlet, not thorp', () => {
    expect(popToTier(60)).toBe('thorp');
    expect(popToTier(61)).toBe('hamlet');
    expect(popToTier(80)).toBe('hamlet');
    expect(popToTier(400)).toBe('hamlet');
  });

  test('every non-metropolis tier max maps to that tier, and max+1 to the next', () => {
    for (let i = 0; i < TIER_ORDER.length - 1; i++) {
      const tier = TIER_ORDER[i];
      const next = TIER_ORDER[i + 1];
      const { max } = POPULATION_RANGES[tier];
      expect(popToTier(max)).toBe(tier);
      expect(popToTier(max + 1)).toBe(next);
    }
  });

  test('a resulting tier never has the population above its own range max', () => {
    for (const pop of [8, 60, 61, 79, 80, 400, 401, 900, 5000, 25000, 25001, 99999]) {
      const tier = popToTier(pop);
      const { min, max } = POPULATION_RANGES[tier];
      expect(pop).toBeGreaterThanOrEqual(min);
      if (tier !== 'metropolis') expect(pop).toBeLessThanOrEqual(max);
    }
  });
});
