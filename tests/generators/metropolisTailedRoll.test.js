/**
 * tests/generators/metropolisTailedRoll.test.js — X-46 car 1b, THE THINNING TAIL (the owner,
 * 2026-11-04: "it should not have a cap"; "bring it back to 1 million, but make it so that
 * anything above ... gets increasingly rarer"; "start that thinning out at 50,000"; "it thins out
 * even harder starting at 100,000+ then again at 200,000+"; "just make it exponential in a way
 * hitting those three benchmarks"; then "i leave everything to your judgement": the seat took
 * the rarer variant, 30% of rolls past 50,000, Zipf's share there).
 *
 * Uniform over the body [15,000, 50,000] for 70% of rolls; for 30%, past it, the density per person is exp(-0.5 * D²),
 * D = doublings past 50,000, to 1,000,000. ONE kernel draw, as the uniform roll was, so no later
 * step of any seed sees a different draw count; no other tier's roll moves (sixty
 * non-metropolis seeds; the full-record hashes were compared base vs tip in the seat's probe).
 */
import { describe, expect, test } from 'vitest';

import { POPULATION_RANGES, METROPOLIS_ROLL_TUNING, rollMetropolisPopulation } from '../../src/data/constants.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const generate = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });
const quantile = (sorted, q) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
const at = (u) => rollMetropolisPopulation({ random: () => u });
/** The exact share above x, over a fine uniform sweep of the one draw. */
const shareAbove = (() => {
  const N = 400000;
  const pops = [];
  for (let i = 0; i < N; i++) pops.push(at((i + 0.5) / N));
  return (x) => pops.filter(p => p > x).length / N;
})();

describe('the metropolis roll thins past 50,000 to 1,000,000, harder at every doubling', () => {
  test('400 metropolis seeds: p90 above 60,000, max above 150,000 and never past 1,000,000, nothing below 15,000', () => {
    const pops = [];
    for (let i = 0; i < 400; i++) pops.push(generate({ settType: 'metropolis' }, `x46-1b-metro-${i}`).population);
    pops.sort((a, b) => a - b);
    expect(quantile(pops, 0.9)).toBeGreaterThan(60000);
    expect(pops[pops.length - 1]).toBeGreaterThan(150000);
    expect(pops[pops.length - 1]).toBeLessThanOrEqual(1000000);
    expect(pops[0]).toBeGreaterThanOrEqual(15000);
    expect(pops.every(Number.isInteger)).toBe(true);
  }, 180000);

  test('the table is the one home, and the band reads its body', () => {
    expect(METROPOLIS_ROLL_TUNING).toEqual({ bodyMin: 15000, bodyMax: 50000, tailMax: 1000000, thinning: 0.5, tailShare: 0.3 });
    expect(POPULATION_RANGES.metropolis).toEqual({ min: 15000, max: 50000 });
  });

  test('the measured shares: >50k 30% (Zipf), >100k 15%, >200k 3.8%, >500k 0.16%, >900k about 1 in 25,000', () => {
    expect(shareAbove(50000)).toBeCloseTo(0.3, 3);
    expect(shareAbove(100000)).toBeCloseTo(0.151, 2);
    expect(shareAbove(200000)).toBeCloseTo(0.038, 2);
    expect(shareAbove(500000)).toBeCloseTo(0.0016, 3);
    expect(shareAbove(900000)).toBeGreaterThan(0);
    expect(shareAbove(900000)).toBeLessThan(0.0002);
  });

  test('one draw; the edges; each doubling past 50,000 thins harder than the last', () => {
    let draws = 0;
    rollMetropolisPopulation({ random: () => { draws += 1; return 0.5; } });
    expect(draws).toBe(1);
    expect(at(0)).toBe(50000);
    expect(at(METROPOLIS_ROLL_TUNING.tailShare - 1e-12)).toBe(1000000);
    expect(at(METROPOLIS_ROLL_TUNING.tailShare)).toBe(15000);
    expect(at(0.999999999)).toBe(50000);
    // mass per doubling band: 50-100k, 100-200k, 200-400k, 400-800k; each ratio smaller than the last
    const band = (lo, hi) => shareAbove(lo) - shareAbove(hi);
    const m = [band(50000, 100000), band(100000, 200000), band(200000, 400000), band(400000, 800000)];
    const ratios = [m[1] / m[0], m[2] / m[1], m[3] / m[2]];
    expect(ratios[1]).toBeLessThan(ratios[0]);
    expect(ratios[2]).toBeLessThan(ratios[1]);
  });
});

describe('no other tier moves', () => {
  test('60 non-metropolis seeds: tier as chosen, population inside the band', () => {
    const tiers = ['thorp', 'hamlet', 'village', 'town', 'city'];
    const moved = [];
    for (let i = 0; i < 60; i++) {
      const tier = tiers[i % tiers.length];
      const seed = `x46-1b-calm-${tier}-${i}`;
      const record = generate({ settType: tier }, seed);
      const { min, max } = POPULATION_RANGES[tier];
      if (record.tier !== tier || record.population < min || record.population > max) moved.push(`${seed}: ${record.tier} ${record.population}`);
    }
    expect(moved).toEqual([]);
  }, 120000);
});
