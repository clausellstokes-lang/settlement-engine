/**
 * design/townGlyphs/glyphCompiler.js — THE GLYPH COMPILER (THE ILLUSTRATED TOWN, IT-1).
 *
 * A glyph is DATA: a named list of primitive strokes in a LOCAL 0..1 × 0..1 box drawn
 * in OBLIQUE ELEVATION (front face + a hint of the receding side + the roofline — the
 * bird's-flight convention of Braun & Hogenberg / Speed). This compiler is a PURE
 * function that PLACES / SCALES / MIRRORS a glyph at a building's 0..1000 map position
 * and emits ONLY the existing five primitive draw ops (poly | line | circle | rect |
 * path — townMapDraw.js). LOAD-BEARING: glyphs COMPILE DOWN — no new op kind — so the
 * SVG string adapter, the react-pdf plate, the thumbnail, and the raster export render
 * them with zero adapter changes and no canvas taint (design §0.5).
 *
 * DEPTH, the surveyor's way — ONE fixed light (NW): each glyph emits a short ink-hatch
 * shadow group SE of the footprint at `style.opacity.shadow`. No gradients ever.
 *
 * DETERMINISM: only + − × ÷ and Math.round (no trig); every emitted coordinate is
 * rounded, so (glyph, position, style) → byte-identical ops across runs and machines,
 * exactly like the rest of the draw layer.
 */

/** The default footprint width (view units) of a landmark glyph. */
export const GLYPH_FOOTPRINT = 26;

/**
 * THE ONE FIXED LIGHT — NW. Shadows fall to the SE by this offset direction (dx,dy,
 * both positive ⇒ down-right on screen). The SINGLE source of the illustrated plane's
 * light: the glyph ink-hatch shadow (below), the ground-dress WALL SHADOWS, and the
 * landform-flank RELIEF hachures ALL read it, so nothing is ever lit from a second
 * direction (design §1, "the surveyor's way"). The magnitudes are per-glyph-footprint-
 * width for the hatch; consumers scale as they need. Freezing keeps it a shared const.
 */
export const SHADOW_DIR = Object.freeze({ dx: 0.16, dy: 0.14 });

/** @typedef {{ r: 'face'|'roof'|'ink'|'line', p: Array<[number, number]>, c?: boolean }
 *   | { r: 'circle', c: [number, number], rad: number }} GlyphStroke */
/** @typedef {{ hr?: number, strokes: GlyphStroke[] }} Glyph */

/** Round to 2 decimals for clean, cross-machine-stable stroke-width bytes. @param {number} n */
function w2(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Compile a glyph into primitive draw ops at a building position.
 * @param {{ glyph: Glyph|null|undefined, cx: number, cy: number, mirror?: boolean,
 *   footprint?: number, style: import('../townMapStyles.js').TownMapStyle, tint: string }} arg
 * @returns {import('../../domain/townMap/townMapDraw.js').DrawOp[]}
 */
export function compileGlyph({ glyph, cx, cy, mirror = false, footprint = GLYPH_FOOTPRINT, style, tint }) {
  /** @type {import('../../domain/townMap/townMapDraw.js').DrawOp[]} */
  const ops = [];
  if (!glyph || !Array.isArray(glyph.strokes)) return ops;
  const ink = style.palette.ink;
  const buildingFill = style.palette.buildingFill;
  const bw = style.stroke.building ?? 1.5;
  const shadowOpacity = style.opacity.shadow ?? 0.18;
  const roofFillOpacity = style.opacity.roofFill ?? 0.16;

  const W = footprint;
  const H = W * (glyph.hr || 1);
  const originX = cx - W / 2;
  // Ground line: a touch below the placed point so the glyph stands ON its position.
  const groundY = cy + Math.round(H * 0.3);
  /** local x (0..1, mirrored) → view x */
  const vx = (lx) => originX + (mirror ? 1 - lx : lx) * W;
  /** local y (0..1, 1 = ground) → view y (rises up-screen) */
  const vy = (ly) => groundY - (1 - ly) * H;

  // ── NW-light shadow: three short ink hatches fanning down-right from the base
  //    (SE of the footprint). Opacity from the bounded style.opacity.shadow. ──
  for (let i = 0; i < 3; i++) {
    const bx = originX + W * (0.36 + i * 0.22);
    ops.push({
      t: 'line',
      x1: Math.round(bx), y1: groundY,
      x2: Math.round(bx + W * SHADOW_DIR.dx), y2: Math.round(groundY + W * SHADOW_DIR.dy),
      stroke: ink, strokeWidth: w2(bw * 0.7), strokeOpacity: shadowOpacity,
    });
  }

  for (const st of glyph.strokes) {
    if (!st) continue;
    if (st.r === 'circle') {
      if (Array.isArray(st.c)) {
        ops.push({
          t: 'circle',
          cx: Math.round(vx(st.c[0])), cy: Math.round(vy(st.c[1])),
          r: Math.max(1, Math.round((st.rad || 0.1) * W)),
          stroke: ink, strokeWidth: bw,
        });
      }
      continue;
    }
    if (!Array.isArray(st.p) || st.p.length === 0) continue;
    /** @type {Array<[number, number]>} */
    const pts = st.p.map(([lx, ly]) => /** @type {[number, number]} */ ([Math.round(vx(lx)), Math.round(vy(ly))]));
    if (st.r === 'line') {
      ops.push({ t: 'line', x1: pts[0][0], y1: pts[0][1], x2: pts[1][0], y2: pts[1][1], stroke: ink, strokeWidth: w2(bw * 0.85) });
    } else if (st.r === 'face') {
      ops.push({ t: 'poly', pts, closed: true, fill: buildingFill, stroke: tint, strokeWidth: bw });
    } else if (st.r === 'roof') {
      ops.push({ t: 'poly', pts, closed: true, fill: tint, fillOpacity: roofFillOpacity, stroke: ink, strokeWidth: bw });
    } else if (st.r === 'ink') {
      ops.push({ t: 'poly', pts, closed: !!st.c, stroke: ink, strokeWidth: w2(bw * 0.85) });
    }
  }
  return ops;
}
