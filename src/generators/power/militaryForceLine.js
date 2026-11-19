/**
 * power/militaryForceLine.js — THE MILITARY POWER'S DESCRIPTION NAMES NO FORCE THE ROSTER LACKS (BAR5-POWERS, LAW 1c-force;
 * the audit's C39734 and C43925: 9 towns of the census's 720, 3 of the fresh 300). A leaf beside rulingStructure.js, which
 * stands at its module ceiling (F31: a split, never a raise).
 *
 * `generatePowerStructure` chooses the military power's description from `priorities.military` and the tier alone, never
 * from the roster: "Armed patrol of able-bodied residents" printed in villages with no militia and no watch, "Significant
 * military force for this scale" where no garrison, militia, watch or hired company stands. Each such line is read here
 * against the FINAL roster's defence atoms (`domain/facts/defence.js :: defenceOf`, THE ONE READER of the defence presence: the
 * chair's ruling PW1 of 2026-11-16); where the roster holds none of the force a line names, its twin says what is true of
 * a place with no such force. No draw: the lines are fixed and the choice is the step's own.
 *
 * ⛔ R-Q / R-U (CENSUS-5c, tests/generators/census5cMilitiaReword.test.js): a militia is NOT settled at the power step (33
 * of 1,000 births gain one after it), so the step's own roster may not key a line that presumes one. The atoms are read
 * ONLY when the caller hands the settled ones (`projection.forces`, the late replay's); without them the line prints
 * as the step chose it. Measured at the tip with the step's roster (the batch taken back for this law): every one of
 * the 14 twins in the 1,080 towns agreed with the final roster.
 *
 * Pure: no randomness, no clock; it returns a line and writes nothing.
 */

/** @typedef {{ garrison?: boolean, militia?: boolean, watch?: boolean, mercenary?: boolean }} ForceFacts */

/** "Armed patrol …" (thorp, hamlet, village) where neither a militia nor a watch stands. */
export const NO_PATROL_LINE = 'No watch or patrol stands here; those who would take up arms if trouble came speak for the settlement\'s defence.';
/** "Significant military force / presence …" where no force of any kind stands. */
export const NO_FORCE_LINE = 'No standing force is kept here, and the question of raising one comes up whenever civic business is discussed.';

/** @type {ReadonlyArray<keyof ForceFacts>} */
const ANY_FORCE = Object.freeze(/** @type {const} */ (['garrison', 'militia', 'watch', 'mercenary']));
/** @type {ReadonlyArray<keyof ForceFacts>} */
const PATROL = Object.freeze(/** @type {const} */ (['militia', 'watch']));
/** @type {ReadonlyArray<{ opens: string, needs: ReadonlyArray<keyof ForceFacts>, twin: string }>} */
const FORCE_LINES = Object.freeze([
  { opens: 'Armed patrol of able-bodied residents;', needs: PATROL, twin: NO_PATROL_LINE },
  { opens: 'Significant military force for this scale;', needs: ANY_FORCE, twin: NO_FORCE_LINE },
  { opens: 'Significant military presence;', needs: ANY_FORCE, twin: NO_FORCE_LINE },
]);

/**
 * The military description as the roster bears it: the line itself where the roster holds a force it names, else its twin.
 * @param {string} line the description the step chose
 * @param {ForceFacts | null | undefined} forces the SETTLED roster's defence atoms (`defenceOf(settlement)`), or none
 * @returns {string}
 */
export function forceLineOf(line, forces) {
  const row = FORCE_LINES.find((r) => typeof line === 'string' && line.startsWith(r.opens));
  if (!row || !forces || typeof forces !== 'object') return line;
  return row.needs.some((k) => forces[k] === true) ? line : row.twin;
}

// ── BAR6-POWERS (LAW 10: 10f-kind, 10f-tier; LAW 6: 6d-blurb): two more cards read here, beside rulingStructure.js (F31) ──
// 10f-kind (the audit's C121364): a city's or a metropolis's council seat that its governing kind renames (a High Theocratic
// Council, a Military City Council) took the plain council's card ("guild masters, and appointed magnates"), because the
// seat's own card was read first only for a Town Council: the three council bodies read alike now.
// 10f-tier (C128237): the merchants' lowest card ("a small group of traders who come on market days") is a small place's
// line; a city or a metropolis whose merchants carry little weight takes a line that claims no size of their number.

/** The council bodies whose seat the governing kind renames (`rulingStructure.js :: chooseGoverning`). */
export const COUNCIL_BODIES = Object.freeze(['Town Council', 'City Council', 'Grand Council']);

/** The merchants' lowest card in a city or a metropolis. */
export const MERCHANTS_OF_LITTLE_WEIGHT_LARGE = 'Merchants trade here in number but carry little weight in how the place is run; they speak up in small disputes and seldom beyond them.';

/**
 * The merchants' lowest card for the tier: the market-day line where the place is a town or smaller, else its twin.
 * @param {unknown} tier the settlement's tier @param {() => string} small the market-day line, resolved only where it is chosen (R-AM)
 * @returns {string}
 */
export function marketDayLineOf(tier, small) {
  return tier === 'city' || tier === 'metropolis' ? MERCHANTS_OF_LITTLE_WEIGHT_LARGE : small();
}
