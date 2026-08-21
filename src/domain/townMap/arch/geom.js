/**
 * domain/townMap/arch/geom.js -- K-0 SPIKE: pure geometry helpers.
 *
 * The shared vocabulary the window / buttress builders emit and the projector + rasterizer
 * consume. A SUBPATH is a start point plus an ordered list of SEGMENTS; a segment is either
 * a straight `L` (line to a point) or a cubic `C` (two control points + an end point). NO
 * arc primitive exists -- every curve is a cubic Bezier (the BEZIER-ONLY-CURVES law).
 * Points are 3D [x, y, z] in model space (x = east, y = north/depth, z = up/elevation) so
 * the same subpath projects through the cavalier transform unchanged.
 *
 * PURITY: {+, -, *, /} and Math.sqrt/min/max/abs/floor only -- no trig, no Math.random, no
 * Date (the transcendental-math ratchet + the townMap purity scan bind this file).
 *
 * @typedef {readonly [number, number, number]} P3  a model-space point (x, y, z)
 * @typedef {readonly [number, number]} P2  a projected screen point (x, y)
 * @typedef {{ t: 'L', p: P3 }} SegL  a straight segment to p
 * @typedef {{ t: 'C', c1: P3, c2: P3, p: P3 }} SegC  a cubic Bezier to p via handles c1, c2
 * @typedef {SegL | SegC} Seg
 * @typedef {{ start: P3, segs: ReadonlyArray<Seg>, closed: boolean }} Subpath
 */

/**
 * Evaluate a cubic Bezier at parameter u in [0, 1] between p0 and p3 with handles c1, c2.
 * de Casteljau via the Bernstein form -- pure polynomial arithmetic, no transcendental.
 * @param {P3} p0 @param {P3} c1 @param {P3} c2 @param {P3} p3 @param {number} u
 * @returns {[number, number, number]}
 */
export function cubicAt(p0, c1, c2, p3, u) {
  const v = 1 - u;
  const a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
  return [
    a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0],
    a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1],
    a * p0[2] + b * c1[2] + c * c2[2] + d * p3[2],
  ];
}

/**
 * Flatten one subpath to a closed ring of 3D vertices, subdividing each cubic into `steps`
 * chords (a fixed count -> deterministic tessellation). Straight segments contribute one
 * vertex. The returned ring omits the duplicate closing vertex.
 * @param {Subpath} sub
 * @param {number} steps cubic subdivision count (>= 1)
 * @returns {Array<[number, number, number]>}
 */
export function flattenSubpath(sub, steps) {
  const n = steps < 1 ? 1 : steps | 0;
  /** @type {Array<[number, number, number]>} */
  const out = [[sub.start[0], sub.start[1], sub.start[2]]];
  let cur = sub.start;
  for (const seg of sub.segs) {
    if (seg.t === 'L') {
      out.push([seg.p[0], seg.p[1], seg.p[2]]);
      cur = seg.p;
    } else {
      for (let k = 1; k <= n; k++) out.push(cubicAt(cur, seg.c1, seg.c2, seg.p, k / n));
      cur = seg.p;
    }
  }
  return out;
}

/**
 * Signed area (shoelace) of a 2D ring; positive when the vertices wind counter-clockwise
 * in a y-down screen frame is orientation-dependent, so callers use only its sign/magnitude.
 * @param {ReadonlyArray<P2>} ring
 * @returns {number}
 */
export function ringArea2(ring) {
  let s = 0;
  for (let i = 0, n = ring.length; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
}

/**
 * Point-in-polygon (even-odd ray cast) for a 2D ring. Pure comparisons + one division.
 * @param {number} px @param {number} py @param {ReadonlyArray<P2>} ring
 * @returns {boolean}
 */
export function pointInRing(px, py, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1, n = ring.length; i < n; j = i++) {
    const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
    const crosses = (yi > py) !== (yj > py);
    if (crosses) {
      const xint = xi + ((py - yi) / (yj - yi)) * (xj - xi);
      if (px < xint) inside = !inside;
    }
  }
  return inside;
}

/**
 * Squared distance from point (px, py) to the segment (ax, ay)-(bx, by), plus the clamped
 * projection parameter tt in [0, 1]. Used by the rounded-bar shader to build a tube normal
 * from the medial axis. Pure {+, -, *, /}.
 * @param {number} px @param {number} py @param {number} ax @param {number} ay @param {number} bx @param {number} by
 * @returns {{ d2: number, tt: number, cx: number, cy: number }}
 */
export function distToSeg2(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  let tt = ((px - ax) * dx + (py - ay) * dy) / len2;
  tt = tt < 0 ? 0 : tt > 1 ? 1 : tt;
  const cx = ax + tt * dx, cy = ay + tt * dy;
  const ex = px - cx, ey = py - cy;
  return { d2: ex * ex + ey * ey, tt, cx, cy };
}

/**
 * Axis-aligned bounds of a 2D ring, integer-floored/ceiled for scanline iteration.
 * @param {ReadonlyArray<P2>} ring
 * @returns {{ minX: number, minY: number, maxX: number, maxY: number }}
 */
export function ringBounds(ring) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of ring) {
    if (p[0] < minX) minX = p[0];
    if (p[0] > maxX) maxX = p[0];
    if (p[1] < minY) minY = p[1];
    if (p[1] > maxY) maxY = p[1];
  }
  return { minX: Math.floor(minX), minY: Math.floor(minY), maxX: Math.ceil(maxX), maxY: Math.ceil(maxY) };
}

/**
 * Deterministic integer hash of two integers into a unit float [0, 1) -- FNV-1a over the
 * two coordinates (the massing.js hashUnit idiom, integer-only). Drives the procedural
 * stone grain / weathering with no Math.random.
 * @param {number} x @param {number} y @param {number} salt
 * @returns {number}
 */
export function hash2(x, y, salt) {
  let h = 2166136261 ^ (salt >>> 0);
  h = (Math.imul(h, 16777619) ^ (x | 0)) >>> 0;
  h = (Math.imul(h, 16777619) ^ (y | 0)) >>> 0;
  h = (Math.imul(h, 16777619) ^ ((x * 3 + y * 7 + salt) | 0)) >>> 0;
  return (h >>> 0) / 4294967296;
}
