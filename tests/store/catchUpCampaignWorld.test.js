/**
 * tests/store/catchUpCampaignWorld.test.js — M10b catch-up mechanism pins.
 *
 * The living/autonomous advance-on-open catch-up: computes whole weeks elapsed
 * since worldState.lastLivingAdvanceAt, caps at CATCH_UP_CAP_WEEKS, and runs that
 * many one-week advances. The load-bearing guarantees, pinned here:
 *   • DETERMINISM: a catch-up of N weeks is BYTE-IDENTICAL to N manual one-week
 *     advances (the whole point — determinism inherited from advanceCampaignWorld).
 *   • LIFECYCLE (the owner's most-bitten class — the new persisted cursor):
 *       - first open / legacy save (no cursor) SEEDS the cursor, advances nothing;
 *       - up-to-date cursor advances nothing;
 *       - past the cap advances EXACTLY the cap, and the cursor reaches `now`
 *         (calendar-advances-past-cap — no perpetual re-catch-up);
 *       - UNDO of a living advance RESTORES the prior cursor (no double-run);
 *   • DORMANCY: a dm_advanced campaign is not_living (no catch-up) and its advance
 *     never stamps the cursor (byte-identical to pre-M10b).
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
vi.mock('../../src/lib/flags.js', () => ({ flag: vi.fn(() => false) }));
vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { CATCH_UP_CAP_WEEKS } from '../../src/domain/worldPulse/simulationRules.js';
import { campaigns as campaignService } from '../../src/lib/campaigns.js';

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
    name, tier: 'town', population: 1500,
    config: { tradeRouteAccess: 'road', priorityEconomy: 20 },
    institutions: [],
    economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 30, label: 'Contested' },
      factions: [{ faction: 'Merchant League', category: 'economy', power: 70 }],
      conflicts: [],
    },
    npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.72 }],
  };
}
// Seed a canonized campaign. `progression` sets worldProgression; `cursor` seeds
// the M10b lastLivingAdvanceAt (undefined ⇒ absent, the first-open/legacy case).
function seedStore(store, { progression = 'autonomous', cursor } = {}) {
  store.setState(state => {
    state.savedSettlements = [{
      id: 'ashford', name: 'Ashford', phase: 'canon',
      settlement: settlement('Ashford'),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    const worldState = {
      rngSeed: 'store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z',
      simulationRules: { worldProgression: progression },
    };
    if (cursor !== undefined) worldState.lastLivingAdvanceAt = cursor;
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: ['ashford'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState,
    }];
  });
}
const ws = store => store.getState().campaigns[0].worldState;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
// An ISO `now` that is exactly `weeks` after 2026-01-01T00:00:00Z.
const nowAfter = weeks => new Date(Date.parse('2026-01-01T00:00:00.000Z') + weeks * WEEK_MS).toISOString();

describe('M10b catchUpCampaignWorld', () => {
  beforeEach(() => { installLocalStorage(); });

  test('DETERMINISM: a catch-up of N weeks == N manual one-week advances, byte-identical', async () => {
    const N = 5;
    const cursor = '2026-01-01T00:00:00.000Z';
    const now = nowAfter(N); // exactly N weeks after the cursor

    // Manual: N explicit one-week advances at the same injected `now`.
    const manual = makeStore();
    seedStore(manual, { progression: 'autonomous', cursor });
    for (let i = 0; i < N; i++) {
      const r = await manual.getState().advanceCampaignWorld('camp-1', 'one_week', { now, autoResolve: true });
      expect(r.ok !== false).toBe(true);
    }

    // Catch-up: one call that must run exactly N one-week advances.
    const caught = makeStore();
    seedStore(caught, { progression: 'autonomous', cursor });
    const res = await caught.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: N, capped: false });

    expect(ws(caught).tick).toBe(N);
    expect(ws(manual).tick).toBe(N);
    // The cursor reached `now` in both paths.
    expect(ws(caught).lastLivingAdvanceAt).toBe(now);
    expect(ws(manual).lastLivingAdvanceAt).toBe(now);
    // The whole world state is byte-identical between the two paths.
    expect(JSON.stringify(ws(caught))).toBe(JSON.stringify(ws(manual)));
  });

  test('SEED: a first open (no cursor) seeds the cursor and advances nothing', async () => {
    const store = makeStore();
    seedStore(store, { progression: 'autonomous', cursor: undefined });
    const now = nowAfter(3);
    const res = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: 0, reason: 'seeded' });
    expect(ws(store).tick).toBe(0);
    expect(ws(store).lastLivingAdvanceAt).toBe(now);
  });

  test('UP-TO-DATE: a cursor less than a week old advances nothing', async () => {
    const store = makeStore();
    const cursor = nowAfter(2);
    seedStore(store, { progression: 'autonomous', cursor });
    // now is only 3 days after the cursor ⇒ 0 whole weeks.
    const now = new Date(Date.parse(cursor) + 3 * 24 * 60 * 60 * 1000).toISOString();
    const res = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: 0, reason: 'up_to_date' });
    expect(ws(store).tick).toBe(0);
    expect(ws(store).lastLivingAdvanceAt).toBe(cursor); // untouched
  });

  test('CAP: 30 elapsed weeks advances EXACTLY the cap, and the calendar reaches now', async () => {
    const store = makeStore();
    const cursor = '2026-01-01T00:00:00.000Z';
    seedStore(store, { progression: 'autonomous', cursor });
    const now = nowAfter(30); // 30 > CATCH_UP_CAP_WEEKS (26)
    const res = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: CATCH_UP_CAP_WEEKS, capped: true });
    expect(ws(store).tick).toBe(CATCH_UP_CAP_WEEKS);
    // calendar-advances-past-cap: cursor reaches `now` even though the sim stopped
    // at the cap — so a returning player doesn't re-catch-up the same overflow.
    expect(ws(store).lastLivingAdvanceAt).toBe(now);
  });

  test('UNDO restores the prior catch-up cursor (no double-run)', async () => {
    const store = makeStore();
    const cursor = '2026-01-01T00:00:00.000Z';
    seedStore(store, { progression: 'autonomous', cursor });
    const now = nowAfter(4);
    // One living advance stamps the cursor forward.
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now, autoResolve: true });
    expect(ws(store).lastLivingAdvanceAt).toBe(now);
    expect(ws(store).tick).toBe(1);
    // Undo must restore BOTH the tick AND the cursor.
    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone).toBe(true);
    expect(ws(store).tick).toBe(0);
    expect(ws(store).lastLivingAdvanceAt).toBe(cursor);
  });

  test('PERSIST ROUND-TRIP: a living advance persists the moved cursor — no phantom re-catch-up on reload (state-lifecycle-1)', async () => {
    const store = makeStore();
    const cursor = '2026-01-01T00:00:00.000Z';
    seedStore(store, { progression: 'autonomous', cursor });
    const now = nowAfter(3);
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now, autoResolve: true });
    // In-memory cursor moved (this already held pre-fix).
    expect(ws(store).lastLivingAdvanceAt).toBe(now);

    // The PERSISTED mirror (the localStorage cache written by cacheCampaignState)
    // ALSO carries the moved cursor. Pre-fix the stamp landed in a SEPARATE post-
    // advance set() AFTER cacheCampaignState ran, so the mirror kept the PRE-advance
    // cursor — the ghost this pin guards.
    const cached = campaignService.loadCached('anon');
    const persistedWs = cached.find(c => c.id === 'camp-1')?.worldState;
    expect(persistedWs?.lastLivingAdvanceAt).toBe(now);

    // Reload from the persisted mirror into a fresh store ⇒ a catch-up at the SAME
    // `now` is a no-op. Pre-fix, the stale persisted cursor re-advanced the week the
    // world already lived (a phantom week per reload).
    const reloaded = makeStore();
    reloaded.setState(state => { state.campaigns = JSON.parse(JSON.stringify(cached)); });
    const res = await reloaded.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: true, weeksCaughtUp: 0 });
    expect(reloaded.getState().campaigns[0].worldState.tick).toBe(ws(store).tick);
  });

  test('DORMANCY: a dm_advanced world is not_living and its advance never stamps a cursor', async () => {
    const store = makeStore();
    seedStore(store, { progression: 'dm_advanced', cursor: undefined });
    const now = nowAfter(10);
    const res = await store.getState().catchUpCampaignWorld('camp-1', { now });
    expect(res).toMatchObject({ ok: false, reason: 'not_living', weeksCaughtUp: 0 });
    expect(ws(store).tick).toBe(0);
    // A normal advance on a dm_advanced world must NOT introduce the M10b cursor.
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now, autoResolve: true });
    expect(ws(store).tick).toBe(1);
    expect(ws(store).lastLivingAdvanceAt).toBeUndefined();
  });
});
