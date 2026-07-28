import { describe, expect, test } from 'vitest';

import { deriveActiveCondition } from '../../src/domain/activeConditions.js';
import { mobilizationEffects } from '../../src/domain/worldPulse/mobilizationEffects.js';
import { isPublicOutcome } from '../../src/domain/worldPulse/pulseHelpers.js';

function existingMobilization(severity) {
  return deriveActiveCondition({
    archetype: 'war_mobilization',
    severity,
    triggeredAt: {
      tick: 4,
      sourceEventType: 'WAR_LAYER_MOBILIZATION',
      sourceEventTargetId: 'a',
    },
  });
}

function snapshot(activeConditions = []) {
  return {
    byId: new Map([[
      'a',
      {
        name: 'Ashford',
        settlement: { activeConditions },
      },
    ]]),
    worldState: { relationshipStates: {} },
    regionalGraph: { edges: [] },
  };
}

function event(patch = {}) {
  return {
    id: 'a',
    prev: 'war_preparation',
    next: 'war_preparation',
    transitioned: false,
    cooled: false,
    covert: false,
    severity: 0.32,
    reasons: ['the threat persists'],
    ...patch,
  };
}

function outcomeFor(activeConditions, eventPatch = {}) {
  return mobilizationEffects({
    snapshot: snapshot(activeConditions),
    events: [event(eventPatch)],
    tick: 5,
    now: null,
  }).outcomes[0];
}

describe('war mobilization Chronicle classification', () => {
  test('an exact recurring posture and severity is state-only while its mechanics remain', () => {
    const outcome = outcomeFor([existingMobilization(0.32)]);

    expect(outcome).toMatchObject({
      candidateType: 'war_mobilization',
      recordMode: 'state_only',
      severity: 0.32,
      condition: {
        archetype: 'war_mobilization',
        severity: 0.32,
      },
    });
    expect(isPublicOutcome(outcome)).toBe(false);
  });

  test('onset, posture transition, and severity change remain public', () => {
    const onset = outcomeFor([]);
    const transition = outcomeFor(
      [existingMobilization(0.5)],
      {
        prev: 'war_preparation',
        next: 'mobilized',
        transitioned: true,
        severity: 0.5,
      },
    );
    const severityChange = outcomeFor(
      [existingMobilization(0.32)],
      { severity: 0.33 },
    );

    for (const outcome of [onset, transition, severityChange]) {
      expect(outcome.recordMode).toBeUndefined();
      expect(isPublicOutcome(outcome)).toBe(true);
    }
  });
});
