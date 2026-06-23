/**
 * uiSlice — ephemeral, non-persisted UI preferences.
 *
 * A small key→value bag for transient view state that several components
 * need to share but that we deliberately do NOT persist. Like wizardStep,
 * the user should land in a clean default on every visit rather than be
 * dumped back into whatever overlay they happened to leave open.
 *
 * Keys in use:
 *   tableViewOpen — when true, the phone-optimized Table View
 *                   overlay is shown over the dossier. Set true by the
 *                   "Open in Table View" button in SummaryTabV2 (routed via
 *                   OutputContainer) and back to false by the close
 *                   affordance inside TableView.
 *   detailLevel   — the reading-depth "altitude" axis ('guided' | 'standard' |
 *                   'expert' ↔ Overview / Detail / Engine) the dossier engine
 *                   sections (EngineSections, WarFaithSection) read to decide how
 *                   much depth to show. Defaults to 'standard'. The global dossier
 *                   toggle was removed; the Substrate tab now owns a local control.
 *                   IS persisted (returning power users keep their depth) — see the
 *                   `userPrefs.detailLevel` line in store/index.js partialize.
 *
 * The generic setUserPref(key, value) shape matches the call site the
 * Summary tab already speaks — `setUserPref('tableViewOpen', true)` — and
 * gives future transient prefs a home without minting a new slice each time.
 *
 * NOTE: the transient keys here are intentionally left out of the persist
 * `partialize` in store/index.js so they do not survive a reload; `detailLevel`
 * is the deliberate exception (explicitly persisted there).
 */

/** The valid altitude rungs, in ascending depth. Frozen so callers can validate. */
export const DETAIL_LEVELS = Object.freeze(['guided', 'standard', 'expert']);

/**
 * The default reading depth for the dossier's engine sections (EngineSections,
 * WarFaithSection). 'standard' shows band readouts + scores by default. It
 * replaced 'guided' when the global dossier "Detail" toggle was removed, so the
 * engine depth those sections used to gate now surfaces without a toggle. The
 * Substrate tab carries its own LOCAL Overview/Detail/Engine control.
 */
export const DEFAULT_DETAIL_LEVEL = 'standard';

/**
 * Durable, user-owned product preferences surfaced on the Account page
 * ("Product Preferences" section). UNLIKE the transient userPrefs keys these
 * ARE persisted (see store/index.js partialize/merge) so a returning user keeps
 * their defaults. Each key is a default the relevant surface reads when it has
 * no per-artifact override:
 *
 *   playerViewDefault     — whether new settlements default to player-safe view.
 *   pdfStyle              — preferred PDF/export visual style ('classic'|'compact'|'parchment').
 *   aiPolishDefault       — opt-in default for AI prose polish on generation.
 *   galleryPublicDefault  — whether shares default to public gallery visibility.
 *   shareDefault          — default share scope for new player-view links.
 *   campaignMapAutosave   — auto-save map edits while running a campaign.
 *   emailNotifications    — product/lifecycle email opt-in (mirrors the profile flag).
 */
export const PRODUCT_PREF_DEFAULTS = Object.freeze({
  playerViewDefault: false,
  pdfStyle: 'classic',
  aiPolishDefault: false,
  galleryPublicDefault: false,
  shareDefault: 'unlisted',
  campaignMapAutosave: true,
  emailNotifications: true,
});

export const createUiSlice = (set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  userPrefs: {
    tableViewOpen: false,
    detailLevel: DEFAULT_DETAIL_LEVEL,
  },

  // Auth modal visibility. Lifted out of App.jsx local state so app-wide
  // surfaces that have no prop path to App (PricingMomentCard's signup
  // moments, future nudges) can open sign-in directly — mirroring how
  // purchaseModalOpen already lives on the store. Transient: deliberately
  // left out of the persist partialize so a reload lands on a closed modal.
  authModalOpen: false,

  /** Durable product-preference defaults (Account → Product Preferences). */
  productPrefs: { ...PRODUCT_PREF_DEFAULTS },

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Set a single durable product preference. Unknown keys are ignored so a
   * stale persisted/UI value can't introduce a bogus pref. Persisted via the
   * store-index partialize.
   * @param {keyof typeof PRODUCT_PREF_DEFAULTS} key
   * @param {*} value
   */
  setProductPref: (key, value) =>
    set(state => {
      if (!Object.prototype.hasOwnProperty.call(PRODUCT_PREF_DEFAULTS, key)) return;
      if (!state.productPrefs) state.productPrefs = { ...PRODUCT_PREF_DEFAULTS };
      state.productPrefs[key] = value;
    }),

  /** Read a product preference, falling back to its default. */
  getProductPref: (key) => {
    const prefs = get().productPrefs || {};
    return Object.prototype.hasOwnProperty.call(prefs, key) ? prefs[key] : PRODUCT_PREF_DEFAULTS[key];
  },

  /** Open/close the auth (sign-in / create-account) modal. */
  setAuthModalOpen: (open) =>
    set(state => { state.authModalOpen = !!open; }),

  /** Set a transient UI preference by key. */
  setUserPref: (key, value) =>
    set(state => {
      if (!state.userPrefs) state.userPrefs = {};
      state.userPrefs[key] = value;
    }),

  /**
   * Set the progressive-disclosure altitude ('guided' | 'standard' | 'expert').
   * Ignores anything outside DETAIL_LEVELS so a bad value can't wedge the UI.
   * @param {'guided'|'standard'|'expert'} level
   */
  setDetailLevel: (level) =>
    set(state => {
      if (!DETAIL_LEVELS.includes(level)) return;
      if (!state.userPrefs) state.userPrefs = {};
      state.userPrefs.detailLevel = level;
    }),

  /**
   * Read a transient UI preference imperatively. Components rendering
   * reactively should prefer a selector (`useStore(s => s.userPrefs.foo)`)
   * so they re-render on change; this helper is for one-shot reads.
   */
  getUserPref: (key) => get().userPrefs?.[key],
});
