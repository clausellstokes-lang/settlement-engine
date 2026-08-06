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
import {
  asObject,
  cloneData,
  declaredPurposeClassOf,
  purposeClassOf,
  strictText,
  wholeTick,
} from './envoyErrandVocabulary.js';
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

/**
 * SP-D — THE AUDIENCE SPLIT, and it is NEW HERE. The SP volume's §4 lifecycle clause says
 * this module "already owns the audience split"; it did not, and the ES volume's own
 * measurement says so in as many words (⟨seam-nit⟩: "envoyErrandProjection.js carries NO
 * includeCovert/truePurpose today — SP-D BUILDS this seam"). The overstatement was
 * reported, not silently corrected; this function is the correction.
 *
 * `includeCovert` is the estate's EXISTING spelling for this decision (npcLedgerProjection
 * .js, projectNpcPool, mobilizationStandings, realmPolitics) and it is BORROWED rather
 * than forked — J-WR-10 forbids a second word for one idea. Default FALSE, compared
 * `=== true`, so every caller that forgets the argument gets the player's view.
 *
 * THE HARD PART IS NOT WITHHOLDING `truePurpose`. It is that the PUBLIC row must not
 * betray that a secret EXISTS. A projection that answered "purposeClass: diplomatic,
 * covert: true" would keep the letter of the veil and give the whole game away; so would
 * one that carried `declaredPurpose` only when a split rode, since the presence of the key
 * IS the tell. The public shape is therefore IDENTICAL for an honest embassy and for a
 * covert mission wearing one — same keys, same words — and the pin that proves it compares
 * two seeded errands rather than asserting an absence on an empty harness.
 *
 * @param {unknown} rawErrand
 * @param {{ includeCovert?: boolean }} [opts] DM surfaces ⇒ true; PLAYER views ⇒ false
 * @returns {{errandId:string, purposeClass:string,
 *   declaredPurpose?:string, truePurpose?:string}|null}
 */
export function projectErrandPurpose(rawErrand, opts = {}) {
  const errand = normalizeErrand(rawErrand);
  if (!errand) return null;
  const errandId = String(errand.id);
  if (asObject(opts).includeCovert !== true) {
    // THE FACE. Nothing here can reach the true class: `declaredPurposeClassOf` never
    // consults `truePurpose`, and it consults `purposeClass` only when no cover is worn.
    return { errandId, purposeClass: declaredPurposeClassOf(errand) };
  }
  const declaredPurpose = String(errand.declaredPurpose || '');
  const truePurpose = String(errand.truePurpose || '');
  return {
    errandId,
    purposeClass: purposeClassOf(errand),
    ...(declaredPurpose && truePurpose ? { declaredPurpose, truePurpose } : {}),
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
