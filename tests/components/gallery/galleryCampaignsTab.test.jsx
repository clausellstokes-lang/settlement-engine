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
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

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
    importGalleryMap: vi.fn(),
    importGalleryMapWithCampaign: vi.fn(),
    setActiveCampaign: vi.fn(),
  },
  nav: { navigate: vi.fn() },
}));

vi.mock('../../../src/lib/gallery.js', () => mocks.galleryApi);
vi.mock('../../../src/store/index.js', () => ({ useStore: selector => selector(mocks.storeState) }));
vi.mock('../../../src/store', () => ({ useStore: selector => selector(mocks.storeState) }));
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
    expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenCalledWith(
      expect.objectContaining({ filters: { kind: ['map_with_campaign'] } }),
    );
  });

  test('the Maps tab narrows to blank maps (kind=map)', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [] });
    render(<GalleryPage onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByText('Maps'));
    expect(await screen.findByText(/No shared maps yet/i)).toBeTruthy();
    expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenCalledWith(
      expect.objectContaining({ filters: { kind: ['map'] } }),
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
