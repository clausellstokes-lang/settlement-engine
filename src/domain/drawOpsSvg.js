/**
 * domain/drawOpsSvg.js — THE PRIMITIVE DRAW-OP VOCABULARY and its SVG adapter.
 *
 * A draw op is plain, structured-cloneable data (numbers + hex color strings only — no
 * React, no DOM, no react-pdf): five kinds, `poly | line | circle | rect | path`, laid out
 * in the shared 0..1000 × 0..1000 vector space (`VIEW`). Two adapters consume the same
 * list: `drawListToSvg(ops)` here → a self-contained SVG STRING, and the react-pdf plate,
 * which maps each op to an `Svg` primitive.
 *
 * WHY IT LIVES ALONE (§725/§748): the vocabulary and its serializer were defined inside
 * the legacy settlement-map draw projection, retired under ODQ §725/§772. They are
 * not a town-map concern — the RETAINED realm surface (domain/realmMap/realmPlateRenderer.js)
 * emits the same ops and serializes through the same function, so it had to import the
 * doomed town-map module to draw a realm. The vocabulary is now the shared leaf both
 * surfaces sit on; townMapDraw.js re-exports `drawListToSvg` and aliases `DrawOp`, so every
 * existing consumer of those names is byte-unmoved.
 *
 * DETERMINISM: pure — only string formatting and arithmetic (no Date / Math.random /
 * locale-sensitive compare). Same (ops, opts) ⇒ byte-identical SVG across runs + machines.
 * The emitted SVG is SELF-CONTAINED (no external refs), so a canvas that draws it never
 * taints — that is what makes the raster exports and the library-card thumbnail possible.
 */

// The style layer supplies the canvas background when the caller does not name one. Fixed,
// theme-independent hex (the sanctioned src/design token zone) — a canvas raster and a
// deterministic plate both need concrete, machine-stable color.
import { resolveTownMapStyle } from '../design/townMapStyles.js';

/**
 * @typedef {{ t:'poly', pts:Array<[number,number]>, closed:boolean, fill?:string,
 *   fillOpacity?:number, stroke?:string, strokeWidth?:number, strokeOpacity?:number }} PolyOp
 * @typedef {{ t:'line', x1:number, y1:number, x2:number, y2:number, stroke:string,
 *   strokeWidth:number, strokeOpacity?:number }} LineOp
 * @typedef {{ t:'circle', cx:number, cy:number, r:number, fill?:string, stroke?:string,
 *   strokeWidth?:number }} CircleOp
 * @typedef {{ t:'rect', x:number, y:number, w:number, h:number, rx?:number, fill?:string,
 *   fillOpacity?:number, stroke?:string, strokeWidth?:number }} RectOp
 * @typedef {{ t:'path', d:string, fill?:string, stroke?:string, strokeWidth?:number }} PathOp
 * @typedef {PolyOp|LineOp|CircleOp|RectOp|PathOp} DrawOp
 */

/** The shared draw-op coordinate space: every op lives in 0..VIEW on both axes. */
export const VIEW = 1000;

/** XML/SVG-attribute-safe number: strip a `-0`, keep integers/finite decimals.
 * @param {number} n */
function num(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '0';
  return String(v === 0 ? 0 : v);
}

/** Points-attribute string ("x,y x,y …"). @param {Array<[number,number]>} pts */
function ptsAttr(pts) {
  return pts.map(([x, y]) => `${num(x)},${num(y)}`).join(' ');
}

/** Optional numeric SVG attribute (` name="v"`), omitted when null/undefined.
 * @param {string} name @param {number|undefined} v */
function optAttr(name, v) {
  return v != null ? ` ${name}="${num(v)}"` : '';
}

/** One draw op → an SVG element string. @param {DrawOp} op */
function opToSvg(op) {
  switch (op.t) {
    case 'poly': {
      const stroke = op.stroke ? ` stroke="${op.stroke}" stroke-width="${num(op.strokeWidth ?? 1)}"${optAttr('stroke-opacity', op.strokeOpacity)}` : ' stroke="none"';
      const fill = op.fill ? ` fill="${op.fill}"${optAttr('fill-opacity', op.fillOpacity)}` : ' fill="none"';
      const tag = op.closed ? 'polygon' : 'polyline';
      const extra = op.closed ? '' : ' stroke-linecap="round" stroke-linejoin="round"';
      return `<${tag} points="${ptsAttr(op.pts)}"${fill}${stroke}${extra}/>`;
    }
    case 'line':
      return `<line x1="${num(op.x1)}" y1="${num(op.y1)}" x2="${num(op.x2)}" y2="${num(op.y2)}" stroke="${op.stroke}" stroke-width="${num(op.strokeWidth)}"${optAttr('stroke-opacity', op.strokeOpacity)} stroke-linecap="round"/>`;
    case 'circle': {
      const stroke = op.stroke ? ` stroke="${op.stroke}" stroke-width="${num(op.strokeWidth ?? 1)}"` : '';
      const fill = op.fill ? ` fill="${op.fill}"` : ' fill="none"';
      return `<circle cx="${num(op.cx)}" cy="${num(op.cy)}" r="${num(op.r)}"${fill}${stroke}/>`;
    }
    case 'rect': {
      const stroke = op.stroke ? ` stroke="${op.stroke}" stroke-width="${num(op.strokeWidth ?? 1)}"` : '';
      const fill = op.fill ? ` fill="${op.fill}"${optAttr('fill-opacity', op.fillOpacity)}` : ' fill="none"';
      const rx = op.rx ? ` rx="${num(op.rx)}"` : '';
      return `<rect x="${num(op.x)}" y="${num(op.y)}" width="${num(op.w)}" height="${num(op.h)}"${rx}${fill}${stroke}/>`;
    }
    case 'path': {
      const stroke = op.stroke ? ` stroke="${op.stroke}" stroke-width="${num(op.strokeWidth ?? 1)}"` : '';
      const fill = op.fill ? ` fill="${op.fill}"` : ' fill="none"';
      return `<path d="${op.d}"${fill}${stroke} stroke-linejoin="round"/>`;
    }
    default:
      return '';
  }
}

/**
 * Render a draw-op list to a SELF-CONTAINED SVG string (no external refs, so a
 * canvas that draws it never taints). Pure + deterministic. `width`/`height` set
 * the rendered pixel box; the content always lives in the 0..1000 viewBox. The
 * background is the style's canvas color unless an explicit `background` is given.
 * @param {DrawOp[]} ops
 * @param {{ width?: number, height?: number, background?: string, style?: string|object }} [opts]
 * @returns {string}
 */
export function drawListToSvg(ops, opts = {}) {
  const w = opts.width || 320;
  const h = opts.height || 320;
  const bg = opts.background || resolveTownMapStyle(opts.style).background;
  const body = (Array.isArray(ops) ? ops : []).map(opToSvg).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${num(w)}" height="${num(h)}" viewBox="0 0 ${VIEW} ${VIEW}">`
    + `<rect x="0" y="0" width="${VIEW}" height="${VIEW}" fill="${bg}"/>`
    + body
    + '</svg>';
}
