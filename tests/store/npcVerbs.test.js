/**
 * tests/store/npcVerbs.test.js — the three DM verbs through the STORE (W-H4,
 * design DESIGN_NPC_CONSEQUENCES.md §7).
 *
 * The domain pins (tests/domain/npcDmVerbs.test.js) prove the verbs themselves. This
 * file proves the WIRING, which is where the estate's write-that-ghosts bugs live:
 *   1. a verb reaches the campaign's world state and stays there;
 *   2. the SETTLEMENT half reaches the saved library row AND the live active view, so a
 *      dead person is not left standing in the dossier the DM has open;
 *   3. the undo ring reverses BOTH halves, and is scoped per campaign so a DM running
 *      two realms cannot undo the wrong world's ruling;
 *   4. the advance guard refuses rather than writing into a world an in-flight advance
 *      will restore wholesale.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => { cached.set(ownerId, clone(campaigns)); }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createNpcVerbsSlice } from '../../src/store/npcVerbsSlice.js';
import { graduateNpc, addExclusionEdge, npcLedgerOf } from '../../src/domain/worldPulse/npcLedger.js';
import { npcRulingsOf } from '../../src/domain/worldPulse/npcRulingRegister.js';
import { NPC_CONSEQUENCE_KEY } from '../../src/domain/worldPulse/npcVerdictApply.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

const stubSlice = () => ({
  savedSettlements: [],
  settlement: null,
  activeSaveId: null,
  phase: 'draft',
  eventLog: [],
  locks: {},
});

function makeStore() {
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createCampaignSlice(...a),
    ...createNpcVerbsSlice(...a),
  })));
}

/** A canonized realm with one banished harbourmaster, jailed at Kelder. */
function seedRealm(store, { wnpcIdOut } = {}) {
  let worldState = {
    rngSeed: 'store-seed',
    tick: 20,
    canonizedAt: '2026-01-01T00:00:00.000Z',
    simulationRules: { npcConsequencesEnabled: true },
  };
  const g = graduateNpc({
    worldState,
    settlementSeed: 'seed-kelder',
    settlementId: 'sav_kelder',
    rosterIdentity: { rosterId: 'npc_3', name: 'Maera Voss', role: 'harbourmaster' },
    tick: 4,
    verdictCause: 'jailed',
    hostSettlementId: 'sav_kelder',
  });
  worldState = addExclusionEdge(g.worldState, g.wnpcId, {
    settlementId: 'sav_thorn', kind: 'banishment_edict', untilTick: 60,
  }).worldState;
  if (wnpcIdOut) wnpcIdOut.id = g.wnpcId;

  store.setState(state => {
    state.savedSettlements = [{
      id: 'sav_kelder',
      name: 'Kelder',
      phase: 'canon',
      settlement: {
        id: 'sav_kelder',
        name: 'Kelder',
        npcs: [
          { id: 'npc_1', name: 'Someone Else' },
          { id: 'npc_3', name: 'Maera Voss', [NPC_CONSEQUENCE_KEY]: { verdictCause: 'jailed', tick: 4, jailUntilTick: 40 } },
        ],
      },
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }, {
      id: 'sav_thorn', name: 'Thornreach', phase: 'canon',
      settlement: { id: 'sav_thorn', name: 'Thornreach', npcs: [] },
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    state.activeSaveId = 'sav_kelder';
    state.settlement = state.savedSettlements[0].settlement;
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      settlementIds: ['sav_kelder', 'sav_thorn'],
      worldState,
    }];
  });
  return g.wnpcId;
}

const campaignOf = store => store.getState().campaigns[0];
const kelderOf = store => store.getState().savedSettlements[0];

describe('W-H4 store wiring — the three verbs', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('ASSIGN refuses a shut door and honours an explicit override, naming it', async () => {
    const store = makeStore();
    const wnpcId = seedRealm(store);

    const refusal = await store.getState().assignNpc('camp-1', { wnpcId, settlementId: 'sav_thorn' });
    expect(refusal.ok).toBe(false);
    expect(refusal.refusal).toBe('excluded_without_override');
    expect(npcLedgerOf(campaignOf(store).worldState).placed[wnpcId].hostSettlementId).toBe('sav_kelder');

    const forced = await store.getState().assignNpc('camp-1', {
      wnpcId, settlementId: 'sav_thorn', overrideExclusions: true,
    });
    expect(forced.ok).toBe(true);
    expect(forced.receipt.overrodeExclusions).toEqual(['banishment_edict at sav_thorn']);
    expect(npcLedgerOf(campaignOf(store).worldState).placed[wnpcId].hostSettlementId).toBe('sav_thorn');
    expect(npcRulingsOf(campaignOf(store).worldState)).toHaveLength(1);
  });

  test('KILL reaches the ledger, the saved row AND the live view, and undo reverses all three', async () => {
    const store = makeStore();
    const wnpcId = seedRealm(store);

    const killed = await store.getState().killNpc('camp-1', { wnpcId });
    expect(killed.ok).toBe(true);
    expect(npcLedgerOf(campaignOf(store).worldState).placed[wnpcId]).toBeUndefined();
    const markedRoster = kelderOf(store).settlement.npcs.find(n => n.id === 'npc_3');
    expect(markedRoster[NPC_CONSEQUENCE_KEY].deceasedByDm).toBe(true);
    // THE LIVE VIEW, which is the half a save-only write would ghost.
    expect(store.getState().settlement.npcs.find(n => n.id === 'npc_3')[NPC_CONSEQUENCE_KEY].deceasedByDm).toBe(true);

    const undone = await store.getState().undoLastNpcVerb('camp-1');
    expect(undone.ok).toBe(true);
    expect(undone.verb).toBe('kill');
    expect(npcLedgerOf(campaignOf(store).worldState).placed[wnpcId]).toBeTruthy();
    expect(kelderOf(store).settlement.npcs.find(n => n.id === 'npc_3')[NPC_CONSEQUENCE_KEY].deceasedByDm).toBeUndefined();
    expect(store.getState().settlement.npcs.find(n => n.id === 'npc_3')[NPC_CONSEQUENCE_KEY].deceasedByDm).toBeUndefined();
    expect(npcRulingsOf(campaignOf(store).worldState)).toHaveLength(0);
  });

  test('PARDON lifts the edict and releases the hold, and undo restores both', async () => {
    const store = makeStore();
    const wnpcId = seedRealm(store);

    const pardoned = await store.getState().pardonNpc('camp-1', { wnpcId });
    expect(pardoned.ok).toBe(true);
    expect(pardoned.receipt.doorsOpened).toEqual(['sav_thorn']);
    expect(pardoned.receipt.releasedFromHold).toBe(true);
    expect(npcLedgerOf(campaignOf(store).worldState).exclusions[wnpcId]).toBeUndefined();
    expect(kelderOf(store).settlement.npcs.find(n => n.id === 'npc_3')[NPC_CONSEQUENCE_KEY].jailUntilTick).toBeUndefined();

    await store.getState().undoLastNpcVerb('camp-1');
    expect(npcLedgerOf(campaignOf(store).worldState).exclusions[wnpcId])
      .toEqual([{ settlementId: 'sav_thorn', kind: 'banishment_edict', untilTick: 60 }]);
    expect(kelderOf(store).settlement.npcs.find(n => n.id === 'npc_3')[NPC_CONSEQUENCE_KEY].jailUntilTick).toBe(40);
  });

  test('the undo ring is per campaign, and empties honestly', async () => {
    const store = makeStore();
    const wnpcId = seedRealm(store);
    expect((await store.getState().undoLastNpcVerb('camp-1')).refusal).toBe('nothing_to_undo');

    await store.getState().pardonNpc('camp-1', { wnpcId });
    expect(store.getState().npcVerbUndoStack).toHaveLength(1);
    // Another realm's undo must not reach into this one's ring.
    expect((await store.getState().undoLastNpcVerb('camp-other')).refusal).toBe('nothing_to_undo');
    expect(store.getState().npcVerbUndoStack).toHaveLength(1);

    await store.getState().undoLastNpcVerb('camp-1');
    expect(store.getState().npcVerbUndoStack).toHaveLength(0);
  });

  test('an in-flight advance refuses every verb rather than writing a ghost', async () => {
    const store = makeStore();
    const wnpcId = seedRealm(store);
    store.setState(state => { state.isAdvanceInFlight = () => true; });

    for (const call of [
      () => store.getState().assignNpc('camp-1', { wnpcId, settlementId: 'sav_thorn' }),
      () => store.getState().killNpc('camp-1', { wnpcId }),
      () => store.getState().pardonNpc('camp-1', { wnpcId }),
      () => store.getState().undoLastNpcVerb('camp-1'),
    ]) {
      const r = await call();
      expect(r.ok).toBe(false);
      expect(r.refusal).toBe('advance_in_flight');
    }
    // Nothing was written by any of the four.
    expect(npcLedgerOf(campaignOf(store).worldState).placed[wnpcId].hostSettlementId).toBe('sav_kelder');
    expect(npcRulingsOf(campaignOf(store).worldState)).toHaveLength(0);
  });

  test('a dark realm refuses every verb, and the campaign bytes are untouched', async () => {
    const store = makeStore();
    const wnpcId = seedRealm(store);
    store.setState(state => { state.campaigns[0].worldState.simulationRules = {}; });
    const before = JSON.stringify(campaignOf(store).worldState);

    const r = await store.getState().assignNpc('camp-1', { wnpcId, settlementId: 'sav_thorn' });
    expect(r.ok).toBe(false);
    expect(r.refusal).toBe('dormant');
    expect(JSON.stringify(campaignOf(store).worldState)).toBe(before);
  });
});
