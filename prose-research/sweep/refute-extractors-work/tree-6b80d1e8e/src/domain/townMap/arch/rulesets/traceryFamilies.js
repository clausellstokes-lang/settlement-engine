/**
 * domain/townMap/arch/rulesets/traceryFamilies.js -- K-3 ORNAMENT: THE FOUR-FAMILY TRACERY SAMPLER.
 *
 * A frozen grammar ruleset that emits the four tracery families (plate, geometric/rayonnant,
 * curvilinear/flamboyant, perpendicular/rectilinear) as four windows side by side -- the exhibit plate
 * that proves the doc's claim: the four families are ONE construction algebra (ornament/tracery.js),
 * differing only in which primitives compose the head. Every bar is a swept moulding profile (true 3D
 * depth), so the assembly is watertight.
 *
 * LOD LADDER -- per-tier assembly; every panel's enclosing head + jambs are present at EVERY tier, so
 * the four-panel footprint agrees across tiers (detail + head tessellation change, silhouette does not).
 *
 * PURITY: {+,-,*,/} + Math.sqrt via the algebra; 0 transcendental sites; deterministic.
 *
 * @typedef {import('../grammarIR.js').Scope} Scope
 */

import { TRACERY_FAMILIES, traceryPanelOps } from '../ornament/tracery.js';

/** an axis-aligned world box as an identity-frame scope. @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z0 @param {number} z1 @returns {Scope} */
function boxScope(x0, x1, y0, y1, z0, z1) {
  return { origin: [x0, y0, z0], frameRef: { frameIndex: 0, reflect: 0 }, size: [x1 - x0, y1 - y0, z1 - z0] };
}

const PANEL_W = 120, PANEL_H = 240, GAP = 24, Z = 10, Y0 = 0;

/** the four panels' ops at a tier. @param {number} tier @returns {Array<object>} */
function panels(tier) {
  const ops = [];
  for (let i = 0; i < TRACERY_FAMILIES.length; i++) {
    const x0 = i * (PANEL_W + GAP);
    for (const op of traceryPanelOps(TRACERY_FAMILIES[i], x0, x0 + PANEL_W, Y0, Y0 + PANEL_H, Z, tier)) ops.push(op);
  }
  return ops;
}

/** build the tracery-families sampler ruleset. @returns {object} */
export function buildTraceryFamiliesRuleset() {
  const totalW = TRACERY_FAMILIES.length * (PANEL_W + GAP) - GAP;
  return Object.freeze({
    name: 'tracery-families',
    symbols: ['sampler', 'glyphAsm', 'commonsAsm', 'sigAsm'],
    axiom: { sym: 'sampler', scope: boxScope(0, totalW, Y0, Y0 + PANEL_H + 20, Z - 8, Z + 8), attrs: { materialRole: 'tracery', params: {} } },
    rules: {
      sampler: [{ op: 'defer', byTier: { 0: [{ sym: 'glyphAsm' }], 1: [{ sym: 'commonsAsm' }], 2: [{ sym: 'sigAsm' }], default: [{ sym: 'glyphAsm' }] } }],
      glyphAsm: panels(0),
      commonsAsm: panels(1),
      sigAsm: panels(2),
    },
  });
}

/** the frozen sampler (deterministic; the exemplar the goldens + budget pin). @returns {object} */
export function traceryFamiliesRuleset() { return buildTraceryFamiliesRuleset(); }
