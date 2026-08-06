/**
 * routeNetworkConsumers.js — THE CONSUMERS, shared reads (W-J slice J4; binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §9 TRAVEL PHYSICS CONSUMERS and §10 SURFACES, with
 * §1 Law 5 NOTHING IS FORGOTTEN and Law 7 DORMANCY).
 *
 * J1 gave the realm a lived network, J2 counted what walked it, J3 chartered and
 * decayed it. Nothing so far has ASKED the network a question. This module is the
 * one place that does: it turns the edge ledger into an adjacency the movers can
 * walk, states the hidden-path access law in one predicate, and projects the edge
 * set as the arterial boundary conditions the cartography program will read.
 *
 * ── THE HIDDEN-PATH LAW IS A PREDICATE, NOT A CONVENTION ────────────────────
 * §9, and J-D9 (d) behind it: wanderers and smugglers may use hidden paths at a
 * grade penalty; ARMIES MAY NOT. That is stated exactly once, in
 * `mayUseHiddenPaths`, and it FAILS CLOSED: a traveller kind this module has
 * never heard of is refused the overgrown road. Fail-closed is the only safe
 * default here, because the failure mode of the other direction is an army
 * marching down a road the design says it cannot find, which no test that did not
 * happen to name that kind would ever catch.
 *
 * The asymmetry is also enforced STRUCTURALLY at the H3 seam. H3's
 * npcCirculationTransit takes an OPTIONAL `hiddenHopsOf(fromId)` callback and is
 * byte-identical to the road-only reading when it is absent; `hiddenHopsFor`
 * returns that callback for a wanderer or a smuggler and NULL for anything else.
 * So the army lane cannot be given the paths even by a caller who wants to: there
 * is no callback to hand it. That is the coordination convention the two programs
 * agreed by design doc rather than by import, and it is why this file reads H3's
 * published seam and never edits H3's files.
 *
 * ── CONNECTED-ONLY MEANS THE LIVED NETWORK, NOT THE DIGEST ──────────────────
 * H3 walks the FROZEN DIGEST's routing adjacency, which is the geometry the realm
 * was born with. §9 says roamers move "only on routes connected to their current
 * settlement", and after J3 the routes a settlement HAS are a worldState fact that
 * diverges from genesis by design (Law 2). So the adjacency this module builds is
 * the LIVED one: chartered roads are in it the tick they materialize, and a
 * corridor that decayed to hidden leaves it for everybody the law does not
 * exempt. Nothing here reads or writes the digest's own graph.
 *
 * ── DORMANT MEANS NO NETWORK AT ALL ─────────────────────────────────────────
 * Every read here is gated on `routeLifecycleActive`, so a dark world answers with
 * an empty adjacency, no hops, no seeds, and a null hidden-path callback. A
 * consumer wired into a dark pulse therefore behaves exactly as it did before this
 * file existed, which is the byte-identity half of Law 7 restated for the
 * consumers.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store, no mutation.
 * Every walk is codepoint-ordered, so a reading is a function of the world and
 * never of the order a Map happened to enumerate.
 */

import {
  ROUTE_GRADES,
  emptyRouteNetwork,
  readRouteNetwork,
  routeLifecycleActive,
} from './routeNetworkLedger.js';

/**
 * The closed TRAVELLER KIND vocabulary. §9 names three of these outright
 * (wanderers, smugglers, armies); `caravan` is the lawful goods mover, and it
 * earns its place in the closed set by being the CONTRAST the smuggler is defined
 * against. §5b's last clause is "the dangerous goods take the overgrown road",
 * which is only a sentence about smuggling if the ordinary caravan is a thing that
 * cannot.
 *
 * ES-1 ADDS `covert_envoy`, AND IT IS A NEW KIND RATHER THAN A WIDENING OF AN OLD ONE.
 * A covert operative is not a smuggler wearing a different word: the smuggler moves
 * GOODS the law forbids and the covert envoy moves CONFIRMATION about a court, and the
 * two answer to different machinery on every other seam (the errand spine prices one, the
 * caravan machinery the other). Naming a spy `smuggler` to borrow the franchise would
 * have made every smuggler read as a mission to a later census.
 *
 * Codepoint-sorted, so the vocabulary reads the same in every receipt.
 * @type {ReadonlyArray<string>}
 */
export const TRAVELLER_KINDS = Object.freeze(['army', 'caravan', 'covert_envoy', 'smuggler', 'wanderer']);

/**
 * THE COVERT OPERATIVE'S KIND (ES-1), exported by name so its ONE call site —
 * `buildEnvoyRoutePlan`'s hop solve — spells it from here rather than from a literal that
 * could drift a character away from the franchise below and fail closed in silence.
 * @type {string}
 */
export const COVERT_ENVOY_KIND = 'covert_envoy';

/**
 * THE HIDDEN-PATH FRANCHISE (§9, J-D9 (d)). The kinds that may walk a way the realm has
 * forgotten. Everything else, named or not, may not.
 *
 * ES-1 admits `covert_envoy` on the design's own sentence — covert travel is HARDER TO
 * CATCH and less credible on any simultaneous open purpose (ES §0), and the overgrown road
 * is where that trade is paid. The ORDINARY envoy is deliberately still absent: an open
 * embassy that took a forgotten way would be an embassy nobody could witness arriving,
 * which is the opposite of what an embassy is for.
 * @type {ReadonlyArray<string>}
 */
export const HIDDEN_PATH_KINDS = Object.freeze(['covert_envoy', 'smuggler', 'wanderer']);

/** The grade a forgotten corridor holds (Law 5's floor). @type {string} */
export const HIDDEN_GRADE = 'hidden';

/**
 * The ARTERIAL AUDIENCE vocabulary (§10). The DM sees the whole network; a player
 * sees the roads the world admits to. Hidden paths are DM truth, per §10's own
 * words: players see the overgrown nothing.
 * @type {ReadonlyArray<string>}
 */
export const ARTERIAL_AUDIENCES = Object.freeze(['dm', 'player']);

/** @param {unknown} value @returns {Record<string, unknown>} */
function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return value == null ? '' : String(value);
}

/**
 * MAY THIS TRAVELLER TAKE A HIDDEN PATH? (§9). The single statement of J-D9 (d),
 * and it fails CLOSED: an unrecognized kind is refused, so a lane that forgets to
 * declare itself gets the army's answer rather than the smuggler's.
 *
 * @param {string|null|undefined} kind
 * @returns {boolean}
 */
export function mayUseHiddenPaths(kind) {
  return HIDDEN_PATH_KINDS.indexOf(text(kind)) >= 0;
}

/**
 * @typedef {Object} LivedHop
 * @property {string} toId     the settlement at the far end
 * @property {string} edgeId   the edge that carries it
 * @property {string} grade    one of ROUTE_GRADES
 * @property {string} mode     one of ROUTE_MODES
 * @property {boolean} hidden  true exactly when the grade is the remnant rung
 */

/**
 * @param {Record<string, unknown>} edge
 * @param {string} edgeId
 * @param {string} toId
 * @returns {LivedHop}
 */
function hopOf(edge, edgeId, toId) {
  const grade = text(edge.grade);
  return {
    toId,
    edgeId,
    grade,
    mode: text(edge.mode) || 'land',
    hidden: grade === HIDDEN_GRADE,
  };
}

/**
 * THE LIVED ADJACENCY. Every settlement that carries an edge, mapped to the hops
 * that leave it, codepoint-sorted by destination and then by edge id (a pair with
 * both a land road and a sea lane yields two hops, in a stable order).
 *
 * HIDDEN EDGES ARE INCLUDED BY DEFAULT here, and excluded by the CALLERS that
 * speak for a traveller. That is deliberate and it is the opposite default from
 * `routeNetworkComponents`, which excludes them. The two functions answer
 * different questions: components asks whether the REALM can move a good between
 * two places, and a supply chain is not a smuggler; this asks what ways physically
 * leave a settlement, and the overgrown one is still there. Collapsing the two
 * defaults would either hide the smuggler's road from the smuggler or let the
 * self-sufficiency metric rise as the network decayed.
 *
 * @param {import('./routeNetworkLedger.js').RouteNetwork|null|undefined} network
 * @returns {Map<string, ReadonlyArray<LivedHop>>}
 */
export function livedAdjacency(network) {
  const edges = network && network.edges && typeof network.edges === 'object' ? network.edges : {};
  /** @type {Map<string, Array<LivedHop>>} */
  const out = new Map();
  /** @param {string} id @returns {Array<LivedHop>} */
  const seat = (id) => {
    const found = out.get(id);
    if (found) return found;
    /** @type {Array<LivedHop>} */
    const fresh = [];
    out.set(id, fresh);
    return fresh;
  };
  for (const edgeId of Object.keys(edges).sort()) {
    const edge = asRecord(edges[edgeId]);
    const a = text(edge.a);
    const b = text(edge.b);
    if (!a || !b || a === b) continue;
    seat(a).push(hopOf(edge, edgeId, b));
    seat(b).push(hopOf(edge, edgeId, a));
  }
  /** @type {Map<string, ReadonlyArray<LivedHop>>} */
  const frozen = new Map();
  for (const id of [...out.keys()].sort()) {
    const hops = /** @type {Array<LivedHop>} */ (out.get(id));
    hops.sort((x, y) => (x.toId < y.toId ? -1 : x.toId > y.toId ? 1
      : x.edgeId < y.edgeId ? -1 : x.edgeId > y.edgeId ? 1 : 0));
    frozen.set(id, Object.freeze(hops));
  }
  return frozen;
}

/**
 * The network a consumer may read, or an EMPTY one. Dormant answers empty rather
 * than reading through, so no consumer needs to remember the gate.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @returns {import('./routeNetworkLedger.js').RouteNetwork}
 */
export function consumableRouteNetwork(worldState) {
  if (!routeLifecycleActive(worldState)) return emptyRouteNetwork();
  return readRouteNetwork(worldState) || emptyRouteNetwork();
}

/**
 * THE WAYS OUT OF ONE PLACE, as a traveller of this kind may walk them.
 *
 * A kind of null asks the neutral question and gets every hop including the
 * hidden ones, which is what a surface wants; a NAMED kind gets the access law
 * applied, which is what a mover wants.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string} fromId
 * @param {{ kind?: string|null }} [options]
 * @returns {ReadonlyArray<LivedHop>}
 */
export function livedNeighbours(worldState, fromId, options = {}) {
  const network = consumableRouteNetwork(worldState);
  const hops = livedAdjacency(network).get(text(fromId)) || Object.freeze([]);
  const kind = options.kind == null ? null : text(options.kind);
  if (kind == null) return hops;
  if (mayUseHiddenPaths(kind)) return hops;
  return Object.freeze(hops.filter(hop => !hop.hidden));
}

/**
 * THE H3 SEAM (npcCirculationTransit's `hiddenHopsOf`), supplied from this side.
 *
 * H3 states the convention and this file honours it: the callback yields the ids
 * reachable from `fromId` by a hidden way, and its ABSENCE is what makes H3
 * byte-identical to the road-only reading. Returning NULL for an army is
 * therefore not a policy this module applies to H3; it is the absence of a
 * capability, which is the only form of the rule neither program can break by
 * refactoring the other.
 *
 * NULL on a dark world too, so lighting the flag is what turns the seam on.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string} kind
 * @returns {((fromId: string) => ReadonlyArray<string>)|null}
 */
export function hiddenHopsFor(worldState, kind) {
  if (!routeLifecycleActive(worldState)) return null;
  if (!mayUseHiddenPaths(kind)) return null;
  const adjacency = livedAdjacency(consumableRouteNetwork(worldState));
  return (/** @type {string} */ fromId) => {
    const hops = adjacency.get(text(fromId)) || [];
    /** @type {Array<string>} */
    const out = [];
    for (const hop of hops) {
      if (hop.hidden && out.indexOf(hop.toId) < 0) out.push(hop.toId);
    }
    return Object.freeze(out.sort());
  };
}

/**
 * The closed HOP VERDICT vocabulary. Every refusal names its own reason, because
 * a traveller who did not move is a fact the pins and the tuning pass both need,
 * and "returned null" is not a reason.
 *
 * It lives HERE rather than beside the router that produces it because the
 * interdiction and race lanes both read the words without needing the routing
 * machinery, and a vocabulary declared in two places is a vocabulary that drifts.
 * @type {ReadonlyArray<string>}
 */
export const HOP_VERDICTS = Object.freeze([
  'hop', 'arrived', 'unconnected', 'refused_hidden', 'dormant',
]);

/**
 * THE CHEAPEST WAY ACROSS THE LIVED NETWORK, and the first hop of it (§9's
 * "connected-only", read literally).
 *
 * ROUTING, NOT PROXIMITY, and the distinction was a real defect before it was a
 * paragraph. The first shape of this function took the neighbour that stood
 * strictly closer to the destination by the frozen digest's own `pathCost`, which
 * is the rule H3 uses and is correct THERE: H3 walks the digest's routing
 * adjacency, where the next node on a cheapest path is closer by construction. On
 * the LIVED network it is wrong, because a road network is sparse: the only way
 * from a seat to its neighbour may run through a third place that is FARTHER from
 * the destination than standing still. Under the proximity rule that traveller
 * never moves, and the failure is silent, because "no admissible hop" and "no
 * route at all" look identical from outside.
 *
 * So the route is solved over the LIVED graph, with the caller's own per-hop cost,
 * and the answer is the first hop of the cheapest whole journey. Deterministic:
 * the frontier is scanned in codepoint order and a tie keeps the codepoint-low
 * seat, so the same network always yields the same road.
 *
 * BOUNDED by §3's candidate-set law: the network is linear in the realm and each
 * seat is settled once.
 *
 * THE COST IS INJECTED because the price of a way is its GRADE, and grade pricing
 * is the transit leaf's tuning surface rather than this leaf's. Returning null
 * from `costOf` refuses a hop outright, which is how the hidden-path law reaches
 * the router without this function having to know which kinds hold the franchise.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   fromId: string,
 *   destId: string,
 *   costOf: (fromId: string, hop: LivedHop) => number|null,
 * }} input
 * @returns {{ hop: LivedHop|null, ticks: number, path: ReadonlyArray<string>, reachable: boolean }}
 */
export function livedRouteToward(input) {
  const from = text(input.fromId);
  const dest = text(input.destId);
  /** @type {{ hop: LivedHop|null, ticks: number, path: ReadonlyArray<string>, reachable: boolean }} */
  const nowhere = { hop: null, ticks: 0, path: Object.freeze([]), reachable: false };
  if (!from || !dest || from === dest) return nowhere;
  const adjacency = livedAdjacency(consumableRouteNetwork(input.worldState));
  const solved = solveLived(adjacency, from, dest, input.costOf);

  const ticks = solved.best.get(dest);
  if (ticks == null) return nowhere;
  const walk = walkBack(solved.cameBy, from, dest);
  return { hop: walk.hop, ticks, path: walk.path, reachable: true };
}

/**
 * THE ONE LIVED SOLVER, shared by the single-destination reader above and the
 * single-source reader below so the realm can never hold two answers to "what does
 * this road cost".
 *
 * `stopAt` is the early exit the single-destination reader wants: Dijkstra settles
 * seats in nondecreasing cost order and every admissible step is strictly positive,
 * so the moment the destination is SELECTED its distance is final and everything the
 * caller reads about it is already what the exhaustive walk would have produced.
 * Passing null settles the whole reachable component instead, which is what a
 * migration lane needs: ONE walk per origin per tick rather than one per candidate
 * pair, because a pair-at-a-time reading is the quadratic the roads program already
 * paid for once (§3's bounded-candidate law).
 *
 * @param {Map<string, ReadonlyArray<LivedHop>>} adjacency
 * @param {string} from
 * @param {string|null} stopAt
 * @param {(fromId: string, hop: LivedHop) => number|null} costOf
 * @returns {{ best: Map<string, number>, cameBy: Map<string, { fromId: string, hop: LivedHop }> }}
 */
function solveLived(adjacency, from, stopAt, costOf) {
  /** @type {Map<string, number>} */
  const best = new Map([[from, 0]]);
  /** @type {Map<string, { fromId: string, hop: LivedHop }>} */
  const cameBy = new Map();
  /** @type {Set<string>} */
  const settled = new Set();
  for (;;) {
    let cursor = '';
    let cursorCost = 0;
    for (const seat of [...best.keys()].sort()) {
      if (settled.has(seat)) continue;
      const cost = /** @type {number} */ (best.get(seat));
      if (!cursor || cost < cursorCost) { cursor = seat; cursorCost = cost; }
    }
    if (!cursor || cursor === stopAt) break;
    settled.add(cursor);
    for (const hop of adjacency.get(cursor) || []) {
      const step = costOf(cursor, hop);
      if (step == null) continue;
      const total = cursorCost + step;
      const prior = best.get(hop.toId);
      if (prior == null || total < prior) {
        best.set(hop.toId, total);
        cameBy.set(hop.toId, { fromId: cursor, hop });
      }
    }
  }
  return { best, cameBy };
}

/**
 * Reconstruct the whole road and its FIRST hop from the predecessor map.
 * @param {Map<string, { fromId: string, hop: LivedHop }>} cameBy
 * @param {string} from @param {string} dest
 * @returns {{ hop: LivedHop|null, path: ReadonlyArray<string> }}
 */
function walkBack(cameBy, from, dest) {
  /** @type {Array<string>} */
  const path = [dest];
  /** @type {LivedHop|null} */
  let first = null;
  let cursor = dest;
  while (cursor !== from) {
    const step = cameBy.get(cursor);
    if (!step) break;
    first = step.hop;
    path.unshift(step.fromId);
    cursor = step.fromId;
  }
  return { hop: first, path: Object.freeze(path) };
}

/**
 * @typedef {Object} LivedReach
 * @property {number} ticks  the whole journey's price in the caller's own units
 * @property {ReadonlyArray<string>} path  every seat the road passes through, origin first
 * @property {LivedHop|null} hop  the first hop of that road
 */

/**
 * EVERY PLACE ONE SETTLEMENT CAN REACH, and what the road to each one costs.
 *
 * The single-source half of `livedRouteToward`, and it exists because a lane that
 * asks "where could these people go" must ask ONCE. Asking per candidate pair runs
 * the solver S times per origin and S-squared times per realm per tick, which is the
 * shape §3's bounded-candidate law forbids; one walk per origin is linear in the
 * network and answers the same question with the same arithmetic.
 *
 * THE ORIGIN IS NOT IN THE RESULT. A settlement does not travel to itself, and
 * leaving a zero-cost self entry in would let a caller that ranks by cost pick
 * "stay here" as a destination without ever deciding to.
 *
 * Codepoint-ordered, so the map enumerates the same way on every machine.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   fromId: string,
 *   costOf: (fromId: string, hop: LivedHop) => number|null,
 * }} input
 * @returns {ReadonlyMap<string, LivedReach>}
 */
export function livedCostsFrom(input) {
  const from = text(input.fromId);
  /** @type {Map<string, LivedReach>} */
  const out = new Map();
  if (!from) return out;
  const adjacency = livedAdjacency(consumableRouteNetwork(input.worldState));
  const solved = solveLived(adjacency, from, null, input.costOf);
  for (const seat of [...solved.best.keys()].sort()) {
    if (seat === from) continue;
    const walk = walkBack(solved.cameBy, from, seat);
    out.set(seat, {
      ticks: /** @type {number} */ (solved.best.get(seat)),
      path: walk.path,
      hop: walk.hop,
    });
  }
  return out;
}

/**
 * @typedef {Object} ArterialSeed
 * @property {string} edgeId
 * @property {string} toId    the far endpoint
 * @property {string} grade
 * @property {string} mode
 * @property {number} weight  the road weight a field stage renders, 0..3
 * @property {boolean} hidden
 */

/**
 * The ROAD WEIGHT a grade renders as (§10: "grade renders as road weight"). The
 * ladder rank, so a highway is the heaviest stroke and a hidden path is no stroke
 * at all. An unrecognized grade weighs nothing, which is the fail-closed reading
 * for a renderer.
 *
 * @param {string|null|undefined} grade
 * @returns {number}
 */
export function arterialWeight(grade) {
  const index = ROUTE_GRADES.indexOf(text(grade));
  return index < 0 ? 0 : ROUTE_GRADES.length - 1 - index;
}

/**
 * THE ARTERIAL SEEDS of one settlement (§10's cartography clause, and the
 * DECLARED CONTRACT for the town-cartography program's field stage).
 *
 * DESIGN_TOWN_CARTOGRAPHY.md §4 stage 1 says roads and routes enter the local
 * tensor field as BOUNDARY CONDITIONS, and stage 2 grows arterials from gates,
 * waterfront and route ends. This function is the whole of what that stage needs
 * from the route lifecycle and it is deliberately no more than that: a list of
 * ways out, each with a weight and a mode. It computes no geometry, because Law 1
 * says geometry is derived and never stored, and the field stage is the layer that
 * owns deriving it.
 *
 * AUDIENCE PROJECTION (§10, and the estate's Law 7 projection norm): the DM sees
 * the hidden paths, and a player sees the overgrown nothing. The projection is a
 * FILTER at the source rather than a flag the renderer is trusted to honour, which
 * is the same shape npcLedgerProjection takes and for the same reason.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string} settlementId
 * @param {{ audience?: string }} [options]
 * @returns {ReadonlyArray<ArterialSeed>}
 */
export function arterialSeedsFor(worldState, settlementId, options = {}) {
  const audience = text(options.audience) || 'dm';
  const hops = livedNeighbours(worldState, settlementId, {});
  /** @type {Array<ArterialSeed>} */
  const out = [];
  for (const hop of hops) {
    if (hop.hidden && audience !== 'dm') continue;
    out.push({
      edgeId: hop.edgeId,
      toId: hop.toId,
      grade: hop.grade,
      mode: hop.mode,
      weight: arterialWeight(hop.grade),
      hidden: hop.hidden,
    });
  }
  return Object.freeze(out);
}

/**
 * THE DEGREE of a settlement over the lived network, counting only the ways the
 * realm openly walks. §5d amendment (a) makes route count feed every network
 * role's strength, and this is the reading that lane will take; a hidden path is
 * not a living route and must not inflate a role.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string} settlementId
 * @returns {number}
 */
export function livedDegree(worldState, settlementId) {
  let degree = 0;
  for (const hop of livedNeighbours(worldState, settlementId, {})) {
    if (!hop.hidden) degree += 1;
  }
  return degree;
}
