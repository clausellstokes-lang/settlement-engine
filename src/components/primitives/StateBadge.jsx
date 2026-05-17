/**
 * primitives/StateBadge — One badge to rule the lifecycle states.
 *
 * Replaces ad-hoc badge styles scattered across PhaseBadge, the
 * Narrated/Raw chip in SettlementDetail, and the LockToggle's locked
 * indicator. The audit's vocabulary is normative: DRAFT, CANON,
 * PREPLAY, EVENT_PENDING, NARRATED, RAW, LOCKED. Every status visible
 * to the user should reduce to one of these kinds.
 *
 * Accessibility: the badge announces itself with role="status" so
 * screen readers pick up phase changes. The label inside is the
 * authoritative text for assistive tech; the icon is decorative.
 */

import React from 'react';
import {
  Edit3, BookMarked, AlertTriangle, Hourglass,
  Sparkles, Box, Lock,
} from 'lucide-react';
import { COPY } from '../../copy/strings.js';

const KINDS = {
  draft:         { bg: '#f3ead8',                 fg: '#6a4a1c', border: '#c8a96a',                 Icon: Edit3 },
  canon:         { bg: '#1a3a2a',                 fg: '#e0d6b8', border: '#2d5a44',                 Icon: BookMarked },
  preplay:       { bg: '#fff7ec',                 fg: '#7a4f0f', border: '#e0b070',                 Icon: AlertTriangle },
  event_pending: { bg: '#fff5f5',                 fg: '#8b1a1a', border: '#c89a9a',                 Icon: Hourglass },
  narrated:      { bg: 'rgba(90,42,138,0.14)',    fg: '#6a2a9a', border: 'rgba(160,100,220,0.35)',  Icon: Sparkles },
  raw:           { bg: 'rgba(156,128,104,0.14)',  fg: '#6b5340', border: 'rgba(156,128,104,0.35)',  Icon: Box },
  locked:        { bg: '#fff7e0',                 fg: '#7a4f0f', border: '#c8a96a',                 Icon: Lock },
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
  const Icon = k.Icon;
  const dim = size === 'sm'
    ? { fs: 9,  py: 2, px: 6, ic: 9  }
    : { fs: 11, py: 3, px: 8, ic: 11 };
  const label = COPY.state.badges[kind] || kind;
  const aria = tooltip || COPY.state.tooltips[kind] || `${label} state`;
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
      <Icon size={dim.ic} aria-hidden="true" /> {label.toUpperCase()}
      {suffix != null && (
        <span style={{ opacity: 0.7, marginLeft: 4 }} aria-hidden="true">· {suffix}</span>
      )}
    </span>
  );
}
