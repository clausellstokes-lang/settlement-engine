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

  // ── 0 · THE CONTENT FRAME — the bounding box of everything the partition holds, hinterland
  //    included. ⚠ IT IS NO LONGER THE PAGE (DRESS-FRAME, ODQ §702.1): it is retained and
  //    published so a census can state the before-figure, and so the paper can be laid under a
  //    frame that may sit outside it. The PAGE frame is fitted to the settlement, below.
  const contentFrame = frameOfPartition(arr);

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

  // ── ⭐⭐⭐ THE PAGE IS FITTED TO THE SETTLEMENT (DRESS-FRAME) ─────────────────────────────────
  //    Computed HERE rather than at stage 0 because it needs the drawn bodies, which is the
  //    whole point: the frame follows what the settlement DRAWS, not what the partition SPANS.
  const bound = settlementBound(partition, masses, band, voids);
  const frame = fitFrame(bound.cx, bound.cy, bound.radius, opts.aspect || 1);

  return Object.freeze({
    artifactKind: 'PARTITION_PAGE_FRAME',
    schemaVersion: PAGE_VIEW_SCHEMA_VERSION,
    frame,
    /** ⭐ THE BEFORE-FIGURE, PUBLISHED RATHER THAN RECOVERABLE ONLY BY REVERTING. `contentFrame`
     *  is what `frame` was until DRESS-FRAME: the bbox of every vertex the partition holds,
     *  hinterland included. A census can state the shift without a second checkout. */
    contentFrame,
    /** ⭐ THE BOUND THE FRAME WAS FITTED TO, and WHICH RULE FITTED IT — so a reader never has to
     *  infer whether a leaf was framed by its enclosure or by its whole body. */
    bound: Object.freeze(bound),
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

/**
 * ⭐⭐⭐ **FIT A PAGE TO A SETTLEMENT — the reference's own rule, restated (ODQ §702.1).**
 *
 * The drawn diameter `2R` is set to the page's **SHORT** side. On a square page that inscribes the
 * settlement's disc and gives it **π/4 = 78.5 %** of the plate; on 16:9 it gives 44.2 %; at 2:1,
 * 39.3 %. Past 2:1 the rule flips: the diameter is set to **half the LONG side**, which is larger
 * than the short one, so the settlement deliberately **overflows and is cropped** rather than
 * shrinking to a dot in a letterbox. The two branches agree exactly at 2:1.
 *
 * ⭐ THERE IS NO MARGIN CONSTANT, NO PADDING AND NO CONTENT BOX. That absence is the mechanism, not
 * an omission: a margin makes the share depend on the margin, and a content box lets the
 * countryside — which is generated far wider than the frame on purpose — decide the camera.
 *
 * ⚠ THE ORIGIN IS THE SETTLEMENT'S OWN CENTRE, never the centroid of drawn content. A lopsided
 * town sits lopsided in the frame; nothing re-centres it.
 *
 * @param {number} cx @param {number} cy
 * @param {number} radius the settlement radius, world units
 * @param {number} [aspect] page width ÷ page height (1 = square)
 */
export function fitFrame(cx, cy, radius, aspect = 1) {
  const a = Number.isFinite(aspect) && aspect > 0 ? aspect : 1;
  const R = Number.isFinite(radius) && radius > 0 ? radius : 1;
  const longOverShort = a >= 1 ? a : 1 / a;
  const longWorld = longOverShort > 2 ? 4 * R : 2 * R * longOverShort;
  const shortWorld = longWorld / longOverShort;
  const w = a >= 1 ? longWorld : shortWorld;
  const h = a >= 1 ? shortWorld : longWorld;
  return Object.freeze({ x: cx - w / 2, y: cy - h / 2, w, h });
}

/**
 * ⭐⭐⭐ **THE SETTLEMENT'S OWN BOUND — and the countryside is never consulted.**
 *
 * The reference computes its page extent from *"the greatest distance from the origin to any vertex
 * of any patch flagged as within the city"*; countryside patches are not read at all. Ours states
 * the same law in the vocabulary we have:
 *
 * > **A settlement's bound is its ENCLOSURE where it has one, and its whole drawn body where it
 * > has none.** A body that reaches into the enclosure carries the bound out with it — the
 * > faubourg at the gate is part of the town — but a hamlet standing off in the fields does not,
 * > because it is countryside, and the countryside does not set the camera.
 *
 * ⚠ THE CASE SPLIT IS A FACT ABOUT THE WORLD, NOT A DIAL. A walled town's edge is its wall; an
 * open one has no edge and simply stops (which is the reference's own account of its fringe).
 * There is no threshold, no quantile and no tuning number anywhere in this function.
 *
 * ⛔ WHAT IT DELIBERATELY EXCLUDES, each for the same reason — none of them is the settlement:
 * `FIELD` faces (the hinterland, seeded to 1.45× the settlement radius on purpose), `WATER`
 * (a river crosses the whole leaf), `LOSSREGION`, and `WAY` faces (approach roads run to the
 * frontier; in the reference a way is not a patch at all).
 *
 * @param {any} partition a `SETTLED_GROUND_PARTITION`
 * @param {Array<{ring:Array<[number,number]>}>} masses
 * @param {Array<{ring:Array<[number,number]>}>} band
 * @param {Array<{ring:Array<[number,number]>}>} voids
 * @returns {{cx:number, cy:number, radius:number, rule:string, enclosed:boolean}}
 */
export function settlementBound(partition, masses = [], band = [], voids = []) {
  const bodies = [];
  for (const grp of [masses, band, voids]) {
    for (const o of (grp || [])) if (o && o.ring && o.ring.length >= 3) bodies.push(o.ring);
  }
  const wraps = (partition && partition.wraps) || [];
  const rings = [];
  for (const w of wraps) if (w && w.outer && w.outer.length >= 3) rings.push(w.outer);

  if (rings.length) {
    // ── THE ENCLOSURE CASE. Centre and radius over every circuit's outer ring, so a town with an
    //    old core inside a later curtain is bounded by the curtain without anybody deciding which
    //    circuit is "the" one.
    let sx = 0; let sy = 0; let n = 0;
    for (const r of rings) for (const p of r) { sx += p[0]; sy += p[1]; n++; }
    const cx = sx / n; const cy = sy / n;
    let R = 0;
    for (const r of rings) for (const p of r) { const d = Math.hypot(p[0] - cx, p[1] - cy); if (d > R) R = d; }
    // ── the faubourg clause: a body that reaches inside the circuit is part of the town.
    let out = R;
    for (const ring of bodies) {
      let touches = false; let far = 0;
      for (const p of ring) {
        const d = Math.hypot(p[0] - cx, p[1] - cy);
        if (d <= R) touches = true;
        if (d > far) far = d;
      }
      if (touches && far > out) out = far;
    }
    return {
      cx, cy, radius: out, enclosed: true,
      rule: `enclosure: ${rings.length} circuit(s), radius ${R.toFixed(1)}`
        + `${out > R ? `, carried to ${out.toFixed(1)} by a body reaching inside it` : ''}`,
    };
  }

  // ── THE OPEN CASE. No enclosure, so the settlement's bound is its OWN BUILT EXTENT, about its
  //    OWN STRUCTURAL CENTRE — the founding origin the countryside was seeded around. An open
  //    settlement has no edge line; it just stops, so it is bounded by what it needed rather than
  //    by where its outliers landed.
  //
  // ⭐⭐ THIS IS THE REFERENCE'S "GENERATE WIDE, FRAME TIGHT" AT OUR OWN RATIO. Its countryside is
  //    generated to 3× the frame and ~89 % of it is left off-page; ours is seeded to 1.45× the
  //    settlement radius, so framing at 1× puts every open leaf at the same 1.45× zoom and leaves
  //    the same share of hinterland outside. Nothing here knows the number 1.45: it reads the
  //    settlement radius the extent carries and the ratio falls out.
  //
  // ⛔⛔ TWO SPELLINGS BEFORE THIS ONE WERE WRONG, AND BOTH FAILURES ARE WORTH THE ROOM.
  //    (i) The bound as the drawn bodies about their own AREA-WEIGHTED CENTROID put the thorp's
  //    frame 378 units wide about a point 47 off the origin, when the whole generated countryside
  //    is a disc 287 wide about the origin — so the page ran OUT of countryside and the plate
  //    showed bare paper in one corner against a hard-edged green disc. ⭐ THE CLASS: **a frame
  //    centred on content can leave the ground that content stands on.**
  //    (ii) The bound as the drawn bodies about the ORIGIN fixed that, and bought nothing: the
  //    thorp's three farmsteads reach the frontier, so the frame stayed the content box and the
  //    zoom read 1.00×. **A settlement whose only bodies are scattered farms has no bound of its
  //    own to find by looking at them** — which is exactly why the reference reads a settlement
  //    radius rather than a content box, and why it would rather crop than surrender the page.
  const box = frameOfPartition(partition.arrangement);
  const ex = (partition && partition.extent) || null;
  const cx = ex && Number.isFinite(ex.cx) ? ex.cx : box.x + box.w / 2;
  const cy = ex && Number.isFinite(ex.cy) ? ex.cy : box.y + box.h / 2;
  if (ex && Number.isFinite(ex.settlementRadius) && ex.settlementRadius > 0) {
    return {
      cx, cy, radius: ex.settlementRadius, enclosed: false,
      rule: `open: the settlement's own built extent ${ex.settlementRadius.toFixed(1)}`
        + `, hinterland seeded to ${Number.isFinite(ex.radius) ? ex.radius.toFixed(1) : '?'}`,
    };
  }
  // ⚠ THE FALLBACK, AND IT SAYS SO IN `rule` RATHER THAN PASSING FOR THE LAW. A partition built
  //   without a settlement radius on its extent — a hand-made test fixture — is bounded by what
  //   it draws. Every corpus leaf carries the radius; if a leaf ever reports this rule, its
  //   producer dropped the field.
  if (!bodies.length) {
    return { cx, cy, radius: Math.max(box.w, box.h) / 2, enclosed: false, rule: 'FALLBACK: no settlement radius on the extent and no drawn body — the content box stands in' };
  }
  let R = 0;
  for (const ring of bodies) for (const p of ring) { const d = Math.hypot(p[0] - cx, p[1] - cy); if (d > R) R = d; }
  return { cx, cy, radius: R, enclosed: false, rule: `FALLBACK: no settlement radius on the extent — bounded by ${bodies.length} drawn body(ies)` };
}

/** Absolute polygon area (shoelace). */
function ringArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  return Math.abs(a) / 2;
}

/** ⭐ THE CONTENT BOX — every vertex the partition holds, hinterland included. It was the page
 *  frame until DRESS-FRAME; it is now published beside the fitted frame as the before-figure. */
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
