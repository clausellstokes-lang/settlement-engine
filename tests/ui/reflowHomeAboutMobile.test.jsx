/** @vitest-environment jsdom */
/**
 * reflowHomeAboutMobile.test.jsx — the mobile pass for the Home + About
 * surfaces. Scope is keep-reflow: no feature cuts, only the mobile reflow +
 * raw-tap-target fixes.
 *
 * Contracts under test:
 *  1. HomeLanding (prop-driven isMobile) — the hero H1 steps down to FS['28']
 *     on mobile and stays FS['36'] on desktop (byte-identical), and the
 *     secondary "Sign in" CTA lifts its scrim border opacity only on mobile.
 *  2. HowToUse (reactive useIsMobile) — below 640 the 8-tab guide strip swaps
 *     to the MobileTabStrip primitive (a role="tablist" whose tab buttons clear
 *     the 44px floor and that keeps the howto-* id wiring), and ALL eight tabs
 *     still render — nothing is cut. On desktop the custom roving strip renders
 *     instead and is byte-identical (no minHeight:44 swap on the tab buttons via
 *     the primitive path).
 *
 * jsdom has no matchMedia; we install the same controllable fake the auth and
 * tap-floor suites use so the shared useIsMobile store reports our viewport.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

import HomeLanding from '../../src/components/HomeLanding.jsx';

// ── Controllable matchMedia fake (mirrors authMobileReflow.test.jsx) ──────────
function installMatchMedia(initialMatches) {
  const mqls = new Map();
  window.matchMedia = vi.fn((query) => {
    let mql = mqls.get(query);
    if (mql) return mql;
    const listeners = new Set();
    mql = {
      media: query,
      matches: initialMatches,
      addEventListener: (_evt, fn) => listeners.add(fn),
      removeEventListener: (_evt, fn) => listeners.delete(fn),
    };
    mqls.set(query, mql);
    return mql;
  });
}

async function loadHowTo() {
  vi.resetModules();
  return (await import('../../src/components/HowToUse.jsx')).default;
}

afterEach(() => {
  cleanup();
  vi.resetModules();
});

describe('HomeLanding — hero scale + scrim CTA on mobile', () => {
  const HERO = 'Your players have a thousand choices. Now you have every answer.';

  test('mobile: hero H1 steps down to 28px', () => {
    render(<HomeLanding isMobile onNavigate={() => {}} onSignIn={() => {}} />);
    const h1 = screen.getByRole('heading', { level: 1, name: HERO });
    expect(h1.style.fontSize).toBe('28px');
  });

  test('desktop: hero H1 stays at 36px (byte-identical)', () => {
    render(<HomeLanding isMobile={false} onNavigate={() => {}} onSignIn={() => {}} />);
    const h1 = screen.getByRole('heading', { level: 1, name: HERO });
    expect(h1.style.fontSize).toBe('36px');
  });

  test('mobile vs desktop: the secondary Sign in CTA lifts its scrim border only on mobile', () => {
    // The DOM normalizes rgba() whitespace, so compare with spaces stripped.
    const noWs = (s) => s.replace(/\s/g, '');
    const { unmount } = render(<HomeLanding isMobile onNavigate={() => {}} onSignIn={() => {}} />);
    const mobileBtn = screen.getByRole('button', { name: 'Sign in' });
    expect(noWs(mobileBtn.style.borderColor)).toBe('rgba(232,217,176,0.7)');
    unmount();

    render(<HomeLanding isMobile={false} onNavigate={() => {}} onSignIn={() => {}} />);
    const deskBtn = screen.getByRole('button', { name: 'Sign in' });
    expect(noWs(deskBtn.style.borderColor)).toBe('rgba(232,217,176,0.4)');
  });
});

describe('HowToUse — guide tab strip reflow on mobile', () => {
  const ALL_TABS = [
    'Quick Start', 'Power User', 'The Living World', 'Under the Hood',
    'DM Philosophy', 'Reference', 'How We Compare', 'FAQ',
  ];

  test('mobile: all eight tabs render and each tab button clears the 44px floor', async () => {
    installMatchMedia(true);
    const HowToUse = await loadHowTo();
    render(<HowToUse />);

    const tablist = screen.getByRole('tablist', { name: 'Guide sections' });
    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs).toHaveLength(ALL_TABS.length);
    // No tab is cut on mobile — the whole guide stays a read surface.
    ALL_TABS.forEach((label) => {
      expect(within(tablist).getByText(label)).toBeTruthy();
    });
    // The primitive's tab buttons clear the mobile tap floor.
    tabs.forEach((tab) => expect(tab.style.minHeight).toBe('44px'));
    // The id wiring the panel relies on is preserved (howto-tab-quick).
    expect(tablist.querySelector('#howto-tab-quick')).toBeTruthy();
  });

  test('desktop: the custom roving strip renders all eight tabs (byte-identical path)', async () => {
    installMatchMedia(false);
    const HowToUse = await loadHowTo();
    render(<HowToUse />);

    const tablist = screen.getByRole('tablist', { name: 'Guide sections' });
    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs).toHaveLength(ALL_TABS.length);
    // Desktop strip keeps the howto-tab-* ids too (shared wiring contract).
    expect(tablist.querySelector('#howto-tab-quick')).toBeTruthy();
  });
});
