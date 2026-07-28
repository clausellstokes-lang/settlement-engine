/**
 * locksEngine.test.js — the STORE half of the locks engine (Phase A).
 *
 * The leaf's algebra is pinned in tests/domain/locksPreservation.test.js and the
 * seeded no-drift proof in tests/generators/locksSurviveReroll.test.js. What is
 * only observable here is the LIFECYCLE — the four paths a lock has to survive,
 * each of which has its own way of losing it:
 *
 *   PERSIST — the reload bug (atlas store-ops-a gap 10). The lock map rides
 *     inside campaignState, so it used to reach the cloud only by PIGGYBACK, when
 *     some other canon-path write happened to pickle the slice. Set a lock, reload
 *     without touching anything else, and it was gone. Both verbs now write.
 *   REFUSE — a locked section must not reroll, and must say so in a typed shape
 *     rather than silently doing nothing.
 *   REGEN  — the lock map must follow its subject through the roster reroll.
 *   GENERATE — a full roll carries the locked CHARACTERS bodily into the new town
 *     (Phase B), remaps their ids to the slots they inherited, prunes ids nothing
 *     preserved, and keeps the booleans and the name-keyed faction / institution
 *     arrays. The pure algebra is pinned in tests/domain/locksPreservation.test.js
 *     and the seeded no-drift proof in tests/generators/locksSurviveFullGenerate.
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

describe('PERSIST — a lock survives a reload on its own (gap 10)', () => {
  test('setLock on an active save writes campaignState durably', async () => {
    store.setState({
      settlement: townFixture(),
      activeSaveId: 'save-1',
      savedSettlements: [{ id: 'save-1', name: 'Testford', campaignState: {} }],
    });

    await store.getState().setLock('history', true);

    // The in-memory save row carries the lock…
    const entry = store.getState().savedSettlements.find(s => s.id === 'save-1');
    expect(entry.campaignState.locks).toEqual({ history: true });
    expect(entry.timestamp).toBeTruthy();
    // …and so does the durable write. Before this, NEITHER happened unless some
    // unrelated canon-path action pickled the slice on the same visit.
    expect(saves.update).toHaveBeenCalledTimes(1);
    const [saveId, partial] = saves.update.mock.calls[0];
    expect(saveId).toBe('save-1');
    expect(partial.campaignState.locks).toEqual({ history: true });
    // A lock is intent ABOUT the settlement, not a change to it — no blob write.
    expect(partial.settlement).toBeUndefined();
  });

  test('clearLocks persists the empty map too (or the cleared lock comes back)', async () => {
    store.setState({
      settlement: townFixture(),
      activeSaveId: 'save-1',
      locks: { history: true },
      savedSettlements: [{ id: 'save-1', campaignState: { locks: { history: true } } }],
    });

    await store.getState().clearLocks();

    expect(store.getState().locks).toEqual({});
    const [, partial] = saves.update.mock.calls[0];
    expect(partial.campaignState.locks).toEqual({});
  });

  test('a DRAFT (no active save) writes nothing and does not throw', async () => {
    store.setState({ settlement: townFixture(), activeSaveId: null });
    // No save to write ⇒ the helper returns undefined rather than a resolved
    // promise. That is the contract: a draft's locks live in session state and
    // become durable the moment the draft is saved (pickleCampaignState carries
    // them), so there is nothing here to await.
    expect(store.getState().setLock('identity', true)).toBeUndefined();
    expect(store.getState().locks).toEqual({ identity: true });
    expect(saves.update).not.toHaveBeenCalled();
  });

  test('the lock map round-trips through hydrateFromSave', () => {
    store.getState().hydrateFromSave({
      id: 'save-2',
      settlement: townFixture(),
      campaignState: { locks: { npcs: ['npc_1'], identity: true } },
    });
    expect(store.getState().locks).toEqual({ npcs: ['npc_1'], identity: true });
  });
});

describe('REFUSE — a locked section does not reroll, and says why', () => {
  test('a locked npcs section returns a typed refusal', async () => {
    store.setState({ settlement: townFixture(), locks: { npcs: true } });
    const before = store.getState().settlement;
    const result = await store.getState().regenSection('npcs');
    expect(result.ok).toBe(false);
    expect(result.before.reason).toBe('section_locked');
    expect(result.before.section).toBe('npcs');
    // And nothing moved — the refusal is a refusal, not a report after the fact.
    expect(store.getState().settlement).toBe(before);
  });

  test('a locked history section returns a typed refusal', async () => {
    store.setState({ settlement: townFixture(), locks: { history: true } });
    const result = await store.getState().regenSection('history');
    expect(result.ok).toBe(false);
    expect(result.before.reason).toBe('section_locked');
    expect(result.before.section).toBe('history');
  });

  test('an ID-ARRAY lock is NOT a section lock — that reroll still runs', async () => {
    // The two forms of the same key mean opposite things. Confusing them would
    // turn "keep this one person" into "never reroll anyone", which is the
    // silent over-freeze the leaf's normalize step exists to prevent.
    store.setState({ settlement: townFixture(), locks: { npcs: ['npc_1'] } });
    const result = await store.getState().regenSection('npcs');
    expect(result?.ok).not.toBe(false);
    // Long: unlike the refusals above, this one actually loads the engine chunk
    // and rolls a roster.
  }, 60_000);

  test('the refusal fires BEFORE the session regen counter moves', async () => {
    // A refused reroll is not a reroll. If it counted, five locked clicks would
    // fire the regen-burst pricing moment at a user who never rerolled anything.
    store.setState({ settlement: townFixture(), locks: { history: true }, sessionRegenCount: 0 });
    await store.getState().regenSection('history');
    expect(store.getState().sessionRegenCount || 0).toBe(0);
  });
});

describe('REGEN — the lock map follows its subject through the real reroll', () => {
  // Driven through the STORE, not the pipeline: the remap runs inside the same
  // Immer `set()` that folds the new roster in, and an Immer draft is the one
  // place a "returns the input unchanged" contract can misbehave (a draft proxy
  // spread into a new object, a write that never lands). The pure algebra is
  // pinned in tests/domain; this proves the wiring.
  test('a locked character survives regenSection and the lock takes their new id', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const town = generateSettlementPipeline(
      { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
      null, { seed: 'locks-store-regen', customContent: {} },
    );
    const target = town.npcs[2];
    store.setState({ settlement: town, config: town.config, locks: { npcs: [String(target.id)] } });

    await store.getState().regenSection('npcs');

    const after = store.getState();
    const survivor = after.settlement.npcs.find(n => String(n.name) === String(target.name));
    expect(survivor, 'the locked character survived the reroll').toBeTruthy();
    expect(after.locks.npcs).toEqual([String(survivor.id)]);
    // The preservation report is a TRACE, not settlement content. If it ever lands
    // in the blob it persists, exports, and diffs forever.
    expect(after.settlement._preservation).toBeUndefined();
  }, 90_000);
});

describe('GENERATE — the full-roll lock tail', () => {
  test('a locked character rides a FULL generate into the new town, map remapped', async () => {
    // Phase B, driven through the STORE rather than the engine: the carry runs
    // between the pipeline and carryLockedSections, and the map is rewritten
    // inside the same Immer set() that folds the settlement in. An Immer draft is
    // the one place a "returns the input unchanged" contract can misbehave.
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const town = generateSettlementPipeline(
      { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
      null, { seed: 'locks-store-generate-prev', customContent: {} },
    );
    const target = town.npcs[2];
    store.setState({
      settlement: town,
      config: town.config,
      locks: { identity: true, npcs: [String(target.id)], factions: ['f_1'], institutions: ['i_1'] },
    });

    await store.getState().generateSettlement('locks-store-generate-next');

    const after = store.getState();
    const survivor = after.settlement.npcs.find(n => String(n.name) === String(target.name));
    expect(survivor, 'the locked character must be in the freshly generated town').toBeTruthy();
    // The map now names the id the survivor actually holds, not the one they had.
    expect(after.locks.npcs).toEqual([String(survivor.id)]);
    // Name-keyed arrays are standing intent and survive verbatim; so do booleans.
    expect(after.locks.factions).toEqual(['f_1']);
    expect(after.locks.institutions).toEqual(['i_1']);
    expect(after.locks.identity).toBe(true);
    // The report is a TRACE. In the blob it would persist, export and diff forever.
    expect(after.settlement._preservation).toBeUndefined();
  }, 120_000);

  test('a stale npc id disappears from the map, booleans and names stay', async () => {
    store.setState({
      settlement: townFixture(),
      locks: { identity: true, geography: true, npcs: ['npc_nobody'], factions: ['f_1'] },
    });
    await store.getState().generateSettlement('locks-store-seed');
    // npc_nobody named nobody in the previous roster, so nothing was carried and
    // the id is pruned — but the name-keyed factions lock is kept, which is the
    // Phase-A behaviour this lane inverted (it used to be dropped, silently
    // disarming coup.js's proposal downgrade on every full regenerate).
    expect(store.getState().locks).toEqual({ identity: true, geography: true, factions: ['f_1'] });
  }, 60_000);

  test('a locked identity keeps the name across a full roll', async () => {
    store.setState({ settlement: { ...townFixture(), name: 'Oldford' }, locks: { identity: true } });
    await store.getState().generateSettlement('locks-store-seed-2');
    expect(store.getState().settlement.name).toBe('Oldford');
  }, 60_000);

  test('UNLOCKED is the control — the roll renames freely', async () => {
    store.setState({ settlement: { ...townFixture(), name: 'Oldford' }, locks: {} });
    await store.getState().generateSettlement('locks-store-seed-2');
    // Same seed as the locked run above: the ONLY difference is the lock, so this
    // proves the carry is what kept the name, not the seed.
    expect(store.getState().settlement.name).not.toBe('Oldford');
  }, 60_000);
});
