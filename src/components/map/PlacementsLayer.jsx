/**
 * PlacementsLayer — renders one TierIcon per settlement placement.
 *
 * Reads `mapState.placements` and looks up each settlement in
 * `savedSettlements` to determine tier, port, and capital flags.
 * Click selects the burg via `setSelectedBurgId`.
 *
 * Subscribes only to placements + saves + selection + viewport scale.
 * Uses pointer-events:auto on each icon group while the surrounding
 * overlay div remains pointer-events:none in view mode, so map pan
 * still works between icons.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../store';
import TierIcon, { tierFor } from './TierIcon.jsx';

/** Subscribe only to viewport.scale changes for counter-scaling. */
function useViewportScale() {
  const [scale, setScale] = useState(() => useStore.getState().mapState.viewport.scale || 1);
  useEffect(() => {
    return useStore.subscribe(
      s => s.mapState.viewport.scale,
      next => setScale(next || 1),
    );
  }, []);
  return scale;
}

export default function PlacementsLayer({ transformRef }) {
  const placements            = useStore(s => s.mapState.placements);
  const saves                 = useStore(s => s.savedSettlements);
  const selectedBurgId        = useStore(s => s.selectedBurgId);
  const selectedSettlementId  = useStore(s => s.selectedSettlementId);
  const setSelectedBurg       = useStore(s => s.setSelectedBurgId);
  const setSelectedSettlement = useStore(s => s.setSelectedSettlementId);
  const updatePlacement       = useStore(s => s.updatePlacement);

  // Drag-to-move state for the currently-selected placement.
  // Holds { burgId, pointerId, origin:{sx,sy}, startPt:{x,y} } during drag.
  const dragRef = useRef(null);
  // Transient preview override so the icon follows the cursor without
  // spamming the Immer store on every pointermove.
  const [dragPreview, setDragPreview] = useState(null);

  // Prefer the live transformRef.scale (updated every viewport tick) and
  // fall back to the persisted store value. Re-renders happen only when
  // the persisted scale rolls over (debounced by MapOverlay's 500ms).
  const persistedScale = useViewportScale();
  const scale = (transformRef?.current?.scale) || persistedScale || 1;

  const saveById = useMemo(() => {
    const m = new Map();
    for (const s of saves || []) m.set(s.id, s);
    return m;
  }, [saves]);

  const items = useMemo(() => {
    const out = [];
    for (const [burgId, p] of Object.entries(placements || {})) {
      if (typeof p?.x !== 'number' || typeof p?.y !== 'number') continue;
      const settlement = saveById.get(p.settlementId) || null;
      const tier = tierFor(settlement || { population: p.population });
      out.push({
        burgId,
        settlementId: p.settlementId || null,
        x: p.x, y: p.y,
        tier,
        name: settlement?.name || p.name || '',
        port:    !!(settlement?.tradeRouteAccess === 'port' || settlement?.port),
        capital: !!(settlement?.capital || settlement?.isCapital),
      });
    }
    return out;
  }, [placements, saveById]);

  if (!items.length) return null;

  // Convert a screen pointer event to FMG map coordinates using the live
  // viewport transform (same math as the overlay's g transform inverse).
  function screenToMap(e) {
    const tf = transformRef?.current || { tx: 0, ty: 0, scale: 1 };
    const svgEl = e.currentTarget?.ownerSVGElement || e.target?.ownerSVGElement;
    if (!svgEl) return null;
    const rect = svgEl.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const s = tf.scale || 1;
    return { x: (sx - tf.tx) / s, y: (sy - tf.ty) / s };
  }

  function handleDragPointerDown(e, it) {
    // Only drag if this icon is already selected — avoids hijacking a fresh
    // click on a non-selected icon (which should just select it).
    const isSelected =
      String(selectedBurgId) === String(it.burgId) ||
      (it.settlementId && String(selectedSettlementId) === String(it.settlementId));
    if (!isSelected) return;
    if (e.button !== undefined && e.button !== 0) return;
    const pt = screenToMap(e);
    if (!pt) return;
    e.stopPropagation?.();
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch (_) {}
    dragRef.current = {
      burgId: it.burgId,
      pointerId: e.pointerId,
      origin: { sx: e.clientX, sy: e.clientY },
      startPt: { x: it.x, y: it.y },
      moved: false,
    };
  }

  function handleDragPointerMove(e) {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.origin.sx;
    const dy = e.clientY - d.origin.sy;
    // Dead-zone so a small jitter during click doesn't move the icon.
    if (!d.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
    d.moved = true;
    const pt = screenToMap(e);
    if (!pt) return;
    setDragPreview({ burgId: d.burgId, x: pt.x, y: pt.y });
  }

  function handleDragPointerUp(e) {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch (_) {}
    if (d.moved && dragPreview && dragPreview.burgId === d.burgId) {
      updatePlacement(d.burgId, { x: dragPreview.x, y: dragPreview.y });
    }
    dragRef.current = null;
    setDragPreview(null);
  }

  return (
    <g className="sf-placements-layer">
      {items.map(it => {
        const isSelected =
          String(selectedBurgId) === String(it.burgId) ||
          (it.settlementId && String(selectedSettlementId) === String(it.settlementId));
        const preview = (dragPreview && dragPreview.burgId === it.burgId) ? dragPreview : null;
        const x = preview ? preview.x : it.x;
        const y = preview ? preview.y : it.y;
        return (
          <g key={it.burgId} style={{ pointerEvents: 'auto' }}>
            <TierIcon
              x={x}
              y={y}
              tier={it.tier}
              port={it.port}
              capital={it.capital}
              selected={isSelected}
              scale={scale}
              label={it.name}
              cursor={isSelected ? 'grab' : 'pointer'}
              onClick={(e) => {
                // Suppress the click that fires at pointerup after a drag.
                if (dragRef.current && dragRef.current.moved) return;
                e.stopPropagation?.();
                setSelectedBurg(it.burgId);
                setSelectedSettlement(it.settlementId);
              }}
              onPointerDown={(e) => handleDragPointerDown(e, it)}
              onPointerMove={handleDragPointerMove}
              onPointerUp={handleDragPointerUp}
              onPointerCancel={handleDragPointerUp}
            />
          </g>
        );
      })}
    </g>
  );
}
