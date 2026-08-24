/**
 * domain/townMap/fabric/cliffs.js — ⭐⭐⭐ §297.2b · THE ESCARPMENT BOUNDARY, AND THE DISCHARGE
 * OF THE ONE HOLD `fabricDcel.js` PARKED BY NAME.
 *
 * ⛔⛔ THE HOLD, VERBATIM (`fabricDcel.js`, at `BOUNDARY_ROLES`):
 *
 *   "`CLIFF` is declared and EMPTY in this era — the substrate carries crag CELLS, not an
 *    escarpment boundary, and inventing one from a raster threshold would be a new derivation
 *    wearing a foundation's name."
 *
 * ⭐⭐⭐ READ IT CLOSELY: **THE OBJECTION IS NOT "WE CANNOT COMPUTE IT". IT IS AN OBJECTION TO
 * WHERE THE COMPUTING WOULD LIVE.** A foundation that thresholded a raster would be deriving
 * ground truth inside read-side machinery, which is exactly what `FOUNDATIONS`' outbound-edge-free
 * rule exists to forbid. The hold names two separate debts and this module pays both:
 *
 *   1. **CELLS ARE NOT A BOUNDARY.** `groundRefusal.buildableMask` publishes which CELLS are
 *      crag. A boundary is a LINE with two sides, a length, an orientation and two ENDS, and
 *      nothing in the fabric produced one. This module produces it.
 *   2. **THE DERIVATION MAY NOT LIVE IN THE FOUNDATION.** So it lives here, in S2, beside the
 *      substrate whose field it reads — and `fabricDcel` merely CONSUMES a line the domain
 *      publishes, quantizes it and counts it.
 *
 * ⭐⭐ AND (2) IS THE WATER-EDGE PRECEDENT TAKEN ROW FOR ROW, WHICH IS WHY THE HOLD SAYS
 * *"until the water-edge definition lands"*. `buildBoundaryArrangement` admits `WATER_EDGE`
 * without deriving one byte of water: `waterMode.js`/`waterWorks.js` decide in the DOMAIN what
 * and where the water is, `buildFabric` publishes `fabric.water.line` + `width`, and the
 * foundation offsets and nodes it. `fabric.cliffs.edges` is that same shape, one boundary role
 * over. The foundation's derivation budget stays at zero.
 *
 * ⭐⭐⭐ **AND THE THRESHOLD IS NOT NEW — THAT IS THE OTHER HALF OF THE DISCHARGE.** The hold
 * warns against "inventing one from a raster threshold". Nothing is invented here:
 * `groundRefusal.REFUSAL.crag` is ALREADY the estate's single definition of impassable relief,
 * in the only cross-leaf-comparable slope unit the fabric has (`absoluteGrade`), and its header
 * carries the measured rationale — **at grade 0.030 the flat families refuse ZERO cells and the
 * relief families refuse a lot.** This module imports that number rather than re-spelling it, for
 * the same reason `relief.js` imports `REFUSAL.standingWater` for its reed ticks: **the law and
 * the picture have to agree about the ground.** A wall that terminated at a cliff the ground law
 * would happily build on, or refused ground the drawing shows as a gentle slope, is the same
 * defect from its two ends.
 *
 * ⭐ THE CONSEQUENCE, AND IT IS THE NEGATIVE CONTROL FOR FREE: a flat plain has NO crag cells, so
 * it has no crag region, so it has no escarpment, so it can grow no phantom cliff. The honest
 * NONE is a property of the shared threshold and not of a guard this module remembered to write.
 *
 * ── THE TWO KINDS, AND WHY A BOUNDARY NEEDS THEM ────────────────────────────────────────────
 * A crag region is a BAND — the steep ground between the low country and the high. Its boundary
 * therefore has two physically different sides, and a consumer that could not tell them apart
 * would put the same mark on both:
 *   BRINK  the gentle ground OUTSIDE this stretch of boundary is HIGHER than the crag. This is
 *          the top: the line a wall walk arrives at and stops on, and the line hachures hang
 *          below. §577's terminus is a brink.
 *   FOOT   the gentle ground outside is LOWER. This is the bottom of the fall — the line a road
 *          runs along and a wall may stand at, with the cliff above it.
 * Both are IMPASSABLE crossings; the kind is what the consumer draws and how it terminates.
 *
 * ⚠⚠ **NO SEEDED WOBBLE, AND THAT IS A RULING RATHER THAN AN OMISSION.** `relief.js`'s
 * `shoreContour` displaces its traced ring through `organicRing` before smoothing, because a
 * shore is INK and a wild coast genuinely wrinkles. A cliff edge is not ink: `walls.js` terminates
 * a circuit ON it, `fabricDcel` nodes it into a planar arrangement, and §577 places an end-work at
 * the crossing. A boundary that geometry is decided against must be the honest contour of the
 * ground, de-staircased and nothing more — the wobble belongs to whatever LENS draws it. Two
 * consequences, both wanted: this module mints **no random namespace at all** (its stage row
 * stays `randomNamespaces: []`, `statefulForkSites: 0`), and it is a pure function of the
 * substrate alone, exactly like `buildableMask` and `reliefField` beside it.
 *
 * ⭐ DERIVED, NEVER STORED (§161 LAYER ZERO, THE PROMISE). Nothing here is persisted and nothing
 * enters an identity hash: it is a reading of the substrate the substrate can always re-take.
 * Perturb the substrate and every edge moves; hold it and every edge is byte-identical.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare, no Math.pow. `Math.sqrt`
 * and `+ - * /` only.
 */

import { REFUSAL, absoluteGrade } from './groundRefusal.js';
import { sampleAt } from './substrate.js';
import { traceMask } from './umbrella.js';
import { chaikin, segIntersect } from './fabricGeometry.js';

/** @typedef {[number, number]} Point */

/**
 * ⭐ THE ESCARPMENT'S OWN THREE VALUES. §42/§43, ARGUED — and note what is NOT here: there is no
 * grade. The grade is `REFUSAL.crag`, imported, because a second one would be a second law.
 *
 *  `minRegionCells` 6 — a substrate cell is ~10.4 view units, which `substrate.js` derives as one
 *      building frontage at town scale. A crag patch of five cells or fewer is a boulder field: it
 *      is shorter than the wall's own working margin at every tier (`WALL_MARGIN` × builtRadius),
 *      so no circuit could terminate on it and resume beyond it — the trace steps over it. Calling
 *      that an escarpment would put §577 terminations on scree.
 *  `minEdgeCells` 4 — the same argument on the BOUNDARY rather than the region: an edge shorter
 *      than ~42 view units is shorter than one facet of the circuit that would have to stop at it
 *      (a 20–30 facet ring on a town-scale radius runs 40–60 units a facet), so it cannot be a
 *      terminus. Shorter runs are absorbed into their longer neighbour, never dropped, so the
 *      boundary stays continuous.
 *  `probeCells` 1.5 — how far either side of the boundary the brink/foot read samples. Far enough
 *      to clear the transition cell the boundary itself sits in, near enough to stay on the same
 *      landform. ⚠ A probe of 0.5 reads the transition twice and returns a coin flip.
 *
 * ⚠ UNSOAKED. All three ride the tuning signature.
 */
export const CLIFF = Object.freeze({
  minRegionCells: 6,
  minEdgeCells: 4,
  probeCells: 1.5,
  /** Corner-cutting passes on the traced lattice ring — the de-staircasing, and the ONLY
   *  smoothing this module does. See the no-wobble ruling in the header. */
  smooth: 2,
});

/** The kinds, closed set. A consumer may not invent a third. */
export const CLIFF_KINDS = Object.freeze(['brink', 'foot']);

/**
 * @typedef {Object} CliffEdge
 * @property {string} key      stable identity — kind + the edge's own first vertex, never an ordinal
 * @property {'brink'|'foot'} kind
 * @property {Point[]} line    the escarpment, view space, de-staircased
 * @property {boolean} closed  true when the whole region boundary is one kind (a mesa rim)
 * @property {[Point,Point]|null} ends  where the escarpment STOPS — null when closed
 * @property {number} length
 * @property {number} grade    mean absolute grade along the edge (comparable across leaves)
 * @property {number} drop     mean height difference across the band, in substrate height units
 * @property {number} region   the crag region this edge bounds
 */

/**
 * ⭐⭐⭐ DERIVE THE ESCARPMENT BOUNDARIES OF A SUBSTRATE.
 *
 * A pure function of `sub` — no seed, no stream, no options that change geometry.
 *
 * @param {import('./substrate.js').Substrate} sub
 * @returns {{ edges: CliffEdge[], regions: Array<{id:number, cells:number}>, cragCells:number,
 *   share:number, counts:Record<string,number>, key:string, reason:string }}
 */
export function deriveCliffs(sub) {
  const n = sub.n, cell = sub.cell;

  // ── 1 · THE CRAG CELLS, THROUGH THE SHARED WRITER. `absoluteGrade` at the cell centre is
  //    exactly `groundRefusal`'s own `gradeOfCell`; asking it this way is what makes "the wall
  //    stops here" and "no body may stand here" the SAME sentence rather than two that agree today.
  const crag = new Uint8Array(n * n);
  let cragCells = 0;
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const g = absoluteGrade(sub, (i + 0.5) * cell, (j + 0.5) * cell);
      if (g > REFUSAL.crag) { crag[j * n + i] = 1; cragCells++; }
    }
  }

  // ── 2 · REGIONS. 4-CONNECTED, TO MATCH THE TRACE. `traceMask` emits an edge wherever a
  //    4-neighbour is outside, so a diagonal touch is NOT a shared boundary there; labelling
  //    8-connected would merge two regions the trace then returns as two rings, and every
  //    per-region figure would be wrong by exactly the diagonals.
  const label = new Int32Array(n * n).fill(-1);
  /** @type {number[]} */ const regionSize = [];
  const stack = new Int32Array(n * n);
  for (let s = 0; s < n * n; s++) {
    if (!crag[s] || label[s] >= 0) continue;
    const id = regionSize.length;
    let top = 0, count = 0;
    stack[top++] = s;
    label[s] = id;
    while (top > 0) {
      const k = stack[--top];
      count++;
      const i = k % n, j = (k - i) / n;
      // A FIXED neighbour order, so the walk is byte-stable whatever the platform.
      if (i > 0 && crag[k - 1] && label[k - 1] < 0) { label[k - 1] = id; stack[top++] = k - 1; }
      if (i < n - 1 && crag[k + 1] && label[k + 1] < 0) { label[k + 1] = id; stack[top++] = k + 1; }
      if (j > 0 && crag[k - n] && label[k - n] < 0) { label[k - n] = id; stack[top++] = k - n; }
      if (j < n - 1 && crag[k + n] && label[k + n] < 0) { label[k + n] = id; stack[top++] = k + n; }
    }
    regionSize.push(count);
  }

  // ── 3 · THE ESCARPMENT MASK — regions large enough to be one. See CLIFF.minRegionCells.
  const isCliffCell = (i, j) => {
    if (i < 0 || j < 0 || i >= n || j >= n) return false;
    const id = label[j * n + i];
    return id >= 0 && regionSize[id] >= CLIFF.minRegionCells;
  };

  /** @type {CliffEdge[]} */ const edges = [];
  /** @type {Record<string, number>} */ const counts = { brink: 0, foot: 0 };
  const loops = traceMask(isCliffCell, n, cell);

  for (const loop of loops) {
    // ⚠ HOLES ARE KEPT AND THAT IS DELIBERATE. A gentle pocket enclosed by crag is a real
    // landform — a shelf inside a scarp — and its boundary is as impassable from the inside as
    // the region's outer rim is from the outside. The brink/foot read below is winding-agnostic
    // (it asks which side is STEEPER, then which side is HIGHER), so a hole needs no special case
    // and gets none. Dropping holes would have been the cheaper lie.
    if (loop.ring.length < 4) continue;
    const ring = chaikin(loop.ring, CLIFF.smooth, true);
    if (ring.length < 4) continue;
    const region = regionOf(label, n, cell, loop.ring);

    // ── 4 · THE PER-VERTEX READ. Two probes on the vertex normal: the STEEPER side is the crag,
    //    the other is the gentle ground, and whether that gentle ground is ABOVE or BELOW the crag
    //    is the whole difference between the top of a fall and the bottom of one.
    const m = ring.length;
    /** @type {string[]} */ const kind = new Array(m);
    /** @type {number[]} */ const gradeAt = new Array(m);
    /** @type {number[]} */ const dropAt = new Array(m);
    const R = CLIFF.probeCells * cell;
    for (let i = 0; i < m; i++) {
      const p = ring[i];
      const a = ring[(i - 1 + m) % m], b = ring[(i + 1) % m];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0];
      const l = Math.sqrt(nx * nx + ny * ny);
      if (l === 0) { nx = 1; ny = 0; } else { nx /= l; ny /= l; }
      const px = p[0] + nx * R, py = p[1] + ny * R;
      const qx = p[0] - nx * R, qy = p[1] - ny * R;
      // ⚠ `sampleAt` CLAMPS out-of-frame reads to the edge cell. At the frame border that returns
      // the nearest REAL ground rather than an invention, which is the honest answer here — the
      // leaf is a WINDOW on the world (§2.3), and the escarpment does not stop because the paper does.
      const gP = absoluteGrade(sub, px, py), gQ = absoluteGrade(sub, qx, qy);
      // The gentle side is the one with the SMALLER grade; the crag side is the other.
      const gentleUp = gP < gQ;
      const hGentle = sampleAt(sub, sub.height, gentleUp ? px : qx, gentleUp ? py : qy);
      const hCrag = sampleAt(sub, sub.height, gentleUp ? qx : px, gentleUp ? qy : py);
      // ⭐ STRICT `>`, so the answer is TOTAL. Ground where the two probes read exactly equal is
      // not an escarpment at all and belongs to the shorter of the two populations; calling the
      // tie a FOOT keeps `brink` — the kind §577 terminates on — free of degenerate members.
      kind[i] = hGentle > hCrag ? 'brink' : 'foot';
      gradeAt[i] = gP > gQ ? gP : gQ;
      dropAt[i] = hGentle > hCrag ? hGentle - hCrag : hCrag - hGentle;
    }

    // ── 5 · COALESCE INTO ARCS. The ring is closed, so the walk starts at the first CHANGE —
    //    otherwise the arc containing index 0 is split in two and the boundary reports a terminus
    //    it does not have. (`wallRuns.deriveRuns` states the same rule for the same reason.)
    let start = 0;
    while (start < m && kind[start] === kind[(start - 1 + m) % m]) start++;
    const wholeRing = start >= m;
    if (wholeRing) start = 0;
    /** @type {Array<{kind:string, idx:number[]}>} */ const arcs = [];
    for (let s = 0; s < m; s++) {
      const k = (start + s) % m;
      const last = arcs[arcs.length - 1];
      if (last && last.kind === kind[k]) last.idx.push(k);
      else arcs.push({ kind: kind[k], idx: [k] });
    }

    // ── 6 · ABSORB THE SLIVERS. An arc shorter than the minimum is not a decision, it is a
    //    vertex — so it joins the longer of its neighbours. ⚠ ABSORBED, NEVER DROPPED: a dropped
    //    arc would leave a GAP in an impassable boundary, and a gap in a cliff is a gate the
    //    ground never cut. (The half-open case — a single sliver arc on a two-arc ring — falls
    //    through to the whole-ring branch below, which is the honest reading of it.)
    const arcLen = (arc) => {
      let L = 0;
      for (let k = 0; k + 1 < arc.idx.length; k++) {
        const p = ring[arc.idx[k]], q = ring[arc.idx[k + 1]];
        L += Math.sqrt((q[0] - p[0]) * (q[0] - p[0]) + (q[1] - p[1]) * (q[1] - p[1]));
      }
      return L;
    };
    const minLen = CLIFF.minEdgeCells * cell;
    let merged = arcs;
    for (let pass = 0; pass < 4 && merged.length > 1; pass++) {
      /** @type {Array<{kind:string, idx:number[]}>} */ const next = [];
      let changed = false;
      for (let r = 0; r < merged.length; r++) {
        const cur = merged[r];
        if (next.length && next[next.length - 1].kind === cur.kind) {
          next[next.length - 1].idx = next[next.length - 1].idx.concat(cur.idx);
          continue;
        }
        if (arcLen(cur) >= minLen) { next.push({ kind: cur.kind, idx: cur.idx.slice() }); continue; }
        const prevArc = next.length ? next[next.length - 1] : null;
        const nextArc = r + 1 < merged.length ? merged[r + 1] : null;
        if (prevArc && (!nextArc || arcLen(prevArc) >= arcLen(nextArc))) {
          prevArc.idx = prevArc.idx.concat(cur.idx);
        } else if (nextArc) {
          nextArc.idx = cur.idx.concat(nextArc.idx);
        } else { next.push({ kind: cur.kind, idx: cur.idx.slice() }); continue; }
        changed = true;
      }
      merged = next;
      if (!changed) break;
    }
    // The closed ring's first and last arcs are ONE arc when they share a kind.
    if (merged.length > 2 && merged[0].kind === merged[merged.length - 1].kind) {
      merged[0].idx = merged.pop().idx.concat(merged[0].idx);
    }

    // ── 7 · EMIT.
    const closedRing = wholeRing || merged.length === 1;
    for (const arc of merged) {
      /** @type {Point[]} */ const line = arc.idx.map((k) => /** @type {Point} */ ([ring[k][0], ring[k][1]]));
      if (closedRing) line.push(/** @type {Point} */ ([line[0][0], line[0][1]]));
      if (line.length < 2) continue;
      let length = 0;
      for (let k = 0; k + 1 < line.length; k++) {
        const p = line[k], q = line[k + 1];
        length += Math.sqrt((q[0] - p[0]) * (q[0] - p[0]) + (q[1] - p[1]) * (q[1] - p[1]));
      }
      if (!(length > 0)) continue;
      let gSum = 0, dSum = 0;
      for (const k of arc.idx) { gSum += gradeAt[k]; dSum += dropAt[k]; }
      edges.push({
        // ⚠ SW-1d: A DERIVED KEY IS UNIQUE ACROSS THE ARTIFACT OR IT IS NOT A KEY. The key is the
        // arc's KIND and its own first vertex, never its ordinal in this list — an ordinal key
        // re-labels every later edge when an earlier one changes, which is §240.4's inertia seam
        // broken at boundary granularity. Uniqueness is asserted below.
        key: `cliff.${arc.kind}.${round1(line[0][0])},${round1(line[0][1])}`,
        kind: /** @type {'brink'|'foot'} */ (arc.kind),
        line,
        closed: closedRing,
        ends: closedRing ? null : /** @type {[Point,Point]} */ ([line[0], line[line.length - 1]]),
        length,
        grade: gSum / arc.idx.length,
        drop: dSum / arc.idx.length,
        region,
      });
      counts[arc.kind]++;
    }
  }

  // ── 8 · A TOTAL ORDER. Longest first (the escarpment a consumer meets first is the one that
  //    matters most), ties broken on the key — so two runs in two processes emit the same list.
  edges.sort((a, b) => (b.length - a.length) || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  // ⚠ AND THE KEY IS MADE UNIQUE RATHER THAN ASSUMED UNIQUE. Two arcs can round to the same first
  // vertex on a tight ring; a silent collision is SW-1d's whole complaint, so the duplicate takes
  // an explicit ordinal and the artifact reports how many did.
  const seen = new Map();
  let collisions = 0;
  for (const e of edges) {
    const c = seen.get(e.key) || 0;
    seen.set(e.key, c + 1);
    if (c > 0) { e.key = `${e.key}#${c}`; collisions++; }
  }

  const regions = regionSize
    .map((cells, id) => ({ id, cells }))
    .filter((r) => r.cells >= CLIFF.minRegionCells);

  // ── 9 · THE IMPASSABLE MASK — **THE SAME CELL SET THE EDGES WERE TRACED FROM**, published so
  //    a consumer's POINT test and this artifact's BOUNDARY cannot disagree.
  //
  // ⛔ THE DEFECT THIS EXISTS TO PREVENT, AND IT IS THIS PROGRAMME'S OWN COMMONEST SHAPE. A wall
  // that asked `groundRefusal.refusalAt(...) === 'crag'` for "am I on a cliff" and asked THIS
  // artifact for "where does the cliff edge cross" would be reading TWO POPULATIONS: `refusalAt`
  // fires on every crag cell including the five-cell boulder fields `CLIFF.minRegionCells`
  // rejects, so the trace would drop a vertex for a cliff that has no boundary to terminate on,
  // and the terminus would fall back to a midpoint. ⭐ THE CLASS: **A PREDICATE AND A BOUNDARY
  // DERIVED FROM THE SAME LAW BUT FILTERED DIFFERENTLY ARE TWO LAWS.** The mask is the filtered
  // set itself, so the two are the same set by construction rather than by agreement.
  // ⚠ IT IS DERIVED AND HELD IN MEMORY, NEVER PERSISTED — exactly `buildableMask.mask`'s status.
  const mask = new Uint8Array(n * n);
  let maskCells = 0;
  for (let k = 0; k < n * n; k++) {
    const id = label[k];
    if (id >= 0 && regionSize[id] >= CLIFF.minRegionCells) { mask[k] = 1; maskCells++; }
  }

  return {
    edges,
    regions,
    n,
    cell,
    mask,
    impassableCells: maskCells,
    cragCells,
    share: cragCells / (n * n),
    counts,
    keyCollisions: collisions,
    // ⭐ THE ARTIFACT'S OWN KEY, over its DERIVED SHAPE rather than its coordinates — the same
    // rule `substrate.key` states for itself. It is what a consumer's declared-input hash carries
    // so that arming this feature cannot be mistaken for a stale reading of the same wall.
    key: `cliff:${edges.length}|b${counts.brink}|f${counts.foot}|r${regions.length}|c${cragCells}`,
    reason: edges.length
      ? `${edges.length} escarpment edge(s) on '${sub.family}': ${counts.brink} brink, ${counts.foot} foot`
        + ` over ${regions.length} crag region(s) (${cragCells} of ${n * n} cells, `
        + `${(cragCells / (n * n) * 100).toFixed(1)}%, grade > ${REFUSAL.crag})`
      : `NO ESCARPMENT on '${sub.family}': ${cragCells} crag cell(s) of ${n * n} at grade > `
        + `${REFUSAL.crag}${cragCells ? `, none in a region of ${CLIFF.minRegionCells}+ cells` : ''}`
        + ' — this ground is passable everywhere and the map may not draw a cliff on it',
  };
}

/**
 * ⭐⭐ IS THIS POINT ON GROUND THE ESCARPMENT SET CALLS IMPASSABLE? The POINT half of the same
 * fact `edges` is the BOUNDARY half of — read off the very cells the boundary was traced from.
 *
 * ⚠ THIS IS NOT A SECOND SPELLING OF `groundRefusal.refusalAt`. It is `refusalAt`'s crag clause
 * NARROWED to regions large enough to be an escarpment (`CLIFF.minRegionCells`), which is the
 * only set that has a boundary to terminate on. A consumer wanting "may a body stand here" still
 * asks `groundRefusal`; a consumer wanting "does the wall stop here" asks this, and gets an
 * answer the edge list can honour.
 *
 * @param {{mask:Uint8Array, n:number, cell:number}} cliffs @param {number} x @param {number} y
 * @returns {boolean}
 */
export function onImpassable(cliffs, x, y) {
  if (!cliffs || !cliffs.mask) return false;
  const n = cliffs.n;
  let i = Math.floor(x / cliffs.cell), j = Math.floor(y / cliffs.cell);
  // ⚠ OUT OF FRAME IS NOT IMPASSABLE. `sampleAt` clamps, which would convict a point at
  // y = −40 with the ground at y = +5 — `groundRefusal.bodyRefusal`'s own named hazard. A wall
  // vertex outside the leaf is beyond the drawn world, not on a cliff.
  if (i < 0 || j < 0 || i >= n || j >= n) return false;
  return cliffs.mask[j * n + i] === 1;
}

/**
 * ⭐⭐⭐ **DOES THIS SEGMENT TOUCH IMPASSABLE GROUND AT ALL? — EXACT, NOT SAMPLED.**
 *
 * ⛔⛔ THIS FUNCTION EXISTS BECAUSE SAMPLING COULD NOT CLOSE, AND THE FAILURE WAS INSTRUCTIVE.
 * The §577 cut and its instrument both began by stepping a line and testing points. Three rounds
 * of refinement took the corpus from **257 over-cliff drawn segments to 209 to 12 to 6 to 5** and
 * then stopped, and attribution (`probeAttr.mjs`) found every survivor to be the same shape: the
 * FIRST piece of a chain, one lone sample deep. Two mechanisms, both sub-cell:
 *   • a masked patch NARROWER THAN THE SAMPLE PITCH, caught by the instrument's phase and missed
 *     by the law's — two samplers at the same pitch and different phase disagree forever;
 *   • a crossing at t ≈ 1e-12, i.e. an endpoint TOUCH counted as an interior crossing, which
 *     convicts a terminus for being exactly where §577 requires it to be.
 * ⭐ THE CLASS, and it is the one worth banking: **TWO SAMPLED APPROXIMATIONS OF ONE PREDICATE
 * CONVERGE ON EACH OTHER BUT NEVER MEET; A TOLERANCE ADDED TO CLOSE THE GAP IS A NUMBER FITTED TO
 * THE CORPUS.** The mask is a set of CELLS and a segment either enters one or it does not — the
 * question was exactly answerable all along, and answering it exactly removes both mechanisms and
 * the tolerance with them.
 *
 * ⚠ ONE WRITER FOR BOTH SIDES. The law (`walls.terminateAtCliffs`) and the instrument that grades
 * it call THIS function, for the same reason `relief.js` imports `REFUSAL.standingWater` rather
 * than re-spelling it: the law and the measurement of the law must be about the same ground.
 *
 * Amanatides & Woo grid traversal — every cell the segment passes through, in order. Integer
 * stepping plus `+ - * /`; no trig, no tolerance, no epsilon anywhere.
 *
 * @param {{mask:Uint8Array, n:number, cell:number}} cliffs
 * @param {number} ax @param {number} ay @param {number} bx @param {number} by
 * @returns {boolean}
 */
export function segmentTouchesImpassable(cliffs, ax, ay, bx, by) {
  if (!cliffs || !cliffs.mask) return false;
  const n = cliffs.n, cell = cliffs.cell;
  const hit = (i, j) => i >= 0 && j >= 0 && i < n && j < n && cliffs.mask[j * n + i] === 1;
  let x = Math.floor(ax / cell), y = Math.floor(ay / cell);
  const ex = Math.floor(bx / cell), ey = Math.floor(by / cell);
  const dx = bx - ax, dy = by - ay;
  const stepX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
  const stepY = dy > 0 ? 1 : dy < 0 ? -1 : 0;
  const adx = dx < 0 ? -dx : dx, ady = dy < 0 ? -dy : dy;
  const dtX = adx > 0 ? cell / adx : Infinity;
  const dtY = ady > 0 ? cell / ady : Infinity;
  let tX = adx > 0 ? (stepX > 0 ? ((x + 1) * cell - ax) : (ax - x * cell)) / adx : Infinity;
  let tY = ady > 0 ? (stepY > 0 ? ((y + 1) * cell - ay) : (ay - y * cell)) / ady : Infinity;
  // ⚠ THE GUARD IS A TERMINATION PROOF, NOT A BUDGET: a straight segment inside a square grid
  // crosses at most 2n cell boundaries, so a walk that exceeds it has lost its invariant and
  // must stop rather than spin. It has never fired on this corpus.
  for (let guard = 0; guard <= 4 * n + 8; guard++) {
    if (hit(x, y)) return true;
    if (x === ex && y === ey) return false;
    if (tX < tY) {
      if (tX > 1) return hit(ex, ey);
      tX += dtX; x += stepX;
    } else {
      if (tY > 1) return hit(ex, ey);
      tY += dtY; y += stepY;
    }
  }
  return false;
}

/** Round to one place — the key's own quantum. Exact in IEEE for the magnitudes involved. */
function round1(v) { return Math.round(v * 10) / 10; }

/** Which crag region a traced loop bounds — read off a cell adjacent to the loop's first lattice
 *  corner. ⚠ The loop's vertices are lattice CORNERS, so the region is in one of the four cells
 *  that corner touches; the first set one wins, in a fixed order. */
function regionOf(label, n, cell, ring) {
  const i0 = Math.round(ring[0][0] / cell), j0 = Math.round(ring[0][1] / cell);
  for (const [di, dj] of [[0, 0], [-1, 0], [0, -1], [-1, -1]]) {
    const i = i0 + di, j = j0 + dj;
    if (i < 0 || j < 0 || i >= n || j >= n) continue;
    const id = label[j * n + i];
    if (id >= 0) return id;
  }
  return -1;
}

/**
 * ⭐⭐⭐ §577 · **DOES IMPASSABLE RELIEF CROSS THIS PATH, AND WHERE DOES IT END?** — the read the
 * circuit asks, and the reason this artifact is a BOUNDARY rather than a cell set.
 *
 * A cell predicate can only answer "is this point on a cliff". A wall needs the CROSSING: the
 * point at which its own line meets the escarpment, because that point is where the curtain stops
 * and where §577's end-work stands. And it needs the escarpment's ENDS, because a wall that knows
 * where the cliff stops can decide whether to go round it or terminate against it.
 *
 * @param {{edges:CliffEdge[]}} cliffs
 * @param {number} ax @param {number} ay @param {number} bx @param {number} by
 * @returns {{ edge:CliffEdge, point:Point, t:number }|null}  the FIRST crossing along a→b
 */
export function cliffCrossing(cliffs, ax, ay, bx, by) {
  if (!cliffs || !cliffs.edges || !cliffs.edges.length) return null;
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (!(len2 > 0)) return null;
  /** @type {{edge:CliffEdge, point:Point, t:number}|null} */ let best = null;
  for (const edge of cliffs.edges) {
    for (let i = 0; i + 1 < edge.line.length; i++) {
      const p = segIntersect([ax, ay], [bx, by], edge.line[i], edge.line[i + 1]);
      if (!p) continue;
      const t = ((p[0] - ax) * dx + (p[1] - ay) * dy) / len2;
      if (t < 0 || t > 1) continue;
      // ⚠ FIRST ALONG THE PATH, and ties break on the edge KEY rather than on iteration order —
      // two escarpments meeting at a point must not resolve by which was traced first.
      if (!best || t < best.t || (t === best.t && edge.key < best.edge.key)) {
        best = { edge, point: /** @type {Point} */ ([p[0], p[1]]), t };
      }
    }
  }
  return best;
}

/**
 * ⭐⭐ **EVERY** CROSSING ON ONE SEGMENT, IN PATH ORDER — not just the first.
 *
 * ⛔ `cliffCrossing` answers "does this path meet a cliff", which is the question a REFUSAL asks.
 * A path that must be CUT asks a different one: an escarpment set is a lace of many small
 * regions on a real upland (MEASURED: 23–37 regions on a mountain leaf), so one facet of a
 * twenty-facet circuit can cross in and out of impassable ground several times. Cutting on the
 * first crossing alone would leave the rest of that facet drawn straight over the scarp.
 *
 * @param {{edges:Array<any>}} cliffs
 * @param {number} ax @param {number} ay @param {number} bx @param {number} by
 * @returns {Array<{ edge:any, point:Point, t:number }>} sorted by `t`, near-duplicates dropped
 */
export function segmentCrossings(cliffs, ax, ay, bx, by) {
  /** @type {Array<{edge:any, point:Point, t:number}>} */ const out = [];
  if (!cliffs || !cliffs.edges || !cliffs.edges.length) return out;
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (!(len2 > 0)) return out;
  for (const edge of cliffs.edges) {
    for (let i = 0; i + 1 < edge.line.length; i++) {
      const p = segIntersect([ax, ay], [bx, by], edge.line[i], edge.line[i + 1]);
      if (!p) continue;
      const t = ((p[0] - ax) * dx + (p[1] - ay) * dy) / len2;
      if (t <= 0 || t >= 1) continue;
      out.push({ edge, point: /** @type {Point} */ ([p[0], p[1]]), t });
    }
  }
  // A TOTAL ORDER — position first, then the edge key, so two escarpments meeting at one point
  // resolve the same way in every process rather than by trace order.
  out.sort((a, b) => (a.t - b.t) || (a.edge.key < b.edge.key ? -1 : a.edge.key > b.edge.key ? 1 : 0));
  // ⚠ NEAR-DUPLICATES ARE DROPPED. A brink and a foot that meet at a spur, or one edge crossed
  // twice within a rounding of the same point, would otherwise emit a ZERO-LENGTH sub-segment
  // whose midpoint test is meaningless — the degenerate member every walk of a split path grows.
  /** @type {Array<{edge:any, point:Point, t:number}>} */ const kept = [];
  const EPS = 1e-9;
  for (const c of out) {
    if (kept.length && c.t - kept[kept.length - 1].t < EPS) continue;
    kept.push(c);
  }
  return kept;
}

/**
 * Every crossing of a polyline (open or closed) with the escarpment set, in path order.
 * @param {{edges:CliffEdge[]}} cliffs
 * @param {Point[]} line @param {boolean} [closed]
 * @returns {Array<{ edge:CliffEdge, point:Point, at:number, t:number }>}  `at` is the segment index
 */
export function cliffCrossings(cliffs, line, closed = false) {
  /** @type {Array<{edge:CliffEdge, point:Point, at:number, t:number}>} */ const out = [];
  if (!cliffs || !cliffs.edges || !cliffs.edges.length || !line || line.length < 2) return out;
  const last = closed ? line.length : line.length - 1;
  for (let i = 0; i < last; i++) {
    const a = line[i], b = line[(i + 1) % line.length];
    const hit = cliffCrossing(cliffs, a[0], a[1], b[0], b[1]);
    if (hit) out.push({ edge: hit.edge, point: hit.point, at: i, t: hit.t });
  }
  return out;
}
