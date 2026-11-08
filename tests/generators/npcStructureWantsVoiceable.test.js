/**
 * Lane R11, unit 3 (the chair's ruling, 2026-11-04): THE REGISTRY IN THE HOUSE REGISTER. Every
 * structural goal `npcStructure.js :: enrichNPCsWithStructure` writes into `goal.short` is printed
 * after "Wants to" (the Tonight sheet, the Quick Guide, the NPC card), so every one must pass the
 * one voiceable shape rule (`tonightSheet.js :: isVoiceableWant`). The goals are reached through
 * the enricher itself, condition by condition and rank by rank (no source scan, no export of the
 * table): 8 categories × 6 conditions × 2 ranks, 76 distinct lines (economy and crafts share one
 * entry; `other` maps four conditions onto its stable pair).
 */
import { describe, expect, it } from 'vitest';
import { enrichNPCsWithStructure } from '../../src/generators/npcStructure.js';
import { isVoiceableWant } from '../../src/domain/summary/tonightSheet.js';

const CATEGORIES = ['government', 'military', 'economy', 'crafts', 'religious', 'criminal', 'magic', 'other'];
/** The settlement states `getPrimaryCondition` reads, one per condition. */
const CONDITIONS = {
  governance_fractured: { powerStructure: { publicLegitimacy: { governanceFractured: true } } },
  corruption: { powerStructure: { criminalCaptureState: 'capture' } },
  food_crisis: { economicState: { foodSecurity: { label: 'Active Famine' } } },
  economic_stress: { economicState: { prosperity: 'Struggling' } },
  contested: { powerStructure: { publicLegitimacy: { isContested: true } } },
  stable: {},
};

/** Every goal the enricher writes, by `category__condition__rank`. */
function allGoals() {
  /** @type {Record<string, string>} */
  const out = {};
  for (const category of CATEGORIES) {
    for (const [condition, state] of Object.entries(CONDITIONS)) {
      const factions = [
        { faction: 'Top', category, power: 100, isGoverning: true },
        { faction: 'Second', category, power: 10 },
      ];
      const settlement = { ...state, powerStructure: { ...(state.powerStructure || {}), factions } };
      // MERGE-CAR-2 (2026-11-08): the cards in the people car's shape (the rank axis reads the first-rank
      // membership; `factionAffiliation` left the card at PEOPLE-5): A heads Top (dominant), B heads Second
      // (subordinate — a lesser power of the category), the two ranks the affiliations meant.
      const npcs = [
        { name: 'A', category, memberships: [{ power: 'Top', rank: 1, share: 1 }], role: 'Head' },
        { name: 'B', category, memberships: [{ power: 'Second', rank: 1, share: 1 }], role: 'Second' },
      ];
      for (const npc of enrichNPCsWithStructure(npcs, settlement)) {
        expect(npc.settlementCondition).toBe(condition);
        // MERGE-CAR-2: `structuralRank` is the card's STANDING since PEOPLE-2 ('head' for both cards here),
        // no longer the template's rank axis; the axis is keyed by the fixture's identity — A the dominant
        // card, B the subordinate — exactly the two ranks the enricher's getRank reads for them.
        const rank = npc.name === 'A' ? 'dominant' : 'subordinate';
        out[`${category}__${condition}__${rank}`] = npc.goal.short;
      }
    }
  }
  return out;
}

describe('R11 · every registry goal reads in the house register', () => {
  const goals = allGoals();

  it('the enricher reaches every category × condition × rank (96 keys, 76 distinct lines)', () => {
    expect(Object.keys(goals)).toHaveLength(CATEGORIES.length * 6 * 2);
    expect(new Set(Object.values(goals)).size).toBe(76);
  });

  // LANDING-R2 seat E: the 96 keys run inside one plain parameterless test, each labelled by key.
  it('every key\'s goal is voiceable', () => {
    for (const [key, goal] of Object.entries(goals)) expect(isVoiceableWant(goal), `${key}: ${goal}`).toBe(true);
  });

  it('the dominant and the subordinate of one cell never share a line (ONE WANT, ONE HOME)', () => {
    for (const category of CATEGORIES) {
      for (const condition of Object.keys(CONDITIONS)) {
        expect(goals[`${category}__${condition}__dominant`]).not.toBe(goals[`${category}__${condition}__subordinate`]);
      }
    }
  });
});
