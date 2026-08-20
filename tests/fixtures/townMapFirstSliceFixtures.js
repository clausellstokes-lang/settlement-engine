import {
  canonicalArtifactRef,
  compileExplicitBuildingMass,
  createCanonicalOrigin,
  createFirstSliceDocument,
  createSpatialRecipeSnapshot,
  sealFabricFoundation,
  subdivideFrontageBlock,
} from '../../src/domain/townMap/fabric/index.js';

export const FIRST_SLICE_AXES = Object.freeze({
  sizeFloorQ: 500,
  gridChaosQ: 0,
  sizeVariationQ: 0,
  emptinessQ: 260,
});

export const MULTI_PLOT_AXES = Object.freeze({
  sizeFloorQ: 160,
  gridChaosQ: 300,
  sizeVariationQ: 500,
  emptinessQ: 260,
});

export function makeFirstSliceFoundation() {
  return sealFabricFoundation({
    artifactId: 'fabric:first-slice:001',
    effectiveAt: 'year:1450',
    blockFace: {
      blockId: 'block:market:001',
      ring: [[100, 100], [700, 100], [700, 500], [100, 500]],
    },
    streetEdge: {
      edgeId: 'street:processional:edge:001',
      blockId: 'block:market:001',
      edgeIndex: 0,
      setbackQ: 20,
    },
  });
}

export function makeFirstSliceFabric(axes = FIRST_SLICE_AXES) {
  const foundation = makeFirstSliceFoundation();
  const subdivision = subdivideFrontageBlock(foundation, 'block:market:001', axes);
  return { foundation, subdivision };
}

export function makeRecipeSnapshot(packageClass = 'BUILT_IN') {
  const custom = packageClass === 'CUSTOM';
  return createSpatialRecipeSnapshot({
    packageClass,
    packageId: custom ? 'package:owner-necromancy' : 'package:settlementforge-core',
    packageVersion: custom ? '3.2.0' : '1.0.0',
    entryId: 'recipe:necromantic-observatory',
    entryVersion: 1,
    semanticTypeId: 'semantic:necromantic-observatory',
  });
}

export function makeOrigin(kind = 'BUILT_IN') {
  const custom = kind === 'CUSTOM';
  return createCanonicalOrigin({
    kind,
    sourceId: custom ? 'package:owner-necromancy' : 'package:settlementforge-core',
    sourceVersion: custom ? '3.2.0' : '1.0.0',
    contentHash: custom ? 'custom-source-hash-v1' : 'builtin-source-hash-v1',
  });
}

export function makeBuildingSpec(subdivision, options = {}) {
  const plot = subdivision.plots[0];
  const buildingId = options.buildingId ?? 'building:necromantic-observatory:001';
  const operationId = options.operationId ?? 'op:construct-observatory:001';
  return {
    buildingId,
    semanticTypeId: 'semantic:necromantic-observatory',
    foundationRef: subdivision.foundationRef,
    plotRef: {
      artifactId: subdivision.artifactId,
      contentHash: subdivision.contentHash,
      plotId: plot.plotId,
    },
    privacy: options.privacy ?? 'PUBLIC',
    footprint: plot.fittedFootprint,
    baseElevationQ: 0,
    wallTopQ: 60,
    roof: { kind: 'GABLE', eaveQ: 60, ridgeQ: 90, ridgeAxis: 'X' },
    materials: { wallMaterialId: 'material:dressed-stone', roofMaterialId: 'material:slate' },
    functionId: 'function:arcane-observation',
    constructionOperationId: operationId,
  };
}

export function makeFirstSliceMass(packageClass = 'BUILT_IN', options = {}) {
  const { foundation, subdivision } = makeFirstSliceFabric();
  const recipeSnapshot = makeRecipeSnapshot(packageClass);
  const origin = makeOrigin(packageClass);
  const spec = makeBuildingSpec(subdivision, options);
  const mass = compileExplicitBuildingMass({ foundation, subdivision, spec, recipeSnapshot, origin });
  return { foundation, subdivision, recipeSnapshot, origin, spec, mass };
}

export function makeFirstSliceDocument(packageClass = 'BUILT_IN', options = {}) {
  const fixture = makeFirstSliceMass(packageClass, options);
  const document = createFirstSliceDocument({
    documentId: options.documentId ?? 'map-document:first-slice:001',
    foundation: fixture.foundation,
    subdivision: fixture.subdivision,
    masses: [fixture.mass],
    operationRefs: [],
  });
  return { ...fixture, document };
}

export function makeEmptyFirstSliceDocument() {
  const { foundation, subdivision } = makeFirstSliceFabric();
  return createFirstSliceDocument({
    documentId: 'map-document:first-slice:001',
    foundation,
    subdivision,
    masses: [],
    operationRefs: [],
  });
}

export function refOf(artifact) {
  return canonicalArtifactRef(artifact);
}
