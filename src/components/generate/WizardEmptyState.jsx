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

import { BORDER, GOLD, INK, BODY, sans, serif_, SP, FS, LANDING_MAX } from '../theme.js';
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
  // The signed-in Create landing is ONE card now (owner order 2026-07-22): the
  // "Welcome back" instant-generator and the "Want full control?" mode picker were
  // two stacked parchment plates; they merge into a single plate split by a gold
  // rule (the SAME GOLD token the Generate button uses). Structure, not rewrite:
  // HomeHero renders `bare` (its plate chrome dropped) as the top section, and the
  // mode picker's content sits below the divider — both keep every behavior.
  const merged = showHomeHero && showModePicker;

  // The mode-picker content (heading + one-liner + the Basic/Advanced selector),
  // rendered inside the merged card below the gold divider.
  const modeSection = (
    <>
      <h2 style={{ margin: 0, fontFamily: serif_, fontWeight: 600, fontSize: FS.xl, color: INK, lineHeight: 1.2 }}>
        Want full control?
      </h2>
      <p style={{ margin: `${SP.xs}px auto 0`, maxWidth: 480, fontFamily: serif_, fontStyle: 'italic', fontSize: FS.sm, color: BODY, lineHeight: 1.55 }}>
        Use one of the modes below.
      </p>
      {/* No mode is selected on this landing, so no card is active — ModeSelector
          reads `mode` as undefined. */}
      <ModeSelector mode={undefined} onModeChange={setWizardMode} />
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl, maxWidth: LANDING_MAX, margin: '0 auto', padding: `${SP.xl}px 0` }}>
      {merged ? (
        <section
          aria-label="Create a settlement"
          style={{
            // ONE flat parchment plate holding both sections (the gold rule below
            // the instant-generator hero divides it from the mode picker).
            maxWidth: LANDING_MAX, margin: '0 auto',
            padding: `${SP.xxl}px ${SP.xl}px`,
            background: 'linear-gradient(180deg, #FBF5E6 0%, #F4EAD0 100%)',
            border: `1px solid ${BORDER}`,
            fontFamily: sans,
            textAlign: 'center',
          }}
        >
          <HomeHero onSignIn={onSignIn} onNavigate={onNavigate} bare />
          {/* The divider — the SAME GOLD as the Generate button (the GOLD token,
              never a new hex). */}
          <hr aria-hidden="true" style={{ border: 0, borderTop: `2px solid ${GOLD}`, maxWidth: 480, margin: `${SP.xl}px auto` }} />
          {modeSection}
        </section>
      ) : showHomeHero ? (
        <HomeHero onSignIn={onSignIn} onNavigate={onNavigate} />
      ) : (
        <PageHeader
          eyebrow="Forge a settlement"
          title="Create a settlement"
          subtitle="Choose a generation mode to get started."
          size="lg"
        />
      )}
    </div>
  );
}
