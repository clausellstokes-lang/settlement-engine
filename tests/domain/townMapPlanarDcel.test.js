import { describe, expect, it } from 'vitest';

import {
  compileOrthogonalCrossPlanarDcel,
  compileOrthogonalCrossStreetGeometry,
  subdivideSettlementFrontages,
} from '../../src/domain/townMap/fabric/index.js';
import { sealCanonicalArtifact } from '../../src/domain/townMap/fabric/foundation.js';
import { sceneDigest, stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  PLANAR_DCEL_ID,
  SETTLEMENT_AXES,
  SETTLEMENT_ID,
  STREET_GEOMETRY_ID,
  makeSettlementBoundaryArrangement,
  makeSettlementPlanarDcel,
} from '../fixtures/townMapSettlementFabricFixtures.js';

const CANONICAL_AREA2_ROSTER = Object.freeze([
  -1620000, 162120, 162120, 165480, 165480,
  175980, 175980, 193620, 193620, 225600,
]);

const VERTEX_PINS = Object.freeze([
  ['dcel-vertex:scene-v1-09cbec019379a27021842acd740e4cd6',
    'cadastral-boundary:scene-v1-1bf3ab3faf6304d07998aff3c8587532', 0],
  ['dcel-vertex:scene-v1-1bf984c17da9731e37020575353f1e8c',
    'cadastral-boundary:scene-v1-6f5de0e3538202e080e85a274d90b69a', 0],
  ['dcel-vertex:scene-v1-1d87c62fac3368d2ccaccaf3e4e89358',
    'cadastral-boundary:scene-v1-125e8adc3c04212d947496c06099d783', 1],
  ['dcel-vertex:scene-v1-281359816aa5e508341d815dc8ad6626',
    'cadastral-boundary:scene-v1-5ac52f8d2e2b2e14759ff291d27bb0ba', 1],
  ['dcel-vertex:scene-v1-47f592ffb4f970baea5c5f13c6e5a34c',
    'cadastral-boundary:scene-v1-bc49c70c29cb0683b55d2a5055a2b015', 1],
  ['dcel-vertex:scene-v1-6da96eacde041a3bd550e020db9c6495',
    'cadastral-boundary:scene-v1-57722dfafe794401869f21ee44d5fa4f', 1],
  ['dcel-vertex:scene-v1-7388632b5e65a4be84dd114fc02a6ce0',
    'cadastral-boundary:scene-v1-2434d12ee6669c8da2f6e5f2febeb2bf', 0],
  ['dcel-vertex:scene-v1-7a5657567aa4f077317c59fa6763e901',
    'cadastral-boundary:scene-v1-a8438bda52a1f333ed736db681d00c51', 1],
  ['dcel-vertex:scene-v1-80b4f2b270de614f16036d4628708511',
    'cadastral-boundary:scene-v1-1bf3ab3faf6304d07998aff3c8587532', 1],
  ['dcel-vertex:scene-v1-88c565af754771bea3b0b39bb7ef7d3c',
    'cadastral-boundary:scene-v1-2cd7219a45d57889fa21896e13e61d2b', 0],
  ['dcel-vertex:scene-v1-8a5479dababa6045dedefed67a99223f',
    'cadastral-boundary:scene-v1-57722dfafe794401869f21ee44d5fa4f', 0],
  ['dcel-vertex:scene-v1-8e27a419b846aba8c07fcf754c1374ba',
    'cadastral-boundary:scene-v1-7962ab7478d6464b33e37918b6fefde9', 0],
  ['dcel-vertex:scene-v1-92e92edd180744201571ed7947795df6',
    'cadastral-boundary:scene-v1-db2990ace7af6861aaa1c8e05a997647', 0],
  ['dcel-vertex:scene-v1-92ebf63604decdbdf1a672caade1cdab',
    'cadastral-boundary:scene-v1-0ccecb9e92525449a97f7e9a80055fc3', 0],
  ['dcel-vertex:scene-v1-aaa9df55389e7b0c113388e1b67c5776',
    'cadastral-boundary:scene-v1-8f79049666d09c99028e0882ccf56c9f', 0],
  ['dcel-vertex:scene-v1-b94c65cfc2dbb6bc4131991be94c36da',
    'cadastral-boundary:scene-v1-125e8adc3c04212d947496c06099d783', 0],
  ['dcel-vertex:scene-v1-beffdcc235ea03af1c07ece6201e1371',
    'cadastral-boundary:scene-v1-1d3dc6b38e388ca4a91f13873214796e', 0],
  ['dcel-vertex:scene-v1-c19b868156f474f415c47b25cc1505aa',
    'cadastral-boundary:scene-v1-5720c5304e33adbfc93de2d4c58c81d5', 0],
  ['dcel-vertex:scene-v1-c245de5949904b66b10eb32d7f43ef34',
    'cadastral-boundary:scene-v1-640ed4e514852156830fd0a1c617ec18', 0],
  ['dcel-vertex:scene-v1-c3b9c34fc952fa8e8b4e6ffb361f3cc4',
    'cadastral-boundary:scene-v1-2434d12ee6669c8da2f6e5f2febeb2bf', 1],
  ['dcel-vertex:scene-v1-c4bac3654067fbd4b309f58109b2d956',
    'cadastral-boundary:scene-v1-7db6d2ccb70d43d719062298568c5ae1', 0],
  ['dcel-vertex:scene-v1-dc29b1706ec02481399ecabc95359623',
    'cadastral-boundary:scene-v1-491dc653ca823c7c885fe547c55c891e', 1],
  ['dcel-vertex:scene-v1-ebb80cbcb443caa3ff6e21003e85262d',
    'cadastral-boundary:scene-v1-0ccecb9e92525449a97f7e9a80055fc3', 1],
  ['dcel-vertex:scene-v1-f29b5e74329c6a9b16addd58213201a5',
    'cadastral-boundary:scene-v1-640ed4e514852156830fd0a1c617ec18', 1],
]);

const FACE_PINS = Object.freeze([
  ['dcel-face:scene-v1-1193024d7b33c7a4603a9439f8349782', 'BOUNDED',
    'dcel-half-edge:scene-v1-3a7f84b9f55fbf5c26a6d7b50061f032', 175980, 4],
  ['dcel-face:scene-v1-2b03820f9f1b36ae3d75c9bbac6dcea4', 'BOUNDED',
    'dcel-half-edge:scene-v1-4b6a61f2de30c0a795cf8e3e3e2118fd', 162120, 4],
  ['dcel-face:scene-v1-6fafae565a3a1d83d8d2c962d0babb05', 'BOUNDED',
    'dcel-half-edge:scene-v1-361d89b9b0324a5456105e151ed2a346', 165480, 4],
  ['dcel-face:scene-v1-72a972d33b2a700a968d998ffbfdd100', 'BOUNDED',
    'dcel-half-edge:scene-v1-03c544b72309cfca4e15baeb82d024c0', 225600, 16],
  ['dcel-face:scene-v1-772d4eb6eba3fd278230440253d15125', 'BOUNDED',
    'dcel-half-edge:scene-v1-2ede47655648f0dc9fb30b818e85b07e', 162120, 4],
  ['dcel-face:scene-v1-7e58e6a814e289450edac7e4f8d23a9f', 'BOUNDED',
    'dcel-half-edge:scene-v1-0311024afadde95ba43595eef7d3a4dd', 175980, 4],
  ['dcel-face:scene-v1-864ba460db60cd295c07485cb4fe4ea7', 'BOUNDED',
    'dcel-half-edge:scene-v1-11fc619cf1e387a5e48078801ca9eb53', 165480, 4],
  ['dcel-face:scene-v1-a11a585567b460bcb123b2e189fed906', 'EXTERIOR',
    'dcel-half-edge:scene-v1-00067b58a687312d92a62e84786b4f47', -1620000, 16],
  ['dcel-face:scene-v1-c0fbfdc5fc3bc0f0d380f289c2a90e26', 'BOUNDED',
    'dcel-half-edge:scene-v1-177fec9356837e1a3c9924679030d4c0', 193620, 4],
  ['dcel-face:scene-v1-f7fab801827db07cd721d8e5a4c7795e', 'BOUNDED',
    'dcel-half-edge:scene-v1-122774567aa18bef58b497a2d68823ad', 193620, 4],
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

/** @param {ReturnType<typeof makeSettlementBoundaryArrangement>} fixture @param {Record<string,unknown>} [overrides] */
function compileWith(fixture, overrides = {}) {
  return compileOrthogonalCrossPlanarDcel({
    artifactId: PLANAR_DCEL_ID,
    foundation: fixture.foundation,
    frontageSubdivision: fixture.frontageSubdivision,
    streetGeometry: fixture.geometry,
    boundaryArrangement: fixture.arrangement,
    ...overrides,
  });
}

/** @param {ReturnType<typeof makeSettlementPlanarDcel>} fixture */
function topologyView(fixture) {
  const { arrangement, dcel } = fixture;
  const boundaryById = new Map(arrangement.boundaries.map((row) => [row.boundaryId, row]));
  const vertexById = new Map(dcel.vertices.map((row) => [row.vertexId, row]));
  const halfEdgeById = new Map(dcel.halfEdges.map((row) => [row.halfEdgeId, row]));
  /** @param {string} vertexId */
  const pointFor = (vertexId) => {
    const ref = vertexById.get(vertexId)?.geometryRef;
    const boundary = boundaryById.get(ref?.boundaryId);
    if (!boundary || ![0, 1].includes(ref.endpointIndex)) throw new TypeError('unresolved vertex');
    return boundary.geometry[ref.endpointIndex];
  };
  const faceRows = dcel.faces.map((face) => {
    const cycle = [];
    let current = halfEdgeById.get(face.boundaryHalfEdgeId);
    while (current && !cycle.some((row) => row.halfEdgeId === current.halfEdgeId)) {
      cycle.push(current);
      if (cycle.length > dcel.halfEdges.length) throw new TypeError('open face cycle');
      current = halfEdgeById.get(current.nextHalfEdgeId);
    }
    if (!current || current.halfEdgeId !== face.boundaryHalfEdgeId) {
      throw new TypeError('face cycle does not return to its start');
    }
    let area2 = 0;
    for (let index = 0; index < cycle.length; index += 1) {
      const point = pointFor(cycle[index].originVertexId);
      const nextPoint = pointFor(cycle[(index + 1) % cycle.length].originVertexId);
      area2 += point[0] * nextPoint[1] - nextPoint[0] * point[1];
    }
    return { ...face, cycle, area2 };
  });
  return { boundaryById, vertexById, halfEdgeById, pointFor, faceRows };
}

describe('MF-T1D canonical reference-only planar DCEL', () => {
  it('A1 pins the exact V24 E32 H64 F10 identities, degrees, cycles, areas, and Euler closure', () => {
    const fixture = makeSettlementPlanarDcel();
    const { arrangement, dcel } = fixture;
    const view = topologyView(fixture);
    expect([dcel.vertices.length, arrangement.boundaries.length,
      dcel.halfEdges.length, dcel.faces.length]).toEqual([24, 32, 64, 10]);
    expect(dcel.vertices.map((row) => [
      row.vertexId, row.geometryRef.boundaryId, row.geometryRef.endpointIndex,
    ])).toEqual(VERTEX_PINS);

    const expectedHalfEdges = arrangement.boundaries.flatMap((boundary) => [0, 1].map(
      (endpointIndex) => [
        `dcel-half-edge:${sceneDigest({
          coordinateAbiVersion: arrangement.coordinateAbiVersion,
          settlementId: arrangement.settlementId,
          boundaryId: boundary.boundaryId,
          endpointIndex,
        })}`,
        boundary.boundaryId,
      ],
    )).sort((left, right) => left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0);
    expect(dcel.halfEdges.map((row) => [row.halfEdgeId, row.boundaryRef.boundaryId]))
      .toEqual(expectedHalfEdges);
    expect(view.faceRows.map((row) => [
      row.faceId, row.faceKind, row.boundaryHalfEdgeId, row.area2, row.cycle.length,
    ])).toEqual(FACE_PINS);
    expect(view.faceRows.map((row) => row.area2).sort((a, b) => a - b))
      .toEqual(CANONICAL_AREA2_ROSTER);

    const degrees = new Map(dcel.vertices.map((row) => [row.vertexId, 0]));
    for (const row of dcel.halfEdges) degrees.set(row.originVertexId, degrees.get(row.originVertexId) + 1);
    expect([...degrees.values()].sort((a, b) => a - b)).toEqual([
      2, 2, 2, 2, 2, 2, 2, 2,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
    ]);
    expect(dcel.vertices.length - arrangement.boundaries.length + dcel.faces.length).toBe(2);
    expect(new Set([...dcel.vertices, ...dcel.halfEdges, ...dcel.faces]
      .map((row) => row.vertexId ?? row.halfEdgeId ?? row.faceId)).size).toBe(98);
  });

  it('A2 closes exact replay metadata, coordinate-free source refs, endpoint anchors, and freezing', () => {
    const fixture = makeSettlementPlanarDcel();
    const { foundation, frontageSubdivision, geometry, arrangement, dcel } = fixture;
    const arrangementRef = { artifactId: arrangement.artifactId, contentHash: arrangement.contentHash };
    expect(dcel).toMatchObject({
      artifactKind: 'PLANAR_DCEL', artifactId: PLANAR_DCEL_ID,
      schemaVersion: 1, lawVersion: 'mf-t1d-orthogonal-cross-planar-dcel-v1',
      coordinateAbiVersion: arrangement.coordinateAbiVersion,
      mapTraditionId: arrangement.mapTraditionId, settlementId: arrangement.settlementId,
      effectiveAt: arrangement.effectiveAt, leafIndex: 0,
      boundaryArrangementRef: arrangementRef, embeddingKind: 'XZ_LEFT_FACE_V1',
    });
    expect(arrangement.foundationRef).toEqual({
      artifactId: foundation.artifactId, contentHash: foundation.contentHash,
    });
    expect(arrangement.frontageSubdivisionRef).toEqual({
      artifactId: frontageSubdivision.artifactId, contentHash: frontageSubdivision.contentHash,
    });
    expect(arrangement.streetGeometryRef).toEqual({
      artifactId: geometry.artifactId, contentHash: geometry.contentHash,
    });
    for (const vertex of dcel.vertices) {
      expect(vertex.geometryRef).toMatchObject({ ...arrangementRef, kind: 'BOUNDARY_ENDPOINT' });
      const anchor = arrangement.boundaries.find(
        (row) => row.boundaryId === vertex.geometryRef.boundaryId,
      );
      expect(anchor).toBeDefined();
      const point = anchor.geometry[vertex.geometryRef.endpointIndex];
      const occurrences = arrangement.boundaries.flatMap((boundary) => [0, 1].map(
        (endpointIndex) => ({ boundaryId: boundary.boundaryId, endpointIndex,
          point: boundary.geometry[endpointIndex] }),
      )).filter((row) => stableSceneStringify(row.point) === stableSceneStringify(point))
        .sort((left, right) => left.boundaryId < right.boundaryId ? -1
          : left.boundaryId > right.boundaryId ? 1 : left.endpointIndex - right.endpointIndex);
      expect([vertex.geometryRef.boundaryId, vertex.geometryRef.endpointIndex])
        .toEqual([occurrences[0].boundaryId, occurrences[0].endpointIndex]);
    }
    for (const halfEdge of dcel.halfEdges) {
      expect(halfEdge.boundaryRef).toEqual({
        ...arrangementRef, kind: 'BOUNDARY', boundaryId: halfEdge.boundaryRef.boundaryId,
      });
    }
    expectDeepFrozen(dcel);
  });

  it('A3 closes boundary twins, next/previous inverses, vertex incidence, and ten face partitions', () => {
    const fixture = makeSettlementPlanarDcel();
    const { arrangement, dcel } = fixture;
    const view = topologyView(fixture);
    for (const boundary of arrangement.boundaries) {
      const pair = dcel.halfEdges.filter((row) => row.boundaryRef.boundaryId === boundary.boundaryId);
      expect(pair).toHaveLength(2);
      expect(pair.map((row) => view.pointFor(row.originVertexId))
        .sort((left, right) => left[0] - right[0] || left[1] - right[1]))
        .toEqual([...boundary.geometry].sort((left, right) => left[0] - right[0] || left[1] - right[1]));
    }
    for (const halfEdge of dcel.halfEdges) {
      const twin = view.halfEdgeById.get(halfEdge.twinHalfEdgeId);
      const next = view.halfEdgeById.get(halfEdge.nextHalfEdgeId);
      const previous = view.halfEdgeById.get(halfEdge.previousHalfEdgeId);
      expect(twin?.twinHalfEdgeId).toBe(halfEdge.halfEdgeId);
      expect(twin?.boundaryRef.boundaryId).toBe(halfEdge.boundaryRef.boundaryId);
      expect(next?.previousHalfEdgeId).toBe(halfEdge.halfEdgeId);
      expect(previous?.nextHalfEdgeId).toBe(halfEdge.halfEdgeId);
      expect(next?.originVertexId).toBe(twin?.originVertexId);
      expect(next?.faceId).toBe(halfEdge.faceId);
      expect(previous?.faceId).toBe(halfEdge.faceId);
    }
    for (const vertex of dcel.vertices) {
      const outgoing = dcel.halfEdges.filter((row) => row.originVertexId === vertex.vertexId)
        .map((row) => row.halfEdgeId).sort();
      expect(vertex.incidentHalfEdgeId).toBe(outgoing[0]);
    }
    const partition = view.faceRows.flatMap((row) => row.cycle.map((edge) => edge.halfEdgeId));
    expect(partition).toHaveLength(64);
    expect(new Set(partition)).toEqual(new Set(dcel.halfEdges.map((row) => row.halfEdgeId)));
    for (const face of view.faceRows) {
      const halfEdgeIds = face.cycle.map((row) => row.halfEdgeId);
      expect(face.boundaryHalfEdgeId).toBe([...halfEdgeIds].sort()[0]);
      expect(face.faceId).toBe(`dcel-face:${sceneDigest({
        coordinateAbiVersion: dcel.coordinateAbiVersion,
        settlementId: dcel.settlementId,
        halfEdgeIds,
      })}`);
    }
    const exterior = view.faceRows.filter((row) => row.faceKind === 'EXTERIOR');
    expect(exterior).toHaveLength(1);
    expect(dcel.outerFaceId).toBe(exterior[0].faceId);
    expect(view.faceRows.filter((row) => row.faceKind === 'BOUNDED')).toHaveLength(9);
  });

  it('A4 refuses the finite tamper, witness, forgery, order, key, identity, and embedding matrix', () => {
    const fixture = makeSettlementBoundaryArrangement();
    const variant = makeSettlementBoundaryArrangement({
      verticalStreet: {
        streetId: 'street:settlement:vertical', minXQ: 450, maxXQ: 520,
      },
      horizontalStreet: {
        streetId: 'street:settlement:horizontal', minZQ: 420, maxZQ: 500,
      },
    });
    const forgedFoundation = reseal(fixture.foundation, (body) => { body.metrics.groundAreaQ += 1; });
    const forgedSubdivision = subdivideSettlementFrontages(forgedFoundation, SETTLEMENT_AXES);
    const forgedGeometry = compileOrthogonalCrossStreetGeometry({
      artifactId: STREET_GEOMETRY_ID, settlementId: SETTLEMENT_ID, foundation: forgedFoundation,
    });
    const forgedRef = (artifact) => ({
      artifactId: artifact.artifactId, contentHash: artifact.contentHash,
    });
    const coordinatedForgery = reseal(fixture.arrangement, (body) => {
      body.foundationRef = forgedRef(forgedFoundation);
      body.frontageSubdivisionRef = forgedRef(forgedSubdivision);
      body.streetGeometryRef = forgedRef(forgedGeometry);
      for (const boundary of body.boundaries) {
        boundary.sourceRef = boundary.source.origin === 'GROUND_STREET_OPENING'
          ? body.foundationRef : body.frontageSubdivisionRef;
      }
    });
    const reversed = reseal(fixture.arrangement, (body) => { body.boundaries.reverse(); });
    const wrongIdentity = reseal(fixture.arrangement, (body) => { body.lawVersion = 'forged-law-v999'; });
    const extraRootKey = reseal(fixture.arrangement, (body) => { body.extra = true; });
    const invalidEmbedding = reseal(fixture.arrangement, (body) => {
      const boundary = body.boundaries.find(
        (row) => stableSceneStringify(row.geometry) === '[[50,236],[470,250]]',
      );
      boundary.geometry = [[50, 236], [530, 240]];
      boundary.boundaryId = `cadastral-boundary:${sceneDigest({
        coordinateAbiVersion: body.coordinateAbiVersion,
        settlementId: body.settlementId,
        geometry: boundary.geometry,
      })}`;
      body.boundaries.sort((left, right) => left.boundaryId < right.boundaryId ? -1
        : left.boundaryId > right.boundaryId ? 1 : 0);
    });
    const cases = [
      { boundaryArrangement: { ...fixture.arrangement, contentHash: 'scene-v1-tampered' } },
      { foundation: { ...fixture.foundation, contentHash: 'scene-v1-tampered' } },
      { foundation: variant.foundation, frontageSubdivision: variant.frontageSubdivision,
        streetGeometry: variant.geometry },
      { foundation: forgedFoundation, frontageSubdivision: forgedSubdivision,
        streetGeometry: forgedGeometry, boundaryArrangement: coordinatedForgery },
      { boundaryArrangement: reversed },
      { boundaryArrangement: wrongIdentity },
      { boundaryArrangement: extraRootKey },
      { boundaryArrangement: invalidEmbedding },
    ];
    for (const overrides of cases) expect(() => compileWith(fixture, overrides)).toThrow(TypeError);
    expect(() => compileOrthogonalCrossPlanarDcel({
      artifactId: PLANAR_DCEL_ID,
      foundation: fixture.foundation,
      frontageSubdivision: fixture.frontageSubdivision,
      streetGeometry: fixture.geometry,
      boundaryArrangement: fixture.arrangement,
      extra: true,
    })).toThrow(TypeError);
  });

  it('A6 pins arrangement bytes and exposes topology without geometry or downstream authority', () => {
    const { arrangement, dcel } = makeSettlementPlanarDcel();
    expect(arrangement.contentHash).toBe('scene-v1-a1cfadea8ca1bba796bfed3e0a1cb671');
    expect(Object.keys(dcel).sort()).toEqual([
      'artifactId', 'artifactKind', 'boundaryArrangementRef', 'contentHash',
      'coordinateAbiVersion', 'effectiveAt', 'embeddingKind', 'faces', 'halfEdges',
      'lawVersion', 'leafIndex', 'mapTraditionId', 'outerFaceId', 'schemaVersion',
      'settlementId', 'vertices',
    ]);
    expect(Object.keys(dcel.boundaryArrangementRef).sort()).toEqual(['artifactId', 'contentHash']);
    for (const vertex of dcel.vertices) {
      expect(Object.keys(vertex).sort()).toEqual(['geometryRef', 'incidentHalfEdgeId', 'vertexId']);
      expect(Object.keys(vertex.geometryRef).sort()).toEqual([
        'artifactId', 'boundaryId', 'contentHash', 'endpointIndex', 'kind',
      ]);
    }
    for (const halfEdge of dcel.halfEdges) {
      expect(Object.keys(halfEdge).sort()).toEqual([
        'boundaryRef', 'faceId', 'halfEdgeId', 'nextHalfEdgeId', 'originVertexId',
        'previousHalfEdgeId', 'twinHalfEdgeId',
      ]);
      expect(Object.keys(halfEdge.boundaryRef).sort()).toEqual([
        'artifactId', 'boundaryId', 'contentHash', 'kind',
      ]);
    }
    for (const face of dcel.faces) {
      expect(Object.keys(face).sort()).toEqual(['boundaryHalfEdgeId', 'faceId', 'faceKind']);
    }
    const bytes = stableSceneStringify(dcel);
    for (const forbidden of [
      'point', 'xQ', 'zQ', 'geometry', 'line', 'ring', 'area', 'centroid', 'cycle',
      'foundationRef', 'frontageSubdivisionRef', 'streetGeometryRef', 'streetGraphRef',
      'adjacency', 'holes', 'parcels', 'frontages', 'routeCost', 'buildings',
      'persistence', 'projection', 'drawOps', 'audience',
    ]) {
      expect(bytes).not.toContain(`"${forbidden}"`); // anchored: exact nonempty topology key rosters above prove liveness
    }
  });
});
