/**
 * domain/pendingEdits.js — Queue-based edit primitive.
 *
 * The Editing & Map critique's E-1 / E-2 reframes the dossier as the
 * surface the DM edits, not a read-only view. To make that safe, the
 * engine needs a queue of pending changes. The richer cascade-preview read
 * model lives in pendingEditsPreview.js so it can stay off first paint.
 *
 * Pure-functional, store-agnostic, idempotent.
 *
 * Edit shape:
 *   {
 *     id:        string         — uuid-ish, stable for revert
 *     kind:      EditKind       — see EDIT_KINDS below
 *     payload:   any            — kind-specific primitive payload
 *     ts:        number         — monotonic timestamp from edit clock
 *     reverted?: boolean        — soft-revert (kept in history)
 *   }
 *
 */

/** @typedef {'rename-npc' | 'rename-faction' | 'rename-settlement'
 *           | 'add-institution' | 'remove-institution'
 *           | 'add-resource' | 'remove-resource'
 *           | 'add-stressor' | 'remove-stressor'
 *           | 'edit-prose'
 *           | 'edit-npc' | 'reassign-npc' | 'stasis-npc' | 'return-npc'
 *           | 'ransom-npc' | 'rescue-npc'
 *           | 'champion-npc'
 *           | 'table-event'
 *           | 'recall-npc'} EditKind */

export const EDIT_KINDS = Object.freeze([
  'rename-npc', 'rename-faction', 'rename-settlement',
  'add-institution', 'remove-institution',
  'add-resource', 'remove-resource',
  'add-stressor', 'remove-stressor',
  'edit-prose',
  // DESIGN_NPC_LIFECYCLE §2 — the three typed NPC ops (edit / reassign / stasis+return).
  'edit-npc', 'reassign-npc', 'stasis-npc', 'return-npc',
  // DESIGN_THE_ROADS §11 — THE PARTY'S HAND: the two roads-hostage intervention ops.
  'ransom-npc', 'rescue-npc',
  // DESIGN_DEEP_COUPLINGS §8 D-4e — THE PLAYER SIDING: back a live contestant's side of a
  // contested goal (stamps a marker the ladder-contest pass folds into ContestRec.backedBy).
  'champion-npc',
  // R-1 THE SESSION LEDGER — a table-authored event (the DM records what happened at the
  // game table). The payload carries a schema-walled directive (domain/tableLedger.js) that
  // commits a typed, bounded, EXISTING engine effect with source:'table' provenance.
  'table-event',
  // DESIGN_VISION_WAVE V-24a — THE RECALL RIDER (finite-semantics law): request a TRAVELED
  // NPC's early return. Stamps a marker (whereabouts.recall) the roads mover consumes on its
  // next tick, engaging the return leg early — never teleports, never adds a mover.
  'recall-npc',
]);

const _editKindSet = new Set(EDIT_KINDS);

// The kinds settlementPendingEdits can admit through a complete payload contract
// and route to a writer with a typed outcome. A kind NOT in this list is refused
// at queueEdit rather than staged without an executor. Failed/stale items remain
// queued for review instead of being silently cleared. The other EDIT_KINDS remain
// declared as UI/preview scaffolding awaiting contracts and writers. Keep this in
// lockstep with pendingEditIntents + settlementPendingEdits; totality is pinned in
// tests/store/editActionPersist.test.js and tests/domain/pendingEdits.test.js.
// (A plain frozen list remains inspectable by UI/tests and avoids a second public
// collection type in this first-paint primitive.)
// DESIGN_NPC_LIFECYCLE §2: the NPC ops join the committable set — each has a live
// dispatcher (settlementPendingEdits → settlementRenameHelpers) and a registered
// operation (operationRegistry).
export const COMMITTABLE_EDIT_KINDS = Object.freeze([
  'rename-npc', 'rename-settlement',
  'edit-npc', 'reassign-npc', 'stasis-npc', 'return-npc',
  // DESIGN_THE_ROADS §11 — the party's roads-hostage ops; dispatched via applyNpcOp,
  // stamping whereabouts.partyRelease for the mover.
  'ransom-npc', 'rescue-npc',
  // DESIGN_DEEP_COUPLINGS §8 D-4e — player siding; dispatched via applyNpcOp, stamping
  // the contestBacking marker the ladder-contest pass folds into backedBy.
  // Rides commitPendingEdits (no dedicated operationRegistry op — the roads-op precedent).
  'champion-npc',
  // R-1 THE SESSION LEDGER — dispatched via applyEditOp→applyTableEvent,
  // committing the payload's schema-walled directive through applyEvent / a canon flavor
  // line. Rides commitPendingEdits (no dedicated operationRegistry op — the roads-op
  // precedent; the underlying effects — applyEvent — are already registered).
  'table-event',
  // DESIGN_VISION_WAVE V-24a — THE RECALL RIDER; dispatched via applyNpcOp,
  // stamping whereabouts.recall on a traveling NPC (the roads whereabouts.partyRelease
  // precedent). The roads mover engages the return leg early. No dedicated operationRegistry op.
  'recall-npc',
  // R-2 (capability remediation) — AUTHORED PROSE reaches its contract. Dispatched
  // via the EXISTING registered Tier-5.4 writer applyUserEditAction (strict
  // EDITABLE_FIELDS gate re-checked inside the writer). Rides commitPendingEdits
  // (the roads-op precedent). Which registered paths the QUEUE admits is narrower
  // than EDITABLE_FIELDS — see QUEUE_WIRED_PROSE_PATHS in settlementPendingEdits.js
  // for the wired subset and the per-path lifecycle hazards that keep the rest out.
  'edit-prose',
]);

// Deterministic short discriminator (FNV-1a). The edit id must be stable for the
// same (kind, payload, clock) so revert-by-id and idempotent re-appends stay
// deterministic within a session — Math.random here put non-determinism into the
// queue and broke replay/idempotency. NOTE: the queue is SESSION-ONLY — it is
// excluded from the store persist partialize (src/store/index.js), so it never
// reaches localStorage; determinism is about in-session replay, not persistence.
/** @param {any} str */
function shortHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(7, '0').slice(0, 6);
}

// ── Construction ──────────────────────────────────────────────────────

/**
 * Build a new pending-edit. Pure; no side effects.
 * @param {any} kind
 * @param {any} payload
 * @param {number} [clock]
 */
export function buildEdit(kind, payload, clock = 0) {
  if (!_editKindSet.has(kind)) {
    throw new Error(`pendingEdits: unknown kind "${kind}"`);
  }
  return Object.freeze({
    id: `edit_${clock}_${shortHash(`${kind}:${JSON.stringify(payload || {})}:${clock}`)}`,
    kind,
    payload: Object.freeze({ ...(payload || {}) }),
    ts: clock,
    reverted: false,
  });
}

// ── Queue operations ─────────────────────────────────────────────────

/**
 * Append an edit. Returns a new queue (does not mutate).
 * @param {any} queue
 * @param {any} edit
 */
export function appendEdit(queue, edit) {
  if (!Array.isArray(queue)) return [edit];
  return [...queue, edit];
}

/**
 * Mark a queue entry as reverted (soft delete — kept for history).
 * @param {any} queue
 * @param {any} editId
 */
export function revertEdit(queue, editId) {
  if (!Array.isArray(queue)) return [];
  return queue.map(e => e.id === editId ? { ...e, reverted: true } : e);
}

/**
 * Discard a queue entry entirely (hard delete).
 * @param {any} queue
 * @param {any} editId
 */
export function dropEdit(queue, editId) {
  if (!Array.isArray(queue)) return [];
  return queue.filter(e => e.id !== editId);
}

/**
 * Reduce to the active (non-reverted) edits only.
 * @param {any} queue
 */
export function activeEdits(queue) {
  if (!Array.isArray(queue)) return [];
  return queue.filter(e => !e.reverted);
}

/**
 * True if the queue has unapplied work the user can commit/revert.
 * @param {any} queue
 */
export function hasPending(queue) {
  return activeEdits(queue).length > 0;
}
