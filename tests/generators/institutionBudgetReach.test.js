/**
 * X-46 car 3 — THE DEAD-ROW CENSUS under the budget (the chair's rulings, 2026-11-04; §7's
 * promise "catalogue rows dead under the bands: 0"). Each tier's band is walked in ten
 * log-spaced steps: the density factor is above zero at every step, and every optional,
 * non-fabric row reaches a nonzero chance (authored chance × d) somewhere in the band. A row a
 * stated population floor keeps out of the whole band is car 2's (§3a) and is named here, not
 * hidden: the factor cannot be what kills it.
 */
import { describe, expect, it } from 'vitest';
import { densityFactor, scaleChance } from '../../src/data/institutionBudget.js';
import { institutionalCatalog, institutionRowGuards, isFabricRow } from '../../src/data/institutionalCatalog.js';
import { POPULATION_RANGES, TIER_ORDER } from '../../src/data/constants.js';

/** Car 2's: a row whose stated floor sits above its tier's band maximum (§3a, the seven-row table).
 * Re-keyed by identity 2026-11-04 (rung-1 pins, unit 1): measured at x46-3's own base the one row
 * was town Money changers (floor 3,000 over a 2,500 band top); x46-2, composed beneath it, moved that
 * floor to 2,000 (the band's top fifth, ODQ §934.104), so on the composed base no row's floor sits
 * above its band and the list is empty. The pin below still names any row a floor kills. */
const FLOOR_ABOVE_BAND = Object.freeze([]);

const walk = (tier) => {
  const { min, max } = POPULATION_RANGES[tier];
  return Array.from({ length: 11 }, (_, k) => Math.round(min * (max / min) ** (k / 10)));
};

describe('X-46 car 3 — no catalogue row is dead under the budget', () => {
  it('the density factor is above zero at every step of every band (5 to 60,000)', () => {
    for (const tier of TIER_ORDER) for (const P of walk(tier)) expect(densityFactor(tier, P), `${tier} @ ${P}`).toBeGreaterThan(0);
  });

  it('every optional non-fabric row reaches a nonzero chance somewhere in its band', () => {
    const dead = [];
    for (const tier of TIER_ORDER) {
      const steps = walk(tier);
      for (const group of Object.values(institutionalCatalog[tier])) {
        for (const [name, row] of Object.entries(group)) {
          if (row.required || isFabricRow(tier, name)) continue;
          const floor = institutionRowGuards(tier, name)?.minPopulation;
          const reachable = steps.some((P) => (typeof floor !== 'number' || P >= floor) && scaleChance(row.baseChance || 0, densityFactor(tier, P)) > 0);
          if (!reachable) dead.push(`${tier}|${name}`);
        }
      }
    }
    expect(dead).toEqual([...FLOOR_ABOVE_BAND]);
  });
});
