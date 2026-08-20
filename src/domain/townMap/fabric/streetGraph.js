/** Reference-only incidence graph for the admitted orthogonal-cross streets. */

import { compareCodepoint } from '../../deterministicSort.js';
import { sceneDigest } from '../../townScene/stableScene.js';
import {
  CURRENT_MAP_TRADITION_ID,
  FABRIC_COORDINATE_ABI,
  canonicalArtifactRef,
  requireCanonicalId,
  requireCanonicalInt,
  requireCanonicalRecord,
  sealCanonicalArtifact,
} from './foundation.js';
import {
  STREET_GEOMETRY_LAW_VERSION,
  STREET_GEOMETRY_SCHEMA_VERSION,
} from './streetGeometry.js';

export const STREET_GRAPH_SCHEMA_VERSION = 1;
export const STREET_GRAPH_LAW_VERSION = 'mf-t1n-orthogonal-cross-street-graph-v1';

const INPUT_KEYS = Object.freeze(['artifactId', 'streetGeometry']);
const GEOMETRY_KEYS = Object.freeze([
  'artifactId', 'artifactKind', 'contentHash', 'coordinateAbiVersion', 'effectiveAt',
  'foundationRef', 'junction', 'lawVersion', 'leafIndex', 'mapTraditionId',
  'midpointRounding', 'schemaVersion', 'segments', 'settlementId',
]);
const DIRECTIONS = Object.freeze(['HIGH_X', 'HIGH_Z', 'LOW_X', 'LOW_Z']);

/** @param {unknown} value @param {string} label @param {readonly string[]} expected */
function exactRecord(value, label, expected) {
  const record = requireCanonicalRecord(value, label);
  const keys = Object.keys(record).sort(compareCodepoint);
  const wanted = [...expected].sort(compareCodepoint);
  if (JSON.stringify(keys) !== JSON.stringify(wanted)) {
    throw new TypeError(`${label} must contain exactly ${wanted.join(', ')}`);
  }
  return record;
}

/** @param {unknown} value @param {string} label @returns {[number,number]} */
function exactPoint(value, label) {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new TypeError(`${label} must be an exact point`);
  }
  return [
    requireCanonicalInt(value[0], `${label}[0]`),
    requireCanonicalInt(value[1], `${label}[1]`),
  ];
}

/** @param {Record<string,unknown>} geometry */
function validateGeometryIdentity(geometry) {
  if (typeof geometry.contentHash !== 'string' || geometry.contentHash.length === 0) {
    throw new TypeError('streetGeometry.contentHash must be exact');
  }
  const { contentHash, ...body } = geometry;
  if (sceneDigest(body) !== contentHash) throw new TypeError('streetGeometry content hash mismatch');
  if (geometry.artifactKind !== 'STREET_GEOMETRY'
    || geometry.schemaVersion !== STREET_GEOMETRY_SCHEMA_VERSION
    || geometry.lawVersion !== STREET_GEOMETRY_LAW_VERSION
    || geometry.coordinateAbiVersion !== FABRIC_COORDINATE_ABI
    || geometry.mapTraditionId !== CURRENT_MAP_TRADITION_ID
    || geometry.leafIndex !== 0 || geometry.midpointRounding !== 'FLOOR_Q') {
    throw new TypeError('street graph requires the exact admitted street geometry');
  }
  requireCanonicalId(geometry.artifactId, 'streetGeometry.artifactId');
  requireCanonicalId(geometry.settlementId, 'streetGeometry.settlementId');
  if (typeof geometry.effectiveAt !== 'string' || geometry.effectiveAt.length === 0) {
    throw new TypeError('streetGeometry.effectiveAt must be explicit');
  }
  const foundationRef = exactRecord(
    geometry.foundationRef,
    'streetGeometry.foundationRef',
    ['artifactId', 'contentHash'],
  );
  requireCanonicalId(foundationRef.artifactId, 'streetGeometry.foundationRef.artifactId');
  if (typeof foundationRef.contentHash !== 'string' || foundationRef.contentHash.length === 0) {
    throw new TypeError('streetGeometry.foundationRef.contentHash must be exact');
  }
}

/** @param {Record<string,unknown>} geometry */
function validateGeometryRows(geometry) {
  const settlementId = String(geometry.settlementId);
  const junction = exactRecord(geometry.junction, 'streetGeometry.junction', ['junctionId', 'point']);
  const junctionId = requireCanonicalId(junction.junctionId, 'streetGeometry.junction.junctionId');
  if (junctionId !== `${settlementId}:street-junction:cross`) {
    throw new TypeError('streetGeometry junction identity mismatch');
  }
  const junctionPoint = exactPoint(junction.point, 'streetGeometry.junction.point');
  if (!Array.isArray(geometry.segments) || geometry.segments.length !== 4) {
    throw new TypeError('streetGeometry must contain four segments');
  }
  const segments = geometry.segments.map((value, index) => {
    const segment = exactRecord(value, `streetGeometry.segments[${index}]`, [
      'direction', 'line', 'segmentId', 'sourceStreetId',
    ]);
    const direction = String(segment.direction);
    const segmentId = requireCanonicalId(segment.segmentId, `segments[${index}].segmentId`);
    const sourceStreetId = requireCanonicalId(segment.sourceStreetId, `segments[${index}].sourceStreetId`);
    if (!DIRECTIONS.includes(direction)
      || segmentId !== `${settlementId}:street-segment:${direction.toLowerCase()}`) {
      throw new TypeError('streetGeometry segment identity or direction mismatch');
    }
    if (!Array.isArray(segment.line) || segment.line.length !== 2) {
      throw new TypeError('streetGeometry segment line must have two endpoints');
    }
    const start = exactPoint(segment.line[0], `segments[${index}].line[0]`);
    const end = exactPoint(segment.line[1], `segments[${index}].line[1]`);
    if (JSON.stringify(start) !== JSON.stringify(junctionPoint)) {
      throw new TypeError('streetGeometry segment must start at the junction');
    }
    const validDirection = direction === 'LOW_X' ? end[0] < start[0] && end[1] === start[1]
      : direction === 'HIGH_X' ? end[0] > start[0] && end[1] === start[1]
        : direction === 'LOW_Z' ? end[1] < start[1] && end[0] === start[0]
          : end[1] > start[1] && end[0] === start[0];
    if (!validDirection) throw new TypeError('streetGeometry segment axis or sign mismatch');
    return { direction, segmentId, sourceStreetId };
  });
  if (JSON.stringify(segments.map((row) => row.direction).sort(compareCodepoint))
    !== JSON.stringify(DIRECTIONS)
    || JSON.stringify(segments.map((row) => row.segmentId))
      !== JSON.stringify(segments.map((row) => row.segmentId).sort(compareCodepoint))) {
    throw new TypeError('streetGeometry directions and ordering must be canonical');
  }
  const byDirection = new Map(segments.map((row) => [row.direction, row]));
  const xStreet = byDirection.get('HIGH_X')?.sourceStreetId;
  const zStreet = byDirection.get('HIGH_Z')?.sourceStreetId;
  if (!xStreet || !zStreet || xStreet === zStreet
    || byDirection.get('LOW_X')?.sourceStreetId !== xStreet
    || byDirection.get('LOW_Z')?.sourceStreetId !== zStreet) {
    throw new TypeError('streetGeometry source street pairing mismatch');
  }
  return { junctionId, segments };
}

/** @param {unknown} input */
export function compileOrthogonalCrossStreetGraph(input) {
  const request = exactRecord(input, 'street graph input', INPUT_KEYS);
  const artifactId = requireCanonicalId(request.artifactId, 'artifactId');
  const geometry = exactRecord(request.streetGeometry, 'streetGeometry', GEOMETRY_KEYS);
  validateGeometryIdentity(geometry);
  const { junctionId, segments } = validateGeometryRows(geometry);
  const sourceRef = canonicalArtifactRef(geometry);
  const junctionNode = {
    nodeId: junctionId,
    role: 'JUNCTION',
    geometryRef: { ...sourceRef, kind: 'JUNCTION', junctionId },
  };
  const endpointNodes = segments.map((segment) => ({
    nodeId: requireCanonicalId(
      `${geometry.settlementId}:street-node:${segment.direction.toLowerCase()}`,
      `extent node ${segment.direction}`,
    ),
    role: 'EXTENT_ENDPOINT',
    geometryRef: { ...sourceRef, kind: 'SEGMENT_ENDPOINT', segmentId: segment.segmentId, endpointIndex: 1 },
  }));
  const nodeByDirection = new Map(endpointNodes.map((node, index) => [segments[index].direction, node]));
  const edges = segments.map((segment) => {
    const endpointNode = nodeByDirection.get(segment.direction);
    if (!endpointNode) throw new TypeError('street graph endpoint resolution mismatch');
    return {
      edgeId: segment.segmentId,
      sourceStreetId: segment.sourceStreetId,
      endpointNodeIds: [junctionId, endpointNode.nodeId],
      geometryRef: { ...sourceRef, kind: 'SEGMENT', segmentId: segment.segmentId },
    };
  }).sort((left, right) => compareCodepoint(left.edgeId, right.edgeId));
  const nodes = [junctionNode, ...endpointNodes]
    .sort((left, right) => compareCodepoint(left.nodeId, right.nodeId));
  return sealCanonicalArtifact({
    artifactKind: 'STREET_GRAPH',
    artifactId,
    schemaVersion: STREET_GRAPH_SCHEMA_VERSION,
    lawVersion: STREET_GRAPH_LAW_VERSION,
    coordinateAbiVersion: geometry.coordinateAbiVersion,
    mapTraditionId: geometry.mapTraditionId,
    settlementId: geometry.settlementId,
    effectiveAt: geometry.effectiveAt,
    leafIndex: 0,
    streetGeometryRef: sourceRef,
    graphKind: 'UNDIRECTED_INCIDENCE',
    nodes,
    edges,
  });
}
