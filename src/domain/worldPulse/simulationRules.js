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
  // Defender-side siege attrition (SPIKE). Opt-in, DEFAULT FALSE so every existing
  // campaign is byte-identical (a besieged town's home defense stays a fresh per-tick
  // computation). When true, a besieged settlement accrues an eroding defensive-losses
  // ledger that feeds the siege verdict — a game-balance change gated behind the soak's
  // convergence flags before it graduates. Inherited false by every preset (stability-guarded).
  defenderAttritionEnabled: false,
  // War-economy population drain (P1). Opt-in, DEFAULT FALSE so every existing campaign
  // is byte-identical (deploying an army moves no real population/food). When true, a
  // deployed army conscripts population from its home each tick (a conserved debit) and
  // returns the survivors when it comes home — so war costs blood, and the books balance
  // (deployed − returned === war dead). Nested under warLayerEnabled. Inherited false by
  // every preset (stability-guarded).
  warEconomyDrainEnabled: false,
  // Two-track defender resolve (P4). Opt-in, DEFAULT FALSE ⇒ byte-identical (the siege
  // verdict uses capacity alone). When true, a besieged town's WILL to resist — composed
  // from leadership/faith temperament (facets.will), legitimacy, food/supply, and hope
  // (the odds it faces) — biases the siege roll, and a fully-broken will (starving +
  // illegitimate + pacifist + hopeless) CAPITULATES deterministically (surrender, not a
  // storm). Complements defenderAttritionEnabled (capacity erosion). Preset-stable.
  defenderResolveEnabled: false,
  // War-disposition political flywheel (P2). Opt-in, DEFAULT FALSE ⇒ byte-identical (the
  // coup verdict ignores war sentiment). When true, an unpopular/exhausting war shifts the
  // ruling seat's hold-chance: a warlike regime waging a sustainable war is steadier, while
  // war-weariness (the exhaustion scar) erodes the seat and makes a coup — an internal
  // "end the war" — more likely. So an overextended aggressor can lose on its OWN home
  // front. Nested under warLayerEnabled. Preset-stable.
  warDispositionEnabled: false,
  // Ally defense (P3). Opt-in, DEFAULT FALSE ⇒ byte-identical (a besieged town defends
  // alone). When true, a target's allied / vassal / patron neighbours that are not
  // themselves under siege send relief — a fraction of their home defense — bolstering
  // the defender in the siege verdict, so alliances matter at the walls. Preset-stable.
  allyDefenseEnabled: false,
  // Sack & forage (P3). Opt-in, DEFAULT FALSE ⇒ byte-identical (a stormed town keeps its
  // people intact under occupation, ready to rebel). When true, a CONQUEST carries off a
  // fraction of the conquered population as a CONSERVED transfer with a war-dead sink —
  // some are pressed into service and marched to the victor's home (spoils), the rest are
  // killed or scattered — so a siege finally costs the conquered real blood and rewards
  // the victor. The deltas ride the conquest outcome, so a dismissed/deferred conquest
  // withholds the sack atomically (no phantom population loss). Preset-stable.
  warForageEnabled: false,
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
  'defenderAttritionEnabled',
  'warEconomyDrainEnabled',
  'defenderResolveEnabled',
  'warDispositionEnabled',
  'allyDefenseEnabled',
  'warForageEnabled',
]);

const RULE_COMPARISON_KEYS = Object.freeze([
  'propagationMode',
  'intensity',
  'migrationMode',
  ...BOOLEAN_KEYS,
]);

/**
 * @param {any} value
 * @param {any} allowed
 * @param {any} fallback
 */
function enumValue(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

/**
 * @param {Record<string, any>} rules
 * @param {any} preset
 */
function rulesMatchPreset(rules, preset) {
  return RULE_COMPARISON_KEYS.every(key => rules[key] === preset?.rules?.[key]);
}

/**
 * @param {Record<string, any>} input
 * @param {Record<string, any>} rules
 */
function presetIdForRules(input, rules) {
  const explicit = typeof input.presetId === 'string' && /** @type {Record<string, any>} */ (SIMULATION_RULE_PRESETS)[input.presetId]
    ? input.presetId
    : null;
  if (explicit && rulesMatchPreset(rules, /** @type {Record<string, any>} */ (SIMULATION_RULE_PRESETS)[explicit])) return explicit;
  const inferred = Object.keys(SIMULATION_RULE_PRESETS)
    .find(id => rulesMatchPreset(rules, /** @type {Record<string, any>} */ (SIMULATION_RULE_PRESETS)[id]));
  return inferred || CUSTOM_SIMULATION_PRESET_ID;
}

export function normalizeSimulationRules(raw = {}) {
  const input = /** @type {SimulationRulesInput} */ (raw && typeof raw === 'object' ? raw : {});
  /** @type {Record<string, any>} */
  const next = {
    ...DEFAULT_SIMULATION_RULES,
    ...input,
    schemaVersion: SIMULATION_RULES_SCHEMA_VERSION,
    propagationMode: enumValue(input.propagationMode, PROPAGATION_MODES, DEFAULT_SIMULATION_RULES.propagationMode),
    intensity: enumValue(input.intensity, SIMULATION_INTENSITIES, DEFAULT_SIMULATION_RULES.intensity),
    migrationMode: enumValue(input.migrationMode, MIGRATION_MODES, DEFAULT_SIMULATION_RULES.migrationMode),
  };
  for (const key of BOOLEAN_KEYS) {
    next[key] = input[key] === undefined ? /** @type {Record<string, any>} */ (DEFAULT_SIMULATION_RULES)[key] : input[key] !== false;
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
