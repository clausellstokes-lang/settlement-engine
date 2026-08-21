/**
 * design/organic/fluidScale.js — FLUID TYPE + SPACE (Organic Craft law §4).
 *
 * "The interface is typography." A modular scale, set fluidly with clamp(), is
 * the cheapest strongest craft signal — book proportions that hold from a phone
 * to a wide monitor without a cascade of breakpoint overrides.
 *
 * THE MOBILE COMPRESSION (§4): the scale ratio COMPRESSES on small screens
 * (~1.414, √2) and OPENS UP on desktop (~1.618, φ). Concretely: the big display
 * type grows MUCH more from mobile→desktop than body type does, so on a phone the
 * hierarchy is tight and legible, and on a monitor it breathes. Every step is a
 * `clamp(min, fluid, max)` where the fluid middle interpolates linearly on the
 * viewport between 360px and 1240px; the fixed ends are in REM so a reader's zoom
 * is honoured. Space scales WITH type (same fluid idiom) so vertical rhythm holds.
 *
 * Reading tier is a workhorse serif ≥16px on a 45–90ch measure; display tier is
 * the period voice at ~24px+ only; UI tier is chrome that barely scales (compact
 * on every screen). These are SIZE tokens; the family + measure live in the CSS
 * layer (src/styles/organic.css). Token-definition file — lazy, nothing eager
 * imports it.
 */

const ROOT_PX = 16;        // 1rem
const MIN_VW = 360;        // fluid floor viewport
const MAX_VW = 1240;       // fluid ceiling viewport

/**
 * A fluid CSS `clamp()` string interpolating minPx→maxPx across MIN_VW→MAX_VW.
 * The middle term is `<intercept>rem + <slope>vw` (Utopia's linear form), so the
 * fixed ends respect user zoom. Deterministic (rounded to 4 decimals).
 * @param {number} minPx  size at MIN_VW
 * @param {number} maxPx  size at MAX_VW
 * @returns {string}
 */
export function fluid(minPx, maxPx) {
  const slope = (maxPx - minPx) / (MAX_VW - MIN_VW);      // px per px-viewport
  const interceptPx = minPx - slope * MIN_VW;             // px at vw=0
  const interceptRem = round(interceptPx / ROOT_PX);
  const slopeVw = round(slope * 100);
  const minRem = round(minPx / ROOT_PX);
  const maxRem = round(maxPx / ROOT_PX);
  return `clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem)`;
}

function round(n) { return Math.round(n * 1e4) / 1e4; }

/** step id → { min (mobile px), max (desktop px), clamp } */
function step(min, max) { return Object.freeze({ min, max, clamp: fluid(min, max) }); }

// ── TYPE scale ───────────────────────────────────────────────────────────────
// Mobile mins are a tight ~1.414 walk; desktop maxes an open ~1.618 walk — so the
// display steps carry a far larger mobile→desktop spread than the reading steps.
export const TYPE = Object.freeze({
  // Micro / chrome — barely scales (compact on every screen).
  eyebrow:   step(11, 12),    // uppercase micro-label / caption
  uiS:       step(12, 12.5),
  uiM:       step(13, 14),
  uiL:       step(14, 15),
  mono:      step(13, 13.5),

  // Reading tier — the workhorse serif (>=16px), gentle open.
  body:      step(16, 18),
  bodyLarge: step(17, 20),

  // Display tier — the period voice at 24px+ only; opens hard on desktop.
  displayS:  step(21, 27),
  displayM:  step(25, 36),
  displayL:  step(30, 50),
  displayXL: step(36, 68),
});

// ── SPACE scale — fluid, scales with the type (8-pt spine, opened fluidly) ─────
export const SPACE = Object.freeze({
  xs:   step(4, 5),
  sm:   step(8, 10),
  md:   step(12, 16),
  lg:   step(16, 22),
  xl:   step(22, 32),
  xxl:  step(30, 48),
  xxxl: step(44, 76),   // between-section rhythm — the decisive perceptual jump
});

/** The desktop/mobile spread of a step — the "how much this opens up" number. */
export const spread = (s) => s.max / s.min;
