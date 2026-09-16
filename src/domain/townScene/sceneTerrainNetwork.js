/**
 * Terrain, route, water-infrastructure, vegetation, and camera compilation.
 *
 * This stage owns physical composition that is shared by every scene audience.
 * It lowers only the already-projected TownMapModel and canonical district
 * records; it does not inspect private settlement prose or mutable view state.
 */

import { buildingHeadingStep } from './buildingProfiles.js';
import {
  TOWN_SCENE_HEADING_STEPS,
  TOWN_SCENE_PLAN_EXTENT,
  TOWN_SCENE_TERRAIN_GRID_SIZE,
} from './manifestContract.js';
import {
  boundedSceneString,
  clampSceneNumber,
  compareSceneCodepoint,
  finiteSceneNumber,
  sceneDigestWord,
  sceneNearestPointOnSegment,
  scenePointInPolygon,
  scenePointObject,
  scenePointPair,
  scenePointSegmentDistanceSq,
  scenePolygonArea,
  sceneRecord,
  sceneSegmentIntersection,
  sortSceneRecords,
} from './sceneCompilePrimitives.js';
import { sceneDigest } from './stableScene.js';

export const TOWN_SCENE_TERRAIN_HEIGHT_UNIT_CM = 25;

/**
 * @typedef {{
 *   id: string,
 *   kind: string,
 *   path: Array<[number, number]>,
 *   surfacePolygon: Array<[number, number]>,
 *   widthPlan: number,
 *   elevationCm: number,
 *   materialId: string,
 * }} SceneWaterBody
 * @typedef {{
 *   profileId: string,
 *   gridSize: number,
 *   heightUnitCm: number,
 *   heights: number[],
 *   materialId: string,
 *   waterBodies: SceneWaterBody[],
 *   landforms: Array<Record<string, unknown>>,
 * }} SceneTerrain
 * @typedef {{
 *   id: string,
 *   centerline: Array<[number, number]>,
 *   widthPlan: number,
 *   widthCm: number,
 *   [key: string]: unknown,
 * }} SceneRoad
 * @typedef {{
 *   id: string,
 *   category: string,
 *   centroid: number[],
 *   footprint: Array<[number, number]>,
 *   provenanceRefs?: string[],
 *   [key: string]: unknown,
 * }} SceneDistrict
 * @typedef {{
 *   id: string,
 *   renderCenter: number[],
 *   widthCm: number,
 *   depthCm: number,
 *   heightCm?: number,
 *   planUnitCm?: number,
 *   landmark?: boolean,
 *   [key: string]: unknown,
 * }} SceneBuilding
 * @typedef {{
 *   centerline: Array<[number, number]>,
 *   [key: string]: unknown,
 * }} SceneWall
 * @typedef {{
 *   id: string,
 *   materialId: string,
 *   [key: string]: unknown,
 * }} SceneWaterStructure
 * @typedef {{
 *   id: string,
 *   materialId: string,
 *   position: number[],
 *   [key: string]: unknown,
 * }} SceneVegetation
 */

/**
 * Close the shoreline toward its nearest plan edge. TownMapModel's site stage
 * deliberately places a coast near the top or bottom edge; nearest-edge closure
 * preserves that canonical site choice without consulting private source data.
 *
 * @param {Array<[number, number]>} path
 * @returns {Array<[number, number]>}
 */
function coastSurfacePolygon(path) {
  if (path.length < 2) return [];
  const meanZ = path.reduce((sum, point) => sum + point[1], 0) / path.length;
  const edgeZ = meanZ < TOWN_SCENE_PLAN_EXTENT / 2
    ? 0
    : TOWN_SCENE_PLAN_EXTENT;
  const first = path[0];
  const last = path[path.length - 1];
  return [
    ...path,
    /** @type {[number, number]} */ ([last[0], edgeZ]),
    /** @type {[number, number]} */ ([first[0], edgeZ]),
  ];
}

/**
 * Terrain profile and quantized height field. Heights are integers in
 * `TOWN_SCENE_TERRAIN_HEIGHT_UNIT_CM` units; geometry lowering owns floats.
 *
 * @param {{ meta?: unknown, frame?: unknown }} model
 * @param {string} mapModelDigest
 * @returns {SceneTerrain}
 */
export function buildSceneTerrain(model, mapModelDigest) {
  const meta = sceneRecord(model.meta);
  const frame = sceneRecord(model.frame);
  const rawTerrain = boundedSceneString(meta.siteKind || meta.terrain || 'plain', 40).toLowerCase();
  const profileId = /mountain|hill|crag|highland/.test(rawTerrain) ? 'mountain-flank'
    : /desert|dune|arid|badland/.test(rawTerrain) ? 'dunes'
      : /marsh|swamp|fen|bog/.test(rawTerrain) ? 'marsh'
        : /coast|sea|ocean/.test(rawTerrain) ? 'coast'
          : /river|riverside/.test(rawTerrain) ? 'river'
            : /forest|wood/.test(rawTerrain) ? 'woodland'
              : 'plain';
  const gridSize = TOWN_SCENE_TERRAIN_GRID_SIZE;
  const edge = sceneDigestWord(mapModelDigest, 0) % 4;
  /** @type {number[]} */
  const heights = [];
  for (let z = 0; z < gridSize; z++) {
    for (let x = 0; x < gridSize; x++) {
      const noiseWord = sceneDigestWord(sceneDigest({ mapModelDigest, x, z }), (x + z) % 4);
      const noise = (noiseWord % 9) - 4;
      let height;
      if (profileId === 'mountain-flank') {
        const distance = edge === 0 ? z
          : edge === 1 ? gridSize - 1 - x
            : edge === 2 ? gridSize - 1 - z : x;
        height = Math.max(0, (gridSize - 1 - distance) * 3) + noise;
      } else if (profileId === 'dunes') {
        height = ((x * 7 + z * 11 + (noiseWord % 17)) % 22) - 5;
      } else if (profileId === 'marsh') {
        height = Math.min(4, noise);
      } else if (profileId === 'coast') {
        const distance = edge === 0 ? z
          : edge === 1 ? gridSize - 1 - x
            : edge === 2 ? gridSize - 1 - z : x;
        height = Math.round(distance / 4) + Math.round(noise / 2);
      } else if (profileId === 'woodland') {
        height = 6 + noise;
      } else if (profileId === 'river') {
        height = 4 + Math.round(noise / 2);
      } else {
        height = Math.round(noise / 2);
      }
      heights.push(clampSceneNumber(Math.round(height), -32, 128));
    }
  }

  /** @type {SceneWaterBody[]} */
  const waterBodies = [];
  const water = sceneRecord(frame.water);
  if (Array.isArray(water.path) && water.path.length >= 2) {
    const kind = water.kind === 'coast' ? 'coast' : 'river';
    const path = water.path.map(scenePointPair);
    waterBodies.push({
      id: 'water:primary',
      kind,
      path,
      surfacePolygon: kind === 'coast' ? coastSurfacePolygon(path) : [],
      widthPlan: kind === 'coast' ? 150 : 42,
      elevationCm: 0,
      materialId: 'material:water',
    });
  }

  /** @type {Array<Record<string, unknown>>} */
  const landforms = [];
  const landform = sceneRecord(frame.landform);
  if (typeof landform.kind === 'string' && Array.isArray(landform.marks)) {
    /** @type {Array<Record<string, unknown>>} */
    const marks = [];
    for (const raw of landform.marks) {
      const mark = sceneRecord(raw);
      if (mark.m === 'dot') {
        marks.push({
          m: 'dot',
          x: clampSceneNumber(Math.round(finiteSceneNumber(mark.x)), 0, TOWN_SCENE_PLAN_EXTENT),
          y: clampSceneNumber(Math.round(finiteSceneNumber(mark.y)), 0, TOWN_SCENE_PLAN_EXTENT),
          r: clampSceneNumber(Math.round(finiteSceneNumber(mark.r, 1)), 1, 50),
        });
      } else if (mark.m === 'stroke') {
        marks.push({
          m: 'stroke',
          x1: clampSceneNumber(Math.round(finiteSceneNumber(mark.x1)), 0, TOWN_SCENE_PLAN_EXTENT),
          y1: clampSceneNumber(Math.round(finiteSceneNumber(mark.y1)), 0, TOWN_SCENE_PLAN_EXTENT),
          x2: clampSceneNumber(Math.round(finiteSceneNumber(mark.x2)), 0, TOWN_SCENE_PLAN_EXTENT),
          y2: clampSceneNumber(Math.round(finiteSceneNumber(mark.y2)), 0, TOWN_SCENE_PLAN_EXTENT),
          w: clampSceneNumber(Math.round(finiteSceneNumber(mark.w)), 0, 2),
        });
      } else if (mark.m === 'curve' && Array.isArray(mark.pts)) {
        marks.push({
          m: 'curve',
          pts: mark.pts.map(scenePointPair),
          w: clampSceneNumber(Math.round(finiteSceneNumber(mark.w)), 0, 2),
        });
      }
    }
    landforms.push({
      id: 'landform:primary',
      kind: boundedSceneString(landform.kind, 40),
      marks,
    });
  }
  return {
    profileId,
    gridSize,
    heightUnitCm: TOWN_SCENE_TERRAIN_HEIGHT_UNIT_CM,
    heights,
    materialId: 'material:ground',
    waterBodies: sortSceneRecords(waterBodies, (row) => String(row.id)),
    landforms: sortSceneRecords(landforms, (row) => String(row.id)),
  };
}

/** Nearest heightfield sample in centimeters at one plan-space coordinate. */
/**
 * @param {{ gridSize?: unknown, heights?: unknown, heightUnitCm?: unknown }} terrain
 * @param {number} x
 * @param {number} z
 */
export function sceneTerrainHeightCmAt(terrain, x, z) {
  const gridSize = Number(terrain.gridSize);
  const gx = clampSceneNumber(
    Math.round((x / TOWN_SCENE_PLAN_EXTENT) * (gridSize - 1)),
    0,
    gridSize - 1,
  );
  const gz = clampSceneNumber(
    Math.round((z / TOWN_SCENE_PLAN_EXTENT) * (gridSize - 1)),
    0,
    gridSize - 1,
  );
  const sample = Array.isArray(terrain.heights)
    ? finiteSceneNumber(terrain.heights[gz * gridSize + gx])
    : 0;
  return Math.round(
    sample * finiteSceneNumber(terrain.heightUnitCm, TOWN_SCENE_TERRAIN_HEIGHT_UNIT_CM),
  );
}

/** Compile approach roads plus the semantic local-street skeleton. */
/**
 * @param {{ frame?: unknown, skeleton?: unknown }} model
 * @param {number} planUnitCm
 * @param {(sourceId: string) => string[]} provenanceRefsFor
 * @returns {SceneRoad[]}
 */
export function buildSceneRoads(model, planUnitCm, provenanceRefsFor) {
  const frame = sceneRecord(model.frame);
  const skeleton = sceneRecord(model.skeleton);
  /** @type {SceneRoad[]} */
  const roads = [];
  const approach = Array.isArray(frame.roads) ? frame.roads : [];
  for (const raw of approach) {
    const road = sceneRecord(raw);
    const sourceId = boundedSceneString(road.id, 100) || `approach:${roads.length}`;
    const id = `road:${sourceId}`;
    const weight = clampSceneNumber(Math.round(finiteSceneNumber(road.weight, 2)), 1, 5);
    roads.push({
      id,
      kind: 'arterial',
      centerline: [scenePointPair(road.from), scenePointPair(road.to)],
      widthPlan: 5 + weight * 2,
      widthCm: Math.max(180, (5 + weight * 2) * planUnitCm),
      elevationOffsetCm: 3,
      materialId: 'material:road',
      districtIds: [],
      provenanceRefs: provenanceRefsFor(sourceId),
    });
  }

  const seenStreet = new Set();
  const streets = Array.isArray(skeleton.streets) ? skeleton.streets : [];
  for (const raw of streets) {
    const street = sceneRecord(raw);
    const fromObj = scenePointObject(street.from);
    const toObj = scenePointObject(street.to);
    const from = /** @type {[number, number]} */ ([fromObj.x, fromObj.y]);
    const to = /** @type {[number, number]} */ ([toObj.x, toObj.y]);
    const token = sceneDigest({ from, to }).slice(-12);
    const id = `street:${token}`;
    if (seenStreet.has(id)) continue;
    seenStreet.add(id);
    roads.push({
      id,
      kind: 'street',
      centerline: [from, to],
      widthPlan: 4,
      widthCm: Math.max(140, 4 * planUnitCm),
      elevationOffsetCm: 4,
      materialId: 'material:road',
      districtIds: [],
      provenanceRefs: provenanceRefsFor(id),
    });
  }
  return sortSceneRecords(roads, (road) => String(road.id));
}

/** Return a short centerline through a crossing, aligned with its road. */
/**
 * @param {[number, number]} intersection
 * @param {[number, number]} roadA
 * @param {[number, number]} roadB
 * @param {number} lengthPlan
 * @returns {Array<[number, number]>}
 */
function crossingCenterline(intersection, roadA, roadB, lengthPlan) {
  const dx = roadB[0] - roadA[0];
  const dz = roadB[1] - roadA[1];
  const magnitude = Math.sqrt(dx * dx + dz * dz) || 1;
  const half = lengthPlan / 2;
  return [
    /** @type {[number, number]} */ ([
      clampSceneNumber(Math.round(intersection[0] - (dx / magnitude) * half), 0, TOWN_SCENE_PLAN_EXTENT),
      clampSceneNumber(Math.round(intersection[1] - (dz / magnitude) * half), 0, TOWN_SCENE_PLAN_EXTENT),
    ]),
    /** @type {[number, number]} */ ([
      clampSceneNumber(Math.round(intersection[0] + (dx / magnitude) * half), 0, TOWN_SCENE_PLAN_EXTENT),
      clampSceneNumber(Math.round(intersection[1] + (dz / magnitude) * half), 0, TOWN_SCENE_PLAN_EXTENT),
    ]),
  ];
}

/**
 * Derive bridge/causeway crossings and mercantile quays from canonical
 * road-water topology. These are scene structures, not new simulation truth.
 *
 * @param {SceneTerrain} terrain
 * @param {SceneRoad[]} roads
 * @param {SceneDistrict[]} districts
 * @param {number} planUnitCm
 * @param {(sourceId: string) => string[]} provenanceRefsFor
 * @returns {{ bridges: SceneWaterStructure[], quays: SceneWaterStructure[] }}
 */
export function buildSceneWaterInfrastructure(
  terrain,
  roads,
  districts,
  planUnitCm,
  provenanceRefsFor,
) {
  /** @type {SceneWaterStructure[]} */
  const bridges = [];
  /** @type {SceneWaterStructure[]} */
  const quays = [];
  const waterBodies = Array.isArray(terrain.waterBodies) ? terrain.waterBodies : [];

  for (const water of waterBodies) {
    const waterPath = Array.isArray(water.path) ? water.path : [];
    for (const road of roads) {
      /** @type {{ crossing: [number, number], roadA: [number, number], roadB: [number, number] }|null} */
      let accepted = null;
      for (let roadIndex = 0; roadIndex < road.centerline.length - 1 && !accepted; roadIndex++) {
        const roadA = road.centerline[roadIndex];
        const roadB = road.centerline[roadIndex + 1];
        for (let waterIndex = 0; waterIndex < waterPath.length - 1; waterIndex++) {
          const crossing = sceneSegmentIntersection(
            roadA,
            roadB,
            waterPath[waterIndex],
            waterPath[waterIndex + 1],
          );
          if (crossing) {
            accepted = { crossing, roadA, roadB };
            break;
          }
        }
      }
      if (!accepted) continue;
      const kind = water.kind === 'coast' ? 'causeway' : 'bridge';
      const lengthPlan = finiteSceneNumber(water.widthPlan, 40) + (kind === 'causeway' ? 26 : 16);
      const centerline = crossingCenterline(
        accepted.crossing,
        accepted.roadA,
        accepted.roadB,
        lengthPlan,
      );
      const core = {
        kind,
        roadId: road.id,
        waterId: water.id,
        position: scenePointPair(accepted.crossing),
      };
      bridges.push({
        id: `bridge:${sceneDigest(core).slice(-16)}`,
        ...core,
        centerline,
        headingStep: buildingHeadingStep(
          { x: accepted.crossing[0], y: accepted.crossing[1] },
          [road],
        ),
        widthPlan: Math.max(7, finiteSceneNumber(road.widthPlan, 5) + 2),
        widthCm: Math.max(220, finiteSceneNumber(road.widthCm, 180) + 80),
        deckElevationCm: finiteSceneNumber(water.elevationCm) + 70,
        materialId: 'material:bridge',
        provenanceRefs: provenanceRefsFor(String(road.id)),
      });
    }

    for (const district of districts) {
      if (district.category !== 'merchant') continue;
      const centroid = Array.isArray(district.centroid) ? district.centroid : [500, 500];
      /** @type {({ point: [number, number], t: number, distanceSq: number, a: [number, number], b: [number, number] })|null} */
      let nearest = null;
      for (let i = 0; i < waterPath.length - 1; i++) {
        const candidate = sceneNearestPointOnSegment(
          finiteSceneNumber(centroid[0]),
          finiteSceneNumber(centroid[1]),
          waterPath[i],
          waterPath[i + 1],
        );
        if (!nearest || candidate.distanceSq < nearest.distanceSq) {
          nearest = { ...candidate, a: waterPath[i], b: waterPath[i + 1] };
        }
      }
      if (!nearest || nearest.distanceSq > 260 * 260) continue;
      const dx = nearest.b[0] - nearest.a[0];
      const dz = nearest.b[1] - nearest.a[1];
      const magnitude = Math.sqrt(dx * dx + dz * dz) || 1;
      const halfLength = 34;
      const centerline = [
        /** @type {[number, number]} */ ([
          clampSceneNumber(Math.round(nearest.point[0] - (dx / magnitude) * halfLength), 0, TOWN_SCENE_PLAN_EXTENT),
          clampSceneNumber(Math.round(nearest.point[1] - (dz / magnitude) * halfLength), 0, TOWN_SCENE_PLAN_EXTENT),
        ]),
        /** @type {[number, number]} */ ([
          clampSceneNumber(Math.round(nearest.point[0] + (dx / magnitude) * halfLength), 0, TOWN_SCENE_PLAN_EXTENT),
          clampSceneNumber(Math.round(nearest.point[1] + (dz / magnitude) * halfLength), 0, TOWN_SCENE_PLAN_EXTENT),
        ]),
      ];
      const core = { districtId: district.id, waterId: water.id };
      quays.push({
        id: `quay:${sceneDigest(core).slice(-16)}`,
        ...core,
        centerline,
        position: scenePointPair(nearest.point),
        headingStep: buildingHeadingStep(
          { x: nearest.point[0], y: nearest.point[1] },
          [{ id: `water:${water.id}`, centerline }],
        ),
        widthPlan: 12,
        widthCm: Math.max(260, planUnitCm * 12),
        deckElevationCm: finiteSceneNumber(water.elevationCm) + 35,
        materialId: 'material:quay',
        provenanceRefs: Array.isArray(district.provenanceRefs)
          ? district.provenanceRefs
          : provenanceRefsFor(String(district.id)),
      });
    }
  }
  return {
    bridges: sortSceneRecords(bridges, (row) => String(row.id)),
    quays: sortSceneRecords(quays, (row) => String(row.id)),
  };
}

/** True when a point lies in, or too near, a canonical water surface. */
/** @param {number} x @param {number} z @param {SceneWaterBody} water */
function pointBlockedByWater(x, z, water) {
  const polygon = Array.isArray(water.surfacePolygon) ? water.surfacePolygon : [];
  if (polygon.length >= 3 && scenePointInPolygon(x, z, polygon)) return true;
  const width = finiteSceneNumber(water.widthPlan, 40) / 2 + 8;
  const path = Array.isArray(water.path) ? water.path : [];
  for (let i = 0; i < path.length - 1; i++) {
    if (scenePointSegmentDistanceSq(x, z, path[i], path[i + 1]) < width * width) return true;
  }
  return false;
}

/** Deterministic, collision-aware vegetation candidates. */
/**
 * @param {SceneTerrain} terrain
 * @param {SceneRoad[]} roads
 * @param {SceneBuilding[]} buildings
 * @param {SceneDistrict[]} districts
 * @param {SceneWall[]} walls
 * @param {string} entropy
 * @returns {SceneVegetation[]}
 */
export function buildSceneVegetation(terrain, roads, buildings, districts, walls, entropy) {
  const profile = String(terrain.profileId);
  const density = profile === 'woodland' ? 150
    : profile === 'marsh' ? 110
      : profile === 'dunes' ? 45
        : profile === 'mountain-flank' ? 85 : 75;
  const kind = profile === 'marsh' ? 'reed' : profile === 'dunes' ? 'scrub' : 'tree';
  /** @type {SceneVegetation[]} */
  const out = [];
  const step = 58;
  for (let cellZ = 0; cellZ < 16 && out.length < density; cellZ++) {
    for (let cellX = 0; cellX < 16 && out.length < density; cellX++) {
      const token = sceneDigest({ entropy, cellX, cellZ });
      const x = clampSceneNumber(55 + cellX * step + (sceneDigestWord(token, 0) % 25) - 12, 25, 975);
      const z = clampSceneNumber(55 + cellZ * step + (sceneDigestWord(token, 1) % 25) - 12, 25, 975);
      const threshold = profile === 'woodland' ? 72 : profile === 'marsh' ? 58 : 38;
      if ((sceneDigestWord(token, 2) % 100) > threshold) continue;

      let blocked = false;
      for (const building of buildings) {
        const center = building.renderCenter;
        const radius = Math.max(
          12,
          Math.ceil(
            Math.max(building.widthCm, building.depthCm)
              / 2
              / Math.max(1, finiteSceneNumber(building.planUnitCm, 1)),
          ),
        );
        const buildingDx = x - center[0];
        const buildingDz = z - center[1];
        if (buildingDx * buildingDx + buildingDz * buildingDz < radius * radius) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;
      for (const road of roads) {
        const width = finiteSceneNumber(road.widthPlan, 4) + 8;
        for (let i = 0; i < road.centerline.length - 1; i++) {
          if (scenePointSegmentDistanceSq(x, z, road.centerline[i], road.centerline[i + 1]) < width * width) {
            blocked = true;
            break;
          }
        }
        if (blocked) break;
      }
      if (blocked) continue;
      for (const wall of walls) {
        const line = wall.centerline;
        if (scenePointSegmentDistanceSq(x, z, line[0], line[1]) < 100) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;
      for (const water of terrain.waterBodies) {
        if (pointBlockedByWater(x, z, water)) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;

      const district = districts.find((candidate) => (
        scenePointInPolygon(x, z, candidate.footprint)
      ));
      out.push({
        id: `vegetation:${String(cellX).padStart(2, '0')}:${String(cellZ).padStart(2, '0')}`,
        kind,
        position: [x, z],
        headingStep: sceneDigestWord(token, 3) % TOWN_SCENE_HEADING_STEPS,
        sizeBand: 1 + (sceneDigestWord(token, 0) % 3),
        instanceKey: `vegetation:${kind}`,
        materialId: `material:vegetation:${kind}`,
        districtId: district ? district.id : null,
      });
    }
  }
  return sortSceneRecords(out, (row) => String(row.id));
}

/** Camera presets use quantized turns and centimeters, not persisted angles. */
/**
 * Bound the inhabited composition rather than the full terrain tile. The
 * canonical plan extent includes approaches, fields, and export breathing room;
 * using all of it for every 3D camera made the actual settlement read as a
 * thumbnail. Every included point is still canonical TownMap-derived geometry.
 *
 * @param {SceneDistrict[]} districts
 * @param {SceneBuilding[]} buildings
 */
function inhabitedCameraFrame(districts, buildings) {
  let minimumX = Infinity;
  let minimumZ = Infinity;
  let maximumX = -Infinity;
  let maximumZ = -Infinity;
  /** @param {unknown} point */
  const include = (point) => {
    if (!Array.isArray(point) || point.length < 2) return;
    const x = finiteSceneNumber(point[0], NaN);
    const z = finiteSceneNumber(point[1], NaN);
    if (!Number.isFinite(x) || !Number.isFinite(z)) return;
    minimumX = Math.min(minimumX, x);
    minimumZ = Math.min(minimumZ, z);
    maximumX = Math.max(maximumX, x);
    maximumZ = Math.max(maximumZ, z);
  };
  for (const district of districts) {
    for (const point of Array.isArray(district.footprint) ? district.footprint : []) {
      include(point);
    }
  }
  for (const building of buildings) {
    for (const point of Array.isArray(building.footprint) ? building.footprint : []) {
      include(point);
    }
  }
  if (![minimumX, minimumZ, maximumX, maximumZ].every(Number.isFinite)) {
    return { center: [500, 500], span: TOWN_SCENE_PLAN_EXTENT };
  }
  const rawSpan = Math.max(maximumX - minimumX, maximumZ - minimumZ, 1);
  const padding = Math.max(24, rawSpan * 0.08);
  return {
    center: [
      clampSceneNumber(
        Math.round((minimumX + maximumX) / 2),
        0,
        TOWN_SCENE_PLAN_EXTENT,
      ),
      clampSceneNumber(
        Math.round((minimumZ + maximumZ) / 2),
        0,
        TOWN_SCENE_PLAN_EXTENT,
      ),
    ],
    span: Math.min(TOWN_SCENE_PLAN_EXTENT, Math.round(rawSpan + padding * 2)),
  };
}

/**
 * @param {number} planUnitCm
 * @param {SceneTerrain} terrain
 * @param {SceneDistrict[]} districts
 * @param {SceneBuilding[]} buildings
 */
export function buildSceneCameraPresets(planUnitCm, terrain, districts, buildings) {
  const inhabited = inhabitedCameraFrame(districts, buildings);
  const centerX = inhabited.center[0];
  const centerZ = inhabited.center[1];
  const centerHeight = sceneTerrainHeightCmAt(terrain, centerX, centerZ);
  const inhabitedExtentCm = inhabited.span * planUnitCm;
  const primaryDistrict = districts
    .slice()
    .sort((a, b) => (
      scenePolygonArea(b.footprint) - scenePolygonArea(a.footprint)
      || compareSceneCodepoint(String(a.id), String(b.id))
    ))[0] || null;
  const landmark = buildings
    .filter((building) => building.landmark === true)
    .slice()
    .sort((a, b) => (
      finiteSceneNumber(b.heightCm) - finiteSceneNumber(a.heightCm)
      || compareSceneCodepoint(String(a.id), String(b.id))
    ))[0] || null;
  const districtCenter = Array.isArray(primaryDistrict?.centroid)
    ? primaryDistrict.centroid
    : [500, 500];
  const landmarkCenter = Array.isArray(landmark?.renderCenter)
    ? landmark.renderCenter
    : [500, 500];
  const presets = [
    {
      id: 'district',
      target: [
        Math.round(finiteSceneNumber(districtCenter[0], 500) * planUnitCm),
        sceneTerrainHeightCmAt(
          terrain,
          finiteSceneNumber(districtCenter[0], 500),
          finiteSceneNumber(districtCenter[1], 500),
        ) + 140,
        Math.round(finiteSceneNumber(districtCenter[1], 500) * planUnitCm),
      ],
      azimuthStep: 3,
      elevationStep: 2,
      distanceCm: Math.round(inhabitedExtentCm * 0.52),
    },
    {
      id: 'landmark',
      target: [
        Math.round(finiteSceneNumber(landmarkCenter[0], 500) * planUnitCm),
        sceneTerrainHeightCmAt(
          terrain,
          finiteSceneNumber(landmarkCenter[0], 500),
          finiteSceneNumber(landmarkCenter[1], 500),
        ) + Math.round(finiteSceneNumber(landmark?.heightCm, 300) * 0.45),
        Math.round(finiteSceneNumber(landmarkCenter[1], 500) * planUnitCm),
      ],
      azimuthStep: 1,
      elevationStep: 1,
      distanceCm: Math.round(inhabitedExtentCm * 0.26),
    },
    {
      id: 'overview',
      target: [
        Math.round(centerX * planUnitCm),
        centerHeight,
        Math.round(centerZ * planUnitCm),
      ],
      azimuthStep: 2,
      elevationStep: 2,
      distanceCm: Math.round(inhabitedExtentCm * 1.08),
    },
    {
      id: 'plan',
      target: [
        Math.round(centerX * planUnitCm),
        centerHeight,
        Math.round(centerZ * planUnitCm),
      ],
      azimuthStep: 0,
      elevationStep: 4,
      distanceCm: Math.round(inhabitedExtentCm * 1.18),
    },
    {
      id: 'street',
      target: [
        Math.round(finiteSceneNumber(landmarkCenter[0], centerX) * planUnitCm),
        sceneTerrainHeightCmAt(
          terrain,
          finiteSceneNumber(landmarkCenter[0], centerX),
          finiteSceneNumber(landmarkCenter[1], centerZ),
        ) + Math.round(finiteSceneNumber(landmark?.heightCm, 300) * 0.32),
        Math.round(finiteSceneNumber(landmarkCenter[1], centerZ) * planUnitCm),
      ],
      azimuthStep: 1,
      elevationStep: 1,
      distanceCm: Math.round(inhabitedExtentCm * 0.2),
    },
  ];
  return sortSceneRecords(presets, (preset) => preset.id);
}

/** Useful to callers that need a stable network ordering. */
export { compareSceneCodepoint };
