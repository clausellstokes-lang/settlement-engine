/**
 * localFlushConcurrency.test.js — EM-E8c (U69): A LOCAL FLUSH OF SEVERAL MEMBERS KEEPS EVERY
 * ROW.
 *
 * THE MEASUREMENT THIS FILE WAS WRITTEN FROM, executed at ⟨BASE⟩ 884856d14 over the REAL
 * advance in LOCAL mode against the REAL save service. `persistSaveUpdates` hands every
 * member's update to `Promise.all`, and the local backend's `update` is a read-modify-write
 * over the WHOLE library array whose read (`await localLoad()`) YIELDS. So every call
 * suspended at that same await before any of them wrote, all read the identical pre-flush
 * array, and the last `localWrite` won:
 *   two members flushed in one tick  — "lost: ["save-2"]";
 *   three members flushed in one tick — "lost: ["save-2","save-3"]".
 * N members ⇒ N−1 rows lose their write, and a lost row keeps the PRE-TICK bytes: its
 * durable registry still reads `pending` while the surviving member's reads `applied` — the
 * same record-over-a-world-that-disagrees split EM-E8b cured in the other direction. Under
 * THE PROMISE a save is the DM's lived history, so this is data loss, not scheduling.
 *
 * ⛔ NOTHING HERE IS A MOCK OF THE MECHANISM. Real generated worlds, the store's own
 * `advanceCampaignWorld`, EM-E1's real tick hook, the real re-derivation engine, and the
 * REAL save service in local mode — every durable row below has been through `saves.save`
 * → the advance's own flush → `saves.list`.
 *
 * ⛔ NO ARM ASSERTS INSIDE A LOOP: each matrix is COLLECTED and then asserted once.
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: null, isConfigured: false, setSessionPersistence: () => {},
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

import { saves } from '../../src/lib/saves.js';
import { poolValues } from '../../src/domain/edit/pools.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { ensureRegionalGraph, ensureWizardNewsFeed } from '../../src/domain/region/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { addOpPayloadFor, stageAddDecreeIntent } from '../../src/store/editSlice.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SAVES = 'src/lib/saves.js';
const ADVANCE_SESSION = 'src/store/campaignAdvanceSession.js';
const LOCAL_KEY = 'dnd_settlement_saves';
const NOW = '2026-04-04T00:00:00.000Z';
const CONFIG = Object.freeze({ settType: 'thorp', culture: 'germanic', terrain: 'grassland' });

/**
 * The bytes a LONE `saves.update` leaves in the local key — copied off the PRE-CHANGE
 * `localUpdate` at ⟨BASE⟩ 884856d14 (the file planted from HEAD, this arm run, the string
 * read out of its diff). It is a golden of the WRITE, not of a world: the fixture in C3 is
 * hand-written, so no clock, mint or generator reaches these bytes.
 */
const SINGLE_FLUSH_GOLDEN = '[{"id":"row-a","name":"A2","tier":"hamlet","savedAt":1,'
  + '"settlement":{"id":"s-a","name":"A2"}},'
  + '{"id":"row-b","name":"B","tier":"hamlet","savedAt":2,'
  + '"settlement":{"id":"s-b","name":"B"}}]';

const WORLDS = new Map();
function world(seed) {
  if (!WORLDS.has(seed)) {
    WORLDS.set(seed, generateSettlementPipeline({ ...CONFIG }, null, { seed, customContent: {} }));
  }
  return WORLDS.get(seed);
}

const clone = (value) => JSON.parse(JSON.stringify(value));

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: (key) => data.get(String(key)) ?? null,
    setItem: (key, value) => data.set(String(key), String(value)),
    removeItem: (key) => data.delete(String(key)),
    clear: () => data.clear(),
  };
  return data;
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

const envelope = (id, record) => ({
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
});

function poolsFor(cardType, record) {
  return Object.fromEntries(addOpPayloadFor(cardType)
    .filter((entry) => typeof entry.pool === 'string')
    .map((entry) => [entry.pool, poolValues(entry.pool, record)]));
}

function stageNewcomer(store, name) {
  const record = store.getState().settlement;
  return stageAddDecreeIntent(store.getState, store.setState, {
    cardType: 'npc',
    values: { name, role: poolValues('npc.role', record)[0] },
    pools: poolsFor('npc', record),
    orderedAt: NOW,
  });
}

/** Hydrate a member as the open save, writing the outgoing view back onto its own row. */
function hydrate(store, saveId, record) {
  store.setState((state) => {
    const openIdx = state.activeSaveId == null ? -1 : state.savedSettlements
      .findIndex((entry) => String(entry.id) === String(state.activeSaveId));
    if (openIdx !== -1 && state.settlement) {
      state.savedSettlements[openIdx].settlement = clone(state.settlement);
    }
    state.activeSaveId = saveId;
    state.settlement = clone(record);
  });
}

/**
 * A canonized N-MEMBER campaign, seeded into the REAL local library first, every member
 * carrying ONE due add-decree staged through the real door while it was the open save. The
 * durable rows are mirrored SEQUENTIALLY, so the setup itself never races the thing measured.
 *
 * @param {string[]} seeds one generation seed per member
 * @returns {Promise<{store:any, ids:string[], decreeIds:string[]}>}
 */
async function seedCampaign(seeds) {
  installLocalStorage();
  const ids = seeds.map((_, index) => `save-${index + 1}`);
  const records = seeds.map((seed) => world(seed));
  for (let i = 0; i < ids.length; i += 1) {
    // Sequential on purpose: the fixture's own writes are not what this suite measures.
    await saves.save(envelope(ids[i], records[i]));
  }
  const library = await saves.list();
  const store = makeStore();
  store.setState((state) => {
    state.savedSettlements = clone(library).map((row) => ({
      ...row,
      phase: 'canon',
      campaignState: { phase: 'canon', eventLog: [], locks: {}, systemState: {} },
    }));
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      accessState: 'active',
      settlementIds: [...ids],
      regionalGraph: ensureRegionalGraph({ edges: [] }, { now: NOW }),
      wizardNews: ensureWizardNewsFeed(undefined, { now: NOW }),
      worldState: ensureWorldState(
        { rngSeed: 'em-e8c-local-flush', tick: 0, canonizedAt: NOW },
        { id: 'camp-1', name: 'Realm' },
      ),
    }];
    state.campaignsLoaded = true;
    state.phase = 'canon';
  });
  const decreeIds = [];
  for (let i = 0; i < ids.length; i += 1) {
    hydrate(store, ids[i], records[i]);
    const staged = stageNewcomer(store, `Newcomer${i + 1}`);
    decreeIds.push(staged.decreeId);
  }
  // Park the last-hydrated view onto its own row, then mirror every row to the durable
  // library one at a time.
  store.setState((state) => {
    const idx = state.savedSettlements
      .findIndex((entry) => String(entry.id) === String(state.activeSaveId));
    if (idx !== -1) state.savedSettlements[idx].settlement = clone(state.settlement);
  });
  for (const id of ids) {
    const row = store.getState().savedSettlements.find((entry) => String(entry.id) === id);
    // Sequential on purpose, as above: the mirror must not race the thing measured.
    await saves.update(id, { settlement: clone(row.settlement) });
  }
  return { store, ids, decreeIds };
}

const advance = (store) =>
  store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });

const npcIdsOf = (record) => (record?.npcs || []).map((npc) => npc.id);
const statusesOf = (record) => (record?.decrees || []).map((entry) => entry.status);

/** Every member's durable row, in the campaign's own member order. */
async function durableRows(ids) {
  const library = await saves.list();
  return ids.map((id) => library.find((row) => String(row.id) === id));
}

describe('EM-E8c — a local flush of several members keeps every row', () => {
  it('C1 keeps BOTH members\' rows when two are flushed in one tick', async () => {
    const { store, ids, decreeIds } = await seedCampaign(['e8c-1', 'e8c-2']);
    const before = await durableRows(ids);

    const result = await advance(store);
    const after = await durableRows(ids);
    const carried = after.map((row, i) => npcIdsOf(row.settlement).includes(decreeIds[i]));
    const lost = ids.filter((_, i) => !carried[i]);

    expect(result?.ok, 'the real advance ran to a committed result').not.toBe(false);
    expect(before.map((row) => statusesOf(row.settlement)),
      'every durable row carried its decree WAITING before the tick')
      .toEqual(ids.map(() => ['pending']));
    expect(lost, `THE MEASUREMENT: no member's durable row is lost by the flush (lost: ${
      JSON.stringify(lost)})`).toEqual([]);
    expect(carried, 'and each row carries ITS OWN newcomer, never the other member\'s')
      .toEqual(ids.map(() => true));
    expect(after.map((row) => statusesOf(row.settlement)),
      'and every durable registry reads APPLIED — a lost row keeps its PRE-TICK bytes, so'
      + ' it would still be claiming the order is WAITING while its sibling carried it out')
      .toEqual(ids.map(() => ['applied']));
  }, 180000);

  it('C2 keeps all THREE members\' rows when three are flushed in one tick', async () => {
    const { store, ids, decreeIds } = await seedCampaign(['e8c-1', 'e8c-2', 'e8c-3']);

    const result = await advance(store);
    const after = await durableRows(ids);
    const carried = after.map((row, i) => npcIdsOf(row.settlement).includes(decreeIds[i]));
    const lost = ids.filter((_, i) => !carried[i]);

    expect(result?.ok, 'the real advance ran to a committed result').not.toBe(false);
    expect(lost, `THE MEASUREMENT: a third member does not widen the loss (lost: ${
      JSON.stringify(lost)})`).toEqual([]);
    expect(carried, 'all three durable rows carry their own newcomer')
      .toEqual(ids.map(() => true));
  }, 240000);

  it('C3 writes a ONE-member flush byte for byte as the pre-change path wrote it', async () => {
    installLocalStorage();
    // A hand-written library, so nothing in this arm depends on a clock, a mint or the
    // generator: the bytes below are the WRITE's, and only the write's.
    localStorage.setItem(LOCAL_KEY, JSON.stringify([
      { id: 'row-a', name: 'A', tier: 'hamlet', savedAt: 1, settlement: { id: 's-a', name: 'A' } },
      { id: 'row-b', name: 'B', tier: 'hamlet', savedAt: 2, settlement: { id: 's-b', name: 'B' } },
    ]));

    await saves.update('row-a', { name: 'A2', settlement: { id: 's-a', name: 'A2' } });
    const written = localStorage.getItem(LOCAL_KEY);

    expect(written, 'THE GOLDEN, taken BY COPY off the pre-change `localUpdate` at ⟨BASE⟩'
      + ' 884856d14: serializing the section changes WHEN a write lands, never WHAT it'
      + ' writes — a lone flush must still produce these exact bytes')
      .toBe(SINGLE_FLUSH_GOLDEN);
  });

  it('C4 leaves the CLOUD path per-row and unserialized — the queue is the local backend\'s alone', async () => {
    const source = readFileSync(join(ROOT, SAVES), 'utf8');
    const cloudSection = source.slice(
      source.indexOf('// ── Supabase methods'),
      source.indexOf('// ── Local methods'),
    );

    vi.resetModules();
    /** @type {string[]} */
    const reached = [];
    /** @type {Function[]} */
    const pending = [];
    vi.doMock('../../src/lib/supabase.js', () => ({
      isConfigured: true,
      setSessionPersistence: () => {},
      supabase: {
        auth: { getUser: async () => ({ data: { user: { id: 'owner-a' } } }) },
        from: () => ({
          update: () => {
            const query = {
              id: null,
              eq(column, value) {
                if (column === 'id') query.id = String(value);
                return query;
              },
              select: () => {
                reached.push(String(query.id));
                return new Promise((resolve) => { pending.push(resolve); });
              },
            };
            return query;
          },
        }),
      },
    }));
    const cloud = await import('../../src/lib/saves.js');
    const flying = Promise.all([
      cloud.saves.update('row-a', { name: 'A2' }),
      cloud.saves.update('row-b', { name: 'B2' }),
    ]);
    // Let both owner checks and both column writes settle without resolving either row.
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    const concurrent = [...reached];
    pending.forEach((resolve, index) => resolve({
      data: [{ id: index === 0 ? 'row-a' : 'row-b' }], error: null,
    }));
    await flying;
    vi.doUnmock('../../src/lib/supabase.js');
    vi.resetModules();

    expect(cloudSection.length, 'the cloud half of the module is where this arm says it is')
      .toBeGreaterThan(0);
    expect(cloudSection.includes('serializeLocalWrite'),
      'no cloud writer takes the local library\'s queue — the server owns per-row ordering'
      + ' and a device-side queue there would only add latency to a shape that never lost a'
      + ' row').toBe(false);
    expect(concurrent, 'and BOTH cloud updates are in flight at once: the cure did not turn'
      + ' a parallel per-row flush into a serial one for paying accounts')
      .toEqual(['row-a', 'row-b']);
  });

  it('C5 keeps the mint, the ONE flush and the two replays in that order', () => {
    const source = readFileSync(join(ROOT, ADVANCE_SESSION), 'utf8');
    const body = source.slice(
      source.indexOf('export async function runAdvanceCampaignWorld'),
      source.indexOf('export async function runResolveIntervalMajors'),
    );
    const mint = body.indexOf('applyRosterDecreesAtTick');
    const flush = body.indexOf('await flushWorldPulsePersist({');
    const party = body.indexOf('await get().recordPartyImpact(');
    const ripple = body.indexOf('await get().recordCanonRelationshipRipple(');
    const flushes = [...body.matchAll(/await flushWorldPulsePersist\(\{/g)].length;

    expect(Math.min(mint, flush, party, ripple),
      'all four seams are in the advance body this arm read').toBeGreaterThan(-1);
    expect(flushes, 'the advance still flushes its outbox EXACTLY ONCE, which is what makes'
      + ' the serialized local write one ordered run rather than several').toBe(1);
    expect([mint < flush, flush < party, party < ripple],
      'EM-E8b left this PLAUSIBLE and it is pinned here: the tick\'s mint rides the one'
      + ' flush, and the two replays still run AFTER it, party impact before canon ripple —'
      + ' neither reads the roster, and serializing the local write moved neither')
      .toEqual([true, true, true]);
  });
});
