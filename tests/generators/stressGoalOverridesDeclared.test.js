/**
 * CENSUS-1e unit 2 (Appendix B item 23, T): the STRESS_GOAL_OVERRIDES resolve through the one rule against CENSUS-4b's
 * declarations. The insurgency's military override ("which members of the watch are loyal …") declares `watch`: with a
 * watch on the roster it is admitted; without one it is refused.
 * RE-KEYED BY CAUSE (ALLEGIANCE-CAR4, 2026-11-09): the overrides are the CRISIS family of the goals rebuilt
 * (people/goals.js, A9 at the seam's end; the design §6.1), no longer `mergeNPCLists`' rewrite of a born goal — so the
 * pin reads the family's candidate for the captain (the same line, the same atom, the same kind-T note), and a
 * refused override offers the captain NO crisis goal (it draws from the families its record supports instead).
 */
import { describe, expect, it } from 'vitest';
import { familyCandidates, goalContextOf } from '../../src/generators/people/goals.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';

const OVERRIDE = 'Determine which members of the watch are loyal to the institution and which are loyal to whoever is paying them';
const factions = [{ faction: 'Military/Guard', category: 'military', power: 30 }];

/** @param {Array<{name: string, category?: string}>} institutions */
function captain(institutions) {
  const npcs = [{ id: 'c', name: 'C', role: 'Guard Captain', category: 'military', memberships: [{ power: 'Military/Guard', rank: 1, share: 1 }] }];
  const settlement = { tier: 'town', institutions, npcs, powerStructure: { factions }, config: { stressType: 'insurgency' } };
  const ledger = [];
  const { result } = withPresumptionLedger(() => {
    const crisis = familyCandidates(npcs[0], npcs, goalContextOf(settlement, npcs, []), 'short', new Set()).CRISIS || [];
    for (const c of crisis) for (const n of c.notes || []) ledger.push(n); // the draw notes the line it prints
    return crisis;
  }, ledger);
  return { crisis: result, rows: ledger.filter((e) => String(e.pool).startsWith('npcGenerator:STRESS_GOAL_OVERRIDES')) };
}

describe('npcGenerator STRESS_GOAL_OVERRIDES (CENSUS-1e unit 2)', () => {
  it('(a) a watch on the roster: the override is admitted, noted with its atom', () => {
    const { crisis, rows } = captain([{ name: 'Town watch', category: 'Defense' }]);
    expect(crisis.map((c) => c.text)).toEqual([OVERRIDE]);
    expect(rows).toEqual([expect.objectContaining({ atoms: ['watch'], resolvedBy: 'drawn', drawKind: 'T' })]);
  });

  it('(b) no watch: the override is refused and the captain is offered no crisis goal', () => {
    const { crisis, rows } = captain([{ name: 'Market square', category: 'Economy' }]);
    expect(crisis).toEqual([]);
    expect(rows).toEqual([]);
  });
});
