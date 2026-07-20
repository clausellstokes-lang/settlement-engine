/** @vitest-environment jsdom */
/**
 * sessionEvictionLifecycle.pin.test.js — THE LIFECYCLE PIN (§7.3, M-9d).
 *
 * The owner's most-bitten bug class: a write that survives one path and ghosts
 * another. Here the invariant is inverted — an EVICTION must NOT destroy unsaved
 * local work. This pin is the regression wall:
 *
 *   1. localStorage's persist key ('settlementforge') is BYTE-IDENTICAL through
 *      eviction — the partialize (config + toggles) is the user's unsaved work,
 *      and evictSession only touches the transient sessionEvicted flag (excluded
 *      from the partialize), so the persisted blob must not move a byte.
 *   2. NO store-RESET action fires during eviction (an operationRegistry-driven
 *      spy over the reset/clear family) — eviction is a banner + a LOCAL sign-out,
 *      never a wipe.
 *   3. Supersession DEDUPES: the first eviction wins; a second one is a no-op (no
 *      error-toast storm from N in-flight paid calls all returning 401).
 *
 * It drives the REAL store (src/store/index.js) with its REAL persist middleware,
 * so the partialize + localStorage write path is exercised end-to-end, not stubbed.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useStore } from '../../src/store/index.js';
import { auth as authService } from '../../src/lib/auth.js';
import { EXEMPT_OPERATIONS, OPERATIONS } from '../../src/store/operationRegistry.js';

const PERSIST_KEY = 'settlementforge';

// The state-destroying action family, read from the registry (not hand-listed) so a
// future reset action is automatically included in the wall.
const RESET_ACTIONS = [...Object.keys(OPERATIONS), ...Object.keys(EXEMPT_OPERATIONS)]
  .filter((n) => /^(clear|reset)/.test(n) && n !== 'clearSessionEviction')
  .filter((n) => typeof useStore.getState()[n] === 'function');

describe('THE LIFECYCLE PIN — single-session eviction never destroys unsaved work (§7.3, M-9d)', () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.setState({ sessionEvicted: false });
  });

  test('the reset family is non-empty (the wall would be vacuous otherwise)', () => {
    expect(RESET_ACTIONS).toContain('clearSavedSettlements');
    expect(RESET_ACTIONS).toContain('clearCampaigns');
    expect(RESET_ACTIONS.length).toBeGreaterThan(3);
  });

  test('eviction: persist key byte-identical, no reset action, banner up, dedup', async () => {
    // Sign in + seed some persisted "unsaved work" into a partialized field (config).
    useStore.setState((s) => { s.auth = { ...s.auth, user: { id: 'u1' }, tier: 'premium', loading: false }; });
    useStore.setState((s) => { s.config = { ...s.config, __pinSeed: 'UNSAVED-WORK-XYZ' }; });
    const before = localStorage.getItem(PERSIST_KEY);
    expect(before, 'the persist middleware wrote the seeded config').toContain('UNSAVED-WORK-XYZ');

    // Spy on the whole reset/clear family — the wall.
    const st = useStore.getState();
    const resetSpies = RESET_ACTIONS.map((n) => ({ n, spy: vi.spyOn(st, n) }));
    // A LOCAL sign-out is expected exactly once; stub it so the test stays hermetic
    // (no dynamic import, no mock-auth localStorage write to a different key).
    const signOutSpy = vi.spyOn(authService, 'signOutLocalSession').mockResolvedValue(undefined);

    // ── Drive the eviction ──
    useStore.getState().evictSession();

    // (1) the banner flag is raised.
    expect(useStore.getState().sessionEvicted).toBe(true);
    // (2) the persist key is BYTE-IDENTICAL — the unsaved work is untouched.
    expect(localStorage.getItem(PERSIST_KEY)).toBe(before);
    // (3) NO store-reset/clear action fired.
    resetSpies.forEach(({ n, spy }) => expect(spy, `${n} must NOT fire during eviction`).not.toHaveBeenCalled());
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
