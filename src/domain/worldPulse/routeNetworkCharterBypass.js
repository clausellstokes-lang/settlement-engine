/**
 * routeNetworkCharterBypass.js — BYPASS GEOMETRY (W-J slice J3; binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §5c).
 *
 * §5c's first sentence is the whole design: an unsafe settlement need not be a
 * wall. When the believed danger at a place a through-road passes THROUGH crosses
 * the bypass band, the through-traffic may pay a DETOUR PREMIUM and swing wide of
 * it. The road TO that town still exists, because someone still sells it grain at
 * the risk premium; what it loses is everyone who was only passing.
 *
 * ── WAYPOINTS ARE GEOMETRY, NEVER GRAPH NODES (Law 1) ───────────────────────
 * A bypass changes which cells a caravan walks, and NOTHING else. It mints no
 * edge, no corridor, no settlement, and it does not touch the frozen digest. What
 * persists on the edge is the AVOIDANCE SET (which places the wagons refuse) plus
 * its clock; the path itself is DERIVED from the frozen candidate routes every
 * time it is asked for, exactly as §3 requires of every geometry in this program.
 * Storing the path would be a derivable duplicate that goes stale on the first
 * re-canonize, and it would also be the moment a waypoint quietly became a node.
 *
 * ── BOTH EDGES MAY COEXIST, AND THAT IS THE POINT ───────────────────────────
 * §5c is explicit: the road to the dangerous town and the road around it are not
 * alternatives. This module therefore never removes, never re-points and never
 * re-grades an edge. It writes ONE conditional key, `bypass`, onto the edges whose
 * traffic swings wide, and every other edge in the ledger is untouched.
 *
 * ── HYSTERESIS APPLIES TO GEOMETRY TOO ──────────────────────────────────────
 * A worn bypass persists after the danger clears, until usage says otherwise:
 * roads remember fear a while. Mechanically that is one clock (`lastDangerTick`)
 * and one dwell (BYPASS_HYSTERESIS_TICKS), and it is the same shape as Law 4's
 * formation/removal asymmetry rather than a second idea. Without it the wagons
 * would swing back the week the rumour decayed and the map would flicker.
 *
 * ── THE FEEDBACK IS THE DESIGN'S GIFT ───────────────────────────────────────
 * `throughTrafficCensus` is what makes "a settlement that becomes unsafe LOSES
 * ITS THROUGH-TRAFFIC" a number rather than a sentence. It counts, for every
 * place, how many of the realm's through-corridors currently transit it. Safety
 * becomes an economic asset a settlement can squander, and the recovery of the
 * count is the story arc the Herald can tell.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store. Every list is
 * built in codepoint-sorted order, so a bypass derived twice is the same bypass.
 */

import { clamp01 } from '../../kernel/math.js';
import { activeSpatialDigest, candidateRoutes } from '../spatial/distanceRead.js';
import { embattlementLevel } from '../spatial/embattlement.js';
import { believedDangerView } from './routeNetworkCharterDanger.js';
import { routeEdgeId } from './routeNetworkLedger.js';

/**
 * ROUTE_LIFECYCLE_TUNING, the bypass half (§12: every entry a band).
 *
 * BYPASS_BAND sits BELOW the embattled-deferral rung on purpose. Skirting a town
 * is a cheap, reversible decision a wagon master makes; deferring a realm's
 * charter is an expensive, slow one. Requiring the same evidence for both would
 * mean the caravans only ever swung wide of places the Crown had already given up
 * on, which is the opposite of how fear travels.
 *
 * BYPASS_CANDIDATE_K asks the frozen candidate-route derivation for more
 * alternates than the movers' default 3, because the whole question here is
 * whether ANY of the k roads misses one particular town. It stays a small
 * constant: the derivation is memoized per digest-pair and each alternate is one
 * cached shortest path, so this is linear in k and never re-solves geometry.
 *
 * DETOUR_PREMIUM_FLOOR is what swinging wide costs even when the detour happens
 * to be geometrically free: a wagon master who leaves the known road pays in time
 * and nerve whatever the map says. DETOUR_PREMIUM_CAP is where a detour stops
 * being a detour and becomes a different journey.
 *
 * @type {Readonly<Record<string, number>>}
 */
export const ROUTE_BYPASS_TUNING = Object.freeze({
  BYPASS_BAND: 0.4,
  BYPASS_CANDIDATE_K: 6,
  BYPASS_HYSTERESIS_TICKS: 26,
  DETOUR_PREMIUM_FLOOR: 0.05,
  DETOUR_PREMIUM_CAP: 0.6,
});

/** The conditional edge key this module is the single writer of. @type {string} */
export const ROUTE_BYPASS_KEY = 'bypass';

/**
 * The persisted bypass shape. DECLARED BY THE LEDGER, not here: this module is the
 * single WRITER of the key, and routeNetworkLedger.js is the single declarer of what
 * a persisted edge carries, so `RouteEdge.bypass` and this alias can never drift into
 * two spellings of one record.
 * @typedef {import('./routeNetworkLedger.js').RouteBypass} RouteBypass
 */

/** @param {number} value @returns {number} */
function round4(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 10000) / 10000 : 0;
}

/** @param {unknown} value @returns {number} */
function tickOf(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

/**
 * The BELIEVED danger at one place, as the two endpoints of a corridor between
 * them see it, keeping the worse reading. Same frightened-end-governs rule the
 * danger leaf states, applied to an intermediary rather than an endpoint: if
 * EITHER end of the road has heard that the town in the middle is burning, the
 * wagons from that end swing wide, and one avoided direction is an avoided road.
 *
 * @param {Record<string, unknown>} worldState
 * @param {ReadonlyArray<string>} observerIds
 * @param {string} settlementId
 * @returns {number} 0..1
 */
export function fearedDangerAt(worldState, observerIds, settlementId) {
  let worst = 0;
  for (const observerId of [...observerIds].sort()) {
    const level = clamp01(embattlementLevel(
      believedDangerView(worldState, observerId), String(settlementId),
    ));
    if (level > worst) worst = level;
  }
  return worst;
}

/**
 * @typedef {Object} BypassDerivation
 * @property {RouteBypass|null} bypass  the persisted half, or null when the wagons run straight
 * @property {ReadonlyArray<string>} path  the geometry actually walked (derived, never stored)
 * @property {ReadonlyArray<string>} waypoints  that path's intermediates
 * @property {ReadonlyArray<string>} feared  the places currently over the band
 * @property {string} verdict  why this derivation came out the way it did
 */

/** A straight run, for the several ways of not needing a bypass.
 *  @param {ReadonlyArray<string>} path @param {string} verdict @returns {BypassDerivation} */
function straight(path, verdict) {
  const walked = Object.freeze([...path].map(String));
  return {
    bypass: null,
    path: walked,
    waypoints: Object.freeze(walked.slice(1, Math.max(1, walked.length - 1))),
    feared: Object.freeze([]),
    verdict,
  };
}

/**
 * DERIVE THE GEOMETRY A THROUGH-CORRIDOR ACTUALLY WALKS (§5c).
 *
 * Five outcomes, and every one of them is a verdict a receipt can name:
 *   - `aspatial`: no geometry at all, so there is no third place to fear and no
 *     waypoint to place. A realm with no map cannot swing wide of anything.
 *   - `unreachable`: the frozen derivation offers no route between the pair.
 *   - `clear`: the believed-best road passes nobody the wagons fear.
 *   - `no_way_around`: places are feared, but every candidate road passes one of
 *     them. The town IS a wall this time, and §5b's risk premium is the only door
 *     left. Saying so explicitly is what keeps the bypass layer from silently
 *     pretending it solved a problem it did not.
 *   - `bypassed`: a road exists that misses every feared place, and the wagons
 *     take it and pay for it.
 *
 * HYSTERESIS is folded in at one place: a prior avoidance set stays in force
 * while the dwell has not elapsed, so a bypass worn in a war outlives the war by
 * BYPASS_HYSTERESIS_TICKS of quiet before the wagons trust the short road again.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   a: string, b: string,
 *   tick: number,
 *   prior?: RouteBypass|null,
 * }} input
 * @returns {BypassDerivation}
 */
export function deriveBypass(input) {
  const worldState = input.worldState || {};
  const a = String(input.a);
  const b = String(input.b);
  const now = tickOf(input.tick);
  const prior = input.prior && typeof input.prior === 'object' ? input.prior : null;
  const digest = activeSpatialDigest(worldState);
  if (!digest) return straight([a, b], 'aspatial');

  const k = Number(ROUTE_BYPASS_TUNING.BYPASS_CANDIDATE_K);
  const routes = candidateRoutes(digest, a, b, k);
  if (routes.length === 0) return straight([], 'unreachable');
  const primary = routes[0];
  const primaryPath = primary.path.map(String);

  const observers = [a, b];
  const band = Number(ROUTE_BYPASS_TUNING.BYPASS_BAND);
  // THE FEAR IS READ ACROSS EVERY CANDIDATE, not only the cheapest one, and the
  // first shape of this function read only the primary. That was a real defect
  // rather than an optimization: with the fear confined to the primary's
  // intermediates, the "bypass" could and did select an alternate that ran
  // straight through an equally besieged town, because that town was never on the
  // list of places to avoid. A detour into the same war is not a detour.
  /** @type {Set<string>} */
  const fearedSet = new Set();
  for (const route of routes) {
    for (const id of route.path.map(String).slice(1, -1)) {
      if (id === a || id === b || fearedSet.has(id)) continue;
      if (fearedDangerAt(worldState, observers, id) >= band) fearedSet.add(id);
    }
  }
  const feared = [...fearedSet].sort();

  // The prior avoidance set stays in force while the hysteresis dwell holds. A
  // bypass whose fear has been gone longer than the dwell simply lapses, which is
  // the "until usage says otherwise" half of §5c expressed as a clock.
  const dwell = Number(ROUTE_BYPASS_TUNING.BYPASS_HYSTERESIS_TICKS);
  const priorHolds = !!prior
    && Array.isArray(prior.avoid)
    && prior.avoid.length > 0
    && (now - tickOf(prior.lastDangerTick)) < dwell;

  /** @type {Set<string>} */
  const avoidSet = new Set(feared);
  if (priorHolds) for (const id of /** @type {ReadonlyArray<string>} */ (prior.avoid)) avoidSet.add(String(id));
  if (avoidSet.size === 0) return straight(primaryPath, 'clear');

  /** @type {{ path: Array<string>, cost: number }|null} */
  let clear = null;
  for (const route of routes) {
    const path = route.path.map(String);
    const passes = path.slice(1, -1).some(id => avoidSet.has(id));
    if (passes) continue;
    clear = { path, cost: Number(route.cost) };
    break;
  }
  if (!clear) {
    const stuck = straight(primaryPath, 'no_way_around');
    return { ...stuck, feared: Object.freeze(feared) };
  }

  const primaryCost = Math.max(1, Number(primary.cost));
  const raw = (clear.cost - primaryCost) / primaryCost;
  const premium = Math.min(
    Number(ROUTE_BYPASS_TUNING.DETOUR_PREMIUM_CAP),
    Math.max(Number(ROUTE_BYPASS_TUNING.DETOUR_PREMIUM_FLOOR), raw),
  );

  return {
    bypass: Object.freeze({
      avoid: Object.freeze([...avoidSet].sort()),
      sinceTick: prior && priorHolds ? tickOf(prior.sinceTick) : now,
      lastDangerTick: feared.length > 0 ? now : tickOf(prior ? prior.lastDangerTick : now),
      detourPremium01: round4(clamp01(premium)),
    }),
    path: Object.freeze(clear.path),
    waypoints: Object.freeze(clear.path.slice(1, -1)),
    feared: Object.freeze(feared),
    verdict: 'bypassed',
  };
}

/**
 * The bypass an edge currently carries, or null. Defensive: an edge persisted
 * before this slice existed, and an edge whose wagons run straight, answer the
 * same way.
 *
 * @param {{ bypass?: unknown }|null|undefined} edge
 * @returns {RouteBypass|null}
 */
export function readEdgeBypass(edge) {
  if (!edge || typeof edge !== 'object') return null;
  const raw = /** @type {Record<string, unknown>} */ (edge)[ROUTE_BYPASS_KEY];
  if (!raw || typeof raw !== 'object') return null;
  const record = /** @type {Record<string, unknown>} */ (raw);
  if (!Array.isArray(record.avoid) || record.avoid.length === 0) return null;
  return /** @type {RouteBypass} */ (raw);
}

/**
 * @typedef {Object} BypassSweepResult
 * @property {import('./routeNetworkLedger.js').RouteNetwork} network
 * @property {boolean} changed
 * @property {number} bypassed       edges whose wagons now swing wide
 * @property {number} lapsed         edges whose bypass fell out of hysteresis
 * @property {number} walled         edges where every road passes a feared place
 * @property {Record<string, ReadonlyArray<string>>} avoidedBy  edge id to its avoidance set
 */

/**
 * SWEEP THE LIVED NETWORK'S GEOMETRY (§5c). One pass over the edges, in codepoint
 * order, deriving each one's bypass and folding the conditional key on or off.
 *
 * HIDDEN EDGES ARE SWEPT TOO, deliberately: §9 lets a wanderer or a smuggler walk
 * an overgrown path, and a smuggler has the strongest reason of anyone to swing
 * wide of a garrison. Excluding them would have made the one grade whose traffic
 * cares most about danger the one grade that never routed around it.
 *
 * WATER EDGES ARE NOT SWEPT. A sea lane's geometry is the sea-lane set's, not the
 * travel raster's, and the candidate-route derivation this module reads does not
 * speak in harbours. Skipping them is the honest gap rather than a bypass derived
 * from the wrong map; §5c is about skirting a town's vicinity by land.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   network: import('./routeNetworkLedger.js').RouteNetwork|null|undefined,
 *   tick: number,
 * }} input
 * @returns {BypassSweepResult}
 */
export function sweepBypassGeometry(input) {
  const base = input.network && typeof input.network === 'object'
    ? input.network
    : { edges: {}, corridor: {} };
  const edges = base.edges && typeof base.edges === 'object' ? base.edges : {};
  const now = tickOf(input.tick);
  /** @type {Record<string, import('./routeNetworkLedger.js').RouteEdge>} */
  const next = {};
  /** @type {Record<string, ReadonlyArray<string>>} */
  const avoidedBy = {};
  let changed = false;
  let bypassed = 0;
  let lapsed = 0;
  let walled = 0;

  for (const id of Object.keys(edges).sort()) {
    const edge = edges[id];
    next[id] = edge;
    if (!edge || typeof edge !== 'object') continue;
    if (edge.mode === 'water') continue;
    const prior = readEdgeBypass(edge);
    const derived = deriveBypass({
      worldState: input.worldState,
      a: String(edge.a),
      b: String(edge.b),
      tick: now,
      prior,
    });
    if (derived.verdict === 'no_way_around') walled += 1;
    if (derived.bypass) {
      bypassed += 1;
      avoidedBy[id] = derived.bypass.avoid;
      if (JSON.stringify(prior) !== JSON.stringify(derived.bypass)) {
        next[id] = { ...edge, [ROUTE_BYPASS_KEY]: derived.bypass };
        changed = true;
      }
      continue;
    }
    if (prior) {
      lapsed += 1;
      // Drop-when-absent: a lapsed bypass leaves NO key behind, so an edge whose
      // fear passed serializes exactly as an edge that never feared anything.
      const { [ROUTE_BYPASS_KEY]: _dropped, ...rest } = /** @type {Record<string, unknown>} */ (edge);
      next[id] = /** @type {import('./routeNetworkLedger.js').RouteEdge} */ (rest);
      changed = true;
    }
  }

  return {
    network: changed ? { edges: next, corridor: base.corridor || {} } : base,
    changed,
    bypassed,
    lapsed,
    walled,
    avoidedBy,
  };
}

/**
 * @typedef {Object} ThroughTrafficCensus
 * @property {Map<string, number>} transits  settlement id to through-corridors crossing it
 * @property {number} corridors   how many edges contributed a geometry
 * @property {number} bypassed    how many of them are swinging wide
 */

/**
 * THE FEEDBACK, MEASURED (§5c). For every place in the realm, how many of the
 * network's roads currently pass THROUGH it on their way somewhere else.
 *
 * A settlement's own edges do not count toward its own number, and that is the
 * distinction the whole feedback rests on: §5c says an unsafe town keeps the road
 * that serves it and loses the wagons that were only passing. Counting its own
 * edges would hide exactly the loss this census exists to show.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   network: import('./routeNetworkLedger.js').RouteNetwork|null|undefined,
 *   tick: number,
 * }} input
 * @returns {ThroughTrafficCensus}
 */
export function throughTrafficCensus(input) {
  const base = input.network && typeof input.network === 'object'
    ? input.network
    : { edges: {}, corridor: {} };
  const edges = base.edges && typeof base.edges === 'object' ? base.edges : {};
  const now = tickOf(input.tick);
  /** @type {Map<string, number>} */
  const transits = new Map();
  let corridors = 0;
  let bypassed = 0;

  for (const id of Object.keys(edges).sort()) {
    const edge = edges[id];
    if (!edge || typeof edge !== 'object') continue;
    if (edge.mode === 'water') continue;
    const a = String(edge.a);
    const b = String(edge.b);
    const derived = deriveBypass({
      worldState: input.worldState,
      a,
      b,
      tick: now,
      prior: readEdgeBypass(edge),
    });
    if (derived.path.length === 0) continue;
    corridors += 1;
    if (derived.bypass) bypassed += 1;
    for (const waypoint of derived.waypoints) {
      // REDUNDANT BY DESIGN, and measured to be so: `waypoints` is already the
      // path's interior, so this guard fires only if a future path source hands
      // back a road that revisits its own endpoint. The negative-control sweep
      // found that breaking either defence alone leaves the invariant standing
      // and only the pair of them breaks it, which is the correct shape for a
      // boundary this module does not own the producer of.
      if (waypoint === a || waypoint === b) continue;
      transits.set(waypoint, (transits.get(waypoint) || 0) + 1);
    }
  }

  return { transits, corridors, bypassed };
}

/**
 * How much through-traffic ONE place carries, from a census. Absent is a
 * legitimate zero (the taxonomy norm): a place nobody passes through and a place
 * that has lost everyone who used to are the same number, and the story of which
 * one it is lives in the change between two censuses, never in the key.
 *
 * @param {ThroughTrafficCensus} census
 * @param {string} settlementId
 * @returns {number}
 */
export function throughTrafficAt(census, settlementId) {
  if (!census || !census.transits) return 0;
  return census.transits.get(String(settlementId)) || 0;
}

/**
 * The edge id a bypass belongs to, for the callers that hold a pair rather than
 * an id. Delegates to §3's ONE edge-identity law rather than spelling it a second
 * time; the source scan in routeNetworkLedger.test.js is what makes that a rule
 * and not a preference.
 *
 * @param {string} a @param {string} b @param {string} mode
 * @returns {string}
 */
export function bypassEdgeId(a, b, mode) {
  return routeEdgeId(a, b, mode);
}
