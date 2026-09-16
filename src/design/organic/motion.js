/**
 * design/organic/motion.js — THE MOTION GRAMMAR (Deep Craft annex, Foundation
 * addition 2). Twelve named behaviors, and nothing else, ever.
 *
 * Motion in this product is PAPER PHYSICS: documents lay down, leaves unfold,
 * ink darkens, a seal impresses. Nothing bounces, springs, or "fades in" for
 * free — a behavior exists because the material world it depicts has that
 * gesture. The vocabulary is CLOSED: a new behavior is a design-law change,
 * not a convenience (whimsy repeated becomes a system — law §5).
 *
 * TOKEN-PINNED: duration/easing values live in design/tokens.js (JS canonical),
 * are re-exported here beside the behavior grammar, and project to --oc-motion-*
 * / --oc-ease-* via organicCssVars → organicVars.css. The CSS classes in
 * organic.css consume ONLY those vars. tests/design/
 * organicMotion.test.js pins: all twelve class names exist, reduced-motion
 * collapses them to instant states, no duration exceeds 700ms, and keyframes
 * animate transform/opacity only (GPU-cheap, permanently).
 *
 * Behavior-definition bridge — lazy, never eager.
 */

import { MOTION_PRIMITIVES } from '../tokens.js';

/** Durations (ms). Ceiling 700 — pinned by test; raises are a law change. */
export const MOTION_DURATION = MOTION_PRIMITIVES.duration;

/** Easings. No overshoot anywhere (bounce/spring are BANNED — annex). */
export const MOTION_EASE = MOTION_PRIMITIVES.easing;

/**
 * The twelve behaviors: name → { className, means }. The className is the
 * single CSS spelling (organic.css); `means` is the grammar (what gesture of
 * the material world this is — and therefore where it may be used).
 */
export const MOTION_GRAMMAR = Object.freeze({
  layDown:     Object.freeze({ className: 'oc-m-laydown',     means: 'page arrival — the document is laid on the desk and settles' }),
  unfold:      Object.freeze({ className: 'oc-m-unfold',      means: 'panel reveal — a folded leaf opens from its crease' }),
  ruleDraw:    Object.freeze({ className: 'oc-m-ruledraw',    means: 'a rule draws itself once at first paint, left to right' }),
  inkDarken:   Object.freeze({ className: 'oc-m-inkdarken',   means: 'hover — ink darkens in place; never lift, never shadow' }),
  press:       Object.freeze({ className: 'oc-m-press',       means: 'instrument press — the control gives under the finger' }),
  slipIn:      Object.freeze({ className: 'oc-m-slipin',      means: 'a slip slid onto the desk edge — toasts, notes' }),
  pageTurn:    Object.freeze({ className: 'oc-m-pageturn',    means: 'almanac page-turn — the leaf pivots at its binding' }),
  impress:     Object.freeze({ className: 'oc-m-impress',     means: 'seal impress-once — weight arrives, sets, and is done' }),
  inkPulse:    Object.freeze({ className: 'oc-m-inkpulse',    means: 'medallion ink-pulse — one breath of ink acknowledges change' }),
  warmDim:     Object.freeze({ className: 'oc-m-warmdim',     means: 'modal ground — the room dims warm; the plate holds the light' }),
  draftSettle: Object.freeze({ className: 'oc-m-draftsettle', means: 'an AI draft settles onto the desk, tentative until stamped' }),
  tallyStrike: Object.freeze({ className: 'oc-m-tallystrike', means: 'a tally line struck through — done, counted' }),
});

/** The twelve class names, in grammar order (test + docs convenience). */
export const MOTION_CLASSES = Object.freeze(
  Object.values(MOTION_GRAMMAR).map((b) => b.className),
);
