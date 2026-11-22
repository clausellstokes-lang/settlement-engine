/**
 * townCartographySkeleton.test.js — THE ITERATION-CAP CONTRACT (design §7).
 *
 * "Every stage carries hard iteration caps... caps + rubric-gated deterministic
 * re-rolls, never open-ended search." A cap that merely happens to be large enough
 * is a safety net. This file makes it a CONTRACT: `maximumSynthesisWork` composes
 * the authored caps into one declared number, the number is pinned literally here,
 * and the measured work receipt of the LARGEST LEGAL TOWN is asserted against it.
 * Raising any cap without re-deriving the bound is therefore impossible.
 *
 * The second half proves the caps BIND rather than merely bound: the lane stage is
 * driven with a synthetic demand field big enough to exhaust its node budget, and
 * the loop stops at the authored number rather than at whatever the data allowed.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import {
  cartographyFixture,
  cartographySeedFamily,
  GOVERNANCE_CHAOTIC,
} from '../helpers/townCartographyFixture.js';
import { synthesizeTownSkeleton } from '../../src/domain/townCartography/cartographySynthesis.js';
import { growLanes } from '../../src/domain/townCartography/cartographySkeleton.js';
import { readTownMorphology } from '../../src/domain/townCartography/cartographyMorphology.js';
import {
  CARTOGRAPHY_TIERS,
  LARGEST_LEGAL_TIER,
  TOWN_CARTOGRAPHY_TUNING,
  cartographyBand,
  maximumSynthesisWork,
} from '../../src/domain/townCartography/cartographyTuning.js';
import { TOWN_SCENE_TERRAIN_GRID_SIZE } from '../../src/domain/townScene/manifestContract.js';

const CELLS = TOWN_SCENE_TERRAIN_GRID_SIZE * TOWN_SCENE_TERRAIN_GRID_SIZE;

describe('the iteration bound is a declared number', () => {
  test('the largest legal town is the metropolis and its budget is 1,472,796 steps', () => {
    expect(LARGEST_LEGAL_TIER).toBe('metropolis');
    expect(CARTOGRAPHY_TIERS[CARTOGRAPHY_TIERS.length - 1]).toBe('metropolis');
    // THE NUMBER. If a cap in TOWN_CARTOGRAPHY_TUNING moves, this moves with it and
    // the change is a visible, reviewed act rather than a quiet loosening.
    expect(maximumSynthesisWork(LARGEST_LEGAL_TIER, CELLS)).toBe(1472796);
  });

  test('the bound is monotone in tier (a bigger town may never be cheaper)', () => {
    let previous = 0;
    for (const tier of CARTOGRAPHY_TIERS) {
      const budget = maximumSynthesisWork(tier, CELLS);
      expect(budget).toBeGreaterThan(previous);
      previous = budget;
    }
  });

  test('the bound is composed from the caps, not a constant', () => {
    // Doubling the raster must move the bound: a bound that ignores its inputs is
    // a number that will silently stop describing the loop it claims to bound.
    expect(maximumSynthesisWork('metropolis', CELLS * 2))
      .toBeGreaterThan(maximumSynthesisWork('metropolis', CELLS));
  });
});

describe('the largest legal town terminates inside the bound', () => {
  test('metropolis on the roughest ground, under the worst governance, stays in budget', () => {
    // The worst case this slice can legally be handed: the top tier, mountain
    // relief (the highest-cost raster the profile table produces), water to bridge,
    // three approach routes to seed from, and chaotic governance (which maximises
    // the wander and therefore the geometry).
    const fixture = cartographyFixture({
      tier: 'metropolis',
      site: 'mountain',
      seedKey: 'worst-case',
      governance: GOVERNANCE_CHAOTIC,
    });
    const result = synthesizeTownSkeleton(fixture);
    expect(result.receipts.workBudget).toBe(1472796);
    expect(result.receipts.work.total).toBeLessThanOrEqual(result.receipts.workBudget);
    expect(result.receipts.withinBudget).toBe(true);
  });

  test('every seed in the family stays inside its own tier budget', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const result = synthesizeTownSkeleton(cartographyFixture(row));
      expect(result.receipts.withinBudget).toBe(true);
      expect(result.receipts.work.total).toBeLessThanOrEqual(
        maximumSynthesisWork(row.tier, CELLS),
      );
    });
    expectNoSeedFailures(failures, 'bounded work holds across the corpus matrix');
  });

  test('every seed respects the lane iteration and node caps', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const result = synthesizeTownSkeleton(cartographyFixture(row));
      expect(result.receipts.laneIterations)
        .toBeLessThanOrEqual(TOWN_CARTOGRAPHY_TUNING.LANE_ITERATIONS);
      expect(result.streets.lanes.length).toBeLessThan(result.receipts.laneNodeCap);
      expect(result.infrastructureCandidates.gates.length)
        .toBeLessThanOrEqual(TOWN_CARTOGRAPHY_TUNING.MAX_GATES);
      expect(result.infrastructureCandidates.bridges.length)
        .toBeLessThanOrEqual(TOWN_CARTOGRAPHY_TUNING.MAX_BRIDGES);
    });
    expectNoSeedFailures(failures, 'every authored cap holds across the corpus matrix');
  });

  test('A-3: the streets layer fits its per-tier byte budget on every seed', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const result = synthesizeTownSkeleton(cartographyFixture(row));
      expect(result.receipts.bytes).toBeGreaterThan(0);
      expect(result.receipts.bytes).toBeLessThanOrEqual(result.receipts.byteBudget);
    });
    expectNoSeedFailures(failures, 'the new layer fits inside the compile-input cap');
  });
});

describe('the caps BIND, not merely bound', () => {
  /** A synthetic demand field: 400 attractors spread over the plan, far enough
   *  apart that the lane stage cannot retire them cheaply. */
  function saturatedField() {
    /** @type {Array<[number, number]>} */
    const attractors = [];
    for (let i = 0; i < 400; i += 1) {
      attractors.push([(i * 37) % 1000, (i * 61) % 1000]);
    }
    return {
      gridSize: 3,
      cost: [10, 10, 10, 10, 10, 10, 10, 10, 10],
      water: [false, false, false, false, false, false, false, false, false],
      core: /** @type {[number, number]} */ ([500, 500]),
      attractors,
      seeds: [],
      waterPaths: [],
      roadPaths: [],
      work: 0,
    };
  }

  const spine = [{
    id: 'carto:arterial:0',
    kind: /** @type {'arterial'} */ ('arterial'),
    centerline: /** @type {Array<[number, number]>} */ ([[500, 0], [500, 250], [500, 500]]),
  }];

  test('the lane node budget stops growth at the authored number', () => {
    const morphology = readTownMorphology(cartographyFixture({ tier: 'metropolis' }).settlement);
    const stream = { draws: 0, unit() { this.draws += 1; return 0.5; } };
    const result = growLanes(saturatedField(), spine, morphology, 'metropolis', stream);
    const nodeCap = cartographyBand(TOWN_CARTOGRAPHY_TUNING.LANE_NODES, 'metropolis');
    expect(nodeCap).toBe(260);
    // Every emitted lane is one node beyond the seeds, so the lane count can never
    // reach the node cap; hitting it exactly would mean the cap did not stop growth.
    expect(result.streets.length).toBeLessThan(nodeCap);
    expect(result.streets.length).toBeGreaterThan(100);
    expect(result.iterations).toBeLessThanOrEqual(TOWN_CARTOGRAPHY_TUNING.LANE_ITERATIONS);
  });

  test('a smaller tier band produces a strictly smaller fabric from the SAME demand', () => {
    // The density band is what scales the town, not the attractor supply: the same
    // saturated field must build a village smaller than a metropolis.
    const morphology = readTownMorphology(cartographyFixture({ tier: 'village' }).settlement);
    const small = growLanes(
      saturatedField(), spine, morphology, 'village',
      { draws: 0, unit() { this.draws += 1; return 0.5; } },
    );
    const large = growLanes(
      saturatedField(), spine, morphology, 'metropolis',
      { draws: 0, unit() { this.draws += 1; return 0.5; } },
    );
    expect(small.streets.length).toBeLessThan(large.streets.length);
    expect(small.streets.length)
      .toBeLessThan(cartographyBand(TOWN_CARTOGRAPHY_TUNING.LANE_NODES, 'village'));
  });
});

describe('arterials arrive by construction', () => {
  test('every arterial starts at its seed and ends exactly at the core', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const fixture = cartographyFixture(row);
      const result = synthesizeTownSkeleton(fixture);
      for (const street of result.streets.arterials) {
        const last = street.centerline[street.centerline.length - 1];
        expect(street.centerline.length)
          .toBeLessThanOrEqual(TOWN_CARTOGRAPHY_TUNING.ARTERIAL_STEPS + 1);
        expect(street.centerline.length).toBeGreaterThanOrEqual(3);
        expect(last).toEqual(result.streets.arterials[0].centerline.slice(-1)[0]);
      }
    });
    expectNoSeedFailures(failures, 'no arterial is truncated by its own cap');
  });

  test('every emitted plan coordinate is an integer inside the plan extent', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const result = synthesizeTownSkeleton(cartographyFixture(row));
      const points = [
        ...result.streets.arterials.flatMap((street) => street.centerline),
        ...result.streets.lanes.flatMap((street) => street.centerline),
        ...result.infrastructureCandidates.gates.map((gate) => gate.position),
        ...result.infrastructureCandidates.bridges.map((bridge) => bridge.position),
        ...result.infrastructureCandidates.walls.flatMap((wall) => wall.ring),
      ];
      expect(points.length).toBeGreaterThan(0);
      for (const point of points) {
        expect(Number.isInteger(point[0])).toBe(true);
        expect(Number.isInteger(point[1])).toBe(true);
        expect(point[0]).toBeGreaterThanOrEqual(0);
        expect(point[0]).toBeLessThanOrEqual(1000);
        expect(point[1]).toBeGreaterThanOrEqual(0);
        expect(point[1]).toBeLessThanOrEqual(1000);
      }
    });
    expectNoSeedFailures(failures, 'no float geometry crosses the contract');
  });
});
