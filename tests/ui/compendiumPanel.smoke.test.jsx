/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumPanel.smoke.test.jsx — Decomposition lock-in.
 *
 * CompendiumPanel.jsx was decomposed (its in-file Tag/Row/Card primitives, the
 * catalog tab components TiersTab/EconomyTab/PowerTab_/ArcaneTab/StressTab/
 * NeighbourTab/InstitutionsTab, and the custom-content cluster
 * CustomItemAttributes/CustomContentUpsell/ReadOnlyCustomContentList/
 * DependencySummary/DependenciesSection/CustomContentManager moved into
 * src/components/compendium/{primitives,CatalogTabs,CustomContent}.jsx). This is
 * a behavior-preserving move, so the regression net is simply: the panel still
 * mounts and renders without throwing, wiring the extracted imports together
 * correctly. A broken relative-path/import in the split would throw on the
 * dynamic import or the render below and fail this test.
 *
 * We mock the store (the panel reads getCustomContentCount() on mount, plus the
 * custom-content selectors in the custom-mode branch) and analytics (the global
 * search bar pulls Funnel/EVENTS). Default mode is the built-in catalog with the
 * 'tiers' tab, whose stable copy we assert on.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);

// Analytics is fire-and-forget; stub it so the mount path stays quiet and
// doesn't pull Supabase/network wiring into the test (CompendiumGlobalSearch
// imports Funnel + EVENTS).
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Store mock. A mutable singleton drives every selector; useStore.subscribe
// returns a no-op unsubscribe. Defaults mirror a signed-out / free user so the
// custom-content branch would take the upsell path if exercised.
const storeState = {
  // catalog-mode selector
  getCustomContentCount: () => 0,
  // custom-content manager selectors (custom mode)
  customContent: {},
  addCustomItem: vi.fn(),
  updateCustomItem: vi.fn(),
  deleteCustomItem: vi.fn(),
  canUseCustomContent: () => false,
  customContentLoading: false,
  customContentError: null,
  setPurchaseModalOpen: vi.fn(),
  auth: { tier: 'anon', user: null },
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

describe('CompendiumPanel — decomposition smoke', () => {
  test('mounts without throwing and renders the built-in catalog', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel />);

    // Mount succeeded — the DOM exists and the panel produced output.
    expect(document.body).toBeTruthy();
    expect(container.firstChild).not.toBeNull();

    // Default mode is the built-in catalog on the 'tiers' tab. Pinning the
    // TiersTab's stable copy means a broken extraction (e.g. CatalogTabs →
    // primitives import) would surface here.
    expect(
      screen.getByText(/Tier determines the maximum institution count/),
    ).toBeTruthy();
  });

  test('mounts in standalone mode without throwing', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);

    expect(container.firstChild).not.toBeNull();
    expect(
      screen.getByText(/Tier determines the maximum institution count/),
    ).toBeTruthy();
  });
});
