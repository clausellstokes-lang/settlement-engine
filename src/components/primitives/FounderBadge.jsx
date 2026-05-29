/**
 * FounderBadge.jsx — Small pill marking a Founder Lifetime account.
 *
 * The Founder tier is a 500-seat one-time-purchase Cartographer grant.
 * It's the sort of thing supporters appreciate visible acknowledgement
 * of, both on their own dossiers and (when Gallery ships) on public
 * pages.
 *
 * Usage:
 *   <FounderBadge />                     // shows only if current user is founder
 *   <FounderBadge force />               // always shows (e.g. for design-system docs)
 *   <FounderBadge size="lg" />           // bigger
 *
 * Props deliberately minimal — the badge is meant to drop in beside a
 * user name or settlement title without needing layout glue.
 */

import { Crown } from 'lucide-react';
import { FS } from '../theme.js';
import { useStore } from '../../store/index.js';

const SIZES = {
  sm: { fontSize: FS.micro,  iconSize: 9,  pad: '1px 5px',  gap: 3, radius: 3 },
  md: { fontSize: FS.xxs, iconSize: 10, pad: '2px 7px',  gap: 4, radius: 4 },
  lg: { fontSize: FS.sm, iconSize: 12, pad: '3px 9px',  gap: 5, radius: 5 },
};

export default function FounderBadge({ size = 'md', force = false, style }) {
  const isFounder = useStore(s => s.isFounder?.() ?? false);
  if (!force && !isFounder) return null;

  const s = SIZES[size] || SIZES.md;

  return (
    <span
      title="Founder Lifetime supporter"
      aria-label="Founder"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        padding: s.pad,
        borderRadius: s.radius,
        // Parchment-warm gold gradient with ink text — reads "earned",
        // not "purchased": closer to a wax seal than a sale ribbon.
        background: 'linear-gradient(135deg, #FBF5E6 0%, #F4EAD0 100%)',
        border: '1px solid #C9A24C',
        color: '#1B1408',
        fontSize: s.fontSize,
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontFamily: 'Nunito, system-ui, sans-serif',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <Crown size={s.iconSize} aria-hidden="true" />
      Founder
    </span>
  );
}
