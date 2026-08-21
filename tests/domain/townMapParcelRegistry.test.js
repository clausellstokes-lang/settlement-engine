import { describe, expect, it } from 'vitest';

import { compileOrthogonalCrossParcelRegistry } from '../../src/domain/townMap/fabric/index.js';
import { sealCanonicalArtifact } from '../../src/domain/townMap/fabric/foundation.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  PARCEL_REGISTRY_ID,
  makeSettlementParcelRegistry,
  makeSettlementPlanarDcel,
} from '../fixtures/townMapSettlementFabricFixtures.js';

const PARCEL_PINS = Object.freeze([
  ['block:settlement:high-x-high-z:plot:01',
    'block:settlement:high-x-high-z:frontage:01',
    'dcel-face:scene-v1-f7fab801827db07cd721d8e5a4c7795e'],
  ['block:settlement:high-x-high-z:plot:02',
    'block:settlement:high-x-high-z:frontage:02',
    'dcel-face:scene-v1-7e58e6a814e289450edac7e4f8d23a9f'],
  ['block:settlement:high-x-low-z:plot:01',
    'block:settlement:high-x-low-z:frontage:01',
    'dcel-face:scene-v1-2b03820f9f1b36ae3d75c9bbac6dcea4'],
  ['block:settlement:high-x-low-z:plot:02',
    'block:settlement:high-x-low-z:frontage:02',
    'dcel-face:scene-v1-864ba460db60cd295c07485cb4fe4ea7'],
  ['block:settlement:low-x-high-z:plot:01',
    'block:settlement:low-x-high-z:frontage:01',
    'dcel-face:scene-v1-c0fbfdc5fc3bc0f0d380f289c2a90e26'],
  ['block:settlement:low-x-high-z:plot:02',
    'block:settlement:low-x-high-z:frontage:02',
    'dcel-face:scene-v1-1193024d7b33c7a4603a9439f8349782'],
  ['block:settlement:low-x-low-z:plot:01',
    'block:settlement:low-x-low-z:frontage:01',
    'dcel-face:scene-v1-772d4eb6eba3fd278230440253d15125'],
  ['block:settlement:low-x-low-z:plot:02',
    'block:settlement:low-x-low-z:frontage:02',
    'dcel-face:scene-v1-6fafae565a3a1d83d8d2c962d0babb05'],
]);

/** @param {unknown} value */
function expectDeepFrozen(value) {
  if (!value || typeof value !== 'object') return;
  expect(Object.isFrozen(value)).toBe(true);
  for (const child of Object.values(value)) expectDeepFrozen(child);
}

/** @param {Record<string,unknown>} artifact @param {(body:Record<string,unknown>)=>void} mutate */
function reseal(artifact, mutate) {
  const body = JSON.parse(stableSceneStringify(artifact));
  delete body.contentHash;
  mutate(body);
  return sealCanonicalArtifact(body);
}

/** @param {Record<string,unknown>} dcel @param {Record<string,unknown>} face */
function faceCycle(dcel, face) {
  const halfEdges = new Map(dcel.halfEdges.map((row) => [row.halfEdgeId, row]));
  const cycle = [];
  let current = halfEdges.get(face.boundaryHalfEdgeId);
  while (current && !cycle.some((row) => row.halfEdgeId === current.halfEdgeId)) {
    cycle.push(current);
    if (cycle.length > dcel.halfEdges.length) throw new TypeError('open face cycle');
    current = halfEdges.get(current.nextHalfEdgeId);
  }
  if (!current || current.halfEdgeId !== face.boundaryHalfEdgeId) {
    throw new TypeError('face cycle does not return to its start');
  }
  return cycle;
}

/** @param {ReturnType<typeof makeSettlementPlanarDcel>} fixture @param {Record<string,unknown>} [overrides] */
function compileWith(fixture, overrides = {}) {
  return compileOrthogonalCrossParcelRegistry({
    artifactId: PARCEL_REGISTRY_ID,
    foundation: fixture.foundation,
    frontageSubdivision: fixture.frontageSubdivision,
    streetGeometry: fixture.geometry,
    boundaryArrangement: fixture.arrangement,
    planarDcel: fixture.dcel,
    ...overrides,
  });
}

/** @param {Record<string,unknown>} source @param {string} plotId */
function plotBoundaryRows(source, plotId) {
  const rows = [];
  for (const boundary of source.boundaries) {
    const members = boundary.source.plotEdges
      ?? (boundary.source.plotEdge ? [boundary.source.plotEdge] : []);
    for (const member of members) {
      if (member.plotId === plotId) rows.push({
        boundaryId: boundary.boundaryId, edgeIndex: member.edgeIndex,
      });
    }
  }
  return rows;
}

describe('MF-T1P canonical reference-only parcel registry', () => {
  it('A1 publishes the exact eight ordered plot/frontage/face rows and leaves cross and exterior unused', () => {
    const { dcel, parcelRegistry } = makeSettlementParcelRegistry();
    expect(parcelRegistry.parcels.map((row) => [
      row.parcelId, row.frontageRef.frontageId, row.faceRef.faceId,
    ])).toEqual(PARCEL_PINS);
    expect(new Set(parcelRegistry.parcels.map((row) => row.parcelId)).size).toBe(8);
    expect(new Set(parcelRegistry.parcels.map((row) => row.plotRef.plotId)).size).toBe(8);
    expect(new Set(parcelRegistry.parcels.map((row) => row.frontageRef.frontageId)).size).toBe(8);
    expect(new Set(parcelRegistry.parcels.map((row) => row.faceRef.faceId)).size).toBe(8);
    for (const row of parcelRegistry.parcels) expect(row.parcelId).toBe(row.plotRef.plotId);

    const used = new Set(parcelRegistry.parcels.map((row) => row.faceRef.faceId));
    expect(dcel.faces.filter((face) => !used.has(face.faceId)).map((face) => [
      face.faceId, face.faceKind, faceCycle(dcel, face).length,
    ])).toEqual([
      ['dcel-face:scene-v1-72a972d33b2a700a968d998ffbfdd100', 'BOUNDED', 16],
      ['dcel-face:scene-v1-a11a585567b460bcb123b2e189fed906', 'EXTERIOR', 16],
    ]);
  });

  it('A2 closes exact replay metadata, root and nested refs, resolution, and recursive freezing', () => {
    const fixture = makeSettlementParcelRegistry();
    const { frontageSubdivision, arrangement, dcel, parcelRegistry } = fixture;
    const frontageRef = {
      artifactId: frontageSubdivision.artifactId, contentHash: frontageSubdivision.contentHash,
    };
    const arrangementRef = { artifactId: arrangement.artifactId, contentHash: arrangement.contentHash };
    const dcelRef = { artifactId: dcel.artifactId, contentHash: dcel.contentHash };
    expect(parcelRegistry).toMatchObject({
      artifactKind: 'PARCEL_REGISTRY', artifactId: PARCEL_REGISTRY_ID,
      schemaVersion: 1, lawVersion: 'mf-t1p-orthogonal-cross-parcel-registry-v1',
      coordinateAbiVersion: dcel.coordinateAbiVersion, mapTraditionId: dcel.mapTraditionId,
      settlementId: dcel.settlementId, effectiveAt: dcel.effectiveAt, leafIndex: 0,
      registryKind: 'ORTHOGONAL_CROSS_POST_W3_FACE_BINDING',
      frontageRegistryRef: frontageRef,
      boundaryArrangementRef: arrangementRef,
      dcelRef,
    });
    const plots = new Map(frontageSubdivision.plots.map((row) => [row.plotId, row]));
    const frontages = new Map(frontageSubdivision.frontages.map((row) => [row.frontageId, row]));
    const faces = new Map(dcel.faces.map((row) => [row.faceId, row]));
    for (const row of parcelRegistry.parcels) {
      expect(row.plotRef).toEqual({ ...frontageRef, plotId: row.parcelId });
      expect(row.frontageRef).toEqual({
        ...frontageRef, frontageId: row.frontageRef.frontageId,
      });
      expect(row.faceRef).toEqual({ ...dcelRef, faceId: row.faceRef.faceId });
      expect(plots.has(row.plotRef.plotId)).toBe(true);
      expect(frontages.get(row.frontageRef.frontageId)?.plotId).toBe(row.plotRef.plotId);
      expect(faces.get(row.faceRef.faceId)?.faceKind).toBe('BOUNDED');
    }
    expectDeepFrozen(parcelRegistry);
  });

  it('A3 proves complete set-based boundary lineage and the plot/frontage/four-edge-face bijection', () => {
    const { frontageSubdivision, arrangement, dcel, parcelRegistry } = makeSettlementParcelRegistry();
    const faceById = new Map(dcel.faces.map((row) => [row.faceId, row]));
    const usedPlots = new Set();
    const usedFrontages = new Set();
    const usedFaces = new Set();
    for (const row of parcelRegistry.parcels) {
      const lineage = plotBoundaryRows(arrangement, row.plotRef.plotId);
      expect(lineage.map((member) => member.edgeIndex).sort((a, b) => a - b))
        .toEqual([0, 1, 2, 3]);
      expect(new Set(lineage.map((member) => member.boundaryId)).size).toBe(4);
      const face = faceById.get(row.faceRef.faceId);
      expect(face?.faceKind).toBe('BOUNDED');
      const cycle = faceCycle(dcel, face);
      expect(cycle).toHaveLength(4);
      expect(new Set(cycle.map((edge) => edge.faceId))).toEqual(new Set([face.faceId]));
      expect(cycle.map((edge) => edge.boundaryRef.boundaryId).sort())
        .toEqual(lineage.map((member) => member.boundaryId).sort());
      usedPlots.add(row.plotRef.plotId);
      usedFrontages.add(row.frontageRef.frontageId);
      usedFaces.add(row.faceRef.faceId);
    }
    expect(usedPlots).toEqual(new Set(frontageSubdivision.plots.map((row) => row.plotId)));
    expect(usedFrontages).toEqual(new Set(frontageSubdivision.frontages.map((row) => row.frontageId)));
    expect(usedFaces.size).toBe(8);
    expect(dcel.faces.filter((face) => face.faceKind === 'BOUNDED' && !usedFaces.has(face.faceId)))
      .toHaveLength(1);
  });

  it('A4 refuses the finite tamper, mix, coordinated missing/duplicate/ambiguous, identity, and key matrix', () => {
    const fixture = makeSettlementPlanarDcel();
    const horizontal = makeSettlementPlanarDcel({ frontageAxis: 'HORIZONTAL' });
    const missingArrangement = reseal(fixture.arrangement, (body) => {
      const boundary = body.boundaries.find((row) => row.source.plotEdge);
      boundary.source.plotEdge.plotId = 'plot:missing';
    });
    const duplicateSubdivision = reseal(fixture.frontageSubdivision, (body) => {
      body.frontages[1].plotId = body.frontages[0].plotId;
    });
    const ambiguousDcel = reseal(fixture.dcel, (body) => {
      const faces = body.faces.filter((face) => face.faceKind === 'BOUNDED')
        .filter((face) => faceCycle(body, face).length === 4).slice(0, 2);
      const first = faceCycle(body, faces[0]);
      const second = faceCycle(body, faces[1]);
      for (let index = 0; index < 4; index += 1) {
        second[index].boundaryRef.boundaryId = first[index].boundaryRef.boundaryId;
      }
    });
    const missingRef = {
      artifactId: missingArrangement.artifactId, contentHash: missingArrangement.contentHash,
    };
    const coordinatedForgery = reseal(ambiguousDcel, (body) => {
      body.boundaryArrangementRef = missingRef;
      for (const vertex of body.vertices) {
        vertex.geometryRef.artifactId = missingRef.artifactId;
        vertex.geometryRef.contentHash = missingRef.contentHash;
      }
      for (const halfEdge of body.halfEdges) {
        halfEdge.boundaryRef.artifactId = missingRef.artifactId;
        halfEdge.boundaryRef.contentHash = missingRef.contentHash;
      }
    });
    const wrongIdentity = reseal(fixture.dcel, (body) => { body.lawVersion = 'forged-law-v999'; });
    const cases = [
      { foundation: { ...fixture.foundation, contentHash: 'scene-v1-tampered' } },
      { frontageSubdivision: {
        ...fixture.frontageSubdivision, contentHash: 'scene-v1-tampered',
      } },
      { streetGeometry: { ...fixture.geometry, contentHash: 'scene-v1-tampered' } },
      { boundaryArrangement: { ...fixture.arrangement, contentHash: 'scene-v1-tampered' } },
      { planarDcel: { ...fixture.dcel, contentHash: 'scene-v1-tampered' } },
      { foundation: horizontal.foundation,
        frontageSubdivision: horizontal.frontageSubdivision,
        streetGeometry: horizontal.geometry,
        boundaryArrangement: horizontal.arrangement },
      { boundaryArrangement: missingArrangement, planarDcel: coordinatedForgery },
      { frontageSubdivision: duplicateSubdivision },
      { planarDcel: wrongIdentity },
    ];
    for (const overrides of cases) expect(() => compileWith(fixture, overrides)).toThrow(TypeError);
    expect(() => compileOrthogonalCrossParcelRegistry({
      artifactId: PARCEL_REGISTRY_ID,
      foundation: fixture.foundation,
      frontageSubdivision: fixture.frontageSubdivision,
      streetGeometry: fixture.geometry,
      boundaryArrangement: fixture.arrangement,
      planarDcel: fixture.dcel,
      extra: true,
    })).toThrow(TypeError);
  });

  it('A6 pins predecessor bytes and exposes only reference bindings without downstream authority', () => {
    const { frontageSubdivision, arrangement, dcel, parcelRegistry } = makeSettlementParcelRegistry();
    expect(frontageSubdivision.contentHash).toBe('scene-v1-38ea62d8983609e19e4fe03cb64092af');
    expect(arrangement.contentHash).toBe('scene-v1-a1cfadea8ca1bba796bfed3e0a1cb671');
    expect(dcel.contentHash).toBe('scene-v1-9e5a1400770196ff6da8be9417138d0d');
    expect(Object.keys(parcelRegistry).sort()).toEqual([
      'artifactId', 'artifactKind', 'boundaryArrangementRef', 'contentHash',
      'coordinateAbiVersion', 'dcelRef', 'effectiveAt', 'frontageRegistryRef',
      'lawVersion', 'leafIndex', 'mapTraditionId', 'parcels', 'registryKind',
      'schemaVersion', 'settlementId',
    ]);
    for (const row of parcelRegistry.parcels) {
      expect(Object.keys(row).sort()).toEqual(['faceRef', 'frontageRef', 'parcelId', 'plotRef']);
      expect(Object.keys(row.plotRef).sort()).toEqual(['artifactId', 'contentHash', 'plotId']);
      expect(Object.keys(row.frontageRef).sort())
        .toEqual(['artifactId', 'contentHash', 'frontageId']);
      expect(Object.keys(row.faceRef).sort()).toEqual(['artifactId', 'contentHash', 'faceId']);
    }
    const bytes = stableSceneStringify(parcelRegistry);
    for (const forbidden of [
      'point', 'xQ', 'zQ', 'geometry', 'line', 'ring', 'area', 'centroid', 'cycle',
      'halfEdgeIds', 'boundaryIds', 'blockId', 'frontageWidthQ', 'adjacency',
      'ownerId', 'ownership', 'rights', 'use', 'landUse', 'address', 'value',
      'buildability', 'streetId', 'routeCost', 'buildingId', 'persistence',
      'projection', 'drawOps', 'audience', 'privacy',
    ]) {
      expect(bytes).not.toContain(`"${forbidden}"`); // anchored: exact eight live reference rows and key rosters above prove liveness
    }
  });
});
