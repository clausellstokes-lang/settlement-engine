/**
 * instantWorldBinding.test.js — the store binding (runInstantWorld) pin.
 *
 * Proves the BUTTON client commits the composer's bundle correctly: each member
 * persisted as a real save, the campaign landed active with sound membership, the
 * placements + discovered graph wired to the real ids, and the realm left
 * spatially un-canonized. savesService + campaign persistence are stubbed so the
 * test exercises the orchestration, not the network.
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';

const saveMock = vi.fn(async () => `svc-${saveMock.mock.calls.length}`);
const deleteMock = vi.fn(async () => {});
vi.mock('../../src/lib/saves.js', () => ({
  saves: { save: (...a) => saveMock(...a), delete: (...a) => deleteMock(...a) },
}));
vi.mock('../../src/store/campaignSliceShared.js', async (orig) => {
  const actual = await orig();
  return { ...actual, persistCampaignState: vi.fn() };
});

import { runInstantWorld } from '../../src/store/instantWorldBody.js';
import {
  createInstantWorldSliceWithDependencies,
} from '../../src/store/instantWorldSlice.js';
import { isCanonSave } from '../../src/domain/campaign/canon.js';

function makeHarness({
  maxSaves = Infinity,
  ownerId = 'owner-a',
  contentRuntime = null,
} = {}) {
  const state = {
    auth: { user: ownerId ? { id: ownerId } : null },
    campaignSessionGeneration: 0,
    savedSettlements: [],
    campaigns: [],
    activeCampaignId: null,
    configExplicitFields: {},
    maxSaves: () => maxSaves,
    setActiveCampaign: (id) => { state.activeCampaignId = id; },
    ...(contentRuntime
      ? { getActiveCustomContentRuntime: () => contentRuntime }
      : {}),
  };
  // The body uses immer-style producers, but plain in-place mutation is
  // observationally identical for this harness.
  const set = (fn) => { fn(state); };
  const get = () => state;
  return { state, set, get };
}

describe('runInstantWorld — store binding', () => {
  beforeEach(() => {
    saveMock.mockReset();
    saveMock.mockImplementation(async () => `svc-${saveMock.mock.calls.length}`);
    deleteMock.mockReset();
    deleteMock.mockResolvedValue();
  });

  test('composes, persists each member, and lands the user in an active realm', async () => {
    const h = makeHarness();
    const res = await runInstantWorld({ set: h.set, get: h.get, basicConfig: { realmSize: 'small' }, options: { seed: 'bind-1' } });

    expect(res.ok).toBe(true);
    expect(res.settlementCount).toBe(5);
    expect(res.seed).toBe('bind-1');

    // Each member persisted as a real save.
    expect(saveMock).toHaveBeenCalledTimes(5);
    expect(h.state.savedSettlements).toHaveLength(5);
    for (const s of h.state.savedSettlements) expect(isCanonSave(s)).toBe(true);

    // The campaign landed active, holding exactly its members.
    expect(h.state.campaigns).toHaveLength(1);
    const campaign = h.state.campaigns[0];
    expect(h.state.activeCampaignId).toBe(campaign.id);
    expect(campaign.settlementIds).toEqual(h.state.savedSettlements.map(s => s.id));

    // Placements + graph wired to the REAL persisted ids.
    const placedIds = Object.values(campaign.mapState.placements).map(p => p.settlementId);
    for (const id of placedIds) expect(campaign.settlementIds).toContain(id);
    expect(Array.isArray(campaign.regionalGraph.channels)).toBe(true);

    // The map plan is staged; nothing is spatially canonized.
    expect(campaign.mapState.pendingMapGen).toBe(true);
    expect(campaign.mapState.fmgSnapshot).toBeNull();
    expect(campaign.mapState.seed).toBeTruthy();
    expect(campaign.worldState.spatialCanonVersion || 0).toBe(0);
  });

  test('refuses when the tier has too few save slots (defensive; the UI gates first)', async () => {
    const h = makeHarness({ maxSaves: 2 });
    const res = await runInstantWorld({ set: h.set, get: h.get, basicConfig: { realmSize: 'small' }, options: { seed: 'bind-2' } });
    expect(res).toEqual({ ok: false, reason: 'not_enough_slots', settlementCount: 5 });
    expect(saveMock).not.toHaveBeenCalled();
    expect(h.state.campaigns).toHaveLength(0);
  });

  test('mints members and campaign binding from the same reviewed runtime', async () => {
    const h = makeHarness({
      contentRuntime: {
        environment: null,
        customContent: {},
        tunables: { magicExists: false },
        visualSelection: {},
        resolution: { ok: true },
      },
    });
    const result = await runInstantWorld({
      set: h.set,
      get: h.get,
      basicConfig: { realmSize: 'small' },
      options: { seed: 'content-cutoff' },
    });

    expect(result.ok).toBe(true);
    const campaign = h.state.campaigns[0];
    expect(campaign.contentBinding.environment.tunables).toEqual({
      magicExists: false,
    });
    expect(campaign.contentBindingStatus).toBe('pinned');
    for (const save of h.state.savedSettlements) {
      expect(save.settlement.config.magicExists).toBe(false);
      expect(save.settlement.customContentProvenance).toMatchObject({
        scope: 'campaign',
        bindingHash: campaign.contentBinding.bindingHash,
      });
    }
  });

  test('an A to B switch mid-persist cannot split the world across owners', async () => {
    let resolveFirst;
    saveMock.mockImplementationOnce(() => new Promise(resolve => {
      resolveFirst = resolve;
    }));
    deleteMock.mockRejectedValueOnce(
      Object.assign(new Error('owner mismatch'), { code: 'auth_session_changed' }),
    );
    const h = makeHarness({ ownerId: 'owner-a' });
    const creating = runInstantWorld({
      set: h.set,
      get: h.get,
      basicConfig: { realmSize: 'small' },
      options: { seed: 'owner-fence' },
    });

    await vi.waitFor(() => expect(saveMock).toHaveBeenCalledTimes(1));
    const [, saveOptions] = saveMock.mock.calls[0];
    expect(saveOptions.expectedOwnerId).toBe('owner-a');

    h.state.auth = { user: { id: 'owner-b' } };
    h.state.campaignSessionGeneration += 1;
    expect(saveOptions.isSessionCurrent()).toBe(false);
    resolveFirst('owner-a-save');

    await expect(creating).resolves.toMatchObject({
      ok: false,
      reason: 'auth_session_changed',
      previousAccountSaveCount: 1,
      message: expect.stringMatching(/remains? in the previous account/i),
    });
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(deleteMock).not.toHaveBeenCalled();
    expect(h.state.savedSettlements).toEqual([]);
    expect(h.state.campaigns).toEqual([]);
    expect(h.state.activeCampaignId).toBeNull();
  });

  test('the public action arms campaign runtime and fences auth before loading its persistence body', async () => {
    let resolveRuntime;
    const preloadRuntime = vi.fn(() => new Promise(resolve => {
      resolveRuntime = resolve;
    }));
    const runBody = vi.fn();
    const loadBody = vi.fn(async () => ({ runInstantWorld: runBody }));
    const h = makeHarness({ ownerId: 'owner-a' });
    Object.assign(
      h.state,
      createInstantWorldSliceWithDependencies(h.set, h.get, {
        preloadRuntime,
        loadBody,
      }),
    );

    const pending = h.state.instantWorld({}, { seed: 'preflight-fence' });
    expect(preloadRuntime).toHaveBeenCalledWith(h.set, h.get);
    expect(loadBody).not.toHaveBeenCalled();
    expect(saveMock).not.toHaveBeenCalled();

    h.state.auth = { user: { id: 'owner-b' } };
    h.state.campaignSessionGeneration += 1;
    resolveRuntime({});

    await expect(pending).resolves.toMatchObject({
      ok: false,
      reason: 'auth_session_changed',
    });
    expect(loadBody).not.toHaveBeenCalled();
    expect(runBody).not.toHaveBeenCalled();
    expect(saveMock).not.toHaveBeenCalled();
  });

  test('a passed preflight session is rechecked by the body before its first save', async () => {
    const h = makeHarness({ ownerId: 'owner-b' });
    const result = await runInstantWorld({
      set: h.set,
      get: h.get,
      basicConfig: { realmSize: 'small' },
      options: { seed: 'stale-preflight' },
      expectedSession: { ownerId: 'owner-a', generation: 0 },
    });

    expect(result).toMatchObject({ ok: false, reason: 'auth_session_changed' });
    expect(saveMock).not.toHaveBeenCalled();
  });
});
