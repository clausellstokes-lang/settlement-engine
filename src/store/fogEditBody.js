/**
 * store/fogEditBody.js — DOOR 2 THE TABLE LAYER fog-edit persist body (LAZY chunk).
 *
 * The applyFogEdit action body. It lives in its own module — dynamic-imported by the eager
 * fogEditSlice trampoline — so the first-paint static closure carries only the ~trampoline
 * bytes, never this body (the world-pulse macro-op / mapSlice-roadNetwork first-paint-budget
 * idiom; the setActiveSaveId header records the byte constitution this honors).
 *
 * THE PERSIST BODY is the EXACT applyMapEdit idiom (a cosmetic blob write via the persist
 * triple): stamp a save-envelope timestamp → update the in-memory save entry AND the active
 * settlement → persist the durable write — so a fog reveal never GHOSTS on reload, and a later
 * applyEvent/persistActiveSaveEdit clone of the LIVE settlement carries the fog too (the
 * "survives one path, ghosts another" class). `settlement.fogSessions` is the per-(settlement,
 * session) reveal-state sidecar; a NULL / empty container DELETES the key ⇒ absent ⇒
 * byte-identical (the dormancy law). COSMETIC-ALWAYS (no canon guard — a fog reveal touches no
 * canon fact); the reveal state is fail-closed off every public/gallery projection
 * (fogSessions ∉ PUBLIC_TOPLEVEL_KEYS). No random ids / wall-clock touch the blob (the only
 * stamp is the save envelope). Imports NO town-map domain.
 */

import { cloneJson, persistSaveUpdate } from './settlementSliceHelpers.js';

/**
 * Apply a fog reveal edit to a saved settlement's blob-resident `fogSessions`.
 * `nextFogSessions` arrives PRE-NORMALIZED (the lazy controller's normalizeFogSessions → a
 * non-empty container or null): a truthy value is set, a nullish value DROPS the key. No-ops
 * when the id names no saved settlement (an unsaved draft has nowhere to persist).
 * @param {() => any} get   the zustand store getter
 * @param {(fn: (state: any) => void) => void} set   the zustand (immer) setter
 * @param {string|number} id
 * @param {Record<string, unknown> | null | undefined} nextFogSessions
 * @returns {void}
 */
export function applyFogEditImpl(get, set, id, nextFogSessions) {
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
