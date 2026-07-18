/**
 * components/townMap/fog/SettlementMapFog — DOOR 2 the DM pane fog overlay.
 *
 * The DM's own view of the fog: an SVG `<mask>` (WHITE fog everywhere, BLACK holes over the
 * revealed shapes — the UNION composes under overlap) rendered as the LAST child of the pane's
 * 0..1000 map group, so it pans/zooms with the map. The DM sees it at a LIGHT opacity (a tint
 * marking what the players cannot see yet), while the player view / handout export render the
 * SAME mask opaque. Consumes the SAME pure `revealShapes` primitives the export uses, so what
 * the DM tints is exactly what the handout hides (WYSIWYG law). Purely presentational —
 * pointerEvents:none, so the reveal brush + hover/pin handlers underneath still fire.
 */

import { revealShapes, FOG_VIEW } from '../../../domain/townMap/index.js';

/** One reveal shape → the BLACK mask hole (JSX twin of fogGeometry.shapeToMaskSvg). */
function RevealHole({ shape }) {
  if (shape.kind === 'district') {
    return <polygon points={shape.points.map(([x, y]) => `${x},${y}`).join(' ')} fill="#000" />;
  }
  if (shape.kind === 'building') {
    return <circle cx={shape.x} cy={shape.y} r={shape.r} fill="#000" />;
  }
  return <line x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} stroke="#000" strokeWidth={shape.w} strokeLinecap="round" />;
}

/**
 * @param {{
 *   model: any,
 *   reveal?: { districts?: string[], streets?: string[], buildings?: string[] } | null,
 *   color?: string,
 *   opacity?: number,
 *   maskId?: string,
 * }} props
 */
export default function SettlementMapFog({ model, reveal, color = '#12100b', opacity = 0.38, maskId = 'sf-fog-pane' }) {
  if (!reveal) return null; // fog off ⇒ nothing (the pane is byte-identical to no-fog)
  const shapes = revealShapes(model, reveal);
  return (
    <g data-town-fog style={{ pointerEvents: 'none' }}>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={FOG_VIEW} height={FOG_VIEW}>
        <rect x="0" y="0" width={FOG_VIEW} height={FOG_VIEW} fill="#fff" />
        {shapes.map((s, i) => <RevealHole key={`${s.kind}.${i}`} shape={s} />)}
      </mask>
      <rect x="0" y="0" width={FOG_VIEW} height={FOG_VIEW} fill={color} fillOpacity={opacity} mask={`url(#${maskId})`} />
    </g>
  );
}

/**
 * The reveal-BRUSH capture rect (screen space, mounted on top of the pane's <g> so a click
 * anywhere on the map snaps to the nearest feature). Returns null unless a fog session is
 * engaged in the interactive plan view — so the pane's normal hover/pin stays live otherwise.
 * @param {{ fog: ReturnType<typeof import('./useMapFog.js').useMapFog>, width: number, height: number, enabled: boolean }} props
 */
export function FogBrushCapture({ fog, width, height, enabled }) {
  if (!fog.brushEnabled || !enabled) return null;
  return (
    <rect
      data-fog-brush
      x={0} y={0} width={width || 1} height={height || 1}
      fill="transparent"
      onPointerDown={fog.onBrushDown}
      onPointerMove={fog.onBrushMove}
      onPointerUp={fog.onBrushUp}
      onPointerLeave={fog.onBrushUp}
      style={{ pointerEvents: 'all', cursor: 'crosshair', touchAction: 'none' }}
    />
  );
}
