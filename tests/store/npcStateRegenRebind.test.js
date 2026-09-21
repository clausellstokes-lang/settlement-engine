/**
 * npcStateRegenRebind.test.js — THE REBIND, through the store, at the real pipeline.
 *
 * The recon (R-L2-UID-RECON PART 1) refuted the composite `${settlementId}:${npc.id}`
 * as a home for any durable per-person state, and it did so by EXECUTION: after a
 * locked section reroll the keeper had moved npc_6 -> npc_8 while `npc_6` named a
 * different human being. Two campaign-scoped maps were exposed to exactly that and
 * were in no fold:
 *
 *   • `worldState.npcStates` — corruption, exposures, momentum, rivalries. Its key
 *     stays LIVE across the reroll, so `pruneNpcStates` can never fire on it and an
 *     existence census reads clean while the row is about the wrong person.
 *   • the npcLedger's `originRef` — which cannot rebind (the NAME in its lookup key
 *     refuses strangers) but DOES lose: the same person at a moved slot resolves to
 *     null and would graduate a SECOND time under a second durable identity.
 *
 * This file re-executes the recon's own scenario through `regenSection('npcs')` and
 * asserts the two properties the cure has to buy: THE PERSON'S STATE FOLLOWS THE
 * PERSON, AND THE STRANGER INHERITS NOTHING.
 *
 * ⛔ THE KEEPER IS AN AUTHORED CHARACTER, NOT A LOCKED ONE (owner orders 2026-09-17,
 * "remove the other padlocks"): no stored lock is read any more, and the reroll's entity
 * policy carries a user-authored character into the same moved slot the lock did.
 *
 * The seeds are the pinned pair from tests/store/pinnedNpcRegenRemap.test.js, for
 * the same reason that file pins them: the reroll mints its seed through
 * generateSeed(), and under an unpinned mint the keeper's slot move — the whole
 * precondition of the defect — would be a coin flip per run.
 *
 * @enforced-by this test
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = (value) => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: (campaign) => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => { cached.set(ownerId, clone(campaigns)); }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn((campaign) => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

// Same pinned mint as the pin-remap suite: under this reroll seed, paired with the
// fixture seed below, the npcs[2] keeper provably inherits a DIFFERENT slot id.
vi.mock('../../src/kernel/prng.js', async (importOriginal) => ({
  ...(await importOriginal()),
  generateSeed: () => 'pins-regen-remap-fixed',
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { graduateNpc, durableIdForRoster, npcLedgerOf } from '../../src/domain/worldPulse/npcLedger.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';

const SAVE_ID = 'save.rebind';
const OTHER_SAVE = 'save.elsewhere';
const CAMPAIGN_ID = 'camp.rebind';
const CFG = { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' };

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: (key) => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: (key) => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { ...CFG },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  campaignSessionGeneration: 0,
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

/** Every key this settlement owns in an npcStates map, sorted. */
const townKeys = (states) => Object.keys(states || {}).filter((k) => k.startsWith(`${SAVE_ID}:`)).sort();

/** @type {ReturnType<typeof makeStore>} */
let store;

beforeEach(() => {
  vi.clearAllMocks();
  installLocalStorage();
  store = makeStore();
});

describe('REGEN — a person\'s world state follows the person, and the stranger inherits nothing', () => {
  test('npcStates re-key the keeper, drop everyone replaced, and never cross settlements', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const town = reloaded(generateSettlementPipeline(CFG, null, { seed: 'pins-store-regen-1', customContent: {} }));
    town.npcs[2]._authored = true;
    const target = town.npcs[2];
    const bystander = town.npcs[0];
    expect(String(bystander.id), 'the fixture needs a second, unauthored roster member')
      .not.toBe(String(target.id));

    // Seed a simulation row for EVERY roster member, each carrying a marker that
    // names its owner, so a misbind is legible as a name in the wrong row rather
    // than as a missing key.
    /** @type {Record<string, any>} */
    const npcStates = {};
    for (const npc of town.npcs) {
      npcStates[`${SAVE_ID}:${npc.id}`] = { marker: String(npc.name), corruption: false, timesExposed: 0 };
    }
    npcStates[`${SAVE_ID}:${target.id}`] = {
      marker: String(target.name),
      corruption: true,
      timesExposed: 4,
      // Rivalries hold npcState KEYS, so they take the same two verdicts their
      // subjects do: one target is replaced by the reroll, one lives elsewhere.
      rivalryTargets: [`${SAVE_ID}:${bystander.id}`, `${OTHER_SAVE}:npc_1`],
    };
    // A neighbouring settlement's rows must be carried verbatim.
    npcStates[`${OTHER_SAVE}:npc_1`] = { marker: 'elsewhere', corruption: true };

    store.setState({
      settlement: town,
      config: town.config,
      activeSaveId: SAVE_ID,
      savedSettlements: [{ id: SAVE_ID, name: town.name, settlement: town }],
      campaigns: [{
        id: CAMPAIGN_ID,
        accessState: 'active',
        settlementIds: [SAVE_ID, OTHER_SAVE],
        worldState: { tick: 12, npcStates },
      }],
    });

    const beforeStates = store.getState().campaigns[0].worldState.npcStates;
    const beforeTownKeys = townKeys(beforeStates);
    expect(beforeTownKeys.length, 'the fixture seeds a row per roster member')
      .toBe(town.npcs.length);

    await store.getState().regenSection('npcs');

    const after = store.getState();
    const survivor = after.settlement.npcs.find((n) => String(n.name) === String(target.name));
    expect(survivor, 'the authored character survived the reroll').toBeTruthy();
    // NON-VACUITY GUARD, and it is the defect's whole precondition: the keeper has
    // to INHERIT A DIFFERENT SLOT ID, or every assertion below would also hold with
    // the fold deleted.
    expect(String(survivor.id), 'the keeper must inherit a different slot id')
      .not.toBe(String(target.id));
    // ...and the slot it inherited must have been SOMEBODY ELSE's before the roll,
    // so "the stranger inherits nothing" is a claim about a real prior occupant.
    expect(beforeStates[`${SAVE_ID}:${survivor.id}`], 'the inherited slot held a prior row').toBeTruthy();
    expect(String(beforeStates[`${SAVE_ID}:${survivor.id}`].marker))
      .not.toBe(String(target.name));

    const states = after.campaigns[0].worldState.npcStates;

    // 1. THE PERSON'S STATE FOLLOWS THE PERSON.
    const carried = states[`${SAVE_ID}:${survivor.id}`];
    expect(carried, 'the keeper has a row under the id it inherited').toBeTruthy();
    expect(carried.marker).toBe(String(target.name));
    expect(carried.corruption).toBe(true);
    expect(carried.timesExposed).toBe(4);

    // 2. THE STRANGER INHERITS NOTHING. The old key is gone outright — not left
    //    standing for whoever the roll seated there.
    expect(states[`${SAVE_ID}:${target.id}`]).toBeUndefined();
    // 3. Everyone the reroll replaced is gone; exactly one row survives this town.
    expect(townKeys(states)).toEqual([`${SAVE_ID}:${survivor.id}`]);
    // 4. The neighbouring settlement is untouched, byte for byte.
    expect(states[`${OTHER_SAVE}:npc_1`]).toEqual({ marker: 'elsewhere', corruption: true });
    // 5. Rivalries took the same two verdicts: the replaced target is stripped, the
    //    one in another town is kept.
    expect(carried.rivalryTargets).toEqual([`${OTHER_SAVE}:npc_1`]);

    // 6. THE KEY FORMAT PIN — this suite builds keys by hand, so prove the hand
    //    spelling is npcAgency's own. A drift here would make every assertion above
    //    measure a map nothing else writes.
    expect(`${SAVE_ID}:${survivor.id}`).toBe(npcId(SAVE_ID, survivor, 0));
  }, 90_000);

  test('a graduated keeper keeps ONE durable identity across the slot move', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const town = reloaded(generateSettlementPipeline(CFG, null, { seed: 'pins-store-regen-1', customContent: {} }));
    town.npcs[2]._authored = true;
    const target = town.npcs[2];

    // A LIT world — the ledger's whole surface is an early return when the
    // consequence economy is dark, so the graduation below needs the flag.
    const graduation = graduateNpc({
      worldState: { tick: 12, simulationRules: { npcConsequencesEnabled: true } },
      settlementSeed: 'pins-store-regen-1',
      settlementId: SAVE_ID,
      rosterIdentity: { rosterId: String(target.id), name: String(target.name), role: String(target.role || '') },
      tick: 12,
    });
    expect(graduation.wnpcId, 'the fixture graduates the person who will be preserved').toBeTruthy();

    // A SECOND soul who ONCE held the very slot the keeper is about to leave, and
    // has since gone. Their originRef is (SAVE_ID, target.id, someone else), so a
    // refresh matching on the SLOT ALONE would drag this record onto the keeper's
    // new slot — inventing the rebind the name in the lookup key exists to refuse.
    const departed = graduateNpc({
      worldState: graduation.worldState,
      settlementSeed: 'pins-store-regen-1',
      settlementId: SAVE_ID,
      rosterIdentity: { rosterId: String(target.id), name: 'Adelheid Vorgänger', role: 'Former Occupant' },
      tick: 9,
    });
    expect(departed.wnpcId, 'the former occupant graduated under their own id').toBeTruthy();
    expect(departed.wnpcId).not.toBe(graduation.wnpcId);

    store.setState({
      settlement: town,
      config: town.config,
      activeSaveId: SAVE_ID,
      savedSettlements: [{ id: SAVE_ID, name: town.name, settlement: town }],
      campaigns: [{
        id: CAMPAIGN_ID, accessState: 'active', settlementIds: [SAVE_ID], worldState: departed.worldState,
      }],
    });

    await store.getState().regenSection('npcs');

    const after = store.getState();
    const survivor = after.settlement.npcs.find((n) => String(n.name) === String(target.name));
    expect(String(survivor.id)).not.toBe(String(target.id));

    const worldState = after.campaigns[0].worldState;
    // THE CURE: the same person at the MOVED slot resolves to the SAME durable id,
    // so the next graduation is the idempotent no-op rather than a second soul.
    expect(durableIdForRoster(worldState, SAVE_ID, { rosterId: String(survivor.id), name: String(survivor.name) }))
      .toBe(graduation.wnpcId);
    // The stored linkage was rewritten, not merely tolerated by a fuzzy lookup.
    expect(npcLedgerOf(worldState).roamers[graduation.wnpcId].originRef)
      .toEqual({ settlementId: SAVE_ID, rosterId: String(survivor.id), name: String(target.name) });
    // THE DEPARTED SOUL IS LEFT ALONE. They held the keeper's OLD slot under a
    // different name, so matching on the slot alone would have dragged them onto
    // the keeper's new one. Their originRef must be untouched, stale and harmless.
    expect(npcLedgerOf(worldState).roamers[departed.wnpcId].originRef)
      .toEqual({ settlementId: SAVE_ID, rosterId: String(target.id), name: 'Adelheid Vorgänger' });
    // And the ledger still holds exactly the two souls it started with — the
    // refresh is a rewrite, never a mint and never a removal (law 6).
    expect(Object.keys(npcLedgerOf(worldState).roamers).sort())
      .toEqual([graduation.wnpcId, departed.wnpcId].sort());
    // The stranger now standing in the vacated slot resolves to nobody, which is
    // the property the NAME in the lookup key already bought and this fold must
    // not have spent.
    const stranger = after.settlement.npcs.find((n) => String(n.id) === String(target.id));
    expect(stranger, 'somebody else now holds the keeper\'s old slot').toBeTruthy();
    expect(String(stranger.name)).not.toBe(String(target.name));
    expect(durableIdForRoster(worldState, SAVE_ID, { rosterId: String(stranger.id), name: String(stranger.name) }))
      .toBeNull();
  }, 90_000);

  test('DORMANT — a campaign holding nothing for this settlement is never written', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { campaigns } = await import('../../src/lib/campaigns.js');
    const town = reloaded(generateSettlementPipeline(CFG, null, { seed: 'pins-store-dormant', customContent: {} }));
    const worldState = { tick: 3, npcStates: { [`${OTHER_SAVE}:npc_1`]: { marker: 'elsewhere' } } };

    store.setState({
      settlement: town,
      config: town.config,
      activeSaveId: SAVE_ID,
      savedSettlements: [{ id: SAVE_ID, name: town.name, settlement: town }],
      campaigns: [{ id: CAMPAIGN_ID, accessState: 'active', settlementIds: [SAVE_ID], worldState }],
    });

    await store.getState().regenSection('npcs');

    const after = store.getState().campaigns[0].worldState;
    expect(after.npcStates).toEqual({ [`${OTHER_SAVE}:npc_1`]: { marker: 'elsewhere' } });
    // The identity fold writes through persistCampaignState, which caches the whole
    // campaign array — so a dormant fold that wrote anyway would be visible here.
    expect(campaigns.cache).not.toHaveBeenCalled();
    // The reroll itself still happened; this is a dormant fold, not a dormant regen.
    expect(store.getState().settlement.npcs).not.toEqual(town.npcs);
  }, 90_000);

  test('a DRAFT reroll (no active save) reaches no campaign at all', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { campaigns } = await import('../../src/lib/campaigns.js');
    const town = reloaded(generateSettlementPipeline(CFG, null, { seed: 'pins-store-draft', customContent: {} }));
    town.npcs[2]._authored = true;
    const worldState = { tick: 1, npcStates: { [`${SAVE_ID}:npc_1`]: { marker: 'not-mine' } } };

    store.setState({
      settlement: town,
      config: town.config,
      activeSaveId: null,
      campaigns: [{ id: CAMPAIGN_ID, accessState: 'active', settlementIds: [SAVE_ID], worldState }],
    });

    await store.getState().regenSection('npcs');

    // npcStates keys are built from the SAVE id, so a draft owns no rows anywhere —
    // reaching into a campaign here would be reaching into another save's world.
    expect(store.getState().campaigns[0].worldState.npcStates)
      .toEqual({ [`${SAVE_ID}:npc_1`]: { marker: 'not-mine' } });
    expect(campaigns.cache).not.toHaveBeenCalled();
  }, 90_000);
});
