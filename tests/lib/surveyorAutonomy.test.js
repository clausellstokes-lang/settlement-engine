/**
 * tests/lib/surveyorAutonomy.test.js — the S7 run orchestrator (SURVEYOR S7): the loop
 * consumes the injected REGISTERED advance op once per week, evaluates the pure wall at
 * every boundary, stops honestly on condition / cap / guard-refusal, and an invalid
 * condition NEVER drives an advance.
 */

import { describe, expect, test } from 'vitest';

import { runAutonomousAdvance } from '../../src/lib/surveyorAutonomy.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { autonomyFixture, NOW } from '../domain/autonomy/fixture.js';

/** Deps over the REAL one-week kernel: advance mutates a held fixture world. */
function kernelDeps() {
  const state = autonomyFixture();
  let wizardNews = state.campaign.wizardNews;
  let advances = 0;
  return {
    get advances() { return advances; },
    advance: async () => {
      advances += 1;
      const r = simulateCampaignWorldPulse({
        campaign: { ...state.campaign, wizardNews }, saves: state.saves, interval: 'one_week', now: NOW,
      });
      const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
      state.saves = state.saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
      state.campaign = { ...state.campaign, worldState: r.worldState, regionalGraph: r.regionalGraph };
      wizardNews = r.wizardNews;
      return { ok: true };
    },
    readCampaign: () => state.campaign,
    readSaves: () => state.saves,
  };
}

const tickCondition = (value) => ({
  version: 1, root: { kind: 'test', signalId: 'world.tick', test: { op: 'gte', value } },
});

describe('runAutonomousAdvance', () => {
  test('stops at the condition boundary with a fired receipt + progress per week', async () => {
    const deps = kernelDeps();
    const progress = [];
    const { receipt, stopped } = await runAutonomousAdvance({
      campaignId: 'c1', condition: tickCondition(2), maxWeeks: 8, deps,
      onProgress: (p) => progress.push(p.week),
    });
    expect(stopped).toBe('condition');
    expect(receipt.fired).toBe(true);
    expect(receipt.capped).toBe(false);
    expect(receipt.stopTick).toBe(2);
    expect(receipt.weeksAdvanced).toBe(2);
    expect(deps.advances).toBe(2);
    expect(progress).toEqual([1, 2]);
    expect(receipt.seed).toBe('s7-autonomy-seed');
  });

  test('caps honestly when the condition never fires', async () => {
    const deps = kernelDeps();
    const { receipt, stopped } = await runAutonomousAdvance({
      campaignId: 'c1', condition: tickCondition(9999), maxWeeks: 3, deps,
    });
    expect(stopped).toBe('cap');
    expect(receipt.capped).toBe(true);
    expect(receipt.weeksAdvanced).toBe(3);
    expect(deps.advances).toBe(3);
  });

  test('an INVALID condition never drives an advance (structurally dead)', async () => {
    const deps = kernelDeps();
    const { receipt, stopped } = await runAutonomousAdvance({
      campaignId: 'c1',
      condition: { version: 1, root: { kind: 'test', signalId: 'made.up', test: { op: 'gte', value: 1 } } },
      maxWeeks: 5, deps,
    });
    expect(stopped).toBe('invalid_condition');
    expect(receipt.weeksAdvanced).toBe(0);
    expect(deps.advances).toBe(0);
  });

  test('a store-guard refusal (frozen / paused / in-flight) stops the run honestly', async () => {
    const real = kernelDeps();
    let calls = 0;
    const deps = {
      advance: async () => { calls += 1; return calls >= 2 ? { ok: false, reason: 'world_frozen' } : real.advance(); },
      readCampaign: real.readCampaign, readSaves: real.readSaves,
    };
    const { receipt, stopped } = await runAutonomousAdvance({
      campaignId: 'c1', condition: tickCondition(9999), maxWeeks: 6, deps,
    });
    expect(stopped).toBe('advance_refused:world_frozen');
    expect(receipt.weeksAdvanced).toBe(1); // the week that succeeded before the refusal
    expect(receipt.capped).toBe(false);
    expect(receipt.fired).toBe(false);
  });

  test('the week budget re-clamps at the M10b cap', async () => {
    const deps = kernelDeps();
    const { receipt } = await runAutonomousAdvance({
      campaignId: 'c1', condition: tickCondition(1), maxWeeks: 999, deps,
    });
    expect(receipt.maxWeeks).toBe(26);
  });
});
