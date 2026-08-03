/**
 * envoyErrand.js — WR-7a's isolated envoy-errand state machine.
 *
 * This module is the ONE writer of `worldState.envoyErrands`.  It deliberately
 * knows nothing about settlements, deployments, belief truth, route solving,
 * proposal application, or treaty appraisal.  Its callers must hand it:
 *
 *   - the already-authored bilateral peace outcome and exact deployment episode;
 *   - one durable H1 npc id (never a roster index for this module to turn into one);
 *   - a closed, qualitative departure picture; and
 *   - legs produced by the shared named-person transit seam.
 *
 * That boundary is the K3 truth firewall: the traveller carries a picture and
 * can move it one qualitative step when an injected rumour arrives, but this
 * leaf has no import through which it could refresh the picture from live truth.
 *
 * The core is integration-neutral.  It emits typed evidence rows for the later
 * news/belief adapters, but does not write Wizard News or another subsystem's
 * ledger.  Every mutator is pure and returns the input world by reference on a
 * no-op.  The virtual gate is exact-true and absent from defaults by design.
 */

import {
  NAMED_PERSON_TRANSIT_TUNING,
  namedPersonLegPosition,
} from './namedPersonTransit.js';
import {
  applyNegotiationPictureMutation,
  negotiateFromPictures,
  normalizeNegotiationPicture,
  normalizeParlayTermSheet,
} from './negotiationPictures.js';

export const ENVOY_ERRAND_LEDGER_KEY = 'envoyErrands';
export const MAX_CONCURRENT_ENVOYS = 2;
export const MAX_TERMINAL_ENVOY_HISTORY = 24;
export const MAX_ENVOY_RUMOR_REFS = 16;
export const MAX_ENVOY_ENCOUNTER_HISTORY = 16;
export const ENVOY_ENCOUNTER_SCHEMA_VERSION = 1;
export const ENVOY_CONTINUATION_SCHEMA_VERSION = 1;
export const ENVOY_PARLAY_REFUSAL_SCHEMA_VERSION = 1;

export const ENVOY_REQUIRED_RULES = Object.freeze([
  'warLayerEnabled',
  'warTerminationEnabled',
  'peaceEngineEnabled',
  'envoyDiplomacyEnabled',
  'npcConsequencesEnabled',
  'routeLifecycleEnabled',
]);

export const ENVOY_ERRAND_STATES = Object.freeze([
  'travelling',
  'parlaying',
  'intercepted',
  'held',
  'returning',
  'home',
  'lost',
]);

export const ENVOY_EVIDENCE_KINDS = Object.freeze([
  'envoy_departed',
  'envoy_on_the_road',
  'envoy_returning',
  'envoy_home',
  'envoy_lost',
  'envoy_silence_inference',
  'terms_never_reached',
  'envoy_intercepted',
  'envoy_parlaying',
  'envoy_terms_agreed',
  'envoy_held',
  'terms_signed_for_a_fallen_town',
  'parlay_at_an_occupied_venue',
  'interceptor_dilemma',
  'interceptor_parlays_own_edge',
  'parlay_terms_neither_court_drafted',
]);

export const ENVOY_STORES_BANDS = Object.freeze([
  'bare',
  'thin',
  'stocked',
  'deep',
]);

export const ENVOY_STRENGTH_BANDS = Object.freeze([
  'spent',
  'strained',
  'ready',
  'strong',
  'dominant',
]);

export const ENVOY_MORALE_EXHAUSTION_BANDS = Object.freeze([
  'quiet',
  'present',
  'pressing',
  'decisive',
]);

export const ENVOY_FOUNDING_CAUSE_STATES = Object.freeze([
  'dissolved',
  'anchor_unavailable',
  'live',
]);

export const ENVOY_BELIEVED_RATIO_BANDS = Object.freeze([
  'far_behind',
  'behind',
  'matched',
  'ahead',
  'far_ahead',
]);

export const ENVOY_PICTURE_FIELDS = Object.freeze([
  'storesBand',
  'strengthBand',
  'moraleExhaustionBand',
  'foundingCauseStatus',
  'believedRatioBand',
]);

export const ENVOY_PICTURE_DIRECTIONS = Object.freeze(['rise', 'fall']);
export const ENVOY_POSITION_BANDS = Object.freeze(['departed', 'underway', 'near', 'arrived']);
export const ENVOY_JOURNEYS = Object.freeze(['outbound', 'return']);
export const ENVOY_LOSS_CAUSES = Object.freeze(['killed', 'route_lost', 'dm_removed']);
export const ENVOY_PURPOSES = Object.freeze(['sue', 'self_parlay']);
export const ENVOY_ENCOUNTER_KINDS = Object.freeze([
  'field_parlay',
  'war_continue',
  'private_goal',
]);
export const ENVOY_PRIVATE_GOALS = Object.freeze(['plant', 'imprison', 'terms_shop']);
export const ENVOY_ENCOUNTER_RESOLUTIONS = Object.freeze([
  'pending',
  'parlaying',
  'held',
  'resumed',
  'plant_resumed',
]);
export const ENVOY_ENCOUNTER_VENUE_KINDS = Object.freeze([
  'allied_hall',
  'occupied_enemy_settlement',
  'field_node',
]);
export const ENVOY_PARLAY_REFUSAL_REASONS = Object.freeze([
  'orientation_refused',
  'budget_refused',
  'family_refused',
  'asset_refused',
  'magnitude_refused',
  'duration_refused',
  'weight_refused',
  'no_sheet',
]);

const STATE_SET = new Set(ENVOY_ERRAND_STATES);
// Every state a parlay can already have happened in. `travelling` is the only
// one excluded: nothing has been drafted there, so a refusal witness on it is a
// forged import.
const REFUSAL_BEARING_STATES = new Set(
  ENVOY_ERRAND_STATES.filter((state) => state !== 'travelling'),
);
const EVIDENCE_KIND_SET = new Set(ENVOY_EVIDENCE_KINDS);
const JOURNEY_SET = new Set(ENVOY_JOURNEYS);
const POSITION_BAND_SET = new Set(ENVOY_POSITION_BANDS);
const LOSS_CAUSE_SET = new Set(ENVOY_LOSS_CAUSES);
const PURPOSE_SET = new Set(ENVOY_PURPOSES);
const ENCOUNTER_KIND_SET = new Set(ENVOY_ENCOUNTER_KINDS);
const PRIVATE_GOAL_SET = new Set(ENVOY_PRIVATE_GOALS);
const ENCOUNTER_RESOLUTION_SET = new Set(ENVOY_ENCOUNTER_RESOLUTIONS);
const ENCOUNTER_VENUE_KIND_SET = new Set(ENVOY_ENCOUNTER_VENUE_KINDS);
const PARLAY_REFUSAL_REASON_SET = new Set(ENVOY_PARLAY_REFUSAL_REASONS);
const TERMINAL_STATES = new Set(['home', 'lost']);
const ACTIVE_STATES = new Set(['travelling', 'parlaying', 'intercepted', 'held', 'returning']);

const ENCOUNTER_KEYS = Object.freeze([
  'schemaVersion',
  'id',
  'kind',
  'interceptorId',
  'armyId',
  'venueId',
  'venueRef',
  'routeId',
  'encounteredTick',
  'resolvedTick',
  'priorState',
  'priorJourney',
  'priorPosition',
  'destinationId',
  'continuation',
  'privateGoal',
  'resolution',
  'interceptorPictureId',
  'interceptorPicture',
  'termSheetId',
]);

const PARLAY_REFUSAL_KEYS = Object.freeze([
  'schemaVersion',
  'id',
  'parlayId',
  'attemptedTick',
  'proposerPictureId',
  'responderPictureId',
  'reason',
]);

const CONTINUATION_KEYS = Object.freeze([
  'schemaVersion',
  'resumeState',
  'journey',
  'destinationId',
  'resumedTick',
  'scheduledArrivalTick',
]);

const PICTURE_BANDS = Object.freeze({
  storesBand: ENVOY_STORES_BANDS,
  strengthBand: ENVOY_STRENGTH_BANDS,
  moraleExhaustionBand: ENVOY_MORALE_EXHAUSTION_BANDS,
  foundingCauseStatus: ENVOY_FOUNDING_CAUSE_STATES,
  believedRatioBand: ENVOY_BELIEVED_RATIO_BANDS,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** Strict string read. IDs are never manufactured from numbers or indexes. */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @returns {number|null} */
function wholeTick(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;
}

/** Repository-independent codepoint order. */
function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Clone JSON-like data while rejecting cycles, non-finite numbers, functions,
 * symbols, and class instances.  Object keys are sorted so an injected term
 * sheet cannot make replay serialization depend on authoring order.
 *
 * @param {unknown} value
 * @param {number} [depth]
 * @param {WeakSet<object>} [ancestors]
 * @returns {unknown}
 */
function cloneData(value, depth = 0, ancestors = new WeakSet()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (!value || typeof value !== 'object' || depth > 12) return undefined;
  if (ancestors.has(/** @type {object} */ (value))) return undefined;
  ancestors.add(/** @type {object} */ (value));
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) {
      const cloned = cloneData(item, depth + 1, ancestors);
      if (cloned !== undefined) out.push(cloned);
    }
    ancestors.delete(/** @type {object} */ (value));
    return out;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) {
    ancestors.delete(/** @type {object} */ (value));
    return undefined;
  }
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const key of Object.keys(/** @type {Record<string, unknown>} */ (value)).sort(compareCodepoint)) {
    const cloned = cloneData(/** @type {Record<string, unknown>} */ (value)[key], depth + 1, ancestors);
    if (cloned !== undefined) out[key] = cloned;
  }
  ancestors.delete(/** @type {object} */ (value));
  return out;
}

/** A detached, non-empty JSON-safe record, or null. */
function jsonRecord(value) {
  const cloned = cloneData(value);
  const row = asObject(cloned);
  return Object.keys(row).length ? row : null;
}

/** @param {Record<string, unknown>} row @param {ReadonlyArray<string>} keys */
function hasExactKeys(row, keys) {
  const actual = Object.keys(row).sort(compareCodepoint);
  const expected = [...keys].sort(compareCodepoint);
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

/** Authored WR-7b identities are not trimmed or coerced at persistence seams. */
function strictText(value) {
  return typeof value === 'string' && value.length > 0 && value === value.trim()
    && ![...value].some((character) => {
      const code = character.charCodeAt(0);
      return code <= 31 || code === 127;
    })
    ? value
    : '';
}

/** Collision-free identity text for persisted witnesses. */
function stableIdentity(parts) {
  return parts.map((value) => {
    const part = String(value);
    return `${part.length}:${part}`;
  }).join('|');
}

function parlayRefusalId(errandId, parlayId, attemptedTick) {
  return `envoy_parlay_refusal:${stableIdentity([errandId, parlayId, attemptedTick])}`;
}

function normalizeParlayRefusalReason(value) {
  const reason = strictText(value);
  if (PARLAY_REFUSAL_REASON_SET.has(reason)) return reason;
  return ['proposer_has_no_sheet', 'invalid_proposer_evaluation', 'invalid_responder_evaluation']
    .includes(reason)
    ? 'no_sheet'
    : '';
}

function normalizeParlayRefusal(raw) {
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

function normalizeEncounterVenueRef(raw, venueId, routeId) {
  const row = asObject(raw);
  if (!hasExactKeys(row, ['id', 'kind'])) return null;
  const id = strictText(row.id);
  const kind = strictText(row.kind);
  if (!id || id !== venueId || !ENCOUNTER_VENUE_KIND_SET.has(kind)
    || (kind === 'field_node' && !routeId)) return null;
  return { id, kind };
}

/** @param {unknown} raw */
function normalizeEncounterContinuation(raw) {
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

function normalizeHistoricalPosition(raw, forcedJourney) {
  const row = asObject(raw);
  if (!hasExactKeys(row, ['journey', 'legIndex', 'fromId', 'toId', 'progressBand'])) return null;
  const journey = strictText(row.journey);
  const legIndex = wholeTick(row.legIndex);
  const fromId = strictText(row.fromId);
  const toId = strictText(row.toId);
  const progressBand = strictText(row.progressBand);
  if (journey !== forcedJourney || !JOURNEY_SET.has(journey) || legIndex == null
    || !fromId || !toId || fromId === toId || !POSITION_BAND_SET.has(progressBand)) return null;
  return { journey, legIndex, fromId, toId, progressBand };
}

/** Strict, complete persistence DTO for one actual army/envoy collision. */
function normalizeEnvoyEncounter(raw) {
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

function encounterOrder(left, right) {
  return Number(left.encounteredTick) - Number(right.encounteredTick)
    || compareCodepoint(String(left.id), String(right.id));
}

/** Exact activation: all six prerequisite laws must be explicitly true. */
export function envoyDiplomacyActive(worldStateOrRules) {
  const root = asObject(worldStateOrRules);
  const rules = Object.prototype.hasOwnProperty.call(root, 'simulationRules')
    ? asObject(root.simulationRules)
    : root;
  return ENVOY_REQUIRED_RULES.every((key) => rules[key] === true);
}

/**
 * Normalize the qualitative picture frozen at departure.  Every value is a
 * closed word; a scalar cannot survive by coercion.
 *
 * @param {unknown} raw
 * @returns {Record<string, string>|null}
 */
export function normalizeEnvoyDepartureSnapshot(raw) {
  const row = asObject(raw);
  /** @type {Record<string, string>} */
  const out = {};
  for (const field of ENVOY_PICTURE_FIELDS) {
    const value = text(row[field]);
    const bands = /** @type {ReadonlyArray<string>} */ (PICTURE_BANDS[field]);
    if (!bands.includes(value)) return null;
    out[field] = value;
  }
  return out;
}

/**
 * One injected rumour may move exactly one qualitative field by exactly one
 * adjacent rung.  It cannot name a target band or smuggle in a scalar.
 *
 * @param {unknown} rawSnapshot
 * @param {unknown} rawPatch
 * @returns {Record<string, string>|null}
 */
export function stepEnvoyPicture(rawSnapshot, rawPatch) {
  const snapshot = normalizeEnvoyDepartureSnapshot(rawSnapshot);
  if (!snapshot) return null;
  const patch = asObject(rawPatch);
  const field = text(patch.field);
  const direction = text(patch.direction);
  if (!ENVOY_PICTURE_FIELDS.includes(field) || !ENVOY_PICTURE_DIRECTIONS.includes(direction)) {
    return null;
  }
  const bands = /** @type {ReadonlyArray<string>} */ (PICTURE_BANDS[field]);
  const current = bands.indexOf(snapshot[field]);
  if (current < 0) return null;
  const delta = direction === 'rise' ? 1 : -1;
  const nextIndex = Math.max(0, Math.min(bands.length - 1, current + delta));
  if (nextIndex === current) return snapshot;
  return { ...snapshot, [field]: bands[nextIndex] };
}

/**
 * Sanitize the original peace outcome into the complete mechanical subset the
 * return replay needs.  The authored relationship reason and mechanical
 * severity survive because the ordinary relationship writer consumes them;
 * reader headlines, probabilities, arbitrary metadata, and current-world
 * observations are intentionally excluded.
 *
 * @param {unknown} raw
 * @returns {Record<string, unknown>|null}
 */
export function normalizeEnvoyPeaceOffer(raw) {
  const row = asObject(raw);
  const payload = asObject(row.proposalPayload);
  const patch = asObject(row.relationshipPatch);
  const outcomeId = text(row.outcomeId || row.id);
  const generatedAtTick = wholeTick(row.generatedAtTick);
  const severity = typeof row.severity === 'number' && Number.isFinite(row.severity)
    && row.severity >= 0 && row.severity <= 1
    ? row.severity
    : null;
  const candidateType = text(row.candidateType);
  const targetSaveId = text(row.targetSaveId);
  const relationshipKey = text(row.relationshipKey);
  const payloadRelationshipKey = text(payload.relationshipKey);
  const offererId = text(payload.offererId);
  const targetId = text(payload.targetId);
  const frontOwnerId = text(payload.peaceFrontOwnerId);
  const frontSinceTick = wholeTick(payload.peaceFrontSinceTick);
  const fromType = text(payload.fromType);
  const toType = text(payload.toType);
  const reason = text(payload.reason);
  const proposedRelationshipType = text(patch.proposedRelationshipType || patch.relationshipType);
  const rawCoalitionClosure = payload.coalitionSettlementClosure;
  const coalitionSettlementClosure = rawCoalitionClosure == null
    ? null
    : jsonRecord(rawCoalitionClosure);
  if (!outcomeId || generatedAtTick == null || severity == null
    || candidateType !== 'strategy_sue_for_peace'
    || text(payload.kind) !== 'relationship_label_change' || payload.peaceOffer !== true
    || !offererId || !targetId || offererId === targetId || targetSaveId !== offererId
    || !relationshipKey || payloadRelationshipKey !== relationshipKey
    || !frontOwnerId || ![offererId, targetId].includes(frontOwnerId)
    || frontSinceTick == null || frontSinceTick > generatedAtTick
    || !fromType || !toType || fromType === toType || proposedRelationshipType !== toType
    || !reason
    || (rawCoalitionClosure != null && !coalitionSettlementClosure)) {
    return null;
  }
  return {
    id: outcomeId,
    outcomeId,
    generatedAtTick,
    severity,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: offererId,
    relationshipKey,
    relationshipPatch: {
      proposedRelationshipType: toType,
      trajectory: 'transitioning',
    },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey,
      fromType,
      toType,
      peaceOffer: true,
      offererId,
      targetId,
      peaceFrontOwnerId: frontOwnerId,
      peaceFrontSinceTick: frontSinceTick,
      reason,
      ...(coalitionSettlementClosure ? { coalitionSettlementClosure } : {}),
    },
  };
}

/**
 * Freeze the already-accepted WR-5 ruling which authorized dispatch. Return-time
 * replay must use this capsule instead of asking a later court/world state to
 * adjudicate the same offer again. Only the ruling records consumed by WR-5/6
 * survive; all other decision scratch data is discarded.
 *
 * @param {unknown} raw
 * @param {unknown} rawOffer
 * @returns {Record<string, unknown>|null}
 */
export function normalizeEnvoyAcceptance(raw, rawOffer) {
  const offer = normalizeEnvoyPeaceOffer(rawOffer);
  if (!offer) return null;
  const row = asObject(raw);
  const payload = /** @type {Record<string, unknown>} */ (offer.proposalPayload);
  const offererId = text(row.offererId);
  const targetId = text(row.targetId);
  const expectedOfferer = String(payload.offererId);
  const expectedTarget = String(payload.targetId);
  const receipt = jsonRecord(row.receipt);
  const offererRead = jsonRecord(row.offererRead);
  const targetTerminationReceipt = jsonRecord(
    row.targetTerminationReceipt || asObject(row.termination).receipt,
  );
  const rawInheritedDemand = row.inheritedDemand;
  const inheritedDemand = rawInheritedDemand == null ? null : jsonRecord(rawInheritedDemand);
  const rawOffererInheritedDemand = row.offererInheritedDemand;
  const offererInheritedDemand = rawOffererInheritedDemand == null
    ? null
    : jsonRecord(rawOffererInheritedDemand);
  const rawExpenditures = row.coalitionPeaceExpenditures ?? [];
  const coalitionPeaceExpenditures = Array.isArray(rawExpenditures)
    ? rawExpenditures.map(jsonRecord)
    : null;
  const receiptOfferer = text(receipt?.offererId);
  const receiptTarget = text(receipt?.targetId);
  const offererReadActor = text(offererRead?.attackerId);
  const offererReadTarget = text(offererRead?.targetId);
  const targetReadActor = text(targetTerminationReceipt?.attackerId);
  const targetReadTarget = text(targetTerminationReceipt?.targetId);
  const receiptDecision = text(receipt?.decision);
  const receiptAction = text(receipt?.actualAction);
  const receiptOfferId = text(receipt?.offerId);
  const receiptId = text(receipt?.id);
  const receiptKind = text(receipt?.kind);
  const receiptTick = wholeTick(receipt?.tick);
  const receiptTerm = text(receipt?.decidingTerm);
  const receiptReason = text(receipt?.reason);
  const receiptBands = asObject(receipt?.bands);
  const offererReadId = text(offererRead?.id);
  const offererReadKind = text(offererRead?.kind);
  const offererReadTick = wholeTick(offererRead?.tick);
  const offererSettlementIds = Array.isArray(offererRead?.settlementIds)
    ? offererRead.settlementIds.map(text)
    : [];
  const targetReadId = text(targetTerminationReceipt?.id);
  const targetReadKind = text(targetTerminationReceipt?.kind);
  const targetReadTick = wholeTick(targetTerminationReceipt?.tick);
  const targetSettlementIds = Array.isArray(targetTerminationReceipt?.settlementIds)
    ? targetTerminationReceipt.settlementIds.map(text)
    : [];
  const inheritedActor = text(inheritedDemand?.actorId);
  const inheritedTarget = text(inheritedDemand?.targetId);
  const inheritedAction = text(inheritedDemand?.desiredAction);
  const offererInheritedActor = text(offererInheritedDemand?.actorId);
  const offererInheritedTarget = text(offererInheritedDemand?.targetId);
  const offererInheritedAction = text(offererInheritedDemand?.desiredAction);
  if (row.accepted !== true || offererId !== expectedOfferer || targetId !== expectedTarget
    || !receipt || !offererRead || !targetTerminationReceipt
    || (rawInheritedDemand != null && !inheritedDemand)
    || (rawOffererInheritedDemand != null && !offererInheritedDemand)
    || !coalitionPeaceExpenditures || coalitionPeaceExpenditures.some((entry) => !entry)
    || !receiptId || receiptKind !== 'war_peace_acceptance_read' || receiptTick == null
    || receiptOfferer !== expectedOfferer || receiptTarget !== expectedTarget
    || receiptDecision !== 'accept' || receiptAction !== 'peace'
    || receiptOfferId !== offer.id || !receiptTerm || !receiptReason
    || !['cause', 'cost_to_continue', 'cost_to_stop', 'momentum']
      .every((key) => text(receiptBands[key]))
    || !offererReadId || offererReadKind !== 'war_termination_read' || offererReadTick == null
    || offererReadActor !== expectedOfferer || offererReadTarget !== expectedTarget
    || offererSettlementIds.length !== 2
    || offererSettlementIds[0] !== expectedOfferer || offererSettlementIds[1] !== expectedTarget
    || !targetReadId || targetReadKind !== 'war_termination_read' || targetReadTick == null
    || targetReadActor !== expectedTarget || targetReadTarget !== expectedOfferer
    || targetSettlementIds.length !== 2
    || targetSettlementIds[0] !== expectedTarget || targetSettlementIds[1] !== expectedOfferer
    || (inheritedDemand && (
      inheritedActor !== expectedTarget
      || inheritedTarget !== expectedOfferer
      || inheritedAction !== 'peace'
    ))
    || (offererInheritedDemand && (
      offererInheritedActor !== expectedOfferer
      || offererInheritedTarget !== expectedTarget
      || offererInheritedAction !== 'peace'
    ))) return null;
  return {
    accepted: true,
    offererId,
    targetId,
    receipt,
    offererRead,
    termination: { receipt: targetTerminationReceipt },
    inheritedDemand,
    ...(offererInheritedDemand ? { offererInheritedDemand } : {}),
    coalitionPeaceExpenditures: /** @type {Array<Record<string, unknown>>} */ (coalitionPeaceExpenditures),
  };
}

/** Collision-free, order-sensitive key for one exact bilateral front episode. */
export function envoyOfferEpisodeKey(rawOffer) {
  const offer = normalizeEnvoyPeaceOffer(rawOffer);
  if (!offer) return '';
  const payload = /** @type {Record<string, unknown>} */ (offer.proposalPayload);
  return [
    offer.relationshipKey,
    payload.offererId,
    payload.targetId,
    payload.peaceFrontOwnerId,
    payload.peaceFrontSinceTick,
  ].map((value) => {
    const part = String(value);
    return `${part.length}:${part}`;
  }).join('|');
}

/** Stable errand id; the offer id is provenance, while the episode is identity. */
export function envoyErrandIdForOffer(rawOffer) {
  const key = envoyOfferEpisodeKey(rawOffer);
  return key ? `envoy_errand:${key}` : '';
}

/** A retry keeps the stable episode id as its prefix and adds exact offer provenance. */
function envoyAttemptIdForOffer(rawOffer) {
  const offer = normalizeEnvoyPeaceOffer(rawOffer);
  const base = envoyErrandIdForOffer(offer);
  if (!offer || !base) return '';
  const offerId = String(offer.outcomeId);
  return `${base}:attempt:${offerId.length}:${offerId}`;
}

/** Exact equality over the canonical mechanical offer allowlist. */
function sameEnvoyOffer(left, right) {
  const a = normalizeEnvoyPeaceOffer(left);
  const b = normalizeEnvoyPeaceOffer(right);
  return !!(a && b && JSON.stringify(a) === JSON.stringify(b));
}

/** A route reference requires truthful identity; its authored name is optional. */
function normalizeRouteRef(raw) {
  const row = asObject(raw);
  const id = text(row.id);
  const name = text(row.name);
  return id ? { id, ...(name ? { name } : {}) } : null;
}

/** @param {unknown} raw @param {'outbound'|'return'|null} [forcedJourney] @param {unknown} [fallbackRouteRef] */
function normalizeLeg(raw, forcedJourney = null, fallbackRouteRef = null) {
  const row = asObject(raw);
  const fromId = text(row.fromId);
  const toId = text(row.toId);
  const departTick = wholeTick(row.departTick);
  const arrivalTick = wholeTick(row.arrivalTick);
  const journey = forcedJourney || text(row.journey);
  if (!fromId || !toId || fromId === toId || departTick == null || arrivalTick == null
    || arrivalTick < departTick + NAMED_PERSON_TRANSIT_TUNING.MIN_LEG_TICKS
    || !JOURNEY_SET.has(journey)) return null;
  const routeRef = normalizeRouteRef(row.routeRef) || normalizeRouteRef(fallbackRouteRef);
  return {
    fromId,
    toId,
    departTick,
    arrivalTick,
    journey,
    ...(routeRef ? { routeRef } : {}),
  };
}

/** @param {unknown} raw @param {ReadonlyArray<Record<string, unknown>>} legs @param {string|null} [forcedJourney] */
function normalizePositionRef(raw, legs, forcedJourney = null) {
  const row = asObject(raw);
  const journey = forcedJourney || text(row.journey);
  const legIndex = wholeTick(row.legIndex);
  const fromId = text(row.fromId);
  const toId = text(row.toId);
  const progressBand = text(row.progressBand);
  const journeyLegs = legs.filter((leg) => leg.journey === journey);
  const leg = legIndex == null ? null : journeyLegs[legIndex];
  if (!JOURNEY_SET.has(journey) || legIndex == null || !leg
    || fromId !== leg.fromId || toId !== leg.toId || !POSITION_BAND_SET.has(progressBand)) return null;
  return { journey, legIndex, fromId, toId, progressBand };
}

/**
 * Normalize an injected shared-transit plan and prove continuity, direction,
 * one-week-per-leg, and a future return window.  No route is solved here.
 *
 * @param {unknown} raw
 * @param {{fromId:string,toId:string,journey:'outbound'|'return',notBeforeTick:number}} contract
 * @returns {{legs:Array<Record<string,unknown>>,positionRef:Record<string,unknown>,expectedReturnTick:number}|null}
 */
function normalizeRoutePlan(raw, contract) {
  const row = asObject(raw);
  if (!Array.isArray(row.legs) || !row.legs.length) return null;
  const legs = row.legs.map((leg) => normalizeLeg(leg, contract.journey, row.routeRef));
  if (legs.some((leg) => !leg)) return null;
  const normalized = /** @type {Array<Record<string, unknown>>} */ (legs);
  if (normalized[0].fromId !== contract.fromId
    || normalized[normalized.length - 1].toId !== contract.toId
    || Number(normalized[0].departTick) < contract.notBeforeTick) return null;
  for (let index = 1; index < normalized.length; index += 1) {
    const prior = normalized[index - 1];
    const current = normalized[index];
    if (current.fromId !== prior.toId
      || Number(current.departTick) < Number(prior.arrivalTick) + 1) return null;
  }
  const expectedReturnTick = wholeTick(row.expectedReturnTick);
  if (expectedReturnTick == null
    || expectedReturnTick < Number(normalized[normalized.length - 1].arrivalTick)) return null;
  const initial = row.positionRef || {
    journey: contract.journey,
    legIndex: 0,
    fromId: normalized[0].fromId,
    toId: normalized[0].toId,
    progressBand: 'departed',
  };
  const positionRef = normalizePositionRef(initial, normalized, contract.journey);
  if (!positionRef) return null;
  return { legs: normalized, positionRef, expectedReturnTick };
}

/** Prove a persisted journey still has the same directed, contiguous route. */
function validJourneyRoute(legs, journey, fromId, toId) {
  const route = legs.filter((leg) => leg.journey === journey);
  if (!route.length || route[0].fromId !== fromId || route[route.length - 1].toId !== toId) {
    return false;
  }
  for (let index = 1; index < route.length; index += 1) {
    const prior = route[index - 1];
    const current = route[index];
    if (current.fromId !== prior.toId
      || Number(current.departTick) < Number(prior.arrivalTick) + 1) {
      return false;
    }
  }
  return true;
}

/**
 * WR-7a sheets remain opaque JSON cargo. A version marker opts into WR-7b's
 * exact carried-sheet contract; malformed versioned cargo must not be silently
 * downgraded to a permissive legacy object.
 */
function normalizeTermSheetResult(raw) {
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

function normalizeTermSheet(raw) {
  return normalizeTermSheetResult(raw).value;
}

/** @param {unknown} raw @returns {Record<string, unknown>|null} */
function normalizeErrand(raw) {
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

/** @param {Record<string, unknown>} errand @param {string} kind @param {number} tick @param {Record<string, unknown>} [extra] */
function evidenceFor(errand, kind, tick, extra = {}) {
  const offer = /** @type {Record<string, unknown>} */ (errand.offer);
  const position = asObject(errand.positionRef);
  const journeyLegs = Array.isArray(errand.legs)
    ? errand.legs.filter((leg) => asObject(leg).journey === position.journey)
    : [];
  const currentLeg = wholeTick(position.legIndex) == null
    ? null
    : asObject(journeyLegs[/** @type {number} */ (wholeTick(position.legIndex))]);
  const routeRef = normalizeRouteRef(currentLeg?.routeRef);
  return /** @type {Record<string, unknown>} */ (normalizeEnvoyEvidence({
    id: `envoy_evidence:${kind}:${String(errand.id)}:${tick}`,
    kind,
    tick,
    errandId: errand.id,
    npcId: errand.npcId,
    settlementId: errand.from,
    counterpartId: errand.to,
    sourceOfferId: offer.outcomeId,
    state: errand.state,
    ...(text(errand.npcName) ? { npcName: text(errand.npcName) } : {}),
    ...(text(errand.fromName) ? { settlementName: text(errand.fromName) } : {}),
    ...(text(errand.toName) ? { counterpartName: text(errand.toName) } : {}),
    ...(routeRef ? {
      routeId: routeRef.id,
      ...(routeRef.name ? { routeName: routeRef.name } : {}),
    } : {}),
    ...extra,
  }));
}

/** Detached typed evidence factory for adapters that observe an existing row. */
export function envoyEvidenceFor(errand, kind, tick, extra = {}) {
  const normalized = normalizeErrand(errand);
  const at = wholeTick(tick);
  if (!normalized || !EVIDENCE_KIND_SET.has(text(kind)) || at == null) return null;
  return evidenceFor(normalized, text(kind), at, asObject(cloneData(extra)));
}

/** @param {Record<string, unknown>} errand */
function termSheetIdOf(errand) {
  const sheet = asObject(errand.termSheet);
  return text(sheet.id || sheet.termSheetId || sheet.treatyId);
}

/** Write a normalized array, dropping the top-level key when empty. */
function writeErrands(worldState, nextValue) {
  const state = asObject(worldState);
  const prior = normalizeEnvoyErrands(state[ENVOY_ERRAND_LEDGER_KEY]);
  const next = normalizeEnvoyErrands(nextValue);
  if (JSON.stringify(prior) === JSON.stringify(next)) return worldState;
  if (!next.length) {
    const out = { ...state };
    delete out[ENVOY_ERRAND_LEDGER_KEY];
    return out;
  }
  return { ...state, [ENVOY_ERRAND_LEDGER_KEY]: next };
}

/** @param {Array<Record<string, unknown>>} errands @param {string} id */
function errandIndex(errands, id) {
  return errands.findIndex((errand) => errand.id === id);
}

/** @param {Record<string, unknown>} errand */
function isActiveErrand(errand) {
  return ACTIVE_STATES.has(String(errand.state));
}

/**
 * Is there already a live or archived answer to this exact offer episode?
 * Consumers use this after a proposal becomes terminal so a still-travelling
 * envoy replaces the proposal queue's former duplicate-suppression service.
 */
export function envoyErrandForOffer(worldState, rawOffer) {
  const offer = normalizeEnvoyPeaceOffer(rawOffer);
  const episode = envoyOfferEpisodeKey(rawOffer);
  if (!offer || !episode) return null;
  const errands = envoyErrandsOf(worldState);
  const exact = errands.find((errand) => sameEnvoyOffer(errand.offer, offer));
  if (exact) return exact;
  return errands.find((errand) => isActiveErrand(errand)
    && envoyOfferEpisodeKey(errand.offer) === episode) || null;
}

/** Exact active-episode hold used by candidate/proposal duplicate suppression. */
export function hasActiveEnvoyForOffer(worldState, rawOffer) {
  const episode = envoyOfferEpisodeKey(rawOffer);
  return !!(episode && envoyErrandsOf(worldState).some((errand) => (
    isActiveErrand(errand) && envoyOfferEpisodeKey(errand.offer) === episode
  )));
}

/**
 * Does this durable person already belong to a live envoy lifecycle?
 *
 * This read deliberately lives beside `isActiveErrand`: consumers must not copy the
 * active-state vocabulary and eventually disagree about whether a parlay still owns
 * the traveller. Terminal archive rows do not reserve the person; once home or lost,
 * another ruling may give them a new life.
 */
export function hasActiveEnvoyForNpc(worldState, npcId) {
  const personId = text(npcId);
  return !!(personId && envoyErrandsOf(worldState).some((errand) => (
    errand.npcId === personId && isActiveErrand(errand)
  )));
}

/**
 * Mint one outbound errand.  Idempotence keys on the front episode, not the
 * volatile proposal/outcome id.
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
  const activeAtOrigin = errands.filter((errand) => errand.from === from && isActiveErrand(errand)).length;
  if (activeAtOrigin >= MAX_CONCURRENT_ENVOYS) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'origin_capacity' };
  }
  const plan = normalizeRoutePlan(routePlan, {
    fromId: from,
    toId: to,
    journey: 'outbound',
    notBeforeTick: departedTick,
  });
  if (!plan) {
    return { worldState, changed: false, evidence: [], errand: null, reason: 'invalid_route_plan' };
  }
  const errandId = errands.some((row) => envoyOfferEpisodeKey(row.offer) === envoyOfferEpisodeKey(offer))
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

function exactExpectedErrand(current, expectedErrand) {
  if (expectedErrand == null) return true;
  const expected = normalizeErrand(expectedErrand);
  return !!expected && JSON.stringify(expected) === JSON.stringify(current);
}

function normalizePictureForErrand(raw, errand) {
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

function replaceErrand(worldState, errands, index, nextErrand) {
  const next = [...errands];
  next[index] = nextErrand;
  return writeErrands(worldState, next);
}

/**
 * Record the one T transition from travel into interception. The encounter
 * census is external; this writer proves that its projected node and temporal
 * cut still match the exact ledger row before adopting the result.
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

function latestEncounterFor(current, encounterId) {
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

function updateLatestEncounter(current, nextEncounter) {
  const rows = Array.isArray(current.encounters) ? current.encounters : [];
  return [...rows.slice(0, -1), nextEncounter];
}

function resumeFromEncounter({ current, encounter, routePlan, tick, plantResumed = false }) {
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

/** Resolve no earlier than T+1 to parlay, custody, or an externally priced continuation. */
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

/** Reprice and resume the exact interrupted journey after custody or parlay. */
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

/** Outbound arrival opens an ordinary target-court parlay. */
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

/** Apply one exact typed observation to the WR-7b picture through this writer. */
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
 * The exact pair of ALREADY FROZEN pictures one parlay compares (K4). At a field
 * parlay the proposer is the intercepting column's captured picture; at the
 * receiving court it is the picture that court froze at dispatch. Nothing is
 * re-read from live truth, and the negotiator and the refusal witness below
 * derive the pair from this one place so they can never disagree about it.
 */
function frozenParlayPictures(errand) {
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

/**
 * Persist the first terminal no-sheet verdict for one parlay. Retries and
 * compromise belong to WR-7c, so this witness prevents a later pulse from
 * rebuilding either frozen picture and silently drafting again.
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

/** Persist the exact already-negotiated artifact; drafting remains outside. */
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

/** @param {Record<string, unknown>} current @param {number} tick @param {string} cause */
function lostErrand(current, tick, cause) {
  return {
    ...current,
    state: 'lost',
    lossCause: cause,
    lostTick: tick,
    closedTick: tick,
  };
}

/** @param {Record<string, unknown>} errand @param {number} tick */
function lostEvidence(errand, tick) {
  const rows = [evidenceFor(errand, 'envoy_lost', tick, { lossCause: errand.lossCause })];
  if (errand.termSheet) {
    const termSheetId = termSheetIdOf(errand);
    rows.push(evidenceFor(errand, 'terms_never_reached', tick, {
      lossCause: errand.lossCause,
      ...(termSheetId ? { termSheetId } : {}),
    }));
  }
  return rows;
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

/** A lost traveller remains silence-eligible until observation reaches home. */
function silenceEligible(errand, tick, returnVisibleOverride = null) {
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

/** @param {Record<string, unknown>} errand @param {number} tick */
function scheduledPosition(errand, tick) {
  const journey = errand.state === 'returning' ? 'return' : 'outbound';
  const legs = Array.isArray(errand.legs)
    ? errand.legs.filter((leg) => asObject(leg).journey === journey).map(asObject)
    : [];
  if (!legs.length) return null;
  const currentIndex = legs.findIndex((leg) => Number(tick) >= Number(leg.departTick)
    && !namedPersonLegPosition(
      /** @type {import('./namedPersonTransit.js').NamedPersonLeg} */ (leg),
      tick,
    ).arrived);
  let completedIndex = -1;
  for (let index = 0; index < legs.length; index += 1) {
    if (Number(tick) >= Number(legs[index].arrivalTick)) completedIndex = index;
  }
  if (currentIndex < 0 && completedIndex === legs.length - 1) {
    const lastIndex = legs.length - 1;
    const last = legs[lastIndex];
    return {
      complete: true,
      positionRef: {
        journey,
        legIndex: lastIndex,
        fromId: last.fromId,
        toId: last.toId,
        progressBand: 'arrived',
      },
    };
  }
  if (currentIndex < 0 && completedIndex >= 0) {
    const completed = legs[completedIndex];
    return {
      complete: false,
      positionRef: {
        journey,
        legIndex: completedIndex,
        fromId: completed.fromId,
        toId: completed.toId,
        progressBand: 'arrived',
      },
    };
  }
  // Before the first scheduled departure the traveler still stands at its
  // authored origin; the persisted cursor uses the first leg's departed band.
  if (currentIndex < 0) {
    const first = legs[0];
    return {
      complete: false,
      positionRef: {
        journey,
        legIndex: 0,
        fromId: first.fromId,
        toId: first.toId,
        progressBand: 'departed',
      },
    };
  }
  const leg = legs[currentIndex];
  const { progress01: progress } = namedPersonLegPosition(
    /** @type {import('./namedPersonTransit.js').NamedPersonLeg} */ (leg),
    tick,
  );
  const progressBand = progress <= 0 ? 'departed' : progress < 0.67 ? 'underway' : 'near';
  return {
    complete: false,
    positionRef: {
      journey,
      legIndex: currentIndex,
      fromId: leg.fromId,
      toId: leg.toId,
      progressBand,
    },
  };
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
  const scheduled = scheduledPosition(errand, at);
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
function homeDeliveryFor(errand) {
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
      const scheduled = scheduledPosition(errand, now);
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
