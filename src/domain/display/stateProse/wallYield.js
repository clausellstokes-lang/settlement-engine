/**
 * domain/display/stateProse/wallYield.js — ONE NO-WALL LINE ON THE DEFENSE TAB (WORDS-2, the tenth chair's RULING G6 #9;
 * E2's census: two lines saying "no wall" on one tab, `docs/chair/2026-11-24/tenth/gen/words-2/E2-CENSUS.md` #9).
 *
 * The beasts row (DS-DEF-2, `defenseThreatProse`'s `beasts`) prints first on the tab; where its sentence already says the
 * place has no wall ("Beasts & Monsters: settled" v1), the wall-rationale line (DS-DEF-11, `defenseWallRationaleProse`'s
 * `rationale`), the second, yields when it is an UNWALLED line. A walled line never yields. Applied where both lenses are
 * read: `components/new/defenseDeskRead.js` (the tab and the save's composer) and `printProse.js` (the print desk), so all
 * three print one line. Pure: no import, no randomness, no clock.
 * @enforced-by tests/domain/defenseWordsFindings.test.js (G6 #9)
 */

/**
 * The wall desk's lenses with its line withdrawn where the beasts row's sentence says the place has no wall.
 * @template {{ rationale?: any }} W
 * @param {W} wall the wall desk's lenses (`defenseWallRationaleProse`)
 * @param {{ sentence?: unknown } | null | undefined} beasts the beasts rung (`defenseThreatProse(...).beasts`)
 * @returns {W}
 */
export function wallAfterBeasts(wall, beasts) {
  const key = wall?.rationale?.provenance?.poolKey;
  const said = typeof beasts?.sentence === 'string' && /\bhas no wall\b/.test(beasts.sentence);
  return said && typeof key === 'string' && key.startsWith('UNWALLED') ? /** @type {W} */ (Object.freeze({ ...wall, rationale: null })) : wall;
}
