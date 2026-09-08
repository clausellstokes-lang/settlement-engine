/**
 * domain/townMap/arch/profiles.js -- K-1 GRAMMAR: pinned 2D MOULDING PROFILES for the sweep terminal.
 *
 * The profile-sweep terminal generalizes mesh.js addTube (a fixed rectangular cross-section) to a
 * variable 2D cross-section swept along a Bezier at a pinned subdivision -- the mechanism K-3's
 * mouldings, string-course rolls, and rib profiles are authored on. A profile is a CLOSED ring of
 * unit [w, h] offsets in the cross-section plane (w along the frame's side axis, h along its up
 * axis); the sweep scales it by (halfW, halfH) per station and connects consecutive rings + end
 * caps into a closed tube. Every profile ring is CONVEX + wound CCW so the swept solid is manifold.
 *
 * The 'square' profile is exactly addTube's rectangular section, so a square sweep reproduces addTube
 * byte-for-byte -- the byte-parity bridge between the terminal vocabulary and the K-0b algebra. The
 * richer profiles are pinned rational point rings (octagon rolls from N_GON_DIRS, chamfers, a
 * three-facet ovolo) -- {+,-,*,/} only, 0 transcendental sites.
 *
 * @typedef {ReadonlyArray<number>} P2  a unit cross-section offset (w, h)
 */

import { ngonUnitDirs } from './rationalTables.js';

/** the octagon roll (a torus moulding faceted to 8 sides) from the pinned 8-gon ring. @type {P2[]} */
const OCTA_ROLL = ngonUnitDirs(8).map((d) => /** @type {P2} */ ([d[0], d[1]]));

/**
 * MOULDING_PROFILES -- the frozen profile registry. Each is a CCW closed unit ring.
 *   - square : the rectangular section (addTube-identical) -- jamb shafts, mullions, plain bars.
 *   - roll   : an octagonal torus/bowtell -- shaft rolls + rib crowns.
 *   - chamfer: a rectangle with clipped corners -- chamfered arch orders.
 *   - ovolo  : a quarter-round-ish three-facet convex ovolo -- string courses.
 *   - fillet : a slender tall rectangle -- fine tracery bars / cames.
 * @type {Readonly<Record<string, ReadonlyArray<P2>>>}
 */
export const MOULDING_PROFILES = /** @type {Readonly<Record<string, ReadonlyArray<P2>>>} */ (Object.freeze({
  square: Object.freeze([[-1, -1], [1, -1], [1, 1], [-1, 1]]),
  roll: Object.freeze(OCTA_ROLL.map((p) => Object.freeze(p))),
  chamfer: Object.freeze([
    [-1, -0.6], [-0.6, -1], [0.6, -1], [1, -0.6], [1, 0.6], [0.6, 1], [-0.6, 1], [-1, 0.6],
  ]),
  ovolo: Object.freeze([[-1, -1], [1, -1], [1, 0.2], [0.5, 0.85], [-0.2, 1], [-1, 1]]),
  fillet: Object.freeze([[-0.45, -1], [0.45, -1], [0.45, 1], [-0.45, 1]]),
}));

/** The registered profile names. @type {ReadonlyArray<string>} */
export const PROFILE_NAMES = Object.freeze(Object.keys(MOULDING_PROFILES));

/**
 * Resolve a profile ring by name, fail-closed (an unregistered profile is a build-time error, never
 * a silent fallback). @param {string} name @returns {ReadonlyArray<P2>}
 */
export function profileRing(name) {
  const ring = MOULDING_PROFILES[name];
  if (!ring) throw new Error(`arch/profiles: moulding profile "${name}" is not registered`);
  return ring;
}
