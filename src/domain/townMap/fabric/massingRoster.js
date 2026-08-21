/** Transitional reference roster for two explicit first-slice building masses. */

import { compareCodepoint } from '../../deterministicSort.js';
import { stableSceneStringify } from '../../townScene/stableScene.js';
import {
  EXPLICIT_BUILDING_MASS_LAW_VERSION, compileExplicitBuildingMass,
  createCanonicalOrigin, createSpatialRecipeSnapshot,
} from './building.js';
import { compileOrthogonalCrossFirstSliceFabricRoot } from './fabricRoot.js';
import {
  canonicalArtifactRef, requireCanonicalId,
  requireCanonicalRecord, sealCanonicalArtifact,
} from './foundation.js';
import { COMPOSITE_SHAPE_LAW_VERSION } from './shapes.js';

export const FIRST_SLICE_MASSING_ROSTER_SCHEMA_VERSION = 1;
export const FIRST_SLICE_MASSING_ROSTER_LAW_VERSION =
  'mf-t1m-orthogonal-cross-first-slice-massing-roster-v1';

const INPUT_KEYS = Object.freeze([
  'artifactId', 'bodyInputs', 'boundaryArrangement', 'firstSliceFabricRoot',
  'foundation', 'frontageSubdivision', 'parcelRegistry', 'planarDcel',
  'streetGeometry', 'streetGraph',
]);

/** @param {unknown} value @param {string} label @param {readonly string[]} keys */
function exactRecord(value, label, keys) {
  const record = requireCanonicalRecord(value, label);
  const actual = Object.keys(record).sort(compareCodepoint);
  const expected = [...keys].sort(compareCodepoint);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new TypeError(`${label} must contain exactly ${expected.join(', ')}`);
  }
  return record;
}

/** @param {unknown} actual @param {unknown} expected @param {string} label */
function requireReplay(actual, expected, label) {
  if (stableSceneStringify(actual) !== stableSceneStringify(expected)) {
    throw new TypeError(`${label} does not replay through its sole compiler`);
  }
}

/** @template T @param {T} value @returns {Readonly<T>} */
function freezeBundleGraph(value) {
  if (value && typeof value === 'object') {
    for (const child of Object.values(/** @type {Record<string,unknown>} */ (value))) {
      freezeBundleGraph(child);
    }
    if (!Object.isFrozen(value)) Object.freeze(value);
  }
  return /** @type {Readonly<T>} */ (value);
}

/** @param {Record<string,unknown>} recipe */
function replayRecipe(recipe) {
  const semantics = requireCanonicalRecord(recipe.semantics, 'recipe semantics');
  const replayed = createSpatialRecipeSnapshot({
    packageClass: /** @type {string} */ (recipe.packageClass),
    packageId: /** @type {string} */ (recipe.packageId),
    packageVersion: /** @type {string|number} */ (recipe.packageVersion),
    entryId: /** @type {string} */ (recipe.entryId),
    entryVersion: /** @type {string|number} */ (recipe.entryVersion),
    semanticTypeId: /** @type {string} */ (semantics.semanticTypeId),
    geometryLaw: /** @type {string} */ (semantics.geometryLaw),
    spatialRole: /** @type {string} */ (semantics.spatialRole),
  });
  requireReplay(recipe, replayed, 'recipeSnapshot');
  return replayed;
}

/** @param {Record<string,unknown>} origin */
function replayOrigin(origin) {
  const replayed = createCanonicalOrigin({
    kind: origin.kind, sourceId: origin.sourceId,
    sourceVersion: origin.sourceVersion, contentHash: origin.contentHash,
  });
  requireReplay(origin, replayed, 'origin');
  return replayed;
}

/** @param {Record<string,unknown>} geometry @param {string} bodyKind */
function requireGoldenForm(geometry, bodyKind) {
  const roof = requireCanonicalRecord(geometry.roof, 'geometry.roof');
  if (bodyKind === 'BUILDING') {
    if (geometry.lawVersion !== EXPLICIT_BUILDING_MASS_LAW_VERSION || roof.kind !== 'GABLE'
      || geometry.shapeParts !== undefined || geometry.attachments !== undefined) {
      throw new TypeError('BUILDING must be the explicit rectilinear gabled form');
    }
    return;
  }
  const parts = Array.isArray(geometry.shapeParts) ? geometry.shapeParts : [];
  const attachments = Array.isArray(geometry.attachments) ? geometry.attachments : [];
  const primary = parts.find((value) => requireCanonicalRecord(value, 'shape part').role === 'PRIMARY_RANGE');
  const tower = parts.find((value) => requireCanonicalRecord(value, 'shape part').role === 'TOWER');
  const primaryPart = requireCanonicalRecord(primary, 'primary shape part');
  const towerPart = requireCanonicalRecord(tower, 'tower shape part');
  if (bodyKind !== 'INSTITUTION' || geometry.lawVersion !== COMPOSITE_SHAPE_LAW_VERSION
    || geometry.solidComposition !== 'UNION_OF_CLOSED_SHELLS' || parts.length !== 2
    || attachments.length !== 1
    || requireCanonicalRecord(primaryPart.planShape, 'primary plan').kind !== 'RECTILINEAR'
    || requireCanonicalRecord(primaryPart.verticalSolid, 'primary solid').kind !== 'EXTRUDED_POLYGON'
    || requireCanonicalRecord(primaryPart.roofForm, 'primary roof').kind !== 'GABLE'
    || requireCanonicalRecord(towerPart.planShape, 'tower plan').kind !== 'CIRCULAR'
    || requireCanonicalRecord(towerPart.verticalSolid, 'tower solid').kind !== 'CYLINDER'
    || requireCanonicalRecord(towerPart.roofForm, 'tower roof').kind !== 'CONICAL') {
    throw new TypeError('INSTITUTION must be the admitted circular tower composite');
  }
}

/** @param {unknown} input */
export function compileOrthogonalCrossFirstSliceMassingRosterBundle(input) {
  const request = exactRecord(input, 'first-slice massing roster input', INPUT_KEYS);
  const artifactId = requireCanonicalId(request.artifactId, 'artifactId');
  const foundation = requireCanonicalRecord(request.foundation, 'foundation');
  const frontageSubdivision = requireCanonicalRecord(request.frontageSubdivision, 'frontageSubdivision');
  const root = requireCanonicalRecord(request.firstSliceFabricRoot, 'firstSliceFabricRoot');
  const replayedRoot = compileOrthogonalCrossFirstSliceFabricRoot({
    artifactId: requireCanonicalId(root.artifactId, 'firstSliceFabricRoot.artifactId'),
    foundation, frontageSubdivision,
    streetGeometry: request.streetGeometry, streetGraph: request.streetGraph,
    boundaryArrangement: request.boundaryArrangement, planarDcel: request.planarDcel,
    parcelRegistry: request.parcelRegistry,
  });
  requireReplay(root, replayedRoot, 'firstSliceFabricRoot');
  const parcelRegistry = requireCanonicalRecord(request.parcelRegistry, 'parcelRegistry');
  const parcels = Array.isArray(parcelRegistry.parcels) ? parcelRegistry.parcels : [];
  const bodyInputs = request.bodyInputs;
  if (!Array.isArray(bodyInputs) || bodyInputs.length !== 2) {
    throw new TypeError('bodyInputs must contain exactly two explicit bodies');
  }
  const compiled = bodyInputs.map((value, index) => {
    const body = exactRecord(value, `bodyInputs[${index}]`, ['origin', 'recipeSnapshot', 'spec']);
    const recipe = replayRecipe(requireCanonicalRecord(body.recipeSnapshot, 'recipeSnapshot'));
    const origin = replayOrigin(requireCanonicalRecord(body.origin, 'origin'));
    const spec = JSON.parse(stableSceneStringify(requireCanonicalRecord(body.spec, 'spec')));
    const mass = compileExplicitBuildingMass({
      foundation, subdivision: frontageSubdivision,
      spec, recipeSnapshot: recipe, origin,
    });
    const geometry = requireCanonicalRecord(mass.geometry, 'mass.geometry');
    const semantics = requireCanonicalRecord(recipe.semantics, 'recipe.semantics');
    const bodyId = requireCanonicalId(geometry.buildingId, 'geometry.buildingId');
    const bodyKind = String(semantics.spatialRole);
    requireGoldenForm(geometry, bodyKind);
    if (semantics.semanticTypeId !== geometry.semanticTypeId
      || stableSceneStringify(geometry.foundationRef)
        !== stableSceneStringify(frontageSubdivision.foundationRef)) {
      throw new TypeError('body semantics or foundation lineage do not match');
    }
    const matching = parcels.filter((parcelValue) => {
      const parcel = requireCanonicalRecord(parcelValue, 'parcel');
      return stableSceneStringify(parcel.plotRef) === stableSceneStringify(geometry.plotRef);
    });
    if (matching.length !== 1) throw new TypeError('body plot must resolve exactly one parcel');
    const parcel = matching[0];
    const parcelId = requireCanonicalId(parcel.parcelId, 'parcel.parcelId');
    return {
      mass, bodyId, parcelId,
      binding: {
        bodyId, bodyKind, semanticTypeId: geometry.semanticTypeId,
        parcelRef: { ...canonicalArtifactRef(parcelRegistry), parcelId },
        massRef: canonicalArtifactRef(mass),
      },
    };
  }).sort((left, right) => compareCodepoint(left.bodyId, right.bodyId));
  if (new Set(compiled.map((row) => row.bodyId)).size !== 2
    || new Set(compiled.map((row) => row.parcelId)).size !== 2
    || JSON.stringify(compiled.map((row) => row.binding.bodyKind).sort(compareCodepoint))
      !== JSON.stringify(['BUILDING', 'INSTITUTION'])) {
    throw new TypeError('body IDs, parcels, and the BUILDING/INSTITUTION roster must be exact');
  }
  const massingRoster = sealCanonicalArtifact({
    artifactKind: 'FIRST_SLICE_MASSING_ROSTER', artifactId,
    schemaVersion: FIRST_SLICE_MASSING_ROSTER_SCHEMA_VERSION,
    lawVersion: FIRST_SLICE_MASSING_ROSTER_LAW_VERSION,
    settlementId: replayedRoot.settlementId, effectiveAt: replayedRoot.effectiveAt,
    mapTraditionId: replayedRoot.mapTraditionId, leafIndex: 0,
    firstSliceFabricRootRef: canonicalArtifactRef(replayedRoot),
    parcelRegistryRef: canonicalArtifactRef(parcelRegistry),
    bodyBindings: compiled.map((row) => row.binding),
  });
  return freezeBundleGraph({
    massingRoster,
    buildingMasses: compiled.map((row) => row.mass),
  });
}
