/**
 * tests/generators/npcStructureDeclared.test.js — CENSUS-1d unit 2 (the chair's R-A ruling of
 * 2026-11-05 02:30): `npcStructure.js :: enrichNPCsWithStructure` resolves its registry entry
 * through `resolveDeclared`, so CENSUS-4b's CALM_ONLY tags (`no crisis`) are ENFORCED: a
 * `stable` entry ("Fix the weakness in the seat that nobody wants to talk about…") is not applied
 * under an active crisis, and the NPC keeps its own role goal. Under calm it applies as before.
 *
 * Red-first at a3a383ae5 (the merge of 4b's tags; the lookup unwired): the crisis arm fails.
 *
 * @enforced-by npx vitest run tests/generators/npcStructureDeclared.test.js
 */
import { describe, expect, it } from 'vitest';
import { enrichNPCsWithStructure } from '../../src/generators/npcStructure.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';

// MERGE-CAR-2 (2026-11-08): the card in the people car's shape — the rank axis reads the first-rank
// membership (PEOPLE-2; `factionAffiliation` left the card at PEOPLE-5); the Mayor heads the Council.
const npc = () => ({ name: 'Oswin Hale', role: 'Mayor', category: 'government', memberships: [{ power: 'Council', rank: 1, share: 1 }], goal: { short: 'role goal', long: 'role goal' } });
const place = (stress) => ({
  tier: 'town', stress, institutions: [],
  powerStructure: { factions: [{ faction: 'Council', category: 'government', power: 60, isGoverning: true }], publicLegitimacy: {} },
  economicState: { prosperity: 'Comfortable', foodSecurity: {} },
});

describe('the registry lookup enforces its tags (CENSUS-4b, CALM_ONLY)', () => {
  it('calm: the stable entry applies, noted in the ledger', () => {
    const out = withPresumptionLedger(() => enrichNPCsWithStructure([npc(), npc()], place([])));
    expect(out.result[0].settlementCondition).toBe('stable');
    expect(out.result[0].goal.short).toMatch(/Fix the weakness in the seat/);
    expect(out.ledger.some((e) => e.pool === 'NPC_STRUCTURE.government__stable__dominant' && e.atoms.includes('no crisis'))).toBe(true);
  });

  it('under a crisis the stable entry is refused: the role goal stays, no calm position is written', () => {
    const [mayor] = enrichNPCsWithStructure([npc(), npc()], place([{ type: 'infiltrated' }]));
    expect(mayor.goal.short).toBe('role goal');
    expect(mayor.structuralPosition).toBeUndefined();
  });
});
