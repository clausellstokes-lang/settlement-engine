/**
 * supabase.js — Supabase client singleton.
 *
 * Reads project URL and anon key from environment variables.
 * These are safe to expose client-side — RLS policies protect data.
 *
 * Setup:
 *   1. Create a Supabase project at https://supabase.com
 *   2. Create .env with:
 *        VITE_SUPABASE_URL=https://yourproject.supabase.co
 *        VITE_SUPABASE_ANON_KEY=eyJ...
 *   3. Run the SQL migrations in /supabase/migrations/
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || '';
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const forceLocalData = import.meta.env.VITE_E2E_LOCAL_DATA === 'true';

// When env vars are missing, create a dummy client that won't crash but won't connect.
// This allows local dev without Supabase configured.
const isConfigured = !!(supabaseUrl && supabaseAnon) && !forceLocalData;

// No-op cross-tab lock. supabase-js defaults to `navigator.locks` on an
// exclusive lock named `lock:sb-<project>-auth-token` to serialize token
// refreshes across tabs. If a previous tab/HMR-reloaded module dies while
// holding that lock, every subsequent `getSession()`/`getUser()` call in
// the app hangs forever waiting on a ghost holder — with no timeout, no
// error. This SPA doesn't coordinate refreshes across tabs (localStorage
// is the source of truth either way), so we replace the lock with a noop
// that just runs the inner function immediately.
//
// Safe because: (a) the token in localStorage is the canonical record,
// (b) in-tab serialization still happens via supabase-js's internal
// in-memory guards, (c) the worst-case multi-tab collision is two parallel
// refresh attempts — one wins, the other sees a fresh token on retry.
const noopLock = async (_name, _acquireTimeout, fn) => await fn();

// ── "Remember me off" → genuinely non-persistent session ─────────────────────
//
// Bug this fixes: signing in with persistSession:true + storage:localStorage and
// then deleting the token once afterward did NOT work — autoRefreshToken rewrites
// the refreshed token straight back into localStorage, so closing the browser and
// reopening silently logged the user back in.
//
// Fix: ONE client with a custom storage ADAPTER that routes the auth token to
// sessionStorage (cleared on browser/tab close) when "remember me" is off, and
// localStorage otherwise. Because every write — including auto-refresh — goes
// through the adapter, a session-only token never lands in localStorage. The
// choice is recorded in sessionStorage (SESSION_ONLY_FLAG) so it survives in-tab
// reloads but NOT a browser restart, which is exactly the desired scope.
const SESSION_ONLY_FLAG = 'sf_session_only';

const isSessionOnly = () => {
  try { return sessionStorage.getItem(SESSION_ONLY_FLAG) === '1'; } catch { return false; }
};

// supabase-js writes the auth token under `sb-<ref>-auth-token` (and chunked
// `.0/.1/...` variants for large tokens). It only ever calls setItem on save —
// never removeItem on a mode switch — so we must purge the OTHER store's token
// ourselves, or it survives to resurrect the session later.
function purgeAuthTokens(store) {
  try {
    for (let i = store.length - 1; i >= 0; i--) {
      const k = store.key(i);
      if (k && k.startsWith('sb-') && k.includes('-auth-token')) store.removeItem(k);
    }
  } catch { /* ignore */ }
}

/**
 * Call BEFORE sign-in. rememberMe=false routes the session to sessionStorage.
 * CRITICAL: also purge the OTHER store's token. Without this, a returning user
 * who signed in remember-ON (token in localStorage) then signs in remember-OFF
 * leaves the stale localStorage token behind — and after a restart (the
 * sessionStorage flag gone) the adapter reads localStorage and resurrects the
 * session, defeating "remember me off".
 */
export function setSessionPersistence(rememberMe) {
  try {
    if (rememberMe) {
      sessionStorage.removeItem(SESSION_ONLY_FLAG);
      purgeAuthTokens(sessionStorage); // drop any leftover session-only token
    } else {
      sessionStorage.setItem(SESSION_ONLY_FLAG, '1');
      purgeAuthTokens(localStorage);   // the load-bearing half — see above
    }
  } catch { /* storage unavailable — falls back to the localStorage default */ }
}

/**
 * Synchronous check: is there a persisted Supabase auth token in either store
 * (localStorage when "remember me" is on, sessionStorage otherwise)? Lets callers
 * decide "this visitor is definitely logged out" WITHOUT awaiting the async
 * session restore — a returning member always has a token, a fresh visitor never
 * does. Used by the root gate to route logged-out visitors to the landing with no
 * wait, while token-holders wait for validation so they never flash it.
 */
export function hasStoredAuthToken() {
  const has = (store) => {
    try {
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (k && k.startsWith('sb-') && k.includes('-auth-token')) return true;
      }
    } catch { /* storage unavailable */ }
    return false;
  };
  return has(localStorage) || has(sessionStorage);
}

const authStorageAdapter = {
  getItem: (key) => {
    try { return (isSessionOnly() ? sessionStorage : localStorage).getItem(key); }
    catch { return null; }
  },
  setItem: (key, value) => {
    try { (isSessionOnly() ? sessionStorage : localStorage).setItem(key, value); }
    catch { /* ignore */ }
  },
  removeItem: (key) => {
    // Clear from BOTH so a mode switch / sign-out never strands a live token.
    try { localStorage.removeItem(key); } catch { /* ignore */ }
    try { sessionStorage.removeItem(key); } catch { /* ignore */ }
  },
};

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnon, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: authStorageAdapter,
        lock: noopLock,
      },
    })
  : null;

// ── Recovery-flow flag ───────────────────────────────────────────────────────
//
// Supabase fires a single `PASSWORD_RECOVERY` event while detectSessionInUrl
// processes the recovery link's hash. That async parse can complete BEFORE the
// set-new-password page mounts and subscribes, so the event would be missed.
// We register the listener HERE, synchronously after createClient — the earliest
// possible point — and latch the fact in an in-memory module flag the page can
// read on mount.
//
// In-memory only: nothing sensitive is stored, and it never survives a reload —
// so a forged URL or a stale tab cannot resurrect it. Fail-closed lifecycle:
// the flag is cleared on USER_UPDATED (the password was rotated, recovery done)
// and on SIGNED_OUT, so it can never authorize an unrelated later session.
let recoveryFlowActive = false;

/** True once a genuine PASSWORD_RECOVERY event has fired (and not yet consumed). */
export function hasActiveRecoveryFlow() {
  return recoveryFlowActive;
}

/** Clear the recovery flag once the page has consumed it (one-shot, fail-closed). */
export function consumeRecoveryFlow() {
  recoveryFlowActive = false;
}

if (supabase) {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') recoveryFlowActive = true;
    // The flow is over once the password is rotated or the user signs out;
    // never let the flag linger to authorize a later, unrelated session.
    else if (event === 'USER_UPDATED' || event === 'SIGNED_OUT') recoveryFlowActive = false;
  });
}

export { isConfigured };
