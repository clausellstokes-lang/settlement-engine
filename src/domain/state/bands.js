/**
 * domain/state/bands.js — Number → Band label, with calibrated thresholds.
 *
 * Why this is its own module: the band labels are the user-facing surface
 * of every StateDimension. Centralizing them means the SystemStateBar UI,
 * the PDF SystemStateSnapshot section, and any future telemetry all read
 * the same scale. Tweaking thresholds in one place updates everywhere.
 *
 * Choice of scale: 0-100 throughout, with thresholds biased so that the
 * common middle of the range reads as "Strained" rather than "Stable" —
 * this matches DM intuition that any settlement worth playing in has
 * tension. A vanilla generated town should not score 90/Stable on
 * everything; that'd be uninformative.
 */

/** @typedef {import('../types.js').Band} Band */

/**
 * Convert a 0-100 score to a coarse Band label.
 *
 * Thresholds:
 *   0–24   Critical    failing, drives plot
 *   25–49  Vulnerable  one shock from failure
 *   50–74  Strained    livable but constrained — the common case
 *   75–100 Stable      genuinely healthy
 *
 * @param {number} value
 * @returns {Band}
 */
export function bandFor(value) {
  if (!Number.isFinite(value)) return 'Strained';
  if (value < 25)  return 'Critical';
  if (value < 50)  return 'Vulnerable';
  if (value < 75)  return 'Strained';
  return 'Stable';
}

/**
 * POLARITY — THE SINGLE SOURCE for which direction is good on each of the four
 * SystemState dimensions.
 *
 * Why it lives here and nowhere else: this fact used to be declared in THREE
 * separate places (compareSystemState's local POLARITY, SystemStateBar's
 * DIM_META.higherIsBetter, livingWorldSignals' dims[].higherIsBetter) and read
 * by NONE of them at band time. The band ladder above is strictly
 * higher-is-better, so `bandFor(value)` applied to volatility / externalThreat /
 * resourcePressure printed the OPPOSITE of the truth: a town at volatility 95
 * (six factions, five conflicts, rulers with no legitimacy) banded "Stable" in
 * green, and a calm town at volatility 17 banded "Critical" in oxblood. Every
 * band reader inherited it — the bar tile, the PDF dimension card, the Library
 * health pip and its "Needs attention" sort, the BAND_HINT one-liner, the
 * persisted campaign snapshot, and the event log's band-crossing sentence.
 *
 * Fixed by banding off the polarity-ORIENTED score (`bandForDimension`), the
 * same cure the causal substrate already used one layer down (causalState.js
 * finalizeVariable). The raw 0-100 `value` is untouched — only the qualitative
 * word flips — so deltas, bar fills and persisted scores keep their meaning.
 *
 * @type {Readonly<Record<string, 'higher_is_better'|'lower_is_better'>>}
 */
export const DIM_POLARITY = Object.freeze({
  resilience:       'higher_is_better',
  volatility:       'lower_is_better',
  externalThreat:   'lower_is_better',
  resourcePressure: 'lower_is_better',
});

/**
 * Polarity of one dimension. Unknown keys read higher_is_better, so a future
 * fifth dimension bands exactly as the pre-fix code did until it declares itself.
 * @param {string} key
 * @returns {'higher_is_better'|'lower_is_better'}
 */
export function dimensionPolarity(key) {
  return DIM_POLARITY[key] === 'lower_is_better' ? 'lower_is_better' : 'higher_is_better';
}

/**
 * Band label for a dimension's raw 0-100 score, ORIENTED by that dimension's
 * polarity. For a lower-is-better dimension the ladder is walked from the other
 * end (100 - value), so "Stable" always means healthy and "Critical" always
 * means failing, whichever way the underlying number runs.
 *
 * Non-finite input flows through unchanged (100 - NaN is NaN), so it lands on
 * the same neutral 'Strained' fallback `bandFor` gives.
 *
 * @param {string} key    one of the four SystemState dimension keys
 * @param {number} value  the dimension's raw 0-100 score
 * @returns {Band}
 */
export function bandForDimension(key, value) {
  return bandFor(dimensionPolarity(key) === 'lower_is_better' ? 100 - value : value);
}

/**
 * Display color for a band — used by SystemStateBar and PDF chips. The amber/
 * orange mid-tones (Strained/Vulnerable) are darkened to clear WCAG AA (4.5:1)
 * for small pill text: the "needs attention" states a GM scans for were
 * previously the hardest to read (~3.0-4.0:1).
 */
export const BAND_COLOR = {
  Stable:     '#1a5a28',  // ~5:1 on card
  Strained:   '#8a5e10',  // was #a0762a (3.98:1) → 5.52:1
  Vulnerable: '#9a4a16',  // was #b15a1f (4.68:1, borderline at micro size) → 6.05:1
  Critical:   '#8b1a1a',  // ~7:1 on card
};

/** A short DM-facing one-liner per band — for tooltips and the PDF. These read
 *  as HEALTH statements, not as statements about the underlying number, so they
 *  stay true for both polarities once the band itself is oriented
 *  (`bandForDimension`): "Already failing" is the right line for a settlement at
 *  volatility 95 exactly as it is for one at resilience 10. */
export const BAND_HINT = {
  Stable:     'Healthy. Shocks are absorbed without crisis.',
  Strained:   'Functional but stretched. A bad season would hurt.',
  Vulnerable: 'One real shock away from failure.',
  Critical:   'Already failing. This is plot fuel.',
};

/**
 * Clamp a raw score to the valid 0–100 range. Defensive — derivation
 * code can produce out-of-range values when summing many small drivers,
 * and we want band-mapping to be total.
 * @param {number} value
 * @returns {number}
 */
export function clamp01(value) {
  if (!Number.isFinite(value)) return 50;
  if (value < 0)   return 0;
  if (value > 100) return 100;
  return value;
}

/**
 * Severity classifier used by `compareSystemState` when describing a
 * delta between two state values. Cutoffs are absolute (in 0-100 points)
 * rather than relative because a 10-point drop from Stable to Strained
 * means the same thing as a 10-point drop from Strained to Vulnerable —
 * it's a real shift in band probability.
 * @param {number} delta
 * @returns {string}
 */
export function severityFor(delta) {
  const m = Math.abs(delta);
  if (m >= 15) return 'major';
  if (m >= 7)  return 'moderate';
  return 'minor';
}
