/**
 * worldTickCostEnvelope.test.js — performance-scale-6: the TICK-COST TREND GATE.
 *
 * The constitution machine-enforces first-paint BYTES (CLOSURE_BUDGET_BYTES) but,
 * before F5, nothing measured the OTHER axis the product lives on: per-tick cost and
 * serialized worldState/regionalGraph GROWTH over a long living-realm run. Findings
 * performance-scale-1/2/3/5 (age-linear graph cost, per-tick clone churn, memo
 * defeat, the uncapped roll ledger) were invisible precisely because no soak asserted
 * wall-time-per-tick or serialized-size trends. This gate closes that hole: it drives
 * a fixed 12-settlement, war-active fixture through 120 weekly kernel ticks and
 * asserts serialized size stays under a documented house envelope AND that growth
 * DECELERATES once the bounded ledgers (pulseHistory ring, queuedImpacts retention,
 * roll-explanation cap) engage — so a regression that reintroduces age-linear growth
 * fails here.
 *
 * The SIZE assertions are deterministic (byte counts, machine-independent) — they are
 * the real gate. The wall-time signal is REPORTED and bounded only by a generous
 * trend (machine-load tolerant; absolute ms budgets are not). Set
 * WORLD_TICK_COST_REPORT=1 to print the full per-run report.
 */
import { describe, expect, it } from 'vitest';
import { performance } from 'node:perf_hooks';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph, REGIONAL_TERMINAL_IMPACT_LIMIT } from '../../src/domain/region/index.js';

const NOW = '2026-04-04T00:00:00.000Z';
const SETTLEMENTS = 12;
const TICKS = 120;

// Documented house envelope (measured baseline + margin). Baseline on the CI-class
// dev machine: ~3.9MB at tick 60, ~5MB by tick 120, pulseHistory saturates at the
// MAX_HISTORY ring (80), queuedImpacts stays well under the retention cap at this
// horizon. Ceilings are generous (~1.5×) so machine noise never flakes them, but a
// gross size regression (an uncapped ledger, the roll cap removed) breaks through.
const SIZE_CEILING_AT_60 = 6_000_000;
const MAX_SIZE_CEILING = 8_000_000;

function settlement(name, seed) {
  return {
    name, tier: seed % 3 === 0 ? 'city' : 'town', population: 1500 + (seed % 5) * 500,
    config: { tradeRouteAccess: seed % 2 ? 'road' : 'remote', priorityEconomy: 20, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 26 + (seed % 4) * 6, label: 'Legitimacy Crisis' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 70 },
        { faction: 'Temple Wardens', category: 'religious', power: 50 },
      ],
      conflicts: [],
    },
    npcs: [
      { id: `reeve_${seed}`, name: `Reeve ${name}`, importance: 'key', faction: 'Merchant League' },
      { id: `captain_${seed}`, name: `Captain ${name}`, importance: 'notable', faction: 'Temple Wardens' },
    ],
    activeConditions: [],
  };
}
const save = (id, name, seed) => ({ id, name, phase: 'canon', settlement: settlement(name, seed), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

function buildFixture(n) {
  const ids = Array.from({ length: n }, (_, i) => `s${i}`);
  const saves = ids.map((id, i) => save(id, `Town-${i}`, i + 1));
  const channels = [];
  for (let i = 0; i + 1 < n; i++) {
    channels.push({ type: 'trade_dependency', from: ids[i], to: ids[i + 1], status: 'confirmed' });
    if (i % 3 === 0) channels.push({ type: 'political_authority', from: ids[i], to: ids[(i + 2) % n], status: 'confirmed' });
    if (i % 4 === 0) channels.push({ type: 'military_protection', from: ids[(i + 1) % n], to: ids[i], status: 'confirmed' });
  }
  return {
    campaign: {
      id: 'tick-cost-bench', name: 'Tick Cost Bench', settlementIds: ids,
      regionalGraph: ensureRegionalGraph({ channels }),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: {
        rngSeed: 'tick-cost-bench-seed', tick: 0, canonizedAt: NOW,
        stressors: [{ id: 'world_stressor.siege.s0', type: 'siege', severity: 0.8, affectedSettlementIds: ['s0'] }],
      },
    },
    saves,
  };
}

function runSoak(n, ticks) {
  let { campaign, saves } = buildFixture(n);
  const sizes = [];
  const times = [];
  let maxImpacts = 0;
  let maxHistory = 0;
  for (let t = 0; t < ticks; t++) {
    const t0 = performance.now();
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', commit: true, now: NOW });
    times.push(performance.now() - t0);
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
    if (Array.isArray(r.settlementUpdates)) {
      const byId = new Map(r.settlementUpdates.map(u => [String(u.saveId), u.settlement]));
      saves = saves.map(s => (byId.has(String(s.id)) ? { ...s, settlement: byId.get(String(s.id)) } : s));
    }
    sizes.push(JSON.stringify(r.worldState).length + JSON.stringify(r.regionalGraph).length);
    maxImpacts = Math.max(maxImpacts, (r.regionalGraph.queuedImpacts || []).length);
    maxHistory = Math.max(maxHistory, (r.worldState.pulseHistory || []).length);
  }
  return { sizes, times, maxImpacts, maxHistory, finalTick: campaign.worldState.tick };
}

describe('performance-scale-6 — tick-cost / size envelope gate', () => {
  it('serialized state stays under the house envelope and growth decelerates as the bounded ledgers engage', () => {
    const { sizes, times, maxImpacts, maxHistory } = runSoak(SETTLEMENTS, TICKS);
    const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    // 1. House-envelope CEILING at the specified 60-tick point (deterministic).
    expect(sizes[59]).toBeLessThan(SIZE_CEILING_AT_60);
    // 2. Max serialized size over the whole run is bounded.
    expect(Math.max(...sizes)).toBeLessThan(MAX_SIZE_CEILING);

    // 3. The persisted ledgers are BOUNDED — the growth vectors F5 capped.
    expect(maxHistory).toBeLessThanOrEqual(80);                             // MAX_HISTORY ring
    expect(maxImpacts).toBeLessThanOrEqual(REGIONAL_TERMINAL_IMPACT_LIMIT + 120); // + queued headroom

    // 4. GROWTH DECELERATES: the bytes ADDED in the final third of the run are LESS
    // than the bytes added in the first third — the signature of bounded ledgers
    // (pulseHistory ring saturates, impacts retention caps). A regression that
    // reintroduces age-linear growth would keep the last third ≥ the first, failing here.
    const third = Math.floor(TICKS / 3);
    const firstThirdGrowth = sizes[third - 1] - sizes[0];
    const lastThirdGrowth = sizes[TICKS - 1] - sizes[TICKS - third];
    expect(lastThirdGrowth).toBeLessThan(firstThirdGrowth);

    // 5. WALL-TIME (machine-tolerant): the per-tick mean must not EXPLODE with age.
    // Generous 10× trend bound — a bounded-cost tick is roughly flat; an age-linear
    // regression (re-normalizing an ever-growing ledger) blows the trend.
    const q = (arr, a, b) => mean(arr.slice(Math.floor(arr.length * a), Math.floor(arr.length * b)));
    const timeQ1 = q(times, 0, 0.25);
    const timeQ4 = q(times, 0.75, 1);
    expect(timeQ4).toBeLessThan(timeQ1 * 10 + 5);

    if (process.env.WORLD_TICK_COST_REPORT === '1') {
      console.log(JSON.stringify({
        settlements: SETTLEMENTS, ticks: TICKS,
        sizeAt60: sizes[59], maxSize: Math.max(...sizes), finalSize: sizes[sizes.length - 1],
        maxHistory, maxImpacts,
        firstThirdGrowth, lastThirdGrowth,
        meanTickMs: Number(mean(times).toFixed(3)), timeQ1Ms: Number(timeQ1.toFixed(3)), timeQ4Ms: Number(timeQ4.toFixed(3)),
      }, null, 2));
    }
  }, 60_000);
});
