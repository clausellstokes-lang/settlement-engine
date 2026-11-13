/**
 * W2-FIX-DATA-3 (2026-11-13): a settlement never prints two current tensions of the same template type.
 * `buildHistoricalEvent`'s fill loop picks from a pool and adds the type to `usedTypes`, but the pool is
 * built once; the drawn candidate must be spliced out or a later pick can draw it again. The lane's second
 * seat (dde3b1277) dropped that splice when it added the record-truth set-aside, so the same template was
 * selected twice: 28 of the census's 720 towns printed a repeated tension type. Red at the tip before the
 * splice was restored (r2r-town-51, r2r-city-8: guild_conflict twice).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

describe('W2-FIX-DATA-3: a town prints no two current tensions of one template type', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 60_000);

  test('the four census towns the regression hit carry distinct tension types', () => {
    expectNoSeedFailures(collectSeedFailures(/** @type {const} */ ([['r2r-town-51', 'town'], ['r2r-city-8', 'city'], ['r2r-town-23', 'town'], ['r2r-city-9', 'city']]), ([seed, tier]) => {
      const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: tier }), null, { seed, customContent: {} });
      const types = (s.history.currentTensions || []).map((/** @type {any} */ t) => t.type);
      expect(new Set(types).size, `${seed}: ${types}`).toBe(types.length);
    }), 'every regression town carries distinct tension types');
  }, 60_000);

  test('no repeated tension type across a fresh grid (six sizes x 25)', () => {
    const bad = [];
    for (const tier of SIZES) {
      for (let i = 0; i < 25; i++) {
        const seed = `w2fd3dedup-${tier}-${i}`;
        const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: tier }), null, { seed, customContent: {} });
        const types = (s.history.currentTensions || []).map((/** @type {any} */ t) => t.type);
        if (new Set(types).size !== types.length) bad.push(`${seed}: ${types}`);
      }
    }
    expect(bad).toEqual([]);
  }, 120_000);
});
