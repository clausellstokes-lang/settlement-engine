/**
 * @vitest-environment jsdom
 *
 * settlementsPanelLibraryLoad.test.jsx — correctness-3 regression pins.
 *
 *   1. FAIL-VISIBLE: a savesService.list() rejection routes into the shared
 *      trust-surface alert (role="alert") — a failed library load must never be
 *      indistinguishable from an empty library.
 *   2. OWNER-KEYED CANCEL LATCH: a load that resolves AFTER an account switch is
 *      discarded, so the previous owner's saves never paint over the new owner's.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    list: vi.fn(() => Promise.resolve([])),
    mutateBatch: vi.fn(() => Promise.resolve()),
    save: vi.fn(() => Promise.resolve()),
    reactivateFreeSettlement: vi.fn(() => Promise.resolve({ ok: true })),
  },
}));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

let storeState;
function baseStore(user = null) {
  return {
    updateConfig: vi.fn(), setInstitutionToggles: vi.fn(), setCategoryToggles: vi.fn(),
    setGoodsToggles: vi.fn(), setServiceToggles: vi.fn(), setSettlement: vi.fn(),
    setLoadedFromSave: vi.fn(), clearLoadedFromSave: vi.fn(), generateSettlement: vi.fn(),
    setPurchaseModalOpen: vi.fn(), applyCosmeticRename: vi.fn(), setSavedSettlements: vi.fn(),
    maxSaves: () => 0, canSave: () => false, isElevated: () => false,
    auth: { tier: 'free', user },
    savedSettlements: [], selectedSettlementId: null, clearSelectedSettlementId: vi.fn(),
    campaigns: [], createCampaign: vi.fn(), renameCampaign: vi.fn(), deleteCampaign: vi.fn(),
    toggleCampaignCollapsed: vi.fn(), addToCampaign: vi.fn(), removeFromCampaign: vi.fn(),
    discoverCampaignRegionalChannels: vi.fn(), setRegionalChannelStatus: vi.fn(),
    applyQueuedRegionalImpact: vi.fn(), ignoreQueuedRegionalImpact: vi.fn(),
    resolveRegionalImpact: vi.fn(), advanceCampaignRegionalImpacts: vi.fn(),
    applyAllQueuedRegionalImpacts: vi.fn(), ignoreAllQueuedRegionalImpacts: vi.fn(),
  };
}

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

const { saves } = await import('../../src/lib/saves.js');
const SettlementsPanel = (await import('../../src/components/SettlementsPanel.jsx')).default;

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('SettlementsPanel library load — correctness-3', () => {
  test('a list() failure surfaces a visible error, not a silent empty library', async () => {
    storeState = baseStore({ id: 'owner-A' });
    saves.list.mockRejectedValueOnce(new Error('offline'));
    render(<SettlementsPanel onNavigate={() => {}} />);
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/could not be loaded/i);
  });

  test('CONTROL: with no owner switch, the loaded saves ARE applied', async () => {
    storeState = baseStore({ id: 'owner-A' });
    const rows = [{ id: 'save-A', name: 'Aldermoor', settlement: { name: 'Aldermoor' } }];
    saves.list.mockResolvedValueOnce(rows);
    render(<SettlementsPanel onNavigate={() => {}} />);
    await waitFor(() => expect(storeState.setSavedSettlements).toHaveBeenCalledWith(rows));
  });

  test('LATCH: a load resolving after an account switch is discarded (no stale paint)', async () => {
    storeState = baseStore({ id: 'owner-A' });
    let resolveList;
    saves.list.mockImplementationOnce(() => new Promise((r) => { resolveList = r; }));
    const staleRows = [{ id: 'save-A', name: 'Aldermoor', settlement: { name: 'Aldermoor' } }];

    const { rerender } = render(<SettlementsPanel onNavigate={() => {}} />);
    // The account switches while owner-A's list() is still in flight. Mutate the
    // user IN PLACE so the store action refs stay stable (as in the real store),
    // exercising the ownerIdRef latch rather than an effect re-run.
    storeState.auth = { tier: 'free', user: { id: 'owner-B' } };
    rerender(<SettlementsPanel onNavigate={() => {}} />);
    // owner-A's request now resolves — with owner-A's library.
    resolveList(staleRows);
    await new Promise((r) => setTimeout(r, 0));

    // The stale library must NOT be painted for owner-B.
    expect(storeState.setSavedSettlements).not.toHaveBeenCalledWith(staleRows);
  });
});
