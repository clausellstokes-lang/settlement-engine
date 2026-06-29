/**
 * TierShiftControl — force this settlement up or down one size tier (a DM override of
 * the organic tier-drift system, tierResourceDynamics). Dispatches the store action
 * shiftTier('promotion' | 'demotion'), which rebands population into the new tier's
 * band and reconciles the institution roster via the same world-pulse apply path an
 * organic shift uses (a demotion leaves unsupported institutions behind as ruined
 * remnants). One tier per click; the buttons disable at the cap (metropolis) and floor
 * (thorp). The change lands on the timeline like any other canon event.
 */

import { useStore } from '../../store/index.js';
import { TIER_ORDER, popToTier } from '../../data/constants.js';
import { MUTED, BORDER, CARD, GOLD, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';

const cap = (/** @type {string} */ s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export default function TierShiftControl() {
  const settlement = useStore((s) => s.settlement);
  const shiftTier = useStore((s) => s.shiftTier);
  if (!settlement) return null;

  const config = settlement.config || {};
  const tier = settlement.tier || config.tier || popToTier(Number(settlement.population) || 0);
  const idx = TIER_ORDER.indexOf(tier);
  const nextTier = idx >= 0 && idx < TIER_ORDER.length - 1 ? TIER_ORDER[idx + 1] : null;
  const prevTier = idx > 0 ? TIER_ORDER[idx - 1] : null;

  return (
    <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, borderRadius: 7, padding: '10px 12px', background: CARD, marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: FS.xs, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Settlement tier
        </span>
        <span style={{ fontSize: FS.micro, color: MUTED }}>Currently {cap(tier)}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button variant="ghost" size="sm" disabled={!prevTier} onClick={() => prevTier && shiftTier?.('demotion')}>
          {prevTier ? `Demote to ${cap(prevTier)}` : 'At the smallest tier'}
        </Button>
        <Button variant="ghost" size="sm" disabled={!nextTier} onClick={() => nextTier && shiftTier?.('promotion')}>
          {nextTier ? `Promote to ${cap(nextTier)}` : 'At the largest tier'}
        </Button>
      </div>
      <div style={{ fontSize: FS.micro, color: MUTED, marginTop: 6, lineHeight: 1.4 }}>
        Resettles population into the new band and reconciles institutions as organic growth or decline would. A demotion leaves the grander institutions behind as ruined remnants rather than erasing them.
      </div>
    </div>
  );
}
