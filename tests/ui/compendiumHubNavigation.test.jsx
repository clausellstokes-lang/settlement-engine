/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumHubNavigation.test.jsx — the Compendium's pages wired to the
 * router (the owner, 2026-11-10: "Then when one clicks on it they are taken to a
 * different page. There is always a back button and clicking the compendium tab when
 * not on the main compendium page brings you back to the main compendium page.").
 *
 * The host below is AppViews' compendium line in miniature: the route's params feed
 * the panel. H3 — the top nav's Compendium click is `navigate('compendium')` (App's
 * handleNavClick → setView, which IS navigate); from any sub-page it lands on the
 * landing. H5 — the old ?tab= / ?mode=custom / #anchor addresses are REPLACED by their
 * section pages; the global search and the A–Z index open section pages (pushed).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const storeState = {
  getCustomContentCount: () => 0,
  customContent: { institutions: [], services: [], resources: [], stressors: [], tradeGoods: [], deities: [], factions: [], supplyChains: [] },
  addCustomItem: vi.fn(), updateCustomItem: vi.fn(), deleteCustomItem: vi.fn(),
  canUseCustomContent: () => true,
  auth: { tier: 'premium' },
  customContentLoading: false, customContentError: null,
  loadCustomContentFromCloud: vi.fn(),
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const here = () => window.location.pathname + window.location.search + window.location.hash;

afterEach(() => { cleanup(); window.history.replaceState(null, '', '/'); });

async function mountHost(path) {
  window.history.replaceState(null, '', path);
  const { useRoute } = await import('../../src/hooks/useRoute.js');
  const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
  function Host() {
    const { view, params } = useRoute();
    return view === 'compendium' ? <CompendiumPanel standalone routeEntry={params.entry} routeSection={params.section} /> : null;
  }
  return render(<Host />);
}
const grid = (c) => c.querySelector('nav[aria-label="Compendium sections"]');
const backButton = (c) => [...c.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Back');

describe('H2 — a box opens its section page, pushed; Back returns', () => {
  it('clicking the Institutions box pushes /compendium/institutions, and Back pushes /compendium', async () => {
    const { container } = await mountHost('/compendium');
    const box = [...grid(container).querySelectorAll('a')].find((a) => a.getAttribute('href') === '/compendium/institutions');
    const before = window.history.length;
    await act(async () => { fireEvent.click(box); });
    expect(here()).toBe('/compendium/institutions');
    expect(window.history.length).toBe(before + 1);
    expect(grid(container)).toBeNull();
    expect(container.querySelector('h1').textContent).toBe('Institutions');
    await act(async () => { fireEvent.click(backButton(container)); });
    expect(here()).toBe('/compendium');
    expect(grid(container)).not.toBeNull();
  });
});

describe('H3 — the top nav’s Compendium from a sub-page lands on the landing', () => {
  it('App’s nav click is navigate(): the source says so', () => {
    const app = readFileSync(join(ROOT, 'src/App.jsx'), 'utf8');
    expect(app).toMatch(/const setView = navigate;/);
    expect(app).toMatch(/const handleNavClick = \(id\) => \{[\s\S]*?setView\(id\);/);
  });

  for (const sub of ['/compendium/institutions', '/compendium/custom', '/compendium/tier-thorp']) {
    it(`from ${sub}`, async () => {
      const { navigate } = await import('../../src/hooks/useRoute.js');
      const { container } = await mountHost(sub);
      expect(backButton(container), `${sub} has Back`).toBeTruthy();
      expect(grid(container)).toBeNull();
      await act(async () => { navigate('compendium'); });
      expect(here()).toBe('/compendium');
      expect(grid(container)).not.toBeNull();
      expect(backButton(container)).toBeUndefined();
    });
  }
});

describe('H5 — old links are replaced by their section pages', () => {
  const CASES = [
    ['/compendium?tab=institutions', '/compendium/institutions'],
    ['/compendium?tab=power', '/compendium/powers'],
    ['/compendium?tab=arcane#magic', '/compendium/magic-and-religion#magic'],
    ['/compendium?tab=operations', '/compendium/operations'],
    ['/compendium?tab=az#az', '/compendium/a-z#az'],
    ['/compendium?tab=overview', '/compendium'],
    ['/compendium?mode=custom', '/compendium/custom'],
    ['/compendium?mode=custom&cat=deities', '/compendium/custom?cat=deities'],
    ['/compendium?cat=factions', '/compendium/custom?cat=factions'],
    ['/compendium#trade-routes', '/compendium/tiers#trade-routes'],
    ['/compendium#magic', '/compendium/magic-and-religion#magic'],
    ['/compendium#institutions', '/compendium/institutions#institutions'],
  ];
  for (const [from, to] of CASES) {
    it(`${from} → ${to} (history replaced)`, async () => {
      const before = window.history.length;
      await mountHost(from);
      await act(async () => {});
      expect(here()).toBe(to);
      expect(window.history.length).toBe(before);
    });
  }

  it('the landing and an unknown anchor are left alone', async () => {
    await mountHost('/compendium#nowhere');
    await act(async () => {});
    expect(here()).toBe('/compendium#nowhere');
  });

  it('a global-search result opens its section page (pushed) with its anchor', async () => {
    const { container } = await mountHost('/compendium');
    const input = container.querySelector('input[role="combobox"]');
    await act(async () => { fireEvent.change(input, { target: { value: 'theocracy' } }); });
    const option = container.querySelector('[role="option"] button');
    expect(option, 'a result for "theocracy"').toBeTruthy();
    const before = window.history.length;
    await act(async () => { fireEvent.click(option); });
    expect(window.location.pathname).toBe('/compendium/powers');
    expect(window.history.length).toBe(before + 1);
    expect(grid(container)).toBeNull();
  });

  it('every A–Z link is a section-page address', async () => {
    const { container } = await mountHost('/compendium/a-z');
    const hrefs = [...container.querySelectorAll('#az a')].map((a) => a.getAttribute('href'));
    expect(hrefs.length).toBeGreaterThan(100);
    for (const h of hrefs) expect(h).toMatch(/^\/compendium\/(tiers|powers|operations|living-world|neighbours|calamity)(#[a-z0-9-]+)?$/);
  });
});
