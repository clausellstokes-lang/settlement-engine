/**
 * userRoutes.js — the pure derivation behind directive 3 (USER ROUTES).
 *
 * A user route is an edge the DM charters by hand between two settlements they
 * already own. Everything about it that must be reproducible lives here: the
 * deterministic edge identity, the endpoint legality rules, and the cost the map
 * geography imposes on the path. Nothing in this module reads the store, the
 * clock, or the network, so the same realm and the same pair of endpoints always
 * derive the same route (THE PROMISE: a seed is a world, forever).
 *
 * THE COST IS READ, NOT INVENTED. The frozen spatial digest already carries the
 * integer-quantized travel cost between every reachable pair, derived from the
 * same terrain raster the map draws roads over (spatialDigest distanceMatrix).
 * This module reads that number; it never re-implements routing, and it never
 * writes to the digest. An unreachable pair is not an error to route around, it
 * is the isolation-as-fate law answering honestly.
 *
 * MODE is derived, not chosen: two settlements the frozen sea-lane set already
 * connects charter a water route, everyone else charters a land route. The DM
 * picks endpoints; the world decides what kind of road that is.
 *
 * FINITE SEMANTICS: the reach band below is a closed typed vocabulary. Surfaces
 * translate a band into prose; nobody renders the raw integer cost at the player,
 * and nobody branches engine math on the words.
 */

import {
  isPort,
  seaLaneAdjacency,
} from '../spatial/distanceRead.js';
import {
  orderedRouteEndpoints,
  userRouteEdgeId,
} from './userRouteIdentity.js';

/**
 * The edge identity moved to the zero-import leaf `roads/userRouteIdentity.js`
 * and is re-exported here VERBATIM, so every consumer and test keeps its import
 * site while the EAGER CREATE_ROUTE mutation handler can reach the id without
 * dragging this module (and, through it, the frozen-digest reader) into the
 * first-paint closure. Moving the function rather than pinning the chunk is the
 * house cure for exactly this shape; see the leaf's docblock for the incident.
 * @enforced-by tests/build/userRouteIdentityLeaf.test.js
 */
export { orderedRouteEndpoints, userRouteEdgeId };

/** @typedef {import('../spatial/distanceRead.js').SpatialDigest} SpatialDigest */

/**
 * One recorded user-route provenance row as it sits on `config._userRoutes`. Only
 * `routeId` is read here — the duplicate-charter guard keys on it; mutateUserRoute
 * authors the rest of the row and this leaf never reads it back.
 * @typedef {{ routeId?: string }} UserRouteProvenanceRow
 */

/**
 * The read-shape of a settlement this leaf inspects for already-chartered routes:
 * the two config twins that carry the provenance rows, and the neighbour vocabulary
 * that borrows `linkId` for a route identity. A real settlement carries far more;
 * only these three homes are ever read.
 * @typedef {{
 *   config?: { _userRoutes?: UserRouteProvenanceRow[] } | null,
 *   _config?: { _userRoutes?: UserRouteProvenanceRow[] } | null,
 *   neighbourNetwork?: Array<{ linkId?: string }>,
 * }} RouteBearingSettlement
 */

/** The closed mode vocabulary. Mirrored by migration 193's server-side guard. */
export const USER_ROUTE_MODES = Object.freeze(['land', 'water']);

/** The closed reach vocabulary (typed bands, never a rendered number). */
export const USER_ROUTE_REACH_BANDS = Object.freeze([
  'close',
  'steady',
  'long',
  'arduous',
]);

// Band edges over the digest's integer cost units. Tuning values, not laws: the
// route lifecycle's own tuning table owns them once W-J lands.
const REACH_BAND_CEILINGS = Object.freeze([
  { band: 'close', ceiling: 400 },
  { band: 'steady', ceiling: 1200 },
  { band: 'long', ceiling: 3000 },
]);

/**
 * The mode the world imposes on this pair. Water when both endpoints are ports
 * the frozen sea-lane set already links; land otherwise.
 * @param {SpatialDigest|null|undefined} digest
 * @param {string} aId
 * @param {string} bId
 * @returns {'land'|'water'}
 */
export function userRouteModeFor(digest, aId, bId) {
  if (!digest || !isPort(digest, aId) || !isPort(digest, bId)) return 'land';
  const lanes = seaLaneAdjacency(digest);
  return lanes.get(String(aId))?.has(String(bId)) ? 'water' : 'land';
}

/**
 * The typed reach band for an integer path cost.
 * @param {number} cost
 * @returns {'close'|'steady'|'long'|'arduous'}
 */
export function userRouteReachBand(cost) {
  for (const rung of REACH_BAND_CEILINGS) {
    if (cost <= rung.ceiling) {
      return /** @type {'close'|'steady'|'long'} */ (rung.band);
    }
  }
  return 'arduous';
}

/**
 * The path the geography allows between two settlements of one canonized realm.
 *
 * Returns a refusal rather than a fabricated path when either endpoint is absent
 * from the frozen digest (it was never placed, or it sits off-map) or when no
 * traversable path exists. Both are legitimate world states, not failures.
 *
 * @param {SpatialDigest|null|undefined} digest
 * @param {string} aId
 * @param {string} bId
 * @param {string} [mode] the derived mode; omit to derive it here
 * @returns {{ok:true, mode:string, cost:number, band:string, routeId:string}
 *   | {ok:false, reason:string}}
 */
export function deriveUserRoutePath(digest, aId, bId, mode) {
  const a = String(aId);
  const b = String(bId);
  if (!a || !b || a === b) return { ok: false, reason: 'endpoints_not_distinct' };
  if (!digest || typeof digest !== 'object') {
    return { ok: false, reason: 'realm_not_canonized' };
  }
  const known = new Set(
    (Array.isArray(digest.settlementIds) ? digest.settlementIds : []).map(String),
  );
  if (!known.has(a) || !known.has(b)) {
    return { ok: false, reason: 'endpoint_not_on_the_map' };
  }
  const resolvedMode = mode || userRouteModeFor(digest, a, b);
  if (!USER_ROUTE_MODES.includes(resolvedMode)) {
    return { ok: false, reason: 'mode_not_supported' };
  }
  const raw = resolvedMode === 'water'
    ? seaLaneAdjacency(digest).get(a)?.get(b)
    : (digest.distanceMatrix && digest.distanceMatrix[a]
      ? digest.distanceMatrix[a][b]
      : null);
  const cost = Number.isFinite(raw) ? Number(raw) : null;
  if (cost == null || !(cost > 0)) {
    return { ok: false, reason: 'no_passable_path' };
  }
  return {
    ok: true,
    mode: resolvedMode,
    cost,
    band: userRouteReachBand(cost),
    routeId: userRouteEdgeId(a, b, resolvedMode),
  };
}

/**
 * Every route identity already recorded on one settlement, read from BOTH homes:
 * the provenance ledger and the neighbour vocabulary. Reading only one of them is
 * how a duplicate slips in after a lifecycle path rebuilt the other.
 * @param {RouteBearingSettlement|null|undefined} settlement
 * @returns {Set<string>}
 */
export function recordedUserRouteIds(settlement) {
  const found = new Set();
  for (const home of [settlement?.config, settlement?._config]) {
    const rows = Array.isArray(home?._userRoutes) ? home._userRoutes : [];
    for (const row of rows) {
      if (row && row.routeId) found.add(String(row.routeId));
    }
  }
  const network = Array.isArray(settlement?.neighbourNetwork)
    ? settlement.neighbourNetwork
    : [];
  for (const entry of network) {
    const linkId = entry && entry.linkId ? String(entry.linkId) : '';
    if (linkId.startsWith('route.')) found.add(linkId);
  }
  return found;
}

/**
 * The full legality check the UI and the command runtime share, so the button and
 * the writer can never disagree about what is chartered.
 *
 * @param {{
 *   digest:SpatialDigest|null|undefined,
 *   fromSaveId:string,
 *   toSaveId:string,
 *   fromSettlement:RouteBearingSettlement|null|undefined,
 *   toSettlement:RouteBearingSettlement|null|undefined,
 *   memberIds?:Array<string>|Set<string>|null,
 * }} input
 * @returns {{ok:true, mode:string, cost:number, band:string, routeId:string}
 *   | {ok:false, reason:string}}
 */
export function validateUserRoute(input) {
  const from = String(input?.fromSaveId || '');
  const to = String(input?.toSaveId || '');
  if (!from || !to) return { ok: false, reason: 'endpoint_missing' };
  if (from === to) return { ok: false, reason: 'endpoints_not_distinct' };
  if (!input?.fromSettlement || !input?.toSettlement) {
    return { ok: false, reason: 'endpoint_missing' };
  }
  if (input.memberIds) {
    const members = input.memberIds instanceof Set
      ? input.memberIds
      : new Set([...input.memberIds].map(String));
    if (!members.has(from) || !members.has(to)) {
      return { ok: false, reason: 'endpoint_outside_the_realm' };
    }
  }
  const path = deriveUserRoutePath(input.digest, from, to);
  if (!path.ok) return path;
  const already = recordedUserRouteIds(input.fromSettlement);
  const alreadyThere = recordedUserRouteIds(input.toSettlement);
  if (already.has(path.routeId) || alreadyThere.has(path.routeId)) {
    return { ok: false, reason: 'route_already_chartered' };
  }
  return path;
}
