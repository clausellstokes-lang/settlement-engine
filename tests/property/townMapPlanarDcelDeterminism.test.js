import { describe, expect, it } from 'vitest';

import { compileOrthogonalCrossPlanarDcel } from '../../src/domain/townMap/fabric/index.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  PLANAR_DCEL_ID,
  SETTLEMENT_CELLS,
  makeSettlementPlanarDcel,
} from '../fixtures/townMapSettlementFabricFixtures.js';

/** @param {ReturnType<typeof makeSettlementPlanarDcel>} fixture */
function signedFaceAreas(fixture) {
  const boundaryById = new Map(
    fixture.arrangement.boundaries.map((row) => [row.boundaryId, row]),
  );
  const vertexById = new Map(fixture.dcel.vertices.map((row) => [row.vertexId, row]));
  const halfEdgeById = new Map(fixture.dcel.halfEdges.map((row) => [row.halfEdgeId, row]));
  const pointFor = (vertexId) => {
    const ref = vertexById.get(vertexId)?.geometryRef;
    const boundary = boundaryById.get(ref?.boundaryId);
    if (!boundary) throw new TypeError('unresolved replay vertex');
    return boundary.geometry[ref.endpointIndex];
  };
  return fixture.dcel.faces.map((face) => {
    const cycle = [];
    let row = halfEdgeById.get(face.boundaryHalfEdgeId);
    while (row && !cycle.some((member) => member.halfEdgeId === row.halfEdgeId)) {
      cycle.push(row);
      row = halfEdgeById.get(row.nextHalfEdgeId);
    }
    if (!row || row.halfEdgeId !== face.boundaryHalfEdgeId) throw new TypeError('open replay face');
    return cycle.reduce((area2, member, index) => {
      const point = pointFor(member.originVertexId);
      const next = pointFor(cycle[(index + 1) % cycle.length].originVertexId);
      return area2 + point[0] * next[1] - next[0] * point[1];
    }, 0);
  });
}

describe('MF-T1D planar DCEL determinism', () => {
  it('A5 is byte-stable under repeat, upstream reorder, valid variation, replay, and maximum IDs', () => {
    const first = makeSettlementPlanarDcel();
    const second = makeSettlementPlanarDcel();
    const reversed = makeSettlementPlanarDcel({
      cells: SETTLEMENT_CELLS.map((row) => ({ ...row })).reverse(),
    });
    const variantPlan = {
      verticalStreet: {
        streetId: 'street:settlement:vertical', minXQ: 450, maxXQ: 520,
      },
      horizontalStreet: {
        streetId: 'street:settlement:horizontal', minZQ: 420, maxZQ: 500,
      },
    };
    const variant = makeSettlementPlanarDcel(variantPlan);
    const variantAgain = makeSettlementPlanarDcel(variantPlan);

    const replayedFoundation = JSON.parse(stableSceneStringify(first.foundation));
    const replayedSubdivision = JSON.parse(stableSceneStringify(first.frontageSubdivision));
    const replayedGeometry = JSON.parse(stableSceneStringify(first.geometry));
    const replayedArrangement = JSON.parse(stableSceneStringify(first.arrangement));
    const replayBefore = [
      replayedFoundation, replayedSubdivision, replayedGeometry, replayedArrangement,
    ].map(stableSceneStringify);
    const replayed = compileOrthogonalCrossPlanarDcel({
      artifactId: PLANAR_DCEL_ID,
      foundation: replayedFoundation,
      frontageSubdivision: replayedSubdivision,
      streetGeometry: replayedGeometry,
      boundaryArrangement: replayedArrangement,
    });

    expect(stableSceneStringify(second.dcel)).toBe(stableSceneStringify(first.dcel));
    expect(stableSceneStringify(reversed.dcel)).toBe(stableSceneStringify(first.dcel));
    expect(stableSceneStringify(replayed)).toBe(stableSceneStringify(first.dcel));
    expect(stableSceneStringify(variantAgain.dcel)).toBe(stableSceneStringify(variant.dcel));
    expect(variant.arrangement.contentHash).not.toBe(first.arrangement.contentHash);
    expect(variant.dcel.contentHash).not.toBe(first.dcel.contentHash);
    const variantAreas = signedFaceAreas(variant);
    const exteriorArea2 = variantAreas.find((area2) => area2 < 0);
    expect(variantAreas.filter((area2) => area2 > 0)).toHaveLength(9);
    expect(variantAreas.filter((area2) => area2 < 0)).toHaveLength(1);
    expect(variantAreas.filter((area2) => area2 > 0).reduce((sum, area2) => sum + area2, 0))
      .toBe(-exteriorArea2);

    expect([
      replayedFoundation, replayedSubdivision, replayedGeometry, replayedArrangement,
    ].map(stableSceneStringify)).toEqual(replayBefore);
    expect(Object.isFrozen(replayedFoundation.ground.ring)).toBe(false);
    expect(Object.isFrozen(replayedSubdivision.plots)).toBe(false);
    expect(Object.isFrozen(replayedGeometry.segments)).toBe(false);
    expect(Object.isFrozen(replayedArrangement.boundaries)).toBe(false);

    const maximum = compileOrthogonalCrossPlanarDcel({
      artifactId: 'd'.repeat(96),
      foundation: replayedFoundation,
      frontageSubdivision: replayedSubdivision,
      streetGeometry: replayedGeometry,
      boundaryArrangement: replayedArrangement,
    });
    const firstMemberIds = [...first.dcel.vertices.map((row) => row.vertexId),
      ...first.dcel.halfEdges.map((row) => row.halfEdgeId),
      ...first.dcel.faces.map((row) => row.faceId)];
    const maximumMemberIds = [...maximum.vertices.map((row) => row.vertexId),
      ...maximum.halfEdges.map((row) => row.halfEdgeId),
      ...maximum.faces.map((row) => row.faceId)];
    expect(maximumMemberIds).toEqual(firstMemberIds);
    expect(new Set(maximumMemberIds).size).toBe(98);
    expect(Math.max(...maximumMemberIds.map((id) => id.length))).toBeLessThanOrEqual(96);
    expect(maximum.artifactId).toHaveLength(96);
  });
});
