/**
 * ImageCropper.jsx — landscape pan/zoom cropper (§3).
 *
 * Shows the chosen image inside a fixed-aspect (landscape) viewport, behaving
 * like CSS `object-fit: cover` at minimum zoom. The user drags to reposition
 * and uses the zoom slider (or wheel) to push in; on Apply we draw the visible
 * region to a canvas and hand back a JPEG Blob. All coordinate math lives in
 * the unit-tested cropGeometry module — this file is interaction + canvas only.
 *
 * No upload here: the parent (CoverImageField) owns file selection + storage.
 */
import { useEffect, useRef, useState } from 'react';
import { ZoomIn, RotateCcw, Check, X } from 'lucide-react';

import {
  clampOffset,
  centeredOffset,
  cropRectFromTransform,
  outputSize,
} from './cropGeometry.js';
import { BORDER, BORDER2, CARD, CARD_ALT, INK, BODY, GOLD, MUTED, sans, FS, R, SP } from '../theme.js';

const MAX_ZOOM = 4;
const ZOOM_STEPS = 0.01;

export default function ImageCropper({ src, aspect = 16 / 9, onCancel, onCommit, busy = false }) {
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
    const rect = cropRectFromTransform({ natural, viewport, zoom, offset });
    const out = outputSize(aspect, 1280);
    const canvas = document.createElement('canvas');
    canvas.width = out.w;
    canvas.height = out.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, rect.sx, rect.sy, rect.sWidth, rect.sHeight, 0, 0, out.w, out.h);
    canvas.toBlob((blob) => { if (blob) onCommit?.(blob); }, 'image/jpeg', 0.85);
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
          borderRadius: R.md,
          border: `1px solid ${BORDER2}`,
          background: CARD_ALT,
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- onLoad is a resource-load lifecycle event (reads naturalWidth/Height to drive crop geometry), not a user interaction */}
        <img
          ref={imgRef}
          src={src}
          alt=""
          draggable={false}
          onLoad={onImgLoad}
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
        {/* Subtle landscape framing hint */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
        <ZoomIn size={14} style={{ color: MUTED, flexShrink: 0 }} />
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
        <button
          type="button"
          onClick={reset}
          title="Reset zoom & position"
          style={iconBtn}
        >
          <RotateCcw size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: SP.sm, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} disabled={busy} style={ghostBtn}>
          <X size={13} /> Cancel
        </button>
        <button type="button" onClick={commit} disabled={busy || !natural} style={goldBtn(busy)}>
          <Check size={13} /> {busy ? 'Uploading…' : 'Apply crop'}
        </button>
      </div>
    </div>
  );
}

const iconBtn = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 28, height: 28, border: `1px solid ${BORDER2}`, borderRadius: R.sm,
  background: CARD, color: INK, cursor: 'pointer', flexShrink: 0,
};

const ghostBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '5px 10px', border: `1px solid ${BORDER}`, borderRadius: R.md,
  background: 'transparent', color: BODY, fontFamily: sans, fontSize: FS.xs, cursor: 'pointer',
};

const goldBtn = (busy) => ({
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '5px 11px', border: `1px solid ${GOLD}`, borderRadius: R.md,
  background: CARD, color: GOLD, fontFamily: sans, fontSize: FS.xs, fontWeight: 850,
  cursor: busy ? 'wait' : 'pointer',
});
