import { stablePart } from './worldState.js';
import { activeChannelsFrom, REGIONAL_CHANNEL_TYPES } from '../region/index.js';

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
});

function clamp01(value) {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

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
    age: Math.max(0, Number.isFinite(stressor.age) ? stressor.age : 0),
    durationPolicy,
    decayRate: clamp01(stressor.decayRate ?? STRESSOR_POLICIES[durationPolicy]?.decay ?? 0.08),
    spreadChannels: Array.isArray(stressor.spreadChannels) ? [...stressor.spreadChannels] : [...(defaults.spreadChannels || [])],
    affectedSettlementIds: Array.isArray(stressor.affectedSettlementIds)
      ? [...new Set(stressor.affectedSettlementIds.map(String))]
      : [stressor.originSettlementId].filter(Boolean).map(String),
    residualEffects: Array.isArray(stressor.residualEffects) ? [...stressor.residualEffects] : [...(defaults.residualEffects || [])],
    resolutionRules: stressor.resolutionRules || defaults.resolutionRules || {},
    status: stressor.status || 'active',
    lifecycleStage: stressor.lifecycleStage || null,
    resolutionChance: stressor.resolutionChance,
    resolutionRoll: stressor.resolutionRoll,
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

function resolutionChance(stressor, snapshot) {
  const policy = STRESSOR_POLICIES[stressor.durationPolicy] || STRESSOR_POLICIES.episodic;
  let chance = policy.baseResolutionChance + Math.max(0, stressor.age - 1) * 0.04;
  if (stressor.type === 'disease_outbreak') {
    const affected = (stressor.affectedSettlementIds || [])
      .map(id => snapshot.byId?.get?.(String(id)))
      .filter(Boolean);
    const healing = affected.length
      ? affected.reduce((sum, item) => sum + (item.causal?.scores?.healing_capacity ?? 50), 0) / affected.length
      : 50;
    chance += healing >= 65 ? 0.12 : healing < 35 ? -0.08 : 0;
  }
  if (stressor.type === 'market_shock' && stressor.age >= 1) chance += 0.12;
  if (stressor.type === 'betrayal' && stressor.age >= 1) chance += 0.16;
  if (policy.maxAge != null && stressor.age >= policy.maxAge) chance += 0.25;
  if (stressor.durationPolicy === 'structural' && stressor.severity >= 0.5) chance *= 0.35;
  return clamp01(chance);
}

function residualOutcome(stressor, tick) {
  const targetIds = stressor.affectedSettlementIds || [];
  const defaults = catalogFor(stressor.type);
  return targetIds.map(targetSaveId => ({
    id: `world_outcome.residual.${stablePart(stressor.id)}.${stablePart(targetSaveId)}`,
    type: 'condition',
    candidateType: 'stressor_residual',
    ruleId: `stressor_${stressor.type}_residual`,
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId,
    severity: Math.max(0.15, stressor.severity * 0.45),
    score: Math.round(stressor.severity * 45),
    headline: `${stressor.label} leaves aftereffects`,
    summary: `${stressor.label} is no longer the active crisis, but its consequences remain visible.`,
    reasons: [
      'A time-bounded stressor resolved.',
      `Residual effects remain: ${stressor.residualEffects.slice(0, 3).join(', ').replace(/_/g, ' ')}.`,
    ],
    condition: {
      archetype: 'stressor_residual',
      label: `${stressor.label} aftereffects`,
      description: `${stressor.label} has eased, leaving ${stressor.residualEffects.slice(0, 3).join(', ').replace(/_/g, ' ')}.`,
      severity: Math.max(0.15, stressor.severity * 0.45),
      status: 'easing',
      duration: { elapsedTicks: 0, expiresAtTicks: 6 },
      triggeredAt: { tick, sourceEventType: 'WORLD_STRESSOR_RESOLVED', sourceEventTargetId: stressor.id },
      affectedSystems: defaults.affectedSystems || ['labor_capacity', 'public_legitimacy', 'social_trust'],
      causes: [{ source: stressor.id, effect: 'residual_aftereffect', reason: 'The active stressor resolved naturally.' }],
    },
  }));
}

export function ageRoamingStressors(stressors = [], snapshot, rng, options = {}) {
  const tick = options.tick ?? 0;
  const active = [];
  const resolved = [];
  const residualOutcomes = [];

  for (const raw of stressors || []) {
    const stressor = normalizeStressor(raw);
    if (!['active', 'emerging', 'peaking', 'easing'].includes(stressor.status) && stressor.lifecycleStage !== 'active') {
      active.push(stressor);
      continue;
    }
    const aged = normalizeStressor({
      ...stressor,
      age: stressor.age + 1,
      severity: clamp01(stressor.severity - stressor.decayRate),
      updatedAt: options.now || new Date().toISOString(),
    });
    const chance = resolutionChance(aged, snapshot);
    const roll = rng.random();
    const structuralStillActive = aged.durationPolicy === 'structural' && aged.severity >= 0.25;
    if (!structuralStillActive && (roll <= chance || aged.severity <= 0.08)) {
      const done = normalizeStressor({
        ...aged,
        status: 'resolved',
        lifecycleStage: 'resolved',
        resolvedAt: options.now || new Date().toISOString(),
        resolutionRoll: roll,
        resolutionChance: chance,
      });
      resolved.push(done);
      residualOutcomes.push(...residualOutcome(done, tick));
    } else {
      active.push(normalizeStressor({ ...aged, resolutionRoll: roll, resolutionChance: chance }));
    }
  }

  return { stressors: active, resolved, residualOutcomes };
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
    const done = normalizeStressor({
      ...stressor,
      status: 'resolved',
      lifecycleStage: 'resolved',
      resolvedAt: now || stressor.updatedAt,
      resolutionReason: reason,
      updatedAt: now || stressor.updatedAt,
    });
    resolved.push(done);
    if (emitResidual) residualOutcomes.push(...residualOutcome(done, tick));
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
    .filter(([, rule]) => (rule.pressureKinds || []).includes(pressure.kind) && pressure.score >= rule.birthThreshold)
    .map(([type]) => type);
}

function candidateForTypeAndPressure(type, pressure, tick) {
  const defaults = catalogFor(type);
  const targetSaveId = String(pressure.settlementId);
  const stressor = normalizeStressor({
    type,
    originSettlementId: targetSaveId,
    severity: pressure.score,
    affectedSettlementIds: [targetSaveId],
  });
  const major = pressure.score >= 0.78 || ['occupation', 'slave_revolt', 'siege'].includes(type);
  return {
    id: `candidate.stressor.${stablePart(type)}.${stablePart(targetSaveId)}.${tick}`,
    type: 'stressor',
    candidateType: `stressor_birth_${type}`,
    ruleId: `stressor_birth_${type}`,
    ruleFamily: 'stressor',
    targetSaveId,
    severity: pressure.score,
    probability: Math.min(0.5, Math.max(0.07, pressure.score * 0.34)),
    applyMode: major ? 'proposal' : 'auto',
    headline: `${stressor.label} may emerge`,
    summary: `${pressure.settlementName} has enough ${pressure.label.toLowerCase()} for ${stressor.label.toLowerCase()} to become a realm stressor.`,
    reasons: [
      ...pressure.reasons,
      `${defaults.label} birth gate passed at ${pressure.score.toFixed(2)} pressure.`,
    ],
    stressor,
    metadata: {
      lifecycleStage: stressor.lifecycleStage,
      durationPolicy: stressor.durationPolicy,
      spreadChannels: stressor.spreadChannels,
      residualEffects: stressor.residualEffects,
    },
    conflictTags: [`stressor:${type}:${targetSaveId}`, `settlement:${targetSaveId}:stressor_birth`],
  };
}

export function stressorCandidateForPressure(pressure, tick) {
  if (!pressure || pressure.score < 0.56) return null;
  const type = stressorTypesForPressure(pressure)[0];
  if (!type) return null;
  return candidateForTypeAndPressure(type, pressure, tick);
}

function existingStressorKeys(stressors = []) {
  const keys = new Set();
  for (const raw of stressors) {
    const stressor = normalizeStressor(raw);
    for (const id of stressor.affectedSettlementIds || []) keys.add(`${stressor.type}:${id}`);
  }
  return keys;
}

function spreadTargetsFor(snapshot, stressor) {
  const graph = snapshot?.regionalGraph;
  if (!graph) return [];
  const affected = new Set((stressor.affectedSettlementIds || []).map(String));
  const types = [...new Set((stressor.spreadChannels || []).map(canonicalSpreadChannel).filter(Boolean))];
  if (!types.length) return [];
  const targets = [];
  // Confirmed, directed channels only — suggested channels never propagate
  // (design principle). A crisis flows outward from each affected settlement
  // along its outgoing channels of a matching type.
  for (const sourceId of affected) {
    for (const channel of activeChannelsFrom(graph, sourceId, { types })) {
      const to = String(channel.to);
      if (to && !affected.has(to)) targets.push(to);
    }
  }
  return [...new Set(targets)];
}

export function evaluateStressorRules(snapshot, pressureIdx, context = {}) {
  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const pressures = context.pressures || [];
  const currentStressors = (snapshot?.worldState?.stressors || []).map(normalizeStressor);
  const existingKeys = existingStressorKeys(currentStressors);
  const candidates = [];

  for (const pressure of pressures) {
    for (const type of stressorTypesForPressure(pressure)) {
      const targetKey = `${type}:${pressure.settlementId}`;
      if (existingKeys.has(targetKey)) continue;
      candidates.push(candidateForTypeAndPressure(type, pressure, tick));
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

    if (stressor.severity > 0.42) {
      for (const targetSaveId of spreadTargetsFor(snapshot, stressor).slice(0, 3)) {
        const targetKey = `${stressor.type}:${targetSaveId}`;
        if (existingKeys.has(targetKey)) continue;
        const spreadSeverity = clamp01(stressor.severity * 0.72);
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
          applyMode: spreadSeverity >= 0.78 ? 'proposal' : 'auto',
          headline: `${stressor.label} may spread`,
          summary: `${stressor.label} can move through ${stressor.spreadChannels.slice(0, 2).join(' and ').replace(/_/g, ' ')} channels.`,
          reasons: [
            `${stressor.label} is active at severity ${stressor.severity.toFixed(2)}.`,
            `A plausible spread channel reaches another settlement.`,
          ],
          stressor: normalizeStressor({
            ...stressor,
            severity: Math.max(stressor.severity, spreadSeverity),
            affectedSettlementIds: [...new Set([...(stressor.affectedSettlementIds || []), targetSaveId])],
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
