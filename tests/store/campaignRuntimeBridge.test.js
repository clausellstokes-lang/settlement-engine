import { describe, expect, test, vi } from 'vitest';
import {
  CampaignRuntimeNotReadyError,
  createCampaignRuntimeBridge,
} from '../../src/store/campaignRuntimeBridge.js';

const SENTINEL = 'test-campaign-runtime';

function fakeStore(seed = {}) {
  const state = { ...seed };
  const get = () => state;
  const set = update => {
    if (typeof update === 'function') {
      const result = update(state);
      if (result && result !== state) Object.assign(state, result);
    } else {
      Object.assign(state, update);
    }
  };
  return { get, set, state };
}

function moduleWith(actions, outboxStatus = null) {
  const bodySentinels = Object.freeze({ core: 'core', regional: 'regional', pulse: 'pulse' });
  return {
    CAMPAIGN_RUNTIME_LAZY_SENTINEL: SENTINEL,
    CAMPAIGN_RUNTIME_BODY_SENTINELS: bodySentinels,
    createCampaignRuntimeActions: () => ({
      actions: Object.freeze(actions),
      bodySentinels,
      outboxStatus,
      sentinel: SENTINEL,
    }),
  };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, reject, resolve };
}

describe('campaign runtime bridge', () => {
  test('deduplicates concurrent loads and publishes the complete table atomically', async () => {
    const gate = deferred();
    const load = vi.fn(() => gate.promise);
    const bridge = createCampaignRuntimeBridge(load);
    const store = fakeStore({ outboxStatus: null });

    const first = bridge.preload(store.set, store.get);
    const second = bridge.preload(store.set, store.get);

    expect(first).toBe(second);
    expect(load).toHaveBeenCalledTimes(1);
    expect(bridge.actionsFor(store.get)).toBeNull();
    expect(() => bridge.requireAction(store.get, 'createCampaign'))
      .toThrow(CampaignRuntimeNotReadyError);

    const actions = Object.freeze({
      createCampaign: vi.fn(() => 'campaign-id'),
      advanceCampaignWorld: vi.fn(),
    });
    gate.resolve(moduleWith(actions, { queued: 2, failed: 0, inflight: 1 }));

    await expect(first).resolves.toBe(actions);
    expect(bridge.actionsFor(store.get)).toBe(actions);
    expect(bridge.requireAction(store.get, 'createCampaign')()).toBe('campaign-id');
    expect(store.state.outboxStatus).toEqual({ queued: 2, failed: 0, inflight: 1 });
  });

  test('clears a rejected promise so the same store can retry', async () => {
    const actions = Object.freeze({ createCampaign: vi.fn() });
    const load = vi.fn()
      .mockRejectedValueOnce(new Error('transient chunk failure'))
      .mockResolvedValueOnce(moduleWith(actions));
    const bridge = createCampaignRuntimeBridge(load);
    const store = fakeStore();

    await expect(bridge.preload(store.set, store.get)).rejects.toThrow('transient chunk failure');
    expect(bridge.actionsFor(store.get)).toBeNull();
    await expect(bridge.preload(store.set, store.get)).resolves.toBe(actions);
    expect(load).toHaveBeenCalledTimes(2);
  });

  test('isolates action tables and in-flight promises by store', async () => {
    const load = vi.fn(async () => {
      const bodySentinels = Object.freeze({ core: 'core', regional: 'regional', pulse: 'pulse' });
      return {
        CAMPAIGN_RUNTIME_LAZY_SENTINEL: SENTINEL,
        CAMPAIGN_RUNTIME_BODY_SENTINELS: bodySentinels,
        createCampaignRuntimeActions: (_set, get) => ({
          actions: Object.freeze({ owner: () => get().owner }),
          bodySentinels,
          sentinel: SENTINEL,
        }),
      };
    });
    const bridge = createCampaignRuntimeBridge(load);
    const one = fakeStore({ owner: 'one' });
    const two = fakeStore({ owner: 'two' });

    await Promise.all([
      bridge.preload(one.set, one.get),
      bridge.preload(two.set, two.get),
    ]);

    expect(load).toHaveBeenCalledTimes(2);
    expect(bridge.requireAction(one.get, 'owner')()).toBe('one');
    expect(bridge.requireAction(two.get, 'owner')()).toBe('two');
    expect(bridge.actionsFor(one.get)).not.toBe(bridge.actionsFor(two.get));
  });

  test('refuses a second set capability for an already registered store', async () => {
    const bridge = createCampaignRuntimeBridge(async () => moduleWith({}));
    const store = fakeStore();
    await bridge.preload(store.set, store.get);
    expect(() => bridge.preload(() => {}, store.get))
      .toThrow('different set function');
  });
});
