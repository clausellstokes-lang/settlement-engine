import { TIER_ORDER } from '../../data/constants.js';

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

const stablePart = (value) =>
  String(value || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

const RELATIONSHIP_DEFAULTS = {
  neutral: {
    trust: 0.45,
    resentment: 0.12,
    dependency: 0.1,
    leverage: 0.08,
    fear: 0.08,
    tradeBalance: 0.5,
    pactStrength: 0,
  },
  trade_partner: {
    trust: 0.62,
    resentment: 0.08,
    dependency: 0.34,
    leverage: 0.22,
    fear: 0.08,
    tradeBalance: 0.62,
    pactStrength: 0.25,
  },
  allied: {
    trust: 0.78,
    resentment: 0.04,
    dependency: 0.34,
    leverage: 0.16,
    fear: 0.06,
    tradeBalance: 0.58,
    pactStrength: 0.78,
  },
  patron: {
    trust: 0.42,
    resentment: 0.32,
    dependency: 0.72,
    leverage: 0.72,
    fear: 0.34,
    tradeBalance: 0.44,
    pactStrength: 0.52,
  },
  client: {
    trust: 0.38,
    resentment: 0.38,
    dependency: 0.78,
    leverage: 0.18,
    fear: 0.32,
    tradeBalance: 0.38,
    pactStrength: 0.45,
  },
  vassal: {
    trust: 0.34,
    resentment: 0.48,
    dependency: 0.82,
    leverage: 0.82,
    fear: 0.48,
    tradeBalance: 0.32,
    pactStrength: 0.58,
  },
  rival: {
    trust: 0.24,
    resentment: 0.52,
    dependency: 0.12,
    leverage: 0.3,
    fear: 0.22,
    tradeBalance: 0.34,
    pactStrength: 0.05,
  },
  cold_war: {
    trust: 0.12,
    resentment: 0.68,
    dependency: 0.08,
    leverage: 0.42,
    fear: 0.56,
    tradeBalance: 0.18,
    pactStrength: 0,
  },
  hostile: {
    trust: 0.05,
    resentment: 0.78,
    dependency: 0.04,
    leverage: 0.38,
    fear: 0.72,
    tradeBalance: 0.08,
    pactStrength: 0,
  },
  criminal_network: {
    trust: 0.22,
    resentment: 0.45,
    dependency: 0.28,
    leverage: 0.55,
    fear: 0.44,
    tradeBalance: 0.24,
    pactStrength: 0.08,
  },
};

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

export const RELATIONSHIP_TYPE_ALIASES = {
  trade: "trade_partner",
  alliance: "allied",
  ally: "allied",
  war: "hostile",
  enemy: "hostile",
  subject: "vassal",
  tributary: "vassal",
  criminal_corridor: "criminal_network",
};

export const normalizeRelationshipType = (type) =>
  RELATIONSHIP_TYPE_ALIASES[String(type || "").trim().toLowerCase()] || String(type || "neutral").trim().toLowerCase();

const normalizeType = normalizeRelationshipType;

export function relationshipKeyFromEdge(edge) {
  if (edge?.id) return edge.id;
  const from = edge?.from || edge?.source || edge?.a || "unknown-a";
  const to = edge?.to || edge?.target || edge?.b || "unknown-b";
  return `rel.${from}.${to}`;
}

export function getRelationshipSettlements(edge) {
  return {
    from: edge?.from || edge?.source || edge?.a || edge?.settlementAId,
    to: edge?.to || edge?.target || edge?.b || edge?.settlementBId,
  };
}

export function normalizeRelationshipEdge(edge = {}) {
  const relationshipType = normalizeRelationshipType(edge.relationshipType || edge.type || edge.relation || "neutral");
  if (relationshipType !== "client") {
    return {
      ...edge,
      relationshipType,
      legacyRelationshipType: edge.legacyRelationshipType || null,
      normalizedDirection: edge.normalizedDirection || null,
    };
  }
  const { from, to } = getRelationshipSettlements(edge);
  if (!from || !to) {
    return {
      ...edge,
      relationshipType,
      legacyRelationshipType: edge.legacyRelationshipType || null,
      normalizedDirection: edge.normalizedDirection || null,
    };
  }
  return {
    ...edge,
    id: relationshipKeyFromEdge(edge),
    from: String(to),
    to: String(from),
    relationshipType: "patron",
    legacyRelationshipType: "client",
    normalizedDirection: "client_to_patron",
  };
}

export function ensureRelationshipState(edge, existing = {}) {
  const normalizedEdge = normalizeRelationshipEdge(edge);
  const rawType = existing.relationshipType || normalizedEdge?.relationshipType || "neutral";
  const relationshipType = normalizedEdge?.legacyRelationshipType === "client" && normalizeType(rawType) === "client"
    ? "patron"
    : normalizeType(rawType);
  const defaults = RELATIONSHIP_DEFAULTS[relationshipType] || RELATIONSHIP_DEFAULTS.neutral;
  const recentIncidents = Array.isArray(existing.recentIncidents) ? existing.recentIncidents.slice(-8) : [];
  const history = Array.isArray(existing.history) ? existing.history.slice(-12) : [];

  return {
    relationshipType,
    trust: clamp01(existing.trust ?? defaults.trust),
    resentment: clamp01(existing.resentment ?? defaults.resentment),
    dependency: clamp01(existing.dependency ?? defaults.dependency),
    leverage: clamp01(existing.leverage ?? defaults.leverage),
    fear: clamp01(existing.fear ?? defaults.fear),
    tradeBalance: clamp01(existing.tradeBalance ?? defaults.tradeBalance),
    militaryBurden: clamp01(existing.militaryBurden ?? 0),
    aidBurden: clamp01(existing.aidBurden ?? 0),
    obligationFatigue: clamp01(existing.obligationFatigue ?? 0),
    pactStrength: clamp01(existing.pactStrength ?? defaults.pactStrength ?? 0),
    recentIncidents,
    history,
    hierarchyResolutions: Array.isArray(existing.hierarchyResolutions) ? existing.hierarchyResolutions.slice(-6) : [],
    trajectory: existing.trajectory || "stable",
    proposedRelationshipType: existing.proposedRelationshipType || null,
    lastTransitionTick: Number.isFinite(existing.lastTransitionTick) ? existing.lastTransitionTick : null,
    updatedAt: existing.updatedAt || null,
    overlordWeaknessStreak: Math.max(0, Math.floor(Number(existing.overlordWeaknessStreak) || 0)),
    posture: existing.posture || null,
    memoryScore: clamp01(existing.memoryScore ?? 0),
    dailyLifeWeight: clamp01(existing.dailyLifeWeight ?? 0),
    postureUpdatedAtTick: Number.isFinite(existing.postureUpdatedAtTick) ? existing.postureUpdatedAtTick : null,
    postureReasons: Array.isArray(existing.postureReasons) ? existing.postureReasons.slice(0, 4) : [],
    relationshipMemory: existing.relationshipMemory && typeof existing.relationshipMemory === "object"
      ? { ...existing.relationshipMemory }
      : null,
  };
}

export function ensureRelationshipStatesForGraph(graph = { edges: [] }, existingStates = {}) {
  return Object.fromEntries(
    (graph.edges || []).map((edge) => {
      const key = relationshipKeyFromEdge(edge);
      return [key, ensureRelationshipState(normalizeRelationshipEdge(edge), existingStates[key])];
    }),
  );
}

export function ensureAllRelationshipStates(worldState, snapshot) {
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

export function relaxRelationshipStates(worldState) {
  const relationshipStates = { ...(worldState?.relationshipStates || {}) };
  for (const [key, s] of Object.entries(relationshipStates)) {
    const base = RELATIONSHIP_DEFAULTS[s.relationshipType] || RELATIONSHIP_DEFAULTS.neutral;
    const toward = (cur, target) => clamp01((cur ?? target) + (target - (cur ?? target)) * RELATIONSHIP_RELAX);
    relationshipStates[key] = {
      ...s,
      trust: toward(s.trust, base.trust),
      resentment: toward(s.resentment, base.resentment),
      fear: toward(s.fear, base.fear),
    };
  }
  return { ...worldState, relationshipStates };
}

const pressureFor = (pressureIdx, saveId, type) => {
  const direct = pressureIdx?.get?.(saveId, type);
  if (direct) return direct.score || 0;
  const settlementPressures = pressureIdx?.bySettlement?.[saveId] || [];
  return settlementPressures.find((pressure) => pressure.type === type)?.severity || 0;
};

const strongestPressure = (pressureIdx, saveId, types) =>
  types.reduce((max, type) => Math.max(max, pressureFor(pressureIdx, saveId, type)), 0);

const mean = (...values) => values.reduce((sum, value) => sum + (Number(value) || 0), 0) / values.length;

const candidateBase = ({
  edge,
  relState,
  tick,
  ruleId,
  candidateType,
  severity,
  probability,
  reasons,
  applyMode = "auto",
  relationshipPatch = {},
  proposalPayload,
  metadata = {},
  condition,
  targetSaveId,
  conflictTags = [],
}) => {
  const key = relationshipKeyFromEdge(edge);
  const settlements = getRelationshipSettlements(edge);
  const metadataAny = /** @type {any} */ (metadata);
  const toType = typeof metadataAny.toType === "string" ? metadataAny.toType : null;
  return {
    id: `candidate.relationship.${candidateType}.${key}.${tick}`,
    type: condition ? "condition" : "relationship",
    candidateType,
    ruleId,
    ruleFamily: "relationship",
    relationshipKey: key,
    targetSaveId: targetSaveId || settlements.from,
    severity: clamp01(severity),
    probability: clamp01(probability),
    applyMode,
    headline: toType
      ? `${relState.relationshipType.replace(/_/g, " ")} may become ${toType.replace(/_/g, " ")}`
      : `${relState.relationshipType.replace(/_/g, " ")} relationship may shift`,
    summary: reasons?.[0] || "Relationship pressure creates a world pulse outcome.",
    reasons,
    relationshipPatch,
    proposalPayload,
    metadata: {
      relationshipType: relState.relationshipType,
      fromSaveId: settlements.from,
      toSaveId: settlements.to,
      ...metadata,
    },
    condition,
    conflictTags: [`relationship:${key}`, ...conflictTags],
    generatedAtTick: tick,
  };
};

const labelProposal = (ctx, toType, candidateType, details) => {
  const { edge, relState, tick } = ctx;
  const key = relationshipKeyFromEdge(edge);
  const fromType = relState.relationshipType;
  return candidateBase({
    ...ctx,
    ...details,
    candidateType,
    applyMode: "proposal",
    relationshipPatch: {
      proposedRelationshipType: toType,
      trajectory: details.relationshipPatch?.trajectory || "transitioning",
      ...details.relationshipPatch,
    },
    proposalPayload: {
      kind: "relationship_label_change",
      relationshipKey: key,
      fromType,
      toType,
      reason: details.reasons?.[0] || "Relationship pressure created a visible diplomatic shift.",
    },
    metadata: {
      ...(details.metadata || {}),
      fromType,
      toType,
    },
    conflictTags: [`label:${key}`, `label:${key}:${fromType}->${toType}`, ...(details.conflictTags || [])],
    tick,
  });
};

const internalDrift = (ctx, candidateType, details) => candidateBase({ ...ctx, ...details, candidateType });

const hasRecentIncident = (relState, type, tick, cooldown = 2) =>
  (relState.recentIncidents || []).some((incident) => incident.type === type && tick - (incident.tick || 0) <= cooldown);

function itemFor(snapshot, saveId) {
  return snapshot?.byId?.get?.(String(saveId)) || null;
}

function tierRankFor(item) {
  const tier = item?.settlement?.tier || "village";
  const rank = TIER_ORDER.indexOf(tier);
  return rank >= 0 ? rank : TIER_ORDER.indexOf("village");
}

function populationFor(item) {
  return Math.max(0, Number(item?.settlement?.population) || 0);
}

function settlementStrength(item, pressure = {}) {
  const pop = populationFor(item);
  const popScore = Math.min(1, Math.log10(Math.max(10, pop)) / 5);
  return clamp01(
    tierRankFor(item) / Math.max(1, TIER_ORDER.length - 1) * 0.42
    + popScore * 0.22
    + (1 - (pressure.conflict || 0)) * 0.18
    + (1 - (pressure.trade || 0)) * 0.1
    + (1 - (pressure.legitimacy || 0)) * 0.08,
  );
}

function relationshipTypeBetween(snapshot, a, b) {
  const states = snapshot?.worldState?.relationshipStates || {};
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const s = getRelationshipSettlements(edge);
    const paired = (String(s.from) === String(a) && String(s.to) === String(b))
      || (String(s.from) === String(b) && String(s.to) === String(a));
    if (!paired) continue;
    return ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]).relationshipType;
  }
  return null;
}

function protectorBackingScore(ctx, targetId, attackerId) {
  const states = ctx.snapshot?.worldState?.relationshipStates || {};
  let max = 0;
  for (const rawEdge of ctx.snapshot?.regionalGraph?.edges || ctx.snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const key = relationshipKeyFromEdge(rawEdge);
    if (key === relationshipKeyFromEdge(ctx.originalEdge || ctx.edge)) continue;
    const relState = ensureRelationshipState(edge, states[key]);
    const s = getRelationshipSettlements(edge);
    let protectorId = null;
    let score = 0;

    if (relState.relationshipType === "allied" && (String(s.from) === String(targetId) || String(s.to) === String(targetId))) {
      protectorId = String(s.from) === String(targetId) ? s.to : s.from;
      score = 0.22 + relState.pactStrength * 0.36 + relState.trust * 0.22;
    } else if (relState.relationshipType === "trade_partner" && (String(s.from) === String(targetId) || String(s.to) === String(targetId))) {
      protectorId = String(s.from) === String(targetId) ? s.to : s.from;
      score = 0.08 + relState.dependency * 0.16 + relState.trust * 0.12;
    } else if (relState.relationshipType === "patron" && String(s.to) === String(targetId)) {
      protectorId = s.from;
      score = 0.28 + relState.leverage * 0.28 + relState.pactStrength * 0.18;
    } else if (relState.relationshipType === "vassal" && String(s.to) === String(targetId)) {
      protectorId = s.from;
      score = 0.38 + relState.leverage * 0.28 + relState.pactStrength * 0.22;
    }

    if (!protectorId || String(protectorId) === String(attackerId)) continue;
    const protector = itemFor(ctx.snapshot, protectorId);
    score += settlementStrength(protector) * 0.16;
    const protectorToAttacker = relationshipTypeBetween(ctx.snapshot, protectorId, attackerId);
    if (["allied", "trade_partner", "patron", "vassal"].includes(protectorToAttacker)) score *= 0.48;
    if (["hostile", "cold_war", "rival"].includes(protectorToAttacker)) score *= 1.18;
    max = Math.max(max, clamp01(score));
  }
  return clamp01(max);
}

function canSubjugate(ctx) {
  const settlements = getRelationshipSettlements(ctx.edge);
  const source = itemFor(ctx.snapshot, settlements.from);
  const target = itemFor(ctx.snapshot, settlements.to);
  if (!source || !target) return false;
  const sourceRank = tierRankFor(source);
  const targetRank = tierRankFor(target);
  if (sourceRank < targetRank) return false;
  if (sourceRank === targetRank && populationFor(source) < populationFor(target) * 0.72) return false;
  const sourceStrength = settlementStrength(source, ctx.sourcePressure);
  const targetStrength = settlementStrength(target, ctx.targetPressure);
  const backing = protectorBackingScore(ctx, settlements.to, settlements.from);
  return sourceStrength >= (targetStrength + backing * 0.8) * 0.82;
}

function patronageEligibility(ctx) {
  const settlements = getRelationshipSettlements(ctx.edge);
  const source = itemFor(ctx.snapshot, settlements.from);
  const target = itemFor(ctx.snapshot, settlements.to);
  if (!source || !target) return { eligible: false, reason: "missing_settlement" };
  const sourceRank = tierRankFor(source);
  const targetRank = tierRankFor(target);
  const sourceStrength = settlementStrength(source, ctx.sourcePressure);
  const targetStrength = settlementStrength(target, ctx.targetPressure);
  const sustainedTrade = ctx.relState.tradeBalance > 0.54
    || ctx.relState.dependency > 0.44
    || (ctx.relState.history || []).some(item => /trade|route|patron|client|dependency/i.test(`${item.type || ""} ${item.reason || ""}`));
  const stronger = sourceRank > targetRank || sourceStrength >= targetStrength + 0.14;
  return {
    eligible: stronger && sustainedTrade,
    reason: stronger ? (sustainedTrade ? "eligible" : "needs_sustained_trade") : "source_not_stronger",
    sourceStrength,
    targetStrength,
    sourceRank,
    targetRank,
    sustainedTrade,
  };
}

function relationshipThirdParties(snapshot, settlementId, types = []) {
  const typeSet = new Set(types);
  const states = snapshot?.worldState?.relationshipStates || {};
  const out = [];
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const key = relationshipKeyFromEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[key]);
    if (typeSet.size && !typeSet.has(relState.relationshipType)) continue;
    const s = getRelationshipSettlements(edge);
    let thirdPartyId = null;
    if (String(s.from) === String(settlementId)) thirdPartyId = String(s.to);
    if (String(s.to) === String(settlementId)) thirdPartyId = String(s.from);
    if (!thirdPartyId) continue;
    out.push({ relationshipKey: key, thirdPartyId, relationshipType: relState.relationshipType, relState });
  }
  return out;
}

function supplyExposure(snapshot, a, b) {
  const pair = new Set([String(a), String(b)]);
  let max = 0;
  for (const channel of snapshot?.regionalGraph?.channels || []) {
    if (channel.status !== "confirmed") continue;
    if (!["trade_dependency", "export_market", "trade_route"].includes(channel.type)) continue;
    if (!pair.has(String(channel.from)) || !pair.has(String(channel.to))) continue;
    max = Math.max(max, clamp01(channel.strength ?? channel.severity ?? 0.45));
  }
  return max;
}

function activeRebellionAgainstVassal(snapshot, vassalId) {
  return (snapshot?.worldState?.stressors || []).some(stressor =>
    stressor?.type === "rebellion"
    && (stressor.affectedSettlementIds || []).map(String).includes(String(vassalId))
    && !["resolved", "dormant", "residual"].includes(stressor.status),
  );
}

function sharedHostileThird(snapshot, a, b) {
  const states = snapshot?.worldState?.relationshipStates || {};
  const hostileToA = new Set();
  const hostileToB = new Set();
  for (const edge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const key = relationshipKeyFromEdge(edge);
    const state = ensureRelationshipState(edge, states[key]);
    if (!["hostile", "cold_war"].includes(state.relationshipType)) continue;
    const s = getRelationshipSettlements(edge);
    if (String(s.from) === String(a)) hostileToA.add(String(s.to));
    if (String(s.to) === String(a)) hostileToA.add(String(s.from));
    if (String(s.from) === String(b)) hostileToB.add(String(s.to));
    if (String(s.to) === String(b)) hostileToB.add(String(s.from));
  }
  return [...hostileToA].find(id => hostileToB.has(id)) || null;
}

function sharedEnemyAllianceCandidate(ctx) {
  const settlements = getRelationshipSettlements(ctx.edge);
  if (!settlements.from || !settlements.to) return null;
  if (["allied", "hostile", "cold_war", "vassal"].includes(ctx.relState.relationshipType)) return null;
  const enemyId = sharedHostileThird(ctx.snapshot, settlements.from, settlements.to);
  if (!enemyId) return null;
  const trustGate = ctx.relState.trust + ctx.relState.pactStrength * 0.4 - ctx.relState.resentment * 0.35;
  if (trustGate < 0.22) return null;
  return labelProposal(ctx, "allied", "shared_enemy_alliance", {
    ruleId: "shared_enemy_alliance",
    severity: clamp01(0.42 + trustGate * 0.24 + Math.max(ctx.sourcePressure.conflict, ctx.targetPressure.conflict) * 0.22),
    probability: clamp01(0.08 + trustGate * 0.16 + Math.max(ctx.sourcePressure.conflict, ctx.targetPressure.conflict) * 0.14),
    reasons: [
      "Both settlements are independently threatened by the same hostile power, making alliance plausible.",
      `Common hostile settlement: ${enemyId}.`,
    ],
    relationshipPatch: {
      trust: clamp01(ctx.relState.trust + 0.07),
      pactStrength: clamp01(ctx.relState.pactStrength + 0.16),
      trajectory: "aligning",
    },
    metadata: { commonEnemySaveId: enemyId },
  });
}

function neutralRules(ctx) {
  const { relState, sourcePressure, targetPressure, tick } = ctx;
  const combinedTrade = mean(sourcePressure.trade, targetPressure.trade);
  const combinedConflict = mean(sourcePressure.conflict, targetPressure.conflict);
  const imbalance = Math.abs(sourcePressure.economy - targetPressure.economy);
  const candidates = [];

  if (relState.trust > 0.48 && relState.resentment < 0.24 && combinedConflict < 0.38) {
    candidates.push(
      labelProposal(ctx, "trade_partner", "neutral_to_trade_partner", {
        ruleId: "neutral_to_trade_partner",
        severity: 0.25 + relState.trust * 0.28 + combinedTrade * 0.16,
        probability: 0.12 + relState.trust * 0.18 + combinedTrade * 0.08,
        reasons: [
          "Neutral neighbors have enough trust and low conflict pressure for trade ties to formalize.",
          `Trust ${relState.trust.toFixed(2)}, resentment ${relState.resentment.toFixed(2)}.`,
        ],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.03),
          tradeBalance: clamp01(relState.tradeBalance + 0.05),
        },
      }),
    );
  }

  if (combinedConflict > 0.42 || relState.resentment > 0.42) {
    candidates.push(
      labelProposal(ctx, "rival", "neutral_to_rival", {
        ruleId: "neutral_to_rival",
        severity: Math.max(0.34, combinedConflict, relState.resentment),
        probability: 0.1 + combinedConflict * 0.18 + relState.resentment * 0.14,
        reasons: [
          "Neutral relations are being pushed toward rivalry by conflict pressure or accumulated resentment.",
          `Conflict pressure ${combinedConflict.toFixed(2)}, resentment ${relState.resentment.toFixed(2)}.`,
        ],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.05),
          fear: clamp01(relState.fear + 0.03),
          trajectory: "cooling",
        },
      }),
    );
  }

  if (!hasRecentIncident(relState, "border_incident", tick) && combinedConflict > 0.25) {
    candidates.push(
      internalDrift(ctx, "neutral_border_incident", {
        ruleId: "neutral_border_incident",
        severity: 0.18 + combinedConflict * 0.34,
        probability: 0.12 + combinedConflict * 0.2,
        reasons: ["Local pressure creates a minor incident between neutral settlements."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.04),
          fear: clamp01(relState.fear + 0.02),
          trajectory: "cooling",
        },
        metadata: { incidentType: "border_incident" },
      }),
    );
  }

  if (imbalance > 0.42 && relState.dependency > 0.24 && relState.trust < 0.52) {
    const eligibility = patronageEligibility(ctx);
    if (eligibility.eligible) {
    candidates.push(
      labelProposal(ctx, "patron", "neutral_to_patronage", {
        ruleId: "neutral_to_patronage",
        severity: 0.34 + imbalance * 0.32 + relState.dependency * 0.16,
        probability: 0.08 + imbalance * 0.16 + relState.dependency * 0.1,
        reasons: [
          "A power imbalance gives one side an opening to formalize patronage instead of equal diplomacy.",
        ],
        relationshipPatch: {
          dependency: clamp01(relState.dependency + 0.06),
          leverage: clamp01(relState.leverage + 0.06),
          trajectory: "tightening",
        },
        metadata: { imbalance, patronageEligibility: eligibility.reason },
      }),
    );
    }
  }

  return candidates;
}

function tradePartnerRules(ctx) {
  const { relState, sourcePressure, targetPressure, tick } = ctx;
  const tradeStress = mean(sourcePressure.trade, targetPressure.trade);
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict);
  const dependencyGap = Math.abs(sourcePressure.economy - targetPressure.economy) + relState.dependency;
  const candidates = [];

  if (relState.trust > 0.68 && relState.resentment < 0.18 && relState.tradeBalance > 0.55 && conflictStress < 0.35) {
    candidates.push(
      labelProposal(ctx, "allied", "trade_to_allied", {
        ruleId: "trade_to_allied",
        severity: 0.4 + relState.trust * 0.28,
        probability: 0.1 + relState.trust * 0.18 + relState.tradeBalance * 0.08,
        reasons: ["Long stable trade and high trust create a plausible alliance offer."],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.04),
          pactStrength: clamp01(relState.pactStrength + 0.14),
          trajectory: "warming",
        },
      }),
    );
  }

  if (dependencyGap > 0.62 && relState.leverage > 0.38) {
    const eligibility = patronageEligibility(ctx);
    if (eligibility.eligible) {
    candidates.push(
      labelProposal(ctx, "patron", "trade_to_patron_client", {
        ruleId: "trade_to_patron_client",
        severity: 0.36 + dependencyGap * 0.32,
        probability: 0.08 + dependencyGap * 0.16 + relState.leverage * 0.12,
        reasons: ["Unequal trade creates leverage for a patron/client relationship."],
        relationshipPatch: {
          dependency: clamp01(relState.dependency + 0.07),
          leverage: clamp01(relState.leverage + 0.07),
          resentment: clamp01(relState.resentment + 0.03),
          trajectory: "tightening",
        },
        metadata: { patronageEligibility: eligibility.reason },
      }),
    );
    }
  }

  if (!hasRecentIncident(relState, "route_disruption", tick) && tradeStress > 0.28) {
    candidates.push(
      internalDrift(ctx, "trade_route_disruption", {
        ruleId: "trade_route_disruption",
        severity: 0.24 + tradeStress * 0.45,
        probability: 0.14 + tradeStress * 0.22,
        reasons: ["Trade pressure disrupts routes and introduces resentment or leverage."],
        relationshipPatch: {
          trust: clamp01(relState.trust - 0.03),
          resentment: clamp01(relState.resentment + 0.04),
          leverage: clamp01(relState.leverage + 0.03),
          trajectory: "strained",
        },
        metadata: { incidentType: "route_disruption" },
      }),
    );
  }

  if (tradeStress > 0.42 && relState.trust < 0.58) {
    candidates.push(
      internalDrift(ctx, "trade_smuggling_pressure", {
        ruleId: "trade_smuggling_pressure",
        severity: 0.22 + tradeStress * 0.38,
        probability: 0.08 + tradeStress * 0.22,
        reasons: ["Disrupted or unequal trade opens space for smugglers and informal markets."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.03),
          leverage: clamp01(relState.leverage + 0.04),
        },
        metadata: { incidentType: "smuggling_pressure" },
      }),
    );
  }

  return candidates;
}

function alliedRules(ctx) {
  const { edge, relState, sourcePressure, targetPressure, snapshot } = ctx;
  const burden = mean(targetPressure.food, targetPressure.conflict, targetPressure.disease, sourcePressure.conflict);
  const endurance = clamp01(relState.pactStrength + relState.trust * 0.4 - relState.obligationFatigue * 0.45);
  const settlements = getRelationshipSettlements(edge);
  const candidates = [];

  if (burden > 0.24) {
    candidates.push(
      candidateBase({
        ...ctx,
        candidateType: "ally_burden",
        ruleId: "allied_aid_buffer",
        type: "condition",
        targetSaveId: getRelationshipSettlements(edge).from,
        severity: Math.min(0.74, burden * 0.72),
        probability: 0.18 + relState.trust * 0.18 + relState.pactStrength * 0.16,
        reasons: [
          "An ally buffers pressure, but the support becomes a real burden on the supporting settlement.",
          `Burden ${burden.toFixed(2)}, endurance ${endurance.toFixed(2)}.`,
        ],
        relationshipPatch: {
          aidBurden: clamp01(relState.aidBurden + burden * 0.12),
          militaryBurden: clamp01(relState.militaryBurden + targetPressure.conflict * 0.1),
          obligationFatigue: clamp01(relState.obligationFatigue + burden * 0.08),
        },
        condition: {
          archetype: "alliance_burden",
          severity: Math.min(0.74, burden * 0.72),
          source: "world_pulse_relationship",
          relatedSettlementId: getRelationshipSettlements(edge).to,
        },
        metadata: { endurance, burden },
      }),
    );
  }

  if (targetPressure.conflict > 0.45 || targetPressure.hostility > 0.45) {
    candidates.push(
      internalDrift(ctx, "ally_conflict_mirror", {
        ruleId: "allied_conflict_obligation",
        severity: 0.28 + Math.max(targetPressure.conflict, targetPressure.hostility) * 0.48,
        probability: 0.1 + relState.pactStrength * 0.22 + relState.trust * 0.12,
        reasons: ["An ally faces a gated obligation to mirror hostility or cold-war pressure."],
        relationshipPatch: {
          militaryBurden: clamp01(relState.militaryBurden + 0.08),
          obligationFatigue: clamp01(relState.obligationFatigue + 0.06),
          trajectory: "committed",
        },
        metadata: { incidentType: "conflict_obligation" },
      }),
    );
  }

  const targetColdWar = relationshipThirdParties(snapshot, settlements.to, ["cold_war"])[0];
  if (targetColdWar) {
    const sourceToThird = relationshipTypeBetween(snapshot, settlements.from, targetColdWar.thirdPartyId);
    const hesitation = ["allied", "trade_partner", "patron", "vassal"].includes(sourceToThird) ? 0.46 : 1;
    candidates.push(
      internalDrift(ctx, "ally_cold_war_support", {
        ruleId: "allied_cold_war_support",
        severity: clamp01((0.28 + relState.pactStrength * 0.26 + targetColdWar.relState.resentment * 0.18) * hesitation),
        probability: clamp01((0.08 + relState.trust * 0.14 + relState.pactStrength * 0.16) * hesitation),
        reasons: [
          hesitation < 1
            ? "The ally supports cold-war pressure through sanctions or intelligence, but hesitates because the target is also tied to them."
            : "The ally supports cold-war pressure with sanctions, intelligence, or proxy aid.",
          `Cold-war third party: ${targetColdWar.thirdPartyId}.`,
        ],
        relationshipPatch: {
          militaryBurden: clamp01(relState.militaryBurden + 0.04 * hesitation),
          obligationFatigue: clamp01(relState.obligationFatigue + 0.05 * hesitation),
          pactStrength: clamp01(relState.pactStrength + 0.015 * hesitation),
          trajectory: hesitation < 1 ? "cautious_cold_war_support" : "cold_war_support",
        },
        metadata: {
          incidentType: "cold_war_support",
          thirdPartyId: targetColdWar.thirdPartyId,
          hesitation,
          sourceRelationshipToThird: sourceToThird,
        },
      }),
    );
  }

  if (relState.obligationFatigue > 0.52 || (burden > endurance && relState.resentment > 0.22)) {
    candidates.push(
      labelProposal(ctx, "trade_partner", "allied_overburdened", {
        ruleId: "allied_overburdened",
        severity: 0.42 + relState.obligationFatigue * 0.32 + Math.max(0, burden - endurance) * 0.35,
        probability: 0.08 + relState.obligationFatigue * 0.24 + Math.max(0, burden - endurance) * 0.2,
        reasons: ["The alliance is past its endurance limit and may cool into a conditional partnership."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.06),
          pactStrength: clamp01(relState.pactStrength - 0.12),
          trajectory: "strained",
        },
        metadata: { endurance, burden },
      }),
    );
  }

  if (burden < 0.18 && relState.obligationFatigue > 0.12) {
    candidates.push(
      internalDrift(ctx, "allied_shared_recovery", {
        ruleId: "allied_shared_recovery",
        severity: 0.16 + relState.obligationFatigue * 0.2,
        probability: 0.12 + relState.trust * 0.14,
        reasons: ["A quiet interval lets an alliance recover from prior aid strain."],
        relationshipPatch: {
          obligationFatigue: clamp01(relState.obligationFatigue - 0.07),
          aidBurden: clamp01(relState.aidBurden - 0.05),
          militaryBurden: clamp01(relState.militaryBurden - 0.04),
          trust: clamp01(relState.trust + 0.02),
        },
      }),
    );
  }

  return candidates;
}

function patronRules(ctx) {
  const { relState, sourcePressure, targetPressure } = ctx;
  const clientStrain = mean(targetPressure.food, targetPressure.trade, targetPressure.legitimacy);
  const patronExposure = mean(sourcePressure.economy, sourcePressure.trade);
  const candidates = [];

  candidates.push(
    internalDrift(ctx, "patron_extracts_tribute", {
      ruleId: "patron_extracts_tribute",
      severity: 0.18 + relState.leverage * 0.32 + relState.dependency * 0.18,
      probability: 0.12 + relState.leverage * 0.18,
      reasons: ["Patronage creates recurring extraction, protection demands, and law influence."],
      relationshipPatch: {
        resentment: clamp01(relState.resentment + 0.035),
        leverage: clamp01(relState.leverage + 0.025),
        dependency: clamp01(relState.dependency + 0.015),
      },
      metadata: { incidentType: "tribute_extraction" },
    }),
  );

  if (targetPressure.conflict > 0.36 || targetPressure.crime > 0.42) {
    candidates.push(
      internalDrift(ctx, "patron_intervenes", {
        ruleId: "patron_intervenes",
        severity: 0.28 + Math.max(targetPressure.conflict, targetPressure.crime) * 0.44,
        probability: 0.1 + relState.pactStrength * 0.2 + relState.leverage * 0.08,
        reasons: ["A patron has incentive to intervene when client instability threatens tribute or influence."],
        relationshipPatch: {
          militaryBurden: clamp01(relState.militaryBurden + 0.06),
          trust: clamp01(relState.trust + 0.02),
          resentment: clamp01(relState.resentment + 0.025),
        },
        metadata: { incidentType: "patron_intervention" },
      }),
    );
  }

  if (
    (targetPressure.conflict > 0.46 || targetPressure.trade > 0.52)
    && patronExposure > 0.36
    && relState.dependency > 0.5
    && relState.trust > 0.34
  ) {
    candidates.push(
      labelProposal(ctx, "allied", "patron_protects_investment", {
        ruleId: "patron_to_allied_interest_protection",
        severity: 0.38 + Math.max(targetPressure.conflict, targetPressure.trade) * 0.28 + patronExposure * 0.18,
        probability: 0.06 + relState.dependency * 0.12 + patronExposure * 0.12,
        reasons: [
          "The patron's own economy is exposed enough that protecting the client as an ally becomes rational.",
          "Patronage matures when the patron needs the client's survival more than its concessions.",
        ],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.07),
          pactStrength: clamp01(relState.pactStrength + 0.16),
          leverage: clamp01(relState.leverage - 0.08),
          resentment: clamp01(relState.resentment - 0.04),
          trajectory: "protective_alignment",
        },
        metadata: { patronExposure },
      }),
    );
  }

  if (clientStrain > 0.52 && relState.resentment > 0.45) {
    candidates.push(
      labelProposal(ctx, "hostile", "patron_overreach", {
        ruleId: "patron_overreach",
        severity: 0.48 + clientStrain * 0.32 + relState.resentment * 0.18,
        probability: 0.07 + clientStrain * 0.2 + relState.resentment * 0.16,
        reasons: ["Extraction during crisis can turn patronage into open hostility."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.08),
          fear: clamp01(relState.fear + 0.08),
          trajectory: "rupturing",
        },
      }),
    );
  }

  if (sourcePressure.conflict > 0.55 && relState.dependency > 0.62) {
    candidates.push(
      internalDrift(ctx, "patron_forces_alignment", {
        ruleId: "patron_forces_alignment",
        severity: 0.36 + sourcePressure.conflict * 0.32,
        probability: 0.08 + relState.leverage * 0.18,
        reasons: ["A strained patron may demand client troops, supplies, or legal concessions."],
        relationshipPatch: {
          obligationFatigue: clamp01(relState.obligationFatigue + 0.08),
          resentment: clamp01(relState.resentment + 0.05),
        },
        metadata: { incidentType: "forced_alignment" },
      }),
    );
  }

  return candidates;
}

function clientRules(ctx) {
  const { relState, sourcePressure, targetPressure } = ctx;
  const autonomyPressure = mean(sourcePressure.legitimacy, sourcePressure.economy, relState.resentment);
  const candidates = [];

  if (relState.dependency > 0.62 && relState.resentment < 0.5) {
    candidates.push(
      internalDrift(ctx, "client_compliance", {
        ruleId: "client_compliance",
        severity: 0.16 + relState.dependency * 0.25,
        probability: 0.12 + relState.dependency * 0.15,
        reasons: ["Client dependence encourages compliance even when the arrangement is unequal."],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.015),
          leverage: clamp01(relState.leverage + 0.025),
          dependency: clamp01(relState.dependency + 0.015),
        },
      }),
    );
  }

  if (autonomyPressure > 0.5) {
    candidates.push(
      labelProposal(ctx, "rival", "client_autonomy_bid", {
        ruleId: "client_autonomy_bid",
        severity: 0.42 + autonomyPressure * 0.34,
        probability: 0.08 + autonomyPressure * 0.2,
        reasons: ["A pressured client can produce autonomy movements or resistance factions."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.07),
          trust: clamp01(relState.trust - 0.04),
          trajectory: "resisting",
        },
      }),
    );
  }

  if (sourcePressure.conflict > 0.42 || sourcePressure.food > 0.5) {
    candidates.push(
      internalDrift(ctx, "client_appeals_for_protection", {
        ruleId: "client_appeals_for_protection",
        severity: 0.28 + Math.max(sourcePressure.conflict, sourcePressure.food) * 0.42,
        probability: 0.1 + relState.dependency * 0.2,
        reasons: ["Client crisis increases appeals for patron protection and deepens dependence."],
        relationshipPatch: {
          dependency: clamp01(relState.dependency + 0.06),
          leverage: clamp01(relState.leverage + 0.04),
          obligationFatigue: clamp01(relState.obligationFatigue + 0.04),
        },
        metadata: { incidentType: "appeal_for_protection" },
      }),
    );
  }

  if (targetPressure.trade > 0.45 && relState.dependency > 0.6) {
    candidates.push(
      internalDrift(ctx, "client_debt_spiral", {
        ruleId: "client_debt_spiral",
        severity: 0.3 + targetPressure.trade * 0.38,
        probability: 0.08 + relState.dependency * 0.16 + targetPressure.trade * 0.1,
        reasons: ["Trade disruption and dependency create a debt spiral for the client."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.04),
          dependency: clamp01(relState.dependency + 0.04),
          leverage: clamp01(relState.leverage + 0.04),
        },
        metadata: { incidentType: "debt_spiral" },
      }),
    );
  }

  return candidates;
}

function vassalRules(ctx) {
  const { edge, relState, sourcePressure, targetPressure, tick } = ctx;
  const settlements = getRelationshipSettlements(edge);
  const overlordId = settlements.from;
  const vassalId = settlements.to;
  const vassalStrain = mean(targetPressure.legitimacy, targetPressure.trade, targetPressure.conflict, relState.resentment);
  const overlordWeakness = mean(sourcePressure.conflict, sourcePressure.legitimacy, sourcePressure.defense, sourcePressure.economy);
  const weaknessStreak = Math.max(0, Number(relState.overlordWeaknessStreak) || 0);
  const candidates = [];

  candidates.push(
    candidateBase({
      ...ctx,
      candidateType: "vassal_tribute_extraction",
      ruleId: "vassal_tribute_extraction",
      type: "condition",
      targetSaveId: vassalId,
      severity: clamp01(0.28 + relState.leverage * 0.32 + relState.dependency * 0.18),
      probability: 0.14 + relState.leverage * 0.18,
      reasons: [
        "Vassalage creates recurring tribute, legal concessions, and military obligation.",
        "The overlord benefits structurally, but the vassal's local economy and legitimacy are strained.",
      ],
      relationshipPatch: {
        resentment: clamp01(relState.resentment + 0.035),
        dependency: clamp01(relState.dependency + 0.025),
        leverage: clamp01(relState.leverage + 0.025),
        tradeBalance: clamp01(relState.tradeBalance - 0.025),
        pactStrength: clamp01(relState.pactStrength + 0.015),
        overlordSaveId: overlordId,
        vassalSaveId: vassalId,
        trajectory: "extractive",
      },
      condition: {
        archetype: "vassal_extraction",
        label: "Vassal extraction",
        description: "Tribute, levies, or legal concessions are draining local capacity.",
        severity: clamp01(0.28 + relState.leverage * 0.32 + relState.dependency * 0.18),
        status: "stable",
        triggeredAt: { tick, sourceEventType: "WORLD_PULSE_VASSALAGE", sourceEventTargetId: overlordId },
        affectedSystems: ["trade_connectivity", "public_legitimacy", "faction_power", "defense_readiness"],
        causes: [{ source: relationshipKeyFromEdge(edge), effect: "vassal_extraction", reason: "A vassal relationship transfers value upward." }],
      },
      metadata: { incidentType: "vassal_extraction", overlordSaveId: overlordId, vassalSaveId: vassalId },
    }),
  );

  const overlordColdWar = relationshipThirdParties(ctx.snapshot, overlordId, ["cold_war"])[0];
  if (overlordColdWar) {
    candidates.push(
      internalDrift(ctx, "vassal_cold_war_support", {
        ruleId: "vassal_cold_war_support",
        severity: clamp01(0.26 + relState.dependency * 0.22 + overlordColdWar.relState.resentment * 0.2),
        probability: clamp01(0.08 + relState.leverage * 0.16 + relState.pactStrength * 0.12),
        reasons: [
          "A vassal is expected to aid the overlord's cold war with sanctions, scouts, supplies, or legal pressure.",
          `Cold-war third party: ${overlordColdWar.thirdPartyId}.`,
        ],
        relationshipPatch: {
          obligationFatigue: clamp01(relState.obligationFatigue + 0.06),
          militaryBurden: clamp01(relState.militaryBurden + 0.04),
          resentment: clamp01(relState.resentment + 0.025),
          pactStrength: clamp01(relState.pactStrength + 0.02),
          trajectory: "cold_war_levy_support",
        },
        metadata: {
          incidentType: "vassal_cold_war_support",
          overlordSaveId: overlordId,
          vassalSaveId: vassalId,
          thirdPartyId: overlordColdWar.thirdPartyId,
        },
      }),
    );
  }

  if (overlordWeakness > 0.5 || weaknessStreak > 0) {
    const nextStreak = overlordWeakness > 0.5 ? weaknessStreak + 1 : Math.max(0, weaknessStreak - 1);
    candidates.push(
      internalDrift(ctx, "vassal_overlord_weakness_memory", {
        ruleId: "vassal_overlord_weakness_memory",
        severity: clamp01(0.18 + overlordWeakness * 0.28 + Math.min(0.24, nextStreak * 0.06)),
        probability: 1,
        reasons: [
          overlordWeakness > 0.5
            ? "The overlord's weak legitimacy, economy, military, or defenses are becoming a remembered vassalage risk."
            : "The overlord is recovering, so vassal independence pressure cools gradually.",
        ],
        relationshipPatch: {
          overlordWeaknessStreak: nextStreak,
          resentment: overlordWeakness > 0.5 ? clamp01(relState.resentment + 0.02) : relState.resentment,
          trajectory: overlordWeakness > 0.5 ? "overlord_weakness_noted" : "overlord_recovery_noted",
        },
        metadata: { incidentType: "overlord_weakness_memory", overlordWeakness, weaknessStreak: nextStreak },
      }),
    );
  }

  if (targetPressure.conflict > 0.38 || targetPressure.crime > 0.42) {
    candidates.push(
      internalDrift(ctx, "vassal_protection_burden", {
        ruleId: "vassal_protection_burden",
        severity: clamp01(0.26 + Math.max(targetPressure.conflict, targetPressure.crime) * 0.4),
        probability: 0.1 + relState.pactStrength * 0.16,
        reasons: ["The overlord has incentive to protect the vassal, but protection deepens obligation and dependence."],
        relationshipPatch: {
          militaryBurden: clamp01(relState.militaryBurden + 0.05),
          dependency: clamp01(relState.dependency + 0.04),
          fear: clamp01(relState.fear + 0.02),
          trust: clamp01(relState.trust + 0.015),
        },
        metadata: { incidentType: "vassal_protection" },
      }),
    );
  }

  const rebellionActive = activeRebellionAgainstVassal(ctx.snapshot, vassalId);
  const stableVassalage = clamp01(relState.trust * 0.34 + relState.pactStrength * 0.28 + (1 - vassalStrain) * 0.38);
  if (!rebellionActive && stableVassalage > 0.55 && !hasRecentIncident(relState, "stable_vassalage", tick, 3)) {
    candidates.push(
      internalDrift(ctx, "vassal_stability_compact", {
        ruleId: "vassal_stability_compact",
        severity: clamp01(0.24 + stableVassalage * 0.32),
        probability: clamp01(0.08 + stableVassalage * 0.18),
        reasons: [
          "The vassalage is burdensome, but trust, protection, and low strain make a stable compact plausible.",
          `Stable compact gate ${stableVassalage.toFixed(2)} with strain ${vassalStrain.toFixed(2)}.`,
        ],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.045),
          resentment: clamp01(relState.resentment - 0.035),
          dependency: clamp01(relState.dependency + 0.015),
          pactStrength: clamp01(relState.pactStrength + 0.04),
          obligationFatigue: clamp01((relState.obligationFatigue || 0) - 0.035),
          trajectory: "stable_vassalage",
        },
        metadata: { incidentType: "stable_vassalage", overlordSaveId: overlordId, vassalSaveId: vassalId, stableVassalage },
      }),
    );
  }

  const vassalItem = itemFor(ctx.snapshot, vassalId);
  const overlordItem = itemFor(ctx.snapshot, overlordId);
  const vassalConfidence = clamp01(settlementStrength(vassalItem, targetPressure) - settlementStrength(overlordItem, sourcePressure) + 0.45);
  const independencePressure = clamp01(vassalStrain + overlordWeakness * 0.28 + Math.min(0.28, weaknessStreak * 0.07) + vassalConfidence * 0.16);
  if (!rebellionActive && (vassalStrain > 0.55 || independencePressure > 0.62)) {
    const severity = clamp01(0.38 + independencePressure * 0.34 + (1 - relState.trust) * 0.1);
    candidates.push({
      id: `candidate.vassal.rebellion.${stablePart(relationshipKeyFromEdge(edge))}.${tick}`,
      type: "stressor",
      candidateType: "vassal_rebellion",
      ruleId: "vassal_rebellion_pressure",
      ruleFamily: "relationship",
      relationshipKey: relationshipKeyFromEdge(edge),
      targetSaveId: vassalId,
      severity,
      probability: clamp01(0.04 + independencePressure * 0.2 + relState.resentment * 0.12),
      applyMode: severity >= 0.72 ? "proposal" : "auto",
      headline: `Rebellion may rise in ${itemFor(ctx.snapshot, vassalId)?.name || vassalId}`,
      summary: "Vassal extraction, low legitimacy, and poor defenses create an independence crisis.",
      reasons: [
        `Independence pressure ${independencePressure.toFixed(2)} with overlord weakness streak ${weaknessStreak}.`,
        `Vassal strain ${vassalStrain.toFixed(2)} with resentment ${relState.resentment.toFixed(2)}.`,
        "A rebellion can end vassalage if it succeeds, but it does not erase prior structural changes.",
      ],
      stressor: {
        id: `world_stressor.rebellion.${stablePart(vassalId)}.${tick}`,
        type: "rebellion",
        label: "Rebellion pressure",
        originSettlementId: vassalId,
        severity,
        affectedSettlementIds: [vassalId],
        durationPolicy: "episodic",
        residualEffects: ["reprisal_memory", "autonomy_cells", "broken_tax_obligations"],
        spreadChannels: ["information_flow", "political_authority", "criminal_corridor"],
      },
      metadata: { overlordSaveId: overlordId, vassalSaveId: vassalId, relationshipKey: relationshipKeyFromEdge(edge), overlordWeakness, weaknessStreak, vassalConfidence },
      conflictTags: [`stressor:rebellion:${vassalId}`, `relationship:${relationshipKeyFromEdge(edge)}`],
    });
  }

  if (rebellionActive) {
    const successPressure = clamp01(vassalStrain + overlordWeakness * 0.45 - relState.fear * 0.2);
    if (successPressure > 0.48) {
      candidates.push(
        labelProposal(ctx, "rival", "vassal_rebellion_succeeds", {
          ruleId: "vassal_rebellion_resolution",
          severity: clamp01(0.46 + successPressure * 0.36),
          probability: clamp01(0.06 + successPressure * 0.24),
          reasons: [
            "The rebellion has a plausible path to break vassalage.",
            "Prior economic, factional, and power changes remain as scars rather than reverting.",
          ],
          relationshipPatch: {
            resentment: clamp01(relState.resentment + 0.05),
            dependency: clamp01(relState.dependency - 0.12),
            leverage: clamp01(relState.leverage - 0.12),
            fear: clamp01(relState.fear - 0.04),
            trajectory: "broken",
          },
          metadata: { overlordSaveId: overlordId, vassalSaveId: vassalId, rebellionOutcome: "succeeds" },
        }),
      );
    } else {
      candidates.push(
        internalDrift(ctx, "vassal_rebellion_quashed", {
          ruleId: "vassal_rebellion_resolution",
          severity: clamp01(0.34 + (1 - successPressure) * 0.28),
          probability: clamp01(0.08 + (1 - successPressure) * 0.18),
          reasons: ["The overlord has enough coercive advantage to quash the rebellion for now."],
          relationshipPatch: {
            resentment: clamp01(relState.resentment + 0.04),
            fear: clamp01(relState.fear + 0.08),
            dependency: clamp01(relState.dependency + 0.03),
            trajectory: "suppressed",
          },
          metadata: { incidentType: "rebellion_quashed", overlordSaveId: overlordId, vassalSaveId: vassalId },
        }),
      );
    }
  }

  return candidates;
}

function rivalRules(ctx) {
  const { relState, sourcePressure, targetPressure } = ctx;
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict, relState.resentment);
  const settlements = getRelationshipSettlements(ctx.edge);
  const sourcePower = settlementStrength(itemFor(ctx.snapshot, settlements.from), sourcePressure);
  const targetPower = settlementStrength(itemFor(ctx.snapshot, settlements.to), targetPressure);
  const confidenceGap = sourcePower - targetPower;
  const candidates = [];

  candidates.push(
    internalDrift(ctx, "rival_arms_race", {
      ruleId: "rival_arms_race",
      severity: 0.2 + conflictStress * 0.32 + relState.fear * 0.14,
      probability: 0.1 + conflictStress * 0.18,
      reasons: ["Rivals tend to answer pressure with defensive spending, prestige contests, or arms buildup."],
      relationshipPatch: {
        fear: clamp01(relState.fear + 0.035),
        resentment: clamp01(relState.resentment + 0.025),
        militaryBurden: clamp01(relState.militaryBurden + 0.035),
      },
      metadata: { incidentType: "arms_race" },
    }),
  );

  if (relState.resentment > 0.5 || sourcePressure.trade > 0.4 || targetPressure.trade > 0.4) {
    candidates.push(
      internalDrift(ctx, "rival_sabotage", {
        ruleId: "rival_sabotage",
        severity: 0.26 + relState.resentment * 0.36 + Math.max(sourcePressure.trade, targetPressure.trade) * 0.18,
        probability: 0.08 + relState.resentment * 0.18,
        reasons: ["Economic competition and resentment create sabotage, undercutting, or prestige attacks."],
        relationshipPatch: {
          trust: clamp01(relState.trust - 0.035),
          resentment: clamp01(relState.resentment + 0.04),
          trajectory: "deteriorating",
        },
        metadata: { incidentType: "sabotage" },
      }),
    );
  }

  if (conflictStress > 0.58) {
    candidates.push(
      labelProposal(ctx, "cold_war", "rival_to_cold_war_or_hostile", {
        ruleId: "rival_to_cold_war_or_hostile",
        severity: 0.44 + conflictStress * 0.35,
        probability: 0.07 + conflictStress * 0.2,
        reasons: ["Sustained rivalry can harden into cold-war posture when incidents accumulate."],
        relationshipPatch: {
          fear: clamp01(relState.fear + 0.06),
          resentment: clamp01(relState.resentment + 0.06),
          trajectory: "escalating",
        },
      }),
    );
  }

  if (confidenceGap > 0.22 && relState.resentment > 0.46 && relState.fear < 0.5) {
    candidates.push(
      labelProposal(ctx, confidenceGap > 0.36 && relState.resentment > 0.62 ? "hostile" : "cold_war", "rival_power_play", {
        ruleId: "rival_power_play",
        severity: clamp01(0.36 + confidenceGap * 0.42 + relState.resentment * 0.24),
        probability: clamp01(0.05 + confidenceGap * 0.18 + relState.resentment * 0.12),
        reasons: [
          "A rival with a stronger economy, military, or tier position grows confident enough to press the contest.",
          `Power confidence gap ${confidenceGap.toFixed(2)}.`,
        ],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.055),
          fear: clamp01(relState.fear + 0.045),
          leverage: clamp01(relState.leverage + 0.04),
          trajectory: "power_play",
        },
        metadata: { confidenceGap },
      }),
    );
  }

  if (relState.trust > 0.38 && relState.resentment < 0.38 && Math.max(sourcePressure.conflict, targetPressure.conflict) < 0.24) {
    candidates.push(
      labelProposal(ctx, "trade_partner", "rival_detente", {
        ruleId: "rival_detente",
        severity: 0.28 + relState.trust * 0.24,
        probability: 0.06 + relState.trust * 0.14,
        reasons: ["A quiet rivalry can thaw into transactional trade when resentment is low."],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.05),
          resentment: clamp01(relState.resentment - 0.05),
          trajectory: "warming",
        },
      }),
    );
  }

  return candidates;
}

function coldWarRules(ctx) {
  const { relState, sourcePressure, targetPressure } = ctx;
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict, relState.fear, relState.resentment);
  const tradeStress = mean(sourcePressure.trade, targetPressure.trade);
  const settlements = getRelationshipSettlements(ctx.edge);
  const exposure = supplyExposure(ctx.snapshot, settlements.from, settlements.to);
  const candidates = [];

  candidates.push(
    internalDrift(ctx, "cold_war_espionage", {
      ruleId: "cold_war_espionage",
      severity: 0.22 + conflictStress * 0.34,
      probability: 0.12 + conflictStress * 0.18,
      reasons: ["Cold-war relationships generate espionage, infiltration, and information shocks."],
      relationshipPatch: {
        fear: clamp01(relState.fear + 0.035),
        resentment: clamp01(relState.resentment + 0.025),
      },
      metadata: { incidentType: "espionage" },
    }),
  );

  if (sourcePressure.legitimacy > 0.35 || targetPressure.legitimacy > 0.35) {
    candidates.push(
      internalDrift(ctx, "cold_war_proxy_conflict", {
        ruleId: "cold_war_proxy_conflict",
        severity: 0.3 + Math.max(sourcePressure.legitimacy, targetPressure.legitimacy) * 0.38,
        probability: 0.08 + conflictStress * 0.16,
        reasons: ["Weak legitimacy gives cold-war rivals a proxy faction opening."],
        relationshipPatch: {
          leverage: clamp01(relState.leverage + 0.05),
          resentment: clamp01(relState.resentment + 0.04),
          trajectory: "destabilizing",
        },
        metadata: { incidentType: "proxy_conflict" },
      }),
    );
  }

  if ((exposure > 0.35 || tradeStress > 0.38) && relState.tradeBalance < 0.42) {
    candidates.push(
      candidateBase({
        ...ctx,
        candidateType: "cold_war_supply_sanctions",
        ruleId: "cold_war_supply_sanctions",
        type: "condition",
        targetSaveId: settlements.to,
        severity: clamp01(0.3 + Math.max(exposure, tradeStress) * 0.42 + relState.leverage * 0.12),
        probability: clamp01(0.08 + Math.max(exposure, tradeStress) * 0.2 + relState.resentment * 0.08),
        reasons: [
          "Cold-war pressure follows exposed trade and supply channels through inspections, sanctions, and informal embargoes.",
          exposure > 0 ? `Confirmed supply exposure ${exposure.toFixed(2)}.` : `Trade stress ${tradeStress.toFixed(2)}.`,
        ],
        relationshipPatch: {
          tradeBalance: clamp01(relState.tradeBalance - 0.05),
          resentment: clamp01(relState.resentment + 0.035),
          leverage: clamp01(relState.leverage + 0.035),
          trajectory: "sanctions_pressure",
        },
        condition: {
          archetype: "cold_war_sanctions",
          label: "Cold-war sanctions",
          description: "Inspections, sanctions, or informal embargoes are tightening daily trade.",
          severity: clamp01(0.3 + Math.max(exposure, tradeStress) * 0.42 + relState.leverage * 0.12),
          source: "world_pulse_relationship",
          relatedSettlementId: settlements.from,
          affectedSystems: ["trade_connectivity", "public_legitimacy", "criminal_opportunity"],
        },
        metadata: { incidentType: "supply_sanctions", exposure, tradeStress },
      }),
    );
  }

  if (conflictStress > 0.68) {
    candidates.push(
      labelProposal(ctx, "hostile", "cold_war_escalation", {
        ruleId: "cold_war_escalation",
        severity: 0.5 + conflictStress * 0.32,
        probability: 0.06 + conflictStress * 0.18,
        reasons: ["Cold-war incidents have accumulated enough pressure to risk open hostility."],
        relationshipPatch: {
          fear: clamp01(relState.fear + 0.07),
          resentment: clamp01(relState.resentment + 0.07),
          trajectory: "escalating",
        },
      }),
    );
  }

  if (relState.trust > 0.24 && relState.resentment < 0.5 && Math.max(sourcePressure.conflict, targetPressure.conflict) < 0.25) {
    candidates.push(
      labelProposal(ctx, "rival", "cold_war_thaw", {
        ruleId: "cold_war_thaw",
        severity: 0.26 + relState.trust * 0.2,
        probability: 0.05 + relState.trust * 0.12,
        reasons: ["A quiet cold war can thaw back into rivalry when immediate threat fades."],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.04),
          resentment: clamp01(relState.resentment - 0.04),
          fear: clamp01(relState.fear - 0.04),
          trajectory: "cooling",
        },
      }),
    );
  }

  return candidates;
}

function hostileRules(ctx) {
  const { relState, sourcePressure, targetPressure } = ctx;
  const powerGap = Math.abs(sourcePressure.defense - targetPressure.defense) + Math.abs(sourcePressure.economy - targetPressure.economy);
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict, relState.fear, relState.resentment);
  const attackerAttrition = mean(sourcePressure.economy, sourcePressure.defense, sourcePressure.legitimacy, relState.militaryBurden);
  const candidates = [];

  candidates.push(
    candidateBase({
      ...ctx,
      candidateType: "hostile_raid",
      ruleId: "hostile_raid",
      targetSaveId: getRelationshipSettlements(ctx.edge).to,
      severity: 0.28 + conflictStress * 0.36,
      probability: 0.1 + conflictStress * 0.18,
      reasons: ["Hostile neighbors create raid, blockade, or intimidation pressure."],
      relationshipPatch: {
        resentment: clamp01(relState.resentment + 0.035),
        fear: clamp01(relState.fear + 0.04),
        trajectory: "violent",
      },
      condition: {
        archetype: "war_pressure",
        severity: 0.28 + conflictStress * 0.36,
        source: "world_pulse_relationship",
        relatedSettlementId: getRelationshipSettlements(ctx.edge).from,
      },
      metadata: { incidentType: "raid" },
    }),
  );

  if (powerGap > 0.48 && conflictStress > 0.55 && canSubjugate(ctx)) {
    candidates.push(
      labelProposal(ctx, "vassal", "hostile_occupation_pressure", {
        ruleId: "hostile_occupation_pressure",
        severity: 0.52 + powerGap * 0.24 + conflictStress * 0.22,
        probability: 0.04 + powerGap * 0.14 + conflictStress * 0.12,
        reasons: ["A hostile imbalance can create occupation, tribute, or forced vassalage pressure."],
        relationshipPatch: {
          dependency: clamp01(relState.dependency + 0.08),
          fear: clamp01(relState.fear + 0.08),
          leverage: clamp01(relState.leverage + 0.08),
          trust: clamp01(relState.trust - 0.02),
          overlordSaveId: getRelationshipSettlements(ctx.edge).from,
          vassalSaveId: getRelationshipSettlements(ctx.edge).to,
          trajectory: "subjugating",
        },
        metadata: {
          powerGap,
          overlordSaveId: getRelationshipSettlements(ctx.edge).from,
          vassalSaveId: getRelationshipSettlements(ctx.edge).to,
        },
      }),
    );
  }

  if (relState.leverage > 0.45 && sourcePressure.economy > targetPressure.economy) {
    candidates.push(
      internalDrift(ctx, "hostile_forced_tribute", {
        ruleId: "hostile_forced_tribute",
        severity: 0.32 + relState.leverage * 0.35,
        probability: 0.06 + relState.leverage * 0.16,
        reasons: ["A hostile stronger side may demand tribute before outright occupation."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.05),
          dependency: clamp01(relState.dependency + 0.04),
          leverage: clamp01(relState.leverage + 0.04),
        },
        metadata: { incidentType: "forced_tribute" },
      }),
    );
  }

  if (attackerAttrition > 0.55 && relState.resentment < 0.82) {
    candidates.push(
      labelProposal(ctx, "cold_war", "hostile_attrition_deescalation", {
        ruleId: "hostile_attrition_deescalation",
        severity: clamp01(0.34 + attackerAttrition * 0.36),
        probability: clamp01(0.05 + attackerAttrition * 0.18 + relState.trust * 0.08),
        reasons: [
          "Open hostility is losing practical support as the stronger side's economy, defenses, legitimacy, or manpower slip.",
          `Attacker attrition ${attackerAttrition.toFixed(2)}.`,
        ],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.025),
          fear: clamp01(relState.fear - 0.035),
          militaryBurden: clamp01(relState.militaryBurden - 0.04),
          trajectory: "attrition_deescalation",
        },
        metadata: { attackerAttrition },
      }),
    );
  }

  if (relState.trust > 0.16 && relState.resentment < 0.62 && Math.max(sourcePressure.conflict, targetPressure.conflict) < 0.35) {
    candidates.push(
      labelProposal(ctx, "cold_war", "hostile_truce", {
        ruleId: "hostile_truce",
        severity: 0.3 + relState.trust * 0.22,
        probability: 0.05 + relState.trust * 0.12,
        reasons: ["Exhaustion or quiet borders can downgrade open hostility into cold-war posture."],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.035),
          resentment: clamp01(relState.resentment - 0.04),
          fear: clamp01(relState.fear - 0.03),
          trajectory: "deescalating",
        },
      }),
    );
  }

  return candidates;
}

function criminalNetworkRules(ctx) {
  const { relState, sourcePressure, targetPressure, tick } = ctx;
  const crimePressure = mean(sourcePressure.crime, targetPressure.crime);
  const tradeStress = mean(sourcePressure.trade, targetPressure.trade);
  const legitimacyStress = mean(sourcePressure.legitimacy, targetPressure.legitimacy);
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict);
  const candidates = [];

  if (!hasRecentIncident(relState, "smuggling_expansion", tick) && (crimePressure > 0.28 || tradeStress > 0.42)) {
    candidates.push(
      internalDrift(ctx, "criminal_smuggling_expands", {
        ruleId: "criminal_smuggling_expands",
        severity: 0.24 + Math.max(crimePressure, tradeStress) * 0.38,
        probability: 0.1 + crimePressure * 0.18 + tradeStress * 0.12,
        reasons: [
          "Crime or trade pressure gives the criminal network room to expand smuggling and favors.",
        ],
        relationshipPatch: {
          leverage: clamp01(relState.leverage + 0.05),
          dependency: clamp01(relState.dependency + 0.03),
          resentment: clamp01(relState.resentment + 0.025),
          trajectory: "tightening",
        },
        metadata: { incidentType: "smuggling_expansion" },
      }),
    );
  }

  if (!hasRecentIncident(relState, "protection_racket", tick) && (legitimacyStress > 0.38 || relState.fear > 0.48)) {
    candidates.push(
      internalDrift(ctx, "criminal_protection_racket", {
        ruleId: "criminal_protection_racket",
        severity: 0.26 + Math.max(legitimacyStress, relState.fear) * 0.36,
        probability: 0.08 + legitimacyStress * 0.16 + relState.fear * 0.12,
        reasons: [
          "Weak legitimacy or fear lets the criminal network sell protection as informal order.",
        ],
        relationshipPatch: {
          fear: clamp01(relState.fear + 0.04),
          leverage: clamp01(relState.leverage + 0.04),
          resentment: clamp01(relState.resentment + 0.035),
          trajectory: "coercive",
        },
        metadata: { incidentType: "protection_racket" },
      }),
    );
  }

  if (conflictStress > 0.5 && relState.resentment > 0.48 && relState.fear > 0.42) {
    candidates.push(
      labelProposal(ctx, "cold_war", "criminal_to_cold_war", {
        ruleId: "criminal_to_cold_war",
        severity: 0.36 + conflictStress * 0.28 + relState.resentment * 0.14,
        probability: 0.06 + conflictStress * 0.16 + relState.fear * 0.1,
        reasons: [
          "A criminal relationship under conflict pressure can harden into covert state hostility.",
        ],
        relationshipPatch: {
          fear: clamp01(relState.fear + 0.03),
          resentment: clamp01(relState.resentment + 0.04),
          trajectory: "escalating",
        },
      }),
    );
  }

  if (crimePressure < 0.24 && tradeStress < 0.34 && relState.trust > 0.42 && relState.resentment < 0.34) {
    candidates.push(
      labelProposal(ctx, "trade_partner", "criminal_legitimizes_trade", {
        ruleId: "criminal_legitimizes_trade",
        severity: 0.28 + relState.trust * 0.24,
        probability: 0.05 + relState.trust * 0.12,
        reasons: [
          "Low crime pressure and rising trust can pull a criminal corridor into legitimate trade.",
        ],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.04),
          resentment: clamp01(relState.resentment - 0.035),
          leverage: clamp01(relState.leverage - 0.04),
          tradeBalance: clamp01(relState.tradeBalance + 0.08),
          trajectory: "normalizing",
        },
      }),
    );
  }

  return candidates;
}

const RULE_EVALUATORS = {
  neutral: neutralRules,
  trade_partner: tradePartnerRules,
  allied: alliedRules,
  patron: patronRules,
  client: clientRules,
  vassal: vassalRules,
  rival: rivalRules,
  cold_war: coldWarRules,
  hostile: hostileRules,
  criminal_network: criminalNetworkRules,
};

function buildPressureSummary(pressureIdx, saveId) {
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

export function evaluateRelationshipRules(snapshot, pressureIdx, context = {}) {
  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const states = snapshot?.worldState?.relationshipStates || {};

  return (snapshot?.regionalGraph?.edges || snapshot?.relationships || []).flatMap((edge) => {
    const key = relationshipKeyFromEdge(edge);
    const normalizedEdge = normalizeRelationshipEdge(edge);
    const relState = ensureRelationshipState(normalizedEdge, states[key]);
    const evaluator = RULE_EVALUATORS[relState.relationshipType] || RULE_EVALUATORS.neutral;
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
      tick,
    };
    return [
      ...evaluator(ctx),
      sharedEnemyAllianceCandidate(ctx),
    ].filter(Boolean);
  });
}

export function deriveRelationshipCandidates(snapshot, pressureIdx, options = {}) {
  return evaluateRelationshipRules(snapshot, pressureIdx, options);
}

export function applyRelationshipPatch(worldState, outcome, now) {
  if (!outcome.relationshipKey || !outcome.relationshipPatch) return worldState;
  const current = ensureRelationshipState({}, worldState.relationshipStates?.[outcome.relationshipKey]);
  const historyEntry = outcome.proposalPayload?.kind === "relationship_label_change"
    ? {
        tick: worldState.tick,
        type: "label_proposal_applied",
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
