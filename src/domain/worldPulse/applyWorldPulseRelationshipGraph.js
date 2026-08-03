// applyWorldPulseRelationshipGraph — the relationship half of the apply pass: edge
// resolution for an outcome, role orientation, the coalition-enemy opening, the
// neighbour-network label write and the cascade news entry. Split verbatim out of
// applyWorldPulse.js by THE DECOMPOSITION WAVE (war tranche, file 4); every body here is
// byte-identical to its pre-split declaration.
import { syncRelationshipChannelBundle } from '../region/index.js';
import {
  applyRelationshipPatch,
  ensureRelationshipState,
  getRelationshipSettlements,
  normalizeRelationshipEdge,
  relationshipKeyFromEdge,
  relationshipRoles,
} from './relationshipEvolution.js';
import { canonicalRelationshipSeed, ensureRelationshipEdgeSeed } from './relationshipEdgeSeed.js';
import { rolesForCanonicalEdge } from '../relationships/canonicalRelationship.js';

/** One approved/refused bilateral offer is one immutable relationship fact. */
export function relationshipOutcomeDisposition(worldState, outcome) {
  const key = String(outcome?.relationshipKey || outcome?.proposalPayload?.relationshipKey || '');
  const id = String(outcome?.id || '');
  if (!key || !id) return null;
  const record = worldState?.relationshipStates?.[key];
  if (String(record?.peaceDecisionOutcomeId || '') === id) return 'same';
  const candidateTick = Number(outcome?.generatedAtTick ?? outcome?.tick ?? worldState?.tick);
  if (Number.isFinite(candidateTick)
    && Number.isFinite(record?.peaceDecisionTick)
    && Number(record.peaceDecisionTick) >= Math.floor(candidateTick)) return 'superseded';
  const incidents = Array.isArray(record?.recentIncidents) ? record.recentIncidents : [];
  const history = Array.isArray(record?.history) ? record.history : [];
  return [...incidents, ...history].some((row) => String(row?.outcomeId || '') === id)
    ? 'same'
    : null;
}

/**
 * A joined army owns a real bilateral war address, not only a front channel.
 * Open or relabel that exact party/enemy relationship through the existing
 * relationship writers after (and only after) the alliance-call archive lands.
 * This makes the ordinary sue-for-peace writer reachable without inventing an
 * N-party war object or a second approval question.
 */
export function openCoalitionEnemyRelationship({
  worldState,
  regionalGraph,
  outcome,
  settlementUpdates,
  tick,
  now,
}) {
  const request = outcome?.metadata?.coalitionEnemyRelationship;
  const identity = canonicalRelationshipSeed(request?.partyId, request?.enemyId);
  if (!identity) return { worldState, regionalGraph };
  let graph = ensureRelationshipEdgeSeed(regionalGraph, {
    id: `${outcome.id}.enemy_relationship`,
    headline: outcome.headline,
    metadata: {
      relationshipSeed: {
        ...identity,
        fromType: 'neutral',
        source: 'war_coalition_join',
      },
    },
  }, now);
  const rawEdge = (graph.edges || []).find((edge) => {
    const endpoints = getRelationshipSettlements(normalizeRelationshipEdge(edge));
    const a = String(endpoints.from || '');
    const b = String(endpoints.to || '');
    return (a === identity.fromId && b === identity.toId)
      || (a === identity.toId && b === identity.fromId);
  });
  if (!rawEdge) return { worldState, regionalGraph };
  const relationshipKey = relationshipKeyFromEdge(rawEdge);
  const current = ensureRelationshipState(
    normalizeRelationshipEdge(rawEdge),
    worldState.relationshipStates?.[relationshipKey],
  );
  if (current.relationshipType === 'hostile') return { worldState, regionalGraph: graph };
  const labelOutcome = {
    id: `${outcome.id}.enemy_relationship`,
    relationshipKey,
    relationshipPatch: {},
    severity: outcome.severity,
    metadata: { incidentType: 'coalition_joined_war_edge' },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey,
      fromType: current.relationshipType,
      toType: 'hostile',
      reason: 'An allied court answered a live call and opened its own bilateral war edge.',
    },
  };
  const nextState = applyRelationshipPatch(worldState, labelOutcome, now);
  graph = applyRelationshipLabelToGraph(graph, labelOutcome, now);
  const nextEdge = relationshipEdgeForOutcome(graph, labelOutcome);
  if (nextEdge) {
    const oriented = roleOrientedEdge(nextEdge, nextState.relationshipStates?.[relationshipKey]);
    graph = syncRelationshipChannelBundle(graph, oriented, 'hostile', {
      now,
      status: 'confirmed',
      outcomeId: outcome.id,
      relationshipKey,
      reason: labelOutcome.proposalPayload.reason,
    });
    writeRelationshipLabelToNeighbourNetworks({
      settlementUpdates,
      edge: oriented,
      toType: 'hostile',
      tick,
    });
  }
  return { worldState: nextState, regionalGraph: graph };
}

export function applyRelationshipLabelToGraph(/** @type {any} */ graph, /** @type {any} */ outcome, /** @type {any} */ now) {
  if (outcome.proposalPayload?.kind !== 'relationship_label_change') return graph;
  const { relationshipKey, toType } = outcome.proposalPayload;
  return {
    ...graph,
    edges: (graph.edges || []).map((/** @type {any} */ edge) => {
      if (relationshipKeyFromEdge(edge) !== relationshipKey) return edge;
      return {
        ...edge,
        relationshipType: toType,
        type: edge.type === edge.relationshipType || !edge.type ? toType : edge.type,
        updatedAt: now,
      };
    }),
  };
}

export function relationshipEdgeForOutcome(/** @type {any} */ graph, /** @type {any} */ outcome) {
  const key = outcome.proposalPayload?.relationshipKey || outcome.relationshipKey;
  if (!key) return null;
  return (graph.edges || []).find((/** @type {any} */ edge) => relationshipKeyFromEdge(edge) === key) || null;
}

/**
 * relationshipChannelBundle and the neighbourNetwork writeback both read raw
 * edge orientation ('edge.from is the patron/overlord'), but a pulse-driven
 * subjugation may have crowned the authored 'to' side via the seniority stamps
 * on relationship state. When relationshipRoles reports the senior side at 'to',
 * hand consumers a transient role-oriented copy of the edge — from/to (and the
 * directional aliases) swapped, stored edge id kept — so channels and dossiers
 * assert the real hierarchy. Symmetric labels and unstamped (DM-authored)
 * hierarchy edges resolve as not-reversed and pass through untouched.
 *
 * Every alias pair is oriented from the SINGLE canonical senior/junior
 * (relationshipRoles already derives these from the from/to pair), never by
 * swapping each pair against its own raw values. An edge with a partial alias
 * set (e.g. from/to plus a lone `source`) would otherwise come out
 * inconsistently oriented — asserting the wrong hierarchy direction downstream.
 */
export function roleOrientedEdge(/** @type {any} */ edge, /** @type {any} */ relState) {
  if (!edge) return edge;
  const { seniorId, juniorId, reversed } = relationshipRoles(edge, relState);
  if (!reversed) return edge;
  const oriented = { ...edge };
  // Only rewrite alias slots the edge actually carries; the senior id goes in
  // each pair's senior slot and the junior id in its junior slot, so all
  // populated aliases agree on the same orientation.
  for (const [senior, junior] of [['from', 'to'], ['source', 'target'], ['a', 'b'], ['settlementAId', 'settlementBId']]) {
    if (edge[senior] === undefined && edge[junior] === undefined) continue;
    if (edge[senior] !== undefined) oriented[senior] = seniorId;
    if (edge[junior] !== undefined) oriented[junior] = juniorId;
  }
  return oriented;
}

/**
 * A pulse relationship label outcome is canonical relationship state
 * (DM-approved, or auto per the campaign's rules) — write it through to BOTH
 * settlements' neighbourNetwork links so the dossier, threat profile, PDF,
 * and AI grounding stop asserting the label the pulse already changed.
 * Conditions-over-mutation does not apply: the label IS the relationship
 * state, not a derived effect. Both ends must be saved settlements in this
 * pulse; a pair with an un-saved end leaves neighbourNetwork untouched (we
 * cannot reconcile the reciprocal link of a settlement we are not carrying).
 */
export function writeRelationshipLabelToNeighbourNetworks(/** @type {any} */ { settlementUpdates, edge, toType, tick }) {
  if (!edge?.from || !edge?.to || !toType) return;
  const fromId = String(edge.from);
  const toId = String(edge.to);
  const fromEntry = settlementUpdates.get(fromId);
  const toEntry = settlementUpdates.get(toId);
  if (!fromEntry?.settlement || !toEntry?.settlement) return;
  const labelled = { ...edge, relationshipType: toType };
  const ends = [
    { selfId: fromId, otherId: toId, otherEntry: toEntry },
    { selfId: toId, otherId: fromId, otherEntry: fromEntry },
  ];
  for (const { selfId, otherId, otherEntry } of ends) {
    const entry = settlementUpdates.get(selfId);
    const network = Array.isArray(entry.settlement?.neighbourNetwork) ? entry.settlement.neighbourNetwork : [];
    if (!network.length) continue;
    const otherName = otherEntry.save?.name || otherEntry.settlement?.name || null;
    const role = rolesForCanonicalEdge(labelled, selfId).sourceRole;
    let touched = false;
    const next = network.map((/** @type {any} */ link) => {
      const matches = String(link?.id || '') === otherId
        || String(link?.targetId || '') === otherId
        || String(link?.settlementId || '') === otherId
        || (otherName != null && (String(link?.neighbourName || '') === String(otherName) || String(link?.name || '') === String(otherName)));
      if (!matches) return link;
      const unchanged = link.relationshipType === toType
        && String(link.relationshipFrom || '') === fromId
        && String(link.relationshipTo || '') === toId
        && link.localRelationshipRole === role
        && link.displayRelationshipType === role;
      if (unchanged) return link; // identity no-op
      touched = true;
      return {
        ...link,
        relationshipType: toType,
        relationshipFrom: fromId,
        relationshipTo: toId,
        localRelationshipRole: role,
        displayRelationshipType: role,
        // Provenance: the dossier shows WHO last asserted this label.
        updatedByPulse: Number.isFinite(tick) ? tick : null,
      };
    });
    if (touched) {
      settlementUpdates.set(selfId, { ...entry, settlement: { ...entry.settlement, neighbourNetwork: next } });
    }
  }
}

/**
 * Every third-party edge the vassalage hierarchy cascade flips emits Wizard
 * News — the realignment is major campaign politics, not a
 * silent field rewrite. One entry per flipped edge, naming both settlements
 * and the flip.
 */
export function cascadeNewsEntry(/** @type {any} */ { cascade, edge, nameFor, outcome, tick }) {
  const edgeKey = cascade.edgeKey || cascade.relationshipKey;
  const fromName = nameFor(edge?.from);
  const toName = nameFor(edge?.to);
  const fromLabel = String(cascade.fromType || 'linked').replace(/_/g, ' ');
  const toLabel = String(cascade.toType || 'linked').replace(/_/g, ' ');
  const hostile = cascade.toType === 'hostile';
  return {
    id: `wizard_news.${tick}.hierarchy_cascade.${edgeKey}`,
    tick,
    scope: 'regional',
    significance: hostile ? 'major' : 'notable',
    score: hostile ? 72 : 56,
    headline: `${fromName} and ${toName}: ${fromLabel} becomes ${toLabel}`,
    summary: cascade.reason || 'The new vassalage realigns the relationship.',
    kind: 'applied',
    impactKind: 'hierarchy_cascade',
    channelType: null,
    severity: hostile ? 0.74 : 0.58,
    settlementIds: [edge?.from, edge?.to].filter(Boolean).map(String),
    impactIds: [],
    channelIds: [],
    sourceEventId: outcome.id,
    tags: ['world_pulse', 'relationship', 'hierarchy_cascade'],
    reasons: [cascade.reason].filter(Boolean),
  };
}
