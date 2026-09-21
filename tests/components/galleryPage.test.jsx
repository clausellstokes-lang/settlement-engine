/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import GalleryPage from '../../src/components/GalleryPage.jsx';
import { en } from '../../src/copy/en.js';

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
    // GalleryPage's owner-card hydration reads the same owner-scoped cache
    // contract as the Library. These tests start from an already-hydrated cache
    // because they exercise gallery behavior, not the hydration seam itself.
    savedSettlementsLoaded: true,
    savedSettlementsOwnerId: 'user-1',
    savedSettlementsHydrationGeneration: 0,
    setSavedSettlements: vi.fn(),
  },
  nav: {
    navigate: vi.fn(),
  },
}));

vi.mock('../../src/lib/gallery.js', () => mocks.galleryApi);
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(mocks.storeState);
  }
  useStore.getState = () => mocks.storeState;
  return { useStore };
});
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

  // RESTORATION #10 — the shared Page frame + PageHeader identity and the
  // Segmented view switch were dropped at the composite (the tabs went
  // identity-less). This pins that the index carries the page title, the
  // secondary "Forge your own" CTA, and the labelled 3-tab switch.
  test('carries the shared page identity: header, forge CTA, and the tab switch', async () => {
    // A non-empty gallery so the empty-state's own forge invitation stays hidden
    // and the ONE forge CTA on screen is the shared page header's (the identity
    // under test). A duplicate here would mean GalleryList kept its old header.
    mocks.galleryApi.fetchPublicGallery.mockResolvedValue({
      items: [{ id: 's1', slug: 'x', name: 'Xtown', tier: 'town', netVotes: 0, viewCount: 0, commentCount: 0 }],
      total: 1,
      hasMore: false,
    });
    render(<GalleryPage onNavigate={vi.fn()} />);

    await screen.findByText('Xtown');
    // Exactly one page title (the shared PageHeader), not two.
    expect(screen.getByRole('heading', { name: 'Gallery' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /forge your own/i })).toBeTruthy();

    const group = screen.getByRole('group', { name: 'Gallery view' });
    expect(group).toBeTruthy();
    for (const label of ['Settlements', 'Maps', 'Campaigns']) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    }
  });

  // A failed list read used to render the BACKEND's own words at the reader:
  // "Could not load the gallery: <PostgREST/network message>", while the copy
  // register's own `gallery.loadError` sat unused. The raw text is a diagnostic
  // and belongs in the console; the reader gets the house line.
  test('a failed list read shows the house error line, never the raw backend message', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.galleryApi.fetchPublicGallery.mockRejectedValue(
      new Error('FetchError: request to https://db.example/rest/v1/gallery failed, reason: ECONNREFUSED'),
    );

    render(<GalleryPage onNavigate={vi.fn()} />);

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toBe(en.gallery.loadError);
    // Anchored negative: the alert IS on screen (above), and neither the raw
    // message nor the old hand-written prefix appears anywhere on the page.
    expect(screen.queryByText(/ECONNREFUSED/)).toBeNull();
    expect(screen.queryByText(/Could not load the gallery/)).toBeNull();
    // The diagnostic still reaches the console for whoever has to fix it.
    expect(consoleError).toHaveBeenCalledWith('[gallery] list fetch failed', expect.any(Error));
    consoleError.mockRestore();
  });

  // The empty-gallery whisper's dismiss control was a <Button> with neither
  // children nor an icon. Icons are suppressed everywhere but the Realm map
  // (IconsContext), so even an `icon` prop would have left an empty labelled
  // box: the affordance has to be the unicode TEXT twin.
  test('the empty-gallery whisper carries a visible dismiss mark, not an empty box', async () => {
    mocks.galleryApi.fetchPublicGallery.mockResolvedValue({ items: [], total: 0, hasMore: false });

    render(<GalleryPage onNavigate={vi.fn()} />);

    const dismiss = await screen.findByRole('button', { name: 'Dismiss the gallery invitation' });
    expect(dismiss.textContent.trim()).toBe('×');
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
