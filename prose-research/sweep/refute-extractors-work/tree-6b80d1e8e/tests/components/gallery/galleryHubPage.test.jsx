/** @vitest-environment jsdom */
/**
 * galleryHubPage.test.jsx — the facet-hub landing page (GALLERY-2 phase 2).
 *
 * The load-bearing assertion (the phase-1 finding carried into this wave):
 * HUBS RENDER FOR ANON. A signed-out crawler/visitor gets the full landing —
 * heading, blurb, the matching dossier cards, and the sibling-hub crawl mesh;
 * only the ACTIONS are capped (a vote press yields the sign-in notice).
 *
 * Also pinned: the locked query per hub kind (terrain filter / most_alive
 * sort with curated INCLUDED), and the in-page not-found for an unknown hub.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import GalleryHubPage from '../../../src/components/gallery/GalleryHubPage.jsx';

const mocks = vi.hoisted(() => ({
  galleryApi: {
    fetchPublicGallery: vi.fn(),
    toggleGalleryVote: vi.fn(),
  },
  seo: { setGalleryHubMeta: vi.fn() },
  nav: { navigate: vi.fn() },
  storeState: { auth: null }, // ANON by default.
}));

vi.mock('../../../src/lib/gallery.js', async (importOriginal) => {
  const real = await importOriginal();
  return { ...real, ...mocks.galleryApi };
});
vi.mock('../../../src/lib/seoDossier.js', () => mocks.seo);
vi.mock('../../../src/hooks/useRoute.js', () => mocks.nav);
vi.mock('../../../src/store/index.js', () => ({ useStore: selector => selector(mocks.storeState) }));

const TILE = {
  id: 'settlement-1',
  slug: 'thornwick',
  name: 'Thornwick',
  tier: 'town',
  publishedAt: '2026-07-01',
  updatedAt: '2026-07-02',
  viewCount: 3,
  curated: false,
  description: '',
  imageUrl: '',
  tags: [],
  population: 900,
  terrain: 'forest',
  netVotes: 2,
  commentCount: 0,
  reactions: {},
  aliveness: 87,
};

describe('GalleryHubPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mocks.storeState.auth = null;
  });

  test('ANON gets the full landing: heading, blurb, matching cards, crawl mesh — and the locked terrain filter', async () => {
    mocks.galleryApi.fetchPublicGallery.mockResolvedValue({ items: [TILE], total: 1, hasMore: false });
    render(<GalleryHubPage routeHub={{ facet: 'terrain', value: 'forest' }} />);

    expect(await screen.findByText('Thornwick')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Forest Settlements' })).toBeTruthy();
    expect(screen.getByText(/forest terrain/i)).toBeTruthy();
    // The locked query: terrain filter, curated INCLUDED.
    expect(mocks.galleryApi.fetchPublicGallery).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: { terrain: ['forest'] },
        sort: 'relevant',
        excludeCurated: false,
      }),
    );
    // The crawl mesh: sibling hubs as REAL anchors (crawlable hrefs).
    const mesh = screen.getByRole('navigation', { name: /more gallery collections/i });
    expect(mesh.querySelectorAll('a[href^="/gallery/"]').length).toBe(14); // 15 − self
    // The head upgrade fired with this hub.
    expect(mocks.seo.setGalleryHubMeta).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/gallery/terrain/forest' }),
    );
  });

  test('the most-alive hub locks the most_alive sort', async () => {
    mocks.galleryApi.fetchPublicGallery.mockResolvedValue({ items: [], total: 0, hasMore: false });
    render(<GalleryHubPage routeHub={{ facet: 'most-alive' }} />);
    expect(await screen.findByRole('heading', { name: 'The Most Alive Worlds' })).toBeTruthy();
    expect(mocks.galleryApi.fetchPublicGallery).toHaveBeenCalledWith(
      expect.objectContaining({ sort: 'most_alive', filters: {} }),
    );
  });

  test('anon caps bind ACTIONS: a vote press yields the sign-in notice, never a hidden page', async () => {
    mocks.galleryApi.fetchPublicGallery.mockResolvedValue({ items: [TILE], total: 1, hasMore: false });
    render(<GalleryHubPage routeHub={{ facet: 'tier', value: 'town' }} />);
    await screen.findByText('Thornwick');
    fireEvent.click(screen.getByRole('button', { name: /upvote/i }));
    expect(await screen.findByText('Sign in to vote on public settlements.')).toBeTruthy();
    expect(mocks.galleryApi.toggleGalleryVote).not.toHaveBeenCalled();
  });

  test('an unknown hub renders the in-page not-found with a way back', () => {
    render(<GalleryHubPage routeHub={{ facet: 'terrain', value: 'lava_fields' }} />);
    expect(screen.getByText(/does not exist/i)).toBeTruthy();
    fireEvent.click(screen.getByText('Browse the full gallery'));
    expect(mocks.nav.navigate).toHaveBeenCalledWith('gallery');
    expect(mocks.galleryApi.fetchPublicGallery).not.toHaveBeenCalled();
  });

  test('pagination state is isolated when client navigation switches to a sibling hub', async () => {
    const forestPageTwo = { ...TILE, id: 'settlement-2', slug: 'pinewatch', name: 'Pinewatch' };
    const coastalTile = {
      ...TILE,
      id: 'settlement-3',
      slug: 'salt-harbor',
      name: 'Salt Harbor',
      terrain: 'coastal',
    };
    mocks.galleryApi.fetchPublicGallery.mockImplementation(({ page, filters }) => {
      const terrain = filters?.terrain?.[0];
      if (terrain === 'forest' && page === 0) {
        return Promise.resolve({ items: [TILE], total: 2, hasMore: true });
      }
      if (terrain === 'forest' && page === 1) {
        return Promise.resolve({ items: [forestPageTwo], total: 2, hasMore: false });
      }
      return Promise.resolve({ items: [coastalTile], total: 1, hasMore: false });
    });

    const { rerender } = render(<GalleryHubPage routeHub={{ facet: 'terrain', value: 'forest' }} />);
    await screen.findByText('Thornwick');
    fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    await screen.findByText('Pinewatch');

    rerender(<GalleryHubPage routeHub={{ facet: 'terrain', value: 'coastal' }} />);
    expect(await screen.findByText('Salt Harbor')).toBeTruthy();
    expect(screen.queryByText('Thornwick')).toBeNull();
    expect(screen.queryByText('Pinewatch')).toBeNull();
    expect(mocks.galleryApi.fetchPublicGallery).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 0, filters: { terrain: ['coastal'] } }),
    );
  });
});
