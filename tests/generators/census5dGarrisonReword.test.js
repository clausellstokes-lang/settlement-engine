/**
 * CENSUS-5d (2026-11-05), the chair's answer 2 to CENSUS-5c (R-AN, R-U): FACTION_DESC_SIBLINGS'
 * three twin-less GARRISON sets are reworded now.
 *
 * The measurement (CENSUS-5c, the 1,000, a probe at the faction-description draw in
 * `rulingStructure.js`): `garrison` differs between the draw and the final record on 9 of 2,121
 * power steps, so it is NOT settled at that draw (R-AN: "differs on some birth" is "not settled");
 * a line declaring it is true today by luck, not by declaration. `watch` differs on 0 of 2,121, so
 * it IS settled there (R-V) and the two city lines keep declaring it. Each line is reworded to
 * presume only what its branch and the settled watch guarantee:
 *   "Military commanders and garrison officers hold …"  →  "Military commanders and their officers hold …"   (no declaration; leaves the table)
 *   "Well-funded garrison and city watch; …"            →  "Well-funded city watch; …"                         (declares `watch`)
 *   "Garrison and city watch; law enforcement …"        →  "City watch; law enforcement …"                     (declares `watch`)
 */
import { describe, expect, it } from 'vitest';
import { generatePowerStructure } from '../../src/generators/power/rulingStructure.js';
import { FACTION_DESC_SIBLINGS } from '../../src/data/powerSiblings.js';

// Re-keyed with cause (SW-B1 CONTRADICTIONS, STYLE-RULINGS-2 B1 with the 10:2x addition): the line's words re-spelled under the style law, the sibling row with it.
const WELL_FUNDED = 'Well-funded city watch; it keeps order reliably and is growing more sure of its own authority.';
const STRETCHED = 'City watch; law enforcement and external defence, stretched between multiple responsibilities.';
// Re-keyed with cause (W3 POW third seat, the owner's style law of 2026-11-07, worklist #174): the description's words moved.
const COMMANDERS = 'Military commanders and their officers carry the most weight; ordinary business waits on the needs of defence.';

describe('CENSUS-5d · the garrison sets reworded to presume nothing about the unsettled garrison (R-AN, R-U)', () => {
  it('no FACTION_DESC_SIBLINGS set declares the unsettled garrison (or militia) any more', () => {
    const atoms = Object.values(FACTION_DESC_SIBLINGS).flat().flatMap((l) => [...(l.needs || []), ...(l.excludes || [])]);
    expect(atoms.length, 'the sets still declare atoms').toBeGreaterThan(0);
    expect(atoms).not.toContain('garrison'); // anchored: the line above proves the declared atoms are read
    expect(atoms).not.toContain('militia'); // anchored: the same atoms are proven non-empty two lines above
  });

  it('the two city watch lines are declared sets on the settled watch alone', () => {
    expect(FACTION_DESC_SIBLINGS[WELL_FUNDED]?.[0]?.needs).toEqual(['watch']);
    expect(FACTION_DESC_SIBLINGS[STRETCHED]?.[0]?.needs).toEqual(['watch']);
    expect(FACTION_DESC_SIBLINGS[COMMANDERS]).toBeUndefined();
  });

  it('a mid-priority city prints a city-watch line that names no garrison, garrison or not', () => {
    const rosters = [[{ name: 'City watch', category: 'Defense' }, { name: 'Garrison', category: 'Defense' }], [{ name: 'City watch', category: 'Defense' }]];
    for (const roster of rosters) {
      const config = { priorityMilitary: 50, priorityEconomy: 50, tradeRouteAccess: 'road' };
      const result = generatePowerStructure('city', { prosperity: 'Moderate' }, null, config, roster);
      const desc = (result.factions || []).find((f) => f.faction === 'Military/Guard')?.desc;
      if (desc === undefined) continue;
      expect(desc.startsWith(WELL_FUNDED) || desc.startsWith(STRETCHED), desc).toBe(true);
      expect(desc).not.toMatch(/garrison/i); // anchored: the same desc is proven to open with a city-watch line on the line above
    }
  });
});
