/** @vitest-environment jsdom */
/**
 * anonRandomForgeIsNeverDiscarded.test.js — A ROLL IS NOT A MISTAKE THE READER MADE.
 *
 * ── THE DEFECT (adversarial review of the second wave, BLOCKING) ────────────────
 * An anonymous visitor's config is DEFAULT_CONFIG, whose `settType` is 'random'. The
 * generator resolved that by `rng.pick(TIER_ORDER)`, and TIER_ORDER's first rung is
 * `thorp` — which §934.34 put BELOW the anonymous floor. So one roll in six ran the
 * whole pipeline (tier, population, institutions, roster, narrative, the lot) and was
 * then thrown away by the store's post-resolution re-gate, which answered a reader who
 * had asked for nothing in particular with a refusal about a size they never chose.
 *
 * ⭐ THE CURE IS THAT THE ROLL LEARNS THE RANGE. The gate already knows which rungs it
 * admits; the store sends that pool to the roll as `_allowedTiers`, and only when the
 * range is NARROWER than the ladder. The roll stays the generator's, in the generator's
 * own stream, at the same point in it.
 *
 * ── WHAT EACH ARM PROVES, AND WHY THERE ARE TWO ────────────────────────────────
 * The cure has two halves and either could rot alone. THE LANE half is proved against
 * the REAL `createAuthSlice` driving the REAL generation lane, with only the transport
 * stubbed, so the pool is the shipped gate's answer rather than a list this file typed.
 * THE ROLL half is proved against the REAL pipeline over thirty seeds, because a store
 * test that stopped at "the key was sent" would pass just as happily against a
 * generator that ignored it.
 *
 * ⛔ THE ANTI-VACUITY ARM IS THE UNCONSTRAINED RUN. "Every tier landed inside the pool"
 * is also true of a pool that changed nothing, so the same thirty seeds are rolled
 * WITHOUT the key and must land outside it: three of the ladder's six rungs are outside
 * the anonymous range, so a pool that was never read cannot hide here.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createAuthSlice } from '../../src/store/authSlice.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { TIER_ORDER } from '../../src/data/constants.js';
import { ANON_SIZES } from '../../src/config/tierFacts.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(), Funnel: {}, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

/** The transport seam, stubbed so it can REPORT the config the lane handed it. */
const engine = vi.hoisted(() => ({ lastRequest: null }));
vi.mock('../../src/lib/generationClient.js', () => ({
  runGeneration: async (request) => {
    engine.lastRequest = request;
    return {
      result: {
        settlement: { name: 'Forged', tier: 'town' },
        preservation: null,
        resolvedConfig: request?.payload?.fullConfig ?? null,
        pipelineHistory: [],
      },
    };
  },
}));

beforeEach(() => { window.localStorage.clear(); engine.lastRequest = null; });
afterEach(() => { window.localStorage.clear(); });

/**
 * A store the lane can drive whose every GATE ANSWER comes from a live auth slice.
 * @param {string} tier
 * @param {string} settType
 */
function laneStore(tier, settType) {
  const gate = create(immer((...a) => ({ ...createAuthSlice(...a) })));
  gate.setState((s) => { s.auth.tier = tier; });
  const ask = (name) => (...args) => gate.getState()[name](...args);
  const state = {
    config: { ...DEFAULT_CONFIG, settType },
    institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
    importedNeighbour: null, settlement: null, locks: null, activeSaveId: null,
    randomSliderMode: false, auth: { tier, user: null }, lastRefusal: null,
    canCustomizePreGeneration: ask('canCustomizePreGeneration'),
    isTierAllowed: ask('isTierAllowed'),
    isTierBelowFloor: ask('isTierBelowFloor'),
    minAllowedTier: ask('minAllowedTier'),
    maxAllowedTier: ask('maxAllowedTier'),
  };
  return { state, set: (fn) => { fn(state); }, get: () => state };
}

async function runLane(store, seed) {
  const { generateSettlementAction } = await import('../../src/store/settlementGenerateAction.js');
  try {
    return await generateSettlementAction(store.set, store.get, seed, undefined);
  } catch {
    return null;
  }
}

/** The config the lane actually handed the engine on the last run. */
const sentConfig = () => engine.lastRequest?.payload?.fullConfig ?? null;

describe('THE LANE — the gate\'s own range reaches the roll', () => {
  test('an anonymous \'random\' forge carries exactly the rungs the gate admits', async () => {
    const store = laneStore('anon', 'random');
    await runLane(store, 'seed-pool');
    expect(engine.lastRequest, 'the engine was never reached').not.toBeNull();
    expect(sentConfig()._allowedTiers).toEqual([...ANON_SIZES]);
    // …and the pool really is narrower than what the roll would otherwise draw from.
    expect(sentConfig()._allowedTiers.length).toBeLessThan(TIER_ORDER.length);
    for (const rung of sentConfig()._allowedTiers) {
      expect(TIER_ORDER, `${rung} is not a rung the generator rolls`).toContain(rung);
    }
    // The sentinel is UNTOUCHED: the reader still asked for random, the telemetry still
    // reads it as a rolled generation, and nothing was silently resolved on main.
    expect(sentConfig().settType).toBe('random');
    expect(store.state.lastRefusal, 'the forge was refused rather than aimed').toBeNull();
  });

  test('a free account reaches the whole ladder, so NOTHING is threaded', async () => {
    const store = laneStore('free', 'random');
    await runLane(store, 'seed-pool');
    // The absence is the contract: an uncapped generation must reach the pipeline
    // byte-identical, which is what keeps every golden unmoved.
    expect(sentConfig()._allowedTiers).toBeUndefined();
    expect('_allowedTiers' in sentConfig()).toBe(false);
  });

  test('a CONCRETE size threads nothing — there is no roll to aim', async () => {
    const store = laneStore('anon', 'town');
    await runLane(store, 'seed-pool');
    expect(sentConfig().settType).toBe('town');
    expect(sentConfig()._allowedTiers).toBeUndefined();
  });

  test('\'custom\' threads nothing: its size is a number the reader typed', async () => {
    // A population the reader entered is not a roll, so the post-resolution re-gate
    // stays the honest answer there and its sentence stays true.
    const store = laneStore('anon', 'custom');
    await runLane(store, 'seed-pool');
    expect(sentConfig().settType).toBe('custom');
    expect(sentConfig()._allowedTiers).toBeUndefined();
  });
});

describe('THE ROLL — the generator honours the pool, and needs it to', () => {
  /** A corpus-shaped config: the golden master's own key set, rolled on size. */
  const cfgFor = (extra) => ({
    settType: 'random',
    culture: 'germanic',
    terrainOverride: 'plains',
    tradeRouteAccess: 'road',
    monsterThreat: 'civilized',
    ...extra,
  });
  const SEEDS = Array.from({ length: 30 }, (_, i) => `pool-seed-${i}`);
  const tierFor = (config, seed) =>
    generateSettlementPipeline(config, null, { seed, customContent: {} }).tier;

  test('thirty anonymous rolls all land inside the range — none is discarded', () => {
    const pool = [...ANON_SIZES];
    const rolled = SEEDS.map((seed) => tierFor(cfgFor({ _allowedTiers: pool }), seed));
    expect(rolled.length).toBe(30);
    const outside = rolled.filter((tier) => !pool.includes(tier));
    expect(
      outside,
      'a roll landed outside the account\'s range — the store would discard that finished'
      + ' settlement and refuse a reader who chose nothing',
    ).toEqual([]);
    // ANTI-VACUITY within the pool: a pool of three that only ever returns one rung
    // would satisfy the arm above while having broken the roll.
    expect(new Set(rolled).size, 'the roll collapsed to a single size').toBeGreaterThan(1);
  }, 120_000);

  test('WITHOUT the pool those same seeds leave the range — so the pool is doing the work', () => {
    const pool = [...ANON_SIZES];
    const unconstrained = SEEDS.map((seed) => tierFor(cfgFor({}), seed));
    const outside = unconstrained.filter((tier) => !pool.includes(tier));
    expect(
      outside.length,
      'the unconstrained roll never left the anonymous range, so the arm above proves'
      + ' nothing about `_allowedTiers`',
    ).toBeGreaterThan(0);
    // …and the rungs it reaches are the ladder's, unchanged: an absent key means
    // TIER_ORDER, which is what keeps the golden manifest byte-identical.
    for (const tier of unconstrained) expect(TIER_ORDER).toContain(tier);
  }, 120_000);

  test('an EMPTY pool is not a pool: the roll falls back to the whole ladder', () => {
    // A gate that admits nothing is a misconfiguration, not an instruction to generate
    // nothing. The store never sends an empty array; the generator refuses to honour one
    // anyway, because a zero-length `rng.pick` returns undefined and a settlement with no
    // tier is worse than one the re-gate can still refuse.
    const tier = tierFor(cfgFor({ _allowedTiers: [] }), SEEDS[0]);
    expect(TIER_ORDER).toContain(tier);
    expect(tier).toBe(tierFor(cfgFor({}), SEEDS[0]));
  }, 120_000);
});
