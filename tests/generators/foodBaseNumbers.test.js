/**
 * tests/generators/foodBaseNumbers.test.js — FOOD-2: THE FOOD BASE NUMBERS (fix shape E of
 * docs/GENERATION_ROOT_CAUSES_2026-11-02.md, appendix 1, root cause 1; chair ruling 2 of the
 * FOOD lane, 2026-11-03).
 *
 * THE DEFECT. Every place was one farm: four in ten people in the fields at six pounds a day,
 * a private terrain table weaker than the geography table it claimed to copy (plains 1.0 for
 * 1.5), and production divided by a hidden 1.3. A thorp on the best land was 8% short and a
 * metropolis short by the same 8%, so shortfall was the normal state. The cure: a household on
 * ordinary land grows about its need (geography's one table moves that share), towns and
 * larger draw their hinterland share as ordinary supply, the /1.3 is gone (stores are
 * storageMonths), and the arithmetic is per capita and per tier.
 */
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';
import { deriveFoodBalanceAnalysis } from '../../src/generators/economy/foodBalance.js';
import { TERRAIN_DATA } from '../../src/data/geographyData.js';
import { POPULATION_RANGES } from '../../src/data/constants.js';

const ORDINARY_LAND = ['plains', 'riverside', 'coastal', 'hills', 'forest'];
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

describe('FOOD-2 — the food base numbers', () => {
  it('most thorps feed themselves: at least 12 of 20 grow what they eat', () => {
    let fed = 0;
    for (let i = 0; i < 20; i += 1) {
      const s = generateSettlementPipeline({ settType: 'thorp' }, null, { seed: `food-base-thorp-${i}`, customContent: {} });
      if (s.economicState.foodSecurity.foodRecord.grownPct >= 100) fed += 1;
    }
    expect(fed).toBeGreaterThanOrEqual(12);
  });

  it('the land multiplier is the geography table\'s, and a bare place on ordinary land grows about its need', () => {
    for (const terrain of ORDINARY_LAND) {
      const fs = generateFoodSecurity('hamlet', [], { _population: 200, tradeRouteAccess: 'road', terrainType: terrain, magicExists: false });
      expect(fs.effectiveAgriculture, terrain).toBe(TERRAIN_DATA[terrain].agricultureCapacity);
      expect(fs.dailyProduction / fs.dailyNeed, `${terrain} grows between 85% and 125% of its need`).toBeGreaterThanOrEqual(0.85);
      expect(fs.dailyProduction / fs.dailyNeed, terrain).toBeLessThanOrEqual(1.25);
    }
    const plains = generateFoodSecurity('hamlet', [], { _population: 200, tradeRouteAccess: 'road', terrainType: 'plains', magicExists: false });
    expect(plains.dailyProduction, 'plains feed a bare hamlet').toBeGreaterThanOrEqual(plains.dailyNeed);
  });

  it('towns and larger draw their hinterland as ordinary supply, so the gap is not flat across sizes', () => {
    const gap = (tier) => generateFoodSecurity(tier, [], { _population: POPULATION_RANGES[tier].min * 2, tradeRouteAccess: 'isolated', terrainType: 'desert', magicExists: false }).deficitPct;
    expect(gap('metropolis'), 'a desert metropolis is better fed than a desert hamlet: its hinterland carries half its need').toBeLessThan(gap('hamlet'));
    expect(gap('city')).toBeLessThan(gap('hamlet'));
    const town = generateFoodSecurity('town', [], { _population: 2000, tradeRouteAccess: 'isolated', terrainType: 'forest', magicExists: false });
    expect(town.foodRecord.normalImportPct, 'the hinterland arrives as normal imports').toBeGreaterThanOrEqual(19);
  });

  // T2 (soak 1000 dry run §4, adopted by the chair 2026-11-04): a village with no granary stored 1.0
  // month to a hamlet's 1.5 (village median 1.3 against hamlet 1.5 across 1,000 places).
  it('a village with no granary stores no less than a hamlet (T2)', () => {
    const months = (tier) => generateFoodSecurity(tier, [], { _population: POPULATION_RANGES[tier].min * 2, tradeRouteAccess: 'road', terrainType: 'plains', magicExists: false }).storageMonths;
    expect(months('village'), 'village months in store vs hamlet').toBeGreaterThanOrEqual(months('hamlet'));
  });

  it('the stand-in "Access to external mill" extends no stores', () => {
    const fs = generateFoodSecurity('hamlet', [{ name: 'Access to external mill' }], { _population: 200, tradeRouteAccess: 'road', terrainType: 'plains', magicExists: false });
    expect(fs.storageMonths).toBe(1.5);
  });

  it('the mill check and the default population read the tier, not a headcount', () => {
    const noMill = deriveFoodBalanceAnalysis(950, null, [{ name: 'Weekly market' }], { tier: 'town', tradeRouteAccess: 'road' });
    expect(noMill.warnings.map((w) => w.title), 'a town of 950 without a mill').toContain('No Milling Facility');
    const fs = generateFoodSecurity('town', [], { tradeRouteAccess: 'road', terrainType: 'plains', magicExists: false });
    const mid = Math.round((POPULATION_RANGES.town.min + POPULATION_RANGES.town.max) / 2);
    expect(fs.dailyNeed, 'the tier default is the middle of the one population table').toBe(mid * 2);
  });

  it('a forced famine still reads Deficit or Active Famine, 11 of 11', () => {
    const labels = [];
    for (let i = 0; i < 11; i += 1) {
      const tier = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'][i % 6];
      const s = generateSettlementPipeline({ settType: tier, selectedStresses: ['famine'], selectedStressesRandom: false }, null, { seed: `food-base-famine-${i}`, customContent: {} });
      labels.push(s.economicState.foodSecurity.label);
    }
    expect(labels.filter((l) => /^Deficit/.test(l))).toHaveLength(11);
  });

  it('per tier, the median small place is fed and the median large place is fed through its hinterland', () => {
    const gaps = {};
    for (const tier of ['thorp', 'village', 'city']) {
      gaps[tier] = median(Array.from({ length: 8 }, (_, i) => generateSettlementPipeline({ settType: tier }, null, { seed: `food-base-${tier}-${i}`, customContent: {} }).economicState.foodSecurity.deficitPct));
    }
    expect(gaps.thorp, 'thorp median gap').toBeLessThanOrEqual(5);
    expect(gaps.city, 'city median gap').toBeLessThanOrEqual(5);
  });
});
