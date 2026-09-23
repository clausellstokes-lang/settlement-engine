/**
 * rosterOpsPerSave.test.js — EM-E8b case B (U49): EVERY MEMBER SAVE OF A CAMPAIGN TAKES ITS
 * ROSTER OPS AT THE TICK, not only the one the DM happens to have open.
 *
 * THE MEASUREMENT THIS FILE WAS WRITTEN FROM. At EM-E8's tip (8df38ce91), over the REAL
 * advance in LOCAL mode with a two-save campaign whose NON-ACTIVE member carried a due
 * add-decree in ITS OWN registry, that member came out of the tick with:
 *   its registry `applied` — EM-E1's hook reaches every member save (design §2.5: `decrees`
 *   is a key on the SAVED SETTLEMENT, so a campaign's tick is N registries, not one) —
 *   and its roster holding NOBODY, `dmLayer.minted` EMPTY.
 * The hook was N registries wide and the binder was one save wide. The same record claiming
 * an order carried out over a world with no such person, on every member but one.
 *
 * ⛔ NOTHING HERE IS A MOCK OF THE MECHANISM. Two real generated worlds, the store's own
 * `advanceCampaignWorld`, EM-E1's real tick hook over both registries, EM-C1's registry, the
 * real re-derivation engine, and the product's own `undoLastPulse` for the rewind.
 *
 * ⛔ THE DURABLE CLAIM IS CASE A's, AND DELIBERATELY NOT RE-MADE HERE. The local save
 * service's `update` is read-modify-write over the WHOLE library array, so two members
 * flushed in parallel lose one another's row (NOTICED at EM-E8b, not this member's to cure).
 * This suite therefore reads the library ROWS and the OUTBOX PAYLOAD — which is what the
 * flush carries — and case A proves the payload reaches the durable save.
 *
 * ⛔ NO ARM ASSERTS INSIDE A LOOP: each matrix is COLLECTED and then asserted once.
 *
 * @enforced-by this test
 */
import { describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
    upsert: vi.fn((entry) => Promise.resolve(entry?.id)),
    delete: vi.fn((id) => Promise.resolve(id)),
    isConfigured: false,
  },
}));
vi.mock('../../src/lib/flags.js', () => ({ flag: vi.fn(() => false) }));
vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});
vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = (value) => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: (campaign) => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((rows = [], ownerId = 'anon') => cached.set(ownerId, clone(rows))),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn((campaign) => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

import { poolValues } from '../../src/domain/edit/pools.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { ensureRegionalGraph, ensureWizardNewsFeed } from '../../src/domain/region/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { rosterTickSaveIds, withMintedRosterState } from '../../src/store/campaignAdvanceSession.js';
import { addOpPayloadFor, stageAddDecreeIntent } from '../../src/store/editSlice.js';

const HOME = 'save-home';
const AWAY = 'save-away';
const NOW = '2026-04-04T00:00:00.000Z';
const CONFIG = Object.freeze({ settType: 'thorp', culture: 'germanic', terrain: 'grassland' });

/** Two real worlds, generated once for the whole suite. */
const HOME_WORLD = generateSettlementPipeline({ ...CONFIG }, null, { seed: 'e8b-b-home', customContent: {} });
const AWAY_WORLD = generateSettlementPipeline({ ...CONFIG }, null, { seed: 'e8b-b-away', customContent: {} });

const clone = (value) => JSON.parse(JSON.stringify(value));

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: (key) => data.get(String(key)) ?? null,
    setItem: (key, value) => data.set(String(key), String(value)),
    removeItem: (key) => data.delete(String(key)),
    clear: () => data.clear(),
  };
}

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { ...CONFIG }, institutionToggles: {}, categoryToggles: {},
  goodsToggles: {}, servicesToggles: {}, customContent: {}, importedNeighbour: null,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

const makeStore = () => create(immer((...args) => ({
  ...stubSlice(),
  ...createSettlementSlice(...args),
  ...createCampaignSlice(...args),
  ...createCampaignWorldPulseSlice(...args),
})));

const row = (id, record) => ({
  id,
  name: String(record.name),
  tier: String(record.tier),
  seed: String(record._seed),
  settlement: clone(record),
  phase: 'canon',
  campaignState: { phase: 'canon', eventLog: [], locks: {}, systemState: {} },
  config: { ...CONFIG },
  aiData: {},
  versionHistory: [],
  timestamp: '2020-01-01T00:00:00.000Z',
});

function poolsFor(cardType, record) {
  return Object.fromEntries(addOpPayloadFor(cardType)
    .filter((entry) => typeof entry.pool === 'string')
    .map((entry) => [entry.pool, poolValues(entry.pool, record)]));
}

/** Stage ONE add-npc decree on whichever save is hydrated, exactly as a CREATE door would. */
function stageNewcomer(store, name) {
  const record = store.getState().settlement;
  return stageAddDecreeIntent(store.getState, store.setState, {
    cardType: 'npc',
    values: { name, role: poolValues('npc.role', record)[0] },
    pools: poolsFor('npc', record),
    orderedAt: NOW,
  });
}

/** Hydrate a member save as the open one, and write the live view back onto its row. */
function hydrate(store, saveId, record) {
  store.setState((state) => {
    const idx = state.savedSettlements.findIndex((entry) => String(entry.id) === saveId);
    if (state.activeSaveId != null && idx !== -1) {
      const openIdx = state.savedSettlements
        .findIndex((entry) => String(entry.id) === String(state.activeSaveId));
      if (openIdx !== -1 && state.settlement) {
        state.savedSettlements[openIdx].settlement = clone(state.settlement);
      }
    }
    state.activeSaveId = saveId;
    state.settlement = clone(record);
  });
}

/**
 * A canonized TWO-MEMBER campaign, both members carrying a due add-decree staged through the
 * real door while each was the open save. HOME is left open.
 */
function seedCampaign() {
  installLocalStorage();
  const store = makeStore();
  store.setState((state) => {
    state.savedSettlements = [row(HOME, HOME_WORLD), row(AWAY, AWAY_WORLD)];
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      accessState: 'active',
      settlementIds: [HOME, AWAY],
      regionalGraph: ensureRegionalGraph({ edges: [] }, { now: NOW }),
      wizardNews: ensureWizardNewsFeed(undefined, { now: NOW }),
      worldState: ensureWorldState(
        { rngSeed: 'roster-ops-per-save', tick: 0, canonizedAt: NOW },
        { id: 'camp-1', name: 'Realm' },
      ),
    }];
    state.campaignsLoaded = true;
    state.phase = 'canon';
  });
  hydrate(store, AWAY, AWAY_WORLD);
  const away = stageNewcomer(store, 'Bern');
  hydrate(store, HOME, HOME_WORLD);
  const home = stageNewcomer(store, 'Alda');
  store.setState((state) => {
    const idx = state.savedSettlements.findIndex((entry) => String(entry.id) === HOME);
    state.savedSettlements[idx].settlement = clone(state.settlement);
  });
  return { store, home, away };
}

const advance = (store) =>
  store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });

const rowOf = (store, saveId) =>
  store.getState().savedSettlements.find((entry) => String(entry.id) === saveId);
const npcIdsOf = (record) => (record?.npcs || []).map((npc) => npc.id);
const mintedKeysOf = (record) => Object.keys(record?.dmLayer?.minted || {});
const statusesOf = (record) => (record?.decrees || []).map((entry) => entry.status);

describe('EM-E8b B — every member save of a campaign takes its roster ops at the tick', () => {
  it('B1 mints the NON-ACTIVE member\'s newcomer at the tick, exactly once, beside the open save\'s', async () => {
    const { store, home, away } = seedCampaign();
    const beforeAway = npcIdsOf(rowOf(store, AWAY).settlement);

    const result = await advance(store);
    const afterAway = rowOf(store, AWAY).settlement;
    const afterHome = rowOf(store, HOME).settlement;

    expect(home.ok && away.ok, 'both doors staged their CREATE intent').toBe(true);
    expect(result?.ok, 'and the real advance ran to a committed result').not.toBe(false);
    expect(statusesOf(afterAway), 'EM-E1\'s hook reached the NON-ACTIVE member\'s own registry')
      .toEqual(['applied']);
    expect(npcIdsOf(afterAway).filter((id) => id === away.decreeId).length,
      'THE MEASUREMENT: the non-active member\'s newcomer is on its record, exactly once')
      .toBe(1);
    expect(npcIdsOf(afterAway).length, 'and its roster grew by exactly one')
      .toBe(beforeAway.length + 1);
    expect(afterAway.npcs.find((npc) => npc.id === away.decreeId).name,
      'wearing the name the DM typed on THAT save').toBe('Bern');
    expect(mintedKeysOf(afterAway), 'its own layer records who exists, which is what makes the'
      + ' next tick a no-op for it').toEqual([away.decreeId]);
    expect(npcIdsOf(afterHome).includes(home.decreeId),
      'and the open save still takes its own, so the member did not trade one save for another')
      .toBe(true);
    expect(npcIdsOf(store.getState().settlement).includes(home.decreeId),
      'including on the live view, which is the open save\'s other home').toBe(true);
  }, 120000);

  it('B2 is idempotent: a SECOND advance mints nobody on either member', async () => {
    const { store, home, away } = seedCampaign();
    await advance(store);
    const first = [npcIdsOf(rowOf(store, HOME).settlement), npcIdsOf(rowOf(store, AWAY).settlement)];

    await advance(store);
    const second = [npcIdsOf(rowOf(store, HOME).settlement), npcIdsOf(rowOf(store, AWAY).settlement)];
    const mints = [mintedKeysOf(rowOf(store, HOME).settlement), mintedKeysOf(rowOf(store, AWAY).settlement)];

    expect(first[0].includes(home.decreeId) && first[1].includes(away.decreeId),
      'the first tick minted on both, or the equality below compares two empty worlds').toBe(true);
    expect(second, 'the second tick leaves both rosters member for member — an applied entry is'
      + ' history and is read at every later tick, so the LAYER is what says who exists')
      .toEqual(first);
    expect(mints, 'and each layer still holds exactly its own one row, never a second')
      .toEqual([[home.decreeId], [away.decreeId]]);
  }, 120000);

  it('B3 gives both newcomers back on the undo path, with both registries WAITING again', async () => {
    const { store, home, away } = seedCampaign();
    await advance(store);
    const grown = [
      npcIdsOf(rowOf(store, HOME).settlement).includes(home.decreeId),
      npcIdsOf(rowOf(store, AWAY).settlement).includes(away.decreeId),
    ];

    const undone = await store.getState().undoLastPulse('camp-1');
    const rosters = [
      npcIdsOf(rowOf(store, HOME).settlement).includes(home.decreeId),
      npcIdsOf(rowOf(store, AWAY).settlement).includes(away.decreeId),
    ];
    const layers = [
      mintedKeysOf(rowOf(store, HOME).settlement),
      mintedKeysOf(rowOf(store, AWAY).settlement),
    ];
    const statuses = [
      statusesOf(rowOf(store, HOME).settlement),
      statusesOf(rowOf(store, AWAY).settlement),
    ];

    expect(undone, 'the undo ran').toBe(true);
    expect(grown, 'both members carried their newcomer before it, or the absences below measure'
      + ' nothing').toEqual([true, true]);
    expect(rosters, 'neither restored world holds a person the tick added').toEqual([false, false]);
    expect(layers, 'and neither layer holds a minted row — the record and the layer came back'
      + ' together, on BOTH members').toEqual([[], []]);
    expect(statuses, 'every decree is WAITING again, in its own place, never lost')
      .toEqual([['pending'], ['pending']]);
  }, 120000);

  it('B4 walks the campaign\'s own member order and folds every minting member into ONE outbox op each', () => {
    const { store } = seedCampaign();
    const ids = rosterTickSaveIds(store.getState(), 'camp-1');
    const folded = withMintedRosterState(store.getState(), [{ saveId: AWAY, settlement: {} }], [
      { ok: true, saveId: HOME, minted: ['dm:minted:1'] },
      { ok: true, saveId: AWAY, minted: ['dm:minted:2'] },
    ]);

    expect(ids, 'the tick\'s roster half walks the SAME member saves the hook walked, in the'
      + ' campaign\'s own order').toEqual([HOME, AWAY]);
    expect(folded.map((update) => String(update.saveId)),
      'and every minting member reaches the outbox, the one the pulse already carried REPLACED'
      + ' rather than doubled').toEqual([AWAY, HOME]);
    expect(folded.filter((update) => String(update.saveId) === AWAY).length,
      'exactly ONE op for the member the pulse had already queued').toBe(1);
  });

  it('B5 names only the members that carry a registry, and reads the OPEN save through its live view', () => {
    const { store } = seedCampaign();
    const both = rosterTickSaveIds(store.getState(), 'camp-1');
    // Strip the away member's registry: it now carries none, so the tick owes it nothing.
    store.setState((state) => {
      const idx = state.savedSettlements.findIndex((entry) => String(entry.id) === AWAY);
      delete state.savedSettlements[idx].settlement.decrees;
    });
    const homeOnly = rosterTickSaveIds(store.getState(), 'camp-1');
    // The OPEN save's registry lives on the live view; its row is deliberately left stale, so
    // a reader that took the row would find nothing here.
    store.setState((state) => {
      const idx = state.savedSettlements.findIndex((entry) => String(entry.id) === HOME);
      delete state.savedSettlements[idx].settlement.decrees;
    });
    const stillHome = rosterTickSaveIds(store.getState(), 'camp-1');
    store.setState((state) => { delete state.settlement.decrees; });
    const none = rosterTickSaveIds(store.getState(), 'camp-1');

    expect(both, 'both members carry a registry to begin with').toEqual([HOME, AWAY]);
    expect(homeOnly, 'a member with no registry is not named — a save that carries no `decrees`'
      + ' key reaches nothing').toEqual([HOME]);
    expect(stillHome, 'the OPEN save is read through its LIVE VIEW, which is the authority for'
      + ' the save the DM has hydrated').toEqual([HOME]);
    // anchored: the three readings above all named somebody, so the empty list below is the
    // dormant short-circuit and not a reader that matches nothing.
    expect(none, 'and a campaign whose members carry no registry at all names nobody').toEqual([]);
  });
});
