/**
 * locksEngine.test.js — the STORE half of the locks engine, after the padlocks left.
 *
 * ⛔ OWNER ORDERS 2026-09-17: "Remove the entire section that says what a new roll keeps
 * and any button associated with that", then "remove the other padlocks". Every lock
 * control is gone (the world section, "Keep these people", "Keep this history" and the
 * roster-row padlock), the store's `setLock` and `clearLocks` writers are retired, and
 * the read side reads no lock (domain/locksPreservation.js normalizeLocks). What is only
 * observable HERE is the LIFECYCLE of a lock a save still carries, on every path it
 * could still act through:
 *
 *   PERSIST  — the stored map is DATA: it round-trips through hydrate and pickle
 *              verbatim (a veto restores the controls with a user's old locks intact),
 *              and nothing in the store can write a new one.
 *   REFUSE   — a stored section lock no longer refuses a reroll: the reroll runs, and
 *              the session counter moves as for any reroll.
 *   REGEN    — a stored id list carries nobody through a roster reroll (the same roll
 *              as no lock at all), yet a stored id still FOLLOWS an authored keeper to
 *              its new slot, because keeping stored data true is not a lock acting.
 *   GENERATE — a full roll carries no stored character and no stored history, the new
 *              draft drops the `npcs` ids nothing carried, and every other key rides
 *              through verbatim.
 *
 * The pure algebra is pinned in tests/domain/locksPreservation.test.js and the seeded
 * pipeline proofs in tests/generators/locksSurviveReroll and locksSurviveFullGenerate.
 *
 * @enforced-by this test
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// The durable seam: persistLocksToActiveSave fires persistSaveUpdate → saves.update.
// Stub it so the assertions are about WHAT was written, not about the cloud.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

// A section reroll mints its seed through generateSeed(); pin the mint so a run with a
// stored lock and a run without one roll the SAME dice and can be compared byte for byte.
// generateSettlement takes its seed as an argument in every test here, so it is unaffected.
vi.mock('../../src/kernel/prng.js', async (importOriginal) => ({
  ...(await importOriginal()),
  generateSeed: () => 'locks-store-regen-fixed',
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
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

const townFixture = () => ({
  tier: 'town',
  name: 'Testford',
  population: 2000,
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  npcs: [
    { id: 'npc_0', name: 'Alda', role: 'reeve' },
    { id: 'npc_1', name: 'Bran', role: 'smith' },
  ],
  history: { founded: 812 },
});

/** @type {ReturnType<typeof makeStore>} */
let store;

beforeEach(() => {
  vi.clearAllMocks();
  store = makeStore();
});

describe('PERSIST — a stored map is data, and nothing in the store writes one any more', () => {
  test('the lock writers are retired from the store, beside the reroll action that stays', () => {
    const api = store.getState();
    // THE ANCHOR: the same store object carries the section reroll, so an empty or
    // mis-built store cannot pass the absence below.
    expect(typeof api.regenSection).toBe('function');
    expect(api.setLock, 'setLock is back: a lock control needs a writer, and every control is retired').toBeUndefined();
    expect(api.clearLocks, 'clearLocks is back').toBeUndefined();
  });

  test('the lock map round-trips through hydrateFromSave, every retired key intact', () => {
    const stored = { npcs: ['npc_1'], history: true, identity: true, factions: ['Town Council'] };
    store.getState().hydrateFromSave({
      id: 'save-2',
      settlement: townFixture(),
      campaignState: { locks: stored },
    });
    expect(store.getState().locks).toEqual(stored);
  });

  test('a reroll on an active save writes the stored map back verbatim (pickleCampaignState)', async () => {
    const stored = { npcs: true, history: true };
    store.setState({
      settlement: townFixture(),
      activeSaveId: 'save-1',
      locks: stored,
      savedSettlements: [{ id: 'save-1', name: 'Testford', campaignState: { locks: stored } }],
    });
    await store.getState().regenSection('history');
    const write = saves.update.mock.calls.find(([, partial]) => partial?.campaignState);
    expect(write, 'the reroll wrote campaignState').toBeTruthy();
    expect(write[1].campaignState.locks).toEqual(stored);
  }, 60_000);
});

describe('REFUSE — a stored section lock no longer refuses (owner order 2026-09-17)', () => {
  test('a stored npcs section lock rerolls the roster', async () => {
    store.setState({ settlement: townFixture(), locks: { npcs: true } });
    const before = store.getState().settlement;
    const result = await store.getState().regenSection('npcs');
    expect(result?.before?.reason, 'a stored "Keep these people" still refused the reroll').toBeUndefined();
    expect(store.getState().settlement.npcs).not.toEqual(before.npcs);
  }, 60_000);

  test('a stored history section lock rerolls the history', async () => {
    store.setState({ settlement: townFixture(), locks: { history: true } });
    const result = await store.getState().regenSection('history');
    expect(result?.before?.reason, 'a stored "Keep this history" still refused the reroll').toBeUndefined();
    expect(store.getState().settlement.history).not.toEqual({ founded: 812 });
  }, 60_000);

  test('the session regen counter moves as for any reroll', async () => {
    store.setState({ settlement: townFixture(), locks: { history: true }, sessionRegenCount: 0 });
    await store.getState().regenSection('history');
    expect(store.getState().sessionRegenCount).toBe(1);
  }, 60_000);
});

describe('REGEN — a stored id carries nobody, and follows an authored keeper as data', () => {
  test('a stored per-character lock rolls exactly the roster no lock rolls', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const town = JSON.parse(JSON.stringify(generateSettlementPipeline(
      { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
      null, { seed: 'locks-store-regen', customContent: {} },
    )));
    const target = town.npcs[2];

    store.setState({ settlement: town, config: town.config, locks: { npcs: [String(target.id)] } });
    await store.getState().regenSection('npcs');
    const storedRun = store.getState().settlement.npcs;

    store = makeStore();
    store.setState({ settlement: town, config: town.config, locks: {} });
    await store.getState().regenSection('npcs');
    const bareRun = store.getState().settlement.npcs;

    // THE ANCHOR: the reroll really replaced the target in the bare run, so equality
    // below is a statement about a roll that had someone to carry.
    expect(bareRun.map(n => String(n.name)).includes(String(target.name)), 'the fixture must lose the target').toBe(false);
    expect(storedRun).toEqual(bareRun);
  }, 90_000);

  test('a stored id follows an AUTHORED keeper to the slot it inherited (data kept true for a veto)', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const town = JSON.parse(JSON.stringify(generateSettlementPipeline(
      { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
      null, { seed: 'pins-store-regen-1', customContent: {} },
    )));
    // The survival ground is the ENTITY policy (a user-authored character), not the lock.
    town.npcs[2]._authored = true;
    const target = town.npcs[2];
    store.setState({ settlement: town, config: town.config, locks: { npcs: [String(target.id)] } });

    await store.getState().regenSection('npcs');

    const after = store.getState();
    const survivor = after.settlement.npcs.find(n => String(n.name) === String(target.name));
    expect(survivor, 'the authored character survived the reroll').toBeTruthy();
    expect(String(survivor.id), 'the fixture needs a keeper whose id MOVES').not.toBe(String(target.id));
    expect(after.locks.npcs).toEqual([String(survivor.id)]);
    // The preservation report is a TRACE, not settlement content.
    expect(after.settlement._preservation).toBeUndefined();
  }, 90_000);
});

describe('GENERATE — the full-roll lock tail carries nothing', () => {
  test('a stored character and history lock change nothing about a full generate', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const town = JSON.parse(JSON.stringify(generateSettlementPipeline(
      { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
      null, { seed: 'locks-store-generate-prev', customContent: {} },
    )));
    const target = town.npcs[2];
    store.setState({
      settlement: town,
      config: town.config,
      locks: { history: true, npcs: [String(target.id)], identity: true, factions: ['f_1'], institutions: ['i_1'] },
    });
    await store.getState().generateSettlement('locks-store-generate-next');
    const storedRun = store.getState();

    store = makeStore();
    store.setState({ settlement: town, config: town.config, locks: {} });
    await store.getState().generateSettlement('locks-store-generate-next');
    const bareRun = store.getState();

    // THE ANCHOR: the two runs are real, different towns from the previous one.
    expect(bareRun.settlement.name).not.toBe(town.name);
    expect(JSON.stringify(storedRun.settlement)).toBe(JSON.stringify(bareRun.settlement));
    // The new draft drops the ids nothing carried (they would name strangers) and keeps
    // every other key verbatim as stored data.
    expect(storedRun.locks).toEqual({ history: true, identity: true, factions: ['f_1'], institutions: ['i_1'] });
    expect(storedRun.settlement._preservation).toBeUndefined();
  }, 120_000);

  test('a STORED identity lock no longer keeps the name across a full roll (owner order 2026-09-17)', async () => {
    store.setState({ settlement: { ...townFixture(), name: 'Oldford' }, locks: { identity: true } });
    await store.getState().generateSettlement('locks-store-seed-2');
    const storedRun = store.getState();
    expect(storedRun.settlement.name, 'a stored identity lock still carried the old name').not.toBe('Oldford');
    expect(storedRun.locks).toEqual({ identity: true });

    store = makeStore();
    store.setState({ settlement: { ...townFixture(), name: 'Oldford' }, locks: {} });
    await store.getState().generateSettlement('locks-store-seed-2');
    expect(storedRun.settlement.name).toBe(store.getState().settlement.name);
  }, 60_000);

  test('a STORED geography lock no longer re-rolls the previous ground (owner order 2026-09-17)', async () => {
    const prev = { ...townFixture(), config: { settType: 'town', culture: 'germanic', terrainType: 'coastal', tradeRouteAccess: 'port' } };
    store.setState({ settlement: prev, locks: { geography: true } });
    await store.getState().generateSettlement('locks-store-seed-geo');
    const storedRun = store.getState();
    expect(storedRun.settlement.config.tradeRouteAccess).toBe('road');
    expect(storedRun.locks).toEqual({ geography: true });

    store = makeStore();
    store.setState({ settlement: prev, locks: {} });
    await store.getState().generateSettlement('locks-store-seed-geo');
    expect(storedRun.settlement.name).toBe(store.getState().settlement.name);
    expect(storedRun.settlement.config.tradeRouteAccess).toBe(store.getState().settlement.config.tradeRouteAccess);
  }, 60_000);
});
