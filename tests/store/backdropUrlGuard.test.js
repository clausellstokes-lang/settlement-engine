/**
 * Imported-backdrop URL scheme guard.
 *
 * A gallery map row is untrusted shared input. On import the backdrop image is
 * re-uploaded into the importer's own storage, but if that fetch fails the code
 * used to fall back to the ORIGINAL shared imageUrl unconditionally — including
 * a javascript:/data: scheme — which MapOverlay then renders as an SVG
 * <image href> with no validation. These tests pin that an unsafe scheme is
 * never persisted in either import branch when the re-upload fetch fails.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    save: vi.fn(() => Promise.resolve('new-save-id')),
    update: vi.fn(() => Promise.resolve()),
    delete: vi.fn(() => Promise.resolve()),
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

const fetchMapForImport = vi.fn();
const bumpMapImport = vi.fn(() => Promise.resolve());
vi.mock('../../src/lib/gallery.js', () => ({
  fetchMapForImport: (...a) => fetchMapForImport(...a),
  bumpMapImport: (...a) => bumpMapImport(...a),
}));

const uploadMapBackdrop = vi.fn();
vi.mock('../../src/lib/imageUpload.js', () => ({
  uploadMapBackdrop: (...a) => uploadMapBackdrop(...a),
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { createCampaignSlice } from '../../src/store/campaignSlice.js';

// Premium auth so createCampaign() is permitted.
function makeStore(extra = {}) {
  return create(immer((set, get, api) => ({
    auth: { user: { id: 'u1' }, tier: 'premium', role: 'user' },
    savedSettlements: [],
    maxSaves: () => Infinity,
    ...createCampaignSlice(set, get, api),
    ...extra,
  })));
}

const EVIL_URL = 'javascript:alert(document.cookie)//evil';

beforeEach(() => {
  fetchMapForImport.mockReset();
  bumpMapImport.mockReset().mockResolvedValue(undefined);
  uploadMapBackdrop.mockReset();
  // Simulate a failed re-upload fetch (network error / unreachable host) so the
  // code falls back to the untrusted original imageUrl.
  global.fetch = vi.fn(() => Promise.reject(new Error('network down')));
});

afterEach(() => {
  delete global.fetch;
});

describe('imported backdrop URL scheme guard', () => {
  test('importGalleryMap: a javascript: imageUrl with a failing re-upload is rejected, not persisted', async () => {
    fetchMapForImport.mockResolvedValue({
      name: 'Evil Map',
      backdrop: { customBackdrop: { imageUrl: EVIL_URL, w: 100, h: 80 } },
    });
    const store = makeStore();

    await expect(store.getState().importGalleryMap('evil')).rejects.toThrow(/backdrop/i);

    // No campaign should have been left holding the unsafe URL.
    const campaigns = store.getState().campaigns;
    expect(campaigns).toHaveLength(0);
    expect(uploadMapBackdrop).not.toHaveBeenCalled();
  });

  test('importGalleryMapWithCampaign: a javascript: backdrop with a failing re-upload is dropped, campaign still imports', async () => {
    fetchMapForImport.mockResolvedValue({
      kind: 'map_with_campaign',
      name: 'Evil Campaign',
      members: [],
      mapState: { customBackdrop: { imageUrl: EVIL_URL, w: 100, h: 80 }, placements: {} },
    });
    const store = makeStore();

    const id = await store.getState().importGalleryMapWithCampaign('evil');
    expect(id).toBeTruthy();

    const campaign = store.getState().campaigns.find(c => c.id === id);
    expect(campaign).toBeTruthy();
    // The unsafe scheme must NOT have been stored as the backdrop.
    expect(campaign.mapState?.customBackdrop).toBeNull();
  });

  test('importGalleryMap: a normal https imageUrl whose re-upload fails still imports (kept as a safe fallback)', async () => {
    const SAFE_URL = 'https://cdn.example.com/shared/map.png';
    fetchMapForImport.mockResolvedValue({
      name: 'Good Map',
      backdrop: { customBackdrop: { imageUrl: SAFE_URL, w: 100, h: 80 } },
    });
    const store = makeStore();

    const id = await store.getState().importGalleryMap('good');
    expect(id).toBeTruthy();
    const campaign = store.getState().campaigns.find(c => c.id === id);
    expect(campaign.mapState.customBackdrop.imageUrl).toBe(SAFE_URL);
  });
});
