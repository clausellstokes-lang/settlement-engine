/**
 * routeNetworkGenesis.js — THE NETWORK IS BORN (W-J slice J1; binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §1 Law 2, §3, §6, §8).
 *
 * Law 2, GENESIS IS SACRED: a settlement's generation-time `tradeRouteAccess` is
 * frozen truth. This module READS that truth and derives the network the realm was
 * born with; it never writes back. Divergence between what a settlement was
 * founded with and what it is connected to a century later is the whole point of
 * the lifecycle, and it is surfaced honestly rather than reconciled by mutation.
 *
 * ── THE BOUNDED CANDIDATE SET (§3, and the B1 quadratic lesson is law here) ──
 * The genesis pass NEVER enumerates all pairs. Its candidates are the union of:
 *   1. THE k-NEAREST NEIGHBOUR PAIRS, taken from the region layer's own selection
 *      (`neutralNeighbourPairs`) rather than re-derived here. That selection is
 *      bounded by S·k, already carries the ordering law (resolved-first, then
 *      frozen travel cost, then codepoint id), and already has its aspatial
 *      fallback. A second implementation of "nearest" would be a fork that drifts.
 *   2. THE PORT PAIRS the frozen sea-lane set links, one per port (§8's totality
 *      is a FLOOR, not a cap: J3 charters more water when demand earns it).
 *   3. THE USER-ROUTE PAIRS already recorded on a settlement's config.
 * Bounded by S·k + P + U, all linear. `genesisCandidatePairs` is exported so the
 * anti-quadratic law can be pinned structurally rather than trusted.
 *
 * ── WHY THERE IS NO RNG HERE ────────────────────────────────────────────────
 * §1 Law 7 asks for seeded forks (`routelife:*`) and no ambient anything. The
 * genesis pass goes further and takes NO entropy at all: it is a pure function of
 * frozen config plus the frozen digest, so the same realm derives the same network
 * on every machine, every replay, and every re-import. That is strictly stronger
 * than a seeded fork, it steals no draws from any sibling stream, and it is pinned
 * by seed-family totality (the whole seed family derives one identical network).
 * J3's charters, which are genuinely stochastic, take the seeded fork.
 *
 * ── THE USER-ROUTE ADOPTION SEAM ────────────────────────────────────────────
 * The DM's own charters (directive 3) record their provenance on
 * `config._userRoutes`. This module RECOGNIZES those rows and adopts them into the
 * ledger with provenance 'user' and the lifecycle-immunity mark, so a user route
 * exists in the network from the first tick and can never be organically removed.
 * The coupling is by the DESIGN DOC's convention only: nothing here imports the
 * user-route lane, and nothing there imports this. Both lanes implement §3's edge
 * identity independently and a source scan holds them to the same shape, which is
 * how two lanes agree without either owning the other.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store.
 */

import { activeSpatialDigest, gateAdjacency, isPort, pathCost, seaLaneAdjacency } from '../spatial/distanceRead.js';
import { neutralNeighbourPairs } from '../region/neutralNeighbourEdges.js';
import { tradeRouteTier } from '../tradeRouteSemantics.js';
import {
  PROVENANCE_GENERATED,
  PROVENANCE_USER,
  emptyRouteNetwork,
  readRouteNetwork,
  routeEdge,
  routeEdgeId,
  routeLifecycleActive,
  withGenesisLaw,
  withRouteEdges,
  writeRouteNetwork,
} from './routeNetworkLedger.js';

/**
 * THE GENESIS LAW VERSION (WEAVE NET-2; volume §1.4 + A1.1.3, owner row Q-W6).
 *
 * Every OTHER axis of the spatial canon is versioned — geometry, cost law, the
 * seasonal overlay, the sea lanes, the biome and climate sub-digests — and each
 * bump is a discrete, visible re-canonize event. The route-network genesis lane
 * had no version constant at all, so nothing on a lived world recorded WHICH LAW
 * derived its birth network. That is the gap this closes, and it is the whole of
 * the car's persistence: the stamp is written once, at connect, onto the ledger
 * the genesis pass installs, and it is never rewritten afterwards.
 *
 * ⚠ BUMP THIS WHENEVER THE DERIVATION BELOW CHANGES WHICH EDGES A REALM IS BORN
 * WITH — a new candidate key, a change to the grade ladder, a change to the mode
 * rule. Do NOT bump it for a refactor that provably moves no edge. A stamp that
 * moves without the law moving is worse than no stamp: it invites a future reader
 * to conclude two identical realms were built differently.
 *
 * 1 is the law AS OF THIS CAR — three candidate keys plus the Urquhart pass below.
 * The lane is unmounted, so no world carries a stamp yet and no world ever
 * carried one; version 1 is the first law any stamped world will have been born
 * under, not a retroactive claim about the worlds that came before.
 * @type {number}
 */
export const ROUTE_GENESIS_LAW_VERSION = 1;

/**
 * THE GENESIS GRADE LADDER. A route is only as good as its weaker end: a highway
 * cannot run out of a settlement the world gave no way into. So the pair's grade
 * reads the MINIMUM of the two endpoints' access tiers, under the one canonical
 * reading of trade-route access (tradeRouteSemantics, including its seasonal rung
 * for a mountain pass).
 *
 *   major    (crossroads / port)      highway
 *   standard (road / river / coastal) road
 *   seasonal (mountain pass)          track
 *   isolated / unknown                no land edge at all
 *
 * The last rung is the isolation-as-fate law answering honestly (§0): some places
 * are simply too far, and that is character rather than failure. It is not a
 * silence either, because the settlement is still in the corridor candidate set,
 * so J3 can charter its way out when accumulated demand proves the road.
 * @type {Readonly<Record<string, number>>}
 */
const TIER_RANK = Object.freeze({ major: 3, standard: 2, seasonal: 1, isolated: 0, unknown: 0 });

/** Grade by rank, index-aligned with TIER_RANK. @type {Readonly<Record<string, string>>} */
const RANK_GRADE = Object.freeze({ 3: 'highway', 2: 'road', 1: 'track' });

/**
 * The grade §8 fixes for an auto-genesis water edge minted to satisfy PORTS
 * TOTALITY. A harbour is a maintained thing; it is not an unproven track.
 * @type {string}
 */
export const PORT_TOTALITY_GRADE = 'road';

/**
 * The grade a DM's hand-chartered route enters at. A user route is a road the
 * realm already has, not a road it is earning, so it does not start at 'track'
 * the way an organic charter does (§6).
 * @type {string}
 */
export const USER_ROUTE_GENESIS_GRADE = 'road';

/**
 * @typedef {Object} GenesisMember
 * @property {string} id
 * @property {Record<string, unknown>} config the settlement's frozen generation
 *   config: `tradeRouteAccess` is the access vocabulary, `_userRoutes` the DM's
 *   own charter rows.
 */

/**
 * THE ONE SHAPE ADAPTER. The world-connect snapshot carries its members as
 * `{ id, settlement: { config } }`; this leaf's contract is `{ id, config }`. That
 * mapping lives here, in exactly one function, because a reader that guesses at a
 * writer's spelling is the estate's most expensive recurring bug: a payload read
 * under the wrong key is `undefined` for the feature's whole life and no test
 * notices. One adapter, pinned against a snapshot-shaped fixture, is the cure.
 *
 * @param {ReadonlyArray<{ id?: unknown, settlement?: { config?: unknown } }>|null|undefined} items
 * @returns {Array<GenesisMember>}
 */
export function genesisMembersFromSnapshot(items) {
  if (!Array.isArray(items)) return [];
  /** @type {Array<GenesisMember>} */
  const out = [];
  for (const item of items) {
    const id = item && item.id != null ? String(item.id) : '';
    if (!id) continue;
    const config = item && item.settlement && typeof item.settlement.config === 'object'
      && item.settlement.config !== null
      ? /** @type {Record<string, unknown>} */ (item.settlement.config)
      : {};
    out.push({ id, config });
  }
  return out;
}

/**
 * The access value a member was generated with, read defensively. A member with no
 * config at all reads 'unknown', which the tier ladder scores at rank 0 (fail
 * closed: an unrecognized route must never fabricate connectivity).
 *
 * @param {GenesisMember} member
 * @returns {string|null}
 */
function accessValueOf(member) {
  const raw = member && member.config ? member.config.tradeRouteAccess : null;
  return typeof raw === 'string' && raw ? raw : null;
}

/**
 * The genesis grade for a pair, or null when the weaker end has no dependable
 * connection and the pair therefore earns no land route at birth.
 *
 * @param {string|null} accessA @param {string|null} accessB
 * @returns {string|null}
 */
export function genesisPairGrade(accessA, accessB) {
  const rankA = TIER_RANK[tradeRouteTier(accessA)];
  const rankB = TIER_RANK[tradeRouteTier(accessB)];
  const rank = Math.min(rankA, rankB);
  return RANK_GRADE[rank] || null;
}

/** The unordered pair key, codepoint-canonical. @param {string} a @param {string} b @returns {string} */
function pairKey(a, b) {
  return a <= b ? `${a}::${b}` : `${b}::${a}`;
}

/**
 * THE MODE THE WORLD IMPOSES. Water when the frozen sea-lane set already links
 * both endpoints as ports; land otherwise. The DM and the derivation both pick
 * endpoints; the world decides what kind of road that is.
 *
 * @param {ReturnType<typeof activeSpatialDigest>} digest
 * @param {string} a @param {string} b
 * @returns {string}
 */
export function genesisPairMode(digest, a, b) {
  if (!digest || !isPort(digest, a) || !isPort(digest, b)) return 'land';
  const lanes = seaLaneAdjacency(digest);
  const from = lanes.get(a);
  return from && from.has(b) ? 'water' : 'land';
}

/**
 * Can the realm get from a to b at all? On an ASPATIAL world there is no geometry
 * to consult, so the access vocabulary alone governs and every candidate is
 * reachable by construction. On a canonized world an unresolvable pair is the
 * isolation law answering, and no edge is minted.
 *
 * @param {ReturnType<typeof activeSpatialDigest>} digest
 * @param {string} a @param {string} b
 * @returns {boolean}
 */
function reachable(digest, a, b) {
  if (!digest) return true;
  const cost = pathCost(digest, a, b);
  return cost != null && Number.isFinite(cost) && cost > 0;
}

/**
 * Every port's nearest navigable counterpart, one pair per port, unioned. This is
 * the mechanism behind PORTS TOTALITY (§6, an owner LAW: an invariant, not a
 * probability). Taking the NEAREST counterpart rather than every counterpart is
 * what keeps the water half linear: the invariant asks that a port with a
 * navigable counterpart carry AT LEAST ONE water edge, and J3 charters the rest
 * when trade earns them.
 *
 * @param {ReturnType<typeof activeSpatialDigest>} digest
 * @param {ReadonlyArray<string>} memberIds the campaign membership, codepoint sorted
 * @returns {Array<[string, string]>} canonical pairs, codepoint ordered
 */
export function portTotalityPairs(digest, memberIds) {
  if (!digest) return [];
  const members = new Set(memberIds);
  const lanes = seaLaneAdjacency(digest);
  /** @type {Map<string, [string, string]>} */
  const pairs = new Map();
  for (const id of memberIds) {
    if (!isPort(digest, id)) continue;
    const neighbours = lanes.get(id);
    if (!neighbours) continue;
    /** @type {{ to: string, cost: number }|null} */
    let best = null;
    // Codepoint-ordered scan with a strict improvement test, so the winner is the
    // cheapest lane and ties break on the codepoint-low counterpart. Deterministic
    // without sorting the whole neighbourhood.
    for (const to of [...neighbours.keys()].sort()) {
      if (!members.has(to) || to === id) continue;
      const cost = Number(neighbours.get(to));
      if (!Number.isFinite(cost) || !(cost > 0)) continue;
      if (best === null || cost < best.cost) best = { to, cost };
    }
    if (best === null) continue;
    const [low, high] = id <= best.to ? [id, best.to] : [best.to, id];
    const key = pairKey(low, high);
    if (!pairs.has(key)) pairs.set(key, [low, high]);
  }
  return [...pairs.entries()].sort((x, y) => (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0)).map(e => e[1]);
}

/**
 * The user-route rows recorded on a member's frozen config, read defensively. The
 * row vocabulary is the DESIGN DOC's convention (§3): a row names its two
 * endpoints and its mode. Rows naming an endpoint outside the membership are
 * skipped rather than trusted, because a route to a settlement this world does not
 * carry is a dangling reference, not a road.
 *
 * @param {GenesisMember} member
 * @param {Set<string>} members
 * @returns {Array<{ a: string, b: string, mode: string, tick: number }>}
 */
function userRouteRowsOf(member, members) {
  const raw = member && member.config ? member.config._userRoutes : null;
  if (!Array.isArray(raw)) return [];
  /** @type {Array<{ a: string, b: string, mode: string, tick: number }>} */
  const rows = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const row = /** @type {Record<string, unknown>} */ (entry);
    const a = row.a == null ? '' : String(row.a);
    const b = row.b == null ? '' : String(row.b);
    if (!a || !b || a === b) continue;
    if (!members.has(a) || !members.has(b)) continue;
    const mode = row.mode === 'water' ? 'water' : 'land';
    const tick = Number.isFinite(row.createdTick) ? Number(row.createdTick) : 0;
    rows.push({ a, b, mode, tick });
  }
  return rows;
}

/**
 * THE FOURTH CANDIDATE KEY — THE URQUHART PASS OVER THE REALM'S OWN NEIGHBOUR
 * GRAPH (WEAVE NET-2).
 *
 * THE HOLE IT FILLS. The k-nearest key takes each member's THREE cheapest
 * counterparts by frozen travel cost. Three is a budget, not a fact about the
 * land: a settlement that genuinely borders five others gets roads to three of
 * them and the realm is born with a network that is a scatter of stars rather
 * than a web. The render tier hit exactly this and cured it the classical way —
 * see `roadNetwork.js`, where an Urquhart supergraph over the Delaunay
 * triangulation supplies the cycles a spanning tree cannot carry.
 *
 * ⛔ AND THE CANON TIER CANNOT DO IT THAT WAY, BECAUSE NO COORDINATES SURVIVE.
 * The frozen digest keeps a distance matrix, tiers, gates and territory — and not
 * one settlement x/y (D10 says so and `buildSpatialDigest` confirms it). There is
 * nothing here to triangulate. What the digest DOES hold is better: `gates`, the
 * cheapest crossing between every pair of ADJACENT territories, which is the dual
 * of the realm's own geodesic partition — a neighbour graph that already knows
 * about mountains and coastlines, where a Delaunay triangulation over pins would
 * not. So this applies the URQUHART RULE (drop, from each triangle, its longest
 * side) to that graph, using the frozen crossing cost as the length.
 *
 * ⚠ THE NAME IS BORROWED HONESTLY. This is the Urquhart RULE over the territory
 * graph, not the Euclidean Urquhart GRAPH: the classical containment proofs are
 * geometric and do not transfer. Nothing here relies on them, because this pass
 * only ever ADDS to a candidate set that is already connected by construction
 * (the k-nearest key keeps the default graph a chain, never islands), so a
 * dropped side can cost the realm no connectivity it had.
 *
 * THE ANTI-QUADRATIC LAW, KEPT: the result is a SUBSET of the digest's own gate
 * set, which is one entry per adjacent territory pair over a planar partition and
 * is therefore already linear in the membership. It is a subset by construction —
 * every returned pair was read out of `gateAdjacency` — so the bound needs no
 * geometric argument to hold, only the frozen artifact's own size.
 *
 * DETERMINISM: the member scan, the neighbour scan, the triangle scan and the
 * emitted list are all codepoint ordered, and a tie in crossing cost drops the
 * codepoint-larger side — the same total-order idiom `urquhartEdges` uses on the
 * render tier, so the two tiers break ties the same way.
 *
 * An ASPATIAL world (no canon) has no territory graph and returns nothing, which
 * is the honest answer: with no geography there are no geographic neighbours.
 *
 * @param {ReturnType<typeof activeSpatialDigest>} digest
 * @param {ReadonlyArray<string>} memberIds the campaign membership, codepoint sorted
 * @returns {Array<[string, string]>} canonical pairs, codepoint ordered
 */
export function urquhartPairs(digest, memberIds) {
  if (!digest) return [];
  const members = new Set(memberIds);
  const adj = gateAdjacency(digest);

  // The neighbour graph, restricted to the membership. A gate to a settlement this
  // campaign does not carry is not a candidate for a road this campaign can build.
  /** @type {Map<string, { a: string, b: string, cost: number }>} */
  const sides = new Map();
  /** @type {Map<string, Set<string>>} */
  const near = new Map();
  for (const id of memberIds) {
    const neighbours = adj.get(id);
    if (!neighbours) continue;
    for (const to of [...neighbours.keys()].sort()) {
      if (to === id || !members.has(to)) continue;
      const cost = Number(neighbours.get(to));
      if (!Number.isFinite(cost) || cost < 0) continue;
      const [low, high] = id <= to ? [id, to] : [to, id];
      const key = pairKey(low, high);
      const prev = sides.get(key);
      if (!prev || cost < prev.cost) sides.set(key, { a: low, b: high, cost });
      if (!near.has(low)) near.set(low, new Set());
      if (!near.has(high)) near.set(high, new Set());
      /** @type {Set<string>} */ (near.get(low)).add(high);
      /** @type {Set<string>} */ (near.get(high)).add(low);
    }
  }
  if (sides.size === 0) return [];

  // Drop, from every triangle, its longest side. Each triangle is met three times
  // — once from each of its sides — and the answer is the same every time, so the
  // repetition costs a little work and buys a scan that needs no triangle index.
  /** @type {Set<string>} */
  const dropped = new Set();
  for (const key of [...sides.keys()].sort()) {
    const side = /** @type {{ a: string, b: string, cost: number }} */ (sides.get(key));
    const na = near.get(side.a);
    const nb = near.get(side.b);
    if (!na || !nb) continue;
    for (const c of [...na].filter(x => nb.has(x)).sort()) {
      const triangle = [key, pairKey(side.b, c), pairKey(c, side.a)];
      let longest = '';
      let longestCost = -1;
      for (const k of triangle) {
        const e = sides.get(k);
        if (!e) continue;
        if (e.cost > longestCost || (e.cost === longestCost && k > longest)) {
          longest = k;
          longestCost = e.cost;
        }
      }
      if (longest) dropped.add(longest);
    }
  }

  return [...sides.keys()].sort()
    .filter(key => !dropped.has(key))
    .map((key) => {
      const side = /** @type {{ a: string, b: string }} */ (sides.get(key));
      return /** @type {[string, string]} */ ([side.a, side.b]);
    });
}

/**
 * @typedef {Object} GenesisCandidates
 * @property {Array<[string, string]>} knn       the k-nearest neighbour pairs
 * @property {Array<[string, string]>} ports     the ports-totality pairs
 * @property {Array<[string, string]>} user      the DM's own chartered pairs
 * @property {Array<[string, string]>} urquhart  NET-2's geographic-neighbour pairs
 * @property {Array<[string, string]>} all       the union, codepoint ordered
 * @property {number} bound  the structural ceiling this selection may not exceed
 */

/**
 * THE BOUNDED CANDIDATE SET (§3). Returns the three sources separately as well as
 * their union, plus the structural BOUND the union may never exceed, so the
 * anti-quadratic law is a number a test can assert rather than a claim a comment
 * makes. The bound is `S*k + P + U`, every term linear in the membership.
 *
 * @param {{ members: ReadonlyArray<GenesisMember>, worldState?: Record<string, unknown>|null }} input
 * @returns {GenesisCandidates}
 */
export function genesisCandidatePairs(input) {
  const members = Array.isArray(input.members) ? input.members : [];
  const ids = [...new Set(members.map(m => String(m.id)).filter(Boolean))].sort();
  const idSet = new Set(ids);
  const worldState = input.worldState || null;
  const digest = activeSpatialDigest(worldState);

  const knn = ids.length >= 2 ? neutralNeighbourPairs(ids, worldState) : [];
  const ports = portTotalityPairs(digest, ids);
  const urquhart = ids.length >= 2 ? urquhartPairs(digest, ids) : [];
  /** @type {Map<string, [string, string]>} */
  const userPairs = new Map();
  for (const member of members) {
    for (const row of userRouteRowsOf(member, idSet)) {
      const [low, high] = row.a <= row.b ? [row.a, row.b] : [row.b, row.a];
      const key = pairKey(low, high);
      if (!userPairs.has(key)) userPairs.set(key, [low, high]);
    }
  }
  const user = [...userPairs.entries()]
    .sort((x, y) => (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0)).map(e => e[1]);

  /** @type {Map<string, [string, string]>} */
  const union = new Map();
  for (const pair of [...knn, ...ports, ...user, ...urquhart]) union.set(pairKey(pair[0], pair[1]), pair);
  const all = [...union.entries()]
    .sort((x, y) => (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0)).map(e => e[1]);

  return {
    knn,
    ports,
    user,
    urquhart,
    all,
    // NET-2's FOURTH BOUND TERM. Every term is linear in the membership: S*k for
    // the k-nearest key, one pair per port, the DM's own finite roster, and — for
    // the new one — a subset of the frozen gate set, which is one entry per
    // adjacent territory pair. The anti-quadratic law stays a number a pin
    // asserts, with four addends instead of three.
    bound: knn.length + ports.length + user.length + urquhart.length,
  };
}

/**
 * DERIVE THE NETWORK THE REALM WAS BORN WITH. Returns the edge list in
 * edge-id codepoint order, so the derivation is a pure function of the member SET
 * and never of the order the members arrived in.
 *
 * Two passes, in this order, and the order is the law:
 *   1. USER ROUTES first. A DM charter outranks any derivation, so it claims its
 *      edge id before anything else can, and it enters lifecycle-immune.
 *   2. THE CANDIDATE PASS over the bounded set, which splits by MODE:
 *      - LAND edges are graded by the weaker endpoint's frozen access tier and
 *        dropped where the ladder says isolated or the realm cannot reach.
 *      - WATER edges are minted UNCONDITIONALLY at PORT_TOTALITY_GRADE with
 *        flavour 'genesis'. The land access vocabulary has no business grading a
 *        sea lane: `mountain_pass` says nothing about a harbour, and §8 fixes the
 *        water rung explicitly. Because every ports-totality pair is by
 *        construction a water candidate, PORTS TOTALITY (§6, an owner LAW) then
 *        holds STRUCTURALLY rather than by a repair pass — which is why there is
 *        no third pass here and why a port founded 'isolated' still gets its
 *        harbour. That divergence between config and edge is exactly the honesty
 *        Law 2 asks for, and `portsMissingWater` is the checker that keeps the
 *        claim falsifiable (J3 re-asks it every charter eval, per §8).
 *
 * @param {{
 *   members: ReadonlyArray<GenesisMember>,
 *   worldState?: Record<string, unknown>|null,
 *   tick?: number,
 * }} input
 * @returns {Array<import('./routeNetworkLedger.js').RouteEdge>}
 */
export function deriveGenesisRouteEdges(input) {
  const members = Array.isArray(input.members) ? input.members : [];
  const tick = Number.isFinite(input.tick) ? Number(input.tick) : 0;
  const worldState = input.worldState || null;
  const digest = activeSpatialDigest(worldState);
  const ids = [...new Set(members.map(m => String(m.id)).filter(Boolean))].sort();
  const idSet = new Set(ids);
  const accessOf = new Map(members.map(m => [String(m.id), accessValueOf(m)]));
  const candidates = genesisCandidatePairs({ members, worldState });

  /** @type {Map<string, import('./routeNetworkLedger.js').RouteEdge>} */
  const byId = new Map();
  /** @param {import('./routeNetworkLedger.js').RouteEdge} edge */
  const claim = (edge) => {
    const id = routeEdgeId(edge.a, edge.b, edge.mode);
    if (!byId.has(id)) byId.set(id, edge);
  };

  // PASS 1 — the DM's own charters.
  for (const member of members) {
    for (const row of userRouteRowsOf(member, idSet)) {
      claim(routeEdge({
        a: row.a,
        b: row.b,
        grade: USER_ROUTE_GENESIS_GRADE,
        mode: row.mode,
        provenance: PROVENANCE_USER,
        flavor: 'user',
        tick: row.tick,
        // No measured flow stands behind a hand-chartered road, and §4 is
        // receipts-first: naming a class here would be a receipt with nothing
        // behind it. J2 fills this in from the flows the road actually carries.
        dominantFlowClass: null,
      }));
    }
  }

  // PASS 2 — the candidate pass over the bounded set, split by mode.
  //
  // ⛔ NET-2's URQUHART PAIRS ENTER HERE AND NOWHERE ELSE, which is the whole of
  // their discipline and is worth stating because a fourth key is exactly the
  // place a bypass rung gets smuggled in:
  //   · THEY READ THE ACCESS LADDER LIKE EVERYTHING ELSE (Law 2). A geographic
  //     neighbour pair whose weaker end was founded `isolated` earns no land road,
  //     the same as a k-nearest pair would not. Geography says two places border
  //     each other; the frozen `tradeRouteAccess` says whether the world gave
  //     either of them a way out. The second question is not answered by the first.
  //   · THEY MINT NO WATER OF THEIR OWN. Mode comes from `genesisPairMode`, which
  //     returns 'water' only where the FROZEN sea-lane set already links both ends
  //     as ports — so an Urquhart port-pair is a water edge exactly when the lane
  //     logic says it is, and never because the pair arrived through this key.
  //     Where that does happen the pair is minted at the §8 rung unconditionally,
  //     which is the ports/water rule doing its job over a wider candidate set:
  //     §8's totality is a FLOOR, not a cap.
  for (const [a, b] of candidates.all) {
    const mode = genesisPairMode(digest, a, b);
    if (byId.has(routeEdgeId(a, b, mode))) continue;
    // WATER: §8's rung, unconditional. This is what makes PORTS TOTALITY
    // structural, because candidates.ports is a subset of candidates.all.
    // LAND: the access ladder, and the realm must actually be able to get there.
    let grade = PORT_TOTALITY_GRADE;
    if (mode === 'land') {
      const landGrade = genesisPairGrade(accessOf.get(a) || null, accessOf.get(b) || null);
      if (!landGrade) continue;
      if (!reachable(digest, a, b)) continue;
      grade = landGrade;
    }
    claim(routeEdge({
      a,
      b,
      grade,
      mode,
      provenance: PROVENANCE_GENERATED,
      flavor: 'genesis',
      tick,
      dominantFlowClass: null,
    }));
  }

  return [...byId.entries()]
    .sort((x, y) => (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0))
    .map(entry => entry[1]);
}

/**
 * PORTS TOTALITY as a QUESTION, for the pin and for J3's charter evaluation, which
 * re-asks it every pass (§8). Returns the member ids that are ports with a
 * navigable counterpart and yet carry no water edge. An empty array is the
 * invariant holding.
 *
 * @param {{
 *   members: ReadonlyArray<GenesisMember>,
 *   worldState?: Record<string, unknown>|null,
 *   edges: ReadonlyArray<import('./routeNetworkLedger.js').RouteEdge>,
 * }} input
 * @returns {Array<string>}
 */
export function portsMissingWater(input) {
  const members = Array.isArray(input.members) ? input.members : [];
  const worldState = input.worldState || null;
  const digest = activeSpatialDigest(worldState);
  if (!digest) return [];
  const ids = [...new Set(members.map(m => String(m.id)).filter(Boolean))].sort();
  const owed = new Set(portTotalityPairs(digest, ids).flat());
  for (const edge of input.edges) {
    if (edge.mode === 'water') { owed.delete(edge.a); owed.delete(edge.b); }
  }
  return [...owed].sort();
}

/**
 * THE WORLD-CONNECT ENTRY POINT. Derive and install the genesis network, ONCE.
 *
 * STRICT NO-OP CONTRACT, three ways, because this is the function a future slice
 * wires into the connect seam and every one of them must be byte-safe:
 *   - DORMANT (the virtual flag absent) returns the INPUT worldState by reference,
 *     not an equal copy. Wiring it into a dark world cannot perturb a single byte,
 *     by object identity;
 *   - ALREADY CONNECTED (a network ledger already present) returns by reference
 *     too. Genesis happens once; re-deriving over a lived network would rewrite
 *     history, which Law 2 forbids;
 *   - NOTHING DERIVED (an isolated or single-member realm) writes nothing, because
 *     `writeRouteNetwork` drops an empty network rather than persisting a pair of
 *     empty containers.
 *
 * The corridor ledger is minted EMPTY and therefore never persisted at genesis:
 * J1 owns the shape, J2 owns the accumulation.
 *
 * @param {Record<string, unknown>} worldState
 * @param {ReadonlyArray<GenesisMember>} members
 * @param {number} [tick]
 * @returns {Record<string, unknown>}
 */
export function ensureGenesisRouteNetwork(worldState, members, tick = 0) {
  if (!routeLifecycleActive(worldState)) return worldState;
  if (readRouteNetwork(worldState)) return worldState;
  const edges = deriveGenesisRouteEdges({ members, worldState, tick });
  if (edges.length === 0) return worldState;
  // NET-2: the network is stamped with the law that derived it, in the same act
  // that installs it. The stamp rides the RECORD, so it is written only where
  // there are edges to describe — a realm that derived nothing writes nothing at
  // all, stamp included, and stays byte-identical to a realm that never asked.
  return writeRouteNetwork(
    worldState,
    withGenesisLaw(withRouteEdges(emptyRouteNetwork(), edges), ROUTE_GENESIS_LAW_VERSION),
  );
}
