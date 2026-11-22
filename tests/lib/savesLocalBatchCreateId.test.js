/**
 * @vitest-environment jsdom
 *
 * savesLocalBatchCreateId.test.js — U53: A LOCAL BATCH CREATE CARRIES ITS ID, OR IS
 * REFUSED.
 *
 * THE CLAIM. `localMutateBatch` is the ONE create path in the save service that mints
 * nothing: `localSaveEntry` falls back to `newLocalSaveId` (U22), `supabaseSave`
 * pre-mints `newSaveId` (U52) or lets the server assign, and `localUpsert` refuses
 * outright. Here `migrateSaveToV2` only reshapes, so an unkeyed create used to land a row
 * with `id: undefined` — and every id compare in the module is `String(entry.id)`, so
 * that row's identity is the literal string "undefined": two of them are ONE row, an
 * update reaches whichever came first, and a delete filters by inequality and takes both.
 * The same data-loss shape U22 cured at the local mint.
 *
 * ⛔ WHY A REFUSAL AND NOT A MINT — MEASURED, not preferred. Every producer of `creates`
 * in the tree supplies an id, and the two that can reach this backend do so explicitly
 * (`importReconciliationCommandTransaction` spreads `id: targets.saveId` LAST;
 * `libraryDeleteHandlers` passes `options.creates || []` through and every caller of that
 * persister passes deletes only). The rollback in `createLibraryBatchPersister` already
 * reads `creates[].id` to build its touched-id set, so the caller's OWN compensation
 * assumes the key is there. A mint here would invent an identity the caller is not
 * holding and cannot roll back; a refusal NAMES the broken precondition where it broke.
 *
 * ⛔ AND THE REFUSAL IS TOTAL, which is the half a "throws" assertion alone would miss.
 * The check runs before the read and before any write, so a refused batch leaves the
 * device exactly as it found it — the same atomicity the Supabase backend gets from its
 * RPC. Arms U53-1 and U53-2 both read the device back after the rejection.
 *
 * ⛔ SUBSTRATE: LOCAL MODE (the supabase mock below), so the real save service binds its
 * real localStorage path and every hop — admission, the v2 migration, the canonical-shape
 * adapter — is executed rather than stubbed.
 *
 * @enforced-by this test
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

/** The save service's own LOCAL_KEY — the device slot one backend below `list()`. */
const LOCAL_KEY = 'dnd_settlement_saves';

/** A save envelope as a batch caller hands it over — `id` supplied by the caller. */
const townEntry = (id, name) => ({
  id,
  name,
  tier: 'town',
  seed: `seed-${name.toLowerCase()}`,
  settlement: {
    _seed: `seed-${name.toLowerCase()}`, id: `set-${name.toLowerCase()}`,
    name, tier: 'town', npcs: [], factions: [], neighbourNetwork: [],
  },
  config: { settType: 'town' },
  aiData: {},
  versionHistory: [],
});

/** The same envelope with the key left off — the precondition this unit pins. */
const unkeyedEntry = (name) => {
  const { id: _dropped, ...rest } = townEntry('unused', name);
  return rest;
};

/** @type {any} */
let saves;

/** What is actually on the device, read raw so the assertion cannot be softened by a
 *  reader that hides a malformed row. */
const deviceRows = () => JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');

beforeEach(async () => {
  localStorage.clear();
  vi.resetModules();
  vi.doMock('../../src/lib/supabase.js', () => ({
    supabase: null, isConfigured: false, setSessionPersistence: () => {},
  }));
  ({ saves } = await import('../../src/lib/saves.js'));
});

afterEach(() => { vi.restoreAllMocks(); });

describe('U53 — the local batch create has a key or no effect', () => {
  test('U53-1: a create with no id is refused by name, and nothing reaches the device', async () => {
    await expect(saves.mutateBatch({ creates: [unkeyedEntry('Ashford')] }),
      'the boundary that holds the precondition names it, rather than writing a row whose'
      + ' identity is the string "undefined"')
      .rejects.toMatchObject({ code: 'batch_create_requires_id' });

    expect(deviceRows(), 'and the device is exactly as it was: no row, keyed or otherwise')
      .toEqual([]);
  });

  test('U53-2: the refusal is the WHOLE batch — a keyed create, an update and a delete beside it all stand down', async () => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify([
      { ...townEntry('row-prior', 'Prior'), savedAt: 10 },
      { ...townEntry('row-doomed', 'Doomed'), savedAt: 20 },
    ]));

    // THE ANCHOR: both planted rows are really on the device and really admitted, so the
    // "nothing moved" below is a statement about the batch rather than about an empty
    // device.
    expect((await saves.list()).map((row) => row.id).sort(),
      'two rows are on the shelf before the batch').toEqual(['row-doomed', 'row-prior']);

    await expect(saves.mutateBatch({
      creates: [townEntry('row-keyed', 'Keyed'), unkeyedEntry('Ashford')],
      updates: [{ id: 'row-prior', name: 'Prior (renamed)' }],
      deletes: ['row-doomed'],
    }), 'one unkeyed create refuses the batch it arrived in')
      .rejects.toMatchObject({ code: 'batch_create_requires_id' });

    // THE MEMBER. The check runs before the read and before the write, so the delete did
    // not happen, the rename did not happen, and the keyed create did not land either —
    // which is the atomicity the Supabase backend gets from its RPC.
    expect(deviceRows().map((row) => [row.id, row.name]),
      'the device is byte-for-byte the library it was: nothing created, renamed or removed')
      .toEqual([['row-prior', 'Prior'], ['row-doomed', 'Doomed']]);
  });

  test('U53-3 CONTROL: a keyed create still lands exactly as it always did, beside its update and its delete', async () => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify([
      { ...townEntry('row-prior', 'Prior'), savedAt: 10 },
      { ...townEntry('row-doomed', 'Doomed'), savedAt: 20 },
    ]));

    await expect(saves.mutateBatch({
      creates: [townEntry('row-keyed', 'Keyed')],
      updates: [{ id: 'row-prior', name: 'Prior (renamed)' }],
      deletes: ['row-doomed'],
    }), 'the batch reports the three mutations it was asked for').resolves.toBe(3);

    expect(deviceRows().map((row) => [row.id, row.name]),
      'the created row is newest-first, the rename landed on the row it named, and the'
      + ' deleted row is gone — this unit refused a broken precondition and changed'
      + ' nothing else')
      .toEqual([['row-keyed', 'Keyed'], ['row-prior', 'Prior (renamed)']]);
  });
});
