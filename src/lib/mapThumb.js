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
