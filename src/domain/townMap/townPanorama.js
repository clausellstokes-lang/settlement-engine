/**
 * domain/townMap/townPanorama.js — THE PANORAMA PROJECTION (task #38, RULING #5).
 *
 * A PROJECTION, not a style: it takes ANY town-map render model (v1 or v2) and casts
 * it as a slanted oblique/side-view "panorama" — pseudo-elevations extruded from the
 * flat 0..1000 plan into a 2.5D massing. Because it emits the SAME primitive draw-op
 * vocabulary as townMapDraw.js (poly / line / rect) and reads the SAME resolved style
 * palette, it COMPOSES WITH EVERY LENS (parchment / watercolor / dark-fantasy / VTT /
 * a future bespoke lens) — the lens paints, the projection re-poses. And because it
 * consumes the model (into which cosmetic mapEdits — pins, reroll, redraw-to-v2 — are
 * already baked), the WYSIWYG law holds: the panorama honors the same edits + the same
 * active lens the flat map shows.
 *
 * PSEUDO-ELEVATIONS are derived deterministically from tier / institution kind /
 * district category / wall data (no new inputs, no rng): a cathedral spire out-tops a
 * tenement, a keep out-tops a stall, the wall stands proud of the roofs. The oblique
 * transform is a trig-FREE cavalier projection: east-west (x) is preserved, north-
 * south (y, depth) is foreshortened by a fixed rational factor, elevation raises a
 * point up-screen. Same (model, style) ⇒ byte-identical ops (a golden can pin it).
 *
 * Purity-banned by the townMap domain source-scan: no Date, no Math.random, no
 * localeCompare, no trig. Any-cast baseline 0 for this file.
 */

import { resolveTownMapStyle, styleDistrictColor, DEFAULT_STYLE_ID } from '../../design/townMapStyles.js';
import { drawListToSvg } from './townMapDraw.js';

const VIEW = 1000;

/** @typedef {import('./townMapDraw.js').DrawOp} DrawOp */

// ── The oblique transform (cavalier: x preserved, depth foreshortened, elevation up) ──
const DEPTH = 0.6;        // north-south foreshorten (0<f<1) — the "slant"
const GROUND_TOP = 150;   // where map-y 0 lands on screen (leaves headroom for spires)
const ELEV_SCALE = 1;     // pseudo-elevation → up-screen pixels

/** Project a plan point (map x,y ∈ 0..1000) at pseudo-elevation `elev` to the oblique
 * screen space. Trig-free. @returns {{ x:number, y:number }} */
function project(x, y, elev) {
  return { x: Math.round(x), y: Math.round(GROUND_TOP + y * DEPTH - (elev || 0) * ELEV_SCALE) };
}

/** Category → roof-height multiplier: spires/keeps/towers stand tall, sheds squat. */
const CATEGORY_HEIGHT = Object.freeze({
  religious: 1.55, civic: 1.35, noble: 1.3, arcane: 1.4, military: 1.25,
  merchant: 1.0, craft: 0.9, foreign: 0.95, residential: 0.8, industrial: 0.85,
  criminal: 0.8, other: 0.9,
});

/** Pseudo-elevation of a landmark/fill building — tier scales the base, category the
 * silhouette. Deterministic in the model data (no rng). */
function buildingElevation(kind, tierIndex, category) {
  const base = kind === 'fill' ? 24 : 40 + tierIndex * 5;
  const mult = CATEGORY_HEIGHT[category] ?? 0.9;
  return Math.round(base * mult);
}

/** Wall silhouette height — readiness (wallWeight) makes a prouder rampart. */
function wallElevation(wallWeight) { return 34 + (wallWeight || 0) * 6; }

/**
 * Build the oblique panorama draw-op list for a model under a style. Same op
 * vocabulary as buildTownMapDrawList, so it renders through drawListToSvg / the PDF
 * plate / the viewer identically. PURE + deterministic.
 * @param {import('./townMapModel.js').TownMapModel | null | undefined} model
 * @param {string | object} [styleArg]
 * @returns {DrawOp[]}
 */
export function buildTownMapPanoramaDrawList(model, styleArg = DEFAULT_STYLE_ID) {
  /** @type {DrawOp[]} */
  const ops = [];
  if (!model || typeof model !== 'object') return ops;
  const style = resolveTownMapStyle(styleArg);
  const P = style.palette;
  const O = style.opacity;
  const S = style.stroke;

  const tier = model.meta && typeof model.meta.tier === 'string' ? model.meta.tier : 'town';
  const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const tierIndex = Math.max(0, TIERS.indexOf(tier));

  const frame = model.frame || { water: null, roads: [] };
  const districts = Array.isArray(model.districts) ? model.districts : [];
  const buildings = Array.isArray(model.buildings) ? model.buildings : [];
  const fortifications = model.fortifications || null;
  const overlays = model.overlays || { hazards: [], conditions: [] };
  // Nothing to draw (a degenerate map-less model) ⇒ no ops, exactly like the flat
  // hasDrawableMap self-gate — so a panorama view of an empty settlement stays empty.
  if (districts.length === 0 && buildings.length === 0) return ops;
  const categoryById = new Map(districts.map((d) => [d.id, d.category]));

  // ── (0) sky/ground split — a faint horizon band so the slant reads as a scene ──
  const horizon = project(500, 0, 0).y;
  ops.push({ t: 'rect', x: 0, y: horizon, w: VIEW, h: VIEW - horizon, fill: P.buildingFill, fillOpacity: 0.04 });

  // ── (1) water — flat at the back, foreshortened onto the ground plane ─────────
  if (frame.water && Array.isArray(frame.water.path)) {
    const pts = frame.water.path.map((p) => {
      const q = project(p[0], p[1], 0);
      return /** @type {[number,number]} */ ([q.x, q.y]);
    });
    if (frame.water.kind === 'coast') {
      const back = project(VIEW, VIEW, 0);
      const back0 = project(0, VIEW, 0);
      pts.push([back.x, back.y]);
      pts.push([back0.x, back0.y]);
      ops.push({ t: 'poly', pts, closed: true, fill: P.water, fillOpacity: O.waterFill, stroke: P.water, strokeOpacity: O.waterCoastStroke, strokeWidth: S.waterCoast });
    } else {
      ops.push({ t: 'poly', pts, closed: false, stroke: P.water, strokeOpacity: O.riverStroke, strokeWidth: S.river });
    }
  }

  // ── (2) roads + streets on the ground plane ───────────────────────────────────
  for (const r of (Array.isArray(frame.roads) ? frame.roads : [])) {
    const a = project(r.from[0], r.from[1], 0);
    const b = project(r.to[0], r.to[1], 0);
    ops.push({ t: 'line', x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: P.road, strokeOpacity: O.roadStroke, strokeWidth: S.roadBase + (r.weight || 0) });
  }
  const skeleton = model.skeleton || null;
  if (skeleton && Array.isArray(skeleton.streets)) {
    for (const st of skeleton.streets) {
      const a = project(st.from.x, st.from.y, 0);
      const b = project(st.to.x, st.to.y, 0);
      ops.push({ t: 'line', x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: P.street, strokeOpacity: O.streetStroke, strokeWidth: S.street });
    }
  }

  // ── (3) district ground patches — foreshortened plan polygons (subtle terracing) ─
  for (const d of districts) {
    const color = styleDistrictColor(d.category, style);
    const pts = d.polygon.map((p) => {
      const q = project(p[0], p[1], 0);
      return /** @type {[number,number]} */ ([q.x, q.y]);
    });
    ops.push({ t: 'poly', pts, closed: true, fill: color, fillOpacity: O.districtFill, stroke: color, strokeOpacity: O.districtStroke, strokeWidth: S.district });
  }

  // ── (4) fortifications — an extruded wall silhouette standing proud of the ground ─
  if (fortifications && Array.isArray(fortifications.walls) && fortifications.walls.length >= 2) {
    const hgt = wallElevation(fortifications.wallWeight);
    const w = fortifications.walls;
    for (let i = 0; i < w.length; i++) {
      const a = w[i];
      const b = w[(i + 1) % w.length];
      // A vertical quad: base segment a→b, top segment (a,b raised by hgt).
      const ab = project(a[0], a[1], 0);
      const bb = project(b[0], b[1], 0);
      const at = project(a[0], a[1], hgt);
      const bt = project(b[0], b[1], hgt);
      ops.push({ t: 'poly', pts: [[ab.x, ab.y], [bb.x, bb.y], [bt.x, bt.y], [at.x, at.y]], closed: true, fill: P.wall, fillOpacity: 0.5, stroke: P.wall, strokeOpacity: O.wallStroke, strokeWidth: S.wallBase });
    }
    for (const g of (Array.isArray(fortifications.gates) ? fortifications.gates : [])) {
      const gb = project(g.x, g.y, 0);
      ops.push({ t: 'circle', cx: gb.x, cy: gb.y, r: 7, fill: P.gate, stroke: P.ink, strokeWidth: S.gate });
    }
  }

  // ── (5) buildings — extruded prisms, PAINTER-SORTED far→near (low map-y first) ──
  const massed = buildings.slice().sort((a, b) => (a.position.y - b.position.y) || (a.anchorKey < b.anchorKey ? -1 : a.anchorKey > b.anchorKey ? 1 : 0));
  for (const bld of massed) {
    const category = categoryById.get(bld.districtId);
    const color = styleDistrictColor(category, style);
    const h = buildingElevation(bld.kind, tierIndex, category);
    const sz = bld.kind === 'fill' ? 6 : 9;
    const x = bld.position.x;
    const y = bld.position.y;
    // footprint corners NW,NE,SE,SW
    const baseSE = project(x + sz, y + sz, 0);
    const baseSW = project(x - sz, y + sz, 0);
    const baseNE = project(x + sz, y - sz, 0);
    const topSE = project(x + sz, y + sz, h);
    const topSW = project(x - sz, y + sz, h);
    const topNE = project(x + sz, y - sz, h);
    const topNW = project(x - sz, y - sz, h);
    // south (front) face
    ops.push({ t: 'poly', pts: [[baseSW.x, baseSW.y], [baseSE.x, baseSE.y], [topSE.x, topSE.y], [topSW.x, topSW.y]], closed: true, fill: P.buildingFill, fillOpacity: 1, stroke: P.ink, strokeOpacity: 0.55, strokeWidth: S.building });
    // east (side) face — a touch darker via the district tint for depth cueing
    ops.push({ t: 'poly', pts: [[baseSE.x, baseSE.y], [baseNE.x, baseNE.y], [topNE.x, topNE.y], [topSE.x, topSE.y]], closed: true, fill: color, fillOpacity: 0.32, stroke: P.ink, strokeOpacity: 0.45, strokeWidth: S.building });
    // roof (top face) — the category tint, so districts read from above
    ops.push({ t: 'poly', pts: [[topSW.x, topSW.y], [topSE.x, topSE.y], [topNE.x, topNE.y], [topNW.x, topNW.y]], closed: true, fill: color, fillOpacity: 0.7, stroke: P.ink, strokeOpacity: 0.5, strokeWidth: S.building });
  }

  // ── (6) hazard / condition markers — floated above their ground position ──────
  for (const c of (Array.isArray(overlays.conditions) ? overlays.conditions : [])) {
    if (c.districtId == null) continue;
    const d = districts.find((x) => x.id === c.districtId);
    if (!d) continue;
    const high = c.severityBand === 'severe' || c.severityBand === 'high' || c.severity >= 0.66;
    const p = project(d.centroid.x, d.centroid.y, 70);
    ops.push({ t: 'rect', x: p.x - 8, y: p.y - 8, w: 16, h: 16, rx: 4, fill: high ? P.hazardHighBg : P.hazardMidBg, stroke: high ? P.hazardHigh : P.hazardMid, strokeWidth: S.badge });
  }
  for (const hz of (Array.isArray(overlays.hazards) ? overlays.hazards : [])) {
    const high = hz.severityBand === 'severe' || hz.severityBand === 'high' || hz.severity >= 0.66;
    const p = project(hz.position.x, hz.position.y, 84);
    ops.push({ t: 'path', d: `M ${p.x} ${p.y - 9} L ${p.x + 8} ${p.y + 5} L ${p.x - 8} ${p.y + 5} Z`, fill: high ? P.hazardHighBg : P.hazardMidBg, stroke: high ? P.hazardHigh : P.hazardMid, strokeWidth: S.hazard });
  }

  return ops;
}

/**
 * Convenience: model → self-contained oblique-panorama SVG string under a style.
 * Same (model, style) ⇒ byte-identical SVG. Reuses the flat map's SVG serializer, so
 * the panorama inherits the self-contained / taint-free / theme-independent contract.
 * @param {import('./townMapModel.js').TownMapModel | null | undefined} model
 * @param {{ width?: number, height?: number, background?: string, style?: string|object }} [opts]
 * @returns {string}
 */
export function buildTownMapPanoramaSvg(model, opts = {}) {
  const style = resolveTownMapStyle(opts.style);
  return drawListToSvg(buildTownMapPanoramaDrawList(model, style), {
    width: opts.width, height: opts.height, background: opts.background, style,
  });
}
