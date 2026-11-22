/**
 * aiDossierPinActions.js — the store-facing facade for the two per-save DM
 * annotations that ride in `ai_data`: the dossier notes and the pinned-NPC set.
 *
 * Moved out of aiSlice.js verbatim by THE DECOMPOSITION WAVE (lane D). The
 * slice keeps the action KEYS (so the operation registry and every consumer
 * census still read them off the slice literal) and delegates the bodies here,
 * exactly as settlementPendingEditActions.js does for the pending-edit lane.
 *
 * None of these four touch `set`: the save entry in `savedSettlements` is the
 * single source of truth, written through `updateSavedSettlement` and persisted
 * through the ai_data outbox lane. So they take `get` alone.
 */

import { persistSaveUpdate } from './campaignSliceShared.js';
import { buildAiDataBlob } from './aiPersistenceEnvelope.js';

/** @typedef {() => any} StoreGet */

/**
 * Write the DM notes / AI guidance pair onto a save's ai_data blob.
 *
 * The ONE ai_data writer that rejects: NotesTab shows a retry affordance off
 * this rejection (its catch is load-bearing). The outbox still holds the write
 * and retries it, so the rejection now means "not landed yet", not "lost" — the
 * local draft text and the queued op both survive.
 *
 * @param {StoreGet} get
 * @param {string} saveId
 * @param {{dmNotes?: string, aiGuidance?: string}} [notes]
 * @returns {Promise<{dmNotes: string, aiGuidance: string, updatedAt: string}|null>}
 */
export async function updateDossierNotesAction(get, saveId, notes = {}) {
  if (!saveId) return null;
  const entry = get().savedSettlements.find(s => s.id === saveId);
  if (!entry) return null;
  const dossierNotes = {
    dmNotes: typeof notes.dmNotes === 'string' ? notes.dmNotes : '',
    aiGuidance: typeof notes.aiGuidance === 'string' ? notes.aiGuidance : '',
    updatedAt: new Date().toISOString(),
  };
  const nextAiData = buildAiDataBlob(entry.aiData, { dossierNotes });
  get().updateSavedSettlement(saveId, { aiData: nextAiData });
  if (!(await persistSaveUpdate(saveId, { aiData: nextAiData }))) {
    throw new Error('Dossier notes did not reach the cloud on this attempt; the write is queued for retry.');
  }
  return dossierNotes;
}

// ── Pinned NPCs (AI-4a) ─────────────────────────────────────────────────────
//
// The DM can pin specific NPCs on a save; pinned ids ride along with every
// narrative and (future) progression request, and the `npcs` refinement pass
// filters them out before building its payload. Net effect: pinned NPCs are
// byte-identical across regenerations. Persistence is through ai_data so the
// pin survives reload and is scoped per-save.
//
// Storage: `savedSettlements[].aiData.pinnedNpcs: Array<string|number>`
// (normalized to strings at call sites — the edge function coerces).
//
// No in-session mirror — the save entry is the single source of truth, read
// live via `useStore(s => s.savedSettlements.find(...))` in components.

/**
 * Pin an NPC on a save so regenerations don't rewrite it. No-op if already
 * pinned. Persists through the ai_data outbox lane; a failed first attempt
 * leaves the in-memory pin in place and retries (same policy as cosmetic rename).
 * @param {StoreGet} get
 * @param {string} saveId
 * @param {string|number} npcId
 */
export async function pinNpcAction(get, saveId, npcId) {
  if (!saveId || npcId == null) return;
  const key = String(npcId);
  const entry = get().savedSettlements.find(s => s.id === saveId);
  if (!entry) return;
  const current = Array.isArray(entry.aiData?.pinnedNpcs) ? entry.aiData.pinnedNpcs : [];
  if (current.some(x => String(x) === key)) return; // already pinned
  const nextAiData = { ...(entry.aiData || {}), pinnedNpcs: [...current, key] };
  get().updateSavedSettlement(saveId, { aiData: nextAiData });
  await persistSaveUpdate(saveId, { aiData: nextAiData });
}

/**
 * Unpin an NPC. No-op if not pinned. Mirror of pinNpcAction.
 * @param {StoreGet} get
 * @param {string} saveId
 * @param {string|number} npcId
 */
export async function unpinNpcAction(get, saveId, npcId) {
  if (!saveId || npcId == null) return;
  const key = String(npcId);
  const entry = get().savedSettlements.find(s => s.id === saveId);
  if (!entry) return;
  const current = Array.isArray(entry.aiData?.pinnedNpcs) ? entry.aiData.pinnedNpcs : [];
  const next = current.filter(x => String(x) !== key);
  if (next.length === current.length) return; // not pinned; nothing to do
  const nextAiData = { ...(entry.aiData || {}), pinnedNpcs: next };
  get().updateSavedSettlement(saveId, { aiData: nextAiData });
  await persistSaveUpdate(saveId, { aiData: nextAiData });
}

/**
 * Selector: is this NPC currently pinned on this save? Reads from live
 * savedSettlements state; safe to call in render.
 * @param {StoreGet} get
 * @param {string} saveId
 * @param {string|number} npcId
 * @returns {boolean}
 */
export function isNpcPinnedSelector(get, saveId, npcId) {
  if (!saveId || npcId == null) return false;
  const key = String(npcId);
  const entry = get().savedSettlements.find(s => s.id === saveId);
  const pinned = Array.isArray(entry?.aiData?.pinnedNpcs) ? entry.aiData.pinnedNpcs : [];
  return pinned.some(x => String(x) === key);
}
