/**
 * domain/townMap/arch/emitter.js -- K-1 GRAMMAR: the MESH EMITTER (terminals -> the golden mesh).
 *
 * The emitter turns interpreter TERMINALS into closed-manifold solids, over the K-0b mesh.js algebra
 * (createMesh/addBox/addSpire/addTube/addExtrudedConvex/finalizeMesh -- REUSED verbatim, so the
 * vertex intern + float32 baking are bit-identical to the K-0b goldens). It adds exactly what K-1
 * needs on top:
 *   - the PROFILE-SWEEP terminal (variable 2D cross-section along a Bezier) -- profile 'square'
 *     delegates to addTube VERBATIM (the byte-parity bridge); richer profiles use a general sweep;
 *   - the n-gon PRISM terminal (curved massing on the pinned N_GON_DIRS);
 *   - a per-triangle MATERIAL-ROLE attribute (NOT a reorder -- the index buffer stays in emission
 *     order, so byte-parity holds; the role is a parallel Uint8Array + role->range map);
 *   - per-vertex CPU-baked AO (aoBake.js) as a parallel attribute (NOT in the intern key, so
 *     positions/normals/indices are byte-identical to a direct build);
 *   - the CREASE-EDGE index (dihedral via normal dot products) -- the engraved ink line drawn in
 *     BOTH the viewer and the plate (the atlas voice in 3D).
 *
 * The build wrapper meters TRIANGLES/VERTICES vs the HARD per-tier ceilings and FAILS CLOSED.
 * Every array it returns is a transferable typed array (the worker seam).
 *
 * PURITY: {+,-,*,/} + Math.sqrt/fround/round only; 0 transcendental sites.
 *
 * @typedef {import('./ops.js').TerminalRec} TerminalRec
 * @typedef {import('./grammarIR.js').Ruleset} Ruleset
 * @typedef {[number, number, number]} V3
 */

import {
  createMesh, addBox, addTube, addSpire, addTri, addQuad, addExtrudedConvex, finalizeMesh,
} from './mesh.js';
import { N_GON_DIRS } from './rationalTables.js';
import { profileRing } from './profiles.js';
import { bakeAO } from './aoBake.js';
import { interpret } from './interpreter.js';
import { ROLE_INDEX, HARD_TIER_CEILINGS, ARCH_GEOMETRY_VERSION, ARCH_GRAMMAR_VERSION } from './grammarIR.js';

/** the geometry stamp the goldens carry -- grammar + geometry versions. */
const ARCH_GEOMETRY_STAMP = `arch-g${ARCH_GEOMETRY_VERSION}-r${ARCH_GRAMMAR_VERSION}`;

/**
 * The profile-sweep primitive: sweep a 2D moulding profile ring along a poly-line path, producing a
 * closed tube with end caps. Generalizes addTube (whose 'square' ring this reproduces). The
 * cross-section frame is rebuilt per station from the local tangent + a reference up (pure cross
 * products, no trig), exactly as addTube -- so the two agree on the square profile.
 * @param {import('./mesh.js').Mesh} m @param {ReadonlyArray<V3>} path @param {ReadonlyArray<ReadonlyArray<number>>} ring @param {number} halfW @param {number} halfH @param {V3} [refUp]
 */
function addProfileSweep(m, path, ring, halfW, halfH, refUp) {
  const n = path.length;
  if (n < 2 || ring.length < 3) return;
  const ref = refUp || [0, 1, 0];
  /** @param {V3} a @param {V3} b @returns {V3} */
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  /** @param {V3} a @param {V3} b @returns {V3} */
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  /** @param {V3} a @returns {V3} */
  const norm = (a) => { const mm = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]); return mm > 0 ? [a[0] / mm, a[1] / mm, a[2] / mm] : [0, 0, 0]; };
  const R = ring.length;
  /** @type {V3[][]} */ const stations = [];
  for (let i = 0; i < n; i++) {
    const prev = path[i === 0 ? 0 : i - 1];
    const next = path[i === n - 1 ? n - 1 : i + 1];
    let t = norm(sub(next, prev));
    if (t[0] === 0 && t[1] === 0 && t[2] === 0) t = [0, 1, 0];
    let r = ref;
    const dot = t[0] * r[0] + t[1] * r[1] + t[2] * r[2];
    if (dot > 0.999 || dot < -0.999) r = [1, 0, 0];
    const side = norm(cross(t, r));
    const up = norm(cross(side, t));
    const c = path[i];
    /** @type {V3[]} */ const pts = [];
    for (const rp of ring) {
      const sw = rp[0] * halfW, sh = rp[1] * halfH;
      pts.push(/** @type {V3} */ ([
        c[0] + side[0] * sw + up[0] * sh,
        c[1] + side[1] * sw + up[1] * sh,
        c[2] + side[2] * sw + up[2] * sh,
      ]));
    }
    stations.push(pts);
  }
  for (let i = 0; i < n - 1; i++) {
    const a = stations[i], b = stations[i + 1];
    for (let k = 0; k < R; k++) { const k2 = (k + 1) % R; addQuad(m, a[k], a[k2], b[k2], b[k]); }
  }
  // caps (fan) -- start faces back, end faces forward
  const s = stations[0], e = stations[n - 1];
  for (let k = 1; k < R - 1; k++) { addTri(m, s[0], s[k + 1], s[k]); addTri(m, e[0], e[k], e[k + 1]); }
}

/**
 * The n-gon vertical prism primitive: an n-gon (from the pinned N_GON_DIRS) between y0 and y1,
 * centred at (cx,cz), radius r, with an optional integer spoke offset. Closed manifold (sides + two
 * fan caps). The curved-massing owner (apse, round tower).
 * @param {import('./mesh.js').Mesh} m @param {number} nGon @param {number} cx @param {number} cz @param {number} r @param {number} y0 @param {number} y1 @param {number} kOffset
 */
function addPrism(m, nGon, cx, cz, r, y0, y1, kOffset) {
  const table = N_GON_DIRS[nGon];
  if (!table) throw new Error(`arch/emitter: prism n-gon ${nGon} not in N_GON_DIRS`);
  const N = table.length;
  const off = kOffset | 0;
  /** @type {V3[]} */ const bot = []; /** @type {V3[]} */ const top = [];
  for (let k = 0; k < N; k++) {
    const d = table[((k + off) % N + N) % N];
    const ux = d[0] / 10000, uz = d[1] / 10000;
    bot.push(/** @type {V3} */ ([cx + r * ux, y0, cz + r * uz]));
    top.push(/** @type {V3} */ ([cx + r * ux, y1, cz + r * uz]));
  }
  for (let k = 0; k < N; k++) { const k2 = (k + 1) % N; addQuad(m, bot[k], bot[k2], top[k2], top[k]); }
  for (let k = 1; k < N - 1; k++) { addTri(m, top[0], top[k], top[k + 1]); addTri(m, bot[0], bot[k + 1], bot[k]); }
}

/**
 * Extract the CREASE-EDGE index: edges where two faces meet at a dihedral above threshold, plus
 * boundary (single-face) edges. Faceted meshes duplicate positions at every hard edge, so an edge is
 * keyed by its two float32 POSITIONS; two triangles that share a position-pair with sufficiently
 * different normals contribute a crease line (representative vertex indices returned for drawing).
 * Pure: dot products + Math.sqrt.
 * @param {{ positions: Float32Array, normals: Float32Array, indices: Uint32Array }} geo
 * @returns {Uint32Array} flat pairs [a0,b0, a1,b1, ...] of vertex indices into geo.positions
 */
function extractCreaseEdges(geo) {
  const pos = geo.positions, nrm = geo.normals, idx = geo.indices;
  const COS_CREASE = 0.94; // dihedral above ~20deg reads as an engraved edge
  /** @param {number} v @returns {string} */
  const pkey = (v) => `${pos[v * 3]},${pos[v * 3 + 1]},${pos[v * 3 + 2]}`;
  /** @type {Map<string, { a: number, b: number, nx: number, ny: number, nz: number, count: number, done: boolean }>} */
  const edges = new Map();
  /** @type {number[]} */ const out = [];
  for (let t = 0; t < idx.length; t += 3) {
    const tri = [idx[t], idx[t + 1], idx[t + 2]];
    // face normal = the (shared) vertex normal of a flat face
    const nx = nrm[tri[0] * 3], ny = nrm[tri[0] * 3 + 1], nz = nrm[tri[0] * 3 + 2];
    for (let e = 0; e < 3; e++) {
      const va = tri[e], vb = tri[(e + 1) % 3];
      const ka = pkey(va), kb = pkey(vb);
      const key = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
      const prev = edges.get(key);
      if (!prev) { edges.set(key, { a: va, b: vb, nx, ny, nz, count: 1, done: false }); continue; }
      prev.count++;
      if (prev.done) continue;
      const d = prev.nx * nx + prev.ny * ny + prev.nz * nz;
      if (d < COS_CREASE) { out.push(prev.a, prev.b); prev.done = true; }
    }
  }
  // boundary edges (single face) are silhouette/opening creases too
  for (const ed of edges.values()) if (ed.count === 1 && !ed.done) out.push(ed.a, ed.b);
  return Uint32Array.from(out);
}

/**
 * Emit a terminal list to the golden mesh + all K-1 attributes. Preserves emission order (byte-parity
 * with a direct build). @param {ReadonlyArray<TerminalRec>} terminals
 * @returns {{
 *   positions: Float32Array, normals: Float32Array, indices: Uint32Array, vertexCount: number,
 *   triangleCount: number, min: V3, max: V3, ao: Float32Array, creaseEdges: Uint32Array,
 *   triRole: Uint8Array, roleRanges: Array<{ role: string, start: number, end: number }>,
 *   geometryVersion: number, grammarVersion: number, geometryStamp: string,
 * }}
 */
export function emitMesh(terminals) {
  const m = createMesh();
  /** @type {Array<{ role: string, start: number, end: number }>} */ const roleRanges = [];
  for (const term of terminals) {
    const startTri = m.indices.length / 3;
    emitOne(m, term);
    const endTri = m.indices.length / 3;
    if (endTri > startTri) roleRanges.push({ role: term.role, start: startTri, end: endTri });
  }
  const base = finalizeMesh(m);
  const triRole = new Uint8Array(base.triangleCount);
  for (const r of roleRanges) { const ri = ROLE_INDEX[r.role]; for (let t = r.start; t < r.end; t++) triRole[t] = ri; }
  const ao = bakeAO(base, terminals);
  const creaseEdges = extractCreaseEdges(base);
  return {
    positions: base.positions, normals: base.normals, indices: base.indices,
    vertexCount: base.vertexCount, triangleCount: base.triangleCount, min: base.min, max: base.max,
    ao, creaseEdges, triRole, roleRanges,
    geometryVersion: ARCH_GEOMETRY_VERSION, grammarVersion: ARCH_GRAMMAR_VERSION, geometryStamp: ARCH_GEOMETRY_STAMP,
  };
}

/** dispatch one terminal to the right mesh primitive. @param {import('./mesh.js').Mesh} m @param {TerminalRec} term */
function emitOne(m, term) {
  const s = term.spec;
  switch (term.kind) {
    case 'box':
      addBox(m, s.x0, s.x1, s.y0, s.y1, s.z0, s.z1); return;
    case 'spire':
      addSpire(m, s.cx, s.cz, s.baseHalf, s.baseY, s.apexY, s.apexCx, s.apexCz); return;
    case 'sweep':
      if (!s.profile || s.profile === 'square') addTube(m, s.path, s.halfW, s.halfH, s.refUp || undefined);
      else addProfileSweep(m, s.path, profileRing(s.profile), s.halfW, s.halfH, s.refUp || undefined);
      return;
    case 'prism':
      addPrism(m, s.n, s.cx, s.cz, s.radius, s.y0, s.y1, s.rot || 0); return;
    case 'extrudeConvex':
      addExtrudedConvex(m, s.ring, s.z0, s.z1); return;
    default:
      throw new Error(`arch/emitter: terminal kind "${term.kind}" is not emittable`);
  }
}

/**
 * Build a mesh from a ruleset at a tier: interpret -> emit -> FAIL-CLOSED on the triangle/vertex
 * ceiling. The single entry point the exporters + goldens call.
 * @param {Ruleset} ruleset @param {{ seedId?: string, tier: number }} opts
 * @returns {ReturnType<typeof emitMesh> & { meters: object }}
 */
export function buildArchMesh(ruleset, opts) {
  const { terminals, meters } = interpret(ruleset, { seedId: opts.seedId, tier: opts.tier });
  const mesh = emitMesh(terminals);
  const ceil = HARD_TIER_CEILINGS[opts.tier];
  if (mesh.triangleCount > ceil.triangles) throw new Error(`arch/emitter: triangle ceiling ${ceil.triangles} breached at tier ${opts.tier} (${mesh.triangleCount})`);
  if (mesh.vertexCount > ceil.vertices) throw new Error(`arch/emitter: vertex ceiling ${ceil.vertices} breached at tier ${opts.tier} (${mesh.vertexCount})`);
  return { ...mesh, meters: { ...meters, triangles: mesh.triangleCount, vertices: mesh.vertexCount, draws: mesh.roleRanges.length } };
}
