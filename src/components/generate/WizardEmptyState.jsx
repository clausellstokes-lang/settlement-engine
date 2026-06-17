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
import { GOLD, INK, MUTED, SECOND, sans, serif_, SP, FS } from '../theme.js';
import HomeHero from '../HomeHero.jsx';
import { ModeSelector } from './ModeSelector.jsx';

// P128 / H-2 — Sample dossier proof card. Self-gates on flag +
// anonymous + no settlement yet; renders nothing once any of those
// flip. Mounted directly below HomeHero so anon visitors see proof of
// the moat without scrolling.
const HomeSampleDossier = lazy(() => import('../home/HomeSampleDossier.jsx'));

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
          <Suspense fallback={null}>
            <HomeSampleDossier />
          </Suspense>
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
          <button
            onClick={onSignIn}
            style={{ background: 'transparent', border: 'none', padding: 0, color: GOLD, fontWeight: 700, fontFamily: sans, fontSize: FS.sm, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign in (free)
          </button>
          {' '}to unlock Basic &amp; Advanced generation.
        </div>
      )}
    </div>
  );
}
