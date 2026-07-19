/**
 * lib/sessionClient.js — the single-session CLIENT (§7.3, M-9d): claim + validation.
 *
 * Kept ENTIRELY OFF the first-paint closure (LAW 4). authSlice's eager code holds only
 * the transient sessionEvicted flag + a thin evictSession (the synchronous dedupe guard
 * that a lazy trampoline could not provide); everything else — the claim on sign-in and
 * the focus/visibility/interval validation loop — lives here and is loaded via dynamic
 * import. This imports authSecurity DIRECTLY (both are lazy chunks), so no eager auth.js
 * wrapper is needed for claim/is-current.
 */
import { claimCurrentSession, isCurrentSession } from './authSecurity.js';

/** Claim this account to THE CURRENT session (last-login-wins, §7.1). Never throws. */
export async function claimSession() {
  try { await claimCurrentSession(); } catch { /* never block auth on a claim failure */ }
}

/**
 * Start the validation loop: revalidate on window focus / tab-visible + every 5 minutes;
 * a DEFINITIVE is_current_session()===false evicts. Lenient on error (the paid-surface
 * request gate is the authoritative enforcement). Returns a teardown.
 * @param {() => any} get the store's get() (reads auth + drives evictSession)
 * @returns {() => void} teardown
 */
export function startValidation(get) {
  if (typeof window === 'undefined') return () => {};

  const validate = async () => {
    const st = get();
    if (!st.auth?.user?.id || st.sessionEvicted) return;
    try {
      const ok = await isCurrentSession();
      if (ok === false) get().evictSession();
    } catch { /* lenient — the request gate enforces */ }
  };

  const onFocus = () => { void validate(); };
  const onVisible = () => { if (typeof document !== 'undefined' && document.visibilityState === 'visible') void validate(); };
  window.addEventListener('focus', onFocus);
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisible);
  const interval = setInterval(() => { void validate(); }, 5 * 60 * 1000);

  return () => {
    window.removeEventListener('focus', onFocus);
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisible);
    clearInterval(interval);
  };
}
