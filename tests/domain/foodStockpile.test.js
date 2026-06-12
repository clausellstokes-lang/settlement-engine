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
 *   • magical transport bypasses the blockade only up to its own channel
 *     throughput (the shared FOOD_IMPORT_RATES ladder) — the import share
 *     above it still starves;
 *   • the bypass channel resolves LIVE-FIRST (Wave 8 frozen-vs-live): the
 *     standing roster decides; the generation verdict is fallback ONLY for
 *     rosters with no name signal, and a destroyed — or pulse-closed
 *     (remnant/_worldPulseInactive) — circle is a NEGATIVE signal: the next
 *     blockade takes the full cut;
 *   • the persisted, gated defense 'disaster' score is re-graded through
 *     the same gate whenever live resilience moves (the readiness row
 *     un-freezes);
 *   • relief never compounds — the structural deficit is re-derived from
 *     the stashed base every tick;
 *   • settlements without a generated food ledger are untouched.
 */

import { describe, expect, test } from 'vitest';
import {
  advanceFoodStockpile,
  blockadeFor,
  famineFor,
  resolveBlockadeBypassChannel,
  storageCapacityMonths,
  STOCKPILE_TUNING,
} from '../../src/domain/worldPulse/foodStockpile.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { deriveDefenseReadiness } from '../../src/domain/display/defenseDisplay.js';

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

  test('mild deficit at the tithe floor converges: changed goes false within a dozen ticks', () => {
    // The old non-converging regime: a mild structural deficit (<25) with
    // stores hovering at the 1-month tithe floor alternated forever — tithe
    // pushes stores past the floor (deficit +3), drawdown raids them back
    // below it (deficit →5), repeat. That meant a settlement object rewrite
    // every tick and a ±1 flicker on the gated disaster score. The floor
    // protection on mild drawdowns gives the handoff a fixed point.
    let cur = settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 24, surplusPct: 0, storageMonths: 0.95, importDependency: 0.2 },
    });
    let settledAt = null;
    for (let tick = 1; tick <= 12; tick++) {
      const result = advanceFoodStockpile(cur, { interval: 'one_month', tick });
      if (!result.changed) {
        expect(result.settlement).toBe(cur); // no-op identity contract holds at the fixed point
        settledAt = tick;
        break;
      }
      cur = result.settlement;
    }
    expect(settledAt).not.toBeNull();
    const fs = cur.economicState.foodSecurity;
    // The fixed point: stores rest at the security floor, the table carries
    // the structural deficit — no perpetual tithe bump, no oscillation.
    expect(fs.storageMonths).toBeGreaterThanOrEqual(STOCKPILE_TUNING.reserveTitheFloorMonths - 0.01);
    expect(fs.storageMonths).toBeLessThanOrEqual(STOCKPILE_TUNING.reserveTitheFloorMonths + 0.05);
    expect(fs.deficitPct).toBeLessThanOrEqual(24);
    expect(fs.deficitPct).toBeGreaterThan(STOCKPILE_TUNING.rationFloorPct);
    // And it stays settled.
    const again = advanceFoodStockpile(cur, { interval: 'one_month', tick: settledAt + 1 });
    expect(again.changed).toBe(false);
    expect(again.settlement).toBe(cur);
  });

  test('a mild deficit drains stores only down to the tithe floor; a severe one raids below it', () => {
    const mk = (deficitPct) => settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct, surplusPct: 0, storageMonths: 2, importDependency: 0.2 },
    });
    const run = (start) => {
      let cur = start;
      for (let tick = 1; tick <= 30; tick++) {
        cur = advanceFoodStockpile(cur, { interval: 'one_month', tick }).settlement || cur;
      }
      return cur.economicState.foodSecurity;
    };
    // Mild (20 < reserveTitheDeficitCap): the security reserve is sacred.
    expect(run(mk(20)).storageMonths)
      .toBeGreaterThanOrEqual(STOCKPILE_TUNING.reserveTitheFloorMonths - 0.01);
    // Severe (40): the floor protection breaks, the granary empties out.
    expect(run(mk(40)).storageMonths).toBeLessThan(STOCKPILE_TUNING.reserveTitheFloorMonths);
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

  test('a teleportation circle bypasses the blockade: imports keep flowing', () => {
    const blockade = { id: 'siege.x', type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
    const base = {
      // Balanced economy; the import share (30% of need) sits WITHIN the
      // circle's 0.30 channel throughput, so the bypass is total.
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.3 },
    };
    let cur = settlementWith({ ...base, institutions: [GRANARY, { name: 'Teleportation circle' }] });
    for (let tick = 1; tick <= 4; tick++) {
      cur = advanceFoodStockpile(cur, { interval: 'one_month', tick, blockade }).settlement || cur;
    }
    const fs = cur.economicState.foodSecurity;
    // The circle is point-to-point — the import share is untouched, so the
    // granary holds (deficit 0, nothing to ration) while the siege grips.
    expect(fs.storageMonths).toBeCloseTo(4, 1);
    expect(fs.stockpile.blockaded).toBe(true);
    expect(fs.stockpile.blockadeBypass).toBe('teleport');
  });

  test('a lifting siege refreshes the bookkeeping flags even when the numbers held still', () => {
    const blockade = { id: 'siege.x', type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
    const base = {
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.3 },
    };
    // Full teleport bypass: the siege never moves a number, only the flags.
    let cur = settlementWith({ ...base, institutions: [GRANARY, { name: 'Teleportation circle' }] });
    cur = advanceFoodStockpile(cur, { interval: 'one_month', tick: 1, blockade }).settlement;
    expect(cur.economicState.foodSecurity.stockpile.blockaded).toBe(true);
    // The siege lifts; storage/deficit/resilience are all unchanged, but the
    // stockpile's "why" record must not keep claiming an active blockade.
    const lifted = advanceFoodStockpile(cur, { interval: 'one_month', tick: 2 });
    expect(lifted.changed).toBe(true);
    expect(lifted.settlement.economicState.foodSecurity.stockpile.blockaded).toBe(false);
    expect(lifted.settlement.economicState.foodSecurity.stockpile.blockadeBypass).toBeNull();
    // And once the record agrees with the world again, ticks go back to no-ops.
    const settled = advanceFoodStockpile(lifted.settlement, { interval: 'one_month', tick: 3 });
    expect(settled.changed).toBe(false);
    expect(settled.settlement).toBe(lifted.settlement);
  });

  test('the bypass is capped at channel throughput: a port town with a circle starves on the overflow', () => {
    const blockade = { id: 'siege.x', type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
    // Port-grade import dependency (0.58) far exceeds what a circle can move
    // (0.30): the siege bites the 28% overflow — generation's own channel
    // model, not a free pass for owning the right masonry.
    const mk = (institutions) => settlementWith({
      institutions,
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.58 },
    });
    const run = (start) => {
      let cur = start;
      for (let tick = 1; tick <= 3; tick++) {
        cur = advanceFoodStockpile(cur, { interval: 'one_month', tick, blockade }).settlement || cur;
      }
      return cur.economicState.foodSecurity;
    };
    const circle = run(mk([GRANARY, { name: 'Teleportation circle' }]));
    const noBypass = run(mk([GRANARY]));
    expect(circle.stockpile.blockadeBypass).toBe('teleport');
    // Stores STILL drain — slower than with no channel, but never held flat.
    expect(circle.storageMonths).toBeLessThan(4);
    expect(circle.storageMonths).toBeGreaterThan(noBypass.storageMonths);
  });

  test("a no-magic world's legacy circle is masonry: no bypass at all", () => {
    const blockade = { id: 'siege.x', type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
    const mk = (institutions, config) => ({
      ...settlementWith({
        institutions,
        foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.3 },
      }),
      ...(config ? { config } : {}),
    });
    const tickOnce = (s) => advanceFoodStockpile(s, { interval: 'one_month', tick: 1, blockade })
      .settlement.economicState.foodSecurity;
    const noMagic = tickOnce(mk([GRANARY, { name: 'Teleportation circle' }], { magicExists: false }));
    const noCircle = tickOnce(mk([GRANARY]));
    expect(noMagic.stockpile.blockadeBypass).toBeNull();
    // Drains exactly like a settlement with no magical transport.
    expect(noMagic.storageMonths).toBe(noCircle.storageMonths);
  });

  test("the generator's verdict (magicTradeChannel) is the FALLBACK for rosters with no name signal — legacy/custom-renamed circles keep working", () => {
    const blockade = { id: 'siege.x', type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
    // No recognisable institution name — only the persisted channel field.
    // (Wave 8 flipped resolution live-first; this is the no-signal-either-way
    // branch where the verdict still speaks for the renamed masonry.)
    const s = settlementWith({
      institutions: [GRANARY, { name: 'The Whispering Arch' }],
      foodSecurity: {
        deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.3,
        magicTradeChannel: 'teleport',
      },
    });
    const fs = advanceFoodStockpile(s, { interval: 'one_month', tick: 1, blockade })
      .settlement.economicState.foodSecurity;
    expect(fs.stockpile.blockadeBypass).toBe('teleport');
    expect(fs.storageMonths).toBeCloseTo(4, 1);
  });

  test('a circle destroyed or pulse-closed mid-campaign stops feeding the city: the next blockade takes the full cut', () => {
    const blockade = { id: 'siege.x', type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
    // The verdict still says 'teleport' — generation cannot know the campaign
    // tore the circle down. The roster carries the NEGATIVE signal (the
    // sniffable transport stands removed/destroyed — or pulse-closed:
    // institutionLifecycle stamps status 'remnant' + _worldPulseInactive on
    // economic closures, the engine's canonical down predicate), so the
    // verdict is not consulted and no fallback channel survives.
    const mk = (circlePatch) => settlementWith({
      institutions: [GRANARY, { name: 'Teleportation circle', ...(circlePatch || {}) }],
      foodSecurity: {
        deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.3,
        magicTradeChannel: 'teleport',
      },
    });
    const tickOnce = (s) => advanceFoodStockpile(s, { interval: 'one_month', tick: 1, blockade })
      .settlement.economicState.foodSecurity;
    const noCircle = tickOnce(settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.3 },
    }));
    for (const patch of [
      { status: 'removed' },
      { status: 'destroyed' },
      { status: 'remnant' },
      { status: 'remnant', _worldPulseInactive: true }, // the lifecycle's closure stamp
      { _worldPulseInactive: true },                    // the flag alone is DOWN too
    ]) {
      const fallen = tickOnce(mk(patch));
      expect(fallen.stockpile.blockadeBypass, JSON.stringify(patch)).toBeNull();
      // Drains exactly like a settlement that never had magical transport.
      expect(fallen.storageMonths, JSON.stringify(patch)).toBe(noCircle.storageMonths);
    }
    // Control: the same circle STANDING keeps the full bypass.
    expect(tickOnce(mk(null)).stockpile.blockadeBypass).toBe('teleport');
  });

  test('live-first: a circle built mid-campaign outranks a stale airship verdict', () => {
    const s = settlementWith({
      institutions: [GRANARY, { name: 'Teleportation circle' }],
      foodSecurity: {
        deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.3,
        magicTradeChannel: 'airship', // generation only saw the dock
      },
    });
    expect(resolveBlockadeBypassChannel(s)).toBe('teleport');
  });

  test('resolveBlockadeBypassChannel: the three roster-signal regimes, all gated on magicExists', () => {
    const mk = (institutions, foodSecurity = {}, config = undefined) => ({
      ...settlementWith({ institutions, foodSecurity: { deficitPct: 0, ...foodSecurity } }),
      ...(config ? { config } : {}),
    });
    // Standing transport: live signal wins, no verdict needed.
    expect(resolveBlockadeBypassChannel(mk([{ name: 'Airship docking tower' }]))).toBe('airship');
    // An impaired dock still stands (blockadeTransport stamps airships
    // impaired during sieges BY DESIGN — the cut is priced as throughput).
    expect(resolveBlockadeBypassChannel(mk([{ name: 'Airship docking tower', status: 'impaired' }]))).toBe('airship');
    // Negative signal: the only transport lies removed — verdict ignored.
    expect(resolveBlockadeBypassChannel(
      mk([{ name: 'Airship docking tower', status: 'removed' }], { magicTradeChannel: 'airship' }),
    )).toBeNull();
    // A pulse-closed remnant is DOWN the same way (circles/docks are
    // closable; institutionLifecycle's standing predicate excludes both).
    expect(resolveBlockadeBypassChannel(
      mk([{ name: 'Airship docking tower', status: 'remnant', _worldPulseInactive: true }], { magicTradeChannel: 'airship' }),
    )).toBeNull();
    // No signal either way: the verdict speaks (legacy/custom names).
    expect(resolveBlockadeBypassChannel(mk([{ name: 'The Whispering Arch' }], { magicTradeChannel: 'airship' }))).toBe('airship');
    // Garbage verdicts never mint a channel.
    expect(resolveBlockadeBypassChannel(mk([], { magicTradeChannel: 'gateway' }))).toBeNull();
    // Dead-magic world: everything is masonry.
    expect(resolveBlockadeBypassChannel(
      mk([{ name: 'Teleportation circle' }], { magicTradeChannel: 'teleport' }, { magicExists: false }),
    )).toBeNull();
  });

  test('an airship dock runs the blockade impaired: slower drain than no bypass at all', () => {
    const blockade = { id: 'siege.x', type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
    const mk = (institutions) => settlementWith({
      institutions,
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.4 },
    });
    const run = (start) => {
      let cur = start;
      for (let tick = 1; tick <= 4; tick++) {
        cur = advanceFoodStockpile(cur, { interval: 'one_month', tick, blockade }).settlement || cur;
      }
      return cur.economicState.foodSecurity;
    };
    const airship = run(mk([GRANARY, { name: 'Airship docking (high magic)' }]));
    const noBypass = run(mk([GRANARY]));
    // The dock lands at most its besieged throughput (0.15 of need): stores
    // still drain, but strictly slower than a settlement with no magical
    // transport at all.
    expect(airship.storageMonths).toBeLessThan(4);
    expect(airship.storageMonths).toBeGreaterThan(noBypass.storageMonths);
    expect(airship.stockpile.blockadeBypass).toBe('airship');
    expect(noBypass.stockpile.blockadeBypass).toBeNull();
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

describe('disaster writeback (the readiness row finally moves)', () => {
  const blockade = { type: 'siege', severity: 0.9, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
  const famine = { type: 'famine', severity: 1, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
  // Settlement as it leaves generation: healthy granary, persisted gated
  // scores.disaster (resilience 80 × gate 0.9 = 72).
  const mk = (defenseProfile) => ({
    ...settlementWith({
      institutions: [GRANARY],
      foodSecurity: {
        dailyNeed: 2500, dailyProduction: 2400, foodRatio: 0.96,
        deficitPct: 4, surplusPct: 0, storageMonths: 5,
        importDependency: 0.5, resilienceScore: 80,
      },
    }),
    config: { tradeRouteAccess: 'road' },
    defenseProfile,
  });

  test('a siege+famine drain re-grades scores.disaster through the persisted gate — and the dossier row moves', () => {
    let cur = mk({
      scores: { military: 50, internal: 50, monster: 50, economic: 50, disaster: 72 },
      economicGates: { disaster: 0.9 },
      institutions: {},
    });
    const rowBefore = deriveDefenseReadiness(cur).find(r => r.label === 'Disasters & Famine');
    expect(rowBefore.score).toBe(72);
    for (let tick = 1; tick <= 12; tick++) {
      cur = advanceFoodStockpile(cur, { interval: 'one_month', tick, blockade, famine }).settlement || cur;
    }
    const fs = cur.economicState.foodSecurity;
    expect(fs.resilienceScore).toBeLessThan(80);
    // The persisted score IS the gated live resilience now, not the freeze.
    expect(cur.defenseProfile.scores.disaster).toBe(Math.round(fs.resilienceScore * 0.9));
    const rowAfter = deriveDefenseReadiness(cur).find(r => r.label === 'Disasters & Famine');
    expect(rowAfter.score).toBe(cur.defenseProfile.scores.disaster);
    expect(rowAfter.score).toBeLessThan(rowBefore.score);
    // Untouched defense fields survive the immutable spread.
    expect(cur.defenseProfile.scores.military).toBe(50);
    expect(cur.defenseProfile.economicGates.disaster).toBe(0.9);
  });

  test('an unchanged tick keeps object identity AND the defenseProfile reference', () => {
    const start = mk({
      scores: { military: 50, internal: 50, monster: 50, economic: 50, disaster: 72 },
      economicGates: { disaster: 0.9 },
      institutions: {},
    });
    const first = advanceFoodStockpile(start, { interval: 'one_month', tick: 1 });
    // First touch stashes the stockpile bookkeeping, but the granary did not
    // move and the gated score matches: defenseProfile keeps its reference.
    expect(first.changed).toBe(true);
    expect(first.settlement.defenseProfile).toBe(start.defenseProfile);
    expect(first.settlement.defenseProfile.scores.disaster).toBe(72);
    const second = advanceFoodStockpile(first.settlement, { interval: 'one_month', tick: 2 });
    expect(second.changed).toBe(false);
    expect(second.settlement).toBe(first.settlement);
  });

  test('legacy saves without a persisted disaster score never gain one', () => {
    const defenseProfile = {
      scores: { military: 50, internal: 50, monster: 50, economic: 50 },
      institutions: {},
    };
    let cur = mk(defenseProfile);
    for (let tick = 1; tick <= 6; tick++) {
      cur = advanceFoodStockpile(cur, { interval: 'one_month', tick, blockade, famine }).settlement || cur;
    }
    expect(cur.economicState.foodSecurity.resilienceScore).toBeLessThan(80);
    expect(cur.defenseProfile.scores.disaster).toBeUndefined();
    expect(cur.defenseProfile).toBe(defenseProfile);
    // No persisted score, no writeback: the display layers correctly fall
    // through to the live resilience instead.
    const row = deriveDefenseReadiness(cur).find(r => r.label === 'Disasters & Famine');
    expect(row.score).toBe(cur.economicState.foodSecurity.resilienceScore);
  });

  test('a persisted score without a persisted gate re-grades ungated (×1)', () => {
    let cur = mk({
      scores: { military: 50, internal: 50, monster: 50, economic: 50, disaster: 80 },
      institutions: {},
    });
    for (let tick = 1; tick <= 6; tick++) {
      cur = advanceFoodStockpile(cur, { interval: 'one_month', tick, blockade, famine }).settlement || cur;
    }
    expect(cur.defenseProfile.scores.disaster).toBe(cur.economicState.foodSecurity.resilienceScore);
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

  test('a spread target reads the ATTENUATED severity — including the gate (H8)', () => {
    const spreadSiege = {
      ...siege,
      affectedSettlementIds: ['a', 'b', 'c'],
      severityBySettlement: { b: 0.576, c: 0.3 },
    };
    // Origin: full severity, identity intact.
    expect(blockadeFor([spreadSiege], 'a')).toBe(spreadSiege);
    // Spread target: the carried severity is the one THIS settlement feels.
    expect(blockadeFor([spreadSiege], 'b').severity).toBeCloseTo(0.576, 10);
    // A spread attenuated below the 0.4 gate no longer blockades at all.
    expect(blockadeFor([spreadSiege], 'c')).toBeNull();
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

  test('a spread famine drains the TARGET\'s granary slower than the origin\'s (H8)', () => {
    // One shared famine record: origin 'a' at 0.8, spread to 'b' stamped at
    // the attenuated 0.8 × 0.72 = 0.576. famineFor hands each settlement the
    // severity IT experiences, so the same granary drains at two speeds.
    const spreadFamine = {
      ...famine,
      affectedSettlementIds: ['a', 'b'],
      severityBySettlement: { b: 0.576 },
    };
    const mk = () => settlementWith({
      institutions: [GRANARY],
      foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.1 },
    });
    const run = (saveId) => {
      let cur = mk();
      for (let tick = 1; tick <= 3; tick++) {
        cur = advanceFoodStockpile(cur, {
          interval: 'one_month', tick,
          famine: famineFor([spreadFamine], saveId),
        }).settlement || cur;
      }
      return cur.economicState.foodSecurity;
    };
    const origin = run('a');
    const target = run('b');
    // Both drain (the spread famine is real food pressure at the target)…
    expect(origin.storageMonths).toBeLessThan(4);
    expect(target.storageMonths).toBeLessThan(4);
    // …but the target, attenuated, strictly slower.
    expect(target.storageMonths).toBeGreaterThan(origin.storageMonths);
    // famineFor carried the per-settlement effective severities.
    expect(famineFor([spreadFamine], 'a').severity).toBeCloseTo(0.8, 10);
    expect(famineFor([spreadFamine], 'b').severity).toBeCloseTo(0.576, 10);
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
