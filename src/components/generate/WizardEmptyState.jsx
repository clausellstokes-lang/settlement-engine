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
import { SECOND, BORDER, CARD, SP, R, FS, LANDING_MAX } from '../theme.js';
import HomeHero from '../HomeHero.jsx';
import { ModeSelector } from './ModeSelector.jsx';
import Button from '../primitives/Button.jsx';
import PageHeader from '../primitives/PageHeader.jsx';

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

// Sample dossier proof card. Self-gates on flag +
// anonymous + no settlement yet; renders nothing once any of those
// flip. Mounted directly below HomeHero so anon visitors see proof of
// the moat without scrolling.
const HomeSampleDossier = lazy(() => import('../home/HomeSampleDossier.jsx'));

// "Watch a region wake up" read-only replay. Self-gates inside on
// anon + no-settlement (same as the sample dossier), so it renders nothing once
// the visitor has the real thing. Mounted below the sample dossier so the
// teaser ladder reads: proof of the static dossier → proof of the LIVING world.
const RegionWakeReplay = lazy(() => import('../home/RegionWakeReplay.jsx'));

export function WizardEmptyState({
  showHomeHero,
  showModePicker,
  setWizardMode,
  authTier,
  onSignIn,
  onNavigate,
}) {
  // ONE landing frame. The whole Create-landing stack (hero + proof cards + the
  // signed-in heading + mode picker) shares LANDING_MAX so the column has a
  // single edge, rather than HomeHero/WelcomeBack/mode-picker each nesting a
  // bespoke width inside a wider parent.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl, maxWidth: LANDING_MAX, margin: '0 auto', padding: `${SP.xl}px 0` }}>
      {showHomeHero && (
        <>
          <HomeHero onSignIn={onSignIn} onNavigate={onNavigate} />
          <Suspense fallback={<ProofSkeleton height={360} />}>
            <HomeSampleDossier />
          </Suspense>
          <Suspense fallback={<ProofSkeleton height={280} />}>
            <RegionWakeReplay onUpgrade={() => onNavigate?.('pricing')} />
          </Suspense>
        </>
      )}
      {!showHomeHero && (
        <PageHeader
          eyebrow="Forge a settlement"
          title="Create a settlement"
          subtitle="Choose a generation mode to get started."
          size="lg"
        />
      )}
      {/* The hero is the single focal point for the signed-in landing: it owns
          the "Roll now" intent. The mode picker is a SUBORDINATE "want full
          control?" affordance, so it renders in the quiet (non-large) variant —
          smaller compact cards, no background image, no hover-lift — rather than
          two large cards competing with the hero CTA for the squint-test winner. */}
      {showModePicker && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, width: '100%', margin: '0 auto' }}>
          <div className="sf-readable-strip" style={{ textAlign: 'center', fontSize: FS.sm, color: SECOND }}>
            Want full control? Use one of the modes below.
          </div>
          {/* This branch only renders when no mode is selected, so no card is
              active — ModeSelector reads `mode` as undefined. */}
          <ModeSelector mode={undefined} onModeChange={setWizardMode} />
        </div>
      )}
      {/* Anonymous visitors get instant generation (the hero) only; Basic and
          Advanced are gated to signed-in users. Surface the (free) path so the
          gate is discoverable rather than a silently-missing feature. */}
      {!showModePicker && authTier === 'anon' && (
        <div className="sf-readable-strip" style={{ alignSelf: 'center', textAlign: 'center', fontSize: FS.sm, color: SECOND }}>
          Want full control?{' '}
          <Button variant="ghost" size="sm" onClick={onSignIn} style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'underline', minHeight: 44 }}>
            Sign in (free)
          </Button>
          {' '}to unlock Basic &amp; Advanced generation.
        </div>
      )}
    </div>
  );
}
