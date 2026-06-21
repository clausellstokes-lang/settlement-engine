/**
 * primitives/BandPill
 *
 * Color-coded pill that renders a qualitative band label
 * ("Abundant", "Strained", "Critical", "Collapsed") instead of an
 * internal numeric score. TTRPG users find bands more useful than
 * raw numbers — "Legitimacy: Contested" reads as DM-actionable;
 * "Legitimacy: 37" doesn't.
 *
 * Consumes domain/qualitativeBands.js#displayValueFor + #bandFor.
 * Pure presentational. Three render modes:
 *
 *   <BandPill band="strained" />                                   explicit band
 *   <BandPill domain="substrate" band="strained" />                with explicit domain (for label lookup)
 *   <BandPill ref={{ kind: 'substrate', key: 'food_security' }}    derived from settlement
 *             settlement={settlement} />
 *
 * Bands map to one of 5 color tiers regardless of domain:
 *   surplus   → forest green (best)
 *   adequate  → muted green
 *   strained  → amber
 *   critical  → red
 *   collapsed → dark red (worst)
 *
 * Unknown bands render as a neutral grey pill so we never crash.
 */

import { bandFor, displayBandLabel } from '../../domain/qualitativeBands.js';
import { FS } from '../theme.js';

const BAND_COLORS = Object.freeze({
  surplus:   { bg: 'rgba(26,74,32,0.14)',  fg: '#1a4a20', bdr: 'rgba(26,74,32,0.4)' },
  adequate:  { bg: 'rgba(74,118,32,0.10)', fg: '#3a5a1a', bdr: 'rgba(74,118,32,0.35)' },
  strained:  { bg: 'rgba(196,128,60,0.14)', fg: '#7a4f0f', bdr: 'rgba(196,128,60,0.4)' },
  critical:  { bg: 'rgba(184,68,28,0.14)', fg: '#8b3a10', bdr: 'rgba(184,68,28,0.45)' },
  collapsed: { bg: 'rgba(139,26,26,0.16)', fg: '#8b1a1a', bdr: 'rgba(139,26,26,0.5)' },
});

const NEUTRAL = { bg: '#faf6ee', fg: '#9c8068', bdr: '#d2bd96' };

const SIZE = Object.freeze({
  sm: { fontSize: FS.micro,  padX: 5, padY: 1, gap: 3, glyph: 7 },
  md: { fontSize: FS.xs, padX: 7, padY: 2, gap: 4, glyph: 8 },
  lg: { fontSize: FS.md, padX: 9, padY: 3, gap: 5, glyph: 10 },
});

const GLYPHS = Object.freeze({
  surplus:   '▲',
  adequate:  '●',
  strained:  '◐',
  critical:  '▼',
  collapsed: '✕',
});

function resolveBand({ band, ref, settlement }) {
  if (typeof band === 'string' && band) return band;
  if (ref && settlement) {
    try {
      return bandFor(ref, settlement);
    } catch (e) {
      console.warn('[BandPill] bandFor failed', e);
    }
  }
  return null;
}

function resolveLabel({ band, label, domain, ref }) {
  if (typeof label === 'string' && label) return label;
  const dom = domain || ref?.kind || ref?.domain;
  if (band && dom) {
    try {
      return displayBandLabel(dom, band);
    } catch (e) {
      console.warn('[BandPill] displayBandLabel failed', e);
    }
  }
  // Last resort: capitalize the band name.
  if (band) return band.charAt(0).toUpperCase() + band.slice(1);
  return null;
}

/**
 * Render a qualitative-band pill.
 *
 * Props:
 *   band        — explicit band string (surplus / adequate / strained / critical / collapsed)
 *   domain      — explicit domain ('substrate' / 'capacity' / 'chain' / ...) for the label lookup
 *   ref         — { kind, key } for settlement-driven lookups
 *   settlement  — required when ref is given
 *   label       — explicit override label (e.g. "Contested")
 *   labelBefore — string to prepend to the label ("Legitimacy: ")
 *   size        — 'sm' | 'md' | 'lg' (default 'md')
 *   showGlyph   — render the band glyph (default true)
 *   style       — caller overrides
 */
export function BandPill({
  band,
  domain,
  ref,
  settlement,
  label,
  labelBefore,
  size = 'md',
  showGlyph = true,
  style = {},
}) {
  // `ref` here is a settlement-reference name (e.g. 'economy.viability'),
  // NOT a React useRef — react-hooks/refs flags it as a false positive.
  // eslint-disable-next-line react-hooks/refs
  const resolvedBand = resolveBand({ band, ref, settlement });
  // eslint-disable-next-line react-hooks/refs
  const resolvedLabel = resolveLabel({ band: resolvedBand, label, domain, ref });

  if (!resolvedBand && !resolvedLabel) return null;

  const sizing = SIZE[size] || SIZE.md;
  const colors = (resolvedBand && BAND_COLORS[resolvedBand]) || NEUTRAL;
  const glyph = resolvedBand && GLYPHS[resolvedBand];

  return (
    <span
      role="status"
      aria-label={`${labelBefore || ''}${resolvedLabel || resolvedBand}`}
      title={`${labelBefore || ''}${resolvedLabel || resolvedBand}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizing.gap,
        padding: `${sizing.padY}px ${sizing.padX}px`,
        borderRadius: 3,
        background: colors.bg,
        color: colors.fg,
        border: `1px solid ${colors.bdr}`,
        fontSize: sizing.fontSize,
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {showGlyph && glyph && (
        <span aria-hidden="true" style={{ fontSize: sizing.glyph, lineHeight: 1 }}>{glyph}</span>
      )}
      {labelBefore && (
        <span style={{ fontWeight: 600, opacity: 0.85 }}>{labelBefore}</span>
      )}
      <span>{resolvedLabel || resolvedBand}</span>
    </span>
  );
}

export default BandPill;
