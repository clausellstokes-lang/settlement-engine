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

  // Quiet confirmation for a same-device dossier retro auto-upgrade (108). Set
  // by the silent post-save claim when a durable right attaches to a just-saved
  // settlement; the App renders it as one transient toast and clears it. Null =
  // nothing to show. Transient (deliberately left out of the persist partialize).
  dossierClaimToast: null,

  // The dossier entity a hyperlink last navigated to ({ id, ts } | null). Lives
  // on the store (not a card-local prop) because the target must survive the
  // cross-tab remount: clicking an NPC's faction switches to the Power tab, which
  // mounts fresh and reads this to know which faction to open. The `ts` stamp
  // makes a repeat click of the same link re-fire the open-the-card effect.
  // Transient (out of the persist partialize) so a reload lands unfocused.
  focusedEntity: null,

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Set (or clear, with null) the dossier retro-claim confirmation toast. */
  setDossierClaimToast: (message) =>
    set(state => { state.dossierClaimToast = message || null; }),

  /**
   * Mark a dossier entity as the navigation target (a hyperlink click). Stamps a
   * fresh `ts` so the per-tab open-the-card effects re-fire on a repeat click of
   * the same link.
   * @param {string} id  Stable entity id (e.g. 'faction.iron_guild', 'npc_3').
   */
  focusEntity: (id) =>
    set(state => {
      if (!id) return;
      state.focusedEntity = { id, ts: Date.now() };
    }),

  /** Clear the focused entity (e.g. on dossier teardown). */
  clearFocusedEntity: () =>
    set(state => { state.focusedEntity = null; }),

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
