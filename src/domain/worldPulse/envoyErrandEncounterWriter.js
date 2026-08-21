/**
 * envoyErrand/encounterWriter — WR-7b's interception-and-parlay arc of the errand family.
 *
 * A WRITER MEMBER OF THE ENVOY-ERRAND FAMILY (ruling R-BLD-4: the single-writer law reads
 * ONE WRITER FAMILY, never one file). Every mutation here reaches the world through
 * `envoyErrandLedger.js` — the family's ONE assignment of the top-level ledger key — so
 * splitting this arc out of the head did not mint a second writer of `envoyErrands`.
 *
 * The arc this file owns is one story: a column meets a traveller on the road, and the
 * meeting resolves.
 *
 *   THE COLLISION — `markEnvoyIntercepted` adopts an EXTERNAL encounter census only after
 *     proving the projected node and the temporal cut still match the exact ledger row it
 *     is about to overwrite. A census may observe; it may not move anyone.
 *   THE RESOLUTION — parlay, custody, or an externally priced continuation, never earlier
 *     than T+1. Nothing resolves in the same tick it began.
 *   THE VERDICT — terms agreed, or the first terminal no-sheet refusal. The refusal is a
 *     DURABLE witness, not a phase flag: it survives the mandatory return and the terminal
 *     close, which is what stops a later pulse from silently re-drafting a refused peace.
 *
 * K3 (NOBODY IS EVER CURRENT): every comparison here reads FROZEN pictures through
 * `envoyErrandParlay.js`. No settlement strength, stock or pressure is reachable from this
 * file, and the term sheet it persists was drafted from those same two pictures.
 *
 * @enforced-by tests/domain/envoyErrand.test.js + tests/domain/envoyK3BeliefSeam.test.js
 */
import {
  applyNegotiationPictureMutation,
  normalizeNegotiationPicture,
  normalizeParlayTermSheet,
} from './negotiationPictures.js';
import {
  ENCOUNTER_KIND_SET,
  ENVOY_ENCOUNTER_SCHEMA_VERSION,
  ENVOY_PARLAY_REFUSAL_SCHEMA_VERSION,
  MAX_ENVOY_ENCOUNTER_HISTORY,
  PRIVATE_GOAL_SET,
  asObject,
  compareCodepoint,
  strictText,
  text,
  wholeTick,
} from './envoyErrandVocabulary.js';
import { envoyDiplomacyActive, envoyOfferEpisodeKey } from './envoyErrandOffer.js';
import {
  encounterOrder,
  envoyErrandsOf,
  normalizeEncounterVenueRef,
  normalizeEnvoyEncounter,
  normalizeParlayRefusal,
  normalizeParlayRefusalReason,
  parlayRefusalId,
} from './envoyErrandRecords.js';
import {
  errandIndex,
  isActiveErrand,
  replaceErrand,
  writeErrands,
} from './envoyErrandLedger.js';
import { evidenceFor, termSheetIdOf } from './envoyErrandEvidence.js';
import { latestEncounterFor, previewEnvoyPosition } from './envoyErrandProjection.js';
import {
  exactExpectedErrand,
  frozenParlayPictures,
  normalizePictureForErrand,
  resumeFromEncounter,
  updateLatestEncounter,
} from './envoyErrandParlay.js';

/**
 * Record the one T transition from travel into interception. The encounter
 * census is external; this writer proves that its projected node and temporal
 * cut still match the exact ledger row before adopting the result.
 * @param {{worldState?:Record<string,unknown>, errandId?:unknown, encounter?:unknown,
 *   interceptorPicture?:unknown, expectedErrand?:unknown, tick?:number}} [args]
 */
export function markEnvoyIntercepted({
  worldState,
  errandId,
  encounter,
  interceptorPicture = null,
  expectedErrand = null,
  tick,
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark' };
  }
  const id = strictText(errandId);
  const at = wholeTick(tick);
  const candidate = asObject(encounter);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  if (!current || at == null || !['travelling', 'returning'].includes(String(current.state))
    || !exactExpectedErrand(current, expectedErrand)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'stale_errand' };
  }
  const preview = previewEnvoyPosition(current, at);
  const encounterId = strictText(candidate.id);
  const kind = strictText(candidate.kind);
  const interceptorId = strictText(candidate.actorId || candidate.interceptorId);
  const armyId = strictText(candidate.armyId);
  const venueId = strictText(candidate.nodeId || candidate.venueId);
  const routeId = candidate.routeId == null ? null : strictText(candidate.routeId);
  const venueRef = normalizeEncounterVenueRef(candidate.venueRef, venueId, routeId);
  const privateGoal = candidate.privateGoal == null ? null : strictText(candidate.privateGoal);
  const candidateTick = wholeTick(candidate.tick);
  const offer = asObject(current.offer);
  if (!preview || !encounterId || !ENCOUNTER_KIND_SET.has(kind) || !interceptorId || !armyId
    || !venueId || !venueRef || venueId !== preview.nodeId || candidateTick !== at
    || (candidate.errandId != null && strictText(candidate.errandId) !== id)
    || (candidate.npcId != null && strictText(candidate.npcId) !== current.npcId)
    || (candidate.relationshipKey != null
      && strictText(candidate.relationshipKey) !== offer.relationshipKey)
    || (candidate.episodeKey != null
      && strictText(candidate.episodeKey) !== envoyOfferEpisodeKey(offer))
    || (candidate.routeId != null && (!routeId || routeId !== (preview.routeId || '')))
    || ((kind === 'private_goal') !== !!privateGoal)
    || (privateGoal && !PRIVATE_GOAL_SET.has(privateGoal))) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_encounter' };
  }
  const priorEncounters = Array.isArray(current.encounters) ? current.encounters : [];
  if (priorEncounters.some((row) => row.id === encounterId)
    || priorEncounters.some((row) => Number(row.encounteredTick) === at)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'encounter_already_recorded' };
  }
  const otherPicture = normalizeNegotiationPicture(interceptorPicture);
  const offerPair = [String(current.from), String(current.to)].sort(compareCodepoint);
  const picturePair = otherPicture
    ? [String(otherPicture.partyId), String(otherPicture.counterpartId)].sort(compareCodepoint)
    : [];
  if (!otherPicture
    || otherPicture.carrier?.kind !== 'army'
    || otherPicture.carrier?.id !== armyId
    || otherPicture.partyId !== interceptorId
    || !offerPair.includes(String(otherPicture.counterpartId))
    || otherPicture.relationshipKey !== offer.relationshipKey
    || otherPicture.episodeKey !== envoyOfferEpisodeKey(offer)
    || Number(otherPicture.lastChangedTick) > at
    || (kind === 'field_parlay'
      && JSON.stringify(picturePair) !== JSON.stringify(offerPair))
    || (candidate.interceptorPictureId != null
      && strictText(candidate.interceptorPictureId) !== otherPicture.id)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_interceptor_picture' };
  }
  const encounterRow = normalizeEnvoyEncounter({
    schemaVersion: ENVOY_ENCOUNTER_SCHEMA_VERSION,
    id: encounterId,
    kind,
    interceptorId,
    armyId,
    venueId,
    venueRef,
    routeId,
    encounteredTick: at,
    resolvedTick: null,
    priorState: current.state,
    priorJourney: preview.journey,
    priorPosition: preview.positionRef,
    destinationId: current.state === 'returning' ? current.from : current.to,
    continuation: null,
    privateGoal,
    resolution: 'pending',
    interceptorPictureId: String(otherPicture.id),
    interceptorPicture: otherPicture,
    termSheetId: current.termSheet ? termSheetIdOf(current) || null : null,
  });
  if (!encounterRow) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_encounter' };
  }
  const nextErrand = {
    ...current,
    state: 'intercepted',
    positionRef: preview.positionRef,
    interceptedTick: at,
    encounters: [...priorEncounters, encounterRow].sort(encounterOrder)
      .slice(-MAX_ENVOY_ENCOUNTER_HISTORY),
  };
  const nextWorldState = replaceErrand(worldState, errands, index, nextErrand);
  const persisted = envoyErrandsOf(nextWorldState).find((row) => row.id === id) || null;
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence: persisted ? [evidenceFor(persisted, 'envoy_intercepted', at, {
      encounterId,
      interceptorId,
      thirdPartyId: interceptorId,
      armyId,
      venueId,
      ...(privateGoal ? { privateGoal } : {}),
      ...(current.negotiationPicture ? { envoyPictureId: current.negotiationPicture.id } : {}),
      interceptorPictureId: otherPicture.id,
    })] : [],
    errand: persisted,
    reason: persisted ? 'intercepted' : 'invalid_result',
  };
}

/**
 * Resolve no earlier than T+1 to parlay, custody, or an externally priced continuation.
 * @param {{worldState?:Record<string,unknown>, errandId?:unknown, encounterId?:unknown,
 *   resolution?:unknown, routePlan?:unknown, negotiationPicture?:unknown,
 *   expectedErrand?:unknown, tick?:number}} [args]
 */
export function resolveEnvoyInterception({
  worldState,
  errandId,
  encounterId,
  resolution,
  routePlan = null,
  negotiationPicture = null,
  expectedErrand = null,
  tick,
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark' };
  }
  const id = strictText(errandId);
  const encounterKey = strictText(encounterId);
  const at = wholeTick(tick);
  const outcome = strictText(resolution);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  const encounter = current ? latestEncounterFor(current, encounterKey) : null;
  if (!current || current.state !== 'intercepted' || !encounter
    || encounter.resolution !== 'pending' || at == null
    || at < Number(encounter.encounteredTick) + 1
    || !exactExpectedErrand(current, expectedErrand)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'stale_encounter' };
  }
  let nextErrand;
  let evidenceKind = '';
  let reason;
  if (outcome === 'parlaying') {
    const picture = negotiationPicture == null
      ? current.negotiationPicture || null
      : normalizePictureForErrand(negotiationPicture, current);
    if (negotiationPicture != null && !picture) {
      return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_negotiation_picture' };
    }
    const resolved = normalizeEnvoyEncounter({
      ...encounter,
      resolution: 'parlaying',
      resolvedTick: at,
    });
    if (!resolved) return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_result' };
    nextErrand = {
      ...current,
      state: 'parlaying',
      parlayTick: at,
      parlayId: encounterKey,
      ...(picture ? { negotiationPicture: picture } : {}),
      encounters: updateLatestEncounter(current, resolved),
    };
    evidenceKind = 'envoy_parlaying';
    reason = 'parlaying';
  } else if (outcome === 'held') {
    const resolved = normalizeEnvoyEncounter({
      ...encounter,
      resolution: 'held',
      resolvedTick: at,
    });
    if (!resolved) return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_result' };
    nextErrand = {
      ...current,
      state: 'held',
      heldTick: at,
      encounters: updateLatestEncounter(current, resolved),
    };
    evidenceKind = 'envoy_held';
    reason = 'held';
  } else if (outcome === 'resumed' || outcome === 'plant_resumed') {
    nextErrand = resumeFromEncounter({
      current,
      encounter,
      routePlan,
      tick: at,
      plantResumed: outcome === 'plant_resumed',
    });
    reason = outcome;
  } else {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_resolution' };
  }
  if (!nextErrand) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_route_plan' };
  }
  const nextWorldState = replaceErrand(worldState, errands, index, nextErrand);
  const persisted = envoyErrandsOf(nextWorldState).find((row) => row.id === id) || null;
  const evidence = persisted && evidenceKind ? [evidenceFor(persisted, evidenceKind, at, {
    encounterId: encounterKey,
    interceptorId: encounter.interceptorId,
    thirdPartyId: encounter.interceptorId,
    armyId: encounter.armyId,
    venueId: encounter.venueId,
    ...(encounter.privateGoal ? { privateGoal: encounter.privateGoal } : {}),
  })] : [];
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence,
    errand: persisted,
    reason: persisted ? reason : 'invalid_result',
  };
}

/**
 * Reprice and resume the exact interrupted journey after custody or parlay.
 * @param {{worldState?:Record<string,unknown>, errandId?:unknown, encounterId?:unknown,
 *   routePlan?:unknown, plantResumed?:boolean, expectedErrand?:unknown, tick?:number}} [args]
 */
export function resumeEnvoyJourney({
  worldState,
  errandId,
  encounterId,
  routePlan,
  plantResumed = false,
  expectedErrand = null,
  tick,
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark' };
  }
  const id = strictText(errandId);
  const encounterKey = strictText(encounterId);
  const at = wholeTick(tick);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  const encounter = current ? latestEncounterFor(current, encounterKey) : null;
  if (!current || !['held', 'parlaying'].includes(String(current.state)) || !encounter
    || !['held', 'parlaying'].includes(String(encounter.resolution))
    || at == null || at < Number(encounter.resolvedTick) + 1
    || !exactExpectedErrand(current, expectedErrand)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'stale_encounter' };
  }
  const nextErrand = resumeFromEncounter({ current, encounter, routePlan, tick: at, plantResumed });
  if (!nextErrand) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_route_plan' };
  }
  const nextWorldState = replaceErrand(worldState, errands, index, nextErrand);
  const persisted = envoyErrandsOf(nextWorldState).find((row) => row.id === id) || null;
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence: [],
    errand: persisted,
    reason: persisted ? 'resumed' : 'invalid_result',
  };
}

/** Foreign-hold integration spelling; custody itself remains in its own writer. */
export function releaseHeldEnvoy(args = {}) {
  return resumeEnvoyJourney(args);
}

/** Explicit hold transition spelling for integration callers. */
export function markEnvoyHeld(args = {}) {
  return resolveEnvoyInterception({ ...args, resolution: 'held' });
}

/**
 * Outbound arrival opens an ordinary target-court parlay.
 * @param {{worldState?:Record<string,unknown>, errandId?:unknown, negotiationPicture?:unknown,
 *   parlayId?:string, expectedErrand?:unknown, tick?:number}} [args]
 */
export function openEnvoyParlay({
  worldState,
  errandId,
  negotiationPicture = null,
  parlayId = '',
  expectedErrand = null,
  tick,
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark' };
  }
  const id = text(errandId);
  const now = wholeTick(tick);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  const outbound = current
    ? /** @type {Array<Record<string, unknown>>} */ (current.legs).filter((leg) => leg.journey === 'outbound')
    : [];
  if (!current || current.state !== 'travelling' || now == null || !outbound.length
    || now < Number(outbound[outbound.length - 1].arrivalTick)
    || !exactExpectedErrand(current, expectedErrand)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_state' };
  }
  const picture = negotiationPicture == null
    ? current.negotiationPicture || null
    : normalizePictureForErrand(negotiationPicture, current);
  if (negotiationPicture != null && !picture) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_negotiation_picture' };
  }
  const lastIndex = outbound.length - 1;
  const last = outbound[lastIndex];
  const eventId = strictText(parlayId) || `target_parlay:${current.id}:${now}`;
  const nextErrand = {
    ...current,
    state: 'parlaying',
    parlayTick: now,
    parlayId: eventId,
    ...(picture ? { negotiationPicture: picture } : {}),
    positionRef: {
      journey: 'outbound',
      legIndex: lastIndex,
      fromId: last.fromId,
      toId: last.toId,
      progressBand: 'arrived',
    },
  };
  const next = [...errands];
  next[index] = nextErrand;
  const nextWorldState = writeErrands(worldState, next);
  const persisted = envoyErrandsOf(nextWorldState).find((row) => row.id === id) || null;
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence: persisted ? [evidenceFor(persisted, 'envoy_parlaying', now, { parlayId: eventId })] : [],
    errand: persisted,
    reason: persisted ? 'parlaying' : 'invalid_result',
  };
}

/** Backward-compatible WR-7a spelling. */
export function markEnvoyParlaying(args = {}) {
  return openEnvoyParlay(args);
}

/**
 * Apply one exact typed observation to the WR-7b picture through this writer.
 * @param {{worldState?:Record<string,unknown>, errandId?:unknown, patch?:unknown,
 *   expectedErrand?:unknown}} [args]
 */
export function updateEnvoyNegotiationPicture({
  worldState,
  errandId,
  patch,
  expectedErrand = null,
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, errand: null, reason: 'dark' };
  }
  const id = strictText(errandId);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  if (!current || !isActiveErrand(current) || !current.negotiationPicture
    || !exactExpectedErrand(current, expectedErrand)) {
    return { worldState, changed: false, errand: current, reason: 'stale_errand' };
  }
  const nextPicture = applyNegotiationPictureMutation(current.negotiationPicture, patch);
  const normalized = normalizePictureForErrand(nextPicture, current);
  if (!normalized || JSON.stringify(normalized) === JSON.stringify(current.negotiationPicture)) {
    return { worldState, changed: false, errand: current, reason: 'picture_unchanged' };
  }
  const nextErrand = { ...current, negotiationPicture: normalized };
  const nextWorldState = replaceErrand(worldState, errands, index, nextErrand);
  const persisted = envoyErrandsOf(nextWorldState).find((row) => row.id === id) || null;
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    errand: persisted,
    reason: persisted ? 'picture_updated' : 'invalid_result',
  };
}

/**
 * Persist the first terminal no-sheet verdict for one parlay. Retries and
 * compromise belong to WR-7c, so this witness prevents a later pulse from
 * rebuilding either frozen picture and silently drafting again.
 * @param {{worldState?:Record<string,unknown>, errandId?:unknown, expectedErrand?:unknown,
 *   attempt?:unknown, tick?:number}} [args]
 */
export function recordEnvoyParlayRefusal({
  worldState,
  errandId,
  expectedErrand = null,
  attempt,
  tick,
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark' };
  }
  const id = strictText(errandId);
  const at = wholeTick(tick);
  const tried = asObject(attempt);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  if (!current || current.state !== 'parlaying' || at == null
    || !exactExpectedErrand(current, expectedErrand)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'stale_errand' };
  }
  if (current.termSheet) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'terms_already_agreed' };
  }
  if (current.parlayRefusal) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'parlay_already_refused' };
  }
  const parlayTick = wholeTick(current.parlayTick);
  const { parlayId, proposer: frozenProposer, responder: frozenResponder } = frozenParlayPictures(current);
  const attemptedProposer = tried.proposerPicture == null
    ? frozenProposer
    : normalizeNegotiationPicture(tried.proposerPicture);
  const attemptedResponder = tried.responderPicture == null
    ? frozenResponder
    : normalizeNegotiationPicture(tried.responderPicture);
  const reason = normalizeParlayRefusalReason(tried.reason);
  const offer = asObject(current.offer);
  const pair = [String(current.from), String(current.to)].sort(compareCodepoint);
  if (tried.agreed !== false || tried.termSheet != null || !reason
    || parlayTick == null || !parlayId || at < parlayTick + 1
    || !frozenProposer || !frozenResponder || !attemptedProposer || !attemptedResponder
    || JSON.stringify(attemptedProposer) !== JSON.stringify(frozenProposer)
    || JSON.stringify(attemptedResponder) !== JSON.stringify(frozenResponder)
    || (tried.proposerPictureId != null
      && strictText(tried.proposerPictureId) !== frozenProposer.id)
    || (tried.responderPictureId != null
      && strictText(tried.responderPictureId) !== frozenResponder.id)
    || frozenProposer.partyId !== current.to
    || frozenProposer.counterpartId !== current.from
    || frozenResponder.partyId !== current.from
    || frozenResponder.counterpartId !== current.to
    || JSON.stringify([String(frozenProposer.partyId), String(frozenProposer.counterpartId)]
      .sort(compareCodepoint)) !== JSON.stringify(pair)
    || frozenProposer.relationshipKey !== offer.relationshipKey
    || frozenResponder.relationshipKey !== offer.relationshipKey
    || frozenProposer.episodeKey !== envoyOfferEpisodeKey(offer)
    || frozenResponder.episodeKey !== envoyOfferEpisodeKey(offer)
    || at < Number(frozenProposer.lastChangedTick)
    || at < Number(frozenResponder.lastChangedTick)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_refusal' };
  }
  const refusal = normalizeParlayRefusal({
    schemaVersion: ENVOY_PARLAY_REFUSAL_SCHEMA_VERSION,
    id: parlayRefusalId(id, parlayId, at),
    parlayId,
    attemptedTick: at,
    proposerPictureId: frozenProposer.id,
    responderPictureId: frozenResponder.id,
    reason,
  });
  if (!refusal) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_refusal' };
  }
  const nextErrand = { ...current, parlayRefusal: refusal };
  const nextWorldState = replaceErrand(worldState, errands, index, nextErrand);
  const persisted = envoyErrandsOf(nextWorldState).find((row) => row.id === id) || null;
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence: persisted ? [evidenceFor(persisted, 'parlay_terms_neither_court_drafted', at, {
      parlayId,
      envoyPictureId: frozenResponder.id,
      interceptorPictureId: frozenProposer.id,
      reasonId: reason,
    })] : [],
    errand: persisted,
    reason: persisted ? 'parlay_refused' : 'invalid_result',
  };
}

/**
 * Persist the exact already-negotiated artifact; drafting remains outside.
 * @param {{worldState?:Record<string,unknown>, errandId?:unknown, termSheet?:unknown,
 *   expectedErrand?:unknown, tick?:number}} [args]
 */
export function agreeEnvoyTerms({
  worldState,
  errandId,
  termSheet,
  expectedErrand = null,
  tick,
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark' };
  }
  const id = strictText(errandId);
  const at = wholeTick(tick);
  const sheet = normalizeParlayTermSheet(termSheet);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  const offer = current ? asObject(current.offer) : {};
  const pair = current ? [String(current.from), String(current.to)].sort(compareCodepoint) : [];
  if (current?.parlayRefusal) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'parlay_already_refused' };
  }
  if (!current || current.state !== 'parlaying' || at == null || !sheet
    || !current.negotiationPicture
    || wholeTick(current.parlayTick) == null || at < Number(current.parlayTick) + 1
    || at < Number(current.negotiationPicture.lastChangedTick)
    || !exactExpectedErrand(current, expectedErrand)
    || sheet.errandId !== id || sheet.agreedTick !== at
    || sheet.encounterId !== text(current.parlayId)
    || sheet.episodeKey !== envoyOfferEpisodeKey(offer)
    || sheet.relationshipKey !== offer.relationshipKey
    || JSON.stringify(sheet.parties) !== JSON.stringify(pair)
    || !Object.values(asObject(sheet.pictureIds)).includes(current.negotiationPicture.id)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_term_sheet' };
  }
  if (current.termSheet) {
    return JSON.stringify(current.termSheet) === JSON.stringify(sheet)
      ? { worldState, changed: false, evidence: [], errand: current, reason: 'terms_already_agreed' }
      : { worldState, changed: false, evidence: [], errand: current, reason: 'terms_conflict' };
  }
  const latest = Array.isArray(current.encounters) ? current.encounters.at(-1) : null;
  let encounters = current.encounters;
  if (latest && latest.id === current.parlayId) {
    const updated = normalizeEnvoyEncounter({ ...latest, termSheetId: sheet.id });
    if (!updated) return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_result' };
    encounters = updateLatestEncounter(current, updated);
  }
  const nextErrand = {
    ...current,
    termSheet: sheet,
    ...(encounters ? { encounters } : {}),
  };
  const nextWorldState = replaceErrand(worldState, errands, index, nextErrand);
  const persisted = envoyErrandsOf(nextWorldState).find((row) => row.id === id) || null;
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence: persisted ? [evidenceFor(persisted, 'envoy_terms_agreed', at, {
      parlayId: current.parlayId,
      termSheetId: sheet.id,
      ...(latest ? {
        encounterId: latest.id,
        interceptorId: latest.interceptorId,
        thirdPartyId: latest.interceptorId,
        armyId: latest.armyId,
        venueId: latest.venueId,
      } : {}),
    })] : [],
    errand: persisted,
    reason: persisted ? 'terms_agreed' : 'invalid_result',
  };
}
