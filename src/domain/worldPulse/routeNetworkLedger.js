/**
 * routeNetworkLedger.js — THE NETWORK LEDGER, model and accessors (W-J slice J1;
 * binding law docs/DESIGN_ROUTE_LIFECYCLE.md §1 and §3).
 *
 * The roads were the last static layer. This module is the SIDECAR the rest of the
 * route lifecycle writes into: a conditional `spatialLedgers.routeNetwork` key
 * carrying the realm's LIVED edge set and the corridor accumulation ledger. It is
 * the model half only. J1 derives the genesis network (routeNetworkGenesis.js);
 * J2 fills corridors, J3 charters and decays, J4 wires consumers.
 *
 * ── LAW 1: THE DIGEST STAYS FROZEN ──────────────────────────────────────────
 * Nothing here reads or writes territory, membership or positions. The ledger is a
 * sidecar over the frozen integer-quantized spatial digest, exactly like
 * armyTransit and satellites. Geometry is DERIVED (travelersGeometry / seaRoads),
 * never stored: a RouteEdge carries its endpoints and its mode, and any consumer
 * that needs the path asks the digest for it. A stored path would be a derivable
 * duplicate that goes stale the first time a realm is re-canonized.
 *
 * ── LAW 7: DORMANCY ─────────────────────────────────────────────────────────
 * `routeLifecycleEnabled` is VIRTUAL: it has NO entry in DEFAULT_SIMULATION_RULES
 * (the WAVES / ONE_REGEN / neutralNeighborsEnabled convention), so it adds no
 * persisted bytes to a legacy save and does not join RULE_COMPARISON_KEYS. Every
 * gate reads `=== true`, so absent means dormant. DORMANT MEANS ABSENT MEANS
 * BYTE-IDENTICAL: `writeRouteNetwork` drops the whole key when the network is
 * empty, and `dropSpatialLedger` drops the `spatialLedgers` namespace with it when
 * it was the last sub-ledger. An emptied world is byte-identical to a world that
 * never had a route network at all (fenced by the aspatial + spatial dormancy
 * goldens in tests/domain/routeNetworkDormancy.test.js).
 *
 * ── EDGE IDENTITY IS A SHARED LAW, NOT THIS MODULE'S PROPERTY ───────────────
 * `route.<a>.<b>.<mode>` with the endpoints in CODEPOINT order (§3). Codepoint
 * order is what makes the identity the same whichever endpoint the derivation
 * reached first, and it is the convention the sea-lane edge ids already use. The
 * SAME law is implemented independently by the user-route lane (directive 3) and
 * re-proved server-side by its migration, because the two lanes must agree without
 * either owning the other. This module therefore states the law in one function
 * and a source scan pins every producer in the estate to the same shape
 * (routeNetworkLaw.test.js); it deliberately does NOT import the sibling, so
 * neither lane can break the other by refactoring.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no ambient anything.
 * Records are written in codepoint-sorted key order so a rebuilt ledger is
 * byte-identical to a persisted one.
 */

import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';

/**
 * The `spatialLedgers` sub-key this layer owns. Named as a `_LEDGER` constant so
 * the spatialUsage coverage walker resolves it to its string value and can hold
 * the manifest honest (tests/lib/spatialLedgerCoverage.walker.test.js).
 * @type {string}
 */
export const ROUTE_NETWORK_LEDGER = 'routeNetwork';

/**
 * The closed GRADE vocabulary (§3, §7). A grade is a word about how worn a route
 * is, never a number a surface renders: highway is the realm's spine, road is an
 * ordinary maintained way, track is a route that has been earned but not yet
 * proven, and hidden is the remnant a corridor demotes to instead of vanishing
 * (Law 5, NOTHING IS FORGOTTEN).
 * @type {ReadonlyArray<string>}
 */
export const ROUTE_GRADES = Object.freeze(['highway', 'road', 'track', 'hidden']);

/**
 * The closed MODE vocabulary (§3, §8). Water edges ride seaRoads costs and
 * geometry; land edges ride the travel-cost raster. Mirrors the user-route lane's
 * own mode vocabulary, which its migration re-proves server-side.
 * @type {ReadonlyArray<string>}
 */
export const ROUTE_MODES = Object.freeze(['land', 'water']);

/**
 * The closed CHARTER FLAVOR vocabulary (§3). `genesis` is the flavor J1 mints:
 * the network the realm was born with. `user` is the DM's own charter. The other
 * four are J3's to mint when accumulated demand or strategy buys a road.
 * @type {ReadonlyArray<string>}
 */
export const ROUTE_CHARTER_FLAVORS = Object.freeze([
  'mercantile', 'military', 'migration', 'genesis', 'user',
]);

/**
 * The three named FLOW CLASSES the corridor ledger counts (§4). J1 mints no flow
 * at all; the vocabulary lives here so the model is complete and J2 has one place
 * to widen if the owner ever adds a fourth.
 * @type {ReadonlyArray<string>}
 */
export const ROUTE_FLOW_CLASSES = Object.freeze(['goods', 'population', 'military']);

/** Provenance of an edge the engine derived at network genesis (§3). @type {string} */
export const PROVENANCE_GENERATED = 'generated';

/**
 * Provenance of an edge the DM chartered by hand (§3). A user edge is
 * LIFECYCLE-IMMUNE to organic removal: decay may downgrade its grade with a
 * Herald notice, but nothing in the lifecycle may take it away. That is the
 * user's provenance law, and it is why this constant lives in the model rather
 * than in whichever slice happens to need it first.
 * @type {string}
 */
export const PROVENANCE_USER = 'user';

/**
 * @typedef {Object} RouteCharter
 * @property {string} flavor            one of ROUTE_CHARTER_FLAVORS
 * @property {number} tick              the tick the charter was struck
 * @property {string|null} dominantFlowClass  one of ROUTE_FLOW_CLASSES, or null
 *   when no measured flow stands behind the charter (every genesis edge)
 * @property {string} [byPowerRef]      the power that chartered it, when one did
 * @property {ReadonlyArray<string>} [reasonGoods]  the goods-denominated reason
 */

/**
 * @typedef {Object} RouteEdge
 * @property {string} a                 endpoint, codepoint-low
 * @property {string} b                 endpoint, codepoint-high
 * @property {string} grade             one of ROUTE_GRADES
 * @property {string} mode              one of ROUTE_MODES
 * @property {RouteCharter} charter
 * @property {string} provenance        PROVENANCE_GENERATED, PROVENANCE_USER, or
 *   `chartered:<tick>` once J3 mints organic charters
 * @property {boolean} [lifecycleImmune] present and true only on user edges
 * @property {string} [strategicNeed]   the war layer's band (J4 writes it)
 * @property {FlowAccrual & { lastTick: number }} [usage]  the three-class USAGE
 *   this edge has carried (§4: flow on an edge accrues decay's inverse). A
 *   CONDITIONAL key on exactly the pattern `strategicNeed` sets: absent until a
 *   flow walks the edge, so a genesis network serializes without it and the J1
 *   dormancy golden cannot move. J2 writes it; J3's decay reads it.
 * @property {RouteBypass} [bypass]  the avoidance this edge's wagons currently
 *   keep (§5c). The SAME conditional-key pattern as `usage`: absent until a
 *   corridor swings wide of a place it fears, and dropped again when the fear
 *   lapses, so an edge that never feared anything and an edge whose fear passed
 *   serialize identically. J3's routeNetworkCharterBypass.js is its single writer.
 */

/**
 * THE FLOW ACCRUAL (§4, J2). The three-class accumulation a corridor or an edge
 * carries. Three parallel, drop-when-zero maps keyed by flow class, and the
 * parallelism is the receipts law made structural:
 *   - `tally` is the EXACT INTEGER accumulator. Integers, never floats: an
 *     accumulator that drifts by a rounding error is a same-seed violation that
 *     takes a century of ticks to become visible, and THE PROMISE does not survive
 *     that. Every weight this layer adds is a whole number from a tuning band.
 *   - `flows` is the BAND WORD derived from the tally, and it is what J3's
 *     thresholds read. A band is a word about how walked a way is, never a number
 *     a surface renders.
 *   - `receipts` names the CONTRIBUTING SOURCES for that class, so every band step
 *     can say what walked it (§4 is receipts-first). A class present in `flows`
 *     with an empty receipt list is a contradiction the pins forbid.
 * A class that never fired is absent from all three, so a corridor that only ever
 * saw grain serializes with a goods key and nothing else.
 *
 * @typedef {Object} FlowAccrual
 * @property {Record<string, string>} flows     flow class to accumulated band
 * @property {Record<string, number>} tally     flow class to exact integer total
 * @property {Record<string, ReadonlyArray<string>>} receipts  class to source names
 * @property {ReadonlyArray<string>} [reasonGoods]  the goods-denominated reason,
 *   present only when a goods flow named one
 */

/**
 * THE BYPASS an edge carries (§5c, J3 writes it). The PERSISTED half of a corridor
 * whose wagons refuse a place they fear: the avoidance set, when it was first worn,
 * when the fear was last actually observed (the hysteresis clock), and what swinging
 * wide costs. The GEOMETRY that avoidance implies is never stored, exactly as Law 1
 * above requires: a consumer that needs the detour asks the digest for it.
 *
 * The shape lives HERE rather than in the writer for the same reason `FlowAccrual`
 * does: this module owns what a persisted edge IS, so every conditional sub-shape an
 * edge can carry has exactly one spelling, and a reader can type a whole edge without
 * importing the slice that happened to write one of its keys.
 *
 * @typedef {Object} RouteBypass
 * @property {ReadonlyArray<string>} avoid  the places the wagons refuse, codepoint sorted
 * @property {number} sinceTick        when this bypass was first worn
 * @property {number} lastDangerTick   the last tick the fear was actually observed
 * @property {number} detourPremium01  what swinging wide costs, 0..1
 */

/**
 * @typedef {Object} CorridorDemand
 * @property {string} a
 * @property {string} b
 * @property {Record<string, string>} flows  flow class to accumulated band
 * @property {Record<string, number>} tally
 * @property {Record<string, ReadonlyArray<string>>} receipts
 * @property {ReadonlyArray<string>} [reasonGoods]
 * @property {number} sinceTick
 * @property {number} lastCharterEval
 */

/**
 * @typedef {Object} RouteNetwork
 * @property {Record<string, RouteEdge>} edges
 * @property {Record<string, CorridorDemand>} corridor
 */

/**
 * Is THE ORGANIC ROUTE LIFECYCLE lit for this world? Reads
 * `simulationRules.routeLifecycleEnabled === true`, defensively. ABSENT means
 * false means DORMANT (Law 7). Pure, total.
 *
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState
 * @returns {boolean}
 */
export function routeLifecycleActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).routeLifecycleEnabled === true);
}

/**
 * The two endpoints in CODEPOINT order (§3). Not locale order: locale order is
 * environment-dependent and would make the same realm derive different edge ids on
 * different machines, which THE PROMISE forbids.
 *
 * @param {string|number} aId @param {string|number} bId
 * @returns {[string, string]}
 */
export function orderedRouteEndpoints(aId, bId) {
  const a = String(aId);
  const b = String(bId);
  return a <= b ? [a, b] : [b, a];
}

/**
 * THE DETERMINISTIC EDGE IDENTITY (§3): `route.<a>.<b>.<mode>`, endpoints in
 * codepoint order. The same pair and the same mode always produce the same id, in
 * either argument order, on any machine, forever.
 *
 * @param {string|number} aId @param {string|number} bId @param {string} mode
 * @returns {string}
 */
export function routeEdgeId(aId, bId, mode) {
  const [low, high] = orderedRouteEndpoints(aId, bId);
  return `route.${low}.${high}.${mode}`;
}

/**
 * The unordered corridor identity. A corridor is a PAIR that may not yet carry an
 * edge, so it is mode-free by construction: demand accumulates between two places,
 * and the charter evaluation is what later decides whether the road that serves it
 * is a land road or a sea lane.
 *
 * @param {string|number} aId @param {string|number} bId
 * @returns {string}
 */
export function corridorId(aId, bId) {
  const [low, high] = orderedRouteEndpoints(aId, bId);
  return `corridor.${low}.${high}`;
}

/**
 * True iff `edge` is immune to organic removal. PROVENANCE is the authority; the
 * `lifecycleImmune` flag is a redundant, pinned mirror the surfaces can read
 * without knowing the provenance vocabulary. Both are written by one factory
 * (`routeEdge`) so they cannot drift, and a structural pin asserts the two agree
 * across a derived network.
 *
 * @param {{ provenance?: unknown, lifecycleImmune?: unknown }|null|undefined} edge
 * @returns {boolean}
 */
export function isLifecycleImmune(edge) {
  if (!edge || typeof edge !== 'object') return false;
  return edge.provenance === PROVENANCE_USER || edge.lifecycleImmune === true;
}

/**
 * Rebuild a record with its keys in codepoint order. Every ledger this module
 * writes goes through here, so a network rebuilt from a re-ordered save
 * serializes byte-identically to the one that was persisted.
 *
 * @template T
 * @param {Record<string, T>} record
 * @returns {Record<string, T>}
 */
function sortedRecord(record) {
  /** @type {Record<string, T>} */
  const out = {};
  for (const key of Object.keys(record).sort()) out[key] = record[key];
  return out;
}

/**
 * THE ONE EDGE FACTORY. Every RouteEdge in the estate is built here, so the
 * conditional keys (`lifecycleImmune`, `byPowerRef`, `reasonGoods`) can only ever
 * appear under the conditions this function states, and the drop-when-absent norm
 * is enforced by construction rather than by convention.
 *
 * The endpoints are canonicalized, so `routeEdge('b', 'a', ...)` and
 * `routeEdge('a', 'b', ...)` produce the identical record.
 *
 * @param {{
 *   a: string|number,
 *   b: string|number,
 *   grade: string,
 *   mode: string,
 *   provenance: string,
 *   flavor: string,
 *   tick: number,
 *   dominantFlowClass?: string|null,
 *   byPowerRef?: string|null,
 *   reasonGoods?: ReadonlyArray<string>|null,
 * }} input
 * @returns {RouteEdge}
 */
export function routeEdge(input) {
  const [a, b] = orderedRouteEndpoints(input.a, input.b);
  /** @type {RouteCharter} */
  const charter = {
    flavor: input.flavor,
    tick: Number.isFinite(input.tick) ? Number(input.tick) : 0,
    dominantFlowClass: input.dominantFlowClass == null ? null : String(input.dominantFlowClass),
  };
  if (input.byPowerRef) charter.byPowerRef = String(input.byPowerRef);
  if (Array.isArray(input.reasonGoods) && input.reasonGoods.length > 0) {
    charter.reasonGoods = Object.freeze(input.reasonGoods.map(String));
  }
  /** @type {RouteEdge} */
  const edge = {
    a,
    b,
    grade: input.grade,
    mode: input.mode,
    charter,
    provenance: input.provenance,
  };
  // Conditional, drop-when-false: only a user edge carries the immunity mark, so
  // a generated network serializes without the key at all.
  if (input.provenance === PROVENANCE_USER) edge.lifecycleImmune = true;
  return edge;
}

/** An empty network. Never persisted (see writeRouteNetwork). @returns {RouteNetwork} */
export function emptyRouteNetwork() {
  return { edges: {}, corridor: {} };
}

/**
 * True when a network carries nothing at all, and therefore must not be persisted.
 * @param {RouteNetwork|null|undefined} network
 * @returns {boolean}
 */
export function isRouteNetworkEmpty(network) {
  if (!network || typeof network !== 'object') return true;
  const edges = network.edges && typeof network.edges === 'object' ? network.edges : {};
  const corridor = network.corridor && typeof network.corridor === 'object' ? network.corridor : {};
  return Object.keys(edges).length === 0 && Object.keys(corridor).length === 0;
}

/**
 * Read the network ledger off a world, DEFENSIVELY. A world that never had one,
 * a world whose ledger was dropped, and a world persisted before this layer
 * existed all answer the same way: null. Callers that want a container to fold
 * into use `readRouteNetwork(ws) || emptyRouteNetwork()`.
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @returns {RouteNetwork|null}
 */
export function readRouteNetwork(worldState) {
  const raw = getSpatialLedger(
    /** @type {Record<string, unknown>} */ (worldState || {}),
    ROUTE_NETWORK_LEDGER,
  );
  if (!raw || typeof raw !== 'object') return null;
  const record = /** @type {Record<string, unknown>} */ (raw);
  const edges = record.edges && typeof record.edges === 'object'
    ? /** @type {Record<string, RouteEdge>} */ (record.edges) : {};
  const corridor = record.corridor && typeof record.corridor === 'object'
    ? /** @type {Record<string, CorridorDemand>} */ (record.corridor) : {};
  return { edges, corridor };
}

/**
 * Every edge on a world, keyed by edge id, in codepoint order. Empty on a dormant
 * or never-connected world (absence is a legitimate zero, the taxonomy norm).
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @returns {Record<string, RouteEdge>}
 */
export function readRouteEdges(worldState) {
  const network = readRouteNetwork(worldState);
  return network ? network.edges : {};
}

/**
 * Every corridor on a world, keyed by corridor id. Empty at genesis by design:
 * J1 mints the SHAPE and J2 is what fills it.
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @returns {Record<string, CorridorDemand>}
 */
export function readCorridors(worldState) {
  const network = readRouteNetwork(worldState);
  return network ? network.corridor : {};
}

/**
 * Fold a network onto a world, DROP-WHEN-EMPTY.
 *
 * An empty network is not written as `{ edges: {}, corridor: {} }`; the key is
 * dropped outright, and `dropSpatialLedger` drops the whole `spatialLedgers`
 * namespace when this was the last sub-ledger. That is the byte-identity half of
 * Law 7: a world whose network drained is indistinguishable from a world that
 * never had one, so the dormancy golden cannot be quietly broken by a lit-then-
 * emptied run.
 *
 * Returns a NEW worldState, or the SAME REFERENCE when there was nothing to drop.
 *
 * @param {Record<string, unknown>} worldState
 * @param {RouteNetwork|null|undefined} network
 * @returns {Record<string, unknown>}
 */
export function writeRouteNetwork(worldState, network) {
  if (isRouteNetworkEmpty(network)) {
    return dropSpatialLedger(worldState, ROUTE_NETWORK_LEDGER);
  }
  const live = /** @type {RouteNetwork} */ (network);
  return setSpatialLedger(worldState, ROUTE_NETWORK_LEDGER, {
    edges: sortedRecord(live.edges || {}),
    corridor: sortedRecord(live.corridor || {}),
  });
}

/**
 * Fold a derived edge list into a network container, keyed by the deterministic
 * edge id and sorted. EXPLICIT WINS, in one direction only: an edge already on the
 * world is never overwritten by a derivation, because the lived network outranks
 * any re-derivation of the realm's birth (Law 2 — divergence between genesis
 * access and lived connectivity is expected and never reconciled by mutation).
 *
 * @param {RouteNetwork} network
 * @param {ReadonlyArray<RouteEdge>} edges
 * @returns {RouteNetwork}
 */
export function withRouteEdges(network, edges) {
  const base = network && typeof network === 'object' ? network : emptyRouteNetwork();
  /** @type {Record<string, RouteEdge>} */
  const next = { ...(base.edges || {}) };
  let added = 0;
  for (const edge of edges) {
    const id = routeEdgeId(edge.a, edge.b, edge.mode);
    if (id in next) continue;
    next[id] = edge;
    added += 1;
  }
  if (added === 0) return base;
  return { edges: sortedRecord(next), corridor: base.corridor || {} };
}

/**
 * THE ONE CORRIDOR FACTORY (§3, §4). A corridor is a PAIR that may not yet carry
 * an edge, so it is mode-free, and it is minted EMPTY: `sinceTick` is when the
 * realm first walked it and `lastCharterEval` is J3's cursor, which stays at the
 * mint tick until a charter evaluation actually looks at it.
 *
 * Mirrors `routeEdge` deliberately: one factory per record type, so the
 * drop-when-empty conditional keys can only appear under the conditions stated
 * here, and the endpoints are canonicalized on the way in.
 *
 * @param {{ a: string|number, b: string|number, sinceTick?: number }} input
 * @returns {CorridorDemand}
 */
export function corridorDemand(input) {
  const [a, b] = orderedRouteEndpoints(input.a, input.b);
  const tick = Number.isFinite(input.sinceTick) ? Number(input.sinceTick) : 0;
  return { a, b, flows: {}, tally: {}, receipts: {}, sinceTick: tick, lastCharterEval: tick };
}

/**
 * Fold corridor records into a network, REPLACING by corridor id.
 *
 * The opposite direction from `withRouteEdges`, and the asymmetry is the point.
 * An edge is a fact about the world that a re-derivation may never overwrite
 * (Law 2). A corridor is an ACCUMULATOR, and the accrual pass is its single
 * writer: it reads the prior record, adds this pulse's traversals, and hands back
 * the successor. Explicit-wins here would freeze demand at whatever the first
 * pulse measured and the network would never charter anything.
 *
 * @param {RouteNetwork} network
 * @param {Record<string, CorridorDemand>} corridors
 * @returns {RouteNetwork}
 */
export function withCorridors(network, corridors) {
  const base = network && typeof network === 'object' ? network : emptyRouteNetwork();
  const incoming = corridors && typeof corridors === 'object' ? corridors : {};
  if (Object.keys(incoming).length === 0) return base;
  return {
    edges: base.edges || {},
    corridor: sortedRecord({ ...(base.corridor || {}), ...incoming }),
  };
}

/**
 * RETIRE corridor records by id (W-J slice J3).
 *
 * The one deletion this model allows, and it is deliberately narrow. A corridor
 * is the ACCUMULATION of a want; when a charter answers that want the road
 * becomes the record of it, and J2's accrual then routes every further traversal
 * onto the edge rather than the pair. Leaving the spent corridor behind would
 * park a frozen demand number next to a road that is already serving it, and any
 * later evaluation reading that number would be double-counting a want the realm
 * already met.
 *
 * NOTHING ELSE IS DELETABLE HERE, and the asymmetry is Law 5. An EDGE is never
 * removed by anything in this estate: decay's floor is `hidden`, so a road that
 * the realm stops walking becomes a remnant rather than an absence. A corridor is
 * not a road and has no remnant to be.
 *
 * @param {RouteNetwork} network
 * @param {ReadonlyArray<string>} corridorIds
 * @returns {RouteNetwork}
 */
export function withoutCorridors(network, corridorIds) {
  const base = network && typeof network === 'object' ? network : emptyRouteNetwork();
  const doomed = new Set((corridorIds || []).map(String));
  if (doomed.size === 0) return base;
  const corridor = base.corridor || {};
  /** @type {Record<string, CorridorDemand>} */
  const next = {};
  let removed = 0;
  for (const id of Object.keys(corridor).sort()) {
    if (doomed.has(id)) { removed += 1; continue; }
    next[id] = corridor[id];
  }
  if (removed === 0) return base;
  return { edges: base.edges || {}, corridor: next };
}

/**
 * Fold per-edge USAGE onto the edges a network already carries, REPLACING by edge
 * id. An id with no edge behind it is SKIPPED rather than minting one: usage is a
 * property of a road that exists, and a usage row for an absent edge would be a
 * ghost road that no charter ever authorized.
 *
 * @param {RouteNetwork} network
 * @param {Record<string, FlowAccrual & { lastTick: number }>} usageById
 * @returns {RouteNetwork}
 */
export function withEdgeUsage(network, usageById) {
  const base = network && typeof network === 'object' ? network : emptyRouteNetwork();
  const incoming = usageById && typeof usageById === 'object' ? usageById : {};
  /** @type {Record<string, RouteEdge>} */
  const next = { ...(base.edges || {}) };
  let touched = 0;
  for (const id of Object.keys(incoming).sort()) {
    const edge = next[id];
    if (!edge) continue;
    next[id] = { ...edge, usage: incoming[id] };
    touched += 1;
  }
  if (touched === 0) return base;
  return { edges: sortedRecord(next), corridor: base.corridor || {} };
}

/**
 * WHO CAN REACH WHOM over the LIVED network. Returns a map from settlement id to
 * a component label, so two places are materially connected exactly when their
 * labels match. The label is the codepoint-lowest member of the component, which
 * makes it stable under any re-derivation and readable in a failure message.
 *
 * HIDDEN PATHS ARE EXCLUDED BY DEFAULT, and that is a material judgment rather
 * than an oversight. A hidden path is the remnant Law 5 keeps so nothing is ever
 * forgotten; §9 lets a wanderer or a smuggler use one at a grade penalty and
 * forbids it to an army outright. A supply chain is not a smuggler: a realm that
 * feeds itself down an overgrown track is not feeding itself, and counting hidden
 * paths as connectivity would let the self-sufficiency metric rise as the network
 * decayed. Callers that mean the smuggler's question pass includeHidden.
 *
 * @param {RouteNetwork|null|undefined} network
 * @param {{ includeHidden?: boolean }} [options]
 * @returns {Map<string, string>}
 */
export function routeNetworkComponents(network, options = {}) {
  const edges = network && network.edges && typeof network.edges === 'object' ? network.edges : {};
  const includeHidden = options.includeHidden === true;
  /** @type {Map<string, Set<string>>} */
  const adjacency = new Map();
  /** @param {string} id */
  const seat = (id) => {
    const found = adjacency.get(id);
    if (found) return found;
    /** @type {Set<string>} */
    const fresh = new Set();
    adjacency.set(id, fresh);
    return fresh;
  };
  for (const id of Object.keys(edges).sort()) {
    const edge = edges[id];
    if (!edge || typeof edge !== 'object') continue;
    if (!includeHidden && edge.grade === 'hidden') continue;
    const a = String(edge.a);
    const b = String(edge.b);
    if (!a || !b || a === b) continue;
    seat(a).add(b);
    seat(b).add(a);
  }
  /** @type {Map<string, string>} */
  const label = new Map();
  for (const start of [...adjacency.keys()].sort()) {
    if (label.has(start)) continue;
    /** @type {Array<string>} */
    const frontier = [start];
    /** @type {Array<string>} */
    const seen = [];
    label.set(start, start);
    while (frontier.length > 0) {
      const current = /** @type {string} */ (frontier.pop());
      seen.push(current);
      for (const next of [...(adjacency.get(current) || new Set())].sort()) {
        if (label.has(next)) continue;
        label.set(next, start);
        frontier.push(next);
      }
    }
    // The seat that started the walk is already the codepoint-lowest member, because
    // the outer loop visits starts in codepoint order and never revisits a labelled
    // node, so no relabelling pass is needed.
    seen.length = 0;
  }
  return label;
}

/**
 * True when two places can reach each other over the lived network. A place with
 * no edges at all is connected to nobody, including itself, because the question
 * this answers is whether a good can travel between them.
 *
 * @param {Map<string, string>} components
 * @param {string} a @param {string} b
 * @returns {boolean}
 */
export function routeConnected(components, a, b) {
  const left = components.get(String(a));
  const right = components.get(String(b));
  return !!left && !!right && left === right;
}

/**
 * One corridor off a world, or null. The accessor the charter evaluation and the
 * surfaces both read, so neither has to know the id law.
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @param {string|number} aId @param {string|number} bId
 * @returns {CorridorDemand|null}
 */
export function readCorridor(worldState, aId, bId) {
  const corridors = readCorridors(worldState);
  return corridors[corridorId(aId, bId)] || null;
}

/**
 * The USAGE an edge has carried, or null when nothing has walked it yet. Absence
 * is a legitimate zero (the taxonomy norm): a brand-new charter and a road the
 * realm has stopped walking are distinguished by the tally, never by the key.
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @param {string} edgeId
 * @returns {(FlowAccrual & { lastTick: number })|null}
 */
export function readEdgeUsage(worldState, edgeId) {
  const edge = readRouteEdges(worldState)[edgeId];
  return edge && edge.usage ? edge.usage : null;
}
