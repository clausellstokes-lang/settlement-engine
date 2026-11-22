/**
 * arrivalLandmarkWordings.js — THE LANDMARK SAID FROM THE HOUSE THAT STANDS (ARRIVAL-LINES-2, the chair's read of
 * 2026-11-20 20:02: 31 of 32 drafted lines approved, with cures; `docs/chair/2026-11-20/content/page/lines/
 * ARRIVAL-LINES-2-TO-CHAIR.md`; the chair's common rules of 20:31 (rules 1, 2, 7) and its word of 20:50 on rule 2).
 *
 * The arrival paragraph's SIGHT beat names a landmark through `structuralValidator.js :: checkInstCompat`: eight
 * branches, first match wins, each a substring test (`has`) over the native institution names, two lines a branch,
 * ONE `pickRandom` on the arrival substream. Four branches carried the paragraph's sameness on their own (three places
 * of a size sharing a landmark sentence: metropolis 51.6%, city 27.1%, town 20.9% on 150 a size). This file holds those
 * four branches' NEW wordings, keyed by BRANCH, and the door through which a drawn line is said as one of them:
 *
 *   1. The `pickRandom` is untouched (no draw added, removed or moved): `checkInstCompat` draws exactly as before.
 *   2. A LITERAL HAS ONE HOME: checkInstCompat's lines are never copied here, nor keyed by their text. It hands back
 *      the drawn landmark WITH its branch, its index there and its row (`{ text, branch, index, line }`; the chair's
 *      ruling 13 of 22:34), so the drawn line is named by branch and index and its declaration is read from its own
 *      row (`drawnRowOf`). The candidate list is composed AT THE CALL SITE (`arrivalScene.js :: composeArrivalScene`):
 *        `sayLandmark([drawnRowOf(landmark), ...landmarkSiblingsOf(landmark.branch)], names, facts, key)`.
 *   3. A row is a candidate only where its HOUSE stands: `house` is the native-name fragment the branch's own `has`
 *      reads (a substring of a native name, lowercased), so no vocabulary atom is added. The drawn line's house is
 *      its branch's own test, which stands wherever the branch was reached: the 57 lines that name a house grander than
 *      the roster's are NAMED, NOT CURED (the chair).
 *   4. The list passes the door's filter WHOLE (`drawDeclared.js :: filterDeclared` on the facts), the drawn line
 *      included: so "unremarkable but intact" is not said under siege, and no line needing walls, a gate or a church
 *      is said where the record's readers refuse it (a ruined house still reaches its branch by name).
 *   5. The keyed pick: `proseHash.js :: pickVariantMixed` over the admitted rows, keyed on the arrival substream's seed
 *      and the beat (`${seed}::landmark`). Draw-free. Where nothing is admitted the door answers null and the culture's
 *      built detail speaks, the existing fall-back.
 *
 * ALL 31 OF THE CHAIR'S APPROVED LINES ARE HERE (its read of 20:02: 31 of 32, great cathedral [10] struck, three
 * cures), three of them in the words its ruling 13 (22:34) approved where a walker had redded the drafted words: the
 * citadel's [3] "plainly built to be held, not admired" (no "rather than", the style law), its [7] "The road passes
 * beneath the citadel ..." (no "The road in") and the great cathedral's [16] "... built to be seen from a long way off"
 * (no "from far off"; both the presumption classes' arrival from outside). Ruling 13 also approved the declarations the
 * chair did not see in the draft: `church` on every cathedral row and `tier: ≥ village` on the two that say "streets"
 * (the size class; neither branch is reached below a city, so it refuses nowhere).
 *
 * Only the picked row is noted in the presumption ledger (pool `arrivalLandmarkWordings:<branch>`, `lineId` = its `id`:
 * `<branch>/0` and `/1` for checkInstCompat's two, `<branch>/+k` for the new, k = the draft's NEW [k]). A row naming a
 * cathedral declares `church` (the presumed-things walker's atom for the word; the faith reading's `hasChurch`, true
 * wherever a cathedral stands). The voice bible's bars hold: no em dash, no exclamation mark, no digit; no climate,
 * season, species, crime, event or person. FIRST PAINT (rule 7): to be imported only by `arrivalScene.js`, a generator
 * (the lazy `engine` chunk); its own imports are already that module's.
 *
 * @enforced-by tests/generators/arrivalLandmarkSaid.test.js
 */
import { filterDeclared } from '../domain/facts/drawDeclared.js';
import { notePresumption, withPresumptionLedger } from '../domain/facts/presumptionLedger.js';
import { pickVariantMixed } from '../kernel/proseHash.js';

/**
 * @typedef {{ id: string, text: string, house: ReadonlyArray<string>, needs?: ReadonlyArray<string>,
 *   excludes?: ReadonlyArray<string> }} LandmarkRow
 * @typedef {{ branch: string, said: ReadonlyArray<LandmarkRow> }} LandmarkBranch
 * @typedef {{ needs?: ReadonlyArray<string>, excludes?: ReadonlyArray<string> }} Declared
 */

/** The new wordings, keyed by branch (row id `<branch>/+k`, k = the draft's NEW [k]). @type {ReadonlyArray<LandmarkBranch>} */
export const LANDMARK_WORDINGS = Object.freeze(/** @type {LandmarkBranch[]} */ ([
  Object.freeze({
    branch: 'great cathedral',
    said: Object.freeze([
      { id: 'great cathedral/+2', text: 'The great cathedral is in sight long before anything else of the settlement is, and it stays in sight the whole way in.', house: ['great cathedral'], needs: ['church'] },
      { id: 'great cathedral/+3', text: 'The roofs of the settlement gather around the great cathedral the way a crowd gathers around a speaker.', house: ['great cathedral'], needs: ['church'] },
      { id: 'great cathedral/+4', text: 'Carved figures line the front of the great cathedral, row above row.', house: ['great cathedral'], needs: ['church'] }, // the chair's cure: no "worn" (an age)
      { id: 'great cathedral/+5', text: 'Wherever the road bends, the great cathedral is somewhere above the rooftops ahead.', house: ['great cathedral'], needs: ['church'] },
      { id: 'great cathedral/+6', text: "The great cathedral's doors stand taller than any house in the settlement.", house: ['great cathedral'], needs: ['church'] },
      { id: 'great cathedral/+7', text: "Buttresses march along the great cathedral's flanks, each one thicker than a cottage.", house: ['great cathedral'], needs: ['church'] },
      { id: 'great cathedral/+8', text: 'The great cathedral seems less a building than a second settlement, raised in stone above the first.', house: ['great cathedral'], needs: ['church'] },
      { id: 'great cathedral/+9', text: 'The streets all seem to lean toward the great cathedral, as if it were the reason they were laid down.', house: ['great cathedral'], needs: ['church', 'tier: ≥ village'] },
      // the draft's [10] (the bells) is struck by the chair: the senses beat already rings the faith's bells
      { id: 'great cathedral/+11', text: "Coloured glass glints in the great cathedral's windows from a long way down the road.", house: ['great cathedral'], needs: ['church'] },
      { id: 'great cathedral/+12', text: "The great cathedral's long roof rides above every other roof in the settlement.", house: ['great cathedral'], needs: ['church'] },
      { id: 'great cathedral/+13', text: "The great cathedral's size is hard to judge from the road, because nothing near it is large enough to measure it by.", house: ['great cathedral'], needs: ['church'] },
      { id: 'great cathedral/+14', text: 'Towers flank the front of the great cathedral, and the whole skyline of the settlement is built around them.', house: ['great cathedral'], needs: ['church'] },
      { id: 'great cathedral/+15', text: 'The great cathedral stands at the heart of the settlement, and every lane seems to know the way to it.', house: ['great cathedral'], needs: ['church'] },
      { id: 'great cathedral/+16', text: 'The great cathedral was plainly built to be seen from a long way off, and it is.', house: ['great cathedral'], needs: ['church'] }, // the chair's rewording (ruling 13, 22:34): "from far off" -> "from a long way off"
    ]),
  }),
  Object.freeze({
    branch: 'cathedral',
    said: Object.freeze([
      { id: 'cathedral/+2', text: "The cathedral's tower stands over the roofs, and the streets seem to bend toward it.", house: ['cathedral'], needs: ['church', 'tier: ≥ village'] },
      { id: 'cathedral/+3', text: 'A cathedral of plain, heavy stone rises out of the middle of the settlement.', house: ['cathedral'], needs: ['church'] },
      { id: 'cathedral/+4', text: 'The cathedral rises well above the houses around it, which keep a respectful distance.', house: ['cathedral'], needs: ['church'] }, // the chair's cure: no "largest in sight" (a citadel may stand)
    ]),
  }),
  Object.freeze({
    branch: 'massive wall / citadel',
    said: Object.freeze([
      { id: 'massive wall / citadel/+2', text: 'The walls run on as far as the eye can follow, with towers set into them at steady intervals.', house: ['walls'], needs: ['walls'] },
      { id: 'massive wall / citadel/+3', text: 'The citadel stands a little apart from the houses, plainly built to be held, not admired.', house: ['citadel'] }, // the chair's rewording (ruling 13, 22:34): no "rather than"
      { id: 'massive wall / citadel/+4', text: 'The walls stand higher than the houses behind them, so that from the road you see stone first and roofs only afterward.', house: ['walls'], needs: ['walls'] },
      { id: 'massive wall / citadel/+5', text: "The citadel's keep is the tallest thing in sight, and it has very few windows.", house: ['citadel'] },
      { id: 'massive wall / citadel/+6', text: "Banners hang from the citadel's towers, the first colour you see on the approach.", house: ['citadel'] },
      { id: 'massive wall / citadel/+7', text: 'The road passes beneath the citadel, close enough to see how thick its foundations are.', house: ['citadel'] }, // the chair's rewording (ruling 13, 22:34): no "The road in"
    ]),
  }),
  Object.freeze({
    branch: 'wall / gatehouse',
    said: Object.freeze([
      { id: 'wall / gatehouse/+2', text: 'A plain wall runs round the settlement, no higher than it needs to be.', house: ['walls'], needs: ['walls'] },
      { id: 'wall / gatehouse/+3', text: 'The road narrows to pass through the gate, and carts take their turn.', house: ['gates'], needs: ['gate'], excludes: ['crisis: under_siege'] }, // the chair's cure: the excludes
      { id: 'wall / gatehouse/+4', text: 'The wall is the first thing you reach on the road in, and the houses begin just inside it.', house: ['walls'], needs: ['walls'] },
      { id: 'wall / gatehouse/+5', text: 'The gate stands open, its heavy doors folded back against the wall.', house: ['gates'], needs: ['gate', 'walls'], excludes: ['crisis: under_siege'] },
      { id: 'wall / gatehouse/+6', text: 'Houses lean against the inside of the wall here and there, using it as their back.', house: ['walls'], needs: ['walls'] },
      { id: 'wall / gatehouse/+7', text: "The gate's arch is deep enough that the road goes dim for a few steps before the settlement opens out.", house: ['gates'], needs: ['gate'] },
      { id: 'wall / gatehouse/+8', text: 'A wall encloses the settlement, mended where it needed mending and otherwise left alone.', house: ['walls'], needs: ['walls'], excludes: ['crisis: under_siege'] },
      { id: 'wall / gatehouse/+9', text: 'From the last stretch of road the wall is all you see of the settlement, a long line with roofs showing above it.', house: ['walls'], needs: ['walls'] },
    ]),
  }),
]));

/**
 * Does a row's house stand: one of its fragments is a substring of a live native name (lowercased), as `has` reads.
 * @param {{ house: ReadonlyArray<string> }} r @param {ReadonlyArray<string>} names
 */
export const houseStands = (r, names) => r.house.some((h) => names.some((n) => n.includes(h)));

/**
 * A branch's new wordings (none for a branch this file does not hold).
 * @param {string} branch @returns {ReadonlyArray<LandmarkRow>}
 */
export function landmarkSiblingsOf(branch) {
  return LANDMARK_WORDINGS.find((b) => b.branch === branch)?.said ?? [];
}

/**
 * The drawn line as a declared row: checkInstCompat's landmark (its text, branch, index and row, ruling 13), its id
 * `<branch>/<index>`, its declaration read from its own row there (a bare string declares nothing). Its house is its
 * branch's own test (`house: ['']`: every name holds the empty fragment), reached where it was drawn.
 * @param {{ text: string, branch: string, index: number, line: string | Declared }} landmark @returns {LandmarkRow}
 */
export function drawnRowOf(landmark) {
  const { needs, excludes } = typeof landmark.line === 'object' && landmark.line ? landmark.line : /** @type {Declared} */ ({});
  return Object.freeze({
    id: `${landmark.branch}/${landmark.index}`, text: landmark.text, house: Object.freeze(['']),
    ...(needs ? { needs } : {}), ...(excludes ? { excludes } : {}),
  });
}

/**
 * The landmark said from the house that stands (see the header). Draw-free.
 * @param {ReadonlyArray<LandmarkRow>} candidates `[drawnRowOf(landmark), ...landmarkSiblingsOf(landmark.branch)]`
 * @param {ReadonlyArray<string>} names the native institution names, lowercased (absences removed)
 * @param {object | null | (() => object | null)} facts `factsOf(record)`, or a thunk to it
 * @param {string} key the keyed pick's seed (`${arrival substream seed}::landmark`)
 * @returns {string | null}
 */
export function sayLandmark(candidates, names, facts, key) {
  const rows = candidates.filter((r) => houseStands(r, names));
  if (!rows.length) return null;
  /** @type {any[]} */ const notes = [];
  const first = String(rows[0].id);
  const poolId = `arrivalLandmarkWordings:${first.slice(0, first.lastIndexOf('/'))}`; // a branch name may hold a slash
  const { result: admitted } = withPresumptionLedger(() => filterDeclared(rows, { facts, poolId, surface: 'overview', drawKind: 'H' }), notes);
  const picked = pickVariantMixed(admitted, key);
  if (!picked) return null;
  for (const n of notes) if (n.lineId === picked.id) notePresumption(n);
  return picked.text;
}
