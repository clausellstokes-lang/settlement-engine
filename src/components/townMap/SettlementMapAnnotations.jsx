/**
 * components/townMap/SettlementMapAnnotations — SM-5 (5) the DM pin/annotation layer.
 *
 * Renders the owner's persisted map markers (mapEdits.annotations) in SVG map space
 * (0..1000) so they pan/zoom with the map. The OWNER always sees every marker they
 * made; the DM-only vs player-visible distinction is a VISUAL cue here (a dashed ring
 * + a small DM tag on a DM-only marker) and the EXPORT-visibility split elsewhere
 * (the WYSIWYG audience law). Labels carry a paint-order stroke for legibility over
 * any lens. In edit mode each marker gets a small × to remove it.
 *
 * Pure presentational; theme tokens only, no lucide icons (the map's icons-off
 * posture). Marker text is DM content — it only ever renders in the owner's own
 * viewer (the whole mapEdits container is owner-gated off any public projection).
 */
import { sans } from '../theme.js';

/**
 * @param {{
 *   annotations: Array<{ x:number, y:number, label:string, audience:'dm'|'player' }>,
 *   editing?: boolean,
 *   onRemove?: (index:number) => void,
 *   ink: string, bg: string, accent: string,
 * }} props
 */
export default function SettlementMapAnnotations({ annotations, editing = false, onRemove, ink, bg, accent }) {
  if (!Array.isArray(annotations) || annotations.length === 0) return null;
  return (
    <g data-town-annotations>
      {annotations.map((a, i) => {
        const dm = a.audience === 'dm';
        return (
          <g key={`ann.${i}.${a.x}.${a.y}`} data-town-annotation={i} data-audience={a.audience}>
            {/* the pin: a filled disc; DM-only markers wear a dashed outer ring */}
            {dm && (
              <circle cx={a.x} cy={a.y} r={13} fill="none" stroke={ink} strokeOpacity={0.7}
                strokeWidth={1.5} strokeDasharray="3 3" style={{ pointerEvents: 'none' }} />
            )}
            <circle cx={a.x} cy={a.y} r={7} fill={dm ? bg : accent} stroke={accent} strokeWidth={2}
              style={{ pointerEvents: 'none' }} />
            <circle cx={a.x} cy={a.y} r={2.5} fill={accent} style={{ pointerEvents: 'none' }} />
            {/* the label, offset to the right of the pin */}
            <text
              x={a.x + 16} y={a.y}
              dominantBaseline="central"
              fill={ink} fontFamily={sans} fontSize={14} fontWeight={800}
              stroke={bg} strokeWidth={3.5} paintOrder="stroke"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {dm ? `${a.label}` : a.label}
            </text>
            {dm && (
              <text
                x={a.x + 16} y={a.y + 15}
                dominantBaseline="central"
                fill={ink} fontFamily={sans} fontSize={9} fontWeight={800} letterSpacing="0.08em"
                stroke={bg} strokeWidth={2.5} paintOrder="stroke"
                style={{ pointerEvents: 'none', userSelect: 'none', opacity: 0.7 }}
              >
                DM ONLY
              </text>
            )}
            {/* edit-mode remove affordance */}
            {editing && typeof onRemove === 'function' && (
              <g
                data-town-annotation-remove={i}
                transform={`translate(${a.x + 11}, ${a.y - 11})`}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                onClick={(e) => { e.stopPropagation(); onRemove(i); }}
              >
                <circle cx={0} cy={0} r={8} fill={bg} stroke={accent} strokeWidth={1.5} />
                <path d="M -3 -3 L 3 3 M 3 -3 L -3 3" stroke={accent} strokeWidth={1.75} strokeLinecap="round" />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}
