/**
 * envoyDiplomacy.js — WR-7a's integration leaf.
 *
 * `envoyErrand.js` is deliberately blind to rosters, routes, rumors, and war
 * truth. This module supplies those facts at the boundary: it casts one real H1
 * person, prices a lived J4 journey, freezes the already-earned WR-5 ruling,
 * and converts only rumors available where the traveler stands into one-step
 * picture changes. It owns no ledger.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { beliefRecord, strengthBandOf } from './beliefMap.js';
import {
  ENVOY_STRENGTH_BANDS,
  envoyDiplomacyActive,
  envoyErrandIdForOffer,
  envoyErrandForOffer,
  envoyErrandsOf,
  mintEnvoyErrand,
  normalizeEnvoyAcceptance,
  normalizeEnvoyPeaceOffer,
} from './envoyErrand.js';
import {
  normalizeParlayTermSheet,
} from './negotiationPictures.js';
import { deriveSettlementPressures, pressureIndex } from './pressureModel.js';
import {
  buildPressureSummary,
  getRelationshipSettlements,
  relationshipKeyFromEdge,
  settlementStrength,
} from './relationshipEvolution.js';
import { censusProactiveSelfParlays } from './envoyEncounter.js';
import { envoyCandidate } from './envoyCasting.js';
import {
  graduateNpc,
  moveNpcRecord,
  npcLedgerOf,
} from './npcLedger.js';
import { COVERT_ENVOY_KIND } from './routeNetworkConsumers.js';
import { livedHopToward, livedLegTicks } from './routeNetworkConsumersTransit.js';
import {
  PRESSURE_BANDS,
  RATIO_BANDS,
  STORES_FROM_PRESSURE,
  buildEnvoyNegotiationPicture,
} from './envoyNegotiationPictureBuilder.js';


export const ENVOY_TRANSPORT_RETURN_KIND = 'envoy_transport_return';

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value */
function wholeTick(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : null;
}

/** WR-7a admitted opaque legacy cargo; only a versioned WR-7b sheet carries
 * treaty authority. Keep that compatibility branch without treating it as a
 * malformed attempt at the new schema. */
function carriedTermSheetRead(value) {
  if (value == null || !Object.prototype.hasOwnProperty.call(asObject(value), 'schemaVersion')) {
    return { versioned: false, sheet: null };
  }
  const sheet = normalizeParlayTermSheet(value);
  return { versioned: true, sheet };
}

/** The exact persisted route leg named by an errand's current position cursor. */
function currentEnvoyLeg(errand) {
  const row = asObject(errand);
  const position = asObject(row.positionRef);
  const journey = text(position.journey);
  const legIndex = wholeTick(position.legIndex);
  if (!journey || legIndex == null) return null;
  const legs = (Array.isArray(row.legs) ? row.legs : [])
    .map(asObject)
    .filter((leg) => text(leg.journey) === journey);
  return legs[legIndex] || null;
}

/** Does an H1 leg still carry the exact physical position owned by this errand? */
function sameEnvoyLeg(transit, leg) {
  const current = asObject(transit);
  const expected = asObject(leg);
  return !!text(current.fromId)
    && text(current.fromId) === text(expected.fromId)
    && text(current.toId) === text(expected.toId)
    && wholeTick(current.departTick) === wholeTick(expected.departTick)
    && wholeTick(current.arrivalTick) === wholeTick(expected.arrivalTick);
}

/** One conserved H1 position, including which side of the ledger owns it. */
function envoyNpcPosition(worldState, npcId) {
  const ledger = npcLedgerOf(worldState);
  if (Object.prototype.hasOwnProperty.call(ledger.placed, npcId)) {
    return {
      placed: true,
      record: /** @type {Record<string,unknown>} */ (
        /** @type {unknown} */ (ledger.placed[npcId])
      ),
    };
  }
  if (Object.prototype.hasOwnProperty.call(ledger.roamers, npcId)) {
    return {
      placed: false,
      record: /** @type {Record<string,unknown>} */ (
        /** @type {unknown} */ (ledger.roamers[npcId])
      ),
    };
  }
  return null;
}

/** Terminal projection may consume only the exact, otherwise-unclaimed active leg. */
function terminalOwnsTransit(position, errand, closedTick) {
  if (!position || position.placed || closedTick == null) return false;
  const record = asObject(position.record);
  return record.whereaboutsUnknown !== true
    && Object.keys(asObject(record.residency)).length === 0
    && Object.keys(asObject(record.dmAssignment)).length === 0
    && Number(record.sinceTick || 0) <= closedTick
    && sameEnvoyLeg(record.transit, currentEnvoyLeg(errand));
}

/** A placement can seed one errand leg only while no other lifecycle owns it. */
function unclaimedPlacementAt(position, settlementId, notAfterTick) {
  if (!position?.placed || notAfterTick == null) return false;
  const record = asObject(position.record);
  return text(record.hostSettlementId) === text(settlementId)
    && Number(record.sinceTick || 0) <= notAfterTick
    && record.whereaboutsUnknown !== true
    && Object.keys(asObject(record.residency)).length === 0
    && Object.keys(asObject(record.transit)).length === 0
    && Object.keys(asObject(record.dmAssignment)).length === 0;
}

/** Legacy H1 roamers without H3 facets still stand at their authored origin. */
function unclaimedOriginAt(position, settlementId, notAfterTick) {
  if (!position || position.placed || notAfterTick == null) return false;
  const record = asObject(position.record);
  return text(asObject(record.originRef).settlementId) === text(settlementId)
    && Number(record.sinceTick || 0) <= notAfterTick
    && record.whereaboutsUnknown !== true
    && Object.keys(asObject(record.residency)).length === 0
    && Object.keys(asObject(record.transit)).length === 0
    && Object.keys(asObject(record.dmAssignment)).length === 0;
}

/** The exact road position frozen into the latest encounter still owns H1. */
function transitMatchesEncounterPosition(position, encounter) {
  if (!position || position.placed) return false;
  const record = asObject(position.record);
  const prior = asObject(encounter?.priorPosition);
  const encounteredTick = wholeTick(encounter?.encounteredTick);
  return encounteredTick != null
    && Number(record.sinceTick || 0) <= encounteredTick
    && record.whereaboutsUnknown !== true
    && Object.keys(asObject(record.residency)).length === 0
    && Object.keys(asObject(record.dmAssignment)).length === 0
    && text(asObject(record.transit).fromId) === text(prior.fromId)
    && text(asObject(record.transit).toId) === text(prior.toId);
}

/** The active errand may advance only the exact H1 position it already owns. */
function activeOwnsLeg(position, errand, journeyLegs, legIndex, leg) {
  if (!position || !leg || legIndex == null) return false;
  const record = asObject(position.record);
  const unclaimedRoamer = !position.placed
    && record.whereaboutsUnknown !== true
    && Object.keys(asObject(record.residency)).length === 0
    && Object.keys(asObject(record.dmAssignment)).length === 0;
  const latestEncounter = Array.isArray(errand.encounters)
    ? asObject(errand.encounters.at(-1))
    : {};
  const releasedTick = wholeTick(errand.releasedTick);
  const resumedAtEncounter = ['resumed', 'plant_resumed'].includes(text(latestEncounter.resolution))
    && releasedTick != null
    && text(leg.fromId) === text(latestEncounter.venueId);
  if (resumedAtEncounter && (
    unclaimedPlacementAt(position, text(latestEncounter.venueId), releasedTick)
    || transitMatchesEncounterPosition(position, latestEncounter)
  )) return true;
  const returningFromFieldParlay = text(leg.journey) === 'return'
    && text(latestEncounter.resolution) === 'parlaying'
    && text(leg.fromId) === text(latestEncounter.venueId);
  if (returningFromFieldParlay && (
    unclaimedPlacementAt(position, text(latestEncounter.venueId), wholeTick(errand.returnStartedTick))
    || transitMatchesEncounterPosition(position, latestEncounter)
  )) return true;
  if (unclaimedRoamer && sameEnvoyLeg(record.transit, leg)) return true;
  if (legIndex > 0 && unclaimedRoamer
    && sameEnvoyLeg(record.transit, journeyLegs[legIndex - 1])) return true;
  if (legIndex === 0 && text(leg.journey) === 'return' && unclaimedRoamer) {
    const finalOutboundLeg = (Array.isArray(errand.legs) ? errand.legs : [])
      .map(asObject)
      .filter((candidate) => text(candidate.journey) === 'outbound')
      .at(-1);
    if (sameEnvoyLeg(record.transit, finalOutboundLeg)) return true;
  }
  if (legIndex !== 0) return false;
  const journey = text(leg.journey);
  const startSettlementId = journey === 'return'
    ? text(errand.returnOriginId || errand.to)
    : text(errand.from);
  const startTick = wholeTick(journey === 'return' ? errand.returnStartedTick : errand.departedTick);
  return unclaimedPlacementAt(position, startSettlementId, startTick)
    || unclaimedOriginAt(position, startSettlementId, startTick);
}

/** Resolve either supported snapshot index without fabricating an item. */
function snapshotItem(snapshot, id) {
  const key = text(id);
  if (!key) return null;
  if (snapshot?.byId instanceof Map) return snapshot.byId.get(key) || null;
  const rows = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  return rows.find((row) => text(asObject(row).id) === key) || null;
}

/** @param {unknown} item */
function settlementOf(item) {
  const row = asObject(item);
  const save = asObject(row.save);
  const settlement = asObject(row.settlement || save.settlement);
  return Object.keys(settlement).length ? settlement : row;
}

/** A typed settlement may speak only with an authored display name. */
function settlementName(snapshot, id) {
  const item = snapshotItem(snapshot, id);
  const row = asObject(item);
  const settlement = settlementOf(item);
  const name = text(settlement.name || row.name || asObject(row.save).name);
  return name && name !== id ? name : '';
}

/**
 * Price one complete lived journey through J4's shared named-person seam.
 * Every subsequent edge opens only after the prior edge has landed, matching
 * `advanceLivedTraveller`'s no-second-hop-on-arrival-tick law.
 *
 * ES-1 — THE ONE-WORD KIND FORK, and it is one word because the franchise it opens is
 * one word. `mayUseHiddenPaths` FAILS CLOSED on an unrecognised traveller kind, and this
 * solve has always passed `'envoy'`, which is not in `HIDDEN_PATH_KINDS` — so every
 * errand the estate has ever priced took the open road, and it did so structurally
 * rather than by anyone deciding it. A covert mission is the first errand the design says
 * may walk a way the realm has forgotten (ES §1), and the ONLY thing that changes is the
 * kind this solve hands the hop reader. `covert` is compared `=== true`, so every caller
 * that does not ask — which is all of them today — still gets the open road.
 *
 * ⚠ AND THE OPEN ERRAND STILL CANNOT, WHICH IS THE HALF WORTH PINNING. The franchise is
 * a property of the KIND, not of the caller: an ordinary errand passing `covert: false`
 * and a covert one passing `covert: true` differ by exactly which member of a closed
 * two-word set reaches `mayUseHiddenPaths`, and the open one is still refused.
 * @param {{worldState?:Record<string,unknown>, fromId?:unknown, toId?:unknown, tick?:number,
 *   journey?:string, season?:string|null, covert?:boolean}} [args]
 */
export function buildEnvoyRoutePlan({
  worldState,
  fromId,
  toId,
  tick,
  journey = 'outbound',
  season = null,
  covert = false,
} = {}) {
  const from = text(fromId);
  const to = text(toId);
  const start = wholeTick(tick);
  if (!envoyDiplomacyActive(worldState) || !from || !to || from === to || start == null
    || !['outbound', 'return'].includes(journey)) return null;
  const legs = [];
  const seen = new Set([from]);
  let cursor = from;
  let departTick = start;
  const maxLegs = Math.max(1, Object.keys(asObject(asObject(getSpatialLedger(worldState, 'routeNetwork')).edges)).length + 1);
  while (cursor !== to && legs.length < maxLegs) {
    const reading = livedHopToward({
      worldState,
      fromId: cursor,
      destId: to,
      kind: covert === true ? COVERT_ENVOY_KIND : 'envoy',
      season,
    });
    if (reading.verdict !== 'hop' || !reading.hop || seen.has(String(reading.hop.toId))) return null;
    const duration = livedLegTicks({ worldState, fromId: cursor, hop: reading.hop, season });
    const arrivalTick = departTick + Math.max(1, duration);
    const routeId = text(reading.hop.edgeId);
    if (!routeId) return null;
    legs.push({
      fromId: cursor,
      toId: String(reading.hop.toId),
      departTick,
      arrivalTick,
      journey,
      routeRef: { id: routeId },
    });
    cursor = String(reading.hop.toId);
    seen.add(cursor);
    departTick = arrivalTick + 1;
  }
  if (cursor !== to || !legs.length) return null;
  return {
    legs,
    positionRef: {
      journey,
      legIndex: 0,
      fromId: legs[0].fromId,
      toId: legs[0].toId,
      progressBand: 'departed',
    },
    expectedReturnTick: Number(legs.at(-1).arrivalTick),
  };
}

/** A conservative round-trip window used before WR-7b opens the actual return. */
function expectedRoundTripTick(worldState, fromId, toId, outbound, season) {
  const outboundHome = Number(outbound?.legs?.at?.(-1)?.arrivalTick);
  if (!Number.isFinite(outboundHome)) return null;
  const returning = buildEnvoyRoutePlan({
    worldState,
    fromId: toId,
    toId: fromId,
    tick: outboundHome + 1,
    journey: 'return',
    season,
  });
  return returning ? Number(returning.expectedReturnTick) : null;
}

/** Freeze the offerer's own true-at-departure picture into closed WR-7a words. */
export function envoyDeparturePicture(decision, {
  snapshot = null,
  worldState = null,
  settlementId = null,
} = {}) {
  const receipt = asObject(asObject(decision).offererTermination).receipt;
  const read = asObject(receipt);
  const offererId = text(settlementId || asObject(decision).offererId);
  const ownItem = snapshotItem(snapshot, offererId);
  const storesPressure = text(asObject(asObject(read.homeFrontComponents).stores).band);
  const morale = text(read.costToContinueBand);
  const cause = text(read.causeState);
  const believedRatio = text(read.believedBalanceBand);
  const liveSnapshot = { ...asObject(snapshot), worldState };
  const pressures = ownItem
    ? pressureIndex(deriveSettlementPressures(liveSnapshot))
    : null;
  const ownStrengthBand = ownItem
    ? strengthBandOf(settlementStrength(ownItem, buildPressureSummary(pressures, offererId)))
    : -1;
  if (!Object.hasOwn(STORES_FROM_PRESSURE, storesPressure)
    || !ENVOY_STRENGTH_BANDS[ownStrengthBand]
    || !PRESSURE_BANDS.includes(morale)
    || !['dissolved', 'anchor_unavailable', 'live'].includes(cause)
    || !RATIO_BANDS.includes(believedRatio)) return null;
  return {
    storesBand: STORES_FROM_PRESSURE[storesPressure],
    strengthBand: ENVOY_STRENGTH_BANDS[ownStrengthBand],
    moraleExhaustionBand: morale,
    foundingCauseStatus: cause,
    believedRatioBand: believedRatio,
  };
}


/**
 * Convert one already-accepted bilateral decision into a physical errand.
 * Work is transactional: a failed mint or movement returns the original world.
 * @param {{worldState?:Record<string,unknown>, snapshot?:unknown, outcome?:unknown,
 *   decision?:unknown, tick?:number, season?:string|null}} [args]
 */
export function dispatchAcceptedPeaceEnvoy({
  worldState,
  snapshot,
  outcome,
  decision,
  tick,
  season = null,
} = {}) {
  if (!envoyDiplomacyActive(worldState) || asObject(decision).accepted !== true) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark_or_unaccepted' };
  }
  const offer = normalizeEnvoyPeaceOffer(outcome);
  if (!offer) return { worldState, changed: false, evidence: [], errand: null, reason: 'invalid_offer' };
  const existing = envoyErrandForOffer(worldState, offer);
  if (existing) {
    return { worldState, changed: false, evidence: [], errand: existing, reason: 'duplicate_episode' };
  }
  const payload = asObject(offer.proposalPayload);
  const fromId = String(payload.offererId);
  const toId = String(payload.targetId);
  const atTick = wholeTick(tick);
  const fromItem = snapshotItem(snapshot, fromId);
  const fromSettlement = settlementOf(fromItem);
  const candidate = envoyCandidate(worldState, fromId, fromSettlement);
  const picture = envoyDeparturePicture(decision, {
    snapshot,
    worldState,
    settlementId: fromId,
  });
  const errandId = envoyErrandIdForOffer(offer);
  const negotiationPicture = buildEnvoyNegotiationPicture({
    worldState,
    snapshot,
    offer,
    partyId: fromId,
    carrierKind: 'envoy',
    carrierId: errandId,
    tick: atTick,
    termination: asObject(decision).offererTermination,
  });
  // The receiving court's own frozen picture, carried by the court rather than
  // the envoy and sourced from the TARGET's own termination read. The two are
  // minted as a pair because acceptance is compared on each party's own-picture
  // valuation (K4): a dispatch carrying one picture has no second party to
  // evaluate against, and the errand writer refuses it.
  const targetCourtPicture = buildEnvoyNegotiationPicture({
    worldState,
    snapshot,
    offer,
    partyId: toId,
    carrierKind: 'court',
    carrierId: toId,
    tick: atTick,
    termination: asObject(decision).termination,
  });
  const standing = asObject(asObject(asObject(outcome).metadata).coalitionStandingDecision);
  const selfParlay = standing.decision === 'exit'
    ? censusProactiveSelfParlays({
        worldState,
        relationshipRows: [{
          partyId: fromId,
          targetId: toId,
          relationshipKey: String(offer.relationshipKey),
        }],
      }).find((row) => row.partyId === fromId && row.targetId === toId)
    : null;
  const purpose = selfParlay
    && String(standing.partyId || '') === fromId
    && String(standing.targetId || '') === toId
    ? 'self_parlay'
    : 'sue';
  const routePlan = buildEnvoyRoutePlan({ worldState, fromId, toId, tick: atTick, journey: 'outbound', season });
  const expectedReturnTick = expectedRoundTripTick(worldState, fromId, toId, routePlan, season);
  if (atTick == null || !candidate || !picture || !negotiationPicture
    || !targetCourtPicture || !routePlan || expectedReturnTick == null) {
    return { worldState, changed: false, evidence: [], errand: null, reason: !candidate ? 'no_envoy' : !routePlan ? 'no_route' : 'invalid_departure_picture' };
  }
  routePlan.expectedReturnTick = expectedReturnTick;
  const seed = text(fromSettlement.seed || asObject(fromSettlement.config).seed) || fromId;
  const graduated = graduateNpc({
    worldState,
    settlementSeed: seed,
    settlementId: fromId,
    rosterIdentity: candidate.identity,
    tick: atTick,
    hostSettlementId: fromId,
  });
  if (!graduated.wnpcId) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'no_durable_envoy' };
  }
  const acceptance = {
    ...asObject(decision),
    offererInheritedDemand: asObject(outcome).metadata
      ? asObject(asObject(outcome).metadata).inheritedWarDemand
      : null,
  };
  const minted = mintEnvoyErrand({
    worldState: graduated.worldState,
    outcome,
    acceptance,
    npcId: graduated.wnpcId,
    npcName: candidate.identity.name,
    fromName: settlementName(snapshot, fromId),
    toName: settlementName(snapshot, toId),
    snapshot: picture,
    negotiationPicture,
    targetCourtPicture,
    purpose,
    routePlan,
    tick: atTick,
  });
  if (!minted.changed || !minted.errand) {
    return { worldState, changed: false, evidence: [], errand: minted.errand, reason: minted.reason };
  }
  const firstLeg = asObject(routePlan.legs[0]);
  const moved = moveNpcRecord({
    worldState: /** @type {Record<string, unknown>} */ (minted.worldState),
    wnpcId: graduated.wnpcId,
    hostSettlementId: null,
    patch: {
      residency: null,
      transit: {
        fromId: firstLeg.fromId,
        toId: firstLeg.toId,
        departTick: firstLeg.departTick,
        arrivalTick: firstLeg.arrivalTick,
      },
    },
    sinceTick: atTick,
  });
  if (!moved.changed) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'npc_transit_refused' };
  }
  return {
    worldState: moved.worldState,
    changed: true,
    evidence: minted.evidence,
    errand: minted.errand,
    reason: 'dispatched',
  };
}

/** The settlement whose rumor ledger the current leg exposes. */
function exposedSettlementId(errand) {
  const position = asObject(errand.positionRef);
  const progress = text(position.progressBand);
  return ['near', 'arrived'].includes(progress) ? text(position.toId) : text(position.fromId);
}

/** @param {unknown} record */
function arrivedRumor(record, tick, fromId, toId) {
  const row = asObject(record);
  const arrivalTick = wholeTick(row.arrivalTick);
  const parties = Array.isArray(asObject(row.content).partyIds)
    ? asObject(row.content).partyIds.map(String)
    : [];
  return arrivalTick != null && arrivalTick <= tick
    && (parties.includes(fromId) || parties.includes(toId));
}

/**
 * Moving-position rumor adapter. It requires both a real arrived telling and
 * two existing beliefs at that location; it never fills either gap from truth.
 */
export function envoyRumorPatchFor(worldState, errand, tick) {
  const atTick = wholeTick(tick);
  const fromId = text(errand?.from);
  const toId = text(errand?.to);
  const observerId = exposedSettlementId(asObject(errand));
  if (atTick == null || !observerId || !fromId || !toId || [fromId, toId].includes(observerId)) return null;
  const originBelief = beliefRecord(worldState, observerId, fromId);
  const targetBelief = beliefRecord(worldState, observerId, toId);
  if (!originBelief || !targetBelief
    || !Number.isFinite(originBelief.strengthBand)
    || !Number.isFinite(targetBelief.strengthBand)) return null;
  const ledger = asObject(asObject(getSpatialLedger(worldState, 'rumorLedgers'))[observerId]);
  const rumors = Object.values(ledger)
    .map(asObject)
    .filter((row) => arrivedRumor(row, atTick, fromId, toId))
    .sort((left, right) => (Number(right.arrivalTick) - Number(left.arrivalTick))
      || compareCodepoint(String(left.eventRef || ''), String(right.eventRef || '')));
  const rumor = rumors[0];
  const sourceEventId = text(rumor?.eventRef);
  if (!sourceEventId) return null;
  const gap = Math.round(Number(originBelief.strengthBand)) - Math.round(Number(targetBelief.strengthBand));
  const heardBand = gap <= -2 ? 'far_behind' : gap === -1 ? 'behind'
    : gap === 0 ? 'matched' : gap === 1 ? 'ahead' : 'far_ahead';
  const currentBand = text(asObject(errand.snapshot).believedRatioBand);
  const currentIndex = RATIO_BANDS.indexOf(currentBand);
  const heardIndex = RATIO_BANDS.indexOf(heardBand);
  if (currentIndex < 0 || heardIndex < 0 || currentIndex === heardIndex) return null;
  return {
    sourceEventId,
    field: 'believedRatioBand',
    direction: heardIndex > currentIndex ? 'rise' : 'fall',
  };
}

/** Keep the H1 person's one transit record aligned to the errand writer. */
export function syncEnvoyNpcTransit(worldState, errand, tick, encounterVenueRef = null) {
  if (!envoyDiplomacyActive(worldState) || !errand) return worldState;
  const state = text(errand.state);
  const npcId = text(errand.npcId);
  const atTick = wholeTick(tick) ?? 0;
  if (!npcId) return worldState;
  if (state === 'travelling' || state === 'returning') {
    const position = asObject(errand.positionRef);
    const journeyLegs = (Array.isArray(errand.legs) ? errand.legs : [])
      .map(asObject)
      .filter((leg) => text(leg.journey) === text(position.journey));
    const legIndex = wholeTick(position.legIndex);
    const leg = legIndex == null ? null : journeyLegs[legIndex];
    const npcPosition = envoyNpcPosition(worldState, npcId);
    if (!leg || !activeOwnsLeg(npcPosition, errand, journeyLegs, legIndex, leg)) return worldState;
    if (!npcPosition.placed && sameEnvoyLeg(npcPosition.record.transit, leg)) return worldState;
    return moveNpcRecord({
      worldState,
      wnpcId: npcId,
      hostSettlementId: null,
      patch: {
        residency: null,
        whereaboutsUnknown: null,
        transit: {
          fromId: leg.fromId,
          toId: leg.toId,
          departTick: leg.departTick,
          arrivalTick: leg.arrivalTick,
        },
      },
      sinceTick: atTick,
    }).worldState;
  }
  if (state === 'intercepted' || state === 'held') {
    const encounters = Array.isArray(errand.encounters) ? errand.encounters : [];
    const latest = asObject(encounters.at(-1));
    const venue = asObject(encounterVenueRef);
    const venueId = text(latest.venueId);
    const settlementVenue = text(venue.kind) === 'settlement'
      && text(venue.settlementId) === venueId;
    const routeVenue = text(venue.kind) === 'route_node'
      && text(venue.nodeId) === venueId
      && text(venue.routeId) === text(latest.routeId);
    const position = envoyNpcPosition(worldState, npcId);
    if (!position || (!settlementVenue && !routeVenue)) return worldState;
    // A road custody row leaves the person on the exact interrupted leg. The
    // hold ledger carries the typed route-node venue; H1 has no settlement to
    // invent there.
    if (routeVenue) return worldState;
    const authorityTick = wholeTick(latest.encounteredTick);
    if (unclaimedPlacementAt(position, venueId, authorityTick)) return worldState;
    if (!transitMatchesEncounterPosition(position, latest)) return worldState;
    return moveNpcRecord({
      worldState,
      wnpcId: npcId,
      hostSettlementId: venueId,
      patch: { residency: null, transit: null, whereaboutsUnknown: null },
      sinceTick: atTick,
    }).worldState;
  }
  if (state === 'parlaying') {
    const position = envoyNpcPosition(worldState, npcId);
    if (!position) return worldState;
    const encounters = Array.isArray(errand.encounters) ? errand.encounters : [];
    const latest = asObject(encounters.at(-1));
    const encounterParlay = text(latest.id) === text(errand.parlayId)
      && text(latest.resolution) === 'parlaying';
    if (encounterParlay) {
      const venue = asObject(encounterVenueRef);
      const venueId = text(latest.venueId);
      const settlementVenue = text(venue.kind) === 'settlement'
        && text(venue.settlementId) === venueId;
      const routeVenue = text(venue.kind) === 'route_node'
        && text(venue.nodeId) === venueId
        && text(venue.routeId) === text(latest.routeId);
      if (routeVenue) return worldState;
      if (!settlementVenue) return worldState;
      const parlayTick = wholeTick(errand.parlayTick);
      if (unclaimedPlacementAt(position, venueId, parlayTick)) return worldState;
      if (!transitMatchesEncounterPosition(position, latest)) return worldState;
      return moveNpcRecord({
        worldState,
        wnpcId: npcId,
        hostSettlementId: venueId,
        patch: { residency: null, transit: null, whereaboutsUnknown: null },
        sinceTick: atTick,
      }).worldState;
    }
    const finalOutboundLeg = (Array.isArray(errand.legs) ? errand.legs : [])
      .map(asObject)
      .filter((leg) => text(leg.journey) === 'outbound')
      .at(-1);
    const parlayTick = wholeTick(errand.parlayTick);
    if (unclaimedPlacementAt(position, text(errand.to), parlayTick)) return worldState;
    if (position.placed || !sameEnvoyLeg(position.record.transit, finalOutboundLeg)) return worldState;
    return moveNpcRecord({
      worldState,
      wnpcId: npcId,
      hostSettlementId: text(errand.to),
      patch: { residency: null, transit: null, whereaboutsUnknown: null },
      sinceTick: atTick,
    }).worldState;
  }
  if (state === 'home') {
    // HOME IS AN ARCHIVE ROW AFTER THIS FIRST PROJECTION. It may close the exact return
    // leg it owned, or acknowledge a person already home, but it must never pull a person
    // back after a later ruling moved them elsewhere. Exact leg + closure clock is the
    // one-shot ownership token; once placement consumes it, the archive releases H1.
    const position = envoyNpcPosition(worldState, npcId);
    if (!position) return worldState;
    if (position.placed && text(position.record.hostSettlementId) === text(errand.from)) {
      return worldState;
    }
    if (!terminalOwnsTransit(position, errand, wholeTick(errand.closedTick))) return worldState;
    return moveNpcRecord({
      worldState,
      wnpcId: npcId,
      hostSettlementId: text(errand.from),
      patch: { residency: null, transit: null, whereaboutsUnknown: null },
      sinceTick: atTick,
    }).worldState;
  }
  if (state === 'lost') {
    // LOST IS TERMINAL FOR THE ERRAND, NOT FOR THE PERSON. The authoritative errand
    // no longer supplies a live route position, so its H1 projection must leave the
    // active leg without fabricating either a death or a settlement residence. A
    // hostless roamer carrying neither transit nor residency is the ledger's explicit
    // unknown/off-route state; KILL has already removed the record and therefore
    // reaches the same call as an identity no-op.
    const position = envoyNpcPosition(worldState, npcId);
    if (!position) return worldState;
    const record = asObject(position.record);
    if (!position.placed && record.whereaboutsUnknown === true
      && Object.keys(asObject(record.transit)).length === 0
      && Object.keys(asObject(record.residency)).length === 0
      && Object.keys(asObject(record.dmAssignment)).length === 0) return worldState;

    const lostTick = wholeTick(errand.lostTick);
    const cursor = asObject(errand.positionRef);
    // A loss can close either an exact road leg or a parlay at the foreign court. The
    // latter has no transit facet, so the arrived outbound cursor + target host + clock
    // proves this is still the placement the errand made. A later rescue/reassignment
    // necessarily carries a newer clock and the archived row then has no authority.
    const ownsParlay = position.placed
      && lostTick != null
      && text(record.hostSettlementId) === text(errand.to)
      && text(cursor.journey) === 'outbound'
      && text(cursor.progressBand) === 'arrived'
      && Number(record.sinceTick || 0) <= lostTick
      && Object.keys(asObject(record.residency)).length === 0
      && Object.keys(asObject(record.transit)).length === 0
      && Object.keys(asObject(record.dmAssignment)).length === 0;
    if (!terminalOwnsTransit(position, errand, lostTick) && !ownsParlay) return worldState;
    return moveNpcRecord({
      worldState,
      wnpcId: npcId,
      hostSettlementId: null,
      patch: { residency: null, transit: null, whereaboutsUnknown: true },
      sinceTick: atTick,
    }).worldState;
  }
  return worldState;
}

/** Build the hidden mechanical replay which carries a home delivery to apply. */
export function envoyHomeOutcome(delivery) {
  const row = asObject(delivery);
  const offer = normalizeEnvoyPeaceOffer(row.offer);
  const acceptance = normalizeEnvoyAcceptance(row.acceptance, offer);
  const carried = carriedTermSheetRead(row.termSheet);
  const errandId = text(row.errandId);
  if (!offer || !acceptance || !errandId || (carried.versioned && !carried.sheet)) return null;
  return {
    ...offer,
    id: offer.id,
    applyMode: 'auto',
    recordMode: 'state_only',
    headline: '',
    summary: '',
    reasons: [],
    metadata: {
      envoyTransportReturn: {
        kind: ENVOY_TRANSPORT_RETURN_KIND,
        errandId,
        npcId: text(row.npcId),
      },
      ...(carried.sheet ? { carriedTermSheet: carried.sheet } : {}),
      peaceDecision: acceptance.receipt,
      ...(acceptance.offererInheritedDemand
        ? { inheritedWarDemand: acceptance.offererInheritedDemand }
        : {}),
      ...(acceptance.coalitionPeaceExpenditures.length
        ? { coalitionPeaceExpenditures: acceptance.coalitionPeaceExpenditures }
        : {}),
    },
  };
}

/** Prove that the carried relationship key still names the offer's exact pair. */
function exactEnvoyRelationshipAddress(regionalGraph, offer) {
  const payload = asObject(offer?.proposalPayload);
  const relationshipKey = text(offer?.relationshipKey || payload.relationshipKey);
  const offererId = text(payload.offererId);
  const targetId = text(payload.targetId);
  const edges = Array.isArray(asObject(regionalGraph).edges)
    ? /** @type {Array<Record<string, unknown>>} */ (asObject(regionalGraph).edges)
    : [];
  const edge = edges.find((candidate) => relationshipKeyFromEdge(candidate) === relationshipKey);
  const endpoints = getRelationshipSettlements(edge);
  const pair = [text(endpoints.from), text(endpoints.to)];
  return !!edge && offererId !== targetId
    && pair.includes(offererId) && pair.includes(targetId)
    && new Set(pair).size === 2;
}

/**
 * Is the scheduled return physically visible at the home court?  This is a
 * knowledge question, not transport authority: an already placed person is
 * visible even if another lifecycle now owns their facets, while an arrived
 * transit cursor counts only when H1 still carries this errand's exact leg.
 */
export function envoyReturnVisibleAtHome(worldState, errand, tick) {
  const row = asObject(errand);
  const cursor = asObject(row.positionRef);
  const atTick = wholeTick(tick);
  const scheduledHomeTick = wholeTick(row.scheduledHomeTick);
  if (row.state !== 'returning' || cursor.journey !== 'return'
    || cursor.progressBand !== 'arrived' || atTick == null
    || scheduledHomeTick == null || atTick < scheduledHomeTick) return false;
  const position = envoyNpcPosition(worldState, text(row.npcId));
  if (!position) return false;
  const record = asObject(position.record);
  if (position.placed) {
    if (text(record.hostSettlementId) === text(row.from)
      && Number(record.sinceTick || 0) <= atTick
      && record.whereaboutsUnknown !== true) return true;
  }
  return terminalOwnsTransit(position, row, atTick);
}

/** Validate marker, person, relationship address, and offer against one exact home errand. */
function exactEnvoyReturn(worldState, outcome, regionalGraph) {
  if (!envoyDiplomacyActive(worldState)) return null;
  const marker = asObject(asObject(outcome).metadata).envoyTransportReturn;
  const transport = asObject(marker);
  if (transport.kind !== ENVOY_TRANSPORT_RETURN_KIND) return null;
  const errandId = text(transport.errandId);
  const markerNpcId = text(transport.npcId);
  const errand = envoyErrandsOf(worldState).find((row) => String(row.id) === errandId);
  const persistedOffer = normalizeEnvoyPeaceOffer(errand?.offer);
  const returnedOffer = normalizeEnvoyPeaceOffer(outcome);
  const persistedTermSheet = carriedTermSheetRead(errand?.termSheet);
  const returnedTermSheet = carriedTermSheetRead(asObject(outcome).metadata?.carriedTermSheet);
  if (!errand || errand.state !== 'home' || !markerNpcId || markerNpcId !== text(errand.npcId)
    || !persistedOffer || !returnedOffer
    || !exactEnvoyRelationshipAddress(regionalGraph, persistedOffer)
    || JSON.stringify(persistedOffer) !== JSON.stringify(returnedOffer)
    || (persistedTermSheet.versioned && !persistedTermSheet.sheet)
    || (returnedTermSheet.versioned && !returnedTermSheet.sheet)
    || persistedTermSheet.versioned !== returnedTermSheet.versioned
    || JSON.stringify(persistedTermSheet.sheet) !== JSON.stringify(returnedTermSheet.sheet)) return null;
  const acceptance = normalizeEnvoyAcceptance(errand.acceptance, errand.offer);
  return acceptance
    ? { errand, offer: persistedOffer, acceptance, termSheet: persistedTermSheet.sheet }
    : null;
}

/** Validate a return marker against the exact persisted home errand and live war episode. */
export function envoyReturnAcceptance(worldState, outcome, regionalGraph) {
  const exact = exactEnvoyReturn(worldState, outcome, regionalGraph);
  if (!exact) return null;
  const persistedOffer = exact.offer;
  const payload = asObject(persistedOffer.proposalPayload);
  const offererId = text(payload.offererId);
  const targetId = text(payload.targetId);
  const frontOwnerId = text(payload.peaceFrontOwnerId);
  const frontSinceTick = wholeTick(payload.peaceFrontSinceTick);
  const expectedOpponent = frontOwnerId === offererId ? targetId : offererId;
  const deployment = asObject(asObject(worldState).deployments)[frontOwnerId];
  // WR-7a's opaque cargo still proves the original front when one survives.
  // A WR-7b agreement is K3 historical authority: once both pictures signed,
  // later fronts may make the bargain absurd but cannot reality-check it away.
  if (!exact.termSheet && Object.keys(asObject(deployment)).length
    && (text(asObject(deployment).targetId) !== expectedOpponent
      || wholeTick(asObject(deployment).sinceTick) !== frontSinceTick)) return null;
  return exact.termSheet
    ? { ...exact.acceptance, carriedTermSheet: exact.termSheet }
    : exact.acceptance;
}

/**
 * Has this exact, fully-authorized carried outcome already settled? This is the
 * idempotent import/replay arm: a matching relationship label is not evidence;
 * only the persisted immutable outcome id counts, after the ordinary errand,
 * person, and offer checks above have all passed. A later deployment episode
 * cannot prevent this person from physically coming home because no mechanical
 * war fact is replayed on this arm.
 */
export function envoyReturnAlreadyApplied(worldState, outcome, regionalGraph) {
  const exact = exactEnvoyReturn(worldState, outcome, regionalGraph);
  if (!exact) return false;
  const offer = exact.offer;
  const relationshipKey = text(offer.relationshipKey || offer.proposalPayload?.relationshipKey);
  const outcomeId = text(offer.id);
  if (!relationshipKey || !outcomeId) return false;
  const relationship = asObject(asObject(asObject(worldState).relationshipStates)[relationshipKey]);
  return text(relationship.peaceDecisionOutcomeId) === outcomeId;
}
