/**
 * domain/townMap/arch/ornament/construct.js -- K-3 ORNAMENT: the parametric CONSTRUCTION ALGEBRA.
 *
 * THE GOTHIC ORNAMENT ALGEBRA, rung 2 of the kernel doc's three-rung stack (CORRECTION 1): the
 * curved-detail library that the split-grammar SKELETON provably cannot produce. It is the
 * Havemann-Fellner discipline -- CIRCLES + LINES + BOOLEANS (their intersections) -- expressed
 * ENTIRELY through {+, -, *, /, Math.sqrt} + the pinned N_GON_DIRS ring registry, so it is
 * byte-deterministic cross-engine even for the NON-constructible foil counts (7, 9), which cannot be
 * derived at runtime without trig (Gauss-Wantzel; kernel doc CORRECTION 2b). NO trig, ever.
 *
 * The four historical tracery families (plate, geometric/rayonnant, curvilinear/flamboyant,
 * perpendicular/rectilinear) are ONE construction algebra over these primitives (tracery.js composes
 * them). Every curve is a CUBIC BEZIER in the facade (u = east, v = up) frame (the BEZIER-ONLY-CURVES
 * law -- never the SVG arc `A` command); a ruleset LIFTS the returned polylines onto a wall plane at a
 * chosen depth z and sweeps a moulding profile along them (the K-1 profile-sweep terminal), so the bar
 * tracery is TRUE 3D depth, not a billboard.
 *
 * THE "BOOLEANS": constructive INTERSECTION points (circle-circle, circle-line, line-line) solved in
 * closed form with Math.sqrt -- NOT mesh CSG. Two arcs meet at a cusp; a rib lands where two circles
 * cross. That is the whole of the "boolean" vocabulary tracery needs, and it is exact + rational+sqrt.
 *
 * PURITY: {+,-,*,/} + Math.sqrt + the pinned KAPPA / ARC60_HANDLE / N_GON_DIRS; 0 transcendental
 * sites (the arch/ view-wall scan + the transcendental ratchet bind this file at 0).
 *
 * @typedef {readonly [number, number]} UV  a facade point (u = east, v = up)
 */

import { KAPPA, ARC60_HANDLE, SQRT3, N_GON_DIRS, ngonUnitDirs } from '../rationalTables.js';

const HALF_SQRT3 = SQRT3 / 2;

/** the cubic-Bezier circle constant scaled to a radius r (90-degree handle length). @param {number} r @returns {number} */
export function kappaHandle(r) { return KAPPA * r; }

// ── VECTOR + BOOLEAN (intersection) PRIMITIVES -- the algebra's atoms ─────────────────────────────

/** length of a 2D vector (Math.sqrt is the sanctioned exception). @param {number} x @param {number} y @returns {number} */
export function mag2(x, y) { return Math.sqrt(x * x + y * y); }

/** unit vector; [0,0] for a zero vector. @param {number} x @param {number} y @returns {UV} */
export function unit2(x, y) { const m = mag2(x, y); return m > 0 ? [x / m, y / m] : [0, 0]; }

/**
 * LINE-LINE intersection of the lines through (a0->a1) and (b0->b1). Returns the crossing point, or
 * null when parallel (zero cross). Pure {+,-,*,/}. @param {UV} a0 @param {UV} a1 @param {UV} b0 @param {UV} b1 @returns {UV|null}
 */
export function lineLine(a0, a1, b0, b1) {
  const ax = a1[0] - a0[0], ay = a1[1] - a0[1];
  const bx = b1[0] - b0[0], by = b1[1] - b0[1];
  const den = ax * by - ay * bx;
  if (den === 0) return null;
  const t = ((b0[0] - a0[0]) * by - (b0[1] - a0[1]) * bx) / den;
  return [a0[0] + ax * t, a0[1] + ay * t];
}

/**
 * CIRCLE-CIRCLE intersection (the load-bearing "boolean"): the two points where circles
 * (c0, r0) and (c1, r1) cross, solved with ONE Math.sqrt. Returns [] when they do not meet (or are
 * concentric). `side` picks the +/- root when only one is wanted. @param {UV} c0 @param {number} r0
 * @param {UV} c1 @param {number} r1 @returns {UV[]}
 */
export function circleCircle(c0, r0, c1, r1) {
  const dx = c1[0] - c0[0], dy = c1[1] - c0[1];
  const d = mag2(dx, dy);
  if (d === 0 || d > r0 + r1 || d < Math.abs(r0 - r1)) return [];
  const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
  const h2 = r0 * r0 - a * a;
  const h = h2 > 0 ? Math.sqrt(h2) : 0;
  const mx = c0[0] + (a * dx) / d, my = c0[1] + (a * dy) / d;
  const ox = -(dy / d) * h, oy = (dx / d) * h;
  return [[mx + ox, my + oy], [mx - ox, my - oy]];
}

/**
 * CIRCLE-LINE intersection: the points where the infinite line (p0->p1) crosses circle (c, r), with
 * one Math.sqrt. Returns [] when the line misses the circle. @param {UV} c @param {number} r
 * @param {UV} p0 @param {UV} p1 @returns {UV[]}
 */
export function circleLine(c, r, p0, p1) {
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
  const fx = p0[0] - c[0], fy = p0[1] - c[1];
  const aa = dx * dx + dy * dy;
  if (aa === 0) return [];
  const bb = 2 * (fx * dx + fy * dy);
  const cc = fx * fx + fy * fy - r * r;
  const disc = bb * bb - 4 * aa * cc;
  if (disc < 0) return [];
  const sq = Math.sqrt(disc);
  const t0 = (-bb - sq) / (2 * aa), t1 = (-bb + sq) / (2 * aa);
  return [[p0[0] + dx * t0, p0[1] + dy * t0], [p0[0] + dx * t1, p0[1] + dy * t1]];
}

// ── CUBIC EVALUATION (facade frame) ───────────────────────────────────────────────────────────────

/** evaluate a cubic in UV. @param {UV} p0 @param {UV} c1 @param {UV} c2 @param {UV} p3 @param {number} u @returns {UV} */
export function cubicUV(p0, c1, c2, p3, u) {
  const v = 1 - u, a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
  return [a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0], a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1]];
}

/** tessellate one cubic into `steps` chords (start included, end excluded unless last). @param {UV} p0 @param {UV} c1 @param {UV} c2 @param {UV} p3 @param {number} steps @param {boolean} includeEnd @returns {UV[]} */
export function tessCubic(p0, c1, c2, p3, steps, includeEnd) {
  const n = steps < 1 ? 1 : steps | 0;
  /** @type {UV[]} */ const out = [];
  const last = includeEnd ? n : n - 1;
  for (let k = 0; k <= last; k++) out.push(cubicUV(p0, c1, c2, p3, k / n));
  return out;
}

// ── CIRCLE + FOIL RINGS (the geometric/rayonnant family core) ─────────────────────────────────────

/**
 * A full circle centerline as four KAPPA quarter-cubics tessellated to `q` chords each. Closed
 * (the last vertex equals the first up to float, so callers treat it as a closed ring). This is the
 * exact same construction the K-1 cathedral rose ring uses -- centralized here for the K-3 families.
 * @param {number} cx @param {number} cy @param {number} r @param {number} q @returns {UV[]}
 */
export function circlePoints(cx, cy, r, q) {
  const hk = kappaHandle(r);
  /** @type {Array<[UV, UV, UV, UV]>} */ const quarters = [
    [[cx + r, cy], [cx + r, cy + hk], [cx + hk, cy + r], [cx, cy + r]],
    [[cx, cy + r], [cx - hk, cy + r], [cx - r, cy + hk], [cx - r, cy]],
    [[cx - r, cy], [cx - r, cy - hk], [cx - hk, cy - r], [cx, cy - r]],
    [[cx, cy - r], [cx + hk, cy - r], [cx + r, cy - hk], [cx + r, cy]],
  ];
  /** @type {UV[]} */ const pts = [];
  for (const [p0, c1, c2, p3] of quarters) for (const pt of tessCubic(p0, c1, c2, p3, q, false)) pts.push(pt);
  return pts;
}

/**
 * An n-FOIL ring centerline on the pinned N_GON_DIRS ring (the rose/oculus foliation). `n` cusps
 * point inward at radius `rCusp`; between each consecutive pair a cubic lobe bulges outward through a
 * point at radius `rLobe`. Generalizes the K-0 septfoil to EVERY pinned n (3..16), constructible or
 * not -- the non-constructible counts (7, 9) are exactly why the pinned table exists. Byte-identical
 * cross-engine (integer table + sqrt-normalized bisector). @param {number} cx @param {number} cy
 * @param {number} rCusp @param {number} rLobe @param {number} n @param {number} [bulge] @returns {UV[]}
 */
export function nFoilRing(cx, cy, rCusp, rLobe, n, bulge) {
  const dirs = N_GON_DIRS[n];
  if (!dirs) throw new Error(`arch/ornament: n-foil count ${n} is not in the pinned N_GON_DIRS registry`);
  const N = dirs.length, b = bulge === undefined ? 1.1 : bulge;
  /** @param {number} k @returns {UV} */
  const cusp = (k) => { const d = dirs[((k % N) + N) % N]; return [cx + (rCusp * d[0]) / 10000, cy + (rCusp * d[1]) / 10000]; };
  /** @param {number} k @returns {UV} the outward lobe apex on the bisector of cusp k -> k+1 */
  const lobe = (k) => {
    const a = dirs[((k % N) + N) % N], bd = dirs[(((k + 1) % N) + N) % N];
    const mu = (a[0] + bd[0]) / 2, mv = (a[1] + bd[1]) / 2, mm = mag2(mu, mv) || 1;
    return [cx + (rLobe * mu) / mm, cy + (rLobe * mv) / mm];
  };
  /** @type {UV[]} */ const pts = [];
  for (let k = 0; k < N; k++) {
    const a = cusp(k), c = cusp(k + 1), apex = lobe(k);
    /** @type {UV} */ const c1 = [a[0] + (apex[0] - a[0]) * b, a[1] + (apex[1] - a[1]) * b];
    /** @type {UV} */ const c2 = [c[0] + (apex[0] - c[0]) * b, c[1] + (apex[1] - c[1]) * b];
    for (const pt of tessCubic(a, c1, c2, c, 4, false)) pts.push(pt);
  }
  return pts;
}

/** the n cusp points (inward tips) of an n-foil ring -- the sub-light spoke landings. @param {number} cx @param {number} cy @param {number} rCusp @param {number} n @returns {UV[]} */
export function foilCusps(cx, cy, rCusp, n) {
  const dirs = ngonUnitDirs(n);
  return dirs.map((d) => /** @type {UV} */ ([cx + rCusp * d[0], cy + rCusp * d[1]]));
}

// ── ARCH FAMILIES (pointed / ogee / mouchette) ────────────────────────────────────────────────────

/**
 * An EQUILATERAL pointed arch polyline from spring-left (uL) up to the apex and down to spring-right
 * (uR), springline v = vS, as two 60-degree circle arcs (one cubic each, handle = ARC60_HANDLE).
 * Constructible: only SQRT3. @param {number} uL @param {number} uR @param {number} vS @param {number} steps @returns {UV[]}
 */
export function pointedArch(uL, uR, vS, steps) {
  const s = uR - uL, uMid = (uL + uR) / 2, apexV = vS + s * HALF_SQRT3, h = ARC60_HANDLE * s;
  /** @type {UV} */ const p0 = [uL, vS];
  /** @type {UV} */ const c1 = [uL, vS + h];
  /** @type {UV} */ const c2 = [uMid - h * HALF_SQRT3, apexV - h / 2];
  /** @type {UV} */ const p3 = [uMid, apexV];
  const left = tessCubic(p0, c1, c2, p3, steps, true);
  const mirror = uL + uR; /** @type {UV[]} */ const out = left.slice();
  for (let k = left.length - 2; k >= 0; k--) out.push([mirror - left[k][0], left[k][1]]);
  return out;
}

/**
 * An OGEE (S-curve) arch head -- the curvilinear/flamboyant signature. Each side rises from the
 * spring as a CONCAVE lower arc, inflects, then curves CONVEX to a sharp apex above the equilateral
 * height (a reflex "onion" point). Built from two cubics per side with rational + axis-derived
 * handles (no trig). @param {number} uL @param {number} uR @param {number} vS @param {number} rise
 * @param {number} steps @returns {UV[]}
 */
export function ogeeArch(uL, uR, vS, rise, steps) {
  const s = uR - uL, uMid = (uL + uR) / 2;
  const apexV = vS + s * HALF_SQRT3 + rise;   // above equilateral -> the onion point
  const vInf = vS + s * 0.42;                  // inflection height
  const uInf = uL + s * 0.30;                  // inflection horizontal (left side)
  const h = s * 0.28;
  // lower concave cubic: spring -> inflection (handles pull upward then inward)
  /** @type {UV} */ const l0 = [uL, vS];
  /** @type {UV} */ const l1 = [uL, vS + h];
  /** @type {UV} */ const l2 = [uInf - h * 0.5, vInf - h * 0.5];
  /** @type {UV} */ const l3 = [uInf, vInf];
  // upper convex cubic: inflection -> apex (handles carry the reflex over the top)
  /** @type {UV} */ const u1 = [uInf + h * 0.5, vInf + h * 0.5];
  /** @type {UV} */ const u2 = [uMid - h * 0.15, apexV - h * 0.2];
  /** @type {UV} */ const u3 = [uMid, apexV];
  /** @type {UV[]} */ const left = [];
  for (const p of tessCubic(l0, l1, l2, l3, steps, false)) left.push(p);
  for (const p of tessCubic(l3, u1, u2, u3, steps, true)) left.push(p);
  const mirror = uL + uR; /** @type {UV[]} */ const out = left.slice();
  for (let k = left.length - 2; k >= 0; k--) out.push([mirror - left[k][0], left[k][1]]);
  return out;
}

/**
 * A MOUCHETTE (curved dagger / comma) -- the flamboyant panel motif: a closed teardrop outline built
 * from a large outer arc and a smaller inner return meeting at a point, oriented by an integer index
 * into the pinned n-gon ring (no trig). Returned as a closed centerline. @param {number} cx
 * @param {number} cy @param {number} rOuter @param {number} rInner @param {number} n @param {number} kOrient @returns {UV[]}
 */
export function mouchette(cx, cy, rOuter, rInner, n, kOrient) {
  const dirs = N_GON_DIRS[n] || N_GON_DIRS[12];
  const N = dirs.length, k = ((kOrient % N) + N) % N;
  const d = dirs[k];
  const ax = d[0] / 10000, ay = d[1] / 10000;              // principal axis (unit, from the table)
  const px = -ay, py = ax;                                  // perpendicular (rational rotate 90)
  // tip is out along the axis; the body bulges to the perpendicular sides
  /** @type {UV} */ const tip = [cx + ax * rOuter, cy + ay * rOuter];
  /** @type {UV} */ const base = [cx - ax * rInner, cy - ay * rInner];
  /** @type {UV} */ const sideA = [cx + px * rOuter * 0.6, cy + py * rOuter * 0.6];
  /** @type {UV} */ const sideB = [cx - px * rOuter * 0.6, cy - py * rOuter * 0.6];
  const hk = rOuter * 0.55;
  /** @type {UV[]} */ const out = [];
  // base -> sideA (outer swell), sideA -> tip, tip -> sideB, sideB -> base (inner return)
  for (const p of tessCubic(base, [base[0] + px * hk, base[1] + py * hk], [sideA[0] - ax * hk, sideA[1] - ay * hk], sideA, 4, false)) out.push(p);
  for (const p of tessCubic(sideA, [sideA[0] + ax * hk, sideA[1] + ay * hk], [tip[0] + px * hk * 0.4, tip[1] + py * hk * 0.4], tip, 4, false)) out.push(p);
  for (const p of tessCubic(tip, [tip[0] - px * hk * 0.4, tip[1] - py * hk * 0.4], [sideB[0] + ax * hk, sideB[1] + ay * hk], sideB, 4, false)) out.push(p);
  for (const p of tessCubic(sideB, [sideB[0] - ax * hk, sideB[1] - ay * hk], [base[0] - px * hk, base[1] - py * hk], base, 4, false)) out.push(p);
  return out;
}

/**
 * A pointed arch to a SPECIFIED apex height (decouples apex from span -- the vault-rib case, where
 * ribs of different spans must meet at a common crown). Two cubics, vertical spring tangents, a sharp
 * apex; rational handle fractions of the span/height (no trig). @param {number} uL @param {number} uR
 * @param {number} vS @param {number} apexV @param {number} steps @returns {UV[]}
 */
export function archApex(uL, uR, vS, apexV, steps) {
  const span = uR - uL, uMid = (uL + uR) / 2, hh = apexV - vS;
  const k = hh * 0.55, m = span * 0.12, j = hh * 0.10;
  /** @type {UV} */ const p0 = [uL, vS];
  /** @type {UV} */ const c1 = [uL, vS + k];
  /** @type {UV} */ const c2 = [uMid - m, apexV - j];
  /** @type {UV} */ const p3 = [uMid, apexV];
  const left = tessCubic(p0, c1, c2, p3, steps, true);
  const mirror = uL + uR; /** @type {UV[]} */ const out = left.slice();
  for (let k2 = left.length - 2; k2 >= 0; k2--) out.push([mirror - left[k2][0], left[k2][1]]);
  return out;
}

/**
 * A pointed rib arch in the VERTICAL PLANE through two ground points a=[x,z] and b=[x,z], springing
 * at y = springY and apexing at the horizontal midpoint at y = crownY. Returns the full 3D centerline
 * a -> crown -> b (two cubics). The vault's diagonal + boundary ribs are these -- ribs of different
 * spans reach the SAME crown, so the diagonals meet at the boss. Pure {+,-,*,/} + sqrt (unit dir).
 * @param {UV} a @param {UV} b @param {number} springY @param {number} crownY @param {number} steps @returns {Array<[number,number,number]>}
 */
export function verticalArch3D(a, b, springY, crownY, steps) {
  const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2, hh = crownY - springY;
  const dx = b[0] - a[0], dz = b[1] - a[1], span = mag2(dx, dz) || 1;
  const ux = dx / span, uz = dz / span;               // horizontal unit dir a -> b
  const k = hh * 0.55, m = span * 0.12, j = hh * 0.10;
  /** @type {[number,number,number]} */ const A = [a[0], springY, a[1]];
  /** @type {[number,number,number]} */ const B = [b[0], springY, b[1]];
  /** @type {[number,number,number]} */ const C = [mx, crownY, mz];
  /** @type {[number,number,number]} */ const cA1 = [a[0], springY + k, a[1]];
  /** @type {[number,number,number]} */ const cA2 = [mx - ux * m, crownY - j, mz - uz * m];
  /** @type {[number,number,number]} */ const cB1 = [mx + ux * m, crownY - j, mz + uz * m];
  /** @type {[number,number,number]} */ const cB2 = [b[0], springY + k, b[1]];
  const n = steps < 1 ? 1 : steps | 0;
  /** @type {Array<[number,number,number]>} */ const out = [];
  const ev = (/** @type {[number,number,number]} */ p0, /** @type {[number,number,number]} */ c1, /** @type {[number,number,number]} */ c2, /** @type {[number,number,number]} */ p3, /** @type {boolean} */ includeEnd) => {
    const lastK = includeEnd ? n : n - 1;
    for (let s = 0; s <= lastK; s++) {
      const t = s / n, w = 1 - t, aa = w * w * w, bb = 3 * w * w * t, cc = 3 * w * t * t, dd = t * t * t;
      out.push([aa * p0[0] + bb * c1[0] + cc * c2[0] + dd * p3[0], aa * p0[1] + bb * c1[1] + cc * c2[1] + dd * p3[1], aa * p0[2] + bb * c1[2] + cc * c2[2] + dd * p3[2]]);
    }
  };
  ev(A, cA1, cA2, C, false);
  ev(C, cB1, cB2, B, true);
  return out;
}

/** lift a facade polyline onto a wall plane at depth z: (u,v) -> [u, v, z]. @param {ReadonlyArray<UV>} poly @param {number} z @returns {Array<[number,number,number]>} */
export function atZ(poly, z) { return poly.map((p) => /** @type {[number,number,number]} */ ([p[0], p[1], z])); }

/** a straight facade line as a 2-point polyline. @param {UV} a @param {UV} b @returns {UV[]} */
export function line(a, b) { return [a, b]; }
