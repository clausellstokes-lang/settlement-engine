/** Canonical coordinate-free planar DCEL for the admitted orthogonal cross. */

import { compareCodepoint } from '../../deterministicSort.js';
import { stableSceneStringify } from '../../townScene/stableScene.js';
import {
  CADASTRAL_BOUNDARY_ARRANGEMENT_LAW_VERSION,
  CADASTRAL_BOUNDARY_ARRANGEMENT_SCHEMA_VERSION,
  compileOrthogonalCrossCadastralArrangement,
} from './boundaryArrangement.js';
import { derivePlanarDcelEmbedding } from './dcelEmbedding.js';
import {
  CURRENT_MAP_TRADITION_ID, FABRIC_COORDINATE_ABI, canonicalArtifactRef,
  requireCanonicalId, requireCanonicalRecord, sealCanonicalArtifact,
} from './foundation.js';

export const PLANAR_DCEL_SCHEMA_VERSION = 1;
export const PLANAR_DCEL_LAW_VERSION = 'mf-t1d-orthogonal-cross-planar-dcel-v1';

const INPUT_KEYS = Object.freeze([
  'artifactId', 'boundaryArrangement', 'foundation', 'frontageSubdivision', 'streetGeometry',
]);

/** @param {unknown} value @param {string} label @param {readonly string[]} expected */
function exactRecord(value, label, expected) {
  const record = requireCanonicalRecord(value, label);
  const actual = Object.keys(record).sort(compareCodepoint);
  const wanted = [...expected].sort(compareCodepoint);
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    throw new TypeError(`${label} must contain exactly ${wanted.join(', ')}`);
  }
  return record;
}

/** @param {unknown} actual @param {unknown} expected @param {string} label */
function requireReplay(actual, expected, label) {
  if (stableSceneStringify(actual) !== stableSceneStringify(expected)) {
    throw new TypeError(`${label} does not replay through MF-T1A`);
  }
}

/** @param {ReturnType<typeof derivePlanarDcelEmbedding>} embedding */
function validateCensus(embedding) {
  const { vertices, halfEdges, faces, outerFaceId, outerFaceIds, componentCount, metrics } = embedding;
  const degrees = [...metrics.degrees].sort((left, right) => left - right);
  const lengths = [...metrics.cycleLengths].sort((left, right) => left - right);
  // ⚠ BigInt-SAFE, because MF-T2C's shoelace publishes exact areas: `0` and `0n` are not `===`,
  // so a Number-spelled comparison here would silently classify every area as neither negative
  // nor positive and the identity below would close over two empty lists.
  const negatives = metrics.area2s.filter((area2) => area2 < 0n);
  const positives = metrics.area2s.filter((area2) => area2 > 0n);
  if (vertices.length !== 24 || halfEdges.length !== 64 || faces.length !== 10
    || new Set(vertices.map((row) => row.vertexId)).size !== 24
    || new Set(halfEdges.map((row) => row.halfEdgeId)).size !== 64
    || new Set(faces.map((row) => row.faceId)).size !== 10
    || 24 - 32 + 10 !== 2
    || JSON.stringify(degrees) !== JSON.stringify([...Array(8).fill(2), ...Array(16).fill(3)])
    || JSON.stringify(lengths) !== JSON.stringify([...Array(8).fill(4), 16, 16])
    || negatives.length !== 1 || positives.length !== 9
    || positives.reduce((sum, area2) => sum + area2, 0n) !== -negatives[0]
    || faces.filter((face) => face.faceKind === 'EXTERIOR').length !== 1
    // ⭐ THE THREE ADDED INVARIANTS. On the admitted input the extension is INERT, and the seal
    // path is where that is enforced rather than assumed: one component, one outer face, and the
    // singular field agreeing with the plural one.
    || componentCount !== 1 || outerFaceIds.length !== 1 || outerFaceIds[0] !== outerFaceId
    || metrics.degenerateFaces !== 0 || metrics.holeCycles !== 0
    || !outerFaceId || faces.find((face) => face.faceId === outerFaceId)?.faceKind !== 'EXTERIOR') {
    throw new TypeError('PLANAR_DCEL must close at V24/E32/H64/F10 with one exterior face');
  }
}

/** @param {unknown} input */
export function compileOrthogonalCrossPlanarDcel(input) {
  const request = exactRecord(input, 'planar DCEL input', INPUT_KEYS);
  const artifactId = requireCanonicalId(request.artifactId, 'artifactId');
  const arrangement = requireCanonicalRecord(request.boundaryArrangement, 'boundaryArrangement');
  const rebuilt = compileOrthogonalCrossCadastralArrangement({
    artifactId: requireCanonicalId(arrangement.artifactId, 'boundaryArrangement.artifactId'),
    foundation: request.foundation,
    frontageSubdivision: request.frontageSubdivision,
    streetGeometry: request.streetGeometry,
  });
  requireReplay(arrangement, rebuilt, 'boundaryArrangement');
  if (arrangement.artifactKind !== 'CADASTRAL_BOUNDARY_ARRANGEMENT'
    || arrangement.schemaVersion !== CADASTRAL_BOUNDARY_ARRANGEMENT_SCHEMA_VERSION
    || arrangement.lawVersion !== CADASTRAL_BOUNDARY_ARRANGEMENT_LAW_VERSION
    || arrangement.coordinateAbiVersion !== FABRIC_COORDINATE_ABI
    || arrangement.mapTraditionId !== CURRENT_MAP_TRADITION_ID
    || arrangement.leafIndex !== 0 || arrangement.arrangementKind !== 'ORTHOGONAL_CROSS_POST_W3'
    || typeof arrangement.effectiveAt !== 'string' || arrangement.effectiveAt.length === 0
    || !Array.isArray(arrangement.boundaries)) {
    throw new TypeError('PLANAR_DCEL requires the exact admitted boundary arrangement');
  }
  const settlementId = requireCanonicalId(arrangement.settlementId, 'boundaryArrangement.settlementId');
  const boundaryArrangementRef = canonicalArtifactRef(arrangement);
  const embedding = derivePlanarDcelEmbedding({
    coordinateAbiVersion: FABRIC_COORDINATE_ABI, settlementId,
    arrangementRef: boundaryArrangementRef,
    boundaries: /** @type {Array<Record<string,unknown>>} */ (arrangement.boundaries),
  });
  validateCensus(embedding);
  return sealCanonicalArtifact({
    artifactKind: 'PLANAR_DCEL', artifactId,
    schemaVersion: PLANAR_DCEL_SCHEMA_VERSION, lawVersion: PLANAR_DCEL_LAW_VERSION,
    coordinateAbiVersion: FABRIC_COORDINATE_ABI, mapTraditionId: CURRENT_MAP_TRADITION_ID,
    settlementId, effectiveAt: arrangement.effectiveAt, leafIndex: 0,
    boundaryArrangementRef, embeddingKind: 'XZ_LEFT_FACE_V1', outerFaceId: embedding.outerFaceId,
    vertices: embedding.vertices, halfEdges: embedding.halfEdges,
    // ⛔ THE LEGACY PROJECTION, AND IT IS THE WHOLE REASON THE SEAL STAYS BYTE-IDENTICAL.
    // `sealCanonicalArtifact` digests the WHOLE record, so ONE added face key would move every
    // PLANAR_DCEL digest. MF-T2C's extended contract therefore lives on the in-memory embedding
    // and this line seals the v1 triple key-for-key; the stable serializer sorts keys, so the
    // projected records serialize exactly as they did before the extension existed.
    faces: embedding.faces.map(({ faceId, faceKind, boundaryHalfEdgeId }) => (
      { faceId, faceKind, boundaryHalfEdgeId })),
  });
}
