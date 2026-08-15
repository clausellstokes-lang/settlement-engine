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

// Major relationship changes need a longer-lived source than the rolling
// incident/history windows: a busy border can otherwise evict the alliance,
// vassalage, or peace that explains its present posture. Keep a separate,
// deterministic archive, but cap it so persisted edges remain bounded. Twenty-
// four matches the incident-memory maximum lookback horizon while retaining
// twice the ordinary history window.
export const RELATIONSHIP_TURNING_POINT_CAP = 24;
// WR-6: alliance calls outlive the short incident window because a refused
// summons is a diplomatic fact, but remain bounded like every relationship
// archive.  Kept beside the turning-point cap so save normalization and the
// sanctioned writer share one limit.
export const RELATIONSHIP_ALLIANCE_CALL_CAP = 24;
// WR-6: coalition settlements and reimbursements are diplomatic facts, not
// rolling incidents.  Keep their exact-once receipts beside alliance calls on
// the relationship that actually paid, owed, or forgave the obligation.
export const RELATIONSHIP_COALITION_SETTLEMENT_CAP = 24;

/** Closed persisted alliance-call row; malformed imports do not become facts. */
function normalizeAllianceCall(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const row = /** @type {Record<string, unknown>} */ (raw);
  const callId = typeof row.callId === 'string' ? row.callId.trim() : '';
  const partyId = typeof row.partyId === 'string' ? row.partyId.trim() : '';
  const callerId = typeof row.callerId === 'string' ? row.callerId.trim() : '';
  const enemyId = typeof row.enemyId === 'string' ? row.enemyId.trim() : '';
  const relationshipKey = typeof row.relationshipKey === 'string' ? row.relationshipKey.trim() : '';
  const tick = Number(row.tick);
  const callerDeploymentSinceTick = Number(row.callerDeploymentSinceTick);
  const originSinceTick = Number(row.originSinceTick);
  const originAttackerId = typeof row.originAttackerId === 'string' ? row.originAttackerId.trim() : '';
  const decision = row.decision === 'joined' || row.decision === 'refused' ? row.decision : '';
  if (!callId || !partyId || !callerId || !enemyId || !relationshipKey || !decision
    || row.cause !== 'alliance_obligation' || !Number.isInteger(tick) || tick < 0
    || !Number.isInteger(callerDeploymentSinceTick) || callerDeploymentSinceTick < 0
    || !Number.isInteger(originSinceTick) || originSinceTick !== callerDeploymentSinceTick
    || (originAttackerId !== callerId && originAttackerId !== enemyId)
    || callId !== ['coalition_call', callerId, partyId, enemyId, callerDeploymentSinceTick].join('.')) return null;
  return {
    callId, partyId, callerId, enemyId, relationshipKey, tick,
    callerDeploymentSinceTick, originAttackerId, originSinceTick, decision, cause: 'alliance_obligation',
  };
}

/** Sanitize, dedupe by stable call id, and bound a persisted call archive. */
export function normalizeAllianceCalls(value) {
  const rows = (Array.isArray(value) ? value : [])
    .map(normalizeAllianceCall)
    .filter(Boolean)
    .sort((a, b) => (a.tick - b.tick)
      || (a.callId < b.callId ? -1 : a.callId > b.callId ? 1 : 0)
      || (a.decision < b.decision ? -1 : a.decision > b.decision ? 1 : 0));
  // Stable duplicate rule: the oldest well-shaped decision wins.  Reordered
  // imports therefore select the same fact before the newest-cap is applied.
  const byId = new Map();
  for (const row of rows) if (!byId.has(row.callId)) byId.set(row.callId, row);
  return [...byId.values()].slice(-RELATIONSHIP_ALLIANCE_CALL_CAP);
}

/** Exact-once append through the relationship plane's one writer. */
export function appendRelationshipAllianceCall(state, raw) {
  const current = normalizeAllianceCalls(state?.allianceCalls);
  const row = normalizeAllianceCall(raw);
  if (!row) return current;
  if (current.some((entry) => entry.callId === row.callId
    && entry.relationshipKey === row.relationshipKey)) return current;
  // A well-shaped imported row can still be stored on the wrong relationship.
  // The call id proves one caller/party/enemy/root episode, so the owning edge's
  // writer replaces that conflicting placement instead of letting it poison the
  // real decision forever (the read requires id + relationship key as well).
  return normalizeAllianceCalls([
    ...current.filter((entry) => entry.callId !== row.callId),
    row,
  ]);
}

const COALITION_SETTLEMENT_ACTIONS = new Set([
  'settlement_transfer',
  'reimbursement',
  'forgiveness',
  'separate_peace',
]);
const COALITION_SETTLEMENT_STATUSES = new Set(['paid', 'partial', 'unpaid', 'forgiven', 'recorded']);

/** Closed persisted coalition-settlement row; malformed imports do not become facts. */
function normalizeCoalitionSettlement(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const row = /** @type {Record<string, unknown>} */ (raw);
  const actionId = typeof row.actionId === 'string' ? row.actionId.trim() : '';
  const coalitionSettlementId = typeof row.coalitionSettlementId === 'string'
    ? row.coalitionSettlementId.trim()
    : '';
  const closureId = typeof row.closureId === 'string' ? row.closureId.trim() : '';
  const relationshipKey = typeof row.relationshipKey === 'string' ? row.relationshipKey.trim() : '';
  const fromId = typeof row.fromId === 'string' ? row.fromId.trim() : '';
  const toId = typeof row.toId === 'string' ? row.toId.trim() : '';
  const action = typeof row.action === 'string' ? row.action.trim() : '';
  const status = typeof row.status === 'string' ? row.status.trim() : '';
  const tick = Number(row.tick);
  const expectedActionId = [coalitionSettlementId, closureId, action].join('.');
  if (!actionId || !coalitionSettlementId || !closureId || !relationshipKey
    || !fromId || !toId || fromId === toId
    || !COALITION_SETTLEMENT_ACTIONS.has(action)
    || !COALITION_SETTLEMENT_STATUSES.has(status)
    || (action === 'forgiveness'
      ? status !== 'forgiven'
      : action === 'separate_peace'
        ? status !== 'recorded'
        : status === 'forgiven' || status === 'recorded')
    || actionId !== expectedActionId
    || !Number.isInteger(tick) || tick < 0) return null;
  return {
    actionId,
    coalitionSettlementId,
    closureId,
    relationshipKey,
    fromId,
    toId,
    action,
    tick,
    status,
  };
}

/** Sanitize, deterministically dedupe, and bound the durable settlement archive. */
export function normalizeCoalitionSettlements(value) {
  const rows = (Array.isArray(value) ? value : [])
    .map(normalizeCoalitionSettlement)
    .filter(Boolean)
    .sort((a, b) => (a.tick - b.tick)
      || (a.actionId < b.actionId ? -1 : a.actionId > b.actionId ? 1 : 0));
  const byId = new Map();
  for (const row of rows) if (!byId.has(row.actionId)) byId.set(row.actionId, row);
  return [...byId.values()].slice(-RELATIONSHIP_COALITION_SETTLEMENT_CAP);
}

/** Whether this relationship has already applied the named value-moving action. */
export function coalitionSettlementActionWasRecorded(state, actionId) {
  const id = typeof actionId === 'string' ? actionId.trim() : '';
  return Boolean(id) && normalizeCoalitionSettlements(state?.coalitionSettlements)
    .some((row) => row.actionId === id);
}

/** Exact-once append through the relationship plane's one writer. */
export function appendRelationshipCoalitionSettlement(state, raw) {
  const current = normalizeCoalitionSettlements(state?.coalitionSettlements);
  const row = normalizeCoalitionSettlement(raw);
  if (!row || current.some((entry) => entry.actionId === row.actionId)) return current;
  return normalizeCoalitionSettlements([...current, row]);
}

/** @param {Record<string, unknown>} row */
function isRelationshipTurningPoint(row) {
  return row?.type === "label_proposal_applied"
    || row?.type === "hierarchy_resolution"
    || (row?.fromType != null && row?.toType != null);
}

/**
 * Append one major relationship transition to the separately bounded durable
 * archive. Callers pass an ensured state, so legacy history has already been
 * backfilled into the archive before the new transition lands.
 * @param {Record<string, unknown>} state
 * @param {Record<string, unknown>} entry
 */
export function appendRelationshipTurningPoint(state, entry) {
  const prior = Array.isArray(state?.turningPoints)
    ? state.turningPoints.filter(isRelationshipTurningPoint)
    : [];
  return [...prior.slice(-(RELATIONSHIP_TURNING_POINT_CAP - 1)), entry];
}

/** @param {any} edge @returns {string} */
export function relationshipKeyFromEdge(edge) {
  if (edge?.id) return edge.id;
  const from = edge?.from || edge?.source || edge?.a || "unknown-a";
  const to = edge?.to || edge?.target || edge?.b || "unknown-b";
  return `rel.${from}.${to}`;
}

/**
 * THE REAL GRAPH EDGE between two settlements, or null when none connects them.
 *
 * ⚠️ WHY THIS EXISTS, AND WHY IT RETURNS THE EDGE RATHER THAN THE KEY. Four
 * modules had each hand-rolled a private `edgeKeyBetween` over this exact walk
 * (peaceTermsGraph, relationshipEvolution, corruptionWeb, informationStatecraft),
 * and every one of them threw the EDGE away and kept only its key. That discard is
 * what made the ghost-materialization class possible: the relationship plane's one
 * writer was handed a key with no way to learn what the edge IS, so an edge whose
 * state record had never been written got re-typed `neutral` on its way past. The
 * four keyed helpers now delegate here and the writer is handed the edge itself.
 *
 * Matches on `from`/`to` exactly as all four forks did — deliberately NOT through
 * `getRelationshipSettlements`, whose wider alias set would match edges the
 * previous behaviour did not and move worlds that have nothing to do with this fix.
 *
 * @param {ReadonlyArray<{ from?: unknown, to?: unknown, id?: unknown }>|null|undefined} edges
 * @param {string} a @param {string} b
 * @returns {{ from?: unknown, to?: unknown, id?: unknown }|null}
 */
export function edgeBetween(edges, a, b) {
  for (const edge of Array.isArray(edges) ? edges : []) {
    const f = edge?.from != null ? String(edge.from) : '';
    const t = edge?.to != null ? String(edge.to) : '';
    if ((f === a && t === b) || (f === b && t === a)) return edge;
  }
  return null;
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
  // Backfill the major rows a legacy save still retains, then keep writing to
  // this archive independently of the shorter rolling history window.
  const turningPointsSource = Array.isArray(existing.turningPoints)
    ? existing.turningPoints
    : history.filter(isRelationshipTurningPoint);
  const turningPoints = turningPointsSource
    .filter(isRelationshipTurningPoint)
    .slice(-RELATIONSHIP_TURNING_POINT_CAP);
  const allianceCalls = normalizeAllianceCalls(existing.allianceCalls);
  const coalitionSettlements = normalizeCoalitionSettlements(existing.coalitionSettlements);

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
    ...(turningPoints.length ? { turningPoints } : {}),
    ...(allianceCalls.length ? { allianceCalls } : {}),
    ...(coalitionSettlements.length ? { coalitionSettlements } : {}),
    hierarchyResolutions: Array.isArray(existing.hierarchyResolutions) ? existing.hierarchyResolutions.slice(-6) : [],
    trajectory: existing.trajectory || "stable",
    proposedRelationshipType: existing.proposedRelationshipType || null,
    lastTransitionTick: Number.isFinite(existing.lastTransitionTick) ? existing.lastTransitionTick : null,
    ...(typeof existing.peaceDecisionOutcomeId === 'string' && existing.peaceDecisionOutcomeId
      ? { peaceDecisionOutcomeId: existing.peaceDecisionOutcomeId }
      : {}),
    ...(Number.isFinite(existing.peaceDecisionTick)
      ? { peaceDecisionTick: Math.max(0, Math.floor(existing.peaceDecisionTick)) }
      : {}),
    ...(existing.peaceDecision === 'accepted' || existing.peaceDecision === 'refused'
      ? { peaceDecision: existing.peaceDecision }
      : {}),
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
