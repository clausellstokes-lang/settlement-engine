/** @vitest-environment jsdom */
/**
 * anonRandomForgeIsNeverDiscarded.test.js — A ROLL IS NOT A MISTAKE THE READER MADE.
 *
 * ── THE DEFECT (adversarial review of the second wave, BLOCKING) ────────────────
 * An anonymous visitor's config is DEFAULT_CONFIG, whose `settType` is 'random'. The
 * generator resolves that by `rng.pick(TIER_ORDER)`, and TIER_ORDER's first rung is
 * `thorp` — which §934.34 put BELOW the anonymous floor. So one roll in six ran the
 * whole pipeline (tier, population, institutions, roster, narrative, the lot) and was
 * then thrown away by the store's post-resolution re-gate, which answered a reader who
 * had asked for nothing in particular with a refusal about a size they never chose.
 *
 * ⭐ THE CURE IS THAT THE GATE AIMS THE SENTINEL BEFORE THE ENGINE RUNS. The gate
 * already knows which rungs it admits; when that range is NARROWER than the ladder the
 * store draws one of them — deterministically, from the generation's own seed under a
 * distinct namespace — and hands the pipeline a concrete size. The generator is not
 * touched at all.
 *
 * ⛔ AND THAT IS WHY THE GENERATOR IS NOT TOUCHED. The obvious cure was to thread the
 * range into `resolveConfig` and let its roll draw from it. MEASURED, and rejected on
 * the evidence: the generator would then read a config key the GENERATION corpus never
 * writes, which tests/lint/observedShapeReaders.walker.test.js convicts as a reader with
 * no writer (`_allowedTiers on config — 3 read(s)`, a NEW identity). The roll is the
 * generator's; the range is the gate's; the boundary holds.
 *
 * ── WHAT EACH ARM PROVES, AND WHY THERE ARE TWO ────────────────────────────────
 * THE LANE half runs against the REAL `createAuthSlice` driving the REAL generation
 * lane, with only the transport stubbed, so the range is the shipped gate's answer
 * rather than a list this file typed. THE PIPELINE half runs the REAL generator,
 * because a store test that stopped at "a concrete size was sent" would prove nothing
 * about what that size produces — and its second arm is the defect's own receipt: the
 * UNAIMED sentinel really does leave the anonymous range on these seeds.
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

/** The size the lane aimed a capped sentinel at, for one seed. */
async function aimedFor(tier, seed) {
  const store = laneStore(tier, 'random');
  await runLane(store, seed);
  return sentConfig()?.settType;
}

const SEEDS = Array.from({ length: 30 }, (_, i) => `pool-seed-${i}`);

describe('THE LANE — the gate aims the sentinel it would otherwise discard', () => {
  test('thirty anonymous forges are all aimed inside the range, and none at a thorpe', async () => {
    const aimed = [];
    for (const seed of SEEDS) aimed.push(await aimedFor('anon', seed));
    expect(aimed.length).toBe(30);
    expect(
      aimed.filter((size) => !ANON_SIZES.includes(size)),
      'a forge was aimed outside the account\'s range — the store would discard that finished'
      + ' settlement and refuse a reader who chose nothing',
    ).toEqual([]);
    // ANTI-VACUITY: an aim that collapsed to one rung would satisfy the arm above while
    // having replaced a roll with a constant.
    expect(new Set(aimed).size, 'the aim collapsed to a single size').toBeGreaterThan(1);
  });

  test('the aim is DETERMINISTIC, and drawn off its own stream', async () => {
    // THE PROMISE: same seed, same config, same world — the aim is part of that now.
    expect(await aimedFor('anon', 'repeatable-seed')).toBe(await aimedFor('anon', 'repeatable-seed'));
    // …and the world's own seed is unchanged by it: what reaches the pipeline is the
    // caller's seed, not a derived one.
    const store = laneStore('anon', 'random');
    await runLane(store, 'repeatable-seed');
    expect(engine.lastRequest.payload.seed).toBe('repeatable-seed');
  });

  test('a free account reaches the whole ladder, so the sentinel is UNTOUCHED', async () => {
    const store = laneStore('free', 'random');
    await runLane(store, 'seed-pool');
    // The absence of an aim is the contract: an uncapped generation must reach the
    // pipeline byte-identical, which is what keeps every golden unmoved.
    expect(sentConfig().settType).toBe('random');
  });

  test('a CONCRETE size is passed through — there is no sentinel to aim', async () => {
    const store = laneStore('anon', 'town');
    await runLane(store, 'seed-pool');
    expect(sentConfig().settType).toBe('town');
  });

  test('\'custom\' is left alone: its size is a number the reader typed', async () => {
    // A population the reader entered is not a roll, so the post-resolution re-gate
    // stays the honest answer there and its sentence stays true.
    const store = laneStore('anon', 'custom');
    await runLane(store, 'seed-pool');
    expect(sentConfig().settType).toBe('custom');
  });

  test('the READER\'S stored config is untouched — they still asked for random', async () => {
    const store = laneStore('anon', 'random');
    await runLane(store, 'seed-pool');
    expect(store.state.config.settType, 'the aim was written back into the reader\'s config').toBe('random');
    expect(store.state.lastRefusal, 'the forge was refused rather than aimed').toBeNull();
  });
});

describe('THE PIPELINE — an aimed size is the size that comes out', () => {
  const cfgFor = (settType) => ({
    settType,
    culture: 'germanic',
    terrainOverride: 'plains',
    tradeRouteAccess: 'road',
    monsterThreat: 'civilized',
  });
  const tierFor = (config, seed) =>
    generateSettlementPipeline(config, null, { seed, customContent: {} }).tier;

  test('every rung the gate admits generates at exactly that rung', () => {
    for (const rung of ANON_SIZES) {
      expect(tierFor(cfgFor(rung), `aimed-${rung}`), `aiming at ${rung} produced another size`).toBe(rung);
    }
  }, 120_000);

  test('THE DEFECT ITSELF: the UNAIMED sentinel leaves the range on these seeds', () => {
    // This is the receipt, not a hypothetical. Three of the ladder's six rungs are
    // outside the anonymous range, and every one of these runs used to be generated in
    // full and then thrown away.
    const rolled = SEEDS.map((seed) => tierFor(cfgFor('random'), seed));
    const outside = rolled.filter((tier) => !ANON_SIZES.includes(tier));
    expect(
      outside.length,
      'the unconstrained roll never left the anonymous range, so the aim above proves'
      + ' nothing about the defect it cures',
    ).toBeGreaterThan(0);
    // …and the rungs it reaches are the ladder's, unchanged: the generator's roll is
    // exactly what it was, which is what keeps the golden manifest byte-identical.
    for (const tier of rolled) expect(TIER_ORDER).toContain(tier);
  }, 120_000);
});
