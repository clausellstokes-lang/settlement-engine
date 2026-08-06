/**
 * envoyErrand.js — WR-7a's isolated envoy-errand state machine, and the HEAD of its
 * writer family.
 *
 * THE FAMILY (ruling R-BLD-4: the single-writer law reads ONE WRITER FAMILY, never one
 * file). This head owns the departure, the ordinary journey, the mandatory return, every
 * terminal close, the two authorized undos, and the per-tick advance. Its members are:
 *
 *   envoyErrandVocabulary.js   the closed words + the persistence primitives (0 imports)
 *   envoyErrandTransit.js      the family's ONE contact with named-person physics
 *   envoyErrandOffer.js        the authored outcome, the frozen ruling, the episode id
 *   envoyErrandRecords.js      the strict persistence DTOs, total on garbage
 *   envoyErrandLedger.js       the ONE assignment of `worldState.envoyErrands`
 *   envoyErrandEvidence.js     the typed rows the news/belief adapters read
 *   envoyErrandProjection.js   the detached reads integration takes, without write power
 *   envoyErrandParlay.js       the frozen-picture pair + the exact resumed journey
 *   envoyErrandEncounterWriter.js  WR-7b's interception-and-parlay arc
 *
 * The single-writer law is STRONGER after the split, not weaker: the ledger key is now
 * assigned in exactly one function (`writeErrands`), in one file, and every family member
 * reaches the world through it. The public surface below is unchanged — every name this
 * module exported before the split is still exported from here.
 *
 * WHAT THIS MODULE STILL REFUSES TO KNOW. It knows nothing about settlements, deployments,
 * belief truth, route solving, proposal application, or treaty appraisal. Its callers must
 * hand it the already-authored bilateral outcome and exact deployment episode, one durable
 * H1 npc id (never a roster index for this module to turn into one), a closed qualitative
 * departure picture, and legs produced by the shared named-person transit seam.
 *
 * That boundary is the K3 truth firewall: the traveller carries a picture and can move it
 * one qualitative step when an injected rumour arrives, but no member of this family has
 * an import through which it could refresh the picture from live truth.
 *
 * INJECTED-PLAN VALIDATOR (WR-7a law M): this head calls `normalizeRoutePlan` and no
 * longer imports the transit kernel at all. It cannot grow a local speed floor or clock
 * fraction, because the kernel that would make one look legitimate is out of reach; the
 * movement-site manifest records it under that exact route.
 *
 * The core is integration-neutral. It emits typed evidence rows for the later news/belief
 * adapters, but does not write Wizard News or another subsystem's ledger. Every mutator is
 * pure and returns the input world by reference on a no-op. The virtual gate is exact-true
 * and absent from defaults by design.
 */

import { normalizeNegotiationPicture } from './negotiationPictures.js';
import {
  LOSS_CAUSE_SET,
  MAX_CONCURRENT_ENVOYS,
  MAX_ENVOY_RUMOR_REFS,
  PURPOSE_SET,
  TERMINAL_STATES,
  asObject,
  cloneData,
  text,
  wholeTick,
} from './envoyErrandVocabulary.js';
import {
  envoyAttemptIdForOffer,
  envoyDiplomacyActive,
  envoyErrandIdForOffer,
  envoyOfferEpisodeKey,
  normalizeEnvoyAcceptance,
  normalizeEnvoyDepartureSnapshot,
  normalizeEnvoyPeaceOffer,
  stepEnvoyPicture,
} from './envoyErrandOffer.js';
import {
  envoyErrandsOf,
  normalizeEnvoyErrands,
  normalizeErrand,
  normalizeTermSheetResult,
} from './envoyErrandRecords.js';
import {
  normalizePositionRef,
  normalizeRoutePlan,
  scheduledEnvoyPosition,
} from './envoyErrandTransit.js';
import {
  envoyErrandForOffer,
  errandIndex,
  isActiveErrand,
  writeErrands,
} from './envoyErrandLedger.js';
import { evidenceFor, lostErrand, lostEvidence } from './envoyErrandEvidence.js';
import { homeDeliveryFor, silenceEligible } from './envoyErrandProjection.js';
import { mintErrandSpine } from './errandMint.js';

export {
  ENVOY_BELIEVED_RATIO_BANDS, ENVOY_CONTINUATION_SCHEMA_VERSION, ENVOY_ENCOUNTER_KINDS,
  ENVOY_ENCOUNTER_RESOLUTIONS, ENVOY_ENCOUNTER_SCHEMA_VERSION, ENVOY_ENCOUNTER_VENUE_KINDS,
  ENVOY_ERRAND_LEDGER_KEY, ENVOY_ERRAND_STATES, ENVOY_EVIDENCE_KINDS,
  ENVOY_FOUNDING_CAUSE_STATES, ENVOY_JOURNEYS, ENVOY_LOSS_CAUSES,
  ENVOY_MORALE_EXHAUSTION_BANDS, ENVOY_PARLAY_REFUSAL_REASONS,
  ENVOY_PARLAY_REFUSAL_SCHEMA_VERSION, ENVOY_PICTURE_DIRECTIONS, ENVOY_PICTURE_FIELDS,
  ENVOY_POSITION_BANDS, ENVOY_PRIVATE_GOALS, ENVOY_PURPOSES, ENVOY_REQUIRED_RULES,
  ENVOY_STORES_BANDS, ENVOY_STRENGTH_BANDS, MAX_CONCURRENT_ENVOYS,
  MAX_ENVOY_ENCOUNTER_HISTORY, MAX_ENVOY_RUMOR_REFS, MAX_TERMINAL_ENVOY_HISTORY,
} from './envoyErrandVocabulary.js';
export {
  envoyDiplomacyActive, envoyErrandIdForOffer, envoyOfferEpisodeKey,
  normalizeEnvoyAcceptance, normalizeEnvoyDepartureSnapshot, normalizeEnvoyPeaceOffer,
  stepEnvoyPicture,
} from './envoyErrandOffer.js';
export { envoyErrandsOf, normalizeEnvoyErrands, normalizeEnvoyEvidence } from './envoyErrandRecords.js';
export { envoyErrandForOffer, hasActiveEnvoyForNpc, hasActiveEnvoyForOffer } from './envoyErrandLedger.js';
export { envoyEvidenceFor } from './envoyErrandEvidence.js';
export {
  envoyContinuationForHold, envoyEncounterForErrand, envoyTargetCourtPictureForErrand,
  previewEnvoyPosition, projectEnvoyForEncounter, projectErrandPurpose,
} from './envoyErrandProjection.js';
export {
  ENVOY_PURPOSE_CLASSES, ERRAND_CONSUMERS, PURPOSE_CLASS_BY_PURPOSE,
  declaredPurposeClassOf, purposeClassOf,
} from './envoyErrandVocabulary.js';
export { errandSpineActive, errandSpineFields, mintErrandSpine } from './errandMint.js';
export { negotiateEnvoyParlay } from './envoyErrandParlay.js';
export {
  agreeEnvoyTerms, markEnvoyHeld, markEnvoyIntercepted, markEnvoyParlaying, openEnvoyParlay,
  recordEnvoyParlayRefusal, releaseHeldEnvoy, resolveEnvoyInterception, resumeEnvoyJourney,
  updateEnvoyNegotiationPicture,
} from './envoyErrandEncounterWriter.js';

/**
 * Mint one outbound errand.  Idempotence keys on the front episode, not the
 * volatile proposal/outcome id.
 *
 * SP-D: `purposeClass`, `declaredPurpose` and `truePurpose` are the errand spine's
 * generalized cargo. They are ACCEPTED here and INTERPRETED nowhere here — `errandMint.js`
 * owns the gate, the closed vocabulary and the split's invariant, and hands back the
 * conditional field block this row spreads. With `errandSpineEnabled` dark that block is
 * empty, so a war errand minted through this head is byte-identical to the one WR-7a
 * minted before the spine existed.
 */
export function mintEnvoyErrand({
  worldState,
  outcome,
  acceptance,
  npcId,
  npcName = '',
  fromName = '',
  toName = '',
  snapshot,
  negotiationPicture = null,
  targetCourtPicture = null,
  purpose = 'sue',
  purposeClass = null,
  declaredPurpose = null,
  truePurpose = null,
  routePlan,
  tick,
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark' };
  }
  const offer = normalizeEnvoyPeaceOffer(outcome);
  const acceptedRuling = normalizeEnvoyAcceptance(acceptance, offer);
  const personId = text(npcId);
  const picture = normalizeEnvoyDepartureSnapshot(snapshot);
  const missionPurpose = text(purpose);
  const departedTick = wholeTick(tick);
  if (!offer || !personId || !picture || !PURPOSE_SET.has(missionPurpose) || departedTick == null) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'invalid_departure' };
  }
  if (!acceptedRuling) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'invalid_acceptance' };
  }
  const payload = /** @type {Record<string, unknown>} */ (offer.proposalPayload);
  const from = String(payload.offererId);
  const to = String(payload.targetId);
  const existing = envoyErrandForOffer(worldState, offer);
  if (existing) {
    return { worldState, changed: false, evidence: [], errand: existing, reason: 'duplicate_episode' };
  }
  const errands = envoyErrandsOf(worldState);
  if (errands.some((errand) => errand.npcId === personId && isActiveErrand(errand))) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'npc_in_transit' };
  }
  // CR-WIRE-C — CAPACITY COUNTS EPISODES, NOT ERRANDS. `MAX_CONCURRENT_ENVOYS`
  // bounds how many separate NEGOTIATIONS one origin can carry at once, which is
  // what a court's diplomatic reach actually is. A continuation re-mint — the
  // compromise round's next embassy, a resumed mission on a fresh attempt id —
  // carries an episode key the origin is ALREADY running, so it is the same
  // negotiation continuing and takes no second seat. A genuinely NEW mission at
  // capacity still refuses, unchanged. Counting errands made a court that had
  // been refused twice unable to answer at all, which turned the compromise
  // round's own convergence engine off at exactly the episode it was built for.
  const episodeKey = envoyOfferEpisodeKey(offer);
  const activeEpisodesAtOrigin = new Set(errands
    .filter((errand) => errand.from === from && isActiveErrand(errand))
    .map((errand) => envoyOfferEpisodeKey(errand.offer)));
  if (!activeEpisodesAtOrigin.has(episodeKey)
    && activeEpisodesAtOrigin.size >= MAX_CONCURRENT_ENVOYS) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'origin_capacity' };
  }
  // SP-D — THE ONE DELEGATION. The generalized head prices this journey through the
  // family's single transit seam (law M binds every purpose class by construction) and
  // returns the spine's conditional fields. Its refusal reasons are this head's own:
  // `invalid_route_plan` is the WR-7a reason, unchanged, and it is what a dark world can
  // still produce here.
  const spine = mintErrandSpine({
    worldState,
    purpose: missionPurpose,
    purposeClass,
    declaredPurpose,
    truePurpose,
    routePlan,
    fromId: from,
    toId: to,
    journey: 'outbound',
    notBeforeTick: departedTick,
  });
  if (!spine.ok) {
    return { worldState, changed: false, evidence: [], errand: null, reason: spine.reason };
  }
  const plan = /** @type {Record<string, unknown>} */ (spine.plan);
  const errandId = errands.some((row) => envoyOfferEpisodeKey(row.offer) === episodeKey)
    ? envoyAttemptIdForOffer(offer)
    : envoyErrandIdForOffer(offer);
  const fullPicture = negotiationPicture == null
    ? null
    : normalizeNegotiationPicture(negotiationPicture);
  const frozenTargetCourtPicture = targetCourtPicture == null
    ? null
    : normalizeNegotiationPicture(targetCourtPicture);
  if (negotiationPicture != null && (!fullPicture
    || fullPicture.carrier?.kind !== 'envoy'
    || fullPicture.carrier?.id !== errandId
    || fullPicture.partyId !== from
    || fullPicture.counterpartId !== to
    || fullPicture.relationshipKey !== offer.relationshipKey
    || fullPicture.episodeKey !== envoyOfferEpisodeKey(offer)
    || fullPicture.frontOwnerId !== payload.peaceFrontOwnerId
    || Number(fullPicture.frontSinceTick) !== Number(payload.peaceFrontSinceTick)
    || Number(fullPicture.lastChangedTick) > departedTick)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'invalid_negotiation_picture' };
  }
  if (!!fullPicture !== !!frozenTargetCourtPicture
    || (targetCourtPicture != null && (!frozenTargetCourtPicture
      || frozenTargetCourtPicture.carrier?.kind !== 'court'
      || frozenTargetCourtPicture.partyId !== to
      || frozenTargetCourtPicture.counterpartId !== from
      || frozenTargetCourtPicture.relationshipKey !== offer.relationshipKey
      || frozenTargetCourtPicture.episodeKey !== envoyOfferEpisodeKey(offer)
      || frozenTargetCourtPicture.frontOwnerId !== payload.peaceFrontOwnerId
      || Number(frozenTargetCourtPicture.frontSinceTick) !== Number(payload.peaceFrontSinceTick)
      || Number(frozenTargetCourtPicture.lastChangedTick) > departedTick))) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'invalid_target_court_picture' };
  }
  /** @type {Record<string, unknown>} */
  const errand = {
    id: errandId,
    npcId: personId,
    from,
    to,
    purpose: missionPurpose,
    ...spine.fields,
    offer,
    acceptance: acceptedRuling,
    snapshot: picture,
    ...(fullPicture ? { negotiationPicture: fullPicture } : {}),
    ...(frozenTargetCourtPicture ? { targetCourtPicture: frozenTargetCourtPicture } : {}),
    termSheet: null,
    legs: plan.legs,
    positionRef: plan.positionRef,
    departedTick,
    expectedReturnTick: plan.expectedReturnTick,
    state: 'travelling',
    ...(text(npcName) ? { npcName: text(npcName) } : {}),
    ...(text(fromName) ? { fromName: text(fromName) } : {}),
    ...(text(toName) ? { toName: text(toName) } : {}),
  };
  const nextWorldState = writeErrands(worldState, [...errands, errand]);
  const persisted = envoyErrandForOffer(nextWorldState, offer);
  const evidence = persisted ? [
    evidenceFor(persisted, 'envoy_departed', departedTick),
    ...(missionPurpose === 'self_parlay'
      ? [evidenceFor(persisted, 'interceptor_parlays_own_edge', departedTick)]
      : []),
  ] : [];
  return { worldState: nextWorldState, changed: nextWorldState !== worldState, evidence, errand: persisted, reason: 'minted' };
}

/** Update a travelling person's injected transit position, without solving it. */
export function updateEnvoyPosition({ worldState, errandId, positionRef, tick } = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark' };
  }
  const id = text(errandId);
  const now = wholeTick(tick);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  if (!current || now == null || !['travelling', 'returning'].includes(String(current.state))) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_state' };
  }
  const journey = current.state === 'returning' ? 'return' : 'outbound';
  const nextPosition = normalizePositionRef(positionRef, /** @type {Array<Record<string, unknown>>} */ (current.legs), journey);
  if (!nextPosition || JSON.stringify(nextPosition) === JSON.stringify(current.positionRef)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: nextPosition ? 'same_position' : 'invalid_position' };
  }
  const nextErrand = { ...current, positionRef: nextPosition, lastMovedTick: now };
  const next = [...errands];
  next[index] = nextErrand;
  const nextWorldState = writeErrands(worldState, next);
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence: [evidenceFor(nextErrand, 'envoy_on_the_road', now)],
    errand: nextErrand,
    reason: 'position_updated',
  };
}

/**
 * Begin the mandatory return.  A parlay can never jump directly home: the
 * caller must supply a separately-priced return plan, whether or not it carries
 * a term sheet.
 */
export function beginEnvoyReturn({ worldState, errandId, routePlan, termSheet = undefined, tick } = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark' };
  }
  const id = text(errandId);
  const now = wholeTick(tick);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  if (!current || current.state !== 'parlaying' || now == null
    || wholeTick(current.parlayTick) == null || now < Number(current.parlayTick) + 1) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_state' };
  }
  const latest = Array.isArray(current.encounters) ? current.encounters.at(-1) : null;
  const returnOriginId = latest && latest.id === current.parlayId
    ? String(latest.venueId)
    : String(current.to);
  const plan = normalizeRoutePlan(routePlan, {
    fromId: returnOriginId,
    toId: String(current.from),
    journey: 'return',
    notBeforeTick: now,
  });
  if (!plan) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_route_plan' };
  }
  const rawTerms = termSheet === undefined ? current.termSheet : termSheet;
  const termRead = normalizeTermSheetResult(rawTerms);
  const normalizedTerms = termRead.value;
  if (!termRead.valid) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_term_sheet' };
  }
  if (termRead.versioned && JSON.stringify(normalizedTerms) !== JSON.stringify(current.termSheet)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'terms_not_agreed' };
  }
  // A recorded refusal forbids CARRYING terms, never the mandatory return: the
  // envoy still has to walk home empty-handed, and WR-7c owns any retry.
  if (current.parlayRefusal && termRead.versioned) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'parlay_already_refused' };
  }
  if (termRead.versioned
    && now < Number(asObject(normalizedTerms).agreedTick) + 1) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'terms_not_ready' };
  }
  const nextErrand = {
    ...current,
    state: 'returning',
    termSheet: normalizedTerms,
    legs: [.../** @type {Array<Record<string, unknown>>} */ (current.legs), ...plan.legs],
    positionRef: plan.positionRef,
    returnStartedTick: now,
    scheduledHomeTick: plan.expectedReturnTick,
    ...(returnOriginId !== current.to ? { returnOriginId } : {}),
  };
  const next = [...errands];
  next[index] = nextErrand;
  const nextWorldState = writeErrands(worldState, next);
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence: [evidenceFor(nextErrand, 'envoy_returning', now)],
    errand: nextErrand,
    reason: 'returning',
  };
}

/** The return leg must physically mature before the errand can close home. */
export function markEnvoyHome({ worldState, errandId, tick } = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark' };
  }
  const id = text(errandId);
  const now = wholeTick(tick);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  const returnLegs = current
    ? /** @type {Array<Record<string, unknown>>} */ (current.legs).filter((leg) => leg.journey === 'return')
    : [];
  if (!current || current.state !== 'returning' || now == null || !returnLegs.length
    || wholeTick(current.scheduledHomeTick) == null
    || now < Number(returnLegs[returnLegs.length - 1].arrivalTick)
    || now < Number(current.scheduledHomeTick)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_state' };
  }
  const lastIndex = returnLegs.length - 1;
  const last = returnLegs[lastIndex];
  const nextErrand = {
    ...current,
    state: 'home',
    homeTick: now,
    closedTick: now,
    positionRef: {
      journey: 'return',
      legIndex: lastIndex,
      fromId: last.fromId,
      toId: last.toId,
      progressBand: 'arrived',
    },
  };
  const next = [...errands];
  next[index] = nextErrand;
  const nextWorldState = writeErrands(worldState, next);
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence: [evidenceFor(nextErrand, 'envoy_home', now)],
    errand: nextErrand,
    reason: 'home',
  };
}

/** Close one active errand lost. A living overdue envoy uses silence, never this. */
export function markEnvoyLost({ worldState, errandId, tick, cause = 'route_lost' } = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'dark' };
  }
  const id = text(errandId);
  const now = wholeTick(tick);
  const lossCause = text(cause);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  if (!current || !isActiveErrand(current) || now == null || !LOSS_CAUSE_SET.has(lossCause)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'invalid_state' };
  }
  const nextErrand = lostErrand(current, now, lossCause);
  const next = [...errands];
  next[index] = nextErrand;
  const nextWorldState = writeErrands(worldState, next);
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence: lostEvidence(nextErrand, now),
    errand: nextErrand,
    reason: 'lost',
  };
}

/** KILL/death closes every active errand owned by the durable NPC id. */
export function closeEnvoyErrandsForNpcDeath({ worldState, npcId, tick, cause = 'killed' } = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return {
      worldState, changed: false, evidence: [], errands: [], priorErrands: [], evictedErrands: [], reason: 'dark',
    };
  }
  const personId = text(npcId);
  const now = wholeTick(tick);
  const lossCause = text(cause);
  if (!personId || now == null || !['killed', 'dm_removed'].includes(lossCause)) {
    return {
      worldState, changed: false, evidence: [], errands: [], priorErrands: [], evictedErrands: [], reason: 'invalid_death',
    };
  }
  const errands = envoyErrandsOf(worldState);
  const closed = [];
  const priorErrands = [];
  const evidence = [];
  const next = errands.map((errand) => {
    if (errand.npcId !== personId || !isActiveErrand(errand)) return errand;
    priorErrands.push(errand);
    const lost = lostErrand(errand, now, lossCause);
    closed.push(lost);
    evidence.push(...lostEvidence(lost, now));
    return lost;
  });
  if (!closed.length) {
    return {
      worldState, changed: false, evidence: [], errands: [], priorErrands: [], evictedErrands: [], reason: 'no_active_errand',
    };
  }
  const nextWorldState = writeErrands(worldState, next);
  const persistedIds = new Set(envoyErrandsOf(nextWorldState).map((errand) => String(errand.id)));
  const evictedErrands = errands.filter((errand) => (
    TERMINAL_STATES.has(String(errand.state)) && !persistedIds.has(String(errand.id))
  ));
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence,
    errands: normalizeEnvoyErrands(closed),
    priorErrands: normalizeEnvoyErrands(priorErrands),
    evictedErrands: normalizeEnvoyErrands(evictedErrands),
    reason: 'lost',
  };
}

/** Integration-facing spelling: a KILL/death loses every active errand for this NPC. */
export function loseEnvoyForNpc(args = {}) {
  return closeEnvoyErrandsForNpcDeath(args);
}

/**
 * Restore the exact pre-KILL rows during an authorized DM undo. The operation is
 * atomic and conflict-safe: every current row must still be precisely the loss
 * produced from its supplied prior row at `killedAtTick`. `evictedErrands`
 * carries any older terminal rows displaced by the bounded archive write, so a
 * successful undo restores the full prior ledger rather than only the traveller.
 * Later movement, a conflicting archive row, another loss, or malformed undo
 * cargo makes this a no-op.
 */
export function restoreEnvoyErrands({
  worldState,
  priorErrands,
  evictedErrands = [],
  killedAtTick,
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], errands: [], reason: 'dark' };
  }
  const deathTick = wholeTick(killedAtTick);
  if (deathTick == null || !Array.isArray(priorErrands) || !priorErrands.length) {
    return { worldState, changed: false, evidence: [], errands: [], reason: 'invalid_restore' };
  }
  const prior = priorErrands.map(normalizeErrand);
  const ids = prior.map((errand) => text(errand?.id));
  const evicted = Array.isArray(evictedErrands) ? evictedErrands.map(normalizeErrand) : null;
  if (prior.some((errand) => !errand || !isActiveErrand(errand))
    || new Set(ids).size !== ids.length || !evicted
    || evicted.some((errand) => !errand || !TERMINAL_STATES.has(String(errand.state)))
    || new Set(evicted.map((errand) => text(errand?.id))).size !== evicted.length
    || evicted.some((errand) => ids.includes(text(errand?.id)))) {
    return { worldState, changed: false, evidence: [], errands: [], reason: 'invalid_restore' };
  }
  const errands = envoyErrandsOf(worldState);
  if (/** @type {Array<Record<string, unknown>>} */ (prior).some((candidate) => (
    errands.some((errand) => errand.npcId === candidate.npcId
      && isActiveErrand(errand) && !ids.includes(String(errand.id)))
  ))) {
    return { worldState, changed: false, evidence: [], errands: [], reason: 'restore_conflict' };
  }
  if (evicted.some((errand) => errandIndex(errands, text(errand?.id)) >= 0)) {
    return { worldState, changed: false, evidence: [], errands: [], reason: 'restore_conflict' };
  }
  const replacements = new Map();
  for (const candidate of /** @type {Array<Record<string, unknown>>} */ (prior)) {
    const index = errandIndex(errands, String(candidate.id));
    const current = index >= 0 ? errands[index] : null;
    if (!current || current.state !== 'lost'
      || !['killed', 'dm_removed'].includes(String(current.lossCause))
      || Number(current.lostTick) !== deathTick || Number(current.closedTick) !== deathTick) {
      return { worldState, changed: false, evidence: [], errands: [], reason: 'restore_conflict' };
    }
    const expectedClosure = normalizeErrand(lostErrand(candidate, deathTick, String(current.lossCause)));
    if (!expectedClosure || JSON.stringify(expectedClosure) !== JSON.stringify(current)) {
      return { worldState, changed: false, evidence: [], errands: [], reason: 'restore_conflict' };
    }
    replacements.set(String(candidate.id), candidate);
  }
  const next = [
    ...errands.map((errand) => replacements.get(String(errand.id)) || errand),
    .../** @type {Array<Record<string, unknown>>} */ (evicted),
  ];
  const nextWorldState = writeErrands(worldState, next);
  if (nextWorldState === worldState) {
    return { worldState, changed: false, evidence: [], errands: [], reason: 'restore_conflict' };
  }
  return {
    worldState: nextWorldState,
    changed: true,
    evidence: [],
    errands: [...replacements.values()].map((row) => normalizeErrand(row)),
    reason: 'restored',
  };
}

/**
 * Restore the exact held row after an authorized PARDON undo.
 *
 * This is deliberately ungated cleanup: a later rules edit may darken envoy
 * diplomacy, but it must not strand a release that an undo still owns.  The
 * released row is the conflict token.  Any subsequent movement, evidence
 * patch, second release, or competing active errand for the same person makes
 * the inverse a no-op.
 */
export function restoreReleasedEnvoy({
  worldState,
  priorErrand,
  releasedErrand,
  releaseTick,
} = {}) {
  const at = wholeTick(releaseTick);
  const prior = normalizeErrand(priorErrand);
  const released = normalizeErrand(releasedErrand);
  if (at == null || !prior || !released || prior.state !== 'held'
    || !['travelling', 'returning'].includes(String(released.state))
    || prior.id !== released.id || prior.npcId !== released.npcId
    || Number(released.releasedTick) !== at) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'invalid_restore' };
  }
  const priorEncounter = Array.isArray(prior.encounters) ? prior.encounters.at(-1) : null;
  const releasedEncounter = Array.isArray(released.encounters) ? released.encounters.at(-1) : null;
  if (!priorEncounter || !releasedEncounter
    || priorEncounter.id !== releasedEncounter.id
    || priorEncounter.resolution !== 'held'
    || !['resumed', 'plant_resumed'].includes(String(releasedEncounter.resolution))
    || Number(releasedEncounter.resolvedTick) !== at
    || Number(releasedEncounter.continuation?.resumedTick) !== at
    || releasedEncounter.continuation?.resumeState !== released.state) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'invalid_restore' };
  }
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, String(prior.id));
  const current = index >= 0 ? errands[index] : null;
  if (!current || JSON.stringify(current) !== JSON.stringify(released)
    || errands.some((errand) => errand.id !== prior.id
      && errand.npcId === prior.npcId && isActiveErrand(errand))) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'restore_conflict' };
  }
  const nextWorldState = writeErrands(worldState, [
    ...errands.slice(0, index),
    prior,
    ...errands.slice(index + 1),
  ]);
  const persisted = envoyErrandsOf(nextWorldState).find((errand) => errand.id === prior.id) || null;
  if (!persisted || JSON.stringify(persisted) !== JSON.stringify(prior)) {
    return { worldState, changed: false, evidence: [], errand: current, reason: 'restore_conflict' };
  }
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence: [],
    errand: persisted,
    reason: 'restored',
  };
}

/**
 * The K.7 jewel: once the immutable departure window has passed, emit one
 * hostility inference and remember that it was emitted. A terminal loss is
 * still only remote truth until some later observation reaches home.
 */
export function advanceEnvoySilence({ worldState, tick, canInferSilenceFor = null } = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, evidence: [], inferredErrandIds: [] };
  }
  const now = wholeTick(tick);
  if (now == null) return { worldState, changed: false, evidence: [], inferredErrandIds: [] };
  const errands = envoyErrandsOf(worldState);
  const evidence = [];
  const inferredErrandIds = [];
  const next = errands.map((errand) => {
    if (!silenceEligible(errand, now)
      || (typeof canInferSilenceFor === 'function'
        && canInferSilenceFor(/** @type {Record<string, unknown>} */ (cloneData(errand)), now) !== true)) {
      return errand;
    }
    const inferred = { ...errand, silenceInferredAtTick: now };
    inferredErrandIds.push(String(errand.id));
    evidence.push(evidenceFor(inferred, 'envoy_silence_inference', now));
    return inferred;
  });
  if (!inferredErrandIds.length) {
    return { worldState, changed: false, evidence: [], inferredErrandIds: [] };
  }
  const nextWorldState = writeErrands(worldState, next);
  return { worldState: nextWorldState, changed: nextWorldState !== worldState, evidence, inferredErrandIds };
}

/** Apply one injected, idempotent rumour patch to one active envoy picture. */
export function applyEnvoyRumorPatch({ worldState, errandId, patch } = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return { worldState, changed: false, errand: null, reason: 'dark' };
  }
  const id = text(errandId);
  const rumor = asObject(patch);
  const sourceEventId = text(rumor.sourceEventId);
  const errands = envoyErrandsOf(worldState);
  const index = errandIndex(errands, id);
  const current = index >= 0 ? errands[index] : null;
  if (!current || !isActiveErrand(current) || !sourceEventId) {
    return { worldState, changed: false, errand: current, reason: 'invalid_patch' };
  }
  const heard = Array.isArray(current.heardRumorIds) ? current.heardRumorIds.map(String) : [];
  if (heard.includes(sourceEventId)) {
    return { worldState, changed: false, errand: current, reason: 'rumor_already_heard' };
  }
  const snapshot = stepEnvoyPicture(current.snapshot, rumor);
  if (!snapshot) {
    return { worldState, changed: false, errand: current, reason: 'invalid_picture' };
  }
  const nextErrand = {
    ...current,
    snapshot,
    heardRumorIds: [...heard, sourceEventId].slice(-MAX_ENVOY_RUMOR_REFS),
  };
  const next = [...errands];
  next[index] = nextErrand;
  const nextWorldState = writeErrands(worldState, next);
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    errand: nextErrand,
    reason: JSON.stringify(snapshot) === JSON.stringify(current.snapshot) ? 'rumor_recorded' : 'picture_stepped',
  };
}

/**
 * Advance every active errand against its injected, pre-priced leg schedule.
 * The optional `rumorPatchFor(errand, tick)` may return at most one patch for
 * that person this tick; the one-band-step wall remains inside this writer.
 *
 * @param {{worldState?:unknown,tick?:unknown,
 *   rumorPatchFor?:((errand:Record<string,unknown>,tick:number)=>unknown)|null,
 *   canInferSilenceFor?:((errand:Record<string,unknown>,tick:number)=>boolean)|null,
 *   isReturnVisibleFor?:((errand:Record<string,unknown>,tick:number)=>boolean)|null}} [args]
 * @returns {{worldState:unknown,changed:boolean,evidence:Array<Record<string,unknown>>,
 *   transitionEvidence:Array<Record<string,unknown>>,
 *   silenceInferences:Array<Record<string,unknown>>,
 *   homeDeliveries:Array<Record<string,unknown>>}}
 */
export function advanceEnvoyErrands({
  worldState,
  tick,
  rumorPatchFor = null,
  canInferSilenceFor = null,
  isReturnVisibleFor = null,
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return {
      worldState,
      changed: false,
      evidence: [],
      transitionEvidence: [],
      silenceInferences: [],
      homeDeliveries: [],
    };
  }
  const now = wholeTick(tick);
  if (now == null) {
    return {
      worldState,
      changed: false,
      evidence: [],
      transitionEvidence: [],
      silenceInferences: [],
      homeDeliveries: [],
    };
  }
  const transitionEvidence = [];
  const silenceInferences = [];
  const homeDeliveries = [];
  let touched = false;
  const next = envoyErrandsOf(worldState).map((rawErrand) => {
    let errand = rawErrand;
    if (errand.state === 'travelling' || errand.state === 'returning') {
      const scheduled = scheduledEnvoyPosition(errand, now);
      if (scheduled) {
        const oldPosition = JSON.stringify(errand.positionRef);
        if (scheduled.complete && errand.state === 'travelling') {
          const parlayId = `target_parlay:${errand.id}:${now}`;
          errand = {
            ...errand,
            state: 'parlaying',
            parlayTick: now,
            parlayId,
            positionRef: scheduled.positionRef,
          };
          touched = true;
          transitionEvidence.push(evidenceFor(errand, 'envoy_on_the_road', now));
          transitionEvidence.push(evidenceFor(errand, 'envoy_parlaying', now, { parlayId }));
        } else if (scheduled.complete && errand.state === 'returning') {
          if (oldPosition !== JSON.stringify(scheduled.positionRef)) {
            errand = { ...errand, positionRef: scheduled.positionRef, lastMovedTick: now };
            touched = true;
            transitionEvidence.push(evidenceFor(errand, 'envoy_on_the_road', now));
          }
          // Arrival earns a delivery attempt, not a terminal state. The pulse
          // compositor adopts `home` only if the ordinary peace apply succeeds;
          // otherwise this returning row retries on the next pulse.
          if (wholeTick(errand.scheduledHomeTick) != null
            && now >= Number(errand.scheduledHomeTick)) {
            homeDeliveries.push(homeDeliveryFor(errand));
          }
        } else if (oldPosition !== JSON.stringify(scheduled.positionRef)) {
          errand = { ...errand, positionRef: scheduled.positionRef, lastMovedTick: now };
          touched = true;
          transitionEvidence.push(evidenceFor(errand, 'envoy_on_the_road', now));
        }
      }
    }

    if (typeof rumorPatchFor === 'function' && isActiveErrand(errand)) {
      // A detached input prevents an integration callback from mutating the row
      // this writer is still folding.
      const supplied = rumorPatchFor(/** @type {Record<string, unknown>} */ (cloneData(errand)), now);
      const rumor = asObject(supplied);
      const sourceEventId = text(rumor.sourceEventId);
      const heard = Array.isArray(errand.heardRumorIds) ? errand.heardRumorIds.map(String) : [];
      if (sourceEventId && !heard.includes(sourceEventId)) {
        const snapshot = stepEnvoyPicture(errand.snapshot, rumor);
        if (snapshot) {
          errand = {
            ...errand,
            snapshot,
            heardRumorIds: [...heard, sourceEventId].slice(-MAX_ENVOY_RUMOR_REFS),
          };
          touched = true;
        }
      }
    }

    const returnVisible = typeof isReturnVisibleFor === 'function'
      ? isReturnVisibleFor(/** @type {Record<string, unknown>} */ (cloneData(errand)), now) === true
      : null;
    if (silenceEligible(errand, now, returnVisible)
      && (typeof canInferSilenceFor !== 'function'
        || canInferSilenceFor(/** @type {Record<string, unknown>} */ (cloneData(errand)), now) === true)) {
      errand = { ...errand, silenceInferredAtTick: now };
      touched = true;
      silenceInferences.push(evidenceFor(errand, 'envoy_silence_inference', now));
    }
    return errand;
  });
  if (!touched) {
    return {
      worldState,
      changed: false,
      evidence: [],
      transitionEvidence: [],
      silenceInferences: [],
      homeDeliveries,
    };
  }
  const nextWorldState = writeErrands(worldState, next);
  return {
    worldState: nextWorldState,
    changed: nextWorldState !== worldState,
    evidence: [...transitionEvidence, ...silenceInferences],
    transitionEvidence,
    silenceInferences,
    homeDeliveries,
  };
}
