// src/data/bandLadders.js — THE SETTLEMENT BAND LADDERS, ONE HOME.
// Frozen NAMED tables plus one total function each. No import. Pure: no branch on anything
// but its own arguments, no PRNG, no clock, no locale, no store, no I/O.
// ⛔ THIS IS THE ONLY ADDRESS. There is no src/domain re-export: 96 domain files already import
//    src/data directly, and one generator edge into a src/domain band address would put this
//    leaf into the EAGER first-paint closure. (The consequence was measured twice: 283 -> 285 on
//    version 2's replica of the set, and again at 2026-09-22 against the LIVE set imported from
//    vite.config.js, whose size is 270. The absolute moves with every landing; the CONSEQUENCE
//    does not, and it is the reason for this address.)
// ⚠ THE NUMBERS ARE THE ONES THE GENERATOR COMPARES, UNROUNDED. The record publishes
//    deficitPct and surplusPct rounded; the label was cut from the raw values. A checker that
//    re-runs these functions over the published numbers must tolerate that (EM-R0b v2's rule).
// ⚠ 'Vulnerable' and 'Contested' also name bands of OTHER ladders over OTHER quantities
//    (src/domain/state/bands.js, src/domain/qualitativeBands.js). Homonyms, not duplicates.
// ⚠ SO IS THIS FILE'S OWN NAME. src/domain/compendium/bandLadders.js is a DIFFERENT file —
//    buildBandLadders(), the Compendium's ladder PROSE. Same basename, different subject; no
//    instrument addresses either by basename (measured, F-18). Never merge the two.

/** Public legitimacy, 0..100. CLOSED below: score >= cut. */
export const LEGITIMACY_CUTS = Object.freeze({ endorsed: 75, approved: 60, tolerated: 45, contested: 30 });

/** HIGHEST FIRST. The last entry is the floor and matches every remaining score. */
export const LEGITIMACY_BANDS = Object.freeze([
  { min: LEGITIMACY_CUTS.endorsed,  label: 'Endorsed',          color: '#1a5a28', bg: '#f0faf4', govMultiplier: 1.30, crimMultiplier: 0.75 },
  { min: LEGITIMACY_CUTS.approved,  label: 'Approved',          color: '#4a7a2a', bg: '#f4faf0', govMultiplier: 1.15, crimMultiplier: 0.90 },
  { min: LEGITIMACY_CUTS.tolerated, label: 'Tolerated',         color: '#a0762a', bg: '#faf8ec', govMultiplier: 1.00, crimMultiplier: 1.00 },
  { min: LEGITIMACY_CUTS.contested, label: 'Contested',         color: '#8a4010', bg: '#fdf6ec', govMultiplier: 0.80, crimMultiplier: 1.15 },
  { min: -Infinity,                 label: 'Legitimacy Crisis', color: '#8b1a1a', bg: '#fdf4f4', govMultiplier: 0.60, crimMultiplier: 1.30 },
]);
/** @param {number} score @returns {typeof LEGITIMACY_BANDS[number]} Total; never null. */
export function legitimacyBandOf(score) {
  for (const band of LEGITIMACY_BANDS) if (score >= band.min) return band;
  return LEGITIMACY_BANDS[LEGITIMACY_BANDS.length - 1];
}

/** Overall defence readiness, 0..100. CLOSED below: readiness >= cut. */
export const READINESS_CUTS = Object.freeze({ fortress: 76, wellDefended: 55, defensible: 38, lightlyDefended: 24, vulnerable: 12 });
export const READINESS_BANDS = Object.freeze([
  { min: READINESS_CUTS.fortress,        label: 'Fortress',         color: '#1a4a2a', background: '#f0faf2', border: '#a8d8b0' },
  { min: READINESS_CUTS.wellDefended,    label: 'Well-Defended',    color: '#1a3a6a', background: '#f0f4fa', border: '#a8c0d8' },
  { min: READINESS_CUTS.defensible,      label: 'Defensible',       color: '#5a6a1a', background: '#f4f8ec', border: '#b8d0a8' },
  { min: READINESS_CUTS.lightlyDefended, label: 'Lightly Defended', color: '#7a5010', background: '#faf6ec', border: '#e0c880' },
  { min: READINESS_CUTS.vulnerable,      label: 'Vulnerable',       color: '#8a3010', background: '#fdf8ec', border: '#e8c080' },
  { min: -Infinity,                      label: 'Undefended',       color: '#8b1a1a', background: '#fdf4f4', border: '#e8c0c0' },
]);
/**
 * THE LABEL READS THE ROSTER (UPKEEP-12, the chair's ruling (a) of 2026-11-14 on the capacity reader's H1).
 * "Undefended" says no walls, no garrison and no watch on every surface that reads it, so a town whose
 * roster HOLDS walls or a force (`held`: the defence home's `defenceHeldOf`) is never labelled so: its
 * lowest band is the one above. The score is not moved; only the word it is read by.
 * @param {number} readiness @param {boolean} [held] the roster holds walls or a force
 * @returns {typeof READINESS_BANDS[number]}
 */
export function readinessBandOf(readiness, held = false) {
  const floor = held ? READINESS_BANDS.length - 2 : READINESS_BANDS.length - 1;
  for (let i = 0; i < floor; i += 1) if (readiness >= READINESS_BANDS[i].min) return READINESS_BANDS[i];
  return READINESS_BANDS[floor];
}

/** FOOD SECURITY — THE ONE LADDER. OPEN below (> cut), famine first, surplus last.
 *  ONE SET OF CUT-OFFS (FOOD-1, chair ruling 1, 2026-11-03, by the owner's delegation of
 *  2026-11-03; it answers ODQ §934.57's family): the label, the flags below, the prosperity
 *  modifier (foodGenerator.js :: foodProsperityModOf), the viability verdicts and the economy
 *  situation sentence all cut the gap HERE. The flag ladder's private 20 is retired: a gap the
 *  band calls Import-Dependent is a deficit, never "pressured" beside it. */
export const FOOD_SECURITY_CUTS = Object.freeze({ deficit: 40, importDependent: 15, pressured: 5, surplus: 40 });
export const FOOD_SECURITY_BANDS = Object.freeze({
  famine:          { label: 'Deficit — Active Famine', color: '#8b1a1a', bg: '#fdf4f4' },
  deficit:         { label: 'Deficit',                 color: '#8b1a1a', bg: '#fdf4f4' },
  importDependent: { label: 'Import-Dependent',        color: '#8a3010', bg: '#fdf0e8' },
  pressured:       { label: 'Pressured',               color: '#7a5010', bg: '#faf8e8' },
  surplus:         { label: 'Surplus',                 color: '#1a5a28', bg: '#f0faf4' },
  secure:          { label: 'Secure',                  color: '#2a6a38', bg: '#f4fbf6' },
});
/**
 * The band's KEY — the food record carries it (foodBalance.js :: deriveFoodRecord).
 * @param {boolean} stressFamine @param {number} deficitPct @param {number} surplusPct
 * @returns {keyof typeof FOOD_SECURITY_BANDS}
 */
export function foodSecurityBandKeyOf(stressFamine, deficitPct, surplusPct) {
  if (stressFamine) return 'famine';
  if (deficitPct > FOOD_SECURITY_CUTS.deficit) return 'deficit';
  if (deficitPct > FOOD_SECURITY_CUTS.importDependent) return 'importDependent';
  if (deficitPct > FOOD_SECURITY_CUTS.pressured) return 'pressured';
  if (surplusPct > FOOD_SECURITY_CUTS.surplus) return 'surplus';
  return 'secure';
}
/** @param {boolean} stressFamine @param {number} deficitPct @param {number} surplusPct */
export function foodSecurityBandOf(stressFamine, deficitPct, surplusPct) {
  return FOOD_SECURITY_BANDS[foodSecurityBandKeyOf(stressFamine, deficitPct, surplusPct)];
}

/** FOOD SECURITY — THE FLAGS, cut at the label ladder's own points (referenced, never
 *  re-spelled). `deficit` is the Import-Dependent cut: over it the band reads a deficit. */
export const FOOD_FLAG_CUTS = Object.freeze({
  deficit: FOOD_SECURITY_CUTS.importDependent, pressured: FOOD_SECURITY_CUTS.pressured, surplus: FOOD_SECURITY_CUTS.surplus,
});
/** Key order is the record's own and is golden-bearing. @returns {{isDeficit:boolean, isPressured:boolean, isSecure:boolean, isSurplus:boolean}} */
export function foodSecurityFlagsOf(stressFamine, deficitPct, surplusPct) {
  return {
    isDeficit:   deficitPct > FOOD_FLAG_CUTS.deficit || stressFamine,
    isPressured: deficitPct > FOOD_FLAG_CUTS.pressured && deficitPct <= FOOD_FLAG_CUTS.deficit,
    isSecure:    deficitPct <= FOOD_FLAG_CUTS.pressured && surplusPct <= FOOD_FLAG_CUTS.surplus,
    isSurplus:   surplusPct > FOOD_FLAG_CUTS.surplus,
  };
}
