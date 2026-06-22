/**
 * PricingMomentCard.jsx — Inline upgrade card surfaced by usePricingMoment.
 *
 * The library `lib/pricingMoments.js` triggers a moment by calling
 * `openModal({ headline, body, reason })`. The conventional opener is
 * the store action `setActivePricingMoment(content)`. This component
 * subscribes to that and renders the corresponding card.
 *
 * Visual design:
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
import { GOLD, INK, BORDER, sans, serif_, FS, SP, R, swatch, BODY } from '../theme.js';
import Button from '../primitives/Button.jsx';

const VIOLET = swatch['#7B4FCF'];

// Reasons that want the violet (Cartographer / Founder upgrade) accent
// rather than the gold (tier-unlock / signup) accent. Anything not in
// this set uses gold.
//
// This same set ALSO partitions the click destination, so the eyebrow,
// label, accent, and action all agree on one mental model (P8/P11): a
// violet reason is an UPGRADE moment → it opens the purchase/upgrade modal;
// a gold reason is a SIGNUP/UNLOCK moment fired at an anonymous user (its
// body copy literally says "Sign in (free)…") → it opens the auth modal.
// The previous build sent every reason to the purchase modal, so the gold
// "Sign in to unlock" CTA landed an anonymous user in a buy-credits wall.
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
  // Signup/unlock moments fire at anonymous users — their honest destination is
  // sign-in, not the buy-credits modal. Lifted onto the store (uiSlice) so this
  // app-wide nudge can reach it (App.jsx no longer owns it as local state).
  const setAuthModalOpen = useStore(s => s.setAuthModalOpen);
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
  // One source of truth for the moment's intent. Drives accent, eyebrow,
  // label, button weight, AND the click destination so they cannot drift
  // apart (P8/P11). A violet reason upgrades (purchase modal); a gold reason
  // is a signup/unlock prompt for an anon user (auth modal).
  const isUpgrade = VIOLET_REASONS.has(reason);

  const handleDismiss = useCallback(() => {
    Funnel.track(EVENTS.PRICING_MOMENT_DISMISSED, { reason });
    handleExit();
  }, [reason, handleExit]);

  const handleClick = useCallback(() => {
    Funnel.track(EVENTS.PRICING_MOMENT_CLICKED, { reason });
    // Route to the destination the eyebrow + label promise. Upgrade moments
    // open the purchase/upgrade modal; signup/unlock moments open sign-in.
    if (isUpgrade) setPurchaseModalOpen?.(true);
    else setAuthModalOpen?.(true);
    handleExit();
  }, [reason, isUpgrade, setPurchaseModalOpen, setAuthModalOpen, handleExit]);

  // Auto-dismiss after 30s if the user doesn't interact:
  // moments are doors, not walls — they don't hold the screen.
  useEffect(() => {
    if (!activeMoment) return undefined;
    const t = setTimeout(() => handleDismiss(), 30_000);
    return () => clearTimeout(t);
  }, [activeMoment, handleDismiss]);

  if (!activeMoment) return null;

  const { headline, body } = activeMoment;
  const accent = isUpgrade ? VIOLET : GOLD;

  return (
    <div
      // P11 — role='status' (implicitly polite) matches aria-live='polite' for a
      // non-urgent, auto-dismissing promo. role='alert' is assertive and
      // contradicted the polite live region, interrupting the SR user.
      role="status"
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
      <div
        // First-contact gloss: a bare tier word as a badge is jargon for a new
        // DM. The native title= names the tier plainly, in voice.
        title={isUpgrade ? 'Cartographer: the subscription that runs the region for years.' : undefined}
        style={{
          fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: accent,
          marginBottom: 6,
        }}
      >
        {isUpgrade ? 'Cartographer' : 'Upgrade'}
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
          // P8/P7 — the nudge's single CTA is the loud focal action in BOTH
          // reason paths: gold unlock → 'primary' (ink on gold, 7.6:1); violet
          // upgrade → 'aiSolid' (white on violet-500, 5.44:1), the loud peer of
          // primary rather than the washed 'ai' variant that read as secondary
          // and weakened first-click pull on the higher-value upsell. The accent
          // border-left + eyebrow keep the premium meaning multi-channel.
          variant={isUpgrade ? 'aiSolid' : 'primary'}
          size="lg"
          onClick={handleClick}
        >
          {isUpgrade ? 'See Cartographer' : 'Sign in to unlock'}
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={handleDismiss}
        >
          Not now
        </Button>
        <span style={{ flex: 1 }} />
        <span style={{
          fontSize: FS.xxs, color: BODY,
          fontStyle: 'italic',
        }}>
          Won't ask again for 24h
        </span>
      </div>
    </div>
  );
}
