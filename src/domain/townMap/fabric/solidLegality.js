/**
 * domain/townMap/fabric/solidLegality.js — ⭐⭐⭐ MF-D1 · §287.5 / §299.3(a) ·
 * **VOLUME LEGALITY BY EXACT SOLID INTERSECTION.**
 *
 * ODQ §287.5, binding: *"exact solid intersection, not XY/Z interval overlap, owns volume
 * legality."* ODQ §299.3(a), the debit the chair recorded against the codex slice and named a D1
 * obligation: *"volume legality is collision-by-identity, not the §287.5 exact solid
 * intersection."*
 *
 * ⛔⛔ THREE ANSWERS ARE ALREADY IN THE PROGRAMME AND NONE OF THEM IS THE LAW:
 *
 *   1. **COLLISION BY IDENTITY** (the codex slice). A duplicate `buildingId`/`plotId` is refused
 *      and one plot is forced to carry one body, so two solids never meet in arithmetic at all.
 *      This is a uniqueness constraint wearing a geometry predicate's name. It cannot see two
 *      DIFFERENT buildings occupying the same ground, which is the only thing the law is about.
 *   2. **XY/Z INTERVAL OVERLAP.** Two bodies "overlap" when their SHADOWS on each axis overlap.
 *      `intervalOverlapVerdict` below implements it FAITHFULLY — as the negative control, so the
 *      gap can be measured rather than asserted. On an L-shaped range and a body tucked into its
 *      notch it reports a collision where the exact predicate reports zero shared area.
 *   3. **`groundLaw.overlapping(A,B)`** — the sandbox's own §17 boolean. It shrinks both rings
 *      toward their centroids by `TOUCH_EPS` and tests vertex-in-other plus proper crossings. It
 *      is fast, it is what every §17 abutment decision is made with, and **it is preserved
 *      bit-for-bit: nothing here replaces it and nothing in the generation path calls this
 *      module.** What it cannot do is say HOW MUCH — and §273.6(c) already measured what that
 *      costs, six point-vs-area instances inside one wave, the sixth inside the instrument that
 *      printed the words AREA-TRUE.
 *
 * ⭐⭐⭐ THE LAW, AS THIS MODULE STATES IT: **two solids are illegal when the EXACT INTERSECTION
 * OF THEIR SOLIDS HAS POSITIVE MEASURE.** In the plan era a solid's vertical extent does not
 * exist — §7's `MassPartQ`/`SolidPartQ` are design-only and SPEC §10.16's status override says so
 * — so the answer is typed `PLANAR_ONLY` and carries the exact shared AREA. D3a supplies
 * `baseQ`/`topQ` and the same call returns `VOLUME` with a shared volume. **The contract does not
 * change when the third dimension arrives; only the discriminant does.**
 *
 * ⚠ THE VERTICAL RULE IS DECLARED NOW SO D3a INHERITS IT RATHER THAN INVENTING IT: the vertical
 * extents are half-open intervals `[baseQ, topQ)` on a NAMED SUPPORT SURFACE, and two solids on
 * DIFFERENT supports do not intersect merely because their intervals do — §10.5's whole point is
 * that one `zBase` cannot truthfully stand on a hill. A bridge over a lane is the case; it is
 * refused here with a typed result rather than silently answered.
 *
 * ⭐ EVERY GEOMETRIC QUESTION ROUTES THROUGH `fabricGeometry.js`. This module owns the TYPED
 * CONTRACT and the REFUSALS; it owns no arithmetic. `polygonIntersectionArea` is the one predicate
 * home, exactly as §287.12 made `properCross` one.
 *
 * PURITY: pure. No Date, no Math.random, no trig.
 */

import { absArea, bounds, polygonIntersectionArea, triangulateSimple, triangulationIsSound }
  from './fabricGeometry.js';
import { COORDINATE_ABI_VERSION } from './coordinateAbi.js';

/** The vertical extent every plan-era solid carries, and what it means. */
export const PLAN_ERA_VERTICAL = Object.freeze({
  kind: 'ABSENT',
  reason: 'no height artifact exists in the plan era (SPEC §10.16 status override); D3a mints it',
});

/** How much shared area counts as touching rather than overlapping. ⚠ It is EXACTLY ZERO, and
 *  that is the point: an abutment produces zero shared area under an exact predicate, so no
 *  tolerance is needed and none is offered. A tolerance here would be a tuning dial on a law. */
export const OVERLAP_FLOOR_Q = 0;

/**
 * A solid, as this era can state one.
 * @typedef {Object} SolidQ
 * @property {string} solidId          stable identity — NEVER the legality answer
 * @property {string} supportSurfaceId the surface it stands on (§10.5)
 * @property {[number,number][]} footprint  a simple ring in map units
 * @property {{kind:'ABSENT'}|{kind:'INTERVAL', baseQ:number, topQ:number}} vertical
 */

/** Build a plan-era solid. Heights are ABSENT by construction; a caller cannot fake one. */
export function planEraSolid(solidId, supportSurfaceId, footprint) {
  return Object.freeze({
    solidId: String(solidId),
    supportSurfaceId: String(supportSurfaceId),
    footprint,
    vertical: PLAN_ERA_VERTICAL,
    abiVersion: COORDINATE_ABI_VERSION,
  });
}

/**
 * ⛔ THE NEGATIVE CONTROL, IMPLEMENTED FAITHFULLY SO THE GAP IS A MEASUREMENT. This is the
 * predicate §287.5 forbids: two bodies collide when their axis-aligned extents overlap. It is
 * exported ONLY so a test and a census can quote what it gets wrong; nothing may decide with it,
 * and the walker asserts it has no caller outside its own tests.
 */
export function intervalOverlapVerdict(a, b) {
  const ba = bounds(a.footprint), bb = bounds(b.footprint);
  const xy = ba[2] > bb[0] && bb[2] > ba[0] && ba[3] > bb[1] && bb[3] > ba[1];
  if (!xy) return 'DISJOINT';
  if (a.vertical.kind === 'INTERVAL' && b.vertical.kind === 'INTERVAL') {
    return a.vertical.topQ > b.vertical.baseQ && b.vertical.topQ > a.vertical.baseQ
      ? 'OVERLAPPING' : 'DISJOINT';
  }
  return 'OVERLAPPING';
}

/**
 * ⭐⭐⭐ THE LEGALITY PREDICATE. Exact, area-true in the plan era, volume-true the moment a
 * vertical interval exists.
 *
 * Returns a discriminated result rather than a boolean, because "these two do not overlap" and
 * "I cannot answer that yet" and "they are on different supports" are three different facts and
 * collapsing them into `false` is how a legality census comes to read clean over a surface it
 * never examined.
 *
 * @param {SolidQ} a @param {SolidQ} b
 */
export function solidOverlap(a, b) {
  if (a.solidId === b.solidId) {
    // ⛔ §299.3(a): identity is NOT the legality question. A caller comparing a solid with
    // itself has asked something meaningless, and answering `OVERLAPPING` would let a uniqueness
    // check masquerade as a geometry check — the exact defect this module exists to refuse.
    return Object.freeze({ kind: 'REFUSED', reason: 'SAME_SOLID_ID', verdict: null });
  }
  if (a.supportSurfaceId !== b.supportSurfaceId) {
    return Object.freeze({
      kind: 'REFUSED',
      reason: 'DIFFERENT_SUPPORT_SURFACE',
      detail: 'two solids on different supports need a registered connection before their '
        + 'vertical intervals can be compared (SPEC §10.5); a bridge over a lane is this case',
      verdict: null,
    });
  }
  const areaQ = polygonIntersectionArea(a.footprint, b.footprint);
  const planar = areaQ > OVERLAP_FLOOR_Q;
  if (a.vertical.kind === 'ABSENT' || b.vertical.kind === 'ABSENT') {
    return Object.freeze({
      kind: 'PLANAR_ONLY',
      sharedAreaQ: areaQ,
      verdict: planar ? 'OVERLAPPING' : 'DISJOINT_OR_ABUTTING',
      verticalStatus: PLAN_ERA_VERTICAL.kind,
    });
  }
  const lo = Math.max(a.vertical.baseQ, b.vertical.baseQ);
  const hi = Math.min(a.vertical.topQ, b.vertical.topQ);
  const h = hi - lo;
  const shared = planar && h > 0 ? areaQ * h : 0;
  return Object.freeze({
    kind: 'VOLUME',
    sharedAreaQ: areaQ,
    sharedHeightQ: h > 0 ? h : 0,
    sharedVolumeQ: shared,
    verdict: shared > OVERLAP_FLOOR_Q ? 'OVERLAPPING' : 'DISJOINT_OR_ABUTTING',
  });
}

/** Is this footprint one this predicate can answer about at all? A self-crossing ring has no
 *  triangulation and therefore no area, and MF-D0's kernel is what guarantees published rings are
 *  simple — so this is the seam where D0's cure becomes D1's precondition, stated out loud. */
export function footprintIsAnswerable(ring) {
  if (!ring || ring.length < 3) return false;
  if (!(absArea(ring) > 0)) return false;
  return triangulationIsSound(ring, triangulateSimple(ring));
}

/**
 * ⭐⭐ THE DUAL-RUN. Runs the exact predicate and the two rejected ones over the same pair set and
 * reports where they disagree. This is what turns "interval overlap is wrong" from an argument
 * into a number, and it is the shape §10.15 asks of every D1 migration: keep the legacy accessor,
 * run the new one beside it, explain every disagreement.
 *
 * @param {SolidQ[]} solids
 * @param {(a:SolidQ,b:SolidQ)=>boolean} legacyBoolean the incumbent §17 predicate
 */
export function dualRunLegality(solids, legacyBoolean) {
  const out = {
    pairs: 0, exactOverlapping: 0, intervalOverlapping: 0, legacyOverlapping: 0,
    intervalFalsePositive: 0, intervalFalseNegative: 0,
    legacyFalsePositive: 0, legacyFalseNegative: 0,
    unanswerable: 0, samples: [],
  };
  for (let i = 0; i < solids.length; i++) {
    if (!footprintIsAnswerable(solids[i].footprint)) { out.unanswerable++; continue; }
    for (let j = i + 1; j < solids.length; j++) {
      if (!footprintIsAnswerable(solids[j].footprint)) continue;
      out.pairs++;
      const r = solidOverlap(solids[i], solids[j]);
      if (r.kind === 'REFUSED') continue;
      const exact = r.verdict === 'OVERLAPPING';
      const iv = intervalOverlapVerdict(solids[i], solids[j]) === 'OVERLAPPING';
      const lg = legacyBoolean ? !!legacyBoolean(solids[i].footprint, solids[j].footprint) : null;
      if (exact) out.exactOverlapping++;
      if (iv) out.intervalOverlapping++;
      if (lg) out.legacyOverlapping++;
      if (iv && !exact) out.intervalFalsePositive++;
      if (!iv && exact) out.intervalFalseNegative++;
      if (lg !== null && lg && !exact) {
        out.legacyFalsePositive++;
        if (out.samples.length < 6) {
          out.samples.push({ a: solids[i].solidId, b: solids[j].solidId, kind: 'LEGACY_SAYS_YES_EXACT_SAYS_NO', areaQ: r.sharedAreaQ });
        }
      }
      if (lg !== null && !lg && exact) {
        out.legacyFalseNegative++;
        if (out.samples.length < 6) {
          out.samples.push({ a: solids[i].solidId, b: solids[j].solidId, kind: 'LEGACY_SAYS_NO_EXACT_SAYS_YES', areaQ: r.sharedAreaQ });
        }
      }
    }
  }
  return out;
}
