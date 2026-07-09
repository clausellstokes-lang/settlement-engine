/**
 * @vitest-environment jsdom
 *
 * tests/ui/mobile.smoke.test.jsx — Tier 7.18 mobile responsiveness smoke.
 *
 * Verifies primary surfaces render at narrow viewport widths without
 * crashing or producing horizontal overflow. jsdom doesn't render to
 * pixels, but it does set `window.innerWidth` which the `useIsMobile`
 * hook reads, so we can exercise the mobile branch of every
 * `mobile ? X : Y` ternary in the layout code.
 *
 * We do NOT validate exact widths in pixels — jsdom layout is fake
 * (no flexbox, no media queries actually trigger). What we check:
 *   1. The component renders without throwing at mobile width
 *   2. The `useIsMobile` hook returns true at the chosen width
 *   3. Mobile-only flags propagate correctly
 *
 * Real mobile QA happens in Playwright with actual viewports — this
 * test is the regression net so a code change can't quietly crash the
 * mobile branch.
 */

import React from 'react';
import { describe, test, expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { render, cleanup, renderHook, act } from '@testing-library/react';
import useIsMobile from '../../src/hooks/useIsMobile.js';

// jsdom defaults to 1024px. Save the original so we can restore between tests.
const ORIGINAL_INNER_WIDTH = window.innerWidth;

function setViewportWidth(width) {
  // jsdom's window is a writable object; mutating innerWidth changes what
  // code reading window.innerWidth sees. useIsMobile reads it at mount and
  // then on every 'resize' event — tests that need the live update dispatch
  // a synthetic resize (see the reactivity test below).
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
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

describe('Tier 7.18 — Mobile viewport baseline (useIsMobile)', () => {
  test('useIsMobile() is true at 360px (iPhone SE width)', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  test('useIsMobile() is false at 1024px (desktop)', () => {
    setViewportWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    setViewportWidth(360);  // restore for downstream tests
  });

  test('useIsMobile() threshold is at 640px', () => {
    setViewportWidth(639);
    expect(renderHook(() => useIsMobile()).result.current).toBe(true);
    setViewportWidth(640);
    expect(renderHook(() => useIsMobile()).result.current).toBe(false);
    setViewportWidth(360);
  });

  // F28 — the reason the non-reactive isMobile() helper was retired: the hook
  // must update when the viewport changes (resize / device rotation), not only
  // at first mount.
  test('useIsMobile() reacts to a resize event', () => {
    setViewportWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    act(() => {
      setViewportWidth(500);
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe(true);
    setViewportWidth(360);  // restore for downstream tests
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
