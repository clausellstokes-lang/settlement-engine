/**
 * @vitest-environment jsdom
 *
 * tests/ui/settlementsPanel.smoke.test.jsx — Decomposition lock-in.
 *
 * SettlementsPanel.jsx was decomposed (its in-file SettlementCard,
 * CampaignFolder, SampleCard, SampleDashboard sub-components and the
 * module-scope helpers moved into src/components/settlements/*). This is
 * a behavior-preserving move, so the regression net is simply: the panel
 * still mounts and renders without throwing, wiring the extracted imports
 * together correctly. If a relative-path/import got broken in the split,
 * the dynamic import or the render below throws and this test fails.
 *
 * We mock the store (the panel reads ~35 selectors + useStore.subscribe)
 * and the saves service (an effect calls savesService.list() on mount).
 * With zero saves the panel takes the empty-state branch and renders the
 * SampleDashboard, so we assert its stable copy is present.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);

// The mount effect calls savesService.list(); return zero saves so the
// panel renders its empty-state (SampleDashboard) deterministically.
vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    list: vi.fn(() => Promise.resolve([])),
    mutateBatch: vi.fn(() => Promise.resolve()),
    save: vi.fn(() => Promise.resolve()),
    reactivateFreeSettlement: vi.fn(() => Promise.resolve({ ok: true })),
  },
}));

// Analytics is fire-and-forget; stub it so the mount path stays quiet and
// doesn't pull Supabase/network wiring into the test.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  // useFunnelEvent (LIBRARY_VIEWED) fires Funnel.track after saves load.
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Store mock. A mutable singleton drives every selector; useStore.subscribe
// returns a no-op unsubscribe (the panel registers a savedSettlements
// watcher in an effect).
const storeState = {
  // generator + load wiring
  updateConfig: vi.fn(),
  setInstitutionToggles: vi.fn(),
  setCategoryToggles: vi.fn(),
  setGoodsToggles: vi.fn(),
  setServiceToggles: vi.fn(),
  setSettlement: vi.fn(),
  setLoadedFromSave: vi.fn(),
  clearLoadedFromSave: vi.fn(),
  generateSettlement: vi.fn(),
  setPurchaseModalOpen: vi.fn(),
  applyCosmeticRename: vi.fn(),
  setSavedSettlements: vi.fn(),
  // auth / gating (signed-out defaults, matching the real store)
  maxSaves: () => 0,
  canSave: () => false,
  isElevated: () => false,
  auth: { tier: 'anon', user: null },
  // library state
  savedSettlements: [],
  selectedSettlementId: null,
  clearSelectedSettlementId: vi.fn(),
  // campaign slice
  campaigns: [],
  createCampaign: vi.fn(),
  renameCampaign: vi.fn(),
  deleteCampaign: vi.fn(),
  toggleCampaignCollapsed: vi.fn(),
  addToCampaign: vi.fn(),
  removeFromCampaign: vi.fn(),
  discoverCampaignRegionalChannels: vi.fn(),
  setRegionalChannelStatus: vi.fn(),
  applyQueuedRegionalImpact: vi.fn(),
  ignoreQueuedRegionalImpact: vi.fn(),
  resolveRegionalImpact: vi.fn(),
  advanceCampaignRegionalImpacts: vi.fn(),
  applyAllQueuedRegionalImpacts: vi.fn(),
  ignoreAllQueuedRegionalImpacts: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

describe('SettlementsPanel — decomposition smoke', () => {
  test('mounts without throwing and renders the empty-state dashboard', async () => {
    const SettlementsPanel = (await import('../../src/components/SettlementsPanel.jsx')).default;
    const { container } = render(<SettlementsPanel onNavigate={() => {}} />);

    // Mount succeeded — the DOM exists and the panel produced output.
    expect(document.body).toBeTruthy();
    expect(container.firstChild).not.toBeNull();

    // savesService.list() is async: the panel first shows "Loading saves..."
    // then, once it resolves to [], swaps to the SampleDashboard empty-state.
    // findByText polls so we assert on the settled UI. Pinning the dashboard's
    // stable heading means a broken extraction (e.g. SampleDashboard →
    // SampleCard import) would surface here.
    expect(await screen.findByText(/Start from a sample\. Or roll your own/)).toBeTruthy();
  });
});
