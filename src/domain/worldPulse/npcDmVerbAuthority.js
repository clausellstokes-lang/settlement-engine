/**
 * domain/worldPulse/npcDmVerbAuthority.js — W-H4: WHAT A DM VERB MAY READ, AND WHOSE
 * AUTHORITY IT IS ACTING UNDER.
 *
 * A PURE LEAF OF THE DM-VERB WRITER FAMILY (ruling R-BLD-4: the single-writer law reads
 * ONE WRITER FAMILY, never one file). npcDmVerbs.js remains the family HEAD and the ONLY
 * writer; nothing in this file writes a ledger, mints a hold, or moves a person. It
 * answers questions the head asks before it writes:
 *
 *   WHO IS THIS — `findIdentity` reads the durable identity out of EITHER ledger map
 *     through ONE lookup, so no verb can end up with three reads that disagree about what
 *     "present" means.
 *   MAY THIS ACT PROCEED — the custody predicates. A foreign hold and the H1 person row
 *     must name the SAME physical cut before a pardon may move anybody; a hold row without
 *     its exact held errand is split authority and the sovereign act must refuse as one
 *     transaction rather than publish half a release.
 *   UNDER WHOSE RULES — `withEnvoyCleanupAuthority` / `restoreRuleConfiguration`. An
 *     extant exact hold is lifecycle authority even if the realm later switches its six
 *     envoy creation rules dark. Those rules are lit ONLY on the speculative pure value
 *     handed to the canonical cleanup writers, and the caller's own configuration is put
 *     back before anything is published. NO new hold or errand can be created through this
 *     seam — it widens nothing, it only lets an existing row be cleaned up.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation. Every predicate
 * is total on garbage — an unknown id, a malformed hold row or an absent continuation all
 * return false or null rather than throwing.
 *
 * NOT A MOVEMENT SITE. This leaf deliberately carries no leg pricing, no arrival clock and
 * no route-plan normalization; it only COMPARES an already-priced leg against a person's
 * recorded transit. Keep it that way — `tests/lint/namedPersonTransitTotality.walker.test.js`
 * requires every file that prices or advances a named-person leg to be registered in its
 * MOVEMENT_SITES manifest, and the head (`npcDmVerbs.js`) is the registered delegate.
 *
 * @enforced-by tests/domain/npcDmVerbs.test.js
 */

import { npcLedgerOf } from './npcLedger.js';
import { ENVOY_REQUIRED_RULES, envoyErrandsOf } from './envoyErrand.js';

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/** @param {unknown} v @returns {number} a non-negative integer tick */
function tickOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/** An extant exact hold is lifecycle authority even if the realm switches its six
 * creation rules dark later. We light those rules only on the speculative pure value
 * handed to the canonical cleanup writers, then restore the caller's configuration
 * before publishing. No new hold or errand can be created through this seam. */
export function withEnvoyCleanupAuthority(worldState) {
  const rules = asObject(worldState.simulationRules);
  if (ENVOY_REQUIRED_RULES.every((key) => rules[key] === true)) return worldState;
  return {
    ...worldState,
    simulationRules: {
      ...rules,
      ...Object.fromEntries(ENVOY_REQUIRED_RULES.map((key) => [key, true])),
    },
  };
}

/** Put the caller's exact rule configuration back after speculative lifecycle cleanup. */
export function restoreRuleConfiguration(worldState, originalWorldState) {
  if (worldState === originalWorldState) return worldState;
  if (Object.prototype.hasOwnProperty.call(originalWorldState, 'simulationRules')) {
    if (worldState.simulationRules === originalWorldState.simulationRules) return worldState;
    return { ...worldState, simulationRules: originalWorldState.simulationRules };
  }
  if (!Object.prototype.hasOwnProperty.call(worldState, 'simulationRules')) return worldState;
  const next = { ...worldState };
  delete next.simulationRules;
  return next;
}

/**
 * Find a durable identity in either map. Returns the record, which map held it, and the
 * host it was under, so every verb reads the ledger through ONE lookup rather than three
 * that could disagree about what "present" means.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string} wnpcId
 * @returns {{ record: Record<string, unknown>, wasPlaced: boolean, host: string,
 *   edges: ReadonlyArray<Record<string, unknown>> } | null}
 */
export function findIdentity(worldState, wnpcId) {
  const ledger = npcLedgerOf(worldState);
  const id = text(wnpcId);
  const placed = Object.prototype.hasOwnProperty.call(ledger.placed, id);
  const roaming = Object.prototype.hasOwnProperty.call(ledger.roamers, id);
  if (!placed && !roaming) return null;
  const record = /** @type {Record<string, unknown>} */ (
    /** @type {unknown} */ (placed ? ledger.placed[id] : ledger.roamers[id])
  );
  const rawEdges = ledger.exclusions[id] || [];
  return {
    record,
    wasPlaced: placed,
    host: placed ? text(record.hostSettlementId) : '',
    edges: /** @type {ReadonlyArray<Record<string, unknown>>} */ (
      /** @type {unknown} */ (rawEdges)
    ),
  };
}

/** The last physically supportable settlement for an assignment departure.
 * @param {{wasPlaced:boolean,host:string,record:Record<string,unknown>}} found
 * @returns {string} */
export function assignmentOrigin(found) {
  if (found.wasPlaced) return found.host;
  const record = asObject(found.record);
  if (record.whereaboutsUnknown === true || Object.keys(asObject(record.transit)).length > 0) return '';
  return text(asObject(record.residency).settlementId)
    || text(asObject(record.originRef).settlementId);
}

/** Structural equality for the four-field normalized H3/J4 leg conflict token.
 * @param {unknown} left @param {unknown} right @returns {boolean} */
export function sameTransit(left, right) {
  const a = asObject(left);
  const b = asObject(right);
  return text(a.fromId) === text(b.fromId)
    && text(a.toId) === text(b.toId)
    && tickOf(a.departTick) === tickOf(b.departTick)
    && tickOf(a.arrivalTick) === tickOf(b.arrivalTick)
    && (a.hidden === true) === (b.hidden === true);
}

/** The exact active held errand named by a foreign-custody row. Reading by BOTH
 * person and errand prevents either ledger from lending authority to a stale peer. */
export function heldErrandFor(worldState, hold) {
  const row = asObject(hold);
  const errandId = text(row.errandId);
  const npcId = text(row.npcId);
  const encounterId = text(row.encounterId);
  if (!errandId || !npcId || !encounterId) return null;
  const errand = envoyErrandsOf(worldState)
    .find((candidate) => text(candidate.id) === errandId && text(candidate.npcId) === npcId);
  const encounters = Array.isArray(errand?.encounters) ? errand.encounters : [];
  const latest = asObject(encounters.at(-1));
  return errand?.state === 'held'
    && text(latest.id) === encounterId
    && text(latest.resolution) === 'held'
    ? errand
    : null;
}

/** Did H1 adopt the first freshly-priced release leg at the release tick? */
export function npcOwnsReleasedLeg(worldState, wnpcId, routePlan, tick) {
  const found = findIdentity(worldState, wnpcId);
  const firstLeg = Array.isArray(asObject(routePlan).legs)
    ? asObject(routePlan).legs[0]
    : null;
  return !!found && !found.wasPlaced && !!firstLeg
    && tickOf(found.record.sinceTick) === tickOf(tick)
    && sameTransit(found.record.transit, firstLeg);
}

/** The hold row and H1 must name the same physical cut before a pardon may move the
 * person. Settlement halls may be placements; road meetings remain exact old legs. */
export function h1SupportsForeignHold(found, hold) {
  if (!found) return false;
  const row = asObject(hold);
  const venueId = text(row.venueId);
  const venue = asObject(row.venueRef);
  const continuation = asObject(row.continuation);
  const position = asObject(continuation.positionRef);
  const legs = Array.isArray(continuation.journeyLegs) ? continuation.journeyLegs : [];
  const leg = legs[tickOf(position.legIndex)];
  const projectedNode = text(position.progressBand) === 'arrived'
    ? text(position.toId)
    : text(position.fromId);
  const exactInterruptedLeg = !!leg
    && projectedNode === venueId
    && sameTransit(found.record.transit, leg);
  const positionClockIsOwned = tickOf(found.record.sinceTick) <= tickOf(row.heldSinceTick);
  if (text(venue.kind) === 'route_node') {
    return positionClockIsOwned && !found.wasPlaced && exactInterruptedLeg;
  }
  if (text(venue.kind) !== 'settlement' || text(venue.settlementId) !== venueId) return false;
  return positionClockIsOwned && (
    (found.wasPlaced && found.host === venueId)
    || text(asObject(found.record.residency).settlementId) === venueId
    || (!found.wasPlaced && exactInterruptedLeg)
  );
}

/** Has neither custody nor envoy mutation disturbed the exact pre-release H1 row? */
export function sameNpcSnapshot(worldState, wnpcId, prior) {
  const current = findIdentity(worldState, wnpcId);
  return !!current
    && current.wasPlaced === prior.wasPlaced
    && current.host === prior.host
    && JSON.stringify(current.record) === JSON.stringify(prior.record);
}
