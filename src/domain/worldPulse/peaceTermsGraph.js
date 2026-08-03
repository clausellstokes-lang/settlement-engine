/**
 * domain/worldPulse/peaceTermsGraph.js — THE PEACE ENGINE'S GRAPH READS.
 *
 * Everything the peace layer learns by looking at the regional graph and the
 * relationship overlay rather than at the ledger: who neighbours whom, the REAL
 * edge key between two settlements (the overlay is keyed by the edge's own id, so
 * a synthesized key would orphan the write), the loser's ally network, the
 * victor's tie-strength to its co-besiegers, the cross-pressured broker standing
 * between two courts, and the durable sue-for-peace incident that says "this war
 * ended by treaty". Pure reads — no leaf here writes.
 *
 * Extracted verbatim from peaceTerms.js by THE DECOMPOSITION WAVE (war tranche,
 * file 2 of 4).
 */
import { clamp01 } from '../../kernel/math.js';
import { relationshipKeyFromEdge } from './relationshipState.js';
import { faithAlignmentQuadrant, crossPressureMediation } from '../spatial/cohesionWeave.js';
// The pair's faith×alignment proximity read — owned by sacredClaim.js (a pure leaf) so the
// war side can read it too without closing a cycle back through this module.
import { faithProximityOf } from './sacredClaim.js';
import { PEACE_TERMS_TUNING } from './peaceTermsCatalog.js';
import { recordOf, explicitText } from './peaceTermsPrimitives.js';

/** @param {Array<Record<string, unknown>>} edges @returns {Map<string, Set<string>>} */
export function buildAdjacency(edges) {
  /** @type {Map<string, Set<string>>} */
  const adjacency = new Map();
  for (const edge of edges) {
    const a = edge?.from != null ? String(edge.from) : '';
    const b = edge?.to != null ? String(edge.to) : '';
    if (!a || !b) continue;
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    /** @type {Set<string>} */ (adjacency.get(a)).add(b);
    /** @type {Set<string>} */ (adjacency.get(b)).add(a);
  }
  return adjacency;
}

/** Find the REAL graph edge key between two settlements (the relationshipStates
 *  overlay is keyed by the edge's own id, so a synthesized key would orphan).
 *  @param {Array<Record<string, unknown>>} edges @param {string} a @param {string} b @returns {string | null} */
export function edgeKeyBetween(edges, a, b) {
  for (const edge of edges) {
    const f = edge?.from != null ? String(edge.from) : '';
    const t = edge?.to != null ? String(edge.to) : '';
    if ((f === a && t === b) || (f === b && t === a)) return relationshipKeyFromEdge(edge);
  }
  return null;
}

/** The pinned updatedAt for an overlay write — `now` when threaded, else the
 *  world's own stamp (deterministic; never a wall clock). @param {Record<string, unknown>} ws @param {unknown} now @returns {unknown} */
export function overlayStamp(ws, now) {
  return now == null ? (/** @type {{ updatedAt?: unknown }} */ (ws).updatedAt ?? null) : now;
}

/** The loser's ally-network strength (its non-victor neighbours), 0..1 — compelled
 *  alliance ranks high precisely when the loser has strong friends (§15.1).
 *  @param {Map<string, Set<string>>} adjacency @param {string} loserId @param {string} victorId @returns {number} */
export function loserAllyStrength(adjacency, loserId, victorId) {
  const near = adjacency.get(loserId);
  if (!near) return 0;
  let n = 0;
  for (const id of near) { if (id !== victorId) n += 1; }
  return clamp01(n / PEACE_TERMS_TUNING.ALLY_SATURATION);
}

/** The victor's average believed tie-strength (trust) to its co-besiegers — the
 *  cohesion the peel read weighs against. No edges ⇒ 0 (isolated ⇒ peels easily).
 *  @param {Record<string, unknown>} worldState @param {Array<Record<string, unknown>>} edges
 *  @param {string} victorId @param {string[]} coBesiegers @returns {number} */
export function avgTieStrength(worldState, edges, victorId, coBesiegers) {
  if (coBesiegers.length === 0) return 0;
  let sum = 0; let n = 0;
  for (const ally of coBesiegers) {
    const key = edgeKeyBetween(edges, victorId, ally);
    if (!key) continue;
    const rel = /** @type {{ relationshipStates?: Record<string, { trust?: number }> }} */ (worldState).relationshipStates?.[key];
    sum += clamp01(Number(rel?.trust) || 0); n += 1;
  }
  return n > 0 ? clamp01(sum / n) : 0;
}

// ── Mediation at the table (§13 / §14.2 — the cross-pressured broker) ────────
//
// The single source of the cross-pressured-mediator read: the MINT names a
// qualified mediator in the treaty (softening the terms, earning trust both
// directions), and peaceReasons.advancePeaceReasons imports THIS finder through
// the head's re-export for its mediation peace-reason — one finder, so the reason
// and the treaty never drift.

/**
 * Find the first (codepoint-ordered) third settlement adjacent to BOTH
 * belligerents whose quadrant reads are cross-pressured per cohesionWeave — the
 * neutral broker torn between the pair (a faith-brother of one, alignment-kin of
 * the other). Null when none stands between them.
 * @param {{ byId?: Map<string, Record<string, unknown>> } | null | undefined} snapshot
 * @param {{ edges?: Array<Record<string, unknown>> } | null} graph
 * @param {string} partyId @param {string} foeId
 * @returns {{ id: string, name: string } | null}
 */
export function findCrossPressuredMediator(snapshot, graph, partyId, foeId) {
  const edges = Array.isArray(graph?.edges) ? graph.edges : [];
  const adjacency = buildAdjacency(edges);
  const partyItem = snapshot?.byId?.get?.(partyId);
  const foeItem = snapshot?.byId?.get?.(foeId);
  for (const mId of [...adjacency.keys()].sort()) {
    if (mId === partyId || mId === foeId) continue;
    const near = /** @type {Set<string>} */ (adjacency.get(mId));
    if (!near.has(partyId) || !near.has(foeId)) continue;
    const mItem = snapshot?.byId?.get?.(mId);
    if (!mItem) continue;
    const toA = faithAlignmentQuadrant(faithProximityOf(mItem, partyItem));
    const toB = faithAlignmentQuadrant(faithProximityOf(mItem, foeItem));
    if (crossPressureMediation({ toA, toB }).crossPressured) {
      return { id: mId, name: String(/** @type {{ name?: unknown }} */ (mItem).name || mId) };
    }
  }
  return null;
}

/** The exact sue-for-peace de-escalation inside the mint window. The
 *  incident is stamped by applyRelationshipPatch when the peace label change applies
 *  ({ type: 'strategy_sue_for_peace', outcomeId: '…sue_for_peace…' }). Durable —
 *  it survives on recentIncidents long after the deployment recall is consumed.
 *  Imported order is not chronology, so the newest exact row wins
 *  deterministically.
 *  @param {Array<{ type?: unknown, tick?: unknown, outcomeId?: unknown }> | undefined} incidents
 *  @param {number} tick @returns {Record<string, unknown>|null} */
export function recentSueForPeaceIncident(incidents, tick) {
  if (!Array.isArray(incidents)) return null;
  const candidates = [];
  for (const raw of incidents) {
    const inc = recordOf(raw);
    const at = Number(inc?.tick);
    if (!Number.isFinite(at) || at > tick || tick - at > PEACE_TERMS_TUNING.PEACE_MINT_WINDOW) continue;
    if (String(inc?.type || '').includes('sue_for_peace')
      || String(inc?.outcomeId || '').includes('sue_for_peace')) candidates.push(inc);
  }
  candidates.sort((left, right) => (Number(right.tick) - Number(left.tick))
    || (explicitText(left.outcomeId) < explicitText(right.outcomeId) ? -1
      : explicitText(left.outcomeId) > explicitText(right.outcomeId) ? 1 : 0));
  return candidates[0] || null;
}
