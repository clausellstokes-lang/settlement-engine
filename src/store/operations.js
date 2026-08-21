/**
 * operations.js — Track K COMPLETION §1: the OPERATION envelope.
 *
 * The North Star (docs/DESIGN_TRACK_K_COMPLETION.md §0): ONE typed operation
 * surface over every state-mutating store action, so that manual UI and the
 * future AI compiler provably drive the SAME verbs. Where the Track K §C1
 * ActionResult envelope (actionResult.js) names *what an action produced*
 * (receipts + persistence descriptors), the Operation envelope names *the verb
 * itself* — the typed command a caller (manual UI today, the Surveyor intent
 * compiler tomorrow) issues to drive a mutation.
 *
 * This module is PURE and carries NO runtime wiring into the store this wave.
 * The operation vocabulary lives as DATA in operationRegistry.js (the manifest)
 * and is enforced for completeness by tests/store/operationRegistry.walker.test.js
 * (structural prevention). The runtime EMISSION of envelopes at action
 * boundaries — an eager per-action cost with no consumer until the Surveyor
 * proposal/approval lane exists (DESIGN_AI_CONTROL_SURFACE.md stage 3, an
 * owner-gated build) — is deliberately deferred: see operationRegistry.js's
 * header for the budget + sequencing rationale. Because nothing eager imports
 * this file, it adds ZERO first-paint bytes and shifts ZERO golden.
 *
 * The envelope DESCRIBES the verb; it does not ROUTE the mutation. The action
 * still performs its own set()/persist exactly as before — the constitutional
 * byte-identity contract holds because no action body changes.
 */

/**
 * The unified causal receipt — Track K §C2, defined in domain/trace.js.
 * An operation's `receiptRef` points at (does not clone) the receipt(s) the
 * underlying action already produced.
 * @typedef {import('../domain/trace.js').Receipt} Receipt
 */

/**
 * Provenance of an operation — WHO issued the verb.
 *   'manual'  — a human driving the manual UI (today's only live source).
 *   'system'  — an engine/orchestrator-issued op (e.g. an autonomous catch-up
 *               tick, a cascade the sim itself triggers).
 *   'ai'      — RESERVED. The Surveyor intent compiler will stamp this when it
 *               arrives (DESIGN_AI_CONTROL_SURFACE.md stage 3), together with
 *               the owner-reviewed persisted aiOperationLog. v1 AI logs will
 *               ride the EXISTING outbox + session surfaces — NO new persisted
 *               shape (that class is owner-gated and deliberately deferred, per
 *               DESIGN_TRACK_K_COMPLETION.md §1 + §5). It is intentionally
 *               absent from OPERATION_PROVENANCE below so nothing can emit it
 *               before that review lands.
 * @typedef {'manual'|'system'|'ai'} OperationProvenance
 */

/** The LIVE provenance values an op may carry today. 'ai' is reserved (above). */
export const OPERATION_PROVENANCE = Object.freeze({
  MANUAL: 'manual',
  SYSTEM: 'system',
});

/**
 * @typedef {Object} OperationTargets
 * The addressable subject(s) of an operation. Every field is optional — a
 * config op targets none of these; a settlement-edit op carries { saveId }; a
 * pulse macro-op carries { campaignId }; an entity-scoped op adds { entityRef }.
 * @property {string=} saveId       the saved-settlement this op acts on
 * @property {string=} campaignId   the campaign this op acts on
 * @property {string=} entityRef    a sub-entity ref (npc / faction / channel / placement …)
 */

/**
 * @typedef {Object} Operation
 * A typed, provenance-stamped command over one store mutation. The uniform
 * vocabulary manual UI and the AI compiler share (DESIGN_TRACK_K_COMPLETION §0).
 *
 * @property {string} opType                       the canonical verb, e.g. 'applyEvent' (⇔ a registry key)
 * @property {OperationTargets} targets            what the op acts on
 * @property {Object} params                       the verb's arguments (op-specific)
 * @property {OperationProvenance} provenance      who issued it ('manual'|'system'; 'ai' reserved)
 * @property {Receipt[]|Object|null} receiptRef    pointer to the EXISTING receipt(s) the action produced (never a clone)
 * @property {string|null} undoToken               handle for the action's EXISTING undo path, or null when none exists
 */

/**
 * Build a conformant Operation. Missing fields default to the empty-target,
 * empty-param, manual, receipt-less, undo-less envelope, so a caller only names
 * what it actually carries — mirrors makeActionResult's silent-success default.
 *
 * Pure constructor: no side effects, no store access, no imports beyond types.
 *
 * @param {string} opType
 * @param {Partial<Operation>} [fields]
 * @returns {Operation}
 */
export function makeOperation(opType, fields = {}) {
  return {
    opType,
    targets: fields.targets ?? {},
    params: fields.params ?? {},
    provenance: fields.provenance ?? OPERATION_PROVENANCE.MANUAL,
    receiptRef: fields.receiptRef ?? null,
    undoToken: fields.undoToken ?? null,
  };
}

/**
 * Bridge a Track K §C1 ActionResult (actionResult.js) into an Operation
 * envelope — the pure, zero-eager-cost mechanism by which the 5 canon-path
 * actions (K-A: applyEvent / undoLastEvent / recordSnapshot / revertToSnapshot
 * / destroySavedSettlement) "adapt to the registry" WITHOUT any change to their
 * bodies (DESIGN_TRACK_K_COMPLETION §2 K-A). The ActionResult's `.action`
 * already IS the registry key, its `.receipts` become the operation's
 * receiptRef, and its persistence descriptors are left where they are (the
 * envelope points, it does not re-carry).
 *
 * The undoToken is passed by the caller when a concrete undo handle exists
 * (e.g. a popped-event id, a snapshot id); absent ⇒ null (§5: undoToken points
 * at EXISTING undo machinery where it exists; this wave adds none).
 *
 * @param {import('./actionResult.js').ActionResult} actionResult
 * @param {{ opType?: string, targets?: OperationTargets, params?: Object,
 *   provenance?: OperationProvenance, undoToken?: string|null }} [meta]
 * @returns {Operation}
 */
export function operationFromActionResult(actionResult, meta = {}) {
  return makeOperation(meta.opType ?? actionResult.action, {
    targets: meta.targets ?? {},
    params: meta.params ?? {},
    provenance: meta.provenance ?? OPERATION_PROVENANCE.MANUAL,
    receiptRef: Array.isArray(actionResult.receipts) && actionResult.receipts.length
      ? actionResult.receipts
      : null,
    undoToken: meta.undoToken ?? null,
  });
}
