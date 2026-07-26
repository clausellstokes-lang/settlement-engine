/**
 * WizardOutputToolbar.jsx — sticky back-navigation toolbar.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx, then grown a right-hand
 * utility cluster: the sticky toolbar above the generated dossier carries
 * Back, the settlement name + tier/pop summary, and the quiet utilities —
 * "How this was simulated" (SimulationDrawer trigger), Regenerate, and New.
 * Values and handlers arrive via props; the only local state is presentational
 * chrome — the mobile overflow-menu open flag and the hide-on-scroll flag.
 *
 * DESKTOP keeps the three utilities visible in a right-aligned cluster. MOBILE
 * (order W2-f) compacts to ONE row — Back + name + an "⋯" overflow menu holding
 * the same three utilities — and auto-hides the bar on scroll-down / reveals it
 * on scroll-up (and always reveals it on keyboard focus, so no control is ever
 * unreachable). The single `utilities` fragment feeds both layouts so the two
 * never drift.
 *
 * SimulationDrawer is lazy so the drawer (and its PipelineRail import graph)
 * stays off this toolbar's synchronous path — the wizard chunk must not
 * statically re-absorb the dossier drawer.
 */

import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { GOLD, INK, INK_DEEP, MUTED, serif_, SP, FS, CHROME } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { formatCount } from '../../domain/formatNumber.js';

const SimulationDrawer = lazy(() => import('../dossier/SimulationDrawer.jsx'));

export function WizardOutputToolbar({
  settlement,
  isMobile,
  handleBack,
  handleGenerate,
  generating = false,
  handleNewSettlement,
  maxWidth,
}) {
  // Mobile overflow-menu open flag + the hide-on-scroll flag. Both are pure UI
  // chrome; the actions themselves stay parent-owned.
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef(null);
  const lastYRef = useRef(0);

  // Auto-hide on scroll-down, reveal on scroll-up (mobile only, where vertical
  // room is scarce). A small dead-zone avoids jitter; the bar never hides until
  // the reader has scrolled past the fold. Desktop keeps the bar always present.
  useEffect(() => {
    if (!isMobile || typeof window === 'undefined') return undefined;
    lastYRef.current = window.scrollY || 0;
    const onScroll = () => {
      const y = window.scrollY || 0;
      const last = lastYRef.current;
      if (y > last + 6 && y > 96) setHidden(true);
      else if (y < last - 6) setHidden(false);
      lastYRef.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  // Escape closes the overflow menu; a click outside it closes it too.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [menuOpen]);

  // The three quiet utilities — defined once, rendered as the desktop cluster OR
  // inside the mobile "⋯" menu (a column via the menu container's align-stretch),
  // so the two layouts can never carry a different control set.
  const utilities = (
    <>
      {/* "How this was simulated" — the metadata drawer trigger, hoisted from the
          dossier action band so the utility controls cluster together. Lazy + null
          fallback: the trigger simply pops in. */}
      <Suspense fallback={null}>
        <SimulationDrawer variant="toolbar" />
      </Suspense>
      {/* Regenerate — re-rolls a fresh draft from the same config (the current
          draft is discarded). A quiet secondary; Save below stays the primary. */}
      <Button
        variant="secondary"
        size="md"
        onClick={() => {
          setMenuOpen(false);
          void handleGenerate();
        }}
        disabled={generating}
        busy={generating}
        aria-label="Regenerate draft"
        title="Roll a fresh draft from the same configuration. The current draft is discarded."
      >
        {!generating && <span aria-hidden="true">↻ </span>}
        {generating ? 'Regenerating draft…' : 'Regenerate draft'}
      </Button>
      {/* "New Draft" restarts from the Create landing with a clean slate — a quiet
          outline. Save (below the dossier) is the one primary. */}
      <Button
        variant="secondary"
        size="md"
        onClick={() => { setMenuOpen(false); handleNewSettlement(); }}
        title="Start a fresh draft from the Create landing. Your current draft is cleared."
      >
        New Draft
      </Button>
    </>
  );

  return (
    <div
      // Reveal the bar the moment a keyboard user tabs into any of its controls,
      // so hide-on-scroll never strands focus behind a hidden bar.
      onFocusCapture={() => setHidden(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap',
        padding: `${SP.md}px ${SP.lg}px`,
        background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        // Cap the toolbar to the dossier's column and centre it so on wide screens
        // its edges align to the PAGE_MAX dossier below instead of overhanging full
        // <main> width. Applied to the toolbar's OWN box — it must NOT be wrapped in
        // a height-collapsed parent, or it would lose its sticky containing block
        // and scroll away with the dossier.
        maxWidth, marginLeft: 'auto', marginRight: 'auto', width: '100%',
        // Pin below the sticky app header so bar and dossier sit flush on BOTH
        // breakpoints. Both offsets are now CHROME tokens (headerMobile / headerDesktop)
        // — the desktop side was a hardcoded `60` literal that could silently drift from
        // the real header height; the tokens keep the toolbar pinned to the header's
        // exact height. zIndex 40 keeps it above the dossier but below the header
        // (z:50), so the header always wins the overlap.
        position: 'sticky', top: isMobile ? CHROME.headerMobile : CHROME.headerDesktop, zIndex: 40,
        // Mobile hide-on-scroll: slide up behind the header when scrolling down;
        // never while the overflow menu is open. Desktop is always present.
        transform: (isMobile && hidden && !menuOpen) ? 'translateY(-140%)' : 'none',
        transition: 'transform 0.25s ease',
      }}
    >
      {/* Back is a subordinate nav/reset that discards the just-earned draft —
          it must not out-shout the dossier or Save. Demoted to the same
          secondary outline as the utility cluster so Save (below) stays the
          single primary of the post-generate region; the ArrowLeft icon keeps
          the affordance. */}
      <Button
        variant="secondary"
        size="md"
        icon={<ArrowLeft size={14} />}
        onClick={handleBack}
        title="Back to configuration"
      >
        Back
      </Button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: FS.lg, fontWeight: 700, fontFamily: serif_,
          color: GOLD, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {settlement.name || 'Untitled Settlement'}
        </div>
        <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {settlement.tier || 'Settlement'} &middot; Pop. {settlement.population != null ? formatCount(settlement.population) : '?'}
        </div>
      </div>

      {isMobile ? (
        // MOBILE — one compact row: the three utilities collapse into an "⋯" menu
        // so Back + name + trigger fit a single line instead of a full-width third
        // row wrapping under the name.
        <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setMenuOpen(o => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="More draft actions"
            title="More draft actions"
          >
            <span aria-hidden="true" style={{ fontSize: FS.lg, lineHeight: 1, letterSpacing: '0.08em' }}>⋯</span>
          </Button>
          {menuOpen && (
            <div
              role="menu"
              aria-label="Draft actions"
              style={{
                // A flat gold-ruled plate (the deep-craft rule-framed idiom — a token
                // border, no z-axis shadow); the strong rule separates it from the
                // dark toolbar without elevation.
                position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: SP.xs,
                padding: SP.sm, minWidth: 220,
                background: INK_DEEP,
                border: `1px solid ${GOLD}`,
              }}
            >
              {utilities}
            </div>
          )}
        </div>
      ) : (
        // DESKTOP — the utilities stay visible, clustered to the right of the name
        // (unchanged from the original right-aligned layout).
        <div style={{ display: 'flex', gap: SP.xs, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {utilities}
        </div>
      )}
    </div>
  );
}
