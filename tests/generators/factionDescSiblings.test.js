/**
 * CENSUS-1e unit 2 (Appendix B item 23, the inline T branches of `rulingStructure.js`): the base
 * roster's descriptions CENSUS-5b declared in `FACTION_DESC_SIBLINGS` resolve where they print. A
 * village at a middling military priority prints the "Armed patrol and informal militia" line; it
 * declares `militia`, so with no militia on the native roster its twin prints in its place.
 */
import { describe, expect, it } from 'vitest';
import { generatePowerStructure } from '../../src/generators/power/rulingStructure.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';

const ORIGINAL = "Armed patrol and informal militia; the settlement's primary recourse when disputes turn physical.";
const TWIN = "Armed patrol of able-bodied residents; the settlement's primary recourse when disputes turn physical.";
const config = { priorityMilitary: 50, priorityEconomy: 50, tradeRouteAccess: 'road' };

/** @param {Array<{name: string, category?: string}>} institutions */
function militaryDesc(institutions) {
  const { result, ledger } = withPresumptionLedger(() => generatePowerStructure('village', { prosperity: 'Moderate' }, null, config, institutions));
  const row = (result.factions || []).find((f) => f.faction === 'Military/Guard');
  return { desc: row?.desc, ledger: ledger.filter((e) => e.pool === 'rulingStructure:FACTION_DESC_SIBLINGS') };
}

describe('rulingStructure FACTION_DESC_SIBLINGS (CENSUS-1e unit 2)', () => {
  it('(a) a militia on the roster: the original prints, noted with its atom', () => {
    const { desc, ledger } = militaryDesc([{ name: 'Village militia', category: 'Defense' }]);
    expect(desc?.startsWith(ORIGINAL)).toBe(true);
    expect(ledger).toEqual([expect.objectContaining({ atoms: ['militia'], resolvedBy: 'drawn' })]);
  });

  it('(b) no militia: the declared twin prints in its place', () => {
    const { desc, ledger } = militaryDesc([{ name: 'Shrine', category: 'Religious' }]);
    expect(desc?.startsWith(TWIN)).toBe(true);
    expect(ledger).toEqual([expect.objectContaining({ resolvedBy: 'twin' })]);
  });
});
