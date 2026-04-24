/**
 * TierIcon — pure SVG glyph for a settlement placement.
 *
 * Renders a tier-appropriate shape (thorp dot through metropolis crown)
 * with optional port (anchor), capital (gold ring), and selected (halo)
 * modifiers. Counter-scales by 1/scale so icons stay legible at any zoom.
 *
 * Pure presentational component — no store hooks. Caller wires click.
 */

import React from 'react';

const TIER_FROM_POP = (pop = 0) => {
  if (pop <= 60)        return 'thorp';
  if (pop <= 240)       return 'hamlet';
  if (pop <= 900)       return 'village';
  if (pop <= 5000)      return 'town';
  if (pop <= 25000)     return 'city';
  return 'metropolis';
};

export function tierFor(settlement) {
  if (!settlement) return 'village';
  const t = (settlement.tier || settlement.settType || '').toLowerCase();
  if (['thorp','hamlet','village','town','city','metropolis'].includes(t)) return t;
  return TIER_FROM_POP(settlement.population);
}

const STROKE  = '#1c1409';
const FILL    = '#a0762a';   // brown/gold body
const FILL_HI = '#d4a445';   // capital gold
const HALO    = '#fbbf24';   // selected halo

/**
 * Renders the inner icon shape for a tier, in a coord system where (0,0)
 * is the placement point and units are screen pixels (caller applies a
 * counter-scale group transform).
 */
function TierShape({ tier, capital }) {
  const body = capital ? FILL_HI : FILL;
  switch (tier) {
    case 'thorp':
      return <circle cx={0} cy={0} r={3} fill={body} stroke={STROKE} strokeWidth={0.6} />;
    case 'hamlet':
      return <circle cx={0} cy={0} r={4.5} fill="#fffbf5" stroke={body} strokeWidth={1.4} />;
    case 'village':
      return <circle cx={0} cy={0} r={5.5} fill={body} stroke={STROKE} strokeWidth={0.8} />;
    case 'town':
      return (
        <g>
          <circle cx={0} cy={0} r={7} fill={body} stroke={STROKE} strokeWidth={0.9} />
          <circle cx={0} cy={0} r={4} fill="none" stroke="#fffbf5" strokeWidth={0.9} />
        </g>
      );
    case 'city':
      return (
        <g>
          {/* battlements */}
          <rect x={-7.5} y={-7.5} width={15} height={15} fill={body} stroke={STROKE} strokeWidth={0.9} />
          <rect x={-7.5} y={-9.5} width={3} height={2.5} fill={body} stroke={STROKE} strokeWidth={0.7} />
          <rect x={-1.5} y={-9.5} width={3} height={2.5} fill={body} stroke={STROKE} strokeWidth={0.7} />
          <rect x={ 4.5} y={-9.5} width={3} height={2.5} fill={body} stroke={STROKE} strokeWidth={0.7} />
        </g>
      );
    case 'metropolis':
      return (
        <g>
          <rect x={-9} y={-9} width={18} height={18} fill={body} stroke={STROKE} strokeWidth={1} />
          {/* battlements */}
          <rect x={-9}   y={-11.5} width={3.6} height={2.5} fill={body} stroke={STROKE} strokeWidth={0.7} />
          <rect x={-1.8} y={-11.5} width={3.6} height={2.5} fill={body} stroke={STROKE} strokeWidth={0.7} />
          <rect x={ 5.4} y={-11.5} width={3.6} height={2.5} fill={body} stroke={STROKE} strokeWidth={0.7} />
          {/* star */}
          <path d="M 0 -5 L 1.4 -1.5 L 5 -1.5 L 2.1 0.6 L 3.2 4 L 0 1.9 L -3.2 4 L -2.1 0.6 L -5 -1.5 L -1.4 -1.5 Z"
                fill="#fffbf5" stroke={STROKE} strokeWidth={0.5} />
        </g>
      );
    default:
      return <circle cx={0} cy={0} r={5} fill={body} stroke={STROKE} strokeWidth={0.8} />;
  }
}

/** Anchor overlay for ports — tucked to the lower-right of the body. */
function PortBadge() {
  return (
    <g transform="translate(7, 7)">
      <circle cx={0} cy={0} r={3.2} fill="#fffbf5" stroke={STROKE} strokeWidth={0.6} />
      <path d="M 0 -1.8 L 0 1.8 M -1.5 1.2 Q 0 2.6 1.5 1.2"
            fill="none" stroke={STROKE} strokeWidth={0.8} strokeLinecap="round" />
      <circle cx={0} cy={-1.8} r={0.6} fill={STROKE} />
    </g>
  );
}

/**
 * @param {object}   props
 * @param {string}   props.tier         — thorp|hamlet|village|town|city|metropolis
 * @param {boolean}  [props.port]       — render anchor badge
 * @param {boolean}  [props.capital]    — render gold capital ring + brighter body
 * @param {boolean}  [props.selected]   — render selection halo + 1.3x scale
 * @param {number}   props.scale        — current map zoom scale (counter-scale by 1/scale)
 * @param {number}   props.x            — map x (caller wraps in <g transform="translate(...)">)
 * @param {number}   props.y            — map y
 * @param {string}   [props.label]      — optional name displayed below
 * @param {function} [props.onClick]
 * @param {function} [props.onPointerDown]
 * @param {string}   [props.cursor]
 */
export default function TierIcon({
  tier, port, capital, selected, scale = 1,
  x, y, label, onClick, onPointerDown, onPointerMove, onPointerUp, onPointerCancel,
  cursor = 'pointer',
}) {
  // Counter-scale so icons keep constant pixel size across zoom levels.
  // Selected items are drawn 30% larger.
  const counter = (selected ? 1.3 : 1) / (scale || 1);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ cursor }}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <g transform={`scale(${counter})`}>
        {selected && (
          <circle
            cx={0} cy={0} r={16}
            fill="none"
            stroke={HALO}
            strokeWidth={2.2}
            strokeOpacity={0.85}
          />
        )}
        {capital && (
          <circle
            cx={0} cy={0} r={11}
            fill="none"
            stroke={FILL_HI}
            strokeWidth={1.6}
            strokeOpacity={0.9}
          />
        )}
        <TierShape tier={tier} capital={capital} />
        {port && <PortBadge />}
        {label && (
          <text
            x={0}
            y={tier === 'metropolis' ? 22 : tier === 'city' ? 19 : 14}
            fontFamily="Cinzel, serif"
            fontSize={9}
            fontWeight={700}
            fill={STROKE}
            stroke="#fffbf5"
            strokeWidth={2.2}
            paintOrder="stroke"
            textAnchor="middle"
            pointerEvents="none"
            style={{ userSelect: 'none' }}
          >
            {label}
          </text>
        )}
      </g>
    </g>
  );
}
