/**
 * @vitest-environment jsdom
 *
 * tests/components/arrowHeader.test.jsx: THE PAINTED ARROW HEADER'S CONTRACT, in the app shell.
 *
 * The owner's orders (2026-09-16): "Replace the arrow ribbon entirely with the following
 * image however appropriate. ... I do not want you to emulate it." The header is the owner's
 * painting (components/nav/ArrowHeader.jsx over ArrowPaint and arrowGeometry), mounted once
 * for every width by App.jsx. jsdom has no layout engine, so these are CONTRACTS; the
 * geometry is measured in e2e/arrow-header.spec.js.
 *
 *   (a) structure: the header is a direct child of .parchment-bg (the a11y.css ring rule's
 *       selector); the nav buttons speak NAV's labels in NAV's order; aria-current marks
 *       the view's region only; one "SettlementForge home" button outside the nav; the
 *       anonymous "Sign In" inside the header; a click calls App's own nav handler;
 *   (b) the hang layer: the header's next sibling, sticky at the header's own length,
 *       aria-hidden, no pointer events, zero height, z 35 (under the dossier toolbar's 40);
 *   (c) decoration: every painted image is alt="" inside an aria-hidden wrapper, and no
 *       wrapper that clips holds anything focusable;
 *   (d) the containing-block and clipping traps (carried from the retired brandLockup and
 *       navFletching pins): no filter or transform on the header or any ancestor, no
 *       overflow clip on the header, the controls' chain or the open account menu's chain;
 *   (e) the ring: every control sets --sf-focus to INK and a hover wash; keyboard focus adds
 *       the PARCH_100 inner band (a mouse focus does not); a11y.css's ring width and the
 *       header's inset offset stay one number (carried from navFletching);
 *   (f) THE ONE WRITER: the five painted lengths on the document element equal the layout
 *       for the page width, the header and hang read the same length, main reserves the
 *       hang on every view but the landing, and unmount removes all five;
 *   (g) the breakpoint arms: phone (compact, five-seat bar, 44 px targets), 640 to 1023
 *       (compact, six-seat bar, desktop paddings, the page clears the bar) and 1024 up
 *       (full, no bar); exactly one nav named Primary at every width (the bar is that nav
 *       below 1024 px, right after the header in the Tab order);
 *   (h) THE FEATHER HIDES ON SCROLL (owner, 2026-09-17): opaque at the very top, transparent
 *       anywhere else, right on the first render of a page that loads scrolled, following
 *       the scroll listener both ways, while the hang layer that carries the barb never fades;
 *   (i) THE FIRST FRAME: a width that moves between the first render and the commit (a
 *       classic scrollbar appearing) is re-laid in the same task, before any paint.
 */

import React, { useLayoutEffect } from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import { NAV, barNav } from '../../src/lib/routes.js';
import { layoutArrow } from '../../src/components/nav/arrowGeometry.js';
import ArrowHeader, { arrowVarValues } from '../../src/components/nav/ArrowHeader.jsx';
import { ARROW_GLOW } from '../../src/components/nav/ArrowControl.jsx';
import {
  ARROW_HANG, ARROW_VARS, BOTTOM_NAV_H, HEADER_H, INK, PARCH_100,
} from '../../src/components/theme.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const H = vi.hoisted(() => ({
  route: { view: 'generate', params: {}, legacy: false, notFound: false },
  isMobile: false,
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

// The painted arrow's switch is useIsMobile(1024); the house phone flag is the default 640.
vi.mock('../../src/hooks/useIsMobile', () => ({
  default: (bp) => (bp === 1024 ? (H.narrow ?? H.isMobile) : H.isMobile),
}));

vi.mock('../../src/lib/stripe.js', () => ({
  checkCheckoutResult: () => null,
  fetchCreditBalance: () => Promise.resolve(0),
}));

// App's mount effect dynamically imports the real stripe.js past the mock above; the leaf
// mock keeps its creditLedger import from landing after jsdom teardown.
vi.mock('../../src/lib/creditLedger.js', () => ({
  fetchCreditBalanceFromLedger: () => Promise.resolve(0),
}));

vi.mock('../../src/components/pricing/PricingMomentCard.jsx', () => ({
  default: () => null,
}));

vi.mock('../../src/components/GenerateWizard.jsx', () => ({
  default: () => <div data-testid="generate-view">create</div>,
}));

vi.mock('../../src/components/account/OperatorMessagesProvider.jsx', () => ({
  useOperatorMessages: () => ({ unreadCount: 0, refresh: vi.fn(async () => []) }),
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
import { navigate } from '../../src/hooks/useRoute.js';

const ROOT = process.cwd();
const WIDTH = 1440;

/** Give the document element a clientWidth (jsdom reports 0). */
const setClientWidth = (w) => {
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, get: () => w });
};
const rootVar = (name) => document.documentElement.style.getPropertyValue(name);
const header = (container) => container.querySelector('.parchment-bg > header');
const navButtons = (container) => [...container.querySelectorAll('header nav button')];
const bottomBar = (container) => [...container.querySelectorAll('.parchment-bg > nav')].find((d) => d.style.position === 'fixed');
/** Stub the hover media query (and nothing else) for the glow arms. */
const stubHover = (hovers) => {
  vi.stubGlobal('matchMedia', (q) => ({
    matches: q === '(hover: hover)' ? hovers : false, media: q, addEventListener() {}, removeEventListener() {},
  }));
};
/** Give the window a scroll position (jsdom's is 0). */
const setScrollY = (y) => {
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => y });
};
/** Every control laid over the painting. */
const controls = (container) => [...header(container).querySelectorAll('button')];

beforeEach(() => {
  H.route = { view: 'generate', params: {}, legacy: false, notFound: false };
  H.isMobile = false;
  H.narrow = null;
  H.storeState = makeState();
  setClientWidth(WIDTH);
  window.history.replaceState(null, '', '/create');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete document.documentElement.clientWidth;
  delete window.scrollY;
  for (const name of ARROW_VARS) document.documentElement.style.removeProperty(name);
});

describe('(a) structure: the painting is the nav, and the doors keep their names', () => {
  test('the header is a direct child of .parchment-bg and the full arrow speaks NAV in order', () => {
    const { container } = render(<App />);
    const h = header(container);
    expect(h, 'the a11y.css ring rule selects .parchment-bg > header').not.toBeNull();
    expect(h.getAttribute('data-sf-arrow-header')).toBe('full');
    expect(h.querySelector('nav').getAttribute('aria-label')).toBe('Primary');
    expect(navButtons(container).map((b) => b.textContent.trim())).toEqual(NAV.map((n) => n.label));
    expect(navButtons(container).map((b) => b.getAttribute('data-sf-arrow-region'))).toEqual(NAV.map((n) => n.id));
  });

  test('aria-current is the ONLY current-page signal: no parchment mark is drawn on the shaft', () => {
    // Owner, 2026-09-19: of the active word's parchment plaque, "remove that as well", under
    // "revert it back to the way before with no parchment". Both marks the header has worn —
    // the 2 px PARCH_100 rule and the ten-row plaque that replaced it — are gone, so the
    // current destination is announced and not painted.
    H.route = { view: 'settlements', params: {}, legacy: false, notFound: false };
    const { container } = render(<App />);
    // Liveness anchor: the six regions really rendered and exactly one of them is current, so
    // the absence below is measured against a live header rather than an empty one.
    expect(navButtons(container).length).toBe(6);
    const current = navButtons(container).filter((b) => b.getAttribute('aria-current') === 'page');
    expect(current.map((b) => b.textContent.trim())).toEqual(['Library']);
    expect(container.querySelectorAll('header [data-sf-arrow-current]').length).toBe(0);
    // Nothing inside the NAV paints the parchment, whatever it calls itself. Scoped to the
    // nav on purpose: the SIGN IN slip on the brass plate is also PARCH_100 and STAYS — it is
    // AccountMenu's label ground, not a current-page mark, and the owner removed only the latter.
    const parchment = [...container.querySelectorAll('header nav *')]
      .filter((el) => el.style?.background === hexToRgb(PARCH_100));
    expect(parchment).toEqual([]);
    expect(container.querySelector('header [data-sf-arrow-plate] span')?.style.background)
      .toBe(hexToRgb(PARCH_100));
  });

  test('the rendered header paints no PARCH_100 mark under the active word', () => {
    // React's own serialisation, because jsdom drops forced-color-adjust and would hide a
    // re-added mark that only differed in that property.
    const html = renderToStaticMarkup(
      <ArrowHeader view="settlements" onNavClick={() => {}} onHome={() => {}} account={{ isAnon: true, onSignIn: () => {} }} />,
    );
    // Anchored on the word that IS rendered: if the nav stopped rendering at all, the anchor
    // fails rather than the absence passing vacuously. React serialises the token as hex.
    expectAbsentWithAnchor(html, 'data-sf-arrow-current', 'Library', 'ArrowHeader active mark');
    // Scoped to the nav: the SIGN IN slip on the brass plate is PARCH_100 too and stays.
    const nav = html.slice(html.indexOf('<nav'), html.indexOf('</nav>'));
    expectAbsentWithAnchor(nav, PARCH_100, 'Library', 'ArrowHeader parchment mark');
    expect(html.slice(html.indexOf('</nav>')), 'the SIGN IN slip keeps its parchment')
      .toContain(PARCH_100);
  });

  test('on a view with no painted word (the landing) no region is current', () => {
    H.route = { view: 'terms', params: {}, legacy: false, notFound: false };
    const { container } = render(<App />);
    expect(navButtons(container).length, 'presence control: the six regions rendered').toBe(6);
    expect(navButtons(container).filter((b) => b.hasAttribute('aria-current'))).toEqual([]);
  });

  test('exactly one "SettlementForge home" button, outside the nav; the anonymous Sign In lives in the header', () => {
    const { container } = render(<App />);
    const homes = controls(container).filter((b) => b.getAttribute('aria-label') === 'SettlementForge home');
    expect(homes.length).toBe(1);
    expect(homes[0].closest('nav')).toBeNull();
    const signIn = screen.getByRole('button', { name: 'Sign In' });
    expect(header(container).contains(signIn)).toBe(true);
    expect(signIn.textContent).toBe('Sign In');
  });

  test('a painted word calls App\'s own nav handler, and home routes home', () => {
    const { container } = render(<App />);
    navigate.mockClear();
    fireEvent.click(navButtons(container).find((b) => b.textContent === 'Library'));
    expect(navigate).toHaveBeenCalledWith('settlements');
    // The footer has its own home button too; this one is the painting's.
    fireEvent.click(within(header(container)).getByRole('button', { name: 'SettlementForge home' }));
    expect(navigate).toHaveBeenCalledWith('home');
  });
});

describe('(b) the feather hangs from its own zero-height sticky layer', () => {
  test('the header\'s next sibling: sticky at the header length, aria-hidden, no pointer events, height 0, z 35', () => {
    const { container } = render(<App />);
    const h = header(container);
    const hang = h.nextElementSibling;
    expect(hang.classList.contains('sf-arrow-hang')).toBe(true);
    expect(hang.getAttribute('aria-hidden')).toBe('true');
    expect(hang.style.pointerEvents).toBe('none');
    expect(hang.style.height).toBe('0px');
    expect(hang.style.position).toBe('sticky');
    expect(hang.style.top).toBe(HEADER_H);
    expect(Number(hang.style.zIndex)).toBe(35);
    // Under the pinned dossier toolbar (40) and the header (50), read from source.
    const toolbar = readFileSync(join(ROOT, 'src/components/generate/WizardOutputToolbar.jsx'), 'utf8').match(/position: 'sticky', top: HEADER_H, zIndex: (\d+)/);
    expect(toolbar, 'presence control: the toolbar still declares its sticky layer').not.toBeNull();
    expect(Number(hang.style.zIndex)).toBeLessThan(Number(toolbar[1]));
    expect(Number(hang.style.zIndex)).toBeLessThan(Number(h.style.zIndex));
    expect(hang.querySelector('[data-sf-arrow-paint="hang"]')).not.toBeNull();
    expect(hang.querySelectorAll('button, a, input, [tabindex]').length).toBe(0);
  });

  test('the registry names the hang layer', () => {
    const registry = JSON.parse(readFileSync(join(ROOT, 'scripts/.ui-a11y-contract.json'), 'utf8'));
    expect(registry.zLayers.arrowOverhang).toBe(35);
  });
});

describe('(c) the painting is decoration', () => {
  test('every painted image is alt="" inside an aria-hidden wrapper, and no clipping wrapper holds a control', () => {
    const { container } = render(<App />);
    const imgs = [...container.querySelectorAll('.parchment-bg > header img, .parchment-bg > .sf-arrow-hang img')];
    expect(imgs.length, 'presence control: the band and the hang both painted').toBeGreaterThan(1);
    for (const img of imgs) {
      expect(img.getAttribute('alt')).toBe('');
      expect(img.closest('[aria-hidden="true"]')).toBeTruthy();
    }
    const clips = [...container.querySelectorAll('[data-sf-arrow-paint]')];
    expect(clips.map((c) => c.getAttribute('data-sf-arrow-paint'))).toEqual(['band', 'hang', 'feather']);
    for (const clip of clips) {
      expect(clip.style.overflow).toBe('hidden');
      expect(clip.querySelectorAll('button, a, input, [tabindex]').length).toBe(0);
    }
  });
});

describe('(d) the containing-block and clipping traps', () => {
  test('no filter or transform on the header or any of its ancestors', () => {
    // A non-`none` filter or transform makes an element the containing block for every
    // `position: fixed` descendant, and the header's account menu is one.
    const { container } = render(<App />);
    let walked = 0;
    for (let el = header(container); el && el !== document.documentElement; el = el.parentElement) {
      walked += 1;
      expect(el.style?.filter, `<${el.tagName}> filters the header chain`).toBeFalsy();
      expect(el.style?.transform, `<${el.tagName}> transforms the header chain`).toBeFalsy();
    }
    expect(walked, 'the walk was vacuous').toBeGreaterThan(2);
    const h = header(container);
    expect(h.style.boxShadow).toBeFalsy();
    expect(h.style.background).toBeFalsy();
  });

  test('no overflow clip on the header, any control\'s chain, or the open account menu\'s chain', () => {
    H.storeState = makeState({ auth: { tier: 'free', displayName: 'Wanderer', role: null, user: { id: 'u1' }, loading: false } });
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Account menu, Wanderer' }));
    const menu = screen.getByRole('menu');
    const starts = [...controls(container), menu];
    expect(starts.length, 'presence control: controls and the menu rendered').toBeGreaterThan(8);
    for (const start of starts) {
      for (let el = start; el && el.tagName !== 'HEADER'; el = el.parentElement) {
        expect(['hidden', 'clip'].includes(el.style?.overflow), `<${el.tagName}> clips ${start.textContent}`).toBe(false);
        expect(el.style?.clipPath).toBeFalsy();
      }
    }
    expect(['hidden', 'clip'].includes(header(container).style.overflow)).toBe(false);
  });
});

describe('(e) the two-tone ring, and the hover glow', () => {
  test('every control sets --sf-focus to INK, switches the primitive\'s flat hover fill off, and never switches the ring off', () => {
    const { container } = render(<App />);
    const all = controls(container);
    expect(all.length, 'home, six words and the plate').toBe(8);
    for (const b of all) {
      expect(b.style.getPropertyValue('--sf-focus')).toBe(INK);
      expect(b.style.getPropertyValue('--sf-btn-hover-bg')).toBe('transparent');
      expect(b.style.outline).toBeFalsy();
      expect(b.style.borderRadius).toBe('0px');
    }
  });

  test('on a device that hovers, the pointer lights a soft glow on the word itself, inside the region, and leaving puts it out', () => {
    stubHover(true);
    const { container } = render(<App />);
    const expected = layoutArrow({ clientWidth: WIDTH, full: true });
    for (const [label, id] of [['Library', 'settlements'], ['Compendium', 'compendium']]) {
      const region = navButtons(container).find((b) => b.textContent === label);
      fireEvent.mouseEnter(region);
      const glow = region.querySelector('[data-sf-arrow-glow]');
      expect(glow, label).not.toBeNull();
      expect(glow.getAttribute('aria-hidden')).toBe('true');
      expect(glow.style.pointerEvents).toBe('none');
      const r = expected.hits.nav[id];
      const g = expected.hits.glow.nav[id];
      expect([glow.style.left, glow.style.top, glow.style.width, glow.style.height]).toEqual([`${g.x - r.x}px`, `${g.y - r.y}px`, `${g.w}px`, `${g.h}px`]);
      // Confined to the word: narrower than its region, which runs binding to binding.
      expect(g.w).toBeLessThan(r.w);
      fireEvent.mouseLeave(region);
      expect(region.querySelector('[data-sf-arrow-glow]')).toBeNull();
    }
    // The plate and home glow too.
    const home = within(header(container)).getByRole('button', { name: 'SettlementForge home' });
    fireEvent.mouseEnter(home);
    expect(home.querySelector('[data-sf-arrow-glow]')).not.toBeNull();
    const plate = within(header(container)).getByRole('button', { name: 'Sign In' });
    fireEvent.mouseEnter(plate);
    expect(plate.querySelector('[data-sf-arrow-glow]')).not.toBeNull();
    // The glow is a radial light through the house color-mix idiom (jsdom drops gradients, so
    // the spelling is read from the export the control spends).
    expect(ARROW_GLOW).toBe(`radial-gradient(closest-side, color-mix(in srgb, ${PARCH_100} 34%, transparent), transparent)`);
    expect(renderToStaticMarkup(<span style={{ background: ARROW_GLOW }} />)).toContain('radial-gradient(closest-side');
  });

  test('NEGATIVE CONTROL: on a touch screen (no real hover) the emulated mouseenter of a tap lights nothing', () => {
    stubHover(false);
    const { container } = render(<App />);
    const region = navButtons(container).find((b) => b.textContent === 'Library');
    fireEvent.mouseEnter(region);
    expect(region.querySelector('[data-sf-arrow-glow]')).toBeNull();
    expect(region.textContent, 'presence control: the region is there').toBe('Library');
  });

  test('keyboard focus adds the PARCH_100 inner band; blur removes it', () => {
    const { container } = render(<App />);
    const library = navButtons(container).find((b) => b.textContent === 'Library');
    const original = Element.prototype.matches;
    vi.spyOn(Element.prototype, 'matches').mockImplementation(function matches(sel) {
      return sel === ':focus-visible' ? true : original.call(this, sel);
    });
    fireEvent.focus(library);
    const band = library.querySelector('[data-sf-arrow-ring]');
    expect(band).not.toBeNull();
    expect(band.getAttribute('aria-hidden')).toBe('true');
    expect(band.style.outline).toContain('2px solid');
    fireEvent.blur(library);
    expect(library.querySelector('[data-sf-arrow-ring]')).toBeNull();
  });

  test('NEGATIVE CONTROL: a mouse focus (no :focus-visible) draws no inner band', () => {
    const { container } = render(<App />);
    const create = navButtons(container).find((b) => b.textContent === 'Create');
    const original = Element.prototype.matches;
    vi.spyOn(Element.prototype, 'matches').mockImplementation(function matches(sel) {
      return sel === ':focus-visible' ? false : original.call(this, sel);
    });
    fireEvent.focus(create);
    expect(create.querySelectorAll('[data-sf-arrow-ring]').length).toBe(0);
  });

  test('a11y.css draws the ring 3 px wide and the header insets it by exactly that width', () => {
    const a11y = readFileSync(join(ROOT, 'src/styles/a11y.css'), 'utf8');
    const ring = a11y.match(/outline:\s*(\d+(?:\.\d+)?)px\s+solid\s+var\(--sf-focus\)/);
    expect(ring, 'a11y.css no longer draws the ring this pin is derived from').toBeTruthy();
    expect(a11y).toContain('outline-offset: var(--sf-focus-ring-offset)');
    const inset = a11y.match(/\.parchment-bg > header \{\s*--sf-focus-ring-offset:\s*(-?\d+)px;\s*\}/);
    expect(inset, 'the header inset rule is gone').toBeTruthy();
    expect(Number(inset[1])).toBe(-Number(ring[1]));
  });
});

describe('(f) THE ONE WRITER: the painted lengths', () => {
  test('the five variables equal the layout for the page width, and the header and hang read one length', () => {
    const { container } = render(<App />);
    const expected = arrowVarValues(layoutArrow({ clientWidth: WIDTH, full: true }));
    expect(Object.keys(expected).sort()).toEqual([...ARROW_VARS].sort());
    for (const name of ARROW_VARS) expect(rootVar(name), name).toBe(expected[name]);
    expect(rootVar('--sf-header-h')).toBe(`calc(${68 * 0.6}px + env(safe-area-inset-top))`);
    expect(rootVar('--sf-bottom-nav-h'), 'no bar with the full arrow').toBe('0px');
    const h = header(container);
    expect(h.style.height).toBe(HEADER_H);
    expect(h.style.boxSizing).toBe('border-box');
    expect(h.style.position).toBe('sticky');
    expect(h.style.top).toBe('0px');
    expect(Number(h.style.zIndex)).toBe(50);
    expect(h.nextElementSibling.style.top).toBe(h.style.height);
  });

  test('main reserves the hang on every view but the landing, which pulls its hero up under the header', () => {
    const view = render(<App />);
    const main = view.container.querySelector('main#main-content');
    expect(main.style.paddingTop).toBe(`calc(${ARROW_HANG} + 16px)`);
    cleanup();
    H.route = { view: 'home', params: {}, legacy: false, notFound: false };
    const home = render(<App />);
    expect(home.container.querySelector('main#main-content').style.paddingTop).toBe('16px');
  });

  test('a width change re-lays the arrow, and unmount removes all five variables', () => {
    const view = render(<App />);
    expect(rootVar('--sf-arrow-hang')).toBe(`${110 * 0.6}px`);
    view.unmount();
    for (const name of ARROW_VARS) expect(rootVar(name), `${name} survived unmount`).toBe('');
    setClientWidth(1100);
    render(<App />);
    expect(rootVar('--sf-arrow-hang')).toBe(`${110 * (1100 / 2133)}px`);
  });
});

describe('(g) the breakpoint arms', () => {
  test('phone: the compact arrow, no painted nav, a five-seat bar, and 44 px home and plate targets', () => {
    H.isMobile = true;
    setClientWidth(390);
    const { container } = render(<App />);
    const h = header(container);
    expect(h.getAttribute('data-sf-arrow-header')).toBe('compact');
    expect(h.querySelector('nav')).toBeNull();
    expect(bottomBar(container).querySelectorAll('button').length).toBe(5);
    expect(bottomBar(container).getAttribute('aria-label')).toBe('Primary');
    const home = within(h).getByRole('button', { name: 'SettlementForge home' });
    const plate = within(h).getByRole('button', { name: 'Sign In' });
    for (const b of [home, plate]) {
      expect(parseFloat(b.style.minHeight)).toBeGreaterThanOrEqual(44);
      expect(parseFloat(b.style.height)).toBeGreaterThanOrEqual(44);
      expect(parseFloat(b.style.width)).toBeGreaterThanOrEqual(44);
    }
    expect(rootVar('--sf-bottom-nav-h'), 'the bar as rendered: a 44 px seat and its 1 px rule').toBe('calc(45px + env(safe-area-inset-bottom))');
  });

  // ⚠ "IN PRIORITY ORDER" IS RETIRED (the owner, ODQ §934.26 addendum: "i swap compendium
  // before gallery because that is also how it is on the desktop arrow"). The bar used to
  // read a hand-kept priority array whose only job was choosing which seat the five-seat
  // cap evicted, and which carried a SECOND ORDER as a side effect — Gallery before
  // Compendium, where the painting has them the other way. The tablet's six seats are now
  // the painting's own order, and this arm reads `barNav(false)` rather than a third copy
  // of it, so a reorder in routes.js moves the pin with the bar.
  test('640 to 1023 px: the compact arrow, a six-seat bar in the painting\'s order, desktop paddings, and the page clears the bar', () => {
    H.narrow = true;
    setClientWidth(800);
    const { container } = render(<App />);
    expect(header(container).getAttribute('data-sf-arrow-header')).toBe('compact');
    expect(header(container).querySelector('nav')).toBeNull();
    const seats = [...bottomBar(container).querySelectorAll('button')].map((b) => b.textContent.trim());
    expect(seats).toEqual(barNav(false).map((item) => item.label));
    expect(seats, 'the tablet keeps the Realm and every seat')
      .toEqual(['Create', 'Library', 'Realm', 'Compendium', 'Gallery', 'About']);
    const main = container.querySelector('main#main-content');
    expect([main.style.paddingRight, main.style.paddingBottom, main.style.paddingLeft]).toEqual(['24px', '16px', '24px']);
    expect(main.style.paddingTop).toBe(`calc(${ARROW_HANG} + 16px)`);
    expect(container.querySelector('.parchment-bg').style.paddingBottom).toBe(BOTTOM_NAV_H);
  });

  test('1024 px and up: the full arrow and no bottom bar', () => {
    setClientWidth(1024);
    const { container } = render(<App />);
    expect(header(container).getAttribute('data-sf-arrow-header')).toBe('full');
    expect(bottomBar(container)).toBeUndefined();
    expect(navButtons(container).length).toBe(6);
    // The retired ribbon's cells are gone from the rendered header; the painting's own
    // attributes on the same descendants prove the census is live.
    const attrs = new Set([...header(container).querySelectorAll('*')].flatMap((el) => el.getAttributeNames()));
    expectAbsentWithAnchor([...attrs], 'data-nav-cell', 'data-sf-arrow-region', 'the ribbon\'s cells left with the ribbon');
  });
});

describe('(g2) one primary nav landmark at every width, before the page', () => {
  test('390, 800 and 1440 px: exactly one nav named Primary, and below 1024 px it is the bar, right after the header', () => {
    for (const [width, isMobile, narrow] of [[390, true, true], [800, false, true], [1440, false, false]]) {
      H.isMobile = isMobile;
      H.narrow = narrow;
      setClientWidth(width);
      const { container } = render(<App />);
      const primary = screen.getAllByRole('navigation', { name: 'Primary' });
      expect(primary, `${width} px`).toHaveLength(1);
      const [nav] = primary;
      if (narrow) {
        expect(nav.closest('header'), `${width} px: the bar, not the header`).toBeNull();
        expect(nav.style.position).toBe('fixed');
        // In the DOM right after the header and its hang layer, so the destinations come
        // before main in the Tab order (it is fixed, so this moves nothing on screen).
        expect(nav.previousElementSibling.classList.contains('sf-arrow-hang')).toBe(true);
        expect(nav.nextElementSibling.tagName).toBe('MAIN');
      } else {
        expect(header(container).contains(nav)).toBe(true);
      }
      cleanup();
    }
  });
});

describe('(h) the feather hides on scroll, and only the feather', () => {
  const featherOf = (container) => container.querySelector('.sf-arrow-hang [data-sf-arrow-paint="feather"]');

  test('at the very top it is opaque; a scroll turns it transparent, and a scroll back to the top restores it', () => {
    setScrollY(0);
    const { container } = render(<App />);
    const feather = featherOf(container);
    const hang = container.querySelector('.sf-arrow-hang [data-sf-arrow-paint="hang"]');
    expect(feather.style.opacity).toBe('1');
    expect(feather.style.transition).toBe('opacity 120ms ease-out');
    expect([feather.getAttribute('aria-hidden'), feather.style.pointerEvents]).toEqual(['true', 'none']);
    for (const [y, want] of [[1, '0'], [400, '0'], [0.5, '1'], [0, '1'], [2, '0']]) {
      setScrollY(y);
      act(() => { window.dispatchEvent(new Event('scroll')); });
      expect(featherOf(container).style.opacity, `scrollY ${y}`).toBe(want);
      // The hang layer, which draws the barb, never fades.
      expect(hang.style.opacity, `scrollY ${y}: the barb`).toBe('');
    }
  });

  test('a page that loads already scrolled renders the feather transparent on its first render', () => {
    setScrollY(640);
    const html = renderToStaticMarkup(
      <ArrowHeader view="terms" onNavClick={() => {}} onHome={() => {}} account={{ isAnon: true, onSignIn: () => {} }} />,
    );
    // Server rendering has no window scroll: the server snapshot is the top of the page.
    expect(html).toMatch(/data-sf-arrow-paint="feather" style="[^"]*opacity:1/);
    const seen = [];
    function Probe() {
      useLayoutEffect(() => {
        seen.push(document.querySelector('[data-sf-arrow-paint="feather"]').style.opacity);
      }, []);
      return null;
    }
    render(<><ArrowHeader view="terms" onNavClick={() => {}} onHome={() => {}} account={{ isAnon: true, onSignIn: () => {} }} /><Probe /></>);
    expect(seen, 'the first commit already carries the scrolled state').toEqual(['0']);
  });

  test('the listener is passive and leaves with the header', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const view = render(<ArrowHeader view="terms" onNavClick={() => {}} onHome={() => {}} account={{ isAnon: true, onSignIn: () => {} }} />);
    const scrolls = add.mock.calls.filter(([type]) => type === 'scroll');
    expect(scrolls).toHaveLength(1);
    expect(scrolls[0][2]).toEqual({ passive: true });
    view.unmount();
    expect(remove.mock.calls.filter(([type, fn]) => type === 'scroll' && fn === scrolls[0][1])).toHaveLength(1);
  });
});

describe('(i) the first frame', () => {
  test('a scrollbar that appears once the header is in the page is re-laid before the task ends (before any paint)', async () => {
    // No app content yet, so no vertical scrollbar: 1920. Once the header exists the page
    // overflows: 1903. Everything React does before the task ends (the commit, its layout
    // effects and the updates they schedule) lands before the browser may paint; a microtask
    // queued from the commit runs after all of that and before any later task.
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      get: () => (document.querySelector('[data-sf-arrow-header]') ? 1903 : 1920),
    });
    const previous = globalThis.IS_REACT_ACT_ENVIRONMENT;
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    let resolve;
    const endOfTask = new Promise((r) => { resolve = r; });
    function Probe() {
      useLayoutEffect(() => {
        queueMicrotask(() => resolve(document.querySelector('[data-sf-arrow-paint="band"]').style.width));
      }, []);
      return null;
    }
    try {
      root.render(<><ArrowHeader view="terms" onNavClick={() => {}} onHome={() => {}} account={{ isAnon: true, onSignIn: () => {} }} /><Probe /></>);
      expect(await endOfTask).toBe('1903px');
    } finally {
      root.unmount();
      host.remove();
      globalThis.IS_REACT_ACT_ENVIRONMENT = previous;
    }
  });
});

/** '#rrggbb' to the rgb() spelling jsdom normalises colours to. */
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}
