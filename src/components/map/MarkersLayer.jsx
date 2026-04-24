/**
 * MarkersLayer — user-placed pin/star/skull/flag markers with optional
 * title and note. Drag to move (annotate/select), double-click to edit.
 */

import React, { useRef } from 'react';
import { useStore } from '../../store';
import { MAP_MODES, ANNOTATE_TOOLS } from '../../store/mapSlice.js';

export default function MarkersLayer() {
  const markers = useStore(s => s.mapState.markers);
  if (!markers?.length) return null;

  return (
    <g className="sf-markers-layer">
      {markers.map(m => <Marker key={m.id} marker={m} />)}
    </g>
  );
}

function Marker({ marker }) {
  const mapMode      = useStore(s => s.mapMode);
  const annotateTool = useStore(s => s.annotateTool);
  const selectedId   = useStore(s => s.selectedAnnotationId);
  const setSelected  = useStore(s => s.setSelectedAnnotationId);
  const updateMarker = useStore(s => s.updateMarker);

  const dragRef = useRef(null);
  const isEditable = mapMode === MAP_MODES.ANNOTATE && annotateTool === ANNOTATE_TOOLS.SELECT;
  const isSelected = selectedId === marker.id;

  function eventToMap(e) {
    const svgEl = e.currentTarget.ownerSVGElement;
    if (!svgEl) return null;
    const g = e.currentTarget.parentNode;
    const ctm = g.getScreenCTM?.();
    if (!ctm) return null;
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(ctm.inverse());
  }

  function handlePointerDown(e) {
    if (!isEditable) return;
    e.stopPropagation();
    setSelected(marker.id);
    const pt = eventToMap(e);
    if (!pt) return;
    dragRef.current = {
      grabDx: pt.x - marker.x,
      grabDy: pt.y - marker.y,
    };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  }

  function handlePointerMove(e) {
    if (!dragRef.current) return;
    const pt = eventToMap(e);
    if (!pt) return;
    updateMarker(marker.id, {
      x: pt.x - dragRef.current.grabDx,
      y: pt.y - dragRef.current.grabDy,
    });
  }

  function handlePointerUp(e) {
    dragRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {}
  }

  function handleDoubleClick(e) {
    if (!isEditable) return;
    e.stopPropagation();
    // eslint-disable-next-line no-alert
    const nextTitle = window.prompt('Marker title:', marker.title || '');
    if (nextTitle != null && nextTitle !== marker.title) {
      updateMarker(marker.id, { title: nextTitle });
    }
  }

  const iconKind = marker.icon || 'pin';
  const iconId = `sf-marker-${iconKind}`;
  // Explicit width/height/x/y so SVG2 doesn't default <use> to 100% of the
  // nearest viewport (which would render each marker at full map size).
  // Values come from each symbol's viewBox in MapOverlay.jsx <defs>.
  const ICON_BOX = {
    pin:   { x: -10, y: -24, w: 20, h: 24 },
    star:  { x: -12, y: -24, w: 24, h: 24 },
    skull: { x: -10, y: -20, w: 20, h: 20 },
    flag:  { x:  -2, y: -22, w: 16, h: 22 },
  };
  const box = ICON_BOX[iconKind] || ICON_BOX.pin;

  return (
    <g
      transform={`translate(${marker.x}, ${marker.y})`}
      style={{ cursor: isEditable ? 'move' : 'default', color: marker.color || '#a0762a' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      {isSelected && (
        <circle
          cx={0} cy={-12}
          r={18}
          fill="none"
          stroke="#a0762a"
          strokeWidth={1.2}
          strokeDasharray="3 2"
          strokeOpacity={0.8}
        />
      )}
      <use href={`#${iconId}`} x={box.x} y={box.y} width={box.w} height={box.h} />
      {marker.title && (
        <text
          x={0}
          y={8}
          fontFamily="Nunito, sans-serif"
          fontSize={9}
          fontWeight={700}
          fill="#1c1409"
          stroke="#fffbf5"
          strokeWidth={2}
          paintOrder="stroke"
          textAnchor="middle"
          pointerEvents="none"
          style={{ userSelect: 'none' }}
        >
          {marker.title}
        </text>
      )}
    </g>
  );
}
