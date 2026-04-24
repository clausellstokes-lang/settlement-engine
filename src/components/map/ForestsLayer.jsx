/**
 * ForestsLayer — renders forest brush strokes from mapState.forests.
 *
 * Each forest entry is a { x, y, radius, density, treeStyle } record.
 * We scatter trees within the radius using a deterministic PRNG seeded by
 * the forest id so trees don't jitter on re-render. Each tree is a <use>
 * reference to the <symbol> defs in MapOverlay's TreeSymbols.
 */

import React, { useMemo, useRef } from 'react';
import { useStore } from '../../store';
import { MAP_MODES, ANNOTATE_TOOLS } from '../../store/mapSlice.js';

/** Mulberry32 — small deterministic PRNG */
function prng(seed) {
  let t = seed | 0;
  return function() {
    t = (t + 0x6D2B79F5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = r + Math.imul(r ^ (r >>> 7), 61 | r) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

export default function ForestsLayer() {
  const forests = useStore(s => s.mapState.forests);
  if (!forests?.length) return null;

  return (
    <g className="sf-forests-layer">
      {forests.map(f => <Forest key={f.id} forest={f} />)}
    </g>
  );
}

function Forest({ forest }) {
  const mapMode      = useStore(s => s.mapMode);
  const annotateTool = useStore(s => s.annotateTool);
  const selectedId   = useStore(s => s.selectedAnnotationId);
  const setSelected  = useStore(s => s.setSelectedAnnotationId);
  const updateForest = useStore(s => s.updateForest);

  const dragRef = useRef(null);
  const isEditable = mapMode === MAP_MODES.ANNOTATE && annotateTool === ANNOTATE_TOOLS.SELECT;
  const isSelected = selectedId === forest.id;

  const trees = useMemo(() => {
    const radius = forest.radius || 60;
    const density = forest.density ?? 0.4;
    // Scatter count scales with area and density
    const area = Math.PI * radius * radius;
    const count = Math.max(3, Math.min(120, Math.round(area * density / 400)));
    const rand = prng(hashId(forest.id || 'forest'));

    const out = [];
    for (let i = 0; i < count; i++) {
      // Uniform disk sampling
      const r = radius * Math.sqrt(rand());
      const theta = rand() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;
      const size = 14 + rand() * 8;
      out.push({ x, y, size });
    }
    // Sort by y so back trees render behind front trees
    out.sort((a, b) => a.y - b.y);
    return out;
  }, [forest.id, forest.radius, forest.density]);

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
    setSelected(forest.id);
    const pt = eventToMap(e);
    if (!pt) return;
    dragRef.current = {
      grabDx: pt.x - forest.x,
      grabDy: pt.y - forest.y,
    };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  }

  function handlePointerMove(e) {
    if (!dragRef.current) return;
    const pt = eventToMap(e);
    if (!pt) return;
    updateForest(forest.id, {
      x: pt.x - dragRef.current.grabDx,
      y: pt.y - dragRef.current.grabDy,
    });
  }

  function handlePointerUp(e) {
    dragRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {}
  }

  const symbolId = `sf-tree-${forest.treeStyle || 'pine'}`;

  return (
    <g
      transform={`translate(${forest.x}, ${forest.y})`}
      style={{ cursor: isEditable ? 'move' : 'default' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {isSelected && (
        <circle
          cx={0} cy={0}
          r={forest.radius || 60}
          fill="none"
          stroke="#a0762a"
          strokeWidth={1}
          strokeDasharray="3 3"
          strokeOpacity={0.8}
        />
      )}
      {trees.map((t, i) => (
        <use
          key={i}
          href={`#${symbolId}`}
          x={t.x - t.size / 2}
          y={t.y - t.size}
          width={t.size}
          height={t.size * 1.5}
        />
      ))}
    </g>
  );
}
