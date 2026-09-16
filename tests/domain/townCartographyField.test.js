/**
 * townCartographyField.test.js — THE WEYL REQUIREMENT, with its aliasing control.
 *
 * The field stage subsamples the manifest's 33x33 terrain raster in four places.
 * Every one must go through `spreadIndices` (domain/lowDiscrepancy.js) and none
 * may use an arithmetic stride. That rule is not a preference: an evenly spaced
 * integer stride RESONATES with a grid pack's row width, and the recorded incident
 * measured a stride of 6 on a 12-wide fixture selecting two columns and making an
 * entire mountain ridge structurally unreachable.
 *
 * THE NEGATIVE CONTROL BELOW REPRODUCES THAT BITE AT THIS SLICE'S OWN NUMBERS.
 * On the live 33-wide grid, with the live per-tier attractor budgets, an
 * arithmetic stride collapses coverage exactly where the sampler prevents it, and
 * the test measures both so the prevention is evidence rather than a claim.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import {
  cartographyFixture,
  cartographySeedFamily,
} from '../helpers/townCartographyFixture.js';
import { spreadIndices } from '../../src/domain/lowDiscrepancy.js';
import { buildCartographyField } from '../../src/domain/townCartography/cartographyField.js';
import { readTownMorphology } from '../../src/domain/townCartography/cartographyMorphology.js';
import {
  TOWN_CARTOGRAPHY_TUNING,
} from '../../src/domain/townCartography/cartographyTuning.js';
import { TOWN_SCENE_TERRAIN_GRID_SIZE } from '../../src/domain/townScene/manifestContract.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PACKAGE = join(ROOT, 'src/domain/townCartography');
const readSource = (name) => readFileSync(join(PACKAGE, name), 'utf8');

const GRID = TOWN_SCENE_TERRAIN_GRID_SIZE;
const CELLS = GRID * GRID;

/** A counted stream that is not seeded: the field's determinism is proven
 *  elsewhere; here the draws only need to be reproducible within one call. */
function fixedStream() {
  const stream = { draws: 0, unit: () => { stream.draws += 1; return 0.5; } };
  return stream;
}

/**
 * THE CONTROL. An arithmetic stride subsample, the exact idiom the Weyl sampler
 * replaced. Defined here in the TEST so the product source never carries it.
 */
function strideIndices(length, count) {
  const step = Math.max(1, Math.floor(length / count));
  const out = [];
  for (let i = 0; i < length && out.length < count; i += step) out.push(i);
  return out;
}

const distinctColumns = (cells) => new Set(cells.map((cell) => cell % GRID)).size;
const distinctRows = (cells) => new Set(cells.map((cell) => Math.floor(cell / GRID))).size;

describe('the Weyl sampler is the only cell subsampler in the package', () => {
  test('the three subsampling modules import spreadIndices from the single writer', () => {
    for (const name of ['cartographyField.js', 'cartographySkeleton.js', 'cartographyDefenses.js']) {
      expect(readSource(name)).toContain("import { spreadIndices } from '../lowDiscrepancy.js'");
    }
  });

  test('no module rolls its own stride subsample', () => {
    /** @type {string[]} */
    const offenders = [];
    for (const name of ['cartographyField.js', 'cartographySkeleton.js', 'cartographyDefenses.js']) {
      const source = readSource(name)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      // The stride idiom: a step derived by dividing a length by a count, then
      // used to walk the array. Either half alone is innocent; the pair is the bug.
      if (/\bstep\s*=\s*Math\s*\.\s*(?:floor|max|round)?\s*\(?[^;]*\/\s*count/.test(source)) {
        offenders.push(`${name}: derives a stride from length/count`);
      }
      if (/\+=\s*stride\b/.test(source)) offenders.push(`${name}: walks by a stride`);
    }
    expect(offenders).toEqual([]);
  });
});

describe('the aliasing the Weyl sampler prevents, measured on THIS grid', () => {
  test('a stride sized to the row width selects ONE column; the sampler selects 28', () => {
    // The recorded bite, reproduced at 33 wide. count = GRID makes step = GRID
    // exactly, so every strided index is congruent to 0 mod GRID.
    const strided = strideIndices(CELLS, GRID);
    const spread = spreadIndices(CELLS, GRID);
    expect(strided.length).toBe(GRID);
    expect(spread.length).toBe(GRID);
    expect(distinctColumns(strided)).toBe(1);
    expect(distinctColumns(spread)).toBe(28);
    // The stride's rows look perfect, which is why the defect hides: a coverage
    // check on one axis alone would pass it.
    expect(distinctRows(strided)).toBe(GRID);
  });

  test("a stride at the CITY attractor budget reaches 11 of 33 columns; the sampler reaches all 33", () => {
    const budget = TOWN_CARTOGRAPHY_TUNING.FIELD_ATTRACTOR_CANDIDATES.city;
    expect(budget).toBe(160);
    const strided = strideIndices(CELLS, budget);
    const spread = spreadIndices(CELLS, budget);
    expect(distinctColumns(strided)).toBe(11);
    expect(distinctColumns(spread)).toBe(GRID);
    expect(distinctRows(spread)).toBe(GRID);
  });

  test('the LIVE field attractors inherit the sampler coverage on every tier', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const fixture = cartographyFixture(row);
      const field = buildCartographyField({
        terrain: fixture.terrain,
        roads: fixture.roads,
        morphology: readTownMorphology(fixture.settlement),
        tier: row.tier,
        stream: fixedStream(),
      });
      // Attractors are jittered plan points, so coverage is measured in plan
      // bands rather than raster columns: the claim is that the demand field
      // reaches the whole plan, not that it lands on particular cells.
      const bands = new Set(field.attractors.map((point) => Math.floor(point[0] / 100)));
      expect(bands.size).toBeGreaterThanOrEqual(6);
    });
    expectNoSeedFailures(failures, 'lane attractors span the plan on every tier and site');
  });
});

describe('the field reads the manifest raster, and reads it whole', () => {
  test('one cost and one water flag per raster cell (no cell is unreachable)', () => {
    const fixture = cartographyFixture({ tier: 'city' });
    const field = buildCartographyField({
      terrain: fixture.terrain,
      roads: fixture.roads,
      morphology: readTownMorphology(fixture.settlement),
      tier: 'city',
      stream: fixedStream(),
    });
    expect(field.gridSize).toBe(GRID);
    expect(field.cost.length).toBe(CELLS);
    expect(field.water.length).toBe(CELLS);
    expect(field.cost.every((value) => Number.isFinite(value) && value >= 1)).toBe(true);
  });

  test('water raises cost and roads lower it (the boundary conditions are real)', () => {
    const fixture = cartographyFixture({ tier: 'city', site: 'river' });
    const morphology = readTownMorphology(fixture.settlement);
    const withRoads = buildCartographyField({
      terrain: fixture.terrain,
      roads: fixture.roads,
      morphology,
      tier: 'city',
      stream: fixedStream(),
    });
    const withoutRoads = buildCartographyField({
      terrain: fixture.terrain,
      roads: [],
      morphology,
      tier: 'city',
      stream: fixedStream(),
    });
    const wetCells = withRoads.water.filter(Boolean).length;
    expect(wetCells).toBeGreaterThan(0);
    const wetCost = withRoads.cost.filter((_, index) => withRoads.water[index]);
    const dryCost = withRoads.cost.filter((_, index) => !withRoads.water[index]);
    expect(Math.min(...wetCost)).toBeGreaterThan(Math.max(...dryCost));
    // Removing the routes can only raise costs: the discount is the only term the
    // roads contribute, so a road-free field is pointwise at least as expensive.
    let cheaper = 0;
    for (let cell = 0; cell < CELLS; cell += 1) {
      expect(withoutRoads.cost[cell]).toBeGreaterThanOrEqual(withRoads.cost[cell]);
      if (withoutRoads.cost[cell] > withRoads.cost[cell]) cheaper += 1;
    }
    expect(cheaper).toBeGreaterThan(0);
  });

  test('a settlement with no water has no water cells and no bridge substrate', () => {
    const fixture = cartographyFixture({ tier: 'city', withWater: false });
    const field = buildCartographyField({
      terrain: fixture.terrain,
      roads: fixture.roads,
      morphology: readTownMorphology(fixture.settlement),
      tier: 'city',
      stream: fixedStream(),
    });
    expect(field.waterPaths).toEqual([]);
    expect(field.water.some(Boolean)).toBe(false);
  });

  test('the field spends exactly two draws per attractor and no others', () => {
    const fixture = cartographyFixture({ tier: 'metropolis' });
    const stream = fixedStream();
    const field = buildCartographyField({
      terrain: fixture.terrain,
      roads: fixture.roads,
      morphology: readTownMorphology(fixture.settlement),
      tier: 'metropolis',
      stream,
    });
    expect(stream.draws).toBe(field.attractors.length * 2);
  });

  test('an unroutable settlement still gets seeds (cardinal fallback, fixed order)', () => {
    const fixture = cartographyFixture({ tier: 'town', withRoads: false, withWater: false });
    const field = buildCartographyField({
      terrain: fixture.terrain,
      roads: fixture.roads,
      morphology: readTownMorphology(fixture.settlement),
      tier: 'town',
      stream: fixedStream(),
    });
    expect(field.seeds.length).toBe(TOWN_CARTOGRAPHY_TUNING.ARTERIAL_SEEDS.town);
  });
});
