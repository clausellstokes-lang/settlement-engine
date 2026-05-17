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

/** Display color for a band — used by SystemStateBar and PDF chips. */
export const BAND_COLOR = {
  Stable:     '#1a5a28',
  Strained:   '#a0762a',
  Vulnerable: '#b15a1f',
  Critical:   '#8b1a1a',
};

/** A short DM-facing one-liner per band — for tooltips and the PDF. */
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
 */
export function severityFor(delta) {
  const m = Math.abs(delta);
  if (m >= 15) return 'major';
  if (m >= 7)  return 'moderate';
  return 'minor';
}
