/**
 * tests/store/heldDocketDurability.test.js — THE HELD DOCKET at the STORE seam
 * (realm directive 7 / J-D7, wave F).
 *
 * The UI half is pinned in tests/components/gatheredAdjudication.test.jsx (one
 * surface, never a chain; dismissal writes nothing). THIS file pins the property
 * that makes "dismissal writes nothing" SAFE rather than lossy — the docket the
 * screen dismisses is DURABLE — and it does so through the real store, the real
 * persistence writer, and the real reload path:
 *
 *   1. THE COUP GUARANTEE, EXTENDED TO THE UI. proposalAdmission admits a
 *      one-shot coup verdict above the docket cap because its trigger is spent
 *      and a deferral would be a deletion. That guarantee is worth nothing if the
 *      UI can lose the row afterwards. So: dismiss the screen, run a real advance,
 *      write the real cache, reload through the real hydrate path — the coup
 *      verdict is still there, still pending, still first in line.
 *   2. OLDEST FIRST ACROSS ADVANCES. The held row keeps leading the gathered
 *      screen as later advances pile rows on top of it.
 *   3. THE TOGGLE TRANSITION IS DEFINED. Flipping auto-resolve ON with a held
 *      docket does not strand it: the NEXT advance rules the backlog through the
 *      same accept path, marked engine-adjudicated, with the news a hand-Apply
 *      would have left. Never silent.
 *   4. THE SCREEN CANNOT APPEAR IN AUTO MODE. Its open condition is the world's
 *      own pending count, and a full-auto advance leaves that count at zero.
 *
 * The realm fixture is the rival/hostile three-settlement world the wave-B2 pins
 * use, so the rows piled on top of the seeded coup verdict are minted by the real
 * candidate pipeline rather than hand-built.
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

import { createCampaignSlice, migrateCampaign } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { campaigns as campaignService } from '../../src/lib/campaigns.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { isEngineAdjudicated } from '../../src/domain/worldPulse/adjudicationMark.js';
import { ONE_SHOT_VERDICT_RULE_IDS } from '../../src/domain/worldPulse/proposalAdmission.js';
import {
  gatheredDecisionRows,
  pendingDecisionCount,
} from '../../src/components/map/gatheredDocket.js';

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

/**
 * THE COUP FIXTURE. A one-shot verdict row: its trigger was consumed by the tick
 * that emitted it (the coup resolved, the echo is never handed back), so there is
 * no path by which the realm can re-derive it. If the UI loses this row, the
 * settlement's only verdict is gone.
 */
const COUP_VERDICT_ID = 'proposal.coup_verdict_fall.a.0';
const coupVerdict = () => ({
  id: COUP_VERDICT_ID,
  status: 'pending',
  recordModeVersion: 4,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  tick: 0,
  headline: 'The captain seizes the seat at a',
  summary: 'The garrison captain has taken the hall and awaits your word.',
  severity: 0.95,
  reasons: ['the watch went unpaid'],
  outcome: {
    id: `${COUP_VERDICT_ID}:outcome`,
    ruleId: 'coup_verdict_fall',
    candidateType: 'coup_verdict_fall',
    applyMode: 'proposal',
    significance: 'major',
    severity: 0.95,
    targetSaveId: 'a',
    headline: 'The captain seizes the seat at a',
    summary: 'The garrison captain has taken the hall and awaits your word.',
  },
});

function seedStore(store, { proposals = [] } = {}) {
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
      worldState: {
        rngSeed: 'held-docket-seed', tick: 0,
        canonizedAt: '2026-01-01T00:00:00.000Z',
        proposals,
      },
    }];
  });
}

const NOW = '2026-01-01T00:00:00.000Z';
const campaignOf = store => store.getState().campaigns[0];
const worldOf = store => campaignOf(store).worldState;
const rowOf = (campaign, id) => (campaign.worldState.proposals || []).find(p => p.id === id);

/** The REAL reload: the cache the store wrote, back through the hydrate path. */
function reloadFromCache() {
  return campaignService.loadCached('anon').map(c => migrateCampaign(c));
}

beforeEach(() => {
  installLocalStorage();
  multiTickValue = true;
  campaignService.cache.mockClear();
});

describe('THE COUP GUARANTEE, extended to the UI', () => {
  test('guard the guard: the fixture really is a one-shot verdict the cap protects', () => {
    expect(ONE_SHOT_VERDICT_RULE_IDS).toContain(coupVerdict().outcome.ruleId);
  });

  test('a dismissed matter survives an advance, the persist, and a reload', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [coupVerdict()] });
    store.getState().setAdvanceAutoResolve(false);

    // The gathered screen listed it; the DM set the docket aside. Dismissal is a
    // presentation act: NOTHING is written (pinned in the component test), so the
    // world entering the advance still carries the row exactly as minted.
    const before = JSON.stringify(rowOf(campaignOf(store), COUP_VERDICT_ID));
    expect(pendingDecisionCount(campaignOf(store))).toBe(1);

    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });
    expect(result.status).toBe('complete');
    // The clock really moved, so this is survival across a real advance.
    expect(worldOf(store).tick).toBeGreaterThan(0);
    expect(JSON.stringify(rowOf(campaignOf(store), COUP_VERDICT_ID))).toBe(before);

    // THE RELOAD. The store's own persist wrote the cache; hydrate it back.
    expect(campaignService.cache).toHaveBeenCalled();
    const reloaded = reloadFromCache();
    const survivor = rowOf(reloaded[0], COUP_VERDICT_ID);
    expect(survivor).toBeTruthy();
    expect(survivor.status).toBe('pending');
    expect(JSON.stringify(survivor)).toBe(before);
    // ...and the screen would still list it after the reload.
    expect(gatheredDecisionRows(reloaded[0]).map(r => r.id)).toContain(COUP_VERDICT_ID);
  });

  test('OLDEST FIRST: the held verdict still leads after later advances pile on', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [coupVerdict()] });
    store.getState().setAdvanceAutoResolve(false);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });
    const afterFirst = gatheredDecisionRows(campaignOf(store));
    // The advance really did raise more matters on top of the held one.
    expect(afterFirst.length).toBeGreaterThan(1);
    expect(afterFirst[0].id).toBe(COUP_VERDICT_ID);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });
    const afterSecond = gatheredDecisionRows(campaignOf(store));
    expect(afterSecond.length).toBeGreaterThanOrEqual(afterFirst.length);
    expect(afterSecond[0].id).toBe(COUP_VERDICT_ID);

    // The held row is marked held against the clock the second advance began at.
    const sinceTick = afterFirst.length ? worldOf(store).tick : 0;
    expect(gatheredDecisionRows(campaignOf(store), { sinceTick })[0].held).toBe(true);
  });
});

describe('THE TOGGLE TRANSITION — a held docket is never stranded', () => {
  test('turning auto-resolve ON rules the BACKLOG at the next advance, marked engine_auto', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [coupVerdict()] });
    store.getState().setAdvanceAutoResolve(false);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });
    const heldBefore = gatheredDecisionRows(campaignOf(store)).map(r => r.id);
    expect(heldBefore).toContain(COUP_VERDICT_ID);
    expect(heldBefore.length).toBeGreaterThan(1);
    // Nothing carries the mark yet: every row is still the DM's to rule.
    expect((worldOf(store).proposals || []).some(isEngineAdjudicated)).toBe(false);

    // The DM hands the realm the gavel mid-docket.
    store.getState().setAdvanceAutoResolve(true);
    const newsBefore = (campaignOf(store).wizardNews?.entries || []).length;
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });

    // The BACKLOG is ruled, not just the rows this advance minted.
    const coupAfter = rowOf(campaignOf(store), COUP_VERDICT_ID);
    expect(coupAfter.status).not.toBe('pending');
    expect(isEngineAdjudicated(coupAfter)).toBe(true);
    expect(pendingDecisionCount(campaignOf(store))).toBe(0);
    // ...and it is HERALD-NOTED, not silent: the rulings left news behind.
    expect((campaignOf(store).wizardNews?.entries || []).length).toBeGreaterThan(newsBefore);
  });

  test('AUTO MODE: the gathered screen can never appear (its open condition is the world)', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [coupVerdict()] });
    store.getState().setAdvanceAutoResolve(true);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });

    // The advance really minted proposal-gated majors (guard the guard)...
    expect((worldOf(store).proposals || []).length).toBeGreaterThan(1);
    // ...and none of them is waiting, so the screen's open condition is false.
    expect(pendingDecisionCount(campaignOf(store))).toBe(0);
    expect(gatheredDecisionRows(campaignOf(store))).toEqual([]);
  });

  test('NEGATIVE CONTROL: with the toggle OFF the same advance leaves the docket waiting', async () => {
    const store = makeStore();
    seedStore(store, { proposals: [coupVerdict()] });
    store.getState().setAdvanceAutoResolve(false);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });

    expect(pendingDecisionCount(campaignOf(store))).toBeGreaterThan(1);
    expect((worldOf(store).proposals || []).some(isEngineAdjudicated)).toBe(false);
  });
});
