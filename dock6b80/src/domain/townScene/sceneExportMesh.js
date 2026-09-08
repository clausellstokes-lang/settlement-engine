/**
 * Expand a TownSceneGeometryBundle into one deterministic export mesh.
 *
 * The live viewer keeps reusable templates instanced on the GPU. Portable GLB
 * and the CPU portrait renderer instead need one renderer-neutral triangle
 * stream. This adapter performs that lowering without consulting Three, the
 * DOM, a clock, or ambient randomness. It also preserves the material and
 * semantic identity of every triangle for downstream exporters.
 */

import { assertTownSceneManifest } from './manifestContract.js';
import { clamp } from '../../kernel/math.js';
import {
  townSceneConditionTint,
  townSceneLivingMarkerKind,
  townSceneLivingMaterialId,
} from './sceneLivingPresentation.js';
import { sceneDigest } from './stableScene.js';

/**
 * @typedef {Record<string, unknown>} SceneExportRecord
 * @typedef {{
 *   position: number[],
 *   scale: number[],
 *   cos: number,
 *   sin: number,
 * }} SceneInstanceTransform
 * @typedef {{
 *   kind: 'TownSceneExportMesh',
 *   manifestDigest: string,
 *   lod: number,
 *   vertexCount: number,
 *   positions: Float32Array,
 *   normals: Float32Array,
 *   indices: Uint32Array,
 *   ao: Float32Array,
 *   tints: Float32Array,
 *   creaseEdges: Uint32Array,
 *   triangleMaterialIds: string[],
 *   triangleSemanticIds: string[],
 *   triangleLivingKinds: string[],
 *   min: number[],
 *   max: number[],
 * }} TownSceneExportMesh
 */

// Literal sine/cosine pairs for the manifest's sixteen allowed headings. The
// values are authored constants, not runtime trig, so exported bytes are stable
// across engines. Each pair is [cos(theta), sin(theta)].
const HEADING_BASIS_16 = Object.freeze([
  [1, 0],
  [0.9238795325112867, 0.3826834323650898],
  [0.7071067811865476, 0.7071067811865476],
  [0.3826834323650898, 0.9238795325112867],
  [0, 1],
  [-0.3826834323650898, 0.9238795325112867],
  [-0.7071067811865476, 0.7071067811865476],
  [-0.9238795325112867, 0.3826834323650898],
  [-1, 0],
  [-0.9238795325112867, -0.3826834323650898],
  [-0.7071067811865476, -0.7071067811865476],
  [-0.3826834323650898, -0.9238795325112867],
  [0, -1],
  [0.3826834323650898, -0.9238795325112867],
  [0.7071067811865476, -0.7071067811865476],
  [0.9238795325112867, -0.3826834323650898],
]);

/** @param {unknown} value @returns {SceneExportRecord} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {SceneExportRecord} */ (value)
    : {};
}

/** @param {unknown} value @param {number} [fallback] */
function finite(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** @param {string} a @param {string} b */
function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {unknown} value @returns {Float32Array} */
function float32Array(value) {
  if (value instanceof Float32Array) return value;
  return Float32Array.from(Array.isArray(value) ? value : []);
}

/** @param {unknown} value @returns {Uint32Array} */
function uint32Array(value) {
  if (value instanceof Uint32Array) return value;
  return Uint32Array.from(Array.isArray(value) ? value : []);
}

/**
 * @param {Map<string, SceneExportRecord>} materialsById
 * @param {string} fallbackMaterialId
 * @param {SceneExportRecord} range
 * @returns {string}
 */
function resolveRoleMaterial(materialsById, fallbackMaterialId, range) {
  if (typeof range.materialId === 'string' && range.materialId) return range.materialId;
  const definition = materialsById.get(fallbackMaterialId);
  const assignments = /** @type {SceneExportRecord[]} */ (
    Array.isArray(definition?.roleAssignments) ? definition.roleAssignments : []
  );
  const assignment = assignments.length
    ? assignments.find((candidate) => candidate.role === range.role)
    : null;
  // A role only selects a different material when the canonical skin says so.
  // Non-skin templates (notably vegetation) retain their base material.
  return /** @type {string} */ (assignment?.materialId) || fallbackMaterialId;
}

/**
 * @param {SceneExportRecord} instance
 * @param {Map<string, SceneExportRecord>} templatesById
 * @param {number} lod
 * @returns {SceneExportRecord | null}
 */
function templateForInstance(instance, templatesById, lod) {
  const ids = /** @type {Record<string, string>} */ (
    record(instance.templateIdsByLod)
  );
  const available = Object.keys(ids)
    .map(Number)
    .filter((value) => Number.isInteger(value) && templatesById.has(ids[value]))
    .sort((a, b) => a - b);
  if (!available.length) {
    return templatesById.get(/** @type {string} */ (instance.templateId)) || null;
  }
  const atOrBelow = available.filter((value) => value <= lod);
  const chosen = atOrBelow.length ? atOrBelow[atOrBelow.length - 1] : available[0];
  return templatesById.get(ids[chosen]) || null;
}

/**
 * @param {SceneExportRecord} instance
 * @returns {SceneInstanceTransform}
 */
function transformForInstance(instance) {
  const position = Array.isArray(instance.position) ? instance.position : [0, 0, 0];
  const scale = Array.isArray(instance.scale) ? instance.scale : [1, 1, 1];
  const heading = ((Math.trunc(finite(instance.yawStep)) % 16) + 16) % 16;
  const [cos, sin] = HEADING_BASIS_16[heading];
  return {
    position: [finite(position[0]), finite(position[1]), finite(position[2])],
    scale: [
      Math.max(0.000001, Math.abs(finite(scale[0], 1))),
      Math.max(0.000001, Math.abs(finite(scale[1], 1))),
      Math.max(0.000001, Math.abs(finite(scale[2], 1))),
    ],
    cos,
    sin,
  };
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {SceneInstanceTransform} transform
 * @returns {number[]}
 */
function transformPosition(x, y, z, transform) {
  const sx = x * transform.scale[0];
  const sy = y * transform.scale[1];
  const sz = z * transform.scale[2];
  return [
    transform.position[0] + transform.cos * sx + transform.sin * sz,
    transform.position[1] + sy,
    transform.position[2] - transform.sin * sx + transform.cos * sz,
  ];
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {SceneInstanceTransform} transform
 * @returns {number[]}
 */
function transformNormal(x, y, z, transform) {
  const sx = x / transform.scale[0];
  const sy = y / transform.scale[1];
  const sz = z / transform.scale[2];
  const rx = transform.cos * sx + transform.sin * sz;
  const rz = -transform.sin * sx + transform.cos * sz;
  const magnitude = Math.sqrt(rx * rx + sy * sy + rz * rz) || 1;
  return [rx / magnitude, sy / magnitude, rz / magnitude];
}

/**
 * Small renderer-neutral mesh builder for semantic living markers. Shapes are
 * intentionally low-poly and silhouette-led: their meaning must survive
 * grayscale printing and material substitution.
 */
function markerMeshBuilder() {
  return {
    positions: /** @type {number[]} */ ([]),
    normals: /** @type {number[]} */ ([]),
    indices: /** @type {number[]} */ ([]),
    ao: /** @type {number[]} */ ([]),
    creaseEdges: /** @type {number[]} */ ([]),
  };
}

/**
 * Append an axis-aligned cuboid, optionally yawed by one eighth-turn. Vertices
 * are duplicated per face so normals remain crisp in both CPU and GLB exports.
 *
 * @param {ReturnType<typeof markerMeshBuilder>} mesh
 * @param {[number, number, number]} center
 * @param {[number, number, number]} size
 * @param {-1|0|1} [diagonal]
 */
function appendMarkerBox(mesh, center, size, diagonal = 0) {
  const half = size.map((value) => value / 2);
  const rootHalf = 0.7071067811865476;
  const cos = diagonal === 0 ? 1 : rootHalf;
  const sin = diagonal * rootHalf;
  const faces = [
    { normal: [0, 0, 1], points: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]] },
    { normal: [0, 0, -1], points: [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]] },
    { normal: [1, 0, 0], points: [[1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1]] },
    { normal: [-1, 0, 0], points: [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]] },
    { normal: [0, 1, 0], points: [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]] },
    { normal: [0, -1, 0], points: [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]] },
  ];
  for (const face of faces) {
    const offset = mesh.positions.length / 3;
    for (const point of face.points) {
      const localX = point[0] * half[0];
      const localZ = point[2] * half[2];
      mesh.positions.push(
        center[0] + cos * localX + sin * localZ,
        center[1] + point[1] * half[1],
        center[2] - sin * localX + cos * localZ,
      );
      const nx = face.normal[0];
      const nz = face.normal[2];
      mesh.normals.push(
        cos * nx + sin * nz,
        face.normal[1],
        -sin * nx + cos * nz,
      );
      mesh.ao.push(1);
    }
    mesh.indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
    mesh.creaseEdges.push(
      offset, offset + 1,
      offset + 1, offset + 2,
      offset + 2, offset + 3,
      offset + 3, offset,
    );
  }
}

/**
 * @param {ReturnType<typeof markerMeshBuilder>} mesh
 * @param {'diamond'|'pyramid'} kind
 */
function appendPointMarker(mesh, kind) {
  const points = kind === 'diamond'
    ? [
      [0, 1, 0],
      [0, -1, 0],
      [-0.78, 0, 0],
      [0.78, 0, 0],
      [0, 0, -0.78],
      [0, 0, 0.78],
    ]
    : [
      [-0.78, -0.7, -0.78],
      [0.78, -0.7, -0.78],
      [0.78, -0.7, 0.78],
      [-0.78, -0.7, 0.78],
      [0, 1, 0],
    ];
  const faces = kind === 'diamond'
    ? [
      [0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2],
      [1, 4, 2], [1, 3, 4], [1, 5, 3], [1, 2, 5],
    ]
    : [
      [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4],
      [0, 3, 2], [0, 2, 1],
    ];
  for (const face of faces) {
    const offset = mesh.positions.length / 3;
    const a = points[face[0]];
    const b = points[face[1]];
    const c = points[face[2]];
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const normal = [
      ab[1] * ac[2] - ab[2] * ac[1],
      ab[2] * ac[0] - ab[0] * ac[2],
      ab[0] * ac[1] - ab[1] * ac[0],
    ];
    const magnitude = Math.sqrt(
      normal[0] * normal[0]
      + normal[1] * normal[1]
      + normal[2] * normal[2],
    ) || 1;
    for (const point of [a, b, c]) {
      mesh.positions.push(...point);
      mesh.normals.push(
        normal[0] / magnitude,
        normal[1] / magnitude,
        normal[2] / magnitude,
      );
      mesh.ao.push(1);
    }
    mesh.indices.push(offset, offset + 1, offset + 2);
    mesh.creaseEdges.push(
      offset, offset + 1,
      offset + 1, offset + 2,
      offset + 2, offset,
    );
  }
}

/** @param {string} markerKind */
function livingMarkerMesh(markerKind) {
  const mesh = markerMeshBuilder();
  if (markerKind === 'condition') appendPointMarker(mesh, 'diamond');
  else if (markerKind === 'hazard') appendPointMarker(mesh, 'pyramid');
  else if (markerKind === 'fire') {
    appendMarkerBox(mesh, [0, 0.15, 0], [0.32, 2.2, 0.32], 1);
    appendMarkerBox(mesh, [-0.42, -0.18, 0], [0.26, 1.35, 0.28], -1);
    appendMarkerBox(mesh, [0.42, -0.28, 0], [0.24, 1.05, 0.28], 1);
  } else if (markerKind === 'flood') {
    appendMarkerBox(mesh, [-0.18, -0.48, 0], [1.65, 0.16, 0.30]);
    appendMarkerBox(mesh, [0.18, 0, 0], [1.65, 0.16, 0.30]);
    appendMarkerBox(mesh, [-0.18, 0.48, 0], [1.65, 0.16, 0.30]);
  } else if (markerKind === 'plague') {
    appendPointMarker(mesh, 'diamond');
    appendMarkerBox(mesh, [0, 0, 0], [2.05, 0.16, 0.20], 1);
    appendMarkerBox(mesh, [0, 0, 0], [2.05, 0.16, 0.20], -1);
  } else if (markerKind === 'siege') {
    appendMarkerBox(mesh, [0, -0.25, 0], [1.9, 1.0, 0.42]);
    for (const x of [-0.7, 0, 0.7]) {
      appendMarkerBox(mesh, [x, 0.48, 0], [0.32, 0.58, 0.48]);
    }
  } else if (markerKind === 'occupation') {
    appendMarkerBox(mesh, [-0.52, 0, 0], [0.14, 2.6, 0.14]);
    appendMarkerBox(mesh, [0.05, 0.48, 0], [1.02, 0.72, 0.14]);
  } else if (markerKind === 'scar' || markerKind === 'abandonment') {
    appendMarkerBox(mesh, [0, 0, 0], [1.8, 0.22, 0.28], -1);
    appendMarkerBox(mesh, [0, 0, 0], [1.8, 0.22, 0.28], 1);
  } else if (markerKind === 'neglect') {
    appendMarkerBox(mesh, [0, -0.15, 0], [0.86, 1.7, 0.86], 1);
  } else if (markerKind === 'repair') {
    appendMarkerBox(mesh, [-0.5, 0, 0], [0.18, 2, 0.18]);
    appendMarkerBox(mesh, [0.5, 0, 0], [0.18, 2, 0.18]);
    appendMarkerBox(mesh, [0, 0.35, 0], [1.2, 0.16, 0.2]);
  } else {
    const posts = markerKind === 'construction'
      ? [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]]
      : [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]];
    for (const [x, z] of posts) appendMarkerBox(mesh, [x, 0, z], [0.16, 1.8, 0.16]);
    appendMarkerBox(mesh, [0, 0.6, 0], [1.4, 0.15, 0.18]);
    appendMarkerBox(mesh, [0, 0.6, 0], [0.18, 0.15, 1.4]);
  }
  return {
    ...mesh,
    roleRanges: [],
    semanticRanges: [],
  };
}

/**
 * Unit round join for a polyline water surface. The canonical water batch uses
 * one quad per segment; adding a disk only at each authored interior path point
 * closes the otherwise-visible butt-cap wedge without widening the river or
 * inventing a new course. PNG and GLB both consume this same export mesh.
 */
function waterSurfaceJoinMesh() {
  const mesh = markerMeshBuilder();
  mesh.positions.push(0, 0, 0);
  mesh.normals.push(0, 1, 0);
  mesh.ao.push(1);
  for (const [cos, sin] of HEADING_BASIS_16) {
    mesh.positions.push(cos, 0, sin);
    mesh.normals.push(0, 1, 0);
    mesh.ao.push(1);
  }
  for (let step = 0; step < HEADING_BASIS_16.length; step++) {
    const current = step + 1;
    const next = ((step + 1) % HEADING_BASIS_16.length) + 1;
    // Reverse ring order so the authored normal and triangle winding both face
    // upward in consumers that choose single-sided surface rendering.
    mesh.indices.push(0, next, current);
  }
  return {
    ...mesh,
    roleRanges: [],
    semanticRanges: [],
  };
}

/** @param {SceneExportRecord} living */
function livingRows(living) {
  return [
    ...(Array.isArray(living.conditions) ? living.conditions : [])
      .map((value) => ({ record: record(value), channel: /** @type {const} */ ('condition') })),
    ...(Array.isArray(living.scars) ? living.scars : [])
      .map((value) => ({ record: record(value), channel: /** @type {const} */ ('scar') })),
    ...(Array.isArray(living.reconstruction) ? living.reconstruction : [])
      .map((value) => ({ record: record(value), channel: /** @type {const} */ ('reconstruction') })),
  ];
}

/** @param {SceneExportRecord} row */
function targetSemanticIds(row) {
  return [
    ...(Array.isArray(row.buildingIds) ? row.buildingIds : []),
    row.buildingId,
    ...(Array.isArray(row.wallIds) ? row.wallIds : []),
    row.wallId,
    ...(Array.isArray(row.districtIds)
      ? row.districtIds.map((id) => `district:${id}`)
      : []),
    row.districtId ? `district:${row.districtId}` : null,
  ].filter((value) => typeof value === 'string' && value);
}

/**
 * @param {SceneExportRecord} manifest
 * @param {SceneExportRecord[]} instances
 * @param {number[]} fallbackCenter
 */
function semanticAnchorMap(manifest, instances, fallbackCenter) {
  /** @type {Map<string, number[]>} */
  const anchors = new Map();
  for (const instance of instances) {
    const semanticId = String(instance.semanticId || '');
    if (!semanticId) continue;
    const position = Array.isArray(instance.position) ? instance.position : fallbackCenter;
    const scale = Array.isArray(instance.scale) ? instance.scale : [1, 1, 1];
    anchors.set(semanticId, [
      finite(position[0]),
      finite(position[1]) + finite(scale[1], 1),
      finite(position[2]),
    ]);
  }
  const planUnitCm = Math.max(1, finite(record(manifest.space).planUnitCm, 1));
  for (const value of Array.isArray(manifest.districts) ? manifest.districts : []) {
    const district = record(value);
    const centroid = Array.isArray(district.centroid) ? district.centroid : [];
    anchors.set(`district:${String(district.id || '')}`, [
      finite(centroid[0]) * planUnitCm,
      finite(district.elevationCm),
      finite(centroid[1]) * planUnitCm,
    ]);
  }
  for (const value of Array.isArray(manifest.walls) ? manifest.walls : []) {
    const wall = record(value);
    const centerline = Array.isArray(wall.centerline) ? wall.centerline : [];
    const first = Array.isArray(centerline[0]) ? centerline[0] : [];
    const last = Array.isArray(centerline[centerline.length - 1])
      ? centerline[centerline.length - 1]
      : first;
    anchors.set(String(wall.id || ''), [
      (finite(first[0]) + finite(last[0])) * planUnitCm / 2,
      finite(wall.heightCm),
      (finite(first[1]) + finite(last[1])) * planUnitCm / 2,
    ]);
  }
  return anchors;
}

/**
 * @param {SceneExportRecord} row
 * @param {Map<string, number[]>} anchors
 * @param {number[]} fallbackCenter
 * @param {number} planUnitCm
 */
function livingMarkerOrigin(row, anchors, fallbackCenter, planUnitCm) {
  if (Array.isArray(row.position) && row.position.length >= 2) {
    return [
      finite(row.position[0]) * planUnitCm,
      fallbackCenter[1],
      finite(row.position[1]) * planUnitCm,
    ];
  }
  const targets = targetSemanticIds(row)
    .map((semanticId) => anchors.get(String(semanticId)))
    .filter((value) => Array.isArray(value));
  if (!targets.length) return fallbackCenter;
  return targets.reduce(
    (sum, value) => [
      sum[0] + value[0] / targets.length,
      sum[1] + value[1] / targets.length,
      sum[2] + value[2] / targets.length,
    ],
    [0, 0, 0],
  );
}

/**
 * @param {unknown} manifestValue
 * @param {unknown} bundleValue
 * @param {{ lod?: 0|1|2 }} [options]
 * @returns {TownSceneExportMesh}
 */
export function flattenTownSceneGeometry(manifestValue, bundleValue, options = {}) {
  const manifest = assertTownSceneManifest(manifestValue);
  const bundle = record(bundleValue);
  const manifestDigest = sceneDigest(manifest);
  if (bundle.kind !== 'TownSceneGeometryBundle') {
    throw new TypeError('TownScene export requires a TownSceneGeometryBundle');
  }
  if (bundle.manifestDigest !== manifestDigest) {
    throw new TypeError('TownScene export geometry does not match its manifest');
  }
  const lod = Math.max(0, Math.min(2, Math.trunc(finite(options.lod, 2))));
  const materialRows = /** @type {SceneExportRecord[]} */ (
    Array.isArray(manifest.materials) ? manifest.materials : []
  );
  /** @type {Map<string, SceneExportRecord>} */
  const materialsById = new Map(
    materialRows.map((material) => /** @type {[string, SceneExportRecord]} */ ([
      /** @type {string} */ (material.id),
      material,
    ])),
  );
  /** @type {Map<string, SceneExportRecord>} */
  const templatesById = new Map(
    (Array.isArray(bundle.templates) ? bundle.templates : [])
      .map(record)
      .map((template) => /** @type {[string, SceneExportRecord]} */ ([
        /** @type {string} */ (template.id),
        template,
      ])),
  );

  /** @type {number[]} */
  const positions = [];
  /** @type {number[]} */
  const normals = [];
  /** @type {number[]} */
  const indices = [];
  /** @type {number[]} */
  const ao = [];
  /** @type {number[]} */
  const tints = [];
  /** @type {number[]} */
  const creaseEdges = [];
  /** @type {string[]} */
  const triangleMaterialIds = [];
  /** @type {string[]} */
  const triangleSemanticIds = [];
  /** @type {string[]} */
  const triangleLivingKinds = [];
  /** @type {number[]} */
  const boundsMin = [Infinity, Infinity, Infinity];
  /** @type {number[]} */
  const boundsMax = [-Infinity, -Infinity, -Infinity];
  const planUnitCm = Math.max(1, finite(record(manifest.space).planUnitCm, 1));

  /**
   * @param {unknown} meshValue
   * @param {SceneInstanceTransform | null} transform
   * @param {string} materialId
   * @param {string} semanticId
   * @param {number[]} [tint]
   * @param {string} [livingKind]
   */
  const appendMesh = (
    meshValue,
    transform,
    materialId,
    semanticId,
    tint = [1, 1, 1],
    livingKind = '',
  ) => {
    const mesh = record(meshValue);
    const sourcePositions = float32Array(mesh.positions);
    const sourceNormals = float32Array(mesh.normals);
    const sourceIndices = uint32Array(mesh.indices);
    const sourceAo = float32Array(mesh.ao);
    const vertexOffset = positions.length / 3;
    for (let offset = 0; offset < sourcePositions.length; offset += 3) {
      const point = transform
        ? transformPosition(
          sourcePositions[offset],
          sourcePositions[offset + 1],
          sourcePositions[offset + 2],
          transform,
        )
        : [
          sourcePositions[offset],
          sourcePositions[offset + 1],
          sourcePositions[offset + 2],
        ];
      const normal = transform
        ? transformNormal(
          sourceNormals[offset],
          sourceNormals[offset + 1],
          sourceNormals[offset + 2],
          transform,
        )
        : [
          sourceNormals[offset],
          sourceNormals[offset + 1],
          sourceNormals[offset + 2],
        ];
      positions.push(point[0], point[1], point[2]);
      normals.push(normal[0], normal[1], normal[2]);
      ao.push(finite(sourceAo[offset / 3], 1));
      tints.push(
        clamp(finite(tint[0], 1), 0, 1),
        clamp(finite(tint[1], 1), 0, 1),
        clamp(finite(tint[2], 1), 0, 1),
      );
      for (let axis = 0; axis < 3; axis++) {
        boundsMin[axis] = Math.min(boundsMin[axis], point[axis]);
        boundsMax[axis] = Math.max(boundsMax[axis], point[axis]);
      }
    }
    for (const index of sourceIndices) indices.push(vertexOffset + index);
    for (const index of uint32Array(mesh.creaseEdges)) {
      creaseEdges.push(vertexOffset + index);
    }

    const triangleCount = Math.floor(sourceIndices.length / 3);
    const localMaterials = Array(triangleCount).fill(materialId);
    for (const rangeValue of Array.isArray(mesh.roleRanges) ? mesh.roleRanges : []) {
      const range = record(rangeValue);
      const resolved = resolveRoleMaterial(materialsById, materialId, range);
      const first = Math.max(0, Math.floor(finite(range.start) / 3));
      const end = Math.min(
        triangleCount,
        Math.ceil((finite(range.start) + finite(range.count)) / 3),
      );
      for (let triangle = first; triangle < end; triangle++) {
        localMaterials[triangle] = resolved;
      }
    }
    const localSemantics = Array(triangleCount).fill(semanticId || mesh.id || '');
    for (const rangeValue of Array.isArray(mesh.semanticRanges) ? mesh.semanticRanges : []) {
      const range = record(rangeValue);
      const first = Math.max(0, Math.floor(finite(range.start) / 3));
      const end = Math.min(
        triangleCount,
        Math.ceil((finite(range.start) + finite(range.count)) / 3),
      );
      for (let triangle = first; triangle < end; triangle++) {
        localSemantics[triangle] = String(range.semanticId || localSemantics[triangle]);
      }
    }
    triangleMaterialIds.push(...localMaterials);
    triangleSemanticIds.push(...localSemantics);
    triangleLivingKinds.push(...Array(triangleCount).fill(livingKind));
  };

  const batches = (Array.isArray(bundle.batches) ? bundle.batches : [])
    .map(record)
    .sort((a, b) => compareCodepoint(String(a.id), String(b.id)));
  for (const batch of batches) {
    appendMesh(batch, null, String(batch.materialId || 'material:ground'), String(batch.id));
  }
  const waterBatch = batches.find(
    (batch) => batch.kind === 'water'
      || String(batch.materialId || '') === 'material:water',
  );
  const waterPositions = float32Array(waterBatch?.positions);
  const waterElevationCm = waterPositions.length >= 2
    ? finite(waterPositions[1])
    : 0;
  const waterBodies = /** @type {SceneExportRecord[]} */ (
    Array.isArray(record(manifest.terrain).waterBodies)
      ? record(manifest.terrain).waterBodies
      : []
  );
  const joinMesh = waterSurfaceJoinMesh();
  for (const water of waterBodies) {
    const path = Array.isArray(water.path) ? water.path : [];
    const surfacePolygon = Array.isArray(water.surfacePolygon)
      ? water.surfacePolygon
      : [];
    if (path.length < 3 || surfacePolygon.length >= 3) continue;
    const radiusCm = clamp(
      finite(water.widthPlan, 1) * planUnitCm / 2,
      planUnitCm / 2,
      planUnitCm * 100,
    );
    for (let pointIndex = 1; pointIndex < path.length - 1; pointIndex++) {
      const point = Array.isArray(path[pointIndex]) ? path[pointIndex] : [];
      appendMesh(
        joinMesh,
        {
          position: [
            finite(point[0]) * planUnitCm,
            waterElevationCm,
            finite(point[1]) * planUnitCm,
          ],
          scale: [radiusCm, 1, radiusCm],
          cos: 1,
          sin: 0,
        },
        'material:water',
        String(water.id || 'water'),
      );
    }
  }

  const instances = (Array.isArray(bundle.instances) ? bundle.instances : [])
    .map(record)
    .sort((a, b) => compareCodepoint(String(a.id), String(b.id)));
  const conditionProfileBySemantic = new Map(
    (Array.isArray(manifest.buildings) ? manifest.buildings : [])
      .map(record)
      .map((building) => [
        String(building.semanticId || building.id || ''),
        building.conditionProfile,
      ]),
  );
  for (const instance of instances) {
    const template = templateForInstance(instance, templatesById, lod);
    if (!template) continue;
    const semanticId = String(instance.semanticId || instance.id || '');
    const tint = instance.kind === 'building'
      ? townSceneConditionTint(conditionProfileBySemantic.get(semanticId))
      : [1, 1, 1];
    appendMesh(
      template,
      transformForInstance(instance),
      String(instance.materialId || 'material:ground'),
      semanticId,
      tint,
    );
  }

  const geometryBounds = record(bundle.bounds);
  const bundleMinimum = Array.isArray(geometryBounds.min) ? geometryBounds.min : [0, 0, 0];
  const bundleMaximum = Array.isArray(geometryBounds.max) ? geometryBounds.max : [0, 0, 0];
  const fallbackCenter = Array.isArray(geometryBounds.center)
    ? geometryBounds.center.map((value) => finite(value))
    : [
      (finite(bundleMinimum[0]) + finite(bundleMaximum[0])) / 2,
      (finite(bundleMinimum[1]) + finite(bundleMaximum[1])) / 2,
      (finite(bundleMinimum[2]) + finite(bundleMaximum[2])) / 2,
    ];
  const spanX = finite(bundleMaximum[0]) - finite(bundleMinimum[0]);
  const spanY = finite(bundleMaximum[1]) - finite(bundleMinimum[1]);
  const spanZ = finite(bundleMaximum[2]) - finite(bundleMinimum[2]);
  const diagonal = Math.sqrt(
    spanX * spanX + spanY * spanY + spanZ * spanZ,
  );
  const markerSize = clamp(diagonal * 0.007, 36, 220);
  const anchors = semanticAnchorMap(manifest, instances, fallbackCenter);
  const living = record(manifest.living);
  const markers = livingRows(living)
    .sort((a, b) => compareCodepoint(String(a.record.id), String(b.record.id)));
  for (const marker of markers) {
    const semanticId = String(marker.record.id || '');
    if (!semanticId) continue;
    const markerKind = townSceneLivingMarkerKind(marker.record, marker.channel);
    const origin = livingMarkerOrigin(
      marker.record,
      anchors,
      fallbackCenter,
      planUnitCm,
    );
    const hash = Number.parseInt(sceneDigest({ semanticId }).slice(-8), 16) >>> 0;
    const [cos, sin] = HEADING_BASIS_16[hash % HEADING_BASIS_16.length];
    const radius = markerSize * (0.35 + ((hash >>> 4) % 4) * 0.16);
    const severity = clamp(finite(marker.record.severityPermille) / 1000, 0, 1);
    const scale = markerSize * (0.82 + severity * 0.38);
    appendMesh(
      livingMarkerMesh(markerKind),
      {
        position: [
          finite(origin[0]) + sin * radius,
          finite(origin[1]) + markerSize * 1.35,
          finite(origin[2]) + cos * radius,
        ],
        scale: [scale, scale, scale],
        cos,
        sin,
      },
      townSceneLivingMaterialId(markerKind),
      semanticId,
      [1, 1, 1],
      markerKind,
    );
  }

  const safeMin = boundsMin.map((value) => (Number.isFinite(value) ? value : 0));
  const safeMax = boundsMax.map((value) => (Number.isFinite(value) ? value : 0));
  return {
    kind: 'TownSceneExportMesh',
    manifestDigest,
    lod,
    vertexCount: positions.length / 3,
    positions: Float32Array.from(positions),
    normals: Float32Array.from(normals),
    indices: Uint32Array.from(indices),
    ao: Float32Array.from(ao),
    tints: Float32Array.from(tints),
    creaseEdges: Uint32Array.from(creaseEdges),
    triangleMaterialIds,
    triangleSemanticIds,
    triangleLivingKinds,
    min: safeMin,
    max: safeMax,
  };
}
