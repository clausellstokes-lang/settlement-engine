import { describe, expect, it } from 'vitest';

import {
  ENVOY_ERRAND_LEDGER_KEY,
  ENVOY_REQUIRED_RULES,
  MAX_CONCURRENT_ENVOYS,
  MAX_TERMINAL_ENVOY_HISTORY,
  advanceEnvoyErrands,
  advanceEnvoySilence,
  agreeEnvoyTerms,
  applyEnvoyRumorPatch,
  beginEnvoyReturn,
  closeEnvoyErrandsForNpcDeath,
  envoyDiplomacyActive,
  envoyContinuationForHold,
  envoyErrandForOffer,
  envoyErrandIdForOffer,
  envoyOfferEpisodeKey,
  envoyErrandsOf,
  hasActiveEnvoyForOffer,
  markEnvoyIntercepted,
  markEnvoyHome,
  markEnvoyLost,
  mintEnvoyErrand,
  normalizeEnvoyAcceptance,
  normalizeEnvoyDepartureSnapshot,
  normalizeEnvoyPeaceOffer,
  previewEnvoyPosition,
  projectEnvoyForEncounter,
  releaseHeldEnvoy,
  resolveEnvoyInterception,
  restoreEnvoyErrands,
  updateEnvoyNegotiationPicture,
} from '../../src/domain/worldPulse/envoyErrand.js';
import { createNegotiationPicture } from '../../src/domain/worldPulse/negotiationPictures.js';

const LIT_RULES = Object.freeze(Object.fromEntries(
  ENVOY_REQUIRED_RULES.map((key) => [key, true]),
));

const SNAPSHOT = Object.freeze({
  storesBand: 'thin',
  strengthBand: 'ready',
  moraleExhaustionBand: 'present',
  foundingCauseStatus: 'live',
  believedRatioBand: 'matched',
});

function litWorld(extra = {}) {
  return {
    tick: 10,
    simulationRules: { ...LIT_RULES },
    relationshipStates: { untouched: { relationshipType: 'hostile' } },
    ...extra,
  };
}

function peaceOffer({
  id = 'peace.offer.1',
  tick = 10,
  from = 'ashford',
  to = 'irontown',
  frontOwnerId = from,
  frontSinceTick = 4,
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
    metadata: { privateTuningRead: 0.62 },
    relationshipKey,
    relationshipPatch: {
      proposedRelationshipType: 'neutral',
      trajectory: 'transitioning',
      privateScalar: 0.75,
    },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey,
      fromType: 'hostile',
      toType: 'neutral',
      peaceOffer: true,
      offererId: from,
      targetId: to,
      peaceFrontOwnerId: frontOwnerId,
      peaceFrontSinceTick: frontSinceTick,
      reason: 'Reader-facing engine prose is deliberately excluded.',
    },
  };
}

function acceptedRuling(outcome, patch = {}) {
  const offer = normalizeEnvoyPeaceOffer(outcome);
  const { offererId, targetId } = offer.proposalPayload;
  return {
    accepted: true,
    offererId,
    targetId,
    receipt: {
      id: `decision.${offererId}.${targetId}`,
      kind: 'war_peace_acceptance_read',
      tick: offer.generatedAtTick,
      offerId: offer.id,
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
    offererRead: {
      id: `termination.${offererId}.${targetId}`,
      kind: 'war_termination_read',
      tick: offer.generatedAtTick,
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
        tick: offer.generatedAtTick,
        attackerId: targetId,
        targetId: offererId,
        settlementIds: [targetId, offererId],
        booksDirection: 'peace',
        booksInterest: 'realm',
      },
    },
    inheritedDemand: null,
    coalitionPeaceExpenditures: [],
    discardedScratch: { probability: 0.73 },
    ...patch,
  };
}

function routePlan({
  from = 'ashford',
  to = 'irontown',
  departTick = 10,
  arrivalTick = 12,
  expectedReturnTick = 20,
  routeId = 'road.north',
  routeName = 'North Road',
} = {}) {
  return {
    legs: [{ fromId: from, toId: to, departTick, arrivalTick }],
    expectedReturnTick,
    routeRef: { id: routeId, name: routeName },
  };
}

function mintOne(worldState, options = {}) {
  const outcome = options.outcome || peaceOffer();
  const acceptance = Object.prototype.hasOwnProperty.call(options, 'acceptance')
    ? options.acceptance
    : acceptedRuling(outcome);
  const negotiationPicture = options.negotiationPicture ?? null;
  // The pairing is the contract, so the default mirrors it rather than letting a
  // caller mint a half-sighted parlay by omission. Its negative pin lives below.
  const targetCourtPicture = Object.prototype.hasOwnProperty.call(options, 'targetCourtPicture')
    ? options.targetCourtPicture
    : (negotiationPicture ? courtPictureFor(outcome) : null);
  return mintEnvoyErrand({
    worldState,
    outcome,
    acceptance,
    npcId: options.npcId || 'npc.reeve',
    npcName: options.npcName || 'Reeve Mara',
    fromName: options.fromName || 'Ashford',
    toName: options.toName || 'Irontown',
    snapshot: options.snapshot || SNAPSHOT,
    negotiationPicture,
    targetCourtPicture,
    purpose: options.purpose || 'sue',
    routePlan: options.routePlan || routePlan(),
    tick: options.tick ?? 10,
  });
}

function negotiationPictureFor(outcome = peaceOffer(), options = {}) {
  const normalized = normalizeEnvoyPeaceOffer(outcome);
  const from = normalized.proposalPayload.offererId;
  const to = normalized.proposalPayload.targetId;
  return createNegotiationPicture({
    id: options.id || `picture.${from}.${to}`,
    carrier: { kind: 'envoy', id: envoyErrandIdForOffer(outcome) },
    partyId: from,
    counterpartId: to,
    relationshipKey: normalized.relationshipKey,
    episodeKey: envoyOfferEpisodeKey(outcome),
    frontOwnerId: normalized.proposalPayload.peaceFrontOwnerId,
    frontSinceTick: normalized.proposalPayload.peaceFrontSinceTick,
    capturedTick: options.tick ?? normalized.generatedAtTick,
    causeStatus: 'live',
    subjects: [
      { settlementId: from, strengthBand: 'ready', storesBand: 'thin' },
      { settlementId: to, strengthBand: 'strong', storesBand: 'stocked' },
    ],
    evidenceIds: [],
  });
}

/**
 * The receiving court's own frozen picture. The two-picture contract pairs it
 * with the envoy's: neither party ever evaluates on a merged estimate (K4).
 */
function courtPictureFor(outcome = peaceOffer(), options = {}) {
  const normalized = normalizeEnvoyPeaceOffer(outcome);
  const from = normalized.proposalPayload.offererId;
  const to = normalized.proposalPayload.targetId;
  return createNegotiationPicture({
    id: options.id || `court-picture.${to}`,
    carrier: { kind: 'court', id: options.carrierId || to },
    partyId: to,
    counterpartId: from,
    relationshipKey: normalized.relationshipKey,
    episodeKey: envoyOfferEpisodeKey(outcome),
    frontOwnerId: normalized.proposalPayload.peaceFrontOwnerId,
    frontSinceTick: normalized.proposalPayload.peaceFrontSinceTick,
    capturedTick: options.tick ?? normalized.generatedAtTick,
    causeStatus: 'live',
    subjects: [
      { settlementId: to, strengthBand: 'strong', storesBand: 'stocked' },
      { settlementId: from, strengthBand: 'ready', storesBand: 'thin' },
    ],
    evidenceIds: [],
  });
}

/**
 * An interceptor column's own picture, carried by the army rather than a court.
 * Sourced from that column's belief exposure only — never from truth (K3).
 */
function armyPictureFor({
  outcome = peaceOffer(),
  armyId,
  interceptorId,
  counterpartId,
  tick,
  id,
} = {}) {
  const normalized = normalizeEnvoyPeaceOffer(outcome);
  const payload = normalized.proposalPayload;
  return createNegotiationPicture({
    id: id || `army-picture.${armyId}`,
    carrier: { kind: 'army', id: armyId },
    partyId: interceptorId,
    counterpartId,
    relationshipKey: normalized.relationshipKey,
    episodeKey: envoyOfferEpisodeKey(outcome),
    frontOwnerId: payload.peaceFrontOwnerId,
    frontSinceTick: payload.peaceFrontSinceTick,
    capturedTick: tick,
    causeStatus: 'live',
    subjects: [
      { settlementId: interceptorId, strengthBand: 'strong', storesBand: 'stocked' },
      { settlementId: counterpartId, strengthBand: 'ready', storesBand: 'thin' },
    ],
    evidenceIds: [],
  });
}

function whitePeaceSheet(errand, agreedTick) {
  return {
    schemaVersion: 1,
    id: `sheet.${errand.id}`,
    errandId: errand.id,
    encounterId: errand.parlayId,
    episodeKey: envoyOfferEpisodeKey(errand.offer),
    relationshipKey: errand.offer.relationshipKey,
    parties: [errand.from, errand.to].sort(),
    proposerId: errand.from,
    responderId: errand.to,
    victorId: errand.from,
    loserId: errand.to,
    agreedTick,
    pictureIds: {
      proposer: errand.negotiationPicture.id,
      responder: `court-picture.${errand.to}`,
    },
    clauses: [],
    budgetSpent: 0,
    valuations: [
      {
        partyId: errand.from,
        pictureId: errand.negotiationPicture.id,
        role: 'proposer',
        decision: 'accept',
      },
      {
        partyId: errand.to,
        pictureId: `court-picture.${errand.to}`,
        role: 'responder',
        decision: 'accept',
      },
    ],
  };
}

describe('WR-7a envoy errand activation and minting', () => {
  it('is byte-identical unless all six prerequisite laws are exact true', () => {
    const dark = litWorld({ simulationRules: {} });
    const darkResult = mintOne(dark);
    expect(darkResult).toMatchObject({ changed: false, reason: 'dark', errand: null });
    expect(darkResult.worldState).toBe(dark);
    expect(dark).not.toHaveProperty('envoyErrands');

    expect(envoyDiplomacyActive({ simulationRules: LIT_RULES })).toBe(true);
    for (const missingRule of ENVOY_REQUIRED_RULES) {
      const partialRules = { ...LIT_RULES, [missingRule]: false };
      const partial = litWorld({ simulationRules: partialRules });
      expect(envoyDiplomacyActive(partial)).toBe(false);
      expect(mintOne(partial).worldState).toBe(partial);
      expect(partial).not.toHaveProperty('envoyErrands');
    }
  });

  it('requires a durable NPC id and freezes only the closed qualitative picture', () => {
    const world = litWorld();
    expect(mintEnvoyErrand({
      worldState: world,
      outcome: peaceOffer(),
      npcId: '',
      snapshot: SNAPSHOT,
      routePlan: routePlan(),
      tick: 10,
    }).worldState).toBe(world);

    expect(normalizeEnvoyDepartureSnapshot({ ...SNAPSHOT, storesBand: 0.42 })).toBeNull();
    expect(normalizeEnvoyDepartureSnapshot({ ...SNAPSHOT, believedRatioBand: '3.2x' })).toBeNull();

    const mutablePicture = { ...SNAPSHOT };
    const mutablePlan = routePlan();
    const minted = mintOne(world, { snapshot: mutablePicture, routePlan: mutablePlan });
    expect(minted).toMatchObject({ changed: true, reason: 'minted' });
    expect(minted.evidence[0]).toMatchObject({
      kind: 'envoy_departed',
      npcId: 'npc.reeve',
      npcName: 'Reeve Mara',
      settlementName: 'Ashford',
      counterpartName: 'Irontown',
      routeId: 'road.north',
      routeName: 'North Road',
    });
    mutablePicture.storesBand = 'bare';
    mutablePlan.legs[0].toId = 'tampered';
    expect(minted.errand.snapshot.storesBand).toBe('thin');
    expect(minted.errand.legs[0].toId).toBe('irontown');
    expect(world.relationshipStates.untouched.relationshipType).toBe('hostile');
  });

  it('keys idempotence to the exact front episode and caps active errands per origin', () => {
    let world = litWorld();
    const firstOffer = peaceOffer();
    const first = mintOne(world, { outcome: firstOffer });
    world = first.worldState;
    expect(hasActiveEnvoyForOffer(world, firstOffer)).toBe(true);

    const sameEpisode = peaceOffer({ id: 'peace.offer.reissued', tick: 11 });
    const duplicate = mintOne(world, {
      outcome: sameEpisode,
      routePlan: routePlan({ departTick: 11, arrivalTick: 13 }),
      tick: 11,
    });
    expect(duplicate.worldState).toBe(world);
    expect(duplicate.reason).toBe('duplicate_episode');
    expect(duplicate.errand.id).toBe(first.errand.id);

    const secondOffer = peaceOffer({ id: 'peace.offer.2', to: 'stonegate', frontSinceTick: 5 });
    const duplicatedPerson = mintOne(world, {
      outcome: secondOffer,
      npcId: 'npc.reeve',
      toName: 'Stonegate',
      routePlan: routePlan({ to: 'stonegate' }),
    });
    expect(duplicatedPerson.worldState).toBe(world);
    expect(duplicatedPerson.reason).toBe('npc_in_transit');

    const second = mintOne(world, {
      outcome: secondOffer,
      npcId: 'npc.marshal',
      toName: 'Stonegate',
      routePlan: routePlan({ to: 'stonegate' }),
    });
    world = second.worldState;

    const thirdOffer = peaceOffer({ id: 'peace.offer.3', to: 'reedmere', frontSinceTick: 6 });
    const capped = mintOne(world, {
      outcome: thirdOffer,
      npcId: 'npc.clerk',
      toName: 'Reedmere',
      routePlan: routePlan({ to: 'reedmere' }),
    });
    expect(MAX_CONCURRENT_ENVOYS).toBe(2);
    expect(capped).toMatchObject({ changed: false, reason: 'origin_capacity', errand: null });
    expect(capped.worldState).toBe(world);
    expect(envoyErrandsOf(world)).toHaveLength(2);
  });

  it('allows a new exact offer attempt after loss without erasing the terminal episode', () => {
    const firstOffer = peaceOffer();
    const first = mintOne(litWorld(), { outcome: firstOffer });
    const lost = markEnvoyLost({
      worldState: first.worldState,
      errandId: first.errand.id,
      tick: 11,
    });
    const retryOffer = peaceOffer({ id: 'peace.offer.retry', tick: 12 });
    const retry = mintOne(lost.worldState, {
      outcome: retryOffer,
      npcId: 'npc.retry',
      routePlan: routePlan({ departTick: 12, arrivalTick: 14, expectedReturnTick: 22 }),
      tick: 12,
    });
    expect(retry.reason).toBe('minted');
    expect(retry.errand.id).not.toBe(first.errand.id);
    expect(envoyErrandIdForOffer(retryOffer)).toBe(envoyErrandIdForOffer(firstOffer));
    expect(envoyErrandForOffer(retry.worldState, firstOffer)).toMatchObject({ state: 'lost' });
    expect(envoyErrandForOffer(retry.worldState, retryOffer)).toMatchObject({ state: 'travelling' });
    expect(hasActiveEnvoyForOffer(retry.worldState, firstOffer)).toBe(true);
    expect(envoyErrandsOf(retry.worldState)).toHaveLength(2);
  });
});

describe('WR-7a envoy errand lifecycle', () => {
  it('walks outbound, parlays, and requires a separately priced physical return home', () => {
    const outcome = peaceOffer();
    const outbound = {
      legs: [
        { fromId: 'ashford', toId: 'ford', departTick: 10, arrivalTick: 12 },
        { fromId: 'ford', toId: 'irontown', departTick: 13, arrivalTick: 15 },
      ],
      expectedReturnTick: 20,
      routeRef: { id: 'road.north', name: 'North Road' },
    };
    let result = mintOne(litWorld(), { outcome, routePlan: outbound });
    const errandId = result.errand.id;

    result = advanceEnvoyErrands({ worldState: result.worldState, tick: 11 });
    expect(result.changed).toBe(true);
    expect(result.transitionEvidence[0].kind).toBe('envoy_on_the_road');
    expect(envoyErrandForOffer(result.worldState, outcome)).toMatchObject({
      state: 'travelling',
      positionRef: { journey: 'outbound', legIndex: 0, progressBand: 'underway' },
    });

    result = advanceEnvoyErrands({ worldState: result.worldState, tick: 12 });
    expect(envoyErrandForOffer(result.worldState, outcome)).toMatchObject({
      state: 'travelling',
      positionRef: { journey: 'outbound', legIndex: 0, progressBand: 'arrived' },
    });
    result = advanceEnvoyErrands({ worldState: result.worldState, tick: 13 });
    expect(envoyErrandForOffer(result.worldState, outcome)).toMatchObject({
      state: 'travelling',
      positionRef: { journey: 'outbound', legIndex: 1, progressBand: 'departed' },
    });

    result = advanceEnvoyErrands({ worldState: result.worldState, tick: 15 });
    expect(envoyErrandForOffer(result.worldState, outcome)).toMatchObject({
      state: 'parlaying',
      positionRef: { journey: 'outbound', legIndex: 1, progressBand: 'arrived' },
    });
    const prematureHome = markEnvoyHome({
      worldState: result.worldState,
      errandId,
      tick: 15,
    });
    expect(prematureHome).toMatchObject({ changed: false, reason: 'invalid_state' });
    expect(prematureHome.worldState).toBe(result.worldState);

    const rawTerms = {
      id: 'terms.1',
      clauses: [{ kind: 'ceasefire', parties: ['ashford', 'irontown'] }],
      secretFunction: () => 'not serializable',
    };
    const sameTickReturn = beginEnvoyReturn({
      worldState: result.worldState,
      errandId,
      routePlan: routePlan({
        from: 'irontown', to: 'ashford', departTick: 15, arrivalTick: 18,
        expectedReturnTick: 18,
      }),
      tick: 15,
    });
    expect(sameTickReturn).toMatchObject({ changed: false, reason: 'invalid_state' });
    expect(sameTickReturn.worldState).toBe(result.worldState);
    result = beginEnvoyReturn({
      worldState: result.worldState,
      errandId,
      routePlan: routePlan({
        from: 'irontown',
        to: 'ashford',
        departTick: 16,
        arrivalTick: 19,
        expectedReturnTick: 19,
      }),
      termSheet: rawTerms,
      tick: 16,
    });
    expect(result).toMatchObject({ changed: true, reason: 'returning' });
    expect(result.errand).toMatchObject({
      state: 'returning',
      positionRef: { journey: 'return', progressBand: 'departed' },
      expectedReturnTick: 20,
      scheduledHomeTick: 19,
    });
    rawTerms.clauses[0].kind = 'tampered';
    expect(result.errand.termSheet.clauses[0].kind).toBe('ceasefire');
    expect(result.errand.termSheet).not.toHaveProperty('secretFunction');

    result = advanceEnvoyErrands({ worldState: result.worldState, tick: 19 });
    expect(result.transitionEvidence).toHaveLength(1);
    expect(result.transitionEvidence[0].kind).toBe('envoy_on_the_road');
    expect(result.homeDeliveries).toHaveLength(1);
    expect(result.homeDeliveries[0]).toMatchObject({
      errandId,
      npcId: 'npc.reeve',
      from: 'ashford',
      to: 'irontown',
      offer: {
        id: 'peace.offer.1',
        outcomeId: 'peace.offer.1',
        candidateType: 'strategy_sue_for_peace',
      },
      acceptance: {
        accepted: true,
        offererId: 'ashford',
        targetId: 'irontown',
        coalitionPeaceExpenditures: [],
      },
      termSheet: { id: 'terms.1' },
    });
    expect(result.homeDeliveries[0].offer.severity).toBe(0.91);
    expect(result.homeDeliveries[0].offer).not.toHaveProperty('reasons');
    expect(result.homeDeliveries[0].offer).not.toHaveProperty('metadata');
    expect(result.homeDeliveries[0].offer.proposalPayload.reason)
      .toBe('Reader-facing engine prose is deliberately excluded.');
    expect(envoyErrandForOffer(result.worldState, outcome).state).toBe('returning');
    const home = markEnvoyHome({ worldState: result.worldState, errandId, tick: 19 });
    expect(home.reason).toBe('home');
    expect(envoyErrandForOffer(home.worldState, outcome).state).toBe('home');
    expect(hasActiveEnvoyForOffer(home.worldState, outcome)).toBe(false);
  });

  it('infers from overdue silence once without declaring a living traveller lost', () => {
    const minted = mintOne(litWorld());
    const first = advanceEnvoySilence({ worldState: minted.worldState, tick: 21 });
    expect(first.changed).toBe(true);
    expect(first.inferredErrandIds).toEqual([minted.errand.id]);
    expect(first.evidence).toHaveLength(1);
    expect(first.evidence[0]).toMatchObject({
      kind: 'envoy_silence_inference',
      inferenceBasis: 'silence',
      state: 'travelling',
    });
    expect(envoyErrandForOffer(first.worldState, minted.errand.offer)).toMatchObject({
      state: 'travelling',
      silenceInferredAtTick: 21,
    });

    const second = advanceEnvoySilence({ worldState: first.worldState, tick: 22 });
    expect(second.worldState).toBe(first.worldState);
    expect(second).toMatchObject({ changed: false, evidence: [], inferredErrandIds: [] });
  });

  it('closes death/loss by durable NPC id and records stranded terms', () => {
    const minted = mintOne(litWorld());
    const parlay = advanceEnvoyErrands({ worldState: minted.worldState, tick: 12 });
    const returning = beginEnvoyReturn({
      worldState: parlay.worldState,
      errandId: minted.errand.id,
      routePlan: routePlan({
        from: 'irontown', to: 'ashford', departTick: 13, arrivalTick: 16,
        expectedReturnTick: 16,
      }),
      termSheet: { id: 'terms.stranded', clauses: [{ kind: 'ceasefire' }] },
      tick: 13,
    });
    const killed = closeEnvoyErrandsForNpcDeath({
      worldState: returning.worldState,
      npcId: 'npc.reeve',
      tick: 14,
    });
    expect(killed.changed).toBe(true);
    expect(killed.priorErrands).toHaveLength(1);
    expect(killed.priorErrands[0].state).toBe('returning');
    expect(killed.evidence.map((row) => row.kind)).toEqual([
      'envoy_lost',
      'terms_never_reached',
    ]);
    expect(killed.evidence[1].termSheetId).toBe('terms.stranded');
    expect(envoyErrandForOffer(killed.worldState, minted.errand.offer)).toMatchObject({
      state: 'lost',
      lossCause: 'killed',
      positionRef: { journey: 'return' },
    });

    const again = markEnvoyLost({
      worldState: killed.worldState,
      errandId: minted.errand.id,
      tick: 15,
    });
    expect(again.worldState).toBe(killed.worldState);
    expect(again).toMatchObject({ changed: false, reason: 'invalid_state', evidence: [] });

    const staleUndo = restoreEnvoyErrands({
      worldState: killed.worldState,
      priorErrands: killed.priorErrands,
      killedAtTick: 15,
    });
    expect(staleUndo.worldState).toBe(killed.worldState);
    expect(staleUndo.reason).toBe('restore_conflict');

    const restored = restoreEnvoyErrands({
      worldState: killed.worldState,
      priorErrands: killed.priorErrands,
      killedAtTick: 14,
    });
    expect(restored).toMatchObject({ changed: true, reason: 'restored', evidence: [] });
    expect(envoyErrandForOffer(restored.worldState, minted.errand.offer)).toMatchObject({
      state: 'returning',
      termSheet: { id: 'terms.stranded' },
    });
  });

  it('lets honest silence, not remote loss truth, reach home after a terminal loss', () => {
    const minted = mintOne(litWorld());
    const lost = markEnvoyLost({
      worldState: minted.worldState,
      errandId: minted.errand.id,
      tick: 11,
      cause: 'route_lost',
    });
    const inferred = advanceEnvoySilence({ worldState: lost.worldState, tick: 21 });
    expect(inferred.changed).toBe(true);
    expect(inferred.evidence).toContainEqual(expect.objectContaining({
      kind: 'envoy_silence_inference',
      state: 'lost',
      inferenceBasis: 'silence',
    }));
    expect(envoyErrandForOffer(inferred.worldState, minted.errand.offer)).toMatchObject({
      state: 'lost',
      silenceInferredAtTick: 21,
    });
  });
});

describe('WR-7a envoy information and bounded persistence', () => {
  it('applies each injected rumor at most once and at most one adjacent band', () => {
    const minted = mintOne(litWorld());
    const patch = {
      sourceEventId: 'rumor.1',
      field: 'strengthBand',
      direction: 'rise',
      targetBand: 'dominant',
      leakedScalar: 0.99,
    };
    const heard = applyEnvoyRumorPatch({
      worldState: minted.worldState,
      errandId: minted.errand.id,
      patch,
    });
    expect(heard).toMatchObject({ changed: true, reason: 'picture_stepped' });
    expect(heard.errand.snapshot.strengthBand).toBe('strong');
    expect(heard.errand.snapshot).not.toHaveProperty('targetBand');
    expect(heard.errand.snapshot).not.toHaveProperty('leakedScalar');

    const duplicate = applyEnvoyRumorPatch({
      worldState: heard.worldState,
      errandId: minted.errand.id,
      patch,
    });
    expect(duplicate.worldState).toBe(heard.worldState);
    expect(duplicate.reason).toBe('rumor_already_heard');

    const malformed = applyEnvoyRumorPatch({
      worldState: heard.worldState,
      errandId: minted.errand.id,
      patch: { sourceEventId: 'rumor.2', field: 'strengthBand', direction: 0.6 },
    });
    expect(malformed.worldState).toBe(heard.worldState);
    expect(malformed.reason).toBe('invalid_picture');
  });

  it('bounds only terminal history while retaining active errands', () => {
    let world = litWorld();
    let firstOffer = null;
    let lastOffer = null;
    for (let index = 0; index < MAX_TERMINAL_ENVOY_HISTORY + 2; index += 1) {
      const outcome = peaceOffer({
        id: `peace.archive.${index}`,
        tick: 20 + index,
        frontSinceTick: 10 + index,
      });
      firstOffer ||= outcome;
      lastOffer = outcome;
      const minted = mintOne(world, {
        outcome,
        npcId: `npc.archive.${index}`,
        routePlan: routePlan({
          departTick: 20 + index,
          arrivalTick: 21 + index,
          expectedReturnTick: 24 + index,
        }),
        tick: 20 + index,
      });
      expect(minted.reason).toBe('minted');
      const lost = markEnvoyLost({
        worldState: minted.worldState,
        errandId: minted.errand.id,
        tick: 21 + index,
      });
      expect(lost.reason).toBe('lost');
      world = lost.worldState;
    }

    expect(envoyErrandsOf(world)).toHaveLength(MAX_TERMINAL_ENVOY_HISTORY);
    expect(envoyErrandForOffer(world, firstOffer)).toBeNull();
    expect(envoyErrandForOffer(world, lastOffer)).not.toBeNull();

    for (let index = 0; index < MAX_CONCURRENT_ENVOYS; index += 1) {
      const outcome = peaceOffer({
        id: `peace.active.${index}`,
        tick: 100 + index,
        to: `active-target-${index}`,
        frontSinceTick: 90 + index,
      });
      const minted = mintOne(world, {
        outcome,
        npcId: `npc.active.${index}`,
        routePlan: routePlan({
          to: `active-target-${index}`,
          departTick: 100 + index,
          arrivalTick: 104 + index,
          expectedReturnTick: 110 + index,
        }),
        tick: 100 + index,
      });
      expect(minted.reason).toBe('minted');
      world = minted.worldState;
    }
    const rows = envoyErrandsOf(world);
    expect(rows.filter((row) => row.state === 'lost')).toHaveLength(MAX_TERMINAL_ENVOY_HISTORY);
    expect(rows.filter((row) => row.state === 'travelling')).toHaveLength(MAX_CONCURRENT_ENVOYS);
    expect(rows).toHaveLength(MAX_TERMINAL_ENVOY_HISTORY + MAX_CONCURRENT_ENVOYS);

    const beforeKill = envoyErrandsOf(world);
    const killed = closeEnvoyErrandsForNpcDeath({
      worldState: world,
      npcId: 'npc.active.0',
      tick: 120,
    });
    expect(killed.priorErrands).toHaveLength(1);
    expect(killed.evictedErrands).toHaveLength(1);
    const restored = restoreEnvoyErrands({
      worldState: killed.worldState,
      priorErrands: killed.priorErrands,
      evictedErrands: killed.evictedErrands,
      killedAtTick: 120,
    });
    expect(restored.reason).toBe('restored');
    expect(envoyErrandsOf(restored.worldState)).toEqual(beforeKill);
  });

  it('keeps the replay offer to a deterministic mechanical allowlist', () => {
    const original = peaceOffer();
    const normalized = normalizeEnvoyPeaceOffer(original);
    expect(normalized).toEqual({
      id: 'peace.offer.1',
      outcomeId: 'peace.offer.1',
      generatedAtTick: 10,
      severity: 0.91,
      type: 'relationship',
      candidateType: 'strategy_sue_for_peace',
      ruleFamily: 'strategy',
      targetSaveId: 'ashford',
      relationshipKey: 'ashford::irontown',
      relationshipPatch: {
        proposedRelationshipType: 'neutral',
        trajectory: 'transitioning',
      },
      proposalPayload: {
        kind: 'relationship_label_change',
        relationshipKey: 'ashford::irontown',
        fromType: 'hostile',
        toType: 'neutral',
        peaceOffer: true,
        offererId: 'ashford',
        targetId: 'irontown',
        peaceFrontOwnerId: 'ashford',
        peaceFrontSinceTick: 4,
        reason: 'Reader-facing engine prose is deliberately excluded.',
      },
    });
    expect(envoyErrandIdForOffer({ ...original, id: 'another-id' }))
      .toBe(envoyErrandIdForOffer(original));
  });

  it('round-trips only the accepted ruling capsule and rejects crossed or malformed rulings', () => {
    const outcome = peaceOffer();
    outcome.proposalPayload.coalitionSettlementClosure = {
      closureId: 'coalition.close.1',
      componentClosureIds: ['edge.a', 'edge.b'],
    };
    const acceptance = acceptedRuling(outcome, {
      inheritedDemand: {
        decisionId: 'seat.charge.1',
        desiredAction: 'peace',
        actorId: 'irontown',
        targetId: 'ashford',
      },
      offererInheritedDemand: {
        decisionId: 'seat.charge.offerer',
        desiredAction: 'peace',
        actorId: 'ashford',
        targetId: 'irontown',
      },
      coalitionPeaceExpenditures: [{
        partyId: 'ashford',
        callerId: 'ashford',
        targetId: 'irontown',
        joinedTick: 4,
        pressure01: 0.6,
      }],
    });
    const normalized = normalizeEnvoyAcceptance(acceptance, outcome);
    expect(normalized).toMatchObject({
      accepted: true,
      offererId: 'ashford',
      targetId: 'irontown',
      inheritedDemand: { decisionId: 'seat.charge.1', desiredAction: 'peace' },
      offererInheritedDemand: {
        decisionId: 'seat.charge.offerer',
        desiredAction: 'peace',
      },
      coalitionPeaceExpenditures: [{ partyId: 'ashford', pressure01: 0.6 }],
      termination: {
        receipt: { attackerId: 'irontown', targetId: 'ashford' },
      },
    });
    expect(normalized).not.toHaveProperty('discardedScratch');

    const minted = mintOne(litWorld(), { outcome, acceptance });
    expect(minted.reason).toBe('minted');
    acceptance.receipt.decision = 'tampered';
    acceptance.coalitionPeaceExpenditures[0].pressure01 = 1;
    expect(minted.errand.acceptance.receipt.decision).toBe('accept');
    expect(minted.errand.acceptance.coalitionPeaceExpenditures[0].pressure01).toBe(0.6);
    expect(minted.errand.acceptance.offererInheritedDemand).toMatchObject({
      actorId: 'ashford',
      targetId: 'irontown',
      desiredAction: 'peace',
    });
    expect(minted.errand.offer.proposalPayload.coalitionSettlementClosure).toEqual({
      closureId: 'coalition.close.1',
      componentClosureIds: ['edge.a', 'edge.b'],
    });
    expect(envoyErrandsOf(JSON.parse(JSON.stringify(minted.worldState))))
      .toEqual(envoyErrandsOf(minted.worldState));

    for (const malformedAcceptance of [
      { ...acceptedRuling(outcome), accepted: false },
      { ...acceptedRuling(outcome), targetId: 'wrong-court' },
      { ...acceptedRuling(outcome), receipt: [] },
      { ...acceptedRuling(outcome), receipt: { ...acceptedRuling(outcome).receipt, kind: '' } },
      { ...acceptedRuling(outcome), receipt: { ...acceptedRuling(outcome).receipt, bands: {} } },
      { ...acceptedRuling(outcome), offererRead: { ...acceptedRuling(outcome).offererRead, settlementIds: [] } },
      {
        ...acceptedRuling(outcome),
        termination: {
          receipt: { ...acceptedRuling(outcome).termination.receipt, kind: '' },
        },
      },
      { ...acceptedRuling(outcome), coalitionPeaceExpenditures: {} },
      {
        ...acceptedRuling(outcome),
        offererInheritedDemand: {
          decisionId: 'crossed', desiredAction: 'peace', actorId: 'irontown', targetId: 'ashford',
        },
      },
    ]) {
      const world = litWorld();
      const rejected = mintOne(world, { outcome, acceptance: malformedAcceptance });
      expect(rejected.worldState).toBe(world);
      expect(rejected).toMatchObject({
        changed: false,
        errand: null,
        reason: 'invalid_acceptance',
      });
    }
  });
});

describe('WR-7b envoy interception substrate', () => {
  it('records proactive self-parlay as an ordinary envoy genesis, not a collision', () => {
    const outcome = peaceOffer();
    const minted = mintOne(litWorld(), {
      outcome,
      purpose: 'self_parlay',
      negotiationPicture: negotiationPictureFor(outcome),
    });
    expect(minted).toMatchObject({ changed: true, reason: 'minted' });
    expect(minted.errand).toMatchObject({ purpose: 'self_parlay', state: 'travelling' });
    // anchored: the errand's purpose and state are asserted immediately above, so
    // it is demonstrably a real minted row — this absence proves a proactive
    // self-parlay carries no collision history, not that minting returned nothing.
    expect(minted.errand).not.toHaveProperty('encounters'); // anchored: errand proven populated above
    expect(minted.evidence.map((row) => row.kind)).toEqual([
      'envoy_departed',
      'interceptor_parlays_own_edge',
    ]);
  });

  it('projects one shared temporal cut and records exactly one T interception', () => {
    const outcome = peaceOffer();
    const picture = negotiationPictureFor(outcome);
    const minted = mintOne(litWorld(), {
      outcome,
      routePlan: {
        legs: [
          { fromId: 'ashford', toId: 'ford', departTick: 10, arrivalTick: 12 },
          { fromId: 'ford', toId: 'irontown', departTick: 13, arrivalTick: 15 },
        ],
        expectedReturnTick: 20,
        routeRef: { id: 'road.north' },
      },
      negotiationPicture: picture,
    });
    expect(minted.reason).toBe('minted');
    expect(previewEnvoyPosition(minted.errand, 11)).toMatchObject({
      nodeId: 'ashford',
      journey: 'outbound',
      projectionPhase: 'pre_mutation',
      complete: false,
    });
    expect(previewEnvoyPosition(minted.errand, 12)).toMatchObject({
      nodeId: 'ford',
      positionRef: { progressBand: 'arrived' },
    });
    expect(previewEnvoyPosition(minted.errand, 13)).toMatchObject({
      nodeId: 'ford',
      positionRef: { legIndex: 1, progressBand: 'departed' },
    });
    expect(projectEnvoyForEncounter(minted.errand, 11)).toMatchObject({
      errandId: minted.errand.id,
      relationshipKey: 'ashford::irontown',
      nodeId: 'ashford',
      projectedTick: 11,
    });

    const candidate = {
      id: 'encounter.1',
      kind: 'private_goal',
      privateGoal: 'imprison',
      tick: 11,
      errandId: minted.errand.id,
      npcId: 'npc.reeve',
      actorId: 'red-court',
      armyId: 'army.red.1',
      nodeId: 'ashford',
      relationshipKey: 'ashford::irontown',
      episodeKey: envoyOfferEpisodeKey(outcome),
      routeId: 'road.north',
      venueRef: { id: 'ashford', kind: 'field_node' },
    };
    const interceptorPicture = armyPictureFor({
      outcome,
      armyId: 'army.red.1',
      interceptorId: 'red-court',
      counterpartId: 'ashford',
      tick: 11,
    });
    const intercepted = markEnvoyIntercepted({
      worldState: minted.worldState,
      errandId: minted.errand.id,
      encounter: candidate,
      interceptorPicture,
      expectedErrand: minted.errand,
      tick: 11,
    });
    expect(intercepted).toMatchObject({ changed: true, reason: 'intercepted' });
    expect(intercepted.errand).toMatchObject({
      state: 'intercepted',
      positionRef: { journey: 'outbound', progressBand: 'underway' },
      encounters: [{
        schemaVersion: 1,
        id: 'encounter.1',
        resolution: 'pending',
        interceptorId: 'red-court',
        armyId: 'army.red.1',
        venueId: 'ashford',
      }],
    });
    expect(intercepted.evidence[0]).toMatchObject({
      kind: 'envoy_intercepted',
      thirdPartyId: 'red-court',
      encounterId: 'encounter.1',
    });
    // Re-offering the exact collision is refused because an already-intercepted
    // errand is no longer travelling — not merely for want of a picture. The
    // reason is asserted so the idempotence pin cannot pass vacuously.
    const replayed = markEnvoyIntercepted({
      worldState: intercepted.worldState,
      errandId: minted.errand.id,
      encounter: candidate,
      interceptorPicture,
      expectedErrand: intercepted.errand,
      tick: 11,
    });
    expect(replayed.reason).toBe('stale_errand');
    expect(replayed.worldState).toBe(intercepted.worldState);
    expect(resolveEnvoyInterception({
      worldState: intercepted.worldState,
      errandId: minted.errand.id,
      encounterId: 'encounter.1',
      resolution: 'held',
      tick: 11,
    })).toMatchObject({ changed: false, reason: 'stale_encounter' });
  });

  it('keeps held envoys active, resumes from the exact venue, and preserves the original deadline', () => {
    const minted = mintOne(litWorld(), {
      routePlan: routePlan({ arrivalTick: 15, expectedReturnTick: 20 }),
    });
    const intercepted = markEnvoyIntercepted({
      worldState: minted.worldState,
      errandId: minted.errand.id,
      encounter: {
        id: 'encounter.hold',
        kind: 'private_goal',
        privateGoal: 'imprison',
        tick: 11,
        actorId: 'red-court',
        armyId: 'army.red.1',
        nodeId: 'ashford',
        routeId: 'road.north',
        venueRef: { id: 'ashford', kind: 'field_node' },
      },
      interceptorPicture: armyPictureFor({
        armyId: 'army.red.1',
        interceptorId: 'red-court',
        counterpartId: 'ashford',
        tick: 11,
      }),
      tick: 11,
    });
    const held = resolveEnvoyInterception({
      worldState: intercepted.worldState,
      errandId: minted.errand.id,
      encounterId: 'encounter.hold',
      resolution: 'held',
      tick: 12,
    });
    expect(held).toMatchObject({ changed: true, reason: 'held' });
    expect(held.errand).toMatchObject({ state: 'held', heldTick: 12 });
    expect(envoyContinuationForHold(held.errand, 'encounter.hold')).toMatchObject({
      schemaVersion: 1,
      resumeState: 'travelling',
      journey: 'outbound',
      destinationId: 'irontown',
      interruptedTick: 11,
      expectedReturnTick: 20,
      journeyLegs: [{ routeRef: { id: 'road.north' } }],
    });
    expect(hasActiveEnvoyForOffer(held.worldState, minted.errand.offer)).toBe(true);
    expect(mintOne(held.worldState, {
      outcome: peaceOffer({ id: 'other.offer', to: 'another-court', frontSinceTick: 5 }),
      npcId: 'npc.reeve',
      routePlan: routePlan({ to: 'another-court' }),
    }).reason).toBe('npc_in_transit');

    const released = releaseHeldEnvoy({
      worldState: held.worldState,
      errandId: minted.errand.id,
      encounterId: 'encounter.hold',
      routePlan: routePlan({
        from: 'ashford', to: 'irontown', departTick: 13, arrivalTick: 16,
        expectedReturnTick: 18,
      }),
      tick: 13,
    });
    expect(released).toMatchObject({ changed: true, reason: 'resumed' });
    expect(released.errand).toMatchObject({
      state: 'travelling',
      expectedReturnTick: 20,
      positionRef: { fromId: 'ashford', toId: 'irontown', progressBand: 'departed' },
      encounters: [{
        resolution: 'resumed',
        continuation: {
          destinationId: 'irontown',
          resumedTick: 13,
          scheduledArrivalTick: 18,
        },
      }],
    });

    const imported = JSON.parse(JSON.stringify(held.worldState));
    imported.envoyErrands[0].encounters[0].smuggled = 'not allowed';
    expect(envoyErrandsOf(imported)).toEqual([]);

    const killed = closeEnvoyErrandsForNpcDeath({
      worldState: held.worldState,
      npcId: 'npc.reeve',
      tick: 14,
    });
    expect(killed.priorErrands[0].state).toBe('held');
    const restored = restoreEnvoyErrands({
      worldState: killed.worldState,
      priorErrands: killed.priorErrands,
      killedAtTick: 14,
    });
    expect(restored).toMatchObject({ changed: true, reason: 'restored' });
    expect(envoyErrandsOf(restored.worldState)[0].state).toBe('held');
  });

  it('can turn an en-route field parlay around from its exact occupied node', () => {
    const minted = mintOne(litWorld(), {
      routePlan: {
        legs: [
          { fromId: 'ashford', toId: 'ford', departTick: 10, arrivalTick: 12 },
          { fromId: 'ford', toId: 'irontown', departTick: 13, arrivalTick: 15 },
        ],
        expectedReturnTick: 20,
        routeRef: { id: 'road.north' },
      },
    });
    const intercepted = markEnvoyIntercepted({
      worldState: minted.worldState,
      errandId: minted.errand.id,
      encounter: {
        id: 'encounter.field',
        kind: 'field_parlay',
        tick: 12,
        actorId: 'irontown',
        armyId: 'army.iron',
        nodeId: 'ford',
        routeId: 'road.north',
        venueRef: { id: 'ford', kind: 'field_node' },
      },
      // A field parlay is the one kind whose two pictures must span the exact
      // warring pair, so the target's own column carries this one.
      interceptorPicture: armyPictureFor({
        armyId: 'army.iron',
        interceptorId: 'irontown',
        counterpartId: 'ashford',
        tick: 12,
      }),
      tick: 12,
    });
    const parlay = resolveEnvoyInterception({
      worldState: intercepted.worldState,
      errandId: minted.errand.id,
      encounterId: 'encounter.field',
      resolution: 'parlaying',
      tick: 13,
    });
    expect(parlay.errand).toMatchObject({
      state: 'parlaying',
      parlayId: 'encounter.field',
      positionRef: { toId: 'ford', progressBand: 'arrived' },
    });
    const returning = beginEnvoyReturn({
      worldState: parlay.worldState,
      errandId: minted.errand.id,
      routePlan: routePlan({
        from: 'ford', to: 'ashford', departTick: 14, arrivalTick: 17,
        expectedReturnTick: 17,
      }),
      tick: 14,
    });
    expect(returning).toMatchObject({ changed: true, reason: 'returning' });
    expect(returning.errand).toMatchObject({
      returnOriginId: 'ford',
      state: 'returning',
      positionRef: { fromId: 'ford', toId: 'ashford' },
    });
  });

  it('mutates a complete picture once and carries only an exact agreed versioned sheet', () => {
    const outcome = peaceOffer();
    const picture = negotiationPictureFor(outcome);
    let result = mintEnvoyErrand({
      worldState: litWorld(),
      outcome,
      acceptance: acceptedRuling(outcome),
      npcId: 'npc.reeve',
      snapshot: SNAPSHOT,
      negotiationPicture: picture,
      targetCourtPicture: courtPictureFor(outcome),
      routePlan: routePlan(),
      tick: 10,
    });
    result = updateEnvoyNegotiationPicture({
      worldState: result.worldState,
      errandId: result.errand.id,
      patch: {
        id: 'picture-mutation.1',
        pictureId: picture.id,
        episodeKey: envoyOfferEpisodeKey(outcome),
        sourceId: 'rumor.typed.1',
        kind: 'rumor',
        tick: 11,
        subjectId: 'ashford',
        field: 'strengthBand',
        fromBand: 'ready',
        toBand: 'strong',
        direction: 'rise',
      },
    });
    expect(result).toMatchObject({ changed: true, reason: 'picture_updated' });
    expect(result.errand.negotiationPicture.subjects
      .find((subject) => subject.settlementId === 'ashford').strengthBand).toBe('strong');
    // K.2's whole point is that this picture mutates en route, so the mutated
    // errand must survive its own ledger. It once did not: the reader rejected
    // any picture whose lastChangedTick had advanced past departure, and the
    // errand vanished on the first rumor that reached it.
    expect(envoyErrandsOf(result.worldState)).toHaveLength(1);
    expect(envoyErrandsOf(result.worldState)[0].negotiationPicture.lastChangedTick).toBe(11);
    const duplicate = updateEnvoyNegotiationPicture({
      worldState: result.worldState,
      errandId: result.errand.id,
      patch: {
        id: 'picture-mutation.1',
        pictureId: picture.id,
        episodeKey: envoyOfferEpisodeKey(outcome),
        sourceId: 'rumor.typed.1',
        kind: 'rumor',
        tick: 11,
        subjectId: 'ashford',
        field: 'strengthBand',
        fromBand: 'ready',
        toBand: 'strong',
        direction: 'rise',
      },
    });
    expect(duplicate.worldState).toBe(result.worldState);
    expect(duplicate.reason).toBe('picture_unchanged');

    result = advanceEnvoyErrands({ worldState: result.worldState, tick: 12 });
    const parlaying = envoyErrandForOffer(result.worldState, outcome);
    expect(parlaying).toMatchObject({ state: 'parlaying' });
    expect(parlaying.parlayId).toContain('target_parlay:');
    const sheet = whitePeaceSheet(parlaying, 13);
    const agreed = agreeEnvoyTerms({
      worldState: result.worldState,
      errandId: parlaying.id,
      termSheet: sheet,
      tick: 13,
    });
    expect(agreed).toMatchObject({ changed: true, reason: 'terms_agreed' });
    expect(agreed.errand.termSheet).toEqual(sheet);
    sheet.pictureIds.proposer = 'tampered-after-write';
    expect(agreed.errand.termSheet.pictureIds.proposer).toBe(picture.id);

    const returning = beginEnvoyReturn({
      worldState: agreed.worldState,
      errandId: parlaying.id,
      routePlan: routePlan({
        from: 'irontown', to: 'ashford', departTick: 14, arrivalTick: 17,
        expectedReturnTick: 17,
      }),
      tick: 14,
    });
    expect(returning).toMatchObject({ changed: true, reason: 'returning' });
    expect(returning.errand.termSheet).toEqual(agreed.errand.termSheet);

    const malformed = JSON.parse(JSON.stringify(returning.worldState));
    malformed.envoyErrands[0].termSheet.extraAuthorityClock = 99;
    expect(envoyErrandsOf(malformed)).toEqual([]);
  });
});

/**
 * EP-q — ⛔ STOP-ES2-1, OPTION A NARROW, DRIVEN THROUGH THE PERSIST SEAM RATHER THAN THE
 * VALIDATOR.
 *
 * `normalizeEnvoyEncounter` is not exported from this family's barrel and no test in the
 * tree called it directly before this block, so the armyId law had never been pinned at
 * all — it was only ever exercised incidentally by writer fixtures that always supplied an
 * army. These rows therefore go in through `envoyErrandsOf`, the SAME re-normalization
 * every saved world crosses on every read: an admitted encounter yields one errand, and a
 * refused one collapses the whole row to nothing. That makes the pin a HYDRATION pin, not
 * merely a DTO pin, which is the property the persisted-shape ruling actually needed.
 *
 * THE ARMY ARM IS PINNED FIRST AND UNCHANGED, so the widening cannot be mistaken for a
 * relaxation: an army-carried picture still demands its army id, and a court-carried one
 * still refuses to name an army nobody marched with.
 */
describe('EP-q — the encounter DTO admits a court-carried capture, and nothing else', () => {
  function interceptedBase() {
    const outcome = peaceOffer();
    const minted = mintOne(litWorld(), {
      outcome,
      routePlan: {
        legs: [
          { fromId: 'ashford', toId: 'ford', departTick: 10, arrivalTick: 12 },
          { fromId: 'ford', toId: 'irontown', departTick: 13, arrivalTick: 15 },
        ],
        expectedReturnTick: 20,
        routeRef: { id: 'road.north' },
      },
      negotiationPicture: negotiationPictureFor(outcome),
    });
    const intercepted = markEnvoyIntercepted({
      worldState: minted.worldState,
      errandId: minted.errand.id,
      encounter: {
        id: 'encounter.epq',
        kind: 'private_goal',
        privateGoal: 'imprison',
        tick: 11,
        errandId: minted.errand.id,
        npcId: 'npc.reeve',
        actorId: 'red-court',
        armyId: 'army.red.1',
        nodeId: 'ashford',
        relationshipKey: 'ashford::irontown',
        episodeKey: envoyOfferEpisodeKey(outcome),
        routeId: 'road.north',
        venueRef: { id: 'ashford', kind: 'field_node' },
      },
      interceptorPicture: armyPictureFor({
        outcome,
        armyId: 'army.red.1',
        interceptorId: 'red-court',
        counterpartId: 'ashford',
        tick: 11,
      }),
      expectedErrand: minted.errand,
      tick: 11,
    });
    // ANTI-VACUITY: every refusal assertion below reads as "no errand came back", which is
    // also what a broken FIXTURE produces. The base must be proven to come back first.
    expect(intercepted.reason).toBe('intercepted');
    return { worldState: intercepted.worldState, errand: intercepted.errand };
  }

  /** Re-read one hand-built errand through the exact seam a saved world crosses. */
  function readBack(worldState, errand) {
    return envoyErrandsOf({ ...worldState, [ENVOY_ERRAND_LEDGER_KEY]: [errand] });
  }

  function withEncounter(errand, encounter) {
    return { ...errand, encounters: [encounter] };
  }

  it('still requires the army id when an ARMY carried the picture — the old law, unmoved', () => {
    const { worldState, errand } = interceptedBase();
    const army = errand.encounters[0];
    expect(army.armyId).toBe('army.red.1');
    expect(readBack(worldState, errand)).toHaveLength(1);
    expect(readBack(worldState, errand)[0].encounters[0]).toMatchObject({
      armyId: 'army.red.1',
      interceptorPicture: { carrier: { kind: 'army', id: 'army.red.1' } },
    });

    // An army carrier with no army to name is refused exactly as it always was.
    expect(readBack(worldState, withEncounter(errand, { ...army, armyId: null }))).toEqual([]);
    // …and one naming a DIFFERENT army than its own picture carries.
    expect(readBack(worldState, withEncounter(errand, { ...army, armyId: 'army.blue.9' }))).toEqual([]);
  });

  it('admits a COURT-carried capture at a host settlement with a null army id', () => {
    const { worldState, errand } = interceptedBase();
    const army = errand.encounters[0];
    const courtPicture = {
      ...army.interceptorPicture,
      id: 'court-picture.red-court',
      carrier: { kind: 'court', id: 'red-court' },
    };
    const court = {
      ...army,
      armyId: null,
      routeId: null,
      venueRef: { id: 'ashford', kind: 'host_settlement' },
      interceptorPictureId: 'court-picture.red-court',
      interceptorPicture: courtPicture,
    };

    const [admitted] = readBack(worldState, withEncounter(errand, court));
    // The whole point of the ruling: this row is now PERSISTABLE. It was not before.
    expect(admitted, 'a court-carried capture must survive re-normalization').toBeTruthy();
    expect(admitted.encounters[0]).toMatchObject({
      armyId: null,
      routeId: null,
      venueId: 'ashford',
      venueRef: { id: 'ashford', kind: 'host_settlement' },
      interceptorId: 'red-court',
      interceptorPicture: { carrier: { kind: 'court', id: 'red-court' } },
    });
    // ROUND-TRIP: the emitted null is the same null the reader accepts, so a saved world
    // written from this row re-reads byte-identically rather than healing to ''.
    expect(readBack(worldState, withEncounter(errand, admitted.encounters[0]))[0].encounters[0])
      .toEqual(admitted.encounters[0]);
  });

  it('refuses an army id on a court-carried capture — nobody marched, so nobody is named', () => {
    const { worldState, errand } = interceptedBase();
    const army = errand.encounters[0];
    const courtPicture = {
      ...army.interceptorPicture,
      id: 'court-picture.red-court',
      carrier: { kind: 'court', id: 'red-court' },
    };
    const court = {
      ...army,
      armyId: null,
      routeId: null,
      venueRef: { id: 'ashford', kind: 'host_settlement' },
      interceptorPictureId: 'court-picture.red-court',
      interceptorPicture: courtPicture,
    };
    // ANTI-VACUITY: the lawful court row is admitted, so the refusals below isolate the
    // ONE field each mutates rather than a broken fixture.
    expect(readBack(worldState, withEncounter(errand, court))).toHaveLength(1);

    // THE LOAD-BEARING MUTANT'S TARGET. Emitting armyId unconditionally — the shape before
    // EP-q, and the shape a careless revert restores — must be refused here.
    expect(readBack(worldState, withEncounter(errand, { ...court, armyId: 'army.red.1' })))
      .toEqual([]);
    // A court that is not the interceptor cannot carry the interceptor's own picture.
    expect(readBack(worldState, withEncounter(errand, {
      ...court,
      interceptorPicture: { ...courtPicture, carrier: { kind: 'court', id: 'ashford' } },
    }))).toEqual([]);
    // The predicate is TOTAL and POSITIVE: `envoy` is a real member of the carrier
    // vocabulary and is still refused, because the interceptor is never the traveller.
    expect(readBack(worldState, withEncounter(errand, {
      ...court,
      interceptorPicture: { ...courtPicture, carrier: { kind: 'envoy', id: 'red-court' } },
    }))).toEqual([]);
  });
});
