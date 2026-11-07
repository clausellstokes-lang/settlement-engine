/**
 * tests/domain/facts/populationBand.test.js — CENSUS-1 wave 0, fact 12 (a new reader).
 * @enforced-by npx vitest run tests/domain/facts/populationBand.test.js
 */
import { describe, expect, it } from 'vitest';
import { populationBandOf } from '../../../src/domain/facts/populationBand.js';
import { TIER_STAMP_CUTS } from '../../../src/data/constants.js';

describe('the population-band home (CENSUS-1 fact 12)', () => {
  it('reads the stamp cuts, population first, tier as the fallback', () => {
    expect(populationBandOf({ population: TIER_STAMP_CUTS.town - 1, tier: 'town' })).toBe('small');
    expect(populationBandOf({ population: TIER_STAMP_CUTS.town })).toBe('middling');
    expect(populationBandOf({ population: TIER_STAMP_CUTS.city })).toBe('large');
    expect(populationBandOf({ tier: 'metropolis' })).toBe('large');
    expect(populationBandOf({})).toBe(null);
  });
});
