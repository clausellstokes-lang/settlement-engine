/**
 * domain/townMap/arch/aoBake.js -- K-1 GRAMMAR: deterministic per-vertex CPU AMBIENT OCCLUSION.
 *
 * AO is baked into the GOLDEN mesh as a per-vertex attribute so the LIVE VIEW's occlusion is
 * identical on EVERY machine (kernel doc: "per-vertex CPU-baked AO in the golden"). It is a pure
 * function of the frozen geometry -- a cavity estimate: around each vertex, sample a pinned rational
 * stencil of offset directions (the N_GON_DIRS-derived hemisphere) at a pinned radius, biased along
 * the vertex normal, and measure the fraction that land inside solid geometry (via the frozen
 * occlusion index). A vertex deep in a recess (many samples in solid) darkens; an exposed convex
 * corner stays bright. Output is a Float32Array in [AO_FLOOR, 1], float32-baked so it is byte-stable.
 *
 * PURITY: {+,-,*,/} + Math.sqrt/fround/min/max only (0 transcendental sites) -- the pinned stencil
 * replaces any hemisphere trig. Deterministic: identical geometry -> identical AO bytes cross-engine.
 *
 * @typedef {ReadonlyArray<number>} V3
 */

import { N_GON_DIRS } from './rationalTables.js';
import { buildOcclusionIndex } from './occlusionIndex.js';

/** AO never fully blacks a vertex -- a fill-light floor so material always reads. */
const AO_FLOOR = 0.35;
/** the cavity sample radius (world units); tuned to catch reveals + coursing recesses. */
const AO_RADIUS = 10;
/** how far to push each sample off the surface along the normal before offsetting (avoid self-hit). */
const AO_BIAS = 1.5;

/**
 * The pinned AO sample stencil: the 12-gon ring lifted into three elevation bands (low/mid/high) plus
 * the pole -- a fixed 25-direction hemisphere-ish spread, all from pinned rational tables (no trig).
 * Each is a unit-ish direction; the exact magnitudes are irrelevant (used as offsets, then the
 * occupancy is a ratio), but they are Math.sqrt-normalized so the spread is even.
 * @returns {V3[]}
 */
function buildStencil() {
  const ring = N_GON_DIRS[12];
  /** @type {V3[]} */ const dirs = [];
  // three elevation rings (y = 0.2, 0.55, 0.85) + the pole
  for (const yl of [0.2, 0.55, 0.85]) {
    const rl = Math.sqrt(Math.max(0, 1 - yl * yl));
    for (const d of ring) {
      const ux = (d[0] / 10000) * rl, uz = (d[1] / 10000) * rl;
      dirs.push([ux, yl, uz]);
    }
  }
  dirs.push([0, 1, 0]);
  return dirs;
}

const STENCIL = buildStencil();

/**
 * Bake per-vertex AO for a finalized geometry. Rebuilds the frozen occlusion index from the massing
 * terminals (deterministic; same index the interpreter froze), then samples the pinned stencil around
 * each vertex biased along its normal.
 * @param {{ positions: Float32Array, normals: Float32Array, vertexCount: number }} geo
 * @param {ReadonlyArray<{ path: string, sym: string, role: string, aabb: { min: V3, max: V3 } }>} terminals
 * @returns {Float32Array} AO per vertex, [AO_FLOOR, 1], float32-baked
 */
export function bakeAO(geo, terminals) {
  const index = buildOcclusionIndex(terminals);
  const V = geo.vertexCount;
  const ao = new Float32Array(V);
  const pos = geo.positions, nrm = geo.normals;
  for (let i = 0; i < V; i++) {
    const px = pos[i * 3], py = pos[i * 3 + 1], pz = pos[i * 3 + 2];
    const nx = nrm[i * 3], ny = nrm[i * 3 + 1], nz = nrm[i * 3 + 2];
    // origin nudged off the surface along the normal so a sample doesn't hit the vertex's own solid
    /** @type {V3} */ const o = [px + nx * AO_BIAS, py + ny * AO_BIAS, pz + nz * AO_BIAS];
    let hit = 0, used = 0;
    for (const d of STENCIL) {
      // orient the stencil toward the hemisphere around the normal: skip samples pointing INTO the surface
      const dot = d[0] * nx + d[1] * ny + d[2] * nz;
      if (dot < -0.15) continue; // below the surface horizon
      used++;
      /** @type {V3} */ const q = [o[0] + d[0] * AO_RADIUS, o[1] + d[1] * AO_RADIUS, o[2] + d[2] * AO_RADIUS];
      if (index.solidAt(q)) hit++;
    }
    const occ = used > 0 ? hit / used : 0;
    const v = 1 - occ * (1 - AO_FLOOR); // occ=1 -> AO_FLOOR ; occ=0 -> 1
    ao[i] = Math.fround(v < AO_FLOOR ? AO_FLOOR : v > 1 ? 1 : v);
  }
  return ao;
}
