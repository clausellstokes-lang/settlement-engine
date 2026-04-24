/**
 * HitLayer — Invisible SVG rect that catches pointer events in annotate mode.
 *
 * Lives BEHIND the content group in SVG document order so individual label/
 * marker/forest elements get click priority. Only empty-canvas clicks reach
 * this rect. On click:
 *   - SELECT  → clears current selection
 *   - LABEL   → dispatch addLabel at the click position
 *   - MARKER  → dispatch addMarker at the click position
 *   - FOREST  → start a pointer-drag that paints trees under the cursor
 */

import React, { useRef } from 'react';
import { useStore } from '../../store';
import { ANNOTATE_TOOLS } from '../../store/mapSlice.js';

/**
 * Convert a pointer event (clientX/Y) into map-space coordinates.
 * The hit rect lives in the root SVG's viewBox coordinate space, so
 * `rect.getScreenCTM().inverse()` takes us from screen pixels to viewBox
 * units. Then we strip off the content group's transform with the stored
 * tx/ty/scale to land in raw map coordinates.
 */
function eventToMap(e, rectEl, transformRef) {
  if (!rectEl) return null;
  const svgEl = rectEl.ownerSVGElement;
  if (!svgEl) return null;
  const ctm = rectEl.getScreenCTM?.();
  if (!ctm) return null;
  const pt = svgEl.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  const vbPt = pt.matrixTransform(ctm.inverse());
  const { tx, ty, scale } = transformRef.current;
  const mapX = (vbPt.x - tx) / (scale || 1);
  const mapY = (vbPt.y - ty) / (scale || 1);
  return { x: mapX, y: mapY };
}

export default function HitLayer({ transformRef, width, height, tool }) {
  const rectRef = useRef(null);
  const dragRef = useRef(null);

  const addLabel  = useStore(s => s.addLabel);
  const addMarker = useStore(s => s.addMarker);
  const addForest = useStore(s => s.addForest);
  const clearSelection = useStore(s => s.setSelectedAnnotationId);

  function handleClick(e) {
    // Find the enclosing SVG once per event
    const pt = eventToMap(e, rectRef.current, transformRef);
    if (!pt) return;

    if (tool === ANNOTATE_TOOLS.SELECT) {
      clearSelection(null);
      return;
    }
    if (tool === ANNOTATE_TOOLS.LABEL) {
      addLabel({ x: pt.x, y: pt.y, text: 'New label' });
      return;
    }
    if (tool === ANNOTATE_TOOLS.MARKER) {
      addMarker({ x: pt.x, y: pt.y });
      return;
    }
    // FOREST is handled via pointer-down/move (brush drag)
  }

  function handlePointerDown(e) {
    if (tool !== ANNOTATE_TOOLS.FOREST) return;
    const pt = eventToMap(e, rectRef.current, transformRef);
    if (!pt) return;
    // Drop an initial stroke at the down point
    addForest({ x: pt.x, y: pt.y });
    dragRef.current = { lastX: pt.x, lastY: pt.y };
    // Capture pointer so move events still fire if cursor leaves the rect
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  }

  function handlePointerMove(e) {
    if (!dragRef.current) return;
    const pt = eventToMap(e, rectRef.current, transformRef);
    if (!pt) return;
    // Spacing: only add a new cluster every ~40 map units along the drag path
    const dx = pt.x - dragRef.current.lastX;
    const dy = pt.y - dragRef.current.lastY;
    const dist = Math.hypot(dx, dy);
    if (dist < 40) return;
    addForest({ x: pt.x, y: pt.y });
    dragRef.current.lastX = pt.x;
    dragRef.current.lastY = pt.y;
  }

  function handlePointerUp(e) {
    dragRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {}
  }

  const cursor =
    tool === ANNOTATE_TOOLS.LABEL  ? 'text' :
    tool === ANNOTATE_TOOLS.MARKER ? 'crosshair' :
    tool === ANNOTATE_TOOLS.FOREST ? 'cell' :
    'default';

  return (
    <rect
      ref={rectRef}
      x="0" y="0"
      width={width}
      height={height}
      fill="transparent"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ cursor, pointerEvents: 'all' }}
    />
  );
}
