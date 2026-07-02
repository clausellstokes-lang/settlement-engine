import { describe, expect, test } from 'vitest';

import { evaluateWarLayer, computeLevySources } from '../../src/domain/worldPulse/warDeployment.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

/**
 * War levy F2 (flag-gated, default OFF): a settlement fielding an army also levies men and
 * grain from its non-besieged vassal / allied neighbours — a CONSERVED transfer (the vassal's
 * men join the overlord's army, its granary feeds the war) at a LOYALTY cost (the vassal
 * accrues war-weariness → rebellion). Proves: (1) computeLevySources reads vassal/ally edges
 * and drops patrons / besieged / deploying sources; (2) flag-OFF the deployment is untouched
 * (byte-identical); (3) flag-ON the overlord's army grows by exactly what the vassal loses,
 * the granary transfer is conserved, and the vassal's war-weariness rises (the loyalty cost).
 */
const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name, tier: patch.tier || 'town', population: patch.population || 6000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: patch.granary ? [{ name: 'State Granary' }] : [],
    economicState: {
      prosperity: 'Prosperous', primaryExports: [], primaryImports: [],
      ...(patch.storageMonths != null ? { foodSecurity: { storageMonths: patch.storageMonths } } : {}),
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: [{ faction: 'Military Council', category: 'military', power: 70, isGoverning: true }],
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

// atlas besieges borin (a holding siege that persists into the levy loop) and holds a vassal, carth.
const HOSTILE = { id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile' };
const VASSAL = { id: 'edge.atlas.carth', from: 'atlas', to: 'carth', relationshipType: 'vassal' };
const CARTH_POP = 5000;

function evaluate(warLevy) {
  const saves = [
    save('atlas', 'Atlas', { tier: 'town', population: 6000, storageMonths: 2, granary: true }),
    save('borin', 'Borin', { tier: 'town', population: 4000 }),
    save('carth', 'Carth', { tier: 'village', population: CARTH_POP, storageMonths: 4, granary: true }),
  ];
  const rules = { warLayerEnabled: true, warLevyEnabled: warLevy };
  const worldState = {
    rngSeed: 'levy-seed', tick: 100,
    relationshipStates: { [HOSTILE.id]: { relationshipType: 'hostile' }, [VASSAL.id]: { relationshipType: 'vassal' } },
    deployments: { atlas: siegeRecord('borin', { age: 5, strength: 50.9 }) },
    warExhaustion: { atlas: 1.0 }, simulationRules: rules,
  };
  const campaign = {
    id: 'levy-fixture', name: 'L', settlementIds: ['atlas', 'borin', 'carth'], worldState,
    regionalGraph: ensureRegionalGraph({ edges: [HOSTILE, VASSAL], channels: [{ type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' }] }),
    wizardNews: { currentTick: 100, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  return evaluateWarLayer({ snapshot, worldState: snapshot.worldState, rng: createPRNG('levy-seed'), tick: 100, now: NOW, rules });
}

describe('computeLevySources', () => {
  const snap = (edges) => ({
    byId: new Map([['a', {}], ['b', {}], ['c', {}], ['p', {}]]),
    regionalGraph: { edges }, worldState: { relationshipStates: {} },
  });

  test('reads vassal + allied neighbours (symmetric), drops a patron edge', () => {
    const s = snap([
      { from: 'a', to: 'b', relationshipType: 'vassal' },
      { from: 'c', to: 'a', relationshipType: 'allied' },
      { from: 'a', to: 'p', relationshipType: 'patron' }, // you do NOT levy your overlord
    ]);
    expect(computeLevySources(s, 'a', new Set())).toEqual(['b', 'c']);
  });

  test('excludes a source that is itself besieged or deploying', () => {
    const s = snap([{ from: 'a', to: 'b', relationshipType: 'vassal' }, { from: 'a', to: 'c', relationshipType: 'allied' }]);
    expect(computeLevySources(s, 'a', new Set(['b']))).toEqual(['c']);
  });

  test('a lord with no vassals/allies levies no one', () => {
    expect(computeLevySources(snap([{ from: 'a', to: 'b', relationshipType: 'hostile' }]), 'a', new Set())).toEqual([]);
  });
});

describe('the levy rides a war_levy outcome', () => {
  test('flag OFF: no war_levy outcome, the deployment is untouched (byte-identical)', () => {
    const war = evaluate(false);
    expect(war.outcomes.some(o => o.candidateType === 'war_levy')).toBe(false);
    expect(war.deployments.atlas?.deployedPopulation).toBeUndefined();
  });

  test('flag ON: the overlord army grows by exactly what the vassal loses (conserved), grain transfers, loyalty erodes', () => {
    const war = evaluate(true);
    const levy = war.outcomes.find(o => o.candidateType === 'war_levy');
    expect(levy).toBeTruthy();
    // Men: a floored 0.4% of Carth's 5000 = 20, marched into Atlas's army.
    const levied = -levy.populationDeltas.find(d => d.saveId === 'carth').delta;
    expect(levied).toBe(Math.round(CARTH_POP * 0.004)); // 20
    expect(war.deployments.atlas.deployedPopulation).toBe(levied); // conserved: the army gained exactly the levy
    // The per-vassal headcount is banked alongside the aggregate, so the homecoming
    // can credit Carth's surviving men back to Carth (not silently to Atlas).
    expect(war.deployments.atlas.leviedPopulationBySource).toEqual({ carth: levied });
    // Grain: a conserved granary transfer Carth → Atlas (victor gains ≤ what the vassal lost).
    const foodLost = -levy.foodStockpileDeltas.find(d => d.saveId === 'carth').deltaMonths;
    const foodGain = levy.foodStockpileDeltas.find(d => d.saveId === 'atlas')?.deltaMonths || 0;
    expect(foodLost).toBeGreaterThan(0);
    expect(foodGain * 6000).toBeLessThanOrEqual(foodLost * CARTH_POP); // absolute food never minted
    // Loyalty cost: Carth accrues net war-weariness of exactly LEVY_STRAIN_PER_TICK.
    // The accrual is gross (0.05 strain + 0.03 same-tick-decay compensation) so step
    // 5b's decay nets it to the tunable, not 40% of it.
    expect(war.warExhaustion.carth).toBeCloseTo(0.05, 5);
  });
});
