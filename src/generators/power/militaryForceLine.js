/**
 * power/militaryForceLine.js — THE MILITARY POWER'S DESCRIPTION NAMES NO FORCE THE ROSTER LACKS (BAR5-POWERS, LAW 1c-force;
 * the audit's C39734 and C43925: 9 towns of the census's 720, 3 of the fresh 300). A leaf beside rulingStructure.js, which
 * stands at its module ceiling (F31: a split, never a raise).
 *
 * `generatePowerStructure` chooses the military power's description from `priorities.military` and the tier alone, never
 * from the roster: "Armed patrol of able-bodied residents" printed in villages with no militia and no watch, "Significant
 * military force for this scale" where no garrison, militia, watch or hired company stands. Each such line is read here
 * against the roster's defence atoms (`domain/facts/defence.js :: defenceOf`, THE ONE READER of the defence presence, over the
 * roster the step reads: the chair's ruling PW1 of 2026-11-16); where the roster holds none of the force a line names, its
 * twin says what is true of a place with no such force. No draw: the lines are fixed and the choice is the step's own.
 *
 * Pure: no randomness, no clock; it returns a line and writes nothing.
 */

import { defenceOf } from '../../domain/facts/defence.js';

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
 * @param {unknown} institutions the roster the step reads (its native institutions)
 * @returns {string}
 */
export function forceLineOf(line, institutions) {
  const row = FORCE_LINES.find((r) => typeof line === 'string' && line.startsWith(r.opens));
  if (!row) return line;
  /** @type {ForceFacts} */ const facts = defenceOf({ institutions });
  return row.needs.some((k) => facts[k] === true) ? line : row.twin;
}

// ── THE STABILITY'S "UNDERFUNDED" READS THE PURSE THE PROSPERITY LINE READS (BAR5-POWERS, LAW 1d; the audit's C32519: one
// town in 1,080) ──────────────────────────────────────────────────────────────────────────────────────────────────────────
// `governanceNarrative.js` writes "Tense (militarised, chronically underfunded)" from the forces' funding gate alone; the
// economy desk's prosperity line (DS-ECO-8) reads `economicState.prosperity` and, from Moderate up, says the town pays its
// own way. Where the town's purse is Moderate or better the word keeps "militarised" and claims no underfunding.
/** The prosperity bands whose line says the town has money in hand. */
const PURSE_IN_HAND = Object.freeze(['Moderate', 'Comfortable', 'Prosperous', 'Wealthy']);
/**
 * @param {unknown} stability the stability word the step wrote @param {unknown} prosperity `economicState.prosperity`
 * @returns {unknown}
 */
export function stabilityReadsPurse(stability, prosperity) {
  return stability === 'Tense (militarised, chronically underfunded)' && PURSE_IN_HAND.includes(String(prosperity)) ? 'Tense (militarised)' : stability;
}
