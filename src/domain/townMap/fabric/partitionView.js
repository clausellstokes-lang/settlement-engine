/**
 * domain/townMap/fabric/partitionView.js — ⭐⭐⭐ SPINE-1 · DESIGN_SPINE §4 as amended by **A1.2**
 * (and consuming A2.1's cut record) · **THE PAGE REGISTER: THE DISCIPLINED PROJECTION.**
 *
 * §4's law is that views read the partition plus closed dress vocabularies and NOTHING else. This
 * module reads a `SETTLED_GROUND_PARTITION` and emits a page frame. It derives no geometry the
 * partition does not already hold, it opens no random stream, and it draws no stroke object for a
 * street — because there is none to draw.
 *
 * ⭐⭐⭐ **THE TWO-STAGE AGGREGATION (A1.2, the panel's own cure, adopted).**
 *   STAGE 1 · the PARTY-RUN MASS — dissolve the interior party `BOUND` edges of one run.
 *   STAGE 2 · CHUNK adjacent runs *within one BLOCK face* up to the band ceiling, members
 *             concatenated.
 * ⭐⭐ AND UNDER A2.1 STAGE 1 IS **FREE**: the cut that made the run typed its edges at cut time,
 * so a run is a recorded fact on the faces (`attrs.run`), not something the view rediscovers.
 * *Subdivision and aggregation are one law written from opposite ends* — the dissolve is the exact
 * inverse of the gapless cut, and a gap cut is exactly where a run ends.
 *
 * ⭐⭐ **THE SEAM LAW (A1.2 / S5-M4), AND IT IS ENFORCED AT THE VERTEX RATHER THAN PER MASS.**
 * A1.2 requires each shared polyline be simplified ONCE so both faces reuse it — simplifying two
 * adjacent masses' shared boundary independently produces overlaps and slivers at every mass
 * boundary. Here simplification is a decision about a VERTEX (drop a degree-2 vertex whose turn is
 * under the threshold), taken once for the whole arrangement, so two masses sharing a boundary
 * cannot disagree about it. That is the seam law made structural instead of procedural.
 *
 * ⭐ **RIDGE GEOMETRY IS TRUTH AND IS DECOUPLED FROM CHUNKING (A1.2).** One ridge per PARTY RUN
 * (hf378), emitted on the run, never on the chunk — so a band-forced chunk boundary can never draw
 * a ridge break across a party line the truth says is continuous.
 *
 * ⭐ **IDENTITY IS A BIJECTION (A1.2 / S5-M1)**, checked at the END of the derivation in BOTH
 * directions: every truth plot is drawn-as-itself XOR owned by exactly one drawn mass. `identity`
 * below is that census, and it is computed after every drop, because drops happen after aggregation
 * — the one-directional spelling would pass the live 44/56/139-dwelling suppression defect.
 *
 * ⚠ **MONUMENTS NEVER AGGREGATE** (§4 / L-REG-30 generalized). SPINE-1 mints no institutions
 * (A1.5 keeps seating its own car), so the roster the exemption applies to is the VOID pieces and
 * the gates — both drawn at their own register and named in `neverAggregate`.
 *
 * ⚠ **FRAME-TO-EXTENT IS THE VIEW'S FIRST DUTY** (A1.5 — CAR-FRAME absorbed). The frame is derived
 * from the partition's own extent, so the metropolis's wall and two of its five gates cannot be
 * drawn beyond the page and clipped (review I9).
 *
 * PURITY: pure. No Date, no Math.random, no rng of any kind — a view that draws is a view that
 * cannot be re-derived, and §4's determinism exit turns on this file having no draws at all.
 */

import { faceArea, faceCentroid, faceRing, liveFaces } from './partitionArrangement.js';

export const PAGE_VIEW_SCHEMA_VERSION = 1;

/**
 * ⭐⭐ THE BAND, IN ROAD-WIDTH² — A1.2's pin, verbatim: *"the band is pinned in road-width² space:
 * 2.7–4.6 rw² (the reference band under normalization; runs measure 2.9–3.5 rw² — inside)"*.
 * Stage-2 chunking grows a mass until it would leave the ceiling.
 */
export const PAGE_BAND_RW2 = Object.freeze({ floor: 2.7, ceiling: 4.6 });

/**
 * ⭐ THE SIMPLIFICATION THRESHOLD, in degrees of turn. A degree-2 vertex whose two edges turn by
 * less than this is dropped from every boundary that uses it — once, globally (see the seam law).
 * ⚠ PROPOSED; rides the tuning signature.
 */
export const PAGE_SIMPLIFY_TURN_DEG = 4;

/** The page's own face classes, in draw order — ground first, pieces over it. */
export const PAGE_LAYERS = Object.freeze(['ground', 'ways', 'voids', 'masses', 'band', 'gates',
  'fields', 'marks']);

/** Classes that are drawn at their OWN register and may never be absorbed into a mass. */
export const NEVER_AGGREGATE = Object.freeze(['VOID', 'WALLBAND']);

const DEG = 180 / Math.PI;

/**
 * ⭐⭐⭐ PROJECT A PARTITION TO A PAGE FRAME.
 *
 * @param {any} partition a `SETTLED_GROUND_PARTITION`
 * @param {{roadWidth:number, epoch?:number, bandCeiling?:number}} opts
 */
export function projectPage(partition, opts = {}) {
  const arr = partition.arrangement;
  const rw = opts.roadWidth || 5;
  const rw2 = rw * rw;
  const ceiling = (opts.bandCeiling || PAGE_BAND_RW2.ceiling) * rw2;

  // ── 0 · FRAME TO EXTENT — the view's FIRST duty (A1.5, CAR-FRAME absorbed) ──────────────────
  const frame = frameOfPartition(arr);

  // ── the seam law's one decision: which vertices survive, decided once for the whole page ────
  const keep = simplifyDecision(arr);

  // ── STAGE 1 · PARTY-RUN MASSES (A2.1's cut record read, not re-derived) ─────────────────────
  /** @type {Map<string, number[]>} */ const byRun = new Map();
  /** @type {Map<number, number>} */ const pieceOfFace = new Map();
  const plots = [];
  for (const f of liveFaces(arr)) {
    if (f.cls !== 'PLOT') continue;
    plots.push(f.id);
    pieceOfFace.set(f.id, f.piece);
    const run = (f.attrs && f.attrs.run) || `f${f.id}`;
    const hit = byRun.get(run);
    if (hit) hit.push(f.id); else byRun.set(run, [f.id]);
  }
  // ⚠ THE ORDER IS THE RUN KEY'S, sorted — never Map insertion order, which is construction order
  // and would make the page depend on the sequence the constructor happened to take.
  const runKeys = [...byRun.keys()].sort();
  const runs = runKeys.map((run) => {
    const faces = byRun.get(run).slice().sort((a, b) => a - b);
    return {
      run,
      faces,
      block: blockOf(arr, faces[0]),
      area: faces.reduce((s, id) => s + faceArea(arr, id), 0),
      ring: dissolve(arr, faces, keep),
      /** ⭐ ONE RIDGE PER PARTY RUN — truth, decoupled from chunking (A1.2 / hf378). */
      ridge: ridgeOf(arr, faces),
    };
  });

  // ── STAGE 2 · CHUNK ADJACENT RUNS WITHIN ONE BLOCK, up to the band ceiling ──────────────────
  /** @type {Map<string, any[]>} */ const byBlock = new Map();
  for (const r of runs) {
    const hit = byBlock.get(r.block);
    if (hit) hit.push(r); else byBlock.set(r.block, [r]);
  }
  const masses = [];
  for (const block of [...byBlock.keys()].sort()) {
    let cur = null;
    for (const r of byBlock.get(block)) {
      if (cur && cur.area + r.area <= ceiling) {
        cur.faces.push(...r.faces);
        cur.members.push(r.run);
        cur.ridges.push(r.ridge);
        cur.runRings.push(r.ring);
        cur.area += r.area;
        continue;
      }
      if (cur) masses.push(finishMass(arr, cur, keep, rw2));
      cur = {
        block, faces: r.faces.slice(), members: [r.run], ridges: [r.ridge],
        runRings: [r.ring], area: r.area,
      };
    }
    if (cur) masses.push(finishMass(arr, cur, keep, rw2));
  }

  // ── the rest of the page: ground, ways, voids, band, gates, fields ──────────────────────────
  const ways = [];
  const voids = [];
  const band = [];
  const fields = [];
  /** ⭐⭐ SPINE-2 · §3e's and §3f's own page rosters. A face class the page does not carry is a
   *  face class the page silently drops, which is the 44/56/139-dwelling defect by another door. */
  const water = [];
  const loss = [];
  for (const f of liveFaces(arr)) {
    if (f.cls === 'WATER') {
      water.push({
        face: f.id, kind: (f.attrs && f.attrs.waterKind) || 'river',
        waterGate: !!(f.attrs && f.attrs.waterGate), ring: ringOf(arr, f.id, keep),
      });
    } else if (f.cls === 'LOSSREGION') {
      loss.push({
        face: f.id, key: f.attrs && f.attrs.loss, state: (f.attrs && f.attrs.lossState) || 'INTACT',
        ring: ringOf(arr, f.id, keep),
      });
    } else if (f.cls === 'WAY') {
      ways.push({
        face: f.id, rank: (f.attrs && f.attrs.rank) || 'lane', gate: !!(f.attrs && f.attrs.gate),
        ring: ringOf(arr, f.id, keep),
      });
    } else if (f.cls === 'VOID') {
      voids.push({ face: f.id, kind: (f.attrs && f.attrs.voidKind) || 'court', ring: ringOf(arr, f.id, keep) });
    } else if (f.cls === 'WALLBAND') {
      band.push({ face: f.id, wrap: f.attrs && f.attrs.wrap, ring: ringOf(arr, f.id, keep) });
    } else if (f.cls === 'FIELD') {
      fields.push({ face: f.id, ring: ringOf(arr, f.id, keep) });
    }
  }
  const gates = ways.filter((w) => w.gate).map((w) => ({ face: w.face, rank: w.rank, at: faceCentroid(arr, w.face) }));

  // ── E8 · THE IDENTITY BIJECTION, BOTH DIRECTIONS, AT THE END ────────────────────────────────
  const identity = bijection(plots, masses);
  // ⭐⭐⭐ **SPINE-2 · E8 EXTENDED OVER THE NEW FACE CLASSES.** A1.2's law is *"every truth plot is
  // drawn-as-itself XOR owned by exactly one drawn mass, BOTH DIRECTIONS"*, and §3e/§3f add three
  // families of truth face the original bijection cannot see: `WATER`, `LOSSREGION`, and the
  // moored quay pieces (which ARE plots and ride the mass census already). A page that carried
  // masses faithfully and silently dropped the river would pass E8 as SPINE-1 spelled it.
  const identityExtended = classBijection(arr, {
    WATER: water.map((x) => x.face),
    LOSSREGION: loss.map((x) => x.face),
  });

  // ── the page budget census, in the band's own unit ──────────────────────────────────────────
  const budget = pageBudget(masses, ways, voids, band, fields, rw2);

  return Object.freeze({
    artifactKind: 'PARTITION_PAGE_FRAME',
    schemaVersion: PAGE_VIEW_SCHEMA_VERSION,
    frame,
    /** ⚠ THE GROUND IS THE PAGE'S OWN SURFACE AND THE STREETS ARE WHAT SHOWS THROUGH IT. There is
     *  no street object here to stroke; §650 is enforced by the absence. */
    ground: Object.freeze({ kind: 'SETTLED_SURFACE', frame }),
    masses: Object.freeze(masses),
    ways: Object.freeze(ways),
    voids: Object.freeze(voids),
    band: Object.freeze(band),
    /** ⭐⭐ SPINE-2 · §3e's and §3f's own page rosters, carried so the extended bijection has
     *  something to be a bijection ONTO. */
    water: Object.freeze(water),
    loss: Object.freeze(loss),
    crossings: Object.freeze((partition.crossings || []).map((c) => Object.freeze({
      kind: c.kind, at: c.at, station: c.station, localWidth: c.localWidth,
    }))),
    quays: Object.freeze(partition.quays || []),
    gates: Object.freeze(gates),
    fields: Object.freeze(fields),
    wraps: partition.wraps,
    neverAggregate: NEVER_AGGREGATE,
    layers: PAGE_LAYERS,
    identity,
    identityExtended,
    budget,
    reason: `${masses.length} page mass(es) over ${runs.length} party run(s) and ${plots.length}`
      + ` truth plot(s); ${ways.length} way face(s), ${voids.length} void(s), ${band.length} band`
      + ` face(s), ${gates.length} gate(s); identity ${identity.ok ? 'BIJECTIVE' : 'BROKEN'}`
      + ` (${identity.orphans.length} orphan(s), ${identity.doubles.length} double(s));`
      + ` ${water.length} water face(s), ${loss.length} loss region(s),`
      + ` ${(partition.crossings || []).length} crossing(s), ${(partition.quays || []).length}`
      + ` quay(s) — extended identity ${identityExtended.ok ? 'BIJECTIVE' : 'BROKEN'}`,
  });
}

/** ⭐ THE FRAME — the partition's own extent, so nothing can be drawn off the page. */
function frameOfPartition(arr) {
  let lox = Infinity; let loy = Infinity; let hix = -Infinity; let hiy = -Infinity;
  for (const v of arr.verts) {
    const x = v.x / arr.quantumPerUnit; const y = v.y / arr.quantumPerUnit;
    if (x < lox) lox = x; if (x > hix) hix = x;
    if (y < loy) loy = y; if (y > hiy) hiy = y;
  }
  return Object.freeze({ x: lox, y: loy, w: hix - lox, h: hiy - loy });
}

/**
 * ⭐⭐ THE SEAM LAW'S SINGLE DECISION. A vertex is dropped when it has degree 2 and its two edges
 * turn by less than the threshold. Because it is a property of the VERTEX and not of a boundary,
 * every mass that uses it agrees — the shared polyline is simplified once, exactly as A1.2 orders.
 */
function simplifyDecision(arr) {
  const deg = new Array(arr.verts.length).fill(0);
  for (const e of arr.edges) {
    const h = arr.halfEdges[e.he];
    deg[h.origin]++;
    deg[arr.halfEdges[h.twin].origin]++;
  }
  const keep = new Array(arr.verts.length).fill(true);
  for (const f of arr.faces) {
    if (!f.alive || f.cls === 'OUTER') continue;
    let h = f.he;
    const start = h;
    let guard = 0;
    do {
      const he = arr.halfEdges[h];
      const prev = arr.halfEdges[he.prev];
      const v = he.origin;
      if (deg[v] === 2) {
        const a = arr.verts[prev.origin];
        const b = arr.verts[v];
        const c = arr.verts[arr.halfEdges[he.next].origin];
        const t = Math.abs(turnDeg(a, b, c));
        if (t < PAGE_SIMPLIFY_TURN_DEG) keep[v] = false;
      }
      h = he.next;
      if (++guard > 100000) break;
    } while (h !== start);
  }
  return keep;
}

function turnDeg(a, b, c) {
  const ux = b.x - a.x; const uy = b.y - a.y;
  const vx2 = c.x - b.x; const vy2 = c.y - b.y;
  const cross = ux * vy2 - uy * vx2;
  const dot = ux * vx2 + uy * vy2;
  return Math.atan2(cross, dot) * DEG;
}

/** A face's ring in world units, with the page's simplification applied. */
function ringOf(arr, fid, keep) {
  const out = [];
  let h = arr.faces[fid].he;
  const start = h;
  let guard = 0;
  do {
    const v = arr.halfEdges[h].origin;
    if (keep[v]) out.push([arr.verts[v].x / arr.quantumPerUnit, arr.verts[v].y / arr.quantumPerUnit]);
    h = arr.halfEdges[h].next;
    if (++guard > 100000) break;
  } while (h !== start);
  return out.length >= 3 ? out : faceRing(arr, fid);
}

/**
 * ⭐⭐⭐ **THE DISSOLVE.** The boundary of a face SET: every half-edge whose face is in the set and
 * whose twin's face is not, chained head to tail. Exact — there is no snapping, no tolerance and no
 * residual to close, because the faces already share their edges. A1.2's *"the partition's planarity
 * makes REG-1's snap machinery unnecessary — no 0.035 residual"* is this function.
 */
function dissolve(arr, faces, keep) {
  const inSet = new Set(faces);
  /** @type {Map<number, number>} */ const nextAt = new Map();
  let first = -1;
  for (const fid of faces) {
    let h = arr.faces[fid].he;
    const start = h;
    let guard = 0;
    do {
      const he = arr.halfEdges[h];
      const twinFace = arr.halfEdges[he.twin].face;
      if (!inSet.has(twinFace)) {
        nextAt.set(he.origin, arr.halfEdges[he.twin].origin);
        if (first < 0) first = he.origin;
      }
      h = he.next;
      if (++guard > 100000) break;
    } while (h !== start);
  }
  if (first < 0) return [];
  const out = [];
  let v = first;
  for (let i = 0; i < nextAt.size + 2; i++) {
    if (keep[v]) out.push([arr.verts[v].x / arr.quantumPerUnit, arr.verts[v].y / arr.quantumPerUnit]);
    const nx = nextAt.get(v);
    if (nx === undefined || nx === first) break;
    v = nx;
  }
  return out;
}

/** ⭐ ONE RIDGE PER PARTY RUN — the run's own long axis, from its dissolved footprint. */
function ridgeOf(arr, faces) {
  const pts = [];
  for (const fid of faces) for (const p of faceRing(arr, fid)) pts.push(p);
  if (pts.length < 2) return null;
  let bi = 0; let bj = 0; let bd = -1;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = (pts[i][0] - pts[j][0]) ** 2 + (pts[i][1] - pts[j][1]) ** 2;
      if (d > bd) { bd = d; bi = i; bj = j; }
    }
  }
  const c = faces.map((f) => faceCentroid(arr, f));
  const cx = c.reduce((s, p) => s + p[0], 0) / c.length;
  const cy = c.reduce((s, p) => s + p[1], 0) / c.length;
  const dx = pts[bj][0] - pts[bi][0]; const dy = pts[bj][1] - pts[bi][1];
  const L = Math.hypot(dx, dy) || 1;
  const half = L * 0.5 * 0.82;
  return [[cx - (dx / L) * half, cy - (dy / L) * half], [cx + (dx / L) * half, cy + (dy / L) * half]];
}

function blockOf(arr, fid) {
  const a = arr.faces[fid].attrs;
  return (a && a.block) || `f${fid}`;
}

/** Close a chunk: its dissolved ring, its member ids and its UNIT LINES. */
function finishMass(arr, cur, keep, rw2) {
  const ring = dissolve(arr, cur.faces, keep);
  return Object.freeze({
    block: cur.block,
    /** ⭐⭐ THE MEMBER IDS — §4's identity law: *"every mass carries its member-plot ids"*. */
    members: Object.freeze(cur.faces.slice()),
    runs: Object.freeze(cur.members.slice()),
    ring: Object.freeze(ring),
    area: cur.area,
    areaRw2: cur.area / rw2,
    /** ⭐⭐ UNIT LINES, AND THEY ARE COUNTED IN THE BUDGET (A1.2 / MF-S1's banned prior #4): a page
     *  mass is an AGGREGATION, never a hollow block-wash. A 30-member mass is 31 primitives. */
    unitLines: Object.freeze(unitLines(arr, cur.faces, keep)),
    /** ⭐ RIDGES RIDE THE RUN, NOT THE CHUNK — a chunk boundary never breaks a continuous ridge. */
    ridges: Object.freeze(cur.ridges.filter(Boolean)),
    /**
     * ⭐⭐ **DRESS-1 / PA.6 · THE RUN'S OWN DISSOLVED FOOTPRINT, PUBLISHED BESIDE ITS RIDGE AND
     * INDEX-PAIRED WITH IT.** PA.6 rules that a ridge clips to *"the run's own dissolved footprint,
     * NEVER the chunk"*, and review B7's defect is exactly a ridge overshooting its eaves (max
     * 52.6 u, crossing open ground). The chunk ring was the only footprint a dress could reach
     * from here, so the law was unenforceable at the consumer; the run rings were already computed
     * in stage 1 and were simply not carried. Nothing is re-derived and no count moves — `ridges`,
     * `unitLines` and `members` are untouched, so `pageBudget` reads exactly what it read before.
     */
    runRings: Object.freeze(cur.runRings.map((r) => Object.freeze(r))),
    ridgeOfRun: Object.freeze(cur.ridges.slice()),
  });
}

/** The interior party lines of a mass — the shared edges its members do NOT share with outside. */
function unitLines(arr, faces, keep) {
  const inSet = new Set(faces);
  const seen = new Set();
  const out = [];
  for (const fid of faces) {
    let h = arr.faces[fid].he;
    const start = h;
    let guard = 0;
    do {
      const he = arr.halfEdges[h];
      if (inSet.has(arr.halfEdges[he.twin].face) && !seen.has(he.edge)) {
        seen.add(he.edge);
        const a = arr.verts[he.origin];
        const b = arr.verts[arr.halfEdges[he.twin].origin];
        if (keep[he.origin] || keep[arr.halfEdges[he.twin].origin]) {
          out.push([[a.x / arr.quantumPerUnit, a.y / arr.quantumPerUnit],
            [b.x / arr.quantumPerUnit, b.y / arr.quantumPerUnit]]);
        }
      }
      h = he.next;
      if (++guard > 100000) break;
    } while (h !== start);
  }
  return out;
}

/**
 * ⭐⭐⭐ **E8 · THE IDENTITY BIJECTION.** Every truth plot is drawn-as-itself XOR owned by exactly
 * one drawn mass, **both directions**, at the END of the derivation.
 *
 * ⚠ THE ONE-DIRECTIONAL SPELLING PASSES A LIVE DEFECT. §6's original wording — *"every page mass
 * resolves to its member plots"* — is satisfied by a page that silently drops parcels: at the seal,
 * 44/56/139 dwellings at town/city/metropolis render NOWHERE because an aggregate that suppressed
 * them no longer exists. The reverse direction is the half that catches it.
 */
function bijection(plots, masses) {
  const owner = new Map();
  const doubles = [];
  for (const [mi, m] of masses.entries()) {
    for (const p of m.members) {
      if (owner.has(p)) doubles.push({ plot: p, masses: [owner.get(p), mi] });
      else owner.set(p, mi);
    }
  }
  const orphans = plots.filter((p) => !owner.has(p));
  const phantom = [...owner.keys()].filter((p) => !plots.includes(p));
  return {
    plots: plots.length,
    owned: owner.size,
    orphans,
    doubles,
    phantom,
    ok: orphans.length === 0 && doubles.length === 0 && phantom.length === 0,
    reason: `${owner.size}/${plots.length} truth plot(s) owned by exactly one drawn mass;`
      + ` ${orphans.length} orphan(s) (drawn nowhere), ${doubles.length} double(s) (owned twice),`
      + ` ${phantom.length} phantom(s) (owned but not truth)`,
  };
}

/**
 * ⭐⭐⭐ **E8, EXTENDED · EVERY TRUTH FACE OF A DRAWN CLASS IS DRAWN EXACTLY ONCE.** The plot half
 * is `bijection` above; this is the same law over the classes §3e and §3f added, and it is a
 * bijection in both directions for the same reason: a roster that is a SUBSET of truth drops faces
 * silently, and one that is a SUPERSET draws faces the partition does not hold.
 */
function classBijection(arr, rosters) {
  const missing = [];
  const phantom = [];
  const counts = {};
  for (const [cls, drawn] of Object.entries(rosters)) {
    const truth = liveFaces(arr).filter((f) => f.cls === cls).map((f) => f.id);
    const drawnSet = new Set(drawn);
    counts[cls] = { truth: truth.length, drawn: drawn.length };
    for (const id of truth) if (!drawnSet.has(id)) missing.push({ cls, face: id });
    const truthSet = new Set(truth);
    for (const id of drawn) if (!truthSet.has(id)) phantom.push({ cls, face: id });
    if (drawn.length !== new Set(drawn).size) phantom.push({ cls, why: 'a face drawn twice' });
  }
  return {
    counts,
    missing,
    phantom,
    ok: missing.length === 0 && phantom.length === 0,
    reason: Object.entries(counts).map(([c, v]) => `${c} ${v.drawn}/${v.truth}`).join(' · ')
      + ` — ${missing.length} truth face(s) drawn nowhere, ${phantom.length} drawn but not truth`,
  };
}

/**
 * ⭐⭐ **E7 · THE PAGE BUDGET, IN THE BAND'S OWN UNIT.** Shapes are counted the way the page draws
 * them — a mass with 30 members is 31 primitives, not one — so the census cannot be satisfied by
 * hollowing a block out.
 */
export function pageBudget(masses, ways, voids, band, fields, rw2) {
  const areas = masses.map((m) => m.areaRw2).sort((a, b) => a - b);
  const q = (p) => (areas.length ? areas[Math.min(areas.length - 1, Math.floor(p * areas.length))] : 0);
  const inBand = areas.filter((a) => a >= PAGE_BAND_RW2.floor && a <= PAGE_BAND_RW2.ceiling).length;
  const unitLineCount = masses.reduce((s, m) => s + m.unitLines.length, 0);
  const ridgeCount = masses.reduce((s, m) => s + m.ridges.length, 0);
  const shapes = masses.length + unitLineCount + ridgeCount + ways.length + voids.length
    + band.length + fields.length;
  return Object.freeze({
    masses: masses.length,
    unitLines: unitLineCount,
    ridges: ridgeCount,
    ways: ways.length,
    voids: voids.length,
    band: band.length,
    fields: fields.length,
    shapes,
    bandRw2: PAGE_BAND_RW2,
    massAreaRw2: Object.freeze({ p10: q(0.1), p25: q(0.25), p50: q(0.5), p75: q(0.75), p90: q(0.9) }),
    /** The reference's own invariant: p75/p25 ≈ 1.71–1.72, measured at two scales. */
    bandRatio: q(0.25) > 0 ? q(0.75) / q(0.25) : 0,
    inBand,
    inBandShare: masses.length ? inBand / masses.length : 0,
    rw2,
    reason: `${shapes} page shape(s): ${masses.length} mass(es) + ${unitLineCount} unit line(s)`
      + ` + ${ridgeCount} ridge(s) + ${ways.length} way(s) + ${voids.length} void(s)`
      + ` + ${band.length} band + ${fields.length} field(s); ${inBand} mass(es) inside`
      + ` ${PAGE_BAND_RW2.floor}–${PAGE_BAND_RW2.ceiling} rw², band ratio`
      + ` ${(q(0.25) > 0 ? q(0.75) / q(0.25) : 0).toFixed(2)} against the reference's 1.71`,
  });
}
