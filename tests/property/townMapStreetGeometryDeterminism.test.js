import { describe, expect, it } from 'vitest';

import { compileOrthogonalCrossStreetGeometry } from '../../src/domain/townMap/fabric/index.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  SETTLEMENT_CELLS,
  SETTLEMENT_ID,
  STREET_GEOMETRY_ID,
  makeSettlementStreetGeometry,
} from '../fixtures/townMapSettlementFabricFixtures.js';

describe('MF-T1G street geometry determinism', () => {
  it('A5 is byte-identical under repetition, cell reordering, and JSON replay', () => {
    const first = makeSettlementStreetGeometry();
    const second = makeSettlementStreetGeometry();
    const reversed = makeSettlementStreetGeometry({
      cells: SETTLEMENT_CELLS.map((row) => ({ ...row })).reverse(),
    });
    const replayedFoundation = JSON.parse(stableSceneStringify(first.foundation));
    expect(Object.isFrozen(replayedFoundation.ground.ring)).toBe(false);
    const replayed = compileOrthogonalCrossStreetGeometry({
      artifactId: STREET_GEOMETRY_ID, settlementId: SETTLEMENT_ID,
      foundation: replayedFoundation,
    });
    expect(stableSceneStringify(second.geometry)).toBe(stableSceneStringify(first.geometry));
    expect(stableSceneStringify(reversed.geometry)).toBe(stableSceneStringify(first.geometry));
    expect(stableSceneStringify(replayed)).toBe(stableSceneStringify(first.geometry));
    expect(replayed.contentHash).toBe(first.geometry.contentHash);
    expect(Object.isFrozen(replayedFoundation.ground.ring)).toBe(false);
  });
});
