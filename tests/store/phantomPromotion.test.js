/**
 * phantomPromotion.test.js — EM-F2's promotion acceptance (wave 5; design §2.8 and §13,
 * the charter's EM-F2 row).
 *
 * THE CLAIM. Forging a phantom's seed through the ONE generation action replaces that
 * phantom's minimal record IN PLACE — same save row, same primary key, so every back-link
 * already pointing at it still resolves — and what the estate had WRITTEN onto the
 * phantom carries onto the settlement that takes its place. What arrives is the world
 * that seed names: byte-identical to a settlement forged from it, except the carried
 * history and the identity fields named below.
 *
 * ⭐ PARITY IS ASSERTED AGAINST A FRESH FORGE, NEVER A FIXTURE. Every control here is a
 * second run of the same action over the same seed on its own store, so the arms measure
 * what the pipeline does today rather than what a recorded blob did once. Two forges from
 * one seed are byte-identical including key order — the estate's own promise, and the
 * anchor every parity arm below leans on.
 *
 * ⭐ THE IDENTITY FIELDS, MEASURED AND NAMED (arm C2). A promotion forges with the DM's
 * NAME, because the name is what makes the row the same row: `findSaveByName` resolves a
 * neighbour BY NAME off the save rows, so a promoted settlement that took the generator's
 * own name would silently break the town's written edge. The name is a generation INPUT
 * rather than a label stamped afterwards, so the pipeline's two name-bearing sentences
 * are written around it instead of around a stranger. Measured, the whole difference a
 * name makes is: `name`, `config`, `_config`, `pressureSentence`, `arrivalScene` — and the
 * settlement's own id, population, roster, factions, institutions and history do not move
 * by one byte.
 *
 * ⛔ THE SAVE ROW'S OTHER COLUMNS ARE NOT WRITTEN, AND THAT IS A MEASUREMENT RATHER THAN
 * AN OMISSION. Because the forge is aimed at the phantom's own traits and name, the
 * envelope's `name`, `seed` and `tier` already state the truth after the promotion; the
 * BLOB is the one column that changes. A save's shape is the owner's, and this member
 * widens none of it.
 *
 * Substrate: LOCAL mode (the supabase mock below), so the real save service binds its real
 * localStorage path and every persistence hop is executed rather than stubbed — the idiom
 * EM-B3a established and EM-F1's `phantomSaves.test.js` carried into this wave.
 *
 * @enforced-by this test
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Force LOCAL mode: the save service binds localStorage, never a network client.
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

import { commentsOnly } from '../helpers/codeOnlySource.js';
import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { findSaveByName } from '../../src/domain/relationships/neighbourBackLink.js';
import { mintDmId } from '../../src/domain/edit/dmLayer.js';
import { rollFrom } from '../../src/domain/edit/pools.js';
import {
  PHANTOM_RECORD_KEYS,
  isPhantomRecord,
  isPhantomSave,
  mintPhantom,
} from '../../src/domain/edit/phantoms.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
/** The ONE path a promotion may be written from, named by its file. */
const LANE_REL = 'src/store/settlementGenerateAction.js';
/** The leaf that spells the discriminant, and the shelf that already reads it. */
const LEAF_REL = 'src/domain/edit/phantoms.js';
const SHELF_REL = 'src/components/library/LibraryToolbar.jsx';

/** The estate's own two producers, bound as EM-F1's injected tool bag. */
const TOOLS = Object.freeze({ mintId: mintDmId, roll: rollFrom });

const SEED = 'seed-greymoor-promotion';
const PHANTOM_NAME = 'Greymoor';
const PHANTOM_ROW_ID = 'row-greymoor';
const TOWN_ROW_ID = 'row-ashford';

/**
 * ⛔ EVERY ENVELOPE CARRIES AN EXPLICIT ROW ID, for the reason EM-F1 measured: the local
 * save path falls back to `Date.now()` for a row with no id, so two saves written inside
 * one millisecond take the same primary key and the back-link's self-link guard then
 * refuses the pair. Supplying the id is also what the configured backend does.
 */
const phantomRecord = () => /** @type {Record<string, any>} */ (
  mintPhantom(SEED, PHANTOM_NAME, 0, TOOLS));

/**
 * The generation dials a promotion is aimed at: the wizard's base config with the
 * phantom's three rolled traits and the DM's free name laid over it. Spelled ONCE here and
 * handed to every control store, so a control is the same forge rather than a similar one.
 * The base already carries all four keys, so the spread cannot reorder the config.
 */
const BASE_CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'road',
  monsterThreat: 'civilized',
  customName: '',
});
const promotionDials = (record, { named = true } = {}) => ({
  ...BASE_CONFIG,
  settType: record.traits.size,
  culture: record.traits.culture,
  terrainOverride: record.traits.terrain,
  customName: named ? record.name : '',
});

/** The store the real generation lane is driven on: a live settlement slice over a stub. */
const stubSlice = (config) => () => ({
  auth: { user: { id: 'u-1' }, tier: 'premium', loading: false },
  config,
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true,
  canCustomizePreGeneration: () => true,
  canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

function storeWith(config) {
  const stub = stubSlice(config);
  return create(immer((...a) => ({ ...stub(...a), ...createSettlementSlice(...a) })));
}

/** A decree row of the shape the registry persists — see `commitDecrees` (store/editSlice.js). */
const DECREE = Object.freeze({
  id: 'decree-1', type: 'declare-war', status: 'applied', offStage: true,
  badge: 'PHANTOM', counterparty: PHANTOM_ROW_ID, outcome: null,
});

/**
 * The save ENVELOPE a phantom rides in: the columns the table already has, and no more.
 * The decree rides the BLOB, which is where the registry writes it (`commitDecrees` sets
 * `state.settlement.decrees`, store/editSlice.js) and where the save path persists it.
 */
const phantomEnvelope = () => {
  const record = phantomRecord();
  return {
    id: PHANTOM_ROW_ID,
    name: String(record.name), tier: String(record.traits.size),
    settlement: { ...record, decrees: [DECREE] }, seed: String(record.seed),
    config: null, aiData: {}, versionHistory: [],
  };
};

/** An ordinary saved settlement that names the phantom as its neighbour. */
const townEnvelope = () => ({
  id: TOWN_ROW_ID, name: 'Ashford', tier: 'town', seed: 'seed-ashford',
  settlement: {
    _seed: 'seed-ashford', id: 'set-ashford', name: 'Ashford', tier: 'town',
    npcs: [{ id: 'n-1', name: 'Reeve Mara', role: 'Reeve', category: 'economy' }],
    factions: [],
    neighborRelationship: { name: PHANTOM_NAME, relationshipType: 'trade_partner' },
  },
  config: { settType: 'town' }, aiData: {}, versionHistory: [],
});

/**
 * THE LIBRARY AS THE DM LEFT IT: a phantom row, a town whose save wrote the reciprocal
 * back-link onto it, and one decree recorded against the counterparty. Every hop is the
 * real save service, so what the store hydrates is what a device really holds.
 * @returns {Promise<any[]>} the rows, straight off `saves.list()`
 */
async function seedLibrary() {
  await saves.save(phantomEnvelope());
  await saves.save(townEnvelope());
  return saves.list();
}

/** A store holding that library, ready to promote. */
async function libraryStore(config = BASE_CONFIG) {
  const rows = await seedLibrary();
  const store = storeWith({ ...config });
  store.setState((state) => { state.savedSettlements = rows; });
  return store;
}

/** The keys a promoted record carries beyond the forge — its carried written history. */
const carriedKeysOf = (promoted, control) =>
  Object.keys(promoted).filter((key) => !Object.hasOwn(control, key)).sort();

/** The promoted record with its carried history removed, for a byte compare with the forge. */
const withoutCarried = (promoted, control) => {
  const stripped = { ...promoted };
  for (const key of carriedKeysOf(promoted, control)) delete stripped[key];
  return stripped;
};

/** Every .js/.jsx file under a directory, as repo-relative paths. */
function walkSources(dir) {
  /** @type {string[]} */
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { out.push(...walkSources(full)); continue; }
    if (/\.(js|jsx)$/.test(entry)) out.push(relative(ROOT, full).split('\\').join('/'));
  }
  return out;
}

/** Which of these sources import the phantom leaf at run time (EM-F1's A12 predicate). */
function importersOfLeaf(entries) {
  /** @type {string[]} */
  const importers = [];
  for (const [rel, source] of entries) {
    for (const match of commentsOnly(source).matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) {
      const specifier = match[1];
      if (!specifier.startsWith('.')) continue;
      const resolved = relative(ROOT, resolve(dirname(join(ROOT, rel)), specifier)).split('\\').join('/');
      if (resolved === LEAF_REL) importers.push(rel);
    }
  }
  return importers;
}

/** Assignments that put a settlement blob onto a saved row — the promotion's write shape. */
const rowBlobWrites = (source) =>
  [...commentsOnly(source).matchAll(/(?:row|entry|save|s)\s*\.\s*settlement\s*=/g)].map((hit) => hit[0]);

beforeEach(() => {
  globalThis.localStorage.clear();
});

describe('EM-F2 — promotion replaces the minimal record in place, through the one generation action', () => {
  test('C1: the promoted record is the settlement that seed forges, and the record is fully gone', async () => {
    const record = phantomRecord();
    const store = await libraryStore();
    const promoted = await store.getState().generateSettlement(undefined, { promote: PHANTOM_ROW_ID });

    expect(promoted, 'the promotion forged nothing, so every claim below would be vacuous').toBeTruthy();

    // THE CONTROL: the same action, the same seed, the same dials, on its own store.
    const control = await storeWith(promotionDials(record)).getState().generateSettlement(SEED);
    expect(control, 'the control forge answered nothing').toBeTruthy();

    // PARITY. What is left after the carried history is removed is the control, byte for
    // byte — the JSON compare adds what deep equality cannot see: key order, at every depth.
    const carried = carriedKeysOf(promoted, control);
    expect(JSON.stringify(withoutCarried(promoted, control)),
      'the promoted record is NOT the world its own seed forges. A promotion that drifted from'
      + ' a plain forge would mean the phantom the DM played with and the settlement they were'
      + ' handed are two different worlds')
      .toBe(JSON.stringify(control));

    // THE MINIMAL RECORD IS FULLY REPLACED: the mint's own keys are gone from the blob, so
    // nothing anywhere can still read this row as a phantom.
    expect(isPhantomRecord(promoted), 'the promoted blob still reads as a phantom record').toBe(false);
    const mintOnlyKeys = PHANTOM_RECORD_KEYS.filter((key) => !Object.hasOwn(control, key));
    expect(mintOnlyKeys, 'the mint keys that a forged settlement does NOT carry, or the absence'
      + ' below would be vacuous').toEqual(['kind', 'seed', 'traits']);
    expect(mintOnlyKeys.filter((key) => Object.hasOwn(promoted, key)),
      'a mint key survived onto the promoted record — the replacement was partial, and a partial'
      + ' replacement is a persisted shape with a phantom still inside it').toEqual([]);

    // THE SEED IS THE PHANTOM'S OWN, and it reached the pipeline: the world carries it.
    expect(promoted._seed, 'the forge used another seed than the one the record carries').toBe(SEED);
    expect(store.getState().lastSeed, 'and the lane recorded that seed as the one it forged').toBe(SEED);
  }, 120_000);

  test('C2: the identity fields are the NAME and its own two sentences, and nothing else moves', async () => {
    const record = phantomRecord();
    const store = await libraryStore();
    const promoted = await store.getState().generateSettlement(undefined, { promote: PHANTOM_ROW_ID });
    // The same seed and the same dials, forged WITHOUT the DM's name: the only input that
    // differs is the identity, so every difference measured here is the identity's.
    const unnamed = await storeWith(promotionDials(record, { named: false })).getState().generateSettlement(SEED);

    const carried = carriedKeysOf(promoted, unnamed);
    const moved = Object.keys(unnamed)
      .filter((key) => JSON.stringify(promoted[key]) !== JSON.stringify(unnamed[key])).sort();
    expect(moved, 'THE IDENTITY FIELDS, MEASURED: a promotion carries the DM\'s name into the forge,'
      + ' so the name and the two sentences the pipeline writes around it are the whole difference'
      + ' a name makes. A longer list here is a promotion that changed the WORLD, not its identity')
      .toEqual(['_config', 'arrivalScene', 'config', 'name', 'pressureSentence']);
    expect(promoted.name, 'and the name is the DM\'s own word, not the generator\'s').toBe(PHANTOM_NAME);
    expect(unnamed.name === PHANTOM_NAME,
      'the ANTI-VACUITY control: the generator\'s own name for this seed is NOT the DM\'s, so the'
      + ' line above measures a carry rather than a coincidence').toBe(false);

    // THE WORLD ITSELF IS UNMOVED — stated as facts a reader would notice, so a future change
    // that quietly re-rolled the town under a name carry reds here by name.
    for (const key of ['id', 'tier', 'population', 'npcs', 'factions', 'institutions', 'history', 'powerStructure']) {
      expect(JSON.stringify(promoted[key]), `the promotion moved ${key}, which the seed alone decides`)
        .toBe(JSON.stringify(unnamed[key]));
    }
    expect(carried.length, 'the carried history is not counted among the identity fields; it is arm C3\'s')
      .toBeGreaterThan(0);
  }, 120_000);

  test('C3: the written history carries, and the save path\'s own stamps do not', async () => {
    const record = phantomRecord();
    const store = await libraryStore();
    const before = store.getState().savedSettlements.find((row) => String(row.id) === PHANTOM_ROW_ID);

    // THE ANCHOR: the phantom really is carrying written history before the forge — the
    // back-link the town's save wrote, and a decree recorded against the counterparty.
    expect(before.settlement.neighbourNetwork?.[0]?.id, 'the town\'s reciprocal edge is on the phantom')
      .toBe(TOWN_ROW_ID);
    expect(before.settlement.decrees?.[0]?.id, 'and a decree is recorded against it').toBe(DECREE.id);

    const promoted = await store.getState().generateSettlement(undefined, { promote: PHANTOM_ROW_ID });
    const control = await storeWith(promotionDials(record)).getState().generateSettlement(SEED);

    expect(carriedKeysOf(promoted, control),
      'THE CARRY IS EXACTLY THE WRITTEN HISTORY: what the estate wrote onto the phantom after the'
      + ' mint, and not one key more. The seven containers the save path stamps on every read'
      + ' (activeConditions, aiOverlays, generatorVersion, schemaVersion, simulationTrace,'
      + ' simulationVersion, userCanon) are the FORGE\'s own here, so they can never reach a'
      + ' promoted record — that exclusion is measured by this equality, never denylisted')
      .toEqual(['decrees', 'interSettlementRelationships', 'neighbourNetwork']);
    expect(JSON.stringify(promoted.decrees), 'the decree carried verbatim — promotion does not rewrite'
      + ' the past (design §13)').toBe(JSON.stringify([DECREE]));
    expect(promoted.neighbourNetwork?.[0]?.id, 'and the reciprocal back-link carried with it')
      .toBe(TOWN_ROW_ID);

    // THE STAMPS ARE THE FORGE'S, executed rather than argued: each one is present on the
    // promoted record AND identical to the control's, so none of them was carried.
    const STAMPED_ON_READ = ['activeConditions', 'aiOverlays', 'generatorVersion', 'schemaVersion',
      'simulationTrace', 'simulationVersion', 'userCanon'];
    expect(STAMPED_ON_READ.filter((key) => Object.hasOwn(before.settlement, key)),
      'the save path really does stamp all seven onto a phantom blob, or the arm below is vacuous')
      .toEqual(STAMPED_ON_READ);
    expect(STAMPED_ON_READ.filter((key) => JSON.stringify(promoted[key]) !== JSON.stringify(control[key])),
      'a stamp from the phantom\'s blob overwrote the forge\'s own container').toEqual([]);
  }, 120_000);

  test('C4: the row is replaced IN PLACE — same id, the back-links still resolve, and the device holds it', async () => {
    const store = await libraryStore();
    const rowsBefore = store.getState().savedSettlements.map((row) => String(row.id)).sort();

    const promoted = await store.getState().generateSettlement(undefined, { promote: PHANTOM_ROW_ID });

    const rowsAfter = store.getState().savedSettlements;
    expect(rowsAfter.map((row) => String(row.id)).sort(),
      'the library gained or lost a row: a promotion that inserts and deletes is not IN PLACE, and'
      + ' every edge pointing at the old primary key would be dangling').toEqual(rowsBefore);
    const promotedRow = rowsAfter.find((row) => String(row.id) === PHANTOM_ROW_ID);
    expect(JSON.stringify(promotedRow.settlement), 'the row carries the promoted world itself, not a copy'
      + ' that could drift from the one on screen').toBe(JSON.stringify(promoted));
    expect(isPhantomSave(promotedRow), 'and the row no longer reads as a phantom, so the shelf shows it')
      .toBe(false);

    // THE ENVELOPE'S OWN COLUMNS ALREADY STATE THE TRUTH, so the blob is the one column written.
    expect([promotedRow.name, String(promotedRow.seed), promotedRow.tier],
      'the envelope must agree with the world inside it without a second write')
      .toEqual([PHANTOM_NAME, SEED, promoted.tier]);

    // THE BACK-LINKS STILL RESOLVE — both directions, through the estate's own resolver.
    expect(findSaveByName(rowsAfter, PHANTOM_NAME)?.id,
      'the town\'s written edge names this settlement, and the name resolves to the SAME row it always did')
      .toBe(PHANTOM_ROW_ID);
    const town = rowsAfter.find((row) => String(row.id) === TOWN_ROW_ID);
    expect(town.settlement.neighbourNetwork?.[0]?.id, 'the town\'s own edge still points at that row')
      .toBe(PHANTOM_ROW_ID);
    expect(promotedRow.settlement.neighbourNetwork?.[0]?.id, 'and the reciprocal edge points back')
      .toBe(TOWN_ROW_ID);

    // THE DEVICE, one backend below the cache: a promotion that lived only in session state
    // would be undone by the next hydration, which is the defect class this estate is bitten by.
    const persisted = await saves.list();
    const persistedRow = persisted.find((row) => String(row.id) === PHANTOM_ROW_ID);
    expect(isPhantomSave(persistedRow),
      'the device still holds the minimal record: the next savesService.list() would put the phantom'
      + ' back over the town the DM just forged').toBe(false);
    expect(persistedRow.settlement.name, 'and what it holds is the promoted settlement').toBe(PHANTOM_NAME);
    expect(persistedRow.settlement.population, 'carried whole, not a summary').toBe(promoted.population);
    expect(String(store.getState().activeSaveId),
      'the world on screen is that saved row now, so the active save follows it').toBe(PHANTOM_ROW_ID);
  }, 120_000);

  test('C5: a target that is not a phantom is NEVER overwritten, and neither is an absent one', async () => {
    const store = await libraryStore();
    const townBefore = JSON.stringify(
      store.getState().savedSettlements.find((row) => String(row.id) === TOWN_ROW_ID));

    // A REAL settlement named for promotion: forging a world over it would destroy a town the
    // reader owns, so the resolve fails toward NOT WRITING and this call is an ordinary forge.
    const overTown = await store.getState().generateSettlement('unrelated-seed', { promote: TOWN_ROW_ID });
    expect(overTown, 'the ordinary forge still happened').toBeTruthy();
    expect(JSON.stringify(store.getState().savedSettlements.find((row) => String(row.id) === TOWN_ROW_ID)),
      'A REAL SAVE WAS OVERWRITTEN BY A PROMOTION. This is the costly error the resolve exists to'
      + ' refuse: a town a reader owns, replaced by a world they never asked for').toBe(townBefore);
    expect(overTown._seed, 'and the caller\'s own seed was forged, because no phantom claimed it')
      .toBe('unrelated-seed');
    expect(store.getState().activeSaveId, 'no row was bound, because none was promoted').toBeNull();

    // AN ABSENT ROW: inert in exactly the same way.
    const missing = await store.getState().generateSettlement('unrelated-seed-2', { promote: 'row-nobody' });
    expect(missing, 'the ordinary forge still happened').toBeTruthy();
    expect(store.getState().savedSettlements.map((row) => String(row.id)).sort(),
      'the library is untouched by a promotion that resolved nothing').toEqual([TOWN_ROW_ID, PHANTOM_ROW_ID].sort());
    const stillPhantom = store.getState().savedSettlements.find((row) => String(row.id) === PHANTOM_ROW_ID);
    expect(isPhantomSave(stillPhantom), 'and the phantom is still a phantom').toBe(true);
  }, 120_000);

  test('C6: a promotion forges the phantom\'s seed, never the caller\'s argument', async () => {
    const store = await libraryStore();
    // A caller that hands a stale or mistyped seed alongside the promotion must not be able to
    // mint a DIFFERENT world onto the row and still call it the same settlement.
    const promoted = await store.getState().generateSettlement('a-quite-different-seed', { promote: PHANTOM_ROW_ID });
    expect(promoted._seed, 'the argument won over the record\'s own seed').toBe(SEED);
    const control = await storeWith(promotionDials(phantomRecord())).getState().generateSettlement(SEED);
    expect(promoted.name, 'so the world is the one the phantom names').toBe(control.name);
    expect(promoted.population, 'down to its population').toBe(control.population);
  }, 120_000);
});

describe('EM-F2 — one path: the generation action, and no second writer', () => {
  test('C7: the discriminant has exactly two readers under src, and only the lane writes a row', () => {
    const scanned = walkSources(join(ROOT, 'src')).filter((rel) => rel !== LEAF_REL);
    expect(scanned.length, 'the src walk found nothing, so the roster below would be vacuous')
      .toBeGreaterThan(400);
    const importers = importersOfLeaf(scanned.map((rel) => [rel, readFileSync(join(ROOT, rel), 'utf8')]));
    expect([...importers].sort(),
      'the phantom discriminant is read in EXACTLY two places: the library shelf, which hides a'
      + ' phantom row, and the generation lane, which promotes one. A third reader is a second'
      + ' opinion about what a phantom is; a missing one means a reader was lost')
      .toEqual([SHELF_REL, LANE_REL].sort());

    const shelf = readFileSync(join(ROOT, SHELF_REL), 'utf8');
    expect(shelf.includes('applyLibraryFilters'),
      'the ANCHOR: the shelf source really was read, so the absence below is a fact about it')
      .toBe(true);
    expect(rowBlobWrites(shelf),
      'the shelf writes a saved row\'s blob. It is a pure filter pipeline; a write there would be'
      + ' the second promotion writer this arm exists to refuse').toEqual([]);

    const lane = readFileSync(join(ROOT, LANE_REL), 'utf8');
    expect(rowBlobWrites(lane),
      'the lane holds EXACTLY ONE write of a saved row\'s blob. Two would be two promotions that'
      + ' could disagree — the shape this estate has been bitten by, where a value survives one'
      + ' path and ghosts another').toHaveLength(1);
    expect([...commentsOnly(lane).matchAll(/persistSaveUpdate\(/g)],
      'and exactly one persistence call for it, through the durable outbox chokepoint')
      .toHaveLength(1);

    // GUARD-THE-GUARD, through the SAME predicates: a planted write must convict, and a planted
    // importer must be named. Both probes are SYNTHETIC source strings — no file is written under
    // src — so the pair travels with the arm it defends.
    expect(rowBlobWrites('    if (row) row.settlement = promoted;\n'),
      'a row write must convict, or the count above proves nothing').toHaveLength(1);
    expect(rowBlobWrites('// row.settlement = promoted\n'),
      'while a COMMENTED write is prose, not a writer').toEqual([]);
    const planted = 'src/components/edit/PlantedPromotion.jsx';
    expect(importersOfLeaf([[planted, "import { isPhantomSave } from '../../domain/edit/phantoms.js';\n"]]),
      'and a runtime import of the leaf must convict, naming the file').toEqual([planted]);
  });
});
