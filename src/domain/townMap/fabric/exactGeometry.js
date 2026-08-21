/**
 * domain/townMap/fabric/exactGeometry.js — MF-T2B · THE FABRIC'S EXACT-GEOMETRY CORE.
 *
 * Ported from the sealed W3 sandbox tip's `fabricGeometry.js` (SHA-256
 * `c40c75b1fff4dd7393677f18e5b755dfb2a7fe17f4bc94a2a30f97621c78ed6e`). What arrives here is
 * NOT that module: it is the measured transitive closure the coordinate ABI and the first
 * D3a consumers actually need — nineteen declarations of its fifty-seven. A barrel hop drags
 * the whole family, so a port member ports the closure and never the module.
 *
 * DETERMINISM CONTRACT (one step stricter than the townMap domain scan):
 *   • Only the CORRECTLY-ROUNDED IEEE-754 operations appear here: `+ - * /` and `Math.sqrt`.
 *     Each is bit-identical on every conforming platform, so a polygon computed on one
 *     machine is byte-identical to one computed in CI.
 *   • NO Math.sin/cos/tan/atan2/exp/log/pow, no clock read, no RNG, no locale compare. ⚠ Named
 *     in the ABSTRACT on purpose: the determinism companion scans this file's RAW TEXT for the
 *     forbidden identifiers, and a scan a docstring can trigger is a scan someone widens.
 *
 * ⭐⭐ THE RENAME ODQ §310.3(7) ORDERED, EXECUTED AT THE PORT RATHER THAN IN A RETIRING TREE.
 * The sandbox carries TWO exports spelled `clipHalfPlane` with OPPOSITE conventions:
 * `fabricGeometry`'s keeps `(p-o)·n <= 0` and `groundLaw`'s keeps `(p-q)·n >= 0`, and
 * `groundLaw.js` says so in its own comment — the "obvious" reuse silently keeps the
 * COMPLEMENT of the ground it was asked for. The arriving clipper is therefore named for its
 * convention: `clipHalfPlaneAgainstNormal`. ⛔ The bare name `clipHalfPlane` is never declared
 * app-side; the later tranche's twin arrives as `clipHalfPlaneAlongNormal`.
 *
 * PURITY: pure. Every function is a function of its arguments alone.
 */

/** @typedef {[number, number]} Point */
/** @typedef {Point[]} Polygon */

/**
 * The fixed-precision topology quantum (§234): six decimals, applied at the moment of
 * serialization, so "did this geometry change" has one answer rather than a float comparison
 * with a tolerance per caller.
 */
export const TOPOLOGY_PLACES = 6;

/** One topology coordinate, canonically. `na` for a non-finite value — never `NaN`, which
 *  compares unequal to itself and would make a hash unstable against its own input.
 *  @param {number} v @returns {string} */
export function q6(v) { return Number.isFinite(v) ? v.toFixed(TOPOLOGY_PLACES) : 'na'; }

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

/** Distance from a point to a segment.
 * @param {number} px @param {number} py @param {number} ax @param {number} ay
 * @param {number} bx @param {number} by @returns {number} */
export function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const d2 = dx * dx + dy * dy;
  let t = d2 === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / d2;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const qx = ax + dx * t, qy = ay + dy * t;
  return Math.sqrt((px - qx) * (px - qx) + (py - qy) * (py - qy));
}

/**
 * The crossing parameters of two segments, or null when they are parallel.
 * ⭐ THE ONE SPELLING. The operation ORDER below is preserved character for character from
 * the sandbox's, so every abutment decision it already governs is bit-identical.
 * @param {Point} a @param {Point} b @param {Point} c @param {Point} d
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
 *  are what an abutment looks like.
 *  @param {Point} a @param {Point} b @param {Point} c @param {Point} d @returns {boolean} */
export function properCross(a, b, c, d) {
  const p = crossParams(a, b, c, d);
  if (p === null) return false;
  return p.t > CROSS_EPS && p.t < 1 - CROSS_EPS && p.u > CROSS_EPS && p.u < 1 - CROSS_EPS;
}

/** Segment-segment intersection point, or null when they do not cross.
 * @param {Point} a @param {Point} b @param {Point} c @param {Point} d @returns {Point|null} */
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
 * Clip a polygon by the half-plane { p : (p-o)·n <= 0 } — the half-plane AGAINST the normal.
 * Sutherland-Hodgman against a SINGLE half-plane: exact, and convexity-preserving. Returns
 * null on collapse. ⛔ The name carries the convention on purpose (see the header).
 * @param {Polygon|null} poly @param {number} ox @param {number} oy
 * @param {number} nx @param {number} ny @returns {Polygon|null}
 */
export function clipHalfPlaneAgainstNormal(poly, ox, oy, nx, ny) {
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

/** Strictly-inside barycentric test against a positively-oriented triangle.
 * @param {Point} p @param {Point} a @param {Point} b @param {Point} c @returns {boolean} */
function inTriangleStrict(p, a, b, c) {
  const d1 = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  const d2 = (c[0] - b[0]) * (p[1] - b[1]) - (c[1] - b[1]) * (p[0] - b[0]);
  const d3 = (a[0] - c[0]) * (p[1] - c[1]) - (a[1] - c[1]) * (p[0] - c[0]);
  return d1 > 0 && d2 > 0 && d3 > 0;
}

/**
 * ⭐⭐ EAR CLIPPING, DETERMINISTIC BY CONSTRUCTION. The ring is walked in a fixed order and
 * the FIRST admissible ear is always taken, so the triangle list is a pure function of the
 * vertex sequence — no sort, no comparator, no tolerance. The ring is normalised to positive
 * orientation first so the convexity test has one sign.
 *
 * ⚠ A RING THAT CROSSES ITSELF HAS NO TRIANGULATION, and this returns what it managed rather
 * than looping. `triangulationIsSound` below is the arm that refuses to let a partial result
 * be read as an area.
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

/** Do the triangles account for the whole ring? The non-vacuity arm for every area below.
 * @param {Polygon} poly @param {Array<[Point,Point,Point]>} tris @param {number} [tol]
 * @returns {boolean} */
export function triangulationIsSound(poly, tris, tol = 1e-6) {
  let sum = 0;
  for (const t of tris) sum += Math.abs(area(t));
  const want = absArea(poly);
  const d = sum - want;
  return (d < 0 ? -d : d) <= tol * (want > 1 ? want : 1);
}

/** Exact shared area of two TRIANGLES, via the fabric's own half-plane primitive.
 * @param {[Point,Point,Point]} t @param {[Point,Point,Point]} u @returns {number} */
function triPairArea(t, u) {
  /** @type {Polygon|null} */ let out = t;
  const ccw = area(u) > 0;
  for (let i = 0; i < 3; i++) {
    const a = u[i], b = u[(i + 1) % 3];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    out = clipHalfPlaneAgainstNormal(out, a[0], a[1], ccw ? ey : -ey, ccw ? -ex : ex);
    if (!out) return 0;
  }
  return absArea(out);
}

/**
 * ⭐⭐⭐ THE AREA-TRUE PREDICATE. Exact shared area of two simple polygons, convex or not.
 * Returns 0 for a shared edge or a shared vertex — an ABUTMENT is not an overlap, which is
 * the legality layer's own distinction and the reason a party wall is legal.
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
 * ⭐⭐ POINT LOCATION UNDER THE ABI'S DECLARED BOUNDARY RULE. `COORDINATE_ABI.boundaryRule` is
 * `'CLOSED'`, so a point ON the boundary is IN the face and this returns it as its own
 * verdict rather than folding it into either side. A face census and a legality census that
 * disagree only about the boundary are two censuses, not one.
 * @param {Polygon} poly @param {number} px @param {number} py @param {number} [eps]
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
