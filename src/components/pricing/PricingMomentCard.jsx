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

import { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '../../store/index.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { purchasesOpen } from '../../lib/launchGate.js';
import { GOLD, GOLD_SOFT, INK, BORDER, sans, serif_, FS, SP, swatch, BODY, CHROME, bottomClearance, aboveFooter, aboveBottomNav } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import Button from '../primitives/Button.jsx';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';
import { chromeFontSize } from '../../design/proseScale.js';

const SLATE = swatch['#5A6E82'];

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
const SLATE_REASONS = new Set([
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
  const mobile = useIsMobile();
  const isMobile = useIsMobile();
  const activeMoment = useStore(s => s.activePricingMoment);
  const clearMoment = useStore(s => s.clearActivePricingMoment);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  // Signup/unlock moments fire at anonymous users — their honest destination is
  // sign-in, not the buy-credits modal (restoration #16; lifted onto uiSlice so
  // this app-wide nudge can reach it).
  const setAuthModalOpen = useStore(s => s.setAuthModalOpen);
  const [exiting, setExiting] = useState(false);
  // Every exit timer this card has armed and not yet seen fire, held so the card
  // can release them when it leaves the tree. A 220 ms handle that outlives the
  // mount dispatches into a torn-down renderer: React reads window inside
  // resolveUpdatePriority and throws ReferenceError after a jsdom file's teardown
  // (the CI red, judgment 242). A second dismiss inside the exit window arms a
  // second handle, so the pending set is a list rather than a single id: keeping
  // both arms alive is what leaves the arming behaviour exactly as it was.
  const exitTimers = useRef(/** @type {ReturnType<typeof setTimeout>[]} */ ([]));

  // Pre-declare handlers via useCallback so the auto-dismiss effect can
  // depend on a stable reference (react-hooks/exhaustive-deps wants it).
  const handleExit = useCallback(() => {
    setExiting(true);
    const timer = setTimeout(() => {
      exitTimers.current = exitTimers.current.filter((pending) => pending !== timer);
      clearMoment?.();
      setExiting(false);
    }, 220);
    exitTimers.current.push(timer);
  }, [clearMoment]);

  // The release half of the same handle. This effect arms nothing of its own; its
  // cleanup is the whole point, and it is the discipline the 30 s auto-dismiss
  // below already keeps. The exit animation, its 220 ms and the clearMoment it
  // fires are untouched: only a handle whose tree is gone is dropped.
  useEffect(() => () => {
    for (const timer of exitTimers.current) clearTimeout(timer);
    exitTimers.current = [];
  }, []);

  const reason = activeMoment?.reason;
  // One source of truth for the moment's intent — drives accent, eyebrow, label,
  // AND the click destination so they cannot drift apart (P8/P11). A violet
  // reason upgrades (purchase modal); a gold reason is a signup/unlock prompt for
  // an anon user (auth modal).
  const isUpgrade = SLATE_REASONS.has(reason);

  const handleDismiss = useCallback(() => {
    Funnel.track(EVENTS.PRICING_MOMENT_DISMISSED, { reason });
    handleExit();
  }, [reason, handleExit]);

  const handleClick = useCallback(() => {
    Funnel.track(EVENTS.PRICING_MOMENT_CLICKED, { reason });
    // Route to the destination the eyebrow + label promise: upgrade moments open
    // the purchase modal; signup/unlock moments open sign-in (never the buy-wall).
    if (isUpgrade) setPurchaseModalOpen?.(true);
    else setAuthModalOpen?.(true);
    handleExit();
  }, [reason, isUpgrade, setPurchaseModalOpen, setAuthModalOpen, handleExit]);

  // Auto-dismiss after 30s if the user doesn't interact. Critique X-2:
  // moments are doors, not walls — they don't hold the screen.
  useEffect(() => {
    if (!activeMoment) return undefined;
    const t = setTimeout(() => handleDismiss(), 30_000);
    return () => clearTimeout(t);
  }, [activeMoment, handleDismiss]);

  if (!activeMoment) return null;

  const { headline, body } = activeMoment;
  const accent = isUpgrade ? SLATE : GOLD;
  // THE LAUNCH GATE (lib/launchGate.js): only the UPGRADE moment leads to a
  // purchase, so only its CTA closes until launch. The gold signup/unlock CTA
  // opens sign-in, and accounts stay open, so it is untouched.
  const purchasesAreOpen = purchasesOpen();
  const launchLocked = isUpgrade && !purchasesAreOpen;

  return (
    <div
      // P11 — role='status' (implicitly polite) matches aria-live='polite' for a
      // non-urgent, auto-dismissing promo. role='alert' is assertive and
      // contradicted the polite live region, interrupting the SR user.
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        // Mobile lifts the card above the fixed bottom nav (+ safe-area inset)
        // so the fixed nudge never tucks under the nav row; desktop keeps the
        // plain SP.lg gap (no bottom nav there), lifted above the pinned footer by
        // aboveFooter (owner order 2026-09-16; the inset is 0px on phones), and over the
        // bottom bar from 640 to 1023 px by aboveBottomNav.
        bottom: aboveFooter(isMobile ? bottomClearance(CHROME.fabLift) : aboveBottomNav(SP.lg)),
        right: SP.lg,
        maxWidth: 360,
        width: 'calc(100% - 32px)',
        zIndex: 9500,
        background: swatch.white,
        border: `1px solid ${BORDER}`,
        borderLeft: `4px solid ${accent}`,
        padding: SP.md,
        boxShadow: '0 8px 24px rgba(27, 20, 8, 0.18)',
        transform: exiting ? 'translateY(20px)' : 'translateY(0)',
        opacity: exiting ? 0 : 1,
        transition: 'transform 0.22s ease-out, opacity 0.22s ease-out',
        fontFamily: sans,
      }}
    >
      <div style={{
        fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: accent,
        marginBottom: 6,
      }}>
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
          variant="primary"
          onClick={handleClick}
          disabled={launchLocked}
          // While launch-locked the pill may wrap below the label on a narrow card.
          style={{
            background: accent, color: swatch.white, border: `1px solid ${accent}`,
            ...(launchLocked ? { flexWrap: 'wrap' } : null),
          }}
        >
          {isUpgrade ? 'See Cartographer' : 'Sign in to unlock'}
          {/* The opaque soft-gold ground keeps the pill's gold ink legible on the
              solid slate fill, where the translucent tint alone falls near 1.6:1. */}
          {launchLocked && <AvailableAtLaunchPill style={{ marginLeft: 6, background: GOLD_SOFT }} />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
        >
          Not now
        </Button>
      </div>
    </div>
  );
}
