/**
 * domain/townMap/arch/rulesets/roseWindow.js -- K-3 ORNAMENT: MILESTONE 1a -- ONE FULL ROSE WINDOW.
 *
 * A rayonnant rose wheel authored as a frozen grammar ruleset over the K-3 construction algebra
 * (ornament/construct.js) + the K-1 profile-sweep / extruded-convex terminals. It is the first half of
 * the mandatory MILESTONE 1 (kernel doc K-3): a full rose + a ribbed vault bay, RE-MEASURED before any
 * budget is legislated (the doc's 550-op cathedral is EXTRAPOLATED -- verify before you pin).
 *
 * The wheel is TRUE 3D depth: the outer torus ring, the radial spoke-mullions, and the foil rings are
 * moulding profiles swept along CUBIC-BEZIER centerlines (never billboards); the leaded glass is a
 * thin wall-facing disc (extruded convex). Every member is an individually CLOSED primitive, so the
 * assembly is watertight (boundary-edge 0). The n-foil counts run the pinned N_GON_DIRS registry to 16
 * spokes -- including the non-constructible 9-foil, which cannot be derived without trig.
 *
 * LOD LADDER -- one per-tier ASSEMBLY, coarse geometry at distance (the outer ring + disc reach the
 * SAME outer radius at every tier, so the footprint + ridge AABB AGREE; pops change detail + tessell-
 * ation, never the silhouette):
 *   glyph(0)     -- the outer ring (coarse) + the glass disc.
 *   commons(1)   -- the outer ring (medium) + spokes + the primary foil ring.
 *   signature(2) -- the outer ring (fine) + spokes + primary + secondary foil rings + cusp sub-lights.
 *
 * PURITY: {+,-,*,/} + Math.sqrt via the algebra; 0 transcendental sites; deterministic.
 *
 * @typedef {import('../grammarIR.js').Scope} Scope
 * @typedef {readonly [number, number]} UV
 * @typedef {readonly [number, number, number]} V3
 */

import { circlePoints, nFoilRing, foilCusps, atZ } from '../ornament/construct.js';
import { ngonUnitDirs } from '../rationalTables.js';

const WALL_N = /** @type {V3} */ ([0, 0, 1]);

/** an axis-aligned world box as an identity-frame scope. @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z0 @param {number} z1 @returns {Scope} */
function boxScope(x0, x1, y0, y1, z0, z1) {
  return { origin: [x0, y0, z0], frameRef: { frameIndex: 0, reflect: 0 }, size: [x1 - x0, y1 - y0, z1 - z0] };
}

/** a convex circle ring in the (x,y) facade plane (an n-gon disc outline for the extruded glass). @param {number} cx @param {number} cy @param {number} r @param {number} n @returns {UV[]} */
function discRing(cx, cy, r, n) {
  return ngonUnitDirs(n).map((d) => /** @type {UV} */ ([cx + r * d[0], cy + r * d[1]]));
}

/** a torus-ring sweep op along a tessellated circle at radius r, depth z. @param {number} cx @param {number} cy @param {number} r @param {number} q @param {number} z @param {number} hw @param {number} hh @returns {object} */
function ringSweep(cx, cy, r, q, z, hw, hh) {
  return { op: 'sweep', profile: 'roll', role: 'tracery', path: atZ(circlePoints(cx, cy, r, q), z), halfW: hw, halfH: hh, refUp: WALL_N };
}

/** the radial spoke-mullion sweep ops (hub -> rim on the pinned n ring). @param {number} cx @param {number} cy @param {number} rHub @param {number} rRim @param {number} n @param {number} z @returns {Array<object>} */
function spokeSweeps(cx, cy, rHub, rRim, n, z) {
  const dirs = ngonUnitDirs(n); const ops = [];
  for (const d of dirs) {
    /** @type {V3} */ const a = [cx + rHub * d[0], cy + rHub * d[1], z];
    /** @type {V3} */ const b = [cx + rRim * d[0], cy + rRim * d[1], z];
    ops.push({ op: 'sweep', profile: 'fillet', role: 'mullion', path: [a, b], halfW: 2.4, halfH: 5, refUp: WALL_N });
  }
  return ops;
}

/** the sub-light cusp foils: a small trefoil centered at each primary cusp landing (signature only). @param {number} cx @param {number} cy @param {number} rCusp @param {number} n @param {number} z @param {number} rSub @returns {Array<object>} */
function cuspFoils(cx, cy, rCusp, n, z, rSub) {
  const cusps = foilCusps(cx, cy, rCusp, n); const ops = [];
  for (const c of cusps) {
    const ring = atZ(nFoilRing(c[0], c[1], rSub * 0.55, rSub, 3, 1.15), z);
    ops.push({ op: 'sweep', profile: 'square', role: 'tracery', path: ring, halfW: 1.6, halfH: 3, refUp: WALL_N });
  }
  return ops;
}

/**
 * Build a rose-window ruleset. Parameterized so the exhibit + follow-ons can reuse the wheel with
 * different foil counts; roseWindowRuleset() below pins the milestone defaults (deterministic).
 * @param {{ diameter?: number, foilCount?: number, subFoilCount?: number, z0?: number, ringDepth?: number }} [p]
 * @returns {object}
 */
export function buildRoseRuleset(p) {
  const D = (p && p.diameter) || 220;
  const N = (p && p.foilCount) || 12;
  const SUBN = (p && p.subFoilCount) || 16;
  const Z0 = (p && p.z0) || 0;
  const ringDepth = (p && p.ringDepth) || 14;
  const cx = D / 2, cy = D / 2, R = D / 2 - 6;
  const zRing = Z0 + ringDepth;
  const zGlassBack = Z0, zGlassFront = Z0 + 4;

  const glassDisc = discRing(cx, cy, R - 8, 16);
  const glassOp = { op: 'emit', kind: 'extrudeConvex', role: 'glassLead', ring: glassDisc, z0: zGlassBack, z1: zGlassFront };
  const foilPrimary = { op: 'sweep', profile: 'square', role: 'tracery', path: atZ(nFoilRing(cx, cy, R * 0.62, R * 0.82, N, 1.12), zRing - 2), halfW: 3, halfH: 5, refUp: WALL_N };
  const foilSecondary = { op: 'sweep', profile: 'square', role: 'tracery', path: atZ(nFoilRing(cx, cy, R * 0.30, R * 0.50, SUBN, 1.10), zRing - 2), halfW: 2.4, halfH: 4, refUp: WALL_N };
  const innerRing = ringSweep(cx, cy, R * 0.60, 6, zRing, 4.5, 6);
  const spokes = spokeSweeps(cx, cy, R * 0.30, R - 4, N, zRing - 1);
  const cusps = cuspFoils(cx, cy, R * 0.82, N, zRing - 2, 10);

  return Object.freeze({
    name: 'rose-window',
    symbols: ['rose', 'glyphAsm', 'commonsAsm', 'sigAsm'],
    axiom: {
      sym: 'rose',
      scope: boxScope(0, D, 0, D, Z0, zRing + 4),
      attrs: { materialRole: 'tracery', params: {} },
    },
    rules: {
      rose: [{ op: 'defer', byTier: { 0: [{ sym: 'glyphAsm' }], 1: [{ sym: 'commonsAsm' }], 2: [{ sym: 'sigAsm' }], default: [{ sym: 'glyphAsm' }] } }],
      // coarse ring reaches the SAME outer radius R -> silhouette AABB agrees with the fine tiers
      glyphAsm: [glassOp, ringSweep(cx, cy, R, 2, zRing, 7, 8)],
      commonsAsm: [glassOp, ringSweep(cx, cy, R, 4, zRing, 7, 8), foilPrimary, ...spokes],
      sigAsm: [glassOp, ringSweep(cx, cy, R, 6, zRing, 7, 8), foilPrimary, foilSecondary, innerRing, ...spokes, ...cusps],
    },
  });
}

/** the frozen milestone rose (deterministic; the exemplar the goldens + budget pin). @returns {object} */
export function roseWindowRuleset() { return buildRoseRuleset(); }
