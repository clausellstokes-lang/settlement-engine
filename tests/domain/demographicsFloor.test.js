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
import {
  evaluatePopulationDynamics, applyPopulationOutcomeToSettlement,
} from '../../src/domain/worldPulse/populationDynamics.js';
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
function place({ id = 'Ashford', tier = 'town', population = 300, dailyProduction = 900, named = 2 } = {}) {
  return {
    population,
    tier,
    name: id,
    config: { tier, terrainType: 'plains' },
    economicState: {
      foodSecurity: {
        dailyNeed: population * 2, dailyProduction, deficitPct: 0, surplusPct: 5,
        importDependency: 0.2, storageMonths: 6, resilienceScore: 60,
      },
      prosperity: 'Struggling',
    },
    institutions: [],
    npcs: Array.from({ length: named }, (_, i) => ({ id: `${id}_npc_${i}` })),
  };
}

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
 * @param {{ pressure: number, lit: boolean, ticks: number, tier?: string,
 *   population?: number, dailyProduction?: number, named?: number,
 *   rules?: Record<string, unknown>, step?: object }} args
 */
function walk({
  pressure, lit, ticks, tier = 'town', population = 300, dailyProduction = 900, named = 2,
  rules: ruleOverrides = {}, step = null,
}) {
  const lanes = step || {
    evaluatePopulationDynamics, applyPopulationOutcomeToSettlement,
    evaluateTierResourceDynamics, applyTierOutcomeToSettlement,
    evaluateSettlementLifecycle, applySettlementLifecycleOutcomeToSettlement,
  };
  let settlement = place({ tier, population, dailyProduction, named });
  let worldState = { settlementTickStates: {} };
  const rules = rulesFor(lit, ruleOverrides);
  const pIndex = pressureAt(pressure);
  const tiers = [settlement.tier];
  const series = [settlement.population];
  let deathTick = null;
  let died = false;

  for (let t = 1; t <= ticks; t += 1) {
    const item = { id: 'Ashford', name: 'Ashford', settlement, activeConditions: [] };
    const snapshot = { settlements: [item], byId: new Map([['Ashford', item]]), regionalGraph: { edges: [] } };
    for (const c of lanes.evaluatePopulationDynamics(snapshot, pIndex, {
      tick: t, interval: 'one_year', simulationRules: rules,
    })) {
      settlement = lanes.applyPopulationOutcomeToSettlement(settlement, c, 'Ashford');
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
  const item = { id: 'Ashford', name: 'Ashford', settlement: place(spec), activeConditions: [] };
  return evaluatePopulationDynamics(
    { settlements: [item], byId: new Map([['Ashford', item]]), regionalGraph: { edges: [] } },
    pressureAt(pressure),
    { tick, interval: 'one_year', simulationRules: rulesFor(lit) },
  );
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

  test('LIT: the same fixture declines every tick, monotonically, and never rebounds', () => {
    const lit = walk({ pressure: 0.70, lit: true, ticks: 300 });
    expect(lit.population, 'the floored settlement did not resume declining').toBeLessThan(300);
    // MONOTONE: a decline lane may never hand a person back.
    for (let i = 1; i < lit.series.length; i += 1) {
      expect(lit.series[i], `population rose at tick ${i}`).toBeLessThanOrEqual(lit.series[i - 1]);
    }
    // And it is a real slope, not one lucky tick: measured 69 at tick 300 on this
    // fixture, so the bar is set well outside it.
    expect(lit.population).toBeLessThan(200);
    // The lane emits a candidate where dark emitted none, and it is a DECLINE.
    const emitted = candidatesFor({ pressure: 0.70, lit: true });
    expect(emitted.length).toBe(1);
    expect(emitted[0].candidateType).toBe('population_decline');
    expect(emitted[0].populationDeltas[0].delta).toBeLessThan(0);
  });

  test('NEGATIVE CONTROL (revert / red): re-impose the deadband and the fixture refreezes', async () => {
    // The cure is the INTEGERIZATION, so the revert patches exactly that: the wave's
    // `integerize` primitive is replaced by the pre-cure arithmetic, round-then-discard
    // anything under two people. Nothing else about the lane changes.
    vi.resetModules();
    vi.doMock(RATES_MODULE, async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        integerize: (/** @type {number} */ expected) => {
          const rounded = Math.round(expected);
          return Math.abs(rounded) < 2 ? 0 : rounded;
        },
      };
    });
    const reverted = await import('../../src/domain/worldPulse/populationDynamics.js');
    const lanes = {
      evaluatePopulationDynamics: reverted.evaluatePopulationDynamics,
      applyPopulationOutcomeToSettlement: reverted.applyPopulationOutcomeToSettlement,
      evaluateTierResourceDynamics, applyTierOutcomeToSettlement,
      evaluateSettlementLifecycle, applySettlementLifecycleOutcomeToSettlement,
    };
    const refrozen = walk({ pressure: 0.70, lit: true, ticks: 300, step: lanes });
    expect(refrozen.population, 'the reverted lane must re-create the defect').toBe(300);
    vi.doUnmock(RATES_MODULE);
    vi.resetModules();
  });

  test('RESTORE (green): the unmocked lane declines again, in the same file, after the revert', () => {
    // Executed rather than described: a leaked mock would make the pin above vacuous.
    const restored = walk({ pressure: 0.70, lit: true, ticks: 300 });
    expect(restored.population).toBeLessThan(200);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('2. NO RESIDUAL FLOOR — lowering the deadband to one would NOT have cured it', () => {
  test('an expectation that rounds to ZERO still declines lit, and is invisible dark', () => {
    // At pressure 0.70 a settlement of 90 people expects 90 * 0.0006 * 8.2657 = 0.4464
    // departures a tick. Math.round of that is zero, so the delta never even reaches the
    // deadband: a cure that merely lowered the bar from two people to one would freeze
    // this settlement exactly as hard, at pop* = 0.5 / (|rate| x magnitude) = 101. That
    // second fixed point is still far above the thorp ceiling of 60, which is why the
    // attractor had to be removed rather than shrunk.
    expect(candidatesFor({ pressure: 0.70, lit: false, population: 90 }).length).toBe(0);
    const dark = walk({ pressure: 0.70, lit: false, ticks: 200, tier: 'hamlet', population: 90, dailyProduction: 300 });
    expect(dark.population, 'the sub-rounding fixture must be frozen dark').toBe(90);

    const lit = walk({ pressure: 0.70, lit: true, ticks: 200, tier: 'hamlet', population: 90, dailyProduction: 300 });
    expect(lit.population, 'a fractional expectation must still empty a settlement over time')
      .toBeLessThan(90);
  });

  test('the fractional carry is unbiased: the shed count tracks the expectation, not a ceiling', () => {
    // 0.4464 expected departures a tick over 400 ticks is about 179 people. If the cure
    // had rounded AWAY from zero instead of carrying the fraction it would shed 400, and
    // if it had rounded toward zero it would shed none. Both failures are excluded here.
    let shed = 0;
    for (let t = 1; t <= 400; t += 1) {
      const c = candidatesFor({ pressure: 0.70, lit: true, population: 90, named: 0, tick: t });
      if (c.length) shed += Math.abs(c[0].populationDeltas[0].delta);
    }
    expect(shed, 'the dither shed nothing: the fraction is being discarded').toBeGreaterThan(120);
    expect(shed, 'the dither shed one every tick: the fraction is being rounded up').toBeLessThan(240);
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

  test('LIT: town to village to hamlet to thorp, and then the terminal candidate fires', () => {
    const lit = walk({ pressure: 0.70, lit: true, ticks: HORIZON });
    expect(lit.tiers, 'the full descent is the claim, in order').toEqual(['town', 'village', 'hamlet', 'thorp']);
    expect(lit.deathTick, 'the terminal lane was never reached').not.toBeNull();
    expect(lit.deathTick).toBeLessThanOrEqual(HORIZON);
    expect(lit.died, 'the death writer refused the outcome its own evaluator emitted').toBe(true);
    expect(String(lit.settlement.lifecycleStatus || lit.settlement.config?.lifecycleStatus || ''))
      .not.toBe('');
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
  // DECLINE LANE, which is the lane wave P1a changed, so the lifecycle lane is deliberately
  // not driven here. A terminal death legitimately empties a settlement (the fates pin
  // keeps the roster, the head count goes to zero), and letting that run would measure
  // the death writer rather than the departure draw.
  const declineOnly = (pressure, population, named, ticks) => {
    let settlement = place({ tier: 'hamlet', population, dailyProduction: 200, named });
    const series = [settlement.population];
    for (let t = 1; t <= ticks; t += 1) {
      const item = { id: 'Ashford', name: 'Ashford', settlement, activeConditions: [] };
      const cs = evaluatePopulationDynamics(
        { settlements: [item], byId: new Map([['Ashford', item]]), regionalGraph: { edges: [] } },
        pressureAt(pressure), { tick: t, interval: 'one_year', simulationRules: rulesFor(true) },
      );
      for (const c of cs) settlement = applyPopulationOutcomeToSettlement(settlement, c, 'Ashford');
      series.push(settlement.population);
    }
    return series;
  };

  test('a settlement declining to nothing never falls below its resident named cast', () => {
    // Dark this fixture could never reach the cast at all, because it would freeze
    // hundreds of souls above it. Removing the freeze is exactly what makes the floor
    // load-bearing on this lane, so the floor is pinned on this lane.
    const CAST = 24;
    const failures = collectSeedFailures([0.70, 0.72, 0.74], (pressure) => {
      for (const value of declineOnly(pressure, 120, CAST, 400)) {
        expect(value, `pressure ${pressure}: the cast was starved`).toBeGreaterThanOrEqual(CAST);
      }
    });
    expectNoSeedFailures(failures, 'the named cast is never in the departure draw');
  });

  test('and it settles ON the floor, not comfortably above it', () => {
    // Without this the pin above would pass for the boring reason that the fixture never
    // declined far enough to reach the floor at all.
    const series = declineOnly(0.70, 120, 24, 400);
    expect(series.at(-1), 'the fixture never reached its own floor: the pin proves nothing').toBe(24);
  });

  test('NEGATIVE CONTROL: the same fixture with no cast keeps going under twenty-four', () => {
    const castless = declineOnly(0.70, 120, 0, 400);
    expect(castless.at(-1), 'the floor is not the cast, it is something else').toBeLessThan(24);
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
    const runFor = (id) => {
      let settlement = place({ id, population: 300 });
      for (let t = 1; t <= 200; t += 1) {
        const item = { id, name: id, settlement, activeConditions: [] };
        const cs = evaluatePopulationDynamics(
          { settlements: [item], byId: new Map([[id, item]]), regionalGraph: { edges: [] } },
          pressureAt(0.70), { tick: t, interval: 'one_year', simulationRules: rulesFor(true) },
        );
        for (const c of cs) settlement = applyPopulationOutcomeToSettlement(settlement, c, id);
      }
      return settlement.population;
    };
    // Identical in every respect except the name. A shared dither would land them on the
    // same number, which is the stream-sharing defect this key exists to avoid.
    expect(runFor('Aaa') === runFor('Bbb'), 'two identical settlements shared one dither').toBe(false);
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
