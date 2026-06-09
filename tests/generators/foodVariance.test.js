/**
 * tests/generators/foodVariance.test.js — P2.4 seeded crop-fortune variance.
 *
 * foodGenerator used to be a pure function of config, so re-rolling the SAME
 * config produced an identical food ratio every time. A seeded crop-fortune
 * multiplier (±8%, forked into an isolated sub-stream) now varies the harvest per
 * seed — good years vs lean years — while staying deterministic per seed. These
 * tests isolate that variance: identical config, only the active RNG seed differs.
 */

import { describe, it, expect } from 'vitest';
import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';

const INSTITUTIONS = [{ name: 'Town Granary' }, { name: 'Common Field' }, { name: 'Watermill' }];
const CONFIG = {
  _population: 2000, tradeRouteAccess: 'road', terrainType: 'plains',
  nearbyResources: ['grain_fields'], magicExists: false,
};

function ratioWithSeed(seed) {
  setActiveRng(createPRNG(seed));
  try {
    return generateFoodSecurity('town', INSTITUTIONS, { ...CONFIG }).foodRatio;
  } finally {
    clearActiveRng();
  }
}

describe('seeded crop-fortune variance (P2.4)', () => {
  it('varies foodRatio across seeds with IDENTICAL config', () => {
    // Only the seed differs → only crop-fortune differs → the ratio must move.
    const seeds = ['a', 'b', 'c', 'd', 'e', 'f'];
    const distinct = new Set(seeds.map(ratioWithSeed));
    expect(distinct.size).toBeGreaterThan(1);
  });

  it('is deterministic — the same seed reproduces the same foodRatio', () => {
    expect(ratioWithSeed('repeat-seed')).toBe(ratioWithSeed('repeat-seed'));
  });

  it('the variance is bounded (±8%) — ratios cluster, not wild swings', () => {
    const ratios = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(ratioWithSeed);
    const min = Math.min(...ratios);
    const max = Math.max(...ratios);
    // ±8% on production → at most ~16% spread on the local component.
    expect(max - min).toBeLessThan(0.4);
  });

  it('falls back to no jitter (deterministic) when no seeded RNG is active', () => {
    clearActiveRng();
    const a = generateFoodSecurity('town', INSTITUTIONS, { ...CONFIG }).foodRatio;
    const b = generateFoodSecurity('town', INSTITUTIONS, { ...CONFIG }).foodRatio;
    expect(a).toBe(b);
  });
});
