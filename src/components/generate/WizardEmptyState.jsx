/**
 * WizardEmptyState.jsx — Create landing (no mode picked, no settlement).
 *
 * The empty state: HomeHero for anonymous visitors, the "Create a settlement"
 * PageHeader for signed-in, and the Basic/Advanced mode picker (gated to signed-in)
 * rendered as ONE quiet parchment card. Presentational — every value and handler
 * arrives via props; state stays in the parent. Restores master's base-of-record
 * composition (LANDING_MAX frame, PageHeader, quiet ModeSelector).
 *
 * Walk W1 (owner order 2026-07-21, ledger — CREATE-PAGE DEMOTION): the two anon
 * proof exhibits (HomeSampleDossier "Hightower's Reach" + RegionWakeReplay "watch a
 * region wake up") were UNMOUNTED from this surface — "that job has been transferred
 * to the landing page," which now carries the proof-of-depth. The two component files
 * are left intact: they have no other runtime consumer, and they are DISTINCT modules
 * (not duplicates of the landing's own fixture artifacts), so the item's delete-only-
 * duplicates permission does not apply — they stay available to be re-homed. The
 * Instant World premium card was earlier unmounted the same way (C1r-d).
 */

import { BORDER, INK, BODY, sans, serif_, SP, FS, LANDING_MAX } from '../theme.js';
import HomeHero from '../HomeHero.jsx';
import { ModeSelector } from './ModeSelector.jsx';
import PageHeader from '../primitives/PageHeader.jsx';

export function WizardEmptyState({
  showHomeHero,
  showModePicker,
  setWizardMode,
  onSignIn,
  onNavigate,
}) {
  // ONE landing frame. The Create-landing stack (hero + the signed-in heading +
  // mode picker) shares LANDING_MAX so the column has a single edge, rather than
  // HomeHero/WelcomeBack/mode-picker each nesting a bespoke width inside a wider parent.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl, maxWidth: LANDING_MAX, margin: '0 auto', padding: `${SP.xl}px 0` }}>
      {showHomeHero && (
        <HomeHero onSignIn={onSignIn} onNavigate={onNavigate} />
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
    </div>
  );
}
