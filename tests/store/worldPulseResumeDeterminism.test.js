/**
 * worldPulseResumeDeterminism.test.js — two LOW-severity persist/resume defects in
 * the world-pulse slice, each pinned with a test that FAILS on the pre-fix code.
 *
 * (1) RESUME DETERMINISM (campaignWorldPulseSlice.resolveIntervalMajors)
 *   A multi-tick Advance that PAUSES parks a resume cursor (worldState.pausedAdvance)
 *   carrying the PRE-tick inputs the paused tick is re-derived from on resume. But the
 *   cursor did NOT carry the advance's original `now`, and resolveIntervalMajors used
 *   `options.now || new Date().toISOString()` — so a RESUME (with `now` omitted, e.g.
 *   a reload that just calls resume) regenerated a fresh wall-clock and threaded THAT
 *   into the re-derivation. The paused tick re-runs through the kernel, which stamps
 *   `now` into regional-graph/wizard-news records (recordedAt / createdAt / updatedAt),
 *   so the seed-replay-IDENTICAL resume path leaked wall-clock non-determinism: two
 *   resumes of the SAME cursor produced DIFFERENT worlds.
 *   The fix stores the original `now` on the cursor when the pause is first parked and
 *   reuses it on resume. PIN: two independent resumes of the same persisted cursor
 *   (both with `now` omitted) yield byte-identical worldState/regionalGraph/wizardNews.
 *
 * (2) STALE-ADVANCE CONFLICT SURFACING (flushWorldPulsePersist via advanceCampaignWorld)
 *   A two-tab same-tick Advance: tab B's atomic persist hits the forward stale-tick
 *   guard, the RPC returns { applied:false, reason:'stale_tick' }, and the persist tail
 *   treated that as success. So tab B's locally-advanced (DIFFERENT) world was reported
 *   as fully persisted, then silently dropped on reload with NO signal. The fix surfaces
 *   a stale_tick on the FORWARD ADVANCE path as a conflict (cloudPending + the retryable
 *   banner) so the caller can warn + reload, WITHOUT changing the proposal/undo
 *   last-write-wins path (which sends expectedTick=null and never ties).
 *   PIN: an advance whose RPC returns { applied:false, reason:'stale_tick' } tags
 *   result.cloudPending and raises campaignSyncError (not a clean success).
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// ── Two store configs in one file: the determinism case runs LOCAL (no cloud, so
// the resume's pure replay is the only variable), the conflict case runs CLOUD
// (so the atomic RPC actually runs and can return a stale_tick). saves/campaigns
// `isConfigured` is read per-call, so a single mock with togglable flags covers both.
let savesConfigured = false;
let campaignsConfigured = false;

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), get isConfigured() { return savesConfigured; } },
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
      persistWorldPulseAdvance: vi.fn(() => Promise.resolve({ applied: true, settlementsWritten: 1, settlementsRequested: 1 })),
      delete: vi.fn(() => Promise.resolve()),
      get isConfigured() { return campaignsConfigured; },
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
import { campaigns as campaignService } from '../../src/lib/campaigns.js';
import { primeCampaignSync } from '../../src/lib/campaignSync.js';

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
  auth: { user: { id: '11111111-1111-4111-8111-111111111111' }, tier: 'free', loading: false },
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

// A rival/hostile two-edge graph so a live faction_government_challenge candidate
// surfaces structural majors and a multi-tick Advance PAUSES (mirrors advancePauseResume).
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
const CAMPAIGN_ID = 'camp-1';

describe('(1) resolveIntervalMajors RESUME is deterministic w.r.t. wall-clock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installLocalStorage();
    multiTickValue = true;
    savesConfigured = false;
    campaignsConfigured = false;
    campaignService.persistWorldPulseAdvance.mockResolvedValue({ applied: true, settlementsWritten: 1, settlementsRequested: 1 });
    primeCampaignSync([]);
  });

  test('resuming the SAME paused cursor twice (now omitted) yields IDENTICAL output', async () => {
    // Advance once with a fixed now, pausing at the first major tick — this parks the
    // resume cursor on the persisted campaign.
    const origin = makeStore();
    seedStore(origin);
    const paused = await origin.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_year', { now: NOW, autoResolve: false });
    expect(paused.status).toBe('paused');
    const persistedCampaign = JSON.parse(JSON.stringify(origin.getState().campaigns[0]));
    const persistedSaves = JSON.parse(JSON.stringify(origin.getState().savedSettlements));
    expect(persistedCampaign.worldState.pausedAdvance).toBeTruthy();

    // Two independent "reloads" that resume the cursor WITHOUT passing now — the only
    // way the two can differ is if the resume regenerates a fresh wall-clock instead
    // of replaying from the now the pause was computed with.
    const resumeOnce = () => {
      const store = makeStore();
      store.setState(state => {
        state.savedSettlements = JSON.parse(JSON.stringify(persistedSaves));
        state.campaigns = [JSON.parse(JSON.stringify(persistedCampaign))];
      });
      // No `now` option — forces options.now || new Date().toISOString() to fall back.
      return store.getState().resolveIntervalMajors(CAMPAIGN_ID, {}).then(result => ({
        result,
        ws: store.getState().campaigns[0].worldState,
        regionalGraph: store.getState().campaigns[0].regionalGraph,
        wizardNews: store.getState().campaigns[0].wizardNews,
      }));
    };

    const a = await resumeOnce();
    const b = await resumeOnce();

    // The resumed segment must replay byte-identically across the two reloads.
    expect(a.result.status).toBe(b.result.status);
    expect(a.ws).toEqual(b.ws);
    expect(a.regionalGraph).toEqual(b.regionalGraph);
    expect(a.wizardNews).toEqual(b.wizardNews);
  });

  test('the parked cursor carries the advance original `now` so resume replays it', async () => {
    const store = makeStore();
    seedStore(store);
    const paused = await store.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_year', { now: NOW, autoResolve: false });
    expect(paused.status).toBe('paused');
    const cursor = store.getState().campaigns[0].worldState.pausedAdvance;
    // The original advance now is threaded onto the cursor (the seam the resume reuses).
    expect(cursor.now).toBe(NOW);
  });
});

describe('(2) a same-tick ADVANCE that the RPC rejects as stale_tick surfaces a conflict', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installLocalStorage();
    // Single-tick so the literals stay simple; cloud configured so the atomic RPC runs.
    multiTickValue = false;
    savesConfigured = true;
    campaignsConfigured = true;
    campaignService.persistWorldPulseAdvance.mockResolvedValue({ applied: true, settlementsWritten: 1, settlementsRequested: 1 });
    primeCampaignSync([]);
  });

  test('advanceCampaignWorld: RPC {applied:false, reason:stale_tick} tags cloudPending + raises the banner', async () => {
    const store = makeStore();
    seedStore(store);

    // Simulate the concurrent-tab race: the cloud already holds this tick (a sibling
    // tab advanced first), so the forward guard makes the RPC a no-op rather than
    // throwing. The advance is real LOCALLY but its world was NOT written to the cloud.
    campaignService.persistWorldPulseAdvance.mockResolvedValue({ applied: false, reason: 'stale_tick' });

    const result = await store.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    // The advance applied locally (the contract everywhere: applied locally, reload reconciles).
    expect(result).toBeTruthy();
    expect(result.ok).not.toBe(false);
    expect(store.getState().campaigns[0].worldState.tick).toBe(1);
    // The conflict is SURFACED — NOT silently reported as a clean success.
    expect(result.cloudPending).toBe(true);
    expect(store.getState().campaignSyncError).toBeTruthy();
    expect(campaignService.persistWorldPulseAdvance).toHaveBeenCalledTimes(1);
  });

  test('a CLEAN applied:true advance still leaves cloudPending unset (no false conflict)', async () => {
    const store = makeStore();
    seedStore(store);
    campaignService.persistWorldPulseAdvance.mockResolvedValue({ applied: true, settlementsWritten: 1, settlementsRequested: 1 });

    const result = await store.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    expect(result.ok).not.toBe(false);
    expect(store.getState().campaigns[0].worldState.tick).toBe(1);
    expect(result.cloudPending).toBeUndefined();
    expect(store.getState().campaignSyncError).toBeNull();
  });
});
