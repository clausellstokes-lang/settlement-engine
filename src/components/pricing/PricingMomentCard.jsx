/**
 * PricingMomentCard.jsx — Inline upgrade card surfaced by usePricingMoment.
 *
 * The library `lib/pricingMoments.js` triggers a moment by calling
 * `openModal({ headline, body, reason })`. The conventional opener is
 * the store action `setActivePricingMoment(content)`. This component
 * subscribes to that and renders the corresponding card.
 *
 * Visual design follows the critique (X-7):
 *   - Inline card, not a modal wall
 *   - Violet accent for premium-upgrade moments (Cartographer, Founder)
 *   - Gold accent for tier-unlock moments
 *   - Single primary button + dismiss
 *   - 24h cooldown enforced by the library
 *
 * Audience-aware copy via useCopy().audience() — the same moment fires
 * different pitches to new DM vs. worldbuilder.
 *
 * Renders fixed-position bottom-right so it doesn't fight the dossier
 * for vertical space. On mobile, full-width above the bottom nav.
 */

import { useEffect, useState, useCallback } from 'react';
import { useStore } from '../../store/index.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { GOLD, INK, BORDER, sans, serif_, FS, SP, R, swatch, BODY, MUTED } from '../theme.js';
import Button from '../primitives/Button.jsx';

const VIOLET = swatch['#7B4FCF'];

// Reasons that want the violet (Cartographer / Founder upgrade) accent
// rather than the gold (tier-unlock / signup) accent. Anything not in
// this set uses gold.
const VIOLET_REASONS = new Set([
  'third_save',
  'regen_burst',
  'map_clicked',
  'weekly_user',
  'first_ai_use',
  'first_pdf_export',
  'first_canon_export',
  'founder_eligible',
]);

export default function PricingMomentCard() {
  const activeMoment = useStore(s => s.activePricingMoment);
  const clearMoment = useStore(s => s.clearActivePricingMoment);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const [exiting, setExiting] = useState(false);

  // Pre-declare handlers via useCallback so the auto-dismiss effect can
  // depend on a stable reference (react-hooks/exhaustive-deps wants it).
  const handleExit = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      clearMoment?.();
      setExiting(false);
    }, 220);
  }, [clearMoment]);

  const reason = activeMoment?.reason;
  const handleDismiss = useCallback(() => {
    Funnel.track(EVENTS.PRICING_MOMENT_DISMISSED, { reason });
    handleExit();
  }, [reason, handleExit]);

  const handleClick = useCallback(() => {
    Funnel.track(EVENTS.PRICING_MOMENT_CLICKED, { reason });
    setPurchaseModalOpen?.(true);
    handleExit();
  }, [reason, setPurchaseModalOpen, handleExit]);

  // Auto-dismiss after 30s if the user doesn't interact. Critique X-2:
  // moments are doors, not walls — they don't hold the screen.
  useEffect(() => {
    if (!activeMoment) return undefined;
    const t = setTimeout(() => handleDismiss(), 30_000);
    return () => clearTimeout(t);
  }, [activeMoment, handleDismiss]);

  if (!activeMoment) return null;

  const { headline, body } = activeMoment;
  const isViolet = VIOLET_REASONS.has(reason);
  const accent = isViolet ? VIOLET : GOLD;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: SP.lg,
        right: SP.lg,
        maxWidth: 360,
        width: 'calc(100% - 32px)',
        zIndex: 9500,
        background: swatch.white,
        border: `1px solid ${BORDER}`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: R.md,
        padding: SP.md,
        boxShadow: '0 8px 24px rgba(27, 20, 8, 0.18)',
        transform: exiting ? 'translateY(20px)' : 'translateY(0)',
        opacity: exiting ? 0 : 1,
        transition: 'transform 0.22s ease-out, opacity 0.22s ease-out',
        fontFamily: sans,
      }}
    >
      <div style={{
        fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: accent,
        marginBottom: 6,
      }}>
        {isViolet ? 'Cartographer' : 'Upgrade'}
      </div>
      <div style={{
        fontFamily: serif_, fontSize: FS.lg, fontWeight: 600,
        color: INK, lineHeight: 1.3, marginBottom: 6,
      }}>
        {headline}
      </div>
      <div style={{
        fontSize: FS.sm, color: BODY, lineHeight: 1.55,
        marginBottom: SP.md,
      }}>
        {body}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
        <Button
          variant="primary"
          onClick={handleClick}
          style={{ background: accent, color: swatch.white, border: `1px solid ${accent}` }}
        >
          {isViolet ? 'See Cartographer' : 'Sign in to unlock'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
        >
          Not now
        </Button>
        <span style={{ flex: 1 }} />
        <span style={{
          fontSize: FS.xxs, color: MUTED,
          fontStyle: 'italic',
        }}>
          Won't ask again for 24h
        </span>
      </div>
    </div>
  );
}
