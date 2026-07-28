/**
 * tests/store/proposalUndoRing.test.js — R-1 (queue #5): the REAL
 * applyWorldPulseProposal arming, against the SEPARATE session proposal-undo
 * ring (`proposalUndoStack`, PROPOSAL_UNDO_CAP=5 per campaign,
 * campaignWorldPulseDeferred.js).
 *
 * What the ring guarantees, pinned here:
 *   • RESTORE — undoLastProposalApply pops the newest pre-apply snapshot and
 *     restores the pre-apply world: the proposal returns to `pending`, its
 *     applied condition leaves the member save, and the pop is stepwise
 *     (repeat calls walk back apply by apply).
 *   • SEPARATION BY CONSTRUCTION — proposal traffic lands on its own array;
 *     the advance stack is never pushed, never popped, never evicted by it
 *     (the R-0 cap-flood finding; the advance-side pins live in
 *     pulseUndoAdvertising.test.js).
 *   • CAP — the ring keeps at most PROPOSAL_UNDO_CAP entries PER campaign and
 *     evicts only that campaign's oldest PROPOSAL entry; other campaigns'
 *     entries are untouched.
 *   • ORDER COHERENCE — each entry stamps the campaign's LOGICAL advance depth
 *     at push (`advanceDepth`, the clock-independent happens-before). A
 *     proposal snapshot is restorable only while the advance depth still
 *     equals its stamp: an advance landing after the apply blocks it (undo the
 *     advance first); an advance-undo that rewinds PAST an apply prunes the
 *     now-impossible future instead of leaving a fast-forward restore.
 *   • SATURATION (R-1 MUST-FIX) — the stamped depth is the session counter
 *     `advanceSeqByCampaign`, NOT a count of retained advance snapshots: the
 *     advance stack evicts past PULSE_UNDO_CAP (10), so a retained-entry count
 *     pegs at the cap and would pass STALE proposal snapshots after the 10th
 *     advance. The counter keeps rising through eviction, and undoLastPulse
 *     decrements it as it pops so the legitimate walk-back still re-arms.
 *   • OWNER FENCE — entries stamp the owner/session at push and refuse to
 *     restore under a different session (same-UUID campaigns across accounts;
 *     the advance stack gets the equivalent from clearTransientCampaignWork).
 *   • LIFECYCLE CLEARS (R-1 MUST-FIX) — a same-owner re-auth
 *     (invalidateCampaignSession → clearTransientCampaignWork) empties the ring
 *     and its counter along with the advance stack, un-lighting the toolbar
 *     History chip; BOTH campaign-delete paths (optimistic deleteCampaign and
 *     the confirmed finishConfirmedCampaignDelete) sweep the deleted campaign's
 *     ring entries and counter key while leaving other campaigns' intact.
 *
 * Harness: the REAL campaign + world-pulse slices on a real zustand store
 * (the pulseUndoAdvertising.test.js idiom, verbatim).
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

vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => false),
}));

vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { PROPOSAL_UNDO_CAP } from '../../src/store/campaignWorldPulseDeferred.js';
import { finishConfirmedCampaignDelete } from '../../src/store/campaignDeletionSession.js';
import { captureCampaignSession } from '../../src/store/campaignSliceShared.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

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

function seedStore(store, { proposals = [], wizardNewsEntries = [] } = {}) {
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
      wizardNews: { currentTick: 1, entries: wizardNewsEntries },
      worldState: {
        rngSeed: 'proposal-undo-ring-seed', tick: 1, canonizedAt: NOW,
        proposals,
      },
    }];
  });
}

/** A minimal pending condition proposal the domain applier accepts (the
 *  pulseUndoAdvertising fixture), targeted per save with a distinct id. */
function pendingProposal(target = 'a', suffix = '0') {
  return {
    id: `world_proposal.famine.${target}.${suffix}`,
    kind: 'condition',
    status: 'pending',
    tick: 1,
    severity: 0.8,
    headline: `Famine pressure may take hold in ${target}`,
    summary: 'Food pressure has crossed a threshold.',
    reasons: ['test'],
    outcome: {
      id: `candidate.condition.food.${target}.${suffix}`,
      type: 'condition',
      candidateType: 'food_pressure',
      targetSaveId: target,
      severity: 0.8,
      headline: `Famine pressure may take hold in ${target}`,
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
  (store.getState().pulseUndoStack || []).filter(s => String(s.campaignId) === String(campaignId));
const ringOf = (store, campaignId = 'camp-1') =>
  (store.getState().proposalUndoStack || []).filter(s => String(s.campaignId) === String(campaignId));
const statusOf = (store, proposalId) =>
  (store.getState().campaigns[0].worldState.proposals || []).find(p => p.id === proposalId)?.status;
const famineOn = (store, saveId) =>
  ((store.getState().savedSettlements.find(s => s.id === saveId)?.settlement.activeConditions) || [])
    .some(c => c.archetype === 'famine');

// The mixed-ordering tests run a real single-tick advance (the sim, 3 saves).
const ADVANCE_TIMEOUT_MS = 40_000;

describe('R-1 proposal-undo ring (queue #5)', () => {
  beforeEach(() => {
    installLocalStorage();
  });

  test('RESTORE: undo returns the pre-apply world — the proposal is pending again and its condition is gone', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [pendingProposal('a')] });

    const applied = await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a.0');
    expect(applied).toBeTruthy();
    expect(statusOf(store, 'world_proposal.famine.a.0')).toBe('applied');
    expect(famineOn(store, 'a')).toBe(true);
    expect(ringOf(store)).toHaveLength(1);

    const undone = await store.getState().undoLastProposalApply('camp-1');
    expect(undone).toBe(true);
    // Pre-apply state, whole: the proposal is back on the adjudication desk…
    expect(statusOf(store, 'world_proposal.famine.a.0')).toBe('pending');
    // …the applied condition left the member save…
    expect(famineOn(store, 'a')).toBe(false);
    // …the entry was popped, and a second undo honestly refuses (empty ring).
    expect(ringOf(store)).toHaveLength(0);
    expect(await store.getState().undoLastProposalApply('camp-1')).toBe(false);
  });

  test('a legacy record-mode proposal is tombstoned without mechanics, news, or an undo entry', async () => {
    const store = makeStore();
    const legacyHold = {
      id: 'world_proposal.legacy.hold',
      status: 'pending',
      tick: 1,
      headline: 'Hold the line',
      outcome: {
        id: 'candidate.strategy.hold.a.1',
        candidateType: 'strategy_hold',
        targetSaveId: 'a',
        applyMode: 'proposal',
        metadata: { settlementId: 'a', strategyMove: 'hold' },
        conflictTags: ['strategy:a'],
      },
    };
    const staleNews = {
      id: `wizard_news.1.world_pulse.proposal.${legacyHold.outcome.id}`,
      kind: 'queued',
      sourceEventId: legacyHold.outcome.id,
      tags: ['world_pulse', 'strategy_hold', 'proposal'],
    };
    const unrelatedNews = {
      id: 'wizard_news.1.applied.unrelated',
      kind: 'applied',
      sourceEventId: 'unrelated',
      tags: ['world_pulse', 'applied'],
    };
    seedStore(store, {
      proposals: [legacyHold],
      wizardNewsEntries: [staleNews, unrelatedNews],
    });
    const settlementsBefore = JSON.parse(JSON.stringify(store.getState().savedSettlements));

    const result = await store.getState()
      .applyWorldPulseProposal('camp-1', legacyHold.id);

    expect(result.proposalDisposition).toBe('superseded');
    expect(statusOf(store, legacyHold.id)).toBe('superseded');
    expect(store.getState().savedSettlements).toEqual(settlementsBefore);
    expect(store.getState().campaigns[0].wizardNews).toEqual({
      currentTick: 1,
      entries: [unrelatedNews],
    });
    expect(ringOf(store)).toEqual([]);
  });

  test('RESTORE is stepwise: two applies walk back newest-first', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [pendingProposal('a'), pendingProposal('b', '1')] });

    expect(await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a.0')).toBeTruthy();
    expect(await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.b.1')).toBeTruthy();
    expect(ringOf(store)).toHaveLength(2);
    expect(famineOn(store, 'a')).toBe(true);
    expect(famineOn(store, 'b')).toBe(true);

    // First undo reverts the NEWEST apply (b) only.
    expect(await store.getState().undoLastProposalApply('camp-1')).toBe(true);
    expect(famineOn(store, 'b')).toBe(false);
    expect(famineOn(store, 'a')).toBe(true);
    expect(statusOf(store, 'world_proposal.famine.b.1')).toBe('pending');
    expect(statusOf(store, 'world_proposal.famine.a.0')).toBe('applied');

    // Second undo reverts the older apply (a).
    expect(await store.getState().undoLastProposalApply('camp-1')).toBe(true);
    expect(famineOn(store, 'a')).toBe(false);
    expect(statusOf(store, 'world_proposal.famine.a.0')).toBe('pending');
    expect(ringOf(store)).toHaveLength(0);
  });

  test('CAP: the ring holds PROPOSAL_UNDO_CAP entries per campaign, evicting only that campaign\'s oldest', async () => {
    const store = makeStore();
    const proposals = ['a', 'b', 'c', 'a', 'b', 'c', 'a']
      .map((target, i) => pendingProposal(target, String(i)));
    seedStore(store, { proposals });
    // A foreign campaign's ring entry, seeded directly: camp-1's cap churn
    // must never evict it (per-campaign eviction, mirroring the advance stack).
    store.setState(state => {
      state.proposalUndoStack = [{ campaignId: 'camp-2', kind: 'proposal', proposalId: 'foreign', advanceDepth: 0 }];
    });

    for (const proposal of proposals) {
      expect(await store.getState().applyWorldPulseProposal('camp-1', proposal.id), proposal.id).toBeTruthy();
    }
    // 7 applies, cap 5: the two oldest of CAMP-1 dropped, newest 5 retained in order.
    expect(PROPOSAL_UNDO_CAP).toBe(5);
    const mine = ringOf(store);
    expect(mine).toHaveLength(5);
    expect(mine.map(e => e.proposalId)).toEqual(
      proposals.slice(2).map(p => p.id),
    );
    // The foreign entry survived; the advance stack was never touched.
    expect(ringOf(store, 'camp-2')).toHaveLength(1);
    expect(stackOf(store)).toHaveLength(0);
  });

  test('ORDER COHERENCE (advance after apply): the proposal snapshot is blocked until the advance is undone, then restores', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [pendingProposal('a')] });
    const preTick = store.getState().campaigns[0].worldState.tick;

    // Apply FIRST (ring entry stamps advanceDepth 0), then advance.
    expect(await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a.0')).toBeTruthy();
    expect(ringOf(store)[0].advanceDepth).toBe(0);
    const advanced = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });
    expect(advanced).toBeTruthy();
    const postAdvanceTick = store.getState().campaigns[0].worldState.tick;
    expect(stackOf(store)).toHaveLength(1);

    // Restoring the pre-apply world UNDER the advance would silently rewind the
    // advance while leaving its undo entry behind — refused, nothing popped.
    expect(await store.getState().undoLastProposalApply('camp-1')).toBe(false);
    expect(ringOf(store)).toHaveLength(1);
    expect(store.getState().campaigns[0].worldState.tick).toBe(postAdvanceTick);

    // Undo the advance: the ring entry (captured BEFORE it) survives the prune…
    expect(await store.getState().undoLastPulse('camp-1')).toBe(true);
    expect(store.getState().campaigns[0].worldState.tick).toBe(preTick);
    expect(ringOf(store)).toHaveLength(1);
    // …and is poppable again: the full two-step walk lands at pre-apply.
    expect(await store.getState().undoLastProposalApply('camp-1')).toBe(true);
    expect(statusOf(store, 'world_proposal.famine.a.0')).toBe('pending');
    expect(famineOn(store, 'a')).toBe(false);
  }, ADVANCE_TIMEOUT_MS);

  test('ORDER COHERENCE (apply after advance): proposal undo restores the post-advance world and leaves the advance snapshot intact', async () => {
    const store = makeStore();
    seedStore(store);
    const advanced = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });
    expect(advanced).toBeTruthy();
    const postAdvanceTick = store.getState().campaigns[0].worldState.tick;

    store.setState(state => {
      const worldState = state.campaigns[0].worldState;
      worldState.proposals = [...(worldState.proposals || []), pendingProposal('a')];
    });
    expect(await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a.0')).toBeTruthy();
    expect(ringOf(store)[0].advanceDepth).toBe(1);
    expect(famineOn(store, 'a')).toBe(true);

    // Newest act first: the proposal undo restores the post-advance/pre-apply
    // world — the tick does NOT move — and the advance snapshot stays put.
    expect(await store.getState().undoLastProposalApply('camp-1')).toBe(true);
    expect(store.getState().campaigns[0].worldState.tick).toBe(postAdvanceTick);
    expect(famineOn(store, 'a')).toBe(false);
    expect(stackOf(store)).toHaveLength(1);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(true);
  }, ADVANCE_TIMEOUT_MS);

  test('OWNER FENCE: an entry minted under another campaign session refuses to restore', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [pendingProposal('a')] });
    expect(await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a.0')).toBeTruthy();
    expect(ringOf(store)).toHaveLength(1);

    // The auth boundary rotates campaignSessionGeneration; the stamped entry is
    // now another session's world and must never restore into this one.
    store.setState(state => { state.campaignSessionGeneration = (state.campaignSessionGeneration || 0) + 1; });
    expect(await store.getState().undoLastProposalApply('camp-1')).toBe(false);
    expect(statusOf(store, 'world_proposal.famine.a.0')).toBe('applied');
    expect(famineOn(store, 'a')).toBe(true);
  });

  test('PAUSE GUARD: a parked multi-tick interval refuses a proposal restore (resume would clobber it)', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [pendingProposal('a')] });
    expect(await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a.0')).toBeTruthy();

    store.setState(state => {
      state.campaigns[0].worldState.pausedAdvance = { interval: 'one_year', ticksTotal: 52, ticksDone: 3 };
    });
    expect(await store.getState().undoLastProposalApply('camp-1')).toBe(false);
    expect(ringOf(store)).toHaveLength(1);
  });

  test('SATURATION: an advance past PULSE_UNDO_CAP eviction still invalidates the stale snapshot, and the legitimate walk-back re-arms', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [pendingProposal('a')] });
    // As if 10 real advances (PULSE_UNDO_CAP, campaignAdvanceSession.js) already
    // landed: the retained window is FULL and the logical depth counter agrees.
    // The synthetic entries are never restored — only the real advance below is.
    store.setState(state => {
      state.pulseUndoStack = Array.from({ length: 10 }, (_, i) => ({
        campaignId: 'camp-1', tick: i + 1, synthetic: true,
      }));
      state.advanceSeqByCampaign = { 'camp-1': 10 };
    });

    // Apply at depth 10, then land one REAL advance: the push EVICTS the oldest
    // retained snapshot (count pegs at 10 — the old guard's fail-open input)
    // while the logical depth moves to 11.
    expect(await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a.0')).toBeTruthy();
    expect(ringOf(store)[0].advanceDepth).toBe(10);
    expect(await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW })).toBeTruthy();
    expect(stackOf(store)).toHaveLength(10);
    expect(store.getState().advanceSeqByCampaign['camp-1']).toBe(11);
    const postAdvanceTick = store.getState().campaigns[0].worldState.tick;

    // The pre-apply snapshot describes a world 1 advance old. A retained-entry
    // count says depth 10 === stamp 10 and would restore it STALE; the counter
    // says 11 !== 10 and refuses, leaving the entry for the coherent walk.
    expect(await store.getState().undoLastProposalApply('camp-1')).toBe(false);
    expect(ringOf(store)).toHaveLength(1);
    expect(statusOf(store, 'world_proposal.famine.a.0')).toBe('applied');
    expect(store.getState().campaigns[0].worldState.tick).toBe(postAdvanceTick);

    // Legitimate ordering preserved: undoing the advance restores depth 10
    // (pop decrements; the prune keeps entries stamped AT the restored depth),
    // and the proposal snapshot becomes honestly poppable again.
    expect(await store.getState().undoLastPulse('camp-1')).toBe(true);
    expect(store.getState().advanceSeqByCampaign['camp-1']).toBe(10);
    expect(ringOf(store)).toHaveLength(1);
    expect(await store.getState().undoLastProposalApply('camp-1')).toBe(true);
    expect(statusOf(store, 'world_proposal.famine.a.0')).toBe('pending');
    expect(famineOn(store, 'a')).toBe(false);
  }, ADVANCE_TIMEOUT_MS);

  test('RE-AUTH CLEAR: invalidateCampaignSession empties the ring + counter and un-lights the History chip', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [pendingProposal('a')] });
    expect(await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a.0')).toBeTruthy();
    // The WorldMapToolbar History chip lights from exactly this selector shape.
    const chipLit = (s) => (s.proposalUndoStack || [])
      .some(e => e && String(e.campaignId) === String('camp-1'));
    expect(chipLit(store.getState())).toBe(true);

    // Same-owner re-auth boundary: clearTransientCampaignWork must sweep the
    // proposal ring and its depth counter along with the advance stack — a ring
    // that survives here advertises a dead undo into the replacement session.
    store.getState().invalidateCampaignSession();
    expect(store.getState().proposalUndoStack).toEqual([]);
    expect(store.getState().pulseUndoStack).toEqual([]);
    expect(store.getState().advanceSeqByCampaign).toEqual({});
    expect(chipLit(store.getState())).toBe(false);
    expect(await store.getState().undoLastProposalApply('camp-1')).toBe(false);
    expect(statusOf(store, 'world_proposal.famine.a.0')).toBe('applied');
  });

  test('DELETE HYGIENE (optimistic path): deleteCampaign leaves no orphan ring entries or counter key', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [pendingProposal('a')] });
    expect(await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a.0')).toBeTruthy();
    store.setState(state => {
      state.proposalUndoStack.push({ campaignId: 'camp-2', kind: 'proposal', proposalId: 'foreign', advanceDepth: 0 });
      state.pulseUndoStack = [{ campaignId: 'camp-2', tick: 1 }];
      state.advanceSeqByCampaign['camp-2'] = 3;
    });

    await store.getState().deleteCampaign('camp-1');
    expect(store.getState().campaigns).toHaveLength(0);
    expect(ringOf(store, 'camp-1')).toHaveLength(0);
    expect(Object.keys(store.getState().advanceSeqByCampaign)).not.toContain('camp-1');
    // Another campaign's history is untouched by the sweep.
    expect(ringOf(store, 'camp-2')).toHaveLength(1);
    expect(stackOf(store, 'camp-2')).toHaveLength(1);
    expect(store.getState().advanceSeqByCampaign['camp-2']).toBe(3);
  });

  test('DELETE HYGIENE (confirmed path): finishConfirmedCampaignDelete sweeps the ring and counter too', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [pendingProposal('a')] });
    expect(await store.getState().applyWorldPulseProposal('camp-1', 'world_proposal.famine.a.0')).toBeTruthy();
    store.setState(state => {
      state.proposalUndoStack.push({ campaignId: 'camp-2', kind: 'proposal', proposalId: 'foreign', advanceDepth: 0 });
      state.advanceSeqByCampaign['camp-2'] = 2;
    });

    const session = captureCampaignSession(store.getState());
    const result = await finishConfirmedCampaignDelete({
      campaign: { id: 'camp-1' },
      campaignService: { delete: vi.fn(() => Promise.resolve()), recordTombstone: vi.fn() },
      get: store.getState,
      markRemoteDeleted: vi.fn(),
      session,
      set: store.setState,
    });
    expect(result).toEqual({ ok: true, campaignId: 'camp-1' });
    expect(store.getState().campaigns).toHaveLength(0);
    expect(ringOf(store, 'camp-1')).toHaveLength(0);
    expect(Object.keys(store.getState().advanceSeqByCampaign)).not.toContain('camp-1');
    expect(ringOf(store, 'camp-2')).toHaveLength(1);
    expect(store.getState().advanceSeqByCampaign['camp-2']).toBe(2);
  });
});
