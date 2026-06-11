/**
 * tests/domain/conditionDynamicsFlow.test.js — W5#5 cross-module flow.
 *
 * Severity dynamics are only honest if they FLOW: conditions are re-read on
 * every derivation, so a tick's severity nudge must surface in the causal
 * per-variable scan and in capacity trajectory without any extra wiring.
 *
 * Pins:
 *   - A worsening condition's severity climbs across ticks and the causal
 *     scan (which reads cond.severity fresh) scores the pressed variable
 *     lower after the tick.
 *   - The same worsening condition makes its fed capacity read 'worsening';
 *     an easing one falls and reads 'improving'.
 *   - The pre-expiry wind-down flips the story end to end: a worsening
 *     condition entering the window reads 'easing', so its capacity
 *     trajectory turns 'improving' before the condition expires.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveActiveCondition,
  SEVERITY_DRIFT_PER_TICK,
  withTickedConditionDurations,
} from '../../src/domain/activeConditions.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import { deriveCapacityProfile } from '../../src/domain/capacityModel.js';

const town = (conditions) => ({
  name: 'Flowtown',
  population: 2000,
  institutions: [],
  activeConditions: conditions,
});

describe('condition severity dynamics flow to consumers (W5#5)', () => {
  it('the causal per-variable scan picks up the nudged severity', () => {
    const plague = deriveActiveCondition({
      archetype: 'plague', severity: 0.6, status: 'worsening',
      duration: { elapsedTicks: 0, expiresAtTicks: 12 },
    });
    const before = town([plague]);
    const after = withTickedConditionDurations(before, 'one_month');

    // Derived from the live tuning table — the drift magnitude is
    // owner-adjustable; this pin asserts the MECHANISM, not the number.
    expect(after.activeConditions[0].severity)
      .toBeCloseTo(0.6 + SEVERITY_DRIFT_PER_TICK.worsening);
    // food_security's condition magnitude is Math.round(severity * 20), so
    // any positive drift crossing a 0.05 boundary scores the variable lower.
    expect(deriveCausalState(after).scores.food_security)
      .toBeLessThan(deriveCausalState(before).scores.food_security);
  });

  it('a worsening condition climbs across ticks and its capacity reads worsening', () => {
    let s = town([deriveActiveCondition({
      archetype: 'plague', severity: 0.6, status: 'worsening',
      duration: { elapsedTicks: 0, expiresAtTicks: 12 },
    })]);
    const severities = [s.activeConditions[0].severity];
    for (let i = 0; i < 3; i++) {
      s = withTickedConditionDurations(s, 'one_month');
      severities.push(s.activeConditions[0].severity);
    }
    for (let i = 1; i < severities.length; i++) {
      expect(severities[i]).toBeGreaterThan(severities[i - 1]);
    }
    expect(deriveCapacityProfile('healing', s).trajectory).toBe('worsening');
  });

  it('an easing condition falls across ticks and its capacity reads improving', () => {
    let s = town([deriveActiveCondition({
      archetype: 'plague', severity: 0.6, status: 'easing',
      duration: { elapsedTicks: 0, expiresAtTicks: 12 },
    })]);
    const before = s.activeConditions[0].severity;
    s = withTickedConditionDurations(s, 'one_month');
    expect(s.activeConditions[0].severity).toBeLessThan(before);
    expect(deriveCapacityProfile('healing', s).trajectory).toBe('improving');
  });

  it('the pre-expiry wind-down turns a worsening capacity story into an improving one', () => {
    const s0 = town([deriveActiveCondition({
      archetype: 'plague', severity: 0.6, status: 'worsening',
      duration: { elapsedTicks: 9, expiresAtTicks: 12 },
    })]);
    expect(deriveCapacityProfile('healing', s0).trajectory).toBe('worsening');

    const s1 = withTickedConditionDurations(s0, 'one_month'); // remaining 2 → wind-down
    expect(s1.activeConditions[0].status).toBe('easing');
    expect(s1.activeConditions[0].severity).toBeLessThan(0.6);
    expect(deriveCapacityProfile('healing', s1).trajectory).toBe('improving');
  });
});
