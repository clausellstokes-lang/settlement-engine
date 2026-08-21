/**
 * realmMapExport.js — the REALM-MAP (world map) image export lane (MAP EXPORTS).
 *
 * The realm map's terrain is rendered by the FMG fork INSIDE an iframe; the parent
 * document owns only the settlement-marker overlay SVG (MapOverlay.jsx, tagged
 * `[data-map-overlay-svg]`). The bridge (src/lib/mapBridge.js) exposes ONE export
 * surface today — `exportThumb(size)`, which serializes + rasterizes the whole #map
 * SVG to a JPEG at up to 1024px (the iframe-side shim under public/map/, the
 * sfBridge script). The fork's NATIVE full
 * exporters (getMapURL "svg"/"png"/"tiles"/"geojson", public/map/modules/io/
 * export.js) are NOT wired through the bridge — bridging them is a recorded seam.
 *
 * So the honest realm export is the composite/thumbnail machinery captureCampaign-
 * Thumb already uses: rasterize the terrain via the bridge, then draw the parent's
 * marker overlay on top, and hand back one PNG (the POPULATED realm, not bare
 * terrain). This whole path is browser + iframe-bridge bound — statically verified
 * and logic-pinned, but PLAUSIBLE-class (not byte-provable in a unit test), the
 * same posture as the instant-world materialization.
 *
 * LAZY: reached only through the world-map toolbar's on-click handler (dynamically
 * imported), so nothing here touches first paint.
 *
 * SEAM — MAP-EXPORTS-2 (owner scope addition, deliberately deferred, not a bug):
 * a WITH-SETTLEMENTS vs WITHOUT (bare terrain) user choice. v1 always composites
 * the settlement-marker overlay (the DM's annotated reference). The bare-terrain
 * variant (a player handout of the unexplored world) is a `withSettlements=false`
 * flag on renderRealmMapPngBlob that simply SKIPS the overlay composite below — the
 * terrain raster is identical either way, so the two variants differ ONLY by the
 * overlay layer (the MAP-EXPORTS-2 pin: same realm + settings ⇒ terrain bytes
 * match, differ only by the placements). Held for MAP-EXPORTS-2 with its menu toggle
 * so this gating wave stays stable.
 */
import { serializeOverlaySvg } from './mapThumb.js';
import { downloadBlob } from './townMapExport.js';
import { slugify } from '../kernel/slugify.js';

// The FMG bridge exportThumb caps output at 1024px (the iframe-side shim); request the max
// for the crispest honest export.
const REALM_EXPORT_SIZE = 1024;

/** Load a data/blob URL into a decoded HTMLImageElement. @param {string} src */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image load failed'));
    img.src = src;
  });
}

/**
 * Rasterize the realm map (terrain + settlement markers) to a PNG Blob via the
 * bridge's terrain export composited with the parent overlay SVG. Resolves to
 * `null` when the bridge is not ready, the terrain export fails, or there is no
 * browser canvas. Never throws for a best-effort caller.
 * @param {{ bridge?: any, size?: number }} [opts]
 * @returns {Promise<{ blob: Blob, w: number, h: number } | null>}
 */
export async function renderRealmMapPngBlob({ bridge, size = REALM_EXPORT_SIZE } = {}) {
  if (!bridge?.isReady || typeof document === 'undefined') return null;
  let terrainRaster;
  try {
    terrainRaster = await bridge.exportThumb(size);
  } catch {
    return null;
  }
  const { dataUrl, w, h } = terrainRaster || {};
  if (!dataUrl || !w || !h) return null;

  try {
    const terrain = await loadImage(dataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(terrain, 0, 0, w, h);

    // Composite the settlement placements/markers overlay on top (the populated
    // realm). A missing/failed overlay is non-fatal — keep the terrain-only image.
    const overlayUrl = serializeOverlaySvg(w, h);
    if (overlayUrl) {
      try {
        const overlay = await loadImage(overlayUrl);
        ctx.drawImage(overlay, 0, 0, w, h);
      } catch {
        // markers optional
      }
    }
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    return blob ? { blob, w, h } : null;
  } catch {
    return null;
  }
}

/** A filesystem-safe slug from a name — the ONE kernel slugify primitive
 * (code-quality-5; never inline the idiom), capped at 60 chars. */
function slug(s) {
  return slugify(s, { max: 60, fallback: 'realm' });
}

/** YYYY-MM-DD (local calendar day) filename date stamp. */
function ymd(date) {
  const d = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** The realm-map export filename: `<name>-realm-map-<YYYY-MM-DD>.png`.
 * @param {string} name @param {Date} [date] */
export function realmMapExportFilename(name, date) {
  return `${slug(name)}-realm-map-${ymd(date)}.png`;
}

/**
 * Render + download the realm-map PNG (terrain + markers). Resolves to the render
 * descriptor, or `null` when there is nothing to export. Browser + bridge bound.
 * @param {{ bridge?: any, name?: string, size?: number, date?: Date }} [opts]
 * @returns {Promise<{ blob: Blob, w: number, h: number } | null>}
 */
export async function downloadRealmMapPng({ bridge, name, size, date } = {}) {
  const out = await renderRealmMapPngBlob({ bridge, size });
  if (!out) return null;
  downloadBlob(out.blob, realmMapExportFilename(name, date));
  return out;
}
