/**
 * scripts/lib/adaptiveGovernor.mjs — import-free exhibit compatibility mirror.
 *
 * Canonical application implementation:
 *
 *   src/lib/townScene/adaptiveQuality.js
 *
 * The K-1/K-4 file:// exhibits inline this file as plain browser script after
 * stripping `export` keywords. A normal re-export would leave an import statement
 * inside those standalone documents, so this generated-style mirror must remain
 * self-contained and import-free. tests/architecture/adaptiveGovernor.test.js
 * executes both modules against the same traces and pins export/behavior parity.
 *
 * Do not add application behavior here first. Change the canonical module, then
 * update this compatibility artifact in the same patch.
 */

/**
 * THE NAMED TUNING -- owner-vetoable constants (a constants flip, never a
 * rebuild). Watermarks are frame time in milliseconds; the dead band between
 * LOW and HIGH is the hysteresis. `degrade fast, recover slow`:
 * DEGRADE_AFTER_FRAMES (N) < RECOVER_AFTER_FRAMES (M), and the step down is
 * larger than the step up.
 *
 * @type {Readonly<Record<string, number>>}
 */
export const GOVERNOR_TUNING = Object.freeze({
  FRAME_BUDGET_MS: 16.7,
  HIGH_WATERMARK_MS: 20.0,
  LOW_WATERMARK_MS: 14.0,
  EMA_ALPHA: 0.1,
  DEGRADE_AFTER_FRAMES: 6,
  RECOVER_AFTER_FRAMES: 45,
  DEGRADE_STEP: 0.08,
  RECOVER_STEP: 0.04,
  QUALITY_FLOOR: 0.3,
  QUALITY_CEIL: 1.0,
  BIRDS_EYE_TRIP_MS: 40.0,
  BIRDS_EYE_FRAMES: 90,
  BIRDS_EYE_CLEAR_MS: 22.0,
});

/**
 * THE MANUAL OVERRIDE CEILINGS -- auto/high leave the top open; medium and low
 * cap quality. A cap is a ceiling, not a fixed rung, so the governor may still
 * degrade below it under load.
 *
 * @type {Readonly<Record<string, number>>}
 */
export const QUALITY_CEILINGS = Object.freeze({
  auto: 1.0,
  high: 1.0,
  medium: 0.7,
  low: 0.45,
});

/** The override modes, in dial order. @type {ReadonlyArray<string>} */
export const OVERRIDE_MODES = Object.freeze([
  'auto',
  'high',
  'medium',
  'low',
]);

/** Round to a 1/10,000 grid so repeated steps cannot accumulate float drift. */
function grid(value) {
  return Math.round(value * 10000) / 10000;
}

/** Clamp a number into an inclusive interval. */
function clamp(value, lower, upper) {
  return value < lower ? lower : value > upper ? upper : value;
}

/** A rising 0..1 ramp across an interval. */
function ramp01(value, lower, upper) {
  if (upper === lower) return value < lower ? 0 : 1;
  return clamp((value - lower) / (upper - lower), 0, 1);
}

/**
 * A fresh governor state: full quality, no manual cap, and the EMA seeded at
 * the target budget.
 *
 * @param {Record<string, number>} [tuning]
 * @returns {object}
 */
export function createGovernorState(tuning = GOVERNOR_TUNING) {
  return {
    ema: tuning.FRAME_BUDGET_MS,
    quality: tuning.QUALITY_CEIL,
    ceiling: tuning.QUALITY_CEIL,
    overFrames: 0,
    underFrames: 0,
    birdsEye: false,
    birdsEyeFrames: 0,
  };
}

/**
 * OBSERVE ONE FRAME -- the pure sense-to-decision core. Quality falls only above
 * the high watermark and rises only below the low watermark. The floor and
 * manual ceiling are enforced on every frame.
 *
 * @param {object} state
 * @param {number} frameMs measured requestAnimationFrame delta in milliseconds
 * @param {Record<string, number>} [tuning]
 * @returns {object}
 */
export function observeFrame(state, frameMs, tuning = GOVERNOR_TUNING) {
  const T = tuning;
  const duration = Number.isFinite(frameMs) && frameMs > 0
    ? frameMs
    : T.FRAME_BUDGET_MS;
  const ema = state.ema + T.EMA_ALPHA * (duration - state.ema);
  let quality = state.quality;
  let overFrames = state.overFrames;
  let underFrames = state.underFrames;
  let birdsEye = state.birdsEye;
  let birdsEyeFrames = state.birdsEyeFrames;
  const ceiling = state.ceiling;

  // The dead band resets both counters, so a wandering signal never steps.
  if (ema > T.HIGH_WATERMARK_MS) {
    overFrames += 1;
    underFrames = 0;
  } else if (ema < T.LOW_WATERMARK_MS) {
    underFrames += 1;
    overFrames = 0;
  } else {
    overFrames = 0;
    underFrames = 0;
  }

  if (overFrames >= T.DEGRADE_AFTER_FRAMES) {
    quality = grid(quality - T.DEGRADE_STEP);
    overFrames = 0;
  } else if (underFrames >= T.RECOVER_AFTER_FRAMES) {
    quality = grid(quality + T.RECOVER_STEP);
    underFrames = 0;
  }

  quality = clamp(quality, T.QUALITY_FLOOR, ceiling);

  // Even the lowest useful 3D rung must escape to the 2D plan under overload.
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

  return {
    ema,
    quality,
    ceiling,
    overFrames,
    underFrames,
    birdsEye,
    birdsEyeFrames,
  };
}

/**
 * Set the manual ceiling and clamp current quality immediately.
 *
 * @param {object} state
 * @param {number} ceiling
 * @param {Record<string, number>} [tuning]
 * @returns {object}
 */
export function setQualityCeiling(
  state,
  ceiling,
  tuning = GOVERNOR_TUNING,
) {
  const nextCeiling = clamp(
    Number.isFinite(ceiling) ? ceiling : tuning.QUALITY_CEIL,
    tuning.QUALITY_FLOOR,
    tuning.QUALITY_CEIL,
  );
  return {
    ...state,
    ceiling: nextCeiling,
    quality: clamp(state.quality, tuning.QUALITY_FLOOR, nextCeiling),
  };
}

/** Resolve a manual mode; unknown values deliberately behave like auto. */
export function ceilingForMode(mode) {
  return Object.prototype.hasOwnProperty.call(QUALITY_CEILINGS, mode)
    ? QUALITY_CEILINGS[mode]
    : QUALITY_CEILINGS.auto;
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
  const normalized = Number.isFinite(quality) ? quality : T.QUALITY_CEIL;
  const q = clamp(normalized, T.QUALITY_FLOOR, T.QUALITY_CEIL);
  const massingOnly = q <= T.QUALITY_FLOOR + 1e-9;
  // (1) resolution sheds first, over the top band [0.75, 1.0]; holds ~0.6 below.
  const resScale = grid(0.6 + 0.4 * ramp01(q, 0.75, 1.0));
  // (2) contact-AO/shadow rung.
  const contact = q >= 0.8;
  // (3) the global LOD bias -- inward as quality falls across [FLOOR, 0.8]; forced to max at the floor.
  const lodBias = massingOnly
    ? 2
    : Math.round(
      2 * (1 - ramp01(q, T.QUALITY_FLOOR, 0.8)),
    );
  // (4) the crease ink-line pass.
  const ink = q >= 0.55;
  // (5) instance/detail cull distance -- shrinks across [FLOOR, 0.55].
  const cullScale = grid(ramp01(q, T.QUALITY_FLOOR, 0.55));
  return {
    resScale,
    contact,
    lodBias,
    ink,
    cullScale,
    massingOnly,
  };
}

/**
 * Translate the ladder into the concrete renderer-actuation vocabulary.
 * `plan2d` is a real mode switch: the caller must unmount/pause the 3D renderer
 * and show the canonical plan rather than treating fallback as a visual effect.
 *
 * @param {object|number} stateOrQuality
 * @param {Record<string, number>} [tuning]
 * @returns {object}
 */
export function actuationPlanFor(stateOrQuality, tuning = GOVERNOR_TUNING) {
  const state = typeof stateOrQuality === 'number'
    ? {
        quality: stateOrQuality,
        ceiling: tuning.QUALITY_CEIL,
        birdsEye: false,
      }
    : stateOrQuality || createGovernorState(tuning);
  const ceiling = Number.isFinite(state.ceiling)
    ? clamp(state.ceiling, tuning.QUALITY_FLOOR, tuning.QUALITY_CEIL)
    : tuning.QUALITY_CEIL;
  const quality = clamp(
    Number.isFinite(state.quality) ? state.quality : ceiling,
    tuning.QUALITY_FLOOR,
    ceiling,
  );
  const ladder = ladderFor(quality, tuning);

  return Object.freeze({
    quality,
    renderScale: ladder.resScale,
    lodBias: ladder.lodBias,
    contactShadows: ladder.contact,
    creaseInk: ladder.ink,
    cullScale: ladder.cullScale,
    massingOnly: ladder.massingOnly,
    fallback: state.birdsEye === true ? 'plan2d' : 'scene3d',
  });
}
