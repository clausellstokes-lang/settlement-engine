/**
 * domain/townMap/fabric/reservedGround.js — ⭐⭐⭐ THE ONE ANSWER TO "DOES THIS BODY STAND IN
 * RESERVED GROUND?" (owner catch ODQ §230, chair directive §234's shared-object construction).
 *
 * ⛔⛔ WHAT WAS WRONG, MEASURED BEFORE THIS MODULE EXISTED, AND IT IS THE §195.0 VACUITY CLASS
 * IN ITS PUREST FORM. Both the LAW (`groundLaw.clipOutOfStreets`, `groundLaw.deepestClaim`) and
 * every CENSUS that audits it asked the same question the same way:
 *
 *     for (const p of body.polygon) — measure THIS VERTEX against the claim's centreline.
 *
 * A claim is a CENTRELINE with a half-width. A body whose every vertex lies further from the
 * centreline than that half-width, but which the centreline passes THROUGH, scores a NEGATIVE
 * penetration at every vertex and is certified clean — by the law, and then again by the census
 * built to check the law. MEASURED on the b8 corpus with the vertex predicate and with an
 * area-true one, over the same 22,934 drawn bodies and the same claim objects:
 *
 *     surface                     census as written   area-true
 *     §17.4 street carriageways           0             1,299
 *     §205A water claims                  0                13
 *     §200  wall bands                    0               190
 *
 * The owner saw one of the 190 in the b8 town zoom — a wall crossing a back-house whose four
 * corners stand 5.37, 7.88, 10.25 and 10.68 units from a claim whose half-width is 4.35.
 *
 * ⭐⭐⭐ THE CLASS, AND IT IS THE ONE TO BANK: **A CLAIM NARROWER THAN THE BODY THAT CROSSES IT
 * IS INVISIBLE TO A VERTEX-SAMPLED PREDICATE — AND A CENSUS THAT INHERITS THE LAW'S OWN
 * PREDICATE CANNOT REFUTE THE LAW.** Sharing the GEOMETRY between the lens and the census
 * (§230's mutual-bounding fix) is necessary and not sufficient: the b8 wall census consumed the
 * exact object the lens drew — proven here by hash — and still read zero. What must also be
 * shared is ONE PROVEN PREDICATE, and what must NOT be shared is the census's evidence: the
 * census measures the DRAWN output and carries a planted-body counterfactual that must red.
 *
 * ⭐ THE PREDICATE IS ABOUT AREA BECAUSE THE LAW IS. "A footprint may not stand in a
 * carriageway" is a statement about the ground the building covers, so the distance that
 * matters is SEGMENT-TO-POLYGON, not segment-to-vertex: zero when the claim crosses an edge,
 * zero when the claim runs inside the body, and the true nearest approach otherwise.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare. Deterministic ordering.
 */

/**
 * The tolerance at which "touching" stops being touching. §17 wants ABUTMENT to be legal, so
 * the test cannot be exact equality on floating point; §17.4 wants facades ON the street line,
 * so it cannot be generous either. 0.02 view units is two orders of magnitude below the
 * thinnest ink line the folio draws (0.26), so nothing this tolerance permits is visible.
 */
export const TOUCH_EPS = 0.02;

/**
 * The census's own epsilon — the ink epsilon, one order coarser than the law's, because a
 * census stricter than the constraint it audits convicts every legal abutment.
 */
export const PENETRATION_EPS = 0.15;

/** Closest point on a segment to a point, with the squared distance. */
export function nearestOnSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const L = dx * dx + dy * dy;
  let t = L > 0 ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
  if (t < 0) t = 0; else if (t > 1) t = 1;
  const qx = ax + dx * t, qy = ay + dy * t;
  return { qx, qy, d2: (px - qx) * (px - qx) + (py - qy) * (py - qy) };
}

function segPointDist(ax, ay, bx, by, px, py) {
  return Math.sqrt(nearestOnSeg(px, py, ax, ay, bx, by).d2);
}

/**
 * ⭐⭐ THE CLOSEST APPROACH OF TWO SEGMENTS — the POINT on AB nearest CD, and the distance.
 * `segSegDist` is this function's distance; they are ONE implementation because a census that
 * asks "do these two run together" and then "where" must not answer from two spellings.
 * @returns {{x:number, y:number, d:number}}
 */
export function segSegClosest(ax, ay, bx, by, cx, cy, dx2, dy2) {
  const den = (bx - ax) * (dy2 - cy) - (by - ay) * (dx2 - cx);
  if (den !== 0) {
    const t = ((cx - ax) * (dy2 - cy) - (cy - ay) * (dx2 - cx)) / den;
    const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / den;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t, d: 0 };
  }
  // Four candidates: each endpoint against the other segment. The winner's point is taken ON
  // AB, because the caller asks about AB (a street's crossing point, not the river's).
  let best = Infinity, bx2 = ax, by2 = ay;
  const take = (px, py, d) => { if (d < best) { best = d; bx2 = px; by2 = py; } };
  {
    const r = nearestOnSeg(cx, cy, ax, ay, bx, by); take(r.qx, r.qy, Math.sqrt(r.d2));
  }
  {
    const r = nearestOnSeg(dx2, dy2, ax, ay, bx, by); take(r.qx, r.qy, Math.sqrt(r.d2));
  }
  {
    const r = nearestOnSeg(ax, ay, cx, cy, dx2, dy2); take(ax, ay, Math.sqrt(r.d2));
  }
  {
    const r = nearestOnSeg(bx, by, cx, cy, dx2, dy2); take(bx, by, Math.sqrt(r.d2));
  }
  return { x: bx2, y: by2, d: best };
}

/** Distance between two segments — exactly 0 when they properly cross. */
export function segSegDist(ax, ay, bx, by, cx, cy, dx2, dy2) {
  return segSegClosest(ax, ay, bx, by, cx, cy, dx2, dy2).d;
}

/**
 * ⭐⭐⭐ HOW MUCH OF A BODY'S **AREA** LIES ON GROUND A LATTICE ASSIGNS TO `own` — the second
 * area-true answer this module owns, and it exists because §203's containment census said
 * "MAJORITY AREA" in its own comment and then counted CORNERS.
 *
 * ⛔ MEASURED, corner-count against true area over the b8b corpus: **444 bodies convicted by
 * the corner count, 251 by the area, and 229 bodies where the two DISAGREE** — 211 acquitted
 * by area that the corners convicted, 18 the other way. A burgage plot is about 4 × 10 units
 * and the partition cell is 1000/128 ≈ 7.8, so a plot spans one to four cells and its four
 * corners can easily land in a distribution its bulk does not share.
 * ⭐ THE CLASS: **A PREDICATE WHOSE NAME SAYS "AREA" AND WHOSE BODY COUNTS VERTICES IS THE
 * §230 DEFECT WITH A DOCSTRING** — the comment is the specification and the code refutes it.
 *
 * It is EXACT, not sampled: the body is clipped to each lattice cell it touches and the clipped
 * areas are attributed to that cell's owner. Cells are visited in ascending (j, i) order so the
 * floating-point accumulation is byte-stable.
 *
 * @param {number[][]} poly
 * @param {number} cell  the lattice pitch
 * @param {(x:number,y:number)=>number} ownerOf  read at the CELL CENTRE, never at a vertex
 * @param {number} own
 * @returns {{ inside:number, total:number, share:number }}
 */
export function latticeAreaShare(poly, cell, ownerOf, own) {
  const bb = bbox(poly);
  const i0 = Math.floor(bb.x0 / cell), i1 = Math.floor(bb.x1 / cell);
  const j0 = Math.floor(bb.y0 / cell), j1 = Math.floor(bb.y1 / cell);
  let inside = 0, total = 0;
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const x0 = i * cell, y0 = j * cell, x1 = x0 + cell, y1 = y0 + cell;
      let p = poly;
      p = clipRect(p, x0, y0, 1, 0);      // x >= x0
      p = clipRect(p, x1, y0, -1, 0);     // x <= x1
      p = clipRect(p, x0, y0, 0, 1);      // y >= y0
      p = clipRect(p, x0, y1, 0, -1);     // y <= y1
      if (!p) continue;
      const a = polyArea(p);
      if (a <= 0) continue;
      total += a;
      if (ownerOf(x0 + cell / 2, y0 + cell / 2) === own) inside += a;
    }
  }
  return { inside, total, share: total > 0 ? inside / total : 1 };
}

/** Sutherland–Hodgman against ONE half-plane, keeping the side the normal points toward. */
function clipRect(poly, ox, oy, nx, ny) {
  if (!poly || poly.length < 3) return null;
  const out = [];
  for (let i = 0, n = poly.length; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    const da = (a[0] - ox) * nx + (a[1] - oy) * ny;
    const db = (b[0] - ox) * nx + (b[1] - oy) * ny;
    if (da >= 0) out.push(a);
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const t = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out.length >= 3 ? out : null;
}

function polyArea(poly) {
  let a = 0;
  for (let i = 0, n = poly.length; i < n; i++) {
    const p = poly[i], q = poly[(i + 1) % n];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a < 0 ? -a / 2 : a / 2;
}

/** Even-odd point-in-polygon. */
export function pointInPoly(poly, x, y) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if ((yi > y) !== (yj > y)) {
      const qx = (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (x < qx) inside = !inside;
    }
  }
  return inside;
}

export function bbox(poly) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poly) {
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
  }
  return { x0, y0, x1, y1 };
}

/**
 * ⭐⭐ THE DISTANCE THE LAW IS ACTUALLY ABOUT: from a claim SEGMENT to a body's AREA.
 *
 * Three cases, and the first two are the ones the vertex predicate could not see:
 *   • the segment crosses an edge of the body            → 0
 *   • the segment lies wholly inside the body            → 0
 *   • otherwise                                          → the true nearest approach
 */
export function segToPolyDist(s, poly) {
  let d = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const q = poly[i], r = poly[(i + 1) % poly.length];
    const dd = segSegDist(s.ax, s.ay, s.bx, s.by, q[0], q[1], r[0], r[1]);
    if (dd < d) d = dd;
    if (d === 0) return 0;
  }
  if (pointInPoly(poly, s.ax, s.ay)) return 0;
  return d;
}

/**
 * A uniform grid bucket over claim segments. ⚠ THE RESULT ORDER IS CANONICAL (ascending index),
 * because which of several claims clips a body first is a decision and must be a stable one
 * (§234's spatial-indexing rule: canonical insertion AND result ordering).
 */
export function claimIndex(segs) {
  let maxHalf = 0;
  for (const s of segs) if (s.half > maxHalf) maxHalf = s.half;
  const cell = Math.max(8, maxHalf * 2);
  /** @type {Map<string, number[]>} */ const grid = new Map();
  const add = (i, box) => {
    for (let gx = Math.floor(box.x0 / cell); gx <= Math.floor(box.x1 / cell); gx++) {
      for (let gy = Math.floor(box.y0 / cell); gy <= Math.floor(box.y1 / cell); gy++) {
        const k = `${gx}|${gy}`;
        const b = grid.get(k);
        if (b) b.push(i); else grid.set(k, [i]);
      }
    }
  };
  segs.forEach((s, i) => add(i, {
    x0: Math.min(s.ax, s.bx) - s.half, x1: Math.max(s.ax, s.bx) + s.half,
    y0: Math.min(s.ay, s.by) - s.half, y1: Math.max(s.ay, s.by) + s.half,
  }));
  return {
    cell,
    near(box) {
      /** @type {Set<number>} */ const out = new Set();
      for (let gx = Math.floor(box.x0 / cell); gx <= Math.floor(box.x1 / cell); gx++) {
        for (let gy = Math.floor(box.y0 / cell); gy <= Math.floor(box.y1 / cell); gy++) {
          const b = grid.get(`${gx}|${gy}`);
          if (b) for (const i of b) out.add(i);
        }
      }
      return [...out].sort((p, q) => p - q);
    },
  };
}

/**
 * ⭐ THE DEFINITION `ringNearestIndex` MUST REPRODUCE — the nearest segment of a CLOSED ring to
 * a point, walked in ascending segment order and improved on STRICT `<`, so an exact tie keeps
 * the LOWEST-indexed segment and therefore ONE `(qx, qy)`. Exported because the equivalence pin
 * needs a reference that is not the thing under test, and because a rig that wants the walk
 * should call the walk rather than build a tree to reach it.
 * @returns {{i:number, d2:number, qx:number, qy:number}}
 */
export function ringNearestSegment(poly, px, py) {
  const pts = poly || [];
  const n = pts.length;
  let bi = -1, bd2 = Infinity, bx = px, by = py;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const r = nearestOnSeg(px, py, a[0], a[1], b[0], b[1]);
    if (r.d2 < bd2) { bd2 = r.d2; bi = i; bx = r.qx; by = r.qy; }
  }
  return { i: bi, d2: bd2, qx: bx, qy: by };
}

/**
 * ⭐⭐⭐ MF-PERF1 · THE RING NEAREST-SEGMENT INDEX (MF-ARCH's item 5, handed off unstarted by
 * MF-ARCH-2 §9.1) — `claimIndex`'s sibling, for the OTHER spatial question this fabric asks in
 * a loop: not *which claims are near this box* but **which segment of this closed ring is
 * nearest to this point**.
 *
 * ⛔ WHY IT EXISTS, MEASURED. `wallCircuit.circuitBandSide` and `circuitHold` walked EVERY
 * segment of every working ring for EVERY query, and the partition asks them once per grid
 * cell, once per region vertex and once per straddler sample: **574,896 segment visits on one
 * town leaf, 1,148,326 on year-100** (MFPERF1-counts.mjs). That is the un-indexed scan the
 * integration spike named at 12.7 % of the whole build.
 *
 * ⭐⭐ IT IS A BOUNDING-VOLUME HIERARCHY OVER **CONTIGUOUS RING ARCS**, AND THAT CHOICE IS THE
 * WHOLE DESIGN. A uniform grid answers "within r" well (see `claimIndex`, `segmentHash`) and
 * answers NEAREST badly: a point deep inside a walled town is 200 units from its wall, so an
 * expanding-cell search would sweep hundreds of empty cells before its bound closed. A BVH
 * prunes by distance rather than by radius, so a far query is as cheap as a near one.
 *
 * ⭐⭐⭐ AND IT IS **EXACT**, BY THREE SEPARATE PROPERTIES — this module's law is that an index
 * may accelerate an answer and may never change one:
 *   1. THE CANDIDATE ARITHMETIC IS THE SAME ARITHMETIC. Every candidate is measured by
 *      `nearestOnSeg` — the same call, the same operand order — so a visited segment's `d2`,
 *      `qx` and `qy` are bit-identical to the exhaustive scan's.
 *   2. THE TRAVERSAL ORDER IS ASCENDING SEGMENT INDEX (left child, then right, over contiguous
 *      ranges). The exhaustive scan improves on strict `<` and therefore keeps the LOWEST index
 *      on an exact tie; visiting in the same order with the same strict `<` keeps the same one.
 *      ⚠ THIS IS THE CANONICAL RESULT ORDERING §234 REQUIRES, and it is not decoration: `qx/qy`
 *      differ between two segments at equal distance, and `circuitHold` PROJECTS onto them.
 *   3. THE PRUNE IS A TRUE LOWER BOUND. A node is skipped only when the point-to-box distance
 *      STRICTLY exceeds the best found; the box contains every candidate point in that subtree,
 *      so nothing strictly better can be inside it. The comparison is strict rather than `>=`
 *      so that a subtree whose bound merely EQUALS the incumbent is still opened.
 *
 * ⚠ THE RESIDUAL, STATED RATHER THAN HIDDEN: the box bound and the candidate distance are
 * computed by different expressions, so a tie at a distance exactly equal to a box face could
 * in principle invert by one ulp. It is not argued away — it is MEASURED to zero by the
 * indexed-vs-exhaustive equivalence pin, which compares the two answers for **every query the
 * corpus makes**, and by the corpus's byte-identical exemplars.
 *
 * @param {Array<[number,number]>} poly a CLOSED ring; segment i is poly[i] → poly[(i+1) % n]
 * @returns {{ nearest:(x:number,y:number)=>{i:number,d2:number,qx:number,qy:number},
 *             exhaustive:(x:number,y:number)=>{i:number,d2:number,qx:number,qy:number},
 *             segments:number, nodes:number, indexed:boolean }}
 */
export function ringNearestIndex(poly) {
  const pts = poly || [];
  const n = pts.length;
  const exhaustive = (px, py) => ringNearestSegment(pts, px, py);
  // A ring too small to have an interior is walked whole: a tree over two segments costs more
  // than it saves, and "indexed: false" says so rather than pretending.
  if (n < 8) return { nearest: exhaustive, exhaustive, segments: n, nodes: 0, indexed: false };

  // ── THE TREE. Contiguous ranges, split at the midpoint, so a node's segment set is an ARC
  //    and its box is tight wherever the ring is not doubling back on itself.
  const lo = new Int32Array(2 * n), hi = new Int32Array(2 * n);
  const bx0 = new Float64Array(2 * n), by0 = new Float64Array(2 * n);
  const bx1 = new Float64Array(2 * n), by1 = new Float64Array(2 * n);
  const lft = new Int32Array(2 * n).fill(-1), rgt = new Int32Array(2 * n).fill(-1);
  let used = 0;
  const build = (a, b) => {
    const k = used++;
    lo[k] = a; hi[k] = b;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = a; i <= b; i++) {
      const p = pts[i % n];
      if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
      if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
    }
    bx0[k] = x0; by0[k] = y0; bx1[k] = x1; by1[k] = y1;
    if (b - a > 4) {
      const mid = (a + b) >> 1;
      lft[k] = build(a, mid);
      rgt[k] = build(mid, b);
    }
    return k;
  };
  build(0, n);

  const boxD2 = (k, px, py) => {
    const dx = px < bx0[k] ? bx0[k] - px : (px > bx1[k] ? px - bx1[k] : 0);
    const dy = py < by0[k] ? by0[k] - py : (py > by1[k] ? py - by1[k] : 0);
    return dx * dx + dy * dy;
  };
  const nearest = (px, py) => {
    let bi = -1, bd2 = Infinity, qbx = px, qby = py;
    /** @type {number[]} */ const stack = [0];
    while (stack.length) {
      const k = stack.pop();
      if (boxD2(k, px, py) > bd2) continue;
      if (lft[k] < 0) {
        for (let i = lo[k]; i < hi[k]; i++) {
          const a = pts[i], b = pts[(i + 1) % n];
          const r = nearestOnSeg(px, py, a[0], a[1], b[0], b[1]);
          if (r.d2 < bd2) { bd2 = r.d2; bi = i; qbx = r.qx; qby = r.qy; }
        }
        continue;
      }
      // ⚠ PUSHED RIGHT-THEN-LEFT so the LEFT (lower-index) arc pops FIRST — property 2 above.
      stack.push(rgt[k]); stack.push(lft[k]);
    }
    return { i: bi, d2: bd2, qx: qbx, qy: qby };
  };
  return { nearest, exhaustive, segments: n, nodes: used, indexed: true };
}

/** Flatten a claim list ({line, width}) into the segment set the predicate consumes. */
export function claimSegments(claims) {
  /** @type {Array<{ax:number,ay:number,bx:number,by:number,half:number,key:string}>} */
  const segs = [];
  for (const c of claims) {
    const half = c.width / 2;
    for (let i = 0; i + 1 < c.line.length; i++) {
      segs.push({
        ax: c.line[i][0], ay: c.line[i][1], bx: c.line[i + 1][0], by: c.line[i + 1][1],
        half, key: c.key || 'claim',
      });
    }
  }
  return segs;
}

/**
 * ⭐⭐⭐ THE DEEPEST RESERVED GROUND A BODY STANDS IN — the single question, asked once, of the
 * body's AREA. Returns the penetration (positive = violation) and the segment that caused it.
 */
export function deepestPenetration(poly, segs, idx) {
  let worst = -Infinity, hit = null;
  for (const si of idx.near(bbox(poly))) {
    const s = segs[si];
    const pen = s.half - segToPolyDist(s, poly);
    if (pen > worst) { worst = pen; hit = s; }
  }
  return { pen: worst === -Infinity ? 0 : worst, seg: hit };
}

/**
 * The half-plane a violating body must be clipped to. ⭐ AND THE STRADDLE CASE IS WHY THIS
 * FUNCTION EXISTS SEPARATELY FROM THE VERTEX SEARCH IT REPLACES: when the claim runs THROUGH
 * the body there is no violating vertex to take a direction from, so the direction comes from
 * the body's own CENTROID — the side it mostly lies on keeps the building, and the claim's
 * ground is given up. That is "the wall stops growth" and "the facade lands on the kerb"
 * expressed as one operation.
 *
 * @returns {{qx:number,qy:number,nx:number,ny:number}|null}
 */
export function kerbHalfPlane(poly, s) {
  // The deepest VIOLATING vertex still gives the best line where one exists — it is the
  // corner that overhangs, and clipping there is the minimum the law can take.
  let worst = 0, wq = null;
  for (const p of poly) {
    const r = nearestOnSeg(p[0], p[1], s.ax, s.ay, s.bx, s.by);
    const pen = s.half - Math.sqrt(r.d2);
    if (pen > worst + TOUCH_EPS) {
      worst = pen;
      let nx = p[0] - r.qx, ny = p[1] - r.qy;
      const l = Math.sqrt(nx * nx + ny * ny);
      if (l >= 1e-9) { nx /= l; ny /= l; wq = { qx: r.qx + nx * s.half, qy: r.qy + ny * s.half, nx, ny }; }
    }
  }
  if (wq) return wq;
  // THE STRADDLE. No vertex is inside the band and yet the band is inside the body: take the
  // centroid's side of the claim.
  let cx = 0, cy = 0;
  for (const p of poly) { cx += p[0]; cy += p[1]; }
  cx /= poly.length; cy /= poly.length;
  const r = nearestOnSeg(cx, cy, s.ax, s.ay, s.bx, s.by);
  let nx = cx - r.qx, ny = cy - r.qy;
  let l = Math.sqrt(nx * nx + ny * ny);
  if (l < 1e-9) {
    // The centroid sits on the crown of the claim. The segment's own left normal is the only
    // direction left, and it is deterministic.
    const dx = s.bx - s.ax, dy = s.by - s.ay;
    l = Math.sqrt(dx * dx + dy * dy) || 1;
    nx = -dy / l; ny = dx / l;
  } else { nx /= l; ny /= l; }
  return { qx: r.qx + nx * s.half, qy: r.qy + ny * s.half, nx, ny };
}
