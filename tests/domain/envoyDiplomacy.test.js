import { describe, expect, it } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipEvolution.js';
import {
  applyWorldPulseOutcomes,
  applyWorldPulseProposal,
} from '../../src/domain/worldPulse/applyWorldPulse.js';
import {
  buildEnvoyRoutePlan,
  dispatchAcceptedPeaceEnvoy,
  envoyDeparturePicture,
  envoyHomeOutcome,
  envoyReturnAlreadyApplied,
  envoyReturnAcceptance,
  syncEnvoyNpcTransit,
} from '../../src/domain/worldPulse/envoyDiplomacy.js';
import { advanceEnvoyDiplomacyPulse } from '../../src/domain/worldPulse/envoyPulse.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import {
  advanceEnvoyErrands,
  beginEnvoyReturn,
  envoyErrandIdForOffer,
  envoyErrandsOf,
  markEnvoyHome,
  markEnvoyLost,
} from '../../src/domain/worldPulse/envoyErrand.js';
import { moveNpcRecord, npcLedgerOf } from '../../src/domain/worldPulse/npcLedger.js';
import { projectNpcPool } from '../../src/domain/worldPulse/npcLedgerProjection.js';
import {
  PROVENANCE_GENERATED,
  routeEdge,
  routeEdgeId,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { readWarPeaceDecision } from '../../src/domain/worldPulse/warPeaceDecision.js';

const NOW = '2026-08-02T00:00:00.000Z';
const EDGE = { id: 'edge.offerer.target', from: 'offerer', to: 'target', relationshipType: 'hostile' };
const KEY = relationshipKeyFromEdge(EDGE);
const RULES = {
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  envoyDiplomacyEnabled: true,
  npcConsequencesEnabled: true,
  routeLifecycleEnabled: true,
};

function save(id, name, population, npcs = []) {
  return {
    id,
    name,
    settlement: {
      id,
      name,
      seed: `seed.${id}`,
      tier: 'town',
      population,
      config: { priorityEconomy: 30, priorityMilitary: 30, tradeRouteAccess: 'road' },
      economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ id: `${id}.seat`, faction: `${name} Seat`, power: 60, isGoverning: true }],
      },
      npcs,
      activeConditions: [],
    },
  };
}

function offer(patch = {}) {
  return {
    id: 'candidate.strategy.sue_for_peace.offerer.12',
    generatedAtTick: 12,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: 'offerer',
    severity: 0.72,
    probability: 1,
    applyMode: 'auto',
    headline: 'Ember sues for peace',
    summary: 'Ember offers terms.',
    reasons: [],
    relationshipKey: KEY,
    relationshipPatch: { proposedRelationshipType: 'cold_war', trajectory: 'transitioning' },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey: KEY,
      fromType: 'hostile',
      toType: 'cold_war',
      peaceOffer: true,
      offererId: 'offerer',
      targetId: 'target',
      peaceFrontOwnerId: 'offerer',
      peaceFrontSinceTick: 3,
      reason: 'Ember offered peace.',
    },
    ...patch,
  };
}

function fixture(rules = RULES) {
  const saves = [
    save('offerer', 'Ember', 1000, [{
      id: 'npc.mara', name: 'Mara Vale', role: 'Chancellor', importance: 'notable', status: 'active',
    }]),
    save('target', 'Vale', 12000),
  ];
  const graph = ensureRegionalGraph({ edges: [EDGE], channels: [] }, { now: NOW });
  const roadId = routeEdgeId('offerer', 'target', 'land');
  const worldState = {
    tick: 12,
    simulationRules: rules,
    relationshipStates: { [KEY]: { relationshipType: 'hostile', trust: 0.5, resentment: 0.2 } },
    deployments: {
      offerer: {
        targetId: 'target', sinceTick: 3, role: 'siege',
        maxStartStrength: 100, currentEffectiveStrength: 100, casusReasons: [],
      },
    },
    warExhaustion: { target: 1 },
    spatialLedgers: {
      warReasons: {},
      routeNetwork: {
        edges: {
          [roadId]: routeEdge({
            a: 'offerer', b: 'target', grade: 'road', mode: 'land',
            provenance: PROVENANCE_GENERATED, flavor: 'genesis', tick: 0,
            dominantFlowClass: null,
          }),
        },
        corridor: {},
      },
    },
  };
  const settlements = saves.map((row) => ({
    id: row.id, name: row.name, save: row, settlement: row.settlement,
  }));
  const snapshot = {
    settlements,
    byId: new Map(settlements.map((row) => [row.id, row])),
    regionalGraph: graph,
    worldState,
    campaign: {},
  };
  const settlementUpdates = saves.map((row) => ({
    saveId: row.id, save: row, settlement: row.settlement,
  }));
  return { saves, graph, worldState, snapshot, settlementUpdates };
}

function apply(f, worldState = f.worldState, outcome = offer()) {
  return applyWorldPulseOutcomes({
    snapshot: { ...f.snapshot, worldState, regionalGraph: f.graph },
    worldState,
    regionalGraph: f.graph,
    wizardNews: { currentTick: 12, entries: [] },
    settlementMap: new Map(f.settlementUpdates.map((row) => [row.saveId, row])),
    outcomes: [outcome],
    tick: 12,
    now: NOW,
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: worldState.simulationRules,
  });
}

describe('WR-7a physical bilateral transport', () => {
  it('freezes a closed departure picture from the already-earned WR-5 ruling', () => {
    const f = fixture();
    const decision = readWarPeaceDecision({
      worldState: f.worldState, snapshot: f.snapshot, outcome: offer(), tick: 12,
    });
    expect(decision.accepted).toBe(true);
    const picture = envoyDeparturePicture(decision, {
      snapshot: f.snapshot,
      worldState: f.worldState,
      settlementId: 'offerer',
    });
    expect(picture).toEqual({
      storesBand: expect.stringMatching(/^(bare|thin|stocked|deep)$/),
      strengthBand: expect.stringMatching(/^(spent|strained|ready|strong|dominant)$/),
      moraleExhaustionBand: expect.stringMatching(/^(quiet|present|pressing|decisive)$/),
      foundingCauseStatus: expect.stringMatching(/^(dissolved|anchor_unavailable|live)$/),
      believedRatioBand: expect.stringMatching(/^(far_behind|behind|matched|ahead|far_ahead)$/),
    });
    const alteredEnemyTruth = {
      ...decision,
      offererTermination: {
        ...decision.offererTermination,
        receipt: {
          ...decision.offererTermination.receipt,
          truthBalanceBand: decision.offererTermination.receipt.truthBalanceBand === 'far_ahead'
            ? 'far_behind'
            : 'far_ahead',
        },
      },
    };
    expect(envoyDeparturePicture(alteredEnemyTruth, {
      snapshot: f.snapshot,
      worldState: f.worldState,
      settlementId: 'offerer',
    }).strengthBand).toBe(picture.strengthBand);
  });

  it('dispatches one durable named person while hostility and the army stay live', () => {
    const f = fixture();
    const result = apply(f);
    const errands = envoyErrandsOf(result.worldState);
    expect(errands).toHaveLength(1);
    expect(errands[0]).toMatchObject({
      from: 'offerer', to: 'target', state: 'travelling', npcName: 'Mara Vale',
      acceptance: { accepted: true, offererId: 'offerer', targetId: 'target' },
    });
    expect(result.regionalGraph.edges.find((edge) => edge.id === EDGE.id).relationshipType)
      .toBe('hostile');
    expect(result.worldState.deployments.offerer.recalled).toBeUndefined();
    expect(result.autoApplied).toContainEqual(expect.objectContaining({
      candidateType: 'envoy_dispatched', recordMode: 'state_only',
    }));
    expect(result.envoyEvidence).toContainEqual(expect.objectContaining({ kind: 'envoy_departed' }));
    expect(errands[0].legs[0].routeRef).toEqual({ id: routeEdgeId('offerer', 'target', 'land') });
    expect(result.envoyEvidence).toContainEqual(expect.objectContaining({
      kind: 'envoy_departed',
      routeId: routeEdgeId('offerer', 'target', 'land'),
    }));
    const ledger = npcLedgerOf(result.worldState);
    expect(Object.keys(ledger.roamers)).toHaveLength(1);
    expect(Object.values(ledger.roamers)[0].transit).toMatchObject({
      fromId: 'offerer', toId: 'target', departTick: 12,
    });
  });

  it('keeps partial activation on the established instant-settlement path', () => {
    const f = fixture({ ...RULES, routeLifecycleEnabled: false });
    const result = apply(f);
    expect(result.worldState).not.toHaveProperty('envoyErrands');
    expect(result.regionalGraph.edges.find((edge) => edge.id === EDGE.id).relationshipType)
      .toBe('cold_war');
    expect(result.worldState.deployments.offerer.recalled).toMatchObject({
      cause: 'sue_for_peace', tick: 12,
    });
  });

  it('manual proposal approval converges on the same physical dispatch mouth', () => {
    const f = fixture();
    const stored = offer({ applyMode: 'proposal' });
    const proposal = {
      id: 'world_proposal.peace.offerer.12',
      status: 'pending',
      recordModeVersion: 4,
      tick: 12,
      outcome: stored,
      headline: stored.headline,
      summary: stored.summary,
      reasons: stored.reasons,
    };
    const result = applyWorldPulseProposal({
      campaign: {
        id: 'campaign.envoy',
        settlementIds: f.saves.map((row) => row.id),
        worldState: { ...f.worldState, proposals: [proposal] },
        regionalGraph: f.graph,
        wizardNews: { currentTick: 12, entries: [] },
      },
      saves: f.saves,
      proposalId: proposal.id,
      now: NOW,
    });
    expect(envoyErrandsOf(result.worldState)).toHaveLength(1);
    expect(result.worldState.proposals[0]).toMatchObject({
      id: proposal.id, status: 'applied',
    });
    expect(result.regionalGraph.edges.find((edge) => edge.id === EDGE.id).relationshipType)
      .toBe('hostile');
    expect(result.worldState.deployments.offerer.recalled).toBeUndefined();
  });

  it('binds nothing outbound, then settles through the same apply path only on home delivery', () => {
    const f = fixture();
    const dispatched = apply(f);
    const errand = envoyErrandsOf(dispatched.worldState)[0];
    const atParlay = advanceEnvoyErrands({ worldState: dispatched.worldState, tick: 13 });
    expect(envoyErrandsOf(atParlay.worldState)[0].state).toBe('parlaying');
    expect(dispatched.regionalGraph.edges.find((edge) => edge.id === EDGE.id).relationshipType)
      .toBe('hostile');

    const returnPlan = buildEnvoyRoutePlan({
      worldState: atParlay.worldState,
      fromId: 'target',
      toId: 'offerer',
      tick: 14,
      journey: 'return',
    });
    const returning = beginEnvoyReturn({
      worldState: atParlay.worldState,
      errandId: errand.id,
      routePlan: returnPlan,
      termSheet: { id: 'terms.one', kind: 'white_peace' },
      tick: 14,
    });
    expect(returning.reason).toBe('returning');
    const homeTick = returnPlan.expectedReturnTick;
    const delivered = advanceEnvoyDiplomacyPulse({
      worldState: { ...returning.worldState, tick: homeTick },
      snapshot: { ...f.snapshot, worldState: returning.worldState },
      regionalGraph: dispatched.regionalGraph,
      wizardNews: dispatched.wizardNews,
      settlementUpdates: dispatched.settlementUpdates,
      tick: homeTick,
      now: NOW,
      simulationRules: RULES,
    });
    expect(envoyErrandsOf(delivered.worldState)[0].state).toBe('home');
    expect(delivered.regionalGraph.edges.find((edge) => edge.id === EDGE.id).relationshipType)
      .toBe('cold_war');
    expect(delivered.worldState.deployments.offerer.recalled).toMatchObject({
      cause: 'sue_for_peace', tick: homeTick,
    });
    expect(delivered.evidence).toContainEqual(expect.objectContaining({ kind: 'envoy_home' }));
    expect(delivered.autoApplied).toContainEqual(expect.objectContaining({
      id: offer().id, recordMode: 'state_only',
    }));

    // A terminal home row is history, not a permanent positional command. Once a
    // later ruling moves the person, another pulse must not drag them back home.
    const relocated = moveNpcRecord({
      worldState: delivered.worldState,
      wnpcId: errand.npcId,
      hostSettlementId: 'target',
      sinceTick: homeTick + 1,
    });
    expect(relocated.changed).toBe(true);
    const afterArchive = advanceEnvoyDiplomacyPulse({
      worldState: relocated.worldState,
      snapshot: { ...f.snapshot, worldState: relocated.worldState },
      regionalGraph: delivered.regionalGraph,
      wizardNews: delivered.wizardNews,
      settlementUpdates: delivered.settlementUpdates,
      tick: homeTick + 2,
      now: NOW,
      simulationRules: RULES,
    });
    expect(npcLedgerOf(afterArchive.worldState).placed[errand.npcId]).toMatchObject({
      hostSettlementId: 'target', sinceTick: homeTick + 1,
    });
  });

  it('dispatch helper is transactional when no lived route exists', () => {
    const f = fixture();
    const noRoute = {
      ...f.worldState,
      spatialLedgers: { ...f.worldState.spatialLedgers, routeNetwork: { edges: {}, corridor: {} } },
    };
    const decision = readWarPeaceDecision({
      worldState: noRoute,
      snapshot: { ...f.snapshot, worldState: noRoute },
      outcome: offer(),
      tick: 12,
    });
    const result = dispatchAcceptedPeaceEnvoy({
      worldState: noRoute,
      snapshot: { ...f.snapshot, worldState: noRoute },
      outcome: offer(),
      decision,
      tick: 12,
    });
    expect(result).toMatchObject({ worldState: noRoute, changed: false, reason: 'no_route' });
    expect(result.worldState).not.toHaveProperty('envoyErrands');
    expect(npcLedgerOf(result.worldState)).toEqual({ roamers: {}, placed: {}, exclusions: {} });
  });

  it('binds transport authority to the exact offer, person, and surviving war episode', () => {
    const f = fixture();
    const dispatched = apply(f);
    const errand = envoyErrandsOf(dispatched.worldState)[0];
    const parlay = advanceEnvoyErrands({ worldState: dispatched.worldState, tick: 13 });
    const returnPlan = buildEnvoyRoutePlan({
      worldState: parlay.worldState, fromId: 'target', toId: 'offerer', tick: 14, journey: 'return',
    });
    const returning = beginEnvoyReturn({
      worldState: parlay.worldState, errandId: errand.id, routePlan: returnPlan, tick: 14,
    });
    const home = markEnvoyHome({
      worldState: returning.worldState, errandId: errand.id, tick: returnPlan.expectedReturnTick,
    });
    const homeErrand = envoyErrandsOf(home.worldState)[0];
    const replay = envoyHomeOutcome({
      errandId: homeErrand.id,
      npcId: homeErrand.npcId,
      offer: homeErrand.offer,
      acceptance: homeErrand.acceptance,
    });
    expect(envoyReturnAcceptance(home.worldState, replay, f.graph)).toMatchObject({ accepted: true });

    const wrongPerson = {
      ...replay,
      metadata: {
        ...replay.metadata,
        envoyTransportReturn: {
          ...replay.metadata.envoyTransportReturn,
          npcId: 'npc.forged',
        },
      },
    };
    expect(envoyReturnAcceptance(home.worldState, wrongPerson, f.graph)).toBeNull();
    const changedTerms = {
      ...replay,
      relationshipPatch: { ...replay.relationshipPatch, proposedRelationshipType: 'ally' },
      proposalPayload: { ...replay.proposalPayload, toType: 'ally' },
    };
    expect(envoyReturnAcceptance(home.worldState, changedTerms, f.graph)).toBeNull();
    const unrelatedEdge = {
      id: 'edge.third.fourth', from: 'third', to: 'fourth', relationshipType: 'hostile',
    };
    const crossedOffer = {
      ...homeErrand.offer,
      relationshipKey: unrelatedEdge.id,
      proposalPayload: {
        ...homeErrand.offer.proposalPayload,
        relationshipKey: unrelatedEdge.id,
      },
    };
    const crossedErrand = {
      ...homeErrand,
      id: envoyErrandIdForOffer(crossedOffer),
      offer: crossedOffer,
    };
    const crossedWorld = {
      ...home.worldState,
      envoyErrands: [crossedErrand],
      relationshipStates: {
        ...home.worldState.relationshipStates,
        [unrelatedEdge.id]: { relationshipType: 'hostile' },
      },
    };
    const crossedReplay = envoyHomeOutcome({
      errandId: crossedErrand.id,
      npcId: crossedErrand.npcId,
      offer: crossedOffer,
      acceptance: crossedErrand.acceptance,
    });
    const crossedGraph = ensureRegionalGraph({ edges: [EDGE, unrelatedEdge], channels: [] }, { now: NOW });
    expect(envoyReturnAcceptance(crossedWorld, crossedReplay, crossedGraph)).toBeNull();
    const laterEpisode = {
      ...home.worldState,
      deployments: {
        ...home.worldState.deployments,
        offerer: { ...home.worldState.deployments.offerer, sinceTick: 4 },
      },
    };
    expect(envoyReturnAcceptance(laterEpisode, replay, f.graph)).toBeNull();
    const absurdButExact = {
      ...home.worldState,
      relationshipStates: {
        ...home.worldState.relationshipStates,
        [KEY]: { ...home.worldState.relationshipStates[KEY], relationshipType: 'vassal' },
      },
    };
    expect(envoyReturnAcceptance(absurdButExact, replay, f.graph)).toMatchObject({ accepted: true });
  });

  it('keeps an arrived envoy retryable when home settlement lapses, then commits atomically', () => {
    const f = fixture();
    const dispatched = apply(f);
    const errand = envoyErrandsOf(dispatched.worldState)[0];
    const parlay = advanceEnvoyErrands({ worldState: dispatched.worldState, tick: 13 });
    const returnPlan = buildEnvoyRoutePlan({
      worldState: parlay.worldState, fromId: 'target', toId: 'offerer', tick: 14, journey: 'return',
    });
    const returning = beginEnvoyReturn({
      worldState: parlay.worldState, errandId: errand.id, routePlan: returnPlan, tick: 14,
    });
    const returnSyncedWorld = syncEnvoyNpcTransit(
      returning.worldState,
      envoyErrandsOf(returning.worldState)[0],
      14,
    );
    const returningWithBelief = {
      ...returnSyncedWorld,
      spatialCanonVersion: 1,
      simulationRules: { ...RULES, infoMode: 'full' },
      spatialLedgers: {
        ...returnSyncedWorld.spatialLedgers,
        beliefMaps: {
          offerer: {
            seat: {
              target: {
                readiness: 0.5,
                strengthBand: 2,
                allianceLabel: 'rival',
                faithLabel: null,
                confidence01: 0.6,
                lastUpdateTick: Number(returnPlan.expectedReturnTick) - 1,
              },
            },
          },
        },
      },
    };
    const stale = {
      ...returningWithBelief,
      deployments: {
        ...returningWithBelief.deployments,
        offerer: { ...returningWithBelief.deployments.offerer, sinceTick: 4 },
      },
    };
    const failed = advanceEnvoyDiplomacyPulse({
      worldState: stale,
      snapshot: { ...f.snapshot, worldState: stale },
      regionalGraph: dispatched.regionalGraph,
      wizardNews: dispatched.wizardNews,
      settlementUpdates: dispatched.settlementUpdates,
      tick: returnPlan.expectedReturnTick + 1,
      now: NOW,
      simulationRules: stale.simulationRules,
    });
    expect(envoyErrandsOf(failed.worldState)[0]).toMatchObject({
      state: 'returning', positionRef: { progressBand: 'arrived' },
    });
    expect(failed.regionalGraph.edges.find((edge) => edge.id === EDGE.id).relationshipType)
      .toBe('hostile');
    expect(failed.evidence).not.toContainEqual(expect.objectContaining({ kind: 'envoy_home' }));
    expect(failed.evidence).not.toContainEqual(expect.objectContaining({ kind: 'envoy_silence_inference' }));
    expect(envoyErrandsOf(failed.worldState)[0]).not.toHaveProperty('silenceInferredAtTick');

    const repaired = {
      ...failed.worldState,
      deployments: { ...failed.worldState.deployments, offerer: f.worldState.deployments.offerer },
    };
    const retried = advanceEnvoyDiplomacyPulse({
      worldState: repaired,
      snapshot: { ...f.snapshot, worldState: repaired },
      regionalGraph: failed.regionalGraph,
      wizardNews: failed.wizardNews,
      settlementUpdates: failed.settlementUpdates,
      tick: returnPlan.expectedReturnTick + 2,
      now: NOW,
      simulationRules: repaired.simulationRules,
    });
    expect(envoyErrandsOf(retried.worldState)[0].state).toBe('home');
    expect(retried.regionalGraph.edges.find((edge) => edge.id === EDGE.id).relationshipType)
      .toBe('cold_war');
    expect(retried.evidence).toContainEqual(expect.objectContaining({ kind: 'envoy_home' }));
  });

  it('requires the exact H1 courier at home and retries after the return leg is repaired', () => {
    const f = fixture();
    const dispatched = apply(f);
    const errand = envoyErrandsOf(dispatched.worldState)[0];
    const parlay = advanceEnvoyErrands({ worldState: dispatched.worldState, tick: 13 });
    const returnPlan = buildEnvoyRoutePlan({
      worldState: parlay.worldState, fromId: 'target', toId: 'offerer', tick: 14, journey: 'return',
    });
    const returning = beginEnvoyReturn({
      worldState: parlay.worldState, errandId: errand.id, routePlan: returnPlan, tick: 14,
    });
    const homeTick = Number(returnPlan.expectedReturnTick);

    const returningWithBelief = {
      ...returning.worldState,
      spatialCanonVersion: 1,
      simulationRules: { ...RULES, infoMode: 'full' },
      spatialLedgers: {
        ...returning.worldState.spatialLedgers,
        beliefMaps: {
          offerer: {
            seat: {
              target: {
                readiness: 0.5,
                strengthBand: 2,
                allianceLabel: 'rival',
                faithLabel: null,
                confidence01: 0.6,
                lastUpdateTick: homeTick - 1,
              },
            },
          },
        },
      },
    };
    const ledger = npcLedgerOf(returningWithBelief);
    const missingCourier = {
      ...returningWithBelief,
      spatialLedgers: {
        ...returningWithBelief.spatialLedgers,
        npcLedger: {
          ...ledger,
          roamers: Object.fromEntries(Object.entries(ledger.roamers)
            .filter(([id]) => id !== errand.npcId)),
          placed: Object.fromEntries(Object.entries(ledger.placed)
            .filter(([id]) => id !== errand.npcId)),
        },
      },
    };
    const missing = advanceEnvoyDiplomacyPulse({
      worldState: missingCourier,
      snapshot: { ...f.snapshot, worldState: missingCourier },
      regionalGraph: dispatched.regionalGraph,
      wizardNews: dispatched.wizardNews,
      settlementUpdates: dispatched.settlementUpdates,
      tick: homeTick + 1,
      now: NOW,
      simulationRules: missingCourier.simulationRules,
    });
    expect(envoyErrandsOf(missing.worldState)[0].state).toBe('returning');
    expect(missing.regionalGraph.edges.find((edge) => edge.id === EDGE.id).relationshipType)
      .toBe('hostile');
    expect(missing.evidence).not.toContainEqual(expect.objectContaining({ kind: 'envoy_home' }));
    expect(missing.evidence).toContainEqual(expect.objectContaining({ kind: 'envoy_silence_inference' }));
    expect(envoyErrandsOf(missing.worldState)[0].silenceInferredAtTick).toBe(homeTick + 1);

    const displaced = moveNpcRecord({
      worldState: returningWithBelief,
      wnpcId: errand.npcId,
      hostSettlementId: 'target',
      sinceTick: homeTick,
    });
    expect(displaced.changed).toBe(true);
    const conflicting = advanceEnvoyDiplomacyPulse({
      worldState: displaced.worldState,
      snapshot: { ...f.snapshot, worldState: displaced.worldState },
      regionalGraph: dispatched.regionalGraph,
      wizardNews: dispatched.wizardNews,
      settlementUpdates: dispatched.settlementUpdates,
      tick: homeTick + 1,
      now: NOW,
      simulationRules: returningWithBelief.simulationRules,
    });
    expect(envoyErrandsOf(conflicting.worldState)[0].state).toBe('returning');
    expect(npcLedgerOf(conflicting.worldState).placed[errand.npcId].hostSettlementId).toBe('target');
    expect(conflicting.evidence).toContainEqual(expect.objectContaining({ kind: 'envoy_silence_inference' }));

    const returningErrand = envoyErrandsOf(conflicting.worldState)[0];
    const returnLeg = returningErrand.legs.find((leg) => leg.journey === 'return');
    const repairedH1 = moveNpcRecord({
      worldState: conflicting.worldState,
      wnpcId: errand.npcId,
      hostSettlementId: null,
      patch: {
        residency: null,
        whereaboutsUnknown: null,
        transit: {
          fromId: returnLeg.fromId,
          toId: returnLeg.toId,
          departTick: returnLeg.departTick,
          arrivalTick: returnLeg.arrivalTick,
        },
      },
      sinceTick: returningErrand.returnStartedTick,
    });
    expect(repairedH1.changed).toBe(true);
    const repaired = advanceEnvoyDiplomacyPulse({
      worldState: repairedH1.worldState,
      snapshot: { ...f.snapshot, worldState: repairedH1.worldState },
      regionalGraph: conflicting.regionalGraph,
      wizardNews: conflicting.wizardNews,
      settlementUpdates: conflicting.settlementUpdates,
      tick: homeTick + 2,
      now: NOW,
      simulationRules: returningWithBelief.simulationRules,
    });
    expect(envoyErrandsOf(repaired.worldState)[0].state).toBe('home');
    expect(npcLedgerOf(repaired.worldState).placed[errand.npcId].hostSettlementId).toBe('offerer');
    expect(repaired.evidence).toContainEqual(expect.objectContaining({ kind: 'envoy_home' }));
  });

  it('closes an exact already-applied delivery idempotently but rejects a same-label different fact', () => {
    const f = fixture();
    const dispatched = apply(f);
    const errand = envoyErrandsOf(dispatched.worldState)[0];
    const parlay = advanceEnvoyErrands({ worldState: dispatched.worldState, tick: 13 });
    const returnPlan = buildEnvoyRoutePlan({
      worldState: parlay.worldState, fromId: 'target', toId: 'offerer', tick: 14, journey: 'return',
    });
    const returning = beginEnvoyReturn({
      worldState: parlay.worldState, errandId: errand.id, routePlan: returnPlan, tick: 14,
    });
    const homeTick = Number(returnPlan.expectedReturnTick);
    const firstDelivery = advanceEnvoyDiplomacyPulse({
      worldState: returning.worldState,
      snapshot: { ...f.snapshot, worldState: returning.worldState },
      regionalGraph: dispatched.regionalGraph,
      wizardNews: dispatched.wizardNews,
      settlementUpdates: dispatched.settlementUpdates,
      tick: homeTick,
      now: NOW,
      simulationRules: RULES,
    });
    const appliedRelationship = firstDelivery.worldState.relationshipStates[KEY];
    expect(appliedRelationship.peaceDecisionOutcomeId).toBe(offer().id);

    // Model an import/replay boundary where the immutable mechanical fact landed,
    // but the returning errand's archive write did not. Preserve the exact arrived
    // H1 position so the courier, not a fabricated label match, closes the errand.
    const priorApplied = {
      ...firstDelivery.worldState,
      envoyErrands: returning.worldState.envoyErrands,
      deployments: {
        ...firstDelivery.worldState.deployments,
        offerer: { ...f.worldState.deployments.offerer, sinceTick: 99 },
      },
      spatialLedgers: {
        ...firstDelivery.worldState.spatialLedgers,
        npcLedger: returning.worldState.spatialLedgers.npcLedger,
      },
    };
    const marked = markEnvoyHome({
      worldState: priorApplied, errandId: errand.id, tick: homeTick + 1,
    });
    const replay = envoyHomeOutcome({
      errandId: marked.errand.id,
      npcId: marked.errand.npcId,
      offer: marked.errand.offer,
      acceptance: marked.errand.acceptance,
    });
    expect(envoyReturnAlreadyApplied(marked.worldState, replay, f.graph)).toBe(true);

    const idempotent = advanceEnvoyDiplomacyPulse({
      worldState: priorApplied,
      snapshot: { ...f.snapshot, worldState: priorApplied },
      regionalGraph: firstDelivery.regionalGraph,
      wizardNews: firstDelivery.wizardNews,
      settlementUpdates: firstDelivery.settlementUpdates,
      tick: homeTick + 1,
      now: NOW,
      simulationRules: RULES,
    });
    expect(envoyErrandsOf(idempotent.worldState)[0].state).toBe('home');
    expect(idempotent.autoApplied).toEqual([]);
    expect(idempotent.evidence.filter((row) => row.kind === 'envoy_home')).toHaveLength(1);
    expect(idempotent.worldState.deployments).toEqual(priorApplied.deployments);
    expect(idempotent.regionalGraph).toEqual(firstDelivery.regionalGraph);

    const differentFact = {
      ...priorApplied,
      relationshipStates: {
        ...priorApplied.relationshipStates,
        [KEY]: { ...appliedRelationship, peaceDecisionOutcomeId: `${offer().id}.other` },
      },
    };
    const rejected = advanceEnvoyDiplomacyPulse({
      worldState: differentFact,
      snapshot: { ...f.snapshot, worldState: differentFact },
      regionalGraph: firstDelivery.regionalGraph,
      wizardNews: firstDelivery.wizardNews,
      settlementUpdates: firstDelivery.settlementUpdates,
      tick: homeTick + 1,
      now: NOW,
      simulationRules: RULES,
    });
    expect(envoyErrandsOf(rejected.worldState)[0].state).toBe('returning');
    expect(rejected.evidence).not.toContainEqual(expect.objectContaining({ kind: 'envoy_home' }));
  });

  it('records a late home settlement in the composed pulse mechanical receipt', () => {
    const f = fixture();
    const dispatched = apply(f);
    const errand = envoyErrandsOf(dispatched.worldState)[0];
    const parlay = advanceEnvoyErrands({ worldState: dispatched.worldState, tick: 13 });
    const returnPlan = buildEnvoyRoutePlan({
      worldState: parlay.worldState, fromId: 'target', toId: 'offerer', tick: 14, journey: 'return',
    });
    const returning = beginEnvoyReturn({
      worldState: parlay.worldState, errandId: errand.id, routePlan: returnPlan, tick: 14,
    });
    const homeTick = Number(returnPlan.expectedReturnTick);
    const result = simulateCampaignWorldPulse({
      campaign: {
        id: 'campaign.envoy.composed',
        settlementIds: f.saves.map((row) => row.id),
        worldState: {
          ...returning.worldState,
          tick: homeTick - 1,
          rngSeed: 'envoy-composed-pulse',
          calendar: { elapsedWeeks: homeTick - 1, elapsedMonths: 0, month: 1, year: 1, season: 'spring' },
        },
        regionalGraph: dispatched.regionalGraph,
        wizardNews: dispatched.wizardNews,
      },
      saves: f.saves.map((row) => ({
        ...row,
        phase: 'canon',
        campaignState: { phase: 'canon', eventLog: [], locks: {} },
      })),
      interval: 'one_week',
      now: NOW,
    });
    expect(envoyErrandsOf(result.worldState)[0].state).toBe('home');
    expect(result.pulseRecord).toMatchObject({
      mechanicalOutcomeCount: expect.any(Number),
      mechanicalOutcomes: expect.arrayContaining([expect.objectContaining({ id: offer().id })]),
      envoyEvidence: expect.arrayContaining([expect.objectContaining({ kind: 'envoy_home' })]),
    });
    expect(result.pulseRecord.mechanicalOutcomeCount).toBeGreaterThanOrEqual(1);
  });

  it('does not consume silence when no belief exists and writes it once a real belief does', () => {
    const f = fixture();
    const dispatched = apply(f);
    const deadline = Number(envoyErrandsOf(dispatched.worldState)[0].expectedReturnTick);
    const missing = {
      ...dispatched.worldState,
      spatialCanonVersion: 1,
      simulationRules: { ...RULES, infoMode: 'full' },
      spatialLedgers: {
        ...dispatched.worldState.spatialLedgers,
        beliefMaps: { offerer: { seat: {} } },
      },
    };
    const first = advanceEnvoyDiplomacyPulse({
      worldState: missing,
      snapshot: { ...f.snapshot, worldState: missing },
      regionalGraph: dispatched.regionalGraph,
      wizardNews: dispatched.wizardNews,
      settlementUpdates: dispatched.settlementUpdates,
      tick: deadline + 1,
      now: NOW,
      simulationRules: missing.simulationRules,
    });
    expect(envoyErrandsOf(first.worldState)[0]).not.toHaveProperty('silenceInferredAtTick');

    const withBelief = {
      ...first.worldState,
      spatialLedgers: {
        ...first.worldState.spatialLedgers,
        beliefMaps: {
          offerer: {
            seat: {
              target: {
                readiness: 0.5,
                strengthBand: 2,
                allianceLabel: 'rival',
                faithLabel: null,
                confidence01: 0.6,
                lastUpdateTick: deadline,
              },
            },
          },
        },
      },
    };
    const second = advanceEnvoyDiplomacyPulse({
      worldState: withBelief,
      snapshot: { ...f.snapshot, worldState: withBelief },
      regionalGraph: first.regionalGraph,
      wizardNews: first.wizardNews,
      settlementUpdates: first.settlementUpdates,
      tick: deadline + 2,
      now: NOW,
      simulationRules: withBelief.simulationRules,
    });
    expect(envoyErrandsOf(second.worldState)[0].silenceInferredAtTick).toBe(deadline + 2);
    expect(second.worldState.spatialLedgers.beliefMaps.offerer.seat.target).toMatchObject({
      allianceLabel: 'hostile',
      hostilityInference: { kind: 'envoy_silence', priorAllianceLabel: 'rival' },
    });
  });

  it('route_lost clears the H1 transit into an unknown off-route roamer', () => {
    const f = fixture();
    const dispatched = apply(f);
    const errand = envoyErrandsOf(dispatched.worldState)[0];
    const lost = markEnvoyLost({
      worldState: dispatched.worldState,
      errandId: errand.id,
      tick: 13,
      cause: 'route_lost',
    });
    expect(lost).toMatchObject({ changed: true, reason: 'lost' });

    const advanced = advanceEnvoyDiplomacyPulse({
      worldState: { ...lost.worldState, tick: 13 },
      snapshot: { ...f.snapshot, worldState: lost.worldState },
      regionalGraph: dispatched.regionalGraph,
      wizardNews: dispatched.wizardNews,
      settlementUpdates: dispatched.settlementUpdates,
      tick: 13,
      now: NOW,
      simulationRules: RULES,
    });
    const record = npcLedgerOf(advanced.worldState).roamers[errand.npcId];
    expect(record).toBeTruthy();
    expect(record).not.toHaveProperty('transit');
    expect(record).not.toHaveProperty('residency');
    expect(record.whereaboutsUnknown).toBe(true);
    expect(npcLedgerOf(advanced.worldState).placed[errand.npcId]).toBeUndefined();
    const player = projectNpcPool({ worldState: advanced.worldState, tick: 13 }).roamers[0];
    const dm = projectNpcPool({
      worldState: advanced.worldState, tick: 13, includeCovert: true,
    }).roamers[0];
    expect(player).toMatchObject({ wnpcId: errand.npcId });
    expect(player).not.toHaveProperty('whereaboutsUnknown');
    expect(dm).toMatchObject({ wnpcId: errand.npcId, whereaboutsUnknown: true });
    // Unknown means UNKNOWN: the old origin pointer remains history but cannot make
    // the lost traveler appear as a present unaffiliate at home.
    expect(projectNpcPool({
      worldState: advanced.worldState, tick: 13, settlementId: 'offerer',
    }).total).toBe(0);
    expect(envoyErrandsOf(advanced.worldState)[0]).toMatchObject({
      state: 'lost', lossCause: 'route_lost',
    });
    const stable = advanceEnvoyDiplomacyPulse({
      worldState: advanced.worldState,
      snapshot: { ...f.snapshot, worldState: advanced.worldState },
      regionalGraph: advanced.regionalGraph,
      wizardNews: advanced.wizardNews,
      settlementUpdates: advanced.settlementUpdates,
      tick: 14,
      now: NOW,
      simulationRules: RULES,
    });
    expect(stable.worldState).toBe(advanced.worldState);

    // The archived loss can consume its exact active leg once, but it cannot erase a
    // later rescue or reassignment and reassert "unknown" forever.
    const recovered = moveNpcRecord({
      worldState: advanced.worldState,
      wnpcId: errand.npcId,
      hostSettlementId: 'target',
      sinceTick: 14,
    });
    expect(recovered.changed).toBe(true);
    const afterRescue = advanceEnvoyDiplomacyPulse({
      worldState: recovered.worldState,
      snapshot: { ...f.snapshot, worldState: recovered.worldState },
      regionalGraph: advanced.regionalGraph,
      wizardNews: advanced.wizardNews,
      settlementUpdates: advanced.settlementUpdates,
      tick: 15,
      now: NOW,
      simulationRules: RULES,
    });
    expect(npcLedgerOf(afterRescue.worldState).placed[errand.npcId]).toMatchObject({
      hostSettlementId: 'target', sinceTick: 14,
    });
    expect(npcLedgerOf(afterRescue.worldState).placed[errand.npcId])
      .not.toHaveProperty('whereaboutsUnknown');
  });
});
