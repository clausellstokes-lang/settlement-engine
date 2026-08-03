/**
 * warPeaceDecision.js — WR-5's bilateral peace-decision adapter.
 *
 * Approval of a `strategy_sue_for_peace` proposal is the offerer's first yes.
 * This leaf asks the named target court for the second yes through WR-1's exact
 * four-term evaluator (`readWarTerminationForParty`); it owns no state and no
 * randomness.  One no leaves the war live.  A typed demand carried by the
 * current seat transition is the sole override: a faction-installed successor
 * must actually honor the decision that installed it.
 */

import { readWarTerminationForParty } from './warTermination.js';
import { readWarSeatBooks } from './warSeatBooks.js';
import { stablePart } from './stablePart.js';
import { authorityTransferEpochFor, governingFactionOf, nameOf } from '../rulingPower.js';
import { ladderFactionKey, normalizeSeatTransitions } from './npcLadderState.js';
import {
  getRelationshipSettlements,
  normalizeRelationshipType,
  relationshipKeyFromEdge,
} from './relationshipState.js';
import { deriveSettlementPressures, pressureIndex } from './pressureModel.js';

/** Named, bounded decision threshold; tuning can move the height, not the rule. */
export const WAR_PEACE_DECISION_TUNING = Object.freeze({ ACCEPT_AT: 0.5 });

const PEACE_STEP = Object.freeze({
  hostile: 'cold_war',
  cold_war: 'rival',
  rival: 'trade_partner',
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number} */
function wholeTick(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
}

/** Parse an externally supplied tick without letting null/blank input become 0. */
function inputTick(value) {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : null;
}

/** @param {unknown} outcome @returns {boolean} */
export function isBilateralPeaceOffer(outcome) {
  const row = asObject(outcome);
  const payload = asObject(row.proposalPayload);
  return row.candidateType === 'strategy_sue_for_peace'
    && payload.kind === 'relationship_label_change'
    && payload.peaceOffer === true;
}

/**
 * The current seat's inherited war demand, if one exists for this exact pair.
 * Reads the bounded ladder-owned transition history defensively; malformed or
 * unrelated history is absence, never a fabricated command.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string} actorId
 * @param {string} opponentId
 * @returns {{decisionId:string,desiredAction:'peace'|'continue',actorId:string,targetId:string}|null}
 */
export function inheritedWarDemandFor(worldState, actorId, opponentId, snapshot = null) {
  const state = asObject(worldState);
  const rules = asObject(state.simulationRules);
  if (rules.warLayerEnabled !== true || rules.warTerminationEnabled !== true) return null;
  const spatial = asObject(state.spatialLedgers);
  const ladder = asObject(spatial.npcLadder);
  const record = asObject(ladder[actorId]);
  const rawRows = Array.isArray(record.seatTransitions) ? record.seatTransitions : [];
  // Only the newest legitimate-authority transition can bind the current
  // court. A later organic succession (even one carrying no war demand)
  // retires the installing faction's charge; scanning backwards would let an
  // old coup command an unrelated successor indefinitely. Imported array order
  // is not chronology, so normalize the whole bounded history before selecting;
  // if any row is malformed, fail closed rather than dropping it and reviving a
  // command from behind an unreadable authority fact.
  if (!rawRows.length) return null;
  const normalized = normalizeSeatTransitions(rawRows);
  if (normalized.length !== rawRows.length) return null;
  const transition = asObject(normalized[normalized.length - 1]);
  const stateTick = inputTick(state.tick);
  // A restored/imported ladder row from a future pulse is not yet this court's
  // history. Without a readable campaign tick there is no safe temporal claim.
  if (stateTick == null || Number(transition.tick) > stateTick) return null;
  const demand = asObject(transition.warDemand);
  const desired = String(demand.desiredAction || '');
  const toRulerId = String(transition.toRulerId || '');
  const item = snapshot?.byId instanceof Map
    ? snapshot.byId.get(actorId)
    : (Array.isArray(snapshot?.settlements) ? snapshot.settlements : [])
      .find((row) => String(asObject(row).id || '') === actorId);
  const settlement = asObject(asObject(item).settlement || item);
  const governing = governingFactionOf(/** @type {any} */ (settlement));
  if (!governing) return null;
  const books = readWarSeatBooks({ worldState, snapshot, actorId, opponentId });
  const livingRulerId = String(books.rulerId || '');
  const governingKey = ladderFactionKey(/** @type {any} */ (governing));
  const directRungs = asObject(asObject(record.factions)[governingKey]).rungs;
  const directTop = Array.isArray(directRungs) ? String(directRungs[0] || '') : '';
  const transitionAuthorityMatches = (
    String(transition.governingFactionId || '')
      && String(asObject(governing).id || '')
      && String(transition.governingFactionId) === String(asObject(governing).id)
  ) || (
    String(transition.governingFactionName || '')
      && String(transition.governingFactionName) === nameOf(governing)
  );
  const someFactionStillSeatsIt = Object.values(asObject(record.factions)).map(asObject)
    .some((faction) => Array.isArray(faction.rungs) && String(faction.rungs[0] || '') === toRulerId);
  const transitionEpoch = String(transition.authorityEpoch || '');
  const currentEpoch = authorityTransferEpochFor(/** @type {any} */ (settlement));
  // The canonical governing ladder is the primary authority. Name-keyed legacy
  // bodies may be renamed by transfer; there the transition's current governing
  // identity plus its still-seated holder is the only honest fallback. A later
  // transfer epoch retires the demand even when the same NPC remains in office.
  const stillCurrent = !!toRulerId
    && livingRulerId === toRulerId
    && !!transitionEpoch
    && transitionEpoch === currentEpoch
    && (
    directTop === toRulerId || (transitionAuthorityMatches && someFactionStillSeatsIt)
  );
  if (!stillCurrent
    || !['peace', 'continue'].includes(desired)
    || String(demand.actorId || '') !== actorId
    || String(demand.targetId || '') !== opponentId) return null;
  const decisionId = String(demand.decisionId || '');
  if (!decisionId) return null;
  return {
    decisionId,
    desiredAction: /** @type {'peace'|'continue'} */ (desired),
    actorId,
    targetId: opponentId,
  };
}

/**
 * Resolve the target court's half of a live peace offer.
 *
 * @param {{
 *   worldState?:Record<string,unknown>|null,
 *   snapshot?:{byId?:Map<string,unknown>,settlements?:unknown[],regionalGraph?:{edges?:unknown[]}}|null,
 *   pIndex?:unknown,
 *   outcome?:unknown,
 *   tick?:unknown,
 * }} args
 * @returns {{
 *   offererId:string,targetId:string,accepted:boolean,decision:'accept'|'refuse',
 *   inheritedDemand:null|{decisionId:string,desiredAction:'peace'|'continue',actorId:string,targetId:string},
 *   offererTermination:NonNullable<ReturnType<typeof readWarTerminationForParty>>,
 *   offererRead:Record<string,unknown>,
 *   termination:NonNullable<ReturnType<typeof readWarTerminationForParty>>,
 *   receipt:Record<string,unknown>,
 * }|null}
 */
export function readWarPeaceDecision({
  worldState = null,
  snapshot = null,
  pIndex = null,
  outcome = null,
  tick = null,
} = {}) {
  if (!isBilateralPeaceOffer(outcome)) return null;
  const row = asObject(outcome);
  const state = asObject(worldState);
  const payload = asObject(row.proposalPayload);
  const offererId = String(payload.offererId || row.targetSaveId || '');
  const targetId = String(payload.targetId || '');
  if (!offererId || !targetId || offererId === targetId
    || String(row.targetSaveId || '') !== offererId) return null;
  const offerId = String(row.id || '');
  if (!offerId) return null;
  const deployments = asObject(state.deployments);
  const frontOwnerId = String(payload.peaceFrontOwnerId || '');
  const liveFront = asObject(deployments[frontOwnerId]);
  const expectedFrontTarget = frontOwnerId === offererId ? targetId
    : frontOwnerId === targetId ? offererId : '';
  const offerTick = inputTick(row.generatedAtTick ?? row.tick);
  const frontSinceTick = inputTick(asObject(liveFront).sinceTick);
  const offeredFrontSinceTick = inputTick(payload.peaceFrontSinceTick);
  // A docket item belongs to the deployment episode that existed when it was
  // offered. It may not end a later war between the same pair after that front
  // was recalled and re-opened.
  if (!expectedFrontTarget
    || String(liveFront.targetId || '') !== expectedFrontTarget
    || offerTick == null
    || frontSinceTick == null
    || offeredFrontSinceTick == null
    || frontSinceTick !== offeredFrontSinceTick
    || frontSinceTick > offerTick) return null;
  const payloadRelationshipKey = String(payload.relationshipKey || '');
  const outcomeRelationshipKey = String(row.relationshipKey || '');
  const relationshipPatch = asObject(row.relationshipPatch);
  if (!payloadRelationshipKey || !outcomeRelationshipKey
    || payloadRelationshipKey !== outcomeRelationshipKey
    || !Object.keys(relationshipPatch).length) return null;
  const relationshipKey = payloadRelationshipKey;
  const edges = Array.isArray(snapshot?.regionalGraph?.edges) ? snapshot.regionalGraph.edges : [];
  const edge = edges.find((candidate) => relationshipKeyFromEdge(candidate) === relationshipKey) || null;
  const endpoints = getRelationshipSettlements(edge);
  const pairMatches = edge && new Set([String(endpoints.from || ''), String(endpoints.to || '')]).size === 2
    && [String(endpoints.from || ''), String(endpoints.to || '')].includes(offererId)
    && [String(endpoints.from || ''), String(endpoints.to || '')].includes(targetId);
  const overlayTypeRaw = asObject(asObject(worldState).relationshipStates)[relationshipKey]?.relationshipType;
  const graphTypeRaw = asObject(edge).relationshipType || asObject(edge).type;
  const currentTypes = [overlayTypeRaw, graphTypeRaw]
    .filter((value) => typeof value === 'string' && value)
    .map(normalizeRelationshipType);
  const offeredFromType = normalizeRelationshipType(payload.fromType);
  const offeredToType = normalizeRelationshipType(payload.toType);
  const patchedToType = normalizeRelationshipType(
    relationshipPatch.proposedRelationshipType ?? relationshipPatch.relationshipType,
  );
  if (!relationshipKey || !pairMatches || !currentTypes.length
    || currentTypes.some((currentType) => currentType !== offeredFromType)
    || PEACE_STEP[offeredFromType] !== offeredToType
    || patchedToType !== offeredToType) return null;
  const decisionSnapshot = snapshot
    ? { ...snapshot, worldState }
    : { settlements: [], worldState };
  const decisionItems = snapshot?.byId instanceof Map
    ? snapshot.byId
    : new Map((Array.isArray(snapshot?.settlements) ? snapshot.settlements : [])
      .map((item) => [String(asObject(item).id || ''), item])
      .filter(([id]) => id));
  if (!decisionItems.has(offererId) || !decisionItems.has(targetId)) return null;
  const livePressureIndex = pIndex && typeof pIndex.get === 'function'
    ? pIndex
    : pressureIndex(deriveSettlementPressures(decisionSnapshot));
  const termination = readWarTerminationForParty({
    worldState,
    snapshot,
    pIndex: livePressureIndex,
    tick,
    actorId: targetId,
    opponentId: offererId,
  });
  if (!termination) return null;
  const offererTermination = readWarTerminationForParty({
    worldState,
    snapshot,
    pIndex: livePressureIndex,
    tick,
    actorId: offererId,
    opponentId: targetId,
  });
  if (!offererTermination) return null;
  const storedOffererRead = asObject(asObject(row.metadata).warRulingRead);
  const storedPairMatches = String(storedOffererRead.attackerId || '') === offererId
    && String(storedOffererRead.targetId || '') === targetId;
  const offererRead = storedPairMatches
    ? storedOffererRead
    : asObject(offererTermination.receipt);

  const inheritedDemand = inheritedWarDemandFor(state, targetId, offererId, snapshot);
  const accepted = inheritedDemand
    ? inheritedDemand.desiredAction === 'peace'
    : termination.suePressure01 >= WAR_PEACE_DECISION_TUNING.ACCEPT_AT;
  const now = wholeTick(tick ?? state.tick);
  const decision = accepted ? 'accept' : 'refuse';
  const actualAction = accepted ? 'peace' : 'continue';
  const terminationReceipt = asObject(termination.receipt);
  const booksDirection = String(terminationReceipt.booksDirection || 'even');
  const booksInterest = String(terminationReceipt.booksInterest || '');
  // Name whose books the decision served only when the existing termination
  // read actually establishes that direction. An inherited charge can override
  // the current ruler's books; that case is receipted by `inheritedDemand`
  // instead of falsely attributing the choice to the current seat or realm.
  const interestServed = booksDirection === actualAction
    && ['realm', 'seat', 'patron'].includes(booksInterest)
    ? booksInterest
    : null;
  const reason = inheritedDemand
    ? accepted
      ? 'The installed seat keeps the peace charge that brought it to power.'
      : 'The installed seat keeps the war charge that brought it to power.'
    : accepted
      ? 'The target court finds the price of another campaign heavier than the offered peace.'
      : 'The target court finds the offered peace costlier than holding the war open.';
  return {
    offererId,
    targetId,
    accepted,
    decision,
    inheritedDemand,
    offererTermination,
    offererRead,
    termination,
    receipt: {
      id: `war-peace-decision.${stablePart(offererId)}.${stablePart(targetId)}.${now}`,
      kind: 'war_peace_acceptance_read',
      tick: now,
      offerId: String(row.id || ''),
      offererId,
      targetId,
      decision,
      actualAction,
      decidingTerm: termination.decidingTerm,
      bands: termination.bands,
      booksDirection,
      ...(booksInterest ? { booksInterest } : {}),
      ...(interestServed ? { interestServed } : {}),
      ...(typeof terminationReceipt.booksPublicReason === 'string'
        ? { booksPublicReason: terminationReceipt.booksPublicReason }
        : {}),
      reason,
      ...(inheritedDemand ? { inheritedDemand } : {}),
    },
  };
}
