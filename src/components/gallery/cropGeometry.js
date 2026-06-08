/**
 * cropGeometry.js — pure geometry for the landscape cover cropper (§3).
 *
 * The cropper shows a fixed-aspect landscape VIEWPORT (an overflow-hidden box).
 * The source image is rendered inside it scaled + panned, exactly like CSS
 * `object-fit: cover` at minimum zoom, and the user can zoom in (≥1×) and drag
 * to reposition. On confirm we map the viewport back to a rectangle of SOURCE
 * pixels and draw that to an output canvas.
 *
 * All functions here are pure (no DOM, no React) so the coordinate math — the
 * part that's easy to get subtly wrong — is unit-tested in isolation.
 *
 * Conventions:
 *   - `natural`  = { w, h } the image's intrinsic pixel size.
 *   - `viewport` = { w, h } the crop box in CSS px (w / h === aspect).
 *   - `zoom`     = multiplier ≥ 1 over the cover-fit base scale.
 *   - `offset`   = { x, y } CSS px translation of the image's top-left corner
 *                  relative to the viewport's top-left (both ≤ 0 once clamped).
 */

/** Smallest scale that makes the image fully COVER the viewport (object-fit: cover). */
export function coverBaseScale(natural, viewport) {
  const nw = Math.max(1, Number(natural?.w) || 0);
  const nh = Math.max(1, Number(natural?.h) || 0);
  const vw = Math.max(1, Number(viewport?.w) || 0);
  const vh = Math.max(1, Number(viewport?.h) || 0);
  return Math.max(vw / nw, vh / nh);
}

/** The image's displayed size in viewport px at a given zoom. */
export function displayedSize(natural, viewport, zoom) {
  const base = coverBaseScale(natural, viewport);
  const eff = base * Math.max(1, Number(zoom) || 1);
  return {
    w: (Number(natural?.w) || 0) * eff,
    h: (Number(natural?.h) || 0) * eff,
    scale: eff,
  };
}

/**
 * Clamp a pan offset so the image never reveals empty gutters: the displayed
 * image must always cover the viewport on both axes. Returns { x, y } in px,
 * each in [viewport - displayed, 0]. With cover-fit + zoom ≥ 1 the displayed
 * size is always ≥ the viewport, so the range is well-formed.
 */
export function clampOffset(offset, natural, viewport, zoom) {
  const { w: dw, h: dh } = displayedSize(natural, viewport, zoom);
  const vw = Number(viewport?.w) || 0;
  const vh = Number(viewport?.h) || 0;
  const minX = Math.min(0, vw - dw);
  const minY = Math.min(0, vh - dh);
  const x = Math.min(0, Math.max(minX, Number(offset?.x) || 0));
  const y = Math.min(0, Math.max(minY, Number(offset?.y) || 0));
  return { x, y };
}

/** Offset that centres the image in the viewport for a given zoom. */
export function centeredOffset(natural, viewport, zoom) {
  const { w: dw, h: dh } = displayedSize(natural, viewport, zoom);
  return {
    x: ((Number(viewport?.w) || 0) - dw) / 2,
    y: ((Number(viewport?.h) || 0) - dh) / 2,
  };
}

/**
 * Map the viewport back to a SOURCE-pixel rectangle. The offset is clamped
 * first, then the rect is rounded and clamped to the image bounds so
 * drawImage never samples outside the source.
 */
export function cropRectFromTransform({ natural, viewport, zoom, offset }) {
  const nw = Math.max(1, Number(natural?.w) || 0);
  const nh = Math.max(1, Number(natural?.h) || 0);
  const { scale } = displayedSize(natural, viewport, zoom);
  const o = clampOffset(offset, natural, viewport, zoom);

  let sx = -o.x / scale;
  let sy = -o.y / scale;
  let sw = (Number(viewport?.w) || 0) / scale;
  let sh = (Number(viewport?.h) || 0) / scale;

  // Round, then clamp inside the image. Width/height first so the origin shift
  // below can't push the rect past the right/bottom edge.
  sw = Math.min(nw, Math.round(sw));
  sh = Math.min(nh, Math.round(sh));
  sx = Math.min(Math.max(0, Math.round(sx)), nw - sw);
  sy = Math.min(Math.max(0, Math.round(sy)), nh - sh);

  return { sx, sy, sWidth: sw, sHeight: sh };
}

/**
 * Output canvas dimensions for a target landscape aspect, capped at maxWidth.
 * Height is derived from the aspect so the export is always exactly landscape.
 */
export function outputSize(aspect, maxWidth = 1280) {
  const a = Number(aspect) || 16 / 9;
  const w = Math.round(Math.min(maxWidth, maxWidth));
  return { w, h: Math.round(w / a) };
}
