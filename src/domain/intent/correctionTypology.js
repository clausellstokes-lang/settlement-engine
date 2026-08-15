/**
 * correctionTypology.js — the §9 CORRECTION TYPOLOGY vocabulary (typed, versioned,
 * self-describing per DESIGN_ANALYTICS_V2 §2).
 *
 * ⚠️ PRE-SURVEYOR SCOPE. §9's correction typology classifies every correction a human
 * makes to the COMPILER's interpretation. The Surveyor (the natural-language → engine-op
 * compiler) does not exist yet, so there is no AI interpretation to classify a correction
 * AGAINST. Until it ships, the only capturable correction signal is the manual `reverted`
 * flag on edit_events (surfaced by migration 134's intent atlas), emitted under the single
 * PRE_SURVEYOR_CLASS below. The six SURVEYOR_CLASSES are DEFERRED — declared here so the
 * vocabulary is versioned and a future Surveyor wave extends (never re-invents) it, and so
 * the deferral is a marker in code rather than tribal knowledge.
 *
 * PURITY / BUDGET: no transport, no side effects, no eager importer. This module lives in
 * src/domain/intent and must NOT be statically imported by any first-paint/boot module —
 * it is read only by the analytics rollup-side tooling + tests, so it costs zero eager
 * bytes (the §7 near-zero-eager posture). It emits only enum strings — never content.
 */

/** Bump when the class set or its meaning changes (the vocabulary-pin idiom). */
export const CORRECTION_TYPOLOGY_VERSION = 1;

/**
 * The pre-Surveyor correction class — the ONLY class emitted today. A manual `reverted`
 * edit is a correction whose CAUSE cannot yet be classified (no compiler interpretation to
 * compare against), so it is typed as unclassified-manual.
 */
export const PRE_SURVEYOR_CLASS = 'unclassified_manual';

/**
 * The six §9 Surveyor-era classes. DEFERRED until the compiler ships — each trains a
 * different fix (the interpretability key). Declared, not emitted.
 *   misread_requirement        — heard the words wrong.
 *   wrong_mechanism            — right goal, wrong engine primitive.
 *   wrong_magnitude            — right mechanism, wrong dial value.
 *   over_inference             — did more than asked.
 *   under_inference            — missed a necessary implication.
 *   protected_constraint_graze — touched a protected constraint.
 */
export const SURVEYOR_CLASSES = Object.freeze([
  'misread_requirement',
  'wrong_mechanism',
  'wrong_magnitude',
  'over_inference',
  'under_inference',
  'protected_constraint_graze',
]);

/** The full vocabulary (pre-Surveyor class first, then the deferred Surveyor classes). */
export const CORRECTION_CLASSES = Object.freeze([PRE_SURVEYOR_CLASS, ...SURVEYOR_CLASSES]);

const _classSet = new Set(CORRECTION_CLASSES);

/** Whether a string is a known correction class. @param {unknown} value */
export function isCorrectionClass(value) {
  return typeof value === 'string' && _classSet.has(value);
}

/** Whether a class is capturable NOW (true only for the pre-Surveyor manual class). @param {unknown} value */
export function isCaptureableNow(value) {
  return value === PRE_SURVEYOR_CLASS;
}
