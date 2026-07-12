/**
 * tests/domain/tradePrimitives.w0.test.js — Phase 5.5 W0 Lane B, trade-primitive
 * coverage CLOSURE.
 *
 * PREMISE CORRECTION (vs the W0 brief): the four primitives are NOT untested —
 * tradeWar.test.js (contest determinism-by-order, cooldown soak, vassal
 * override, escalation), tradeSalience.test.js (relative bands, factor gates,
 * order-independence), and foodStockpile.test.js (fill/tithe/drawdown behavior,
 * blockade coupling) already exist. This file closes the four SPECIFIC gaps the
 * brief names that the existing suites do NOT pin:
 *
 *   1. supplyCompleteness — the explicit ZERO / PARTIAL / FULL ladder with the
 *      blend arithmetic (0.4 gate + 0.4·chainHealth + 0.2·inboundFeedstock);
 *   2. tradeSalience — BAND stability on one known snapshot (the dampener's
 *      byte-neutral gate on the same fixture, both sides of VALUABLE_GATE);
 *   3. tradeWar — the SAME-SEED contest pin: one seeded rng ⇒ byte-identical
 *      full result (winner, ledger, channels, outcomes) across re-runs, and
 *      the flip stamps the cooldown ledger at the contest tick;
 *   4. foodStockpile — EXACT drawdown/refill arithmetic (numeric equality
 *      derived from STOCKPILE_TUNING, not just directional movement).
 *
 * All pure-function tests over hand-built snapshots — no engine changes.
 */

import { describe, expect, test } from 'vitest';

import { supplyCompleteness } from '../../src/domain/worldPulse/supplyCompleteness.js';
import {
  commodityTradeSalience,
  tradeSalienceFactor,
  TRADE_SALIENCE_TUNING,
} from '../../src/domain/worldPulse/tradeSalience.js';
import { evaluateTradeWar } from '../../src/domain/worldPulse/tradeWar.js';
import { advanceFoodStockpile, STOCKPILE_TUNING } from '../../src/domain/worldPulse/foodStockpile.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';

// ── Shared fixture helpers (the tradeWar.test.js shapes) ─────────────────────

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25 },
    institutions: patch.institutions || [],
    economicState: {
      prosperity: patch.prosperity || 'Prosperous',
      primaryExports: patch.exports || [],
      primaryImports: patch.imports || [],
      ...(patch.activeChains ? { activeChains: patch.activeChains } : {}),
      ...(patch.foodSecurity ? { foodSecurity: patch.foodSecurity } : {}),
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function campaignFor(saves, { edges = [], channels = [], tick = 4, extraState = {} } = {}) {
  return {
    id: 'w0-trade-fixture',
    name: 'W0 Trade Fixture',
    settlementIds: saves.map((s) => s.id),
    worldState: { rngSeed: 'w0-seed', tick, relationshipStates: {}, simulationRules: { warLayerEnabled: true }, ...extraState },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: tick, entries: [] },
  };
}

const snapshotFor = (campaign, saves) => buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });

const grainChannel = (from, to, strength) => ({
  type: 'trade_dependency', from, to, status: 'confirmed', strength, goods: [{ id: 'grain', label: 'Grain' }],
});

// ── 1. supplyCompleteness — the ZERO / PARTIAL / FULL ladder ─────────────────

describe('supplyCompleteness — zero / partial / full (the blend arithmetic)', () => {
  const grainChain = (status) => ({
    name: `Grain chain (${status})`, status, outputs: ['Grain'], rawInputs: ['Seed'], dependencies: [],
  });

  function snapWith(chains) {
    const saves = [save('sup', 'Supplier', { exports: ['Grain'], activeChains: chains })];
    return snapshotFor(campaignFor(saves), saves);
  }

  test('ZERO: a settlement that neither exports nor chains the good scores EXACTLY 0', () => {
    const saves = [save('sup', 'Supplier', { exports: ['Iron Ore'] })];
    const snap = snapshotFor(campaignFor(saves), saves);
    expect(supplyCompleteness(snap, 'sup', 'Grain')).toBe(0);
    // Total on garbage: unknown supplier / unknown commodity are 0, not throws.
    expect(supplyCompleteness(snap, 'ghost', 'Grain')).toBe(0);
    expect(supplyCompleteness(snap, 'sup', null)).toBe(0);
  });

  test('FULL: an exporter with every relevant chain stable and no inbound need reads the exact blend ceiling', () => {
    // chainScore 1 (2/2 stable), inboundScore 0.6 (self-sufficient baseline):
    // 0.4 + 1×0.4 + 0.6×0.2 = 0.92.
    const full = supplyCompleteness(snapWith([grainChain('stable'), grainChain('stable')]), 'sup', 'Grain');
    expect(full).toBeCloseTo(0.92, 10);
    // A producer with NO modeled chains is treated as healthy — same ceiling.
    const chainless = snapWith(undefined);
    expect(supplyCompleteness(chainless, 'sup', 'Grain')).toBeCloseTo(0.92, 10);
  });

  test('PARTIAL: one strained chain of two halves the chain-health slice (0.4 + 0.5×0.4 + 0.12 = 0.72)', () => {
    const partial = supplyCompleteness(snapWith([grainChain('stable'), grainChain('strained')]), 'sup', 'Grain');
    expect(partial).toBeCloseTo(0.72, 10);
    // Every relevant chain unhealthy ⇒ the chain slice collapses to the floor
    // (0.4 + 0 + 0.12 = 0.52) — still a producer, no longer a reliable one.
    const broken = supplyCompleteness(snapWith([grainChain('strained'), grainChain('blocked')]), 'sup', 'Grain');
    expect(broken).toBeCloseTo(0.52, 10);
    // The ladder orders strictly: full > partial > broken > zero.
    const full = supplyCompleteness(snapWith([grainChain('stable')]), 'sup', 'Grain');
    expect(full).toBeGreaterThan(partial);
    expect(partial).toBeGreaterThan(broken);
    expect(broken).toBeGreaterThan(0);
  });

  test('INBOUND feedstock modulates the last slice: a strong confirmed carrier of the good beats a weak one', () => {
    const withInbound = (strength) => {
      const saves = [
        save('sup', 'Supplier', { exports: ['Grain'] }),
        save('feed', 'Feedstock', { exports: ['Grain'] }),
      ];
      const campaign = campaignFor(saves, { channels: [grainChannel('feed', 'sup', strength)] });
      return supplyCompleteness(snapshotFor(campaign, saves), 'sup', 'Grain');
    };
    // inboundScore = 0.4 + strength×0.6 ⇒ result = 0.8 + 0.2×(0.4 + 0.6×s).
    expect(withInbound(1)).toBeCloseTo(0.8 + 0.2 * 1.0, 10);   // 1.0 (clamped ceiling)
    expect(withInbound(0.1)).toBeCloseTo(0.8 + 0.2 * 0.46, 10); // 0.892
    expect(withInbound(1)).toBeGreaterThan(withInbound(0.1));
  });
});

// ── 2. tradeSalience — band stability on a known snapshot ────────────────────

describe('tradeSalience — bands stable on a known snapshot', () => {
  // One fixed region: a food-INSECURE buyer with a SOLE grain supplier (the
  // textbook high band) vs a food-SECURE buyer with a REDUNDANT tie (low band).
  function bandFixture() {
    const saves = [
      save('needy', 'Needham', {
        imports: ['Grain'],
        foodSecurity: { deficitPct: 30, storageMonths: 0.5, resilienceScore: 20, importDependency: 0.6 },
      }),
      save('secure', 'Fatfield', {
        imports: ['Grain'],
        // The genuinely LOW band needs BOTH redundancy and self-supply: a buyer
        // that cannot make the good at all carries a real import-dependence
        // spine even when food-secure (need ≈ 0.7 ⇒ above the gate — verified).
        exports: ['Grain'],
        foodSecurity: { surplusPct: 25, storageMonths: 8, resilienceScore: 90, importDependency: 0.1 },
      }),
      save('sole', 'Solebury', { exports: ['Grain'] }),
      save('alt', 'Altona', { exports: ['Grain'] }),
    ];
    const campaign = campaignFor(saves, {
      channels: [
        grainChannel('sole', 'needy', 0.7),           // sole supplier into the insecure buyer
        grainChannel('sole', 'secure', 0.7),          // redundant tie into the secure buyer…
        grainChannel('alt', 'secure', 0.7),           // …because an alternative also supplies it
      ],
    });
    return snapshotFor(campaign, saves);
  }

  test('the insecure sole-supplier tie clears the VALUABLE gate; the secure redundant tie stays below it', () => {
    const snap = bandFixture();
    const ws = { tick: 4 };
    const hot = commodityTradeSalience(snap, ws, 'needy', 'sole', 'Grain', { tick: 4 });
    const cold = commodityTradeSalience(snap, ws, 'secure', 'sole', 'Grain', { tick: 4 });
    expect(hot).not.toBeNull();
    expect(cold).not.toBeNull();

    // BAND pins (the stable-band contract — these are the qualitative bands the
    // dampener consumes, robust to small retunes but not to band regressions):
    expect(hot.salience).toBeGreaterThanOrEqual(TRADE_SALIENCE_TUNING.VALUABLE_GATE);
    expect(cold.salience).toBeLessThan(TRADE_SALIENCE_TUNING.VALUABLE_GATE);
    expect(hot.replace).toBe(1);            // sole supplier ⇒ exactly hard-to-replace 1
    expect(cold.replace).toBeCloseTo(0.5, 10); // one credible alternative ⇒ 1/(1+1)
    expect(hot.need).toBeGreaterThan(cold.need);

    // The dampener's byte-neutral gate on the SAME fixture: the cold tie reads
    // EXACTLY 1.0 (omitted at the chokepoint), the hot tie dampens below 1.
    expect(tradeSalienceFactor(cold.salience, cold.critical)).toBe(1.0);
    expect(tradeSalienceFactor(hot.salience, hot.critical)).toBeLessThan(1.0);
  });

  test('the band verdicts are deterministic: the same snapshot reads the identical salience twice', () => {
    const snap = bandFixture();
    const ws = { tick: 4 };
    const a = commodityTradeSalience(snap, ws, 'needy', 'sole', 'Grain', { tick: 4 });
    const b = commodityTradeSalience(snap, ws, 'needy', 'sole', 'Grain', { tick: 4 });
    expect(b).toEqual(a);
  });
});

// ── 3. tradeWar — the same-seed contest pin ──────────────────────────────────

describe('tradeWar — same seed ⇒ same flip (the deterministic contest pin)', () => {
  // Two near-tied challengers against a weak incumbent: the contest outcome
  // rides the seeded roll, so this fixture is HOT for the determinism pin
  // (an unseeded draw would flake across runs).
  function contestFixture() {
    const saves = [
      save('buyer', 'Ctown', { imports: ['Grain'] }),
      save('inc', 'Aville', { exports: ['Grain'], tier: 'village', population: 300, legitimacy: 30 }),
      save('chalA', 'Bburg', { exports: ['Grain'], tier: 'city', population: 60000, legitimacy: 80 }),
      save('chalB', 'Dford', { exports: ['Grain'], tier: 'city', population: 60000, legitimacy: 80 }),
    ];
    const campaign = campaignFor(saves, {
      edges: [
        { id: 'edge.inc.buyer', from: 'inc', to: 'buyer', relationshipType: 'trade_partner' },
        { id: 'edge.chalA.buyer', from: 'chalA', to: 'buyer', relationshipType: 'trade_partner' },
        { id: 'edge.chalB.buyer', from: 'chalB', to: 'buyer', relationshipType: 'trade_partner' },
      ],
      channels: [grainChannel('inc', 'buyer', 0.6), grainChannel('chalA', 'buyer', 0.5), grainChannel('chalB', 'buyer', 0.5)],
    });
    return { campaign, saves };
  }

  const runContest = (seed) => {
    const { campaign, saves } = contestFixture();
    const snap = snapshotFor(campaign, saves);
    return evaluateTradeWar({
      snapshot: snap, worldState: snap.worldState, rng: createPRNG(seed), tick: 5, now: NOW,
      rules: { warLayerEnabled: true },
    });
  };

  test('the SAME seed re-runs to a byte-identical full result (winner, ledger, channels, outcomes)', () => {
    const first = runContest('pin-seed');
    const second = runContest('pin-seed');
    expect(second.tradeWarState).toEqual(first.tradeWarState);
    expect(second.outcomes).toEqual(first.outcomes);
    expect(second.graphChannels).toEqual(first.graphChannels);
    expect(second.dispositionDeltas).toEqual(first.dispositionDeltas);
    // The fixture is HOT: the weak incumbent actually lost its crown, so the
    // equality above pinned a real flip, not an empty no-op.
    const prize = first.tradeWarState['buyer:grain'];
    expect(prize).toBeDefined();
    expect(['chalA', 'chalB']).toContain(prize.winnerId);
  });

  test('a real flip stamps the cooldown ledger at the contest tick, with the REAL buyer/commodity ids', () => {
    const result = runContest('pin-seed');
    const prize = result.tradeWarState['buyer:grain'];
    expect(prize.lastFlipTick).toBe(5);
    expect(prize.updatedTick).toBe(5);
    expect(prize.buyerId).toBe('buyer');
    expect(prize.commodityId).toBe('grain');
    expect(prize.incumbentId).toBe('inc');
  });

  test('the seed is LOAD-BEARING: across a seed sweep the near-tied contest crowns more than one winner', () => {
    // Anti-vacuity for the pin above — if the contest ignored the rng, every
    // seed would crown the same challenger and the same-seed pin would be
    // trivially true. Near-tied contenders must split across seeds.
    const winners = new Set();
    for (const seed of ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8']) {
      const prize = runContest(seed).tradeWarState['buyer:grain'];
      if (prize?.winnerId) winners.add(prize.winnerId);
    }
    expect(winners.size).toBeGreaterThan(1);
  });
});

// ── 4. foodStockpile — exact drawdown/refill arithmetic ──────────────────────

describe('foodStockpile — the drawdown/refill arithmetic, to the constant', () => {
  const T = STOCKPILE_TUNING;
  const GRANARY_TOWN = { institutions: [{ id: 'granary', name: 'City Granaries' }], tier: 'town' };
  // storageCapacityMonths: 'city granari' fragment, non-city tier ⇒ 5 months.
  const CAP = 5;

  function foodTown(foodSecurity) {
    return settlement('Granaryton', { ...GRANARY_TOWN, foodSecurity });
  }

  test('REFILL: one one_month tick banks EXACTLY months × surplus × fillRate (round2)', () => {
    const months = 12 / 13; // one_month = 4 weeks × 3/13
    const start = 1.5;
    const surplusPct = 20;
    const { settlement: next, summary } = advanceFoodStockpile(
      foodTown({ surplusPct, deficitPct: 0, storageMonths: start, resilienceScore: 50 }),
      { interval: 'one_month', tick: 1 },
    );
    const expected = Math.round((start + months * (surplusPct / 100) * T.fillRate) * 100) / 100;
    expect(summary.storageMonths).toBe(expected);
    expect(next.economicState.foodSecurity.storageMonths).toBe(expected);
    expect(summary.effectiveDeficitPct).toBe(0);
  });

  test('REFILL is capped at the granary capacity (never above the tier table)', () => {
    const { summary } = advanceFoodStockpile(
      foodTown({ surplusPct: 200, deficitPct: 0, storageMonths: CAP - 0.01, resilienceScore: 50 }),
      { interval: 'one_year', tick: 1 },
    );
    expect(summary.storageMonths).toBe(CAP);
  });

  test('DRAWDOWN: a severe deficit releases EXACTLY (deficit − rationFloor)% of a month-tick, calming to the floor', () => {
    const months = 12 / 13;
    const storage = 4; // inside the 5-month cap so no clamp interferes with the pin
    const deficitPct = 40; // ≥ reserveTitheDeficitCap ⇒ severe (full stores releasable)
    const { summary } = advanceFoodStockpile(
      foodTown({ deficitPct, surplusPct: 0, storageMonths: storage, resilienceScore: 40 }),
      { interval: 'one_month', tick: 1 },
    );
    const targetRelief = deficitPct - T.rationFloorPct;          // 35% of need
    const cost = (targetRelief / 100) * months;                  // months of food
    const available = storage * T.maxReleaseFraction;            // half the stores
    const spend = Math.min(cost, available);                     // cost wins here
    expect(spend).toBe(cost); // fixture premise: the ration, not the cap, binds
    expect(summary.reliefPct).toBeCloseTo(targetRelief, 10);
    expect(summary.effectiveDeficitPct).toBe(T.rationFloorPct);  // calmed to 'Pressured'
    expect(summary.storageMonths).toBe(Math.round((storage - spend) * 100) / 100);
  });

  test('DRAWDOWN cap: with thin stores the release is EXACTLY half the stores, deficit only partially calmed', () => {
    const months = 12 / 13;
    const storage = 0.2; // thin — the half-store cap binds before the ration target
    const deficitPct = 60;
    const { summary } = advanceFoodStockpile(
      foodTown({ deficitPct, surplusPct: 0, storageMonths: storage, resilienceScore: 30 }),
      { interval: 'one_month', tick: 1 },
    );
    const spend = storage * T.maxReleaseFraction;
    const reliefPct = (spend / months) * 100;
    expect(summary.reliefPct).toBeCloseTo(Math.round(reliefPct * 10) / 10, 1);
    expect(summary.storageMonths).toBe(Math.round((storage - spend) * 100) / 100);
    expect(summary.effectiveDeficitPct).toBeCloseTo(Math.round((deficitPct - reliefPct) * 10) / 10, 1);
    expect(summary.effectiveDeficitPct).toBeGreaterThan(T.rationFloorPct); // NOT fully calmed
  });

  test('TITHE: a mild deficit with an empty granary banks EXACTLY months × tithePct and deepens the deficit by tithePct', () => {
    const months = 12 / 13;
    const deficitPct = 10; // < reserveTitheDeficitCap 25 ⇒ mild
    const { summary } = advanceFoodStockpile(
      foodTown({ deficitPct, surplusPct: 0, storageMonths: 0.2, resilienceScore: 30 }),
      { interval: 'one_month', tick: 1 },
    );
    expect(summary.tithed).toBe(true);
    expect(summary.storageMonths).toBe(Math.round((0.2 + months * (T.reserveTithePct / 100)) * 100) / 100);
    expect(summary.effectiveDeficitPct).toBe(deficitPct + T.reserveTithePct);
  });
});
