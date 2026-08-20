/** Explicit-input building massing for the first canonical map slice. */

import {
  canonicalArtifactRef,
  canonicalRectBounds,
  requireCanonicalId,
  requireCanonicalInt,
  requireCanonicalRecord,
  sealCanonicalArtifact,
} from './foundation.js';
import { frontagePlotById } from './frontage.js';
import {
  COMPOSITE_SHAPE_LAW_VERSION,
  compileCompositeShapeFragments,
} from './shapes.js';

export const EXPLICIT_BUILDING_MASS_LAW_VERSION = 'explicit-building-mass-v1';
export const SPATIAL_RECIPE_SCHEMA_VERSION = 1;
export const CANONICAL_ORIGIN_KINDS = Object.freeze(['AUTHORED', 'BUILT_IN', 'CUSTOM', 'IMPORTED']);
export const EXPLICIT_BUILDING_GEOMETRY_LAWS = Object.freeze([
  EXPLICIT_BUILDING_MASS_LAW_VERSION,
  COMPOSITE_SHAPE_LAW_VERSION,
]);

/** @param {unknown} value @param {string} label */
function requireVersion(value, label) {
  if ((typeof value !== 'string' && !Number.isSafeInteger(value)) || String(value).length === 0) {
    throw new TypeError(`${label} must be an explicit version`);
  }
  return value;
}

/**
 * Recipe identity is package-specific; recipe semantics are what the origin-neutral
 * geometry compiler consumes.
 * @param {{packageClass:string,packageId:string,packageVersion:string|number,entryId:string,
 *   entryVersion:string|number,semanticTypeId:string,geometryLaw?:string}} input
 */
export function createSpatialRecipeSnapshot(input) {
  const source = requireCanonicalRecord(input, 'recipe snapshot');
  const packageClass = String(source.packageClass);
  if (!CANONICAL_ORIGIN_KINDS.includes(packageClass)) {
    throw new TypeError('packageClass must be BUILT_IN, CUSTOM, IMPORTED, or AUTHORED');
  }
  const packageId = requireCanonicalId(source.packageId, 'packageId');
  const entryId = requireCanonicalId(source.entryId, 'entryId');
  const semanticTypeId = requireCanonicalId(source.semanticTypeId, 'semanticTypeId');
  const packageVersion = requireVersion(source.packageVersion, 'packageVersion');
  const entryVersion = requireVersion(source.entryVersion, 'entryVersion');
  const geometryLaw = source.geometryLaw === undefined
    ? EXPLICIT_BUILDING_MASS_LAW_VERSION
    : String(source.geometryLaw);
  if (!EXPLICIT_BUILDING_GEOMETRY_LAWS.includes(geometryLaw)) {
    throw new TypeError('recipe geometryLaw is not registered');
  }
  return sealCanonicalArtifact({
    artifactKind: 'SPATIAL_RECIPE_SNAPSHOT',
    artifactId: `${packageId}:recipe:${entryId}:${entryVersion}`,
    schemaVersion: SPATIAL_RECIPE_SCHEMA_VERSION,
    packageClass,
    packageId,
    packageVersion,
    entryId,
    entryVersion,
    semantics: {
      semanticTypeId,
      spatialRole: 'BUILDING',
      geometryLaw,
    },
  });
}

/** @param {unknown} input */
export function createCanonicalOrigin(input) {
  const source = requireCanonicalRecord(input, 'canonical origin');
  const kind = String(source.kind);
  if (!CANONICAL_ORIGIN_KINDS.includes(kind)) throw new TypeError('unknown canonical origin kind');
  if (typeof source.contentHash !== 'string' || source.contentHash.length < 8) {
    throw new TypeError('origin contentHash must be exact');
  }
  return Object.freeze({
    kind,
    sourceId: requireCanonicalId(source.sourceId, 'origin.sourceId'),
    sourceVersion: requireVersion(source.sourceVersion, 'origin.sourceVersion'),
    contentHash: source.contentHash,
  });
}

/** @param {unknown} value @param {string} label @param {string[]} keys */
function requireExactKeys(value, label, keys) {
  const record = requireCanonicalRecord(value, label);
  const actual = Object.keys(record).sort();
  const expected = [...keys].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new TypeError(`${label} must contain exactly ${expected.join(', ')}`);
  }
  return record;
}

/** @param {Array<[number,number]>} footprint @param {number} baseQ @param {number} eaveQ */
function wallPatches(footprint, baseQ, eaveQ) {
  return footprint.map((point, index) => {
    const next = footprint[(index + 1) % footprint.length];
    return {
      patchId: `wall:${index + 1}`,
      role: 'WALL',
      vertices: [
        [point[0], baseQ, point[1]], [next[0], baseQ, next[1]],
        [next[0], eaveQ, next[1]], [point[0], eaveQ, point[1]],
      ],
    };
  });
}

/** @param {ReturnType<typeof canonicalRectBounds>} bounds @param {Record<string, unknown>} roof */
function roofPatches(bounds, roof) {
  const { minX, maxX, minZ, maxZ } = bounds;
  const eaveQ = Number(roof.eaveQ);
  const ridgeQ = Number(roof.ridgeQ);
  if (roof.kind === 'FLAT') {
    return [{
      patchId: 'roof:flat', role: 'ROOF',
      vertices: [[minX, eaveQ, minZ], [maxX, eaveQ, minZ], [maxX, eaveQ, maxZ], [minX, eaveQ, maxZ]],
    }];
  }
  if (roof.ridgeAxis === 'X') {
    const midZ = Math.floor((minZ + maxZ) / 2);
    const west = [minX, ridgeQ, midZ];
    const east = [maxX, ridgeQ, midZ];
    return [
      { patchId: 'roof:south', role: 'ROOF', vertices: [[minX, eaveQ, minZ], [maxX, eaveQ, minZ], east, west] },
      { patchId: 'roof:north', role: 'ROOF', vertices: [west, east, [maxX, eaveQ, maxZ], [minX, eaveQ, maxZ]] },
      { patchId: 'gable:west', role: 'WALL', vertices: [[minX, eaveQ, maxZ], [minX, eaveQ, minZ], west] },
      { patchId: 'gable:east', role: 'WALL', vertices: [[maxX, eaveQ, minZ], [maxX, eaveQ, maxZ], east] },
    ];
  }
  const midX = Math.floor((minX + maxX) / 2);
  const south = [midX, ridgeQ, minZ];
  const north = [midX, ridgeQ, maxZ];
  return [
    { patchId: 'roof:west', role: 'ROOF', vertices: [[minX, eaveQ, minZ], south, north, [minX, eaveQ, maxZ]] },
    { patchId: 'roof:east', role: 'ROOF', vertices: [south, [maxX, eaveQ, minZ], [maxX, eaveQ, maxZ], north] },
    { patchId: 'gable:south', role: 'WALL', vertices: [[minX, eaveQ, minZ], [maxX, eaveQ, minZ], south] },
    { patchId: 'gable:north', role: 'WALL', vertices: [[maxX, eaveQ, maxZ], [minX, eaveQ, maxZ], north] },
  ];
}

/**
 * @param {{foundation:Record<string,unknown>,subdivision:Record<string,unknown>,
 *   spec:Record<string,unknown>,recipeSnapshot:Record<string,unknown>}} input
 * @param {string} lawVersion
 * @param {boolean} allowContainedFootprint
 */
function compileRectilinearGeometry(input, lawVersion, allowContainedFootprint) {
  const source = requireCanonicalRecord(input, 'building compile input');
  const foundation = requireCanonicalRecord(source.foundation, 'foundation');
  const subdivision = requireCanonicalRecord(source.subdivision, 'subdivision');
  const recipe = requireCanonicalRecord(source.recipeSnapshot, 'recipeSnapshot');
  if (recipe.artifactKind !== 'SPATIAL_RECIPE_SNAPSHOT') throw new TypeError('recipe snapshot is required');
  const spec = requireExactKeys(source.spec, 'building spec', [
    'baseElevationQ', 'buildingId', 'constructionOperationId', 'foundationRef', 'footprint',
    'functionId', 'materials', 'plotRef', 'privacy', 'roof', 'semanticTypeId', 'wallTopQ',
  ]);
  const buildingId = requireCanonicalId(spec.buildingId, 'buildingId');
  const semanticTypeId = requireCanonicalId(spec.semanticTypeId, 'semanticTypeId');
  const semantics = requireCanonicalRecord(recipe.semantics, 'recipe semantics');
  if (semantics.semanticTypeId !== semanticTypeId || semantics.geometryLaw !== lawVersion) {
    throw new TypeError('recipe semantics do not authorize this explicit mass');
  }
  const foundationRef = canonicalArtifactRef(/** @type {{artifactId:string,contentHash:string}} */ (foundation));
  if (JSON.stringify(spec.foundationRef) !== JSON.stringify(foundationRef)) {
    throw new TypeError('building foundationRef mismatch');
  }
  if (JSON.stringify(subdivision.foundationRef) !== JSON.stringify(foundationRef)) {
    throw new TypeError('building subdivision belongs to another foundation');
  }
  const plotRef = requireExactKeys(spec.plotRef, 'plotRef', ['artifactId', 'contentHash', 'plotId']);
  if (plotRef.artifactId !== subdivision.artifactId || plotRef.contentHash !== subdivision.contentHash) {
    throw new TypeError('building plotRef mismatch');
  }
  const plot = frontagePlotById(subdivision, String(plotRef.plotId));
  if (!plot) throw new TypeError('building plotRef does not resolve');
  const plotBounds = canonicalRectBounds(plot.fittedFootprint, 'fitted W3 footprint');
  const bounds = canonicalRectBounds(spec.footprint, 'building footprint');
  const insidePlot = bounds.minX >= plotBounds.minX && bounds.maxX <= plotBounds.maxX
    && bounds.minZ >= plotBounds.minZ && bounds.maxZ <= plotBounds.maxZ;
  if ((!allowContainedFootprint && JSON.stringify(bounds.ring) !== JSON.stringify(plotBounds.ring))
    || (allowContainedFootprint && !insidePlot)) {
    throw new TypeError(allowContainedFootprint
      ? 'building attachment must remain inside its fitted W3 footprint'
      : 'building footprint must equal its fitted W3 footprint');
  }
  const baseElevationQ = requireCanonicalInt(spec.baseElevationQ, 'baseElevationQ', 0, 500);
  const wallTopQ = requireCanonicalInt(spec.wallTopQ, 'wallTopQ', baseElevationQ + 1, 750);
  const roof = requireExactKeys(spec.roof, 'roof', ['eaveQ', 'kind', 'ridgeAxis', 'ridgeQ']);
  if (!['FLAT', 'GABLE'].includes(String(roof.kind))) throw new TypeError('roof kind must be explicit');
  const eaveQ = requireCanonicalInt(roof.eaveQ, 'roof.eaveQ', wallTopQ, 850);
  const ridgeQ = requireCanonicalInt(roof.ridgeQ, 'roof.ridgeQ', eaveQ, 900);
  if (eaveQ !== wallTopQ) throw new TypeError('roof eave must meet the wall top');
  if (roof.kind === 'FLAT' && (ridgeQ !== eaveQ || roof.ridgeAxis !== 'NONE')) {
    throw new TypeError('flat roof must have equal eave/ridge and NONE axis');
  }
  if (roof.kind === 'GABLE' && (ridgeQ <= eaveQ || !['X', 'Z'].includes(String(roof.ridgeAxis)))) {
    throw new TypeError('gable roof requires a higher ridge and X or Z axis');
  }
  const materials = requireExactKeys(spec.materials, 'materials', ['roofMaterialId', 'wallMaterialId']);
  requireCanonicalId(materials.wallMaterialId, 'wallMaterialId');
  requireCanonicalId(materials.roofMaterialId, 'roofMaterialId');
  requireCanonicalId(spec.functionId, 'functionId');
  requireCanonicalId(spec.constructionOperationId, 'constructionOperationId');
  if (!['PUBLIC', 'DM'].includes(String(spec.privacy))) throw new TypeError('privacy must be PUBLIC or DM');

  const shell = [
    { patchId: 'base', role: 'BASE', vertices: bounds.ring.map((point) => [point[0], baseElevationQ, point[1]]) },
    ...wallPatches(bounds.ring, baseElevationQ, eaveQ),
    ...roofPatches(bounds, roof),
  ];
  return sealCanonicalArtifact({
    artifactKind: 'BUILDING_GEOMETRY',
    artifactId: `${buildingId}:geometry`,
    lawVersion,
    foundationRef: spec.foundationRef,
    plotRef: spec.plotRef,
    buildingId,
    semanticTypeId,
    privacy: spec.privacy,
    functionId: spec.functionId,
    constructionOperationId: spec.constructionOperationId,
    footprint: bounds.ring,
    baseElevationQ,
    wallTopQ,
    roof: { kind: roof.kind, eaveQ, ridgeQ, ridgeAxis: roof.ridgeAxis },
    materials,
    maxHeightQ: ridgeQ,
    shell,
  });
}

/**
 * Geometry-only compiler. Origin is deliberately not an argument.
 * @param {{foundation:Record<string,unknown>,subdivision:Record<string,unknown>,
 *   spec:Record<string,unknown>,recipeSnapshot:Record<string,unknown>}} input
 */
export function compileOriginNeutralBuildingGeometry(input) {
  const source = requireCanonicalRecord(input, 'building compile input');
  const recipe = requireCanonicalRecord(source.recipeSnapshot, 'recipeSnapshot');
  const semantics = requireCanonicalRecord(recipe.semantics, 'recipe semantics');
  if (semantics.geometryLaw === EXPLICIT_BUILDING_MASS_LAW_VERSION) {
    return compileRectilinearGeometry(input, EXPLICIT_BUILDING_MASS_LAW_VERSION, false);
  }
  if (semantics.geometryLaw === COMPOSITE_SHAPE_LAW_VERSION) {
    const shapeSpec = requireExactKeys(source.spec, 'composite building spec', [
      'attachment', 'buildingId', 'constructionOperationId', 'radialPart', 'semanticTypeId',
    ]);
    const attachment = requireCanonicalRecord(shapeSpec.attachment, 'composite building attachment');
    for (const field of ['buildingId', 'constructionOperationId', 'semanticTypeId']) {
      if (shapeSpec[field] !== attachment[field]) {
        throw new TypeError(`composite building ${field} must equal its attachment`);
      }
    }
    const attachmentGeometry = compileRectilinearGeometry(
      { ...input, spec: attachment },
      COMPOSITE_SHAPE_LAW_VERSION,
      true,
    );
    const subdivision = requireCanonicalRecord(source.subdivision, 'subdivision');
    const plotRef = requireCanonicalRecord(attachmentGeometry.plotRef, 'attachmentGeometry.plotRef');
    const plot = frontagePlotById(subdivision, String(plotRef.plotId));
    if (!plot) throw new TypeError('composite building plotRef does not resolve');
    const fragments = compileCompositeShapeFragments({
      attachmentGeometry,
      radialPart: requireCanonicalRecord(shapeSpec.radialPart, 'composite building radialPart'),
      plotRing: plot.fittedFootprint,
    });
    const { contentHash: _attachmentHash, ...result } = attachmentGeometry;
    return sealCanonicalArtifact({
      ...result,
      lawVersion: COMPOSITE_SHAPE_LAW_VERSION,
      ...fragments,
    });
  }
  throw new TypeError('recipe geometryLaw is not registered for building compilation');
}

/** @param {{geometry:Record<string,unknown>,recipeSnapshot:Record<string,unknown>,origin:Record<string,unknown>}} input */
export function bindBuildingOrigin(input) {
  const source = requireCanonicalRecord(input, 'origin binding');
  const geometry = requireCanonicalRecord(source.geometry, 'geometry');
  const recipeSnapshot = requireCanonicalRecord(source.recipeSnapshot, 'recipeSnapshot');
  if (geometry.artifactKind !== 'BUILDING_GEOMETRY'
    || recipeSnapshot.artifactKind !== 'SPATIAL_RECIPE_SNAPSHOT') {
    throw new TypeError('origin binding requires canonical geometry and recipe artifacts');
  }
  const semantics = requireCanonicalRecord(recipeSnapshot.semantics, 'recipeSnapshot.semantics');
  if (semantics.semanticTypeId !== geometry.semanticTypeId
    || semantics.geometryLaw !== geometry.lawVersion) {
    throw new TypeError('recipe semantics cannot be substituted during origin binding');
  }
  const origin = createCanonicalOrigin(source.origin);
  return sealCanonicalArtifact({
    artifactKind: 'CANONICAL_BUILDING_MASS',
    artifactId: `${geometry.buildingId}:mass`,
    geometryRef: canonicalArtifactRef(/** @type {{artifactId:string,contentHash:string}} */ (geometry)),
    recipeSnapshot,
    origin,
    geometry,
  });
}

/** @param {Parameters<typeof compileOriginNeutralBuildingGeometry>[0] & {origin:Record<string,unknown>}} input */
export function compileExplicitBuildingMass(input) {
  const geometry = compileOriginNeutralBuildingGeometry(input);
  return bindBuildingOrigin({ geometry, recipeSnapshot: input.recipeSnapshot, origin: input.origin });
}
