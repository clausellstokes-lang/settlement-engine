/**
 * displayPrefsSlice — PERSISTED, device-scoped display preferences.
 *
 * The counterpart to uiSlice, and its exact opposite on the one axis that
 * matters: uiSlice is the bag that must NEVER survive a reload (overlay flags,
 * modal visibility, the transient focus target), and this is the bag that must
 * ALWAYS survive one. Keeping them in separate slices is the point — a single
 * bag whose keys split into "persisted" and "not persisted" halves is how a
 * write ends up surviving one path and ghosting another.
 *
 * WHAT BELONGS HERE: a preference about the MACHINE the user is sitting at, not
 * about any settlement or world. Nothing here is generator input: no domain
 * module reads this slice, and it is deliberately absent from `config` (which
 * IS generator input and would move seeds).
 *
 * Keys in use:
 *   sceneQualityMode — the 3D settlement portrait's rendering-quality CEILING.
 *     The vocabulary ('auto' | 'high' | 'medium' | 'low') is owned by
 *     lib/townScene/adaptiveQuality.js OVERRIDE_MODES and deliberately NOT
 *     re-spelled here: that module is lazy portrait-lane code and this slice is
 *     eager, so importing it would drag renderer bytes into the first-paint
 *     closure. The store therefore holds an opaque string and the one consumer
 *     (SettlementScene3D) clamps to its own frozen vocabulary on read — an
 *     unknown or corrupt persisted value renders as 'auto' rather than throwing.
 *     Before this slice the ceiling was component useState, so a user on a weak
 *     machine re-clamped it on every single portrait open (atlas
 *     presentation-scene gap 11 / owner queue #17).
 *   mapSubTab — which sub-tab of the dossier's Map tab opens by default
 *     (TC-0 / DESIGN_TOWN_CARTOGRAPHY §12: "one selected-sub-tab display
 *     preference, persisted per the display-preference partialize rules"). The
 *     vocabulary is owned by lib/mapSubTabs.js and deliberately NOT re-spelled
 *     here, for the SAME reason sceneQualityMode's is not: that module is lazy
 *     map-lane code and this slice is eager, so importing it would drag map bytes
 *     into the first-paint closure. The store holds an opaque string; the one
 *     consumer (MapTabShell) normalizes it against the sub-tabs that are actually
 *     PRESENT on read, so an unknown, retired, or gated-off value opens the plan
 *     rather than an empty panel.
 *
 * LIFECYCLE (all six hops, because this is persisted state):
 *   create     — DEFAULT_DISPLAY_PREFS below.
 *   read       — useTownScenePaneBridge seeds the viewer from it.
 *   persist    — the `displayPrefs` key in store/index.js `partialize`
 *                (localStorage `settlementforge`). Registered in
 *                tests/store/lifecycleRoundTrip.test.js ZUSTAND_PERSIST_KEYS.
 *   rehydrate  — mergePersistedState deep-merges the persisted bag OVER these
 *                defaults, so a key added here later backfills for a returning
 *                user instead of reading undefined (the store-6 cohort-fork
 *                class, closed the same way `config` closes it).
 *   migrate    — none, and none owed: the bag is additive and absent-tolerant,
 *                so a blob written before it existed rehydrates to the defaults.
 *   undo/clone — not applicable: a display preference is outside canon, has no
 *                inverse verb, and is never snapshotted with a world.
 */

/** The shipped defaults. Frozen: callers spread it, never mutate it. */
export const DEFAULT_DISPLAY_PREFS = Object.freeze({
  sceneQualityMode: 'auto',
  // The canonical 2D plan is first and default (§1, §12) — the permanent
  // precision/accessibility/export surface every other presentation falls back to.
  mapSubTab: 'plan',
});

// The `(set, get)` signature is the store's slice convention AND the anchor the
// operationRegistry census walker uses to locate a slice object, so `get` stays in
// the parameter list verbatim even though this slice reads nothing across slices.
// It cannot be renamed to `_get` without making the slice invisible to that census.
// eslint-disable-next-line no-unused-vars -- see above: the walker matches `(set, get)` literally
export const createDisplayPrefsSlice = (set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  displayPrefs: { ...DEFAULT_DISPLAY_PREFS },

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Set the 3D portrait's rendering-quality ceiling for this device.
   *
   * Shape-guarded rather than vocabulary-guarded (see the header): a non-string
   * falls back to the default instead of persisting junk, and the renderer does
   * the vocabulary clamp where the vocabulary actually lives.
   *
   * @param {unknown} mode one of the adaptiveQuality OVERRIDE_MODES
   */
  setSceneQualityMode: (mode) =>
    set(state => {
      state.displayPrefs.sceneQualityMode = typeof mode === 'string' && mode
        ? mode
        : DEFAULT_DISPLAY_PREFS.sceneQualityMode;
    }),

  /**
   * Remember which sub-tab of the dossier's Map tab this device opens by default.
   *
   * Shape-guarded, not vocabulary-guarded — the same split sceneQualityMode uses
   * and for the same reason (see the header): the vocabulary lives in the lazy
   * map lane, and the reader clamps against the sub-tabs actually present, which
   * is a stricter question than membership in the vocabulary anyway.
   *
   * @param {unknown} id one of the lib/mapSubTabs.js MAP_SUB_TAB_IDS
   */
  setMapSubTab: (id) =>
    set(state => {
      state.displayPrefs.mapSubTab = typeof id === 'string' && id
        ? id
        : DEFAULT_DISPLAY_PREFS.mapSubTab;
    }),
});
