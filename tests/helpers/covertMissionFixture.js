/**
 * covertMissionFixture.js — a REAL covert mission, minted through the production writer.
 *
 * ES-2's own battery records why this shape matters and it binds here too: a hand-shaped
 * errand object lets the persistence DTO drift out from under a whole test file silently.
 * Every mission this helper returns has been through `mintEnvoyErrand` and read back out of
 * the ledger, so a pin driven by it is a pin driven by what a save file can actually hold.
 *
 * This file is a FIXTURE, not an enforcer: it asserts nothing. Callers own their claims.
 */
import {
  ENVOY_REQUIRED_RULES,
  envoyErrandsOf,
  mintEnvoyErrand,
  normalizeEnvoyPeaceOffer,
} from '../../src/domain/worldPulse/envoyErrand.js';

const WAR_RULES = Object.freeze(Object.fromEntries(ENVOY_REQUIRED_RULES.map((k) => [k, true])));

/**
 * A world with the errand spine, espionage and beliefs all live.
 * @param {Record<string, unknown>} [rules] rule overrides folded over the lit set
 * @returns {Record<string, unknown>}
 */
export function litCovertWorld(rules = {}) {
  return {
    tick: 10,
    spatialCanonVersion: 1,
    simulationRules: {
      ...WAR_RULES,
      infoMode: 'unreliable',
      errandSpineEnabled: true,
      espionageEnabled: true,
      ...rules,
    },
    relationshipStates: { untouched: { relationshipType: 'hostile' } },
  };
}

const SNAPSHOT_BANDS = Object.freeze({
  storesBand: 'thin',
  strengthBand: 'ready',
  moraleExhaustionBand: 'present',
  foundingCauseStatus: 'live',
  believedRatioBand: 'matched',
});

/** @param {string} from @param {string} to */
function peaceOffer(from, to) {
  const relationshipKey = `${from}::${to}`;
  return {
    id: 'peace.offer.1',
    generatedAtTick: 10,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleId: 'settlement_strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: from,
    severity: 0.91,
    reasons: ['Engine prose does not ride with the envoy.'],
    relationshipKey,
    relationshipPatch: {
      proposedRelationshipType: 'neutral', trajectory: 'transitioning', privateScalar: 0.75,
    },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey,
      fromType: 'hostile',
      toType: 'neutral',
      peaceOffer: true,
      offererId: from,
      targetId: to,
      peaceFrontOwnerId: from,
      peaceFrontSinceTick: 4,
      reason: 'Engine prose is deliberately excluded.',
    },
  };
}

/** @param {Record<string, unknown>} outcome */
function acceptedRuling(outcome) {
  const offer = normalizeEnvoyPeaceOffer(outcome);
  const { offererId, targetId } = offer.proposalPayload;
  return {
    accepted: true,
    offererId,
    targetId,
    receipt: {
      id: `decision.${offererId}.${targetId}`,
      kind: 'war_peace_acceptance_read',
      tick: 10,
      offerId: offer.id,
      offererId,
      targetId,
      decision: 'accept',
      actualAction: 'peace',
      decidingTerm: 'cost_to_continue',
      bands: {
        cause: 'present', cost_to_continue: 'pressing', cost_to_stop: 'present', momentum: 'quiet',
      },
      reason: 'Both courts accept the carried peace.',
    },
    offererRead: {
      id: `termination.${offererId}.${targetId}`,
      kind: 'war_termination_read',
      tick: 10,
      attackerId: offererId,
      targetId,
      settlementIds: [offererId, targetId],
      booksDirection: 'peace',
      booksInterest: 'realm',
    },
    termination: {
      receipt: {
        id: `termination.${targetId}.${offererId}`,
        kind: 'war_termination_read',
        tick: 10,
        attackerId: targetId,
        targetId: offererId,
        settlementIds: [targetId, offererId],
        booksDirection: 'peace',
        booksInterest: 'realm',
      },
    },
    inheritedDemand: null,
    coalitionPeaceExpenditures: [],
  };
}

/** The default plan: arrive westmarch at 12, leave for irontown at 20, arrive 22. */
export const COVERT_LEGS = Object.freeze([
  Object.freeze({ fromId: 'ashford', toId: 'westmarch', departTick: 10, arrivalTick: 12 }),
  Object.freeze({ fromId: 'westmarch', toId: 'irontown', departTick: 20, arrivalTick: 22 }),
]);

/**
 * Mint one covert mission into a world and hand back the row as the LEDGER holds it.
 *
 * `plain: true` mints the SAME journey as an ORDINARY diplomatic errand — no purposeClass,
 * no covert sub-record. It is the control every espionage dormancy fence needs: a world
 * whose errand ledger is populated and whose rows the espionage stages must not touch.
 *
 * @param {Record<string, unknown>} worldState
 * @param {{legs?: ReadonlyArray<Record<string, unknown>>, covert?: Record<string, unknown>|null,
 *   from?: string, to?: string, npcId?: string, plain?: boolean}} [options]
 * @returns {{worldState: Record<string, unknown>, errand: Record<string, unknown>}}
 */
export function mintCovertFixture(worldState, {
  legs = COVERT_LEGS, covert = null, from = 'ashford', to = 'irontown', npcId = 'npc.reeve',
  plain = false,
} = {}) {
  const outcome = peaceOffer(from, to);
  const cargo = covert ?? {
    demand: 'confirm',
    product: 'confirm',
    subjectId: to,
    itinerary: [
      { face: 'covert', settlementId: 'westmarch', stayTicks: 2 },
      { face: 'declared', settlementId: to, stayTicks: 2 },
    ],
  };
  const minted = mintEnvoyErrand({
    worldState,
    outcome,
    acceptance: acceptedRuling(outcome),
    npcId,
    npcName: 'Reeve Mara',
    snapshot: SNAPSHOT_BANDS,
    purpose: 'sue',
    ...(plain ? {} : { purposeClass: 'covert', covert: cargo }),
    routePlan: {
      legs: legs.map((leg) => ({ ...leg })),
      expectedReturnTick: Number(legs[legs.length - 1].arrivalTick) + 18,
      routeRef: { id: 'road.north', name: 'North Road' },
    },
    tick: 10,
  });
  return {
    worldState: /** @type {Record<string, unknown>} */ (minted.worldState),
    errand: envoyErrandsOf(minted.worldState)[0],
  };
}
