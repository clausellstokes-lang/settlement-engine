/**
 * tests/domain/autonomy/autonomousRun.test.js — the bounded autonomous advance
 * (SURVEYOR S7): the cap consumes the owner-ruled M10b constant, the receipt carries
 * the stop story, and THE DETERMINISM PIN — the same seed + the same StopCondition,
 * advanced boundary-by-boundary through the REAL one-week pulse kernel, stops at the
 * SAME tick with a JSON-identical receipt, twice (op log + seed reproduce every
 * autonomous run — the S7 constitution).
 */

import { describe, expect, test } from 'vitest';

import {
  AUTONOMOUS_ADVANCE_CAP_WEEKS, clampAutonomousWeeks,
  autonomousRunReceipt, autonomousRunLogRecord,
} from '../../../src/domain/autonomy/autonomousRun.js';
import { CATCH_UP_CAP_WEEKS } from '../../../src/domain/worldPulse/simulationRules.js';
import { evaluateStopCondition } from '../../../src/domain/autonomy/stopConditions.js';
import { prepareSignalFrame } from '../../../src/domain/autonomy/signalRegistry.js';
import { simulateCampaignWorldPulse } from '../../../src/domain/worldPulse/index.js';
import { autonomyFixture, NOW } from './fixture.js';

describe('the cap', () => {
  test('AUTONOMOUS_ADVANCE_CAP_WEEKS consumes the owner-ruled M10b constant (26)', () => {
    expect(AUTONOMOUS_ADVANCE_CAP_WEEKS).toBe(CATCH_UP_CAP_WEEKS);
    expect(AUTONOMOUS_ADVANCE_CAP_WEEKS).toBe(26);
  });

  test('clampAutonomousWeeks: [1, cap], junk to 1', () => {
    expect(clampAutonomousWeeks(0)).toBe(1);
    expect(clampAutonomousWeeks(12)).toBe(12);
    expect(clampAutonomousWeeks(99)).toBe(AUTONOMOUS_ADVANCE_CAP_WEEKS);
    expect(clampAutonomousWeeks(Number.NaN)).toBe(1);
    expect(clampAutonomousWeeks('six')).toBe(1);
  });
});

describe('the receipt', () => {
  test('carries the stop story, frozen, with the condition described', () => {
    const receipt = autonomousRunReceipt({
      seed: 's7-seed', condition: { version: 1, label: 'the test', root: { kind: 'test', signalId: 'world.tick', test: { op: 'gte', value: 3 } } },
      fired: true, capped: false, startTick: 0, stopTick: 3, weeksAdvanced: 3, maxWeeks: 8,
      evaluations: [{ signalId: 'world.tick', settlementId: null, otherId: null, value: 3, pass: true }],
      at: NOW,
    });
    expect(receipt.kind).toBe('autonomous_advance');
    expect(receipt.seed).toBe('s7-seed');
    expect(receipt.engineVersion).toMatch(/^gen-.+\/sim-.+$/);
    expect(receipt.conditionLabel).toContain('world.tick');
    expect(receipt.fired).toBe(true);
    expect(receipt.stopTick).toBe(3);
    expect(Object.isFrozen(receipt)).toBe(true);
    expect(Object.isFrozen(receipt.evaluations)).toBe(true);

    const log = autonomousRunLogRecord(receipt);
    expect(log).toEqual({
      kind: 'autonomous_advance', engineVersion: receipt.engineVersion,
      fired: true, capped: false, weeksAdvanced: 3, maxWeeks: 8, testCount: 1,
    });
  });
});

/**
 * Drive the REAL one-week kernel up to maxWeeks, evaluating the condition at every
 * advance boundary — the exact loop src/lib/surveyorAutonomy.js runs, inlined here
 * against the pure kernel so determinism is proven engine-deep.
 */
function runLoop(condition, maxWeeks) {
  let { campaign, saves } = autonomyFixture();
  let wizardNews = campaign.wizardNews;
  let weeks = 0;
  let evaluation = { fired: false, evaluations: [], errors: [] };
  while (weeks < maxWeeks) {
    const r = simulateCampaignWorldPulse({ campaign: { ...campaign, wizardNews }, saves, interval: 'one_week', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph };
    wizardNews = r.wizardNews;
    weeks += 1;
    evaluation = evaluateStopCondition(condition, prepareSignalFrame({ campaign, saves }));
    if (evaluation.fired) break;
  }
  return autonomousRunReceipt({
    seed: String(campaign.worldState?.rngSeed || ''),
    condition,
    fired: evaluation.fired,
    capped: !evaluation.fired,
    startTick: 0,
    stopTick: Number(campaign.worldState?.tick || 0),
    weeksAdvanced: weeks,
    maxWeeks,
    evaluations: evaluation.evaluations,
    at: NOW,
  });
}

describe('THE DETERMINISM PIN — same seed + same condition ⇒ same stop tick', () => {
  test('a tick condition stops at its boundary: fires at tick 3, having advanced 3 weeks', () => {
    const condition = { version: 1, root: { kind: 'test', signalId: 'world.tick', test: { op: 'gte', value: 3 } } };
    const receipt = runLoop(condition, 8);
    expect(receipt.fired).toBe(true);
    expect(receipt.capped).toBe(false);
    expect(receipt.stopTick).toBe(3);
    expect(receipt.weeksAdvanced).toBe(3);
  });

  test('two identical runs produce JSON-identical receipts (a compound world condition)', () => {
    const condition = {
      version: 1,
      label: 'crisis or the cap',
      root: {
        kind: 'some',
        children: [
          { kind: 'test', signalId: 'causal.food_security.band', settlementId: 'bramwick', test: { in: ['critical', 'collapsed'] } },
          { kind: 'test', signalId: 'pressure.conflict', settlementId: 'ashford', test: { op: 'gte', value: 0.75 } },
        ],
      },
    };
    const first = runLoop(condition, 4);
    const second = runLoop(condition, 4);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(first.weeksAdvanced).toBeGreaterThanOrEqual(1);
    expect(first.weeksAdvanced).toBeLessThanOrEqual(4);
    expect(first.fired || first.capped).toBe(true);
  });

  test('a never-firing condition CAPS honestly: capped true, weeksAdvanced == maxWeeks', () => {
    const condition = { version: 1, root: { kind: 'test', signalId: 'world.tick', test: { op: 'gte', value: 9999 } } };
    const receipt = runLoop(condition, 3);
    expect(receipt.fired).toBe(false);
    expect(receipt.capped).toBe(true);
    expect(receipt.weeksAdvanced).toBe(3);
    expect(receipt.stopTick).toBe(3);
    expect(receipt.evaluations[0]).toMatchObject({ signalId: 'world.tick', value: 3, pass: false });
  });
});
