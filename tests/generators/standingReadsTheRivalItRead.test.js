/**
 * standingReadsTheRivalItRead.test.js — TAIL-POWERS-B-3 batch 7 (ruling P29, this seat's rows in five towns or more; P1, a
 * power's standing reads its own strength). Measured by the record at 4ff449a7b (the 720):
 *  - 20053 the faith's card "The arcane orders have more say right now" (17 towns): FALSE IN 7, where the rival it read is
 *    the governing Arcane Council and the Arcane Orders stand behind the clergy (their own card says so): the line names the
 *    rival it read (factionStanding.js).
 *  - 29025 "Criminal network operating in shadows; controls illicit trade ..." on a SUPPRESSED card (8 of 36): a Suppressed
 *    network takes a twin that claims no control (claimStanding.js).
 *  - 29028 "the nominal government tolerates this because it cannot currently change it" where the seat's label stands above
 *    the guild's (8 of 18): a twin that says the seat is stronger (claimStanding.js; read on the labels, not the capture state).
 * RED AT THE BASE (4ff449a7b): every refused pair, each naming what prints instead. KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
const ARC_OLD = 'The arcane orders have more say right now, and the clergy cannot accept it.';
const ARC_NEW = 'Arcane Council has more say right now, and the clergy cannot accept it.';
/** TAIL-CLOSE-SRC-4 (the chair's SR4, a declared move): the Arcane Orders are named as their card names them, by the one grammar reader. */
const ARC_ORDERS = 'Arcane Orders have more say right now, and the clergy cannot accept it.';
const CRIM_OLD = 'Criminal network operating in shadows; controls illicit trade and profits from the gap between law and enforcement.';
const CRIM_NEW = "Criminal network operating in shadows; it keeps out of the law's sight and takes what it can from illicit trade.";
const UND_OLD = 'the nominal government tolerates this because it cannot currently change it.';
const UND_NEW = 'Underworld effectively controls vice and key officials; the seat is stronger, but has not moved to break its hold.';
/** [seed, the power whose card is read, the refused words, the words that print in their place] */
const PAIRS = [
  ['r2r-town-1', 'Religious Authorities', ARC_OLD, ARC_NEW],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2r-city-45's faith lit names no outranking Arcane Council ("in the
  // shadow of the governing council"); the lowest r2r-city governed by an Arcane Council whose faith's card reads the rival it
  // read is city-2 (2 32 54 107 111 140 of 200)
  ['r2r-city-2', 'Religious Authorities', ARC_OLD, ARC_NEW],
  ['r2s-under_siege-city-3', 'Religious Authorities', ARC_OLD, ARC_NEW],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2r-city-19's Thieves' Guild lit is no longer Suppressed, and
  // r2r-metropolis-25's card draws another description; the lowest r2r-city and r2r-metropolis whose Suppressed Thieves'
  // Guild draws the shadows line are city-72 (72 183 of 200) and metropolis-78 (78 93 145 192 of 200)
  ['r2r-city-72', "Thieves' Guild", CRIM_OLD, CRIM_NEW],
  ['r2r-metropolis-78', "Thieves' Guild", CRIM_OLD, CRIM_NEW],
  ['r2s-under_siege-town-0', "Thieves' Guild", CRIM_OLD, CRIM_NEW],
  ['r2r-town-31', "Thieves' Guild", UND_OLD, UND_NEW],
  ['r2s-under_siege-town-3', "Thieves' Guild", UND_OLD, UND_NEW],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2s-religious_conversion-metropolis-0's seat lit no longer ranks
  // above the guild's label; the lowest r2s-religious_conversion-metropolis whose Thieves' Guild draws the underworld line
  // beside a seat ranked above it is metropolis-19 (Strong over Significant: 19 58 128 137 of 200)
  ['r2s-religious_conversion-metropolis-19', "Thieves' Guild", UND_OLD, UND_NEW],
];
/** KEEP: the true sibling still prints [seed, the power, words that must still print] */
const KEEP = [
  ['r2r-city-17', 'Religious Authorities', ARC_ORDERS], // re-keyed by identity at SR4: the same sibling, the old special case's "The arcane orders have" retired
  ['r2r-city-16', "Thieves' Guild", CRIM_OLD],
  ['r2r-town-8', "Thieves' Guild", UND_OLD],
];
/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...PAIRS.map((p) => p[0]), ...KEEP.map((k) => k[0])])) births[seed] = born(seed);
}, 300000);
const card = (/** @type {string} */ seed, /** @type {string} */ name) => String((births[seed].powerStructure.factions || []).find((/** @type {any} */ f) => f.faction === name)?.desc || '');

describe('TAIL-POWERS-B-3 batch 7 · a standing line reads the rival it read and the strength of its own card', () => {
  for (const [seed, name, refused, instead] of PAIRS) {
    it(`${seed} (${name}): "${refused.slice(0, 50)}" does not print; "${instead.slice(0, 60)}" prints instead`, () => {
      expectAbsentWithAnchor(card(seed, name), refused, instead, `${seed} (${name})`);
      expect(card(seed, name)).toContain(instead);
    });
  }
  for (const [seed, name, kept] of KEEP) {
    it(`KEEP ${seed} (${name}): "${kept.slice(0, 60)}" still prints`, () => {
      expect(card(seed, name)).toContain(kept);
    });
  }
});
