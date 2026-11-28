/**
 * tests/store/townRenameKeepsEditsAndShields.test.js — POINT 124's cure (the chair's ruling K2-3, on point 124's reader's
 * landing-stopper), through the store's own actions:
 *   (A) THE DM's OWN WORDS. `arrivalScene` and `pressureSentence` are DM-editable (`userEdits.js :: EDITABLE_FIELDS.settlement`).
 *       A home the edits ledger marks edited is NOT rewritten by the town's rename: the field and the ledger's `value` stay as
 *       typed; the ledger's `originalValue` (the engine's sentence) follows the rename, so a revert prints the engine's
 *       sentence under the NEW name. Every edit here is made through the ledger's own writer, `applyUserEdit`.
 *   (B) THE AI NARRATIVE takes the record's cascade rules: whole word, the record's other stored names shield ("Ana Ford",
 *       "Ford Abbey"), nothing rewritten where the old name IS another stored name, and the AI copy's own name fields of
 *       people, houses and powers never touched by a town's rename. The saved `aiData` and the session's copy alike.
 */
import { describe, test, expect, beforeAll, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createAiSlice } from '../../src/store/aiSlice.js';
import { applyUserEdit, revertUserEdit } from '../../src/domain/userEdits.js';
import { substituteWholeWord } from '../../src/lib/narrativeMutations.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const NEW = 'Quillmarsh';
const HEAVY = 600_000;
/** @param {unknown} v */ const clone = (v) => JSON.parse(JSON.stringify(v));

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});
const makeStore = () => create(immer((/** @type {any[]} */ ...a) => ({ ...stubSlice(), .../** @type {any} */ (createSettlementSlice)(...a), .../** @type {any} */ (createAiSlice)(...a) })));
/** The store holding `rec` as the active save, with `aiData` on the row and its narrative in the session. @param {any} rec @param {any} [aiData] */
function storeWith(rec, aiData = null) {
  const store = makeStore();
  store.setState((/** @type {any} */ s) => {
    s.settlement = clone(rec);
    s.savedSettlements = [{ id: 'save-1', name: rec.name, tier: rec.tier, settlement: clone(rec), aiData: aiData ? clone(aiData) : null,
      campaignState: { phase: 'draft', eventLog: [], systemState: {}, editedAt: null }, timestamp: '2020-01-01T00:00:00.000Z' }];
    s.activeSaveId = 'save-1';
    s.phase = 'draft'; s.eventLog = []; s.systemState = {}; s.editedAt = null;
    if (aiData) { s.aiSettlement = clone(aiData.aiSettlement); s.aiDailyLife = clone(aiData.aiDailyLife); }
  });
  return store;
}

describe('(A) a home the DM edited keeps the DM\'s words; its ledger\'s original follows the rename; a revert prints the engine\'s sentence under the new name', () => {
  /** @type {any} */ let born;
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    born = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'village' }), null, { seed: 'town-rename-keeps-edits-10', customContent: {} }); // the first of the series (from 0) whose two homes both name the town (probed), so the anchor below meets an engine sentence on each
  }, HEAVY);

  test('arrivalScene and pressureSentence, each edited through applyUserEdit, the rename, then a revert', () => {
    const old = born.name;
    const rec = clone(born);
    /** @type {Record<string, string>} */ const typed = {};
    /** @type {Record<string, string>} */ const engine = {};
    for (const path of ['arrivalScene', 'pressureSentence']) {
      engine[path] = String(rec[path] || `${old} keeps its own counsel.`);
      if (!rec[path]) rec[path] = engine[path];
      typed[path] = `${old} at dusk, as I wrote it (${path}).`;
      applyUserEdit(rec, path, typed[path]);
    }
    const store = storeWith(rec);
    store.getState().renameSettlement('save-1', NEW);
    for (const where of ['live', 'row']) {
      const s = where === 'live' ? store.getState().settlement : store.getState().savedSettlements[0].settlement;
      expect(s.name, where).toBe(NEW);
      for (const path of ['arrivalScene', 'pressureSentence']) {
        expect(s[path], `${where} ${path}: the DM's words stay as typed`).toBe(typed[path]);
        expect(s._userEdits[path].value, `${where} ${path}: the ledger's value`).toBe(typed[path]);
        expect(s._userEdits[path].originalValue, `${where} ${path}: the ledger's original follows the rename`).toBe(substituteWholeWord(engine[path], old, NEW));
      }
    }
    const reverted = clone(store.getState().settlement);
    for (const path of ['arrivalScene', 'pressureSentence']) {
      revertUserEdit(reverted, path);
      expect(reverted[path], `${path}: the revert`).toBe(substituteWholeWord(engine[path], old, NEW));
      // anchored: the engine's sentence the revert restores held the old name, so the new one stands where it stood
      expect(engine[path], path).toContain(old);
    }
  }, HEAVY);
});

describe('(B) the AI narrative takes the cascade\'s shields and its do-nothing rule; its name fields are never touched', () => {
  const ford = (over = {}) => ({
    id: 's_ford', name: 'Ford', tier: 'village',
    arrivalScene: 'Ford sits where the road meets the river.',
    npcs: [{ id: 'npc_a', name: 'Ana Ford', role: 'abbess' }],
    institutions: [{ name: 'Ford Abbey', category: 'Religious' }],
    powerStructure: { factions: [{ faction: 'Ford Elders', category: 'government', isGoverning: true }], government: 'Ford Elders' },
    ...over,
  });
  const aiData = () => ({
    aiSettlement: {
      name: 'Ford',
      arrivalScene: 'Ford sits by the river; Ana Ford keeps Ford Abbey, and the Ford Elders keep Ford.',
      npcs: [{ name: 'Ana Ford', role: 'Abbess of Ford Abbey', personality: 'She has kept Ford for thirty years.' }],
      institutions: [{ name: 'Ford Abbey', desc: 'The abbey of Ford.' }],
      powerStructure: { factions: [{ faction: 'Ford Elders', desc: 'The elders of Ford.' }] },
    },
    aiDailyLife: { dawn: 'Ford wakes to the abbey bell.' },
  });

  test('the saved aiData and the session\'s copy: the town\'s name moves, every shielded name and every name field stands', async () => {
    const store = storeWith(ford(), aiData());
    store.getState().renameSettlement('save-1', NEW);
    await vi.waitFor(() => expect(store.getState().savedSettlements[0].aiData.aiSettlement.name).toBe(NEW));
    const want = {
      name: NEW,
      arrivalScene: 'Quillmarsh sits by the river; Ana Ford keeps Ford Abbey, and the Ford Elders keep Quillmarsh.',
      npcs: [{ name: 'Ana Ford', role: 'Abbess of Ford Abbey', personality: 'She has kept Quillmarsh for thirty years.' }],
      institutions: [{ name: 'Ford Abbey', desc: 'The abbey of Quillmarsh.' }],
      powerStructure: { factions: [{ faction: 'Ford Elders', desc: 'The elders of Quillmarsh.' }] },
    };
    expect(store.getState().savedSettlements[0].aiData.aiSettlement, 'the saved aiData').toEqual(want);
    expect(store.getState().savedSettlements[0].aiData.aiDailyLife, 'the saved daily life').toEqual({ dawn: 'Quillmarsh wakes to the abbey bell.' });
    expect(store.getState().aiSettlement, 'the session\'s copy').toEqual(want);
    expect(store.getState().aiDailyLife, 'the session\'s daily life').toEqual({ dawn: 'Quillmarsh wakes to the abbey bell.' });
  }, HEAVY);

  test('where the old name IS another stored name (a house called Ford), the AI copy\'s prose is not rewritten: only its own name moves, as the record\'s', async () => {
    const store = storeWith(ford({ institutions: [{ name: 'Ford', category: 'Economy' }] }), aiData());
    store.getState().renameSettlement('save-1', NEW);
    await vi.waitFor(() => expect(store.getState().savedSettlements[0].aiData.aiSettlement.name).toBe(NEW));
    const want = { ...aiData(), aiSettlement: { ...aiData().aiSettlement, name: NEW } };
    expect(store.getState().savedSettlements[0].aiData, 'the saved aiData').toEqual(want);
    expect(store.getState().aiSettlement, 'the session\'s copy').toEqual(want.aiSettlement);
    expect(store.getState().settlement.arrivalScene, 'the record does the same').toBe(ford().arrivalScene);
  }, HEAVY);
});
