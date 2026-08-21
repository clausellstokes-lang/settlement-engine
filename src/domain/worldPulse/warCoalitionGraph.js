/**
 * WR-6 coalition graph reads.
 *
 * A coalition is never a membership object.  It is the projection of ordinary
 * bilateral `allied` relationship edges around one ordinary deployment.  This
 * leaf owns only deterministic topology reads; callers still create one army
 * and one war-front edge per joining settlement.
 */

import {
  ensureRelationshipState,
  getRelationshipSettlements,
  normalizeRelationshipEdge,
  relationshipKeyFromEdge,
} from './relationshipState.js';

/** Repository-wide deterministic string order. */
function codepoint(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * Canonical bilateral alliance rows.  Aliases are normalized by the existing
 * relationship-state authority; legality then requires the canonical `allied`
 * state exactly.  Parallel authored edges collapse by pair onto the lowest
 * relationship key so every caller picks the same contract.
 *
 * @param {{ regionalGraph?: {edges?:unknown[]}, relationships?:unknown[], worldState?:unknown }|null|undefined} snapshot
 * @returns {Array<{relationshipKey:string,aId:string,bId:string,state:Record<string, unknown>}>>}
 */
export function canonicalAllianceRows(snapshot) {
  const worldState = asObject(snapshot?.worldState);
  const states = asObject(worldState.relationshipStates);
  const edges = Array.isArray(snapshot?.regionalGraph?.edges)
    ? snapshot.regionalGraph.edges
    : Array.isArray(snapshot?.relationships) ? snapshot.relationships : [];
  /** @type {Map<string, {relationshipKey:string,aId:string,bId:string,state:Record<string, unknown>}>} */
  const byPair = new Map();
  for (const raw of edges) {
    const edge = normalizeRelationshipEdge(raw);
    const relationshipKey = String(relationshipKeyFromEdge(raw));
    const state = /** @type {Record<string, unknown>} */ (
      ensureRelationshipState(edge, asObject(states[relationshipKey]))
    );
    if (state.relationshipType !== 'allied') continue;
    const endpoints = getRelationshipSettlements(edge);
    const fromId = endpoints.from != null ? String(endpoints.from) : '';
    const toId = endpoints.to != null ? String(endpoints.to) : '';
    if (!fromId || !toId || fromId === toId) continue;
    const [aId, bId] = [fromId, toId].sort(codepoint);
    const pairKey = `${aId}\u0000${bId}`;
    const prior = byPair.get(pairKey);
    if (prior && codepoint(prior.relationshipKey, relationshipKey) <= 0) continue;
    byPair.set(pairKey, { relationshipKey, aId, bId, state });
  }
  return [...byPair.values()].sort((a, b) => codepoint(a.relationshipKey, b.relationshipKey));
}

/**
 * Canonical allies adjacent to one settlement.
 * @param {ReturnType<typeof canonicalAllianceRows>} rows
 * @param {unknown} settlementId
 */
export function alliesOf(rows, settlementId) {
  const wanted = String(settlementId);
  return rows.flatMap((row) => {
    if (row.aId === wanted) return [{ allyId: row.bId, relationshipKey: row.relationshipKey, state: row.state }];
    if (row.bId === wanted) return [{ allyId: row.aId, relationshipKey: row.relationshipKey, state: row.state }];
    return [];
  }).sort((a, b) => codepoint(a.allyId, b.allyId) || codepoint(a.relationshipKey, b.relationshipKey));
}

/** Exact relationship-key and endpoint read used by a persisted join anchor. */
export function allianceRowForAnchor(rows, anchor) {
  const partyId = String(anchor?.partyId || '');
  const callerId = String(anchor?.callerId || '');
  const relationshipKey = String(anchor?.allianceRelationshipKey || '');
  return rows.find((row) => row.relationshipKey === relationshipKey
    && ((row.aId === partyId && row.bId === callerId)
      || (row.aId === callerId && row.bId === partyId))) || null;
}
