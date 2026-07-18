/**
 * WizardEmptyState.jsx — Create landing (no mode picked, no settlement).
 *
 * The empty state: HomeHero + the two anon proof cards for anonymous visitors,
 * the "Create a settlement" PageHeader for signed-in, and the Basic/Advanced
 * mode picker (gated to signed-in) rendered as ONE quiet parchment card.
 * Presentational — every value and handler arrives via props; state stays in
 * the parent. Restores master's base-of-record composition (LANDING_MAX frame,
 * PageHeader, quiet ModeSelector); the 0168e287 merge had regressed it to a
 * plain-h2 heading + large ModeSelector + an above-the-fold InstantWorldEntry.
 */

import { lazy, Suspense } from 'react';
import { BORDER, CARD, INK, BODY, sans, serif_, SP, R, FS, LANDING_MAX } from '../theme.js';
import HomeHero from '../HomeHero.jsx';
import { ModeSelector } from './ModeSelector.jsx';
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

// The premium "Instant World" entry — re-homed below the fold as a SUBORDINATE
// exhibit (C1r-c1 / the FORGE composition's "demo artifacts below the fold").
// Lazy exactly as before (never in first paint); it self-gates internally on
// premium/elevated (a non-premium reach fires the pricing moment), so it renders
// only in the signed-in mode-picker context where it has always lived.
const InstantWorldEntry = lazy(() => import('../instant/InstantWorldEntry.jsx'));

export function WizardEmptyState({
  showHomeHero,
  showModePicker,
  setWizardMode,
  onSignIn,
  onNavigate,
  isMobile,
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
          {/* The two anon proof cards sit side by side on wider screens and
              stack on narrow ones (see .sf-proof-pair), so they stop doubling
              the landing's vertical length: proof of the static dossier beside
              proof of the living world. */}
          <div className="sf-proof-pair">
            {/* Below the fold, both proof cards render as half-scale miniatures
                (C1r-c2 "true miniatures") — flat, narrower exhibits that stop the
                pair from doubling the landing's vertical length. `compact` is
                presentational; the replay keeps its >=44px scrubber controls. */}
            <Suspense fallback={<ProofSkeleton height={300} />}>
              <HomeSampleDossier compact />
            </Suspense>
            <Suspense fallback={<ProofSkeleton height={300} />}>
              <RegionWakeReplay compact onUpgrade={() => onNavigate?.('pricing')} />
            </Suspense>
          </div>
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
      {/* The mode picker reads as ONE parchment card matching the signed-in
          instant-generator hero above it (same gradient, hairline, radius, and
          soft shadow), with the two named modes as side-by-side buttons inside.
          The heading sits a step below the hero's so the "roll now" CTA stays
          the squint-test winner. */}
      {showModePicker && (
        <section
          aria-label="Generation modes"
          style={{
            // Deep Craft material: a FLAT parchment plate (hairline rule, no
            // rounded corners or drop shadow) — master's composition (the "one
            // parchment section" heading + quiet ModeSelector) on the materials-
            // bridge surface, so the kill-list ratchet does not regress.
            maxWidth: LANDING_MAX, margin: '0 auto',
            padding: `${SP.xl}px ${SP.lg}px`,
            background: 'linear-gradient(180deg, #FBF5E6 0%, #F4EAD0 100%)',
            border: `1px solid ${BORDER}`,
            fontFamily: sans,
            textAlign: 'center',
          }}
        >
          <h2 style={{
            margin: 0, fontFamily: serif_, fontWeight: 600,
            fontSize: FS.xl, color: INK, lineHeight: 1.2,
          }}>
            Want full control?
          </h2>
          <p style={{
            margin: `${SP.xs}px auto 0`, maxWidth: 480,
            fontFamily: serif_, fontStyle: 'italic',
            fontSize: FS.sm, color: BODY, lineHeight: 1.55,
          }}>
            Use one of the modes below.
          </p>
          {/* This branch only renders when no mode is selected, so no card is
              active — ModeSelector reads `mode` as undefined. */}
          <ModeSelector mode={undefined} onModeChange={setWizardMode} />
        </section>
      )}
      {/* THE PREMIUM EXHIBIT (C1r-c1). Instant World re-homed here, BELOW the
          mode picker, as a subordinate below-the-fold exhibit — it was dropped
          from this surface's above-the-fold slot in C1r-b (the single-plate law)
          and is otherwise unmounted anywhere; re-mounting it here (same props +
          handlers, still lazy) restores the functionality without competing with
          the hero's Forge CTA. Gated to the signed-in mode-picker context, since
          it self-gates on premium and anon never reaches the mode picker. */}
      {showModePicker && (
        <Suspense fallback={<ProofSkeleton height={120} />}>
          <InstantWorldEntry isMobile={isMobile} onNavigate={onNavigate} />
        </Suspense>
      )}
    </div>
  );
}
