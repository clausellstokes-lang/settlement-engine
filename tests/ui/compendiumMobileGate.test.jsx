/** @vitest-environment jsdom */
/**
 * compendiumMobileGate.test.jsx — the MOBILE pass for the Compendium surface
 * (Phase 5c).
 *
 * Contract under test (mobile = read + light-act; heavy authoring defers to
 * desktop per the locked read-mostly matrix):
 *
 *   1. The built-in reference catalog stays fully readable on mobile (the 'tiers'
 *      tab prose renders), and the 8-tab strip swaps to the MobileTabStrip
 *      primitive (no-clip, edge-fade, WAI-ARIA) rather than the clipping inline
 *      strip. The tab/panel aria wiring still resolves (idPrefix="compendium").
 *   2. On mobile, the "My custom content" authoring manager is deferred behind a
 *      DesktopOnlyGate (no CustomContentManager mounts); the search box stays
 *      live and a read-only list of any existing items is the read affordance.
 *   3. DESKTOP is unchanged: the inline catalog tab strip renders, no
 *      MobileTabStrip, and switching to custom mode mounts the full
 *      CustomContentManager with no desktop gate.
 *
 * jsdom has no matchMedia, so we install a controllable fake (mobile vs desktop)
 * and reset module state per case so the per-breakpoint useIsMobile store does
 * not leak across renders.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

// Analytics is fire-and-forget; stub so the mount path stays quiet (the global
// search bar imports Funnel + EVENTS).
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Store mock — a premium signed-in user so the custom-content branch would take
// the FULL authoring manager path on desktop (proving the mobile gate is what
// defers it, not the premium gate).
const storeState = {
  getCustomContentCount: () => 0,
  customContent: {},
  addCustomItem: vi.fn(),
  updateCustomItem: vi.fn(),
  deleteCustomItem: vi.fn(),
  canUseCustomContent: () => true,
  customContentLoading: false,
  customContentError: null,
  loadCustomContentFromCloud: vi.fn(),
  setPurchaseModalOpen: vi.fn(),
  auth: { tier: 'premium', user: { id: 'u1' } },
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

function installMatchMedia(matches) {
  window.matchMedia = vi.fn((query) => ({
    media: query,
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }));
}

async function loadPanel() {
  vi.resetModules();
  return (await import('../../src/components/CompendiumPanel.jsx')).default;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('CompendiumPanel — mobile reflow + authoring gate', () => {
  test('mobile: catalog reads, tab strip swaps to MobileTabStrip', async () => {
    installMatchMedia(true);
    const CompendiumPanel = await loadPanel();
    render(<CompendiumPanel />);

    // The reference catalog stays fully readable (default 'tiers' tab prose).
    expect(screen.getByText(/Tier determines the maximum institution count/)).toBeTruthy();

    // MobileTabStrip is in play: every tab still resolves by its compendium id
    // (idPrefix="compendium" keeps the aria wiring), and exactly one tablist
    // exists — the mobile strip, not the inline one.
    expect(document.getElementById('compendium-tab-tiers')).toBeTruthy();
    expect(document.getElementById('compendium-tab-economy')).toBeTruthy();
    expect(screen.getAllByRole('tablist')).toHaveLength(1);
  });

  test('mobile: custom-content authoring defers behind a desktop gate', async () => {
    installMatchMedia(true);
    const CompendiumPanel = await loadPanel();
    render(<CompendiumPanel />);

    // Switch to the "My custom content" mode via the Segmented toggle.
    fireEvent.click(screen.getByRole('button', { name: /My custom content/i }));

    // The heavy authoring manager does NOT mount on mobile.
    expect(screen.queryByTestId('custom-content-manager')).toBeNull();
    // A calm desktop gate stands in its place.
    expect(screen.getAllByText(/desktop/i).length).toBeGreaterThan(0);
    // The read affordance — search — stays live on mobile.
    expect(screen.getByLabelText('Search custom content')).toBeTruthy();
  });

  test('desktop: inline tab strip + full authoring manager, no gate', async () => {
    installMatchMedia(false);
    const CompendiumPanel = await loadPanel();
    render(<CompendiumPanel />);

    // Catalog reads, and the inline strip renders every tab as a role=tab button
    // inside the single tablist (8 sections).
    expect(screen.getByText(/Tier determines the maximum institution count/)).toBeTruthy();
    expect(screen.getAllByRole('tab')).toHaveLength(8);

    // Custom mode mounts the FULL manager (premium user) with no desktop gate.
    fireEvent.click(screen.getByRole('button', { name: /My custom content/i }));
    expect(screen.getByTestId('custom-content-manager')).toBeTruthy();
    expect(screen.queryByText(/best on a larger screen/i)).toBeNull();
    expect(screen.queryByText(/Author custom content on desktop/i)).toBeNull();
  });
});
