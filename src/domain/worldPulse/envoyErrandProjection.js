/**
 * envoyErrand/projection — the detached reads integration takes, without write power.
 *
 * A PURE LEAF OF THE ENVOY-ERRAND WRITER FAMILY (ruling R-BLD-4). Every function here
 * returns a DETACHED value: the caller can hold it, compare it, or hand it to another
 * subsystem, and nothing it does to that value can reach the ledger.
 *
 *   THE SAME-CUT PREVIEW — `previewEnvoyPosition` is where a traveller stands at one tick
 *     under the shared leg law. A partial leg still occupies its authored `from` node;
 *     only an ARRIVED cursor occupies `to`. The encounter census projects through
 *     `projectEnvoyForEncounter`, which shapes that preview for a collision test WITHOUT
 *     lending the census any authority to move anyone.
 *   THE BRIDGE CARGO — `envoyContinuationForHold` is the frozen journey a foreign-hold row
 *     must carry and hand back on release. No venue, captor, cause or hold authority is
 *     invented here; custody belongs to its own writer.
 *   SILENCE ELIGIBILITY — a lost traveller stays silence-eligible until an observation
 *     reaches home. Remote truth is not knowledge (K.7).
 *
 * K3 (NOBODY IS EVER CURRENT): the reach is the vocabulary, the offer leaf, the record
 * shapes, the transit seam and the ledger predicate. A preview is computed from the
 * traveller's OWN persisted legs, never from a live route solve.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/envoyErrand.test.js + tests/domain/envoyEncounter.test.js
 */
import { asObject, cloneData, strictText, wholeTick } from './envoyErrandVocabulary.js';
import {
  envoyOfferEpisodeKey,
  normalizeEnvoyAcceptance,
  normalizeEnvoyPeaceOffer,
} from './envoyErrandOffer.js';
import { normalizeErrand, normalizeTermSheet } from './envoyErrandRecords.js';
import { normalizeRouteRef, scheduledEnvoyPosition } from './envoyErrandTransit.js';
import { isActiveErrand } from './envoyErrandLedger.js';

export function latestEncounterFor(current, encounterId) {
  const rows = Array.isArray(current.encounters) ? current.encounters : [];
  const latest = rows.at(-1) || null;
  return latest && latest.id === encounterId ? latest : null;
}

/** Detached latest collision projection for integration readers. */
export function envoyEncounterForErrand(rawErrand, encounterId = '') {
  const errand = normalizeErrand(rawErrand);
  if (!errand || !Array.isArray(errand.encounters)) return null;
  const id = strictText(encounterId);
  const row = id
    ? errand.encounters.find((entry) => entry.id === id)
    : errand.encounters.at(-1);
  return row ? cloneData(row) : null;
}

/** Detached frozen receiving-court picture captured at dispatch. */
export function envoyTargetCourtPictureForErrand(rawErrand) {
  const errand = normalizeErrand(rawErrand);
  return errand?.targetCourtPicture
    ? cloneData(errand.targetCourtPicture)
    : null;
}

/**
 * Exact bridge cargo for `foreignGuestHold`'s separate one writer. No venue,
 * captor, cause, or hold authority is invented here; this is only the frozen
 * journey the hold row must carry and later hand back on release.
 */
export function envoyContinuationForHold(rawErrand, encounterId) {
  const errand = normalizeErrand(rawErrand);
  const encounter = errand ? latestEncounterFor(errand, strictText(encounterId)) : null;
  if (!errand || !encounter || !['pending', 'held'].includes(String(encounter.resolution))) return null;
  const journey = String(encounter.priorJourney);
  const journeyLegs = /** @type {Array<Record<string, unknown>>} */ (errand.legs)
    .filter((leg) => leg.journey === journey)
    .map((leg) => /** @type {Record<string, unknown>} */ (cloneData(leg)));
  if (!journeyLegs.length || journeyLegs.some((leg) => !normalizeRouteRef(leg.routeRef))) return null;
  const continuation = {
    schemaVersion: 1,
    resumeState: String(encounter.priorState),
    journey,
    destinationId: String(encounter.destinationId),
    interruptedTick: Number(encounter.encounteredTick),
    positionRef: /** @type {Record<string, unknown>} */ (cloneData(encounter.priorPosition)),
    journeyLegs,
    expectedReturnTick: Number(errand.expectedReturnTick),
    ...(journey === 'return' ? { scheduledHomeTick: Number(errand.scheduledHomeTick) } : {}),
  };
  return journey === 'return' && wholeTick(errand.scheduledHomeTick) == null
    ? null
    : continuation;
}

/** A lost traveller remains silence-eligible until observation reaches home. */
export function silenceEligible(errand, tick, returnVisibleOverride = null) {
  const position = asObject(errand.positionRef);
  const scheduledAsHome = errand.state === 'returning'
    && position.journey === 'return'
    && position.progressBand === 'arrived'
    && wholeTick(errand.scheduledHomeTick) != null
    && tick >= Number(errand.scheduledHomeTick);
  const visiblyHome = typeof returnVisibleOverride === 'boolean'
    ? returnVisibleOverride
    : scheduledAsHome;
  const mayBeSilent = isActiveErrand(errand)
    || (errand.state === 'lost' && errand.lossKnownAtHomeTick == null);
  return mayBeSilent && !visiblyHome && errand.silenceInferredAtTick == null
    && tick > Number(errand.expectedReturnTick);
}

/**
 * Pure same-cut transit preview. A partial leg still occupies its authored
 * `from` node; only an arrived cursor occupies `to`. The shared leg law is
 * evaluated once, so a boundary arrival cannot also hop onto a later leg.
 */
export function previewEnvoyPosition(rawErrand, tick) {
  const errand = normalizeErrand(rawErrand);
  const at = wholeTick(tick);
  if (!errand || at == null || !['travelling', 'returning'].includes(String(errand.state))) return null;
  const scheduled = scheduledEnvoyPosition(errand, at);
  if (!scheduled) return null;
  const positionRef = /** @type {Record<string, unknown>} */ (cloneData(scheduled.positionRef));
  const nodeId = positionRef.progressBand === 'arrived'
    ? String(positionRef.toId)
    : String(positionRef.fromId);
  const journeyLegs = /** @type {Array<Record<string, unknown>>} */ (errand.legs)
    .filter((leg) => leg.journey === positionRef.journey);
  const leg = asObject(journeyLegs[Number(positionRef.legIndex)]);
  const routeRef = normalizeRouteRef(leg.routeRef);
  return {
    errandId: String(errand.id),
    npcId: String(errand.npcId),
    state: String(errand.state),
    journey: String(positionRef.journey),
    nodeId,
    projectedTick: at,
    projectionPhase: 'pre_mutation',
    complete: scheduled.complete === true,
    positionRef,
    ...(routeRef ? { routeId: routeRef.id } : {}),
  };
}

/** Shape the pure preview for `envoyEncounter` without lending it write power. */
export function projectEnvoyForEncounter(rawErrand, tick, venueRef = null) {
  const errand = normalizeErrand(rawErrand);
  const preview = previewEnvoyPosition(errand, tick);
  if (!errand || !preview) return null;
  const offer = /** @type {Record<string, unknown>} */ (errand.offer);
  const venue = asObject(venueRef);
  const venueId = strictText(venue.id);
  const venueKind = strictText(venue.kind);
  if (venueRef != null && (!venueId || venueId !== preview.nodeId || !venueKind)) return null;
  return {
    errandId: String(errand.id),
    npcId: String(errand.npcId),
    fromId: String(errand.from),
    toId: String(errand.to),
    relationshipKey: String(offer.relationshipKey),
    episodeKey: envoyOfferEpisodeKey(offer),
    nodeId: preview.nodeId,
    journey: preview.journey,
    projectedTick: preview.projectedTick,
    projectionPhase: preview.projectionPhase,
    ...(preview.routeId ? { routeId: preview.routeId } : {}),
    ...(venueRef != null ? { venueRef: { id: venueId, kind: venueKind } } : {}),
    ...(errand.termSheet ? { termsBearing: true } : {}),
  };
}

/** @param {Record<string, unknown>} errand */
export function homeDeliveryFor(errand) {
  return {
    errandId: String(errand.id),
    npcId: String(errand.npcId),
    from: String(errand.from),
    to: String(errand.to),
    offer: normalizeEnvoyPeaceOffer(errand.offer),
    acceptance: normalizeEnvoyAcceptance(errand.acceptance, errand.offer),
    termSheet: normalizeTermSheet(errand.termSheet),
  };
}
