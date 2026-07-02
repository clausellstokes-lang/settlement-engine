/**
 * domain/worldPulse/relationshipRuleHelpers.js — pure helper leaf for the
 * relationship-evolution rules: pressure readers, the candidate builders
 * (candidateBase / labelProposal / internalDrift), the per-tick relationship
 * index, strength/eligibility math, and the shared-enemy-alliance candidate.
 *
 * Extracted verbatim from relationshipEvolution.js as part of the god-module
 * split — every body is byte-identical. Imports only data + the relationship-
 * state core, so both rule modules and the orchestrator depend on it with no cycle.
 */
import { TIER_ORDER } from '../../data/constants.js';
import { clamp01, normalizeRelationshipType, relationshipKeyFromEdge, getRelationshipSettlements, relationshipRoles, normalizeRelationshipEdge, ensureRelationshipState } from './relationshipState.js';

const stablePart = (/** @type {any} */ value) =>
  String(value || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

// Deterministic 0..1 fork keyed on identity text (FNV-1a + avalanche). Used
// ONLY to break genuine state ties (e.g. which side of a perfectly symmetric
// war raids this tick) — keyed on the SORTED pair + tick so the result is
// identical whichever side the save happened to author at 'from'. The fmix32
// finalizer matters: without it, single-character tick changes barely move
// the high bits and one side raids for ten straight ticks.
function hash01(/** @type {any} */ text) {
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

const pressureFor = (/** @type {any} */ pressureIdx, /** @type {any} */ saveId, /** @type {any} */ type) => {
  const direct = pressureIdx?.get?.(saveId, type);
  if (direct) return direct.score || 0;
  const settlementPressures = pressureIdx?.bySettlement?.[saveId] || [];
  return settlementPressures.find((/** @type {any} */ pressure) => pressure.type === type)?.severity || 0;
};

const strongestPressure = (/** @type {any} */ pressureIdx, /** @type {any} */ saveId, /** @type {any} */ types) =>
  types.reduce((/** @type {any} */ max, /** @type {any} */ type) => Math.max(max, pressureFor(pressureIdx, saveId, type)), 0);

const mean = (/** @type {any[]} */ ...values) => values.reduce((sum, value) => sum + (Number(value) || 0), 0) / values.length;

// ── Disposition seam ────────────────────────────────────────────────────────
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
// The trade-leverage pair (tradeLeverageCandidate) classifies by documented intent:
// trade_embargo_collapse WEAPONIZES the tie (escalation, like a sanction);
// trade_dependency_coercion is the supplier pressing terms INSTEAD of war
// (de-escalation), so the salience factor RAISES it as its rule comment promises —
// neither matched any hint before, silently zeroing both documented adjustments.
const ESCALATION_HINT = /(arms_race|sabotage|incident|overreach|coup|rebellion|hostile|raid|extract|power_play|autonomy_bid|debt_spiral|forces_align|subjugat|war|sanction|embargo)/i;
const DEESCALATION_HINT = /(thaw|recovery|compact|protect|stability|alliance|allied|trade_partner|patronage|compliance|support|reconcil|dependency_coercion)/i;

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

// ── Trade-salience seam ──────────────────────────────────────────────────────
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

const candidateBase = (/** @type {any} */ {
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
  // The trade-salience dampener COMPOSES with the disposition factor on the
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

const labelProposal = (/** @type {any} */ ctx, /** @type {any} */ toType, /** @type {any} */ candidateType, /** @type {any} */ details) => {
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

const internalDrift = (/** @type {any} */ ctx, /** @type {any} */ candidateType, /** @type {any} */ details) => candidateBase({ ...ctx, ...details, candidateType });

// PAIR-STABLE attribution for genuinely mutual drifts (an arms race, a thaw,
// a shared border incident): news/inbox rows land on the lower-sorted
// settlement id, so attribution never flips with edge authoring order.
const pairStableId = (/** @type {any} */ edge) => {
  const s = getRelationshipSettlements(edge);
  return String(s.from) <= String(s.to) ? String(s.from) : String(s.to);
};

const hasRecentIncident = (/** @type {any} */ relState, /** @type {any} */ type, /** @type {any} */ tick, cooldown = 2) =>
  (relState.recentIncidents || []).some((/** @type {any} */ incident) => incident.type === type && tick - (incident.tick || 0) <= cooldown);

function itemFor(/** @type {any} */ snapshot, /** @type {any} */ saveId) {
  return snapshot?.byId?.get?.(String(saveId)) || null;
}

function tierRankFor(/** @type {any} */ item) {
  const tier = item?.settlement?.tier || "village";
  const rank = TIER_ORDER.indexOf(tier);
  return rank >= 0 ? rank : TIER_ORDER.indexOf("village");
}

function populationFor(/** @type {any} */ item) {
  return Math.max(0, Number(item?.settlement?.population) || 0);
}

// War homeostasis gearing — the DIRECT war-cost penalty subtracted from raw
// strength. The problem this fixes: war_drain dropped economic_capacity 18pts but
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

// Exported for the war layer: the SAME confidence input the
// subjugation/rival contests read, reused verbatim so a deploy-confidence gate
// and the relationship gate can never diverge. 0..1.
export function settlementStrength(/** @type {any} */ item, /** @type {any} */ pressure = {}) {
  const pop = populationFor(item);
  const popScore = Math.min(1, Math.log10(Math.max(10, pop)) / 5);
  // economy (0.12) is the war-layer homeostasis lever. conflict
  // stays 0.18 so war's direct effect isn't diluted; the weight came from tier/pop/
  // trade/legitimacy. Weights sum to 1.0. The war-cost penalty is then
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
function buildRelationshipIndex(/** @type {any} */ snapshot) {
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

function relationshipTypeBetween(/** @type {any} */ ctx, /** @type {any} */ a, /** @type {any} */ b) {
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

function protectorBackingScore(/** @type {any} */ ctx, /** @type {any} */ targetId, /** @type {any} */ attackerId) {
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
      // The protecting senior party resolves state-first, not by raw
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

function canSubjugateDirection(/** @type {any} */ ctx, /** @type {any} */ { overlordId, vassalId, overlordPressure, vassalPressure }) {
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

// Subjugation is decided by STATE — the stronger side qualifies no matter
// which side the save authored at 'from'. Both directions run the original
// math; if both qualify the stronger side leads, with the settlement id as a
// stable, orientation-independent tiebreak.
function subjugationDirection(/** @type {any} */ ctx) {
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

function patronageEligibilityDirection(/** @type {any} */ ctx, /** @type {any} */ { patronId, clientId, patronPressure, clientPressure }) {
  const source = itemFor(ctx.snapshot, patronId);
  const target = itemFor(ctx.snapshot, clientId);
  if (!source || !target) return { eligible: false, reason: "missing_settlement" };
  const sourceRank = tierRankFor(source);
  const targetRank = tierRankFor(target);
  const sourceStrength = settlementStrength(source, patronPressure);
  const targetStrength = settlementStrength(target, clientPressure);
  const sustainedTrade = ctx.relState.tradeBalance > 0.54
    || ctx.relState.dependency > 0.44
    || (ctx.relState.history || []).some((/** @type {any} */ item) => /trade|route|patron|client|dependency/i.test(`${item.type || ""} ${item.reason || ""}`));
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

// Patronage forms from the STRONGER side regardless of edge orientation;
// same math both ways, stronger patron wins a double-qualify, id tiebreak.
function patronageEligibility(/** @type {any} */ ctx) {
  const settlements = getRelationshipSettlements(ctx.edge);
  const forward = /** @type {any} */ (patronageEligibilityDirection(ctx, {
    patronId: settlements.from,
    clientId: settlements.to,
    patronPressure: ctx.sourcePressure,
    clientPressure: ctx.targetPressure,
  }));
  const reverse = /** @type {any} */ (patronageEligibilityDirection(ctx, {
    patronId: settlements.to,
    clientId: settlements.from,
    patronPressure: ctx.targetPressure,
    clientPressure: ctx.sourcePressure,
  }));
  if (forward.eligible && reverse.eligible) {
    if (forward.sourceStrength !== reverse.sourceStrength) return forward.sourceStrength > reverse.sourceStrength ? forward : reverse;
    return forward.patronSaveId <= reverse.patronSaveId ? forward : reverse;
  }
  return forward.eligible ? forward : reverse.eligible ? reverse : forward;
}

function relationshipThirdParties(/** @type {any} */ ctx, /** @type {any} */ settlementId, /** @type {any[]} */ types = []) {
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

function supplyExposure(/** @type {any} */ snapshot, /** @type {any} */ a, /** @type {any} */ b) {
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

function activeRebellionAgainstVassal(/** @type {any} */ snapshot, /** @type {any} */ vassalId) {
  return (snapshot?.worldState?.stressors || []).some((/** @type {any} */ stressor) =>
    stressor?.type === "rebellion"
    && (stressor.affectedSettlementIds || []).map(String).includes(String(vassalId))
    && !["resolved", "dormant", "residual"].includes(stressor.status),
  );
}

function sharedHostileThird(/** @type {any} */ ctx, /** @type {any} */ a, /** @type {any} */ b) {
  // The hostile/cold_war adjacency sets are precomputed once per tick; the
  // intersection is sorted, so the result is stable regardless of edge-authoring
  // order (the lowest-sorted common enemy when several exist).
  const index = ctx?.relIndex || buildRelationshipIndex(ctx?.snapshot || ctx);
  const hostileToA = index.hostileTo.get(String(a));
  const hostileToB = index.hostileTo.get(String(b));
  if (!hostileToA || !hostileToB) return null;
  return [...hostileToA].filter(id => hostileToB.has(id)).sort()[0] || null;
}

function sharedEnemyAllianceCandidate(/** @type {any} */ ctx) {
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

export {
  stablePart,
  hash01,
  pressureFor,
  strongestPressure,
  mean,
  EMPTY_DISPOSITION,
  HOSTILITY_RANK,
  hostilityRank,
  ESCALATION_HINT,
  DEESCALATION_HINT,
  EMPTY_TRADE_SALIENCE,
  candidateBase,
  labelProposal,
  internalDrift,
  pairStableId,
  hasRecentIncident,
  itemFor,
  tierRankFor,
  populationFor,
  WAR_DRAIN_STRENGTH_WEIGHT,
  WAR_EXHAUSTION_STRENGTH_WEIGHT,
  warCostPenalty,
  buildRelationshipIndex,
  relationshipTypeBetween,
  protectorBackingScore,
  canSubjugateDirection,
  subjugationDirection,
  patronageEligibilityDirection,
  patronageEligibility,
  relationshipThirdParties,
  supplyExposure,
  activeRebellionAgainstVassal,
  sharedHostileThird,
  sharedEnemyAllianceCandidate,
};
