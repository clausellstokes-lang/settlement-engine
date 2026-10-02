/**
 * @vitest-environment jsdom
 *
 * libraryShelfFaces.test.jsx — U50: THE EMPTY-SHELF SENTENCE AND THE MINIMAL FACE READ
 * THE SHELF'S COUNT.
 *
 * THE CLAIM. U23 gave `SettlementsPanel` the shelf's own rows (`shelfSaves` —
 * `applyLibraryFilters` with no query and no chip, which is EM-F1's phantom hiding and
 * nothing else) and routed the toolbar's DENOMINATOR through them. The panel's RENDER
 * kept asking the same question — "how much library is there" — of the RAW array in six
 * more places, and so kept answering over rows no viewer can reach:
 *
 *   • A library holding NOTHING BUT phantoms rendered "No settlements match your search
 *     or filters … clear the active filters to see all 1", with no filter on and nothing
 *     to clear (arm U50-1). Curing only the number would have produced "see all 0", a
 *     worse sentence, so the SENTENCE'S GATE reads the shelf too — and a shelf with
 *     nothing on it is an EMPTY LIBRARY, which has always meant the sample dashboard.
 *   • The sentence's COUNT over a real library with a phantom in it announced one more
 *     settlement than clearing every filter could produce (arm U50-2).
 *   • `minimal` keyed on the RAW length, so four real saves and two phantoms drew the
 *     full six-control toolbar over a four-town shelf (arm U50-3).
 *
 * ⛔ THE THRESHOLD VALUE (5) IS THE OWNER'S AND DID NOT MOVE (legibility wave,
 * 2026-07-22). Only the count compared against it changed, and arm U50-4 is the control
 * that says so: with no phantom anywhere, four saves is the minimal face and five is the
 * full one, exactly as before this unit.
 *
 * ⭐ THE PHANTOMS ARE MINTED, NEVER TYPED — U23's fixture rule, kept verbatim. Every
 * phantom row comes from EM-F1's own `mintPhantom` with the estate's injected tool bag
 * (`mintDmId`, `rollFrom`), in the envelope `src/store/phantomMintAction.js` writes, and
 * each arm re-reads its fixture through EM-F1's OWN predicate before it reads a face. A
 * fixture that stopped being a phantom therefore cannot pass as a cure.
 *
 * ⛔ THE TWO FACES, AND HOW THIS FILE TELLS THEM APART. Below five the toolbar renders
 * SEARCH ALONE: its placeholder is `Search N settlements…` and there is no Select toggle
 * at all. At five and above the full face's placeholder ends `+ NPCs + factions…` and
 * the Select toggle is on the page. Both faces carry a search box with the same label, so
 * the placeholder is read for the FACE as well as for the count, and the Select toggle is
 * the independent second witness.
 *
 * @enforced-by this test
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
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

/** Five towns, newest first — enough to clear the owner's five-save threshold. */
const FIVE = () => [
  townRow('Ashford', 60), townRow('Bellweather', 50), townRow('Caldwyn', 40),
  townRow('Dunmoor', 30), townRow('Evenholt', 20),
];

/** The search box, whose placeholder states BOTH the count and which face is rendered. */
const searchBox = () => /** @type {HTMLInputElement} */ (
  screen.getByLabelText('Search settlements, NPCs, and factions'));

/** The Select toggle — the full face's independent second witness; null on the minimal one. */
const selectToggle = () => screen.queryByRole('button', { name: 'Select' });

/**
 * The empty-shelf placeholder's recovery sentence, pulled out by SHAPE so a wrong count
 * REPORTS ITSELF ("expected 'see all 6 …' to be 'see all 5 …'") rather than failing as an
 * absent element. Returns null when the placeholder is not on the page at all.
 */
function recoverySentence() {
  const heading = screen.queryByRole('heading',
    { name: 'No settlements match your search or filters' });
  if (!heading) return null;
  const text = heading.parentElement?.textContent || '';
  return (text.match(/see all \d+ saved settlements?/) || [text])[0];
}

/** Render the panel over one library and wait out the loading skeleton. */
async function renderLibrary(rows) {
  saves.list.mockResolvedValueOnce(rows);
  render(<SettlementsPanel onNavigate={() => {}} />);
  await waitFor(() => expect(screen.queryByRole('status')).toBe(null));
}

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('U50 — the panel\'s render reads the shelf\'s count', () => {
  test('U50-1: a library holding nothing but phantoms is an EMPTY library, not a filtered one', async () => {
    storeState = baseStore();
    const rows = [
      phantomRow('seed-ashford', 'Greymoor', 0),
      phantomRow('seed-bellweather', 'Harrowfen', 1),
    ];
    await renderLibrary(rows);

    // THE ANCHORS. Two rows really reached the panel and BOTH are phantoms, read through
    // EM-F1's own predicate — so what follows is about a shelf that is empty to the
    // viewer while the raw array is not, rather than about a library that was never
    // loaded.
    expect(rows, 'two rows were handed to the panel').toHaveLength(2);
    expect(rows.filter(isPhantomSave), 'and every one of them is a phantom').toHaveLength(2);

    // THE MEMBER. The empty-shelf placeholder blamed the GM's own search and filters for
    // a shelf that no search and no filter had touched, and then offered to clear them to
    // reveal a settlement that cannot be revealed.
    expect(recoverySentence(),
      'no "no settlements match your search or filters" over a library with no filter on')
      .toBe(null);

    // AND WHAT STANDS IN ITS PLACE: the first-run face an empty library has always got.
    // Read off the shelf this library IS empty — the same reading EM-F1b already made of
    // the quota, where a phantom is the estate's row and not the user's.
    expect(screen.getByText('Start from a sample. Or roll your own'),
      'the empty library greets the keeper instead of accusing their filters').toBeTruthy();
    expect(screen.queryByLabelText('Search settlements, NPCs, and factions'),
      'and no toolbar offers to search a shelf with nothing on it').toBe(null);
  });

  test('U50-2: the recovery sentence counts the settlements clearing the filters would actually reveal', async () => {
    storeState = baseStore();
    const towns = FIVE();
    const rows = [...towns, phantomRow('seed-ashford', 'Greymoor', 0)];
    await renderLibrary(rows);

    // THE ANCHORS: six rows in, exactly one phantom, five cards on the shelf.
    expect(rows.filter(isPhantomSave), 'exactly one row is a phantom').toHaveLength(1);
    expect(screen.getAllByTestId('settlement-card'),
      'and the shelf shows the other five').toHaveLength(5);
    expect(recoverySentence(),
      'the ANCHOR for the member below: with no query typed there is no placeholder at all')
      .toBe(null);

    fireEvent.change(searchBox(), { target: { value: 'zzzz' } });

    // THE MEMBER. Clearing the filters can only ever reveal the shelf, so the number in
    // the offer is the shelf's. The phantom in it promised a settlement that no clearing
    // of any filter can produce.
    expect(recoverySentence(),
      'the offer names what clearing the filters would actually put back on the shelf')
      .toBe('see all 5 saved settlements');
  });

  test('U50-3: the minimal face keys on the shelf, so a phantom cannot draw the full toolbar over a small library', async () => {
    storeState = baseStore();
    const rows = [
      townRow('Ashford', 60), townRow('Bellweather', 50),
      townRow('Caldwyn', 40), townRow('Dunmoor', 30),
      phantomRow('seed-ashford', 'Greymoor', 0),
      phantomRow('seed-bellweather', 'Harrowfen', 1),
    ];
    await renderLibrary(rows);

    // THE ANCHORS: six rows in, two phantoms, a FOUR-town shelf — one under the owner's
    // threshold while the raw array is one over it, which is the whole fixture.
    expect(rows.filter(isPhantomSave), 'two of the six rows are phantoms').toHaveLength(2);
    expect(screen.getAllByTestId('settlement-card'),
      'so the shelf the GM is looking at holds four towns').toHaveLength(4);

    // THE MEMBER, read twice over. Below five saves the toolbar is SEARCH ALONE: the
    // placeholder carries no "+ NPCs + factions" tail and there is no Select toggle. The
    // full six-control face was being drawn for a four-town shelf.
    expect(searchBox().placeholder,
      'the minimal face, keyed on the four settlements the GM can actually reach')
      .toBe('Search 4 settlements…');
    expect(selectToggle(),
      'and the minimal face ships no Select toggle at all — the second witness to the face')
      .toBe(null);
  });

  test('U50-4 CONTROL: with no phantom anywhere, both faces and the recovery sentence are exactly what they were', async () => {
    storeState = baseStore();
    const towns = FIVE();
    await renderLibrary(towns);

    expect(towns.filter(isPhantomSave),
      'the ANCHOR: this library holds no phantom at all').toHaveLength(0);
    // THE THRESHOLD VALUE IS THE OWNER'S. Five saves is the full face, as it has been
    // since the legibility wave — this unit moved the COUNT that is compared, never the 5.
    expect(searchBox().placeholder, 'five saves still draws the full face')
      .toBe('Search 5 settlements + NPCs + factions…');
    expect(selectToggle(), 'with its Select toggle').toBeTruthy();

    fireEvent.change(searchBox(), { target: { value: 'zzzz' } });
    expect(recoverySentence(), 'and the recovery sentence counts the whole library')
      .toBe('see all 5 saved settlements');

    cleanup();
    storeState = baseStore();
    await renderLibrary(towns.slice(0, 4));

    // AND THE OTHER SIDE OF THE SAME THRESHOLD: four saves is the minimal face, which is
    // what proves U50-3 measured the COUNT rather than a moved boundary.
    expect(searchBox().placeholder, 'four saves is still the minimal face')
      .toBe('Search 4 settlements…');
    expect(selectToggle(), 'which ships no Select toggle').toBe(null);
  });
});
