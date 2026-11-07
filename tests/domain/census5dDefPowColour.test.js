/**
 * CENSUS-5d (2026-11-05), unit 2b — DS-DEF and DS-POW read line by line (R-R / R-AO). A pool whose
 * every line presumes nothing beyond its key is braced `{colour}` at pool level (R-R; a keyed pool
 * does not re-declare its key, R-B1); a mixed pool's presumes-nothing lines take the per-line
 * `colour` mark (R-AO); a line presuming a fact its key does not guarantee declares it (33 lines:
 * the watch, the walls, the gate, the garrison, magic, the granary, the market, hunger). Two
 * rewords (R-U): DS-POW-1 Endorsed v4 "the watch is not the reason" (the pool's {settlement}-only floor), DS-DEF-6 Legal Infrastructure Court + Prison v3, "on the same square" (no home).
 * Left unmarked (they presume a fact with no home yet):
 *   DS-DEF-2 Economic Survival STRONG v3 "Trouble … has not turned into a collapse" (some crisis: unit 8)
 *   DS-POW-7 receipt deferred v2 (the alignment cap) and v3 (an outbid): the deferral's reason has no home.
 */
import { describe, expect, it } from 'vitest';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { statePoolCounts, undeclaredRows } from '../../src/domain/facts/declarationRegisters.js';

const LEAVES = [DOSSIER_STATE_PROSE_DEFENSE, DOSSIER_STATE_PROSE_POWER];
const pool = (b, k) => (DOSSIER_STATE_PROSE_DEFENSE[b] || DOSSIER_STATE_PROSE_POWER[b]).pools[k];
const marksOf = (b, k, re) => pool(b, k).find((v) => re.test(v.text))?.marks || [];

describe('CENSUS-5d unit 2b · DS-DEF / DS-POW: every read line declares or is colour', () => {
  // Re-keyed by the compose (unit 2 item 6, 2026-11-06): DS-DEF-2 Economic Survival STRONG v3 waited
  // on unit 8 and now declares `crisis` (R-I); the two DS-POW-7 deferral lines still wait on a home.
  it('only the two lines waiting on a home stay undeclared in DS-DEF and DS-POW', () => {
    const mine = Object.entries(undeclaredRows(statePoolCounts(LEAVES))).filter(([k]) => /^DS-(DEF|POW)-/.test(k));
    expect(mine.sort()).toEqual([
      ['DS-POW-7::receipt deferred (the alignment exists and has not happened)', 2],
    ]);
  });

  it('the reading\'s presumptions declare (a sample of the 33)', () => {
    expect(marksOf('DS-DEF-7', 'besiegedBy present', /There is an army at/)).toEqual(expect.arrayContaining(['walls', 'gate']));
    expect(marksOf('DS-DEF-10', 'posture UNDER TRIBUTE (indebted)', /the garrison is met afterwards/)).toContain('garrison');
    expect(marksOf('DS-DEF-6', 'Naval Defense: Under blockade', /a magical channel/)).toContain('magic');
    expect(marksOf('DS-POW-1', 'breakdown dominated by FOOD, adverse', /granary door/)).toContain('institution: granary');
    // Endorsed v4 is reworded rather than declared (R-U): it is the pool's one {settlement}-only line, the
    // anchored-liveness floor under a refused {seat} fill (powerStateProseDesk.test.js), so a watch it named
    // would mute the banner in a watch-less town: "the watch is not the reason" -> "enforcement is not the reason".
    expect(marksOf('DS-POW-1', 'Endorsed', /enforcement is not the reason/)).toContain('colour');
  });

  it('no line puts the court and the prison on a square the record does not hold', () => {
    expect(pool('DS-DEF-6', 'Legal Infrastructure: Court + Prison').some((v) => /same square/.test(v.text))).toBe(false);
  });
});
