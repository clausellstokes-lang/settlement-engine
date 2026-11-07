/**
 * CENSUS-1e unit 2 (Appendix B item 23, T): `npcGenerator.js :: mergeNPCLists`'s
 * STRESS_GOAL_OVERRIDES resolve through the one rule against CENSUS-4b's declarations. The
 * insurgency's military override ("which members of the watch are loyal …") declares `watch`: with
 * a watch on the roster it replaces the goal; without one it is refused and the NPC keeps its goal.
 */
import { describe, expect, it } from 'vitest';
import { mergeNPCLists } from '../../src/generators/npcGenerator.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';

const OVERRIDE = 'Determine which members of the watch are loyal to the institution and which are loyal to whoever is paying them';
const OWN = { short: 'Keep the barracks dry.', long: 'Keep the barracks dry.' };
const factions = [{ faction: 'Military/Guard', category: 'military', power: 30 }];

/** @param {Array<{name: string, category?: string}>} institutions */
function captain(institutions) {
  const npcs = [{ id: 'c', name: 'C', role: 'Guard Captain', category: 'military', factionAffiliation: 'Military/Guard', goal: OWN }];
  const { result, ledger } = withPresumptionLedger(() => mergeNPCLists(npcs, factions, institutions, 'town', { stressType: 'insurgency' }));
  return { goal: result[0].goal, rows: ledger.filter((e) => String(e.pool).startsWith('npcGenerator:STRESS_GOAL_OVERRIDES')) };
}

describe('npcGenerator STRESS_GOAL_OVERRIDES (CENSUS-1e unit 2)', () => {
  it('(a) a watch on the roster: the override is admitted, noted with its atom', () => {
    const { goal, rows } = captain([{ name: 'Town watch', category: 'Defense' }]);
    expect(goal.short).toBe(OVERRIDE);
    expect(rows).toEqual([expect.objectContaining({ atoms: ['watch'], resolvedBy: 'drawn', drawKind: 'T' })]);
  });

  it('(b) no watch: the override is refused and the NPC keeps its goal', () => {
    const { goal, rows } = captain([{ name: 'Market square', category: 'Economy' }]);
    expect(goal).toEqual(OWN);
    expect(rows).toEqual([]);
  });
});
