/**
 * domain/townMap/fabric/umbrella.js — THE UMBRELLA, THE SEAMS, THE GREENS, THE PARTITION
 * (§5.0c.3/.4, J-TC29-2).
 *
 * ⭐⭐ "THE TOWN OUTLINE IS THE UMBRELLA": the union of the district organisms, with two
 * seam behaviours —
 *   • where organisms GREW TOGETHER, their meeting frontier becomes THE SEAM STREETS
 *     (historically the liveliest streets in the town, because two trades meet on them);
 *   • where they have NOT met, the gaps INSIDE the umbrella STAY GREEN — gardens,
 *     commons, paddocks. These interior green holes are what make real town plans
 *     breathe, and a gap-free umbrella at town scale and above is a RED.
 *
 * ⛔ THE OUTLINE IS TRACED, NOT RADIALLY SAMPLED, and that is a correction to the
 * prototype. A radial union-of-discs walk from one origin cannot represent (a) an
 * interior hole — every ray exits once, so a green in the middle is invisible; or (b) a
 * genuinely POLYCENTRIC plan whose two halves are joined by a thin ribbon, where a ray
 * through the waist reports the far cluster as a single continuous reach. Both are
 * exactly the shapes §5.-1.3 and §5.0c.3 exist to produce. So the umbrella is recovered
 * by tracing the boundary of the partition grid's `inside` mask: every component, every
 * hole, correct by construction.
 *
 * THE TRACE ITSELF is deliberately not marching squares. It emits, for every inside cell
 * with an outside neighbour, the SHARED CELL EDGE with a consistent winding, then chains
 * the edges into closed loops. That is exact (no interpolation, no ambiguous saddle
 * case), total (every boundary edge appears exactly once) and deterministic (edges are
 * chained from a map keyed on integer lattice points, walked in a fixed order).
 *
 * ⭐ THE PARTITION (J-TC29-2) is traced by the SAME routine over a per-district mask, so
 * `districts[].polygon` is a partition cell's boundary and the cells are DISJOINT BY
 * CONSTRUCTION — not by a subsequent repair pass that could silently fail.
 *
 * PURITY: pure; no draws.
 */

import { absArea, centroid, chaikin } from './fabricGeometry.js';
import { hashUnit } from './fabricRng.js';

/** @typedef {[number, number]} Point */

/**
 * The signed area an OUTER boundary comes back with, derived in the note above from the
 * single-cell trace. A hole carries the opposite sign.
 */
export const OUTER_SIGN = -1;

/**
 * ⭐⭐ ORGANIC RING SMOOTHING — THE CURE FOR THE PIXEL STAIRCASE, and it is used by every
 * traced boundary in the fabric (the umbrella, its greens, the partition cells, the shore).
 *
 * A mask trace returns lattice-aligned edges, so its ring is a staircase of axis-aligned
 * steps at the grid pitch — which is exactly what the eye reads as "pixels" rather than as
 * ink. The obvious cure, more Chaikin, is a TRAP: corner-cutting shortens the perimeter,
 * and circularity is 4πA/P², so smoothing a staircase into a curve drives the shape TOWARD
 * A DISC — which is the §157 concentric drift the whole fabric exists to override. Measured
 * on this corpus: four Chaikin passes alone took a town from 0.66 to 0.81 circularity while
 * still reading as a rounded-off grid.
 *
 * So the cure is TWO-PART, and the ORDER IS LOAD-BEARING:
 *   1 DISPLACE each vertex along its own outward normal by a SEEDED amount at the grid's
 *     own scale. This destroys the axis-aligned lattice signature AND adds perimeter,
 *     which is what holds circularity down while the corners come off.
 *   2 THEN corner-cut. Chaikin is now smoothing a hand-wobbled outline instead of a
 *     staircase, and the result is smooth-BUT-IRREGULAR: an inked boundary, not a bitmap.
 *
 * DETERMINISM: the displacement is a pure hash of (key, vertex index) — no stream, no
 * ordering dependence — so a ring smoothed in two processes is byte-identical, and an
 * unrelated change elsewhere in the settlement cannot perturb it (the §11.0 inertia law).
 * ⚠ THE KEY MUST BE THE RING'S OWN IDENTITY, never its index in a list: an umbrella that
 * gains a second component would otherwise re-wobble the first one, and the locality pin
 * would red for a reason that is purely cosmetic.
 *
 * ⭐⭐ §5 W1 EXIT 6 · THE DISPLACEMENT IS THE **DETAIL SCALE**, AND IT MAY NOW BE ATTENUATED
 * PER VERTEX. The traced ring is the LARGE shape (a cove, a headland, a bay — the contour of
 * the ground); this displacement is the SMALL one (the wrinkle of an unworked shore). A worked
 * waterfront has no wrinkle: it is revetted, quayed and cut straight, because that is what
 * the work DOES to a shore. So `damp(x, y) → 0..1` scales the amplitude at each vertex, and a
 * caller that passes nothing gets the uniform behaviour it always had.
 * ⚠ THE DAMPING SCALES THE AMPLITUDE AND NEVER THE HASH. The draw stays `hashUnit(key|i)`, so
 * damping one stretch of shore cannot move the wrinkle on any other stretch — the §11.0
 * inertia law, which a "re-roll the whole ring at a lower amplitude" spelling would break.
 *
 * @param {Point[]} ring @param {number} cell the trace's grid pitch
 * @param {string} key stable identity of THIS ring
 * @param {number} [amplitude] displacement as a share of `cell`
 * @param {number} [passes] chaikin iterations
 * @param {((x:number,y:number)=>number)|null} [damp] per-vertex amplitude scale, 0..1
 * @returns {Point[]}
 */
export function organicRing(ring, cell, key, amplitude = 0.5, passes = 2, damp = null) {
  const n = ring.length;
  if (n < 4) return ring.slice();
  /** @type {Point[]} */ const out = [];
  for (let i = 0; i < n; i++) {
    const p = ring[i];
    const a = ring[(i - 1 + n) % n], b = ring[(i + 1) % n];
    // The vertex normal, from the chord through its neighbours.
    let nx = -(b[1] - a[1]), ny = b[0] - a[0];
    const l = Math.sqrt(nx * nx + ny * ny);
    if (l === 0) { out.push([p[0], p[1]]); continue; }
    nx /= l; ny /= l;
    const scale = damp ? damp(p[0], p[1]) : 1;
    const d = (hashUnit(`${key}|${i}`) - 0.5) * 2 * amplitude * cell * scale;
    out.push([p[0] + nx * d, p[1] + ny * d]);
  }
  return chaikin(out, passes, true);
}

/** The ring's own identity, independent of its position in any list — see organicRing.
 * Rounded to the lattice so it is exact. */
function ringKey(prefix, ring) {
  let minX = Infinity, minY = Infinity;
  for (const p of ring) { if (p[0] < minX) minX = p[0]; if (p[1] < minY) minY = p[1]; }
  return `${prefix}|${Math.round(minX)},${Math.round(minY)}|${ring.length}`;
}

/** Quantized lattice key for an edge endpoint — integer grid coordinates, so two edges
 * that share a corner share a key exactly, with no floating-point tolerance anywhere. */
function ptKey(i, j) { return `${i},${j}`; }

/**
 * Trace the boundary loops of a binary cell mask.
 *
 * Winding: each emitted edge runs so that the INSIDE is on one consistent side. Chained,
 * that makes OUTER boundaries and HOLES come back with OPPOSITE signed areas, which is how
 * the caller tells a green from a settlement without a containment test.
 *
 * ⚠ THE SIGN IS DERIVED, NOT ASSUMED, and it is worth stating because getting it backwards
 * silently produces a settlement with no outline and nothing but greens. Trace a SINGLE set
 * cell at (0,0): the edges chain to the ring (0,0)→(0,1)→(1,1)→(1,0), whose shoelace sum is
 * −2 ⇒ signed area −1. So in this y-down frame an OUTER boundary is NEGATIVE and a hole is
 * POSITIVE. `OUTER_SIGN` below records that once so no caller has to re-derive it.
 *
 * @param {(i:number, j:number) => boolean} isSet
 * @param {number} n grid size
 * @param {number} cell view units per cell
 * @returns {Array<{ ring: Point[], signedArea: number }>}
 */
export function traceMask(isSet, n, cell) {
  /** @type {Map<string, string[]>} */ const next = new Map();
  const add = (ax, ay, bx, by) => {
    const k = ptKey(ax, ay);
    const list = next.get(k) || [];
    list.push(ptKey(bx, by));
    next.set(k, list);
  };

  const inside = (i, j) => (i >= 0 && j >= 0 && i < n && j < n && isSet(i, j));

  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      if (!inside(i, j)) continue;
      // Cell (i,j) occupies lattice square [i,i+1] x [j,j+1]. Emit each side whose
      // neighbour is outside, wound so the cell is on the left of the direction of
      // travel in a y-down frame.
      if (!inside(i, j - 1)) add(i + 1, j, i, j);          // top    → travelling -x
      if (!inside(i + 1, j)) add(i + 1, j + 1, i + 1, j);  // right  → travelling -y
      if (!inside(i, j + 1)) add(i, j + 1, i + 1, j + 1);  // bottom → travelling +x
      if (!inside(i - 1, j)) add(i, j, i, j + 1);          // left   → travelling +y
    }
  }

  /** @type {Array<{ ring: Point[], signedArea: number }>} */ const loops = [];
  const startKeys = [...next.keys()].sort();
  for (const start of startKeys) {
    while ((next.get(start) || []).length) {
      /** @type {Point[]} */ const ring = [];
      let cur = start;
      let guard = 0;
      while (guard++ < n * n * 4) {
        const outs = next.get(cur);
        if (!outs || !outs.length) break;
        const step = outs.shift();
        const [ci, cj] = cur.split(',');
        ring.push([Number(ci) * cell, Number(cj) * cell]);
        cur = step;
        if (cur === start) break;
      }
      if (ring.length >= 4) {
        let a = 0;
        for (let k = 0; k < ring.length; k++) {
          const p = ring[k], q = ring[(k + 1) % ring.length];
          a += p[0] * q[1] - q[0] * p[1];
        }
        loops.push({ ring, signedArea: a / 2 });
      }
    }
  }
  return loops;
}

/**
 * @typedef {Object} Umbrella
 * @property {Point[][]} components   the built-up outlines, largest first
 * @property {Point[][]} greens       the INTERIOR gaps (§5.0c.3's breathing holes)
 * @property {Array<{ organismKey: string, districtId: string, polygon: Point[], centroid: Point, area: number }>} partition
 * @property {Array<Point[]>} seams   the frontier polylines where two organisms met
 * @property {number} builtArea
 * @property {boolean} polycentric
 */

/**
 * Derive the umbrella from the partition grid.
 *
 * @param {import('./organismFields.js').PartitionGrid} part
 * @param {import('./organisms.js').Organism[]} orgs
 * @param {{ minGreenArea?: number, minComponentArea?: number, smooth?: number }} [opts]
 * @returns {Umbrella}
 */
export function buildUmbrella(part, orgs, opts = {}) {
  // ⛔ THE MINIMUM AREAS ARE ABSOLUTE, NOT CELL-RELATIVE. Spelling them as multiples of
  // `cell²` made them silently shrink by 4× when the trace resolution doubled to de-
  // staircase the boundary — so a refinement that was supposed to change only the SMOOTHNESS
  // of the outline would also have admitted a shoal of one-cell specks as "greens". A green
  // is a garden or a paddock: it has a real size in view units, and that size does not
  // answer to how finely the trace happens to sample.
  const minGreen = opts.minGreenArea == null ? 320 : opts.minGreenArea;
  const minComponent = opts.minComponentArea == null ? 900 : opts.minComponentArea;
  const smooth = opts.smooth == null ? 2 : opts.smooth;
  const wobble = opts.wobble == null ? 0.5 : opts.wobble;
  const keyBase = opts.key == null ? 'umbrella' : String(opts.key);

  const insideAt = (i, j) => part.inside[j * part.n + i] === 1;
  const loops = traceMask(insideAt, part.n, part.cell);

  /** @type {Point[][]} */ const components = [];
  /** @type {Point[][]} */ const greens = [];
  for (const loop of loops) {
    const smoothed = smooth > 0
      ? organicRing(loop.ring, part.cell, ringKey(keyBase, loop.ring), wobble, smooth)
      : loop.ring;
    const a = absArea(smoothed);
    // Outer boundaries and holes come back with OPPOSITE windings from the trace, which
    // is the whole reason the winding is fixed above: a hole needs no containment test.
    if (loop.signedArea * OUTER_SIGN > 0) {
      if (a >= minComponent) components.push(smoothed);
    } else if (a >= minGreen) {
      greens.push(smoothed);
    }
  }
  components.sort((a, b) => absArea(b) - absArea(a));

  // ── THE PARTITION: one traced cell per organism. Disjoint by construction, because
  //    each cell of the grid has exactly one owner.
  // ⛔ ONE CELL PER DISTRICT ID, NOT PER ORGANISM. §5.0c multiplicity instantiates the same
  //    district TYPE more than once, and those instances share the landed district's id —
  //    so tracing one cell per ORGANISM emits two elements carrying the same
  //    `data-town-district`, and the landed click-region contract (one element per district,
  //    five UI suites hit-testing it) breaks with an ambiguous, order-dependent hit. The
  //    instances still PAINT separately; only the truth layer is merged, and it merges onto
  //    the LARGEST instance — the one a reader would point at.
  /** @type {Map<string, { organismKey:string, districtId:string, polygon:Point[], centroid:Point, area:number }>} */
  const byDistrict = new Map();
  /** @type {Umbrella['partition']} */ const partition = [];
  for (let o = 0; o < orgs.length; o++) {
    const ownLoops = traceMask(
      (i, j) => part.inside[j * part.n + i] === 1 && part.owner[j * part.n + i] === o,
      part.n,
      part.cell,
    );
    // An organism's partition cell is its LARGEST traced component. A field can dominate
    // two disconnected patches (a quarter cut in half by a river under the THROUGH
    // mode); the truth layer needs ONE click region per district id, so the outlier
    // patches stay painted and unclicked rather than minting a second element with the
    // same id — which would break the landed one-element-per-district contract.
    let best = null, bestArea = 0;
    for (const l of ownLoops) {
      if (l.signedArea * OUTER_SIGN <= 0) continue;
      const a = absArea(l.ring);
      if (a > bestArea) { bestArea = a; best = l.ring; }
    }
    if (!best || bestArea <= 0) continue;
    const poly = smooth > 0
      ? organicRing(best, part.cell, ringKey(`${keyBase}|cell|${orgs[o].key}`, best), wobble, smooth)
      : best;
    const cell = {
      organismKey: orgs[o].key,
      districtId: orgs[o].districtId,
      polygon: poly,
      centroid: /** @type {Point} */ (centroid(poly)),
      area: absArea(poly),
    };
    const prior = byDistrict.get(cell.districtId);
    if (!prior || cell.area > prior.area) byDistrict.set(cell.districtId, cell);
  }
  for (const id of [...byDistrict.keys()].sort()) partition.push(byDistrict.get(id));

  // ── THE SEAMS (§5.0c.3): the frontier where two organisms actually MET. Traced as the
  //    contested cells' own outline, which gives the seam a width (a street's width) and
  //    a shape (it follows the meeting, not a straight chord).
  const seamLoops = traceMask(
    (i, j) => part.contested[j * part.n + i] === 1,
    part.n,
    part.cell,
  );
  /** @type {Point[][]} */ const seams = [];
  for (const l of seamLoops) {
    if (l.signedArea * OUTER_SIGN <= 0) continue;
    if (absArea(l.ring) < 220) continue;
    seams.push(smooth > 0
      ? organicRing(l.ring, part.cell, ringKey(`${keyBase}|seam`, l.ring), wobble, smooth)
      : l.ring);
  }

  let builtArea = 0;
  for (const c of components) builtArea += absArea(c);

  // POLYCENTRIC when the umbrella has more than one real component, OR when its largest
  // component holds a genuine waist — the dumbbell. The component test is the honest
  // one and the only one asserted; the waist case renders identically and needs no flag.
  const polycentric = components.length > 1;

  return { components, greens, partition, seams, builtArea, polycentric };
}

/**
 * THE CIRCULARITY METRIC — how close a shape is to a disc, 1 being a perfect circle.
 * 4πA / P². The §157 standing critique convicts CONCENTRIC drift as a reference-generator
 * defect the fabric must override, so this is the number the member's pin asserts on:
 * a real accretion outline sits well below a circle, and a PLANTED CIRCLE MUST RED.
 * @param {Point[]} poly @returns {number}
 */
export function circularity(poly) {
  const a = absArea(poly);
  let p = 0;
  for (let i = 0; i < poly.length; i++) {
    const q = poly[(i + 1) % poly.length];
    p += Math.sqrt((q[0] - poly[i][0]) * (q[0] - poly[i][0]) + (q[1] - poly[i][1]) * (q[1] - poly[i][1]));
  }
  if (p <= 0) return 0;
  return (4 * 3.141592653589793 * a) / (p * p);
}

/** Is a point inside any umbrella component? The fabric's own "is this the town?" test.
 * @param {Umbrella} umb @param {number} x @param {number} y @returns {boolean} */
export function inUmbrella(umb, x, y) {
  for (const c of umb.components) if (pointIn(c, x, y)) return true;
  return false;
}

/** Is a point inside an interior green? Nothing is built in a green — that is what makes
 * it a green rather than an undeveloped parcel. */
export function inGreen(umb, x, y) {
  for (const g of umb.greens) if (pointIn(g, x, y)) return true;
  return false;
}

/** Even-odd point-in-polygon, local so this module has no cycle with the geometry core's
 * convexity documentation (umbrella rings are emphatically NOT convex). */
function pointIn(poly, px, py) {
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
