/**
 * realmMap/realmPlateRenderer.js — THE DETERMINISTIC REALM RENDERER (the walk order's
 * "home crossroad image becomes a generated realm map with settlements"; W7, manager-
 * authorized under the owner order, mechanism recorded vetoable below).
 *
 * WHY THIS EXISTS. There is NO headless realm renderer in the tree (W4 proved it): the
 * only realm geography is the FMG iframe (public/map/), which is non-deterministic
 * (sf-bridge.js mints ids with Date.now/Math.random) and unreachable outside a browser.
 * `domain/instantWorld/worldPlan.js` already derives a PURE, deterministic settlement
 * plan (seeded sites · tiers · map kind) — but it carries no terrain, no drawing. This
 * module is the missing pure projection: worldPlan → an ordered list of the SAME
 * PRIMITIVE draw-op vocabulary the town map speaks (poly / line / circle / rect / path,
 * townMapDraw.js) → a self-contained SVG via `drawListToSvg`. It NEVER emits SVG itself
 * (no parallel serializer) and reads the SAME resolved style palette the town lenses use
 * (resolveTownMapStyle), so a realm plate is a house-consistent derived view.
 *
 * WHAT IT COMPOSES, bottom→top:
 *   (1) LANDMASS   — a seeded coastline polygon sized to ENCLOSE every worldPlan site
 *                    (no settlement is ever stranded in the sea), its irregularity keyed
 *                    off the seed + the plan's mapKind; a faint land wash under an inked
 *                    coast, ringed by concentric sea-lines (the classic chart idiom).
 *   (2) RELIEF     — a few seeded interior mountain carets for the mountainous map kinds
 *                    (highIsland / volcano / pangea), drawn in the landform ink register.
 *   (3) ROADS      — worldPlan carries NO connectivity, so the realm's road web is a
 *                    deterministic Euclidean minimum spanning tree over the sites
 *                    (JUDGMENT below, vetoable) — one honest lattice, never crossing water.
 *   (4) MARKERS    — one settlement glyph per site, SCALED + shaped by tier (a metropolis
 *                    out-rings a thorp), built from the primitive op vocabulary.
 *   (5) FURNITURE  — the house signature (double neatline cartouche + compass rose),
 *                    composed for the wide realm sheet (the town furniture assumes a
 *                    square; this re-poses the same geometry).
 *
 * DETERMINISM / PURITY. Same (seed, basicConfig, styleId) ⇒ byte-identical SVG. Seeded
 * off the plan via createPRNG; NO Date, NO Math.random, NO localeCompare, NO trig, NO `**`
 * — the src/domain/townMap purity idiom (only + − × ÷ and Math.round/min/max/abs/sqrt,
 * all correctly-rounded IEEE-754). Coastline direction is read from a FROZEN authored
 * unit-vector table (UNIT_DIRS) so no runtime trig is ever needed. Every coordinate is
 * rounded ⇒ cross-machine-stable bytes. Store-free / generator-free / React-free (it
 * stays inside the pure headless spine, so none of the four domain ratchets fire).
 *
 * LAZY. Imported by NOTHING eager — only the generator script (scripts/generate-realm-
 * preview.mjs) and tests. The realm previews are frozen static assets under
 * public/landing-maps/, consumed as <img> exactly like the town plates, so the first-
 * paint static closure is unmoved.
 */

import { createPRNG } from '../../kernel/prng.js';
import { resolveTownMapStyle, DEFAULT_STYLE_ID } from '../../design/townMapStyles.js';
import { drawListToSvg } from '../townMap/townMapDraw.js';
import { deriveWorldPlan } from '../instantWorld/worldPlan.js';

/** @typedef {import('../townMap/townMapDraw.js').DrawOp} DrawOp */
/** @typedef {import('../instantWorld/worldPlan.js').deriveWorldPlan} DeriveWorldPlan */

// The realm sheet — a wide landing-hero band inside the town map's 0..1000 x-space (so
// drawListToSvg's fixed 1000-wide viewBox is reused; the height band is cropped in by a
// viewBox/background rewrite, the same crop idiom generate-landing-map-plates.mjs uses).
const SHEET_W = 1000;
const SHEET_H = 560;
// worldPlan scatters sites in a 1000 x 600 map-pixel box; its x shares the 1000 sheet
// width (passes through), and its y is scaled into the shorter hero band.
const PLAN_H = 600;
const Y_SCALE = SHEET_H / PLAN_H;

/** Round to whole units (SVG-attribute-stable bytes). @param {number} n */
const R = (n) => Math.round(n);
/** Round to 2 decimals (stable opacity/weight serialization). @param {number} n */
const R2 = (n) => Math.round(n * 100) / 100;

/**
 * FROZEN unit direction vectors (24 evenly-spaced compass rays), authored as literals so
 * the coastline needs ZERO runtime trig (the purity idiom). cos/sin were evaluated once at
 * authoring time; here they are plain data, like a glyph path.
 * @type {ReadonlyArray<readonly [number, number]>}
 */
const UNIT_DIRS = Object.freeze([
  [1, 0], [0.9659, 0.2588], [0.866, 0.5], [0.7071, 0.7071],
  [0.5, 0.866], [0.2588, 0.9659], [0, 1], [-0.2588, 0.9659],
  [-0.5, 0.866], [-0.7071, 0.7071], [-0.866, 0.5], [-0.9659, 0.2588],
  [-1, 0], [-0.9659, -0.2588], [-0.866, -0.5], [-0.7071, -0.7071],
  [-0.5, -0.866], [-0.2588, -0.9659], [0, -1], [0.2588, -0.9659],
  [0.5, -0.866], [0.7071, -0.7071], [0.866, -0.5], [0.9659, -0.2588],
]);

// Half-diagonal unit component (√2⁄2), authored — used for the 4-point marker stars so
// their diagonal arms need no trig either.
const DIAG = 0.7071;

/** Per-map-kind coastline character: `rough` = jitter amplitude on the enclosing radius,
 * `mounts` = interior relief carets to seed. Keyed on worldPlan's resolved mapKind.
 * @type {Readonly<Record<string, { rough: number, mounts: number }>>} */
const KIND_TERRAIN = Object.freeze({
  highIsland: { rough: 0.28, mounts: 4 },
  volcano: { rough: 0.24, mounts: 3 },
  lowIsland: { rough: 0.16, mounts: 1 },
  peninsula: { rough: 0.22, mounts: 2 },
  pangea: { rough: 0.12, mounts: 3 },
  atoll: { rough: 0.34, mounts: 0 },
  sfArchipelago: { rough: 0.3, mounts: 1 },
});
const DEFAULT_TERRAIN = Object.freeze({ rough: 0.2, mounts: 2 });

// Ordered tier ladder (largest → smallest) — the marker scale index. Mirrors worldPlan's
// TIER vocabulary; an unknown tier falls to the smallest rung.
/** @type {ReadonlyArray<string>} */
const TIER_LADDER = Object.freeze(['metropolis', 'city', 'town', 'village', 'hamlet', 'thorp']);

/** Per-tier marker geometry (view units). `r` = base disc radius, `ring` = an outer ring,
 * `star` = a gold 4-point centre star (the seats of power), `walled` = wall-tick square.
 * @type {Readonly<Record<string, { r: number, ring: boolean, star: boolean, walled: boolean }>>} */
const TIER_MARK = Object.freeze({
  metropolis: { r: 13, ring: true, star: true, walled: true },
  city: { r: 10, ring: true, star: true, walled: true },
  town: { r: 8, ring: true, star: false, walled: false },
  village: { r: 5.5, ring: false, star: false, walled: false },
  hamlet: { r: 4, ring: false, star: false, walled: false },
  thorp: { r: 3.5, ring: false, star: false, walled: false },
});
const DEFAULT_MARK = Object.freeze({ r: 4, ring: false, star: false, walled: false });

const COAST_MARGIN = 74;  // min land beyond the outermost site, in every ray
const MIN_RADIUS = 150;   // a floor so a tight site cluster still reads as a realm
const SEA_RINGS = 3;      // concentric sea-lines outside the coast
const SEA_RING_STEP = 13; // spacing between sea-lines

/** @typedef {{ slot:number, tier:string, x:number, y:number }} SceneSite */
/** @typedef {{
 *   sites: SceneSite[],
 *   coast: Array<[number, number]>,
 *   centroid: { x:number, y:number },
 *   roads: Array<[number, number]>,
 *   terrain: { rough:number, mounts:number },
 *   mapKind: string,
 * }} RealmScene */

/**
 * Euclidean distance between two points. Math.sqrt is correctly-rounded by spec (the one
 * root sanctioned in the domain purity idiom — never trig). @param {number} ax @param {number} ay
 * @param {number} bx @param {number} by @returns {number} */
function dist(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Derive the pure realm SCENE geometry from a worldPlan — sites mapped into the sheet, the
 * enclosing coastline, the road MST. Split out from the draw layer so a golden can pin the
 * geometry independent of any palette. Pure + deterministic.
 * @param {ReturnType<typeof deriveWorldPlan>} plan
 * @returns {RealmScene}
 */
export function deriveRealmScene(plan) {
  const rng = createPRNG(`realmMap::${plan.seed}::${plan.mapKind}`);
  const terrain = KIND_TERRAIN[plan.mapKind] || DEFAULT_TERRAIN;

  /** @type {SceneSite[]} */
  const sites = (plan.sites || []).map((s) => ({
    slot: s.slot,
    tier: s.tier,
    x: R(s.x),
    y: R(s.y * Y_SCALE),
  }));

  // Site centroid — the coastline + furniture reference.
  let sx = 0;
  let sy = 0;
  for (const s of sites) { sx += s.x; sy += s.y; }
  const n = Math.max(1, sites.length);
  const centroid = { x: R(sx / n), y: R(sy / n) };

  // Per-ray enclosing radius: the farthest OUTWARD site projection along the ray (dot
  // product — no trig), padded, floored, then jittered strictly OUTWARD so the coast can
  // never pull inside a site. A single circular neighbour-average smooths the white noise
  // into a more natural, less jagged shore.
  const rough = terrain.rough;
  const coastRng = rng.fork('coast'); // ONE child, advanced per ray (never re-forked in the loop)
  const raw = UNIT_DIRS.map(([ux, uy]) => {
    let reach = 0;
    for (const s of sites) {
      const proj = (s.x - centroid.x) * ux + (s.y - centroid.y) * uy;
      if (proj > reach) reach = proj;
    }
    const base = Math.max(reach + COAST_MARGIN, MIN_RADIUS);
    return base * (1 + coastRng.randFloat(0, rough));
  });
  const smooth = raw.map((_, i) => {
    const a = raw[(i - 1 + raw.length) % raw.length];
    const b = raw[i];
    const c = raw[(i + 1) % raw.length];
    return (a + 2 * b + c) / 4;
  });
  /** @type {Array<[number, number]>} */
  const coast = UNIT_DIRS.map(([ux, uy], i) => [R(centroid.x + ux * smooth[i]), R(centroid.y + uy * smooth[i])]);

  // Road web — a deterministic Euclidean MST (Prim from slot 0). worldPlan carries no
  // connectivity, so this is the honest minimal lattice that ties the realm together.
  /** @type {Array<[number, number]>} */
  const roads = [];
  if (sites.length > 1) {
    const inTree = new Set([0]);
    while (inTree.size < sites.length) {
      let best = null;
      let bestD = Infinity;
      for (const a of inTree) {
        for (let b = 0; b < sites.length; b += 1) {
          if (inTree.has(b)) continue;
          const d = dist(sites[a].x, sites[a].y, sites[b].x, sites[b].y);
          if (d < bestD) { bestD = d; best = [a, b]; }
        }
      }
      if (!best) break;
      inTree.add(best[1]);
      roads.push([best[0], best[1]]);
    }
  }

  return { sites, coast, centroid, roads, terrain, mapKind: plan.mapKind };
}

/** Push the concentric sea-lines outside the coast (open polylines, scaled radius rings).
 * @param {DrawOp[]} ops @param {RealmScene} scene @param {import('../../design/townMapStyles.js').TownMapStyle} style */
function pushSeaLines(ops, scene, style) {
  const water = style.palette.water;
  const o0 = style.opacity.riverStroke ?? 0.55;
  for (let ring = 1; ring <= SEA_RINGS; ring += 1) {
    const grow = ring * SEA_RING_STEP;
    /** @type {Array<[number, number]>} */
    const pts = UNIT_DIRS.map(([ux, uy], i) => {
      const cx = scene.coast[i][0];
      const cy = scene.coast[i][1];
      return /** @type {[number, number]} */ ([R(cx + ux * grow), R(cy + uy * grow)]);
    });
    pts.push(pts[0]);
    ops.push({ t: 'poly', pts, closed: false, stroke: water, strokeOpacity: R2(o0 * (1 - ring * 0.22)), strokeWidth: 1 });
  }
}

/** Push a few seeded interior mountain carets in the landform ink register (chevron paths).
 * @param {DrawOp[]} ops @param {RealmScene} scene @param {import('../../design/townMapStyles.js').TownMapStyle} style */
function pushRelief(ops, scene, style) {
  const count = scene.terrain.mounts;
  if (count <= 0) return;
  const ink = style.palette.ink;
  const oLand = style.opacity.landform ?? 0.5;
  const rng = createPRNG(`realmMap::relief::${scene.mapKind}::${scene.centroid.x},${scene.centroid.y}`);
  for (let i = 0; i < count; i += 1) {
    // Seed a caret near the centroid, inside the land, biased off any single site.
    const ang = rng.pick(UNIT_DIRS);
    const reach = rng.randFloat(30, 120);
    const cx = R(scene.centroid.x + ang[0] * reach);
    const cy = R(scene.centroid.y + ang[1] * reach * 0.6);
    const w = rng.randInt(16, 26);
    const h = rng.randInt(10, 16);
    // A little three-peak ridge (straight segments — no trig).
    ops.push({ t: 'path', d: `M ${cx - w} ${cy} L ${cx - R(w * 0.5)} ${cy - h} L ${cx} ${cy - R(h * 0.4)} L ${cx + R(w * 0.5)} ${cy - h} L ${cx + w} ${cy}`, stroke: ink, strokeWidth: 1.4 });
    ops.push({ t: 'line', x1: cx - R(w * 0.5), y1: cy - h, x2: cx - R(w * 0.2), y2: cy - R(h * 0.4), stroke: ink, strokeWidth: 0.9, strokeOpacity: R2(oLand) });
    ops.push({ t: 'line', x1: cx + R(w * 0.5), y1: cy - h, x2: cx + R(w * 0.2), y2: cy - R(h * 0.4), stroke: ink, strokeWidth: 0.9, strokeOpacity: R2(oLand) });
  }
}

/** Push one tier-scaled settlement marker at a site. @param {DrawOp[]} ops @param {SceneSite} site
 * @param {import('../../design/townMapStyles.js').TownMapStyle} style */
function pushMarker(ops, site, style) {
  const mk = TIER_MARK[site.tier] || DEFAULT_MARK;
  const ink = style.palette.ink;
  const gold = style.palette.anchor;
  const fill = style.palette.buildingFill;
  const cx = site.x;
  const cy = site.y;
  const r = mk.r;
  if (mk.ring) {
    ops.push({ t: 'circle', cx, cy, r: R2(r + 3), stroke: ink, strokeWidth: 1.2, fill: fill });
  }
  ops.push({ t: 'circle', cx, cy, r, fill: mk.star ? gold : fill, stroke: ink, strokeWidth: 1.3 });
  if (mk.walled) {
    // Four cardinal wall ticks (a walled seat) — short rects at N/E/S/W.
    const t = R2(r + 3);
    ops.push({ t: 'rect', x: cx - 1, y: R(cy - t - 2), w: 2, h: 3, fill: ink });
    ops.push({ t: 'rect', x: cx - 1, y: R(cy + t - 1), w: 2, h: 3, fill: ink });
    ops.push({ t: 'rect', x: R(cx - t - 2), y: cy - 1, w: 3, h: 2, fill: ink });
    ops.push({ t: 'rect', x: R(cx + t - 1), y: cy - 1, w: 3, h: 2, fill: ink });
  }
  if (mk.star) {
    // A 4-point gold star centre (diagonal arms via the authored DIAG constant — no trig).
    const s = R2(r * 0.62);
    const d = R2(s * DIAG);
    ops.push({ t: 'path', d: `M ${cx} ${R2(cy - s)} L ${R2(cx + d)} ${R2(cy - d)} L ${R2(cx + s)} ${cy} L ${R2(cx + d)} ${R2(cy + d)} L ${cx} ${R2(cy + s)} L ${R2(cx - d)} ${R2(cy + d)} L ${R2(cx - s)} ${cy} L ${R2(cx - d)} ${R2(cy - d)} Z`, fill: ink });
  }
}

/** Push the house furniture (double neatline + compass rose) re-posed for the wide sheet.
 * @param {DrawOp[]} ops @param {import('../../design/townMapStyles.js').TownMapStyle} style */
function pushFurniture(ops, style) {
  const ink = style.palette.ink;
  const gold = style.palette.anchor;
  /** @param {number} a @param {number} w @param {number} o */
  const frame = (a, w, o) => ops.push({
    t: 'poly',
    pts: [[a, a], [SHEET_W - a, a], [SHEET_W - a, SHEET_H - a], [a, SHEET_H - a]],
    closed: true, stroke: ink, strokeOpacity: o, strokeWidth: w,
  });
  frame(14, 2.5, 0.85);
  frame(22, 1, 0.6);
  // Compass rose, lower-right of the wide sheet (pushCompass geometry, re-posed).
  const cx = SHEET_W - 74;
  const cy = SHEET_H - 76;
  const rr = 40;
  const spike = 7;
  ops.push({ t: 'circle', cx, cy, r: rr, stroke: ink, strokeWidth: 1.4 });
  ops.push({ t: 'circle', cx, cy, r: rr - 6, stroke: ink, strokeWidth: 0.75 });
  ops.push({ t: 'path', d: `M ${cx} ${cy - rr} L ${cx + spike} ${cy} L ${cx} ${cy + rr} L ${cx - spike} ${cy} Z`, fill: gold, stroke: ink, strokeWidth: 0.75 });
  ops.push({ t: 'path', d: `M ${cx - rr} ${cy} L ${cx} ${cy + spike} L ${cx + rr} ${cy} L ${cx} ${cy - spike} Z`, fill: ink });
  ops.push({ t: 'circle', cx, cy, r: 3, fill: gold, stroke: ink, strokeWidth: 0.75 });
}

/**
 * Build the ordered realm draw-op list for a scene under a resolved style. Same op
 * vocabulary as buildTownMapDrawList, so it serializes through drawListToSvg identically.
 * PURE + deterministic in (scene, style).
 * @param {RealmScene} scene
 * @param {string | object} [styleArg]
 * @returns {DrawOp[]}
 */
export function realmSceneDrawOps(scene, styleArg = DEFAULT_STYLE_ID) {
  const style = resolveTownMapStyle(styleArg);
  const P = style.palette;
  const O = style.opacity;
  /** @type {DrawOp[]} */
  const ops = [];

  // (1) sea-lines (under the land, in the water margin), then the landmass fill + coast.
  pushSeaLines(ops, scene, style);
  ops.push({ t: 'poly', pts: scene.coast.map((p) => /** @type {[number, number]} */ ([p[0], p[1]])), closed: true, fill: P.buildingFill, fillOpacity: R2((O.districtFill ?? 0.14) + 0.2), stroke: P.ink, strokeOpacity: O.waterCoastStroke ?? 0.6, strokeWidth: 2.5 });

  // (2) interior relief.
  pushRelief(ops, scene, style);

  // (3) road MST.
  for (const [a, b] of scene.roads) {
    const s0 = scene.sites[a];
    const s1 = scene.sites[b];
    ops.push({ t: 'line', x1: s0.x, y1: s0.y, x2: s1.x, y2: s1.y, stroke: P.road, strokeOpacity: O.roadStroke ?? 0.5, strokeWidth: 1.6 });
  }

  // (4) settlement markers (largest tiers last so seats of power sit on top).
  const ordered = [...scene.sites].sort((p, q) => TIER_LADDER.indexOf(q.tier) - TIER_LADDER.indexOf(p.tier));
  for (const s of ordered) pushMarker(ops, s, style);

  // (5) house furniture.
  pushFurniture(ops, style);

  return ops;
}

/**
 * Render one realm PLATE (SVG string) from a seed + basic knobs under a house lens. The
 * single public entry the generator script drives. Same (seed, basicConfig, styleId) ⇒
 * byte-identical SVG. Reuses drawListToSvg then crops its fixed square viewBox down to the
 * wide realm band (the generate-landing-map-plates.mjs crop idiom — a viewBox + background
 * rewrite on our OWN deterministic output, never a second serializer).
 * @param {{ seed?: string, basicConfig?: { realmSize?: string, tone?: string, mapKind?: string }, styleId?: string, width?: number, height?: number }} [args]
 * @returns {{ svg: string, plan: ReturnType<typeof deriveWorldPlan>, scene: RealmScene }}
 */
export function renderRealmPlate({ seed, basicConfig, styleId = DEFAULT_STYLE_ID, width = 1200, height = 672 } = {}) {
  const plan = deriveWorldPlan({ seed, basicConfig });
  const scene = deriveRealmScene(plan);
  const style = resolveTownMapStyle(styleId);
  const ops = realmSceneDrawOps(scene, style);
  const full = drawListToSvg(ops, { width, height, style });
  const svg = full
    .replace(`viewBox="0 0 ${SHEET_W} ${SHEET_W}"`, `viewBox="0 0 ${SHEET_W} ${SHEET_H}"`)
    .replace(`<rect x="0" y="0" width="${SHEET_W}" height="${SHEET_W}"`, `<rect x="0" y="0" width="${SHEET_W}" height="${SHEET_H}"`);
  return { svg, plan, scene };
}

export { SHEET_W, SHEET_H };
