/**
 * domain/worldPulse/relationshipEvolution.js — the relationship-evolution
 * orchestrator: the rule matrix, the relationship-state ensure/relax lifecycle,
 * and the public API (buildPressureSummary, evaluateRelationshipRules,
 * deriveRelationshipCandidates, applyRelationshipPatch). The per-type rule
 * evaluators live in relationshipRulesCore.js / relationshipRulesAdversarial.js
 * over the relationshipRuleHelpers.js leaf — this module wires them together.
 *
 * The relationship-state CORE lives in relationshipState.js (broke the
 * relationshipEvolution ↔ relationshipHierarchy cycle); re-exported here so
 * existing importers keep working unchanged. Helper symbols that were part of
 * this module's public surface (candidateDirection, settlementStrength,
 * signed*Factor) are re-exported from the helper leaf for the same reason.
 */
import { clamp01, RELATIONSHIP_DEFAULTS, relationshipKeyFromEdge, getRelationshipSettlements, normalizeRelationshipEdge, ensureRelationshipState } from './relationshipState.js';
import { pressureFor, strongestPressure, EMPTY_DISPOSITION, EMPTY_TRADE_SALIENCE, buildRelationshipIndex, sharedEnemyAllianceCandidate } from './relationshipRuleHelpers.js';
import { RULE_EVALUATORS, tradeLeverageCandidate } from './relationshipRulesAdversarial.js';

export {
  RELATIONSHIP_TYPE_ALIASES, normalizeRelationshipType,
  relationshipKeyFromEdge, getRelationshipSettlements, relationshipRoles,
  normalizeRelationshipEdge, ensureRelationshipState,
} from './relationshipState.js';
export {
  candidateDirection, signedDispositionFactor, signedTradeSalienceFactor, settlementStrength,
} from './relationshipRuleHelpers.js';

export const RELATIONSHIP_RULE_MATRIX = {
  neutral: [
    "neutral_to_trade_partner",
    "neutral_to_rival",
    "neutral_border_incident",
    "neutral_to_patronage",
  ],
  trade_partner: [
    "trade_to_allied",
    "trade_to_patron_client",
    "trade_route_disruption",
    "trade_smuggling_pressure",
  ],
  allied: [
    "allied_aid_buffer",
    "allied_conflict_obligation",
    "allied_overburdened",
    "allied_shared_recovery",
  ],
  patron: [
    "patron_extracts_tribute",
    "patron_intervenes",
    "patron_overreach",
    "patron_to_hostile",
  ],
  client: [
    "client_compliance",
    "client_autonomy_bid",
    "client_appeals_for_protection",
    "client_debt_spiral",
  ],
  vassal: [
    "vassal_tribute_extraction",
    "vassal_protection_burden",
    "vassal_stability_compact",
    "vassal_rebellion_pressure",
    "vassal_rebellion_resolution",
  ],
  rival: [
    "rival_arms_race",
    "rival_sabotage",
    "rival_to_cold_war_or_hostile",
    "rival_detente",
  ],
  cold_war: [
    "cold_war_espionage",
    "cold_war_proxy_conflict",
    "cold_war_escalation",
    "cold_war_thaw",
  ],
  hostile: [
    "hostile_raid",
    "hostile_occupation_pressure",
    "hostile_forced_tribute",
    "hostile_truce",
  ],
  criminal_network: [
    "criminal_smuggling_expands",
    "criminal_protection_racket",
    "criminal_to_cold_war",
    "criminal_legitimizes_trade",
  ],
};

export function ensureRelationshipStatesForGraph(graph = { edges: [] }, /** @type {any} */ existingStates = {}) {
  return Object.fromEntries(
    (graph.edges || []).map((edge) => {
      const key = relationshipKeyFromEdge(edge);
      return [key, ensureRelationshipState(normalizeRelationshipEdge(edge), existingStates[key])];
    }),
  );
}

export function ensureAllRelationshipStates(/** @type {any} */ worldState, /** @type {any} */ snapshot) {
  return {
    ...worldState,
    relationshipStates: ensureRelationshipStatesForGraph(
      snapshot?.regionalGraph || { edges: [] },
      worldState?.relationshipStates || {},
    ),
  };
}

// Per-tick mean-reversion: trust / resentment / fear drift back toward the
// relationship type's baseline vector on quiet ticks, so a one-off incident
// doesn't leave two settlements permanently maxed-out. RELAX is the fraction
// of the gap to baseline closed each tick.
const RELATIONSHIP_RELAX = 0.12;

export function relaxRelationshipStates(/** @type {any} */ worldState) {
  const relationshipStates = { ...(worldState?.relationshipStates || {}) };
  for (const [key, s] of Object.entries(/** @type {any} */ (relationshipStates))) {
    const base = RELATIONSHIP_DEFAULTS[s.relationshipType] || RELATIONSHIP_DEFAULTS.neutral;
    const toward = (/** @type {any} */ cur, /** @type {any} */ target) => clamp01((cur ?? target) + (target - (cur ?? target)) * RELATIONSHIP_RELAX);
    relationshipStates[key] = {
      ...s,
      trust: toward(s.trust, base.trust),
      resentment: toward(s.resentment, base.resentment),
      fear: toward(s.fear, base.fear),
    };
  }
  return { ...worldState, relationshipStates };
}

// Exported for the war layer: builds the {conflict,trade,legitimacy,
// economy,...} summary settlementStrength reads, so the deploy gate consumes the
// identical pressure vector the relationship rules do.
export function buildPressureSummary(/** @type {any} */ pressureIdx, /** @type {any} */ saveId) {
  return {
    food: pressureFor(pressureIdx, saveId, "food"),
    disease: pressureFor(pressureIdx, saveId, "disease"),
    conflict: strongestPressure(pressureIdx, saveId, ["conflict", "war", "defense"]),
    hostility: pressureFor(pressureIdx, saveId, "hostility"),
    trade: pressureFor(pressureIdx, saveId, "trade"),
    legitimacy: pressureFor(pressureIdx, saveId, "legitimacy"),
    crime: pressureFor(pressureIdx, saveId, "crime"),
    economy: pressureFor(pressureIdx, saveId, "economy"),
    defense: pressureFor(pressureIdx, saveId, "defense"),
  };
}

export function evaluateRelationshipRules(/** @type {any} */ snapshot, /** @type {any} */ pressureIdx, /** @type {any} */ context = {}) {
  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const states = snapshot?.worldState?.relationshipStates || {};
  // Build the per-tick relationship index ONCE: the candidate helpers
  // (protectorBackingScore, relationshipThirdParties, sharedHostileThird,
  // relationshipTypeBetween) read from it via ctx.relIndex instead of each
  // rescanning the full edge list — collapsing the pass from O(E^2)–O(E^3) to
  // ~O(E·avgDegree) with one ensureRelationshipState allocation per edge.
  const relIndex = buildRelationshipIndex(snapshot);

  return (snapshot?.regionalGraph?.edges || snapshot?.relationships || []).flatMap((/** @type {any} */ edge) => {
    const key = relationshipKeyFromEdge(edge);
    const normalizedEdge = normalizeRelationshipEdge(edge);
    const relState = ensureRelationshipState(normalizedEdge, states[key]);
    const evaluator = /** @type {any} */ (RULE_EVALUATORS)[relState.relationshipType] || RULE_EVALUATORS.neutral;
    const settlements = getRelationshipSettlements(normalizedEdge);
    const sourcePressure = buildPressureSummary(pressureIdx, settlements.from);
    const targetPressure = buildPressureSummary(pressureIdx, settlements.to);
    const ctx = {
      edge: normalizedEdge,
      originalEdge: edge,
      relState,
      sourcePressure,
      targetPressure,
      pressureIdx,
      snapshot,
      // Precomputed per-tick adjacency / relationship-state / hostile-set index
      // shared by every candidate helper (see buildRelationshipIndex).
      relIndex,
      tick,
      // Per-settlement aggressiveness multipliers (centered on 1.0).
      // Empty/absent ⇒ every candidate factor is 1.0 ⇒ byte-identical legacy.
      dispositionFactor: context.dispositionFactor || EMPTY_DISPOSITION,
      // Per-EDGE trade-salience multipliers (centered on 1.0). A valuable
      // trade tie DAMPENS hostile/escalation candidates on that edge. Empty/absent
      // ⇒ 1.0 in every branch ⇒ byte-identical legacy (off-path map is empty).
      tradeSalienceFactor: context.tradeSalienceFactor || EMPTY_TRADE_SALIENCE,
      // Per-EDGE salience rollup ({ salience, critical, dependentId,
      // supplierId }) for the coercion/embargo cross-cutting rules. Absent/empty ⇒
      // the leverage rules emit nothing ⇒ byte-identical legacy.
      tradeSalienceInfo: /** @type {any} */ (context.tradeSalienceInfo || EMPTY_TRADE_SALIENCE)[key] || null,
    };
    return [
      ...evaluator(ctx),
      tradeLeverageCandidate(ctx),
      sharedEnemyAllianceCandidate(ctx),
    ].filter(Boolean);
  });
}

export function deriveRelationshipCandidates(/** @type {any} */ snapshot, /** @type {any} */ pressureIdx, /** @type {any} */ options = {}) {
  return evaluateRelationshipRules(snapshot, pressureIdx, options);
}

export function applyRelationshipPatch(/** @type {any} */ worldState, /** @type {any} */ outcome, /** @type {any} */ now) {
  if (!outcome.relationshipKey || !outcome.relationshipPatch) return worldState;
  const current = ensureRelationshipState({}, worldState.relationshipStates?.[outcome.relationshipKey]);
  const historyEntry = outcome.proposalPayload?.kind === "relationship_label_change"
    ? {
        tick: worldState.tick,
        type: "label_proposal_applied",
        // The outcome id rides every row this apply writes: a proposal
        // selected at tick T but accepted at T' lands its incident/history
        // rows at T', and relationship memory dedupes by outcome id first —
        // the pulseHistory record at T already scored this event.
        outcomeId: outcome.id || null,
        fromType: outcome.proposalPayload.fromType,
        toType: outcome.proposalPayload.toType,
        reason: outcome.proposalPayload.reason,
      }
    : null;
  const patch = { ...outcome.relationshipPatch };

  if (outcome.proposalPayload?.kind === "relationship_label_change") {
    patch.relationshipType = outcome.proposalPayload.toType;
    patch.proposedRelationshipType = null;
    patch.lastTransitionTick = worldState.tick;
    // Seniority stamps are only meaningful for the label that minted
    // them — a transition away from vassal/patron clears them so a later
    // re-subjugation can never inherit a stale senior side. A patch that
    // explicitly re-stamps (the subjugation itself) wins.
    if (outcome.proposalPayload.toType !== "vassal") {
      if (patch.overlordSaveId === undefined) patch.overlordSaveId = null;
      if (patch.vassalSaveId === undefined) patch.vassalSaveId = null;
    }
    if (outcome.proposalPayload.toType !== "patron") {
      if (patch.patronSaveId === undefined) patch.patronSaveId = null;
      if (patch.clientSaveId === undefined) patch.clientSaveId = null;
    }
  }

  const updated = {
    ...current,
    ...patch,
    trust: clamp01(patch.trust ?? current.trust),
    resentment: clamp01(patch.resentment ?? current.resentment),
    dependency: clamp01(patch.dependency ?? current.dependency),
    leverage: clamp01(patch.leverage ?? current.leverage),
    fear: clamp01(patch.fear ?? current.fear),
    tradeBalance: clamp01(patch.tradeBalance ?? current.tradeBalance),
    militaryBurden: clamp01(patch.militaryBurden ?? current.militaryBurden),
    aidBurden: clamp01(patch.aidBurden ?? current.aidBurden),
    obligationFatigue: clamp01(patch.obligationFatigue ?? current.obligationFatigue),
    pactStrength: clamp01(patch.pactStrength ?? current.pactStrength),
    updatedAt: now,
    recentIncidents: [
      ...(current.recentIncidents || []).slice(-7),
      {
        tick: worldState.tick,
        type: outcome.metadata?.incidentType || outcome.candidateType,
        severity: outcome.severity,
        outcomeId: outcome.id || null,
      },
    ],
    history: historyEntry ? [...(current.history || []).slice(-11), historyEntry] : current.history || [],
  };

  return {
    ...worldState,
    relationshipStates: {
      ...(worldState.relationshipStates || {}),
      [outcome.relationshipKey]: updated,
    },
  };
}
