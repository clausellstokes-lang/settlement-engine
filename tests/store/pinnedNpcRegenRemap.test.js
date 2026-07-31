/**
 * pinnedNpcRegenRemap.test.js — the PIN half of the roster-reroll id remap.
 *
 * NPC ids are POSITIONAL (`npc_N` = roster slot), so a preserved keeper does not
 * rejoin the roster — it TAKES OVER a fresh slot and inherits that slot's id. Two
 * durable maps are keyed on those ids: `state.locks.npcs` (covered by
 * tests/store/locksEngine.test.js) and the save row's `aiData.pinnedNpcs`, which
 * is the one that crosses a persistence boundary. Only the lock map was ever
 * remapped, so a DM's pin silently transferred to whichever stranger the roll put
 * in the old slot — and rode to Supabase that way.
 *
 * Driven through the STORE against the REAL pipeline, for the same reason the
 * locks lifecycle suite is: the remap runs beside the Immer `set()` that folds the
 * roster in, and the write has to reach the save row AND the network, neither of
 * which a pure-function test can observe.
 *
 * The fixture is JSON round-tripped before use. `factions[].members[]` ARE the
 * `npcs[]` objects in memory; only serialization splits the alias, so an
 * in-memory fixture can hide a reload-only defect in exactly this lane.
 *
 * @enforced-by this test
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// The durable seam: the pin remap fires persistSaveUpdate → saves.update. Stub it
// so the assertions are about WHAT was written, not about the cloud.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

// The reroll mints its seed through generateSeed() (the sanctioned wall-clock
// seam, generateSettlementPipeline.js:416), which would turn the slot-moves
// guard below into a coin flip per run. Pin the mint: under this fixed seed the
// npcs[2] keeper provably moves npc_7 → npc_8 (probe-verified 2026-07-30).
vi.mock('../../src/kernel/prng.js', async (importOriginal) => ({
  ...(await importOriginal()),
  generateSeed: () => 'pins-regen-remap-fixed',
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const SAVE_ID = 'save.pins';
const CFG = { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' };

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { ...CFG },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
  setActivePricingMoment: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(), ...createSettlementSlice(...a) })));
}

/** The reload boundary — the only thing that splits the npcs/members alias. */
const reloaded = (value) => JSON.parse(JSON.stringify(value));

/** The ai_data blob a pinned save actually carries (aiPersistenceEnvelope shape). */
const aiDataWith = (pinnedNpcs) => ({
  aiSettlement: null, aiDailyLife: null, narrativeMode: 'raw',
  chronicle: [{ reason: 'initial' }], pinnedNpcs, eventNarrativeSnapshots: [], dossierNotes: null,
});

/** Every durable write this run made that carried the ai_data column. */
const aiDataWrites = () => saves.update.mock.calls.filter(([, partial]) => partial?.aiData !== undefined);

/** @type {ReturnType<typeof makeStore>} */
let store;

beforeEach(() => {
  vi.clearAllMocks();
  store = makeStore();
});

describe('REGEN — a pin follows its subject through the roster reroll', () => {
  test('a pinned, locked NPC keeps its pin when the reroll moves its id', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const town = reloaded(generateSettlementPipeline(CFG, null, { seed: 'pins-store-regen', customContent: {} }));
    const target = town.npcs[2];
    store.setState({
      settlement: town,
      config: town.config,
      locks: { npcs: [String(target.id)] },
      activeSaveId: SAVE_ID,
      savedSettlements: [{
        id: SAVE_ID, name: town.name, settlement: town,
        aiData: aiDataWith([String(target.id)]),
      }],
    });

    await store.getState().regenSection('npcs');

    const after = store.getState();
    const survivor = after.settlement.npcs.find(n => String(n.name) === String(target.name));
    expect(survivor, 'the locked character survived the reroll').toBeTruthy();
    // NON-VACUITY GUARD: the defect only exists when the keeper inherits a
    // DIFFERENT slot id. If a future seed stops moving it, every assertion below
    // would hold with the remap deleted — so pin the move itself first.
    expect(String(survivor.id), 'the keeper must inherit a different slot id')
      .not.toBe(String(target.id));

    const row = after.savedSettlements.find(s => s.id === SAVE_ID);
    expect(row.aiData.pinnedNpcs).toEqual([String(survivor.id)]);
    // The two id-keyed maps are folded in one step and must never disagree.
    expect(after.locks.npcs).toEqual([String(survivor.id)]);
    // A pin is save-row state: an in-memory-only rewrite ghosts on reload.
    const writes = aiDataWrites();
    expect(writes).toHaveLength(1);
    expect(writes[0][0]).toBe(SAVE_ID);
    expect(writes[0][1].aiData.pinnedNpcs).toEqual([String(survivor.id)]);
    // Sibling durable collections ride along untouched — the remap rewrites one key.
    expect(writes[0][1].aiData.chronicle).toEqual([{ reason: 'initial' }]);
    // The report is a TRACE. In the blob it would persist, export and diff forever.
    expect(after.settlement._preservation).toBeUndefined();
  }, 90_000);

  test('an unmoved pin is left alone and writes no ai_data at all', async () => {
    // The dormancy half. With nothing locked the reroll preserves nobody, so the
    // report moves no id — and a remap that wrote anyway would burn a cloud write
    // (and a fresh outbox op) on every single reroll.
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const town = reloaded(generateSettlementPipeline(CFG, null, { seed: 'pins-store-dormant', customContent: {} }));
    store.setState({
      settlement: town,
      config: town.config,
      activeSaveId: SAVE_ID,
      savedSettlements: [{
        id: SAVE_ID, name: town.name, settlement: town,
        aiData: aiDataWith(['npc_does_not_exist']),
      }],
    });

    await store.getState().regenSection('npcs');

    const row = store.getState().savedSettlements.find(s => s.id === SAVE_ID);
    expect(row.aiData.pinnedNpcs).toEqual(['npc_does_not_exist']);
    expect(aiDataWrites()).toHaveLength(0);
    // The reroll's own settlement write still happened — this is a dormant pin
    // remap, not a dormant regenerate.
    expect(saves.update.mock.calls.some(([, p]) => p?.settlement !== undefined)).toBe(true);
  }, 90_000);

  test('a DRAFT reroll (no active save) touches no pin and does not throw', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const town = reloaded(generateSettlementPipeline(CFG, null, { seed: 'pins-store-draft', customContent: {} }));
    const target = town.npcs[2];
    store.setState({
      settlement: town,
      config: town.config,
      locks: { npcs: [String(target.id)] },
      activeSaveId: null,
      // A pinned row for a save that is NOT the one on screen. Pins are per-save;
      // rerolling a draft must never reach into another save's blob.
      savedSettlements: [{ id: 'save.other', aiData: aiDataWith([String(target.id)]) }],
    });

    await store.getState().regenSection('npcs');

    const other = store.getState().savedSettlements.find(s => s.id === 'save.other');
    expect(other.aiData.pinnedNpcs).toEqual([String(target.id)]);
    expect(saves.update).not.toHaveBeenCalled();
  }, 90_000);
});
