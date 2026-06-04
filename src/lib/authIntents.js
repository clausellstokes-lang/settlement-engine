/**
 * authIntents.js — Pending action registry for "click → auth → continue" flows.
 *
 * The single highest-leverage conversion gate in the app (per the UX/UI
 * critique X-3) is "Save this town — free account." The button promises
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
      return raw ? JSON.parse(raw) : null;
    } catch { /* fall through */ }
  }
  return _memoryStore;
}

function writeStored(value) {
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return;
    } catch { /* fall through */ }
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

/** Set the pending intent. Overwrites any prior intent — only one at a time. */
export function setPending(type, payload) {
  if (!type) return;
  writeStored({ type, payload, stashedAt: Date.now() });
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
 *  intent is cleared once a handler exists, whether that handler succeeded
 *  or threw — failed handled intents do NOT linger across sessions. */
export async function consume(ctx) {
  const pending = readPending();
  if (!pending) return null;

  const handler = _handlers.get(pending.type);
  if (!handler) {
    if (typeof console !== 'undefined') {

      console.warn(`[authIntents] no handler registered for "${pending.type}"`);
    }
    return null;
  }

  clearPending();
  try {
    return await handler(pending.payload, ctx || {});
  } catch (e) {
    if (typeof console !== 'undefined') {

      console.warn(`[authIntents] handler "${pending.type}" threw:`, e);
    }
    return null;
  }
}

/** Test util — reset all registrations and stored state. */
export function _resetForTests() {
  _handlers.clear();
  clearStored();
}
