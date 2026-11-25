/**
 * display/powersStrongestFirst.js — THE ONE READER OF THE POWERS IN POWER ORDER (D4, the tenth chair's BIRTH-2; intake item 1,
 * "ORDER-TAIL").
 *
 * The stored roster (`powerStructure.factions`) is NOT always strongest-first: the power step sorts it
 * (`factionDynamics.js :: applyLegitimacyMultipliers`), and later steps add to it without a re-sort: the density law appends
 * each minted rival at the end (`density/applyDensityLaw.js :: resizeSeats`), and the fold adds a folded power's share to
 * the ruler in place (`power/rulerKin.js :: foldKin`), so the ruler can outgrow the first row. Measured at 0ec96f13d8 on
 * the close's two corpora: 69 of 900 births of C and 121 of 900 of V store them out of order. THE PAGE SORTS; no birth
 * moves: every print site that names the strongest, or the first few, reads the roster through this one leaf.
 *
 * A copy, strongest first; equal powers keep the roster's own order (a stable sort, as the PDF's view model sorts:
 * `pdf/lib/viewModel.js`). A power with no number counts as 0. Never mutates its input.
 * @template {{ power?: unknown }} F
 * @param {ReadonlyArray<F> | null | undefined} factions
 * @returns {F[]}
 */
export function powersStrongestFirst(factions) {
  if (!Array.isArray(factions)) return [];
  const strength = (/** @type {F} */ f) => Number(f?.power) || 0;
  return factions.slice().sort((a, b) => strength(b) - strength(a));
}
