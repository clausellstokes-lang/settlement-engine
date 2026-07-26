/**
 * Complete deterministic graybox building fabric.
 *
 * TownMapModel deliberately records important institutions and district fills,
 * not every roof in an inhabited town. The scene keeps every supplied landmark
 * exactly anchored, then completes bounded district fabric from canonical
 * polygons and density. Generated structures are presentation records that
 * resolve back to their district; they never become new simulation entities.
 */

import { buildSceneBuildingProfile } from './buildingProfiles.js';
import {
  compareSceneCodepoint,
  finiteSceneNumber,
  sceneDigestWord,
  sceneFootprintRadius,
  scenePointInPolygon,
  scenePointSegmentDistanceSq,
  scenePolygonArea,
  sceneRadicalInverse,
  sceneRecord,
  sortSceneRecords,
} from './sceneCompilePrimitives.js';
import { sceneDigest } from './stableScene.js';

/**
 * @typedef {{
 *   id: string,
 *   name?: unknown,
 *   category?: unknown,
 *   wealthBand?: unknown,
 *   wealth?: unknown,
 *   safetyBand?: unknown,
 *   safety?: unknown,
 *   densityPermille?: unknown,
 *   centroid: number[],
 *   footprint: Array<[number, number]>,
 *   provenanceRefs?: string[],
 *   [key: string]: unknown,
 * }} SceneFabricDistrict
 * @typedef {{
 *   id: string,
 *   centerline: Array<[number, number]>,
 *   widthPlan?: number,
 *   [key: string]: unknown,
 * }} SceneFabricRoad
 * @typedef {{
 *   kind?: unknown,
 *   path: Array<[number, number]>,
 *   surfacePolygon: Array<[number, number]>,
 *   widthPlan?: number,
 *   [key: string]: unknown,
 * }} SceneFabricWater
 * @typedef {{
 *   centerline: Array<[number, number]>,
 *   widthCm?: number,
 *   [key: string]: unknown,
 * }} SceneFabricWall
 * @typedef {ReturnType<typeof buildSceneBuildingProfile> & {
 *   planUnitCm: number,
 *   generatedFabric: boolean,
 * }} ScenePlacedBuilding
 */

export const TOWN_SCENE_BUILDING_TARGET_BY_TIER = /** @type {Readonly<Record<string, number>>} */ (
  Object.freeze({
  thorp: 18,
  hamlet: 30,
  village: 54,
  town: 96,
  city: 176,
  metropolis: 200,
  })
);

/** @param {Record<string, unknown>} district */
function districtProfileInput(district) {
  return {
    ...district,
    wealth: district.wealthBand || district.wealth || 'modest',
    safety: district.safetyBand || district.safety || 'unknown',
  };
}

/** Allocate an integer budget by area × canonical density, largest remainder. */
/**
 * @param {SceneFabricDistrict[]} districts
 * @param {number} count
 * @returns {Map<string, number>}
 */
function allocateFabricSlots(districts, count) {
  if (count <= 0 || districts.length === 0) return new Map();
  const weighted = districts.map((district) => {
    const footprint = Array.isArray(district.footprint) ? district.footprint : [];
    const density = Math.max(
      0.25,
      finiteSceneNumber(district.densityPermille, 500) / 1000,
    );
    return {
      id: String(district.id),
      weight: Math.max(1, scenePolygonArea(footprint) * density),
    };
  });
  const totalWeight = weighted.reduce((sum, row) => sum + row.weight, 0) || 1;
  /** @type {Map<string, number>} */
  const allocations = new Map();
  /** @type {Array<{ id: string, remainder: number }>} */
  const remainders = [];
  let allocated = 0;
  for (const row of weighted) {
    const exact = (count * row.weight) / totalWeight;
    const whole = Math.floor(exact);
    allocations.set(row.id, whole);
    allocated += whole;
    remainders.push({ id: row.id, remainder: exact - whole });
  }
  remainders.sort((a, b) => (
    b.remainder - a.remainder
    || compareSceneCodepoint(a.id, b.id)
  ));
  for (let i = 0; allocated < count; i++, allocated++) {
    const row = remainders[i % remainders.length];
    allocations.set(row.id, (allocations.get(row.id) || 0) + 1);
  }
  return allocations;
}

/** Bounding box of a canonical district polygon. */
/** @param {Array<[number, number]>} polygon */
function polygonBounds(polygon) {
  let minX = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxZ = -Infinity;
  for (const point of polygon) {
    minX = Math.min(minX, point[0]);
    minZ = Math.min(minZ, point[1]);
    maxX = Math.max(maxX, point[0]);
    maxZ = Math.max(maxZ, point[1]);
  }
  return { minX, minZ, maxX, maxZ };
}

/** Deterministic low-discrepancy point within a district's bounding box. */
/**
 * @param {SceneFabricDistrict} district
 * @param {string} entropy
 * @param {number} attempt
 * @param {number} fabricScalePermille
 * @returns {[number, number]}
 */
function fabricCandidate(
  district,
  entropy,
  attempt,
  fabricScalePermille,
) {
  const polygon = Array.isArray(district.footprint) ? district.footprint : [];
  const bounds = polygonBounds(polygon);
  const token = sceneDigest({ entropy, districtId: district.id });
  if (fabricScalePermille <= 850) {
    const spacing = 11;
    const columns = Math.max(1, Math.floor((bounds.maxX - bounds.minX) / spacing));
    const rows = Math.max(1, Math.floor((bounds.maxZ - bounds.minZ) / spacing));
    const cellCount = columns * rows;
    const layer = Math.floor(attempt / cellCount);
    const rotated = (
      attempt
      + sceneDigestWord(token, 0) % cellCount
    ) % cellCount;
    const column = rotated % columns;
    const row = Math.floor(rotated / columns);
    const shifts = [0.5, 0.25, 0.75, 0.4, 0.6];
    const shift = shifts[layer % shifts.length];
    return /** @type {[number, number]} */ ([
      Math.round(
        bounds.minX
        + ((column + shift) / columns) * (bounds.maxX - bounds.minX),
      ),
      Math.round(
        bounds.minZ
        + ((row + shift) / rows) * (bounds.maxZ - bounds.minZ),
      ),
    ]);
  }
  const rotationX = sceneDigestWord(token, 0) / 0x100000000;
  const rotationZ = sceneDigestWord(token, 1) / 0x100000000;
  const unitX = (sceneRadicalInverse(attempt + 1, 2) + rotationX) % 1;
  const unitZ = (sceneRadicalInverse(attempt + 1, 3) + rotationZ) % 1;
  return /** @type {[number, number]} */ ([
    Math.round(bounds.minX + unitX * (bounds.maxX - bounds.minX)),
    Math.round(bounds.minZ + unitZ * (bounds.maxZ - bounds.minZ)),
  ]);
}

/** Test a candidate footprint against every canonical exclusion surface. */
/**
 * @param {{
 *   profile: ScenePlacedBuilding,
 *   district: SceneFabricDistrict,
 *   nearbyPlaced: (center: number[], radius: number) => ScenePlacedBuilding[],
 *   roads: SceneFabricRoad[],
 *   waterBodies: SceneFabricWater[],
 *   walls: SceneFabricWall[],
 *   planUnitCm: number,
 * }} args
 */
function fabricCandidateIsClear(args) {
  const {
    profile,
    district,
    nearbyPlaced,
    roads,
    waterBodies,
    walls,
    planUnitCm,
  } = args;
  const center = profile.renderCenter;
  const footprint = profile.footprint;
  const districtPolygon = Array.isArray(district.footprint) ? district.footprint : [];
  if (!scenePointInPolygon(center[0], center[1], districtPolygon)) return false;
  if (footprint.some((point) => !scenePointInPolygon(point[0], point[1], districtPolygon))) {
    return false;
  }

  const radius = sceneFootprintRadius(center, footprint);
  for (const existing of nearbyPlaced(center, radius)) {
    const existingCenter = existing.renderCenter;
    const existingRadius = sceneFootprintRadius(
      existingCenter,
      existing.footprint,
    );
    const dx = center[0] - existingCenter[0];
    const dz = center[1] - existingCenter[1];
    const clearance = radius
      + existingRadius
      + (existing.generatedFabric === true ? 0.75 : 2);
    if (dx * dx + dz * dz < clearance * clearance) return false;
  }

  for (const road of roads) {
    const path = Array.isArray(road.centerline) ? road.centerline : [];
    const clearance = radius + finiteSceneNumber(road.widthPlan, 4) / 2 + 2;
    for (let i = 0; i < path.length - 1; i++) {
      if (
        scenePointSegmentDistanceSq(center[0], center[1], path[i], path[i + 1])
        < clearance * clearance
      ) return false;
    }
  }

  for (const water of waterBodies) {
    const surface = Array.isArray(water.surfacePolygon)
      ? water.surfacePolygon
      : [];
    if (
      surface.length >= 3
      && (
        scenePointInPolygon(center[0], center[1], surface)
        || footprint.some((point) => scenePointInPolygon(point[0], point[1], surface))
      )
    ) return false;
    const path = Array.isArray(water.path) ? water.path : [];
    const waterHalfWidth = water.kind === 'coast'
      ? 4
      : finiteSceneNumber(water.widthPlan, 40) / 2;
    const clearance = radius + waterHalfWidth + 4;
    for (let i = 0; i < path.length - 1; i++) {
      if (
        scenePointSegmentDistanceSq(center[0], center[1], path[i], path[i + 1])
        < clearance * clearance
      ) return false;
    }
  }

  for (const wall of walls) {
    const path = Array.isArray(wall.centerline) ? wall.centerline : [];
    if (path.length < 2) continue;
    const halfWidth = finiteSceneNumber(wall.widthCm, 120)
      / Math.max(1, planUnitCm)
      / 2;
    const clearance = radius + halfWidth + 3;
    if (
      scenePointSegmentDistanceSq(center[0], center[1], path[0], path[1])
      < clearance * clearance
    ) return false;
  }
  return true;
}

/**
 * Build canonical landmark profiles, then fill districts to the tier target.
 * @param {{
 *   model: { buildings?: unknown[] },
 *   districts: SceneFabricDistrict[],
 *   settlement: Record<string, unknown>,
 *   roads: SceneFabricRoad[],
 *   waterBodies: SceneFabricWater[],
 *   walls: SceneFabricWall[],
 *   overrides: Map<string, {
 *     variantId?: string,
 *     skinId?: string,
 *     headingOffsetStep?: number,
 *   }>,
 *   planUnitCm: number,
 *   terrain: string,
 *   tier: string,
 *   scarLevel: number,
 *   entropy: string,
 *   provenanceRefsFor: (sourceId: string) => string[],
 * }} args
 * @returns {{ buildings: ScenePlacedBuilding[], targetCount: number }}
 */
export function buildCompleteSceneBuildings(args) {
  const {
    model,
    districts,
    settlement,
    roads,
    waterBodies,
    walls,
    overrides,
    planUnitCm,
    terrain,
    tier,
    scarLevel,
    entropy,
    provenanceRefsFor,
  } = args;
  const districtById = new Map(
    districts.map((district) => [String(district.id), district]),
  );
  /** @type {ScenePlacedBuilding[]} */
  const buildings = [];
  const modelBuildings = Array.isArray(model.buildings) ? model.buildings : [];
  for (const raw of modelBuildings) {
    const building = sceneRecord(raw);
    const anchorKey = boundedAnchor(building.anchorKey);
    const district = districtById.get(String(building.districtId || '')) || {};
    const profile = buildSceneBuildingProfile({
      building,
      district: districtProfileInput(district),
      settlement,
      roads,
      override: overrides.get(anchorKey) || null,
      planUnitCm,
      terrain,
      tier,
      scarLevel,
      entropy,
      provenanceRefs: provenanceRefsFor(anchorKey),
    });
    if (profile.anchorKey) {
      buildings.push({
        ...profile,
        planUnitCm,
        generatedFabric: false,
      });
    }
  }

  const targetCount = Math.max(
    buildings.length,
    TOWN_SCENE_BUILDING_TARGET_BY_TIER[tier]
      || TOWN_SCENE_BUILDING_TARGET_BY_TIER.town,
  );
  const fillBudget = targetCount - buildings.length;
  /** @type {Array<Array<[number, number]>>} */
  const coastSurfaces = waterBodies
    .filter((water) => water.kind === 'coast')
    .map((water) => water.surfacePolygon)
    .filter((surface) => Array.isArray(surface) && surface.length >= 3);
  const orderedDistricts = districts
    .filter((district) => (
      typeof district.id === 'string'
      && Array.isArray(district.footprint)
      && district.footprint.length >= 3
      && !coastSurfaces.some((surface) => (
        scenePointInPolygon(
          finiteSceneNumber(district.centroid?.[0], 500),
          finiteSceneNumber(district.centroid?.[1], 500),
          surface,
        )
      ))
    ))
    .slice()
    .sort((a, b) => compareSceneCodepoint(String(a.id), String(b.id)));
  const allocations = allocateFabricSlots(orderedDistricts, fillBudget);
  /** @type {Map<string, number>} */
  const attempts = new Map(orderedDistricts.map((district) => [district.id, 0]));
  /** @type {Map<string, number>} */
  const accepted = new Map(orderedDistricts.map((district) => [district.id, 0]));
  const spatialCellSize = 32;
  /** @type {Map<string, ScenePlacedBuilding[]>} */
  const placedGrid = new Map();
  let maximumPlacedRadius = 0;

  /** @param {ScenePlacedBuilding} building */
  function indexPlaced(building) {
    const center = building.renderCenter;
    const radius = sceneFootprintRadius(center, building.footprint);
    maximumPlacedRadius = Math.max(maximumPlacedRadius, radius);
    const key = `${Math.floor(center[0] / spatialCellSize)}:${Math.floor(center[1] / spatialCellSize)}`;
    const cell = placedGrid.get(key) || [];
    cell.push(building);
    placedGrid.set(key, cell);
  }

  /**
   * @param {number[]} center
   * @param {number} radius
   * @returns {ScenePlacedBuilding[]}
   */
  function nearbyPlaced(center, radius) {
    const cellX = Math.floor(center[0] / spatialCellSize);
    const cellZ = Math.floor(center[1] / spatialCellSize);
    const reach = Math.ceil((radius + maximumPlacedRadius + 2) / spatialCellSize);
    const nearby = [];
    for (let dz = -reach; dz <= reach; dz++) {
      for (let dx = -reach; dx <= reach; dx++) {
        const cell = placedGrid.get(`${cellX + dx}:${cellZ + dz}`);
        if (cell) nearby.push(...cell);
      }
    }
    return nearby;
  }

  for (const building of buildings) indexPlaced(building);
  // Constrained coasts use a compact grid so streets and buildings can coexist
  // beside the canonical water surface. Inland settlements retain the fuller
  // authored building scale; their more expensive completion pass belongs in
  // the scene worker, not in a visual compromise on the interaction thread.
  const defaultFabricScalePermille = /coast|sea|ocean/.test(terrain)
    ? 800
    : 1000;

  /** Try one district until a single clear structure is found. */
  /**
   * @param {SceneFabricDistrict} district
   * @param {number} attemptLimit
   * @param {number} [fabricScalePermille]
   */
  function placeNext(district, attemptLimit, fabricScalePermille = 1000) {
    const slot = accepted.get(district.id) || 0;
    let attempt = attempts.get(district.id) || 0;
    const end = attempt + attemptLimit;
    while (attempt < end) {
      const position = fabricCandidate(
        district,
        entropy,
        attempt,
        fabricScalePermille,
      );
      attempt += 1;
      const anchorKey = `fabric:${district.id}:${String(slot).padStart(3, '0')}`;
      const profile = buildSceneBuildingProfile({
        building: {
          name: `${district.name || 'District'} fabric`,
          anchorKey,
          kind: 'fill',
          districtId: district.id,
          fabricScalePermille,
          position: { x: position[0], y: position[1] },
        },
        district: districtProfileInput(district),
        settlement,
        roads,
        override: overrides.get(anchorKey) || null,
        planUnitCm,
        terrain,
        tier,
        scarLevel,
        entropy: sceneDigest({ entropy, anchorKey }),
        provenanceRefs: Array.isArray(district.provenanceRefs)
          ? district.provenanceRefs
          : provenanceRefsFor(String(district.id)),
      });
      const candidate = {
        ...profile,
        planUnitCm,
        generatedFabric: true,
      };
      if (fabricCandidateIsClear({
        profile: candidate,
        district,
        nearbyPlaced,
        roads,
        waterBodies,
        walls,
        planUnitCm,
      })) {
        buildings.push(candidate);
        indexPlaced(candidate);
        accepted.set(district.id, slot + 1);
        attempts.set(district.id, attempt);
        return true;
      }
    }
    attempts.set(district.id, attempt);
    return false;
  }

  for (const district of orderedDistricts) {
    const desired = allocations.get(district.id) || 0;
    const primaryAttemptLimit = defaultFabricScalePermille < 1000
      ? Math.max(60, desired * 8)
      : Math.max(120, desired * 24);
    while (
      (accepted.get(district.id) || 0) < desired
      && placeNext(
        district,
        primaryAttemptLimit,
        defaultFabricScalePermille,
      )
    ) {
      // `placeNext` advances exactly one accepted slot.
    }
  }

  // A very narrow district may not accept its proportional share. Reallocate
  // the remainder deterministically across every district before conceding a
  // smaller bounded scene.
  let remaining = targetCount - buildings.length;
  let progress = true;
  while (remaining > 0 && progress) {
    progress = false;
    for (const district of orderedDistricts) {
      if (remaining <= 0) break;
      const redistributionAttempts = defaultFabricScalePermille < 1000 ? 80 : 180;
      if (placeNext(district, redistributionAttempts, defaultFabricScalePermille)) {
        remaining -= 1;
        progress = true;
      }
    }
  }
  for (const fabricScalePermille of [850, 700]) {
    progress = true;
    while (remaining > 0 && progress) {
      progress = false;
      for (const district of orderedDistricts) {
        if (remaining <= 0) break;
        if (placeNext(district, 720, fabricScalePermille)) {
          remaining -= 1;
          progress = true;
        }
      }
    }
  }
  return {
    buildings: sortSceneRecords(buildings, (building) => String(building.id)),
    targetCount,
  };
}

/** @param {unknown} value */
function boundedAnchor(value) {
  return typeof value === 'string' ? value.trim().slice(0, 180) : '';
}
