/**
 * onboardingSlice — First-run coaching + progressive feature discovery.
 *
 * Tracks whether the user has completed initial onboarding and which
 * features they've already discovered. Onboarding is NOT a separate
 * tutorial layer — it's a coaching overlay on the real Quick Generate
 * flow. The user's first settlement IS the onboarding.
 *
 * Persistence:
 *   sf_onboarded        — 'true' after first completed generation
 *   sf_features_used    — JSON map of feature keys → boolean
 */

const ONBOARDED_KEY = 'sf_onboarded';
const FEATURES_KEY = 'sf_features_used';

const DEFAULT_FEATURES = {
  saved: false,
  edited: false,
  linked: false,
  aiNarrative: false,
  campaign: false,
  customContent: false,
  exported: false,
};

function loadFeaturesUsed() {
  try {
    const raw = localStorage.getItem(FEATURES_KEY);
    if (!raw) return { ...DEFAULT_FEATURES };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_FEATURES, ...parsed };
  } catch {
    return { ...DEFAULT_FEATURES };
  }
}

function saveFeaturesUsed(features) {
  try {
    localStorage.setItem(FEATURES_KEY, JSON.stringify(features));
  } catch {
    /* ignore quota errors */
  }
}

export const createOnboardingSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  /** true = user is currently inside the first-run coach flow */
  onboardingActive: false,
  /** 0 = welcome, 1 = tier selected, 2 = generated, 3 = explored tabs, 4 = done */
  onboardingStep: 0,
  /** Count of tabs the user has clicked during post-generation exploration */
  onboardingTabsExplored: 0,
  /** Features the user has already used — hints won't re-show */
  featuresUsed: loadFeaturesUsed(),
  /** Post-onboarding nudge toast */
  onboardingNudge: null,

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Check localStorage on app mount. If the user has never completed
   * onboarding, activate the coach flow.
   */
  initOnboarding: () => {
    try {
      const onboarded = localStorage.getItem(ONBOARDED_KEY) === 'true';
      set(state => {
        state.onboardingActive = !onboarded;
        state.onboardingStep = 0;
        state.onboardingTabsExplored = 0;
      });
    } catch {
      /* localStorage blocked — treat as already-onboarded to avoid showing coach */
      set(state => { state.onboardingActive = false; });
    }
  },

  /** Advance to the next onboarding step. No-op if onboarding is inactive. */
  advanceOnboarding: () =>
    set(state => {
      if (!state.onboardingActive) return;
      state.onboardingStep = Math.min(4, state.onboardingStep + 1);
    }),

  /** Jump to a specific step. */
  setOnboardingStep: (step) =>
    set(state => {
      if (!state.onboardingActive) return;
      state.onboardingStep = step;
    }),

  /** Record that the user explored a tab during post-generation. */
  trackTabExplored: () =>
    set(state => {
      if (!state.onboardingActive) return;
      state.onboardingTabsExplored += 1;
      // Auto-advance from "generated" to "explored" after 2 tab clicks
      if (state.onboardingStep === 2 && state.onboardingTabsExplored >= 2) {
        state.onboardingStep = 3;
      }
    }),

  /**
   * Dismiss the coach and mark onboarding complete. Also queues a
   * post-onboarding nudge toast with tips for what to explore next.
   */
  completeOnboarding: () => {
    try {
      localStorage.setItem(ONBOARDED_KEY, 'true');
    } catch { /* ignore */ }
    const authTier = get().auth?.tier || 'anon';
    const nudge = authTier === 'anon'
      ? 'Nice work! Sign in to save settlements to your library, or visit the Compendium to explore all available institutions.'
      : 'Nice work! Save this to your library, visit the Compendium to explore all institutions, or try the Advanced mode for full control.';
    set(state => {
      state.onboardingActive = false;
      state.onboardingStep = 4;
      state.onboardingNudge = nudge;
    });
  },

  /** Clear the post-onboarding nudge toast. */
  clearOnboardingNudge: () =>
    set(state => { state.onboardingNudge = null; }),

  /**
   * Mark a feature as used. Feature hints will not re-show after this.
   * @param {string} key — one of: saved, edited, linked, aiNarrative, campaign, customContent, exported
   */
  markFeatureUsed: (key) => {
    const current = get().featuresUsed || {};
    if (current[key]) return;
    const next = { ...current, [key]: true };
    saveFeaturesUsed(next);
    set(state => { state.featuresUsed = next; });
  },

  /** Check if a feature hint should be shown. */
  shouldShowHint: (key) => {
    const features = get().featuresUsed || {};
    return !features[key];
  },

  /** Reset all onboarding state — used for testing / "show tour again" buttons. */
  resetOnboarding: () => {
    try {
      localStorage.removeItem(ONBOARDED_KEY);
      localStorage.removeItem(FEATURES_KEY);
    } catch { /* ignore */ }
    set(state => {
      state.onboardingActive = true;
      state.onboardingStep = 0;
      state.onboardingTabsExplored = 0;
      state.featuresUsed = { ...DEFAULT_FEATURES };
      state.onboardingNudge = null;
    });
  },
});
