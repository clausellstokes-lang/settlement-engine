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

import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import RelationshipEdges from './map/RelationshipEdges.jsx';
import ChainEdges        from './map/ChainEdges.jsx';
import RoadsLayer        from './map/RoadsLayer.jsx';
import LabelsLayer       from './map/LabelsLayer.jsx';
import MarkersLayer      from './map/MarkersLayer.jsx';
import ForestsLayer      from './map/ForestsLayer.jsx';
import HitLayer          from './map/HitLayer.jsx';
import TreeSymbols       from './map/TreeSymbols.jsx';
import PlacementsLayer   from './map/PlacementsLayer.jsx';
import { MAP_MODES }     from '../store/mapSlice.js';

export default function MapOverlay({ bridge }) {
  const mapMode       = useStore(s => s.mapMode);
  const annotateTool  = useStore(s => s.annotateTool);
  const layers        = useStore(s => s.mapState.layers);
  const isDraggingOver = useStore(s => s.isDraggingOver);

  const gRef = useRef(null);
  const transformRef = useRef({ tx: 0, ty: 0, scale: 1, width: 0, height: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  // ── Viewport sync ────────────────────────────────────────────────────
  useEffect(() => {
    if (!bridge) return;

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

      // Only resize when dimensions actually change
      setSize(prev => {
        if (prev.width === width && prev.height === height) return prev;
        return { width, height };
      });

      // Debounced store persistence (campaigns reload viewport on restore)
      schedulePersist(tx, ty, scale, width, height);
    };

    const off = bridge.on('viewport', applyViewport);

    // Fetch initial viewport once ready
    bridge.ready?.()
      .then(() => bridge.getViewport?.())
      .then((vp) => vp && applyViewport(vp))
      .catch(() => {});

    return () => { off?.(); };
  }, [bridge]);

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
    pointerEvents: overlayInteractive ? 'auto' : 'none',
    zIndex: 5,  // above iframe, below DOM toolbars
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
    <div style={wrapperStyle}>
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

        {/* Content group — transformed to match FMG's d3 zoom */}
        <g ref={gRef}>
          {layers.forests       && <ForestsLayer />}
          {layers.roads         && <RoadsLayer bridge={bridge} />}
          {layers.chains        && <ChainEdges />}
          {layers.relationships && <RelationshipEdges />}
          {layers.placements !== false && <PlacementsLayer transformRef={transformRef} />}
          {layers.markers       && <MarkersLayer />}
          {layers.labels        && <LabelsLayer />}
        </g>
      </svg>
    </div>
  );
}
