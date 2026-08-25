/**
 * domain/townMap/fabric/partitionCensus.js — ⭐⭐⭐ SPINE-1 · DESIGN_SPINE §1's invariants and §6's
 * exits · **THE PARTITION'S OWN INSTRUMENTS, EACH A REFUSAL WITH A PLANTABLE CONTROL.**
 *
 * §6's law: *"every zero with a live control."* So every function here returns the VIOLATIONS, not
 * a boolean — a caller can print them, a test can plant one and watch the count move by exactly
 * one, and nothing here can be satisfied by having nothing to check (each census also publishes the
 * size of the population it walked, which is what makes a zero non-vacuous).
 *
 * ⚠ THE ZEROS THAT ARE **BY CONSTRUCTION** ARE STILL MEASURED, and that is the point rather than a
 * redundancy. Planarity is an invariant of the substrate's operations (see `partitionArrangement`),
 * the tangential census is 0 because pieces conform to the band face, and no `WAY` face is minted
 * inside the watercourse because the constructor refuses it — but a zero nobody measures is a claim,
 * and the estate has already paid for that distinction more than once.
 *
 * PURITY: pure. No Date, no Math.random, no I/O.
 */

import {
  EDGE_TYPES, FACE_CLASSES, RESERVED_EDGE_TYPES, RESERVED_FACE_CLASSES,
  faceArea, faceCentroid, faceRing, liveFaces, properCrossings,
} from './partitionArrangement.js';
import { walkTotality } from './growthAnnotation.js';

/** The owing classes for A6.1's walker, over the PARTITION's own element families. */
export const PARTITION_OWING_CLASSES = Object.freeze(['plot', 'void', 'way', 'wallband', 'gate',
  'wall', 'ward']);

/**
 * ⭐⭐⭐ **E1 · THE SIX INVARIANTS OF §1.** Returns one row per arm with its violations and the
 * population it walked.
 *
 * @param {any} partition a `SETTLED_GROUND_PARTITION`
 * @param {{water?:{line:Array<number[]>,width:number}|null}} [input]
 */
export function censusInvariants(partition, input = {}) {
  const arr = partition.arrangement;
  const faces = liveFaces(arr);

  // 1 · PLANARITY — no two faces overlap. Measured as: no two edges properly cross.
  const crossings = properCrossings(arr, 32);

  // 2 · COVERAGE — the settled ground is exactly the union of faces. Measured by EULER, which is
  //     the independent oracle: V − E + F = 2 holds iff the subdivision is a connected planar map
  //     with no lost or doubled region. ⚠ `fabricDcel.js`'s own header records that this identity
  //     convicted its noder on exactly the six leaves whose residual was nonzero.
  const V = arr.verts.length;
  const E = arr.edges.length;
  const F = arr.faces.filter((f) => f.alive).length;
  const euler = V - E + F;

  // 3 · EDGE-TYPE TOTALITY — no untyped edge, and no type outside the closed roster.
  const untyped = arr.edges.filter((e) => !e.type || EDGE_TYPES.indexOf(e.type) < 0)
    .map((e) => ({ edge: e.id, key: e.key, type: e.type }));

  // 3b · FACE-CLASS TOTALITY, the same question one level up.
  const unclassed = faces.filter((f) => FACE_CLASSES.indexOf(f.cls) < 0)
    .map((f) => ({ face: f.id, cls: f.cls }));

  // 4 · CONTAINMENT — plot ⊂ block ⊂ ward, structurally AND geometrically.
  const containment = [];
  for (const f of faces) {
    if (f.cls !== 'PLOT') continue;
    if (f.piece < 0) { containment.push({ face: f.id, why: 'a plot face with no tenure piece' }); continue; }
    const piece = arr.pieces[f.piece];
    if (piece.cls !== 'PLOT') { containment.push({ face: f.id, why: `piece is ${piece.cls}` }); continue; }
    const block = piece.parent >= 0 ? arr.pieces[piece.parent] : null;
    if (!block || block.cls !== 'BLOCK') { containment.push({ face: f.id, why: 'no BLOCK parent' }); continue; }
    const ward = block.parent >= 0 ? arr.pieces[block.parent] : null;
    if (!ward || ward.cls !== 'WARD') { containment.push({ face: f.id, why: 'no WARD grandparent' }); }
  }

  // 5 · NO WAY FACE SPANS WATER (§1 / A1.5). Structural: the constructor refuses a way whose chord
  //     touches the wet band, so this is 0 BY CONSTRUCTION — and measured anyway.
  const wet = [];
  if (input.water && input.water.line && input.water.line.length > 1) {
    const half = (input.water.width || 0) / 2;
    for (const f of faces) {
      if (f.cls !== 'WAY') continue;
      for (const p of faceRing(arr, f.id)) {
        if (distToPolyline(p[0], p[1], input.water.line) <= half) {
          wet.push({ face: f.id, at: p });
          break;
        }
      }
    }
  }

  // 6 · A WALL EDGE COINCIDES WITH FACE BOUNDARIES ONLY — true by construction, because the wrap is
  //     INSERTED (which MAKES those boundaries) rather than drawn over the fabric. Measured as: no
  //     WALL edge is a bridge (both half-edges in one face cycle), and every WALL edge separates
  //     two distinct faces.
  const strayWall = [];
  for (const e of arr.edges) {
    if (e.type !== 'WALL') continue;
    const h = arr.halfEdges[e.he];
    const t = arr.halfEdges[h.twin];
    if (h.face === t.face) strayWall.push({ edge: e.id, key: e.key, why: 'the wall edge bounds one face on both sides' });
  }

  const arms = [
    { arm: 'planarity', walked: arr.edges.length, violations: crossings },
    { arm: 'coverage-euler', walked: F, violations: euler === 2 ? [] : [{ V, E, F, euler, want: 2 }] },
    { arm: 'edge-totality', walked: arr.edges.length, violations: untyped },
    { arm: 'face-totality', walked: faces.length, violations: unclassed },
    { arm: 'containment', walked: faces.filter((f) => f.cls === 'PLOT').length, violations: containment },
    { arm: 'no-way-spans-water', walked: faces.filter((f) => f.cls === 'WAY').length, violations: wet },
    { arm: 'wall-on-boundaries', walked: arr.edges.filter((e) => e.type === 'WALL').length, violations: strayWall },
  ];
  return {
    arms,
    ok: arms.every((a) => a.violations.length === 0),
    reason: arms.map((a) => `${a.arm} ${a.violations.length}/${a.walked}`).join(' · '),
  };
}

/**
 * ⭐⭐⭐ **E2 · THE TANGENTIAL-OR-CLEAR CENSUS (i12, §575/§645), RUN AGAINST THE BAND FACE.**
 * A1.3 rules the wall a THIN FACE, so the question is no longer "does a piece cross a line" but
 * "does a piece overlap the BAND's ground" — and in a planar subdivision the answer is 0 BY
 * CONSTRUCTION, because a face cannot overlap another face. What is measured is the population and
 * the two regimes: a piece ABUTS the band (shares an edge with a band face) or stands CLEAR.
 *
 * ⚠ THE INK IS NOT THIS CENSUS'S SUBJECT AND SAYING SO IS THE POINT. §3c's by-construction claim is
 * true of FACE geometry only; REG-2's dress can still put a merlon on unreserved ground (measured
 * at the seal: 1.4 units proud of a 0.05-unit reservation). That stays a measured exit of the
 * DRESS car, and this census does not silently cover for it.
 */
export function censusTangential(partition) {
  const arr = partition.arrangement;
  const band = new Set(liveFaces(arr).filter((f) => f.cls === 'WALLBAND').map((f) => f.id));
  const violations = [];
  let abutting = 0;
  let clear = 0;
  const pieces = liveFaces(arr).filter((f) => f.cls === 'PLOT' || f.cls === 'VOID' || f.cls === 'BLOCK');
  for (const f of pieces) {
    let touches = false;
    let h = arr.faces[f.id].he;
    const start = h;
    let guard = 0;
    do {
      const he = arr.halfEdges[h];
      if (band.has(arr.halfEdges[he.twin].face)) touches = true;
      h = he.next;
      if (++guard > 100000) break;
    } while (h !== start);
    if (touches) abutting++; else clear++;
  }
  // A piece whose class is a piece AND which is inside the band's own face set would be an overlap;
  // in a subdivision that is impossible, so the count is the structural zero and it is asserted.
  for (const f of pieces) if (band.has(f.id)) violations.push({ face: f.id, why: 'a piece IS a band face' });
  return {
    bandFaces: band.size,
    pieces: pieces.length,
    abutting,
    clear,
    violations,
    ok: violations.length === 0,
    reason: `${violations.length} tangential violation(s) over ${pieces.length} piece(s) against`
      + ` ${band.size} band face(s): ${abutting} abut the band, ${clear} stand clear`,
  };
}

/**
 * ⭐⭐⭐ **E3 · THE WAY×WALL CROSSING HALF (A1.7's M9 — SPINE-1 builds gates, so it proves them).**
 * Every WAY face that touches the band's ground must be a GATE. A way that crosses the band ungated
 * is review B2's measured defect class (≥4 aligned ungated street crossings on the town's S circuit,
 * with the engine's own `physicalViolations` blind to it).
 */
export function censusCrossings(partition) {
  const arr = partition.arrangement;
  const ungated = [];
  let crossings = 0;
  let abutting = 0;
  const wraps = partition.wraps || [];
  for (const f of liveFaces(arr)) {
    if (f.cls !== 'WAY') continue;
    // ⚠⚠ **CROSSING IS NOT TOUCHING, AND CONFLATING THEM MAKES THE CENSUS LIE IN BOTH DIRECTIONS.**
    // A way that runs ALONGSIDE the band shares edges with it and crosses nothing; a way that
    // crosses occupies the band's own annulus. The first spelling asked "does it share an edge",
    // which convicted 10–21 lawful wall-lane ways per leaf and would have convicted every future
    // §575 wall-lane by construction. The annulus test is the same question the constructor asks.
    const c = faceCentroid(arr, f.id);
    const inAnnulus = wraps.some((w) => inRingWorld(w.outer, c) && !inRingWorld(w.inner, c));
    if (!inAnnulus) { if (touchesBand(arr, f.id)) abutting++; continue; }
    crossings++;
    if (!(f.attrs && f.attrs.gate)) {
      ungated.push({ face: f.id, rank: f.attrs && f.attrs.rank, at: faceCentroid(arr, f.id) });
    }
  }
  // §202's no-opening floor: a circuit with no opening is not a circuit.
  const openings = (partition.wraps || []).map((w) => ({ wrap: w.index, gates: w.gates.length }));
  const closed = openings.filter((o) => o.gates === 0);
  return {
    crossings,
    abutting,
    gates: partition.gates.length,
    ungated,
    openings,
    closedCircuits: closed,
    ok: ungated.length === 0 && closed.length === 0,
    reason: `${crossings} WAY×BAND crossing(s) (+${abutting} abutting, which cross nothing),`
      + ` ${partition.gates.length} gate(s), ${ungated.length} ungated;`
      + ` ${closed.length} circuit(s) with no opening (§202 floor)`,
  };
}

/**
 * ⭐⭐ **THE RESERVED-CLASS CENSUS.** SPINE-1 mints ZERO `WATER`/`LOSSREGION` faces and ZERO
 * `CROSSING` edges — §3e is SPINE-2's and §3f is decline's. Reserving the spellings is what stops a
 * later car minting a second vocabulary; this proves the reservation rather than promising it.
 */
export function censusReserved(partition) {
  const arr = partition.arrangement;
  const faces = liveFaces(arr).filter((f) => RESERVED_FACE_CLASSES.indexOf(f.cls) >= 0)
    .map((f) => ({ face: f.id, cls: f.cls }));
  const edges = arr.edges.filter((e) => RESERVED_EDGE_TYPES.indexOf(e.type) >= 0)
    .map((e) => ({ edge: e.id, type: e.type }));
  return {
    faces,
    edges,
    reservedFaceClasses: RESERVED_FACE_CLASSES,
    reservedEdgeTypes: RESERVED_EDGE_TYPES,
    ok: faces.length === 0 && edges.length === 0,
    reason: `${faces.length} reserved face(s) and ${edges.length} reserved edge(s) minted;`
      + ` both must be 0 at SPINE-1 (${RESERVED_FACE_CLASSES.join('/')} · ${RESERVED_EDGE_TYPES.join('/')})`,
  };
}

/**
 * ⭐⭐⭐ **E9 · THE A6.1 TOTALITY WALKER (A1.7's M3 — emission moves INTO SPINE-1).** Every face and
 * every edge the partition draws is in an owing class and must carry the schema's annotation. The
 * planted-omission control must move the orphan count by exactly one.
 */
export function censusTotality(partition) {
  const arr = partition.arrangement;
  const drawn = [];
  for (const f of liveFaces(arr)) {
    if (f.cls === 'PLOT') drawn.push({ key: `plot.${f.piece}`, klass: 'plot' });
    else if (f.cls === 'VOID') drawn.push({ key: `void.${f.id}`, klass: 'void' });
    else if (f.cls === 'WAY') drawn.push({ key: (f.attrs && f.attrs.gate) ? `gate.${f.id}` : `way.${f.id}`, klass: (f.attrs && f.attrs.gate) ? 'gate' : 'way' });
    else if (f.cls === 'WALLBAND') drawn.push({ key: `wallband.${f.id}`, klass: 'wallband' });
  }
  for (const w of (partition.wraps || [])) drawn.push({ key: `wall.E${w.index}`, klass: 'wall' });
  for (const p of arr.pieces) if (p.cls === 'WARD') drawn.push({ key: `ward.${p.id}`, klass: 'ward' });
  const walk = walkTotality({
    drawn,
    annotations: partition.annotations,
    owing: PARTITION_OWING_CLASSES,
  });
  return { ...walk, drawnRoster: drawn.length, ok: walk.orphans.length === 0 };
}

/**
 * ⭐⭐ **A2.2's ORGANIC-GUARD METRICS, MEASURED AND REPORTED.** A2.2 closes P5 by naming what the
 * guard measures: roundness gradient centre→edge · junction-degree mix (T vs X share) · cut-angle
 * variance BY RECURSION DEPTH — and never spectral or jitter metrics.
 *
 * ⚠ **THIS IS A REPORT, NOT AN EXIT.** A1's exit set does not carry a morphology census and this
 * lane did not mint one; the figures are published so the chair can rule on the band and the two
 * planted controls (a planted comb and a planted i.i.d. jitter, per the panel's own method).
 */
export function censusMorphology(partition) {
  const arr = partition.arrangement;
  const deg = new Array(arr.verts.length).fill(0);
  for (const e of arr.edges) {
    const h = arr.halfEdges[e.he];
    deg[h.origin]++;
    deg[arr.halfEdges[h.twin].origin]++;
  }
  let t3 = 0; let x4 = 0; let other = 0;
  for (let i = 0; i < deg.length; i++) {
    if (deg[i] === 3) t3++;
    else if (deg[i] === 4) x4++;
    else if (deg[i] > 4) other++;
  }
  // roundness (4·π·area / perimeter²) by distance band from the extent centre
  const cx = arr.verts.length ? arr.verts.reduce((s, v) => s + v.x, 0) / arr.verts.length / arr.quantumPerUnit : 0;
  const cy = arr.verts.length ? arr.verts.reduce((s, v) => s + v.y, 0) / arr.verts.length / arr.quantumPerUnit : 0;
  const inner = []; const outer = [];
  let maxR = 1e-6;
  const pieces = liveFaces(arr).filter((f) => f.cls === 'PLOT');
  const rOf = (f) => {
    const c = faceCentroid(arr, f.id);
    return Math.hypot(c[0] - cx, c[1] - cy);
  };
  for (const f of pieces) maxR = Math.max(maxR, rOf(f));
  for (const f of pieces) {
    const ring = faceRing(arr, f.id);
    let per = 0;
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i]; const b = ring[(i + 1) % ring.length];
      per += Math.hypot(b[0] - a[0], b[1] - a[1]);
    }
    const round = per > 0 ? (4 * Math.PI * faceArea(arr, f.id)) / (per * per) : 0;
    (rOf(f) < maxR / 2 ? inner : outer).push(round);
  }
  const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
  const total = t3 + x4 + other;
  return {
    junctions: { T: t3, X: x4, higher: other, tShare: total ? t3 / total : 0 },
    roundness: { inner: mean(inner), outer: mean(outer), gradient: mean(inner) - mean(outer) },
    pieces: pieces.length,
    status: 'REPORTED — A2.2 names these metrics; SPINE-1 mints no morphology EXIT (chair call)',
    reason: `junction mix T ${t3} / X ${x4} / higher ${other} (T share`
      + ` ${(total ? (t3 / total) * 100 : 0).toFixed(1)}%); roundness centre ${mean(inner).toFixed(3)}`
      + ` vs edge ${mean(outer).toFixed(3)}`,
  };
}

/** Does a face share an edge with any band face? */
function touchesBand(arr, fid) {
  let h = arr.faces[fid].he;
  const start = h;
  let guard = 0;
  do {
    const he = arr.halfEdges[h];
    const nb = arr.faces[arr.halfEdges[he.twin].face];
    if (nb && nb.cls === 'WALLBAND') return true;
    h = he.next;
    if (++guard > 100000) break;
  } while (h !== start);
  return false;
}

/** Even-odd point-in-ring in world units. */
function inRingWorld(ring, p) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; const [xj, yj] = ring[j];
    if ((yi > p[1]) !== (yj > p[1])
      && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Point-to-polyline distance — the water census's only geometry. */
function distToPolyline(x, y, line) {
  let best = Infinity;
  for (let i = 0; i + 1 < line.length; i++) {
    const [ax, ay] = line[i]; const [bx, by] = line[i + 1];
    const dx = bx - ax; const dy = by - ay;
    const L2 = dx * dx + dy * dy;
    let t = L2 > 0 ? ((x - ax) * dx + (y - ay) * dy) / L2 : 0;
    t = t < 0 ? 0 : (t > 1 ? 1 : t);
    const d = Math.hypot(x - (ax + dx * t), y - (ay + dy * t));
    if (d < best) best = d;
  }
  return best;
}

/**
 * ⭐ THE WHOLE EXIT SHEET, in one call — what an instrument prints and what a test asserts.
 */
export function censusPartition(partition, input = {}) {
  const invariants = censusInvariants(partition, input);
  const tangential = censusTangential(partition);
  const crossings = censusCrossings(partition);
  const reserved = censusReserved(partition);
  const totality = censusTotality(partition);
  const morphology = censusMorphology(partition);
  return {
    invariants,
    tangential,
    crossings,
    reserved,
    totality,
    morphology,
    ok: invariants.ok && tangential.ok && crossings.ok && reserved.ok && totality.ok,
    reason: `E1 ${invariants.ok ? 'green' : 'RED'} · E2 ${tangential.ok ? 'green' : 'RED'}`
      + ` · E3 ${crossings.ok ? 'green' : 'RED'} · reserved ${reserved.ok ? 'green' : 'RED'}`
      + ` · E9 ${totality.ok ? 'green' : 'RED'} (${totality.annotated}/${totality.owed})`,
  };
}
