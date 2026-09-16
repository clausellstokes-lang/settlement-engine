/**
 * domain/townMap/arch/gothicWindow.js -- K-0 SPIKE: ONE traceried gothic window.
 *
 * Hand-constructed in pure rational JS: a two-light lancet window under an equilateral
 * pointed enclosing arch, each light cusped with a trefoil, and a SEPTFOIL (7-cusp) oculus
 * in the head. This is the tracery-without-trig proof (kernel doc K-0 gate a):
 *   - the pointed arches + trefoils are CONSTRUCTIBLE -- they live entirely in the
 *     {sqrt2, sqrt3} closure (ARC60_HANDLE, KAPPA), so no table is even needed for them;
 *   - the oculus is a deliberate NON-constructible case: 7 is not a Fermat prime, so its
 *     ring cannot be derived without trig -- its 7 lobes are placed through the PINNED
 *     HEPTA_DIRS literal table (rationalTables.js). Together they prove the full vocabulary
 *     executes with ZERO runtime Math.cos/sin.
 *
 * Curves are CUBIC BEZIERS in model space only (never the SVG arc `A` command). The builder
 * emits its façade in a local (u right, v up) frame, then LIFTS every point onto the wall
 * plane at constant depth `place.oy`, elevation = v, east = u: (u, v) -> [ox+u, oy, oz+v].
 *
 * PURITY: {+, -, *, /} + Math.sqrt only (the transcendental-math ratchet holds this file at
 * 0 sites); deterministic -- same `place` -> byte-identical geometry.
 *
 * @typedef {import('./geom.js').P3} P3
 * @typedef {import('./geom.js').Subpath} Subpath
 * @typedef {import('./geom.js').Seg} Seg
 * @typedef {{ role: 'glass' | 'bar' | 'stone', width: number, sub: Subpath }} Region
 * @typedef {{ ox: number, oy: number, oz: number }} Place  wall placement (east, depth, base elevation)
 * @typedef {readonly [number, number]} UV  a façade point (u right, v up)
 */

import { SQRT3, KAPPA, ARC60_HANDLE, HEPTA_DIRS } from './rationalTables.js';

const HALF_SQRT3 = SQRT3 / 2;

/** Lift a façade (u, v) onto the wall plane. @param {Place} pl @param {number} u @param {number} v @returns {P3} */
function lift(pl, u, v) {
  return [pl.ox + u, pl.oy, pl.oz + v];
}

/**
 * The two cubic segments of an EQUILATERAL pointed arch over a light spanning [uL, uR] with
 * springline at v = vS. Both arcs are 60deg circle arcs drawn as one cubic each (handle =
 * ARC60_HANDLE * span). Returns the apex plus the two lifted segments (spring-left -> apex,
 * apex -> spring-right). Constructible: only SQRT3 appears.
 * @param {Place} pl @param {number} uL @param {number} uR @param {number} vS
 * @returns {{ apexU: number, apexV: number, up: Seg, down: Seg }}
 */
function pointedArch(pl, uL, uR, vS) {
  const s = uR - uL;
  const uA = (uL + uR) / 2;
  const vA = vS + s * HALF_SQRT3;
  const h = ARC60_HANDLE * s;
  /** @type {Seg} */
  const up = {
    t: 'C',
    c1: lift(pl, uL, vS + h),
    c2: lift(pl, uA - h * HALF_SQRT3, vA - h / 2),
    p: lift(pl, uA, vA),
  };
  /** @type {Seg} */
  const down = {
    t: 'C',
    c1: lift(pl, uA + h * HALF_SQRT3, vA - h / 2),
    c2: lift(pl, uR, vS + h),
    p: lift(pl, uR, vS),
  };
  return { apexU: uA, apexV: vA, up, down };
}

/**
 * A closed lancet LIGHT opening: rectangular jamb from the sill up to the springline, then
 * the pointed head. Returns the glass region subpath (closed).
 * @param {Place} pl @param {number} uL @param {number} uR @param {number} vSill @param {number} vSpring
 * @returns {Subpath}
 */
function lightOpening(pl, uL, uR, vSill, vSpring) {
  const arch = pointedArch(pl, uL, uR, vSpring);
  return {
    start: lift(pl, uL, vSill),
    segs: [
      { t: 'L', p: lift(pl, uL, vSpring) },
      arch.up,
      arch.down,
      { t: 'L', p: lift(pl, uR, vSill) },
      { t: 'L', p: lift(pl, uL, vSill) },
    ],
    closed: true,
  };
}

/**
 * A quarter-circle cubic from a point at angle a0 to a0+90 (given as unit dirs) about center
 * (cu, cv) radius r, in the façade frame; returns the cubic segment (lifted). The two dirs
 * are supplied as rational unit vectors so no trig is called.
 * @param {Place} pl @param {number} cu @param {number} cv @param {number} r
 * @param {UV} d0 unit dir of the start point @param {UV} d1 unit dir of the end point
 * @param {UV} t0 unit tangent at start (travel dir) @param {UV} t1 unit tangent at end
 * @returns {Seg}
 */
function quarterCubic(pl, cu, cv, r, d0, d1, t0, t1) {
  const hk = KAPPA * r;
  const p0u = cu + r * d0[0], p0v = cv + r * d0[1];
  const p1u = cu + r * d1[0], p1v = cv + r * d1[1];
  return {
    t: 'C',
    c1: lift(pl, p0u + hk * t0[0], p0v + hk * t0[1]),
    c2: lift(pl, p1u - hk * t1[0], p1v - hk * t1[1]),
    p: lift(pl, p1u, p1v),
  };
}

/**
 * A full circle as four quarter-circle cubics (the KAPPA construction), as a closed subpath
 * centered at (cu, cv) radius r. Used for the oculus outer ring and the light-head trefoils.
 * @param {Place} pl @param {number} cu @param {number} cv @param {number} r
 * @returns {Subpath}
 */
function circleSubpath(pl, cu, cv, r) {
  // Unit dirs at 0/90/180/270 and their CCW travel tangents -- exact rationals, no trig.
  /** @type {UV} */ const e = [1, 0];
  /** @type {UV} */ const n = [0, 1];
  /** @type {UV} */ const w = [-1, 0];
  /** @type {UV} */ const s = [0, -1];
  return {
    start: lift(pl, cu + r, cv),
    segs: [
      quarterCubic(pl, cu, cv, r, e, n, n, w),
      quarterCubic(pl, cu, cv, r, n, w, w, s),
      quarterCubic(pl, cu, cv, r, w, s, s, e),
      quarterCubic(pl, cu, cv, r, s, e, e, n),
    ],
    closed: true,
  };
}

/**
 * The SEPTFOIL oculus ring: 7 outward lobes placed by the PINNED HEPTA_DIRS table (no trig).
 * Each lobe is one cubic bulge between consecutive cusp points; the cusps point inward toward
 * the oculus center, giving the 7-fold rose. Returns the closed foil outline subpath.
 * @param {Place} pl @param {number} cu @param {number} cv @param {number} rOuter @param {number} rCusp
 * @returns {Subpath}
 */
function septfoil(pl, cu, cv, rOuter, rCusp) {
  /** cusp point k: on the inner circle at HEPTA_DIRS[k]. @param {number} k @returns {UV} */
  const cusp = (k) => {
    const d = HEPTA_DIRS[((k % 7) + 7) % 7];
    return [cu + (rCusp * d[0]) / 10000, cv + (rCusp * d[1]) / 10000];
  };
  /** lobe apex between cusp k and k+1: outward, at the average direction, radius rOuter. */
  const lobe = (/** @type {number} */ k) => {
    const a = HEPTA_DIRS[((k % 7) + 7) % 7];
    const b = HEPTA_DIRS[(((k + 1) % 7) + 7) % 7];
    const mu = (a[0] + b[0]) / 2, mv = (a[1] + b[1]) / 2;
    const m = Math.sqrt(mu * mu + mv * mv) || 1; // normalize the bisector (sqrt allowed)
    return /** @type {UV} */ ([cu + (rOuter * mu) / m, cv + (rOuter * mv) / m]);
  };
  const c0 = cusp(0);
  /** @type {Seg[]} */
  const segs = [];
  for (let k = 0; k < 7; k++) {
    const a = cusp(k), b = cusp(k + 1), apex = lobe(k);
    // one cubic bulging out through `apex`: pull both handles toward the apex.
    segs.push({
      t: 'C',
      c1: lift(pl, a[0] + (apex[0] - a[0]) * 1.1, a[1] + (apex[1] - a[1]) * 1.1),
      c2: lift(pl, b[0] + (apex[0] - b[0]) * 1.1, b[1] + (apex[1] - b[1]) * 1.1),
      p: lift(pl, b[0], b[1]),
    });
  }
  return { start: lift(pl, c0[0], c0[1]), segs, closed: true };
}

/**
 * Build ONE traceried gothic window on the wall plane at `place`. Fixed façade dimensions
 * (deterministic). Returns tagged regions in paint order: the enclosing arch stone plate,
 * then the recessed glass openings (2 lights + oculus), then the tracery BARS (mullion,
 * light rings, cusps, oculus foil) whose centerlines the raster shades as rounded stone.
 * @param {Place} place
 * @returns {{ regions: ReadonlyArray<Region>, width: number, height: number }}
 */
export function buildGothicWindow(place) {
  const W = 200;          // façade width
  const jamb = 16;        // outer stone frame thickness
  const vSill = 12;       // glass sill
  const vSpringMain = 214; // enclosing-arch springline
  const vSpringLight = 150; // light-head springline
  const mullionHalf = 7;  // half-thickness of the center mullion
  const uMid = W / 2;

  const innerL = jamb, innerR = W - jamb;
  const lightAL = innerL, lightAR = uMid - mullionHalf;
  const lightBL = uMid + mullionHalf, lightBR = innerR;

  /** @type {Region[]} */
  const regions = [];

  // (1) The enclosing pointed arch STONE PLATE: outer outline from sill up both jambs, over
  //     the main arch, back down. Filled as stone; the glass carves into it.
  const mainArch = pointedArch(place, innerL, innerR, vSpringMain);
  /** @type {Subpath} */
  const plate = {
    start: lift(place, innerL, vSill),
    segs: [
      { t: 'L', p: lift(place, innerL, vSpringMain) },
      mainArch.up,
      mainArch.down,
      { t: 'L', p: lift(place, innerR, vSill) },
      { t: 'L', p: lift(place, innerL, vSill) },
    ],
    closed: true,
  };
  regions.push({ role: 'stone', width: 0, sub: plate });

  // (2) The two recessed GLASS lights.
  regions.push({ role: 'glass', width: 0, sub: lightOpening(place, lightAL, lightAR, vSill, vSpringLight) });
  regions.push({ role: 'glass', width: 0, sub: lightOpening(place, lightBL, lightBR, vSill, vSpringLight) });

  // (3) The oculus: a glass disc, then its septfoil stone ring on top (bars).
  const ocU = uMid;
  const ocV = vSpringLight + 96;
  const ocR = 40;
  regions.push({ role: 'glass', width: 0, sub: circleSubpath(place, ocU, ocV, ocR - 4) });

  // (4) TRACERY BARS (rounded stone centerlines). Paint last, on top of the glass edges.
  const barW = 7;
  // the central mullion
  regions.push({ role: 'bar', width: barW, sub: {
    start: lift(place, uMid, vSill), segs: [{ t: 'L', p: lift(place, uMid, ocV - ocR) }], closed: false,
  } });
  // each light-head arch ring (spring-to-apex-to-spring), as a bar centerline
  for (const [uL, uR] of [[lightAL, lightAR], [lightBL, lightBR]]) {
    const a = pointedArch(place, uL, uR, vSpringLight);
    regions.push({ role: 'bar', width: barW, sub: { start: lift(place, uL, vSpringLight), segs: [a.up, a.down], closed: false } });
    // a trefoil cusp cluster inside the head: three small circles
    const cu = (uL + uR) / 2, spanR = (uR - uL) / 2;
    const cr = spanR * 0.28;
    regions.push({ role: 'bar', width: 3, sub: circleSubpath(place, cu, vSpringLight + spanR * 0.7, cr) });
    regions.push({ role: 'bar', width: 3, sub: circleSubpath(place, cu - spanR * 0.5, vSpringLight + spanR * 0.28, cr) });
    regions.push({ role: 'bar', width: 3, sub: circleSubpath(place, cu + spanR * 0.5, vSpringLight + spanR * 0.28, cr) });
  }
  // the septfoil oculus ring + its outer containing circle
  regions.push({ role: 'bar', width: 5, sub: circleSubpath(place, ocU, ocV, ocR) });
  regions.push({ role: 'bar', width: 4, sub: septfoil(place, ocU, ocV, ocR - 7, ocR - 18) });
  // the outer enclosing arch as a bar (crisp reveal edge)
  regions.push({ role: 'bar', width: 6, sub: { start: lift(place, innerL, vSpringMain), segs: [mainArch.up, mainArch.down], closed: false } });
  // the two jambs
  regions.push({ role: 'bar', width: 6, sub: { start: lift(place, innerL, vSill), segs: [{ t: 'L', p: lift(place, innerL, vSpringMain) }], closed: false } });
  regions.push({ role: 'bar', width: 6, sub: { start: lift(place, innerR, vSill), segs: [{ t: 'L', p: lift(place, innerR, vSpringMain) }], closed: false } });

  return { regions, width: W, height: Math.round(mainArch.apexV + 10) };
}
