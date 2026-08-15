/**
 * components/townMap/SettlementMapLandform — THE NON-WATER LANDFORM layer (task #38
 * fenced follow-up).
 *
 * A static, non-interactive terrain-texture layer the SettlementMapPane mounts under
 * the urban layer (after the water, before the roads) when the v2 site is a marsh /
 * dune-field / mountain-flank. It draws the SAME marks the export draw list emits —
 * it calls landformDrawOps (the one geometry/weight/opacity source) and re-poses each
 * op to a React SVG element — so the on-screen map, the PDF plate, the thumbnail, and
 * the panorama all render ONE landform (WYSIWYG). The ink follows the pane's active
 * palette (`ink`): a theme token under the default lens, the style ink under a chosen
 * lens — matching every other element the pane draws.
 *
 * Extracted as its own leaf so the pane (a max-lines-capped hot file) grows by one
 * call, and so this stays out of the first-paint closure (imported only by the already-
 * lazy pane). Renders nothing when the model carries no landform (water/plain/v1).
 */

import { landformDrawOps } from '../../domain/townMap/index.js';

/** One landform draw-op → a React SVG element, painted in the pane's active ink. The
 *  op vocabulary landformDrawOps emits is exactly circle (stipple) / line (reed·hachure)
 *  / open-poly (contour). @param {import('../../domain/townMap/townMapDraw.js').DrawOp} op
 *  @param {number} i @param {string} ink */
function markElement(op, i, ink) {
  const key = `lf.${i}`;
  if (op.t === 'circle') {
    return <circle key={key} cx={op.cx} cy={op.cy} r={op.r} fill={ink} />;
  }
  if (op.t === 'line') {
    return <line key={key} x1={op.x1} y1={op.y1} x2={op.x2} y2={op.y2} stroke={ink} strokeWidth={op.strokeWidth} strokeOpacity={op.strokeOpacity} strokeLinecap="round" />;
  }
  // open poly — a contour curve
  const pts = op.pts.map(([x, y]) => `${x},${y}`).join(' ');
  return <polyline key={key} points={pts} fill="none" stroke={ink} strokeWidth={op.strokeWidth} strokeOpacity={op.strokeOpacity} strokeLinecap="round" strokeLinejoin="round" />;
}

/**
 * The non-water landform texture layer (fills its 0..1000 map-space parent group).
 * Static — pointer events off — so the interactive layers above stay reachable.
 * @param {{ landform: import('../../domain/townMap/siteGenesis.js').TownLandform|null|undefined,
 *   lens: string|object, ink: string }} props
 */
export default function SettlementMapLandform({ landform, lens, ink }) {
  if (!landform) return null;
  const ops = landformDrawOps(landform, lens);
  if (ops.length === 0) return null;
  return (
    <g data-town-landform={landform.kind} style={{ pointerEvents: 'none' }}>
      {ops.map((op, i) => markElement(op, i, ink))}
    </g>
  );
}
