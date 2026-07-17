/**
 * store/fogEditSlice.js — DOOR 2 THE TABLE LAYER fog-edit store slice.
 *
 * A dedicated one-action slice, mounted at the store root (index.js), that owns the
 * fog-of-war REVEAL persist. It lives here rather than inline in settlementSlice.js
 * because that slice is a MAX-LINES-capped hot file (the "new logic = lazy leaf +
 * re-export" rule): the reveal edit is a NEW cosmetic persistence surface, so it gets
 * its own leaf. Registered MECHANICAL in operationRegistry.js (opType applyFogEdit).
 *
 * THE PERSIST BODY is the EXACT applyMapEdit idiom (a cosmetic blob write via the persist
 * triple): stamp a save-envelope timestamp → update the in-memory save entry AND the
 * active settlement → persist the durable write — so a fog reveal never GHOSTS on reload
 * (the "survives one path, ghosts another" class). `settlement.fogSessions` is the
 * per-(settlement, session) reveal-state sidecar; a NULL / empty container DELETES the key
 * ⇒ absent ⇒ byte-identical (the dormancy law). COSMETIC-ALWAYS (no canon guard — a fog
 * reveal touches no canon fact); the reveal state is fail-closed off every public/gallery
 * projection (fogSessions ∉ PUBLIC_TOPLEVEL_KEYS). Imports NO town-map domain, so the
 * first-paint static closure is unmoved (the fog domain rides the lazy pane chunk).
 */

import { cloneJson, persistSaveUpdate } from './settlementSliceHelpers.js';

/**
 * Apply a fog reveal edit to a saved settlement's blob-resident `fogSessions`.
 * `nextFogSessions` arrives PRE-NORMALIZED (the lazy controller's normalizeFogSessions → a
 * non-empty container or null): a truthy value is set, a nullish value DROPS the key. No-ops
 * when the id names no saved settlement (an unsaved draft has nowhere to persist).
 * @param {() => any} get @param {(fn: (state: any) => void) => void} set
 * @param {string|number} id @param {Record<string, unknown> | null | undefined} nextFogSessions
 */
function applyFogEditImpl(get, set, id, nextFogSessions) {
  const now = new Date().toISOString();
  /** @type {{ settlement: any, timestamp: string }|null} */
  let persist = null;
  set((state) => {
    const idx = state.savedSettlements.findIndex((s) => String(s.id) === String(id));
    if (idx === -1) return; // no persistence target — cosmetic edits home in a saved blob
    const save = state.savedSettlements[idx];
    const { fogSessions: _drop, ...rest } = save.settlement || {};
    const nextSettlement = nextFogSessions ? { ...rest, fogSessions: cloneJson(nextFogSessions) } : rest;
    state.savedSettlements[idx] = { ...save, settlement: nextSettlement, timestamp: now };
    if (String(state.activeSaveId || '') === String(id) && state.settlement) {
      state.settlement = nextSettlement;
      state.editedAt = now;
    }
    persist = { settlement: cloneJson(nextSettlement), timestamp: now };
  });
  if (persist && !get().flushSuppressPersist) persistSaveUpdate(id, persist);
}

/** The fog-edit slice: one MECHANICAL action, `applyFogEdit(id, nextFogSessions)`. */
export const createFogEditSlice = (set, get) => ({
  applyFogEdit: (id, nextFogSessions) => applyFogEditImpl(get, set, id, nextFogSessions),
});
