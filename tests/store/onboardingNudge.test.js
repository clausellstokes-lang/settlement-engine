/** @vitest-environment jsdom */
/**
 * onboardingNudge.test.js — the NUDGE CHANNEL contract, and the retirement that
 * cleared the room around it (coach-exit lane, 2026-07-27).
 *
 * WHY THIS FILE EXISTS. src/store/index.js has always ended its post-signup save
 * handler (the F34 SAVE_SETTLEMENT auth intent) by raising a toast:
 *
 *     const setOnboardingNudge = useStore.getState().setOnboardingNudge;
 *     if (typeof setOnboardingNudge === 'function') { setOnboardingNudge(…); }
 *
 * No slice ever defined that action. The typeof guard — written to protect
 * partial-store test harnesses — turned the miss into a SILENT NO-OP, so the
 * "Saved as {name} — view it in Settlements." toast never once appeared in the
 * product, and no test failed. That is the defect class this file exists to make
 * unrepeatable: a guarded call to an action that does not exist. Test (2) is the
 * chokepoint pin — it asserts the action's EXISTENCE, which is precisely what
 * the guard hides.
 *
 * The rest of the slice — the first-run coach state machine and the feature-hints
 * subsystem — was retired in the same lane. Test (3) is a totality pin against a
 * partial revert quietly resurrecting half of it; the full rationale lives in the
 * header of src/store/onboardingSlice.js.
 *
 * @enforced-by this test
 */
import { beforeEach, describe, expect, test } from 'vitest';
import { useStore } from '../../src/store/index.js';

describe('the nudge channel — set and clear round-trip on the REAL store', () => {
  beforeEach(() => {
    useStore.getState().clearOnboardingNudge();
  });

  test('setOnboardingNudge raises the toast; clearOnboardingNudge lowers it', () => {
    useStore.getState().setOnboardingNudge('Saved as Westhollow — view it in Settlements.');
    expect(useStore.getState().onboardingNudge).toBe('Saved as Westhollow — view it in Settlements.');
    useStore.getState().clearOnboardingNudge();
    expect(useStore.getState().onboardingNudge).toBe(null);
  });

  test('a falsy message clears rather than storing an empty toast', () => {
    useStore.getState().setOnboardingNudge('something');
    useStore.getState().setOnboardingNudge('');
    expect(useStore.getState().onboardingNudge).toBe(null);
    useStore.getState().setOnboardingNudge('something');
    useStore.getState().setOnboardingNudge(undefined);
    expect(useStore.getState().onboardingNudge).toBe(null);
  });

  test('THE CHOKEPOINT PIN — setOnboardingNudge is a function on the composed store', () => {
    // The silent-no-op class cannot recur: index.js's typeof guard can only be a
    // harness shim if the real store satisfies it.
    expect(typeof useStore.getState().setOnboardingNudge).toBe('function');
  });
});

describe('the coach retirement is TOTAL (no partial-revert resurrection)', () => {
  test('every retired coach / hints member is absent from the store', () => {
    const s = useStore.getState();
    const survivors = [
      'onboardingActive',
      'onboardingStep',
      'onboardingTabsExplored',
      'featuresUsed',
      'initOnboarding',
      'advanceOnboarding',
      'setOnboardingStep',
      'trackTabExplored',
      'completeOnboarding',
      'markFeatureUsed',
      'shouldShowHint',
      'resetOnboarding',
    ].filter((k) => s[k] !== undefined);
    // Re-adding any of these means the headless coach or the zero-consumer hints
    // map is back. The forward path for a NON-derivable teaching milestone is a
    // device-local marker in the sf:guidance:* lane (src/lib/guidance.js), not
    // this slice — see src/domain/display/guidanceRegistry.js#deriveGuidanceFirst.
    expect(survivors, `\nRetired onboarding members that came back:\n  ${survivors.join('\n  ')}\n`).toEqual([]);
  });
});

describe('the nudge is SESSION-ONLY (lifecycle: persist)', () => {
  test('a raised nudge never reaches the persisted blob', () => {
    useStore.getState().setOnboardingNudge('Saved as Westhollow — view it in Settlements.');
    const raw = localStorage.getItem('settlementforge');
    expect(raw, 'the zustand persist blob should exist under the "settlementforge" key').toBeTruthy();
    const persisted = JSON.parse(raw);
    expect(Object.keys(persisted.state)).not.toContain('onboardingNudge');
    expect(raw).not.toContain('Westhollow');
    useStore.getState().clearOnboardingNudge();
  });
});
