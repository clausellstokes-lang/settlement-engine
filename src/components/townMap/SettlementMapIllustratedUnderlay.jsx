/**
 * components/townMap/SettlementMapIllustratedUnderlay — THE ILLUSTRATED UNDERLAY (IT-1).
 *
 * In illustrated mode the pane does NOT re-implement the art in JSX. It mounts THIS static
 * layer — the SAME buildTownMapDrawList output the exports use (the ONE geometry source) —
 * UNDER the interactive layers, whose fills go transparent for hit-testing. So the on-screen
 * art and every export surface (SVG / PDF / thumbnail / raster) render ONE geometry and can
 * never diverge (the landform/panorama precedent, now applied to the whole illustrated map).
 *
 * Static — pointer events off — so the district / building / condition / hazard hit-targets
 * above it still fire. A lazy leaf (imported only by the already-lazy pane) so the max-lines-
 * capped pane grows by one call and this stays out of the first-paint closure.
 */

import { useMemo } from 'react';
import { buildTownMapDrawList } from '../../domain/townMap/index.js';

/** One draw-op → a React SVG element (the shared five-op vocabulary). No pointer events.
 *  @param {import('../../domain/townMap/townMapDraw.js').DrawOp} op @param {number} i */
function opElement(op, i) {
  const key = `il.${i}`;
  switch (op.t) {
    case 'poly': {
      const pts = op.pts.map(([x, y]) => `${x},${y}`).join(' ');
      const common = { points: pts, fill: op.fill || 'none', fillOpacity: op.fillOpacity, stroke: op.stroke || 'none', strokeOpacity: op.strokeOpacity, strokeWidth: op.strokeWidth };
      return op.closed
        ? <polygon key={key} {...common} />
        : <polyline key={key} {...common} strokeLinecap="round" strokeLinejoin="round" />;
    }
    case 'line':
      return <line key={key} x1={op.x1} y1={op.y1} x2={op.x2} y2={op.y2} stroke={op.stroke} strokeOpacity={op.strokeOpacity} strokeWidth={op.strokeWidth} strokeLinecap="round" />;
    case 'circle':
      return <circle key={key} cx={op.cx} cy={op.cy} r={op.r} fill={op.fill || 'none'} stroke={op.stroke} strokeWidth={op.strokeWidth} />;
    case 'rect':
      return <rect key={key} x={op.x} y={op.y} width={op.w} height={op.h} rx={op.rx} fill={op.fill || 'none'} fillOpacity={op.fillOpacity} stroke={op.stroke} strokeWidth={op.strokeWidth} />;
    case 'path':
      return <path key={key} d={op.d} fill={op.fill || 'none'} stroke={op.stroke} strokeWidth={op.strokeWidth} strokeLinejoin="round" />;
    default:
      return null;
  }
}

/**
 * The static illustrated art layer (fills its 0..1000 map-space parent group). The optional
 * `dress` (IT-3) carries the season/state portrait into the SAME draw list the exports use, so
 * the on-screen season and every export stay one geometry; absent ⇒ seasonless base bytes.
 * @param {{ model: import('../../domain/townMap/townMapModel.js').TownMapModel, lens: string|object, dress?: import('../../domain/townMap/groundDress.js').MapDress | null }} props
 */
export default function SettlementMapIllustratedUnderlay({ model, lens, dress = null }) {
  const ops = useMemo(() => buildTownMapDrawList(model, lens, dress), [model, lens, dress]);
  return (
    <g data-town-illustrated style={{ pointerEvents: 'none' }}>
      {ops.map((op, i) => opElement(op, i))}
    </g>
  );
}
