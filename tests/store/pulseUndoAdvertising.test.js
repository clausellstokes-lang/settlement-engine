/**
 * tests/store/pulseUndoAdvertising.test.js — R-0/R-1 undo-truth pins (queue #5,
 * atlas VI.3 #62): the five ops that carry (or carried) undoToken:'undoLastPulse'.
 *
 * The defect: five registry rows advertised "It can be undone with Undo last
 * pulse" while exactly ONE code path pushed a pulseUndoStack snapshot (the
 * advance body). The cure, per-op on evidence:
 *   • advanceCampaignWorld      — always armed (its own Phase-2 push): pinned here.
 *   • applyWorldPulseProposal   — ARMED FOR REAL in R-1 (its first arming was
 *     REVERTED in R-0 for cap-flooding the shared PULSE_UNDO_CAP=10 advance
 *     stack and for popping under advance-only "Undo Advance" copy): it now
 *     pushes the pre-apply snapshot onto the SEPARATE, separately-capped
 *     session proposalUndoStack ring (PROPOSAL_UNDO_CAP=5), popped by its own
 *     registered verb undoLastProposalApply with its own labeled surfaces.
 *     Pinned BOTH ways below: the op pushes NOTHING onto the advance stack,
 *     and the flood scenario (advance, then 11 applies) leaves the pre-advance
 *     snapshot reachable. The ring's own behavior (restore, cap, ordering,
 *     fence) is pinned in tests/store/proposalUndoRing.test.js.
 *   • resolveIntervalMajors     — armed at the TRANSACTION level: the paused
 *     advance's push covers the interval; a same-session resume is genuinely
 *     undoable (pinned). On reload-into-paused the pre-interval state is
 *     unrecoverable, and canUndoLastPulse is honestly false (pinned).
 *   • canonizeCampaignWorld     — DE-ADVERTISED (undoToken:null, undoState:'none'):
 *     pinned to push nothing and claim nothing.
 *   • recordPartyImpact         — DE-ADVERTISED: pinned to push nothing and claim
 *     nothing (arming rejected: undoLastEvent interference, cap flooding, and the
 *     advance's internal drain-replay — see the registry row comment).
 *
 * Harness: the REAL campaign + world-pulse slices on a real zustand store
 * (the advancePauseResume.test.js idiom).
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

let multiTickValue = false;
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(name => (name === 'advanceMultiTick' ? multiTickValue : false)),
}));

vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { OPERATIONS } from '../../src/store/operationRegistry.js';

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
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createCampaignSlice(...a), ...createCampaignWorldPulseSlice(...a) })));
}

function settlement(name) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 60 },
        { faction: 'Temple Wardens', category: 'religious', power: 48 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `${name}-reeve`, name: `Reeve of ${name}`, importance: 'key' }],
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.5 }],
  };
}

const NOW = '2026-01-01T00:00:00.000Z';

function seedStore(store, { proposals = [], relationshipStates = undefined } = {}) {
  store.setState(state => {
    state.savedSettlements = ['a', 'b', 'c'].map(id => ({
      id, name: id, phase: 'canon',
      settlement: settlement(id),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }));
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: ['a', 'b', 'c'],
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
          { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
        ],
      }),
      wizardNews: { currentTick: 1, entries: [] },
      worldState: {
        rngSeed: 'undo-advertising-seed', tick: 1, canonizedAt: NOW,
        proposals,
        ...(relationshipStates ? { relationshipStates } : {}),
      },
    }];
  });
}

/** A minimal pending condition proposal the domain applier accepts (the
 *  campaignSlice.worldPulse.test.js fixture, retargeted at save 'a'). */
function pendingFamineProposal() {
  return {
    id: 'world_proposal.famine.a',
    kind: 'condition',
    status: 'pending',
    tick: 1,
    severity: 0.8,
    headline: 'Famine pressure may take hold',
    summary: 'Food pressure has crossed a threshold.',
    reasons: ['test'],
    outcome: {
      id: 'candidate.condition.food.a.1',
      type: 'condition',
      candidateType: 'food_pressure',
      targetSaveId: 'a',
      severity: 0.8,
      headline: 'Famine pressure may take hold',
      summary: 'Food pressure has crossed a threshold.',
      reasons: ['test'],
      condition: {
        archetype: 'famine',
        severity: 0.8,
        label: 'Famine pressure',
        description: 'Food scarcity is public.',
        duration: { elapsedTicks: 0, expiresAtTicks: 8 },
      },
    },
  };
}

const stackOf = (store, campaignId = 'camp-1') =>
  (store.getState().pulseUndoStack || []).filter(s => s.campaignId === campaignId);
// R-1: the SEPARATE session proposal-undo ring (proposalUndoRing.test.js owns
// its full behavior pins; here it only proves the advance stack stayed clean).
const ringOf = (store, campaignId = 'camp-1') =>
  (store.getState().proposalUndoStack || []).filter(s => String(s.campaignId) === String(campaignId));

// Two tests below run a real 52-tick interval (the advancePauseResume budget).
const INTERVAL_TIMEOUT_MS = 40_000;

describe('R-0 pulse-undo advertising truth (queue #5)', () => {
  beforeEach(() => {
    installLocalStorage();
    multiTickValue = false;
  });

  test('the registry advertises undoLastPulse ONLY on the ops that arm it', () => {
    // Armed advertisers.
    expect(OPERATIONS.advanceCampaignWorld.undoToken).toBe('undoLastPulse');
    expect(OPERATIONS.advanceCampaignWorld.undoState).toBe('action');
    expect(OPERATIONS.resolveIntervalMajors.undoToken).toBe('undoLastPulse');
    expect(OPERATIONS.resolveIntervalMajors.undoState).toBe('action');
    // R-1 (queue #5): applyWorldPulseProposal is ARMED against its OWN verb —
    // never undoLastPulse — and the description names that verb's label.
    expect(OPERATIONS.applyWorldPulseProposal.undoToken).toBe('undoLastProposalApply');
    expect(OPERATIONS.applyWorldPulseProposal.undoState).toBe('action');
    expect(OPERATIONS.applyWorldPulseProposal.description).toMatch(/Undo a proposal apply/);
    expect(OPERATIONS.undoLastProposalApply.label).toBe('Undo a proposal apply');
    expect(OPERATIONS.undoLastProposalApply.undoState).toBe('not-applicable');
    // De-advertised (queue #5): no token, honest null-state, and the published
    // description no longer claims an undo.
    for (const opType of ['canonizeCampaignWorld', 'recordPartyImpact']) {
      const op = OPERATIONS[opType];
      expect(op.undoToken, `${opType} undoToken`).toBeNull();
      expect(op.undoState, `${opType} undoState`).toBe('none');
      expect(op.description, `${opType} description still claims an undo`)
        .not.toMatch(/undone|Undo last pulse/i);
    }
  });

  test('applyWorldPulseProposal arms the PROPOSAL ring and pushes NOTHING onto the advance stack', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [pendingFamineProposal()] });
    expect(stackOf(store)).toHaveLength(0);

    const applied = await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a');
    // Non-vacuous: the proposal truly applied…
    expect(applied).toBeTruthy();
    expect(store.getState().campaigns[0].worldState.proposals[0].status).toBe('applied');
    expect(store.getState().savedSettlements[0].settlement.activeConditions
      .some(c => c.archetype === 'famine')).toBe(true);
    // …the pre-apply snapshot landed on the SEPARATE session ring (R-1)…
    expect(ringOf(store)).toHaveLength(1);
    expect(ringOf(store)[0].kind).toBe('proposal');
    expect(ringOf(store)[0].proposalId).toBe('world_proposal.famine.a');
    // …and the ADVANCE stack stayed empty: proposal traffic cannot reach it
    // (the R-0 cap-flood/mislabel findings), so "Undo Advance" stays honest.
    expect(stackOf(store)).toHaveLength(0);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
  });

  test('FLOOD PIN: advance once, apply 11 proposals — the pre-advance snapshot is STILL reachable and undoes to the pre-advance state', async () => {
    // The verifier scenario that forced the R-0 revert: under the old per-apply
    // arming, the shared PULSE_UNDO_CAP=10 per-campaign stack evicted the
    // pre-advance snapshot on the 10th applied proposal, so the toolbar's
    // "Undo Advance" silently stopped reaching the pre-advance world. Pinned
    // against the R-1 REAL arming: one advance + 11 real applies leave EXACTLY
    // the advance snapshot on the advance stack (the applies land on their own
    // capped ring), and popping it restores the pre-advance state.
    const store = makeStore();
    seedStore(store);
    const preTick = store.getState().campaigns[0].worldState.tick;

    const advanced = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });
    expect(advanced).toBeTruthy();
    const postAdvanceTick = store.getState().campaigns[0].worldState.tick;
    expect(postAdvanceTick).toBeGreaterThan(preTick);
    expect(stackOf(store)).toHaveLength(1);

    // Inject 11 distinct pending proposals (cycling targets a/b/c) AFTER the
    // advance, then apply every one for real.
    const saveIds = ['a', 'b', 'c'];
    const injected = Array.from({ length: 11 }, (_, i) => {
      const target = saveIds[i % saveIds.length];
      const base = pendingFamineProposal();
      return {
        ...base,
        id: `world_proposal.famine.${target}.${i}`,
        outcome: {
          ...base.outcome,
          id: `candidate.condition.food.${target}.${i}`,
          targetSaveId: target,
        },
      };
    });
    store.setState(state => {
      const worldState = state.campaigns[0].worldState;
      worldState.proposals = [...(worldState.proposals || []), ...injected];
    });
    for (const proposal of injected) {
      const applied = await store.getState().applyWorldPulseProposal('camp-1', proposal.id);
      expect(applied, `apply ${proposal.id}`).toBeTruthy();
    }
    const proposalsAfter = store.getState().campaigns[0].worldState.proposals;
    for (const proposal of injected) {
      expect(proposalsAfter.find(p => p.id === proposal.id)?.status, proposal.id).toBe('applied');
    }

    // The pre-advance snapshot survived the flood: the 11 applies armed the
    // SEPARATE ring (capped at 5, oldest dropped), evicted nothing here, and
    // the advertised "Undo Advance" still reaches it.
    expect(stackOf(store)).toHaveLength(1);
    expect(ringOf(store)).toHaveLength(5);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(true);
    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone).toBe(true);
    expect(store.getState().campaigns[0].worldState.tick).toBe(preTick);
    // The applied famine conditions rode the member saves back out too.
    for (const saved of store.getState().savedSettlements) {
      expect(
        (saved.settlement.activeConditions || []).some(c => c.archetype === 'famine'),
        `post-undo famine on save ${saved.id}`,
      ).toBe(false);
    }
    expect(stackOf(store)).toHaveLength(0);
    // Ring coherence: every retained pre-apply snapshot was captured AFTER the
    // advance the pop just reverted — those worlds no longer exist, so the
    // advance-undo pruned them instead of leaving fast-forward time bombs.
    expect(ringOf(store)).toHaveLength(0);
  }, INTERVAL_TIMEOUT_MS);

  test('applyWorldPulseProposal pushes NOTHING when the apply no-ops (unknown / non-pending proposal)', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [{ ...pendingFamineProposal(), status: 'dismissed' }] });

    const missing = await store.getState().applyWorldPulseProposal('camp-1', 'no-such-proposal');
    expect(missing).toBeNull();
    const terminal = await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a');
    expect(terminal).toBeNull();
    // A refused apply leaves no phantom undo step on EITHER store.
    expect(stackOf(store)).toHaveLength(0);
    expect(ringOf(store)).toHaveLength(0);
  });

  test('resolveIntervalMajors advertised undo works for a same-session interval: resume to completion, then undo to tick 0', async () => {
    multiTickValue = true;
    const store = makeStore();
    seedStore(store);
    store.setState(state => { state.campaigns[0].wizardNews = { currentTick: 0, entries: [] }; state.campaigns[0].worldState.tick = 0; });

    const paused = await store.getState().advanceCampaignWorld('camp-1', 'one_year', { now: NOW, autoResolve: false });
    expect(paused.status).toBe('paused');
    // The interval's arming push landed at the pause commit.
    expect(stackOf(store)).toHaveLength(1);

    let guard = 0; let r;
    do {
      if (guard++ > 60) throw new Error('did not converge');
      r = await store.getState().resolveIntervalMajors('camp-1', {}, { now: NOW });
    } while (r && r.status === 'paused');
    expect(store.getState().campaigns[0].worldState.tick).toBe(52);
    // Still exactly ONE snapshot (the resume never double-pushes)…
    expect(stackOf(store)).toHaveLength(1);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(true);

    // …and popping it reverts the WHOLE interval, cursor included.
    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone).toBe(true);
    const ws = store.getState().campaigns[0].worldState;
    expect(ws.tick).toBe(0);
    expect('pausedAdvance' in ws).toBe(false);
    expect(stackOf(store)).toHaveLength(0);
  }, INTERVAL_TIMEOUT_MS);

  test('DOCUMENTED reload corner: after reload-into-paused, the resumed interval offers NO undo (honest absence, not a broken one)', async () => {
    multiTickValue = true;
    const store = makeStore();
    seedStore(store);
    store.setState(state => { state.campaigns[0].wizardNews = { currentTick: 0, entries: [] }; state.campaigns[0].worldState.tick = 0; });
    await store.getState().advanceCampaignWorld('camp-1', 'one_year', { now: NOW, autoResolve: false });
    const persistedCampaign = JSON.parse(JSON.stringify(store.getState().campaigns[0]));
    const persistedSaves = JSON.parse(JSON.stringify(store.getState().savedSettlements));
    expect(persistedCampaign.worldState.pausedAdvance).toBeTruthy();

    // Reload: the session undo stack is gone; only the cursor rehydrates.
    const reloaded = makeStore();
    reloaded.setState(state => {
      state.savedSettlements = persistedSaves;
      state.campaigns = [persistedCampaign];
    });
    expect(stackOf(reloaded)).toHaveLength(0);

    let guard = 0; let r;
    do {
      if (guard++ > 60) throw new Error('did not converge');
      r = await reloaded.getState().resolveIntervalMajors('camp-1', {}, { now: NOW });
    } while (r && r.status === 'paused');
    expect(reloaded.getState().campaigns[0].worldState.tick).toBe(52);
    // The pre-interval state is unrecoverable after a reload (the cursor holds
    // only pre-PAUSED-TICK clones), so the honest contract is NO undo on offer:
    // canUndoLastPulse false, nothing on the stack — never a broken restore.
    expect(stackOf(reloaded)).toHaveLength(0);
    expect(reloaded.getState().canUndoLastPulse('camp-1')).toBe(false);
  }, INTERVAL_TIMEOUT_MS);

  test('canonizeCampaignWorld is DE-ADVERTISED and pushes nothing', async () => {
    const store = makeStore();
    seedStore(store);
    store.setState(state => { delete state.campaigns[0].worldState.canonizedAt; });

    const ws = await store.getState().canonizeCampaignWorld('camp-1');
    expect(ws && ws.canonizedAt).toBeTruthy();
    // A canonize is not a pulse: nothing lands on the pulse undo stack.
    expect(stackOf(store)).toHaveLength(0);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
  });

  test('recordPartyImpact is DE-ADVERTISED and pushes nothing (while the impact really lands)', async () => {
    const store = makeStore();
    seedStore(store, {
      relationshipStates: {
        'edge.a.b': { relationshipType: 'hostile', trust: 0.05, resentment: 0.78, fear: 0.72 },
      },
    });

    const result = await store.getState().recordPartyImpact('camp-1', {
      kind: 'broker_relationship', relationshipKey: 'edge.a.b', magnitude: 0.8,
      label: 'The party brokered a truce',
    });
    // Non-vacuous: the impact truly mutated the world…
    expect(result).toBeTruthy();
    expect(store.getState().campaigns[0].worldState.relationshipStates['edge.a.b'].relationshipType)
      .not.toBe('hostile');
    // …and no snapshot was pushed: the registry honestly says undoState:'none'.
    expect(stackOf(store)).toHaveLength(0);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
  });
});
