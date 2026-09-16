/** @vitest-environment jsdom */
/**
 * galleryCampaignsTab.test.jsx — the Campaigns third tab (GALLERY-2 phase 2).
 *
 * Pins:
 *   • the tab exists (Settlements · Maps · Campaigns) and renders the
 *     campaign grid when selected.
 *   • the listing queries kind:['map_with_campaign'] (and the Maps tab now
 *     narrows to kind:['map']) — the server RPC's kind facet.
 *   • the campaign card anatomy: world age chip, settlement count, aliveness
 *     badge, at-war chip, author.
 *   • ANON RENDERING (the phase-1 finding carried forward): a signed-out
 *     visitor sees the full campaign grid — the caps bind ACTIONS (the import
 *     press shows the premium notice), never rendering.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import GalleryPage from '../../../src/components/GalleryPage.jsx';
import GalleryCampaigns from '../../../src/components/gallery/GalleryCampaigns.jsx';

const mocks = vi.hoisted(() => ({
  galleryApi: {
    fetchPublicGallery: vi.fn().mockResolvedValue({ items: [], total: 0, hasMore: false }),
    fetchPublicDossier: vi.fn(),
    fetchGalleryComments: vi.fn().mockResolvedValue([]),
    addGalleryComment: vi.fn(),
    deleteGalleryComment: vi.fn(),
    toggleGalleryVote: vi.fn(),
    toggleGalleryReaction: vi.fn(),
    reportGalleryDossier: vi.fn(),
    fetchGalleryMaps: vi.fn().mockResolvedValue({ items: [] }),
    fetchGalleryMap: vi.fn(),
    GALLERY_SORT_OPTIONS: [['relevant', 'Most relevant']],
  },
  storeState: {
    auth: null, // ANON by default — rendering must not gate on sign-in.
    savedSettlementsLoaded: true,
    savedSettlementsOwnerId: null,
    savedSettlementsHydrationGeneration: 0,
    setSavedSettlements: vi.fn(),
    importGalleryMap: vi.fn(),
    importGalleryMapWithCampaign: vi.fn(),
    setActiveCampaign: vi.fn(),
  },
  nav: { navigate: vi.fn() },
}));

vi.mock('../../../src/lib/gallery.js', () => mocks.galleryApi);
vi.mock('../../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(mocks.storeState);
  }
  useStore.getState = () => mocks.storeState;
  return { useStore };
});
vi.mock('../../../src/store', () => {
  function useStore(selector) {
    return selector(mocks.storeState);
  }
  useStore.getState = () => mocks.storeState;
  return { useStore };
});
vi.mock('../../../src/hooks/useRoute.js', () => mocks.nav);

const CAMPAIGN_TILE = {
  slug: 'the-reach',
  name: 'The Reach',
  kind: 'map_with_campaign',
  description: 'A living border realm.',
  tags: ['frontier'],
  backdrop_kind: 'fmg',
  thumb_url: '',
  image_url: '',
  published_at: '2026-07-01',
  view_count: 9,
  import_count: 2,
  member_count: 4,
  importable: true,
  author_name: 'Keeper of Maps',
  at_war: true,
  world_age: 'this-year',
  aliveness: 87,
};

describe('the Campaigns third tab', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mocks.storeState.auth = null;
  });

  test('GalleryPage shows Settlements · Maps · Campaigns and the campaigns grid queries kind=map_with_campaign', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [CAMPAIGN_TILE] });
    render(<GalleryPage onNavigate={vi.fn()} />);
    expect(screen.getByText('Settlements')).toBeTruthy();
    expect(screen.getByText('Maps')).toBeTruthy();
    fireEvent.click(screen.getByText('Campaigns'));
    expect(await screen.findByText('The Reach')).toBeTruthy();
    // The Campaigns tab now carries the full Settlements-tab filter shape (its
    // sidebar facets ride along in their empty form), so the wire payload's
    // filters is { ...emptyMapFilters, kind:['map_with_campaign'] } — pin the
    // kind narrowing with objectContaining (the Maps-tab idiom), not an exact
    // object match.
    expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenCalledWith(
      expect.objectContaining({ filters: expect.objectContaining({ kind: ['map_with_campaign'] }) }),
    );
  });

  test('the Maps tab narrows to blank maps (kind=map)', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [] });
    render(<GalleryPage onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByText('Maps'));
    expect(await screen.findByText(/No shared maps yet/i)).toBeTruthy();
    // The sidebar facets (backdrop / importable / tags) ride along in their
    // empty shape — normalizeMapFilters drops them, so the wire payload stays
    // exactly the kind narrowing. The pin binds kind, not the empty facets.
    expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenCalledWith(
      expect.objectContaining({ filters: expect.objectContaining({ kind: ['map'] }) }),
    );
  });

  test('campaign card anatomy: world age, settlement count, aliveness, at-war, author — all render for ANON', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [CAMPAIGN_TILE] });
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText('The Reach')).toBeTruthy();
    expect(screen.getByLabelText('World age: a year old')).toBeTruthy();
    expect(screen.getByLabelText('4 settlements')).toBeTruthy();
    expect(screen.getByLabelText('Aliveness 87 out of 100')).toBeTruthy();
    expect(screen.getByLabelText('This realm is at war')).toBeTruthy();
    expect(screen.getByText('by Keeper of Maps')).toBeTruthy();
    // Anon caps bind the ACTION: the import affordance is present and pressing
    // it produces the premium notice, not a hidden grid.
    fireEvent.click(screen.getByText('Import (premium)'));
    expect(await screen.findByText(/premium feature/i)).toBeTruthy();
    expect(mocks.storeState.importGalleryMapWithCampaign).not.toHaveBeenCalled();
  });

  test('un-stamped tiles render no aliveness/world-age chips (unknown, not zero)', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({
      items: [{ ...CAMPAIGN_TILE, aliveness: null, world_age: null, at_war: false }],
    });
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText('The Reach')).toBeTruthy();
    expect(screen.queryByLabelText(/Aliveness/)).toBeNull();
    expect(screen.queryByLabelText(/World age/)).toBeNull();
    expect(screen.queryByLabelText('This realm is at war')).toBeNull();
  });
});

// ── Settlements-tab PARITY: filter rail + search + sort + filtered-empty ──────
describe('the Campaigns tab — full filter/search/sort parity', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mocks.storeState.auth = null;
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [] });
  });

  test('renders the honest campaign facets: Backdrop + Has settlements + Importable + Tags', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [CAMPAIGN_TILE] });
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText('The Reach')).toBeTruthy();
    expect(screen.getByText('Filters')).toBeTruthy();
    expect(screen.getByText('Backdrop')).toBeTruthy();
    // Has-settlements IS coherent for campaigns (member_count can be > 0) — the
    // facet struck on the blank-maps tab is shown here.
    expect(screen.getByLabelText('Has settlements')).toBeTruthy();
    expect(screen.getByLabelText('Importable only')).toBeTruthy();
    // The dynamic tag vocabulary renders as chips (button, capitalized human()).
    expect(screen.getByRole('button', { name: 'frontier' })).toBeTruthy();
    // The result-count chip reports the shared-campaign count.
    expect(screen.getByText('1 shared campaign')).toBeTruthy();
  });

  test('toggling has-settlements refetches with the facet AND kind=map_with_campaign intact', async () => {
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared campaigns yet/i)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Has settlements'));
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: expect.objectContaining({ hasSettlements: true, kind: ['map_with_campaign'] }) }),
    ));
  });

  test('a filtered-empty result offers Clear filters, and clearing refetches unfiltered', async () => {
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared campaigns yet/i)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Importable only'));
    expect(await screen.findByText(/No campaigns match those filters/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(await screen.findByText(/No shared campaigns yet/i)).toBeTruthy();
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: expect.objectContaining({ importable: false, kind: ['map_with_campaign'] }) }),
    ));
  });

  test('changing the sort refetches with the server sort key', async () => {
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared campaigns yet/i)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Sort campaigns'), { target: { value: 'most_imported' } });
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({ sort: 'most_imported', filters: expect.objectContaining({ kind: ['map_with_campaign'] }) }),
    ));
  });

  test('typing a search refetches (debounced) with the query and the kind narrowing', async () => {
    render(<GalleryCampaigns onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared campaigns yet/i)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Search campaigns'), { target: { value: 'reach' } });
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: 'reach', filters: expect.objectContaining({ kind: ['map_with_campaign'] }) }),
    ), { timeout: 1500 });
  });
});
