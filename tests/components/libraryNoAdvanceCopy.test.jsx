/** @vitest-environment jsdom */
/**
 * libraryNoAdvanceCopy.test.jsx — LIBRARY-SIMPLE (2026-11-10).
 *
 * The owner, verbatim: "I now want to simplify the library page. No longer does it
 * advance time. That will only be accessible in isolated (not in campaign settlements)
 * or the realm page."
 *
 * The whole panel, rendered for a Cartographer with a campaign folder AND an
 * unassigned settlement on the shelf (every state in which the Library used to offer
 * or promise an advance): the header and the new-campaign helper keep their sentences
 * minus the advancing clause (copy by deletion, no word written), and nothing on the
 * page — control, label or sentence — speaks of advancing.
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
    isCampaignMutationLocked: vi.fn(() => false),
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

const row = (id, name) => ({
  id, name, tier: 'town', timestamp: Date.now(), accessState: 'active',
  campaignState: { phase: 'draft' },
  settlement: { name, tier: 'town', config: {}, npcs: [], factions: [], neighbourNetwork: [], economicState: { prosperity: 'Comfortable' } },
});

describe('the Library promises no advance (owner, 2026-11-10)', () => {
  test('a premium shelf with a folder and an unassigned town: kept sentences, no advance anywhere', async () => {
    storeState = baseStore({ id: 'owner-A' });
    storeState.auth = { tier: 'premium', user: { id: 'owner-A' } };
    storeState.maxSaves = () => Infinity;
    storeState.campaigns = [{ id: 'camp-1', name: 'The Reach', settlementIds: ['s-in'], collapsed: false }];
    saves.list.mockResolvedValueOnce([row('s-in', 'Hearthfell'), row('s-out', 'Ashford')]);
    render(<SettlementsPanel onNavigate={() => {}} />);
    await waitFor(() => expect(screen.queryByRole('status')).toBe(null));

    // The anchors: the folder and the unassigned ledger both rendered.
    expect(screen.getByRole('table', { name: 'Settlements in The Reach' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Unassigned \(1\)/ })).toBeTruthy();
    // Copy by deletion: each sentence minus its advancing clause.
    expect(screen.getByText('Your saved settlements and campaigns. Reopen a town or export a dossier for the table.')).toBeTruthy();
    expect(screen.getByText('Group towns into one world.')).toBeTruthy();
    // And the negative over the whole page.
    // anchored: the body holds the folder table, the ledger heading and both kept sentences asserted present above.
    expect(document.body.textContent).not.toMatch(/advanc/i);
    expect(screen.queryByRole('button', { name: /advance/i })).toBeNull();
    expect(screen.queryByLabelText(/advance/i)).toBeNull();
  });
});
