/**
 * CENSUS-5c (2026-11-05), the chair's ruling under R-A (05:25): FACTION_DESC_SIBLINGS' two militia
 * sets, parked by CENSUS-1e under R-Q ("waiting on order"), are MEASURED and cured.
 *
 * The measurement (the 1,000, a probe at the military-description draw in `rulingStructure.js`,
 * the native roster's `factsOf(...).defence` against `factsOf(final record).defence`, every power
 * step of every birth): `watch` never differs (0), `garrison` differs 9 times, `militia` 33 times
 * (false at the draw, true on the final record: soak1k-73, -85, -229, -331, -558, -559 …). The two
 * lines presume a militia, and a militia is NOT settled at that draw, so no field can be handed
 * through `birthFactsOf` (R-V / R-Z). R-U: they are reworded to presume nothing about the guard. The
 * wording is each set's own twin (CENSUS-5b's, already the chair's ruling, R-G), so no new line:
 *   "Part-time militia with limited organisation; …"  →  "Part-time armed volunteers with limited organisation; …"
 *   "Armed patrol and informal militia; …"            →  "Armed patrol of able-bodied residents; …"
 */
import { describe, expect, it } from 'vitest';
import { generatePowerStructure } from '../../src/generators/power/rulingStructure.js';
import { FACTION_DESC_SIBLINGS } from '../../src/data/powerSiblings.js';

const VOLUNTEERS = 'Part-time armed volunteers with limited organisation; authority is moral rather than institutional.';
const RESIDENTS = "Armed patrol of able-bodied residents; the settlement's primary recourse when disputes turn physical.";

/** @param {number} priorityMilitary @param {Array<{name: string, category?: string}>} institutions */
function militaryDesc(priorityMilitary, institutions) {
  const config = { priorityMilitary, priorityEconomy: 50, tradeRouteAccess: 'road' };
  const result = generatePowerStructure('village', { prosperity: 'Moderate' }, null, config, institutions);
  return (result.factions || []).find((f) => f.faction === 'Military/Guard')?.desc;
}

const ROSTERS = Object.freeze([[{ name: 'Village militia', category: 'Defense' }], [{ name: 'Shrine', category: 'Religious' }]]);

describe('CENSUS-5c · the militia sets reworded to presume nothing about the guard (R-Q measured, R-U)', () => {
  it('a mid-priority village prints the able-bodied residents line, militia or not', () => {
    for (const roster of ROSTERS) expect(militaryDesc(50, roster)?.startsWith(RESIDENTS), roster[0].name).toBe(true);
  });

  it('a low-priority village prints the armed volunteers line, militia or not', () => {
    for (const roster of ROSTERS) {
      const desc = militaryDesc(20, roster);
      if (desc !== undefined) expect(desc.startsWith(VOLUNTEERS), roster[0].name).toBe(true);
    }
  });

  it('no FACTION_DESC_SIBLINGS set declares the unsettled militia any more', () => {
    const atoms = Object.values(FACTION_DESC_SIBLINGS).flat().flatMap((l) => [...(l.needs || []), ...(l.excludes || [])]);
    expect(atoms.length, 'the sets still declare atoms').toBeGreaterThan(0);
    expect(atoms).not.toContain('militia'); // anchored: the line above proves the declared atoms are read
  });
});
