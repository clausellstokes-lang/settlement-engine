/**
 * WR-0c — create the relationship edge an applied escalation is about to relabel.
 *
 * Most relationship outcomes operate on a pre-existing regional edge. A trade-war
 * contest is the honest exception: the defeated supplier and the winning supplier
 * can both be linked to the buyer without being linked to each other. Its escalation
 * still needs a real pair edge because the one war opener discovers targets from
 * relationship edges, not from causal channels. The producer declares that missing
 * edge in `metadata.relationshipSeed`; this leaf materializes it immediately before
 * the ordinary relationship patch/label applicators run.
 *
 * This is not a second relationship writer. It creates only an absent identity row,
 * initially at the outcome's declared `fromType`; `applyRelationshipPatch` and the
 * graph label applicator remain the writers of the hostile transition itself.
 */

import { edgeIdFor } from '../region/graph.js';

/**
 * @typedef {Object} EdgeLike
 * @property {unknown} [id]
 * @property {unknown} [from]
 * @property {unknown} [to]
 * @property {unknown} [relationshipType]
 * @property {unknown} [status]
 * @property {unknown[]} [channelIds]
 * @property {unknown[]} [evidence]
 * @property {unknown} [updatedAt]
 */
/** @typedef {{ edges?: EdgeLike[], updatedAt?: unknown, [key: string]: unknown }} GraphLike */
/**
 * @typedef {Object} RelationshipSeed
 * @property {unknown} [fromId]
 * @property {unknown} [toId]
 * @property {unknown} [relationshipKey]
 * @property {unknown} [fromType]
 * @property {unknown} [source]
 */
/**
 * @typedef {Object} SeedOutcome
 * @property {unknown} [id]
 * @property {unknown} [headline]
 * @property {{ relationshipSeed?: RelationshipSeed }|null} [metadata]
 * @property {{ relationshipKey?: unknown, fromType?: unknown }|null} [proposalPayload]
 */

/** @param {unknown} value @returns {string} */
const text = (value) => (value == null ? '' : String(value));

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Canonical identity for an otherwise-unconnected relationship pair. Relationship
 * labels are symmetric; event direction remains in `metadata.fromSaveId` /
 * `toSaveId` and in the war intent. Sorting only the identity prevents reciprocal
 * same-tick escalations from inventing two keys for one pair.
 *
 * @param {unknown} aId
 * @param {unknown} bId
 * @returns {{ fromId:string, toId:string, relationshipKey:string } | null}
 */
export function canonicalRelationshipSeed(aId, bId) {
  const a = text(aId);
  const b = text(bId);
  if (!a || !b || a === b) return null;
  const [fromId, toId] = [a, b].sort(codepoint);
  return { fromId, toId, relationshipKey: edgeIdFor(fromId, toId) };
}

/**
 * Add the explicitly declared relationship identity when the pair has no edge.
 * Invalid/self seeds and already-connected pairs return the input reference.
 *
 * @template {GraphLike} T
 * @param {T} graph
 * @param {SeedOutcome} outcome
 * @param {string|null|undefined} now
 * @returns {T}
 */
export function ensureRelationshipEdgeSeed(graph, outcome, now) {
  const seed = outcome?.metadata?.relationshipSeed;
  if (!seed) return graph;
  const identity = canonicalRelationshipSeed(seed.fromId, seed.toId);
  if (!identity) return graph;
  const { fromId: from, toId: to } = identity;

  const edges = Array.isArray(graph?.edges) ? graph.edges : [];
  const existing = edges.some((edge) => {
    const a = text(edge?.from);
    const b = text(edge?.to);
    return (a === from && b === to) || (a === to && b === from);
  });
  if (existing) return graph;

  const relationshipKey = text(seed.relationshipKey)
    || text(outcome?.proposalPayload?.relationshipKey)
    || identity.relationshipKey;
  const fromType = text(seed.fromType)
    || text(outcome?.proposalPayload?.fromType)
    || 'neutral';
  const stamp = text(now) || null;
  const reason = text(outcome?.headline) || `${from} escalates against ${to}.`;
  const source = text(seed.source) || 'trade_war_escalation';
  return /** @type {T} */ ({
    ...graph,
    edges: [
      ...edges,
      {
        id: relationshipKey,
        from,
        to,
        relationshipType: fromType,
        status: 'active',
        channelIds: [],
        evidence: [{ source, reason, outcomeId: text(outcome?.id) || null }],
        ...(stamp ? { updatedAt: stamp } : {}),
      },
    ],
    ...(stamp ? { updatedAt: stamp } : {}),
  });
}
