/**
 * MapOverlay — React-owned SVG layer positioned over the FMG iframe.
 *
 * Subscribes to `fmg:viewport` broadcasts from the map bridge and mirrors
 * FMG's d3 zoom transform so that all children can be authored in map
 * coordinates directly (no manual re-projection on every pan/zoom).
 *
 * Renders:
 *   - RelationshipEdges  (settlement trade/allied/rival lines)
 *   - ChainEdges         (supply chain paths)
 *   - LabelsLayer        (user text labels)
 *   - MarkersLayer       (user pin markers)
 *   - ForestsLayer       (tree brush strokes)
 *   - HitLayer           (click-capture rect for annotate-mode drawing)
 *
 * The root <g> is mutated directly via ref on every viewport tick (60fps)
 * to avoid React re-renders during pan/zoom. Only viewport *size* changes
 * trigger a state update (rare — iframe resize).
 */

import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import RelationshipEdges from './map/RelationshipEdges.jsx';
import ChainEdges        from './map/ChainEdges.jsx';
import RegionalCausalityLayer from './map/RegionalCausalityLayer.jsx';
import RoadsLayer        from './map/RoadsLayer.jsx';
import LabelsLayer       from './map/LabelsLayer.jsx';
import MarkersLayer      from './map/MarkersLayer.jsx';
import ForestsLayer      from './map/ForestsLayer.jsx';
import HitLayer          from './map/HitLayer.jsx';
import TreeSymbols       from './map/TreeSymbols.jsx';
import PlacementsLayer   from './map/PlacementsLayer.jsx';
import { MAP_MODES }     from '../store/mapSlice.js';
import { TextInputDialog } from './primitives/Dialog.jsx';

export default function MapOverlay({ bridge, transformOut }) {
  const mapMode       = useStore(s => s.mapMode);
  const annotateTool  = useStore(s => s.annotateTool);
  const layers        = useStore(s => s.mapState.layers);
  const isDraggingOver = useStore(s => s.isDraggingOver);
  const updateLabel = useStore(s => s.updateLabel);
  const updateMarker = useStore(s => s.updateMarker);
  const pushMapUndo = useStore(s => s.pushMapUndo);
  // Custom image backdrop (Project 1): when set, this overlay IS the whole map —
  // it renders the image inside the transformed <g> and OWNS pan/zoom (there is
  // no FMG iframe / bridge viewport to mirror).
  const customBackdrop = useStore(s => s.mapState.customBackdrop);
  const imageMode = !!customBackdrop?.imageUrl;

  const wrapperRef = useRef(null);
  const gRef = useRef(null);
  const transformRef = useRef({ tx: 0, ty: 0, scale: 1, width: 0, height: 0 });
  // `size` drives the SVG viewBox. We deliberately use the wrapper's
  // observed pixel rect (not FMG's broadcast graphWidth/graphHeight) so the
  // overlay's coordinate system always matches the iframe's actual displayed
  // pixels. Otherwise any change to the iframe's CSS size — e.g. opening
  // the right-side LayersPanel, which narrows the map column — leaves the
  // viewBox stale and the overlay's icons drift away from the geography
  // beneath them.
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [editDialog, setEditDialog] = useState(null);

  // ── Viewport sync ────────────────────────────────────────────────────
  useEffect(() => {
    if (!bridge || imageMode) return; // image mode owns its own pan/zoom below

    const applyViewport = (vp) => {
      if (!vp || typeof vp !== 'object') return;
      const tx    = vp.tx    || 0;
      const ty    = vp.ty    || 0;
      const scale = vp.scale || 1;
      const width  = vp.width  || transformRef.current.width;
      const height = vp.height || transformRef.current.height;

      transformRef.current = { tx, ty, scale, width, height };

      // Direct DOM update — avoids React re-render on every pan tick
      if (gRef.current) {
        gRef.current.setAttribute('transform',
          `translate(${tx}, ${ty}) scale(${scale})`);
      }

      // Debounced store persistence (campaigns reload viewport on restore).
      // schedulePersist mutates persistTimerRef.current — legal in an
      // effect, but the immutability rule fires because the function is
      // defined-during-render even though only called-from-effects.
      // eslint-disable-next-line react-hooks/immutability
      schedulePersist(tx, ty, scale, width, height);
    };

    const off = bridge.on('viewport', applyViewport);

    // Fetch initial viewport once ready
    bridge.ready?.()
      .then(() => bridge.getViewport?.())
      .then((vp) => vp && applyViewport(vp))
      .catch(() => {});

    return () => { off?.(); };
  }, [bridge, imageMode]);

  // ── Image-mode pan/zoom (self-owned; no FMG to mirror) ────────────────
  const fittedRef = useRef(null); // imageUrl we've already fit, so we don't re-fit on every tick
  useEffect(() => {
    if (!imageMode) return;
    const el = wrapperRef.current;
    if (!el) return;
    const W = size.width || el.getBoundingClientRect().width || 1;
    const H = size.height || el.getBoundingClientRect().height || 1;
    const imgW = Number(customBackdrop.w) || W;
    const imgH = Number(customBackdrop.h) || H;

    const applyT = (t) => {
      transformRef.current = { ...transformRef.current, ...t, width: W, height: H };
      if (transformOut) transformOut.current = transformRef.current; // live read for the drop handler
      const { tx, ty, scale } = transformRef.current;
      if (gRef.current) gRef.current.setAttribute('transform', `translate(${tx}, ${ty}) scale(${scale})`);
      schedulePersist(tx, ty, scale, W, H);
    };

    // Initial fit: contain the image, centered — once per image (or reuse a
    // meaningful persisted viewport so a reloaded campaign keeps its camera).
    // Require a real layout box: if the overlay mounts before the flex column has
    // sized (W/H ≈ 0→1), DON'T commit fittedRef, so a later ResizeObserver run
    // performs the real fit instead of locking in a degenerate camera.
    if (W > 1 && H > 1 && fittedRef.current !== customBackdrop.imageUrl) {
      fittedRef.current = customBackdrop.imageUrl;
      const persisted = useStore.getState().mapState.viewport;
      // Only restore a camera that was saved IN image mode (same coordinate
      // space). A fresh import reset the viewport, so this falls through to fit.
      if (persisted && persisted.mode === 'image' && persisted.scale && persisted.width) {
        const scale = persisted.scale;
        applyT({ scale, tx: W / 2 - (persisted.cx || 0) * scale, ty: H / 2 - (persisted.cy || 0) * scale });
      } else {
        const scale = Math.min(W / imgW, H / imgH) || 1;
        applyT({ scale, tx: (W - imgW * scale) / 2, ty: (H - imgH * scale) / 2 });
      }
    }

    // Only pan when the gesture starts on the background/image, not on a
    // placement icon or annotation (those manage their own pointer handling).
    const isBackground = (target) => target === el || target.tagName === 'svg' || target.tagName === 'image';
    let panning = false; let lastX = 0; let lastY = 0;
    const onDown = (e) => {
      if (e.button !== 0 || !isBackground(e.target)) return;
      panning = true; lastX = e.clientX; lastY = e.clientY;
      try { el.setPointerCapture?.(e.pointerId); } catch { /* ignore */ }
    };
    const onMove = (e) => {
      if (!panning) return;
      applyT({ tx: transformRef.current.tx + (e.clientX - lastX), ty: transformRef.current.ty + (e.clientY - lastY) });
      lastX = e.clientX; lastY = e.clientY;
    };
    const onUp = () => { panning = false; };
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left; const cy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const next = Math.max(0.1, Math.min(8, transformRef.current.scale * factor));
      const k = next / transformRef.current.scale;
      applyT({ scale: next, tx: cx - (cx - transformRef.current.tx) * k, ty: cy - (cy - transformRef.current.ty) * k });
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [imageMode, customBackdrop?.imageUrl, customBackdrop?.w, customBackdrop?.h, size.width, size.height]);

  // ── Wrapper size sync (drives viewBox) ──────────────────────────────
  // Watch the wrapper's rendered rect via ResizeObserver. Toggling the
  // LayersPanel changes the parent flex layout, which reflows the iframe
  // and this overlay together — both shrink/grow simultaneously. By keying
  // the SVG viewBox off the observed rect, content rendered in pixel space
  // (the same space FMG uses internally, since #map has no viewBox of its
  // own) stays pixel-aligned with the underlying geography across resizes.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      setSize(prev => (prev.width === w && prev.height === h) ? prev : { width: w, height: h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Debounced viewport persistence — don't thrash Immer on pan ticks
  const persistTimerRef = useRef(null);
  function schedulePersist(tx, ty, scale, width, height) {
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      const cx = (width / 2 - tx) / (scale || 1);
      const cy = (height / 2 - ty) / (scale || 1);
      useStore.getState().setMapViewport({ cx, cy, scale, width, height });
    }, 500);
  }

  // ── Pointer-events gating ────────────────────────────────────────────
  // View mode: overlay is entirely passive (clicks pass through to iframe).
  // Terrain mode: also passive (FMG handles its own editor clicks).
  // Annotate mode: overlay captures pointer events.
  // Exception: during drag-drop of a settlement, we always pass through
  // so the drop lands on the iframe (which has the placement handler).
  const overlayInteractive =
    mapMode === MAP_MODES.ANNOTATE && !isDraggingOver;

  const wrapperStyle = {
    position: 'absolute',
    inset: 0,
    // Image mode: the overlay IS the map, so it must capture pan/zoom + drops.
    pointerEvents: (overlayInteractive || imageMode) ? 'auto' : 'none',
    zIndex: 5,  // above iframe, below DOM toolbars
    cursor: imageMode && !overlayInteractive ? 'grab' : undefined,
  };

  const svgStyle = {
    display: 'block',
    width:  '100%',
    height: '100%',
    overflow: 'visible',
  };

  const vbW = size.width  || 1;
  const vbH = size.height || 1;

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <svg
        style={svgStyle}
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="none"
      >
        <defs>
          <TreeSymbols />
          {/* Pin marker icon */}
          <symbol id="sf-marker-pin" viewBox="-10 -24 20 24">
            <path
              d="M 0 0 Q -10 -12 -10 -16 Q -10 -24 0 -24 Q 10 -24 10 -16 Q 10 -12 0 0 Z"
              fill="currentColor" stroke="#1c1409" strokeWidth="1.2"
            />
            <circle cx="0" cy="-16" r="4" fill="#fffbf5" />
          </symbol>
          {/* Star marker */}
          <symbol id="sf-marker-star" viewBox="-12 -24 24 24">
            <path
              d="M 0 -24 L 4 -14 L 14 -14 L 6 -7 L 10 3 L 0 -3 L -10 3 L -6 -7 L -14 -14 L -4 -14 Z"
              fill="currentColor" stroke="#1c1409" strokeWidth="1.2"
            />
          </symbol>
          {/* Skull marker (danger) */}
          <symbol id="sf-marker-skull" viewBox="-10 -20 20 20">
            <ellipse cx="0" cy="-10" rx="8" ry="8" fill="currentColor" stroke="#1c1409" strokeWidth="1.2" />
            <circle cx="-3" cy="-11" r="1.6" fill="#1c1409" />
            <circle cx="3"  cy="-11" r="1.6" fill="#1c1409" />
            <rect x="-4" y="-6" width="1.2" height="3" fill="#1c1409" />
            <rect x="-1" y="-6" width="1.2" height="3" fill="#1c1409" />
            <rect x="2"  y="-6" width="1.2" height="3" fill="#1c1409" />
          </symbol>
          {/* Flag marker */}
          <symbol id="sf-marker-flag" viewBox="-2 -22 16 22">
            <rect x="0" y="-22" width="1.5" height="22" fill="#1c1409" />
            <path d="M 1.5 -22 L 14 -18 L 1.5 -14 Z" fill="currentColor" stroke="#1c1409" strokeWidth="0.8" />
          </symbol>
        </defs>

        {/* Hit layer — bottom of the stack so content layers get click priority */}
        {overlayInteractive && (
          <HitLayer
            transformRef={transformRef}
            width={vbW}
            height={vbH}
            tool={annotateTool}
          />
        )}

        {/* Content group — transformed to match FMG's d3 zoom (image mode: a
            self-owned pan/zoom transform). The custom backdrop is the bottom
            child so all app layers sit on top of it and pan/zoom together. */}
        <g ref={gRef}>
          {imageMode && (
            <image
              href={customBackdrop.imageUrl}
              x={0} y={0}
              width={Number(customBackdrop.w) || undefined}
              height={Number(customBackdrop.h) || undefined}
              preserveAspectRatio="xMidYMid meet"
              style={{ pointerEvents: 'none' }}
            />
          )}
          {layers.forests       && <ForestsLayer />}
          {/* Geography-derived charted trails need FMG pack.cells — omitted in
              image mode (relationship/chain straight-line edges still render). */}
          {layers.roads && !imageMode && <RoadsLayer bridge={bridge} />}
          {layers.chains        && <ChainEdges />}
          {layers.relationships && <RelationshipEdges />}
          <RegionalCausalityLayer />
          {layers.placements !== false && <PlacementsLayer transformRef={transformRef} />}
          {layers.markers       && <MarkersLayer onEditMarker={marker => setEditDialog({ kind: 'marker', item: marker })} />}
          {layers.labels        && <LabelsLayer onEditLabel={label => setEditDialog({ kind: 'label', item: label })} />}
        </g>
      </svg>
      <TextInputDialog
        open={!!editDialog}
        title={editDialog?.kind === 'marker' ? 'Edit marker title' : 'Edit label'}
        label={editDialog?.kind === 'marker' ? 'Marker title' : 'Label text'}
        initialValue={editDialog?.item?.title || editDialog?.item?.text || ''}
        confirmLabel="Save"
        onConfirm={(value) => {
          if (editDialog?.kind === 'marker') {
            if (value !== editDialog.item.title) {
              pushMapUndo('edit marker'); // snapshot so the text edit is undoable
              updateMarker(editDialog.item.id, { title: value });
            }
          } else if (editDialog?.kind === 'label') {
            if (value !== editDialog.item.text) {
              pushMapUndo('edit label');
              updateLabel(editDialog.item.id, { text: value });
            }
          }
          setEditDialog(null);
        }}
        onCancel={() => setEditDialog(null)}
      />
    </div>
  );
}
