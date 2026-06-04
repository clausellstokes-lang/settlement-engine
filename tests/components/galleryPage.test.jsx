/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import GalleryPage from '../../src/components/GalleryPage.jsx';

const mocks = vi.hoisted(() => ({
  galleryApi: {
    fetchPublicGallery: vi.fn(),
    fetchPublicDossier: vi.fn(),
    fetchGalleryComments: vi.fn(),
    addGalleryComment: vi.fn(),
    deleteGalleryComment: vi.fn(),
    toggleGalleryVote: vi.fn(),
    reportGalleryDossier: vi.fn(),
    GALLERY_SORT_OPTIONS: [
      ['relevant', 'Most relevant'],
      ['top_voted', 'Top voted'],
    ],
  },
  storeState: {
    auth: { user: { id: 'user-1' } },
  },
  nav: {
    navigate: vi.fn(),
  },
}));

vi.mock('../../src/lib/gallery.js', () => mocks.galleryApi);
vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(mocks.storeState),
}));
vi.mock('../../src/hooks/useRoute.js', () => mocks.nav);
vi.mock('../../src/components/PublicDossierView.jsx', () => ({
  default: ({ dossier }) => <div data-testid="public-dossier">{dossier?.settlement?.name}</div>,
}));

describe('GalleryPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mocks.storeState.auth = { user: { id: 'user-1' } };
  });

  test('renders filterable cards and opens a gallery detail page', async () => {
    mocks.galleryApi.fetchPublicGallery.mockResolvedValue({
      items: [{
        id: 'settlement-1',
        slug: 'bramblefen',
        name: 'Bramblefen',
        tier: 'town',
        publishedAt: '2026-01-01',
        updatedAt: '2026-01-02',
        viewCount: 12,
        curated: true,
        description: 'A wetland market town.',
        imageUrl: '',
        tags: ['market'],
        population: 1200,
        terrain: 'forest',
        netVotes: 4,
        commentCount: 2,
      }],
      total: 1,
      hasMore: false,
    });
    mocks.galleryApi.fetchPublicDossier.mockResolvedValue({
      id: 'settlement-1',
      slug: 'bramblefen',
      name: 'Bramblefen',
      tier: 'town',
      settlement: { name: 'Bramblefen', population: 1200, config: { terrain: 'forest' } },
      description: 'A wetland market town.',
      tags: ['market'],
      netVotes: 4,
      viewCount: 12,
      commentCount: 2,
      moreByCreator: [],
      voteState: { voted: false },
    });
    mocks.galleryApi.fetchGalleryComments.mockResolvedValue([]);

    render(<GalleryPage onNavigate={vi.fn()} />);

    expect(await screen.findByText('Bramblefen')).toBeTruthy();
    expect(screen.getByText('Filters')).toBeTruthy();
    expect(screen.getByText('A wetland market town.')).toBeTruthy();
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('Bramblefen'));
    await waitFor(() => {
      expect(mocks.nav.navigate).toHaveBeenCalledWith('gallery', { params: { slug: 'bramblefen' } });
      expect(mocks.galleryApi.fetchPublicDossier).toHaveBeenCalledWith('bramblefen');
      expect(screen.getByText('Back to gallery')).toBeTruthy();
    });
  });

  test('upvotes through the gallery API when signed in', async () => {
    mocks.galleryApi.fetchPublicGallery.mockResolvedValue({
      items: [{ id: 'settlement-1', slug: 'bramblefen', name: 'Bramblefen', tier: 'town', netVotes: 0, viewCount: 0, commentCount: 0 }],
      total: 1,
      hasMore: false,
    });
    mocks.galleryApi.toggleGalleryVote.mockResolvedValue({ netVotes: 1, voted: true });

    render(<GalleryPage />);

    await screen.findByText('Bramblefen');
    fireEvent.click(screen.getByTitle('Upvote'));
    await waitFor(() => {
      expect(mocks.galleryApi.toggleGalleryVote).toHaveBeenCalledWith('settlement-1');
      expect(screen.getByTitle('Remove upvote')).toBeTruthy();
    });
  });

  test('reports a settlement from the detail view when signed in', async () => {
    mocks.galleryApi.fetchPublicGallery.mockResolvedValue({
      items: [{ id: 'settlement-1', slug: 'bramblefen', name: 'Bramblefen', tier: 'town', netVotes: 0, viewCount: 0, commentCount: 0 }],
      total: 1,
      hasMore: false,
    });
    mocks.galleryApi.fetchPublicDossier.mockResolvedValue({
      id: 'settlement-1',
      slug: 'bramblefen',
      name: 'Bramblefen',
      tier: 'town',
      settlement: { name: 'Bramblefen', population: 1200, config: { terrain: 'forest' } },
      description: 'A wetland market town.',
      tags: [],
      netVotes: 0,
      viewCount: 0,
      commentCount: 0,
      moreByCreator: [],
      voteState: { voted: false },
    });
    mocks.galleryApi.fetchGalleryComments.mockResolvedValue([]);
    mocks.galleryApi.reportGalleryDossier.mockResolvedValue('report-1');

    render(<GalleryPage />);

    fireEvent.click(await screen.findByText('Bramblefen'));
    await screen.findByText('Back to gallery');
    fireEvent.click(screen.getByTitle('Report settlement'));
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Needs review' } });
    fireEvent.click(screen.getByRole('button', { name: /send report/i }));

    await waitFor(() => {
      expect(mocks.galleryApi.reportGalleryDossier).toHaveBeenCalledWith('settlement-1', 'unsafe_content', 'Needs review');
      expect(screen.getByText('Report sent to the moderation queue.')).toBeTruthy();
    });
  });
});
