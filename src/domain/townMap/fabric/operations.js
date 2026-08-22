/**
 * One bounded registered fantasy construction operation, COMPILED AS A PAYLOAD.
 *
 * ⛔⛔ THE §423 SHAPE-B DEMOTION, EXECUTED BY MF-T2M. This module used to name its artifacts
 * CANONICAL and carry its own acceptance GATE — door-status semantics, at the payload level.
 * ODQ §423 ruled the two levels apart: *"the store registry (src/store/operationRegistry.js) is
 * THE census of DOOR VERBS; one domain artifact grammar owns operation PAYLOADS … (1)
 * fabric/operations.js DEMOTES from door-claimant to payload compiler … its artifacts are
 * proposal-grade until a registered store verb accepts them."* So the gate export and its six
 * use sites are gone, and the operation's kind reads `PROPOSED_SPATIAL_OPERATION`: proposal-grade
 * and accepted-grade no longer share a word. The SPEC's canonical-spatial-operation union row now
 * means exactly what §423 says it means — the kind an ACCEPTED operation carries, minted at the
 * door by the executor tranche (§423(3)), which is not this module and never was. ⚠ That union
 * spelling is deliberately NOT written here as a literal: earlier members' forensic zooms use it
 * as a dist positive control, and a surviving comment would let one of them pass on prose.
 *
 * ⭐ THE DEMOTION REMOVED A CLAIM, NOT A CHECK. Every refusal this module could make before, it
 * still makes: the v1-legacy mechanism still refuses execution on `schemaVersion !== 2`, the
 * operation still refuses on a wrong schema, law version or operation kind, and a non-replaying
 * operation, mechanism or recipe is still refused. What is gone is the assertion that passing
 * those checks makes an artifact CANONICAL — a grade this level has no authority to award.
 *
 * ⚠ THE TWO LAW VERSIONS MOVED WITH THE SHAPES THAT MOVED. A law string names a shape; the
 * mechanism and operation shapes lost their `gate` field, so both are re-stamped. The state and
 * receipt laws are UNCHANGED — those shapes never carried a gate, and the ref VALUES they embed
 * move only because ref hashes move, which is ref semantics rather than a law change.
 *
 * ⛔ AND NO ACCEPTANCE GATE MAY BE MINTED HERE AGAIN. §423.1: *"an operation VOCABULARY may exist
 * in exactly two places — the store registry's verb rows and the domain's sealed-artifact payload
 * grammar; a module claiming both levels, or a third vocabulary at either level, is refused at
 * review as a second truth."* The executable form of that law is an arm in
 * `tests/lint/townMapFabricSingleDeclaration.walker.test.js`, and it reds on arrival.
 */

import { sceneDigest, stableSceneStringify } from '../../townScene/stableScene.js';
import {
  EXPLICIT_BUILDING_MASS_LAW_VERSION,
  compileExplicitBuildingMass,
  createCanonicalOrigin,
  createSpatialRecipeSnapshot,
} from './building.js';
import { loadFirstSliceMassingDocument } from './content.js';
import {
  canonicalArtifactRef,
  deepFreezeCanonical,
  requireCanonicalId,
  requireCanonicalRecord,
  sealCanonicalArtifact,
} from './foundation.js';

export const FANTASY_CONSTRUCTION_OPERATION_KIND = 'CONSTRUCT_EXPLICIT_BUILDING';
export const FIRST_SLICE_MASSING_CONSTRUCTION_STATE_SCHEMA_VERSION = 1;
export const FIRST_SLICE_MASSING_CONSTRUCTION_STATE_LAW_VERSION =
  'mf-t1x-first-slice-massing-construction-state-v1';

const MECHANISM_LAW_VERSION = 'mf-t2m-registered-fantasy-construction-mechanism-v3';
const OPERATION_SCHEMA_VERSION = 1;
const OPERATION_LAW_VERSION = 'mf-t2m-proposed-fantasy-construction-operation-v1';
const EXECUTION_KEYS = Object.freeze([
  'bytes', 'installedRecipeSnapshots', 'mechanismRegistry', 'operation',
]);

/** @param {unknown} value */
function snapshot(value) { return JSON.parse(stableSceneStringify(value)); }

/** @param {unknown} value @param {string} label @param {readonly string[]} keys */
function exactRecord(value, label, keys) {
  const record = requireCanonicalRecord(value, label);
  if (JSON.stringify(Object.keys(record).sort()) !== JSON.stringify([...keys].sort())) {
    throw new TypeError(`${label} must contain exactly ${keys.join(', ')}`);
  }
  return record;
}

/** @param {unknown} value @param {string} label */
function exactRef(value, label) {
  const source = exactRecord(value, label, ['artifactId', 'contentHash']);
  if (typeof source.contentHash !== 'string' || source.contentHash.length === 0) {
    throw new TypeError(`${label}.contentHash must be exact`);
  }
  return deepFreezeCanonical({
    artifactId: requireCanonicalId(source.artifactId, `${label}.artifactId`),
    contentHash: source.contentHash,
  });
}

/** @param {unknown} value @param {string} label */
function requireVersion(value, label) {
  if ((typeof value !== 'string' || value.length === 0) && !Number.isSafeInteger(value)) {
    throw new TypeError(`${label} must be an explicit version`);
  }
  return /** @type {string|number} */ (value);
}

/** @param {unknown} actual @param {unknown} expected @param {string} label */
function requireReplay(actual, expected, label) {
  if (stableSceneStringify(actual) !== stableSceneStringify(expected)) {
    throw new TypeError(`${label} does not replay through its sole creator`);
  }
}

/** @param {unknown} value */
function replayRecipe(value) {
  const source = requireCanonicalRecord(value, 'recipeSnapshot');
  const semantics = requireCanonicalRecord(source.semantics, 'recipeSnapshot.semantics');
  const replayed = createSpatialRecipeSnapshot({
    packageClass: /** @type {string} */ (source.packageClass),
    packageId: /** @type {string} */ (source.packageId),
    packageVersion: /** @type {string|number} */ (source.packageVersion),
    entryId: /** @type {string} */ (source.entryId),
    entryVersion: /** @type {string|number} */ (source.entryVersion),
    semanticTypeId: /** @type {string} */ (semantics.semanticTypeId),
    geometryLaw: /** @type {string} */ (semantics.geometryLaw),
    spatialRole: /** @type {string} */ (semantics.spatialRole),
  });
  requireReplay(source, replayed, 'recipeSnapshot');
  return replayed;
}

/** @param {unknown} value */
function replayOrigin(value) {
  const source = requireCanonicalRecord(value, 'origin');
  const replayed = createCanonicalOrigin({
    kind: source.kind, sourceId: source.sourceId,
    sourceVersion: source.sourceVersion, contentHash: source.contentHash,
  });
  requireReplay(source, replayed, 'origin');
  return replayed;
}

/** @param {unknown} input */
export function registerFantasyConstructionMechanism(input) {
  const source = requireCanonicalRecord(snapshot(input), 'fantasy mechanism');
  const mechanismVersion = requireVersion(source.mechanismVersion, 'mechanismVersion');
  const mechanismId = requireCanonicalId(source.mechanismId, 'mechanismId');
  if (source.allowedSemanticTypeIds !== undefined) {
    exactRecord(source, 'fantasy mechanism', [
      'allowedSemanticTypeIds', 'mechanismId', 'mechanismVersion',
    ]);
    if (!Array.isArray(source.allowedSemanticTypeIds) || source.allowedSemanticTypeIds.length === 0) {
      throw new TypeError('fantasy mechanism needs an allowed semantic type');
    }
    const allowedSemanticTypeIds = source.allowedSemanticTypeIds
      .map((value) => requireCanonicalId(value, 'allowedSemanticTypeId'))
      .sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));
    if (new Set(allowedSemanticTypeIds).size !== allowedSemanticTypeIds.length) {
      throw new TypeError('fantasy mechanism semantic types must be unique');
    }
    return sealCanonicalArtifact({
      artifactKind: 'REGISTERED_FANTASY_MECHANISM', artifactId: mechanismId,
      mechanismVersion,
      operationKind: FANTASY_CONSTRUCTION_OPERATION_KIND, allowedSemanticTypeIds,
    });
  }
  exactRecord(source, 'fantasy mechanism', [
    'mechanismId', 'mechanismVersion', 'spatialRecipeRef',
  ]);
  return sealCanonicalArtifact({
    artifactKind: 'REGISTERED_FANTASY_MECHANISM', artifactId: mechanismId,
    schemaVersion: 2, lawVersion: MECHANISM_LAW_VERSION, mechanismVersion,
    operationKind: FANTASY_CONSTRUCTION_OPERATION_KIND,
    spatialRecipeRef: exactRef(source.spatialRecipeRef, 'spatialRecipeRef'),
  });
}

/** @param {unknown} input */
export function createFantasyConstructionOperation(input) {
  const source = exactRecord(snapshot(input), 'fantasy construction operation', [
    'beforeDocumentRef', 'mechanismRef', 'operationId', 'origin', 'recipeSnapshot', 'spec',
  ]);
  const operationId = requireCanonicalId(source.operationId, 'operationId');
  const spec = requireCanonicalRecord(source.spec, 'operation.spec');
  if (spec.constructionOperationId !== operationId) {
    throw new TypeError('building constructionOperationId must equal operationId');
  }
  return sealCanonicalArtifact({
    artifactKind: 'PROPOSED_SPATIAL_OPERATION', artifactId: operationId,
    schemaVersion: OPERATION_SCHEMA_VERSION, lawVersion: OPERATION_LAW_VERSION,
    operationKind: FANTASY_CONSTRUCTION_OPERATION_KIND,
    beforeDocumentRef: exactRef(source.beforeDocumentRef, 'beforeDocumentRef'),
    mechanismRef: exactRef(source.mechanismRef, 'mechanismRef'),
    payload: {
      spec,
      recipeSnapshot: replayRecipe(source.recipeSnapshot),
      origin: replayOrigin(source.origin),
    },
  });
}

/** @param {unknown} value */
function replayOperation(value) {
  const source = requireCanonicalRecord(value, 'operation');
  const payload = exactRecord(source.payload, 'operation.payload', ['origin', 'recipeSnapshot', 'spec']);
  const replayed = createFantasyConstructionOperation({
    operationId: source.artifactId, beforeDocumentRef: source.beforeDocumentRef,
    mechanismRef: source.mechanismRef, spec: payload.spec,
    recipeSnapshot: payload.recipeSnapshot, origin: payload.origin,
  });
  if (source.schemaVersion !== OPERATION_SCHEMA_VERSION || source.lawVersion !== OPERATION_LAW_VERSION
    || source.operationKind !== FANTASY_CONSTRUCTION_OPERATION_KIND) {
    throw new TypeError('operation is not executable MF-T1X fantasy construction');
  }
  requireReplay(source, replayed, 'operation');
  return replayed;
}

/** @param {unknown} value */
function replayMechanisms(value) {
  if (!Array.isArray(value)) throw new TypeError('mechanismRegistry must be an array');
  const rows = value.map((entry) => {
    const source = requireCanonicalRecord(entry, 'mechanismRegistry row');
    const replayed = source.schemaVersion === 2
      ? registerFantasyConstructionMechanism({
        mechanismId: source.artifactId, mechanismVersion: source.mechanismVersion,
        spatialRecipeRef: source.spatialRecipeRef,
      })
      : registerFantasyConstructionMechanism({
        mechanismId: source.artifactId, mechanismVersion: source.mechanismVersion,
        allowedSemanticTypeIds: source.allowedSemanticTypeIds,
      });
    requireReplay(source, replayed, 'mechanismRegistry row');
    return replayed;
  }).sort((left, right) => left.artifactId < right.artifactId ? -1
    : left.artifactId > right.artifactId ? 1
      : left.contentHash < right.contentHash ? -1 : left.contentHash > right.contentHash ? 1 : 0);
  const ids = new Set();
  const exactKeys = new Set();
  for (const row of rows) {
    const key = `${row.artifactId}\0${row.contentHash}`;
    if (exactKeys.has(key) || ids.has(row.artifactId)) {
      throw new TypeError('mechanismRegistry contains duplicate authority');
    }
    exactKeys.add(key);
    ids.add(row.artifactId);
  }
  return rows;
}

/** @param {unknown} input */
export function executeFantasyConstruction(input) {
  const request = exactRecord(snapshot(input), 'fantasy construction execution', EXECUTION_KEYS);
  if (!Array.isArray(request.installedRecipeSnapshots)) {
    throw new TypeError('installedRecipeSnapshots must be an array');
  }
  const loaded = loadFirstSliceMassingDocument(
    /** @type {string} */ (request.bytes),
    /** @type {Array<Record<string,unknown>>} */ (request.installedRecipeSnapshots),
  );
  if (loaded.readOnly) throw new TypeError('unresolved custom content makes fantasy construction read-only');
  const beforeDocument = requireCanonicalRecord(loaded.document, 'loaded massing document');
  const bundle = requireCanonicalRecord(beforeDocument.massingBundle, 'massingBundle');
  const roster = requireCanonicalRecord(bundle.massingRoster, 'massingRoster');
  const baseMasses = Array.isArray(bundle.buildingMasses) ? bundle.buildingMasses
    .map((row) => requireCanonicalRecord(row, 'base mass')) : [];
  if (baseMasses.length !== 2 || !Array.isArray(roster.bodyBindings) || roster.bodyBindings.length !== 2) {
    throw new TypeError('fantasy construction requires the exact two-body MF-T1S base');
  }
  const operation = replayOperation(request.operation);
  if (stableSceneStringify(operation.beforeDocumentRef)
    !== stableSceneStringify(canonicalArtifactRef(beforeDocument))) {
    throw new TypeError('fantasy operation beforeDocumentRef mismatch');
  }
  const mechanisms = replayMechanisms(request.mechanismRegistry);
  const mechanismKey = `${operation.mechanismRef.artifactId}\0${operation.mechanismRef.contentHash}`;
  const mechanism = /** @type {Record<string,unknown>|undefined} */ (
    mechanisms.find((row) => `${row.artifactId}\0${row.contentHash}` === mechanismKey)
  );
  if (!mechanism || mechanism.schemaVersion !== 2 || mechanism.lawVersion !== MECHANISM_LAW_VERSION
    || mechanism.operationKind !== FANTASY_CONSTRUCTION_OPERATION_KIND) {
    throw new TypeError('fantasy mechanism ref is not executable');
  }
  const payload = requireCanonicalRecord(operation.payload, 'operation.payload');
  const recipe = requireCanonicalRecord(payload.recipeSnapshot, 'operation recipeSnapshot');
  const semantics = requireCanonicalRecord(recipe.semantics, 'operation recipe semantics');
  const origin = requireCanonicalRecord(payload.origin, 'operation origin');
  const spec = requireCanonicalRecord(payload.spec, 'operation spec');
  if (stableSceneStringify(mechanism.spatialRecipeRef)
      !== stableSceneStringify(canonicalArtifactRef(recipe))
    || recipe.packageClass !== 'BUILT_IN' || semantics.spatialRole !== 'BUILDING'
    || semantics.geometryLaw !== EXPLICIT_BUILDING_MASS_LAW_VERSION
    || origin.kind !== 'AUTHORED' || spec.privacy !== 'DM'
    || requireCanonicalRecord(spec.roof, 'operation spec.roof').kind !== 'GABLE') {
    throw new TypeError('fantasy payload authority is not the admitted explicit DM building');
  }
  const baseGeometries = baseMasses.map((mass) => requireCanonicalRecord(mass.geometry, 'base mass.geometry'));
  const plotRef = requireCanonicalRecord(spec.plotRef, 'operation spec.plotRef');
  if (baseGeometries.some((geometry) => geometry.buildingId === spec.buildingId)
    || baseGeometries.some((geometry) => requireCanonicalRecord(geometry.plotRef, 'base geometry.plotRef').plotId === plotRef.plotId)
    || baseGeometries.some((geometry) => geometry.constructionOperationId === operation.artifactId)) {
    throw new TypeError('fantasy construction collides with the base massing');
  }
  const compileInput = requireCanonicalRecord(beforeDocument.massingCompileInput, 'massingCompileInput');
  const thirdMass = compileExplicitBuildingMass({
    foundation: requireCanonicalRecord(compileInput.foundation, 'foundation'),
    subdivision: requireCanonicalRecord(compileInput.frontageSubdivision, 'frontageSubdivision'),
    spec, recipeSnapshot: recipe, origin,
  });
  const buildingMasses = [...baseMasses, thirdMass].sort((left, right) => {
    const leftId = String(requireCanonicalRecord(left.geometry, 'mass.geometry').buildingId);
    const rightId = String(requireCanonicalRecord(right.geometry, 'mass.geometry').buildingId);
    return leftId < rightId ? -1 : leftId > rightId ? 1 : 0;
  });
  const beforeDocumentRef = canonicalArtifactRef(beforeDocument);
  const baseMassingRosterRef = canonicalArtifactRef(roster);
  const changeOperationRefs = [canonicalArtifactRef(operation)];
  const stateArtifactId = `massing-construction-state:${sceneDigest({
    domain: FIRST_SLICE_MASSING_CONSTRUCTION_STATE_LAW_VERSION,
    beforeDocumentRef, baseMassingRosterRef, changeOperationRefs,
    buildingMassRefs: buildingMasses.map(canonicalArtifactRef),
  })}`;
  const constructionState = sealCanonicalArtifact({
    artifactKind: 'FIRST_SLICE_MASSING_CONSTRUCTION_STATE', artifactId: stateArtifactId,
    schemaVersion: FIRST_SLICE_MASSING_CONSTRUCTION_STATE_SCHEMA_VERSION,
    lawVersion: FIRST_SLICE_MASSING_CONSTRUCTION_STATE_LAW_VERSION,
    beforeDocumentRef, baseMassingRosterRef, changeOperationRefs, buildingMasses,
  });
  const operationRef = canonicalArtifactRef(operation);
  const mechanismRef = canonicalArtifactRef(mechanism);
  const effect = {
    kind: 'BUILDING_ADDED',
    buildingId: requireCanonicalRecord(thirdMass.geometry, 'third mass.geometry').buildingId,
    plotRef: requireCanonicalRecord(thirdMass.geometry, 'third mass.geometry').plotRef,
    massRef: canonicalArtifactRef(thirdMass),
  };
  const afterConstructionStateRef = canonicalArtifactRef(constructionState);
  const receiptArtifactId = `fantasy-construction-receipt:${sceneDigest({
    domain: FIRST_SLICE_MASSING_CONSTRUCTION_STATE_LAW_VERSION,
    beforeDocumentRef, afterConstructionStateRef, operationRef, mechanismRef, effect,
  })}`;
  const receipt = sealCanonicalArtifact({
    artifactKind: 'FANTASY_CONSTRUCTION_RECEIPT', artifactId: receiptArtifactId,
    schemaVersion: 1, lawVersion: FIRST_SLICE_MASSING_CONSTRUCTION_STATE_LAW_VERSION,
    beforeDocumentRef, afterConstructionStateRef, operationRef, mechanismRef, effect,
  });
  return deepFreezeCanonical({ constructionState, receipt });
}
