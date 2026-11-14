/**
 * W2-FIX-DATA-11 (2026-11-14): the release bar's first measure (REVIEW-BAR-0, ten fresh towns read cold) put twenty-one
 * MEDIUM rows on the data lane's tables; each cure here is ranked on the census's 720 (`r2r-<size>-<i>` every dial random;
 * `r2s-<crisis>-<size>-<i>` the crisis forced, Random off) and the bar's ten, and reproduced false in census towns.
 *
 * THIS FILE REDS WHEN a town prints one of those lines again where its record makes it false, or when the town it is true
 * in loses it.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** @param {any} town @param {string} name */
const instOf = (town, name) => (town.institutions || []).find((/** @type {any} */ i) => i.name === name);

describe('W2-FIX-DATA-11: the bar\'s rows in the data lane\'s files', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('REVIEW-BAR-0 #185: the two smelter variants stand "between the mine and the smithy" only where both stand (r2r-town-1, r2r-town-9 no mine; r2r-town-38 no smith); r2r-town-11 keeps it', () => {
    const BETWEEN = /It stands between the mine and the smithy|what the mine yields to what the smith/;
    expectNoSeedFailures(collectSeedFailures(['r2r-town-1', 'r2r-town-9', 'r2r-town-38'], (seed) => {
      const smelter = instOf(bornCensus(seed), 'Smelter');
      expect(smelter, `${seed} holds a Smelter`).toBeDefined();
      expect(String(smelter.desc), seed).not.toMatch(BETWEEN);
      expect(String(smelter.desc), seed).toMatch(/by the bar|in bars for whoever will buy them/);
    }), 'no mine or no smith: the smelter names neither');
    expect(String(instOf(bornCensus('r2r-town-11'), 'Smelter').desc)).toMatch(BETWEEN);
  }, 120_000);
});
