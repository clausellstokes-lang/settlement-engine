/**
 * domain/townMap/arch/cathedralSection.js -- K-0b SPIKE: a full gothic NAVE-BAY section as ONE
 * deterministic 3D mesh, at high architectural fidelity (docs/THE_ARCHITECTURE_KERNEL_3D.md v2,
 * CORRECTION 3: "the DELIVERABLE IS A FULL 3D STRUCTURE, not a flat plate", "as much fidelity as
 * possible to the architecture and structure").
 *
 * The real gothic structural system, as true 3D geometry -- not simplified massing:
 *   - a NAVE WALL with genuine THICKNESS and reveal, PIERCED by real openings (you see through it);
 *   - a traceried two-light LANCET window modelled IN DEPTH -- the pointed archivolt (voussoir
 *     ring), a central mullion, two cusped sub-arches with trefoils, all standing proud of the wall;
 *   - a 7-fold ROSE window as a real circular opening: outer ring, a cusped SEPTFOIL, seven radial
 *     spoke-mullions (placed from the pinned non-constructible HEPTA_DIRS table -- the K-0 result);
 *   - the FLYING-BUTTRESS load path as true solids: a stepped PIER, a swept ARCED FLYER (a 3D bar,
 *     not a billboard), a weathering cap + a PINNACLE weighting the pier head, and the wall-spring
 *     corbel where the flyer lands (the vault-thrust reaction) -- one buttress each side of the bay;
 *   - string COURSES + a plinth + a band of ashlar-block relief (wall texture as real geometry);
 *   - a GABLE with rake coping crowning the bay.
 *
 * Every element is built from the mesh.js primitives, each of which is an individually CLOSED
 * solid, so the whole section has no boundary edges (watertight-ish gate) by construction.
 *
 * DETERMINISM + PURITY: {+, -, *, /} + Math.sqrt only (0 transcendental sites -- the arch/ scan +
 * the transcendental-math ratchet bind this file). All curves are cubic Beziers (cubicAt) or the
 * pinned tables; the rose reveal is faceted by exact circle CHORDS (sqrt, never trig). Pure
 * function of nothing -- buildCathedralSection() emits byte-identical geometry every call.
 *
 * @typedef {import('./mesh.js').Mesh} Mesh
 * @typedef {import('./mesh.js').V3} V3
 * @typedef {readonly [number, number]} UV
 */

import { cubicAt } from './geom.js';
import { SQRT2, SQRT3, KAPPA, ARC60_HANDLE, HEPTA_DIRS } from './rationalTables.js';
import {
  createMesh, addBox, addExtrudedConvex, addTube, addSpire, finalizeMesh,
} from './mesh.js';

const HALF_SQRT3 = SQRT3 / 2;

// ── LAYOUT (facade u = east 0..W, v = up; wall thickness along z) ─────────────────────────────
const W = 260;              // bay width
const Z_BACK = 0;           // wall inner face
const Z_FRONT = 40;         // wall outer face (thickness 40)
const Z_PROUD = 48;         // tracery / course front (protrudes 8 past the wall)
const WALL_TOP = 500;       // top of the rectangular wall (gable springs from here)
const GABLE_APEX = 590;     // gable ridge

const WIN_L = 55, WIN_R = 205;       // lancet opening jambs
const SILL = 40;                     // window sill
const V_SPRING = 210;                // enclosing-arch springline
const V_SPRING_LIGHT = 176;          // the two sub-lights' springline
const MULL_L = 126, MULL_R = 134;    // central mullion

const ROSE_CX = 130, ROSE_CY = 415, ROSE_R = 55;   // the rose

const ARCH_STEPS = 12;     // pointed-arch tessellation
const ROSE_BANDS = 20;     // rose-opening chord facets
const QCIRC = 5;           // steps per quarter for centerline circles

// ── FACADE CURVE HELPERS (pure; tessellate to point lists) ────────────────────────────────────

/** point on a cubic in the facade plane. @param {UV} p0 @param {UV} c1 @param {UV} c2 @param {UV} p3 @param {number} u @returns {UV} */
function cAt2(p0, c1, c2, p3, u) {
  const r = cubicAt([p0[0], p0[1], 0], [c1[0], c1[1], 0], [c2[0], c2[1], 0], [p3[0], p3[1], 0], u);
  return [r[0], r[1]];
}

/**
 * The LEFT half of an equilateral pointed arch over [uL,uR] springing at vS, as ascending-v
 * points from the left spring up to the apex (the right half is the mirror x = uL+uR - lp).
 * Constructible -- only SQRT3 / ARC60_HANDLE appear.
 * @param {number} uL @param {number} uR @param {number} vS @param {number} steps
 * @returns {{ left: UV[], apexV: number, uMid: number }}
 */
function pointedArchLeft(uL, uR, vS, steps) {
  const s = uR - uL, uMid = (uL + uR) / 2, apexV = vS + s * HALF_SQRT3, h = ARC60_HANDLE * s;
  /** @type {UV} */ const p0 = [uL, vS];
  /** @type {UV} */ const c1 = [uL, vS + h];
  /** @type {UV} */ const c2 = [uMid - h * HALF_SQRT3, apexV - h / 2];
  /** @type {UV} */ const p3 = [uMid, apexV];
  /** @type {UV[]} */ const left = [];
  for (let k = 0; k <= steps; k++) left.push(cAt2(p0, c1, c2, p3, k / steps));
  return { left, apexV, uMid };
}

/** the full enclosing-arch edge polyline (spring-L -> apex -> spring-R). @param {number} uL @param {number} uR @param {number} vS @param {number} steps @returns {UV[]} */
function archPolyline(uL, uR, vS, steps) {
  const { left } = pointedArchLeft(uL, uR, vS, steps);
  const mirror = uL + uR;
  /** @type {UV[]} */ const out = left.slice();
  for (let k = left.length - 2; k >= 0; k--) out.push([mirror - left[k][0], left[k][1]]);
  return out;
}

/** A full circle centerline as 4 KAPPA quarter-cubics tessellated (no trig). @param {number} cx @param {number} cy @param {number} r @param {number} q @returns {UV[]} */
function circlePoints(cx, cy, r, q) {
  const hk = KAPPA * r;
  /** @type {Array<[UV, UV, UV, UV]>} quarters as (p0,c1,c2,p3) */
  const quarters = [
    [[cx + r, cy], [cx + r, cy + hk], [cx + hk, cy + r], [cx, cy + r]],
    [[cx, cy + r], [cx - hk, cy + r], [cx - r, cy + hk], [cx - r, cy]],
    [[cx - r, cy], [cx - r, cy - hk], [cx - hk, cy - r], [cx, cy - r]],
    [[cx, cy - r], [cx + hk, cy - r], [cx + r, cy - hk], [cx + r, cy]],
  ];
  /** @type {UV[]} */ const pts = [];
  for (const [p0, c1, c2, p3] of quarters) {
    for (let k = 0; k < q; k++) pts.push(cAt2(p0, c1, c2, p3, k / q));
  }
  return pts;
}

/** the rose septfoil cusp directions (pinned, NON-constructible -- the K-0 result). @type {UV[]} */
const HEPTA_UNIT = HEPTA_DIRS.map((d) => /** @type {UV} */ ([d[0] / 10000, d[1] / 10000]));
/** a quatrefoil's cusp directions (the diagonals -- CONSTRUCTIBLE, sqrt2/2). @type {UV[]} */
const QUAD_UNIT = [
  [SQRT2 / 2, SQRT2 / 2], [-SQRT2 / 2, SQRT2 / 2], [-SQRT2 / 2, -SQRT2 / 2], [SQRT2 / 2, -SQRT2 / 2],
];

/**
 * An n-lobe cusped FOIL centerline: cusps sit at `dirs` (unit directions) on the cusp circle, one
 * cubic lobe bulging outward between each consecutive pair. Rose = HEPTA_UNIT (pinned,
 * non-constructible); tympanum = QUAD_UNIT (constructible). No trig -- the lobe bisector is
 * normalized with sqrt.
 * @param {number} cx @param {number} cy @param {number} rCusp @param {number} rLobe @param {ReadonlyArray<UV>} dirs @returns {UV[]}
 */
function foilPoints(cx, cy, rCusp, rLobe, dirs) {
  const n = dirs.length;
  /** @param {number} k @returns {UV} */
  const cusp = (k) => { const d = dirs[((k % n) + n) % n]; return [cx + rCusp * d[0], cy + rCusp * d[1]]; };
  /** @param {number} k @returns {UV} */
  const lobe = (k) => {
    const a = dirs[((k % n) + n) % n], b = dirs[(((k + 1) % n) + n) % n];
    const mu = (a[0] + b[0]) / 2, mv = (a[1] + b[1]) / 2;
    const mm = Math.sqrt(mu * mu + mv * mv) || 1;
    return [cx + (rLobe * mu) / mm, cy + (rLobe * mv) / mm];
  };
  /** @type {UV[]} */ const pts = [];
  for (let k = 0; k < n; k++) {
    const a = cusp(k), b = cusp(k + 1), apex = lobe(k);
    /** @type {UV} */ const c1 = [a[0] + (apex[0] - a[0]) * 1.1, a[1] + (apex[1] - a[1]) * 1.1];
    /** @type {UV} */ const c2 = [b[0] + (apex[0] - b[0]) * 1.1, b[1] + (apex[1] - b[1]) * 1.1];
    for (let t = 0; t < 4; t++) pts.push(cAt2(a, c1, c2, b, t / 4));
  }
  return pts;
}

// ── ELEMENT BUILDERS ──────────────────────────────────────────────────────────────────────────

/** lift a facade polyline to z. @param {ReadonlyArray<UV>} poly @param {number} z @returns {V3[]} */
function atZ(poly, z) {
  return poly.map((p) => /** @type {V3} */ ([p[0], p[1], z]));
}

/**
 * The PIERCED WALL SLAB: solid band-prisms tiling [0,W] x [0,WALL_TOP] minus the lancet and rose
 * openings, from Z_BACK to Z_FRONT. Each prism is closed; the openings are real gaps whose slanted
 * inner faces are the reveals.
 * @param {Mesh} m @returns {void}
 */
function buildWall(m) {
  const arch = pointedArchLeft(WIN_L, WIN_R, V_SPRING, ARCH_STEPS);
  const mirror = WIN_L + WIN_R;
  /** left/right solid columns for a band [vA,vB] with opening edges lpA..lpB (left) / rp..(right). */
  /** @param {number} vA @param {number} vB @param {number} lpA @param {number} lpB @param {number} rpA @param {number} rpB */
  const columns = (vA, vB, lpA, lpB, rpA, rpB) => {
    addExtrudedConvex(m, [[0, vA], [lpA, vA], [lpB, vB], [0, vB]], Z_BACK, Z_FRONT);
    addExtrudedConvex(m, [[rpA, vA], [W, vA], [W, vB], [rpB, vB]], Z_BACK, Z_FRONT);
  };
  /** a full-width solid band [vA,vB]. @param {number} vA @param {number} vB */
  const fullBand = (vA, vB) => addExtrudedConvex(m, [[0, vA], [W, vA], [W, vB], [0, vB]], Z_BACK, Z_FRONT);

  // plinth (below the sill)
  fullBand(0, SILL);
  // lancet: rectangular jamb band, then the arch bands
  columns(SILL, V_SPRING, WIN_L, WIN_L, WIN_R, WIN_R);
  for (let i = 0; i < arch.left.length - 1; i++) {
    const a = arch.left[i], b = arch.left[i + 1];
    columns(a[1], b[1], a[0], b[0], mirror - a[0], mirror - b[0]);
  }
  // band between lancet apex and rose bottom
  const roseBot = ROSE_CY - ROSE_R, roseTop = ROSE_CY + ROSE_R;
  fullBand(arch.apexV, roseBot);
  // rose: chord facets (lp = cx - sqrt(R^2 - dy^2))
  for (let i = 0; i < ROSE_BANDS; i++) {
    const vA = roseBot + (2 * ROSE_R * i) / ROSE_BANDS;
    const vB = roseBot + (2 * ROSE_R * (i + 1)) / ROSE_BANDS;
    const dA = vA - ROSE_CY, dB = vB - ROSE_CY;
    const hA = Math.sqrt(Math.max(0, ROSE_R * ROSE_R - dA * dA));
    const hB = Math.sqrt(Math.max(0, ROSE_R * ROSE_R - dB * dB));
    columns(vA, vB, ROSE_CX - hA, ROSE_CX - hB, ROSE_CX + hA, ROSE_CX + hB);
  }
  // wall above the rose, up to the springing of the gable
  fullBand(roseTop, WALL_TOP);
}

/** The GABLE (a thick triangular prism) + rake coping tubes crowning the bay. @param {Mesh} m @returns {void} */
function buildGable(m) {
  addExtrudedConvex(m, [[0, WALL_TOP], [W, WALL_TOP], [W / 2, GABLE_APEX]], Z_BACK, Z_FRONT);
  const apex = /** @type {V3} */ ([W / 2, GABLE_APEX + 6, Z_PROUD - 4]);
  addTube(m, [[0, WALL_TOP, Z_PROUD - 4], apex], 8, 6, [0, 0, 1]);
  addTube(m, [apex, [W, WALL_TOP, Z_PROUD - 4]], 8, 6, [0, 0, 1]);
}

/** The lancet TRACERY: archivolt, mullion, two cusped sub-arches, trefoils -- all proud of the wall. @param {Mesh} m @returns {void} */
function buildLancetTracery(m) {
  const wallN = /** @type {V3} */ ([0, 0, 1]);
  // the enclosing archivolt (voussoir ring), following the opening edge
  addTube(m, atZ(archPolyline(WIN_L, WIN_R, V_SPRING, ARCH_STEPS), Z_FRONT + 2), 7, 8, wallN);
  // jamb shafts up to the springline
  addBox(m, WIN_L - 3, WIN_L + 3, SILL, V_SPRING, Z_FRONT - 2, Z_PROUD);
  addBox(m, WIN_R - 3, WIN_R + 3, SILL, V_SPRING, Z_FRONT - 2, Z_PROUD);
  // central mullion
  addBox(m, MULL_L, MULL_R, SILL, V_SPRING_LIGHT + 10, Z_FRONT - 6, Z_PROUD);
  // two sub-lights: pointed head bars + trefoil cusps
  for (const [uL, uR] of /** @type {Array<[number, number]>} */ ([[WIN_L, MULL_L], [MULL_R, WIN_R]])) {
    addTube(m, atZ(archPolyline(uL, uR, V_SPRING_LIGHT, ARCH_STEPS), Z_FRONT + 1), 5, 6, wallN);
    const cu = (uL + uR) / 2, span = uR - uL;
    const cr = span * 0.16;
    addTube(m, atZ(circlePoints(cu, V_SPRING_LIGHT + span * 0.42, cr, QCIRC), Z_FRONT + 1), 3, 4, wallN);
    addTube(m, atZ(circlePoints(cu - span * 0.28, V_SPRING_LIGHT + span * 0.16, cr, QCIRC), Z_FRONT + 1), 3, 4, wallN);
    addTube(m, atZ(circlePoints(cu + span * 0.28, V_SPRING_LIGHT + span * 0.16, cr, QCIRC), Z_FRONT + 1), 3, 4, wallN);
  }
  // TYMPANUM OCULUS -- a foiled circle filling the head above the two lights (bar-tracery idiom):
  // an outer ring + a CONSTRUCTIBLE quatrefoil (contrast to the rose's non-constructible septfoil).
  const tcx = (WIN_L + WIN_R) / 2, tcy = 293, tr = 26;
  addTube(m, atZ(circlePoints(tcx, tcy, tr, QCIRC), Z_FRONT + 1), 4, 6, wallN);
  addTube(m, atZ(foilPoints(tcx, tcy, tr - 9, tr - 3, QUAD_UNIT), Z_FRONT + 1), 2.5, 5, wallN);
}

/** The ROSE tracery: outer ring, septfoil, 7 radial spoke-mullions, central hub -- proud of the wall. @param {Mesh} m @returns {void} */
function buildRoseTracery(m) {
  const wallN = /** @type {V3} */ ([0, 0, 1]);
  addTube(m, atZ(circlePoints(ROSE_CX, ROSE_CY, ROSE_R, 6), Z_FRONT + 2), 6, 8, wallN);
  addTube(m, atZ(foilPoints(ROSE_CX, ROSE_CY, ROSE_R - 20, ROSE_R - 8, HEPTA_UNIT), Z_FRONT + 1), 3, 5, wallN);
  const rHub = 8, rSpoke = ROSE_R - 5;
  for (let k = 0; k < 7; k++) {
    const d = HEPTA_DIRS[k];
    const ux = d[0] / 10000, uy = d[1] / 10000;
    /** @type {V3} */ const a = [ROSE_CX + rHub * ux, ROSE_CY + rHub * uy, Z_FRONT + 1];
    /** @type {V3} */ const b = [ROSE_CX + rSpoke * ux, ROSE_CY + rSpoke * uy, Z_FRONT + 1];
    addTube(m, [a, b], 2.5, 5, wallN);
  }
  addTube(m, atZ(circlePoints(ROSE_CX, ROSE_CY, rHub + 2, QCIRC), Z_FRONT + 1), 3, 6, wallN);
}

/**
 * ONE flying buttress (stepped pier + weathering cap + pinnacle + arced flyer + wall-spring
 * corbel) standing forward of the wall, mirrored by `sign`. The flyer is a swept 3D solid.
 * @param {Mesh} m @param {number} pierCX @param {number} landX @param {number} sign @returns {void}
 */
function buildButtress(m, pierCX, landX, sign) {
  const z0 = Z_FRONT + 60, z1 = Z_FRONT + 150;       // pier footprint (forward of the wall)
  const zc = (z0 + z1) / 2;
  // three diminishing stages
  addBox(m, pierCX - 34, pierCX + 34, 0, 150, z0, z1);
  addBox(m, pierCX - 27, pierCX + 27, 150, 300, z0 + 6, z1 - 6);
  addBox(m, pierCX - 21, pierCX + 21, 300, 372, z0 + 12, z1 - 12);
  // weathering cap + pinnacle
  addSpire(m, pierCX, zc, 24, 372, 400);
  addSpire(m, pierCX, zc, 11, 398, 470);
  // the ARCED FLYER: a swept bar from the pier head (inner-top) up-over-down to the wall spring
  const startX = pierCX + sign * 18, startY = 372, startZ = zc;
  const endY = 360;
  /** @type {V3} */ const p0 = [startX, startY, startZ];
  /** @type {V3} */ const c1 = [startX + sign * 6, startY + 64, startZ - 6];
  /** @type {V3} */ const c2 = [landX - sign * 30, endY + 42, (startZ + Z_FRONT) / 2];
  /** @type {V3} */ const p3 = [landX, endY, Z_FRONT + 4];
  /** @type {V3[]} */ const flyer = [];
  for (let k = 0; k <= 16; k++) flyer.push(/** @type {V3} */ (cubicAt(p0, c1, c2, p3, k / 16)));
  addTube(m, flyer, 8, 14, [1, 0, 0]);
  // the wall-spring corbel (the vault-thrust reaction block)
  addBox(m, landX - 12, landX + 12, endY - 16, endY + 12, Z_FRONT - 2, Z_FRONT + 18);
}

/** String COURSES, base plinth cap, and a band of ashlar-block relief (wall texture as geometry). @param {Mesh} m @returns {void} */
function buildCourses(m) {
  addBox(m, -4, W + 4, 0, 14, Z_BACK, Z_PROUD + 4);          // base plinth
  addBox(m, -2, W + 2, SILL - 4, SILL + 4, Z_FRONT - 2, Z_PROUD + 2);   // sill course
  addBox(m, -2, W + 2, 344, 354, Z_FRONT - 2, Z_PROUD + 2);            // impost course under the rose
  // a course of ashlar-block relief along the impost band
  const n = 13, y0 = 356, y1 = 372;
  for (let i = 0; i < n; i++) {
    const x0 = 6 + (i * (W - 12)) / n + 2, x1 = 6 + ((i + 1) * (W - 12)) / n - 2;
    addBox(m, x0, x1, y0, y1, Z_FRONT - 1, Z_FRONT + ((i % 2) ? 4 : 7));
  }
}

/**
 * Build the whole gothic nave-bay section as one finalized mesh + a fidelity manifest (which
 * structural elements are present in true 3D, for the exhibit + the report).
 * @returns {ReturnType<typeof finalizeMesh> & { elements: string[] }}
 */
export function buildCathedralSection() {
  const m = createMesh();
  buildWall(m);
  buildGable(m);
  buildCourses(m);
  buildLancetTracery(m);
  buildRoseTracery(m);
  // one buttress each side of the bay (mirrored)
  buildButtress(m, 20, WIN_L - 6, 1);
  buildButtress(m, W - 20, WIN_R + 6, -1);
  const geo = finalizeMesh(m);
  return {
    ...geo,
    elements: [
      'pierced nave wall (thickness + reveals)',
      'two-light lancet opening',
      'pointed archivolt (voussoir ring)',
      'central mullion + jamb shafts',
      'two cusped sub-arches + 6 trefoils',
      'tympanum oculus + quatrefoil (constructible)',
      'rose opening (real circular pierce)',
      'rose outer ring + septfoil (7-fold, pinned table)',
      'seven radial spoke-mullions + hub',
      'gable + rake coping',
      'plinth + sill course + impost course',
      'ashlar-block relief band',
      'two stepped piers (3 stages each)',
      'two weathering caps + two pinnacles',
      'two arced flyers (swept 3D solids)',
      'two wall-spring corbels',
    ],
  };
}
