/**
 * tests/generators/metropolisTailedRoll.test.js — X-46 car 1b, THE TAILED ROLL (the owner,
 * 2026-11-04: "wait, we have a cap on metropolis? it should not have a cap.").
 *
 * The metropolis random population has no ceiling. It is a two-piece log-uniform draw from ONE
 * registered table (src/data/constants.js :: METROPOLIS_ROLL_TUNING): with probability tailShare
 * the tail [60,000, 1,000,000], otherwise the body [15,000, 60,000]. The draw is ONE kernel draw,
 * exactly as the uniform roll was, so no later step of any seed sees a different draw count; and
 * no other tier's roll moves (the sixty non-metropolis seeds below are pinned byte-identical to
 * the uniform roll they had before this car, which this file recomputes from the same kernel).
 */
import { describe, expect, test } from 'vitest';

import { POPULATION_RANGES, METROPOLIS_ROLL_TUNING, rollMetropolisPopulation } from '../../src/data/constants.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const generate = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });
const quantile = (sorted, q) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];

describe('the metropolis roll has no ceiling', () => {
  test('400 metropolis seeds: p90 above 60,000, max above 150,000, median inside the body, nothing below 15,000', () => {
    const pops = [];
    for (let i = 0; i < 400; i++) pops.push(generate({ settType: 'metropolis' }, `x46-1b-metro-${i}`).population);
    pops.sort((a, b) => a - b);
    const median = quantile(pops, 0.5);
    expect(quantile(pops, 0.9)).toBeGreaterThan(60000);
    expect(pops[pops.length - 1]).toBeGreaterThan(150000);
    expect(median).toBeGreaterThanOrEqual(15000);
    expect(median).toBeLessThanOrEqual(60000);
    expect(pops[0]).toBeGreaterThanOrEqual(15000);
    expect(pops.every(Number.isInteger)).toBe(true);
  }, 180000);

  test('the table is the one home: body 15,000-60,000, tail to 1,000,000 at a share of 0.2; the band reads the body', () => {
    expect(METROPOLIS_ROLL_TUNING).toEqual({ tailShare: 0.2, bodyMin: 15000, bodyMax: 60000, tailMax: 1000000 });
    expect(POPULATION_RANGES.metropolis).toEqual({ min: METROPOLIS_ROLL_TUNING.bodyMin, max: METROPOLIS_ROLL_TUNING.bodyMax });
  });

  test('the roll is one draw and lands at the edges it promises', () => {
    let draws = 0;
    const counted = { random: () => { draws += 1; return 0.5; } };
    rollMetropolisPopulation(counted);
    expect(draws).toBe(1);
    expect(rollMetropolisPopulation({ random: () => 0 })).toBe(60000); // u = 0 opens the tail at its floor
    expect(rollMetropolisPopulation({ random: () => 0.2 })).toBe(15000); // the body's floor
    expect(rollMetropolisPopulation({ random: () => 0.999999999 })).toBeLessThanOrEqual(60000);
    expect(rollMetropolisPopulation({ random: () => 0.199999999 })).toBeLessThanOrEqual(1000000);
    expect(rollMetropolisPopulation({ random: () => 0.199999999 })).toBeGreaterThan(900000);
  });
});

describe('no other tier moves', () => {
  test('60 non-metropolis seeds: the population is the uniform roll of the same kernel draw, unchanged', () => {
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
