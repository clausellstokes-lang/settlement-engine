/**
 * bar2PeopleTies.test.js — BAR2-PEOPLE batch B (REVIEW-BAR-2, the TIES worklist; the chair's rulings PP4, PP6, PP7 and
 * PT3 of 2026-11-15, vetoable by the owner), on births:
 *   PP4 one home for a pair's trust: a later tie's line agrees with what the pair's first trust line stated
 *   PP6 the watch line claims neither funding nor order (false in 57 of 101), its `watch` kept
 * and (PP7) each line below claimed a fact the record may deny, and the vocabulary has no word to
 * declare it (a card's public council seat; the faith's relation to the seat; a monster threat): each is reworded to
 * claim no more than every town that prints it bears, text only, its declarations unchanged (no draw moves):
 *   - the bitter history's "placed on the same council committee" (95 ties; 70 name a card outside the ruling body)
 *   - the faith's stable seat "at peace with the seat beside it" (75 towns; 20 beside a competitive or tense relation)
 *   - the armed stable seat's "With nothing threatening" (74 towns; 15 beside a plagued monster threat)
 * RED AT THE BASE (f8042b61a): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline as bornVoiced } from '../../src/generators/generateSettlementPipeline.js';
import { todayOf } from '../generators/power/powerLinesToday.js'; // PEOPLE-2 B2: re-keyed by identity, each voiced power line read back to the line it voices
/** @param {Parameters<typeof bornVoiced>} a */ const generateSettlementPipeline = (...a) => todayOf(bornVoiced(...a));
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape (r2r-) @param {string} seed */
function born(seed) {
  const m = seed.match(/^r2r-(\w+)-\d+$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  const b = seed.match(/^bar0-(\w+)-([a-z_+]+)-rand-\d+$/); // the bar's towns, born as the census bears them
  if (!b) throw new Error(`no shape for ${seed}`);
  const stresses = b[2] === 'calm' ? [] : b[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: b[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}

/** [town, the line that must not print, what prints in its place] */
const ROWS = /** @type {Array<[string, string, string]>} */ ([
  ['r2r-hamlet-48', 'have been placed on the same council committee.', 'have been handed the same dispute to settle together. The first meeting is next week.'],
  ['r2r-village-13', 'Leads the faith in quiet times, at peace with the seat beside it.', 'Leads the faith in quiet times, whatever it thinks of the seat beside it.'],
  ['r2r-village-46', 'With nothing threatening, it is hard to win the coin and the say that would be needed if trouble came.', 'It is hard to win the coin and the say that would be needed if worse trouble came.'],
  // PP4 (C13193's town, Weihu: Tian Ma and Xiao Gao "disagree often and trust completely")
  ['bar0-hamlet-calm-rand-4', 'They cooperate efficiently and neither trusts the other at all.', 'Tian Ma and Xiao Gao trade favours on a strict count.'],
  // PP6 (a coordinated crime wave beside it)
  ['r2r-city-0', 'Well-funded city watch; it keeps order reliably and is growing more sure of its own authority.', 'City watch; it answers for keeping order and is growing more sure of its own authority.'],
]);
/** KEEP: [town, a true sibling of the same row that must still print] */
const KEEP = /** @type {Array<[string, string]>} */ ([
  ['r2r-village-46', 'Commands those under arms in quiet times; the work is keeping trouble from starting.'],
  ['r2r-village-13', 'With nothing pressing, it is easy to grow comfortable and hard to argue for growing.'],
  ['bar0-hamlet-calm-rand-4', 'Xiao Gao and Tian Ma disagree often and trust completely.'], // the pair's first trust line stands
]);

/** @type {Record<string, string>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...ROWS.map((r) => r[0]), ...KEEP.map((r) => r[0])])) {
    const s = born(seed);
    towns[seed] = JSON.stringify({ npcs: s.npcs, relationships: s.relationships, rumour: s.prominentRelationship ?? null, powers: s.powerStructure.factions.map((f) => f.desc) });
  }
}, 600000);

describe('BAR2-PEOPLE batch B · the ties and the seats claim what every town bears (PP4, PP6, PP7)', () => {
  for (const [seed, refused, instead] of ROWS) {
    it(`${seed}: not "${refused.slice(0, 48)}…"; the reworded line prints`, () => {
      expectAbsentWithAnchor(towns[seed], refused, instead, `${seed}: the refused line; its rewording in the same slot`);
      expect(towns[seed]).toContain(instead);
    });
  }
  for (const [seed, kept] of KEEP) {
    it(`KEEP ${seed}: "${kept.slice(0, 48)}…" still prints`, () => {
      expect(towns[seed]).toContain(kept);
    });
  }
});
