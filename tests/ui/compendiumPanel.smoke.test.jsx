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
 * search bar pulls Funnel/EVENTS). Default mode is the built-in catalog on the
 * Overview dashboard, whose stable artifact-rendered copy we assert on.
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

    // Default mode is the built-in catalog on the Overview dashboard (DOC WAVE 2/2).
    // Pinning its stable, artifact-rendered copy means a broken extraction (e.g.
    // CompendiumDashboard/CatalogHubs → primitives/artifact import) surfaces here.
    expect(
      screen.getByText(/rendered by the deterministic engine from its own registries/),
    ).toBeTruthy();
  });

  test('mounts in standalone mode without throwing', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);

    expect(container.firstChild).not.toBeNull();
    expect(
      screen.getByText(/rendered by the deterministic engine from its own registries/),
    ).toBeTruthy();
  });

  // RESTORATION #9 pinned the standalone-page identity (Page frame + PageHeader) and
  // the WAI-ARIA tab wiring. The owner's word of 2026-11-10 ("Rather than a horizontal
  // scroll, I would like that the first page of compendium lists in boxes that are
  // flush to each other … when one clicks on it they are taken to a different page")
  // retired the tab row: the landing is now a nav landmark of twelve links, one per
  // section page, and no tablist is left. The PageHeader identity pin stands.
  test('standalone carries the PageHeader identity and the landing grid of section links', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    render(<CompendiumPanel standalone />);

    expect(screen.getByRole('heading', { level: 1, name: 'Compendium' })).toBeTruthy();

    const nav = screen.getByRole('navigation', { name: 'Compendium sections' });
    const links = [...nav.querySelectorAll('li > a')];
    expect(links).toHaveLength(12);
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/compendium/tiers', '/compendium/economy', '/compendium/powers', '/compendium/institutions',
      '/compendium/operations', '/compendium/magic-and-religion', '/compendium/living-world', '/compendium/stress',
      '/compendium/calamity', '/compendium/neighbours', '/compendium/a-z', '/compendium/custom',
    ]);
    // The twelfth box is My Custom Content (ruling H4); the mode toggle is gone.
    expect(links[11].textContent).toContain('My Custom Content');
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.queryByRole('button', { name: /Built-in Catalog/ })).toBeNull();
    // No Back on the landing.
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  test('a section page leads with Back, its title and its own search', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone routeSection="institutions" />);
    const back = screen.getByRole('button', { name: 'Back' });
    expect(screen.getByRole('heading', { level: 1, name: 'Institutions' })).toBeTruthy();
    expect(screen.getByLabelText('Search catalog')).toBeTruthy();
    // Back comes first: before the heading in document order.
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(back.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // The landing's grid is not on a section page.
    expect(container.querySelector('nav[aria-label="Compendium sections"]')).toBeNull();
    // Back returns to the landing (pushed).
    window.history.replaceState(null, '', '/compendium/institutions');
    const before = window.history.length;
    back.click();
    expect(window.location.pathname).toBe('/compendium');
    expect(window.history.length).toBe(before + 1);
    window.history.replaceState(null, '', '/');
  });

  test('an entry page also leads with Back', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    render(<CompendiumPanel standalone routeEntry="tier-thorp" />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: 'Tiers & Routes' })).toBeTruthy();
  });
});
