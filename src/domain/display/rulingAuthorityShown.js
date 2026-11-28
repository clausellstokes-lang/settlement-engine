/**
 * domain/display/rulingAuthorityShown.js — THE RULING AUTHORITY ROW IS NOT PRINTED ABOVE WHAT THE RECORD SAYS OF THE SAME
 * GOVERNMENT (TAIL-DISPLAY-CIVIC; the chair's ruling X8 of 2026-11-14, vetoable by the owner; READ-ALL 16764 16767).
 *
 * The Foundations row "Ruling authority" bands the causal model's composite (`causalState.js :: deriveRulingAuthority`:
 * half the governing legitimacy, half the governing power's weight, the conditions that declare it). Power held weighs in
 * it, so the row keeps its composite, BUT it printed "Adequate" or "Surplus" beside the record's own "Legitimacy Crisis"
 * and "Governance fractured" (r2r-thorp-58) and "Surplus" beside a contested right to rule. THE CAP, in the row's own scale
 * (surplus > adequate > strained > critical > collapsed; no new word):
 *   - where the record gives the public's legitimacy as a crisis, or governance as fractured
 *     (`powerStructure.publicLegitimacy.label === 'Legitimacy Crisis'` / `.governanceFractured`): at most "strained",
 *     the scale's word below Adequate;
 *   - where the public's legitimacy is only contested (`label === 'Contested'`): at most "adequate", never Surplus.
 * A band at or below the cap is left as it is. Pure: no draw, no write; the model's score does not move.
 */

/** The row's scale, worst first (SubstrateTab.jsx's BAND_RANK). */
const RANK = Object.freeze({ collapsed: 0, critical: 1, strained: 2, adequate: 3, surplus: 4 });

/**
 * The cap the record sets on the ruling-authority band, or null where it sets none.
 * @param {unknown} settlement @returns {'strained' | 'adequate' | null}
 */
export function rulingAuthorityCapOf(settlement) {
  const leg = /** @type {{ powerStructure?: { publicLegitimacy?: { label?: unknown, governanceFractured?: unknown } | null } | null } | null | undefined} */ (settlement)
    ?.powerStructure?.publicLegitimacy;
  const label = typeof leg?.label === 'string' ? leg.label.trim() : '';
  if (label === 'Legitimacy Crisis' || leg?.governanceFractured === true) return 'strained';
  if (label === 'Contested') return 'adequate';
  return null;
}

/**
 * THE ONE READER: the band the Foundations row prints for ruling authority.
 * @param {unknown} settlement @param {string} band the model's band
 * @returns {string}
 */
export function rulingAuthorityBandShown(settlement, band) {
  const cap = rulingAuthorityCapOf(settlement);
  if (!cap || !Object.hasOwn(RANK, band)) return band;
  return RANK[/** @type {keyof typeof RANK} */ (band)] > RANK[cap] ? cap : band;
}
