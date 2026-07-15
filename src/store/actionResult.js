/**
 * actionResult.js — Track K §C1: the ActionResult envelope.
 *
 * The North Star (docs/TRACK_K_DESIGN.md): *every user action becomes a typed
 * command, every command emits causal receipts, every mutation persists through
 * a durable sync path.* This file names the pattern the five canon-path
 * mutations already follow (mutate → derive → persist → analytics) without
 * rewriting any orchestration. It is adopted action-by-action, never
 * speculatively — an action converts when a consumer needs its envelope.
 *
 * `receipts` is now the unified Track K §C2 Receipt type (imported from
 * domain/trace.js): each canon-path action maps the shape it already produced —
 * an eventLog entry, a DESTROY_SETTLEMENT entry, or a version snapshot — through
 * a Receipt builder (receiptFromTrace / receiptFromEventLogEntry / makeReceipt),
 * so the envelope carries derived causal receipts, not raw stored shapes.
 *
 * `persistenceOps` carries lightweight PersistenceDescriptors — { saveId, kind,
 * fields, opId? } — of the writes an action performed. The DURABLE op type now
 * lives in outbox.js (Track K §C3, landed): a descriptor links to its durable
 * outbox op by `opId` when the action routed the write through the outbox. The
 * two are deliberately distinct — one names the write for the envelope's causal
 * story, the other is the queued unit the sync path drains — so they no longer
 * share the name `PersistenceOp` (the earlier C1 collision).
 *
 * No side effects live here. `makeActionResult` is a pure constructor. The
 * envelope DESCRIBES persistence, it does not ROUTE it: the action itself fires
 * `persistSaveUpdate` (which enqueues onto the durable outbox) this same step.
 * That description-vs-routing split is a deliberate seam, not a pending TODO —
 * C3's durable path exists and every canon-path write already flows through it.
 */

/**
 * The unified causal receipt — Track K §C2, defined in domain/trace.js.
 * @typedef {import('../domain/trace.js').Receipt} Receipt
 */

/**
 * The DURABLE persistence op — Track K §C3, defined in outbox.js. Referenced
 * here only so a PersistenceDescriptor's `opId` can point at the real thing.
 * @typedef {import('./outbox.js').PersistenceOp} PersistenceOp
 */

/**
 * @typedef {Object} PersistenceDescriptor
 * A lightweight description of a write an action performed, for the envelope's
 * causal story — NOT the durable queue unit (that is {@link PersistenceOp} in
 * outbox.js). Today the canon-path actions emit { saveId, kind:'save-update',
 * fields } describing the persistSaveUpdate they fired; `opId`, when present,
 * links the descriptor to the durable outbox op (outbox.js#PersistenceOp.id)
 * that carries the write.
 * @property {string} saveId          save the write targets
 * @property {string} kind            op kind, e.g. 'save-update'
 * @property {string[]=} fields       which save-partial keys reached storage
 * @property {string=} opId           id of the durable outbox op, when routed through it
 */

/**
 * @typedef {Object} ActionResult
 * The uniform return of a converted canon-path action. A SUPERSET envelope:
 * existing consumers read `ok`/`before`/`after` where they used to read a
 * bespoke field; new consumers (C2/C3) read `receipts`/`persistenceOps`.
 *
 * @property {boolean} ok                          did the action mutate/commit?
 * @property {string} action                       canonical action id, e.g. 'applyEvent'
 * @property {Object|null} before                  MINIMAL pre-state identity slice (NOT a clone)
 * @property {Object|null} after                   MINIMAL post-state identity slice
 * @property {Receipt[]} receipts                  why this happened (unified C2 Receipt type)
 * @property {PersistenceDescriptor[]} persistenceOps  what reached durable storage (links to outbox ops via opId)
 * @property {{event: string, props: Object}|null} analyticsEvent  the event the action fired (describes, does not route)
 * @property {string|null} userMessage             toast/banner copy, null = silent
 * @property {{code: string|null, detail?: string, message: string}|null} [veto]  Composer V2 §2 — the handler-veto refusal
 *                                                 (ok:false + veto = the world refused; nothing committed)
 */

/**
 * Build a conformant ActionResult. Missing fields default to the silent-success
 * envelope (ok:true, empty receipts/ops, null before/after/analytics/message),
 * so a caller only names what it actually carries.
 *
 * Per-action `before`/`after` mappings (the MINIMAL meaningful identity for
 * each — deliberately not full clones):
 *
 *   applyEvent
 *     before: { eventType, targetId, phase, activeSaveId, systemState:<dims> }
 *     after:  { phase, logged, appliedAt, systemState:<dims> }
 *     receipts: [Receipt]          — 'event' receipt derived from the eventLog entry this apply produced
 *     persistenceOps: [{saveId, kind:'save-update', fields:['settlement','campaignState']}]  (canon w/ active save)
 *
 *   undoLastEvent
 *     before: { poppedEventId, poppedEventType, eventLogLength }
 *     after:  { phase, eventLogLength, systemState:<dims> }
 *     receipts: []                 — the undo reverses; no new receipt this step
 *     persistenceOps: [{saveId, kind:'save-update', fields:['settlement','campaignState']}]  (with active save)
 *
 *   recordSnapshot
 *     before: { targetSaveId, timeline:'saved'|'draft' }
 *     after:  { snapshotId, kind, label, timeline }
 *     receipts: [Receipt]          — 'edit'/kind:'history' receipt for the immutable checkpoint just recorded
 *     persistenceOps: [{saveId, kind:'save-update', fields:['versionHistory']}]  (saved timeline only)
 *
 *   revertToSnapshot
 *     before: { targetSaveId, snapshotId, timeline }
 *     after:  { restoredSnapshotId, restoredLabel, timeline }
 *     receipts: []
 *     persistenceOps: [{saveId, kind:'save-update', fields:['settlement','versionHistory']}]  (saved timeline only)
 *
 *   destroySavedSettlement
 *     before: { id, reason }
 *     after:  { id, status:'destroyed', destroyedReason }
 *     receipts: [Receipt]          — 'event' receipt derived from the DESTROY_SETTLEMENT entry appended to the save's log
 *     persistenceOps: [{saveId, kind:'save-update', fields:['settlement','campaignState','timestamp']}]
 *
 * where <dims> is a coarse SystemState summary
 * ({resilience, volatility, externalThreat, resourcePressure} numeric values or
 * null) — enough to diff a before/after without cloning the whole state.
 *
 * @param {string} action
 * @param {Partial<ActionResult>} [fields]
 * @returns {ActionResult}
 */
export function makeActionResult(action, fields = {}) {
  return {
    ok: fields.ok !== undefined ? fields.ok : true,
    action,
    before: fields.before ?? null,
    after: fields.after ?? null,
    receipts: fields.receipts ?? [],
    persistenceOps: fields.persistenceOps ?? [],
    analyticsEvent: fields.analyticsEvent ?? null,
    userMessage: fields.userMessage ?? null,
    ...(fields.veto !== undefined ? { veto: fields.veto } : {}),
  };
}
