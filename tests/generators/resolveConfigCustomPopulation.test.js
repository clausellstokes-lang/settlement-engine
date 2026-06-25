/**
 * resolveConfig custom-population safety.
 *
 * The custom-settType path took `config.population` VERBATIM as the resolved
 * population (and fed it into popToTier for the tier), with no numeric
 * validation. Any non-finite or non-positive population — undefined, NaN, 0,
 * a negative number, or a non-numeric string — flowed straight through into
 * the generated settlement and poisoned every population-scaled calculation
 * downstream (institution counts, economy, food, density math).
 *
 * Pins: a custom settType with a junk population always resolves to a FINITE,
 * POSITIVE population (never NaN / 0 / negative), while a valid custom
 * population is preserved exactly.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { POPULATION_RANGES } from '../../src/data/constants.js';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const BASE_CFG = {
  settType: 'custom',
  culture: 'germanic',
  monsterThreat: 'frontier',
  tradeRouteAccess: 'road',
};

describe('resolveConfig clamps a junk custom population', () => {
  // Each junk value used to propagate verbatim into s.population.
  const JUNK = [
    ['undefined', undefined],
    ['NaN',       NaN],
    ['zero',      0],
    ['negative',  -50],
    ['string',    'abc'],
  ];

  test.each(JUNK)('population=%s yields a finite, positive population', (label, value) => {
    const s = gen({ ...BASE_CFG, population: value }, `custom-pop-${label}`);

    expect(Number.isFinite(s.population)).toBe(true);
    expect(s.population).toBeGreaterThan(0);

    // The resolved tier must be a real tier and its population must sit in range,
    // proving the junk fell back to a sane tier default rather than leaking through.
    expect(Object.keys(POPULATION_RANGES)).toContain(s.tier);
    const { min, max } = POPULATION_RANGES[s.tier];
    expect(s.population).toBeGreaterThanOrEqual(min);
    expect(s.population).toBeLessThanOrEqual(max);
  });

  test('a valid custom population is preserved exactly', () => {
    const s = gen({ ...BASE_CFG, population: 2500 }, 'custom-pop-valid');
    expect(s.population).toBe(2500);
    // 2500 maps to the town tier via popToTier.
    expect(s.tier).toBe('town');
  });
});
