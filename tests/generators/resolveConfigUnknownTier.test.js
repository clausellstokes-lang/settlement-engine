/**
 * resolveConfig unknown-settType safety.
 *
 * The non-custom / non-random tier path took `config.settType` verbatim as the
 * tier, then indexed `POPULATION_RANGES[tier]` and read `.min`/`.max` with no
 * validation. Any settType that wasn't one of the six canonical tiers
 * (thorp, hamlet, village, town, city, metropolis) made `popRange` undefined,
 * so `rng.randInt(popRange.min, popRange.max)` threw a TypeError mid-pipeline.
 *
 * Pins: an unknown settType no longer throws and falls back to a sane tier
 * (village) with a finite population, while a valid explicit tier is untouched.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { POPULATION_RANGES } from '../../src/data/constants.js';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const BASE_CFG = {
  culture: 'germanic',
  monsterThreat: 'frontier',
  tradeRouteAccess: 'road',
};

describe('resolveConfig tolerates an unknown settType', () => {
  test('a settType outside the six tiers does not throw', () => {
    expect(() =>
      gen({ ...BASE_CFG, settType: 'megacity' }, 'unknown-tier-throws'),
    ).not.toThrow();
  });

  test('unknown settType falls back to a valid tier with a finite population', () => {
    const s = gen({ ...BASE_CFG, settType: 'megacity' }, 'unknown-tier-fallback');

    expect(Object.keys(POPULATION_RANGES)).toContain(s.tier);
    expect(s.tier).toBe('village');

    expect(Number.isFinite(s.population)).toBe(true);
    const { min, max } = POPULATION_RANGES[s.tier];
    expect(s.population).toBeGreaterThanOrEqual(min);
    expect(s.population).toBeLessThanOrEqual(max);
  });

  test('a valid explicit tier is left untouched', () => {
    const s = gen({ ...BASE_CFG, settType: 'town' }, 'unknown-tier-valid');
    expect(s.tier).toBe('town');
    const { min, max } = POPULATION_RANGES.town;
    expect(s.population).toBeGreaterThanOrEqual(min);
    expect(s.population).toBeLessThanOrEqual(max);
  });
});
