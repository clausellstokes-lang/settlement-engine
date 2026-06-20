import { TIER_ORDER } from '../../data/constants.js';
import { previewRelationshipHierarchyCascade } from './relationshipHierarchy.js';
import { isBattlefieldPrimary } from './relationshipCompatibility.js';

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

const stablePart = (value) =>
  String(value || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

// Deterministic 0..1 fork keyed on identity text (FNV-1a + avalanche). Used
// ONLY to break genuine state ties (e.g. which side of a perfectly symmetric
// war raids this tick) — keyed on the SORTED pair + tick so the result is
// identical whichever side the save happened to author at 'from'. The fmix32
// finalizer matters: without it, single-character tick changes barely move
// the high bits and one side raids for ten straight ticks.
function hash01(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

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

/**
 * H16 — directional roles for hierarchical labels. Edges are one-per-pair and
 * for relationships that BEGAN symmetric the from/to orientation is a pure
 * authoring artifact (save iteration order), so a pulse-driven subjugation or
 * patronage stamps the chosen senior side onto the relationship STATE
 * (overlordSaveId / patronSaveId). Readers resolve direction state-first; a
 * DM-authored vassal/patron edge carries no stamp and keeps its strict edge
 * direction (from = overlord/patron).
 */
export function relationshipRoles(edge, relState) {
  const { from, to } = getRelationshipSettlements(edge);
  const fromId = String(from);
  const toId = String(to);
  const type = relState?.relationshipType;
  const stamped = type === "vassal" ? relState?.overlordSaveId : type === "patron" ? relState?.patronSaveId : null;
  if (stamped != null && (String(stamped) === fromId || String(stamped) === toId)) {
    const seniorId = String(stamped);
    const juniorId = seniorId === fromId ? toId : fromId;
    return { seniorId, juniorId, reversed: seniorId !== fromId };
  }
  return { seniorId: fromId, juniorId: toId, reversed: false };
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
    // H16: direction stamps for hierarchy labels born from symmetric edges
    // (the subjugating/patronizing side may be the authored 'to'). Null on
    // DM-authored hierarchy edges, which keep strict edge direction.
    overlordSaveId: existing.overlordSaveId != null ? String(existing.overlordSaveId) : null,
    vassalSaveId: existing.vassalSaveId != null ? String(existing.vassalSaveId) : null,
    patronSaveId: existing.patronSaveId != null ? String(existing.patronSaveId) : null,
    clientSaveId: existing.clientSaveId != null ? String(existing.clientSaveId) : null,
    relationshipMemory: existing.relationshipMemory && typeof existing.relationshipMemory === "object"
      ? { ...existing.relationshipMemory }
      : null,
    // Phase B4: the LAYERED secondary-status overlay (B0 compatibility-enforced
    // trade statuses), stamped post-apply ONLY under the war layer. Preserved
    // across the per-tick ensure/relax passes; absent on a legacy edge (the field
    // is conditionally spread so it never serializes for a no-overlay edge).
    ...(Array.isArray(existing.secondaryStatuses) && existing.secondaryStatuses.length
      ? { secondaryStatuses: existing.secondaryStatuses }
      : {}),
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

// ── Feature C disposition seam ──────────────────────────────────────────────
// A settlement's centered-on-1.0 aggressiveness multiplier modulates the
// candidates it drives, SIGNED BY INTENT: aggression boosts escalation and damps
// de-escalation (and a pacifist does the reverse), so an aggressive settlement
// does not also "sue for peace" harder. A factor of exactly 1.0 (empty/legacy
// ledger) is a no-op in every branch ⇒ byte-identical.
const EMPTY_DISPOSITION = Object.freeze({});

// Relationship hostility ordering — higher = more adversarial. A label change
// toward a higher rank is escalation; toward a lower rank, de-escalation.
const HOSTILITY_RANK = Object.freeze({
  allied: 0, patron: 1, client: 1, vassal: 1, trade_partner: 2, neutral: 3,
  criminal_network: 4, rival: 4, cold_war: 5, hostile: 6,
});
const hostilityRank = (/** @type {any} */ type) => {
  const r = /** @type {Record<string, number>} */ (HOSTILITY_RANK)[normalizeRelationshipType(type)];
  return Number.isFinite(r) ? r : 3;
};

// Internal drifts carry no toType; classify by candidateType keyword. An unmatched
// type is NEUTRAL (factor 1.0 ⇒ no effect), so a misclassification can never churn
// legacy and only ever damps/boosts once dispositions are non-trivial.
const ESCALATION_HINT = /(arms_race|sabotage|incident|overreach|coup|rebellion|hostile|raid|extract|power_play|autonomy_bid|debt_spiral|forces_align|subjugat|war|sanction)/i;
const DEESCALATION_HINT = /(thaw|recovery|compact|protect|stability|alliance|allied|trade_partner|patronage|compliance|support|reconcil)/i;

export function candidateDirection(/** @type {any} */ candidateType, /** @type {any} */ relState, /** @type {any} */ metadataAny) {
  const toType = typeof metadataAny?.toType === "string" ? metadataAny.toType : null;
  if (toType) {
    const delta = hostilityRank(toType) - hostilityRank(relState?.relationshipType);
    if (delta > 0) return "escalation";
    if (delta < 0) return "de_escalation";
    return "neutral";
  }
  const t = String(candidateType || "");
  if (ESCALATION_HINT.test(t)) return "escalation";
  if (DEESCALATION_HINT.test(t)) return "de_escalation";
  return "neutral";
}

// Signed, centered-on-1.0 disposition factor. raw==1.0 ⇒ 1.0 in EVERY branch.
export function signedDispositionFactor(/** @type {any} */ rawFactor, /** @type {any} */ direction) {
  const raw = Number.isFinite(rawFactor) ? rawFactor : 1.0;
  if (raw === 1.0) return 1.0;
  if (direction === "escalation") return raw;
  if (direction === "de_escalation") return 2 - raw;
  return 1.0;
}

// ── Phase B4 trade-salience seam ─────────────────────────────────────────────
// A per-EDGE centered-on-1.0 factor (computed in tradeSalience.js) that DAMPENS
// hostile/escalation candidates when a VALUABLE trade tie exists between the
// parties, and symmetrically RAISES de-escalation. The raw factor is < 1.0 for a
// valuable tie, EXACTLY 1.0 otherwise. Unlike the disposition factor (per-actor),
// this is keyed on the relationship edge (the tie is a property of the pair).
// Signed by candidate intent like signedDispositionFactor: escalation gets the
// raw damp (< 1.0 ⇒ less likely/severe); de-escalation gets the mirror (2 - raw
// ⇒ > 1.0 ⇒ more likely). Neutral drifts are untouched. raw==1.0 ⇒ 1.0 in EVERY
// branch ⇒ byte-identical when the war layer is off (the map is empty).
const EMPTY_TRADE_SALIENCE = Object.freeze({});

export function signedTradeSalienceFactor(/** @type {any} */ rawFactor, /** @type {any} */ direction) {
  const raw = Number.isFinite(rawFactor) ? rawFactor : 1.0;
  if (raw === 1.0) return 1.0;
  if (direction === "escalation") return raw;        // < 1.0 ⇒ hostility costlier
  if (direction === "de_escalation") return 2 - raw; // > 1.0 ⇒ peace easier
  return 1.0;
}

const candidateBase = ({
  edge,
  relState,
  tick,
  ruleId,
  candidateType,
  severity,
  probability,
  reasons,
  summary,
  applyMode = "auto",
  relationshipPatch = {},
  proposalPayload,
  metadata = {},
  condition,
  targetSaveId,
  conflictTags = [],
  dispositionFactor = EMPTY_DISPOSITION,
  tradeSalienceFactor = EMPTY_TRADE_SALIENCE,
}) => {
  const key = relationshipKeyFromEdge(edge);
  const settlements = getRelationshipSettlements(edge);
  const metadataAny = /** @type {any} */ (metadata);
  const toType = typeof metadataAny.toType === "string" ? metadataAny.toType : null;
  const direction = candidateDirection(candidateType, relState, metadataAny);
  // The actor (the settlement driving this candidate) is the attributed save. Its
  // disposition multiplier, signed by the candidate's escalation/de-escalation
  // intent, scales severity + probability. 1.0 for a legacy/empty ledger.
  const actorId = String(targetSaveId || settlements.from);
  const factor = signedDispositionFactor(
    /** @type {Record<string, any>} */ (dispositionFactor)?.[actorId],
    direction,
  );
  // B4: the trade-salience dampener COMPOSES with the disposition factor on the
  // SAME severity/probability product (not a parallel candidate path). Keyed on
  // the EDGE (the trade tie belongs to the pair). 1.0 ⇒ no-op ⇒ byte-identical
  // when the war layer is off (the map is empty).
  const tradeFactor = signedTradeSalienceFactor(
    /** @type {Record<string, any>} */ (tradeSalienceFactor)?.[key],
    direction,
  );
  return {
    id: `candidate.relationship.${candidateType}.${key}.${tick}`,
    type: condition ? "condition" : "relationship",
    candidateType,
    ruleId,
    ruleFamily: "relationship",
    relationshipKey: key,
    targetSaveId: targetSaveId || settlements.from,
    severity: clamp01(severity * factor * tradeFactor),
    probability: clamp01(probability * factor * tradeFactor),
    applyMode,
    headline: toType
      ? `${relState.relationshipType.replace(/_/g, " ")} may become ${toType.replace(/_/g, " ")}`
      : `${relState.relationshipType.replace(/_/g, " ")} relationship may shift`,
    summary: summary || reasons?.[0] || "Relationship pressure creates a world pulse outcome.",
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

// PAIR-STABLE attribution for genuinely mutual drifts (an arms race, a thaw,
// a shared border incident): news/inbox rows land on the lower-sorted
// settlement id, so attribution never flips with edge authoring order.
const pairStableId = (edge) => {
  const s = getRelationshipSettlements(edge);
  return String(s.from) <= String(s.to) ? String(s.from) : String(s.to);
};

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

// Z2a homeostasis gearing — the DIRECT war-cost penalty subtracted from raw
// strength. The headline finding (§6): war_drain dropped economic_capacity 18pts but
// settlementStrength moved <1% per front, because economic_capacity has NO wired path
// into the `economy` PRESSURE the strength term reads (pressureModel's economy is
// trade/labor/infra/food only). So the homeostasis loop never closed — a besieging
// realm never lost the confidence to keep fighting and wars ran forever. The fix
// reads the AGGRESSOR's own war conditions DIRECTLY off the item and subtracts a
// meaningful penalty: war_drain (the reverting per-tick bleed) AND war_exhaustion
// (the NON-REVERTING scar — see activeConditions). Both are stamped ONLY by the gated
// war layer, so a no-war settlement carries neither ⇒ penalty 0 ⇒ BYTE-IDENTICAL.
const WAR_DRAIN_STRENGTH_WEIGHT = 0.20;      // a full war_drain costs up to 0.20 strength
const WAR_EXHAUSTION_STRENGTH_WEIGHT = 0.22; // the scar bites at least as hard, and lasts
function warCostPenalty(/** @type {any} */ item) {
  const conditions = item?.settlement?.activeConditions || item?.activeConditions || [];
  if (!Array.isArray(conditions) || !conditions.length) return 0;
  let drain = 0;
  let exhaustion = 0;
  for (const c of conditions) {
    if (!c) continue;
    const sev = Number(c.severity) || 0;
    if (c.archetype === "war_drain") drain = Math.max(drain, sev);
    else if (c.archetype === "war_exhaustion") exhaustion = Math.max(exhaustion, sev);
  }
  return drain * WAR_DRAIN_STRENGTH_WEIGHT + exhaustion * WAR_EXHAUSTION_STRENGTH_WEIGHT;
}

// Exported for the war layer (Feature A): the SAME confidence input the
// subjugation/rival contests read, reused verbatim so a deploy-confidence gate
// and the relationship gate can never diverge. 0..1.
export function settlementStrength(/** @type {any} */ item, /** @type {any} */ pressure = {}) {
  const pop = populationFor(item);
  const popScore = Math.min(1, Math.log10(Math.max(10, pop)) / 5);
  // economy (0.12) is the war-layer homeostasis lever (OQ7=A, Phase 0). conflict
  // stays 0.18 so war's direct effect isn't diluted; the weight came from tier/pop/
  // trade/legitimacy. Weights sum to 1.0. The war-cost penalty (Z2a) is then
  // subtracted OUTSIDE the weighted blend — it is a direct, gearing-raising erosion
  // (not a pressure diluted by a small weight), so sustained war meaningfully lowers
  // the aggressor's confidence and the homeostasis loop CLOSES. Byte-identical when
  // no war_drain/war_exhaustion condition is present (no-war settlement).
  return clamp01(
    tierRankFor(item) / Math.max(1, TIER_ORDER.length - 1) * 0.36
    + popScore * 0.20
    + (1 - (pressure.conflict || 0)) * 0.18
    + (1 - (pressure.trade || 0)) * 0.08
    + (1 - (pressure.legitimacy || 0)) * 0.06
    + (1 - (pressure.economy || 0)) * 0.12
    - warCostPenalty(item),
  );
}

// ── Per-tick relationship index ──────────────────────────────────────────────
// The candidate helpers (protectorBackingScore, relationshipThirdParties,
// sharedHostileThird, relationshipTypeBetween) each used to RESCAN the full
// edge list and re-run normalizeRelationshipEdge + ensureRelationshipState on
// every edge, every call — making the per-tick relationship pass O(E^2)–O(E^3)
// with thousands of redundant state allocations. buildRelationshipIndex runs
// ONCE per evaluateRelationshipRules and precomputes:
//   • records:    one normalized edge + ensured relState per raw edge, in
//                 edge-list order (so order-dependent tiebreaks are preserved);
//   • adjacency:  Map<settlementId, record[]> of incident edges, edge-order;
//   • pairType:   Map<"a|b", relationshipType> — FIRST edge pairing a&b wins
//                 (matches relationshipTypeBetween's first-match-in-order);
//   • hostileTo:  Map<settlementId, Set<otherId>> for hostile/cold_war edges.
// The helpers below read from this index (O(degree) instead of O(E)) and
// produce byte-identical results to the pre-index scans.
function buildRelationshipIndex(snapshot) {
  const states = snapshot?.worldState?.relationshipStates || {};
  const rawEdges = snapshot?.regionalGraph?.edges || snapshot?.relationships || [];
  /** @type {Array<{key:string, edge:any, relState:any, from:string, to:string}>} */
  const records = [];
  /** @type {Map<string, Array<{key:string, edge:any, relState:any, from:string, to:string}>>} */
  const adjacency = new Map();
  /** @type {Map<string, string>} */
  const pairType = new Map();
  /** @type {Map<string, Set<string>>} */
  const hostileTo = new Map();
  const addAdj = (/** @type {string} */ id, /** @type {any} */ rec) => {
    let list = adjacency.get(id);
    if (!list) { list = []; adjacency.set(id, list); }
    list.push(rec);
  };
  const addHostile = (/** @type {string} */ id, /** @type {string} */ other) => {
    let set = hostileTo.get(id);
    if (!set) { set = new Set(); hostileTo.set(id, set); }
    set.add(other);
  };
  for (const rawEdge of rawEdges) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const key = relationshipKeyFromEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[key]);
    const s = getRelationshipSettlements(edge);
    const from = String(s.from);
    const to = String(s.to);
    const rec = { key, edge, relState, from, to };
    records.push(rec);
    addAdj(from, rec);
    if (to !== from) addAdj(to, rec);
    // First-match-in-edge-order pair → type (mirrors relationshipTypeBetween).
    const pairKeyFwd = `${from}|${to}`;
    const pairKeyRev = `${to}|${from}`;
    if (!pairType.has(pairKeyFwd)) pairType.set(pairKeyFwd, relState.relationshipType);
    if (!pairType.has(pairKeyRev)) pairType.set(pairKeyRev, relState.relationshipType);
    if (relState.relationshipType === "hostile" || relState.relationshipType === "cold_war") {
      addHostile(from, to);
      addHostile(to, from);
    }
  }
  return { records, adjacency, pairType, hostileTo };
}

function relationshipTypeBetween(ctx, a, b) {
  const index = ctx?.relIndex;
  if (index) return index.pairType.get(`${String(a)}|${String(b)}`) || null;
  // Fallback for callers without a precomputed index (legacy/direct callers).
  const snapshot = ctx?.snapshot || ctx;
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
  // Only the target's incident edges can carry a protector — read them from the
  // per-tick adjacency index (O(degree)) instead of rescanning every edge.
  const index = ctx.relIndex || buildRelationshipIndex(ctx.snapshot);
  const selfKey = relationshipKeyFromEdge(ctx.originalEdge || ctx.edge);
  const targetStr = String(targetId);
  let max = 0;
  for (const rec of index.adjacency.get(targetStr) || []) {
    const { key, edge, relState } = rec;
    if (key === selfKey) continue;
    const s = { from: rec.from, to: rec.to };
    let protectorId = null;
    let score = 0;

    if (relState.relationshipType === "allied" && (String(s.from) === String(targetId) || String(s.to) === String(targetId))) {
      protectorId = String(s.from) === String(targetId) ? s.to : s.from;
      score = 0.22 + relState.pactStrength * 0.36 + relState.trust * 0.22;
    } else if (relState.relationshipType === "trade_partner" && (String(s.from) === String(targetId) || String(s.to) === String(targetId))) {
      protectorId = String(s.from) === String(targetId) ? s.to : s.from;
      score = 0.08 + relState.dependency * 0.16 + relState.trust * 0.12;
    } else if (relState.relationshipType === "patron" || relState.relationshipType === "vassal") {
      // H16: the protecting senior party resolves state-first, not by raw
      // edge orientation (a subjugation may have crowned the authored 'to').
      const roles = relationshipRoles(edge, relState);
      if (roles.juniorId === String(targetId)) {
        protectorId = roles.seniorId;
        score = relState.relationshipType === "vassal"
          ? 0.38 + relState.leverage * 0.28 + relState.pactStrength * 0.22
          : 0.28 + relState.leverage * 0.28 + relState.pactStrength * 0.18;
      }
    }

    if (!protectorId || String(protectorId) === String(attackerId)) continue;
    const protector = itemFor(ctx.snapshot, protectorId);
    score += settlementStrength(protector) * 0.16;
    const protectorToAttacker = relationshipTypeBetween(ctx, protectorId, attackerId);
    if (["allied", "trade_partner", "patron", "vassal"].includes(protectorToAttacker)) score *= 0.48;
    if (["hostile", "cold_war", "rival"].includes(protectorToAttacker)) score *= 1.18;
    max = Math.max(max, clamp01(score));
  }
  return clamp01(max);
}

function canSubjugateDirection(ctx, { overlordId, vassalId, overlordPressure, vassalPressure }) {
  const source = itemFor(ctx.snapshot, overlordId);
  const target = itemFor(ctx.snapshot, vassalId);
  if (!source || !target) return null;
  const sourceRank = tierRankFor(source);
  const targetRank = tierRankFor(target);
  if (sourceRank < targetRank) return null;
  if (sourceRank === targetRank && populationFor(source) < populationFor(target) * 0.72) return null;
  const sourceStrength = settlementStrength(source, overlordPressure);
  const targetStrength = settlementStrength(target, vassalPressure);
  const backing = protectorBackingScore(ctx, vassalId, overlordId);
  if (sourceStrength < (targetStrength + backing * 0.8) * 0.82) return null;
  return { overlordId: String(overlordId), vassalId: String(vassalId), strength: sourceStrength };
}

// H16: subjugation is decided by STATE — the stronger side qualifies no matter
// which side the save authored at 'from'. Both directions run the original
// math; if both qualify the stronger side leads, with the settlement id as a
// stable, orientation-independent tiebreak.
function subjugationDirection(ctx) {
  const settlements = getRelationshipSettlements(ctx.edge);
  const forward = canSubjugateDirection(ctx, {
    overlordId: settlements.from,
    vassalId: settlements.to,
    overlordPressure: ctx.sourcePressure,
    vassalPressure: ctx.targetPressure,
  });
  const reverse = canSubjugateDirection(ctx, {
    overlordId: settlements.to,
    vassalId: settlements.from,
    overlordPressure: ctx.targetPressure,
    vassalPressure: ctx.sourcePressure,
  });
  if (forward && reverse) {
    if (forward.strength !== reverse.strength) return forward.strength > reverse.strength ? forward : reverse;
    return forward.overlordId <= reverse.overlordId ? forward : reverse;
  }
  return forward || reverse || null;
}

function patronageEligibilityDirection(ctx, { patronId, clientId, patronPressure, clientPressure }) {
  const source = itemFor(ctx.snapshot, patronId);
  const target = itemFor(ctx.snapshot, clientId);
  if (!source || !target) return { eligible: false, reason: "missing_settlement" };
  const sourceRank = tierRankFor(source);
  const targetRank = tierRankFor(target);
  const sourceStrength = settlementStrength(source, patronPressure);
  const targetStrength = settlementStrength(target, clientPressure);
  const sustainedTrade = ctx.relState.tradeBalance > 0.54
    || ctx.relState.dependency > 0.44
    || (ctx.relState.history || []).some(item => /trade|route|patron|client|dependency/i.test(`${item.type || ""} ${item.reason || ""}`));
  const stronger = sourceRank > targetRank || sourceStrength >= targetStrength + 0.14;
  return {
    eligible: stronger && sustainedTrade,
    reason: stronger ? (sustainedTrade ? "eligible" : "needs_sustained_trade") : "source_not_stronger",
    patronSaveId: String(patronId),
    clientSaveId: String(clientId),
    sourceStrength,
    targetStrength,
    sourceRank,
    targetRank,
    sustainedTrade,
  };
}

// H16: patronage forms from the STRONGER side regardless of edge orientation;
// same math both ways, stronger patron wins a double-qualify, id tiebreak.
function patronageEligibility(ctx) {
  const settlements = getRelationshipSettlements(ctx.edge);
  const forward = patronageEligibilityDirection(ctx, {
    patronId: settlements.from,
    clientId: settlements.to,
    patronPressure: ctx.sourcePressure,
    clientPressure: ctx.targetPressure,
  });
  const reverse = patronageEligibilityDirection(ctx, {
    patronId: settlements.to,
    clientId: settlements.from,
    patronPressure: ctx.targetPressure,
    clientPressure: ctx.sourcePressure,
  });
  if (forward.eligible && reverse.eligible) {
    if (forward.sourceStrength !== reverse.sourceStrength) return forward.sourceStrength > reverse.sourceStrength ? forward : reverse;
    return forward.patronSaveId <= reverse.patronSaveId ? forward : reverse;
  }
  return forward.eligible ? forward : reverse.eligible ? reverse : forward;
}

function relationshipThirdParties(ctx, settlementId, types = []) {
  const typeSet = new Set(types);
  const index = ctx?.relIndex || buildRelationshipIndex(ctx?.snapshot || ctx);
  const sid = String(settlementId);
  const out = [];
  for (const rec of index.adjacency.get(sid) || []) {
    if (typeSet.size && !typeSet.has(rec.relState.relationshipType)) continue;
    // Match the original first/second-assignment semantics: from===sid resolves
    // the third party to `to`, but a to===sid match (incl. a self-loop) wins and
    // resolves to `from`.
    let thirdPartyId = null;
    if (rec.from === sid) thirdPartyId = rec.to;
    if (rec.to === sid) thirdPartyId = rec.from;
    if (!thirdPartyId) continue;
    out.push({ relationshipKey: rec.key, thirdPartyId, relationshipType: rec.relState.relationshipType, relState: rec.relState });
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

function sharedHostileThird(ctx, a, b) {
  // The hostile/cold_war adjacency sets are precomputed once per tick; the
  // intersection is sorted, so the result is stable regardless of edge-authoring
  // order (the lowest-sorted common enemy when several exist).
  const index = ctx?.relIndex || buildRelationshipIndex(ctx?.snapshot || ctx);
  const hostileToA = index.hostileTo.get(String(a));
  const hostileToB = index.hostileTo.get(String(b));
  if (!hostileToA || !hostileToB) return null;
  return [...hostileToA].filter(id => hostileToB.has(id)).sort()[0] || null;
}

function sharedEnemyAllianceCandidate(ctx) {
  const settlements = getRelationshipSettlements(ctx.edge);
  if (!settlements.from || !settlements.to) return null;
  if (["allied", "hostile", "cold_war", "vassal"].includes(ctx.relState.relationshipType)) return null;
  // Cheap precheck inside sharedHostileThird: returns null immediately unless
  // BOTH parties have at least one hostile/cold_war edge in the precomputed
  // index, so this is no longer an unconditional O(E) scan per edge.
  const enemyId = sharedHostileThird(ctx, settlements.from, settlements.to);
  if (!enemyId) return null;
  const trustGate = ctx.relState.trust + ctx.relState.pactStrength * 0.4 - ctx.relState.resentment * 0.35;
  if (trustGate < 0.22) return null;
  return labelProposal(ctx, "allied", "shared_enemy_alliance", {
    ruleId: "shared_enemy_alliance",
    targetSaveId: pairStableId(ctx.edge),
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
        targetSaveId: pairStableId(ctx.edge),
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
        targetSaveId: pairStableId(ctx.edge),
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
        targetSaveId: pairStableId(ctx.edge),
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
        targetSaveId: eligibility.clientSaveId,
        relationshipPatch: {
          dependency: clamp01(relState.dependency + 0.06),
          leverage: clamp01(relState.leverage + 0.06),
          patronSaveId: eligibility.patronSaveId,
          clientSaveId: eligibility.clientSaveId,
          trajectory: "tightening",
        },
        metadata: { imbalance, patronageEligibility: eligibility.reason, patronSaveId: eligibility.patronSaveId, clientSaveId: eligibility.clientSaveId },
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
        targetSaveId: pairStableId(ctx.edge),
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
        targetSaveId: eligibility.clientSaveId,
        relationshipPatch: {
          dependency: clamp01(relState.dependency + 0.07),
          leverage: clamp01(relState.leverage + 0.07),
          resentment: clamp01(relState.resentment + 0.03),
          patronSaveId: eligibility.patronSaveId,
          clientSaveId: eligibility.clientSaveId,
          trajectory: "tightening",
        },
        metadata: { patronageEligibility: eligibility.reason, patronSaveId: eligibility.patronSaveId, clientSaveId: eligibility.clientSaveId },
      }),
    );
    }
  }

  if (!hasRecentIncident(relState, "route_disruption", tick) && tradeStress > 0.28) {
    candidates.push(
      internalDrift(ctx, "trade_route_disruption", {
        ruleId: "trade_route_disruption",
        targetSaveId: pairStableId(ctx.edge),
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
        targetSaveId: pairStableId(ctx.edge),
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
  const { edge, relState, sourcePressure, targetPressure } = ctx;
  const settlements = getRelationshipSettlements(edge);
  // H16: the alliance burden lands on the side actually carrying the support
  // cost. Each direction is scored with the original formula (the partner's
  // food/conflict/disease strain plus the supporter's own conflict exposure)
  // and the heavier direction wins; ties break on settlement id, so the
  // outcome never depends on which side the save authored at 'from'.
  const burdenOnFrom = mean(targetPressure.food, targetPressure.conflict, targetPressure.disease, sourcePressure.conflict);
  const burdenOnTo = mean(sourcePressure.food, sourcePressure.conflict, sourcePressure.disease, targetPressure.conflict);
  const fromSupports = burdenOnFrom === burdenOnTo
    ? String(settlements.from) <= String(settlements.to)
    : burdenOnFrom > burdenOnTo;
  const supporterId = String(fromSupports ? settlements.from : settlements.to);
  const supportedId = String(fromSupports ? settlements.to : settlements.from);
  const supportedConflict = fromSupports ? targetPressure.conflict : sourcePressure.conflict;
  const burden = fromSupports ? burdenOnFrom : burdenOnTo;
  const endurance = clamp01(relState.pactStrength + relState.trust * 0.4 - relState.obligationFatigue * 0.45);
  const candidates = [];

  if (burden > 0.24) {
    candidates.push(
      candidateBase({
        ...ctx,
        candidateType: "ally_burden",
        ruleId: "allied_aid_buffer",
        type: "condition",
        targetSaveId: supporterId,
        severity: Math.min(0.74, burden * 0.72),
        probability: 0.18 + relState.trust * 0.18 + relState.pactStrength * 0.16,
        reasons: [
          "An ally buffers pressure, but the support becomes a real burden on the supporting settlement.",
          `Burden ${burden.toFixed(2)}, endurance ${endurance.toFixed(2)}.`,
        ],
        relationshipPatch: {
          aidBurden: clamp01(relState.aidBurden + burden * 0.12),
          militaryBurden: clamp01(relState.militaryBurden + supportedConflict * 0.1),
          obligationFatigue: clamp01(relState.obligationFatigue + burden * 0.08),
        },
        condition: {
          archetype: "alliance_burden",
          severity: Math.min(0.74, burden * 0.72),
          source: "world_pulse_relationship",
          relatedSettlementId: supportedId,
        },
        metadata: { endurance, burden, supporterSaveId: supporterId, supportedSaveId: supportedId },
      }),
    );
  }

  // H16 triage: the obligation gate reads BOTH allies — whichever side is
  // under conflict/hostility pressure pulls the OTHER into the obligation,
  // never the authored 'to'. When both qualify, the harder-pressed side is
  // the one mirrored; an exact tie breaks on the sorted pair.
  const fromThreat = Math.max(sourcePressure.conflict, sourcePressure.hostility);
  const toThreat = Math.max(targetPressure.conflict, targetPressure.hostility);
  if (fromThreat > 0.45 || toThreat > 0.45) {
    const toIsPressured = fromThreat === toThreat
      ? String(settlements.to) <= String(settlements.from)
      : toThreat > fromThreat;
    const pressuredId = String(toIsPressured ? settlements.to : settlements.from);
    const obligatedId = String(toIsPressured ? settlements.from : settlements.to);
    candidates.push(
      internalDrift(ctx, "ally_conflict_mirror", {
        ruleId: "allied_conflict_obligation",
        targetSaveId: obligatedId,
        severity: 0.28 + Math.max(fromThreat, toThreat) * 0.48,
        probability: 0.1 + relState.pactStrength * 0.22 + relState.trust * 0.12,
        reasons: ["An ally faces a gated obligation to mirror the hostility or cold-war pressure bearing on its partner."],
        relationshipPatch: {
          militaryBurden: clamp01(relState.militaryBurden + 0.08),
          obligationFatigue: clamp01(relState.obligationFatigue + 0.06),
          trajectory: "committed",
        },
        metadata: { incidentType: "conflict_obligation", obligatedSaveId: obligatedId, pressuredSaveId: pressuredId },
      }),
    );
  }

  // H16 triage: EITHER ally may be the one fighting a cold war — the other
  // side is the supporter, whichever way the save authored the edge. When
  // both allies have cold-war fronts the higher-resentment front is supported
  // first; an exact tie breaks on the sorted pair.
  const fromColdWar = relationshipThirdParties(ctx, settlements.from, ["cold_war"])[0];
  const toColdWar = relationshipThirdParties(ctx, settlements.to, ["cold_war"])[0];
  let supportedColdWar = fromColdWar || toColdWar;
  let supportedAllyId = String(fromColdWar ? settlements.from : settlements.to);
  if (fromColdWar && toColdWar) {
    const supportTo = fromColdWar.relState.resentment === toColdWar.relState.resentment
      ? String(settlements.to) <= String(settlements.from)
      : toColdWar.relState.resentment > fromColdWar.relState.resentment;
    supportedColdWar = supportTo ? toColdWar : fromColdWar;
    supportedAllyId = String(supportTo ? settlements.to : settlements.from);
  }
  if (supportedColdWar) {
    const supportingAllyId = String(supportedAllyId === String(settlements.from) ? settlements.to : settlements.from);
    const supporterToThird = relationshipTypeBetween(ctx, supportingAllyId, supportedColdWar.thirdPartyId);
    const hesitation = ["allied", "trade_partner", "patron", "vassal"].includes(supporterToThird) ? 0.46 : 1;
    candidates.push(
      internalDrift(ctx, "ally_cold_war_support", {
        ruleId: "allied_cold_war_support",
        targetSaveId: supportingAllyId,
        severity: clamp01((0.28 + relState.pactStrength * 0.26 + supportedColdWar.relState.resentment * 0.18) * hesitation),
        probability: clamp01((0.08 + relState.trust * 0.14 + relState.pactStrength * 0.16) * hesitation),
        reasons: [
          hesitation < 1
            ? "The ally supports cold-war pressure through sanctions or intelligence, but hesitates because the target is also tied to them."
            : "The ally supports cold-war pressure with sanctions, intelligence, or proxy aid.",
          `Cold-war third party: ${supportedColdWar.thirdPartyId}.`,
        ],
        relationshipPatch: {
          militaryBurden: clamp01(relState.militaryBurden + 0.04 * hesitation),
          obligationFatigue: clamp01(relState.obligationFatigue + 0.05 * hesitation),
          pactStrength: clamp01(relState.pactStrength + 0.015 * hesitation),
          trajectory: hesitation < 1 ? "cautious_cold_war_support" : "cold_war_support",
        },
        metadata: {
          incidentType: "cold_war_support",
          thirdPartyId: supportedColdWar.thirdPartyId,
          hesitation,
          sourceRelationshipToThird: supporterToThird,
          supporterSaveId: supportingAllyId,
          supportedSaveId: supportedAllyId,
        },
      }),
    );
  }

  if (relState.obligationFatigue > 0.52 || (burden > endurance && relState.resentment > 0.22)) {
    candidates.push(
      labelProposal(ctx, "trade_partner", "allied_overburdened", {
        ruleId: "allied_overburdened",
        // The cooling is attributed to the side carrying the cost.
        targetSaveId: supporterId,
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
        targetSaveId: pairStableId(ctx.edge),
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
  const { edge, relState, sourcePressure, targetPressure } = ctx;
  // H16: a pulse-driven patronage may have crowned the edge's authored 'to'
  // side as the patron — roles and the per-side pressures follow the STATE
  // stamp, like vassalRules. A DM-authored patron edge has no stamp and
  // keeps strict edge direction (from = patron).
  const { seniorId: patronId, reversed } = relationshipRoles(edge, relState);
  const patronPressure = reversed ? targetPressure : sourcePressure;
  const clientPressure = reversed ? sourcePressure : targetPressure;
  const clientStrain = mean(clientPressure.food, clientPressure.trade, clientPressure.legitimacy);
  const patronExposure = mean(patronPressure.economy, patronPressure.trade);
  const candidates = [];

  candidates.push(
    internalDrift(ctx, "patron_extracts_tribute", {
      ruleId: "patron_extracts_tribute",
      targetSaveId: patronId,
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

  if (clientPressure.conflict > 0.36 || clientPressure.crime > 0.42) {
    candidates.push(
      internalDrift(ctx, "patron_intervenes", {
        ruleId: "patron_intervenes",
        targetSaveId: patronId,
        severity: 0.28 + Math.max(clientPressure.conflict, clientPressure.crime) * 0.44,
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
    (clientPressure.conflict > 0.46 || clientPressure.trade > 0.52)
    && patronExposure > 0.36
    && relState.dependency > 0.5
    && relState.trust > 0.34
  ) {
    candidates.push(
      labelProposal(ctx, "allied", "patron_protects_investment", {
        ruleId: "patron_to_allied_interest_protection",
        targetSaveId: patronId,
        severity: 0.38 + Math.max(clientPressure.conflict, clientPressure.trade) * 0.28 + patronExposure * 0.18,
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
        targetSaveId: patronId,
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

  if (patronPressure.conflict > 0.55 && relState.dependency > 0.62) {
    candidates.push(
      internalDrift(ctx, "patron_forces_alignment", {
        ruleId: "patron_forces_alignment",
        targetSaveId: patronId,
        severity: 0.36 + patronPressure.conflict * 0.32,
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
  // H16: a subjugation may have crowned the edge's authored 'to' side as the
  // overlord — roles and the per-side pressures follow the STATE stamp. A
  // DM-authored vassal edge has no stamp and keeps strict edge direction.
  const { seniorId: overlordId, juniorId: vassalId, reversed } = relationshipRoles(edge, relState);
  const overlordPressure = reversed ? targetPressure : sourcePressure;
  const vassalPressure = reversed ? sourcePressure : targetPressure;
  const vassalStrain = mean(vassalPressure.legitimacy, vassalPressure.trade, vassalPressure.conflict, relState.resentment);
  const overlordWeakness = mean(overlordPressure.conflict, overlordPressure.legitimacy, overlordPressure.defense, overlordPressure.economy);
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

  const overlordColdWar = relationshipThirdParties(ctx, overlordId, ["cold_war"])[0];
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

  if (vassalPressure.conflict > 0.38 || vassalPressure.crime > 0.42) {
    candidates.push(
      internalDrift(ctx, "vassal_protection_burden", {
        ruleId: "vassal_protection_burden",
        severity: clamp01(0.26 + Math.max(vassalPressure.conflict, vassalPressure.crime) * 0.4),
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
  const vassalConfidence = clamp01(settlementStrength(vassalItem, vassalPressure) - settlementStrength(overlordItem, overlordPressure) + 0.45);
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
  // H16 triage: the CONFIDENT side of a power play is whichever rival is
  // stronger by state, never the authored 'from'. The gate requires a real
  // gap, so there is no tie case to fork.
  const confidenceGap = Math.abs(sourcePower - targetPower);
  const confidentId = String(sourcePower >= targetPower ? settlements.from : settlements.to);
  const candidates = [];

  candidates.push(
    internalDrift(ctx, "rival_arms_race", {
      ruleId: "rival_arms_race",
      targetSaveId: pairStableId(ctx.edge),
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
        targetSaveId: pairStableId(ctx.edge),
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
        targetSaveId: pairStableId(ctx.edge),
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
        targetSaveId: confidentId,
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
        metadata: { confidenceGap, confidentSaveId: confidentId },
      }),
    );
  }

  if (relState.trust > 0.38 && relState.resentment < 0.38 && Math.max(sourcePressure.conflict, targetPressure.conflict) < 0.24) {
    candidates.push(
      labelProposal(ctx, "trade_partner", "rival_detente", {
        ruleId: "rival_detente",
        targetSaveId: pairStableId(ctx.edge),
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
      targetSaveId: pairStableId(ctx.edge),
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
    // The proxy opening is in whichever settlement's legitimacy is weaker by
    // state; an exact tie breaks on the sorted pair.
    const fromDestabilized = sourcePressure.legitimacy === targetPressure.legitimacy
      ? String(settlements.from) <= String(settlements.to)
      : sourcePressure.legitimacy > targetPressure.legitimacy;
    const destabilizedId = String(fromDestabilized ? settlements.from : settlements.to);
    candidates.push(
      internalDrift(ctx, "cold_war_proxy_conflict", {
        ruleId: "cold_war_proxy_conflict",
        targetSaveId: destabilizedId,
        severity: 0.3 + Math.max(sourcePressure.legitimacy, targetPressure.legitimacy) * 0.38,
        probability: 0.08 + conflictStress * 0.16,
        reasons: ["Weak legitimacy gives cold-war rivals a proxy faction opening."],
        relationshipPatch: {
          leverage: clamp01(relState.leverage + 0.05),
          resentment: clamp01(relState.resentment + 0.04),
          trajectory: "destabilizing",
        },
        metadata: { incidentType: "proxy_conflict", destabilizedSaveId: destabilizedId },
      }),
    );
  }

  if ((exposure > 0.35 || tradeStress > 0.38) && relState.tradeBalance < 0.42) {
    // H16 triage: the sanction CONDITION lands on the economically weaker
    // side by STATE (higher economy/trade strain = more dependent on the
    // exposed supply line); the other side imposes. An exact tie breaks on
    // the sorted pair — never on which side the save authored at 'from'.
    const fromStrain = mean(sourcePressure.economy, sourcePressure.trade);
    const toStrain = mean(targetPressure.economy, targetPressure.trade);
    const fromSanctioned = fromStrain === toStrain
      ? String(settlements.from) <= String(settlements.to)
      : fromStrain > toStrain;
    const sanctionedId = String(fromSanctioned ? settlements.from : settlements.to);
    const imposerId = String(fromSanctioned ? settlements.to : settlements.from);
    candidates.push(
      candidateBase({
        ...ctx,
        candidateType: "cold_war_supply_sanctions",
        ruleId: "cold_war_supply_sanctions",
        type: "condition",
        targetSaveId: sanctionedId,
        severity: clamp01(0.3 + Math.max(exposure, tradeStress) * 0.42 + relState.leverage * 0.12),
        probability: clamp01(0.08 + Math.max(exposure, tradeStress) * 0.2 + relState.resentment * 0.08),
        reasons: [
          "Cold-war pressure follows exposed trade and supply channels through inspections, sanctions, and informal embargoes.",
          `${itemFor(ctx.snapshot, imposerId)?.name || imposerId} squeezes the strained economy of ${itemFor(ctx.snapshot, sanctionedId)?.name || sanctionedId}.`,
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
          relatedSettlementId: imposerId,
          affectedSystems: ["trade_connectivity", "public_legitimacy", "criminal_opportunity"],
        },
        metadata: { incidentType: "supply_sanctions", exposure, tradeStress, imposerSaveId: imposerId, sanctionedSaveId: sanctionedId },
      }),
    );
  }

  if (conflictStress > 0.68) {
    candidates.push(
      labelProposal(ctx, "hostile", "cold_war_escalation", {
        ruleId: "cold_war_escalation",
        targetSaveId: pairStableId(ctx.edge),
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
        targetSaveId: pairStableId(ctx.edge),
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

// Strength gaps below this are a genuine tie: the raid aggressor forks
// deterministically on pair identity + tick instead of edge orientation.
const RAID_STRENGTH_TIE = 0.04;

function hostileRules(ctx) {
  const { relState, sourcePressure, targetPressure } = ctx;
  const settlements = getRelationshipSettlements(ctx.edge);
  const powerGap = Math.abs(sourcePressure.defense - targetPressure.defense) + Math.abs(sourcePressure.economy - targetPressure.economy);
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict, relState.fear, relState.resentment);
  const candidates = [];

  // H16: either side of a war can raid. The aggressor is the stronger side by
  // STATE; a genuine strength tie forks on pair identity + tick, so a
  // symmetric war raids in both directions across ticks and never depends on
  // which side the save authored at 'from'.
  const fromStrength = settlementStrength(itemFor(ctx.snapshot, settlements.from), sourcePressure);
  const toStrength = settlementStrength(itemFor(ctx.snapshot, settlements.to), targetPressure);
  let aggressorId = fromStrength > toStrength ? String(settlements.from) : String(settlements.to);
  if (Math.abs(fromStrength - toStrength) <= RAID_STRENGTH_TIE) {
    const pair = [String(settlements.from), String(settlements.to)].sort();
    aggressorId = hash01(`raid.${pair[0]}.${pair[1]}.${ctx.tick}`) < 0.5 ? pair[0] : pair[1];
  }
  const victimId = aggressorId === String(settlements.from) ? String(settlements.to) : String(settlements.from);
  // H16 triage: attrition is read on the AGGRESSOR — the same state-decided
  // side the raid uses — never on the authored 'from'. High economy/defense/
  // legitimacy pressure on the attacking side saps support for the war.
  const aggressorPressure = aggressorId === String(settlements.from) ? sourcePressure : targetPressure;
  const attackerAttrition = mean(aggressorPressure.economy, aggressorPressure.defense, aggressorPressure.legitimacy, relState.militaryBurden);

  candidates.push(
    candidateBase({
      ...ctx,
      candidateType: "hostile_raid",
      ruleId: "hostile_raid",
      targetSaveId: victimId,
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
        relatedSettlementId: aggressorId,
      },
      metadata: { incidentType: "raid", aggressorSaveId: aggressorId, victimSaveId: victimId },
    }),
  );

  // H16: the STRONGER side qualifies to subjugate regardless of orientation.
  const subjugation = powerGap > 0.48 && conflictStress > 0.55 ? subjugationDirection(ctx) : null;
  if (subjugation) {
    const patchValues = {
      dependency: clamp01(relState.dependency + 0.08),
      fear: clamp01(relState.fear + 0.08),
      leverage: clamp01(relState.leverage + 0.08),
      trust: clamp01(relState.trust - 0.02),
    };
    // H15: the vassal cascade must be visible BEFORE the DM accepts — preview
    // the third-party realignments against the projected post-apply vassal
    // state and put them in the proposal summary.
    const cascadePreview = previewRelationshipHierarchyCascade({
      worldState: ctx.snapshot?.worldState,
      regionalGraph: ctx.snapshot?.regionalGraph,
      vassalEdge: ctx.originalEdge || ctx.edge,
      overlordId: subjugation.overlordId,
      vassalId: subjugation.vassalId,
      vassalState: { ...relState, ...patchValues, relationshipType: "vassal" },
    });
    const nameOf = (id) => itemFor(ctx.snapshot, id)?.name || id;
    const baseReason = "A hostile imbalance can create occupation, tribute, or forced vassalage pressure.";
    const realignmentSummary = cascadePreview.length
      ? ` Accepting also realigns ${cascadePreview.length} third-party relationship${cascadePreview.length > 1 ? "s" : ""}: ${cascadePreview
        .map(change => `${nameOf(change.thirdPartyId)} ${change.fromType.replace(/_/g, " ")} becomes ${change.toType.replace(/_/g, " ")}`)
        .join("; ")}.`
      : "";
    candidates.push(
      labelProposal(ctx, "vassal", "hostile_occupation_pressure", {
        ruleId: "hostile_occupation_pressure",
        severity: 0.52 + powerGap * 0.24 + conflictStress * 0.22,
        probability: 0.04 + powerGap * 0.14 + conflictStress * 0.12,
        summary: `${baseReason}${realignmentSummary}`,
        reasons: [
          baseReason,
          ...cascadePreview.map(change =>
            `Realignment on acceptance: ${nameOf(change.thirdPartyId)} shifts ${change.fromType.replace(/_/g, " ")} to ${change.toType.replace(/_/g, " ")} (${change.reason})`),
        ],
        targetSaveId: subjugation.vassalId,
        relationshipPatch: {
          ...patchValues,
          overlordSaveId: subjugation.overlordId,
          vassalSaveId: subjugation.vassalId,
          trajectory: "subjugating",
        },
        metadata: {
          powerGap,
          overlordSaveId: subjugation.overlordId,
          vassalSaveId: subjugation.vassalId,
        },
      }),
    );
  }

  // H16: the dominant side extracts — economic pressure is read per side
  // (higher pressure = the weaker economy), not by authoring orientation.
  if (relState.leverage > 0.45 && sourcePressure.economy !== targetPressure.economy) {
    const fromDominant = sourcePressure.economy < targetPressure.economy;
    const extractorId = String(fromDominant ? settlements.from : settlements.to);
    const tributeVictimId = String(fromDominant ? settlements.to : settlements.from);
    candidates.push(
      internalDrift(ctx, "hostile_forced_tribute", {
        ruleId: "hostile_forced_tribute",
        targetSaveId: tributeVictimId,
        severity: 0.32 + relState.leverage * 0.35,
        probability: 0.06 + relState.leverage * 0.16,
        reasons: ["The economically dominant hostile side may demand tribute before outright occupation."],
        relationshipPatch: {
          resentment: clamp01(relState.resentment + 0.05),
          dependency: clamp01(relState.dependency + 0.04),
          leverage: clamp01(relState.leverage + 0.04),
        },
        metadata: { incidentType: "forced_tribute", extractorSaveId: extractorId, victimSaveId: tributeVictimId },
      }),
    );
  }

  if (attackerAttrition > 0.55 && relState.resentment < 0.82) {
    candidates.push(
      labelProposal(ctx, "cold_war", "hostile_attrition_deescalation", {
        ruleId: "hostile_attrition_deescalation",
        targetSaveId: aggressorId,
        severity: clamp01(0.34 + attackerAttrition * 0.36),
        probability: clamp01(0.05 + attackerAttrition * 0.18 + relState.trust * 0.08),
        reasons: [
          `Open hostility is losing practical support as the economy, defenses, legitimacy, or manpower of ${itemFor(ctx.snapshot, aggressorId)?.name || aggressorId} — the aggressing side — slip.`,
          `Attacker attrition ${attackerAttrition.toFixed(2)}.`,
        ],
        relationshipPatch: {
          trust: clamp01(relState.trust + 0.025),
          fear: clamp01(relState.fear - 0.035),
          militaryBurden: clamp01(relState.militaryBurden - 0.04),
          trajectory: "attrition_deescalation",
        },
        metadata: { attackerAttrition, aggressorSaveId: aggressorId },
      }),
    );
  }

  if (relState.trust > 0.16 && relState.resentment < 0.62 && Math.max(sourcePressure.conflict, targetPressure.conflict) < 0.35) {
    candidates.push(
      labelProposal(ctx, "cold_war", "hostile_truce", {
        ruleId: "hostile_truce",
        targetSaveId: pairStableId(ctx.edge),
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
  const settlements = getRelationshipSettlements(ctx.edge);
  const crimePressure = mean(sourcePressure.crime, targetPressure.crime);
  const tradeStress = mean(sourcePressure.trade, targetPressure.trade);
  const legitimacyStress = mean(sourcePressure.legitimacy, targetPressure.legitimacy);
  const conflictStress = mean(sourcePressure.conflict, targetPressure.conflict);
  const candidates = [];

  if (!hasRecentIncident(relState, "smuggling_expansion", tick) && (crimePressure > 0.28 || tradeStress > 0.42)) {
    candidates.push(
      internalDrift(ctx, "criminal_smuggling_expands", {
        ruleId: "criminal_smuggling_expands",
        targetSaveId: pairStableId(ctx.edge),
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
    // The racket is sold where legitimacy is weaker by state; an exact tie
    // (or a purely fear-gated firing) breaks on the sorted pair.
    const fromRacketed = sourcePressure.legitimacy === targetPressure.legitimacy
      ? String(settlements.from) <= String(settlements.to)
      : sourcePressure.legitimacy > targetPressure.legitimacy;
    const racketedSaveId = String(fromRacketed ? settlements.from : settlements.to);
    candidates.push(
      internalDrift(ctx, "criminal_protection_racket", {
        ruleId: "criminal_protection_racket",
        targetSaveId: racketedSaveId,
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
        metadata: { incidentType: "protection_racket", racketedSaveId },
      }),
    );
  }

  if (conflictStress > 0.5 && relState.resentment > 0.48 && relState.fear > 0.42) {
    candidates.push(
      labelProposal(ctx, "cold_war", "criminal_to_cold_war", {
        ruleId: "criminal_to_cold_war",
        targetSaveId: pairStableId(ctx.edge),
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
        targetSaveId: pairStableId(ctx.edge),
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

// ── Phase B4 §6 — trade dependency → coercion + war-prevention / embargo ──────
// A critical-supplier dependency is LEVERAGE. The supplier can COERCE the
// dependent (a coercion candidate), and the dependent AVOIDS war with its
// critical supplier (extra hostility dampening is already applied via the
// CRITICAL_EXTRA_DAMPEN factor in tradeSalience). When military/religious tension
// spikes on the edge, a valuable tie can COLLAPSE into an embargo. A peaceful
// deity raises trade-diplomacy salience (a softer coercion, more likely to hold
// as leverage); a warlike deity makes the tie feel like a weapon (a sharper
// embargo-collapse). All gated on tradeSalienceInfo being present (war layer on +
// a valuable tie) ⇒ byte-identical legacy when absent.
//
// The cross-cutting candidate is emitted on the SORTED edge (a property of the
// pair), mirroring sharedEnemyAllianceCandidate. Returns null when no salience
// info is threaded or the tie is not critical / no tension spike.

// A settlement's embedded deity temper sign: warlike +1, peacelike −1, else 0.
// Reads the resolved primaryDeitySnapshot (store-decoupled), tolerant of the two
// field spellings the snapshot uses across phases.
function deityTemperSign(/** @type {any} */ settlement) {
  const deity = settlement?.config?.primaryDeitySnapshot;
  const axis = String(deity?.temperamentAxis || deity?.temperAxis || deity?.temper || '');
  if (/warlike|war/i.test(axis)) return 1;
  if (/peace/i.test(axis)) return -1;
  return 0;
}

function tradeLeverageCandidate(ctx) {
  const info = ctx.tradeSalienceInfo;
  if (!info || !Number.isFinite(info.salience) || info.salience <= 0) return null;
  const settlements = getRelationshipSettlements(ctx.edge);
  if (!settlements.from || !settlements.to) return null;
  const relType = ctx.relState.relationshipType;
  // Battlefield enemies don't carry a normal trade tie — any commerce there is
  // covert/forced (the overlay handles it); no peacetime coercion/embargo rule.
  if (isBattlefieldPrimary(relType)) return null;

  const dependentId = String(info.dependentId || settlements.from);
  const supplierId = String(info.supplierId || settlements.to);
  if (dependentId === supplierId) return null;
  const dependentItem = itemFor(ctx.snapshot, dependentId);
  const supplierItem = itemFor(ctx.snapshot, supplierId);
  // Military/religious tension on the edge — the trigger for an embargo collapse.
  const dependentPressure = dependentId === String(settlements.from) ? ctx.sourcePressure : ctx.targetPressure;
  const supplierPressure = supplierId === String(settlements.from) ? ctx.sourcePressure : ctx.targetPressure;
  const militaryTension = Math.max(
    dependentPressure.conflict, supplierPressure.conflict,
    dependentPressure.hostility, supplierPressure.hostility,
    ctx.relState.resentment, ctx.relState.fear,
  );
  // A warlike supplier deity sharpens the embargo; a peaceful one softens it.
  const supplierTemper = deityTemperSign(supplierItem?.settlement);
  const dependentTemper = deityTemperSign(dependentItem?.settlement);
  // Tension that collapses the tie: high resentment/conflict + a non-pacific
  // deity tilt. A peaceful deity raises the bar (the tie is diplomacy, not a
  // weapon); a warlike one lowers it.
  const tensionDrive = clamp01(militaryTension + supplierTemper * 0.12 + dependentTemper * 0.06);

  // EMBARGO COLLAPSE: a valuable tie + a real tension spike ⇒ the supplier (or
  // the dependent, when adversarial) weaponizes the dependency. Stamps a coercive
  // economic condition on the dependent + an embargo trajectory.
  if (info.critical && tensionDrive > 0.5) {
    const sev = clamp01(0.32 + info.salience * 0.3 + tensionDrive * 0.24);
    return candidateBase({
      ...ctx,
      candidateType: "trade_embargo_collapse",
      ruleId: "trade_dependency_embargo",
      type: "condition",
      targetSaveId: dependentId,
      severity: sev,
      probability: clamp01(0.05 + tensionDrive * 0.18 + info.salience * 0.08),
      reasons: [
        "A valuable, hard-to-replace trade dependency has become a weapon: rising military or religious tension collapses it into an embargo.",
        `Trade salience ${info.salience.toFixed(2)} with tension ${tensionDrive.toFixed(2)}.`,
      ],
      relationshipPatch: {
        tradeBalance: clamp01(ctx.relState.tradeBalance - 0.08),
        resentment: clamp01(ctx.relState.resentment + 0.05),
        leverage: clamp01(ctx.relState.leverage + 0.05),
        dependency: clamp01(ctx.relState.dependency - 0.04),
        trajectory: "embargo_collapse",
      },
      condition: {
        // label / description / affectedSystems now come from the trade_embargo
        // catalog template (activeConditions.js) — same as alliance_burden et al.
        archetype: "trade_embargo",
        severity: sev,
        source: "world_pulse_relationship",
        relatedSettlementId: supplierId,
      },
      metadata: {
        incidentType: "trade_embargo",
        secondaryStatus: "embargo",
        tradeSalience: info.salience,
        tensionDrive,
        supplierSaveId: supplierId,
        dependentSaveId: dependentId,
      },
    });
  }

  // COERCION: a critical-supplier dependency without an open spike lets the
  // supplier press its advantage — a non-violent leverage candidate (concessions,
  // preferential terms). De-escalation-shaped (it is an ALTERNATIVE to war), so
  // the salience factor RAISES it. The dependent's own avoidance of war with its
  // supplier is already in the dampener; this is the supplier's active push.
  if (info.critical && militaryTension < 0.5) {
    const sev = clamp01(0.26 + info.salience * 0.28);
    return internalDrift(ctx, "trade_dependency_coercion", {
      ruleId: "trade_dependency_coercion",
      targetSaveId: supplierId,
      severity: sev,
      probability: clamp01(0.06 + info.salience * 0.14),
      reasons: [
        "A critical-supplier dependency is leverage: the supplier extracts concessions or preferential terms rather than risk war over the relationship.",
        `Trade salience ${info.salience.toFixed(2)} (critical supplier).`,
      ],
      relationshipPatch: {
        leverage: clamp01(ctx.relState.leverage + 0.05),
        dependency: clamp01(ctx.relState.dependency + 0.03),
        tradeBalance: clamp01(ctx.relState.tradeBalance + 0.02),
        trajectory: "supplier_leverage",
      },
      metadata: {
        incidentType: "trade_coercion",
        secondaryStatus: "critical_supplier",
        tradeSalience: info.salience,
        supplierSaveId: supplierId,
        dependentSaveId: dependentId,
      },
    });
  }
  return null;
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

// Exported for the war layer (Feature A): builds the {conflict,trade,legitimacy,
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

export function evaluateRelationshipRules(snapshot, pressureIdx, /** @type {any} */ context = {}) {
  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const states = snapshot?.worldState?.relationshipStates || {};
  // Build the per-tick relationship index ONCE: the candidate helpers
  // (protectorBackingScore, relationshipThirdParties, sharedHostileThird,
  // relationshipTypeBetween) read from it via ctx.relIndex instead of each
  // rescanning the full edge list — collapsing the pass from O(E^2)–O(E^3) to
  // ~O(E·avgDegree) with one ensureRelationshipState allocation per edge.
  const relIndex = buildRelationshipIndex(snapshot);

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
      // Precomputed per-tick adjacency / relationship-state / hostile-set index
      // shared by every candidate helper (see buildRelationshipIndex).
      relIndex,
      tick,
      // Feature C: per-settlement aggressiveness multipliers (centered on 1.0).
      // Empty/absent ⇒ every candidate factor is 1.0 ⇒ byte-identical legacy.
      dispositionFactor: context.dispositionFactor || EMPTY_DISPOSITION,
      // Phase B4: per-EDGE trade-salience multipliers (centered on 1.0). A valuable
      // trade tie DAMPENS hostile/escalation candidates on that edge. Empty/absent
      // ⇒ 1.0 in every branch ⇒ byte-identical legacy (off-path map is empty).
      tradeSalienceFactor: context.tradeSalienceFactor || EMPTY_TRADE_SALIENCE,
      // Phase B4: per-EDGE salience rollup ({ salience, critical, dependentId,
      // supplierId }) for the coercion/embargo cross-cutting rules. Absent/empty ⇒
      // the §6 leverage rules emit nothing ⇒ byte-identical legacy.
      tradeSalienceInfo: /** @type {any} */ (context.tradeSalienceInfo || EMPTY_TRADE_SALIENCE)[key] || null,
    };
    return [
      ...evaluator(ctx),
      tradeLeverageCandidate(ctx),
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
    // H16: seniority stamps are only meaningful for the label that minted
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
