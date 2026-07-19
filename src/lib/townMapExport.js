/**
 * townMapExport.js — the per-settlement TOWN-MAP image export lane (MAP EXPORTS).
 *
 * Turns a settlement's deterministic town map into a downloadable file under the
 * CURRENT LENS, in the caller's chosen format + resolution:
 *   • SVG   — native: the self-contained draw-projection string (domain/townMap/
 *             townMapDraw.js → buildTownMapSvg). Pure; no canvas.
 *   • PNG / JPEG / WebP — rasterized through the SAME self-contained-SVG → canvas
 *             idiom shareImage.js / townMapThumb.js use (no html-to-image dep; the
 *             SVG carries no external refs, so the canvas never taints).
 *
 * WYSIWYG: the export honors the owner's cosmetic mapEdits (nudges / layout /
 * legend) AND the current lens, so the file matches what the pane shows and the
 * VTT token raster (renderTownMapTokenRaster) — the single-map PDF plate shares
 * this posture. (The dossier's embedded 08C plate stays base-geometry; that is a
 * separate, golden-pinned surface.)
 *
 * DETERMINISM: the SVG fed to the canvas is a PURE function of (settlement, lens,
 * resolution) — byte-identical across runs + machines, and a lens switch changes
 * it. The SVG format is therefore byte-deterministic; the PNG/JPEG/WebP ENCODE is
 * a browser-native step whose exact bytes are platform-variant, so we pin the
 * (deterministic) SVG INPUT structure, not the encoded raster bytes.
 *
 * LAZY: imported only by the (already-lazy) SettlementMapExportMenu → the town-map
 * pane chunk, never by an eager module — first paint is unmoved (the town-map
 * fingerprint stays off the entry closure — tests/build/townMapLazy.test.js).
 *
 * SEAM — MAP-EXPORTS-2 (owner scope addition, deliberately deferred, not a bug):
 * a UNIVERSAL VTT SCENE export (.dd2vtt / .uvtt — the Dungeondraft-origin JSON
 * interchange standard several VTTs read). The format is a JSON object:
 *   { format, resolution:{ map_origin, map_size (grid cells), pixels_per_grid },
 *     line_of_sight:[ [ {x,y}… ] ], portals:[ { position, bounds, rotation, closed } ],
 *     lights:[…], environment:{…}, image:<base64 PNG> }.
 * Coordinates are in GRID CELLS. Our VTT lens is 50 units/cell over the 0..1000
 * space (20 cells) at tokenPx=70 ⇒ pixels_per_grid=70, map_size={20,20} — matching
 * the token raster (renderTownMapTokenRaster) as the `image`. LINE-OF-SIGHT WALLS
 * derive from the SAME draw list this file already builds: fortification wall
 * polygons + building-landmark rect footprints → vision-blocking segments (each
 * point scaled /50 into cell space), gates → portals. PIN (MAP-EXPORTS-2): a
 * constructed 3-building fixture yields exactly its footprint segments (rect ⇒ 4
 * segments each) 1:1 with the draw list's blocking geometry. Stock Foundry VTT does
 * NOT import .uvtt natively — it needs a community importer module (e.g. "Universal
 * Battlemap Importer" / "dd-import"); the format is emitted anyway as the interchange
 * standard. Rides the SAME per-settlement export bundle gate (the "Foundry export"
 * named in the $2.99 bundle). Held for MAP-EXPORTS-2 so this gating wave stays stable.
 */

import {
  buildTownMapModel, readMapEdits, readStyleLens, buildTownMapSvg,
  hasDrawableMap, coerceStyleId, viewerPalette,
  buildTownMapDrawList, drawListToSvg, annotationDrawOps, readAnnotations,
} from '../domain/townMap/index.js';
import { fogMaskFragment, injectFog } from '../domain/townMap/fogGeometry.js';
import { renderTownMapTokenRaster } from './townMapThumb.js';
import { slugify } from '../kernel/slugify.js';

/** Selectable export resolutions (square, px). The town map lives in a 1000×1000
 *  vector space, so the resolution is the rendered pixel box. */
export const TOWN_MAP_EXPORT_RESOLUTIONS = Object.freeze([1200, 2400, 4800]);
export const DEFAULT_EXPORT_RESOLUTION = 2400;

/** Format table: mime, file extension, whether it goes through the canvas, and a
 *  raster quality (ignored for PNG/SVG). Keyed by the public format id. */
const FORMATS = Object.freeze({
  svg:  Object.freeze({ mime: 'image/svg+xml', ext: 'svg',  raster: false }),
  png:  Object.freeze({ mime: 'image/png',     ext: 'png',  raster: true,  quality: 1 }),
  jpeg: Object.freeze({ mime: 'image/jpeg',    ext: 'jpg',  raster: true,  quality: 0.92 }),
  webp: Object.freeze({ mime: 'image/webp',    ext: 'webp', raster: true,  quality: 0.92 }),
});

/** The public format ids, in menu order. */
export const TOWN_MAP_EXPORT_FORMATS = Object.freeze(['svg', 'png', 'jpeg', 'webp']);

/** Human labels for the format ids (menu copy). */
export const TOWN_MAP_EXPORT_FORMAT_LABELS = Object.freeze({
  svg: 'SVG', png: 'PNG', jpeg: 'JPEG', webp: 'WebP',
});

/**
 * The owner's town-map render model (honoring cosmetic mapEdits), or `null` when
 * there is nothing drawable (a degenerate map-less settlement). Pure.
 * @param {any} settlement
 * @returns {import('../domain/townMap/townMapModel.js').TownMapModel | null}
 */
function exportModel(settlement) {
  const model = buildTownMapModel(settlement, readMapEdits(settlement));
  return hasDrawableMap(model) ? model : null;
}

/**
 * The lens to draw under: an explicit override (the pane's active lens) wins,
 * else the settlement's persisted styleLens. Always a valid style id.
 * @param {any} settlement
 * @param {string | null | undefined} styleOverride
 * @returns {string}
 */
export function exportLens(settlement, styleOverride) {
  if (styleOverride != null) return coerceStyleId(styleOverride);
  return readStyleLens(readMapEdits(settlement));
}

/**
 * The native export SVG string for a settlement under a lens. Pure + deterministic:
 * (settlement, lens, resolution, audience) → byte-identical SVG. `null` when there is
 * nothing to draw.
 *
 * SM-5 (5) — DM annotation markers ride the export under the WYSIWYG visibility split:
 * `audience` ('dm' the owner's own reference export — the default — shows all markers;
 * 'player' a handout omits DM-only ones). Composed by APPENDING annotation ops to the
 * draw list (buildTownMapDrawList is never touched, so its golden is never perturbed);
 * DORMANT — a map with no annotations produces []-extra ⇒ byte-identical to before.
 *
 * DOOR 2 — THE FOGGED HANDOUT (fog-of-war table layer): pass `opts.fogReveal` (a session's
 * {districts,streets,buildings} reveal set) to overlay the fog MASK (unrevealed quarters
 * hidden). The mask is INJECTED as a top `<g>` over the finished base SVG (fogGeometry:
 * fogMaskFragment/injectFog) — the base draw list + annotation append are never touched, so
 * the UNFOGGED export (`fogReveal` absent) returns BYTE-IDENTICAL to pre-fog (the WYSIWYG
 * law extends to the mask; the unfogged handout stays pinned). Fog color tracks the lens ink.
 * SEASON (IT-3): pass `opts.dress` (the pane's resolved season/state portrait) so the exported
 * file matches the on-screen season (WYSIWYG). Absent ⇒ seasonless base bytes (byte-identical to
 * pre-IT-3 — the dormancy law extends to every export surface).
 * @param {any} settlement
 * @param {{ style?: string, resolution?: number, audience?: 'dm'|'player',
 *   dress?: import('../domain/townMap/groundDress.js').MapDress | null,
 *   fogReveal?: { districts?: string[], streets?: string[], buildings?: string[] } | null,
 *   fogOpacity?: number }} [opts]
 * @returns {string | null}
 */
export function townMapExportSvg(settlement, opts = {}) {
  const model = exportModel(settlement);
  if (!model) return null;
  const style = exportLens(settlement, opts.style);
  const size = opts.resolution || DEFAULT_EXPORT_RESOLUTION;
  const dress = opts.dress || null;
  const markers = annotationDrawOps(readAnnotations(readMapEdits(settlement)), opts.audience || 'dm', style);
  const base = markers.length === 0
    ? buildTownMapSvg(model, { style, width: size, height: size, dress })
    : drawListToSvg(buildTownMapDrawList(model, style, dress).concat(markers), { style, width: size, height: size });
  // FOG HANDOUT (DOOR 2): overlay the mask ONLY when a reveal set is supplied; absent ⇒ the
  // base is returned UNCHANGED (byte-identical to pre-fog — the unfogged-export pin).
  if (!opts.fogReveal) return base;
  const fragment = fogMaskFragment(model, opts.fogReveal, { color: viewerPalette(style).ink, opacity: opts.fogOpacity });
  return injectFog(base, fragment);
}

/**
 * Rasterize a self-contained SVG string to an image Blob via an offscreen canvas.
 * Browser-only (needs document + canvas + URL.createObjectURL); rejects otherwise.
 * Mirrors shareImage.renderShareCardPng's Blob-URL → Image → drawImage → toBlob,
 * generalized over the mime (PNG for sharp lines, JPEG/WebP for smaller files).
 * The draw projection already paints an opaque style background, so no matte is
 * needed even for JPEG (which has no alpha).
 * @param {string} svg
 * @param {number} size square pixel box
 * @param {string} mime
 * @param {number} [quality]
 * @returns {Promise<Blob>}
 */
function browserRasterizeBlob(svg, size, mime, quality) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) {
      reject(new Error('map export requires a browser canvas'));
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
        canvas.toBlob((out) => {
          URL.revokeObjectURL(url);
          if (out) resolve(out);
          else reject(new Error('canvas.toBlob returned null'));
        }, mime, quality);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('map export SVG failed to load'));
    };
    img.src = url;
  });
}

/**
 * Render a settlement's town map to an image Blob in the chosen format +
 * resolution, under the current lens. `null` when there is nothing to draw.
 * The `rasterize` option is the browser-only-canvas injection seam (tests drive
 * it deterministically); the default is the real canvas rasterizer.
 * @param {any} settlement
 * @param {{ format?: string, resolution?: number, style?: string, audience?: 'dm'|'player',
 *   dress?: import('../domain/townMap/groundDress.js').MapDress | null,
 *   fogReveal?: { districts?: string[], streets?: string[], buildings?: string[] } | null,
 *   fogOpacity?: number,
 *   rasterize?: (svg:string,size:number,mime:string,quality?:number)=>Promise<Blob> }} [opts]
 * @returns {Promise<{ blob: Blob, mime: string, ext: string, format: string } | null>}
 */
export async function renderTownMapExport(settlement, opts = {}) {
  const format = FORMATS[opts.format] ? opts.format : 'png';
  const fmt = FORMATS[format];
  const svg = townMapExportSvg(settlement, {
    style: opts.style, resolution: opts.resolution, audience: opts.audience, dress: opts.dress,
    fogReveal: opts.fogReveal, fogOpacity: opts.fogOpacity,
  });
  if (svg == null) return null;

  if (!fmt.raster) {
    // SVG — a text blob, no canvas needed.
    return { blob: new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), mime: fmt.mime, ext: fmt.ext, format };
  }
  const size = opts.resolution || DEFAULT_EXPORT_RESOLUTION;
  const raster = opts.rasterize || browserRasterizeBlob;
  const blob = await raster(svg, size, fmt.mime, fmt.quality);
  return blob ? { blob, mime: fmt.mime, ext: fmt.ext, format } : null;
}

/** A filesystem-safe slug from an arbitrary string — the ONE kernel slugify
 * primitive (code-quality-5; never inline the idiom), capped at 60 chars. */
function slug(s, fallback) {
  return slugify(s, { max: 60, fallback });
}

/** YYYY-MM-DD from a Date (local calendar day) — the filename date stamp. */
function ymd(date) {
  const d = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * The export filename: `<settlement>-<lens>-map-<YYYY-MM-DD>.<ext>`. Slugged from
 * the settlement + lens names; the date defaults to today (pass one for tests).
 * @param {string} name settlement name
 * @param {string} lens style id
 * @param {string} ext file extension
 * @param {Date} [date]
 * @returns {string}
 */
export function townMapExportFilename(name, lens, ext, date) {
  return `${slug(name, 'settlement')}-${slug(lens, 'parchment')}-map-${ymd(date)}.${ext || 'png'}`;
}

/** Trigger a browser download of a data URL under a filename (anchor-click). Used
 * for the VTT token raster, which arrives as a PNG data URL, not a Blob.
 * @param {string} dataUrl @param {string} filename */
export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Render + download the VTT/Foundry token-resolution battlemap raster (the VTT
 * lens' functional export — renderTownMapTokenRaster: a token-scale PNG with a
 * crisp grid). Resolves to the raster descriptor, or `null` when there is nothing
 * to draw. The `rasterize` seam is forwarded for tests.
 * @param {any} settlement
 * @param {{ filename?: string, date?: Date,
 *   rasterize?: (svg:string,size:number,quality:number,mime?:string)=>Promise<string> }} [opts]
 * @returns {Promise<{ dataUrl: string, size: number } | null>}
 */
export async function downloadTownMapTokenRaster(settlement, opts = {}) {
  const out = await renderTownMapTokenRaster(settlement, { rasterize: opts.rasterize });
  if (!out) return null;
  const filename = opts.filename || `${slug(settlement?.name, 'settlement')}-vtt-token-${ymd(opts.date)}.png`;
  downloadDataUrl(out.dataUrl, filename);
  return out;
}

/** Trigger a browser download of a Blob under a filename (the shareImage idiom).
 * @param {Blob} blob @param {string} filename */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    // Revoke on the next tick so the click's navigation has taken the URL.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

/**
 * Render + download a settlement's town-map image export. Resolves to the render
 * descriptor (or `null` when there is nothing to draw). Browser-only for the real
 * raster; SVG works anywhere Blob exists.
 * @param {any} settlement
 * @param {{ format?: string, resolution?: number, style?: string, filename?: string,
 *   audience?: 'dm'|'player',
 *   dress?: import('../domain/townMap/groundDress.js').MapDress | null,
 *   fogReveal?: { districts?: string[], streets?: string[], buildings?: string[] } | null,
 *   fogOpacity?: number,
 *   date?: Date, rasterize?: (svg:string,size:number,mime:string,quality?:number)=>Promise<Blob> }} [opts]
 * @returns {Promise<{ blob: Blob, mime: string, ext: string, format: string } | null>}
 */
export async function downloadTownMapExport(settlement, opts = {}) {
  const out = await renderTownMapExport(settlement, opts);
  if (!out) return null;
  const lens = exportLens(settlement, opts.style);
  // A fogged player handout gets a '-handout' filename tag so it never overwrites the
  // owner's own (DM/full) export sitting beside it in the downloads folder.
  const base = opts.fogReveal
    ? `${slug(settlement?.name, 'settlement')}-${slug(lens, 'parchment')}-handout-${ymd(opts.date)}.${out.ext}`
    : townMapExportFilename(settlement?.name, lens, out.ext, opts.date);
  const filename = opts.filename || base;
  downloadBlob(out.blob, filename);
  return out;
}
