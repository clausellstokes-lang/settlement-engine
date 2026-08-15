/**
 * store/fogEditSlice.js — DOOR 2 THE TABLE LAYER fog-edit store slice (eager TRAMPOLINE).
 *
 * A dedicated one-action slice, mounted at the store root (index.js). The eager half is ONLY
 * this trampoline: it dynamic-imports the persist body (fogEditBody.js — a lazy chunk) and
 * passes `set`/`get` through — the operation walker's documented "set passed to a lazily-loaded
 * session helper" pattern (the world-pulse macro-ops' first-paint-budget idiom), honoring the
 * byte constitution the setActiveSaveId header records (an inline body here would be ~500 B of
 * eager store code in the first-paint index chunk). The one observable shift: the store write
 * lands a microtask later (the pane keeps an optimistic mirror; the durable write was already
 * async). Returns the promise so tests/callers can await the settled write.
 *
 * The action lives here rather than inline in settlementSlice.js because that slice is a
 * MAX-LINES-capped hot file (the "new logic = lazy leaf + re-export" rule). Registered
 * MECHANICAL in operationRegistry.js (opType applyFogEdit). Laws + persist shape: see
 * fogEditBody.js.
 */

/** The fog-edit slice: one MECHANICAL action, `applyFogEdit(id, nextFogSessions)`. */
export const createFogEditSlice = (set, get) => ({
  applyFogEdit: (id, nextFogSessions) =>
    import('./fogEditBody.js').then((m) => m.applyFogEditImpl(get, set, id, nextFogSessions)),
});
