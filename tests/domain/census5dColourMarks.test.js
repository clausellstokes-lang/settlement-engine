/**
 * CENSUS-5d (2026-11-05), unit 2 — the per-line `colour` marks (R-AO, CENSUS-1g `c000dd9`) on the
 * DS-FTH and DS-WAR pools this seat READ line by line; the reading's presumptions declared:
 *   DS-WAR-5 live front v3 ("outside its walls"), phantom front v1 ("outside the walls"),
 *     siege_lifted v2 ("stores, walls and people")                       `walls` (R-O: one word)
 *   DS-WAR-5 blockade stamped v3 ("points at the water")                 `navigable`
 *   DS-WAR-5 blockade stamped v1: "the roads or the harbour" presumes a harbour → reworded (R-U),
 *     "nothing about the routes themselves", then `colour`
 *   DS-FTH-3 PANTHEON RANK Major v2 ("the lawfulness of magic")          `magic`
 * Left unmarked (never marked unread or presuming): DS-FTH-1 SINK arc rising v1, "Crisis has a way
 * of ending indifference" — SOME crisis, waiting on CENSUS-1d unit 8 (R-O).
 */
import { describe, expect, it } from 'vitest';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { statePoolCounts, undeclaredRows } from '../../src/domain/facts/declarationRegisters.js';

const LEAF = DOSSIER_STATE_PROSE_WAR_FAITH;
const marksOf = (blockId, poolKey, re) => LEAF[blockId].pools[poolKey].find((v) => re.test(v.text))?.marks || [];

describe('CENSUS-5d unit 2 · DS-FTH / DS-WAR: every read line declares or is marked colour', () => {
  // Re-keyed by the compose (unit 2 item 6, 2026-11-06): the line that waited on unit 8 declares
  // `crisis` (R-I; tests/domain/facts/composeBareCrisis.test.js), so no DS-FTH / DS-WAR line is left.
  it('no undeclared line is left in DS-FTH and DS-WAR (the unit-8 line declares `crisis`)', () => {
    const rows = undeclaredRows(statePoolCounts([LEAF]));
    const mine = Object.entries(rows).filter(([k]) => /^DS-(FTH|WAR)-/.test(k));
    expect(mine).toEqual([]);
    expect(marksOf('DS-FTH-1', 'SINK: unaffiliated present, arc rising', /Crisis has a way of ending indifference/)).toContain('crisis');
  });

  it('the reading\'s presumptions declare', () => {
    expect(marksOf('DS-WAR-5', 'live war_front INTO the settlement (a genuine siege)', /outside its walls/)).toContain('walls');
    expect(marksOf('DS-WAR-5', 'phantom front (hostility with no army behind it)', /standing outside the walls/)).toContain('walls');
    expect(marksOf('DS-WAR-5', 'aftermath siege_lifted', /stores, walls and people/)).toContain('walls');
    expect(marksOf('DS-WAR-5', 'blockade stamped (recorded cause)', /points at the water/)).toContain('navigable');
    expect(marksOf('DS-FTH-3', 'PANTHEON RANK: Major', /lawfulness of magic/)).toContain('magic');
  });

  it('the blockade line presumes no harbour', () => {
    const texts = LEAF['DS-WAR-5'].pools['blockade stamped (recorded cause)'].map((v) => v.text);
    expect(texts.some((t) => /harbour/.test(t))).toBe(false);
  });
});
