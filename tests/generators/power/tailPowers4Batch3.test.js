/**
 * TAIL-POWERS-4 · batch 3 (READ-ALL rows 05663, 15434; power/governingStressVignettes.js). Two stress vignettes said what
 * the place need not hold: wartime's "the farms and workshops are short-handed" (27 towns, 8 of them thorps of 6 to 30
 * souls) and the insurgency's "two guild masters stayed away from the last assembly" (21 towns, 13 with no guild). Both
 * reworded to claim what every printing town bears: "every household is short-handed"; "several who were expected
 * stayed away from the last assembly". A DECLARED MOVE: powerStructure.recentConflict (and pressureSentence).
 * Births as the census's 720 (each pair red at the base); the new wording is pinned at both ends of the size range.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

describe('TAIL-POWERS-4 · batch 3: the vignettes claim no workshop and no guild', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const WAS_W = 'the farms and workshops are short-handed';
  const NOW_W = 'Conscription has taken the workers, and every household is short-handed.';
  const WAS_I = 'two guild masters stayed away';
  const NOW_I = 'and several who were expected stayed away from the last assembly.';
  /** seed -> [the text that must NOT be written, the text written instead] */
  const CURED = /** @type {Record<string, [string, string]>} */ ({
    'r2s-wartime-thorp-3': [WAS_W, NOW_W], // a thorp of 6
    'r2s-wartime-city-2': [WAS_W, NOW_W], // a city of 13,169
    'r2s-insurgency-thorp-2': [WAS_I, NOW_I], // a thorp of 9
    'r2r-metropolis-26': [WAS_I, NOW_I], // a metropolis of 21,872
  });
  for (const [seed, [was, now]] of Object.entries(CURED)) {
    it(`${seed}: the vignette reads "${now}", not "${was}"`, () => {
      const rc = String(born(seed).powerStructure.recentConflict || '');
      expectAbsentWithAnchor(rc, was, now, seed);
      expect(rc, seed).toContain(now);
    }, 120_000);
  }
});
