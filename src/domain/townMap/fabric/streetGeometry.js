/** Canonical centerline geometry for the one admitted orthogonal-cross plan. */

import { compareCodepoint } from '../../deterministicSort.js';
import { sceneDigest } from '../../townScene/stableScene.js';
import {
  CURRENT_MAP_TRADITION_ID,
  FABRIC_COORDINATE_ABI,
  SETTLEMENT_FABRIC_FOUNDATION_LAW_VERSION,
  SETTLEMENT_FABRIC_FOUNDATION_SCHEMA_VERSION,
  canonicalArtifactRef,
  canonicalRectBounds,
  requireCanonicalId,
  requireCanonicalRecord,
  sealCanonicalArtifact,
} from './foundation.js';
import { ORTHOGONAL_CROSS_PLAN_KIND } from './settlementFoundation.js';

export const STREET_GEOMETRY_SCHEMA_VERSION = 1;
export const STREET_GEOMETRY_LAW_VERSION = 'mf-t1g-orthogonal-cross-street-geometry-v1';

const INPUT_KEYS = Object.freeze(['artifactId', 'foundation', 'settlementId']);
const FOUNDATION_KEYS = Object.freeze([
  'artifactId', 'artifactKind', 'blockFaces', 'contentHash', 'coordinateAbiVersion',
  'effectiveAt', 'ground', 'lawVersion', 'leafIndex', 'mapTraditionId', 'metrics',
  'planKind', 'schemaVersion', 'streetCorridors', 'streetEdges',
]);

/**
 * @param {unknown} value
 * @param {string} label
 * @param {readonly string[]} expected
 */
function exactRecord(value, label, expected) {
  const record = requireCanonicalRecord(value, label);
  const keys = Object.keys(record).sort(compareCodepoint);
  const wanted = [...expected].sort(compareCodepoint);
  if (JSON.stringify(keys) !== JSON.stringify(wanted)) {
    throw new TypeError(`${label} must contain exactly ${wanted.join(', ')}`);
  }
  return record;
}

/** @param {Record<string, unknown>} source */
function validateFoundationIdentity(source) {
  const contentHash = source.contentHash;
  if (typeof contentHash !== 'string' || contentHash.length === 0) {
    throw new TypeError('foundation.contentHash must be exact');
  }
  const { contentHash: _contentHash, ...body } = source;
  if (sceneDigest(body) !== contentHash) throw new TypeError('foundation content hash mismatch');
  if (source.artifactKind !== 'SEALED_FABRIC_FOUNDATION'
    || source.schemaVersion !== SETTLEMENT_FABRIC_FOUNDATION_SCHEMA_VERSION
    || source.lawVersion !== SETTLEMENT_FABRIC_FOUNDATION_LAW_VERSION
    || source.planKind !== ORTHOGONAL_CROSS_PLAN_KIND
    || source.mapTraditionId !== CURRENT_MAP_TRADITION_ID
    || source.leafIndex !== 0) {
    throw new TypeError('street geometry requires the admitted surface cross foundation');
  }
  requireCanonicalId(source.artifactId, 'foundation.artifactId');
  if (source.coordinateAbiVersion !== FABRIC_COORDINATE_ABI
    || typeof source.effectiveAt !== 'string' || source.effectiveAt.length === 0) {
    throw new TypeError('foundation ABI must be exact and effective time explicit');
  }
}

/**
 * @param {Record<string, unknown>} source
 * @param {{minX:number,maxX:number,minZ:number,maxZ:number}} ground
 */
function classifyCorridors(source, ground) {
  if (!Array.isArray(source.streetCorridors) || source.streetCorridors.length !== 2) {
    throw new TypeError('orthogonal cross requires exactly two street corridors');
  }
  const rows = source.streetCorridors.map((value, index) => {
    const corridor = exactRecord(value, `streetCorridors[${index}]`, ['ring', 'streetId']);
    const streetId = requireCanonicalId(corridor.streetId, `streetCorridors[${index}].streetId`);
    const bounds = canonicalRectBounds(corridor.ring, `streetCorridors[${index}].ring`);
    const vertical = bounds.minZ === ground.minZ && bounds.maxZ === ground.maxZ
      && bounds.minX > ground.minX && bounds.maxX < ground.maxX;
    const horizontal = bounds.minX === ground.minX && bounds.maxX === ground.maxX
      && bounds.minZ > ground.minZ && bounds.maxZ < ground.maxZ;
    if (vertical === horizontal) throw new TypeError('street corridor must have one exact orientation');
    return { streetId, bounds, orientation: vertical ? 'VERTICAL' : 'HORIZONTAL' };
  });
  if (new Set(rows.map((row) => row.streetId)).size !== 2) {
    throw new TypeError('street corridors require distinct source street IDs');
  }
  const vertical = rows.find((row) => row.orientation === 'VERTICAL');
  const horizontal = rows.find((row) => row.orientation === 'HORIZONTAL');
  if (!vertical || !horizontal) throw new TypeError('orthogonal cross requires one corridor per axis');
  return { vertical, horizontal };
}

/**
 * Compile four exact centerline legs without creating graph or route authority.
 * @param {unknown} input
 */
export function compileOrthogonalCrossStreetGeometry(input) {
  const request = exactRecord(input, 'street geometry input', INPUT_KEYS);
  const artifactId = requireCanonicalId(request.artifactId, 'artifactId');
  const settlementId = requireCanonicalId(request.settlementId, 'settlementId');
  const foundation = exactRecord(request.foundation, 'foundation', FOUNDATION_KEYS);
  validateFoundationIdentity(foundation);
  const groundRecord = exactRecord(foundation.ground, 'foundation.ground', ['kind', 'ring', 'surfaceId']);
  if (groundRecord.kind !== 'SURFACE') throw new TypeError('street geometry requires surface ground');
  requireCanonicalId(groundRecord.surfaceId, 'foundation.ground.surfaceId');
  const ground = canonicalRectBounds(groundRecord.ring, 'foundation.ground.ring');
  const { vertical, horizontal } = classifyCorridors(foundation, ground);
  const junctionXQ = Math.floor((vertical.bounds.minX + vertical.bounds.maxX) / 2);
  const junctionZQ = Math.floor((horizontal.bounds.minZ + horizontal.bounds.maxZ) / 2);
  const junctionPoint = [junctionXQ, junctionZQ];
  const definitions = [
    { direction: 'LOW_X', sourceStreetId: horizontal.streetId, boundary: [ground.minX, junctionZQ] },
    { direction: 'HIGH_X', sourceStreetId: horizontal.streetId, boundary: [ground.maxX, junctionZQ] },
    { direction: 'LOW_Z', sourceStreetId: vertical.streetId, boundary: [junctionXQ, ground.minZ] },
    { direction: 'HIGH_Z', sourceStreetId: vertical.streetId, boundary: [junctionXQ, ground.maxZ] },
  ];
  const segments = definitions.map(({ direction, sourceStreetId, boundary }) => {
    if (boundary[0] === junctionXQ && boundary[1] === junctionZQ) {
      throw new TypeError('street segment must have positive length');
    }
    return {
      segmentId: requireCanonicalId(
        `${settlementId}:street-segment:${direction.toLowerCase()}`,
        `segment ${direction} id`,
      ),
      sourceStreetId,
      direction,
      line: [junctionPoint, boundary],
    };
  }).sort((left, right) => compareCodepoint(left.segmentId, right.segmentId));
  return sealCanonicalArtifact({
    artifactKind: 'STREET_GEOMETRY',
    artifactId,
    schemaVersion: STREET_GEOMETRY_SCHEMA_VERSION,
    lawVersion: STREET_GEOMETRY_LAW_VERSION,
    coordinateAbiVersion: foundation.coordinateAbiVersion,
    mapTraditionId: foundation.mapTraditionId,
    settlementId,
    effectiveAt: foundation.effectiveAt,
    leafIndex: 0,
    foundationRef: canonicalArtifactRef(foundation),
    midpointRounding: 'FLOOR_Q',
    junction: {
      junctionId: requireCanonicalId(`${settlementId}:street-junction:cross`, 'junctionId'),
      point: junctionPoint,
    },
    segments,
  });
}
