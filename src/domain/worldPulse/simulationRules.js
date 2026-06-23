export const PROPAGATION_MODES = Object.freeze(['off', 'local', 'first_order', 'full']);
export const SIMULATION_INTENSITIES = Object.freeze(['conservative', 'normal', 'dramatic']);
export const MIGRATION_MODES = Object.freeze(['roll', 'void', 'distributed', 'concentrated']);
export const SIMULATION_RULES_SCHEMA_VERSION = 1;
export const CUSTOM_SIMULATION_PRESET_ID = 'custom';
export const DEFAULT_SIMULATION_PRESET_ID = 'realistic_regional';

export const DEFAULT_SIMULATION_RULES = Object.freeze({
  schemaVersion: SIMULATION_RULES_SCHEMA_VERSION,
  presetId: DEFAULT_SIMULATION_PRESET_ID,
  propagationMode: 'first_order',
  intensity: 'conservative',
  stressorsEnabled: true,
  emergentEventsEnabled: true,
  relationshipDynamicsEnabled: true,
  npcAgencyEnabled: true,
  factionCompetitionEnabled: true,
  populationDynamicsEnabled: true,
  migrationFlowsEnabled: true,
  tradeFlowsEnabled: true,
  resourceDriftEnabled: true,
  tierDriftEnabled: true,
  institutionLifecycleEnabled: true,
  majorChangesRequireProposal: true,
  // Geopolitical war + trade-war layer — opt-in, DEFAULT FALSE so every existing
  // campaign is byte-identical. Flip to true for NEW campaigns once the convergence
  // + soak suites are green (see SUBSYSTEM_INTEGRATION_PLAN). Because every named
  // preset spreads DEFAULT_SIMULATION_RULES, all presets inherit it and presetId
  // stays stable (guarded by simulationRulesPreset.stability.test).
  warLayerEnabled: false,
  // The settlement strategy chooser. Opt-in, DEFAULT FALSE so
  // every existing campaign is byte-identical (no strategy candidates emitted).
  // Like warLayerEnabled, every named preset spreads DEFAULT_SIMULATION_RULES so
  // all presets inherit it and presetId stays stable (guarded by
  // simulationRulesPreset.stability.test).
  settlementStrategyEnabled: false,
  // Religion dynamics: the deity contest + conversion spread +
  // religious_authority channel mint. Opt-in, DEFAULT FALSE. This is only ONE of
  // the TWO gates: even with this true, religion stays a pure no-op until the
  // activation gate fires (≥1 settlement carries config.primaryDeitySnapshot). So
  // a default-true-but-deity-free campaign is byte-identical (the activation gate
  // short-circuits before any fork/mint). Every named preset spreads
  // DEFAULT_SIMULATION_RULES so all presets inherit it and presetId stays stable
  // (guarded by simulationRulesPreset.stability.test).
  religionDynamicsEnabled: false,
  migrationMode: 'roll',
});

export const SIMULATION_RULE_PRESETS = Object.freeze({
  quiet_local: Object.freeze({
    id: 'quiet_local',
    label: 'Quiet Local',
    summary: 'Low volatility, local propagation, and proposal gates for major changes.',
    rules: Object.freeze({
      ...DEFAULT_SIMULATION_RULES,
      presetId: 'quiet_local',
      propagationMode: 'local',
      intensity: 'conservative',
      factionCompetitionEnabled: false,
      migrationFlowsEnabled: false,
      tradeFlowsEnabled: false,
      migrationMode: 'void',
    }),
  }),
  realistic_regional: Object.freeze({
    id: 'realistic_regional',
    label: 'Realistic Regional',
    summary: 'Default regional simulation with conservative approval gates.',
    rules: Object.freeze({
      ...DEFAULT_SIMULATION_RULES,
      presetId: DEFAULT_SIMULATION_PRESET_ID,
    }),
  }),
  dramatic_campaign: Object.freeze({
    id: 'dramatic_campaign',
    label: 'Dramatic Campaign',
    summary: 'Higher intensity, wider propagation, and fewer proposal gates.',
    rules: Object.freeze({
      ...DEFAULT_SIMULATION_RULES,
      presetId: 'dramatic_campaign',
      propagationMode: 'full',
      intensity: 'dramatic',
      majorChangesRequireProposal: false,
      migrationMode: 'distributed',
    }),
  }),
});

/**
 * @typedef {Partial<typeof DEFAULT_SIMULATION_RULES> & Record<string, unknown>} SimulationRulesInput
 */

const BOOLEAN_KEYS = Object.freeze([
  'stressorsEnabled',
  'emergentEventsEnabled',
  'relationshipDynamicsEnabled',
  'npcAgencyEnabled',
  'factionCompetitionEnabled',
  'populationDynamicsEnabled',
  'migrationFlowsEnabled',
  'tradeFlowsEnabled',
  'resourceDriftEnabled',
  'tierDriftEnabled',
  'institutionLifecycleEnabled',
  'majorChangesRequireProposal',
  'warLayerEnabled',
  'settlementStrategyEnabled',
  'religionDynamicsEnabled',
]);

const RULE_COMPARISON_KEYS = Object.freeze([
  'propagationMode',
  'intensity',
  'migrationMode',
  ...BOOLEAN_KEYS,
]);

function enumValue(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function rulesMatchPreset(rules, preset) {
  return RULE_COMPARISON_KEYS.every(key => rules[key] === preset?.rules?.[key]);
}

function presetIdForRules(input, rules) {
  const explicit = typeof input.presetId === 'string' && SIMULATION_RULE_PRESETS[input.presetId]
    ? input.presetId
    : null;
  if (explicit && rulesMatchPreset(rules, SIMULATION_RULE_PRESETS[explicit])) return explicit;
  const inferred = Object.keys(SIMULATION_RULE_PRESETS)
    .find(id => rulesMatchPreset(rules, SIMULATION_RULE_PRESETS[id]));
  return inferred || CUSTOM_SIMULATION_PRESET_ID;
}

export function normalizeSimulationRules(raw = {}) {
  const input = /** @type {SimulationRulesInput} */ (raw && typeof raw === 'object' ? raw : {});
  const next = {
    ...DEFAULT_SIMULATION_RULES,
    ...input,
    schemaVersion: SIMULATION_RULES_SCHEMA_VERSION,
    propagationMode: enumValue(input.propagationMode, PROPAGATION_MODES, DEFAULT_SIMULATION_RULES.propagationMode),
    intensity: enumValue(input.intensity, SIMULATION_INTENSITIES, DEFAULT_SIMULATION_RULES.intensity),
    migrationMode: enumValue(input.migrationMode, MIGRATION_MODES, DEFAULT_SIMULATION_RULES.migrationMode),
  };
  for (const key of BOOLEAN_KEYS) {
    next[key] = input[key] === undefined ? DEFAULT_SIMULATION_RULES[key] : input[key] !== false;
  }
  next.presetId = presetIdForRules(input, next);
  return next;
}

export function propagationDepthForRules(raw = {}) {
  const rules = normalizeSimulationRules(raw);
  // `off` and `local` both stop regional channel propagation. `local` still
  // permits local World Pulse drift, while `off` is intended for disabling
  // regional effects entirely at the rule-selection layer.
  if (rules.propagationMode === 'off' || rules.propagationMode === 'local') return 0;
  if (rules.propagationMode === 'first_order') return 1;
  return 2;
}

export function intensityMultiplier(raw = {}) {
  const rules = normalizeSimulationRules(raw);
  if (rules.intensity === 'conservative') return 0.65;
  if (rules.intensity === 'dramatic') return 1.45;
  return 1;
}
