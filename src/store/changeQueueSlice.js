/**
 * changeQueueSlice — the per-settlement PENDING-CHANGES queue (stage → commit).
 *
 * The write surface ("Make Changes" events, "Edit Names" renames, neighbour
 * links/unlinks) historically applied + persisted IMMEDIATELY on each Apply
 * click. This slice introduces a staging layer: an Apply now ENQUEUES the
 * already-assembled intent (an "order"), and a single "Save N pending changes"
 * commit replays every order IN ORDER and persists the result ATOMICALLY.
 *
 * Design (see the change-queue spec):
 *   - State is keyed PER SAVE so opening another settlement never shows a
 *     foreign queue, and is intentionally TRANSIENT (never in partialize): a
 *     reload discards the open settlement AND its uncommitted draft alike.
 *   - flushQueue replays through the EXISTING executors (applyEvent /
 *     renameSettlement / a registered link executor) so WHAT each change does is
 *     unchanged — only WHEN (on commit, not on apply-click). Forward references
 *     between orders resolve because each replay threads off the prior result,
 *     exactly like applyEventBatch (settlementSlice.applyEventBatch).
 *   - R2 (double-applying): during flush, the executors' own immediate persist
 *     is suppressed via `flushSuppressPersist`; the flush owns ONE end-of-batch
 *     persist. On any persist failure the queue is LEFT INTACT and local state
 *     is restored from a pre-flush snapshot, so "Save N changes" is immediately
 *     retryable from a clean base (never on top of a half-applied state).
 *
 * Atomic persist (spec §2.4): the flush owns exactly ONE end-of-batch write.
 *   • A pure event / settlement-name queue touches exactly ONE row, so it uses
 *     `persistSaveUpdate` (one savesService.update) — itself atomic (Option A).
 *   • A queue that touches a PARTNER row (link / unlink, or a rename whose
 *     cascade rewrites neighbour rows) replays each cascade through a registered
 *     executor that mutates LOCAL React state but DEFERS its cloud write,
 *     returning the rows it touched. The flush unions those ids and commits the
 *     WHOLE set in ONE `persistBatch` (savesService.mutateBatch — the atomic
 *     multi-row primitive that rolls back local saves/detail on throw), so a
 *     failed link commit restores BOTH settlements (no partial apply to either).
 *
 * Scope (Phase 4a — STANDALONE only): the change-queue is wired ONLY for
 * non-clock-bound settlements. A clock-bound canon campaign member keeps its
 * existing immediate / world-pulse behaviour (applyEvent short-circuits to the
 * pulse queue); the campaign-member case (069 persist_world_pulse_advance) is
 * the NEXT phase. The queue UI is not shown there, so a staged change can never
 * silently redirect into the pulse.
 */

import { cloneJson, persistSaveUpdate, pickleCampaignState } from './settlementSliceHelpers.js';

/**
 * @typedef {'event'|'rename'|'link'|'unlink'} OrderType
 *
 * @typedef {Object} PendingOrder
 * @property {string} id          monotonic, cancel-safe id (`ord_<saveId>_<type>_<n>`)
 * @property {OrderType} type
 * @property {string} humanLabel  plain-language description for the queue viewer
 * @property {Object} payload     type-specific (see queueChange callers)
 * @property {string} createdAt   ISO timestamp
 */

/**
 * @typedef {Object} CascadeResult
 * @property {boolean} ok
 * @property {any} [settlement]      the live store settlement after the cascade
 * @property {Array<string|number>} [affectedIds]  every save row this order
 *           touched LOCALLY (this settlement + any link/rename partner). The
 *           flush unions these across all orders and persists the whole set in
 *           ONE atomic write at the end (dual-row atomicity — spec §2.4).
 */

/**
 * Module-scoped registry for the link/unlink/rename replay CASCADE executor.
 * These cascades own React `detail`/`saves` state inside SettlementsPanel and
 * CANNOT run in the store; the panel registers a thin async executor the flush
 * calls per order. During a flush the executor mutates local React state but
 * DEFERS its cloud write (it returns the affected row ids instead), so the
 * flush's single end-of-batch commit is the only write. Kept off the store
 * object so it is never serialized and never re-rendered on.
 * @type {null | ((order: PendingOrder) => Promise<CascadeResult>)}
 */
let _linkExecutor = null;

/**
 * Module-scoped registry for the end-of-batch BATCH COMMIT. The cascade
 * executor only mutates LOCAL state during a flush; this is the single atomic
 * multi-row cloud write the flush calls once, after every order has replayed,
 * with the UNION of all affected row ids. The panel implements it with
 * persistBatch (savesService.mutateBatch) — the existing atomic primitive that
 * rolls back local saves/detail on throw, so a failed commit leaves NEITHER
 * settlement partially written.
 * @type {null | ((affectedIds: Array<string|number>) => Promise<boolean>)}
 */
let _batchCommit = null;

/**
 * Register (or clear) the link/unlink/rename replay cascade executor. Called by
 * SettlementsPanel on mount; passing null on unmount clears it so a stale
 * closure over a torn-down component is never invoked.
 * @param {null | ((order: PendingOrder) => Promise<CascadeResult>)} fn
 */
export function registerLinkExecutor(fn) {
  _linkExecutor = typeof fn === 'function' ? fn : null;
}

/**
 * Register (or clear) the end-of-batch atomic multi-row commit. Called by
 * SettlementsPanel alongside registerLinkExecutor.
 * @param {null | ((affectedIds: Array<string|number>) => Promise<boolean>)} fn
 */
export function registerBatchCommit(fn) {
  _batchCommit = typeof fn === 'function' ? fn : null;
}

/** Test seam: read the current cascade executor. */
export function _getLinkExecutor() {
  return _linkExecutor;
}

/** Test seam: read the current batch-commit. */
export function _getBatchCommit() {
  return _batchCommit;
}

export function createChangeQueueSlice(set, get) {
  return {
    // { [saveId]: PendingOrder[] } — transient, NEVER persisted (see store/index
    // partialize). A monotonic counter per save keeps order ids stable across
    // cancels (an array-length id would collide after a cancel + re-add).
    changeQueues: {},
    _changeQueueCounters: {},
    // True while a flush is in flight, so the commit button can disable +
    // show progress and a second click can't double-commit.
    changeQueueFlushing: false,

    /**
     * Enqueue a fully-assembled order for `saveId`. Returns the assigned id, or
     * null when the input is unusable. Pure local — NO cloud write.
     * @param {string|number} saveId
     * @param {{ type: OrderType, humanLabel: string, payload: Object }} order
     * @returns {string|null}
     */
    queueChange: (saveId, order) => {
      if (!saveId || !order || !order.type) return null;
      const key = String(saveId);
      const counter = (get()._changeQueueCounters?.[key] || 0) + 1;
      const id = `ord_${key}_${order.type}_${counter}`;
      const entry = {
        id,
        type: order.type,
        humanLabel: String(order.humanLabel || order.type),
        payload: order.payload || {},
        createdAt: new Date().toISOString(),
      };
      set(state => {
        if (!state.changeQueues[key]) state.changeQueues[key] = [];
        state.changeQueues[key].push(entry);
        state._changeQueueCounters[key] = counter;
      });
      return id;
    },

    /**
     * Remove one queued order by id (cancel-safe — id is a monotonic counter,
     * not an array index, so cancelling order 2 of 3 never re-points order 3).
     * @param {string|number} saveId
     * @param {string} orderId
     */
    cancelQueuedChange: (saveId, orderId) => {
      const key = String(saveId);
      set(state => {
        const queue = state.changeQueues[key];
        if (!queue) return;
        state.changeQueues[key] = queue.filter(o => o.id !== orderId);
      });
    },

    /**
     * The orders staged for `saveId`, in insertion order (a stable empty array
     * when none, so callers can map without a guard).
     * @param {string|number} saveId
     * @returns {PendingOrder[]}
     */
    listQueuedChanges: (saveId) => get().changeQueues[String(saveId)] || [],

    /** Drop the whole queue for `saveId` (used after a successful commit). */
    clearQueue: (saveId) => {
      const key = String(saveId);
      set(state => { delete state.changeQueues[key]; });
    },

    /**
     * Commit every queued order for `saveId` IN ORDER, then persist atomically.
     *
     * Sequencing (the highest-risk part — see spec §2.4 + R1/R2/R8):
     *   1. Snapshot the pre-flush settlement + campaignState for rollback.
     *   2. Set flushSuppressPersist so each replayed executor mutates local
     *      state but defers its own cloud write (R2).
     *   3. Replay each order against LIVE state (R1 — strict insertion order;
     *      each event threads off the prior result, so a forward reference like
     *      "assign an NPC added earlier in the queue" resolves).
     *   4. Await ONE persist of the final settlement. On success: clear the
     *      queue and return the committed settlement for the dossier
     *      soft-refresh. On failure: restore the pre-flush snapshot, LEAVE the
     *      queue intact, and surface a retryable error.
     *
     * Link/unlink/rename orders delegate their cross-save cascade to the
     * registered executor (it owns SettlementsPanel React state). The executor
     * mutates local state but DEFERS its cloud write, returning the rows it
     * touched; the flush unions those and commits the whole set in ONE atomic
     * persistBatch via the registered batch-commit, so a failed link commit
     * restores BOTH settlements (no partial apply).
     *
     * @param {string|number} saveId
     * @returns {Promise<{ ok: boolean, settlement?: any, committed?: number, error?: string }>}
     */
    flushQueue: async (saveId) => {
      const key = String(saveId);
      const queue = get().changeQueues[key] || [];
      if (queue.length === 0) return { ok: true, committed: 0, settlement: get().settlement };
      if (get().changeQueueFlushing) return { ok: false, error: 'A commit is already in progress.' };

      // Only flush the queue that belongs to the OPEN settlement — replaying an
      // event order against a different live settlement would corrupt it (R5).
      const activeSaveId = get().activeSaveId;
      if (activeSaveId != null && String(activeSaveId) !== key) {
        return { ok: false, error: 'Open this settlement before committing its changes.' };
      }

      // (1) Pre-flush snapshot for rollback (R2/R8). Deep-cloned so a later
      // mutate cannot reach back into it.
      const preSettlement = get().settlement ? cloneJson(get().settlement) : null;
      const preEventLog = Array.isArray(get().eventLog) ? cloneJson(get().eventLog) : [];
      const preSystemState = get().systemState ? cloneJson(get().systemState) : null;
      const preEditedAt = get().editedAt || null;

      // Does the queue touch a PARTNER row (link / unlink / a rename whose
      // cascade rewrites neighbour rows)? Those orders' cascades run in the
      // panel and defer their cloud write; the flush then commits the whole
      // affected-row set in ONE atomic persistBatch (spec §2.4 — dual-row
      // atomicity). A pure event/settlement-name queue stays on the single-row
      // persistSaveUpdate fast path.
      const hasCascade = queue.some(o => o.type === 'link' || o.type === 'unlink' || o.type === 'rename');
      if (hasCascade && (!_linkExecutor || !_batchCommit)) {
        // The cross-save cascade + atomic commit are owned by SettlementsPanel.
        // Without them we cannot commit a link/unlink/rename safely, so refuse
        // rather than half-write. The queue is left intact and retryable.
        return { ok: false, error: 'These changes could not be saved. They are still queued — try again.' };
      }

      set(state => { state.changeQueueFlushing = true; state.flushSuppressPersist = true; });

      let linkSettlement = null;
      // The UNION of every save row the cascades touched LOCALLY (this
      // settlement + every link/rename partner). Persisted atomically at the end.
      const affectedIds = new Set();
      if (activeSaveId != null) affectedIds.add(activeSaveId);
      try {
        // (3) Replay each order in insertion order against live state.
        for (const order of queue) {
          if (order.type === 'event') {
            const event = order.payload?.event;
            if (event) get().applyEvent(event);
          } else if (order.type === 'rename') {
            const { renameType, targetId, newName } = order.payload || {};
            // Canon-lock re-check at flush time (defense in depth — the enqueue
            // site already rejects NPC/faction renames on a canon settlement).
            if ((renameType === 'npc' || renameType === 'faction') && get().phase === 'canon') {
              continue;
            }
            if (renameType === 'settlement') {
              get().renameSettlement(targetId, newName);
            }
            // The cross-save cascade (neighbours / ai_data) is owned by
            // SettlementsPanel.applyRename, replayed via the cascade executor
            // seam when present. It mutates local state but DEFERS its cloud
            // write; the affected rows ride along into the end-of-batch commit.
            if (_linkExecutor) {
              const r = await _linkExecutor(order);
              if (r && r.ok === false) throw new Error('Rename cascade failed.');
              if (r && r.settlement) linkSettlement = r.settlement;
              for (const aid of (r?.affectedIds || [])) affectedIds.add(aid);
            }
          } else if (order.type === 'link' || order.type === 'unlink') {
            // The cascade executor mutates local saves/detail for BOTH this
            // settlement and the partner, deferring its cloud write. Its
            // affected ids feed the single atomic end-of-batch persistBatch so a
            // failure restores BOTH rows (no partial apply to either settlement).
            const r = await _linkExecutor(order);
            if (r && r.ok === false) throw new Error('Neighbour link failed.');
            if (r && r.settlement) linkSettlement = r.settlement;
            for (const aid of (r?.affectedIds || [])) affectedIds.add(aid);
            // Canon flavor record (spec §2.5): generalize the rename precedent so
            // every committed order leaves a chronicle line. No-op off canon.
            const partnerName = order.payload?.partnerName || 'a neighbour';
            if (order.type === 'link') {
              get().recordCanonFlavorEntry({
                type: 'LINK_NEIGHBOUR',
                targetId: order.payload?.linkId || null,
                narrativeSummary: `A link was forged with ${partnerName}.`,
              });
            } else {
              get().recordCanonFlavorEntry({
                type: 'UNLINK_NEIGHBOUR',
                targetId: order.payload?.linkId || null,
                narrativeSummary: `The link with ${partnerName} was severed.`,
              });
            }
          }
        }

        // (4) ONE atomic persist of the WHOLE affected-row set.
        //
        // Two commit shapes, both single-write:
        //   • cascade queue (link / unlink / rename) → the registered
        //     batchCommit runs ONE persistBatch over the union of affected rows
        //     (this settlement + every partner), so a failure rolls back EVERY
        //     row (no partial apply to either settlement). The local saves/detail
        //     mirror was already mutated by the deferred cascades; the store's
        //     own dossier row is refreshed into that mirror first so the batch
        //     carries the event-applied settlement too.
        //   • pure event / settlement-name queue → the single-row
        //     persistSaveUpdate fast path (Option A — one row, itself atomic).
        const after = get();
        const nextSettlement = linkSettlement || after.settlement;
        // Refresh the local saves mirror with the store's committed dossier row
        // so the end-of-batch write (either path) carries the event deltas too.
        if (activeSaveId && after.settlement && typeof after.updateSavedSettlement === 'function') {
          after.updateSavedSettlement(activeSaveId, {
            settlement: cloneJson(after.settlement),
            campaignState: pickleCampaignState(after),
          });
        }

        let persistedOk = true;
        if (hasCascade) {
          // ONE atomic multi-row commit. _batchCommit (persistBatch) throws on a
          // failed write, restoring local saves/detail for ALL rows; it returns
          // false (or throws) on failure.
          persistedOk = await _batchCommit(Array.from(affectedIds));
        } else if (activeSaveId && after.settlement) {
          // R8: AWAIT the persist and read its boolean — persistSaveUpdate never
          // throws, so a fire-and-forget here would clear the queue while the
          // cloud write silently failed.
          persistedOk = await persistSaveUpdate(activeSaveId, {
            settlement: cloneJson(after.settlement),
            campaignState: pickleCampaignState(after),
          });
        }

        if (persistedOk === false) {
          throw new Error('persist_failed');
        }

        // Success: drop the queue. The soft-refresh (re-derive detail +
        // key-bump) is the caller's job — return the committed settlement.
        set(state => { delete state.changeQueues[key]; });
        return { ok: true, committed: queue.length, settlement: nextSettlement };
      } catch (e) {
        // Rollback: restore the pre-flush store state. The queue is UNTOUCHED, so
        // "Save N changes" re-applies from this clean base (never on a partial).
        set(state => {
          state.settlement  = preSettlement;
          state.eventLog    = preEventLog;
          state.systemState = preSystemState;
          state.editedAt    = preEditedAt;
        });
        const msg = e?.message === 'persist_failed'
          ? 'Those changes could not be saved. They are still queued — try again.'
          : (e?.message || 'The commit failed. Your changes are still queued.');
        return { ok: false, error: msg, settlement: preSettlement };
      } finally {
        set(state => { state.changeQueueFlushing = false; state.flushSuppressPersist = false; });
      }
    },
  };
}
