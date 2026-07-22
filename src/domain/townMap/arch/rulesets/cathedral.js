/**
 * domain/townMap/arch/rulesets/cathedral.js -- K-1 GRAMMAR: THE CATHEDRAL RULESET (3-tier exemplar).
 *
 * A gothic nave-front bay authored as a frozen grammar ruleset -- the "one cathedral emitted at all
 * three LOD tiers" deliverable. Unlike the byte-parity buttress (which reproduces a hand build), this
 * is the grammar's OWN artifact, pinned by its own double-build + SHA goldens at high fidelity. It
 * exercises the real vocabulary:
 *   - defer(tier)   -- ONE derivation prefix (the SHELL massing) is shared across all tiers; only the
 *                      ORNAMENT branch gates on tier (signature=full, commons=coarse, glyph=bare
 *                      massing). Footprint + ridge AGREE across tiers by construction.
 *   - split(repeat) -- the ashlar relief course (a tiled block band) -- the CGA core in the artifact.
 *   - prism         -- an octagonal stair-turret (curved massing on the pinned N_GON_DIRS).
 *   - sweep         -- the archivolt, rose ring + septfoil, spoke mullions (moulding profiles).
 *   - instance      -- pinnacles atop the two piers (a repeated kit asset).
 *   - occlude       -- a rose boss placed only where the frozen index reports solid wall behind it.
 *   - EVENT         -- the buttress-flyer springs each pier-subtree -> the clerestory-subtree (the
 *                      CGA++ two-phase cross-shape gate), at tier >= 1.
 *
 * Solids are emitted SCOPE-DERIVED (each child carries an explicit world sub-scope via defer); curve
 * terminals bake their world paths (pinned subdivision). PURITY: {+,-,*,/} + Math.sqrt; 0
 * transcendental sites; deterministic -- cathedralRuleset() is byte-identical every build.
 *
 * @typedef {import('../grammarIR.js').Shape} Shape
 * @typedef {import('../grammarIR.js').Scope} Scope
 * @typedef {ReadonlyArray<number>} UV
 * @typedef {readonly [number, number, number]} V3
 */

import { cubicAt } from '../geom.js';
import { SQRT3, KAPPA, ARC60_HANDLE, N_GON_DIRS } from '../rationalTables.js';
import { makeShape } from '../grammarIR.js';

const HALF_SQRT3 = SQRT3 / 2;

// ── LAYOUT (facade x = east 0..W, y = up, z = depth toward the viewer) ──────────────────────────
const W = 260;
const Z_BACK = 0, Z_FRONT = 40, Z_PROUD = 48;
const WALL_TOP = 500, GABLE_APEX = 590, IMPOST = 300;
const WIN_L = 55, WIN_R = 205, SILL = 40, V_SPRING = 210, V_SPRING_LIGHT = 176;
const MULL_L = 126, MULL_R = 134;
const ROSE_CX = 130, ROSE_CY = 415, ROSE_R = 55;
const PIER_Z0 = 100, PIER_Z1 = 190, PIER_TOP = 372, PIER_HW = 26;
const PIER_L = 30, PIER_R = W - 30;
const ARCH_STEPS = 10, QCIRC = 5;
const WALL_N = /** @type {V3} */ ([0, 0, 1]);

/** an axis-aligned world box as an identity-frame scope. @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z0 @param {number} z1 @returns {Scope} */
function boxScope(x0, x1, y0, y1, z0, z1) {
  return { origin: [x0, y0, z0], frameRef: { frameIndex: 0, reflect: 0 }, size: [x1 - x0, y1 - y0, z1 - z0] };
}

// ── PURE CURVE HELPERS (facade u,v then lifted to z) ───────────────────────────────────────────
/** @param {UV} p0 @param {UV} c1 @param {UV} c2 @param {UV} p3 @param {number} u @returns {UV} */
/** @param {UV} p0 @param {UV} c1 @param {UV} c2 @param {UV} p3 @param {number} u @returns {UV} */
function cAt2(p0, c1, c2, p3, u) {
  /** @param {UV} p @returns {[number,number,number]} */ const d3 = (p) => [p[0], p[1], 0];
  const r = cubicAt(d3(p0), d3(c1), d3(c2), d3(p3), u);
  return /** @type {UV} */ ([r[0], r[1]]);
}

/** the enclosing-arch polyline (spring-L -> apex -> spring-R). @param {number} uL @param {number} uR @param {number} vS @param {number} steps @returns {UV[]} */
function archPolyline(uL, uR, vS, steps) {
  const s = uR - uL, uMid = (uL + uR) / 2, apexV = vS + s * HALF_SQRT3, h = ARC60_HANDLE * s;
  /** @type {UV} */ const p0 = [uL, vS]; /** @type {UV} */ const c1 = [uL, vS + h];
  /** @type {UV} */ const c2 = [uMid - h * HALF_SQRT3, apexV - h / 2]; /** @type {UV} */ const p3 = [uMid, apexV];
  /** @type {UV[]} */ const left = [];
  for (let k = 0; k <= steps; k++) left.push(cAt2(p0, c1, c2, p3, k / steps));
  const mirror = uL + uR; /** @type {UV[]} */ const out = left.slice();
  for (let k = left.length - 2; k >= 0; k--) out.push([mirror - left[k][0], left[k][1]]);
  return out;
}

/** a circle centerline as 4 KAPPA quarter-cubics tessellated. @param {number} cx @param {number} cy @param {number} r @param {number} q @returns {UV[]} */
function circlePoints(cx, cy, r, q) {
  const hk = KAPPA * r;
  /** @type {Array<[UV, UV, UV, UV]>} */ const quarters = [
    [[cx + r, cy], [cx + r, cy + hk], [cx + hk, cy + r], [cx, cy + r]],
    [[cx, cy + r], [cx - hk, cy + r], [cx - r, cy + hk], [cx - r, cy]],
    [[cx - r, cy], [cx - r, cy - hk], [cx - hk, cy - r], [cx, cy - r]],
    [[cx, cy - r], [cx + hk, cy - r], [cx + r, cy - hk], [cx + r, cy]],
  ];
  /** @type {UV[]} */ const pts = [];
  for (const [p0, c1, c2, p3] of quarters) for (let k = 0; k < q; k++) pts.push(cAt2(p0, c1, c2, p3, k / q));
  return pts;
}

/** the septfoil foil centerline on the pinned HEPTA ring. @param {number} cx @param {number} cy @param {number} rCusp @param {number} rLobe @returns {UV[]} */
function septfoilPoints(cx, cy, rCusp, rLobe) {
  const dirs = N_GON_DIRS[7]; const n = dirs.length;
  /** @param {number} k @returns {UV} */ const cusp = (k) => { const d = dirs[((k % n) + n) % n]; return [cx + rCusp * d[0] / 10000, cy + rCusp * d[1] / 10000]; };
  /** @param {number} k @returns {UV} */ const lobe = (k) => {
    const a = dirs[((k % n) + n) % n], b = dirs[(((k + 1) % n) + n) % n];
    const mu = (a[0] + b[0]) / 2, mv = (a[1] + b[1]) / 2; const mm = Math.sqrt(mu * mu + mv * mv) || 1;
    return [cx + rLobe * (mu / mm) / 10000, cy + rLobe * (mv / mm) / 10000];
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

/** lift a facade polyline to a wall-plane z. @param {ReadonlyArray<UV>} poly @param {number} z @returns {V3[]} */
function atZ(poly, z) { return poly.map((p) => /** @type {V3} */ ([p[0], p[1], z])); }

/** the arced-flyer centerline from a pier top to a clerestory landing (17-pt cubic). @param {number} px @param {number} pz @param {number} pyTop @param {number} landX @param {number} landY @param {number} landZ @param {number} sign @returns {V3[]} */
function flyerCurve(px, pz, pyTop, landX, landY, landZ, sign) {
  /** @type {V3} */ const p0 = [px + sign * 4, pyTop, pz];
  /** @type {V3} */ const c1 = [px + sign * 8, pyTop + 60, pz - 8];
  /** @type {V3} */ const c2 = [landX - sign * 28, landY + 46, (pz + landZ) / 2];
  /** @type {V3} */ const p3 = [landX, landY, landZ];
  /** @type {V3[]} */ const pts = [];
  for (let k = 0; k <= 16; k++) pts.push(/** @type {V3} */ (cubicAt(p0, c1, c2, p3, k / 16)));
  return pts;
}

/** the 7 rose spoke-mullion sweep ops (hub -> rim on the pinned HEPTA ring). @returns {Array<object>} */
function spokeSweeps() {
  const dirs = N_GON_DIRS[7]; const ops = [];
  for (let k = 0; k < dirs.length; k++) {
    const ux = dirs[k][0] / 10000, uy = dirs[k][1] / 10000, rHub = 8, rRim = ROSE_R - 6;
    /** @type {V3} */ const a = [ROSE_CX + rHub * ux, ROSE_CY + rHub * uy, Z_FRONT + 1];
    /** @type {V3} */ const b = [ROSE_CX + rRim * ux, ROSE_CY + rRim * uy, Z_FRONT + 1];
    ops.push({ op: 'sweep', profile: 'square', role: 'mullion', path: [a, b], halfW: 2.5, halfH: 5, refUp: WALL_N });
  }
  return ops;
}

/**
 * Build the frozen cathedral ruleset. @returns {object}
 */
export function cathedralRuleset() {
  const archivolt = atZ(archPolyline(WIN_L, WIN_R, V_SPRING, ARCH_STEPS), Z_FRONT + 2);
  const lightL = atZ(archPolyline(WIN_L, MULL_L, V_SPRING_LIGHT, ARCH_STEPS), Z_FRONT + 1);
  const lightR = atZ(archPolyline(MULL_R, WIN_R, V_SPRING_LIGHT, ARCH_STEPS), Z_FRONT + 1);
  const roseRing = atZ(circlePoints(ROSE_CX, ROSE_CY, ROSE_R, QCIRC), Z_FRONT + 2);
  const roseFoil = atZ(septfoilPoints(ROSE_CX, ROSE_CY, ROSE_R - 20, ROSE_R - 8), Z_FRONT + 1);
  const tympanum = atZ(circlePoints((WIN_L + WIN_R) / 2, 293, 24, QCIRC), Z_FRONT + 1);
  /** @type {ReadonlyArray<UV>} */ const gableRing = [[0, WALL_TOP], [W, WALL_TOP], [W / 2, GABLE_APEX]];

  return Object.freeze({
    name: 'cathedral-bay',
    symbols: [
      'cathedral', 'shell', 'ornament', 'coarse',
      'wallPlinth', 'wallColL', 'wallColR', 'clerestory', 'gable', 'pier', 'turret',
      'reliefHost', 'reliefBlock', 'reliefBlockCore', 'skip',
      'archivolt', 'lightArches', 'mullion', 'roseRing', 'roseFoil', 'roseSpokes', 'roseBoss', 'boss', 'tympanum',
      'pinnacleSlot', 'flyerConn',
    ],
    axiom: {
      sym: 'cathedral',
      scope: boxScope(-6, 266, 0, GABLE_APEX, Z_BACK, PIER_Z1),
      attrs: { materialRole: 'ashlar', params: {} },
    },
    rules: {
      cathedral: [
        { op: 'defer', byTier: { default: [{ sym: 'shell' }] } },
        { op: 'defer', byTier: { 2: [{ sym: 'ornament' }], 1: [{ sym: 'coarse' }], 0: [] } },
      ],

      // ── SHELL massing (identical at every tier -> footprint + ridge agree) ──────────────────────
      shell: [{ op: 'defer', byTier: { default: [
        { sym: 'wallPlinth', scope: boxScope(0, W, 0, SILL, Z_BACK, Z_FRONT) },
        { sym: 'wallColL', scope: boxScope(0, WIN_L, SILL, WALL_TOP, Z_BACK, Z_FRONT) },
        { sym: 'wallColR', scope: boxScope(WIN_R, W, SILL, WALL_TOP, Z_BACK, Z_FRONT) },
        { sym: 'clerestory', scope: boxScope(WIN_L, WIN_R, IMPOST, WALL_TOP, Z_BACK, Z_FRONT) },
        { sym: 'gable' },
        { sym: 'pier', tag: 'L', scope: boxScope(PIER_L - PIER_HW, PIER_L + PIER_HW, 0, PIER_TOP, PIER_Z0, PIER_Z1) },
        { sym: 'pier', tag: 'R', scope: boxScope(PIER_R - PIER_HW, PIER_R + PIER_HW, 0, PIER_TOP, PIER_Z0, PIER_Z1) },
        { sym: 'turret' },
      ] } }],
      wallPlinth: [{ op: 'emit', kind: 'box', role: 'dressedStone' }],
      wallColL: [{ op: 'emit', kind: 'box', role: 'ashlar' }],
      wallColR: [{ op: 'emit', kind: 'box', role: 'ashlar' }],
      clerestory: [{ op: 'emit', kind: 'box', role: 'ashlar' }],
      gable: [{ op: 'emit', kind: 'extrudeConvex', role: 'dressedStone', ring: gableRing, z0: Z_BACK, z1: Z_FRONT }],
      pier: [{ op: 'emit', kind: 'box', role: 'buttressStone' }],
      turret: [{ op: 'prism', n: 8, role: 'buttressStone', cx: -6, cz: (PIER_Z0 + PIER_Z1) / 2, radius: 18, y0: 0, y1: 430 }],
      skip: [],

      // ── ORNAMENT (tier 2, signature) ───────────────────────────────────────────────────────────
      ornament: [{ op: 'defer', byTier: { default: [
        { sym: 'archivolt' }, { sym: 'lightArches' },
        { sym: 'mullion', scope: boxScope(MULL_L, MULL_R, SILL, V_SPRING_LIGHT + 10, Z_FRONT - 6, Z_PROUD) },
        { sym: 'roseRing' }, { sym: 'roseFoil' }, { sym: 'roseSpokes' }, { sym: 'tympanum' },
        { sym: 'roseBoss', scope: boxScope(ROSE_CX - 6, ROSE_CX + 6, ROSE_CY - 6, ROSE_CY + 6, Z_FRONT, Z_PROUD) },
        { sym: 'reliefHost', scope: boxScope(6, W - 6, 356, 372, Z_FRONT - 1, Z_FRONT + 5) },
        { sym: 'pinnacleSlot', tag: 'L', scope: pinnacleScope(PIER_L) },
        { sym: 'pinnacleSlot', tag: 'R', scope: pinnacleScope(PIER_R) },
      ] } }],
      archivolt: [{ op: 'sweep', profile: 'roll', role: 'voussoir', path: archivolt, halfW: 7, halfH: 8, refUp: WALL_N }],
      lightArches: [
        { op: 'sweep', profile: 'square', role: 'tracery', path: lightL, halfW: 4, halfH: 5, refUp: WALL_N },
        { op: 'sweep', profile: 'square', role: 'tracery', path: lightR, halfW: 4, halfH: 5, refUp: WALL_N },
      ],
      mullion: [{ op: 'emit', kind: 'box', role: 'mullion' }],
      roseRing: [{ op: 'sweep', profile: 'roll', role: 'tracery', path: roseRing, halfW: 6, halfH: 8, refUp: WALL_N }],
      roseFoil: [{ op: 'sweep', profile: 'square', role: 'tracery', path: roseFoil, halfW: 3, halfH: 5, refUp: WALL_N }],
      roseSpokes: [{ op: 'defer', byTier: { default: [] } }, ...spokeSweeps()],
      tympanum: [{ op: 'sweep', profile: 'roll', role: 'tracery', path: tympanum, halfW: 4, halfH: 6, refUp: WALL_N }],
      // a boss placed ONLY where the frozen index reports solid clerestory wall behind the rose center
      roseBoss: [{ op: 'occlude', at: [ROSE_CX, ROSE_CY, Z_BACK + 2], then: { sym: 'boss' } }],
      boss: [{ op: 'emit', kind: 'box', role: 'tracery' }],

      // relief course via split + repeat (the CGA core in the artifact)
      reliefHost: [{ op: 'split', axis: 'x', parts: [{ size: 18, sym: 'reliefBlock', repeat: 13 }, { size: '~', sym: 'skip' }] }],
      reliefBlock: [{ op: 'inset', sym: 'reliefBlockCore', role: 'relief', margins: { x: 1.5 } }],
      reliefBlockCore: [{ op: 'emit', kind: 'box', role: 'relief' }],

      // pinnacle kit asset at a pier top (instance)
      pinnacleSlot: [{ op: 'instance', asset: 'pinnacle', role: 'pinnacleStone' }],

      // ── COARSE (tier 1, commons) -- pinnacles only ─────────────────────────────────────────────
      coarse: [{ op: 'defer', byTier: { default: [
        { sym: 'pinnacleSlot', tag: 'L', scope: pinnacleScope(PIER_L) },
        { sym: 'pinnacleSlot', tag: 'R', scope: pinnacleScope(PIER_R) },
      ] } }],

      // the flyer connector (event-produced) sweeps its param path
      flyerConn: [{ op: 'sweep', profile: 'square', role: 'buttressStone', pathParam: 'flyPath', halfW: 8, halfH: 14, refUp: [1, 0, 0] }],
    },

    // ── CROSS-SHAPE EVENT: the buttress flyer springs pier -> clerestory (tier >= 1) ──────────────
    events: [{
      name: 'buttressFlyer',
      /** @param {{ bySym: (s: string) => ReadonlyArray<{ aabb: { min: V3, max: V3 } }> }} index @param {{ tier: number }} ctx @returns {Shape[]} */
      produces: (index, ctx) => {
        if (ctx.tier < 1) return [];
        const piers = index.bySym('pier'); const clers = index.bySym('clerestory');
        if (!piers.length || !clers.length) return [];
        /** @type {Shape[]} */ const out = [];
        for (const p of piers) {
          const px = (p.aabb.min[0] + p.aabb.max[0]) / 2, pz = (p.aabb.min[2] + p.aabb.max[2]) / 2, pyTop = p.aabb.max[1];
          const sign = px < W / 2 ? 1 : -1;
          const landX = px < W / 2 ? WIN_L - 6 : WIN_R + 6;
          const flyPath = flyerCurve(px, pz, pyTop, landX, 360, Z_FRONT + 4, sign);
          out.push(makeShape('flyerConn',
            { origin: [0, 0, 0], frameRef: { frameIndex: 0, reflect: 0 }, size: [1, 1, 1] },
            { materialRole: 'buttressStone', lodTier: ctx.tier, params: Object.freeze({ flyPath }) }, 'evt'));
        }
        return out;
      },
    }],
  });
}

/** the pinnacle placement box atop a pier. @param {number} cx @returns {Scope} */
function pinnacleScope(cx) { return boxScope(cx - 12, cx + 12, PIER_TOP, PIER_TOP + 96, (PIER_Z0 + PIER_Z1) / 2 - 12, (PIER_Z0 + PIER_Z1) / 2 + 12); }
