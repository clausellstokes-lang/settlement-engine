/**
 * @vitest-environment jsdom
 *
 * galleryMobile.test.jsx — the MOBILE pass for the Gallery surface (Phase 5c).
 *
 * Contract under test (mobile = browse + read + light-act; the two heavy
 * authoring paths embedded in the gallery defer to desktop):
 *
 *   1. GalleryMaps, mobile: the owner inline-editor (name/description/tags/
 *      importable/unpublish) never opens — the owned tile shows a calm "manage
 *      on desktop" note in place of the Edit button. View + Import stay live.
 *   2. GalleryMaps, desktop: the Edit affordance and inline editor work as
 *      before (byte-identical), with no "manage on desktop" note.
 *   3. GallerySidebar, mobile: the ~30-chip filter wall moves into a BottomSheet
 *      behind a single Filters trigger; on desktop it stays the open sidebar.
 *
 * jsdom has no matchMedia, so we install a controllable fake (mobile vs
 * desktop) and reset module state per case so the per-breakpoint useIsMobile
 * store does not leak across renders.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const GALLERY_ITEMS = [
  { slug: 'owned-slug', name: 'Coastal Realm', kind: 'map', description: 'old desc', tags: ['old'], backdrop_kind: 'fmg', published_at: '2026-01-02T00:00:00Z', view_count: 3, importable: false },
  { slug: 'foreign-slug', name: 'Someone Else', kind: 'map', description: 'theirs', tags: [], backdrop_kind: 'fmg', published_at: '2026-01-01T00:00:00Z', view_count: 9, importable: true },
];

const shareMap = vi.fn().mockResolvedValue('owned-slug');
const unshareMap = vi.fn().mockResolvedValue(undefined);
const fetchGalleryMaps = vi.fn().mockResolvedValue({ items: GALLERY_ITEMS });
const fetchGalleryMap = vi.fn().mockResolvedValue(null);

vi.mock('../../../src/lib/gallery.js', () => ({
  shareMap: (...a) => shareMap(...a),
  unshareMap: (...a) => unshareMap(...a),
  fetchGalleryMaps: (...a) => fetchGalleryMaps(...a),
  fetchGalleryMap: (...a) => fetchGalleryMap(...a),
  GALLERY_SORT_OPTIONS: [['relevant', 'Most relevant'], ['top_voted', 'Top voted']],
}));

const storeState = {
  auth: { tier: 'premium', role: 'user' },
  campaigns: [
    { id: 'campaign-1', name: 'Coastal Realm', isPublic: true, publicSlug: 'owned-slug', shareKind: 'map', galleryDescription: 'old desc', galleryTags: ['old'] },
  ],
  renameCampaign: vi.fn(),
  importGalleryMap: vi.fn(),
  importGalleryMapWithCampaign: vi.fn(),
  setActiveCampaign: vi.fn(),
};

vi.mock('../../../src/store', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

// Controllable matchMedia fake. The whole app shares ONE useIsMobile store per
// breakpoint; reset modules per case so the matches value is read fresh.
function installMatchMedia(matches) {
  window.matchMedia = vi.fn((query) => ({
    media: query,
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }));
}

async function loadMaps() {
  vi.resetModules();
  return (await import('../../../src/components/gallery/GalleryMaps.jsx')).default;
}

async function loadSidebar() {
  vi.resetModules();
  return (await import('../../../src/components/gallery/GallerySidebar.jsx')).default;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('GalleryMaps — mobile owner-editor gate', () => {
  test('mobile: the owned tile defers editing to desktop (no Edit button, no inline editor)', async () => {
    installMatchMedia(true);
    const GalleryMaps = await loadMaps();
    render(<GalleryMaps />);

    await waitFor(() => expect(screen.getByText('Coastal Realm')).toBeTruthy());
    // The Edit affordance is replaced by a calm "manage on desktop" note.
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
    expect(screen.getByText('Manage on desktop')).toBeTruthy();
    // The dense inline editor is never reachable on mobile.
    expect(screen.queryByLabelText('Map description')).toBeNull();
    // View + Import (read + light-act) stay live.
    expect(screen.getAllByRole('button', { name: 'View' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Import' })).toBeTruthy();
  });

  test('desktop: the Edit affordance and inline editor work, with no desktop note', async () => {
    installMatchMedia(false);
    const GalleryMaps = await loadMaps();
    render(<GalleryMaps />);

    await waitFor(() => expect(screen.getByText('Coastal Realm')).toBeTruthy());
    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    expect(editButtons).toHaveLength(1);
    expect(screen.queryByText('Manage on desktop')).toBeNull();

    fireEvent.click(editButtons[0]);
    expect(screen.getByLabelText('Map description')).toBeTruthy();
  });
});

describe('GallerySidebar — mobile filters into a bottom sheet', () => {
  const filters = { tier: [], terrain: [], magicLevel: [], culture: [], prosperity: [] };
  const noop = () => {};

  test('mobile: facets hide behind a Filters trigger until the sheet is opened', async () => {
    installMatchMedia(true);
    const GallerySidebar = await loadSidebar();
    render(
      <GallerySidebar filters={filters} onToggleArray={noop} onToggleBool={noop} onClear={noop} isSignedIn={false} />,
    );

    // A single trigger opens the sheet; the section heading is not yet present.
    const trigger = screen.getByRole('button', { name: /filters/i });
    expect(trigger).toBeTruthy();
    expect(screen.queryByText('Terrain')).toBeNull();

    fireEvent.click(trigger);
    // The sheet is a labelled dialog and the facet sections are now visible.
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Terrain')).toBeTruthy();
  });

  test('desktop: the facet sidebar renders open inline (no trigger gate)', async () => {
    installMatchMedia(false);
    const GallerySidebar = await loadSidebar();
    render(
      <GallerySidebar filters={filters} onToggleArray={noop} onToggleBool={noop} onClear={noop} isSignedIn={false} />,
    );

    // Sections render immediately; there is no dialog wrapper.
    expect(screen.getByText('Terrain')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
