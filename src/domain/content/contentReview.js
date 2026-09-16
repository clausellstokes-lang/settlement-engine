/**
 * Closed review boundary for Surveyor-authored custom content.
 *
 * Edge validation is necessary but not sufficient: a draft can be stale, locally
 * mutated, or edited after it arrives. Approval therefore revalidates the complete
 * base definition, and edit approval revalidates the complete merged definition,
 * against the same generated client manifest. Nothing bypasses the existing
 * immutable application-command boundary after this review.
 */

import { admitCustomContentDefinition } from './customContentManifest.js';

export const CONTENT_REVIEW_ACTIONS = Object.freeze([
  'approve',
  'edit',
  'reject',
  'pending',
]);

const ACTION_SET = new Set(CONTENT_REVIEW_ACTIONS);

/**
 * @typedef {'approve'|'edit'|'reject'|'pending'} ContentReviewAction
 * @typedef {{ action?:ContentReviewAction, editedFields?:object }} ContentReviewDecision
 * @typedef {{
 *   bucket?:unknown,
 *   entry?:unknown,
 *   fieldLabels?:Array<{effectKind?:unknown, kind?:unknown}>,
 * }} ContentReviewDraftEntry
 * @typedef {{ entries?:ContentReviewDraftEntry[] }} ContentReviewDraft
 */

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordValue(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * Apply per-entry review decisions.
 *
 * Explicit rejection retains the historical `{ index }` receipt. An attempted
 * approval that fails current admission is also rejected, with controlled errors so
 * the caller can explain why without ever minting the unsafe definition.
 *
 * @param {ContentReviewDraft|null|undefined} draft
 * @param {Record<string, ContentReviewDecision>} [decisions]
 */
export function reviewContentDraft(draft, decisions = {}) {
  const entries = draft && Array.isArray(draft.entries) ? draft.entries : [];
  /** @type {Array<{
   *   index:number,
   *   bucket:string,
   *   entry:Record<string, unknown>,
   *   fieldLabels:unknown[],
   * }>} */
  const accepted = [];
  /** @type {Array<{index:number, reason?:string, errors?:unknown[]}>} */
  const rejected = [];

  entries.forEach((draftEntry, index) => {
    const decision = decisions[String(index)] ?? { action: 'pending' };
    const rawAction = decision.action;
    const action = typeof rawAction === 'string' && ACTION_SET.has(rawAction)
      ? rawAction
      : 'pending';

    if (action === 'reject') {
      rejected.push({ index });
      return;
    }
    if (action !== 'approve' && action !== 'edit') return;

    const base = recordValue(draftEntry?.entry);
    const edits = action === 'edit' ? recordValue(decision?.editedFields) : {};
    const candidate = action === 'edit' ? { ...base, ...edits } : { ...base };
    const admission = admitCustomContentDefinition(draftEntry?.bucket, candidate);

    if (!admission.ok) {
      rejected.push({
        index,
        reason: 'invalid_entry',
        errors: admission.errors,
      });
      return;
    }

    accepted.push({
      index,
      bucket: admission.bucket,
      entry: /** @type {Record<string, unknown>} */ (admission.definition),
      fieldLabels: admission.fieldLabels,
    });
  });

  return { accepted, rejected };
}

/**
 * Fraction of proposed fields with a real mechanical consumer. Conditional fields
 * count as mechanical because activation, not effect kind, is what is deferred.
 *
 * @param {ContentReviewDraft|null|undefined} draft
 */
export function mechanicalMappingRate(draft) {
  const entries = draft && Array.isArray(draft.entries) ? draft.entries : [];
  let mechanical = 0;
  let total = 0;

  for (const entry of entries) {
    for (const field of (Array.isArray(entry.fieldLabels) ? entry.fieldLabels : [])) {
      total += 1;
      if (field.effectKind === 'mechanical' || field.kind === 'mechanical') mechanical += 1;
    }
  }

  return total === 0 ? 0 : mechanical / total;
}
