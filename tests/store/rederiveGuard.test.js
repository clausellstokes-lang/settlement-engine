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
 * GUARD-2 (CLOSE-7; the chair's ruling R24n), on top of 97c6bfc7a:
 *  G7 (R24n (1)) the append path's closed set is its OWN export, `APPEND_UNAPPLIED_REASONS`, asserted in both
 *     directions; the pin bag's `REDERIVE_UNAPPLIED_REASONS` is the two it always was.
 *  G8 (R24n (2)) the ANSWER's stamp is checked: a lane that answers with a record another engine stamped is
 *     not written; the tick takes the append path (`rederived: false`), never NOTHING_MINTED.
 *  G9-G12 (R24n (3)) the append path: two ticks (the second appends only its own newcomer), a save that is not
 *     the open one, a faction and a house newcomer, and the undo of an appended tick.
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
// GUARD-2 (R24n (2)): `laneCalls.stamp`, when set, makes the lane a DOUBLE of a remote service running another
// bundle: the real answer, its record restamped with that version.
const laneCalls = vi.hoisted(() => ({ n: 0, stamp: /** @type {string|null} */ (null) }));
vi.mock('../../src/store/settlementRederiveAction.js', async (importOriginal) => {
  const real = await importOriginal();
  return {
    ...real,
    regenerateWithLayer: (...args) => {
      laneCalls.n += 1;
      const answer = real.regenerateWithLayer(...args);
      const stamp = laneCalls.stamp;
      return stamp === null ? answer : answer.then((out) => ({ ...out, record: { ...out.record, generatorVersion: stamp } }));
    },
  };
});

import { poolValues } from '../../src/domain/edit/pools.js';
import { APPEND_UNAPPLIED_REASONS, REDERIVE_UNAPPLIED_REASONS, appendMinted } from '../../src/domain/edit/dmLayer.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import * as schema from '../../src/domain/settlement.schema.js';
import { applyDecreesToSaves, retractDecreesOfTick } from '../../src/domain/worldPulse/decreeHook.js';
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
    // GUARD-2 (R24n (1)), re-stated by its cause: the reason is the APPEND path's, in its own closed set
    expect(APPEND_UNAPPLIED_REASONS, 'the append path\'s closed set carries the reason').toContain('engine_mismatch');
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

describe('GUARD-2 (R24n) — the append path\'s own closed set, the answer\'s stamp, and the append path\'s missing cases', () => {
  /** Stage one newcomer of `cardType` by the store's own door, run EM-E1's real tick `tick`, then the roster half. */
  async function decreeAt(store, tick, cardType, values, saveId = SAVE_ID) {
    const world = store.getState().settlement;
    const staged = stageAddDecreeIntent(store.getState, store.setState, {
      cardType, values, pools: poolsFor(cardType, world), orderedAt: NOW,
    });
    const tickRef = `world_pulse.campaign-guard.${tick}`;
    const applied = applyDecreesToSaves({ tick }, [{ id: SAVE_ID, settlement: { decrees: selectDecrees(store.getState()) } }], tickRef, { now: NOW });
    store.setState((state) => { state.settlement.decrees = applied.saves[0].settlement.decrees; });
    const receipt = await applyRosterDecreesAtTick(store.getState, store.setState, { saveId });
    return { staged, receipt, tickRef };
  }
  const npc = (store, name) => ({ name, role: poolValues('npc.role', store.getState().settlement)[0] });
  const idsOf = (rows) => (rows || []).map((row) => row?.id);

  it('G7 — the pin bag\'s set is the two it always was; the append path\'s is its OWN export, both directions', () => {
    expect([...REDERIVE_UNAPPLIED_REASONS], 'the pin bag refuses nothing new').toEqual(['step_not_pinnable', 'unknown_key']);
    expect([...APPEND_UNAPPLIED_REASONS], 'the append path\'s closed set, frozen, codepoint order').toEqual(['engine_mismatch', 'unknown_key']);
    expect(Object.isFrozen(APPEND_UNAPPLIED_REASONS)).toBe(true);
    // every member is REACHED: a world-fact root is said, not done; a newcomer whose card writes no collection is unknown
    const consult = { declarationsFor: () => [{ field: 'terrain', provenance: 'world-fact' }] };
    const layer = { roots: { 'worldFact:settlement:terrain': 'riverside' }, worldFacts: {}, phantoms: {},
      minted: { 'dm:minted:00000000000000aa': { kind: 'npc', name: NEWCOMER } } };
    const reached = appendMinted(foreign(), layer, consult).unapplied.map((row) => row.reason);
    expect([...new Set(reached)].sort(), 'each member of the set is reached, and nothing outside it').toEqual([...APPEND_UNAPPLIED_REASONS]);
  });

  it('G8 — a lane that answers with a record another engine stamped is NOT written: the tick takes the append path', async () => {
    const store = makeStore(WORLD);
    const before = structuredClone(store.getState().settlement);
    laneCalls.n = 0;
    laneCalls.stamp = '0.11.0';
    try {
      const { staged, receipt } = await decreeAt(store, 1, 'npc', npc(store, NEWCOMER));
      const after = store.getState().settlement;
      expect({ ok: receipt.ok, minted: receipt.minted, rederived: receipt.rederived, unapplied: receipt.unapplied, laneCalls: laneCalls.n },
        'the lane ran, its answer was refused, and the newcomer was appended').toEqual({
        ok: true, minted: [staged.decreeId], rederived: false, unapplied: [], laneCalls: 1,
      });
      expect(after.generatorVersion, 'the record keeps this engine\'s stamp').toBe(GENERATOR_VERSION);
      expect(after.npcs.filter((p) => p.name === NEWCOMER).length, 'the newcomer is on the roster ONCE').toBe(1);
      expect(restOf(after), 'nothing else on the record moved').toBe(restOf(before));
      expect(store.getState().savedSettlements[0].settlement, 'one record in both homes').toBe(after);
    } finally {
      laneCalls.stamp = null;
    }
  }, 120_000);

  it('G9 — TWO TICKS on another engine\'s place: the second appends ONLY its own newcomer', async () => {
    const store = makeStore(foreign());
    const before = structuredClone(store.getState().settlement);
    laneCalls.n = 0;
    const first = await decreeAt(store, 1, 'npc', npc(store, NEWCOMER));
    const second = await decreeAt(store, 2, 'npc', npc(store, 'Bryn Ashdown'));
    const after = store.getState().settlement;
    expect([first.receipt.minted, second.receipt.minted, second.receipt.rederived, laneCalls.n])
      .toEqual([[first.staged.decreeId], [second.staged.decreeId], false, 0]);
    // the test reds if `appendMinted` is handed the whole layer: the first newcomer would be appended again at tick 2
    expect(idsOf(after.npcs), 'the roster is the saved one, then each newcomer ONCE, in tick order')
      .toEqual([...idsOf(before.npcs), first.staged.decreeId, second.staged.decreeId]);
    expect(Object.keys(after.dmLayer.minted).sort(), 'the layer holds both').toEqual([first.staged.decreeId, second.staged.decreeId].sort());
    expect(restOf(after)).toBe(restOf(before));
  }, 120_000);

  it('G10 — a save that is NOT the open one: its own library row takes the newcomer, and the open view is untouched', async () => {
    const staging = makeStore(foreign());
    const { staged } = await (async () => {
      const world = staging.getState().settlement;
      const st = stageAddDecreeIntent(staging.getState, staging.setState, {
        cardType: 'npc', values: npc(staging, NEWCOMER), pools: poolsFor('npc', world), orderedAt: NOW,
      });
      const applied = applyDecreesToSaves({ tick: 1 }, [{ id: SAVE_ID, settlement: { decrees: selectDecrees(staging.getState()) } }], TICK_REF, { now: NOW });
      staging.setState((state) => { state.settlement.decrees = applied.saves[0].settlement.decrees; });
      return { staged: st };
    })();
    const member = structuredClone(staging.getState().settlement);
    const store = makeStore(WORLD);
    store.setState((state) => {
      state.savedSettlements[0].id = 'save-open';
      state.activeSaveId = 'save-open';
      state.savedSettlements.push({ id: SAVE_ID, name: member.name, tier: member.tier, config: { ...CONFIG },
        settlement: structuredClone(member), campaignState: { phase: 'draft', eventLog: [], systemState: {}, editedAt: null },
        timestamp: '2020-01-01T00:00:00.000Z' });
    });
    const openBefore = structuredClone(store.getState().settlement);
    laneCalls.n = 0;
    const receipt = await applyRosterDecreesAtTick(store.getState, store.setState, { saveId: SAVE_ID });
    const row = store.getState().savedSettlements.find((r) => r.id === SAVE_ID).settlement;
    expect({ minted: receipt.minted, rederived: receipt.rederived, laneCalls: laneCalls.n })
      .toEqual({ minted: [staged.decreeId], rederived: false, laneCalls: 0 });
    expect(idsOf(row.npcs), 'the member row: its people, then the newcomer once').toEqual([...idsOf(member.npcs), staged.decreeId]);
    expect(restOf(row), 'nothing else on the member moved').toBe(restOf(member));
    expect(store.getState().settlement, 'the open view is the open save, untouched').toEqual(openBefore);
  }, 120_000);

  it('G11 — a FACTION and a HOUSE newcomer on another engine\'s place are appended once each, and nothing else moves', async () => {
    const store = makeStore(foreign());
    const before = structuredClone(store.getState().settlement);
    const world = store.getState().settlement;
    laneCalls.n = 0;
    const faction = await decreeAt(store, 1, 'faction', { category: poolValues('faction.category', world)[0], faction: 'The Ash Compact' });
    const house = await decreeAt(store, 2, 'institution', { category: poolValues('institution.class', world)[0], name: 'The Lantern Exchange' });
    const after = store.getState().settlement;
    expect([faction.receipt.rederived, faction.receipt.unapplied, house.receipt.rederived, house.receipt.unapplied, laneCalls.n])
      .toEqual([false, [], false, [], 0]);
    expect(idsOf(after.powerStructure.factions), 'the factions: the saved ones, then the newcomer once')
      .toEqual([...idsOf(before.powerStructure.factions), faction.staged.decreeId]);
    expect(idsOf(after.institutions), 'the houses: the saved ones, then the newcomer once')
      .toEqual([...idsOf(before.institutions), house.staged.decreeId]);
    const { powerStructure: _p, institutions: _i, ...restAfter } = after;
    const { powerStructure: _q, institutions: _j, ...restBefore } = before;
    expect(restOf(restAfter), 'nothing else moved').toBe(restOf(restBefore));
    const { factions: fa, ...psAfter } = after.powerStructure;
    const { factions: fb, ...psBefore } = before.powerStructure;
    expect([psAfter, fa.slice(0, -1)], 'the power structure is the saved one but for the newcomer').toEqual([psBefore, fb]);
  }, 120_000);

  it('G12 — THE UNDO of an appended tick (the rewind\'s two halves, as rosterOpsAtTick C2 drives them): the record holds after it', async () => {
    const store = makeStore(foreign());
    const preTick = structuredClone(store.getState().settlement);
    const { staged, tickRef } = await decreeAt(store, 1, 'npc', npc(store, NEWCOMER));
    const grown = idsOf(store.getState().settlement.npcs);
    // E1's own inverse of `markApplied` on the live registry, then the pre-pulse snapshot restored into BOTH homes
    const retracted = retractDecreesOfTick(selectDecrees(store.getState()), tickRef);
    store.setState((state) => {
      state.settlement = structuredClone(preTick);
      state.settlement.decrees = structuredClone(retracted);
      state.savedSettlements[0].settlement = state.settlement;
    });
    const after = store.getState().settlement;
    const again = await applyRosterDecreesAtTick(store.getState, store.setState, { saveId: SAVE_ID });
    // anchored: the grown roster carried the newcomer, so the absence below is the rewind and not a mint that never happened
    expect(grown.filter((id) => id === staged.decreeId).length).toBe(1);
    expect({
      roster: idsOf(after.npcs), minted: Object.keys(after.dmLayer?.minted || {}), statuses: selectDecrees(store.getState()).map((r) => r.status),
      stamp: after.generatorVersion, remintedAtOnce: again.minted,
    }, 'after the undo: the saved roster, no minted row, the decree waiting, the legacy stamp kept, and nothing re-minted').toEqual({
      roster: idsOf(preTick.npcs), minted: [], statuses: ['pending'], stamp: '0.9.0', remintedAtOnce: [],
    });
  }, 120_000);
});
