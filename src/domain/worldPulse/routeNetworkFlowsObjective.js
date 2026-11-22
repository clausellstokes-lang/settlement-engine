/**
 * routeNetworkFlowsObjective.js — THE MATERIAL OBJECTIVE (W-J slice J2; binding
 * law docs/DESIGN_ROUTE_LIFECYCLE.md §5).
 *
 * §5 states the owner's efficiency law as an equation: a candidate corridor scores
 * by its LOCAL term (both endpoints' unmet demand reduced, denominated in the
 * goodsCatalog vocabulary) TIMES its SYSTEM term (does this close a material loop
 * the realm cannot close today?) PLUS a RESILIENCE credit (a second path for a
 * critical good) MINUS its COST. This file is that equation and nothing else.
 *
 * IT MINTS NO EVENTS. J2 measures; J3 charters. A scorer that also proposed would
 * make the tuning pass impossible, because there would be no way to ask what the
 * numbers say without also changing the world.
 *
 * ── WHY THE PRODUCT, AND NOT A SUM ─────────────────────────────────────────
 * LOCAL times SYSTEM is the design's wording and it is the right shape: a corridor
 * whose endpoints want a great deal from each other but whose realm can already
 * serve every one of those wants by another road is a convenience, not an artery,
 * and a sum would let raw local appetite buy it anyway. The product means a road
 * has to be BOTH wanted here AND unserved elsewhere. Resilience is the deliberate
 * exception, added rather than multiplied, because a second way to move grain is
 * worth something precisely when the first way already exists.
 *
 * ── THE RECEIPT IS STRUCTURED, NOT PROSE ───────────────────────────────────
 * §5's illustration is "grain wants to move west". What this returns is that
 * sentence's data: which good, from which settlement, to which settlement, with
 * the catalog's own label attached. Composing the sentence is the Herald's job
 * under the NEWS ADDRESS LAW (ids plus a typed reason, resolved to names at the
 * surface), and a compass word would be worse than useless here because the frozen
 * digest is a cost matrix and carries no bearings: any direction this layer
 * printed would be invented.
 *
 * ── WHAT IS DELIBERATELY NOT HERE ──────────────────────────────────────────
 * §5b's DANGER ADJUSTMENT and the greed override, and §5c's bypass geometry. Both
 * price the same COST term this file computes, both read the believed-danger view
 * through knownWorld, and both belong with the charter events that act on them
 * (J3). The seam is `corridorCost01`, which is the one function they extend.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store.
 */

import { clamp01 } from '../../kernel/math.js';
import { MAX_HOP_WEEKS, activeSpatialDigest, hopWeeks } from '../spatial/distanceRead.js';
import { buildMaterialIndex, wantsAcross } from './routeNetworkFlowsMaterial.js';

/**
 * ROUTE_LIFECYCLE_TUNING, the objective half (§12: every entry a band).
 *
 * RESILIENCE_STEP is what one redundant critical good is worth, and the credit
 * saturates at 1 so a realm cannot buy a road by wanting four kinds of grain.
 * COST_WEIGHT and RESILIENCE_WEIGHT set how loudly cost and redundancy speak
 * against a local-times-system term that already lives on 0..1.
 *
 * ASPATIAL_COST01 is the honest answer for a realm with no geometry: not free, not
 * prohibitive, a middling road. An UNREACHABLE pair pays the ceiling, which is how
 * "too far for any expedition to be worth it" (§0's isolation-as-fate) reaches the
 * objective without a separate rule.
 *
 * @type {Readonly<Record<string, number>>}
 */
export const ROUTE_OBJECTIVE_TUNING = Object.freeze({
  RESILIENCE_STEP: 0.25,
  RESILIENCE_WEIGHT: 0.35,
  COST_WEIGHT: 0.5,
  ASPATIAL_COST01: 0.35,
  UNREACHABLE_COST01: 1,
});

/** Four decimal places, so a score is stable to compare and legible to read. */
/** @param {number} value @returns {number} */
function round4(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 10000) / 10000 : 0;
}

/**
 * THE COST TERM, on 0..1 (§5: travel-cost raster times distance times terrain,
 * water mode over sea-lane costs).
 *
 * It reads `hopWeeks`, which is the estate's ONE canonical travel-time accessor:
 * it already rides `pathCost`, which already augments a port pair with the frozen
 * sea-lane route and already applies the seasonal surcharge. Re-deriving a cost
 * here would be a second implementation of distance that drifts from the one every
 * other mover uses, and travel time in weeks is also the unit J3's
 * expedition-worth ceiling wants to speak in.
 *
 * This is the seam §5b's danger adjustment extends.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string} a @param {string} b
 * @param {string|null} [season]
 * @returns {number} 0..1
 */
export function corridorCost01(worldState, a, b, season = null) {
  const digest = activeSpatialDigest(worldState);
  if (!digest) return ROUTE_OBJECTIVE_TUNING.ASPATIAL_COST01;
  const weeks = hopWeeks(digest, a, b, season);
  if (weeks == null) return ROUTE_OBJECTIVE_TUNING.UNREACHABLE_COST01;
  return clamp01(weeks / MAX_HOP_WEEKS);
}

/**
 * @typedef {Object} MaterialObjectiveScore
 * @property {string} a @property {string} b
 * @property {number} local01      both endpoints' unmet demand this corridor could reduce
 * @property {number} system01     the share of those wants the realm cannot serve today
 * @property {number} resilience01 the second-path credit for critical goods
 * @property {number} cost01       travel cost, 0 free to 1 prohibitive
 * @property {number} score        local01 * system01 + weighted resilience - weighted cost
 * @property {ReadonlyArray<string>} reasonGoods  the goods-denominated reason
 * @property {ReadonlyArray<import('./routeNetworkFlowsMaterial.js').MaterialWant>} wants
 * @property {number} unservedWants  how many wants no road serves today
 */

/**
 * SCORE ONE CANDIDATE CORRIDOR (§5). Pure, and total over an empty realm: a pair
 * with no wants at all scores its cost as a negative, which is the honest reading
 * that a road nobody needs is worse than no road.
 *
 * @param {{
 *   index: import('./routeNetworkFlowsMaterial.js').MaterialIndex,
 *   a: string, b: string,
 *   worldState?: Record<string, unknown>|null,
 *   season?: string|null,
 * }} input
 * @returns {MaterialObjectiveScore}
 */
export function scoreMaterialObjective(input) {
  const a = String(input.a);
  const b = String(input.b);
  const index = input.index;
  const wants = wantsAcross(index, a, b);

  const appetite = (index.importsOf.get(a) || new Set()).size
    + (index.importsOf.get(b) || new Set()).size;
  const local01 = appetite === 0 ? 0 : clamp01(wants.length / appetite);

  const unserved = wants.filter(want => !want.alreadyServed).length;
  const system01 = wants.length === 0 ? 0 : clamp01(unserved / wants.length);

  const redundantCritical = wants.filter(want => want.critical && want.alreadyServed).length;
  const resilience01 = clamp01(redundantCritical * ROUTE_OBJECTIVE_TUNING.RESILIENCE_STEP);

  const cost01 = corridorCost01(input.worldState || null, a, b, input.season || null);

  const score = (local01 * system01)
    + (resilience01 * ROUTE_OBJECTIVE_TUNING.RESILIENCE_WEIGHT)
    - (cost01 * ROUTE_OBJECTIVE_TUNING.COST_WEIGHT);

  /** @type {Array<string>} */
  const reasonGoods = [];
  for (const want of wants) {
    if (!reasonGoods.includes(want.good)) reasonGoods.push(want.good);
  }
  reasonGoods.sort();

  return {
    a,
    b,
    local01: round4(local01),
    system01: round4(system01),
    resilience01: round4(resilience01),
    cost01: round4(cost01),
    score: round4(score),
    reasonGoods: Object.freeze(reasonGoods),
    wants: Object.freeze(wants),
    unservedWants: unserved,
  };
}

/**
 * THE DUAL-BENEFIT MERCY (§5), and it is a COUNTERFACTUAL, which is the trap this
 * function exists to close.
 *
 * Asking "does this edge serve an unserved want?" of a network that still contains
 * the edge always answers no, because the edge itself is what serves them. The
 * question §5 actually asks is whether REMOVING it would strand a material loop,
 * so the score has to be taken against the network MINUS the edge. Scoring the
 * live network here would have produced a mercy rule that never once fired, and
 * nothing about the reading would have looked wrong.
 *
 * Returns the counterfactual score, whose `unservedWants` is the number of wants
 * that would be stranded. J3's removal evaluation reads it; §5 says an edge with
 * any stranded want resists removal even while an endpoint struggles, because
 * endpoint health alone is the wrong question to ask about an artery.
 *
 * @param {{
 *   members: ReadonlyArray<import('./routeNetworkFlowsMaterial.js').MaterialMember>,
 *   network: import('./routeNetworkLedger.js').RouteNetwork,
 *   edgeId: string,
 *   worldState?: Record<string, unknown>|null,
 *   season?: string|null,
 * }} input
 * @returns {MaterialObjectiveScore|null} null when no such edge exists
 */
export function scoreEdgeRemoval(input) {
  const edges = input.network && input.network.edges ? input.network.edges : {};
  const edge = edges[String(input.edgeId)];
  if (!edge) return null;
  /** @type {Record<string, import('./routeNetworkLedger.js').RouteEdge>} */
  const without = {};
  for (const id of Object.keys(edges).sort()) {
    if (id === String(input.edgeId)) continue;
    without[id] = edges[id];
  }
  const index = buildMaterialIndex({
    members: input.members,
    network: { edges: without, corridor: input.network.corridor || {} },
  });
  return scoreMaterialObjective({
    index,
    a: String(edge.a),
    b: String(edge.b),
    worldState: input.worldState || null,
    season: input.season || null,
  });
}

/**
 * Would removing this edge strand a material loop? The one-word reading of
 * `scoreEdgeRemoval`, for the callers that only need the verdict.
 *
 * @param {MaterialObjectiveScore|null} counterfactual the score from scoreEdgeRemoval
 * @returns {boolean}
 */
export function isSystemCritical(counterfactual) {
  return !!counterfactual && counterfactual.unservedWants > 0;
}
