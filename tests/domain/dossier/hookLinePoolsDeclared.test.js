/**
 * HOOK_LINE_POOLS declares what it presumes (CENSUS-2c unit 3b; the ledger
 * `docs/census/declarations/HOOK_LINE_POOLS.json`). Site 90 is CENSUS-1d's (`createConflictHookDraw`
 * and `foodGapHookLine` draw over the full pool through `drawDeclared`), so a declaration here is
 * ENFORCED: a refused line moves to the admitted line with the highest kernel hash.
 */
import { describe, it, expect } from 'vitest';
import { HOOK_LINE_POOLS, createConflictHookDraw, foodGapHookLine } from '../../../src/domain/dossier/hookLines.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { textOf } from '../../../src/domain/facts/textOf.js';

const UNGUARDED = factsOf({ tier: 'village', institutions: [{ name: 'Granary' }] });
const GUARDED = factsOf({ tier: 'town', institutions: [{ name: 'Town watch' }] });
const SIEGE = factsOf({ tier: 'town', institutions: [{ name: 'Weekly market' }], stress: [{ type: 'under_siege' }] });

describe('HOOK_LINE_POOLS: the declared lines', () => {
  it('"posted guards" needs a guard presence (the rulings §3: watch, garrison, militia or a hired company)', () => {
    expect(HOOK_LINE_POOLS.conflict.property[0]).toMatchObject({ needs: ['guardPresence'] });
    expect(GUARDED.guardPresence).toBe(true);
    expect(UNGUARDED.guardPresence).toBe(false);
  });
  it('no property conflict prints "posted guards" where no guard stands, over every pool offset', () => {
    for (let k = 0; k < 40; k++) {
      const line = createConflictHookDraw(UNGUARDED)({ parties: [`A${k}`, `B${k}`], issue: 'a land claim on the mill' })[0];
      expect(line.includes('has posted guards')).toBe(false);
    }
  });
  it('the food-gap lines that say grain or food is coming in are refused under a siege; the forward-buying line needs a market', () => {
    const fg = HOOK_LINE_POOLS.foodGap;
    expect(fg[0]).toMatchObject({ excludes: ['crisis: under_siege'] });
    expect(fg[1]).toMatchObject({ excludes: ['starving', 'famine', 'crisis: famine', 'crisis: under_siege'] });
    expect(fg[3]).toMatchObject({ excludes: ['crisis: under_siege'] });
    expect(fg[4]).toMatchObject({ needs: ['market'] });
    const admitted = new Set([2, 4, 5].map((i) => textOf(fg[i])));
    for (let k = 0; k < 30; k++) expect(admitted.has(foodGapHookLine({ name: `Avel${k}`, band: 'Import-Dependent' }, SIEGE))).toBe(true);
  });
});
