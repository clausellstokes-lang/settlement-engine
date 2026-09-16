/**
 * patronCounterforce.js — the existing relationship graph read as protection.
 *
 * A patron relationship has one directional meaning: the senior protects the
 * junior. This pure leaf resolves that direction through the relationship core,
 * including legacy `client` edges and state-stamped reversals, then publishes a
 * deterministic victim-to-patrons index. It owns no score, state, clock, or RNG.
 */

import {
  ensureRelationshipState,
  normalizeRelationshipEdge,
  relationshipKeyFromEdge,
  relationshipRoles,
} from './relationshipState.js';

/** Codepoint order is the repository's serialized-winner law. @param {string} a @param {string} b @returns {number} */
function codepointCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * Build the patron protection index once for a world read.
 *
 * Multiple patrons are retained because an imported or transient graph can carry
 * more than one claim. Both victim keys and patron ids are codepoint ordered, so
 * edge iteration order cannot choose a different counterforce.
 *
 * @param {{ edges?: unknown[] } | null | undefined} graph
 * @param {Record<string, unknown> | null | undefined} worldState
 * @returns {Map<string, readonly string[]>}
 */
export function buildPatronCounterforceIndex(graph, worldState) {
  const edges = Array.isArray(graph?.edges) ? graph.edges : [];
  const states = asObject(asObject(worldState).relationshipStates);
  /** @type {Map<string, Set<string>>} */
  const gathered = new Map();

  for (const raw of edges) {
    const rawEdge = asObject(raw);
    const edge = normalizeRelationshipEdge(rawEdge);
    const key = relationshipKeyFromEdge(edge);
    const state = ensureRelationshipState(edge, asObject(states[key]));
    if (state.relationshipType !== 'patron') continue;

    const { seniorId, juniorId } = relationshipRoles(edge, state);
    const patronId = String(seniorId || '');
    const victimId = String(juniorId || '');
    if (!patronId || !victimId || patronId === victimId) continue;

    const patrons = gathered.get(victimId) || new Set();
    patrons.add(patronId);
    gathered.set(victimId, patrons);
  }

  return new Map([...gathered.entries()]
    .sort(([a], [b]) => codepointCompare(a, b))
    .map(([victimId, patrons]) => [
      victimId,
      Object.freeze([...patrons].sort(codepointCompare)),
    ]));
}

/**
 * Read the counterforce for one prospective victim. The codepoint-first patron
 * is the stable representative; the full sorted set remains available to later
 * receipts and dissolution readers without another graph scan.
 *
 * @param {Map<string, readonly string[]> | null | undefined} index
 * @param {unknown} victimId
 * @returns {{ patronId: string, patronIds: readonly string[] } | null}
 */
export function patronCounterforceFor(index, victimId) {
  const patronIds = index instanceof Map ? index.get(String(victimId ?? '')) : null;
  if (!Array.isArray(patronIds) || patronIds.length === 0) return null;
  return { patronId: patronIds[0], patronIds };
}
