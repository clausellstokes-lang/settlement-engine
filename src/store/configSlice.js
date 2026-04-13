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
};

export const createConfigSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  config: { ...DEFAULT_CONFIG },

  // Wizard UI state (persisted)
  wizardStep: 0,                   // current step in the wizard
  wizardMode: 'quick',             // 'quick' | 'advanced' | 'custom'
  configPanelOpen:  false,
  instPanelOpen:    false,
  svcPanelOpen:     false,
  showAdvanced:     false,
  randomSliderMode: true,

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

  setWizardStep: (step) =>
    set(state => { state.wizardStep = step; }),

  setWizardMode: (mode) =>
    set(state => { state.wizardMode = mode; }),

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
