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
  buildTownMapModel, readMapEdits, hasDrawableMap, buildTownMapSvg,
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

/**
 * The stable cache key for a settlement's thumbnail at a given pixel size, or
 * `null` when there is no map to draw. PURE + deterministic: keyed on a content
 * hash of the rendered SVG, so any change to the geometry (roster, mapEdits,
 * conditions) yields a new key (correct invalidation) and an unchanged settlement
 * always maps to the same entry. This is the testable half of the cache contract
 * (the canvas raster itself is browser-only, like shareImage.renderShareCardPng).
 * @param {any} settlement
 * @param {number} [size]
 * @returns {string | null}
 */
export function townMapThumbCacheKey(settlement, size = DEFAULT_SIZE) {
  const model = thumbModel(settlement);
  if (!model) return null;
  const svg = buildTownMapSvg(model, { width: size, height: size });
  return `${size}|${fnv1aHex(svg)}`;
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
function browserRasterize(svg, size, quality) {
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
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
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
 * @param {{ size?: number, quality?: number, rasterize?: (svg:string,size:number,quality:number)=>Promise<string> }} [opts]
 *   `rasterize` is an injection seam for tests (the real canvas raster is browser-only).
 * @returns {Promise<string | null>}
 */
export async function renderTownMapThumb(settlement, opts = {}) {
  const size = opts.size || DEFAULT_SIZE;
  const model = thumbModel(settlement);
  if (!model) return null;
  const svg = buildTownMapSvg(model, { width: size, height: size });
  const key = `${size}|${fnv1aHex(svg)}`;
  const hit = RASTER_CACHE.get(key);
  if (hit !== undefined) return hit;
  const raster = opts.rasterize || browserRasterize;
  const url = await raster(svg, size, opts.quality || DEFAULT_QUALITY);
  if (typeof url === 'string' && url) cacheSet(key, url);
  return url || null;
}

/** Test-only: current cache size. */
export function _thumbCacheSize() { return RASTER_CACHE.size; }
/** Test-only: clear the cache. */
export function _clearThumbCache() { RASTER_CACHE.clear(); }
