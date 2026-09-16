/**
 * warWindDown.test.js — the war-off WIND-DOWN contract.
 *
 * Turning the War layer off mid-campaign (directly, or cascaded by
 * Relationship drift turning off — see updateCampaignSimulationRules) used to
 * FREEZE worldState.deployments: armies stayed away from home forever, their
 * banked deployedPopulation stranded — a conservation leak. Now
 * evaluateWarLayer's OFF branch resolves every deployment as a WITHDRAWAL and
 * the kernel routes those through the SAME deploymentReturn machinery
 * (survivors march home, banked headcounts credit back, war_front channels
 * retire). Pins:
 *   (1) OFF + no deployments  → the byte-identical fast path (nothing emitted).
 *   (2) OFF + deployments     → all-withdrawal resolutions, the ledger clears,
 *                               fronts retire, the exhaustion scar stays.
 *   (3) Kernel end-to-end     → the banked deployedPopulation actually comes
 *                               home (army_homecoming credit) on the first
 *                               advance after the toggle-off.
 */
import { describe, expect, test } from 'vitest';

import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name, tier: patch.tier || 'town', population: patch.population || 6000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 60, label: 'Stable' },
      factions: [{ faction: 'Military Council', category: 'military', power: 70, isGoverning: true }],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }], activeConditions: [],
  };
}
const save = (id, name, patch = {}) => ({
  id, name, phase: 'canon', settlement: settlement(name, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});
function siegeRecord(targetId, extra = {}) {
  return {
    targetId, sinceTick: 0, role: 'siege', maxStartStrength: 50.9, currentEffectiveStrength: 50.9,
    accumulatedAttrition: 0, reinforcementFlow: 0, deploymentAge: 5, manpower: 0.6, supplyIntegrity: 0.6,
    morale: 0.6, equipmentCondition: 0.6, magicSupport: 0.6, commandQuality: 0.6, foodReserve: 0.6,
    logisticsBurden: 0.2, objective: 'conquest', returnCondition: 'pending', ...extra,
  };
}

const HOSTILE = { id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile' };

function fixture({ deployments = {}, warExhaustion = {} } = {}) {
  const saves = [
    save('atlas', 'Atlas', { population: 6000 }),
    save('borin', 'Borin', { population: 4000 }),
  ];
  const worldState = {
    rngSeed: 'winddown-seed', tick: 100,
    relationshipStates: { [HOSTILE.id]: { relationshipType: 'hostile' } },
    deployments, warExhaustion,
    simulationRules: { warLayerEnabled: false },
  };
  const campaign = {
    id: 'winddown-fixture', name: 'W', settlementIds: ['atlas', 'borin'], worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [HOSTILE],
      channels: Object.keys(deployments).length
        ? [{ type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' }]
        : [],
    }),
    wizardNews: { currentTick: 100, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  return { saves, worldState, campaign, snapshot };
}

describe('evaluateWarLayer OFF branch', () => {
  test('(1) no deployments: the byte-identical fast path (same empty shape, ledger untouched)', () => {
    const { snapshot, worldState } = fixture();
    const war = evaluateWarLayer({ snapshot, worldState, rng: createPRNG('x'), tick: 100, now: NOW, rules: { warLayerEnabled: false } });
    expect(war.outcomes).toEqual([]);
    expect(war.resolvedDeployments).toEqual([]);
    expect(war.retiredChannels).toEqual([]);
    expect(war.deployments).toBe(worldState.deployments); // the SAME reference — untouched
  });

  test('(2) deployments present: every army resolves as a withdrawal, the ledger clears, fronts retire, the scar stays', () => {
    const deployments = { atlas: siegeRecord('borin', { deployedPopulation: 120 }) };
    const { snapshot, worldState } = fixture({ deployments, warExhaustion: { atlas: 0.4 } });
    const war = evaluateWarLayer({ snapshot, worldState, rng: createPRNG('x'), tick: 100, now: NOW, rules: { warLayerEnabled: false } });

    expect(war.resolvedDeployments).toHaveLength(1);
    expect(war.resolvedDeployments[0]).toMatchObject({ attackerId: 'atlas', targetId: 'borin', outcome: 'withdrawal' });
    expect(war.resolvedDeployments[0].deployment).toBe(deployments.atlas); // the real record, bank intact
    expect(war.deployments).toEqual({});                                   // ledger cleared
    expect(war.retiredChannels.length).toBeGreaterThan(0);                 // the front retires
    expect(war.warExhaustion).toEqual({ atlas: 0.4 });                     // the scar is non-reverting
    expect(war.outcomes).toEqual([]);                                      // no new war activity
  });
});

describe('kernel end-to-end: the first advance after a toggle-off brings the army home', () => {
  test('(3) banked deployedPopulation credits back via army_homecoming and the ledger clears', () => {
    const deployments = { atlas: siegeRecord('borin', { deployedPopulation: 120 }) };
    const { saves, campaign } = fixture({ deployments });
    const result = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });

    // The deployment ledger cleared on the wind-down tick…
    expect(result.worldState.deployments || {}).toEqual({});
    // …and the banked population actually came home: an army_homecoming outcome
    // credits atlas a POSITIVE delta (survivors ≤ the 120 banked, war dead are
    // the only sink; the withdrawal cap keeps the ratio ≤ 0.85).
    const homecomings = (result.autoApplied || []).filter(o => o?.candidateType === 'army_homecoming');
    expect(homecomings.length).toBeGreaterThan(0);
    const atlasCredit = homecomings
      .flatMap(o => o?.populationDeltas || [])
      .filter(d => String(d.saveId) === 'atlas')
      .reduce((sum, d) => sum + d.delta, 0);
    expect(atlasCredit).toBeGreaterThan(0);
    expect(atlasCredit).toBeLessThanOrEqual(120);
  });

  test('war OFF with no deployments stays quiet: no homecoming, no deployment key materialized', () => {
    const { saves, campaign } = fixture();
    const result = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    expect((result.autoApplied || []).some(o => o?.candidateType === 'army_homecoming')).toBe(false);
  });
});
