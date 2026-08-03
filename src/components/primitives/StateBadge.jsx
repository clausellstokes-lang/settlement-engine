/**
 * primitives/StateBadge — One badge to rule the lifecycle states.
 *
 * Replaces ad-hoc badge styles scattered across PhaseBadge and the
 * Narrated/Raw chip in SettlementDetail. The audit's vocabulary is
 * normative: DRAFT, CANON,
 * PREPLAY, EVENT_PENDING, NARRATED, RAW, LOCKED. Every status visible
 * to the user should reduce to one of these kinds.
 *
 * Accessibility: the badge announces itself with role="status" so
 * screen readers pick up phase changes. The label inside is the
 * authoritative text for assistive tech; the icon is decorative.
 *
 * ICONS-OFF (lane LU): this primitive is one of the five IconsContext.js NAMED
 * as consulting the gate that in fact never did — every StateBadge in the app
 * has been rendering its lucide glyph straight through the ratified icons-off
 * redesign. It consults the gate now. Nothing is lost when the icon goes: the
 * two channels IconsContext documents as surviving — the kind's COLOR and the
 * uppercase TEXT label (P7) — are both still here, and the label is what the
 * pins and assistive tech already read.
 */

import { tx } from '../../copy/index.js';

const KINDS = {
  draft:         { bg: '#f3ead8',                 fg: '#6a4a1c', border: '#c8a96a' },
  canon:         { bg: '#1a3a2a',                 fg: '#e0d6b8', border: '#2d5a44' },
  preplay:       { bg: '#fff7ec',                 fg: '#7a4f0f', border: '#e0b070' },
  event_pending: { bg: '#fff5f5',                 fg: '#8b1a1a', border: '#c89a9a' },
  narrated:      { bg: 'rgba(90,42,138,0.14)',    fg: '#6a2a9a', border: 'rgba(160,100,220,0.35)' },
  raw:           { bg: 'rgba(156,128,104,0.14)',  fg: '#6b5340', border: 'rgba(156,128,104,0.35)' },
  locked:        { bg: '#fff7e0',                 fg: '#7a4f0f', border: '#c8a96a' },
};

/**
 * @param {Object} props
 * @param {keyof typeof KINDS} props.kind
 * @param {'sm'|'md'} [props.size='md']
 * @param {string} [props.tooltip]    overrides the default tooltip
 * @param {string} [props.suffix]     small extra text appended after the label, e.g. event count
 */
export default function StateBadge({ kind, size = 'md', tooltip, suffix }) {
  const k = KINDS[kind];
  if (!k) return null;
  const dim = size === 'sm'
    ? { fs: 9,  py: 2, px: 6 }
    : { fs: 11, py: 3, px: 8 };
  const label = tx('state.badges')?.[kind] || kind;
  const aria = tooltip || tx('state.tooltips')?.[kind] || `${label} state`;
  return (
    <span
      role="status"
      aria-label={aria}
      title={aria}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: `${dim.py}px ${dim.px}px`,
        background: k.bg, color: k.fg,
        border: `1px solid ${k.border}`,
        borderRadius: 4,
        fontSize: dim.fs, fontWeight: 800,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {label.toUpperCase()}
      {suffix != null && (
        <span style={{ opacity: 0.7, marginLeft: 4 }} aria-hidden="true">· {suffix}</span>
      )}
    </span>
  );
}
