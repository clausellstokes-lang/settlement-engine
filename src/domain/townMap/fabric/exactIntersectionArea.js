/**
 * ⭐⭐ MF-T2F leaf 1 — THE EXACT SHARED-AREA CORE. Two integer rings in, one BigInt rational
 * out, and no floating-point number anywhere between them.
 *
 * ⛔⛔ WHY THIS FILE EXISTS AT ALL — the R-MF-2 conviction, carried by ODQ §348.2 and EXECUTED
 * before a line of it was written. The float spelling this core replaces does not merely round;
 * it INVERTS legality answers on ground a settlement may legally occupy:
 *
 *   · the sliver a=[0,0] b=[m-1,m] c=[m,m+1] with m = 1286630001 — a legal footprint well
 *     inside the coordinate wall — has exact twice-area -1. The Number shoelace reads 0, the
 *     landed float `area()` and `absArea()` read 0, and the landed float
 *     `polygonIntersectionArea(sliver, sliver)` reads 0. Driven through the sealed D1
 *     predicate, two coincident such slivers answer VOLUME / sharedVolumeQ 0 /
 *     DISJOINT_OR_ABUTTING. The exact answer is area 1/2, volume 1500, OVERLAPPING. The float
 *     spelling additionally judges that footprint UNANSWERABLE, refusing valid ground.
 *   · at ordinary ground the product drifts too: coincident squares of side s = 94906267
 *     (about 1.05% of the wall) have exact area 9007199515875289 and exact volume
 *     27021598547625867000 over a 3000-quantum interval; the float spelling publishes
 *     9007199515875288 and 27021598547625865000 — the volume short by 1784 quanta cubed.
 *
 * A Number cannot even carry the right answer, so the cure is not a tolerance: every decision
 * and every published magnitude below is BigInt-exact. ⛔ There is no epsilon in this file, and
 * none may be added — a tolerance on a legality law is a tuning dial (ODQ §310.3(9)).
 *
 * ⛔ The float geometry home keeps its own role: `exactGeometry.js` is NOT edited and only its
 * integer `bounds` is imported here (an axis-aligned box over integer coordinates below 2^53 is
 * exact in Number). `area`, `absArea`, `polygonIntersectionArea`, `triangulateSimple` and
 * `triangulationIsSound` are deliberately NOT imported — importing any of them would re-admit
 * the convicted arithmetic through the back door.
 *
 * PURITY: pure over arguments; BigInt and integer arithmetic only; no clock, no randomness, no
 * locale ordering, no `Math`.
 */

import { bounds } from './exactGeometry.js';

/** @typedef {[number, number][]} IntegerRing */
/** @typedef {Readonly<{ numQ: bigint, denQ: bigint }>} ExactRatioQ */
/** @typedef {[bigint, bigint]} BigPoint */
/** @typedef {[BigPoint, BigPoint, BigPoint]} BigTriangle */
/** @typedef {[bigint, bigint, bigint]} HomogeneousPoint */

/** @param {bigint} a @param {bigint} b @returns {bigint} */
function gcdBig(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

/**
 * ⭐ THE ONE MINT of the published exact-quantity shape: a BigInt rational in lowest terms with
 * `denQ >= 1n` and the sign carried on `numQ`. Exact zero is always `{0n, 1n}`, so two equal
 * quantities are always deep-equal records.
 * @param {bigint} numQ @param {bigint} denQ @returns {ExactRatioQ}
 */
export function exactRatioQ(numQ, denQ) {
  if (typeof numQ !== 'bigint' || typeof denQ !== 'bigint') {
    throw new TypeError('exactRatioQ requires BigInt numerator and denominator');
  }
  if (denQ === 0n) {
    throw new TypeError('exactRatioQ denominator must not be zero');
  }
  let n = numQ;
  let d = denQ;
  if (d < 0n) { n = -n; d = -d; }
  if (n === 0n) return Object.freeze({ numQ: 0n, denQ: 1n });
  const g = gcdBig(n, d);
  return Object.freeze({ numQ: n / g, denQ: d / g });
}

/** @param {ExactRatioQ} a @param {ExactRatioQ} b @returns {ExactRatioQ} */
function ratAddQ(a, b) {
  return exactRatioQ(a.numQ * b.denQ + b.numQ * a.denQ, a.denQ * b.denQ);
}

/** Twice the signed area of a BigInt triangle.
 *  @param {BigPoint} a @param {BigPoint} b @param {BigPoint} c @returns {bigint} */
function triTwiceAreaQ(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

/** Twice the signed area of an integer ring, accumulated in BigInt.
 *  @param {IntegerRing} ring @returns {bigint} */
function ringTwiceAreaQ(ring) {
  let sum = 0n;
  for (let index = 0; index < ring.length; index += 1) {
    const [ax, ay] = ring[index];
    const [bx, by] = ring[(index + 1) % ring.length];
    sum += BigInt(ax) * BigInt(by) - BigInt(bx) * BigInt(ay);
  }
  return sum;
}

/** Strict containment by three strict BigInt orientations — no boundary case is "inside".
 *  @param {BigPoint} p @param {BigPoint} a @param {BigPoint} b @param {BigPoint} c */
function inTriangleStrictQ(p, a, b, c) {
  return triTwiceAreaQ(a, b, p) > 0n && triTwiceAreaQ(b, c, p) > 0n
    && triTwiceAreaQ(c, a, p) > 0n;
}

/**
 * Exact ear-clipping. Returns CCW BigInt triangles, or THROWS typed — never a partial result.
 * ⭐ The closing guard is the exactness IDENTITY, not a tolerance: the absolute twice-areas of
 * the emitted triangles must SUM EXACTLY to the ring's own absolute twice-area. That identity is
 * what convicts a self-crossing ring whose ear search nevertheless completes — the
 * completed-but-unsound class a float `triangulationIsSound(…, 1e-6)` cannot separate from
 * rounding. Executed fixtures: the ring [[0,0],[8000,0],[8000,8000],[4000,-2000],[0,8000]] has
 * ring twice-area 48000000 and clips to triangles summing 208000000.
 * @param {IntegerRing} ring @param {string} label @returns {BigTriangle[]}
 */
function triangulateExactQ(ring, label) {
  const twice = ringTwiceAreaQ(ring);
  if (twice === 0n) {
    throw new TypeError(`${label} has zero exact signed area (degenerate ring)`);
  }
  const n = ring.length;
  /** @type {number[]} */
  const idx = [];
  for (let i = 0; i < n; i += 1) idx.push(i);
  if (twice < 0n) idx.reverse();
  const points = ring.map(([x, y]) => /** @type {BigPoint} */ ([BigInt(x), BigInt(y)]));
  /** @type {BigTriangle[]} */
  const tris = [];
  let guard = 0;
  while (idx.length > 3) {
    if (guard > n * n + 16) {
      throw new TypeError(`${label} is not an answerable footprint (ear search exhausted)`);
    }
    guard += 1;
    let cut = -1;
    for (let i = 0; i < idx.length; i += 1) {
      const ia = idx[(i + idx.length - 1) % idx.length];
      const ib = idx[i];
      const ic = idx[(i + 1) % idx.length];
      const a = points[ia];
      const b = points[ib];
      const c = points[ic];
      if (triTwiceAreaQ(a, b, c) <= 0n) continue;
      let clean = true;
      for (const j of idx) {
        if (j === ia || j === ib || j === ic) continue;
        if (inTriangleStrictQ(points[j], a, b, c)) { clean = false; break; }
      }
      if (!clean) continue;
      tris.push([a, b, c]);
      cut = i;
      break;
    }
    if (cut < 0) {
      throw new TypeError(
        `${label} is not an answerable footprint (no admissible ear: the ring is not simple)`,
      );
    }
    idx.splice(cut, 1);
  }
  tris.push(/** @type {BigTriangle} */ ([points[idx[0]], points[idx[1]], points[idx[2]]]));
  let sum = 0n;
  for (const t of tris) {
    const a2 = triTwiceAreaQ(t[0], t[1], t[2]);
    sum += a2 < 0n ? -a2 : a2;
  }
  const want = twice < 0n ? -twice : twice;
  if (sum !== want) {
    throw new TypeError(
      `${label} is not an answerable footprint (exact triangulation identity failed)`,
    );
  }
  return tris;
}

/**
 * ⭐ The answerability seam, stated out loud. A ring the exact core cannot PROVE simple is
 * REFUSED by name rather than answered from a partial triangulation. The refusal is
 * conservative-exact: three named arms — degenerate (twice-area exactly zero), no admissible ear
 * (or the ear search exhausted), and the exactness identity failing — each with an executed
 * fixture behind it.
 * @param {IntegerRing} ring @param {string} label @returns {void}
 */
export function assertAnswerableFootprintQ(ring, label) {
  triangulateExactQ(ring, label);
}

/**
 * Clip a homogeneous BigInt polygon ([X, Y, W] with W > 0n) by the CCW edge a->b, keeping the
 * left half-plane. The side test `(b-a) x (p/W - a)` is scaled by W, so it stays a pure BigInt
 * sign; the crossing point is the homogeneous combination, re-normalised to W > 0n.
 * @param {HomogeneousPoint[]} poly
 * @param {bigint} ax @param {bigint} ay @param {bigint} bx @param {bigint} by
 * @returns {HomogeneousPoint[]}
 */
function clipByEdgeQ(poly, ax, ay, bx, by) {
  const ex = bx - ax;
  const ey = by - ay;
  /** @param {HomogeneousPoint} p @returns {bigint} */
  const side = (p) => ex * (p[1] - ay * p[2]) - ey * (p[0] - ax * p[2]);
  /** @type {HomogeneousPoint[]} */
  const out = [];
  for (let i = 0; i < poly.length; i += 1) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const dp = side(p);
    const dq = side(q);
    if (dp >= 0n) out.push(p);
    if ((dp > 0n && dq < 0n) || (dp < 0n && dq > 0n)) {
      let x = dp * q[0] - dq * p[0];
      let y = dp * q[1] - dq * p[1];
      let w = dp * q[2] - dq * p[2];
      if (w < 0n) { x = -x; y = -y; w = -w; }
      out.push([x, y, w]);
    }
  }
  return out;
}

/** Twice the area of a homogeneous BigInt polygon, as an exact rational.
 *  @param {HomogeneousPoint[]} poly @returns {ExactRatioQ} */
function polyTwiceAreaQ(poly) {
  let acc = exactRatioQ(0n, 1n);
  for (let i = 0; i < poly.length; i += 1) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    acc = ratAddQ(acc, exactRatioQ(p[0] * q[1] - q[0] * p[1], p[2] * q[2]));
  }
  return acc;
}

/** Twice the area shared by two CCW BigInt triangles, exactly.
 *  @param {BigTriangle} t @param {BigTriangle} u @returns {ExactRatioQ} */
function triPairTwiceAreaQ(t, u) {
  let poly = t.map(([x, y]) => /** @type {HomogeneousPoint} */ ([x, y, 1n]));
  for (let i = 0; i < 3; i += 1) {
    const a = u[i];
    const b = u[(i + 1) % 3];
    poly = clipByEdgeQ(poly, a[0], a[1], b[0], b[1]);
    if (poly.length < 3) return exactRatioQ(0n, 1n);
  }
  return polyTwiceAreaQ(poly);
}

/**
 * ⭐⭐ THE EXACT SHARED AREA of two integer footprint rings, in quanta squared.
 * An integer bounding-box fast reject answers `{0n, 1n}` first; otherwise both rings are
 * triangulated exactly (throwing typed if either cannot be proven simple) and every triangle
 * pair is clipped in homogeneous BigInt coordinates. An abutment — a shared edge or a shared
 * vertex — contributes EXACTLY zero, because zero is a value here rather than a threshold.
 * @param {IntegerRing} ringA @param {IntegerRing} ringB
 * @param {string} labelA @param {string} labelB @returns {ExactRatioQ}
 */
export function sharedFootprintAreaExactQ(ringA, ringB, labelA, labelB) {
  const ba = bounds(ringA);
  const bb = bounds(ringB);
  if (ba[2] <= bb[0] || bb[2] <= ba[0] || ba[3] <= bb[1] || bb[3] <= ba[1]) {
    return exactRatioQ(0n, 1n);
  }
  const ta = triangulateExactQ(ringA, labelA);
  const tb = triangulateExactQ(ringB, labelB);
  let acc = exactRatioQ(0n, 1n);
  for (const t of ta) {
    for (const u of tb) {
      acc = ratAddQ(acc, triPairTwiceAreaQ(t, u));
    }
  }
  return exactRatioQ(acc.numQ, acc.denQ * 2n);
}
