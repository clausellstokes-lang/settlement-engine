/**
 * AlivenessBadge.jsx — the aliveness indicator (GALLERY-2 phase 2).
 *
 * Renders the publish-time aliveness snapshot (0–100; src/lib/galleryAliveness.js)
 * as a small "Living world · NN" pill. Renders NOTHING when the score is null —
 * a share stamped before the score existed (or campaign-less) is unknown, not
 * dead, so no badge beats a zero badge.
 *
 * Used on the gallery card meta row, the public dossier meta line, and the
 * Campaigns-tab card.
 */
import { Activity } from 'lucide-react';
import { clampAliveness } from '../../lib/galleryAliveness.js';
import { BORDER2, CARD_ALT, GREEN, INK, sans, FS } from '../theme.js';

const PILL = 999; // the pill radius idiom (design/tokens.js)

export default function AlivenessBadge({ score, size = 'sm' }) {
  // THE shared null-safe clamp: an un-stamped share (null) renders NOTHING —
  // unknown is not zero (Number(null) would coerce to 0).
  const value = clampAliveness(score);
  if (value === null) return null;
  // The score's upper half earns the living-green accent; the lower half stays
  // neutral ink (a quiet world is a fact, not a warning).
  const accent = value >= 50 ? GREEN : INK;
  const compact = size === 'sm';
  return (
    <span
      aria-label={`Aliveness ${value} out of 100`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: compact ? '2px 8px' : '4px 10px',
        border: `1px solid ${BORDER2}`,
        borderRadius: PILL,
        background: CARD_ALT,
        color: accent,
        fontFamily: sans,
        fontSize: compact ? FS.xxs : FS.xs,
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      <Activity size={compact ? 11 : 13} aria-hidden="true" />
      Living world {value}
    </span>
  );
}
