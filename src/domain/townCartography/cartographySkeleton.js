/**
 * townCartography/cartographySkeleton.js — THE SKELETON STAGE (design §4.2).
 *
 * "Arterials via field-following growth from gates/waterfront/route ends; lanes
 * via space-colonization infill scaled by tier density bands."
 *
 * ── TERMINATION IS STRUCTURAL, NOT A TIMEOUT (design §7) ─────────────────────
 * An arterial is grown along a KNOWN number of steps: the seed-to-core distance
 * divided by the step length, clamped to the cap. The field and the settlement's
 * entropy displace the path LATERALLY; they never steer it, so no arterial can
 * wander, stall in a cost basin, or fail to arrive. The cap is therefore a real
 * backstop rather than the thing that ends the loop, which is the difference
 * between an iteration contract and an iteration safety net.
 *
 * The lane stage is genuine space colonization and IS the genre's rabbit hole, so
 * it carries three simultaneous bounds: iterations, node count, and attractor
 * exhaustion. Every one of them is a number in TOWN_CARTOGRAPHY_TUNING and the
 * product of them is a term in `maximumSynthesisWork`.
 *
 * ── A-10 IS THE ONLY DIAL ────────────────────────────────────────────────────
 * Nothing in this file reads a style parameter. The lateral displacement, the
 * wander amplitude and the grid-core snap are all functions of the morphology
 * READING, which is a function of the settlement's governance, economy and
 * stress. A lawful, legitimate, concentrated town draws straight; a corrupt,
 * fragmented one draws crooked; nobody chose that, the settlement did.
 *
 * Transcendental-free: + - * / and Math.sqrt only.
 *
 * @enforced-by tests/domain/townCartographySkeleton.test.js
 */

import { spreadIndices } from '../lowDiscrepancy.js';
import { TOWN_SCENE_PLAN_EXTENT } from '../townScene/manifestContract.js';
import { clampSceneNumber } from '../townScene/sceneCompilePrimitives.js';
import {
  CARTOGRAPHY_TIERS,
  TOWN_CARTOGRAPHY_TUNING,
  cartographyBand,
} from './cartographyTuning.js';

const T = TOWN_CARTOGRAPHY_TUNING;

/**
 * @typedef {[number, number]} PlanPoint
 * @typedef {{ unit: () => number, draws: number }} CountedStream
 * @typedef {{ id: string, kind: 'arterial'|'lane', widthPlan: number,
 *             centerline: PlanPoint[] }} CartographyStreet
 */

/** @param {number} value @returns {number} */
function planCoordinate(value) {
  return clampSceneNumber(Math.round(value), 0, TOWN_SCENE_PLAN_EXTENT);
}

/**
 * A zero-padded ordinal. Street ids must sort by CODEPOINT into their emission
 * order because the manifest's canonical-ordering law is a codepoint sort, and an
 * unpadded `lane:10` sorts between `lane:1` and `lane:2`. Padding is the fix that
 * keeps the id human-readable; renumbering on sort would break append stability.
 * @param {number} index @returns {string}
 */
function ordinal(index) {
  const text = String(index);
  return '0000'.slice(0, Math.max(0, 4 - text.length)) + text;
}

/** @param {number} dx @param {number} dz @returns {number} */
function magnitude(dx, dz) {
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * The DOWNHILL-COST direction at a plan point, as a unit vector, or [0, 0] on flat
 * ground. This is the "field" an arterial follows: cost folds slope, water penalty
 * and the discount along an existing approach route, so a street bending along
 * this vector is bending toward buildable, already-served ground.
 *
 * @param {import('./cartographyField.js').CartographyField} field
 * @param {number} x @param {number} z
 * @returns {PlanPoint}
 */
function downhillAt(field, x, z) {
  const size = field.gridSize;
  const gx = clampSceneNumber(Math.round((x / TOWN_SCENE_PLAN_EXTENT) * (size - 1)), 0, size - 1);
  const gz = clampSceneNumber(Math.round((z / TOWN_SCENE_PLAN_EXTENT) * (size - 1)), 0, size - 1);
  const east = Math.min(size - 1, gx + 1);
  const west = Math.max(0, gx - 1);
  const south = Math.min(size - 1, gz + 1);
  const north = Math.max(0, gz - 1);
  const dx = field.cost[gz * size + west] - field.cost[gz * size + east];
  const dz = field.cost[north * size + gx] - field.cost[south * size + gx];
  const length = magnitude(dx, dz);
  return length > 0 ? [dx / length, dz / length] : [0, 0];
}

/**
 * GROW THE ARTERIALS.
 *
 * @param {import('./cartographyField.js').CartographyField} field
 * @param {import('./cartographyMorphology.js').MorphologyReading} morphology
 * @param {CountedStream} stream
 * @returns {{ streets: CartographyStreet[], work: number }}
 */
export function growArterials(field, morphology, stream) {
  const chaos = 1 - morphology.order01;
  /** @type {CartographyStreet[]} */
  const streets = [];
  let work = 0;
  for (let seedIndex = 0; seedIndex < field.seeds.length; seedIndex += 1) {
    const seed = field.seeds[seedIndex];
    const start = seed.point;
    const end = field.core;
    const axisX = end[0] - start[0];
    const axisZ = end[1] - start[1];
    const span = magnitude(axisX, axisZ);
    if (span < T.ARTERIAL_ARRIVAL_PLAN) continue;
    const unitX = axisX / span;
    const unitZ = axisZ / span;
    // The left normal of the seed-to-core axis. All displacement is expressed in
    // this one frame so an arterial cannot double back on itself.
    const normalX = -unitZ;
    const normalZ = unitX;
    const steps = Math.min(
      T.ARTERIAL_STEPS,
      Math.max(2, Math.ceil(span / T.ARTERIAL_STEP_PLAN)),
    );
    /** @type {PlanPoint[]} */
    const centerline = [[planCoordinate(start[0]), planCoordinate(start[1])]];
    let lateral = 0;
    for (let step = 1; step < steps; step += 1) {
      const t = step / steps;
      const baseX = start[0] + axisX * t;
      const baseZ = start[1] + axisZ * t;
      const downhill = downhillAt(field, baseX, baseZ);
      const fieldLateral = downhill[0] * normalX + downhill[1] * normalZ;
      // One draw per step. The wander is scaled by CHAOS: an orderly settlement
      // spends its entropy on nothing, which is what "orderly" means here.
      const wander = (stream.unit() - 0.5) * T.ARTERIAL_WANDER_PLAN * chaos;
      lateral += fieldLateral * T.ARTERIAL_GRAIN_WEIGHT * T.ARTERIAL_STEP_PLAN * chaos + wander;
      // The taper pins both ends: an arterial meets its seed and the core exactly,
      // and bows in the middle. 4*t*(1-t) peaks at 1 exactly at the midpoint.
      const taper = 4 * t * (1 - t);
      centerline.push([
        planCoordinate(baseX + normalX * lateral * taper),
        planCoordinate(baseZ + normalZ * lateral * taper),
      ]);
      work += 1;
    }
    centerline.push([planCoordinate(end[0]), planCoordinate(end[1])]);
    streets.push({
      id: `carto:arterial:${seedIndex}`,
      kind: 'arterial',
      widthPlan: cartographyBand(
        T.ARTERIAL_WIDTH_PLAN,
        CARTOGRAPHY_TIERS[morphology.tierIndex],
      ),
      centerline,
    });
  }
  return { streets, work };
}

/**
 * The settlement's GRAIN AXES: the direction of the longest arterial, and its
 * normal. A grid core is square to the town's own principal approach, not to the
 * plan's coordinate axes, so two settlements with the same governance and
 * different approaches still read as different places.
 *
 * @param {CartographyStreet[]} arterials
 * @returns {{ axis: PlanPoint, normal: PlanPoint }}
 */
function grainAxes(arterials) {
  let bestLength = 0;
  let axisX = 1;
  let axisZ = 0;
  for (const street of arterials) {
    const first = street.centerline[0];
    const last = street.centerline[street.centerline.length - 1];
    const dx = last[0] - first[0];
    const dz = last[1] - first[1];
    const length = magnitude(dx, dz);
    if (length > bestLength) {
      bestLength = length;
      axisX = dx / length;
      axisZ = dz / length;
    }
  }
  return { axis: [axisX, axisZ], normal: [-axisZ, axisX] };
}

/** Snap a direction to the nearer of the four grain half-axes.
 *  @param {number} dx @param {number} dz
 *  @param {{ axis: PlanPoint, normal: PlanPoint }} grain @returns {PlanPoint} */
function snapToGrain(dx, dz, grain) {
  const alongAxis = dx * grain.axis[0] + dz * grain.axis[1];
  const alongNormal = dx * grain.normal[0] + dz * grain.normal[1];
  if (Math.abs(alongAxis) >= Math.abs(alongNormal)) {
    return alongAxis >= 0 ? grain.axis : [-grain.axis[0], -grain.axis[1]];
  }
  return alongNormal >= 0 ? grain.normal : [-grain.normal[0], -grain.normal[1]];
}

/**
 * GROW THE LANES by space colonization over the field's attractors.
 *
 * Three simultaneous bounds, all authored: LANE_ITERATIONS, the tier's LANE_NODES
 * band, and attractor exhaustion. The loop cannot outlive the smallest of them.
 *
 * @param {import('./cartographyField.js').CartographyField} field
 * @param {CartographyStreet[]} arterials
 * @param {import('./cartographyMorphology.js').MorphologyReading} morphology
 * @param {unknown} tier
 * @param {CountedStream} stream
 * @returns {{ streets: CartographyStreet[], work: number, iterations: number }}
 */
export function growLanes(field, arterials, morphology, tier, stream) {
  const chaos = 1 - morphology.order01;
  const nodeBudget = cartographyBand(T.LANE_NODES, tier);
  const grain = grainAxes(arterials);
  const killSq = T.LANE_KILL_PLAN * T.LANE_KILL_PLAN;
  const influenceSq = T.LANE_INFLUENCE_PLAN * T.LANE_INFLUENCE_PLAN;
  const gridRadiusSq = T.GRID_CORE_RADIUS_PLAN * T.GRID_CORE_RADIUS_PLAN;

  /** Every lane node's position, parallel to `parents`. @type {PlanPoint[]} */
  const nodes = [];
  /** @type {number[]} */
  const parents = [];
  /** @type {PlanPoint[]} */
  const arterialVertices = [];
  for (const street of arterials) {
    for (const point of street.centerline) arterialVertices.push(point);
  }
  // WEYL, not a stride. The vertices are in path order, so an arithmetic stride
  // resonant with the per-arterial vertex count would seed every arterial at the
  // same relative position and leave the same reaches of the town unbuilt on every
  // seed in the product. `spreadIndices` has no such resonance at any length.
  const seedBudget = Math.max(2, Math.floor(nodeBudget / T.LANE_SEED_SHARE_DENOMINATOR));
  for (const index of spreadIndices(arterialVertices.length, seedBudget)) {
    nodes.push(arterialVertices[index]);
    parents.push(-1);
  }
  if (nodes.length === 0) {
    nodes.push(field.core);
    parents.push(-1);
  }

  /** @type {boolean[]} */
  const retired = field.attractors.map(() => false);
  let work = 0;
  let iterations = 0;
  for (let iteration = 0; iteration < T.LANE_ITERATIONS; iteration += 1) {
    if (nodes.length >= nodeBudget) break;
    iterations += 1;
    /** Accumulated pull per node: [sumX, sumZ, count]. @type {number[][]} */
    const pull = nodes.map(() => [0, 0, 0]);
    let live = 0;
    for (let a = 0; a < field.attractors.length; a += 1) {
      if (retired[a]) continue;
      const attractor = field.attractors[a];
      let bestNode = -1;
      let bestDistance = influenceSq;
      for (let n = 0; n < nodes.length; n += 1) {
        const dx = attractor[0] - nodes[n][0];
        const dz = attractor[1] - nodes[n][1];
        const distance = dx * dx + dz * dz;
        work += 1;
        if (distance <= killSq) {
          bestNode = -1;
          retired[a] = true;
          break;
        }
        if (distance < bestDistance) {
          bestDistance = distance;
          bestNode = n;
        }
      }
      if (bestNode < 0) continue;
      live += 1;
      const dx = attractor[0] - nodes[bestNode][0];
      const dz = attractor[1] - nodes[bestNode][1];
      const length = magnitude(dx, dz) || 1;
      pull[bestNode][0] += dx / length;
      pull[bestNode][1] += dz / length;
      pull[bestNode][2] += 1;
    }
    if (live === 0) break;

    const parentCount = nodes.length;
    for (let n = 0; n < parentCount; n += 1) {
      if (nodes.length >= nodeBudget) break;
      if (pull[n][2] === 0) continue;
      let dirX = pull[n][0];
      let dirZ = pull[n][1];
      const length = magnitude(dirX, dirZ);
      if (length === 0) continue;
      dirX /= length;
      dirZ /= length;
      const coreDx = nodes[n][0] - field.core[0];
      const coreDz = nodes[n][1] - field.core[1];
      const insideCore = coreDx * coreDx + coreDz * coreDz <= gridRadiusSq;
      if (morphology.gridCore && insideCore) {
        // A-10 layer 4: the planned era's grid, square to the town's own grain.
        const snapped = snapToGrain(dirX, dirZ, grain);
        dirX = snapped[0];
        dirZ = snapped[1];
      } else {
        // Two draws per grown child. The wander is chaos-scaled, so a lawful town
        // grows a tidy web from the same attractor field a lawless one tangles.
        dirX += (stream.unit() - 0.5) * chaos;
        dirZ += (stream.unit() - 0.5) * chaos;
        const wandered = magnitude(dirX, dirZ) || 1;
        dirX /= wandered;
        dirZ /= wandered;
      }
      const step = T.LANE_STEP_PLAN + (morphology.gridCore && insideCore ? 0 : T.LANE_WANDER_PLAN * chaos);
      nodes.push([
        planCoordinate(nodes[n][0] + dirX * step),
        planCoordinate(nodes[n][1] + dirZ * step),
      ]);
      parents.push(n);
    }
  }

  /** @type {CartographyStreet[]} */
  const streets = [];
  for (let n = 0; n < nodes.length; n += 1) {
    const parent = parents[n];
    if (parent < 0) continue;
    const from = nodes[parent];
    const to = nodes[n];
    if (from[0] === to[0] && from[1] === to[1]) continue;
    streets.push({
      id: `carto:lane:${streets.length}`,
      kind: 'lane',
      widthPlan: cartographyBand(T.LANE_WIDTH_PLAN, tier),
      centerline: [from, to],
    });
  }
  return { streets, work, iterations };
}
