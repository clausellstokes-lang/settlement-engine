/**
 * deleteScrub.test.js — EM-F3d's acceptance: A DELETE SCRUBS EVERY EDGE THAT NAMES THE
 * DELETED SAVE (the verifier's STOP-2 of the tests-only day; the chair's judgments 291 and
 * 308; design §2.5a, §13 and §20.3; THE PROMISE).
 *
 * THE DEFECT THESE ARMS CONVICT, measured by the verifier's pass 2a and re-executed in D1
 * below. `removeSavedSettlement` pruned campaign membership and queued intentions and
 * NOTHING ELSE, so a PENDING decree whose off-stage op named a phantom by id outlived its
 * target; EM-F3b's claim walk then re-minted the deleted id at index 0 for the very next
 * counterparty, and `rows.find` and `counterpartyBadgeOf` resolved the DM's decree against
 * Greymoor onto a STRANGER, wearing a PHANTOM badge that said nothing was wrong.
 *
 * THE CURE, AND WHAT THE PREDICATE MEANS. The delete is the one act that knows the id is
 * gone, so it withdraws — in the same act, through EM-C1's own typed verb — every PENDING
 * entry naming the deleted row, with design §20.3's reason `target_deleted`. The entry is
 * KEPT with its original words and its order index (§2.5a: application never deletes an
 * entry) and an APPLIED entry is untouched (THE PROMISE: lived history is immutable). So
 * the stale-edge predicate these arms flip is about a LIVE claim — a PENDING entry whose
 * counterparty resolves to a row that is not the one it was staged against — and never
 * about the withdrawn row's own record of what the DM once ordered.
 *
 * Substrate: LOCAL mode (the supabase mock below) with the estate's REAL store slice and
 * REAL save service, so the mint, the delete and the scrub are every one of them executed
 * rather than stubbed — EM-F3's own idiom, which is what lets these arms read the product's
 * delete rather than a replica of it.
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY — set equalities against
 * `[]`, counts against numbers, one JSON string against another, one boolean against
 * `false` — so no `// anchored:` marker is owed anywhere in this file.
 *
 * @enforced-by this test
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Force LOCAL mode: the save service binds localStorage, never a network client.
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: null, isConfigured: false, setSessionPersistence: () => {},
}));

// Map-backed localStorage shim (EM-F1's own idiom) — node env, no jsdom. Installed at
// module scope; no imported module reads storage at import time.
{
  const data = new Map();
  globalThis.localStorage = {
    getItem: (k) => data.get(String(k)) ?? null,
    setItem: (k, v) => { data.set(String(k), String(v)); },
    removeItem: (k) => { data.delete(String(k)); },
    clear: () => data.clear(),
  };
}

import { saves } from '../../src/lib/saves.js';
import { makeOp, OP_TYPES } from '../../src/domain/edit/operations.js';
import { RESOLUTION_MISSING_KINDS, WITHDRAWN_REASON_KINDS } from '../../src/domain/edit/registry.js';
import { counterpartiesOf, counterpartyBadgeOf, mintPhantomIntent } from '../../src/store/phantomMintAction.js';
import { DELETE_SCRUB_REASONS, selectDecrees, stageDecree } from '../../src/store/editSlice.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const TOWN_SEED = 'seed-ashford';
const SAVE_ID = 'row-ashford';

/** The open settlement the editor is on, and the row the library holds for it. */
const TOWN = Object.freeze({
  _seed: TOWN_SEED, id: 'set-ashford', name: 'Ashford', tier: 'town', npcs: [], factions: [],
});
const townEnvelope = () => ({
  id: SAVE_ID, name: 'Ashford', tier: 'town', seed: TOWN_SEED,
  settlement: { ...TOWN }, config: { settType: 'town' }, aiData: {}, versionHistory: [],
});

/** The base the slice is composed onto — the stub idiom the delete's own lifecycle-2
 *  suite uses, so nothing here is a second store. */
const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
});

async function seatedStore() {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
  const rows = await saves.list();
  store.setState((state) => {
    state.settlement = { ...TOWN };
    state.activeSaveId = SAVE_ID;
    state.lastSeed = TOWN_SEED;
    state.savedSettlements = rows;
    state.savedSettlementsLoaded = true;
    state.savedSettlementsOwnerId = null;
    state.savedSettlementsHydrationGeneration = 0;
  });
  return store;
}

/** The PRODUCT's own mint; it rehydrates the cache from the save service itself. */
async function mint(store, name) {
  return mintPhantomIntent(store.getState, store.setState, { name });
}

/**
 * One off-stage decree, built through the CATALOGUE's own constructor at the row's own
 * declared target kind and staged through EM-C4b's landed action — the product's road, so
 * no arm here depends on a hand-built op.
 */
function stageAgainst(store, entryId, counterparty, type = 'declare-war') {
  const op = makeOp(type, { kind: OP_TYPES[type].target, id: counterparty }, { counterparty });
  return stageDecree(store.getState, store.setState, {
    saveId: SAVE_ID, op, meta: { id: entryId, orderedAt: '2026-09-23T00:00:00.000Z' },
  });
}

/** THE DELETE, through the store's own chokepoint, with its scrub awaited. */
async function storeDelete(store, id) {
  const result = store.getState().removeSavedSettlement(id);
  await result?.scrubbed;
  return result;
}

/** The durable half, so the next mint's claim walk reads a library the row has left. */
async function durableDelete(store, id) {
  await saves.delete(String(id));
  const rows = await saves.list();
  store.setState((state) => { state.savedSettlements = rows; });
}

/** THE VERIFIER'S OWN PREDICATE: a PENDING entry whose counterparty names a LIVE row that
 *  is not the one it was staged against. */
function staleEdgeResolvesToANewRow(store, stagedAgainst) {
  const rows = store.getState().savedSettlements || [];
  return selectDecrees(store.getState()).some((entry) => {
    if (entry.status !== 'pending') return false;
    const named = String(entry.op?.payload?.counterparty ?? '');
    const found = rows.find((row) => String(row.id) === named);
    return found !== undefined && String(found.settlement?.name ?? '') !== stagedAgainst;
  });
}

const statusesOf = (store) => selectDecrees(store.getState()).map((row) => `${row.id}:${row.status}`);

beforeEach(async () => {
  globalThis.localStorage.clear();
  await saves.save(townEnvelope());
});

describe('EM-F3d — a delete scrubs every edge that names the deleted save', () => {
  test('D1: the verifier\'s STOP-2, re-executed end to end — mint, decree, DELETE, re-mint', async () => {
    const store = await seatedStore();
    const greymoor = await mint(store, 'Greymoor');
    const harrowfen = await mint(store, 'Harrowfen');
    expect([greymoor.ok, harrowfen.ok], 'both counterparties were founded').toEqual([true, true]);

    stageAgainst(store, 'd_war', String(greymoor.id));
    expect(counterpartyBadgeOf(store.getState().savedSettlements, selectDecrees(store.getState())[0]),
      'BEFORE the delete the decree names an off-stage counterparty').toBe('PHANTOM');
    expect(counterpartiesOf(store.getState().settlement, store.getState().savedSettlements)
      .filter((row) => String(row.id) === String(greymoor.id)).map((row) => row.name),
      'and the roster holds it once, by its own id').toEqual(['Greymoor']);

    await storeDelete(store, String(greymoor.id));
    await durableDelete(store, String(greymoor.id));

    // THE RE-MINT. EM-F3b's walk makes an id unique across the LIVE rows, so the deleted
    // one is free again and the next counterparty takes it at index 0 — the newcomer
    // mint's own semantics, which judgment 291 kept.
    const later = await mint(store, 'Later-0');
    expect(String(later.id) === String(greymoor.id),
      'the walk re-minted the deleted id, exactly as the verifier measured').toBe(true);

    // ⭐ THE LINE THE VERIFIER'S PROBE PRINTED, IN ITS OWN WORDS.
    expect(`U82 DOES THE STALE EDGE RESOLVE TO A NEW ROW: ${staleEdgeResolvesToANewRow(store, 'Greymoor')}`)
      .toBe('U82 DOES THE STALE EDGE RESOLVE TO A NEW ROW: false');

    // AND THE ENTRY IS STILL THERE, withdrawn with its reason and its original words
    // (design §2.5a; §20.3's absence-is-a-fact is what makes the reason load-bearing).
    const entry = selectDecrees(store.getState())[0];
    expect([entry.id, entry.status, entry.orderIndex], 'kept, withdrawn, in its own place')
      .toEqual(['d_war', 'withdrawn', 0]);
    expect(entry.withdrawnReason, 'design §20.3\'s exact shape, naming the id that went')
      .toEqual({ kind: 'target_deleted', missing: 'target', was: String(greymoor.id) });
    expect(String(entry.op?.payload?.counterparty ?? ''), 'and the DM\'s own words are unedited')
      .toBe(String(greymoor.id));

    // THE ROSTER AND THE BACK-LINKS, MEASURED RATHER THAN ASSUMED: `counterpartiesOf` is
    // derived from the live rows and stores nothing, and the mint writes no relationship
    // state at all — so the surviving roster names the re-minted row under its OWN name
    // and the open record is byte-identical to the one the town was seeded with.
    expect(counterpartiesOf(store.getState().settlement, store.getState().savedSettlements)
      .map((row) => row.name).sort(), 'the roster after the delete and the re-mint')
      .toEqual(['Harrowfen', 'Later-0']);
    const open = store.getState().settlement;
    expect(JSON.stringify({ ...open, decrees: [] }), 'no back-link, neighbour row or world fact moved')
      .toBe(JSON.stringify({ ...TOWN, decrees: [] }));
  });

  test('D2: THE PROMISE — an APPLIED decree that named the deleted row keeps its history, and a pending one against a SURVIVOR is untouched', async () => {
    const store = await seatedStore();
    const greymoor = await mint(store, 'Greymoor');
    const harrowfen = await mint(store, 'Harrowfen');

    stageAgainst(store, 'd_war', String(greymoor.id));
    stageAgainst(store, 'd_trade', String(harrowfen.id), 'open-trade');
    stageAgainst(store, 'd_done', String(greymoor.id), 'open-trade');
    store.setState((state) => {
      state.settlement.decrees = state.settlement.decrees.map((row) => (
        row.id === 'd_done' ? { ...row, status: 'applied', appliedAt: 'then', tickRef: 't1' } : row
      ));
    });

    await storeDelete(store, String(greymoor.id));

    expect(statusesOf(store), 'only the PENDING entry naming the deleted row moved')
      .toEqual(['d_war:withdrawn', 'd_trade:pending', 'd_done:applied']);
    const applied = selectDecrees(store.getState()).find((row) => row.id === 'd_done');
    expect([Object.hasOwn(applied, 'withdrawnReason'), applied.tickRef],
      'lived history is immutable: no reason is written onto it and its tick stands').toEqual([false, 't1']);
  });

  test('D3: a delete with NO edges writes nothing — the record and every survivor come out byte-equal, by copy', async () => {
    const store = await seatedStore();
    const greymoor = await mint(store, 'Greymoor');
    const harrowfen = await mint(store, 'Harrowfen');
    stageAgainst(store, 'd_trade', String(harrowfen.id), 'open-trade');

    // THE GOLDEN, BY COPY: the whole pre-delete state, taken before the act.
    const before = JSON.stringify({
      settlement: store.getState().settlement,
      rows: (store.getState().savedSettlements || []).filter((row) => String(row.id) !== String(greymoor.id)),
    });
    const record = store.getState().settlement;

    await storeDelete(store, String(greymoor.id));

    expect(JSON.stringify({
      settlement: store.getState().settlement,
      rows: store.getState().savedSettlements,
    }), 'a delete nothing names leaves the record and the survivors exactly as they were').toBe(before);
    expect(store.getState().settlement === record,
      'and the open record is not even re-allocated').toBe(true);
    expect(statusesOf(store), 'the decree against the survivor is still pending').toEqual(['d_trade:pending']);
  });

  test('D4: N REGISTRIES WIDE — a member save\'s own registry is scrubbed in the same act as the open one', async () => {
    const store = await seatedStore();
    const greymoor = await mint(store, 'Greymoor');
    stageAgainst(store, 'd_war', String(greymoor.id));

    // A SECOND MEMBER, carrying its own pending decree against the same counterparty.
    // Design §2.5 puts `decrees` on the SAVED SETTLEMENT, so a campaign's registries are N
    // and a binder that was one save wide is the defect EM-E8b's U49 already convicted.
    await saves.save({
      id: 'row-bramford', name: 'Bramford', tier: 'town', seed: 'seed-bramford',
      settlement: {
        _seed: 'seed-bramford', id: 'set-bramford', name: 'Bramford', tier: 'town', npcs: [], factions: [],
        decrees: [{
          id: 'd_far', status: 'pending', addedBy: 'dm', orderIndex: 0, orderedAt: 'then',
          op: makeOp('declare-war', { kind: OP_TYPES['declare-war'].target, id: String(greymoor.id) },
            { counterparty: String(greymoor.id) }),
        }],
      },
      config: null, aiData: {}, versionHistory: [],
    });
    const seeded = await saves.list();
    store.setState((state) => { state.savedSettlements = seeded; });

    await storeDelete(store, String(greymoor.id));

    const member = (store.getState().savedSettlements || []).find((row) => String(row.id) === 'row-bramford');
    expect(member.settlement.decrees.map((row) => `${row.id}:${row.status}`),
      'the member save\'s own registry moved in the same act').toEqual(['d_far:withdrawn']);
    expect(member.settlement.decrees[0].withdrawnReason.kind,
      'with the same one closed reason').toBe(DELETE_SCRUB_REASONS[0]);
    expect(statusesOf(store), 'and so did the open save\'s').toEqual(['d_war:withdrawn']);
  });

  test('D5: COUNTERFORCE — the reason vocabulary is closed, SET-EQUAL in both directions to what the door produced, and every member is reached', async () => {
    const store = await seatedStore();
    const greymoor = await mint(store, 'Greymoor');
    stageAgainst(store, 'd_war', String(greymoor.id));
    stageAgainst(store, 'd_force', String(greymoor.id), 'recall-force');
    await storeDelete(store, String(greymoor.id));

    // THE VOCABULARY, both directions and both sides DERIVED: a reason produced and not
    // declared, or declared and never produced, reds here.
    const produced = [...new Set(selectDecrees(store.getState())
      .map((row) => row.withdrawnReason?.kind).filter(Boolean))].sort();
    const declared = [...DELETE_SCRUB_REASONS].sort();
    expect(produced.length).toBe(DELETE_SCRUB_REASONS.length);
    expect(produced).toEqual(declared);
    expect(produced.filter((reason) => !declared.includes(reason))).toEqual([]);
    expect(declared.filter((reason) => !produced.includes(reason))).toEqual([]);

    // AND THE WORDS ARE EM-C1's OWN, read off the registry's frozen vocabularies rather
    // than re-typed here: a family this door invented would be in neither list.
    expect([
      WITHDRAWN_REASON_KINDS.includes(DELETE_SCRUB_REASONS[0]),
      RESOLUTION_MISSING_KINDS.includes(selectDecrees(store.getState())[0].withdrawnReason.missing),
      Object.isFrozen(DELETE_SCRUB_REASONS),
    ], 'the door widens no vocabulary of its own').toEqual([true, true, true]);
  });
});
