import { describe, expect, it } from 'vitest';

import { compileOrthogonalCrossFirstSliceFabricRoot } from '../../src/domain/townMap/fabric/index.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  FIRST_SLICE_FABRIC_ROOT_ID,
  SETTLEMENT_CELLS,
  makeSettlementFabricRoot,
} from '../fixtures/townMapSettlementFabricFixtures.js';

/** @param {ReturnType<typeof makeSettlementFabricRoot>} fixture @param {string} artifactId */
function compileRoot(fixture, artifactId = FIRST_SLICE_FABRIC_ROOT_ID) {
  return compileOrthogonalCrossFirstSliceFabricRoot({
    artifactId,
    foundation: fixture.foundation,
    frontageSubdivision: fixture.frontageSubdivision,
    streetGeometry: fixture.geometry,
    streetGraph: fixture.graph,
    boundaryArrangement: fixture.arrangement,
    planarDcel: fixture.dcel,
    parcelRegistry: fixture.parcelRegistry,
  });
}

describe('MF-T1F first-slice Fabric-root determinism', () => {
  it('A5 is byte-safe under repeat, reorder, valid variation, JSON replay, and maximum root ID', () => {
    const first = makeSettlementFabricRoot();
    const second = makeSettlementFabricRoot();
    const reversed = makeSettlementFabricRoot({
      cells: SETTLEMENT_CELLS.map((row) => ({ ...row })).reverse(),
    });
    const horizontal = makeSettlementFabricRoot({ frontageAxis: 'HORIZONTAL' });
    const horizontalAgain = makeSettlementFabricRoot({ frontageAxis: 'HORIZONTAL' });
    expect(stableSceneStringify(second.fabricRoot)).toBe(stableSceneStringify(first.fabricRoot));
    expect(stableSceneStringify(reversed.fabricRoot)).toBe(stableSceneStringify(first.fabricRoot));
    expect(stableSceneStringify(horizontalAgain.fabricRoot))
      .toBe(stableSceneStringify(horizontal.fabricRoot));
    expect(horizontal.fabricRoot.contentHash).not.toBe(first.fabricRoot.contentHash);

    const sourceKeys = ['foundation', 'frontageSubdivision', 'geometry', 'graph',
      'arrangement', 'dcel', 'parcelRegistry'];
    const replay = Object.fromEntries(sourceKeys.map((key) => [
      key, JSON.parse(stableSceneStringify(first[key])),
    ]));
    const witnessBytes = sourceKeys.map((key) => stableSceneStringify(replay[key]));
    const replayedRoot = compileRoot(replay);
    expect(stableSceneStringify(replayedRoot)).toBe(stableSceneStringify(first.fabricRoot));
    expect(sourceKeys.map((key) => stableSceneStringify(replay[key]))).toEqual(witnessBytes);
    expect(Object.isFrozen(replay.foundation.ground.ring)).toBe(false);
    expect(Object.isFrozen(replay.frontageSubdivision.plots)).toBe(false);
    expect(Object.isFrozen(replay.geometry.segments)).toBe(false);
    expect(Object.isFrozen(replay.graph.nodes)).toBe(false);
    expect(Object.isFrozen(replay.arrangement.boundaries)).toBe(false);
    expect(Object.isFrozen(replay.dcel.halfEdges)).toBe(false);
    expect(Object.isFrozen(replay.parcelRegistry.parcels)).toBe(false);

    const maximum = compileRoot(replay, 'r'.repeat(96));
    expect(maximum.artifactId).toHaveLength(96);
    expect(maximum.streetGraphRef).toEqual(first.fabricRoot.streetGraphRef);
    expect(maximum.streetGeometryRef).toEqual(first.fabricRoot.streetGeometryRef);
    expect(maximum.cadastralBoundaryArrangementRef)
      .toEqual(first.fabricRoot.cadastralBoundaryArrangementRef);
    expect(maximum.dcelRef).toEqual(first.fabricRoot.dcelRef);
    expect(maximum.frontageRegistryRef).toEqual(first.fabricRoot.frontageRegistryRef);
    expect(maximum.parcelRegistryRef).toEqual(first.fabricRoot.parcelRegistryRef);
    expect(maximum.contentHash).not.toBe(first.fabricRoot.contentHash);
  });
});
