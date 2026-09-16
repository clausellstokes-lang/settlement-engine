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
import { advanceAssignedNpcTransits } from '../../src/domain/worldPulse/npcDmVerbs.js';
import {
  ENVOY_REQUIRED_RULES,
  advanceEnvoyErrands,
  beginEnvoyReturn,
  envoyErrandsOf,
  mintEnvoyErrand,
} from '../../src/domain/worldPulse/envoyErrand.js';
import {
  emptyRouteNetwork,
  routeEdge,
  withRouteEdges,
  writeRouteNetwork,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';

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

function lightAssignmentRoutes(store, { connected = true } = {}) {
  store.setState((state) => {
    const prior = state.campaigns[0].worldState;
    const lit = {
      ...prior,
      simulationRules: { ...prior.simulationRules, routeLifecycleEnabled: true },
    };
    if (!connected) {
      state.campaigns[0].worldState = lit;
      return;
    }
    const edge = routeEdge({
      a: 'sav_kelder', b: 'sav_thorn', grade: 'road', mode: 'land',
      provenance: 'generated', flavor: 'genesis', tick: 0,
    });
    state.campaigns[0].worldState = writeRouteNetwork(
      lit,
      withRouteEdges(emptyRouteNetwork(), [edge]),
    );
  });
}

/** Add one terms-bearing return journey to the store's real campaign world. */
function seedReturningEnvoy(store) {
  const wnpcId = seedRealm(store);
  const relationshipKey = 'sav_kelder::sav_thorn';
  const outcome = {
    id: 'peace.store-kill.1',
    generatedAtTick: 20,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: 'sav_kelder',
    severity: 0.6,
    relationshipKey,
    relationshipPatch: { proposedRelationshipType: 'neutral', trajectory: 'transitioning' },
    proposalPayload: {
      kind: 'relationship_label_change', relationshipKey,
      fromType: 'hostile', toType: 'neutral', peaceOffer: true,
      offererId: 'sav_kelder', targetId: 'sav_thorn',
      peaceFrontOwnerId: 'sav_kelder', peaceFrontSinceTick: 8,
      reason: 'Kelder offers terms to Thornreach.',
    },
  };
  const worldState = campaignOf(store).worldState;
  const lit = {
    ...worldState,
    simulationRules: {
      ...worldState.simulationRules,
      ...Object.fromEntries(ENVOY_REQUIRED_RULES.map((key) => [key, true])),
    },
  };
  const minted = mintEnvoyErrand({
    worldState: lit,
    outcome,
    acceptance: {
      accepted: true,
      offererId: 'sav_kelder',
      targetId: 'sav_thorn',
      receipt: {
        id: 'decision.store-kill', kind: 'war_peace_acceptance_read', tick: 20,
        offerId: outcome.id, offererId: 'sav_kelder', targetId: 'sav_thorn',
        decision: 'accept', actualAction: 'peace', decidingTerm: 'cause',
        reason: 'Both courts accept the carried peace ruling.',
        bands: { cause: 'live', cost_to_continue: 'pressing', cost_to_stop: 'quiet', momentum: 'present' },
      },
      offererRead: {
        id: 'read.store-kill.home', kind: 'war_termination_read', tick: 20,
        attackerId: 'sav_kelder', targetId: 'sav_thorn',
        settlementIds: ['sav_kelder', 'sav_thorn'],
      },
      termination: {
        receipt: {
          id: 'read.store-kill.away', kind: 'war_termination_read', tick: 20,
          attackerId: 'sav_thorn', targetId: 'sav_kelder',
          settlementIds: ['sav_thorn', 'sav_kelder'],
        },
      },
      inheritedDemand: null,
      coalitionPeaceExpenditures: [],
    },
    npcId: wnpcId,
    npcName: 'Maera Voss',
    fromName: 'Kelder',
    toName: 'Thornreach',
    snapshot: {
      storesBand: 'thin', strengthBand: 'ready', moraleExhaustionBand: 'pressing',
      foundingCauseStatus: 'live', believedRatioBand: 'matched',
    },
    routePlan: {
      legs: [{ fromId: 'sav_kelder', toId: 'sav_thorn', departTick: 20, arrivalTick: 22 }],
      expectedReturnTick: 30,
      routeRef: { id: 'road.kelder-thorn', name: 'Thorn Road' },
    },
    tick: 20,
  });
  expect(minted.reason).toBe('minted');
  const parlay = advanceEnvoyErrands({ worldState: minted.worldState, tick: 22 });
  const returning = beginEnvoyReturn({
    worldState: parlay.worldState,
    errandId: minted.errand.id,
    routePlan: {
      legs: [{ fromId: 'sav_thorn', toId: 'sav_kelder', departTick: 23, arrivalTick: 26 }],
      expectedReturnTick: 26,
      routeRef: { id: 'road.kelder-thorn', name: 'Thorn Road' },
    },
    termSheet: { id: 'terms.store-kill', clauses: [{ kind: 'ceasefire' }] },
    tick: 23,
  });
  store.setState((state) => {
    state.campaigns[0].worldState = { ...returning.worldState, tick: 24 };
  });
  return wnpcId;
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

  test('route-lit ASSIGN persists a one-week-or-longer lived leg and undo restores the origin', async () => {
    const store = makeStore();
    const wnpcId = seedRealm(store);
    lightAssignmentRoutes(store);

    const assigned = await store.getState().assignNpc('camp-1', {
      wnpcId, settlementId: 'sav_thorn', overrideExclusions: true,
    });
    expect(assigned).toMatchObject({ ok: true, receipt: { assignmentState: 'in_transit' } });
    const travelling = npcLedgerOf(campaignOf(store).worldState).roamers[wnpcId];
    expect(travelling.transit).toMatchObject({
      fromId: 'sav_kelder', toId: 'sav_thorn', departTick: 20,
    });
    expect(travelling.transit.arrivalTick).toBeGreaterThanOrEqual(21);
    expect(npcLedgerOf(campaignOf(store).worldState).placed[wnpcId]).toBeUndefined();

    const undone = await store.getState().undoLastNpcVerb('camp-1');
    expect(undone).toMatchObject({ ok: true, verb: 'assign' });
    expect(npcLedgerOf(campaignOf(store).worldState).placed[wnpcId]).toMatchObject({
      hostSettlementId: 'sav_kelder', sinceTick: 4,
    });
    expect(npcLedgerOf(campaignOf(store).worldState).placed[wnpcId]).not.toHaveProperty('transit');
  });

  test('route-lit ASSIGN with no lived path fails closed and does not grow the undo ring', async () => {
    const store = makeStore();
    const wnpcId = seedRealm(store);
    lightAssignmentRoutes(store, { connected: false });
    const before = JSON.stringify(campaignOf(store).worldState);

    const refusedRun = await store.getState().assignNpc('camp-1', {
      wnpcId, settlementId: 'sav_thorn', overrideExclusions: true,
    });
    expect(refusedRun).toMatchObject({ ok: false, verb: 'assign', refusal: 'no_route' });
    expect(JSON.stringify(campaignOf(store).worldState)).toBe(before);
    expect(store.getState().npcVerbUndoStack).toHaveLength(0);
    expect(npcRulingsOf(campaignOf(store).worldState)).toHaveLength(0);
  });

  test('an assignment that has already arrived rejects undo atomically and keeps its ring entry', async () => {
    const store = makeStore();
    const wnpcId = seedRealm(store);
    lightAssignmentRoutes(store);
    await store.getState().assignNpc('camp-1', {
      wnpcId, settlementId: 'sav_thorn', overrideExclusions: true,
    });
    const arrivalTick = npcLedgerOf(campaignOf(store).worldState).roamers[wnpcId].transit.arrivalTick;
    store.setState((state) => {
      state.campaigns[0].worldState = advanceAssignedNpcTransits({
        worldState: state.campaigns[0].worldState,
        tick: arrivalTick,
      }).worldState;
    });
    const before = JSON.stringify(campaignOf(store).worldState);

    const rejected = await store.getState().undoLastNpcVerb('camp-1');
    expect(rejected).toMatchObject({ ok: false, verb: 'assign', refusal: 'undo_conflict' });
    expect(JSON.stringify(campaignOf(store).worldState)).toBe(before);
    expect(store.getState().npcVerbUndoStack).toHaveLength(1);
    expect(npcLedgerOf(campaignOf(store).worldState).placed[wnpcId].hostSettlementId)
      .toBe('sav_thorn');
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

  test('KILL carries private envoy loss evidence without publishing remote truth, and undo restores it', async () => {
    const store = makeStore();
    const wnpcId = seedReturningEnvoy(store);

    const killed = await store.getState().killNpc('camp-1', { wnpcId });
    expect(killed.ok).toBe(true);
    expect(killed.envoyEvidence.map((row) => row.kind)).toEqual([
      'envoy_lost',
      'terms_never_reached',
    ]);
    expect(killed).not.toHaveProperty('envoyNews');
    expect(envoyErrandsOf(campaignOf(store).worldState)[0]).toMatchObject({
      npcId: wnpcId,
      state: 'lost',
      lossCause: 'killed',
    });
    expect(npcRulingsOf(campaignOf(store).worldState).map((row) => row.kind || row.candidateType))
      .toEqual(['npc_death']);

    const undone = await store.getState().undoLastNpcVerb('camp-1');
    expect(undone).toMatchObject({ ok: true, verb: 'kill' });
    expect(envoyErrandsOf(campaignOf(store).worldState)[0]).toMatchObject({ state: 'returning' });
    expect(npcLedgerOf(campaignOf(store).worldState).placed[wnpcId]).toBeTruthy();
    expect(npcRulingsOf(campaignOf(store).worldState)).toHaveLength(0);
  });

  test('a stale envoy closure keeps the store undo and settlement death intact', async () => {
    const store = makeStore();
    const wnpcId = seedReturningEnvoy(store);
    await store.getState().killNpc('camp-1', { wnpcId });
    store.setState((state) => {
      const row = state.campaigns[0].worldState.envoyErrands[0];
      row.lostTick = 25;
      row.closedTick = 25;
    });
    const beforeWorld = JSON.stringify(campaignOf(store).worldState);
    const beforeSettlement = JSON.stringify(kelderOf(store).settlement);

    const rejected = await store.getState().undoLastNpcVerb('camp-1');
    expect(rejected).toMatchObject({ ok: false, verb: 'kill', refusal: 'undo_conflict' });
    expect(JSON.stringify(campaignOf(store).worldState)).toBe(beforeWorld);
    expect(JSON.stringify(kelderOf(store).settlement)).toBe(beforeSettlement);
    expect(store.getState().npcVerbUndoStack).toHaveLength(1);
    expect(envoyErrandsOf(campaignOf(store).worldState)[0]).toMatchObject({ state: 'lost', lostTick: 25 });
    expect(npcLedgerOf(campaignOf(store).worldState).placed[wnpcId]).toBeUndefined();
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
