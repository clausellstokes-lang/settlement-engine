/**
 * One-shot map-workspace handoff — lets an outside view (the Settlements
 * "Advance Time" button) ask WorldMap to open on a specific workspace
 * ('news'/'pulse') the next time it mounts with an active campaign. The signal
 * is read-and-cleared so it fires exactly once and never persists.
 */

import { describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { save: vi.fn(), update: vi.fn(() => Promise.resolve()), delete: vi.fn(), isConfigured: false },
}));

import { createCampaignSlice } from '../../src/store/campaignSlice.js';

const makeStore = () => create(immer((set, get, api) => ({ ...createCampaignSlice(set, get, api) })));

describe('campaignSlice — one-shot map workspace handoff', () => {
  test('request → consume returns the workspace once, then null', () => {
    const store = makeStore();
    expect(store.getState().pendingMapWorkspace).toBeNull();

    store.getState().requestMapWorkspace('news');
    expect(store.getState().pendingMapWorkspace).toBe('news');

    expect(store.getState().consumeMapWorkspace()).toBe('news');
    expect(store.getState().pendingMapWorkspace).toBeNull();
    // Already consumed → a second read is a no-op returning null.
    expect(store.getState().consumeMapWorkspace()).toBeNull();
  });

  test('requestMapWorkspace(null) clears a pending request', () => {
    const store = makeStore();
    store.getState().requestMapWorkspace('pulse');
    store.getState().requestMapWorkspace(null);
    expect(store.getState().pendingMapWorkspace).toBeNull();
  });
});
