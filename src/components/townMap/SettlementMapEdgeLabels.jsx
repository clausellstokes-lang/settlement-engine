/**
 * components/townMap/SettlementMapEdgeLabels — SM-5 (3) the on-map exit signs.
 *
 * Renders the edge annotations (buildEdgeAnnotations) as in-SVG wayfinding labels at
 * the map's road exits — "→ Neighbour". Drawn in map space (0..1000) so they pan/zoom
 * with the map; a paint-order stroke keeps them legible over any lens, matching the
 * district-label treatment. Non-interactive (pointer-events off). Pure presentational.
 */
import { sans } from '../theme.js';

/**
 * @param {{ annotations: Array<{ roadId:string, x:number, y:number, align:'start'|'middle'|'end', neighborName:string }>,
 *   ink: string, bg: string }} props
 */
export default function SettlementMapEdgeLabels({ annotations, ink, bg }) {
  if (!Array.isArray(annotations) || annotations.length === 0) return null;
  return (
    <g data-town-edge-labels style={{ pointerEvents: 'none' }}>
      {annotations.map((a) => (
        <text
          key={`edge.${a.roadId}`}
          data-town-edge-label={a.roadId}
          x={a.x} y={a.y}
          textAnchor={a.align}
          dominantBaseline="central"
          fill={ink} fontFamily={sans} fontSize={15} fontWeight={800}
          stroke={bg} strokeWidth={3.5} paintOrder="stroke"
          style={{ userSelect: 'none' }}
        >
          {`→ ${a.neighborName}`}
        </text>
      ))}
    </g>
  );
}
