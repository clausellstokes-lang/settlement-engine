/** Transitional reference root for the admitted first-slice street and parcel fabric. */

import { compareCodepoint } from '../../deterministicSort.js';
import { stableSceneStringify } from '../../townScene/stableScene.js';
import {
  CURRENT_MAP_TRADITION_ID, FABRIC_COORDINATE_ABI, canonicalArtifactRef,
  requireCanonicalId, requireCanonicalRecord, sealCanonicalArtifact,
} from './foundation.js';
import { compileOrthogonalCrossParcelRegistry } from './parcelRegistry.js';
import { compileOrthogonalCrossStreetGraph } from './streetGraph.js';

export const FIRST_SLICE_FABRIC_ROOT_SCHEMA_VERSION = 1;
export const FIRST_SLICE_FABRIC_ROOT_LAW_VERSION =
  'mf-t1f-orthogonal-cross-first-slice-fabric-root-v1';

const INPUT_KEYS = Object.freeze([
  'artifactId', 'boundaryArrangement', 'foundation', 'frontageSubdivision',
  'parcelRegistry', 'planarDcel', 'streetGeometry', 'streetGraph',
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
    throw new TypeError(`${label} does not replay through its sole compiler`);
  }
}

/** @param {unknown} actual @param {{artifactId:string,contentHash:string}} expected @param {string} label */
function requireExactRef(actual, expected, label) {
  if (stableSceneStringify(actual) !== stableSceneStringify(expected)) {
    throw new TypeError(`${label} must equal its supplied source`);
  }
}

/** @param {Record<string,unknown>[]} sources @param {string} key @param {unknown} expected */
function requireShared(sources, key, expected) {
  if (sources.some((source) => source[key] !== expected)) {
    throw new TypeError(`${key} must agree across its exact source owners`);
  }
}

/** @param {unknown} input */
export function compileOrthogonalCrossFirstSliceFabricRoot(input) {
  const request = exactRecord(input, 'first-slice fabric root input', INPUT_KEYS);
  const artifactId = requireCanonicalId(request.artifactId, 'artifactId');
  const parcel = requireCanonicalRecord(request.parcelRegistry, 'parcelRegistry');
  const rebuiltParcel = compileOrthogonalCrossParcelRegistry({
    artifactId: requireCanonicalId(parcel.artifactId, 'parcelRegistry.artifactId'),
    foundation: request.foundation,
    frontageSubdivision: request.frontageSubdivision,
    streetGeometry: request.streetGeometry,
    boundaryArrangement: request.boundaryArrangement,
    planarDcel: request.planarDcel,
  });
  requireReplay(parcel, rebuiltParcel, 'parcelRegistry');
  const graph = requireCanonicalRecord(request.streetGraph, 'streetGraph');
  const rebuiltGraph = compileOrthogonalCrossStreetGraph({
    artifactId: requireCanonicalId(graph.artifactId, 'streetGraph.artifactId'),
    streetGeometry: request.streetGeometry,
  });
  requireReplay(graph, rebuiltGraph, 'streetGraph');

  const foundation = requireCanonicalRecord(request.foundation, 'foundation');
  const frontage = requireCanonicalRecord(request.frontageSubdivision, 'frontageSubdivision');
  const geometry = requireCanonicalRecord(request.streetGeometry, 'streetGeometry');
  const arrangement = requireCanonicalRecord(request.boundaryArrangement, 'boundaryArrangement');
  const dcel = requireCanonicalRecord(request.planarDcel, 'planarDcel');
  const allSources = [foundation, frontage, geometry, graph, arrangement, dcel, parcel];
  requireShared(allSources, 'coordinateAbiVersion', FABRIC_COORDINATE_ABI);
  const settlementId = requireCanonicalId(geometry.settlementId, 'streetGeometry.settlementId');
  const settlementSources = [geometry, graph, arrangement, dcel, parcel];
  requireShared(settlementSources, 'settlementId', settlementId);
  if (typeof foundation.effectiveAt !== 'string' || foundation.effectiveAt.length === 0) {
    throw new TypeError('foundation.effectiveAt must be exact');
  }
  const datedSources = [foundation, ...settlementSources];
  requireShared(datedSources, 'effectiveAt', foundation.effectiveAt);
  requireShared(datedSources, 'mapTraditionId', CURRENT_MAP_TRADITION_ID);
  requireShared(datedSources, 'leafIndex', 0);

  const foundationRef = canonicalArtifactRef(foundation);
  const frontageRegistryRef = canonicalArtifactRef(frontage);
  const streetGeometryRef = canonicalArtifactRef(geometry);
  const streetGraphRef = canonicalArtifactRef(graph);
  const cadastralBoundaryArrangementRef = canonicalArtifactRef(arrangement);
  const dcelRef = canonicalArtifactRef(dcel);
  const parcelRegistryRef = canonicalArtifactRef(parcel);
  requireExactRef(geometry.foundationRef, foundationRef, 'streetGeometry.foundationRef');
  requireExactRef(frontage.foundationRef, foundationRef, 'frontageSubdivision.foundationRef');
  requireExactRef(arrangement.foundationRef, foundationRef, 'boundaryArrangement.foundationRef');
  requireExactRef(arrangement.frontageSubdivisionRef, frontageRegistryRef,
    'boundaryArrangement.frontageSubdivisionRef');
  requireExactRef(arrangement.streetGeometryRef, streetGeometryRef,
    'boundaryArrangement.streetGeometryRef');
  requireExactRef(graph.streetGeometryRef, streetGeometryRef, 'streetGraph.streetGeometryRef');
  requireExactRef(dcel.boundaryArrangementRef, cadastralBoundaryArrangementRef,
    'planarDcel.boundaryArrangementRef');
  requireExactRef(parcel.frontageRegistryRef, frontageRegistryRef,
    'parcelRegistry.frontageRegistryRef');
  requireExactRef(parcel.boundaryArrangementRef, cadastralBoundaryArrangementRef,
    'parcelRegistry.boundaryArrangementRef');
  requireExactRef(parcel.dcelRef, dcelRef, 'parcelRegistry.dcelRef');

  return sealCanonicalArtifact({
    artifactKind: 'FIRST_SLICE_FABRIC_ROOT', artifactId,
    schemaVersion: FIRST_SLICE_FABRIC_ROOT_SCHEMA_VERSION,
    lawVersion: FIRST_SLICE_FABRIC_ROOT_LAW_VERSION,
    coordinateAbiVersion: FABRIC_COORDINATE_ABI, mapTraditionId: CURRENT_MAP_TRADITION_ID,
    settlementId, effectiveAt: foundation.effectiveAt, leafIndex: 0,
    streetGraphRef, streetGeometryRef, cadastralBoundaryArrangementRef, dcelRef,
    frontageRegistryRef, parcelRegistryRef,
  });
}
