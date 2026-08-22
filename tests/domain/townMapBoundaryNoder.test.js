/**
 * tests/domain/townMapBoundaryNoder.test.js — MF-T2D acceptance matrix.
 *
 * The boundary noder: the arrangement stage the landed planar embedder's contract requires and
 * nothing app-side supplied. ODQ §303.5 puts the noding ALGORITHM on the sandbox side and the
 * boundary ROW SHAPE on the codex side, and this battery proves the join by feeding the noder's
 * published output straight into the landed kernel — the writer-to-reader proof, since the member
 * lands dormant with no production consumer.
 *
 * ⭐ EVERY FIGURE BELOW WAS EXECUTED AND PRINTED BEFORE THIS FILE EXISTED. The two that mattered:
 *
 *   1. The kernel's pairwise atomic check RETURNS EARLY when two boundaries share exactly one
 *      endpoint — that is what an abutment looks like — so a collinear overlap sharing an
 *      endpoint passes it and is refused further on by a DIFFERENT message, the angular tie. The
 *      cut predicate is therefore tested with STRICT interiority rather than the kernel's
 *      inclusive spelling, and A4 carries that fourth witness class with its own positive
 *      control. Written from a run, not from the compiled draft, which listed three classes.
 *   2. The eps-band pair does not split into four rows but into THREE: its snapped cut point
 *      merges into a shared endpoint, so only one of the two segments is actually cut. A2 pins
 *      the executed shape rather than the arithmetically-expected one.
 *
 * ⛔ The landed kernel, `exactGeometry.js` and every sealed artifact are READ here and never
 * written. This member creates one dormant leaf and modifies no existing production file.
 */

import { describe, expect, test } from 'vitest';

import {
  ARRANGEMENT_QUANTUM_LADDER,
  nodeBoundarySegments,
} from '../../src/domain/townMap/fabric/boundaryNoder.js';
import { derivePlanarDcelEmbedding } from '../../src/domain/townMap/fabric/dcelEmbedding.js';
import { properCross, segIntersect } from '../../src/domain/townMap/fabric/exactGeometry.js';
import { FABRIC_COORDINATE_ABI } from '../../src/domain/townMap/fabric/foundation.js';

const ARRANGEMENT_REF = Object.freeze({ artifactId: 'mf-t2d-fixture', contentHash: 'mf-t2d-hash' });
const ATOMIC_REFUSAL = 'DCEL boundaries must be atomically noded without crossings or overlaps';

/** @param {number[]} a @param {number[]} b @param {string} [role] @param {string} [sourceId] */
function segment(a, b, role = 'wall_face', sourceId = 'fixture') {
  return { a, b, role, sourceId };
}

/** Embed a noded record through the LANDED kernel — the reader half of the proof. */
function embed(record) {
  return derivePlanarDcelEmbedding({
    coordinateAbiVersion: record.coordinateAbiVersion,
    settlementId: record.settlementId,
    arrangementRef: ARRANGEMENT_REF,
    boundaries: record.boundaries,
  });
}

/** Feed RAW segments to the kernel with the row shape it demands, so a refusal is about
 *  noding rather than about the record shape. */
function embedRaw(settlementId, segments) {
  return derivePlanarDcelEmbedding({
    coordinateAbiVersion: FABRIC_COORDINATE_ABI,
    settlementId,
    arrangementRef: ARRANGEMENT_REF,
    boundaries: segments.map((s, index) => ({
      boundaryId: `raw-boundary:${index}`,
      role: s.role,
      sourceId: s.sourceId,
      support: { kind: 'PLANAR_SURFACE', leafIndex: 0 },
      geometry: (s.a[0] - s.b[0] || s.a[1] - s.b[1]) < 0 ? [s.a, s.b] : [s.b, s.a],
    })),
  });
}

// ⭐ THE INDEPENDENT ORACLE. These tests recount admission violations over the published output
// with their OWN exact predicate, so the noder's `residualProperCrossings` is never the only
// witness that the output is noded (the guard-the-guard shape of preamble §P6).
/** @param {number[]} a @param {number[]} b @param {number[]} c @returns {bigint} */
function orient(a, b, c) {
  return (BigInt(b[0]) - BigInt(a[0])) * (BigInt(c[1]) - BigInt(a[1]))
    - (BigInt(b[1]) - BigInt(a[1])) * (BigInt(c[0]) - BigInt(a[0]));
}
/** @param {number[]} a @param {number[]} b @param {number[]} p */
function onInterior(a, b, p) {
  if ((p[0] === a[0] && p[1] === a[1]) || (p[0] === b[0] && p[1] === b[1])) return false;
  return orient(a, b, p) === 0n
    && p[0] >= Math.min(a[0], b[0]) && p[0] <= Math.max(a[0], b[0])
    && p[1] >= Math.min(a[1], b[1]) && p[1] <= Math.max(a[1], b[1]);
}
/** @param {number[][][]} lines @returns {{crossings:number,touches:number}} */
function recount(lines) {
  let crossings = 0;
  let touches = 0;
  for (let i = 0; i < lines.length; i += 1) {
    for (let j = i + 1; j < lines.length; j += 1) {
      const [a, b] = lines[i];
      const [c, d] = lines[j];
      const abC = orient(a, b, c); const abD = orient(a, b, d);
      const cdA = orient(c, d, a); const cdB = orient(c, d, b);
      if (((abC < 0n && abD > 0n) || (abC > 0n && abD < 0n))
        && ((cdA < 0n && cdB > 0n) || (cdA > 0n && cdB < 0n))) crossings += 1;
      if (onInterior(a, b, c) || onInterior(a, b, d)
        || onInterior(c, d, a) || onInterior(c, d, b)) touches += 1;
    }
  }
  return { crossings, touches };
}
/** @param {{boundaries:Array<{geometry:number[][]}>}} record */
function geometryOf(record) { return record.boundaries.map((row) => row.geometry); }

/** @param {number} x @param {number} z @param {number} side */
function ring(x, z, side) {
  return [
    segment([x, z], [x + side, z]), segment([x + side, z], [x + side, z + side]),
    segment([x + side, z + side], [x, z + side]), segment([x, z + side], [x, z]),
  ];
}

describe('MF-T2D boundary noder', () => {
  test('A1 · a proper crossing is noded and every published row wears the kernel-admissible shape', () => {
    const raw = [...ring(0, 0, 4000), ...ring(2000, 2000, 4000)];
    // ⭐ THE POSITIVE CONTROL FIRST: the tests' own exact oracle finds the crossings in the RAW
    // input, so the zero it reports over the OUTPUT measures noding rather than an empty scan.
    expect(recount(raw.map((s) => [s.a, s.b]))).toEqual({ crossings: 2, touches: 0 });

    const noded = nodeBoundarySegments({ settlementId: 'noder-a1', segments: raw });
    expect(noded.boundaries).toHaveLength(12);
    expect(noded.rawSegmentCount).toBe(8);
    expect(noded.arrangementQuantum).toBe(1000);
    expect(noded.nodingPasses).toBe(2);
    expect(noded.residualProperCrossings).toBe(0);
    expect(noded.splitCount).toBe(8);
    expect(noded.duplicatesDropped).toBe(0);
    expect(noded.coordinateAbiVersion).toBe(FABRIC_COORDINATE_ABI);
    expect(recount(geometryOf(noded))).toEqual({ crossings: 0, touches: 0 });

    for (const row of noded.boundaries) {
      expect(Object.keys(row)).toEqual(['boundaryId', 'role', 'sourceId', 'support', 'geometry']);
      expect(row.boundaryId.startsWith('cadastral-boundary:scene-v1-')).toBe(true);
      expect(row.support).toEqual({ kind: 'PLANAR_SURFACE', leafIndex: 0 });
      expect(row.geometry[0][0] - row.geometry[1][0] || row.geometry[0][1] - row.geometry[1][1])
        .toBeLessThan(0);
      for (const value of row.geometry.flat()) {
        expect(Number.isSafeInteger(value)).toBe(true);
        // ⚠ Compared as an EQUALITY rather than pinned with `toBe(0)`: a negative coordinate's
        // remainder is `-0`, which `Object.is` separates from `+0`, so the pinned spelling reds
        // on correct output the moment a fixture crosses the origin. Measured, not predicted.
        expect(value % noded.arrangementQuantum === 0).toBe(true);
      }
    }
    expect(new Set(noded.boundaries.map((row) => row.boundaryId)).size).toBe(12);
    expect([...noded.boundaries.map((row) => row.boundaryId)].sort()).toEqual(
      noded.boundaries.map((row) => row.boundaryId),
    );

    const embedding = embed(noded);
    expect(embedding.vertices).toHaveLength(10);
    expect(embedding.halfEdges).toHaveLength(24);
    expect(embedding.faces).toHaveLength(4);
    expect(embedding.componentCount).toBe(1);
    expect(embedding.vertices.length - (embedding.halfEdges.length / 2) + embedding.faces.length)
      .toBe(1 + embedding.componentCount);
    expect(embedding.faces.filter((face) => face.faceKind === 'BOUNDED')).toHaveLength(3);
    expect(embedding.faces.filter((face) => face.faceKind === 'EXTERIOR')).toHaveLength(1);
  });

  test('A2 · the eps-band crossing the landed float predicate calls not-proper is split, and the kernel then embeds it', () => {
    const a = [0, 0]; const b = [9007199000, 1000];
    const c = [1000, -1000]; const d = [-9007189000, 9007198000];
    // THE DIVERGENCE IS THE SCALE, asserted as two positives rather than described. At wall
    // scale the landed parametric predicate answers not-proper; at fixture scale it answers
    // proper on an ordinary crossing, so the disagreement is about magnitude, not about kind.
    expect(properCross(a, b, c, d)).toBe(false);
    expect(properCross([0, 0], [4000, 4000], [0, 4000], [4000, 0])).toBe(true);
    // …while the tests' own exact oracle sees the crossing at BOTH scales.
    expect(recount([[a, b], [c, d]]).crossings).toBe(1);

    const raw = [segment(a, b, 'wall_face', 'eps-1'), segment(c, d, 'wall_face', 'eps-2')];
    // POSITIVE CONTROL: the un-noded pair is REFUSED by the landed kernel, so the embedding
    // below measures the noder's cure rather than a kernel that admits anything.
    expect(() => embedRaw('noder-a2', raw)).toThrow(ATOMIC_REFUSAL);

    const noded = nodeBoundarySegments({ settlementId: 'noder-a2', segments: raw });
    expect(noded.boundaries).toHaveLength(3);
    expect(noded.splitCount).toBe(2);
    expect(noded.residualProperCrossings).toBe(0);
    expect(noded.arrangementQuantum).toBe(1000);
    expect(recount(geometryOf(noded))).toEqual({ crossings: 0, touches: 0 });
    const embedding = embed(noded);
    expect(embedding.vertices.length - (embedding.halfEdges.length / 2) + embedding.faces.length)
      .toBe(1 + embedding.componentCount);
  });

  test('A3 · a T-junction cuts the run-through edge at the touch, and the kernel embeds with Euler holding', () => {
    const raw = [
      segment([0, 0], [4000, 0]), segment([4000, 0], [4000, 4000]),
      segment([4000, 4000], [0, 4000]), segment([0, 4000], [0, 0]),
      segment([2000, 0], [2000, -2000], 'street_right_of_way', 'stub'),
    ];
    // POSITIVE CONTROL FIRST: the shape has no proper crossing at all — it is a pure endpoint
    // touch — and the landed kernel refuses it. A predicate that only sees crossings cannot
    // cure this, which is why the endpoint-on-interior arm exists.
    expect(recount(raw.map((s) => [s.a, s.b]))).toEqual({ crossings: 0, touches: 1 });
    expect(properCross([0, 0], [4000, 0], [2000, 0], [2000, -2000])).toBe(false);
    expect(() => embedRaw('noder-a3', raw)).toThrow(ATOMIC_REFUSAL);

    const noded = nodeBoundarySegments({ settlementId: 'noder-a3', segments: raw });
    expect(noded.boundaries).toHaveLength(6);
    expect(noded.splitCount).toBe(2);
    expect(noded.residualProperCrossings).toBe(0);
    expect(recount(geometryOf(noded))).toEqual({ crossings: 0, touches: 0 });
    const touching = noded.boundaries
      .filter((row) => row.geometry.some((point) => point[0] === 2000 && point[1] === 0));
    expect(touching).toHaveLength(3);

    const embedding = embed(noded);
    expect(embedding.vertices).toHaveLength(6);
    expect(embedding.halfEdges).toHaveLength(12);
    expect(embedding.faces).toHaveLength(2);
    expect(embedding.vertices.length - (embedding.halfEdges.length / 2) + embedding.faces.length)
      .toBe(1 + embedding.componentCount);
  });

  test('A4 · collinear overlaps decompose into runs, exact duplicates collapse, and the shared-endpoint overlap the atomic check waves through is cured too', () => {
    const overlapping = [
      segment([0, 0], [2000, 0], 'wall_face', 'run-a'),
      segment([1000, 0], [3000, 0], 'wall_face', 'run-b'),
    ];
    expect(() => embedRaw('noder-a4', overlapping)).toThrow(ATOMIC_REFUSAL);
    const runs = nodeBoundarySegments({ settlementId: 'noder-a4', segments: overlapping });
    expect(runs.boundaries).toHaveLength(3);
    expect(runs.duplicatesDropped).toBe(1);
    expect(runs.residualProperCrossings).toBe(0);
    expect([...geometryOf(runs)].map((line) => JSON.stringify(line)).sort()).toEqual([
      '[[0,0],[1000,0]]', '[[1000,0],[2000,0]]', '[[2000,0],[3000,0]]',
    ]);
    expect(embed(runs).componentCount).toBe(1);

    const doubled = [
      segment([0, 0], [2000, 0], 'wall_face', 'first'),
      segment([0, 0], [2000, 0], 'water_edge', 'second'),
    ];
    const deduped = nodeBoundarySegments({ settlementId: 'noder-a4', segments: doubled });
    expect(deduped.boundaries).toHaveLength(1);
    expect(deduped.duplicatesDropped).toBe(1);
    expect(deduped.rawSegmentCount).toBe(2);
    // The ported rule, asserted rather than assumed: FIRST OCCURRENCE WINS on the survivor's
    // lineage, so the deduped row keeps 'first' and never the later 'second'.
    expect(deduped.boundaries[0].sourceId).toBe('first');
    expect(deduped.boundaries[0].role).toBe('wall_face');

    // ⭐ THE FOURTH WITNESS CLASS, with its own positive control. Two collinear segments sharing
    // ONE endpoint pass the kernel's pairwise atomic check — it returns early on a single shared
    // endpoint — and are refused by the ANGULAR TIE instead. The refusal message asserted below
    // is what proves the two arms are different arms.
    const sharing = [
      segment([0, 0], [1000, 0], 'wall_face', 'short'),
      segment([0, 0], [2000, 0], 'wall_face', 'long'),
    ];
    expect(() => embedRaw('noder-a4', sharing)).toThrow('DCEL vertex has an angular tie');
    const cured = nodeBoundarySegments({ settlementId: 'noder-a4', segments: sharing });
    expect(cured.boundaries).toHaveLength(2);
    expect(cured.duplicatesDropped).toBe(1);
    expect([...geometryOf(cured)].map((line) => JSON.stringify(line)).sort()).toEqual([
      '[[0,0],[1000,0]]', '[[1000,0],[2000,0]]',
    ]);
    expect(embed(cured).componentCount).toBe(1);
  });

  test('A5 · re-noding a noded set is a fixed point, and the geometry digests keep the ids stable', () => {
    const raw = [...ring(0, 0, 4000), ...ring(2000, 2000, 4000)];
    const once = nodeBoundarySegments({ settlementId: 'noder-a1', segments: raw });
    const twice = nodeBoundarySegments({
      settlementId: 'noder-a1',
      segments: once.boundaries.map((row) => segment(
        [...row.geometry[0]], [...row.geometry[1]], row.role, row.sourceId,
      )),
    });
    expect(twice.splitCount).toBe(0);
    expect(twice.nodingPasses).toBe(1);
    expect(twice.residualProperCrossings).toBe(0);
    expect(twice.duplicatesDropped).toBe(0);
    expect(twice.rawSegmentCount).toBe(12);
    expect(twice.boundaries.map((row) => row.boundaryId))
      .toEqual(once.boundaries.map((row) => row.boundaryId));
    expect(geometryOf(twice)).toEqual(geometryOf(once));
  });

  test('A6 · every malformed input is refused in a typed way that names its label, and an empty segment list is not an error', () => {
    // POSITIVE CONTROL FIRST: the same shape with valid values is ACCEPTED, so the refusals
    // below measure the validators rather than a function that rejects everything.
    const accepted = nodeBoundarySegments({
      settlementId: 'noder-a6', segments: [segment([0, 0], [4000, 0])],
    });
    expect(accepted.boundaries).toHaveLength(1);

    expect(() => nodeBoundarySegments({
      settlementId: 'noder-a6', segments: [segment([0.5, 0], [1000, 0])],
    })).toThrow('segments[0].a[0] must be an integer in -9007199254..9007199254');
    expect(() => nodeBoundarySegments({
      settlementId: 'noder-a6', segments: [segment([9007199255, 0], [1000, 0])],
    })).toThrow('segments[0].a[0] must be an integer in -9007199254..9007199254');
    expect(() => nodeBoundarySegments({ segments: [segment([0, 0], [1000, 0])] }))
      .toThrow('boundary noder input.settlementId must be a canonical id');
    expect(() => nodeBoundarySegments({
      settlementId: 'noder-a6', segments: [segment([0, 0], [1000, 0], '', 'x')],
    })).toThrow('segments[0].role must be a non-empty string');
    expect(() => nodeBoundarySegments({
      settlementId: 'noder-a6', segments: [segment([0, 0], [1000, 0], 'r', '')],
    })).toThrow('segments[0].sourceId must be a non-empty string');
    expect(() => nodeBoundarySegments('not-a-record'))
      .toThrow('boundary noder input must be an object');
    expect(() => nodeBoundarySegments({ settlementId: 'noder-a6', segments: 'nope' }))
      .toThrow('boundary noder input.segments must be an array');
    expect(() => nodeBoundarySegments({
      settlementId: 'noder-a6',
      segments: [{ a: [0, 0], b: [1000], role: 'r', sourceId: 's' }],
    })).toThrow('segments[0].b must be an [x,z] point');
    for (const bad of [0.5, 9007199255, Number.NaN]) {
      expect(() => nodeBoundarySegments({
        settlementId: 'noder-a6', segments: [segment([0, 0], [bad, 0])],
      })).toThrow(TypeError);
    }

    const empty = nodeBoundarySegments({ settlementId: 'noder-a6', segments: [] });
    expect(empty.boundaries).toEqual([]);
    expect(empty.residualProperCrossings).toBe(0);
    expect(empty.rawSegmentCount).toBe(0);
    expect(empty.arrangementQuantum).toBe(1000);

    // A segment finer than the rung collapses to zero length under the snap and is DROPPED,
    // which is visible as rawSegmentCount minus the surviving rows rather than as an error.
    const collapsing = nodeBoundarySegments({
      settlementId: 'noder-a6',
      segments: [segment([0, 0], [100, 0], 'wall_face', 'sub-rung'), segment([0, 0], [4000, 0])],
    });
    expect(collapsing.rawSegmentCount).toBe(2);
    expect(collapsing.boundaries).toHaveLength(1);
    expect(collapsing.boundaries[0].geometry).toEqual([[0, 0], [4000, 0]]);
  });

  test('A8 · four hundred crossings and an off-grid diagonal node to zero residual on the rung grid, and the ported ladder is exactly the sandbox triple', () => {
    // The ported-value pin (the MF-T2B ANGLE_TABLE_SIZE precedent): the rungs are owner tuning
    // surface, so this member carries them and never chooses among them.
    expect(ARRANGEMENT_QUANTUM_LADDER).toEqual([1000, 5000, 25000]);
    expect(Object.isFrozen(ARRANGEMENT_QUANTUM_LADDER)).toBe(true);

    const lines = [];
    for (let k = 0; k < 20; k += 1) {
      lines.push(segment([k * 7000, -5000], [k * 7000, 145000], 'wall_face', `v${k}`));
      lines.push(segment([-5000, k * 7000], [145000, k * 7000], 'wall_face', `h${k}`));
    }
    // ⭐ THE DIAGONAL IS WHAT MAKES THIS ARM NON-VACUOUS. An axis-parallel grid crosses exactly
    // ON the rung grid, so a split point published UN-snapped would be invisible here; the
    // diagonal's crossings fall off the grid and force the snap to be observable.
    const diagonal = segment([-3000, -4000], [143000, 138000], 'wall_face', 'diag');
    expect(recount(lines.map((s) => [s.a, s.b])).crossings).toBe(400);
    const raw = [...lines, diagonal];
    expect(recount(raw.map((s) => [s.a, s.b])).crossings).toBe(440);

    const noded = nodeBoundarySegments({ settlementId: 'noder-a8', segments: raw });
    expect(noded.rawSegmentCount).toBe(41);
    expect(noded.arrangementQuantum).toBe(1000);
    expect(noded.residualProperCrossings).toBe(0);
    expect(noded.boundaries).toHaveLength(921);
    expect(noded.arrangementQuantumLadder).toEqual([1000, 5000, 25000]);
    expect(recount(geometryOf(noded))).toEqual({ crossings: 0, touches: 0 });
    // ⭐ THE NON-VACUITY CONTROL, ASSERTED BEFORE THE ABSENCE. The diagonal's UN-SNAPPED
    // crossing with a grid line is genuinely off the rung grid, so "every published coordinate
    // is a rung multiple" is a claim with something to refute it rather than a tautology.
    const rawCrossing = segIntersect(diagonal.a, diagonal.b, [7000, -5000], [7000, 145000]);
    expect(rawCrossing).not.toBeNull();
    expect(Number.isInteger(rawCrossing[1]) && rawCrossing[1] % 1000 === 0).toBe(false);

    let offGridCoordinates = 0;
    for (const row of noded.boundaries) {
      for (const value of row.geometry.flat()) {
        if (value % noded.arrangementQuantum !== 0) offGridCoordinates += 1;
      }
    }
    expect(offGridCoordinates).toBe(0);
    const embedding = embed(noded);
    expect(embedding.vertices).toHaveLength(522);
    expect(embedding.faces).toHaveLength(401);
    expect(embedding.vertices.length - (embedding.halfEdges.length / 2) + embedding.faces.length)
      .toBe(1 + embedding.componentCount);
  });
});
