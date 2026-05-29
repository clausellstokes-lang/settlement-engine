/**
 * uiSlice — ephemeral, non-persisted UI preferences.
 *
 * A small key→value bag for transient view state that several components
 * need to share but that we deliberately do NOT persist. Like wizardStep,
 * the user should land in a clean default on every visit rather than be
 * dumped back into whatever overlay they happened to leave open.
 *
 * Keys in use:
 *   tableViewOpen — P142 / D-6. When true, the phone-optimized Table View
 *                   overlay is shown over the dossier. Set true by the
 *                   "Open in Table View" button in SummaryTabV2 (routed via
 *                   OutputContainer) and back to false by the close
 *                   affordance inside TableView.
 *
 * The generic setUserPref(key, value) shape matches the call site the
 * Summary tab already speaks — `setUserPref('tableViewOpen', true)` — and
 * gives future transient prefs a home without minting a new slice each time.
 *
 * NOTE: intentionally left out of the persist `partialize` in store/index.js
 * so none of these prefs survive a reload.
 */

export const createUiSlice = (set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  userPrefs: {
    tableViewOpen: false,
  },

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Set a transient UI preference by key. */
  setUserPref: (key, value) =>
    set(state => {
      if (!state.userPrefs) state.userPrefs = {};
      state.userPrefs[key] = value;
    }),

  /**
   * Read a transient UI preference imperatively. Components rendering
   * reactively should prefer a selector (`useStore(s => s.userPrefs.foo)`)
   * so they re-render on change; this helper is for one-shot reads.
   */
  getUserPref: (key) => get().userPrefs?.[key],
});
