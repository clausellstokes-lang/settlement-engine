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
 * This is C1 ONLY. `receipts` and `persistenceOps` are typed LOOSELY here and
 * carry the shapes the actions already produce (eventLog entries, snapshots,
 * and a plain description of the persistSaveUpdate that ran). C2 unifies the
 * Receipt type (trace + explanation); C3 makes PersistenceOp a durable outbox
 * op. Until then the fields exist and are populated, but their element types
 * are placeholders — see the per-typedef TODOs.
 *
 * No side effects live here. `makeActionResult` is a pure constructor: the
 * action still fires its own analytics / persistence this step (the
 * `analyticsEvent` / `persistenceOps` fields DESCRIBE what happened, they do
 * not reroute it — that is future work, C3).
 */

/**
 * @typedef {Object} Receipt
 * LOOSE placeholder for C1. Today this carries the shape the action already
 * produces — an eventLog entry (applyEvent) or a version snapshot
 * (recordSnapshot / destroy's DESTROY_SETTLEMENT log entry). C2 replaces this
 * with the unified trace+explanation Receipt type (stable id, source, kind,
 * causes[], effects[], tick). TODO(Track K C2): tighten this typedef.
 */

/**
 * @typedef {Object} PersistenceOp
 * LOOSE placeholder for C1. Today this is a plain description of the
 * persistSaveUpdate call the action already made — { saveId, kind, fields }.
 * C3 replaces this with a durable outbox op { id, saveId, kind,
 * payloadFingerprint, attempts, status, enqueuedAt }. TODO(Track K C3).
 * @property {string} saveId          save the write targets
 * @property {string} kind            op kind, e.g. 'save-update'
 * @property {string[]=} fields       which save-partial keys reached storage
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
 * @property {Receipt[]} receipts                  why this happened (C2 type — loose for now)
 * @property {PersistenceOp[]} persistenceOps      what must reach durable storage (C3 type — loose for now)
 * @property {{event: string, props: Object}|null} analyticsEvent  the event the action fired (describes, does not route)
 * @property {string|null} userMessage             toast/banner copy, null = silent
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
 *     receipts: [logEntry]         — the eventLog entry this apply produced
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
 *     receipts: [snapshot]         — the immutable checkpoint just recorded
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
 *     receipts: [destroyLogEntry]  — the DESTROY_SETTLEMENT event appended to the save's log
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
  };
}
