/**
 * TAIL-POWERS-3 · batch 1 (the chair's rulings P3 and P16 of 2026-11-14/15, each vetoable by the owner).
 *
 * (P3) A power named in a sentence takes its prose form from the one leaf (domain/display/powerSentenceName.js): the
 * governance account's powerNameInProse read the roster label raw: "The Military/Guard no longer takes its orders.",
 * "The Military/Guard is at odds with it." (62 towns of the census's 720 at 288be89f4), and its plural test read the
 * label too, so "The Third Bloc will back whichever side meets its price." (3) now reads "The Neutrals ... their price.".
 * (P16, RECORD-MEASURE-2's G2, G3, G5) the stability label (power/governanceNarrative.js; rulingStructure.js) said
 * "Stable" beside a Legitimacy Crisis (9 towns: now "Tense (the seat has lost the people's trust)"), a theocracy's word
 * under no religious seat and no religious power of weight (8: the next rung of the ladder prints), and "strong military
 * presence" where no garrison stands (3). A DECLARED MOVE: `powerStructure.stability` in those 20 towns, nothing else.
 * Births as the census's 720 (each pair red at the base); KEEP: each word where the record bears it.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { governanceAccountOf } from '../../../src/domain/display/governanceAccount.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

describe('TAIL-POWERS-3 · batch 1: the account names a power by its prose form; the stability word reads the record', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  /** seed -> [the account's sentence that must NOT print, the sentence that prints instead] */
  const ACCOUNT = /** @type {Record<string, [string, string]>} */ ({
    'r2r-hamlet-10': ['The Military/Guard no longer takes its orders.', 'The Guard no longer takes its orders.'],
    'r2r-hamlet-18': ['The Military/Guard is at odds with it.', 'The Guard is at odds with it.'],
    'r2s-politically_fractured-town-3': ['The Third Bloc will back whichever side meets its price.', 'The Neutrals will back whichever side meets their price.'],
  });
  for (const [seed, [was, now]] of Object.entries(ACCOUNT)) {
    it(`${seed}: the account prints "${now}", not "${was}"`, () => {
      const account = governanceAccountOf(born(seed))?.text || '';
      expect(account, seed).not.toContain(was);
      expect(account, seed).toContain(now);
    }, 120_000);
  }
});
