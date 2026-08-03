/**
 * warPeaceRefusal.js — WR-5's priced second no.
 *
 * A target court may refuse an offered peace, but the refusal is never free:
 * the opponent remembers it, the refuser's public legitimacy can fall, and an
 * actual allied co-besieger loses patience.  The live deployments are purposely
 * untouched, so the already-existing home-front drain continues by consequence
 * rather than through a new war-tax write.  Every mutation rides an existing
 * owner (`applyRelationshipPatch` / `applyLegitimacyHits`) and dedupes by the
 * immutable offer outcome id.
 */

import { clamp01 } from '../../kernel/math.js';
import {
  applyRelationshipPatch,
  ensureRelationshipState,
  relationshipKeyFromEdge,
} from './relationshipEvolution.js';
import { applyLegitimacyHits } from './momentum.js';

export const WAR_PEACE_REFUSAL_TUNING = Object.freeze({
  OPPONENT_TRUST_HIT: 0.08,
  OPPONENT_RESENTMENT_GAIN: 0.12,
  LEGITIMACY_HIT: 4,
  ALLY_TRUST_HIT: 0.05,
  ALLY_RESENTMENT_GAIN: 0.06,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number} */
function num(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

/** Keep persisted relationship costs byte-tidy across JS floating arithmetic. */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** @param {Record<string, unknown>} worldState @param {string} key @param {string} outcomeId */
function alreadyPriced(worldState, key, outcomeId) {
  const current = asObject(asObject(worldState.relationshipStates)[key]);
  if (String(current.peaceDecisionOutcomeId || '') === outcomeId) return true;
  const incidents = Array.isArray(current.recentIncidents) ? current.recentIncidents : [];
  return incidents.some((incident) => {
    const row = asObject(incident);
    return row.type === 'peace_refused' && String(row.outcomeId || '') === outcomeId;
  });
}

/** Absolute bounded relationship patch from a signed refusal cost. */
function refusalPatch(worldState, key, edge, trustHit, resentmentGain, peaceDecision = null) {
  const current = ensureRelationshipState(
    edge,
    asObject(asObject(worldState.relationshipStates)[key]),
  );
  return {
    ...current,
    trust: round4(clamp01(num(current.trust) - trustHit)),
    resentment: round4(clamp01(num(current.resentment) + resentmentGain)),
    ...(peaceDecision ? peaceDecision : {}),
  };
}

/** Current relationship type, overlay first. */
function edgeType(worldState, edge) {
  const key = relationshipKeyFromEdge(edge);
  const overlay = asObject(asObject(worldState.relationshipStates)[key]);
  return String(overlay.relationshipType || asObject(edge).relationshipType || asObject(edge).type || '');
}

/** Other endpoint of an edge incident to `id`, or ''. */
function otherEndpoint(edge, id) {
  const row = asObject(edge);
  const from = String(row.from || row.source || '');
  const to = String(row.to || row.target || '');
  if (from === id) return to;
  if (to === id) return from;
  return '';
}

/**
 * Apply refusal costs once. Returns the original references on a duplicate.
 *
 * @param {{
 *   worldState:Record<string,unknown>,
 *   settlementUpdates:Array<{saveId?:unknown,settlement?:unknown}>,
 *   regionalGraph?:{edges?:unknown[]}|null,
 *   outcome:Record<string,unknown>,
 *   decision:{offererId:string,targetId:string,receipt:Record<string,unknown>,termination?:{receipt?:Record<string,unknown>}},
 *   tick?:unknown,
 *   now?:unknown,
 * }} args
 * @returns {{worldState:Record<string,unknown>,settlementUpdates:Array<{saveId?:unknown,settlement?:unknown}>,evidence:Array<Record<string,unknown>>,applied:boolean,allyIds:string[]}}
 */
export function applyWarPeaceRefusal({
  worldState,
  settlementUpdates,
  regionalGraph = null,
  outcome,
  decision,
  tick = null,
  now = null,
}) {
  const offerId = String(outcome.id || '');
  const relationshipKey = String(outcome.relationshipKey || asObject(outcome.proposalPayload).relationshipKey || '');
  if (!offerId || !relationshipKey || alreadyPriced(worldState, relationshipKey, offerId)) {
    return { worldState, settlementUpdates, evidence: [], applied: false, allyIds: [] };
  }
  const offererId = String(decision.offererId || '');
  const targetId = String(decision.targetId || '');
  if (!offererId || !targetId) {
    return { worldState, settlementUpdates, evidence: [], applied: false, allyIds: [] };
  }
  const T = WAR_PEACE_REFUSAL_TUNING;
  const atTick = Number.isFinite(Number(tick)) ? Math.max(0, Math.floor(Number(tick))) : 0;
  const peaceDecision = {
    peaceDecisionOutcomeId: offerId,
    peaceDecisionTick: atTick,
    peaceDecision: 'refused',
  };
  const relationshipEdge = (Array.isArray(regionalGraph?.edges) ? regionalGraph.edges : [])
    .find((edge) => relationshipKeyFromEdge(edge) === relationshipKey);
  if (!relationshipEdge) {
    return { worldState, settlementUpdates, evidence: [], applied: false, allyIds: [] };
  }
  let state = applyRelationshipPatch(worldState, {
    id: offerId,
    candidateType: 'peace_refused',
    relationshipKey,
    relationshipPatch: refusalPatch(
      worldState,
      relationshipKey,
      relationshipEdge,
      T.OPPONENT_TRUST_HIT,
      T.OPPONENT_RESENTMENT_GAIN,
      peaceDecision,
    ),
    metadata: { incidentType: 'peace_refused' },
    severity: 0.62,
  }, now);

  const beforeUpdates = settlementUpdates;
  const nextUpdates = applyLegitimacyHits(
    settlementUpdates,
    new Map([[targetId, -T.LEGITIMACY_HIT]]),
  );
  const legitimacyChanged = nextUpdates !== beforeUpdates;

  // Patience is charged only to a real allied court that has its own army in
  // this exact war. A friendly label without expenditure is not evidence.
  const deployments = asObject(state.deployments);
  const eligibleAllyRows = (Array.isArray(regionalGraph?.edges) ? regionalGraph.edges : [])
    .map((edge) => ({
      edge,
      allyId: otherEndpoint(edge, targetId),
      relationshipKey: relationshipKeyFromEdge(edge),
    }))
    .filter(({ edge, allyId, relationshipKey: key }) => {
      const deployment = asObject(deployments[allyId]);
      return key
      && allyId
      && allyId !== offererId
      && edgeType(state, edge) === 'allied'
      && String(deployment.targetId || '') === offererId
      && !deployment.recalled;
    })
    .sort((a, b) => (
      a.allyId < b.allyId ? -1
        : a.allyId > b.allyId ? 1
          : a.relationshipKey < b.relationshipKey ? -1
            : a.relationshipKey > b.relationshipKey ? 1 : 0
    ));
  // A regional graph can retain parallel authored edges for the same pair.
  // Patience belongs to the allied COURT, not to each graph row: select the
  // codepoint-low relationship key once per ally so input order cannot change
  // which durable state is priced or mint duplicate ally evidence ids.
  const allyRows = eligibleAllyRows.filter((row, index) => (
    index === 0 || row.allyId !== eligibleAllyRows[index - 1].allyId
  ));
  const allyIds = [];
  for (const { edge, allyId, relationshipKey: key } of allyRows) {
    if (alreadyPriced(state, key, offerId)) continue;
    state = applyRelationshipPatch(state, {
      id: offerId,
      candidateType: 'peace_refused',
      relationshipKey: key,
      relationshipPatch: refusalPatch(state, key, edge, T.ALLY_TRUST_HIT, T.ALLY_RESENTMENT_GAIN),
      metadata: { incidentType: 'peace_refused' },
      severity: 0.46,
    }, now);
    allyIds.push(allyId);
  }

  // WR-5's behavioral writer returns typed facts, never reader prose. The one
  // governed projector resolves names, privacy, vocabulary and desk routing at
  // the apply mouth. The target's exact termination receipt supplies the seat
  // only when one truly exists; missing identity simply makes the named family
  // ineligible downstream.
  const targetRead = asObject(asObject(decision.termination).receipt);
  const decisionRead = asObject(decision.receipt);
  const common = {
    tick: atTick,
    settlementId: targetId,
    counterpartId: offererId,
    offererId,
    targetId,
    ...targetRead,
    ...decisionRead,
  };
  /** @type {Array<Record<string,unknown>>} */
  const evidence = [
    { ...common, kind: 'peace_refused', id: offerId },
    ...(legitimacyChanged
      ? [{ ...common, kind: 'refusal_cost_legitimacy', id: offerId }]
      : []),
  ];
  if (decisionRead.interestServed === 'seat' || decisionRead.interestServed === 'patron') {
    evidence.push({ ...common, kind: 'war_continued_for_the_seat', id: offerId });
  }
  if (decisionRead.interestServed === 'patron') {
    evidence.push({ ...common, kind: 'ruler_books_compromised', id: offerId });
  }
  if (targetRead.momentumBroken === true
    || asObject(decisionRead.inheritedDemand).desiredAction === 'continue') {
    evidence.push({ ...common, kind: 'successor_escalates_war', id: offerId });
  }
  for (const allyId of allyIds) {
    evidence.push({
      ...common,
      kind: 'refusal_cost_ally_patience',
      id: `${offerId}:ally:${allyId}`,
      thirdPartyId: allyId,
    });
  }

  return { worldState: state, settlementUpdates: nextUpdates, evidence, applied: true, allyIds };
}
