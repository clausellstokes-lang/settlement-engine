/**
 * W2-FIX-DATA-14 (2026-11-14): the data lane's rows of its own census table (CENSUS-3's one command at 81df6fb80), each
 * reproduced false in census towns (`r2r-<size>-<i>` every dial random; `r2s-<crisis>-<size>-<i>` the crisis forced,
 * Random off) and cured at its table.
 *
 * THIS FILE REDS WHEN a town prints one of those lines again where its record makes it false, or when the town it is
 * true in loses it.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { chainNeedLine } from '../../src/domain/display/chainNeedShown.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};

describe('W2-FIX-DATA-14: the measured rows in the data lane\'s files', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  // LV-CATHEDRAL (the chair's ruling r3 of 2026-11-14; 100 of the census's 720 towns, every one false): the two cathedral
  // rows of TRADE_DEPENDENCY_NEEDS named worship, pilgrimage and teaching as what "depends on stone brought in"; the
  // stone keeps the building up. r2r-city-23 the smallest (10,036), r2s-under_siege-city-0 the siege's form,
  // r2s-famine-metropolis-2 a famine and the Great cathedral, r2r-metropolis-8 the largest (344,689): each keeps its line.
  test('LV-CATHEDRAL: a cathedral\'s need for stone names the repairs it keeps up, never worship, pilgrimage or teaching', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-city-23', 'r2s-under_siege-city-0', 'r2s-famine-metropolis-2', 'r2r-metropolis-8'], (seed) => {
      const town = /** @type {any} */ (bornCensus(seed));
      const deps = (town.economicState?.tradeDependencies || []).filter((/** @type {any} */ d) => /cathedral/i.test(String(d.institution || '')));
      expect(deps.length, `${seed} carries a cathedral's need`).toBeGreaterThan(0);
      for (const d of deps) expect(d.affectedServices, seed).toEqual(['cathedral repairs']);
      const lines = (town.economicState?.activeChains || []).map((/** @type {any} */ c) => chainNeedLine(c, town)).filter(Boolean);
      expect(lines.filter((l) => /religious services|pilgrimage|theological|diocesan/i.test(l)), seed).toEqual([]);
      expect(lines.some((l) => /^Cathedral repairs here depend on stone/.test(l)), `${seed} keeps the cathedral's need line`).toBe(true);
    }), 'no cathedral need line names worship, pilgrimage or teaching');
  }, 240_000);
});
