/** Reference-only plot/frontage/DCEL-face bindings for the admitted cross. */

import { compareCodepoint } from '../../deterministicSort.js';
import { stableSceneStringify } from '../../townScene/stableScene.js';
import {
  CADASTRAL_BOUNDARY_ARRANGEMENT_LAW_VERSION,
  CADASTRAL_BOUNDARY_ARRANGEMENT_SCHEMA_VERSION,
} from './boundaryArrangement.js';
import {
  PLANAR_DCEL_LAW_VERSION, PLANAR_DCEL_SCHEMA_VERSION,
  compileOrthogonalCrossPlanarDcel,
} from './dcel.js';
import {
  CURRENT_MAP_TRADITION_ID, FABRIC_COORDINATE_ABI, canonicalArtifactRef,
  requireCanonicalId, requireCanonicalInt, requireCanonicalRecord, sealCanonicalArtifact,
} from './foundation.js';
import { SETTLEMENT_FRONTAGE_SUBDIVISION_LAW_VERSION } from './frontage.js';

export const PARCEL_REGISTRY_SCHEMA_VERSION = 1;
export const PARCEL_REGISTRY_LAW_VERSION = 'mf-t1p-orthogonal-cross-parcel-registry-v1';

const INPUT_KEYS = Object.freeze([
  'artifactId', 'boundaryArrangement', 'foundation', 'frontageSubdivision',
  'planarDcel', 'streetGeometry',
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
    throw new TypeError(`${label} does not replay through MF-T1D`);
  }
}

/** @param {unknown} value @param {string} label */
function requireSourceSelector(value, label) {
  if (typeof value !== 'string' || value.length === 0) throw new TypeError(`${label} must be exact`);
  return value;
}

/** @param {readonly string[]} values */
function boundarySetKey(values) {
  return JSON.stringify([...values].sort(compareCodepoint));
}

/**
 * @param {Record<string,unknown>} arrangement
 * @param {readonly string[]} plotIds
 */
function plotBoundarySets(arrangement, plotIds) {
  /** @type {Map<string,Map<number,string>>} */
  const byPlot = new Map(plotIds.map((plotId) => [plotId, new Map()]));
  if (!Array.isArray(arrangement.boundaries)) throw new TypeError('arrangement boundaries are required');
  for (const value of arrangement.boundaries) {
    const boundary = requireCanonicalRecord(value, 'boundary');
    const boundaryId = requireCanonicalId(boundary.boundaryId, 'boundary.boundaryId');
    const source = requireCanonicalRecord(boundary.source, `boundary ${boundaryId}.source`);
    const members = Array.isArray(source.plotEdges)
      ? source.plotEdges : source.plotEdge === undefined ? [] : [source.plotEdge];
    for (const memberValue of members) {
      const member = requireCanonicalRecord(memberValue, `boundary ${boundaryId} plot edge`);
      const plotId = requireCanonicalId(member.plotId, 'plot edge.plotId');
      const edgeIndex = requireCanonicalInt(member.edgeIndex, 'plot edge.edgeIndex', 0, 3);
      const indexes = byPlot.get(plotId);
      if (!indexes || indexes.has(edgeIndex)) {
        throw new TypeError('plot edge lineage must resolve exactly once');
      }
      indexes.set(edgeIndex, boundaryId);
    }
  }
  /** @type {Map<string,readonly string[]>} */
  const result = new Map();
  for (const [plotId, indexes] of byPlot) {
    const ids = [0, 1, 2, 3].map((index) => indexes.get(index));
    if (ids.some((id) => id === undefined) || new Set(ids).size !== 4) {
      throw new TypeError(`plot ${plotId} must own four distinct lineage boundaries`);
    }
    result.set(plotId, /** @type {string[]} */ (ids).sort(compareCodepoint));
  }
  return result;
}

/**
 * @param {Record<string,unknown>} dcel
 * @param {{artifactId:string,contentHash:string}} arrangementRef
 */
function faceBoundarySets(dcel, arrangementRef) {
  if (!Array.isArray(dcel.halfEdges) || !Array.isArray(dcel.faces)) {
    throw new TypeError('DCEL half-edges and faces are required');
  }
  /** @type {Map<string,Record<string,unknown>>} */
  const halfEdges = new Map();
  for (const value of dcel.halfEdges) {
    const halfEdge = requireCanonicalRecord(value, 'half-edge');
    const halfEdgeId = requireCanonicalId(halfEdge.halfEdgeId, 'halfEdgeId');
    if (halfEdges.has(halfEdgeId)) throw new TypeError('half-edge IDs must be unique');
    halfEdges.set(halfEdgeId, halfEdge);
  }
  /** @type {Array<{faceId:string,faceKind:string,boundaryIds:readonly string[]}>} */
  const result = [];
  for (const value of dcel.faces) {
    const face = requireCanonicalRecord(value, 'face');
    const faceId = requireCanonicalId(face.faceId, 'face.faceId');
    const faceKind = face.faceKind;
    if (faceKind !== 'BOUNDED' && faceKind !== 'EXTERIOR') {
      throw new TypeError('face kind must be BOUNDED or EXTERIOR');
    }
    const start = requireCanonicalId(face.boundaryHalfEdgeId, `face ${faceId} start`);
    const visited = new Set(); const boundaryIds = new Set(); let current = start;
    while (!visited.has(current)) {
      const halfEdge = halfEdges.get(current);
      if (!halfEdge || halfEdge.faceId !== faceId) {
        throw new TypeError(`face ${faceId} traversal must remain on one face`);
      }
      visited.add(current);
      const boundaryRef = requireCanonicalRecord(halfEdge.boundaryRef, `half-edge ${current} boundaryRef`);
      const boundaryId = requireCanonicalId(boundaryRef.boundaryId, 'boundaryRef.boundaryId');
      if (boundaryRef.kind !== 'BOUNDARY'
        || boundaryRef.artifactId !== arrangementRef.artifactId
        || boundaryRef.contentHash !== arrangementRef.contentHash
        || boundaryIds.has(boundaryId)) {
        throw new TypeError('face boundary references must be exact and unique');
      }
      boundaryIds.add(boundaryId);
      current = requireCanonicalId(halfEdge.nextHalfEdgeId, `half-edge ${current} nextHalfEdgeId`);
      if (visited.size > halfEdges.size) throw new TypeError('face traversal does not close');
    }
    if (current !== start) throw new TypeError(`face ${faceId} traversal must close at its declared start`);
    result.push({ faceId, faceKind, boundaryIds: [...boundaryIds].sort(compareCodepoint) });
  }
  return result;
}

/** @param {unknown} input */
export function compileOrthogonalCrossParcelRegistry(input) {
  const request = exactRecord(input, 'parcel registry input', INPUT_KEYS);
  const artifactId = requireCanonicalId(request.artifactId, 'artifactId');
  const sourceDcel = requireCanonicalRecord(request.planarDcel, 'planarDcel');
  const rebuiltDcel = compileOrthogonalCrossPlanarDcel({
    artifactId: requireCanonicalId(sourceDcel.artifactId, 'planarDcel.artifactId'),
    foundation: request.foundation,
    frontageSubdivision: request.frontageSubdivision,
    streetGeometry: request.streetGeometry,
    boundaryArrangement: request.boundaryArrangement,
  });
  requireReplay(sourceDcel, rebuiltDcel, 'planarDcel');
  const subdivision = requireCanonicalRecord(request.frontageSubdivision, 'frontageSubdivision');
  const arrangement = requireCanonicalRecord(request.boundaryArrangement, 'boundaryArrangement');
  if (subdivision.artifactKind !== 'FRONTAGE_SUBDIVISION'
    || subdivision.lawVersion !== SETTLEMENT_FRONTAGE_SUBDIVISION_LAW_VERSION
    || subdivision.coordinateAbiVersion !== FABRIC_COORDINATE_ABI
    || arrangement.artifactKind !== 'CADASTRAL_BOUNDARY_ARRANGEMENT'
    || arrangement.schemaVersion !== CADASTRAL_BOUNDARY_ARRANGEMENT_SCHEMA_VERSION
    || arrangement.lawVersion !== CADASTRAL_BOUNDARY_ARRANGEMENT_LAW_VERSION
    || sourceDcel.artifactKind !== 'PLANAR_DCEL'
    || sourceDcel.schemaVersion !== PLANAR_DCEL_SCHEMA_VERSION
    || sourceDcel.lawVersion !== PLANAR_DCEL_LAW_VERSION
    || sourceDcel.coordinateAbiVersion !== FABRIC_COORDINATE_ABI
    || sourceDcel.mapTraditionId !== CURRENT_MAP_TRADITION_ID
    || sourceDcel.leafIndex !== 0) {
    throw new TypeError('parcel registry sources are not the exact admitted artifacts');
  }
  if (!Array.isArray(subdivision.plots) || subdivision.plots.length !== 8
    || !Array.isArray(subdivision.frontages) || subdivision.frontages.length !== 8) {
    throw new TypeError('parcel registry requires eight plots and eight frontages');
  }
  const plots = subdivision.plots.map((value) => requireCanonicalRecord(value, 'plot'));
  const plotIds = plots.map((plot) => requireCanonicalId(plot.plotId, 'plot.plotId'));
  if (new Set(plotIds).size !== 8) throw new TypeError('plot IDs must be unique');
  const frontageByPlot = new Map(); const frontageIds = new Set();
  for (const value of subdivision.frontages) {
    const frontage = requireCanonicalRecord(value, 'frontage');
    const plotId = requireCanonicalId(frontage.plotId, 'frontage.plotId');
    const frontageId = requireSourceSelector(frontage.frontageId, 'frontage.frontageId');
    if (frontageByPlot.has(plotId) || frontageIds.has(frontageId)) {
      throw new TypeError('frontage bindings must be unique');
    }
    frontageByPlot.set(plotId, frontage); frontageIds.add(frontageId);
  }
  const frontageRegistryRef = canonicalArtifactRef(subdivision);
  const boundaryArrangementRef = canonicalArtifactRef(arrangement);
  const dcelRef = canonicalArtifactRef(sourceDcel);
  const plotSets = plotBoundarySets(arrangement, plotIds);
  const faceSets = faceBoundarySets(sourceDcel, boundaryArrangementRef);
  const bounded = faceSets.filter((face) => face.faceKind === 'BOUNDED');
  const exterior = faceSets.filter((face) => face.faceKind === 'EXTERIOR');
  if (bounded.length !== 9 || exterior.length !== 1 || exterior[0].faceId !== sourceDcel.outerFaceId) {
    throw new TypeError('parcel registry requires nine bounded faces and one exterior face');
  }
  const facesBySet = new Map();
  for (const face of bounded) {
    const key = boundarySetKey(face.boundaryIds);
    const matches = facesBySet.get(key) ?? [];
    matches.push(face); facesBySet.set(key, matches);
  }
  const usedFaces = new Set();
  const parcels = plots.map((plot) => {
    const plotId = requireCanonicalId(plot.plotId, 'plot.plotId');
    const frontage = frontageByPlot.get(plotId);
    const frontageId = requireSourceSelector(plot.frontageId, `plot ${plotId}.frontageId`);
    if (!frontage || frontage.frontageId !== frontageId) {
      throw new TypeError(`plot ${plotId} must resolve its exact frontage`);
    }
    const matches = facesBySet.get(boundarySetKey(plotSets.get(plotId) ?? [])) ?? [];
    if (matches.length !== 1 || matches[0].boundaryIds.length !== 4
      || usedFaces.has(matches[0].faceId)) {
      throw new TypeError(`plot ${plotId} must resolve one distinct four-edge bounded face`);
    }
    const faceId = matches[0].faceId; usedFaces.add(faceId);
    return {
      parcelId: plotId,
      plotRef: { ...frontageRegistryRef, plotId },
      frontageRef: { ...frontageRegistryRef, frontageId },
      faceRef: { ...dcelRef, faceId },
    };
  }).sort((left, right) => compareCodepoint(left.parcelId, right.parcelId));
  const unusedBounded = bounded.filter((face) => !usedFaces.has(face.faceId));
  if (parcels.length !== 8 || usedFaces.size !== 8
    || unusedBounded.length !== 1 || unusedBounded[0].boundaryIds.length !== 16) {
    throw new TypeError('exactly the sixteen-edge cross face must remain unbound');
  }
  const settlementId = requireCanonicalId(sourceDcel.settlementId, 'planarDcel.settlementId');
  if (typeof sourceDcel.effectiveAt !== 'string' || sourceDcel.effectiveAt.length === 0) {
    throw new TypeError('planarDcel.effectiveAt must be exact');
  }
  return sealCanonicalArtifact({
    artifactKind: 'PARCEL_REGISTRY', artifactId,
    schemaVersion: PARCEL_REGISTRY_SCHEMA_VERSION, lawVersion: PARCEL_REGISTRY_LAW_VERSION,
    coordinateAbiVersion: FABRIC_COORDINATE_ABI, mapTraditionId: CURRENT_MAP_TRADITION_ID,
    settlementId, effectiveAt: sourceDcel.effectiveAt, leafIndex: 0,
    registryKind: 'ORTHOGONAL_CROSS_POST_W3_FACE_BINDING', frontageRegistryRef,
    boundaryArrangementRef, dcelRef, parcels,
  });
}
