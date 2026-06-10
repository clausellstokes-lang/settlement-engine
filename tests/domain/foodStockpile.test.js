/**
 * tests/domain/foodStockpile.test.js — the granary moves.
 *
 * Pins the three qualifiers:
 *   • surplus fills storage, capped by granary infrastructure;
 *   • a MILD deficit with low stores keeps a reserve tithe flowing INTO
 *     storage, visibly deepening the effective deficit;
 *   • a real deficit draws stored food down — rationed (targets the
 *     'Pressured' band, never spends more than half the stores per tick).
 * Plus the coupling and bookkeeping rules:
 *   • an active siege cuts the import share of need, so the blockade eats
 *     the granary tick over tick;
 *   • relief never compounds — the structural deficit is re-derived from
 *     the stashed base every tick;
 *   • settlements without a generated food ledger are untouched.
 */

import { describe, expect, test } from 'vitest';
import {
  advanceFoodStockpile,
  blockadeFor,
  famineFor,
  storageCapacityMonths,
  STOCKPILE_TUNING,
} from '../../src/domain/worldPulse/foodStockpile.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

function settlementWith({ foodSecurity, institutions = [], tier = 'town' } = {}) {
  return {
    name: 'Ashford',
    tier,
    population: 2000,
    institutions,
    economicState: foodSecurity ? { foodSecurity } : {},
    activeConditions: [],
  };
}

const GRANARY = { id: 'granary', name: 'Old Granary' };

describe('storageCapacityMonths()', () => {
  test('mirrors the generator tier table', () => {
    expect(storageCapacityMonths(settlementWith({ institutions: [{ name: 'State Granary' }], tier: 'metropolis' }))).toBe(12);
    expect(storageCapacityMonths(settlementWith({ institutions: [GRANARY], tier: 'town' }))).toBe(5);
    expect(storageCapacityMonths(settlementWith({ institutions: [], tier: 'town' }))).toBe(2);
    expect(storageCapacityMonths(settlementWith({ institutions: [GRANARY, { name: 'Grist Mill' }], tier: 'town' }))).toBeCloseTo(6.3, 5);
  });
});

describe('advanceFoodStockpile()', () => {
  test('surplus fills storage toward the cap', () => {
    const s = settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 0, surplusPct: 30, storageMonths: 1, importDependency: 0.1 },
    });
    const { settlement, summary } = advanceFoodStockpile(s, { interval: 'one_month', tick: 1 });
    // +1 month × 30% surplus × 0.6 fill = +0.18 months
    expect(summary.storageMonths).toBeCloseTo(1.2, 1);
    expect(settlement.economicState.foodSecurity.deficitPct).toBe(0);
  });

  test('storage never exceeds the granary capacity', () => {
    const s = settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 0, surplusPct: 60, storageMonths: 4.9, importDependency: 0 },
    });
    let cur = s;
    for (let tick = 1; tick <= 10; tick++) {
      cur = advanceFoodStockpile(cur, { interval: 'one_season', tick }).settlement || cur;
    }
    expect(cur.economicState.foodSecurity.storageMonths).toBeLessThanOrEqual(5);
  });

  test('mild deficit + empty granary: the reserve tithe deepens the visible deficit', () => {
    const s = settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 12, surplusPct: 0, storageMonths: 0.2, importDependency: 0.2 },
    });
    const { settlement, summary } = advanceFoodStockpile(s, { interval: 'one_month', tick: 1 });
    expect(summary.tithed).toBe(true);
    expect(settlement.economicState.foodSecurity.deficitPct).toBeCloseTo(12 + STOCKPILE_TUNING.reserveTithePct, 1);
    expect(settlement.economicState.foodSecurity.storageMonths).toBeGreaterThan(0.2);
  });

  test('severe deficit with stores: rationed drawdown calms it to the Pressured band', () => {
    const s = settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 30, surplusPct: 0, storageMonths: 4, importDependency: 0.2 },
    });
    const { settlement, summary } = advanceFoodStockpile(s, { interval: 'one_month', tick: 1 });
    expect(summary.tithed).toBe(false);
    // Full relief is affordable: 25% of need for one month = 0.25 months < half of 4.
    expect(settlement.economicState.foodSecurity.deficitPct).toBeCloseTo(STOCKPILE_TUNING.rationFloorPct, 1);
    expect(settlement.economicState.foodSecurity.storageMonths).toBeCloseTo(3.75, 2);
  });

  test('drawdown never spends more than half the remaining stores in one tick', () => {
    const s = settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 80, surplusPct: 0, storageMonths: 1, importDependency: 0 },
    });
    const { settlement } = advanceFoodStockpile(s, { interval: 'one_year', tick: 1 });
    // Covering 75% of need for 12 months would cost 9 months of food; only
    // half of the single stored month may be spent.
    expect(settlement.economicState.foodSecurity.storageMonths).toBeCloseTo(0.5, 2);
    expect(settlement.economicState.foodSecurity.deficitPct).toBeGreaterThan(70);
  });

  test('relief never compounds: the structural base is re-derived each tick', () => {
    const s = settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 30, surplusPct: 0, storageMonths: 4, importDependency: 0.2 },
    });
    const first = advanceFoodStockpile(s, { interval: 'one_month', tick: 1 }).settlement;
    const second = advanceFoodStockpile(first, { interval: 'one_month', tick: 2 }).settlement;
    const fs = second.economicState.foodSecurity;
    // Still relieving from base 30 (not from last tick's 5): deficit holds at
    // the ration floor while stores keep draining by ~0.25/month.
    expect(fs.stockpile.baseDeficitPct).toBe(30);
    expect(fs.deficitPct).toBeCloseTo(STOCKPILE_TUNING.rationFloorPct, 1);
    expect(fs.storageMonths).toBeCloseTo(3.5, 2);
  });

  test('a blockade cuts imports: the siege eats the granary tick over tick', () => {
    const blockade = { type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
    let cur = settlementWith({
      institutions: [GRANARY],
      // Balanced economy, but 40% of need arrives by import.
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.4 },
    });
    const storageByTick = [];
    for (let tick = 1; tick <= 4; tick++) {
      cur = advanceFoodStockpile(cur, { interval: 'one_month', tick, blockade }).settlement || cur;
      storageByTick.push(cur.economicState.foodSecurity.storageMonths);
    }
    // Stores strictly drain while the blockade holds…
    expect(storageByTick[0]).toBeLessThan(4);
    expect(storageByTick[3]).toBeLessThan(storageByTick[0]);
    // …and the deficit stays calmed only as long as there is food to release.
    expect(cur.economicState.foodSecurity.deficitPct).toBeLessThanOrEqual(40);
    expect(cur.economicState.foodSecurity.stockpile.blockaded).toBe(true);
  });

  test('settlements without a generated food ledger are untouched', () => {
    const s = settlementWith({});
    const result = advanceFoodStockpile(s, { interval: 'one_month', tick: 1 });
    expect(result.changed).toBe(false);
    expect(result.settlement).toBe(s);
  });
});

describe('live resilienceScore (the report card is re-graded)', () => {
  const famine = { type: 'famine', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };

  test('first touch stashes the non-storage remainder and reproduces the generated score', () => {
    const s = settlementWith({
      institutions: [GRANARY],
      // Generated: storage 4 contributes 4/12*35 ≈ 11.7 of the 80.
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.1, resilienceScore: 80 },
    });
    const { settlement } = advanceFoodStockpile(s, { interval: 'one_month', tick: 1 });
    const fs = settlement.economicState.foodSecurity;
    expect(fs.stockpile.resilienceRest).toBeCloseTo(80 - (4 / 12) * 35, 1);
    // Nothing moved this tick, so the re-graded score matches the original.
    expect(fs.resilienceScore).toBe(80);
  });

  test('a famine eating the granary drags resilience down with it', () => {
    let cur = settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.1, resilienceScore: 80 },
    });
    const scores = [];
    for (let tick = 1; tick <= 5; tick++) {
      cur = advanceFoodStockpile(cur, { interval: 'one_month', tick, famine }).settlement || cur;
      scores.push(cur.economicState.foodSecurity.resilienceScore);
    }
    expect(scores[4]).toBeLessThan(scores[0]);
    expect(scores[4]).toBeLessThan(80);
    // The structural remainder never drifts — only the storage slice moves.
    expect(cur.economicState.foodSecurity.stockpile.resilienceRest).toBeCloseTo(80 - (4 / 12) * 35, 1);
  });

  test('surplus refilling the granary recovers resilience', () => {
    let cur = settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 0, surplusPct: 40, storageMonths: 1, importDependency: 0.1, resilienceScore: 60 },
    });
    const start = 60;
    for (let tick = 1; tick <= 8; tick++) {
      cur = advanceFoodStockpile(cur, { interval: 'one_season', tick }).settlement || cur;
    }
    expect(cur.economicState.foodSecurity.storageMonths).toBeGreaterThan(1);
    expect(cur.economicState.foodSecurity.resilienceScore).toBeGreaterThan(start);
  });
});

describe('blockadeFor()', () => {
  const siege = { type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };

  test('finds an active siege touching the settlement', () => {
    expect(blockadeFor([siege], 'a')).toBe(siege);
    expect(blockadeFor([siege], 'b')).toBeNull();
  });

  test('echoes and weak pressure do not blockade', () => {
    expect(blockadeFor([{ ...siege, lifecycleStage: 'residual', status: 'residual' }], 'a')).toBeNull();
    expect(blockadeFor([{ ...siege, severity: 0.2 }], 'a')).toBeNull();
  });
});

describe('famine eats the granary (the siege pattern, applied to crop failure)', () => {
  const famine = { type: 'famine', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };

  test('famineFor finds an active famine, ignores echoes and ambient scarcity', () => {
    expect(famineFor([famine], 'a')).toBe(famine);
    expect(famineFor([famine], 'b')).toBeNull();
    expect(famineFor([{ ...famine, lifecycleStage: 'residual', status: 'residual' }], 'a')).toBeNull();
    expect(famineFor([{ ...famine, severity: 0.2 }], 'a')).toBeNull();
  });

  test('a campaign-emergent famine drains a balanced town\'s granary, calmed while stores last', () => {
    // Balanced ledger (deficit 0): before this coupling, an emergent famine
    // never touched the stockpile at all — the granary sat full while the
    // town starved.
    let cur = settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.1 },
    });
    const storageByTick = [];
    for (let tick = 1; tick <= 4; tick++) {
      const result = advanceFoodStockpile(cur, { interval: 'one_month', tick, famine });
      cur = result.settlement || cur;
      storageByTick.push(cur.economicState.foodSecurity.storageMonths);
      expect(result.summary.famished).toBe(true);
    }
    // Severity 0.8 famine = 36% of need unmet; full relief costs 0.31 mo/tick.
    expect(storageByTick[0]).toBeLessThan(4);
    expect(storageByTick[3]).toBeLessThan(storageByTick[0]);
    // While stores last, the granary calms the famine to the ration floor.
    expect(cur.economicState.foodSecurity.deficitPct).toBeCloseTo(STOCKPILE_TUNING.rationFloorPct, 1);
  });

  test('once the granary empties, the famine deficit lands at full force', () => {
    const empty = settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 0, importDependency: 0.1 },
    });
    const { settlement } = advanceFoodStockpile(empty, { interval: 'one_month', tick: 1, famine });
    expect(settlement.economicState.foodSecurity.deficitPct)
      .toBeCloseTo(0.8 * STOCKPILE_TUNING.famineDeficitScale, 1);
  });

  test('siege + famine (the Starving City) drains faster than either alone', () => {
    const blockade = { type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
    const base = () => settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.4 },
    });
    const after = (opts) => advanceFoodStockpile(base(), { interval: 'one_month', tick: 1, ...opts })
      .settlement.economicState.foodSecurity.storageMonths;
    const famineOnly = after({ famine });
    const siegeOnly = after({ blockade });
    const both = after({ famine, blockade });
    expect(both).toBeLessThan(famineOnly);
    expect(both).toBeLessThan(siegeOnly);
  });
});

describe('end-to-end through advanceCampaignWorld', () => {
  test('a besieged import-dependent town drains its granary each pulse', () => {
    const saves = [{
      id: 'a',
      name: 'Ashford',
      phase: 'canon',
      settlement: {
        name: 'Ashford', tier: 'town', population: 1500,
        config: {}, institutions: [{ id: 'granary', name: 'Old Granary' }], npcs: [], activeConditions: [],
        powerStructure: { publicLegitimacy: { score: 60, label: 'Approved' }, factions: [] },
        economicState: {
          foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 5, importDependency: 0.4, resilienceScore: 60 },
        },
        history: { historicalEvents: [] },
      },
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    let campaign = {
      id: 'stockpile-e2e',
      name: 'Stockpile',
      settlementIds: ['a'],
      worldState: {
        rngSeed: 'stockpile-seed',
        tick: 0,
        stressors: [{
          id: 'world_stressor.siege.a', type: 'siege', severity: 0.9, age: 1,
          durationPolicy: 'structural', affectedSettlementIds: ['a'], originSettlementId: 'a',
        }],
      },
      regionalGraph: ensureRegionalGraph({}),
      wizardNews: { currentTick: 0, entries: [] },
    };
    let current = saves;
    let lastStorage = 5;
    for (let i = 0; i < 3; i++) {
      const result = advanceCampaignWorld({ campaign, saves: current, interval: 'one_month', now: `2026-03-0${i + 1}T00:00:00.000Z` });
      campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph, wizardNews: result.wizardNews };
      current = current.map(s => {
        const update = result.settlementUpdates.find(u => String(u.saveId) === String(s.id));
        return update ? { ...s, settlement: update.settlement } : s;
      });
      const storage = current[0].settlement.economicState.foodSecurity.storageMonths;
      expect(storage).toBeLessThan(lastStorage);
      lastStorage = storage;
    }
  });
});
