/**
 * headOfItsPowerRow.test.js — COHERENCE-POWERS-8 (round three #723 #725 #1398, MEDIUM, npcStructure.js :: reg): A CARD
 * THAT HEADS ITS POWER IS NEVER "UNDER" ITS OWN BODY'S LEADERS. The faith's, the crews' and the casters' subordinate rows
 * ("Serves the faith under its leaders", "Holds a place in a crew …", "Works spells under the senior casters …") were dealt
 * to the FIRST of a religious, criminal or arcane power whenever that power stood below 0.85 of the ruler: in
 * rr2s-city-calm-rand-1, Malinalxochitl Jalach, Master of the Guild and first of Arcane Orders, "Works spells under the
 * senior casters, among officials who take bribes."; Chimalxochitl Chi, the network's head, "Holds a place in a crew that
 * has bought protection". The cure: the head of the strongest power of its kind reads its kind's head row ("Heads the
 * casters …"); the head of a lesser one takes no row and keeps its own goal (the refusal's rule).
 * Measured at the lane's tip on the census's 720 (probes/COHERENCE-POWERS-8/headsub.mjs): 290 heads in 191 towns read an
 * "under" row (religious 171, criminal 67, magic 52); 0 after (206 take the head row, 84 none).
 * Every expected word is a literal.
 */
import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const UNDER = /^(?:Serves the faith|Holds a place (?:under|in)|Works spells (?:under|that could help))/;
/** The round-three reader's shape (REVIEW-R2-STAGES render.rr2s.jsx :: cfgFor), and p8-<size>-<calm|stress>-<i> fresh. @param {string} seed */
function born(seed) {
  const m = seed.match(/^(?:rr2s|p8)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(?:([a-z]+)-)?(\d+)$/);
  if (!m) throw new Error(seed);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = !m[3] || m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} }));
}
/** A card's best rank among its memberships. @param {any} c */
const bestRank = (c) => Math.min(...(c.memberships || []).map((/** @type {any} */ m) => m.rank ?? 99), 99);

describe('COHERENCE-POWERS-8 · the head of its power is not under its leaders', () => {
  it('rr2s-city-calm-rand-1: the first of Arcane Orders heads the casters; the first of the Thieves\' Guild holds no place "in a crew"', async () => {
    await loadGenerationLawPayloads();
    const s = born('rr2s-city-calm-rand-1');
    const mage = s.npcs.find((/** @type {any} */ c) => c.name === 'Malinalxochitl Jalach');
    const boss = s.npcs.find((/** @type {any} */ c) => c.name === 'Chimalxochitl Chi');
    expect(mage.structuralPosition).toBe('Heads the casters among bribe-taking officials, where spells that hide things buy favour and debt.');
    expect(String(boss.structuralPosition ?? '')).not.toMatch(UNDER);
  }, 60000);
  it('rr2s-metropolis-plague_onset-port-1: Bebinn MacIntyre, the guild archmage, heads the casters', async () => {
    await loadGenerationLawPayloads();
    const s = born('rr2s-metropolis-plague_onset-port-1');
    const mage = s.npcs.find((/** @type {any} */ c) => c.name === 'Bebinn MacIntyre');
    expect(mage.structuralPosition).toBe('Heads the casters while rivals fight over the seat, and both sides want their spells.');
  }, 60000);
  it('fresh births: no card ranked first of its power reads an "under" row; a member below the first still may', async () => {
    await loadGenerationLawPayloads();
    let heads = 0;
    for (const seed of ['p8-town-calm-1', 'p8-city-calm-1', 'p8-city-calm-2', 'p8-metropolis-calm-1', 'p8-city-famine-1', 'p8-metropolis-succession_void-1', 'p8-village-calm-3']) {
      for (const c of born(seed).npcs) {
        if (bestRank(c) !== 1) continue;
        heads++;
        expect(String(c.structuralPosition ?? ''), `${seed} ${c.name}`).not.toMatch(UNDER);
      }
    }
    expect(heads).toBeGreaterThan(20);
  }, 120000);
});
