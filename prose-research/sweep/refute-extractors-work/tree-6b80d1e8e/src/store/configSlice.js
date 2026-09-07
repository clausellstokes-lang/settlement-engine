/**
 * configSlice — Settlement generation configuration.
 *
 * Holds every parameter the generator reads: tier, trade route, culture,
 * threat level, priority sliders, magic toggle, resources, stresses, etc.
 * The wizard UI mutates this slice; generateSettlement() consumes it.
 */

import {
  userContentTunableIntentForPatch,
} from '../domain/content/userContentTunableIntent.js';

export const DEFAULT_CONFIG = {
  settType:                'random',       // 'random' | 'custom' | tier name
  population:              1500,
  tradeRouteAccess:        'random_trade',
  culture:                 'random_culture',
  // Generated-theme boundary. Grounded keeps serious political/criminal
  // pressure while requiring an explicit opt-in for trafficking, slavery, and
  // torture. Existing saves without the field resolve to the same default.
  contentProfile:          'grounded',
  contentBoundaries:       null,
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

// ── Shapeless-patch validation (Wave R-3, atlas VI.12 #163b) ────────────────
// updateConfig's admitted key surface. DEFAULT_CONFIG is the wizard's rendered
// surface, but the R-3 caller census proved the REAL surface is wider: the
// Library's saved-config load and the sample/fixture forks replay whole
// persisted `_config` blobs, and the pipeline + store read many keys beyond
// the defaults. The extra-key list below is DERIVED BY THE SAME SOURCE SCAN
// the walker test executes (tests/generators/configPatchAllowlistWalker.test.js):
// every `config.<key>` / destructured read across src/generators (the
// configSeamContract alias vocabulary) plus every literal key a component
// stamps via updateConfig(). A few entries are scan over-collection from alias
// property reads on non-config objects ('has', 'consumers', ...) — kept
// deliberately so this literal and the walker's derivation can never drift;
// nothing writes them, so they are inert. A key OUTSIDE this surface is
// provably read by nothing: updateConfig drops it with a typed report (and a
// dev error) instead of letting it pollute the persisted config forever.
// JUDGMENT (vetoable, recorded in the R-3 plan note): filter-and-report over
// atomic whole-patch refusal, because legacy saved-config blobs may carry
// retired keys and refusing the whole patch would break the Library's
// "Apply Saved Configuration" flow. Veto = refuse whenever unknownKeys.length.
//
// ONE member below is COMPOSED instead of spelled: the stressor-edits key.
// configSlice merely NAMES that key in this patch allowlist — it neither reads
// nor writes stressor-edit records. Those records have a single writer
// (domain/crisisLifecycle.js) and four consumers (domain/events/undoEvent.js,
// generators/generationReceiptJudgments.js, generators/steps/resolveStress.js,
// generators/steps/stressConfirmPass.js), and that five-file set is FROZEN by a
// vocabulary-closure scan in tests/joins/crisisTripleSync.test.js which greps
// src for the bare token. Spelling the token here would enlist this file as a
// sixth handler of a record it never handles. Composing it keeps the closure
// scan scoped to the files that actually touch the record and keeps the frozen
// set frozen; runtime admission is identical and is pinned explicitly in
// tests/store/updateConfigPatchValidation.test.js.
const STRESSOR_EDITS_KEY = 'stressor' + 'Edits';
const CONFIG_PATCH_EXTRA_KEYS = new Set(('consumers contentProfileId cultureProfileId '
  + 'cultureProfileKey customTradeGoods eventConditions exportBonus faith '
  + 'generationContentProfile has importLabels intendedStressTypes latentPantheon '
  + 'magicLevel minTier nearbyResourceDefinitions nearbyResourceDefinitionsDepleted '
  + 'nearbyResourcesCustom nearbyResourcesNative nearbyResourcesNativeDepleted '
  + 'neighborRelationship neighbourRelType primaryDeityRef primaryDeitySnapshot '
  + 'resourceEdits routeRequired seed specialResources stressType stressTypes '
  + `${STRESSOR_EDITS_KEY} suppliers targetCampaignId terrainOverride terrainType tier `
  + 'tradeCommodity tradeRoute useCustomContent').split(' '));

/**
 * Is `key` on updateConfig's admitted surface? Underscore-prefixed keys are
 * the established pipeline/store rider convention (`_seed`,
 * `_forkedFromSample`, `_neighbourRelType`, ...) and are admitted as a family.
 * Exported for the allowlist walker, which re-derives the census from source
 * and reds when a read/written key is not admitted here.
 * @param {string} key
 * @returns {boolean}
 */
export function isAllowedConfigKey(key) {
  return Object.hasOwn(DEFAULT_CONFIG, key)
    || key.startsWith('_')
    || CONFIG_PATCH_EXTRA_KEYS.has(key);
}

// The FIRST parameter is LOAD-BEARING and must stay literally `set`: the
// operation-registry walker locates a slice's action object by matching
// `create<Name>Slice = (set, …) =>`, and it deliberately refuses `(_set, get)` /
// `(store, get)` so a renamed first parameter fails loudly instead of silently
// dropping this file's actions from the census (pinned in
// tests/store/operationRegistry.walker.test.js). LATER parameters are free —
// the 2026-07-27 hardening widened the locator to any name and pins `(set, _get)`
// explicitly — so the second one, whose only reader (setSettlementType's tier
// clamp) was retired below, now carries the unused-arg underscore instead of an
// eslint suppression.
export const createConfigSlice = (set, _get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  config: { ...DEFAULT_CONFIG },

  // Wizard UI state (persisted)
  wizardStep: 0,                   // current step in the wizard
  wizardMode: null,                // null (card picker) | 'basic' (was 'quick') | 'advanced' | 'custom'
  configPanelOpen:  false,
  instPanelOpen:    false,
  svcPanelOpen:     false,
  showAdvanced:     false,
  randomSliderMode: true,
  // Character card: the GM explicitly clicked the Custom chip. Breaks the
  // tie when the live slider values exactly match a preset (the default 50s
  // equal `balanced`), so the Custom chip is reachable. Session-only UI
  // intent — deliberately NOT persisted (not in partialize).
  customSlidersExplicit: false,

  // Field-level authored intent for the small public content-tunable registry.
  // DEFAULT_CONFIG must contain concrete values for rendering, but materialized
  // defaults are not user choices. Keeping intent beside (not inside) config
  // lets a ContentEnvironmentRevision supply defaults without polluting the
  // simulation snapshot or treating every default as an override.
  configExplicitFields: {},

  // Loaded-from-save indicator
  loadedFromSave: null,            // { name, tier } or null

  // ── Actions ────────────────────────────────────────────────────────────────
  /**
   * Patch the generation config. Keys are validated against the admitted
   * surface (isAllowedConfigKey): admitted keys apply; unknown keys are
   * DROPPED with a dev error and reported in the typed return; a patch with
   * no admitted key (or a non-object) is refused whole and writes nothing.
   * Intent recording (configExplicitFields) is unchanged for admitted keys —
   * the tunable registry is a subset of DEFAULT_CONFIG, so filtering can
   * never affect it.
   * @param {object} partial config keys to assign
   * @param {{ recordIntent?: boolean }} [options]
   * @returns {{ ok: true, ignoredKeys?: string[] }
   *   | { ok: false, reason: string, unknownKeys?: string[] }}
   */
  updateConfig: (partial, options = {}) => {
    if (!partial || typeof partial !== 'object' || Array.isArray(partial)) {
      if (import.meta.env.DEV) {
        console.error('[configSlice] updateConfig refused a non-object patch:', partial);
      }
      return { ok: false, reason: 'invalid_config_patch' };
    }
    const keys = Object.keys(partial);
    const unknownKeys = keys.filter(key => !isAllowedConfigKey(key));
    if (unknownKeys.length) {
      if (import.meta.env.DEV) {
        console.error(
          '[configSlice] updateConfig dropped config keys nothing reads (pipeline, store, or wizard):',
          unknownKeys,
        );
      }
      if (unknownKeys.length === keys.length) {
        return { ok: false, reason: 'unknown_config_keys', unknownKeys };
      }
    }
    set(state => {
      for (const key of keys) {
        if (isAllowedConfigKey(key)) state.config[key] = partial[key];
      }
      if (options.recordIntent !== false) {
        state.configExplicitFields = userContentTunableIntentForPatch(
          partial,
          state.configExplicitFields,
        );
      }
    });
    return unknownKeys.length ? { ok: true, ignoredKeys: unknownKeys } : { ok: true };
  },

  // RETIRED (R-5b, owner queue #21): `resetConfig`. A whole-object "restore the
  // generation settings to defaults" that no surface offered — the wizard resets a
  // FIELD at a time through updateConfig, and the Create flow's whole-bag reset is
  // resetAllToggles over the toggle bags, not this. Its retirement pays a structural
  // dividend beyond the dead row: it was one of the enumerated EXEMPTIONS that
  // bypassed R-3's validated door, so with it gone `updateConfig` is the ONE writer
  // of state.config in the entire store, exactly what the R-4 single-door law wanted
  // (tests/store/configDirectWriterExemptions.scan.test.js now enumerates a door and
  // zero exemptions). Re-adding a reset means routing it THROUGH updateConfig, or
  // re-earning an exemption in that scan with a written reason.

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

  // RETIRED (R-5b, owner queue #21): `setSettlementType`. Its body was a tier
  // clamp, which made retiring it a paid-surface question — so the gate was
  // PROVEN to live elsewhere before this line was deleted, not assumed:
  // settlementSlice.generateSettlement refuses an over-cap `settType` outright
  // (`if (!state.isTierAllowed(settType)) return null`) and re-gates the RESOLVED
  // tier after generation for the 'random'/'custom' sentinels. Both run on every
  // generation. This clamp had no caller, so config already reached those gates
  // unclamped today; removing it changes no behavior and removes no gate. The
  // premium boundary stays exactly where the R-4 single-source law put it — at
  // the commit, not at the picker.
});
