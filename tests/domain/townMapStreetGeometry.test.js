import { describe, expect, it } from 'vitest';

import {
  compileOrthogonalCrossStreetGeometry,
  sealFabricFoundation,
} from '../../src/domain/townMap/fabric/index.js';
import { sealCanonicalArtifact } from '../../src/domain/townMap/fabric/foundation.js';
import {
  SETTLEMENT_ID,
  STREET_GEOMETRY_ID,
  makeSettlementFabric,
  makeSettlementFoundation,
  makeSettlementStreetGeometry,
} from '../fixtures/townMapSettlementFabricFixtures.js';

/** @param {unknown} value */
function expectDeepFrozen(value) {
  if (!value || typeof value !== 'object') return;
  expect(Object.isFrozen(value)).toBe(true);
  for (const child of Object.values(value)) expectDeepFrozen(child);
}

describe('MF-T1G canonical orthogonal-cross street geometry', () => {
  it('A1 publishes one junction and four positive source-bound legs', () => {
    const { geometry } = makeSettlementStreetGeometry();
    expect(geometry.junction).toEqual({
      junctionId: 'settlement:cross:001:street-junction:cross', point: [500, 475],
    });
    expect(geometry.segments).toEqual([
      { segmentId: 'settlement:cross:001:street-segment:high_x',
        sourceStreetId: 'street:settlement:horizontal', direction: 'HIGH_X', line: [[500, 475], [950, 475]] },
      { segmentId: 'settlement:cross:001:street-segment:high_z',
        sourceStreetId: 'street:settlement:vertical', direction: 'HIGH_Z', line: [[500, 475], [500, 950]] },
      { segmentId: 'settlement:cross:001:street-segment:low_x',
        sourceStreetId: 'street:settlement:horizontal', direction: 'LOW_X', line: [[500, 475], [50, 475]] },
      { segmentId: 'settlement:cross:001:street-segment:low_z',
        sourceStreetId: 'street:settlement:vertical', direction: 'LOW_Z', line: [[500, 475], [500, 50]] },
    ]);
    expect(new Set(geometry.segments.map((row) => row.sourceStreetId))).toEqual(
      new Set(['street:settlement:horizontal', 'street:settlement:vertical']),
    );
    for (const row of geometry.segments) expect(row.line[0]).not.toEqual(row.line[1]);
  });

  it('A2 closes identity, source lineage, versions, and recursive immutability', () => {
    const { foundation, geometry } = makeSettlementStreetGeometry();
    expect(geometry).toMatchObject({
      artifactKind: 'STREET_GEOMETRY', artifactId: STREET_GEOMETRY_ID,
      schemaVersion: 1, lawVersion: 'mf-t1g-orthogonal-cross-street-geometry-v1',
      coordinateAbiVersion: foundation.coordinateAbiVersion,
      mapTraditionId: 'EUROPEAN_FANTASY_BASE', settlementId: SETTLEMENT_ID,
      effectiveAt: 'year:1450', leafIndex: 0, midpointRounding: 'FLOOR_Q',
      foundationRef: { artifactId: foundation.artifactId, contentHash: foundation.contentHash },
    });
    expectDeepFrozen(geometry);
  });

  it('A3 uses geometric orientation and FLOOR_Q for odd corridor bands', () => {
    const { geometry } = makeSettlementStreetGeometry({
      verticalStreet: { streetId: 'street:a-vertical', minXQ: 469, maxXQ: 530 },
      horizontalStreet: { streetId: 'street:z-horizontal', minZQ: 441, maxZQ: 510 },
    });
    expect(geometry.junction.point).toEqual([499, 475]);
    expect(geometry.segments.find((row) => row.direction === 'LOW_X').sourceStreetId)
      .toBe('street:z-horizontal');
    expect(geometry.segments.find((row) => row.direction === 'LOW_Z').sourceStreetId)
      .toBe('street:a-vertical');
    expect(geometry.segments.flatMap((row) => row.line).flat().every(Number.isInteger)).toBe(true);
  });

  it('A4 refuses the closed legacy, tamper, non-cross, shape, and key matrix', () => {
    const foundation = makeSettlementFoundation();
    const legacy = sealFabricFoundation({
      artifactId: 'fabric:legacy:street-geometry', effectiveAt: 'year:1450',
      blockFace: { blockId: 'block:legacy', ring: [[100, 100], [700, 100], [700, 500], [100, 500]] },
      streetEdge: { edgeId: 'edge:legacy', blockId: 'block:legacy', edgeIndex: 0, setbackQ: 20 },
    });
    const forgedBody = JSON.parse(JSON.stringify(foundation));
    delete forgedBody.contentHash;
    const horizontal = forgedBody.streetCorridors.find((row) => row.streetId === 'street:settlement:horizontal');
    horizontal.ring = [[60, 440], [950, 440], [950, 510], [60, 510]];
    const nonCross = sealCanonicalArtifact(forgedBody);
    const forgedAbiBody = JSON.parse(JSON.stringify(foundation));
    delete forgedAbiBody.contentHash;
    forgedAbiBody.coordinateAbiVersion = 'forged-coordinate-abi-v999';
    const wrongAbi = sealCanonicalArtifact(forgedAbiBody);
    const base = { artifactId: STREET_GEOMETRY_ID, settlementId: SETTLEMENT_ID };
    const cases = [
      { ...base, foundation: legacy },
      { ...base, foundation: { ...foundation, contentHash: 'scene-v1-tampered' } },
      { ...base, foundation: nonCross },
      { ...base, foundation: wrongAbi },
      { ...base, foundation: [] },
      { ...base, foundation, extra: true },
    ];
    for (const input of cases) {
      expect(() => compileOrthogonalCrossStreetGeometry(input)).toThrow(TypeError);
    }
  });

  it('A6 preserves source pins and publishes only street-geometry authority', () => {
    const { foundation, subdivision } = makeSettlementFabric();
    const { geometry } = makeSettlementStreetGeometry();
    expect(foundation.contentHash).toBe('scene-v1-c72afb9994bd6e8c4a6168e56fdc221e');
    expect(subdivision.contentHash).toBe('scene-v1-38ea62d8983609e19e4fe03cb64092af');
    expect(Object.keys(geometry).sort()).toEqual([
      'artifactId', 'artifactKind', 'contentHash', 'coordinateAbiVersion', 'effectiveAt',
      'foundationRef', 'junction', 'lawVersion', 'leafIndex', 'mapTraditionId',
      'midpointRounding', 'schemaVersion', 'segments', 'settlementId',
    ]);
    for (const row of geometry.segments) {
      expect(Object.keys(row).sort()).toEqual(['direction', 'line', 'segmentId', 'sourceStreetId']);
    }
  });
});
