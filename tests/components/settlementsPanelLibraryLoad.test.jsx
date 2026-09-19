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
 *   4. THE FORK DOOR BINDS (ODQ §934.14): forking a sample as a signed-in
 *      keeper does not merely WRITE a library row, it makes that row the
 *      active save — the fourth create chokepoint, and the one that did not.
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
    getCampaignMutationBlock: vi.fn(() => null),
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
// The PRODUCTION bind door, driven directly by the fork arms at the foot of this
// file. Imported after the store mock above so it sees the same module graph the
// panel does.
const { bindActiveSaveId } = await import('../../src/store/settlementSliceHelpers.js');

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

/**
 * ── THE FOURTH CHOKEPOINT BINDS (ODQ §934.14) ───────────────────────────────
 *
 * Four doors in this app turn a world into a library row: BuyThisDossier,
 * SaveToLibraryButton, the surveyor's ConstructionPanel, and the sample fork
 * here. Three of them stamp the id `savesService.save` hands back as the ACTIVE
 * save; the fork wrote the row and dropped the id on the floor, so the keeper
 * who had just forked a sample was left holding a saved world the app still
 * treated as an unbound draft — the exit dialog calling it unsaved, the AI
 * lifecycle's `activeSaveId === saveId` guards never matching it, the durable
 * purchase rung not advancing, and any pre-fork draft timeline never handed over.
 *
 * ⭐ IT BINDS THROUGH THE REAL DOOR, AND THAT IS WHY THIS ARM IMPORTS
 * `bindActiveSaveId` RATHER THAN STUBBING `setActiveSaveId` WITH A SETTER. A
 * hand-rolled `vi.fn` that assigns `activeSaveId` would pass whether the panel
 * called the store's action or assigned the field itself, and would prove
 * nothing about the two things the door does BESIDES stamping the id — handing
 * a draft timeline to the new row, and CLAIMING the world for the account. The
 * mock store therefore routes the action into the production helper, so the
 * claim is executed here rather than imitated.
 *
 * ⚠ WHAT THE `draftOrigin` HALF DOES AND DOES NOT PROVE, said plainly. In the
 * live app the generate action has usually stamped 'account' already for a
 * signed-in keeper, so this field has a second writer. The fixture starts it at
 * `null` — the fails-closed state `resetSettlementIdentity` leaves behind — so
 * the arm reads the DOOR's claim and not the other writer's. The arm that dies
 * when the bind is removed is the `activeSaveId` one; this one dies with it and
 * additionally catches a bind re-routed around `claimSettlementForAccount`.
 */
describe('SettlementsPanel — the sample fork binds the row it just created', () => {
  /** The panel's own dynamic import of mapEdits is real; nothing else here is. */
  const forkedWorld = { name: 'Mossgate (forked)', tier: 'town', _config: { settType: 'town' } };

  function forkStore(user) {
    const state = baseStore(user);
    state.canSave = () => true;
    state.maxSaves = () => 10;
    // The live generate action installs the world and answers "whose session
    // made this?". The fixture installs the world and DECLINES to answer, so
    // the claim below is the only writer of `draftOrigin` in this test.
    state.settlement = null;
    state.draftOrigin = null;
    state.activeSaveId = null;
    state.draftVersionHistory = [];
    state.generateSettlement = vi.fn(async () => {
      state.settlement = forkedWorld;
      return forkedWorld;
    });
    // The production door, driven against this plain mock: `get` hands it the
    // fixture, `set` applies the same mutator the immer store would.
    state.setActiveSaveId = (saveId) => bindActiveSaveId(
      () => storeState,
      (mutate) => { mutate(storeState); },
      saveId,
    );
    return state;
  }

  async function forkTheFirstSample() {
    saves.list.mockResolvedValueOnce([]);
    render(<SettlementsPanel onNavigate={() => {}} />);
    const forkButton = (await screen.findAllByRole('button', { name: /Fork this sample/ }))[0];
    fireEvent.click(forkButton);
    await waitFor(() => expect(saves.save).toHaveBeenCalledTimes(1));
  }

  test('a signed-in fork makes the new row the active save and claims the world', async () => {
    storeState = forkStore({ id: 'owner-A' });
    saves.save.mockResolvedValueOnce('save-from-fork');

    await forkTheFirstSample();

    await waitFor(() => expect(storeState.activeSaveId).toBe('save-from-fork'));
    expect(storeState.draftOrigin, 'the forked world is the account\'s, not the device\'s draft')
      .toBe('account');
    // THE ROW IT BOUND IS THE ROW IT WROTE: the id came back from the save call
    // this click made, not from anything the fixture pre-seeded.
    expect(saves.save).toHaveBeenCalledWith(expect.objectContaining({ tier: 'town' }));
  });

  test('CONTROL: a keeper who cannot save writes no row, so there is none to bind', async () => {
    storeState = forkStore({ id: 'owner-A' });
    storeState.canSave = () => false;

    saves.list.mockResolvedValueOnce([]);
    render(<SettlementsPanel onNavigate={() => {}} />);
    const forkButton = (await screen.findAllByRole('button', { name: /Fork this sample/ }))[0];
    fireEvent.click(forkButton);
    await waitFor(() => expect(storeState.generateSettlement).toHaveBeenCalledTimes(1));

    // NON-VACUITY FOR THE ARM ABOVE: the binding is not something this harness
    // does on every fork — with no save there is no id, and none is stamped.
    expect(saves.save).not.toHaveBeenCalled();
    expect(storeState.activeSaveId, 'no row was written, so nothing may be bound').toBe(null);
  });
});
