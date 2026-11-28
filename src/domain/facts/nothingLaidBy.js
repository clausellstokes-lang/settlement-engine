/**
 * domain/facts/nothingLaidBy.js — NOTHING LAID BY: THE ONE HOME OF THE ATOM `nothing laid by` (SURVEY S-B, the eleventh chair's
 * RULING S-B-1 of 2026-11-28; vetoable by the owner, on the veto list as new vocabulary for a fact the page already prints).
 *
 * The Economic Survival row reads Weak or Critical (`display/defenseScoreBands.js :: economicSurvivalBandOf`, the one home the
 * Defense desk's DS-DEF-2 row is keyed on: "has nothing laid by to pay for a long defence", "would have to borrow the money
 * first"). MOVED here from `display/solvencyShown.js` (RULING-R, unit B2, the eleventh chair, 2026-11-27), which re-exports it,
 * so the Economy desk's savings lines and the vocabulary read one function. A line that says the place has savings excludes it.
 *
 * Pure, display only.
 */
import { economicSurvivalBandOf } from '../display/defenseScoreBands.js';

/**
 * @param {unknown} settlement @returns {boolean} the Economic Survival row reads Weak or Critical
 */
export function nothingLaidByShown(settlement) {
  const band = economicSurvivalBandOf(/** @type {Parameters<typeof economicSurvivalBandOf>[0]} */ (settlement));
  return band === 'WEAK' || band === 'CRITICAL';
}
