/**
 * domain/townMap/fabric/partitionArrangement.js — ⭐⭐⭐ SPINE-1 · DESIGN_SPINE §1 + **Amendment
 * A1.6** · **THE PARTITION'S SUBSTRATE: ONE MAINTAINED PLANAR SUBDIVISION, GROWN BY LOCAL SPLITS.**
 *
 * DESIGN_SPINE §1 in one sentence: *"THE PARTITION is a planar subdivision of the settled ground,
 * per growth-ledger epoch, with three levels of face and five types of edge"* — six types under
 * A1.7's CLIFF. This module is the structure; `partitionConstruct.js` is what builds one and
 * `partitionView.js` is what draws one.
 *
 * ⛔⛔ **WHY THIS IS NOT `fabricDcel.js`, AND THE PANEL MEASURED THE REASON.** The performance lens
 * (S4) refuted batch per-epoch re-noding by execution at the seal: the CURRENT-scope arrangement
 * (streets+walls+water, 11,583 segments, zero plot faces) already costs **1.73–1.78 s at
 * metropolis**; a synthetic plot mesh at the design's own scale cost **39.2 s** with cross-class
 * geometry, and at 9,000 plots planarity **failed outright** — `residualProperCrossings=2`
 * persisting through the whole quantum ladder, the same fixed point `fabricDcel.js:85-96` records
 * on 6 of 17 REAL corpus leaves. ~40 banded epochs × batch rebuild prices at ~26 s best case to
 * 400–680 s adversarial against a ≤2.5 s budget. **A1.6 rules the constructor INCREMENTAL** and
 * this module is that ruling's data structure.
 *
 * ⭐⭐⭐ **THE ONE IDEA THAT MAKES IT EXACT: THE ARRANGEMENT IS NEVER NODED, ONLY SPLIT.** Every
 * construction act is a LOCAL topological operation on a structure that is already planar:
 *
 *   `splitEdge`      — put a vertex ON an existing edge. The edge becomes two. O(1).
 *   `splitFaceChain` — connect two vertices of ONE face's cycle by a chain that lies strictly
 *                      inside it. The face becomes two. O(cycle).
 *
 * A chord drawn strictly inside one face cannot cross anything, because everything else is outside
 * that face. So **planarity is an invariant of the operations rather than a property repaired
 * afterwards**, there is no noder, no residual, no quantum ladder, and — the half that matters for
 * §3c and §3g — **no global re-snap can ever move a frozen wrap or an already-emitted delta**,
 * which is the collision S4(d) named against the ladder.
 *
 * ⭐⭐ **SNAP-ROUNDING IS ABSORBED INTO THE EDGE, NOT INTO A CROSSING.** A cut point computed on a
 * face boundary is generally not on the integer grid. Rounding it to the grid and then *declaring
 * it a crossing* is precisely the manufactured-crossing class that defeated the noder. Here the
 * rounded point is handed to `splitEdge`, which makes it a genuine vertex of both new edges — the
 * boundary bends by at most half a quantum (**5e-4 world units, 1/4,000 of the narrowest drawn
 * alley**) and the topology is exact by construction. Geometry may drift; topology never breaks.
 *
 * ⚠ THE ONE REFUSAL, COUNTED RATHER THAN ASSUMED AWAY. Half-quantum bends can, in principle, make
 * a chord that was interior graze a boundary. `splitFaceChain` verifies interiority with exact
 * integer predicates and REFUSES rather than corrupting, incrementing `refusals` with a reason. A
 * partition with refusals is an honest partition with a published count; a partition that split
 * anyway would be the vacuous-green class this programme keeps finding.
 *
 * ⭐ INTEGER COORDINATES, PLAIN NUMBERS, NO BigInt. Coordinates live on a **1e-3 world-unit** grid,
 * so |coordinate| ≤ ~1.3e6 and a cross product of coordinate differences ≤ ~7e12 — an order of
 * magnitude inside `Number.MAX_SAFE_INTEGER`, hence exact. `fabricDcel.js` needs BigInt only
 * because the ABI's 1e-6 grid puts the same product at ~1e19. ⚠ THE GRID IS THE SAME ONE the
 * arrangement ladder's finest rung declares (`ARRANGEMENT_QUANTUM_LADDER[0] = 1000` ABI units =
 * 1e-3 world units); it is spelled locally and PINNED EQUAL BY TEST rather than imported, because
 * `coordinateAbi.js` sits on the `FOUNDATIONS` node which the stage-manifest walker keeps
 * OUTBOUND-EDGE-FREE — an import here would red arm 10.
 *
 * PURITY: pure. Integer arithmetic, no Date, no Math.random, no trig, no I/O.
 */

/**
 * ⭐⭐ THE PARTITION GRID. One quantum unit = 1e-3 world units.
 * ⚠ PINNED EQUAL to `fabricDcel.ARRANGEMENT_QUANTUM_LADDER[0] / GEOMETRY_QUANTUM.denominator` by
 *   `tests/domain/townMapPartitionArrangement.test.js`, not by import (see the header).
 */
export const PARTITION_QUANTUM_PER_UNIT = 1000;

/** Half a quantum in world units — the maximum a boundary may bend at a cut. */
export const PARTITION_SNAP_TOLERANCE = 0.5 / PARTITION_QUANTUM_PER_UNIT;

/**
 * ⭐⭐ THE DEGENERACY FLOOR, in world units. A cut whose chord is shorter than this is refused
 * rather than made. ⚠ IT IS **40 QUANTA**, not one: a chord of a few quanta produces vertices the
 * grid can barely separate and edges whose orientation is decided by rounding, and those are what
 * a planarity sweep later reports as crossings. 0.04 world units is 1/50 of the narrowest drawn
 * alley, so nothing a reader could see is refused by it.
 */
export const CHORD_FLOOR = 40 / PARTITION_QUANTUM_PER_UNIT;

/**
 * ⭐⭐⭐ THE FACE CLASSES (§1 + A1.3 + A1.4). Coarse→fine pieces, plus the special classes.
 *
 * ⚠ `WAY` IS A FACE CLASS AND THAT IS §1's OWN SENTENCE TAKEN LITERALLY, not an addition: *"a way
 * is a GAP between faces — it has width but no existence apart from its flanking faces."* A gap
 * with width is ground, and the coverage invariant says the settled ground is exactly the union of
 * faces — so the gap must be a face or coverage is false by construction. Making it one is what
 * lets §4's *"streets are GROUND … never a stroke"* be enforced by there being no street object to
 * stroke: the way face carries a rank and nothing else, its geometry is entirely its flanking
 * faces' kerb edges, and the view paints it as surface.
 *
 * ⚠ `WALLBAND` IS A1.3's RULING — *"WALL is a THIN FACE, not an edge — the band's ground with
 * width, bounded by inner/outer edges"* — so REG-2's `runBands`/`inkHalf` dress has reserved
 * ground to consume and the §575 clear regime has a face to be.
 *
 * ⚠ `WATER` and `LOSSREGION` are RESERVED HERE AND MINTED BY NOBODY IN SPINE-1 (§3e is SPINE-2,
 * §3f is decline). Reserving the spelling is what stops a later car minting a second vocabulary;
 * `censusPartition` proves the count is zero.
 */
export const FACE_CLASSES = Object.freeze(['WARD', 'BLOCK', 'PLOT', 'VOID', 'FIELD', 'WATER',
  'LOSSREGION', 'WALLBAND', 'WAY', 'OUTER']);

/** The face classes that are PIECES — the hierarchy §1 orders (`plot ⊂ block ⊂ ward`). */
export const PIECE_CLASSES = Object.freeze(['WARD', 'BLOCK', 'PLOT']);

/** Face classes reserved by name for later cars, which SPINE-1 must mint zero of. */
export const RESERVED_FACE_CLASSES = Object.freeze(['WATER', 'LOSSREGION']);

/**
 * ⭐⭐⭐ THE EDGE TYPES, TOTAL (§1 + A1.7's CLIFF). Every edge carries exactly one.
 * ⚠ `CROSSING` is RESERVED — §3e is SPINE-2's, and a SPINE-1 partition mints none.
 */
export const EDGE_TYPES = Object.freeze(['WAY', 'WALL', 'BANK', 'CROSSING', 'BOUND', 'CLIFF']);

/** Edge types reserved by name for SPINE-2. */
export const RESERVED_EDGE_TYPES = Object.freeze(['CROSSING']);

/** The way ranks §1 declares, coarse→fine. */
export const WAY_RANKS = Object.freeze(['artery', 'street', 'lane', 'path']);

const qOf = (v) => Math.round(v * PARTITION_QUANTUM_PER_UNIT);
const wOf = (q) => q / PARTITION_QUANTUM_PER_UNIT;

/** Exact orientation on the partition grid. Plain Number — see the header on why that is exact. */
export function orient(ax, ay, bx, by, cx, cy) {
  const v = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
  return v > 0 ? 1 : (v < 0 ? -1 : 0);
}

/** Do open segments ab and cd cross at an interior point of both? Exact. */
function properCrossInt(ax, ay, bx, by, cx, cy, dx, dy) {
  const d1 = orient(ax, ay, bx, by, cx, cy);
  const d2 = orient(ax, ay, bx, by, dx, dy);
  const d3 = orient(cx, cy, dx, dy, ax, ay);
  const d4 = orient(cx, cy, dx, dy, bx, by);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

/** Is p strictly on the open segment ab? Exact. */
function onSegmentInt(ax, ay, bx, by, px, py) {
  if (orient(ax, ay, bx, by, px, py) !== 0) return false;
  if ((px === ax && py === ay) || (px === bx && py === by)) return false;
  return Math.min(ax, bx) <= px && px <= Math.max(ax, bx)
    && Math.min(ay, by) <= py && py <= Math.max(ay, by);
}

/** Even-odd point-in-ring over integer coordinates; `null` when the point lies ON the ring. */
function pointInRingInt(ring, px, py) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; const [xj, yj] = ring[j];
    if ((px === xi && py === yi) || onSegmentInt(xi, yi, xj, yj, px, py)) return null;
    if ((yi > py) !== (yj > py)) {
      const t = (py - yi) / (yj - yi);
      if (px < xi + t * (xj - xi)) inside = !inside;
    }
  }
  return inside;
}

/** Twice the signed area of an integer ring. */
function area2Int(ring) {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i]; const q = ring[(i + 1) % ring.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a;
}

/**
 * ⭐ A NEW, EMPTY ARRANGEMENT. Everything is an array of records with integer ids; nothing is
 * keyed by object identity and nothing iterates a Map, so the structure is order-deterministic by
 * construction (the `vertexKey` Map is READ ONLY, never enumerated).
 */
export function createArrangement() {
  return {
    quantumPerUnit: PARTITION_QUANTUM_PER_UNIT,
    /** @type {Array<{x:number,y:number,frontier:boolean}>} */ verts: [],
    /** @type {Map<string,number>} */ vertexKey: new Map(),
    /** @type {Array<{id:number,origin:number,twin:number,next:number,prev:number,face:number,edge:number}>} */
    halfEdges: [],
    /** @type {Array<{id:number,type:string,rank:string|null,he:number,key:string,frontier:boolean,attrs:Object}>} */
    edges: [],
    /** @type {Array<{id:number,cls:string,he:number,piece:number,attrs:Object,alive:boolean}>} */
    faces: [],
    /** @type {Array<{id:number,cls:string,parent:number,children:number[],face:number,attrs:Object}>} */
    pieces: [],
    outerFace: -1,
    refusals: [],
    splits: 0,
    /** ⭐ PER-FACE AREA AND CENTROID CACHES, invalidated at the two faces a split touches. Without
     *  them `pickHost` re-walks every cycle on every plan unit and the town leaf costs 2.1 s. */
    /** @type {Map<number,number>} */ areaCache: new Map(),
    /** @type {Map<number,number[]>} */ centroidCache: new Map(),
    /** ⭐ THE STRICT ORACLE. Off by default; a probe turns it on with `arr.strict = true` (or the
     *  `__PARTITION_STRICT__` global, so a caller that never sees the arrangement can still arm
     *  it) and every mutation re-runs the planarity sweep, naming the FIRST operation that breaks
     *  the structure instead of leaving the hundredth to be discovered. */
    strict: typeof globalThis !== 'undefined' && globalThis.__PARTITION_STRICT__ === true,
    ops: 0,
    firstBreak: null,
    /** @type {Array<any>|null} */ trace: null,
  };
}

/** Add (or find) a vertex at world coordinates. Dedupe is on the QUANTIZED key. */
export function addVertex(arr, x, y) {
  const qx = qOf(x); const qy = qOf(y);
  const k = `${qx},${qy}`;
  const hit = arr.vertexKey.get(k);
  if (hit !== undefined) return hit;
  const id = arr.verts.length;
  arr.verts.push({ x: qx, y: qy, frontier: false });
  arr.vertexKey.set(k, id);
  return id;
}

/** Is there already a vertex on this grid point? */
export function vertexAt(arr, x, y) {
  const hit = arr.vertexKey.get(`${qOf(x)},${qOf(y)}`);
  return hit === undefined ? -1 : hit;
}

const vx = (arr, v) => arr.verts[v].x;
const vy = (arr, v) => arr.verts[v].y;

/** The half-edges of a face's cycle, in order, starting at `face.he`. */
export function faceHalfEdges(arr, fid) {
  const f = arr.faces[fid];
  const out = [];
  let h = f.he;
  const cap = arr.halfEdges.length + 4;
  do {
    out.push(h);
    h = arr.halfEdges[h].next;
    if (out.length > cap) throw new Error(`partitionArrangement: face ${fid} cycle does not close`);
  } while (h !== f.he);
  return out;
}

/** A face's vertex cycle, in integer grid coordinates. */
export function faceRingInt(arr, fid) {
  return faceHalfEdges(arr, fid).map((h) => {
    const v = arr.halfEdges[h].origin;
    return [arr.verts[v].x, arr.verts[v].y];
  });
}

/** A face's vertex cycle, in world units — what a view draws. */
export function faceRing(arr, fid) {
  return faceRingInt(arr, fid).map(([x, y]) => [wOf(x), wOf(y)]);
}

/** A face's area in world units². */
export function faceArea(arr, fid) {
  const hit = arr.areaCache.get(fid);
  if (hit !== undefined) return hit;
  const a2 = area2Int(faceRingInt(arr, fid));
  const v = Math.abs(a2) / 2 / (PARTITION_QUANTUM_PER_UNIT * PARTITION_QUANTUM_PER_UNIT);
  arr.areaCache.set(fid, v);
  return v;
}

/** A face's centroid in world units. */
export function faceCentroid(arr, fid) {
  const hit = arr.centroidCache.get(fid);
  if (hit !== undefined) return hit;
  const ring = faceRingInt(arr, fid);
  let a = 0; let cx = 0; let cy = 0;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i]; const q = ring[(i + 1) % ring.length];
    const cr = p[0] * q[1] - q[0] * p[1];
    a += cr; cx += (p[0] + q[0]) * cr; cy += (p[1] + q[1]) * cr;
  }
  if (a === 0) {
    let sx = 0; let sy = 0;
    for (const p of ring) { sx += p[0]; sy += p[1]; }
    const deg = [wOf(sx / ring.length), wOf(sy / ring.length)];
    arr.centroidCache.set(fid, deg);
    return deg;
  }
  const out = [wOf(cx / (3 * a)), wOf(cy / (3 * a))];
  arr.centroidCache.set(fid, out);
  return out;
}

function newFace(arr, cls, he, attrs) {
  const id = arr.faces.length;
  arr.faces.push({ id, cls, he, piece: -1, attrs: attrs || {}, alive: true });
  return id;
}

function newHalfEdgePair(arr, va, vb, edgeSpec) {
  const h0 = arr.halfEdges.length; const h1 = h0 + 1;
  const eid = arr.edges.length;
  arr.halfEdges.push({ id: h0, origin: va, twin: h1, next: -1, prev: -1, face: -1, edge: eid });
  arr.halfEdges.push({ id: h1, origin: vb, twin: h0, next: -1, prev: -1, face: -1, edge: eid });
  arr.edges.push({
    id: eid,
    type: edgeSpec && edgeSpec.type ? edgeSpec.type : 'BOUND',
    rank: (edgeSpec && edgeSpec.rank) || null,
    he: h0,
    key: (edgeSpec && edgeSpec.key) || `e${eid}`,
    frontier: !!(edgeSpec && edgeSpec.frontier),
    attrs: (edgeSpec && edgeSpec.attrs) || {},
  });
  return [h0, h1];
}

/**
 * ⭐⭐⭐ SEED THE ARRANGEMENT with one bounded region. The ring is taken in whatever winding it
 * arrives with and normalized to counter-clockwise, so the bounded face is always the positive
 * cycle and the unbounded one is always its twin walk. Every later face inherits that convention.
 *
 * @param {any} arr @param {Array<number[]>} ring world-unit ring, not closed
 * @param {{faceClass?:string, edgeType?:string, frontier?:boolean, key?:string}} [spec]
 * @returns {number} the bounded face id
 */
export function seedRegion(arr, ring, spec = {}) {
  if (!ring || ring.length < 3) throw new Error('partitionArrangement: seedRegion needs >= 3 points');
  const vids = [];
  for (const p of ring) {
    const v = addVertex(arr, p[0], p[1]);
    if (!vids.length || vids[vids.length - 1] !== v) vids.push(v);
  }
  if (vids.length > 1 && vids[0] === vids[vids.length - 1]) vids.pop();
  if (vids.length < 3) throw new Error('partitionArrangement: seedRegion ring collapsed on the grid');
  const asInt = vids.map((v) => [vx(arr, v), vy(arr, v)]);
  if (area2Int(asInt) < 0) vids.reverse();

  const n = vids.length;
  const inner = []; const outer = [];
  for (let i = 0; i < n; i++) {
    const [h0, h1] = newHalfEdgePair(arr, vids[i], vids[(i + 1) % n], {
      type: spec.edgeType || 'BOUND', frontier: spec.frontier !== false,
      key: `${spec.key || 'seed'}.${i}`,
    });
    inner.push(h0); outer.push(h1);
  }
  for (let i = 0; i < n; i++) {
    const h = inner[i]; const nx = inner[(i + 1) % n];
    arr.halfEdges[h].next = nx; arr.halfEdges[nx].prev = h;
    const o = outer[i]; const op = outer[(i - 1 + n) % n];
    arr.halfEdges[o].next = op; arr.halfEdges[op].prev = o;
  }
  const fIn = newFace(arr, spec.faceClass || 'FIELD', inner[0], {});
  const fOut = newFace(arr, 'OUTER', outer[0], {});
  for (const h of inner) arr.halfEdges[h].face = fIn;
  for (const h of outer) arr.halfEdges[h].face = fOut;
  if (arr.outerFace < 0) arr.outerFace = fOut;
  if (spec.frontier !== false) for (const v of vids) arr.verts[v].frontier = true;
  return fIn;
}

/**
 * ⭐ SPLIT AN EDGE at a world point, inserting a vertex. The point is quantized and taken as the
 * new vertex EXACTLY — see the header: the boundary bends by ≤ half a quantum and the topology is
 * exact, which is the trade that removes the noder.
 *
 * @returns {number} the new (or existing) vertex id
 */
export function splitEdge(arr, edgeId, x, y) {
  const e = arr.edges[edgeId];
  const h0 = e.he; const h1 = arr.halfEdges[h0].twin;
  const va = arr.halfEdges[h0].origin; const vb = arr.halfEdges[h1].origin;
  // ⛔⛔ **A SPLIT POINT THAT ALREADY CARRIES A VERTEX SOMEWHERE ELSE IS A TOPOLOGICAL
  // IDENTIFICATION, NOT A SPLIT.** `addVertex` dedupes on the grid key, so re-using such an id
  // welds two unrelated parts of the arrangement together: the new half-edges are spliced into
  // THIS face's cycle while the vertex's existing rotation knows nothing about them. Measured
  // when it was missing: the town leaf came back with Euler −3 and 19 proper crossings, from an
  // arrangement every one of whose individual operations had reported success.
  const existing = vertexAt(arr, x, y);
  if (existing >= 0 && existing !== va && existing !== vb) return -1;
  // ⛔⛔ **THE POINT MUST LIE ON THIS EDGE.** A caller that hands a point off the segment does not
  // split it — it puts a SPIKE in the boundary, and the edge's two halves then properly cross each
  // other. Measured before the guard: `u15|L.0` crossing `u15|L.0/s`, its own other half, on the
  // town leaf at operation 421, with fourteen such pairs by the end of the fold. The guard REFUSES
  // rather than bending, and the caller's own refusal counter records it.
  const qx = qOf(x); const qy = qOf(y);
  const ax = arr.verts[va].x; const ay = arr.verts[va].y;
  const bx = arr.verts[vb].x; const by = arr.verts[vb].y;
  const ex = bx - ax; const ey = by - ay;
  const L2 = ex * ex + ey * ey;
  const t = L2 > 0 ? ((qx - ax) * ex + (qy - ay) * ey) / L2 : 0;
  if (t < 0 || t > 1) return -1;
  const px = ax + ex * t; const py = ay + ey * t;
  if (Math.hypot(qx - px, qy - py) > 1) return -1;
  const vm = addVertex(arr, x, y);
  if (vm === va || vm === vb) return vm;

  // The second half of the edge, carrying the SAME type/rank/attrs — a split edge is one edge
  // read as two, never a chance to re-type ground.
  const [g0, g1] = newHalfEdgePair(arr, vm, vb, {
    type: e.type, rank: e.rank, key: `${e.key}/s`, frontier: e.frontier, attrs: e.attrs,
  });
  const n0 = arr.halfEdges[h0].next; const p1 = arr.halfEdges[h1].prev;
  // h0: va→vm ; g0: vm→vb
  arr.halfEdges[h0].next = g0; arr.halfEdges[g0].prev = h0;
  arr.halfEdges[g0].next = n0; if (n0 >= 0) arr.halfEdges[n0].prev = g0;
  arr.halfEdges[g0].face = arr.halfEdges[h0].face;
  // h1: vb→va becomes vm→va ; g1: vb→vm
  arr.halfEdges[h1].origin = vm;
  arr.halfEdges[g1].next = h1; arr.halfEdges[h1].prev = g1;
  arr.halfEdges[g1].prev = p1; if (p1 >= 0) arr.halfEdges[p1].next = g1;
  arr.halfEdges[g1].face = arr.halfEdges[h1].face;
  if (arr.faces[arr.halfEdges[h1].face] && arr.faces[arr.halfEdges[h1].face].he === h1) {
    arr.faces[arr.halfEdges[h1].face].he = g1;
  }
  if (e.frontier) arr.verts[vm].frontier = true;
  arr.areaCache.delete(arr.halfEdges[h0].face); arr.areaCache.delete(arr.halfEdges[h1].face);
  arr.centroidCache.delete(arr.halfEdges[h0].face); arr.centroidCache.delete(arr.halfEdges[h1].face);
  arr.ops++; strictCheck(arr, 'splitEdge', { edgeId, key: e.key, at: [x, y] });
  return vm;
}

/** The half-edge of face `fid` whose ORIGIN is vertex `v`, or -1. */
function halfEdgeFrom(arr, fid, v) {
  for (const h of faceHalfEdges(arr, fid)) if (arr.halfEdges[h].origin === v) return h;
  return -1;
}

/**
 * ⭐⭐⭐ **THE OPERATION THE WHOLE DESIGN RESTS ON.** Split face `fid` by a chain that starts at
 * vertex `va` and ends at vertex `vb` — both already on the face's cycle — through zero or more
 * `interior` world points that lie strictly inside the face.
 *
 * Returns `{ok, faces:[left,right], edges:[...]}`; on refusal `{ok:false, reason}` and the
 * arrangement is UNTOUCHED (every mutation happens after the last check).
 *
 * ⚠ THE INTERIORITY CHECK IS EXACT AND IS THE PLANARITY INVARIANT'S ONLY PRECONDITION. It refuses
 * when: an endpoint is not on the cycle, the chain touches the cycle anywhere but its two ends, or
 * the chain's own segments cross each other.
 */
export function splitFaceChain(arr, fid, va, vb, interior, edgeSpec, opts) {
  const face = arr.faces[fid];
  if (!face || !face.alive) return { ok: false, reason: `face ${fid} is not alive` };
  if (va === vb) return { ok: false, reason: 'a chord needs two distinct endpoints' };
  const cycle = faceHalfEdges(arr, fid);
  const hA = halfEdgeFrom(arr, fid, va);
  const hB = halfEdgeFrom(arr, fid, vb);
  if (hA < 0 || hB < 0) return { ok: false, reason: 'an endpoint is not on the face cycle' };

  const pts = [[vx(arr, va), vy(arr, va)]];
  for (const p of (interior || [])) pts.push([qOf(p[0]), qOf(p[1])]);
  pts.push([vx(arr, vb), vy(arr, vb)]);
  // drop consecutive duplicates on the grid
  const chain = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const q = pts[i]; const p = chain[chain.length - 1];
    if (q[0] !== p[0] || q[1] !== p[1]) chain.push(q);
  }
  if (chain.length < 2) return { ok: false, reason: 'the chain collapsed on the grid' };

  const ring = faceRingInt(arr, fid);
  // ⭐ (0) FIRST: a two-point chain whose ends an edge ALREADY joins is not a split — it is the
  // wrap's tangential run, and the caller re-types that edge instead. It is checked BEFORE
  // interiority because such a chord lies exactly ON the boundary, where an interiority test has
  // no honest answer.
  if (chain.length === 2 && edgeBetween(arr, va, vb) >= 0) {
    return { ok: false, reason: 'the chord duplicates an existing edge' };
  }
  // (a) the chain's own segments must not cross each other
  for (let i = 0; i + 1 < chain.length; i++) {
    for (let j = i + 2; j + 1 < chain.length; j++) {
      if (properCrossInt(chain[i][0], chain[i][1], chain[i + 1][0], chain[i + 1][1],
        chain[j][0], chain[j][1], chain[j + 1][0], chain[j + 1][1])) {
        return { ok: false, reason: 'the chain crosses itself' };
      }
    }
  }
  // (b) no chain segment may cross the face cycle, and no interior chain vertex may lie on it
  for (let i = 0; i + 1 < chain.length; i++) {
    for (let k = 0; k < ring.length; k++) {
      const p = ring[k]; const q = ring[(k + 1) % ring.length];
      if (properCrossInt(chain[i][0], chain[i][1], chain[i + 1][0], chain[i + 1][1],
        p[0], p[1], q[0], q[1])) {
        return { ok: false, reason: 'the chain crosses the face boundary' };
      }
    }
  }
  for (let i = 1; i + 1 < chain.length; i++) {
    for (let k = 0; k < ring.length; k++) {
      const p = ring[k]; const q = ring[(k + 1) % ring.length];
      if ((chain[i][0] === p[0] && chain[i][1] === p[1])
        || onSegmentInt(p[0], p[1], q[0], q[1], chain[i][0], chain[i][1])) {
        return { ok: false, reason: 'an interior chain point lies on the face boundary' };
      }
    }
  }
  // ⭐ (c) THE CHAIN MUST RUN INSIDE — tested in DOUBLED integer space so the midpoint is EXACT.
  // ⚠ Rounding a midpoint to the grid first is what makes this test lie: a chord lying along the
  // boundary has a true midpoint ON the ring, and half a quantum of rounding reports it OUTSIDE.
  // That single rounding cost the first spelling of this file one spurious refusal per synthetic
  // ring, and it would have read as a geometry failure rather than as a predicate failure.
  const ring2 = ring.map((p) => [p[0] * 2, p[1] * 2]);
  for (let i = 0; i + 1 < chain.length; i++) {
    const mx = chain[i][0] + chain[i + 1][0]; const my = chain[i][1] + chain[i + 1][1];
    const v = pointInRingInt(ring2, mx, my);
    if (v === false) return { ok: false, reason: 'the chain leaves the face' };
    // ⛔⛔ **STRICTLY INSIDE, NOT MERELY NOT-OUTSIDE.** A chord whose midpoint lies ON the boundary
    // runs ALONG it, and the "split" it makes is a zero-width sliver: a second, collinear edge over
    // ground an edge already covers. Measured before this line: the wrap's trace ran along a patch
    // boundary through an intermediate vertex — so the two-vertex re-type in check (0) could not
    // see it — and the city and metropolis leaves came back with 3 and 2 proper crossings between
    // `wrap.E*.out` and the `patch` edge it lay on top of.
    if (v === null) return { ok: false, reason: 'the chain runs along the face boundary' };
  }
  for (const m of chain.slice(1, -1)) {
    if (pointInRingInt(ring, m[0], m[1]) === false) return { ok: false, reason: 'the chain leaves the face' };
  }

  // ⛔⛔ (d) **THE GLOBAL SWEEP — for chains that cross a whole region rather than one small face.**
  // Checks (a)–(c) ask about the FACE's own cycle, which is the right question only while the face
  // has no geometry hiding inside it. This arrangement carries no INNER-BOUNDARY record, so a
  // region already separated by an earlier closed ring can still be reachable from a cycle that
  // does not list its edges — and a long chord across such a face then crosses edges no ring-local
  // check can see. MEASURED: the metropolis's THIRD wrap chorded across its SECOND wrap's inner
  // ring, 2 proper crossings out of 10,101 edges, on 1 leaf of 18. ⚠ IT IS OPT-IN because it is an
  // O(E) scan: `insertRing` asks for it (a handful of calls per build), the subdivision recursion
  // does not (hundreds of thousands).
  if (opts && opts.globalSweep) {
    let lox = Infinity; let loy = Infinity; let hix = -Infinity; let hiy = -Infinity;
    for (const p of chain) {
      if (p[0] < lox) lox = p[0]; if (p[0] > hix) hix = p[0];
      if (p[1] < loy) loy = p[1]; if (p[1] > hiy) hiy = p[1];
    }
    for (const e of arr.edges) {
      const h = arr.halfEdges[e.he];
      const a = arr.verts[h.origin]; const b = arr.verts[arr.halfEdges[h.twin].origin];
      if (Math.max(a.x, b.x) < lox || Math.min(a.x, b.x) > hix) continue;
      if (Math.max(a.y, b.y) < loy || Math.min(a.y, b.y) > hiy) continue;
      for (let i = 0; i + 1 < chain.length; i++) {
        if (properCrossInt(chain[i][0], chain[i][1], chain[i + 1][0], chain[i + 1][1],
          a.x, a.y, b.x, b.y)) {
          return { ok: false, reason: `the chain crosses edge ${e.key} outside the face cycle` };
        }
      }
    }
  }

  // ⛔ (e) EVERY INTERIOR CHAIN POINT MUST BE A **FRESH** VERTEX — same reason as `splitEdge`'s
  // guard: re-using a vertex that already lives elsewhere welds the arrangement to itself.
  for (const m of chain.slice(1, -1)) {
    if (arr.vertexKey.get(`${m[0]},${m[1]}`) !== undefined) {
      return { ok: false, reason: 'an interior chain point lands on an existing vertex' };
    }
  }

  // ── every check passed; from here the arrangement mutates ──────────────────────────────────
  const mid = [];
  for (let i = 1; i + 1 < chain.length; i++) mid.push(addVertex(arr, wOf(chain[i][0]), wOf(chain[i][1])));
  const path = [va, ...mid, vb];
  const fwd = []; const bwd = []; const newEdges = [];
  for (let i = 0; i + 1 < path.length; i++) {
    const [h0, h1] = newHalfEdgePair(arr, path[i], path[i + 1], {
      ...(edgeSpec || {}),
      key: edgeSpec && edgeSpec.key ? `${edgeSpec.key}.${i}` : undefined,
    });
    fwd.push(h0); bwd.unshift(h1);
    newEdges.push(arr.halfEdges[h0].edge);
  }
  for (let i = 0; i + 1 < fwd.length; i++) { arr.halfEdges[fwd[i]].next = fwd[i + 1]; arr.halfEdges[fwd[i + 1]].prev = fwd[i]; }
  for (let i = 0; i + 1 < bwd.length; i++) { arr.halfEdges[bwd[i]].next = bwd[i + 1]; arr.halfEdges[bwd[i + 1]].prev = bwd[i]; }

  const pA = arr.halfEdges[hA].prev; const pB = arr.halfEdges[hB].prev;
  // LEFT cycle: … → pA → fwd… → hB → …
  arr.halfEdges[pA].next = fwd[0]; arr.halfEdges[fwd[0]].prev = pA;
  arr.halfEdges[fwd[fwd.length - 1]].next = hB; arr.halfEdges[hB].prev = fwd[fwd.length - 1];
  // RIGHT cycle: … → pB → bwd… → hA → …
  arr.halfEdges[pB].next = bwd[0]; arr.halfEdges[bwd[0]].prev = pB;
  arr.halfEdges[bwd[bwd.length - 1]].next = hA; arr.halfEdges[hA].prev = bwd[bwd.length - 1];

  // The original face keeps the cycle through hB; the new face takes the cycle through hA.
  face.he = hB;
  // ⛔⛔ THE NEW FACE DOES **NOT** INHERIT THE PIECE. A split makes GROUND, not tenure: if the new
  // half kept its parent's piece id, one piece would own two faces and §4's identity bijection
  // would be false at the substrate — which is exactly the class A1.2's census exists to catch.
  // The caller mints the piece, or the face stays piece-less and the containment arm says so.
  const gid = newFace(arr, face.cls, hA, { ...face.attrs });
  for (const h of faceHalfEdges(arr, fid)) arr.halfEdges[h].face = fid;
  for (const h of faceHalfEdges(arr, gid)) arr.halfEdges[h].face = gid;
  arr.areaCache.delete(fid); arr.areaCache.delete(gid);
  arr.centroidCache.delete(fid); arr.centroidCache.delete(gid);
  arr.splits++;
  arr.ops++; strictCheck(arr, 'splitFaceChain', { fid, key: edgeSpec && edgeSpec.key, va, vb, interior: (interior || []).length });
  return { ok: true, faces: [fid, gid], edges: newEdges };
}

/** Refuse and record — every refusal is counted with its reason so a census can read them. */
function refuse(arr, where, reason, detail) {
  arr.refusals.push({ where, reason, detail: detail || null });
  return null;
}

/**
 * Where does the infinite line through world point `p` with direction `d` meet face `fid`'s
 * boundary? Returns the crossings sorted along the line, each `{t, edgeId, at:[x,y], vertex|null}`.
 */
function boundaryCrossings(arr, fid, p, d) {
  const hits = [];
  const cyc = faceHalfEdges(arr, fid);
  const len = Math.hypot(d[0], d[1]) || 1;
  const ux = d[0] / len; const uy = d[1] / len;
  for (const h of cyc) {
    const he = arr.halfEdges[h];
    const a = arr.verts[he.origin]; const b = arr.verts[arr.halfEdges[he.next].origin];
    const ax = wOf(a.x); const ay = wOf(a.y); const bx = wOf(b.x); const by = wOf(b.y);
    const ex = bx - ax; const ey = by - ay;
    // p + t·u = a + s·e  ⇒  s = ((a−p) × u) / (u × e), with × the 2-D cross product.
    const den = ux * ey - uy * ex;
    if (Math.abs(den) < 1e-12) continue;
    const s = ((ax - p[0]) * uy - (ay - p[1]) * ux) / den;
    if (s < -1e-9 || s > 1 + 1e-9) continue;
    const at = [ax + ex * s, ay + ey * s];
    const t = (at[0] - p[0]) * ux + (at[1] - p[1]) * uy;
    let vertex = null;
    if (s <= 1e-6) vertex = he.origin;
    else if (s >= 1 - 1e-6) vertex = arr.halfEdges[he.next].origin;
    hits.push({ t, edgeId: he.edge, at, vertex, halfEdge: h });
  }
  hits.sort((x, y) => x.t - y.t || x.edgeId - y.edgeId);
  // collapse duplicates at shared vertices
  const out = [];
  for (const h of hits) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.t - h.t) < 1 / PARTITION_QUANTUM_PER_UNIT) continue;
    out.push(h);
  }
  return out;
}

/**
 * ⭐ THE CHORD A LINE WOULD CUT IN A FACE — the two bracketing boundary crossings, in world units,
 * or null. Published because a caller must be able to ask *what ground would this cut cross* BEFORE
 * cutting: the water refusal (§1's "no WAY edge spans WATER") is a question about the chord, and
 * asking it of the whole extent diameter instead refuses every line through a riverside town.
 */
export function chordInFace(arr, fid, p, d) {
  const hits = boundaryCrossings(arr, fid, p, d);
  if (hits.length < 2) return null;
  for (let i = 0; i + 1 < hits.length; i++) {
    const mx = (hits[i].at[0] + hits[i + 1].at[0]) / 2;
    const my = (hits[i].at[1] + hits[i + 1].at[1]) / 2;
    if (pointInRingInt(faceRingInt(arr, fid), qOf(mx), qOf(my)) === true) {
      return [hits[i].at.slice(), hits[i + 1].at.slice()];
    }
  }
  return null;
}

/**
 * ⭐⭐ CUT A FACE BY A LINE — the piece-adding primitive §3a/§3b are written in terms of. The line
 * runs through world point `p` in direction `d`; the pair of boundary crossings that BRACKET `p`
 * is chosen (never the outermost pair, which on a re-entrant face would put the chord outside).
 *
 * @returns {{faces:number[], edges:number[]}|null} null on refusal (counted)
 */
export function cutFaceByLine(arr, fid, p, d, edgeSpec) {
  const hits = boundaryCrossings(arr, fid, p, d);
  if (hits.length < 2) return refuse(arr, 'cutFaceByLine', 'the line misses the face', { fid });
  let lo = -1;
  for (let i = 0; i + 1 < hits.length; i++) {
    const mx = (hits[i].at[0] + hits[i + 1].at[0]) / 2;
    const my = (hits[i].at[1] + hits[i + 1].at[1]) / 2;
    if (pointInRingInt(faceRingInt(arr, fid), qOf(mx), qOf(my)) === true) { lo = i; break; }
  }
  if (lo < 0) return refuse(arr, 'cutFaceByLine', 'no bracketing pair lies inside the face', { fid });
  const A = hits[lo]; const B = hits[lo + 1];
  // ⛔ A CHORD SHORTER THAN THE DEGENERACY FLOOR IS REFUSED. Two cut points a quantum apart make
  // two vertices the grid cannot tell apart, and the near-collinear edges they leave behind are
  // what a planarity sweep reads as a crossing — six of them on the town leaf, every one from a
  // sliver an operation was happy to make.
  if (Math.hypot(B.at[0] - A.at[0], B.at[1] - A.at[1]) < CHORD_FLOOR) {
    return refuse(arr, 'cutFaceByLine', 'the chord is below the degeneracy floor', { fid });
  }
  const va = A.vertex != null ? A.vertex : splitEdge(arr, A.edgeId, A.at[0], A.at[1]);
  const vb = B.vertex != null ? B.vertex : splitEdge(arr, B.edgeId, B.at[0], B.at[1]);
  if (va < 0 || vb < 0) return refuse(arr, 'cutFaceByLine', 'a cut point already carries a vertex', { fid });
  const res = splitFaceChain(arr, fid, va, vb, [], edgeSpec);
  if (!res.ok) return refuse(arr, 'cutFaceByLine', res.reason, { fid });
  return res;
}

/**
 * ⭐⭐⭐ CUT A **WAY** THROUGH A FACE — the §1 gap, minted as a thin face between two kerb cuts.
 * Two parallel cuts at ±width/2 produce three faces; the middle one is the carriageway.
 *
 * ⚠ THE KERB EDGES ARE TYPED `WAY` AND THE MIDDLE FACE IS CLASSED `WAY`. There is no centreline
 * object anywhere in the result — §650's "streets are ground, never a stroke" is enforced by the
 * absence rather than by a painter's discipline.
 *
 * @returns {{way:number, flanks:number[], edges:number[]}|null}
 */
export function cutWay(arr, fid, p, d, width, spec = {}) {
  const len = Math.hypot(d[0], d[1]) || 1;
  const nx = -d[1] / len; const ny = d[0] / len;
  const half = Math.max(width, 2 / PARTITION_QUANTUM_PER_UNIT) / 2;
  const rank = spec.rank || 'lane';
  const kerb = { type: 'WAY', rank, key: spec.key ? `${spec.key}|L` : undefined, attrs: spec.attrs || {} };
  // ⭐⭐ **ATOMIC OR NOTHING.** Both kerb chords are checked BEFORE either is cut. The first
  // spelling cut the left kerb, then discovered the right one had nowhere to land and returned
  // null — leaving a stray half-way in the fabric that the caller's retry then cut across at a
  // slightly different bearing. Two near-collinear kerbs a quantum apart is exactly the
  // degenerate pair the planarity sweep convicted.
  const cL = chordInFace(arr, fid, [p[0] + nx * half, p[1] + ny * half], d);
  const cR = chordInFace(arr, fid, [p[0] - nx * half, p[1] - ny * half], d);
  if (!cL || !cR) return refuse(arr, 'cutWay', 'one of the two kerb lines misses the face', { fid });
  if (Math.hypot(cL[1][0] - cL[0][0], cL[1][1] - cL[0][1]) < CHORD_FLOOR
    || Math.hypot(cR[1][0] - cR[0][0], cR[1][1] - cR[0][1]) < CHORD_FLOOR) {
    return refuse(arr, 'cutWay', 'a kerb chord is below the degeneracy floor', { fid });
  }
  const first = cutFaceByLine(arr, fid, [p[0] + nx * half, p[1] + ny * half], d, kerb);
  if (!first) return null;
  // the side that still contains the second kerb line
  // ⚠ THE PROBE IS THE WAY'S OWN CENTRELINE POINT, not a point a hair inside the second kerb: the
  // latter sits ON the line about to be cut, where a point-in-ring test has no honest answer.
  const target = first.faces.find((f) => pointInRingInt(faceRingInt(arr, f), qOf(p[0]), qOf(p[1])) === true);
  if (target === undefined) return refuse(arr, 'cutWay', 'the second kerb line left both faces', { fid });
  const second = cutFaceByLine(arr, target, [p[0] - nx * half, p[1] - ny * half], d,
    { ...kerb, key: spec.key ? `${spec.key}|R` : undefined });
  if (!second) return null;
  const way = second.faces.find((f) => pointInRingInt(faceRingInt(arr, f), qOf(p[0]), qOf(p[1])) === true);
  if (way === undefined) return refuse(arr, 'cutWay', 'the carriageway face could not be identified', { fid });
  arr.faces[way].cls = 'WAY';
  arr.faces[way].attrs = { ...arr.faces[way].attrs, rank, wayKey: spec.key || null, width: half * 2 };
  const flanks = [...first.faces, ...second.faces].filter((f) => f !== way);
  return { way, flanks: [...new Set(flanks)], edges: [...first.edges, ...second.edges] };
}

/**
 * ⭐⭐⭐ INSERT A CLOSED RING into the arrangement — §3c's wrap, and the only construction act that
 * is not a single-face split. The ring is walked face by face: within each face the run of ring
 * points that stays inside becomes ONE `splitFaceChain`, and the crossing point where it leaves
 * becomes a vertex on the boundary it leaves through.
 *
 * ⚠ THIS IS WHY A1.3 COULD RULE THE WRAP A NEW EDGE CYCLE RATHER THAN A WALK ALONG PIECE EDGES.
 * The panel's S2-B2 measured that a trace following the boundaries of a 1,016–2,290-parcel town
 * carries hundreds-to-thousands of fabric-determined vertices, so the FORM's turn signature (the
 * facet economy REG-2's tower rhythm keys on: 26 facets citywall, 30 palisade, reference circuits
 * 25/37 verts) vanishes and circuit economy — a chord across a bay — is impossible because no
 * chord lies on an existing piece boundary. A ring INSERTED as its own cycle keeps the facet
 * economy and still ends up coincident with face boundaries, because inserting it MAKES them.
 *
 * @returns {{segments:number, faces:number[], edges:number[], refused:number}}
 */
export function insertRing(arr, ring, edgeSpec) {
  const pts = ring.map((p) => [p[0], p[1]]);
  const out = { segments: 0, faces: [], edges: [], refused: 0, retyped: 0, straightened: 0, breaks: 0, facets: 0 };
  const n = pts.length;
  if (n < 3) { refuse(arr, 'insertRing', 'a ring needs >= 3 points'); out.refused++; return out; }

  // Walk the ring as a sequence of segments, keeping the face the walk is currently inside.
  let cur = locateFace(arr, pts[0][0], pts[0][1]);
  let anchor = null;            // vertex the current in-face run started at
  let run = [];                 // interior points accumulated in the current face
  const startFace = cur;
  if (cur < 0 || arr.faces[cur].cls === 'OUTER') {
    refuse(arr, 'insertRing', 'the ring starts outside the arrangement'); out.refused++; return out;
  }
  // Seed the walk by cutting from the first ring point's own face boundary is not possible
  // (the point is interior), so the ring is entered at its FIRST boundary crossing instead and
  // walked once around from there.
  let entry = null;
  for (let i = 0; i < n && entry === null; i++) {
    const a = pts[i]; const b = pts[(i + 1) % n];
    const x = exitOfSegment(arr, startFace, a, b);
    if (x) entry = { i, x };
  }
  if (!entry) {
    refuse(arr, 'insertRing', 'the whole ring lies inside one face — nothing to enclose', { startFace });
    out.refused++; return out;
  }
  // Re-order the ring so it begins at the entry crossing.
  const order = [];
  for (let k = 0; k <= n; k++) order.push(pts[(entry.i + 1 + k) % n]);
  const startPt = entry.x.at;
  cur = faceAcross(arr, entry.x.halfEdge);
  anchor = entry.x.vertex != null ? entry.x.vertex : splitEdge(arr, entry.x.edgeId, startPt[0], startPt[1]);
  if (anchor < 0) { refuse(arr, 'insertRing', 'the entry point already carries a vertex'); out.refused++; return out; }
  run = [];
  let from = startPt;
  let guard = 0;
  for (let k = 0; k < order.length && guard < 20000; k++) {
    out.facets++;
    let a = from; const b = order[k];
    for (;;) {
      guard++;
      if (guard > 20000) break;
      if (cur < 0 || !arr.faces[cur] || !arr.faces[cur].alive || arr.faces[cur].cls === 'OUTER') {
        // ⭐ RECOVER, DO NOT ABANDON. The first spelling RETURNED here, so one bad face threw away
        // the whole rest of the wrap — the town leaf inserted ONE facet of twenty-six and the wrap
        // census would have read a 12-edge circuit as if that were the geometry. A break is
        // recorded and the walk re-enters at the next ring point it can locate.
        const re = locateFace(arr, b[0], b[1]);
        refuse(arr, 'insertRing', 'the ring left the arrangement', { at: b, recovered: re >= 0 });
        out.refused++; out.breaks++;
        if (re < 0) break;
        cur = re; anchor = -1; run = []; break;
      }
      if (anchor < 0) {
        // ⭐ RE-ENTRY AFTER A BREAK. The walk needs a boundary vertex to anchor on, so it takes the
        // next crossing as the new anchor and draws nothing across this face.
        // ⚠ WHEN THIS SEGMENT HAS NO CROSSING THE WALK MUST **KEEP LOOKING**, not give up: the
        // first spelling broke out unanchored and every remaining facet of the wrap was skipped in
        // silence — the town leaf inserted five of twenty-six and reported no error at all.
        const x0 = exitOfSegment(arr, cur, a, b);
        if (!x0) { const re = locateFace(arr, b[0], b[1]); if (re >= 0) cur = re; break; }
        const v0 = x0.vertex != null ? x0.vertex : splitEdge(arr, x0.edgeId, x0.at[0], x0.at[1]);
        if (v0 < 0) { out.refused++; break; }
        anchor = v0;
        cur = faceAcross(arr, x0.halfEdge); run = []; a = x0.at;
        continue;
      }
      const x = exitOfSegment(arr, cur, a, b);
      if (!x) { run.push(b); break; }
      const vEnd = x.vertex != null ? x.vertex : splitEdge(arr, x.edgeId, x.at[0], x.at[1]);
      if (vEnd < 0) {
        refuse(arr, 'insertRing', 'a crossing point already carries a vertex', { cur });
        out.refused++; out.breaks++; anchor = -1; run = []; a = x.at;
        cur = faceAcross(arr, x.halfEdge);
        continue;
      }
      if (vEnd !== anchor) {
        // ⚠ A run point may sit a half-quantum OUTSIDE the face it was accumulated in — the exit
        // search skips crossings inside the snap tolerance, so a grazing re-entry can leave one
        // behind. Filter against the face's own ring rather than trusting the walk.
        const curRing = faceRingInt(arr, cur);
        run = run.filter((p) => pointInRingInt(curRing, qOf(p[0]), qOf(p[1])) === true);
        let res = splitFaceChain(arr, cur, anchor, vEnd, run, edgeSpec, { globalSweep: true });
        // ⭐⭐ THE TANGENTIAL RUN, AND IT IS A1.3's OWN WORD FOR THIS CASE — *"snapped to piece
        // boundaries on tangential runs, chording across bays"*. When the wrap's path between two
        // consecutive crossings IS an edge the partition already carries, there is nothing to
        // split: the wrap RE-TYPES that edge instead of duplicating it. Re-typing is what makes
        // §1's *"a WALL edge coincides with face boundaries only"* true by construction rather
        // than by a tolerance, and it is why the tangential census can read 0 by construction.
        if (!res.ok && res.reason === 'the chord duplicates an existing edge') {
          const eid = edgeBetween(arr, anchor, vEnd);
          if (eid >= 0) {
            retypeEdge(arr, eid, edgeSpec);
            out.retyped++;
            res = { ok: true, faces: [], edges: [eid] };
          }
        }
        // A half-quantum bend can put an accumulated interior point a hair outside the face it was
        // computed in. The wrap then chords the corner directly rather than being abandoned — the
        // fallback is COUNTED so a census can read how often the geometry needed it.
        if (!res.ok && run.length) {
          const straight = splitFaceChain(arr, cur, anchor, vEnd, [], edgeSpec, { globalSweep: true });
          if (straight.ok) { res = straight; out.straightened++; }
        }
        if (res.ok) {
          out.segments++; out.faces.push(...res.faces); out.edges.push(...res.edges);
        } else {
          refuse(arr, 'insertRing', res.reason, {
            cur,
            from: [wOf(vx(arr, anchor)), wOf(vy(arr, anchor))],
            to: [wOf(vx(arr, vEnd)), wOf(vy(arr, vEnd))],
            faceClass: arr.faces[cur] && arr.faces[cur].cls,
          });
          out.refused++;
          // ⛔ THE GAP IS REAL AND IS NOT PAPERED OVER. The wrap now has a break at this face; the
          // §3c circuit census reads `refusals` and the wall-cycle closure arm convicts on it.
        }
      }
      // ⚠ THE VERTEX DEGENERACY, CURED RATHER THAN TOLERATED. When the ring exits exactly through
      // a vertex of degree ≥ 3, the face across THAT half-edge need not be the face the ring
      // actually enters — it can pass through the vertex into a third face. Taking the twin's face
      // on faith puts the next chord's endpoints on two different faces, which is what
      // "the chain leaves the face" reads as. The continuation's own midpoint decides instead.
      let nextFace = faceAcross(arr, x.halfEdge);
      const ahead = [(x.at[0] + b[0]) / 2, (x.at[1] + b[1]) / 2];
      if (Math.abs(ahead[0] - x.at[0]) > 1e-9 || Math.abs(ahead[1] - x.at[1]) > 1e-9) {
        const inside = (f) => f >= 0 && arr.faces[f] && arr.faces[f].alive && arr.faces[f].cls !== 'OUTER'
          && pointInRingInt(faceRingInt(arr, f), qOf(ahead[0]), qOf(ahead[1])) === true;
        if (!inside(nextFace)) {
          nextFace = -1;
          // ⭐ ONLY A FACE INCIDENT TO `vEnd` MAY BE CHOSEN — that is what keeps the next chord's
          // anchor on the next face's cycle by construction.
          for (const f of facesAroundVertex(arr, vEnd, x.halfEdge)) if (inside(f)) { nextFace = f; break; }
        }
      }
      cur = nextFace; anchor = vEnd; run = []; a = x.at;
      if (Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9) break;
    }
    from = b;
  }
  return out;
}

/** The edge joining two vertices, or -1. Used by the wrap's tangential-run re-typing. */
export function edgeBetween(arr, va, vb) {
  for (const e of arr.edges) {
    const h = arr.halfEdges[e.he];
    const a = h.origin; const b = arr.halfEdges[h.twin].origin;
    if ((a === va && b === vb) || (a === vb && b === va)) return e.id;
  }
  return -1;
}

/**
 * ⭐ RE-TYPE AN EXISTING EDGE. The one mutation that is not a split, and it is the wrap's
 * tangential run: ground that was already a party line becomes the wall's inner face boundary.
 * ⚠ THE GEOMETRY DOES NOT MOVE — only the type, rank and key. A re-type that moved a vertex would
 * be the frozen-history violation A1.6 forbids.
 */
export function retypeEdge(arr, edgeId, edgeSpec) {
  const e = arr.edges[edgeId];
  if (!e) return false;
  e.type = (edgeSpec && edgeSpec.type) || e.type;
  e.rank = edgeSpec && edgeSpec.rank !== undefined ? edgeSpec.rank : e.rank;
  if (edgeSpec && edgeSpec.key) e.key = edgeSpec.key;
  if (edgeSpec && edgeSpec.attrs) e.attrs = { ...e.attrs, ...edgeSpec.attrs };
  return true;
}

/**
 * ⭐ THE FACES INCIDENT TO A VERTEX, walked by the standard `next(twin(h))` rotation.
 * ⚠ `insertRing` NEEDS THIS AND NOT `faceAcross`. Taking the twin's face on faith is only correct
 * when the ring leaves through the INTERIOR of an edge; when it leaves through a VERTEX of degree
 * ≥ 3 the ring can pass into a third face, and the next chord's anchor then is not on the chosen
 * face's cycle at all — which reads as "an endpoint is not on the face cycle", 15 times on the
 * town leaf before this was written.
 */
export function facesAroundVertex(arr, v, fromHalfEdge) {
  const out = [];
  let h = fromHalfEdge;
  if (arr.halfEdges[h].origin !== v) h = arr.halfEdges[h].twin;
  if (arr.halfEdges[h].origin !== v) return out;
  const start = h;
  let guard = 0;
  do {
    if (out.indexOf(arr.halfEdges[h].face) < 0) out.push(arr.halfEdges[h].face);
    h = arr.halfEdges[arr.halfEdges[h].twin].next;
    if (++guard > 512) break;
  } while (h !== start);
  return out;
}

/** The face on the other side of the half-edge `h` (its twin's face). */
function faceAcross(arr, h) {
  const t = arr.halfEdges[h].twin;
  return arr.halfEdges[t].face;
}

/**
 * Where does the segment a→b leave face `fid`? Returns the first crossing strictly after `a`, or
 * null when b is still inside. Ties at a shared vertex resolve to the smaller edge id.
 */
function exitOfSegment(arr, fid, a, b) {
  const dx = b[0] - a[0]; const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy);
  if (!(L > 0)) return null;
  const ux = dx / L; const uy = dy / L;
  let best = null;
  for (const h of faceHalfEdges(arr, fid)) {
    const he = arr.halfEdges[h];
    const p = arr.verts[he.origin]; const q = arr.verts[arr.halfEdges[he.next].origin];
    const px = wOf(p.x); const py = wOf(p.y); const ex = wOf(q.x) - px; const ey = wOf(q.y) - py;
    const den = ux * ey - uy * ex;
    if (Math.abs(den) < 1e-12) continue;
    const s = ((px - a[0]) * uy - (py - a[1]) * ux) / den;
    if (s < -1e-9 || s > 1 + 1e-9) continue;
    const at = [px + ex * s, py + ey * s];
    const t = (at[0] - a[0]) * ux + (at[1] - a[1]) * uy;
    if (t <= PARTITION_SNAP_TOLERANCE || t > L + 1e-9) continue;
    let vertex = null;
    if (s <= 1e-6) vertex = he.origin;
    else if (s >= 1 - 1e-6) vertex = arr.halfEdges[he.next].origin;
    if (!best || t < best.t - 1e-12 || (Math.abs(t - best.t) <= 1e-12 && he.edge < best.edgeId)) {
      best = { t, at, vertex, edgeId: he.edge, halfEdge: h };
    }
  }
  return best;
}

/**
 * ⭐ POINT LOCATION. A linear scan with a bounding-box pre-filter over the LIVE bounded faces.
 * ⚠ NAMED HONESTLY: this is the same O(F) scan `fabricDcel.locateFace` uses, and the panel's S4
 * minor named it. It is used at CONSTRUCTION-time only, at ring insertion, where the number of
 * calls is the number of ring segments (tens), never per plot.
 */
export function locateFace(arr, x, y) {
  const qx = qOf(x); const qy = qOf(y);
  let best = -1; let bestArea = Infinity;
  for (const f of arr.faces) {
    if (!f.alive || f.cls === 'OUTER') continue;
    const ring = faceRingInt(arr, f.id);
    if (ring.length < 3) continue;
    let lox = Infinity; let loy = Infinity; let hix = -Infinity; let hiy = -Infinity;
    for (const p of ring) {
      if (p[0] < lox) lox = p[0]; if (p[0] > hix) hix = p[0];
      if (p[1] < loy) loy = p[1]; if (p[1] > hiy) hiy = p[1];
    }
    if (qx < lox || qx > hix || qy < loy || qy > hiy) continue;
    const v = pointInRingInt(ring, qx, qy);
    if (v === false) continue;
    const a = Math.abs(area2Int(ring));
    if (a < bestArea) { bestArea = a; best = f.id; }
  }
  return best;
}

/**
 * ⭐⭐⭐ **THE PLANARITY INSTRUMENT.** Every pair of edges whose open interiors properly cross —
 * which must be EMPTY, and is empty BY CONSTRUCTION. Exact integer predicate, bucketed so the
 * sweep is local.
 * ⚠ IT IS ALSO THE `strict` MODE'S ORACLE: set `arr.strict = true` and every mutation re-runs it,
 * so the FIRST operation that breaks the structure is named instead of the hundredth being
 * discovered. That is how the split-point-off-its-own-edge defect was located.
 */
export function properCrossings(arr, limit = 64) {
  const segs = [];
  for (const e of arr.edges) {
    const h = arr.halfEdges[e.he];
    const a = arr.verts[h.origin]; const b = arr.verts[arr.halfEdges[h.twin].origin];
    segs.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, e });
  }
  let cell = 0;
  for (const s of segs) cell += Math.abs(s.bx - s.ax) + Math.abs(s.by - s.ay);
  cell = Math.max(1, Math.round(cell / Math.max(1, segs.length)));
  const grid = new Map();
  segs.forEach((s, i) => {
    const lox = Math.floor(Math.min(s.ax, s.bx) / cell); const hix = Math.floor(Math.max(s.ax, s.bx) / cell);
    const loy = Math.floor(Math.min(s.ay, s.by) / cell); const hiy = Math.floor(Math.max(s.ay, s.by) / cell);
    for (let gy = loy; gy <= hiy; gy++) {
      for (let gx = lox; gx <= hix; gx++) {
        const k = `${gx}|${gy}`; const b = grid.get(k); if (b) b.push(i); else grid.set(k, [i]);
      }
    }
  });
  const out = []; const seen = new Set();
  for (const bucket of grid.values()) {
    for (let x = 0; x < bucket.length; x++) {
      for (let y = x + 1; y < bucket.length; y++) {
        const i = bucket[x]; const j = bucket[y];
        const pk = i < j ? `${i}:${j}` : `${j}:${i}`;
        if (seen.has(pk)) continue;
        seen.add(pk);
        const s = segs[i]; const t = segs[j];
        if (properCrossInt(s.ax, s.ay, s.bx, s.by, t.ax, t.ay, t.bx, t.by)) {
          if (out.length < limit) {
            out.push({
              a: s.e.key, aType: s.e.type, aId: s.e.id, aSeg: [[s.ax, s.ay], [s.bx, s.by]],
              b: t.e.key, bType: t.e.type, bId: t.e.id, bSeg: [[t.ax, t.ay], [t.bx, t.by]],
            });
          }
          else return out;
        }
      }
    }
  }
  return out;
}

function strictCheck(arr, where, detail) {
  if (!arr.strict) return;
  if (arr.trace) arr.trace.push({ op: arr.ops, where, ...detail });
  if (arr.firstBreak) return;
  const x = properCrossings(arr, 2);
  if (x.length) arr.firstBreak = { where, detail, op: arr.ops, crossing: x[0] };
}

/** Every live face that is not the unbounded one. */
export function liveFaces(arr) {
  return arr.faces.filter((f) => f.alive && f.cls !== 'OUTER');
}

/** ⭐ THE PIECE HIERARCHY. A piece is a NAMED face at one of the three levels; §1's containment
 *  law (`plot ⊂ block ⊂ ward`) is this tree, and the geometric half is checked by the census. */
export function mintPiece(arr, cls, faceId, parentPiece, attrs) {
  const id = arr.pieces.length;
  arr.pieces.push({
    id, cls, parent: parentPiece == null ? -1 : parentPiece, children: [], face: faceId,
    attrs: attrs || {},
  });
  if (parentPiece != null && parentPiece >= 0) arr.pieces[parentPiece].children.push(id);
  if (faceId >= 0) arr.faces[faceId].piece = id;
  return id;
}

/** A piece's ancestor chain, coarsest last. */
export function pieceChain(arr, pieceId) {
  const out = [];
  let p = pieceId;
  let guard = 0;
  while (p >= 0 && guard++ < 64) { out.push(arr.pieces[p]); p = arr.pieces[p].parent; }
  return out;
}

/** Vertices flagged as FRONTIER — where §1 says the next epoch may add pieces. */
export function frontierVertices(arr) {
  const out = [];
  for (let i = 0; i < arr.verts.length; i++) if (arr.verts[i].frontier) out.push(i);
  return out;
}

/** Edges flagged as FRONTIER. */
export function frontierEdges(arr) {
  return arr.edges.filter((e) => e.frontier);
}
