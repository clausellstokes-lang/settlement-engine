/**
 * design/organic/rules.js — THE RULE FAMILY (Organic Craft law §3).
 *
 * Rules carry grammar; weight and shape ARE meaning. A UI that assigns fixed
 * meanings to a small rule vocabulary can delete nearly all of its boxes:
 *
 *   hairline — subdivision guide (feint, receding: a row/sub-split marker)
 *   single   — section close
 *   double   — total / finality
 *   swelled  — HIATUS, not separation: the tapered "English rule" that "by its
 *              own graduation brings into harmony varying weights of type"
 *              (Peggy Lang, 1938). A scene-break / pause.
 *
 * Every rule is PRE-BAKED static SVG (law §8 — no runtime turbulence/filters, no
 * blend-modes). Straight rules stretch full-width with preserveAspectRatio="none"
 * over filled rects, so the stroke weight stays constant at any width; the swelled
 * rule keeps its tapered proportions (it is centered, not stretched). Pure string
 * builders — node-runnable (the golden generator) and React-wrappable (Rule.jsx).
 *
 * WHITESPACE FALLBACK (§3, the pilcrow→indent lesson): every structural mark
 * degrades to pure space. `RULE_FALLBACK_SPACE` is the space each variant may
 * collapse to; the React wrapper renders that gap instead of the SVG when asked.
 *
 * All marks are decorative: callers render them aria-hidden. Token-def file; lazy.
 */

import { INK } from './ink.js';

/** The rule vocabulary and its assigned meaning (the grammar this family speaks). */
export const RULE_GRAMMAR = Object.freeze({
  hairline: 'subdivision guide',
  single:   'section close',
  double:   'total / finality',
  swelled:  'hiatus / scene-break',
});

/** The whitespace each rule collapses to when a context is too dense/narrow (px). */
export const RULE_FALLBACK_SPACE = Object.freeze({ hairline: 8, single: 16, double: 24, swelled: 20 });

const W = 1000; // straight-rule viewBox width (stretched to 100% via preserveAspectRatio=none)

function straight(rects, viewH) {
  return `<svg viewBox="0 0 ${W} ${viewH}" preserveAspectRatio="none" width="100%" height="${viewH}" role="presentation" aria-hidden="true" focusable="false">${rects}</svg>`;
}
function rect(y, h, fill, opacity) {
  const op = opacity != null ? ` opacity="${opacity}"` : '';
  return `<rect x="0" y="${y}" width="${W}" height="${h}" fill="${fill}"${op}/>`;
}

/**
 * Build a rule's SVG string.
 * @param {'hairline'|'single'|'double'|'swelled'} variant
 * @param {{ ink?: string }} [opts]  ink override (defaults per variant)
 * @returns {string} a self-contained <svg>
 */
export function ruleSvg(variant, opts = {}) {
  switch (variant) {
    case 'hairline':
      // Feint, receding: 1px guide in the hairline tone.
      return straight(rect(0, 1, opts.ink || INK.hairline), 1);
    case 'single':
      // Section close: a single body-ink hairline-weight line.
      return straight(rect(0, 1.25, opts.ink || INK.body), 2);
    case 'double': {
      // Finality: two lines, a thin over a slightly heavier — the ledger "total" rule.
      const ink = opts.ink || INK.body;
      return straight(rect(0, 1, ink) + rect(3, 1.75, ink), 5);
    }
    case 'swelled': {
      // Hiatus: a symmetric tapered spindle — thin at both ends, swelling at center.
      const ink = opts.ink || INK.secondary;
      const vb = 260, h = 12, cx = vb / 2;
      const path = `M6 6 Q ${cx} 1.4 ${vb - 6} 6 Q ${cx} 10.6 6 6 Z`;
      const dot = `<circle cx="${cx}" cy="6" r="1.6" fill="${ink}"/>`;
      return `<svg viewBox="0 0 ${vb} ${h}" width="${vb}" height="${h}" role="presentation" aria-hidden="true" focusable="false"><path d="${path}" fill="${ink}"/>${dot}</svg>`;
    }
    default:
      throw new Error(`unknown rule variant: ${variant}`);
  }
}

/** The four variants, in grammar order. */
export const RULE_VARIANTS = Object.freeze(['hairline', 'single', 'double', 'swelled']);
