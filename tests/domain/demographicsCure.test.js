/**
 * demographicsCure.test.js — THE CURE PIN. The soul of wave P1.
 *
 * THE FINDING (executed evidence, design header): the 300-year research soak
 * `research-300y-12s-seed1.json` (source b66e9551) FAILED its realm-population-bounded
 * check. Two settlements compounded at a smooth x1.07/year to 2.91e13 and 1.64e13
 * people while six siblings floored at 200 to 500. The realm BIFURCATED: unbounded
 * winners, floored losers, nothing between. It was INVISIBLE at thirty years, which is
 * why the horizon here is three hundred and not the suite's usual handful of ticks.
 *
 * THIS FILE RUNS THE SAME HORIZON, THREE TIMES:
 *
 *   1. CURED       the real kernel. Every settlement must PLATEAU.
 *   2. REVERTED-A  the death floor deleted (J-P2's guarantee removed) and nothing else.
 *                  The same fixture must lose its plateau and climb past its own bound.
 *   3. REVERTED-B  the pre-cure model exactly: births at the band, no death side, no
 *                  capacity response. The same fixture must re-create the COMPOUNDING
 *                  shape that produced the trillions.
 *
 * The two reverts are what make the plateau a finding rather than a fixture artefact:
 * without them, run 1 would pass just as well against a settlement that never moved.
 * They are executed here, in this file, on every run.
 */
import { describe, expect, test, vi } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import { advanceDemographics } from '../../src/domain/worldPulse/demographicsKernel.js';
import {
  BIRTH_BANDS, densityCeilingOf, effectiveBoundOf, foodCapacityOf,
} from '../../src/domain/worldPulse/demographicsRates.js';

const RATES_MODULE = '../../src/domain/worldPulse/demographicsRates.js';
const LIT = { simulationRules: { demographicsEnabled: true } };
const YEARS = 300;

function place({ id, tier, terrain, population, dailyProduction }) {
  return {
    population, tier, name: id,
    config: { tier, terrainType: terrain },
    economicState: {
      foodSecurity: {
        dailyNeed: population * 2, dailyProduction, deficitPct: 0, surplusPct: 5,
        importDependency: 0.2, storageMonths: 6, resilienceScore: 60,
      },
    },
    npcs: [],
  };
}

/** A realm shaped like the failing soak's: every tier, every terrain class, mixed
 *  granary-bound and wall-bound, from a thorp to a metropolis. */
const REALM = Object.freeze([
  ['Ashford', { tier: 'town', terrain: 'plains', population: 1200, dailyProduction: 6000 }],
  ['Brackwater', { tier: 'hamlet', terrain: 'riverside', population: 320, dailyProduction: 1600 }],
  ['Cairnhold', { tier: 'thorp', terrain: 'mountain', population: 40, dailyProduction: 300 }],
  ['Dunmarch', { tier: 'city', terrain: 'hills', population: 7000, dailyProduction: 30000 }],
  ['Elderfen', { tier: 'village', terrain: 'forest', population: 700, dailyProduction: 2600 }],
  ['Fallowmere', { tier: 'metropolis', terrain: 'coastal', population: 30000, dailyProduction: 130000 }],
]);

const realmUpdates = () => REALM.map(([id, spec]) => ({ saveId: id, settlement: place({ id, ...spec }) }));
const snapshotOf = (updates) => ({
  settlements: updates.map((u) => ({ id: u.saveId, name: u.saveId, settlement: u.settlement })),
});

/** The authored bound each settlement is measured against, read from the live tables. */
function boundsOf(updates) {
  const out = new Map();
  for (const u of updates) {
    out.set(u.saveId, effectiveBoundOf(foodCapacityOf(u.settlement, LIT, u.saveId), densityCeilingOf(u.settlement)).bound);
  }
  return out;
}

/**
 * Drive `step` for YEARS years and return a per-settlement yearly series.
 * @param {(args: object) => { settlementUpdates: Array<object> }} step
 */
function century(step, seed = 'cure-seed-1') {
  let live = realmUpdates();
  const series = new Map(live.map((u) => [u.saveId, [u.settlement.population]]));
  for (let t = 1; t <= YEARS * 52; t += 1) {
    const r = step({
      snapshot: snapshotOf(live), worldState: LIT, settlementUpdates: live,
      rng: createPRNG(`${seed}::tick:${t}::one_week`), tick: t,
    });
    live = r.settlementUpdates;
    if (t % 52 === 0) for (const u of live) series.get(u.saveId).push(u.settlement.population);
  }
  return series;
}

const realmTotalAt = (series, year) => [...series.values()].reduce((sum, s) => sum + s[year], 0);

/** Load the kernel against a PATCHED rates module. The kernel source is untouched:
 *  only the rate it is handed changes, which is exactly what "revert the cure" means. */
async function kernelWithRates(patch) {
  vi.resetModules();
  vi.doMock(RATES_MODULE, async (importOriginal) => {
    const actual = await importOriginal();
    return { ...actual, demographicRates: (input) => patch(actual.demographicRates(input), input) };
  });
  const mod = await import('../../src/domain/worldPulse/demographicsKernel.js');
  vi.doUnmock(RATES_MODULE);
  vi.resetModules();
  return mod.advanceDemographics;
}

describe('THE CURE — a 300-year run on a seeded fixture realm PLATEAUS', () => {
  test('every settlement flattens inside its own bound band, and the second century is still', () => {
    const bounds = boundsOf(realmUpdates());
    const series = century(advanceDemographics);

    for (const [id, s] of series) {
      const bound = bounds.get(id);
      const start = s[0];
      const y100 = s[100];
      const y150 = s[150];
      const y200 = s[200];
      const y300 = s[300];

      // 1. NOBODY GROWS PAST THEIR BOUND BAND. J-P5 allows a brief overshoot under a
      //    food collapse; a steady state above the bound is the defect.
      expect(y300 / bound, `${id} settled ABOVE its own bound (${y300} vs ${bound})`)
        .toBeLessThanOrEqual(1.05);

      // 2. IT IS A PLATEAU, NOT SLOWER GROWTH. The second half of the run is flat.
      expect(Math.abs(y300 - y150) / y150, `${id} was still climbing between year 150 and 300`)
        .toBeLessThanOrEqual(0.05);

      // 3. THE DESIGN'S ACCEPTANCE, verbatim: no monotone growth past ~x50
      //    century-over-century.
      expect(y200 / y100, `${id} century-over-century growth`).toBeLessThan(50);
      expect(y300 / y200, `${id} century-over-century growth`).toBeLessThan(50);

      // 4. THE FIXTURE IS NOT TRIVIALLY STATIC. Every settlement genuinely grew into
      //    its bound before it stopped, so the flatness above is an equilibrium and
      //    not a fixture that never moved.
      expect(y150, `${id} never grew at all: the plateau proves nothing`).toBeGreaterThan(start);
      expect(y300 / bound, `${id} plateaued far below its bound: the bound is not what stopped it`)
        .toBeGreaterThan(0.6);
    }

    // 5. NO BIFURCATION. The soak's signature was unbounded winners beside floored
    //    losers with nothing between; here every settlement sits in the same narrow
    //    band of its own bound.
    const ratios = [...series].map(([id, s]) => s[300] / bounds.get(id));
    expect(Math.max(...ratios) - Math.min(...ratios), 'the realm bifurcated').toBeLessThan(0.3);
  });
});

describe('THE NEGATIVE CONTROLS — reverting the cure re-creates the defect', () => {
  test('REVERT A: delete the natural-mortality floor and the plateau is gone', async () => {
    const deathless = await kernelWithRates((rates) => ({ ...rates, death01: 0 }));
    const bounds = boundsOf(realmUpdates());
    const series = century(deathless);

    // The plateau assertions above must now FAIL, and they must fail in the runaway's
    // direction rather than by noise.
    const overBound = [...series].filter(([id, s]) => s[300] / bounds.get(id) > 1.5);
    expect(overBound.length, 'with no death floor, settlements must climb past their bound')
      .toBeGreaterThan(0);

    const stillClimbing = [...series].filter(([, s]) => s[300] / s[150] > 1.3);
    expect(stillClimbing.length, 'with no death floor, the second century must still be climbing')
      .toBeGreaterThan(0);

    // And it is MONOTONE: a deathless settlement never gives a single person back.
    for (const [id, s] of series) {
      for (let y = 1; y <= YEARS; y += 1) {
        expect(s[y], `${id} lost people in year ${y} with mortality deleted`).toBeGreaterThanOrEqual(s[y - 1]);
      }
    }
  });

  test('REVERT B: the pre-cure model (births, no death side, no capacity) re-creates the COMPOUNDING shape', async () => {
    // This is the defect as the design describes it: "births without a death side,
    // growth without a carrying capacity". The birth band is restored to its unmodulated
    // authored value and the death term is removed.
    const preCure = await kernelWithRates((rates, input) => {
      const tier = String(input.settlement && input.settlement.tier ? input.settlement.tier : 'village');
      return { ...rates, birth01: BIRTH_BANDS[tier] || BIRTH_BANDS.village, death01: 0 };
    });
    const runaway = century(preCure);
    const cured = century(advanceDemographics);

    const runawayTotal = realmTotalAt(runaway, YEARS);
    const curedTotal = realmTotalAt(cured, YEARS);
    expect(runawayTotal / curedTotal, 'the reverted model must produce an unbounded realm')
      .toBeGreaterThan(1000);

    // THE COMPOUNDING SIGNATURE: equal ratios over equal spans. A settlement whose
    // century-over-century multiplier is roughly constant is on an exponential, which
    // is precisely the smooth x1.07/year curve the soak receipt recorded.
    for (const [id, s] of runaway) {
      const first = s[100] / s[0];
      const second = s[200] / s[100];
      const third = s[300] / s[200];
      expect(first, `${id} did not compound in its first century`).toBeGreaterThan(10);
      expect(second / first, `${id} is not on an exponential`).toBeGreaterThan(0.5);
      expect(third / second, `${id} is not on an exponential`).toBeGreaterThan(0.5);
    }

    // And the bifurcation returns: the realm's largest settlement runs away from the
    // bound while the arithmetic of the smallest keeps it small.
    const bounds = boundsOf(realmUpdates());
    const ratios = [...runaway].map(([id, s]) => s[300] / bounds.get(id));
    expect(Math.max(...ratios), 'no settlement ran away').toBeGreaterThan(1000);
  });

  test('RESTORE: the unmocked kernel is green again in the same file, after both reverts', () => {
    // The revert/red/restore/green discipline, executed rather than described: the two
    // tests above ran a patched kernel; this one re-runs the real one and re-asserts the
    // plateau, so a leaked mock cannot silently make the cure pin vacuous.
    const bounds = boundsOf(realmUpdates());
    const series = century(advanceDemographics, 'cure-seed-2');
    for (const [id, s] of series) {
      expect(s[300] / bounds.get(id), `${id} after restore`).toBeLessThanOrEqual(1.05);
      expect(Math.abs(s[300] - s[150]) / s[150], `${id} after restore`).toBeLessThanOrEqual(0.05);
    }
  });
});
