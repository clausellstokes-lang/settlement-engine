/**
 * domain/townMap/arch/plate.js -- K-1 GRAMMAR: the CPU PLATE exporter (the deterministic image).
 *
 * Productionizes the K-0 raster idea over the K-1 MESH: a pure, z-buffered software rasterizer that
 * renders the golden mesh from CANONICAL FIXED ANGLES (axonometric NW, west front, south elevation)
 * into a byte-stable PNG-ready buffer -- a plate is now an EXPORT FORMAT of the structure, not the
 * deliverable (kernel doc CORRECTION 3). It shades per the ~12 finite MATERIAL ROLES, multiplies in
 * the per-vertex baked AO, tone-maps through the pinned TONE_LUT, and overlays the CREASE INK LINES
 * (the engraved atlas voice in 3D). Being INSIDE the determinism perimeter it uses NO trig: the
 * projection is an affine ORTHOGRAPHIC parallel view whose basis is rational + Math.sqrt-normalized.
 *
 * PURITY: {+,-,*,/} + Math.sqrt/round/min/max/abs/floor + integer hashing; 0 transcendental sites.
 * Deterministic: identical mesh + view -> identical bytes cross-engine (the plate golden).
 *
 * @typedef {readonly [number, number, number]} V3
 * @typedef {[number, number, number]} RGB
 */

import { LIGHT_MODEL, tone } from './rationalTables.js';
import { MATERIAL_ROLES } from './grammarIR.js';

const AMBIENT = 0.40, DIFFUSE = 0.62;

/**
 * ROLE_ALBEDO -- the frozen role -> linear-rgb map (stone tints; roles NOT rgb, this is the plate's
 * material read of the semantic roles). Warm ashlar, cooler dressed stone, pale tracery, dark leaded
 * glass, leaden roof. K-3/K-4 replace this with weathered textures + drift; the plate reads roles.
 * @type {Readonly<Record<string, RGB>>}
 */
export const ROLE_ALBEDO = Object.freeze({
  ashlar: [0.82, 0.77, 0.67],
  dressedStone: [0.80, 0.75, 0.65],
  voussoir: [0.84, 0.79, 0.69],
  tracery: [0.86, 0.82, 0.72],
  mullion: [0.83, 0.78, 0.68],
  glassLead: [0.12, 0.15, 0.22],
  roofLead: [0.46, 0.48, 0.52],
  buttressStone: [0.79, 0.74, 0.64],
  pinnacleStone: [0.81, 0.76, 0.66],
  corbel: [0.78, 0.73, 0.63],
  relief: [0.80, 0.75, 0.64],
  groundStone: [0.50, 0.47, 0.42],
});

/** normalize (sqrt allowed). @param {V3} a @returns {V3} */
function norm(a) { const m = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]); return m > 0 ? [a[0] / m, a[1] / m, a[2] / m] : [0, 0, 0]; }
/** cross. @param {V3} a @param {V3} b @returns {V3} */
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }

/**
 * CANONICAL VIEWS -- rational (+sqrt) orthographic bases. Each: viewDir (into the screen), plus a
 * right + up built by exact cross products. NO trig. The axonometric NW view uses a sqrt-normalized
 * oblique direction; the two elevations are axis-aligned.
 * @type {Readonly<Record<string, { dir: V3, up: V3 }>>}
 */
export const CANONICAL_VIEWS = Object.freeze({
  axonNW: { dir: norm([0.62, -0.42, -0.66]), up: [0, 1, 0] },   // from front-left-above (3/4)
  westFront: { dir: [0, 0, -1], up: [0, 1, 0] },                // head-on the facade (looking -z)
  southElev: { dir: [-1, 0, 0], up: [0, 1, 0] },               // a side elevation (looking +x from -x)
});

/** build an orthonormal screen basis {right, up, dir} from a view. @param {{dir:V3, up:V3}} v */
function basis(v) {
  const dir = norm(v.dir);
  let right = norm(cross(v.up, dir));
  if (right[0] === 0 && right[1] === 0 && right[2] === 0) right = [1, 0, 0];
  const up = norm(cross(dir, right));
  return { right, up, dir };
}

/**
 * Render a golden mesh (with AO + crease edges + per-triangle roles) to a plate from a canonical view.
 * @param {{ positions: Float32Array, normals: Float32Array, indices: Uint32Array, vertexCount: number, ao: Float32Array, creaseEdges: Uint32Array, triRole: Uint8Array, min: V3, max: V3 }} mesh
 * @param {{ view?: string, width?: number, height?: number, ss?: number, margin?: number, roleAlbedo?: Readonly<Record<string, RGB>> }} [opts]
 * @returns {{ width: number, height: number, rgb: Uint8Array }}
 */
export function renderMeshPlate(mesh, opts) {
  const viewName = (opts && opts.view) || 'axonNW';
  const view = CANONICAL_VIEWS[viewName];
  if (!view) throw new Error(`arch/plate: canonical view "${viewName}" unknown (axonNW|westFront|southElev)`);
  // The role -> albedo read: default the K-1 all-stone table; a K-3 SKIN passes its own map (skins.js
  // skinRoleAlbedo) to re-dress ANY mesh without touching geometry. Absent opts -> byte-identical to
  // the pinned K-1 plate goldens.
  const roleAlbedo = (opts && opts.roleAlbedo) || ROLE_ALBEDO;
  const W = (opts && opts.width) || 900, H = (opts && opts.height) || 720;
  const ss = (opts && opts.ss) || 2, margin = (opts && opts.margin) || 48;
  const bw = W * ss, bh = H * ss;
  const { right, up, dir } = basis(view);
  const pos = mesh.positions, nrm = mesh.normals, idx = mesh.indices, ao = mesh.ao;

  const cx = (mesh.min[0] + mesh.max[0]) / 2, cy = (mesh.min[1] + mesh.max[1]) / 2, cz = (mesh.min[2] + mesh.max[2]) / 2;
  // screen coords (parallel projection): sx = (p-c).right, sy = (p-c).up, depth = (p-c).(-dir)
  const V = mesh.vertexCount;
  const sx = new Float64Array(V), sy = new Float64Array(V), sd = new Float64Array(V);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < V; i++) {
    const dx = pos[i * 3] - cx, dy = pos[i * 3 + 1] - cy, dz = pos[i * 3 + 2] - cz;
    const x = dx * right[0] + dy * right[1] + dz * right[2];
    const y = dx * up[0] + dy * up[1] + dz * up[2];
    const d = -(dx * dir[0] + dy * dir[1] + dz * dir[2]);
    sx[i] = x; sy[i] = y; sd[i] = d;
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const spanX = maxX - minX || 1, spanY = maxY - minY || 1;
  const scale = Math.min((bw - 2 * margin * ss) / spanX, (bh - 2 * margin * ss) / spanY);
  const offX = margin * ss - minX * scale + ((bw - 2 * margin * ss) - spanX * scale) / 2;
  const offY = margin * ss - minY * scale + ((bh - 2 * margin * ss) - spanY * scale) / 2;
  const px = new Float64Array(V), py = new Float64Array(V);
  for (let i = 0; i < V; i++) { px[i] = sx[i] * scale + offX; py[i] = bh - (sy[i] * scale + offY); }

  const buf = new Float32Array(bw * bh * 3);
  const depth = new Float32Array(bw * bh).fill(Infinity);
  // sky gradient background
  for (let y = 0; y < bh; y++) {
    const t = y / (bh - 1);
    const r = 0.70 + (0.86 - 0.70) * t, g = 0.77 + (0.83 - 0.77) * t, b = 0.86 + (0.77 - 0.86) * t;
    for (let x = 0; x < bw; x++) { const o = (y * bw + x) * 3; buf[o] = r; buf[o + 1] = g; buf[o + 2] = b; }
  }

  const L = LIGHT_MODEL;
  for (let t = 0; t < idx.length; t += 3) {
    const ia = idx[t], ib = idx[t + 1], ic = idx[t + 2];
    const ax = px[ia], ay = py[ia], bx = px[ib], by = py[ib], ccx = px[ic], ccy = py[ic];
    const area = (bx - ax) * (ccy - ay) - (by - ay) * (ccx - ax);
    if (area === 0) continue;
    // face normal (flat) -> Lambert from the fixed model light; backface cull against the view dir
    const nx = nrm[ia * 3], ny = nrm[ia * 3 + 1], nz = nrm[ia * 3 + 2];
    const facing = nx * dir[0] + ny * dir[1] + nz * dir[2];
    if (facing > 0) continue; // normal points away from the camera (dir goes into screen)
    let ndl = nx * L[0] + ny * L[1] + nz * L[2]; if (ndl < 0) ndl = 0;
    const lit = AMBIENT + DIFFUSE * ndl;
    const role = MATERIAL_ROLES[mesh.triRole[t / 3]] || 'ashlar';
    const alb = roleAlbedo[role] || roleAlbedo.ashlar || ROLE_ALBEDO.ashlar;
    const aoA = ao[ia], aoB = ao[ib], aoC = ao[ic];
    const minPX = Math.max(0, Math.floor(Math.min(ax, bx, ccx))), maxPX = Math.min(bw - 1, Math.ceil(Math.max(ax, bx, ccx)));
    const minPY = Math.max(0, Math.floor(Math.min(ay, by, ccy))), maxPY = Math.min(bh - 1, Math.ceil(Math.max(ay, by, ccy)));
    const invArea = 1 / area;
    for (let y = minPY; y <= maxPY; y++) {
      for (let x = minPX; x <= maxPX; x++) {
        const qx = x + 0.5, qy = y + 0.5;
        const w0 = ((bx - qx) * (ccy - qy) - (by - qy) * (ccx - qx)) * invArea;
        const w1 = ((ccx - qx) * (ay - qy) - (ccy - qy) * (ax - qx)) * invArea;
        const w2 = 1 - w0 - w1;
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;
        const dep = w0 * sd[ia] + w1 * sd[ib] + w2 * sd[ic];
        const di = y * bw + x;
        if (dep >= depth[di]) continue;
        depth[di] = dep;
        const aoV = w0 * aoA + w1 * aoB + w2 * aoC;
        const s = lit * aoV;
        const o = di * 3; buf[o] = alb[0] * s; buf[o + 1] = alb[1] * s; buf[o + 2] = alb[2] * s;
      }
    }
  }

  // ── CREASE INK LINES (engraved) -- draw dark where a crease edge is at/near the visible surface ──
  const ink = 0.20;
  const ce = mesh.creaseEdges;
  for (let e = 0; e < ce.length; e += 2) {
    const a = ce[e], b = ce[e + 1];
    const x0 = px[a], y0 = py[a], d0 = sd[a], x1 = px[b], y1 = py[b], d1 = sd[b];
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))));
    for (let s = 0; s <= steps; s++) {
      const tt = s / steps;
      const xf = x0 + (x1 - x0) * tt, yf = y0 + (y1 - y0) * tt, df = d0 + (d1 - d0) * tt;
      const xi = Math.round(xf), yi = Math.round(yf);
      if (xi < 0 || xi >= bw || yi < 0 || yi >= bh) continue;
      const di = yi * bw + xi;
      if (df <= depth[di] + 0.75) { // on or in front of the surface (small bias)
        const o = di * 3; buf[o] *= ink; buf[o + 1] *= ink; buf[o + 2] *= ink;
      }
    }
  }

  // ── downsample (box) + tone map ────────────────────────────────────────────
  const rgb = new Uint8Array(W * H * 3);
  const inv = 1 / (ss * ss);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let r = 0, g = 0, b = 0;
    for (let sy2 = 0; sy2 < ss; sy2++) for (let sx2 = 0; sx2 < ss; sx2++) {
      const i = ((y * ss + sy2) * bw + (x * ss + sx2)) * 3; r += buf[i]; g += buf[i + 1]; b += buf[i + 2];
    }
    const o = (y * W + x) * 3;
    rgb[o] = tone(r * inv); rgb[o + 1] = tone(g * inv); rgb[o + 2] = tone(b * inv);
  }
  return { width: W, height: H, rgb };
}
