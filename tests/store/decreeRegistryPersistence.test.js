/**
 * decreeRegistryPersistence.test.js — EM-B3a acceptance cases A1, A2, A4, A5, A6.
 *
 * THE CLAIM: the settlement editor's two persisted keys — `dmLayer` (the DM's
 * layer) and `decrees` (the decree registry) — ride the SAVE BLOB and nothing
 * else. They survive save → reload byte-exact, they are never materialized on a
 * world that has never been edited, empty is DISTINCT from absent, a `null` or a
 * malformed legacy value is carried inert rather than repaired, and the
 * device-local zustand projection mints no key for either of them.
 *
 * ⛔ THE TWO VALUES ARE OPAQUE TO THIS SUITE (EM-B3a §6, chair ruling B3a-2).
 * EM-B2a owns `dmLayer`'s shape and EM-C1 owns a decree's, and NEITHER EXISTS
 * YET — this packet is the travel veil, and it lands FIRST by design (§11's
 * recorded invariant). So every fixture below is planted as an opaque literal
 * and asserted by DEEP EQUALITY plus a JSON byte-compare; not one assertion
 * names a field inside either value, and nothing here imports from
 * `src/domain/edit/**` (which does not exist at this commit — importing it would
 * make this packet depend on its own dependant, and is a STOP).
 *
 * WHY THE FIXTURES STILL CARRY STRUCTURE: an opaque blob that is a bare scalar
 * could not tell a faithful round trip from a normalisation. Each key therefore
 * holds at least one NESTED OBJECT and one ARRAY WHOSE ELEMENT ORDER IS
 * OBSERVABLE, so a re-ordering, a re-keying or a silent clean-up reds here
 * without this suite ever asserting what the real schema will be.
 *
 * Substrate: LOCAL mode (the supabase mock below), so the real
 * `src/lib/saves.js` binds its real localStorage path and every hop is executed
 * rather than stubbed. The blob that `row.data = entry.settlement` (saves.js)
 * sends to the `data` column is, locally, `entry.settlement` inside the
 * `dnd_settlement_saves` array — the same object, one backend down.
 *
 * @enforced-by this test
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';

// Force LOCAL mode: the save service binds localStorage, never a network client.
// `setSessionPersistence` is exported for the auth service that imports this
// module; it is only called on the configured sign-in path, so a no-op is the
// whole contract (the lifecycleRoundTrip idiom).
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: null, isConfigured: false, setSessionPersistence: () => {},
}));

// Map-backed localStorage shim (the lifecycleRoundTrip idiom) — node env, no
// jsdom. Installed at module scope; no imported module reads storage at import
// time, and `partializeStoreState` reads the slot back through this same shim.
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
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { partializeStoreState, PERSIST_KEY } from '../../src/store/persistProjection.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** The local saves substrate's storage key (src/lib/saves.js LOCAL_KEY). */
const SAVES_KEY = 'dnd_settlement_saves';

/** The nine keys `partializeStoreState` projects, frozen here as the executable
 *  form of chair ruling K1: this packet mints NO store-root key, so a tenth entry
 *  (or either editor key appearing among them) is the K1 STOP, not a diff. */
const PERSISTED_STORE_KEYS = Object.freeze([
  'config', 'configExplicitFields',
  'institutionToggles', 'categoryToggles', 'goodsToggles', 'servicesToggles',
  'displayPrefs', 'advanceAutoResolve', 'anonDraft',
]);

/** An OPAQUE dmLayer: one nested object, one order-observable array. Its interior
 *  is EM-B2a's and is never named in an assertion. */
const dmLayerFixture = () => ({
  'root:alpha': { kept: 'one', inner: { ordered: ['gamma', 'alpha', 'beta'] } },
  'root:omega': [{ ref: 'first' }, { ref: 'second' }],
});

/** An OPAQUE decree registry: an ORDERED array of two distinguishable entries.
 *  Their element shape is EM-C1's and is never named in an assertion. */
const decreesFixture = () => ([
  { ref: 'entry-one', payload: { rank: 1, tags: ['aa', 'bb'] } },
  { ref: 'entry-two', payload: { rank: 2, tags: ['bb', 'aa'] } },
]);

/** A world that has never been edited — the ONLY state the tree can be in until
 *  EM-B2a's writer lands. */
const uneditedSettlement = () => ({
  _seed: 12345,
  name: 'Ashford', tier: 'town', population: 1500,
  config: { tradeRouteAccess: 'road', priorityEconomy: 20 },
  institutions: [], npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
  activeConditions: [],
  economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
});

/** The same world after a DM has edited it: both keys, planted opaque. */
const editedSettlement = () => ({
  ...uneditedSettlement(),
  dmLayer: dmLayerFixture(),
  decrees: decreesFixture(),
});

const saveEnvelope = (settlement) => ({
  name: 'Ashford', tier: 'town', settlement, config: { settType: 'town' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  aiData: {}, versionHistory: [],
});

/** The raw persisted array, straight off the device — one backend below `list()`. */
const readRawSaves = () => JSON.parse(globalThis.localStorage.getItem(SAVES_KEY) || '[]');

function expectByteEqual(actual, expected) {
  expect(actual).toEqual(expected);
  expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
}

/** Everything a store write carries EXCEPT the world in the editor. */
const baseStoreState = () => ({
  config: { settType: 'town' },
  configExplicitFields: {},
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  displayPrefs: {},
  advanceAutoResolve: false,
  retiringDraftIdentity: null,
});

beforeEach(() => {
  globalThis.localStorage.clear();
});

describe('EM-B3a — the two editor keys ride the save blob and nothing else', () => {
  test('A1 — save, list, writeAll, list: both keys return byte-exact inside the blob, and the writer mints no sibling column', async () => {
    const planted = editedSettlement();
    await saves.save(saveEnvelope(planted));

    const l1 = await saves.list();
    expect(l1).toHaveLength(1);
    // Both keys come back DEEP-EQUAL to the planted literal, and the JSON compare
    // adds what deep equality cannot see: nested KEY order and array ELEMENT order.
    expectByteEqual(l1[0].settlement.dmLayer, dmLayerFixture());
    expectByteEqual(l1[0].settlement.decrees, decreesFixture());

    // The reload/import hop is a fixpoint: nothing normalises either key away on
    // the second pass either.
    await saves.writeAll(l1);
    const l2 = await saves.list();
    expectByteEqual(l2, l1);

    // THE STATE AUTHORITY, executed: the keys live INSIDE the settlement blob —
    // the object saves.js assigns to `row.data` — and the save ENVELOPE beside it
    // gains nothing. No new column, no new registry row.
    const [raw] = readRawSaves();
    expectByteEqual(raw.settlement.decrees, decreesFixture());
    expectAbsentWithAnchor(
      Object.keys(raw), 'dmLayer', 'settlement',
      'the save envelope keys (the blob carries the layer, the envelope must not)',
    );
    expectAbsentWithAnchor(
      Object.keys(raw), 'decrees', 'settlement',
      'the save envelope keys (the blob carries the registry, the envelope must not)',
    );
  });

  test('A2 — a world that was never edited materializes neither key at any hop', async () => {
    const planted = uneditedSettlement();
    await saves.save(saveEnvelope(planted));

    const l1 = await saves.list();
    await saves.writeAll(l1);
    const l2 = await saves.list();
    expectByteEqual(l2, l1);

    // Anchored on a key the round trip demonstrably DOES carry, so "neither key is
    // present" cannot pass against a settlement that arrived empty.
    expect(l1[0].settlement.name).toBe('Ashford');
    expect(Object.hasOwn(l1[0].settlement, 'dmLayer')).toBe(false);
    expect(Object.hasOwn(l1[0].settlement, 'decrees')).toBe(false);

    // The normalizer is the unconditional arm every load, save and import runs
    // through (HZ-PERSIST-UNGATED): it neither creates nor removes either key.
    const normalized = normalizeSettlement(planted);
    expect(normalized.name).toBe('Ashford');
    expect(Object.hasOwn(normalized, 'dmLayer')).toBe(false);
    expect(Object.hasOwn(normalized, 'decrees')).toBe(false);
  });

  test('A4 — absent, empty and null are three different facts, and a malformed legacy value is carried inert', async () => {
    // (i) EMPTY IS NOT ABSENT. An edit session that staged nothing, or one whose
    // entries were all withdrawn, is a fact about a save the DM opened. The empty
    // containers are spelled with NO inner keys so this case cannot bind to a
    // schema this packet does not own.
    await saves.save(saveEnvelope({ ...uneditedSettlement(), dmLayer: {}, decrees: [] }));
    const [emptied] = await saves.list();
    expect(Object.hasOwn(emptied.settlement, 'decrees')).toBe(true);
    expectByteEqual(emptied.settlement.decrees, []);
    expectByteEqual(emptied.settlement.dmLayer, {});

    // (ii) NULL READS AS ABSENT AT EVERY READER, is never re-emitted as a written
    // value, and throws nowhere. The blob carries it inert, exactly as the landed
    // `fogSessions` arm carries a retired key.
    globalThis.localStorage.clear();
    await saves.save(saveEnvelope({ ...uneditedSettlement(), dmLayer: null, decrees: null }));
    const [nulled] = await saves.list();
    expect(nulled.settlement.dmLayer).toBeNull();
    expect(nulled.settlement.decrees).toBeNull();
    const nulledPublic = toPublicSafe(nulled.settlement);
    const nulledFull = toPublicSafe(nulled.settlement, { full: true });
    expect(nulledPublic.name).toBe('Ashford');
    expect(Object.hasOwn(nulledPublic, 'dmLayer')).toBe(false);
    expect(Object.hasOwn(nulledPublic, 'decrees')).toBe(false);
    expect(nulledFull.name).toBe('Ashford');
    expect(Object.hasOwn(nulledFull, 'dmLayer')).toBe(false);
    expect(Object.hasOwn(nulledFull, 'decrees')).toBe(false);

    // (iii) A MALFORMED LEGACY VALUE is carried inert: never repaired, never
    // deleted, never thrown on. Repair belongs to EM-B4's governed migration.
    globalThis.localStorage.clear();
    await saves.save(saveEnvelope({ ...uneditedSettlement(), decrees: 'nonsense' }));
    const [malformed] = await saves.list();
    expect(malformed.settlement.decrees).toBe('nonsense');
    const malformedFull = toPublicSafe(malformed.settlement, { full: true });
    expect(malformedFull.name).toBe('Ashford');
    expect(Object.hasOwn(malformedFull, 'decrees')).toBe(false);
  });

  test('A5 — a second save and a partial update of an unrelated field leave both values byte-exact', async () => {
    const id = await saves.save(saveEnvelope(editedSettlement()));
    await saves.save(saveEnvelope(editedSettlement()));

    const twice = await saves.list();
    expect(twice).toHaveLength(2);
    // Idempotent in the only sense this packet owns: nothing is re-ordered and no
    // key is normalised away. Asserted by deep equality against the planted
    // literal rather than by naming any interior field (ruling B3a-2).
    expectByteEqual(twice[0].settlement.dmLayer, twice[1].settlement.dmLayer);
    expectByteEqual(twice[0].settlement.decrees, decreesFixture());
    expectByteEqual(twice[1].settlement.decrees, decreesFixture());

    const [beforeUpdate] = (await saves.list()).filter((entry) => String(entry.id) === String(id));
    await saves.update(id, { name: 'Ashford Renamed' });
    const [afterUpdate] = (await saves.list()).filter((entry) => String(entry.id) === String(id));
    expect(afterUpdate.name).toBe('Ashford Renamed');
    expectByteEqual(afterUpdate.settlement, beforeUpdate.settlement);
    expectByteEqual(afterUpdate.settlement.dmLayer, dmLayerFixture());
    expectByteEqual(afterUpdate.settlement.decrees, decreesFixture());
  });
});

describe('EM-B3a — the anonymous-draft envelope is gated, never stripped', () => {
  test('A6 — an account-origin write leaves another tab’s slot untouched, an anon-origin write carries the edited world whole, and the projection mints no key', () => {
    // Another tab's anonymous draft is already in the one device slot.
    const otherTabsWorld = { id: 'set-other-tab', name: 'Redhollow' };
    globalThis.localStorage.setItem(PERSIST_KEY, JSON.stringify({
      state: { anonDraft: { settlement: otherTabsWorld, lastSeed: 'seed-other' } }, version: 2,
    }));

    // (a) AN ACCOUNT-ORIGIN WORLD WRITES NO ENVELOPE FOR ITSELF. The slot is not
    // this tab's to retire, so the projection re-emits what is there — case (c),
    // a re-emit rather than a null — and the edited world reaches storage nowhere.
    const accountBlob = partializeStoreState({
      ...baseStoreState(),
      settlement: editedSettlement(), lastSeed: 'seed-edited',
      draftOrigin: 'account', auth: { user: { id: 'u-1' } },
    });
    expectByteEqual(accountBlob.anonDraft, { settlement: otherTabsWorld, lastSeed: 'seed-other' });
    expect(JSON.stringify(accountBlob).includes('"dmLayer"')).toBe(false);
    expect(JSON.stringify(accountBlob).includes('"decrees"')).toBe(false);

    // (b) AN ANON-ORIGIN WORLD IS WRITTEN WHOLE, both keys included — and that is
    // the point of this case. What keeps an edited world out of the envelope is
    // the GATE (born anonymous, nobody signed in), never a strip: a projection
    // that thinned the world would make a save after a reload write less than a
    // save before it.
    const anonBlob = partializeStoreState({
      ...baseStoreState(),
      settlement: editedSettlement(), lastSeed: 'seed-edited',
      draftOrigin: 'anon', auth: { user: null },
    });
    expectByteEqual(anonBlob.anonDraft.settlement, editedSettlement());

    // (c) AND THE PROJECTION ITSELF MINTS NOTHING (chair ruling K1). Anchored on
    // the envelope key that really is projected, so the two exclusions cannot pass
    // against a projection that returned an empty object.
    expect(Object.keys(anonBlob)).toEqual([...PERSISTED_STORE_KEYS]);
    expectAbsentWithAnchor(
      Object.keys(anonBlob), 'dmLayer', 'anonDraft', 'the device-local persisted key set',
    );
    expectAbsentWithAnchor(
      Object.keys(anonBlob), 'decrees', 'anonDraft', 'the device-local persisted key set',
    );
  });
});
