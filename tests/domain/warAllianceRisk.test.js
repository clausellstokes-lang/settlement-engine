import { describe, expect, test } from 'vitest';

import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { readAllianceWebRisk } from '../../src/domain/worldPulse/warAllianceRisk.js';
import {
  coalitionDecisionEvidence,
  readCoalitionJoinDecisions,
} from '../../src/domain/worldPulse/warCoalitionDecision.js';
import { canonicalAllianceRows } from '../../src/domain/worldPulse/warCoalitionGraph.js';

const CALL_EDGE = Object.freeze({
  id: 'edge.caller.observer', from: 'caller', to: 'observer', relationshipType: 'allied',
});
const DIRECT_EDGE = Object.freeze({
  id: 'edge.enemy.wing', from: 'enemy', to: 'wing', relationshipType: 'allied',
});
const SECOND_EDGE = Object.freeze({
  id: 'edge.wing.reserve', from: 'wing', to: 'reserve', relationshipType: 'allied',
});
const THIRD_EDGE = Object.freeze({
  id: 'edge.reserve.rear', from: 'reserve', to: 'rear', relationshipType: 'allied',
});
const EDGES = Object.freeze([CALL_EDGE, DIRECT_EDGE, SECOND_EDGE, THIRD_EDGE]);

const COALITION_RULES = Object.freeze({
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  coalitionLedgerEnabled: true,
  infoMode: 'unreliable',
});

function beliefRecord(strengthBand, allianceLabel) {
  return {
    readiness: 0,
    strengthBand,
    allianceLabel,
    faithLabel: null,
    confidence01: 1,
    lastUpdateTick: 5,
  };
}

function relationshipStates() {
  return Object.fromEntries(EDGES.map((edge) => [
    edge.id,
    {
      relationshipType: 'allied',
      ...(edge.id === CALL_EDGE.id
        ? { trust: 0.62, pactStrength: 0.58, dependency: 0.45 }
        : {}),
    },
  ]));
}

function worldWithBeliefs(strengthBand, allianceLabel) {
  return {
    tick: 5,
    spatialCanonVersion: 1,
    simulationRules: { ...COALITION_RULES },
    relationshipStates: relationshipStates(),
    spatialLedgers: {
      beliefMaps: {
        observer: {
          [GOVERNING_SEAT_KEY]: {
            wing: beliefRecord(strengthBand, allianceLabel),
            reserve: beliefRecord(strengthBand, allianceLabel),
          },
        },
      },
    },
  };
}

function declaredRows(worldState) {
  return canonicalAllianceRows({
    regionalGraph: { edges: EDGES },
    worldState,
  });
}

function riskFor(worldState, truthStrength) {
  return readAllianceWebRisk({
    rows: declaredRows(worldState),
    observerId: 'observer',
    enemyId: 'enemy',
    worldState,
    strengthFor: () => truthStrength,
    truthRelationshipFor: () => 'neutral',
    excludeIds: ['caller'],
  });
}

function item(id) {
  return {
    id,
    name: id,
    settlement: {
      name: id,
      population: 3000,
      config: {},
      powerStructure: { factions: [], conflicts: [] },
      npcs: [],
      activeConditions: [],
    },
  };
}

function decisionFor(strengthBand, allianceLabel) {
  const worldState = worldWithBeliefs(strengthBand, allianceLabel);
  worldState.deployments = {
    caller: {
      targetId: 'enemy',
      sinceTick: 2,
      casusReasons: [{ type: 'grievance', score: 0.8, atTick: 2 }],
    },
  };
  worldState.spatialLedgers.warReasons = {
    'caller>enemy': {
      reasons: {
        grievance: { type: 'grievance', score: 0.8, sinceTick: 2, tick: 5 },
      },
      updatedTick: 5,
    },
  };
  const settlements = ['caller', 'observer', 'enemy', 'wing', 'reserve', 'rear'].map(item);
  const snapshot = {
    settlements,
    byId: new Map(settlements.map((row) => [row.id, row])),
    regionalGraph: { edges: EDGES },
    worldState,
  };
  return readCoalitionJoinDecisions({
    snapshot,
    worldState,
    tick: 5,
    // These truth values are deliberately immaterial while the held beliefs exist.
    strengthFor: () => 0.99,
  }).find((row) => row.partyId === 'observer' && row.callerId === 'caller');
}

describe('WR-6 alliance-web risk stays on declared topology and observer belief', () => {
  test('the public declared web includes depth two, never depth three, under every belief reading', () => {
    const hostile = riskFor(worldWithBeliefs(4, 'hostile'), 0.99);
    const friendly = riskFor(worldWithBeliefs(4, 'allied'), 0.99);

    expect(hostile.members.map(({ subjectId, depth }) => ({ subjectId, depth }))).toEqual([
      { subjectId: 'reserve', depth: 2 },
      { subjectId: 'wing', depth: 1 },
    ]);
    expect(friendly.members.map(({ subjectId, depth }) => ({ subjectId, depth })))
      .toEqual(hostile.members.map(({ subjectId, depth }) => ({ subjectId, depth })));
    expect(hostile.members.some((row) => row.subjectId === 'rear')).toBe(false);
  });

  test('belief strength and observer-to-member relationship both move risk and its decision receipt', () => {
    const lowHostile = riskFor(worldWithBeliefs(0, 'hostile'), 0.99);
    const highHostile = riskFor(worldWithBeliefs(4, 'hostile'), 0.01);
    const highFriendly = riskFor(worldWithBeliefs(4, 'allied'), 0.99);
    expect(lowHostile.risk01).toBeLessThan(highHostile.risk01);
    expect(highFriendly.risk01).toBeLessThan(highHostile.risk01);
    expect(lowHostile.band).toBe('quiet');
    expect(highFriendly.band).toBe('present');
    expect(highHostile.band).toBe('decisive');

    const friendlyDecision = decisionFor(4, 'allied');
    const hostileDecision = decisionFor(4, 'hostile');
    expect(friendlyDecision).toBeTruthy();
    expect(hostileDecision).toBeTruthy();
    const friendlyReceipt = coalitionDecisionEvidence(
      friendlyDecision, friendlyDecision.accepted, 5,
    );
    const hostileReceipt = coalitionDecisionEvidence(
      hostileDecision, hostileDecision.accepted, 5,
    );
    expect(friendlyReceipt.find((row) => row.kind === 'coalition_entry_priced')?.band)
      .toBe('present');
    expect(hostileReceipt.find((row) => row.kind === 'coalition_entry_priced')?.band)
      .toBe('decisive');
    expect(friendlyReceipt.find((row) => row.kind === 'coalition_joined'
      || row.kind === 'coalition_refused')?.riskBand).toBe('present');
    expect(hostileReceipt.find((row) => row.kind === 'coalition_joined'
      || row.kind === 'coalition_refused')?.riskBand).toBe('decisive');
  });

  test('truth-strength changes cannot leak through a fixed held belief', () => {
    const beliefs = worldWithBeliefs(3, 'rival');
    const weakTruth = riskFor(beliefs, 0.01);
    const strongTruth = riskFor(beliefs, 0.99);
    expect(strongTruth).toEqual(weakTruth);
    expect(strongTruth.members.every((row) => row.believedStrength01 === 0.7)).toBe(true);
  });
});
