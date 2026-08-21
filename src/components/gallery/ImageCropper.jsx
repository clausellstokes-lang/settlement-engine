/**
 * ImageCropper.jsx — landscape pan/zoom cropper.
 *
 * Shows the chosen image inside a fixed-aspect (landscape) viewport, behaving
 * like CSS `object-fit: cover` at minimum zoom. The user drags to reposition
 * and uses the zoom slider (or wheel) to push in; on Apply we draw the visible
 * region to a canvas and hand back a JPEG Blob. All coordinate math lives in
 * the unit-tested cropGeometry module — this file is interaction + canvas only.
 *
 * No upload here: the parent (CoverImageField) owns file selection + storage.
 *
 * ── THE OUTPUT IS PARAMETERISED (profile-identity lane, DESIGN_PROFILE_IMAGE §3.2)
 * The profile-image crop is the SAME gesture over a different frame: a square
 * selection previewed as a circle. Rather than fork a second cropper — and with
 * it a second copy of the pan/zoom/clamp maths that is the easy part to get
 * subtly wrong — the output shape is now props. EVERY new prop defaults to the
 * cover's existing behavior (1280-wide JPEG at 0.85, square corners), so the
 * gallery cover path is byte-identical to before this change; the pins in
 * tests/components/imageCropperOutput.test.jsx assert exactly that.
 *
 * `circular` is a PREVIEW treatment only. The asset stays SQUARE at rest and the
 * frame is circular at render (§2) — never store a pre-masked circle, or every
 * future surface inherits this one's ring decision.
 */
import { useEffect, useRef, useState } from 'react';

import {
  clampOffset, centeredOffset, cropRectFromTransform, outputSize, } from './cropGeometry.js';
import { BORDER2, CARD_ALT, GOLD, MUTED, RED, SP, FS, sans } from '../theme.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';

const MAX_ZOOM = 4;
const ZOOM_STEPS = 0.01;

/** Local file selections (blob:/data:) are same-origin; only remote URLs need CORS. */
const needsCrossOrigin = (src) => typeof src === 'string' && !/^(blob:|data:)/i.test(src);

export default function ImageCropper({
  src, aspect = 16 / 9, onCancel, onCommit, busy = false,
  // Output shape — every default is the gallery cover's pre-existing behavior.
  outputMaxWidth = 1280, outputType = 'image/jpeg', outputQuality = 0.85,
  circular = false, applyLabel = 'Apply crop',
}) {
  const viewportRef = useRef(null);
  const imgRef = useRef(null);
  const dragRef = useRef(null);     // { startX, startY, ox, oy }
  const naturalRef = useRef(null);  // mirror of `natural` for non-reactive reads
  const zoomRef = useRef(1);        // mirror of `zoom` for the resize clamp

  const [natural, setNatural] = useState(null);       // { w, h }
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [zoom, setZoomState] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  // Single setter that keeps the ref mirror in lock-step with state.
  const setZoom = (z) => { zoomRef.current = z; setZoomState(z); };

  // Measure the viewport box (width drives height via aspect) and keep it in
  // sync on resize. The setState lives in the `measure` helper (not the effect
  // body) so it doesn't trip the cascading-render lint; on resize we re-clamp
  // the existing pan rather than recentring, so the user's framing is kept.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    const measure = () => {
      const w = el.clientWidth;
      const h = Math.round(w / aspect);
      setViewport((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
      const nat = naturalRef.current;
      if (nat && w) setOffset((prev) => clampOffset(prev, nat, { w, h }, zoomRef.current));
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(el);
    return () => { if (ro) ro.disconnect(); };
  }, [aspect]);

  // Centre the image at zoom 1 once it loads. Reading the live viewport size
  // from the ref keeps init in this event handler (no setState-in-effect).
  const onImgLoad = (e) => {
    const el = e.currentTarget;
    const nat = { w: el.naturalWidth, h: el.naturalHeight };
    naturalRef.current = nat;
    setNatural(nat);
    const vpEl = viewportRef.current;
    const w = vpEl?.clientWidth || viewport.w;
    const vp = { w, h: w ? Math.round(w / aspect) : viewport.h };
    setZoom(1);
    setOffset(centeredOffset(nat, vp, 1));
  };

  const applyZoom = (nextZoom) => {
    if (!natural || !viewport.w) return;
    const z = Math.min(MAX_ZOOM, Math.max(1, nextZoom));
    setZoom(z);
    // Keep the viewport centre stable while zooming, then re-clamp.
    setOffset((prev) => {
      const cx = viewport.w / 2;
      const cy = viewport.h / 2;
      const ratio = z / zoom;
      const next = { x: cx - (cx - prev.x) * ratio, y: cy - (cy - prev.y) * ratio };
      return clampOffset(next, natural, viewport, z);
    });
  };

  const onPointerDown = (e) => {
    if (!natural) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
    setDragging(true);
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || !natural) return;
    const next = { x: d.ox + (e.clientX - d.startX), y: d.oy + (e.clientY - d.startY) };
    setOffset(clampOffset(next, natural, viewport, zoom));
  };
  const onPointerUp = (e) => {
    dragRef.current = null;
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };
  const onWheel = (e) => {
    if (!natural) return;
    e.preventDefault();
    applyZoom(zoom * (e.deltaY < 0 ? 1.08 : 0.92));
  };

  const reset = () => {
    if (!natural) return;
    setZoom(1);
    setOffset(centeredOffset(natural, viewport, 1));
  };

  const commit = () => {
    const img = imgRef.current;
    if (!img || !natural || !viewport.w) return;
    setError(null);
    // Drawing a cross-origin image without an anonymous CORS grant taints the
    // canvas, so toBlob throws (or yields null). Surface a real error instead of
    // a silently dead Apply button.
    try {
      const rect = cropRectFromTransform({ natural, viewport, zoom, offset });
      const out = outputSize(aspect, outputMaxWidth);
      const canvas = document.createElement('canvas');
      canvas.width = out.w;
      canvas.height = out.h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setError(t('errors.cropPrepFail')); return; }
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, rect.sx, rect.sy, rect.sWidth, rect.sHeight, 0, 0, out.w, out.h);
      canvas.toBlob((blob) => {
        if (blob) onCommit?.(blob);
        else setError(t('errors.cropExportFail'));
      }, outputType, outputQuality);
    } catch {
      setError(t('errors.cropExportFail'));
    }
  };

  return (
    <div style={{ display: 'grid', gap: SP.sm }}>
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
        role="application"
        aria-label="Drag to reposition, scroll or use the slider to zoom"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: String(aspect),
          overflow: 'hidden',
          border: `1px solid ${BORDER2}`,
          background: CARD_ALT,
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
          // Preview treatment only — the exported asset is always the full
          // square. See the header: never store a pre-masked circle.
          ...(circular ? { borderRadius: '50%' } : null),
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- onLoad/onError are resource-load lifecycle events (onLoad reads naturalWidth/Height to drive crop geometry), not user interactions */}
        <img
          ref={imgRef}
          src={src}
          alt=""
          draggable={false}
          // Request an anonymous CORS grant for remote images so the canvas
          // isn't tainted on commit. Omitted for blob:/data: (same-origin).
          {...(needsCrossOrigin(src) ? { crossOrigin: 'anonymous' } : {})}
          onLoad={onImgLoad}
          onError={() => setError(t('errors.imageLoadFail'))}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${
              natural && viewport.w ? (Math.max(viewport.w / natural.w, viewport.h / natural.h) * zoom) : 1
            })`,
            transformOrigin: 'top left',
            width: natural ? `${natural.w}px` : 'auto',
            height: natural ? `${natural.h}px` : 'auto',
            maxWidth: 'none',
            pointerEvents: 'none',
          }}
        />
        {/* Subtle framing hint — follows the viewport's own shape. */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
          ...(circular ? { borderRadius: '50%' } : null),
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
        <span style={{ color: MUTED, flexShrink: 0, fontSize: FS.xxs, fontWeight: 800 }}>Zoom</span>
        <input
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={ZOOM_STEPS}
          value={zoom}
          onChange={(e) => applyZoom(Number(e.target.value))}
          aria-label="Zoom"
          style={{ flex: 1, accentColor: GOLD, cursor: 'pointer' }}
        />
        <IconButton
          glyph="↺"
          label="Reset zoom and position"
          onClick={reset}
          tone="default"
          size="md"
        />
      </div>

      <div style={{ display: 'flex', gap: SP.sm, justifyContent: 'flex-end' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </Button>
        <Button
          variant="gold"
          size="sm"
          onClick={commit}
          busy={busy}
          disabled={!natural}
        >
          {busy ? 'Uploading…' : applyLabel}
        </Button>
      </div>

      {error && (
        <div role="alert" data-testid="cropper-error" style={{ color: RED, fontFamily: sans, fontSize: FS.xs }}>
          {error}
        </div>
      )}
    </div>
  );
}
