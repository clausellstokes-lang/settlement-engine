/**
 * domain/display/shadowEconomyShown.js — THE SHADOW ECONOMY AS THE ECONOMICS TAB SHOWS IT, FOR EVERY SURFACE
 * (TAIL-EXPORTS-PDF batch 1, the chair's ruling E1 of 2026-11-14: the export prints what the tab prints, through the
 * tab's own leaf).
 *
 * The Economics tab draws its Shadow Economy block only where the safety profile's capture share is three or more
 * (`EconomicsTab.jsx`: `if (!sp || bmc < 3) return null`, composed inline); the PDF's SHADOW ECONOMY block printed
 * "Black market capture: 0% of economy" in every one of the census's 720 towns, a share the tab never prints. The
 * floor lives here now; the tab's switch to it is the DISPLAY-ECON group's (it holds EconomicsTab.jsx).
 *
 * `criminalsStandHere`: whether anyone the record names works against the law here — a criminal house
 * (`criminalInstitutions`), a crime pattern (`crimeTypes`), or a shadow share the tab prints. The PDF's enforcement
 * line set "those who keep order" against "the criminals" in towns with none of the three.
 *
 * Pure: no randomness, no clock, no write.
 */

/** The capture share at and above which the tab prints its Shadow Economy block. */
export const SHADOW_CAPTURE_FLOOR = 3;

/**
 * The capture share as the tab prints it, or null where the tab prints no Shadow Economy block.
 * @param {{ blackMarketCapture?: unknown } | null | undefined} safetyProfile `economicState.safetyProfile`
 * @returns {number | null}
 */
export function shadowCaptureShown(safetyProfile) {
  const n = Number(safetyProfile?.blackMarketCapture);
  return Number.isFinite(n) && n >= SHADOW_CAPTURE_FLOOR ? n : null;
}

/**
 * Does anyone the record names work against the law here?
 * @param {{ blackMarketCapture?: unknown, criminalInstitutions?: unknown, crimeTypes?: unknown } | null | undefined} safetyProfile
 * @returns {boolean}
 */
export function criminalsStandHere(safetyProfile) {
  const list = (/** @type {unknown} */ v) => (Array.isArray(v) ? v.length : 0);
  return list(safetyProfile?.criminalInstitutions) > 0 || list(safetyProfile?.crimeTypes) > 0 || shadowCaptureShown(safetyProfile) != null;
}
