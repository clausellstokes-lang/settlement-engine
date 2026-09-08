/**
 * townCartography/cartographyDefenses.js — DEFENSE BINDING WITNESSES (design §4.2).
 *
 * These rows are synthesis-local geometry, never a second set of manifest facts.
 * The compiler uses gate and bridge crossings only to select nearby canonical ids
 * from the base TownSceneManifest, then discards every witness row.
 *
 * ── COHERENCE IS STRUCTURAL, NOT CHECKED AFTERWARDS ──────────────────────────
 * A gate is not "placed near a wall" and then validated: a gate EXISTS only where
 * an arterial's segment intersects a wall segment, and it is born carrying the
 * index of the wall segment it sits on. A bridge exists only where a street's
 * segment intersects a water segment, and is born carrying the index of the water
 * segment. Both are produced by `sceneSegmentIntersection`, the compiler's own
 * exact predicate. There is consequently no code path that can emit a gate in
 * open ground or a bridge on dry land, which is a stronger guarantee than any
 * assertion could give, and the assertions in the pins measure the quantization
 * error only.
 *
 * ── THE WALL ENCLOSES WHAT IS BUILT ──────────────────────────────────────────
 * The ring is the convex hull of the LANE fabric plus the core, pushed outward by
 * an authored margin. Deliberately not the arterials: an arterial begins at the
 * plan boundary because it comes from somewhere else, and a hull over those would
 * put the wall at the map's edge and leave nothing to cross it. Lanes are the part
 * of the skeleton that IS the settlement, so they are the part the wall defends.
 *
 * The hull is Andrew's monotone chain over integer coordinates: the orientation
 * test is a cross product of integers, so it is exact, and no transcendental
 * appears anywhere in this file except Math.sqrt (correctly rounded by spec).
 *
 * ── THE VERTEX CAP GOES THROUGH THE WEYL SAMPLER ─────────────────────────────
 * A hull with more vertices than WALL_VERTICES is thinned with `spreadIndices`.
 * A stride would take every k-th hull vertex, and a hull's vertices are already
 * ordered around the ring, so a resonant stride would keep one arc and drop the
 * opposite one: a wall with a hole in the same place on every seed.
 *
 * @enforced-by tests/domain/townCartographyDefenses.test.js
 */

import { spreadIndices } from '../lowDiscrepancy.js';
import { TOWN_SCENE_PLAN_EXTENT } from '../townScene/manifestContract.js';
import {
  clampSceneNumber,
  sceneSegmentIntersection,
} from '../townScene/sceneCompilePrimitives.js';
import { TOWN_CARTOGRAPHY_TUNING } from './cartographyTuning.js';

const T = TOWN_CARTOGRAPHY_TUNING;

/**
 * @typedef {[number, number]} PlanPoint
 * @typedef {import('./cartographySkeleton.js').CartographyStreet} CartographyStreet
 * @typedef {{ id: string, ring: PlanPoint[] }} CartographyWall
 * @typedef {{ id: string, wallId: string, wallSegment: number, streetId: string,
 *             position: PlanPoint }} CartographyGate
 * @typedef {{ id: string, waterIndex: number, waterSegment: number, streetId: string,
 *             position: PlanPoint }} CartographyBridge
 */

/** @param {number} value @returns {number} */
function planCoordinate(value) {
  return clampSceneNumber(Math.round(value), 0, TOWN_SCENE_PLAN_EXTENT);
}

/** Exact integer orientation test: > 0 means o->a->b turns counter-clockwise.
 *  @param {PlanPoint} o @param {PlanPoint} a @param {PlanPoint} b @returns {number} */
function cross(o, a, b) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

/**
 * Andrew's monotone chain. Returns the hull counter-clockwise, without the
 * duplicated closing vertex. Fewer than three distinct points has no hull.
 * @param {PlanPoint[]} points @returns {PlanPoint[]}
 */
function convexHull(points) {
  const sorted = points
    .slice()
    .sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
  /** @type {PlanPoint[]} */
  const deduped = [];
  for (const point of sorted) {
    const previous = deduped[deduped.length - 1];
    if (previous && previous[0] === point[0] && previous[1] === point[1]) continue;
    deduped.push(point);
  }
  if (deduped.length < 3) return [];
  /** @type {PlanPoint[]} */
  const lower = [];
  for (const point of deduped) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
      lower.pop();
    }
    lower.push(point);
  }
  /** @type {PlanPoint[]} */
  const upper = [];
  for (let i = deduped.length - 1; i >= 0; i -= 1) {
    const point = deduped[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
      upper.pop();
    }
    upper.push(point);
  }
  lower.pop();
  upper.pop();
  const hull = lower.concat(upper);
  return hull.length >= 3 ? hull : [];
}

/**
 * BUILD THE WALL RING, or none when the tier sits below the walled band.
 *
 * @param {CartographyStreet[]} lanes
 * @param {PlanPoint} core
 * @param {import('./cartographyMorphology.js').MorphologyReading} morphology
 * @returns {CartographyWall[]}
 */
export function buildWalls(lanes, core, morphology) {
  if (!morphology.walled) return [];
  /** @type {PlanPoint[]} */
  const cloud = [core];
  for (const lane of lanes) for (const point of lane.centerline) cloud.push(point);
  const hull = convexHull(cloud);
  if (hull.length < 3) return [];

  const kept = hull.length > T.WALL_VERTICES
    ? spreadIndices(hull.length, T.WALL_VERTICES).map((index) => hull[index])
    : hull;
  let centroidX = 0;
  let centroidZ = 0;
  for (const point of kept) {
    centroidX += point[0];
    centroidZ += point[1];
  }
  centroidX /= kept.length;
  centroidZ /= kept.length;

  /** @type {PlanPoint[]} */
  const ring = [];
  for (const point of kept) {
    const dx = point[0] - centroidX;
    const dz = point[1] - centroidZ;
    const length = Math.sqrt(dx * dx + dz * dz);
    if (length === 0) {
      ring.push([planCoordinate(point[0]), planCoordinate(point[1])]);
      continue;
    }
    ring.push([
      planCoordinate(point[0] + (dx / length) * T.WALL_MARGIN_PLAN),
      planCoordinate(point[1] + (dz / length) * T.WALL_MARGIN_PLAN),
    ]);
  }
  return [{ id: 'carto:wall:0', ring }];
}

/**
 * Every intersection between one polyline and a closed ring, with the ring
 * segment index that produced it.
 * @param {PlanPoint[]} polyline @param {PlanPoint[]} ring
 * @returns {Array<{ point: PlanPoint, segment: number }>}
 */
function ringCrossings(polyline, ring) {
  /** @type {Array<{ point: PlanPoint, segment: number }>} */
  const out = [];
  for (let i = 0; i < polyline.length - 1; i += 1) {
    for (let segment = 0; segment < ring.length; segment += 1) {
      const a = ring[segment];
      const b = ring[(segment + 1) % ring.length];
      const hit = sceneSegmentIntersection(polyline[i], polyline[i + 1], a, b);
      if (hit) out.push({ point: [planCoordinate(hit[0]), planCoordinate(hit[1])], segment });
    }
  }
  return out;
}

/**
 * GATES: exactly where an arterial crosses the ring. One gate per arterial (its
 * outermost crossing), capped and Weyl-thinned when a settlement has more
 * approaches than the band allows.
 *
 * @param {CartographyStreet[]} arterials
 * @param {CartographyWall[]} walls
 * @returns {{ gates: CartographyGate[], work: number }}
 */
export function buildGates(arterials, walls) {
  /** @type {CartographyGate[]} */
  const candidates = [];
  let work = 0;
  for (const wall of walls) {
    for (const street of arterials) {
      const crossings = ringCrossings(street.centerline, wall.ring);
      work += street.centerline.length * wall.ring.length;
      if (crossings.length === 0) continue;
      // The OUTERMOST crossing is the gate: an arterial that clips a concave
      // pocket of the ring on its way in must still have one door, not several.
      const chosen = crossings[0];
      candidates.push({
        id: `carto:gate:${candidates.length}`,
        wallId: wall.id,
        wallSegment: chosen.segment,
        streetId: street.id,
        position: chosen.point,
      });
    }
  }
  if (candidates.length <= T.MAX_GATES) return { gates: candidates, work };
  const kept = spreadIndices(candidates.length, T.MAX_GATES).map((index) => candidates[index]);
  return {
    gates: kept.map((gate, index) => ({ ...gate, id: `carto:gate:${index}` })),
    work,
  };
}

/**
 * BRIDGES: exactly where a street crosses open water. Arterials are considered
 * before lanes because a road crossing is what earns a bridge; a lane crossing is
 * a footbridge and takes what capacity is left.
 *
 * @param {CartographyStreet[]} streets
 * @param {PlanPoint[][]} waterPaths
 * @returns {{ bridges: CartographyBridge[], work: number }}
 */
export function buildBridges(streets, waterPaths) {
  /** @type {CartographyBridge[]} */
  const candidates = [];
  let work = 0;
  for (let waterIndex = 0; waterIndex < waterPaths.length; waterIndex += 1) {
    const path = waterPaths[waterIndex];
    for (const street of streets) {
      for (let i = 0; i < street.centerline.length - 1; i += 1) {
        for (let segment = 0; segment < path.length - 1; segment += 1) {
          work += 1;
          const hit = sceneSegmentIntersection(
            street.centerline[i],
            street.centerline[i + 1],
            path[segment],
            path[segment + 1],
          );
          if (!hit) continue;
          candidates.push({
            id: `carto:bridge:${candidates.length}`,
            waterIndex,
            waterSegment: segment,
            streetId: street.id,
            position: [planCoordinate(hit[0]), planCoordinate(hit[1])],
          });
        }
      }
    }
  }
  if (candidates.length <= T.MAX_BRIDGES) return { bridges: candidates, work };
  const kept = spreadIndices(candidates.length, T.MAX_BRIDGES).map((index) => candidates[index]);
  return {
    bridges: kept.map((bridge, index) => ({ ...bridge, id: `carto:bridge:${index}` })),
    work,
  };
}
