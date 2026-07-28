import { describe, expect, test } from 'vitest';

import { deriveActiveCondition } from '../../src/domain/activeConditions.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { evaluateWorldPulseRules } from '../../src/domain/worldPulse/candidateEvents.js';
import {
  classifyRecurringConditionCandidate,
  isConditionRefreshOptedIn,
  isPureConditionRefreshCandidate,
  recurringConditionRecordMode,
} from '../../src/domain/worldPulse/conditionRefreshRecordMode.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';

const STATIC_RULES = SIMULATION_RULE_PRESETS.static_campaign.rules;

function pressureCondition({
  severity = 0.6,
  status = 'stable',
  target = 'ashford',
  reason = 'Food capacity remains strained.',
  effect = 'food',
} = {}) {
  return deriveActiveCondition({
    archetype: 'famine',
    severity,
    status,
    duration: { elapsedTicks: 1, expiresAtTicks: 10 },
    triggeredAt: {
      tick: 3,
      sourceEventType: 'WORLD_PULSE_PRESSURE',
      sourceEventTargetId: target,
    },
    causes: [{ source: 'world_pulse', effect, reason }],
  });
}

function pressureCandidate({
  severity = 0.62,
  status = 'stable',
  target = 'ashford',
  reason = 'Food capacity remains strained.',
  effect = 'food',
  ...patch
} = {}) {
  return {
    id: 'candidate.condition.food.ashford.8',
    type: 'condition',
    candidateType: 'food_pressure',
    ruleId: 'organic_settlement_food_pressure',
    ruleFamily: 'organic_drift',
    targetSaveId: target,
    severity,
    probability: 0.3,
    applyMode: 'auto',
    headline: 'Famine pressure may take hold',
    summary: 'Ashford shows enough food pressure for a condition to emerge.',
    reasons: [reason],
    condition: {
      archetype: 'famine',
      severity,
      status,
      duration: { elapsedTicks: 0, expiresAtTicks: 10 },
      triggeredAt: {
        tick: 8,
        sourceEventType: 'WORLD_PULSE_PRESSURE',
        sourceEventTargetId: target,
      },
      causes: [{ source: 'world_pulse', effect, reason }],
    },
    metadata: { pressureKind: 'food', pressureScore: severity },
    conflictTags: [`settlement:${target}:organic:food`],
    ...patch,
  };
}

function snapshotWith(target, activeConditions = []) {
  const settlement = { activeConditions };
  const item = {
    id: target,
    name: target,
    settlement,
    activeConditions,
    causal: { scores: {} },
  };
  return {
    worldState: { proposals: [] },
    regionalGraph: ensureRegionalGraph({}),
    settlements: [item],
    byId: new Map([[target, item]]),
  };
}

function pressureRules(patch = {}) {
  return {
    ...STATIC_RULES,
    presetId: 'condition_refresh_test',
    emergentEventsEnabled: true,
    politicalAutonomy: 'routine',
    majorChangesRequireProposal: false,
    ...patch,
  };
}

function pressureFromRules(snapshot, score, rules = pressureRules()) {
  return evaluateWorldPulseRules(snapshot, {
    tick: 8,
    pressures: [{
      kind: 'food',
      settlementId: 'ashford',
      settlementName: 'Ashford',
      label: 'Food pressure',
      score,
      reasons: ['Food capacity remains strained.'],
    }],
    pressureIndex: new Map(),
    simulationRules: rules,
  }).find(candidate => candidate.candidateType === 'food_pressure');
}

function flowSnapshot({
  destinationConditions = [],
  strength = 0.5,
  stressors = [],
} = {}) {
  const supplierConditions = [{ archetype: 'trade_route_cut', severity: 0.6 }];
  const supplier = {
    id: 'supplier',
    name: 'Supplier',
    settlement: { population: 2_000, activeConditions: supplierConditions },
    activeConditions: supplierConditions,
    causal: { scores: { trade_connectivity: 25 } },
  };
  const buyer = {
    id: 'buyer',
    name: 'Buyer',
    settlement: { population: 1_500, activeConditions: destinationConditions },
    activeConditions: destinationConditions,
    causal: { scores: {} },
  };
  return {
    worldState: { proposals: [], stressors },
    regionalGraph: ensureRegionalGraph({
      channels: [{
        type: 'trade_dependency',
        from: 'supplier',
        to: 'buyer',
        status: 'confirmed',
        strength,
      }],
    }),
    settlements: [supplier, buyer],
    byId: new Map([['supplier', supplier], ['buyer', buyer]]),
  };
}

function flowRules(patch = {}) {
  return {
    ...STATIC_RULES,
    presetId: 'condition_refresh_flow_test',
    propagationMode: 'first_order',
    tradeFlowsEnabled: true,
    migrationFlowsEnabled: true,
    politicalAutonomy: 'routine',
    majorChangesRequireProposal: true,
    ...patch,
  };
}

function tradeShortageCondition({
  severity = 0.55,
  source = 'supplier',
} = {}) {
  return deriveActiveCondition({
    archetype: 'regional_import_shortage',
    severity,
    status: 'worsening',
    triggeredAt: {
      tick: 4,
      sourceEventType: 'WORLD_PULSE_FLOW_TRADE',
      sourceEventTargetId: source,
    },
    causes: [{
      source,
      effect: 'trade_scarcity_flow',
      reason: 'A trade-dependency supplier is in crisis.',
    }],
  });
}

describe('condition refresh record mode — exact persisted transition contract', () => {
  test('same identity, status, band, and causal facts is state-only despite tick, severity, and reason-prose drift', () => {
    const prior = pressureCondition({
      severity: 0.58,
      reason: 'The original pressure explanation.',
    });
    const candidate = pressureCandidate({
      severity: 0.67,
      reason: 'A newly worded explanation of the same pressure.',
    });
    const snapshot = snapshotWith('ashford', [prior]);

    expect(isConditionRefreshOptedIn(candidate)).toBe(true);
    expect(isPureConditionRefreshCandidate(candidate)).toBe(true);
    expect(recurringConditionRecordMode({ snapshot, candidate })).toBe('state_only');
    expect(classifyRecurringConditionCandidate(snapshot, candidate)).toMatchObject({
      id: candidate.id,
      recordMode: 'state_only',
      condition: candidate.condition,
    });
  });

  test('onset, exact-id change, status change, band change, and causal change stay public', () => {
    const candidate = pressureCandidate();
    expect(recurringConditionRecordMode({
      snapshot: snapshotWith('ashford'),
      candidate,
    })).toBeUndefined();

    const same = pressureCondition();
    expect(recurringConditionRecordMode({
      snapshot: snapshotWith('ashford', [{
        ...same,
        id: 'condition.famine.another_cause',
      }]),
      candidate,
    })).toBeUndefined();

    expect(recurringConditionRecordMode({
      snapshot: snapshotWith('ashford', [pressureCondition({ status: 'worsening' })]),
      candidate,
    })).toBeUndefined();

    expect(recurringConditionRecordMode({
      snapshot: snapshotWith('ashford', [pressureCondition({ severity: 0.24 })]),
      candidate,
    })).toBeUndefined();

    expect(recurringConditionRecordMode({
      snapshot: snapshotWith('ashford', [pressureCondition({ effect: 'rationing' })]),
      candidate,
    })).toBeUndefined();
  });

  test('proposals and every compound side-effect shape fail closed', () => {
    const snapshot = snapshotWith('ashford', [pressureCondition()]);
    const proposal = pressureCandidate({ applyMode: 'proposal' });
    expect(isPureConditionRefreshCandidate(proposal)).toBe(false);
    expect(classifyRecurringConditionCandidate(snapshot, proposal)).toBe(proposal);

    for (const patch of [
      { populationDeltas: [{ saveId: 'ashford', delta: -20 }] },
      { foodStockpileDeltas: [{ saveId: 'ashford', delta: -1 }] },
      { relationshipKey: 'edge.ashford.briar', relationshipPatch: { trust: 0.2 } },
      { npcPatch: { momentum: 0.2 } },
      { factionPatch: { power: 0.2 } },
      { institutionPatch: { id: 'watch' } },
      { powerTransfer: { toPowerName: 'Council' } },
      { proposalPayload: { kind: 'government_change' } },
      { affectedSettlementIds: ['ashford', 'briar'] },
      { partySourced: true },
    ]) {
      const compound = pressureCandidate(patch);
      expect(isPureConditionRefreshCandidate(compound)).toBe(false);
      expect(classifyRecurringConditionCandidate(snapshot, compound)).toBe(compound);
    }
  });

  test('war and occupation condition shapes are not opted in', () => {
    const snapshot = snapshotWith('ashford', [pressureCondition()]);
    for (const candidate of [
      pressureCandidate({
        id: 'world_outcome.war_drain.ashford.8',
        candidateType: 'war_drain',
        ruleFamily: 'stressor',
      }),
      pressureCandidate({
        id: 'world_outcome.occupation_burden.ashford.8',
        candidateType: 'occupation_burden',
        ruleFamily: 'stressor',
      }),
    ]) {
      expect(isConditionRefreshOptedIn(candidate)).toBe(false);
      expect(classifyRecurringConditionCandidate(snapshot, candidate)).toBe(candidate);
    }
  });
});

describe('condition refresh record mode — candidate seam integration', () => {
  test('pressure onset is public, exact repeat is state-only, and same-band status transition is public', () => {
    const onset = pressureFromRules(snapshotWith('ashford'), 0.6);
    expect(onset.recordMode).toBeUndefined();

    const repeat = pressureFromRules(
      snapshotWith('ashford', [pressureCondition({ severity: 0.58 })]),
      0.67,
    );
    expect(repeat).toMatchObject({ applyMode: 'auto', recordMode: 'state_only' });

    const transition = pressureFromRules(
      snapshotWith('ashford', [pressureCondition({ severity: 0.67, status: 'stable' })]),
      0.71,
    );
    expect(transition.condition.status).toBe('worsening');
    expect(transition.condition.severity).toBeLessThan(0.72);
    expect(transition.recordMode).toBeUndefined();
  });

  test('pressure candidates already proposal-routed at source remain public under dm-only', () => {
    const rules = pressureRules({
      politicalAutonomy: 'dm_only',
      majorChangesRequireProposal: true,
    });
    const repeat = pressureFromRules(
      snapshotWith('ashford', [pressureCondition()]),
      0.62,
      rules,
    );
    const onset = pressureFromRules(snapshotWith('ashford'), 0.62, rules);

    expect(repeat).toMatchObject({ applyMode: 'proposal' });
    expect(repeat.recordMode).toBeUndefined();
    expect(onset).toMatchObject({ applyMode: 'proposal' });
    expect(onset.recordMode).toBeUndefined();
  });

  test('trade-scarcity refresh is state-only, but onset and major proposal remain public', () => {
    const prior = tradeShortageCondition({ severity: 0.55 });
    const repeat = evaluateWorldPulseRules(
      flowSnapshot({ destinationConditions: [prior], strength: 0.5 }),
      {
        tick: 8,
        pressures: [],
        pressureIndex: new Map(),
        simulationRules: flowRules(),
      },
    ).find(candidate => candidate.candidateType === 'flow_trade_scarcity');
    expect(repeat).toMatchObject({ applyMode: 'auto', recordMode: 'state_only' });

    const onset = evaluateWorldPulseRules(flowSnapshot({ strength: 0.5 }), {
      tick: 8,
      pressures: [],
      pressureIndex: new Map(),
      simulationRules: flowRules(),
    }).find(candidate => candidate.candidateType === 'flow_trade_scarcity');
    expect(onset.recordMode).toBeUndefined();

    const major = evaluateWorldPulseRules(
      flowSnapshot({
        destinationConditions: [tradeShortageCondition({ severity: 0.64 })],
        strength: 0.8,
      }),
      {
        tick: 8,
        pressures: [],
        pressureIndex: new Map(),
        simulationRules: flowRules(),
      },
    ).find(candidate => candidate.candidateType === 'flow_trade_scarcity');
    expect(major).toMatchObject({ applyMode: 'proposal' });
    expect(major.recordMode).toBeUndefined();
  });

  test('flow migration and relationship condition candidates remain public', () => {
    const migration = {
      ...pressureCandidate({
        id: 'candidate.flow.migration.crisis.buyer.8',
        candidateType: 'flow_migration',
        ruleFamily: 'flow',
      }),
      populationDeltas: [
        { saveId: 'supplier', delta: -100 },
        { saveId: 'buyer', delta: 100 },
      ],
    };
    const relationship = {
      ...pressureCandidate({
        id: 'candidate.relationship.ally_burden.edge.8',
        candidateType: 'ally_burden',
        ruleFamily: 'relationship',
      }),
      relationshipKey: 'edge.supplier.buyer',
      relationshipPatch: { aidBurden: 0.4 },
    };
    const snapshot = snapshotWith('ashford', [pressureCondition()]);

    expect(isConditionRefreshOptedIn(migration)).toBe(false);
    expect(isPureConditionRefreshCandidate(migration)).toBe(false);
    expect(classifyRecurringConditionCandidate(snapshot, migration)).toBe(migration);
    expect(isConditionRefreshOptedIn(relationship)).toBe(false);
    expect(isPureConditionRefreshCandidate(relationship)).toBe(false);
    expect(classifyRecurringConditionCandidate(snapshot, relationship)).toBe(relationship);
  });
});
