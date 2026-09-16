/**
 * townMapThumb.js — the library-card TOWN-MAP thumbnail lane (SM-4).
 *
 * A tiny, lazy, cached raster of a settlement's deterministic town map, for the
 * library card. Standalone (no FMG bridge — unlike src/lib/mapThumb.js, the realm
 * map's iframe-bridge thumb): it builds the pure town-map SVG string (the shared
 * draw projection, domain/townMap/townMapDraw.js) and rasterizes it with the same
 * hand-rolled SVG → canvas idiom as src/lib/shareImage.js (no html-to-image dep, a
 * self-contained SVG so the canvas never taints, a JPEG data URL read straight
 * back out for an <img src>). Honors the owner's cosmetic mapEdits (this is the
 * owner's own library preview) — a re-roll / nudge re-keys the cache.
 *
 * CACHE (in-memory, module-scoped): the persisted storage home for thumbnails is
 * an owner-gated decision (design §6, "a new persistence surface"), so V1 caches
 * ONLY in memory — a Map keyed by a content hash of the SVG (so a world-pulse tick,
 * an edit, or a mapEdits re-roll that changes the geometry naturally invalidates
 * the entry) plus the pixel size. Same content → same key → the expensive canvas
 * encode runs once; changed content → new key → a fresh raster. Bounded (LRU-ish
 * cap) so a long library session cannot grow it without limit.
 *
 * LAZY: imported only by the (already-lazy) SettlementCardMapThumb component, never
 * by an eager module, so first paint is unmoved (the town-map fingerprint stays
 * off the entry closure — tests/build/townMapLazy.test.js).
 */

import {
  buildTownMapModel, readMapEdits, readStyleLens, readBespokeStyles, hasDrawableMap, buildTownMapSvg,
  resolveTownMapStyle, resolveActiveStyle, resolveMapDress,
} from '../domain/townMap/index.js';

const DEFAULT_SIZE = 128;
const DEFAULT_QUALITY = 0.72;
// Bound the in-memory cache: a preview thumb is cheap to regenerate, so an
// unbounded Map is the only real risk over a long session. Oldest-inserted evicted.
const CACHE_CAP = 200;

/** @type {Map<string, string>} key → JPEG data URL */
const RASTER_CACHE = new Map();

/** Deterministic 32-bit FNV-1a hex of a string (the repo's per-module idiom; no
 * Math.random / Date). Used only to key the raster cache by SVG content.
 * @param {string} str */
function fnv1aHex(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    // FNV prime multiply in 32-bit space (Math.imul keeps it exact).
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/**
 * The pure town-map render model for a SAVE record's settlement, honoring the
 * owner's cosmetic mapEdits, or `null` when there is nothing drawable. Pure.
 * @param {any} settlement the settlement blob (save.settlement)
 * @returns {import('../domain/townMap/townMapModel.js').TownMapModel | null}
 */
function thumbModel(settlement) {
  const model = buildTownMapModel(settlement, readMapEdits(settlement));
  return hasDrawableMap(model) ? model : null;
}

/** The owner's chosen map lens ID for this settlement (MAP STYLES), default parchment — a base
 * lens id OR a saved bespoke skin id. Used to KEY the raster cache (legible + collision-safe).
 * @param {any} settlement */
function thumbStyle(settlement) {
  return readStyleLens(readMapEdits(settlement));
}

/** The RESOLVED active style OBJECT for a lens id — a saved bespoke skin's definition when the id
 * names one (THE SKIN REGISTRY, IT-4), else the base-lens resolution (parchment-safe). This is what
 * is DRAWN, so the thumbnail wears a worn skin in lockstep with the pane + exports (WYSIWYG).
 * @param {any} settlement @param {string} styleId */
function thumbStyleObject(settlement, styleId) {
  return resolveActiveStyle(styleId, readBespokeStyles(readMapEdits(settlement)));
}

/** IT-3: the season/state portrait for the thumbnail (resolved from the card's worldState),
 * or null (seasonless base bytes) when the card has no live campaign context. The cache key
 * hashes the rendered SVG, so a season change re-keys the raster automatically.
 * @param {any} settlement @param {any} worldState */
function thumbDress(settlement, worldState) {
  return worldState ? resolveMapDress(settlement, worldState) : null;
}

/**
 * The stable cache key for a settlement's thumbnail at a given pixel size, or
 * `null` when there is no map to draw. PURE + deterministic: keyed on a content
 * hash of the rendered SVG, so any change to the geometry (roster, mapEdits,
 * conditions) yields a new key (correct invalidation) and an unchanged settlement
 * always maps to the same entry. This is the testable half of the cache contract
 * (the canvas raster itself is browser-only, like shareImage.renderShareCardPng).
 * @param {any} settlement
 * @param {number} [size]
 * @param {any} [worldState]  IT-3: the campaign clock; absent ⇒ seasonless key (byte-identical)
 * @returns {string | null}
 */
export function townMapThumbCacheKey(settlement, size = DEFAULT_SIZE, worldState = null) {
  const model = thumbModel(settlement);
  if (!model) return null;
  const style = thumbStyle(settlement);
  const svg = buildTownMapSvg(model, { style: thumbStyleObject(settlement, style), width: size, height: size, dress: thumbDress(settlement, worldState) });
  // The lens ID is part of the identity: a re-skin re-keys the raster (the SVG hash
  // already differs, but naming the lens keeps the key legible + collision-safe).
  return `${size}|${style}|${fnv1aHex(svg)}`;
}

/** Insert with a simple size bound (evict the oldest-inserted). @param {string} key @param {string} url */
function cacheSet(key, url) {
  if (RASTER_CACHE.size >= CACHE_CAP) {
    const oldest = RASTER_CACHE.keys().next().value;
    if (oldest !== undefined) RASTER_CACHE.delete(oldest);
  }
  RASTER_CACHE.set(key, url);
}

/**
 * Rasterize a self-contained SVG string to a JPEG data URL via an offscreen
 * canvas. Browser-only (needs document + canvas + URL.createObjectURL). Mirrors
 * shareImage.renderShareCardPng's Blob-URL → Image → drawImage → read-back, but
 * returns a data URL (for a direct <img src>) and encodes JPEG (small, on an
 * opaque parchment background). Rejects if the environment has no canvas.
 * @param {string} svg
 * @param {number} size
 * @param {number} quality
 * @returns {Promise<string>}
 */
function browserRasterize(svg, size, quality, mime = 'image/jpeg') {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) {
      reject(new Error('town-map thumbnail requires a browser canvas'));
      return;
    }
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('canvas 2d context unavailable');
        ctx.drawImage(img, 0, 0, size, size);
        const dataUrl = canvas.toDataURL(mime, quality);
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('town-map thumbnail SVG failed to load'));
    };
    img.src = url;
  });
}

/**
 * Render (or return the cached) town-map thumbnail data URL for a settlement, or
 * `null` when there is no map to draw. Deterministic + cached: same content → the
 * canvas encode runs once; changed content → a fresh raster. Browser-only for the
 * first (uncached) render of a given key.
 * @param {any} settlement the settlement blob (save.settlement)
 * @param {{ size?: number, quality?: number, style?: string, worldState?: any, rasterize?: (svg:string,size:number,quality:number,mime?:string)=>Promise<string> }} [opts]
 *   `rasterize` is an injection seam for tests (the real canvas raster is browser-only).
 *   `worldState` (IT-3, OPTIONAL) paints the thumbnail's season; absent ⇒ seasonless base bytes.
 * @returns {Promise<string | null>}
 */
export async function renderTownMapThumb(settlement, opts = {}) {
  const size = opts.size || DEFAULT_SIZE;
  const model = thumbModel(settlement);
  if (!model) return null;
  const style = opts.style || thumbStyle(settlement);
  const svg = buildTownMapSvg(model, { style: thumbStyleObject(settlement, style), width: size, height: size, dress: thumbDress(settlement, opts.worldState) });
  const key = `${size}|${style}|${fnv1aHex(svg)}`;
  const hit = RASTER_CACHE.get(key);
  if (hit !== undefined) return hit;
  const raster = opts.rasterize || browserRasterize;
  const url = await raster(svg, size, opts.quality || DEFAULT_QUALITY);
  if (typeof url === 'string' && url) cacheSet(key, url);
  return url || null;
}

/**
 * The token-resolution VTT battlemap raster (MAP STYLES — the VTT lens' functional
 * export). Renders the settlement under the VTT lens at a size where each grid cell
 * is exactly `tokenPx` pixels (cells = 1000 / gridStep), so the exported PNG drops
 * onto a virtual tabletop at token scale with crisp grid lines. Reuses the shared
 * rasterizer idiom (PNG, not JPEG, for sharp lines). NOT cached (a one-shot export)
 * and browser-only for the real raster; the pure size math is testable via the seam.
 * @param {any} settlement
 * @param {{ rasterize?: (svg:string,size:number,quality:number,mime?:string)=>Promise<string> }} [opts]
 * @returns {Promise<{ dataUrl: string, size: number } | null>}
 */
export async function renderTownMapTokenRaster(settlement, opts = {}) {
  const model = thumbModel(settlement);
  if (!model) return null;
  const size = tokenRasterSize();
  const svg = buildTownMapSvg(model, { style: 'vtt', width: size, height: size });
  const raster = opts.rasterize || browserRasterize;
  const dataUrl = await raster(svg, size, 1, 'image/png');
  return typeof dataUrl === 'string' && dataUrl ? { dataUrl, size } : null;
}

/** The VTT token-raster pixel size (square): cells × tokenPx from the VTT lens. Pure. */
export function tokenRasterSize() {
  const vtt = resolveTownMapStyle('vtt');
  const step = vtt.functional.gridStep || 50;
  const cells = Math.round(1000 / step);
  return cells * (vtt.functional.tokenPx || 70);
}

/** Test-only: current cache size. */
export function _thumbCacheSize() { return RASTER_CACHE.size; }
/** Test-only: clear the cache. */
export function _clearThumbCache() { RASTER_CACHE.clear(); }
