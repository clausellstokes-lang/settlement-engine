/**
 * WizardEmptyState.jsx — Create landing (no mode picked, no settlement).
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. The empty state:
 * HomeHero + sample dossier for anonymous visitors, the "Create a
 * Settlement" heading for signed-in, and the Basic/Advanced mode picker
 * (gated to signed-in) or the sign-in upsell for anon. Presentational —
 * every value and handler arrives via props; state stays in the parent.
 */

import { lazy, Suspense } from 'react';
import { INK, MUTED, SECOND, BORDER, CARD, sans, serif_, SP, R, FS } from '../theme.js';
import HomeHero from '../HomeHero.jsx';
import { ModeSelector } from './ModeSelector.jsx';
import Button from '../primitives/Button.jsx';

// Below-hero proof cards lazy-load; reserve their space with a height-matched
// skeleton so the acquisition surface reads as "loading", not a blank gap that
// pops in and shifts layout on cold connections (P9: skeletons over null).
function ProofSkeleton({ height }) {
  return (
    <div aria-hidden="true" style={{
      height, borderRadius: R.lg, border: `1px solid ${BORDER}`, background: CARD,
      opacity: 0.6,
    }} />
  );
}

// P128 / H-2 — Sample dossier proof card. Self-gates on flag +
// anonymous + no settlement yet; renders nothing once any of those
// flip. Mounted directly below HomeHero so anon visitors see proof of
// the moat without scrolling.
const HomeSampleDossier = lazy(() => import('../home/HomeSampleDossier.jsx'));

// "Watch a region wake up" read-only replay. Self-gates inside on
// anon + no-settlement (same as the sample dossier), so it renders nothing
// once the visitor has the real thing. Mounted beside the sample dossier so
// the teaser ladder reads: proof of the static dossier → proof of the LIVING
// world.
const RegionWakeReplay = lazy(() => import('../home/RegionWakeReplay.jsx'));

// The premium one-click Instant World entry, shown beside the Basic/Advanced
// mode picker for signed-in users. Lazy so its composer/config surface never
// enters first paint; it self-gates on premium (fires the pricing moment for
// non-premium reaches).
const InstantWorldEntry = lazy(() => import('../instant/InstantWorldEntry.jsx'));

export function WizardEmptyState({
  showHomeHero,
  showModePicker,
  isMobile,
  wizardMode,
  setWizardMode,
  authTier,
  onSignIn,
  onNavigate,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl, maxWidth: 860, margin: '0 auto', padding: `${SP.xl}px 0` }}>
      {showHomeHero && (
        <>
          <HomeHero onSignIn={onSignIn} onNavigate={onNavigate} />
          {/* The two anon proof cards sit side by side on wider screens and
              stack on narrow ones (see .sf-proof-pair), so they stop doubling
              the landing's vertical length: proof of the static dossier beside
              proof of the living world. Both self-gate anon-only, so signed-in
              users see nothing here. */}
          <div className="sf-proof-pair">
            <Suspense fallback={<ProofSkeleton height={360} />}>
              <HomeSampleDossier />
            </Suspense>
            <Suspense fallback={<ProofSkeleton height={360} />}>
              <RegionWakeReplay onUpgrade={() => onNavigate?.('pricing')} />
            </Suspense>
          </div>
        </>
      )}
      {!showHomeHero && (
        <div style={{ textAlign: 'center', padding: `${SP.md}px 0` }}>
          <h2 style={{
            fontFamily: serif_,
            fontSize: isMobile ? FS.xxl : 32,
            fontWeight: 700,
            color: INK,
            margin: 0,
            marginBottom: SP.sm,
          }}>
            Create a Settlement
          </h2>
          <p style={{
            fontFamily: sans,
            fontSize: FS.md,
            color: MUTED,
            margin: 0,
          }}>
            Choose a generation mode to get started.
          </p>
        </div>
      )}
      {showModePicker && (
        <>
          {/* One-click premium realm sits ABOVE the manual mode picker — the
              instant path is the paid convenience; Basic/Advanced remain the
              free road. Self-gates on premium (lazy). */}
          <Suspense fallback={<ProofSkeleton height={120} />}>
            <InstantWorldEntry isMobile={isMobile} onNavigate={onNavigate} />
          </Suspense>
          <div className="sf-readable-strip" style={{ alignSelf: 'center', textAlign: 'center', fontSize: FS.sm, color: SECOND }}>
            Want full control? Use one of the modes below.
          </div>
          <ModeSelector mode={wizardMode} onModeChange={setWizardMode} large />
        </>
      )}
      {/* Anonymous visitors get instant generation (the hero) only; Basic and
          Advanced are gated to signed-in users. Surface the (free) path so the
          gate is discoverable rather than a silently-missing feature. */}
      {!showModePicker && authTier === 'anon' && (
        <div className="sf-readable-strip" style={{ alignSelf: 'center', textAlign: 'center', fontSize: FS.sm, color: SECOND }}>
          Want full control?{' '}
          {/* P99 mobile pointer-target floor: the sm ghost button is 28px tall.
              Grow the TAP target to the 44px floor with vertical padding, then
              pull it back with equal negative margin so the inline text line
              stays exactly where it was (transparent ghost bg → zero visual
              regression; only the hit area grows). */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignIn}
            style={{ display: 'inline-flex', textDecoration: 'underline', minHeight: 44, paddingTop: 10, paddingBottom: 10, marginTop: -8, marginBottom: -8 }}
          >
            Sign in (free)
          </Button>
          {' '}to unlock Basic &amp; Advanced generation.
        </div>
      )}
    </div>
  );
}
