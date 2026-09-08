/**
 * aiChronicleAppend.js — the store-facing facade for appending one entry to a
 * save's chronicle, with tier-based rotation.
 *
 * Moved out of aiSlice.js verbatim by THE DECOMPOSITION WAVE (lane D). The slice
 * keeps the `_appendChronicleEntry` key (three call sites go through
 * `get()._appendChronicleEntry(...)`, and ChroniclePanel.jsx documents that name
 * as the owner of rotation and appending) and delegates the body here, exactly as
 * settlementPendingEditActions.js does for the pending-edit lane.
 *
 * `set` is never touched: the save entry is written through
 * `updateSavedSettlement` and persisted through the ai_data outbox lane, so this
 * takes `get` alone.
 */

import { persistSaveUpdate } from './campaignSliceShared.js';
import { CHRONICLE_LIMITS, createChronicleEntry, appendChronicleEntry } from '../lib/chronicle.js';
import { isCanonSave } from '../domain/campaign/canon.js';

/** @typedef {() => any} StoreGet */

/**
 * @param {StoreGet} get
 * @param {string} saveId
 * @param {{reason: string, triggeredBy?: any, mode?: string, aiSettlement?: any, aiDailyLife?: any}} opts
 */
export async function appendChronicleEntryAction(
  get,
  saveId,
  { reason, triggeredBy = null, mode = 'full', aiSettlement, aiDailyLife },
) {
  if (!saveId) return;
  const state = get();
  const entry = state.savedSettlements.find(s => s.id === saveId);
  if (!entry) return;

  // Canon gate — regenerations only start chronicling after the save is
  // canonized. canonize() persists campaignState to the save immediately
  // (persistActiveSaveLifecycle), so the entry read above is never stale.
  if (reason === 'regenerate' && !isCanonSave(entry)) return;

  const limit = state.isElevated?.() ? CHRONICLE_LIMITS.elevated
              : state.isPremium?.()  ? CHRONICLE_LIMITS.premium
              : CHRONICLE_LIMITS.free;

  // Prefer the run's OWN prose (threaded by the caller). Only fall back to the
  // live store view when this save is the one on screen — otherwise a
  // mid-generation switch would snapshot another settlement's prose under this
  // save's chronicle. (Ported master fix.)
  const sourceProvided = aiSettlement !== undefined || aiDailyLife !== undefined;
  const liveIsThisSave = state.activeSaveId == null || state.activeSaveId === saveId;
  const snapshotSettlement = sourceProvided
    ? (aiSettlement ?? null)
    : (liveIsThisSave ? state.aiSettlement : null);
  const snapshotDailyLife = sourceProvided
    ? (aiDailyLife ?? null)
    : (liveIsThisSave ? state.aiDailyLife : null);

  const newEntry = createChronicleEntry({
    reason,
    aiSettlement: snapshotSettlement,
    aiDailyLife:  snapshotDailyLife,
    triggeredBy,
    mode,
  });

  const nextChronicle = appendChronicleEntry(
    Array.isArray(entry.aiData?.chronicle) ? entry.aiData.chronicle : [],
    newEntry,
    { limit },
  );

  const nextAiData = { ...(entry.aiData || {}), chronicle: nextChronicle };
  get().updateSavedSettlement(saveId, { aiData: nextAiData });
  // Non-fatal by contract: a first-attempt failure is reported by the outbox
  // runner (console warn + campaignSyncError) and the op retries on its own.
  await persistSaveUpdate(saveId, { aiData: nextAiData });
}
