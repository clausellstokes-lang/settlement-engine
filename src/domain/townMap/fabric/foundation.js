/**
 * The small canonical fabric foundation used by the first map vertical slice.
 * It accepts only explicit integer geometry and seals exactly one surface block.
 */

import { sceneDigest } from '../../townScene/stableScene.js';

export const FABRIC_FOUNDATION_SCHEMA_VERSION = 1;
export const FABRIC_FOUNDATION_LAW_VERSION = 'mf-w3-explicit-v1';
export const FABRIC_COORDINATE_ABI = 'plan-q1-0-1000-v1';
export const CURRENT_MAP_TRADITION_ID = 'EUROPEAN_FANTASY_BASE';

/** @param {unknown} value @param {string} label @returns {Record<string, unknown>} */
export function requireCanonicalRecord(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  return /** @type {Record<string, unknown>} */ (value);
}

/** @param {unknown} value @param {string} label @param {number} [min] @param {number} [max] */
export function requireCanonicalInt(value, label, min = 0, max = 1000) {
  if (!Number.isSafeInteger(value) || Number(value) < min || Number(value) > max) {
    throw new TypeError(`${label} must be an integer in ${min}..${max}`);
  }
  return Number(value);
}

/** @param {unknown} value @param {string} label */
export function requireCanonicalId(value, label) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9:._-]{0,95}$/.test(value)) {
    throw new TypeError(`${label} must be a canonical id`);
  }
  return value;
}

/** @param {unknown} value @param {string} label @returns {[number, number]} */
function requirePoint(value, label) {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new TypeError(`${label} must be an [x,z] point`);
  }
  return [
    requireCanonicalInt(value[0], `${label}[0]`),
    requireCanonicalInt(value[1], `${label}[1]`),
  ];
}

/**
 * The first tranche deliberately admits a canonical axis-aligned rectangle only.
 * Broader planar-face support belongs to the later W3 corpus packet.
 * @param {unknown} value
 * @param {string} label
 */
export function canonicalRectBounds(value, label = 'ring') {
  if (!Array.isArray(value) || value.length !== 4) {
    throw new TypeError(`${label} must contain four points`);
  }
  const ring = value.map((point, index) => requirePoint(point, `${label}[${index}]`));
  const xs = ring.map((point) => point[0]);
  const zs = ring.map((point) => point[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);
  const expected = [
    [minX, minZ], [maxX, minZ], [maxX, maxZ], [minX, maxZ],
  ];
  if (minX === maxX || minZ === maxZ || JSON.stringify(ring) !== JSON.stringify(expected)) {
    throw new TypeError(`${label} must be a non-empty canonical CCW rectangle`);
  }
  return { ring, minX, maxX, minZ, maxZ, widthQ: maxX - minX, depthQ: maxZ - minZ };
}

/** @template T @param {T} value @returns {Readonly<T>} */
export function deepFreezeCanonical(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(/** @type {Record<string, unknown>} */ (value))) {
      deepFreezeCanonical(child);
    }
    Object.freeze(value);
  }
  return /** @type {Readonly<T>} */ (value);
}

/** @param {Record<string, unknown>} artifact */
export function canonicalArtifactRef(artifact) {
  const source = requireCanonicalRecord(artifact, 'artifact ref source');
  const artifactId = requireCanonicalId(source.artifactId, 'artifact ref source.artifactId');
  if (typeof source.contentHash !== 'string' || source.contentHash.length === 0) {
    throw new TypeError('artifact ref source.contentHash must be exact');
  }
  return deepFreezeCanonical({ artifactId, contentHash: source.contentHash });
}

/**
 * @template {Record<string, unknown>} T
 * @param {T} value
 * @returns {Readonly<T & {contentHash:string}>}
 */
export function sealCanonicalArtifact(value) {
  return deepFreezeCanonical(/** @type {T & {contentHash:string}} */ ({
    ...value,
    contentHash: sceneDigest(value),
  }));
}

/**
 * @typedef {{
 *   artifactId:string,
 *   effectiveAt:string,
 *   blockFace:{blockId:string,ring:Array<[number,number]>},
 *   streetEdge:{edgeId:string,blockId:string,edgeIndex:number,setbackQ:number}
 * }} FabricFoundationInput
 */

/**
 * Seal the sole first-slice plan authority. Nothing is inferred from tier,
 * culture, wealth, evidence, or a renderer.
 * @param {FabricFoundationInput} input
 */
export function sealFabricFoundation(input) {
  const source = requireCanonicalRecord(input, 'fabric foundation');
  const artifactId = requireCanonicalId(source.artifactId, 'artifactId');
  if (typeof source.effectiveAt !== 'string' || source.effectiveAt.length === 0) {
    throw new TypeError('effectiveAt must be explicit');
  }
  const block = requireCanonicalRecord(source.blockFace, 'blockFace');
  const blockId = requireCanonicalId(block.blockId, 'blockFace.blockId');
  const bounds = canonicalRectBounds(block.ring, 'blockFace.ring');
  const street = requireCanonicalRecord(source.streetEdge, 'streetEdge');
  const edgeId = requireCanonicalId(street.edgeId, 'streetEdge.edgeId');
  if (street.blockId !== blockId) throw new TypeError('streetEdge.blockId must name the block');
  const edgeIndex = requireCanonicalInt(street.edgeIndex, 'streetEdge.edgeIndex', 0, 3);
  const setbackQ = requireCanonicalInt(street.setbackQ, 'streetEdge.setbackQ', 0, 250);
  const edgeDepthQ = edgeIndex % 2 === 0 ? bounds.depthQ : bounds.widthQ;
  if (setbackQ * 2 >= edgeDepthQ) throw new TypeError('street setback consumes the block depth');

  return sealCanonicalArtifact({
    artifactKind: 'SEALED_FABRIC_FOUNDATION',
    artifactId,
    schemaVersion: FABRIC_FOUNDATION_SCHEMA_VERSION,
    lawVersion: FABRIC_FOUNDATION_LAW_VERSION,
    coordinateAbiVersion: FABRIC_COORDINATE_ABI,
    mapTraditionId: CURRENT_MAP_TRADITION_ID,
    effectiveAt: source.effectiveAt,
    leafIndex: 0,
    ground: { kind: 'SURFACE', surfaceId: `${artifactId}:ground`, ring: bounds.ring },
    blockFaces: [{ blockId, ring: bounds.ring }],
    streetEdges: [{ edgeId, blockId, edgeIndex, setbackQ }],
  });
}
