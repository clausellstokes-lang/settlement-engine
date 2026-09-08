/** WR-1 end-to-end pulse wiring: dark identity, one persisted read, no state twin. */
import { describe, expect, it } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, population) {
  return {
    name,
    tier: 'city',
    population,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 35 },
    institutions: [{ name: 'City Garrison' }, { name: 'Stone Walls' }],
    economicState: {
      prosperity: 'Prosperous', primaryExports: [], primaryImports: [],
      foodSecurity: { storageMonths: 8, resilienceScore: 80 },
    },
    powerStructure: {
      publicLegitimacy: { score: 65, label: 'Stable' },
      factions: [{ faction: `${name} Council`, category: 'military', power: 70, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
  };
}

const SAVES = [
  {
    id: 'atlas', name: 'Atlas', phase: 'canon', settlement: settlement('Atlas', 9000),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  },
  {
    id: 'borin', name: 'Borin', phase: 'canon', settlement: settlement('Borin', 7000),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  },
];

const HOSTILE = {
  id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile',
};

function siegeRecord() {
  return {
    targetId: 'borin',
    sinceTick: 3,
    role: 'siege',
    maxStartStrength: 80,
    currentEffectiveStrength: 80,
    accumulatedAttrition: 0,
    reinforcementFlow: 0,
    deploymentAge: 1,
    manpower: 0.8,
    supplyIntegrity: 0.8,
    morale: 0.8,
    equipmentCondition: 0.8,
    magicSupport: 0.5,
    commandQuality: 0.8,
    foodReserve: 0.8,
    logisticsBurden: 0.1,
    objective: 'conquest',
    returnCondition: 'pending',
    casusReasons: [{
      type: 'grievance', score: 0.8, receipt: 'An old border wrong still stands.', atTick: 3,
    }],
  };
}

function campaign(rules) {
  return {
    id: 'wr1-pulse',
    name: 'WR-1 Pulse',
    settlementIds: ['atlas', 'borin'],
    worldState: {
      rngSeed: 'wr1-pulse-survives',
      tick: 4,
      simulationRules: rules,
      relationshipStates: { [HOSTILE.id]: { relationshipType: 'hostile' } },
      deployments: { atlas: siegeRecord() },
      warExhaustion: { atlas: 0.25 },
      spatialLedgers: {
        warReasons: {
          'atlas>borin': {
            updatedTick: 4,
            reasons: {
              grievance: {
                type: 'grievance', score: 0.8, sinceTick: 1, tick: 4,
                receipt: 'An old border wrong still stands.',
              },
            },
          },
        },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [HOSTILE],
      channels: [{
        type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed',
        source: 'war_layer_deploy',
      }],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

function run(rules) {
  return simulateCampaignWorldPulse({
    campaign: campaign(rules), saves: SAVES, interval: 'one_week', now: NOW,
  });
}

describe('WR-1 pulse persistence', () => {
  it('requires both exact flags and keeps the dormant pulse byte-identical', () => {
    const absent = run({ warLayerEnabled: true });
    const explicitFalse = run({ warLayerEnabled: true, warTerminationEnabled: false });
    const noWar = run({ warLayerEnabled: false, warTerminationEnabled: true });

    expect(absent.pulseRecord).toEqual(explicitFalse.pulseRecord);
    expect(absent.worldState.deployments).toEqual(explicitFalse.worldState.deployments);
    expect(absent.pulseRecord.warTerminationReads).toBeUndefined();
    expect(explicitFalse.pulseRecord.warTerminationReads).toBeUndefined();
    expect(noWar.pulseRecord.warTerminationReads).toBeUndefined();
  });

  it('persists one qualitative pulse receipt and never creates a parallel state ledger', () => {
    const lit = run({ warLayerEnabled: true, warTerminationEnabled: true });
    const receipts = lit.pulseRecord.warTerminationReads;

    expect(receipts).toHaveLength(1);
    expect(receipts[0]).toMatchObject({
      kind: 'war_termination_read',
      attackerId: 'atlas',
      targetId: 'borin',
      settlementIds: ['atlas', 'borin'],
      tick: 5,
    });
    expect(typeof receipts[0].reason).toBe('string');
    expect(Object.values(receipts[0]).filter((value) => typeof value === 'number')).toEqual([5]);
    // Positive state anchor: the war record survives and remains the only durable war state.
    expect(lit.worldState.deployments.atlas.targetId).toBe('borin');
    expect(Object.prototype.hasOwnProperty.call(lit.worldState, 'terminationRead')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(lit.worldState.deployments.atlas, 'terminationRead')).toBe(false);
  });
});
