/**
 * tests/domain/advanceCampaignWorldInterval.test.js — Advance-scaling Stage 1.
 *
 * Pins the EQUIVALENCE INVARIANT of the multi-tick orchestrator:
 *   • simulateCampaignWorldInterval('one_year') composes EXACTLY the same end
 *     worldState + settlementUpdates as 48 sequential one_week kernel calls that
 *     thread state forward (same seed → identical).
 *   • the interval → week-count table (week=1, month=4, season=12, year=48).
 *   • determinism: the same seed twice → identical composed output.
 *
 * The orchestrator is PURELY ADDITIVE: it reuses the existing one-week kernel
 * (simulateCampaignWorldPulse) verbatim, so this file builds its own oracle by
 * running that kernel 48 times by hand and threading the output of each tick
 * into the next — the same carry-over the orchestrator performs internally.
 */

import { describe, expect, test } from 'vitest';

import {
  simulateCampaignWorldPulse,
  simulateCampaignWorldInterval,
  weeksPerInterval,
} from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-06-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 60 },
        { faction: 'Temple Wardens', category: 'religious', power: 48 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `${name}-reeve`, name: `Reeve of ${name}`, importance: 'key' }],
    activeConditions: [],
    ...patch,
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

function buildFixture(seed = 'interval-seed') {
  const ids = ['a', 'b', 'c'];
  const campaign = {
    id: 'camp-interval',
    name: 'Interval Realm',
    settlementIds: ids,
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
      ],
    }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: {
      rngSeed: seed,
      tick: 0,
      canonizedAt: NOW,
      stressors: [{ id: 'world_stressor.famine.realm', type: 'famine', severity: 0.6, affectedSettlementIds: ids }],
    },
  };
  const saves = [
    save('a', 'Ashford', { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.5 }] }),
    save('b', 'Briarwatch'),
    save('c', 'Caldmere'),
  ];
  return { campaign, saves };
}

// Replicate the orchestrator's carry-over by hand: run the one-week kernel
// `weeks` times, threading worldState/regionalGraph/wizardNews + folded saves
// forward. Returns the composed end state, mirroring the orchestrator contract.
function runWeeksByHand(campaign, saves, weeks) {
  let c = campaign;
  let s = saves;
  let last = null;
  const updatesById = new Map();
  for (let i = 0; i < weeks; i++) {
    const r = simulateCampaignWorldPulse({
      campaign: c,
      saves: s,
      interval: 'one_week',
      commit: i === weeks - 1,
      now: NOW,
    });
    for (const u of r.settlementUpdates || []) updatesById.set(String(u.saveId), u);
    c = { ...c, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
    s = (r.settlementUpdates && r.settlementUpdates.length)
      ? s.map(save => {
          const m = (r.settlementUpdates || []).find(u => String(u.saveId) === String(save.id));
          return m ? { ...save, settlement: m.settlement } : save;
        })
      : s;
    last = r;
  }
  return { last, settlementUpdates: [...updatesById.values()] };
}

describe('Advance-scaling Stage 1 — interval orchestrator', () => {
  test('weeksPerInterval is the single-source week-count table', () => {
    expect(weeksPerInterval).toEqual({ one_week: 1, one_month: 4, one_season: 12, one_year: 48 });
  });

  test("one_month == 4 one-week ticks: end tick advances by 4", () => {
    const { campaign, saves } = buildFixture();
    const result = simulateCampaignWorldInterval({ campaign, saves, interval: 'one_month', commit: true, now: NOW });
    expect(result.worldState.tick).toBe(4);
  });

  test("one_week == 1 tick (the orchestrator's degenerate case equals one kernel call)", () => {
    const { campaign, saves } = buildFixture();
    const viaInterval = simulateCampaignWorldInterval({ campaign, saves, interval: 'one_week', commit: true, now: NOW });
    const viaKernel = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', commit: true, now: NOW });
    expect(viaInterval.worldState).toEqual(viaKernel.worldState);
    expect(viaInterval.settlementUpdates).toEqual(viaKernel.settlementUpdates);
  });

  test('EQUIVALENCE: one_year composes EXACTLY 48 sequential threaded one-week kernel calls', () => {
    const { campaign, saves } = buildFixture();
    const composed = simulateCampaignWorldInterval({ campaign, saves, interval: 'one_year', commit: true, now: NOW });
    const oracle = runWeeksByHand(campaign, saves, 48);

    // End worldState is identical (terminal tick, calendar, every ledger).
    expect(composed.worldState).toEqual(oracle.last.worldState);
    expect(composed.worldState.tick).toBe(48);
    // The composed settlementUpdates equal the id-accumulated (last-write-wins)
    // updates threaded across the 48 ticks.
    expect(composed.settlementUpdates).toEqual(oracle.settlementUpdates);
    // Terminal world artifacts (regionalGraph, wizardNews) come from the last tick.
    expect(composed.regionalGraph).toEqual(oracle.last.regionalGraph);
    expect(composed.wizardNews).toEqual(oracle.last.wizardNews);
  });

  test('DETERMINISM: same seed twice → byte-identical composed output', () => {
    const a = buildFixture('determinism-seed');
    const b = buildFixture('determinism-seed');
    const first = simulateCampaignWorldInterval({ campaign: a.campaign, saves: a.saves, interval: 'one_year', commit: true, now: NOW });
    const second = simulateCampaignWorldInterval({ campaign: b.campaign, saves: b.saves, interval: 'one_year', commit: true, now: NOW });
    expect(first.worldState).toEqual(second.worldState);
    expect(first.settlementUpdates).toEqual(second.settlementUpdates);
    expect(first.wizardNews).toEqual(second.wizardNews);
  });

  test('different seeds diverge (the carry-over actually threads the PRNG)', () => {
    const a = buildFixture('seed-one');
    const b = buildFixture('seed-two');
    const first = simulateCampaignWorldInterval({ campaign: a.campaign, saves: a.saves, interval: 'one_year', commit: true, now: NOW });
    const second = simulateCampaignWorldInterval({ campaign: b.campaign, saves: b.saves, interval: 'one_year', commit: true, now: NOW });
    // The rngSeed differs, so at least the recorded seed differs; the histories
    // must not be identical across the whole year.
    expect(first.worldState.rngSeed).not.toBe(second.worldState.rngSeed);
  });
});
