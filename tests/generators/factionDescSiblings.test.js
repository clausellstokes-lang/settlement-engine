/**
 * CENSUS-1e unit 2 (Appendix B item 23, the inline T branches of `rulingStructure.js`): the base
 * roster's descriptions CENSUS-5b declared in `FACTION_DESC_SIBLINGS` resolve where they print —
 * every set whose atoms are SETTLED before the power step. The two `militia` sets wait on order
 * (R-Q): a militia can join the roster after this step (the 1,000 at 1c00ed2 read the twin's
 * `no militia` false on the final record in 8 births, `cert:false-presumption`), so they print as
 * before and are not noted.
 */
import { describe, expect, it } from 'vitest';
import { generatePowerStructure } from '../../src/generators/power/rulingStructure.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';

// CENSUS-5c (the chair's ruling of 05:25): the militia line reworded to presume nothing about the guard (R-U).
const PATROL = "Armed patrol of able-bodied residents; the settlement's primary recourse when disputes turn physical.";
const TOWN_WATCH = 'Town watch; it enforces ordinances, manages disorder, and reports to the council.';
const config = { priorityMilitary: 50, priorityEconomy: 50, tradeRouteAccess: 'road' };

/** @param {string} tier @param {Array<{name: string, category?: string}>} institutions */
function militaryDesc(tier, institutions) {
  const { result, ledger } = withPresumptionLedger(() => generatePowerStructure(tier, { prosperity: 'Moderate' }, null, config, institutions));
  const row = (result.factions || []).find((f) => f.faction === 'Military/Guard');
  return { desc: row?.desc, ledger: ledger.filter((e) => e.pool === 'rulingStructure:FACTION_DESC_SIBLINGS') };
}

describe('rulingStructure FACTION_DESC_SIBLINGS (CENSUS-1e unit 2)', () => {
  it('(a) R-Q measured (CENSUS-5c): the patrol line presumes no militia — it prints the same with or without one, unnoted', () => {
    for (const roster of [[{ name: 'Village militia', category: 'Defense' }], [{ name: 'Shrine', category: 'Religious' }]]) {
      const { desc, ledger } = militaryDesc('village', roster);
      expect(desc?.startsWith(PATROL)).toBe(true);
      expect(ledger).toEqual([]);
    }
  });

  it('(b) a settled set resolves where it prints: the town watch line, noted with its atom', () => {
    const { desc, ledger } = militaryDesc('town', [{ name: 'Town watch', category: 'Defense' }]);
    expect(desc?.startsWith(TOWN_WATCH)).toBe(true);
    expect(ledger).toEqual([expect.objectContaining({ atoms: ['watch'], resolvedBy: 'drawn', drawKind: 'T' })]);
  });

  it('(c) COHERENCE-PRESUME: the town watch line names no militia (it printed in 91 of 91 corpus towns with none)', () => {
    const { desc } = militaryDesc('town', [{ name: 'Town watch', category: 'Defense' }]);
    expect(desc?.startsWith(TOWN_WATCH)).toBe(true);
    expect(desc).not.toMatch(/militia/i); // anchored: the line above proves the town watch line is the one printed
  });
});
