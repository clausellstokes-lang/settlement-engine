// ── Gallery thumbnail capture for map shares ───────────────────────────────
// Generated-terrain (FMG) maps have no customBackdrop, so the maps-gallery tile
// has no thumb_url and falls back to a placeholder. On share we rasterize the
// rendered terrain to a small JPEG (inside the iframe, via the FMG-native
// exporter) and upload it, returning a render-inert { imageUrl, w, h } the
// caller stores in mapState.galleryThumb. This is sibling to — and deliberately
// NOT — customBackdrop, whose imageUrl flips the owner's editor into image-mode.
//
// Best-effort by contract: every failure resolves to null so the share still
// succeeds and the tile shows the existing "Generated terrain" placeholder.

/**
 * Capture + upload the gallery thumbnail for a map share.
 *
 * @param {Object} [opts]
 * @param {Object} [opts.bridge]     - the FMG map bridge (mapBridge.js); must be ready.
 * @param {string} [opts.ownerId]    - auth uid (RLS folder for the upload).
 * @param {string} [opts.campaignId] - active campaign id (filename hint only).
 * @param {boolean} [opts.skip]      - true for custom-image maps (already have a thumb).
 * @returns {Promise<{ imageUrl: string, w: number, h: number } | null>}
 */
export async function captureMapThumb({ bridge, ownerId, campaignId, skip = false } = {}) {
  if (skip || !bridge?.isReady || !ownerId) return null;
  try {
    const { dataUrl, w, h } = await bridge.exportThumb(480);
    if (!dataUrl) return null;
    const blob = await (await fetch(dataUrl)).blob();
    const { uploadMapBackdrop } = await import('./imageUpload.js');
    const { url } = await uploadMapBackdrop(blob, {
      ownerId, campaignId, contentType: 'image/jpeg',
    });
    return { imageUrl: url, w, h };
  } catch {
    // Non-fatal: the tile falls back to the terrain placeholder.
    return null;
  }
}

// ── Campaign thumbnail (map_with_campaign share) ────────────────────────────
// A campaign share's tile should show the POPULATED world — the terrain WITH its
// settlement markers — not the bare terrain captureMapThumb produces. The
// terrain raster lives inside the FMG iframe; the settlement placements/markers
// are a React-owned SVG layer in the PARENT document (MapOverlay.jsx, tagged
// `[data-map-overlay-svg]`), positioned over the iframe. So the campaign thumb
// is a TWO-LAYER composite: rasterize the terrain (the existing iframe export),
// then draw the serialized overlay SVG on top, both onto one canvas.
//
// The overlay layer is pure vector (TierIcon draws SVG primitives, no external
// <image href>), so serializing it and rasterizing through an <img> does NOT
// taint the canvas — toDataURL stays allowed.
//
// Best-effort by contract: any step that fails falls back to the bare-terrain
// thumb (still a valid, if less rich, tile) and ultimately to null, so the share
// always succeeds.

/**
 * Load an SVG/raster data (or blob) URL into a decoded HTMLImageElement.
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image load failed'));
    img.src = src;
  });
}

/**
 * Serialize the live React overlay SVG (placements/markers/labels) to a
 * data URL sized to (w × h). Returns null when the overlay node is absent
 * (e.g. a custom-image map with no placements layer, or the map isn't mounted).
 * @param {number} w target width in px
 * @param {number} h target height in px
 * @returns {string | null}
 */
function serializeOverlaySvg(w, h) {
  if (typeof document === 'undefined') return null;
  const node = document.querySelector('[data-map-overlay-svg]');
  if (!node) return null;
  // Clone so we can pin explicit pixel dimensions without disturbing the live
  // layout-driven SVG. The overlay already carries a `0 0 vbW vbH` viewBox whose
  // box matches the iframe's displayed pixels, so scaling it to the terrain
  // raster's dimensions keeps the markers registered over the geography.
  const clone = /** @type {SVGElement} */ (node.cloneNode(true));
  clone.setAttribute('width', String(w));
  clone.setAttribute('height', String(h));
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const xml = new XMLSerializer().serializeToString(clone);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
}

/**
 * Capture + upload the CAMPAIGN gallery thumbnail: the terrain raster with the
 * settlement placements/markers layer composited in. Use this for a
 * map_with_campaign share; keep captureMapThumb for the bare map-only thumb.
 *
 * @param {Object} [opts]
 * @param {Object} [opts.bridge]     - the FMG map bridge (mapBridge.js); must be ready.
 * @param {string} [opts.ownerId]    - auth uid (RLS folder for the upload).
 * @param {string} [opts.campaignId] - active campaign id (filename hint only).
 * @param {boolean} [opts.skip]      - true for custom-image maps (already have a thumb).
 * @returns {Promise<{ imageUrl: string, w: number, h: number } | null>}
 */
export async function captureCampaignThumb({ bridge, ownerId, campaignId, skip = false } = {}) {
  if (skip || !bridge?.isReady || !ownerId) return null;
  let composited = null;
  try {
    // Layer 1 — the terrain raster (same export captureMapThumb uses).
    const { dataUrl, w, h } = await bridge.exportThumb(480);
    if (!dataUrl) return null;
    const terrain = await loadImage(dataUrl);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(terrain, 0, 0, w, h);

    // Layer 2 — the React placements/markers overlay, composited on top. A
    // missing/failed overlay is non-fatal: we still upload the terrain raster
    // (better than the placeholder), just without the markers.
    const overlayUrl = serializeOverlaySvg(w, h);
    if (overlayUrl) {
      try {
        const overlay = await loadImage(overlayUrl);
        ctx.drawImage(overlay, 0, 0, w, h);
      } catch {
        // Composite-only failure: keep the terrain-only canvas.
      }
    }

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    if (blob) composited = { blob, w, h };
  } catch {
    // Compositing failed — fall through to the bare-terrain fallback below.
  }

  // Compositing failed entirely — fall back to the bare-terrain thumb so the
  // campaign tile still gets an image rather than the placeholder.
  if (!composited) {
    return captureMapThumb({ bridge, ownerId, campaignId, skip: false });
  }

  try {
    const { uploadMapBackdrop } = await import('./imageUpload.js');
    const { url } = await uploadMapBackdrop(composited.blob, {
      ownerId, campaignId, contentType: 'image/jpeg',
    });
    return { imageUrl: url, w: composited.w, h: composited.h };
  } catch {
    return null;
  }
}
