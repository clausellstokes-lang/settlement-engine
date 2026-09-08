/**
 * authIntents.js — Pending action registry for "click → auth → continue" flows.
 *
 * The single highest-leverage conversion gate in the app (per the UX/UI
 * critique) is "Save this town — free account." The button promises
 * to save the dossier; the auth modal opens; the user signs in; the
 * save must fire automatically.
 *
 * Without a generalized intent contract, every such flow re-invents the
 * wheel and risks the post-auth step silently dropping (which is what
 * happens today for the disabled save button — the user just stares).
 *
 * This module is that contract:
 *
 *   1. Components call `setPending('save-settlement', payload)` before
 *      opening the AuthModal.
 *   2. AuthModal's onSuccess handler calls `consume()` to pull the
 *      pending intent and dispatch it through the registry.
 *   3. The registry routes the intent to a handler module that knows
 *      how to execute it (e.g. savesService.save for save-settlement).
 *
 * Storage: sessionStorage by default — intents are ephemeral, scoped to
 * a single browser session. If sessionStorage is unavailable, falls
 * back to an in-memory map (still works on a single page lifetime).
 *
 * Adding a new intent type:
 *   1. Add a string constant + JSDoc payload shape to INTENTS below.
 *   2. Register a handler via `registerHandler(name, handlerFn)` from
 *      module-init code in the slice/lib that owns the action.
 *   3. The handler receives `(payload, ctx)` where ctx has `{ user,
 *      tier, store }` for post-auth context.
 */

const STORAGE_KEY = 'sf:auth_intent';
const TTL_MS = 30 * 60 * 1000; // 30 minutes — well past the longest auth flow

// Monotonic counter for the per-stash id. Combined with stashedAt it makes a
// dispatch key that's stable for one stash but distinct across re-stashes — so
// the in-flight guard below can tell "the same intent firing twice" apart from
// "a fresh intent the user re-stashed after a retry".
let _stashSeq = 0;

/** Intent type constants. Keep snake_case stable strings; analytics + tests pin on these. */
export const INTENTS = Object.freeze({
  SAVE_SETTLEMENT:  'save-settlement',
  BUY_DOSSIER:      'buy-dossier',
  SHARE_GALLERY:    'share-gallery',
  CLAIM_FOUNDER:    'claim-founder',
});

// ── Storage shim ──────────────────────────────────────────────────────
// sessionStorage is preferred (cleared on tab close). In-memory fallback
// keeps the API working on locked-down browsers or SSR.
let _memoryStore = null;

function readStored() {
  if (typeof sessionStorage !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      // Fall back to the in-memory store when sessionStorage has nothing — a
      // prior write may have failed (locked-down browser) but read succeeds, in
      // which case the intent only lives in memory.
      return raw ? JSON.parse(raw) : _memoryStore;
    } catch { /* fall through */ }
  }
  return _memoryStore;
}

function writeStored(value) {
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      _memoryStore = null; // keep the two stores coherent on success
      return;
    } catch {
      // The write failed (quota/disabled) but an EARLIER write may have left a
      // stale value in sessionStorage. readStored prefers a present
      // sessionStorage value over _memoryStore, so that stale value would
      // shadow the correct in-memory fallback below. Drop it first to keep the
      // two stores coherent.
      try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    }
  }
  _memoryStore = value;
}

function clearStored() {
  if (typeof sessionStorage !== 'undefined') {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }
  _memoryStore = null;
}

// ── Public API ────────────────────────────────────────────────────────

/** Set the pending intent. Overwrites any prior intent — only one at a time.
 *  Each stash gets a fresh `id` so a re-stash (e.g. after a failed save the
 *  user retries) is a distinct intent the in-flight guard won't suppress. */
export function setPending(type, payload) {
  if (!type) return;
  const id = `${Date.now()}-${++_stashSeq}`;
  writeStored({ type, payload, stashedAt: Date.now(), id });
}

/** Read the pending intent without consuming it. Returns null when empty
 *  or expired. Expiry clears the stash as a side effect. */
export function readPending() {
  const stored = readStored();
  if (!stored || typeof stored.stashedAt !== 'number') return null;
  if (Date.now() - stored.stashedAt > TTL_MS) {
    clearStored();
    return null;
  }
  return { type: stored.type, payload: stored.payload };
}

/** Clear any pending intent without dispatching. */
export function clearPending() {
  clearStored();
}

// ── Handler registry ──────────────────────────────────────────────────
const _handlers = new Map();

// One-shot guard: the id of the stash currently being dispatched. SIGNED_IN
// fires consume() and can re-fire (token refresh, a second tab, sign-out +
// sign-in) while the first dispatch is still awaiting its async handler. The
// L15 contract keeps a failed intent stashed for a retry, so without this guard
// a re-fire would re-enter the handler on the same stash → a duplicate save.
// We track the in-flight id and treat a concurrent consume of that same id as a
// no-op. It clears once the dispatch settles, so a deliberate retry still runs.
let _inFlightId = null;

/** Register a handler for an intent type. Module-init time call. */
export function registerHandler(type, handlerFn) {
  if (typeof handlerFn !== 'function') {
    throw new Error(`authIntents: handler for "${type}" is not a function`);
  }
  _handlers.set(type, handlerFn);
}

/** Test/util — drop a handler registration (used by reset() in tests). */
export function unregisterHandler(type) {
  _handlers.delete(type);
}

/** Consume + dispatch the pending intent. Called by AuthModal's success
 *  handler. Returns the handler's return value (or null on no-op). The
 *  intent is cleared ONLY after the handler resolves successfully — a handler
 *  that throws OR returns a falsy result (the SAVE_SETTLEMENT handler returns
 *  null on save failure rather than throwing) leaves the intent stashed so the
 *  user can retry instead of silently losing their dossier. */
export async function consume(ctx) {
  const stored = readStored();
  const pending = readPending();
  if (!pending) return null;

  // Idempotency: if a dispatch for this exact stash is already in flight, a
  // re-fire (concurrent SIGNED_IN) must not re-enter the handler. Bail out
  // rather than duplicate the side effect (a duplicate save).
  //
  // setPending always assigns an id, but a stash can reach consume() without
  // one — an older stash format, or an intent written outside setPending. With
  // no id the guard would key on null and never match, so a no-id intent could
  // re-fire and duplicate the save. Backfill a stable id and persist it so the
  // concurrent re-fire reads the SAME key and the guard catches it.
  let stashId = stored?.id ?? null;
  if (stored && stashId === null) {
    stashId = `backfill-${Date.now()}-${++_stashSeq}`;
    writeStored({ ...stored, id: stashId });
  }
  if (stashId !== null && _inFlightId === stashId) return null;

  const handler = _handlers.get(pending.type);
  if (!handler) {
    if (typeof console !== 'undefined') {

      console.warn(`[authIntents] no handler registered for "${pending.type}"`);
    }
    return null;
  }

  _inFlightId = stashId;
  try {
    const result = await handler(pending.payload, ctx || {});
    // A falsy result signals the handler could not complete (e.g. the save
    // failed). Keep the intent stashed in that case so it survives for a retry.
    if (result) clearPending();
    return result;
  } catch (e) {
    if (typeof console !== 'undefined') {

      console.warn(`[authIntents] handler "${pending.type}" threw:`, e);
    }
    // Leave the intent stashed — a throw is a failure, not a consumed success.
    return null;
  } finally {
    // Release the guard so a deliberate retry (or a re-stash) can dispatch
    // again. A still-stashed failed intent will only re-fire on the NEXT
    // SIGNED_IN, never re-enter while this dispatch is mid-flight.
    if (_inFlightId === stashId) _inFlightId = null;
  }
}

/** Test util — reset all registrations and stored state. */
export function _resetForTests() {
  _handlers.clear();
  clearStored();
  _inFlightId = null;
}
