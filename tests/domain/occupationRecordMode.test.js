import { describe, expect, test } from 'vitest';

import {
  deriveActiveCondition,
  withActiveCondition,
  withTickedConditionDurations,
} from '../../src/domain/activeConditions.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { evaluateOccupations } from '../../src/domain/worldPulse/occupation.js';
import {
  recurringOccupationConditionRecordMode,
} from '../../src/domain/worldPulse/occupationRecordMode.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';

const NOW = '2026-01-01T00:00:00.000Z';
const OCCUPIER_ID = 'soak-c';
const OCCUPIED_ID = 'soak-b';

function settlement(name, {
  occupier = false,
  compliant = false,
  activeConditions = [],
} = {}) {
  return {
    name,
    tier: occupier ? 'city' : 'village',
    population: occupier ? 20000 : 1000,
    config: {
      tradeRouteAccess: 'road',
      priorityEconomy: 25,
      priorityMilitary: 35,
    },
    institutions: [],
    economicState: {
      prosperity: occupier ? 'Prosperous' : 'Modest',
      primaryExports: [],
      primaryImports: [],
    },
    powerStructure: {
      publicLegitimacy: { score: occupier ? 60 : 40, label: 'Stable' },
      factions: compliant
        ? [
            {
              faction: 'Occupation Authority',
              category: 'military',
              power: 90,
              modifiers: ['occupier'],
            },
            {
              faction: 'Council',
              category: 'civic',
              power: 20,
              isGoverning: true,
              modifiers: ['occupied'],
            },
          ]
        : [
            {
              faction: 'Council',
              category: 'civic',
              power: 60,
              isGoverning: true,
            },
          ],
      conflicts: [],
    },
    npcs: [],
    activeConditions,
  };
}

function save(id, name, value) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: value,
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function snapshotFor({
  occupierSettlement,
  occupiedSettlement,
  occupations = {},
  tick = 0,
}) {
  const saves = [
    save(OCCUPIER_ID, 'Conqueror', occupierSettlement),
    save(OCCUPIED_ID, 'Target', occupiedSettlement),
  ];
  const worldState = {
    rngSeed: 'occupation-record-mode',
    tick,
    simulationRules: { warLayerEnabled: true },
    ...(Object.keys(occupations).length ? { occupations } : {}),
  };
  const campaign = {
    id: 'occupation-record-mode',
    name: 'Occupation Record Mode',
    settlementIds: saves.map(item => item.id),
    worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [{
        id: `edge.${OCCUPIER_ID}.${OCCUPIED_ID}`,
        from: OCCUPIER_ID,
        to: OCCUPIED_ID,
        relationshipType: 'hostile',
      }],
      channels: [],
    }),
    wizardNews: { currentTick: tick, entries: [] },
  };
  return buildWorldSnapshot({ campaign, saves, worldState });
}

function occupationCondition(archetype, severity, target = OCCUPIER_ID) {
  return deriveActiveCondition({
    archetype,
    severity,
    ...(archetype === 'war_spoils' ? { status: 'easing' } : {}),
    triggeredAt: {
      tick: 7,
      sourceEventType: 'OCCUPATION_LAYER',
      sourceEventTargetId: target,
    },
  });
}

function settlementMapFor(snapshot) {
  return new Map(snapshot.settlements.map(item => [
    String(item.id),
    {
      saveId: String(item.id),
      save: item.save,
      settlement: item.settlement,
    },
  ]));
}

/**
 * A low-value village gives the fresh conquest the exact two-tick rung cadence
 * observed by the v4 diagnostic. Tick 8 reads the pre-conquest government; from
 * tick 9 onward the installed compliant authority suppresses resistance.
 */
function runOccupationTransitionSequence() {
  let occupierSettlement = settlement('Conqueror', { occupier: true });
  let occupiedSettlement = settlement('Target');
  let occupations = {};
  const records = [];
  const states = {};
  let stable = null;

  for (let tick = 8; tick <= 17; tick += 1) {
    if (tick === 9) occupiedSettlement = settlement('Target', { compliant: true });
    occupierSettlement = withTickedConditionDurations(occupierSettlement, 'one_week');
    const snapshot = snapshotFor({
      occupierSettlement,
      occupiedSettlement,
      occupations,
      tick: tick - 1,
    });
    const result = evaluateOccupations({
      snapshot,
      worldState: snapshot.worldState,
      graph: snapshot.regionalGraph,
      deployments: {},
      warOutcomes: tick === 8
        ? [{
            type: 'power_transfer',
            targetSaveId: OCCUPIED_ID,
            powerTransfer: { cause: 'conquest' },
            condition: { causes: [{ source: OCCUPIER_ID }] },
          }]
        : [],
      returnOutcomes: [],
      tick,
      rules: { warLayerEnabled: true },
    });
    states[tick] = result.occupations[OCCUPIED_ID]?.state || null;

    const aggregateOutcomes = result.outcomes.filter(outcome => (
      outcome.candidateType === 'occupation_burden'
      || outcome.candidateType === 'war_spoils'
    ));
    for (const outcome of aggregateOutcomes) {
      records.push({
        tick,
        type: outcome.candidateType,
        recordMode: outcome.recordMode,
      });
      occupierSettlement = withActiveCondition(occupierSettlement, outcome.condition);
    }
    if (tick === 17) stable = { snapshot, result, occupierSettlement, occupiedSettlement };
    occupations = result.occupations;
  }

  return { records, states, occupations, stable };
}

describe('occupation record mode — exact recurrence semantics', () => {
  test('only unchanged identity/context/band recurrence is state-only', () => {
    const priorCondition = occupationCondition('occupation_burden', 0.32);
    const occupierSettlement = settlement('Conqueror', {
      occupier: true,
      activeConditions: [priorCondition],
    });
    const occupiedSettlement = settlement('Target', { compliant: true });
    const previous = {
      old_target: {
        occupierId: OCCUPIER_ID,
        state: 'unstable',
        benefitYield: 0.1,
      },
    };
    const snapshot = snapshotFor({
      occupierSettlement,
      occupiedSettlement,
      occupations: previous,
      tick: 8,
    });
    const common = {
      snapshot,
      archetype: 'occupation_burden',
      targetSaveId: OCCUPIER_ID,
      previousOccupations: previous,
      previousProducerActive: true,
    };

    expect(recurringOccupationConditionRecordMode({
      ...common,
      severity: 0.31,
      nextOccupations: {
        old_target: {
          ...previous.old_target,
          resistance: 0.27,
          stateHeld: 1,
          lastTick: 9,
        },
      },
    })).toBe('state_only');

    // Same count, different occupied target: a real portfolio transition.
    expect(recurringOccupationConditionRecordMode({
      ...common,
      severity: 0.31,
      nextOccupations: {
        new_target: { ...previous.old_target },
      },
    })).toBeUndefined();

    // Same target, different state rung: the occupation state machine moved.
    expect(recurringOccupationConditionRecordMode({
      ...common,
      severity: 0.31,
      nextOccupations: {
        old_target: { ...previous.old_target, state: 'extractive' },
      },
    })).toBeUndefined();

    // Same target/rung, but a relevant severity-band crossing.
    expect(recurringOccupationConditionRecordMode({
      ...common,
      severity: 0.24,
      nextOccupations: previous,
    })).toBeUndefined();

    // A new producer run remains public even if a stale condition still exists.
    expect(recurringOccupationConditionRecordMode({
      ...common,
      severity: 0.31,
      nextOccupations: previous,
      previousProducerActive: false,
    })).toBeUndefined();
  });

  test('the observed cadence keeps only onset and exact rung/band transitions public', () => {
    const sequence = runOccupationTransitionSequence();
    expect(sequence.states).toMatchObject({
      8: 'contested',
      9: 'contested',
      10: 'unstable',
      11: 'unstable',
      12: 'extractive',
      13: 'extractive',
      14: 'stabilized',
      15: 'stabilized',
      16: 'vassalized',
      17: 'vassalized',
    });

    const publicTicks = type => sequence.records
      .filter(record => record.type === type && record.recordMode !== 'state_only')
      .map(record => record.tick);
    const stateOnlyTicks = type => sequence.records
      .filter(record => record.type === type && record.recordMode === 'state_only')
      .map(record => record.tick);

    expect(publicTicks('occupation_burden')).toEqual([8, 10, 12, 14, 16]);
    expect(publicTicks('war_spoils')).toEqual([10, 12, 14, 16]);
    expect(stateOnlyTicks('occupation_burden')).toEqual([9, 11, 13, 15, 17]);
    expect(stateOnlyTicks('war_spoils')).toEqual([11, 13, 15, 17]);
  });
});

describe('occupation record mode — state application and clearance', () => {
  test('state-only refreshes preserve exact condition application math', () => {
    const { stable } = runOccupationTransitionSequence();
    const outcomes = stable.result.outcomes.filter(outcome => (
      outcome.candidateType === 'occupation_burden'
      || outcome.candidateType === 'war_spoils'
    ));
    expect(outcomes).toHaveLength(2);
    expect(outcomes.every(outcome => outcome.recordMode === 'state_only')).toBe(true);

    const apply = nextOutcomes => applyWorldPulseOutcomes({
      snapshot: stable.snapshot,
      worldState: stable.snapshot.worldState,
      regionalGraph: stable.snapshot.regionalGraph,
      wizardNews: { currentTick: 17, entries: [] },
      settlementMap: settlementMapFor(stable.snapshot),
      outcomes: nextOutcomes,
      tick: 17,
      now: NOW,
      simulationRules: { warLayerEnabled: true },
    });
    const tagged = apply(outcomes);
    const untagged = apply(outcomes.map(({ recordMode: _recordMode, ...outcome }) => outcome));
    const stateProjection = result => result.settlementUpdates.map(update => ({
      saveId: update.saveId,
      settlement: update.settlement,
    }));

    expect(stateProjection(tagged)).toEqual(stateProjection(untagged));
  });

  test('the last occupation emits one public burden/spoils clearance without a state patch', () => {
    const sequence = runOccupationTransitionSequence();
    const snapshot = snapshotFor({
      occupierSettlement: sequence.stable.occupierSettlement,
      occupiedSettlement: sequence.stable.occupiedSettlement,
      occupations: sequence.occupations,
      tick: 17,
    });
    const cleared = evaluateOccupations({
      snapshot,
      worldState: snapshot.worldState,
      graph: snapshot.regionalGraph,
      deployments: {},
      warOutcomes: [],
      returnOutcomes: [{
        targetSaveId: OCCUPIED_ID,
        condition: { archetype: 'occupation_lifted' },
      }],
      tick: 18,
      rules: { warLayerEnabled: true },
    });

    expect(cleared.occupations).toEqual({});
    const clearances = cleared.outcomes.filter(outcome => (
      outcome.candidateType === 'occupation_burden_cleared'
      || outcome.candidateType === 'war_spoils_ended'
    ));
    expect(clearances.map(outcome => outcome.candidateType)).toEqual([
      'occupation_burden_cleared',
      'war_spoils_ended',
    ]);
    expect(clearances.every(outcome => (
      outcome.recordMode === undefined && outcome.condition === undefined
    ))).toBe(true);

    const applied = applyWorldPulseOutcomes({
      snapshot,
      worldState: snapshot.worldState,
      regionalGraph: snapshot.regionalGraph,
      wizardNews: { currentTick: 18, entries: [] },
      settlementMap: settlementMapFor(snapshot),
      outcomes: clearances,
      tick: 18,
      now: NOW,
      simulationRules: { warLayerEnabled: true },
    });
    const before = snapshot.byId.get(OCCUPIER_ID).settlement.activeConditions;
    const after = applied.settlementUpdates
      .find(update => String(update.saveId) === OCCUPIER_ID)
      ?.settlement?.activeConditions;
    expect(after).toEqual(before);

    const afterClearanceSnapshot = snapshotFor({
      occupierSettlement: sequence.stable.occupierSettlement,
      occupiedSettlement: sequence.stable.occupiedSettlement,
      occupations: {},
      tick: 18,
    });
    const quiet = evaluateOccupations({
      snapshot: afterClearanceSnapshot,
      worldState: afterClearanceSnapshot.worldState,
      graph: afterClearanceSnapshot.regionalGraph,
      deployments: {},
      warOutcomes: [],
      returnOutcomes: [],
      tick: 19,
      rules: { warLayerEnabled: true },
    });
    expect(quiet.outcomes.some(outcome => (
      outcome.candidateType === 'occupation_burden_cleared'
      || outcome.candidateType === 'war_spoils_ended'
    ))).toBe(false);
  });
});
