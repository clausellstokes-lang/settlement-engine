/**
 * settlementPendingEditsHelpers.js — the pending-edits QUEUE action bodies
 * extracted from settlementSlice (god-slice decomposition, review-remediation #5).
 *
 * This is the stage→commit edit queue: queueEdit accumulates rename/structural
 * edits, revert{Single,PendingEdits} drop them, and commitPendingEdits applies the
 * active edits against the live settlement, snapshots the checkpoint, and feeds the
 * analytics + research edit ledger. Distinct from the campaign change-queue flush in
 * changeQueueSlice.js — these actions do NOT touch the cloud-write suppression /
 * advance-window invariant; they mutate `pendingEditsQueue` and dispatch to existing
 * slice mutations (renameNPC, recordSnapshot).
 *
 * Each impl takes the slice's `get`/`set` pair and is otherwise byte-identical to the
 * inline body it replaced, so the public API (names, signatures, return values,
 * analytics events, persist ordering) is unchanged.
 */

import {
  buildEdit as _pe_buildEdit,
  appendEdit as _pe_appendEdit,
  revertEdit as _pe_revertEdit,
  activeEdits as _pe_activeEdits,
} from '../domain/pendingEdits.js';

/** Add an edit to the queue. Returns the edit so the caller can reference its id. */
export function queueEditImpl(get, set, kind, payload) {
  // Campaign-clock identity lock: reject (rather than queue) NPC/faction renames
  // once the settlement is canonized — names are frozen post-canon.
  if (get().phase === 'canon' && (kind === 'rename-npc' || kind === 'rename-faction')) {
    return null;
  }
  const clock = (get().pendingEditsClock || 0) + 1;
  const edit = _pe_buildEdit(kind, payload, clock);
  set(state => {
    state.pendingEditsClock = clock;
    state.pendingEditsQueue = _pe_appendEdit(state.pendingEditsQueue || [], edit);
  });
  // Analytics — once per queued edit. Read coarse context AFTER the append so
  // queue_depth_after reflects the new active depth. Fire-and-forget.
  const canonPhase = get().phase;
  const queueDepthAfter = _pe_activeEdits(get().pendingEditsQueue || []).length;
  import('../lib/analytics.js').then(({ Funnel, EVENTS }) => {
    Funnel.track(EVENTS.EDIT_PENDING_QUEUED, {
      kind,
      canon_phase: canonPhase,
      queue_depth_after: queueDepthAfter,
    });
  }).catch(() => {});
  return edit;
}

/** Mark an edit as reverted (kept in history for undo). */
export function revertSingleEditImpl(get, set, editId) {
  set(state => {
    state.pendingEditsQueue = _pe_revertEdit(state.pendingEditsQueue || [], editId);
  });
  // Analytics — fire-and-forget; reverting one queued edit.
  import('../lib/analytics.js').then(({ track, EVENTS }) => {
    track(EVENTS.EDIT_REVERTED, { count: 1, scope: 'single' });
  }).catch(() => {});
}

/** Discard the entire queue without applying. */
export function revertPendingEditsImpl(get, set) {
  // Count the active edits being discarded BEFORE clearing, for analytics.
  const droppedCount = _pe_activeEdits(get().pendingEditsQueue || []).length;
  set(state => {
    state.pendingEditsQueue = [];
  });
  // Analytics — fire-and-forget; whole-queue discard.
  import('../lib/analytics.js').then(({ track, EVENTS }) => {
    track(EVENTS.EDIT_REVERTED, { count: droppedCount, scope: 'all' });
  }).catch(() => {});
}

/**
 * Apply the queue against the live settlement. Each edit dispatches to an existing
 * mutation (renameNPC, etc.) by `kind`. Edits that don't map to a known mutation are
 * skipped with a warning — the queue clears either way on a successful commit.
 */
export function commitPendingEditsImpl(get, set) {
  const state = get();
  const queue = state.pendingEditsQueue || [];
  const active = _pe_activeEdits(queue);
  if (active.length === 0) return;

  for (const edit of active) {
    try {
      switch (edit.kind) {
        case 'rename-npc':
          if (typeof state.renameNPC === 'function' &&
              edit.payload?.npcIndex != null) {
            state.renameNPC(edit.payload.npcIndex, edit.payload.newName);
          }
          break;
        case 'rename-settlement':
          set(s => { if (s.settlement) s.settlement.name = edit.payload?.newName; });
          break;
        // Future kinds (add-institution etc.) dispatch to existing mutations or —
        // for not-yet-built ones — log a TODO. The queue still clears so the UI
        // isn't stuck on a missing dispatcher.
        default:
          console.info(`[commitPendingEdits] no dispatcher for ${edit.kind} yet`);
          break;
      }
    } catch (e) {
      console.warn(`[commitPendingEdits] ${edit.kind} failed:`, e);
    }
  }

  // Clear the queue. Failed-commit retry is a future-tier feature; for now,
  // all-or-nothing matches the cascade-preview UX.
  set(s => { s.pendingEditsQueue = []; });
  // Snapshot the post-commit state so the version timeline records this as a
  // discrete edit checkpoint. The user can revert to before this batch from VersionsTab.
  try {
    const labels = active.map(e => e.kind).join(', ');
    const fn = get().recordSnapshot;
    if (typeof fn === 'function') {
      fn({ kind: 'auto-commit', label: `Edits: ${labels}` });
    }
  } catch (_e) { /* silent — snapshot failure shouldn't undo the commit */ }

  // Analytics — fire-and-forget. Band the committed edits into coarse
  // structural / rename / prose counts (same kind groupings as previewCascade).
  let structuralCount = 0;
  let renameCount = 0;
  let proseCount = 0;
  for (const e of active) {
    switch (e.kind) {
      case 'add-institution':
      case 'remove-institution':
      case 'add-resource':
      case 'remove-resource':
      case 'add-stressor':
      case 'remove-stressor':
        structuralCount += 1;
        break;
      case 'rename-npc':
      case 'rename-faction':
      case 'rename-settlement':
        renameCount += 1;
        break;
      case 'edit-prose':
        proseCount += 1;
        break;
      default:
        break;
    }
  }
  const canonPhase = get().phase;
  import('../lib/analytics.js').then(({ track, EVENTS }) => {
    track(EVENTS.EDIT_COMMITTED, {
      count: active.length,
      structural_count: structuralCount,
      rename_count: renameCount,
      prose_count: proseCount,
      canon_phase: canonPhase,
    });
  }).catch(() => {});

  // Research plane (edit_events) — feed the long-built but previously-unfed edit
  // ledger. Saved settlements only (a stable uuid is required), research consent
  // gated, payloads redacted to enum/count only (never edit prose).
  const editUuid = state.activeSaveId;
  if (editUuid) {
    const preSettlement = state.settlement; // Immer-immutable pre-commit ref
    Promise.all([
      import('../lib/consent.js'),
      import('../lib/analyticsQueue.js'),
      import('../lib/editFingerprint.js'),
      import('../domain/pendingEdits.js'),
    ]).then(([{ getConsent }, { enqueueEdit }, { extractEditRows }, { previewCascade }]) => {
      if (!getConsent().research) return;
      let cascade = null;
      try { cascade = previewCascade(preSettlement, queue); } catch { /* coarse cascade is best-effort */ }
      for (const row of extractEditRows(active, { settlementUuid: editUuid, cascade })) enqueueEdit(row);
    }).catch(() => {});
  }
}
