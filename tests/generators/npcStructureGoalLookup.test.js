/**
 * CENSUS-1e unit 1 (the chair's message of 02:30 to CENSUS-1d, not reached there): THE REGISTRY
 * GOAL LOOKUP RESOLVES THROUGH THE ONE RULE. `npcStructure.js :: enrichNPCsWithStructure` reads an
 * entry of the registry by `category__condition__rank` (Appendix B item 23, kind T). CENSUS-4b put
 * `tags: ['no crisis']` on the sixteen `stable` entries (R-F 4: "current stability" is a claim under
 * ANY crisis); the lookup now resolves the entry through `resolveDeclared(…, { tagged: true })`
 * against the settlement's facts, so a `stable` entry under an active crisis is refused and the NPC
 * keeps its role goal (CENSUS-4b: no twin owed, the slot never empties). Under calm the entry is
 * admitted and every field is byte-identical; an entry with no tags is admitted everywhere.
 */
import { describe, expect, it } from 'vitest';
import { enrichNPCsWithStructure } from '../../src/generators/npcStructure.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';

const ROLE_GOAL = { short: 'Keep the ledgers straight.', long: 'Keep the ledgers straight.' };

/** @param {Record<string, unknown>} extra */
function enrich(extra) {
  const factions = [
    { faction: 'Council', category: 'government', power: 100, isGoverning: true },
    { faction: 'Lesser', category: 'government', power: 10 },
  ];
  const settlement = { tier: 'town', ...extra, powerStructure: { ...(/** @type {any} */ (extra).powerStructure || {}), factions } };
  // MERGE-CAR-2 (2026-11-08): the cards in the people car's shape — the rank axis reads the FIRST-RANK
  // membership (PEOPLE-2; `factionAffiliation` left the card at PEOPLE-5). A heads the governing power
  // (dominant), B heads the lesser one (subordinate), as the two affiliations meant.
  const npcs = [
    { id: 'a', name: 'A', category: 'government', memberships: [{ power: 'Council', rank: 1, share: 1 }], role: 'Mayor', goal: ROLE_GOAL },
    { id: 'b', name: 'B', category: 'government', memberships: [{ power: 'Lesser', rank: 1, share: 1 }], role: 'Clerk', goal: ROLE_GOAL },
  ];
  return withPresumptionLedger(() => enrichNPCsWithStructure(npcs, settlement));
}

describe('npcStructure registry goal lookup (CENSUS-1e unit 1)', () => {
  it('(a) a stable entry under an active crisis is refused: the NPC keeps its role goal and takes no calm position', () => {
    const { result, ledger } = enrich({ stress: [{ type: 'under_siege' }] });
    for (const npc of result) {
      expect(npc.goal).toEqual(ROLE_GOAL);
      expect(npc.structuralPosition).toBeUndefined();
      expect(npc.activeConstraint).toBeUndefined();
    }
    const rows = ledger.filter((e) => String(e.pool).startsWith('NPC_STRUCTURE.'));
    expect(rows.length).toBe(0); // a refused cell with no admitted member notes nothing (drawDeclared's 'none')
  });

  it('(b) under calm the stable entry is admitted, byte-identical, and noted with its atom', () => {
    const { result, ledger } = enrich({});
    expect(result[0].goal.short).toBe('Fix the weakness in the seat that nobody wants to talk about, before someone uses it.');
    expect(result[0].structuralPosition).toMatch(/^Holds governing authority in a settlement with functional legitimacy/);
    expect(result[0].settlementCondition).toBe('stable');
    expect(Object.keys(result[0].goal)).toEqual(['short', 'long']);
    const rows = ledger.filter((e) => String(e.pool).startsWith('NPC_STRUCTURE.'));
    expect(rows.length).toBe(2);
    expect(rows[0]).toMatchObject({ surface: 'npcs', drawKind: 'T', resolvedBy: 'drawn', atoms: ['no crisis'] });
  });

  it('(c) an entry with no tags is admitted under a crisis (silence is neutral)', () => {
    const { result } = enrich({ stress: [{ type: 'under_siege' }], powerStructure: { publicLegitimacy: { isContested: true } } });
    expect(result[0].goal.short).toBe('Win the doubters back before the challenger to the seat wins them first.');
    expect(result[0].settlementCondition).toBe('contested');
  });
});
