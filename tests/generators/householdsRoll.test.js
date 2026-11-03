/**
 * tests/generators/householdsRoll.test.js — X-46 THE HISTORICAL SCALE, car 1 (ODQ §934.104).
 *
 * A settlement is counted in households as well as residents. `resolveConfig` rolls ONE hearth
 * size (residents per household) uniformly in [3.8, 4.6] from its own step stream — the LAST
 * draw of the step, so no earlier draw moves — and the record carries
 * `households = max(1, round(population / hearth))` beside `population`, clamped into the owner's
 * household band for the tier (HOUSEHOLD_RANGES; the hearth alone misses it in the tails).
 */
import { describe, expect, test } from 'vitest';

import { HOUSEHOLD_RANGES, TIER_ORDER } from '../../src/data/constants.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const HEARTH_MIN = 3.8;
const HEARTH_MAX = 4.6;

/** The household count a hearth of `h` gives for `population`. */
const householdsAt = (population, h) => Math.max(1, Math.round(population / h));

/**
 * Every record's household count must be what SOME hearth in [3.8, 4.6] gives for its own
 * population, clamped into the owner's household band for its tier. The count is monotone in
 * the hearth, so the two ends bracket every answer.
 * @param {{ tier: string, population: number, households: number }} record
 */
function hearthViolation(record) {
  const { tier, population, households } = record;
  if (!Number.isInteger(households) || households < 1) return `households=${households}`;
  const band = HOUSEHOLD_RANGES[tier];
  const clamp = (n) => Math.min(band.max, Math.max(band.min, n));
  const lo = clamp(householdsAt(population, HEARTH_MAX));
  const hi = clamp(householdsAt(population, HEARTH_MIN));
  if (households < lo || households > hi) return `households=${households} outside [${lo}, ${hi}] for population ${population}`;
  return null;
}

describe('households — one hearth roll, carried on the record beside population', () => {
  test('every tier records a whole household count from a hearth of 3.8 to 4.6 residents, inside the owner\'s household band', () => {
    const bad = [];
    for (const tier of TIER_ORDER) {
      for (let i = 0; i < 6; i++) {
        const seed = `x46-hearth-${tier}-${i}`;
        const record = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
        const why = hearthViolation(record);
        if (why) bad.push(`${seed}: ${why}`);
      }
    }
    expect(bad, 'a record whose household count no hearth of 3.8-4.6 explains').toEqual([]);
  });

  test("a 'custom' population is counted in households too", () => {
    const record = generateSettlementPipeline({ settType: 'custom', population: 60 }, null, { seed: 'x46-hearth-custom', customContent: {} });
    expect(record.population).toBe(60);
    expect(hearthViolation(record)).toBeNull();
  });

  test('the hearth is a seeded draw: the same seed gives the same households, the record keys them beside population', () => {
    const a = generateSettlementPipeline({ settType: 'town' }, null, { seed: 'x46-hearth-replay', customContent: {} });
    const b = generateSettlementPipeline({ settType: 'town' }, null, { seed: 'x46-hearth-replay', customContent: {} });
    expect(a.households).toBe(b.households);
    const keys = Object.keys(a);
    expect(keys.indexOf('households')).toBe(keys.indexOf('population') + 1);
  });
});
