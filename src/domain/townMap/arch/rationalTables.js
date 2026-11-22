/**
 * domain/townMap/arch/rationalTables.js -- K-0 SPIKE: the pinned rational constants.
 *
 * THE CHEAPEST FALSIFIER (docs/THE_ARCHITECTURE_KERNEL_3D.md, K-0): this whole arch/
 * subtree is a grammar-LESS proof spike -- hand-coded geometry + a deterministic CPU
 * renderer, imported by NOTHING shipped, so it is byte-dormant by construction (it never
 * enters the first-paint static closure). It answers ONE question: can the
 * PROMISE-keeping (byte-deterministic, no-GPU) render path reach the owner's gothic
 * reference bar.
 *
 * DETERMINISM LAW (CORRECTION 2 of the kernel doc, and the townMap purity scan): every
 * value here is reachable through {+, -, *, /, Math.sqrt} ONLY, or is a PINNED LITERAL
 * committed by hand off-engine. The engine NEVER calls Math.cos / Math.sin / Math.pow /
 * Math.exp / ** -- those are implementation-approximated per ECMA-262 and fork same-seed
 * output across engines (the transcendental-math ratchet, tests/lint/
 * transcendentalMathBaseline.test.js, holds this file at ZERO transcendental sites).
 * Math.sqrt is exempt: the spec requires it correctly rounded, so it is cross-engine exact
 * (the massing.js SHADOW_MAG precedent).
 */

import { TONE_LUT, tone } from '../../../kernel/toneCurve.js';

// Preserve the architecture-kernel API while keeping the display transfer
// neutral and reusable by every deterministic CPU renderer.
export { TONE_LUT, tone };

/** Root two, correctly-rounded (Math.sqrt is spec-exact -- the sanctioned exception). */
export const SQRT2 = Math.sqrt(2);
/** Root three, correctly-rounded. Drives the equilateral pointed arch (below). */
export const SQRT3 = Math.sqrt(3);

/**
 * KAPPA -- the cubic-Bezier circle constant for a 90-degree arc: (4/3)(sqrt(2) - 1).
 * A quarter circle of radius r is drawn as ONE cubic Bezier whose off-curve handles sit
 * KAPPA * r along the endpoint tangents. This is the BEZIER-ONLY-CURVES rule (CORRECTION
 * 2a): every arc is cubic Beziers in model space, NEVER the SVG arc `A` command (its
 * x-rotation parameter needs atan2, a banned transcendental).
 */
export const KAPPA = (4 / 3) * (SQRT2 - 1);

/**
 * The cubic-Bezier handle factor for a 60-degree arc = (4/3) * tan(15deg), and
 * tan(15deg) = 2 - sqrt(3) is IN the sqrt-closure (constructible), so the equilateral
 * (two-60-degree-arc) pointed arch needs no table and no trig. This is the "gothic is
 * mostly constructible" result -- pointed arches, trefoils (120deg), quatrefoils (90deg)
 * all live in {sqrt2, sqrt3}. Only the deliberately-chosen non-constructible foil (below)
 * needs a pinned literal.
 */
export const ARC60_HANDLE = (4 / 3) * (2 - SQRT3);

/**
 * HEPTA_DIRS -- the SEVEN unit directions of a regular heptagon (k * 2pi/7, k = 0..6),
 * as fixed integer literals scaled by 1e4 ([cos*1e4, sin*1e4]). Computed ONCE, BY HAND,
 * off-engine -- the townMapModel.js:18 COMPASS precedent, extended to a non-constructible
 * ring. The septfoil (7 cusps) is the deliberate hard case: 7 is not a Fermat prime, so by
 * Gauss-Wantzel cos(2pi/7) is NOT constructible and NOT in the {+,-,*,/,sqrt} closure
 * (kernel doc CORRECTION 2b). It therefore CANNOT be derived at runtime without trig --
 * it MUST be a pinned literal. Its presence in the oculus proves tracery-without-trig for
 * the case the "compass-and-straightedge" framing could not reach.
 * @type {ReadonlyArray<readonly [number, number]>}
 */
export const HEPTA_DIRS = Object.freeze([
  [10000, 0], [6235, 7818], [-2225, 9749], [-9010, 4339], [-9010, -4339], [-2225, -9749], [6235, -7818],
]);

/**
 * N_GON_DIRS -- the K-1 generalization of HEPTA_DIRS into a pinned RADIAL-DIRECTION
 * REGISTRY. For each supported gon count n, the n unit directions of a regular n-gon
 * (k * 2pi/n, k = 0..n-1) as fixed integer literals scaled by 1e4 ([cos*1e4, sin*1e4]).
 * Every entry was computed ONCE, BY HAND, off-engine (the townMapModel.js:18 COMPASS +
 * HEPTA_DIRS precedent) -- the engine NEVER calls cos/sin at runtime, so the radial
 * n-gon PRISM op (interpreter's curved-massing owner: apse, chevet, round towers, rose
 * spoke rings) is byte-deterministic cross-engine even for the NON-constructible counts
 * (7, 9 -- not Fermat-constructible, so cos(2pi/n) is outside the {+,-,*,/,sqrt} closure
 * and CANNOT be derived at runtime without trig; kernel doc CORRECTION 1 + 2b).
 * N_GON_DIRS[7] === the HEPTA_DIRS ring (kept as the named septfoil alias above).
 * @type {Readonly<Record<number, ReadonlyArray<ReadonlyArray<number>>>>}
 */
export const N_GON_DIRS = /** @type {Readonly<Record<number, ReadonlyArray<ReadonlyArray<number>>>>} */ (Object.freeze({
  3: Object.freeze([[10000, 0], [-5000, 8660], [-5000, -8660]]),
  4: Object.freeze([[10000, 0], [0, 10000], [-10000, 0], [0, -10000]]),
  5: Object.freeze([[10000, 0], [3090, 9511], [-8090, 5878], [-8090, -5878], [3090, -9511]]),
  6: Object.freeze([[10000, 0], [5000, 8660], [-5000, 8660], [-10000, 0], [-5000, -8660], [5000, -8660]]),
  7: HEPTA_DIRS,
  8: Object.freeze([[10000, 0], [7071, 7071], [0, 10000], [-7071, 7071], [-10000, 0], [-7071, -7071], [0, -10000], [7071, -7071]]),
  9: Object.freeze([[10000, 0], [7660, 6428], [1736, 9848], [-5000, 8660], [-9397, 3420], [-9397, -3420], [-5000, -8660], [1736, -9848], [7660, -6428]]),
  12: Object.freeze([[10000, 0], [8660, 5000], [5000, 8660], [0, 10000], [-5000, 8660], [-8660, 5000], [-10000, 0], [-8660, -5000], [-5000, -8660], [0, -10000], [5000, -8660], [8660, -5000]]),
  16: Object.freeze([[10000, 0], [9239, 3827], [7071, 7071], [3827, 9239], [0, 10000], [-3827, 9239], [-7071, 7071], [-9239, 3827], [-10000, 0], [-9239, -3827], [-7071, -7071], [-3827, -9239], [0, -10000], [3827, -9239], [7071, -7071], [9239, -3827]]),
}));

/** The supported n-gon counts (the pinned N_GON_DIRS keys), ascending. @type {ReadonlyArray<number>} */
export const N_GON_COUNTS = Object.freeze([3, 4, 5, 6, 7, 8, 9, 12, 16]);

/**
 * The pinned unit directions for a supported n-gon, as float unit vectors (each scaled
 * down from the 1e4 integer literals). Throws for an unregistered count -- the FAIL-CLOSED
 * discipline (an unpinned gon count MUST NOT silently fall back to a trig computation).
 * @param {number} n @returns {ReadonlyArray<readonly [number, number]>}
 */
export function ngonUnitDirs(n) {
  const table = N_GON_DIRS[n];
  if (!table) throw new Error(`arch: n-gon count ${n} is not in the pinned N_GON_DIRS registry (add a hand-computed row)`);
  return table.map((d) => /** @type {readonly [number, number]} */ ([d[0] / 10000, d[1] / 10000]));
}

/**
 * THE ONE FIXED LIGHT, as a 3D unit vector in the render frame (x = screen-right,
 * y = screen-down, z = out of the screen toward the viewer). It points up-left-and-out
 * (NW and toward the camera) -- the same NW key light the massing / ground-dress layers
 * share (SHADOW_DIR), lifted to three dimensions for per-pixel Lambert. Normalized with
 * the correctly-rounded Math.sqrt so it is a true unit vector cross-engine.
 */
const _LX = -0.46, _LY = -0.40, _LZ = 0.79;
const _LMAG = Math.sqrt(_LX * _LX + _LY * _LY + _LZ * _LZ) || 1;
/**
 * The SCREEN-frame light (x = screen-right, y = screen-down, z = out toward the viewer),
 * pointing up-left-and-out. Drives the rounded-bar (tube-normal) shading of tracery + the
 * flyer, whose normals are reconstructed in screen space.
 * @type {readonly [number, number, number]}
 */
export const LIGHT = Object.freeze([_LX / _LMAG, _LY / _LMAG, _LZ / _LMAG]);

/**
 * The MODEL-frame light (x = east, y = depth/north, z = up): the facade key, from the
 * upper-left and the viewer's side -- from the west (-x), the FRONT (+y, so the elevation is
 * lit rather than backlit), and above (+z). A west face is lit, an east face shaded, and a
 * member standing in front of the wall casts its shadow back onto the wall (down and east).
 * Screen-consistent with LIGHT (up-left-and-out). Unit via correctly-rounded sqrt.
 */
const _MX = -0.42, _MY = 0.50, _MZ = 0.76;
const _MMAG = Math.sqrt(_MX * _MX + _MY * _MY + _MZ * _MZ) || 1;
/** @type {readonly [number, number, number]} */
export const LIGHT_MODEL = Object.freeze([_MX / _MMAG, _MY / _MMAG, _MZ / _MMAG]);
