import { describe, expect, it } from 'vitest';

import {
  FIRST_SLICE_FABRIC_ROOT_LAW_VERSION,
  FIRST_SLICE_FABRIC_ROOT_SCHEMA_VERSION,
  compileOrthogonalCrossFirstSliceFabricRoot,
  compileOrthogonalCrossParcelRegistry,
  compileOrthogonalCrossStreetGraph,
} from '../../src/domain/townMap/fabric/index.js';
import { sealCanonicalArtifact } from '../../src/domain/townMap/fabric/foundation.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  FIRST_SLICE_FABRIC_ROOT_ID,
  makeSettlementFabricRoot,
} from '../fixtures/townMapSettlementFabricFixtures.js';

const ROOT_HASH = 'scene-v1-48ad7a068361f2a59aa7cf5a53308faf';
const ROOT_REF_PINS = Object.freeze([
  ['cadastralBoundaryArrangementRef', 'cadastral-arrangement:settlement-cross:001',
    'scene-v1-a1cfadea8ca1bba796bfed3e0a1cb671'],
  ['dcelRef', 'planar-dcel:settlement-cross:001',
    'scene-v1-9e5a1400770196ff6da8be9417138d0d'],
  ['frontageRegistryRef', 'fabric:settlement-cross:001:frontage:settlement',
    'scene-v1-38ea62d8983609e19e4fe03cb64092af'],
  ['parcelRegistryRef', 'parcel-registry:settlement-cross:001',
    'scene-v1-71946b930acf2a0080c4bd57658b31b6'],
  ['streetGeometryRef', 'street-geometry:settlement-cross:001',
    'scene-v1-3c720d7ef19b040779a7fb82feb85011'],
  ['streetGraphRef', 'street-graph:settlement-cross:001',
    'scene-v1-18be7a3de95499aca1ca2a094c6d0e1e'],
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

/** @param {ReturnType<typeof makeSettlementFabricRoot>} fixture @param {Record<string,unknown>} [overrides] */
function compileWith(fixture, overrides = {}) {
  return compileOrthogonalCrossFirstSliceFabricRoot({
    artifactId: FIRST_SLICE_FABRIC_ROOT_ID,
    foundation: fixture.foundation,
    frontageSubdivision: fixture.frontageSubdivision,
    streetGeometry: fixture.geometry,
    streetGraph: fixture.graph,
    boundaryArrangement: fixture.arrangement,
    planarDcel: fixture.dcel,
    parcelRegistry: fixture.parcelRegistry,
    ...overrides,
  });
}

/** @param {Record<string,unknown>} artifact */
function refOf(artifact) {
  return { artifactId: artifact.artifactId, contentHash: artifact.contentHash };
}

describe('MF-T1F transitional first-slice Fabric reference root', () => {
  it('A1 publishes exact metadata and six role-specific refs under one deterministic root hash', () => {
    const { fabricRoot } = makeSettlementFabricRoot();
    expect(fabricRoot).toMatchObject({
      artifactKind: 'FIRST_SLICE_FABRIC_ROOT',
      artifactId: FIRST_SLICE_FABRIC_ROOT_ID,
      schemaVersion: FIRST_SLICE_FABRIC_ROOT_SCHEMA_VERSION,
      lawVersion: FIRST_SLICE_FABRIC_ROOT_LAW_VERSION,
      coordinateAbiVersion: 'plan-q1-0-1000-v1',
      mapTraditionId: 'EUROPEAN_FANTASY_BASE',
      settlementId: 'settlement:cross:001',
      effectiveAt: 'year:1450',
      leafIndex: 0,
      contentHash: ROOT_HASH,
    });
    expect(ROOT_REF_PINS.map(([role, artifactId, contentHash]) => [
      role, fabricRoot[role].artifactId, fabricRoot[role].contentHash,
    ])).toEqual(ROOT_REF_PINS);
    expect(new Set(ROOT_REF_PINS.map(([role]) => fabricRoot[role].artifactId)).size).toBe(6);
    expectDeepFrozen(fabricRoot);
  });

  it('A2 resolves every root ref once and closes every nested source join', () => {
    const fixture = makeSettlementFabricRoot();
    const { foundation, frontageSubdivision, geometry, graph, arrangement, dcel,
      parcelRegistry, fabricRoot } = fixture;
    const sources = [graph, geometry, arrangement, dcel, frontageSubdivision, parcelRegistry];
    for (const [role] of ROOT_REF_PINS) {
      const target = fabricRoot[role];
      expect(sources.filter((source) => source.artifactId === target.artifactId
        && source.contentHash === target.contentHash)).toHaveLength(1);
    }
    expect(frontageSubdivision.foundationRef).toEqual(refOf(foundation));
    expect(geometry.foundationRef).toEqual(refOf(foundation));
    expect(graph.streetGeometryRef).toEqual(refOf(geometry));
    expect(arrangement.foundationRef).toEqual(refOf(foundation));
    expect(arrangement.frontageSubdivisionRef).toEqual(refOf(frontageSubdivision));
    expect(arrangement.streetGeometryRef).toEqual(refOf(geometry));
    expect(dcel.boundaryArrangementRef).toEqual(refOf(arrangement));
    expect(parcelRegistry.frontageRegistryRef).toEqual(refOf(frontageSubdivision));
    expect(parcelRegistry.boundaryArrangementRef).toEqual(refOf(arrangement));
    expect(parcelRegistry.dcelRef).toEqual(refOf(dcel));
  });

  it('A3 replays both branches byte-for-byte over only their owned metadata fields', () => {
    const fixture = makeSettlementFabricRoot();
    const replayedGraph = compileOrthogonalCrossStreetGraph({
      artifactId: fixture.graph.artifactId,
      streetGeometry: fixture.geometry,
    });
    const replayedParcel = compileOrthogonalCrossParcelRegistry({
      artifactId: fixture.parcelRegistry.artifactId,
      foundation: fixture.foundation,
      frontageSubdivision: fixture.frontageSubdivision,
      streetGeometry: fixture.geometry,
      boundaryArrangement: fixture.arrangement,
      planarDcel: fixture.dcel,
    });
    expect(stableSceneStringify(replayedGraph)).toBe(stableSceneStringify(fixture.graph));
    expect(stableSceneStringify(replayedParcel)).toBe(stableSceneStringify(fixture.parcelRegistry));

    const all = [fixture.foundation, fixture.frontageSubdivision, fixture.geometry,
      fixture.graph, fixture.arrangement, fixture.dcel, fixture.parcelRegistry];
    const settled = [fixture.geometry, fixture.graph, fixture.arrangement,
      fixture.dcel, fixture.parcelRegistry];
    const temporal = [fixture.foundation, ...settled];
    expect(new Set(all.map((row) => row.coordinateAbiVersion)))
      .toEqual(new Set([fixture.fabricRoot.coordinateAbiVersion]));
    expect(new Set(settled.map((row) => row.settlementId)))
      .toEqual(new Set([fixture.fabricRoot.settlementId]));
    for (const field of ['effectiveAt', 'mapTraditionId', 'leafIndex']) {
      expect(new Set(temporal.map((row) => row[field])))
        .toEqual(new Set([fixture.fabricRoot[field]]));
    }
  });

  it('A4 refuses the exact finite thirteen-row tamper, mix, nested-ref, identity, and key matrix', () => {
    const canonical = makeSettlementFabricRoot();
    const horizontal = makeSettlementFabricRoot({ frontageAxis: 'HORIZONTAL' });
    const wrongGraphRef = reseal(canonical.graph, (body) => {
      body.streetGeometryRef.contentHash = 'scene-v1-wrong-geometry-ref';
    });
    const wrongParcelRef = reseal(canonical.parcelRegistry, (body) => {
      body.dcelRef.contentHash = 'scene-v1-wrong-dcel-ref';
    });
    const wrongGraphLaw = reseal(canonical.graph, (body) => {
      body.lawVersion = 'wrong-graph-law-v999';
    });
    const cases = [
      [canonical, { foundation: { ...canonical.foundation, contentHash: 'scene-v1-tampered' } }],
      [canonical, { frontageSubdivision: {
        ...canonical.frontageSubdivision, contentHash: 'scene-v1-tampered',
      } }],
      [canonical, { streetGeometry: { ...canonical.geometry, contentHash: 'scene-v1-tampered' } }],
      [canonical, { streetGraph: { ...canonical.graph, contentHash: 'scene-v1-tampered' } }],
      [canonical, { boundaryArrangement: {
        ...canonical.arrangement, contentHash: 'scene-v1-tampered',
      } }],
      [canonical, { planarDcel: { ...canonical.dcel, contentHash: 'scene-v1-tampered' } }],
      [canonical, { parcelRegistry: {
        ...canonical.parcelRegistry, contentHash: 'scene-v1-tampered',
      } }],
      [canonical, { streetGraph: horizontal.graph }],
      [horizontal, { streetGraph: canonical.graph }],
      [canonical, { streetGraph: wrongGraphRef }],
      [canonical, { parcelRegistry: wrongParcelRef }],
      [canonical, { streetGraph: wrongGraphLaw }],
      [canonical, { extra: true }],
    ];
    expect(cases).toHaveLength(13);
    for (const [fixture, overrides] of cases) {
      expect(() => compileWith(fixture, overrides)).toThrow(TypeError);
    }
  });

  it('A6 pins predecessor bytes and the transitional barrier without copied or downstream authority', () => {
    const fixture = makeSettlementFabricRoot();
    expect([
      fixture.foundation.contentHash,
      fixture.frontageSubdivision.contentHash,
      fixture.geometry.contentHash,
      fixture.graph.contentHash,
      fixture.arrangement.contentHash,
      fixture.dcel.contentHash,
      fixture.parcelRegistry.contentHash,
    ]).toEqual([
      'scene-v1-c72afb9994bd6e8c4a6168e56fdc221e',
      'scene-v1-38ea62d8983609e19e4fe03cb64092af',
      'scene-v1-3c720d7ef19b040779a7fb82feb85011',
      'scene-v1-18be7a3de95499aca1ca2a094c6d0e1e',
      'scene-v1-a1cfadea8ca1bba796bfed3e0a1cb671',
      'scene-v1-9e5a1400770196ff6da8be9417138d0d',
      'scene-v1-71946b930acf2a0080c4bd57658b31b6',
    ]);
    expect(Object.keys(fixture.fabricRoot).sort()).toEqual([
      'artifactId', 'artifactKind', 'cadastralBoundaryArrangementRef', 'contentHash',
      'coordinateAbiVersion', 'dcelRef', 'effectiveAt', 'frontageRegistryRef',
      'lawVersion', 'leafIndex', 'mapTraditionId', 'parcelRegistryRef', 'schemaVersion',
      'settlementId', 'streetGeometryRef', 'streetGraphRef',
    ]);
    expect(fixture.fabricRoot.artifactKind).toBe('FIRST_SLICE_FABRIC_ROOT');
    expect(fixture.fabricRoot.artifactKind).not.toBe('FABRIC');
    for (const [role] of ROOT_REF_PINS) {
      expect(Object.keys(fixture.fabricRoot[role]).sort()).toEqual(['artifactId', 'contentHash']);
    }
    expect(Object.values(fixture.fabricRoot).some(Array.isArray)).toBe(false);
    const bytes = stableSceneStringify(fixture.fabricRoot);
    for (const forbidden of [
      'foundationRef', 'coordinateAbiRef', 'lawManifestRef', 'provenanceRef', 'dependencies',
      'nodes', 'edges', 'junction', 'segments', 'boundaries', 'vertices', 'halfEdges',
      'faces', 'frontages', 'plots', 'parcels', 'route', 'access', 'ownerId', 'ownership',
      'use', 'buildingId', 'operationRefs', 'persistence', 'projection', 'drawOps', 'export',
      'audience', 'privacy', 'dm', 'public', 'packageId', 'label', 'style',
    ]) {
      expect(bytes).not.toContain(`"${forbidden}"`); // anchored: exact 16-key roster and six refs above prove liveness
    }
  });
});
