import { describe, expect, it } from 'vitest';

import { compileOrthogonalCrossStreetGraph } from '../../src/domain/townMap/fabric/index.js';
import { sealCanonicalArtifact } from '../../src/domain/townMap/fabric/foundation.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  STREET_GRAPH_ID,
  makeSettlementStreetGeometry,
  makeSettlementStreetGraph,
} from '../fixtures/townMapSettlementFabricFixtures.js';

/** @param {unknown} value */
function expectDeepFrozen(value) {
  if (!value || typeof value !== 'object') return;
  expect(Object.isFrozen(value)).toBe(true);
  for (const child of Object.values(value)) expectDeepFrozen(child);
}

/** @param {Record<string,unknown>} geometry @param {(body:Record<string,unknown>)=>void} mutate */
function resealGeometry(geometry, mutate) {
  const body = JSON.parse(JSON.stringify(geometry));
  delete body.contentHash;
  mutate(body);
  return sealCanonicalArtifact(body);
}

describe('MF-T1N canonical orthogonal-cross street graph', () => {
  it('A1 publishes five ordered nodes and four edges over two source streets', () => {
    const { graph } = makeSettlementStreetGraph();
    expect(graph.nodes.map((row) => [row.nodeId, row.role])).toEqual([
      ['settlement:cross:001:street-junction:cross', 'JUNCTION'],
      ['settlement:cross:001:street-node:high_x', 'EXTENT_ENDPOINT'],
      ['settlement:cross:001:street-node:high_z', 'EXTENT_ENDPOINT'],
      ['settlement:cross:001:street-node:low_x', 'EXTENT_ENDPOINT'],
      ['settlement:cross:001:street-node:low_z', 'EXTENT_ENDPOINT'],
    ]);
    expect(graph.edges.map((row) => row.edgeId)).toEqual([
      'settlement:cross:001:street-segment:high_x',
      'settlement:cross:001:street-segment:high_z',
      'settlement:cross:001:street-segment:low_x',
      'settlement:cross:001:street-segment:low_z',
    ]);
    expect(new Set(graph.edges.map((row) => row.sourceStreetId)).size).toBe(2);
  });

  it('A2 binds exact source identity and recursively freezes graph bytes', () => {
    const { geometry, graph } = makeSettlementStreetGraph();
    expect(graph).toMatchObject({
      artifactKind: 'STREET_GRAPH', artifactId: STREET_GRAPH_ID,
      schemaVersion: 1, lawVersion: 'mf-t1n-orthogonal-cross-street-graph-v1',
      coordinateAbiVersion: geometry.coordinateAbiVersion,
      mapTraditionId: geometry.mapTraditionId, settlementId: geometry.settlementId,
      effectiveAt: geometry.effectiveAt, leafIndex: 0, graphKind: 'UNDIRECTED_INCIDENCE',
      streetGeometryRef: { artifactId: geometry.artifactId, contentHash: geometry.contentHash },
    });
    for (const row of [...graph.nodes, ...graph.edges]) {
      expect(row.geometryRef).toMatchObject(graph.streetGeometryRef);
    }
    expectDeepFrozen(graph);
  });

  it('A3 closes incidence without persisting degree or adjacency caches', () => {
    const { geometry, graph } = makeSettlementStreetGraph();
    const degrees = new Map(graph.nodes.map((node) => [node.nodeId, 0]));
    for (const edge of graph.edges) {
      expect(degrees.has(edge.endpointNodeIds[0])).toBe(true);
      expect(degrees.has(edge.endpointNodeIds[1])).toBe(true);
      for (const nodeId of edge.endpointNodeIds) degrees.set(nodeId, degrees.get(nodeId) + 1);
      expect(edge.geometryRef.segmentId).toBe(edge.edgeId);
      expect(geometry.segments.some((segment) => segment.segmentId === edge.edgeId)).toBe(true);
    }
    expect([...degrees.values()].sort()).toEqual([1, 1, 1, 1, 4]);
    expect(graph.nodes.filter((node) => node.role === 'EXTENT_ENDPOINT')).toHaveLength(4);
    expect(graph.nodes.find((node) => node.role === 'JUNCTION')?.geometryRef).toEqual({
      ...graph.streetGeometryRef, kind: 'JUNCTION', junctionId: geometry.junction.junctionId,
    });
    for (const segment of geometry.segments) {
      const matchingEdges = graph.edges.filter((edge) => edge.geometryRef.segmentId === segment.segmentId);
      const matchingNodes = graph.nodes.filter(
        (node) => node.role === 'EXTENT_ENDPOINT' && node.geometryRef.segmentId === segment.segmentId,
      );
      expect(matchingEdges).toHaveLength(1);
      expect(matchingNodes).toHaveLength(1);
      expect(matchingNodes[0].nodeId).toBe(
        `${geometry.settlementId}:street-node:${segment.direction.toLowerCase()}`,
      );
      expect(matchingNodes[0].geometryRef).toEqual({
        ...graph.streetGeometryRef, kind: 'SEGMENT_ENDPOINT', segmentId: segment.segmentId, endpointIndex: 1,
      });
      expect(matchingEdges[0].sourceStreetId).toBe(segment.sourceStreetId);
      expect(matchingEdges[0].geometryRef).toEqual({
        ...graph.streetGeometryRef, kind: 'SEGMENT', segmentId: segment.segmentId,
      });
      expect(matchingEdges[0].endpointNodeIds).toEqual([
        geometry.junction.junctionId, matchingNodes[0].nodeId,
      ]);
    }
    expect(graph).not.toHaveProperty('adjacency'); // anchored: the exact five live node rows above prove the graph exists
    expect(graph).not.toHaveProperty('degrees'); // anchored: the derived five-entry degree vector above proves the incidence path ran
  });

  it('A4 refuses the bounded identity, direction, pairing, incidence, shape, and key matrix', () => {
    const { geometry } = makeSettlementStreetGeometry();
    const wrongAbi = resealGeometry(geometry, (body) => { body.coordinateAbiVersion = 'forged-abi-v999'; });
    const wrongTradition = resealGeometry(geometry, (body) => {
      body.mapTraditionId = 'FORGED_MAP_TRADITION';
    });
    const duplicateDirection = resealGeometry(geometry, (body) => {
      body.segments[1].direction = body.segments[0].direction;
    });
    const wrongPair = resealGeometry(geometry, (body) => {
      body.segments.find((row) => row.direction === 'HIGH_Z').sourceStreetId = 'street:settlement:horizontal';
    });
    const wrongAxis = resealGeometry(geometry, (body) => {
      body.segments.find((row) => row.direction === 'HIGH_X').line[1][1] += 1;
    });
    const badJunction = resealGeometry(geometry, (body) => {
      body.segments.find((row) => row.direction === 'LOW_X').line[0][0] += 1;
    });
    const badFoundationRef = resealGeometry(geometry, (body) => {
      body.foundationRef = { bogus: true };
    });
    const base = { artifactId: STREET_GRAPH_ID };
    const cases = [
      { ...base, streetGeometry: { ...geometry, contentHash: 'scene-v1-tampered' } },
      { ...base, streetGeometry: wrongAbi },
      { ...base, streetGeometry: wrongTradition },
      { ...base, streetGeometry: duplicateDirection },
      { ...base, streetGeometry: wrongPair },
      { ...base, streetGeometry: wrongAxis },
      { ...base, streetGeometry: badJunction },
      { ...base, streetGeometry: badFoundationRef },
      { ...base, streetGeometry: [] },
      { ...base, streetGeometry: geometry, extra: true },
    ];
    for (const input of cases) expect(() => compileOrthogonalCrossStreetGraph(input)).toThrow(TypeError);
  });

  it('A6 pins geometry and contains no copied spatial, route, cadastral, or draw authority', () => {
    const { geometry, graph } = makeSettlementStreetGraph();
    expect(geometry.contentHash).toBe('scene-v1-3c720d7ef19b040779a7fb82feb85011');
    expect(Object.keys(graph).sort()).toEqual([
      'artifactId', 'artifactKind', 'contentHash', 'coordinateAbiVersion', 'edges',
      'effectiveAt', 'graphKind', 'lawVersion', 'leafIndex', 'mapTraditionId', 'nodes',
      'schemaVersion', 'settlementId', 'streetGeometryRef',
    ]);
    for (const node of graph.nodes) {
      expect(Object.keys(node).sort()).toEqual(['geometryRef', 'nodeId', 'role']);
      expect(Object.keys(node.geometryRef).sort()).toEqual(node.role === 'JUNCTION'
        ? ['artifactId', 'contentHash', 'junctionId', 'kind']
        : ['artifactId', 'contentHash', 'endpointIndex', 'kind', 'segmentId']);
    }
    for (const edge of graph.edges) {
      expect(Object.keys(edge).sort()).toEqual(['edgeId', 'endpointNodeIds', 'geometryRef', 'sourceStreetId']);
      expect(Object.keys(edge.geometryRef).sort()).toEqual(['artifactId', 'contentHash', 'kind', 'segmentId']);
    }
    const bytes = stableSceneStringify(graph);
    for (const forbidden of ['"point"', '"line"', '"routeCost"', '"roadClass"', '"dcel"', '"drawOps"']) {
      expect(bytes).not.toContain(forbidden); // anchored: exact nonempty root/member key rosters above prove serialized graph liveness
    }
  });
});
