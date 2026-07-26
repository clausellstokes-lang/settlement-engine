/**
 * domain/townScene/manifestContract.js — the versioned, renderer-neutral scene
 * contract.
 *
 * The manifest is a semantic recipe derived from TownMapModel. It contains no
 * GPU resources, no raw settlement/world objects, no seed, and no transient
 * viewer state. The worker may lower it into typed geometry and the WebGL view
 * may consume that artifact, but neither is allowed to reinterpret settlement
 * truth.
 */

import { stableSceneStringify } from './stableScene.js';
import {
  validateTownSceneRecordReferences,
  validateTownSceneRecordShapes,
} from './manifestRecordValidation.js';

export const TOWN_SCENE_SCHEMA_VERSION = 1;
export const TOWN_SCENE_COMPILER_VERSION = 1;
export const TOWN_SCENE_PLAN_EXTENT = 1000;
export const TOWN_SCENE_TERRAIN_GRID_SIZE = 33;
export const TOWN_SCENE_HEADING_STEPS = 16;
export const TOWN_SCENE_ELEVATION_STEPS = 16;
export const TOWN_SCENE_MAX_UNIQUE_MESHES = 128;
const TOWN_SCENE_TERRAIN_SAMPLE_COUNT = (
  TOWN_SCENE_TERRAIN_GRID_SIZE * TOWN_SCENE_TERRAIN_GRID_SIZE
);

export const TOWN_SCENE_AUDIENCES = Object.freeze(['dm', 'player', 'public']);
export const TOWN_SCENE_SHAPE_FAMILIES = Object.freeze([
  'agrarian',
  'civic',
  'domestic',
  'exotic',
  'industrial',
  'martial',
  'mercantile',
  'ruined',
  'sacred',
]);
export const TOWN_SCENE_LOD_FAMILIES = Object.freeze(['commons', 'signature']);

const TOP_LEVEL_KEYS = Object.freeze([
  'bridges',
  'budgets',
  'buildings',
  'cameraPresets',
  'compiler',
  'districts',
  'gates',
  'kind',
  'living',
  'materials',
  'provenance',
  'quays',
  'roads',
  'schemaVersion',
  'semantics',
  'source',
  'space',
  'terrain',
  'vegetation',
  'walls',
]);

const FORBIDDEN_MANIFEST_KEYS = Object.freeze(new Set([
  '_config',
  '_regenSeed',
  '_seed',
  'mapEdits',
  'rawSettlement',
  'regionalGraph',
  'rngSeed',
  'seed',
  'settlement',
  'settlementBlob',
  'worldState',
]));

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {boolean} */
function integer(value) {
  return Number.isInteger(value);
}

/** @param {unknown} value @returns {boolean} */
function digest(value) {
  return typeof value === 'string' && /^scene-v1-[0-9a-f]{32}$/.test(value);
}

/**
 * Ensure an id-bearing array is canonical and unique.
 * @param {unknown} value
 * @param {string} field
 * @param {string} key
 * @param {string[]} errors
 */
function validateSortedIds(value, field, key, errors) {
  if (!Array.isArray(value)) {
    errors.push(`${field} must be an array`);
    return;
  }
  let previous = null;
  const seen = new Set();
  for (let i = 0; i < value.length; i++) {
    const row = value[i];
    if (!isRecord(row)) {
      errors.push(`${field}[${i}] must be an object`);
      continue;
    }
    const id = row[key];
    if (typeof id !== 'string' || !id) {
      errors.push(`${field}[${i}].${key} must be a non-empty string`);
      continue;
    }
    if (previous != null && id < previous) errors.push(`${field} must be sorted by ${key}`);
    if (seen.has(id)) errors.push(`${field} contains duplicate ${key} "${id}"`);
    previous = id;
    seen.add(id);
  }
}

/**
 * Reject seed/raw-input carrier keys anywhere in the manifest. Values are not
 * scanned: an authorized public label may legitimately contain the word "seed".
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 */
function validateNoRawCarriers(value, path, errors) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) validateNoRawCarriers(value[i], `${path}[${i}]`, errors);
    return;
  }
  if (!isRecord(value)) return;
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_MANIFEST_KEYS.has(key)) errors.push(`${path}.${key} is forbidden in a TownSceneManifest`);
    validateNoRawCarriers(value[key], `${path}.${key}`, errors);
  }
}

/**
 * Validate a TownSceneManifest without mutating it.
 * @param {unknown} value
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateTownSceneManifest(value) {
  /** @type {string[]} */
  const errors = [];
  if (!isRecord(value)) return { ok: false, errors: ['manifest must be an object'] };

  try {
    stableSceneStringify(value);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'manifest is not JSON-safe');
  }

  const keys = Object.keys(value).sort();
  if (keys.length !== TOP_LEVEL_KEYS.length || keys.some((key, index) => key !== TOP_LEVEL_KEYS[index])) {
    errors.push(`manifest top-level keys must be exactly: ${TOP_LEVEL_KEYS.join(', ')}`);
  }
  if (value.kind !== 'TownSceneManifest') errors.push('kind must be TownSceneManifest');
  if (value.schemaVersion !== TOWN_SCENE_SCHEMA_VERSION) errors.push(`schemaVersion must be ${TOWN_SCENE_SCHEMA_VERSION}`);

  const compiler = isRecord(value.compiler) ? value.compiler : null;
  if (!compiler) errors.push('compiler must be an object');
  else {
    if (compiler.compilerVersion !== TOWN_SCENE_COMPILER_VERSION) errors.push(`compiler.compilerVersion must be ${TOWN_SCENE_COMPILER_VERSION}`);
    for (const key of ['townMapGeometryVersion', 'layoutLawVersion', 'overlayVersion', 'shapeLibraryVersion', 'materialLibraryVersion']) {
      if (!integer(compiler[key]) || Number(compiler[key]) < 1) errors.push(`compiler.${key} must be a positive integer`);
    }
  }

  const source = isRecord(value.source) ? value.source : null;
  if (!source) errors.push('source must be an object');
  else {
    if (!TOWN_SCENE_AUDIENCES.includes(String(source.audience))) errors.push('source.audience is invalid');
    for (const key of ['mapModelDigest', 'structureDigest', 'dressDigest']) {
      if (!digest(source[key])) errors.push(`source.${key} must be a scene digest`);
    }
  }

  const space = isRecord(value.space) ? value.space : null;
  if (!space) errors.push('space must be an object');
  else {
    if (space.planExtent !== TOWN_SCENE_PLAN_EXTENT) errors.push(`space.planExtent must be ${TOWN_SCENE_PLAN_EXTENT}`);
    if (!integer(space.planUnitCm) || Number(space.planUnitCm) <= 0) errors.push('space.planUnitCm must be a positive integer');
    if (space.upAxis !== 'y') errors.push('space.upAxis must be y');
    if (space.headingTurnDenominator !== TOWN_SCENE_HEADING_STEPS) errors.push(`space.headingTurnDenominator must be ${TOWN_SCENE_HEADING_STEPS}`);
    if (space.elevationTurnDenominator !== TOWN_SCENE_ELEVATION_STEPS) errors.push(`space.elevationTurnDenominator must be ${TOWN_SCENE_ELEVATION_STEPS}`);
  }

  const terrain = isRecord(value.terrain) ? value.terrain : null;
  if (!terrain) errors.push('terrain must be an object');
  else {
    if (terrain.gridSize !== TOWN_SCENE_TERRAIN_GRID_SIZE) errors.push(`terrain.gridSize must be ${TOWN_SCENE_TERRAIN_GRID_SIZE}`);
    if (!integer(terrain.heightUnitCm) || Number(terrain.heightUnitCm) <= 0) errors.push('terrain.heightUnitCm must be a positive integer');
    if (!Array.isArray(terrain.heights) || terrain.heights.length !== TOWN_SCENE_TERRAIN_SAMPLE_COUNT) {
      errors.push(`terrain.heights must contain ${TOWN_SCENE_TERRAIN_SAMPLE_COUNT} samples`);
    } else if (terrain.heights.some((height) => !integer(height))) {
      errors.push('terrain.heights must contain only integers');
    }
    validateSortedIds(terrain.waterBodies, 'terrain.waterBodies', 'id', errors);
    validateSortedIds(terrain.landforms, 'terrain.landforms', 'id', errors);
  }

  for (const field of ['districts', 'roads', 'walls', 'gates', 'bridges', 'quays', 'buildings', 'vegetation', 'materials', 'provenance', 'cameraPresets']) {
    validateSortedIds(value[field], field, 'id', errors);
  }
  validateSortedIds(value.semantics, 'semantics', 'sceneId', errors);

  if (Array.isArray(value.buildings)) {
    for (let i = 0; i < value.buildings.length; i++) {
      const building = value.buildings[i];
      if (!isRecord(building)) continue;
      if (!TOWN_SCENE_SHAPE_FAMILIES.includes(String(building.shapeFamily))) errors.push(`buildings[${i}].shapeFamily is invalid`);
      if (!TOWN_SCENE_LOD_FAMILIES.includes(String(building.lodFamily))) errors.push(`buildings[${i}].lodFamily is invalid`);
      if (!integer(building.headingStep) || Number(building.headingStep) < 0 || Number(building.headingStep) >= TOWN_SCENE_HEADING_STEPS) {
        errors.push(`buildings[${i}].headingStep must be 0..${TOWN_SCENE_HEADING_STEPS - 1}`);
      }
      for (const key of ['widthCm', 'depthCm', 'heightCm']) {
        if (!integer(building[key]) || Number(building[key]) <= 0) errors.push(`buildings[${i}].${key} must be a positive integer`);
      }
      const condition = isRecord(building.conditionProfile) ? building.conditionProfile : null;
      if (!condition || condition.corruptionCovert !== 0) errors.push(`buildings[${i}].conditionProfile.corruptionCovert must be exactly 0`);
    }
  }

  if (Array.isArray(value.gates)) {
    for (let i = 0; i < value.gates.length; i++) {
      const gate = value.gates[i];
      if (!isRecord(gate)) continue;
      for (const key of ['openingWidthCm', 'openingHeightCm', 'towerWidthCm', 'towerHeightCm']) {
        if (!integer(gate[key]) || Number(gate[key]) <= 0) errors.push(`gates[${i}].${key} must be a positive integer`);
      }
    }
  }

  const semanticIds = new Set(
    Array.isArray(value.semantics)
      ? value.semantics
        .filter(isRecord)
        .map((semantic) => semantic.sceneId)
        .filter((id) => typeof id === 'string')
      : [],
  );
  for (const field of ['buildings', 'gates', 'bridges', 'quays']) {
    if (!Array.isArray(value[field])) continue;
    for (let i = 0; i < value[field].length; i++) {
      const row = value[field][i];
      if (isRecord(row) && typeof row.id === 'string' && !semanticIds.has(row.id)) {
        errors.push(`${field}[${i}].id must resolve through semantics`);
      }
    }
  }

  const living = isRecord(value.living) ? value.living : null;
  if (!living) errors.push('living must be an object');
  else {
    validateSortedIds(living.conditions, 'living.conditions', 'id', errors);
    validateSortedIds(living.scars, 'living.scars', 'id', errors);
    validateSortedIds(living.reconstruction, 'living.reconstruction', 'id', errors);
    if (!isRecord(living.atmosphere)) errors.push('living.atmosphere must be an object');
    for (const field of ['conditions', 'scars', 'reconstruction']) {
      if (!Array.isArray(living[field])) continue;
      for (let i = 0; i < living[field].length; i++) {
        const row = living[field][i];
        if (isRecord(row) && typeof row.id === 'string' && !semanticIds.has(row.id)) {
          errors.push(`living.${field}[${i}].id must resolve through semantics`);
        }
      }
    }
  }

  if (!isRecord(value.budgets)) errors.push('budgets must be an object');
  else if (value.budgets.maximumUniqueMeshes !== TOWN_SCENE_MAX_UNIQUE_MESHES) {
    errors.push(`budgets.maximumUniqueMeshes must be ${TOWN_SCENE_MAX_UNIQUE_MESHES}`);
  }
  validateTownSceneRecordShapes(value, errors, {
    headingSteps: TOWN_SCENE_HEADING_STEPS,
    elevationSteps: TOWN_SCENE_ELEVATION_STEPS,
  });
  validateTownSceneRecordReferences(value, errors);
  validateNoRawCarriers(value, '$', errors);
  return { ok: errors.length === 0, errors };
}

/**
 * Fail-closed assertion used at compiler/worker boundaries.
 * @param {unknown} manifest
 * @returns {Record<string, unknown>}
 */
export function assertTownSceneManifest(manifest) {
  const result = validateTownSceneManifest(manifest);
  if (!result.ok) throw new Error(`TownSceneManifest invalid:\n${result.errors.join('\n')}`);
  return /** @type {Record<string, unknown>} */ (manifest);
}
