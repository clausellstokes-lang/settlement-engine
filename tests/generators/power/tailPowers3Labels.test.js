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
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

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
      expectAbsentWithAnchor(account, was, now, seed);
      expect(account, seed).toContain(now);
    }, 120_000);
  }

  /** seed -> [the stability that must NOT be written, the stability written instead] */
  const STABILITY = /** @type {Record<string, [string, string]>} */ ({
    // G2: a Legitimacy Crisis (thorp and town, the smallest and largest it reaches)
    'r2r-thorp-23': ['Stable', "Tense (the seat has lost the people's trust)"],
    'r2r-town-44': ['Stable', "Tense (the seat has lost the people's trust)"],
    // G3: no religious seat, no religious power of weight
    'r2r-city-18': ['Rigid (militant theocracy)', 'Ordered (strong military presence)'],
    'r2r-metropolis-42': ['Rigid (militant theocracy)', 'Stable'],
    'r2r-metropolis-24': ['Stable (theocratic governance)', 'Stable'],
    // G5: no garrison stands
    'r2r-village-49': ['Ordered (strong military presence)', 'Stable'],
  });
  for (const [seed, [was, now]] of Object.entries(STABILITY)) {
    it(`${seed}: the stability reads "${now}", not "${was}"`, () => {
      const s = born(seed);
      expect(s.powerStructure.stability, seed).not.toBe(was);
      expect(s.powerStructure.stability, seed).toBe(now);
    }, 120_000);
  }

  /** KEEP: each word where the record bears it. seed -> the stability that still prints */
  const KEEP = /** @type {Record<string, string>} */ ({
    'r2r-thorp-0': 'Stable', // no Legitimacy Crisis
    'r2r-metropolis-11': 'Stable (theocratic governance)', // a High Theocratic Council governs
    'r2r-town-54': 'Stable (theocratic governance)', // a religious power of weight stands
    'r2r-town-9': 'Ordered (strong military presence)', // a garrison stands
  });
  for (const [seed, keep] of Object.entries(KEEP)) {
    it(`KEEP ${seed}: "${keep}" still prints where the record bears it`, () => {
      expect(born(seed).powerStructure.stability, seed).toBe(keep);
    }, 120_000);
  }
});
