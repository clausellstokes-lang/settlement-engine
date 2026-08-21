/**
 * The small canonical fabric foundation used by the first map vertical slice.
 * It accepts only explicit integer geometry and seals exactly one surface block.
 */

import { sceneDigest } from '../../townScene/stableScene.js';
import { MAX_WORLD_UNITS } from './coordinateAbi.js';
import {
  ORTHOGONAL_CROSS_PLAN_KIND,
  deriveOrthogonalCrossRows,
  prepareOrthogonalCrossPlan,
} from './settlementFoundation.js';

export const FABRIC_FOUNDATION_SCHEMA_VERSION = 1;
export const FABRIC_FOUNDATION_LAW_VERSION = 'mf-w3-explicit-v1';
export const SETTLEMENT_FABRIC_FOUNDATION_SCHEMA_VERSION = 2;
export const SETTLEMENT_FABRIC_FOUNDATION_LAW_VERSION = 'mf-w3-orthogonal-cross-v1';
export const FABRIC_COORDINATE_ABI = 'plan-q1-0-1000-v1';
export const CURRENT_MAP_TRADITION_ID = 'EUROPEAN_FANTASY_BASE';

/** @param {unknown} value @param {string} label @returns {Record<string, unknown>} */
export function requireCanonicalRecord(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  return /** @type {Record<string, unknown>} */ (value);
}

/**
 * ⭐ MF-T2B — the defaults are now the COORDINATE ABI's envelope, not the fixture-era
 * `0..1000` wall. ODQ §303.5: *"D1's versioned ABI wins… the codex 0..1000 wall is a
 * fixture-era constraint; the ported record shapes re-parameterize onto the ABI."* The wall
 * was always a DEFAULT PARAMETER rather than a constant, so re-parameterising is argument
 * threading at the call sites and every explicit-range caller is untouched. ⛔ Widening an
 * acceptance range changes only which inputs THROW; it cannot change the representation of an
 * input that was already accepted, so `FABRIC_COORDINATE_ABI` and every artifact digest stay
 * exactly where they were.
 * @param {unknown} value @param {string} label @param {number} [min] @param {number} [max]
 */
export function requireCanonicalInt(value, label, min = -MAX_WORLD_UNITS, max = MAX_WORLD_UNITS) {
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

/** @param {Record<string,unknown>} source @param {string} artifactId */
function sealOrthogonalCrossFoundation(source, artifactId) {
  if (source.blockFace !== undefined || source.streetEdge !== undefined) {
    throw new TypeError('orthogonal cross input forbids legacy blockFace and streetEdge');
  }
  const prepared = prepareOrthogonalCrossPlan(source.plan, {
    canonicalRectBounds, requireCanonicalId, requireCanonicalInt, requireCanonicalRecord,
  });
  const { bounds, setbackQ } = prepared;
  const rows = deriveOrthogonalCrossRows(
    /** @type {Parameters<typeof deriveOrthogonalCrossRows>[0]} */ (prepared),
  );
  for (const block of rows.blockFaces) {
    const blockBounds = canonicalRectBounds(block.ring, `block ${block.blockId}`);
    const edge = rows.streetEdges.find((row) => row.blockId === block.blockId);
    if (!edge) throw new TypeError('settlement block is missing its street edge');
    const depthQ = edge.edgeIndex % 2 === 0 ? blockBounds.depthQ : blockBounds.widthQ;
    if (setbackQ * 2 >= depthQ) throw new TypeError('street setback consumes a settlement block');
  }
  return sealCanonicalArtifact({
    artifactKind: 'SEALED_FABRIC_FOUNDATION', artifactId,
    schemaVersion: SETTLEMENT_FABRIC_FOUNDATION_SCHEMA_VERSION,
    lawVersion: SETTLEMENT_FABRIC_FOUNDATION_LAW_VERSION,
    coordinateAbiVersion: FABRIC_COORDINATE_ABI,
    mapTraditionId: CURRENT_MAP_TRADITION_ID,
    effectiveAt: source.effectiveAt,
    leafIndex: 0,
    planKind: ORTHOGONAL_CROSS_PLAN_KIND,
    ground: { kind: 'SURFACE', surfaceId: `${artifactId}:ground`, ring: bounds.ring },
    ...rows,
  });
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
  if (source.plan !== undefined) return sealOrthogonalCrossFoundation(source, artifactId);
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
