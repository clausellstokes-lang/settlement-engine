/** @vitest-environment jsdom */
/**
 * tests/ui/customContentRestore.test.jsx — RESTORATION #12 pins.
 *
 * The composite dropped the authoring manager's cloud-sync banners, two-lane
 * IA, seed picker, and aria-pressed category tabs. These pin the restored
 * affordances (the deity W-C4 overhaul is left intact). Heavy child components
 * are stubbed so the pin isolates the manager's own restored chrome.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../../src/components/compendium/ContentPackBar.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/compendium/SupplyChainsManager.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/compendium/PantheonActivationStrip.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/compendium/FactionEventBanner.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/compendium/DeityEffectPreview.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/compendium/Dependencies.jsx', () => ({ DependencySummary: () => null, DependenciesSection: () => null }));
vi.mock('../../src/components/primitives/CategorySelect.jsx', () => ({ default: () => null }));

const state = {
  customContent: {},
  addCustomItem: vi.fn(),
  updateCustomItem: vi.fn(),
  deleteCustomItem: vi.fn(),
  canUseCustomContent: () => true,
  auth: { tier: 'premium', user: { id: 'u1' } },
  customContentLoading: false,
  customContentError: null,
  loadCustomContentFromCloud: vi.fn(),
  setPurchaseModalOpen: vi.fn(),
};
vi.mock('../../src/store/index.js', () => {
  function useStore(sel) { return sel(state); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => state;
  return { useStore };
});

afterEach(cleanup);
// Keep the location clean between tests — the WB-j ?cat= deep-link test sets it.
afterEach(() => { try { window.history.replaceState({}, '', '/'); } catch { /* jsdom */ } });

describe('CustomContentManager — restored affordances (RESTORATION #12)', () => {
  test('renders the two authoring lanes, aria-pressed tabs, and the seed-picker entry', async () => {
    state.customContentError = null;
    const { CustomContentManager } = await import('../../src/components/compendium/CustomContent.jsx');
    const { container } = render(<CustomContentManager search="" />);

    // Two-lane authoring IA.
    expect(container.querySelector('[data-testid="authoring-lane-settlement"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="authoring-lane-living"]')).toBeTruthy();

    // The active bucket tab is an aria-pressed toggle (a11y restore).
    expect(screen.getByRole('button', { name: /Institutions/, pressed: true })).toBeTruthy();

    // Seed-picker entry on a seedable bucket (offered in the toolbar and, when
    // the bucket is empty, in the honest empty-state — so one or more).
    expect(screen.getAllByRole('button', { name: /Start from a built-in/i }).length).toBeGreaterThanOrEqual(1);
  });

  test('a cloud-sync failure surfaces a role=alert with a one-click retry', async () => {
    state.customContentError = 'the network is down';
    const { CustomContentManager } = await import('../../src/components/compendium/CustomContent.jsx');
    render(<CustomContentManager search="" />);

    expect(screen.getByRole('alert')).toBeTruthy();
    const retry = screen.getByRole('button', { name: /retry sync/i });
    fireEvent.click(retry);
    expect(state.loadCustomContentFromCloud).toHaveBeenCalled();
    state.customContentError = null;
  });

  test('WB-j — a ?cat=traditions deep-link opens the traditions lane directly', async () => {
    state.customContentError = null;
    window.history.replaceState({}, '', '/compendium?mode=custom&cat=traditions');
    const { CustomContentManager } = await import('../../src/components/compendium/CustomContent.jsx');
    render(<CustomContentManager search="" />);
    // The traditions bucket tab is the active (aria-pressed) one — the deep-link
    // resolved to the new lane rather than defaulting to Institutions.
    expect(screen.getByRole('button', { name: /Traditions/, pressed: true })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Institutions/, pressed: false })).toBeTruthy();
  });
});
