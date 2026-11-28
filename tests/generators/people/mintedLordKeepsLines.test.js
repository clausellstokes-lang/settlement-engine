/**
 * mintedLordKeepsLines.test.js — COHERENCE-POWERS-6 (item 3; REVIEW-POWERS-2 at 313c67e2b, section 6): A MINTED LORD PUSHES
 * NO TRUE LINE OFF A CARD. The enrichment cut (npcStructure.js :: enrichNPCsWithStructure) gives the structural position,
 * constraint and goal to the TOP_N cards of the cast; a lord minted for a claim or for a noble body (castPowers.js, the
 * CLAIMANT_FACE row, "the lord") enlarged the cast and moved the cut, so a card that had its line lost it: six true house
 * lines on the review's 720 at point 46 ("Belongs to a lesser family behind the leading one while the seat fails", "Leads a
 * squad…", "Runs a smaller house…", "Heads an old family…"), and more once item 1 minted a lord for every noble body.
 * The cut is now taken over the cast less those lords; a lord keeps the lines it reads within the whole cast's cut.
 *
 * Births through the census's births (DEFAULT_CONFIG and the browser's dials), the review's seeds; every expected line a
 * literal. The property arm re-runs the enrichment on fresh births with and without their minted lords.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { enrichNPCsWithStructure } from '../../../src/generators/npcStructure.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
/** @param {string} settType @param {string} seed @param {string | null} [stress] */
const born = (settType, seed, stress = null) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType,
  ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });

/** The six the review read true (seed, size, crisis, card id, the true line now), literals. */
const SIX = Object.freeze([
  // these two headed the old families' body at e86d069be ("Heads an old family while the seat fails, …"); its minted lord
  // heads it since point 46, so the line in its place is the one their rank behind the lord reads
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): the miller of r2r-village-56 and the shepherd of r2s-succession_void-hamlet-0 lit read no row (each
  // second of The Highborn Circle behind its minted lord); the lowest r2r-village and r2s-succession_void-hamlet whose card reads
  // the line in its minted lord's own body are village-231 (alone of 0..899) and hamlet-107 (alone of 0..199)
  ['r2r-village-231', 'village', null, 'npc_mill', 'Belongs to a lesser family behind the leading one while the seat fails.'],
  ['r2s-succession_void-hamlet-107', 'hamlet', 'succession_void', 'npc_woodcutter_s_camp', 'Belongs to a lesser family behind the leading one while the seat fails.'],
  // POWERS-9 (re-keyed by identity, the cause): this tailor is third of the Elder Council (a government power), in no old
  // family's body, so "Belongs to a lesser family behind the leading one" was false of him; he reads no row (BODY_KINDS)
  ['r2s-succession_void-village-3', 'village', 'succession_void', 'npc_tailor', null],
  ['r2s-succession_void-town-0', 'town', 'succession_void', 'npc_town_watch', 'Leads a squad whose members are split over whether the seat deserves obeying.'], // TAIL-TIES-3 (T11): the contested rows claim no rival, re-keyed by identity
  ['r2s-succession_void-town-2', 'town', 'succession_void', 'npc_mills_2_5', 'Belongs to a lesser family behind the leading one while the seat fails.'],
  ['r2s-succession_void-town-2', 'town', 'succession_void', 'npc_vintner', null], // TAIL-TIES-3 (T11): no power of the trade stands in the town (two noble bodies and a church), so no house leads it: the card claims no position (it keeps its own goal)
]);

/** A minted lord: a power's own face under the lord's title, literals. @param {any} c */
// RE-KEYED BY IDENTITY (TAIL-TITLES K-C): a woman lord's title and role read "the lady"; the face she holds is her `institution.title`
const isMintedLord = (c) => c?.institution?.kind === 'power' && (c?.institution?.title ?? c?.title) === 'the lord';
/** The card as the enrichment first meets it (its structural fields not yet written). @param {any} c */
const bare = (c) => { const { structuralPosition, activeConstraint, settlementCondition, structuralRank, ...rest } = c; void structuralPosition; void activeConstraint; void settlementCondition; void structuralRank; return rest; };

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('COHERENCE-POWERS-6 item 3: a minted lord pushes no true line off a card', () => {
  it('the review\'s six true house lines are on their cards again', () => {
    const misses = SIX.flatMap(([seed, t, st, id, line]) => {
      const card = (born(t, seed, st).npcs || []).find((c) => c.id === id);
      return (card?.structuralPosition ?? null) === line ? [] : [`${seed} ${id}: "${card?.structuralPosition ?? '(none)'}"`];
    });
    expect(misses).toEqual([]);
  });

  it('on fresh births with minted lords: the cards beside them read the same lines with the lords taken away', () => {
    const misses = [];
    let lords = 0;
    for (const [t, st] of [['town', null], ['city', null], ['metropolis', null], ['village', 'succession_void'], ['town', 'succession_void'], ['city', 'succession_void']]) {
      for (let i = 0; i < 6; i += 1) {
        const seed = `pfu-lines-${t}-${st || 'calm'}-${i}`;
        const s = born(t, seed, st);
        const cast = (s.npcs || []).map(bare);
        if (!cast.some(isMintedLord)) continue;
        lords += cast.filter(isMintedLord).length;
        const withLords = new Map(enrichNPCsWithStructure(cast, s).map((c) => [c.id, c]));
        for (const c of enrichNPCsWithStructure(cast.filter((x) => !isMintedLord(x)), { ...s, npcs: cast.filter((x) => !isMintedLord(x)) })) {
          const w = withLords.get(c.id);
          if ((w?.structuralPosition ?? null) !== (c.structuralPosition ?? null)) misses.push(`${seed} ${c.id}: "${w?.structuralPosition ?? '(none)'}" against "${c.structuralPosition ?? '(none)'}"`);
        }
      }
    }
    expect(lords, 'the arm meets minted lords').toBeGreaterThan(5);
    expect(misses).toEqual([]);
  }, 300000);
});
