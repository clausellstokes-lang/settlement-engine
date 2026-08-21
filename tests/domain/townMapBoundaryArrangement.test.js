import { describe, expect, it } from 'vitest';

import {
  compileOrthogonalCrossCadastralArrangement,
  compileOrthogonalCrossStreetGeometry,
  subdivideSettlementFrontages,
} from '../../src/domain/townMap/fabric/index.js';
import { sealCanonicalArtifact } from '../../src/domain/townMap/fabric/foundation.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  BOUNDARY_ARRANGEMENT_ID,
  SETTLEMENT_AXES,
  SETTLEMENT_ID,
  STREET_GEOMETRY_ID,
  makeSettlementBoundaryArrangement,
} from '../fixtures/townMapSettlementFabricFixtures.js';

const EXPECTED_BOUNDARIES = Object.freeze([
  ['0ccecb9e92525449a97f7e9a80055fc3', [[530, 50], [950, 50]]],
  ['125e8adc3c04212d947496c06099d783', [[470, 50], [470, 250]]],
  ['1bf3ab3faf6304d07998aff3c8587532', [[470, 748], [470, 950]]],
  ['1d3dc6b38e388ca4a91f13873214796e', [[470, 510], [470, 748]]],
  ['2434d12ee6669c8da2f6e5f2febeb2bf', [[950, 727], [950, 950]]],
  ['2cd7219a45d57889fa21896e13e61d2b', [[950, 510], [950, 727]]],
  ['491dc653ca823c7c885fe547c55c891e', [[470, 250], [470, 440]]],
  ['5720c5304e33adbfc93de2d4c58c81d5', [[950, 440], [950, 510]]],
  ['57722dfafe794401869f21ee44d5fa4f', [[50, 440], [50, 510]]],
  ['5ac52f8d2e2b2e14759ff291d27bb0ba', [[530, 50], [530, 240]]],
  ['640ed4e514852156830fd0a1c617ec18', [[50, 733], [50, 950]]],
  ['6f5de0e3538202e080e85a274d90b69a', [[50, 236], [50, 440]]],
  ['72a452e81e7c6aad9c4d9aec7a18dd83', [[50, 733], [470, 748]]],
  ['7962ab7478d6464b33e37918b6fefde9', [[530, 712], [950, 727]]],
  ['7db6d2ccb70d43d719062298568c5ae1', [[530, 950], [950, 950]]],
  ['85320b3ead12f32bd44376ca873a1ea1', [[50, 950], [470, 950]]],
  ['8f79049666d09c99028e0882ccf56c9f', [[530, 510], [530, 712]]],
  ['91a6b476cb18055b9082e9d22f693c59', [[50, 440], [470, 440]]],
  ['933c187731dc6e10c11f865b3cb0333e', [[470, 950], [530, 950]]],
  ['a8438bda52a1f333ed736db681d00c51', [[950, 50], [950, 254]]],
  ['b6c4fc29c120f63ec6bfd46de337b9cc', [[470, 50], [530, 50]]],
  ['b79b405e14f71581c11e23aa0db5b777', [[530, 712], [530, 950]]],
  ['bc49c70c29cb0683b55d2a5055a2b015', [[530, 240], [530, 440]]],
  ['c0c68b1ff35889e4b64d81c31675d446', [[530, 240], [950, 254]]],
  ['c417729f7893d030c5c7889bae0774ba', [[50, 510], [50, 733]]],
  ['c70ffe532c8982e40dcc252fe8309ac6', [[950, 254], [950, 440]]],
  ['dabb77eed0cc920f7736076a0abdf3e5', [[50, 236], [470, 250]]],
  ['db2990ace7af6861aaa1c8e05a997647', [[50, 50], [50, 236]]],
  ['e67d27843d9a5077e92957e064e9b981', [[530, 510], [950, 510]]],
  ['f05ac17e88bbd03b3d2bde6ab648aac9', [[50, 510], [470, 510]]],
  ['f90b64bc12c5eab7c7d5ea28cf5bbdd9', [[530, 440], [950, 440]]],
  ['fc1ee7065b05103376961272067d7cd9', [[50, 50], [470, 50]]],
]);

/** @param {unknown} value */
function expectDeepFrozen(value) {
  if (!value || typeof value !== 'object') return;
  expect(Object.isFrozen(value)).toBe(true);
  for (const child of Object.values(value)) expectDeepFrozen(child);
}

/** @param {Array<[number,number]>} line */
function lineKey(line) {
  return JSON.stringify(line);
}

/** @param {Record<string,unknown>} artifact @param {(body:Record<string,unknown>)=>void} mutate */
function reseal(artifact, mutate) {
  const body = JSON.parse(JSON.stringify(artifact));
  delete body.contentHash;
  mutate(body);
  return sealCanonicalArtifact(body);
}

/** @param {Record<string,unknown>} fixture @param {Record<string,unknown>} overrides */
function compileWith(fixture, overrides = {}) {
  return compileOrthogonalCrossCadastralArrangement({
    artifactId: BOUNDARY_ARRANGEMENT_ID,
    foundation: fixture.foundation,
    frontageSubdivision: fixture.frontageSubdivision,
    streetGeometry: fixture.geometry,
    ...overrides,
  });
}

describe('MF-T1A canonical post-W3 cadastral boundary arrangement', () => {
  it('A1 publishes the exact connected V24 E32 boundary roster and closed counts', () => {
    const { arrangement } = makeSettlementBoundaryArrangement();
    expect(arrangement.boundaries.map((row) => [
      row.boundaryId.replace('cadastral-boundary:scene-v1-', ''), row.geometry,
    ])).toEqual(EXPECTED_BOUNDARIES);
    const vertices = new Set(arrangement.boundaries.flatMap((row) => row.geometry.map(JSON.stringify)));
    const adjacency = new Map([...vertices].map((vertex) => [vertex, new Set()]));
    for (const row of arrangement.boundaries) {
      const [left, right] = row.geometry.map(JSON.stringify);
      adjacency.get(left).add(right);
      adjacency.get(right).add(left);
    }
    const reached = new Set();
    const pending = [[...vertices][0]];
    while (pending.length) {
      const vertex = pending.pop();
      if (reached.has(vertex)) continue;
      reached.add(vertex);
      pending.push(...adjacency.get(vertex));
    }
    expect(vertices.size).toBe(24);
    expect(reached.size).toBe(vertices.size);
    expect(arrangement.boundaries.length - vertices.size + 1).toBe(9);
    expect(arrangement.boundaries.filter((row) => row.role === 'STREET_RIGHT_OF_WAY')).toHaveLength(12);
    expect(arrangement.boundaries.filter((row) => row.role === 'REGISTERED_HARD_BLOCK')).toHaveLength(20);
    expect(arrangement.boundaries.filter((row) => row.source.kind === 'SETTLEMENT_EXTENT')).toHaveLength(16);
    expect(arrangement.boundaries.filter((row) => row.source.kind === 'PARCEL_DIVIDER')).toHaveLength(4);
  });

  it('A2 closes artifact identity, exact source refs, support, and recursive immutability', () => {
    const fixture = makeSettlementBoundaryArrangement();
    const { arrangement, foundation, frontageSubdivision, geometry } = fixture;
    expect(arrangement).toMatchObject({
      artifactKind: 'CADASTRAL_BOUNDARY_ARRANGEMENT', artifactId: BOUNDARY_ARRANGEMENT_ID,
      schemaVersion: 1, lawVersion: 'mf-t1a-orthogonal-cross-cadastral-arrangement-v1',
      coordinateAbiVersion: foundation.coordinateAbiVersion,
      mapTraditionId: foundation.mapTraditionId, settlementId: geometry.settlementId,
      effectiveAt: foundation.effectiveAt, leafIndex: 0,
      arrangementKind: 'ORTHOGONAL_CROSS_POST_W3',
      foundationRef: { artifactId: foundation.artifactId, contentHash: foundation.contentHash },
      frontageSubdivisionRef: {
        artifactId: frontageSubdivision.artifactId, contentHash: frontageSubdivision.contentHash,
      },
      streetGeometryRef: { artifactId: geometry.artifactId, contentHash: geometry.contentHash },
    });
    for (const row of arrangement.boundaries) {
      expect(row.support).toEqual({ kind: 'PLANAR_SURFACE', leafIndex: 0 });
      expect([arrangement.foundationRef, arrangement.frontageSubdivisionRef]).toContainEqual(row.sourceRef);
      expect(row.sourceRef).toEqual(row.source.origin === 'GROUND_STREET_OPENING'
        ? arrangement.foundationRef : arrangement.frontageSubdivisionRef);
    }
    expectDeepFrozen(arrangement);
  });

  it('A3 accounts for every plot edge, divider, extent opening, block, and street lineage once', () => {
    const { arrangement, foundation, frontageSubdivision, geometry } = makeSettlementBoundaryArrangement();
    const plots = new Map(frontageSubdivision.plots.map((plot) => [plot.plotId, plot]));
    const expectedOccurrences = new Set();
    for (const plot of frontageSubdivision.plots) {
      for (let edgeIndex = 0; edgeIndex < plot.plotPolygon.length; edgeIndex += 1) {
        expectedOccurrences.add(`${plot.plotId}@${edgeIndex}`);
      }
    }
    const observedOccurrences = new Set();
    const plotCounts = new Map(frontageSubdivision.plots.map((plot) => [plot.plotId, 0]));
    const blockCounts = new Map(frontageSubdivision.blockIds.map((blockId) => [blockId, 0]));
    const dividers = arrangement.boundaries.filter((row) => row.source.kind === 'PARCEL_DIVIDER');
    for (const row of arrangement.boundaries) {
      const refs = row.source.plotEdges ?? (row.source.plotEdge ? [row.source.plotEdge] : []);
      if (row.source.blockId) blockCounts.set(row.source.blockId, blockCounts.get(row.source.blockId) + 1);
      for (const ref of refs) {
        const plot = plots.get(ref.plotId);
        const directed = [plot.plotPolygon[ref.edgeIndex], plot.plotPolygon[(ref.edgeIndex + 1) % 4]];
        const canonical = [...directed].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        expect(canonical).toEqual(row.geometry);
        observedOccurrences.add(`${ref.plotId}@${ref.edgeIndex}`);
        plotCounts.set(ref.plotId, plotCounts.get(ref.plotId) + 1);
      }
    }
    expect(observedOccurrences).toEqual(expectedOccurrences);
    expect([...plotCounts.values()]).toEqual(Array(8).fill(4));
    expect([...blockCounts.values()]).toEqual(Array(4).fill(7));
    for (const row of dividers) {
      const [left, right] = row.source.plotEdges.map((ref) => {
        const plot = plots.get(ref.plotId);
        return [plot.plotPolygon[ref.edgeIndex], plot.plotPolygon[(ref.edgeIndex + 1) % 4]];
      });
      expect(left).toEqual([...right].reverse());
    }
    const extents = arrangement.boundaries.filter((row) => row.source.kind === 'SETTLEMENT_EXTENT');
    const extentLength = extents.reduce((sum, row) => sum
      + Math.abs(row.geometry[1][0] - row.geometry[0][0])
      + Math.abs(row.geometry[1][1] - row.geometry[0][1]), 0);
    const openings = extents.filter((row) => row.source.origin === 'GROUND_STREET_OPENING');
    expect(openings.map((row) => ({
      geometry: row.geometry,
      groundEdgeIndex: row.source.groundEdgeIndex,
      streetId: row.source.streetId,
    }))).toEqual([
      { geometry: [[950, 440], [950, 510]], groundEdgeIndex: 1,
        streetId: 'street:settlement:horizontal' },
      { geometry: [[50, 440], [50, 510]], groundEdgeIndex: 3,
        streetId: 'street:settlement:horizontal' },
      { geometry: [[470, 950], [530, 950]], groundEdgeIndex: 2,
        streetId: 'street:settlement:vertical' },
      { geometry: [[470, 50], [530, 50]], groundEdgeIndex: 0,
        streetId: 'street:settlement:vertical' },
    ]);
    expect(extentLength).toBe(3600);
    const rows = arrangement.boundaries.filter((row) => row.source.kind === 'STREET_RIGHT_OF_WAY');
    expect(rows.reduce((sum, row) => sum
      + Math.abs(row.geometry[1][0] - row.geometry[0][0])
      + Math.abs(row.geometry[1][1] - row.geometry[0][1]), 0)).toBe(3340);
    expect(new Set(rows.map((row) => row.source.streetId))).toEqual(
      new Set(geometry.segments.map((segment) => segment.sourceStreetId)),
    );
    expect(new Set(extents.map((row) => row.source.groundSurfaceId))).toEqual(
      new Set([foundation.ground.surfaceId]),
    );
    for (const row of arrangement.boundaries) {
      expect(row.role).toBe(row.source.kind === 'STREET_RIGHT_OF_WAY'
        ? 'STREET_RIGHT_OF_WAY' : 'REGISTERED_HARD_BLOCK');
    }
  });

  it('A4 refuses the bounded hash, ref, overlap, gap, shape, and key matrix', () => {
    const fixture = makeSettlementBoundaryArrangement();
    const badSubdivisionRef = reseal(fixture.frontageSubdivision, (body) => {
      body.foundationRef = { artifactId: 'fabric:other', contentHash: 'scene-v1-other' };
    });
    const badGeometryRef = reseal(fixture.geometry, (body) => {
      body.foundationRef = { artifactId: 'fabric:other', contentHash: 'scene-v1-other' };
    });
    const partialOverlap = reseal(fixture.frontageSubdivision, (body) => {
      body.plots.find((plot) => plot.plotId === 'block:settlement:low-x-low-z:plot:01')
        .plotPolygon[2] = [50, 300];
    });
    const coverageGap = reseal(fixture.frontageSubdivision, (body) => {
      body.plots.find((plot) => plot.plotId === 'block:settlement:low-x-low-z:plot:02')
        .plotPolygon[3] = [50, 237];
    });
    const forgedFoundation = reseal(fixture.foundation, (body) => { body.metrics.groundAreaQ += 1; });
    const forgedSubdivision = subdivideSettlementFrontages(forgedFoundation, SETTLEMENT_AXES);
    const forgedGeometry = compileOrthogonalCrossStreetGeometry({
      artifactId: STREET_GEOMETRY_ID, settlementId: SETTLEMENT_ID, foundation: forgedFoundation,
    });
    const cases = [
      { foundation: { ...fixture.foundation, contentHash: 'scene-v1-tampered' } },
      { frontageSubdivision: { ...fixture.frontageSubdivision, contentHash: 'scene-v1-tampered' } },
      { streetGeometry: { ...fixture.geometry, contentHash: 'scene-v1-tampered' } },
      { frontageSubdivision: badSubdivisionRef },
      { streetGeometry: badGeometryRef },
      { frontageSubdivision: partialOverlap },
      { frontageSubdivision: coverageGap },
      { frontageSubdivision: [] },
    ];
    for (const overrides of cases) expect(() => compileWith(fixture, overrides)).toThrow(TypeError);
    expect(() => compileWith({ foundation: forgedFoundation,
      frontageSubdivision: forgedSubdivision, geometry: forgedGeometry })).toThrow(TypeError);
    expect(() => makeSettlementBoundaryArrangement({
      horizontalStreet: { streetId: 'street:settlement:horizontal', minZQ: 250, maxZQ: 304 },
    })).toThrow(TypeError);
    expect(() => compileOrthogonalCrossCadastralArrangement({
      artifactId: BOUNDARY_ARRANGEMENT_ID,
      foundation: fixture.foundation,
      frontageSubdivision: fixture.frontageSubdivision,
      streetGeometry: fixture.geometry,
      extra: true,
    })).toThrow(TypeError);
  });

  it('A6 pins source bytes and publishes boundary authority without downstream topology', () => {
    const { arrangement, foundation, frontageSubdivision, geometry } = makeSettlementBoundaryArrangement();
    expect(foundation.contentHash).toBe('scene-v1-c72afb9994bd6e8c4a6168e56fdc221e');
    expect(frontageSubdivision.contentHash).toBe('scene-v1-38ea62d8983609e19e4fe03cb64092af');
    expect(geometry.contentHash).toBe('scene-v1-3c720d7ef19b040779a7fb82feb85011');
    expect(Object.keys(arrangement).sort()).toEqual([
      'arrangementKind', 'artifactId', 'artifactKind', 'boundaries', 'contentHash',
      'coordinateAbiVersion', 'effectiveAt', 'foundationRef', 'frontageSubdivisionRef',
      'lawVersion', 'leafIndex', 'mapTraditionId', 'schemaVersion', 'settlementId',
      'streetGeometryRef',
    ]);
    for (const row of arrangement.boundaries) {
      expect(Object.keys(row).sort()).toEqual([
        'boundaryId', 'geometry', 'role', 'source', 'sourceRef', 'support',
      ]);
      expect(Object.keys(row.sourceRef).sort()).toEqual(['artifactId', 'contentHash']);
      expect(Object.keys(row.support).sort()).toEqual(['kind', 'leafIndex']);
      const sourceKeys = row.source.kind === 'STREET_RIGHT_OF_WAY'
        ? ['blockId', 'kind', 'plotEdge', 'streetId']
        : row.source.kind === 'PARCEL_DIVIDER'
          ? ['blockId', 'kind', 'plotEdges']
          : row.source.origin === 'PLOT_EDGE'
            ? ['blockId', 'groundSurfaceId', 'kind', 'origin', 'plotEdge']
            : ['groundEdgeIndex', 'groundSurfaceId', 'kind', 'origin', 'streetId'];
      expect(Object.keys(row.source).sort()).toEqual(sourceKeys);
    }
    const bytes = stableSceneStringify(arrangement);
    for (const forbidden of [
      'streetGraphRef', 'adjacency', 'halfEdges', 'faces', 'twins', 'parcels',
      'routeCost', 'buildings', 'drawOps',
    ]) {
      expect(bytes).not.toContain(`"${forbidden}"`); // anchored: the exact 32-row roster and closed member keys above prove liveness
    }
  });
});
