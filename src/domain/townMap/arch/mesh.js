/**
 * domain/townMap/arch/mesh.js -- K-0b SPIKE: the deterministic 3D MESH builder.
 *
 * K-0 proved the deterministic gothic geometry as a 2D projection + a CPU raster plate. K-0b
 * raises that same rational vocabulary into a REAL 3D MESH (positions / normals / indices) --
 * the owner ruling v2 deliverable: "a FULL 3D STRUCTURE, not a plate", at maximum architectural
 * fidelity (docs/THE_ARCHITECTURE_KERNEL_3D.md, CORRECTION 3 + the mesh-max-fidelity paragraph).
 *
 * This leaf is the low-level MESH ALGEBRA the cathedral-section builder emits into: a flat-shaded
 * (per-face-normal) triangle accumulator plus the constructive primitives -- boxes, extruded
 * convex prisms (the wall-band slabs that carry the real window/rose openings + their reveals),
 * swept rectangular tubes (the arch order, tracery bars, the flying-buttress flyer), and tapered
 * spires (pinnacle + weathering caps). Every solid it builds is individually a CLOSED manifold, so
 * a concatenation of them has no boundary edges (the watertight-ish gate).
 *
 * DETERMINISM + PURITY (the townMap purity floor, unchanged from K-0): {+, -, *, /} + Math.sqrt
 * and Math.fround / min / max / abs / round only -- NO trig, NO Math.pow/exp/log/hypot/**, NO
 * Date/random. The transcendental-math ratchet (tests/architecture/k0GeometryTracery.test.js +
 * tests/lint/transcendentalMathBaseline.test.js) holds this file at ZERO transcendental sites.
 * Positions are baked to float32 (Math.fround) as they enter the mesh so the JS mesh and the GLB
 * binary agree bit-for-bit and a double build is byte-identical cross-engine (the GLB golden).
 *
 * @typedef {[number, number, number]} V3  a model point / vector (x = east, y = up, z = depth+ toward the viewer)
 * @typedef {readonly [number, number]} UV  a facade point (u = east, v = up) placed later at some depth z
 * @typedef {{
 *   positions: number[],
 *   normals: number[],
 *   indices: number[],
 *   index: Map<string, number>,
 * }} Mesh
 */

/** New empty mesh accumulator. @returns {Mesh} */
export function createMesh() {
  return { positions: [], normals: [], indices: [], index: new Map() };
}

/** Bake a coordinate to float32 (cross-engine-exact, GLB-parity). @param {number} x @returns {number} */
function f32(x) {
  return Math.fround(x);
}

/** a - b. @param {V3} a @param {V3} b @returns {V3} */
function sub3(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

/** a x b (cross product). @param {V3} a @param {V3} b @returns {V3} */
function cross3(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

/** Normalize; returns [0,0,0] for a zero vector. @param {V3} a @returns {V3} */
function norm3(a) {
  const m = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
  return m > 0 ? [a[0] / m, a[1] / m, a[2] / m] : [0, 0, 0];
}

/**
 * Intern one vertex (position + flat normal) and return its index. Vertices with an identical
 * float32 position AND normal are shared (a compact faceted mesh); a face boundary -- where the
 * normal changes -- duplicates the position, which is exactly what flat shading needs. Insertion
 * order is fixed, so the interning is deterministic.
 * @param {Mesh} m @param {V3} p @param {V3} n @returns {number}
 */
function vertex(m, p, n) {
  const px = f32(p[0]), py = f32(p[1]), pz = f32(p[2]);
  const nx = f32(n[0]), ny = f32(n[1]), nz = f32(n[2]);
  const key = `${px},${py},${pz},${nx},${ny},${nz}`;
  const hit = m.index.get(key);
  if (hit !== undefined) return hit;
  const id = m.positions.length / 3;
  m.positions.push(px, py, pz);
  m.normals.push(nx, ny, nz);
  m.index.set(key, id);
  return id;
}

/**
 * Add one triangle with a FLAT normal derived from its winding (CCW as seen from outside ->
 * outward normal). Degenerate (zero-area) triangles are skipped so no NaN normal can enter.
 * @param {Mesh} m @param {V3} a @param {V3} b @param {V3} c @returns {void}
 */
export function addTri(m, a, b, c) {
  const n = norm3(cross3(sub3(b, a), sub3(c, a)));
  if (n[0] === 0 && n[1] === 0 && n[2] === 0) return; // degenerate -> drop
  m.indices.push(vertex(m, a, n), vertex(m, b, n), vertex(m, c, n));
}

/**
 * Add a planar quad a-b-c-d (CCW from outside) as two triangles sharing the a-c diagonal.
 * @param {Mesh} m @param {V3} a @param {V3} b @param {V3} c @param {V3} d @returns {void}
 */
export function addQuad(m, a, b, c, d) {
  addTri(m, a, b, c);
  addTri(m, a, c, d);
}

/**
 * Add an axis-aligned box [x0,x1] x [y0,y1] x [z0,z1] as six outward-facing quads (a closed
 * manifold). The stepped-pier stages, the string courses, the mullion, and the wall plinth are
 * all boxes.
 * @param {Mesh} m @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z0 @param {number} z1 @returns {void}
 */
export function addBox(m, x0, x1, y0, y1, z0, z1) {
  addQuad(m, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]); // front +z
  addQuad(m, [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]); // back -z
  addQuad(m, [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]); // east +x
  addQuad(m, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]); // west -x
  addQuad(m, [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]); // top +y
  addQuad(m, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]); // bottom -y
}

/**
 * Extrude a CONVEX facade ring (CCW in the u,v plane) from z0 (back) to z1 (front) into a closed
 * prism: a fan-triangulated front cap (+z), a reversed back cap (-z), and one outward side quad
 * per edge. This is the wall-band slab primitive -- each solid span of the pierced wall (left/right
 * of an opening, and the full-width courses) is one such prism, so the wall is watertight and the
 * openings are real gaps whose slanted inner reveals are the prisms' opening-side faces.
 * @param {Mesh} m @param {ReadonlyArray<UV>} ring @param {number} z0 @param {number} z1 @returns {void}
 */
export function addExtrudedConvex(m, ring, z0, z1) {
  const n = ring.length;
  if (n < 3) return;
  /** @param {UV} p @param {number} z @returns {V3} */
  const at = (p, z) => [p[0], p[1], z];
  for (let i = 1; i < n - 1; i++) {
    addTri(m, at(ring[0], z1), at(ring[i], z1), at(ring[i + 1], z1)); // front cap
    addTri(m, at(ring[0], z0), at(ring[i + 1], z0), at(ring[i], z0)); // back cap (reversed)
  }
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n];
    addQuad(m, at(a, z0), at(b, z0), at(b, z1), at(a, z1)); // side wall (outward)
  }
}

/**
 * Sweep a rectangular cross-section along a poly-line PATH, producing a closed tube with end
 * caps. The cross-section frame is rebuilt per station from the local tangent and a reference
 * up (default world-up; for in-wall tracery pass the wall normal so the ribbon's width lies IN
 * the wall plane and its depth protrudes along z). No trig -- the frame is pure cross products.
 * Used for the arch order (voussoir ring), the light sub-arch bars, the rose ring + foils, the
 * mullion sweeps, and the flying-buttress FLYER (a true 3D load-path solid, not a billboard).
 * @param {Mesh} m @param {ReadonlyArray<V3>} path @param {number} halfW @param {number} halfH @param {V3} [refUp] @returns {void}
 */
export function addTube(m, path, halfW, halfH, refUp) {
  const n = path.length;
  if (n < 2) return;
  const ref = refUp || [0, 1, 0];
  /** @type {V3[][]} four corners (BL, BR, TR, TL) per station */
  const rings = [];
  for (let i = 0; i < n; i++) {
    const prev = path[i === 0 ? 0 : i - 1];
    const next = path[i === n - 1 ? n - 1 : i + 1];
    let t = norm3(sub3(next, prev));
    if (t[0] === 0 && t[1] === 0 && t[2] === 0) t = [0, 1, 0];
    // choose a reference not parallel to the tangent
    let r = ref;
    const dot = t[0] * r[0] + t[1] * r[1] + t[2] * r[2];
    if (dot > 0.999 || dot < -0.999) r = [1, 0, 0];
    const side = norm3(cross3(t, r));
    const up = norm3(cross3(side, t));
    const c = path[i];
    /** @param {number} sw @param {number} sh @returns {V3} */
    const corner = (sw, sh) => [
      c[0] + side[0] * sw * halfW + up[0] * sh * halfH,
      c[1] + side[1] * sw * halfW + up[1] * sh * halfH,
      c[2] + side[2] * sw * halfW + up[2] * sh * halfH,
    ];
    rings.push([corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)]);
  }
  for (let i = 0; i < n - 1; i++) {
    const a = rings[i], b = rings[i + 1];
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4;
      addQuad(m, a[k], a[k2], b[k2], b[k]); // tube wall
    }
  }
  const s = rings[0], e = rings[n - 1];
  addQuad(m, s[0], s[3], s[2], s[1]); // start cap (facing back along the path)
  addQuad(m, e[0], e[1], e[2], e[3]); // end cap (facing forward)
}

/**
 * A tapered square spire: a base square (side 2*baseHalf, centred at baseCenter in x/z, at height
 * baseY) rising to a single apex point. Four triangles + a bottom quad = a closed pyramid. The
 * pier PINNACLE and the pier weathering CAP are spires.
 * @param {Mesh} m @param {number} cx @param {number} cz @param {number} baseHalf @param {number} baseY @param {number} apexY @param {number} [apexCx] @param {number} [apexCz] @returns {void}
 */
export function addSpire(m, cx, cz, baseHalf, baseY, apexY, apexCx, apexCz) {
  const ax = apexCx === undefined ? cx : apexCx;
  const az = apexCz === undefined ? cz : apexCz;
  /** @type {V3} */ const apex = [ax, apexY, az];
  /** @type {V3[]} base corners CCW seen from above */
  const b = [
    [cx - baseHalf, baseY, cz - baseHalf],
    [cx + baseHalf, baseY, cz - baseHalf],
    [cx + baseHalf, baseY, cz + baseHalf],
    [cx - baseHalf, baseY, cz + baseHalf],
  ];
  for (let i = 0; i < 4; i++) addTri(m, b[i], b[(i + 1) % 4], apex);
  addQuad(m, b[0], b[3], b[2], b[1]); // bottom
}

/**
 * Freeze the mutable accumulator into typed geometry arrays + the derived POSITION bounds (the
 * GLB accessor needs the exact float32 min/max). Positions are already float32-baked, so the
 * bounds are exact. @param {Mesh} m
 * @returns {{ positions: Float32Array, normals: Float32Array, indices: Uint32Array, vertexCount: number, triangleCount: number, min: V3, max: V3 }}
 */
export function finalizeMesh(m) {
  const positions = Float32Array.from(m.positions);
  const normals = Float32Array.from(m.normals);
  const indices = Uint32Array.from(m.indices);
  /** @type {V3} */ const min = [Infinity, Infinity, Infinity];
  /** @type {V3} */ const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < positions.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const v = positions[i + k];
      if (v < min[k]) min[k] = v;
      if (v > max[k]) max[k] = v;
    }
  }
  return {
    positions, normals, indices,
    vertexCount: positions.length / 3,
    triangleCount: indices.length / 3,
    min, max,
  };
}
