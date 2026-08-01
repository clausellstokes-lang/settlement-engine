/**
 * domain/worldPulse/npcCirculationTransit.js — W-H3: THE TRAVEL PHYSICS OF A WANDERER.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §6 TRAVEL PHYSICS, owner amendment 2026-07-31;
 * directive 8's one-hop rule. Law 5 DORMANCY.)
 *
 * THE RULE, LITERALLY: a roamer moves at most ONE route-hop per tick, only on routes
 * connected to their current settlement, and may be MID-ROUTE at any pause. The
 * conditional-ledger shape is the armyTransit pattern, applied to a person: the leg is a
 * drop-when-empty field on the roamer's OWN ledger record rather than a second top-level
 * ledger key, so a walker cannot exist without a soul and law 6's conservation stays
 * structural instead of becoming a cross-map agreement that somebody has to check.
 *
 * ── WHY ONE HOP, AND WHY IT IS A DESIGNED CONSEQUENCE ──────────────────────
 * A person travels at road speed while their story travels at news speed. That gap IS
 * the reputation race (design §6b): whether the wanderer or the rumour reaches a gate
 * first depends on distance, route quality and who is listening. Let a roamer teleport
 * to their destination and the race disappears, taking the most interesting property of
 * the whole circulation system with it.
 *
 * ── THE NEXT HOP IS READ, NEVER RE-DERIVED ─────────────────────────────────
 * "Connected to their current settlement" is a graph question the estate already
 * answers. candidateRoutes() walks the frozen digest's routing adjacency (land gates,
 * plus sea lanes and teleport edges where the endpoints qualify), so taking path[1] off
 * its cheapest candidate yields a node that is adjacent BY CONSTRUCTION. Re-deriving an
 * adjacency map here would fork the one distanceRead.js memoizes, and the fork would
 * quietly disagree about ports the day somebody added a lane.
 *
 * ── HIDDEN PATHS: A SEAM, NOT AN IMPORT (the J3 coordination) ──────────────
 * Design §6 gives wanderers hidden paths and denies them to armies. The hidden-path
 * network belongs to the J program, and this slice may not reach into its files, so the
 * coupling is an OPTIONAL CALLBACK: `hiddenHopsOf(fromId)` yields the ids reachable from
 * here by a hidden way. ABSENT (every caller today) the module is byte-identical to the
 * road-only reading, which is what makes this a convention rather than a dependency. The
 * army lane never passes the callback and therefore never gets the paths; that asymmetry
 * is enforced by which caller supplies the hook, which is the only place it CAN be
 * enforced without one program editing the other's files.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation, and
 * ZERO rng draws.
 *
 * @enforced-by tests/domain/npcCirculationTransit.test.js
 */

import { candidateRoutes, hopWeeks, pathCost } from '../spatial/distanceRead.js';
import { clamp01 } from '../../kernel/math.js';
import { NPC_CONSEQUENCES_TUNING } from './npcConsequencesTuning.js';

/** @typedef {import('../spatial/distanceRead.js').SpatialDigest} SpatialDigest */
/** @typedef {import('./npcLedger.js').NpcLedger} NpcLedger */

/**
 * @typedef {Object} WanderLeg
 * @property {string} fromId
 * @property {string} toId
 * @property {number} departTick
 * @property {number} arrivalTick
 * @property {true} [hidden]
 */

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/** @param {unknown} v @returns {number} a non-negative integer tick */
function tickOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/**
 * THE NEXT SETTLEMENT ON THE WAY. One hop, adjacent by construction, or null when there
 * is no route at all (an unmapped endpoint, an unreachable destination, or a walker who
 * is already where they are going).
 *
 * The hidden-path arm only ever REPLACES the road hop when the hidden way lands strictly
 * closer to the destination, so a hook that offers a detour cannot make a wanderer walk
 * away from where they are trying to get to. Ties keep the road: the ordinary route is
 * the default reading, and a hidden way has to earn the trip.
 *
 * @param {Object} args
 * @param {SpatialDigest|null|undefined} args.digest
 * @param {string} args.fromId
 * @param {string} args.destId
 * @param {((fromId: string) => ReadonlyArray<string>)|null} [args.hiddenHopsOf]
 * @returns {{ toId: string, hidden: boolean }|null}
 */
export function nextHopToward({ digest, fromId, destId, hiddenHopsOf = null }) {
  const from = text(fromId);
  const dest = text(destId);
  if (!digest || !from || !dest || from === dest) return null;

  const routes = candidateRoutes(digest, from, dest, 1);
  const path = routes.length && Array.isArray(routes[0].path) ? routes[0].path.map(String) : [];
  const roadHop = path.length >= 2 && path[0] === from ? path[1] : null;

  if (typeof hiddenHopsOf !== 'function') {
    return roadHop ? { toId: roadHop, hidden: false } : null;
  }
  const roadCost = roadHop == null ? null : pathCost(digest, roadHop, dest);
  let best = roadHop;
  let bestCost = roadCost;
  let hidden = false;
  for (const raw of hiddenHopsOf(from) || []) {
    const candidate = text(raw);
    if (!candidate || candidate === from) continue;
    const cost = pathCost(digest, candidate, dest);
    if (cost == null) continue;
    // STRICTLY closer, and codepoint-lowest among equals, so two hidden ways that tie
    // resolve the same in every process rather than by callback iteration order.
    if (bestCost == null || cost < bestCost || (hidden && cost === bestCost && candidate < text(best))) {
      best = candidate;
      bestCost = cost;
      hidden = true;
    }
  }
  return best ? { toId: best, hidden } : null;
}

/**
 * OPEN ONE LEG. The walker commits to exactly one edge this tick and is MID-ROUTE until
 * its arrival tick. A hidden way costs HIDDEN_PATH_SLOWDOWN times the nominal hop: the
 * design's "wanderers may use hidden paths (slowly)" is a real price, not a flavour note.
 *
 * The arrival is always at least one tick after departure, so a leg can never resolve on
 * the tick it opened and "one hop per tick" cannot be laundered into several.
 *
 * @param {Object} args
 * @param {SpatialDigest|null|undefined} args.digest
 * @param {string} args.fromId
 * @param {string} args.destId
 * @param {number} args.tick
 * @param {((fromId: string) => ReadonlyArray<string>)|null} [args.hiddenHopsOf]
 * @returns {WanderLeg|null}
 */
export function planWanderLeg({ digest, fromId, destId, tick, hiddenHopsOf = null }) {
  const hop = nextHopToward({ digest, fromId, destId, hiddenHopsOf });
  if (!hop) return null;
  const depart = tickOf(tick);
  const nominal = hopWeeks(/** @type {SpatialDigest} */ (digest), text(fromId), hop.toId);
  const weeks = Math.max(1, Number.isFinite(nominal) && nominal != null ? Number(nominal) : 1);
  const cost = hop.hidden ? weeks * NPC_CONSEQUENCES_TUNING.HIDDEN_PATH_SLOWDOWN : weeks;
  /** @type {Record<string, unknown>} */
  const leg = {
    fromId: text(fromId),
    toId: hop.toId,
    departTick: depart,
    arrivalTick: depart + Math.max(1, Math.floor(cost)),
  };
  if (hop.hidden) leg.hidden = true;
  return /** @type {WanderLeg} */ (leg);
}

/**
 * WHERE THE WALKER IS at `tick`. A leg that has not reached its arrival tick puts the
 * walker MID-ROUTE with a 0..1 progress reading and NO settlement; one that has puts
 * them at the far end.
 *
 * `progress01` is the position the armyTransit ledger pattern calls for, and it is a
 * derived read rather than a stored one: storing a position would need a per-tick write
 * for a value that is a pure function of three integers already on the leg.
 *
 * @param {WanderLeg|null|undefined} leg
 * @param {number} tick
 * @returns {{ arrived: boolean, atSettlementId: string|null, progress01: number }}
 */
export function wanderPosition(leg, tick) {
  if (!leg || !text(leg.fromId) || !text(leg.toId)) {
    return { arrived: true, atSettlementId: null, progress01: 1 };
  }
  const now = tickOf(tick);
  const depart = tickOf(leg.departTick);
  const arrive = Math.max(depart + 1, tickOf(leg.arrivalTick));
  if (now >= arrive) return { arrived: true, atSettlementId: text(leg.toId), progress01: 1 };
  return { arrived: false, atSettlementId: null, progress01: clamp01((now - depart) / (arrive - depart)) };
}

/**
 * @typedef {Object} WanderStep
 * @property {WanderLeg|null} leg   the leg to carry after this tick, null when at rest
 * @property {string} atSettlementId  where the walker is, '' while mid-route
 * @property {boolean} arrived      the walker completed a leg this tick
 * @property {boolean} changed
 */

/**
 * ADVANCE ONE WALKER ONE TICK. The whole physics in one call:
 *   - mid-route  ⇒ stay on the leg (no new hop; this is the one-hop rule's teeth);
 *   - arriving   ⇒ land at the far end and CLOSE the leg, taking no further hop this
 *                  tick, so a walker can never cross two edges in one advance;
 *   - at rest    ⇒ open at most one new leg toward the destination.
 *
 * A walker already at their destination gets a null leg and stays put, which is how a
 * journey ends without a terminal state anybody has to remember to write.
 *
 * @param {Object} args
 * @param {SpatialDigest|null|undefined} args.digest
 * @param {string} args.atSettlementId  where the walker rests ('' while mid-route)
 * @param {WanderLeg|null|undefined} args.leg
 * @param {string} args.destId
 * @param {number} args.tick
 * @param {((fromId: string) => ReadonlyArray<string>)|null} [args.hiddenHopsOf]
 * @returns {WanderStep}
 */
export function advanceWanderer({ digest, atSettlementId, leg, destId, tick, hiddenHopsOf = null }) {
  const now = tickOf(tick);
  if (leg && text(leg.toId)) {
    const position = wanderPosition(leg, now);
    if (!position.arrived) {
      return { leg: /** @type {WanderLeg} */ (leg), atSettlementId: '', arrived: false, changed: false };
    }
    return { leg: null, atSettlementId: text(leg.toId), arrived: true, changed: true };
  }
  const here = text(atSettlementId);
  const dest = text(destId);
  if (!here || !dest || here === dest) {
    return { leg: null, atSettlementId: here, arrived: false, changed: false };
  }
  const next = planWanderLeg({ digest, fromId: here, destId: dest, tick: now, hiddenHopsOf });
  if (!next) return { leg: null, atSettlementId: here, arrived: false, changed: false };
  return { leg: next, atSettlementId: '', arrived: false, changed: true };
}
