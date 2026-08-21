/**
 * components/townMap/SettlementMapPanorama — the PANORAMA overlay layer (#38).
 *
 * A static, non-interactive oblique-projection layer the SettlementMapPane mounts on
 * top of the interactive plan when the viewer flips to 'panorama' view. It renders the
 * shared draw-op vocabulary (poly / line / circle / rect / path) produced by
 * domain/townMap/townPanorama.js as React SVG elements — the panorama re-poses the SAME
 * model (edits + lens already baked in), so it honors WYSIWYG. Extracted as its own leaf
 * so the pane stays under its line ceiling and this stays out of the first-paint closure
 * (imported only by the already-lazy pane).
 */

/** One panorama draw-op → a React SVG element. No pointer events (a presentation layer).
 *  @param {import('../../domain/townMap/townMapDraw.js').DrawOp} op @param {number} i */
function opElement(op, i) {
  const key = `pano.${i}`;
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
 * The oblique-panorama overlay (fills its positioned parent). Static — pointer events
 * off — so the interactive plan behind it stays reachable when flipped back.
 * @param {{ ops: import('../../domain/townMap/townMapDraw.js').DrawOp[], bg: string, name?: string }} props
 */
export default function SettlementMapPanorama({ ops, bg, name }) {
  return (
    <svg
      data-town-panorama
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', background: bg }}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Panorama of ${name || 'settlement'}`}
    >
      {(Array.isArray(ops) ? ops : []).map((op, i) => opElement(op, i))}
    </svg>
  );
}
