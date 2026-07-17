/**
 * domain/interior/interiorDraw.js — the deterministic interior DRAW projection (DOOR 3).
 *
 * `buildInteriorDrawList(model, style)` turns a pure interior render model into an
 * ordered list of PRIMITIVE draw ops (numbers + hex color strings only — no React, no
 * DOM), exactly the townMapDraw.js posture, so the same two adapters consume it: the
 * SVG-string serializer below (for the standalone view + image export) and, later, a
 * react-pdf plate. GEOMETRY IS UNTOUCHED by the lens: every wall, room, and furnishing
 * comes from the model and is identical under every lens — a re-skin is a derived view,
 * (seed, style) → byte-identical ops (the cross-lens pin).
 *
 * THE STYLE LAYER GENERALIZES: an interior reads the SAME bounded town-map style
 * (design/townMapStyles.js) — no new lens, no new colors. The palette roles map onto the
 * interior scale: `buildingFill` = floor, `ink` = walls, the district tint of the
 * institution's KIND = room wash, `anchor`/`gate` = the door thresholds, the hazard roles
 * = the corruption rooms (evidence + the DM-only concealed chamber). All four base lenses
 * (parchment / watercolor / dark fantasy / VTT) resolve unchanged (the lens-application
 * pin). No raw color literal lives here — every color resolves from the style.
 *
 * DETERMINISM: pure function of (model, style); fixed op + key order ⇒ byte-identical
 * JSON + SVG across runs and machines. No Date / Math.random / localeCompare.
 */

import { resolveTownMapStyle, styleDistrictColor, DEFAULT_STYLE_ID } from '../../design/townMapStyles.js';

const VIEW = 1000;

/** interior KIND → the town-map district category whose style tint dresses its rooms.
 *  @type {Record<string, string>} */
const KIND_TINT_CATEGORY = Object.freeze({
  faith: 'religious', security: 'military', trade: 'merchant', craft: 'craft',
  learning: 'arcane', vice: 'criminal', civic: 'civic', generic: 'other',
});

/**
 * @typedef {{ t:'rect', x:number, y:number, w:number, h:number, rx?:number, fill?:string,
 *   fillOpacity?:number, stroke?:string, strokeWidth?:number, strokeOpacity?:number }} RectOp
 * @typedef {{ t:'line', x1:number, y1:number, x2:number, y2:number, stroke:string,
 *   strokeWidth:number, strokeOpacity?:number }} LineOp
 * @typedef {{ t:'circle', cx:number, cy:number, r:number, fill?:string, stroke?:string,
 *   strokeWidth?:number }} CircleOp
 * @typedef {RectOp|LineOp|CircleOp} DrawOp
 */

/**
 * Build the ordered interior draw-op list under a style. Z-order: floor → room washes
 * → furnishings → walls → door thresholds (walls on top of furnishing so the plan reads
 * as a hard shell). The model is drawn AS GIVEN — a public/export caller passes a
 * scrubbed model (toPublicSafeInterior), so covert geometry never reaches a public plate.
 * @param {import('./interiorModel.js').InteriorModel | null | undefined} model
 * @param {string | object} [styleArg]
 * @returns {DrawOp[]}
 */
export function buildInteriorDrawList(model, styleArg = DEFAULT_STYLE_ID) {
  /** @type {DrawOp[]} */
  const ops = [];
  if (!model || typeof model !== 'object') return ops;
  const style = resolveTownMapStyle(styleArg);
  const P = style.palette;
  const O = style.opacity;
  const S = style.stroke;
  const kindTint = styleDistrictColor(KIND_TINT_CATEGORY[model.meta?.kind || 'generic'] || 'other', style);

  const bounds = model.bounds || { x: 0, y: 0, w: 0, h: 0 };
  const rooms = Array.isArray(model.rooms) ? model.rooms : [];
  const walls = Array.isArray(model.walls) ? model.walls : [];
  const doors = Array.isArray(model.doors) ? model.doors : [];
  const furnishings = Array.isArray(model.furnishings) ? model.furnishings : [];

  // ── (0) floor slab ────────────────────────────────────────────────────────────
  ops.push({ t: 'rect', x: bounds.x, y: bounds.y, w: bounds.w, h: bounds.h, fill: P.buildingFill, stroke: P.ink, strokeWidth: S.building });

  // ── (1) room washes — the institution's KIND tint; corruption rooms wear hazard ──
  for (const r of rooms) {
    const corrupt = r.kind === 'evidence' || r.kind === 'concealed';
    const fill = corrupt ? P.hazardHighBg : kindTint;
    ops.push({ t: 'rect', x: r.x, y: r.y, w: r.w, h: r.h, fill, fillOpacity: O.districtFill, stroke: corrupt ? P.hazardHigh : fill, strokeWidth: S.district, strokeOpacity: O.districtStroke });
  }

  // ── (2) furnishings — a small square per typed piece, floor-tinted with an ink edge ──
  for (const f of furnishings) {
    const corrupt = f.covert === true;
    ops.push({ t: 'rect', x: f.x, y: f.y, w: f.w, h: f.h, rx: 2, fill: corrupt ? P.hazardHighBg : P.buildingFill, stroke: corrupt ? P.hazardHigh : P.ink, strokeWidth: S.building });
  }

  // ── (3) walls — the hard shell (literal geometry; UVTT walls the same segments) ──
  for (const w of walls) {
    const corrupt = w.covert === true;
    ops.push({ t: 'line', x1: w.x1, y1: w.y1, x2: w.x2, y2: w.y2, stroke: corrupt ? P.hazardHigh : P.wall, strokeWidth: S.wallBase + 1, strokeOpacity: O.wallStroke });
  }

  // ── (4) door thresholds — a short marker across the opening (anchor/gate tint) ──
  for (const d of doors) {
    ops.push({ t: 'line', x1: d.x1, y1: d.y1, x2: d.x2, y2: d.y2, stroke: d.kind === 'entrance' ? P.anchor : P.gate, strokeWidth: S.gate });
    if (d.kind === 'entrance') {
      const cx = Math.round((d.x1 + d.x2) / 2);
      const cy = Math.round((d.y1 + d.y2) / 2);
      ops.push({ t: 'circle', cx, cy, r: 5, fill: P.anchor, stroke: P.ink, strokeWidth: S.anchor });
    }
  }

  return ops;
}

/** XML/SVG-attribute-safe number (strip -0). @param {number} n */
function num(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '0';
  return String(v === 0 ? 0 : v);
}

/** Optional numeric SVG attribute (omitted when null/undefined). @param {string} name @param {number|undefined} v */
function optAttr(name, v) {
  return v != null ? ` ${name}="${num(v)}"` : '';
}

/** One draw op → an SVG element string. @param {DrawOp} op @returns {string} */
function opToSvg(op) {
  switch (op.t) {
    case 'line':
      return `<line x1="${num(op.x1)}" y1="${num(op.y1)}" x2="${num(op.x2)}" y2="${num(op.y2)}" stroke="${op.stroke}" stroke-width="${num(op.strokeWidth)}"${optAttr('stroke-opacity', op.strokeOpacity)} stroke-linecap="round"/>`;
    case 'circle': {
      const stroke = op.stroke ? ` stroke="${op.stroke}" stroke-width="${num(op.strokeWidth ?? 1)}"` : '';
      const fill = op.fill ? ` fill="${op.fill}"` : ' fill="none"';
      return `<circle cx="${num(op.cx)}" cy="${num(op.cy)}" r="${num(op.r)}"${fill}${stroke}/>`;
    }
    case 'rect': {
      const stroke = op.stroke ? ` stroke="${op.stroke}" stroke-width="${num(op.strokeWidth ?? 1)}"${optAttr('stroke-opacity', op.strokeOpacity)}` : '';
      const fill = op.fill ? ` fill="${op.fill}"${optAttr('fill-opacity', op.fillOpacity)}` : ' fill="none"';
      const rx = op.rx ? ` rx="${num(op.rx)}"` : '';
      return `<rect x="${num(op.x)}" y="${num(op.y)}" width="${num(op.w)}" height="${num(op.h)}"${rx}${fill}${stroke}/>`;
    }
    default:
      return '';
  }
}

/**
 * Render a draw-op list to a SELF-CONTAINED SVG string (no external refs, so a canvas
 * that draws it never taints). Pure + deterministic. The content lives in the 0..1000
 * viewBox; the background is the style's canvas color unless overridden.
 * @param {DrawOp[]} ops
 * @param {{ width?: number, height?: number, background?: string, style?: string|object }} [opts]
 * @returns {string}
 */
export function interiorDrawListToSvg(ops, opts = {}) {
  const w = opts.width || 640;
  const h = opts.height || 640;
  const bg = opts.background || resolveTownMapStyle(opts.style).background;
  const body = (Array.isArray(ops) ? ops : []).map(opToSvg).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${num(w)}" height="${num(h)}" viewBox="0 0 ${VIEW} ${VIEW}">`
    + `<rect x="0" y="0" width="${VIEW}" height="${VIEW}" fill="${bg}"/>`
    + body
    + '</svg>';
}

/**
 * Convenience: model → self-contained SVG string under a style. Same (model, style) ⇒
 * byte-identical SVG.
 * @param {import('./interiorModel.js').InteriorModel | null | undefined} model
 * @param {{ width?: number, height?: number, background?: string, style?: string|object }} [opts]
 * @returns {string}
 */
export function buildInteriorSvg(model, opts = {}) {
  const style = resolveTownMapStyle(opts.style);
  return interiorDrawListToSvg(buildInteriorDrawList(model, style), { width: opts.width, height: opts.height, background: opts.background, style });
}

/** Whether an interior model carries anything worth drawing (≥1 room OR ≥1 wall).
 *  @param {import('./interiorModel.js').InteriorModel | null | undefined} model @returns {boolean} */
export function hasDrawableInterior(model) {
  if (!model || typeof model !== 'object') return false;
  const rooms = Array.isArray(model.rooms) ? model.rooms : [];
  const walls = Array.isArray(model.walls) ? model.walls : [];
  return rooms.length > 0 || walls.length > 0;
}
