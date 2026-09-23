/**
 * phantomSaves.test.js — EM-F1's persistence and surface acceptance (wave 5; design
 * §2.8 and §13, the chair's judgment 261).
 *
 * THE CLAIM. A phantom is a SAVE: it rides the save blob through the real persistence
 * path and comes back carrying its own five keys byte-exact, the neighbour back-link
 * resolves it exactly as it resolves any other save, and the library shelf never shows
 * it — not under a search for its own name, not with every chip cleared, not under any
 * sort.
 *
 * ⛔ NO COLUMN IS OWED, AND THAT IS MEASURED HERE RATHER THAN ARGUED (judgment 261). The
 * save path assigns the settlement object WHOLE to the `data` column, so the phantom's
 * shape persists inside the blob and the ENVELOPE beside it gains nothing. The envelope
 * keys ARE the columns; an arm below asserts the discriminant is not among them.
 *
 * ⭐ WHY THE WHOLE BLOB IS NOT BYTE-COMPARED, stated rather than quietly avoided: the
 * canonical-shape adapter runs UNCONDITIONALLY on every read (HZ-PERSIST-UNGATED) and
 * stamps its own containers onto EVERY settlement it sees. Those stamps are the save
 * path's, identical for a phantom and a town, and nothing this packet writes. What this
 * suite pins is what the MINT wrote: the five declared keys, byte-exact, through the
 * round trip. The minimality of the WRITE is pinned at the mint, in the domain suite.
 *
 * Substrate: LOCAL mode (the supabase mock below), so the real save service binds its
 * real localStorage path and every hop is executed rather than stubbed — the idiom
 * EM-B3a's landed persistence suite established for exactly this question.
 *
 * @enforced-by this test
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

// Force LOCAL mode: the save service binds localStorage, never a network client.
// `setSessionPersistence` is exported for the auth service that imports this module; it
// is only called on the configured sign-in path, so a no-op is the whole contract.
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: null, isConfigured: false, setSessionPersistence: () => {},
}));

// Map-backed localStorage shim (the lifecycleRoundTrip idiom) — node env, no jsdom.
// Installed at module scope; no imported module reads storage at import time.
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
import { applyLibraryFilters } from '../../src/components/library/LibraryToolbar.jsx';
import { buildNeighbourBackLink, findSaveByName } from '../../src/domain/relationships/neighbourBackLink.js';
import { mintDmId } from '../../src/domain/edit/dmLayer.js';
import { rollFrom } from '../../src/domain/edit/pools.js';
import {
  PHANTOM_RECORD_KEYS,
  isPhantomSave,
  mintPhantom,
} from '../../src/domain/edit/phantoms.js';

/** The local saves substrate's storage key (the save service's own LOCAL_KEY). */
const SAVES_KEY = 'dnd_settlement_saves';

/** The estate's own two producers, bound as the injected tool bag. */
const TOOLS = Object.freeze({ mintId: mintDmId, roll: rollFrom });

/**
 * The three record keys the saves table ALREADY has a column for — the save row's own
 * `id`, `name` and `seed`, as the save service's mutation row writes them. They are named
 * here so the arm below can say which keys are NEW, and it is the new ones whose absence
 * from the envelope is judgment 261's whole question.
 */
const EXISTING_COLUMNS = Object.freeze(['id', 'name', 'seed']);

/** The phantom under test, minted through the real producers. */
const phantom = () => /** @type {Record<string, unknown>} */ (
  mintPhantom('seed-ashford', 'Greymoor', 0, TOOLS));

/**
 * ⛔ EVERY ENVELOPE CARRIES AN EXPLICIT ROW ID, AND THAT IS A MEASURED FIXTURE RULE, not
 * tidiness. The local save path falls back to `Date.now()` for a row with no id of its
 * own, so two saves written inside ONE MILLISECOND take the SAME primary key — and the
 * back-link's own self-link guard then refuses the pair by id equality. Observed as a
 * timing-dependent red on B2 (the phantom row resolved to the town), green on slower
 * runs. Supplying the id is what the real save path does too (the configured backend
 * mints one before insert, because the link embeds it in both rows), so this fixture is
 * the faithful shape rather than a work-around.
 */
const PHANTOM_ROW_ID = 'row-greymoor';
const TOWN_ROW_ID = 'row-ashford';

/** The save ENVELOPE a phantom rides in: the columns the table already has, and no more. */
const phantomEnvelope = () => {
  const record = phantom();
  return {
    id: PHANTOM_ROW_ID,
    name: String(record.name), tier: String(/** @type {Record<string, string>} */ (record.traits).size),
    settlement: record, seed: String(record.seed),
    config: null, aiData: {}, versionHistory: [],
  };
};

/** An ordinary saved settlement, for the control half of every arm. */
const townEnvelope = (neighbourName) => ({
  id: TOWN_ROW_ID, name: 'Ashford', tier: 'town', seed: 'seed-ashford',
  settlement: {
    _seed: 'seed-ashford', id: 'set-ashford', name: 'Ashford', tier: 'town',
    npcs: [{ id: 'n-1', name: 'Reeve Mara', role: 'Reeve', category: 'economy' }],
    factions: [],
    ...(neighbourName ? { neighborRelationship: { name: neighbourName, relationshipType: 'trade_partner' } } : {}),
  },
  config: { settType: 'town' }, aiData: {}, versionHistory: [],
});

/** The raw persisted array, straight off the device — one backend below `list()`. */
const readRawSaves = () => JSON.parse(globalThis.localStorage.getItem(SAVES_KEY) || '[]');

/** Only the keys the mint wrote, so the read boundary's own unconditional stamps are excluded. */
const mintedKeysOf = (blob) => Object.fromEntries(
  PHANTOM_RECORD_KEYS.map((key) => [key, /** @type {Record<string, unknown>} */ (blob)[key]]),
);

beforeEach(() => {
  globalThis.localStorage.clear();
});

describe('EM-F1 — a phantom is a save, and its record rides the blob', () => {
  test('B1: the minted record survives save, list, writeAll and list byte-exact, and the envelope gains no column', async () => {
    await saves.save(phantomEnvelope());

    const first = await saves.list();
    expect(first, 'the round trip returned one row').toHaveLength(1);
    expect(JSON.stringify(mintedKeysOf(first[0].settlement)),
      'every key the mint wrote comes back byte-identical — the JSON compare adds what deep equality'
      + ' cannot see: nested key order and the trait bags own order')
      .toBe(JSON.stringify(mintedKeysOf(phantom())));

    // The reload/import hop is a fixpoint: nothing normalises the record away on a second pass.
    await saves.writeAll(first);
    const second = await saves.list();
    expect(JSON.stringify(second), 'and the second pass is a fixpoint').toBe(JSON.stringify(first));

    // THE STATE AUTHORITY, EXECUTED (judgment 261): the record lives INSIDE the blob — the object
    // the save path assigns to the `data` column — so no column is owed. The envelope keys ARE
    // the columns, and the discriminant is not among them. Anchored on `settlement`, the envelope
    // key the round trip demonstrably DOES carry, so this cannot pass against an empty envelope.
    const [raw] = readRawSaves();
    const envelopeKeys = Object.keys(raw);
    expect(envelopeKeys.includes('settlement'), 'the ANCHOR: the envelope is live and carries its blob').toBe(true);
    const newKeys = PHANTOM_RECORD_KEYS.filter((key) => !EXISTING_COLUMNS.includes(key));
    expect(newKeys, 'the record adds keys the saves table has no column for, or the absence below would'
      + ' be vacuous').toEqual(['kind', 'traits']);
    expect(newKeys.filter((key) => envelopeKeys.includes(key)),
      'and NOT ONE of them has leaked onto the envelope, where it would be exactly the column judgment'
      + ' 261 keeps as the owners keystrokes. They ride the blob instead, which is why no SQL change'
      + ' is owed').toEqual([]);
    expect(String(raw.id) === String(raw.settlement.id),
      'the two identities stay apart: the save row keeps its own primary key and the phantoms'
      + ' dm-namespaced id lives inside the blob').toBe(false);
    expect(JSON.stringify(mintedKeysOf(raw.settlement)),
      'the device slot itself holds the record whole, one backend below list()')
      .toBe(JSON.stringify(mintedKeysOf(phantom())));
  });

  test('B2: the neighbour back-link resolves a phantom EXACTLY as it resolves a save, with no change to the linker', async () => {
    const record = phantom();
    const phantomId = await saves.save(phantomEnvelope());
    const stored = await saves.list();

    // (i) THE LOOKUP. The link finds a partner BY NAME off the save rows, and a phantom row
    // answers that question like any other save because it IS one.
    expect(findSaveByName(stored, 'Greymoor')?.id, 'the phantom resolves by name off the shelf rows')
      .toBe(stored[0].id);

    // (ii) THE LINK ITSELF, computed directly, so the arm reports the linker's own answer.
    const link = buildNeighbourBackLink(
      { id: 'save-ashford', name: 'Ashford', tier: 'town', settlement: townEnvelope('Greymoor').settlement },
      stored,
    );
    expect(link, 'the linker answered a link rather than null — the phantom is a usable partner').not.toBeNull();
    expect(link?.settlement.neighbourNetwork?.[0]?.name, 'the towns own side names the phantom')
      .toBe('Greymoor');
    expect(link?.settlement.neighbourNetwork?.[0]?.relationshipType,
      'carrying the stance on the LINK, which is where this estate keeps a neighbours posture')
      .toBe('trade_partner');
    expect(link?.partner.id, 'and the phantom takes its own reciprocal back-link, as any partner does')
      .toBe(stored[0].id);
    expect(link?.partner.settlement.neighbourNetwork?.[0]?.id, 'pointing back at the town')
      .toBe('save-ashford');

    // (iii) END TO END, through the real save path: saving the town writes both sides.
    await saves.save(townEnvelope('Greymoor'));
    const both = await saves.list();
    const rehydrated = both.find((row) => String(row.id) === String(phantomId));
    expect(rehydrated?.settlement.neighbourNetwork?.[0]?.name,
      'the save path itself wrote the reciprocal row onto the phantom, with no linker change owed')
      .toBe('Ashford');
    expect(JSON.stringify(mintedKeysOf(rehydrated?.settlement)),
      'and the phantoms own record is untouched by the link it now carries')
      .toBe(JSON.stringify(mintedKeysOf(record)));
  });
});

describe('EM-F1 — the shelf never shows a phantom', () => {
  test('B3: the shelf hides the phantom and shows every other save exactly as it does today', async () => {
    await saves.save(phantomEnvelope());
    await saves.save(townEnvelope(null));
    const rows = await saves.list();

    // THE ANCHOR: the phantom really is among the rows handed to the shelf, so its absence from
    // the output below measures HIDING rather than an empty or broken collection.
    expect(rows.map((row) => row.name).sort(), 'both saves are on the input').toEqual(['Ashford', 'Greymoor']);
    expect(rows.filter(isPhantomSave), 'exactly one of them is a phantom').toHaveLength(1);

    expect(applyLibraryFilters(rows, {}).map((row) => row.name),
      'with no query and no chip the shelf shows the town and NOT the phantom').toEqual(['Ashford']);
    expect(applyLibraryFilters(rows, { query: 'greymoor' }).map((row) => row.name),
      'searching the phantoms own name finds nothing — hiding it at the head of the pipeline is what'
      + ' makes "hidden from the shelf" total').toEqual([]);
    expect(applyLibraryFilters(rows, { sort: 'name' }).map((row) => row.name),
      'and no sort floats it back').toEqual(['Ashford']);
    expect(applyLibraryFilters(rows, { sort: 'tier' }).map((row) => row.name),
      'under either sort').toEqual(['Ashford']);
  });

  test('B4: every other save shows exactly as it did before, chip for chip', async () => {
    await saves.save(phantomEnvelope());
    await saves.save(townEnvelope('Greymoor'));
    const rows = await saves.list();
    const town = rows.filter((row) => !isPhantomSave(row));

    // The town's OWN shelf answer is unchanged by the phantom's presence: the same rows come
    // back for every chip whether the phantom is in the input or not. Computed both ways from
    // the same pipeline, so a filter that quietly dropped a real save would red here.
    const chips = [{}, { query: 'ashford' }, { filters: { hasNeighbours: true } },
      { filters: { draftOnly: true } }, { filters: { canonOnly: true } }, { sort: 'attention' }];
    const withPhantom = chips.map((state) => applyLibraryFilters(rows, state).map((row) => row.id));
    const withoutPhantom = chips.map((state) => applyLibraryFilters(town, state).map((row) => row.id));
    expect(withPhantom, 'the shelf answers identically with the phantom present and absent, under every'
      + ' chip — so the hiding removed the phantom and nothing else').toEqual(withoutPhantom);
    expect(withPhantom[0], 'the ANCHOR: the town really does reach the shelf, or the equality above'
      + ' would hold between two empty answers').toEqual([town[0].id]);
    expect(withPhantom[2], 'and its neighbour chip still finds it, through the link the phantom gave it')
      .toEqual([town[0].id]);
  });
});
