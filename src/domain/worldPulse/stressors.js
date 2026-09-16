import { stablePart } from './worldState.js';
import { activeChannelsFrom, REGIONAL_CHANNEL_TYPES } from '../region/index.js';
import { normalizeSimulationRules } from './simulationRules.js';
import { counterforceAssessment, synergyAssessment, interpretStressorOrigin } from './stressorDynamics.js';
import { STRESSOR_SPAWN_GATES } from './stressorGates.js';

// ── First-paint leaf (relocated) ─────────────────────────────────────────
// The catalog + light transforms live in stressorsCore.js so eager consumers
// don't drag stressorDynamics/stressorGates into first paint. Imported here as
// LOCAL bindings (the heavy functions below call them) and re-exported so every
// existing `from './stressors.js'` importer is unchanged. See that file's header.
import {
  STRESSOR_POLICIES, STRESSOR_CATALOG, idFor, catalogFor,
  normalizeStressor, canonicalAffectedSystems, residualOutcome, echoOf,
} from './stressorsCore.js';
export {
  STRESSOR_LIFECYCLE_STAGES, CAUSAL_SYSTEM_ALIASES, resolveStressorById,
} from './stressorsCore.js';
export { STRESSOR_POLICIES, STRESSOR_CATALOG, normalizeStressor, echoOf };


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

/**
 * Map a stressor spread-channel name onto a canonical regional channel type, or null if unknown.
 * @param {any} name
 */
export function canonicalSpreadChannel(name) {
  const mapped = /** @type {any} */ (SPREAD_CHANNEL_ALIASES)[name] || name;
  return REGIONAL_CHANNEL_TYPES.includes(mapped) ? mapped : null;
}

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

// Pressure rows are analytic inputs shared by several engine lanes. A stressor
// receipt projects their recurring bookkeeping phrases into world sentences;
// the numeric score and typed kind stay on the candidate unchanged.
/** @type {Readonly<Record<string, string>>} */
const PRESSURE_REASON_SENTENCES = Object.freeze({
  'winter raises food pressure': 'The deep winter tightens the granaries.',
  'trade-dependent food access is strained': 'The town depends on food roads that no longer hold.',
  'a trade-dependency supplier is in a food crisis': 'A town that feeds this one is itself going hungry.',
  'housing pressure weakens containment': 'Crowded homes make sickness harder to contain.',
  'military regional channel exists': 'A military road reaches the settlement.',
  'a hostile neighbour relationship raises conflict pressure': 'A hostile neighbour keeps the border fearful.',
  'hostile, cold-war, or rival relationships are exerting pressure': 'Old rivalries and open hostility bear on the settlement.',
  'criminal opportunity drags on commerce': 'The underworld takes its share from honest commerce.',
  'war-front regional channel exists': 'The war front reaches the settlement.',
});

// Origin analysis carries exact provenance and, for some variants, contender
// weights or elapsed ticks. The receipt instead chooses from this closed
// vocabulary; originContext itself remains on the stressor as machine evidence.
/** @type {Readonly<Record<string, string>>} */
const ORIGIN_REASON_SENTENCES = Object.freeze({
  foreign_sponsored: 'A hostile neighbour has every motive to sponsor treachery.',
  abandoned_agent: 'The old handler is gone, but the planted agent remains.',
  internal_conspiracy: 'No foreign hand is evident; the knife came from inside.',
  declared_war: 'An openly hostile neighbour stands behind the pressure.',
  unattributed: 'No neighbouring court claims the attack; the force remains unnamed.',
  resistance: 'Occupation has turned unrest into organized resistance.',
  servile_uprising: 'Bound and broken labour rises against those who hold it.',
  tax_revolt: 'The levies of a drowning treasury have broken the commons.',
  popular_revolt: 'The streets have risen on their own, before any faction can claim them.',
  arcane_burnout: 'A wild surge burned itself out and left dead ground behind.',
  leyline_silence: 'The leylines have gone quiet, and no one yet knows why.',
  barracks_coup: 'The barracks have found a commander willing to gamble for the seat.',
  merchant_cabal: 'The counting houses have joined their purses against the seat.',
  temple_putsch: 'The temples have chosen a champion against the ruling seat.',
  palace_coup: 'A rival court has gathered enough allies to reach for the seat.',
  arcane_ascendancy: 'The arcane houses have chosen a champion against the ruling seat.',
  council_schism: 'The governing council has split, and one side now reaches for the seat.',
});

const READER_MODEL_TOKEN = /(?:\d+(?:\.\d+)?\s*%|\b\d+\.\d+\b|×|\b(?:score|chance|roll|multiplier|weight|gate|causal state|regional channel|ticks?)\b|[_→])/i;

/** @param {unknown} value */
function upperFirst(value) {
  const text = String(value || '').trim();
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : '';
}

/** @param {{ reasons?: unknown[], label?: unknown }|null|undefined} pressure */
function readerPressureReasons(pressure) {
  return (Array.isArray(pressure?.reasons) ? pressure.reasons : []).map((/** @type {unknown} */ raw) => {
    const reason = String(raw || '').trim();
    const active = /^active condition:\s*(.+)$/i.exec(reason);
    if (active) return `${upperFirst(active[1])} already burdens the settlement.`;
    if (/ derived from causal state$/i.test(reason)) {
      return `The settlement's present condition makes ${String(pressure?.label || 'the danger').toLowerCase()} plain to see.`;
    }
    return PRESSURE_REASON_SENTENCES[reason]
      || `The settlement's present condition gives ${String(pressure?.label || 'the danger').toLowerCase()} room to grow.`;
  }).filter(Boolean);
}

/** @param {{ reasons?: unknown[] }|null|undefined} gate @param {string} label */
function readerGateReasons(gate, label) {
  const reasons = Array.isArray(gate?.reasons) ? gate.reasons : [];
  return reasons.map((/** @type {unknown} */ raw) => {
    const reason = String(raw || '').trim();
    if (reason && !READER_MODEL_TOKEN.test(reason)) return reason;
    return `Conditions here give ${String(label || 'the crisis').toLowerCase()} room to take root.`;
  }).filter(Boolean);
}

/** @param {{ variant?: string }|null|undefined} originContext */
function readerOriginReasons(originContext) {
  if (!originContext) return [];
  const variant = String(originContext.variant || '');
  return [ORIGIN_REASON_SENTENCES[variant]
    || 'The crisis has found roots in the settlement, though its first cause remains uncertain.'];
}

/**
 * @param {any} stressor
 * @param {any} snapshot
 * @param {any} [assessment]
 */
function resolutionChance(stressor, snapshot, assessment = undefined) {
  const policy = /** @type {any} */ (STRESSOR_POLICIES)[stressor.durationPolicy] || STRESSOR_POLICIES.episodic;
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

/**
 * The resolution receipt — why a crisis ended, in the same explainable terms
 * the rest of the engine uses. Built from the live counterforce assessment
 * (its per-source breakdown names the strengths that led the recovery) and
 * the synergy table (the companions it ended despite).
 * @param {any} stressor
 * @param {any} assessment
 * @param {any} synergy
 */
function resolutionContextFor(stressor, assessment, synergy) {
  const leadingSources = (assessment?.sourceBreakdown || [])
    .filter((/** @type {any} */ source) => source.value >= 0.6)
    .sort((/** @type {any} */ a, /** @type {any} */ b) => b.value - a.value)
    .slice(0, 3)
    .map((/** @type {any} */ source) => ({ source: source.label, value: Math.round(source.value * 100) / 100 }));
  const companions = synergy?.companions || [];
  const narrative = [
    leadingSources.length
      ? `Recovery led by ${leadingSources.map((/** @type {any} */ s) => `${s.source} (${s.value})`).join(', ')}.`
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

/**
 * @param {any} stressor
 * @param {any} vacatedSaveId
 * @param {any} tick
 */
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

/**
 * @param {any} stressor
 * @param {any} wander
 * @param {any} snapshot
 * @param {any} rng
 * @param {any} tick
 * @param {any} now
 */
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

/**
 * @param {any[]} stressors
 * @param {any} snapshot
 * @param {any} rng
 * @param {any} [options]
 */
export function ageRoamingStressors(stressors = [], snapshot, rng, options = {}) {
  const tick = options.tick ?? 0;
  /** @type {any[]} */
  const active = [];
  /** @type {any[]} */
  const resolved = [];
  /** @type {any[]} */
  const residualOutcomes = [];
  /** @type {any[]} */
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

/** @param {any} pressure */
function stressorTypesForPressure(pressure) {
  return Object.entries(STRESSOR_CATALOG)
    // Deprecated types (slave_revolt) never birth organically — they remain
    // in the catalog only for legacy saves and deliberate DM authoring.
    .filter(([, rule]) => !('deprecated' in rule && rule.deprecated))
    .filter(([, rule]) => (rule.pressureKinds || []).includes(pressure.kind) && pressure.score >= rule.birthThreshold)
    .map(([type]) => type);
}

/**
 * @param {any} type
 * @param {any} pressure
 * @param {any} tick
 * @param {any} [extras]
 */
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
    summary: `${stressor.label} is beginning to take root in ${pressure.settlementName}.`,
    reasons: [
      ...readerPressureReasons(pressure),
      `${defaults.label} has found enough ${pressure.label.toLowerCase()} to take root.`,
      ...readerGateReasons(gate, defaults.label),
      ...(echo ? [`The last ${stressor.label.toLowerCase()} remains in living memory, and the old wound opens more readily.`] : []),
      ...readerOriginReasons(originContext),
    ],
    stressor,
    metadata: {
      lifecycleStage: stressor.lifecycleStage,
      durationPolicy: stressor.durationPolicy,
      spreadChannels: stressor.spreadChannels,
      residualEffects: stressor.residualEffects,
      pressureEvidence: {
        kind: String(pressure.kind || ''),
        score: clamp01(Number(pressure.score) || 0),
        sourceNotes: (Array.isArray(pressure.reasons) ? pressure.reasons : []).map(String),
      },
      ...(gate ? {
        gateEvidence: {
          probabilityMult: Number.isFinite(gate.probabilityMult) ? gate.probabilityMult : 1,
          sourceNotes: (Array.isArray(gate.reasons) ? gate.reasons : []).map(String),
        },
      } : {}),
      ...(originContext ? {
        originVariant: originContext.variant,
        originEvidence: {
          variant: originContext.variant,
          interpretedAtTick: originContext.interpretedAtTick,
          sourceNote: String(originContext.reason || ''),
        },
      } : {}),
    },
    conflictTags: [`stressor:${type}:${targetSaveId}`, `settlement:${targetSaveId}:stressor_birth`],
  };
}

/**
 * @param {any} pressure
 * @param {any} tick
 */
export function stressorCandidateForPressure(pressure, tick) {
  if (!pressure || pressure.score < 0.56) return null;
  // Gates that can hard-block need the world snapshot to read their context;
  // this snapshot-less path conservatively skips those types (the coup always
  // behaved so). Gradient-only gates are simply not applied here.
  const type = stressorTypesForPressure(pressure).filter(t => !(/** @type {any} */ (STRESSOR_SPAWN_GATES)[t])?.requiresSnapshot)[0];
  if (!type) return null;
  return candidateForTypeAndPressure(type, pressure, tick);
}

const INACTIVE_STATUSES = new Set(['resolved', 'dormant', 'residual']);

/** @param {any[]} [stressors] */
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

/** @param {any[]} [stressors] */
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

/**
 * @param {any} snapshot
 * @param {any} stressor
 */
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

/**
 * @param {any} snapshot
 * @param {any} pressureIdx
 * @param {any} [context]
 */
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
    currentStressors.filter((/** @type {any} */ s) => !INACTIVE_STATUSES.has(s.status)).map((/** @type {any} */ s) => s.id));

  for (const pressure of pressures) {
    for (const type of stressorTypesForPressure(pressure)) {
      const targetKey = `${type}:${pressure.settlementId}`;
      if (existingKeys.has(targetKey)) continue;
      if (activeIds.has(idFor({ type, originSettlementId: String(pressure.settlementId) }))) continue;
      // Organic birth gates (stressorGates.js): the gate can block the spawn
      // entirely or scale its odds; its reasons land on the candidate.
      const spawnGate = /** @type {any} */ (STRESSOR_SPAWN_GATES)[type];
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
    // Escalation must reflect pressure where the crisis is at FULL record severity — the
    // ORIGIN — not the whole spread footprint. Spread targets hold the crisis at an
    // attenuated severity, so scanning their independent local pressure let a distant,
    // heavily-pressured spread-target escalate the crisis at the origin it merely caught a
    // spread of. (A spread target with its own high pressure spawns/escalates its OWN
    // record via the pressure→candidate loop above.) Restrict the scan to the origin.
    const escalationOriginId = stressor.originSettlementId || (stressor.affectedSettlementIds || [])[0];
    const strongestPressure = (defaults.pressureKinds || [])
      .map((/** @type {any} */ kind) => pressureIdx.get?.(escalationOriginId, kind)?.score || 0)
      .reduce((/** @type {any} */ max, /** @type {any} */ score) => Math.max(max, score), 0);

    // Precedence (intra-tick decay→escalate): this loop runs AFTER ageRoamingStressors
    // has already decayed stressor.severity for the tick (pulseKernel writes the aged
    // stressors, then builds the snapshot this reads). Reading the POST-AGED severity is
    // deliberate — escalation compounds on the decayed baseline, so the damped blend below
    // never double-counts the pre-tick value. The blend is convergent (gated at < 0.92,
    // then clamp01), so decay and escalation share this field without diverging.
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
        summary: `${stressor.label} has not broken, and the forces feeding it are still gathering.`,
        reasons: [
          `${stressor.label} still grips the settlement.`,
          'The same forces that birthed the crisis continue to rise.',
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
          summary: `${stressor.label} can reach another settlement through the roads and ties that carry it, though it arrives with less force.`,
          reasons: [
            `${stressor.label} still bears down hard at its source.`,
            'A path to another settlement lies open, and distance dulls the blow.',
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
