/**
 * HomeLanding.jsx — the marketing front door: a scrollable landing page that is
 * both advertisement and onboarding. It walks a cold visitor down "the salt
 * road" — Hero → 01 Forge → 02 Visual → 03 Voice → 04 Realm → 05 Commons →
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
 * ⛔ ON A PHONE THE HERO IS THE WHOLE PAGE (the owner, ODQ §934.27: "for the landing
 * page, I only want this part to show, not the other scroll down … and its background
 * image as the only one"). Below the estate's mobile breakpoint the below-fold chunk is
 * NOT MOUNTED — not hidden — so the phone never reaches for it or for the paintings its
 * five scenes name, the hero fills the band between the arrow header and the bottom bar,
 * and the scroll cue leaves with the road it pointed down. Tablet and desktop are
 * unchanged. Pinned at both widths in tests/ui/homeLanding.test.jsx.
 *
 * ⚠ ONE CONSEQUENCE, DEFERRED AND WRITTEN DOWN: LandingBelowFold's own `isMobile`
 * branches are now unreachable, since its ONE mount is gated on `!isMobile`. Retiring
 * them is a separate edit in a file concurrent lanes hold work in; the prop keeps being
 * passed honestly (it really is false there) rather than being hard-coded, so the day
 * the gate moves nothing has to be un-lied.
 *
 * (This wholesale rewrite replaced the flag-gated single-hero + V2 bands; the
 * landing no longer forks on flag('landingV2') — see src/lib/flags.js.)
 */

import { lazy, Suspense, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from './primitives/Button.jsx';
import { PARCH, PARCH_100, GOLD, FS, SP, sans, serif_, FOOTER_INSET, HEADER_H, BOTTOM_NAV_H } from './theme.js';
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

  // Full-bleed: cancel <main>'s padding so every section spans edge to edge. THE PAINTED
  // ARROW (owner orders 2026-09-16) is transparent around its nock and arrowhead, so the
  // landing also pulls the hero up UNDER the header (HEADER_H): the dark scene, not cream,
  // shows through the painting's gaps. The hero's own top padding adds the same length,
  // so its content still starts below the shaft.
  const padX = isMobile ? SP.md : SP.xxl;   // matches App.jsx main padding-inline
  const padT = isMobile ? SP.md : SP.lg;    // main padding-top (the landing takes no hang reserve)
  const padB = isMobile ? 100 : SP.lg;      // main padding-bottom (mobile reserves 100)

  return (
    <div style={{ marginTop: `calc(-${padT}px - ${HEADER_H})`, marginRight: `-${padX}px`, marginBottom: `-${padB}px`, marginLeft: `-${padX}px` }}>
      {/* ══ Hero — dark painted village scene, the page's single <h1> ══ */}
      <section
        aria-labelledby="sf-hero-title"
        className="sf-landing-hero"
        style={{
          '--sf-scene': HERO_SCENE,
          // THE LETTERBOX (desktop; owner orders 2026-09-16, LD-3b realised). At 86vh
          // (index.css) the hero ended short of the viewport, and at 2000x1093 a strip of
          // the film showed below the dark band, right where the owner said the footer
          // belongs. The hero starts at the top of the viewport, under the transparent
          // painted header, so on desktop it is sized to the viewport less the pinned
          // footer's floating band (useChromeInsets, 1024 px and up) and the bottom bar
          // (640 to 1023 px): its bottom edge IS the band's (or the bar's) top edge at every
          // viewport height. It is inline here, in this lazy chunk, rather than a rule in
          // the injected sheet, because the first-paint entry closure has no bytes to spare.
          //
          // ⭐ THE PHONE TAKES THE SAME RULE NOW (ODQ §934.27: "the hero fills the viewport
          // between the arrow header … and the bottom bar"). It used to fall through to
          // index.css's 86vh, which was right while five more scenes waited below — the
          // short hero was the promise that scrolling was worth it. With nothing below the
          // fold there is nothing to promise, and 14vh of page ground under the painting
          // would read as the page having failed to load. The length is the same
          // expression as desktop's: on a phone FOOTER_INSET is 0px (the footer is in the
          // flow, pinnedFooter.test.jsx (d)) and BOTTOM_NAV_H is the bar plus its safe
          // area (ArrowHeader.arrowVarValues), so it resolves to exactly the band between
          // the two chromes at every phone height. The `.sf-landing-hero` 86vh rule in
          // index.css stays: an inline min-height wins over it, and it is still the
          // pre-hydration floor the eager sheet paints with.
          minHeight: `calc(100vh - ${FOOTER_INSET} - ${BOTTOM_NAV_H})`,
          // Lift the hero above the fixed film backdrop (zIndex 0, mounted in the
          // lazy below-fold): the hero owns its own eager still-0 paint (LCP), the
          // backdrop only shows through the transparent travel legs below.
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          paddingTop: `calc(${isMobile ? SP.xxl * 2 : 72}px + ${HEADER_H})`, paddingRight: `${isMobile ? SP.lg : 24}px`,
          paddingBottom: `${isMobile ? SP.xxl : 48}px`, paddingLeft: `${isMobile ? SP.lg : 24}px`,
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
            prefers-reduced-motion, spec §9/§10).

            ⛔ IT LEAVES WITH THE ROAD IT POINTS DOWN (ODQ §934.27). On a phone #forge is
            not mounted, so this anchor would resolve to nothing: `scrollToForge` finds no
            element and swallows the click, and a reader who used the keyboard would follow
            a link into an empty fragment and change the URL for it. A cue to scroll on a
            page with nothing below the fold is a promise the page cannot keep. */}
        {!isMobile && (
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
        )}
      </section>

      {/* ══ Everything below the fold — one lazy chunk, and NOT MOUNTED ON A PHONE ══
          ⛔ THE OWNER (ODQ §934.27): "for the landing page, I only want this part to show,
          not the other scroll down … and its background image as the only one." The ruling
          as built: "everything below the fold is NOT MOUNTED at phone width (so the phone
          fetches none of it — the build's own law that the landing never fetches a painting
          it does not show)".

          NOT HIDDEN — NOT MOUNTED, and the difference is the whole order. React.lazy
          requests its chunk when the component MOUNTS, so `display:none` or a CSS
          media query would still have the phone pay for the film backdrop, the five
          scene sections and every painting they name. The gate is on the mount. */}
      {!isMobile && (
        <Suspense fallback={<div aria-hidden="true" style={{ minHeight: '50vh' }} />}>
          <LandingBelowFold isMobile={isMobile} onNavigate={onNavigate} onSignIn={onSignIn} />
        </Suspense>
      )}
    </div>
  );
}
