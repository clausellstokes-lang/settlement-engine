/**
 * domain/content/contentReview.js — the REVIEW side of the S4 custom-content compiler
 * (DESIGN_AI_CONTROL_SURFACE §2 stage 4 / DESIGN_CONTENT_PLANE §3).
 *
 * The edge returns a validated ContentDraft (bucket-registered, field-labelled entries +
 * an honest unsupported list). The DM reviews PER ENTRY — approve / edit / reject each — and
 * only accepted entries are minted through the EXISTING addCustomItem verb (never bypassed;
 * no content type = no landing). The mint carries only the wall-cleaned entry (mechanical +
 * flavor fields), so a hallucinated mechanic can never reach the account registry.
 *
 * PURE, headless, lazy-only (rides the custom-content panel chunk); emits only enum strings +
 * counts — zero eager bytes, no field values in the correction signal.
 */

import { classifyField } from './contentVocabulary.js';

/** The per-entry review actions. `pending` = not yet decided. */
export const CONTENT_REVIEW_ACTIONS = Object.freeze(['approve', 'edit', 'reject', 'pending']);
const _actionSet = new Set(CONTENT_REVIEW_ACTIONS);

/**
 * A drafted entry as the review consumes it (the edge's DraftEntry shape, structurally).
 * @typedef {{ bucket: string, entry: Record<string, unknown>, fieldLabels?: Array<{ field: string, kind: string }>,
 *            label: string, edited?: boolean }} ReviewEntry
 * A per-entry DM decision.
 * @typedef {{ action?: string, editedFields?: Record<string, unknown> }} ContentDecision
 */

/**
 * Re-clean an edited entry against the schema wall — only mechanical/flavor fields survive an
 * edit, so a DM (or a UI bug) can never smuggle an unsupported field into the mint. Pure.
 * @param {Record<string, unknown>} fields
 * @param {import('./contentVocabulary.js').ContentVocabulary|null} [vocab]
 * @returns {Record<string, unknown>}
 */
function cleanEditedFields(fields, vocab) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [field, value] of Object.entries(fields || {})) {
    // When a vocabulary is supplied, honour the wall; without one, keep the field (the edge
    // already wall-cleaned the base entry; a bare edit path stays permissive by design).
    if (!vocab) { out[field] = value; continue; }
    const c = classifyField(field, value);
    if (c.kind === 'mechanical' || c.kind === 'flavor') out[field] = value;
  }
  return out;
}

/**
 * Apply the DM's per-entry decisions to a draft. Pure. Each accepted entry carries its
 * bucket + the wall-cleaned fields ready for addCustomItem(bucket, entry).
 * @param {{ entries?: ReviewEntry[] }|null|undefined} draft
 * @param {Record<string|number, ContentDecision>} [decisions]
 * @returns {{
 *   accepted: Array<{ index: number, bucket: string, entry: Record<string, unknown> }>,
 *   rejected: Array<{ index: number }>,
 * }}
 */
export function reviewContentDraft(draft, decisions = {}) {
  const entries = (draft && Array.isArray(draft.entries)) ? draft.entries : [];
  /** @type {Array<{ index: number, bucket: string, entry: Record<string, unknown> }>} */
  const accepted = [];
  /** @type {Array<{ index: number }>} */
  const rejected = [];
  entries.forEach((e, i) => {
    const raw = decisions[i] ?? decisions[String(i)] ?? { action: 'pending' };
    const action = raw.action != null && _actionSet.has(raw.action) ? raw.action : 'pending';
    if (action === 'approve' || action === 'edit') {
      const base = (e.entry && typeof e.entry === 'object' && !Array.isArray(e.entry)) ? e.entry : {};
      const entry = (action === 'edit' && raw.editedFields && typeof raw.editedFields === 'object' && !Array.isArray(raw.editedFields))
        ? { ...base, ...cleanEditedFields(raw.editedFields, null) }
        : base;
      accepted.push({ index: i, bucket: e.bucket, entry });
    } else if (action === 'reject') {
      rejected.push({ index: i });
    }
    // 'pending' → contributes nothing
  });
  return { accepted, rejected };
}

/**
 * The mechanical-mapping RATE: the fraction of a draft's proposed fields that mapped to a real
 * engine mechanic (vs flavor/unsupported) — the §5 "how much of what they asked for is real"
 * signal. 0 for a fieldless draft. Pure.
 * @param {{ entries?: Array<{ fieldLabels?: Array<{ kind?: string }> }> }|null|undefined} draft
 * @returns {number} 0..1
 */
export function mechanicalMappingRate(draft) {
  const entries = (draft && Array.isArray(draft.entries)) ? draft.entries : [];
  let mechanical = 0;
  let total = 0;
  for (const e of entries) {
    for (const f of (Array.isArray(e.fieldLabels) ? e.fieldLabels : [])) {
      total += 1;
      if (f.kind === 'mechanical') mechanical += 1;
    }
  }
  return total === 0 ? 0 : mechanical / total;
}
