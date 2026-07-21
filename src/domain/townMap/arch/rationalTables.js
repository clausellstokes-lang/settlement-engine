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
 * TONE_LUT -- a hand-authored filmic tone/transfer curve, pinned as 17 integer literals
 * mapping a linear-luminance bucket (0..16, i.e. 0.0..1.0 in 1/16 steps) to a display byte
 * (0..255). It bakes gamma + a gentle contrast S (a shadow toe, a mid boost, a highlight
 * shoulder) into ONE table. This is the pinned-rational-table mechanism the kernel doc
 * mandates for the raster's non-linear tone step (CORRECTION 3): a transfer curve is a
 * transcendental (pow) in closed form, so it is TABULATED, never evaluated at runtime.
 * Monotonic non-decreasing, anchored 0 -> 0 and 16 -> 255 (asserted by the unit test).
 * @type {ReadonlyArray<number>}
 */
export const TONE_LUT = Object.freeze([
  0, 10, 26, 46, 68, 90, 112, 132, 151, 168, 184, 198, 211, 222, 232, 244, 255,
]);

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

/**
 * Sample the pinned tone curve at a linear luminance t in [0, 1] and return a display byte
 * (0..255). Linear interpolation between the two straddling LUT buckets -- pure {+,-,*,/}
 * plus Math.round/min/max, no transcendental.
 * @param {number} t linear luminance, clamped to [0, 1]
 * @returns {number} display byte in [0, 255]
 */
export function tone(t) {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  const f = c * (TONE_LUT.length - 1);
  const i = Math.floor(f);
  if (i >= TONE_LUT.length - 1) return TONE_LUT[TONE_LUT.length - 1];
  const frac = f - i;
  const a = TONE_LUT[i], b = TONE_LUT[i + 1];
  return Math.round(a + (b - a) * frac);
}
