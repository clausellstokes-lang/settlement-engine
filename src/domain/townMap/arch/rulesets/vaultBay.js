/**
 * domain/townMap/arch/rulesets/vaultBay.js -- K-3 ORNAMENT: MILESTONE 1b -- ONE RIBBED VAULT BAY.
 *
 * A QUADRIPARTITE ribbed vault bay authored as a frozen grammar ruleset -- the second half of the
 * mandatory MILESTONE 1 (kernel doc K-3). A square bay springs from four corner responds; four pointed
 * BOUNDARY arches (two transverse, two wall/formeret) frame the edges and two DIAGONAL ribs cross at a
 * central BOSS. All ribs reach a COMMON crown (verticalArch3D takes a target apex, so ribs of unequal
 * span meet at the boss). Each rib is a moulding profile swept along a cubic-bezier centerline -- a
 * TRUE 3D rib skeleton, watertight (every member is an individually closed tube / box).
 *
 * LOD LADDER -- one per-tier ASSEMBLY, coarse geometry at distance (the four boundary arches reach the
 * SAME bay corners + crown at every tier, so the footprint + ridge AABB AGREE; pops change detail +
 * rib tessellation, never the silhouette):
 *   glyph(0)     -- the four boundary arches (coarse).
 *   commons(1)   -- boundary arches (medium) + the two diagonal ribs + the crown boss.
 *   signature(2) -- boundary arches (fine) + diagonals (fine) + boss + ridge ribs + four springer corbels.
 *
 * DEFERRED (documented, not a bug): the doubly-curved WEB SEVERIES are omitted -- a lofted closed-shell
 * builder is beyond the K-1 closed-primitive terminal set (box/spire/prism/sweep/extrudeConvex), and
 * the rib SKELETON is the "ribbed vault" signature the milestone measures. Web infill is a K-3-depth /
 * K-2 follow-on once a lofted-shell terminal is authored.
 *
 * PURITY: {+,-,*,/} + Math.sqrt via the algebra; 0 transcendental sites; deterministic.
 *
 * @typedef {import('../grammarIR.js').Scope} Scope
 * @typedef {readonly [number, number]} UV
 * @typedef {readonly [number, number, number]} V3
 */

import { verticalArch3D } from '../ornament/construct.js';

/** an axis-aligned world box as an identity-frame scope. @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z0 @param {number} z1 @returns {Scope} */
function boxScope(x0, x1, y0, y1, z0, z1) {
  return { origin: [x0, y0, z0], frameRef: { frameIndex: 0, reflect: 0 }, size: [x1 - x0, y1 - y0, z1 - z0] };
}

/** a rib sweep op along a vertical arch between two ground points. @param {UV} a @param {UV} b @param {number} springY @param {number} crownY @param {number} steps @param {string} profile @param {string} role @param {number} hw @param {number} hh @returns {object} */
function ribSweep(a, b, springY, crownY, steps, profile, role, hw, hh) {
  return { op: 'sweep', profile, role, path: verticalArch3D(a, b, springY, crownY, steps), halfW: hw, halfH: hh, refUp: [0, 1, 0] };
}

/**
 * Build a ribbed-vault-bay ruleset. Parameterized so the exhibit can vary bay size; vaultBayRuleset()
 * pins the milestone defaults. @param {{ side?: number, crown?: number, springY?: number }} [p] @returns {object}
 */
export function buildVaultRuleset(p) {
  const S = (p && p.side) || 200;
  const CROWN = (p && p.crown) || 150;
  const SP = (p && p.springY) || 0;
  const bossHalf = 9;
  /** @type {UV} */ const c00 = [0, 0];
  /** @type {UV} */ const c10 = [S, 0];
  /** @type {UV} */ const c11 = [S, S];
  /** @type {UV} */ const c01 = [0, S];
  /** @type {UV} */ const mF = [S / 2, 0];
  /** @type {UV} */ const mB = [S / 2, S];
  /** @type {UV} */ const mL = [0, S / 2];
  /** @type {UV} */ const mR = [S, S / 2];

  /** the four boundary arches at a given rib tessellation + profile. @param {number} st @param {string} prof @returns {Array<object>} */
  const boundary = (st, prof) => [
    ribSweep(c00, c10, SP, CROWN, st, prof, 'voussoir', 5, 7),      // transverse front
    ribSweep(c01, c11, SP, CROWN, st, prof, 'voussoir', 5, 7),      // transverse back
    ribSweep(c00, c01, SP, CROWN, st, prof, 'buttressStone', 5, 7), // wall (formeret) left
    ribSweep(c10, c11, SP, CROWN, st, prof, 'buttressStone', 5, 7), // wall (formeret) right
  ];
  /** the two diagonal ribs crossing at the boss. @param {number} st @returns {Array<object>} */
  const diagonals = (st) => [
    ribSweep(c00, c11, SP, CROWN, st, 'roll', 'tracery', 5.5, 8),
    ribSweep(c10, c01, SP, CROWN, st, 'roll', 'tracery', 5.5, 8),
  ];
  const bossOp = { op: 'emit', kind: 'box', role: 'relief', box: [S / 2 - bossHalf, S / 2 + bossHalf, CROWN - bossHalf, CROWN + bossHalf * 0.6, S / 2 - bossHalf, S / 2 + bossHalf] };
  const ridges = [
    ribSweep(mF, mB, CROWN - 10, CROWN, 6, 'roll', 'mullion', 3.5, 5),
    ribSweep(mL, mR, CROWN - 10, CROWN, 6, 'roll', 'mullion', 3.5, 5),
  ];
  /** @param {UV} c @returns {object} */
  const springer = (c) => {
    const dx = c[0] === 0 ? 0 : -14, dz = c[1] === 0 ? 0 : -14;
    const b = boxScope(c[0] + dx, c[0] + dx + 14, SP, SP + 20, c[1] + dz, c[1] + dz + 14);
    return { op: 'emit', kind: 'box', role: 'corbel', box: [b.origin[0], b.origin[0] + b.size[0], b.origin[1], b.origin[1] + b.size[1], b.origin[2], b.origin[2] + b.size[2]] };
  };

  return Object.freeze({
    name: 'vault-bay',
    symbols: ['vault', 'glyphAsm', 'commonsAsm', 'sigAsm'],
    axiom: {
      sym: 'vault',
      scope: boxScope(0, S, SP, CROWN + 4, 0, S),
      attrs: { materialRole: 'tracery', params: {} },
    },
    rules: {
      vault: [{ op: 'defer', byTier: { 0: [{ sym: 'glyphAsm' }], 1: [{ sym: 'commonsAsm' }], 2: [{ sym: 'sigAsm' }], default: [{ sym: 'glyphAsm' }] } }],
      glyphAsm: boundary(2, 'square'),
      commonsAsm: [...boundary(5, 'roll'), ...diagonals(6), bossOp],
      sigAsm: [...boundary(9, 'roll'), ...diagonals(12), bossOp, ...ridges, springer(c00), springer(c10), springer(c11), springer(c01)],
    },
  });
}

/** the frozen milestone vault bay (deterministic; the exemplar the goldens + budget pin). @returns {object} */
export function vaultBayRuleset() { return buildVaultRuleset(); }
