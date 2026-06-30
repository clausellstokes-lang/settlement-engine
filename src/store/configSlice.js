/**
 * configSlice — Settlement generation configuration.
 *
 * Holds every parameter the generator reads: tier, trade route, culture,
 * threat level, priority sliders, magic toggle, resources, stresses, etc.
 * The wizard UI mutates this slice; generateSettlement() consumes it.
 */

export const DEFAULT_CONFIG = {
  settType:                'random',       // 'random' | 'custom' | tier name
  population:              1500,
  tradeRouteAccess:        'random_trade',
  culture:                 'random_culture',
  settlementAgeMode:       'auto',
  settlementAgeYears:      0,
  monsterThreat:           'random_threat',
  priorityEconomy:         50,
  priorityMilitary:        50,
  priorityMagic:           50,
  priorityReligion:        50,
  priorityCriminal:        50,
  magicExists:             true,
  nearbyResourcesRandom:   true,
  nearbyResources:         null,
  nearbyResourcesDepleted: [],
  nearbyResourcesState:    {},
  selectedStresses:        [],
  selectedStressesRandom:  true,
  customName:              '',
  // Custom Generate additions (Phase D)
  customInstitutions:      [],   // user-defined institution definitions
  customResources:         [],   // user-defined resource types
  customTradeRoutes:       [],   // user-defined trade dependencies
  powerDynamicsConfig:     null, // pre-set faction relationships / government prefs
  defenseScenarioConfig:   null, // pre-configured defense posture
};

export const createConfigSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  config: { ...DEFAULT_CONFIG },

  // Wizard UI state (persisted)
  wizardStep: 0,                   // current step in the wizard
  wizardMode: null,                // null (card picker) | 'basic' (was 'quick') | 'advanced' | 'custom'
  // How the CURRENT settlement was started: 'instant' (the one-click hero
  // generate) | 'basic' | 'advanced'. Drives where Back / New Draft return to
  // (instant -> Create landing; basic/advanced -> that config panel). Not
  // persisted, mirrors wizardMode.
  entryPath: null,
  // Bumped by App when the user RE-CLICKS the already-active Create nav tab. The
  // Create page's "first screen" (the generate-ask) vs the generated dossier is
  // wizard-LOCAL state, not a distinct route, so a re-click can't reset it via the
  // path router — this counter is the signal GenerateWizard watches to run its
  // own reset. Transient (not persisted); only the CHANGE matters, not the value.
  createResetNonce: 0,
  configPanelOpen:  false,
  instPanelOpen:    false,
  svcPanelOpen:     false,
  showAdvanced:     false,
  randomSliderMode: true,
  // Explicit "I picked Custom" intent for the merged Character card. Without it,
  // a default config (all priorities 50) collides exactly with the `balanced`
  // archetype, so clicking Custom would light up Balanced instead. The flag lets
  // the Custom chip win that tie. Set by the Custom chip; cleared by Random or any
  // archetype pick; a slider drag leaves it untouched (drag already yields Custom
  // for non-preset combos, and keeps Custom for a deliberate 50s return).
  customSlidersExplicit: false,

  // Loaded-from-save indicator
  loadedFromSave: null,            // { name, tier } or null

  // ── Actions ────────────────────────────────────────────────────────────────
  updateConfig: (partial) =>
    set(state => {
      Object.assign(state.config, partial);
    }),

  resetConfig: () =>
    set(state => {
      state.config = { ...DEFAULT_CONFIG };
    }),

  /** Signal GenerateWizard to reset to its first (generate-ask) screen — fired
   *  when the user re-clicks the already-active Create nav tab. */
  requestCreateReset: () =>
    set(state => { state.createResetNonce = (state.createResetNonce || 0) + 1; }),

  setWizardStep: (step) =>
    set(state => { state.wizardStep = step; }),

  setWizardMode: (mode) =>
    set(state => {
      // Two real modes: 'basic' (was 'quick') and 'advanced'. (The 'custom'
      // mode / Workshop power dashboard was removed.) null returns to the
      // card picker.
      state.wizardMode = mode;
      // Always reset step when mode changes — users expect each mode to start
      // at the beginning.
      state.wizardStep = 0;
    }),

  setEntryPath: (p) =>
    set(state => { state.entryPath = p; }),

  setConfigPanelOpen: (open) =>
    set(state => { state.configPanelOpen = open; }),

  setInstPanelOpen: (open) =>
    set(state => { state.instPanelOpen = open; }),

  setSvcPanelOpen: (open) =>
    set(state => { state.svcPanelOpen = open; }),

  setShowAdvanced: (val) =>
    set(state => { state.showAdvanced = val; }),

  setRandomSliderMode: (val) =>
    set(state => { state.randomSliderMode = val; }),

  setCustomSlidersExplicit: (val) =>
    set(state => { state.customSlidersExplicit = val; }),

  setLoadedFromSave: (val) =>
    set(state => { state.loadedFromSave = val; }),

  clearLoadedFromSave: () =>
    set(state => { state.loadedFromSave = null; }),

  /**
   * Enforce tier gate: if the user selects a tier above their permission,
   * clamp to their maxAllowedTier.
   */
  setSettlementType: (settType) =>
    set(state => {
      const allowed = get().isTierAllowed(settType);
      state.config.settType = allowed ? settType : get().maxAllowedTier();
    }),
});
