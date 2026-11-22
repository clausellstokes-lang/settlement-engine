/**
 * Small deterministic primitives shared by the TownScene compiler stages.
 *
 * These helpers deliberately avoid locale collation, ambient randomness, and
 * floating-angle identity. Scene modules use them to keep normalization and
 * geometric predicates consistent without growing one monolithic compiler.
 */

import { TOWN_SCENE_PLAN_EXTENT } from './manifestContract.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
export function sceneRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {number} value @param {number} lo @param {number} hi */
export function clampSceneNumber(value, lo, hi) {
  return value < lo ? lo : value > hi ? hi : value;
}

/** @param {unknown} value @param {number} [fallback] */
export function finiteSceneNumber(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** @param {unknown} value @param {number} max */
export function boundedSceneString(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/** Cross-device codepoint ordering; never delegate persisted order to ICU. */
/** @param {string} a @param {string} b */
export function compareSceneCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @template T @param {T[]} rows @param {(row:T)=>string} idOf @returns {T[]} */
export function sortSceneRecords(rows, idOf) {
  return rows.sort((a, b) => compareSceneCodepoint(idOf(a), idOf(b)));
}

/** @param {unknown} raw @returns {[number, number]} */
export function scenePointPair(raw) {
  const pair = Array.isArray(raw) ? raw : [];
  return [
    clampSceneNumber(Math.round(finiteSceneNumber(pair[0])), 0, TOWN_SCENE_PLAN_EXTENT),
    clampSceneNumber(Math.round(finiteSceneNumber(pair[1])), 0, TOWN_SCENE_PLAN_EXTENT),
  ];
}

/** @param {unknown} raw @returns {{ x: number, y: number }} */
export function scenePointObject(raw) {
  const value = sceneRecord(raw);
  return {
    x: clampSceneNumber(Math.round(finiteSceneNumber(value.x)), 0, TOWN_SCENE_PLAN_EXTENT),
    y: clampSceneNumber(Math.round(finiteSceneNumber(value.y)), 0, TOWN_SCENE_PLAN_EXTENT),
  };
}

/** Read one of the four stable 32-bit words in a scene digest. */
/** @param {string} digestValue @param {number} salt */
export function sceneDigestWord(digestValue, salt) {
  const start = 9 + (salt % 4) * 8;
  return parseInt(digestValue.slice(start, start + 8), 16) >>> 0;
}

/** @param {Array<[number, number]>} polygon */
export function scenePolygonArea(polygon) {
  let twiceArea = 0;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    twiceArea += polygon[j][0] * polygon[i][1] - polygon[i][0] * polygon[j][1];
  }
  return Math.abs(twiceArea) / 2;
}

/** Deterministic point-in-polygon predicate for canonical district footprints. */
/** @param {number} x @param {number} z @param {Array<[number, number]>} polygon */
export function scenePointInPolygon(x, z, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const zi = polygon[i][1];
    const xj = polygon[j][0];
    const zj = polygon[j][1];
    const crosses = ((zi > z) !== (zj > z))
      && (x < ((xj - xi) * (z - zi)) / ((zj - zi) || 1) + xi);
    if (crosses) inside = !inside;
  }
  return inside;
}

/** Squared point-to-segment distance in plan space. */
/**
 * @param {number} px
 * @param {number} pz
 * @param {[number, number]} a
 * @param {[number, number]} b
 */
export function scenePointSegmentDistanceSq(px, pz, a, b) {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  if (dx === 0 && dz === 0) {
    const endpointDx = px - a[0];
    const endpointDz = pz - a[1];
    return endpointDx * endpointDx + endpointDz * endpointDz;
  }
  const t = clampSceneNumber(
    ((px - a[0]) * dx + (pz - a[1]) * dz) / (dx * dx + dz * dz),
    0,
    1,
  );
  const qx = a[0] + t * dx;
  const qz = a[1] + t * dz;
  const nearestDx = px - qx;
  const nearestDz = pz - qz;
  return nearestDx * nearestDx + nearestDz * nearestDz;
}

/**
 * Closest point on a segment, including its normalized parameter. The result is
 * used for quay placement and collision tests, never persisted without integer
 * quantization.
 *
 * @param {number} px
 * @param {number} pz
 * @param {[number, number]} a
 * @param {[number, number]} b
 */
export function sceneNearestPointOnSegment(px, pz, a, b) {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const denominator = dx * dx + dz * dz;
  const t = denominator > 0
    ? clampSceneNumber(((px - a[0]) * dx + (pz - a[1]) * dz) / denominator, 0, 1)
    : 0;
  return {
    point: /** @type {[number, number]} */ ([a[0] + t * dx, a[1] + t * dz]),
    t,
    distanceSq: scenePointSegmentDistanceSq(px, pz, a, b),
  };
}

/**
 * Intersection of two closed segments. Collinear overlaps return null: water
 * infrastructure needs a single crossing, not an ambiguous shared alignment.
 *
 * @param {[number, number]} a
 * @param {[number, number]} b
 * @param {[number, number]} c
 * @param {[number, number]} d
 */
export function sceneSegmentIntersection(a, b, c, d) {
  const rX = b[0] - a[0];
  const rZ = b[1] - a[1];
  const sX = d[0] - c[0];
  const sZ = d[1] - c[1];
  const denominator = rX * sZ - rZ * sX;
  if (Math.abs(denominator) < 1e-9) return null;
  const cax = c[0] - a[0];
  const caz = c[1] - a[1];
  const t = (cax * sZ - caz * sX) / denominator;
  const u = (cax * rZ - caz * rX) / denominator;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return /** @type {[number, number]} */ ([a[0] + t * rX, a[1] + t * rZ]);
}

/** Radius of a footprint around its declared center, in plan units. */
/**
 * @param {[number, number]} center
 * @param {Array<[number, number]>} footprint
 */
export function sceneFootprintRadius(center, footprint) {
  let radiusSq = 0;
  for (const point of footprint) {
    const dx = point[0] - center[0];
    const dz = point[1] - center[1];
    radiusSq = Math.max(radiusSq, dx * dx + dz * dz);
  }
  return Math.sqrt(radiusSq);
}

/** Radical inverse used for deterministic, evenly spread fabric candidates. */
/** @param {number} index @param {number} base */
export function sceneRadicalInverse(index, base) {
  let n = Math.max(1, Math.floor(index));
  let factor = 1 / base;
  let value = 0;
  while (n > 0) {
    value += (n % base) * factor;
    n = Math.floor(n / base);
    factor /= base;
  }
  return value;
}
