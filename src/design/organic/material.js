/**
 * design/organic/material.js — THE MATERIAL LAYER's ink-bite edge weighting
 * (Deep Craft annex, Foundation addition 1; Organic Craft law §5/§8).
 *
 * INK-BITE is the letterpress tell: where a plate's edge meets the paper, the
 * ink gains slightly — the line's weight breathes instead of running CAD-even.
 * This module pre-bakes that weighting into plate-frame SVGs as pure geometry:
 * a closed frame whose outer and inner contours wobble a fraction of a pixel,
 * seeded per artifact (asymmetry with provenance — same seed ⇒ byte-identical
 * frame; the seeded-ornament golden discipline applies). NO filters, NO
 * feTurbulence, NO runtime randomness — a filled path with fill-rule="evenodd",
 * nothing more (reference 02-material-macro: TAKE ink sheen + edge weighting;
 * NEVER TAKE macro drama on working surfaces).
 *
 * Callers render the result aria-hidden behind/around plate content (decorative
 * contract, law §5). Token-definition file — lazy, never eager.
 */

import { INK } from './ink.js';
import { seededPicker } from './ornament/fnv.js';

/** What the material layer's marks mean (grammar doc, mirrors RULE_GRAMMAR). */
export const MATERIAL_GRAMMAR = Object.freeze({
  grain: 'paper tooth — an alpha overlay on grounds, never under body text at more than ~4% peak',
  inkBite: 'plate edge weighting — the pressed line breathes; frames read printed, not drawn by tool',
});

/** Public paths of the pre-baked grain tiles (scripts/gen-paper-grain.mjs). */
export const GRAIN_TILES = Object.freeze({
  light: '/textures/paper-grain-light.png',
  dim: '/textures/paper-grain-dim.png',
});

/**
 * One wobbled rectangular contour as an SVG path string. Points are sampled
 * every ~`step` units along the perimeter; each point is displaced along its
 * edge normal by a seeded fraction of `amp`. The contour closes cleanly.
 * @param {ReturnType<typeof seededPicker>} pick
 * @param {string} slot   decorrelates outer vs inner contour
 * @param {number} x @param {number} y @param {number} w @param {number} h
 * @param {number} amp    peak normal displacement (viewBox units)
 * @param {number} step   sample spacing (viewBox units)
 */
function wobbleRect(pick, slot, x, y, w, h, amp, step) {
  /** @type {Array<[number, number]>} */
  const pts = [];
  // Walk the four edges clockwise, sampling; normal points outward per edge.
  const edges = [
    { from: [x, y], to: [x + w, y], n: [0, -1] },          // top
    { from: [x + w, y], to: [x + w, y + h], n: [1, 0] },   // right
    { from: [x + w, y + h], to: [x, y + h], n: [0, 1] },   // bottom
    { from: [x, y + h], to: [x, y], n: [-1, 0] },          // left
  ];
  for (let e = 0; e < edges.length; e++) {
    const { from, to, n } = edges[e];
    const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const count = Math.max(2, Math.round(len / step));
    for (let i = 0; i < count; i++) {
      const t = i / count;
      // Corners stay pinned (d → 0 at edge ends) so the frame keeps its square.
      const cornerEase = Math.min(1, Math.min(t, 1 - t) * 4);
      const d = (pick.frac(`${slot}:e${e}:p${i}`) - 0.5) * 2 * amp * cornerEase;
      pts.push([
        from[0] + (to[0] - from[0]) * t + n[0] * d,
        from[1] + (to[1] - from[1]) * t + n[1] * d,
      ]);
    }
  }
  const d = pts
    .map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(2)} ${py.toFixed(2)}`)
    .join('');
  return `${d}Z`;
}

/**
 * Build a pre-baked ink-bite plate frame: a self-contained SVG whose border is
 * a filled evenodd ring (outer wobbled contour minus inner wobbled contour).
 * The wobble is sub-pixel-scale by default — felt, not seen.
 *
 * @param {object} [opts]
 * @param {string|number} [opts.seed]  provenance seed (settlement id, slug…)
 * @param {number} [opts.width]        viewBox width  (default 320)
 * @param {number} [opts.height]       viewBox height (default 200)
 * @param {number} [opts.weight]       nominal border weight in viewBox units (default 1.5)
 * @param {number} [opts.bite]         peak edge gain in viewBox units (default 0.9)
 * @param {string} [opts.ink]          ink override (default INK.strong)
 * @returns {string} a self-contained <svg> string (aria-hidden, presentation)
 */
export function inkBiteFrameSvg(opts = {}) {
  const {
    seed = 'unsealed', width = 320, height = 200, weight = 1.5, bite = 0.9,
    ink = INK.strong,
  } = opts;
  const pick = seededPicker(`ink-bite::${seed}`);
  const step = Math.max(10, Math.min(width, height) / 10);
  const outer = wobbleRect(pick, 'outer', 0.75, 0.75, width - 1.5, height - 1.5, bite / 2, step);
  const inner = wobbleRect(
    pick, 'inner',
    0.75 + weight, 0.75 + weight, width - 1.5 - weight * 2, height - 1.5 - weight * 2,
    bite, step,
  );
  return (
    `<svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" ` +
    `preserveAspectRatio="none" role="presentation" aria-hidden="true" focusable="false">` +
    `<path d="${outer}${inner}" fill="${ink}" fill-rule="evenodd"/></svg>`
  );
}
