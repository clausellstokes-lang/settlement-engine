/**
 * components/townMap/SettlementMapAgeOverlay — THE AGED MAP layer (VISION V-15).
 *
 * "Show the years." A DERIVED-ONLY overlay drawn from the town's urban-fabric memory:
 * growth thickening, decade-fading calamity scars, reconstruction patina. It mounts
 * UNDER the interactive layers (pointer events off) and renders the SAME five-op
 * vocabulary the illustrated underlay uses — but through ageOverlayOps, so
 * buildTownMapDrawList (the golden'd draw path) is never touched and every existing
 * town-map golden holds by construction.
 *
 * A lazy leaf (imported only by the already-lazy pane) so the max-lines-capped pane
 * grows by one call and this stays out of the first-paint closure. Toggle OFF ⇒ the
 * pane does not mount this ⇒ the base render is byte-exact.
 *
 * @enforced-by tests/domain/ageOverlay.test.js + tests/property/ageOverlayGolden.test.js
 */

import { useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { deriveAgePortrait, ageOverlayOps } from '../../domain/townMap/ageOverlay.js';

/** The bounded AGE style — the ONLY style naming opacity.age / stroke.age (the
 *  dormancy wall gate in ageOverlayOps). `ink` is threaded from the active lens so
 *  the wear reads in the map's own register. */
const AGE_OPACITY = 0.5;
const AGE_STROKE = 1.4;

/** One draw-op → a React SVG element (the shared five-op vocabulary; the
 *  IllustratedUnderlay idiom, kept local so this leaf imports no sibling).
 *  @param {import('../../domain/townMap/townMapDraw.js').DrawOp} op @param {number} i */
function opElement(op, i) {
  const key = `age.${i}`;
  switch (op.t) {
    case 'line':
      return <line key={key} x1={op.x1} y1={op.y1} x2={op.x2} y2={op.y2} stroke={op.stroke} strokeOpacity={op.strokeOpacity} strokeWidth={op.strokeWidth} strokeLinecap="round" />;
    case 'circle':
      return <circle key={key} cx={op.cx} cy={op.cy} r={op.r} fill={op.fill || 'none'} stroke={op.stroke} strokeWidth={op.strokeWidth} />;
    case 'poly': {
      const pts = op.pts.map(([x, y]) => `${x},${y}`).join(' ');
      const common = { points: pts, fill: op.fill || 'none', fillOpacity: op.fillOpacity, stroke: op.stroke || 'none', strokeOpacity: op.strokeOpacity, strokeWidth: op.strokeWidth };
      return op.closed ? <polygon key={key} {...common} /> : <polyline key={key} {...common} strokeLinecap="round" strokeLinejoin="round" />;
    }
    default:
      return null;
  }
}

/**
 * "Show the years" is the shared `timelapseTick` (V-3): null ⇒ off (renders
 * nothing — toggle-off is byte-exact); a number ⇒ the wear is drawn AS OF that
 * week, so the V-3 scrubber, when a town map is open, walks the town's wear
 * backward. The town toolbar's "Years" toggle sets it to the live week.
 * @param {Object} props
 * @param {import('../../domain/townMap/townMapModel.js').TownMapModel} props.model
 * @param {{ urbanFabric?: unknown }|null} props.settlement
 * @param {string} [props.ink]        the active lens ink (the wear's colour)
 */
export default function SettlementMapAgeOverlay({ model, settlement, ink = '#4a4030' }) {
  const asOfWeek = useStore((s) => s.timelapseTick);
  const ops = useMemo(() => {
    if (asOfWeek == null) return [];
    const portrait = deriveAgePortrait({ settlement, asOfWeek });
    return ageOverlayOps(model, { ink, opacity: { age: AGE_OPACITY }, stroke: { age: AGE_STROKE } }, portrait);
  }, [model, settlement, ink, asOfWeek]);
  if (ops.length === 0) return null;
  return (
    <g data-town-age-overlay data-testid="town-age-overlay" style={{ pointerEvents: 'none' }}>
      {ops.map((op, i) => opElement(op, i))}
    </g>
  );
}
