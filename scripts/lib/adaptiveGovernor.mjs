/**
 * scripts/lib/adaptiveGovernor.mjs -- K-5 THE ADAPTIVE FIDELITY GOVERNOR (view-only, non-golden).
 *
 * The runtime quality controller for the LIVE VIEW ONLY. It senses frame time and drives ONE scalar
 * `qualityLevel in [FLOOR, 1.0]` down a continuous fidelity ladder to a usable floor under load, and
 * back up when headroom returns -- exactly like adaptive quality in any 3D game. It is PROMISE-safe
 * BY CONSTRUCTION and lives OUTSIDE the determinism perimeter:
 *   - it NEVER touches geometry, goldens, the plate export, or the GLB (all rendered at MAX fidelity,
 *     always, by the pure arch/ kernel which never imports this module);
 *   - it reads NO golden and writes NO model state -- it maps frame-time NUMBERS to a view scalar;
 *   - the kernel never imports it (docs/KERNEL_MAX_PROGRAM.md THE ADAPTIVE FIDELITY GOVERNOR; the
 *     archViewWall pin proves geometry/GLB bytes are identical at every qualityLevel).
 *
 * HOME. It sits in the exhibit/viewer toolchain (scripts/), not src/ -- so it ships ZERO eager bytes
 * (closure Delta 0), sits outside src/domain (no strict-typecheck ratchet), and outside the
 * transcendental-scan trees. The generate-k*.mjs exhibit scripts INLINE this source into their
 * self-contained file:// viewers (strip the `export ` keywords -> the identical logic runs in the
 * browser); adaptiveGovernor.test.js imports it and tests the pure sense->decide ladder deterministically
 * with SYNTHETIC frame-time sequences (no real timing). ONE source of truth, tested AND shipped.
 *
 * PURITY. Only {+,-,*,/} + Math.round/min/max -- zero transcendentals, no clock, no rng, no browser
 * API in the core (the caller injects the rAF frame delta; browser timing is the sensor, allowed only
 * in the viewer that calls this). Every step returns a NEW state (no mutation) so a fold over a
 * synthetic ramp is a pure reduction the property tests can assert monotonicity over.
 */

/**
 * THE NAMED TUNING -- owner-vetoable constants (a constants flip, never a rebuild). Watermarks in ms
 * of frame time; a dead-band between LOW and HIGH IS the hysteresis. `degrade fast, recover slow`:
 * DEGRADE_AFTER_FRAMES (N) < RECOVER_AFTER_FRAMES (M) so a passing dip never pops quality back up, and
 * the step down is larger than the step up. @type {Readonly<Record<string, number>>}
 */
export const GOVERNOR_TUNING = Object.freeze({
  FRAME_BUDGET_MS: 16.7, // the 60fps target (the EMA seed + the reference the watermarks bracket).
  HIGH_WATERMARK_MS: 20.0, // EMA above this => OVER budget (~50fps): accumulate toward a degrade.
  LOW_WATERMARK_MS: 14.0, // EMA below this => headroom (~71fps): accumulate toward a recover.
  //                         the [14, 20] gap is the dead-band -- inside it, quality never changes.
  EMA_ALPHA: 0.1, // rolling frame-time EMA weight (a ~10-frame memory) -- smooths single-frame spikes.
  DEGRADE_AFTER_FRAMES: 6, // N consecutive over-budget frames => ONE degrade step (degrade FAST).
  RECOVER_AFTER_FRAMES: 45, // M consecutive under-budget frames => ONE recover step (recover SLOW; M>N).
  DEGRADE_STEP: 0.08, // qualityLevel decrement per degrade.
  RECOVER_STEP: 0.04, // qualityLevel increment per recover (smaller than DEGRADE_STEP => anti-pop).
  QUALITY_FLOOR: 0.3, // THE USABLE FLOOR: massing-silhouettes-only 3D. qualityLevel is NEVER below this.
  QUALITY_CEIL: 1.0, // full fidelity.
  BIRDS_EYE_TRIP_MS: 40.0, // even AT the floor, EMA above this (~25fps) for BIRDS_EYE_FRAMES => the 2D
  //                          bird's-eye escape hatch (K-5's guaranteed-renders fallback; never blank).
  BIRDS_EYE_FRAMES: 90, // sustained-overload window before the 2D fallback trips (~1.5s @ 60fps).
  BIRDS_EYE_CLEAR_MS: 22.0, // EMA below this => leave the 2D fallback, return to the 3D floor.
});

/**
 * THE MANUAL OVERRIDE CEILINGS -- the auto/high/medium/low dial. auto/high leave the top open; medium
 * and low CAP quality (the governor treats a manual cap as its CEILING and still degrades below it under
 * load). @type {Readonly<Record<string, number>>}
 */
export const QUALITY_CEILINGS = Object.freeze({ auto: 1.0, high: 1.0, medium: 0.7, low: 0.45 });

/** the override modes, in dial order. @type {ReadonlyArray<string>} */
export const OVERRIDE_MODES = Object.freeze(['auto', 'high', 'medium', 'low']);

/** round to a 1/10000 grid so repeated +/- of the step constants never drifts on float error. @param {number} x @returns {number} */
function grid(x) { return Math.round(x * 10000) / 10000; }

/** clamp x into [lo, hi]. @param {number} x @param {number} lo @param {number} hi @returns {number} */
function clamp(x, lo, hi) { return x < lo ? lo : x > hi ? hi : x; }

/** a rising 0..1 ramp of x across [lo, hi] (lo may exceed hi for a falling ramp). @param {number} x @param {number} lo @param {number} hi @returns {number} */
function ramp01(x, lo, hi) { if (hi === lo) return x < lo ? 0 : 1; return clamp((x - lo) / (hi - lo), 0, 1); }

/**
 * A fresh governor state -- full quality, no manual cap, the EMA seeded at budget. @param {Record<string, number>} [tuning] @returns {object}
 */
export function createGovernorState(tuning = GOVERNOR_TUNING) {
  return {
    ema: tuning.FRAME_BUDGET_MS, // rolling frame-time EMA (ms).
    quality: tuning.QUALITY_CEIL, // the live qualityLevel scalar in [FLOOR, ceiling].
    ceiling: tuning.QUALITY_CEIL, // the manual-override ceiling (auto => 1.0).
    overFrames: 0, // consecutive over-budget frames (toward a degrade).
    underFrames: 0, // consecutive under-budget frames (toward a recover).
    birdsEye: false, // the 2D bird's-eye escape hatch is engaged.
    birdsEyeFrames: 0, // consecutive at-floor-and-still-drowning frames (toward the escape hatch).
  };
}

/**
 * OBSERVE ONE FRAME -- the sense->decide core. Pure: returns a NEW state. Quality only DROPS while the
 * EMA is over the HIGH watermark (over budget) and only RISES while under the LOW watermark (headroom);
 * inside the dead-band it never changes. `degrade fast, recover slow` via M>N frame counts + asymmetric
 * steps. Quality is clamped to [FLOOR, ceiling] EVERY frame (the floor invariant + override-wins).
 * @param {object} state @param {number} frameMs the measured frame time (rAF delta) in ms @param {Record<string, number>} [tuning] @returns {object}
 */
export function observeFrame(state, frameMs, tuning = GOVERNOR_TUNING) {
  const T = tuning;
  const ema = state.ema + T.EMA_ALPHA * (frameMs - state.ema);
  let quality = state.quality;
  let overFrames = state.overFrames;
  let underFrames = state.underFrames;
  let birdsEye = state.birdsEye;
  let birdsEyeFrames = state.birdsEyeFrames;
  const ceiling = state.ceiling;

  // ── hysteresis counters: the dead-band [LOW, HIGH] resets both, so a wandering signal never steps ──
  if (ema > T.HIGH_WATERMARK_MS) { overFrames += 1; underFrames = 0; }
  else if (ema < T.LOW_WATERMARK_MS) { underFrames += 1; overFrames = 0; }
  else { overFrames = 0; underFrames = 0; }

  // ── DEGRADE (fast): only fires while over budget; mutually exclusive with recover this frame ──
  if (overFrames >= T.DEGRADE_AFTER_FRAMES) {
    quality = grid(quality - T.DEGRADE_STEP);
    overFrames = 0;
  } else if (underFrames >= T.RECOVER_AFTER_FRAMES) {
    // ── RECOVER (slow): only fires while under budget (headroom) ──
    quality = grid(quality + T.RECOVER_STEP);
    underFrames = 0;
  }

  // ── the floor invariant + override-wins: quality is ALWAYS in [FLOOR, ceiling] ──
  quality = clamp(quality, T.QUALITY_FLOOR, ceiling);

  // ── the 2D bird's-eye escape hatch: even AT the floor, sustained drowning => the never-blank fallback ──
  const atFloor = quality <= T.QUALITY_FLOOR + 1e-9;
  if (!birdsEye) {
    if (atFloor && ema > T.BIRDS_EYE_TRIP_MS) {
      birdsEyeFrames += 1;
      if (birdsEyeFrames >= T.BIRDS_EYE_FRAMES) birdsEye = true;
    } else {
      birdsEyeFrames = 0;
    }
  } else if (ema < T.BIRDS_EYE_CLEAR_MS) {
    birdsEye = false;
    birdsEyeFrames = 0;
  }

  return { ema, quality, ceiling, overFrames, underFrames, birdsEye, birdsEyeFrames };
}

/**
 * Set the manual-override ceiling and clamp quality to it IMMEDIATELY (a low cap wins on the click, not
 * a frame later). Pure. @param {object} state @param {number} ceiling @param {Record<string, number>} [tuning] @returns {object}
 */
export function setQualityCeiling(state, ceiling, tuning = GOVERNOR_TUNING) {
  const c = clamp(ceiling, tuning.QUALITY_FLOOR, tuning.QUALITY_CEIL);
  return { ...state, ceiling: c, quality: clamp(state.quality, tuning.QUALITY_FLOOR, c) };
}

/** the ceiling for an override mode ('auto'|'high'|'medium'|'low'). @param {string} mode @returns {number} */
export function ceilingForMode(mode) {
  return Object.prototype.hasOwnProperty.call(QUALITY_CEILINGS, mode) ? QUALITY_CEILINGS[mode] : QUALITY_CEILINGS.auto;
}

/**
 * THE FIDELITY LADDER -- map qualityLevel to the per-rung VIEW settings, engaged continuously in the
 * doc's best-visual-value-retained-first order (docs/KERNEL_MAX_PROGRAM.md):
 *   (1) resScale   1.0 -> ~0.6  dynamic render-resolution scale (cheapest big win, sheds FIRST).
 *   (2) contact    on/off       shadow/contact-AO strength (the shadow-map rung) off below 0.80.
 *   (3) lodBias    0 -> 2       GLOBAL LOD BIAS pushed inward -- the BIGGEST lever, continuous.
 *   (4) ink        on/off       the crease ink-line pass off below 0.55.
 *   (5) cullScale  1.0 -> 0     instance/detail cull distance shrinks below 0.55.
 *   (6) massingOnly true        THE FLOOR: massing-silhouettes-only 3D (forces the deepest LOD bias).
 * Monotone in quality by construction (resScale/cullScale non-decreasing; lodBias non-increasing).
 * View-only: the viewer READS these; the geometry is unchanged. @param {number} quality @param {Record<string, number>} [tuning] @returns {object}
 */
export function ladderFor(quality, tuning = GOVERNOR_TUNING) {
  const T = tuning;
  const q = clamp(quality, T.QUALITY_FLOOR, T.QUALITY_CEIL);
  const massingOnly = q <= T.QUALITY_FLOOR + 1e-9;
  // (1) resolution sheds first, over the top band [0.75, 1.0]; holds ~0.6 below.
  const resScale = grid(0.6 + 0.4 * ramp01(q, 0.75, 1.0));
  // (2) contact-AO/shadow rung.
  const contact = q >= 0.8;
  // (3) the global LOD bias -- inward as quality falls across [FLOOR, 0.8]; forced to max at the floor.
  const lodBias = massingOnly ? 2 : Math.round(2 * (1 - ramp01(q, T.QUALITY_FLOOR, 0.8)));
  // (4) the crease ink-line pass.
  const ink = q >= 0.55;
  // (5) instance/detail cull distance -- shrinks across [FLOOR, 0.55].
  const cullScale = grid(ramp01(q, T.QUALITY_FLOOR, 0.55));
  return { resScale, contact, lodBias, ink, cullScale, massingOnly };
}
