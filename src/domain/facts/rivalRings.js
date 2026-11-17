/**
 * domain/facts/rivalRings.js — RIVAL RINGS STAND IN THE TOWN (BAR7-DESKS, LAW 9's `9i.crews` of BRIEF-BAR7 item 6; NEW
 * VOCABULARY, on the owner's veto list). The vocabulary's `rival rings` atom: two criminal powers that do not govern, or
 * the roster's "Multiple criminal factions", read through the one reading the crime leaf already takes
 * (`corruption.js :: rivalRingsOf`, which `criminalStructureKey.js` reads for its key). A line that says rival crews are
 * fighting over the streets presumes them; the semi-organised key alone does not (a lone gambling den keys it too).
 *
 * ITS ONE IMPORT is the engine-core module that holds the reading (`corruption.js`, already in the eager closure through
 * `criminalStructureKey.js`, which `factsOf.js` reads): no module pinned lazy is reached (ruling EG1). Pure.
 * @enforced-by tests/domain/bar7DesksLines.test.js
 */
import { rivalRingsOf } from '../corruption.js';

/**
 * @param {unknown} record the settlement (or a birth's partial: its powers and its roster)
 * @returns {boolean}
 */
export function rivalRingsStand(record) {
  const r = /** @type {{ powerStructure?: { factions?: unknown }, institutions?: unknown } | null | undefined} */ (record);
  return rivalRingsOf(r?.powerStructure?.factions, r?.institutions);
}
