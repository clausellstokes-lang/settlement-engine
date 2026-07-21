/**
 * design/townMapStyles.js — the town-map STYLE LAYER (the four base lenses).
 *
 * A town-map STYLE is a BOUNDED, DATA-ONLY definition: every visual decision the
 * renderer makes (palette, line weights, fill opacities, decorative furniture,
 * marker glyphs, functional grid/scale) is read from one of these objects. The
 * deterministic draw projection (domain/townMap/townMapDraw.js) resolves a style
 * and emits the SAME primitive op vocabulary (poly / line / circle / rect / path)
 * for every lens; only the visual attributes differ. Geometry — every position,
 * polygon, and element SIZE — comes from the pure render model and is NEVER touched
 * by a style, so a re-skin is a derived view: (seed, style) → identical bytes, and
 * a semantic mapEdit renders correctly under every lens (the cross-lens edit pin).
 *
 * THE WALL (the safety invariant): a style definition may only SELECT from the
 * fixed renderer capabilities below — a hex color, a numeric weight/opacity, a
 * furniture kind from FURNITURE_KINDS, a glyph from the glyph vocabularies, a
 * contrast level. It can never carry arbitrary SVG or code. Worst case a style is
 * ugly; it can never be unsafe. tests/domain/townMapStyles.test.js pins the wall.
 *
 * WHY src/design: these are literal color/measurement DEFINITION tokens — homed in
 * the design-token layer (the sanctioned raw-color zone, exempt from the raw-color
 * occurrence budget) exactly like townMapExportPalette.js, never inline in a domain
 * or component file. Consumed ONLY by the lazy town-map surfaces (the draw
 * projection, the viewer, the thumbnail, the PDF plate), so it never reaches the
 * first-paint static closure (tests/build/townMapLazy.test.js).
 *
 * EXTENSIBILITY: a style is DATA. Bespoke AI-authored styles (a LATER wave) land as
 * additional definitions of this exact shape, validated against THE WALL — no code
 * path here changes. Genre packs (cyberpunk / sci-fi / noir) land at Surveyor S4+.
 */

import { EXPORT_PALETTE } from './townMapExportPalette.js';

// ── THE WALL — fixed renderer capability vocabularies ─────────────────────────
// A style may name ONLY these. The renderer knows how to draw each; a name outside
// the vocabulary is a wall violation (pinned).

/** Decorative / functional furniture the draw projection can emit (all from the
 *  primitive op vocabulary — no arbitrary SVG). */
export const FURNITURE_KINDS = Object.freeze(['wash', 'cartouche', 'compass', 'grid', 'scaleBar']);

/** Hazard marker glyph shapes the renderer can draw. */
export const HAZARD_GLYPHS = Object.freeze(['triangle', 'diamond', 'pin']);

/** Town-center anchor glyph shapes the renderer can draw. */
export const ANCHOR_GLYPHS = Object.freeze(['disc', 'ring', 'star']);

/** Contrast levels (an on-screen viewer hint; export always emits concrete color). */
export const CONTRAST_LEVELS = Object.freeze(['soft', 'normal', 'high']);

/** The named base lenses, in canonical order. Genre lenses land at S4+.
 *  `accessible` (SM-5, the ACCESSIBILITY LENS) is a colorblind-safe, high-contrast
 *  data-only lens — an Okabe-Ito-derived district palette whose tints stay
 *  distinguishable under the three common colour-vision deficiencies, plus crisp
 *  high-contrast linework. It is a pure style definition (THE WALL holds: palette
 *  hex + numbers only, no new renderer capability), so it composes with every
 *  export/panorama/thumbnail exactly like the other lenses. */
export const TOWN_MAP_STYLE_IDS = Object.freeze(['parchment', 'watercolor', 'darkFantasy', 'vtt', 'accessible']);

/** The default lens id (byte-identical to the pre-style-layer export). */
export const DEFAULT_STYLE_ID = 'parchment';

/**
 * THE ILLUSTRATED lens id (THE ILLUSTRATED TOWN, IT-1). Deliberately NOT a member of
 * TOWN_MAP_STYLE_IDS: that set is the pure-RE-SKIN family — every member shares ONE
 * identical geometry (the geometry-untouched invariant), is pinned by the style golden,
 * and drives the entitlement ladder's "all N lenses" count (LENS_COUNT, a paid surface).
 * The illustrated lens RE-SHAPES geometry (buildings become oblique-elevation GLYPHS, not
 * rects), so it categorically is not a re-skin; it is a distinct sixth lens, registered
 * here + in OVERRIDES (so resolve/coerce/persist all work) and offered to the lens picker
 * via TOWN_MAP_LENS_IDS. Adding it to TOWN_MAP_STYLE_IDS instead would shift the style
 * golden, trip the geometry-untouched sweeps, and silently bump the paid LENS_COUNT.
 */
export const ILLUSTRATED_STYLE_ID = 'illustrated';

/** Every PICKABLE base lens id — the five re-skins plus the illustrated glyph lens. The
 *  lens picker lists THESE; TOWN_MAP_STYLE_IDS stays the golden/entitlement-pinned five. */
export const TOWN_MAP_LENS_IDS = Object.freeze([...TOWN_MAP_STYLE_IDS, ILLUSTRATED_STYLE_ID]);

/**
 * A fully-resolved style definition — parchment defaults filled in for every field.
 * @typedef {Object} TownMapStyle
 * @property {string} id
 * @property {string} label
 * @property {string} background
 * @property {string} contrast
 * @property {string} hazardGlyph
 * @property {string} anchorGlyph
 * @property {ReadonlyArray<string>} furniture
 * @property {{ grid: boolean, gridStep: number, scaleBar: boolean, tokenPx: number }} functional
 * @property {number} rasterScale
 * @property {Record<string, string>} palette
 * @property {Record<string, string>} district
 * @property {Record<string, number>} stroke
 * @property {Record<string, number>} opacity
 * @property {string} [glyphSet]  a registered glyph-set id (the illustrated lens); absent ⇒ legacy rects
 * @property {string} [massingSet]  a registered massing-set id (a dimensional view, TRANCHE M); absent on every shipped lens ⇒ glyph facades / flat rects (the dormancy law)
 * @property {'spring'|'summer'|'autumn'|'winter'} [seasonBias]  a bespoke skin's default-season leaning (IT-4); absent ⇒ follow the live clock
 * @property {boolean} [__resolved]
 */

/**
 * PARCHMENT — the default lens. Its palette is the fixed EXPORT_PALETTE and its
 * weights/opacities reproduce the pre-style-layer draw output EXACTLY, so the
 * default derived view is byte-identical to the legacy plate/thumbnail (proven by
 * tests/domain/townMapDraw.test.js `parchment === legacy bytes`). The craft-pass
 * furniture (a later, owner-vetoable commit) is the ONLY thing that shifts it.
 */
const PARCHMENT = {
  id: 'parchment',
  label: 'Parchment',
  background: EXPORT_PALETTE.parchment,
  contrast: 'normal',
  hazardGlyph: 'triangle',
  anchorGlyph: 'disc',
  // THE CRAFT PASS (owner taste-veto): the default lens dressed as a hand-drawn
  // map — an aged-paper wash at the corners, a double-line cartouche neatline, and
  // an inked compass rose. Pure decorative furniture over the untouched base
  // geometry; the linework itself is unchanged, so the map reads exactly as before,
  // now framed. VTT deliberately stays bare (grid + scale, no ornament).
  furniture: ['wash', 'cartouche', 'compass'],
  functional: { grid: false, gridStep: 0, scaleBar: false, tokenPx: 0 },
  rasterScale: 1,
  palette: {
    water: EXPORT_PALETTE.water,
    road: EXPORT_PALETTE.road,
    street: EXPORT_PALETTE.street,
    ink: EXPORT_PALETTE.ink,
    wall: EXPORT_PALETTE.wall,
    gate: EXPORT_PALETTE.gate,
    anchor: EXPORT_PALETTE.anchor,
    buildingFill: EXPORT_PALETTE.buildingFill,
    hazardHigh: EXPORT_PALETTE.hazardHigh,
    hazardHighBg: EXPORT_PALETTE.hazardHighBg,
    hazardMid: EXPORT_PALETTE.hazardMid,
    hazardMidBg: EXPORT_PALETTE.hazardMidBg,
  },
  district: { ...EXPORT_PALETTE.district },
  // Line weights (in the 0..1000 view space). road/wall add the model's own
  // per-element weight on top of the base. `landform` is the base ink weight for the
  // non-water landform marks (marsh reeds · dune contours · mountain hachures); the
  // renderer scales it by each mark's weight TIER (the craft law's 2–3 ink weights).
  stroke: {
    waterCoast: 2, river: 14, roadBase: 2, street: 3, anchor: 1.5,
    wallBase: 1.5, gate: 2, district: 1.5, building: 1.5, badge: 1.5, hazard: 1.5,
    landform: 1.4,
  },
  opacity: {
    waterFill: 0.16, waterCoastStroke: 0.5, riverStroke: 0.55, roadStroke: 0.5,
    streetStroke: 0.55, districtFill: 0.14, districtAccent: 0.08, districtStroke: 0.45,
    wallStroke: 0.8, landform: 0.5,
  },
};

/**
 * WATERCOLOR — soft, luminous washes on warm paper. Higher fill opacity, gentler
 * strokes, desaturated tints. (Flat translucent overlays only — inline SVG
 * gradients are barred by the self-contained-SVG contract, see townMapDraw.js.)
 */
const WATERCOLOR = {
  id: 'watercolor',
  label: 'Watercolor',
  background: '#f4efe4',
  contrast: 'soft',
  furniture: ['wash', 'cartouche', 'compass'],
  palette: {
    water: '#6f9bb3', road: '#9a8468', street: '#b0a184', ink: '#4a4030',
    wall: '#5c5038', gate: '#f4efe4', anchor: '#d8b25a', buildingFill: '#fbf8f0',
    hazardHigh: '#b04a44', hazardHighBg: '#f3dede', hazardMid: '#c39a4e', hazardMidBg: '#f1e9d8',
  },
  district: {
    civic: '#5a6fae', noble: '#b09a5e', merchant: '#c39a4e', religious: '#a88a5a',
    arcane: '#6a5b48', craft: '#c08a3a', residential: '#4a8a58', foreign: '#6f9bb3',
    military: '#b04a44', criminal: '#5a5040', industrial: '#b0763a', other: '#8a7a60',
  },
  stroke: { district: 1.25, building: 1.25, wallBase: 1.25 },
  opacity: {
    waterFill: 0.24, riverStroke: 0.5, districtFill: 0.22, districtAccent: 0.12,
    districtStroke: 0.34, wallStroke: 0.65,
  },
};

/**
 * DARK FANTASY — a dark vellum with bright inked linework; ominous, high contrast.
 * Colors are tuned to read against the near-black ground (light ink, bright tints).
 */
const DARK_FANTASY = {
  id: 'darkFantasy',
  label: 'Dark Fantasy',
  background: '#1c1a15',
  contrast: 'high',
  furniture: ['wash', 'cartouche', 'compass'],
  palette: {
    water: '#4a7fa0', road: '#8a7a5c', street: '#a8946e', ink: '#e8dcc0',
    wall: '#c8b48a', gate: '#1c1a15', anchor: '#d9a441', buildingFill: '#2a271f',
    hazardHigh: '#d9483f', hazardHighBg: '#3a201e', hazardMid: '#d99a3a', hazardMidBg: '#332a1a',
  },
  district: {
    civic: '#6b82d6', noble: '#c9a24c', merchant: '#d0a040', religious: '#b89a5a',
    arcane: '#8a9ab0', craft: '#d09030', residential: '#4a9a58', foreign: '#5a9ac0',
    military: '#d9483f', criminal: '#9a8f7a', industrial: '#c07a3a', other: '#9a8f7a',
  },
  stroke: {
    waterCoast: 2.5, roadBase: 2.5, street: 3.5, anchor: 2, wallBase: 2,
    gate: 2.5, district: 2, building: 2, badge: 2, hazard: 2,
  },
  opacity: {
    waterFill: 0.2, waterCoastStroke: 0.6, riverStroke: 0.6, roadStroke: 0.6,
    streetStroke: 0.65, districtFill: 0.22, districtAccent: 0.12, districtStroke: 0.7,
    wallStroke: 0.9,
  },
};

/**
 * VTT — a functional virtual-tabletop battlemap: crisp high-contrast linework, a
 * cool neutral ground, a coordinate GRID + SCALE BAR, and a token-resolution raster
 * export (rasterScale). The functional attributes drive both the draw furniture and
 * the viewer overlay.
 */
const VTT = {
  id: 'vtt',
  label: 'VTT',
  background: '#f0f2f5',
  contrast: 'high',
  functional: { grid: true, gridStep: 50, scaleBar: true, tokenPx: 70 },
  furniture: ['grid', 'scaleBar'],
  rasterScale: 4,
  palette: {
    water: '#2f6f9f', road: '#5a5a5a', street: '#7a7a7a', ink: '#1a1a1a',
    wall: '#1a1a1a', gate: '#f0f2f5', anchor: '#c8901a', buildingFill: '#ffffff',
    hazardHigh: '#c62828', hazardHighBg: '#fbe0e0', hazardMid: '#c98a1a', hazardMidBg: '#f5ecd8',
  },
  district: {
    civic: '#2f4fa8', noble: '#8a6f2a', merchant: '#b07f1a', religious: '#7a5a2a',
    arcane: '#2a6a6a', craft: '#a86a10', residential: '#1f7a34', foreign: '#2f6f9f',
    military: '#c62828', criminal: '#3a3a3a', industrial: '#a85a1a', other: '#5a5a5a',
  },
  stroke: {
    waterCoast: 2.5, roadBase: 2.5, street: 3, anchor: 2, wallBase: 2.5,
    gate: 2.5, district: 2, building: 2, badge: 2, hazard: 2,
  },
  opacity: {
    waterFill: 0.18, waterCoastStroke: 0.7, riverStroke: 0.65, roadStroke: 0.7,
    streetStroke: 0.7, districtFill: 0.18, districtAccent: 0.1, districtStroke: 0.85,
    wallStroke: 1,
  },
};

/**
 * ACCESSIBLE — the ACCESSIBILITY LENS (SM-5, deliverable 6). A colorblind-safe,
 * high-contrast lens: the district tints are an Okabe-Ito-derived set chosen so
 * every category stays distinguishable under deuteranopia / protanopia /
 * tritanopia (hue + luminance separation, not hue alone), the ground is a bright
 * neutral, and the linework is heavy and near-opaque so shapes read on their own.
 *
 * THE WALL holds by construction: this is palette hex + numeric weights/opacities
 * only — no new renderer capability. The NON-WATER LANDFORM texture (marsh reeds /
 * dune contours / mountain hachures) that later landed renders from CONCRETE marks
 * in the existing op vocabulary (line/circle/curve), NOT a pattern-fill primitive,
 * so it composes here like any other geometry: this lens simply carries a heavier,
 * more opaque landform ink so each landform's PATTERN reads on its own — the
 * distinction is by mark shape, never colour (colourblind-safe by construction). A
 * clean cartouche neatline is the only furniture (no wash/compass) so nothing
 * dilutes contrast.
 */
const ACCESSIBLE = {
  id: 'accessible',
  label: 'Accessible',
  background: '#f7f7f4',
  contrast: 'high',
  hazardGlyph: 'diamond',
  anchorGlyph: 'ring',
  furniture: ['cartouche'],
  functional: { grid: false, gridStep: 0, scaleBar: false, tokenPx: 0 },
  rasterScale: 1,
  palette: {
    water: '#0072b2', road: '#4a4a4a', street: '#7a7a7a', ink: '#111111',
    wall: '#111111', gate: '#f7f7f4', anchor: '#e69f00', buildingFill: '#ffffff',
    hazardHigh: '#d55e00', hazardHighBg: '#fbe3d5', hazardMid: '#8a6d00', hazardMidBg: '#f5edcf',
  },
  // Okabe-Ito-derived, extended to the 12 district categories with distinct
  // luminance/hue steps. Each pair is separated in more than hue alone so a
  // colour-vision deficiency never collapses two adjacent categories.
  district: {
    civic: '#0072b2',        // blue
    noble: '#cc79a7',        // reddish purple
    merchant: '#e69f00',     // orange
    religious: '#56b4e9',    // sky blue
    arcane: '#5d3a9b',       // deep violet
    craft: '#d55e00',        // vermillion
    residential: '#009e73',  // bluish green
    foreign: '#0f8b8d',      // teal
    military: '#a11616',     // dark red
    criminal: '#2b2b2b',     // near-black
    industrial: '#7a4f0f',   // brown
    other: '#6a6a6a',        // neutral gray
  },
  stroke: {
    waterCoast: 2.5, river: 14, roadBase: 2.5, street: 3.5, anchor: 2,
    wallBase: 2.5, gate: 2.5, district: 2.25, building: 2, badge: 2, hazard: 2,
    landform: 2,
  },
  opacity: {
    waterFill: 0.2, waterCoastStroke: 0.75, riverStroke: 0.7, roadStroke: 0.7,
    streetStroke: 0.7, districtFill: 0.3, districtAccent: 0.14, districtStroke: 0.9,
    wallStroke: 1, landform: 0.8,
  },
};

/**
 * ILLUSTRATED — THE CARTOGRAPHER'S ART LAYER (THE ILLUSTRATED TOWN, IT-1). A sparse
 * override over parchment that turns ON the glyph layer: buildings render as oblique-
 * elevation glyphs from the named glyph set (`glyphSet`, THE WALL selects a REGISTERED
 * set id — never raw geometry). Everything else inherits parchment (its palette, district
 * tints, and the aged-paper cartouche + compass frame), so the base map still reads as a
 * hand-drawn chart. `opacity.shadow` sets the one-fixed-NW-light hatch weight; `opacity
 * .roofFill` the faint roof tint wash; a finer building stroke suits the glyph linework.
 * `opacity.dress` / `stroke.dress` (IT-2) set the GROUND DRESS density + ink weight — the
 * farm furrows / woods stipple / water ripples / meadow / hedges / wall shadows that fill
 * the parchment (groundDress.js). BOTH the shadow-bearing dress marks and the glyph hatch
 * are lit from the ONE fixed NW light. The five re-skin lenses (AND the accessible lens)
 * never name `glyphSet` or `dress`, so their output is byte-identical (their building
 * branch stays the legacy rect and they emit ZERO dress — the parchment===legacy pin holds).
 */
const ILLUSTRATED = {
  id: 'illustrated',
  label: 'Illustrated',
  glyphSet: 'medieval',
  stroke: { building: 1.1, dress: 1.1 },
  opacity: { shadow: 0.18, roofFill: 0.16, dress: 0.5 },
};

/** The raw lens overrides, merged over PARCHMENT by the resolver. */
const OVERRIDES = { parchment: {}, watercolor: WATERCOLOR, darkFantasy: DARK_FANTASY, vtt: VTT, accessible: ACCESSIBLE, illustrated: ILLUSTRATED };

/** Shallow-merge one sub-object of a lens over the parchment default. */
function mergeSub(base, over) {
  return over ? Object.freeze({ ...base, ...over }) : base;
}

/** Resolved-style cache (identity-stable per id ⇒ pure, allocation-free re-reads). */
const RESOLVED = new Map();

/**
 * Resolve a style id (or a pre-resolved style object) to the full, frozen style
 * definition — parchment defaults filled in for every unspecified field. An unknown
 * id falls back to parchment (fail-safe: an out-of-vocabulary lens is never unsafe,
 * just the default look). PURE + deterministic; no Date / Math.random.
 * @param {string | { id?: string, __resolved?: boolean } | null | undefined} styleOrId
 * @returns {TownMapStyle}
 */
export function resolveTownMapStyle(styleOrId) {
  // Already a resolved style object (carries the internal marker) — pass through.
  if (styleOrId && typeof styleOrId === 'object' && styleOrId.__resolved === true) {
    return /** @type {TownMapStyle} */ (styleOrId);
  }
  const id = typeof styleOrId === 'string'
    ? styleOrId
    : (styleOrId && typeof styleOrId === 'object' && typeof styleOrId.id === 'string' ? styleOrId.id : DEFAULT_STYLE_ID);
  const key = OVERRIDES[id] ? id : DEFAULT_STYLE_ID;
  const cached = RESOLVED.get(key);
  if (cached) return cached;
  const over = OVERRIDES[key];
  const resolved = /** @type {TownMapStyle} */ (Object.freeze({
    __resolved: true,
    id: over.id || PARCHMENT.id,
    label: over.label || PARCHMENT.label,
    background: over.background || PARCHMENT.background,
    contrast: over.contrast || PARCHMENT.contrast,
    hazardGlyph: over.hazardGlyph || PARCHMENT.hazardGlyph,
    anchorGlyph: over.anchorGlyph || PARCHMENT.anchorGlyph,
    furniture: Object.freeze([...(over.furniture || PARCHMENT.furniture)]),
    functional: mergeSub(PARCHMENT.functional, over.functional),
    rasterScale: over.rasterScale || PARCHMENT.rasterScale,
    palette: mergeSub(PARCHMENT.palette, over.palette),
    district: mergeSub(PARCHMENT.district, over.district),
    stroke: mergeSub(PARCHMENT.stroke, over.stroke),
    opacity: mergeSub(PARCHMENT.opacity, over.opacity),
    // The glyph-set selector — present ONLY on the illustrated lens; absent (undefined)
    // on every re-skin lens ⇒ the draw layer keeps the legacy building rects (byte-identical).
    glyphSet: over.glyphSet,
  }));
  RESOLVED.set(key, resolved);
  return resolved;
}

/**
 * A valid style id, coerced to the default when unknown/absent. A base lens id (present in
 * OVERRIDES) is ALWAYS accepted and is checked FIRST, so a base lens can never be shadowed
 * (the flip-back law). `extraValidIds` — the saved bespoke-skin ids for the surface being
 * resolved — widens the set of accepted ids so a saved skin can be worn: an id that is not a
 * base lens but IS a known bespoke id passes through; anything else falls back to the default.
 * Absent `extraValidIds` ⇒ the historical behavior EXACTLY (base ids only), so every legacy
 * single-arg caller is byte-identical.
 * @param {unknown} id
 * @param {ReadonlyArray<string> | null | undefined} [extraValidIds]  known bespoke ids for this surface
 * @returns {string}
 */
export function coerceStyleId(id, extraValidIds) {
  if (typeof id !== 'string' || !id) return DEFAULT_STYLE_ID;
  if (OVERRIDES[id]) return id;                                   // a base lens — never shadowed
  if (Array.isArray(extraValidIds) && extraValidIds.includes(id)) return id; // a known bespoke skin
  return DEFAULT_STYLE_ID;
}

/** The district tint for a category under a style (fallback: `other`).
 * @param {string|null|undefined} category @param {string|object} [styleOrId] */
export function styleDistrictColor(category, styleOrId) {
  const style = resolveTownMapStyle(styleOrId);
  const key = typeof category === 'string' ? category : 'other';
  return style.district[key] || style.district.other;
}

/**
 * The on-screen VIEWER palette for a lens — a flat role → concrete color map the
 * interactive pane reads for a NON-default lens (the default parchment lens keeps
 * the pane's theme-adaptive tokens, its pre-existing print-twin/screen divergence).
 * @param {string|object} styleOrId
 */
export function viewerPalette(styleOrId) {
  const s = resolveTownMapStyle(styleOrId);
  return {
    bg: s.background,
    water: s.palette.water,
    road: s.palette.road,
    street: s.palette.street,
    anchor: s.palette.anchor,
    anchorStroke: s.palette.ink,
    wall: s.palette.wall,
    gate: s.palette.gate,
    gateStroke: s.palette.ink,
    buildingFill: s.palette.buildingFill,
    ink: s.palette.ink,
    hazardHigh: s.palette.hazardHigh,
    hazardHighBg: s.palette.hazardHighBg,
    hazardMid: s.palette.hazardMid,
    hazardMidBg: s.palette.hazardMidBg,
    district: (category) => s.district[typeof category === 'string' ? category : 'other'] || s.district.other,
    contrast: s.contrast,
    grid: s.functional.grid ? s.functional.gridStep : 0,
    // The glyph set (illustrated lens) — lets the pane switch to the static op-list
    // underlay for glyph buildings; null for every re-skin lens.
    glyphSet: s.glyphSet || null,
  };
}
