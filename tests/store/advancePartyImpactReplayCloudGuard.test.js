/**
 * advancePartyImpactReplayCloudGuard.test.js — MEDIUM: the party-impact replay must
 * NOT force-write to the cloud when the underlying advance is cloud-pending/conflicted.
 *
 * advanceCampaignWorld drains party-caused queued events (KILL_NPC / IMPAIR_FACTION /
 * RESTORE_FACTION marked partyCaused) and, after the advance persists, replays each
 * through recordPartyImpact. recordPartyImpact persists as a BACKWARD / last-write-wins
 * write (expectedTick = null) — it FORCE-writes its settlement deltas to the cloud,
 * bypassing the forward stale-tick guard.
 *
 * The bug: when the advance's own atomic persist FAILS or CONFLICTS (result.cloudPending
 * = true — the cloud is behind / holds a different winning timeline), the replay still
 * ran. So a party-impact world built atop an UNPERSISTED advance got force-written over
 * the cloud out of band, manufacturing the exact hybrid timeline the advance's
 * cloud-pending discipline exists to prevent.
 *
 * The fix guards the replay on !result.cloudPending. These pins prove it:
 *  - CLOUD-PENDING advance: the replay is SKIPPED (recordPartyImpact not called); the
 *    impacts stay drained on the local world and reconcile on the retry/reload.
 *  - CLEAN advance: the replay still runs (recordPartyImpact called) — no regression to
 *    the happy path.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Cloud CONFIGURED so the advance persist genuinely runs the atomic RPC we can fail.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: true },
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
      isConfigured: true,
    },
  };
});

// Single-tick path (no pause) — the party-impact replay tail is tick-agnostic.
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => false),
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

const SAVE_ID = '22222222-2222-4222-8222-222222222222';
const CAMPAIGN_ID = '33333333-3333-4333-8333-333333333333';
const NPC_ID = 'reeve';

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
    npcs: [{ id: NPC_ID, name: 'Reeve Mara', importance: 'key' }],
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.72 }],
  };
}

// Seed a canonized campaign whose worldState carries ONE party-caused queued event
// (KILL_NPC, which maps to a remove_npc party impact) — so the drain surfaces exactly
// one drainedPartyImpact for the replay tail to act on.
function seedWithQueuedPartyEvent(store) {
  store.setState(state => {
    state.savedSettlements = [{
      id: SAVE_ID, name: 'Ashford', phase: 'canon',
      settlement: settlement('Ashford'),
      campaignState: { phase: 'canon', eventLog: [], locks: {}, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
    state.campaigns = [{
      id: CAMPAIGN_ID, name: 'Realm', settlementIds: [SAVE_ID],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: {
        rngSeed: 'store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z',
        pendingEvents: [{
          queueId: 'pe_kill',
          saveId: SAVE_ID,
          event: { id: 'evt-kill', type: 'KILL_NPC', targetId: NPC_ID, partyCaused: true, description: 'The party slew the reeve.' },
          queuedAt: '2026-01-15T00:00:00.000Z',
        }],
      },
    }];
  });
}

describe('party-impact replay respects the advance cloud-pending state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installLocalStorage();
    campaignService.persistWorldPulseAdvance.mockResolvedValue({ applied: true, settlementsWritten: 1, settlementsRequested: 1 });
    primeCampaignSync([]);
  });

  test('CLOUD-PENDING advance: the party-impact replay is SKIPPED (no out-of-band force-write)', async () => {
    const store = makeStore();
    seedWithQueuedPartyEvent(store);

    // Confirm the fixture actually surfaces a drained party impact, so the SKIP below
    // is a genuine skip — not a vacuous pass because nothing was drained.
    const recordSpy = vi.spyOn(store.getState(), 'recordPartyImpact');

    // The advance's atomic persist rejects → the advance is real LOCALLY but cloud-pending.
    campaignService.persistWorldPulseAdvance.mockRejectedValue(new Error('network'));

    const result = await store.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    expect(result).toBeTruthy();
    expect(result.ok).not.toBe(false);
    expect(result.cloudPending).toBe(true);
    // The advance landed locally — the tick advanced and the queue drained.
    expect(store.getState().campaigns[0].worldState.tick).toBe(1);
    // THE GUARD: recordPartyImpact was NOT invoked, so no party-impact deltas were
    // force-written over the (behind/conflicted) cloud out of band.
    expect(recordSpy).not.toHaveBeenCalled();
    // Exactly ONE atomic write happened — the advance's own (failed) persist. A replay
    // would have fired a SECOND persistWorldPulseAdvance (backward, expectedTick null).
    expect(campaignService.persistWorldPulseAdvance).toHaveBeenCalledTimes(1);
  });

  test('CLEAN advance: the party-impact replay still runs (happy path intact)', async () => {
    const store = makeStore();
    seedWithQueuedPartyEvent(store);

    const recordSpy = vi.spyOn(store.getState(), 'recordPartyImpact');
    campaignService.persistWorldPulseAdvance.mockResolvedValue({ applied: true, settlementsWritten: 1, settlementsRequested: 1 });

    const result = await store.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_month', { now: '2026-02-01T00:00:00.000Z' });

    expect(result.ok).not.toBe(false);
    expect(result.cloudPending).toBeUndefined();
    expect(store.getState().campaigns[0].worldState.tick).toBe(1);
    // The replay fired for the one drained party impact.
    expect(recordSpy).toHaveBeenCalledTimes(1);
    expect(recordSpy).toHaveBeenCalledWith(CAMPAIGN_ID, expect.objectContaining({ kind: 'remove_npc', npcId: NPC_ID }));
  });
});
