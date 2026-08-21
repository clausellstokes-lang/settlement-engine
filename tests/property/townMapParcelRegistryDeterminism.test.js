import { describe, expect, it } from 'vitest';

import { compileOrthogonalCrossParcelRegistry } from '../../src/domain/townMap/fabric/index.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  PARCEL_REGISTRY_ID,
  SETTLEMENT_CELLS,
  makeSettlementParcelRegistry,
} from '../fixtures/townMapSettlementFabricFixtures.js';

describe('MF-T1P parcel-registry determinism', () => {
  it('A5 is byte-stable under repeat, upstream reorder, horizontal frontage, replay, and maximum IDs', () => {
    const first = makeSettlementParcelRegistry();
    const second = makeSettlementParcelRegistry();
    const reversed = makeSettlementParcelRegistry({
      cells: SETTLEMENT_CELLS.map((row) => ({ ...row })).reverse(),
    });
    const horizontal = makeSettlementParcelRegistry({ frontageAxis: 'HORIZONTAL' });
    const horizontalAgain = makeSettlementParcelRegistry({ frontageAxis: 'HORIZONTAL' });
    const maximumSourceCells = SETTLEMENT_CELLS.map((row, index) => ({
      ...row,
      blockId: `b${index}${'x'.repeat(86)}`,
    }));
    const maximumSource = makeSettlementParcelRegistry({ cells: maximumSourceCells });
    const maximumSourceAgain = makeSettlementParcelRegistry({ cells: maximumSourceCells });

    const replayedFoundation = JSON.parse(stableSceneStringify(first.foundation));
    const replayedSubdivision = JSON.parse(stableSceneStringify(first.frontageSubdivision));
    const replayedGeometry = JSON.parse(stableSceneStringify(first.geometry));
    const replayedArrangement = JSON.parse(stableSceneStringify(first.arrangement));
    const replayedDcel = JSON.parse(stableSceneStringify(first.dcel));
    const witnesses = [
      replayedFoundation, replayedSubdivision, replayedGeometry, replayedArrangement, replayedDcel,
    ];
    const witnessBytes = witnesses.map((row) => stableSceneStringify(row));
    const replayed = compileOrthogonalCrossParcelRegistry({
      artifactId: PARCEL_REGISTRY_ID,
      foundation: replayedFoundation,
      frontageSubdivision: replayedSubdivision,
      streetGeometry: replayedGeometry,
      boundaryArrangement: replayedArrangement,
      planarDcel: replayedDcel,
    });

    expect(stableSceneStringify(second.parcelRegistry))
      .toBe(stableSceneStringify(first.parcelRegistry));
    expect(stableSceneStringify(reversed.parcelRegistry))
      .toBe(stableSceneStringify(first.parcelRegistry));
    expect(stableSceneStringify(replayed)).toBe(stableSceneStringify(first.parcelRegistry));
    expect(stableSceneStringify(horizontalAgain.parcelRegistry))
      .toBe(stableSceneStringify(horizontal.parcelRegistry));
    expect(stableSceneStringify(maximumSourceAgain.parcelRegistry))
      .toBe(stableSceneStringify(maximumSource.parcelRegistry));
    expect(horizontal.parcelRegistry.contentHash).not.toBe(first.parcelRegistry.contentHash);
    expect(horizontal.parcelRegistry.parcels.map((row) => row.parcelId))
      .toEqual(first.parcelRegistry.parcels.map((row) => row.parcelId));
    expect(horizontal.parcelRegistry.parcels.map((row) => row.faceRef.faceId))
      .not.toEqual(first.parcelRegistry.parcels.map((row) => row.faceRef.faceId));
    expect(new Set(horizontal.parcelRegistry.parcels.map((row) => row.frontageRef.frontageId)).size)
      .toBe(8);
    expect(new Set(horizontal.parcelRegistry.parcels.map((row) => row.faceRef.faceId)).size)
      .toBe(8);
    for (const row of horizontal.parcelRegistry.parcels) {
      expect(row.parcelId).toBe(row.plotRef.plotId);
    }

    const maximumSourceWitnesses = [
      maximumSource.foundation,
      maximumSource.frontageSubdivision,
      maximumSource.geometry,
      maximumSource.arrangement,
      maximumSource.dcel,
    ].map((row) => JSON.parse(stableSceneStringify(row)));
    const maximumSourceReplay = compileOrthogonalCrossParcelRegistry({
      artifactId: PARCEL_REGISTRY_ID,
      foundation: maximumSourceWitnesses[0],
      frontageSubdivision: maximumSourceWitnesses[1],
      streetGeometry: maximumSourceWitnesses[2],
      boundaryArrangement: maximumSourceWitnesses[3],
      planarDcel: maximumSourceWitnesses[4],
    });
    expect(stableSceneStringify(maximumSourceReplay))
      .toBe(stableSceneStringify(maximumSource.parcelRegistry));
    expect(new Set(maximumSourceCells.map((row) => row.blockId)).size).toBe(4);
    expect(maximumSourceCells.every((row) => row.blockId.length === 88)).toBe(true);
    expect(maximumSource.frontageSubdivision.plots
      .every((row) => row.plotId.length === 96)).toBe(true);
    expect(maximumSource.frontageSubdivision.frontages
      .every((row) => row.frontageId.length === 100)).toBe(true);
    const frontageByPlot = new Map(maximumSource.frontageSubdivision.frontages
      .map((row) => [row.plotId, row.frontageId]));
    for (const row of maximumSourceReplay.parcels) {
      expect(row.parcelId).toBe(row.plotRef.plotId);
      expect(row.parcelId).toHaveLength(96);
      expect(row.frontageRef.frontageId).toHaveLength(100);
      expect(row.frontageRef.frontageId).toBe(frontageByPlot.get(row.plotRef.plotId));
    }

    expect(witnesses.map((row) => stableSceneStringify(row))).toEqual(witnessBytes);
    expect(Object.isFrozen(replayedFoundation.ground.ring)).toBe(false);
    expect(Object.isFrozen(replayedSubdivision.plots)).toBe(false);
    expect(Object.isFrozen(replayedGeometry.segments)).toBe(false);
    expect(Object.isFrozen(replayedArrangement.boundaries)).toBe(false);
    expect(Object.isFrozen(replayedDcel.halfEdges)).toBe(false);

    const maximum = compileOrthogonalCrossParcelRegistry({
      artifactId: 'p'.repeat(96),
      foundation: replayedFoundation,
      frontageSubdivision: replayedSubdivision,
      streetGeometry: replayedGeometry,
      boundaryArrangement: replayedArrangement,
      planarDcel: replayedDcel,
    });
    expect(maximum.artifactId).toHaveLength(96);
    expect(maximum.parcels).toEqual(first.parcelRegistry.parcels);
    expect(new Set(maximum.parcels.map((row) => row.parcelId)).size).toBe(8);
    expect(Math.max(...maximum.parcels.map((row) => row.parcelId.length)))
      .toBeLessThanOrEqual(96);
  });
});
