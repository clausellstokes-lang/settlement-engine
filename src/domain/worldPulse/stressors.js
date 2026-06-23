import { stablePart } from './worldState.js';
import { activeChannelsFrom, REGIONAL_CHANNEL_TYPES } from '../region/index.js';
import { normalizeSimulationRules } from './simulationRules.js';
import { counterforceAssessment, synergyAssessment, interpretStressorOrigin } from './stressorDynamics.js';
import { STRESSOR_SPAWN_GATES } from './stressorGates.js';

// The stressor catalog was authored with a looser channel vocabulary than the
// canonical regional taxonomy (region/graph.js). Map the divergent names onto
// real channel types so spread actually matches confirmed channels instead of
// silently no-op'ing (the names that never matched: regional_authority,
// information_network, patronage, faction_patronage, arcane_network,
// labor_dependency, wilderness_frontier).
const SPREAD_CHANNEL_ALIASES = Object.freeze({
  regional_authority: 'political_authority',
  information_network: 'information_flow',
  patronage: 'political_authority',
  faction_patronage: 'political_authority',
  arcane_network: 'information_flow',
  labor_dependency: 'trade_dependency',
  wilderness_frontier: 'resource_competition',
});

/** Map a stressor spread-channel name onto a canonical regional channel type, or null if unknown. */
export function canonicalSpreadChannel(name) {
  const mapped = SPREAD_CHANNEL_ALIASES[name] || name;
  return REGIONAL_CHANNEL_TYPES.includes(mapped) ? mapped : null;
}

export const STRESSOR_POLICIES = Object.freeze({
  transient: { baseResolutionChance: 0.46, decay: 0.18, maxAge: 2 },
  episodic: { baseResolutionChance: 0.18, decay: 0.1, maxAge: 8 },
  structural: { baseResolutionChance: 0.02, decay: 0.02, maxAge: null },
  dormant_residual: { baseResolutionChance: 0.32, decay: 0.08, maxAge: 12 },
});

export const STRESSOR_LIFECYCLE_STAGES = Object.freeze([
  'emerging',
  'active',
  'peaking',
  'easing',
  'resolved',
  'residual',
  'dormant',
]);

// ── Spawn gates ────────────────────────────────────────────────────────────
// Every birth is gated on ORGANIC CONTEXT, not raw pressure alone. The
// per-type gates live in stressorGates.js — the coup's politics gate (which
// used to live here) was the prototype; the catalog-wide model reads the same
// source vocabulary the counterforces read, inverted: the weaknesses that
// invite a crisis are the strengths that end one. A gate returns null to
// BLOCK the birth (context contradicts the story) or { probabilityMult,
// reasons } to scale its odds; the reasons land on the candidate so the
// dossier can explain why THIS crisis emerged HERE.

export const STRESSOR_CATALOG = Object.freeze({
  siege: {
    label: 'Siege pressure',
    durationPolicy: 'structural',
    pressureKinds: ['conflict'],
    birthThreshold: 0.72,
    spreadChannels: ['war_front', 'military_protection', 'trade_route'],
    residualEffects: ['damaged_walls', 'veteran_unrest', 'defensive_debt'],
    affectedSystems: ['defense_readiness', 'trade_connectivity', 'public_legitimacy'],
  },
  famine: {
    label: 'Famine pressure',
    durationPolicy: 'structural',
    pressureKinds: ['food'],
    birthThreshold: 0.66,
    spreadChannels: ['trade_dependency', 'migration_pressure', 'resource_competition', 'trade_route'],
    residualEffects: ['food_debt', 'hoarding_grievance', 'weakened_labor'],
    affectedSystems: ['food_security', 'labor_capacity', 'public_legitimacy'],
  },
  occupation: {
    label: 'Occupation pressure',
    durationPolicy: 'structural',
    pressureKinds: ['conflict', 'legitimacy'],
    birthThreshold: 0.76,
    spreadChannels: ['war_front', 'military_protection', 'regional_authority'],
    residualEffects: ['occupation_collaborators', 'resistance_cells', 'broken_defenses'],
    affectedSystems: ['defense_readiness', 'public_legitimacy', 'faction_stability'],
  },
  political_fracture: {
    label: 'Political fracture',
    durationPolicy: 'structural',
    pressureKinds: ['legitimacy'],
    birthThreshold: 0.64,
    spreadChannels: ['regional_authority', 'information_network', 'service_dependency'],
    residualEffects: ['legal_confusion', 'public_distrust', 'faction_blame'],
    affectedSystems: ['public_legitimacy', 'faction_stability', 'social_trust'],
  },
  indebtedness: {
    label: 'Debt spiral',
    durationPolicy: 'structural',
    pressureKinds: ['trade', 'food'],
    birthThreshold: 0.62,
    spreadChannels: ['trade_dependency', 'export_market', 'patronage'],
    residualEffects: ['tax_arrears', 'pledged_rights', 'merchant_leverage'],
    affectedSystems: ['tax_revenue', 'trade_connectivity', 'public_legitimacy'],
  },
  betrayal: {
    label: 'Betrayal shock',
    durationPolicy: 'transient',
    pressureKinds: ['legitimacy', 'crime'],
    birthThreshold: 0.7,
    spreadChannels: ['information_network', 'regional_authority'],
    residualEffects: ['purge_fear', 'loyalty_tests', 'diplomatic_distrust'],
    affectedSystems: ['public_legitimacy', 'social_trust', 'faction_stability'],
  },
  infiltration: {
    label: 'Infiltration network',
    durationPolicy: 'episodic',
    pressureKinds: ['crime', 'legitimacy'],
    birthThreshold: 0.58,
    spreadChannels: ['criminal_corridor', 'trade_route', 'information_network'],
    residualEffects: ['informant_scars', 'blackmail_files', 'watcher_fear'],
    affectedSystems: ['criminal_opportunity', 'public_legitimacy', 'social_trust'],
  },
  disease_outbreak: {
    label: 'Disease outbreak',
    durationPolicy: 'episodic',
    pressureKinds: ['disease'],
    birthThreshold: 0.58,
    spreadChannels: ['trade_route', 'migration_pressure', 'service_dependency'],
    residualEffects: ['labor_scars', 'healer_exhaustion', 'quarantine_distrust'],
    affectedSystems: ['healing_capacity', 'labor_capacity', 'social_trust'],
  },
  succession_void: {
    label: 'Succession void',
    durationPolicy: 'episodic',
    pressureKinds: ['legitimacy'],
    birthThreshold: 0.7,
    spreadChannels: ['regional_authority', 'information_network', 'faction_patronage'],
    residualEffects: ['claimant_grievances', 'legal_precedent_shock', 'faction_purges'],
    affectedSystems: ['public_legitimacy', 'faction_stability', 'law_order'],
  },
  monster_raider_pressure: {
    label: 'Monster or raider pressure',
    durationPolicy: 'episodic',
    pressureKinds: ['conflict', 'crime'],
    birthThreshold: 0.6,
    spreadChannels: ['wilderness_frontier', 'trade_route', 'resource_competition'],
    residualEffects: ['abandoned_roads', 'militia_burden', 'fearful_hamlets'],
    affectedSystems: ['defense_readiness', 'trade_connectivity', 'housing_pressure'],
  },
  insurgency: {
    label: 'Insurgency pressure',
    durationPolicy: 'structural',
    pressureKinds: ['legitimacy', 'conflict'],
    birthThreshold: 0.68,
    spreadChannels: ['criminal_corridor', 'information_network', 'regional_authority'],
    residualEffects: ['hidden_cells', 'reprisal_memory', 'security_overreach'],
    affectedSystems: ['public_legitimacy', 'defense_readiness', 'social_trust'],
  },
  religious_conversion_fracture: {
    label: 'Religious conversion fracture',
    durationPolicy: 'episodic',
    pressureKinds: ['legitimacy'],
    birthThreshold: 0.62,
    spreadChannels: ['religious_authority', 'service_dependency', 'information_network'],
    residualEffects: ['sectarian_memory', 'temple_debt', 'ritual_disputes'],
    affectedSystems: ['public_legitimacy', 'social_trust', 'faction_stability'],
  },
  slave_revolt: {
    label: 'Slave revolt pressure',
    durationPolicy: 'episodic',
    pressureKinds: ['legitimacy', 'conflict'],
    birthThreshold: 0.78,
    spreadChannels: ['labor_dependency', 'criminal_corridor', 'information_network'],
    residualEffects: ['manumission_pressure', 'reprisal_fear', 'labor_reordering'],
    affectedSystems: ['labor_capacity', 'public_legitimacy', 'defense_readiness'],
    // Folded out of ORGANIC births only (the sim has no slavery substrate to
    // make the claim honestly — organic uprisings birth as `rebellion`, with
    // a `servile_uprising` variant when the labor context fits). The entry
    // stays: legacy saves keep aging/normalizing, the generation vocabulary
    // (19 files) is untouched, and the DM can still author one deliberately.
    deprecated: true,
  },
  rebellion: {
    label: 'Rebellion pressure',
    durationPolicy: 'episodic',
    pressureKinds: ['legitimacy', 'conflict'],
    birthThreshold: 0.7,
    spreadChannels: ['information_flow', 'political_authority', 'criminal_corridor'],
    residualEffects: ['reprisal_memory', 'autonomy_cells', 'broken_tax_obligations'],
    affectedSystems: ['public_legitimacy', 'faction_stability', 'defense_readiness'],
  },
  wartime: {
    label: 'Wartime footing',
    durationPolicy: 'structural',
    pressureKinds: ['conflict'],
    birthThreshold: 0.64,
    spreadChannels: ['war_front', 'military_protection', 'trade_route'],
    residualEffects: ['veteran_unrest', 'war_taxes', 'widow_orphan_pressure'],
    affectedSystems: ['defense_readiness', 'tax_revenue', 'labor_capacity'],
  },
  mass_migration: {
    label: 'Mass migration',
    durationPolicy: 'episodic',
    pressureKinds: ['food', 'conflict', 'disease'],
    birthThreshold: 0.62,
    spreadChannels: ['migration_pressure', 'trade_route', 'service_dependency'],
    residualEffects: ['housing_pressure', 'labor_market_shift', 'identity_tension'],
    affectedSystems: ['housing_pressure', 'food_security', 'social_trust'],
  },
  market_shock: {
    label: 'Market shock',
    durationPolicy: 'transient',
    pressureKinds: ['trade'],
    birthThreshold: 0.56,
    spreadChannels: ['trade_dependency', 'export_market', 'trade_route'],
    residualEffects: ['debt_overhang', 'merchant_blame', 'price_memory'],
    affectedSystems: ['trade_connectivity', 'tax_revenue', 'public_legitimacy'],
  },
  criminal_corridor: {
    label: 'Criminal corridor',
    durationPolicy: 'episodic',
    pressureKinds: ['crime'],
    birthThreshold: 0.56,
    spreadChannels: ['criminal_corridor', 'trade_route', 'migration_pressure'],
    residualEffects: ['protection_rackets', 'smuggling_habits', 'guard_corruption'],
    affectedSystems: ['criminal_opportunity', 'trade_connectivity', 'social_trust'],
  },
  magical_instability: {
    label: 'Magical instability',
    durationPolicy: 'episodic',
    pressureKinds: ['legitimacy', 'disease', 'conflict'],
    birthThreshold: 0.72,
    spreadChannels: ['arcane_network', 'information_network', 'service_dependency'],
    residualEffects: ['arcane_fear', 'mutated_landmarks', 'ritual_debt'],
    affectedSystems: ['public_legitimacy', 'healing_capacity', 'social_trust'],
  },
  coup_detat: {
    label: "Coup d'état",
    durationPolicy: 'episodic',
    pressureKinds: ['legitimacy'],
    birthThreshold: 0.6,
    spreadChannels: [], // a coup is a palace affair — it never spreads
    residualEffects: ['purge_fear', 'loyalty_tests', 'broken_oaths'],
    affectedSystems: ['public_legitimacy', 'faction_stability', 'social_trust'],
    // The coup's RESOLUTION is a verdict, not an ending: when it resolves
    // during a pulse, worldPulse/coup.js runs the contest among the top-3
    // non-criminal powers vs the legitimacy-amplified incumbent and emits
    // either a coup_suppressed condition or a power_transfer outcome. (Its
    // politics-gated birth lives with every other gate in stressorGates.js.)
  },
  magic_deadzone: {
    label: 'Magic deadzone',
    durationPolicy: 'episodic',
    pressureKinds: ['legitimacy', 'trade', 'disease'],
    birthThreshold: 0.6,
    // A deadzone does not SPREAD — it MOVES (the wander mechanic below).
    // Giving it spread channels too would grow the footprint past the wander
    // cap at attenuated severity, contradicting the zone's whole nature: you
    // are either inside the silence at full strength or outside it.
    spreadChannels: [],
    residualEffects: ['scorched_leylines', 'hedge_wizard_exodus', 'mundane_adaptation'],
    affectedSystems: ['healing_capacity', 'trade_connectivity', 'public_legitimacy'],
    // The inverse of magical_instability — absence, not wildness (the two are
    // mutually exclusive at birth, both directions; see stressorGates.js).
    // Birth is hard-gated to settlements where magic is load-bearing.
    // The zone WANDERS: each aging tick it may creep to one connected
    // neighbour and, past its footprint cap, vacate its oldest ground (which
    // gets a one-time "the silence lifts" residual). Movement forks the rng
    // on the stressor id, so it is order-independent and replay-stable.
    wander: { chance: 0.35, maxFootprint: 2, channels: ['information_flow', 'trade_route'] },
  },
});

// clamp01 + effectiveStressorSeverity now live in the stressorSeverity leaf so
// foodStockpile can read severity without importing back UP into stressors (which
// created the stressors → stressorGates → foodStockpile → stressors ESM cycle).
// Re-exported here so existing importers (flows.js) keep working, AND imported
// as a LOCAL binding because stressors.js's own internal callers (residual/spread/
// contest math at lines ~444/521/980) reference it — a bare `export … from` would
// NOT create the local binding they need.
import { clamp01, effectiveStressorSeverity } from './stressorSeverity.js';
export { effectiveStressorSeverity };

// ── Spread attenuation ──────────────────────────────────────────────────────
// A spread target experiences the shared stressor at the SOURCE's effective
// severity × 0.72 (the original design intent, now applied for real rather than
// as a cosmetic number), floored so spreads stay meaningful.
// The per-settlement map is stamped at spread time; origin settlements are
// absent from it (= full severity), and aging/resolution ignore it — the
// record's lifecycle stays origin-driven.
const SPREAD_ATTENUATION = 0.72;
const SPREAD_SEVERITY_FLOOR = 0.2;

function normalizeSeverityMap(map) {
  if (!map || typeof map !== 'object') return null;
  const out = {};
  for (const [saveId, value] of Object.entries(map)) {
    if (Number.isFinite(value)) out[String(saveId)] = clamp01(value);
  }
  return Object.keys(out).length ? out : null;
}

/**
 * The severity a specific settlement actually experiences. Spread targets
 * carry an attenuated entry in `stressor.severityBySettlement`; origins are
 * absent from the map and feel the record's full severity. Map entries are
 * stamped at spread time and never re-aged, so the record's CURRENT severity
 * caps them — a spread never bites harder than the crisis does at its origin.
 */
function idFor(stressor) {
  return stressor.id || [
    'world_stressor',
    stablePart(stressor.type),
    stablePart(stressor.originSettlementId || stressor.originRegion || 'realm'),
  ].join('.');
}

function catalogFor(type) {
  return STRESSOR_CATALOG[type] || {
    label: String(type || 'Regional pressure').replace(/_/g, ' '),
    durationPolicy: 'episodic',
    pressureKinds: [],
    birthThreshold: 0.65,
    spreadChannels: [],
    residualEffects: ['local_scars'],
    affectedSystems: ['public_legitimacy'],
  };
}

function lifecycleStageFor(stressor) {
  if (stressor.status === 'resolved') return 'resolved';
  if (stressor.status === 'residual') return 'residual';
  if (stressor.status === 'dormant') return 'dormant';
  if (stressor.severity >= 0.72) return 'peaking';
  if (stressor.severity <= 0.24 && stressor.age > 0) return 'easing';
  if (stressor.age <= 1) return 'emerging';
  return 'active';
}

export function normalizeStressor(stressor = {}) {
  const type = stressor.type || 'regional_pressure';
  const defaults = catalogFor(type);
  const durationPolicy = stressor.durationPolicy || defaults.durationPolicy || 'episodic';
  const normalized = {
    id: idFor({ ...stressor, type }),
    type,
    label: stressor.label || defaults.label,
    originSettlementId: stressor.originSettlementId || null,
    originRegion: stressor.originRegion || null,
    severity: clamp01(stressor.severity ?? 0.45),
    // Per-target spread attenuation (H8): the severity each spread target
    // actually experiences. Origins are absent (= full severity). Stamped at
    // spread time, preserved verbatim here — aging/resolution ignore it.
    severityBySettlement: normalizeSeverityMap(stressor.severityBySettlement),
    age: Math.max(0, Number.isFinite(stressor.age) ? stressor.age : 0),
    durationPolicy,
    decayRate: clamp01(stressor.decayRate ?? STRESSOR_POLICIES[durationPolicy]?.decay ?? 0.08),
    spreadChannels: Array.isArray(stressor.spreadChannels) ? [...stressor.spreadChannels] : [...(defaults.spreadChannels || [])],
    affectedSettlementIds: Array.isArray(stressor.affectedSettlementIds)
      ? [...new Set(stressor.affectedSettlementIds.map(String))]
      : [stressor.originSettlementId].filter(Boolean).map(String),
    residualEffects: Array.isArray(stressor.residualEffects) ? [...stressor.residualEffects] : [...(defaults.residualEffects || [])],
    // (resolutionRules was a dormant host field — written as {} on every
    // persisted stressor, read by nothing. Deleted; counterforce profiles in
    // stressorDynamics.js are the real resolution model.)
    // Diagnostic snapshots of the last counterforce / synergy assessments
    // (explainability surface for the dossier and tests; recomputed every
    // aging tick).
    counterforce: stressor.counterforce || null,
    synergy: stressor.synergy || null,
    // Birth-time interpretation: which variant of this stressor type the
    // context produced (foreign_sponsored / internal_conspiracy / ...).
    // attackerSettlementId / attackerLabel inside stay null until known —
    // a siege's attacker may be a goblin warband with no settlement at all.
    originContext: stressor.originContext || null,
    // Echo bookkeeping: peakSeverity tracks the worst this crisis got (it
    // sets how loud the echo is); memoryStrength only exists on echoes
    // (status 'residual') and decays each tick with a ~6-tick half-life.
    peakSeverity: Math.max(
      clamp01(stressor.peakSeverity ?? 0),
      clamp01(stressor.severity ?? 0.45),
    ),
    memoryStrength: stressor.memoryStrength == null ? null : clamp01(stressor.memoryStrength),
    status: stressor.status || 'active',
    lifecycleStage: stressor.lifecycleStage || null,
    resolutionChance: stressor.resolutionChance,
    resolutionRoll: stressor.resolutionRoll,
    resolutionReason: stressor.resolutionReason || null,
    // Resolution receipt: WHY the crisis ended — counterforce score, the
    // named strengths that led recovery, the companions it outlasted, and a
    // one-line narrative. Stamped at resolution time (rolled or directed).
    resolutionContext: stressor.resolutionContext || null,
    resolvedAt: stressor.resolvedAt || null,
    // Determinism: no wall-clock fallback. Timestamps are null until the
    // orchestrator stamps `now` when the stressor is persisted (applyWorldPulse
    // / ageRoamingStressors / resolveStressorById all thread `now`).
    createdAt: stressor.createdAt || null,
    updatedAt: stressor.updatedAt || stressor.createdAt || null,
  };
  return {
    ...normalized,
    lifecycleStage: normalized.lifecycleStage || lifecycleStageFor(normalized),
  };
}

function resolutionChance(stressor, snapshot, assessment = undefined) {
  const policy = STRESSOR_POLICIES[stressor.durationPolicy] || STRESSOR_POLICIES.episodic;
  let chance = policy.baseResolutionChance + Math.max(0, stressor.age - 1) * 0.04;
  // Counterforces: settlement strength shifts the recovery hazard both ways.
  // Generalizes the old hard-coded disease_outbreak healing_capacity check —
  // every catalog type now names its own strengths (stressorDynamics.js).
  const cf = assessment === undefined ? counterforceAssessment(stressor, snapshot) : assessment;
  if (cf) chance += cf.resolutionDelta;
  if (stressor.type === 'market_shock' && stressor.age >= 1) chance += 0.12;
  if (stressor.type === 'betrayal' && stressor.age >= 1) chance += 0.16;
  // A coup brews for ~2-3 ticks (the party's window to shore up — or gut —
  // the ruler's case), then the verdict forces itself: conspiracies cannot
  // hold their nerve forever. Resolution here IS the verdict trigger
  // (worldPulse/coup.js decides who actually ends up on the seat).
  if (stressor.type === 'coup_detat' && stressor.age >= 2) chance += 0.3;
  if (stressor.type === 'coup_detat' && stressor.age >= 4) chance += 0.6;
  if (policy.maxAge != null && stressor.age >= policy.maxAge) chance += 0.25;
  if (stressor.durationPolicy === 'structural' && stressor.severity >= 0.5) chance *= 0.35;
  return clamp01(chance);
}

// The catalog's affectedSystems were authored with a looser vocabulary than
// causalState.SYSTEM_VARIABLES — faction_stability / law_order / tax_revenue
// are not real causal variables, so residual conditions carrying them silently
// no-op'd against the substrate. Map them onto the nearest real variable at
// emission time (catalog keeps its semantic names).
const CAUSAL_SYSTEM_ALIASES = Object.freeze({
  faction_stability: 'faction_power',
  law_order: 'criminal_opportunity', // lawless interregnum -> opportunists move in
  tax_revenue: 'trade_connectivity',
});

function canonicalAffectedSystems(systems = []) {
  return [...new Set(systems.map(name => CAUSAL_SYSTEM_ALIASES[name] || name))];
}

function residualOutcome(stressor, tick) {
  const targetIds = stressor.affectedSettlementIds || [];
  const defaults = catalogFor(stressor.type);
  return targetIds.map(targetSaveId => {
    // Truthful aftermath: the residual scar matches what THIS settlement
    // actually experienced — a spread target's attenuated severity (the
    // severityBySettlement stamp), not the record's origin severity.
    const experienced = effectiveStressorSeverity(stressor, targetSaveId);
    const residualSeverity = Math.max(0.15, experienced * 0.45);
    return {
      id: `world_outcome.residual.${stablePart(stressor.id)}.${stablePart(targetSaveId)}`,
      type: 'condition',
      candidateType: 'stressor_residual',
      ruleId: `stressor_${stressor.type}_residual`,
      ruleFamily: 'stressor',
      applyMode: 'auto',
      probability: 1,
      targetSaveId,
      severity: residualSeverity,
      score: Math.round(experienced * 45),
      headline: `${stressor.label} leaves aftereffects`,
      summary: `${stressor.label} is no longer the active crisis, but its consequences remain visible.`,
      reasons: [
        'A time-bounded stressor resolved.',
        `Residual effects remain: ${stressor.residualEffects.slice(0, 3).join(', ').replace(/_/g, ' ')}.`,
        // The resolution receipt: why the crisis ended (counterforce-led
        // recovery, what it outlasted) — same explainability bar as births.
        ...(stressor.resolutionContext?.narrative ? [stressor.resolutionContext.narrative] : []),
      ],
      condition: {
        archetype: 'stressor_residual',
        label: `${stressor.label} aftereffects`,
        description: `${stressor.label} has eased, leaving ${stressor.residualEffects.slice(0, 3).join(', ').replace(/_/g, ' ')}.`,
        severity: residualSeverity,
        status: 'easing',
        duration: { elapsedTicks: 0, expiresAtTicks: 6 },
        triggeredAt: { tick, sourceEventType: 'WORLD_STRESSOR_RESOLVED', sourceEventTargetId: stressor.id },
        affectedSystems: canonicalAffectedSystems(defaults.affectedSystems || ['labor_capacity', 'public_legitimacy', 'social_trust']),
        causes: [{ source: stressor.id, effect: 'residual_aftereffect', reason: 'The active stressor resolved naturally.' }],
      },
    };
  });
}

/**
 * The resolution receipt — why a crisis ended, in the same explainable terms
 * the rest of the engine uses. Built from the live counterforce assessment
 * (its per-source breakdown names the strengths that led the recovery) and
 * the synergy table (the companions it ended despite).
 */
function resolutionContextFor(stressor, assessment, synergy) {
  const leadingSources = (assessment?.sourceBreakdown || [])
    .filter(source => source.value >= 0.6)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map(source => ({ source: source.label, value: Math.round(source.value * 100) / 100 }));
  const companions = synergy?.companions || [];
  const narrative = [
    leadingSources.length
      ? `Recovery led by ${leadingSources.map(s => `${s.source} (${s.value})`).join(', ')}.`
      : 'The crisis ran its course.',
    companions.length
      ? `It ended despite the drag of ${companions.join(', ').replace(/_/g, ' ')}.`
      : null,
  ].filter(Boolean).join(' ');
  return {
    counterforceScore: assessment ? Math.round(assessment.score * 100) / 100 : null,
    leadingSources,
    synergyCompanions: companions,
    narrative,
  };
}

// ── Wandering stressors ────────────────────────────────────────────────────
// A catalog type with `wander` (magic_deadzone today) MOVES instead of merely
// spreading: each aging tick it may creep to one connected neighbour and,
// past its footprint cap, vacate its oldest ground. The vacated settlement
// gets a one-time easing residual ("the silence lifts; the ground it starved
// recovers slowly"). The roll forks on the stressor id (order-independent);
// arrivals experience full record severity (the zone IS there — unlike a
// spread, nothing is attenuated by distance).

function wanderDepartureOutcome(stressor, vacatedSaveId, tick) {
  const defaults = catalogFor(stressor.type);
  const residualSeverity = Math.max(0.15, effectiveStressorSeverity(stressor, vacatedSaveId) * 0.45);
  return {
    id: `world_outcome.wander.${stablePart(stressor.id)}.${stablePart(vacatedSaveId)}.${tick}`,
    type: 'condition',
    candidateType: 'stressor_residual',
    ruleId: `stressor_${stressor.type}_wander_departure`,
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId: vacatedSaveId,
    severity: residualSeverity,
    score: Math.round(residualSeverity * 60),
    headline: `${stressor.label} drifts on`,
    summary: `${stressor.label} has moved to other ground; what it starved here recovers slowly.`,
    reasons: [
      'A wandering stressor vacated this settlement.',
      `Residual effects remain: ${stressor.residualEffects.slice(0, 3).join(', ').replace(/_/g, ' ')}.`,
    ],
    condition: {
      archetype: 'stressor_residual',
      label: `${stressor.label} aftermath`,
      description: `${stressor.label} has drifted on, leaving ${stressor.residualEffects.slice(0, 2).join(', ').replace(/_/g, ' ')}; recovery comes slowly.`,
      severity: residualSeverity,
      status: 'easing',
      duration: { elapsedTicks: 0, expiresAtTicks: 6 },
      triggeredAt: { tick, sourceEventType: 'WORLD_STRESSOR_MOVED', sourceEventTargetId: stressor.id },
      affectedSystems: canonicalAffectedSystems(defaults.affectedSystems || ['public_legitimacy']),
      causes: [{ source: stressor.id, effect: 'wander_departure', reason: 'The wandering stressor moved to other ground.' }],
    },
  };
}

function wanderStep(stressor, wander, snapshot, rng, tick, now) {
  const graph = snapshot?.regionalGraph;
  if (!graph) return { stressor, vacatedOutcomes: [] };
  const fork = typeof rng.fork === 'function' ? rng.fork(`wander:${stressor.id}`) : rng;
  if (fork.random() > (wander.chance ?? 0.35)) return { stressor, vacatedOutcomes: [] };
  const affected = (stressor.affectedSettlementIds || []).map(String);
  const targets = new Set();
  for (const sourceId of affected) {
    for (const channel of activeChannelsFrom(graph, sourceId, { types: wander.channels || [] })) {
      const to = String(channel.to);
      if (to && !affected.includes(to)) targets.add(to);
    }
  }
  if (!targets.size) return { stressor, vacatedOutcomes: [] };
  // Plain codepoint sort + forked pick: deterministic and order-independent.
  const sorted = [...targets].sort();
  const pick = sorted[Math.min(sorted.length - 1, Math.floor(fork.random() * sorted.length))];
  const nextAffected = [...affected, pick];
  const severityBySettlement = { ...(stressor.severityBySettlement || {}) };
  delete severityBySettlement[pick]; // arrivals feel the zone at full strength
  const vacatedOutcomes = [];
  while (nextAffected.length > Math.max(1, wander.maxFootprint ?? 2)) {
    const vacated = nextAffected.shift();
    delete severityBySettlement[vacated];
    vacatedOutcomes.push(wanderDepartureOutcome(stressor, vacated, tick));
  }
  return {
    stressor: normalizeStressor({
      ...stressor,
      // originSettlementId stays the BIRTH origin (the stable id embeds it);
      // the live footprint is affectedSettlementIds, which is what every
      // consumer (counterforces, effects, the dossier) actually reads.
      affectedSettlementIds: nextAffected,
      severityBySettlement: Object.keys(severityBySettlement).length ? severityBySettlement : null,
      updatedAt: now || stressor.updatedAt,
    }),
    vacatedOutcomes,
  };
}

// Echoes fade on a ~6-tick half-life; below this floor they graduate out of
// the world state entirely (graduates are handed to the chronicle/history).
const ECHO_HALF_LIFE_TICKS = 6;
const ECHO_DECAY_FACTOR = Math.pow(0.5, 1 / ECHO_HALF_LIFE_TICKS);
const ECHO_GRADUATION_FLOOR = 0.1;

function echoOf(resolvedStressor, now) {
  return normalizeStressor({
    ...resolvedStressor,
    // Canonical id (type + origin), even when the live stressor carried a
    // decorated id (e.g. rebellion births suffix the tick): echoes of the
    // same crisis at the same origin must coalesce, and a re-ignition must
    // overwrite the echo via the byId upsert instead of stacking beside it.
    id: idFor({
      type: resolvedStressor.type,
      originSettlementId: resolvedStressor.originSettlementId
        || (resolvedStressor.affectedSettlementIds || [])[0]
        || null,
    }),
    status: 'residual',
    lifecycleStage: 'residual',
    // The echo is as loud as the crisis ended OR half as loud as its worst
    // moment, whichever is greater — a famine that once peaked at 0.9 is not
    // forgotten just because it limped out at 0.08.
    memoryStrength: Math.max(
      resolvedStressor.severity ?? 0,
      (resolvedStressor.peakSeverity ?? resolvedStressor.severity ?? 0) * 0.5,
    ),
    updatedAt: now || resolvedStressor.updatedAt,
  });
}

export function ageRoamingStressors(stressors = [], snapshot, rng, options = {}) {
  const tick = options.tick ?? 0;
  const active = [];
  const resolved = [];
  const residualOutcomes = [];
  const graduated = [];
  // Normalize the whole list up front: synergy assessment needs every
  // co-located companion (including echoes) visible while aging each one.
  const normalizedAll = (stressors || []).map(normalizeStressor);

  for (const stressor of normalizedAll) {
    // Echoes — resolved crises still in living memory. No pressure, no
    // conditions; they fade by half-life, feed the spawn interpreter and
    // reduced-weight synergies meanwhile, then graduate into history.
    if (stressor.status === 'residual') {
      const memoryStrength = clamp01((stressor.memoryStrength ?? 0) * ECHO_DECAY_FACTOR);
      if (memoryStrength < ECHO_GRADUATION_FLOOR) {
        graduated.push(normalizeStressor({
          ...stressor,
          status: 'dormant',
          lifecycleStage: 'dormant',
          memoryStrength,
          updatedAt: options.now || stressor.updatedAt,
        }));
        continue;
      }
      active.push(normalizeStressor({
        ...stressor,
        age: stressor.age + 1,
        memoryStrength,
        updatedAt: options.now || stressor.updatedAt,
      }));
      continue;
    }
    if (!['active', 'emerging', 'peaking', 'easing'].includes(stressor.status) && stressor.lifecycleStage !== 'active') {
      active.push(stressor);
      continue;
    }
    // Counterforces scale the decay step as well as the resolution roll —
    // the decay lever is what lets STRUCTURAL stressors actually break:
    // they are categorically un-resolvable while severity >= 0.25, so a
    // chance bonus alone would never end a siege.
    const assessment = counterforceAssessment(stressor, snapshot);
    // Synergies: co-located companions drag (or block) recovery. They
    // compose with counterforces multiplicatively on decay, additively on
    // the resolution chance, with global clamps on the combined result.
    const synergy = synergyAssessment(stressor, normalizedAll);
    const combinedDecayMult = Math.max(0.4, Math.min(2.5,
      (assessment?.decayMultiplier ?? 1) * (synergy?.decayMult ?? 1)));
    const effectiveDecay = clamp01(stressor.decayRate * combinedDecayMult);
    // A resolution-blocked stressor holds its ground instead of decaying into
    // a zombie: a blockade famine cannot drop below 0.25 (or below where it
    // already was) while the siege stands — the scarcity is the blockade.
    const blockFloor = synergy?.blocksResolution === true
      ? Math.min(0.25, stressor.severity)
      : 0;
    const aged = normalizeStressor({
      ...stressor,
      age: stressor.age + 1,
      // lifecycleStage is recomputed from the aged severity/age (passing the
      // stale stage through froze 'emerging'/'peaking' forever).
      lifecycleStage: null,
      severity: Math.max(blockFloor, clamp01(stressor.severity - effectiveDecay)),
      counterforce: assessment
        ? {
            score: Math.round(assessment.score * 100) / 100,
            resolutionDelta: Math.round(assessment.resolutionDelta * 1000) / 1000,
            decayMultiplier: Math.round(assessment.decayMultiplier * 100) / 100,
            floorsMet: assessment.floorsMet,
          }
        : null,
      synergy: synergy
        ? {
            companions: synergy.companions,
            decayMult: Math.round(synergy.decayMult * 100) / 100,
            resolutionDelta: Math.round(synergy.resolutionDelta * 1000) / 1000,
            blocksResolution: synergy.blocksResolution,
          }
        : null,
      // No wall-clock fallback: the orchestrator always threads `now`; a
      // caller that omits it keeps the prior stamp (replay-identical).
      updatedAt: options.now || stressor.updatedAt,
    });
    const chance = clamp01(resolutionChance(aged, snapshot, assessment) + (synergy?.resolutionDelta ?? 0));
    // Order independence: the resolution roll forks on the STRESSOR'S ID, not
    // a shared stream consumed in list order — reordering the persisted list
    // (or the saves array that feeds it) cannot change which crises resolve.
    // Stubs without fork() (the constant-roll test harnesses) fall back.
    const roll = typeof rng.fork === 'function' ? rng.fork(`age:${aged.id}`).random() : rng.random();
    const structuralStillActive = aged.durationPolicy === 'structural' && aged.severity >= 0.25;
    const blockedBySynergy = synergy?.blocksResolution === true;
    if (!blockedBySynergy && !structuralStillActive && (roll <= chance || aged.severity <= 0.08)) {
      const done = normalizeStressor({
        ...aged,
        status: 'resolved',
        lifecycleStage: 'resolved',
        resolvedAt: options.now || aged.updatedAt,
        resolutionRoll: roll,
        resolutionChance: chance,
        // The receipt: why it ended, in the same terms births explain
        // themselves with (the live per-source counterforce breakdown).
        resolutionContext: resolutionContextFor(aged, assessment, synergy),
      });
      resolved.push(done);
      residualOutcomes.push(...residualOutcome(done, tick));
      // The crisis is over; its echo begins. Same stable id, so a re-ignition
      // of the same type at the same origin simply overwrites the echo.
      active.push(echoOf(done, options.now));
    } else {
      let survivor = normalizeStressor({ ...aged, resolutionRoll: roll, resolutionChance: chance });
      // Wandering types (magic_deadzone) may creep to a neighbour and vacate
      // their oldest ground — the departure emits an easing residual there.
      const wander = catalogFor(survivor.type).wander;
      if (wander) {
        const moved = wanderStep(survivor, wander, snapshot, rng, tick, options.now);
        survivor = moved.stressor;
        residualOutcomes.push(...moved.vacatedOutcomes);
      }
      active.push(survivor);
    }
  }

  return { stressors: active, resolved, residualOutcomes, graduated };
}

/**
 * Resolve a single stressor by id (e.g. the party broke the siege). Unlike
 * ageRoamingStressors this is a *directed* resolution — no roll — used by the
 * party-impact hook. Returns the remaining stressors plus the resolved record
 * and its residual-aftereffect outcomes (so the consequences still linger).
 *
 * @param {any[]} stressors
 * @param {string} stressorId
 * @param {{ tick?: number, now?: string, reason?: string, emitResidual?: boolean }} [opts]
 */
export function resolveStressorById(stressors = [], stressorId, opts = {}) {
  const { tick = 0, now = null, reason = 'Resolved by party action', emitResidual = true } = opts;
  const remaining = [];
  const resolved = [];
  const residualOutcomes = [];
  let found = false;
  for (const raw of stressors || []) {
    const stressor = normalizeStressor(raw);
    if (stressor.id !== stressorId) { remaining.push(stressor); continue; }
    found = true;
    // Directed resolution of an ECHO is a dismissal: the table decided the
    // memory no longer matters. Drop it — no residuals, no echo-of-an-echo.
    if (stressor.status === 'residual') {
      resolved.push(normalizeStressor({
        ...stressor,
        status: 'dormant',
        lifecycleStage: 'dormant',
        resolvedAt: now || stressor.updatedAt,
        resolutionReason: reason,
        updatedAt: now || stressor.updatedAt,
      }));
      continue;
    }
    const done = normalizeStressor({
      ...stressor,
      status: 'resolved',
      lifecycleStage: 'resolved',
      resolvedAt: now || stressor.updatedAt,
      resolutionReason: reason,
      // Directed resolutions have no live assessment; the receipt carries the
      // stated reason plus the last aging tick's stored diagnostics.
      resolutionContext: {
        counterforceScore: stressor.counterforce?.score ?? null,
        leadingSources: [],
        synergyCompanions: stressor.synergy?.companions || [],
        narrative: reason,
      },
      updatedAt: now || stressor.updatedAt,
    });
    resolved.push(done);
    if (emitResidual) residualOutcomes.push(...residualOutcome(done, tick));
    // Party-broken crises echo too — "the siege the party lifted" is exactly
    // the kind of recent memory the table keeps talking about.
    remaining.push(echoOf(done, now));
  }
  return { stressors: remaining, resolved, residualOutcomes, found };
}

/**
 * Nudge a stressor's severity (the party eased — or worsened — a crisis
 * without fully ending it). Returns the updated stressor list and the changed
 * record (or null when the id wasn't found).
 *
 * @param {any[]} stressors
 * @param {string} stressorId
 * @param {number} delta  signed severity change
 * @param {{ now?: string }} [opts]
 */
export function adjustStressorSeverityById(stressors = [], stressorId, delta, opts = {}) {
  const { now = null } = opts;
  let changed = null;
  const next = (stressors || []).map(raw => {
    const stressor = normalizeStressor(raw);
    if (stressor.id !== stressorId) return stressor;
    changed = normalizeStressor({
      ...stressor,
      severity: clamp01(stressor.severity + (Number(delta) || 0)),
      updatedAt: now || stressor.updatedAt,
    });
    return changed;
  });
  return { stressors: next, changed };
}

function stressorTypesForPressure(pressure) {
  return Object.entries(STRESSOR_CATALOG)
    // Deprecated types (slave_revolt) never birth organically — they remain
    // in the catalog only for legacy saves and deliberate DM authoring.
    .filter(([, rule]) => !('deprecated' in rule && rule.deprecated))
    .filter(([, rule]) => (rule.pressureKinds || []).includes(pressure.kind) && pressure.score >= rule.birthThreshold)
    .map(([type]) => type);
}

function candidateForTypeAndPressure(type, pressure, tick, extras = {}) {
  const { snapshot = null, echo = null, gate = null } = extras;
  const defaults = catalogFor(type);
  const targetSaveId = String(pressure.settlementId);
  // Re-ignition: a warm echo of the same crisis relights at partial strength —
  // the grudge / the weakened granaries / the unfilled graves are still there.
  const reignitionBoost = echo ? clamp01(echo.memoryStrength ?? 0) * 0.3 : 0;
  const severity = clamp01(pressure.score + reignitionBoost);
  const originContext = snapshot
    ? interpretStressorOrigin(type, targetSaveId, snapshot, tick)
    : null;
  const stressor = normalizeStressor({
    type,
    originSettlementId: targetSaveId,
    severity,
    affectedSettlementIds: [targetSaveId],
    originContext,
  });
  const major = pressure.score >= 0.78 || ['occupation', 'magic_deadzone', 'siege', 'coup_detat'].includes(type);
  // Spawn-gated types scale their birth odds by the gate's politics read
  // (e.g. a coup is rare at Contested legitimacy, likely at Crisis).
  const gateMult = Number.isFinite(gate?.probabilityMult) ? gate.probabilityMult : 1;
  return {
    id: `candidate.stressor.${stablePart(type)}.${stablePart(targetSaveId)}.${tick}`,
    type: 'stressor',
    candidateType: `stressor_birth_${type}`,
    ruleId: `stressor_birth_${type}`,
    ruleFamily: 'stressor',
    targetSaveId,
    severity,
    probability: Math.min(0.6, Math.max(0.02, Math.min(0.5, Math.max(0.07, pressure.score * 0.34)) * gateMult)),
    applyMode: major ? 'proposal' : 'auto',
    headline: `${stressor.label} may emerge`,
    summary: `${pressure.settlementName} has enough ${pressure.label.toLowerCase()} for ${stressor.label.toLowerCase()} to become a realm stressor.`,
    reasons: [
      ...pressure.reasons,
      `${defaults.label} birth gate passed at ${pressure.score.toFixed(2)} pressure.`,
      ...(gate?.reasons || []),
      ...(echo ? [`Re-ignition: the last ${stressor.label.toLowerCase()} is still in living memory (echo ${(echo.memoryStrength ?? 0).toFixed(2)}).`] : []),
      ...(originContext?.reason ? [originContext.reason] : []),
    ],
    stressor,
    metadata: {
      lifecycleStage: stressor.lifecycleStage,
      durationPolicy: stressor.durationPolicy,
      spreadChannels: stressor.spreadChannels,
      residualEffects: stressor.residualEffects,
      ...(originContext ? { originVariant: originContext.variant } : {}),
    },
    conflictTags: [`stressor:${type}:${targetSaveId}`, `settlement:${targetSaveId}:stressor_birth`],
  };
}

export function stressorCandidateForPressure(pressure, tick) {
  if (!pressure || pressure.score < 0.56) return null;
  // Gates that can hard-block need the world snapshot to read their context;
  // this snapshot-less path conservatively skips those types (the coup always
  // behaved so). Gradient-only gates are simply not applied here.
  const type = stressorTypesForPressure(pressure).filter(t => !STRESSOR_SPAWN_GATES[t]?.requiresSnapshot)[0];
  if (!type) return null;
  return candidateForTypeAndPressure(type, pressure, tick);
}

const INACTIVE_STATUSES = new Set(['resolved', 'dormant', 'residual']);

function existingStressorKeys(stressors = []) {
  const keys = new Set();
  for (const raw of stressors) {
    const stressor = normalizeStressor(raw);
    // Echoes do NOT block rebirth — a resolved famine in living memory is
    // exactly what a re-ignited famine overwrites (same stable id).
    if (INACTIVE_STATUSES.has(stressor.status)) continue;
    for (const id of stressor.affectedSettlementIds || []) keys.add(`${stressor.type}:${id}`);
  }
  return keys;
}

function echoIndex(stressors = []) {
  const index = new Map();
  for (const raw of stressors) {
    const stressor = normalizeStressor(raw);
    if (stressor.status !== 'residual') continue;
    for (const id of stressor.affectedSettlementIds || []) {
      const key = `${stressor.type}:${id}`;
      const prev = index.get(key);
      if (!prev || (stressor.memoryStrength ?? 0) > (prev.memoryStrength ?? 0)) index.set(key, stressor);
    }
  }
  return index;
}

/**
 * Name (or rename) the force behind a stressor. The attacker is nullable by
 * design: a siege may be pressed by a hostile settlement (auto-stamped at
 * birth) or by a force with no settlement base at all — a goblin warband, a
 * mercenary company — which only the DM can name.
 *
 * @param {any[]} stressors
 * @param {string} stressorId
 * @param {{ attackerSettlementId?: string|null, attackerLabel?: string|null }} attacker
 * @param {{ now?: string }} [opts]
 */
export function setStressorAttacker(stressors = [], stressorId, attacker = {}, opts = {}) {
  const { now = null } = opts;
  let changed = null;
  const next = (stressors || []).map(raw => {
    const stressor = normalizeStressor(raw);
    if (stressor.id !== stressorId) return stressor;
    changed = normalizeStressor({
      ...stressor,
      originContext: {
        variant: 'unattributed',
        ...(stressor.originContext || {}),
        attackerSettlementId: attacker.attackerSettlementId ?? stressor.originContext?.attackerSettlementId ?? null,
        attackerLabel: attacker.attackerLabel ?? stressor.originContext?.attackerLabel ?? null,
      },
      updatedAt: now || stressor.updatedAt,
    });
    return changed;
  });
  return { stressors: next, changed };
}

function spreadTargetsFor(snapshot, stressor) {
  const graph = snapshot?.regionalGraph;
  if (!graph) return [];
  const affected = new Set((stressor.affectedSettlementIds || []).map(String));
  const types = [...new Set((stressor.spreadChannels || []).map(canonicalSpreadChannel).filter(Boolean))];
  if (!types.length) return [];
  // Confirmed, directed channels only — suggested channels never propagate
  // (design principle). A crisis flows outward from each affected settlement
  // along its outgoing channels of a matching type. Each target keeps the
  // strongest EFFECTIVE severity among the sources that reach it: a spread
  // from a spread target attenuates again (from the source's experienced
  // severity), never from the record's origin severity.
  const targets = new Map();
  for (const sourceId of affected) {
    const sourceSeverity = effectiveStressorSeverity(stressor, sourceId);
    for (const channel of activeChannelsFrom(graph, sourceId, { types })) {
      const to = String(channel.to);
      if (!to || affected.has(to)) continue;
      targets.set(to, Math.max(targets.get(to) ?? 0, sourceSeverity));
    }
  }
  const out = [...targets.entries()].map(([targetSaveId, sourceSeverity]) => ({ targetSaveId, sourceSeverity }));
  // A religious conversion flows to the WEAKEST orthodoxies first
  // (most convertible), codepoint tie-break — so the downstream `.slice(0,3)` cap
  // is deterministic AND legible (conversions chase the thinnest faith, not Map
  // insertion order). Scoped to `religious_conversion_fracture` so every other
  // stressor keeps its exact legacy spread order (byte-identical). The orthodoxy
  // key is the target's religious_authority causal score (lower = more
  // convertible), read from the SINGLE pre-tick snapshot.
  if (stressor.type === 'religious_conversion_fracture') {
    const orthodoxyOf = (/** @type {any} */ id) => {
      const item = snapshot?.byId?.get?.(String(id));
      const score = item?.causal?.scores?.religious_authority;
      return Number.isFinite(score) ? score : 50;
    };
    out.sort((a, b) => {
      const oa = orthodoxyOf(a.targetSaveId);
      const ob = orthodoxyOf(b.targetSaveId);
      if (oa !== ob) return oa - ob; // weakest orthodoxy first
      return a.targetSaveId < b.targetSaveId ? -1 : a.targetSaveId > b.targetSaveId ? 1 : 0;
    });
  }
  return out;
}

export function evaluateStressorRules(snapshot, pressureIdx, context = {}) {
  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const pressures = context.pressures || [];
  const rules = normalizeSimulationRules(context.simulationRules || snapshot?.worldState?.simulationRules);
  const currentStressors = (snapshot?.worldState?.stressors || []).map(normalizeStressor);
  const existingKeys = existingStressorKeys(currentStressors);
  const echoes = echoIndex(currentStressors);
  const candidates = [];

  // A WANDERED stressor has drifted off its birth origin: its stable id
  // still embeds that origin, so a fresh birth there would mint the SAME id
  // and the byId upsert would silently clobber the live record elsewhere.
  // Block any birth whose id collides with an active record.
  const activeIds = new Set(
    currentStressors.filter(s => !INACTIVE_STATUSES.has(s.status)).map(s => s.id));

  for (const pressure of pressures) {
    for (const type of stressorTypesForPressure(pressure)) {
      const targetKey = `${type}:${pressure.settlementId}`;
      if (existingKeys.has(targetKey)) continue;
      if (activeIds.has(idFor({ type, originSettlementId: String(pressure.settlementId) }))) continue;
      // Organic birth gates (stressorGates.js): the gate can block the spawn
      // entirely or scale its odds; its reasons land on the candidate.
      const spawnGate = STRESSOR_SPAWN_GATES[type];
      const gate = spawnGate ? spawnGate(snapshot, pressure, { tick }) : null;
      if (spawnGate && !gate) continue;
      candidates.push(candidateForTypeAndPressure(type, pressure, tick, {
        snapshot,
        echo: echoes.get(targetKey) || null,
        gate,
      }));
    }
  }

  for (const stressor of currentStressors) {
    if (!['active', 'emerging', 'peaking', 'easing'].includes(stressor.lifecycleStage)) continue;
    const defaults = catalogFor(stressor.type);
    const strongestPressure = (stressor.affectedSettlementIds || [])
      .map(id => (defaults.pressureKinds || []).map(kind => pressureIdx.get?.(id, kind)?.score || 0))
      .flat()
      .reduce((max, score) => Math.max(max, score), 0);

    if (strongestPressure > 0.62 && stressor.severity < 0.92) {
      const severity = clamp01((stressor.severity + strongestPressure) / 2 + 0.08);
      candidates.push({
        id: `candidate.stressor.escalate.${stablePart(stressor.id)}.${tick}`,
        type: 'stressor',
        candidateType: `stressor_escalate_${stressor.type}`,
        ruleId: `stressor_escalate_${stressor.type}`,
        ruleFamily: 'stressor',
        targetSaveId: stressor.originSettlementId || stressor.affectedSettlementIds?.[0],
        severity,
        probability: Math.min(0.42, 0.08 + strongestPressure * 0.28),
        applyMode: severity >= 0.78 ? 'proposal' : 'auto',
        headline: `${stressor.label} may intensify`,
        summary: `${stressor.label} has not resolved and matching pressure is still increasing.`,
        reasons: [
          `${stressor.label} remains active.`,
          `Matching pressure ${strongestPressure.toFixed(2)} exceeds escalation gate.`,
        ],
        stressor: normalizeStressor({ ...stressor, severity }),
        metadata: {
          lifecycleStage: severity >= 0.72 ? 'peaking' : 'active',
          durationPolicy: stressor.durationPolicy,
        },
        conflictTags: [`stressor:${stressor.id}`, `stressor:${stressor.type}:escalation`],
      });
    }

    if (stressor.severity > 0.42 && !['off', 'local'].includes(rules.propagationMode)) {
      for (const { targetSaveId, sourceSeverity } of spreadTargetsFor(snapshot, stressor).slice(0, 3)) {
        const targetKey = `${stressor.type}:${targetSaveId}`;
        if (existingKeys.has(targetKey)) continue;
        // True per-target attenuation: the spread target
        // joins the ONE shared record, but experiences it at the source's
        // effective severity × 0.72 (floored), stamped into the record's
        // severityBySettlement map. The record's own severity — and its whole
        // lifecycle — stays origin-driven; consumers (foodStockpile, pressure
        // surfaces, the dossier) read through effectiveStressorSeverity.
        const spreadSeverity = Math.max(SPREAD_SEVERITY_FLOOR, clamp01(sourceSeverity * SPREAD_ATTENUATION));
        candidates.push({
          id: `candidate.stressor.spread.${stablePart(stressor.id)}.${stablePart(targetSaveId)}.${tick}`,
          type: 'stressor',
          candidateType: `stressor_spread_${stressor.type}`,
          ruleId: `stressor_spread_${stressor.type}`,
          ruleFamily: 'stressor',
          targetSaveId,
          affectedSettlementIds: [...new Set([...(stressor.affectedSettlementIds || []), targetSaveId])],
          severity: spreadSeverity,
          probability: Math.min(0.34, 0.05 + stressor.severity * 0.22),
          // The proposal gate stays on the RECORD severity: a 0.78+ crisis
          // spreading is a major change even though it arrives attenuated
          // (gating on the attenuated number would make the gate unreachable:
          // 0.78 / 0.72 > 1).
          applyMode: stressor.severity >= 0.78 ? 'proposal' : 'auto',
          headline: `${stressor.label} may spread`,
          summary: `${stressor.label} can spread through ${stressor.spreadChannels.slice(0, 2).join(' and ').replace(/_/g, ' ')} channels, arriving attenuated at severity ${spreadSeverity.toFixed(2)}.`,
          reasons: [
            `${stressor.label} is active at severity ${stressor.severity.toFixed(2)}.`,
            `A plausible spread channel reaches another settlement; the crisis arrives attenuated to ${spreadSeverity.toFixed(2)} there.`,
          ],
          stressor: normalizeStressor({
            ...stressor,
            affectedSettlementIds: [...new Set([...(stressor.affectedSettlementIds || []), targetSaveId])],
            severityBySettlement: {
              ...(stressor.severityBySettlement || {}),
              [targetSaveId]: spreadSeverity,
            },
          }),
          metadata: {
            lifecycleStage: stressor.lifecycleStage,
            spreadChannels: stressor.spreadChannels,
          },
          conflictTags: [`stressor:${stressor.id}`, `stressor:${stressor.type}:${targetSaveId}`],
        });
      }
    }
  }

  return candidates;
}
