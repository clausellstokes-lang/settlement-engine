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
 *     undoable (pinned). R-0 recorded reload-into-paused as an unrecoverable
 *     corner; R-5b CLOSED it (see the block of four pins below).
 *   • canonizeCampaignWorld     — DE-ADVERTISED (undoToken:null, undoState:'none'):
 *     pinned to push nothing and claim nothing.
 *   • recordPartyImpact         — DE-ADVERTISED: pinned to push nothing and claim
 *     nothing (arming rejected: undoLastEvent interference, cap flooding, and the
 *     advance's internal drain-replay — see the registry row comment).
 *
 * R-5b (2026-07-27) also closed the reload-into-paused corner under the owner's
 * authorization for the ONE shape widening R-0 named: the advance parks its
 * pre-INTERVAL snapshot on the resume cursor as well as on the session stack, so
 * the snapshot rehydrates with the campaign record. Four pins below cover arm,
 * restore, in-session non-regression, and old-save degradation.
 *
 * R-5b (2026-07-27) adds the SIXTH member, promoted rather than cured:
 *   • catchUpCampaignWorld      — PROMOTED from the referential
 *     `external:undoLastPulse` to `undoToken:'undoLastPulse'` / `undoState:'action'`.
 *     It pushes no ring entry of its own: the whole caught-up span routes through
 *     ONE delegated advance whose Phase-2 commit pushes the single pre-catch-up
 *     snapshot. Pinned both ways below — the armed case restores world AND the M10b
 *     cursor, and the three no-op paths (seeded / up_to_date / not_living) arm
 *     nothing.
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

function seedStore(store, { proposals = [], relationshipStates = undefined, world = undefined } = {}) {
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
        // R-5b: the catch-up pins need the M10b progression mode + cursor on the
        // SAME fixture (an extra world-state overlay, inert for every other test).
        ...(world || {}),
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
    // R-5b PROMOTION (queue "catchUp-promotion", R-0 recommendation ratified
    // 2026-07-27): catchUpCampaignWorld was the referential `external:undoLastPulse`
    // — a claim that resolved only by NAME. It is now a first-class advertiser,
    // because the delegation makes the arming real (behaviour proved below).
    expect(OPERATIONS.catchUpCampaignWorld.undoToken).toBe('undoLastPulse');
    expect(OPERATIONS.catchUpCampaignWorld.undoState).toBe('action');
    expect(OPERATIONS.catchUpCampaignWorld.description).toMatch(/undone with Undo last pulse/);
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

  // ── R-5b: the reload-into-paused corner, CLOSED (was "DOCUMENTED absence") ──
  // R-0 recorded this corner as unrecoverable because the pre-interval snapshot
  // lived only in the session stack. The owner authorized the one shape widening
  // that fixes it: the advance now ALSO parks that snapshot on the resume cursor
  // (worldState.pausedAdvance.preIntervalUndo), which rehydrates with the campaign.
  // These four pins are the whole contract — arm, restore, continuity, and the
  // old-save degradation that keeps the widening absent-tolerant.

  /** Seed a store, advance one campaign to its first pause, and hand back both the
   *  live store and the persisted pair a reload would see (the JSON round-trip IS
   *  the real persistence hop — the cursor rides inside the campaign record). */
  async function pauseThenPersist() {
    const store = makeStore();
    seedStore(store);
    store.setState(state => { state.campaigns[0].wizardNews = { currentTick: 0, entries: [] }; state.campaigns[0].worldState.tick = 0; });
    const paused = await store.getState().advanceCampaignWorld('camp-1', 'one_year', { now: NOW, autoResolve: false });
    expect(paused.status).toBe('paused');
    return {
      store,
      campaign: JSON.parse(JSON.stringify(store.getState().campaigns[0])),
      saves: JSON.parse(JSON.stringify(store.getState().savedSettlements)),
    };
  }

  function reloadWith(campaign, saves) {
    const reloaded = makeStore();
    reloaded.setState(state => {
      state.savedSettlements = JSON.parse(JSON.stringify(saves));
      state.campaigns = [JSON.parse(JSON.stringify(campaign))];
    });
    // A reload really does start with an empty session stack — otherwise these
    // pins would be proving the in-session path a second time.
    expect(stackOf(reloaded)).toHaveLength(0);
    return reloaded;
  }

  test('reload-into-paused ARMS undo from the cursor, and the pop restores the pre-INTERVAL world and clears the pause', async () => {
    multiTickValue = true;
    const { campaign, saves } = await pauseThenPersist();
    // The widening is really persisted (it survived the JSON hop), and it is the
    // PRE-INTERVAL snapshot: tick 0, the world before the advance ran at all.
    expect(campaign.worldState.pausedAdvance).toBeTruthy();
    expect(campaign.worldState.pausedAdvance.preIntervalUndo).toBeTruthy();
    expect(campaign.worldState.pausedAdvance.preIntervalUndo.worldState.tick).toBe(0);
    expect(campaign.worldState.pausedAdvance.preIntervalUndo.interval).toBe('one_year');
    // Non-vacuous: the paused world had really moved off the pre-interval tick.
    expect(campaign.worldState.tick).toBeGreaterThan(0);

    const reloaded = reloadWith(campaign, saves);
    expect(reloaded.getState().canUndoLastPulse('camp-1')).toBe(true);

    expect(await reloaded.getState().undoLastPulse('camp-1')).toBe(true);
    const ws = reloaded.getState().campaigns[0].worldState;
    expect(ws.tick).toBe(0);
    // Restoring a pre-interval world IS the abandon path: the pause goes with it.
    expect('pausedAdvance' in ws).toBe(false);
    // One shot only — the cursor is gone, so nothing further is advertised.
    expect(reloaded.getState().canUndoLastPulse('camp-1')).toBe(false);
    expect(await reloaded.getState().undoLastPulse('camp-1')).toBe(false);
  }, INTERVAL_TIMEOUT_MS);

  test('reload-into-paused: resuming to completion ADOPTS the parked snapshot, so the offered undo does not vanish mid-flow', async () => {
    multiTickValue = true;
    const { campaign, saves } = await pauseThenPersist();
    const reloaded = reloadWith(campaign, saves);

    let guard = 0; let r;
    do {
      if (guard++ > 60) throw new Error('did not converge');
      r = await reloaded.getState().resolveIntervalMajors('camp-1', {}, { now: NOW });
    } while (r && r.status === 'paused');
    expect(reloaded.getState().campaigns[0].worldState.tick).toBe(52);
    // The cursor is spent, but the snapshot it carried moved onto the session
    // stack exactly once — the advance's own push, arriving late.
    expect(stackOf(reloaded)).toHaveLength(1);
    expect(reloaded.getState().canUndoLastPulse('camp-1')).toBe(true);
    expect(await reloaded.getState().undoLastPulse('camp-1')).toBe(true);
    expect(reloaded.getState().campaigns[0].worldState.tick).toBe(0);
  }, INTERVAL_TIMEOUT_MS);

  test('in-session paused advance still pushes exactly ONE stack entry (the cursor copy never double-counts)', async () => {
    multiTickValue = true;
    const { store } = await pauseThenPersist();
    expect(stackOf(store)).toHaveLength(1);

    let guard = 0; let r;
    do {
      if (guard++ > 60) throw new Error('did not converge');
      r = await store.getState().resolveIntervalMajors('camp-1', {}, { now: NOW });
    } while (r && r.status === 'paused');
    // The adoption branch is guarded on an EMPTY stack, so the in-session path is
    // untouched: still one entry, and one pop still walks the whole interval back.
    expect(stackOf(store)).toHaveLength(1);
    expect(await store.getState().undoLastPulse('camp-1')).toBe(true);
    expect(store.getState().campaigns[0].worldState.tick).toBe(0);
    expect(stackOf(store)).toHaveLength(0);
  }, INTERVAL_TIMEOUT_MS);

  test('OLD-SHAPE cursor (no preIntervalUndo) degrades to the pre-R-5b behaviour, typed honestly', async () => {
    multiTickValue = true;
    const { campaign, saves } = await pauseThenPersist();
    // A save written before the widening: same cursor, minus the new key.
    delete campaign.worldState.pausedAdvance.preIntervalUndo;
    const reloaded = reloadWith(campaign, saves);

    // Honest absence, never a broken restore: nothing advertised, nothing done.
    expect(reloaded.getState().canUndoLastPulse('camp-1')).toBe(false);
    expect(await reloaded.getState().undoLastPulse('camp-1')).toBe(false);
    // And the legacy cursor still RESUMES — the widening is additive, not required.
    let guard = 0; let r;
    do {
      if (guard++ > 60) throw new Error('did not converge');
      r = await reloaded.getState().resolveIntervalMajors('camp-1', {}, { now: NOW });
    } while (r && r.status === 'paused');
    expect(reloaded.getState().campaigns[0].worldState.tick).toBe(52);
    expect(stackOf(reloaded)).toHaveLength(0);
    expect(reloaded.getState().canUndoLastPulse('camp-1')).toBe(false);
  }, INTERVAL_TIMEOUT_MS);

  // ── R-5b: the catch-up promotion, proved at the op site ─────────────────────
  // catchUpCampaignWorld pushes no ring entry of its own; it routes the whole
  // caught-up span through ONE delegated advance whose Phase-2 commit pushes the
  // single pre-catch-up snapshot. These two pins are the behavioural half of the
  // promotion: the armed case really arms, and every no-op case arms NOTHING.
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const LIVING_WORLD = { simulationRules: { worldProgression: 'autonomous' }, lastLivingAdvanceAt: NOW };
  const nowPlusWeeks = weeks => new Date(Date.parse(NOW) + weeks * WEEK_MS).toISOString();

  test('catchUpCampaignWorld ARMS the advertised verb: ONE step for the whole span, and the pop restores the pre-catch-up world', async () => {
    const store = makeStore();
    seedStore(store, { world: LIVING_WORLD });
    const preTick = store.getState().campaigns[0].worldState.tick;
    expect(stackOf(store)).toHaveLength(0);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);

    const res = await store.getState().catchUpCampaignWorld('camp-1', { now: nowPlusWeeks(2) });
    // Non-vacuous: the catch-up really moved the world two weeks.
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: 2, capped: false });
    expect(store.getState().campaigns[0].worldState.tick).toBe(preTick + 2);

    // Exactly ONE armed step covers the WHOLE span (the delegated advance's single
    // push) — the arming the promoted 'action' claim rests on.
    expect(stackOf(store)).toHaveLength(1);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(true);

    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone).toBe(true);
    expect(store.getState().campaigns[0].worldState.tick).toBe(preTick);
    // The M10b cursor rides back with the world, so the undone span is honestly
    // OWED again on the next open rather than silently swallowed.
    expect(store.getState().campaigns[0].worldState.lastLivingAdvanceAt).toBe(NOW);
    expect(stackOf(store)).toHaveLength(0);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
  }, INTERVAL_TIMEOUT_MS);

  test('HONEST ABSENCE: the catch-up paths that move nothing arm nothing (seeded, up-to-date, not living)', async () => {
    // An 'action' claim is per-invocation. A first open with no cursor SEEDS and
    // advances nothing; a cursor under a week old is up_to_date; a dm_advanced
    // world is not_living. None of the three has anything to undo, so none may
    // leave a phantom step behind the advertised verb.
    const seeded = makeStore();
    seedStore(seeded, { world: { simulationRules: { worldProgression: 'autonomous' } } });
    expect(await seeded.getState().catchUpCampaignWorld('camp-1', { now: nowPlusWeeks(9) }))
      .toMatchObject({ ok: true, weeksCaughtUp: 0, reason: 'seeded' });
    expect(stackOf(seeded)).toHaveLength(0);
    expect(seeded.getState().canUndoLastPulse('camp-1')).toBe(false);

    const fresh = makeStore();
    seedStore(fresh, { world: LIVING_WORLD });
    expect(await fresh.getState().catchUpCampaignWorld('camp-1', { now: nowPlusWeeks(0.5) }))
      .toMatchObject({ ok: true, weeksCaughtUp: 0, reason: 'up_to_date' });
    expect(stackOf(fresh)).toHaveLength(0);
    expect(fresh.getState().canUndoLastPulse('camp-1')).toBe(false);

    const dormant = makeStore();
    seedStore(dormant, { world: { lastLivingAdvanceAt: NOW } }); // no progression ⇒ dm_advanced
    expect(await dormant.getState().catchUpCampaignWorld('camp-1', { now: nowPlusWeeks(9) }))
      .toMatchObject({ ok: false, reason: 'not_living' });
    expect(stackOf(dormant)).toHaveLength(0);
    expect(dormant.getState().canUndoLastPulse('camp-1')).toBe(false);
  });

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
