/**
 * domain/townMap/fabric/fabricGeometry.js — the fabric's deterministic geometry core.
 *
 * DETERMINISM CONTRACT (townMapModel.js's own law, one step stricter):
 *   • Only the CORRECTLY-ROUNDED IEEE-754 operations appear here: `+ - * /` and
 *     `Math.sqrt`. Each is bit-identical on every conforming platform, so a polygon
 *     computed on the owner's machine is byte-identical to one computed in CI.
 *   • NO Math.sin/cos/tan/atan2/exp/log/pow. Angles are integer indices into the frozen
 *     table in ./trigTable.js.
 *   • No Date, no Math.random, no localeCompare (the townMap domain source-scan).
 *
 * THE CONVEXITY INVARIANT — the single decision that removes a whole class of geometric
 * degeneracy. Every polygon this module SUBDIVIDES is convex: half-plane clipping
 * preserves convexity, a straight-line split preserves convexity, and a Voronoi cell
 * clipped inside a convex domain is convex. So inset, split, clip and Voronoi are all
 * exact and all built on ONE primitive (`clipHalfPlane`) — no general polygon-offset
 * degeneracies, no self-intersection repair, no epsilon fudging.
 *
 * ⚠⚠ AND THE SENTENCE ABOVE IS TRUE OF THE SUBDIVISION FAMILY AND WAS NEVER TRUE OF THE WHOLE
 * MODULE — MF-D0 (§287.12) records the correction rather than leaving it implied.
 * `offsetPolygonOutward` takes a NON-CONVEX outline by design, and a vertex-normal mitre on a
 * concave outline self-intersects the moment the offset exceeds the local feature size. That
 * exception now carries an explicit soundness law — the RING KERNEL below (`properCross`,
 * `ringSelfCrossings`, `simplifyRing`, `guardSimpleRing`) — instead of an unstated assumption
 * that no caller would ever hand it a shape that folds. Five of ten walled leaves did.
 *
 * ⭐ The ORGANIC RAGGED EDGE that makes the fabric read as a real town is therefore NOT
 * produced by subdividing non-convex shapes. It is produced by CULLING convex parcels
 * against the true non-convex settlement boundary — which is also, exactly, how a real
 * town's edge happens: regular plots, laid out to a grain, stopping where the ground or
 * the ownership stopped.
 */

import { TRIG_N, cosI, sinI } from './trigTable.js';

export { TRIG_N, cosI, sinI };

/** @typedef {[number, number]} Point */
/** @typedef {Point[]} Polygon */

/** Round to 2 decimals for emission — small files AND byte-stable output. */
export function r2(v) { return Math.round(v * 100) / 100; }

/**
 * ⭐⭐⭐ MF-ARCH-2 · THE TWO QUANTA, NAMED AND SEPARATED (§234's fixed-precision topology).
 *
 * A coordinate is written down for one of two reasons, and they want different precision:
 *
 *   • PAINT — what the lens strokes. `r2` above: two decimals on a 1000-unit leaf is a
 *     hundredth of a unit, far below any ink weight, and it is what keeps the SVG small.
 *     Paint coordinates are otherwise left FLOAT; nothing legal is decided from them.
 *   • TOPOLOGY — what a LAW is decided from and what a receipt is hashed over. Six decimals,
 *     applied at the moment of serialization, so "did this geometry change" is a question
 *     with one answer rather than a float comparison with a tolerance per caller.
 *
 * ⚠ THE QUANTUM IS A SERIALIZATION RULE, NOT A STORAGE RULE, AND THE DISTINCTION IS THE
 * WHOLE SCOPE OF THIS WAVE. Geometry is still carried as float and every law still decides on
 * floats; what is fixed is the text a hash is taken over. Quantizing the STORED legality
 * geometry moves every pixel in the corpus and owes its own equivalence proof — handed off.
 *
 * ⭐ IT LIVES HERE BECAUSE `wallCircuit.js` had a private `n6` and a private `polyText`, and a
 * private spelling of a shared rule is the defect class this programme keeps finding.
 */
export const TOPOLOGY_PLACES = 6;

/** One topology coordinate, canonically. `na` for a non-finite value — never `NaN`, which
 *  compares unequal to itself and would make a hash unstable against its own input. */
export function q6(v) { return Number.isFinite(v) ? v.toFixed(TOPOLOGY_PLACES) : 'na'; }

/** A polyline at topology precision, in its own vertex order. */
export function topoText(poly) { return (poly || []).map(([x, y]) => `${q6(x)},${q6(y)}`).join(';'); }

/** Signed polygon area (positive = counter-clockwise in the y-down view frame).
 * @param {Polygon} poly @returns {number} */
export function area(poly) {
  let a = 0;
  for (let i = 0, n = poly.length; i < n; i++) {
    const p = poly[i], q = poly[(i + 1) % n];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a / 2;
}

/** Unsigned polygon area. @param {Polygon} poly @returns {number} */
export function absArea(poly) { const a = area(poly); return a < 0 ? -a : a; }

/** Area-weighted centroid; falls back to the vertex mean for a degenerate ring.
 * @param {Polygon} poly @returns {Point} */
export function centroid(poly) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, n = poly.length; i < n; i++) {
    const p = poly[i], q = poly[(i + 1) % n];
    const f = p[0] * q[1] - q[0] * p[1];
    a += f; cx += (p[0] + q[0]) * f; cy += (p[1] + q[1]) * f;
  }
  if (a === 0) {
    let sx = 0, sy = 0;
    for (const p of poly) { sx += p[0]; sy += p[1]; }
    return [sx / poly.length, sy / poly.length];
  }
  return [cx / (3 * a), cy / (3 * a)];
}

/** Euclidean distance. @returns {number} */
export function dist(ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Clip a polygon by the half-plane { p : (p-o)·n <= 0 }. Sutherland-Hodgman against a
 * SINGLE half-plane — exact, and convexity-preserving. Returns null on collapse.
 * @param {Polygon|null} poly @param {number} ox @param {number} oy
 * @param {number} nx @param {number} ny @returns {Polygon|null}
 */
export function clipHalfPlane(poly, ox, oy, nx, ny) {
  if (!poly || poly.length < 3) return null;
  /** @type {Polygon} */
  const out = [];
  for (let i = 0, n = poly.length; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    const da = (a[0] - ox) * nx + (a[1] - oy) * ny;
    const db = (b[0] - ox) * nx + (b[1] - oy) * ny;
    if (da <= 0) out.push(a);
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const t = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out.length >= 3 ? out : null;
}

/** Clip one convex polygon by another, edge-by-edge.
 * @param {Polygon|null} subject @param {Polygon|null} clip @returns {Polygon|null} */
export function clipConvex(subject, clip) {
  if (!subject || !clip || clip.length < 3) return null;
  let out = subject;
  const ccw = area(clip) > 0;
  for (let i = 0, n = clip.length; i < n; i++) {
    const a = clip[i], b = clip[(i + 1) % n];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    out = clipHalfPlane(out, a[0], a[1], ccw ? ey : -ey, ccw ? -ex : ex);
    if (!out) return null;
  }
  return out;
}

/**
 * Inset a CONVEX polygon by `d` — each edge's half-plane pushed inward exactly `d`.
 * ⭐ This is the FABRIC LAW's primitive (§2.1): a street is not a drawn line, it is the
 * gap left when a block is inset. Every street in this fabric is an inset distance.
 * @param {Polygon|null} poly @param {number} d @returns {Polygon|null}
 */
export function insetConvex(poly, d) {
  if (!poly || poly.length < 3) return null;
  const ccw = area(poly) > 0;
  let out = poly;
  for (let i = 0, n = poly.length; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    const len = Math.sqrt(ex * ex + ey * ey);
    if (len === 0) continue;
    const nx = (ccw ? ey : -ey) / len;
    const ny = (ccw ? -ex : ex) / len;
    out = clipHalfPlane(out, a[0] - nx * d, a[1] - ny * d, nx, ny);
    if (!out) return null;
  }
  return out;
}

/** Split a convex polygon by the line through (ox,oy) with direction (dx,dy).
 * @returns {[Polygon|null, Polygon|null]} */
export function splitPolygon(poly, ox, oy, dx, dy) {
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return [poly, null];
  const nx = -dy / len, ny = dx / len;
  return [
    clipHalfPlane(poly, ox, oy, nx, ny),
    clipHalfPlane(poly, ox, oy, -nx, -ny),
  ];
}

/** Axis-aligned bounds [minX, minY, maxX, maxY].
 * @param {Polygon} poly @returns {[number, number, number, number]} */
export function bounds(poly) {
  let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
  for (const p of poly) {
    if (p[0] < a) a = p[0];
    if (p[1] < b) b = p[1];
    if (p[0] > c) c = p[0];
    if (p[1] > d) d = p[1];
  }
  return [a, b, c, d];
}

/** The polygon's widest axis as a unit vector plus its length.
 * @param {Polygon} poly @returns {{ dx: number, dy: number, len: number }} */
export function widestAxis(poly) {
  let best = -1, bx = 1, by = 0;
  for (let i = 0; i < poly.length; i++) {
    for (let j = i + 1; j < poly.length; j++) {
      const dx = poly[j][0] - poly[i][0], dy = poly[j][1] - poly[i][1];
      const d2 = dx * dx + dy * dy;
      if (d2 > best) { best = d2; const len = Math.sqrt(d2); bx = dx / len; by = dy / len; }
    }
  }
  return { dx: bx, dy: by, len: best > 0 ? Math.sqrt(best) : 0 };
}

/** The longest EDGE of a polygon — the edge a block fronts its street on.
 * @param {Polygon} poly @returns {{ i: number, len: number, dx: number, dy: number }} */
export function longestEdge(poly) {
  let best = { i: 0, len: -1, dx: 1, dy: 0 };
  for (let i = 0, n = poly.length; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    const len = Math.sqrt(ex * ex + ey * ey);
    if (len > best.len) best = { i, len, dx: ex / (len || 1), dy: ey / (len || 1) };
  }
  return best;
}

/** Even-odd point-in-polygon; works for any simple polygon, convex or not.
 * @param {number} px @param {number} py @param {Polygon} poly @returns {boolean} */
export function pointInPolygon(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if ((yi > py) !== (yj > py)) {
      const x = (xj - xi) * (py - yi) / (yj - yi) + xi;
      if (px < x) inside = !inside;
    }
  }
  return inside;
}

/** Andrew's monotone-chain convex hull. Deterministic: a numeric sort, no comparator
 * that could depend on locale. @param {Point[]} pts @returns {Polygon} */
export function convexHull(pts) {
  const p = pts.slice().sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
  if (p.length < 3) return p;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  /** @type {Polygon} */ const lower = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  /** @type {Polygon} */ const upper = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  lower.pop(); upper.pop();
  return lower.concat(upper);
}

/** Exact Voronoi cell of site i inside a convex domain: clip by every perpendicular
 * bisector. Convex in, convex out. @returns {Polygon|null} */
export function voronoiCell(domain, sites, i) {
  let cell = domain;
  const s = sites[i];
  for (let j = 0; j < sites.length; j++) {
    if (j === i) continue;
    const t = sites[j];
    const nx = t[0] - s[0], ny = t[1] - s[1];
    const len = Math.sqrt(nx * nx + ny * ny);
    if (len === 0) continue;
    cell = clipHalfPlane(cell, (s[0] + t[0]) / 2, (s[1] + t[1]) / 2, nx / len, ny / len);
    if (!cell) return null;
  }
  return cell;
}

/**
 * A star-shaped organic boundary: radius modulated by summed harmonics at seeded
 * phases. Non-convex by design — this is a hand-drawn edge, not a circle.
 * @param {number} cx @param {number} cy @param {number} radius
 * @param {{ int:(a:number,b:number)=>number, range:(a:number,b:number)=>number }} rng
 * @param {{ steps?: number, rough?: number }} [opts] @returns {Polygon}
 */
export function organicBlob(cx, cy, radius, rng, opts = {}) {
  const steps = opts.steps || 72;
  const rough = opts.rough == null ? 0.13 : opts.rough;
  const harmonics = [];
  for (let k = 0; k < 4; k++) {
    harmonics.push({
      freq: 2 + k * 2 + rng.int(0, 1),
      amp: rough * (1 / (k + 1)) * rng.range(0.6, 1.25),
      phase: rng.int(0, TRIG_N - 1),
    });
  }
  /** @type {Polygon} */ const pts = [];
  for (let i = 0; i < steps; i++) {
    const ang = Math.round((i * TRIG_N) / steps);
    let m = 1;
    for (const h of harmonics) m += h.amp * cosI(ang * h.freq + h.phase);
    const r = radius * m;
    pts.push([cx + r * cosI(ang), cy + r * sinI(ang)]);
  }
  return pts;
}

/**
 * The outline of a UNION OF DISCS, sampled radially from an interior origin.
 *
 * ⭐ THIS IS THE ACCRETION BOUNDARY (§5.0). A settlement grown as a chain of overlapping
 * lobes has a lumpy, asymmetric, path-dependent edge — never a circle. For each ray we
 * take the furthest exit reachable through a CONNECTED chain of discs, so a detached
 * lobe across a gap cannot inflate the outline (the gap is real: it is the green field
 * the town has not reached yet).
 *
 * Exact per ray, no trig: quadratic ray/circle intersection in + - * / sqrt.
 * @param {number} ox @param {number} oy
 * @param {Array<{x:number,y:number,r:number}>} discs @param {number} [steps]
 * @returns {Polygon}
 */
export function unionDiscOutline(ox, oy, discs, steps = 96) {
  /** @type {Polygon} */ const pts = [];
  for (let i = 0; i < steps; i++) {
    const ang = Math.round((i * TRIG_N) / steps);
    const ux = cosI(ang), uy = sinI(ang);
    /** @type {Array<[number, number]>} */ const spans = [];
    for (const d of discs) {
      const fx = d.x - ox, fy = d.y - oy;
      const b = fx * ux + fy * uy;
      const c2 = fx * fx + fy * fy - d.r * d.r;
      const disc = b * b - c2;
      if (disc <= 0) continue;
      const s = Math.sqrt(disc);
      const tFar = b + s;
      if (tFar <= 0) continue;
      spans.push([b - s, tFar]);
    }
    if (!spans.length) { pts.push([ox, oy]); continue; }
    spans.sort((a, b2) => a[0] - b2[0]);
    let reach = 0, grew = true;
    while (grew) {
      grew = false;
      for (const sp of spans) if (sp[0] <= reach && sp[1] > reach) { reach = sp[1]; grew = true; }
    }
    if (reach <= 0) reach = spans[0][1] > 0 ? spans[0][1] : 1;
    pts.push([ox + ux * reach, oy + uy * reach]);
  }
  return pts;
}

/**
 * Resample a closed polygon at N points of EQUAL ARC LENGTH.
 * Index-based subsampling of a radially-sampled outline is uneven whenever the shape is
 * elongated — a long ribbon arm gets the same sample count as the compact core, and a
 * wall built from it cuts straight chords across the arm.
 * @param {Polygon} poly @param {number} n @returns {Polygon}
 */
export function resampleClosed(poly, n) {
  const segs = [];
  let total = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const d = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
    segs.push(d); total += d;
  }
  if (total === 0) return poly.slice();
  /** @type {Polygon} */ const out = [];
  const step = total / n;
  let si = 0, acc = 0;
  for (let k = 0; k < n; k++) {
    const target = k * step;
    while (si < segs.length - 1 && acc + segs[si] < target) { acc += segs[si]; si++; }
    const a = poly[si], b = poly[(si + 1) % poly.length];
    const t = segs[si] > 0 ? (target - acc) / segs[si] : 0;
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

/* ════════════════════════════════════════════════════════════════════════════════════════
 * ⭐⭐⭐ §287.12 / SPEC §7.8 D0 · THE RING KERNEL — ONE HOME FOR "IS THIS RING SIMPLE, AND IF
 * NOT, WHAT IS THE RING THE MASON WOULD HAVE BUILT?"
 *
 * ⛔⛔ WHY IT EXISTS, WITH THE NUMBER. Five of ten walled leaves shipped a wall that crossed
 * itself (§274.3), and MEASURED stage by stage at MF-D0 the whole corpus's twelve crossing
 * segments come from exactly two producers: `offsetPolygonOutward` (8) and the wall trace's
 * terrain pull (4). `resampleClosed`, `chaikin`, the closure sweep and the half-ring filter
 * introduce ZERO. A ring that crosses itself does not bound a solid: extrude it and the wall
 * has no inside, light it and the silhouette is undefined — which is why the kernel is the
 * hard predecessor of every dimensional wave.
 *
 * ⭐⭐ THE LAW THIS OBEYS IS **EXCEPTION-ONLY** (§287.12 / SPEC §10.16(2)): *"preserve the
 * legacy simple-offset output exactly when valid; invoke a versioned robust repair only on
 * diagnosed invalid cases."* `guardSimpleRing` is therefore an IDENTITY on every ring that is
 * already simple — it returns the caller's own array, not a copy of it — so a leaf whose
 * geometry was never folded comes out BYTE-IDENTICAL. The declared shift is exactly the set of
 * rings the predicate convicts, and nothing else.
 *
 * ⚠ AND IT IS WHY THE MODULE DOCSTRING'S "no self-intersection repair" SENTENCE IS NOW
 * QUALIFIED RATHER THAN TRUE. That claim was written for, and still holds of, the CONVEX
 * subdivision family (`clipHalfPlane` and everything built on it). `offsetPolygonOutward` was
 * always the exception: it is the one primitive here that takes a NON-CONVEX outline, and a
 * vertex-normal mitre on a concave outline self-intersects the moment the offset exceeds the
 * local feature size. The exception now carries its own soundness law instead of a silence.
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * The crossing parameters of two segments, or null when they are parallel.
 * ⭐ THE ONE SPELLING. `groundLaw.properCross` was a second, byte-identical copy of this
 * arithmetic and the W2 self-crossing pin carried a third; SPEC §278's exit criteria name the
 * consolidation by name (*"`properCross` ONE exported home; the second spelling in
 * groundLaw.js is gone"*). The operation ORDER below is preserved character for character from
 * that spelling, so every §17 abutment decision it already governs is bit-identical.
 * @returns {{t:number,u:number}|null}
 */
function crossParams(a, b, c, d) {
  const r0 = b[0] - a[0], r1 = b[1] - a[1], s0 = d[0] - c[0], s1 = d[1] - c[1];
  const den = r0 * s1 - r1 * s0;
  if (den === 0) return null;
  const t = ((c[0] - a[0]) * s1 - (c[1] - a[1]) * s0) / den;
  const u = ((c[0] - a[0]) * r1 - (c[1] - a[1]) * r0) / den;
  return { t, u };
}

/** How near the ends of a segment a crossing may sit and still be called PROPER. */
export const CROSS_EPS = 1e-9;

/** A PROPER crossing — shared endpoints and collinear touching do not count, because those
 *  are what an abutment looks like. @returns {boolean} */
export function properCross(a, b, c, d) {
  const p = crossParams(a, b, c, d);
  if (p === null) return false;
  return p.t > CROSS_EPS && p.t < 1 - CROSS_EPS && p.u > CROSS_EPS && p.u < 1 - CROSS_EPS;
}

/**
 * ⭐⭐ THE PROVEN PREDICATE: how many PROPER crossings a closed ring has with itself.
 * Adjacent edges share an endpoint and are skipped, and so is the wrap-around pair (edge 0 and
 * edge m−1), for the same reason. This is the exact predicate the corpus census and the
 * standing test pin both ask — one question, one answer, one place.
 * @param {Polygon} poly @returns {number}
 */
export function ringSelfCrossings(poly) {
  const m = poly.length;
  if (m < 4) return 0;
  let c = 0;
  for (let i = 0; i < m; i++) {
    for (let j = i + 2; j < m; j++) {
      if (i === 0 && j === m - 1) continue;
      if (properCross(poly[i], poly[(i + 1) % m], poly[j], poly[(j + 1) % m])) c++;
    }
  }
  return c;
}

/** The excision may not run away: the crossing count strictly decreases each pass, so this is
 *  a safety rail rather than a convergence criterion, and the residual is REPORTED. */
export const SIMPLIFY_PASSES = 64;

/**
 * ⭐⭐⭐ THE VERSIONED ROBUST REPAIR — RESOLVE A SELF-CROSSING RING INTO A SIMPLE ONE.
 *
 * A ring that crosses itself at X is two closed loops joined at X. Cutting there gives loop A
 * (X, then the vertices between the two crossing edges) and loop B (X, then the rest). The
 * repair KEEPS THE LOOP THAT AGREES WITH THE ORIGINAL RING'S ORIENTATION and, among loops that
 * agree, the one with the larger area — which is exactly the outer boundary a mitre fold turns
 * inside out, and exactly the enclosing circuit when a long chord tangles the trace.
 *
 * ⚠ IT TERMINATES BY CONSTRUCTION, WHICH IS WHAT MAKES IT ADMISSIBLE IN A DETERMINISTIC
 * GENERATOR. Both loops are sub-curves of the original with two edges truncated at a point that
 * already lay on both, so no pass can CREATE a crossing; each pass resolves at least the pair it
 * cut. The scan order is fixed (lowest `i`, then lowest `j`), the arithmetic is `+ − × ÷` and
 * `Math.sqrt` only, and no random or clock value is read — so the repair is byte-reproducible.
 *
 * ⛔ AND IT IS NOT A SHRINK-TO-FIT. Nothing is scaled, smoothed or nudged by a tolerance: the
 * output is a subset of the input's own boundary plus the crossing points themselves.
 * @param {Polygon} poly
 * @returns {{ ring:Polygon, excised:number, before:number, after:number }}
 */
export function simplifyRing(poly) {
  const before = ringSelfCrossings(poly);
  if (before === 0) return { ring: poly, excised: 0, before: 0, after: 0 };
  const orient = area(poly) > 0 ? 1 : -1;
  /** @type {Polygon} */ let ring = poly.slice();
  let excised = 0;
  for (let pass = 0; pass < SIMPLIFY_PASSES; pass++) {
    const m = ring.length;
    let ci = -1, cj = -1, ct = 0;
    outer: for (let i = 0; i < m; i++) {
      for (let j = i + 2; j < m; j++) {
        if (i === 0 && j === m - 1) continue;
        const p = crossParams(ring[i], ring[(i + 1) % m], ring[j], ring[(j + 1) % m]);
        if (p === null) continue;
        if (p.t > CROSS_EPS && p.t < 1 - CROSS_EPS && p.u > CROSS_EPS && p.u < 1 - CROSS_EPS) {
          ci = i; cj = j; ct = p.t; break outer;
        }
      }
    }
    if (ci < 0) break;
    const a = ring[ci], b = ring[(ci + 1) % m];
    /** @type {Point} */ const X = [a[0] + (b[0] - a[0]) * ct, a[1] + (b[1] - a[1]) * ct];
    /** @type {Polygon} */ const A = [X, ...ring.slice(ci + 1, cj + 1)];
    /** @type {Polygon} */ const B = [X, ...ring.slice(cj + 1), ...ring.slice(0, ci + 1)];
    ring = pickLoop(A, B, orient);
    excised++;
  }
  ring = dropRepeats(ring);
  return { ring, excised, before, after: ringSelfCrossings(ring) };
}

/** Of the two loops a cut produces, the one the circuit actually is: orientation first, area
 *  second, loop A on an exact tie — a fixed rule, so the choice is never machine-dependent. */
function pickLoop(A, B, orient) {
  if (A.length < 3) return B;
  if (B.length < 3) return A;
  const aA = area(A), aB = area(B);
  const okA = (aA > 0 ? 1 : -1) === orient;
  const okB = (aB > 0 ? 1 : -1) === orient;
  if (okA && !okB) return A;
  if (okB && !okA) return B;
  const mA = aA < 0 ? -aA : aA, mB = aB < 0 ? -aB : aB;
  return mB > mA ? B : A;
}

/** A cut can land a crossing point on top of a vertex it already touched. A zero-length edge
 *  is not a defect the census can see, but it is one a downstream normal cannot survive. */
function dropRepeats(poly) {
  /** @type {Polygon} */ const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = out.length ? out[out.length - 1] : null;
    if (q && Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9) continue;
    out.push(p);
  }
  while (out.length > 3) {
    const f = out[0], l = out[out.length - 1];
    if (Math.abs(f[0] - l[0]) < 1e-9 && Math.abs(f[1] - l[1]) < 1e-9) out.pop(); else break;
  }
  return out.length >= 3 ? out : poly;
}

/**
 * ⭐⭐⭐ THE KERNEL'S ONE ACCESSOR, AND THE EXCEPTION-ONLY SWITCH ITSELF.
 * A ring that is already simple is returned UNCHANGED — the same array object, not a copy —
 * so every leaf whose geometry never folded is byte-identical to the sealed W2 base. Only a
 * ring the predicate convicts reaches the repair.
 * @param {Polygon} poly @returns {Polygon}
 */
export function guardSimpleRing(poly) {
  if (poly.length < 4) return poly;
  return ringSelfCrossings(poly) === 0 ? poly : simplifyRing(poly).ring;
}

/**
 * ⭐⭐ THE NUMBER OF PROPER CROSSINGS BETWEEN **TWO DIFFERENT** RINGS — the inter-ring predicate,
 * and it is a genuinely different law from `ringSelfCrossings`. A pair of rings can both be
 * perfectly simple and still cross each other, and every census the programme had was blind to
 * it: containment, §200, §232's straddlers and W2's concentricity pin are all satisfied by two
 * circuits that intersect. ⚠ Same `properCross` rule, so "crossing" means one thing everywhere.
 * @param {Polygon} A @param {Polygon} B @returns {number}
 */
export function ringPairCrossings(A, B) {
  let n = 0;
  for (let i = 0; i < A.length; i++) {
    const a = A[i], b = A[(i + 1) % A.length];
    for (let j = 0; j < B.length; j++) {
      if (properCross(a, b, B[j], B[(j + 1) % B.length])) n++;
    }
  }
  return n;
}

/** A hair inside the boundary, so a pulled vertex is INSIDE it rather than ON it. */
export const NEST_PAD = 1e-3;

/** How many pull rounds `nestInside` may take. A rail, not a convergence criterion. */
export const NEST_ROUNDS = 8;

/**
 * ⭐⭐⭐ **THE RING-NESTING LAW** (ODQ §301.5, ordered as a new named census after MF-D0's zoom
 * found the metropolis's circuits crossing each other): **A SUPERSEDED CIRCUIT LIES STRICTLY
 * INSIDE ITS SUCCESSOR.** A settlement does not un-build its fabric, so epoch k's defence is
 * enclosed by epoch k+1's — always, and a pair that intersects is not a pair of concentric
 * circuits, it is one wall drawn through another.
 *
 * ⛔⛔ WHAT WAS SHIPPING, MEASURED: the sealed W2 base carried **20** circuit-vs-circuit crossings
 * and MF-D0's kernel halved them to **10** as a side effect — `main.E2 × old-core.E1` 4 and
 * `old-core.E1 × old-core.E0` 6, both on the metropolis. **Nothing in the programme could see
 * them.** The self-intersection census asks about ONE ring at a time; W2's concentricity pin
 * compares radius PROFILES, which two intersecting rings can satisfy exactly.
 *
 * ⛔⛔⛔ **AND THE DIRECTION OF THE REPAIR IS NOT A DETAIL — THE OBVIOUS ONE IS FORBIDDEN, AND A
 * LANDED PIN CAUGHT IT.** My first spelling pulled the SUPERSEDED ring IN to clear its successor.
 * It reached 0 on the corpus and then red two pins at once: `§240.1` on the `chaotic` FIXTURE (a
 * ring pulled in no longer bounded its own epoch — **MF-D0's LAW L7 arriving on schedule: the
 * corpus is a SAMPLE**) and, decisively, **`§240.4`, the inertia seam — "adding a later ring must
 * not re-derive an earlier epoch"**. Making epoch k's geometry a function of epoch k+1's IS
 * re-derivation, and it is wrong on the history as well as on the pin: **a town that builds a new
 * outer wall does not go back and move its old one.**
 *
 * ⭐⭐⭐ SO THE LATER RING YIELDS TO THE EARLIER, WHICH IS BOTH THE HISTORY AND THE ONLY
 * INERTIA-SAFE DIRECTION: a ring may depend on epochs BEFORE it and never on epochs after it.
 * `traceWalls` therefore traces INNERMOST FIRST and each new circuit is grown around the one it
 * supersedes. Growing a ring can only ever help its own containment, so §240.1 is safe by
 * construction rather than by measurement.
 *
 * ⭐ WHY THE CURE IS AT THE RING AND NOT AT THE EPOCH BODY, WITH THE MEASUREMENT THAT DECIDED IT.
 * Asked at every stage of the trace (`laneMFW3F-irstage.log`, re-derived from the FINAL tip), the
 * crossings are **ALREADY THERE AT THE HULL** and the stages only ever reduce them:
 *
 *   body 112 · hull 24 · pull 8 · offset 6 · smooth 6 · bound 4 · traced 4 · nested 0
 *
 * **The epoch BODIES themselves cross 112 times.** The true upstream cause is that the epoch bodies
 * do not nest — a corpus-wide same-seed shift of every walled leaf's ground, RAISED rather than
 * taken here. ⚠ The pull's own re-aim (§301.6) is what carries `hull 24` down to `pull 8`; the
 * nest closes the last four. ⛔ AN EARLIER READING OF THIS SAME TABLE SAID `pull 22 … traced 10`
 * and was measured on a diagnostic tree that had drifted five files behind the tip — MF-D1 §15's
 * hazard, walked into while quoting it. **Re-derive the arm from the FINAL tip; do not trust a
 * diagnostic tree's isolation claim across an edit.**
 *
 * ⭐ IT IS EXCEPTION-ONLY, EXACTLY LIKE `guardSimpleRing`. A pair that already nests returns the
 * outer ring as **the same array object** — so every leaf whose circuits never crossed is
 * byte-identical — and only a pair the predicate convicts is touched.
 *
 * @param {Polygon} outer  the LATER circuit, the one that yields
 * @param {Polygon} inner  the circuit it supersedes, which does not move
 * @returns {Polygon} `outer` itself when the pair already nests
 */
export function nestAround(outer, inner) {
  if (!outer || !inner || outer.length < 3 || inner.length < 3) return outer;
  const pokes = (v) => !pointInPolygon(v[0], v[1], outer);
  if (!inner.some(pokes) && ringPairCrossings(inner, outer) === 0) return outer;
  let cur = outer;
  for (let round = 0; round < NEST_ROUNDS; round++) {
    let moved = 0;
    const next = cur.slice();
    // ── ARM 1 · A VERTEX OF THE SUPERSEDED RING STANDING OUTSIDE ITS SUCCESSOR pushes the
    //    successor's nearest edge out past it. The old wall does not move; the new one goes round.
    for (const v of inner) {
      if (pointInPolygon(v[0], v[1], next)) continue;
      let bi = 0, bd = Infinity, bq = null;
      for (let i = 0; i < next.length; i++) {
        const q = nearestOnSegment(next[i], next[(i + 1) % next.length], v[0], v[1]);
        const d = (q[0] - v[0]) * (q[0] - v[0]) + (q[1] - v[1]) * (q[1] - v[1]);
        if (d < bd) { bd = d; bi = i; bq = q; }
      }
      const d = Math.sqrt(bd);
      if (!bq || d < 1e-12) continue;
      const ux = (v[0] - bq[0]) / d, uy = (v[1] - bq[1]) / d;
      const shift = d + NEST_PAD;
      for (const idx of [bi, (bi + 1) % next.length]) {
        next[idx] = /** @type {Point} */ ([next[idx][0] + ux * shift, next[idx][1] + uy * shift]);
      }
      moved++;
    }
    // ── ⭐⭐ ARM 2 · AND THE SYMMETRIC CASE, WHICH ARM 1 ALONE CANNOT REACH. MEASURED on the
    //    first spelling: every vertex on the right side of the boundary and **six crossings
    //    still standing**, because one ring carries a re-entrant notch that dips through the
    //    other between their vertices. ⭐ THE CLASS: **"A ⊂ B" IS NOT ONE PREDICATE, AND A REPAIR
    //    THAT ENFORCES ONE HALF OF IT HALTS AT THE OTHER.** A successor vertex standing INSIDE
    //    the ring it supersedes comes out onto that ring's own boundary.
    for (let i = 0; i < next.length; i++) {
      const p = next[i];
      if (!pointInPolygon(p[0], p[1], inner)) continue;
      const q = nearestOnRingBoundary(inner, p[0], p[1]);
      const dx = q[0] - p[0], dy = q[1] - p[1];
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 1e-12) continue;
      const k = (d + NEST_PAD) / d;
      next[i] = /** @type {Point} */ ([p[0] + dx * k, p[1] + dy * k]);
      moved++;
    }
    // ⚠ THE PUSH CAN FOLD THE RING IT REPAIRS, so the kernel guard runs INSIDE the loop — the
    // same shape `boundEpoch`'s sweep uses, and for the same reason: a later round must be able
    // to re-push any vertex a repair exposed.
    cur = guardSimpleRing(next);
    if (!moved) break;
    if (!inner.some((v) => !pointInPolygon(v[0], v[1], cur)) && ringPairCrossings(inner, cur) === 0) break;
  }
  return cur;
}

/**
 * The nearest point ON a ring's boundary — over its EDGES, never over its vertices alone.
 * ⚠ A vertex-only search answers a different question: the nearest CORNER can be far from the
 * nearest point on the edge between two corners, and pushing to it would move a facet along the
 * boundary instead of across it.
 */
function nearestOnRingBoundary(poly, px, py) {
  let bx = poly[0][0], by = poly[0][1], bd = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const q = nearestOnSegment(poly[i], poly[(i + 1) % poly.length], px, py);
    const d = (px - q[0]) * (px - q[0]) + (py - q[1]) * (py - q[1]);
    if (d < bd) { bd = d; bx = q[0]; by = q[1]; }
  }
  return /** @type {Point} */ ([bx, by]);
}

/** The nearest point on ONE segment — the inner loop `nearestOnRingBoundary` and arm 2 share. */
function nearestOnSegment(a, b, px, py) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = dx * dx + dy * dy;
  let t = L > 0 ? ((px - a[0]) * dx + (py - a[1]) * dy) / L : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return /** @type {Point} */ ([a[0] + dx * t, a[1] + dy * t]);
}


/**
 * Offset a SIMPLE polygon outward by `d` along its own vertex normals, with a miter
 * clamp. Unlike a radial offset about some origin, this FOLLOWS the shape wherever it
 * goes — which is what "walls that bend around what was already there" (§5.0) actually
 * requires on an elongated or concave plan. The miter clamp matters: an accretion
 * outline carries deep notches between lobes, and an unclamped miter throws a long
 * spike out of each one. Masonry does not do that; a bevel does.
 *
 * ⭐⭐ §287.12 · AND IT CAN NO LONGER EMIT A RING THAT CROSSES ITSELF. The mitre is computed
 * exactly as it always was; `guardSimpleRing` then asks the one predicate and repairs ONLY a
 * folded result. MEASURED at MF-D0: this stage introduced 8 of the corpus's 12 self-crossing
 * circuit segments — metropolis E0/E1/E2, polycentric E1 and crossing E1 — and NOTHING else in
 * the corpus reaches the repair, which is what keeps the declared shift small.
 * @param {Polygon} poly @param {number} d @param {number} [miterLimit] @returns {Polygon}
 */
export function offsetPolygonOutward(poly, d, miterLimit = 2.6) {
  const n = poly.length;
  if (n < 3) return poly.slice();
  const ccw = area(poly) > 0;
  const en = [];
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    let ex = b[0] - a[0], ey = b[1] - a[1];
    const len = Math.sqrt(ex * ex + ey * ey) || 1;
    ex /= len; ey /= len;
    en.push(ccw ? [ey, -ex] : [-ey, ex]);
  }
  /** @type {Polygon} */ const out = [];
  for (let i = 0; i < n; i++) {
    const nPrev = en[(i - 1 + n) % n], nCur = en[i];
    let mx = nPrev[0] + nCur[0], my = nPrev[1] + nCur[1];
    const ml = Math.sqrt(mx * mx + my * my);
    if (ml < 1e-9) { out.push([poly[i][0] + nCur[0] * d, poly[i][1] + nCur[1] * d]); continue; }
    mx /= ml; my /= ml;
    const cosHalf = mx * nCur[0] + my * nCur[1];
    const scale = Math.min(miterLimit, 1 / Math.max(0.2, cosHalf));
    out.push([poly[i][0] + mx * d * scale, poly[i][1] + my * d * scale]);
  }
  return guardSimpleRing(out);
}

/** Chaikin corner-cutting: smooths a polyline/polygon into hand-drawn curves.
 * @param {Polygon} pts @param {number} [iterations] @param {boolean} [closed] */
export function chaikin(pts, iterations = 2, closed = false) {
  let cur = pts;
  for (let it = 0; it < iterations; it++) {
    /** @type {Polygon} */ const out = [];
    const n = cur.length;
    if (!closed) out.push(cur[0]);
    const limit = closed ? n : n - 1;
    for (let i = 0; i < limit; i++) {
      const a = cur[i], b = cur[(i + 1) % n];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
      out.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    if (!closed) out.push(cur[n - 1]);
    cur = out;
  }
  return cur;
}

/** Distance from a point to a segment. @returns {number} */
export function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const d2 = dx * dx + dy * dy;
  let t = d2 === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / d2;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const qx = ax + dx * t, qy = ay + dy * t;
  return Math.sqrt((px - qx) * (px - qx) + (py - qy) * (py - qy));
}

/** Minimum distance from a point to a polyline. @returns {number} */
export function distToPolyline(px, py, line) {
  let best = Infinity;
  for (let i = 0; i < line.length - 1; i++) {
    const d = distToSegment(px, py, line[i][0], line[i][1], line[i + 1][0], line[i + 1][1]);
    if (d < best) best = d;
  }
  return best;
}

/** Segment-segment intersection point, or null when they do not cross.
 * @returns {Point|null} */
export function segIntersect(a, b, c, d) {
  const r0 = b[0] - a[0], r1 = b[1] - a[1];
  const s0 = d[0] - c[0], s1 = d[1] - c[1];
  const den = r0 * s1 - r1 * s0;
  if (den === 0) return null;
  const t = ((c[0] - a[0]) * s1 - (c[1] - a[1]) * s0) / den;
  const u = ((c[0] - a[0]) * r1 - (c[1] - a[1]) * r0) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return [a[0] + r0 * t, a[1] + r1 * t];
}

/** Offset a polyline sideways by `d` (river banks, road kerbs).
 * @param {Polygon} line @param {number} d @returns {Polygon} */
export function offsetLine(line, d) {
  /** @type {Polygon} */ const out = [];
  for (let i = 0; i < line.length; i++) {
    const p = line[i];
    const q = line[Math.min(i + 1, line.length - 1)];
    const o = line[Math.max(i - 1, 0)];
    const dx = q[0] - o[0], dy = q[1] - o[1];
    const l = Math.sqrt(dx * dx + dy * dy) || 1;
    out.push([p[0] - (dy / l) * d, p[1] + (dx / l) * d]);
  }
  return out;
}

/**
 * ⭐⭐ THE BEARING OF A VECTOR, AS AN EXACT TRIG-TABLE INDEX — trig-free, and it is what
 * lets a derivation say "point this AT that" instead of "point this somewhere seeded".
 *
 * ⛔ WHY NOT `Math.atan2`. The cross-machine ULP law (townMapModel.js:17-20) bans runtime
 * trig outright: atan2 is not correctly rounded and two machines may disagree in the last
 * bit, which on a threshold is a different index and therefore a different drawing.
 * ⛔ AND WHY NOT THE DIAMOND ANGLE ALONE. `walls.angleBucket`'s L1 diamond angle is
 * MONOTONE in the true angle but not LINEAR in it: at 45° it is out by about a sixteenth of
 * a quadrant, ≈5.6°. That is invisible in a 32-bucket hull walk and visible the moment a
 * furlong claims to point at a village — the whole open-field claim (§16.2) is about the
 * bearing being TRUE, so an approximation would make the pin assert something the geometry
 * does not do.
 *
 * ⭐ THE CURE IS THE TABLE ITSELF. The diamond angle gives a starting index good to ±5%
 * of a turn; a bounded local scan then maximizes the dot product against the SAME frozen
 * cos/sin table every other consumer reads, so the answer is exact by construction and
 * identical on every machine. The scan window is a constant, so the cost is constant.
 *
 * @param {number} dx @param {number} dy
 * @returns {number} the trig index whose (cosI, sinI) is closest to the direction of (dx,dy)
 */
export function bearingIndex(dx, dy) {
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d === 0) return 0;
  const x = dx / d, y = dy / d;
  const ax = x < 0 ? -x : x, ay = y < 0 ? -y : y;
  const t = ax + ay > 0 ? ay / (ax + ay) : 0;
  const diamond = x >= 0 ? (y >= 0 ? t : 4 - t) : (y >= 0 ? 2 - t : 2 + t);
  const guess = Math.floor((diamond / 4) * TRIG_N);
  // ±TRIG_N/16 covers the diamond angle's worst-case error (a sixteenth of a quadrant)
  // with a wide margin, and the comparison is a plain dot product against the frozen table.
  const W = TRIG_N >> 4;
  let bestI = guess, bestDot = -2;
  for (let k = -W; k <= W; k++) {
    const i = ((guess + k) % TRIG_N + TRIG_N) % TRIG_N;
    const dot = cosI(i) * x + sinI(i) * y;
    // Strictly greater keeps the FIRST index on an exact tie, so the answer is a pure
    // function of the inputs and not of the scan's direction.
    if (dot > bestDot) { bestDot = dot; bestI = i; }
  }
  return bestI;
}

/** Rotate a point set about (cx,cy) by an integer angle index. @returns {Polygon} */
export function rotatePoints(pts, cx, cy, angleIndex) {
  const c = cosI(angleIndex), s = sinI(angleIndex);
  return pts.map(([x, y]) => {
    const dx = x - cx, dy = y - cy;
    return /** @type {Point} */ ([cx + dx * c - dy * s, cy + dx * s + dy * c]);
  });
}

/** An axis-aligned rectangle centred on (cx,cy), then rotated. @returns {Polygon} */
export function rectAt(cx, cy, w, h, angleIndex) {
  return rotatePoints([
    [cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2],
    [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2],
  ], cx, cy, angleIndex);
}

/** Aspect-ratio guard: is this polygon a sliver that reads as noise, not as a building?
 * The ratio is area over the square of the widest axis — a square scores 0.5, a 1:10
 * strip scores 0.1. @param {Polygon} poly @param {number} [floor] @returns {boolean} */
export function isSliver(poly, floor = 0.10) {
  const a = absArea(poly);
  if (a <= 0) return true;
  const w = widestAxis(poly);
  if (w.len <= 0) return true;
  return (a / (w.len * w.len)) < floor;
}

/** SVG path data for a closed polygon, coordinates rounded to 2dp. */
export function polyPath(poly) {
  let s = '';
  for (let i = 0; i < poly.length; i++) s += (i === 0 ? 'M' : 'L') + r2(poly[i][0]) + ' ' + r2(poly[i][1]);
  return s + 'Z';
}

/** SVG path data for an open polyline. */
export function linePath(pts) {
  let s = '';
  for (let i = 0; i < pts.length; i++) s += (i === 0 ? 'M' : 'L') + r2(pts[i][0]) + ' ' + r2(pts[i][1]);
  return s;
}

/**
 * ⭐⭐ THE Y-BANDED RING INDEX — an EXACT acceleration of even-odd containment, and it is
 * exact rather than approximate for a reason worth stating once.
 *
 * The crossing test `(yi > py) !== (yj > py)` is FALSE for every edge that does not span the
 * query's y, so such an edge contributes nothing to the parity. Bucketing edges by the band
 * of y they span and testing only the bands the query falls in therefore computes the SAME
 * parity from the SAME arithmetic on a subset that provably contains every contributing
 * edge. No tolerance, no quantization, no changed answer — which is what lets it sit under
 * a determinism law that forbids anything else.
 *
 * ⛔ WHY IT IS NEEDED (MF-B4, measured). Correcting the plot module (see streets.ladderWidths)
 * shrank it 2.2–2.8× at town and above, so the packer now evaluates roughly FIVE TIMES as
 * many candidate plots, each of which asks "is this in the sea?" and "is this in the town?"
 * against traced rings of several hundred vertices. Profiled on the coastal city: 836 ms in
 * `pointInRing` over the sea body and 779 ms in `insideAny` over the umbrella, out of a
 * 4.8 s build that had begun to time out a 5 s pin.
 *
 * @param {ReadonlyArray<Polygon>} rings
 * @param {number} [bands]
 * @returns {{ contains(x:number, y:number):boolean }}
 */
export function ringIndex(rings, bands = 64) {
  const list = (rings || []).filter((r) => r && r.length >= 3);
  if (!list.length) return { contains: () => false };
  let y0 = Infinity, y1 = -Infinity, x0 = Infinity, x1 = -Infinity;
  for (const r of list) {
    for (const p of r) {
      if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
      if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    }
  }
  const span = y1 - y0;
  if (!(span > 0)) return { contains: (x, y) => { for (const r of list) if (pointInPolygon(x, y, r)) return true; return false; } };
  const h = span / bands;
  // One bucket per (ring, band): the edges of that ring whose y-range meets the band.
  /** @type {Array<Array<Array<number>>>} */ const buckets = [];
  for (let k = 0; k < list.length; k++) {
    const perBand = new Array(bands);
    for (let b = 0; b < bands; b++) perBand[b] = [];
    const r = list[k];
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const yi = r[i][1], yj = r[j][1];
      const lo = yi < yj ? yi : yj, hi = yi < yj ? yj : yi;
      let b0 = Math.floor((lo - y0) / h), b1 = Math.floor((hi - y0) / h);
      if (b0 < 0) b0 = 0; if (b1 > bands - 1) b1 = bands - 1;
      if (b1 < 0 || b0 > bands - 1) continue;
      for (let b = b0; b <= b1; b++) perBand[b].push([r[i][0], yi, r[j][0], yj]);
    }
    buckets.push(perBand);
  }
  return {
    contains(x, y) {
      if (x < x0 || x > x1 || y < y0 || y > y1) return false;
      let b = Math.floor((y - y0) / h);
      if (b < 0) b = 0; else if (b > bands - 1) b = bands - 1;
      for (let k = 0; k < buckets.length; k++) {
        let inside = false;
        const edges = buckets[k][b];
        for (let e = 0; e < edges.length; e++) {
          const xi = edges[e][0], yi = edges[e][1], xj = edges[e][2], yj = edges[e][3];
          if ((yi > y) !== (yj > y)) {
            const qx = (xj - xi) * (y - yi) / (yj - yi) + xi;
            if (x < qx) inside = !inside;
          }
        }
        if (inside) return true;
      }
      return false;
    },
  };
}

/**
 * ⭐ THE SEGMENT HASH — the same exactness argument for polyline PROXIMITY.
 *
 * `forbiddenGround` bbox-guards each reserved polyline as a whole, so a candidate anywhere
 * near a quarter lane walks all ~90 of its points. Bucketing the SEGMENTS into a uniform
 * grid at the query radius means a candidate walks the handful of segments in its own cell
 * and its neighbours; every segment nearer than `r` is registered in a cell the query
 * visits, so the answer is identical. Profiled: 1,007 ms of a city build in `distToPolyline`.
 *
 * @param {Array<{ line:Array<Point>, half:number, [k:string]:any }>} items
 * @returns {{ near(x:number, y:number):boolean }}
 */
export function segmentHash(items) {
  let maxHalf = 0;
  for (const it of items) if (it.half > maxHalf) maxHalf = it.half;
  const cell = Math.max(6, maxHalf * 2);
  /** @type {Map<string, Array<number[]>>} */ const grid = new Map();
  const put = (k, seg) => { const b = grid.get(k); if (b) b.push(seg); else grid.set(k, [seg]); };
  for (const it of items) {
    const L = it.line;
    for (let i = 0; i + 1 < L.length; i++) {
      const ax = L[i][0], ay = L[i][1], bx = L[i + 1][0], by = L[i + 1][1];
      const seg = [ax, ay, bx, by, it.half];
      const lox = Math.floor((Math.min(ax, bx) - it.half) / cell);
      const hix = Math.floor((Math.max(ax, bx) + it.half) / cell);
      const loy = Math.floor((Math.min(ay, by) - it.half) / cell);
      const hiy = Math.floor((Math.max(ay, by) + it.half) / cell);
      for (let gy = loy; gy <= hiy; gy++) for (let gx = lox; gx <= hix; gx++) put(`${gx}|${gy}`, seg);
    }
  }
  return {
    near(x, y) {
      const b = grid.get(`${Math.floor(x / cell)}|${Math.floor(y / cell)}`);
      if (!b) return false;
      for (let i = 0; i < b.length; i++) {
        const s = b[i];
        if (distToSegment(x, y, s[0], s[1], s[2], s[3]) < s[4]) return true;
      }
      return false;
    },
  };
}

/* ───────────────────────────────────────────────────────────────────────────────
 * ⭐⭐⭐ MF-D1 · §287.5 / §299.3(a) · THE EXACT PLANAR LEGALITY CORE.
 *
 * ⛔ THE DEFECT THIS EXISTS FOR, NAMED BY THE CHAIR AT §299.3(a): the codex slice decides
 * volume legality **by identity** — a duplicate `buildingId`/`plotId` is refused and one plot
 * is forced to carry one body, so no solid ever meets another solid in arithmetic. §287.5 says
 * the opposite in terms: *"exact solid intersection, not XY/Z interval overlap, owns volume
 * legality."* An interval test says two bodies overlap when their SHADOWS overlap; an identity
 * test says they never do. Both are answers to a question nobody asked of the geometry.
 *
 * ⚠⚠ AND THE SANDBOX'S OWN ANSWER IS ALSO NOT THE LAW. `groundLaw.overlapping(A,B)` is a
 * BOOLEAN: shrink both rings toward their centroids by `TOUCH_EPS`, then test vertex-in-other
 * and proper edge crossings. It is fast, it is what §17 decides abutments with, and it is
 * PRESERVED BIT-FOR-BIT — this core does not replace it and nothing in the generation path
 * calls what follows. What it cannot do is say HOW MUCH: a census that reports "AREA-TRUE" needs
 * an area, and §273.6(c)'s sweep found six point-vs-area instances inside one wave, the sixth
 * inside the instrument that prints the words.
 *
 * ⭐⭐ THE ONE HOME. Every geometric-legality question routes through this module, exactly as
 * §287.12 routed `properCross` here: the intersection is built from `clipHalfPlane` — the
 * primitive that already decides every inset, split and Voronoi cell in the fabric — so a
 * change to what "clipped" means cannot mean two things in two files. Nothing below re-spells
 * the crossing determinant; `properCross` and `segIntersect` remain its only holders.
 *
 * ⭐ EXACTNESS, STATED AS THE ARITHMETIC IT IS. Only `+ − × ÷` appear. A triangle is convex, so
 * a triangle clipped by a triangle's three half-planes is EXACT Sutherland–Hodgman with no
 * degeneracy branch, and the shoelace of the result is the exact shared area of that pair. A
 * simple polygon is a disjoint union of ear-clipped triangles, so the pairwise sum is the exact
 * shared area of the two polygons. No epsilon decides an answer; no tolerance is tuned.
 * ─────────────────────────────────────────────────────────────────────────────── */

/** Is this ring convex? Sign-consistent turns, degenerate turns ignored. @param {Polygon} poly */
export function isConvexRing(poly) {
  if (!poly || poly.length < 3) return false;
  let sign = 0;
  for (let i = 0, n = poly.length; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n], c = poly[(i + 2) % n];
    const t = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    if (t === 0) continue;
    const s = t > 0 ? 1 : -1;
    if (sign === 0) sign = s; else if (s !== sign) return false;
  }
  return sign !== 0;
}

/** Strictly-inside barycentric test against a positively-oriented triangle. */
function inTriangleStrict(p, a, b, c) {
  const d1 = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  const d2 = (c[0] - b[0]) * (p[1] - b[1]) - (c[1] - b[1]) * (p[0] - b[0]);
  const d3 = (a[0] - c[0]) * (p[1] - c[1]) - (a[1] - c[1]) * (p[0] - c[0]);
  return d1 > 0 && d2 > 0 && d3 > 0;
}

/**
 * ⭐⭐ EAR CLIPPING, DETERMINISTIC BY CONSTRUCTION. The ring is walked in a fixed order and the
 * FIRST admissible ear is always taken, so the triangle list is a pure function of the vertex
 * sequence — no sort, no comparator, no tolerance. The ring is normalised to positive
 * orientation first so the convexity test has one sign.
 *
 * ⚠ A RING THAT CROSSES ITSELF HAS NO TRIANGULATION, and this returns what it managed rather
 * than looping — which is exactly why MF-D0's kernel had to land first: `guardSimpleRing` is
 * what makes every published ring a legal input here. `triangulationIsSound` below is the arm
 * that refuses to let a partial result be read as an area.
 * @param {Polygon} poly @returns {Array<[Point,Point,Point]>}
 */
export function triangulateSimple(poly) {
  if (!poly || poly.length < 3) return [];
  const n = poly.length;
  const idx = [];
  for (let i = 0; i < n; i++) idx.push(i);
  if (area(poly) < 0) idx.reverse();
  /** @type {Array<[Point,Point,Point]>} */ const tris = [];
  let guard = 0;
  while (idx.length > 3 && guard++ <= n * n + 16) {
    let cut = -1;
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length];
      const a = poly[ia], b = poly[ib], c = poly[ic];
      if ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) <= 0) continue;
      let clean = true;
      for (const j of idx) {
        if (j === ia || j === ib || j === ic) continue;
        if (inTriangleStrict(poly[j], a, b, c)) { clean = false; break; }
      }
      if (!clean) continue;
      tris.push([a, b, c]);
      cut = i;
      break;
    }
    if (cut < 0) break;
    idx.splice(cut, 1);
  }
  if (idx.length === 3) tris.push([poly[idx[0]], poly[idx[1]], poly[idx[2]]]);
  return tris;
}

/** Do the triangles account for the whole ring? The non-vacuity arm for every area below. */
export function triangulationIsSound(poly, tris, tol = 1e-6) {
  let sum = 0;
  for (const t of tris) sum += Math.abs(area(t));
  const want = absArea(poly);
  const d = sum - want;
  return (d < 0 ? -d : d) <= tol * (want > 1 ? want : 1);
}

/** Exact shared area of two TRIANGLES, via the fabric's own half-plane primitive. */
function triPairArea(t, u) {
  let out = t;
  const ccw = area(u) > 0;
  for (let i = 0; i < 3; i++) {
    const a = u[i], b = u[(i + 1) % 3];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    out = clipHalfPlane(out, a[0], a[1], ccw ? ey : -ey, ccw ? -ex : ex);
    if (!out) return 0;
  }
  return absArea(out);
}

/**
 * ⭐⭐⭐ THE AREA-TRUE PREDICATE. Exact shared area of two simple polygons, convex or not.
 * Returns 0 for a shared edge or a shared vertex — an ABUTMENT is not an overlap, which is
 * §17's own distinction and the reason a party wall is legal.
 * @param {Polygon} A @param {Polygon} B @returns {number}
 */
export function polygonIntersectionArea(A, B) {
  if (!A || !B || A.length < 3 || B.length < 3) return 0;
  const ba = bounds(A), bb = bounds(B);
  if (ba[2] <= bb[0] || bb[2] <= ba[0] || ba[3] <= bb[1] || bb[3] <= ba[1]) return 0;
  const ta = triangulateSimple(A), tb = triangulateSimple(B);
  let sum = 0;
  for (const t of ta) {
    const bt = bounds(t);
    for (const u of tb) {
      const bu = bounds(u);
      if (bt[2] <= bu[0] || bu[2] <= bt[0] || bt[3] <= bu[1] || bu[3] <= bt[1]) continue;
      sum += triPairArea(t, u);
    }
  }
  return sum;
}

/**
 * ⭐⭐ POINT LOCATION UNDER THE ABI'S DECLARED BOUNDARY RULE. `CoordinateAbi.boundaryRule` is
 * `'CLOSED'` (SPEC §10.4), so a point ON the boundary is IN the face and this returns it as its
 * own verdict rather than folding it into either side. A DCEL face census and a legality census
 * that disagree only about the boundary are two censuses, not one — L4's shape.
 * @returns {'INSIDE'|'BOUNDARY'|'OUTSIDE'}
 */
export function pointLocateRing(poly, px, py, eps = CROSS_EPS) {
  if (!poly || poly.length < 3) return 'OUTSIDE';
  for (let i = 0, n = poly.length; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    if (distToSegment(px, py, a[0], a[1], b[0], b[1]) <= eps) return 'BOUNDARY';
  }
  return pointInPolygon(px, py, poly) ? 'INSIDE' : 'OUTSIDE';
}
