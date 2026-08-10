/**
 * domain/townScene/compileTownSceneManifest.js — whole-settlement scene
 * orchestration.
 *
 * Named compiler stages live in cohesive sibling modules. This file keeps the
 * constitutional sequence visible: project first, build the shared plan model,
 * apply the shared model wall, compile physical and living layers, fingerprint,
 * validate, and return immutable plain data.
 */

import { deriveSpatialSubstrate } from '../spatial/spatialSubstrate.js';
import { deepClone } from '../clone.js';
import {
  projectTownMapModelForAudience,
} from '../townMap/audienceProjection.js';
import { readSceneOverrides } from '../townMap/mapEdits.js';
import { buildTownMapModel } from '../townMap/townMapModel.js';
import { compileTownCartography } from '../townCartography/cartographySynthesis.js';
import { buildingHeadingStep } from './buildingProfiles.js';
import { attachTownCartographyLayers } from './cartographyContract.js';
import { buildCompleteSceneBuildings } from './sceneBuildingFabric.js';
import {
  TOWN_SCENE_COMPILER_VERSION,
  TOWN_SCENE_ELEVATION_STEPS,
  TOWN_SCENE_HEADING_STEPS,
  TOWN_SCENE_MAX_UNIQUE_MESHES,
  TOWN_SCENE_PLAN_EXTENT,
  TOWN_SCENE_SCHEMA_VERSION,
  assertTownSceneManifest,
} from './manifestContract.js';
import {
  boundedSceneString,
  clampSceneNumber,
  compareSceneCodepoint,
  finiteSceneNumber,
  scenePointObject,
  scenePointPair,
  sceneRecord,
  sortSceneRecords,
} from './sceneCompilePrimitives.js';
import {
  buildSceneConditions,
  buildSceneReconstruction,
  buildSceneScars,
} from './sceneLiving.js';
import {
  buildSceneMaterials,
  buildSceneProvenance,
} from './sceneMetadata.js';
import { buildSceneSemantics } from './sceneSemantics.js';
import {
  buildSceneCameraPresets,
  buildSceneRoads,
  buildSceneTerrain,
  buildSceneVegetation,
  buildSceneWaterInfrastructure,
  sceneTerrainHeightCmAt,
} from './sceneTerrainNetwork.js';
import {
  assertTownSceneCompileInput,
  prepareTownSceneCompileInputForSynchronousCompiler,
} from './sceneCompileInput.js';
import { sceneDigest, stableSceneStringify } from './stableScene.js';

const SHAPE_LIBRARY_VERSION = 1;
const MATERIAL_LIBRARY_VERSION = 1;

/**
 * @typedef {{
 *   id: string,
 *   centerline: Array<[number, number]>,
 *   widthPlan: number,
 *   [key: string]: unknown,
 * }} SceneRoad
 * @typedef {{
 *   id: string,
 *   wallId: string,
 *   position: [number, number],
 *   [key: string]: unknown,
 * }} SceneGate
 * @typedef {{
 *   id: string,
 *   anchorKey: string,
 *   name: string,
 *   category: string,
 *   footprint: Array<[number, number]>,
 *   centroid: [number, number],
 *   provenanceRefs: string[],
 *   [key: string]: unknown,
 * }} SceneDistrict
 * @typedef {{
 *   id: string,
 *   centerline: Array<[number, number]>,
 *   widthCm: number,
 *   [key: string]: unknown,
 * }} SceneWall
 */

const PLAN_UNIT_CM_BY_TIER = /** @type {Readonly<Record<string, number>>} */ (
  Object.freeze({
  thorp: 10,
  hamlet: 14,
  village: 20,
  town: 30,
  city: 50,
  metropolis: 80,
  })
);

/** Lower canonical TownMapModel districts plus substrate condition coefficients. */
/**
 * @param {{ districts?: unknown[] }} model
 * @param {ReturnType<typeof deriveSpatialSubstrate>} substrate
 * @param {Record<string, unknown>} terrain
 * @param {(sourceId: string) => string[]} provenanceRefsFor
 * @returns {SceneDistrict[]}
 */
function buildDistricts(model, substrate, terrain, provenanceRefsFor) {
  const substrateById = new Map(
    (substrate?.d || []).map((district) => [district.id, district]),
  );
  /** @type {SceneDistrict[]} */
  const districts = (Array.isArray(model.districts) ? model.districts : [])
    .map((raw) => {
      const district = sceneRecord(raw);
      const id = boundedSceneString(district.id, 120);
      const centroid = scenePointObject(district.centroid);
      const substrateDistrict = substrateById.get(id);
      return {
        id,
        anchorKey: boundedSceneString(district.anchorKey, 180),
        name: boundedSceneString(district.name, 120),
        category: boundedSceneString(district.category, 48) || 'other',
        footprint: (Array.isArray(district.polygon) ? district.polygon : [])
          .map(scenePointPair),
        centroid: /** @type {[number, number]} */ ([centroid.x, centroid.y]),
        elevationCm: sceneTerrainHeightCmAt(terrain, centroid.x, centroid.y),
        wealthBand: boundedSceneString(district.wealth, 32) || 'modest',
        safetyBand: boundedSceneString(district.safety, 32) || 'unknown',
        densityPermille: clampSceneNumber(
          Math.round(finiteSceneNumber(substrateDistrict?.den) * 1000),
          0,
          1000,
        ),
        flammabilityPermille: clampSceneNumber(
          Math.round(finiteSceneNumber(substrateDistrict?.flam) * 1000),
          0,
          1000,
        ),
        synthetic: district.synthetic === true,
        provenanceRefs: provenanceRefsFor(id),
      };
    })
    .filter((district) => district.id);
  return sortSceneRecords(districts, (district) => String(district.id));
}

/** Compile gate identities before walls so wall records can reference openings. */
/**
 * @param {ReturnType<typeof deriveSpatialSubstrate>} substrate
 * @param {SceneRoad[]} roads
 * @param {number} planUnitCm
 * @param {(sourceId: string) => string[]} provenanceRefsFor
 * @returns {SceneGate[]}
 */
function buildGates(substrate, roads, planUnitCm, provenanceRefsFor) {
  /** @type {SceneGate[]} */
  const gates = (substrate?.g || []).map((gate, index) => {
    const id = `gate:${gate.seg}:${index}`;
    const position = /** @type {[number, number]} */ ([
      clampSceneNumber(Math.round(gate.x), 0, TOWN_SCENE_PLAN_EXTENT),
      clampSceneNumber(Math.round(gate.y), 0, TOWN_SCENE_PLAN_EXTENT),
    ]);
    return {
      id,
      wallId: `wall:${gate.seg}`,
      position,
      headingStep: buildingHeadingStep(
        { x: position[0], y: position[1] },
        roads,
      ),
      openingWidthCm: Math.max(260, planUnitCm * 12),
      openingHeightCm: Math.max(320, planUnitCm * 15),
      towerWidthCm: Math.max(320, planUnitCm * 14),
      towerHeightCm: Math.max(480, planUnitCm * 21),
      materialId: 'material:gate',
      roadIds: roads
        .slice()
        .sort((a, b) => {
          const adx = a.centerline[0][0] - position[0];
          const adz = a.centerline[0][1] - position[1];
          const bdx = b.centerline[0][0] - position[0];
          const bdz = b.centerline[0][1] - position[1];
          return (adx * adx + adz * adz) - (bdx * bdx + bdz * bdz)
            || compareSceneCodepoint(a.id, b.id);
        })
        .slice(0, 1)
        .map((road) => road.id),
      provenanceRefs: provenanceRefsFor(`wall-sector:${gate.seg}`),
    };
  });
  return sortSceneRecords(gates, (gate) => String(gate.id));
}

/** Compile wall segments and bind their gate openings. */
/**
 * @param {ReturnType<typeof deriveSpatialSubstrate>} substrate
 * @param {SceneGate[]} gates
 * @param {number} planUnitCm
 * @param {(sourceId: string) => string[]} provenanceRefsFor
 * @returns {SceneWall[]}
 */
function buildWalls(substrate, gates, planUnitCm, provenanceRefsFor) {
  /** @type {Map<string, string[]>} */
  const gateIdsByWall = new Map();
  for (const gate of gates) {
    const list = gateIdsByWall.get(gate.wallId) || [];
    list.push(gate.id);
    gateIdsByWall.set(gate.wallId, list);
  }
  /** @type {SceneWall[]} */
  const walls = (substrate?.w || []).map((wall) => {
    const id = `wall:${wall.i}`;
    const strengthPermille = clampSceneNumber(
      Math.round(finiteSceneNumber(wall.str) * 1000),
      0,
      1000,
    );
    return {
      id,
      centerline: [
        [Math.round(wall.x1), Math.round(wall.y1)],
        [Math.round(wall.x2), Math.round(wall.y2)],
      ],
      heightCm: Math.max(
        350,
        Math.round((7 + strengthPermille / 125) * planUnitCm),
      ),
      widthCm: Math.max(
        120,
        Math.round((3 + strengthPermille / 400) * planUnitCm),
      ),
      strengthPermille,
      protectedDistrictId: typeof wall.did === 'string' ? wall.did : null,
      gateIds: (gateIdsByWall.get(id) || []).sort(compareSceneCodepoint),
      materialId: 'material:wall',
      conditionRefs: [],
      provenanceRefs: provenanceRefsFor(`wall-sector:${wall.i}`),
    };
  });
  return sortSceneRecords(walls, (wall) => String(wall.id));
}

/**
 * Compile a deterministic manifest from the exact, already-authorized transport
 * envelope. Live-view workers call this entrypoint; it never receives raw
 * worldState or regionalGraph campaign carriers.
 *
 * @param {import('./sceneCompileInput.js').TownSceneCompileInput} input
 * @param {{ namingPools?: unknown }} [options]
 */
function compileAuthorizedTownSceneManifest(input, options = {}) {
  const settlement = input.settlement;
  const mapEdits = input.mapEdits;
  const audience = input.audience;
  const unprojectedModel = buildTownMapModel(
    /** @type {Parameters<typeof buildTownMapModel>[0]} */ (settlement),
    /** @type {Parameters<typeof buildTownMapModel>[1]} */ (mapEdits),
  );
  const model = projectTownMapModelForAudience(
    unprojectedModel,
    audience,
  );

  // TownMapModel is plain data. The round trip drops accidental undefined
  // optionals before canonical hashing without retaining a raw source object.
  const mapModelValue = deepClone(model);
  const mapModelDigest = sceneDigest(mapModelValue);
  const provenance = buildSceneProvenance(model, audience);
  const meta = sceneRecord(model.meta);
  const tier = boundedSceneString(meta.tier, 32) || 'town';
  const terrainName = boundedSceneString(
    meta.terrain || meta.siteKind || 'plain',
    40,
  ).toLowerCase();
  const planUnitCm = PLAN_UNIT_CM_BY_TIER[tier] || PLAN_UNIT_CM_BY_TIER.town;

  const terrain = buildSceneTerrain(model, mapModelDigest);
  const roads = buildSceneRoads(model, planUnitCm, provenance.refsFor);
  const substrate = deriveSpatialSubstrate(
    /** @type {Parameters<typeof deriveSpatialSubstrate>[0]} */ (model),
    '',
  );
  const districts = buildDistricts(
    model,
    substrate,
    terrain,
    provenance.refsFor,
  );
  const gates = buildGates(
    substrate,
    roads,
    planUnitCm,
    provenance.refsFor,
  );
  const walls = buildWalls(
    substrate,
    gates,
    planUnitCm,
    provenance.refsFor,
  );
  const waterInfrastructure = buildSceneWaterInfrastructure(
    terrain,
    roads,
    districts,
    planUnitCm,
    provenance.refsFor,
  );
  const { bridges, quays } = waterInfrastructure;

  const scars = buildSceneScars(
    settlement,
    walls,
    districts,
    provenance.refsFor,
  );
  const scarLevel = scars.reduce(
    (maximum, scar) => Math.max(
      maximum,
      finiteSceneNumber(scar.severityPermille) / 1000,
    ),
    0,
  );
  const overrides = new Map(
    readSceneOverrides(mapEdits)
      .map((override) => [override.anchor, override]),
  );
  const buildingResult = buildCompleteSceneBuildings({
    model,
    districts,
    settlement,
    roads,
    waterBodies: terrain.waterBodies,
    walls,
    overrides,
    planUnitCm,
    terrain: terrainName,
    tier,
    scarLevel,
    entropy: mapModelDigest,
    provenanceRefsFor: provenance.refsFor,
  });
  const buildings = buildingResult.buildings;
  const vegetation = buildSceneVegetation(
    terrain,
    roads,
    buildings,
    districts,
    walls,
    mapModelDigest,
  );

  const conditions = buildSceneConditions(
    model,
    provenance.refsFor,
    { walls, settlement },
  );
  const reconstruction = buildSceneReconstruction(
    settlement,
    districts,
    provenance.refsFor,
  );
  const atmosphere = input.atmosphere;
  const materials = buildSceneMaterials(
    buildings,
    vegetation,
    bridges,
    quays,
  );
  const semantics = buildSceneSemantics({
    model,
    settlement,
    districts,
    roads,
    walls,
    gates,
    bridges,
    quays,
    buildings,
    terrain,
    conditions,
    scars,
    reconstruction,
    provenanceRefsFor: provenance.refsFor,
  });
  const cameraPresets = buildSceneCameraPresets(
    planUnitCm,
    terrain,
    districts,
    buildings,
  );

  const structureValue = {
    compilerVersion: TOWN_SCENE_COMPILER_VERSION,
    audience,
    space: { planUnitCm },
    terrain,
    districts,
    roads,
    walls,
    gates,
    bridges,
    quays,
    buildings: buildings.map((building) => {
      const {
        conditionProfile: _conditionProfile,
        provenanceRefs: _provenanceRefs,
        ...structure
      } = building;
      return structure;
    }),
    vegetation,
  };
  const dressValue = {
    audience,
    conditions,
    scars,
    reconstruction,
    atmosphere,
    materials,
  };
  const structureDigest = sceneDigest(structureValue);
  const dressDigest = sceneDigest(dressValue);

  const baseManifest = {
    kind: 'TownSceneManifest',
    schemaVersion: TOWN_SCENE_SCHEMA_VERSION,
    compiler: {
      compilerVersion: TOWN_SCENE_COMPILER_VERSION,
      townMapGeometryVersion: Math.max(
        1,
        Math.round(finiteSceneNumber(model.townMapGeometryVersion, 1)),
      ),
      layoutLawVersion: Math.max(
        1,
        Math.round(finiteSceneNumber(model.layoutLawVersion, 1)),
      ),
      overlayVersion: Math.max(
        1,
        Math.round(finiteSceneNumber(model.overlayVersion, 1)),
      ),
      shapeLibraryVersion: SHAPE_LIBRARY_VERSION,
      materialLibraryVersion: MATERIAL_LIBRARY_VERSION,
    },
    source: {
      audience,
      mapModelDigest,
      structureDigest,
      dressDigest,
    },
    space: {
      planExtent: TOWN_SCENE_PLAN_EXTENT,
      planUnitCm,
      upAxis: 'y',
      headingTurnDenominator: TOWN_SCENE_HEADING_STEPS,
      elevationTurnDenominator: TOWN_SCENE_ELEVATION_STEPS,
    },
    terrain,
    districts,
    roads,
    walls,
    gates,
    bridges,
    quays,
    buildings,
    vegetation,
    living: {
      conditions,
      scars,
      reconstruction,
      atmosphere,
    },
    materials,
    semantics,
    provenance: provenance.entries,
    cameraPresets,
    budgets: {
      maximumBuildings: Math.max(buildingResult.targetCount, buildings.length),
      maximumVegetationInstances: Math.max(256, vegetation.length),
      maximumUniqueMeshes: TOWN_SCENE_MAX_UNIQUE_MESHES,
      maximumTrianglesByLod: [800, 16000, 240000],
    },
  };

  // ── S-CARTO: the town-cartography synthesis stage (docs/DESIGN_TOWN_CARTOGRAPHY.md
  // §1, THE ONE LAW). The cartography layers are a STAGE INSIDE this compile, never
  // a parallel generator, so the seam lives here and nowhere else.
  //
  // TC-2: the transport key is conditional, so the dark path still hands null to
  // the identity seam and returns baseManifest BY REFERENCE. Lit, synthesis reads
  // this already-compiled manifest: its terrain and roads are the field boundary,
  // and its walls/gates/bridges remain the sole infrastructure truth. The additive
  // block carries street geometry plus references, never duplicate infrastructure.
  //
  // CR-TC3A-1: the naming pools are INJECTED across the async edge above this
  // synchronous compiler rather than imported by it, so the bounded worker/compiler
  // chunk pair never carries the naming table. A lit compile without them is a
  // caller-contract breach at this seam, and it fails loudly here rather than as an
  // obscure validation error three layers down.
  if (input.cartography?.enabled === true && options.namingPools == null) {
    throw new TypeError(
      'townScene compile premise: cartography is lit but namingPools was not injected; '
      + 'the caller above the lazy boundary must supply NAMING_DATA from src/data/namingData.js',
    );
  }
  const cartography = input.cartography?.enabled === true
    ? compileTownCartography(baseManifest, settlement, { namingPools: options.namingPools })
    : null;
  const manifest = attachTownCartographyLayers(baseManifest, cartography);
  assertTownSceneManifest(manifest);
  // Enforce the serializer claim now, not only when a cache first asks for it.
  stableSceneStringify(manifest);
  return manifest;
}

/**
 * Compile the live worker's bounded, already-authorized envelope.
 *
 * @param {import('./sceneCompileInput.js').TownSceneCompileInput} input
 * @param {{ namingPools?: unknown }} [options] CR-TC3A-1: required when lit
 */
export function compileTownSceneManifestFromAuthorizedInput(input, options = {}) {
  assertTownSceneCompileInput(input);
  return compileAuthorizedTownSceneManifest(input, options);
}

/**
 * Backward-compatible synchronous compiler for domain callers and deterministic
 * export. It uses the same authorization envelope as the worker path so there
 * is one projection law and one compiler implementation.
 *
 * @param {{
 *   settlement?: unknown,
 *   mapEdits?: unknown,
 *   worldState?: unknown,
 *   regionalGraph?: unknown,
 *   audience?: 'dm'|'player'|'public'|string,
 * }} [input]
 * @param {{ namingPools?: unknown }} [options] CR-TC3A-1: required when lit
 */
export function compileTownSceneManifest(input = {}, options = {}) {
  return compileAuthorizedTownSceneManifest(
    prepareTownSceneCompileInputForSynchronousCompiler(input),
    options,
  );
}
