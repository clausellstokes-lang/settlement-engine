/**
 * rederiveGuard.test.js — GUARD (CLOSE-7; the chair's ruling R24j): A STORED PLACE IS RE-DERIVED ONLY BY
 * THE ENGINE THAT BORE IT. For any other place a decree's newcomer is appended and nothing else moves.
 *
 * THE CLAIMS, each red on the cut (e2fd7caa4) and green with the unit:
 *  G1 (R24j 1) the version goes up with this release: `GENERATOR_VERSION` is '0.10.0', and the legacy
 *     stamp is a NAMED constant, '0.9.0'.
 *  G2 (R24j 2) a birth stamps the engine; a load never does. A record that reaches `normalizeSettlement`
 *     with no `generatorVersion` is given the LEGACY value, never the current one; a stamp it carries is
 *     kept.
 *  G3 (R24j 3) the seam: a place another engine bore takes ONE decree's newcomer by APPEND. The engine is
 *     not run, the receipt says `rederived: false`, the newcomer is on the roster ONCE (the row the
 *     re-derivation would have appended: `{ id, name, role }`), the layer is written, both homes carry one
 *     record, and nothing else on the record moves (by bytes, `npcs`, `dmLayer` and `decrees` set apart).
 *  G4 (R24j 5(c)) a place THIS engine bore still re-derives (the feature stays on for new places).
 *  G5 (R24j 4) a world-fact root on another engine's place is NOT honoured: it comes back in `unapplied`
 *     with the closed reason `engine_mismatch`, and the record's config is untouched.
 *  G6 (R24j 5(d)) the next release, simulated: the constant moved once more in a test double, a place
 *     born today takes the appended path.
 * The U111 fault (a newcomer appended twice) stays red-first in its own test (`newcomerOnce.test.js`).
 *
 * ⛔ NOTHING HERE IS A MOCK OF THE MECHANISM: the world is the real pipeline's, the tick is EM-E1's real
 * hook, the decree is staged by the store's own door, and the lane is the real one, observed (not
 * replaced) so a run of the engine can be counted.
 *
 * @enforced-by this test
 */

import { describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

// The real lane, OBSERVED: every call reaches the real `regenerateWithLayer`, and the count is the
// receipt that the engine was (or was not) asked to run.
const laneCalls = vi.hoisted(() => ({ n: 0 }));
vi.mock('../../src/store/settlementRederiveAction.js', async (importOriginal) => {
  const real = await importOriginal();
  return {
    ...real,
    regenerateWithLayer: (...args) => { laneCalls.n += 1; return real.regenerateWithLayer(...args); },
  };
});

import { poolValues } from '../../src/domain/edit/pools.js';
import { REDERIVE_UNAPPLIED_REASONS } from '../../src/domain/edit/dmLayer.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import * as schema from '../../src/domain/settlement.schema.js';
import { applyDecreesToSaves } from '../../src/domain/worldPulse/decreeHook.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import {
  addOpPayloadFor, applyRosterDecreesAtTick, selectDecrees, stageAddDecreeIntent,
} from '../../src/store/editSlice.js';

const { GENERATOR_VERSION } = schema;
const LEGACY = /** @type {{ LEGACY_GENERATOR_VERSION?: string }} */ (schema).LEGACY_GENERATOR_VERSION;
const SAVE_ID = 'save-guard';
const SEED = 'golden-master-v3';
const NOW = '2026-11-25T12:00:00.000Z';
const TICK_REF = 'world_pulse.campaign-guard.1';
const CONFIG = Object.freeze({ settType: 'thorp', culture: 'germanic', terrain: 'grassland' });
const NEWCOMER = 'Aldous Newcombe';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { ...CONFIG }, institutionToggles: {}, categoryToggles: {},
  goodsToggles: {}, servicesToggles: {}, customContent: {}, importedNeighbour: null,
  campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

/** ONE real world, born by THIS engine. */
const WORLD = generateSettlementPipeline({ ...CONFIG }, null, { seed: SEED, customContent: {} });

/** A store hydrated as an open draft save holding `record` (in both homes). */
function makeStore(record) {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
  store.setState((state) => {
    state.settlement = structuredClone(record);
    state.savedSettlements = [{
      id: SAVE_ID, name: record.name, tier: record.tier, config: { ...CONFIG },
      settlement: structuredClone(record),
      campaignState: { phase: 'draft', eventLog: [], systemState: {}, editedAt: null },
      timestamp: '2020-01-01T00:00:00.000Z',
    }];
    state.activeSaveId = SAVE_ID;
    state.phase = 'draft';
  });
  return store;
}

const poolsFor = (cardType, world) => Object.fromEntries(addOpPayloadFor(cardType)
  .filter((row) => typeof row.pool === 'string')
  .map((row) => [row.pool, poolValues(row.pool, world)]));

/** Stage one newcomer by the store's own door, run EM-E1's real tick, then the roster half. */
async function oneDecree(store, stage = stageAddDecreeIntent, apply = applyRosterDecreesAtTick) {
  const world = store.getState().settlement;
  const staged = stage(store.getState, store.setState, {
    cardType: 'npc', values: { name: NEWCOMER, role: poolValues('npc.role', world)[0] },
    pools: poolsFor('npc', world), orderedAt: NOW,
  });
  const save = { id: SAVE_ID, settlement: { decrees: selectDecrees(store.getState()) } };
  const applied = applyDecreesToSaves({ tick: 1 }, [save], TICK_REF, { now: NOW });
  store.setState((state) => { state.settlement.decrees = applied.saves[0].settlement.decrees; });
  const receipt = await apply(store.getState, store.setState, { saveId: SAVE_ID });
  return { staged, receipt };
}

/** The record with the newcomer's own homes set apart, as bytes. */
const restOf = (record) => {
  const { npcs: _n, dmLayer: _l, decrees: _d, ...rest } = record;
  return JSON.stringify(rest);
};

/** A place another engine bore: today's world, carrying the legacy stamp. */
const foreign = () => ({ ...structuredClone(WORLD), generatorVersion: '0.9.0' });

describe('GUARD (R24j) — a stored place is re-derived only by the engine that bore it', () => {
  it('G1 — the version goes up with this release, and the legacy stamp is a named constant', () => {
    expect(GENERATOR_VERSION, 'R24j 1: GENERATOR_VERSION moves 0.9.0 -> 0.10.0 with this release').toBe('0.10.0');
    expect(LEGACY, 'R24j 2: the legacy stamp is the named constant LEGACY_GENERATOR_VERSION').toBe('0.9.0');
  });

  it('G2 — a birth stamps the engine; a load gives a stampless record the LEGACY value, never the current one', () => {
    expect(WORLD.generatorVersion, 'a birth carries the current engine').toBe(GENERATOR_VERSION);
    const { generatorVersion: _g, ...stampless } = structuredClone(WORLD);
    const loaded = normalizeSettlement(stampless);
    expect(loaded.generatorVersion, 'a stampless record is given the legacy stamp').toBe(LEGACY);
    expect(loaded.generatorVersion, 'and never the current one').not.toBe(GENERATOR_VERSION);
    expect(normalizeSettlement(null).generatorVersion, 'the defensive minimal shape is no birth either').toBe(LEGACY);
    expect(normalizeSettlement({ ...stampless, generatorVersion: '0.7.1' }).generatorVersion, 'a stamp is kept').toBe('0.7.1');
    expect(normalizeSettlement(WORLD).generatorVersion, 'a birth re-loaded keeps its own stamp').toBe(GENERATOR_VERSION);
  });

  it('G3 — another engine\'s place takes the newcomer by APPEND: the engine is not run and nothing else moves', async () => {
    const store = makeStore(foreign());
    const before = structuredClone(store.getState().settlement);
    laneCalls.n = 0;
    const { staged, receipt } = await oneDecree(store);
    const after = store.getState().settlement;
    const row = store.getState().savedSettlements[0].settlement;
    expect(staged.ok).toBe(true);
    expect({ ok: receipt.ok, minted: receipt.minted, rederived: receipt.rederived, unapplied: receipt.unapplied, laneCalls: laneCalls.n },
      'the receipt of an append, and the engine never asked to run').toEqual({
      ok: true, minted: [staged.decreeId], rederived: false, unapplied: [], laneCalls: 0,
    });
    expect(after.npcs.slice(0, -1), 'every saved person is the same row, in the same order').toEqual(before.npcs);
    expect(after.npcs.at(-1), 'the newcomer is the row the re-derivation would append').toEqual({
      id: staged.decreeId, name: NEWCOMER, role: poolValues('npc.role', before)[0],
    });
    expect(after.npcs.filter((p) => p.name === NEWCOMER).length, 'on the roster ONCE').toBe(1);
    expect(Object.keys(after.dmLayer.minted), 'the layer is written as today').toEqual([staged.decreeId]);
    expect(restOf(after), 'nothing else on the record moved (npcs, dmLayer, decrees set apart)').toBe(restOf(before));
    expect(row, 'one record in both homes').toBe(after);
  }, 120_000);

  it('G4 — a place THIS engine bore still re-derives: the feature stays on for new places', async () => {
    const store = makeStore(WORLD);
    laneCalls.n = 0;
    const { receipt } = await oneDecree(store);
    expect({ rederived: receipt.rederived, laneCalls: laneCalls.n }).toEqual({ rederived: true, laneCalls: 1 });
    expect(store.getState().settlement.npcs.filter((p) => p.name === NEWCOMER).length).toBe(1);
  }, 120_000);

  it('G5 — a world-fact root on another engine\'s place comes back `engine_mismatch`; nothing is half-applied', async () => {
    const key = 'worldFact:settlement:terrain';
    const record = { ...foreign(), dmLayer: { roots: { [key]: 'riverside' }, worldFacts: {}, minted: {}, phantoms: {} } };
    const store = makeStore(record);
    const before = structuredClone(store.getState().settlement);
    laneCalls.n = 0;
    const { receipt } = await oneDecree(store);
    const after = store.getState().settlement;
    expect(REDERIVE_UNAPPLIED_REASONS, 'the closed set carries the new reason').toContain('engine_mismatch');
    expect({ rederived: receipt.rederived, laneCalls: laneCalls.n, unapplied: receipt.unapplied }).toEqual({
      rederived: false, laneCalls: 0, unapplied: [{ key, value: 'riverside', reason: 'engine_mismatch' }],
    });
    expect(after.config, 'the world fact did not enter the record').toEqual(before.config);
    expect(after.dmLayer.roots, 'the root stays on the layer, unhonoured, for an engine that can').toEqual({ [key]: 'riverside' });
    expect(restOf(after)).toBe(restOf(before));
  }, 120_000);

  it('G6 — the next release, simulated: with the constant moved once more, a place born today takes the appended path', async () => {
    const bornToday = structuredClone(WORLD);
    vi.resetModules();
    vi.doMock('../../src/domain/settlement.schema.js', async (importOriginal) => ({
      ...(await importOriginal()), GENERATOR_VERSION: '0.11.0',
    }));
    try {
      const next = await import('../../src/store/editSlice.js');
      const { createSettlementSlice: nextSlice } = await import('../../src/store/settlementSlice.js');
      const store = create(immer((...a) => ({ ...stubSlice(...a), ...nextSlice(...a) })));
      store.setState((state) => {
        state.settlement = structuredClone(bornToday);
        state.savedSettlements = [{ id: SAVE_ID, name: bornToday.name, tier: bornToday.tier, config: { ...CONFIG },
          settlement: structuredClone(bornToday), campaignState: { phase: 'draft', eventLog: [], systemState: {}, editedAt: null },
          timestamp: '2020-01-01T00:00:00.000Z' }];
        state.activeSaveId = SAVE_ID;
        state.phase = 'draft';
      });
      const before = structuredClone(store.getState().settlement);
      laneCalls.n = 0;
      const { receipt } = await oneDecree(store, next.stageAddDecreeIntent, next.applyRosterDecreesAtTick);
      expect({ bornWith: bornToday.generatorVersion, rederived: receipt.rederived, laneCalls: laneCalls.n })
        .toEqual({ bornWith: '0.10.0', rederived: false, laneCalls: 0 });
      expect(restOf(store.getState().settlement)).toBe(restOf(before));
    } finally {
      vi.doUnmock('../../src/domain/settlement.schema.js');
      vi.resetModules();
    }
  }, 120_000);
});
