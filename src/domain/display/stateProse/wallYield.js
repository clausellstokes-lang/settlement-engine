/**
 * domain/display/stateProse/wallYield.js — ONE NO-WALL LINE ON THE DEFENSE TAB (WORDS-2, the tenth chair's RULING G6 #9;
 * E2's census: two lines saying "no wall" on one tab, `docs/chair/2026-11-24/tenth/gen/words-2/E2-CENSUS.md` #9).
 *
 * The beasts row (DS-DEF-2, `defenseThreatProse`'s `beasts`) prints first on the tab; where its sentence is a variant
 * AUTHORED to say the place has no wall (`SAYS_NO_WALL`: "Beasts & Monsters: settled, nothing organized" v1), the
 * wall-rationale line (DS-DEF-11, `defenseWallRationaleProse`'s `rationale`), the second, yields when it is an UNWALLED
 * line. A walled line never yields. The variant is known by its authored text with the name filled (the template's
 * two halves around `{settlement}`), never by a word test of the sentence: this leaf reads a drawn line's identity, not
 * the defence facts (tests/lint/defenceFactReaders.walker.test.js keeps those to their one home). Applied where both
 * lenses are read: `components/new/defenseDeskRead.js` (the tab and the save's composer) and `printProse.js` (the print
 * desk), so all three print one line. Pure: no randomness, no clock.
 * @enforced-by tests/domain/defenseWordsFindings.test.js (G6 #9)
 */
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../../data/dossierStateProse/defense.generated.js';

/** The beasts row's variants authored to say the place has no wall: [pool, vid]. */
const SAYS_NO_WALL = Object.freeze([['Beasts & Monsters: settled, nothing organized', 1]]);

/** Each such variant's text around its one `{settlement}` slot. */
const HALVES = Object.freeze(SAYS_NO_WALL.flatMap(([pool, vid]) => {
  const block = /** @type {{ pools?: Record<string, ReadonlyArray<{ vid?: number, text?: string }>> } | undefined} */ (DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-2']);
  const v = (block?.pools?.[pool] || []).find((/** @type {{ vid?: number, text?: string }} */ x) => x?.vid === vid);
  const parts = typeof v?.text === 'string' ? v.text.split('{settlement}') : [];
  return parts.length === 2 ? [Object.freeze({ pool, head: parts[0], tail: parts[1] })] : [];
}));

/**
 * @param {{ sentence?: unknown, provenance?: { poolKey?: unknown } | null } | null | undefined} beasts
 * @returns {boolean} whether the beasts rung printed a variant authored to say the place has no wall
 */
function beastsSaidNoWall(beasts) {
  const s = beasts?.sentence;
  const pool = beasts?.provenance?.poolKey;
  if (typeof s !== 'string') return false;
  return HALVES.some((h) => h.pool === pool && s.length > h.head.length + h.tail.length
    && s.startsWith(h.head) && s.endsWith(h.tail));
}

/**
 * The wall desk's lenses with its line withdrawn where the beasts row's sentence says the place has no wall.
 * @template {{ rationale?: any }} W
 * @param {W} wall the wall desk's lenses (`defenseWallRationaleProse`)
 * @param {{ sentence?: unknown, provenance?: { poolKey?: unknown } | null } | null | undefined} beasts the beasts rung
 *   (`defenseThreatProse(...).beasts`)
 * @returns {W}
 */
export function wallAfterBeasts(wall, beasts) {
  const key = wall?.rationale?.provenance?.poolKey;
  return beastsSaidNoWall(beasts) && typeof key === 'string' && key.startsWith('UNWALLED')
    ? /** @type {W} */ (Object.freeze({ ...wall, rationale: null }))
    : wall;
}
