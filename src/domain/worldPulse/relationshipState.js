/**
 * relationshipState.js — the relationship-state CORE: defaults, type
 * normalization, edge identity/orientation, and state construction.
 *
 * Extracted out of relationshipEvolution.js to BREAK the last ESM import cycle:
 *   relationshipEvolution.js  ↔  relationshipHierarchy.js
 * relationshipHierarchy needed ensureRelationshipState / getRelationshipSettlements
 * / relationshipKeyFromEdge / relationshipRoles from relationshipEvolution, while
 * relationshipEvolution needs previewRelationshipHierarchyCascade from hierarchy —
 * a 2-module cycle. These are all PURE (no rng, no Date, no worldPulse imports),
 * so hoisting them into this leaf lets both modules depend DOWNWARD on it. No
 * behavior change: definitions are moved verbatim.
 */

/** @param {number} value @returns {number} */
export const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

/** @type {Record<string, any>} */
export const RELATIONSHIP_DEFAULTS = {
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

/** @type {Record<string, string>} */
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

/** @param {string} [type] @returns {string} */
export const normalizeRelationshipType = (type) =>
  RELATIONSHIP_TYPE_ALIASES[String(type || "").trim().toLowerCase()] || String(type || "neutral").trim().toLowerCase();

export const normalizeType = normalizeRelationshipType;

/** @param {any} edge @returns {string} */
export function relationshipKeyFromEdge(edge) {
  if (edge?.id) return edge.id;
  const from = edge?.from || edge?.source || edge?.a || "unknown-a";
  const to = edge?.to || edge?.target || edge?.b || "unknown-b";
  return `rel.${from}.${to}`;
}

/** @param {any} edge */
export function getRelationshipSettlements(edge) {
  return {
    from: edge?.from || edge?.source || edge?.a || edge?.settlementAId,
    to: edge?.to || edge?.target || edge?.b || edge?.settlementBId,
  };
}

/**
 * Directional roles for hierarchical labels. Edges are one-per-pair and
 * for relationships that BEGAN symmetric the from/to orientation is a pure
 * authoring artifact (save iteration order), so a pulse-driven subjugation or
 * patronage stamps the chosen senior side onto the relationship STATE
 * (overlordSaveId / patronSaveId). Readers resolve direction state-first; a
 * DM-authored vassal/patron edge carries no stamp and keeps its strict edge
 * direction (from = overlord/patron).
 * @param {any} edge
 * @param {any} relState
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

/** @param {any} [edge] */
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

/** @param {any} edge @param {any} [existing] */
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
    // Direction stamps for hierarchy labels born from symmetric edges
    // (the subjugating/patronizing side may be the authored 'to'). Null on
    // DM-authored hierarchy edges, which keep strict edge direction.
    overlordSaveId: existing.overlordSaveId != null ? String(existing.overlordSaveId) : null,
    vassalSaveId: existing.vassalSaveId != null ? String(existing.vassalSaveId) : null,
    patronSaveId: existing.patronSaveId != null ? String(existing.patronSaveId) : null,
    clientSaveId: existing.clientSaveId != null ? String(existing.clientSaveId) : null,
    relationshipMemory: existing.relationshipMemory && typeof existing.relationshipMemory === "object"
      ? { ...existing.relationshipMemory }
      : null,
    // The LAYERED secondary-status overlay (compatibility-enforced
    // trade statuses), stamped post-apply ONLY under the war layer. Preserved
    // across the per-tick ensure/relax passes; absent on a legacy edge (the field
    // is conditionally spread so it never serializes for a no-overlay edge).
    ...(Array.isArray(existing.secondaryStatuses) && existing.secondaryStatuses.length
      ? { secondaryStatuses: existing.secondaryStatuses }
      : {}),
  };
}
