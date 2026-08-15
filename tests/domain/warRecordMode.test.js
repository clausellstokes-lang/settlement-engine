import { describe, expect, test } from 'vitest';

import { deriveActiveCondition } from '../../src/domain/activeConditions.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { recurringWarConditionRecordMode } from '../../src/domain/worldPulse/warRecordMode.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';
const HOSTILE = { id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile' };

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'city',
    population: patch.population || 22000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: [{ faction: 'Military Council', category: 'military', power: 78, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: settlement(name, patch),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function siegeRecord(patch = {}) {
  return {
    targetId: 'borin',
    sinceTick: 0,
    role: 'siege',
    maxStartStrength: 50.9,
    currentEffectiveStrength: 50.9,
    accumulatedAttrition: 0,
    reinforcementFlow: 0,
    deploymentAge: 5,
    manpower: 0.6,
    supplyIntegrity: 0.6,
    morale: 0.6,
    equipmentCondition: 0.6,
    magicSupport: 0.6,
    commandQuality: 0.6,
    foodReserve: 0.6,
    logisticsBurden: 0.2,
    objective: 'conquest',
    returnCondition: 'pending',
    ...patch,
  };
}

function warCondition(archetype, severity, sourceEventTargetId) {
  return deriveActiveCondition({
    archetype,
    severity,
    triggeredAt: {
      tick: 99,
      sourceEventType: 'WAR_LAYER',
      sourceEventTargetId,
    },
  });
}

function conditionSnapshot(activeConditions = []) {
  return {
    byId: new Map([[
      'atlas',
      { settlement: { activeConditions } },
    ]]),
  };
}

function evaluateExisting({
  activeConditions = [],
  deployments = { atlas: siegeRecord() },
  warExhaustion = { atlas: 1 },
  rulesPatch = {},
  homePatch = {},
  targetPatch = {},
  rngSeed = 'we-seed',
} = {}) {
  const saves = [
    save('atlas', 'Atlas', { ...homePatch, activeConditions }),
    save('borin', 'Borin', { legitimacy: 70, ...targetPatch }),
  ];
  const rules = { warLayerEnabled: true, warEconomyDrainEnabled: true, ...rulesPatch };
  const worldState = {
    rngSeed,
    tick: 100,
    relationshipStates: { [HOSTILE.id]: { relationshipType: 'hostile' } },
    deployments,
    warExhaustion,
    simulationRules: rules,
  };
  const campaign = {
    id: 'war-record-mode',
    name: 'War Record Mode',
    settlementIds: saves.map(item => item.id),
    worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [HOSTILE],
      channels: Object.keys(deployments).length
        ? [{ type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' }]
        : [],
    }),
    wizardNews: { currentTick: 100, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  const war = evaluateWarLayer({
    snapshot,
    worldState: snapshot.worldState,
    rng: createPRNG(rngSeed),
    tick: 100,
    now: NOW,
    rules,
  });
  return { war, snapshot, rules };
}

describe('war record mode — persisted condition transitions', () => {
  const args = {
    archetype: 'war_drain',
    targetSaveId: 'atlas',
    severity: 0.46,
    sourceEventTargetId: 'borin',
  };

  test('onset, target change, and severity-band change stay Chronicle-eligible', () => {
    expect(recurringWarConditionRecordMode({
      snapshot: conditionSnapshot(),
      ...args,
    })).toBeUndefined();

    expect(recurringWarConditionRecordMode({
      snapshot: conditionSnapshot([warCondition('war_drain', 0.4, 'other-front')]),
      ...args,
    })).toBeUndefined();

    expect(recurringWarConditionRecordMode({
      snapshot: conditionSnapshot([warCondition('war_drain', 0.24, 'borin')]),
      ...args,
    })).toBeUndefined();
  });

  test('only the exact persisted condition identity in the same band is state-only', () => {
    for (const [archetype, severity, sourceEventTargetId] of [
      ['war_drain', 0.46, 'borin'],
      ['army_deployed', 0.5, 'borin'],
      ['reinforcement_cost', 0.33, 'borin'],
      ['war_exhaustion', 0.67, 'atlas'],
    ]) {
      const previous = warCondition(archetype, severity, sourceEventTargetId);
      expect(recurringWarConditionRecordMode({
        snapshot: conditionSnapshot([previous]),
        archetype,
        targetSaveId: 'atlas',
        severity,
        sourceEventTargetId,
      })).toBe('state_only');

      // A persisted condition carrying another stable ID is another causal
      // condition, even if its prose-facing fields happen to match.
      expect(recurringWarConditionRecordMode({
        snapshot: conditionSnapshot([{ ...previous, id: `condition.${archetype}.another_cause` }]),
        archetype,
        targetSaveId: 'atlas',
        severity,
        sourceEventTargetId,
      })).toBeUndefined();
    }
  });

  test('first recovery is visible; later same-band recovery refresh is state-only', () => {
    const prior = {
      ...warCondition('war_exhaustion', 0.65, 'atlas'),
      causes: [{ source: 'atlas', effect: 'war_exhaustion' }],
    };
    const first = evaluateExisting({
      activeConditions: [prior],
      deployments: { atlas: siegeRecord({ recalled: true }) },
      warExhaustion: { atlas: 0.7 },
    }).war.outcomes.find(outcome => outcome.candidateType === 'war_exhaustion');
    const later = evaluateExisting({
      activeConditions: [prior],
      deployments: {},
      warExhaustion: { atlas: 0.7 },
    }).war.outcomes.find(outcome => outcome.candidateType === 'war_exhaustion');

    expect(first.severity).toBeCloseTo(0.67, 10);
    expect(first.recordMode).toBeUndefined();
    expect(later.severity).toBeCloseTo(0.67, 10);
    expect(later.recordMode).toBe('state_only');
  });

  test('a levied vassal gets one visible recovery beat before same-band refreshes hide', () => {
    const prior = {
      ...warCondition('war_exhaustion', 0.65, 'atlas'),
      causes: [{ source: 'atlas', effect: 'war_levy_exhaustion' }],
    };
    const recovering = {
      ...args,
      archetype: 'war_exhaustion',
      severity: 0.62,
      sourceEventTargetId: 'atlas',
      incomingCauseEffect: 'war_exhaustion',
    };
    expect(recurringWarConditionRecordMode({
      snapshot: conditionSnapshot([prior]),
      ...recovering,
    })).toBeUndefined();
    expect(recurringWarConditionRecordMode({
      snapshot: conditionSnapshot([{
        ...prior,
        causes: [{ source: 'atlas', effect: 'war_exhaustion' }],
      }]),
      ...recovering,
    })).toBe('state_only');
  });

  test('a renewed levy is visible before same-context levy refreshes hide', () => {
    const incoming = {
      ...args,
      archetype: 'war_exhaustion',
      severity: 0.62,
      sourceEventTargetId: 'atlas',
      incomingCauseEffect: 'war_levy_exhaustion',
    };
    const ordinary = {
      ...warCondition('war_exhaustion', 0.65, 'atlas'),
      causes: [{ source: 'atlas', effect: 'war_exhaustion' }],
    };
    const levied = {
      ...ordinary,
      causes: [{ source: 'atlas', effect: 'war_levy_exhaustion' }],
    };
    expect(recurringWarConditionRecordMode({
      snapshot: conditionSnapshot([ordinary]),
      ...incoming,
    })).toBeUndefined();
    expect(recurringWarConditionRecordMode({
      snapshot: conditionSnapshot([levied]),
      ...incoming,
    })).toBe('state_only');
  });

  test('crossing below the exhaustion floor emits one public clearance receipt', () => {
    const prior = warCondition('war_exhaustion', 0.21, 'atlas');
    const war = evaluateExisting({
      activeConditions: [prior],
      deployments: {},
      warExhaustion: { atlas: 0.21 },
    }).war;
    const clearance = war.outcomes.find(outcome => (
      outcome.candidateType === 'war_exhaustion_cleared'
    ));
    expect(war.warExhaustion.atlas).toBeCloseTo(0.18, 10);
    expect(clearance).toMatchObject({
      targetSaveId: 'atlas',
      applyMode: 'auto',
    });
    expect(clearance.recordMode).toBeUndefined();
    expect(clearance.condition).toBeUndefined();
    expect(war.outcomes.some(outcome => outcome.candidateType === 'war_exhaustion'))
      .toBe(false);
  });

  test('the evaluator wires stable drain and reinforcement refreshes into the state-only lane', () => {
    const common = {
      homePatch: { population: 45000 },
      targetPatch: { tier: 'town', population: 5000 },
      warExhaustion: { atlas: 0.2 },
      rngSeed: 'a',
    };
    const stableDrain = evaluateExisting({
      ...common,
      activeConditions: [warCondition('war_drain', 0.4, 'borin')],
    }).war.outcomes.find(outcome => outcome.candidateType === 'war_drain');
    const changedBand = evaluateExisting({
      ...common,
      activeConditions: [warCondition('war_drain', 0.24, 'borin')],
    }).war.outcomes.find(outcome => outcome.candidateType === 'war_drain');
    const changedTarget = evaluateExisting({
      ...common,
      activeConditions: [warCondition('war_drain', 0.4, 'another-front')],
    }).war.outcomes.find(outcome => outcome.candidateType === 'war_drain');
    const stableReinforcement = evaluateExisting({
      activeConditions: [warCondition('reinforcement_cost', 0.33, 'borin')],
    }).war.outcomes.find(outcome => outcome.candidateType === 'reinforcement_cost');

    expect(stableDrain.recordMode).toBe('state_only');
    expect(changedBand.recordMode).toBeUndefined();
    expect(changedTarget.recordMode).toBeUndefined();
    expect(stableReinforcement.recordMode).toBe('state_only');
  });
});

describe('war record mode — state application parity', () => {
  test('same-band condition refreshes and recurring conscription retain exact state math', () => {
    const activeArmy = warCondition('army_deployed', 0.5, 'borin');
    const { war, snapshot, rules } = evaluateExisting({ activeConditions: [activeArmy] });
    const conscription = war.outcomes.find(outcome => outcome.candidateType === 'war_conscription');
    const army = war.outcomes.find(outcome => outcome.candidateType === 'army_deployed');
    const reinforcement = war.outcomes.find(outcome => outcome.candidateType === 'reinforcement_cost');

    expect(war.deployments.atlas.deploymentAge).toBe(6);
    expect(conscription.recordMode).toBe('state_only');
    expect(army.recordMode).toBe('state_only');
    expect(reinforcement.recordMode).toBeUndefined();
    expect(-conscription.populationDeltas[0].delta)
      .toBe(war.deployments.atlas.deployedPopulation);

    const settlementMap = () => new Map(snapshot.settlements.map(item => [
      String(item.id),
      { saveId: String(item.id), settlement: item.settlement },
    ]));
    const apply = outcomes => applyWorldPulseOutcomes({
      snapshot,
      worldState: snapshot.worldState,
      regionalGraph: snapshot.regionalGraph,
      settlementMap: settlementMap(),
      outcomes,
      tick: 100,
      now: NOW,
      simulationRules: rules,
    });
    const tagged = apply(war.outcomes);
    const untagged = apply(war.outcomes.map(({ recordMode: _recordMode, ...outcome }) => outcome));
    const stateProjection = result => result.settlementUpdates.map(update => ({
      saveId: update.saveId,
      population: update.settlement.population,
      activeConditions: update.settlement.activeConditions,
    }));

    expect(stateProjection(tagged)).toEqual(stateProjection(untagged));
  });
});
