/**
 * Deterministic lowering from TownSceneManifest to transfer-ready geometry.
 *
 * The bundle remains renderer-neutral: consolidated semantic batches, reusable
 * LOD templates, instance transforms, topology-aware crease indices, material
 * role ranges, and explicit picking centers. No WebGL or Three.js dependency
 * crosses this worker/export seam.
 */

import { assertTownSceneManifest } from './manifestContract.js';
import {
  addSceneQuad,
  addSceneSegmentPrism,
  addSceneTriangle,
  clampGeometryNumber,
  compareGeometryCodepoint,
  createSceneMeshBuilder,
  finishSceneMesh,
  geometryNumber,
  geometryRecord,
  geometryTerrainHeightCmAt,
} from './sceneGeometryMesh.js';
import {
  buildingTemplate,
  vegetationTemplate,
} from './sceneGeometryTemplates.js';
import { sceneDigest } from './stableScene.js';

export const TOWN_SCENE_GEOMETRY_BUNDLE_VERSION = 1;

/**
 * @typedef {Record<string, unknown>} SceneGeometryManifest
 * @typedef {ReturnType<typeof createSceneMeshBuilder>} SceneGeometryBuilder
 * @typedef {ReturnType<typeof finishSceneMesh>} SceneGeometryMesh
 * @typedef {{
 *   id: string,
 *   position: number[],
 *   scale: number[],
 *   [key: string]: unknown,
 * }} SceneGeometryInstance
 */

/** Mean plan point of a path, suitable for picking focus. */
/**
 * @param {Array<[number, number]>} path
 * @param {number} elevationCm
 * @param {number} planUnitCm
 * @returns {number[]}
 */
function pathCenter(path, elevationCm, planUnitCm) {
  if (!path.length) return [0, elevationCm, 0];
  const sums = path.reduce(
    (value, point) => [value[0] + point[0], value[1] + point[1]],
    [0, 0],
  );
  return [
    (sums[0] / path.length) * planUnitCm,
    elevationCm,
    (sums[1] / path.length) * planUnitCm,
  ];
}

/** Terrain uses shared vertices and smooth finite-difference normals. */
/** @param {SceneGeometryManifest} manifest */
function terrainBatch(manifest) {
  const terrain = geometryRecord(manifest.terrain);
  const planUnitCm = geometryNumber(geometryRecord(manifest.space).planUnitCm, 30);
  const gridSize = Math.max(2, Math.round(geometryNumber(terrain.gridSize, 33)));
  const heights = Array.isArray(terrain.heights) ? terrain.heights : [];
  /** @type {number[]} */
  const positions = [];
  /** @type {number[]} */
  const normals = [];
  /** @type {number[]} */
  const ao = [];
  /** @type {number[]} */
  const indices = [];
  const stepCm = (1000 * planUnitCm) / (gridSize - 1);
  /** @param {number} x @param {number} z */
  const sample = (x, z) => geometryNumber(
    heights[
      clampGeometryNumber(z, 0, gridSize - 1) * gridSize
      + clampGeometryNumber(x, 0, gridSize - 1)
    ],
  ) * geometryNumber(terrain.heightUnitCm, 25);
  for (let z = 0; z < gridSize; z++) {
    for (let x = 0; x < gridSize; x++) {
      const y = sample(x, z);
      positions.push(x * stepCm, y, z * stepCm);
      const dx = sample(x - 1, z) - sample(x + 1, z);
      const dz = sample(x, z - 1) - sample(x, z + 1);
      const verticalSpanCm = stepCm * 2;
      const magnitude = Math.sqrt(
        dx * dx + verticalSpanCm * verticalSpanCm + dz * dz,
      ) || 1;
      normals.push(dx / magnitude, verticalSpanCm / magnitude, dz / magnitude);
      ao.push(1);
    }
  }
  for (let z = 0; z < gridSize - 1; z++) {
    for (let x = 0; x < gridSize - 1; x++) {
      const a = z * gridSize + x;
      const b = a + 1;
      const c = a + gridSize + 1;
      const d = a + gridSize;
      indices.push(a, d, c, a, c, b);
    }
  }
  return {
    id: 'batch:terrain',
    kind: 'terrain',
    materialId: String(terrain.materialId || 'material:ground'),
    lod: null,
    positions: Float32Array.from(positions),
    normals: Float32Array.from(normals),
    indices: Uint32Array.from(indices),
    ao: Float32Array.from(ao),
    creaseEdges: new Uint32Array(0),
    semanticRanges: [],
    semanticCenters: [],
    roleRanges: [],
  };
}

/** Add a horizontal ribbon around every centerline segment. */
/**
 * @param {SceneGeometryBuilder} builder
 * @param {Array<[number, number]>} path
 * @param {number} widthPlan
 * @param {number} planUnitCm
 * @param {(x: number, z: number) => number} elevationAt
 */
function addRibbon(builder, path, widthPlan, planUnitCm, elevationAt) {
  const half = widthPlan / 2;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const magnitude = Math.sqrt(dx * dx + dz * dz) || 1;
    const ox = (-dz / magnitude) * half;
    const oz = (dx / magnitude) * half;
    const ay = elevationAt(a[0], a[1]);
    const by = elevationAt(b[0], b[1]);
    addSceneQuad(
      builder,
      [(a[0] - ox) * planUnitCm, ay, (a[1] - oz) * planUnitCm],
      [(b[0] - ox) * planUnitCm, by, (b[1] - oz) * planUnitCm],
      [(b[0] + ox) * planUnitCm, by, (b[1] + oz) * planUnitCm],
      [(a[0] + ox) * planUnitCm, ay, (a[1] + oz) * planUnitCm],
      1,
    );
  }
}

/** Consolidated road ribbon batch. */
/** @param {SceneGeometryManifest} manifest */
function roadBatch(manifest) {
  const terrain = geometryRecord(manifest.terrain);
  const planUnitCm = geometryNumber(geometryRecord(manifest.space).planUnitCm, 30);
  const builder = createSceneMeshBuilder();
  const roads = Array.isArray(manifest.roads) ? manifest.roads.map(geometryRecord) : [];
  for (const road of roads) {
    const start = builder.indices.length;
    /** @type {Array<[number, number]>} */
    const path = Array.isArray(road.centerline)
      ? road.centerline.map((point) => [geometryNumber(point?.[0]), geometryNumber(point?.[1])])
      : [];
    const elevationOffset = geometryNumber(road.elevationOffsetCm, 3);
    addRibbon(
      builder,
      path,
      geometryNumber(road.widthPlan, 5),
      planUnitCm,
      (x, z) => geometryTerrainHeightCmAt(terrain, x, z) + elevationOffset,
    );
    const count = builder.indices.length - start;
    if (count > 0) {
      builder.semanticRanges.push({ semanticId: String(road.id), start, count });
      const center = pathCenter(path, 0, planUnitCm);
      center[1] = geometryTerrainHeightCmAt(
        terrain,
        center[0] / planUnitCm,
        center[2] / planUnitCm,
      ) + elevationOffset;
      builder.semanticCenters.push({ semanticId: String(road.id), position: center });
    }
  }
  return finishSceneMesh(builder, {
    id: 'batch:roads',
    kind: 'road',
    materialId: 'material:road',
  });
}

/** Add one upward-facing horizontal polygon as a triangle fan. */
/**
 * @param {SceneGeometryBuilder} builder
 * @param {Array<[number, number]>} polygon
 * @param {number} elevationCm
 * @param {number} planUnitCm
 */
function addHorizontalPolygon(builder, polygon, elevationCm, planUnitCm) {
  if (polygon.length < 3) return;
  const first = polygon[0];
  for (let i = 1; i < polygon.length - 1; i++) {
    const b = polygon[i];
    const c = polygon[i + 1];
    const signed = (b[0] - first[0]) * (c[1] - first[1])
      - (b[1] - first[1]) * (c[0] - first[0]);
    const p0 = /** @type {[number, number, number]} */ (
      [first[0] * planUnitCm, elevationCm, first[1] * planUnitCm]
    );
    const p1 = /** @type {[number, number, number]} */ (
      [b[0] * planUnitCm, elevationCm, b[1] * planUnitCm]
    );
    const p2 = /** @type {[number, number, number]} */ (
      [c[0] * planUnitCm, elevationCm, c[1] * planUnitCm]
    );
    if (signed <= 0) addSceneTriangle(builder, p0, p1, p2, 1);
    else addSceneTriangle(builder, p0, p2, p1, 1);
  }
}

/** Rivers are ribbons; coasts fill their canonical water-side polygon. */
/** @param {SceneGeometryManifest} manifest */
function waterBatch(manifest) {
  const terrain = geometryRecord(manifest.terrain);
  const planUnitCm = geometryNumber(geometryRecord(manifest.space).planUnitCm, 30);
  const builder = createSceneMeshBuilder();
  const waters = Array.isArray(terrain.waterBodies)
    ? terrain.waterBodies.map(geometryRecord)
    : [];
  for (const water of waters) {
    const start = builder.indices.length;
    /** @type {Array<[number, number]>} */
    const path = Array.isArray(water.path)
      ? water.path.map((point) => [geometryNumber(point?.[0]), geometryNumber(point?.[1])])
      : [];
    const elevationCm = geometryNumber(water.elevationCm);
    /** @type {Array<[number, number]>} */
    const surface = Array.isArray(water.surfacePolygon)
      ? water.surfacePolygon.map((point) => [geometryNumber(point?.[0]), geometryNumber(point?.[1])])
      : [];
    if (surface.length >= 3) {
      addHorizontalPolygon(builder, surface, elevationCm, planUnitCm);
    } else {
      addRibbon(
        builder,
        path,
        geometryNumber(water.widthPlan, 40),
        planUnitCm,
        () => elevationCm,
      );
    }
    const count = builder.indices.length - start;
    if (count > 0) {
      builder.semanticRanges.push({ semanticId: String(water.id), start, count });
      builder.semanticCenters.push({
        semanticId: String(water.id),
        position: pathCenter(surface.length ? surface : path, elevationCm, planUnitCm),
      });
    }
  }
  return finishSceneMesh(builder, {
    id: 'batch:water',
    kind: 'water',
    materialId: 'material:water',
  });
}

/**
 * @param {[number, number]} a
 * @param {[number, number]} b
 * @param {number} t
 * @returns {[number, number]}
 */
function pointAt(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
  ];
}

/**
 * @param {[number, number]} point
 * @param {[number, number]} a
 * @param {[number, number]} b
 */
function segmentParameter(point, a, b) {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const denominator = dx * dx + dz * dz;
  if (denominator <= 0) return 0;
  return clampGeometryNumber(
    ((point[0] - a[0]) * dx + (point[1] - a[1]) * dz) / denominator,
    0,
    1,
  );
}

/** Wall prisms with real gate openings cut from their host segments. */
/** @param {SceneGeometryManifest} manifest */
function wallBatch(manifest) {
  const terrain = geometryRecord(manifest.terrain);
  const planUnitCm = geometryNumber(geometryRecord(manifest.space).planUnitCm, 30);
  const builder = createSceneMeshBuilder();
  const gates = Array.isArray(manifest.gates) ? manifest.gates.map(geometryRecord) : [];
  /** @type {Map<unknown, Array<Record<string, unknown>>>} */
  const gatesByWall = new Map();
  for (const gate of gates) {
    const list = gatesByWall.get(gate.wallId) || [];
    list.push(gate);
    gatesByWall.set(gate.wallId, list);
  }
  const walls = Array.isArray(manifest.walls) ? manifest.walls.map(geometryRecord) : [];
  for (const wall of walls) {
    const line = Array.isArray(wall.centerline) ? wall.centerline : [];
    const a = /** @type {[number, number]} */ (
      Array.isArray(line[0]) ? line[0] : [0, 0]
    );
    const b = /** @type {[number, number]} */ (
      Array.isArray(line[1]) ? line[1] : [0, 0]
    );
    const dx = geometryNumber(b[0]) - geometryNumber(a[0]);
    const dz = geometryNumber(b[1]) - geometryNumber(a[1]);
    const lengthPlan = Math.sqrt(dx * dx + dz * dz) || 1;
    /** @type {Array<[number, number]>} */
    const intervals = [];
    for (const gate of gatesByWall.get(wall.id) || []) {
      const position = /** @type {[number, number]} */ (
        Array.isArray(gate.position) ? gate.position : [0, 0]
      );
      const center = segmentParameter(position, a, b);
      const half = geometryNumber(gate.openingWidthCm, 300)
        / planUnitCm
        / lengthPlan
        / 2;
      intervals.push([
        clampGeometryNumber(center - half, 0, 1),
        clampGeometryNumber(center + half, 0, 1),
      ]);
    }
    intervals.sort((left, right) => left[0] - right[0]);
    /** @type {Array<[number, number]>} */
    const pieces = [];
    let cursor = 0;
    for (const interval of intervals) {
      if (interval[0] > cursor) pieces.push([cursor, interval[0]]);
      cursor = Math.max(cursor, interval[1]);
    }
    if (cursor < 1) pieces.push([cursor, 1]);
    const baseY = Math.min(
      geometryTerrainHeightCmAt(terrain, geometryNumber(a[0]), geometryNumber(a[1])),
      geometryTerrainHeightCmAt(terrain, geometryNumber(b[0]), geometryNumber(b[1])),
    );
    const start = builder.indices.length;
    for (const piece of pieces) {
      if (piece[1] - piece[0] <= 0.001) continue;
      addSceneSegmentPrism(
        builder,
        pointAt(a, b, piece[0]),
        pointAt(a, b, piece[1]),
        geometryNumber(wall.widthCm, 120) / planUnitCm / 2,
        baseY,
        baseY + geometryNumber(wall.heightCm, 500),
        planUnitCm,
      );
    }
    const count = builder.indices.length - start;
    if (count > 0) builder.semanticRanges.push({ semanticId: String(wall.id), start, count });
    builder.semanticCenters.push({
      semanticId: String(wall.id),
      position: [
        ((geometryNumber(a[0]) + geometryNumber(b[0])) / 2) * planUnitCm,
        baseY + geometryNumber(wall.heightCm, 500) / 2,
        ((geometryNumber(a[1]) + geometryNumber(b[1])) / 2) * planUnitCm,
      ],
    });
  }
  return finishSceneMesh(builder, {
    id: 'batch:walls',
    kind: 'wall',
    materialId: 'material:wall',
  });
}

/** Gatehouses: paired towers and a lintel spanning the carved opening. */
/** @param {SceneGeometryManifest} manifest */
function gateBatch(manifest) {
  const terrain = geometryRecord(manifest.terrain);
  const planUnitCm = geometryNumber(geometryRecord(manifest.space).planUnitCm, 30);
  const builder = createSceneMeshBuilder();
  const wallById = new Map(
    (Array.isArray(manifest.walls) ? manifest.walls.map(geometryRecord) : [])
      .map((wall) => [wall.id, wall]),
  );
  const gates = Array.isArray(manifest.gates) ? manifest.gates.map(geometryRecord) : [];
  for (const gate of gates) {
    const wall = wallById.get(gate.wallId);
    const line = wall && Array.isArray(wall.centerline) ? wall.centerline : [];
    const a = /** @type {[number, number]} */ (
      Array.isArray(line[0]) ? line[0] : [0, 0]
    );
    const b = /** @type {[number, number]} */ (
      Array.isArray(line[1]) ? line[1] : [1, 0]
    );
    const position = /** @type {[number, number]} */ (
      Array.isArray(gate.position) ? gate.position : [0, 0]
    );
    const dx = geometryNumber(b[0]) - geometryNumber(a[0]);
    const dz = geometryNumber(b[1]) - geometryNumber(a[1]);
    const magnitude = Math.sqrt(dx * dx + dz * dz) || 1;
    const ux = dx / magnitude;
    const uz = dz / magnitude;
    const openHalf = geometryNumber(gate.openingWidthCm, 300) / planUnitCm / 2;
    const towerLength = geometryNumber(gate.towerWidthCm, 360) / planUnitCm;
    const leftOuter = /** @type {[number, number]} */ (
      [position[0] - ux * (openHalf + towerLength), position[1] - uz * (openHalf + towerLength)]
    );
    const leftInner = /** @type {[number, number]} */ (
      [position[0] - ux * openHalf, position[1] - uz * openHalf]
    );
    const rightInner = /** @type {[number, number]} */ (
      [position[0] + ux * openHalf, position[1] + uz * openHalf]
    );
    const rightOuter = /** @type {[number, number]} */ (
      [position[0] + ux * (openHalf + towerLength), position[1] + uz * (openHalf + towerLength)]
    );
    const baseY = geometryTerrainHeightCmAt(
      terrain,
      geometryNumber(position[0]),
      geometryNumber(position[1]),
    );
    const towerTop = baseY + geometryNumber(gate.towerHeightCm, 600);
    const halfDepth = Math.max(
      geometryNumber(wall?.widthCm, 140) / planUnitCm,
      towerLength * 0.42,
    );
    const start = builder.indices.length;
    addSceneSegmentPrism(builder, leftOuter, leftInner, halfDepth, baseY, towerTop, planUnitCm);
    addSceneSegmentPrism(builder, rightInner, rightOuter, halfDepth, baseY, towerTop, planUnitCm);
    addSceneSegmentPrism(
      builder,
      leftInner,
      rightInner,
      halfDepth * 0.75,
      baseY + geometryNumber(gate.openingHeightCm, 360),
      towerTop,
      planUnitCm,
    );
    builder.semanticRanges.push({
      semanticId: String(gate.id),
      start,
      count: builder.indices.length - start,
    });
    builder.semanticCenters.push({
      semanticId: String(gate.id),
      position: [
        geometryNumber(position[0]) * planUnitCm,
        baseY + geometryNumber(gate.openingHeightCm, 360) / 2,
        geometryNumber(position[1]) * planUnitCm,
      ],
    });
  }
  return finishSceneMesh(builder, {
    id: 'batch:gates',
    kind: 'gate',
    materialId: 'material:gate',
  });
}

/** Bridge and quay decks as shallow structural prisms. */
/**
 * @param {SceneGeometryManifest} manifest
 * @param {Array<Record<string, unknown>>} rows
 * @param {string} id
 * @param {string} kind
 * @param {string} materialId
 * @param {number} thicknessCm
 */
function deckBatch(manifest, rows, id, kind, materialId, thicknessCm) {
  const planUnitCm = geometryNumber(geometryRecord(manifest.space).planUnitCm, 30);
  const builder = createSceneMeshBuilder();
  for (const row of rows) {
    const path = /** @type {Array<[number, number]>} */ (
      Array.isArray(row.centerline) ? row.centerline : []
    );
    const elevation = geometryNumber(row.deckElevationCm, 40);
    const start = builder.indices.length;
    for (let i = 0; i < path.length - 1; i++) {
      addSceneSegmentPrism(
        builder,
        path[i],
        path[i + 1],
        geometryNumber(row.widthPlan, 8) / 2,
        elevation - thicknessCm,
        elevation,
        planUnitCm,
      );
    }
    const count = builder.indices.length - start;
    if (count > 0) builder.semanticRanges.push({ semanticId: String(row.id), start, count });
    builder.semanticCenters.push({
      semanticId: String(row.id),
      position: pathCenter(path, elevation, planUnitCm),
    });
  }
  return finishSceneMesh(builder, { id, kind, materialId });
}

/** Compute scene bounds including instances and elevated structures. */
/**
 * @param {SceneGeometryManifest} manifest
 * @param {SceneGeometryInstance[]} instances
 */
function sceneBounds(manifest, instances) {
  const terrain = geometryRecord(manifest.terrain);
  const planUnitCm = geometryNumber(geometryRecord(manifest.space).planUnitCm, 30);
  const heights = Array.isArray(terrain.heights) ? terrain.heights : [0];
  let minY = Infinity;
  let maxY = -Infinity;
  for (const height of heights) {
    const y = geometryNumber(height) * geometryNumber(terrain.heightUnitCm, 25);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  for (const instance of instances) {
    const position = Array.isArray(instance.position) ? instance.position : [0, 0, 0];
    const scale = Array.isArray(instance.scale) ? instance.scale : [0, 0, 0];
    minY = Math.min(minY, geometryNumber(position[1]));
    const featureHeadroom = instance.kind === 'building' ? 1.18 : 1;
    maxY = Math.max(
      maxY,
      geometryNumber(position[1]) + geometryNumber(scale[1]) * featureHeadroom,
    );
  }
  for (const wall of Array.isArray(manifest.walls) ? manifest.walls.map(geometryRecord) : []) {
    maxY = Math.max(maxY, geometryNumber(wall.heightCm));
  }
  for (const gate of Array.isArray(manifest.gates) ? manifest.gates.map(geometryRecord) : []) {
    maxY = Math.max(maxY, geometryNumber(gate.towerHeightCm));
  }
  if (!Number.isFinite(minY)) minY = 0;
  if (!Number.isFinite(maxY)) maxY = 0;
  return {
    min: [0, Math.floor(minY), 0],
    max: [1000 * planUnitCm, Math.ceil(maxY), 1000 * planUnitCm],
  };
}

/**
 * Compile a transfer-ready geometry bundle.
 * @param {unknown} manifestValue
 * @param {{ lodBias?: number, massingOnly?: boolean }} [options]
 */
export function compileTownSceneGeometry(manifestValue, options = {}) {
  const manifest = assertTownSceneManifest(manifestValue);
  const lodBias = clampGeometryNumber(Math.round(geometryNumber(options.lodBias)), -1, 2);
  const massingOnly = options.massingOnly === true;
  const terrain = geometryRecord(manifest.terrain);
  const planUnitCm = geometryNumber(geometryRecord(manifest.space).planUnitCm, 30);
  const bridges = Array.isArray(manifest.bridges) ? manifest.bridges.map(geometryRecord) : [];
  const quays = Array.isArray(manifest.quays) ? manifest.quays.map(geometryRecord) : [];
  const batches = [
    deckBatch(manifest, bridges, 'batch:bridges', 'bridge', 'material:bridge', 35),
    gateBatch(manifest),
    deckBatch(manifest, quays, 'batch:quays', 'quay', 'material:quay', 24),
    roadBatch(manifest),
    terrainBatch(manifest),
    wallBatch(manifest),
    waterBatch(manifest),
  ].sort((a, b) => compareGeometryCodepoint(a.id, b.id));

  /** @type {Map<string, SceneGeometryMesh>} */
  const templateById = new Map();
  /** @type {SceneGeometryInstance[]} */
  const instances = [];
  const buildings = Array.isArray(manifest.buildings)
    ? manifest.buildings.map(geometryRecord)
    : [];
  for (const building of buildings) {
    const baseLod = building.lodFamily === 'signature' ? 2 : 1;
    const preferredLod = massingOnly
      ? 0
      : clampGeometryNumber(baseLod - lodBias, 0, 2);
    const shapeKind = String(building.shapeKind || 'massing');
    const variantId = String(building.variantId || 'default');
    const availableLods = massingOnly ? [0] : [0, 1, 2];
    /** @type {Record<number, string>} */
    const templateIdsByLod = {};
    for (const lod of availableLods) {
      const template = buildingTemplate(shapeKind, variantId, lod);
      templateIdsByLod[lod] = template.id;
      if (!templateById.has(template.id)) templateById.set(template.id, template);
    }
    const center = Array.isArray(building.renderCenter) ? building.renderCenter : [0, 0];
    const x = geometryNumber(center[0]);
    const z = geometryNumber(center[1]);
    instances.push({
      id: `instance:${String(building.id)}`,
      semanticId: String(building.semanticId),
      kind: 'building',
      templateId: templateIdsByLod[preferredLod] || templateIdsByLod[0],
      templateIdsByLod,
      materialId: String(building.materialKey),
      position: [
        x * planUnitCm,
        geometryTerrainHeightCmAt(terrain, x, z),
        z * planUnitCm,
      ],
      scale: [
        geometryNumber(building.widthCm, 100),
        geometryNumber(building.heightCm, 100),
        geometryNumber(building.depthCm, 100),
      ],
      yawStep: Math.round(geometryNumber(building.headingStep)),
      lod: preferredLod,
      landmark: building.landmark === true,
    });
  }

  const vegetation = Array.isArray(manifest.vegetation)
    ? manifest.vegetation.map(geometryRecord)
    : [];
  const vegetationLod = massingOnly || lodBias >= 1 ? 0 : 1;
  for (const plant of vegetation) {
    const kind = String(plant.kind || 'tree');
    const template = vegetationTemplate(kind, vegetationLod);
    if (!templateById.has(template.id)) templateById.set(template.id, template);
    const position = Array.isArray(plant.position) ? plant.position : [0, 0];
    const x = geometryNumber(position[0]);
    const z = geometryNumber(position[1]);
    const band = clampGeometryNumber(Math.round(geometryNumber(plant.sizeBand, 1)), 1, 3);
    const width = planUnitCm * (kind === 'reed' ? 2 + band : 4 + band * 2);
    const height = planUnitCm * (
      kind === 'reed' ? 5 + band * 2
        : kind === 'scrub' ? 4 + band : 10 + band * 5
    );
    instances.push({
      id: `instance:${String(plant.id)}`,
      semanticId: String(plant.id),
      kind: 'vegetation',
      templateId: template.id,
      templateIdsByLod: { [vegetationLod]: template.id },
      materialId: String(plant.materialId),
      position: [
        x * planUnitCm,
        geometryTerrainHeightCmAt(terrain, x, z),
        z * planUnitCm,
      ],
      scale: [width, height, width],
      yawStep: Math.round(geometryNumber(plant.headingStep)),
      lod: vegetationLod,
      landmark: false,
    });
  }

  const maximumUniqueMeshes = geometryNumber(
    geometryRecord(manifest.budgets).maximumUniqueMeshes,
    0,
  );
  if (templateById.size > maximumUniqueMeshes) {
    throw new Error(
      `TownSceneGeometry unique mesh budget exceeded: ${templateById.size} > ${maximumUniqueMeshes}`,
    );
  }
  instances.sort((a, b) => compareGeometryCodepoint(String(a.id), String(b.id)));
  const templates = [...templateById.values()]
    .sort((a, b) => compareGeometryCodepoint(String(a.id), String(b.id)));

  return {
    kind: 'TownSceneGeometryBundle',
    bundleVersion: TOWN_SCENE_GEOMETRY_BUNDLE_VERSION,
    manifestDigest: sceneDigest(manifest),
    options: { lodBias, massingOnly },
    bounds: sceneBounds(manifest, instances),
    batches,
    templates,
    instances,
  };
}

/** Exact, deduplicated transfer list for Worker.postMessage. */
/** @param {unknown} bundleValue */
export function townSceneGeometryTransferList(bundleValue) {
  const bundle = geometryRecord(bundleValue);
  const meshes = [
    ...(Array.isArray(bundle.batches) ? bundle.batches : []),
    ...(Array.isArray(bundle.templates) ? bundle.templates : []),
  ].map(geometryRecord);
  /** @type {Set<ArrayBuffer>} */
  const buffers = new Set();
  for (const mesh of meshes) {
    for (const key of ['positions', 'normals', 'indices', 'ao', 'creaseEdges']) {
      const value = mesh[key];
      if (ArrayBuffer.isView(value) && value.buffer instanceof ArrayBuffer) {
        buffers.add(value.buffer);
      }
    }
  }
  return [...buffers];
}
