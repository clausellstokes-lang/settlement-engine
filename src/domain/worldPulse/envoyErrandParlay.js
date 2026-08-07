/**
 * envoyErrand/parlay — the frozen-picture comparison and the exact resumed journey.
 *
 * A PURE LEAF OF THE ENVOY-ERRAND WRITER FAMILY (ruling R-BLD-4). It computes DELTAS and
 * returns them; the family head and the encounter writer decide whether to persist one.
 *
 *   THE FROZEN PAIR (K4) — `frozenParlayPictures` is the single place the proposer and
 *     responder pictures are derived. At a field parlay the proposer is the intercepting
 *     column's captured picture; at the receiving court it is the picture that court froze
 *     at dispatch. The negotiator and the refusal witness BOTH read the pair from here, so
 *     they can never disagree about which two pictures a parlay compared.
 *   THE DRAFT (K3) — `negotiateEnvoyParlay` takes no world, no snapshot and no truth. The
 *     two pictures are the WHOLE evidence, which is what keeps "nobody is ever current"
 *     structural rather than conventional.
 *   THE RESUME — `resumeFromEncounter` splices an externally priced continuation onto the
 *     prefix of legs already walked. It never solves a route: an impossible plan makes it
 *     return `null` and the caller no-ops.
 *
 * INJECTED-PLAN VALIDATOR (WR-7a law M): this leaf calls `normalizeRoutePlan` but does not
 * import the transit kernel, so it can validate a supplied journey and can never price or
 * advance a leg itself. The movement-site manifest records it under that exact route.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/lint/namedPersonTransitTotality.walker.test.js
 *   + tests/domain/envoyErrand.test.js
 */
import { negotiateFromPictures, normalizeNegotiationPicture } from './negotiationPictures.js';
import {
  ENVOY_CONTINUATION_SCHEMA_VERSION,
  asObject,
  strictText,
  wholeTick,
} from './envoyErrandVocabulary.js';
import { envoyOfferEpisodeKey, normalizeEnvoyPeaceOffer } from './envoyErrandOffer.js';
import {
  normalizeEncounterContinuation,
  normalizeEnvoyEncounter,
  normalizeErrand,
} from './envoyErrandRecords.js';
import { normalizeRoutePlan } from './envoyErrandTransit.js';

export function exactExpectedErrand(current, expectedErrand) {
  if (expectedErrand == null) return true;
  const expected = normalizeErrand(expectedErrand);
  return !!expected && JSON.stringify(expected) === JSON.stringify(current);
}

export function normalizePictureForErrand(raw, errand) {
  const picture = normalizeNegotiationPicture(raw);
  const offer = asObject(errand.offer);
  return picture
    && picture.carrier?.kind === 'envoy'
    && picture.carrier?.id === errand.id
    && picture.partyId === errand.from
    && picture.counterpartId === errand.to
    && picture.relationshipKey === offer.relationshipKey
    && picture.episodeKey === envoyOfferEpisodeKey(offer)
    ? picture
    : null;
}

export function updateLatestEncounter(current, nextEncounter) {
  const rows = Array.isArray(current.encounters) ? current.encounters : [];
  return [...rows.slice(0, -1), nextEncounter];
}

export function resumeFromEncounter({ current, encounter, routePlan, tick, plantResumed = false }) {
  const plan = normalizeRoutePlan(routePlan, {
    fromId: String(encounter.venueId),
    toId: String(encounter.destinationId),
    journey: /** @type {'outbound'|'return'} */ (encounter.priorJourney),
    notBeforeTick: tick,
  });
  if (!plan) return null;
  const journey = String(encounter.priorJourney);
  const oldJourney = /** @type {Array<Record<string, unknown>>} */ (current.legs)
    .filter((leg) => leg.journey === journey);
  const priorPosition = asObject(encounter.priorPosition);
  const priorIndex = Number(priorPosition.legIndex);
  const prefixLength = priorPosition.progressBand === 'arrived' ? priorIndex + 1 : priorIndex;
  const prefix = oldJourney.slice(0, Math.max(0, prefixLength));
  const otherJourney = /** @type {Array<Record<string, unknown>>} */ (current.legs)
    .filter((leg) => leg.journey !== journey);
  const combinedJourney = [...prefix, ...plan.legs];
  const legs = journey === 'outbound'
    ? [...combinedJourney, ...otherJourney.filter((leg) => leg.journey === 'return')]
    : [...otherJourney.filter((leg) => leg.journey === 'outbound'), ...combinedJourney];
  const positionRef = {
    ...plan.positionRef,
    legIndex: prefix.length + Number(plan.positionRef.legIndex),
  };
  const continuation = normalizeEncounterContinuation({
    schemaVersion: ENVOY_CONTINUATION_SCHEMA_VERSION,
    resumeState: encounter.priorState,
    journey,
    destinationId: encounter.destinationId,
    resumedTick: tick,
    scheduledArrivalTick: plan.expectedReturnTick,
  });
  const nextEncounter = normalizeEnvoyEncounter({
    ...encounter,
    resolution: plantResumed ? 'plant_resumed' : 'resumed',
    resolvedTick: tick,
    continuation,
  });
  if (!continuation || !nextEncounter) return null;
  return {
    ...current,
    state: encounter.priorState,
    legs,
    positionRef,
    releasedTick: tick,
    ...(journey === 'return' ? { scheduledHomeTick: plan.expectedReturnTick } : {}),
    encounters: updateLatestEncounter(current, nextEncounter),
  };
}

/**
 * The exact pair of ALREADY FROZEN pictures one parlay compares (K4). At a field
 * parlay the proposer is the intercepting column's captured picture; at the
 * receiving court it is the picture that court froze at dispatch. Nothing is
 * re-read from live truth, and the negotiator and the refusal witness below
 * derive the pair from this one place so they can never disagree about it.
 */
export function frozenParlayPictures(errand) {
  const row = asObject(errand);
  const parlayId = strictText(row.parlayId);
  const encounter = parlayId && Array.isArray(row.encounters)
    ? row.encounters.find((entry) => strictText(asObject(entry).id) === parlayId) || null
    : null;
  return {
    parlayId,
    proposer: normalizeNegotiationPicture(
      encounter ? asObject(encounter).interceptorPicture : row.targetCourtPicture,
    ),
    responder: normalizeNegotiationPicture(row.negotiationPicture),
  };
}

/**
 * Draft once from the proposer's frozen picture and let the responder's own
 * frozen picture bound it. Pure: no world, no snapshot, no truth — the two
 * pictures are the whole evidence, which is what keeps K3 structural rather
 * than conventional.
 * @param {{errand?:unknown, tick?:number}} [args]
 */
export function negotiateEnvoyParlay({ errand, tick } = {}) {
  const row = asObject(errand);
  const at = wholeTick(tick);
  const offer = normalizeEnvoyPeaceOffer(row.offer);
  const { parlayId, proposer, responder } = frozenParlayPictures(row);
  if (!offer || !proposer || !responder || !parlayId || at == null) {
    return { agreed: false, reason: 'invalid_picture', termSheet: null, proposerPicture: null };
  }
  const proposerId = String(row.to);
  const responderId = String(row.from);
  const result = negotiateFromPictures({
    proposerPicture: proposer,
    responderPicture: responder,
    termSheetId: `term_sheet:${[row.id, parlayId, at]
      .map((part) => `${String(part).length}:${String(part)}`).join('|')}`,
    errandId: String(row.id),
    encounterId: parlayId,
    episodeKey: envoyOfferEpisodeKey(offer),
    relationshipKey: String(offer.relationshipKey),
    proposerId,
    responderId,
    victorId: proposerId,
    loserId: responderId,
    agreedTick: at,
  });
  return { ...result, proposerPicture: proposer };
}
