import { describe, expect, test } from 'vitest';

import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { deploymentReturnOutcomes } from '../../src/domain/worldPulse/deploymentReturn.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

/**
 * War-economy P1 (flag-gated, default OFF): a deployed army conscripts real population
 * from its home each tick (a CONSERVED debit banked on the record's deployedPopulation),
 * and the SURVIVORS return home. The war dead (deployed − survivors) are the only sink,
 * so the books balance by construction. Proves: (1) OFF ⇒ no drain, no new field, no new
 * outcomes (byte-identity is also covered by the whole war/pause suite staying green);
 * (2) ON ⇒ the conscription debit exactly equals the headcount banked on the record;
 * (3) the homecoming credit is the survivor fraction, never more than was deployed.
 */
const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name, tier: patch.tier || 'city', population: patch.population || 22000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [], economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: [{ faction: 'Military Council', category: 'military', power: 78, isGoverning: true }],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }], activeConditions: [],
  };
}
const save = (id, name, patch = {}) => ({ id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
function siegeRecord(targetId, { age, strength }) {
  return {
    targetId, sinceTick: 0, role: 'siege', maxStartStrength: strength, currentEffectiveStrength: strength,
    accumulatedAttrition: 0, reinforcementFlow: 0, deploymentAge: age, manpower: 0.6, supplyIntegrity: 0.6,
    morale: 0.6, equipmentCondition: 0.6, magicSupport: 0.6, commandQuality: 0.6, foodReserve: 0.6,
    logisticsBurden: 0.2, objective: 'conquest', returnCondition: 'pending',
  };
}
const HOSTILE = { id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile' };

function evaluate({ warEconomy, tick, deployments }) {
  const saves = [save('atlas', 'Atlas', { population: 22000 }), save('borin', 'Borin', { population: 22000, legitimacy: 70 })];
  const rules = { warLayerEnabled: true, warEconomyDrainEnabled: warEconomy };
  const worldState = {
    rngSeed: 'we-seed', tick,
    relationshipStates: { [HOSTILE.id]: { relationshipType: 'hostile' } },
    deployments, warExhaustion: { atlas: 1.0 }, simulationRules: rules,
  };
  const campaign = {
    id: 'we-fixture', name: 'WE', settlementIds: saves.map(s => s.id), worldState,
    regionalGraph: ensureRegionalGraph({ edges: [HOSTILE], channels: [{ type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' }] }),
    wizardNews: { currentTick: tick, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  const war = evaluateWarLayer({ snapshot, worldState: snapshot.worldState, rng: createPRNG('we-seed'), tick, now: NOW, rules });
  return { war, snapshot };
}

// A plausible siege that HOLDS this tick (bottom-of-band strength) so the deployment
// persists into the Step-5 reinforcement/conscription loop.
const activeSiege = () => ({ atlas: siegeRecord('borin', { age: 5, strength: 50.9 }) });

describe('war-economy P1 — conserved conscription + homecoming', () => {
  test('flag OFF: no conscription, no deployedPopulation field, no war_conscription outcome', () => {
    const { war } = evaluate({ warEconomy: false, tick: 100, deployments: activeSiege() });
    expect(war.deployments.atlas?.deployedPopulation).toBeUndefined();
    expect(war.outcomes.some(o => o.candidateType === 'war_conscription')).toBe(false);
  });

  test('flag ON: the conscription debit EXACTLY equals the headcount banked on the record (conserved)', () => {
    const { war } = evaluate({ warEconomy: true, tick: 100, deployments: activeSiege() });
    const banked = war.deployments.atlas.deployedPopulation;
    expect(banked).toBeGreaterThan(0);
    const conscription = war.outcomes.find(o => o.candidateType === 'war_conscription');
    expect(conscription).toBeTruthy();
    const debit = -conscription.populationDeltas.find(d => d.saveId === 'atlas').delta;
    // First tick: the whole banked headcount is this tick's debit → they match exactly.
    expect(debit).toBe(banked);
    // Sanity: the debit is a real, floored fraction of the 22000 home (~0.6%).
    expect(debit).toBe(Math.round(22000 * 0.006));
  });

  test('conscription accumulates onto an already-banked headcount', () => {
    // A holding siege whose record already carries prior conscripts adds this tick's on top.
    const deployments = { atlas: { ...siegeRecord('borin', { age: 5, strength: 50.9 }), deployedPopulation: 500 } };
    const war = evaluate({ warEconomy: true, tick: 100, deployments }).war;
    expect(war.deployments.atlas.deployedPopulation).toBe(500 + Math.round(22000 * 0.006)); // 500 + 132
  });
});

describe('war-economy P1 — homecoming returns survivors, war dead are the only sink', () => {
  const snapshotWithHome = () => {
    const saves = [save('atlas', 'Atlas', { population: 5000 })];
    const worldState = { rngSeed: 'r', tick: 200, relationshipStates: {}, deployments: {}, simulationRules: { warLayerEnabled: true } };
    const campaign = { id: 'r', name: 'R', settlementIds: ['atlas'], worldState, regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }), wizardNews: { currentTick: 200, entries: [] } };
    return buildWorldSnapshot({ campaign, saves, worldState });
  };
  const returned = (deployedPopulation) => deploymentReturnOutcomes({
    resolvedDeployments: [{ attackerId: 'atlas', targetId: 'borin', outcome: 'withdrawal',
      deployment: { maxStartStrength: 100, currentEffectiveStrength: 60, ...(deployedPopulation != null ? { deployedPopulation } : {}) } }],
    snapshot: snapshotWithHome(), graph: ensureRegionalGraph({ edges: [], channels: [] }),
    rng: createPRNG('r'), tick: 200,
  });

  test('no banked headcount (flag-off worlds never bank): no homecoming credit', () => {
    expect(returned(null).some(o => o.candidateType === 'army_homecoming')).toBe(false);
  });

  test('a BANKED headcount is credited even if the drain flag is off at return time (the debit, not the live flag, gates the credit — conservation under mid-war flag changes / levy-without-drain)', () => {
    // deploymentReturnOutcomes takes no flag: the bank proves a debit happened.
    const hc = returned(1000).find(o => o.candidateType === 'army_homecoming');
    expect(hc).toBeTruthy();
    expect(hc.populationDeltas.find(d => d.saveId === 'atlas').delta).toBe(600);
  });

  test('survivors = round(deployed × strengthRatio), never more than deployed; the fallen are the sink', () => {
    const hc = returned(1000).find(o => o.candidateType === 'army_homecoming');
    expect(hc).toBeTruthy();
    const credit = hc.populationDeltas.find(d => d.saveId === 'atlas').delta;
    expect(credit).toBe(600);              // 1000 × (60/100)
    expect(credit).toBeLessThanOrEqual(1000);
    expect(hc.metadata.fell).toBe(400);    // the only population sink = the war dead
    expect(hc.metadata.survivors + hc.metadata.fell).toBe(1000); // conservation: nothing invented
  });
});
