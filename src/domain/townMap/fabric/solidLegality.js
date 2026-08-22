/**
 * ⭐⭐⭐ MF-T2F leaf 2 — **VOLUME LEGALITY BY EXACT SOLID INTERSECTION**, the app-side home of
 * ODQ §287.5: *"exact solid intersection, not XY/Z interval overlap, owns volume legality."*
 * Ported by hash from the sealed MF-D1 module of the same name and re-based on the landed
 * MF-T2E vocabulary, so the answer is now about REAL vertical intervals rather than a promise.
 *
 * ⛔⛔ THREE ANSWERS ARE ALREADY IN THE PROGRAMME AND NONE OF THEM IS THE LAW:
 *
 *   1. **COLLISION BY IDENTITY.** A duplicate id is refused, so two solids never meet in
 *      arithmetic at all. That is a uniqueness constraint, and it stays exactly what it is:
 *      ⛔ this member does not edit it, does not call it, and does not convict it. What ends is
 *      only its claim to the NAME of volume legality, and it ends because the predicate home
 *      below now exists — not because anything was taken away.
 *   2. **XY/Z INTERVAL OVERLAP.** Two bodies "overlap" when their shadows on each axis overlap.
 *      `intervalOverlapVerdict` implements it FAITHFULLY as the negative control, so the gap is
 *      measured rather than asserted: on an L-shaped range and a body tucked into its notch it
 *      reports a collision where the exact predicate reports exactly zero shared area.
 *   3. **The incumbent boolean overlap test.** Unquantified, not wrong; preserved bit-for-bit,
 *      not ported, not edited, and not reported as a defect.
 *
 * ⭐⭐⭐ THE LAW, AS THIS MODULE STATES IT: **two solids are illegal when the EXACT INTERSECTION
 * OF THEIR SOLIDS HAS POSITIVE MEASURE.** When either vertical extent is ABSENT the answer is
 * typed `PLANAR_ONLY` and carries the exact shared AREA; when both are `INTERVAL` the same call
 * returns `VOLUME`. The contract does not change when the third dimension arrives; only the
 * discriminant does.
 *
 * ⚠ THE VERTICAL RULE, INHERITED THROUGH MF-T2E: half-open `[baseQ, topQ)` on a NAMED SUPPORT
 * SURFACE. Two solids on DIFFERENT supports do not intersect merely because their intervals do
 * — one datum cannot truthfully stand on a hill — so that pair is REFUSED with a typed result
 * rather than silently answered. A bridge over a lane is the case. The half-open law needs no
 * branch: touching intervals give height zero, and zero volume.
 *
 * ⛔ SIX RECORDED DIVERGENCES from the sealed source, each ordered or forced, each executed:
 *   D-1 the identity key is `partId`, the landed MF-T2E spelling, so its records are admitted
 *       with zero adaptation; the refusal REASON string `SAME_SOLID_ID` names the law and is
 *       kept verbatim.
 *   D-2 the float area imports are NOT taken; the exact BigInt core decides and measures.
 *   D-3 the published magnitudes are exact: `sharedAreaQ`/`sharedVolumeQ` are frozen
 *       `{numQ, denQ}` rationals, `sharedHeightQ` is a BigInt, `OVERLAP_FLOOR_Q` is `0n`. Field
 *       names, discriminant kinds, verdicts, refusal reasons and refusal ORDER are unchanged,
 *       and at fixture scale every figure is numerically identical to the sealed predicate's.
 *   D-4 an unanswerable footprint THROWS typed instead of being answered from a partial
 *       triangulation. Executed justification: the sealed spelling answers
 *       `VOLUME / sharedAreaQ 100000000 / OVERLAPPING` for a bowtie against a square.
 *   D-5 `planEraSolid` validates through the landed wall rather than by string coercion.
 *   D-6 answerability is an exact identity rather than a float tolerance; the tolerance
 *       spelling refuses valid ground at ABI scale (the R-MF-2 sliver).
 *
 * ⛔ DORMANT BY DESIGN: nothing in the generation path calls this module, it is not exported
 * from the fabric barrel, and wiring any consumer to consult it is live engine behavior owing a
 * soak — a named successor step, not part of this member.
 *
 * PURITY: pure over arguments; BigInt and integer arithmetic only. No `Date`, no randomness,
 * no locale ordering, no `Math`.
 */

import {
  deepFreezeCanonical, requireCanonicalId, requireCanonicalInt, requireCanonicalRecord,
} from './foundation.js';
import { COORDINATE_ABI_VERSION } from './coordinateAbi.js';
import { bounds } from './exactGeometry.js';
import {
  assertAnswerableFootprintQ, exactRatioQ, sharedFootprintAreaExactQ,
} from './exactIntersectionArea.js';

/**
 * The record shape this predicate reads — satisfied by MF-T2E `solidPartQ` records and by
 * `planEraSolid` records alike, which is the whole point of divergence D-1.
 * @typedef {Readonly<{
 *   partId: string,
 *   supportSurfaceId: string,
 *   footprint: [number, number][],
 *   vertical: Readonly<{ kind: 'ABSENT' }> | Readonly<{
 *     kind: 'INTERVAL', baseQ: number, topQ: number }>,
 * }>} LegalitySolidQ
 */

/** @typedef {import('./exactIntersectionArea.js').ExactRatioQ} ExactRatioQ */
/** @typedef {'OVERLAPPING' | 'DISJOINT_OR_ABUTTING'} LegalityVerdict */
/** @typedef {Readonly<{ kind: 'REFUSED', reason: string, detail?: string, verdict: null }>}
 *    SolidRefusalQ */
/** @typedef {Readonly<{ kind: 'PLANAR_ONLY', sharedAreaQ: ExactRatioQ,
 *    verdict: LegalityVerdict, verticalStatus: string }>} SolidPlanarResultQ */
/** @typedef {Readonly<{ kind: 'VOLUME', sharedAreaQ: ExactRatioQ, sharedHeightQ: bigint,
 *    sharedVolumeQ: ExactRatioQ, verdict: LegalityVerdict }>} SolidVolumeResultQ */
/** @typedef {SolidRefusalQ | SolidPlanarResultQ | SolidVolumeResultQ} SolidOverlapResultQ */

/** The vertical extent every plan-era solid carries, and what it means. */
export const PLAN_ERA_VERTICAL = Object.freeze({
  kind: 'ABSENT',
  reason: 'no height artifact exists in the plan era (SPEC §10.16 status override); D3a mints it',
});

/** How much shared area counts as touching rather than overlapping. ⚠ It is EXACTLY ZERO, and
 *  that is the point: an abutment produces zero shared area under an exact predicate, so no
 *  tolerance is needed and none is offered. A tolerance here would be a tuning dial on a law.
 *  Typed BigInt because the exact predicate compares exact numerators against it. */
export const OVERLAP_FLOOR_Q = 0n;

/**
 * A solid, as the plan era can state one: a footprint on a named support with NO vertical
 * extent. ⛔ There is deliberately no simplicity check here — answerability is the predicate's
 * seam, exactly as in the source; this constructor hardens only the input wall.
 * @param {unknown} partId @param {unknown} supportSurfaceId @param {unknown} footprint
 */
export function planEraSolid(partId, supportSurfaceId, footprint) {
  const id = requireCanonicalId(partId, 'planEraSolid.partId');
  const support = requireCanonicalId(supportSurfaceId, 'planEraSolid.supportSurfaceId');
  if (!Array.isArray(footprint) || footprint.length < 3) {
    throw new TypeError('planEraSolid.footprint must be a ring of at least three [xQ, zQ] points');
  }
  const ring = footprint.map((point, index) => {
    if (!Array.isArray(point) || point.length !== 2) {
      throw new TypeError(`planEraSolid.footprint[${index}] must be an [xQ, zQ] point`);
    }
    return /** @type {[number, number]} */ ([
      requireCanonicalInt(point[0], `planEraSolid.footprint[${index}][0]`),
      requireCanonicalInt(point[1], `planEraSolid.footprint[${index}][1]`),
    ]);
  });
  return deepFreezeCanonical({
    partId: id,
    supportSurfaceId: support,
    footprint: ring,
    vertical: PLAN_ERA_VERTICAL,
    abiVersion: COORDINATE_ABI_VERSION,
  });
}

/**
 * ⛔ THE PREDICATE §287.5 FORBIDS, ported FAITHFULLY as the negative control. It is exported so
 * that a test and a census can quote what it gets WRONG; nothing may decide with it.
 * @param {LegalitySolidQ} a @param {LegalitySolidQ} b @returns {'OVERLAPPING' | 'DISJOINT'}
 */
export function intervalOverlapVerdict(a, b) {
  const ba = bounds(a.footprint);
  const bb = bounds(b.footprint);
  const xy = ba[2] > bb[0] && bb[2] > ba[0] && ba[3] > bb[1] && bb[3] > ba[1];
  if (!xy) return 'DISJOINT';
  if (a.vertical.kind === 'INTERVAL' && b.vertical.kind === 'INTERVAL') {
    return a.vertical.topQ > b.vertical.baseQ && b.vertical.topQ > a.vertical.baseQ
      ? 'OVERLAPPING' : 'DISJOINT';
  }
  return 'OVERLAPPING';
}

/**
 * Is this footprint one the exact predicate can answer about at all?
 * @param {unknown} ring @returns {boolean}
 */
export function footprintIsAnswerable(ring) {
  if (!Array.isArray(ring) || ring.length < 3) return false;
  try {
    assertAnswerableFootprintQ(ring, 'footprint');
    return true;
  } catch {
    return false;
  }
}

/**
 * ⭐⭐ THE LEGALITY PREDICATE. Admits MF-T2E `solidPartQ` records and `planEraSolid` records
 * alike. The refusal ORDER is the source's, and a refusal carries `verdict: null` because a
 * refusal is not a verdict.
 * @param {LegalitySolidQ} a @param {LegalitySolidQ} b @returns {SolidOverlapResultQ}
 */
export function solidOverlap(a, b) {
  const left = /** @type {LegalitySolidQ} */ (requireCanonicalRecord(a, 'solidOverlap.a'));
  const right = /** @type {LegalitySolidQ} */ (requireCanonicalRecord(b, 'solidOverlap.b'));
  if (left.partId === right.partId) {
    return Object.freeze({ kind: 'REFUSED', reason: 'SAME_SOLID_ID', verdict: null });
  }
  if (left.supportSurfaceId !== right.supportSurfaceId) {
    return Object.freeze({
      kind: 'REFUSED',
      reason: 'DIFFERENT_SUPPORT_SURFACE',
      detail: 'two solids on different supports need a registered connection before their '
        + 'vertical intervals can be compared (SPEC §10.5); a bridge over a lane is this case',
      verdict: null,
    });
  }
  const areaQ = sharedFootprintAreaExactQ(
    left.footprint, right.footprint, 'solidOverlap.a.footprint', 'solidOverlap.b.footprint',
  );
  const planar = areaQ.numQ > OVERLAP_FLOOR_Q;
  if (left.vertical.kind === 'ABSENT' || right.vertical.kind === 'ABSENT') {
    /** @type {LegalityVerdict} */
    const planarVerdict = planar ? 'OVERLAPPING' : 'DISJOINT_OR_ABUTTING';
    return deepFreezeCanonical({
      kind: /** @type {'PLANAR_ONLY'} */ ('PLANAR_ONLY'),
      sharedAreaQ: areaQ,
      verdict: planarVerdict,
      verticalStatus: PLAN_ERA_VERTICAL.kind,
    });
  }
  const aBase = BigInt(left.vertical.baseQ);
  const aTop = BigInt(left.vertical.topQ);
  const bBase = BigInt(right.vertical.baseQ);
  const bTop = BigInt(right.vertical.topQ);
  const lo = aBase > bBase ? aBase : bBase;
  const hi = aTop < bTop ? aTop : bTop;
  const h = hi - lo;
  const sharedVolumeQ = planar && h > 0n
    ? exactRatioQ(areaQ.numQ * h, areaQ.denQ)
    : exactRatioQ(0n, 1n);
  /** @type {LegalityVerdict} */
  const volumeVerdict = sharedVolumeQ.numQ > OVERLAP_FLOOR_Q
    ? 'OVERLAPPING' : 'DISJOINT_OR_ABUTTING';
  return deepFreezeCanonical({
    kind: /** @type {'VOLUME'} */ ('VOLUME'),
    sharedAreaQ: areaQ,
    sharedHeightQ: h > 0n ? h : 0n,
    sharedVolumeQ,
    verdict: volumeVerdict,
  });
}

/**
 * The migration harness: run the exact predicate beside the forbidden interval one and beside a
 * caller-supplied incumbent boolean, and COUNT the disagreements instead of arguing about them.
 * Unanswerable footprints are skipped and counted; REFUSED pairs are counted as pairs but
 * excluded from the verdict comparison.
 * @param {readonly LegalitySolidQ[]} solids
 * @param {((fa: unknown, fb: unknown) => boolean) | null | undefined} legacyBoolean
 */
export function dualRunLegality(solids, legacyBoolean) {
  const out = {
    pairs: 0,
    exactOverlapping: 0,
    intervalOverlapping: 0,
    legacyOverlapping: 0,
    intervalFalsePositive: 0,
    intervalFalseNegative: 0,
    legacyFalsePositive: 0,
    legacyFalseNegative: 0,
    unanswerable: 0,
    samples: /** @type {Record<string, unknown>[]} */ ([]),
  };
  /** @param {number} i @param {number} j @param {string} kind @param {ExactRatioQ} sharedAreaQ */
  const sample = (i, j, kind, sharedAreaQ) => {
    if (out.samples.length < 6) {
      out.samples.push({ a: solids[i].partId, b: solids[j].partId, kind, sharedAreaQ });
    }
  };
  for (let i = 0; i < solids.length; i += 1) {
    if (!footprintIsAnswerable(solids[i].footprint)) { out.unanswerable += 1; continue; }
    for (let j = i + 1; j < solids.length; j += 1) {
      if (!footprintIsAnswerable(solids[j].footprint)) continue;
      out.pairs += 1;
      const result = solidOverlap(solids[i], solids[j]);
      if (result.kind === 'REFUSED') continue;
      const exact = result.verdict === 'OVERLAPPING';
      const interval = intervalOverlapVerdict(solids[i], solids[j]) === 'OVERLAPPING';
      const legacy = legacyBoolean
        ? !!legacyBoolean(solids[i].footprint, solids[j].footprint) : null;
      if (exact) out.exactOverlapping += 1;
      if (interval) out.intervalOverlapping += 1;
      if (legacy) out.legacyOverlapping += 1;
      if (interval && !exact) out.intervalFalsePositive += 1;
      if (!interval && exact) out.intervalFalseNegative += 1;
      if (legacy !== null && legacy && !exact) {
        out.legacyFalsePositive += 1;
        sample(i, j, 'LEGACY_SAYS_YES_EXACT_SAYS_NO', result.sharedAreaQ);
      }
      if (legacy !== null && !legacy && exact) {
        out.legacyFalseNegative += 1;
        sample(i, j, 'LEGACY_SAYS_NO_EXACT_SAYS_YES', result.sharedAreaQ);
      }
    }
  }
  return out;
}
