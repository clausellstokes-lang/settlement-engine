/**
 * @vitest-environment jsdom
 *
 * librarySaveCountBand.test.jsx — U51: THE SAVE-COUNT BAND COUNTS THE SAVES THE USER
 * HOLDS.
 *
 * THE CLAIM. `SettlementsPanel` banded the RAW `saves.length` into both of the library's
 * analytics events — LIBRARY_VIEWED's `save_count_band` and SETTLEMENT_REOPENED's. That
 * length counts two kinds of row the user does not hold:
 *
 *   • an EM-F1 PHANTOM counterparty — an off-stage prop that persists as a save and that
 *     the shelf hides at the head of its filter pipeline. It is the estate's row, not the
 *     user's, which is exactly the reading EM-F1b already made of the QUOTA
 *     (`activeSaveCount`, where a hidden phantom spends no slot);
 *   • an INACTIVE save — retained rather than held, and already excluded from the quota
 *     meter standing a few lines up the same page.
 *
 * Both events now read `activeSlotsUsed`, the `activeSaveCount` memo the quota meter
 * already renders from, so the page has ONE reading of "how much library does this GM
 * hold" rather than two that disagree.
 *
 * ⛔ WHY A BAND MAKES THIS WORSE, NOT SAFER. The band is coarse on purpose (zero · 1_2 ·
 * 3_5 · 6_10 · gt_10), so a miscount is invisible until it crosses a boundary — and then
 * it is not a rounding error but a different answer. The fixture below is built to cross
 * one: two held saves beside one inactive save and one phantom banded `3_5`, where the
 * honest answer is `1_2`. A fixture that did not cross a boundary would pass against
 * either reading and prove nothing.
 *
 * ⭐ THE PHANTOM IS MINTED, NEVER TYPED — U23's fixture rule kept verbatim: EM-F1's own
 * `mintPhantom` with the estate's injected tool bag, read back through EM-F1's OWN
 * predicate before any band is read. The INACTIVE row carries the save service's own
 * `INACTIVE_PLAN_SAVE_STATE` and is read back through `isSaveActive`, for the same
 * reason.
 *
 * ⛔ THE SESSION DEDUPE IS CLEARED PER ARM. `useFunnelEvent` marks LIBRARY_VIEWED fired
 * in `sessionStorage` and refuses to fire it twice, so an arm that inherited a previous
 * arm's mark would assert over an empty call list and pass vacuously.
 *
 * @enforced-by this test
 */
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';

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
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

let storeState;
function baseStore(user = { id: 'owner-A' }) {
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
    canonizeSavedSettlement: vi.fn(),
    setActiveSaveId: vi.fn(),
    setActiveCampaign: vi.fn(),
    advanceCampaignWorld: vi.fn(),
    clearRefusal: vi.fn(),
    lastRefusal: null,
    maxSaves: () => 3,
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
    if (nextOwnerId !== undefined) state.savedSettlementsOwnerId = nextOwnerId;
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
const { track, Funnel } = await import('../../src/lib/analytics.js');
const SettlementsPanel = (await import('../../src/components/SettlementsPanel.jsx')).default;
const { isPhantomSave, mintPhantom } = await import('../../src/domain/edit/phantoms.js');
const { mintDmId } = await import('../../src/domain/edit/dmLayer.js');
const { rollFrom } = await import('../../src/domain/edit/pools.js');
const { isSaveActive, INACTIVE_PLAN_SAVE_STATE } = await import('../../src/lib/saveAccess.js');
const { saveCountBand } = await import('../../src/components/settlements/helpers.js');

/** EM-F1's injected tool bag, bound to the estate's own two producers. */
const TOOLS = Object.freeze({ mintId: mintDmId, roll: rollFrom });

/** An ordinary saved settlement — a row the viewer opens from the shelf. */
const townRow = (name, savedAt) => ({
  id: `row-${name.toLowerCase()}`,
  name,
  tier: 'town',
  savedAt,
  seed: `seed-${name.toLowerCase()}`,
  settlement: {
    _seed: `seed-${name.toLowerCase()}`, id: `set-${name.toLowerCase()}`,
    name, tier: 'town', npcs: [], factions: [],
  },
  config: { settType: 'town' },
  aiData: {},
  versionHistory: [],
});

/** The same row, RETAINED rather than held — the save service's own inactive state. */
const retainedRow = (name, savedAt) => ({
  ...townRow(name, savedAt), accessState: INACTIVE_PLAN_SAVE_STATE,
});

/** A library row carrying a MINTED phantom as its blob — `phantomMintAction`'s envelope. */
const phantomRow = (seed, name, n) => {
  const record = /** @type {any} */ (mintPhantom(seed, name, n, TOOLS));
  return {
    id: String(record.id),
    name: String(record.name),
    tier: String(record.traits.size),
    savedAt: 1,
    settlement: record,
    seed: String(record.seed),
    config: null,
    aiData: {},
    versionHistory: [],
  };
};

/**
 * THE BOUNDARY-CROSSING LIBRARY: two held saves, one retained save, one minted phantom.
 * Four raw rows band as `3_5`; the two the GM holds band as `1_2`. Every arm uses it.
 */
const crossingLibrary = () => [
  townRow('Ashford', 40), townRow('Bellweather', 30),
  retainedRow('Caldwyn', 20), phantomRow('seed-ashford', 'Greymoor', 0),
];

/** The band each event carried, by event name, off whichever mock recorded it. */
function bandOf(calls, eventName) {
  const hit = calls.filter(([name]) => name === eventName).pop();
  return hit ? hit[1]?.save_count_band : null;
}

async function renderLibrary(rows) {
  saves.list.mockResolvedValueOnce(rows);
  render(<SettlementsPanel onNavigate={() => {}} />);
  await waitFor(() => expect(screen.queryByRole('status')).toBe(null));
}

beforeEach(() => { sessionStorage.clear(); });
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('U51 — the save-count band counts the saves the user holds', () => {
  test('U51-1: LIBRARY_VIEWED bands the library the GM holds, not the rows the estate is storing', async () => {
    storeState = baseStore();
    const rows = crossingLibrary();
    await renderLibrary(rows);

    // THE ANCHORS, each read through the estate's OWN predicate. Four rows reached the
    // panel; one is a phantom; one is retained rather than held; two are the library.
    expect(rows, 'four rows were handed to the panel').toHaveLength(4);
    expect(rows.filter(isPhantomSave), 'exactly one of them is a phantom').toHaveLength(1);
    expect(rows.filter((row) => !isSaveActive(row)),
      'and exactly one of them is retained rather than held').toHaveLength(1);
    // AND THE BOUNDARY IS REALLY CROSSED — asserted off the band function itself, so the
    // arm cannot pass because the two readings happened to land in one bucket.
    expect([saveCountBand(rows.length), saveCountBand(2)],
      'four raw rows and two held saves fall in DIFFERENT bands, which is the whole fixture')
      .toEqual(['3_5', '1_2']);

    // THE MEMBER. The funnel's first library event reported a library the GM does not
    // have.
    await waitFor(() => expect(Funnel.track.mock.calls.length).toBeGreaterThan(0));
    expect(bandOf(Funnel.track.mock.calls, 'LIBRARY_VIEWED'),
      'the band the funnel records is the library the GM holds')
      .toBe('1_2');
  });

  test('U51-2: SETTLEMENT_REOPENED bands the same library, so the revisit event and the quota meter agree', async () => {
    storeState = baseStore();
    const rows = crossingLibrary();
    await renderLibrary(rows);

    // THE ANCHOR: the shelf really offers the two held saves and the retained one — the
    // phantom is hidden, so the row that is missing from the band is missing from the
    // page too.
    expect(screen.getAllByTestId('settlement-card'),
      'three cards on the shelf: two held, one retained').toHaveLength(3);

    fireEvent.click(screen.getByRole('button', { name: 'Open Ashford' }));

    // THE MEMBER. The revisit event's denominator is the same library, read off the same
    // memo the quota meter renders from.
    expect(bandOf(track.mock.calls, 'SETTLEMENT_REOPENED'),
      'the revisit event bands what the GM holds, exactly as the view event does')
      .toBe('1_2');
  });

  test('U51-3 CONTROL: with every row held and reachable, both bands are what they always were', async () => {
    storeState = baseStore();
    const rows = [townRow('Ashford', 40), townRow('Bellweather', 30), townRow('Caldwyn', 20)];
    await renderLibrary(rows);

    expect(rows.filter(isPhantomSave),
      'the ANCHOR: no phantom in this library').toHaveLength(0);
    expect(rows.filter((row) => !isSaveActive(row)),
      'and nothing retained either — so raw length and held count are the same number')
      .toHaveLength(0);

    await waitFor(() => expect(Funnel.track.mock.calls.length).toBeGreaterThan(0));
    expect(bandOf(Funnel.track.mock.calls, 'LIBRARY_VIEWED'),
      'so the view event bands exactly what it banded before this unit').toBe('3_5');

    fireEvent.click(screen.getByRole('button', { name: 'Open Ashford' }));
    expect(bandOf(track.mock.calls, 'SETTLEMENT_REOPENED'),
      'and so does the revisit event — this unit removed rows the GM does not hold, and'
      + ' nothing else').toBe('3_5');
  });
});
