/**
 * Renderer-neutral mesh construction primitives for TownScene geometry.
 *
 * Faces are flat-shaded for the illustrated-diorama look. Crease extraction
 * welds coincident positions conceptually, then retains only true boundaries or
 * normal discontinuities—never the arbitrary diagonal used to triangulate a
 * planar quad.
 */

/**
 * @typedef {[number, number, number]} SceneV3
 * @typedef {{ role: string, start: number, count: number }} SceneRoleRange
 * @typedef {{ semanticId: string, start: number, count: number }} SceneSemanticRange
 * @typedef {{ semanticId: string, position: number[] }} SceneSemanticCenter
 * @typedef {{
 *   positions: number[],
 *   normals: number[],
 *   indices: number[],
 *   ao: number[],
 *   semanticRanges: SceneSemanticRange[],
 *   semanticCenters: SceneSemanticCenter[],
 *   roleRanges: SceneRoleRange[],
 * }} SceneMeshBuilder
 */

/** @param {unknown} value @returns {Record<string, unknown>} */
export function geometryRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @param {number} [fallback] */
export function geometryNumber(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** @param {number} value @param {number} lo @param {number} hi */
export function clampGeometryNumber(value, lo, hi) {
  return value < lo ? lo : value > hi ? hi : value;
}

/** @param {string} a @param {string} b */
export function compareGeometryCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @returns {SceneMeshBuilder} */
export function createSceneMeshBuilder() {
  return {
    positions: [],
    normals: [],
    indices: [],
    ao: [],
    semanticRanges: [],
    semanticCenters: [],
    roleRanges: [],
  };
}

/** @param {SceneV3} a @param {SceneV3} b @param {SceneV3} c @returns {SceneV3} */
function faceNormal(a, b, c) {
  const ux = b[0] - a[0];
  const uy = b[1] - a[1];
  const uz = b[2] - a[2];
  const vx = c[0] - a[0];
  const vy = c[1] - a[1];
  const vz = c[2] - a[2];
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const magnitude = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
  return [nx / magnitude, ny / magnitude, nz / magnitude];
}

/** Append or extend one contiguous index range for a semantic material role. */
/**
 * @param {SceneMeshBuilder} builder
 * @param {string|null} role
 * @param {number} start
 * @param {number} count
 */
function recordRoleRange(builder, role, start, count) {
  if (!role || count <= 0) return;
  const last = builder.roleRanges[builder.roleRanges.length - 1];
  if (last && last.role === role && last.start + last.count === start) {
    last.count += count;
    return;
  }
  builder.roleRanges.push({ role, start, count });
}

/**
 * Add a flat-shaded quad. Four vertices are intentional: adjacent faces retain
 * distinct normals, while topology-aware crease extraction welds by position.
 *
 * @param {SceneMeshBuilder} builder
 * @param {SceneV3} a
 * @param {SceneV3} b
 * @param {SceneV3} c
 * @param {SceneV3} d
 * @param {number} [ao]
 * @param {string|null} [role]
 */
export function addSceneQuad(builder, a, b, c, d, ao = 1, role = null) {
  const normal = faceNormal(a, b, c);
  const base = builder.positions.length / 3;
  const start = builder.indices.length;
  for (const point of [a, b, c, d]) {
    builder.positions.push(point[0], point[1], point[2]);
    builder.normals.push(normal[0], normal[1], normal[2]);
    builder.ao.push(ao);
  }
  builder.indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  recordRoleRange(builder, role, start, builder.indices.length - start);
}

/**
 * @param {SceneMeshBuilder} builder
 * @param {SceneV3} a
 * @param {SceneV3} b
 * @param {SceneV3} c
 * @param {number} [ao]
 * @param {string|null} [role]
 */
export function addSceneTriangle(builder, a, b, c, ao = 1, role = null) {
  const normal = faceNormal(a, b, c);
  const base = builder.positions.length / 3;
  const start = builder.indices.length;
  for (const point of [a, b, c]) {
    builder.positions.push(point[0], point[1], point[2]);
    builder.normals.push(normal[0], normal[1], normal[2]);
    builder.ao.push(ao);
  }
  builder.indices.push(base, base + 1, base + 2);
  recordRoleRange(builder, role, start, builder.indices.length - start);
}

/** Closed axis-aligned box. */
/**
 * @param {SceneMeshBuilder} builder
 * @param {number} x0
 * @param {number} x1
 * @param {number} y0
 * @param {number} y1
 * @param {number} z0
 * @param {number} z1
 * @param {string|null} [role]
 */
export function addSceneBox(
  builder,
  x0,
  x1,
  y0,
  y1,
  z0,
  z1,
  role = 'structure',
) {
  const p000 = /** @type {SceneV3} */ ([x0, y0, z0]);
  const p100 = /** @type {SceneV3} */ ([x1, y0, z0]);
  const p110 = /** @type {SceneV3} */ ([x1, y1, z0]);
  const p010 = /** @type {SceneV3} */ ([x0, y1, z0]);
  const p001 = /** @type {SceneV3} */ ([x0, y0, z1]);
  const p101 = /** @type {SceneV3} */ ([x1, y0, z1]);
  const p111 = /** @type {SceneV3} */ ([x1, y1, z1]);
  const p011 = /** @type {SceneV3} */ ([x0, y1, z1]);
  addSceneQuad(builder, p000, p010, p110, p100, 0.82, role);
  addSceneQuad(builder, p101, p111, p011, p001, 0.82, role);
  addSceneQuad(builder, p001, p011, p010, p000, 0.88, role);
  addSceneQuad(builder, p100, p110, p111, p101, 0.88, role);
  addSceneQuad(builder, p010, p011, p111, p110, 1, role);
  addSceneQuad(builder, p001, p000, p100, p101, 0.74, role);
}

/** Closed rectangular prism aligned to a plan-space segment. */
/**
 * @param {SceneMeshBuilder} builder
 * @param {[number, number]} a
 * @param {[number, number]} b
 * @param {number} halfWidth
 * @param {number} baseY
 * @param {number} topY
 * @param {number} planUnitCm
 * @param {string|null} [role]
 */
export function addSceneSegmentPrism(
  builder,
  a,
  b,
  halfWidth,
  baseY,
  topY,
  planUnitCm,
  role = null,
) {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const magnitude = Math.sqrt(dx * dx + dz * dz) || 1;
  const ox = (-dz / magnitude) * halfWidth;
  const oz = (dx / magnitude) * halfWidth;
  const p0 = /** @type {SceneV3} */ ([
    (a[0] - ox) * planUnitCm,
    baseY,
    (a[1] - oz) * planUnitCm,
  ]);
  const p1 = /** @type {SceneV3} */ ([
    (b[0] - ox) * planUnitCm,
    baseY,
    (b[1] - oz) * planUnitCm,
  ]);
  const p2 = /** @type {SceneV3} */ ([
    (b[0] + ox) * planUnitCm,
    baseY,
    (b[1] + oz) * planUnitCm,
  ]);
  const p3 = /** @type {SceneV3} */ ([
    (a[0] + ox) * planUnitCm,
    baseY,
    (a[1] + oz) * planUnitCm,
  ]);
  const q0 = /** @type {SceneV3} */ ([p0[0], topY, p0[2]]);
  const q1 = /** @type {SceneV3} */ ([p1[0], topY, p1[2]]);
  const q2 = /** @type {SceneV3} */ ([p2[0], topY, p2[2]]);
  const q3 = /** @type {SceneV3} */ ([p3[0], topY, p3[2]]);
  addSceneQuad(builder, p0, p1, q1, q0, 0.82, role);
  addSceneQuad(builder, p1, p2, q2, q1, 0.82, role);
  addSceneQuad(builder, p2, p3, q3, q2, 0.82, role);
  addSceneQuad(builder, p3, p0, q0, q3, 0.82, role);
  addSceneQuad(builder, q0, q1, q2, q3, 1, role);
  addSceneQuad(builder, p3, p2, p1, p0, 0.72, role);
}

/** Gabled roof over a normalized rectangle. */
/**
 * @param {SceneMeshBuilder} builder
 * @param {number} x0
 * @param {number} x1
 * @param {number} y0
 * @param {number} y1
 * @param {number} z0
 * @param {number} z1
 */
export function addSceneGableRoof(builder, x0, x1, y0, y1, z0, z1) {
  const midZ = (z0 + z1) / 2;
  addSceneQuad(
    builder,
    [x0, y0, z0],
    [x1, y0, z0],
    [x1, y1, midZ],
    [x0, y1, midZ],
    1,
    'roof',
  );
  addSceneQuad(
    builder,
    [x0, y1, midZ],
    [x1, y1, midZ],
    [x1, y0, z1],
    [x0, y0, z1],
    1,
    'roof',
  );
  addSceneTriangle(
    builder,
    [x0, y0, z1],
    [x0, y1, midZ],
    [x0, y0, z0],
    0.9,
    'detail',
  );
  addSceneTriangle(
    builder,
    [x1, y0, z0],
    [x1, y1, midZ],
    [x1, y0, z1],
    0.9,
    'detail',
  );
}

/** Hip/spire roof as a closed four-sided pyramid. */
/**
 * @param {SceneMeshBuilder} builder
 * @param {number} x0
 * @param {number} x1
 * @param {number} y0
 * @param {number} y1
 * @param {number} z0
 * @param {number} z1
 */
export function addScenePyramidRoof(builder, x0, x1, y0, y1, z0, z1) {
  const apex = /** @type {SceneV3} */ ([(x0 + x1) / 2, y1, (z0 + z1) / 2]);
  addSceneTriangle(builder, [x0, y0, z0], [x1, y0, z0], apex, 1, 'roof');
  addSceneTriangle(builder, [x1, y0, z0], [x1, y0, z1], apex, 1, 'roof');
  addSceneTriangle(builder, [x1, y0, z1], [x0, y0, z1], apex, 1, 'roof');
  addSceneTriangle(builder, [x0, y0, z1], [x0, y0, z0], apex, 1, 'roof');
}

/** @param {number[]|Float32Array} positions @param {number} index */
function positionKey(positions, index) {
  const offset = index * 3;
  const values = positions.slice(offset, offset + 3).map((value) => (
    Object.is(value, -0) ? 0 : value
  ));
  return values.join(',');
}

/**
 * Weld-by-position topology analysis. A planar quad diagonal has two adjacent
 * faces with identical normals and is omitted; silhouettes and real folds stay.
 *
 * @param {number[]|Float32Array} positions
 * @param {number[]|Uint32Array} indices
 */
function topologyCreaseEdges(positions, indices) {
  /** @type {Map<string, { indices: number[], normals: SceneV3[] }>} */
  const edges = new Map();
  for (let i = 0; i < indices.length; i += 3) {
    const tri = [indices[i], indices[i + 1], indices[i + 2]];
    const points = tri.map((index) => {
      const offset = index * 3;
      return /** @type {SceneV3} */ ([
        positions[offset],
        positions[offset + 1],
        positions[offset + 2],
      ]);
    });
    const normal = faceNormal(points[0], points[1], points[2]);
    for (let edgeIndex = 0; edgeIndex < 3; edgeIndex++) {
      const a = tri[edgeIndex];
      const b = tri[(edgeIndex + 1) % 3];
      const aKey = positionKey(positions, a);
      const bKey = positionKey(positions, b);
      const forward = aKey < bKey;
      const key = forward ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
      const row = edges.get(key) || {
        indices: forward ? [a, b] : [b, a],
        normals: [],
      };
      row.normals.push(normal);
      edges.set(key, row);
    }
  }
  /** @type {number[]} */
  const result = [];
  for (const key of [...edges.keys()].sort(compareGeometryCodepoint)) {
    const edge = edges.get(key);
    if (!edge) continue;
    let crease = edge.normals.length === 1;
    for (let i = 0; !crease && i < edge.normals.length; i++) {
      for (let j = i + 1; j < edge.normals.length; j++) {
        const a = edge.normals[i];
        const b = edge.normals[j];
        const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        if (dot < 0.985) {
          crease = true;
          break;
        }
      }
    }
    if (crease) result.push(edge.indices[0], edge.indices[1]);
  }
  return Uint32Array.from(result);
}

/** Finalize a builder to transfer-friendly arrays and picking metadata. */
/**
 * @param {SceneMeshBuilder} builder
 * @param {{ id: string, kind: string, materialId?: string|null, lod?: number|null }} meta
 */
export function finishSceneMesh(builder, meta) {
  const indices = Uint32Array.from(builder.indices);
  const positions = Float32Array.from(builder.positions);
  return {
    id: meta.id,
    kind: meta.kind,
    materialId: meta.materialId || null,
    lod: Number.isInteger(meta.lod) ? meta.lod : null,
    positions,
    normals: Float32Array.from(builder.normals),
    indices,
    ao: Float32Array.from(builder.ao),
    creaseEdges: topologyCreaseEdges(positions, indices),
    semanticRanges: builder.semanticRanges,
    semanticCenters: builder.semanticCenters,
    roleRanges: builder.roleRanges,
  };
}

/** Heightfield sample in centimeters at a manifest plan coordinate. */
/**
 * @param {{ gridSize?: unknown, heights?: unknown, heightUnitCm?: unknown }} terrain
 * @param {number} x
 * @param {number} z
 */
export function geometryTerrainHeightCmAt(terrain, x, z) {
  const gridSize = Math.max(2, Math.round(geometryNumber(terrain.gridSize, 33)));
  const heights = Array.isArray(terrain.heights) ? terrain.heights : [];
  const gx = clampGeometryNumber(
    Math.round((x / 1000) * (gridSize - 1)),
    0,
    gridSize - 1,
  );
  const gz = clampGeometryNumber(
    Math.round((z / 1000) * (gridSize - 1)),
    0,
    gridSize - 1,
  );
  return geometryNumber(heights[gz * gridSize + gx])
    * geometryNumber(terrain.heightUnitCm, 25);
}
