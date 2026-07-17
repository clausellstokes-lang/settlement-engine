/**
 * domain/townMap/townMapDraw.js — the deterministic town-map DRAW projection.
 *
 * `buildTownMapDrawList(model, style)` turns a pure `buildTownMapModel` render model
 * (SM-1, 0..1000 × 0..1000 vector space) into an ordered list of PRIMITIVE draw
 * ops — plain, structured-cloneable data (numbers + hex color strings only, no
 * React, no DOM, no react-pdf). Two thin adapters consume it:
 *   • `drawListToSvg(ops)`   → a self-contained SVG STRING (the library-card
 *     thumbnail rasterizes this via canvas — src/lib/townMapThumb.js);
 *   • the PDF plate (src/pdf/sections/TownMapPlate.jsx) maps each op to a
 *     react-pdf `Svg` primitive.
 *
 * THE STYLE LAYER (MAP STYLES): every visual decision — palette, line weights, fill
 * opacities, decorative furniture (cartouche / compass / wash / grid / scale bar),
 * marker glyphs — is read from a BOUNDED style definition (src/design/townMapStyles.js),
 * NOT baked in here. GEOMETRY IS UNTOUCHED: every position, polygon, and element
 * size comes from the model and is identical under every lens, so a re-skin is a
 * derived view — (seed, style) → byte-identical ops, and a semantic mapEdit renders
 * correctly under every lens (the cross-lens edit pin). THE WALL: a style may only
 * select from the fixed renderer capabilities below (a hex, a number, a furniture
 * kind, a glyph name) — never arbitrary SVG/code, so worst case is ugly, never unsafe.
 * The default lens is `parchment`, whose output is byte-identical to the pre-style
 * export (pinned). Four named base lenses ship: parchment / watercolor / dark
 * fantasy / VTT; bespoke AI styles are a later wave (a style is data).
 *
 * Both export surfaces need CONCRETE colors (a CSS variable / theme token cannot
 * cross into a canvas raster or a react-pdf render), and a deterministic plate
 * demands the SAME bytes on every machine — so the style palettes are FIXED,
 * theme-INDEPENDENT hex (the sanctioned src/design token zone). The on-screen viewer
 * keeps its theme-token palette for the default lens (components/townMap/palette.js)
 * and reads the style palette for a chosen lens; this is the print/raster twin. The
 * map is view-time only — nothing here persists onto a settlement, so the generator
 * golden (sha256 over the settlement) is untouched.
 *
 * DETERMINISM: `buildTownMapDrawList` is a PURE function of (model, style). The op
 * order + key insertion order are fixed, so `JSON.stringify(buildTownMapDrawList(
 * model, style))` and the SVG string are byte-identical across runs and machines.
 * Purity-banned exactly like the model (the src/domain/townMap source-scan: no
 * Date/Math.random/localeCompare). Any-cast baseline 0 for this file.
 */

// The fixed, theme-independent export color tokens live in the design-token layer
// (src/design/) — a canvas raster / react-pdf render needs concrete color and a
// deterministic plate needs machine-stable bytes, and literal color tokens belong
// in the sanctioned token zone (raw-color budget), not inline in this domain file.
import { EXPORT_PALETTE } from '../../design/townMapExportPalette.js';
import { resolveTownMapStyle, styleDistrictColor, DEFAULT_STYLE_ID } from '../../design/townMapStyles.js';

export { EXPORT_PALETTE };

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

const VIEW = 1000;

/** District category → export tint under a style (fallback: `other`). Kept as the
 * legacy export helper (the PDF-plate legend imports it); delegates to the style
 * layer with the default lens so pre-style callers are byte-identical.
 * @param {string|null} [category] @param {string|object} [style] */
export function exportDistrictColor(category, style = DEFAULT_STYLE_ID) {
  return styleDistrictColor(category, style);
}

// ── Furniture emitters (THE WALL: every furniture kind draws from the primitive op
//    vocabulary — no arbitrary SVG). Deterministic fixed geometry in the 0..1000
//    view space; gated by `style.furniture`. Underlay furniture (grid) draws under
//    the map; overlay furniture (wash / cartouche / compass / scale bar) on top. ──

/** VTT coordinate grid — light lines every `gridStep` under the map. @param {DrawOp[]} ops @param {any} style */
function pushGrid(ops, style) {
  const step = style.functional.gridStep || 50;
  const ink = style.palette.ink;
  for (let x = step; x < VIEW; x += step) {
    ops.push({ t: 'line', x1: x, y1: 0, x2: x, y2: VIEW, stroke: ink, strokeOpacity: 0.14, strokeWidth: 0.75 });
  }
  for (let y = step; y < VIEW; y += step) {
    ops.push({ t: 'line', x1: 0, y1: y, x2: VIEW, y2: y, stroke: ink, strokeOpacity: 0.14, strokeWidth: 0.75 });
  }
}

/** Aged-paper wash — four faint translucent corner triangles. @param {DrawOp[]} ops @param {any} style */
function pushWash(ops, style) {
  const ink = style.palette.ink;
  const c = 190;
  /** @type {Array<Array<[number,number]>>} */
  const corners = [
    [[0, 0], [c, 0], [0, c]],
    [[VIEW, 0], [VIEW - c, 0], [VIEW, c]],
    [[0, VIEW], [c, VIEW], [0, VIEW - c]],
    [[VIEW, VIEW], [VIEW - c, VIEW], [VIEW, VIEW - c]],
  ];
  for (const pts of corners) ops.push({ t: 'poly', pts, closed: true, fill: ink, fillOpacity: 0.05 });
}

/** Cartouche neatline — a double inked border frame. @param {DrawOp[]} ops @param {any} style */
function pushCartouche(ops, style) {
  const ink = style.palette.ink;
  /** @param {number} a @param {number} w @param {number} o */
  const frame = (a, w, o) => ({
    t: 'poly',
    pts: /** @type {Array<[number,number]>} */ ([[a, a], [VIEW - a, a], [VIEW - a, VIEW - a], [a, VIEW - a]]),
    closed: true,
    stroke: ink,
    strokeOpacity: o,
    strokeWidth: w,
  });
  ops.push(frame(18, 3, 0.85));
  ops.push(frame(28, 1, 0.6));
}

/** Compass rose — a two-tone star in the lower-right corner. @param {DrawOp[]} ops @param {any} style */
function pushCompass(ops, style) {
  const ink = style.palette.ink;
  const gold = style.palette.anchor;
  const cx = 892;
  const cy = 892;
  const r = 62;
  ops.push({ t: 'circle', cx, cy, r, stroke: ink, strokeWidth: 1.5 });
  ops.push({ t: 'circle', cx, cy, r: r - 8, stroke: ink, strokeWidth: 0.75 });
  // N–S spike (gold) and E–W spike (ink), thin diamonds crossing the ring.
  ops.push({ t: 'path', d: `M ${cx} ${cy - r} L ${cx + 9} ${cy} L ${cx} ${cy + r} L ${cx - 9} ${cy} Z`, fill: gold, stroke: ink, strokeWidth: 0.75 });
  ops.push({ t: 'path', d: `M ${cx - r} ${cy} L ${cx} ${cy + 9} L ${cx + r} ${cy} L ${cx} ${cy - 9} Z`, fill: ink });
  ops.push({ t: 'circle', cx, cy, r: 4, fill: gold, stroke: ink, strokeWidth: 0.75 });
}

/** Scale bar — a five-segment alternating bar, lower-left. @param {DrawOp[]} ops @param {any} style */
function pushScaleBar(ops, style) {
  const ink = style.palette.ink;
  const fill = style.palette.buildingFill;
  const x0 = 60;
  const y0 = 946;
  const seg = 44;
  const h = 9;
  for (let i = 0; i < 5; i++) {
    ops.push({ t: 'rect', x: x0 + i * seg, y: y0, w: seg, h, fill: i % 2 === 0 ? ink : fill, stroke: ink, strokeWidth: 1 });
  }
}

/**
 * Build the ordered draw-op list for a town-map model under a style. Shapes only
 * (no text) — the plate renders a layout legend beside the vector map, the
 * thumbnail draws no labels. Z-order mirrors the viewer (grid → water → roads →
 * streets → anchor → districts → fortifications → building landmarks → condition
 * badges → hazards → overlay furniture).
 * @param {import('./townMapModel.js').TownMapModel | null | undefined} model
 * @param {string | object} [styleArg]  a style id ('parchment'…'vtt') or a resolved style
 * @returns {DrawOp[]}
 */
export function buildTownMapDrawList(model, styleArg = DEFAULT_STYLE_ID) {
  /** @type {DrawOp[]} */
  const ops = [];
  if (!model || typeof model !== 'object') return ops;

  const style = resolveTownMapStyle(styleArg);
  const P = style.palette;
  const O = style.opacity;
  const S = style.stroke;
  const fur = style.furniture;

  const frame = model.frame || { water: null, roads: [] };
  const skeleton = model.skeleton || null;
  const districts = Array.isArray(model.districts) ? model.districts : [];
  const buildings = Array.isArray(model.buildings) ? model.buildings : [];
  const fortifications = model.fortifications || null;
  const overlays = model.overlays || { hazards: [], conditions: [] };

  // ── (0) underlay furniture (grid draws beneath the map) ───────────────────────
  if (fur.includes('grid')) pushGrid(ops, style);

  // ── (1) water ───────────────────────────────────────────────────────────────
  if (frame.water && Array.isArray(frame.water.path)) {
    if (frame.water.kind === 'coast') {
      // The viewer closes the coast band down to the bottom corners.
      /** @type {Array<[number, number]>} */
      const pts = frame.water.path.map((p) => /** @type {[number, number]} */ ([p[0], p[1]]));
      pts.push([VIEW, VIEW]);
      pts.push([0, VIEW]);
      ops.push({ t: 'poly', pts, closed: true, fill: P.water, fillOpacity: O.waterFill, stroke: P.water, strokeOpacity: O.waterCoastStroke, strokeWidth: S.waterCoast });
    } else {
      ops.push({ t: 'poly', pts: frame.water.path.map((p) => [p[0], p[1]]), closed: false, stroke: P.water, strokeOpacity: O.riverStroke, strokeWidth: S.river });
    }
  }

  // ── (2) approach roads ────────────────────────────────────────────────────────
  for (const r of (Array.isArray(frame.roads) ? frame.roads : [])) {
    ops.push({ t: 'line', x1: r.from[0], y1: r.from[1], x2: r.to[0], y2: r.to[1], stroke: P.road, strokeOpacity: O.roadStroke, strokeWidth: S.roadBase + (r.weight || 0) });
  }

  // ── (3) skeleton streets + anchor ─────────────────────────────────────────────
  if (skeleton) {
    for (const st of (Array.isArray(skeleton.streets) ? skeleton.streets : [])) {
      ops.push({ t: 'line', x1: st.from.x, y1: st.from.y, x2: st.to.x, y2: st.to.y, stroke: P.street, strokeOpacity: O.streetStroke, strokeWidth: S.street });
    }
    if (skeleton.anchor) {
      ops.push({ t: 'circle', cx: skeleton.anchor.x, cy: skeleton.anchor.y, r: 8, fill: P.anchor, stroke: P.ink, strokeWidth: S.anchor });
    }
  }

  // Districts that carry an aggregate (lodging / mass-residential) fill accent.
  const fillDistrictIds = new Set();
  for (const b of buildings) if (b.kind === 'fill') fillDistrictIds.add(b.districtId);

  // ── (4) district polygons (+ aggregate fill accent) ───────────────────────────
  for (const d of districts) {
    const color = styleDistrictColor(d.category, style);
    ops.push({ t: 'poly', pts: d.polygon.map((p) => [p[0], p[1]]), closed: true, fill: color, fillOpacity: O.districtFill, stroke: color, strokeOpacity: O.districtStroke, strokeWidth: S.district });
    if (fillDistrictIds.has(d.id)) {
      ops.push({ t: 'poly', pts: d.polygon.map((p) => [p[0], p[1]]), closed: true, fill: color, fillOpacity: O.districtAccent });
    }
  }

  // ── (5) fortifications ────────────────────────────────────────────────────────
  if (fortifications) {
    ops.push({ t: 'poly', pts: fortifications.walls.map((p) => [p[0], p[1]]), closed: true, stroke: P.wall, strokeOpacity: O.wallStroke, strokeWidth: S.wallBase + (fortifications.wallWeight || 0) });
    for (const g of (Array.isArray(fortifications.gates) ? fortifications.gates : [])) {
      ops.push({ t: 'circle', cx: g.x, cy: g.y, r: 7, fill: P.gate, stroke: P.ink, strokeWidth: S.gate });
    }
  }

  // ── (6) building landmarks (fill buildings are the accent above) ──────────────
  const districtCategoryById = new Map(districts.map((d) => [d.id, d.category]));
  for (const b of buildings) {
    if (b.kind !== 'landmark') continue;
    const color = styleDistrictColor(districtCategoryById.get(b.districtId), style);
    const s = 8;
    ops.push({ t: 'rect', x: b.position.x - s, y: b.position.y - s, w: s * 2, h: s * 2, rx: 3, fill: P.buildingFill, stroke: color, strokeWidth: S.building });
  }

  // ── (7) condition badges (district-level, the living layer) ───────────────────
  const districtCentroidById = new Map(districts.map((d) => [d.id, d.centroid]));
  for (const c of (Array.isArray(overlays.conditions) ? overlays.conditions : [])) {
    if (c.districtId == null) continue;
    const centroid = districtCentroidById.get(c.districtId);
    if (!centroid) continue;
    const high = c.severityBand === 'severe' || c.severityBand === 'high' || c.severity >= 0.66;
    ops.push({ t: 'rect', x: centroid.x - 9, y: centroid.y - 9, w: 18, h: 18, rx: 4, fill: high ? P.hazardHighBg : P.hazardMidBg, stroke: high ? P.hazardHigh : P.hazardMid, strokeWidth: S.badge });
    ops.push({ t: 'circle', cx: centroid.x, cy: centroid.y, r: 2.5, fill: high ? P.hazardHigh : P.hazardMid });
  }

  // ── (8) hazard markers ────────────────────────────────────────────────────────
  for (const h of (Array.isArray(overlays.hazards) ? overlays.hazards : [])) {
    const high = h.severityBand === 'severe' || h.severityBand === 'high' || h.severity >= 0.66;
    const px = h.position.x;
    const py = h.position.y;
    ops.push({ t: 'path', d: `M ${px} ${py - 10} L ${px + 9} ${py + 6} L ${px - 9} ${py + 6} Z`, fill: high ? P.hazardHighBg : P.hazardMidBg, stroke: high ? P.hazardHigh : P.hazardMid, strokeWidth: S.hazard });
    ops.push({ t: 'rect', x: px - 1, y: py - 4, w: 2, h: 5, fill: high ? P.hazardHigh : P.hazardMid });
    ops.push({ t: 'rect', x: px - 1, y: py + 2, w: 2, h: 2, fill: high ? P.hazardHigh : P.hazardMid });
  }

  // ── (9) overlay furniture (drawn on top of the map) ───────────────────────────
  if (fur.includes('wash')) pushWash(ops, style);
  if (fur.includes('cartouche')) pushCartouche(ops, style);
  if (fur.includes('compass')) pushCompass(ops, style);
  if (fur.includes('scaleBar')) pushScaleBar(ops, style);

  return ops;
}

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

/**
 * Convenience: model → self-contained SVG string (drawList + drawListToSvg) under a
 * style. Same (model, style) ⇒ byte-identical SVG.
 * @param {import('./townMapModel.js').TownMapModel | null | undefined} model
 * @param {{ width?: number, height?: number, background?: string, style?: string|object }} [opts]
 * @returns {string}
 */
export function buildTownMapSvg(model, opts = {}) {
  const style = resolveTownMapStyle(opts.style);
  return drawListToSvg(buildTownMapDrawList(model, style), { width: opts.width, height: opts.height, background: opts.background, style });
}

/**
 * Whether a model carries anything worth drawing (≥1 district OR ≥1 building).
 * The export self-gate: a degenerate map-less settlement ⇒ no plate/thumb, so
 * legacy exports stay byte-identical (design §6, the FaithWar off-state law).
 * @param {import('./townMapModel.js').TownMapModel | null | undefined} model
 * @returns {boolean}
 */
export function hasDrawableMap(model) {
  if (!model || typeof model !== 'object') return false;
  const districts = Array.isArray(model.districts) ? model.districts : [];
  const buildings = Array.isArray(model.buildings) ? model.buildings : [];
  return districts.length > 0 || buildings.length > 0;
}
