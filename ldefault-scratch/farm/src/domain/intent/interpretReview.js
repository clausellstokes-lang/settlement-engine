/**
 * domain/intent/interpretReview.js — the REVIEW side of the intent compiler (Surveyor S3,
 * DESIGN_AI_CONTROL_SURFACE §2 stage 3 + §2c point 5).
 *
 * The edge returns a validated Interpretation (labelled, protection-flagged proposed ops).
 * The DM reviews PER ITEM — approve / edit / reject each — and only the accepted ops are
 * minted as proposals through the EXISTING proposal/approval machinery (never bypassed).
 * Two structural guarantees live here:
 *
 *   1. THE PROTECTED-CONSENT BARRIER: an op carrying a protected-constraint flag can NEVER
 *      be accepted without an explicit `consented: true` on its decision — "never silently
 *      approvable" is enforced by construction, not by UI vigilance.
 *   2. THE CORRECTION TYPOLOGY GOES LIVE: every edit/reject is classified into one of the
 *      six §9 SURVEYOR_CLASSES (correctionTypology.js) — the compiler ships, so the classes
 *      that were declared-but-deferred now capture the "correction-rate for interpret" eval
 *      signal (each class trains a different fix).
 *
 * PURE, lazy-only (rides the interpret panel chunk), emits only enum strings — zero eager
 * bytes, no content in the correction signal.
 */

import { SURVEYOR_CLASSES, isCorrectionClass } from './correctionTypology.js';

const _surveyorSet = new Set(SURVEYOR_CLASSES);

/** The per-item review actions. `pending` = not yet decided (neither accepted nor a correction). */
export const REVIEW_ACTIONS = Object.freeze(['approve', 'edit', 'reject', 'pending']);
const _actionSet = new Set(REVIEW_ACTIONS);

/**
 * Choose the correction class for an edit/reject. An explicit, valid Surveyor class on the
 * decision wins; otherwise a sensible default is derived from the op + the action so the
 * eval signal is never blank:
 *   - protected graze rejected/edited      → protected_constraint_graze
 *   - edit that changed the op TYPE        → wrong_mechanism (right goal, wrong primitive)
 *   - edit that changed only params        → wrong_magnitude (right mechanism, wrong dial)
 *   - reject of a `required` op            → misread_requirement (heard the words wrong)
 *   - reject of an `inferred`/`optional` op → over_inference (did more than asked)
 * @param {{ correctionClass?: string, editedType?: string }} decision
 * @param {{ label: string, opType: string, protectedFlags: string[] }} op
 * @param {'edit'|'reject'} action
 * @returns {string} a member of SURVEYOR_CLASSES
 */
export function resolveCorrectionClass(decision, op, action) {
  const explicit = decision && decision.correctionClass;
  if (typeof explicit === 'string' && _surveyorSet.has(explicit)) return explicit;
  if (op && Array.isArray(op.protectedFlags) && op.protectedFlags.length) return 'protected_constraint_graze';
  if (action === 'edit') {
    const changedType = typeof decision?.editedType === 'string' && decision.editedType !== op?.opType;
    return changedType ? 'wrong_mechanism' : 'wrong_magnitude';
  }
  // reject
  return op?.label === 'required' ? 'misread_requirement' : 'over_inference';
}

/**
 * A proposed op as the review consumes it (the edge's ProposedOp shape, structurally).
 * @typedef {{ opType: string, params: Record<string, unknown>, label: string,
 *            protectedFlags: string[], edited?: boolean }} ReviewOp
 * A per-item DM decision.
 * @typedef {{ action?: string, consented?: boolean, editedParams?: Record<string, unknown>,
 *            editedType?: string, correctionClass?: string }} ReviewDecision
 */

/**
 * Apply the DM's per-item decisions to an interpretation. Pure.
 * @param {{ ops?: ReviewOp[] }|null|undefined} interpretation the validated interpretation
 * @param {Record<string|number, ReviewDecision>} [decisions] a per-index decision map
 * @returns {{
 *   accepted: Array<{ index: number, op: ReviewOp }>,
 *   blocked:  Array<{ index: number, reason: 'needs_consent' }>,
 *   corrections: Array<{ index: number, class: string }>,
 * }}
 */
export function reviewInterpretation(interpretation, decisions = {}) {
  const ops = (interpretation && Array.isArray(interpretation.ops)) ? interpretation.ops : [];
  /** @type {Array<{ index: number, op: ReviewOp }>} */
  const accepted = [];
  /** @type {Array<{ index: number, reason: 'needs_consent' }>} */
  const blocked = [];
  /** @type {Array<{ index: number, class: string }>} */
  const corrections = [];
  ops.forEach((op, i) => {
    const raw = decisions[i] ?? decisions[String(i)] ?? { action: 'pending' };
    const action = raw.action != null && _actionSet.has(raw.action) ? raw.action : 'pending';

    if (action === 'approve' || action === 'edit') {
      // THE PROTECTED-CONSENT BARRIER — a flagged op is inert without explicit consent.
      if (Array.isArray(op.protectedFlags) && op.protectedFlags.length && raw.consented !== true) {
        blocked.push({ index: i, reason: 'needs_consent' });
        return;
      }
      const op2 = (action === 'edit')
        ? {
            ...op,
            opType: typeof raw.editedType === 'string' && raw.editedType ? raw.editedType : op.opType,
            params: (raw.editedParams && typeof raw.editedParams === 'object' && !Array.isArray(raw.editedParams))
              ? raw.editedParams : op.params,
            edited: true,
          }
        : op;
      accepted.push({ index: i, op: op2 });
      if (action === 'edit') corrections.push({ index: i, class: resolveCorrectionClass(raw, op, 'edit') });
    } else if (action === 'reject') {
      corrections.push({ index: i, class: resolveCorrectionClass(raw, op, 'reject') });
    }
    // 'pending' → contributes nothing (not accepted, not a correction)
  });
  return { accepted, blocked, corrections };
}

/**
 * The correction rate: the fraction of proposed ops the DM edited or rejected (the §5 eval
 * metric for interpret). 0 for an empty interpretation (nothing to correct). Pure.
 * @param {{ ops?: ReviewOp[] }|null|undefined} interpretation
 * @param {Record<string|number, ReviewDecision>} [decisions]
 * @returns {number} 0..1
 */
export function correctionRate(interpretation, decisions = {}) {
  const ops = (interpretation && Array.isArray(interpretation.ops)) ? interpretation.ops : [];
  if (ops.length === 0) return 0;
  const { corrections } = reviewInterpretation(interpretation, decisions);
  return corrections.length / ops.length;
}

/**
 * The correction class for an op the DM ADDED that the compiler missed entirely
 * (the interpretability signal for under-inference). Always `under_inference`.
 * @returns {{ class: 'under_inference' }}
 */
export function addedOpCorrection() {
  return { class: 'under_inference' };
}

/** True iff `cls` is a valid live interpret correction class (a Surveyor class, not the
 *  pre-Surveyor manual class). @param {unknown} cls @returns {boolean} */
export function isInterpretCorrectionClass(cls) {
  return typeof cls === 'string' && _surveyorSet.has(cls) && isCorrectionClass(cls);
}
