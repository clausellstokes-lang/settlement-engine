/**
 * tests/domain/townMapSolidLegality.test.js — MF-T2F's acceptance matrix (A1–A7).
 *
 * The family's two-file acceptance shape: this domain matrix plus the determinism companion in
 * tests/property/. One literal `describe`, straight-line `test()` calls, string-literal titles,
 * fixtures built inside their named tests — the SP-D idiom, so the census credits the file.
 *
 * ⛔ NOTHING HERE IMPORTS THE SEALED SANDBOX. The port-fidelity comparison against the sealed D1
 * predicate was executed read-only at the lane's base and is recorded in the packet; what this
 * file pins is the LIVE behaviour of the landed leaves. No app or test file may reach into that
 * tree.
 *
 * ⚠ Every figure below was PRINTED by the implemented modules before it was written down. The
 * `{ numQ, denQ }` records are exact BigInt rationals in lowest terms — divergence D-3 — so a
 * pin like `{ numQ: 1n, denQ: 2n }` is the answer itself and not a rounding of one.
 *
 * ⚠ Every id fixture is spelled to the landed canonical-id grammar, which is LOWERCASE ONLY.
 */

import { describe, expect, test } from 'vitest';

import { COORDINATE_ABI_VERSION } from '../../src/domain/townMap/fabric/coordinateAbi.js';
import { area } from '../../src/domain/townMap/fabric/exactGeometry.js';
import { solidPartQ } from '../../src/domain/townMap/fabric/massPart.js';
import {
  assertAnswerableFootprintQ,
  exactRatioQ,
} from '../../src/domain/townMap/fabric/exactIntersectionArea.js';
import {
  OVERLAP_FLOOR_Q,
  PLAN_ERA_VERTICAL,
  dualRunLegality,
  footprintIsAnswerable,
  intervalOverlapVerdict,
  planEraSolid,
  solidOverlap,
} from '../../src/domain/townMap/fabric/solidLegality.js';

const SUPPORT = 'support:terrain:t1';
const OTHER_SUPPORT = 'support:wall-top:w9';

/** A fresh mutable 10,000-quantum square, so no fixture is shared by reference. */
const square = (side = 10000) => [[0, 0], [side, 0], [side, side], [0, side]];

/** The bridge sentence the source refuses different supports with, quoted verbatim. */
const BRIDGE_DETAIL = 'two solids on different supports need a registered connection before their'
  + ' vertical intervals can be compared (SPEC §10.5); a bridge over a lane is this case';

/** A landed MF-T2E record — the vocabulary this predicate reads (divergence D-1). */
const part = (partId, baseQ, topQ, supportSurfaceId = SUPPORT, footprint = square()) => solidPartQ({
  partId, supportSurfaceId, footprint, vertical: { baseQ, topQ },
});

describe('MF-T2F solid legality', () => {
  test('A1 · the port-fidelity quintet answers on landed MF-T2E records, exactly and frozen', () => {
    const hall = part('part:hall', 0, 5000);
    const solar = part('part:solar', 5000, 9000);
    const cellar = part('part:cellar', 4250, 9000);
    const annex = part('part:annex', 0, 5000, OTHER_SUPPORT);
    const ghost = planEraSolid('part:ghost', SUPPORT, square());

    // ⭐ THE POSITIVE CONTROL FIRST: a genuinely overlapping pair answers VOLUME with a positive
    // exact volume, so every DISJOINT/REFUSED arm below is a decision rather than a dead call.
    const overlapping = solidOverlap(hall, cellar);
    expect(overlapping.kind).toBe('VOLUME');
    expect(overlapping.verdict).toBe('OVERLAPPING');
    expect(overlapping.sharedHeightQ).toBe(750n);
    expect(overlapping.sharedVolumeQ).toEqual({ numQ: 75000000000n, denQ: 1n });

    // ⭐ THE HALF-OPEN ADJACENCY LAW as arithmetic: [0,5000) and [5000,9000) touch and enclose
    // nothing. Full shared FOOTPRINT, zero shared VOLUME.
    const stacked = solidOverlap(hall, solar);
    expect(stacked.kind).toBe('VOLUME');
    expect(stacked.sharedAreaQ).toEqual({ numQ: 100000000n, denQ: 1n });
    expect(stacked.sharedHeightQ).toBe(0n);
    expect(stacked.sharedVolumeQ).toEqual({ numQ: 0n, denQ: 1n });
    expect(stacked.verdict).toBe('DISJOINT_OR_ABUTTING');

    const differentSupport = solidOverlap(hall, annex);
    expect(differentSupport.kind).toBe('REFUSED');
    expect(differentSupport.reason).toBe('DIFFERENT_SUPPORT_SURFACE');
    expect(differentSupport.detail).toBe(BRIDGE_DETAIL);
    // anchored: the same object's kind/reason/detail are pinned above, so a null verdict here is the refusal contract and not an empty result
    expect(differentSupport.verdict).toBeNull();

    const planar = solidOverlap(hall, ghost);
    expect(planar.kind).toBe('PLANAR_ONLY');
    expect(planar.sharedAreaQ).toEqual({ numQ: 100000000n, denQ: 1n });
    expect(planar.verticalStatus).toBe('ABSENT');
    expect(planar.verdict).toBe('OVERLAPPING');
    expect(Object.hasOwn(planar, 'sharedVolumeQ'),
      'a PLANAR_ONLY answer published a volume it cannot know').toBe(false);

    const sameId = solidOverlap(hall, part('part:hall', 5000, 9000));
    expect(sameId.kind).toBe('REFUSED');
    expect(sameId.reason).toBe('SAME_SOLID_ID');
    // anchored: the reason string one line up proves this is the SAME_SOLID_ID branch, not an unbuilt result
    expect(sameId.verdict).toBeNull();

    for (const result of [overlapping, stacked, differentSupport, planar, sameId]) {
      expect(Object.isFrozen(result), 'a legality answer shipped mutable').toBe(true);
    }
    expect(Object.isFrozen(stacked.sharedAreaQ), 'an exact magnitude shipped mutable').toBe(true);
  });

  test('A2 · unanswerable footprints and malformed inputs are refused typed, never answered', () => {
    const bowtie = [[0, 0], [10000, 10000], [10000, 0], [0, 10000]];
    const crossA = [[0, 0], [8000, 0], [8000, 8000], [4000, -2000], [0, 8000]];
    const collinear = [[0, 0], [1000, 1000], [2000, 2000]];

    // ⭐ THE POSITIVE CONTROL: an ordinary square IS answerable, so the refusals below are
    // selections rather than a predicate that refuses everything.
    expect(footprintIsAnswerable(square())).toBe(true);
    expect(() => assertAnswerableFootprintQ(square(), 'control')).not.toThrow();

    // anchored: the square one line up is answerable through this exact function, so `false` here is a refusal and not a dead scanner
    expect(footprintIsAnswerable(bowtie)).toBe(false);
    // anchored: same positive control, same call — the cross-A ring reaches a DIFFERENT refusal arm, pinned by message below
    expect(footprintIsAnswerable(crossA)).toBe(false);
    expect(footprintIsAnswerable(collinear)).toBe(false);
    expect(footprintIsAnswerable([[0, 0], [1, 1]])).toBe(false);

    // The three named refusal arms of the exact core, each by its own fixture.
    expect(() => assertAnswerableFootprintQ(bowtie, 'fixture:bowtie'))
      .toThrow('fixture:bowtie has zero exact signed area (degenerate ring)');
    expect(() => assertAnswerableFootprintQ(collinear, 'fixture:collinear'))
      .toThrow('fixture:collinear has zero exact signed area (degenerate ring)');
    // ⭐⭐ THE COMPLETED-BUT-UNSOUND CLASS: cross-A has exact twice-area 48000000, so it never
    // reaches the degenerate arm; ear-clipping COMPLETES on it and only the exactness identity
    // convicts the result. This is the arm a float tolerance cannot separate from rounding.
    expect(() => assertAnswerableFootprintQ(crossA, 'fixture:cross-a'))
      .toThrow('fixture:cross-a is not an answerable footprint (exact triangulation identity failed)');

    // ⭐ DIVERGENCE D-4: the predicate REFUSES rather than answering from a partial triangulation.
    const hall = part('part:hall', 0, 3000);
    const bowtieSolid = planEraSolid('part:bowtie', SUPPORT, bowtie);
    const crossSolid = planEraSolid('part:cross', SUPPORT, crossA);
    expect(() => solidOverlap(bowtieSolid, hall)).toThrow(TypeError);
    expect(() => solidOverlap(bowtieSolid, hall))
      .toThrow('solidOverlap.a.footprint has zero exact signed area (degenerate ring)');
    expect(() => solidOverlap(crossSolid, hall))
      .toThrow('solidOverlap.a.footprint is not an answerable footprint (exact triangulation identity failed)');

    // The input wall's own refusals, in the landed validators' own words.
    expect(() => planEraSolid('UPPER:Case', SUPPORT, square()))
      .toThrow('planEraSolid.partId must be a canonical id');
    expect(() => planEraSolid('part:ok', SUPPORT, [[0, 0], [1.5, 0], [0, 5]]))
      .toThrow('planEraSolid.footprint[1][0] must be an integer in -9007199254..9007199254');
    expect(() => planEraSolid('part:ok', SUPPORT, [[0, 0], [1, 0]]))
      .toThrow('planEraSolid.footprint must be a ring of at least three [xQ, zQ] points');
    expect(() => solidOverlap(null, hall)).toThrow('solidOverlap.a must be an object');
    expect(() => exactRatioQ(1n, 0n)).toThrow('exactRatioQ denominator must not be zero');
    expect(() => exactRatioQ(1, 2))
      .toThrow('exactRatioQ requires BigInt numerator and denominator');
  });

  test('A3 · two solids stacked at a shared quantum share their whole footprint and zero volume', () => {
    const lower = part('part:lower', 0, 5000);
    const upper = part('part:upper', 5000, 9000);
    // ⭐ THE POSITIVE CONTROL, in the same test: drop the upper solid by one quantum and a real
    // volume appears. The zero below is therefore the half-open law, not an inert predicate.
    const sunk = part('part:sunk', 4999, 9000);
    const overlapping = solidOverlap(lower, sunk);
    expect(overlapping.sharedHeightQ).toBe(1n);
    expect(overlapping.sharedVolumeQ).toEqual({ numQ: 100000000n, denQ: 1n });
    expect(overlapping.verdict).toBe('OVERLAPPING');

    const touching = solidOverlap(lower, upper);
    expect(touching.sharedAreaQ).toEqual({ numQ: 100000000n, denQ: 1n });
    expect(touching.sharedHeightQ).toBe(0n);
    // anchored: the one-quantum overlap three lines up produced 100000000 of volume through this same call, so a zero here is an abutment and not a dead arm
    expect(touching.sharedVolumeQ).toEqual({ numQ: 0n, denQ: 1n });
    expect(touching.verdict).toBe('DISJOINT_OR_ABUTTING');
  });

  test('A4 · the forbidden interval predicate is kept as a falsifiable negative control', () => {
    const lShape = [[0, 0], [10000, 0], [10000, 4000], [4000, 4000], [4000, 10000], [0, 10000]];
    const notch = [[5000, 5000], [9000, 5000], [9000, 9000], [5000, 9000]];
    const range = part('part:range', 0, 5000, SUPPORT, lShape);
    const tucked = part('part:tucked', 0, 5000, SUPPORT, notch);

    // ⭐ THE POSITIVE CONTROL: on genuinely nested squares BOTH spellings say overlapping, so the
    // disagreement below is the interval predicate being wrong and not the control being inert.
    const outer = part('part:outer', 0, 5000);
    const inner = part('part:inner', 0, 5000, SUPPORT, square(6000));
    expect(intervalOverlapVerdict(outer, inner)).toBe('OVERLAPPING');
    expect(solidOverlap(outer, inner).verdict).toBe('OVERLAPPING');

    // …and on the L-and-notch pair it reports a collision over ground the exact answer says is
    // empty. That gap is the §287.5 law measured rather than asserted.
    expect(intervalOverlapVerdict(range, tucked)).toBe('OVERLAPPING');
    const exact = solidOverlap(range, tucked);
    expect(exact.sharedAreaQ).toEqual({ numQ: 0n, denQ: 1n });
    expect(exact.sharedVolumeQ).toEqual({ numQ: 0n, denQ: 1n });
    expect(exact.verdict).toBe('DISJOINT_OR_ABUTTING');

    // The predicate is falsifiable in BOTH directions: separated bodies read DISJOINT.
    const far = part('part:far', 0, 5000, SUPPORT,
      [[50000, 50000], [60000, 50000], [60000, 60000], [50000, 60000]]);
    expect(intervalOverlapVerdict(outer, far)).toBe('DISJOINT');
  });

  test('A5 · the carried R-MF-2 conviction is cured on both arms, with the float witnessed in-test', () => {
    // ── ARM 1 · THE VERDICT FLIP. A legal sliver whose exact twice-area is -1.
    const m = 1286630001;
    const sliver = [[0, 0], [m - 1, m], [m, m + 1]];
    let numberShoelace = 0;
    let exactShoelace = 0n;
    for (let i = 0; i < 3; i += 1) {
      const [ax, ay] = sliver[i];
      const [bx, by] = sliver[(i + 1) % 3];
      numberShoelace += ax * by - bx * ay;
      exactShoelace += BigInt(ax) * BigInt(by) - BigInt(bx) * BigInt(ay);
    }
    // THE DIVERGENCE, WITNESSED IN-TEST rather than quoted: the float reading is zero and the
    // exact reading is not, on the same ring, in the same test.
    expect(numberShoelace).toBe(0);
    expect(exactShoelace).toBe(-1n);
    expect(area(sliver)).toBe(0);

    const slabA = part('part:sliver-a', 0, 3000, SUPPORT, sliver);
    const slabB = part('part:sliver-b', 0, 3000, SUPPORT, sliver.map((point) => [...point]));
    const flipped = solidOverlap(slabA, slabB);
    expect(flipped.kind).toBe('VOLUME');
    expect(flipped.sharedAreaQ).toEqual({ numQ: 1n, denQ: 2n });
    expect(flipped.sharedHeightQ).toBe(3000n);
    expect(flipped.sharedVolumeQ).toEqual({ numQ: 1500n, denQ: 1n });
    expect(flipped.verdict).toBe('OVERLAPPING');
    expect(footprintIsAnswerable(sliver)).toBe(true);

    // ── ARM 2 · THE PRODUCT DRIFT at ordinary ground. An odd side, so the square of a legal
    // coordinate sits off the float lattice; an even side would have made this arm vacuous.
    const s = 94906267;
    const exactArea = BigInt(s) ** 2n;
    const exactVolume = exactArea * 3000n;
    expect(BigInt(s * s)).not.toBe(exactArea);
    expect(exactVolume).toBe(27021598547625867000n);

    const wideA = part('part:wide-a', 0, 3000, SUPPORT, square(s));
    const wideB = part('part:wide-b', 0, 3000, SUPPORT, square(s));
    const wide = solidOverlap(wideA, wideB);
    expect(wide.sharedAreaQ).toEqual({ numQ: 9007199515875289n, denQ: 1n });
    expect(wide.sharedVolumeQ).toEqual({ numQ: exactVolume, denQ: 1n });
    expect(wide.verdict).toBe('OVERLAPPING');

    // ⭐ THE POSITIVE CONTROL: at fixture scale the exact answer is the ordinary answer, so the
    // cure did not buy its exactness by disagreeing with the float spelling everywhere.
    const triangle = [[0, 0], [4000, 0], [0, 6000]];
    const triA = part('part:tri-a', 0, 1000, SUPPORT, triangle);
    const triB = part('part:tri-b', 0, 1000, SUPPORT, triangle.map((point) => [...point]));
    const ordinary = solidOverlap(triA, triB);
    expect(ordinary.sharedAreaQ).toEqual({ numQ: 12000000n, denQ: 1n });
    expect(ordinary.verdict).toBe('OVERLAPPING');
  });

  test('A6 · the plan-era constants carry no tuning dial and no caller can smuggle a vertical', () => {
    // GUARD-THE-GUARD OPENERS: the constant is a live frozen record with real content, so the
    // equalities below are about its value rather than about an empty object.
    expect(Object.isFrozen(PLAN_ERA_VERTICAL)).toBe(true);
    expect(PLAN_ERA_VERTICAL.kind).toBe('ABSENT');
    expect(PLAN_ERA_VERTICAL.reason.length).toBeGreaterThan(20);

    // ⛔ THE NO-TUNING PIN. Exactly zero, and typed BigInt so it is compared against exact
    // numerators rather than coerced.
    expect(OVERLAP_FLOOR_Q).toBe(0n);
    expect(typeof OVERLAP_FLOOR_Q).toBe('bigint');

    const ghost = planEraSolid('part:ghost', SUPPORT, square());
    expect(ghost.vertical).toBe(PLAN_ERA_VERTICAL);
    expect(ghost.abiVersion).toBe(COORDINATE_ABI_VERSION);
    expect(ghost.partId).toBe('part:ghost');
    expect(Object.isFrozen(ghost)).toBe(true);

    // ⭐ THE ABSENCE: the constructor takes three arguments and none of them is a vertical, so a
    // plan-era solid cannot be minted carrying a height.
    expect(planEraSolid).toHaveLength(3);
    const smuggled = planEraSolid('part:smuggle', SUPPORT, square(),
      { kind: 'INTERVAL', baseQ: 0, topQ: 9000 });
    // anchored: the identity assertion above proves this constructor DOES mint a vertical, so an unchanged ABSENT here is a refusal to accept the fourth argument rather than a missing field
    expect(smuggled.vertical).toBe(PLAN_ERA_VERTICAL);
  });

  test('A7 · the dual-run harness counts disagreements over a mixed roster', () => {
    const lShape = [[0, 0], [10000, 0], [10000, 4000], [4000, 4000], [4000, 10000], [0, 10000]];
    const notch = [[5000, 5000], [9000, 5000], [9000, 9000], [5000, 9000]];
    const bowtie = [[0, 0], [10000, 10000], [10000, 0], [0, 10000]];
    const roster = [
      part('part:range', 0, 5000, SUPPORT, lShape),
      part('part:tucked', 0, 5000, SUPPORT, notch),
      part('part:plot', 0, 5000),
      planEraSolid('part:broken', SUPPORT, bowtie),
    ];
    const boxOf = (ring) => ring.reduce((acc, point) => [
      Math.min(acc[0], point[0]), Math.min(acc[1], point[1]),
      Math.max(acc[2], point[0]), Math.max(acc[3], point[1]),
    ], [Infinity, Infinity, -Infinity, -Infinity]);
    const legacyStub = (ringA, ringB) => {
      const a = boxOf(ringA);
      const b = boxOf(ringB);
      return a[2] > b[0] && b[2] > a[0] && a[3] > b[1] && b[3] > a[1];
    };

    // GUARD-THE-GUARD OPENERS: the roster is populated and the incumbent stub actually answers
    // true somewhere, so a zero false-positive count would mean agreement rather than silence.
    expect(roster).toHaveLength(4);
    expect(legacyStub(lShape, notch)).toBe(true);

    const dual = dualRunLegality(roster, legacyStub);
    expect(dual.pairs).toBe(3);
    expect(dual.unanswerable).toBe(1);
    expect(dual.exactOverlapping).toBe(2);
    expect(dual.intervalOverlapping).toBe(3);
    expect(dual.intervalFalsePositive).toBe(1);
    expect(dual.intervalFalseNegative).toBe(0);
    expect(dual.legacyFalsePositive).toBe(1);
    expect(dual.samples).toHaveLength(1);
    expect(dual.samples[0].a).toBe('part:range');
    expect(dual.samples[0].b).toBe('part:tucked');
    expect(dual.samples[0].kind).toBe('LEGACY_SAYS_YES_EXACT_SAYS_NO');
    expect(dual.samples[0].sharedAreaQ).toEqual({ numQ: 0n, denQ: 1n });

    // Without an incumbent to compare against, the legacy counters stay honest zeros while the
    // interval comparison still runs.
    const noLegacy = dualRunLegality(roster, null);
    expect(noLegacy.legacyOverlapping).toBe(0);
    expect(noLegacy.legacyFalsePositive).toBe(0);
    expect(noLegacy.intervalFalsePositive).toBe(1);
  });
});
