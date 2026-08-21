/**
 * tests/domain/townMapDcelEmbeddingExtension.test.js — MF-T2C acceptance matrix.
 *
 * The planar embedder extended onto the versioned ABI: exact BigInt orientation, one outer face
 * per connected component, zero-area cycles typed rather than thrown, the hole-capable face
 * record, and point location under `boundaryRule: 'CLOSED'` — while the sealed PLANAR_DCEL
 * artifact and its 157 literal digest pins stay exactly where they are.
 *
 * ⭐ EVERY FIGURE BELOW WAS EXECUTED AND PRINTED BEFORE THIS FILE EXISTED, against the UNEDITED
 * kernel first and then against the edited one (preamble §P2.9). The one that mattered most:
 * `faces` is sorted by `faceId` while `metrics.area2s` keeps DISCOVERY order, so zipping those two
 * arrays reads another cycle's area — which is exactly how a compile-time probe mis-attributed
 * this kernel's outer face. A1 asserts the `faceIndex`/`faces` alignment rather than assuming it.
 *
 * ⚠ `HOLE_CYCLE` and `ENCLOSED_BY_EXTERIOR` are defensive vocabulary under the kernel's own
 * noded-input precondition, and NOTHING here claims either fires (chair ruling, ODQ §328). The
 * counts are asserted at zero as observations, with the reason on the assertion line.
 */

import { describe, expect, test } from 'vitest';

import { COORDINATE_ABI, MAX_WORLD_UNITS } from '../../src/domain/townMap/fabric/coordinateAbi.js';
import { compileOrthogonalCrossPlanarDcel } from '../../src/domain/townMap/fabric/dcel.js';
import {
  PLANAR_EMBEDDING_FACE_KINDS,
  derivePlanarDcelEmbedding,
  locateFace,
} from '../../src/domain/townMap/fabric/dcelEmbedding.js';
import {
  FABRIC_COORDINATE_ABI,
  canonicalArtifactRef,
} from '../../src/domain/townMap/fabric/foundation.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  PLANAR_DCEL_ID,
  makeSettlementBoundaryArrangement,
} from '../fixtures/townMapSettlementFabricFixtures.js';

/** The one support leaf the kernel admits. */
const SURFACE = Object.freeze({ kind: 'PLANAR_SURFACE', leafIndex: 0 });

/** The ABI scale at which a float cross product leaves the safe-integer range (R-MF-2). */
const ABI_M = 1286630001;

/** @param {number[]} left @param {number[]} right */
function beforeInScanOrder(left, right) {
  return left[0] - right[0] || left[1] - right[1];
}

/** One canonical boundary, endpoints in the kernel's required ascending order.
 *  @param {string} boundaryId @param {number[]} from @param {number[]} to */
function boundary(boundaryId, from, to) {
  const [a, b] = beforeInScanOrder(from, to) < 0 ? [from, to] : [to, from];
  return { boundaryId, support: SURFACE, geometry: [a, b] };
}

/** @param {Array<Record<string,unknown>>} boundaries */
function embed(boundaries) {
  return derivePlanarDcelEmbedding({
    coordinateAbiVersion: 'plan-q1-0-1000-v1',
    settlementId: 'mf-t2c-settlement',
    arrangementRef: { artifactId: 'mf-t2c-arrangement', contentHash: 'mf-t2c-hash' },
    boundaries,
  });
}

/** An axis-aligned closed square as four canonical boundaries.
 *  @param {string} prefix @param {number} x0 @param {number} y0 @param {number} x1 @param {number} y1 */
function square(prefix, x0, y0, x1, y1) {
  return [
    boundary(`${prefix}0`, [x0, y0], [x1, y0]), boundary(`${prefix}1`, [x1, y0], [x1, y1]),
    boundary(`${prefix}2`, [x1, y1], [x0, y1]), boundary(`${prefix}3`, [x0, y1], [x0, y0]),
  ];
}

/** The |area2| magnitude of a face, read through the ALIGNED index rather than through
 *  `metrics.area2s` (which is in discovery order — see the header).
 *  @param {ReturnType<typeof embed>} embedding @param {string} faceId */
function areaOf(embedding, faceId) {
  const at = embedding.faces.findIndex((face) => face.faceId === faceId);
  return at < 0 ? null : embedding.faceIndex[at].area2;
}

describe('MF-T2C planar-embedding extension', () => {
  test('A1 · the extension is INERT on the admitted input — the seal keeps the legacy face triple while the embedding carries the extended fields', () => {
    const fixture = makeSettlementBoundaryArrangement();
    const embedding = derivePlanarDcelEmbedding({
      coordinateAbiVersion: FABRIC_COORDINATE_ABI,
      settlementId: fixture.arrangement.settlementId,
      arrangementRef: canonicalArtifactRef(fixture.arrangement),
      boundaries: fixture.arrangement.boundaries,
    });
    // ⭐ THE POSITIVE CONTROL FIRST: the extended fields EXIST and are populated, so the
    // inertness assertions below measure "correctly empty" rather than "never built".
    expect(embedding.faces, 'the admitted fixture stopped producing faces').toHaveLength(10);
    expect(embedding.faceIndex, 'faceIndex is not aligned 1:1 with faces').toHaveLength(10);
    expect(embedding.faceIndex.every((entry) => entry.ring.length >= 3), 'a faceIndex ring is degenerate or empty').toBe(true);
    expect(embedding.faceIndex.every((entry) => Array.isArray(entry.bounds) && entry.bounds.length === 4), 'a faceIndex bounding box is missing').toBe(true);
    // ⭐⭐ THE ALIGNMENT ITSELF, ASSERTED RATHER THAN ASSUMED. `faces` is faceId-sorted and
    // `metrics.area2s` is discovery-ordered, so this equivalence is FALSE for the wrong pairing:
    // the exterior sits at faces[7] and its area at metrics.area2s[0].
    expect(embedding.faces.every((face, at) => (face.faceKind === 'BOUNDED') === (embedding.faceIndex[at].area2 > 0n)), 'faceIndex is zipped against the wrong ordering').toBe(true);
    expect(embedding.faceIndex[7].area2).toBe(-1620000n);
    expect(embedding.metrics.area2s[0]).toBe(-1620000n);
    expect(embedding.faces[7].faceKind).toBe('EXTERIOR');
    // …and NOW the inertness: one component, one outer, no degenerate and no hole cycle.
    expect(embedding.componentCount).toBe(1);
    expect(embedding.outerFaceIds).toEqual([embedding.outerFaceId]);
    // anchored: the ten-face and ten-entry assertions above prove the embedding is populated, so an empty inner list here is emptiness the port publishes and not an embedding that never ran
    expect(embedding.faces.map((face) => face.innerBoundaryHalfEdgeIds)).toEqual(Array(10).fill([]));
    // anchored: metrics.degenerateFaces is counted off the same kindOf array that produced the ten faceKinds asserted above, so a zero here is a measured zero
    expect([embedding.metrics.degenerateFaces, embedding.metrics.holeCycles]).toEqual([0, 0]);
    expect([...new Set(embedding.faces.map((face) => face.component))]).toEqual([0]);
    // ⛔ THE SEAL PROJECTS THE LEGACY TRIPLE, key-for-key, and the sealed key list still carries
    // the SINGULAR outerFaceId. This is what keeps every PLANAR_DCEL digest exactly where it is.
    const sealed = compileOrthogonalCrossPlanarDcel({
      artifactId: PLANAR_DCEL_ID,
      foundation: fixture.foundation,
      frontageSubdivision: fixture.frontageSubdivision,
      streetGeometry: fixture.geometry,
      boundaryArrangement: fixture.arrangement,
    });
    expect(Object.keys(sealed)).toContain('outerFaceId');
    // anchored: the SINGULAR key is asserted present on the line immediately above, off the same Object.keys call, so this exclusion cannot be a sealed record that drifted away or failed to compile
    expect(Object.keys(sealed)).not.toContain('outerFaceIds');
    for (const face of sealed.faces) {
      expect(Object.keys(face).sort()).toEqual(['boundaryHalfEdgeId', 'faceId', 'faceKind']);
    }
    // The extended keys are on the EMBEDDING and absent from the SEAL — asserted through the
    // anchor helper by name, with `faceKind` as the sibling that travels the same projection.
    const sealedFaceKeys = Object.keys(sealed.faces[0]).sort();
    expectAbsentWithAnchor(sealedFaceKeys, 'component', 'faceKind', 'the sealed face triple');
    expectAbsentWithAnchor(sealedFaceKeys, 'innerBoundaryHalfEdgeIds', 'faceId', 'the sealed face triple');
    expect(Object.keys(embedding.faces[0]).sort()).toEqual([
      'boundaryHalfEdgeId', 'component', 'faceId', 'faceKind', 'innerBoundaryHalfEdgeIds',
    ]);
  });

  test('A2 · exact arithmetic at ABI scale — the triangle that threw a false angular tie now embeds, and a TRUE collinear tie still throws', () => {
    // ⭐⭐ THE COUNTERFORCE, WITH ITS OWN CONTROL. At ABI scale the two spellings DISAGREE; on the
    // same shape at fixture-era scale they AGREE. The divergence is the SCALE, not an arbitrary
    // disagreement between two ways of multiplying.
    const numberCross = (ABI_M - 1) * (ABI_M + 1) - ABI_M * ABI_M;
    const exactCross = BigInt(ABI_M - 1) * BigInt(ABI_M + 1) - BigInt(ABI_M) * BigInt(ABI_M);
    expect(numberCross).toBe(0);
    expect(exactCross).toBe(-1n);
    const smallNumberCross = (999 * 1001) - (1000 * 1000);
    const smallExactCross = BigInt(999) * BigInt(1001) - BigInt(1000) * BigInt(1000);
    expect(smallNumberCross).toBe(-1);
    expect(smallExactCross).toBe(-1n);
    // ⭐⭐ THE NAMED HISTORICAL REGRESSION. Captured against the UNEDITED kernel at this member's
    // base, this exact triple threw 'DCEL vertex has an angular tie' on valid ground.
    const embedding = embed([
      boundary('a0', [0, 0], [ABI_M - 1, ABI_M]),
      boundary('a1', [ABI_M - 1, ABI_M], [ABI_M, ABI_M + 1]),
      boundary('a2', [0, 0], [ABI_M, ABI_M + 1]),
    ]);
    expect(embedding.faces).toHaveLength(2);
    expect([...embedding.faces].map((face) => face.faceKind).sort()).toEqual(['BOUNDED', 'EXTERIOR']);
    const vertices = embedding.vertices.length;
    const edges = embedding.halfEdges.length / 2;
    expect(vertices - edges + embedding.faces.length).toBe(2);
    expect(embedding.componentCount).toBe(1);
    expect(embedding.outerFaceIds).toHaveLength(1);
    // ⭐ THE THROW'S OWN POSITIVE CONTROL — the detector is CONFINED to real ties, not removed.
    // Two collinear boundaries sharing one origin are the single overlap shape the pairwise
    // atomic check structurally passes, so this is the arm that must keep firing.
    expect(() => embed([
      boundary('t0', [0, 0], [10, 0]),
      boundary('t1', [0, 0], [20, 0]),
    ])).toThrow('DCEL vertex has an angular tie');
  });

  test('A3 · a zero-area cycle is typed DEGENERATE and REPORTED, never thrown', () => {
    // Captured against the UNEDITED kernel at base: this fixture threw
    // 'DCEL face must have nonzero signed area'.
    const chain = embed([
      boundary('c0', [0, 0], [10, 0]),
      boundary('c1', [10, 0], [10, 10]),
    ]);
    expect(chain.faces).toHaveLength(1);
    expect(chain.faces[0].faceKind).toBe('DEGENERATE');
    expect(chain.metrics.degenerateFaces).toBe(1);
    expect(chain.metrics.area2s).toEqual([0n]);
    // anchored: the single DEGENERATE face one line up proves the walk ran and produced a cycle, so an empty outer list is a degenerate-only component contributing none rather than an embedding that failed
    expect(chain.outerFaceIds).toEqual([]);
    expect(chain.outerFaceId).toBeUndefined();
    // ⭐ THE POSITIVE CONTROL IN THE SAME TEST: closing the chain produces a real face pair.
    const closed = embed([
      boundary('d0', [0, 0], [10, 0]),
      boundary('d1', [10, 0], [10, 10]),
      boundary('d2', [0, 0], [10, 10]),
    ]);
    expect(closed.metrics.degenerateFaces).toBe(0);
    expect([...closed.faces].map((face) => face.faceKind).sort()).toEqual(['BOUNDED', 'EXTERIOR']);
    expect(closed.outerFaceIds).toHaveLength(1);
  });

  test('A4 · one outer face PER CONNECTED COMPONENT, ordered by component index', () => {
    const two = embed([...square('p', 0, 0, 10, 10), ...square('q', 100, 0, 110, 10)]);
    expect(two.componentCount).toBe(2);
    expect(two.outerFaceIds).toHaveLength(2);
    // Each named outer is the MOST-NEGATIVE cycle of its own component, asserted against the
    // aligned faceIndex rather than against discovery-ordered metrics.
    expect(two.outerFaceIds.map((faceId) => areaOf(two, faceId))).toEqual([-200n, -200n]);
    const outerFaces = two.outerFaceIds.map((faceId) => two.faces.find((face) => face.faceId === faceId));
    expect(outerFaces.map((face) => face?.faceKind)).toEqual(['EXTERIOR', 'EXTERIOR']);
    expect(outerFaces.map((face) => face?.component)).toEqual([0, 1]);
    expect(two.outerFaceId).toBe(two.outerFaceIds[0]);
    expect(two.faces.filter((face) => face.faceKind === 'EXTERIOR')).toHaveLength(2);
    // ⭐ THE POSITIVE CONTROL: the single-square HALF of the same fixture yields exactly one.
    const one = embed([...square('p', 0, 0, 10, 10)]);
    expect(one.componentCount).toBe(1);
    expect(one.outerFaceIds).toHaveLength(1);
  });

  test('A5 · a nested ring is a SECOND COMPONENT and containment is the locate rule, not a hole list', () => {
    const nested = embed([...square('o', 0, 0, 100, 100), ...square('i', 40, 40, 60, 60)]);
    expect(nested.componentCount).toBe(2);
    expect(nested.outerFaceIds).toHaveLength(2);
    const outerFaces = nested.outerFaceIds.map((faceId) => nested.faces.find((face) => face.faceId === faceId));
    expect(outerFaces.map((face) => face?.faceKind)).toEqual(['EXTERIOR', 'EXTERIOR']);
    expect(nested.outerFaceIds.map((faceId) => areaOf(nested, faceId))).toEqual([-20000n, -800n]);
    // anchored: the two EXTERIOR outers above prove both negative cycles were found and classified, so a zero hole count is the executed finding — a nested ring is a separate COMPONENT whose negative cycle is its own outer (defensive vocabulary, ODQ §328; no test claims the kind fires)
    expect(nested.metrics.holeCycles).toBe(0);
    // ⭐ CONTAINMENT IS ANSWERED BY THE SMALLEST-CONTAINING-CYCLE RULE. A point inside the inner
    // ring names the INNER bounded face while still LISTING every containing cycle.
    const inside = locateFace(nested, [50, 50]);
    expect(inside.kind).toBe('INSIDE');
    expect(inside.faceKind).toBe('BOUNDED');
    expect(areaOf(nested, String(inside.faceId))).toBe(800n);
    expect(inside.faces).toHaveLength(4);
    // …and an annulus point names the OUTER bounded face, which is the same rule reading the
    // other way: the inner ring does not contain it, so the smallest containing cycle is larger.
    const annulus = locateFace(nested, [20, 20]);
    expect(annulus.kind).toBe('INSIDE');
    expect(areaOf(nested, String(annulus.faceId))).toBe(20000n);
    expect(annulus.faces).toHaveLength(2);
  });

  test('A6 · point location under the ABI\'s own CLOSED boundary rule, with its refusal record', () => {
    // THE AUTHORITY IS THE ABI RECORD, not a comment in the locate function.
    expect(COORDINATE_ABI.boundaryRule).toBe('CLOSED');
    const nested = embed([...square('o', 0, 0, 100, 100), ...square('i', 40, 40, 60, 60)]);
    // ⭐ THE POSITIVE CONTROL, ASSERTED FIRST: a verdict that fires, so the refusal arms below sit
    // beside a working locate rather than beside a locate that answers nothing.
    expect(locateFace(nested, [50, 50]).kind).toBe('INSIDE');
    // CLOSED: a point ON the inner ring's edge is its own verdict, folded into neither side.
    const onEdge = locateFace(nested, [40, 50]);
    expect(onEdge.kind).toBe('BOUNDARY');
    expect(onEdge.faceKind).toBe('BOUNDED');
    // Far outside every ring: OUTER, naming the first component's outer face.
    const far = locateFace(nested, [500, 500]);
    expect(far.kind).toBe('OUTER');
    expect(far.faceId).toBe(nested.outerFaceIds[0]);
    // anchored: the INSIDE, BOUNDARY and OUTER verdicts above prove the scan reaches faces, so an empty hit list here is the OUTER verdict's own contract and not a scan that found nothing
    expect(far.faces).toEqual([]);
    // THE REFUSAL RECORD — never NaN, never a throw. A non-integer quantum, an overflow past the
    // ABI envelope, and a mis-shaped point all take the same door.
    expect(locateFace(nested, [0.5, 0])).toEqual({ kind: 'OUTSIDE_ABI', faceId: null });
    expect(locateFace(nested, [MAX_WORLD_UNITS + 1, 0])).toEqual({ kind: 'OUTSIDE_ABI', faceId: null });
    expect(locateFace(nested, [1])).toEqual({ kind: 'OUTSIDE_ABI', faceId: null });
    // The published vocabulary is closed and ordered.
    expect(PLANAR_EMBEDDING_FACE_KINDS).toEqual(['BOUNDED', 'EXTERIOR', 'HOLE_CYCLE', 'DEGENERATE']);
  });

  test('A8 · correctness at scale — Euler closes on the repaired traversal over a ~1.8k-boundary grid', () => {
    // A deterministic synthetic grid, built here rather than loaded: 30x30 cells on a step of 10.
    /** @type {Array<Record<string,unknown>>} */ const boundaries = [];
    const cells = 30;
    const step = 10;
    let serial = 0;
    for (let major = 0; major <= cells; major += 1) {
      for (let minor = 0; minor < cells; minor += 1) {
        boundaries.push(boundary(`h${serial += 1}`, [minor * step, major * step], [(minor + 1) * step, major * step]));
        boundaries.push(boundary(`v${serial += 1}`, [major * step, minor * step], [major * step, (minor + 1) * step]));
      }
    }
    expect(boundaries).toHaveLength(1860);
    const embedding = embed(boundaries);
    const vertices = embedding.vertices.length;
    const edges = embedding.halfEdges.length / 2;
    const faces = embedding.faces.length;
    expect([vertices, edges, faces]).toEqual([961, 1860, 901]);
    // ⭐ EULER IS THE INDEPENDENT ORACLE: V - E + F === 1 + C.
    expect(vertices - edges + faces).toBe(1 + embedding.componentCount);
    expect(embedding.componentCount).toBe(1);
    expect(embedding.outerFaceIds).toHaveLength(embedding.componentCount);
    // Every half-edge lies in exactly one cycle — the cycle lengths sum to the half-edge count and
    // every half-edge carries a face id.
    expect(embedding.metrics.cycleLengths.reduce((sum, length) => sum + length, 0)).toBe(edges * 2);
    expect(embedding.halfEdges.every((halfEdge) => typeof halfEdge.faceId === 'string')).toBe(true);
    // anchored: the 901 faces and the Euler identity above prove the walk classified every cycle, so a zero degenerate count is a grid with no zero-area cycle rather than a classifier that never ran
    expect(embedding.metrics.degenerateFaces).toBe(0);
  });
});
