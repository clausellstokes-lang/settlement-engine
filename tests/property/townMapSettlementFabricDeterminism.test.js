import { describe, expect, it } from 'vitest';

import { subdivideSettlementFrontages } from '../../src/domain/townMap/fabric/index.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  SETTLEMENT_AXES,
  SETTLEMENT_CELLS,
  makeSettlementFabric,
} from '../fixtures/townMapSettlementFabricFixtures.js';

describe('MF-W3S1 settlement fabric determinism', () => {
  it('A5 is byte-identical under cell reordering and save-style replay', () => {
    const first = makeSettlementFabric();
    const second = makeSettlementFabric();
    const reversed = makeSettlementFabric({
      cells: SETTLEMENT_CELLS.map((row) => ({ ...row })).reverse(),
    });
    expect(stableSceneStringify(second.foundation)).toBe(stableSceneStringify(first.foundation));
    expect(stableSceneStringify(second.subdivision)).toBe(stableSceneStringify(first.subdivision));
    expect(stableSceneStringify(reversed.foundation)).toBe(stableSceneStringify(first.foundation));
    expect(stableSceneStringify(reversed.subdivision)).toBe(stableSceneStringify(first.subdivision));

    const restoredFoundation = JSON.parse(stableSceneStringify(first.foundation));
    const replayed = subdivideSettlementFrontages(restoredFoundation, SETTLEMENT_AXES);
    expect(stableSceneStringify(replayed)).toBe(stableSceneStringify(first.subdivision));
    expect(replayed.contentHash).toBe(first.subdivision.contentHash);
  });
});
