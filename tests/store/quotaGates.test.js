/**
 * quotaGates.test.js — EM-F1c's acceptance: THE THREE SLOT PRE-FLIGHTS COUNT THROUGH THE
 * ONE COUNTER (the owner's decision, 2026-09-23; EM-F1b applied that word at
 * `activeSaveCount` and froze these three siblings by census in arm F6 of
 * `tests/store/phantomQuota.test.js`).
 *
 * THE CLAIM. Three shipped pre-flights — `importGallerySettlementImpl`,
 * `importGalleryMapWithCampaignImpl` and `runInstantWorld` — used to compare a RAW
 * `(state.savedSettlements || []).length` against `maxSaves`, so a hidden phantom and a
 * row held past its active life each spent a slot the viewer is sold. Each now asks
 * `activeSaveCount`, the one counter, and so admits exactly the imports the viewer has
 * room for while the CAP itself is untouched: a library of three real, reachable saves
 * still fills a three-slot tier on every one of the three paths.
 *
 * ⭐ THE LIBRARY IS MINTED, NEVER TYPED. The two phantoms come from EM-F1's own producer
 * (`mintPhantom` with the estate's injected tool bag), so the discriminant under test is
 * the one the product writes rather than a literal this file invented; arm G0 re-reads the
 * fixture through EM-F1's own predicate and through `activeSaveCount` before any gate runs.
 *
 * ⛔ THE CAP IS SUPPLIED BY THE HARNESS, AND THAT IS THE HONEST SHAPE — these pre-flights
 * are DEFENSIVE. Read whole, the two gallery bodies refuse a non-premium caller before
 * ever reaching their slot arithmetic, and `maxSaves()` answers `Infinity` for a premium
 * or staff account (`TIER_GATE.premium`, and the staff branch of authSlice's `maxSaves`),
 * so no shipped combination reaches these three lines with a FINITE cap today;
 * `runInstantWorld` is tier-blind by its own header and states the pre-flight is there
 * "if the action is ever reached without the interface gate". What is under test is
 * therefore the ARITHMETIC of the three gates — which is exactly what this member
 * changes — driven the way the two sibling store suites already drive it
 * (`instantWorldBinding.test.js` hands the harness `maxSaves: 2`;
 * `galleryMapImportNormalize.test.js` hands it `Infinity`).
 *
 * ⛔ WHY THE MEMBER COUNT IS MEASURED RATHER THAN PINNED (arm G3). The realm's size is the
 * composer's call, and a literal here would silently become a different test the day the
 * plan changes. The refused run reports `settlementCount`, so the arm reads the count off
 * the product and derives its own cap from it.
 *
 * @enforced-by this test
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// The save service is stubbed on every arm: these gates are pre-flights, so what is
// proven is which side of them a call lands on, never a network.
const saveMock = vi.fn(async () => `svc-${saveMock.mock.calls.length}`);
vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    save: (...a) => saveMock(...a),
    update: vi.fn(() => Promise.resolve()),
    delete: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

vi.mock('../../src/lib/campaigns.js', () => ({
  campaigns: {
    loadCached: vi.fn(() => []),
    list: vi.fn(() => Promise.resolve([])),
    cache: vi.fn(),
    isConfigured: false,
  },
  isCampaignActive: () => true,
}));

const fetchGalleryMap = vi.fn();
const fetchDossierForImport = vi.fn();
vi.mock('../../src/lib/gallery.js', () => ({
  fetchGalleryMap: (...a) => fetchGalleryMap(...a),
  fetchDossierForImport: (...a) => fetchDossierForImport(...a),
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

vi.mock('../../src/store/campaignSliceShared.js', async (orig) => {
  const actual = await orig();
  return { ...actual, persistCampaignState: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { runInstantWorld } from '../../src/store/instantWorldBody.js';
import {
  INACTIVE_PLAN_SAVE_STATE,
  activeSaveCount,
  isSaveActive,
} from '../../src/lib/saveAccess.js';
import { isPhantomSave as isPhantomSaveLeaf, mintPhantom } from '../../src/domain/edit/phantoms.js';
import { mintDmId } from '../../src/domain/edit/dmLayer.js';
import { rollFrom } from '../../src/domain/edit/pools.js';

/** The estate's own two producers, bound as EM-F1's injected tool bag. */
const TOOLS = Object.freeze({ mintId: mintDmId, roll: rollFrom });

/** An ordinary saved settlement — a row the viewer opens from the shelf. */
const townRow = (rowId, name, extra = {}) => ({
  id: rowId,
  name,
  tier: 'town',
  seed: `seed-${rowId}`,
  settlement: {
    _seed: `seed-${rowId}`, id: `set-${rowId}`, name, tier: 'town', npcs: [], factions: [],
  },
  config: { settType: 'town' },
  aiData: {},
  versionHistory: [],
  ...extra,
});

/** A library row carrying a MINTED phantom counterparty as its blob (EM-F1's record). */
const phantomRow = (rowId, seed, name, n) => {
  const record = /** @type {Record<string, unknown>} */ (mintPhantom(seed, name, n, TOOLS));
  return {
    id: rowId,
    name: String(record.name),
    tier: String(/** @type {Record<string, string>} */ (record.traits).size),
    settlement: record,
    seed: String(record.seed),
    config: null,
    aiData: {},
    versionHistory: [],
  };
};

/**
 * THE LIBRARY UNDER TEST: five rows, of which the viewer can both HOLD and REACH exactly
 * TWO. A raw length counts five and refuses; the counter counts two and leaves room.
 */
const mixedLibrary = () => ([
  townRow('row-ashford', 'Ashford'),
  phantomRow('row-greymoor', 'seed-ashford', 'Greymoor', 0),
  townRow('row-bellweather', 'Bellweather'),
  phantomRow('row-harrowmere', 'seed-bellweather', 'Harrowmere', 1),
  townRow('row-caldwyn', 'Caldwyn', { accessState: INACTIVE_PLAN_SAVE_STATE }),
]);

/** THE CONTROL LIBRARY: three real, active, reachable saves — a genuinely full shelf. */
const fullLibrary = () => ([
  townRow('row-ashford', 'Ashford'),
  townRow('row-bellweather', 'Bellweather'),
  townRow('row-caldwyn', 'Caldwyn'),
]);

/** The campaign store the two gallery gates run inside, at the sibling suite's idiom. */
function makeStore(savedSettlements, maxSaves) {
  return create(immer((set, get, api) => ({
    auth: { user: { id: 'u1' }, tier: 'premium', role: 'user' },
    savedSettlements,
    campaignSessionGeneration: 0,
    maxSaves: () => maxSaves,
    ...createCampaignSlice(set, get, api),
  })));
}

/** The plain-state harness `runInstantWorld` takes, at `instantWorldBinding`'s idiom. */
function makeInstantHarness(savedSettlements, maxSaves) {
  const state = {
    auth: { user: { id: 'owner-a' } },
    campaignSessionGeneration: 0,
    savedSettlements,
    campaigns: [],
    activeCampaignId: null,
    configExplicitFields: {},
    maxSaves: () => maxSaves,
    setActiveCampaign: (id) => { state.activeCampaignId = id; },
  };
  return { state, set: (fn) => { fn(state); }, get: () => state };
}

const ONE_MEMBER_CAMPAIGN = Object.freeze({
  kind: 'map_with_campaign',
  name: 'Dunmoor Reach',
  members: [{
    old_id: 'm1', name: 'Dunmoor', tier: 'town', settlement: { name: 'Dunmoor', tier: 'town' },
  }],
  mapState: { placements: {} },
});

const ONE_DOSSIER = Object.freeze({
  name: 'Dunmoor', tier: 'town', settlement: { name: 'Dunmoor', tier: 'town' },
});

beforeEach(() => {
  vi.clearAllMocks();
  saveMock.mockImplementation(async () => `svc-${saveMock.mock.calls.length}`);
  fetchGalleryMap.mockReset();
  fetchDossierForImport.mockReset();
});

describe('EM-F1c — the three slot pre-flights count only the saves the viewer can hold and reach', () => {
  test('G0: the fixture really is five rows the viewer can reach two of, and the control really is a full shelf', () => {
    const library = mixedLibrary();
    expect(library, 'five rows go into every gate below, so a raw length has five to count')
      .toHaveLength(5);
    expect(library.filter((row) => isPhantomSaveLeaf(row)),
      'two of them are phantoms, read through EM-F1s OWN predicate rather than this files')
      .toHaveLength(2);
    expect(library.filter((row) => !isSaveActive(row)),
      'and one more is held past its active life, so BOTH exclusions are on the input')
      .toHaveLength(1);
    expect(activeSaveCount(library),
      'the counter every quota surface reads answers TWO over this library').toBe(2);

    expect(activeSaveCount(fullLibrary()),
      'while the control library is three real, active, reachable saves — the shelf that is'
      + ' genuinely full at a three-slot tier, and must stay refused on every path').toBe(3);
  });

  test('G1: the gallery-settlement import ADMITS one more into that library, and still refuses a genuinely full shelf', async () => {
    fetchDossierForImport.mockResolvedValue(ONE_DOSSIER);

    const store = makeStore(mixedLibrary(), 3);
    expect(store.getState().savedSettlements,
      'the ANCHOR: the slice did not replace the library the gate is about to count')
      .toHaveLength(5);

    const newSaveId = await store.getState().importGallerySettlement('dunmoor');
    expect(newSaveId, 'the import got past the pre-flight and the service minted a row')
      .toBe('svc-1');
    expect(store.getState().savedSettlements,
      'and the clone landed in the library: two reachable saves plus one is three, which a'
      + ' three-slot tier holds — the raw five never did').toHaveLength(6);

    const full = makeStore(fullLibrary(), 3);
    await expect(full.getState().importGallerySettlement('dunmoor'),
      'THE CAP IS UNMOVED: three real saves fill a three-slot tier, and the sentence the'
      + ' viewer reads is the one they read before this member')
      .rejects.toThrow('Your library is full.');
    expect(saveMock.mock.calls, 'and the refusal never reached the save service — one call'
      + ' in this arm, the admitted one').toHaveLength(1);
  });

  test('G2: the gallery-campaign import ADMITS a one-member campaign into that library, and still refuses a genuinely full shelf', async () => {
    fetchGalleryMap.mockResolvedValue(ONE_MEMBER_CAMPAIGN);

    const store = makeStore(mixedLibrary(), 3);
    expect(store.getState().savedSettlements,
      'the ANCHOR: the slice did not replace the library the gate is about to count')
      .toHaveLength(5);

    const campaignId = await store.getState().importGalleryMapWithCampaign('dunmoor-reach');
    expect(campaignId, 'the campaign was built, so the members cleared the slot pre-flight')
      .toBeTruthy();
    expect(store.getState().savedSettlements,
      'the one member clone landed beside the five rows').toHaveLength(6);

    const full = makeStore(fullLibrary(), 3);
    await expect(full.getState().importGalleryMapWithCampaign('dunmoor-reach'),
      'THE CAP IS UNMOVED: one member on top of three real saves is four against three')
      .rejects.toThrow('Not enough save slots');
  });

  test('G3: the Instant World pre-flight ADMITS its realm when the reachable saves leave room, and refuses when they do not', async () => {
    // MEASURE the realm's size off the product: a refusal reports `settlementCount`.
    const probe = makeInstantHarness([], 1);
    const refused = await runInstantWorld({
      set: probe.set, get: probe.get, basicConfig: { realmSize: 'small' }, options: { seed: 'f1c-probe' },
    });
    expect(refused.reason, 'the probe is a refusal, so the count below is the gates own figure')
      .toBe('not_enough_slots');
    const memberCount = refused.settlementCount;
    expect(memberCount, 'and the realm really does mint members, or the arithmetic below is empty')
      .toBeGreaterThan(1);

    // The cap that exactly fits the TWO reachable saves plus the whole realm.
    const max = 2 + memberCount;

    const admit = makeInstantHarness(mixedLibrary(), max);
    const landed = await runInstantWorld({
      set: admit.set, get: admit.get, basicConfig: { realmSize: 'small' }, options: { seed: 'f1c-admit' },
    });
    expect(landed.ok, 'the realm cleared the pre-flight: two reachable saves plus the realm is'
      + ' exactly the cap, where the raw five was over it').toBe(true);
    expect(admit.state.savedSettlements,
      'and every member persisted beside the five rows already on the shelf')
      .toHaveLength(5 + memberCount);

    const full = makeInstantHarness(fullLibrary(), max);
    const refusedFull = await runInstantWorld({
      set: full.set, get: full.get, basicConfig: { realmSize: 'small' }, options: { seed: 'f1c-full' },
    });
    expect(refusedFull, 'THE CAP IS UNMOVED: three REAL saves plus the realm is one past the'
      + ' same cap, and the refusal is the one the tier always gave')
      .toEqual({ ok: false, reason: 'not_enough_slots', settlementCount: memberCount });
  });
});
