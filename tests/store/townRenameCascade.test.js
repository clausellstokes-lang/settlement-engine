/**
 * tests/store/townRenameCascade.test.js — POINT 124, unit K2: THE OLD NAME LEAVES THE STORED SENTENCES (RENAME-BUILD; the
 * measure `docs/chair/2026-11-27/eleventh/rename/build/M3-K2-stored.md`).
 *
 * A born town stores its own name in `arrivalScene`, `pressureSentence` and each crisis's `summary` (`stress` and its
 * `stressors` mirror). The town's rename wrote `name` alone, so every page went on printing the old name there
 * (RENAME-MEASURE (F): 300 / 295 of 300 pages). The rename now rewrites those sentences, by whole word, on every write
 * the one rename action makes:
 *   (a) a SAVED town (`renameSettlementImpl`): the saved row's record, the live record, and the persisted write;
 *   (b) an UNSAVED town (the pending edit's unsaved branch, `settlementPendingEdits.js`);
 *   (c) the saved view's detail copy (`renameDetailSettlement`).
 * On born towns of every size: no stored home holds the old name afterwards, nothing else in the record moved, and a
 * rename back restores the record byte for byte.
 */
import { describe, test, expect, beforeAll, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { renameDetailSettlement } from '../../src/components/settlements/helpers.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const NEW = 'Quillmarsh';
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const HEAVY = 600_000;
/** @param {unknown} v */ const clone = (v) => JSON.parse(JSON.stringify(v));
/** @param {string} name @returns {RegExp} the name as a whole word (the helper's own rule) */
const word = (name) => new RegExp(`(?<![\\p{L}\\p{N}\\p{M}_])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}\\p{M}_])`, 'u');
/** Every stored sentence home of the town's name, as text. @param {any} s @returns {string[]} */
const homes = (s) => [s.arrivalScene, s.pressureSentence,
  ...[].concat(s.stress || []), ...[].concat(s.stressors || [])].map((x) => (typeof x === 'string' ? x : x?.summary)).filter((x) => typeof x === 'string');

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});
const makeStore = () => create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));

/** @type {Array<{ seed: string, rec: any }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) {
    const seed = `town-rename-cascade-${size}-0`;
    births.push({ seed, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
  }
}, HEAVY);

/** A store holding `rec` as the active save (`saved`) or as an unsaved draft. @param {any} rec @param {boolean} saved */
function storeWith(rec, saved) {
  const store = makeStore();
  store.setState((s) => {
    s.settlement = clone(rec);
    s.savedSettlements = saved ? [{ id: 'save-1', name: rec.name, tier: rec.tier, settlement: clone(rec), campaignState: { phase: 'draft', eventLog: [], systemState: {}, editedAt: null }, timestamp: '2020-01-01T00:00:00.000Z' }] : [];
    s.activeSaveId = saved ? 'save-1' : null;
    s.phase = 'draft'; s.eventLog = []; s.systemState = {}; s.editedAt = null;
  });
  return store;
}

/** The record with its homes and name taken out: what the rename must leave as it was. @param {any} s */
const rest = (s) => { const r = clone(s); delete r.name; delete r.arrivalScene; delete r.pressureSentence; delete r.stress; delete r.stressors; return r; };

describe('(a) a saved town: the rename rewrites the stored sentences on the row, the live record and the write', () => {
  test('no home holds the old name; nothing else moved; a rename back restores the record', async () => {
    let homesSeen = 0;
    /** @type {string[]} */ const failures = [];
    // seed-loop: collected — the store's write is awaited, so the helper (synchronous only) cannot hold it: each seed's checks run in a try and push into `failures`, asserted once after the loop
    for (const { seed, rec } of births) try {
      const old = rec.name;
      homesSeen += homes(rec).filter((t) => word(old).test(t)).length;
      const store = storeWith(rec, true);
      vi.mocked(saves.update).mockClear();
      store.getState().renameSettlement('save-1', NEW);
      const row = store.getState().savedSettlements[0].settlement;
      const live = store.getState().settlement;
      for (const s of [row, live]) {
        expect(s.name, seed).toBe(NEW);
        expect(homes(s).filter((t) => word(old).test(t)), `${seed}: a home still holds ${old}`).toEqual([]);
        expect(rest(s), `${seed}: nothing else moved`).toEqual(rest(rec));
      }
      await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
      const written = vi.mocked(saves.update).mock.calls.find((c) => c[0] === 'save-1')?.[1]?.settlement;
      expect(homes(written).filter((t) => word(old).test(t)), `${seed}: the persisted write`).toEqual([]);
      store.getState().renameSettlement('save-1', old);
      expect(JSON.stringify(store.getState().savedSettlements[0].settlement), `${seed}: a rename back`).toBe(JSON.stringify(rec));
    } catch (e) { failures.push(`${seed}: ${String(/** @type {Error} */ (e)?.message ?? e).split('\n')[0]}`); }
    expect(failures, 'the saved town\'s rename on every birth').toEqual([]);
    expect(homesSeen, 'the arm met stored sentences holding the name').toBeGreaterThan(0);
  }, HEAVY);
});

describe('(b) an unsaved town: the pending edit\'s rename rewrites them too', () => {
  test('the live record holds the new name in its homes and nothing else moved', async () => {
    /** @type {string[]} */ const failures = [];
    // seed-loop: collected — the pending edit is awaited, so the helper (synchronous only) cannot hold it: each seed's checks run in a try and push into `failures`, asserted once after the loop
    for (const { seed, rec } of births) try {
      const store = storeWith(rec, false);
      await store.getState().queueEdit('rename-settlement', { newName: NEW });
      await store.getState().commitPendingEdits();
      const live = store.getState().settlement;
      expect(live.name, seed).toBe(NEW);
      expect(homes(live).filter((t) => word(rec.name).test(t)), seed).toEqual([]);
      expect(rest(live), seed).toEqual(rest(rec));
    } catch (e) { failures.push(`${seed}: ${String(/** @type {Error} */ (e)?.message ?? e).split('\n')[0]}`); }
    expect(failures, 'the unsaved town\'s rename on every birth').toEqual([]);
  }, HEAVY);
});

describe('(c) the saved view\'s detail copy says what the store holds', () => {
  test('renameDetailSettlement rewrites the homes of its settlement and its saveData', () => {
    const failures = collectSeedFailures(births, ({ seed, rec }) => {
      const detail = renameDetailSettlement({ settlement: clone(rec), saveData: { name: rec.name, settlement: clone(rec) } }, NEW);
      for (const s of [detail.settlement, detail.saveData.settlement]) {
        expect(s.name, seed).toBe(NEW);
        expect(homes(s).filter((t) => word(rec.name).test(t)), seed).toEqual([]);
      }
    });
    expectNoSeedFailures(failures, 'the detail copy says what the store holds on every birth');
  });
});

describe('(d) the AI narrative follows too (the chair\'s ruling K2-1): the town\'s rename hands it to applyCosmeticRename', () => {
  test('the saved town\'s rename asks the narrative\'s own writer for the old name and the new, once', async () => {
    const { rec } = births[0];
    const store = storeWith(rec, true);
    const cosmetic = vi.fn();
    store.setState((s) => { s.applyCosmeticRename = cosmetic; });
    store.getState().renameSettlement('save-1', NEW);
    expect(cosmetic).toHaveBeenCalledTimes(1);
    // RE-POINTED (the chair's ruling K2-3 (B)): the town's rename names its kind, so the narrative's writer takes the town's rule
    expect(cosmetic).toHaveBeenCalledWith({ saveId: 'save-1', oldName: rec.name, newName: NEW, kind: 'town' });
    // anchored: a rename to the name it already holds asks nothing
    store.getState().renameSettlement('save-1', NEW);
    expect(cosmetic).toHaveBeenCalledTimes(1);
  }, HEAVY);
});
