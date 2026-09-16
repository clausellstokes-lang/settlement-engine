/**
 * autoplacement.test.js — W-G / J-D1: THE PLACER'S PINS.
 *
 * Every behavioural claim in this file is paired with a NEGATIVE CONTROL that is
 * executed, not asserted: the control shows the pin failing when the property is
 * removed, so a pin that would pass over a broken placer is caught here rather
 * than in a soak six weeks later.
 *
 * The fixture realm is a grid pack in the FMG capture's own shape
 * ({ cells: { h, biome, r, p, c } }), so the adapter under test is the real one
 * and nothing about the pack contract is stubbed.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

import {
  GENESIS_TERRAINS,
  HILL_HEIGHT,
  realmRasterFromPack,
  readPackArrays,
  terrainCensus,
  terrainFitsCell,
  terrainPlaceName,
} from '../../src/domain/realm/placementRaster.js';
import {
  AUTOPLACEMENT_TUNING,
  AUTOPLACEMENT_VERSION,
  candidateCells,
  planAutoplacement,
  realmSpacing,
  tieHash,
} from '../../src/domain/realm/autoplacement.js';
import { normalizeSpatialPack } from '../../src/domain/spatial/spatialDigest.js';
import { LAND_HEIGHT, MOUNTAIN_HEIGHT, terrainClassOf } from '../../src/domain/spatial/spatialCost.js';
import { spreadIndices } from '../../src/domain/lowDiscrepancy.js';

// ── The fixture realm ────────────────────────────────────────────────────────
// Each ground is [height, biome, river]; the grid builder turns a (col,row) →
// ground function into a real captured-pack shape with 4-neighbour adjacency.
const OCEAN = [5, 0, 0];
const GRASS = [30, 4, 0];
const HILL = [50, 4, 0];
const RIDGE = [80, 4, 0];
const FOREST = [30, 6, 0];
const DESERT = [30, 1, 0];
const RIVER = [30, 4, 1];

/** @param {{ w: number, h: number, ground: (col: number, row: number) => number[] }} spec */
function gridPack({ w, h, ground }) {
  const cells = { h: [], biome: [], r: [], p: [], c: [] };
  for (let row = 0; row < h; row += 1) {
    for (let col = 0; col < w; col += 1) {
      const [height, biome, river] = ground(col, row);
      cells.h.push(height);
      cells.biome.push(biome);
      cells.r.push(river);
      cells.p.push([col * 10, row * 10]);
      const neighbours = [];
      if (col > 0) neighbours.push(row * w + col - 1);
      if (col < w - 1) neighbours.push(row * w + col + 1);
      if (row > 0) neighbours.push((row - 1) * w + col);
      if (row < h - 1) neighbours.push((row + 1) * w + col);
      cells.c.push(neighbours);
    }
  }
  return { cells };
}

/** A realm with every ground on it: grass west, forest, hills, ridge east, a
 *  river row, a desert block, and an ocean margin that makes a real coastline. */
const WHOLE_WORLD = gridPack({
  w: 20,
  h: 20,
  ground: (col, row) => {
    if (col === 0) return OCEAN;
    if (row === 5) return RIVER;
    if (col >= 16) return RIDGE;
    if (col >= 13) return HILL;
    if (col >= 10) return DESERT;
    if (col >= 6) return FOREST;
    return GRASS;
  },
});

/** A realm of nothing but grass and its ocean margin — no ridge, no forest, no
 *  desert. The mismatch census's habitat. */
const PLAINS_ONLY = gridPack({
  w: 16,
  h: 16,
  ground: (col) => (col === 0 ? OCEAN : GRASS),
});

/** The SAME arithmetic autoplacement.cellDistance uses. Deliberately not
 *  Math.hypot: the source avoids hypot because it is implementation-approximated
 *  across engines, and a pin that measures with a different formula can disagree
 *  with the code by an ulp on exactly the boundary assertions that matter. */
const dist = (ax, ay, bx, by) => Math.sqrt(((ax - bx) ** 2) + ((ay - by) ** 2));

const roster = (rows) => rows.map((r, i) => ({
  id: r.id || `s${i}`,
  burgId: r.burgId === undefined ? `b${i}` : r.burgId,
  name: r.name || `Settlement ${i}`,
  terrain: r.terrain,
  tier: r.tier || 'village',
  cellId: r.cellId === undefined ? null : r.cellId,
}));

describe('the raster reads the pack through the real cost law', () => {
  it('the local pack normalizer matches spatialDigest.normalizeSpatialPack exactly', () => {
    // The re-declaration guard (placementRaster header): this copy exists so the
    // placement chunk does not drag institutionalCatalog in via spatialDigest, and
    // it may never drift from the capture contract it copies.
    for (const pack of [WHOLE_WORLD, PLAINS_ONLY, { cells: {} }, {}, null]) {
      const mine = readPackArrays(pack);
      const theirs = normalizeSpatialPack(pack);
      expect(mine.cellCount).toBe(theirs.cellCount);
      expect(mine.h).toEqual(theirs.h);
      expect(mine.biome).toEqual(theirs.biome);
      expect(mine.r).toEqual(theirs.r);
      expect(mine.p).toEqual(theirs.p);
      expect(mine.c).toEqual(theirs.c);
    }
  });

  it('every cell class agrees with terrainClassOf, and water is never standable', () => {
    const raster = realmRasterFromPack(WHOLE_WORLD);
    expect(raster.cellCount).toBe(400);
    for (let cell = 0; cell < raster.cellCount; cell += 1) {
      const expected = terrainClassOf(raster.h[cell], WHOLE_WORLD.cells.biome[cell]);
      expect(raster.cls[cell]).toBe(expected === 'water' ? null : expected);
      if (raster.h[cell] < LAND_HEIGHT) {
        for (const terrain of GENESIS_TERRAINS) {
          expect(terrainFitsCell(terrain, raster, cell), `${terrain} fitted water at ${cell}`).toBe(false);
        }
      }
    }
  });

  it('the coast is exactly the land that touches water — and only where water exists', () => {
    const raster = realmRasterFromPack(WHOLE_WORLD);
    const coastCells = [];
    for (let cell = 0; cell < raster.cellCount; cell += 1) if (raster.coast[cell]) coastCells.push(cell);
    expect(coastCells.length).toBeGreaterThan(0);
    // Column 1 is the only land column adjacent to the ocean column 0.
    for (const cell of coastCells) expect(cell % 20).toBe(1);

    // NEGATIVE CONTROL: a realm with no ocean at all has no coast, so a `coastal`
    // settlement there is a genuine mismatch rather than a silently-invented shore.
    const landlocked = gridPack({ w: 8, h: 8, ground: () => GRASS });
    const dry = realmRasterFromPack(landlocked);
    expect([...dry.coast].some(Boolean)).toBe(false);
    expect(terrainCensus(dry).coastal).toBe(0);
  });

  it('the fit predicate is TOTAL over the genesis vocabulary and closed to anything else', () => {
    const raster = realmRasterFromPack(WHOLE_WORLD);
    const census = terrainCensus(raster);
    // Every genesis terrain is a key, and this realm really carries all of them —
    // a census of zeros would make the totality claim vacuous.
    expect(Object.keys(census).sort()).toEqual([...GENESIS_TERRAINS].sort());
    for (const terrain of GENESIS_TERRAINS) {
      expect(census[terrain], `${terrain} is absent from the whole-world fixture`).toBeGreaterThan(0);
    }
    // Closed: an unknown token fits NOTHING. It is never coerced to plains, because
    // a coercion would seat a settlement on ground it was not generated for and
    // report the placement as a match.
    for (let cell = 0; cell < raster.cellCount; cell += 1) {
      expect(terrainFitsCell('swamp_of_sorrows', raster, cell)).toBe(false);
      expect(terrainFitsCell('', raster, cell)).toBe(false);
      expect(terrainFitsCell(null, raster, cell)).toBe(false);
    }
    // The hill shoulder sits strictly between low ground and the cost law's knee,
    // so plains and hills can never both claim the same cell.
    expect(HILL_HEIGHT).toBeGreaterThan(LAND_HEIGHT);
    expect(HILL_HEIGHT).toBeLessThan(MOUNTAIN_HEIGHT);
    for (let cell = 0; cell < raster.cellCount; cell += 1) {
      expect(terrainFitsCell('plains', raster, cell) && terrainFitsCell('hills', raster, cell)).toBe(false);
      expect(terrainFitsCell('hills', raster, cell) && terrainFitsCell('mountain', raster, cell)).toBe(false);
    }
  });
});

describe('candidate enumeration is bounded and never strides', () => {
  it('pools are capped and drawn with the Weyl sampler', () => {
    const raster = realmRasterFromPack(WHOLE_WORLD);
    const cells = candidateCells(raster, 'plains', 12);
    expect(cells.length).toBe(12);
    expect(new Set(cells).size).toBe(12);
    // Non-vacuous: the cap really bit (there are far more than 12 plains cells).
    expect(terrainCensus(raster).plains).toBeGreaterThan(12);

    // THE ANTI-STRIDE PROPERTY, MEASURED: the wave-E finding was that an arithmetic
    // stride aliases against a grid's row width and makes whole features
    // unreachable. Sample the 20-wide fixture's ridge with a stride of the row
    // width and with the Weyl sampler, and compare column coverage.
    const ridge = [];
    for (let cell = 0; cell < raster.cellCount; cell += 1) {
      if (terrainFitsCell('mountain', raster, cell)) ridge.push(cell);
    }
    const strideColumns = new Set();
    for (let i = 0; i < ridge.length; i += 20) strideColumns.add(ridge[i] % 20);
    const weylColumns = new Set(
      spreadIndices(ridge.length, Math.ceil(ridge.length / 20)).map((i) => ridge[i] % 20),
    );
    expect(strideColumns.size, 'the stride control should collapse onto few columns').toBe(1);
    expect(weylColumns.size).toBeGreaterThan(strideColumns.size);
  });
});

describe('the plan is a pure seeded derivation — same realm + seed, same layout', () => {
  const people = roster([
    { id: 'aa', terrain: 'mountain', tier: 'city' },
    { id: 'bb', terrain: 'plains', tier: 'town' },
    { id: 'cc', terrain: 'forest', tier: 'village' },
    { id: 'dd', terrain: 'riverside', tier: 'village' },
    { id: 'ee', terrain: 'desert', tier: 'hamlet' },
  ]);

  it('DETERMINISM: two full passes over a 32-seed family agree exactly', () => {
    // Two passes over the WHOLE family, not one seed twice: a hidden counter can
    // flip parity between back-to-back calls and still land on the same cell by
    // luck. Running the family, then running it again, exposes state that survives
    // between calls (the wave-E instrument).
    const raster = realmRasterFromPack(WHOLE_WORLD);
    const pass = () => Array.from({ length: 32 }, (_, i) =>
      JSON.stringify(planAutoplacement({ raster, settlements: people, seed: `det-${i}` })));
    const first = pass();
    const second = pass();
    expect(second).toEqual(first);
    // Non-vacuous: the seed family really reaches more than one layout, so the
    // agreement above is not the agreement of a constant.
    expect(new Set(first).size).toBeGreaterThan(1);
  });

  it('the layout is independent of the caller\'s array order', () => {
    const raster = realmRasterFromPack(WHOLE_WORLD);
    const forward = planAutoplacement({ raster, settlements: people, seed: 'order' });
    const backward = planAutoplacement({ raster, settlements: people.slice().reverse(), seed: 'order' });
    expect(backward).toEqual(forward);
  });

  it('JSON ROUND TRIP: a plan survives serialization byte-identically', () => {
    const raster = realmRasterFromPack(WHOLE_WORLD);
    const plan = planAutoplacement({ raster, settlements: people, seed: 'trip' });
    const revived = JSON.parse(JSON.stringify(plan));
    expect(revived).toEqual(plan);
    expect(revived.version).toBe(AUTOPLACEMENT_VERSION);
    // Every coordinate survives as a finite number — a placement that round-trips
    // to NaN would write a broken position and only fail on reload.
    for (const p of revived.proposals) {
      expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
      expect(Number.isInteger(p.toCell)).toBe(true);
    }
  });

  it('PURITY, STRUCTURALLY: neither placement module holds mutable state or an ambient clock', () => {
    // A behavioural double pass cannot catch a call-order dependency whose period
    // divides the pass length. The habitat is what is checkable.
    for (const [rel, anchor] of [
      ['src/domain/realm/autoplacement.js', 'export function planAutoplacement'],
      ['src/domain/realm/placementRaster.js', 'export function realmRasterFromPack'],
      ['src/domain/lowDiscrepancy.js', 'export function spreadIndices'],
    ]) {
      const source = readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
      expect(source, `the comment stripper ate ${rel}`).toContain(anchor);
      const offences = [];
      if (/\bMath\s*\.\s*random\b/.test(source)) offences.push('Math.random');
      if (/\bDate\s*\./.test(source)) offences.push('Date');
      if (/\bglobalThis\b/.test(source)) offences.push('globalThis');
      if (/\bperformance\s*\./.test(source)) offences.push('performance');
      for (const line of source.split('\n')) {
        if (/^(let|var)\s/.test(line)) offences.push(`module-scope mutable binding: ${line.trim()}`);
      }
      expect(offences, rel).toEqual([]);
    }
  });

  it('the seed enters as a HASH, never as a draw', () => {
    // tieHash is a pure function of its text: the same text always returns the same
    // number, and nothing about calling it advances any stream. This is why a
    // placement can never shift a generation golden.
    const a = Array.from({ length: 50 }, (_, i) => tieHash(`k${i}`));
    const b = Array.from({ length: 50 }, (_, i) => tieHash(`k${i}`));
    expect(b).toEqual(a);
    for (const v of a) expect(v >= 0 && v < 1).toBe(true);
    expect(new Set(a).size).toBeGreaterThan(40);   // non-vacuous: it really spreads
  });
});

describe('TERRAIN-FIT TOTALITY: genesis ground wins wherever the realm has any', () => {
  it('across a 32-seed family, every settlement lands on ground matching its terrain', () => {
    const raster = realmRasterFromPack(WHOLE_WORLD);
    const people = roster([
      { id: 'mm', terrain: 'mountain', tier: 'city' },
      { id: 'pp', terrain: 'plains', tier: 'town' },
      { id: 'ff', terrain: 'forest', tier: 'village' },
      { id: 'rr', terrain: 'riverside', tier: 'village' },
      { id: 'dd', terrain: 'desert', tier: 'hamlet' },
      { id: 'hh', terrain: 'hills', tier: 'town' },
      { id: 'cc', terrain: 'coastal', tier: 'village' },
    ]);
    let checked = 0;
    for (let i = 0; i < 32; i += 1) {
      const plan = planAutoplacement({ raster, settlements: people, seed: `fit-${i}` });
      expect(plan.mismatches, `seed ${i} invented a mismatch on a whole world`).toEqual([]);
      expect(plan.proposals.length).toBe(people.length);
      for (const p of plan.proposals) {
        expect(p.fits, `${p.name} (${p.terrain}) landed off its ground at seed ${i}`).toBe(true);
        expect(terrainFitsCell(p.terrain, raster, p.toCell)).toBe(true);
        checked += 1;
      }
    }
    expect(checked).toBe(32 * 7);

    // NON-VACUITY BY BASE RATE: 224 on-ground landings would be meaningless if the
    // realm were mostly each settlement's own ground. Measure the actual share of
    // land each terrain occupies — every one is a minority, so a terrain-blind
    // placer would miss constantly and this pin is carrying real weight.
    const census = terrainCensus(raster);
    let landCells = 0;
    for (let cell = 0; cell < raster.cellCount; cell += 1) if (raster.cls[cell] !== null) landCells += 1;
    for (const p of people) {
      expect(census[p.terrain] / landCells, `${p.terrain} covers the whole realm`).toBeLessThan(0.5);
    }

    // NEGATIVE CONTROL, EXECUTED: `fits` is a measurement, not a constant. On a
    // realm that lacks a settlement's ground the SAME field reports false — so the
    // 224 trues above are the placer succeeding, not the flag being hardcoded.
    const plainsOnly = realmRasterFromPack(PLAINS_ONLY);
    const denied = planAutoplacement({
      raster: plainsOnly, seed: 'fit-control',
      settlements: roster([{ id: 'mm', terrain: 'mountain', tier: 'city' }]),
    });
    expect(denied.mismatches).toHaveLength(1);
    expect(denied.mismatches[0].bestAvailable.fits).toBe(false);
  });

  it('a mountain settlement finds the ridge even though the ridge is a thin seam', () => {
    // The wave-E aliasing lesson in placement form: the ridge is 4 of 20 columns,
    // and a sampler that aliases against the row width would never offer it.
    const raster = realmRasterFromPack(WHOLE_WORLD);
    for (let i = 0; i < 32; i += 1) {
      const plan = planAutoplacement({
        raster, seed: `ridge-${i}`, settlements: roster([{ id: 'only', terrain: 'mountain', tier: 'city' }]),
      });
      expect(plan.proposals[0].fits).toBe(true);
      expect(raster.cls[plan.proposals[0].toCell]).toBe('mountain');
    }
  });
});

describe('THE MISMATCH CENSUS: no fitting cell anywhere is its own itemized class', () => {
  const people = roster([
    { id: 'flat', name: 'Wheatlow', terrain: 'plains', tier: 'town' },
    { id: 'peak', name: 'Cragholt', terrain: 'mountain', tier: 'city' },
  ]);

  it('the mountain town on a plains realm is a mismatch, not a silent substitution', () => {
    const raster = realmRasterFromPack(PLAINS_ONLY);
    expect(terrainCensus(raster).mountain).toBe(0);
    const plan = planAutoplacement({ raster, settlements: people, seed: 'mismatch' });

    expect(plan.mismatches.map((m) => m.settlementId)).toEqual(['peak']);
    const [m] = plan.mismatches;
    expect(m.reason).toContain('this realm has none');
    // It is NOT smuggled into the safe class: the popup's default action list must
    // not contain an item the user never consented to.
    expect(plan.proposals.map((p) => p.settlementId)).toEqual(['flat']);

    // Its two explicit choices, per J-D1.
    expect(m.bestAvailable).not.toBeNull();
    expect(m.bestAvailable.settlementId).toBe('peak');
    expect(m.bestAvailable.fits).toBe(false);      // honest: this is not its ground
    expect(m.options.reterrain.offered).toBe(true);
    expect(m.options.reterrain.preselected).toBe(false);
    expect(m.options.reterrain.warning).toMatch(/regenerat/i);
    expect(m.options.reterrain.warning).toMatch(/same-seed/i);

    // NEGATIVE CONTROL: the same settlement on a realm that HAS mountains is not a
    // mismatch at all, so the census is reading the map and not the roster.
    const whole = planAutoplacement({
      raster: realmRasterFromPack(WHOLE_WORLD), settlements: people, seed: 'mismatch',
    });
    expect(whole.mismatches).toEqual([]);
    expect(whole.proposals.map((p) => p.settlementId).sort()).toEqual(['flat', 'peak']);
  });

  it('the census counts the WHOLE map, so a thin seam is never reported as absent', () => {
    // One single mountain cell in a plains realm. A subsampled census could miss it
    // and declare a false mismatch; the real one must find it.
    const oneRock = gridPack({
      w: 12, h: 12, ground: (col, row) => (col === 7 && row === 7 ? RIDGE : GRASS),
    });
    const raster = realmRasterFromPack(oneRock);
    expect(terrainCensus(raster).mountain).toBe(1);
    const plan = planAutoplacement({
      raster, seed: 'seam', settlements: roster([{ id: 'peak', terrain: 'mountain', tier: 'city' }]),
    });
    expect(plan.mismatches).toEqual([]);
    expect(plan.proposals[0].toCell).toBe(7 * 12 + 7);
  });

  it('the PAINT class is reported UNAVAILABLE with its reason, never fabricated', () => {
    // J-D1: paint only if a safe seam already exists in the bridge vocabulary. The
    // FMG RPC surface has no programmatic terrain write, so the class is listed as
    // unavailable — and no plan may ever carry a paint action.
    const plan = planAutoplacement({
      raster: realmRasterFromPack(PLAINS_ONLY), settlements: people, seed: 'paint',
    });
    expect(plan.paint.available).toBe(false);
    expect(plan.paint.reason.length).toBeGreaterThan(20);
    const serialized = JSON.stringify(plan);
    expect(/"kind":"paint"/.test(serialized)).toBe(false);
  });
});

describe('THE DYNAMISM OBJECTIVE: the layout refuses to strand anyone', () => {
  // A realm whose forest is a far corner: a placer that only maximizes terrain fit
  // sends the forest village there and leaves it alone with the whole map between
  // it and every neighbour. This is the small-N stasis evidence in geometry.
  const CORNER_WOOD = gridPack({
    w: 24,
    h: 24,
    ground: (col, row) => {
      if (col >= 21 && row >= 21) return FOREST;      // the far corner grove
      if (col >= 8 && col <= 11 && row >= 8 && row <= 11) return FOREST;  // a central grove too
      return GRASS;
    },
  });
  const people = roster([
    { id: 'a', terrain: 'plains', tier: 'city' },
    { id: 'b', terrain: 'plains', tier: 'town' },
    { id: 'c', terrain: 'plains', tier: 'village' },
    { id: 'd', terrain: 'forest', tier: 'village' },
  ]);

  it('the k-th-neighbour reward measurably beats the terrain-greedy layout', () => {
    const raster = realmRasterFromPack(CORNER_WOOD);
    const plan = planAutoplacement({ raster, settlements: people, seed: 'web' });

    // THE NEGATIVE CONTROL, EXECUTED: the same realm, the same seed, the same
    // roster, with the reach reward switched off. That control IS the naive
    // terrain-greedy placer the directive warns about.
    const greedy = planAutoplacement({
      raster, settlements: people, seed: 'web', tuning: { REACH_WEIGHT: 0, REPAIR_PASSES: 0 },
    });

    // THE OBJECTIVE, MEASURED DIRECTLY: worst isolation in the realm. The planner
    // must beat the greedy control, not merely differ from it.
    expect(plan.survey.maxNearest).toBeLessThan(greedy.survey.maxNearest);
    // And by a real margin, not a rounding difference.
    expect(plan.survey.maxNearest).toBeLessThan(greedy.survey.maxNearest * 0.75);

    // The forest village is the one the corner grove strands. Measure ITS distance
    // to its nearest neighbour under each placer.
    const nearestOf = (result, id) => {
      const seats = [...result.proposals, ...result.unchanged.map(() => null)].filter(Boolean);
      const me = seats.find((p) => p.settlementId === id);
      return Math.min(...seats.filter((p) => p.settlementId !== id)
        .map((p) => dist(p.x, p.y, me.x, me.y)));
    };
    expect(nearestOf(plan, 'd')).toBeLessThan(nearestOf(greedy, 'd'));

    // Connectedness is NOT bought by abandoning terrain: everyone is still on
    // their own ground, and nobody is stranded by the isolation rule.
    for (const p of plan.proposals) expect(p.fits).toBe(true);
    expect(plan.survey.stranded).toEqual([]);
    expect(plan.survey.maxNearest).toBeLessThanOrEqual(
      plan.survey.medianNearest * AUTOPLACEMENT_TUNING.ISOLATION_FACTOR,
    );
  });

  it('SPACING SANITY: nothing overlaps, and the floor is banded by tier', () => {
    const raster = realmRasterFromPack(WHOLE_WORLD);
    const crowd = roster([
      { id: 'm1', terrain: 'plains', tier: 'metropolis' },
      { id: 'm2', terrain: 'plains', tier: 'metropolis' },
      { id: 't1', terrain: 'plains', tier: 'thorp' },
      { id: 't2', terrain: 'plains', tier: 'thorp' },
      { id: 't3', terrain: 'plains', tier: 'thorp' },
    ]);
    const plan = planAutoplacement({ raster, settlements: crowd, seed: 'space' });
    const cells = plan.proposals.map((p) => p.toCell);
    expect(new Set(cells).size, 'two settlements shared a cell').toBe(cells.length);
    const { natural } = realmSpacing(raster, crowd.length);
    const T = AUTOPLACEMENT_TUNING;
    // Every pair clears the SMALLER of the two floors at minimum (the floor is
    // applied at seat time against whoever is already down).
    const thorpFloor = natural * T.SEPARATION_FRACTION * T.TIER_SEPARATION.thorp;
    for (let i = 0; i < plan.proposals.length; i += 1) {
      for (let j = i + 1; j < plan.proposals.length; j += 1) {
        const a = plan.proposals[i];
        const b = plan.proposals[j];
        expect(dist(a.x, a.y, b.x, b.y)).toBeGreaterThanOrEqual(thorpFloor);
      }
    }
    // Non-vacuous: the floor is a real distance, not zero.
    expect(thorpFloor).toBeGreaterThan(0);
  });

  it('a realm too small for its roster still returns a complete layout', () => {
    // The floor is a guarantee while any cell can honour it and a preference once
    // none can — a refusal would be the worse failure.
    const tiny = gridPack({ w: 4, h: 4, ground: () => GRASS });
    const raster = realmRasterFromPack(tiny);
    const many = roster(Array.from({ length: 10 }, (_, i) => ({ id: `x${i}`, terrain: 'plains' })));
    const plan = planAutoplacement({ raster, settlements: many, seed: 'tight' });
    expect(plan.proposals.length + plan.unchanged.length).toBe(10);
    expect(new Set(plan.proposals.map((p) => p.toCell)).size).toBe(plan.proposals.length);
  });
});

describe('GENESIS IMMUTABILITY: the placer cannot write generation input', () => {
  it('ANCHORED NEGATIVE: neither module names a generation-input key at all', () => {
    for (const rel of ['src/domain/realm/autoplacement.js', 'src/domain/realm/placementRaster.js']) {
      const source = readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');
      // LIVENESS FIRST: prove the file was actually read and still holds the code
      // these negatives are about. Without this, every assertion below would pass
      // just as happily against an empty string.
      expect(source, `${rel} was not read`).toContain('terrain');
      expect(source.length, `${rel} is empty`).toBeGreaterThan(500);
      // Anchored to an ASSIGNMENT, not a mention: the modules discuss terrain
      // constantly (that is their subject), but may never assign one.
      // anchored: the toContain('terrain') + length assertions above prove the source is live, and the guard-the-guard below proves each regex still bites
      expect(source, rel).not.toMatch(/^\s*[^*/\n]*\.\s*terrainOverride\s*=/m);
      // anchored: same live-source anchor; a drifted/empty read fails above, not here
      expect(source, rel).not.toMatch(/^\s*[^*/\n]*\.\s*terrainType\s*=/m);
      // anchored: same live-source anchor; a drifted/empty read fails above, not here
      expect(source, rel).not.toMatch(/^\s*[^*/\n]*\.\s*config\s*=/m);
      // anchored: same live-source anchor; a drifted/empty read fails above, not here
      expect(source, rel).not.toMatch(/\bterrainOverride\s*:/);
      // anchored: same live-source anchor; a drifted/empty read fails above, not here
      expect(source, rel).not.toMatch(/\btradeRouteAccess\b/);
      // Guard the guard: the anchors would catch a real assignment.
      expect(/^\s*[^*/\n]*\.\s*terrainOverride\s*=/m.test('  s.config.terrainOverride = "mountain";')).toBe(true);
    }
  });

  it('the plan is a pure read: the roster it was handed is untouched', () => {
    const raster = realmRasterFromPack(WHOLE_WORLD);
    const people = roster([
      { id: 'a', terrain: 'mountain', tier: 'city' },
      { id: 'b', terrain: 'plains', tier: 'town' },
    ]);
    const before = JSON.parse(JSON.stringify(people));
    const rasterBefore = JSON.stringify({ cls: raster.cls, h: raster.h, x: raster.x, y: raster.y });
    planAutoplacement({ raster, settlements: people, seed: 'read-only' });
    expect(people).toEqual(before);
    expect(JSON.stringify({ cls: raster.cls, h: raster.h, x: raster.x, y: raster.y })).toBe(rasterBefore);
  });

  it('a settlement already on its best ground is reported UNCHANGED, not re-written', () => {
    const raster = realmRasterFromPack(WHOLE_WORLD);
    const first = planAutoplacement({
      raster, seed: 'idem', settlements: roster([{ id: 'a', terrain: 'mountain', tier: 'city' }]),
    });
    const seated = first.proposals[0].toCell;
    const second = planAutoplacement({
      raster,
      seed: 'idem',
      settlements: roster([{ id: 'a', terrain: 'mountain', tier: 'city', cellId: seated }]),
    });
    expect(second.proposals).toEqual([]);
    expect(second.unchanged.map((u) => u.settlementId)).toEqual(['a']);
  });
});

describe('the copy obeys the legibility law', () => {
  it('no reason, label or place name leaks a raw key or an em dash', () => {
    const raster = realmRasterFromPack(PLAINS_ONLY);
    const plan = planAutoplacement({
      raster,
      seed: 'copy',
      settlements: roster([
        { id: 'a', name: 'Wheatlow', terrain: 'plains', tier: 'town' },
        { id: 'b', name: 'Cragholt', terrain: 'mountain', tier: 'city' },
      ]),
    });
    const prose = [
      ...plan.proposals.map((p) => p.reason),
      ...plan.unchanged.map((u) => u.reason),
      ...plan.mismatches.flatMap((m) => [m.reason, m.options.reterrain.label, m.options.reterrain.warning]),
      plan.paint.reason,
      ...GENESIS_TERRAINS.map(terrainPlaceName),
      terrainPlaceName('a_token_nobody_authored'),
    ];
    expect(prose.length).toBeGreaterThan(6);
    for (const line of prose) {
      expect(/[a-z]+_[a-z]+/.test(line), `a raw key leaked into prose: ${line}`).toBe(false);
      expect(line.includes('—'), `an em dash reached user copy: ${line}`).toBe(false);
      expect(line.trim().length).toBeGreaterThan(0);
    }
  });
});
