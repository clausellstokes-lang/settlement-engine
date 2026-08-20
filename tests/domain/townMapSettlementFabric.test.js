import { describe, expect, it } from 'vitest';

import {
  canonicalRectBounds,
  sealFabricFoundation,
  subdivideFrontageBlock,
} from '../../src/domain/townMap/fabric/index.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  SETTLEMENT_AXES,
  SETTLEMENT_CELLS,
  makeSettlementFabric,
  makeSettlementFoundation,
  makeSettlementMasses,
  makeSettlementPlan,
} from '../fixtures/townMapSettlementFabricFixtures.js';
import { MULTI_PLOT_AXES, makeFirstSliceFabric } from '../fixtures/townMapFirstSliceFixtures.js';

/** @param {Array<[number,number]>} ring */
function polygonArea(ring) {
  let twice = 0;
  for (let index = 0; index < ring.length; index += 1) {
    const next = ring[(index + 1) % ring.length];
    twice += ring[index][0] * next[1] - next[0] * ring[index][1];
  }
  return Math.abs(twice) / 2;
}

/** @param {Record<string,unknown>} left @param {Record<string,unknown>} right */
function overlapArea(left, right) {
  const a = canonicalRectBounds(left.ring, 'left corridor');
  const b = canonicalRectBounds(right.ring, 'right corridor');
  return Math.max(0, Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX))
    * Math.max(0, Math.min(a.maxZ, b.maxZ) - Math.max(a.minZ, b.minZ));
}

describe('MF-W3S1 orthogonal-cross settlement fabric', () => {
  it('A1 seals two streets and four blocks that exactly conserve the ground', () => {
    const foundation = makeSettlementFoundation();
    expect(foundation.schemaVersion).toBe(2);
    expect(foundation.lawVersion).toBe('mf-w3-orthogonal-cross-v1');
    expect(foundation.streetCorridors).toHaveLength(2);
    expect(foundation.blockFaces).toHaveLength(4);
    expect(foundation.streetEdges).toHaveLength(4);
    expect(foundation.streetEdges.map((row) => row.edgeIndex).sort()).toEqual([1, 1, 3, 3]);

    const corridorById = new Map(foundation.streetCorridors.map((row) => [row.streetId, row]));
    expect(corridorById.get('street:settlement:vertical').ring).toEqual([
      [470, 50], [530, 50], [530, 950], [470, 950],
    ]);
    expect(corridorById.get('street:settlement:horizontal').ring).toEqual([
      [50, 440], [950, 440], [950, 510], [50, 510],
    ]);
    const streetArea = foundation.streetCorridors.reduce((sum, row) => sum + polygonArea(row.ring), 0)
      - overlapArea(foundation.streetCorridors[0], foundation.streetCorridors[1]);
    const blockArea = foundation.blockFaces.reduce((sum, row) => sum + polygonArea(row.ring), 0);
    expect(polygonArea(foundation.ground.ring)).toBe(810000);
    expect(streetArea).toBe(112800);
    expect(blockArea).toBe(697200);
    expect(streetArea + blockArea).toBe(polygonArea(foundation.ground.ring));
    expect(Object.isFrozen(foundation.streetCorridors[0].ring)).toBe(true);
  });

  it('A2 refuses exactly the malformed cross inputs in the sealed matrix', () => {
    const vertical = makeSettlementPlan().verticalStreet;
    const horizontal = makeSettlementPlan().horizontalStreet;
    const duplicateBlocks = SETTLEMENT_CELLS.map((row, index) => ({
      ...row,
      blockId: index === 3 ? SETTLEMENT_CELLS[0].blockId : row.blockId,
    }));
    const cases = [
      { cells: SETTLEMENT_CELLS.slice(0, 3) },
      { cells: duplicateBlocks },
      { verticalStreet: { ...vertical, maxXQ: vertical.minXQ } },
      { horizontalStreet: { ...horizontal, minZQ: 40 } },
      { frontageAxis: 'DIAGONAL' },
      { setbackQ: 220 },
    ];
    for (const overrides of cases) {
      expect(() => makeSettlementFoundation(overrides)).toThrow(TypeError);
    }
    const settlement = makeSettlementFoundation();
    expect(() => subdivideFrontageBlock(
      settlement,
      settlement.blockFaces[0].blockId,
      SETTLEMENT_AXES,
    )).toThrow(TypeError);
  });

  it('A3 aggregates complete W3 frontage, plot, backland, block, and edge lineage', () => {
    const { foundation, subdivision } = makeSettlementFabric();
    expect(subdivision.lawVersion).toBe('w3-frontage-settlement-v1');
    expect(subdivision.blockIds).toEqual(foundation.blockFaces.map((row) => row.blockId).sort());
    expect(subdivision.frontages).toHaveLength(8);
    expect(subdivision.plots).toHaveLength(8);
    expect(subdivision.backlandCores).toHaveLength(4);
    expect(subdivision.metrics).toMatchObject({ blockCount: 4, plotCount: 8 });

    const frontageById = new Map(subdivision.frontages.map((row) => [row.frontageId, row]));
    const blockIds = new Set(foundation.blockFaces.map((row) => row.blockId));
    const edgeById = new Map(foundation.streetEdges.map((row) => [row.edgeId, row]));
    for (const plot of subdivision.plots) {
      const frontage = frontageById.get(plot.frontageId);
      const edge = edgeById.get(frontage.streetEdgeId);
      expect(blockIds.has(frontage.blockId)).toBe(true);
      expect(edge.blockId).toBe(frontage.blockId);
      expect(frontage.plotId).toBe(plot.plotId);
      expect(canonicalRectBounds(plot.fittedFootprint).ring).toEqual(plot.fittedFootprint);
    }
    expect(subdivision.plots.reduce((sum, plot) => sum + polygonArea(plot.plotPolygon), 0)).toBe(697200);
  });

  it('A4 feeds one explicit fitted rectangle per block to the unchanged building compiler', () => {
    for (const frontageAxis of ['VERTICAL', 'HORIZONTAL']) {
      const fixture = makeSettlementMasses({ frontageAxis });
      expect(fixture.masses).toHaveLength(4);
      expect(new Set(fixture.foundation.streetEdges.map((row) => row.edgeIndex))).toEqual(
        frontageAxis === 'VERTICAL' ? new Set([1, 3]) : new Set([0, 2]),
      );
      expect(fixture.masses.map((mass) => mass.geometry.plotRef.plotId).sort()).toEqual(
        fixture.selectedPlots.map((plot) => plot.plotId).sort(),
      );
      for (let index = 0; index < fixture.masses.length; index += 1) {
        expect(fixture.masses[index].geometry.footprint).toEqual(fixture.selectedPlots[index].fittedFootprint);
      }
      expectAbsentWithAnchor(
        Object.keys(fixture.subdivision),
        'buildings',
        'plots',
        'aggregate W3 does not infer buildings',
      );
    }
  });

  it('A6 preserves the landed MF-VS1 foundation and subdivision byte pins', () => {
    const { foundation, subdivision } = makeFirstSliceFabric();
    expect(foundation.contentHash).toBe('scene-v1-59a635fbbd1bf18c894c0e07fd843e9e');
    expect(subdivision.contentHash).toBe('scene-v1-bd96af8602dc4babe59acdf2681731f5');
    const orientationPins = [
      'scene-v1-ecd39dc154452d9475478b053ec22766',
      'scene-v1-6f8fb1a8d6655b29da09156c7a02da0f',
      'scene-v1-76c7c0ba081d1b43d112829ea773a701',
    ];
    for (let edgeIndex = 1; edgeIndex < 4; edgeIndex += 1) {
      const orientedFoundation = sealFabricFoundation({
        artifactId: 'fabric:legacy-orientation:001',
        effectiveAt: 'year:1450',
        blockFace: {
          blockId: 'block:legacy',
          ring: [[100, 100], [700, 100], [700, 500], [100, 500]],
        },
        streetEdge: {
          edgeId: 'street:legacy', blockId: 'block:legacy', edgeIndex, setbackQ: 20,
        },
      });
      expect(subdivideFrontageBlock(
        orientedFoundation,
        'block:legacy',
        MULTI_PLOT_AXES,
      ).contentHash).toBe(orientationPins[edgeIndex - 1]);
    }
  });
});
