import { describe, expect, it } from 'vitest';

import * as publicFabricApi from '../../src/domain/townMap/fabric/index.js';
import {
  COMPOSITE_SHAPE_LAW_VERSION,
  PLAN_SHAPE_KINDS,
  ROOF_SHAPE_KINDS,
  SHAPE_COORDINATE_ABI,
  VERTICAL_SOLID_KINDS,
  compileExplicitBuildingMass,
  createFirstSliceDocument,
  createSpatialRecipeSnapshot,
  firstSliceProjectionToSvg,
  firstSliceScreenDrawOps,
  loadFirstSliceDocument,
  projectFirstSliceFixedSurvey,
  resolveFirstSliceContent,
  saveFirstSliceDocument,
} from '../../src/domain/townMap/fabric/index.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  makeBuildingSpec,
  makeFirstSliceFabric,
  makeOrigin,
} from '../fixtures/townMapFirstSliceFixtures.js';

function makeShapeRecipe(packageClass = 'BUILT_IN') {
  const custom = packageClass === 'CUSTOM';
  return createSpatialRecipeSnapshot({
    packageClass,
    packageId: custom ? 'package:owner-necromancy' : 'package:settlementforge-core',
    packageVersion: custom ? '3.2.0' : '1.0.0',
    entryId: 'recipe:shaped-necromantic-observatory',
    entryVersion: 1,
    semanticTypeId: 'semantic:necromantic-observatory',
    geometryLaw: COMPOSITE_SHAPE_LAW_VERSION,
  });
}

function makeRadialPart(kind = 'CIRCULAR') {
  const circular = kind === 'CIRCULAR';
  return {
    partId: 'part:observatory-tower',
    role: 'TOWER',
    attachmentAnchorQ: [430, 260],
    plan: circular
      ? { kind, centerQ: [430, 260], radiusQ: 80, segments: 16, orientation: 'VERTEX_EAST' }
      : { kind, centerQ: [430, 260], radiusQ: 80, sides: 8, orientation: 'VERTEX_EAST' },
    vertical: { kind: circular ? 'CYLINDER' : 'EXTRUDED_POLYGON', baseQ: 0, topQ: 130 },
    roof: { kind: circular ? 'CONICAL' : 'PYRAMIDAL', eaveQ: 130, apexQ: 300 },
    materials: {
      wallMaterialId: 'material:obsidian-block',
      roofMaterialId: 'material:blackened-copper',
    },
  };
}

function makeShapeMass(packageClass = 'BUILT_IN', kind = 'CIRCULAR', radialOverride = {}) {
  const { foundation, subdivision } = makeFirstSliceFabric();
  const base = makeBuildingSpec(subdivision);
  const attachment = {
    ...base,
    footprint: [[180, 180], [430, 180], [430, 340], [180, 340]],
    wallTopQ: 50,
    roof: { kind: 'GABLE', eaveQ: 50, ridgeQ: 80, ridgeAxis: 'X' },
  };
  const radialPart = { ...makeRadialPart(kind), ...radialOverride };
  const recipeSnapshot = makeShapeRecipe(packageClass);
  const origin = makeOrigin(packageClass);
  const spec = {
    buildingId: attachment.buildingId,
    semanticTypeId: attachment.semanticTypeId,
    constructionOperationId: attachment.constructionOperationId,
    attachment,
    radialPart,
  };
  const mass = compileExplicitBuildingMass({ foundation, subdivision, spec, recipeSnapshot, origin });
  return { foundation, subdivision, recipeSnapshot, origin, spec, mass };
}

function makeShapeDocument(packageClass = 'BUILT_IN', kind = 'CIRCULAR') {
  const fixture = makeShapeMass(packageClass, kind);
  const document = createFirstSliceDocument({
    documentId: 'map-document:shape-kernel:001',
    foundation: fixture.foundation,
    subdivision: fixture.subdivision,
    masses: [fixture.mass],
    operationRefs: [],
  });
  return { ...fixture, document };
}

function componentEdgeCounts(geometry, component) {
  const patchById = new Map(geometry.shell.map((patch) => [patch.patchId, patch]));
  const counts = new Map();
  for (const patchId of component.patchIds) {
    const vertices = patchById.get(patchId).vertices;
    for (let index = 0; index < vertices.length; index += 1) {
      const ends = [
        JSON.stringify(vertices[index]),
        JSON.stringify(vertices[(index + 1) % vertices.length]),
      ].sort();
      const key = `${ends[0]}|${ends[1]}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

describe('MF-SH1 bounded semantic shape kernel', () => {
  it('retains a circular/cylindrical/conical declaration and closes every component shell', () => {
    expect(Object.hasOwn(publicFabricApi, 'compileCompositeShapeFragments')).toBe(false);
    const { mass } = makeShapeMass();
    const geometry = mass.geometry;
    expect(PLAN_SHAPE_KINDS).toEqual(['RECTILINEAR', 'CIRCULAR', 'REGULAR_POLYGONAL']);
    expect(VERTICAL_SOLID_KINDS).toEqual(['EXTRUDED_POLYGON', 'CYLINDER']);
    expect(ROOF_SHAPE_KINDS).toEqual(['FLAT', 'GABLE', 'CONICAL', 'PYRAMIDAL']);
    expect(geometry.coordinateAbiVersion).toBe(SHAPE_COORDINATE_ABI);
    expect(geometry.solidComposition).toBe('UNION_OF_CLOSED_SHELLS');
    expect(geometry.shapeParts[1].planShape.kind).toBe('CIRCULAR');
    expect(geometry.shapeParts[1].verticalSolid.kind).toBe('CYLINDER');
    expect(geometry.shapeParts[1].roofForm.kind).toBe('CONICAL');
    expect(geometry.projectionSurfaces[1].sourcePatchId).toBe('part:observatory-tower:cap:base');
    const capBase = geometry.shell.find((patch) => patch.patchId === geometry.projectionSurfaces[1].sourcePatchId);
    expect(capBase.vertices).toHaveLength(16);
    expect(geometry.shell.flatMap((patch) => patch.vertices)
      .every((vertex) => vertex.length === 3 && vertex.every(Number.isSafeInteger))).toBe(true);
    for (const component of geometry.componentShells) {
      expect(new Set(componentEdgeCounts(geometry, component).values())).toEqual(new Set([2]));
    }
  });

  it('compiles the bounded polygonal/pyramidal variant and rejects unsupported combinations', () => {
    for (const sides of [4, 6, 8]) {
      const polygonal = makeShapeMass('BUILT_IN', 'REGULAR_POLYGONAL', {
        plan: { kind: 'REGULAR_POLYGONAL', centerQ: [430, 260], radiusQ: 80, sides, orientation: 'VERTEX_EAST' },
      }).mass.geometry;
      expect(polygonal.shapeParts[1].planShape.kind).toBe('REGULAR_POLYGONAL');
      expect(polygonal.shapeParts[1].verticalSolid.kind).toBe('EXTRUDED_POLYGON');
      expect(polygonal.shapeParts[1].roofForm.kind).toBe('PYRAMIDAL');
      const capBase = polygonal.shell.find((patch) => (
        patch.patchId === polygonal.projectionSurfaces[1].sourcePatchId
      ));
      expect(capBase.vertices).toHaveLength(sides);
    }

    expect(() => makeShapeMass('BUILT_IN', 'CIRCULAR', {
      roof: { kind: 'PYRAMIDAL', eaveQ: 130, apexQ: 300 },
    })).toThrow(/incompatible/);
    expect(() => makeShapeMass('BUILT_IN', 'CIRCULAR', {
      plan: { kind: 'CIRCULAR', centerQ: [430, 260], radiusQ: 80, segments: 12, orientation: 'VERTEX_EAST' },
    })).toThrow(/16-segment/);
    expect(() => makeShapeMass('BUILT_IN', 'REGULAR_POLYGONAL', {
      plan: { kind: 'REGULAR_POLYGONAL', centerQ: [430, 260], radiusQ: 80, sides: 5, orientation: 'VERTEX_EAST' },
    })).toThrow(/4, 6, or 8/);
    expect(() => makeShapeMass('BUILT_IN', 'CIRCULAR', {
      plan: { kind: 'CIRCULAR', centerQ: [680, 260], radiusQ: 80, segments: 16, orientation: 'VERTEX_EAST' },
      attachmentAnchorQ: [680, 260],
    })).toThrow(/inside the W3/);
  });

  it('projects the actual shell silhouette through the shared screen/export draw list', () => {
    const { document } = makeShapeDocument();
    const projection = projectFirstSliceFixedSurvey({
      document,
      resolutionReport: resolveFirstSliceContent(document, []),
      audience: 'PUBLIC',
    });
    const shadow = projection.semanticPrimitives.find((row) => row.kind === 'SHADOW');
    const surfaces = projection.semanticPrimitives.filter((row) => row.kind === 'BUILDING');
    expect(shadow.op.pts.length).toBeGreaterThan(4);
    expect(shadow.op.pts).toContainEqual([580, 335]);
    expect(surfaces).toHaveLength(2);
    expect(surfaces[1].op.pts).toHaveLength(16);
    expect(firstSliceScreenDrawOps(projection)).toBe(projection.drawOps);
    expect(firstSliceProjectionToSvg(projection)).toBe(firstSliceProjectionToSvg(projection));
  });

  it('keeps built-in/custom geometry equal and preserves missing custom shape bytes', () => {
    const builtIn = makeShapeDocument('BUILT_IN');
    const custom = makeShapeDocument('CUSTOM');
    expect(custom.mass.geometry).toEqual(builtIn.mass.geometry);
    expect(custom.mass.contentHash).not.toBe(builtIn.mass.contentHash);
    const builtProjection = projectFirstSliceFixedSurvey({
      document: builtIn.document,
      resolutionReport: resolveFirstSliceContent(builtIn.document, []),
      audience: 'PUBLIC',
    });
    const customProjection = projectFirstSliceFixedSurvey({
      document: custom.document,
      resolutionReport: resolveFirstSliceContent(custom.document, [custom.recipeSnapshot]),
      audience: 'PUBLIC',
    });
    expect(customProjection.semanticPrimitives).toEqual(builtProjection.semanticPrimitives);

    const bytes = saveFirstSliceDocument(custom.document);
    const loaded = loadFirstSliceDocument(bytes, []);
    expect(loaded.readOnly).toBe(true);
    expect(loaded.document.masses[0].geometry).toEqual(custom.mass.geometry);
    expect(stableSceneStringify(loaded.document)).toBe(bytes);
    const unresolvedProjection = projectFirstSliceFixedSurvey({
      document: loaded.document,
      resolutionReport: loaded.resolutionReport,
      audience: 'PUBLIC',
    });
    expect(unresolvedProjection.semanticPrimitives.filter((row) => row.kind === 'BUILDING')).toHaveLength(2);
    expect(unresolvedProjection.warnings).toEqual([{
      code: 'UNRESOLVED_CUSTOM_CONTENT',
      entityId: 'building:necromantic-observatory:001',
    }]);
  });

  it('is byte-identical on repeated shape compilation and projection', () => {
    const first = makeShapeDocument();
    const second = makeShapeDocument();
    expect(second.mass.contentHash).toBe(first.mass.contentHash);
    expect(stableSceneStringify(second.document)).toBe(stableSceneStringify(first.document));
    const project = (document) => projectFirstSliceFixedSurvey({
      document,
      resolutionReport: resolveFirstSliceContent(document, []),
      audience: 'PUBLIC',
    });
    expect(project(second.document).contentHash).toBe(project(first.document).contentHash);
  });
});
