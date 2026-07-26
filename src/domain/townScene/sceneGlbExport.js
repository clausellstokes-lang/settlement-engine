/**
 * Deterministic, portable GLB export for a complete TownSceneManifest.
 *
 * The binary uses meters (the glTF ecosystem convention), material-separated
 * triangle primitives, portable vertex-color AO, and an unlit line primitive
 * for the scene compiler's illustrated crease ink. Authorized semantic and
 * provenance references live in node extras; a player/public manifest can
 * therefore never regain DM-only facts during export.
 */

import { assertTownSceneManifest } from './manifestContract.js';
import {
  resolveTownSceneExportMaterial,
  TOWN_SCENE_EXPORT_INK_ALBEDO,
} from './sceneExportPalette.js';
import { flattenTownSceneGeometry } from './sceneExportMesh.js';
import { stableSceneStringify } from './stableScene.js';

const GLB_MAGIC = 0x46546c67;
const JSON_CHUNK_TYPE = 0x4e4f534a;
const BIN_CHUNK_TYPE = 0x004e4942;
const FLOAT = 5126;
const UNSIGNED_INT = 5125;
const ARRAY_BUFFER = 34962;
const ELEMENT_ARRAY_BUFFER = 34963;
const TRIANGLES = 4;
const LINES = 1;
const UNIT_SCALE_METERS = 0.01;

/**
 * @typedef {Record<string, unknown>} SceneGlbRecord
 * @typedef {ReturnType<typeof flattenTownSceneGeometry>} TownSceneExportMesh
 * @typedef {{ lod?: 0|1|2, includeInk?: boolean }} TownSceneGlbOptions
 * @typedef {{
 *   materialId: string,
 *   semanticId: string,
 *   livingKind: string,
 *   indices: Uint32Array,
 * }} SceneGlbIndexGroup
 * @typedef {{
 *   id: string,
 *   value: Float32Array|Uint32Array,
 *   target: number,
 *   byteOffset?: number,
 *   byteLength?: number,
 * }} SceneGlbSegment
 */

/** @param {number} value */
function pad4(value) {
  return (value + 3) & ~3;
}

/** @param {string} a @param {string} b */
function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {unknown} value @returns {SceneGlbRecord} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {SceneGlbRecord} */ (value)
    : {};
}

/**
 * @param {SceneGlbRecord} manifest
 * @param {string} materialId
 * @returns {Record<string, unknown>}
 */
function materialRecord(manifest, materialId) {
  const definition = resolveTownSceneExportMaterial(manifest, materialId);
  return {
    name: materialId,
    pbrMetallicRoughness: {
      baseColorFactor: [...definition.color],
      metallicFactor: definition.metalness,
      roughnessFactor: definition.roughness,
    },
    doubleSided: true,
    ...(definition.water ? { alphaMode: 'BLEND' } : {}),
    extras: {
      townSceneMaterialId: materialId,
      colorRole: definition.colorRole,
      presentationClass: definition.presentationClass,
      roughnessPermille: Math.round(definition.roughness * 1000),
      metalnessPermille: Math.round(definition.metalness * 1000),
    },
  };
}

/**
 * @param {SceneGlbRecord} manifest
 * @returns {Array<Record<string, unknown>>}
 */
function semanticExtras(manifest) {
  const semantics = /** @type {SceneGlbRecord[]} */ (
    Array.isArray(manifest.semantics) ? manifest.semantics : []
  );
  return semantics.map((semantic) => ({
    sceneId: String(semantic.sceneId),
    kind: String(semantic.entityKind || 'scene'),
    label: String(semantic.label || semantic.sceneId),
    ...(semantic.canonicalRef && typeof semantic.canonicalRef === 'object'
      ? { canonicalRef: semantic.canonicalRef }
      : {}),
    provenanceRefs: Array.isArray(semantic.provenanceRefs)
      ? [...semantic.provenanceRefs].map(String).sort(compareCodepoint)
      : [],
  }));
}

/** @param {TownSceneExportMesh} mesh @returns {Float32Array} */
function meterPositions(mesh) {
  const result = new Float32Array(mesh.positions.length);
  for (let index = 0; index < mesh.positions.length; index++) {
    result[index] = mesh.positions[index] * UNIT_SCALE_METERS;
  }
  return result;
}

/** @param {TownSceneExportMesh} mesh @returns {Float32Array} */
function aoColors(mesh) {
  const result = new Float32Array(mesh.vertexCount * 3);
  for (let index = 0; index < mesh.vertexCount; index++) {
    const value = Math.max(0.28, Math.min(1, Number.isFinite(mesh.ao[index]) ? mesh.ao[index] : 1));
    result[index * 3] = value * mesh.tints[index * 3];
    result[index * 3 + 1] = value * mesh.tints[index * 3 + 1];
    result[index * 3 + 2] = value * mesh.tints[index * 3 + 2];
  }
  return result;
}

/** @param {TownSceneExportMesh} mesh @returns {SceneGlbIndexGroup[]} */
function indexGroups(mesh) {
  /** @type {Map<string, number[]>} */
  const byPresentation = new Map();
  for (let triangle = 0; triangle < mesh.indices.length / 3; triangle++) {
    const materialId = mesh.triangleMaterialIds[triangle] || 'material:ground';
    const semanticId = mesh.triangleSemanticIds[triangle] || '';
    const livingKind = mesh.triangleLivingKinds[triangle] || '';
    const key = JSON.stringify([materialId, semanticId, livingKind]);
    if (!byPresentation.has(key)) byPresentation.set(key, []);
    /** @type {number[]} */ (byPresentation.get(key)).push(
      mesh.indices[triangle * 3],
      mesh.indices[triangle * 3 + 1],
      mesh.indices[triangle * 3 + 2],
    );
  }
  return [...byPresentation.entries()]
    .map(([key, indices]) => {
      const [materialId, semanticId, livingKind] = JSON.parse(key);
      return {
        materialId: String(materialId),
        semanticId: String(semanticId),
        livingKind: String(livingKind),
        indices,
      };
    })
    .sort((a, b) => (
      compareCodepoint(a.materialId, b.materialId)
      || compareCodepoint(a.semanticId, b.semanticId)
      || compareCodepoint(a.livingKind, b.livingKind)
    ))
    .map(({ materialId, semanticId, livingKind, indices }) => ({
      materialId,
      semanticId,
      livingKind,
      indices: Uint32Array.from(indices),
    }));
}

/**
 * @param {Uint8Array} target
 * @param {number} offset
 * @param {Float32Array|Uint32Array} value
 */
function writeTypedArray(target, offset, value) {
  const view = new DataView(target.buffer, target.byteOffset, target.byteLength);
  if (value instanceof Float32Array) {
    for (let index = 0; index < value.length; index++) {
      view.setFloat32(offset + index * 4, value[index], true);
    }
    return;
  }
  for (let index = 0; index < value.length; index++) {
    view.setUint32(offset + index * 4, value[index], true);
  }
}

/**
 * @param {unknown} manifestValue
 * @param {unknown} bundle
 * @param {TownSceneGlbOptions} [options]
 */
function buildGlbParts(manifestValue, bundle, options = {}) {
  const manifest = assertTownSceneManifest(manifestValue);
  const mesh = flattenTownSceneGeometry(manifest, bundle, { lod: options.lod ?? 2 });
  const positions = meterPositions(mesh);
  const colors = aoColors(mesh);
  const groups = indexGroups(mesh);
  const includeInk = options.includeInk !== false && mesh.creaseEdges.length > 0;
  /** @type {SceneGlbSegment[]} */
  const segments = [
    { id: 'positions', value: positions, target: ARRAY_BUFFER },
    { id: 'normals', value: mesh.normals, target: ARRAY_BUFFER },
    { id: 'colors', value: colors, target: ARRAY_BUFFER },
    { id: 'ao', value: mesh.ao, target: ARRAY_BUFFER },
    ...groups.map((group, index) => ({
      id: `indices:${index}`,
      value: group.indices,
      target: ELEMENT_ARRAY_BUFFER,
    })),
    ...(includeInk ? [{
      id: 'indices:crease-ink',
      value: mesh.creaseEdges,
      target: ELEMENT_ARRAY_BUFFER,
    }] : []),
  ];

  let binaryLength = 0;
  for (const segment of segments) {
    segment.byteOffset = binaryLength;
    segment.byteLength = segment.value.byteLength;
    binaryLength = pad4(binaryLength + segment.byteLength);
  }
  const binary = new Uint8Array(binaryLength);
  for (const segment of segments) {
    writeTypedArray(binary, segment.byteOffset || 0, segment.value);
  }

  const bufferViews = segments.map((segment) => ({
    buffer: 0,
    byteOffset: segment.byteOffset || 0,
    byteLength: segment.byteLength || 0,
    target: segment.target,
  }));
  const segmentIndex = new Map(segments.map((segment, index) => [segment.id, index]));
  const min = mesh.min.map((value) => value * UNIT_SCALE_METERS);
  const max = mesh.max.map((value) => value * UNIT_SCALE_METERS);
  /** @type {Array<Record<string, unknown>>} */
  const accessors = [
    {
      bufferView: segmentIndex.get('positions'),
      componentType: FLOAT,
      count: mesh.vertexCount,
      type: 'VEC3',
      min,
      max,
    },
    {
      bufferView: segmentIndex.get('normals'),
      componentType: FLOAT,
      count: mesh.vertexCount,
      type: 'VEC3',
    },
    {
      bufferView: segmentIndex.get('colors'),
      componentType: FLOAT,
      count: mesh.vertexCount,
      type: 'VEC3',
    },
    {
      bufferView: segmentIndex.get('ao'),
      componentType: FLOAT,
      count: mesh.vertexCount,
      type: 'SCALAR',
    },
  ];

  const materialIds = [...new Set(groups.map((group) => group.materialId))]
    .sort(compareCodepoint);
  /** @type {Array<Record<string, unknown>>} */
  const materials = materialIds.map((materialId) => materialRecord(manifest, materialId));
  const materialIndexById = new Map(
    materialIds.map((materialId, index) => [materialId, index]),
  );
  const semanticById = new Map(
    (Array.isArray(manifest.semantics) ? manifest.semantics : [])
      .map(record)
      .map((semantic) => [String(semantic.sceneId || ''), semantic]),
  );
  /** @type {Array<Record<string, unknown>>} */
  const primitives = groups.map((group, index) => {
    const accessorIndex = accessors.length;
    accessors.push({
      bufferView: segmentIndex.get(`indices:${index}`),
      componentType: UNSIGNED_INT,
      count: group.indices.length,
      type: 'SCALAR',
    });
    const semantic = record(semanticById.get(group.semanticId));
    return {
      attributes: {
        POSITION: 0,
        NORMAL: 1,
        COLOR_0: 2,
        _AO: 3,
      },
      indices: accessorIndex,
      material: materialIndexById.get(group.materialId),
      mode: TRIANGLES,
      extras: {
        townSceneSemanticId: group.semanticId,
        townSceneEntityKind: String(semantic.entityKind || 'scene'),
        provenanceRefs: Array.isArray(semantic.provenanceRefs)
          ? semantic.provenanceRefs.map(String).sort(compareCodepoint)
          : [],
        ...(group.livingKind ? { townSceneLivingKind: group.livingKind } : {}),
      },
    };
  });

  if (includeInk) {
    const inkMaterialIndex = materials.length;
    materials.push({
      name: 'material:crease-ink',
      pbrMetallicRoughness: {
        baseColorFactor: [...TOWN_SCENE_EXPORT_INK_ALBEDO],
        metallicFactor: 0,
        roughnessFactor: 1,
      },
      doubleSided: true,
      alphaMode: 'BLEND',
      extensions: { KHR_materials_unlit: {} },
      extras: { townSceneMaterialId: 'material:crease-ink', colorRole: 'ink' },
    });
    const accessorIndex = accessors.length;
    accessors.push({
      bufferView: segmentIndex.get('indices:crease-ink'),
      componentType: UNSIGNED_INT,
      count: mesh.creaseEdges.length,
      type: 'SCALAR',
    });
    primitives.push({
      attributes: { POSITION: 0 },
      indices: accessorIndex,
      material: inkMaterialIndex,
      mode: LINES,
    });
  }

  const compiler = record(manifest.compiler);
  const source = record(manifest.source);
  const generator = `SettlementForge TownScene ${String(compiler.compilerVersion || 'unknown')}`;
  const tree = {
    asset: {
      version: '2.0',
      generator,
      extras: {
        townSceneSchemaVersion: manifest.schemaVersion,
        townSceneCompilerVersion: compiler.compilerVersion,
      },
    },
    ...(includeInk ? { extensionsUsed: ['KHR_materials_unlit'] } : {}),
    scene: 0,
    scenes: [{ name: 'SettlementForge Town Scene', nodes: [0] }],
    nodes: [{
      name: 'SettlementForge Town Scene',
      mesh: 0,
      extras: {
        townScene: {
          manifestDigest: mesh.manifestDigest,
          audience: source.audience,
          structureDigest: source.structureDigest,
          dressDigest: source.dressDigest,
          sourceUnit: 'centimeter',
          exportedUnit: 'meter',
          lod: mesh.lod,
          semantics: semanticExtras(manifest),
          semanticPrimitives: groups.map((group, primitive) => ({
            primitive,
            sceneId: group.semanticId,
            ...(group.livingKind ? { livingKind: group.livingKind } : {}),
          })),
        },
      },
    }],
    meshes: [{ name: 'Complete settlement', primitives }],
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: binary.length }],
  };
  return {
    json: stableSceneStringify(tree),
    binary,
    tree,
    mesh,
  };
}

/**
 * Exact JSON chunk used by the GLB, exposed for contract tests and inspectors.
 * @param {unknown} manifest
 * @param {unknown} bundle
 * @param {TownSceneGlbOptions} [options]
 */
export function townSceneGlbJsonString(manifest, bundle, options = {}) {
  return buildGlbParts(manifest, bundle, options).json;
}

/**
 * Encode the complete settlement to byte-reproducible glTF 2.0 binary.
 * @param {unknown} manifest
 * @param {unknown} bundle
 * @param {TownSceneGlbOptions} [options]
 * @returns {Uint8Array}
 */
export function encodeTownSceneGlb(manifest, bundle, options = {}) {
  const { json, binary } = buildGlbParts(manifest, bundle, options);
  const encodedJson = new TextEncoder().encode(json);
  const jsonLength = pad4(encodedJson.length);
  const binaryLength = pad4(binary.length);
  const totalLength = 12 + 8 + jsonLength + 8 + binaryLength;
  const result = new Uint8Array(totalLength);
  const view = new DataView(result.buffer);
  view.setUint32(0, GLB_MAGIC, true);
  view.setUint32(4, 2, true);
  view.setUint32(8, totalLength, true);
  view.setUint32(12, jsonLength, true);
  view.setUint32(16, JSON_CHUNK_TYPE, true);
  result.fill(0x20, 20, 20 + jsonLength);
  result.set(encodedJson, 20);
  const binaryHeader = 20 + jsonLength;
  view.setUint32(binaryHeader, binaryLength, true);
  view.setUint32(binaryHeader + 4, BIN_CHUNK_TYPE, true);
  result.set(binary, binaryHeader + 8);
  return result;
}
