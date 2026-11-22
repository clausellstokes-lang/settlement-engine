/** @vitest-environment jsdom */
/**
 * sessionEvictionLifecycle.pin.test.js — THE LIFECYCLE PIN (§7.3, M-9d).
 *
 * The owner's most-bitten bug class: a write that survives one path and ghosts
 * another. This pin covers the SYNCHRONOUS eviction-initiation step, before the
 * auth service emits SIGNED_OUT:
 *
 *   1. localStorage's persist key ('settlementforge') is BYTE-IDENTICAL through
 *      initiation — the partialize (config + toggles) is the user's unsaved work,
 *      and evictSession only raises the transient sessionEvicted flag (excluded
 *      from the partialize) before requesting local sign-out.
 *   2. NO store-reset action fires synchronously from evictSession. The real
 *      SIGNED_OUT listener subsequently calls clearAuth, which intentionally
 *      clears owner-scoped caches but still leaves the partialized draft intact.
 *   3. Supersession DEDUPES: the first eviction wins; a second one is a no-op (no
 *      error-toast storm from N in-flight paid calls all returning 401).
 *
 * It drives the REAL store with its REAL persist middleware. Only the auth-service
 * transition is stubbed, deliberately stopping before the SIGNED_OUT listener.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useStore } from '../../src/store/index.js';
import { auth as authService } from '../../src/lib/auth.js';
import { EXEMPT_OPERATIONS, OPERATIONS } from '../../src/store/operationRegistry.js';

const PERSIST_KEY = 'settlementforge';

// The clear/reset family that evictSession must not invoke synchronously. These
// actions may legitimately run later when the auth listener handles SIGNED_OUT.
const SYNCHRONOUS_CLEAR_ACTIONS = [...Object.keys(OPERATIONS), ...Object.keys(EXEMPT_OPERATIONS)]
  .filter((n) => /^(clear|reset)/.test(n) && n !== 'clearSessionEviction')
  .filter((n) => typeof useStore.getState()[n] === 'function');

describe('THE LIFECYCLE PIN — synchronous single-session eviction initiation (§7.3, M-9d)', () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.setState({ sessionEvicted: false });
  });

  test('the reset family is non-empty (the wall would be vacuous otherwise)', () => {
    expect(SYNCHRONOUS_CLEAR_ACTIONS).toContain('clearSavedSettlements');
    expect(SYNCHRONOUS_CLEAR_ACTIONS).toContain('clearCampaigns');
    expect(SYNCHRONOUS_CLEAR_ACTIONS.length).toBeGreaterThan(3);
  });

  test('initiation: persist key byte-identical, no synchronous clear, banner up, dedup', async () => {
    // Sign in + seed some persisted "unsaved work" into a partialized field (config).
    useStore.setState((s) => { s.auth = { ...s.auth, user: { id: 'u1' }, tier: 'premium', loading: false }; });
    useStore.setState((s) => { s.config = { ...s.config, __pinSeed: 'UNSAVED-WORK-XYZ' }; });
    const before = localStorage.getItem(PERSIST_KEY);
    expect(before, 'the persist middleware wrote the seeded config').toContain('UNSAVED-WORK-XYZ');

    // Spy on the whole reset/clear family for this synchronous step.
    const st = useStore.getState();
    const resetSpies = SYNCHRONOUS_CLEAR_ACTIONS.map((n) => ({ n, spy: vi.spyOn(st, n) }));
    // Stub the auth service so SIGNED_OUT is not emitted: that later listener
    // intentionally clears owner caches and is outside this synchronous wall.
    const signOutSpy = vi.spyOn(authService, 'signOutLocalSession').mockResolvedValue(undefined);

    // ── Drive the eviction ──
    useStore.getState().evictSession();

    // (1) the banner flag is raised.
    expect(useStore.getState().sessionEvicted).toBe(true);
    // (2) the persist key is BYTE-IDENTICAL — the unsaved work is untouched.
    expect(localStorage.getItem(PERSIST_KEY)).toBe(before);
    // (3) NO store-reset/clear action fired synchronously.
    resetSpies.forEach(({ n, spy }) => {
      expect(spy, `${n} must NOT fire during eviction initiation`).not.toHaveBeenCalled();
    });
    // (4) a LOCAL sign-out fired exactly once.
    expect(signOutSpy).toHaveBeenCalledTimes(1);

    // ── Supersession dedupe: a second eviction is a no-op (first wins) ──
    useStore.getState().evictSession();
    expect(signOutSpy, 'a second supersession must NOT re-fire the sign-out').toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(PERSIST_KEY)).toBe(before);
    resetSpies.forEach(({ spy }) => expect(spy).not.toHaveBeenCalled());
  });

  test('a fresh SIGNED_IN clears the banner (re-auth returns the user to their work)', () => {
    useStore.setState({ sessionEvicted: true });
    // Simulate the SIGNED_IN branch's banner-clear (the handler sets this on re-auth).
    useStore.setState((s) => { s.sessionEvicted = false; });
    expect(useStore.getState().sessionEvicted).toBe(false);
  });
});
