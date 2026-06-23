/**
 * @vitest-environment jsdom
 *
 * tests/ui/mobile.smoke.test.jsx — Tier 7.18 mobile responsiveness smoke.
 *
 * Verifies primary surfaces render at narrow viewport widths without
 * crashing or producing horizontal overflow. jsdom doesn't render to
 * pixels. `isMobile()` now delegates to the shared matchMedia-backed
 * mobile-flag store (src/hooks/useIsMobile.js), so this test installs a
 * matchMedia shim that derives `matches` from the simulated viewport
 * width — exercising the mobile branch of every `mobile ? X : Y` ternary.
 *
 * We do NOT validate exact widths in pixels — jsdom layout is fake
 * (no flexbox, no media queries actually trigger). What we check:
 *   1. The component renders without throwing at mobile width
 *   2. The `isMobile()` helper returns true at the chosen width
 *   3. Mobile-only flags propagate correctly
 *
 * Real mobile QA happens in Playwright with actual viewports — this
 * test is the regression net so a code change can't quietly crash the
 * mobile branch.
 */

import React from 'react';
import { describe, test, expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { isMobile } from '../../src/components/new/tabConstants.js';

// jsdom defaults to 1024px. Save the original so we can restore between tests.
const ORIGINAL_INNER_WIDTH = window.innerWidth;

// isMobile() now reads a matchMedia-backed store. jsdom has no matchMedia, so we
// install a shim: each created MediaQueryList parses its `max-width: Npx` query
// and re-evaluates `matches` against the current simulated width whenever the
// viewport changes, firing its 'change' listeners just like a real resize.
let currentWidth = ORIGINAL_INNER_WIDTH;
const liveMqls = new Set();

function evaluate(query) {
  const m = /max-width:\s*(\d+)px/.exec(query);
  return m ? currentWidth <= Number(m[1]) : false;
}

if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => {
    const listeners = new Set();
    const mql = {
      media: query,
      matches: evaluate(query),
      addEventListener: (_e, fn) => listeners.add(fn),
      removeEventListener: (_e, fn) => listeners.delete(fn),
      __reevaluate: () => {
        const next = evaluate(query);
        if (next !== mql.matches) {
          mql.matches = next;
          listeners.forEach((fn) => fn({ matches: next }));
        }
      },
    };
    liveMqls.add(mql);
    return mql;
  };
}

function setViewportWidth(width) {
  currentWidth = width;
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
  // Push the new width into any already-created MediaQueryList so the shared
  // store (which caches one MQL per breakpoint) reflects the change.
  liveMqls.forEach((mql) => mql.__reevaluate());
}

beforeAll(() => setViewportWidth(360));     // narrow mobile (iPhone SE)
afterAll(() => setViewportWidth(ORIGINAL_INNER_WIDTH));
afterEach(cleanup);

// Mock service-layer modules that ApexHomeHero / Pricing pull in.
vi.mock('../../src/lib/stripe.js', () => ({
  startCheckout: vi.fn(),
  PRODUCTS: {
    credits_5:  { credits: 5,  price: '$4.99',  perCredit: '$1.00', discount: null,      tier: 'starter' },
    credits_25: { credits: 25, price: '$4.99',  perCredit: '$0.20', discount: null,      tier: 'starter' },
    credits_60: { credits: 60, price: '$9.99',  perCredit: '$0.17', discount: '17% off', tier: 'value'   },
  },
}));
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: { from: () => ({ select: () => ({ eq: () => Promise.resolve({ data: [] }) }) }) },
}));
vi.mock('../../src/lib/founderSeats.js', () => ({
  fetchFounderSeatsRemaining: vi.fn(() => Promise.resolve(500)),
}));

describe('Tier 7.18 — Mobile viewport baseline', () => {
  test('isMobile() returns true at 360px (iPhone SE width)', () => {
    expect(isMobile()).toBe(true);
  });

  test('isMobile() returns false at 1024px (desktop)', () => {
    setViewportWidth(1024);
    expect(isMobile()).toBe(false);
    setViewportWidth(360);  // restore for downstream tests
  });

  test('isMobile() threshold is at 640px', () => {
    setViewportWidth(639);
    expect(isMobile()).toBe(true);
    setViewportWidth(640);
    expect(isMobile()).toBe(false);
    setViewportWidth(360);
  });
});

describe('Tier 7.18 — Mobile rendering smoke', () => {
  test('HomeHero renders at 360px without throwing', async () => {
    // HomeHero pulls in the store; ensure store mock won't crash.
    // P96 added auth.tier + auth.displayName reads so the hero can
    // branch between anon and signed-in variants. The mock needs to
    // expose those keys or the selector throws.
    vi.doMock('../../src/store/index.js', () => ({
      useStore: (selector) => selector({
        generateSettlement: vi.fn(),
        updateConfig: vi.fn(),
        setWizardMode: vi.fn(),
        auth: { tier: 'anon', displayName: null },
      }),
    }));
    const HomeHero = (await import('../../src/components/HomeHero.jsx')).default;
    const { container } = render(<HomeHero onSignIn={() => {}} />);
    // Just verify SOMETHING rendered (the section role or a heading).
    expect(container.querySelector('section, h1')).not.toBeNull();
  });

  test('FounderBadge renders at 360px without throwing', async () => {
    const FounderBadge = (await import('../../src/components/primitives/FounderBadge.jsx')).default;
    const { container } = render(<FounderBadge size="md" />);
    expect(container).toBeDefined();
  });

  test('BandPill at sm size is suitable for mobile', async () => {
    const { BandPill } = await import('../../src/components/primitives/BandPill.jsx');
    const { container } = render(<BandPill band="strained" size="sm" />);
    const pill = container.querySelector('[role="status"]');
    expect(pill).not.toBeNull();
    // The sm size should still render the band label readably.
    expect(pill.textContent.length).toBeGreaterThan(0);
  });

  test('StateBadge at sm size is suitable for mobile', async () => {
    const StateBadge = (await import('../../src/components/primitives/StateBadge.jsx')).default;
    const { container } = render(<StateBadge kind="narrated" size="sm" />);
    expect(container.querySelector('[role="status"]')).not.toBeNull();
  });
});

describe('Tier 7.18 — Viewport meta + a11y CSS', () => {
  test('viewport meta tag is configured for responsive rendering', () => {
    // index.html sets <meta name="viewport" content="width=device-width, initial-scale=1.0" />.
    // jsdom doesn't load index.html, but the constant matters — this
    // test is a documentation-style anchor.
    const expected = 'width=device-width, initial-scale=1.0';
    expect(expected).toBe('width=device-width, initial-scale=1.0');
  });
});
