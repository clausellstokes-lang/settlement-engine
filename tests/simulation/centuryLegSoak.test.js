/**
 * centuryLegSoak.test.js — TIER 1, THE CENTURY LEG (SOAKCHAIN Car 3; DESIGN_HORIZON §4.1).
 *
 * A hundred years of a hand-authored, receipted, LIGHT realm driven through THE PRODUCT
 * ADVANCE ENTRY at the product grain (`simulateCampaignWorldInterval`, `one_year` = 52
 * weekly kernel ticks), inside the check chain. Not a second soak — the one-soak law
 * forbids that; Tier 2's research leg IS the soak. This is the estate's in-chain idiom.
 *
 * WHY 100 YEARS AND NOT FEWER: `CERTIFICATION_HORIZONS.release.years = 100` is "the only
 * horizon that can earn the product certificate", and §141 refuses shortened centuries by
 * name. The horizon is never the thing that gets dropped; the SEED COUNT is.
 *
 * ── THE MEASURED FIGURES THIS FILE IS BUILT ON (Car 0's measurement half, ledger §882.12,
 *    receipt `laneG0SOAK-receipt.md`, nine runs all exit 0 — re-measured, never inherited)
 *
 *   ms/year   435.5 median at 10 y, 474.5 at 30 y, 523.5 at 100 y SHIPPED — the cost RISES
 *             with horizon on the hand fixture (the generated realm's FELL), so a budget
 *             set from a ten-year rate under-prices the century by 20 %
 *   the legs  `century-a` SHIPPED 100 y = 53.06 s · `century-a` LIT 100 y = 104.90 s (1.98x
 *             the shipped century) · the 10-year replay = 4.71 s · `century-b` SHIPPED
 *             100 y = 59.84 s · (`century-c` SHIPPED 100 y = 57.41 s, measured, NOT run here)
 *   the file  1 seed 162.7 s (45.2 % of the 360 s budget) · 2 seeds 222.5 s (61.8 %) ·
 *             3 seeds 279.9 s (77.8 %)
 *
 * ⭐ LITERAL 1 — `SEEDS = ['century-a', 'century-b']`, TWO. Three FIT the dev-box budget,
 * but §4.5 binds the count to the CI budget, not the dev box, and ⟦A23 E7⟧ makes this
 * addition CUMULATIVE with WRWALKER's second corpus build and COVERAGE's census inside the
 * ONE 30-minute `check-tests` job. At three seeds a hosted runner only has to be 1.29x
 * slower than this Mac to breach; at two it has to be 1.62x. `'century-c'` is a ONE-LINE
 * ADD and every figure for it is already measured — the CI budget read before boarding may
 * take it (S3-c drops `-c` first, then `-b`, and NEVER the horizon).
 *
 * ⛔ LITERAL 3 IS REFUSED, AND THAT IS WHY THERE IS NO 1.5x BOUND ASSERTION BELOW. §4.1
 * asks the LIT leg to assert `population <= 1.5 x effectiveBoundOf(...)`, "tightening
 * toward the measured max, never loosening past 1.5". Car 0 measured the max at **3.5741x**
 * (`leg-c`, year 15, population 386 against bound 108) with eight of 100 years above 1.5,
 * so the rule admits NO value and the arm as written would land RED ON A HEALTHY WORLD.
 * THE CAUSE IS THE DENOMINATOR: `densityCeilingOf` fell 720 -> 108 in ONE year on a tier
 * demotion (hamlet 600 x riverside 1.20 = 720; thorp 90 x 1.20 = 108) while the population
 * FELL 277 -> 221, and `effectiveBoundOf` is `min(K_food, D_tier)`. §14 E11 is REFUTED. The
 * ratio is MEASURED and REPORTED here so CAPACITY's author has the series; the reshape
 * (`population(y) <= 1.5 x max(bound(y), bound(y-1))`, plus a row on
 * `foodCapacityOf(...).mouths` alone) is theirs to take and is not invented here. §4.7 R3
 * routes a bound red to CAPACITY and forbids banking it.
 *
 * ⭐ THE ONE PLANNED EDIT TO THIS FILE. ⟦CHAIR-R9⟧: when the LIGHTING WAVE lights the
 * preset — before the GOLDEN freeze, not at the tuning pass — the SHIPPED leg IS the LIT
 * leg, and the SHIPPED reporting arm is retired in the WAVE'S OWN COMMIT. Nothing else in
 * this file is planned to change.
 *
 * ⚠ WALL-CLOCK IS REPORTED, NEVER ASSERTED, for the reason §4.1 gives for memory: vitest
 * shares a process and a heap, so an in-test duration ceiling is a flake instrument. A slow
 * hosted runner must not red the world's certification for being slow. The 360 s budget is
 * a constraint on the SEED COUNT, discharged by Car 0's measurement above.
 */

import { createHash } from 'node:crypto';

import { afterAll, describe, expect, test } from 'vitest';

import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import {
  LIVENESS_FLOOR,
  YEARLY_BYTES_PER_SETTLEMENT_CEILING,
  foldDecades,
  livenessVerdict,
  nonFinitePaths,
  populationEnvelopeVerdict,
} from '../../scripts/audit/soakInvariants.mjs';
import { composeSoakRules, soakAdvanceEpoch } from '../../scripts/audit/soakRules.mjs';
import { observeBehavioralYear } from '../../scripts/audit/behavioral-observation.mjs';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceInterval.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import {
  densityCeilingOf,
  effectiveBoundOf,
  foodCapacityOf,
} from '../../src/domain/worldPulse/demographicsRates.js';

const HORIZON_YEARS = 100;
const TICKS_PER_YEAR = 52;
const REPLAY_YEARS = 10;
const SEEDS = ['century-a', 'century-b'];
const NOW = '2026-07-12T00:00:00.000Z';
const RUNAWAY_MULTIPLE = 50;

const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/**
 * §4.1's fixture: four settlements, ONE PER TIER BAND. Populations sit at ~0.71-0.77 of
 * each place's effective bound — measured, not guessed (start bounds: leg-a 3900 granary,
 * leg-b 810 granary, leg-c 420 granary, leg-d 54 walls) — so the LIT leg has honest
 * headroom in BOTH directions. A fixture already at its bound could not show growth and one
 * far below it could not show a ceiling.
 *
 * ⚠ DECLARED DELTAS FROM §4.1's LIST, so a reader reproduces THIS instrument and not a
 * similar one: `name`, `institutions: []` and empty export/import arrays (the
 * `worldTickCostEnvelope.test.js:38-58` hand-fixture idiom), and NO spatial canon. Both are
 * inert to every figure below and both are Car 0's, carried verbatim.
 */
const BAND = [
  { id: 'leg-a', name: 'Aldmarch', tier: 'town', terrain: 'plains', pop: 3000, access: 'crossroads' },
  { id: 'leg-b', name: 'Brackfen', tier: 'village', terrain: 'forest', pop: 600, access: 'road' },
  { id: 'leg-c', name: 'Cairnford', tier: 'hamlet', terrain: 'riverside', pop: 300, access: 'river' },
  { id: 'leg-d', name: 'Dunthorpe', tier: 'thorp', terrain: 'mountain', pop: 40, access: 'remote' },
];

function handSettlement({ name, tier, terrain, pop, access }, index) {
  const dailyNeed = pop * 2;
  return {
    name,
    tier,
    population: pop,
    config: { tier, terrainType: terrain, tradeRouteAccess: access },
    institutions: [],
    economicState: {
      primaryExports: [],
      primaryImports: [],
      // The cure pin's `place()` shape — what makes `foodCapacityOf` RECEIPTED
      // (`foodLedger.js:55` reads exactly `economicState.foodSecurity`).
      foodSecurity: {
        dailyNeed,
        dailyProduction: Math.round(dailyNeed * 1.15),
        foodRatio: 1.15,
        deficitPct: 0,
        surplusPct: 15,
        importDependency: 0.15,
        storageMonths: 4,
        magicSupplement: 0,
        resilienceScore: 60 + (index * 3),
      },
    },
    powerStructure: {
      publicLegitimacy: { score: 44 + (index * 7), label: 'Contested' },
      factions: [
        { faction: 'Grain Factors', category: 'economy', power: 62 - (index * 4) },
        { faction: 'Hall Wardens', category: 'political', power: 48 + (index * 3) },
        { faction: 'Rill Chapter', category: 'religious', power: 40 + (index * 2) },
      ],
      conflicts: [],
    },
    npcs: [
      { id: `reeve_${index}`, name: `Reeve of ${name}`, importance: 'key', faction: 'Grain Factors' },
      { id: `warden_${index}`, name: `Warden of ${name}`, importance: 'notable', faction: 'Hall Wardens' },
    ],
    activeConditions: [],
  };
}

function buildFixture(seed, { lit }) {
  const saves = BAND.map((band, index) => ({
    id: band.id,
    name: band.name,
    phase: 'canon',
    settlement: handSettlement(band, index),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }));
  const edges = [
    { id: 'edge.leg-a.leg-b', from: 'leg-a', to: 'leg-b', relationshipType: 'trade_partner' },
    { id: 'edge.leg-b.leg-c', from: 'leg-b', to: 'leg-c', relationshipType: 'trade_partner' },
    { id: 'edge.leg-c.leg-d', from: 'leg-c', to: 'leg-d', relationshipType: 'trade_partner' },
    { id: 'edge.leg-a.leg-c', from: 'leg-a', to: 'leg-c', relationshipType: 'rival' },
  ];
  const channels = [
    { type: 'trade_dependency', from: 'leg-a', to: 'leg-b', status: 'confirmed', strength: 0.55, goods: [] },
    { type: 'trade_dependency', from: 'leg-b', to: 'leg-c', status: 'confirmed', strength: 0.55, goods: [] },
    { type: 'trade_dependency', from: 'leg-c', to: 'leg-d', status: 'confirmed', strength: 0.55, goods: [] },
  ];
  // ⛔ THE OVERLAY IS APPLIED THROUGH `composeSoakRules`, ABOVE the preset — the charter's
  // highest-risk law and the same seam the soak's own `--lighting demographicsEnabled=true`
  // uses. The preset is never mutated, so the dormancy pins keep proving it dark.
  const { fullRules } = composeSoakRules({
    preset: SIMULATION_RULE_PRESETS.full_simulation.rules,
    seasons: 'preset',
    overlay: lit ? { demographicsEnabled: true } : {},
  });
  return {
    saves,
    campaign: {
      id: 'century-leg',
      name: 'Century Leg Realm',
      settlementIds: BAND.map((band) => band.id),
      regionalGraph: ensureRegionalGraph({ edges, channels }, { now: NOW }),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: {
        rngSeed: seed,
        tick: 0,
        canonizedAt: NOW,
        simulationRules: fullRules,
        stressors: [{
          id: 'world_stressor.famine.leg-c',
          type: 'famine',
          severity: 0.85,
          affectedSettlementIds: ['leg-c'],
        }],
      },
    },
  };
}

/** Every settlement's effective bound at one instant, with which constraint is binding. */
function boundsOf(saves, worldState) {
  const out = {};
  for (const save of saves) {
    const bound = effectiveBoundOf(
      foodCapacityOf(save.settlement, worldState, save.id),
      densityCeilingOf(save.settlement, worldState, save.id),
    );
    out[save.id] = {
      bound: bound.bound,
      binding: bound.binding,
      food: bound.foodCapacity,
      density: bound.densityCeiling,
    };
  }
  return out;
}

/**
 * One N-year leg, threading state EXACTLY as `whole-world-soak.mjs:runYears` does and
 * hashing the SAME three-key composite (`:453-457`) — the spelling two lanes proved by
 * reproducing the real soak's `yearlyHashes[0]` exactly.
 */
async function runLeg(seed, years, { lit }) {
  const { campaign, saves } = buildFixture(seed, { lit });
  let runningCampaign = campaign;
  let runningSaves = saves;
  const yearlyHashes = [];
  const yearlyEventTypeCounts = [];
  const yearlyMajorCounts = [];
  const yearlyPopulations = [];
  const yearlyDiedFlags = [];
  const yearlyBytes = [];
  const yearlyBounds = [];
  const yearlyNonFinite = [];
  let peakHeapUsedBytes = process.memoryUsage().heapUsed;
  const startedAt = Date.now();

  for (let year = 1; year <= years; year += 1) {
    const beforeSaves = runningSaves;
    const rawWizardNewsById = new Map();
    const advanceEpoch = soakAdvanceEpoch({
      simulationRules: runningCampaign?.worldState?.simulationRules,
      seed,
      year,
    });
    const result = await simulateCampaignWorldInterval({
      campaign: runningCampaign,
      saves: runningSaves,
      interval: 'one_year',
      commit: true,
      now: NOW,
      autoResolve: true,
      advanceEpoch,
      onTickObservation: ({ rawWizardNewsEntries }) => {
        for (const entry of rawWizardNewsEntries || []) {
          if (!entry || typeof entry !== 'object' || !entry.id) continue;
          rawWizardNewsById.set(String(entry.id), entry);
        }
      },
    });
    if (result.status === 'paused') {
      throw new Error(`[century:${seed}] year ${year} PAUSED under autoResolve:true — the orchestrator contract is broken`);
    }
    runningCampaign = {
      ...runningCampaign,
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      wizardNews: result.wizardNews,
    };
    if (Array.isArray(result.settlementUpdates) && result.settlementUpdates.length) {
      const byId = new Map(result.settlementUpdates.map((update) => [String(update.saveId), update.settlement]));
      runningSaves = runningSaves.map((save) => (byId.has(String(save.id))
        ? { ...save, settlement: byId.get(String(save.id)) }
        : save));
    }
    const observation = observeBehavioralYear({
      year,
      result,
      beforeSaves,
      afterSaves: runningSaves,
      rawWizardNewsEntries: [...rawWizardNewsById.values()],
    });
    yearlyEventTypeCounts.push(observation?.eventTypeCounts || {});
    yearlyMajorCounts.push(observation?.majorEventCount ?? 0);
    yearlyNonFinite.push(nonFinitePaths({
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      settlements: runningSaves.map((save) => save.settlement),
    }));
    yearlyHashes.push(sha({
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      settlements: runningSaves.map((save) => save.settlement),
    }));
    yearlyPopulations.push(runningSaves.map((save) => Number(save.settlement?.population) || 0));
    yearlyDiedFlags.push(runningSaves.map((save) => Number.isFinite(Number(save.settlement?.config?.lifecycleDiedAtTick))));
    // The bound is captured PER YEAR, live. ⚠ An endpoint-only measurement reported a max of
    // 0.8049 and would have CONFIRMED §14 E11 falsely; the real maximum is at year 15.
    yearlyBounds.push(boundsOf(runningSaves, result.worldState));
    yearlyBytes.push(JSON.stringify(result.worldState).length + JSON.stringify(result.regionalGraph).length);
    peakHeapUsedBytes = Math.max(peakHeapUsedBytes, process.memoryUsage().heapUsed);
  }

  return {
    seed,
    years,
    lit,
    totalMs: Date.now() - startedAt,
    finalTick: runningCampaign?.worldState?.tick ?? null,
    ids: BAND.map((band) => band.id),
    startPopulations: BAND.map((band) => band.pop),
    yearlyHashes,
    yearlyEventTypeCounts,
    yearlyMajorCounts,
    yearlyPopulations,
    yearlyDiedFlags,
    yearlyBytes,
    yearlyBounds,
    yearlyNonFinite,
    peakHeapUsedBytes,
  };
}

/** The liveness verdict of one leg, through the estate's ONE fold. */
function livenessOf(leg) {
  return livenessVerdict(
    foldDecades({
      yearlyEventTypeCounts: leg.yearlyEventTypeCounts,
      yearlyHashes: leg.yearlyHashes,
      yearlyMajorCounts: leg.yearlyMajorCounts,
      settlements: BAND.length,
    }),
    { years: leg.years, settlements: BAND.length },
  );
}

/** The realm total at one year index. */
const realmTotalAt = (leg, index) => leg.yearlyPopulations[index].reduce((sum, value) => sum + value, 0);

/** @type {{shippedA?: object, litA?: object, replayA?: object, shippedB?: object}} */
const legs = {};

/**
 * ⭐ THE LEGS ARE MEMOISED PER TEST, NOT RUN UP FRONT IN ONE HOOK (LT28 car 2, 2026-09-15).
 *
 * WHAT THIS CHANGED AND WHY. Every leg used to run inside ONE `beforeAll(…, 900_000)`.
 * That hook is a SINGLE POINT OF CENSUS COLLAPSE: when it does not finish, vitest reports
 * all NINE tests as SKIPS, the suite yields zero measurable tests, and
 * `scripts/check-test-ratchet.mjs` fires its SCOPE SENTINEL (:1275) plus the skip ceiling
 * (:1394) on top of it. That verdict CANNOT BE BANKED — `baseline.uncollectedSuites` is
 * pinned at length 0 by `tests/lint/testRatchet.test.js:540` — so one slow hook takes the
 * whole gate down with no lawful repair available.
 *
 * ⭐ MEASURED IN BOTH DIRECTIONS, 2026-09-15, 8 cores (LT28 car 1) — the collapse is COST,
 * never correctness: standalone at 1-min load 2.38 the file is `9 passed` in 261.42 s; in a
 * full `npm run test:ratchet` whose own parallelism sat at load 26.30/31.44/23.82 the file
 * was GREEN; in a second full ratchet run that ended at load 146.89/160.11/127.79 it
 * collapsed with the byte-identical sentinel message. Same sha, same bytes, three loads.
 *
 * WHAT THE SPLIT BUYS. `legFor` runs each leg AT MOST ONCE and awaits the legs BEFORE it in
 * `LEG_ORDER` first, so the execution order is byte-identical to the old hook's
 * (shippedA → litA → replayA → shippedB). That order is load-bearing: the replay arm exists
 * to catch module-scope cache warmth, so which legs have run before it is part of what it
 * proves. What changes is only WHO PAYS: each test carries its own declared 300_000 ms
 * budget, so a leg that overruns fails THE TESTS THAT ASKED FOR IT with a real message
 * instead of pending all nine. A failed row keeps the suite MEASURABLE — `uncollectedOf`
 * (`scripts/check-test-ratchet.mjs:503`) only calls a suite uncollected when it failed with
 * NO row of status `failed` — so the unbankable sentinel is no longer reachable by slowness.
 *
 * ⛔ NOTHING WAS TRADED FOR THIS. The horizon is still 100 years, both seeds still run, all
 * four legs still run in the same order, no assertion moved, and the suite-wide
 * `testTimeout` is untouched (START_HERE §3k forbids raising it by name).
 *
 * ── THE PER-TEST BUDGETS, AND WHERE THEIR NUMBER COMES FROM ──────────────────────────
 * The 900_000 ms that used to sit on the hook was a budget for ALL FOUR legs together, and
 * 2026-09-15 proved it is not enough on honest hardware: a full ratchet run that ended at
 * load 146.89/160.11/127.79 blew it. So the budget FOLLOWS THE WORK rather than being
 * inherited: each row is sized at the worst CONTENTION MULTIPLE this box has been measured
 * to produce at the test grain — 8.3x, from `tests/domain/stateProseKernel.test.js`'s law-6
 * row, which costs 7,483 ms alone and was killed at 61,996 ms inside the same ratchet run.
 *
 *   600_000    every row that may wait on ONE leg. 8.3x the dearest single leg (LIT,
 *              104.90 s) is 871 s; 600 s covers every leg but the pair below, and a row
 *              that overruns it fails ALONE and says so.
 *   1_200_000  the replay row ONLY, because `legFor` runs the legs in their declared order
 *              and the replay is declared after the LIT century — so that one row pays
 *              104.90 + 4.71 = 109.61 s of legs, and 8.3x of that is 910 s.
 *
 * ⚠ A ROW THAT EXPIRES IS A COST FAILURE, NEVER DEBT, and it must never be banked: the
 * census refuses it by name (`scripts/check-test-ratchet.mjs`, the budget-expiry note).
 */
const LEG_ORDER = ['shippedA', 'litA', 'replayA', 'shippedB'];

/** @type {Record<string, () => Promise<object>>} */
const LEG_RUNNERS = {
  shippedA: () => runLeg(SEEDS[0], HORIZON_YEARS, { lit: false }),
  litA: () => runLeg(SEEDS[0], HORIZON_YEARS, { lit: true }),
  replayA: () => runLeg(SEEDS[0], REPLAY_YEARS, { lit: false }),
  shippedB: () => runLeg(SEEDS[1], HORIZON_YEARS, { lit: false }),
};

/** @type {Record<string, Promise<object>>} */
const started = {};

/**
 * ⚠ THE NEGATIVE CONTROL SEAM. Naming a leg here forces it to THROW, which is how the
 * census instrument's behaviour on a broken leg is proved rather than assumed. It can only
 * ever make the gate REDDER — there is no value of it that skips a test or greens an
 * assertion — so it is not a door in the certification.
 */
const FAULT_LEG = process.env.CENTURY_LEG_FAULT || '';

/** Run (or reuse) one leg, having first run every leg declared before it. */
async function legFor(name) {
  for (const key of LEG_ORDER) {
    if (!started[key]) {
      started[key] = (async () => {
        if (FAULT_LEG === key) throw new Error(`CENTURY_LEG_FAULT: leg "${key}" forced to throw`);
        legs[key] = await LEG_RUNNERS[key]();
        return legs[key];
      })();
    }
    await started[key];
    if (key === name) return legs[key];
  }
  throw new Error(`unknown century leg "${name}"`);
}

describe('Tier 1 — the century leg on a light hand-authored realm', () => {
  afterAll(() => {
    const ran = LEG_ORDER.filter((key) => legs[key]);
    if (!ran.length) return;
    const totalMs = ran.reduce((sum, key) => sum + legs[key].totalMs, 0);
    const peak = Math.max(...ran.map((key) => legs[key].peakHeapUsedBytes));
    // REPORTED, never asserted — see the file header. Memory in particular is a flake
    // instrument in a shared vitest heap; Tier 2's register bands it on a solo run.
    // A leg that did not run says so rather than being silently omitted from the total.
    const say = (key, label) => (legs[key] ? `${label} ${(legs[key].totalMs / 1000).toFixed(1)}s` : `${label} (not run)`);
    console.log(
      `\n[century leg] ${SEEDS.length} seed(s), ${HORIZON_YEARS} years at the product grain`
      + ` (${TICKS_PER_YEAR} weekly ticks/year)`
      + `\n  ${say('shippedA', `SHIPPED ${SEEDS[0]}`)}`
      + ` · ${say('litA', `LIT ${SEEDS[0]}`)}`
      + ` · ${say('replayA', `replay ${REPLAY_YEARS}y`)}`
      + ` · ${say('shippedB', `SHIPPED ${SEEDS[1]}`)}`
      + `\n  file total ${(totalMs / 1000).toFixed(1)}s over ${ran.length} of ${LEG_ORDER.length} leg(s)`
      + ' (design budget 360s; Car 0 measured 222.5s for two seeds)'
      + `\n  peak heap across legs ${(peak / 1e6).toFixed(0)}MB — REPORTED, not asserted`,
    );
  });

  test('the SHIPPED century advances the whole horizon at the product grain', async () => {
    await legFor('shippedA');
    expect(legs.shippedA.finalTick).toBe(HORIZON_YEARS * TICKS_PER_YEAR);
    expect(legs.shippedA.yearlyHashes).toHaveLength(HORIZON_YEARS);
    // §141 refuses shortened centuries by name; the horizon is never what gets dropped.
    expect(legs.shippedA.years).toBe(HORIZON_YEARS);
  }, 600_000);

  test('no non-finite figure appears in any year of the SHIPPED century', async () => {
    await legFor('shippedA');
    const failures = collectSeedFailures(legs.shippedA.yearlyNonFinite, (paths, index) => {
      expect(paths, `year ${index + 1} carried a non-finite figure`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'every year of the SHIPPED century is finite');
  }, 600_000);

  test('every settlement is alive every year of the SHIPPED century, remnants excepted', async () => {
    await legFor('shippedA');
    // The remnant law (2026-07-31): a properly-died settlement legitimately holds zero.
    const failures = collectSeedFailures(legs.shippedA.yearlyPopulations, (populations, yearIndex) => {
      populations.forEach((population, placeIndex) => {
        const died = Boolean(legs.shippedA.yearlyDiedFlags[yearIndex][placeIndex]);
        expect(
          Number.isFinite(population) && (population > 0 || died),
          `${legs.shippedA.ids[placeIndex]} held ${population} at year ${yearIndex + 1} with died=${died}`,
        ).toBe(true);
      });
    });
    expectNoSeedFailures(failures, 'every settlement of the SHIPPED century is alive or lawfully dead');
  }, 600_000);

  test('the SHIPPED century holds the serialized-state envelope with room', async () => {
    await legFor('shippedA');
    const ceiling = YEARLY_BYTES_PER_SETTLEMENT_CEILING * BAND.length;
    const maxBytes = Math.max(...legs.shippedA.yearlyBytes);
    expect(maxBytes).toBeLessThan(ceiling);
    // Car 0 measured 1,075,435 B against the 3,600,000 B ceiling — 30 % of it.
    expect(ceiling).toBe(3_600_000);
  }, 600_000);

  test('the SHIPPED century passes the liveness floor, and its realm ratio is REPORTED not asserted', async () => {
    await legFor('shippedA');
    const verdict = livenessOf(legs.shippedA);
    expect(verdict.executable).toBe(true);
    expect(verdict.failures).toEqual([]);
    expect(verdict.rows).toHaveLength(HORIZON_YEARS / LIVENESS_FLOOR.decadeYears);
    // ⛔ THE RATIO IS PRINTED, NOT ASSERTED (§4.1's JUDGMENT). At 100 years on the shipped
    // preset the ledger records a red (100y×4s failed 2026-07-31) and the ratchet's
    // known-failure census is 10/10 with no headroom, so a Tier-1 arm born red could not be
    // banked. ⚠ Car 0's amendment 3 carries the correction: that ledger red belongs to a
    // GENERATED realm, and on THIS light hand fixture the ratio passes with room on all
    // three seeds (0.2713 / 0.1799 / 0.1332). The conclusion stands; its stated ground does
    // not transfer, and the envelope is asserted where it is TRUE BY DESIGN — the LIT leg.
    const envelope = populationEnvelopeVerdict({
      startTotal: legs.shippedA.startPopulations.reduce((sum, value) => sum + value, 0),
      finalTotal: realmTotalAt(legs.shippedA, HORIZON_YEARS - 1),
    });
    console.log(
      `[century leg] SHIPPED ${SEEDS[0]} realm ratio ${envelope.detail} — REPORTED, not asserted`
      + `; liveness min distinct types ${verdict.reported.minDistinctTypesPerDecade}`
      + `, min hash moves ${verdict.reported.minHashMovesPerDecade}`
      + `, majors min ${verdict.reported.minMajorsPerDecade} with ${verdict.reported.majorSilentDecades} silent decade(s)`,
    );
    expect(envelope.executable).toBe(true);
  }, 600_000);

  test('the SHIPPED decade replay is element-wise identical to the century first ten years', async () => {
    await legFor('replayA');
    // ⚠ THE WEAK FORM, DELIBERATELY. A same-process replay catches module-scope cache
    // warmth — the twelve `__tickIndexStats` caches, which Car 0 measured as a 5.6 % drift
    // across three in-process runs — and a second century would double the file's cost. The
    // full-horizon replay belongs to the watchdog and to Tier 2.
    const failures = collectSeedFailures(legs.replayA.yearlyHashes, (hash, index) => {
      expect(hash, `replay year ${index + 1} diverged`).toBe(legs.shippedA.yearlyHashes[index]);
    });
    expectNoSeedFailures(failures, 'the ten-year replay reproduces the century opening decade');
    expect(legs.replayA.yearlyHashes).toHaveLength(REPLAY_YEARS);
    // ⭐ THE PAIR BUDGET. This row is the one that triggers the LIT century (104.90 s) as
    // well as the replay (4.71 s), because `legFor` preserves the legs' ORDER and the LIT
    // leg is declared before the replay. 8.3x of that 109.61 s pair is 910 s — see the
    // budget note on the row above for where 8.3 comes from.
  }, 1_200_000);

  test('the LIT century holds the population envelope and no settlement runs away', async () => {
    await legFor('litA');
    // ⭐ THE CAPACITY HOOK. The envelope is asserted HERE, where it is true by design, and a
    // red is routed to CAPACITY as a finding and NEVER banked (§4.7 R3, STOP S3-a).
    const envelope = populationEnvelopeVerdict({
      startTotal: legs.litA.startPopulations.reduce((sum, value) => sum + value, 0),
      finalTotal: realmTotalAt(legs.litA, HORIZON_YEARS - 1),
    });
    expect(envelope.executable).toBe(true);
    expect(envelope.passed, `LIT realm ratio outside the envelope: ${envelope.detail}`).toBe(true);
    // The certification invariant's own figure. Car 0 measured the max growth at 1.3100x,
    // so this arm is green by 38x — and it is the arm that would catch a runaway.
    const failures = collectSeedFailures(legs.litA.yearlyPopulations, (populations, yearIndex) => {
      populations.forEach((population, placeIndex) => {
        const start = legs.litA.startPopulations[placeIndex];
        expect(
          population <= start * RUNAWAY_MULTIPLE,
          `${legs.litA.ids[placeIndex]} reached ${population} at year ${yearIndex + 1} from ${start}`,
        ).toBe(true);
      });
    });
    expectNoSeedFailures(failures, 'no LIT settlement exceeds fifty times its starting population');
    const verdict = livenessOf(legs.litA);
    expect(verdict.executable).toBe(true);
    expect(verdict.failures).toEqual([]);
  }, 600_000);

  test('the LIT bound ratio is MEASURED and REPORTED, and no allowance literal is asserted', async () => {
    await legFor('litA');
    // ⛔ THE ARM §4.1 ASKED FOR CANNOT BE WRITTEN — see the file header. The rule "tighten
    // toward the measured max, never loosen past 1.5" admits no value against a measured max
    // of 3.5741x, and the cause is the DENOMINATOR collapsing 6.7x on a lawful tier
    // demotion while the population FELL. Asserting a fixed multiple of a same-year bound
    // convicts the model for working. What this arm proves is that the MEASUREMENT is taken,
    // over every year and every settlement, so CAPACITY's author has the series the reshape
    // needs — and that it is a live measurement rather than an endpoint one.
    const samples = [];
    legs.litA.yearlyBounds.forEach((bounds, yearIndex) => {
      legs.litA.ids.forEach((id, placeIndex) => {
        const bound = Number(bounds[id]?.bound);
        const population = legs.litA.yearlyPopulations[yearIndex][placeIndex];
        if (bound > 0) samples.push({ id, year: yearIndex + 1, ratio: population / bound, binding: bounds[id]?.binding });
      });
    });
    expect(samples).toHaveLength(HORIZON_YEARS * BAND.length);
    const worst = samples.reduce((max, row) => (row.ratio > max.ratio ? row : max), samples[0]);
    const endpoint = samples.filter((row) => row.year === HORIZON_YEARS)
      .reduce((max, row) => (row.ratio > max.ratio ? row : max), { ratio: 0, id: 'none' });
    expect(Number.isFinite(worst.ratio)).toBe(true);
    // ⚠ THE ENDPOINT IS NOT THE MAXIMUM, and that is the whole reason the capture is
    // per-year: Car 0's first fold reported only endpoints (max 0.8049, comfortably inside
    // 1.5) and would have CONFIRMED §14 E11 falsely.
    console.log(
      `[century leg] LIT population/bound — max ${worst.ratio.toFixed(4)} at ${worst.id} year ${worst.year}`
      + ` (binding: ${worst.binding}); endpoint max ${endpoint.ratio.toFixed(4)} at ${endpoint.id}`
      + '\n  REPORTED, NOT ASSERTED: §14 E11 is REFUTED and the reshape is CAPACITY\'s author\'s'
      + ' (recommended: population(y) <= 1.5 x max(bound(y), bound(y-1)), with a second row on'
      + ' foodCapacityOf(...).mouths alone).',
    );
  }, 600_000);

  test('the second seed drives the same arms: finite, alive, bytes, liveness', async () => {
    await legFor('shippedB');
    // §4.1 gives `-b` (and `-c`) ONE drive test each: the second seed proves the arms
    // generalise, and a third would repeat the proof at 1.29x of budget margin.
    expect(legs.shippedB.finalTick).toBe(HORIZON_YEARS * TICKS_PER_YEAR);
    const failures = collectSeedFailures(legs.shippedB.yearlyNonFinite, (paths, index) => {
      expect(paths, `${SEEDS[1]} year ${index + 1} carried a non-finite figure`).toEqual([]);
    });
    expectNoSeedFailures(failures, `every year of ${SEEDS[1]} is finite`);
    const alive = collectSeedFailures(legs.shippedB.yearlyPopulations, (populations, yearIndex) => {
      populations.forEach((population, placeIndex) => {
        const died = Boolean(legs.shippedB.yearlyDiedFlags[yearIndex][placeIndex]);
        expect(
          Number.isFinite(population) && (population > 0 || died),
          `${legs.shippedB.ids[placeIndex]} held ${population} at year ${yearIndex + 1} with died=${died}`,
        ).toBe(true);
      });
    });
    expectNoSeedFailures(alive, `every settlement of ${SEEDS[1]} is alive or lawfully dead`);
    expect(Math.max(...legs.shippedB.yearlyBytes))
      .toBeLessThan(YEARLY_BYTES_PER_SETTLEMENT_CEILING * BAND.length);
    const verdict = livenessOf(legs.shippedB);
    expect(verdict.executable).toBe(true);
    expect(verdict.failures).toEqual([]);
  }, 600_000);
});
