/**
 * tests/generators/foodwaysFamineFailedSource.test.js — UPKEEP-16, the chair's ruling (n) (2026-11-14): under a famine
 * the stored foodways line was composed from every food source the place has, the one the famine failed among them,
 * so the famine town's table "rested on" the failed harvest (66 of the capacity reader's 972, on the tab, the PDF, the
 * Foundry journal and both exports). `foodGenerator.js :: generateFoodSecurity` hands the composer the sources less the
 * failed one; grain and the mill fail together. Outside a famine the line is the place's whole table, as before.
 */
import { describe, expect, it } from 'vitest';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';
import { sourcesNamedIn } from '../../src/domain/foodways.js';

/** @param {string[]} nearbyResources @param {string[]} stressTypes */
const food = (nearbyResources, stressTypes) => generateFoodSecurity('village', [], { stressTypes, nearbyResources, tradeRouteAccess: 'road' }).foodRecord;

const CASES = [
  ['grain_fields', 'grazing_land'],
  ['river_fish', 'grain_fields'],
  ['river_fish', 'grazing_land', 'hunting_grounds'],
  ['grain_fields', 'river_mills', 'grazing_land'],
];

describe('(n) the famine\'s foodways line does not name the source the famine failed', () => {
  for (const res of CASES) {
    it(`${res.join(' + ')}: the failed source (and the mill with grain) is not on the table`, () => {
      const r = food(res, ['famine']);
      expect(r.failedSource, 'fixture premise: the famine fails a source').toBeTruthy();
      const lost = r.failedSource === 'grain' || r.failedSource === 'mill' ? ['grain', 'mill'] : [r.failedSource];
      expect(sourcesNamedIn(r.foodwaysLine).filter((s) => lost.includes(s))).toEqual([]);
      // the sources the famine left are still the table (anti-vacuity: a line naming nothing would pass the first arm)
      const left = r.foodSources.filter((/** @type {string} */ s) => !lost.includes(s));
      for (const s of left.slice(0, 3)) expect(sourcesNamedIn(r.foodwaysLine)).toContain(s);
    });
  }
  it('a famine that fails the only source leaves the composer\'s no-source sentence', () => {
    const r = food(['grazing_land'], ['famine']);
    expect(r.foodSources).toEqual(['livestock']);
    expect(sourcesNamedIn(r.foodwaysLine)).toEqual([]);
  });
  it('outside a famine the line is the whole table, unchanged', () => {
    const r = food(['grain_fields', 'grazing_land'], []);
    expect(r.failedSource).toBeNull();
    expect(sourcesNamedIn(r.foodwaysLine).sort()).toEqual(['grain', 'livestock']);
  });
});
