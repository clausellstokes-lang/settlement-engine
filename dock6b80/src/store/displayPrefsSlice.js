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
 * ⚰ TWO KEYS RETIRED (TE-STRIP-3, owner grant ODQ §731 / Q-S1). `sceneQualityMode`
 * (the 3D portrait's quality ceiling, R-5b / owner queue #17) and `mapSubTab` (the
 * Map tab's default sub-tab, TC-0) both described surfaces the owner ordered removed,
 * and both lost their last reader when the legacy settlement map's UI left with
 * STRIP-1 (ODQ §725). Their setters went with them and out of the operation registry.
 * ⚠ A blob written before that commit may still carry either key. That is TOLERATED,
 * not migrated: `mergePersistedState` spreads the DEFAULTS first and the persisted bag
 * over them, so an unknown key rides along inert — nothing reads it and nothing
 * crashes on it. It is NOT erased, and saying so would be the comfortable lie: it
 * survives in state and is written back on the next partialize. Prelaunch, with no
 * users, an inert extra key costs nothing and a destructive migration could only lose
 * data, so none was written.
 *
 * Keys in use:
 *   realmMagicChoice — which answer the Instant World's "Does magic exist in
 *     these lands?" modal PRE-SELECTS on this machine (MG-1,
 *     docs/DESIGN_REALM_MAGIC_TOGGLE §4). The vocabulary ('yes' | 'no') is owned
 *     by domain/instantWorld/worldPlan.js MAGIC_CHOICES and deliberately NOT
 *     re-spelled here: that module is reached only behind the composer's dynamic
 *     import and this slice is eager, so importing it would drag composer bytes
 *     into the first-paint closure. The store holds an opaque string; the modal
 *     clamps on read.
 *
 *     WHY THIS IS STILL NOT GENERATOR INPUT, despite naming a generation knob.
 *     The persisted value never reaches a generator on its own: the modal is
 *     MANDATORY before every instant realm (Esc cancels the generation rather
 *     than defaulting), so what reaches the composer is always an answer the DM
 *     confirmed for THAT realm. This key only decides which button starts
 *     focused — a preference about the machine. It is absent from `config` and
 *     no domain module reads it.
 *
 * LIFECYCLE (all six hops, because this is persisted state):
 *   create     — DEFAULT_DISPLAY_PREFS below.
 *   read       — InstantWorldEntry seeds the magic modal's pre-selection from it.
 *   persist    — the `displayPrefs` key in store/index.js `partialize`
 *                (localStorage `settlementforge`). Registered in
 *                tests/store/lifecycleRoundTrip.test.js ZUSTAND_PERSIST_KEYS.
 *   rehydrate  — mergePersistedState deep-merges the persisted bag OVER these
 *                defaults, so a key added here later backfills for a returning
 *                user instead of reading undefined (the store-6 cohort-fork
 *                class, closed the same way `config` closes it).
 *   migrate    — none, and none owed in EITHER direction: the bag is additive and
 *                absent-tolerant, so a blob written before a key existed rehydrates
 *                to the defaults; and a blob written before a key was RETIRED keeps
 *                an inert extra. ⚠ Stated precisely, because the loose version is
 *                wrong: the merge spreads the persisted bag OVER the defaults, so a
 *                retired key SURVIVES in state and is re-persisted on the next
 *                partialize. It is not dropped — it is simply read by nothing. That
 *                is the tolerated end state, and it is pinned by an arm in
 *                tests/store/lifecycleRoundTrip.test.js rather than assumed.
 *   undo/clone — not applicable: a display preference is outside canon, has no
 *                inverse verb, and is never snapshotted with a world.
 */

/** The shipped defaults. Frozen: callers spread it, never mutate it. */
export const DEFAULT_DISPLAY_PREFS = Object.freeze({
  // A world of magic is the shipped default (§4) — it is what every realm built
  // before this knob existed was, so a returning user's first modal pre-selects
  // the world they already know.
  realmMagicChoice: 'yes',
  // VAR-3 (T11) — the Instant World wizard's per-knob "keep this" pins:
  // "keep my tone, surprise me otherwise". A pinned knob is HELD when the
  // wizard's Surprise-me reroll runs; the knobs themselves stay ordinary
  // user input. Same discipline as realmMagicChoice above: a preference about
  // the MACHINE, never generator input on its own — what reaches the composer
  // is always the knob value standing in the form when the DM generates.
  instantKnobPins: Object.freeze({ realmSize: false, tone: false, mapKind: false }),
});

/** The closed pinnable-knob vocabulary (the three basic knobs; the magic knob
 *  is a mandatory modal question and cannot be pinned by design). */
const PINNABLE_KNOBS = new Set(['realmSize', 'tone', 'mapKind']);

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
   * Remember which answer the Instant World's magic question pre-selects on this
   * machine. Shape-guarded, not vocabulary-guarded (see the header): a non-string
   * falls back to the default instead of persisting junk, and the modal does the
   * vocabulary clamp where the vocabulary actually lives.
   *
   * @param {unknown} choice one of worldPlan.js MAGIC_CHOICES ('yes' | 'no')
   */
  setRealmMagicChoice: (choice) =>
    set(state => {
      state.displayPrefs.realmMagicChoice = typeof choice === 'string' && choice
        ? choice
        : DEFAULT_DISPLAY_PREFS.realmMagicChoice;
    }),

  /**
   * VAR-3 — pin (or unpin) one of the wizard's three basic knobs against the
   * Surprise-me reroll. Vocabulary-clamped to the closed knob set: an unknown
   * knob writes nothing (never a junk key into the persisted bag). A returning
   * user's bag from before this key rehydrates to all-unpinned via the merge.
   *
   * @param {unknown} knob one of 'realmSize' | 'tone' | 'mapKind'
   * @param {unknown} pinned
   */
  setInstantKnobPin: (knob, pinned) =>
    set(state => {
      if (typeof knob !== 'string' || !PINNABLE_KNOBS.has(knob)) return;
      state.displayPrefs.instantKnobPins = {
        ...DEFAULT_DISPLAY_PREFS.instantKnobPins,
        ...(state.displayPrefs.instantKnobPins || {}),
        [knob]: !!pinned,
      };
    }),
});
