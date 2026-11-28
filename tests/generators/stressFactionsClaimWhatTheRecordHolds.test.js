/**
 * stressFactionsClaimWhatTheRecordHolds.test.js — TAIL-POWERS-B-3 batch 6b (ruling P29, the order's first step): the
 * stress factions' descriptions and one conflict hook claim no more than every printing town can bear. Measured by the
 * record at 4140ad9f4 (the 720) before the rewording was built:
 *  - "controls a distinct district or institution" (The Independent Bloc, politically_fractured): 37 towns, the record
 *    gives the bloc no district and no house in any (thorps of ten among them) -> "and has a following of its own".
 *  - the War Council "Currently functioning smoothly ... its authority isn't contested": 3 towns, the council Suppressed in
 *    all 3 -> "While the war goes well, few people ask what it does." (drawn only while the war goes well).
 *  - the Monster Hunters "temporarily powerful because they are useful": 1 town, Suppressed -> "wanted while the
 *    monsters are".
 *  - the faith "One of two rival sides claiming the legitimate succession" under a conversion: 4 towns, no succession
 *    in any -> "each claiming to be the true faith".
 *  - "a baker says he was told to raise it": 9 towns, 2 hold no baker -> "one of the sellers says they were told to
 *    raise it" (true in all 9).
 * RED AT THE BASE (4140ad9f4): every refused pair. Each refused line names what prints in its place.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
/** [seed, the refused words, the words that print in their place] */
const PAIRS = [
  ['r2s-politically_fractured-thorp-0', 'controls a distinct district or institution', 'Claims legitimate authority through different means and has a following of its own.'],
  ['r2s-politically_fractured-metropolis-0', 'controls a distinct district or institution', 'Claims legitimate authority through different means and has a following of its own.'],
  ['r2r-village-25', 'controls a distinct district or institution', 'Claims legitimate authority through different means and has a following of its own.'],
  ['r2s-wartime-metropolis-0', "Currently functioning smoothly: the war is going well enough that its authority isn't contested.", 'While the war goes well, few people ask what it does.'],
  ['r2s-wartime-metropolis-3', "Currently functioning smoothly: the war is going well enough that its authority isn't contested.", 'While the war goes well, few people ask what it does.'],
  ['r2s-monster_pressure-metropolis-2', 'temporarily powerful because they are useful', 'Outside professionals brought in or passing through; wanted while the monsters are.'],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2s-religious_conversion-village-3 lit draws no rival-sides line for
  // its faith; the lowest r2s-religious_conversion-village whose faith draws it is village-7 (7 8 9 15 18 19 of 200)
  ['r2s-religious_conversion-village-7', 'claiming the legitimate succession', 'One of two rival sides, each claiming to be the true faith: the legal standing of their records is contested.'],
  ['r2s-religious_conversion-metropolis-0', 'claiming the legitimate succession', 'One of two rival sides, each claiming to be the true faith: the legal standing of their records is contested.'],
  ['r2r-town-10', 'a baker says he was told to raise it', 'Bread went up twice this month, and one of the sellers says they were told to raise it.'],
  ['r2s-recently_betrayed-town-0', 'a baker says he was told to raise it', 'Bread went up twice this month, and one of the sellers says they were told to raise it.'],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2r-city-10 lit draws no bread hook; the lowest r2r-city that draws
  // it is city-12 (12 23 56 95 100 105 of 200)
  ['r2r-city-12', 'a baker says he was told to raise it', 'Bread went up twice this month, and one of the sellers says they were told to raise it.'],
];
/** KEEP: a true sibling of a cured line, green before and after [seed, words that must still print] */
const KEEP = [
  // RE-PICKED (point 117, ruling 117-1, 2026-11-25): the faith's conversion line is chosen by the governing faction's name
  // (`stressFactions.js`, its length mod 3); under the close's C1 r2s-religious_conversion-town-0's council is born the
  // "Council of Aldermen" (was "Corrupt Council") and draws the rival-sides line; the lowest r2s-religious_conversion-town
  // that draws this line is town-8.
  ['r2s-religious_conversion-town-8', 'Losing congregation to the new faith faster than leadership acknowledges publicly.'],
  ['r2s-wartime-metropolis-0', 'coordinating supply, conscription, and military contracting.'],
];
/** @type {Record<string, string>} */
const text = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...PAIRS.map((p) => p[0]), ...KEEP.map((k) => k[0])])) text[seed] = JSON.stringify(born(seed));
}, 300000);

describe('TAIL-POWERS-B-3 batch 6b · the stress factions and the bread hook claim what the record holds', () => {
  for (const [seed, refused, instead] of PAIRS) {
    it(`${seed}: "${refused}" does not print; "${instead}" prints instead`, () => {
      expectAbsentWithAnchor(text[seed], refused, instead, seed);
      expect(text[seed]).toContain(instead);
    });
  }
  for (const [seed, kept] of KEEP) {
    it(`KEEP ${seed}: "${kept}" still prints`, () => {
      expect(text[seed]).toContain(kept);
    });
  }
});
