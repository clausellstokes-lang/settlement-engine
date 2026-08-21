/**
 * deviceToken.js — a stable, anonymous per-device token (§6).
 *
 * Used to de-duplicate gallery view counts for signed-out readers: the same
 * device counts at most one view per dossier per day. It is NOT an identifier
 * we tie to a person — it's a random opaque string in localStorage, regenerated
 * if cleared, and never sent anywhere except the bump_public_view RPC.
 *
 * Pure-ish: persistence is the only side effect, behind defensive guards so a
 * private-mode / disabled-storage browser degrades to a per-session token
 * rather than throwing.
 */

const STORAGE_KEY = 'sf_view_token';
let memoryToken = null; // fallback when localStorage is unavailable

function randomToken() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch { /* fall through */ }
  // Fallback: not cryptographically strong, but fine for a dedup key.
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Return the persistent anon device token, creating + storing one on first use.
 * Always returns a non-empty string (length ≥ 8) so it satisfies the RPC guard.
 */
export function getDeviceToken() {
  let store = null;
  try {
    store = typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    /* localStorage access can throw in sandboxed iframes — leave store null */
  }

  if (store) {
    try {
      const existing = store.getItem(STORAGE_KEY);
      if (existing && existing.length >= 8) return existing;
      const fresh = randomToken();
      store.setItem(STORAGE_KEY, fresh);
      return fresh;
    } catch {
      /* quota / disabled — fall through to memory token */
    }
  }

  if (!memoryToken) memoryToken = randomToken();
  return memoryToken;
}

// Exposed for tests to reset the in-memory fallback between cases.
export const __TOKEN_STORAGE_KEY = STORAGE_KEY;
export function __resetMemoryToken() { memoryToken = null; }
