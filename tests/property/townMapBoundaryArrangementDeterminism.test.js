import { describe, expect, it } from 'vitest';

import {
  compileOrthogonalCrossCadastralArrangement,
  compileOrthogonalCrossStreetGeometry,
  subdivideSettlementFrontages,
} from '../../src/domain/townMap/fabric/index.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  BOUNDARY_ARRANGEMENT_ID,
  SETTLEMENT_AXES,
  SETTLEMENT_CELLS,
  makeSettlementBoundaryArrangement,
  makeSettlementFoundation,
} from '../fixtures/townMapSettlementFabricFixtures.js';

describe('MF-T1A cadastral boundary arrangement determinism', () => {
  it('A5 is stable under repetition, upstream reorder, replay, and maximum valid IDs', () => {
    const first = makeSettlementBoundaryArrangement();
    const second = makeSettlementBoundaryArrangement();
    const reversed = makeSettlementBoundaryArrangement({
      cells: SETTLEMENT_CELLS.map((row) => ({ ...row })).reverse(),
    });
    const replayedFoundation = JSON.parse(stableSceneStringify(first.foundation));
    const replayedSubdivision = JSON.parse(stableSceneStringify(first.frontageSubdivision));
    const replayedGeometry = JSON.parse(stableSceneStringify(first.geometry));
    const replayed = compileOrthogonalCrossCadastralArrangement({
      artifactId: BOUNDARY_ARRANGEMENT_ID,
      foundation: replayedFoundation,
      frontageSubdivision: replayedSubdivision,
      streetGeometry: replayedGeometry,
    });
    expect(stableSceneStringify(second.arrangement)).toBe(stableSceneStringify(first.arrangement));
    expect(stableSceneStringify(reversed.arrangement)).toBe(stableSceneStringify(first.arrangement));
    expect(stableSceneStringify(replayed)).toBe(stableSceneStringify(first.arrangement));
    expect(Object.isFrozen(replayedFoundation.ground.ring)).toBe(false);
    expect(Object.isFrozen(replayedSubdivision.plots)).toBe(false);
    expect(Object.isFrozen(replayedGeometry.segments)).toBe(false);

    const foundation = makeSettlementFoundation();
    const frontageSubdivision = subdivideSettlementFrontages(foundation, SETTLEMENT_AXES);
    const streetGeometry = compileOrthogonalCrossStreetGeometry({
      artifactId: 'street-geometry:max-valid-arrangement-id',
      settlementId: 's'.repeat(74),
      foundation,
    });
    const maximum = compileOrthogonalCrossCadastralArrangement({
      artifactId: 'cadastral-arrangement:max-valid-id',
      foundation,
      frontageSubdivision,
      streetGeometry,
    });
    expect(maximum.boundaries).toHaveLength(32);
    expect(new Set(maximum.boundaries.map((row) => row.boundaryId)).size).toBe(32);
    expect(Math.max(...maximum.boundaries.map((row) => row.boundaryId.length))).toBeLessThanOrEqual(96);
  });
});
