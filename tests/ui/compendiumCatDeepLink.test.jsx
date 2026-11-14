/**
 * @vitest-environment jsdom
 *
 * compendiumCatDeepLink.test.jsx — the ?cat= custom-bucket deep-link.
 *
 * A ?cat=<bucket> query opens the Compendium's custom-content workspace focused
 * on that authoring bucket (completing the ?mode=custom deep-link flow). An
 * invalid bucket is ignored and the panel opens on the catalog as usual.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

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

afterEach(cleanup);
beforeEach(() => { window.history.replaceState(null, '', '/compendium'); });

describe('Compendium ?cat= deep-link', () => {
  it('opens the custom workspace on the named bucket', async () => {
    // My Custom Content is its own page since the owner's word of 2026-11-10 ("Custom
    // content itself now joins the other tabs"): /compendium/custom?cat=<bucket>.
    window.history.replaceState(null, '', '/compendium/custom?cat=factions');
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container, getByLabelText } = render(<CompendiumPanel standalone routeSection="custom" />);
    // Custom mode marker: the custom-content search input is present.
    expect(getByLabelText('Search custom content')).toBeTruthy();
    // The Factions bucket is the active (pressed) category.
    const pressed = [...container.querySelectorAll('button[aria-pressed="true"]')]
      .map((b) => b.textContent.trim());
    expect(pressed.some((t) => /Powers/.test(t))).toBe(true);
  });

  it('ignores an unknown ?cat= value and opens on the landing', async () => {
    window.history.replaceState(null, '', '/compendium?cat=not_a_bucket');
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { queryByLabelText } = render(<CompendiumPanel standalone />);
    // No custom-content search input ⇒ still on the landing.
    expect(queryByLabelText('Search custom content')).toBeNull();
  });
});
