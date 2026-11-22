/**
 * townCartography/cartographyField.js — THE FIELD STAGE (design §4.1).
 *
 * "Read spatial rasters (terrain, water, slope from the realm position) into a
 * local tensor field; roads/routes enter as boundary conditions."
 *
 * The raster this reads is the manifest's OWN terrain layer — the 33x33 integer
 * height grid and the water bodies that `townScene/sceneTerrainNetwork.js`
 * already compiled from settlement truth. That is not a convenience: deriving a
 * second terrain here would be the parallel generator §1 forbids, and the first
 * time the terrain profile table changed, the map's hill and the portrait's hill
 * would part company.
 *
 * ── EVERY CELL SUBSAMPLE GOES THROUGH THE WEYL SAMPLER ───────────────────────
 * This module subsamples cell and segment arrays in four places (core candidates,
 * lane attractors, water segments, road segments) and every one of them calls
 * `spreadIndices` from domain/lowDiscrepancy.js. An arithmetic stride is BANNED
 * here and the ban is measured, not stylistic: a stride of 6 on a 12-wide pack
 * selected two columns and made an entire mountain ridge structurally unreachable
 * (recorded in lowDiscrepancy.js's header). This grid is 33 wide, so a stride of
 * 33 would select column 0 and NOTHING ELSE — the town's whole eastern flank
 * would be invisible to the field, forever, on every seed. The golden-ratio
 * additive recurrence has no resonance at any width.
 *
 * ── TRANSCENDENTAL-FREE BY CONSTRUCTION ──────────────────────────────────────
 * No Math.pow / ** / sin / cos / exp anywhere: those are implementation-
 * approximated per the ECMAScript spec and would let the same seed fork a town
 * across JS engines. Only + - * / and Math.sqrt (correctly rounded by spec).
 *
 * Pure. The only entropy is the caller's counted stream, one draw per emitted
 * jitter component, so the stage's draw count is an exact function of its inputs.
 *
 * @enforced-by tests/domain/townCartographyField.test.js
 */

import { spreadIndices } from '../lowDiscrepancy.js';
import { TOWN_SCENE_PLAN_EXTENT } from '../townScene/manifestContract.js';
import {
  clampSceneNumber,
  finiteSceneNumber,
  scenePointSegmentDistanceSq,
  sceneRecord,
} from '../townScene/sceneCompilePrimitives.js';
import {
  TOWN_CARTOGRAPHY_TUNING,
  cartographyBand,
} from './cartographyTuning.js';

const T = TOWN_CARTOGRAPHY_TUNING;

/**
 * @typedef {{ unit: () => number, draws: number }} CountedStream
 * @typedef {[number, number]} PlanPoint
 * @typedef {object} CartographyField
 * @property {number} gridSize
 * @property {number[]} cost per-cell integer traversal cost
 * @property {boolean[]} water per-cell open-water adjacency
 * @property {PlanPoint} core the town core node in plan space
 * @property {PlanPoint[]} attractors lane-infill attractors, Weyl-spread
 * @property {Array<{ point: PlanPoint, inward: PlanPoint }>} seeds arterial seeds
 * @property {PlanPoint[][]} waterPaths the open-water polylines, segment-capped
 * @property {PlanPoint[][]} roadPaths the approach-route polylines, segment-capped
 * @property {number} work measured steps, against maximumSynthesisWork
 */

/** Plan coordinate of a grid column/row. @param {number} index @param {number} gridSize */
function planAt(index, gridSize) {
  return Math.round((index * TOWN_SCENE_PLAN_EXTENT) / Math.max(1, gridSize - 1));
}

/** @param {unknown} raw @returns {PlanPoint} */
function planPoint(raw) {
  const pair = Array.isArray(raw) ? raw : [];
  return [
    clampSceneNumber(Math.round(finiteSceneNumber(pair[0])), 0, TOWN_SCENE_PLAN_EXTENT),
    clampSceneNumber(Math.round(finiteSceneNumber(pair[1])), 0, TOWN_SCENE_PLAN_EXTENT),
  ];
}

/**
 * Cap a polyline's segment count through the Weyl sampler, keeping the endpoints.
 * A stride here would drop whole reaches of a meandering river in a pattern that
 * repeats with the river's own sampling, which is the aliasing class exactly.
 * @param {PlanPoint[]} path @param {number} maxSegments @returns {PlanPoint[]}
 */
function capPath(path, maxSegments) {
  if (path.length <= maxSegments + 1) return path;
  const interiorCount = Math.max(0, maxSegments - 1);
  const interior = spreadIndices(path.length - 2, interiorCount);
  /** @type {PlanPoint[]} */
  const out = [path[0]];
  for (const index of interior) out.push(path[index + 1]);
  out.push(path[path.length - 1]);
  return out;
}

/** Squared distance from a plan point to the nearest segment of any polyline.
 *  @param {number} x @param {number} z @param {PlanPoint[][]} paths @returns {number} */
function nearestPathDistanceSq(x, z, paths) {
  let best = Number.POSITIVE_INFINITY;
  for (const path of paths) {
    for (let i = 0; i < path.length - 1; i += 1) {
      const distance = scenePointSegmentDistanceSq(x, z, path[i], path[i + 1]);
      if (distance < best) best = distance;
    }
  }
  return best;
}

/** Total segment count across polylines (the honest work denominator).
 *  @param {PlanPoint[][]} paths @returns {number} */
function segmentCount(paths) {
  let total = 0;
  for (const path of paths) total += Math.max(0, path.length - 1);
  return total;
}

/**
 * The open-water polylines, segment-capped.
 * @param {unknown} terrain @returns {PlanPoint[][]}
 */
function waterPathsOf(terrain) {
  const value = sceneRecord(terrain);
  const bodies = Array.isArray(value.waterBodies) ? value.waterBodies : [];
  /** @type {PlanPoint[][]} */
  const paths = [];
  for (const raw of bodies) {
    const body = sceneRecord(raw);
    const path = Array.isArray(body.path) ? body.path.map(planPoint) : [];
    if (path.length >= 2) paths.push(capPath(path, T.FIELD_WATER_SEGMENTS));
  }
  return paths;
}

/**
 * The approach-route polylines. These are the boundary conditions of §4.1: a road
 * that already reaches this settlement is a fact the field must honour, never a
 * suggestion the synthesis may overrule.
 * @param {unknown} roads @returns {PlanPoint[][]}
 */
function roadPathsOf(roads) {
  const rows = Array.isArray(roads) ? roads : [];
  /** @type {PlanPoint[][]} */
  const paths = [];
  for (const raw of rows) {
    const road = sceneRecord(raw);
    if (road.kind !== 'arterial') continue;
    const centerline = Array.isArray(road.centerline) ? road.centerline.map(planPoint) : [];
    if (centerline.length >= 2) paths.push(capPath(centerline, T.FIELD_ROAD_SEGMENTS));
  }
  return paths;
}

/** Local relief: the largest height step to a 4-neighbour, in height units.
 *  @param {number[]} heights @param {number} gridSize @param {number} gx @param {number} gz */
function reliefAt(heights, gridSize, gx, gz) {
  const here = heights[gz * gridSize + gx];
  let relief = 0;
  if (gx > 0) relief = Math.max(relief, Math.abs(here - heights[gz * gridSize + gx - 1]));
  if (gx < gridSize - 1) relief = Math.max(relief, Math.abs(here - heights[gz * gridSize + gx + 1]));
  if (gz > 0) relief = Math.max(relief, Math.abs(here - heights[(gz - 1) * gridSize + gx]));
  if (gz < gridSize - 1) relief = Math.max(relief, Math.abs(here - heights[(gz + 1) * gridSize + gx]));
  return relief;
}

/**
 * BUILD THE FIELD.
 *
 * @param {object} input
 * @param {unknown} input.terrain the compiled scene terrain layer
 * @param {unknown} input.roads the compiled scene roads
 * @param {import('./cartographyMorphology.js').MorphologyReading} input.morphology
 * @param {unknown} input.tier
 * @param {CountedStream} input.stream the field stage's counted substream
 * @returns {CartographyField}
 */
export function buildCartographyField(input) {
  const terrain = sceneRecord(input.terrain);
  const gridSizeRaw = Math.floor(finiteSceneNumber(terrain.gridSize, 0));
  const gridSize = gridSizeRaw >= 2 ? gridSizeRaw : 2;
  const cellCount = gridSize * gridSize;
  const rawHeights = Array.isArray(terrain.heights) ? terrain.heights : [];
  /** @type {number[]} */
  const heights = [];
  for (let i = 0; i < cellCount; i += 1) heights.push(Math.round(finiteSceneNumber(rawHeights[i])));

  const waterPaths = waterPathsOf(terrain);
  const roadPaths = roadPathsOf(input.roads);
  const waterMarginSq = T.FIELD_WATER_MARGIN_PLAN * T.FIELD_WATER_MARGIN_PLAN;
  const roadMarginSq = T.FIELD_ROAD_MARGIN_PLAN * T.FIELD_ROAD_MARGIN_PLAN;
  const perCellSegments = 4 + segmentCount(waterPaths) + segmentCount(roadPaths);

  /** @type {number[]} */
  const cost = [];
  /** @type {boolean[]} */
  const water = [];
  let work = 0;
  for (let gz = 0; gz < gridSize; gz += 1) {
    for (let gx = 0; gx < gridSize; gx += 1) {
      const x = planAt(gx, gridSize);
      const z = planAt(gz, gridSize);
      let cellCost = T.FIELD_BASE_COST + T.FIELD_SLOPE_COST * reliefAt(heights, gridSize, gx, gz);
      const wet = nearestPathDistanceSq(x, z, waterPaths) <= waterMarginSq;
      if (wet) cellCost += T.FIELD_WATER_COST;
      if (nearestPathDistanceSq(x, z, roadPaths) <= roadMarginSq) {
        cellCost = Math.max(1, cellCost - T.FIELD_ROAD_DISCOUNT);
      }
      cost.push(cellCost);
      water.push(wet);
      work += perCellSegments;
    }
  }

  // ── THE CORE: the cheapest dry ground nearest the plan centre. ──────────────
  // Candidates are a WEYL SUBSET of the whole grid, never a stride: a stride of
  // gridSize would confine every candidate to column zero and pin every town in
  // the product against its western edge.
  const centre = TOWN_SCENE_PLAN_EXTENT / 2;
  const coreCandidates = spreadIndices(cellCount, T.FIELD_CORE_CANDIDATES);
  let coreScore = Number.POSITIVE_INFINITY;
  /** @type {PlanPoint} */
  let core = [Math.round(centre), Math.round(centre)];
  for (const cell of coreCandidates) {
    const gx = cell % gridSize;
    const gz = (cell - gx) / gridSize;
    const x = planAt(gx, gridSize);
    const z = planAt(gz, gridSize);
    const dx = x - centre;
    const dz = z - centre;
    // Centrality is a squared-distance penalty scaled into cost units; keeping it
    // rational avoids a transcendental and keeps the comparison exact.
    const score = cost[cell] + (dx * dx + dz * dz) / 400;
    if (score < coreScore) {
      coreScore = score;
      core = [x, z];
    }
    work += 1;
  }

  // ── ATTRACTORS: the lane stage's demand field, Weyl-spread over dry cells. ──
  const attractorBudget = cartographyBand(T.FIELD_ATTRACTOR_CANDIDATES, input.tier);
  /** @type {number[]} */
  const dryCells = [];
  for (let cell = 0; cell < cellCount; cell += 1) if (!water[cell]) dryCells.push(cell);
  const chosen = spreadIndices(dryCells.length, attractorBudget);
  const jitterSpan = T.LANE_KILL_PLAN;
  /** @type {PlanPoint[]} */
  const attractors = [];
  for (const position of chosen) {
    const cell = dryCells[position];
    const gx = cell % gridSize;
    const gz = (cell - gx) / gridSize;
    // Two draws per attractor: the lattice the Weyl subset lands on is regular by
    // construction, and a regular attractor lattice draws a regular town no matter
    // what its governance says. The jitter is the settlement's own entropy.
    const jx = (input.stream.unit() - 0.5) * jitterSpan;
    const jz = (input.stream.unit() - 0.5) * jitterSpan;
    attractors.push([
      clampSceneNumber(Math.round(planAt(gx, gridSize) + jx), 0, TOWN_SCENE_PLAN_EXTENT),
      clampSceneNumber(Math.round(planAt(gz, gridSize) + jz), 0, TOWN_SCENE_PLAN_EXTENT),
    ]);
    work += 1;
  }

  return {
    gridSize,
    cost,
    water,
    core,
    attractors,
    seeds: arterialSeeds(core, waterPaths, roadPaths, input.tier),
    waterPaths,
    roadPaths,
    work,
  };
}

/**
 * ARTERIAL SEEDS: where a street enters the settlement.
 *
 * In priority order, and deliberately so — a real approach road outranks an
 * invented one, and an invented one exists only because a town with no recorded
 * route still has to be reachable on foot:
 *   1. the outer endpoint of every approach route (the §4.1 boundary condition);
 *   2. the waterfront landing, when the settlement has open water;
 *   3. cardinal edge midpoints, in a fixed order, to make up the tier's count.
 * Over-supply is capped through the Weyl sampler, so a settlement with nine
 * routes keeps a SPREAD of them rather than the first four in id order.
 *
 * @param {PlanPoint} core
 * @param {PlanPoint[][]} waterPaths
 * @param {PlanPoint[][]} roadPaths
 * @param {unknown} tier
 * @returns {Array<{ point: PlanPoint, inward: PlanPoint }>}
 */
function arterialSeeds(core, waterPaths, roadPaths, tier) {
  /** @type {PlanPoint[]} */
  const candidates = [];
  for (const path of roadPaths) {
    const first = path[0];
    const last = path[path.length - 1];
    const firstOut = (first[0] - core[0]) * (first[0] - core[0]) + (first[1] - core[1]) * (first[1] - core[1]);
    const lastOut = (last[0] - core[0]) * (last[0] - core[0]) + (last[1] - core[1]) * (last[1] - core[1]);
    candidates.push(firstOut >= lastOut ? first : last);
  }
  for (const path of waterPaths) {
    let best = path[0];
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const point of path) {
      const dx = point[0] - core[0];
      const dz = point[1] - core[1];
      const distance = dx * dx + dz * dz;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = point;
      }
    }
    candidates.push(best);
  }
  const extent = TOWN_SCENE_PLAN_EXTENT;
  const half = Math.round(extent / 2);
  /** @type {PlanPoint[]} */
  const cardinals = [[half, 0], [extent, half], [half, extent], [0, half]];
  const budget = cartographyBand(T.ARTERIAL_SEEDS, tier);
  for (let i = 0; candidates.length < budget && i < cardinals.length; i += 1) {
    candidates.push(cardinals[i]);
  }
  const kept = spreadIndices(candidates.length, Math.min(budget, candidates.length));
  return kept.map((index) => ({ point: candidates[index], inward: core }));
}
