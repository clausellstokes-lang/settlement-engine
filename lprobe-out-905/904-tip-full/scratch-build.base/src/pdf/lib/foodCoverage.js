/**
 * pdf/lib/foodCoverage.js — the food-import coverage formula, in one place.
 *
 * coverage% = importCoverage (a quantity) ÷ the pre-import gap (rawDeficit).
 * SINGLE source so the chapter headline, its tone colour, and the viewModel food
 * slice can't silently drift apart (they previously each re-implemented the ratio).
 * Returns the RAW percent, or null when there is no coverage; callers apply their
 * own rounding/thresholds (the headline rounds, the tone compares the raw ratio at
 * a 60% boundary where rounding would flip the classification).
 *
 * @param {number} importCoverage  quantity imports cover
 * @param {number} rawDeficit      pre-import gap
 * @returns {number|null}
 */
export function coverageRatioPct(importCoverage, rawDeficit) {
  const ic = importCoverage || 0;
  return ic > 0 ? (ic / (rawDeficit || ic)) * 100 : null;
}
