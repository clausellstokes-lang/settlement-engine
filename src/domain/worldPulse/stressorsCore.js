/**
 * domain/worldPulse/stressorsCore.js — the FIRST-PAINT-SAFE stressor leaf.
 *
 * The sync store event/tick path (crisisLifecycle, stressorPicker) and the
 * campaign world-pulse slices need the stressor CATALOG + a handful of pure,
 * light transforms (normalizeStressor / resolveStressorById / echoOf) on first
 * paint. The full stressors.js additionally pulls the heavy evaluation
 * machinery — stressorDynamics.js (counterforce/synergy) + stressorGates.js
 * (spawn gates) + the region graph — which is ONLY exercised by the lazy
 * world-engine (advanceCampaignWorld → pulseKernel/candidateEvents, loaded via
 * loadWorldEngine). Importing stressors.js from an eager module therefore
 * dragged ~77 kB of that machinery into first paint.
 *
 * This leaf holds exactly the light exports + their private helpers, and imports
 * NOTHING heavy (only stablePart + the stressorSeverity leaf). stressors.js
 * re-exports these so every existing `from './stressors.js'` importer is
 * unchanged; the four EAGER consumers import from HERE instead, so the heavy
 * machinery stays lazy. @enforced-by tests/build/vendorPdfLazy.test.js.
 *
 * Extracted from stressors.js (pure relocation — zero logic change). The
 * SPREAD_CHANNEL_ALIASES / canonicalSpreadChannel (region-dependent) and every
 * function that consumes stressorDynamics/stressorGates stay in stressors.js.
 */
import { stablePart } from './stablePart.js';
import { clamp01, effectiveStressorSeverity } from './stressorSeverity.js';

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

/** @param {any} map */
function normalizeSeverityMap(map) {
  if (!map || typeof map !== 'object') return null;
  /** @type {Record<string, number>} */
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
/** @param {any} stressor */
export function idFor(stressor) {
  return stressor.id || [
    'world_stressor',
    stablePart(stressor.type),
    stablePart(stressor.originSettlementId || stressor.originRegion || 'realm'),
  ].join('.');
}

/** @param {any} type */
export function catalogFor(type) {
  return /** @type {any} */ (/** @type {any} */ (STRESSOR_CATALOG)[type] || {
    label: String(type || 'Regional pressure').replace(/_/g, ' '),
    durationPolicy: 'episodic',
    pressureKinds: [],
    birthThreshold: 0.65,
    spreadChannels: [],
    residualEffects: ['local_scars'],
    affectedSystems: ['public_legitimacy'],
  });
}

/** @param {any} stressor */
function lifecycleStageFor(stressor) {
  if (stressor.status === 'resolved') return 'resolved';
  if (stressor.status === 'residual') return 'residual';
  if (stressor.status === 'dormant') return 'dormant';
  if (stressor.severity >= 0.72) return 'peaking';
  if (stressor.severity <= 0.24 && stressor.age > 0) return 'easing';
  if (stressor.age <= 1) return 'emerging';
  return 'active';
}

/** @param {any} [stressor] */
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
    decayRate: clamp01(stressor.decayRate ?? /** @type {any} */ (STRESSOR_POLICIES)[durationPolicy]?.decay ?? 0.08),
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

// The catalog's affectedSystems were authored with a looser vocabulary than
// causalState.SYSTEM_VARIABLES — faction_stability / law_order / tax_revenue
// are not real causal variables, so residual conditions carrying them silently
// no-op'd against the substrate. Map them onto the nearest real variable at
// emission time (catalog keeps its semantic names).
// Exported so the string-coupling registry can pin crisisLifecycle's hand-mirrored
// copy (STRESSOR_SYSTEM_ALIASES) as byte-identical to this canonical table.
export const CAUSAL_SYSTEM_ALIASES = Object.freeze({
  faction_stability: 'faction_power',
  law_order: 'criminal_opportunity', // lawless interregnum -> opportunists move in
  tax_revenue: 'trade_connectivity',
});

/** @param {any[]} [systems] */
export function canonicalAffectedSystems(systems = []) {
  return [...new Set(systems.map(name => /** @type {any} */ (CAUSAL_SYSTEM_ALIASES)[name] || name))];
}

/**
 * @param {any} stressor
 * @param {any} tick
 */
export function residualOutcome(stressor, tick) {
  const targetIds = stressor.affectedSettlementIds || [];
  const defaults = catalogFor(stressor.type);
  return targetIds.map((/** @type {any} */ targetSaveId) => {
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
 * Mint the residual ECHO (living memory) of a resolved crisis. Exported for a focused
 * unit test of the footprint-collapse invariant.
 * @param {any} resolvedStressor
 * @param {any} now
 */
export function echoOf(resolvedStressor, now) {
  const originId = resolvedStressor.originSettlementId
    || (resolvedStressor.affectedSettlementIds || [])[0]
    || null;
  return normalizeStressor({
    ...resolvedStressor,
    // Canonical id (type + origin), even when the live stressor carried a
    // decorated id (e.g. rebellion births suffix the tick): echoes of the
    // same crisis at the same origin must coalesce, and a re-ignition must
    // overwrite the echo via the byId upsert instead of stacking beside it.
    id: idFor({ type: resolvedStressor.type, originSettlementId: originId }),
    status: 'residual',
    lifecycleStage: 'residual',
    // COLLAPSE THE FOOTPRINT TO THE ORIGIN. A live crisis spreads to neighbours at an
    // ATTENUATED severity; its resolved echo is a MEMORY, and a memory must not keep
    // participating in cross-settlement synergyAssessment at every settlement it once
    // brushed. Carrying the full affectedSettlementIds/severityBySettlement forward let a
    // resolved famine keep amplifying a later disease_outbreak at a distant spread target
    // where the famine was never at origin strength. The memory lives where the crisis
    // was born; severity is governed uniformly by memoryStrength (severityBySettlement
    // cleared so no attenuated spread value lingers as a synergy companion).
    affectedSettlementIds: originId ? [originId] : (resolvedStressor.affectedSettlementIds || []),
    severityBySettlement: null,
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
