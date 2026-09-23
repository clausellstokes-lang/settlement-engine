/**
 * @vitest-environment jsdom
 *
 * libraryShelfCounts.test.jsx — U23: THE SHELF'S COUNT AND BULK-SELECT SEE ONLY WHAT THE
 * SHELF SHOWS.
 *
 * THE CLAIM. `SettlementsPanel` used to hand the RAW `saves` array to two readers that
 * answer about the library: the toolbar's `totalCount`, and `useLibraryBulkSelect`'s
 * corpus. EM-F1 hides a phantom counterparty at the HEAD of `applyLibraryFilters`, so the
 * raw array is the library PLUS rows no viewer can reach — and the toolbar therefore
 * counted a settlement the shelf refuses to show. Both readers now take the shelf's own
 * rows.
 *
 * ⭐ THE PHANTOMS ARE MINTED, NEVER TYPED. Every phantom row below comes from EM-F1's own
 * producer (`mintPhantom` with the estate's injected tool bag — `mintDmId` and `rollFrom`),
 * so the discriminant under test is the one the product writes; the envelope is the one
 * `src/store/phantomMintAction.js` writes, key for key. Each arm re-reads its fixture
 * through EM-F1's OWN predicate before it reads a count, so a fixture that stopped being a
 * phantom cannot pass as a cure.
 *
 * ⛔ WHAT THE SECOND HALF DOES AND DOES NOT CLAIM, said plainly rather than implied. NO
 * RENDERED CARD CAN PUT A PHANTOM INTO A SELECTION TODAY: the cards come off
 * `filteredSaves`, the hook's `selectedIds` is fed only by a card's own checkbox, and the
 * tree ships no select-all control. The bulk half therefore closes the HABITAT — the
 * corpus a bulk action resolves a selection against — rather than a reachable defect, and
 * arm C2 asserts exactly that corpus. The COUNT half is a reachable, rendered lie, and arm
 * C1 and arm C2's first assertion read it off the rendered sentence.
 *
 * ⛔ TWO FIXTURES, BECAUSE THE TOOLBAR HAS TWO FACES. Below five saves the toolbar renders
 * its MINIMAL face (search only — the count lives in the search placeholder and there is no
 * Select toggle at all); at five and above the full face carries the "N of M" count span
 * and the Select toggle. The brief's three-real-plus-one-phantom library lands on the first,
 * so arm C2 takes a five-real library to reach the second. The `minimal` threshold itself
 * still reads the RAW length and is deliberately left alone — it is an OWNER-VETOABLE
 * threshold documented at the render site, not one of this unit's two counts.
 *
 * @enforced-by this test
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';

/** The corpus `SettlementsPanel` hands the bulk-select hook, captured per render. */
const { bulkCorpora } = vi.hoisted(() => ({ bulkCorpora: /** @type {any[][]} */ ([]) }));

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

/**
 * The bulk-select hook, DELEGATED rather than replaced: the real implementation still runs
 * (so Select mode, the checkboxes and the action bar behave exactly as they ship), and the
 * wrapper only records the corpus the panel handed it. A hand-rolled stub would prove
 * nothing about the panel's own wiring, which is the whole subject of arm C2.
 */
vi.mock('../../src/hooks/useLibraryBulkSelect.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    useLibraryBulkSelect: (deps) => {
      bulkCorpora.push(deps.saves);
      return actual.useLibraryBulkSelect(deps);
    },
  };
});

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
const SettlementsPanel = (await import('../../src/components/SettlementsPanel.jsx')).default;
const { isPhantomSave, mintPhantom } = await import('../../src/domain/edit/phantoms.js');
const { mintDmId } = await import('../../src/domain/edit/dmLayer.js');
const { rollFrom } = await import('../../src/domain/edit/pools.js');

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

/** The search box, whose placeholder is the minimal face's ONLY statement of the count. */
const searchBox = () => /** @type {HTMLInputElement} */ (
  screen.getByLabelText('Search settlements, NPCs, and factions'));

/**
 * The full face's count sentence, found by its SHAPE rather than its value — the toolbar
 * prints "N settlements" when the numerator and denominator agree and "N of M" when they
 * do not, so a query for either reads the sentence back whatever it says. Found this way
 * so a wrong count REPORTS ITSELF ("expected '5 of 6' to be '5 settlements'") instead of
 * failing as an absent element.
 */
const countSentence = () => screen.getByText(/^\d+ settlements?$|^\d+ of \d+$/).textContent;

/**
 * THE FULL-FACE LIBRARY, shared by the two arms that read it: five real saves and one
 * minted phantom. Six raw rows clears the toolbar's five-save minimal threshold, so the
 * count span and the Select toggle are both on the page.
 */
async function renderFullFaceLibrary() {
  const towns = [
    townRow('Ashford', 60), townRow('Bellweather', 50), townRow('Caldwyn', 40),
    townRow('Dunmoor', 30), townRow('Evenholt', 20),
  ];
  const rows = [...towns, phantomRow('seed-ashford', 'Greymoor', 0)];
  saves.list.mockResolvedValueOnce(rows);
  render(<SettlementsPanel onNavigate={() => {}} />);
  await waitFor(() => expect(screen.getAllByTestId('settlement-card')).toHaveLength(5));
  return { towns, rows };
}

afterEach(() => { cleanup(); vi.clearAllMocks(); bulkCorpora.length = 0; });

describe('U23 — the shelf\'s count sees only what the shelf shows', () => {
  test('C1: three real saves and one phantom — the count reads THREE, on the face a four-row library actually renders', async () => {
    storeState = baseStore();
    const rows = [
      townRow('Ashford', 30), townRow('Bellweather', 20), townRow('Caldwyn', 10),
      phantomRow('seed-ashford', 'Greymoor', 0),
    ];
    saves.list.mockResolvedValueOnce(rows);

    render(<SettlementsPanel onNavigate={() => {}} />);
    await waitFor(() => expect(screen.getAllByTestId('settlement-card')).toHaveLength(3));

    // THE ANCHORS. Four rows reached the panel and exactly one of them is a phantom, read
    // through EM-F1's OWN predicate — so the count below measures HIDING rather than a
    // library that was short a row to begin with.
    expect(rows, 'four rows were handed to the panel').toHaveLength(4);
    expect(rows.filter(isPhantomSave), 'exactly one of them is a phantom').toHaveLength(1);
    expect(screen.getAllByTestId('settlement-card'), 'and the shelf shows three cards')
      .toHaveLength(3);

    // THE MEMBER. The minimal face states the count in its search placeholder, and it used
    // to offer to search a settlement that is not on the shelf and cannot be put there.
    expect(searchBox().placeholder,
      'the toolbar counts the settlements the GM can actually reach')
      .toBe('Search 3 settlements…');
  });

  test('C2: five real saves and one phantom — the full face reads "5 settlements", not "5 of 6"', async () => {
    storeState = baseStore();
    const { towns, rows } = await renderFullFaceLibrary();

    // THE ANCHORS, as in C1: six rows in, one phantom, five cards out.
    expect(rows, 'six rows were handed to the panel').toHaveLength(6);
    expect(rows.filter(isPhantomSave), 'exactly one of them is a phantom').toHaveLength(1);

    // THE COUNT. The full face prints "N of M" whenever numerator and denominator differ.
    expect(countSentence(),
      'the numerator and the denominator agree, because nothing is being filtered out. The'
      + ' phantom in the denominator made this sentence announce a settlement the shelf was'
      + ' withholding — and "of" is the word a GM reads as "something is hidden by MY filters"')
      .toBe('5 settlements');

    // AND THE SELECTION THE SHELF CAN ACTUALLY MAKE. The tree ships no select-all control,
    // so "select everything" is ticking every box the shelf offers; the bar counts five.
    fireEvent.click(screen.getByRole('button', { name: 'Select' }));
    for (const town of towns) {
      fireEvent.click(screen.getByRole('checkbox', { name: `Select ${town.name}` }));
    }
    expect(screen.queryAllByRole('checkbox', { name: /^Select / }),
      'the ANCHOR for the tally below: the shelf offered exactly five boxes to tick')
      .toHaveLength(5);
    expect(screen.getByTestId('bulk-action-bar').textContent,
      'five selected — the whole shelf, and nothing the shelf does not show')
      .toContain('5 selected');
  });

  test('C2b: the corpus the panel hands the bulk-select hook is the shelf, so no selection path can reach a phantom', async () => {
    storeState = baseStore();
    const { towns, rows } = await renderFullFaceLibrary();

    expect(rows.filter(isPhantomSave),
      'the ANCHOR: a phantom really is in the array the panel was handed, or the corpus'
      + ' below could not have held one either way').toHaveLength(1);

    const corpus = bulkCorpora[bulkCorpora.length - 1];
    expect(corpus.map((row) => row.id).sort(),
      'the hook is handed exactly the rows the shelf can offer. No rendered card can select'
      + ' a phantom today — the cards come off the filtered list — so this closes the'
      + ' HABITAT rather than a reachable bug, and says so')
      .toEqual(towns.map((row) => row.id).sort());
    expect(corpus.filter(isPhantomSave),
      'read through EM-F1s own predicate: not one phantom in the corpus').toHaveLength(0);
  });

  test('C3 CONTROL: with no phantom in the library the two counts are what they always were', async () => {
    storeState = baseStore();
    const towns = [
      townRow('Ashford', 60), townRow('Bellweather', 50), townRow('Caldwyn', 40),
      townRow('Dunmoor', 30), townRow('Evenholt', 20),
    ];
    saves.list.mockResolvedValueOnce(towns);

    render(<SettlementsPanel onNavigate={() => {}} />);
    await waitFor(() => expect(screen.getAllByTestId('settlement-card')).toHaveLength(5));

    expect(towns.filter(isPhantomSave),
      'the ANCHOR: this library holds no phantom at all').toHaveLength(0);
    expect(countSentence(),
      'so the count is the same sentence it printed before this unit').toBe('5 settlements');
    expect(bulkCorpora[bulkCorpora.length - 1].map((row) => row.id).sort(),
      'and the bulk corpus is the whole library, exactly as it was — this unit removed rows'
      + ' the shelf hides and nothing else')
      .toEqual(towns.map((row) => row.id).sort());
  });
});
