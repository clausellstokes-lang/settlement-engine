/**
 * Production surface: the multi-save gallery campaign import orchestrator.
 *
 * If auth changes after owner A's first insert, the import must stop before its
 * second write and must not mutate owner B's store. The committed A row is the
 * deliberate partial-success control: cleanup under B is skipped and disclosed.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const h = vi.hoisted(() => ({
  save: vi.fn(),
  remove: vi.fn(),
  fetchGalleryMap: vi.fn(),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    save: (...args) => h.save(...args),
    update: vi.fn(() => Promise.resolve()),
    delete: (...args) => h.remove(...args),
    isConfigured: false,
  },
}));

vi.mock('../../src/lib/campaigns.js', () => ({
  campaigns: {
    loadCached: vi.fn(() => []),
    list: vi.fn(() => Promise.resolve([])),
    cache: vi.fn(),
    isConfigured: false,
  },
  isCampaignActive: () => true,
}));

vi.mock('../../src/lib/gallery.js', () => ({
  fetchGalleryMap: (...args) => h.fetchGalleryMap(...args),
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: new Proxy({}, { get: (_target, key) => String(key) }),
}));

import { createCampaignSlice } from '../../src/store/campaignSlice.js';

function makeStore() {
  return create(immer((set, get, api) => ({
    auth: { user: { id: 'owner-a' }, tier: 'premium', role: 'user' },
    savedSettlements: [],
    maxSaves: () => Infinity,
    ...createCampaignSlice(set, get, api),
  })));
}

describe('gallery campaign import owner fence', () => {
  beforeEach(() => {
    h.save.mockReset();
    h.remove.mockReset();
    h.remove.mockResolvedValue();
    h.fetchGalleryMap.mockReset();
    h.fetchGalleryMap.mockResolvedValue({
      kind: 'map_with_campaign',
      name: 'Owner A Realm',
      members: [
        {
          old_id: 'old-a-1',
          name: 'A One',
          tier: 'town',
          settlement: { name: 'A One', tier: 'town' },
        },
        {
          old_id: 'old-a-2',
          name: 'A Two',
          tier: 'village',
          settlement: { name: 'A Two', tier: 'village' },
        },
      ],
      mapState: { placements: {} },
    });
  });

  test('an A to B switch after the first insert cannot write the second or mutate B state', async () => {
    let resolveFirst;
    h.save.mockImplementationOnce(() => new Promise(resolve => {
      resolveFirst = resolve;
    }));
    h.remove.mockRejectedValueOnce(
      Object.assign(new Error('owner mismatch'), { code: 'auth_session_changed' }),
    );
    const store = makeStore();
    const importing = store.getState().importGalleryMapWithCampaign('owner-a-realm');

    await vi.waitFor(() => expect(h.save).toHaveBeenCalledTimes(1));
    const [, saveOptions] = h.save.mock.calls[0];
    expect(saveOptions.expectedOwnerId).toBe('owner-a');

    store.setState({
      auth: { user: { id: 'owner-b' }, tier: 'premium', role: 'user' },
      campaignSessionGeneration: store.getState().campaignSessionGeneration + 1,
    });
    expect(saveOptions.isSessionCurrent()).toBe(false);
    resolveFirst('owner-a-save-1');

    await expect(importing).rejects.toMatchObject({
      code: 'auth_session_changed',
      previousAccountSaveCount: 1,
      message: expect.stringMatching(/remains? in the previous account/i),
    });
    expect(h.save).toHaveBeenCalledTimes(1);
    // Cleanup under B cannot delete A's committed row, so it is deliberately
    // skipped and disclosed instead of mocked as a successful rollback.
    expect(h.remove).not.toHaveBeenCalled();
    expect(store.getState().savedSettlements).toEqual([]);
    expect(store.getState().campaigns).toEqual([]);
  });
});
