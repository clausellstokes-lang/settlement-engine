/**
 * @vitest-environment jsdom
 *
 * settlementsPanelLibraryLoad.test.jsx — correctness-3 regression pins.
 *
 *   1. FAIL-VISIBLE: a savesService.list() rejection routes into the shared
 *      trust-surface alert (role="alert") — a failed library load must never be
 *      indistinguishable from an empty library.
 *   2. OWNER BOUNDARY: switching accounts clears the old Library, starts a fresh
 *      load, and discards the previous owner's in-flight result.
 *   3. MEMBERSHIP + SORT: numeric/string-equivalent ids join once, and campaign
 *      folders retain the selected Library sort.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent, within } from '@testing-library/react';

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
vi.mock('../../src/components/townMap/SettlementCardMapThumb.jsx', () => ({
  default: () => null,
}));
vi.mock('../../src/components/SettlementDetail.jsx', () => ({
  default: () => <div data-testid="settlement-detail" />,
}));
vi.mock('../../src/hooks/useIsMobile.js', () => ({
  default: () => false,
}));

let storeState;
function baseStore(user = null) {
  const state = {
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
    maxSaves: () => 0,
    canSave: () => false,
    isElevated: () => false,
    auth: { tier: 'free', user },
    savedSettlements: [],
    savedSettlementsLoaded: false,
    savedSettlementsOwnerId: user?.id ?? null,
    savedSettlementsHydrationGeneration: 0,
    selectedSettlementId: null,
    clearSelectedSettlementId: vi.fn(),
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
    getCampaignMembershipBlock: vi.fn(() => null),
    getSettlementDeletionBlock: vi.fn(() => null),
    isAdvanceInFlight: vi.fn(() => false),
    isCampaignMutationLocked: vi.fn(() => false),
    advanceAutoResolve: false,
    setAdvanceAutoResolve: vi.fn(),
    advanceInFlight: [],
    campaignMutationLocks: [],
  };
  state.setSavedSettlements = vi.fn((rows) => {
    state.savedSettlements = rows;
    state.savedSettlementsLoaded = true;
    return true;
  });
  state.clearSavedSettlements = vi.fn((nextOwnerId = undefined) => {
    state.savedSettlements = [];
    state.savedSettlementsLoaded = false;
    if (nextOwnerId !== undefined) {
      state.savedSettlementsOwnerId = nextOwnerId;
    }
    state.savedSettlementsHydrationGeneration += 1;
  });
  return state;
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
    await waitFor(() => expect(storeState.setSavedSettlements).toHaveBeenCalledWith(
      rows,
      expect.objectContaining({ ownerId: 'owner-A' }),
    ));
  });

  test('a numeric World Map focus opens the equivalent string-id Library save', async () => {
    storeState = baseStore({ id: 'owner-A' });
    storeState.selectedSettlementId = 7;
    saves.list.mockResolvedValueOnce([
      { id: '7', name: 'Aldermoor', settlement: { name: 'Aldermoor' } },
    ]);

    render(<SettlementsPanel onNavigate={() => {}} />);
    await waitFor(() => expect(storeState.clearSelectedSettlementId).toHaveBeenCalledOnce());
  });

  test('OWNER BOUNDARY: switching accounts clears, reloads, and rejects the stale result', async () => {
    storeState = baseStore({ id: 'owner-A' });
    let resolveOwnerA;
    let resolveOwnerB;
    saves.list
      .mockImplementationOnce(() => new Promise((resolve) => {
        resolveOwnerA = resolve;
      }))
      .mockImplementationOnce(() => new Promise((resolve) => {
        resolveOwnerB = resolve;
      }));
    const staleRows = [{ id: 'save-A', name: 'Aldermoor', settlement: { name: 'Aldermoor' } }];
    const freshRows = [{ id: 'save-B', name: 'Brightwater', settlement: { name: 'Brightwater' } }];

    const { rerender } = render(<SettlementsPanel onNavigate={() => {}} />);
    await waitFor(() => expect(saves.list).toHaveBeenCalledTimes(1));
    storeState.auth = { tier: 'free', user: { id: 'owner-B' } };
    rerender(<SettlementsPanel onNavigate={() => {}} />);
    await waitFor(() => expect(saves.list).toHaveBeenCalledTimes(2));

    // The explicit clear action preserves savedSettlementsLoaded=false while B
    // hydrates; a transient [] must not be certified as a completed load.
    expect(storeState.clearSavedSettlements).toHaveBeenCalledTimes(2);
    expect(storeState.setSavedSettlements).not.toHaveBeenCalledWith([]);
    resolveOwnerA(staleRows);
    await Promise.resolve();
    expect(storeState.setSavedSettlements).not.toHaveBeenCalledWith(
      staleRows,
      expect.anything(),
    );

    resolveOwnerB(freshRows);
    await waitFor(() => expect(storeState.setSavedSettlements).toHaveBeenCalledWith(
      freshRows,
      expect.objectContaining({ ownerId: 'owner-B' }),
    ));
  });

  test('a settled owner-A Library is hidden immediately while owner B loads', async () => {
    storeState = baseStore({ id: 'owner-A' });
    saves.list
      .mockResolvedValueOnce([
        { id: 'save-A', name: 'Aldermoor', settlement: { name: 'Aldermoor' } },
      ])
      .mockImplementationOnce(() => new Promise(() => {}));

    const { rerender } = render(<SettlementsPanel onNavigate={() => {}} />);
    await screen.findByRole('heading', { level: 3, name: 'Aldermoor' });

    storeState.auth = { tier: 'free', user: { id: 'owner-B' } };
    rerender(<SettlementsPanel onNavigate={() => {}} />);
    expect(screen.queryByRole('heading', { level: 3, name: 'Aldermoor' })).toBeNull();
    await waitFor(() => expect(saves.list).toHaveBeenCalledTimes(2));
  });

  test('mixed id types join exactly once and campaign rows honor the selected Name sort', async () => {
    storeState = baseStore({ id: 'owner-A' });
    storeState.auth.tier = 'premium';
    storeState.campaigns = [{
      id: 'campaign-1',
      name: 'The Reach',
      settlementIds: [7, '2'],
      collapsed: false,
      accessState: 'active',
    }];
    const rows = [
      { id: '7', name: 'Zulu', savedAt: 30, settlement: { name: 'Zulu' } },
      { id: 2, name: 'Alpha', savedAt: 20, settlement: { name: 'Alpha' } },
      { id: 3, name: 'Morrow', savedAt: 10, settlement: { name: 'Morrow' } },
      { id: '4', name: 'Nadir', savedAt: 8, settlement: { name: 'Nadir' } },
      { id: '5', name: 'Quill', savedAt: 6, settlement: { name: 'Quill' } },
    ];
    saves.list.mockResolvedValueOnce(rows);

    render(<SettlementsPanel onNavigate={() => {}} />);
    await waitFor(() => expect(screen.getAllByTestId('settlement-card')).toHaveLength(5));

    fireEvent.change(screen.getByLabelText(/sort:/i), { target: { value: 'name' } });
    await waitFor(() => {
      const names = screen.getAllByTestId('settlement-card')
        .map(row => within(row).getByRole('heading', { level: 3 }).textContent);
      expect(names).toEqual(['Alpha', 'Zulu', 'Morrow', 'Nadir', 'Quill']);
    });
    expect(screen.getAllByRole('heading', { level: 3, name: 'Alpha' })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 3, name: 'Zulu' })).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Select' }));
    const campaignSelection = screen.getByRole('checkbox', { name: 'Select Alpha' });
    const unassignedSelection = screen.getByRole('checkbox', { name: 'Select Morrow' });
    fireEvent.click(campaignSelection);
    fireEvent.click(unassignedSelection);
    expect(campaignSelection.checked).toBe(true);
    expect(unassignedSelection.checked).toBe(true);
  });
});
