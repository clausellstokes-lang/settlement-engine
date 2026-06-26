/**
 * @vitest-environment jsdom
 *
 * galleryMapThumbnail.test.jsx — the maps-gallery tile must show a real picture
 * for a generated-terrain (FMG) map, not the "Generated terrain" placeholder.
 *
 * The bug: the tile gated its <img> on `backdrop_kind === 'image' && thumb_url`,
 * so every FMG map (backdrop_kind 'fmg') fell to the placeholder even when the
 * share editor had auto-seeded a terrain snapshot into the cover (image_url, which
 * 088's list_gallery_maps projects). The fix shows thumb_url || image_url
 * regardless of backdrop_kind.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';

const FMG_WITH_COVER = {
  slug: 'fmg-cover', name: 'Terrain Realm', kind: 'map', description: '', tags: [],
  // generated terrain, NO auto thumb — but the share editor seeded a cover snapshot.
  backdrop_kind: 'fmg', thumb_url: null, image_url: 'https://cdn.example/terrain-cover.jpg',
  published_at: '2026-02-01T00:00:00Z', view_count: 1, importable: false,
};
const FMG_NO_IMAGE = {
  slug: 'fmg-bare', name: 'Bare Realm', kind: 'map', description: '', tags: [],
  backdrop_kind: 'fmg', thumb_url: null, image_url: null,
  published_at: '2026-01-01T00:00:00Z', view_count: 0, importable: false,
};

const fetchGalleryMaps = vi.fn().mockResolvedValue({ items: [FMG_WITH_COVER, FMG_NO_IMAGE] });

vi.mock('../../../src/lib/gallery.js', () => ({
  shareMap: vi.fn(), unshareMap: vi.fn(),
  fetchGalleryMaps: (...a) => fetchGalleryMaps(...a),
  fetchGalleryMap: vi.fn().mockResolvedValue(null),
  updateMapGalleryMetadata: vi.fn(),
  fetchCampaignGalleryFields: vi.fn().mockResolvedValue(null),
  GALLERY_SORT_OPTIONS: [['relevant', 'Most relevant']],
}));

const storeState = {
  auth: { tier: 'premium', role: 'user', user: { id: 'user-1' } },
  campaigns: [], renameCampaign: vi.fn(), importGalleryMap: vi.fn(),
  importGalleryMapWithCampaign: vi.fn(), setActiveCampaign: vi.fn(),
  updateSavedCampaign: vi.fn(), savedSettlements: [],
};
vi.mock('../../../src/store', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

function installMatchMedia(matches) {
  window.matchMedia = vi.fn((query) => ({
    media: query, matches,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
}

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe('GalleryMaps tile — generated-terrain thumbnail', () => {
  test('an FMG map with a cover (image_url) shows the picture; a bare FMG map shows the placeholder', async () => {
    installMatchMedia(false);
    vi.resetModules();
    const GalleryMaps = (await import('../../../src/components/gallery/GalleryMaps.jsx')).default;
    render(<GalleryMaps />);

    await waitFor(() => expect(screen.getByText('Terrain Realm')).toBeTruthy());

    // The FMG-with-cover tile renders an <img> off the cover, despite backdrop_kind 'fmg'.
    const img = screen.getByAltText('Terrain Realm');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://cdn.example/terrain-cover.jpg');

    // The bare FMG map (no thumb, no cover) still falls to the placeholder text.
    expect(screen.getByText('Bare Realm')).toBeTruthy();
    expect(screen.queryByAltText('Bare Realm')).toBeNull();
  });
});
