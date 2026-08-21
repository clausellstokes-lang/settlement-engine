import {
  compileExplicitBuildingMass,
  compileOrthogonalCrossCadastralArrangement,
  compileOrthogonalCrossPlanarDcel,
  compileOrthogonalCrossStreetGeometry,
  compileOrthogonalCrossStreetGraph,
  createCanonicalOrigin,
  createSpatialRecipeSnapshot,
  sealFabricFoundation,
  subdivideSettlementFrontages,
} from '../../src/domain/townMap/fabric/index.js';

export const SETTLEMENT_AXES = Object.freeze({
  sizeFloorQ: 160,
  gridChaosQ: 300,
  sizeVariationQ: 500,
  emptinessQ: 260,
});

export const SETTLEMENT_ID = 'settlement:cross:001';
export const STREET_GEOMETRY_ID = 'street-geometry:settlement-cross:001';
export const STREET_GRAPH_ID = 'street-graph:settlement-cross:001';
export const BOUNDARY_ARRANGEMENT_ID = 'cadastral-arrangement:settlement-cross:001';
export const PLANAR_DCEL_ID = 'planar-dcel:settlement-cross:001';

export const SETTLEMENT_CELLS = Object.freeze([
  { cell: 'LOW_X_LOW_Z', blockId: 'block:settlement:low-x-low-z', edgeId: 'edge:settlement:low-x-low-z' },
  { cell: 'HIGH_X_LOW_Z', blockId: 'block:settlement:high-x-low-z', edgeId: 'edge:settlement:high-x-low-z' },
  { cell: 'LOW_X_HIGH_Z', blockId: 'block:settlement:low-x-high-z', edgeId: 'edge:settlement:low-x-high-z' },
  { cell: 'HIGH_X_HIGH_Z', blockId: 'block:settlement:high-x-high-z', edgeId: 'edge:settlement:high-x-high-z' },
].map(Object.freeze));

/** @param {Record<string,unknown>} [overrides] */
export function makeSettlementPlan(overrides = {}) {
  return {
    kind: 'ORTHOGONAL_CROSS_V1',
    groundRing: [[50, 50], [950, 50], [950, 950], [50, 950]],
    verticalStreet: { streetId: 'street:settlement:vertical', minXQ: 470, maxXQ: 530 },
    horizontalStreet: { streetId: 'street:settlement:horizontal', minZQ: 440, maxZQ: 510 },
    cells: SETTLEMENT_CELLS.map((row) => ({ ...row })),
    frontageAxis: 'VERTICAL',
    setbackQ: 20,
    ...overrides,
  };
}

/** @param {Record<string,unknown>} [planOverrides] */
export function makeSettlementFoundation(planOverrides = {}) {
  return sealFabricFoundation({
    artifactId: 'fabric:settlement-cross:001',
    effectiveAt: 'year:1450',
    plan: makeSettlementPlan(planOverrides),
  });
}

/** @param {Record<string,unknown>} [planOverrides] */
export function makeSettlementStreetGeometry(planOverrides = {}) {
  const foundation = makeSettlementFoundation(planOverrides);
  const geometry = compileOrthogonalCrossStreetGeometry({
    artifactId: STREET_GEOMETRY_ID,
    settlementId: SETTLEMENT_ID,
    foundation,
  });
  return { foundation, geometry };
}

/** @param {Record<string,unknown>} [planOverrides] */
export function makeSettlementStreetGraph(planOverrides = {}) {
  const fixture = makeSettlementStreetGeometry(planOverrides);
  const graph = compileOrthogonalCrossStreetGraph({
    artifactId: STREET_GRAPH_ID,
    streetGeometry: fixture.geometry,
  });
  return { ...fixture, graph };
}

/** @param {Record<string,unknown>} [planOverrides] */
export function makeSettlementBoundaryArrangement(planOverrides = {}) {
  const fixture = makeSettlementStreetGeometry(planOverrides);
  const frontageSubdivision = subdivideSettlementFrontages(fixture.foundation, SETTLEMENT_AXES);
  const arrangement = compileOrthogonalCrossCadastralArrangement({
    artifactId: BOUNDARY_ARRANGEMENT_ID,
    foundation: fixture.foundation,
    frontageSubdivision,
    streetGeometry: fixture.geometry,
  });
  return { ...fixture, frontageSubdivision, arrangement };
}

/** @param {Record<string,unknown>} [planOverrides] */
export function makeSettlementPlanarDcel(planOverrides = {}) {
  const fixture = makeSettlementBoundaryArrangement(planOverrides);
  const dcel = compileOrthogonalCrossPlanarDcel({
    artifactId: PLANAR_DCEL_ID,
    foundation: fixture.foundation,
    frontageSubdivision: fixture.frontageSubdivision,
    streetGeometry: fixture.geometry,
    boundaryArrangement: fixture.arrangement,
  });
  return { ...fixture, dcel };
}

/** @param {Record<string,unknown>} [planOverrides] */
export function makeSettlementFabric(planOverrides = {}) {
  const foundation = makeSettlementFoundation(planOverrides);
  const subdivision = subdivideSettlementFrontages(foundation, SETTLEMENT_AXES);
  return { foundation, subdivision };
}

/** @param {Record<string,unknown>} [planOverrides] */
export function makeSettlementMasses(planOverrides = {}) {
  const { foundation, subdivision } = makeSettlementFabric(planOverrides);
  const recipeSnapshot = createSpatialRecipeSnapshot({
    packageClass: 'BUILT_IN',
    packageId: 'package:settlementforge-core',
    packageVersion: '1.0.0',
    entryId: 'recipe:settlement-range',
    entryVersion: 1,
    semanticTypeId: 'semantic:settlement-range',
  });
  const origin = createCanonicalOrigin({
    kind: 'BUILT_IN',
    sourceId: 'package:settlementforge-core',
    sourceVersion: '1.0.0',
    contentHash: 'builtin-settlement-source-v1',
  });
  const plotById = new Map(subdivision.plots.map((plot) => [plot.plotId, plot]));
  const selectedPlots = foundation.blockFaces.map((block) => {
    const frontage = subdivision.frontages.find((row) => row.blockId === block.blockId);
    return plotById.get(frontage.plotId);
  });
  const masses = selectedPlots.map((plot, index) => {
    const ordinal = String(index + 1).padStart(2, '0');
    const spec = {
      buildingId: `building:settlement-range:${ordinal}`,
      semanticTypeId: 'semantic:settlement-range',
      foundationRef: subdivision.foundationRef,
      plotRef: {
        artifactId: subdivision.artifactId,
        contentHash: subdivision.contentHash,
        plotId: plot.plotId,
      },
      privacy: 'PUBLIC',
      footprint: plot.fittedFootprint,
      baseElevationQ: 0,
      wallTopQ: 48,
      roof: { kind: 'GABLE', eaveQ: 48, ridgeQ: 72, ridgeAxis: 'X' },
      materials: { wallMaterialId: 'material:timber-frame', roofMaterialId: 'material:thatch' },
      functionId: 'function:dwelling',
      constructionOperationId: `op:construct-settlement-range:${ordinal}`,
    };
    return compileExplicitBuildingMass({ foundation, subdivision, spec, recipeSnapshot, origin });
  });
  return { foundation, subdivision, selectedPlots, masses };
}
