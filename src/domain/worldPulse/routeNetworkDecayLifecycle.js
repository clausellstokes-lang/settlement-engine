/**
 * routeNetworkDecayLifecycle.js — DESTRUCTION AND REVIVAL (W-J slice J3; binding
 * law docs/DESIGN_ROUTE_LIFECYCLE.md §7, with §1 Law 5).
 *
 * §7 gives the network two events that are not the ordinary ladder, because they
 * are not about traffic at all. A settlement dies and every road it had goes
 * quiet in the same breath; a remnant is resettled and the old roads are asked
 * first whether they are still worth having. This module is those two, and it is
 * separate from the ladder for one reason: their trigger is the SETTLEMENT
 * lifecycle, not the route lifecycle, so the seam they hang off belongs to
 * somebody else.
 *
 * ── COUPLING IS BY THE DESIGN DOC'S CONVENTION ─────────────────────────────
 * Nothing here imports the settlement lifecycle kernel and nothing there imports
 * this. The kernel calls these functions at its terminal-death and resettlement
 * seams when the wiring slice lands, exactly as the user-route lane and the
 * genesis derivation agree about edge identity without either owning the other.
 * Two lanes agreeing through a written convention is how this estate keeps a
 * cross-program coupling from becoming a cross-program dependency.
 *
 * ── LAW 5 IS WHY DESTRUCTION IS A DEMOTION ─────────────────────────────────
 * A dead town's roads go HIDDEN. They are not removed, because nothing in this
 * program removes an edge: the remnant of a road is what pairs with the remnant
 * of a settlement, and the privileged-rebirth law needs both of them to still
 * exist. The revival warm start is the other half of the same sentence.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store.
 */

import { clamp01 } from '../../kernel/math.js';
import { buildMaterialIndex } from './routeNetworkFlowsMaterial.js';
import { ROUTE_CHARTER_TUNING } from './routeNetworkCharter.js';
import {
  REVIVAL_CANDIDATE_TYPE,
  ROUTE_DECAY_TUNING,
  edgeObjectiveScore,
  withEdgeGrade,
} from './routeNetworkDecay.js';
import {
  emptyRouteNetwork,
  readRouteNetwork,
  routeLifecycleActive,
  writeRouteNetwork,
} from './routeNetworkLedger.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number} */
function tickOf(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

/** @param {number} value @returns {number} */
function round4(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 10000) / 10000 : 0;
}

/**
 * SETTLEMENT DESTRUCTION (§7): all of a destroyed settlement's edges drop to
 * hidden IN THE SAME OUTCOME, paired with the cast dispersal.
 *
 * A SINGLE FOLD, deliberately. §7's phrase "in the SAME outcome" is a
 * half-write guarantee: a world where three of a dead town's four roads went
 * hidden and the fourth did not is exactly the state the lifecycle kernel's
 * caller must never be able to observe. So this is one call producing one
 * worldState, and there is no per-edge entry point for it.
 *
 * COUPLING IS BY THE DESIGN DOC'S CONVENTION. Nothing here imports the lifecycle
 * kernel and nothing there imports this; the kernel calls this function at its
 * terminal-death seam when the wiring slice lands, the same way the user-route
 * lane and the genesis derivation agree about edge identity without either owning
 * the other.
 *
 * THE GARRISON FLOOR STILL APPLIES, through `withEdgeGrade`. That is not an
 * oversight to be corrected: a road the army still garrisons does not become an
 * overgrown track because the town at one end of it died, and §7 states the
 * asymmetry as unconditional ("regardless of trade").
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   settlementId: string,
 *   tick: number,
 * }} input
 * @returns {{ worldState: Record<string, unknown>, hidden: ReadonlyArray<string>, changed: boolean }}
 */
export function hideDestroyedSettlementEdges(input) {
  const worldState = input.worldState;
  if (!routeLifecycleActive(worldState)) {
    return { worldState, hidden: Object.freeze([]), changed: false };
  }
  const settlementId = String(input.settlementId);
  const now = tickOf(input.tick);
  const network = readRouteNetwork(worldState) || emptyRouteNetwork();
  const edges = network.edges || {};
  /** @type {Record<string, import('./routeNetworkLedger.js').RouteEdge>} */
  const next = {};
  /** @type {Array<string>} */
  const hidden = [];
  for (const id of Object.keys(edges).sort()) {
    const edge = edges[id];
    next[id] = edge;
    if (!edge || typeof edge !== 'object') continue;
    if (String(edge.a) !== settlementId && String(edge.b) !== settlementId) continue;
    const moved = withEdgeGrade(edge, 'hidden', {
      tick: now, direction: 'down', reason: 'settlement_destroyed',
    });
    if (moved !== edge) { next[id] = moved; hidden.push(id); }
  }
  if (hidden.length === 0) return { worldState, hidden: Object.freeze([]), changed: false };
  return {
    worldState: writeRouteNetwork(worldState, { edges: next, corridor: network.corridor || {} }),
    hidden: Object.freeze(hidden),
    changed: true,
  };
}

/**
 * REVIVAL (§7): a resettled remnant re-evaluates its HIDDEN corridors FIRST, with
 * a warm-start bonus. The old road remembers.
 *
 * "FIRST" is literal rather than decorative: this function looks at nothing but
 * the hidden edges touching the revived settlement, and it runs BEFORE the
 * ordinary charter sweep would ever get to the corridors around it. That ordering
 * is what makes a rebirth reopen the ways the town used to have instead of
 * chartering whatever the k-nearest derivation happens to like today, which is
 * the difference between a settlement remembering its roads and a settlement
 * being handed new ones.
 *
 * The bonus is a bonus. A remnant reborn in a place the realm genuinely no longer
 * needs stays honestly unconnected, which is §0's isolation-as-fate holding even
 * here.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   members: ReadonlyArray<import('./routeNetworkFlowsMaterial.js').MaterialMember>,
 *   settlementId: string,
 *   tick: number,
 *   season?: string|null,
 *   names?: Record<string, string>,
 * }} input
 * @returns {{
 *   worldState: Record<string, unknown>,
 *   revived: ReadonlyArray<string>,
 *   considered: ReadonlyArray<string>,
 *   news: ReadonlyArray<Record<string, unknown>>,
 *   changed: boolean,
 * }}
 */
export function reviveHiddenCorridors(input) {
  const worldState = input.worldState;
  const empty = {
    worldState, revived: Object.freeze([]), considered: Object.freeze([]),
    news: Object.freeze([]), changed: false,
  };
  if (!routeLifecycleActive(worldState)) return empty;
  const settlementId = String(input.settlementId);
  const now = tickOf(input.tick);
  const names = asRecord(input.names);
  const network = readRouteNetwork(worldState) || emptyRouteNetwork();
  const members = Array.isArray(input.members) ? input.members : [];
  const index = buildMaterialIndex({ members, network });
  const edges = network.edges || {};
  const bonus = Number(ROUTE_DECAY_TUNING.WARM_START_BONUS);
  const bar = Number(ROUTE_CHARTER_TUNING.OBJECTIVE_BAR);

  /** @type {Record<string, import('./routeNetworkLedger.js').RouteEdge>} */
  const next = {};
  /** @type {Array<string>} */
  const revived = [];
  /** @type {Array<string>} */
  const considered = [];
  /** @type {Array<Record<string, unknown>>} */
  const news = [];

  for (const id of Object.keys(edges).sort()) {
    const edge = edges[id];
    next[id] = edge;
    if (!edge || typeof edge !== 'object') continue;
    if (String(edge.grade) !== 'hidden') continue;
    if (String(edge.a) !== settlementId && String(edge.b) !== settlementId) continue;
    considered.push(id);
    const score = edgeObjectiveScore({
      worldState,
      index,
      a: String(edge.a),
      b: String(edge.b),
      grade: 'hidden',
      season: input.season || null,
      tick: now,
    }) + bonus;
    if (score < bar) continue;
    const moved = withEdgeGrade(edge, 'track', {
      tick: now, direction: 'up', reason: 'revival_warm_start',
    });
    if (moved === edge) continue;
    next[id] = moved;
    revived.push(id);
    const from = String(names[String(edge.a)] || edge.a);
    const to = String(names[String(edge.b)] || edge.b);
    news.push(Object.freeze({
      id: `routerevival.news:${id}:${now}`,
      candidateType: REVIVAL_CANDIDATE_TYPE,
      targetSaveId: String(edge.a),
      settlementIds: Object.freeze([String(edge.a), String(edge.b)]),
      settlementNames: Object.freeze([from, to]),
      headline: `The old way between ${from} and ${to} is walked again`,
      summary: 'The road was never struck from the map, and the wagons remember it.',
      reasons: Object.freeze(['A resettled remnant reopens the ways it used to have.']),
      severity: round4(clamp01(0.35)),
      tick: now,
    }));
  }

  if (revived.length === 0) {
    return { ...empty, considered: Object.freeze(considered) };
  }
  return {
    worldState: writeRouteNetwork(worldState, { edges: next, corridor: network.corridor || {} }),
    revived: Object.freeze(revived),
    considered: Object.freeze(considered),
    news: Object.freeze(news),
    changed: true,
  };
}
