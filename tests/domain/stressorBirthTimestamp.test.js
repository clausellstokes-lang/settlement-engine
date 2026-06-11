/**
 * tests/domain/stressorBirthTimestamp.test.js — triage pin (audit low).
 *
 * The pulse upsert used to overwrite stressor createdAt with `now` on every
 * escalation/spread, erasing the crisis birth time. The FIRST createdAt now
 * wins (the existing record's), while updatedAt moves with every touch.
 */

import { describe, expect, test } from 'vitest';

import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const STRESSOR_ID = 'world_stressor.famine.a';

function stressorOutcome(kind, severity, tick) {
  return {
    id: `candidate.stressor.${kind}.${STRESSOR_ID}.${tick}`,
    type: 'stressor',
    candidateType: `stressor_${kind}_famine`,
    ruleId: `stressor_${kind}_famine`,
    ruleFamily: 'stressor',
    applyMode: 'auto',
    targetSaveId: 'a',
    severity,
    headline: 'Famine pressure',
    stressor: {
      id: STRESSOR_ID,
      type: 'famine',
      severity,
      originSettlementId: 'a',
      affectedSettlementIds: ['a'],
    },
  };
}

function pulse({ worldState, outcome, tick, now }) {
  const graph = ensureRegionalGraph({}, { now });
  return applyWorldPulseOutcomes({
    snapshot: { regionalGraph: graph, settlements: [], campaign: {} },
    worldState,
    regionalGraph: graph,
    wizardNews: { currentTick: tick, entries: [] },
    settlementMap: new Map(),
    outcomes: [outcome],
    tick,
    now,
  });
}

describe('stressor birth timestamp survives the pulse upsert', () => {
  test('a stressor escalated across three ticks keeps its birth createdAt; updatedAt moves freely', () => {
    const birthNow = '2026-06-01T00:00:00.000Z';
    const secondNow = '2026-06-02T00:00:00.000Z';
    const thirdNow = '2026-06-03T00:00:00.000Z';

    let state = { stressors: [], npcStates: {}, proposals: [] };
    state = pulse({ worldState: state, outcome: stressorOutcome('birth', 0.6, 1), tick: 1, now: birthNow }).worldState;
    let record = state.stressors.find(s => s.id === STRESSOR_ID);
    expect(record.createdAt).toBe(birthNow);
    expect(record.updatedAt).toBe(birthNow);

    state = pulse({ worldState: state, outcome: stressorOutcome('escalate', 0.72, 2), tick: 2, now: secondNow }).worldState;
    record = state.stressors.find(s => s.id === STRESSOR_ID);
    expect(record.severity).toBe(0.72);
    expect(record.createdAt).toBe(birthNow); // birth time is sacred
    expect(record.updatedAt).toBe(secondNow);

    state = pulse({ worldState: state, outcome: stressorOutcome('escalate', 0.85, 3), tick: 3, now: thirdNow }).worldState;
    record = state.stressors.find(s => s.id === STRESSOR_ID);
    expect(record.severity).toBe(0.85);
    expect(record.createdAt).toBe(birthNow);
    expect(record.updatedAt).toBe(thirdNow);
  });
});
