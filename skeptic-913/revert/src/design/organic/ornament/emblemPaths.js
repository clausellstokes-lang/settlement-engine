/**
 * design/organic/ornament/emblemPaths.js — STRUCTURED EMBLEM GEOMETRY (V-27c).
 *
 * The 8 house emblems in pools.js expose their geometry ONLY as `draw(p)` SVG
 * STRING fragments — perfect for the DOM (`dangerouslySetInnerHTML`), impossible
 * for @react-pdf, which mounts a React element tree of <Svg>/<Path>/<Circle>, not
 * markup strings. That is exactly why the settlement COUNTERSEAL was web-only and
 * absent from the PDF (the recorded seam in pdf/primitives/HouseDeviceSeal.jsx).
 *
 * This module is the structured-path half of the seam: the SAME hand-authored
 * path/circle geometry, keyed by emblem name, as react-pdf-renderable primitives.
 *
 *   role 'stroke' → drawn with the emblem stroke (fill none, round caps/joins,
 *                   width `w` default 2) — matches pools.js `S(p)`.
 *   role 'fill'   → filled with the ink, no stroke — matches the bare `<circle
 *                   fill="${p.line}"/>` the tower emblem draws outside its group.
 *
 * SINGLE VISUAL SOURCE stays pools.js `draw()` (the web renders it byte-identical,
 * untouched — its golden family is unmoved). This is a MIRROR, not a re-derivation:
 * tests/pdf/countersealStructuredPath.test.js walks each `draw(p)` string, extracts
 * its path `d`s + circle coords, and fails if this table ever drifts from it.
 * Viewbox is the emblems' native 48×48.
 */

export const EMBLEM_VIEWBOX = 48;

export const EMBLEM_PATHS = Object.freeze({
  // watch — tower (3 stroke paths + 1 filled window dot)
  tower: Object.freeze([
    { el: 'path', role: 'stroke', d: 'M17 41 L17 19 L31 19 L31 41' },
    { el: 'path', role: 'stroke', d: 'M15 19 L15 13 L18 13 L18 16 L21 16 L21 13 L27 13 L27 16 L30 16 L30 13 L33 13 L33 19' },
    { el: 'path', role: 'stroke', d: 'M21 41 L21 31 Q24 27.5 27 31 L27 41' },
    { el: 'circle', role: 'fill', cx: 24, cy: 24.5, r: 1.5 },
  ]),
  // craft — anvil (2 stroke paths)
  anvil: Object.freeze([
    { el: 'path', role: 'stroke', d: 'M13 22 L33 22 L33 25 Q28 27 24 26 L24 30 L30 30 L28 35 L18 35 L20 30 L21 30 L21 24 Q16 24 13 22 Z' },
    { el: 'path', role: 'stroke', d: 'M11 22 L15 22' },
  ]),
  // field — sheaf (7 stroke paths)
  sheaf: Object.freeze([
    { el: 'path', role: 'stroke', d: 'M24 34 L24 15' },
    { el: 'path', role: 'stroke', d: 'M24 34 L18 17' },
    { el: 'path', role: 'stroke', d: 'M24 34 L30 17' },
    { el: 'path', role: 'stroke', d: 'M24 34 L14 22' },
    { el: 'path', role: 'stroke', d: 'M24 34 L34 22' },
    { el: 'path', role: 'stroke', d: 'M17 34 Q24 31 31 34' },
    { el: 'path', role: 'stroke', d: 'M17 37 Q24 34 31 37' },
  ]),
  // water — wave (3 stroke paths)
  wave: Object.freeze([
    { el: 'path', role: 'stroke', d: 'M13 20 Q18 15 24 20 T35 20' },
    { el: 'path', role: 'stroke', d: 'M13 26 Q18 21 24 26 T35 26' },
    { el: 'path', role: 'stroke', d: 'M13 32 Q18 27 24 32 T35 32' },
  ]),
  // mine — pick (3 stroke paths)
  pick: Object.freeze([
    { el: 'path', role: 'stroke', d: 'M15 18 Q24 12 33 18' },
    { el: 'path', role: 'stroke', d: 'M24 15 L24 37' },
    { el: 'path', role: 'stroke', d: 'M20 33 L28 33' },
  ]),
  // faith — chalice (3 stroke paths)
  chalice: Object.freeze([
    { el: 'path', role: 'stroke', d: 'M16 16 L32 16 Q31 27 24 28 Q17 27 16 16 Z' },
    { el: 'path', role: 'stroke', d: 'M24 28 L24 35' },
    { el: 'path', role: 'stroke', d: 'M18 37 L30 37' },
  ]),
  // trade — coin (2 stroke circles + 1 stroke cross)
  coin: Object.freeze([
    { el: 'circle', role: 'stroke', cx: 24, cy: 24, r: 10 },
    { el: 'circle', role: 'stroke', cx: 24, cy: 24, r: 5.5 },
    { el: 'path', role: 'stroke', d: 'M24 20 L24 28 M20 24 L28 24' },
  ]),
  // wild — oak (3 stroke paths)
  oak: Object.freeze([
    { el: 'path', role: 'stroke', d: 'M24 40 L24 27' },
    { el: 'path', role: 'stroke', d: 'M18 40 Q24 36 30 40' },
    { el: 'path', role: 'stroke', d: 'M24 27 Q13 25 15 17 Q15 10 24 12 Q33 10 33 17 Q35 25 24 27 Z' },
  ]),
});
