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
import {
  appendRelationshipAllianceCall,
  appendRelationshipCoalitionSettlement,
  appendRelationshipTurningPoint,
  clamp01,
  coalitionSettlementActionWasRecorded,
  RELATIONSHIP_DEFAULTS,
  relationshipKeyFromEdge,
  getRelationshipSettlements,
  normalizeRelationshipEdge,
  ensureRelationshipState,
} from './relationshipState.js';
import { pressureFor, strongestPressure, EMPTY_DISPOSITION, EMPTY_TRADE_SALIENCE, buildRelationshipIndex, sharedEnemyAllianceCandidate } from './relationshipRuleHelpers.js';
import { RULE_EVALUATORS, tradeLeverageCandidate } from './relationshipRulesAdversarial.js';
import { facetOf } from '../spatial/cohesionWeave.js';
import { coalitionClosureWitness, joinAnchorOf, warCoalitionActive } from './warCoalitionLedger.js';

export {
  RELATIONSHIP_TYPE_ALIASES, normalizeRelationshipType,
  relationshipKeyFromEdge, getRelationshipSettlements, relationshipRoles,
  normalizeRelationshipEdge, ensureRelationshipState,
  appendRelationshipTurningPoint, RELATIONSHIP_TURNING_POINT_CAP,
  appendRelationshipAllianceCall, RELATIONSHIP_ALLIANCE_CALL_CAP, normalizeAllianceCalls,
  appendRelationshipCoalitionSettlement, coalitionSettlementActionWasRecorded,
  RELATIONSHIP_COALITION_SETTLEMENT_CAP, normalizeCoalitionSettlements,
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

// ── D5 LIFESPAN-SCALED MEMORY (DESIGN_SIM_DEPTH_R2 §D5) ──────────────────────
// The memory horizon derives from the settlement's demographic character via THE
// FACET LAW (facetOf), never a hardcoded human clock. Each band is a bounded
// multiplier on the memory LENGTH; the mean-reversion RATE scales INVERSELY
// (a long-memoried pair reverts toward baseline slower; an undying court never
// forgets via time). BOTH SIGNS scale — trust/warmth AND resentment/grievance
// relax by the same band (the unification law). generational === 1.0 ⇒ relax
// is byte-identical to today (0.12/1 === 0.12), so an undeclared world is
// unchanged (dormancy by construction — no flag needed). undying ⇒ Infinity ⇒
// relax 0: no generational decay, only event-driven erosion through the
// reconciliation/climb-down lane (applyRelationshipPatch, which D5 never scales).
export const MEMORY_HORIZON_BANDS = Object.freeze({
  fleeting: 0.5,
  generational: 1,
  long: 3,
  undying: Infinity,
});
export const DEFAULT_MEMORY_HORIZON_BAND = 'generational';

/** The declared/inferred/default memory band for a settlement (facet-law compliant,
 *  clamped to the band table — an unrecognized declaration falls back to the default).
 * @param {Parameters<typeof facetOf>[0]} settlement @returns {string} */
export function memoryHorizonBandOf(settlement) {
  const band = facetOf(settlement, 'memoryHorizon');
  return typeof band === 'string' && Object.prototype.hasOwnProperty.call(MEMORY_HORIZON_BANDS, band)
    ? band
    : DEFAULT_MEMORY_HORIZON_BAND;
}

/** The horizon (memory-length) multiplier for a settlement. Default band ⇒ 1 (byte-identical).
 * @param {Parameters<typeof facetOf>[0]} settlement @returns {number} */
export function memoryHorizonMultiplierOf(settlement) {
  return MEMORY_HORIZON_BANDS[/** @type {keyof typeof MEMORY_HORIZON_BANDS} */ (memoryHorizonBandOf(settlement))];
}

/** Combine the two endpoints' horizons into the shared edge's horizon: the LONGER
 *  memory keeps the ledger open (the elves remember the broken treaty long after the
 *  men who broke it are dust — DESIGN_SIM_DEPTH_R2 §D5). @param {number} a @param {number} b */
export function combineMemoryHorizon(a, b) {
  return Math.max(a, b);
}

/**
 * Build a per-relationship-edge memory-horizon multiplier resolver over a world snapshot
 * (D5). The edge's horizon combines its two endpoints' bands (the longer memory keeps the
 * ledger open). Every settlement defaults to 'generational' (multiplier 1), so an
 * undeclared world resolves every key to 1 ⇒ relaxRelationshipStates is byte-identical to
 * its pre-D5 fixed 12%/tick reversion. Pure; zero writes.
 * @param {{ regionalGraph?: { edges?: ReadonlyArray<{ id?: unknown, from?: unknown, to?: unknown }> }, byId?: { get?: (k: string) => ({ settlement?: unknown }|null|undefined) } }|null|undefined} snapshot
 * @returns {(key: string) => number}
 */
export function buildMemoryHorizonResolver(snapshot) {
  /** @type {Map<string, { from: unknown, to: unknown }>} */
  const endpointsByKey = new Map();
  for (const edge of snapshot?.regionalGraph?.edges || []) {
    const key = edge?.id;
    if (key != null) endpointsByKey.set(String(key), { from: edge.from, to: edge.to });
  }
  const byId = snapshot?.byId;
  const multOf = (/** @type {unknown} */ id) => {
    const item = byId?.get?.(String(id));
    return memoryHorizonMultiplierOf(/** @type {Parameters<typeof facetOf>[0]} */ (item?.settlement ?? item));
  };
  return (/** @type {string} */ key) => {
    const ep = endpointsByKey.get(String(key));
    if (!ep) return 1;
    return combineMemoryHorizon(multOf(ep.from), multOf(ep.to));
  };
}

/**
 * @param {((key: string) => number)|null} [horizonForKey] optional per-edge memory-horizon
 *   multiplier resolver (D5). Absent (or a resolver returning 1) ⇒ generational ⇒
 *   byte-identical to the pre-D5 fixed 12%/tick reversion.
 */
export function relaxRelationshipStates(/** @type {any} */ worldState, horizonForKey = null) {
  const relationshipStates = { ...(worldState?.relationshipStates || {}) };
  for (const [key, s] of Object.entries(/** @type {any} */ (relationshipStates))) {
    const base = RELATIONSHIP_DEFAULTS[s.relationshipType] || RELATIONSHIP_DEFAULTS.neutral;
    // D5: rate = RELAX / horizon. horizon 1 ⇒ 0.12 exactly (byte-identical);
    // Infinity (undying) ⇒ 0 (no time reversion); >1 (long) slower; <1 (fleeting) faster.
    const horizon = horizonForKey ? horizonForKey(String(key)) : 1;
    const relax = horizon > 0 ? RELATIONSHIP_RELAX / horizon : RELATIONSHIP_RELAX;
    const toward = (/** @type {any} */ cur, /** @type {any} */ target) => clamp01((cur ?? target) + (target - (cur ?? target)) * relax);
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

// ── THE MEMORY WEAVE (D-7) — the virtual flag, the typed-incident vocabulary, the
//    sanctioned incident applicator, and the pair→edge-key resolver ───────────────
/**
 * Is THE MEMORY WEAVE lit? Reads simulationRules.memoryWeaveEnabled === true,
 * defensively — ABSENT ⇒ false ⇒ DORMANT (the eighth virtual flag; NO entry in
 * DEFAULT_SIMULATION_RULES, so goldens do not move). The ghost wirings (D-7b), the
 * symmetric bonds/faction-pair ledgers (D-7c/e), the generosity bond loop, and the
 * elite bleed (D-7f) all AND their host's own flag with this one, so a lit host
 * with the weave dark stays byte-identical. Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState
 * @returns {boolean}
 */
export function memoryWeaveActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).memoryWeaveEnabled === true);
}

/**
 * The typed decaying incidents the memory weave mints on the settlement plane
 * (all through applyRelationshipPatch — the plane's own writer). Each is caught by
 * the grievanceRead revanchism clone's wound set; route_seized/rite_imposed match
 * /seiz/ and /impos/, elite_feud/elite_amity ride the D-7f bleed's crossing marks.
 */
export const MEMORY_WEAVE_INCIDENT_TYPES = Object.freeze({
  ROUTE_SEIZED: 'route_seized',   // D-7b (POST-ROADS-FOLD host): a seizer↔victim route capture
  RITE_IMPOSED: 'rite_imposed',   // D-7b: an overlord↔vassal rite imposition (host live on this base)
  ELITE_FEUD: 'elite_feud',       // D-7f: a cross-border elite feud crossing (settlement pair cools)
  ELITE_AMITY: 'elite_amity',     // D-7f: a cross-border elite amity crossing (settlement pair warms)
});

/**
 * The relationship-edge key for the pair (a, b), or null when no edge connects
 * them in the regional graph (⇒ a byte-safe no-op — the peaceTerms edgeKeyBetween
 * idiom, exported here for reuse by the memory-weave ghost wirings and the bleed).
 * @param {ReadonlyArray<{ from?: unknown, to?: unknown, id?: unknown }>|null|undefined} edges
 * @param {string} a @param {string} b @returns {string|null}
 */
export function edgeKeyBetween(edges, a, b) {
  for (const edge of Array.isArray(edges) ? edges : []) {
    const f = edge?.from != null ? String(edge.from) : '';
    const t = edge?.to != null ? String(edge.to) : '';
    if ((f === a && t === b) || (f === b && t === a)) return relationshipKeyFromEdge(edge);
  }
  return null;
}

/**
 * Mint a typed MEMORY-WEAVE incident on a settlement-pair edge through the plane's
 * ONE writer (applyRelationshipPatch — law 13's sanctioned applicator idiom, exactly
 * like applyLegitimacyHits). The caller has already gated on memoryWeaveActive ∧ its
 * host flag and resolved the (bounded, clamped) scalar patch; this is the single
 * chokepoint every ghost wiring and the elite bleed pass through — no hand-editing
 * of relationshipStates anywhere. No key / no patch ⇒ a byte-safe no-op.
 * @param {any} worldState
 * @param {{ relationshipKey: string|null, incidentType: string, patch: Record<string, number>, severity?: number, id?: string|null }} spec
 * @param {any} now
 * @returns {any}
 */
export function mintMemoryWeaveIncident(worldState, { relationshipKey, incidentType, patch, severity, id }, now) {
  if (!relationshipKey || !patch || typeof patch !== 'object') return worldState;
  return applyRelationshipPatch(worldState, {
    relationshipKey,
    relationshipPatch: patch,
    metadata: { incidentType },
    severity: Number.isFinite(severity) ? severity : 0.3,
    id: id || null,
    proposalPayload: null,
  }, now);
}

export function applyRelationshipPatch(/** @type {any} */ worldState, /** @type {any} */ outcome, /** @type {any} */ now) {
  if (!outcome.relationshipKey || !outcome.relationshipPatch) return worldState;
  const current = ensureRelationshipState({}, worldState.relationshipStates?.[outcome.relationshipKey]);
  // WR-6 exact-once: an applied approval can be replayed, but the same alliance
  // call may never erode the relationship twice or duplicate its durable fact.
  const allianceCall = outcome.metadata?.allianceCall;
  if (allianceCall && String(allianceCall.relationshipKey || '') !== String(outcome.relationshipKey)) return worldState;
  if (allianceCall?.callId && (current.allianceCalls || [])
    .some((row) => String(row?.callId || '') === String(allianceCall.callId)
      && String(row?.relationshipKey || '') === String(outcome.relationshipKey))) return worldState;
  const nextAllianceCalls = allianceCall
    ? appendRelationshipAllianceCall(current, allianceCall)
    : null;
  if (allianceCall && !nextAllianceCalls.some((row) => (
    String(row?.callId || '') === String(allianceCall.callId)
    && String(row?.relationshipKey || '') === String(outcome.relationshipKey)
  ))) return worldState;
  const coalitionSettlement = outcome.metadata?.coalitionSettlement;
  // An explicitly coordinated congress closure rides the accepted bilateral
  // peace incident until peaceTerms can see every declared component. It is not
  // itself a payment or proof that the other edges closed; the treaty mover
  // validates the complete census before any value moves.
  const rawCongressClosure = warCoalitionActive(worldState)
    && outcome.proposalPayload?.peaceOffer === true
    ? (outcome.proposalPayload?.coalitionSettlementClosure
      || outcome.metadata?.coalitionSettlementClosure)
    : null;
  const livePeaceWitness = outcome.proposalPayload?.peaceOffer === true
    ? coalitionClosureWitness(
        worldState,
        outcome.proposalPayload?.offererId,
        outcome.proposalPayload?.targetId,
        worldState.tick,
        outcome.proposalPayload?.offererId,
      )
    : null;
  const expenditureRows = Array.isArray(outcome.metadata?.coalitionPeaceExpenditures)
    ? outcome.metadata.coalitionPeaceExpenditures
    : [];
  const closureExpenditure = livePeaceWitness
    ? expenditureRows.find((row) => String(row?.partyId || '') === livePeaceWitness.departingId)
    : null;
  const expenditurePressure01 = Number(closureExpenditure?.pressure01);
  const reimbursementPartyIds = livePeaceWitness
    ? (livePeaceWitness.departingId === livePeaceWitness.callerId
      ? livePeaceWitness.abandoned
      : [livePeaceWitness.departingId])
    : [];
  const reimbursementClaims = reimbursementPartyIds.map((memberId) => {
    const deployment = worldState.deployments?.[memberId];
    const anchor = joinAnchorOf(deployment, memberId);
    const expenditure = expenditureRows.find((row) => String(row?.partyId || '') === memberId);
    const pressure01 = Number(expenditure?.pressure01);
    if (!anchor || !Number.isFinite(pressure01)
      || anchor.callerId !== livePeaceWitness?.callerId
      || anchor.enemyId !== livePeaceWitness?.enemyId) return null;
    return {
      memberId,
      pressure01: clamp01(pressure01),
      joinAnchor: {
        ...anchor,
        sourceCauseTypes: Array.isArray(anchor.sourceCauseTypes)
          ? [...anchor.sourceCauseTypes]
          : [],
      },
    };
  }).filter(Boolean);
  const coalitionPeaceClosure = livePeaceWitness ? {
    ...livePeaceWitness,
    ...(livePeaceWitness.joinAnchor ? {
      joinAnchor: {
        ...livePeaceWitness.joinAnchor,
        sourceCauseTypes: Array.isArray(livePeaceWitness.joinAnchor.sourceCauseTypes)
          ? [...livePeaceWitness.joinAnchor.sourceCauseTypes]
          : [],
      },
    } : {}),
    ...(Number.isFinite(expenditurePressure01)
      ? { expenditurePressure01: clamp01(expenditurePressure01) }
      : {}),
    ...(reimbursementClaims.length
      ? { reimbursementClaims }
      : {}),
  } : null;
  const congressClosure = rawCongressClosure
    && typeof rawCongressClosure === 'object'
    && !Array.isArray(rawCongressClosure)
    ? {
        ...rawCongressClosure,
        ...(Array.isArray(rawCongressClosure.componentClosureIds)
          ? { componentClosureIds: [...rawCongressClosure.componentClosureIds] }
          : {}),
      }
    : null;
  if (coalitionSettlementActionWasRecorded(current, coalitionSettlement?.actionId)) return worldState;
  const nextCoalitionSettlements = coalitionSettlement
    ? appendRelationshipCoalitionSettlement(current, coalitionSettlement)
    : null;
  // A value-moving relationship patch without a valid, same-edge archive row
  // would be replayable and unauditable.  Fail the entire write closed.
  if (coalitionSettlement && (
    String(coalitionSettlement.relationshipKey || '') !== String(outcome.relationshipKey)
    || !nextCoalitionSettlements.some((row) => row.actionId === coalitionSettlement.actionId)
  )) return worldState;
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
        ...(coalitionPeaceClosure ? { coalitionPeaceClosure } : {}),
        ...(congressClosure ? { coalitionSettlementClosure: congressClosure } : {}),
      },
    ],
    history: historyEntry ? [...(current.history || []).slice(-11), historyEntry] : current.history || [],
    ...(historyEntry
      ? { turningPoints: appendRelationshipTurningPoint(current, historyEntry) }
      : {}),
    ...(allianceCall
      ? { allianceCalls: nextAllianceCalls }
      : {}),
    ...(coalitionSettlement
      ? { coalitionSettlements: nextCoalitionSettlements }
      : {}),
  };

  return {
    ...worldState,
    relationshipStates: {
      ...(worldState.relationshipStates || {}),
      [outcome.relationshipKey]: updated,
    },
  };
}
