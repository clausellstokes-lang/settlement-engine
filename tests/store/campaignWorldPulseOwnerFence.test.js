/**
 * An awaited world-pulse must remain bound to the auth owner/session that
 * started it. Campaign UUIDs can legitimately repeat across accounts, so an
 * A -> B switch while the simulation is suspended must not commit A's result
 * into B's same-id campaign or let A's finally clear B's in-flight marker.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const simControl = vi.hoisted(() => ({ gates: [] }));

vi.mock('../../src/lib/advanceWorkerClient.js', () => ({
  runAdvanceInterval: vi.fn(async (args, { fallback }) => {
    let release;
    const gate = new Promise(resolve => {
      release = resolve;
    });
    simControl.gates.push({ release });
    await gate;
    return fallback(args);
  }),
}));

vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(name => name === 'advanceMultiTick' || name === 'simAdvanceWorker'),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

vi.mock('../../src/lib/campaigns.js', () => ({
  isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
  campaigns: {
    cache: vi.fn(),
    loadCached: vi.fn(() => []),
    list: vi.fn(() => Promise.resolve([])),
    upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
    delete: vi.fn(() => Promise.resolve()),
    recordTombstone: vi.fn(),
    isConfigured: false,
  },
}));

vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import {
  makeCampaignContentBinding,
} from '../../src/domain/content/contentEnvironment.js';
import { runAdvanceInterval } from '../../src/lib/advanceWorkerClient.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

function auth(ownerId, token) {
  return {
    user: { id: ownerId },
    session: { access_token: token },
    tier: 'premium',
    role: 'user',
    loading: false,
  };
}

function settlement(ownerId) {
  return {
    id: `town-${ownerId}`,
    name: `Town ${ownerId}`,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road', priorityEconomy: 20 },
    institutions: [],
    economicState: {
      primaryImports: ['Bulk grain and foodstuffs'],
      primaryExports: [],
    },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [{ faction: `Guild ${ownerId}`, category: 'economy', power: 60 }],
      conflicts: [],
    },
    npcs: [{ id: `reeve-${ownerId}`, name: `Reeve ${ownerId}`, importance: 'key' }],
    activeConditions: [],
  };
}

function accountState(ownerId, token, tick) {
  const saveId = `save-${ownerId}`;
  return {
    auth: auth(ownerId, token),
    savedSettlements: [{
      id: saveId,
      name: `Town ${ownerId}`,
      phase: 'canon',
      settlement: settlement(ownerId),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }],
    campaigns: [{
      id: 'shared-campaign-id',
      name: `Realm ${ownerId}`,
      settlementIds: [saveId],
      contentBinding: makeCampaignContentBinding({}, {
        source: `owner-fence:${ownerId}`,
      }),
      contentBindingStatus: 'pinned',
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: tick, entries: [] },
      worldState: {
        rngSeed: `seed-${ownerId}`,
        tick,
        canonizedAt: '2026-01-01T00:00:00.000Z',
      },
    }],
  };
}

function makeStore(ownerId = 'owner-a', token = 'token-a', tick = 0) {
  return create(immer((...args) => ({
    ...accountState(ownerId, token, tick),
    settlement: null,
    activeSaveId: null,
    phase: 'draft',
    systemState: null,
    eventLog: [],
    locks: {},
    generatedAt: null,
    editedAt: null,
    canonizedAt: null,
    lastExportAt: null,
    customContent: {},
    isCampaignMutationLocked: () => false,
    ...createCampaignWorldPulseSlice(...args),
  })));
}

async function gateAt(index, pending) {
  let early = null;
  Promise.resolve(pending).then(
    value => { early = { value }; },
    error => { early = { error }; },
  );
  await vi.waitFor(() => {
    if (early) {
      throw early.error || new Error(`advance settled before deferred simulation: ${JSON.stringify(early.value)}`);
    }
    expect(simControl.gates.length).toBeGreaterThan(index);
  }, { timeout: 10_000, interval: 10 });
  return simControl.gates[index];
}

function replaceAccount(store, ownerId, token, tick) {
  const replacement = accountState(ownerId, token, tick);
  store.setState(state => {
    // Auth's clearCampaigns boundary invalidates every campaign async token and
    // clears transient flight state before the replacement account hydrates.
    state.campaignSessionGeneration = (Number(state.campaignSessionGeneration) || 0) + 1;
    state.advanceInFlight = [];
    state.auth = replacement.auth;
    state.savedSettlements = replacement.savedSettlements;
    state.campaigns = replacement.campaigns;
    state.pulseUndoStack = [];
    state.livingCatchUp = null;
  });
}

describe('campaign world-pulse auth/session fence', () => {
  beforeEach(() => {
    installLocalStorage();
    vi.clearAllMocks();
    simControl.gates.splice(0);
  });

  test('worker input stays on the campaign cutoff after library edit and archive', async () => {
    const store = makeStore();
    const binding = makeCampaignContentBinding({
      institutions: [{
        name: 'Original Foundry',
        definitionId: 'definition:original-foundry',
        revisionId: 'revision:original-foundry:1',
        localUid: 'lu_original_foundry',
      }],
    }, { source: 'owner-fence:pinned-library' });
    store.setState(state => {
      state.campaigns[0].contentBinding = binding;
      state.customContent = {
        institutions: [{
          name: 'Edited Foundry',
          definitionId: 'definition:original-foundry',
          revisionId: 'revision:original-foundry:2',
          localUid: 'lu_original_foundry',
        }],
      };
    });

    const afterEdit = store.getState().advanceCampaignWorld(
      'shared-campaign-id',
      'one_week',
      { now: '2026-07-01T00:00:00.000Z', autoResolve: true, weeks: 1 },
    );
    const editGate = await gateAt(0, afterEdit);
    const editCall = vi.mocked(runAdvanceInterval).mock.calls.at(-1);
    expect(editCall[0].customContent.institutions[0].name)
      .toBe('Original Foundry');
    expect(editCall[1].customContent.institutions[0].name)
      .toBe('Original Foundry');
    editGate.release();
    await expect(afterEdit).resolves.toMatchObject({ status: 'complete' });

    store.setState(state => {
      // Archiving removes the definition from the account's active projection,
      // but it cannot rewrite a campaign's already-pinned cutoff.
      state.customContent = { institutions: [] };
    });
    const afterArchive = store.getState().advanceCampaignWorld(
      'shared-campaign-id',
      'one_week',
      { now: '2026-07-08T00:00:00.000Z', autoResolve: true, weeks: 1 },
    );
    const archiveGate = await gateAt(1, afterArchive);
    const archiveCall = vi.mocked(runAdvanceInterval).mock.calls.at(-1);
    expect(archiveCall[0].customContent.institutions[0].name)
      .toBe('Original Foundry');
    expect(archiveCall[1].customContent.institutions[0].name)
      .toBe('Original Foundry');
    archiveGate.release();
    await expect(afterArchive).resolves.toMatchObject({ status: 'complete' });

    expect(store.getState().campaigns[0].contentBinding.bindingHash)
      .toBe(binding.bindingHash);
  });

  test('A cannot commit into B, and A finally cannot clear B same-id flight', async () => {
    const store = makeStore();
    const advanceA = store.getState().advanceCampaignWorld(
      'shared-campaign-id',
      'one_week',
      { now: '2026-07-01T00:00:00.000Z', autoResolve: true, weeks: 1 },
    );
    const gateA = await gateAt(0, advanceA);

    replaceAccount(store, 'owner-b', 'token-b', 77);
    const advanceB = store.getState().advanceCampaignWorld(
      'shared-campaign-id',
      'one_week',
      { now: '2026-07-08T00:00:00.000Z', autoResolve: true, weeks: 1 },
    );
    const gateB = await gateAt(1, advanceB);

    gateA.release();
    await expect(advanceA).resolves.toMatchObject({
      ok: false,
      reason: 'auth_session_changed',
    });

    // B's same-id operation owns the replacement token; A's finally must not
    // clear its marker or land A's tick/save snapshot into B.
    expect(store.getState().isAdvanceInFlight('shared-campaign-id')).toBe(true);
    expect(store.getState().campaigns[0]).toMatchObject({
      name: 'Realm owner-b',
      worldState: { tick: 77 },
    });
    expect(store.getState().savedSettlements.map(save => save.id)).toEqual(['save-owner-b']);
    expect(store.getState().pulseUndoStack).toEqual([]);

    gateB.release();
    await expect(advanceB).resolves.toMatchObject({ status: 'complete', tick: 78 });
    expect(store.getState().campaigns[0].name).toBe('Realm owner-b');
    expect(store.getState().campaigns[0].worldState.tick).toBe(78);
    expect(store.getState().savedSettlements.map(save => save.id)).toEqual(['save-owner-b']);
    expect(store.getState().isAdvanceInFlight('shared-campaign-id')).toBe(false);
  });

  test('a new session for the same owner also invalidates the suspended commit', async () => {
    const store = makeStore('owner-a', 'session-one', 3);
    const pending = store.getState().advanceCampaignWorld(
      'shared-campaign-id',
      'one_week',
      { now: '2026-07-01T00:00:00.000Z', autoResolve: true, weeks: 1 },
    );
    const gate = await gateAt(0, pending);

    replaceAccount(store, 'owner-a', 'session-two', 41);
    gate.release();

    await expect(pending).resolves.toMatchObject({
      ok: false,
      reason: 'auth_session_changed',
    });
    expect(store.getState().campaigns[0].worldState.tick).toBe(41);
    expect(store.getState().pulseUndoStack).toEqual([]);
    expect(store.getState().isAdvanceInFlight('shared-campaign-id')).toBe(false);
  });
});
