/**
 * mutateUserRoute.js — the CREATE_ROUTE mutation, one writer for both halves.
 *
 * A user route is bilateral, and the two halves must be written by the SAME code
 * or they drift: one endpoint records the road, the other records a slightly
 * different road, and nothing notices until a lifecycle path rebuilds one of them.
 * `withUserRouteHalf` is therefore the only place either half is authored. The
 * settlement-scoped mutation handler below writes the initiating endpoint's half
 * through it, and the bilateral command runtime writes the partner's half through
 * the same function with the endpoints swapped.
 *
 * WHERE THE MARK LIVES. The provenance ledger is `config._userRoutes`, mirrored
 * into the raw `_config` twin exactly as cutTradeRoute's `_cutRoutes` is: a
 * regeneration rebuilds from `_config` first, so a config-only annotation dies on
 * the first what-if. The neighbour entry carries no new key vocabulary at all; it
 * borrows `linkId` for the route identity, which is why no public projection,
 * sanitizer, or anonymous dossier grows a field because a route exists.
 *
 * Migration 193 re-proves every one of these shapes server-side before it writes,
 * so this module is the client half of a shared law, not the authority on it.
 */

import { eventTime, vetoMutation } from './mutateHelpers.js';
// THE EDGE ID COMES FROM THE ZERO-IMPORT LEAF, NEVER FROM roads/userRoutes.js.
// This module is reached statically from `mutate.js`, which the store reaches
// statically, so everything it imports rides the first-paint closure. Importing
// the id from the derivation dragged the derivation AND the 53 kB frozen-digest
// reader (spatial/distanceRead.js) into first paint and broke the constitutional
// byte ratchet. The leaf carries the identity and nothing else.
// @enforced-by tests/build/userRouteIdentityLeaf.test.js
import { userRouteEdgeId } from '../roads/userRouteIdentity.js';

/**
 * The CREATE_ROUTE event payload this writer reads. Every field is optional at the
 * type level because the writer is TOTAL over a malformed payload (it defaults each
 * one); the populated shape is re-proved server-side by migration 193.
 * @typedef {{
 *   routeId?: string,
 *   mode?: string,
 *   band?: string|null,
 *   a?: string,
 *   b?: string,
 *   createdTick?: number,
 *   selfSaveId?: string,
 *   selfName?: string,
 *   selfTier?: string|null,
 *   partnerSaveId?: string,
 *   partnerName?: string,
 *   partnerTier?: string|null,
 * }} CreateRoutePayload
 */

/**
 * The canon event this writer consumes: its prepared payload plus the journal
 * identity fields eventTime() reads. Open at the tail — a real event carries more
 * than the writer touches.
 * @typedef {{
 *   payload?: CreateRoutePayload,
 *   id?: string|number|null,
 *   timestamp?: string|null,
 *   createdAt?: string|null,
 * }} RouteMutEvent
 */

/**
 * One authored provenance row on `config._userRoutes` (the full written shape).
 * @typedef {{
 *   routeId: string,
 *   atEventId: string|number|null,
 *   atTimestamp: string|number|null,
 *   provenance: string,
 *   mode: string,
 *   createdTick: number,
 *   band: string|null,
 *   a: string,
 *   b: string,
 * }} UserRouteProvenanceRow
 */

/**
 * The settlement half this writer appends to and returns: the neighbour vocabulary
 * and the two config twins the provenance row is mirrored into. Open at the tail —
 * the writer spreads the whole settlement through unchanged and must not narrow away
 * the fields it does not touch.
 * @typedef {Record<string, unknown> & {
 *   neighbourNetwork?: unknown[],
 *   config?: Record<string, unknown> | null,
 *   _config?: Record<string, unknown> | null,
 * }} RouteMutSettlement
 */

/**
 * The neighbour-network entry for one endpoint. Only keys the existing entries
 * already use: a route must be legible to every surface that reads the network
 * without any of them learning a new word.
 * @param {{selfId:string, otherId:string, otherName:string, otherTier:string|null, routeId:string}} input
 */
export function userRouteNeighbourEntry(input) {
  return {
    id: String(input.otherId),
    linkId: input.routeId,
    name: input.otherName,
    neighbourName: input.otherName,
    tier: input.otherTier || null,
    neighbourTier: input.otherTier || null,
    relationshipType: 'neutral',
    relationshipFrom: String(input.selfId),
    relationshipTo: String(input.otherId),
    localRelationshipRole: 'neutral',
    displayRelationshipType: 'neutral',
    description: `A road chartered by hand runs between here and ${input.otherName}.`,
    bidirectional: true,
  };
}

/**
 * Append one endpoint's half of a user route: the neighbour entry plus the
 * provenance row on every config twin the settlement carries.
 *
 * @param {RouteMutSettlement} settlement
 * @param {RouteMutEvent} event
 * @param {{selfId:string, otherId:string, otherName:string, otherTier?:string|null}} endpoints
 * @returns {RouteMutSettlement}
 */
export function withUserRouteHalf(settlement, event, endpoints) {
  const payload = event?.payload || /** @type {CreateRoutePayload} */ ({});
  const routeId = String(payload.routeId || '');
  const provenanceRow = {
    routeId,
    atEventId: event?.id ?? null,
    atTimestamp: eventTime(event) ?? null,
    provenance: 'user',
    mode: String(payload.mode || 'land'),
    createdTick: Number.isFinite(payload.createdTick)
      ? Number(payload.createdTick)
      : 0,
    // The typed reach BAND, never the integer cost behind it. Two reasons, and
    // both are laws rather than taste: the digest is the authority on cost and a
    // stored copy is a derivable duplicate (DESIGN_ROUTE_LIFECYCLE section 3), and
    // `config` rides the PUBLIC projection allowlist, where an engine number has
    // no business being. The band is finite-semantics vocabulary: a word about the
    // road as it was on the day it was chartered.
    band: payload.band ? String(payload.band) : null,
    a: String(payload.a || ''),
    b: String(payload.b || ''),
  };
  const entry = userRouteNeighbourEntry({
    selfId: endpoints.selfId,
    otherId: endpoints.otherId,
    otherName: endpoints.otherName,
    otherTier: endpoints.otherTier ?? null,
    routeId,
  });
  const network = Array.isArray(settlement?.neighbourNetwork)
    ? settlement.neighbourNetwork
    : [];
  const next = /** @type {RouteMutSettlement} */ ({
    ...settlement,
    neighbourNetwork: [...network, entry],
    config: withProvenanceRow(settlement?.config, provenanceRow),
  });
  // The raw twin only exists on settlements generated through the config path;
  // mirroring into one that was never there would invent a regeneration input.
  if (settlement?._config && typeof settlement._config === 'object') {
    next._config = withProvenanceRow(settlement._config, provenanceRow);
  }
  return next;
}

/**
 * @param {Record<string, unknown> | null | undefined} config
 * @param {UserRouteProvenanceRow} row
 * @returns {Record<string, unknown>}
 */
function withProvenanceRow(config, row) {
  const base = config && typeof config === 'object'
    ? config
    : /** @type {Record<string, unknown>} */ ({});
  const rows = Array.isArray(base._userRoutes) ? base._userRoutes : [];
  return { ...base, _userRoutes: [...rows, row] };
}

/**
 * CREATE_ROUTE (directive 3) — the initiating endpoint's half.
 *
 * The payload is prepared by the pure derivation leaf (domain/roads/userRoutes.js)
 * before the event is ever built, so this handler validates identity rather than
 * recomputing geography: a payload whose route id is not the deterministic edge id
 * for its own endpoints is refused outright, which is the same refusal migration
 * 193 raises against the same disagreement.
 *
 * @param {RouteMutSettlement} settlement
 * @param {RouteMutEvent} event
 * @returns {RouteMutSettlement | import('./mutateHelpers.js').MutationVeto}
 */
export function createRoute(settlement, event) {
  const payload = event?.payload || /** @type {CreateRoutePayload} */ ({});
  const selfId = String(payload.selfSaveId || '');
  const otherId = String(payload.partnerSaveId || '');
  const otherName = String(payload.partnerName || '');
  const mode = String(payload.mode || '');
  if (!selfId || !otherId || !otherName || selfId === otherId) {
    return vetoMutation('route_endpoints_incomplete');
  }
  if (mode !== 'land' && mode !== 'water') {
    return vetoMutation('route_mode_unsupported', mode);
  }
  const expected = userRouteEdgeId(selfId, otherId, mode);
  if (String(payload.routeId || '') !== expected) {
    return vetoMutation('route_identity_mismatch', expected);
  }
  return withUserRouteHalf(settlement, event, {
    selfId,
    otherId,
    otherName,
    otherTier: payload.partnerTier ?? null,
  });
}
