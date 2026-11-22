/**
 * adaptiveQuality.js — the canonical, view-only settlement-scene quality governor.
 *
 * The governor converts caller-supplied frame durations into a single quality
 * scalar and then into concrete renderer settings. It belongs to the VIEW:
 * nothing here changes a scene manifest, geometry, persistence, export bytes, or
 * simulation state. The deterministic scene compiler must never import it.
 *
 * The browser owns sensing and actuation. It passes each requestAnimationFrame
 * delta to `observeFrame`, then applies `actuationPlanFor` to renderer state.
 * Keeping those concerns outside this module makes the policy deterministic and
 * testable with synthetic traces:
 *
 *   frame duration -> governor state -> fidelity ladder -> renderer actuation
 *
 * This module intentionally uses no clock, DOM, storage, randomness, network, or
 * transcendental math. Every transition returns a new object. The standalone
 * exhibit viewers cannot import application modules from file://, so
 * scripts/lib/adaptiveGovernor.mjs remains an import-free compatibility mirror;
 * architecture tests pin its public behavior to this canonical implementation.
 */

import { clamp } from '../../kernel/math.js';

/**
 * Named, owner-vetoable tuning values. The gap between LOW and HIGH is the
 * hysteresis dead band. Degradation is deliberately faster than recovery, so a
 * transient lull cannot make detail visibly pop in and out.
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
 * Manual modes cap automatic quality; they never force the viewer to stay at
 * that quality when the device is overloaded.
 *
 * @type {Readonly<Record<string, number>>}
 */
export const QUALITY_CEILINGS = Object.freeze({
  auto: 1.0,
  high: 1.0,
  medium: 0.7,
  low: 0.45,
});

/** The quality-control modes in presentation order. */
export const OVERRIDE_MODES = Object.freeze([
  'auto',
  'high',
  'medium',
  'low',
]);

/** Round to a 1/10,000 grid so repeated steps do not accumulate float drift. */
function grid(value) {
  return Math.round(value * 10000) / 10000;
}

/** A rising 0..1 ramp across an interval. */
function ramp01(value, lower, upper) {
  if (upper === lower) return value < lower ? 0 : 1;
  return clamp((value - lower) / (upper - lower), 0, 1);
}

/**
 * A fresh governor starts at full quality with a frame-time EMA seeded at the
 * target budget.
 *
 * @param {Record<string, number>} [tuning]
 * @returns {{
 *   ema: number,
 *   quality: number,
 *   ceiling: number,
 *   overFrames: number,
 *   underFrames: number,
 *   birdsEye: boolean,
 *   birdsEyeFrames: number,
 * }}
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
 * Observe one frame and return the next governor state.
 *
 * Quality can fall only above the high watermark and rise only below the low
 * watermark. The floor and manual ceiling are enforced on every transition.
 * Once the floor is reached, sustained severe overload requests the guaranteed
 * 2D fallback rather than allowing an unusable 3D slideshow.
 *
 * A non-finite or non-positive duration is treated as one budgeted frame. This
 * fails neutral instead of poisoning the EMA with NaN or manufacturing either a
 * degradation or recovery signal.
 *
 * @param {ReturnType<typeof createGovernorState>} state
 * @param {number} frameMs caller-measured requestAnimationFrame delta
 * @param {Record<string, number>} [tuning]
 * @returns {ReturnType<typeof createGovernorState>}
 */
export function observeFrame(state, frameMs, tuning = GOVERNOR_TUNING) {
  const duration = Number.isFinite(frameMs) && frameMs > 0
    ? frameMs
    : tuning.FRAME_BUDGET_MS;
  const ema = state.ema + tuning.EMA_ALPHA * (duration - state.ema);
  let quality = state.quality;
  let overFrames = state.overFrames;
  let underFrames = state.underFrames;
  let birdsEye = state.birdsEye;
  let birdsEyeFrames = state.birdsEyeFrames;
  const ceiling = state.ceiling;

  if (ema > tuning.HIGH_WATERMARK_MS) {
    overFrames += 1;
    underFrames = 0;
  } else if (ema < tuning.LOW_WATERMARK_MS) {
    underFrames += 1;
    overFrames = 0;
  } else {
    overFrames = 0;
    underFrames = 0;
  }

  if (overFrames >= tuning.DEGRADE_AFTER_FRAMES) {
    quality = grid(quality - tuning.DEGRADE_STEP);
    overFrames = 0;
  } else if (underFrames >= tuning.RECOVER_AFTER_FRAMES) {
    quality = grid(quality + tuning.RECOVER_STEP);
    underFrames = 0;
  }

  quality = clamp(quality, tuning.QUALITY_FLOOR, ceiling);

  const atFloor = quality <= tuning.QUALITY_FLOOR + 1e-9;
  if (!birdsEye) {
    if (atFloor && ema > tuning.BIRDS_EYE_TRIP_MS) {
      birdsEyeFrames += 1;
      if (birdsEyeFrames >= tuning.BIRDS_EYE_FRAMES) birdsEye = true;
    } else {
      birdsEyeFrames = 0;
    }
  } else if (ema < tuning.BIRDS_EYE_CLEAR_MS) {
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
 * Set a manual ceiling and clamp the current quality immediately.
 *
 * @param {ReturnType<typeof createGovernorState>} state
 * @param {number} ceiling
 * @param {Record<string, number>} [tuning]
 * @returns {ReturnType<typeof createGovernorState>}
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

/**
 * Resolve an override mode. Unknown values deliberately behave like `auto`.
 *
 * @param {string} mode
 * @returns {number}
 */
export function ceilingForMode(mode) {
  return Object.prototype.hasOwnProperty.call(QUALITY_CEILINGS, mode)
    ? QUALITY_CEILINGS[mode]
    : QUALITY_CEILINGS.auto;
}

/**
 * Map the continuous quality scalar onto the renderer's fidelity ladder.
 *
 * The rungs shed cost in visual-value order: resolution, contact shadows, LOD,
 * crease ink, detail distance, and finally silhouettes-only massing. The ladder
 * is monotone by construction: increasing quality never lowers resolution or
 * cull distance and never increases LOD bias.
 *
 * @param {number} quality
 * @param {Record<string, number>} [tuning]
 * @returns {{
 *   resScale: number,
 *   contact: boolean,
 *   lodBias: number,
 *   ink: boolean,
 *   cullScale: number,
 *   massingOnly: boolean,
 * }}
 */
export function ladderFor(quality, tuning = GOVERNOR_TUNING) {
  const normalized = Number.isFinite(quality)
    ? quality
    : tuning.QUALITY_CEIL;
  const level = clamp(
    normalized,
    tuning.QUALITY_FLOOR,
    tuning.QUALITY_CEIL,
  );
  const massingOnly = level <= tuning.QUALITY_FLOOR + 1e-9;
  const resScale = grid(0.6 + 0.4 * ramp01(level, 0.75, 1.0));
  const contact = level >= 0.8;
  const lodBias = massingOnly
    ? 2
    : Math.round(
      2 * (1 - ramp01(level, tuning.QUALITY_FLOOR, 0.8)),
    );
  const ink = level >= 0.55;
  const cullScale = grid(
    ramp01(level, tuning.QUALITY_FLOOR, 0.55),
  );

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
 * Translate policy names into the concrete settings a renderer should apply.
 * Callers may pass a full governor state or a numeric quality for previews.
 *
 * `fallback` is an instruction, not a cosmetic rung. When it becomes `plan2d`,
 * the product must render its canonical 2D plan; keeping a throttled canvas
 * mounted underneath would not satisfy the never-blank performance guarantee.
 *
 * @param {ReturnType<typeof createGovernorState>|number} stateOrQuality
 * @param {Record<string, number>} [tuning]
 * @returns {{
 *   quality: number,
 *   renderScale: number,
 *   lodBias: number,
 *   contactShadows: boolean,
 *   creaseInk: boolean,
 *   cullScale: number,
 *   massingOnly: boolean,
 *   fallback: 'scene3d'|'plan2d',
 * }}
 */
export function actuationPlanFor(
  stateOrQuality,
  tuning = GOVERNOR_TUNING,
) {
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
