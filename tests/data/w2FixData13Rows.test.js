/**
 * W2-FIX-DATA-13 (2026-11-14): the data lane's rows of the ranked table, each reproduced false in census towns
 * (`r2r-<size>-<i>` every dial random; `r2s-<crisis>-<size>-<i>` the crisis forced, Random off) and cured at its table.
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

/** The roster's names. @param {any} town @returns {string[]} */
const roster = (town) => (town.institutions || []).map((/** @type {any} */ i) => String(i.name || ''));

describe('W2-FIX-DATA-13: the measured rows in the data lane\'s files', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  // DATA-SMELTER (the chair's 11:31 ruling): the catalogue's own Smelter text named "mine and smithy" in 57 of the 96
  // towns it printed in where the roster lacks one (r2r-town-26 neither; r2r-town-34; r2s-under_siege-city-2 no mine).
  test('DATA-SMELTER: no Smelter description names a mine or a smithy the roster lacks', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-town-26', 'r2r-town-34', 'r2s-under_siege-city-2'], (seed) => {
      const town = bornCensus(seed);
      const names = roster(town);
      const hasMine = names.some((n) => /\bmines?\b|mining/i.test(n));
      const hasSmith = names.some((n) => /smith|forge|metalwork/i.test(n));
      const smelter = (town.institutions || []).find((/** @type {any} */ i) => i.name === 'Smelter');
      expect(smelter, seed).toBeTruthy();
      const desc = String(smelter.desc || '');
      if (!hasMine) expect(desc, seed).not.toMatch(/\bmine\b/i);
      if (!hasSmith) expect(desc, seed).not.toMatch(/smith/i);
    }), 'no Smelter description names a mine or a smithy the roster lacks');
  }, 120_000);

});
