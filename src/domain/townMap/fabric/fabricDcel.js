/**
 * domain/townMap/fabric/fabricDcel.js — ⭐⭐⭐ MF-D1 · §287.8 / SPEC §10.15 ·
 * **THE CADASTRAL BOUNDARY ARRANGEMENT AND ITS PLANAR DCEL.**
 *
 * SPEC §10.15: *"`StreetGraph` remains route, access and street-role truth. A DCEL (half-edge
 * topology) is the objectively stronger owner for S8/S9 planar faces, holes, adjacency, frontage
 * and parcel boundaries. It does not replace the semantic graph and it does not cut over in one
 * wave."* §287.8 fixes this lane's scope exactly: **D1 proves face/adjacency/point-location only;
 * frontage/parcel equivalence waits for fresh W3.**
 *
 * ⭐⭐⭐ THE CONTRACT IS RECONCILED WITH THE CODEX SLICE (§299.2), NOT INVENTED BESIDE IT. The
 * `codex/first-map-vertical-slice` branch already carries a sound exact-integer planar embedder
 * (`dcelEmbedding.js`, `embeddingKind: 'XZ_LEFT_FACE_V1'`). Where its contract can express the
 * sandbox's real shapes this module ADOPTS it character for character:
 *
 *   ADOPTED · the half-edge record `{halfEdgeId, boundaryRef, originVertexId, twinHalfEdgeId,
 *             nextHalfEdgeId, previousHalfEdgeId, faceId}` — no `destinationVertexId`, because
 *             the destination IS `twin.origin`;
 *   ADOPTED · the vertex record `{vertexId, geometryRef, incidentHalfEdgeId}` carrying NO
 *             coordinates — geometry lives in the arrangement and the DCEL refers to it;
 *   ADOPTED · the LEFT-FACE `next` rule via an angular ray order around each vertex, computed
 *             with EXACT integer cross products and no trig;
 *   ADOPTED · the orientation convention — a positive shoelace cycle is `BOUNDED`, a negative one
 *             is the boundary of unbounded space;
 *   ADOPTED · adjacency expressed by TWINS and derived on demand, never stored.
 *
 * ⛔⛔ AND FOUR PLACES WHERE IT CANNOT, EACH RECORDED PRECISELY BECAUSE THE §299.2 PORT QUESTION
 * TURNS ON THEM:
 *
 *   1. **FLOATS AND EXTENT.** The codex kernel refuses anything failing
 *      `Number.isSafeInteger(v) && 0 <= v <= 1000`. The sandbox works in floats over a frame that
 *      measures |coordinate| up to 1,286.63. **This module quantizes through the D1 coordinate
 *      ABI instead of refusing** — which is the same instinct the codex had, versioned. The
 *      exactness the codex's `orient`/`compareRay` depend on is what the ABI supplies.
 *   2. **HOLES / FOSSIL RINGS.** The codex face record is `{faceId, faceKind,
 *      boundaryHalfEdgeId}` — ONE boundary, singular — and its landed test asserts the byte
 *      `"holes"` never appears. A demoted circuit nested inside a live one is exactly a hole, and
 *      this fabric publishes them. **Divergence: `faces[].innerBoundaryHalfEdgeIds`.**
 *   3. **ONE `outerFaceId` FOR THE WHOLE ARRANGEMENT.** The codex picks the FIRST negative cycle
 *      in hash order, which is correct only under its one-negative-cycle census; with a hole or a
 *      second component present it can name the hole. **Divergence: `outerFaceIds`, one per
 *      connected component, each the most-negative cycle of its own component.**
 *   4. **OPEN CHAINS.** The codex throws `DCEL face must have nonzero signed area` on any
 *      component with no closed cycle. A half-ring bankside circuit — a wall that runs to the
 *      water and stops — is exactly that. **Divergence: a zero-area cycle is typed `DEGENERATE`
 *      and reported, never thrown**, because refusing the fabric's real output is not a
 *      reconciliation.
 *
 * ⭐ PLUS ONE FACILITY THE CODEX DOES NOT HAVE AT ALL: **point location.** Both its packets list
 * it as an explicit non-goal, so §287.8's "face/adjacency/point-location" third leg is minted
 * here, under the ABI's declared `boundaryRule: 'CLOSED'`.
 *
 * ⚠ NOTHING IN THE GENERATION PATH IMPORTS THIS MODULE. It is a dual-run oracle; SPEC §10.15(4)
 * is explicit — *"keep consumers on the legacy accessor until every equivalence gate passes."*
 *
 * PURITY: pure. Integer and BigInt arithmetic, `+ − × ÷`, `Math.sqrt` via the geometry core. No
 * Date, no Math.random, no trig, no locale ordering.
 */

import { bounds, offsetLine, pointLocateRing, properCross, segIntersect } from './fabricGeometry.js';
import { COORDINATE_ABI_VERSION, worldQ } from './coordinateAbi.js';

export const ARRANGEMENT_KIND = 'CADASTRAL_BOUNDARY_ARRANGEMENT';
export const EMBEDDING_KIND = 'XY_LEFT_FACE_V1';
export const ARRANGEMENT_SCHEMA_VERSION = 1;

/**
 * ⭐⭐⭐ ⟦§303.6 / MF-D1 RAISED-7⟧ **THE ARRANGEMENT QUANTUM LADDER — the grids the arrangement's
 * nodes may live on, declared in ABI units and coherent with the ABI by construction.**
 *
 * ⛔⛔ THE DEFECT, AND IT IS A FIXED POINT RATHER THAN A BUDGET. MF-D1 measured **6 of 17 leaves
 * carrying a `residualProperCrossings` of 2 that MORE PASSES DO NOT CLEAR** — raising the pass
 * cap 6 → 14 changed nothing. The cause is snap-rounding at the finest possible grid: a split
 * point rounded to ONE ABI unit can land a hair on the wrong side and re-create the crossing the
 * split was meant to remove, so pass N+1 finds what pass N made. ⭐ Euler's `V − E + F = 1 + C`
 * is the independent oracle that convicted it: the identity held on EXACTLY the eleven leaves
 * whose residual was 0 and failed on EXACTLY the six that carried 2.
 *
 * ⭐⭐ THE CHAIR'S PRIOR — snap-round to a declared quantum coherent with the ABI — IS ADOPTED,
 * AND IT WORKS. The alternative, exact rational intersection points, fights the ABI's whole
 * philosophy: the ABI exists so that geometric identity is an INTEGER question, and a rational
 * arrangement would make the topology's identity depend on a representation the ABI does not
 * publish. A coarser grid is the same idea one level up.
 *
 * ⛔⛔ **BUT THE PRIOR'S IMPLICIT HALF IS REFUTED BY MEASUREMENT, AND THE SHAPE OF THE CURE TURNS
 * ON IT: THE RESIDUAL IS NOT MONOTONE IN THE QUANTUM.** Swept over the whole corpus
 * (`laneMFW3F-noding-sweep.log`), leaves still carrying a residual:
 *
 *   quantum (ABI units)     1      100     1000     5000    20000   100000
 *   leaves with a residual  6        8        2        0        9        0
 *
 * Coarsening MERGES nodes, and a merge can create a crossing between two segments that were
 * cleanly apart — so "coarser is safer" is false, and a single fitted constant would be a number
 * chosen because it happened to work on eighteen leaves. ⭐ THE CLASS: **SNAP-ROUNDING TRADES ONE
 * FAILURE MODE FOR ANOTHER RATHER THAN REDUCING ONE**, and a cure justified by "we picked a good
 * value" is fitted to the corpus by construction.
 *
 * ⭐⭐⭐ SO THE DECLARATION IS A **LADDER**, NOT A CONSTANT. The noder takes the FIRST rung that
 * nodes to zero residual and the arrangement PUBLISHES the rung it used, so the choice is data a
 * consumer can read rather than a constant a reader must trust. A leaf that clears at no rung
 * publishes its residual honestly and Euler convicts it — the instrument keeps its oracle.
 *
 * ⚠ EVERY RUNG IS A MULTIPLE OF THE ABI QUANTUM, NEVER A NEW UNIT: 1e-3, 5e-3 and 2.5e-2 world
 * units against a narrowest drawn channel of ~2 units, so the coarsest rung is 1/80 of the
 * narrowest alley and no boundary moves visibly.
 * ⚠ UNSOAKED; the rungs are declared arrangement parameters and ride the tuning signature.
 */
export const ARRANGEMENT_QUANTUM_LADDER = Object.freeze([1000, 5000, 25000]);

/** The finest rung — what an arrangement uses when nothing forces it coarser. */
export const ARRANGEMENT_QUANTUM = ARRANGEMENT_QUANTUM_LADDER[0];

/** The boundary roles §10.15 enumerates. `CLIFF` is declared and EMPTY in this era — the
 *  substrate carries crag CELLS, not an escarpment boundary, and inventing one from a raster
 *  threshold would be a new derivation wearing a foundation's name. */
export const BOUNDARY_ROLES = Object.freeze(['STREET_RIGHT_OF_WAY', 'WALL_FACE', 'WATER_EDGE',
  'CLIFF_EDGE']);

const key2 = (p) => `${p[0]},${p[1]}`;

/** Exact orientation in BigInt. ⚠ IT MUST BE BigInt: ABI quanta reach ~1.3e9, so a cross product
 *  of coordinate differences reaches ~1e19 and silently leaves the safe-integer range. A float
 *  sign here would make the angular order at a vertex non-deterministic, which is the one thing
 *  the whole embedding rests on. */
function orient2(ax, ay, bx, by) {
  const v = BigInt(ax) * BigInt(by) - BigInt(ay) * BigInt(bx);
  return v > 0n ? 1 : (v < 0n ? -1 : 0);
}

/** Which half-plane a ray points into — the codex's own `halfPlane`, adopted verbatim in shape. */
const halfPlane = (dx, dy) => (dy > 0 || (dy === 0 && dx >= 0) ? 0 : 1);

/**
 * ⭐⭐ THE ARRANGEMENT. Quantized boundary segments from the fabric's real output, noded so that
 * every intersection is a shared endpoint — the precondition the codex embedder assumes and the
 * sandbox does not supply.
 *
 * @param {any} fabric a published fabric
 * @param {{ streets?:boolean, walls?:boolean, water?:boolean, ranks?:string[] }} [opts]
 */
export function buildBoundaryArrangement(fabric, opts = {}) {
  const want = { streets: true, walls: true, water: true, ...opts };
  /** @type {{a:number[],b:number[],role:string,sourceId:string}[]} */
  const raw = [];
  const push = (p, q, role, sourceId) => {
    const a = [worldQ(p[0]), worldQ(p[1])], b = [worldQ(q[0]), worldQ(q[1])];
    if (a[0] === null || a[1] === null || b[0] === null || b[1] === null) return;
    if (a[0] === b[0] && a[1] === b[1]) return;
    raw.push({ a, b, role, sourceId });
  };
  const pushLine = (line, role, sourceId, closed) => {
    if (!line || line.length < 2) return;
    for (let i = 0; i + 1 < line.length; i++) push(line[i], line[i + 1], role, sourceId);
    if (closed) push(line[line.length - 1], line[0], role, sourceId);
  };

  if (want.streets) {
    const ranks = opts.ranks ? new Set(opts.ranks) : null;
    for (const ch of fabric.channels || []) {
      if (ranks && !ranks.has(ch.rank)) continue;
      const half = (ch.width || 0) / 2;
      if (!(half > 0)) continue;
      // THE RIGHT-OF-WAY BOUNDARY IS THE KERB PAIR, NOT THE CENTRELINE. §10.15 says so in terms:
      // "quantized street right-of-way boundaries emitted by StreetGeometry"; a centreline is a
      // route, and a route does not bound a face.
      pushLine(offsetLine(ch.line, half), 'STREET_RIGHT_OF_WAY', `${ch.key || ch.rank}|L`, false);
      pushLine(offsetLine(ch.line, -half), 'STREET_RIGHT_OF_WAY', `${ch.key || ch.rank}|R`, false);
    }
  }
  if (want.walls) {
    for (const [i, ring] of (fabric.walls || []).entries()) {
      pushLine(ring.polygon, 'WALL_FACE', `wall.${ring.epoch ?? i}`, !ring.halfRing);
    }
  }
  if (want.water && fabric.water && fabric.water.line) {
    const w = fabric.water;
    const half = (w.width || 0) / 2;
    if (half > 0) {
      pushLine(offsetLine(w.line, half), 'WATER_EDGE', 'water|L', false);
      pushLine(offsetLine(w.line, -half), 'WATER_EDGE', 'water|R', false);
    } else pushLine(w.line, 'WATER_EDGE', 'water', false);
  }

  // ⭐⭐ THE LADDER IS WALKED, NOT GUESSED. The first rung that nodes to ZERO wins; if none does,
  // the FINEST attempt is kept — a coarser arrangement that is still not planar buys nothing and
  // would hide the defect behind a grid nobody asked for.
  let noded = null;
  for (const q of ARRANGEMENT_QUANTUM_LADDER) {
    const attempt = nodeSegments(raw, 14, q);
    if (noded === null) noded = attempt;
    if (attempt.residual === 0) { noded = attempt; break; }
  }
  return Object.freeze({
    artifactKind: ARRANGEMENT_KIND,
    schemaVersion: ARRANGEMENT_SCHEMA_VERSION,
    coordinateAbiVersion: COORDINATE_ABI_VERSION,
    boundaries: noded.segments,
    rawSegmentCount: raw.length,
    arrangementQuantum: noded.quantum,
    arrangementQuantumLadder: ARRANGEMENT_QUANTUM_LADDER,
    nodingPasses: noded.passes,
    residualProperCrossings: noded.residual,
    splitCount: noded.splits,
    duplicatesDropped: noded.duplicates,
    roles: BOUNDARY_ROLES,
    cliffEdges: 0,
  });
}

/**
 * ⭐ THE NODING PASS. A uniform grid buckets segments so the sweep is local; each pair that
 * properly crosses is split at the quantized intersection. Bounded passes, and the RESIDUAL is
 * REPORTED rather than assumed away — quantizing a split point can, in principle, create a new
 * crossing, and a noder that claimed zero without counting would be exactly the vacuous instrument
 * this programme keeps finding.
 */
function nodeSegments(raw, maxPasses = 14, quantum = ARRANGEMENT_QUANTUM) {
  const snap = (v) => Math.round(v / quantum) * quantum;
  // ⭐⭐ ⟦§303.6⟧ THE ENDPOINTS ARE SNAPPED TOO, AND THAT IS THE HALF THAT MAKES IT WORK. Snapping
  // only the SPLIT points puts a node off the segment it was supposed to lie on, which is a new
  // crossing manufactured by the repair. Both ends and every cut live on one grid or the
  // arrangement is not on a grid at all.
  let segs = raw.map((s) => ({ ...s, a: [snap(s.a[0]), snap(s.a[1])], b: [snap(s.b[0]), snap(s.b[1])] }))
    .filter((s) => s.a[0] !== s.b[0] || s.a[1] !== s.b[1]);
  let splits = 0, passes = 0, residual = 0;
  for (; passes < maxPasses; passes++) {
    const cuts = new Map();
    residual = 0;
    const cell = gridCell(segs);
    const grid = new Map();
    segs.forEach((s, i) => {
      const lox = Math.floor(Math.min(s.a[0], s.b[0]) / cell), hix = Math.floor(Math.max(s.a[0], s.b[0]) / cell);
      const loy = Math.floor(Math.min(s.a[1], s.b[1]) / cell), hiy = Math.floor(Math.max(s.a[1], s.b[1]) / cell);
      for (let gy = loy; gy <= hiy; gy++) {
        for (let gx = lox; gx <= hix; gx++) {
          const k = `${gx}|${gy}`;
          const b = grid.get(k);
          if (b) b.push(i); else grid.set(k, [i]);
        }
      }
    });
    const seen = new Set();
    for (const bucket of grid.values()) {
      for (let x = 0; x < bucket.length; x++) {
        for (let y = x + 1; y < bucket.length; y++) {
          const i = bucket[x], j = bucket[y];
          const pk = i < j ? `${i}:${j}` : `${j}:${i}`;
          if (seen.has(pk)) continue;
          seen.add(pk);
          const s = segs[i], t = segs[j];
          if (!properCross(s.a, s.b, t.a, t.b)) continue;
          const p = segIntersect(s.a, s.b, t.a, t.b);
          if (!p) continue;
          const q = [snap(p[0]), snap(p[1])];
          residual++;
          for (const [idx, seg] of [[i, s], [j, t]]) {
            if (key2(q) === key2(seg.a) || key2(q) === key2(seg.b)) continue;
            if (!cuts.has(idx)) cuts.set(idx, []);
            cuts.get(idx).push(q);
          }
        }
      }
    }
    if (!cuts.size) break;
    const next = [];
    segs.forEach((s, i) => {
      const cl = cuts.get(i);
      if (!cl || !cl.length) { next.push(s); return; }
      const along = (p) => (Math.abs(s.b[0] - s.a[0]) >= Math.abs(s.b[1] - s.a[1])
        ? (p[0] - s.a[0]) / ((s.b[0] - s.a[0]) || 1)
        : (p[1] - s.a[1]) / ((s.b[1] - s.a[1]) || 1));
      const pts = [s.a, ...cl, s.b]
        .filter((p, k, arr) => arr.findIndex((z) => key2(z) === key2(p)) === k)
        .sort((p, q) => along(p) - along(q));
      for (let k = 0; k + 1 < pts.length; k++) {
        if (key2(pts[k]) === key2(pts[k + 1])) continue;
        next.push({ ...s, a: pts[k], b: pts[k + 1] });
        splits++;
      }
    });
    segs = next;
  }
  // dedupe by unordered endpoint pair; a duplicated boundary is one boundary
  const byKey = new Map();
  let duplicates = 0;
  for (const s of segs) {
    const k = key2(s.a) < key2(s.b) ? `${key2(s.a)}~${key2(s.b)}` : `${key2(s.b)}~${key2(s.a)}`;
    if (byKey.has(k)) { duplicates++; continue; }
    byKey.set(k, s);
  }
  const out = [...byKey.entries()].sort((p, q) => (p[0] < q[0] ? -1 : 1))
    .map(([k, s], i) => Object.freeze({
      boundaryId: `b${i}`, geometry: [s.a, s.b], role: s.role, sourceId: s.sourceId, lineKey: k,
    }));
  return { segments: Object.freeze(out), passes: passes + 1, residual, splits, duplicates, quantum };
}

function gridCell(segs) {
  if (!segs.length) return 1;
  let sum = 0;
  for (const s of segs) sum += Math.abs(s.b[0] - s.a[0]) + Math.abs(s.b[1] - s.a[1]);
  return Math.max(1, Math.round(sum / segs.length));
}

/**
 * ⭐⭐⭐ THE PLANAR DCEL. Two half-edges per boundary, the left-face `next` rule via the angular
 * order around each vertex, faces by cycle walk, holes by containment, one outer face PER
 * COMPONENT.
 */
export function derivePlanarDcel(arrangement) {
  const B = arrangement.boundaries;
  const vertexIdByKey = new Map();
  const coordOf = new Map();
  const outgoing = new Map();
  const edges = [];
  for (const b of B) {
    for (const [ei, p] of b.geometry.entries()) {
      const k = key2(p);
      if (!vertexIdByKey.has(k)) {
        vertexIdByKey.set(k, `v${vertexIdByKey.size}`);
        coordOf.set(vertexIdByKey.get(k), p);
        outgoing.set(vertexIdByKey.get(k), []);
      }
      const he = { halfEdgeId: `${b.boundaryId}#${ei}`, boundaryId: b.boundaryId, endpointIndex: ei,
        originVertexId: vertexIdByKey.get(k), role: b.role, sourceId: b.sourceId };
      edges.push(he);
    }
  }
  const byId = new Map(edges.map((e) => [e.halfEdgeId, e]));
  const twinOf = new Map();
  for (const e of edges) twinOf.set(e.halfEdgeId, `${e.boundaryId}#${1 - e.endpointIndex}`);
  for (const e of edges) outgoing.get(e.originVertexId).push(e.halfEdgeId);

  // CANONICAL ANGULAR ORDER around each vertex — exact integer cross products, no trig.
  for (const [vid, list] of outgoing) {
    const o = coordOf.get(vid);
    const vec = (id) => {
      const dest = coordOf.get(byId.get(twinOf.get(id)).originVertexId);
      return [dest[0] - o[0], dest[1] - o[1]];
    };
    list.sort((p, q) => {
      const u = vec(p), w = vec(q);
      const h = halfPlane(u[0], u[1]) - halfPlane(w[0], w[1]);
      if (h) return h;
      const c = orient2(u[0], u[1], w[0], w[1]);
      if (c !== 0) return c > 0 ? -1 : 1;
      return p < q ? -1 : 1;      // exact collinear tie: canonical, never a throw
    });
  }

  // THE LEFT-FACE RULE: next(e) = the edge BEFORE twin(e) in the destination's angular order.
  const nextOf = new Map(), prevOf = new Map();
  for (const e of edges) {
    const t = twinOf.get(e.halfEdgeId);
    const dest = byId.get(t).originVertexId;
    const ring = outgoing.get(dest);
    const i = ring.indexOf(t);
    const n = ring[(i - 1 + ring.length) % ring.length];
    nextOf.set(e.halfEdgeId, n);
    prevOf.set(n, e.halfEdgeId);
  }

  // FACES by cycle walk, in a canonical start order.
  const unvisited = new Set(edges.map((e) => e.halfEdgeId).sort());
  const cycles = [];
  while (unvisited.size) {
    const start = unvisited.values().next().value;
    const walked = [];
    let cur = start;
    do {
      if (!unvisited.delete(cur)) break;
      walked.push(cur);
      cur = nextOf.get(cur);
      if (!cur || walked.length > edges.length) break;
    } while (cur !== start);
    let a2 = 0n;
    for (let i = 0; i < walked.length; i++) {
      const p = coordOf.get(byId.get(walked[i]).originVertexId);
      const q = coordOf.get(byId.get(walked[(i + 1) % walked.length]).originVertexId);
      a2 += BigInt(p[0]) * BigInt(q[1]) - BigInt(p[1]) * BigInt(q[0]);
    }
    cycles.push({ halfEdgeIds: walked, area2: a2 });
  }

  // COMPONENTS, so each gets its OWN outer face — the codex's single `outerFaceId` is the latent
  // defect this divergence exists to close.
  const comp = new Map();
  let ci = 0;
  const seenV = new Set();
  for (const vid of [...coordOf.keys()].sort()) {
    if (seenV.has(vid)) continue;
    const stack = [vid];
    seenV.add(vid);
    while (stack.length) {
      const v = stack.pop();
      comp.set(v, ci);
      for (const he of outgoing.get(v)) {
        const d = byId.get(twinOf.get(he)).originVertexId;
        if (!seenV.has(d)) { seenV.add(d); stack.push(d); }
      }
    }
    ci++;
  }

  const faces = cycles.map((c, i) => {
    const v0 = byId.get(c.halfEdgeIds[0]).originVertexId;
    return {
      faceId: `f${i}`,
      faceKind: c.area2 > 0n ? 'BOUNDED' : (c.area2 < 0n ? 'OUTER_CYCLE' : 'DEGENERATE'),
      boundaryHalfEdgeId: c.halfEdgeIds[0],
      halfEdgeIds: c.halfEdgeIds,
      area2: c.area2,
      component: comp.get(v0),
      innerBoundaryHalfEdgeIds: [],
    };
  });
  const faceByHalfEdge = new Map();
  for (const f of faces) for (const he of f.halfEdgeIds) faceByHalfEdge.set(he, f.faceId);

  // ONE OUTER FACE PER COMPONENT: the most-negative cycle of that component.
  const outerFaceIds = [];
  const byComp = new Map();
  for (const f of faces) {
    if (f.faceKind !== 'OUTER_CYCLE') continue;
    const cur = byComp.get(f.component);
    if (!cur || f.area2 < cur.area2) byComp.set(f.component, f);
  }
  for (const [, f] of [...byComp.entries()].sort((a, b) => a[0] - b[0])) outerFaceIds.push(f.faceId);
  const outerSet = new Set(outerFaceIds);
  for (const f of faces) if (f.faceKind === 'OUTER_CYCLE' && !outerSet.has(f.faceId)) f.faceKind = 'HOLE_CYCLE';

  const halfEdges = edges.map((e) => Object.freeze({
    halfEdgeId: e.halfEdgeId,
    boundaryRef: { kind: 'BOUNDARY', boundaryId: e.boundaryId, role: e.role, sourceId: e.sourceId },
    originVertexId: e.originVertexId,
    twinHalfEdgeId: twinOf.get(e.halfEdgeId),
    nextHalfEdgeId: nextOf.get(e.halfEdgeId),
    previousHalfEdgeId: prevOf.get(e.halfEdgeId),
    faceId: faceByHalfEdge.get(e.halfEdgeId),
  }));

  return Object.freeze({
    artifactKind: 'PLANAR_DCEL',
    embeddingKind: EMBEDDING_KIND,
    coordinateAbiVersion: COORDINATE_ABI_VERSION,
    vertices: Object.freeze([...coordOf.keys()].sort().map((vid) => Object.freeze({
      vertexId: vid,
      geometryRef: { kind: 'BOUNDARY_ENDPOINT', point: coordOf.get(vid) },
      incidentHalfEdgeId: outgoing.get(vid)[0],
      component: comp.get(vid),
    }))),
    halfEdges: Object.freeze(halfEdges),
    faces: Object.freeze(faces.map(Object.freeze)),
    outerFaceIds: Object.freeze(outerFaceIds),
    // ⭐ THE POINT-LOCATION INDEX, built once. Recomputing a 2,172-vertex ring per query per face
    // is what turned the first dual-run into a wall-clock failure rather than a measurement.
    faceIndex: Object.freeze(faces.map((f) => {
      const ring = f.halfEdgeIds.map((id) => coordOf.get(byId.get(id).originVertexId));
      return Object.freeze({ face: f, ring, bb: ring.length >= 3 ? bounds(ring) : null });
    })),
    componentCount: ci,
    degenerateFaces: faces.filter((f) => f.faceKind === 'DEGENERATE').length,
    holeCycles: faces.filter((f) => f.faceKind === 'HOLE_CYCLE').length,
    coordOf,
  });
}

/** A face's ring, in ABI integer coordinates. */
export function faceRing(dcel, face) {
  if (dcel.faceIndex) {
    const hit = dcel.faceIndex.find((e) => e.face.faceId === face.faceId);
    if (hit) return hit.ring;
  }
  const byId = new Map(dcel.halfEdges.map((h) => [h.halfEdgeId, h]));
  return face.halfEdgeIds.map((id) => dcel.coordOf.get(byId.get(id).originVertexId));
}

/**
 * ⭐⭐⭐ ⟦S8 · §239.1 / §303.9⟧ **BLOCKS AS THE PLANAR FACES OF THE STREET GRAPH — the stage the
 * manifest publishes as UNBUILT, built.**
 *
 * ⛔⛔ WHAT IT REPLACES AND WHY THE NUMBER MATTERED. SPEC §1.0 grades S8 PARTIAL with §239.1 NOT
 * BUILT: blocks are **CUT by the packer**, not DERIVED as faces, so a block is not required to be
 * enclosed by anything. MF-D1 measured the size of that hole from the other side — **84.8% of
 * legacy blocks land in a bounded face of the boundary arrangement and 15.2% land in no cycle at
 * all**, because 291 of town's 301 arrangement components are open kerb chains that close nothing.
 * The gap is not the DCEL's defect; it is the measured size of the S8 hole.
 *
 * ⭐⭐ THE INPUT IS **WALL AND STREET ONLY**, AND THAT IS A RULING RATHER THAN A SIMPLIFICATION.
 * §297.2(b): block termination is **RATIFIED for wall/street** (post-hoc trimming's fragility is
 * measured) and **HELD for water/cliff until the water-edge definition lands** (G-34's
 * bankside-vs-transit machinery). A face closed by a water edge would be a block whose boundary
 * the programme has not yet defined, so the water is excluded BY THE RULING and the exclusion
 * travels in the result rather than in a comment.
 *
 * ⭐ A DERIVED BLOCK IS A BOUNDED FACE AND NOTHING ELSE. It carries no grain angle, no rank and
 * no row/col: those are the PACKER's facts about its own cut, and inventing them here would be
 * the dimensional-adapter refusal in miniature. What it carries is what a face IS — its ring, its
 * area, and the roles of the boundaries that close it.
 *
 * ⚠ READ-SIDE ONLY. This module is on the `FOUNDATIONS` manifest node, which the walker keeps
 * OUTBOUND-EDGE-FREE: nothing in the generation path may import it, so S8 is built here as an
 * equivalence subject for the post-W3 cutover gate (§10.15(2)), never as a live producer.
 *
 * @param {any} fabric @param {{ranks?:string[]}} [opts]
 * @returns {{blocks:Array<any>, arrangement:any, dcel:any, waterExcluded:true, reason:string}}
 */
export function deriveBlockFaces(fabric, opts = {}) {
  const arrangement = buildBoundaryArrangement(fabric, {
    streets: true, walls: true, water: false, ...opts,
  });
  const dcel = derivePlanarDcel(arrangement);
  // ⚠ THE ROLE IS ON THE HALF-EDGE'S OWN `boundaryRef` RECORD, not looked up by id. The codex
  // contract this embedding adopts carries `{kind, boundaryId, role, sourceId}` there precisely
  // so a face can name what closes it without a second index — and a lookup keyed on the wrong
  // field returns `undefined` for every edge, which reads as "closed by nothing" rather than as
  // an error. (It did, on the first run: 16,079 of 16,079 faces reported wall-only, including on
  // a thorp with no wall — an impossible number is the cheapest possible detector.)
  const byId = new Map(dcel.halfEdges.map((h) => [h.halfEdgeId, h]));
  const blocks = [];
  for (const f of dcel.faces) {
    if (f.faceKind !== 'BOUNDED') continue;
    const ring = faceRing(dcel, f);
    if (!ring || ring.length < 3) continue;
    /** @type {Record<string, number>} */ const roles = {};
    for (const id of f.halfEdgeIds) {
      const he = byId.get(id);
      const r = he && he.boundaryRef && he.boundaryRef.role;
      if (r) roles[r] = (roles[r] || 0) + 1;
    }
    let a2 = 0n;
    for (let i = 0; i < ring.length; i++) {
      const p = ring[i], q = ring[(i + 1) % ring.length];
      a2 += BigInt(p[0]) * BigInt(q[1]) - BigInt(q[0]) * BigInt(p[1]);
    }
    blocks.push(Object.freeze({
      blockFaceId: f.faceId,
      ring,
      // ⚠ THE AREA IS IN **SQUARED ABI QUANTA** and is reported as a BigInt-derived Number, so a
      // caller cannot mistake it for a world-unit area without converting through the ABI.
      areaQ2: Number((a2 < 0n ? -a2 : a2) / 2n),
      boundaryRoles: Object.freeze(roles),
      closedByWallOnly: !roles.STREET_RIGHT_OF_WAY,
    }));
  }
  return Object.freeze({
    blocks: Object.freeze(blocks),
    arrangement,
    dcel,
    waterExcluded: true,
    reason: `${blocks.length} block faces derived from ${arrangement.boundaries.length} noded`
      + ` wall/street boundaries at arrangement quantum ${arrangement.arrangementQuantum}`
      + ' — water and cliff edges are HELD OUT per §297.2b until the water-edge definition lands',
  });
}

/**
 * ⭐⭐ ADJACENCY, DERIVED ON DEMAND FROM TWINS — never stored, exactly as the codex's landed
 * ratchet requires (`"adjacency"` is a forbidden byte in its serialized artifact).
 * @returns {Map<string, Set<string>>} faceId → neighbouring faceIds
 */
export function faceAdjacency(dcel) {
  const byId = new Map(dcel.halfEdges.map((h) => [h.halfEdgeId, h]));
  const adj = new Map(dcel.faces.map((f) => [f.faceId, new Set()]));
  for (const h of dcel.halfEdges) {
    const t = byId.get(h.twinHalfEdgeId);
    if (!t || h.faceId === t.faceId) continue;
    adj.get(h.faceId).add(t.faceId);
  }
  return adj;
}

/**
 * ⭐⭐⭐ POINT LOCATION — the facility the codex slice lists as an explicit non-goal, so §287.8's
 * third leg is minted here. The ABI declares `boundaryRule: 'CLOSED'`, so a point ON a boundary is
 * returned as `BOUNDARY` with the faces it lies on, rather than being folded into either side.
 *
 * @param {any} dcel @param {number} x @param {number} y map units, not quanta
 */
export function locateFace(dcel, x, y) {
  const px = worldQ(x), py = worldQ(y);
  if (px === null || py === null) return { kind: 'OUTSIDE_ABI', faceId: null };
  // ⭐ EVERY CYCLE IS A CANDIDATE, NOT ONLY THE POSITIVE ONES. A point can be enclosed by a
  // NEGATIVE cycle — that is what an outer boundary walked with the unbounded side on the left
  // looks like — and a search restricted to BOUNDED faces silently answers OUTER for every point
  // inside a component whose boundary does not close a positive ring. That restriction was this
  // module's own first defect and it is what the §10.15 dual-run caught.
  let best = null, bestArea = null, bestVerdict = null;
  const hits = [];
  for (const e of dcel.faceIndex) {
    if (e.face.faceKind === 'DEGENERATE' || !e.bb) continue;
    if (px < e.bb[0] || px > e.bb[2] || py < e.bb[1] || py > e.bb[3]) continue;
    const v = pointLocateRing(e.ring, px, py, 0.5);
    if (v === 'OUTSIDE') continue;
    hits.push(e.face.faceId);
    // THE SMALLEST CONTAINING CYCLE is the region the point is in; a larger cycle contains it
    // only because this arrangement carries nested rings (a fossil circuit inside a live one).
    const a = e.face.area2 < 0n ? -e.face.area2 : e.face.area2;
    // ⭐ AT EQUAL |AREA| A BOUNDED CYCLE WINS. A closed ring produces TWO walks of identical
    // magnitude — the region and its complement's boundary — and picking by iteration order
    // would make point location depend on hash order. The region is the answer; the outer walk
    // is the same curve read from the other side.
    const better = bestArea === null || a < bestArea
      || (a === bestArea && e.face.faceKind === 'BOUNDED' && best.faceKind !== 'BOUNDED');
    if (better) { bestArea = a; best = e.face; bestVerdict = v; }
  }
  if (!best) return { kind: 'OUTER', faceId: dcel.outerFaceIds[0] || null, faces: [] };
  if (bestVerdict === 'BOUNDARY') {
    return { kind: 'BOUNDARY', faceId: best.faceId, faceKind: best.faceKind, faces: hits };
  }
  return {
    kind: best.faceKind === 'BOUNDED' ? 'INSIDE' : 'ENCLOSED_BY_OUTER_CYCLE',
    faceId: best.faceId,
    faceKind: best.faceKind,
    faces: hits,
  };
}

