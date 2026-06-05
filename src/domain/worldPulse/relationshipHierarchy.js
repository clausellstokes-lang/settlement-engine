import { ensureRelationshipState, getRelationshipSettlements, relationshipKeyFromEdge } from './relationshipEvolution.js';

const HOSTILE_TYPES = new Set(['hostile', 'cold_war', 'rival']);
const POSITIVE_TYPES = new Set(['allied', 'trade_partner', 'patron', 'client']);

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

function edgeType(edge, states) {
  const key = relationshipKeyFromEdge(edge);
  return ensureRelationshipState(edge, states?.[key]).relationshipType;
}

function otherSettlementId(edge, id) {
  const { from, to } = getRelationshipSettlements(edge);
  if (String(from) === String(id)) return String(to);
  if (String(to) === String(id)) return String(from);
  return null;
}

function isPair(edge, a, b) {
  const { from, to } = getRelationshipSettlements(edge);
  return (String(from) === String(a) && String(to) === String(b))
    || (String(from) === String(b) && String(to) === String(a));
}

function hierarchyDecision({ currentType, overlordType, vassalState }) {
  if (POSITIVE_TYPES.has(currentType) && HOSTILE_TYPES.has(overlordType)) {
    const coercion = Math.max(
      clamp01(vassalState?.fear),
      clamp01(vassalState?.leverage),
      clamp01(vassalState?.dependency),
    );
    if (currentType === 'allied' && (overlordType === 'hostile' || coercion >= 0.72)) {
      return {
        toType: 'hostile',
        reason: 'New vassal obligations force the former alliance into the overlord war.',
      };
    }
    if (currentType === 'trade_partner' && (overlordType === 'hostile' || coercion >= 0.72)) {
      return {
        toType: 'cold_war',
        reason: 'The overlord compels embargoes and border pressure against the former trade partner.',
      };
    }
    return {
      toType: 'cold_war',
      reason: 'The relationship is suspended under the overlord conflict posture.',
    };
  }

  if (HOSTILE_TYPES.has(currentType) && POSITIVE_TYPES.has(overlordType)) {
    return {
      toType: currentType === 'hostile' ? 'cold_war' : 'neutral',
      reason: 'The overlord demands a managed ceasefire with its partner.',
    };
  }

  return null;
}

function updateRelationshipState({ state, edge, key, fromType, decision, tick, now, context }) {
  const current = ensureRelationshipState(edge, state.relationshipStates?.[key]);
  const toType = decision.toType;
  const hostile = toType === 'hostile';
  const cold = toType === 'cold_war';
  const neutral = toType === 'neutral';
  const historyEntry = {
    tick,
    type: 'hierarchy_resolution',
    fromType,
    toType,
    reason: decision.reason,
    overlordId: context.overlordId,
    vassalId: context.vassalId,
    thirdPartyId: context.thirdPartyId,
    causeRelationshipKey: context.causeRelationshipKey,
  };
  return {
    ...current,
    relationshipType: toType,
    proposedRelationshipType: null,
    lastTransitionTick: tick,
    trust: hostile ? 0.08 : cold ? Math.min(current.trust, 0.16) : neutral ? Math.max(Math.min(current.trust, 0.46), 0.3) : current.trust,
    resentment: hostile ? Math.max(current.resentment, 0.72) : cold ? Math.max(current.resentment, 0.58) : neutral ? Math.max(current.resentment, 0.24) : current.resentment,
    fear: hostile ? Math.max(current.fear, 0.6) : cold ? Math.max(current.fear, 0.48) : current.fear,
    tradeBalance: hostile ? Math.min(current.tradeBalance, 0.12) : cold ? Math.min(current.tradeBalance, 0.24) : current.tradeBalance,
    pactStrength: hostile || cold || neutral ? 0 : current.pactStrength,
    trajectory: hostile ? 'coerced_war_alignment' : cold ? 'vassalage_embargo' : 'managed_ceasefire',
    updatedAt: now,
    recentIncidents: [
      ...(current.recentIncidents || []).slice(-7),
      { tick, type: 'hierarchy_resolution', severity: hostile ? 0.82 : 0.62 },
    ],
    history: [
      ...(current.history || []).slice(-11),
      historyEntry,
    ],
    hierarchyResolutions: [
      ...(current.hierarchyResolutions || []).slice(-5),
      historyEntry,
    ],
  };
}

function updateGraphEdge(edge, toType, now) {
  const fromType = edge.relationshipType || edge.type || 'neutral';
  return {
    ...edge,
    relationshipType: toType,
    type: edge.type === fromType || !edge.type ? toType : edge.type,
    updatedAt: now,
  };
}

/**
 * @param {{ worldState?: any, regionalGraph?: any, vassalEdge?: any, now?: string, tick?: number }} [args]
 */
export function resolveRelationshipHierarchy(args = {}) {
  const { worldState, regionalGraph, vassalEdge, now, tick } = args;
  if (!worldState || !regionalGraph || !vassalEdge) {
    return { worldState, regionalGraph, changes: [] };
  }
  const { from: overlordId, to: vassalId } = getRelationshipSettlements(vassalEdge);
  if (!overlordId || !vassalId) {
    return { worldState, regionalGraph, changes: [] };
  }

  const causeRelationshipKey = relationshipKeyFromEdge(vassalEdge);
  const vassalState = ensureRelationshipState(vassalEdge, worldState.relationshipStates?.[causeRelationshipKey]);
  if (vassalState.relationshipType !== 'vassal') {
    return { worldState, regionalGraph, changes: [] };
  }

  const states = { ...(worldState.relationshipStates || {}) };
  let edges = regionalGraph.edges || [];
  const changes = [];

  for (const edge of regionalGraph.edges || []) {
    const key = relationshipKeyFromEdge(edge);
    if (key === causeRelationshipKey) continue;

    const thirdPartyId = otherSettlementId(edge, vassalId);
    if (!thirdPartyId || String(thirdPartyId) === String(overlordId)) continue;

    const overlordEdge = (regionalGraph.edges || []).find(candidate =>
      relationshipKeyFromEdge(candidate) !== key
      && relationshipKeyFromEdge(candidate) !== causeRelationshipKey
      && isPair(candidate, overlordId, thirdPartyId)
    );
    if (!overlordEdge) continue;

    const currentType = edgeType(edge, states);
    const overlordType = edgeType(overlordEdge, states);
    const decision = hierarchyDecision({ currentType, overlordType, vassalState });
    if (!decision || decision.toType === currentType) continue;

    const updatedState = updateRelationshipState({
      state: { relationshipStates: states },
      edge,
      key,
      fromType: currentType,
      decision,
      tick,
      now,
      context: { overlordId, vassalId, thirdPartyId, causeRelationshipKey },
    });
    states[key] = updatedState;

    let updatedEdge = null;
    edges = edges.map(candidate => {
      if (relationshipKeyFromEdge(candidate) !== key) return candidate;
      updatedEdge = updateGraphEdge(candidate, decision.toType, now);
      return updatedEdge;
    });
    if (updatedEdge) {
      changes.push({
        relationshipKey: key,
        edge: updatedEdge,
        fromType: currentType,
        toType: decision.toType,
        reason: decision.reason,
        overlordId: String(overlordId),
        vassalId: String(vassalId),
        thirdPartyId,
      });
    }
  }

  return {
    worldState: { ...worldState, relationshipStates: states },
    regionalGraph: { ...regionalGraph, edges },
    changes,
  };
}
