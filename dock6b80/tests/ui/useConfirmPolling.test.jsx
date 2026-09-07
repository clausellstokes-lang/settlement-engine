/**
 * @vitest-environment jsdom
 *
 * tests/ui/useConfirmPolling.test.jsx — concurrency lock-in for the post-signup
 * auto-login poll (src/hooks/useConfirmPolling.js).
 *
 * Finding 2's fix: onConfirmed (which drives the deferred security-answer capture
 * + onAuthed) must fire EXACTLY ONCE. authSignIn does two sequential round-trips,
 * so on a slow connection one attempt can outlast the 4s interval; a second attempt
 * then starts, and once the confirm link is clicked BOTH resolve. The old code
 * latched only on a post-await `succeeded` flag, so the sibling attempt also passed
 * its entry guard and fired onConfirmed a SECOND time. The fix serializes attempts
 * (an `inFlight` guard so only one authSignIn is ever awaiting) and latches
 * `cancelled` in the success/error branches before the callback.
 *
 * We mock the store's authSignIn (controllable resolution timing) and isConfigured,
 * drive the 4s interval with fake timers, and assert onConfirmed fires once across a
 * deliberately-overlapping slow sign-in.
 */
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';

afterEach(cleanup);

// isConfigured must be true or the hook no-ops (mock mode has no confirm gate).
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));

// store mock: the selector pulls `authSignIn`; the test swaps `signInImpl` per case.
let signInImpl = () => Promise.resolve();
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector({ authSignIn: (...args) => signInImpl(...args) });
  }
  return { useStore };
});

const { useConfirmPolling } = await import('../../src/hooks/useConfirmPolling.js');

const POLL_MS = 4000;

beforeEach(() => {
  vi.useFakeTimers();
  signInImpl = () => Promise.resolve();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

/** Flush all microtasks queued during the current synchronous frame. */
const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };

describe('useConfirmPolling concurrency latch', () => {
  test('onConfirmed fires EXACTLY ONCE even when a slow sign-in overlaps the interval', async () => {
    // A sign-in that resolves only on a manual trigger — simulating the confirm
    // link being clicked. Every attempt that starts before the click shares this
    // pending promise; when we resolve it, ALL in-flight calls resolve together.
    let resolvePending;
    const pending = new Promise((res) => { resolvePending = res; });
    // First call returns the slow pending promise; with the inFlight guard there
    // should never BE a second concurrent call, but if the guard regressed this
    // would also resolve and double-fire.
    signInImpl = () => pending;

    const onConfirmed = vi.fn();
    renderHook(() =>
      useConfirmPolling({ active: true, email: 'a@x.com', password: 'pw', onConfirmed }),
    );

    // Immediate attempt fires on mount and is now in-flight (awaiting `pending`).
    await flush();
    // Several intervals elapse while the first attempt is still awaiting. Without
    // the inFlight guard each tick would start ANOTHER authSignIn; with it they
    // all short-circuit at the entry guard.
    await vi.advanceTimersByTimeAsync(POLL_MS * 3);

    // The confirm link is clicked: the pending sign-in resolves. Any concurrent
    // sibling (regression) would resolve here too and double-fire onConfirmed.
    resolvePending();
    await flush();
    await vi.advanceTimersByTimeAsync(POLL_MS);
    await flush();

    expect(onConfirmed).toHaveBeenCalledTimes(1);
  });

  test('after success the poll stops — no further sign-in attempts or callbacks', async () => {
    const calls = { n: 0 };
    signInImpl = () => { calls.n += 1; return Promise.resolve(); };
    const onConfirmed = vi.fn();
    renderHook(() =>
      useConfirmPolling({ active: true, email: 'a@x.com', password: 'pw', onConfirmed }),
    );

    await flush(); // immediate attempt resolves -> success, interval cleared
    const callsAtSuccess = calls.n;
    await vi.advanceTimersByTimeAsync(POLL_MS * 5);
    await flush();

    expect(onConfirmed).toHaveBeenCalledTimes(1);
    expect(calls.n).toBe(callsAtSuccess); // no further polling after success
  });

  test('the unconfirmed error keeps polling silently and never fires onConfirmed/onError', async () => {
    // Steady-state "Email not confirmed" — swallowed; the poll keeps trying.
    signInImpl = () => Promise.reject(new Error('Email not confirmed'));
    const onConfirmed = vi.fn();
    const onError = vi.fn();
    renderHook(() =>
      useConfirmPolling({ active: true, email: 'a@x.com', password: 'pw', onConfirmed, onError }),
    );

    await flush();
    await vi.advanceTimersByTimeAsync(POLL_MS * 3);
    await flush();

    expect(onConfirmed).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('a rate-limit (429) keeps polling silently and recovers — never fires onError', async () => {
    // Supabase's auth endpoint pushes back on our 4s cadence with a 429. That is
    // transient backpressure, not a failure: the OLD code treated any non-
    // "unconfirmed" error as terminal, so a single 429 fired onError and stranded
    // the user mid-wait. The fix swallows it and lets the next tick retry — and
    // once the limit clears, the poll still confirms.
    let calls = 0;
    signInImpl = () => {
      calls += 1;
      if (calls <= 2) {
        const err = new Error('Request rate limit reached');
        err.status = 429;
        return Promise.reject(err);
      }
      return Promise.resolve(); // limit cleared → confirmation succeeds
    };
    const onConfirmed = vi.fn();
    const onError = vi.fn();
    renderHook(() =>
      useConfirmPolling({ active: true, email: 'a@x.com', password: 'pw', onConfirmed, onError }),
    );

    await flush();                                // attempt 1 → 429, swallowed
    await vi.advanceTimersByTimeAsync(POLL_MS);    // attempt 2 → 429, swallowed
    await flush();
    expect(onError).not.toHaveBeenCalled();        // the 429 never strands the user
    await vi.advanceTimersByTimeAsync(POLL_MS);    // attempt 3 → success
    await flush();

    expect(onError).not.toHaveBeenCalled();
    expect(onConfirmed).toHaveBeenCalledTimes(1);
  });

  test('a "too many requests" message (no status field) is also swallowed', async () => {
    // Some transports surface the rate limit only as a message string.
    signInImpl = () => Promise.reject(new Error('Too Many Requests'));
    const onConfirmed = vi.fn();
    const onError = vi.fn();
    renderHook(() =>
      useConfirmPolling({ active: true, email: 'a@x.com', password: 'pw', onConfirmed, onError }),
    );

    await flush();
    await vi.advanceTimersByTimeAsync(POLL_MS * 3);
    await flush();

    expect(onError).not.toHaveBeenCalled();
    expect(onConfirmed).not.toHaveBeenCalled();
  });

  test('a real (non-unconfirmed) error fires onError exactly once and stops', async () => {
    signInImpl = () => Promise.reject(new Error('Invalid login credentials'));
    const onError = vi.fn();
    const onConfirmed = vi.fn();
    renderHook(() =>
      useConfirmPolling({ active: true, email: 'a@x.com', password: 'pw', onConfirmed, onError }),
    );

    await flush();
    await vi.advanceTimersByTimeAsync(POLL_MS * 4);
    await flush();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onConfirmed).not.toHaveBeenCalled();
  });
});
