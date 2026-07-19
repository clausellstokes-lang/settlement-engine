/**
 * HomeLanding.jsx — the marketing front door: a scrollable landing page that is
 * both advertisement and onboarding. It walks a cold visitor down "the salt
 * road" — Hero → 01 Forge → 02 Brief → 03 Voice → 04 Realm → 05 Commons →
 * 06 Set out — teaching one lifecycle stage per painted-scene section while
 * selling it (landing spec).
 *
 * Shown on the Home tab; a bare-root visit canonicalizes here for logged-out
 * visitors (App.jsx front door — members are sent to /create), and the CTAs
 * adapt by auth state. Icons via Lucide (spec §3.5).
 *
 * PERF: the hero paints first (LCP) and is the only eager part; everything below
 * the fold is ONE React.lazy chunk (LandingBelowFold). The verbatim marketing
 * copy + its tl() lookup live in the lazily-segmented src/copy/landing.js
 * module — read here for the hero, and never rides the first-paint entry closure
 * (this module is itself lazy-loaded by AppViews).
 *
 * (This wholesale rewrite replaced the flag-gated single-hero + V2 bands; the
 * landing no longer forks on flag('landingV2') — see src/lib/flags.js.)
 */

import { lazy, Suspense, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from './primitives/Button.jsx';
import { PARCH, PARCH_100, GOLD, FS, SP, sans, serif_ } from './theme.js';
import { trackLandingView } from '../lib/landingFunnelAnalytics.js';
import { tl } from '../copy/landing.js';

// Everything below the hero fold, code-split into ONE lazy chunk so the hero is
// the only first-paint work on the landing surface (spec §8).
const LandingBelowFold = lazy(() => import('./home/LandingBelowFold.jsx'));

// C2 THE FILM RULING: the hero sits over STILL-0, the desk (the growth film's
// origin frame), not the old village scene — the journey begins at the desk and
// the film scrubs desk → thorp on the first travel leg below. This eager still is
// also the hero's LCP paint (law #3: the hero paints over the optimized still-0
// image); the lazy film backdrop mounts behind and aligns on it at scroll top.
const HERO_SCENE = "url('/media/journey-legs/bg/still-0-desk.jpg')";

// Respect reduced motion for the "follow the road" smooth scroll.
function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function scrollToForge(e) {
  e.preventDefault();
  const el = typeof document !== 'undefined' && document.getElementById('forge');
  if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

export default function HomeLanding({ isMobile, signedIn, onNavigate, onSignIn }) {
  // Instrument the Welcome page (W-DOC): the landing funnel joins the SM-5
  // pattern — landing_funnel_used feature:'view', once per session, via the
  // lazy helper (lib/landingFunnelAnalytics.js). This LANDS the previously
  // dormant Funnel.welcomeView seam.
  useEffect(() => {
    trackLandingView();
  }, []);

  // Full-bleed: cancel <main>'s padding so every section spans edge to edge.
  const padX = isMobile ? SP.md : SP.xxl;   // matches App.jsx main padding-inline
  const padT = isMobile ? SP.md : SP.lg;    // main padding-top
  const padB = isMobile ? 100 : SP.lg;      // main padding-bottom (mobile reserves 100)

  return (
    <div style={{ margin: `-${padT}px -${padX}px -${padB}px` }}>
      {/* ══ Hero — dark painted village scene, the page's single <h1> ══ */}
      <section
        aria-labelledby="sf-hero-title"
        className="sf-landing-hero"
        style={{
          '--sf-scene': HERO_SCENE,
          // Lift the hero above the fixed film backdrop (zIndex 0, mounted in the
          // lazy below-fold): the hero owns its own eager still-0 paint (LCP), the
          // backdrop only shows through the transparent travel legs below.
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: isMobile ? `${SP.xxl * 2}px ${SP.lg}px ${SP.xxl}px` : '72px 24px 48px',
        }}
      >
        <div style={{ maxWidth: 880, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 id="sf-hero-title" style={{
            margin: `0 0 ${SP.xl}px`, fontFamily: serif_, fontSize: isMobile ? FS['34'] : FS['58'],
            fontWeight: 600, lineHeight: 1.12, color: PARCH, textWrap: 'balance',
            textShadow: '0 2px 12px rgba(0,0,0,0.55)',
          }}>
            {tl('hero.h1a')}<br />{tl('hero.h1b')}
          </h1>
          <p style={{
            margin: `0 0 ${SP.xl + SP.sm}px`, maxWidth: 640, fontFamily: serif_, fontStyle: 'italic',
            fontSize: FS['18'], lineHeight: 1.6, color: 'rgba(251,245,230,0.88)',
            textShadow: '0 1px 6px rgba(0,0,0,0.5)',
          }}>
            {tl('hero.sub')}
          </p>
          <div style={{ display: 'flex', gap: SP.md, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="primary" size="lg" onClick={() => onNavigate('generate')}>
              {tl('hero.cta')}
            </Button>
            {/* Sign in — the app's dark-hero ghost treatment (translucent cream
                border), not the parchment ghost variant. Hidden once signed in. */}
            {!signedIn && (
              <Button
                variant="secondary"
                size="lg"
                onClick={onSignIn}
                style={{
                  background: 'rgba(251,245,230,0.1)', color: PARCH_100,
                  borderColor: isMobile ? 'rgba(232,217,176,0.7)' : 'rgba(232,217,176,0.45)',
                }}
              >
                {tl('hero.signin')}
              </Button>
            )}
          </div>
          <div style={{ marginTop: SP.md, fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: 'rgba(251,245,230,0.7)' }}>
            {tl('hero.reassure')}
          </div>
        </div>
        {/* Scroll cue → #forge. The bounce is on .sf-landing-cue (killed under
            prefers-reduced-motion, spec §9/§10). */}
        <a
          href="#forge"
          onClick={scrollToForge}
          style={{ marginTop: 'auto', paddingTop: SP.xxl, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textDecoration: 'none' }}
        >
          <span style={{
            fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(251,245,230,0.65)', whiteSpace: 'nowrap',
          }}>
            {tl('hero.scrollCue')}
          </span>
          <span className="sf-landing-cue" style={{ display: 'inline-flex' }}>
            <ChevronDown size={18} color={GOLD} aria-hidden="true" />
          </span>
        </a>
      </section>

      {/* ══ Everything below the fold — one lazy chunk ══ */}
      <Suspense fallback={<div aria-hidden="true" style={{ minHeight: '50vh' }} />}>
        <LandingBelowFold isMobile={isMobile} onNavigate={onNavigate} onSignIn={onSignIn} />
      </Suspense>
    </div>
  );
}
