/**
 * domain/townMap/townMapDraw.js — the deterministic town-map DRAW projection.
 *
 * `buildTownMapDrawList(model)` turns a pure `buildTownMapModel` render model
 * (SM-1, 0..1000 × 0..1000 vector space) into an ordered list of PRIMITIVE draw
 * ops — plain, structured-cloneable data (numbers + hex color strings only, no
 * React, no DOM, no react-pdf). Two thin adapters consume it:
 *   • `drawListToSvg(ops)`   → a self-contained SVG STRING (the library-card
 *     thumbnail rasterizes this via canvas — src/lib/townMapThumb.js);
 *   • the PDF plate (src/pdf/sections/TownMapPlate.jsx) maps each op to a
 *     react-pdf `Svg` primitive.
 *
 * Both export surfaces need CONCRETE colors (a CSS variable / theme token cannot
 * cross into a canvas raster or a react-pdf render), and a deterministic plate
 * demands the SAME bytes on every machine — so this module carries its own FIXED,
 * theme-INDEPENDENT `EXPORT_PALETTE`. The on-screen viewer keeps its theme-token
 * palette (components/townMap/palette.js); this is the print/raster twin, tuned
 * to hold on parchment. The map is view-time only — nothing here persists onto a
 * settlement, so the generator golden (sha256 over the settlement) is untouched.
 *
 * DETERMINISM: `buildTownMapDrawList` is a PURE function of the model (which is
 * itself a pure function of (settlement, mapEdits)). The op order + key insertion
 * order are fixed, so `JSON.stringify(buildTownMapDrawList(model))` and the SVG
 * string are byte-identical across runs and machines. Purity-banned exactly like
 * the model (the src/domain/townMap source-scan: no Date/Math.random/localeCompare).
 * Any-cast baseline 0 for this new file.
 */

// The fixed, theme-independent export color tokens live in the design-token layer
// (src/design/) — a canvas raster / react-pdf render needs concrete color and a
// deterministic plate needs machine-stable bytes, and literal color tokens belong
// in the sanctioned token zone (raw-color budget), not inline in this domain file.
import { EXPORT_PALETTE } from '../../design/townMapExportPalette.js';

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

/** District category → export tint (fallback: `other`). @param {string|null} [category] */
export function exportDistrictColor(category) {
  const key = typeof category === 'string' ? category : 'other';
  const dist = /** @type {Record<string, string>} */ (EXPORT_PALETTE.district);
  return dist[key] || dist.other;
}

/**
 * Build the ordered draw-op list for a town-map model. Shapes only (no text) — the
 * plate renders a layout legend beside the vector map, the thumbnail draws no
 * labels. Z-order mirrors the viewer (water → roads → streets → anchor → districts
 * → fortifications → building landmarks → condition badges → hazards).
 * @param {import('./townMapModel.js').TownMapModel | null | undefined} model
 * @returns {DrawOp[]}
 */
export function buildTownMapDrawList(model) {
  /** @type {DrawOp[]} */
  const ops = [];
  if (!model || typeof model !== 'object') return ops;

  const frame = model.frame || { water: null, roads: [] };
  const skeleton = model.skeleton || null;
  const districts = Array.isArray(model.districts) ? model.districts : [];
  const buildings = Array.isArray(model.buildings) ? model.buildings : [];
  const fortifications = model.fortifications || null;
  const overlays = model.overlays || { hazards: [], conditions: [] };

  // ── (1) water ───────────────────────────────────────────────────────────────
  if (frame.water && Array.isArray(frame.water.path)) {
    if (frame.water.kind === 'coast') {
      // The viewer closes the coast band down to the bottom corners.
      /** @type {Array<[number, number]>} */
      const pts = frame.water.path.map((p) => /** @type {[number, number]} */ ([p[0], p[1]]));
      pts.push([VIEW, VIEW]);
      pts.push([0, VIEW]);
      ops.push({ t: 'poly', pts, closed: true, fill: EXPORT_PALETTE.water, fillOpacity: 0.16, stroke: EXPORT_PALETTE.water, strokeOpacity: 0.5, strokeWidth: 2 });
    } else {
      ops.push({ t: 'poly', pts: frame.water.path.map((p) => [p[0], p[1]]), closed: false, stroke: EXPORT_PALETTE.water, strokeOpacity: 0.55, strokeWidth: 14 });
    }
  }

  // ── (2) approach roads ────────────────────────────────────────────────────────
  for (const r of (Array.isArray(frame.roads) ? frame.roads : [])) {
    ops.push({ t: 'line', x1: r.from[0], y1: r.from[1], x2: r.to[0], y2: r.to[1], stroke: EXPORT_PALETTE.road, strokeOpacity: 0.5, strokeWidth: 2 + (r.weight || 0) });
  }

  // ── (3) skeleton streets + anchor ─────────────────────────────────────────────
  if (skeleton) {
    for (const st of (Array.isArray(skeleton.streets) ? skeleton.streets : [])) {
      ops.push({ t: 'line', x1: st.from.x, y1: st.from.y, x2: st.to.x, y2: st.to.y, stroke: EXPORT_PALETTE.street, strokeOpacity: 0.55, strokeWidth: 3 });
    }
    if (skeleton.anchor) {
      ops.push({ t: 'circle', cx: skeleton.anchor.x, cy: skeleton.anchor.y, r: 8, fill: EXPORT_PALETTE.anchor, stroke: EXPORT_PALETTE.ink, strokeWidth: 1.5 });
    }
  }

  // Districts that carry an aggregate (lodging / mass-residential) fill accent.
  const fillDistrictIds = new Set();
  for (const b of buildings) if (b.kind === 'fill') fillDistrictIds.add(b.districtId);

  // ── (4) district polygons (+ aggregate fill accent) ───────────────────────────
  for (const d of districts) {
    const color = exportDistrictColor(d.category);
    ops.push({ t: 'poly', pts: d.polygon.map((p) => [p[0], p[1]]), closed: true, fill: color, fillOpacity: 0.14, stroke: color, strokeOpacity: 0.45, strokeWidth: 1.5 });
    if (fillDistrictIds.has(d.id)) {
      ops.push({ t: 'poly', pts: d.polygon.map((p) => [p[0], p[1]]), closed: true, fill: color, fillOpacity: 0.08 });
    }
  }

  // ── (5) fortifications ────────────────────────────────────────────────────────
  if (fortifications) {
    ops.push({ t: 'poly', pts: fortifications.walls.map((p) => [p[0], p[1]]), closed: true, stroke: EXPORT_PALETTE.wall, strokeOpacity: 0.8, strokeWidth: 1.5 + (fortifications.wallWeight || 0) });
    for (const g of (Array.isArray(fortifications.gates) ? fortifications.gates : [])) {
      ops.push({ t: 'circle', cx: g.x, cy: g.y, r: 7, fill: EXPORT_PALETTE.gate, stroke: EXPORT_PALETTE.ink, strokeWidth: 2 });
    }
  }

  // ── (6) building landmarks (fill buildings are the accent above) ──────────────
  const districtCategoryById = new Map(districts.map((d) => [d.id, d.category]));
  for (const b of buildings) {
    if (b.kind !== 'landmark') continue;
    const color = exportDistrictColor(districtCategoryById.get(b.districtId));
    const s = 8;
    ops.push({ t: 'rect', x: b.position.x - s, y: b.position.y - s, w: s * 2, h: s * 2, rx: 3, fill: EXPORT_PALETTE.buildingFill, stroke: color, strokeWidth: 1.5 });
  }

  // ── (7) condition badges (district-level, the living layer) ───────────────────
  const districtCentroidById = new Map(districts.map((d) => [d.id, d.centroid]));
  for (const c of (Array.isArray(overlays.conditions) ? overlays.conditions : [])) {
    if (c.districtId == null) continue;
    const centroid = districtCentroidById.get(c.districtId);
    if (!centroid) continue;
    const high = c.severityBand === 'severe' || c.severityBand === 'high' || c.severity >= 0.66;
    ops.push({ t: 'rect', x: centroid.x - 9, y: centroid.y - 9, w: 18, h: 18, rx: 4, fill: high ? EXPORT_PALETTE.hazardHighBg : EXPORT_PALETTE.hazardMidBg, stroke: high ? EXPORT_PALETTE.hazardHigh : EXPORT_PALETTE.hazardMid, strokeWidth: 1.5 });
    ops.push({ t: 'circle', cx: centroid.x, cy: centroid.y, r: 2.5, fill: high ? EXPORT_PALETTE.hazardHigh : EXPORT_PALETTE.hazardMid });
  }

  // ── (8) hazard markers ────────────────────────────────────────────────────────
  for (const h of (Array.isArray(overlays.hazards) ? overlays.hazards : [])) {
    const high = h.severityBand === 'severe' || h.severityBand === 'high' || h.severity >= 0.66;
    const px = h.position.x;
    const py = h.position.y;
    ops.push({ t: 'path', d: `M ${px} ${py - 10} L ${px + 9} ${py + 6} L ${px - 9} ${py + 6} Z`, fill: high ? EXPORT_PALETTE.hazardHighBg : EXPORT_PALETTE.hazardMidBg, stroke: high ? EXPORT_PALETTE.hazardHigh : EXPORT_PALETTE.hazardMid, strokeWidth: 1.5 });
    ops.push({ t: 'rect', x: px - 1, y: py - 4, w: 2, h: 5, fill: high ? EXPORT_PALETTE.hazardHigh : EXPORT_PALETTE.hazardMid });
    ops.push({ t: 'rect', x: px - 1, y: py + 2, w: 2, h: 2, fill: high ? EXPORT_PALETTE.hazardHigh : EXPORT_PALETTE.hazardMid });
  }

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
 * the rendered pixel box; the content always lives in the 0..1000 viewBox.
 * @param {DrawOp[]} ops
 * @param {{ width?: number, height?: number, background?: string }} [opts]
 * @returns {string}
 */
export function drawListToSvg(ops, opts = {}) {
  const w = opts.width || 320;
  const h = opts.height || 320;
  const bg = opts.background || EXPORT_PALETTE.parchment;
  const body = (Array.isArray(ops) ? ops : []).map(opToSvg).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${num(w)}" height="${num(h)}" viewBox="0 0 ${VIEW} ${VIEW}">`
    + `<rect x="0" y="0" width="${VIEW}" height="${VIEW}" fill="${bg}"/>`
    + body
    + '</svg>';
}

/**
 * Convenience: model → self-contained SVG string (drawList + drawListToSvg).
 * @param {import('./townMapModel.js').TownMapModel | null | undefined} model
 * @param {{ width?: number, height?: number, background?: string }} [opts]
 * @returns {string}
 */
export function buildTownMapSvg(model, opts = {}) {
  return drawListToSvg(buildTownMapDrawList(model), opts);
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
