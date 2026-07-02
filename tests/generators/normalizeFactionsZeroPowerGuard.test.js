import { describe, test, expect } from 'vitest';

import { normalizeAndAnnotateFactions } from '../../src/generators/powerGenerator.js';

/**
 * Regression: normalizeAndAnnotateFactions must not emit NaN on a degenerate roster.
 *
 * It renormalises each faction's `power` to a percentage via `power / totalPower`. Its
 * sibling renormalizeFactionPower guards the empty / zero-power cases (`!length`,
 * `total <= 0`); this function did not — so a non-empty roster whose powers sum to 0
 * produced `x / 0 = NaN`, and Math.round(NaN) = NaN corrupted every share, the
 * governing/power sort, and the rivalry annotation. The guard makes it degrade to 0
 * shares instead, matching the sibling's contract. (Surfaced by the codebase audit.)
 */
describe('normalizeAndAnnotateFactions — degenerate-roster guard', () => {
  test('an all-zero-power roster yields 0 shares, never NaN', () => {
    const factions = [
      { faction: 'Silent Court', power: 0, isGoverning: true, description: '' },
      { faction: 'Hollow Guild', power: 0, isGoverning: false, description: '' },
    ];
    normalizeAndAnnotateFactions(factions);
    for (const f of factions) {
      expect(Number.isNaN(f.power)).toBe(false);
      expect(f.power).toBe(0);
    }
  });

  test('a single zero-power faction does not divide-by-zero', () => {
    const factions = [{ faction: 'Lone Watch', power: 0, isGoverning: true, description: '' }];
    normalizeAndAnnotateFactions(factions);
    expect(Number.isNaN(factions[0].power)).toBe(false);
  });

  test('the normal path is unchanged: powers become percentage shares summing sensibly', () => {
    const factions = [
      { faction: 'Merchant Council', power: 60, isGoverning: true, description: '' },
      { faction: 'City Watch', power: 40, isGoverning: false, description: '' },
    ];
    normalizeAndAnnotateFactions(factions);
    // 60/100 → 60, 40/100 → 40; governing sorts first.
    expect(factions.map((f) => f.power)).toEqual([60, 40]);
    expect(factions.every((f) => !Number.isNaN(f.power))).toBe(true);
  });
});
