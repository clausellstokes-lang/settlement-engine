/** Canonical first-slice save bytes and custom-package resolution. */

import { sceneDigest, stableSceneStringify } from '../../townScene/stableScene.js';
import {
  canonicalArtifactRef,
  deepFreezeCanonical,
  requireCanonicalId,
  requireCanonicalRecord,
  sealCanonicalArtifact,
} from './foundation.js';

export const FIRST_SLICE_DOCUMENT_SCHEMA_VERSION = 1;

/** @param {Record<string,unknown>} artifact @param {string} label */
function requireArtifactDigest(artifact, label) {
  const { contentHash, ...body } = artifact;
  if (typeof contentHash !== 'string' || contentHash !== sceneDigest(body)) {
    throw new TypeError(`${label} contentHash mismatch`);
  }
}

/** @param {unknown[]} rows @param {string} label */
function uniqueArtifacts(rows, label) {
  const sorted = rows.map((row) => requireCanonicalRecord(row, label)).sort((left, right) => {
    const a = String(left.artifactId);
    const b = String(right.artifactId);
    return a < b ? -1 : a > b ? 1 : 0;
  });
  const seen = new Set();
  for (const row of sorted) {
    const artifactId = requireCanonicalId(row.artifactId, `${label}.artifactId`);
    if (typeof row.contentHash !== 'string' || row.contentHash.length === 0) {
      throw new TypeError(`${label}.contentHash must be exact`);
    }
    if (seen.has(artifactId)) throw new TypeError(`${label} contains duplicate ${artifactId}`);
    seen.add(artifactId);
  }
  return sorted;
}

/**
 * @param {{documentId:string,foundation:Record<string,unknown>,subdivision:Record<string,unknown>,
 *   masses?:Array<Record<string,unknown>>,operationRefs?:Array<{artifactId:string,contentHash:string}>}} input
 */
export function createFirstSliceDocument(input) {
  const source = requireCanonicalRecord(input, 'first-slice document input');
  const documentId = requireCanonicalId(source.documentId, 'documentId');
  const foundation = requireCanonicalRecord(source.foundation, 'foundation');
  const subdivision = requireCanonicalRecord(source.subdivision, 'subdivision');
  if (foundation.artifactKind !== 'SEALED_FABRIC_FOUNDATION') throw new TypeError('document foundation is not sealed');
  if (subdivision.artifactKind !== 'FRONTAGE_SUBDIVISION') throw new TypeError('document subdivision is not W3 frontage');
  requireArtifactDigest(foundation, 'foundation');
  requireArtifactDigest(subdivision, 'subdivision');
  if (JSON.stringify(subdivision.foundationRef)
    !== JSON.stringify(canonicalArtifactRef(foundation))) {
    throw new TypeError('subdivision belongs to another fabric foundation');
  }
  if (subdivision.coordinateAbiVersion !== foundation.coordinateAbiVersion) {
    throw new TypeError('subdivision coordinate ABI mismatch');
  }
  const plots = (Array.isArray(subdivision.plots) ? subdivision.plots : [])
    .map((row) => requireCanonicalRecord(row, 'subdivision plot'));
  const masses = uniqueArtifacts(Array.isArray(source.masses) ? source.masses : [], 'mass');
  for (const mass of masses) {
    const geometry = requireCanonicalRecord(mass.geometry, 'mass.geometry');
    const recipe = requireCanonicalRecord(mass.recipeSnapshot, 'mass.recipeSnapshot');
    const semantics = requireCanonicalRecord(recipe.semantics, 'mass.recipeSnapshot.semantics');
    requireArtifactDigest(mass, 'mass');
    requireArtifactDigest(geometry, 'mass.geometry');
    requireArtifactDigest(recipe, 'mass.recipeSnapshot');
    if (JSON.stringify(mass.geometryRef) !== JSON.stringify(canonicalArtifactRef(geometry))) {
      throw new TypeError('mass geometryRef mismatch');
    }
    if (JSON.stringify(geometry.foundationRef) !== JSON.stringify(canonicalArtifactRef(foundation))) {
      throw new TypeError('mass belongs to another fabric foundation');
    }
    const plotRef = requireCanonicalRecord(geometry.plotRef, 'mass.geometry.plotRef');
    if (plotRef.artifactId !== subdivision.artifactId || plotRef.contentHash !== subdivision.contentHash
      || !plots.some((plot) => plot.plotId === plotRef.plotId)) {
      throw new TypeError('mass plotRef does not resolve in the document subdivision');
    }
    if (semantics.semanticTypeId !== geometry.semanticTypeId
      || semantics.geometryLaw !== geometry.lawVersion) {
      throw new TypeError('mass recipe semantics mismatch');
    }
  }
  const operationRefs = uniqueArtifacts(
    Array.isArray(source.operationRefs) ? source.operationRefs : [],
    'operationRef',
  ).map((row) => ({ artifactId: row.artifactId, contentHash: row.contentHash }));
  return sealCanonicalArtifact({
    artifactKind: 'FIRST_SLICE_MAP_DOCUMENT',
    artifactId: documentId,
    schemaVersion: FIRST_SLICE_DOCUMENT_SCHEMA_VERSION,
    foundation,
    subdivision,
    masses,
    operationRefs,
  });
}

/** @param {Record<string,unknown>} mapArtifact */
export function saveFirstSliceDocument(mapArtifact) {
  const source = requireCanonicalRecord(mapArtifact, 'map artifact');
  if (source.artifactKind !== 'FIRST_SLICE_MAP_DOCUMENT') throw new TypeError('not a first-slice document');
  const { contentHash, ...body } = source;
  if (contentHash !== sceneDigest(body)) throw new TypeError('document contentHash mismatch');
  return stableSceneStringify(source);
}

/** @param {Record<string,unknown>} snapshot */
function recipeRef(snapshot) {
  return {
    artifactId: String(snapshot.artifactId),
    contentHash: String(snapshot.contentHash),
    packageId: String(snapshot.packageId),
    packageVersion: snapshot.packageVersion,
    entryId: String(snapshot.entryId),
    entryVersion: snapshot.entryVersion,
  };
}

/**
 * Resolution is load-relative and never mutates canonical content.
 * @param {Record<string,unknown>} mapArtifact
 * @param {Array<Record<string,unknown>>} installedRecipeSnapshots
 */
export function resolveFirstSliceContent(mapArtifact, installedRecipeSnapshots = []) {
  const installed = new Set(installedRecipeSnapshots.map((row) => `${row.artifactId}\0${row.contentHash}`));
  const resolved = [];
  const unresolved = [];
  const masses = Array.isArray(mapArtifact.masses) ? mapArtifact.masses : [];
  for (const rawMass of masses) {
    const mass = requireCanonicalRecord(rawMass, 'mass');
    const geometry = requireCanonicalRecord(mass.geometry, 'mass.geometry');
    const snapshot = requireCanonicalRecord(mass.recipeSnapshot, 'mass.recipeSnapshot');
    if (snapshot.packageClass !== 'CUSTOM') continue;
    const row = {
      subject: { kind: 'ENTITY', entityId: String(geometry.buildingId) },
      privacy: geometry.privacy,
      recipe: recipeRef(snapshot),
    };
    const key = `${snapshot.artifactId}\0${snapshot.contentHash}`;
    if (installed.has(key)) resolved.push({ ...row, status: 'RESOLVED' });
    else unresolved.push({ ...row, status: 'UNRESOLVED_PACKAGE_MISSING' });
  }
  return sealCanonicalArtifact({
    artifactKind: 'CONTENT_RESOLUTION_REPORT',
    artifactId: `${mapArtifact.artifactId}:content-resolution`,
    sourceDocumentRef: canonicalArtifactRef(mapArtifact),
    resolved,
    unresolved,
  });
}

/**
 * @param {string} bytes
 * @param {Array<Record<string,unknown>>} installedRecipeSnapshots
 */
export function loadFirstSliceDocument(bytes, installedRecipeSnapshots = []) {
  if (typeof bytes !== 'string' || bytes.length === 0) throw new TypeError('save bytes are required');
  const parsed = JSON.parse(bytes);
  const mapArtifact = requireCanonicalRecord(parsed, 'saved map artifact');
  if (stableSceneStringify(mapArtifact) !== bytes) throw new TypeError('save bytes are not canonical');
  const { contentHash, ...body } = mapArtifact;
  if (typeof contentHash !== 'string' || contentHash !== sceneDigest(body)) {
    throw new TypeError('saved document digest mismatch');
  }
  const rebuilt = createFirstSliceDocument({
    documentId: String(mapArtifact.artifactId),
    foundation: requireCanonicalRecord(mapArtifact.foundation, 'saved foundation'),
    subdivision: requireCanonicalRecord(mapArtifact.subdivision, 'saved subdivision'),
    masses: Array.isArray(mapArtifact.masses)
      ? mapArtifact.masses.map((row) => requireCanonicalRecord(row, 'saved mass')) : [],
    operationRefs: Array.isArray(mapArtifact.operationRefs)
      ? mapArtifact.operationRefs.map((row) => /** @type {{artifactId:string,contentHash:string}} */ (row)) : [],
  });
  if (stableSceneStringify(rebuilt) !== bytes) throw new TypeError('saved document violates canonical structure');
  const frozen = deepFreezeCanonical(rebuilt);
  const resolutionReport = resolveFirstSliceContent(frozen, installedRecipeSnapshots);
  return deepFreezeCanonical({
    document: frozen,
    resolutionReport,
    readOnly: resolutionReport.unresolved.length > 0,
  });
}

/** @param {unknown} loaded */
export function assertFirstSliceMutable(loaded) {
  const source = requireCanonicalRecord(loaded, 'loaded map artifact');
  if (source.readOnly === true) {
    throw new TypeError('unresolved custom content makes this map artifact read-only');
  }
  if (source.readOnly !== false) throw new TypeError('loaded map artifact readOnly state must be explicit');
}
