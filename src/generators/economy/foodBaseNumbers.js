/**
 * economy/foodBaseNumbers.js — THE BASE NUMBERS (FOOD-2), shared by the canonical food writer and the legacy view.
 * Moved VERBATIM out of foodBalance.js (DEBT-1, 2026-11-17: the module ceiling is cured by a split, never raised, as
 * LANDING-R2 cured it under ODQ §934.105); foodBalance.js re-exports both readers, so every importer keeps its path.
 * Pure: a function of its numbers only.
 */
/** The share of need a town and larger draw from their hinterland as NORMAL supply (FOOD-2):
 *  the tier import shares the food writer always carried, now counted as supply, not a gap. */
const HINTERLAND_SHARE_PCT = Object.freeze({ thorp: 0, hamlet: 0, village: 5, town: 20, city: 38, metropolis: 52 });
/** @param {string} tier @returns {number} 0..1 */
export function hinterlandShareOf(tier) {
  return (HINTERLAND_SHARE_PCT[/** @type {keyof typeof HINTERLAND_SHARE_PCT} */ (tier)] ?? 0) / 100;
}
/**
 * The share of its own need a household grows on land of this effective capacity
 * (geographyData's agricultureCapacity plus the resource bonus). A place is sized to what its
 * land feeds, so the land moves the share gently: ordinary land grows about 100–125%, poor
 * land runs short.
 * @param {number} effectiveAgri
 * @returns {number}
 */
export function grownShareOf(effectiveAgri) {
  return (11 / 10) * (1 + ((effectiveAgri - 1) * 5) / 20);
}
