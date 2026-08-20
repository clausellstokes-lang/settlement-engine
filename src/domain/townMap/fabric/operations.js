/** One bounded registered fantasy construction operation. */

import { compileExplicitBuildingMass } from './building.js';
import { assertFirstSliceMutable, createFirstSliceDocument } from './content.js';
import {
  canonicalArtifactRef,
  requireCanonicalId,
  requireCanonicalRecord,
  sealCanonicalArtifact,
} from './foundation.js';

export const FANTASY_CONSTRUCTION_OPERATION_KIND = 'CONSTRUCT_EXPLICIT_BUILDING';
export const FANTASY_CANON_GATE = 'EXPLICIT_FANTASY_CANON';

/** @param {unknown} value @param {string} label @param {string[]} keys */
function exactRecord(value, label, keys) {
  const record = requireCanonicalRecord(value, label);
  const actual = Object.keys(record).sort();
  const expected = [...keys].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new TypeError(`${label} must contain exactly ${expected.join(', ')}`);
  }
  return record;
}

/** @param {{mechanismId:string,mechanismVersion:string|number,allowedSemanticTypeIds:string[]}} input */
export function registerFantasyConstructionMechanism(input) {
  const source = exactRecord(input, 'fantasy mechanism', [
    'allowedSemanticTypeIds', 'mechanismId', 'mechanismVersion',
  ]);
  if (!Array.isArray(source.allowedSemanticTypeIds) || source.allowedSemanticTypeIds.length === 0) {
    throw new TypeError('fantasy mechanism needs an allowed semantic type');
  }
  const allowedSemanticTypeIds = source.allowedSemanticTypeIds
    .map((value) => requireCanonicalId(value, 'allowedSemanticTypeId'))
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  if (new Set(allowedSemanticTypeIds).size !== allowedSemanticTypeIds.length) {
    throw new TypeError('fantasy mechanism semantic types must be unique');
  }
  return sealCanonicalArtifact({
    artifactKind: 'REGISTERED_FANTASY_MECHANISM',
    artifactId: requireCanonicalId(source.mechanismId, 'mechanismId'),
    mechanismVersion: source.mechanismVersion,
    gate: FANTASY_CANON_GATE,
    operationKind: FANTASY_CONSTRUCTION_OPERATION_KIND,
    allowedSemanticTypeIds,
  });
}

/**
 * @param {{operationId:string,beforeDocumentRef:{artifactId:string,contentHash:string},
 *   mechanismRef:{artifactId:string,contentHash:string},spec:Record<string,unknown>,
 *   recipeSnapshot:Record<string,unknown>,origin:Record<string,unknown>}} input
 */
export function createFantasyConstructionOperation(input) {
  const source = exactRecord(input, 'fantasy construction operation', [
    'beforeDocumentRef', 'mechanismRef', 'operationId', 'origin', 'recipeSnapshot', 'spec',
  ]);
  const operationId = requireCanonicalId(source.operationId, 'operationId');
  const spec = requireCanonicalRecord(source.spec, 'operation.spec');
  if (spec.constructionOperationId !== operationId) {
    throw new TypeError('building constructionOperationId must equal operationId');
  }
  return sealCanonicalArtifact({
    artifactKind: 'CANONICAL_SPATIAL_OPERATION',
    artifactId: operationId,
    operationKind: FANTASY_CONSTRUCTION_OPERATION_KIND,
    gate: FANTASY_CANON_GATE,
    beforeDocumentRef: source.beforeDocumentRef,
    mechanismRef: source.mechanismRef,
    payload: {
      spec,
      recipeSnapshot: source.recipeSnapshot,
      origin: source.origin,
    },
  });
}

/**
 * @param {{loaded:{document:Record<string,unknown>,readOnly:boolean},operation:Record<string,unknown>,
 *   mechanismRegistry:Array<Record<string,unknown>>}} input
 */
export function executeFantasyConstruction(input) {
  const source = exactRecord(input, 'fantasy construction execution', [
    'loaded', 'mechanismRegistry', 'operation',
  ]);
  const loaded = requireCanonicalRecord(source.loaded, 'loaded document');
  assertFirstSliceMutable(loaded);
  const mapArtifact = requireCanonicalRecord(loaded.document, 'loaded map artifact');
  const operation = requireCanonicalRecord(source.operation, 'operation');
  if (operation.operationKind !== FANTASY_CONSTRUCTION_OPERATION_KIND || operation.gate !== FANTASY_CANON_GATE) {
    throw new TypeError('operation is not registered explicit fantasy construction');
  }
  if (JSON.stringify(operation.beforeDocumentRef) !== JSON.stringify(canonicalArtifactRef(mapArtifact))) {
    throw new TypeError('fantasy operation beforeDocumentRef mismatch');
  }
  const registry = Array.isArray(source.mechanismRegistry) ? source.mechanismRegistry : [];
  const mechanismRef = requireCanonicalRecord(operation.mechanismRef, 'operation.mechanismRef');
  const mechanism = registry.find((row) => row.artifactId === mechanismRef.artifactId
    && row.contentHash === mechanismRef.contentHash);
  if (!mechanism || mechanism.gate !== FANTASY_CANON_GATE
    || mechanism.operationKind !== FANTASY_CONSTRUCTION_OPERATION_KIND) {
    throw new TypeError('fantasy mechanism ref is not registered');
  }
  const payload = exactRecord(operation.payload, 'operation.payload', ['origin', 'recipeSnapshot', 'spec']);
  const spec = requireCanonicalRecord(payload.spec, 'operation.payload.spec');
  if (!mechanism.allowedSemanticTypeIds.includes(spec.semanticTypeId)) {
    throw new TypeError('fantasy mechanism does not allow the semantic type');
  }
  const masses = (Array.isArray(mapArtifact.masses) ? mapArtifact.masses : [])
    .map((row) => requireCanonicalRecord(row, 'document mass'));
  if (masses.some((mass) => requireCanonicalRecord(mass.geometry, 'mass.geometry').buildingId === spec.buildingId)) {
    throw new TypeError('fantasy construction cannot overwrite a building');
  }
  const foundation = requireCanonicalRecord(mapArtifact.foundation, 'map artifact.foundation');
  const subdivision = requireCanonicalRecord(mapArtifact.subdivision, 'map artifact.subdivision');
  const recipeSnapshot = requireCanonicalRecord(payload.recipeSnapshot, 'operation.payload.recipeSnapshot');
  const origin = requireCanonicalRecord(payload.origin, 'operation.payload.origin');
  const mass = compileExplicitBuildingMass({
    foundation,
    subdivision,
    spec,
    recipeSnapshot,
    origin,
  });
  const operationRefs = (Array.isArray(mapArtifact.operationRefs) ? mapArtifact.operationRefs : [])
    .map((row) => requireCanonicalRecord(row, 'operationRef'))
    .map((row) => ({
      artifactId: requireCanonicalId(row.artifactId, 'operationRef.artifactId'),
      contentHash: String(row.contentHash),
    }));
  const afterDocument = createFirstSliceDocument({
    documentId: String(mapArtifact.artifactId),
    foundation,
    subdivision,
    masses: [...masses, mass],
    operationRefs: [...operationRefs, canonicalArtifactRef(operation)],
  });
  const receipt = sealCanonicalArtifact({
    artifactKind: 'FANTASY_CONSTRUCTION_RECEIPT',
    artifactId: `${operation.artifactId}:receipt`,
    operationRef: canonicalArtifactRef(operation),
    mechanismRef: canonicalArtifactRef(mechanism),
    beforeDocumentRef: canonicalArtifactRef(mapArtifact),
    afterDocumentRef: canonicalArtifactRef(afterDocument),
    effect: { kind: 'BUILDING_ADDED', buildingId: spec.buildingId, massRef: canonicalArtifactRef(mass) },
  });
  return { afterDocument, receipt, mass };
}
