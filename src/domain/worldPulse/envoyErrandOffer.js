/**
 * envoyErrand/offer — the authored peace outcome, its accepted ruling, and the identity
 * both of them mint.
 *
 * A PURE LEAF OF THE ENVOY-ERRAND WRITER FAMILY (ruling R-BLD-4). It answers three
 * questions and writes nothing:
 *
 *   WHAT MAY TRAVEL — `normalizeEnvoyPeaceOffer` reduces a bilateral outcome to the exact
 *     mechanical subset the return replay needs. Reader headlines, probabilities and
 *     current-world observations are excluded ON PURPOSE: an envoy carries a decision, not
 *     a view of the world it left.
 *   WHAT WAS ALREADY DECIDED — `normalizeEnvoyAcceptance` freezes the WR-5 ruling that
 *     authorized dispatch, so return-time replay never asks a LATER court to adjudicate
 *     the same offer again against a world that has moved.
 *   WHO THIS EPISODE IS — `envoyOfferEpisodeKey` and its two id spellings. Identity keys
 *     on the FRONT EPISODE, never on the volatile proposal/outcome id, which is what makes
 *     a retry idempotent instead of a second traveller.
 *
 * K3 (NOBODY IS EVER CURRENT): this leaf reaches the vocabulary and nothing else. Every
 * value it returns was authored by the caller before departure; none of it is re-read.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/envoyK3BeliefSeam.test.js + tests/domain/envoyErrand.test.js
 */
import {
  ENVOY_PICTURE_DIRECTIONS,
  ENVOY_PICTURE_FIELDS,
  ENVOY_REQUIRED_RULES,
  PICTURE_BANDS,
  asObject,
  jsonRecord,
  text,
  wholeTick,
} from './envoyErrandVocabulary.js';

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
export function envoyAttemptIdForOffer(rawOffer) {
  const offer = normalizeEnvoyPeaceOffer(rawOffer);
  const base = envoyErrandIdForOffer(offer);
  if (!offer || !base) return '';
  const offerId = String(offer.outcomeId);
  return `${base}:attempt:${offerId.length}:${offerId}`;
}

/** Exact equality over the canonical mechanical offer allowlist. */
export function sameEnvoyOffer(left, right) {
  const a = normalizeEnvoyPeaceOffer(left);
  const b = normalizeEnvoyPeaceOffer(right);
  return !!(a && b && JSON.stringify(a) === JSON.stringify(b));
}
