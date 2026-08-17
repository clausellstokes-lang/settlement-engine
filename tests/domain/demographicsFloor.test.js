/**
 * demographicsFloor.test.js — WAVE P1a, THE FLOOR. The other half of the bifurcation.
 *
 * THE FINDING (docs/DESIGN_DEMOGRAPHIC_ENGINE.md §0, executed evidence): the 300-year
 * research soak failed `realm population bounded` in TWO directions at once. Two
 * settlements compounded to 29.1 trillion people; six others FROZE between 200 and 500
 * and never moved again. P1 cured the top. This file is the bottom, and the design's
 * §0 is explicit that they are ONE defect: an uncapped proportional rate read through
 * an INTEGER DEADBAND.
 *
 *     populationDynamics.js  rawDelta = Math.round(pop * rate * magnitude)
 *     populationDynamics.js  if (Math.abs(delta) < Math.max(2, ...)) return null
 *
 * A shrinking settlement shrinks until its delta rounds to minus one, and then stops
 * forever, at pop* = 1.5 / (|rate| x magnitude). THE FIXTURES BELOW SIT ON THAT NUMBER:
 * at the soak's own one_year interval and a uniform pressure of 0.70 the closed form
 * gives 302, and the design's measured table gives 301. The fixture starts at 300 and
 * dark it does not move a single person in three hundred ticks.
 *
 * WHAT EACH SECTION PROVES, and the control that makes it non-vacuous:
 *
 *   1. THE UNFREEZE          lit the floored equilibrium resumes declining; DARK IT
 *                            STAYS FROZEN (the fence control), and a module-mock revert
 *                            that re-imposes the deadband re-freezes it (the cure
 *                            control), followed by a restore that must be green again.
 *   2. NO RESIDUAL FLOOR     the cure is not "lower the deadband to one". A fixture
 *                            where the EXPECTATION ITSELF rounds to zero still declines
 *                            lit, which a deadband of one could never do.
 *   3. THE DESCENT           the floored-six shape walks town, village, hamlet, thorp
 *                            and reaches the terminal lane; dark it stalls at hamlet at
 *                            exactly 300 people, forever.
 *   4. THE LABEL LAG         a settlement whose tier label cannot follow its census
 *                            (tier drift off) is immortal dark and mortal lit.
 *   5. PROMOTION             conserves lit on both arms, mints dark (a golden depends
 *                            on the dark arm), and earned ascension replaces the window
 *                            the mint was covering.
 *   6. ONE DEMOTION WRITER   a source census, not a claim.
 *   7. THE H3 FLOOR          the descent never draws below the resident named cast.
 *   8. THE DARK FENCE        four frozen trace hashes measured against HEAD itself.
 *   9. DETERMINISM           double pass, decorrelation, and a purity scan.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  evaluatePopulationDynamics, applyPopulationOutcomeToSettlement,
} from '../../src/domain/worldPulse/populationDynamics.js';
import { advanceDemographics } from '../../src/domain/worldPulse/demographicsKernel.js';
import {
  densityCeilingOf, effectiveBoundOf, foodCapacityOf, starvationDeficit01Of,
} from '../../src/domain/worldPulse/demographicsRates.js';
import {
  evaluateTierResourceDynamics, applyTierOutcomeToSettlement,
} from '../../src/domain/worldPulse/tierResourceDynamics.js';
import {
  evaluateSettlementLifecycle, applySettlementLifecycleOutcomeToSettlement,
} from '../../src/domain/worldPulse/settlementLifecycleFirstClass.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const RATES_MODULE = '../../src/domain/worldPulse/demographicsRates.js';

// ── THE FIXTURE ──────────────────────────────────────────────────────────────
// A settlement shaped like one of the floored six: real food physics, a modest granary,
// two named residents on its roster, and nothing exotic.
function place({
  id = 'Ashford', tier = 'town', population = 300, dailyProduction = 900, named = 2,
  deficitPct = 0, conditions = [],
} = {}) {
  return {
    population,
    tier,
    name: id,
    config: { tier, terrainType: 'plains' },
    economicState: {
      foodSecurity: {
        dailyNeed: population * 2, dailyProduction, deficitPct, surplusPct: 5,
        importDependency: 0.2, storageMonths: 6, resilienceScore: 60,
      },
      prosperity: 'Struggling',
    },
    institutions: [],
    activeConditions: conditions,
    npcs: Array.from({ length: named }, (_, i) => ({ id: `${id}_npc_${i}` })),
  };
}

/** The world's crisis, as a settlement carries it: WAVE P4 routes this to the death
 *  term, so a fixture that means to be "under pressure" must now say so the way the
 *  live engine does — with the marker the pressure model would have minted. */
const FAMINE = Object.freeze([Object.freeze({
  archetype: 'famine',
  affectedSystems: ['food_security', 'labor_capacity'],
  duration: { elapsedTicks: 0, expiresAtTicks: 10 },
})]);

/** min(K_food, D_tier) for a fixture, read from the live tables (never restated). */
const boundOf = (settlement) => effectiveBoundOf(
  foodCapacityOf(settlement, { simulationRules: { demographicsEnabled: true } }, 'Ashford'),
  densityCeilingOf(settlement),
).bound;

/** A uniform pressure index: every axis reads the same score. The soak's floored band
 *  reproduces at 0.68 to 0.70 (design §0's measured table). */
const pressureAt = (score) => ({ get: () => ({ score }) });

const BASE_RULES = Object.freeze({
  populationDynamicsEnabled: true,
  tierDriftEnabled: true,
  resourceDriftEnabled: false,
  settlementLifecycleEnabled: true,
  majorChangesRequireProposal: false,
  migrationFlowsEnabled: false,
  // DECLARED, NOT INHERITED. `intensityMultiplier` scales the population rate itself, so
  // the equilibrium the design measured only reproduces at the intensity the soak ran:
  // full_simulation carries `normal` (multiplier 1), while DEFAULT_SIMULATION_RULES
  // carries `conservative` (0.65), which would move the fixed point from 302 to 465 and
  // quietly make every number in this file describe a different world.
  intensity: 'normal',
});
const rulesFor = (lit, extra = {}) => ({ ...BASE_RULES, ...extra, ...(lit ? { demographicsEnabled: true } : {}) });

/**
 * Drive the three real evaluators in the pulse's own order (population, then tier, then
 * lifecycle) over one settlement, applying every outcome through the real appliers.
 *
 * THE HARNESS ACCEPTS EVERY CANDIDATE IT IS OFFERED. The live pulse rolls tier and death
 * candidates against their `probability`, so this measures REACHABILITY (can the ladder
 * be walked at all) rather than expected wall-clock. That is exactly the claim under
 * test: dark, the ladder cannot be walked however many times you roll.
 *
 * ⭐ WAVE P4 ADDED THE FOURTH LANE, AND THAT IS THE WHOLE REPAIR TO THIS HARNESS. The
 * reconciliation moved the answer to a pressured settlement out of the population lane
 * and into demographicsKernel.js, so a harness that drives only the three legacy
 * evaluators is now measuring half an engine — and half an engine is exactly what P1a's
 * lit arms used to measure, because until P4 the lane WAS the answer. The kernel is
 * mounted on the LIT arm only, in the pulse's own order (candidates apply, then the
 * movers, then tier, then lifecycle); the DARK arms are untouched down to the byte,
 * which is what keeps section 8's frozen trace hashes meaningful.
 *
 * @param {{ pressure: number, lit: boolean, ticks: number, tier?: string,
 *   population?: number, dailyProduction?: number, named?: number, deficitPct?: number,
 *   conditions?: Array<Record<string, unknown>>,
 *   rules?: Record<string, unknown>, step?: object }} args
 */
function walk({
  pressure, lit, ticks, tier = 'town', population = 300, dailyProduction = 900, named = 2,
  deficitPct = 0, conditions = [], rules: ruleOverrides = {}, step = null,
}) {
  const lanes = step || {
    evaluatePopulationDynamics, applyPopulationOutcomeToSettlement,
    evaluateTierResourceDynamics, applyTierOutcomeToSettlement,
    evaluateSettlementLifecycle, applySettlementLifecycleOutcomeToSettlement,
  };
  let settlement = place({ tier, population, dailyProduction, named, deficitPct, conditions });
  let worldState = { settlementTickStates: {} };
  const rules = rulesFor(lit, ruleOverrides);
  const pIndex = pressureAt(pressure);
  const tiers = [settlement.tier];
  const series = [settlement.population];
  let deathTick = null;
  let died = false;

  for (let t = 1; t <= ticks; t += 1) {
    const item = { id: 'Ashford', name: 'Ashford', settlement, activeConditions: conditions };
    const snapshot = { settlements: [item], byId: new Map([['Ashford', item]]), regionalGraph: { edges: [] } };
    for (const c of lanes.evaluatePopulationDynamics(snapshot, pIndex, {
      tick: t, interval: 'one_year', simulationRules: rules,
    })) {
      settlement = lanes.applyPopulationOutcomeToSettlement(settlement, c, 'Ashford');
    }
    if (lit) {
      const demo = advanceDemographics({
        snapshot: { settlements: [{ id: 'Ashford', name: 'Ashford', settlement }] },
        worldState: { ...worldState, simulationRules: rules },
        settlementUpdates: [{ saveId: 'Ashford', settlement }],
        rng: createPRNG(`floor::tick:${t}::one_year`),
        tick: t,
      });
      settlement = demo.settlementUpdates[0].settlement;
    }
    const tierOut = lanes.evaluateTierResourceDynamics(
      { ...worldState, simulationRules: rules },
      { settlements: [{ id: 'Ashford', name: 'Ashford', settlement }] }, pIndex,
      { tick: t, simulationRules: rules },
    );
    worldState = { ...worldState, settlementTickStates: tierOut.worldState.settlementTickStates };
    for (const c of tierOut.candidates) {
      if (c.tierChange) settlement = lanes.applyTierOutcomeToSettlement(settlement, c);
    }
    if (tiers[tiers.length - 1] !== settlement.tier) tiers.push(settlement.tier);

    const lcOut = lanes.evaluateSettlementLifecycle(
      { ...worldState, simulationRules: rules },
      { settlements: [{ id: 'Ashford', name: 'Ashford', settlement }] }, pIndex,
      { tick: t, simulationRules: rules },
    );
    worldState = { ...worldState, settlementTickStates: lcOut.worldState.settlementTickStates };
    for (const c of lcOut.candidates) {
      if (c.candidateType !== 'settlement_terminal_death') continue;
      if (deathTick == null) deathTick = t;
      const after = lanes.applySettlementLifecycleOutcomeToSettlement(settlement, c);
      if (after !== settlement) { settlement = after; died = true; }
    }
    series.push(settlement.population);
  }
  return { settlement, population: settlement.population, tier: settlement.tier, tiers, series, deathTick, died };
}

/** The population lane alone, with no appliers: what does it EMIT? */
function candidatesFor({ pressure, lit, tick = 1, ...spec }) {
  const item = { id: 'Ashford', name: 'Ashford', settlement: place(spec), activeConditions: spec.conditions || [] };
  return evaluatePopulationDynamics(
    { settlements: [item], byId: new Map([['Ashford', item]]), regionalGraph: { edges: [] } },
    pressureAt(pressure),
    { tick, interval: 'one_year', simulationRules: rulesFor(lit) },
  );
}

/**
 * THE DEATH DRAW ALONE — the demographic kernel with no tier lane and no lifecycle lane.
 * The H3 and determinism sections need the draw isolated from the terminal writer, which
 * legitimately empties a settlement in one stroke and would measure the wrong thing;
 * before P4 that isolation was `declineOnly` over the population lane, and it is the
 * same isolation over the lane that now owns the shrink.
 * @param {Record<string, unknown>} spec @param {number} ticks @param {string} [seed]
 * @param {typeof advanceDemographics} [step] a reverted kernel, for the negative controls
 */
function kernelOnly(spec, ticks, seed = 'floor', step = advanceDemographics) {
  const id = String(spec.id || 'Ashford');
  let settlement = place(spec);
  const series = [settlement.population];
  let births = 0;
  let deaths = 0;
  for (let t = 1; t <= ticks; t += 1) {
    const out = step({
      snapshot: { settlements: [{ id, name: id, settlement }] },
      worldState: { simulationRules: rulesFor(true) },
      settlementUpdates: [{ saveId: id, settlement }],
      rng: createPRNG(`${seed}::tick:${t}`),
      tick: t,
    });
    for (const receipt of out.receipts) { births += receipt.births; deaths += receipt.deaths; }
    settlement = out.settlementUpdates[0].settlement;
    series.push(settlement.population);
  }
  return { settlement, series, population: settlement.population, births, deaths };
}

// ═══════════════════════════════════════════════════════════════════════════════
describe('1. THE UNFREEZE — the measured equilibrium resumes declining', () => {
  // The lane's own arithmetic at pressure 0.70, one_year, restated here ONCE so the
  // fixture's numbers are derived rather than chosen:
  //   stability   = 1 - 0.70 * (0.26+0.20+0.22+0.14+0.12+0.06) = 0.30
  //   monthlyRate = 0.0018 + (0.30 - 0.50) * 0.012             = -0.0006
  //   magnitude   = ((52 * 3) / 13) ^ 0.85                     = 8.2657...
  //   pop*        = 1.5 / (0.0006 * 8.2657)                    = 302.5
  // The design's executed table records 301 at p = 0.70. The fixture starts at 300.

  test('DARK: three hundred ticks at the floored equilibrium and not one person moves', () => {
    const dark = walk({ pressure: 0.70, lit: false, ticks: 300 });
    expect(dark.population, 'the fixture must reproduce the frozen equilibrium').toBe(300);
    expect(new Set(dark.series).size, 'the population took more than one value: not frozen').toBe(1);
    // And it emits NOTHING: the deadband swallows the candidate before it is built.
    expect(candidatesFor({ pressure: 0.70, lit: false }).length).toBe(0);
  });

  test('LIT: the frozen equilibrium moves again — and then it STOPS, above zero', () => {
    // ⭐ WAVE P4 CHANGED WHAT THE LIT ARM CLAIMS, and the change is the point. Until the
    // reconciliation this read "declines every tick, monotonically, and never rebounds",
    // and it passed: the population lane answered a pressured settlement by itself with a
    // rate that read no bound, so the lit fixture fell to 69 and would have gone on to
    // zero. TWO INDEPENDENT ROLLING SOAKS MEASURED THAT AS THE DEFECT (a realm at 4% of
    // its start, 95.3% of the loss in that one lane, on settlements holding thousands of
    // spare mouths). A monotone-forever decline is not a cure with a floor missing; it IS
    // the missing floor. So the claim is now the pair: THE DEADBAND'S ATTRACTOR IS STILL
    // GONE (the fixture leaves 300, which dark it can never do), and the composite comes
    // to rest somewhere above zero instead of ratcheting through it.
    const lit = walk({ pressure: 0.70, lit: true, ticks: 300, conditions: FAMINE });
    expect(new Set(lit.series).size, 'the fixture never left the deadband').toBeGreaterThan(1);
    expect(lit.population, 'the fixture did not move off the frozen equilibrium').toBeLessThan(300);
    expect(lit.population, 'the composite ratcheted toward zero: the floor is missing').toBeGreaterThan(0);
    // AND IT IS AT REST. Measured 284 at tick 150 and 282 at tick 300 on this fixture:
    // the second half moves by well under a percent, which a geometric ratchet cannot do.
    expect(Math.abs(lit.series[300] - lit.series[150]) / lit.series[150], 'still falling')
      .toBeLessThanOrEqual(0.05);
    // And the lane itself is silent: under P4 it writes population only as a conserved
    // transfer, and this fixture (migrationFlowsEnabled false) has no transfer to make.
    expect(candidatesFor({ pressure: 0.70, lit: true, conditions: FAMINE }).length).toBe(0);
  });

  test('THE FLOOR IS THE CAPACITY, NOT A CONSTANT: three granaries, three floors, in order', () => {
    // The chair's own test of the cure: a reconciliation that merely raised a floor would
    // put every settlement on the SAME number. These three are identical in every respect
    // except how much food their fields make, they all start at 300 ABOVE their own bound,
    // and they come to rest on three different numbers that follow their granaries.
    // Measured: bounds 90 / 120 / 160 -> 75 / 94 / 119.
    const runs = [60, 120, 200].map((dailyProduction) => ({
      bound: boundOf(place({ dailyProduction })),
      end: walk({ pressure: 0.70, lit: true, ticks: 700, dailyProduction, conditions: FAMINE }).population,
    }));
    for (const { bound, end } of runs) {
      expect(end, `a settlement bounded at ${bound} emptied entirely`).toBeGreaterThan(0);
      expect(end, `a settlement bounded at ${bound} never descended`).toBeLessThan(300);
    }
    expect(runs[0].bound).toBeLessThan(runs[1].bound);
    expect(runs[1].bound).toBeLessThan(runs[2].bound);
    expect(runs[0].end, 'the resting point ignored the granary').toBeLessThan(runs[1].end);
    expect(runs[1].end, 'the resting point ignored the granary').toBeLessThan(runs[2].end);
  });

  test('NEGATIVE CONTROL (revert / red): unbound the crisis term and the ratchet comes back', async () => {
    // THE CURE IS THE OCCUPANCY SCALING plus the ledger's veto, so the revert removes
    // exactly those two and nothing else: a crisis that presses at full authored strength
    // however empty and however well fed the settlement is. That is the pre-P4 shape of
    // the pressure-decline lane — a rate with no reference to any bound — expressed in
    // the term that replaced it, and it must re-create the defect on this fixture.
    vi.resetModules();
    vi.doMock(RATES_MODULE, async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        // The ledger's veto, removed: every marker is taken at face value.
        crisisStress01: (/** @type {{ settlement?: { activeConditions?: unknown[] } }} */ input) => (
          (input?.settlement?.activeConditions || []).length ? actual.CRISIS_MORTALITY_WEIGHTS.food : 0
        ),
        // The occupancy scaling, removed: the term is added at full strength instead.
        demographicRates: (/** @type {{ crisis01?: number }} */ input) => {
          const base = actual.demographicRates({ ...input, crisis01: 0 });
          const crisis = Math.min(1, Math.max(0, Number(input?.crisis01) || 0));
          return {
            ...base,
            death01: base.death01 + base.deathFloor01 * actual.DEMOGRAPHIC_TUNING.DEATH_CRISIS_GAIN * crisis,
          };
        },
      };
    });
    const revertedKernel = await import('../../src/domain/worldPulse/demographicsKernel.js');
    const ratcheted = kernelOnly(
      { conditions: FAMINE, named: 0 }, 2000, 'revert',
      revertedKernel.advanceDemographics,
    );
    // The cured composite rests near 282 on this fixture; unbound, the same settlement
    // runs through its own floor and keeps going.
    expect(ratcheted.population, 'the reverted term must re-create the ratchet').toBeLessThan(100);
    vi.doUnmock(RATES_MODULE);
    vi.resetModules();
  });

  test('RESTORE (green): the unmocked composite rests on its bound again, after the revert', () => {
    // Executed rather than described: a leaked mock would make the pin above vacuous.
    const restored = kernelOnly({ conditions: FAMINE, named: 0 }, 2000, 'revert');
    expect(restored.population, 'the restored composite ratcheted').toBeGreaterThan(100);
    expect(restored.population, 'the restored composite never declined').toBeLessThan(300);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('2. NO RESIDUAL FLOOR — lowering the deadband to one would NOT have cured it', () => {
  test('an expectation that rounds to ZERO still MOVES lit, and is invisible dark', () => {
    // At pressure 0.70 a settlement of 90 people expects 90 * 0.0006 * 8.2657 = 0.4464
    // departures a tick. Math.round of that is zero, so the delta never even reaches the
    // deadband: a cure that merely lowered the bar from two people to one would freeze
    // this settlement exactly as hard, at pop* = 0.5 / (|rate| x magnitude) = 101. That
    // second fixed point is still far above the thorp ceiling of 60, which is why the
    // attractor had to be removed rather than shrunk.
    //
    // WAVE P4: the claim is MOTION, not monotone descent. This hamlet's granary can feed
    // 181 and only 90 people are at the table, so the reconciled composite correctly
    // declines to answer a famine here at anything like full strength — the ledger's veto
    // is the whole R-C cure — and the fixture drifts in both directions inside a narrow
    // band. What it may never do is sit on ONE number forever, which is what dark does.
    expect(candidatesFor({ pressure: 0.70, lit: false, population: 90 }).length).toBe(0);
    const dark = walk({ pressure: 0.70, lit: false, ticks: 200, tier: 'hamlet', population: 90, dailyProduction: 300 });
    expect(dark.population, 'the sub-rounding fixture must be frozen dark').toBe(90);
    expect(new Set(dark.series).size, 'the dark fixture moved: it is not the frozen shape').toBe(1);

    const lit = walk({
      pressure: 0.70, lit: true, ticks: 200, tier: 'hamlet', population: 90,
      dailyProduction: 300, conditions: FAMINE,
    });
    expect(new Set(lit.series).size, 'a fractional expectation must still move a settlement')
      .toBeGreaterThan(1);
    expect(Math.min(...lit.series), 'the fixture never fell at all').toBeLessThan(90);
  });

  test('the fractional carry is unbiased: the realized deaths track the expectation, not a ceiling', () => {
    // The claim is unchanged and the site moved with the shrink: `integerize` is the same
    // primitive, and under P4 it is the KERNEL's death draw that carries the fraction.
    // Measured on this fixture: 37 deaths over 400 ticks. If the draw had rounded AWAY
    // from zero it would bury one every tick (400) and if it had rounded toward zero it
    // would bury nobody (0). Both degenerate roundings are excluded here.
    const run = kernelOnly({
      tier: 'hamlet', population: 90, dailyProduction: 300, named: 0, conditions: FAMINE,
    }, 400, 'carry');
    expect(run.deaths, 'the draw buried nobody: the fraction is being discarded').toBeGreaterThan(10);
    expect(run.deaths, 'the draw buried one every tick: the fraction is being rounded up').toBeLessThan(200);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('3. THE DESCENT — the floored-six shape walks the ladder to the terminal lane', () => {
  // WHY 700 TICKS AND NOT 300: the horizon is derived from the lane's own arithmetic,
  // not chosen. Walking 300 people down to the thorp ceiling of 60 at |rate| x magnitude
  // = 0.00496 per tick takes ln(300/60) / 0.00496 = 324 ticks, and the terminal lane then
  // requires its authored TERMINAL_DWELL of 104 more. Any horizon under about 428 ticks
  // cannot observe the end of the ladder at this pressure, so a 300-tick pin would be
  // measuring the horizon rather than the cure. The terminal candidate is measured at
  // tick 434 on this fixture, which is the derivation confirmed by execution.
  const HORIZON = 700;

  test('LIT: a settlement whose GRANARY fails walks the ladder down and the terminal candidate fires', () => {
    // ⭐ WAVE P4 MOVED WHAT DRIVES THE DESCENT, and refusing to move this fixture with it
    // would pin the defect. Before the reconciliation ANY sustained pressure walked a
    // settlement to its death, including a settlement with food to spare — that is the
    // ratchet, and a cure that kept it would not be a cure. What must still be true, and
    // is, is that a settlement whose CAPACITY genuinely fails still dies: the granary here
    // feeds 46 and 120 people are at the table, so the claim is corroborated, mortality
    // runs at its authored strength, and the viability ladder does the rest. Measured:
    // hamlet to thorp, terminal candidate at tick 106.
    const failed = walk({
      pressure: 0.70, lit: true, ticks: HORIZON, tier: 'hamlet', population: 120,
      dailyProduction: 40, named: 0, conditions: FAMINE,
    });
    expect(failed.tiers, 'the descent is the claim, in order').toEqual(['hamlet', 'thorp']);
    expect(failed.deathTick, 'the terminal lane was never reached').not.toBeNull();
    expect(failed.deathTick).toBeLessThanOrEqual(HORIZON);
    expect(failed.died, 'the death writer refused the outcome its own evaluator emitted').toBe(true);
    expect(String(failed.settlement.lifecycleStatus || failed.settlement.config?.lifecycleStatus || ''))
      .not.toBe('');
  });

  test('THE POSITIVE CONTROL: the same settlement with a SOUND granary survives the same horizon', () => {
    // Without this the pin above would pass for the boring reason that everything dies at
    // this horizon, which is precisely the reading the old lane earned. One number apart —
    // the fields' output — and the same fixture under the same famine lives.
    const sound = walk({
      pressure: 0.70, lit: true, ticks: HORIZON, tier: 'hamlet', population: 120,
      dailyProduction: 300, named: 0, conditions: FAMINE,
    });
    expect(sound.deathTick, 'a well-fed settlement was killed by a story').toBeNull();
    expect(sound.died).toBe(false);
    expect(sound.population, 'the well-fed settlement emptied anyway').toBeGreaterThan(0);
  });

  test('DARK (the control): the same fixture stalls at hamlet at exactly 300 people, forever', () => {
    const dark = walk({ pressure: 0.70, lit: false, ticks: HORIZON });
    // Dark the ladder DOES move twice, on the existing population-failure tests, and then
    // stops: at 300 people a hamlet is inside its own band (61 to 400) and its support of
    // 0.30 is above the structural-failure floor of 0.25, so nothing else can demote it
    // and the frozen population can never fall to where something would.
    expect(dark.tiers).toEqual(['town', 'village', 'hamlet']);
    expect(dark.population).toBe(300);
    expect(dark.deathTick, 'dark, a nonviable settlement must remain immortal').toBeNull();
    expect(dark.died).toBe(false);
  });

  test('the descent is driven by the CENSUS, not by collapsing support', () => {
    // The eligibility has a structural-failure arm (support <= 0.25) that would demote a
    // settlement all the way down regardless of population, and it would make the pin
    // above pass for the wrong reason. At pressure 0.70 the support is 0.30, above that
    // arm, so every demotion in this fixture is a population test. Executed here so the
    // fixture cannot drift into the wrong regime unnoticed.
    const support = 1 - 0.70 * (0.22 + 0.24 + 0.2 + 0.2 + 0.14);
    expect(support).toBeGreaterThan(0.25);
    expect(support).toBeLessThan(0.35 + 1e-9); // still inside the terminal lane's decline floor
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('4. THE LABEL LAG — a tier label that cannot follow its census', () => {
  // Tier drift is streak-gated, probabilistic and proposal-gateable, and a campaign may
  // switch it off outright (`tierDriftEnabled` is a real rule key). Dark, the terminal
  // lane reads the bottom rung from the LABEL alone, so a settlement of forty people
  // still recorded as a hamlet can never die. This is the case the head-count reading
  // exists for, isolated: tier drift is OFF in both arms, so the label never moves and
  // the only difference between them is which fact the death gate consults.
  const OFF = { tierDriftEnabled: false };

  test('DARK: forty people wearing a hamlet label are immortal', () => {
    const dark = walk({
      pressure: 0.70, lit: false, ticks: 200, tier: 'hamlet', population: 40,
      dailyProduction: 300, rules: OFF,
    });
    expect(dark.tier).toBe('hamlet');
    expect(dark.population).toBe(40);
    expect(dark.deathTick).toBeNull();
  });

  test('LIT: the same settlement is thorp-scale in fact, and it reaches the terminal lane', () => {
    const lit = walk({
      pressure: 0.70, lit: true, ticks: 200, tier: 'hamlet', population: 40,
      dailyProduction: 300, rules: OFF,
    });
    expect(lit.tier, 'the death gate must not mint a tier: the label is still the drift lane\'s to write')
      .toBe('hamlet');
    expect(lit.deathTick, 'the ladder-authorized death never fired').not.toBeNull();
    expect(lit.died, 'the writer refused a death its evaluator authorized: writer/reader drift').toBe(true);
  });

  test('the writer honours the stamp and nothing else: an unstamped patch still refuses', () => {
    // The applier's staleness contract is unchanged in substance. Without the stamp a
    // non-thorp settlement is refused exactly as before, which is what keeps every dark
    // outcome and every parked legacy proposal reading the way it always did.
    const hamlet = place({ tier: 'hamlet', population: 40, dailyProduction: 300 });
    const unstamped = { id: 'x', lifecyclePatch: { kind: 'terminal_death', saveId: 'Ashford' }, metadata: { tick: 9 } };
    const stamped = {
      id: 'x',
      lifecyclePatch: { kind: 'terminal_death', saveId: 'Ashford', viabilityLadder: true },
      metadata: { tick: 9 },
    };
    expect(applySettlementLifecycleOutcomeToSettlement(hamlet, unstamped)).toBe(hamlet);
    const killed = applySettlementLifecycleOutcomeToSettlement(hamlet, stamped);
    expect(killed).not.toBe(hamlet);
    expect(String(killed.lifecycleStatus || killed.config?.lifecycleStatus || '')).not.toBe('');

    // And the stamp is not a skeleton key: a settlement that genuinely recovered off the
    // bottom rung is still refused, because the re-verify asks the census too.
    const recovered = place({ tier: 'hamlet', population: 240, dailyProduction: 900 });
    expect(applySettlementLifecycleOutcomeToSettlement(recovered, stamped)).toBe(recovered);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('5. PROMOTION — law 4 on both arms', () => {
  const promoteFixture = (population) => ({
    population, tier: 'hamlet', name: 'Ashford',
    config: { tier: 'hamlet', terrainType: 'plains' },
    economicState: {
      foodSecurity: {
        dailyNeed: population * 2, dailyProduction: population * 6, deficitPct: 0,
        surplusPct: 5, importDependency: 0.2, storageMonths: 6, resilienceScore: 60,
      },
      prosperity: 'Prosperous',
    },
    institutions: [], npcs: [],
  });

  /** Run the tier lane until it promotes (or does not), applying whatever it emits. */
  function promote({ lit, population, ticks = 8 }) {
    let settlement = promoteFixture(population);
    let worldState = { settlementTickStates: {} };
    const rules = { tierDriftEnabled: true, resourceDriftEnabled: false, majorChangesRequireProposal: false, intensity: 'normal', ...(lit ? { demographicsEnabled: true } : {}) };
    let change = null;
    for (let t = 1; t <= ticks; t += 1) {
      const out = evaluateTierResourceDynamics(
        { ...worldState, simulationRules: rules },
        { settlements: [{ id: 'Ashford', name: 'Ashford', settlement }] }, pressureAt(0.15),
        { tick: t, simulationRules: rules },
      );
      worldState = { ...worldState, settlementTickStates: out.worldState.settlementTickStates };
      for (const c of out.candidates) {
        if (!c.tierChange) continue;
        change = change || c.tierChange;
        settlement = applyTierOutcomeToSettlement(settlement, c);
      }
    }
    return { settlement, change };
  }

  test('DARK: the legacy mint is intact, and a golden depends on it', () => {
    // 380 is inside the old window (0.92 x 401 = 368.9), so dark it promotes and the
    // applier raises the head count to the village floor: 21 people out of nothing.
    const dark = promote({ lit: false, population: 380 });
    expect(dark.change.direction).toBe('promotion');
    expect(dark.settlement.tier).toBe('village');
    expect(dark.settlement.population, 'the dark mint must be byte-for-byte the legacy behaviour').toBe(401);
    const bump = dark.settlement.populationHistory.at(-1);
    expect(bump.delta).toBe(21);
    expect(String(bump.reason)).toContain('population floor');
  });

  test('LIT: earned ascension refuses the same promotion outright, so nobody is invented', () => {
    const lit = promote({ lit: true, population: 380 });
    expect(lit.change, 'lit, a settlement below its next tier floor may not rise').toBeNull();
    expect(lit.settlement.tier).toBe('hamlet');
    expect(lit.settlement.population).toBe(380);
  });

  test('LIT: at the full floor it promotes, conserving exactly, and stamps the law it rose under', () => {
    const lit = promote({ lit: true, population: 401 });
    expect(lit.change.direction).toBe('promotion');
    expect(lit.change.populationConserved).toBe(true);
    expect(lit.settlement.tier).toBe('village');
    expect(lit.settlement.population, 'a tier change created somebody').toBe(401);
    expect(lit.settlement.populationHistory || [], 'a conserved promotion leaves no bump breadcrumb').toEqual([]);
  });

  test('THE APPLIER, both arms on ONE settlement: the stamp is the whole difference', () => {
    // The crispest form of the pin: the same settlement, the same outcome, one key apart.
    const settlement = promoteFixture(380);
    const base = { id: 'x', generatedAtTick: 4, tierChange: { saveId: 'Ashford', fromTier: 'hamlet', toTier: 'village', direction: 'promotion' } };
    const minted = applyTierOutcomeToSettlement(settlement, base);
    const conserved = applyTierOutcomeToSettlement(settlement, {
      ...base, tierChange: { ...base.tierChange, populationConserved: true },
    });
    expect(minted.population).toBe(401);
    expect(conserved.population).toBe(380);
    expect(minted.tier).toBe('village');
    expect(conserved.tier, 'the tier must still rise: only the mint is dispositioned').toBe('village');
    expect((minted.populationHistory || []).length).toBe(1);
    expect((conserved.populationHistory || []).length).toBe(0);
  });

  test('DEMOTION was already conservation-exact and stays so on both arms', () => {
    const settlement = promoteFixture(380);
    const demote = { id: 'x', generatedAtTick: 4, tierChange: { saveId: 'Ashford', fromTier: 'hamlet', toTier: 'thorp', direction: 'demotion' } };
    expect(applyTierOutcomeToSettlement(settlement, demote).population).toBe(380);
    expect(applyTierOutcomeToSettlement(settlement, {
      ...demote, tierChange: { ...demote.tierChange, populationConserved: true },
    }).population).toBe(380);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('6. ONE DEMOTION WRITER — a source census, not a claim', () => {
  /** Every .js under src/, relative to the repo root. */
  function sourceFiles(dir = join(ROOT, 'src'), out = []) {
    for (const entry of readdirSync(dir).sort()) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) sourceFiles(full, out);
      else if (entry.endsWith('.js') || entry.endsWith('.jsx')) out.push(relative(ROOT, full));
    }
    return out;
  }
  const FILES = sourceFiles();
  const hits = (/** @type {RegExp} */ re) => FILES.filter((rel) => re.test(readFileSync(join(ROOT, rel), 'utf8')));

  test('exactly one module authors a demotion, and it is the one the design names', () => {
    expect(FILES.length, 'the census read no files at all').toBeGreaterThan(400);
    expect(hits(/direction:\s*'demotion'/)).toEqual(['src/domain/worldPulse/tierResourceDynamics.js']);
  });

  test('exactly one module WRITES a settlement tier, and wave P1a added no second one', () => {
    expect(hits(/\btier:\s*(toTier|previousTier|nextTier|drift\.toTier)\b/))
      .toEqual(['src/domain/worldPulse/tierOutcomeApply.js']);
  });

  test('the demographic modules write no tier and no demotion at all: they are READS', () => {
    for (const rel of [
      'src/domain/worldPulse/demographicsKernel.js',
      'src/domain/worldPulse/demographicsRates.js',
    ]) {
      const src = readFileSync(join(ROOT, rel), 'utf8');
      expect(src.length, `${rel} read empty`).toBeGreaterThan(0);
      // Comments stripped first: this file's own prose says the word "tier:" in a
      // sentence, and a scan that counts prose is a scan that will be muted.
      const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code.includes('direction:'), `${rel} authors a tier direction`).toBe(false);
      expect(/\btier:\s*[a-zA-Z]/.test(code), `${rel} writes a tier`).toBe(false);
    }
  });

  test('the viability read is an INPUT to the existing eligibility, wired at exactly one site', () => {
    const src = readFileSync(join(ROOT, 'src/domain/worldPulse/tierResourceDynamics.js'), 'utf8');
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    // ONE call each. `tierEligibility` matches twice because one of them is its own
    // `function tierEligibility(` declaration, so two is the shape of a single-call-site
    // helper and three would be a fork.
    expect((code.match(/tierViabilityOf\(/g) || []).length, 'the viability read has more than one call site').toBe(1);
    expect((code.match(/tierEligibility\(/g) || []).length, 'the eligibility gained a second call site').toBe(2);
    expect(code).toContain('function tierEligibility(');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('7. THE H3 FLOOR — the descent starves the number, never the cast', () => {
  // SCOPE, stated so the pin is not read as more than it is: this is a claim about the
  // lane that OWNS THE SHRINK, and the lifecycle lane is deliberately not driven here. A
  // terminal death legitimately empties a settlement (the fates pin keeps the roster, the
  // head count goes to zero), and letting that run would measure the death writer rather
  // than the draw. ⭐ WAVE P4 MOVED THE SHRINK from the population lane to the demographic
  // kernel, so the isolation moved with it: `kernelOnly` is `declineOnly`'s successor and
  // the floor is pinned where the draw now happens. The floor itself is unchanged — both
  // lanes always drew against the ANONYMOUS POOL — and the fixture's granary is failed so
  // the descent actually reaches the cast inside a measurable horizon.
  const declineOnly = (seed, population, named, ticks) => kernelOnly(
    { tier: 'hamlet', population, dailyProduction: 0, named, conditions: FAMINE }, ticks, seed,
  ).series;

  test('a settlement declining to nothing never falls below its resident named cast', () => {
    // Dark this fixture could never reach the cast at all, because it would freeze
    // hundreds of souls above it. Removing the freeze is exactly what makes the floor
    // load-bearing, so the floor is pinned on the lane that now draws.
    const CAST = 24;
    const failures = collectSeedFailures(['h3-a', 'h3-b', 'h3-c'], (seed) => {
      for (const value of declineOnly(seed, 120, CAST, 3000)) {
        expect(value, `seed ${seed}: the cast was starved`).toBeGreaterThanOrEqual(CAST);
      }
    });
    expectNoSeedFailures(failures, 'the named cast is never in the departure draw');
  });

  test('and it settles ON the floor, not comfortably above it', () => {
    // Without this the pin above would pass for the boring reason that the fixture never
    // declined far enough to reach the floor at all.
    const series = declineOnly('h3-a', 120, 24, 3000);
    expect(Math.min(...series), 'the fixture never reached its own floor: the pin proves nothing').toBe(24);
  });

  test('NEGATIVE CONTROL: the same fixture with no cast keeps going under twenty-four', () => {
    const castless = declineOnly('h3-a', 120, 0, 3000);
    expect(Math.min(...castless), 'the floor is not the cast, it is something else').toBeLessThan(24);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('8. THE DARK FENCE — measured against HEAD, not recorded from the new code', () => {
  // PROVENANCE, so a later reader knows these literals are evidence rather than a
  // snapshot of whatever the code happened to do. At authoring time (2026-08-01, wave
  // P1a) the five touched modules were extracted read-only from HEAD (`git show
  // HEAD:src/domain/worldPulse/<module>.js`, HEAD = e0f94ee7, the commit that landed P1),
  // their relative imports were rewritten to absolute paths against this same tree, and
  // this exact six-settlement, sixty-tick, three-lane trace was run through BOTH the HEAD
  // modules and the working tree at four pressure regimes:
  //     pressure 0.15   HEAD 414bb049cfb5d5b4   WORKTREE 414bb049cfb5d5b4
  //     pressure 0.45   HEAD 415d764b6d9c8b1f   WORKTREE 415d764b6d9c8b1f
  //     pressure 0.70   HEAD 94f5d800f1bfa1d8   WORKTREE 94f5d800f1bfa1d8
  //     pressure 0.90   HEAD 4064300d9dc8d45b   WORKTREE 4064300d9dc8d45b
  // So each literal below is HEAD's output, not this branch's. A move here means the dark
  // path changed, which is the golden law breaking. Do NOT re-record it to clear a red.
  const FROZEN = Object.freeze({
    0.15: '414bb049cfb5d5b4',
    0.45: '415d764b6d9c8b1f',
    0.70: '94f5d800f1bfa1d8',
    0.90: '4064300d9dc8d45b',
  });
  const REALM = Object.freeze([
    ['Ashford', 'town', 300, 900], ['Brack', 'hamlet', 380, 1200], ['Cairn', 'thorp', 40, 300],
    ['Dun', 'city', 7000, 30000], ['Elder', 'village', 700, 2600], ['Fallow', 'metropolis', 30000, 130000],
  ]);

  /** @type {Set<string>} */
  const KINDS = new Set();

  function realmTrace(pressure, lit) {
    const sett = new Map(REALM.map(([id, tier, population, dailyProduction]) => [
      id, { ...place({ id, tier, population, dailyProduction, named: 2 }), name: 'x' },
    ]));
    let worldState = { settlementTickStates: {} };
    const rules = rulesFor(lit);
    const pIndex = pressureAt(pressure);
    const out = [];
    for (let t = 1; t <= 60; t += 1) {
      const items = [...sett].map(([id, s]) => ({ id, name: id, settlement: s, activeConditions: [] }));
      const snapshot = { settlements: items, byId: new Map(items.map((i) => [i.id, i])), regionalGraph: { edges: [] } };
      const pop = evaluatePopulationDynamics(snapshot, pIndex, { tick: t, interval: 'one_year', simulationRules: rules });
      for (const c of pop) {
        for (const d of c.populationDeltas) {
          const s = sett.get(String(d.saveId));
          if (s) sett.set(String(d.saveId), applyPopulationOutcomeToSettlement(s, c, d.saveId));
        }
      }
      const items2 = [...sett].map(([id, s]) => ({ id, name: id, settlement: s }));
      const tierOut = evaluateTierResourceDynamics({ ...worldState, simulationRules: rules }, { settlements: items2 }, pIndex, { tick: t, simulationRules: rules });
      worldState = { ...worldState, settlementTickStates: tierOut.worldState.settlementTickStates };
      for (const c of tierOut.candidates) {
        if (!c.tierChange) continue;
        const id = String(c.tierChange.saveId);
        sett.set(id, applyTierOutcomeToSettlement(sett.get(id), c));
      }
      const items3 = [...sett].map(([id, s]) => ({ id, name: id, settlement: s }));
      const lcOut = evaluateSettlementLifecycle({ ...worldState, simulationRules: rules }, { settlements: items3 }, pIndex, { tick: t, simulationRules: rules });
      worldState = { ...worldState, settlementTickStates: lcOut.worldState.settlementTickStates };
      for (const c of [...pop, ...tierOut.candidates, ...lcOut.candidates]) KINDS.add(String(c.candidateType));
      out.push({
        t,
        pop: pop.map((c) => [c.id, c.candidateType, JSON.stringify(c.populationDeltas), c.summary]),
        tier: tierOut.candidates.map((c) => [c.id, JSON.stringify(c.tierChange), c.reasons]),
        lc: lcOut.candidates.map((c) => [c.id, c.candidateType, JSON.stringify(c.lifecyclePatch)]),
        pops: [...sett].map(([id, s]) => `${id}:${s.population}:${s.tier}`).join('|'),
      });
    }
    return createHash('sha256').update(JSON.stringify({ out, worldState })).digest('hex').slice(0, 16);
  }

  test('dark, all three lanes are byte-identical to HEAD at every pressure regime', () => {
    for (const [pressure, frozen] of Object.entries(FROZEN)) {
      expect(realmTrace(Number(pressure), false), `dark trace moved at pressure ${pressure}`).toBe(frozen);
    }
  });

  test('NEGATIVE CONTROL: the same trace LIT differs, so the fence is not blind', () => {
    // A fence that passed lit as well would be measuring nothing.
    for (const [pressure, frozen] of Object.entries(FROZEN)) {
      expect(realmTrace(Number(pressure), true), `pressure ${pressure} was unchanged when lit`)
        .not.toBe(frozen);
    }
  });

  test('WHAT THE FENCE ACTUALLY EXERCISES, asserted rather than assumed', () => {
    // Self-contained: the traces are driven HERE rather than relying on the two tests
    // above having run first, so this cannot pass or fail on suite ordering.
    KINDS.clear();
    for (const pressure of Object.keys(FROZEN)) realmTrace(Number(pressure), false);
    // A parity fence proves nothing about a lane it never drives, so the lanes are
    // counted. All four of wave P1a's touched lanes fire inside these traces: the
    // population lane in both directions, and the tier lane in both directions.
    for (const kind of ['population_growth', 'population_decline', 'tier_promotion', 'tier_demotion']) {
      expect(KINDS.has(kind), `the fence never exercised ${kind}: it is blind to that lane`).toBe(true);
    }
    // AND WHAT IT DOES NOT: measured at authoring time, no promotion inside these traces
    // actually triggers the population MINT, because every promoting settlement had
    // already grown past its new tier's floor. The mint is therefore covered by the
    // direct both-arms applier pin in section 5 and NOT by this fence. Recorded so a
    // later reader does not credit this fence with a guarantee it does not carry.
    expect(KINDS.has('settlement_terminal_death'), 'the terminal lane is covered in sections 3 and 4, not here').toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('9. DETERMINISM — replay, decorrelation, purity', () => {
  test('the lit lane replays exactly, twice, for a whole family of settlement ids', () => {
    const failures = collectSeedFailures(['Ashford', 'Brackwater', 'Cairnhold', 'Dunmarch', 'Elderfen', 'Fallowmere'], (id) => {
      const of = () => {
        let settlement = place({ id, population: 300 });
        const out = [];
        for (let t = 1; t <= 120; t += 1) {
          const item = { id, name: id, settlement, activeConditions: [] };
          const cs = evaluatePopulationDynamics(
            { settlements: [item], byId: new Map([[id, item]]), regionalGraph: { edges: [] } },
            pressureAt(0.70), { tick: t, interval: 'one_year', simulationRules: rulesFor(true) },
          );
          for (const c of cs) settlement = applyPopulationOutcomeToSettlement(settlement, c, id);
          out.push(settlement.population);
        }
        return out.join(',');
      };
      expect(of()).toBe(of());
    });
    expectNoSeedFailures(failures, 'the dithered decline replays exactly for every settlement id');
  });

  test('the dither is keyed per settlement: twins with different names diverge', () => {
    // ⭐ WAVE P4 moved the shrink into the kernel's own per-settlement fork
    // (`demographics:<id>`), so the decorrelation claim is measured where the draw is.
    // The whole trajectory is compared, not the endpoint: two independent random walks
    // can land on the same number by luck, and a pin that could pass on luck is a pin
    // that can go vacuous quietly.
    const runFor = (id) => kernelOnly(
      { id, tier: 'town', population: 300, named: 0, conditions: FAMINE }, 400, 'dither',
    ).series.join(',');
    // Identical in every respect except the name. A shared dither would give them one
    // trajectory, which is the stream-sharing defect this key exists to avoid.
    expect(runFor('Aaa') === runFor('Bbb'), 'two identical settlements shared one dither').toBe(false);
    // And each replays exactly, so the divergence above is the KEY and not ambient noise.
    expect(runFor('Aaa')).toBe(runFor('Aaa'));
  });

  test('STRUCTURAL PURITY: the decline lane reaches for no clock, locale, or ambient randomness', () => {
    // A double-pass equality is blind to state whose period matches the pass count, so
    // purity is scanned at source as well as measured at runtime.
    const src = readFileSync(join(ROOT, 'src/domain/worldPulse/populationDynamics.js'), 'utf8');
    expect(src.length, 'the scan read an empty file').toBeGreaterThan(0);
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    for (const banned of ['Math.random', 'Date.now', 'new Date', 'toLocaleString', 'localeCompare']) {
      expect(code.includes(banned), `populationDynamics reaches for ${banned}`).toBe(false);
    }
    // And the dither is keyed on BOTH the settlement and the tick, so no two settlements
    // and no two ticks share a draw.
    expect(code).toContain('hash01(`population.decline.${String(item?.id ?? \'\')}.${tick}`)');
  });
});
