/**
 * envoyErrand/records — the strict persistence DTOs of one errand and its witnesses.
 *
 * A PURE LEAF OF THE ENVOY-ERRAND WRITER FAMILY (ruling R-BLD-4). `envoyErrand.js` remains
 * the family HEAD and the only place a ledger WRITE originates; this leaf owns the shape
 * every write must survive, and it is total on garbage — a forged row produces `null`,
 * never a throw and never a half-trusted object.
 *
 *   THE ROW — `normalizeErrand` is the whole cross-field law of an errand: the journey is
 *     contiguous and correctly directed, the phase clocks agree with the phase, the frozen
 *     pictures belong to this episode and to these two parties, a carried sheet names this
 *     errand, and no lifecycle fact predates the departure it belongs to.
 *   THE WITNESSES — the encounter, the parlay refusal and the resume continuation. Each is
 *     an EXACT-KEY DTO with a schema version: an import may not add a field, drop a field,
 *     or downgrade malformed versioned cargo into a permissive legacy object.
 *   THE ARCHIVE — `normalizeEnvoyErrands` never evicts an ACTIVE errand; only the terminal
 *     tail is bounded, so a bounded write can never strand a live traveller.
 *
 * K3 (NOBODY IS EVER CURRENT): the reach is the vocabulary, the offer leaf, the transit
 * leaf and the picture machinery. None of them can hand back a settlement's real strength,
 * stock or pressure — the frozen pictures are the only evidence in the file.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/envoyErrand.test.js + tests/domain/envoyK3BeliefSeam.test.js
 */
import {
  normalizeNegotiationPicture,
  normalizeParlayTermSheet,
} from './negotiationPictures.js';
import {
  CONTINUATION_KEYS,
  COVERT_GATHERED_KEYS,
  COVERT_GATHERED_SENT_KEYS,
  COVERT_KEYS,
  COVERT_DEMAND_SET,
  COVERT_FACE_SET,
  COVERT_LEG_REF_SET,
  COVERT_PRODUCT_SET,
  COVERT_STOP_KEYS,
  COVERT_TAP_SET,
  ENCOUNTER_KEYS,
  ENCOUNTER_KIND_SET,
  ENCOUNTER_RESOLUTION_SET,
  ENCOUNTER_VENUE_KIND_SET,
  ENVOY_CONTINUATION_SCHEMA_VERSION,
  ENVOY_ENCOUNTER_SCHEMA_VERSION,
  ENVOY_ERRAND_LEDGER_KEY,
  ENVOY_PARLAY_REFUSAL_SCHEMA_VERSION,
  EVIDENCE_KIND_SET,
  JOURNEY_SET,
  LOSS_CAUSE_SET,
  MAX_COVERT_GATHERED,
  MAX_COVERT_ITINERARY_STOPS,
  MAX_ENVOY_ENCOUNTER_HISTORY,
  MAX_ENVOY_RUMOR_REFS,
  MAX_TERMINAL_ENVOY_HISTORY,
  PARLAY_REFUSAL_KEYS,
  PARLAY_REFUSAL_REASON_SET,
  PRIVATE_GOAL_SET,
  PURPOSE_CLASS_SET,
  PURPOSE_SET,
  REFUSAL_BEARING_STATES,
  STATE_SET,
  TERMINAL_STATES,
  asObject,
  cloneData,
  compareCodepoint,
  hasExactKeys,
  purposeClassOf,
  stableIdentity,
  strictText,
  text,
  wholeTick,
} from './envoyErrandVocabulary.js';
import {
  envoyAttemptIdForOffer,
  envoyErrandIdForOffer,
  envoyOfferEpisodeKey,
  normalizeEnvoyAcceptance,
  normalizeEnvoyDepartureSnapshot,
  normalizeEnvoyPeaceOffer,
} from './envoyErrandOffer.js';
import {
  normalizeHistoricalPosition,
  normalizeLeg,
  normalizePositionRef,
  validJourneyRoute,
} from './envoyErrandTransit.js';

export function parlayRefusalId(errandId, parlayId, attemptedTick) {
  return `envoy_parlay_refusal:${stableIdentity([errandId, parlayId, attemptedTick])}`;
}

export function normalizeParlayRefusalReason(value) {
  const reason = strictText(value);
  if (PARLAY_REFUSAL_REASON_SET.has(reason)) return reason;
  return ['proposer_has_no_sheet', 'invalid_proposer_evaluation', 'invalid_responder_evaluation']
    .includes(reason)
    ? 'no_sheet'
    : '';
}

export function normalizeParlayRefusal(raw) {
  const row = asObject(raw);
  if (!hasExactKeys(row, PARLAY_REFUSAL_KEYS)
    || row.schemaVersion !== ENVOY_PARLAY_REFUSAL_SCHEMA_VERSION) return null;
  const id = strictText(row.id);
  const parlayId = strictText(row.parlayId);
  const attemptedTick = wholeTick(row.attemptedTick);
  const proposerPictureId = strictText(row.proposerPictureId);
  const responderPictureId = strictText(row.responderPictureId);
  const reason = normalizeParlayRefusalReason(row.reason);
  if (!id || !parlayId || attemptedTick == null || !proposerPictureId
    || !responderPictureId || proposerPictureId === responderPictureId || !reason
    || reason !== row.reason) return null;
  return {
    schemaVersion: ENVOY_PARLAY_REFUSAL_SCHEMA_VERSION,
    id,
    parlayId,
    attemptedTick,
    proposerPictureId,
    responderPictureId,
    reason,
  };
}

export function normalizeEncounterVenueRef(raw, venueId, routeId) {
  const row = asObject(raw);
  if (!hasExactKeys(row, ['id', 'kind'])) return null;
  const id = strictText(row.id);
  const kind = strictText(row.kind);
  if (!id || id !== venueId || !ENCOUNTER_VENUE_KIND_SET.has(kind)
    || (kind === 'field_node' && !routeId)) return null;
  return { id, kind };
}

/** @param {unknown} raw */
export function normalizeEncounterContinuation(raw) {
  if (raw == null) return null;
  const row = asObject(raw);
  if (!hasExactKeys(row, CONTINUATION_KEYS)
    || row.schemaVersion !== ENVOY_CONTINUATION_SCHEMA_VERSION) return null;
  const resumeState = strictText(row.resumeState);
  const journey = strictText(row.journey);
  const destinationId = strictText(row.destinationId);
  const resumedTick = wholeTick(row.resumedTick);
  const scheduledArrivalTick = wholeTick(row.scheduledArrivalTick);
  if (!['travelling', 'returning'].includes(resumeState)
    || !JOURNEY_SET.has(journey)
    || (resumeState === 'travelling') !== (journey === 'outbound')
    || !destinationId || resumedTick == null || scheduledArrivalTick == null
    || scheduledArrivalTick < resumedTick) return null;
  return {
    schemaVersion: ENVOY_CONTINUATION_SCHEMA_VERSION,
    resumeState,
    journey,
    destinationId,
    resumedTick,
    scheduledArrivalTick,
  };
}

/** Strict, complete persistence DTO for one actual army/envoy collision. */
export function normalizeEnvoyEncounter(raw) {
  const row = asObject(raw);
  if (!hasExactKeys(row, ENCOUNTER_KEYS)
    || row.schemaVersion !== ENVOY_ENCOUNTER_SCHEMA_VERSION) return null;
  const id = strictText(row.id);
  const kind = strictText(row.kind);
  const interceptorId = strictText(row.interceptorId);
  const armyId = strictText(row.armyId);
  const venueId = strictText(row.venueId);
  const routeId = row.routeId == null ? null : strictText(row.routeId);
  const venueRef = normalizeEncounterVenueRef(row.venueRef, venueId, routeId);
  const encounteredTick = wholeTick(row.encounteredTick);
  const resolvedTick = row.resolvedTick == null ? null : wholeTick(row.resolvedTick);
  const priorState = strictText(row.priorState);
  const priorJourney = strictText(row.priorJourney);
  const destinationId = strictText(row.destinationId);
  const privateGoal = row.privateGoal == null ? null : strictText(row.privateGoal);
  const resolution = strictText(row.resolution);
  const interceptorPictureId = strictText(row.interceptorPictureId);
  const interceptorPicture = normalizeNegotiationPicture(row.interceptorPicture);
  const termSheetId = row.termSheetId == null ? null : strictText(row.termSheetId);
  if (!id || !ENCOUNTER_KIND_SET.has(kind) || !interceptorId || !armyId || !venueId
    || !venueRef || (row.routeId != null && !routeId) || encounteredTick == null
    || !['travelling', 'returning'].includes(priorState)
    || !JOURNEY_SET.has(priorJourney)
    || (priorState === 'travelling') !== (priorJourney === 'outbound')
    || !destinationId || !ENCOUNTER_RESOLUTION_SET.has(resolution)
    || !interceptorPictureId || !interceptorPicture
    || interceptorPicture.id !== interceptorPictureId
    || interceptorPicture.carrier?.kind !== 'army'
    || interceptorPicture.carrier?.id !== armyId
    || interceptorPicture.partyId !== interceptorId
    || Number(interceptorPicture.lastChangedTick) > Number(encounteredTick)
    || (row.termSheetId != null && !termSheetId)) return null;
  if ((kind === 'private_goal') !== !!privateGoal
    || (privateGoal && !PRIVATE_GOAL_SET.has(privateGoal))) return null;
  const priorPosition = normalizeHistoricalPosition(row.priorPosition, priorJourney);
  if (!priorPosition) return null;
  const continuation = normalizeEncounterContinuation(row.continuation);
  if (resolution === 'pending') {
    if (resolvedTick != null || continuation) return null;
  } else if (resolvedTick == null || resolvedTick < encounteredTick + 1) {
    return null;
  }
  if (['resumed', 'plant_resumed'].includes(resolution)) {
    if (!continuation || Number(continuation.resumedTick) !== resolvedTick
      || continuation.resumeState !== priorState || continuation.journey !== priorJourney
      || continuation.destinationId !== destinationId) return null;
  } else if (continuation) return null;
  return {
    schemaVersion: ENVOY_ENCOUNTER_SCHEMA_VERSION,
    id,
    kind,
    interceptorId,
    armyId,
    venueId,
    venueRef,
    routeId,
    encounteredTick,
    resolvedTick,
    priorState,
    priorJourney,
    priorPosition,
    destinationId,
    continuation,
    privateGoal,
    resolution,
    interceptorPictureId,
    interceptorPicture,
    termSheetId,
  };
}

export function encounterOrder(left, right) {
  return Number(left.encounteredTick) - Number(right.encounteredTick)
    || compareCodepoint(String(left.id), String(right.id));
}

/**
 * WR-7a sheets remain opaque JSON cargo. A version marker opts into WR-7b's
 * exact carried-sheet contract; malformed versioned cargo must not be silently
 * downgraded to a permissive legacy object.
 */
export function normalizeTermSheetResult(raw) {
  if (raw == null) return { valid: true, value: null, versioned: false };
  const row = asObject(raw);
  if (Object.prototype.hasOwnProperty.call(row, 'schemaVersion')) {
    const exact = normalizeParlayTermSheet(raw);
    return exact
      ? { valid: true, value: exact, versioned: true }
      : { valid: false, value: null, versioned: true };
  }
  const cloned = cloneData(raw);
  const legacy = asObject(cloned);
  return Object.keys(legacy).length
    ? { valid: true, value: legacy, versioned: false }
    : { valid: false, value: null, versioned: false };
}

export function normalizeTermSheet(raw) {
  return normalizeTermSheetResult(raw).value;
}

/**
 * SP-D — the errand spine's conditional field block, read off a persisted or imported row.
 *
 * THIS IS THE ONLY PLACE THE THREE FIELDS SURVIVE A WRITE. Every path into
 * `worldState.envoyErrands` runs through `writeErrands` -> `normalizeEnvoyErrands` ->
 * `normalizeErrand`, and that normalizer builds its output from an EXPLICIT key list. A
 * field the list does not name is not rejected; it EVAPORATES, silently, on the first
 * persist — which is exactly how a mint that looked correct in memory would have shipped
 * a class nobody could ever read back. The lifecycle-totality suite exists because that
 * failure is invisible in a unit test of the mint.
 *
 * HEALS RATHER THAN REFUSES (SP §4's import clause: validate against the closed
 * vocabulary and DROP unknown fields, never null-fill). A forged or stale class word does
 * not destroy the errand; the field drops and the row reads its derived class, which for
 * every war purpose is `diplomatic`. So a save written by a newer vocabulary opens on an
 * older build as an honest embassy rather than as a missing traveller.
 *
 * THE PAIR IS ATOMIC AND FAIL-CLOSED. `declaredPurpose`/`truePurpose` survive only
 * TOGETHER, only when both are lawful words, only when they DIFFER, and only when the
 * true half agrees with the row's resolved class. Anything else drops both, which lands
 * on the honest side: an errand can lose a cover story it should have kept, and can never
 * gain a secret it never had.
 *
 * ⚠⚠ THREE DOORS, AND EACH IS PINNED ALONE (repair SP-D-R4, 2026-08-06). The `split`
 * conjunction below has three conjuncts, and the landing wave proved it by deleting the
 * WHOLE expression — the JOINT pin this estate's defense-in-depth corollary forbids as
 * sufficient. Deleted SEPARATELY, two of the three survived the entire SP-D battery at
 * 55 passed (55): the declared-word vocabulary check, and the `declared !== resolved`
 * redundancy check. Each now has its own row in
 * tests/domain/envoyErrandSpineLifecycle.test.js. DO NOT re-prove this expression by
 * deleting it whole; delete each conjunct.
 *
 * ⚠ THIS BLOCK IS UNGATED BY DESIGN, AND IT IS THE SPINE'S ONE ASYMMETRY (repair
 * SP-D-R5). `errandSpineActive` is read once, at the MINT. A row IMPORTED into a dark
 * world therefore KEEPS lawful spine cargo instead of having it stripped. Gating here was
 * executed and rejected: it works, and it breaks UNDO, because threading a world into a
 * pure persistence normalizer leaves every caller without one holding a different answer.
 * The cargo is inert while dark — nothing outside this family reads the three fields —
 * so preservation costs nothing and destruction would cost a campaign its history.
 *
 * @param {Record<string, unknown>} row the raw errand
 * @param {string} purpose the row's already-validated war purpose
 * @returns {Record<string, unknown>} the three SP-D word fields, plus ES-1's `covert`
 *   sub-record — the one member of this block that is not a string
 */
export function errandSpineBlock(row, purpose) {
  const written = text(row.purposeClass);
  const purposeClass = PURPOSE_CLASS_SET.has(written) ? written : '';
  const resolved = purposeClassOf({ purpose, purposeClass });
  const declared = text(row.declaredPurpose);
  const claimedTrue = text(row.truePurpose);
  const split = PURPOSE_CLASS_SET.has(declared)
    && claimedTrue === resolved
    && declared !== resolved;
  // ⚠⚠ ES-1 REPAIR R1 — THE FACELESS COVERT ROW IS LAWFUL HERE AND MUTE AT THE READER.
  // A row can reach this block declaring `purposeClass` covert with its `declaredPurpose`/
  // `truePurpose` pair broken or stripped — an import forgery, or either of the two SP-D-R4
  // doors below dropping a malformed pair. Healing that by dropping the class was EXECUTED
  // AND REJECTED at this repair: it reds the three SP-D-R4 door pins that deliberately
  // require the class to outlive a broken pair, and it destroys campaign history for the
  // same reason repair SP-D-R5 already refused to strip cargo on this seam — a persistence
  // normalizer is the wrong place to decide a row should forget what it was. THE VEIL IS
  // ENFORCED AT `declaredPurposeClassOf` INSTEAD, the estate's ONE public reader of an
  // errand's face, which now fails closed by shape rather than by the caller's care. See
  // its header in envoyErrandVocabulary.js; the leak this closes was executed and is
  // pinned in tests/domain/espionageMission.test.js.
  //
  // ES-1 — THE COVERT SUB-RECORD RIDES THE SAME ONE CONSTRUCTOR, and the class law lives
  // HERE rather than at each caller: a `covert` block on a row whose RESOLVED class is
  // anything else is not a mission, it is cargo somebody attached to the wrong journey,
  // and it is dropped. The mint refuses that same cargo with a reason instead of dropping
  // it, which is the difference between an import healing and a writer being wrong.
  const covert = resolved === 'covert' ? normalizeCovertMission(row.covert).covert : null;
  return {
    // Written only when it differs from what the mapping row derives — the same
    // drop-when-derivable rule the mint applies, so a persist is idempotent.
    ...(purposeClass && purposeClass !== purposeClassOf({ purpose }) ? { purposeClass } : {}),
    ...(covert ? { covert } : {}),
    ...(split ? { declaredPurpose: declared, truePurpose: resolved } : {}),
  };
}

/**
 * ES-1 — THE COVERT SUB-RECORD'S ONE VALIDATION, AND IT HANDS BACK ITS REASON.
 *
 * Two consumers need different things from the same law and neither may spell it twice.
 * The PERSIST side (`errandSpineBlock`, above) needs a malformed sub-record to heal to
 * ABSENT — §1's rule is that a covert mission with corrupt cargo degrades to an ordinary
 * errand of its declared class rather than nulling the whole errand and dropping a
 * traveller. The MINT side needs to REFUSE the same cargo BY NAME, because a writer that
 * hands the spine a five-stop itinerary has a bug the estate should hear about. So this
 * returns both halves of one answer: the record, and why there isn't one.
 *
 * ⚠ THE KEY GUARD IS THE TRIPWIRE, AND ES-3 PAID IT. `gathered` and `standoff` joined
 * `COVERT_KEYS` in the commit that first WROTE them, which is exactly what the ES-1
 * spelling of this comment demanded. The discipline it recorded still binds every later
 * wave: a sub-record carrying a key this list does not know is REFUSED rather than
 * silently trimmed, because silent trimming is the ghost-write class — an amender writes
 * the gradient, the next persist erases it, and both halves look correct in isolation.
 *
 * ⚠ THE GRADIENT IS BOUNDED BY THE DTO, NOT BY THE AMENDER'S GOOD MANNERS. §3.4b's soft
 * bound (gather-or-govern) is what SHOULD end a rooted stay; `MAX_COVERT_GATHERED` is the
 * backstop the ledger itself enforces — three stops, each with its minted stay plus its
 * rooted re-samples. That number is DERIVED from the two caps rather than authored, so a
 * wave that widens either cannot leave this bound behind.
 *
 * ⚠ `sentHome` IS ADMITTED ONLY AS `true`, AND THAT IS THE LOSE-THE-SPY RULE'S ONE DOOR.
 * It marks a partial magic already carried home (addition E). `false` is not a lawful
 * value — the ABSENCE is the negative (T4: a key is a byte) — and a forged import claiming
 * everything already landed is refused here rather than believed at the home mouth.
 *
 * TOTAL ON GARBAGE: any shape at all produces a reason, never a throw.
 *
 * @param {unknown} raw
 * @returns {{covert: Record<string, unknown>|null, reason: string}}
 */
export function normalizeCovertMission(raw) {
  if (raw == null) return { covert: null, reason: 'absent' };
  const row = asObject(raw);
  if (!Object.keys(row).length || Object.keys(row).some((key) => !COVERT_KEYS.includes(key))) {
    return { covert: null, reason: 'invalid_covert_keys' };
  }
  if (!Array.isArray(row.itinerary) || !row.itinerary.length) {
    return { covert: null, reason: 'invalid_itinerary' };
  }
  if (row.itinerary.length > MAX_COVERT_ITINERARY_STOPS) {
    return { covert: null, reason: 'itinerary_too_long' };
  }
  const itinerary = [];
  for (const entry of row.itinerary) {
    const stop = asObject(entry);
    const settlementId = strictText(stop.settlementId);
    const face = text(stop.face);
    const stayTicks = wholeTick(stop.stayTicks);
    if (!settlementId || !COVERT_FACE_SET.has(face) || stayTicks == null
      || !hasExactKeys(stop, COVERT_STOP_KEYS)) {
      return { covert: null, reason: 'invalid_itinerary' };
    }
    itinerary.push({ face, settlementId, stayTicks });
  }
  // One stop per place. A repeated settlement would make the per-stop keyed-hash roll
  // ES-2 owns collide with itself, and it is never what a planner meant.
  if (new Set(itinerary.map((stop) => stop.settlementId)).size !== itinerary.length) {
    return { covert: null, reason: 'invalid_itinerary' };
  }
  const product = text(row.product);
  if (!COVERT_PRODUCT_SET.has(product)) return { covert: null, reason: 'invalid_product' };
  const demand = text(row.demand);
  if (!COVERT_DEMAND_SET.has(demand)) return { covert: null, reason: 'invalid_demand' };
  const subjectId = strictText(row.subjectId);
  if (!subjectId) return { covert: null, reason: 'invalid_subject' };
  let legRefs = /** @type {string[]|null} */ (null);
  if (row.legRefs != null) {
    // ⟨F5⟩ ONLY an ACQUIRE targets legs — a confirm re-reads what the court already
    // believes and a refute contradicts it, so neither has a leg list to fill. And
    // `pullBand` is not in the set, so naming it lands here rather than minting a
    // member no product can ever satisfy.
    const refs = Array.isArray(row.legRefs) ? row.legRefs.map((value) => text(value)) : [];
    if (product !== 'acquire' || !refs.length || new Set(refs).size !== refs.length
      || refs.some((ref) => !COVERT_LEG_REF_SET.has(ref))) {
      return { covert: null, reason: 'invalid_leg_refs' };
    }
    legRefs = [...refs].sort(compareCodepoint);
  }
  const gathering = normalizeCovertGathering(row.gathered);
  if (gathering.reason !== 'gathered') return { covert: null, reason: gathering.reason };
  // §3.4's addition D. Present-and-true or absent; `standoff: false` is a forged shape,
  // not a mission that reached its target, and it is refused rather than coerced.
  if (row.standoff !== undefined && row.standoff !== true) {
    return { covert: null, reason: 'invalid_standoff' };
  }
  return {
    covert: {
      demand,
      ...(gathering.gathered ? { gathered: gathering.gathered } : {}),
      itinerary,
      ...(legRefs ? { legRefs } : {}),
      product,
      ...(row.standoff === true ? { standoff: /** @type {true} */ (true) } : {}),
      subjectId,
    },
    reason: 'covert',
  };
}

/**
 * ES-3 — THE GRADIENT'S OWN DTO ARM (§3.7). Path-dependent accrual is the ONE thing the
 * canonical model could not derive, so it is row state, and row state is validated on the
 * way out of a save file exactly as strictly as on the way in.
 *
 * ORDER IS PRESERVED, NEVER SORTED. `gathered` is an APPEND LOG: the order is the order
 * the reads were taken in, and sorting it would destroy the one fact it carries that its
 * fields do not. Preservation is idempotent, so the round-trip is byte-stable either way —
 * the difference is only whether the record still means anything.
 *
 * @param {unknown} raw
 * @returns {{gathered: Array<Record<string, unknown>>|null, reason: string}}
 */
function normalizeCovertGathering(raw) {
  if (raw == null) return { gathered: null, reason: 'gathered' };
  if (!Array.isArray(raw) || !raw.length || raw.length > MAX_COVERT_GATHERED) {
    return { gathered: null, reason: 'invalid_gathered' };
  }
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (const entry of raw) {
    const partial = asObject(entry);
    const subjectId = strictText(partial.subjectId);
    const tap = text(partial.tap);
    const atTick = wholeTick(partial.atTick);
    const cap = unitNumber(partial.accuracyCap01);
    const sent = partial.sentHome;
    const shapeOk = sent === undefined
      ? hasExactKeys(partial, COVERT_GATHERED_KEYS)
      : sent === true && hasExactKeys(partial, COVERT_GATHERED_SENT_KEYS);
    if (!subjectId || !COVERT_TAP_SET.has(tap) || atTick == null || cap == null || !shapeOk) {
      return { gathered: null, reason: 'invalid_gathered' };
    }
    out.push({
      accuracyCap01: cap,
      atTick,
      subjectId,
      tap,
      ...(sent === true ? { sentHome: /** @type {true} */ (true) } : {}),
    });
  }
  return { gathered: out, reason: 'gathered' };
}

/**
 * A finite number already inside [0,1], VERBATIM — or null. Deliberately not a clamp and
 * deliberately not a rounder: this is a persistence gate, and a gate that repaired an
 * out-of-range cap would let a writer's arithmetic bug persist as a plausible number. The
 * ROUNDING is the writer's (`round4` at the gathering site), so a value that arrives here
 * unrounded round-trips unchanged and the byte-stability pin measures the writer, not a
 * second opinion held by the reader.
 * @param {unknown} value @returns {number|null}
 */
function unitNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
    ? value
    : null;
}

/** @param {unknown} raw @returns {Record<string, unknown>|null} */
export function normalizeErrand(raw) {
  const row = asObject(raw);
  const offer = normalizeEnvoyPeaceOffer(row.offer);
  const acceptance = normalizeEnvoyAcceptance(row.acceptance, offer);
  const snapshot = normalizeEnvoyDepartureSnapshot(row.snapshot);
  const id = text(row.id);
  const npcId = text(row.npcId);
  const from = text(row.from);
  const to = text(row.to);
  const state = text(row.state);
  const purpose = text(row.purpose);
  const departedTick = wholeTick(row.departedTick);
  const expectedReturnTick = wholeTick(row.expectedReturnTick);
  const baseId = envoyErrandIdForOffer(offer);
  const attemptId = envoyAttemptIdForOffer(offer);
  const scheduledHomeTick = wholeTick(row.scheduledHomeTick);
  const authoredReturnOriginId = row.returnOriginId == null ? '' : strictText(row.returnOriginId);
  const returnOriginId = authoredReturnOriginId || to;
  const termSheetRead = normalizeTermSheetResult(row.termSheet);
  const negotiationPicture = row.negotiationPicture == null
    ? null
    : normalizeNegotiationPicture(row.negotiationPicture);
  const targetCourtPicture = row.targetCourtPicture == null
    ? null
    : normalizeNegotiationPicture(row.targetCourtPicture);
  if (!offer || !acceptance || !snapshot || !id || ![baseId, attemptId].includes(id) || !npcId
    || !from || !to || from === to || !PURPOSE_SET.has(purpose)
    || !STATE_SET.has(state) || departedTick == null || expectedReturnTick == null
    || expectedReturnTick < departedTick || !termSheetRead.valid
    || (termSheetRead.versioned && (!negotiationPicture || !targetCourtPicture))
    || (!!negotiationPicture !== !!targetCourtPicture)
    || (row.returnOriginId != null && !authoredReturnOriginId)
    || (row.negotiationPicture != null && !negotiationPicture)
    || (row.targetCourtPicture != null && !targetCourtPicture)) return null;
  const payload = /** @type {Record<string, unknown>} */ (offer.proposalPayload);
  if (payload.offererId !== from || payload.targetId !== to) return null;
  const rawLegs = Array.isArray(row.legs) ? row.legs : [];
  const legs = rawLegs.map((leg) => normalizeLeg(leg));
  if (!legs.length || legs.some((leg) => !leg)) return null;
  const normalizedLegs = /** @type {Array<Record<string, unknown>>} */ (legs);
  const outbound = normalizedLegs.filter((leg) => leg.journey === 'outbound');
  const returning = normalizedLegs.filter((leg) => leg.journey === 'return');
  if (!validJourneyRoute(normalizedLegs, 'outbound', from, to)
    || Number(outbound[0]?.departTick) < departedTick) return null;
  const persistedJourney = text(asObject(row.positionRef).journey);
  const expectedJourney = state === 'returning' || state === 'home'
    ? 'return'
    : ['parlaying', 'intercepted', 'held', 'lost'].includes(state)
      && JOURNEY_SET.has(persistedJourney)
      ? persistedJourney
      : 'outbound';
  if ((expectedJourney === 'return' && !validJourneyRoute(normalizedLegs, 'return', returnOriginId, from))
    || (returning.length && !validJourneyRoute(normalizedLegs, 'return', returnOriginId, from))
    || (returning.length && state === 'travelling')) return null;
  const outboundArrivalTick = Number(outbound.at(-1)?.arrivalTick);
  const returnArrivalTick = Number(returning.at(-1)?.arrivalTick);
  if (expectedReturnTick < outboundArrivalTick
    || (returning.length && (scheduledHomeTick == null || scheduledHomeTick < returnArrivalTick))
    || (!returning.length && scheduledHomeTick != null)) return null;
  const positionRef = normalizePositionRef(row.positionRef, normalizedLegs, expectedJourney);
  if (!positionRef) return null;
  const rawEncounters = row.encounters == null ? [] : row.encounters;
  if (!Array.isArray(rawEncounters) || rawEncounters.length > MAX_ENVOY_ENCOUNTER_HISTORY) return null;
  const encounters = rawEncounters.map((entry) => normalizeEnvoyEncounter(entry));
  if (encounters.some((entry) => !entry)
    || !encounters.every((entry, index) => index === 0
      || encounterOrder(encounters[index - 1], entry) < 0)
    || new Set(encounters.map((entry) => entry.id)).size !== encounters.length) return null;
  const latestEncounter = encounters.at(-1) || null;
  const finalOutboundPosition = positionRef.journey === 'outbound'
    && Number(positionRef.legIndex) === outbound.length - 1
    && positionRef.progressBand === 'arrived';
  const finalReturnPosition = positionRef.journey === 'return'
    && Number(positionRef.legIndex) === returning.length - 1
    && positionRef.progressBand === 'arrived';
  const encounterParlay = state === 'parlaying'
    && latestEncounter?.resolution === 'parlaying'
    && text(row.parlayId) === latestEncounter.id;
  if ((state === 'parlaying' && !finalOutboundPosition && !encounterParlay)
    || (state === 'home' && !finalReturnPosition)) return null;

  /** @type {Record<string, unknown>} */
  const out = {
    id,
    npcId,
    from,
    to,
    purpose,
    ...errandSpineBlock(row, purpose),
    offer,
    acceptance,
    snapshot,
    termSheet: termSheetRead.value,
    ...(negotiationPicture ? { negotiationPicture } : {}),
    ...(targetCourtPicture ? { targetCourtPicture } : {}),
    ...(encounters.length ? { encounters } : {}),
    legs: normalizedLegs,
    positionRef,
    departedTick,
    expectedReturnTick,
    ...(scheduledHomeTick != null ? { scheduledHomeTick } : {}),
    ...(authoredReturnOriginId ? { returnOriginId: authoredReturnOriginId } : {}),
    state,
  };
  for (const key of ['npcName', 'fromName', 'toName']) {
    const label = text(row[key]);
    if (label) out[key] = label;
  }
  for (const key of [
    'parlayTick', 'returnStartedTick', 'homeTick', 'lostTick', 'closedTick',
    'silenceInferredAtTick', 'lastMovedTick', 'lossKnownAtHomeTick',
    'interceptedTick', 'heldTick', 'releasedTick',
  ]) {
    const tick = wholeTick(row[key]);
    if (tick != null) out[key] = tick;
  }
  const lossCause = text(row.lossCause);
  const homeTick = wholeTick(out.homeTick);
  const lostTick = wholeTick(out.lostTick);
  const closedTick = wholeTick(out.closedTick);
  const parlayTick = wholeTick(out.parlayTick);
  const returnStartedTick = wholeTick(out.returnStartedTick);
  const lastMovedTick = wholeTick(out.lastMovedTick);
  const silenceInferredAtTick = wholeTick(out.silenceInferredAtTick);
  const lossKnownAtHomeTick = wholeTick(out.lossKnownAtHomeTick);
  const interceptedTick = wholeTick(out.interceptedTick);
  const heldTick = wholeTick(out.heldTick);
  const releasedTick = wholeTick(out.releasedTick);
  const parlayId = text(row.parlayId);
  if (parlayId) out.parlayId = parlayId;
  const parlayRefusal = row.parlayRefusal == null
    ? null
    : normalizeParlayRefusal(row.parlayRefusal);
  if (row.parlayRefusal != null && !parlayRefusal) return null;
  if (parlayRefusal) {
    const parlayEncounter = encounters.find((entry) => entry.id === parlayId) || null;
    const proposerPictureId = parlayEncounter
      ? String(parlayEncounter.interceptorPictureId)
      : String(targetCourtPicture?.id || '');
    const proposerPicture = parlayEncounter
      ? asObject(parlayEncounter.interceptorPicture)
      : targetCourtPicture;
    // The witness is DURABLE, not a parlay-phase flag. It exists to stop a later
    // pulse silently re-drafting, so it has to survive the mandatory return and
    // the terminal close; bounding it to `parlaying` deleted the whole errand
    // from this reader the moment a refused envoy started walking home. Only
    // `travelling` is impossible: nothing has been drafted yet there.
    if (!REFUSAL_BEARING_STATES.has(state) || termSheetRead.value !== null || !parlayId
      || parlayRefusal.parlayId !== parlayId
      || parlayRefusal.id !== parlayRefusalId(id, parlayId, Number(parlayRefusal.attemptedTick))
      || parlayRefusal.proposerPictureId !== proposerPictureId
      || parlayRefusal.responderPictureId !== negotiationPicture?.id
      || parlayTick == null || Number(parlayRefusal.attemptedTick) < parlayTick + 1
      || Number(parlayRefusal.attemptedTick) < Number(asObject(proposerPicture).lastChangedTick)
      || Number(parlayRefusal.attemptedTick) < Number(negotiationPicture?.lastChangedTick)) return null;
    out.parlayRefusal = parlayRefusal;
  }
  const terminalTick = state === 'home' ? homeTick : state === 'lost' ? lostTick : null;
  // An imported row may not place any lifecycle fact before the offer existed
  // or before this person departed.  Terminal clocks then close only facts that
  // had already happened; silence is the one deliberate exception because a
  // home court can infer it after a remote loss it has not observed.
  if (Number(offer.generatedAtTick) > departedTick
    || [parlayTick, returnStartedTick, homeTick, lostTick, lastMovedTick,
      interceptedTick, heldTick, releasedTick]
      .some((value) => value != null && value < departedTick)
    || (silenceInferredAtTick != null && silenceInferredAtTick <= expectedReturnTick)
    || (lossKnownAtHomeTick != null && (lostTick == null || lossKnownAtHomeTick < lostTick))
    || (terminalTick != null && lastMovedTick != null && lastMovedTick > terminalTick)
    || encounters.some((entry) => Number(entry.encounteredTick) < departedTick
      || (terminalTick != null && Number(entry.encounteredTick) > terminalTick))) return null;
  const episodeKey = envoyOfferEpisodeKey(offer);
  // The envoy's own picture is frozen AT DEPARTURE and mutates only afterwards
  // (K.2): the capture may not postdate the departure, but `lastChangedTick`
  // advances with every rumor the road exposes them to.  Bounding the changed
  // clock by `departedTick` — as the court's frozen picture below rightly is —
  // deleted the errand from this reader on its first mutation.  Only the
  // terminal clock bounds it, exactly as encounters are bounded above.
  if (negotiationPicture && (
    negotiationPicture.carrier?.kind !== 'envoy'
    || negotiationPicture.carrier?.id !== id
    || negotiationPicture.partyId !== from
    || negotiationPicture.counterpartId !== to
    || negotiationPicture.relationshipKey !== offer.relationshipKey
    || negotiationPicture.episodeKey !== episodeKey
    || negotiationPicture.frontOwnerId !== payload.peaceFrontOwnerId
    || Number(negotiationPicture.frontSinceTick) !== Number(payload.peaceFrontSinceTick)
    || Number(negotiationPicture.capturedTick) > departedTick
    || (terminalTick != null && Number(negotiationPicture.lastChangedTick) > terminalTick)
  )) return null;
  // The receiving court's picture is frozen at dispatch and never mutates, so
  // its changed clock legitimately may not pass the departure at all.
  if (targetCourtPicture && (
    targetCourtPicture.carrier?.kind !== 'court'
    || targetCourtPicture.partyId !== to
    || targetCourtPicture.counterpartId !== from
    || targetCourtPicture.relationshipKey !== offer.relationshipKey
    || targetCourtPicture.episodeKey !== episodeKey
    || targetCourtPicture.frontOwnerId !== payload.peaceFrontOwnerId
    || Number(targetCourtPicture.frontSinceTick) !== Number(payload.peaceFrontSinceTick)
    || Number(targetCourtPicture.lastChangedTick) > departedTick
  )) return null;
  if (encounters.some((entry) => {
    const interceptorPicture = asObject(entry.interceptorPicture);
    const pair = [String(interceptorPicture.partyId), String(interceptorPicture.counterpartId)]
      .sort(compareCodepoint);
    const offerPair = [from, to].sort(compareCodepoint);
    return interceptorPicture.relationshipKey !== offer.relationshipKey
      || interceptorPicture.episodeKey !== episodeKey
      || !offerPair.includes(String(interceptorPicture.counterpartId))
      || (entry.kind === 'field_parlay'
        && JSON.stringify(pair) !== JSON.stringify(offerPair));
  })) return null;
  if (termSheetRead.versioned) {
    const sheet = /** @type {Record<string, unknown>} */ (termSheetRead.value);
    if (sheet.errandId !== id || sheet.episodeKey !== episodeKey
      || sheet.relationshipKey !== offer.relationshipKey
      || JSON.stringify(sheet.parties) !== JSON.stringify([from, to].sort(compareCodepoint))
      || Number(sheet.agreedTick) < departedTick || !parlayId
      || !Object.values(asObject(sheet.pictureIds)).includes(negotiationPicture?.id)
      || sheet.encounterId !== parlayId
      || (returnStartedTick != null && returnStartedTick < Number(sheet.agreedTick) + 1)) return null;
  }
  if (latestEncounter) {
    if (interceptedTick == null || interceptedTick !== Number(latestEncounter.encounteredTick)) return null;
    if (state === 'intercepted' && latestEncounter.resolution !== 'pending') return null;
    if (state === 'held' && (latestEncounter.resolution !== 'held'
      || heldTick !== Number(latestEncounter.resolvedTick))) return null;
    if (state === 'parlaying' && parlayId === latestEncounter.id
      && latestEncounter.resolution !== 'parlaying') return null;
    if (releasedTick != null && ['travelling', 'returning'].includes(state)
      && !['resumed', 'plant_resumed'].includes(String(latestEncounter.resolution))) return null;
    if (releasedTick != null && !['resumed', 'plant_resumed'].includes(String(latestEncounter.resolution))) return null;
  } else if (interceptedTick != null || heldTick != null || releasedTick != null
    || ['intercepted', 'held'].includes(state)) return null;
  if (authoredReturnOriginId && authoredReturnOriginId !== to
    && (!encounters.some((entry) => entry.venueId === authoredReturnOriginId
      && entry.resolution === 'parlaying') || !returning.length)) return null;
  if (state === 'lost') {
    if (!LOSS_CAUSE_SET.has(lossCause) || lostTick == null || closedTick == null
      || lostTick !== closedTick || homeTick != null
      || (parlayTick != null && lostTick < parlayTick)
      || (returnStartedTick != null && lostTick < returnStartedTick)) return null;
    // A terminal row keeps the exact phase shape it had when loss closed it.
    // Travelling has no parlay/return clocks; parlay has the final outbound
    // cursor; returning has the return route and cursor.  Crossed imports would
    // otherwise lend terminal H1 cleanup authority to an impossible position.
    const lostReturning = returning.length > 0;
    const lostAtParlay = !lostReturning && parlayTick != null;
    if (lostReturning) {
      if (positionRef.journey !== 'return' || parlayTick == null || returnStartedTick == null) return null;
    } else if (lostAtParlay) {
      if (returnStartedTick != null || (!finalOutboundPosition && !latestEncounter)
        || (!latestEncounter && parlayTick < outboundArrivalTick)
        || (out.termSheet !== null && !termSheetRead.versioned)) return null;
    } else if (returnStartedTick != null || positionRef.journey !== 'outbound') {
      return null;
    }
    if (!lostReturning && out.termSheet !== null) return null;
    out.lossCause = lossCause;
  } else if (state === 'home') {
    if (homeTick == null || closedTick == null || homeTick !== closedTick || lostTick != null) return null;
  } else if (homeTick != null || lostTick != null || closedTick != null) {
    return null;
  }
  if (['parlaying', 'returning', 'home'].includes(state)
    && (parlayTick == null || (!latestEncounter && parlayTick < outboundArrivalTick))) return null;
  if (state === 'travelling' && (parlayTick != null || returnStartedTick != null)) return null;
  if (state === 'parlaying' && expectedJourney === 'outbound' && returnStartedTick != null) return null;
  if (state === 'travelling' && out.termSheet !== null) return null;
  if (state === 'parlaying' && out.termSheet !== null && !termSheetRead.versioned) return null;
  if (['intercepted', 'held'].includes(state) && expectedJourney === 'outbound'
    && out.termSheet !== null) return null;
  if (returning.length && (parlayTick == null || returnStartedTick == null
    || returnStartedTick < parlayTick + 1
    || Number(returning[0].departTick) < returnStartedTick)) return null;
  if (!returning.length && returnStartedTick != null) return null;
  if (state === 'home' && (scheduledHomeTick == null || Number(homeTick) < scheduledHomeTick)) return null;
  const heard = Array.isArray(row.heardRumorIds)
    ? [...new Set(row.heardRumorIds.map(text).filter(Boolean))].slice(-MAX_ENVOY_RUMOR_REFS)
    : [];
  if (heard.length) out.heardRumorIds = heard;
  return out;
}

/**
 * Pure persistence normalizer for the top-level conditional array.  Active
 * errands are never evicted; only the terminal archive is bounded.
 *
 * @param {unknown} value
 * @returns {Array<Record<string, unknown>>}
 */
export function normalizeEnvoyErrands(value) {
  if (!Array.isArray(value)) return [];
  /** @type {Map<string, Record<string, unknown>>} */
  const byId = new Map();
  for (const raw of value) {
    const errand = normalizeErrand(raw);
    if (errand) byId.set(String(errand.id), errand);
  }
  const all = [...byId.values()];
  const active = all.filter((errand) => !TERMINAL_STATES.has(String(errand.state)));
  const terminal = all.filter((errand) => TERMINAL_STATES.has(String(errand.state)))
    .sort((a, b) => (Number(a.closedTick) - Number(b.closedTick))
      || compareCodepoint(String(a.id), String(b.id)))
    .slice(-MAX_TERMINAL_ENVOY_HISTORY);
  return [...active, ...terminal].sort((a, b) => (Number(a.departedTick) - Number(b.departedTick))
    || compareCodepoint(String(a.id), String(b.id)));
}

/** Read-only normalized projection. Returned rows never alias the world. */
export function envoyErrandsOf(worldState) {
  return normalizeEnvoyErrands(asObject(worldState)[ENVOY_ERRAND_LEDGER_KEY]);
}

/** @param {unknown} evidence @returns {Record<string, unknown>|null} */
export function normalizeEnvoyEvidence(evidence) {
  const row = asObject(evidence);
  const id = text(row.id);
  const kind = text(row.kind);
  const tick = wholeTick(row.tick);
  const errandId = text(row.errandId);
  const npcId = text(row.npcId);
  const settlementId = text(row.settlementId);
  const counterpartId = text(row.counterpartId);
  const sourceOfferId = text(row.sourceOfferId);
  const state = text(row.state);
  if (!id || !EVIDENCE_KIND_SET.has(kind) || tick == null || !errandId || !npcId
    || !settlementId || !counterpartId || settlementId === counterpartId
    || !sourceOfferId || !STATE_SET.has(state)) return null;
  /** @type {Record<string, unknown>} */
  const out = {
    id,
    kind,
    tick,
    errandId,
    npcId,
    settlementId,
    counterpartId,
    settlementIds: [settlementId, counterpartId],
    sourceOfferId,
    state,
  };
  for (const key of ['npcName', 'settlementName', 'counterpartName']) {
    const label = text(row[key]);
    if (label) out[key] = label;
  }
  const routeId = text(row.routeId);
  const routeName = text(row.routeName);
  if (routeId) {
    out.routeId = routeId;
    if (routeName) out.routeName = routeName;
  }
  const lossCause = text(row.lossCause);
  if (lossCause && LOSS_CAUSE_SET.has(lossCause)) out.lossCause = lossCause;
  if (kind === 'envoy_silence_inference') out.inferenceBasis = 'silence';
  for (const key of [
    'encounterId', 'interceptorId', 'armyId',
    'envoyPictureId', 'interceptorPictureId', 'parlayId',
  ]) {
    const value = strictText(row[key]);
    if (value) out[key] = value;
  }
  for (const [idKey, nameKey] of [
    ['thirdPartyId', 'thirdPartyName'],
    ['venueId', 'venueName'],
    ['termSheetId', 'termName'],
    ['reasonId', 'reasonName'],
  ]) {
    const value = strictText(row[idKey]);
    const label = strictText(row[nameKey]);
    if (value) {
      out[idKey] = value;
      if (label) out[nameKey] = label;
    }
  }
  const privateGoal = strictText(row.privateGoal);
  if (privateGoal && PRIVATE_GOAL_SET.has(privateGoal)) out.privateGoal = privateGoal;
  return out;
}
