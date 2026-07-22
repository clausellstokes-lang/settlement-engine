/**
 * domain/townMap/arch/ornament/tracery.js -- K-3 ORNAMENT: the FOUR TRACERY FAMILIES as one algebra.
 *
 * The four historical tracery families are ONE parametric construction algebra over construct.js
 * (circles + lines + booleans under sqrt), differing only in which primitives compose the head:
 *   - plate         -- a heavy enclosing arch pierced by a few large FOIL openings (early plate).
 *   - geometric     -- (rayonnant) an arch + mullions carrying FOILED OCULI in a rational grid.
 *   - flamboyant     -- (curvilinear) OGEE arches + MOUCHETTE daggers (flame forms).
 *   - perpendicular -- (rectilinear) vertical mullions carried unbroken to the head + TRANSOMS.
 *
 * Each family builds a list of SWEEP ops (bar centerlines swept as moulding profiles -> true 3D depth)
 * over a facade panel [x0,x1] x [y0,y1] at wall depth z. A ruleset spreads the ops; the exhibit's
 * traceryFamilies sampler shows all four side by side. Every bar is a closed tube -> watertight.
 *
 * PURITY: {+,-,*,/} + Math.sqrt via the algebra; 0 transcendental sites; deterministic.
 *
 * @typedef {readonly [number, number]} UV
 * @typedef {readonly [number, number, number]} V3
 */

import { pointedArch, ogeeArch, circlePoints, nFoilRing, mouchette, atZ, line } from './construct.js';

const WALL_N = /** @type {V3} */ ([0, 0, 1]);

/** the four family ids (frozen; the sampler + the totality walk enumerate these). @type {ReadonlyArray<string>} */
export const TRACERY_FAMILIES = Object.freeze(['plate', 'geometric', 'flamboyant', 'perpendicular']);

/** a bar sweep op along a lifted facade polyline. @param {UV[]} poly @param {number} z @param {string} profile @param {string} role @param {number} hw @param {number} hh @returns {object} */
function bar(poly, z, profile, role, hw, hh) {
  return { op: 'sweep', profile, role, path: atZ(poly, z), halfW: hw, halfH: hh, refUp: WALL_N };
}

/**
 * Build the tracery-bar ops for one family panel at a LOD tier. `tier` gates detail (coarse enclosing
 * head at glyph; + mullions/head figures at commons; + full foliation at signature). All families
 * share the enclosing pointed head so the panel silhouette agrees across tiers.
 * @param {string} family @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z @param {number} tier @returns {Array<object>}
 */
export function traceryPanelOps(family, x0, x1, y0, y1, z, tier) {
  if (!TRACERY_FAMILIES.includes(family)) throw new Error(`arch/tracery: unknown family "${family}"`);
  const w = x1 - x0, vSpring = y0 + (y1 - y0) * 0.55, uMid = (x0 + x1) / 2;
  const headSteps = tier === 0 ? 2 : tier === 1 ? 5 : 8;
  const ops = [];

  // the enclosing head (pointed for 3 families, ogee for flamboyant) + jambs -- present at EVERY tier.
  // The head profile coarsens at glyph (square, 4 sides) so the distant tier clears the 300-tri ceiling;
  // the apex height is tessellation-independent, so the panel silhouette agrees across tiers.
  const head = family === 'flamboyant'
    ? ogeeArch(x0, x1, vSpring, (y1 - vSpring) * 0.12, headSteps)
    : pointedArch(x0, x1, vSpring, headSteps);
  ops.push(bar(head, z, tier === 0 ? 'square' : 'roll', 'voussoir', 5, 6));
  ops.push(bar(line([x0, y0], [x0, vSpring]), z, 'square', 'dressedStone', 4, 5));
  ops.push(bar(line([x1, y0], [x1, vSpring]), z, 'square', 'dressedStone', 4, 5));
  if (tier === 0) return ops;

  if (family === 'plate') {
    // a few LARGE foils pierced in the head (the plate reads as pierced stone)
    const cy = vSpring + (y1 - vSpring) * 0.45, r = w * 0.20;
    ops.push(bar(circlePoints(uMid, cy, r, tier === 1 ? 3 : 5), z, 'square', 'tracery', 3, 4));
    if (tier >= 2) ops.push(bar(nFoilRing(uMid, cy, r * 0.6, r * 0.85, 4, 1.15), z, 'square', 'tracery', 2.2, 3.5));
    ops.push(bar(circlePoints(x0 + w * 0.28, vSpring + w * 0.16, w * 0.10, 3), z, 'square', 'tracery', 2, 3));
    ops.push(bar(circlePoints(x1 - w * 0.28, vSpring + w * 0.16, w * 0.10, 3), z, 'square', 'tracery', 2, 3));
  } else if (family === 'geometric') {
    // two sub-lights (mullion split) + a foiled oculus over them
    ops.push(bar(line([uMid, y0], [uMid, vSpring + w * 0.1]), z, 'fillet', 'mullion', 2.6, 5));
    ops.push(bar(pointedArch(x0 + 6, uMid - 3, vSpring - w * 0.28, headSteps), z, 'square', 'tracery', 3, 4));
    ops.push(bar(pointedArch(uMid + 3, x1 - 6, vSpring - w * 0.28, headSteps), z, 'square', 'tracery', 3, 4));
    const cy = vSpring + (y1 - vSpring) * 0.5, r = w * 0.22;
    ops.push(bar(circlePoints(uMid, cy, r, tier === 1 ? 4 : 6), z, 'roll', 'tracery', 3, 4));
    if (tier >= 2) ops.push(bar(nFoilRing(uMid, cy, r * 0.6, r * 0.82, 6, 1.12), z, 'square', 'tracery', 2.4, 3.5));
  } else if (family === 'flamboyant') {
    // ogee sub-lights + mouchette daggers around a central oculus (flame forms)
    ops.push(bar(line([uMid, y0], [uMid, vSpring + w * 0.06]), z, 'fillet', 'mullion', 2.4, 5));
    ops.push(bar(ogeeArch(x0 + 6, uMid - 3, vSpring - w * 0.26, w * 0.06, headSteps), z, 'square', 'tracery', 2.8, 4));
    ops.push(bar(ogeeArch(uMid + 3, x1 - 6, vSpring - w * 0.26, w * 0.06, headSteps), z, 'square', 'tracery', 2.8, 4));
    const cy = vSpring + (y1 - vSpring) * 0.52, r = w * 0.16;
    ops.push(bar(circlePoints(uMid, cy, r, tier === 1 ? 4 : 6), z, 'square', 'tracery', 2.4, 3.5));
    if (tier >= 2) for (let k = 0; k < 4; k++) ops.push(bar(mouchette(uMid, cy, r * 2.0, r * 0.7, 4, k * 1 + 1), z, 'fillet', 'tracery', 1.8, 3));
  } else { // perpendicular
    // vertical mullions carried unbroken to the head + horizontal transoms (rectilinear panels)
    const cols = 4;
    for (let c = 1; c < cols; c++) { const ux = x0 + (w * c) / cols; ops.push(bar(line([ux, y0], [ux, vSpring + (y1 - vSpring) * (c === 2 ? 0.9 : 0.55)]), z, 'fillet', 'mullion', 2.4, 5)); }
    const trans = tier >= 2 ? [0.32, 0.6, 0.82] : [0.5];
    for (const t of trans) { const ty = y0 + (y1 - y0) * t; ops.push(bar(line([x0 + 4, ty], [x1 - 4, ty]), z, 'fillet', 'mullion', 2.2, 3.5)); }
    if (tier >= 2) { const cy = vSpring + (y1 - vSpring) * 0.55; ops.push(bar(nFoilRing(uMid, cy, w * 0.12, w * 0.17, 4, 1.15), z, 'square', 'tracery', 2, 3)); }
  }
  return ops;
}
