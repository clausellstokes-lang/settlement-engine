/**
 * onboardingSlice — the SESSION NUDGE-TOAST channel (and nothing else).
 *
 * WHAT THIS IS NOW. One transient string plus its setter and its clearer. A
 * writer puts a short sentence here; App.jsx renders it as the single gold
 * toast at the bottom of the shell and clears it on click, on Enter/Space, or
 * after 8s. Its live writer is the post-signup save handler
 * (src/store/index.js, the F34 SAVE_SETTLEMENT auth intent): "Saved as {name} —
 * view it in Settlements." Nothing here is persisted — the field is absent from
 * the Zustand partialize by design, so the toast dies with the session.
 *
 * THE 2026-07-27 RETIREMENT (coach-exit lane). This slice used to also carry a
 * first-run COACH state machine (onboardingActive / onboardingStep /
 * onboardingTabsExplored / initOnboarding / advanceOnboarding /
 * setOnboardingStep / trackTabExplored / completeOnboarding / resetOnboarding)
 * and a feature-HINTS subsystem (featuresUsed / markFeatureUsed /
 * shouldShowHint). Both were retired whole. The coach was headless: its only
 * render was two `data-onboard-highlight` attributes in GenerateWizard, and no
 * CSS rule anywhere targeted that attribute — so it could never be seen, and
 * because nothing ever called completeOnboarding it also never ended. The
 * hints subsystem had zero consumers: the live first-run teaching moved to the
 * GUIDANCE REGISTRY (W-GUIDE-1 / host C4 — the PostGenCoach whisper host with
 * real exit paths through the unified sf:guidance:* dismissals, plus
 * FirstDossierCallouts, whose firsts are DERIVED by deriveGuidanceFirst rather
 * than flagged). Wiring the coach instead of retiring it would have stood a
 * second teaching system up beside the registry, against the one-guidance-
 * system consolidation (single whisper budget, unified dismissals, newborn
 * gating). See src/domain/display/guidanceRegistry.js for the forward path.
 *
 * ABANDONED LOCALSTORAGE RESIDUE — DELIBERATELY NOT MIGRATED.
 *   sf_onboarded      — written only by completeOnboarding, which had no
 *                       callers, so no browser legitimately holds it.
 *   sf_features_used  — written only by markFeatureUsed, likewise callerless.
 * Neither key is a dismissal source for any whisper, so NO
 * LEGACY_DISMISSAL_MIGRATIONS entry is owed in src/lib/guidance.js and none was
 * added: mapping either key onto a whisper dismissal would be semantically
 * wrong — a present key is not evidence the user was ever taught anything, and
 * the migration would silently suppress teaching they have not seen. The keys
 * are inert residue; the only reader of either is gone.
 *
 * FIRST-PAINT NOTE. `featuresUsed: loadFeaturesUsed()` was an EAGER
 * localStorage read executed at store-creation time on every boot. It is gone
 * with the hints subsystem — the slice now touches no browser storage at all.
 */

export const createOnboardingSlice = (set) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  /** Transient nudge toast text, or null. Session-only; never persisted. */
  onboardingNudge: null,

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Raise the nudge toast. Falsy input clears it, so a caller never has to
   * branch between "show this" and "show nothing".
   * @param {string|null|undefined} message
   */
  setOnboardingNudge: (message) =>
    set(state => { state.onboardingNudge = message || null; }),

  /** Clear the nudge toast. */
  clearOnboardingNudge: () =>
    set(state => { state.onboardingNudge = null; }),
});
