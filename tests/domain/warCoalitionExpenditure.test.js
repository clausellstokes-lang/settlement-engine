import { describe, expect, it } from 'vitest';

import {
  coalitionJoinAnchor,
  coalitionMembersForParty,
  coalitionSunkCostPressureFor,
  readCoalitionExpenditure,
} from '../../src/domain/worldPulse/warCoalitionExpenditure.js';
import { warCoalitionNewsEntries } from '../../src/domain/worldPulse/warCoalitionNews.js';

const RULES = {
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  coalitionLedgerEnabled: true,
};

function anchor(partyId, callerId = 'root', enemyId = 'enemy', joinedTick = 5) {
  return {
    callId: `coalition_call.${callerId}.${partyId}.${enemyId}.1`,
    partyId,
    callerId,
    enemyId,
    joinedTick,
    callerDeploymentSinceTick: 1,
    originAttackerId: callerId,
    originSinceTick: 1,
    allianceRelationshipKey: `edge.${callerId}.${partyId}`,
    sourceCauseTypes: ['grievance'],
    cause: 'alliance_obligation',
  };
}

function deployment(partyId, patch = {}) {
  return {
    targetId: 'enemy',
    sinceTick: 5,
    deploymentAge: 5,
    maxStartStrength: 100,
    currentEffectiveStrength: 100,
    accumulatedAttrition: 0,
    deployedPopulation: 0,
    joinLedger: [anchor(partyId)],
    ...patch,
  };
}

function settlement(id, { population = 9000, storageMonths = 8 } = {}) {
  return {
    id,
    name: id[0].toUpperCase() + id.slice(1),
    settlement: {
      name: id,
      tier: 'town',
      population,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: {
        primaryImports: [],
        primaryExports: [],
        foodSecurity: {
          storageMonths,
          stockpile: { deployed: true, capacityMonths: 8 },
        },
      },
      powerStructure: { factions: [], conflicts: [] },
      activeConditions: [],
      npcs: [],
    },
  };
}

function fixture(memberDeployment = deployment('member'), patch = {}) {
  const items = [settlement('root'), settlement('member'), settlement('enemy'), settlement('rogue')];
  return {
    snapshot: {
      byId: new Map(items.map((row) => [row.id, row])),
      settlements: items,
      regionalGraph: { edges: [] },
    },
    worldState: {
      tick: 10,
      simulationRules: RULES,
      deployments: {
        root: { targetId: 'enemy', sinceTick: 1 },
        member: memberDeployment,
      },
      occupations: {},
      spatialLedgers: {},
      ...patch,
    },
  };
}

describe('WR-6 coalition expenditure', () => {
  it('accepts only the closed owner/caller join anchor', () => {
    expect(coalitionJoinAnchor(deployment('member'), 'member', 10)).toMatchObject({
      partyId: 'member', callerId: 'root', enemyId: 'enemy', joinedTick: 5,
    });
    expect(coalitionJoinAnchor(deployment('member'), 'root', 10)).toBeNull();
    expect(coalitionJoinAnchor({
      ...deployment('member'),
      joinLedger: [{ ...anchor('member'), sourceCauseTypes: [] }],
    }, 'member', 10)).toBeNull();
  });

  it('derives a qualitative current bill and never claims absent cumulative food or named cast', () => {
    const high = fixture(deployment('member', {
      deployedPopulation: 1200,
      leviedPopulationBySource: { vassal: 200 },
      currentEffectiveStrength: 45,
      accumulatedAttrition: 0.6,
    }), {
      occupations: {
        enemy: { occupierId: 'member', sinceTick: 7 },
        unrelated: { occupierId: 'member', sinceTick: 1 },
      },
    });
    high.snapshot.byId.get('member').settlement.economicState.foodSecurity.storageMonths = 1;
    const read = readCoalitionExpenditure({
      ...high,
      partyId: 'member',
      targetId: 'enemy',
      tick: 10,
    });
    expect(read).toBeTruthy();
    expect(read.callerId).toBe('root');
    expect(read.pressure01).toBeGreaterThan(0.5);
    expect(read.components.territory.heldSettlementIds).toEqual(['enemy']);
    expect(read.receipt.incompleteEvidence).toEqual(['namedCast', 'storesHistorical']);
    expect(read.receipt).toMatchObject({
      settlementId: 'member', counterpartId: 'root', targetId: 'enemy',
    });
    const named = ['member', 'root', 'enemy'].map((id) => ({
      id,
      name: id === 'member' ? 'March Ward' : id === 'root' ? 'High Court' : 'Ash Host',
      settlement: {
        name: id === 'member' ? 'March Ward' : id === 'root' ? 'High Court' : 'Ash Host',
      },
    }));
    const projected = warCoalitionNewsEntries({
      evidence: [read.receipt],
      snapshot: { settlements: named, byId: new Map(named.map((row) => [row.id, row])) },
    });
    expect(projected).toHaveLength(1);
    expect(projected[0].headline).toContain('High Court');
    expect(projected[0].headline).not.toContain('Ash Host');
    expect(read.receipt).not.toHaveProperty('storesDrawn');
    expect(read.receipt).not.toHaveProperty('namedCasualties');
  });

  it('does not charge old or unrelated occupation, and partial lighting selects the legacy fallback', () => {
    const f = fixture(deployment('member'), {
      occupations: {
        enemy: { occupierId: 'member', sinceTick: 2 },
        unrelated: { occupierId: 'member', sinceTick: 9 },
      },
    });
    const read = readCoalitionExpenditure({ ...f, partyId: 'member', targetId: 'enemy', tick: 10 });
    expect(read.components.territory.band).toBe('quiet');

    const rootPressure = coalitionSunkCostPressureFor({ ...f, tick: 10 });
    expect(rootPressure('root', 'enemy', f.worldState.deployments.root)).toBeUndefined();
    const dark = { ...f.worldState, simulationRules: { ...RULES, coalitionLedgerEnabled: false } };
    expect(coalitionSunkCostPressureFor({ worldState: dark, snapshot: f.snapshot, tick: 10 })
      ('member', 'enemy', f.worldState.deployments.member)).toBeUndefined();
  });

  it('builds only the join-anchor component and excludes a coincidental co-besieger', () => {
    const root = { targetId: 'enemy', sinceTick: 1 };
    const deployments = {
      root,
      alpha: deployment('alpha'),
      beta: deployment('beta'),
      rogue: { targetId: 'enemy', sinceTick: 2 },
    };
    expect(coalitionMembersForParty(deployments, 'root', 'enemy', 10))
      .toEqual(['alpha', 'beta', 'root']);
    expect(coalitionMembersForParty(deployments, 'rogue', 'enemy', 10)).toEqual(['rogue']);
  });
});
