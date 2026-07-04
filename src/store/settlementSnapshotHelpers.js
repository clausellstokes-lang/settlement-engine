/**
 * settlementSnapshotHelpers.js — the version-history (snapshot) action bodies
 * extracted from settlementSlice (WS4 decomposition).
 *
 * `recordSnapshot` / `revertToSnapshot` are the two version-timeline mutations.
 * They hold no store state of their own: each takes the slice's `get`/`set`
 * pair and operates on the live settlement (or a named save's settlement
 * payload) exactly as the inline action bodies did. Moving them here shrinks the
 * settlementSlice megafile without changing behaviour — the slice keeps a thin
 * action method that delegates straight through, so the public API (action
 * names, signatures, return values) is byte-identical.
 *
 * The module never imports settlementSlice, so there is no cycle; the shared
 * persist/clone/version-cap surface comes from settlementSliceHelpers.
 */
import { deepClone } from '../domain/clone.js';
import {
  cloneJson, persistSaveUpdate, cappedVersionHistory,
} from './settlementSliceHelpers.js';

/**
 * Append a frozen snapshot of the live settlement (or a specified save) into
 * `versionHistory`. Snapshots are immutable — the timeline never mutates an
 * existing entry. Saved-settlement timelines persist immediately through the
 * normal save service; unsaved draft timelines stay live-only until saved.
 *
 * @param {Function} get  the slice's get()
 * @param {Function} set  the slice's set() (Immer producer)
 * @param {{saveId?: string|null, kind?: string, label?: string, ts?: number}} [opts]
 * @returns {{id:string, ts:number, kind:string, label:string, settlement:any}} the recorded snapshot
 */
export function recordSnapshotImpl(get, set, opts = {}) {
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
    settlement: sourceSettlement ? deepClone(sourceSettlement) : null,
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
    // No saveId — write into the live settlement's history. This
    // lets unsaved sessions still build a local timeline.
    set(s => {
      if (!s.settlement) return;
      s.settlement.versionHistory = cappedVersionHistory([...(Array.isArray(s.settlement.versionHistory) ? s.settlement.versionHistory : []), snapshot]);
    });
  }
  if (targetSaveId && persistedHistory) {
    // Fire-and-forget: version-history snapshots are a non-critical local
    // timeline (recordSnapshot is synchronous by contract, so it can't await).
    // persistSaveUpdate never throws and surfaces cloud failures via the
    // campaignSyncError banner; the .catch is defensive against a future
    // contract change so a rejected persist can't become an unhandled rejection.
    Promise.resolve(persistSaveUpdate(targetSaveId, { versionHistory: persistedHistory })).catch(() => {});
  }
  return snapshot;
}

/**
 * Revert the live settlement (or a save) to a prior snapshot. Auto-snapshots
 * the CURRENT state first (via the slice's recordSnapshot) so the action is
 * never destructive — the user can re-revert if they meant the other thing.
 *
 * @param {Function} get  the slice's get()
 * @param {Function} set  the slice's set() (Immer producer)
 * @param {{saveId?: string|null, snapshotId?: string}} args
 * @returns {boolean} true when a revert was applied.
 */
export function revertToSnapshotImpl(get, set, { saveId, snapshotId }) {
  if (!snapshotId) return false;
  const state = get();
  const targetSaveId = saveId || state.activeSaveId || null;
  // Read the snapshot from the appropriate version-history slot.
  const history = targetSaveId
    ? state.savedSettlements.find(e => String(e.id) === String(targetSaveId))?.versionHistory
    : state.settlement?.versionHistory;
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
  let persistedSettlement = null;
  let persistedHistory = null;
  set(s => {
    if (targetSaveId) {
      const idx = s.savedSettlements.findIndex(e => String(e.id) === String(targetSaveId));
      if (idx === -1) return;
      s.savedSettlements[idx].settlement = deepClone(target.settlement);
      persistedSettlement = cloneJson(s.savedSettlements[idx].settlement);
      persistedHistory = cloneJson(s.savedSettlements[idx].versionHistory || []);
    }
    // Always also refresh the live settlement view so the user sees
    // the revert immediately.
    s.settlement = deepClone(target.settlement);
  });
  if (targetSaveId && persistedSettlement) {
    persistSaveUpdate(targetSaveId, {
      settlement: persistedSettlement,
      versionHistory: cappedVersionHistory(persistedHistory),
    });
  }
  return true;
}
