/**
 * publicProseAdoption.test.js — SW-B7b's writer and the store's ADOPTION ON ACK, one cause
 * (STYLE-RULINGS-2 B10(a); the chair's grant of STOP 1, 13:5x).
 *
 * THE DEFECT THE GRANT NAMES. `lib/saves.js` stamps `data.publicProse` onto every cloud row
 * (the public prose projection's text, composed owner-side), but the store's cached row and
 * live record are the ones it handed in, unstamped. The canon commands compare-and-swap on
 * the stored `data` against the store's cached row (183/193: `v_locked_data is distinct from
 * p_expected_data`), and the store first refuses a live record that differs from its cache
 * (`canonEventCommandTransaction.js :: liveMatchesCachedBase`). So without the adoption a
 * canon command issued after a save is refused as STALE.
 *
 * SUBSTRATE. The real `saves.js` against a mocked cloud (`src/lib/supabase.js`, the
 * `tests/store/phantomCloudId.test.js` idiom): one in-memory `settlements` table, and the cut
 * route RPC modelled as its CAS alone (deep jsonb equality of the stored `data` and `ai_data`
 * against the expected). The real settlement slice under Zustand + Immer, with the adopter
 * wired exactly as `store/index.js` wires it. The command's preparation is not run: the arms
 * read the two equalities the command's entry and the server's CAS read.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { isDeepStrictEqual } from 'node:util';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const cloud = vi.hoisted(() => {
  const state = { rows: [], next: 0, clock: 0 };
  const stamp = () => { state.clock += 1000; return new Date(1700000000000 + state.clock).toISOString(); };
  const matches = (row, filters) => filters.every(([col, value]) => String(row[col]) === String(value));
  function run(q) {
    if (q.op === 'insert') {
      state.next += 1;
      const id = `00000000-0000-4000-8000-${String(state.next).padStart(12, '0')}`;
      state.rows.push({ access_state: 'active', created_at: stamp(), ...q.payload, id, updated_at: stamp() });
      return { data: { id }, error: null };
    }
    if (q.op === 'update') {
      const hit = state.rows.filter((row) => matches(row, q.filters));
      hit.forEach((row) => Object.assign(row, q.payload, { updated_at: stamp() }));
      return { data: hit.map((row) => ({ id: row.id })), error: null };
    }
    const found = state.rows.filter((row) => matches(row, q.filters));
    return { data: q.single ? (found[0] ?? null) : found, error: null };
  }
  function table() {
    const q = { op: null, payload: null, filters: [], single: false };
    const builder = {
      select() { if (q.op === null) q.op = 'select'; return builder; },
      insert(row) { q.op = 'insert'; q.payload = row; return builder; },
      update(patch) { q.op = 'update'; q.payload = patch; return builder; },
      eq(col, value) { q.filters.push([col, value]); return builder; },
      order() { return builder; },
      single() { q.single = true; return builder; },
      maybeSingle() { q.single = true; return builder; },
      then(resolve, reject) { return Promise.resolve().then(() => run(q)).then(resolve, reject); },
    };
    return builder;
  }
  return {
    state,
    client: {
      auth: { getUser: () => Promise.resolve({ data: { user: { id: 'owner-1' } } }) },
      from: () => table(),
      rpc: () => Promise.resolve({ data: 0, error: null }),
    },
    reset() { state.rows = []; state.next = 0; state.clock = 0; },
  };
});

const composer = vi.hoisted(() => ({ fail: false }));

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: cloud.client, isConfigured: true, setSessionPersistence: () => {},
}));

vi.mock('../../src/components/new/publicProseCompose.js', async (importOriginal) => {
  const real = await importOriginal();
  return {
    ...real,
    composePublicProse: (...args) => {
      if (composer.fail) throw new Error('the composer could not draw');
      return real.composePublicProse(...args);
    },
  };
});

import { saves } from '../../src/lib/saves.js';
import { adoptPublicProseAck, createSettlementSlice } from '../../src/store/settlementSlice.js';
import { publicProseOf } from '../../src/domain/display/publicProse.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';

// Canonical, as every record the store holds is (the library's read normalizes; a generated
// record is born canonical), so the arms read the stamp and nothing else.
const TOWN = normalizeSettlement({
  _seed: 'seed-ashford', id: 'town.ashford', name: 'Ashford', tier: 'town', population: 2000,
  config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
  economicState: { prosperity: 'Modest', primaryExports: ['grain'], primaryImports: [], activeChains: [] },
  npcs: [], activeConditions: [],
});

const envelope = (settlement) => ({
  name: settlement.name, tier: settlement.tier, seed: settlement._seed, settlement,
  config: { settType: 'town' }, aiData: {}, versionHistory: [],
});

let store;
let unsubscribe = () => {};

function makeStore() {
  const made = create(immer((set, get) => ({
    auth: { user: { id: 'owner-1' } },
    campaigns: [],
    ...createSettlementSlice(set, get),
  })));
  unsubscribe();
  // EXACTLY the wiring `store/index.js` carries.
  unsubscribe = saves.onPublicProseAck((ack) => adoptPublicProseAck(made.setState, made.getState, ack));
  return made;
}

/** The two equalities a canon command reads before and at the server (see the header). */
function canonCommandReading(saveId) {
  const state = store.getState();
  const cached = state.savedSettlements.find((entry) => String(entry.id) === String(saveId));
  const row = cloud.state.rows.find((entry) => String(entry.id) === String(saveId));
  const json = (value) => JSON.parse(JSON.stringify(value));
  return {
    liveMatchesCache: isDeepStrictEqual(json(state.settlement), json(cached.settlement)),
    serverCasEqual: isDeepStrictEqual(json(row.data), json(cached.settlement))
      && isDeepStrictEqual(json(row.ai_data), json(cached.aiData)),
  };
}

/** The create path as SaveToLibraryButton runs it: save, bind the id, hydrate the library. */
async function saveAndHydrate(settlement) {
  store.setState((draft) => { draft.settlement = settlement; });
  const id = await saves.save(envelope(settlement));
  store.getState().setActiveSaveId(id);
  store.getState().setSavedSettlements(await saves.list());
  return id;
}

beforeEach(() => {
  cloud.reset();
  composer.fail = false;
  store = makeStore();
});

describe('SW-B7b — the writer stamps, and the store holds what it stamped', () => {
  test('a canon command issued after a save is NOT refused as stale (the create path)', async () => {
    const id = await saveAndHydrate({ ...TOWN });
    const row = cloud.state.rows.find((entry) => String(entry.id) === String(id));
    expect(row.data.publicProse?.v, 'the writer stamped the row').toBe('pp-1');
    expect(canonCommandReading(id), 'the live record, the cache and the stored row are one record')
      .toEqual({ liveMatchesCache: true, serverCasEqual: true });
  });

  test('a canon command issued after an update is NOT refused as stale (the outbox path)', async () => {
    const id = await saveAndHydrate({ ...TOWN });
    // The store commits its edit locally first, then the outbox writes it.
    const next = { ...store.getState().settlement, population: 2150 };
    store.setState((draft) => {
      draft.settlement = next;
      draft.savedSettlements[0].settlement = next;
    });
    await saves.update(id, { settlement: next });
    const row = cloud.state.rows.find((entry) => String(entry.id) === String(id));
    expect(row.data.population, 'the update reached the row').toBe(2150);
    expect(canonCommandReading(id), 'the cache and the live record adopted the update\'s stamp')
      .toEqual({ liveMatchesCache: true, serverCasEqual: true });
  });

  test('an ack for an OLDER write never lands on a newer edit', async () => {
    const id = await saveAndHydrate({ ...TOWN });
    const written = { ...store.getState().settlement, population: 2150 };
    const newer = { ...written, population: 2300 };
    store.setState((draft) => {
      draft.settlement = newer;
      draft.savedSettlements[0].settlement = newer;
    });
    await saves.update(id, { settlement: written });
    const state = store.getState();
    expect([state.settlement, state.savedSettlements[0].settlement],
      'the newer edit is untouched by the older write\'s ack').toEqual([newer, newer]);
  });

  test('a composer that cannot draw writes NO stamp, the save still lands, and the page reads SILENT', async () => {
    composer.fail = true;
    const id = await saves.save(envelope({ ...TOWN }));
    const row = cloud.state.rows.find((entry) => String(entry.id) === String(id));
    expect([Object.hasOwn(row.data, 'publicProse'), row.data.name],
      'the row is the record, unstamped, and it was written').toEqual([false, 'Ashford']);
    expect(publicProseOf(row.data, 'economy:economics'),
      'an absent projection reads null, which every desk turns into SILENT').toBe(null);
  });

  test('the narrated record is stamped beside the plain one, each from its own record', async () => {
    const aiSettlement = { ...TOWN, name: 'Ashford (narrated)' };
    const id = await saves.save({ ...envelope({ ...TOWN }), aiData: { aiSettlement } });
    const row = cloud.state.rows.find((entry) => String(entry.id) === String(id));
    expect([row.data.publicProse?.v, row.ai_data.aiSettlement.publicProse?.v, row.ai_data.aiSettlement.name],
      'both records carry the projection').toEqual(['pp-1', 'pp-1', 'Ashford (narrated)']);
  });
});
