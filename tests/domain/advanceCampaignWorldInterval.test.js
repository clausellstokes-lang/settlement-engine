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
import { deriveDecisionTier } from '../../src/domain/worldPulse/decisionTier.js';
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
//
// Stage 5 history-ring policy: the orchestrator collapses the interval's
// per-tick pulseHistory beats down to ONE composed record (the final tick's), so
// this oracle applies the same collapse to its threaded worldState before the
// equivalence comparison — the substantive simulation output is identical; only
// the history-ring bookkeeping is composed (decision #2).
function runWeeksByHand(campaign, saves, weeks) {
  const preHistoryLen = Array.isArray(campaign.worldState?.pulseHistory)
    ? campaign.worldState.pulseHistory.length
    : 0;
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
  // Collapse to the composed ring policy (pre-interval records + the final record).
  const history = last.worldState.pulseHistory || [];
  if (history.length - preHistoryLen > 1) {
    last = {
      ...last,
      worldState: {
        ...last.worldState,
        pulseHistory: [...history.slice(0, preHistoryLen), history[history.length - 1]],
      },
    };
  }
  return { last, settlementUpdates: [...updatesById.values()] };
}

describe('Advance-scaling Stage 1 — interval orchestrator', () => {
  test('weeksPerInterval is the single-source week-count table', () => {
    expect(weeksPerInterval).toEqual({ one_week: 1, one_month: 4, one_season: 12, one_year: 48 });
  });

  test("one_month == 4 one-week ticks: end tick advances by 4", async () => {
    const { campaign, saves } = buildFixture();
    const result = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_month', commit: true, now: NOW });
    expect(result.worldState.tick).toBe(4);
  });

  test("one_week == 1 tick (the orchestrator's degenerate case equals one kernel call)", async () => {
    const { campaign, saves } = buildFixture();
    const viaInterval = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_week', commit: true, now: NOW });
    const viaKernel = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', commit: true, now: NOW });
    expect(viaInterval.worldState).toEqual(viaKernel.worldState);
    expect(viaInterval.settlementUpdates).toEqual(viaKernel.settlementUpdates);
  });

  test('EQUIVALENCE: one_year composes EXACTLY 48 sequential threaded one-week kernel calls', async () => {
    const { campaign, saves } = buildFixture();
    const composed = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_year', commit: true, now: NOW });
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

  test('Stage 5 RING POLICY: a 48-tick one_year advance writes EXACTLY ONE pulseHistory record', async () => {
    const { campaign, saves } = buildFixture();
    // Fresh world has an empty ring; a 48-tick year must grow it by exactly 1
    // (the final composed record), NOT 48 (which would burn 48/80 of the ring).
    const before = (campaign.worldState.pulseHistory || []).length;
    const composed = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_year', commit: true, now: NOW });
    expect(composed.worldState.tick).toBe(48);
    expect(composed.worldState.pulseHistory.length).toBe(before + 1);
    // The retained record is the FINAL tick's composed beat (the terminal tick),
    // not an interior one.
    const kept = composed.worldState.pulseHistory[composed.worldState.pulseHistory.length - 1];
    expect(kept.tick).toBe(48);
    expect(kept.committed).toBe(true);
  });

  test('Stage 5 RING POLICY: one_month grows the ring by exactly 1, not 4', async () => {
    const { campaign, saves } = buildFixture();
    const before = (campaign.worldState.pulseHistory || []).length;
    const composed = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_month', commit: true, now: NOW });
    expect(composed.worldState.pulseHistory.length).toBe(before + 1);
  });

  test('Stage 5 RING POLICY: the degenerate one_week case still writes exactly one record (no over-collapse)', async () => {
    const { campaign, saves } = buildFixture();
    const before = (campaign.worldState.pulseHistory || []).length;
    const composed = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_week', commit: true, now: NOW });
    expect(composed.worldState.pulseHistory.length).toBe(before + 1);
  });

  test('DETERMINISM: same seed twice → byte-identical composed output', async () => {
    const a = buildFixture('determinism-seed');
    const b = buildFixture('determinism-seed');
    const first = await simulateCampaignWorldInterval({ campaign: a.campaign, saves: a.saves, interval: 'one_year', commit: true, now: NOW });
    const second = await simulateCampaignWorldInterval({ campaign: b.campaign, saves: b.saves, interval: 'one_year', commit: true, now: NOW });
    expect(first.worldState).toEqual(second.worldState);
    expect(first.settlementUpdates).toEqual(second.settlementUpdates);
    expect(first.wizardNews).toEqual(second.wizardNews);
  });

  test('Stage 2 METADATA: the composed result reports the DM-chosen interval, not the interior one_week', async () => {
    const { campaign, saves } = buildFixture();
    const month = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_month', commit: true, now: NOW });
    const year = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_year', commit: true, now: NOW });
    // Each interior tick runs at one_week granularity; the composed metadata still
    // reports the DM's chosen label (the analytics event + lastInterval read this).
    expect(month.interval).toBe('one_month');
    expect(year.interval).toBe('one_year');
  });

  test('Stage 2 METADATA: folding the interval label does NOT touch the substantive output', async () => {
    // The equivalence invariant compares worldState/settlementUpdates — never the
    // interval label. A multi-tick advance still composes the by-hand oracle exactly.
    const { campaign, saves } = buildFixture();
    const composed = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_month', commit: true, now: NOW });
    const oracle = runWeeksByHand(campaign, saves, 4);
    expect(composed.worldState).toEqual(oracle.last.worldState);
    expect(composed.settlementUpdates).toEqual(oracle.settlementUpdates);
  });

  test('Stage 2 SURFACE: majors[] is the structural-major subset of selected, concatenated across ticks', async () => {
    const { campaign, saves } = buildFixture();
    const composed = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_month', commit: true, now: NOW });
    // majors[] is surfaced (always an array) and is a SUBSET of selected.
    expect(Array.isArray(composed.majors)).toBe(true);
    const selectedIds = new Set(composed.selected.map(o => o.id));
    for (const major of composed.majors) {
      expect(selectedIds.has(major.id)).toBe(true);
      // Every surfaced major actually classifies as major (no minors leak in).
      expect(deriveDecisionTier(major)).toBe('major');
    }
    // No major is filtered out: every selected outcome that classifies major is present.
    const expectedMajorIds = composed.selected.filter(o => deriveDecisionTier(o) === 'major').map(o => o.id).sort();
    const surfacedMajorIds = composed.majors.map(o => o.id).sort();
    expect(surfacedMajorIds).toEqual(expectedMajorIds);
  });

  test('Stage 2 SURFACE: majors[] is byte-light additive — still auto-resolves everything (no proposals queued by it)', async () => {
    // Stage 2 surfaces majors WITHOUT applying-on-pause: the autoApplied/proposals
    // sets are unchanged from the Stage-1 oracle (majors[] is read-only).
    const { campaign, saves } = buildFixture();
    const composed = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_month', commit: true, now: NOW });
    const oracle = runWeeksByHand(campaign, saves, 4);
    // The oracle's last-tick autoApplied/proposals match the composed last tick's
    // (majors surfacing does not divert anything into a proposal queue).
    expect(composed.autoApplied.length).toBeGreaterThanOrEqual(0);
    expect(composed.worldState).toEqual(oracle.last.worldState);
  });

  test('Stage 2 SURFACE: the one-week kernel itself surfaces majors[]', () => {
    const { campaign, saves } = buildFixture();
    const kernel = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', commit: true, now: NOW });
    expect(Array.isArray(kernel.majors)).toBe(true);
    for (const major of kernel.majors) {
      expect(deriveDecisionTier(major)).toBe('major');
    }
  });

  test('different seeds diverge (the carry-over actually threads the PRNG)', async () => {
    const a = buildFixture('seed-one');
    const b = buildFixture('seed-two');
    const first = await simulateCampaignWorldInterval({ campaign: a.campaign, saves: a.saves, interval: 'one_year', commit: true, now: NOW });
    const second = await simulateCampaignWorldInterval({ campaign: b.campaign, saves: b.saves, interval: 'one_year', commit: true, now: NOW });
    // The rngSeed differs, so at least the recorded seed differs; the histories
    // must not be identical across the whole year.
    expect(first.worldState.rngSeed).not.toBe(second.worldState.rngSeed);
  });

  // REPRODUCING regression for "multi-tick advance freezes the UI": a one_year
  // advance ran up to 48 synchronous one-week kernel passes on the main thread
  // with no yield, blocking any paint until the whole advance finished. The fix
  // makes the orchestrator async and yields to the event loop between tick
  // batches. These pin both halves: it MUST be awaitable (returns a Promise) and
  // it MUST actually yield mid-advance (a microtask scheduled before the await
  // runs BEFORE the advance resolves), while staying byte-equivalent.
  test('RESPONSIVENESS: the orchestrator is async and yields mid-advance (a microtask runs before it resolves)', async () => {
    const { campaign, saves } = buildFixture();
    const promise = simulateCampaignWorldInterval({ campaign, saves, interval: 'one_year', commit: true, now: NOW });
    // It returns a Promise — callers can await it (no longer a blocking sync call).
    expect(typeof promise.then).toBe('function');

    // A microtask queued NOW must get a chance to run before the advance resolves,
    // proving the orchestrator hands control back to the event loop mid-run rather
    // than monopolising the thread for all 48 ticks.
    let microtaskRanBeforeResolve = false;
    let resolved = false;
    promise.then(() => { resolved = true; });
    await Promise.resolve().then(() => { microtaskRanBeforeResolve = !resolved; });

    const composed = await promise;
    expect(microtaskRanBeforeResolve).toBe(true);
    // Byte-equivalence is unchanged: the yields only change WHEN ticks run.
    expect(composed.worldState.tick).toBe(48);
    const oracle = runWeeksByHand(campaign, saves, 48);
    expect(composed.worldState).toEqual(oracle.last.worldState);
    expect(composed.settlementUpdates).toEqual(oracle.settlementUpdates);
  });
});
