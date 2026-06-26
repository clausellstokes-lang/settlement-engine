/**
 * hooks/useConfirmPolling.js — the post-signup auto-login poll.
 *
 * After an email/password sign-up with email confirmation enabled, Supabase
 * returns a user but NO session: the account is locked until the confirmation
 * link is clicked. Rather than make the user come back and sign in by hand, the
 * original signup window holds the just-entered password in memory and POLLS
 * signInWithPassword every few seconds. While unconfirmed, Supabase errors
 * "Email not confirmed" (swallowed silently); once the link is clicked anywhere
 * (this device or another), the next poll succeeds → a session exists → we run
 * the caller's onConfirmed (which establishes auth + fires the deferred
 * security-answer capture).
 *
 * The poll is BOUNDED: it stops on the first success, after a max duration
 * (~5 min), or on unmount. It only runs while `active` is true (the parent
 * gates it on the "check your inbox" verify state), and it no-ops entirely when
 * Supabase isn't configured (local/mock mode has no real confirmation step).
 *
 * Security: the password lives only in the calling component's state for the
 * lifetime of this screen; it is never logged, persisted, or sent anywhere but
 * Supabase's own signInWithPassword. The "email not confirmed" error is the
 * expected steady state and is intentionally swallowed; a rate-limit (429 /
 * "too many requests") is treated the same way — it is transient and self-heals
 * on the next tick — so neither aborts the wait. Every OTHER error is surfaced
 * via onError so a genuinely wrong password or a network fault isn't hidden
 * behind a silent forever-poll.
 */
import { useEffect, useRef } from 'react';
import { useStore } from '../store/index.js';
import { isConfigured } from '../lib/supabase.js';

// Tuneables. 4s cadence is brisk enough to feel near-instant after a click
// without hammering the auth endpoint; 5 min is a generous ceiling for a person
// switching to their inbox and back.
const POLL_INTERVAL_MS = 4000;
const MAX_DURATION_MS = 5 * 60 * 1000;

// Errors that are NOT a reason to stop waiting. Supabase's pending-confirmation
// error is the expected steady state; a rate-limit (429 / "too many requests")
// is transient — the auth endpoint is briefly pushing back on our cadence, and
// the next tick recovers — so we swallow it and keep polling rather than
// stranding the user on a false failure. Everything else still surfaces.
function isUnconfirmedError(err) {
  const msg = String(err?.message || '').toLowerCase();
  return msg.includes('not confirmed') || msg.includes('email not confirmed');
}

function isRateLimitError(err) {
  if (err?.status === 429 || err?.code === 429 || err?.statusCode === 429) return true;
  const msg = String(err?.message || '').toLowerCase();
  return msg.includes('too many requests') || msg.includes('rate limit') || msg.includes('429');
}

/**
 * @param {{
 *   active: boolean,                 // run only while the "check inbox" screen shows
 *   email: string,
 *   password: string,
 *   onConfirmed: () => void,         // fired once, after the first successful sign-in
 *   onTimeout?: () => void,          // fired once if the max duration elapses first
 *   onError?: (err: Error) => void,  // non-"unconfirmed" failures (wrong pw, network)
 * }} params
 */
export function useConfirmPolling({ active, email, password, onConfirmed, onTimeout, onError }) {
  const authSignIn = useStore(s => s.authSignIn);

  // Latch the callbacks in refs so the interval effect doesn't re-arm every
  // render when the parent passes fresh closures. Assigned in an effect (not in
  // render) so the poll always calls the latest handler without re-triggering.
  const onConfirmedRef = useRef(onConfirmed);
  const onTimeoutRef = useRef(onTimeout);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onConfirmedRef.current = onConfirmed;
    onTimeoutRef.current = onTimeout;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    // Gate: only poll on the live screen, with credentials, against a real
    // backend. Mock mode has no confirmation gate, so there is nothing to wait
    // for — the parent's normal signup path already established the session.
    if (!active || !isConfigured || !email || !password) return undefined;

    // `cancelled` is the monotonic latch that retires the poll for good (success,
    // error, timeout, or unmount); once set, every guarded path short-circuits and
    // no terminal callback can fire twice. `inFlight` serializes attempts so only
    // ONE authSignIn is ever awaiting — without it, a slow sign-in (two sequential
    // round-trips) outlasts the interval, a second attempt starts, and BOTH resolve
    // after the confirm click, double-firing onConfirmed (and the deferred
    // security-answer capture + onAuthed it drives).
    let cancelled = false;
    let inFlight = false;
    const startedAt = Date.now();

    const attempt = async () => {
      if (cancelled || inFlight) return;
      if (Date.now() - startedAt > MAX_DURATION_MS) {
        cancelled = true;
        clearInterval(timer);
        onTimeoutRef.current?.();
        return;
      }
      inFlight = true;
      try {
        await authSignIn(email, password);
        // Re-check the latch AFTER the await: a sibling attempt or an unmount may
        // have retired the poll while this sign-in was resolving. Setting
        // `cancelled` here (not a separate `succeeded` flag) means any concurrent
        // attempt that slips past the entry guard still short-circuits on its own
        // post-await check, so onConfirmed fires exactly once.
        if (cancelled) return;
        cancelled = true;
        clearInterval(timer);
        onConfirmedRef.current?.();
      } catch (err) {
        // The expected "still waiting" state — keep polling silently. A
        // rate-limit is transient backpressure, not a failure; swallow it too
        // and let the next tick retry rather than aborting the wait.
        if (isUnconfirmedError(err) || isRateLimitError(err)) return;
        // A real failure (wrong password, network). Stop and report; a silent
        // forever-poll on a genuine error would strand the user. Latch first so a
        // sibling attempt can't also report.
        if (cancelled) return;
        cancelled = true;
        clearInterval(timer);
        onErrorRef.current?.(err);
      } finally {
        inFlight = false;
      }
    };

    const timer = setInterval(attempt, POLL_INTERVAL_MS);
    // Fire one immediate attempt so a link already clicked before this mounts
    // resolves without waiting a full interval.
    attempt();

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [active, email, password, authSignIn]);
}
