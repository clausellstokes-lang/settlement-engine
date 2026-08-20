import { describe, expect, it } from 'vitest';

import {
  createFirstSliceDocument,
  sealFabricFoundation,
  subdivideFrontageBlock,
} from '../../src/domain/townMap/fabric/index.js';
import {
  FIRST_SLICE_AXES,
  makeFirstSliceFoundation,
} from '../fixtures/townMapFirstSliceFixtures.js';

describe('MF-VS1 sealed fabric foundation', () => {
  it('seals one explicit surface block as frozen deterministic authority', () => {
    const first = makeFirstSliceFoundation();
    const second = makeFirstSliceFoundation();
    expect(first).toEqual(second);
    expect(first.contentHash).toBe(second.contentHash);
    expect(first.leafIndex).toBe(0);
    expect(first.mapTraditionId).toBe('EUROPEAN_FANTASY_BASE');
    expect(first.blockFaces).toHaveLength(1);
    expect(first.streetEdges).toHaveLength(1);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.blockFaces[0].ring)).toBe(true);
  });

  it('rejects implicit, malformed, or non-rectilinear foundation geometry', () => {
    const valid = {
      artifactId: 'fabric:test:001',
      effectiveAt: 'year:1450',
      blockFace: { blockId: 'block:test:001', ring: [[1, 1], [9, 1], [9, 9], [1, 9]] },
      streetEdge: { edgeId: 'street:test:001', blockId: 'block:test:001', edgeIndex: 0, setbackQ: 1 },
    };
    expect(() => sealFabricFoundation({ ...valid, effectiveAt: '' })).toThrow(/effectiveAt/);
    expect(() => sealFabricFoundation({
      ...valid,
      blockFace: { ...valid.blockFace, ring: [[1, 1], [9, 2], [9, 9], [1, 9]] },
    })).toThrow(/rectangle/);
    expect(() => sealFabricFoundation({
      ...valid,
      streetEdge: { ...valid.streetEdge, blockId: 'block:other' },
    })).toThrow(/must name the block/);
  });

  it('rejects a subdivision sealed against a different foundation identity', () => {
    const first = makeFirstSliceFoundation();
    const subdivision = subdivideFrontageBlock(first, 'block:market:001', FIRST_SLICE_AXES);
    const second = sealFabricFoundation({
      artifactId: 'fabric:first-slice:other',
      effectiveAt: 'year:1450',
      blockFace: first.blockFaces[0],
      streetEdge: first.streetEdges[0],
    });
    expect(() => createFirstSliceDocument({
      documentId: 'map-document:mixed-authority',
      foundation: second,
      subdivision,
      masses: [],
      operationRefs: [],
    })).toThrow(/another fabric foundation/);
  });
});
