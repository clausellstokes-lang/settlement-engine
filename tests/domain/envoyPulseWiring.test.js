/**
 * envoyPulseWiring.test.js — WR-7b reachability THROUGH the composed pulse.
 *
 * The unit suites prove each WR-7b writer in isolation. These pins prove the
 * chain is actually reachable from `advanceEnvoyDiplomacyPulse` itself: a real
 * dispatched errand collides with a real column, the hold ledger opens, the
 * custody row resumes onto a repriced leg, and a matured parlay drafts once and
 * then departs for home. Every arm asserts a positive fact first, so no pin can
 * pass for want of an errand.
 */
import { describe, expect, it } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { advanceEnvoyDiplomacyPulse } from '../../src/domain/worldPulse/envoyPulse.js';
import { envoyErrandsOf, envoyOfferEpisodeKey } from '../../src/domain/worldPulse/envoyErrand.js';
import { foreignGuestHoldsOf } from '../../src/domain/worldPulse/foreignGuestHold.js';
import { createNegotiationPicture } from '../../src/domain/worldPulse/negotiationPictures.js';
import { npcLedgerOf } from '../../src/domain/worldPulse/npcLedger.js';
import {
  PROVENANCE_GENERATED,
  routeEdge,
  routeEdgeId,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';

const NOW = '2026-08-03T00:00:00.000Z';
const EDGE = { id: 'edge.offerer.target', from: 'offerer', to: 'target', relationshipType: 'hostile' };
const KEY = relationshipKeyFromEdge(EDGE);
const RULES = Object.freeze({
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  envoyDiplomacyEnabled: true,
  npcConsequencesEnabled: true,
  routeLifecycleEnabled: true,
});

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

function offer() {
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
  };
}

function fixture() {
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
    simulationRules: { ...RULES },
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

/**
 * The same world with the direct road replaced by a two-hop road through an
 * unwalled waypoint, so an interception can happen somewhere that is not the
 * destination and a continuation has somewhere left to go.
 */
function waypointFixture() {
  const f = fixture();
  const near = routeEdgeId('offerer', 'waypoint', 'land');
  const far = routeEdgeId('waypoint', 'target', 'land');
  const worldState = {
    ...f.worldState,
    spatialLedgers: {
      ...f.worldState.spatialLedgers,
      routeNetwork: {
        edges: {
          [near]: routeEdge({
            a: 'offerer', b: 'waypoint', grade: 'road', mode: 'land',
            provenance: PROVENANCE_GENERATED, flavor: 'genesis', tick: 0,
            dominantFlowClass: null,
          }),
          [far]: routeEdge({
            a: 'waypoint', b: 'target', grade: 'road', mode: 'land',
            provenance: PROVENANCE_GENERATED, flavor: 'genesis', tick: 0,
            dominantFlowClass: null,
          }),
        },
        corridor: {},
      },
    },
  };
  return { ...f, worldState, snapshot: { ...f.snapshot, worldState } };
}

/** One real dispatch through the ordinary auto mouth. */
function dispatched(f = fixture()) {
  const applied = applyWorldPulseOutcomes({
    snapshot: { ...f.snapshot, worldState: f.worldState, regionalGraph: f.graph },
    worldState: f.worldState,
    regionalGraph: f.graph,
    wizardNews: { currentTick: 12, entries: [] },
    settlementMap: new Map(f.settlementUpdates.map((row) => [row.saveId, row])),
    outcomes: [offer()],
    tick: 12,
    now: NOW,
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: f.worldState.simulationRules,
  });
  const errand = envoyErrandsOf(applied.worldState)[0];
  return { f, applied, errand };
}

/**
 * A column standing where the envoy stands, carrying its own frozen picture.
 * `originId` is the interceptor: a target-owned column is a field parlay, any
 * other actor with a typed private goal is that goal.
 */
function column({
  armyId = 'army.vale',
  originId = 'target',
  destId = 'offerer',
  node,
  departTick,
  picturePartyId = originId,
  pictureCounterpartId = destId,
  envoyIntent = null,
  capturedTick,
}) {
  return {
    armyId,
    role: 'march',
    originId,
    destId,
    path: [node, destId === node ? originId : destId],
    departTick,
    arrivalTick: departTick + 20,
    position01: 0,
    strength: 100,
    readiness: 0.6,
    supplyQuality: 0.9,
    funding: 0.6,
    beliefStaleness: 0,
    lastTick: departTick,
    commandPicture: createNegotiationPicture({
      id: `army-picture.${armyId}`,
      carrier: { kind: 'army', id: armyId },
      partyId: picturePartyId,
      counterpartId: pictureCounterpartId,
      relationshipKey: KEY,
      episodeKey: envoyOfferEpisodeKey(offer()),
      frontOwnerId: 'offerer',
      frontSinceTick: 3,
      capturedTick,
      causeStatus: 'live',
      subjects: [
        { settlementId: picturePartyId, strengthBand: 'strong', storesBand: 'stocked' },
        { settlementId: pictureCounterpartId, strengthBand: 'ready', storesBand: 'thin' },
      ],
      evidenceIds: [],
    }),
    ...(envoyIntent ? { envoyIntent } : {}),
  };
}

function withColumn(worldState, record) {
  return {
    ...worldState,
    spatialLedgers: {
      ...worldState.spatialLedgers,
      armyTransit: { ...(worldState.spatialLedgers?.armyTransit || {}), [record.armyId]: record },
    },
  };
}

function pulse(f, worldState, tick, extra = {}) {
  return advanceEnvoyDiplomacyPulse({
    worldState,
    snapshot: { ...f.snapshot, worldState, regionalGraph: f.graph },
    regionalGraph: f.graph,
    wizardNews: { currentTick: tick, entries: [] },
    settlementUpdates: f.settlementUpdates,
    tick,
    now: NOW,
    season: null,
    simulationRules: worldState.simulationRules,
    ...extra,
  });
}

function errandOf(worldState) {
  return envoyErrandsOf(worldState)[0];
}

describe('WR-7b reachability through advanceEnvoyDiplomacyPulse', () => {
  it('marks a real collision, opens a hold, and resumes the exact journey', () => {
    const { f, applied, errand } = dispatched();
    expect(errand).toMatchObject({ state: 'travelling', from: 'offerer', to: 'target' });
    const arrival = Number(errand.legs[0].arrivalTick);
    expect(arrival).toBeGreaterThan(12);

    // A third-party column with a singular private goal, standing on the envoy's
    // own node at the exact arrival tick.
    const seeded = withColumn(applied.worldState, column({
      armyId: 'army.reavers',
      originId: 'target',
      destId: 'offerer',
      node: 'target',
      departTick: arrival,
      capturedTick: arrival,
      envoyIntent: {
        kind: 'private_goal',
        intentId: 'reavers.imprison',
        privateGoals: ['imprison'],
      },
    }));

    const collided = pulse(f, seeded, arrival);
    const intercepted = errandOf(collided.worldState);
    expect(intercepted.state, 'the collision must fire THROUGH the pulse, not only in the unit writer').toBe('intercepted');
    expect(intercepted.encounters).toHaveLength(1);
    expect(intercepted.encounters[0]).toMatchObject({
      resolution: 'pending',
      kind: 'private_goal',
      privateGoal: 'imprison',
      interceptorId: 'target',
      armyId: 'army.reavers',
      venueId: 'target',
    });
    expect(collided.evidence.map((row) => row.kind)).toContain('envoy_intercepted');
    // One transition per envoy per tick: the same pulse did not also resolve it.
    expect(intercepted.encounters[0].resolvedTick ?? null).toBeNull();

    const custody = pulse(f, collided.worldState, arrival + 1);
    const held = errandOf(custody.worldState);
    expect(held.state, 'a pending encounter must reach custody through the pulse').toBe('held');
    expect(held.heldTick).toBe(arrival + 1);
    const holds = Object.values(foreignGuestHoldsOf(custody.worldState));
    expect(holds, 'the hold ledger must actually open').toHaveLength(1);
    expect(holds[0]).toMatchObject({
      npcId: held.npcId,
      errandId: held.id,
      captorId: 'target',
      venueId: 'target',
      cause: 'private_imprisonment',
      continuation: { resumeState: 'travelling', destinationId: 'target' },
    });
    expect(npcLedgerOf(custody.worldState).placed[held.npcId]).toMatchObject({
      hostSettlementId: 'target',
    });
  });

  it('parlays a target-column field encounter and departs for home carrying the verdict', () => {
    const { f, applied, errand } = dispatched();
    const arrival = Number(errand.legs[0].arrivalTick);
    const seeded = withColumn(applied.worldState, column({
      armyId: 'army.vale',
      originId: 'target',
      destId: 'offerer',
      node: 'target',
      departTick: arrival,
      capturedTick: arrival,
    }));

    const collided = pulse(f, seeded, arrival);
    expect(errandOf(collided.worldState)).toMatchObject({
      state: 'intercepted',
      encounters: [{ kind: 'field_parlay', interceptorId: 'target' }],
    });

    const parlaying = pulse(f, collided.worldState, arrival + 1);
    const talking = errandOf(parlaying.worldState);
    expect(talking.state, 'a field parlay must open through the pulse').toBe('parlaying');
    expect(talking.parlayTick).toBe(arrival + 1);
    expect(talking.termSheet ?? null, 'drafting is a later tick, never the same one').toBeNull();

    const drafted = pulse(f, parlaying.worldState, arrival + 2);
    const verdict = errandOf(drafted.worldState);
    expect(verdict.state).toBe('parlaying');
    // Exactly one of the two terminal verdicts is persisted, and only one.
    const agreed = verdict.termSheet != null;
    const refused = verdict.parlayRefusal != null;
    expect(
      [agreed, refused].filter(Boolean),
      'one drafting attempt must persist exactly one verdict',
    ).toHaveLength(1);
    if (agreed) {
      expect(verdict.termSheet).toMatchObject({
        errandId: verdict.id,
        encounterId: verdict.parlayId,
        agreedTick: arrival + 2,
      });
    } else {
      expect(verdict.parlayRefusal).toMatchObject({
        parlayId: verdict.parlayId,
        attemptedTick: arrival + 2,
      });
    }

    // The draft is not repeated: a second pulse at the same clock changes nothing
    // about the verdict, and the mandatory return departs on the next tick.
    const returning = pulse(f, drafted.worldState, arrival + 3);
    const homeward = errandOf(returning.worldState);
    expect(homeward.state, 'the mandatory return must be priced and begun through the pulse').toBe('returning');
    expect(homeward.returnOriginId ?? homeward.to).toBe('target');
    expect(homeward.legs.some((leg) => leg.journey === 'return')).toBe(true);
    expect(returning.evidence.map((row) => row.kind)).toContain('envoy_returning');
    if (agreed) {
      expect(homeward.termSheet ?? null, 'an agreed sheet rides home').not.toBeNull();
    } else {
      expect(homeward.termSheet ?? null, 'a refused parlay walks home empty-handed').toBeNull();
      expect(homeward.parlayRefusal ?? null).not.toBeNull();
    }
  });

  it('resumes an interrupted journey onto a freshly priced leg through the pulse', () => {
    const { f, applied, errand } = dispatched(waypointFixture());
    expect(errand.state).toBe('travelling');
    expect(errand.legs.map((leg) => leg.toId), 'the road must actually detour')
      .toEqual(['waypoint', 'target']);
    // A column standing on the envoy's road, carrying a singular plant goal it
    // has not paid for: the encounter is real and its typed private goal
    // outranks the ordinary field parlay, but the fold never happened, so the
    // continuation arm must reprice and release rather than hold.
    const legOne = Number(errand.legs[0].arrivalTick);
    const seeded = withColumn(applied.worldState, column({
      armyId: 'army.rooks',
      originId: 'target',
      destId: 'offerer',
      node: 'waypoint',
      departTick: legOne,
      capturedTick: legOne,
      envoyIntent: {
        kind: 'private_goal',
        intentId: 'rooks.plant',
        privateGoals: ['plant'],
        plantEligible: true,
        plantLineageId: 'lineage.rooks',
        plantTargetErrandId: errand.id,
      },
    }));

    const collided = pulse(f, seeded, legOne);
    const intercepted = errandOf(collided.worldState);
    expect(intercepted.state).toBe('intercepted');
    expect(intercepted.encounters[0]).toMatchObject({
      kind: 'private_goal', privateGoal: 'plant', venueId: 'waypoint', resolution: 'pending',
      interceptorId: 'target',
    });

    const resumed = pulse(f, collided.worldState, legOne + 1);
    const walking = errandOf(resumed.worldState);
    expect(walking.state, 'the continuation must complete through the pulse').toBe('travelling');
    expect(walking.releasedTick).toBe(legOne + 1);
    expect(walking.encounters[0]).toMatchObject({
      resolution: 'resumed',
      continuation: { resumeState: 'travelling', destinationId: 'target', resumedTick: legOne + 1 },
    });
    expect(walking.expectedReturnTick, 'the immutable deadline survives custody')
      .toBe(errand.expectedReturnTick);
    const roamer = npcLedgerOf(resumed.worldState).roamers[walking.npcId];
    expect(roamer.transit, 'H1 rides the repriced leg').toMatchObject({
      fromId: 'waypoint', toId: 'target', departTick: legOne + 1,
    });
  });

  it('hands commissioned plant envelopes back untargeted when no column carries the goal', () => {
    const { f, applied } = dispatched();
    const envelope = {
      key: 'plant.envelope.1',
      record: {
        lineageId: 'lineage.1',
        liarId: 'nobody',
        audienceId: 'offerer',
        subjectId: 'target',
        seededTick: 12,
        assertedBand: 1,
        trueBand: 3,
      },
      receipt: { patronId: 'target' },
    };
    const result = pulse(f, applied.worldState, 13, { commissionedPlants: [envelope] });
    expect(result.commissionedPlants, 'the pulse hands the paid envelope back for the lie writer')
      .toEqual([envelope]);
  });

  it('is a complete identity no-op when the six-law conjunction is not exact', () => {
    const f = fixture();
    const dark = { ...f.worldState, simulationRules: { ...RULES, envoyDiplomacyEnabled: false } };
    const result = pulse(f, dark, 12, { commissionedPlants: [] });
    expect(result.worldState).toBe(dark);
    expect(result.evidence).toEqual([]);
    expect(result.newsEntries).toEqual([]);
    expect(result.commissionedPlants).toEqual([]);
  });
});
