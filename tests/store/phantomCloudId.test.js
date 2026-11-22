/**
 * phantomCloudId.test.js — EM-F3c's acceptance: A PHANTOM MINTED ON THE CLOUD KEEPS ONE ID,
 * THE ONE THE FORGE AND EVERY EDGE USE (U83; design §2.8 and §13).
 *
 * THE DEFECT THESE ARMS CONVICT, MEASURED ON THIS SUBSTRATE BEFORE A LINE MOVED.
 * `lib/saves.js :: supabaseSave` builds its insert row WITHOUT the caller's `id` and hands back
 * the server's key from `.insert(row).select('id')`; `store/phantomMintAction.js` DISCARDED that
 * answer and replied with the record's own minted id instead. So one phantom wore two keys:
 *   the door's receipt   dm:phantom:cc10087a2941646e
 *   the library's row    00000000-0000-4000-8000-000000000002
 * and `saves.find(r => r.id === answer.id)` — the Forge control's `promote`, the detail route,
 * `update`, `delete` — matched ZERO rows. The same gap collapsed EM-F3b's claim walk: the
 * claimed set holds the ROWS' keys, a minted `dm:phantom:` id is never among them, so the walk
 * never advanced and BOTH counterparties of one town came back on index 0 with one seed
 * (dm:phantom:2d4ca77109c152fc) and one trait set between them. THE PROMISE is that a seed is a
 * starting world forever; two counterparties that forge the same world is that promise broken.
 *
 * THE CURE, AND WHY IT IS CLIENT-SIDE RATHER THAN A KEY PASSED THROUGH. The table's primary key
 * is `id uuid primary key default gen_random_uuid()` (supabase/migrations/001_initial_schema.sql),
 * never retyped by a later migration, and the batch RPC casts a caller's key with
 * `(item->>'id')::uuid` (179_owner_confirmed_privacy_deletes.sql) — so the column accepts a
 * CLIENT key, but only a UUID one, while a DM id is `dm:phantom:<16 hex>` by contract
 * (src/domain/edit/dmLayer.js). Re-typing that column is a MIGRATION and the owner's, so the
 * record takes the row's key instead, and the walk reads the seed the record carries either way.
 *
 * SUBSTRATE: the CLOUD backend, mocked at `src/lib/supabase.js` — the estate's own
 * `tests/lib/savesSaveOwnerRace.test.js` idiom (vi.mock with `isConfigured: true`, a fake
 * `from()` builder and a fake `auth.getUser`), widened here into a small in-memory `settlements`
 * table so `save`, `update`, `delete` and `list` are all EXECUTED against one row set. No live
 * Supabase call is made and no credential is read. The table MODELS the measured column: a
 * caller's key that is not UUID-shaped is refused with Postgres's own 22P02, so a later lane
 * cannot quietly "pass the minted id through" without the owner's migration.
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY — set equalities against arrays,
 * counts against numbers, one boolean against `false` — so no `// anchored:` marker is owed
 * anywhere in this file.
 *
 * @enforced-by this test
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * THE MOCKED CLOUD BACKEND. One `settlements` table in memory, keyed exactly as the migration
 * keys it, plus the two accounting lists the arms read (`inserts`, `rpcCalls`).
 */
const cloud = vi.hoisted(() => {
  /** The shape `gen_random_uuid()` produces, and the only one the `uuid` column can hold. */
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  const state = { rows: [], next: 0, clock: 0, inserts: [], rpcCalls: [] };
  const serverKey = () => {
    state.next += 1;
    return `00000000-0000-4000-8000-${String(state.next).padStart(12, '0')}`;
  };
  // A monotonic stamp, so `updated_at` ordering is deterministic rather than clock-resolution
  // dependent — the ordering `supabaseList` asks the server for.
  const stamp = () => {
    state.clock += 1000;
    return new Date(1700000000000 + state.clock).toISOString();
  };
  const matches = (row, filters) => filters.every(([col, value]) => String(row[col]) === String(value));
  function run(q) {
    if (q.op === 'insert' || q.op === 'upsert') {
      const payload = q.payload;
      state.inserts.push(payload);
      if (payload.id !== undefined && !UUID.test(String(payload.id))) {
        // The column is `uuid`; PostgREST hands the literal to Postgres and the cast fails.
        return {
          data: null,
          error: { code: '22P02', message: `invalid input syntax for type uuid: "${payload.id}"` },
        };
      }
      const existing = payload.id != null
        ? state.rows.find((row) => String(row.id) === String(payload.id))
        : null;
      if (existing && q.op === 'upsert') {
        Object.assign(existing, payload, { updated_at: stamp() });
        return { data: { id: existing.id }, error: null };
      }
      const id = payload.id != null ? String(payload.id) : serverKey();
      state.rows.push({
        access_state: 'active',
        created_at: stamp(),
        ...payload,
        id,
        updated_at: stamp(),
      });
      return { data: { id }, error: null };
    }
    if (q.op === 'update') {
      const hit = state.rows.filter((row) => matches(row, q.filters));
      hit.forEach((row) => Object.assign(row, q.payload, { updated_at: stamp() }));
      return { data: hit.map((row) => ({ id: row.id })), error: null };
    }
    if (q.op === 'delete') {
      const hit = state.rows.filter((row) => matches(row, q.filters));
      state.rows = state.rows.filter((row) => !matches(row, q.filters));
      return { data: hit.map((row) => ({ id: row.id })), error: null };
    }
    const found = state.rows
      .filter((row) => matches(row, q.filters))
      .sort((left, right) => String(right.updated_at).localeCompare(String(left.updated_at)));
    if (q.single) return { data: found.length === 0 ? null : found[0], error: null };
    return { data: found, error: null };
  }
  /** The PostgREST builder, as thin as the calls in `saves.js` need it to be. */
  function table() {
    const q = { op: null, payload: null, filters: [], single: false };
    const builder = {
      select() { if (q.op === null) q.op = 'select'; return builder; },
      insert(row) { q.op = 'insert'; q.payload = row; return builder; },
      upsert(row) { q.op = 'upsert'; q.payload = row; return builder; },
      update(patch) { q.op = 'update'; q.payload = patch; return builder; },
      delete() { q.op = 'delete'; return builder; },
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
      rpc: (name) => {
        state.rpcCalls.push(String(name));
        return Promise.resolve({ data: 0, error: null });
      },
    },
    reset() {
      state.rows = []; state.next = 0; state.clock = 0; state.inserts = []; state.rpcCalls = [];
    },
  };
});

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: cloud.client, isConfigured: true, setSessionPersistence: () => {},
}));

import { saves } from '../../src/lib/saves.js';
import { mintDmId } from '../../src/domain/edit/dmLayer.js';
import { PHANTOM_KIND, PHANTOM_RECORD_KEYS, isPhantomSave } from '../../src/domain/edit/phantoms.js';
import { counterpartiesOf, mintPhantomIntent } from '../../src/store/phantomMintAction.js';

const TOWN_SEED = 'seed-ashford';

/** The open settlement the editor is on, and the row the library holds for it. */
const TOWN = Object.freeze({
  _seed: TOWN_SEED, id: 'set-ashford', name: 'Ashford', tier: 'town', npcs: [], factions: [],
});
const townEnvelope = () => ({
  name: 'Ashford', tier: 'town', seed: TOWN_SEED, settlement: { ...TOWN },
  config: { settType: 'town' }, aiData: {}, versionHistory: [],
});

/** The store as one session, and the two handles the binder is given. */
let storeState = {};
const get = () => storeState;
const set = (recipe) => { recipe(storeState); };

function seatStore(extra = {}) {
  storeState = {
    lastSeed: TOWN_SEED,
    settlement: TOWN,
    savedSettlements: [],
    savedSettlementsLoaded: true,
    savedSettlementsOwnerId: null,
    savedSettlementsHydrationGeneration: 0,
    ...extra,
  };
}

/** EM-F2's landed promotion, applied to the row: the blob is REPLACED IN PLACE, same key. */
const forge = (name) => ({
  _seed: `forged-${name}`, id: `set-${name}`, name, tier: 'village', npcs: [], factions: [],
});
async function promote(id, name) {
  await saves.update(String(id), { settlement: forge(name) });
  storeState.savedSettlements = await saves.list();
}

async function mint(name) {
  const answer = await mintPhantomIntent(get, set, { name });
  storeState.savedSettlements = await saves.list();
  return answer;
}

/**
 * EM-F2's own lookup, verbatim from `settlementGenerateAction.js`: the Forge control passes a
 * `promote` id and the forge resolves it against the library it holds.
 */
const forgeLookup = (rows, promoteId) => rows
  .filter((row) => String(row?.id) === String(promoteId) && isPhantomSave(row));

const seedsOf = (rows) => rows.filter(isPhantomSave).map((row) => String(row.settlement.seed));

beforeEach(async () => {
  cloud.reset();
  seatStore();
  await saves.save(townEnvelope());
  storeState.savedSettlements = await saves.list();
});

describe('EM-F3c — a phantom minted on the cloud keeps one id', () => {
  test('C1: the door answers with the key the library gave the row, and the record inside it carries that same key', async () => {
    const answer = await mint('Greymoor');
    expect(answer.ok, 'the counterparty was founded').toBe(true);

    const rows = await saves.list();
    const phantom = rows.filter(isPhantomSave);
    expect(phantom.length, 'the library holds exactly one counterparty').toBe(1);
    // THE THREE READINGS OF ONE FACT, ASSERTED AS ONE SET. The receipt, the row's primary key
    // and the record's own id inside the blob are the same string — which is the whole of U83.
    expect(new Set([
      String(answer.id), String(phantom[0].id), String(phantom[0].settlement.id),
    ]).size, 'the receipt, the row and the record are one key').toBe(1);
    // AND IT IS THE BACKEND'S KEY, not a client mint: the server assigned it.
    expect(String(answer.id), 'and the key is the one the table minted')
      .toBe('00000000-0000-4000-8000-000000000002');
  });

  test('C2: the Forge finds the row by the key the door answered with, once, and the roster passes that same key', async () => {
    const answer = await mint('Greymoor');
    const rows = await saves.list();

    // (i) THE FORGE'S OWN LOOKUP. `settlementGenerateAction.js` resolves `options.promote`
    // against `state.savedSettlements` by id and requires the row to be a phantom save.
    expect(forgeLookup(rows, answer.id).map((row) => String(row.settlement.name)),
      'the promotion reaches the counterparty the door just founded, and reaches it once')
      .toEqual(['Greymoor']);

    // (ii) THE EDGE THE SHELL ACTUALLY PASSES. `EditModeShell` hands the Forge button
    // `row.id` off `counterpartiesOf`, so the roster's key and the receipt must be the same
    // string or the two doors disagree about what was founded.
    expect(counterpartiesOf(TOWN, rows).map((row) => `${row.name}:${row.id}:${row.offStage}`),
      'the roster names the counterparty off-stage under the key the receipt gave')
      .toEqual([`Greymoor:${String(answer.id)}:true`]);

    // (iii) AND THE PROMOTION LANDS. The row is forged in place, keeps its key, and stops
    // reading as a phantom — EM-F2's act, reached through EM-F3c's key.
    await promote(answer.id, 'Greymoor');
    const after = await saves.list();
    expect(after.filter((row) => String(row.id) === String(answer.id))
      .map((row) => `${row.settlement.name}:${isPhantomSave(row)}`),
    'the forged town is reached by the same key, once, and is no longer a five-key stub')
      .toEqual(['Greymoor:false']);
  });

  test('C3: the mint index advances on the cloud — two counterparties of one town are two worlds, not one name apart', async () => {
    const first = await mint('Greymoor');
    const second = await mint('Harrowfen');
    const rows = await saves.list();

    expect(String(first.id) === String(second.id),
      'the two counterparties share a primary key').toBe(false);
    // THE SEED IS THE WORLD. Two phantoms on one index carry one seed and one trait set, so the
    // DM's second counterparty forges the first one's town under a different name.
    expect(new Set(seedsOf(rows)).size, 'the two counterparties carry two seeds').toBe(2);
    expect([...seedsOf(rows)].sort(),
      'and the seeds are the ones indices 0 and 1 derive from the town\'s own seed')
      .toEqual([0, 1].map((n) => mintDmId(TOWN_SEED, PHANTOM_KIND, n)).sort());

    // A THIRD TAKES THE THIRD INDEX, so the walk is advancing rather than merely differing.
    await mint('Stonebrook');
    expect(new Set(seedsOf(await saves.list())),
      'three counterparties of one town take indices 0, 1 and 2')
      .toEqual(new Set([0, 1, 2].map((n) => mintDmId(TOWN_SEED, PHANTOM_KIND, n))));
  });

  test('C4: a PROMOTED counterparty still claims its index, so the next mint founds a new world rather than the forged one again', async () => {
    const first = await mint('Greymoor');
    const firstSeed = seedsOf(await saves.list())[0];
    await promote(first.id, 'Greymoor');
    expect((await saves.list()).filter(isPhantomSave).length,
      'the library holds no phantom at all: the count the old index read has gone to zero').toBe(0);

    const second = await mint('Harrowfen');
    const rows = await saves.list();
    expect(String(second.id) === String(first.id),
      'the second mint took the forged town\'s primary key').toBe(false);
    expect(seedsOf(rows).filter((seed) => seed === firstSeed),
      'and it did not re-found the world the DM has already forged').toEqual([]);
    expect(new Set(rows.map((row) => String(row.id))).size,
      'every library row carries a distinct primary key').toBe(rows.length);
    expect(rows.length, 'the town, the forged world and the new counterparty').toBe(3);
  });

  test('C5: ONE act, ONE row, and the persisted record is the frozen five keys the mint made', async () => {
    const before = cloud.state.rows.length;
    const answer = await mint('Greymoor');

    expect(cloud.state.rows.length - before, 'the act added exactly one row to the table').toBe(1);
    expect(cloud.state.rpcCalls, 'and reached no batch RPC, no second table and no second row')
      .toEqual([]);

    // THE PERSISTED SHAPE, READ OFF THE TABLE rather than off the re-hydrated library, so the
    // normalizer cannot stand in for it. The five keys, in the frozen order, and nothing else.
    expect(cloud.state.rows.filter((row) => String(row.id) === String(answer.id)).length,
      'the row the act added is the one the receipt names').toBe(1);
    const stored = cloud.state.rows.find((row) => String(row.id) === String(answer.id));
    expect(Object.keys(stored.data), 'the record persists as EM-F1\'s five keys, in order')
      .toEqual([...PHANTOM_RECORD_KEYS]);
    expect([stored.data.kind, stored.data.name, String(stored.data.seed)],
      'and only its id was reconciled: the kind, the free name and the seed are the mint\'s')
      .toEqual([PHANTOM_KIND, 'Greymoor', mintDmId(TOWN_SEED, PHANTOM_KIND, 0)]);
    expect(Object.keys(stored.data.traits).sort(),
      'the rolled traits are on the record, untouched by the reconciliation')
      .toEqual(['culture', 'size', 'terrain']);
    // THE ENVELOPE'S COLUMNS ARE THE ONES THE TABLE ALREADY HAD (judgment 261) — no new column
    // is written and the seed column carries the record's own seed, which is what lets the next
    // mint's walk read the index off a row whatever key the backend chose.
    expect(String(stored.seed), 'the seed column carries the record\'s seed')
      .toBe(mintDmId(TOWN_SEED, PHANTOM_KIND, 0));
  });

  test('C6: the table mints the key and a DM id is not one — the measurement this cure is built on, pinned', async () => {
    // (i) THE INSERT CARRIES NO `id`. `supabaseSave`'s row is the columns and the owner, and the
    // key comes back from `.select('id')` — which is why the door must read the answer.
    const answer = await mint('Greymoor');
    expect(cloud.state.inserts.map((row) => Object.hasOwn(row, 'id')),
      'neither the town nor the counterparty offered the table a key').toEqual([false, false]);
    expect(String(answer.id).startsWith('00000000-0000-4000-8000-'),
      'and both rows wear a key the table minted').toBe(true);

    // (ii) A CALLER'S KEY IS DISCARDED BY THE CLOUD ENTRY PATH, silently — which is the
    // measurement the whole cure rests on. An envelope handed an explicit id still lands under
    // the table's own key, so a door that answered with its own mint answered with a string the
    // library does not use.
    const dmId = mintDmId(TOWN_SEED, PHANTOM_KIND, 9);
    const carried = await saves.save({ ...townEnvelope(), id: dmId, name: 'Impostor' });
    expect([String(carried) === dmId, cloud.state.inserts.at(-1).id],
      'the caller\'s key never reached the table and never became the row\'s')
      .toEqual([false, undefined]);

    // (iii) AND IT COULD NOT HAVE. The column is `uuid`, so the literal a DM id would supply is
    // Postgres's 22P02 — which is why "pass the minted id through" is a MIGRATION, the owner's
    // and never a lane's. Asserted against the table itself, so the model this suite runs on is
    // the one the migration describes.
    const refused = await cloud.client.from('settlements')
      .insert({ id: dmId, user_id: 'owner-1', name: 'Impostor', tier: 'town', data: { name: 'x' } })
      .select('id').single();
    expect([dmId.startsWith('dm:phantom:'), String(refused.error?.code)],
      'a DM id is not a uuid, and the uuid column says so by its own code')
      .toEqual([true, '22P02']);
  });
});
