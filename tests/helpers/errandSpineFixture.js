/**
 * errandSpineFixture.js — SP-D's shared REAL-MINT fixture.
 *
 * Every SP-D pin that claims something about a persisted errand mints one through the
 * production writer rather than hand-authoring a row. That is deliberate: `normalizeErrand`
 * is a cross-field law with roughly forty refusal clauses, and a hand-built row that skips
 * it proves nothing about what actually survives a write. The dormancy fence, the lifecycle
 * totality suite and the veil pins all share this file so no two of them can drift into
 * testing different worlds.
 *
 * THE COVERT SHAPE IS THE POINT (and the vacuous-absence class is why). A fail-closed pin
 * proven on an empty harness passes with the feature deleted. `mintCovert` therefore
 * produces a SEEDED errand that genuinely carries `purposeClass: 'covert'` and a live
 * declared/true split — an embassy's purpose worn as a face over covert business, which is
 * ES-1's first consumer shape exactly.
 */
import { ENVOY_REQUIRED_RULES, mintEnvoyErrand } from '../../src/domain/worldPulse/envoyErrand.js';

export const LIT_WAR_RULES = Object.freeze(Object.fromEntries(
  ENVOY_REQUIRED_RULES.map((key) => [key, true]),
));

export const SNAPSHOT = Object.freeze({
  storesBand: 'thin',
  strengthBand: 'ready',
  moraleExhaustionBand: 'present',
  foundingCauseStatus: 'live',
  believedRatioBand: 'matched',
});

/**
 * A world with the six war flags lit and the errand spine in whatever state the caller
 * names. `spine` omitted ⇒ the key is ABSENT, which is the installed-save shape.
 * @param {{spine?: unknown, tick?: number}} [args]
 */
export function spineWorld({ spine, tick = 10 } = {}) {
  return {
    tick,
    simulationRules: {
      ...LIT_WAR_RULES,
      ...(spine === undefined ? {} : { errandSpineEnabled: spine }),
    },
    relationshipStates: { untouched: { relationshipType: 'hostile' } },
  };
}

/** @param {{id?: string, tick?: number, from?: string, to?: string}} [args] */
export function peaceOffer({
  id = 'peace.offer.1', tick = 10, from = 'ashford', to = 'irontown',
} = {}) {
  const relationshipKey = `${from}::${to}`;
  return {
    id,
    generatedAtTick: tick,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleId: 'settlement_strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: from,
    severity: 0.91,
    reasons: ['Raw engine prose must not ride with the envoy.'],
    relationshipKey,
    relationshipPatch: {
      proposedRelationshipType: 'neutral',
      trajectory: 'transitioning',
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
      reason: 'Reader-facing engine prose is deliberately excluded.',
    },
  };
}

/** @param {Record<string, unknown>} outcome */
export function acceptedRuling(outcome) {
  const { offererId, targetId } = /** @type {Record<string, string>} */ (
    /** @type {Record<string, unknown>} */ (outcome.proposalPayload)
  );
  const tick = Number(outcome.generatedAtTick);
  const read = (attackerId, otherId) => ({
    id: `termination.${attackerId}.${otherId}`,
    kind: 'war_termination_read',
    tick,
    attackerId,
    targetId: otherId,
    settlementIds: [attackerId, otherId],
    booksDirection: 'peace',
    booksInterest: 'realm',
  });
  return {
    accepted: true,
    offererId,
    targetId,
    receipt: {
      id: `decision.${offererId}.${targetId}`,
      kind: 'war_peace_acceptance_read',
      tick,
      offerId: outcome.id,
      offererId,
      targetId,
      decision: 'accept',
      actualAction: 'peace',
      decidingTerm: 'cost_to_continue',
      bands: {
        cause: 'present',
        cost_to_continue: 'pressing',
        cost_to_stop: 'present',
        momentum: 'quiet',
      },
      reason: 'Both courts accept the carried peace.',
    },
    offererRead: read(offererId, targetId),
    termination: { receipt: read(targetId, offererId) },
    inheritedDemand: null,
    coalitionPeaceExpenditures: [],
  };
}

/** @param {{from?: string, to?: string, departTick?: number}} [args] */
export function routePlan({ from = 'ashford', to = 'irontown', departTick = 10 } = {}) {
  return {
    legs: [{ fromId: from, toId: to, departTick, arrivalTick: departTick + 2 }],
    expectedReturnTick: departTick + 10,
    routeRef: { id: 'road.north', name: 'North Road' },
  };
}

/**
 * Mint one errand through the production writer.
 * @param {Record<string, unknown>} worldState
 * @param {Record<string, unknown>} [extra] spine cargo + overrides
 */
export function mintOne(worldState, extra = {}) {
  const outcome = /** @type {Record<string, unknown>} */ (extra.outcome || peaceOffer());
  return mintEnvoyErrand({
    worldState,
    outcome,
    acceptance: acceptedRuling(outcome),
    npcId: 'npc.envoy.1',
    npcName: 'A Named Legate',
    snapshot: SNAPSHOT,
    purpose: 'sue',
    routePlan: routePlan(),
    tick: 10,
    ...extra,
  });
}

/**
 * THE SEEDED COVERT ERRAND — an embassy's purpose, covert business, a diplomatic face.
 * @param {Record<string, unknown>} [overrides]
 */
export function mintCovert(overrides = {}) {
  return mintOne(spineWorld({ spine: true }), {
    purposeClass: 'covert',
    declaredPurpose: 'diplomatic',
    ...overrides,
  });
}
