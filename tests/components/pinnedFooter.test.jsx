/**
 * @vitest-environment jsdom
 *
 * tests/components/pinnedFooter.test.jsx: THE PINNED FOOTER'S STYLE CONTRACT.
 *
 * The owner's orders (2026-09-16): "The footer is missing on the landing page. When
 * we scroll, the header/ribbon remains sticky. The footer should be the same way on
 * every page." Then: only the links row (Pricing | Feedback & support | Terms |
 * Privacy | About) floats at the viewport bottom, and "only when a user scrolls all
 * the way to the bottom does it show the rest of the footer, including the logo".
 * And, of the footer itself: "keep it the same".
 *
 * What this file pins (jsdom has no layout engine, so these are CONTRACTS; the
 * geometry lives in e2e/pinned-footer.spec.js):
 * THE PAINTED ARROW (owner orders 2026-09-16, the chair's ruling on its plan): the footer pins
 * only where the full painted arrow shows, 1024 px and up. From 640 to 1023 px the bottom bar
 * holds the viewport's bottom edge, so the footer lies in the page flow (its look unchanged)
 * with the page's bottom padding clearing the bar, and both footer variables are 0px there.
 * The header's height is no longer measured by the footer hook: ArrowHeader writes it.
 *
 *   (a) desktop: the one global <footer> is sticky on the header's own layer, its
 *       bottom offset is minus THE TUCK (the tuck variable, never a literal 0), it sits
 *       outside any <header>, and its nav is still labelled "Footer";
 *   (b) that layer sits above the landing's positioned content (z 1) and below the
 *       drawer scrim, read from the registry, so drawers stay modal;
 *   (c) below 1024 px: the footer stays in the page flow (never sticky); on phones with its nav
 *       clearance, on a plain route and on the landing, on a LOW layer (z 2): above
 *       the landing's fixed film (z 0) and its z-1 roots, so they cannot paint over
 *       it, and below the generation reveal (z 45) and the sticky header (z 50), as
 *       the unpositioned footer was; from 640 to 1023 px its look is the desktop one and the
 *       page's bottom padding clears the bar; the landing hero takes the letterbox height
 *       (the BAND and the bar subtracted: the hero starts under the transparent header) on
 *       desktop only;
 *   (d) useChromeInsets measures THE BAND (the footer's top edge to the top of the row
 *       after the links row, floored) and THE TUCK (the full height minus the band),
 *       re-measures on resize, writes 0px for both when the footer is not pinned, and
 *       removes both variables on unmount; App wires it with the 1024 breakpoint;
 *   (e) aboveFooter's output, and theme.js re-exporting the leaf's names;
 *   (f) the injected rules (scroll-padding-bottom, the footer controls' matching
 *       scroll-margin, print for the footer and for the arrow's hang layer, the keyboard
 *       reveal on :focus-visible) spell the exported names, reach the document once, and
 *       stay OUT of the render-blocking src/index.css (its byte budget had 5 B of headroom);
 *   (g) the links row carries the stable hook, and the home button is the row after it.
 */

import React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';

import useChromeInsets from '../../src/hooks/useChromeInsets.js';
import * as leaf from '../../src/lib/chromeInsets.js';
import { CHROME_INSET_RULES, CHROME_INSET_STYLE_ID } from '../../src/lib/chromeInsets.js';
import LegalRibbonRow from '../../src/components/footer/LegalRibbonRow.jsx';
import {
  ARROW_BARB_CLEAR, ARROW_CLEAR, ARROW_HANG, ARROW_VARS, BOTTOM_NAV_H, BOTTOM_NAV_H_VAR, CHROME, FOOTER_INSET, FOOTER_INSET_VAR,
  FOOTER_LINKS_ATTR, FOOTER_TUCKED_BOTTOM, FOOTER_TUCK_VAR, HEADER_H, HEADER_HEIGHT_VAR, aboveBottomNav, aboveFooter,
  bottomClearance,
} from '../../src/components/theme.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const H = vi.hoisted(() => ({
  route: { view: 'compendium', params: {}, legacy: false, notFound: false },
  isMobile: false,
  // The painted arrow's switch (useIsMobile(1024)); null follows isMobile.
  narrow: null,
  storeState: null,
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: {},
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

vi.mock('../../src/hooks/useRoute.js', () => ({
  useRoute: () => H.route,
  navigate: vi.fn(),
  replacePath: vi.fn(),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  hasStoredAuthToken: () => false,
  isConfigured: false,
  supabase: { auth: { getUser: () => Promise.resolve({ data: { user: null } }) } },
}));

vi.mock('../../src/hooks/useIsMobile', () => ({
  default: (bp) => (bp === 1024 ? (H.narrow ?? H.isMobile) : H.isMobile),
}));

vi.mock('../../src/lib/stripe.js', () => ({
  checkCheckoutResult: () => null,
  fetchCreditBalance: () => Promise.resolve(0),
}));

// The leaf mock that keeps App's own dynamic import of the real stripe.js from
// landing after jsdom teardown (see landingFooterMigration.test.jsx for the race).
vi.mock('../../src/lib/creditLedger.js', () => ({
  fetchCreditBalanceFromLedger: () => Promise.resolve(0),
}));

vi.mock('../../src/components/pricing/PricingMomentCard.jsx', () => ({
  default: () => null,
}));

// Plain routes are stubbed: the footer belongs to the shell, not the view. The
// LANDING is deliberately real, because the hero's inline letterbox height and the
// band's lost footer row are part of the contract.
vi.mock('../../src/components/CompendiumPanel.jsx', () => ({
  default: () => <div data-testid="compendium-view">compendium</div>,
}));
vi.mock('../../src/components/legal/TermsPage.jsx', () => ({
  default: () => <div data-testid="terms-view">terms</div>,
}));

function makeState(overrides = {}) {
  return {
    authModalOpen: false,
    setAuthModalOpen: vi.fn(),
    auth: { tier: 'anon', displayName: null, role: null, user: null, loading: false },
    isElevated: () => false,
    wizardMode: null,
    settlement: null,
    initAuth: vi.fn(),
    authSignOut: vi.fn(),
    onboardingNudge: null,
    clearOnboardingNudge: vi.fn(),
    purchaseModalOpen: false,
    setPurchaseModalOpen: vi.fn(),
    setCreditBalance: vi.fn(),
    creditBalance: 0,
    loadCampaigns: vi.fn(),
    loadCustomContentFromCloud: vi.fn(() => Promise.resolve()),
    migrateLocalCustomContentToCloud: vi.fn(() => Promise.resolve()),
    clearCloudCustomContent: vi.fn(),
    setActivePricingMoment: vi.fn(),
    canSave: () => false,
    activeSaveId: null,
    savedSettlements: [],
    campaignSyncError: null,
    clearCampaignSyncError: vi.fn(),
    ...overrides,
  };
}

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(H.storeState);
  useStore.getState = () => H.storeState;
  return { useStore };
});

import App from '../../src/App.jsx';

const ROOT = process.cwd();
const REGISTRY = JSON.parse(readFileSync(join(ROOT, 'scripts/.ui-a11y-contract.json'), 'utf8'));

/** A regex-safe spelling of a literal. */
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Fixed boxes standing in for a layout engine. The footer is placed at top 500 so the
 * band is a DIFFERENCE of two rects (a hook that read the next row's top alone, or the
 * footer's height alone, would write the wrong number). Values are binary-exact so the
 * tuck prints without float noise.
 */
const BOX = { FOOTER_TOP: 500, FOOTER_H: 121.5, NEXT_TOP: 551.75 };

function stubMeasurements() {
  return vi.spyOn(window.HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function rect() {
    let top = 0;
    let height = 0;
    if (this.tagName === 'FOOTER') { top = BOX.FOOTER_TOP; height = BOX.FOOTER_H; }
    else if (this.matches(`[${FOOTER_LINKS_ATTR}] + *`)) { top = BOX.NEXT_TOP; height = 30; }
    return { x: 0, y: top, top, left: 0, right: 0, bottom: top + height, width: 0, height, toJSON() {} };
  });
}

/** A ResizeObserver double that records its callback so a test can fire a resize. */
function stubResizeObserver() {
  const observers = [];
  class FakeResizeObserver {
    constructor(cb) { this.cb = cb; this.targets = []; this.disconnected = false; observers.push(this); }
    observe(el) { this.targets.push(el); }
    unobserve() {}
    disconnect() { this.disconnected = true; }
  }
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  return observers;
}

const rootVar = (name) => document.documentElement.style.getPropertyValue(name);

beforeEach(() => {
  H.route = { view: 'compendium', params: {}, legacy: false, notFound: false };
  H.isMobile = false;
  H.narrow = null;
  H.storeState = makeState();
  Object.assign(BOX, { FOOTER_TOP: 500, FOOTER_H: 121.5, NEXT_TOP: 551.75 });
  window.history.replaceState(null, '', '/compendium');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  for (const name of [FOOTER_INSET_VAR, FOOTER_TUCK_VAR, ...ARROW_VARS]) document.documentElement.style.removeProperty(name);
});

describe('(a) desktop: the one footer is pinned the way the header is, tucked below its links row', () => {
  test('sticky with a bottom of minus the tuck, on the header layer, outside any header, nav still labelled', () => {
    const { container } = render(<App />);
    const footers = container.querySelectorAll('footer');
    expect(footers.length).toBe(1);
    const footer = footers[0];
    const header = container.querySelector('.parchment-bg > header');
    expect(header, 'presence control: the desktop header rendered').not.toBeNull();

    expect(header.style.position).toBe('sticky');
    expect(footer.style.position, 'the footer pins like the header').toBe('sticky');
    // Only the links band floats: the offset is NEGATIVE by the measured tuck, routed
    // through the variable so the keyboard reveal can zero it on the footer itself.
    expect(FOOTER_TUCKED_BOTTOM).toBe(`calc(0px - var(${FOOTER_TUCK_VAR}, 0px))`);
    expect(footer.style.bottom, 'the tuck, not a literal 0').toBe(FOOTER_TUCKED_BOTTOM);
    expect(footer.style.zIndex, 'the header and footer share one layer').toBe(header.style.zIndex);

    expect(footer.closest('header')).toBeNull();
    expect(footer.parentElement.classList.contains('parchment-bg')).toBe(true);
    expect(footer.querySelector('nav[aria-label="Footer"]')).not.toBeNull();
    expect(footer.querySelectorAll('[data-testid="legal-ribbon-row"]').length).toBe(1);
  });

  test('the look does not change: background, rule and padding are the pre-pin values', () => {
    const { container } = render(<App />);
    const footer = container.querySelector('footer');
    expect(footer.style.borderTop).toBe('1px solid rgba(160, 118, 42, 0.25)');
    expect(footer.style.padding).toBe('16px 24px');
    expect(footer.style.background).toMatch(/^linear-gradient\(to right,/);
  });
});

describe('(b) the footer layer, against the registry', () => {
  test('above the landing content (z 1) and below the drawer scrim, so drawers stay modal', () => {
    const { container } = render(<App />);
    const z = Number(container.querySelector('footer').style.zIndex);
    const scrim = REGISTRY.zLayers.drawerScrim;
    expect(Number.isFinite(scrim) && scrim > 0, 'presence control: the registry names drawerScrim').toBe(true);
    expect(z).toBeGreaterThanOrEqual(2);
    expect(z).toBeLessThan(scrim);
    expect(Object.values(REGISTRY.zLayers).includes(z), `z ${z} is a registered layer, not a magic number`).toBe(true);
  });
});

describe('(c) phones keep the in-flow footer; the landing hero letterboxes on desktop only', () => {
  test('mobile /terms: in the flow on a low layer, the nav clearance padding, one row', () => {
    H.isMobile = true;
    H.route = { view: 'terms', params: {}, legacy: false, notFound: false };
    window.history.replaceState(null, '', '/terms');
    const { container } = render(<App />);
    const footer = container.querySelector('footer');
    expect(footer, 'presence control: the mobile footer rendered').not.toBeNull();
    // relative with a zero offset: no geometry moves, but the footer takes a layer. The
    // offset is the same tuck expression, and the tuck is 0px on phones (see (d)).
    expect(footer.style.position).toBe('relative');
    expect(footer.style.bottom).toBe(FOOTER_TUCKED_BOTTOM);
    expect(document.documentElement.style.getPropertyValue(FOOTER_TUCK_VAR), 'no tuck on phones').toBe('0px');
    // Z 2: the lowest layer above the landing's z-1 roots. Before it was positioned the
    // phone footer painted under every positioned layer, so it stays under the two that
    // can overlap an in-flow footer: the generation reveal (a fixed full-viewport layer
    // that covers the content area while the collapsed page sits scrolled to its end)
    // and the sticky header on a short landscape phone. Both are read from source.
    const reveal = readFileSync(join(ROOT, 'src/components/generate/PipelineReveal.jsx'), 'utf8')
      .match(/position: 'fixed', inset: 0, zIndex: (\d+)/);
    expect(reveal, 'presence control: PipelineReveal still declares its fixed layer').not.toBeNull();
    const header = container.querySelector('.parchment-bg > header');
    expect(header, 'presence control: the mobile header rendered').not.toBeNull();
    expect(footer.style.zIndex).toBe('2');
    expect(Number(footer.style.zIndex), 'under the generation reveal').toBeLessThan(Number(reveal[1]));
    expect(Number(footer.style.zIndex), 'under the sticky mobile header').toBeLessThan(Number(header.style.zIndex));
    expect(footer.style.paddingBottom).toBe(`${CHROME.footerPadMobile}px`);
    expect(container.querySelectorAll('[data-testid="legal-ribbon-row"]').length).toBe(1);
  });

  test('mobile /home: the landing gets the same in-flow footer, one row, and the hero letterboxes too', async () => {
    H.isMobile = true;
    H.route = { view: 'home', params: {}, legacy: false, notFound: false };
    window.history.replaceState(null, '', '/');
    const { container } = render(<App />);
    // ⚠ THE WAIT MOVED, AND THE REASON IS THE ORDER (ODQ §934.27: "I only want this part
    // to show, not the other scroll down"). This arm used to settle on the below-fold's
    // closer heading; at phone width that chunk is NEVER MOUNTED, so waiting for it would
    // hang for the full timeout and then fail on a page that is behaving correctly. The
    // hero is the whole landing here, and it is eager, so it is what settles.
    const hero = await screen.findByRole('heading', { level: 1 });
    expect(hero.textContent, 'presence control: the hero really rendered').toContain('thousand choices');

    const footer = container.querySelector('footer');
    expect(footer).not.toBeNull();
    expect(footer.style.position, 'never sticky on phones').toBe('relative');
    expect(footer.style.paddingBottom).toBe(`${CHROME.footerPadMobile}px`);
    expect(container.querySelectorAll('[data-testid="legal-ribbon-row"]').length).toBe(1);

    const heroSection = container.querySelector('section[aria-labelledby="sf-hero-title"]');
    expect(heroSection.classList.contains('sf-landing-hero')).toBe(true);
    // Above the landing's lifted roots (the hero's own inline z 1), and so above the film (z 0).
    expect(heroSection.style.zIndex, 'presence control: the hero is lifted over the film').toBe('1');
    expect(Number(footer.style.zIndex), 'above the landing film and its z-1 roots').toBeGreaterThan(Number(heroSection.style.zIndex));
    // ⚠ THE LETTERBOX REACHES THE PHONE (§934.27: the hero "fills the viewport between the
    // arrow header … and the bottom bar"). It used to fall through to index.css's 86vh,
    // which was right while five more scenes waited below the fold; with nothing below it,
    // 14vh of page ground under the painting reads as a page that failed to load. The
    // expression is the desktop one, and it resolves correctly on a phone because
    // FOOTER_INSET is 0px here (arm (d) below) and BOTTOM_NAV_H is the bar plus its
    // safe area.
    expect(heroSection.style.minHeight).toBe(`calc(100vh - ${FOOTER_INSET} - ${BOTTOM_NAV_H})`);
  });

  test('640 to 1023 px /terms: the footer lies in the flow with its desktop look, and the page clears the bottom bar', () => {
    H.narrow = true;
    H.route = { view: 'terms', params: {}, legacy: false, notFound: false };
    window.history.replaceState(null, '', '/terms');
    const { container } = render(<App />);
    const footer = container.querySelector('footer');
    expect(footer, 'presence control: the footer rendered').not.toBeNull();
    // The chair's ruling: the footer pins only with the full arrow (1024 px and up).
    expect(footer.style.position).toBe('relative');
    expect(footer.style.zIndex).toBe('2');
    expect(footer.style.bottom).toBe(FOOTER_TUCKED_BOTTOM);
    expect(rootVar(FOOTER_INSET_VAR), 'the band is 0px below 1024').toBe('0px');
    expect(rootVar(FOOTER_TUCK_VAR), 'nothing is tucked below 1024').toBe('0px');
    // "keep it the same": the footer's own look is the desktop one at these widths.
    expect(footer.style.padding).toBe('16px 24px');
    expect(footer.style.borderTop).toBe('1px solid rgba(160, 118, 42, 0.25)');
    // The bottom bar shows here, so the page itself ends BOTTOM_NAV_H lower.
    const shell = container.querySelector('.parchment-bg');
    expect(shell.style.paddingBottom).toBe(BOTTOM_NAV_H);
    expect(rootVar('--sf-bottom-nav-h'), 'the bar height is published').toBe('calc(45px + env(safe-area-inset-bottom))');
    expect(container.querySelectorAll('[data-testid="legal-ribbon-row"]').length).toBe(1);
  });

  test('desktop /home: the hero letterboxes to the gap between the header and the band, and the footer is pinned', async () => {
    H.route = { view: 'home', params: {}, legacy: false, notFound: false };
    window.history.replaceState(null, '', '/');
    const { container } = render(<App />);
    const hero = await waitFor(() => {
      const el = container.querySelector('section[aria-labelledby="sf-hero-title"]');
      if (!el) throw new Error('hero not rendered yet');
      return el;
    }, { timeout: 8000 });
    expect(hero.classList.contains('sf-landing-hero')).toBe(true);
    // The band (FOOTER_INSET), never the full footer: at scroll 0 the hero's bottom edge
    // is the band's top edge, and the tucked rows hang below the viewport. The hero starts
    // under the transparent painted header (its wrapper pulls up by HEADER_H), so only the
    // band and the bottom bar (0px at 1024 and up) are subtracted.
    expect(hero.style.minHeight).toBe(`calc(100vh - ${FOOTER_INSET} - ${BOTTOM_NAV_H})`);
    expect(hero.parentElement.style.marginTop).toBe(`calc(-16px - ${HEADER_H})`);
    expect(FOOTER_INSET).toBe(`var(${FOOTER_INSET_VAR}, 0px)`);
    expect(container.querySelector('footer').style.position).toBe('sticky');
  });
});

describe('(d) useChromeInsets: the band, the tuck, re-measure, unpin, clean up', () => {
  /** A footer shaped like the real one: the links row, then the row after it. */
  function Probe({ pinned, withLinksRow = true }) {
    const { headerRef, footerRef } = useChromeInsets(pinned);
    return (
      <>
        <header ref={headerRef} />
        <footer ref={footerRef}>
          <div>
            <nav {...(withLinksRow ? { [FOOTER_LINKS_ATTR]: '' } : {})} />
            <button type="button">home</button>
            <div>copyright</div>
          </div>
        </footer>
      </>
    );
  }

  test('a pinned render writes the floored band and the tuck (full height minus band), and never the header', () => {
    stubMeasurements();
    stubResizeObserver();
    render(<Probe pinned />);
    // band = floor(551.75 - 500) = 51; tuck = 121.5 - 51 = 70.5.
    expect(rootVar(FOOTER_INSET_VAR), 'the inset is the BAND, not the full footer').toBe('51px');
    expect(rootVar(FOOTER_TUCK_VAR)).toBe('70.5px');
    // The painted header's length has one writer, ArrowHeader, and it is not this hook.
    expect(rootVar(HEADER_HEIGHT_VAR)).toBe('');
    expect(parseFloat(rootVar(FOOTER_INSET_VAR)) + parseFloat(rootVar(FOOTER_TUCK_VAR)), 'band + tuck = the whole footer').toBe(BOX.FOOTER_H);
  });

  test('a resize (a font swap or a wrap) re-measures both', () => {
    stubMeasurements();
    const observers = stubResizeObserver();
    render(<Probe pinned />);
    expect(observers.length).toBe(1);
    expect(observers[0].targets.map((el) => el.tagName)).toEqual(['FOOTER']);
    Object.assign(BOX, { FOOTER_H: 180.25, NEXT_TOP: 566.5 });
    act(() => { observers[0].cb([]); });
    expect(rootVar(FOOTER_INSET_VAR)).toBe('66px');
    expect(rootVar(FOOTER_TUCK_VAR)).toBe('114.25px');
  });

  test('NEGATIVE CONTROL: an unpinned render writes 0px for the band and the tuck', () => {
    stubMeasurements();
    stubResizeObserver();
    render(<Probe pinned={false} />);
    expect(rootVar(FOOTER_INSET_VAR)).not.toBe('51px');
    expect(rootVar(FOOTER_INSET_VAR)).toBe('0px');
    expect(rootVar(FOOTER_TUCK_VAR)).toBe('0px');
  });

  test('without the links-row hook the band falls back to the whole footer (nothing tucks away)', () => {
    stubMeasurements();
    stubResizeObserver();
    render(<Probe pinned withLinksRow={false} />);
    expect(rootVar(FOOTER_INSET_VAR)).toBe('121px');
    expect(rootVar(FOOTER_TUCK_VAR), 'under one pixel').toBe('0.5px');
  });

  test('flipping the pin re-runs the effect, and unmount removes both variables', () => {
    stubMeasurements();
    const observers = stubResizeObserver();
    const view = render(<Probe pinned />);
    expect(rootVar(FOOTER_TUCK_VAR)).toBe('70.5px');
    view.rerender(<Probe pinned={false} />);
    expect(observers[0].disconnected, 'the first observer is released').toBe(true);
    expect(rootVar(FOOTER_INSET_VAR)).toBe('0px');
    expect(rootVar(FOOTER_TUCK_VAR)).toBe('0px');
    view.unmount();
    expect(rootVar(FOOTER_INSET_VAR)).toBe('');
    expect(rootVar(FOOTER_TUCK_VAR)).toBe('');
    expect(observers.every((o) => o.disconnected)).toBe(true);
  });

  test('no ResizeObserver (older engines): the first measurement still lands', () => {
    stubMeasurements();
    vi.stubGlobal('ResizeObserver', undefined);
    render(<Probe pinned />);
    expect(rootVar(FOOTER_INSET_VAR)).toBe('51px');
    expect(rootVar(FOOTER_TUCK_VAR)).toBe('70.5px');
  });

  test('App wires the hook to the 1024 breakpoint and the real footer row: band and tuck with the full arrow, 0px below', () => {
    stubMeasurements();
    stubResizeObserver();
    const desktop = render(<App />);
    expect(rootVar(FOOTER_INSET_VAR), 'the real LegalRibbonRow carries the hook').toBe('51px');
    expect(rootVar(FOOTER_TUCK_VAR)).toBe('70.5px');
    desktop.unmount();
    expect(rootVar(FOOTER_INSET_VAR)).toBe('');
    expect(rootVar(FOOTER_TUCK_VAR)).toBe('');

    H.narrow = true;
    const tablet = render(<App />);
    expect(rootVar(FOOTER_INSET_VAR), '640 to 1023 px: not pinned').toBe('0px');
    expect(rootVar(FOOTER_TUCK_VAR)).toBe('0px');
    tablet.unmount();

    H.narrow = null;
    H.isMobile = true;
    render(<App />);
    expect(rootVar(FOOTER_INSET_VAR)).toBe('0px');
    expect(rootVar(FOOTER_TUCK_VAR)).toBe('0px');
  });
});

describe('(e) aboveFooter and the theme re-export', () => {
  test('a number base becomes px plus the inset; a string base nests', () => {
    expect(FOOTER_INSET).toBe(`var(${FOOTER_INSET_VAR}, 0px)`);
    expect(aboveFooter(16)).toBe('calc(16px + var(--sf-footer-inset, 0px))');
    expect(aboveFooter(bottomClearance(70)))
      .toBe('calc(calc(70px + env(safe-area-inset-bottom)) + var(--sf-footer-inset, 0px))');
  });

  test('theme.js re-exports the leaf itself, so there is one definition', () => {
    expect(aboveFooter).toBe(leaf.aboveFooter);
    expect(FOOTER_INSET_VAR).toBe(leaf.FOOTER_INSET_VAR);
    expect(FOOTER_TUCK_VAR).toBe(leaf.FOOTER_TUCK_VAR);
    expect(HEADER_HEIGHT_VAR).toBe(leaf.HEADER_HEIGHT_VAR);
    expect(FOOTER_LINKS_ATTR).toBe(leaf.FOOTER_LINKS_ATTR);
    expect(FOOTER_INSET).toBe(leaf.FOOTER_INSET);
    expect(FOOTER_TUCKED_BOTTOM).toBe(leaf.FOOTER_TUCKED_BOTTOM);
    // The painted arrow's lengths share the leaf.
    expect([HEADER_H, ARROW_HANG, ARROW_CLEAR, ARROW_BARB_CLEAR, BOTTOM_NAV_H, ARROW_VARS, aboveBottomNav])
      .toEqual([leaf.HEADER_H, leaf.ARROW_HANG, leaf.ARROW_CLEAR, leaf.ARROW_BARB_CLEAR, leaf.BOTTOM_NAV_H, leaf.ARROW_VARS, leaf.aboveBottomNav]);
    expect(aboveBottomNav(24)).toBe('calc(24px + var(--sf-bottom-nav-h, 0px))');
  });
});

describe('(f) the injected rules: exported spellings, injected once, out of the render-blocking sheet', () => {
  const rules = CHROME_INSET_RULES;
  const css = readFileSync(join(ROOT, 'src/index.css'), 'utf8');

  test('keyboard focus scrolls clear of the band and of the bottom bar (WCAG 2.2 SC 2.4.11)', () => {
    // The band is 0px wherever the bar shows (below 1024 px) and the bar 0px wherever the band
    // does, so the sum is whichever edge chrome the width has.
    expect(rules).toMatch(new RegExp(`html\\{scroll-padding-bottom:calc\\(var\\(${esc(FOOTER_INSET_VAR)}, 0px\\) \\+ var\\(${esc(BOTTOM_NAV_H_VAR)}, 0px\\)\\)\\}`));
  });

  test('the footer\'s own controls translate their focus rect up by the band, so focusing one never scrolls', () => {
    const inset = `var\\(${esc(FOOTER_INSET_VAR)}, 0px\\)`;
    expect(rules).toMatch(new RegExp(`\\.parchment-bg>footer \\*\\{scroll-margin:${inset} 0 calc\\(0px - ${inset}\\)\\}`));
  });

  test('print lays the footer back into the flow', () => {
    expect(rules).toMatch(/@media print\{\.parchment-bg>footer\{position:static!important\}\}/);
  });

  test('print leaves out the painted arrow\'s hang layer, so the feather never overprints a page', () => {
    expect(rules).toContain('@media print{.sf-arrow-hang{display:none}}');
  });

  test('the keyboard reveal zeroes the tuck on the footer while a tucked control is :focus-visible', () => {
    expect(rules).toContain(`.parchment-bg>footer:has(:focus-visible:not([${FOOTER_LINKS_ATTR}] *)){${FOOTER_TUCK_VAR}:0px}`);
    // Keyed on keyboard focus only: a mouse press must never make the footer jump.
    expectAbsentWithAnchor(rules, ':focus-within', ':focus-visible', 'the reveal keys on keyboard focus');
  });

  test('the letterbox is not a rule in the eager sheet (it rides the lazy landing chunk)', () => {
    expectAbsentWithAnchor(rules, 'sf-landing-hero', 'scroll-padding-bottom', 'the eager sheet carries no landing rule');
  });

  test('rendering the app injects the rules exactly once, even across remounts', () => {
    document.getElementById(CHROME_INSET_STYLE_ID)?.remove();
    expect(document.querySelectorAll(`style#${CHROME_INSET_STYLE_ID}`).length, 'starts with no sheet').toBe(0);
    const first = render(<App />);
    first.unmount();
    render(<App />);
    const sheets = document.head.querySelectorAll(`style#${CHROME_INSET_STYLE_ID}`);
    expect(sheets.length).toBe(1);
    expect(sheets[0].textContent).toBe(rules);
  });

  test('none of the footer rules is declared in the render-blocking index.css', () => {
    // The letterbox is an inline height in the lazy HomeLanding chunk (pinned in (c)), so
    // no declaration in this sheet may compose the footer variables at all. Comments are
    // stripped first (they may name a variable, and the build strips them too); the
    // injected rules spelling two of the names is the anchor that the names are live.
    const declarations = css.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(rules.includes(FOOTER_INSET_VAR) && rules.includes(FOOTER_TUCK_VAR), 'presence control: the names are live').toBe(true);
    for (const name of [FOOTER_INSET_VAR, FOOTER_TUCK_VAR]) {
      expect(declarations.includes(name), `${name} is not composed in index.css`).toBe(false);
    }
    // The painted header's band height is read by exactly one rule here, the lazy-route
    // floor (1 declaration per @supports arm), and never declared.
    expect(declarations.match(/min-height:\s*calc\(100s?vh - var\(--sf-header-h, 0px\)\)/g)).toHaveLength(2);
    expect(declarations.split(HEADER_HEIGHT_VAR).length - 1, 'no other use of the header length').toBe(2);
    expect(/scroll-padding-bottom\s*:/.test(css)).toBe(false);
    expect(/scroll-margin\s*:/.test(css)).toBe(false);
    expect(/@media\s+print/.test(css)).toBe(false);
    expect(css).toMatch(/\.sf-landing-hero\s*\{[^}]*min-height:\s*86vh/);
  });
});

describe('(g) the links row is the band: a stable hook, and the home button is the next row', () => {
  test('the nav carries the hook, the home button follows it, then the copyright line', () => {
    const { container } = render(<LegalRibbonRow isMobile={false} onNavigate={() => {}} showHome />);
    const nav = container.querySelector('nav[aria-label="Footer"]');
    expect(nav.hasAttribute(FOOTER_LINKS_ATTR)).toBe(true);
    expect(container.querySelectorAll(`[${FOOTER_LINKS_ATTR}]`).length).toBe(1);
    const next = container.querySelector(`[${FOOTER_LINKS_ATTR}] + *`);
    expect(next.getAttribute('aria-label'), 'the band ends at the home button').toBe('SettlementForge home');
    expect(next.nextElementSibling.textContent).toContain('Simulated, not AI-generated.');
    // The hook changes nothing about how the row looks.
    expect(nav.getAttribute('style')).toBe('display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap;');
  });
});
