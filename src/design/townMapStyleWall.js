/**
 * design/townMapStyleWall.js — THE WALL for bespoke (AI-authored) map styles
 * (Surveyor style-overhaul, task #28 phase 2 / DESIGN_CONTENT_PLANE §7).
 *
 * A bespoke style is DATA — one more definition of the TownMapStyle shape (townMapStyles.js),
 * validated against the FIXED renderer capabilities. THE WALL (the safety invariant): a style
 * may only SELECT a hex color, a numeric weight/opacity, a furniture kind, a glyph name, a
 * contrast level — never arbitrary SVG, code, geometry, or substance. `validateBespokeStyle`
 * resolves a candidate onto the parchment base (so every unspecified field inherits the
 * default) keeping ONLY valid, known-role fields; every rejected field is listed honestly.
 * The result carries `__resolved:true`, so resolveTownMapStyle passes it straight through and
 * the renderer draws it exactly like a base lens. WORST CASE A STYLE IS UGLY; NEVER UNSAFE.
 *
 * THE MAP TRUTH-PROJECTION LAW (program doc): a style edits the map's DISPLAY, never its
 * SUBSTANCE — geometry (positions, polygons, sizes, which districts exist) comes from the
 * frozen render model, untouched by any style. This module enforces that by CONSTRUCTION: a
 * style carries ONLY visual attributes; any field that looks like geometry/substance
 * (buildings, extra districts, coordinates) is not a known style field and is DROPPED.
 *
 * PURE + deterministic, no store/React/transport. Reached only by the lazy town-map + AI
 * surfaces ⇒ zero first-paint bytes. Bespoke styles are ADDITIVE saved artifacts
 * (bespokeStyles.js); the four base lenses stay permanently available.
 */

import {
  resolveTownMapStyle, DEFAULT_STYLE_ID,
  FURNITURE_KINDS, HAZARD_GLYPHS, ANCHOR_GLYPHS, CONTRAST_LEVELS,
} from './townMapStyles.js';

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;
const _furnitureSet = new Set(FURNITURE_KINDS);
const _hazardSet = new Set(HAZARD_GLYPHS);
const _anchorSet = new Set(ANCHOR_GLYPHS);
const _contrastSet = new Set(CONTRAST_LEVELS);

/** Bounds for numeric fields (defense against a runaway weight/scale). Stroke ≥ 0; opacity
 *  0..1; rasterScale a small integer-ish; grid step / token px bounded. */
const STROKE_MAX = 40;
const RASTER_MAX = 8;
const GRID_STEP_MAX = 500;
const TOKEN_PX_MAX = 400;

function isHex(v) { return typeof v === 'string' && HEX_RE.test(v); }
function isFiniteNum(v) { return typeof v === 'number' && Number.isFinite(v); }

/**
 * Validate + resolve a candidate bespoke style against THE WALL. Pure.
 * @param {Record<string, unknown>|null|undefined} candidate
 * @param {{ id?: string, label?: string }} [meta]  a caller-assigned id/label for the artifact
 * @returns {{ ok: boolean, style: import('./townMapStyles.js').TownMapStyle,
 *            violations: Array<{ field: string, reason: string }> }}
 */
export function validateBespokeStyle(candidate, meta = {}) {
  const base = resolveTownMapStyle(DEFAULT_STYLE_ID);   // fully-resolved parchment defaults
  /** @type {Array<{ field: string, reason: string }>} */
  const violations = [];
  const c = (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) ? candidate : {};

  // The known top-level fields — anything else is dropped (arbitrary SVG/geometry/substance).
  const KNOWN = new Set([
    'id', 'label', 'background', 'contrast', 'hazardGlyph', 'anchorGlyph',
    'furniture', 'functional', 'rasterScale', 'palette', 'district', 'stroke', 'opacity',
  ]);
  for (const k of Object.keys(c)) {
    if (!KNOWN.has(k)) violations.push({ field: k, reason: 'unsupported_field' });
  }

  // Scalars — a valid candidate value overrides; an invalid one is noted + falls back to
  // the parchment default (worst case ugly, never unsafe / never undefined).
  const pick = (value, ok, fallback, field, reason) => {
    if (value === undefined) return fallback;
    if (ok(value)) return value;
    violations.push({ field, reason });
    return fallback;
  };
  const background = pick(c.background, isHex, base.background, 'background', 'not_hex');
  const contrast = pick(c.contrast, (v) => _contrastSet.has(/** @type {string} */ (v)), base.contrast, 'contrast', 'not_in_vocab');
  const hazardGlyph = pick(c.hazardGlyph, (v) => _hazardSet.has(/** @type {string} */ (v)), base.hazardGlyph, 'hazardGlyph', 'not_in_vocab');
  const anchorGlyph = pick(c.anchorGlyph, (v) => _anchorSet.has(/** @type {string} */ (v)), base.anchorGlyph, 'anchorGlyph', 'not_in_vocab');
  const rasterScale = pick(c.rasterScale, (v) => isFiniteNum(v) && /** @type {number} */ (v) > 0 && /** @type {number} */ (v) <= RASTER_MAX, base.rasterScale, 'rasterScale', 'out_of_range');

  // Furniture — a subset of the fixed vocabulary (dropped items listed).
  let furniture = base.furniture;
  if (Array.isArray(c.furniture)) {
    const kept = [];
    for (const f of c.furniture) {
      if (_furnitureSet.has(/** @type {string} */ (f))) kept.push(f);
      else violations.push({ field: `furniture.${String(f)}`, reason: 'not_in_vocab' });
    }
    furniture = Object.freeze(kept);
  } else if (c.furniture !== undefined) {
    violations.push({ field: 'furniture', reason: 'not_array' });
  }

  // functional { grid, gridStep, scaleBar, tokenPx } — booleans + bounded numbers.
  let functional = base.functional;
  if (c.functional && typeof c.functional === 'object' && !Array.isArray(c.functional)) {
    const f = /** @type {Record<string, unknown>} */ (c.functional);
    functional = Object.freeze({
      grid: typeof f.grid === 'boolean' ? f.grid : base.functional.grid,
      gridStep: (isFiniteNum(f.gridStep) && /** @type {number} */ (f.gridStep) >= 0 && /** @type {number} */ (f.gridStep) <= GRID_STEP_MAX) ? /** @type {number} */ (f.gridStep) : base.functional.gridStep,
      scaleBar: typeof f.scaleBar === 'boolean' ? f.scaleBar : base.functional.scaleBar,
      tokenPx: (isFiniteNum(f.tokenPx) && /** @type {number} */ (f.tokenPx) >= 0 && /** @type {number} */ (f.tokenPx) <= TOKEN_PX_MAX) ? /** @type {number} */ (f.tokenPx) : base.functional.tokenPx,
    });
  }

  // Role maps — only KNOWN roles (keys present in the parchment base) with valid values
  // override; an unknown role or a bad value is dropped-and-listed.
  const palette = mergeRoleMap(base.palette, c.palette, isHex, 'palette', violations);
  const district = mergeRoleMap(base.district, c.district, isHex, 'district', violations);
  const stroke = mergeRoleMap(base.stroke, c.stroke, (v) => isFiniteNum(v) && v >= 0 && v <= STROKE_MAX, 'stroke', violations);
  const opacity = mergeRoleMap(base.opacity, c.opacity, (v) => isFiniteNum(v) && v >= 0 && v <= 1, 'opacity', violations);

  const id = typeof meta.id === 'string' && meta.id ? meta.id
    : (typeof c.id === 'string' && c.id ? c.id : 'bespoke');
  const label = typeof meta.label === 'string' && meta.label ? meta.label.slice(0, 60)
    : (typeof c.label === 'string' && c.label ? c.label.slice(0, 60) : 'Bespoke');

  const style = /** @type {import('./townMapStyles.js').TownMapStyle} */ (Object.freeze({
    __resolved: true,
    id, label, background, contrast, hazardGlyph, anchorGlyph,
    furniture, functional, rasterScale, palette, district, stroke, opacity,
  }));
  return { ok: true, style, violations };
}

/**
 * Merge a candidate role map over a base map: only KNOWN roles (keys in base) with values
 * passing `valid` override; unknown roles / bad values are dropped and listed. Pure.
 */
function mergeRoleMap(base, cand, valid, field, violations) {
  if (!cand || typeof cand !== 'object' || Array.isArray(cand)) {
    if (cand !== undefined) violations.push({ field, reason: 'not_object' });
    return base;
  }
  const out = { ...base };
  for (const [role, value] of Object.entries(cand)) {
    if (!Object.prototype.hasOwnProperty.call(base, role)) { violations.push({ field: `${field}.${role}`, reason: 'unknown_role' }); continue; }
    if (!valid(value)) { violations.push({ field: `${field}.${role}`, reason: 'invalid_value' }); continue; }
    out[role] = value;
  }
  return Object.freeze(out);
}

/**
 * Build the DESIGN CORPUS descriptor the client POSTs to the style-overhaul edge — the
 * fixed vocabulary (furniture / glyphs / contrast) + the role keys the renderer reads + the
 * four base lens ids (the house design language the AI composes WITHIN, never from nothing).
 * Pure. The edge grounds the compiler on it; the client's validateBespokeStyle is the wall.
 * @returns {{ furniture: string[], hazardGlyphs: string[], anchorGlyphs: string[],
 *   contrast: string[], baseLenses: string[], roles: { palette: string[], district: string[],
 *   stroke: string[], opacity: string[] } }}
 */
export function buildStyleVocabulary() {
  const base = resolveTownMapStyle(DEFAULT_STYLE_ID);
  return {
    furniture: [...FURNITURE_KINDS],
    hazardGlyphs: [...HAZARD_GLYPHS],
    anchorGlyphs: [...ANCHOR_GLYPHS],
    contrast: [...CONTRAST_LEVELS],
    baseLenses: ['parchment', 'watercolor', 'darkFantasy', 'vtt'],
    roles: {
      palette: Object.keys(base.palette),
      district: Object.keys(base.district),
      stroke: Object.keys(base.stroke),
      opacity: Object.keys(base.opacity),
    },
  };
}
