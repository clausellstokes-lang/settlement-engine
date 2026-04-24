/**
 * LabelsLayer — renders user-placed text labels from mapState.labels.
 *
 * Each label supports:
 *   - Click to select
 *   - Drag to move (annotate mode only)
 *   - Inline edit on double-click (prompts for new text)
 *   - Delete via selection panel / keyboard
 */

import React, { useRef } from 'react';
import { useStore } from '../../store';
import { MAP_MODES, ANNOTATE_TOOLS } from '../../store/mapSlice.js';

export default function LabelsLayer() {
  const labels = useStore(s => s.mapState.labels);

  if (!labels?.length) return null;

  return (
    <g className="sf-labels-layer">
      {labels.map(lbl => <Label key={lbl.id} label={lbl} />)}
    </g>
  );
}

function Label({ label }) {
  const mapMode       = useStore(s => s.mapMode);
  const annotateTool  = useStore(s => s.annotateTool);
  const selectedId    = useStore(s => s.selectedAnnotationId);
  const setSelected   = useStore(s => s.setSelectedAnnotationId);
  const updateLabel   = useStore(s => s.updateLabel);
  const deleteLabel   = useStore(s => s.deleteLabel);

  const dragRef = useRef(null);
  const isEditable = mapMode === MAP_MODES.ANNOTATE && annotateTool === ANNOTATE_TOOLS.SELECT;
  const isSelected = selectedId === label.id;

  function eventToMap(e) {
    const svgEl = e.currentTarget.ownerSVGElement;
    if (!svgEl) return null;
    // Get the CTM of the enclosing transformed <g> (the parent of this <g>)
    const g = e.currentTarget.parentNode;
    const ctm = g.getScreenCTM?.();
    if (!ctm) return null;
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const mapPt = pt.matrixTransform(ctm.inverse());
    return { x: mapPt.x, y: mapPt.y };
  }

  function handlePointerDown(e) {
    if (!isEditable) return;
    e.stopPropagation();
    setSelected(label.id);
    const pt = eventToMap(e);
    if (!pt) return;
    dragRef.current = {
      grabDx: pt.x - label.x,
      grabDy: pt.y - label.y,
      moved: false,
    };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  }

  function handlePointerMove(e) {
    if (!dragRef.current) return;
    const pt = eventToMap(e);
    if (!pt) return;
    dragRef.current.moved = true;
    updateLabel(label.id, {
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
    const next = window.prompt('Label text:', label.text || '');
    if (next != null && next !== label.text) {
      updateLabel(label.id, { text: next });
    }
  }

  return (
    <g
      transform={`translate(${label.x}, ${label.y}) rotate(${label.rotation || 0})`}
      style={{ cursor: isEditable ? 'move' : 'default' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      {isSelected && (
        <rect
          x={-4} y={-(label.fontSize || 16) - 2}
          width={String(label.text || '').length * (label.fontSize || 16) * 0.5 + 8}
          height={(label.fontSize || 16) + 6}
          fill="#a0762a"
          fillOpacity={0.15}
          stroke="#a0762a"
          strokeWidth={0.8}
          strokeDasharray="2 2"
          rx={2}
        />
      )}
      <text
        x={0}
        y={0}
        fontFamily={label.fontFamily || 'serif'}
        fontSize={label.fontSize || 16}
        fontWeight={600}
        fill={label.color || '#1c1409'}
        stroke="#fffbf5"
        strokeWidth={label.fontSize ? Math.max(2, label.fontSize * 0.15) : 3}
        strokeOpacity={0.85}
        paintOrder="stroke"
        style={{ userSelect: 'none' }}
      >
        {label.text || 'Label'}
      </text>
    </g>
  );
}
