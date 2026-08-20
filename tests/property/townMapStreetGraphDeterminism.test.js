import { describe, expect, it } from 'vitest';

import {
  compileOrthogonalCrossStreetGeometry,
  compileOrthogonalCrossStreetGraph,
} from '../../src/domain/townMap/fabric/index.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  SETTLEMENT_CELLS,
  makeSettlementFoundation,
  makeSettlementStreetGraph,
} from '../fixtures/townMapSettlementFabricFixtures.js';

describe('MF-T1N street graph determinism', () => {
  it('A5 is stable under repetition, upstream reorder, replay, and maximum valid IDs', () => {
    const first = makeSettlementStreetGraph();
    const second = makeSettlementStreetGraph();
    const reversed = makeSettlementStreetGraph({
      cells: SETTLEMENT_CELLS.map((row) => ({ ...row })).reverse(),
    });
    const replayedGeometry = JSON.parse(stableSceneStringify(first.geometry));
    const replayed = compileOrthogonalCrossStreetGraph({
      artifactId: first.graph.artifactId, streetGeometry: replayedGeometry,
    });
    expect(stableSceneStringify(second.graph)).toBe(stableSceneStringify(first.graph));
    expect(stableSceneStringify(reversed.graph)).toBe(stableSceneStringify(first.graph));
    expect(stableSceneStringify(replayed)).toBe(stableSceneStringify(first.graph));
    expect(Object.isFrozen(replayedGeometry.segments)).toBe(false);

    const settlementId = 's'.repeat(74);
    const geometry = compileOrthogonalCrossStreetGeometry({
      artifactId: 'street-geometry:max-valid-id', settlementId,
      foundation: makeSettlementFoundation(),
    });
    const graph = compileOrthogonalCrossStreetGraph({
      artifactId: 'street-graph:max-valid-id', streetGeometry: geometry,
    });
    expect(Math.max(...graph.nodes.map((node) => node.nodeId.length))).toBeLessThanOrEqual(96);
    expect(graph.edges.map((edge) => edge.edgeId)).toEqual(geometry.segments.map((row) => row.segmentId));
  });
});
