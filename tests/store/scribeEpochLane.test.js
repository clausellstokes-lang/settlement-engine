/**
 * tests/store/scribeEpochLane.test.js — THE UNDONE EPOCH IS SAVED (W2 commit 2).
 *
 * The owner, 2026-09-14 ~06:4x, verbatim: "if advanced time is reverted back, then that past one
 * should be saved." That sentence has a hostile default behind it. The pulse-undo snapshot is a
 * deep clone of every member save, so if the artefact travelled in it, an undo would write back
 * the prose as it stood BEFORE the advance — silently DELETING the epoch the rule exists to keep,
 * and doing it through a path with no test on it. The cure is two halves of one rule:
 *
 *   1. the snapshot STRIPS the artefact (`capturePulseSnapshot`), and
 *   2. the shared restore chokepoint MOVES the LIVE artefact through `restoreToDepth` and
 *      re-attaches it (`restorePulseSnapshotOnDraft` via `store/scribeEpochLane.js`).
 *
 * Neither half is provable alone, so every arm below drives the REAL advance and the REAL undo
 * through the store, not the two functions in isolation. The negative controls are the point: an
 * arm that could not fail is not a pin, so each claim is paired with a run where the value is
 * taken away and the assertion flips.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const { saveUpdate, saveUpsert, saveDelete } = vi.hoisted(() => ({
  saveUpdate: vi.fn(() => Promise.resolve()),
  saveUpsert: vi.fn(entry => Promise.resolve(entry?.id)),
  saveDelete: vi.fn(id => Promise.resolve(id)),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: saveUpdate, upsert: saveUpsert, delete: saveDelete, isConfigured: false },
}));

vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => cached.set(ownerId, clone(campaigns))),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

vi.mock('../../src/lib/flags.js', () => ({ flag: vi.fn(() => false) }));
vi.mock('../../src/lib/analytics.js', async importOriginal => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { capturePulseSnapshot } from '../../src/store/campaignPulseHelpers.js';
import {
  advanceSeqOf,
  carryProseThroughRestore,
  proseAfterRestore,
  retireCurrentForRedo,
  scribePastLaneLimit,
} from '../../src/store/scribeEpochLane.js';
import {
  SCRIBE_PAST_EPOCH_LIMIT, currentAdvanceSeq, landBlock, proseOf, unitsFor,
} from '../../src/lib/scribeArtefact.js';
import { CHRONICLE_LIMITS } from '../../src/lib/chronicle.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';

const NOW = '2026-01-01T00:00:00.000Z';
const EPOCH_0_TEXT = 'The watch keeps a short roll of the men it can call.';
const EPOCH_1_TEXT = 'The roll has grown by a dozen names since the spring.';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => data.set(String(key), String(value)),
    removeItem: key => data.delete(String(key)),
    clear: () => data.clear(),
  };
}

function makeStore() {
  return create(immer((...args) => ({
    savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
    eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null,
    lastExportAt: null,
    ...createCampaignSlice(...args),
    ...createCampaignWorldPulseSlice(...args),
  })));
}

const unit = text => ({ vid: 3, spine: text, faces: [text], notebook: [], verdicts: ['PASS'], report: {} });

/** One rendered epoch, landed the way the outbox lands one: a block at a time. */
function renderedAt(prose, seq, text) {
  return landBlock(prose, {
    advanceSeq: seq,
    blockId: 'DS-DEF-2',
    pools: { 'FAMILY: acute crisis': [unit(text)] },
    renderedFor: 'seed-ashford',
    renderedAt: NOW,
    version: { scribe: 'sc1', engine: 'eng1', refuter: 'rf1', model: 'claude-opus-5' },
  });
}

function townOf({ scribed = true } = {}) {
  const town = {
    id: 'ashford', name: 'Ashford', tier: 'city', population: 12000, culture: 'germanic',
    _seed: 'seed-ashford',
    config: { tier: 'city', settType: 'city', tradeRouteAccess: 'road' },
    institutions: [], factions: [], npcs: [], activeConditions: [],
    economicState: { prosperity: 'Stable', primaryImports: [], primaryExports: [] },
    powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
  };
  return scribed ? { ...town, prose: renderedAt(null, 0, EPOCH_0_TEXT) } : town;
}

function seedStore(store, options) {
  const town = townOf(options);
  store.setState(state => {
    state.savedSettlements = [{
      id: 'ashford', name: 'Ashford', phase: 'canon', settlement: town,
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      settlementIds: ['ashford'],
      regionalGraph: ensureRegionalGraph({
        nodes: [{ id: 'ashford', name: 'Ashford', tier: 'city', settlementId: 'ashford', updatedAt: NOW }],
      }, { now: NOW }),
      wizardNews: { currentTick: 8, entries: [] },
      worldState: ensureWorldState({
        rngSeed: 'scribe-epoch-lane', tick: 8, canonizedAt: NOW,
        simulationRules: { settlementLifecycleEnabled: false, lineageClaimEnabled: false },
      }, { id: 'camp-1', name: 'Realm' }),
    }];
    state.activeSaveId = 'ashford';
    state.settlement = town;
    state.phase = 'canon';
  });
  return store;
}

const liveTown = store => store.getState().savedSettlements.find(s => String(s.id) === 'ashford').settlement;

describe('THE PULSE-UNDO SNAPSHOT CARRIES NO PROSE', () => {
  beforeEach(installLocalStorage);

  test('capturePulseSnapshot strips the artefact from every clone it takes', () => {
    const store = seedStore(makeStore());
    const state = store.getState();
    const snapshot = capturePulseSnapshot(state, state.campaigns[0], NOW);

    expect('prose' in snapshot.saves[0].settlement).toBe(false);
    expect('prose' in snapshot.active.settlement).toBe(false);
    expect(JSON.stringify(snapshot)).not.toContain(EPOCH_0_TEXT);
    // NEGATIVE CONTROL — the snapshot is otherwise a real clone of the town, so the arm above
    // is not passing because the capture returned nothing.
    expect(snapshot.saves[0].settlement.name).toBe('Ashford');
    expect(snapshot.saves[0].settlement.population).toBe(12000);
    // And the LIVE object still has it: the artefact was stripped from the COPY, never moved.
    expect(proseOf(liveTown(store))).not.toBe(null);
  });

  test('a real advance leaves an undo entry with no prose in it', async () => {
    const store = seedStore(makeStore());
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });

    const after = store.getState();
    expect(after.pulseUndoStack.length).toBeGreaterThan(0);
    expect(JSON.stringify(after.pulseUndoStack)).not.toContain(EPOCH_0_TEXT);
    // The advance moved the epoch counter, which is what makes the artefact stale.
    expect(advanceSeqOf(after, 'camp-1')).toBe(1);
    // The advance renders NOTHING by itself (rule 14: the OPEN renders).
    expect(currentAdvanceSeq(proseOf(liveTown(store)))).toBe(0);
  });
});

describe('THE UNDONE EPOCH IS SAVED, NOT DROPPED', () => {
  beforeEach(installLocalStorage);

  test('an undo moves epoch 1 into the past lane and re-points current at epoch 0', async () => {
    const store = seedStore(makeStore());
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });

    // Epoch 1 is rendered the way the trigger renders it: the OPEN, after the advance.
    store.setState(state => {
      const row = state.savedSettlements.find(s => String(s.id) === 'ashford');
      row.settlement.prose = renderedAt(row.settlement.prose, 1, EPOCH_1_TEXT);
      state.settlement = row.settlement;
    });
    expect(currentAdvanceSeq(proseOf(liveTown(store)))).toBe(1);

    expect(await store.getState().undoLastPulse('camp-1')).toBe(true);

    const prose = proseOf(liveTown(store));
    expect(prose, 'the artefact must survive the restore at all').not.toBe(null);
    // ⭐ THE OWNER'S RULE, stated as three numbers: current is back at epoch 0, epoch 1 is in
    // the lane marked undone, and its TEXT is still readable.
    expect(currentAdvanceSeq(prose)).toBe(0);
    const undone = prose.epochs.filter(e => e.state === 'undone');
    expect(undone).toHaveLength(1);
    expect(undone[0].advanceSeq).toBe(1);
    expect(JSON.stringify(undone[0])).toContain(EPOCH_1_TEXT);
    // Epoch 0's units are drawable again, which is what "re-points current" has to mean.
    expect(unitsFor(prose, {
      blockId: 'DS-DEF-2', poolKey: 'FAMILY: acute crisis', renderedFor: 'seed-ashford',
    })[0].spine).toBe(EPOCH_0_TEXT);
    // The nonce is stamped, because the seq will be re-used by a DIFFERENT future.
    expect(String(undone[0].nonce).length).toBeGreaterThan(0);
    // The LIVE VIEW and the saved row agree, and the move happened exactly ONCE.
    expect(JSON.stringify(proseOf(store.getState().settlement))).toBe(JSON.stringify(prose));
    expect(prose.epochs.filter(e => e.advanceSeq === 1)).toHaveLength(1);
  });

  test('NEGATIVE CONTROL — without the cure the undo would restore the pre-advance artefact', async () => {
    // The defect this commit exists to prevent, shown by simulating the OLD behaviour: restore
    // the settlement the snapshot carries WITHOUT the move. Epoch 1 is gone with no trace. This
    // arm fails the day someone removes the strip-and-move and lets the snapshot win.
    const store = seedStore(makeStore());
    const state = store.getState();
    const snapshot = capturePulseSnapshot(state, state.campaigns[0], NOW);
    const withEpochOne = { ...townOf(), prose: renderedAt(townOf().prose, 1, EPOCH_1_TEXT) };

    const naive = JSON.parse(JSON.stringify(snapshot.saves[0].settlement));
    expect(JSON.stringify(naive)).not.toContain(EPOCH_1_TEXT);
    expect('prose' in naive).toBe(false);

    const cured = carryProseThroughRestore(withEpochOne, naive, { advanceSeq: 0, at: NOW, nonce: 'n' });
    expect(JSON.stringify(cured)).toContain(EPOCH_1_TEXT);
    expect(currentAdvanceSeq(proseOf(cured))).toBe(0);
  });

  test('an UNSCRIBED town advances and undoes byte-identically to before the Scribe', async () => {
    const store = seedStore(makeStore(), { scribed: false });
    const before = JSON.stringify(liveTown(store));
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });
    expect(await store.getState().undoLastPulse('camp-1')).toBe(true);

    const after = liveTown(store);
    expect('prose' in after).toBe(false);
    expect(JSON.stringify(after)).toBe(before);
  });

  test('the move is a no-op on a settlement with nothing to move', () => {
    expect(proseAfterRestore({ id: 'x' }, { advanceSeq: 0 })).toBe(null);
    expect(proseAfterRestore(null, { advanceSeq: 0 })).toBe(null);
    const plain = { id: 'x' };
    expect(carryProseThroughRestore(null, plain, { advanceSeq: 0 })).toBe(plain);
  });
});

describe('REDO — the render a redraw replaces is saved the same way', () => {
  test('retireCurrentForRedo moves current into the lane marked redone and deletes nothing', () => {
    const town = townOf();
    const after = retireCurrentForRedo(town, { at: NOW, nonce: 'redo-1' });

    const prose = proseOf(after);
    expect(prose.current).toBe(null);
    expect(prose.epochs).toHaveLength(1);
    expect(prose.epochs[0].state).toBe('redone');
    expect(prose.epochs[0].redoneAt).toBe(NOW);
    expect(JSON.stringify(prose.epochs[0])).toContain(EPOCH_0_TEXT);
    // Pure: the input town is untouched, so a failed redraw leaves the world as it was.
    expect(currentAdvanceSeq(proseOf(town))).toBe(0);
  });

  test('NEGATIVE CONTROL — a REDO on a town that was never scribed is the same object back', () => {
    const plain = { id: 'x', name: 'Plain' };
    expect(retireCurrentForRedo(plain, { at: NOW })).toBe(plain);
    expect(retireCurrentForRedo(null, { at: NOW })).toBe(null);
  });
});

describe('THE LANE IS BOUNDED BY THE TIER, AND CLAMPED BY THE BLOB', () => {
  test('the limit is read from the chronicle promise, never invented', () => {
    expect(scribePastLaneLimit({ isPremium: () => false, isElevated: () => false }))
      .toBe(CHRONICLE_LIMITS.free);
    // Two of the three chronicle tiers are Infinity and a JSONB row cannot be unbounded, so the
    // artefact's hard ceiling clamps them. Whether the owner wants every epoch forever on the
    // blob is a storage decision and stays owner-gated (design §12 item 13).
    expect(CHRONICLE_LIMITS.premium).toBe(Infinity);
    expect(scribePastLaneLimit({ isPremium: () => true })).toBe(SCRIBE_PAST_EPOCH_LIMIT);
    expect(scribePastLaneLimit({ isElevated: () => true })).toBe(SCRIBE_PAST_EPOCH_LIMIT);
    // A state with no entitlement predicates at all reads as the free tier, never as unbounded.
    expect(scribePastLaneLimit({})).toBe(CHRONICLE_LIMITS.free);
    expect(scribePastLaneLimit(null)).toBe(CHRONICLE_LIMITS.free);
  });

  test('a free-tier lane keeps exactly its tier number of past epochs', () => {
    let prose = renderedAt(null, 0, EPOCH_0_TEXT);
    for (let seq = 1; seq <= CHRONICLE_LIMITS.free + 4; seq += 1) {
      prose = landBlock(prose, {
        advanceSeq: seq,
        blockId: 'DS-DEF-2',
        pools: { 'FAMILY: acute crisis': [unit(`epoch ${seq}`)] },
        renderedFor: 'seed-ashford',
        renderedAt: NOW,
        limit: CHRONICLE_LIMITS.free,
      });
    }
    expect(prose.epochs).toHaveLength(CHRONICLE_LIMITS.free);
    // Oldest out first: epoch 0 is gone, the newest retired epoch is still there.
    expect(prose.epochs.map(e => e.advanceSeq)).toEqual([4, 5, 6, 7, 8]);
  });
});
