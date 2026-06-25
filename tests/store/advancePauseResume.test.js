/**
 * tests/store/advancePauseResume.test.js — Advance-scaling Stage 3 store path.
 *
 * Pins the autoresolve-OFF PAUSE/RESUME store machine end-to-end:
 *   • FLAG ON + autoResolve OFF — an Advance PAUSES at the first tick that surfaces
 *     majors: the campaign worldState advances to the pause tick (minors committed)
 *     and a pausedAdvance cursor is parked.
 *   • resolveIntervalMajors continues the remaining ticks (recommended) and CLEARS
 *     pausedAdvance once the interval finishes — landing the SAME tick the
 *     autoresolve-ON path reaches.
 *   • RELOAD mid-pause: a fresh store hydrated with the persisted campaign (cursor on
 *     worldState) resumes deterministically to the same end (no double-advance).
 *   • UNDO of a paused interval reverts to pre-tick-0 (the backward path) and drops
 *     the cursor.
 *   • A non-paused (autoResolve ON) advance carries NO pausedAdvance key (byte-neutral).
 *
 * The fixture uses a rival/hostile two-edge graph so the live
 * faction_government_challenge candidate fires structural majors (first at tick 5).
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

let multiTickValue = true;
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

function seedStore(store) {
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
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'pause-store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
}

const NOW = '2026-01-01T00:00:00.000Z';

describe('advance pause/resume store path (Stage 3)', () => {
  beforeEach(() => {
    installLocalStorage();
    multiTickValue = true;
  });

  test('autoResolve OFF: an Advance PAUSES at the first major tick and parks pausedAdvance', async () => {
    const store = makeStore();
    seedStore(store);

    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_year', { now: NOW, autoResolve: false });
    expect(result.status).toBe('paused');
    expect(result.atTick).toBeGreaterThanOrEqual(1);

    const ws = store.getState().campaigns[0].worldState;
    // The committed worldState advanced to the pause tick (minors landed).
    expect(ws.tick).toBe(result.atTick);
    // The cursor is parked, carrying the pending majors + pre-tick snapshot.
    expect(ws.pausedAdvance).toBeTruthy();
    expect(ws.pausedAdvance.pendingMajors.length).toBeGreaterThan(0);
    expect(ws.pausedAdvance.ticksTotal).toBe(48);
    expect(ws.pausedAdvance.preSnapshot.worldState.tick).toBe(result.atTick - 1);
    // Exactly ONE undo snapshot for the whole interval.
    expect(store.getState().pulseUndoStack.filter(s => s.campaignId === 'camp-1')).toHaveLength(1);
  });

  test('resolveIntervalMajors (recommended) finishes the interval and clears pausedAdvance', async () => {
    const store = makeStore();
    seedStore(store);
    await store.getState().advanceCampaignWorld('camp-1', 'one_year', { now: NOW, autoResolve: false });

    // Drain every pause to recommended until complete.
    let guard = 0;
    let r;
    do {
      if (guard++ > 60) throw new Error('did not converge');
      r = await store.getState().resolveIntervalMajors('camp-1', {}, { now: NOW });
    } while (r && r.status === 'paused');

    const ws = store.getState().campaigns[0].worldState;
    expect(ws.tick).toBe(48);
    expect('pausedAdvance' in ws).toBe(false); // byte-neutral: cleared

    // EQUIVALENCE at the store layer: a fresh autoResolve-ON run reaches the same tick.
    const on = makeStore();
    seedStore(on);
    const onResult = await on.getState().advanceCampaignWorld('camp-1', 'one_year', { now: NOW, autoResolve: true });
    expect(onResult.worldState.tick).toBe(48);
    expect(store.getState().campaigns[0].worldState.worldState).toEqual(onResult.worldState.worldState);
  });

  test('RELOAD mid-pause: a fresh store hydrated from the persisted campaign resumes deterministically', async () => {
    const store = makeStore();
    seedStore(store);
    await store.getState().advanceCampaignWorld('camp-1', 'one_year', { now: NOW, autoResolve: false });
    const persistedCampaign = JSON.parse(JSON.stringify(store.getState().campaigns[0]));
    const persistedSaves = JSON.parse(JSON.stringify(store.getState().savedSettlements));
    expect(persistedCampaign.worldState.pausedAdvance).toBeTruthy();

    // Reload: a NEW store seeded from the persisted (paused) campaign — the undo
    // stack is gone (session-scoped), but the cursor on worldState rehydrates the pause.
    const reloaded = makeStore();
    reloaded.setState(state => {
      state.savedSettlements = persistedSaves;
      state.campaigns = [persistedCampaign];
    });
    expect(reloaded.getState().getPausedAdvance('camp-1')).toBeTruthy();

    let guard = 0; let r;
    do {
      if (guard++ > 60) throw new Error('did not converge');
      r = await reloaded.getState().resolveIntervalMajors('camp-1', {}, { now: NOW });
    } while (r && r.status === 'paused');

    expect(reloaded.getState().campaigns[0].worldState.tick).toBe(48);

    // No double-advance: the never-reloaded resume reaches the same end state.
    const direct = makeStore();
    seedStore(direct);
    await direct.getState().advanceCampaignWorld('camp-1', 'one_year', { now: NOW, autoResolve: false });
    let g2 = 0; let dr;
    do { if (g2++ > 60) throw new Error('loop'); dr = await direct.getState().resolveIntervalMajors('camp-1', {}, { now: NOW }); } while (dr && dr.status === 'paused');
    expect(reloaded.getState().campaigns[0].worldState.worldState).toEqual(direct.getState().campaigns[0].worldState.worldState);
  });

  test('UNDO of a paused interval reverts to pre-tick-0 and drops the cursor', async () => {
    const store = makeStore();
    seedStore(store);
    await store.getState().advanceCampaignWorld('camp-1', 'one_year', { now: NOW, autoResolve: false });
    expect(store.getState().campaigns[0].worldState.pausedAdvance).toBeTruthy();

    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone).toBe(true);
    const ws = store.getState().campaigns[0].worldState;
    expect(ws.tick).toBe(0);
    expect('pausedAdvance' in ws).toBe(false);
    expect(store.getState().pulseUndoStack.filter(s => s.campaignId === 'camp-1')).toHaveLength(0);
  });

  test('autoResolve ON: a completed advance carries NO pausedAdvance key (byte-neutral)', async () => {
    const store = makeStore();
    seedStore(store);
    const r = await store.getState().advanceCampaignWorld('camp-1', 'one_year', { now: NOW, autoResolve: true });
    expect(r.status).toBe('complete');
    expect('pausedAdvance' in store.getState().campaigns[0].worldState).toBe(false);
  });
});
