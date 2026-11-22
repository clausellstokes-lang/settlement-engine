/**
 * settlementVersionHistoryActions.js — the store-facing facade for the draft +
 * saved version-history timeline, moved out of settlementSlice.js verbatim by
 * THE DECOMPOSITION WAVE (lane D).
 *
 * The slice keeps both action KEYS (and the whole lane docblock that explains the
 * sibling-timeline design and the save-to-library hand-off) and delegates the
 * bodies here, exactly as settlementPendingEditActions.js does for the
 * pending-edit lane. Both actions take (set, get) and return the same
 * ActionResult envelopes as before — including revertToSnapshot's deliberate
 * bare `false` on every failure fast-path, which VersionsTab reads as a boolean.
 */
import { deriveSystemState } from '../domain/state/deriveSystemState.js';
import { makeReceipt } from '../domain/trace.js';
import { makeActionResult } from './actionResult.js';
import {
  cloneJson, persistSaveUpdate, cappedVersionHistory, pickleCampaignState,
  snapshotSettlement, snapshotTargetMissingRefusal,
} from './settlementSliceHelpers.js';

/** @typedef {(recipe:(state:any) => void) => void} StoreSet */
/** @typedef {() => any} StoreGet */

/**
 * Append a frozen snapshot of the live settlement (or a specified save) into the
 * appropriate timeline sibling.
 * @param {StoreSet} set
 * @param {StoreGet} get
 * @param {{saveId?: string|null, kind?: string, label?: string, ts?: number}} [opts]
 */
export function recordSnapshotAction(set, get, opts = {}) {
  const state = get();
  const ts = opts.ts || Date.now();
  const targetSaveId = opts.saveId || state.activeSaveId || null;
  const activeTarget = targetSaveId && state.activeSaveId && String(targetSaveId) === String(state.activeSaveId);
  const sourceSettlement = targetSaveId
    ? (activeTarget ? state.settlement : state.savedSettlements.find(e => String(e.id) === String(targetSaveId))?.settlement)
    : state.settlement;
  const snapshot = {
    id: `snap_${ts}_${Math.random().toString(36).slice(2, 8)}`,
    ts,
    kind: opts.kind || 'manual',
    label: opts.label || 'Snapshot',
    // Snapshot CONTENT only — snapshotSettlement strips the settlement's own
    // versionHistory so a snapshot never embeds the timeline (no 2^N nesting).
    settlement: snapshotSettlement(sourceSettlement),
  };
  let persistedHistory = null;
  if (targetSaveId) {
    set(s => {
      const idx = s.savedSettlements.findIndex(e => String(e.id) === String(targetSaveId));
      if (idx === -1) return;
      const cur = s.savedSettlements[idx];
      cur.versionHistory = cappedVersionHistory([...(Array.isArray(cur.versionHistory) ? cur.versionHistory : []), snapshot]);
      persistedHistory = cloneJson(cur.versionHistory);
    });
  } else {
    // No saveId — append to the SIBLING draft timeline (never into the
    // settlement itself), so unsaved sessions build a local timeline
    // without the settlement content ever nesting its own history.
    set(s => {
      s.draftVersionHistory = cappedVersionHistory([...(Array.isArray(s.draftVersionHistory) ? s.draftVersionHistory : []), snapshot]);
    });
  }
  // ENVELOPE HONESTY: a targetSaveId the savedSettlements cache does not hold
  // appended nothing to any timeline and persisted nothing (the producer above
  // returns on idx === -1), so the action must REFUSE. It used to fall through
  // to the success envelope below, handing back an `after.snapshotId` for a
  // snapshot that exists nowhere — and commitPendingEditScope mints its batch
  // undo token off exactly that field. The window is real and not transient:
  // the save chokepoints stamp activeSaveId on a row the cache only learns
  // about at its next hydration (see setActiveSaveId's header).
  if (targetSaveId && !persistedHistory) return snapshotTargetMissingRefusal(targetSaveId);
  if (targetSaveId) persistSaveUpdate(targetSaveId, { versionHistory: persistedHistory });
  // Track K §C2 — ActionResult envelope. The immutable snapshot maps to an
  // 'edit'-source Receipt (kind 'history': a checkpoint in the settlement's
  // timeline); the snapshot id is also surfaced on `after.snapshotId` for
  // callers that only need to reference it.
  const timeline = targetSaveId ? 'saved' : 'draft';
  return makeActionResult('recordSnapshot', {
    before: { targetSaveId: targetSaveId ?? null, timeline },
    after:  { snapshotId: snapshot.id, kind: snapshot.kind, label: snapshot.label, timeline },
    receipts: [makeReceipt({
      source: 'edit',
      kind: 'history',
      targetId: snapshot.id,
      causes: [{ source: 'edit', effect: snapshot.kind, reason: snapshot.label }],
    })],
    persistenceOps: targetSaveId
      ? [{ saveId: String(targetSaveId), kind: 'save-update', fields: ['versionHistory'] }]
      : [],
  });
}

/**
 * Revert the live settlement (or a save) to a prior snapshot. Auto-snapshots the
 * CURRENT state first so the user can re-revert if they meant the other thing.
 * @param {StoreSet} set
 * @param {StoreGet} get
 * @param {{saveId?: string|null, snapshotId?: string}} opts
 */
export function revertToSnapshotAction(set, get, { saveId, snapshotId } = {}) {
  if (!snapshotId) return false;
  const state = get();
  const targetSaveId = saveId || state.activeSaveId || null;
  // Read the snapshot from the appropriate version-history slot: the saved
  // entry's sibling for a save, or the draft sibling for an unsaved session.
  const history = targetSaveId
    ? state.savedSettlements.find(e => String(e.id) === String(targetSaveId))?.versionHistory
    : state.draftVersionHistory;
  if (!Array.isArray(history)) return false;
  const target = history.find(s => s.id === snapshotId);
  if (!target?.settlement) return false;
  // Snapshot the pre-revert state so this action is non-destructive.
  try {
    const fn = get().recordSnapshot;
    if (typeof fn === 'function') {
      fn({
        saveId: targetSaveId,
        kind: 'pre-revert',
        label: `Before revert to ${target.label || 'snapshot'}`,
      });
    }
  } catch (_e) { /* silent */ }
  // Apply.
  const activeTarget = Boolean(targetSaveId && String(targetSaveId) === String(state.activeSaveId));
  let persistedSettlement = null;
  let persistedHistory = null;
  set(s => {
    if (targetSaveId) {
      const idx = s.savedSettlements.findIndex(e => String(e.id) === String(targetSaveId));
      if (idx === -1) return;
      s.savedSettlements[idx].settlement = cloneJson(target.settlement);
      persistedSettlement = cloneJson(s.savedSettlements[idx].settlement);
      persistedHistory = cloneJson(s.savedSettlements[idx].versionHistory || []);
    }
    // Always refresh the live settlement view so the user sees the revert
    // immediately. Restore CONTENT only (snapshotSettlement strips any
    // versionHistory the payload may carry): the timeline lives in the
    // sibling (draftVersionHistory here, the saved entry above), so this
    // restore no longer clobbers it — the freshly-recorded pre-revert
    // snapshot survives and re-revert works. This is the F16 non-destructive
    // fix: the draft revert used to overwrite the whole object (timeline and
    // all) with the target's stale embedded history.
    s.settlement = snapshotSettlement(target.settlement);
    // state-lifecycle-2: re-derive systemState from the RESTORED settlement and
    // stamp editedAt. Without this the live state rail / timeline deltas / event
    // previews (which take state.systemState as input) reflected the reverted-AWAY
    // settlement, and the persisted campaign_state.systemState stayed stale too —
    // a ghost that survived reload (hydrateFromSave prefers cs.systemState). Every
    // sibling mutator (applyEvent / undoLastEvent / destroySavedSettlement) already
    // re-derives + persists campaignState; revert was the one path that didn't.
    try { s.systemState = deriveSystemState(s.settlement); }
    catch (e) {
      console.warn('[settlementSlice] revert deriveSystemState failed:', e);
      s.systemState = null;
    }
    s.editedAt = new Date().toISOString();
  });
  const persisted = Boolean(targetSaveId && persistedSettlement);
  if (persisted) {
    // For the ACTIVE save, fold the re-derived systemState (and the rest of the
    // live lifecycle) into the persisted campaignState so the stored row + a reload
    // agree with the reverted settlement. A non-active-save revert (unreachable via
    // current UI) keeps the prior behavior — settlement + versionHistory only.
    let afterCampaignState = null;
    if (activeTarget) {
      afterCampaignState = pickleCampaignState(get());
      if (typeof get().updateSavedSettlement === 'function') {
        get().updateSavedSettlement(targetSaveId, { campaignState: afterCampaignState });
      }
    }
    persistSaveUpdate(targetSaveId, {
      settlement: persistedSettlement,
      versionHistory: cappedVersionHistory(persistedHistory),
      ...(afterCampaignState ? { campaignState: afterCampaignState } : {}),
    });
  }
  // Track K §C1 — ActionResult envelope on the SUCCESS path. The failure
  // fast-paths above deliberately keep returning bare `false`: VersionsTab
  // (`const ok = revertToSnapshot(...); if (!ok)`) and its component test read
  // the raw return as a boolean, and an envelope object is always truthy — so
  // failure must stay falsy until that call site migrates to `.ok` (a
  // component change outside this store-only fence). Success returning a
  // truthy envelope keeps `if (!ok)` correct.
  const timeline = targetSaveId ? 'saved' : 'draft';
  return makeActionResult('revertToSnapshot', {
    before: { targetSaveId: targetSaveId ?? null, snapshotId, timeline },
    after:  { restoredSnapshotId: snapshotId, restoredLabel: target.label ?? null, timeline },
    persistenceOps: persisted
      ? [{ saveId: String(targetSaveId), kind: 'save-update', fields: activeTarget ? ['settlement', 'versionHistory', 'campaignState'] : ['settlement', 'versionHistory'] }]
      : [],
  });
}
