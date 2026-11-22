/** @vitest-environment jsdom */
/**
 * galleryMapsFilters.test.jsx — the maps-tab filter sidebar (T5, the
 * orphaned-components ruling: GalleryMapsSidebar wired into GalleryMaps).
 *
 * Pins:
 *   • the sidebar renders on the maps browse view with exactly the facets the
 *     narrowed tab supports — Backdrop / Import / Tags. The kind chips and the
 *     has-settlements toggle stay struck (GALLERY-2 phase 2 pinned this tab to
 *     blank maps, which carry no settlements).
 *   • toggling a facet refetches server-side with that facet AND the pinned
 *     kind:['map'] narrowing intact.
 *   • a filtered-empty result offers the recovery path ("No maps match" +
 *     Clear filters), and clearing refetches the unfiltered listing.
 *   • the tag vocabulary derives from the UNFILTERED batch and holds sticky
 *     across filtered refetches (chips never collapse to the selected tags).
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import GalleryMaps from '../../../src/components/gallery/GalleryMaps.jsx';

const mocks = vi.hoisted(() => ({
  galleryApi: {
    fetchGalleryMaps: vi.fn().mockResolvedValue({ items: [] }),
    fetchGalleryMap: vi.fn(),
  },
  storeState: {
    auth: null,
    importGalleryMap: vi.fn(),
    importGalleryMapWithCampaign: vi.fn(),
    setActiveCampaign: vi.fn(),
  },
}));

vi.mock('../../../src/lib/gallery.js', () => mocks.galleryApi);
vi.mock('../../../src/store/index.js', () => ({ useStore: selector => selector(mocks.storeState) }));
vi.mock('../../../src/store', () => ({ useStore: selector => selector(mocks.storeState) }));

const MAP_TILE = {
  slug: 'salt-coast',
  name: 'Salt Coast',
  kind: 'map',
  description: 'A briny frontier.',
  tags: ['coastal', 'frontier'],
  backdrop_kind: 'fmg',
  thumb_url: '',
  image_url: '',
  published_at: '2026-07-01',
  view_count: 3,
  import_count: 1,
  member_count: 0,
  importable: true,
};

describe('the maps-tab filter sidebar', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [] });
  });

  test('renders only the narrowed-tab facets: Backdrop + Import + tags; kind and has-settlements stay struck', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [MAP_TILE] });
    render(<GalleryMaps onNavigate={vi.fn()} />);
    expect(await screen.findByText('Salt Coast')).toBeTruthy();
    expect(screen.getByText('Filters')).toBeTruthy();
    expect(screen.getByText('Backdrop')).toBeTruthy();
    expect(screen.getByLabelText('Importable only')).toBeTruthy();
    // The dynamic tag vocabulary from the batch renders as chips.
    expect(screen.getByRole('button', { name: 'coastal' })).toBeTruthy();
    // Struck facets: no kind chips, no has-settlements toggle on this tab.
    expect(screen.queryByText('Map only')).toBeNull();
    expect(screen.queryByLabelText('Has settlements')).toBeNull();
  });

  test('toggling a facet refetches with the facet and the kind narrowing intact', async () => {
    render(<GalleryMaps onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared maps yet/i)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Importable only'));
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenCalledTimes(2));
    expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({ importable: true, kind: ['map'] }),
      }),
    );
  });

  test('a filtered-empty result offers Clear filters, and clearing refetches unfiltered', async () => {
    render(<GalleryMaps onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared maps yet/i)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Importable only'));
    expect(await screen.findByText(/No maps match those filters/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(await screen.findByText(/No shared maps yet/i)).toBeTruthy();
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenCalledTimes(3));
    expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({ importable: false, kind: ['map'] }),
      }),
    );
  });

  test('the tag vocabulary holds sticky across a filtered refetch', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [MAP_TILE] });
    render(<GalleryMaps onNavigate={vi.fn()} />);
    expect(await screen.findByText('Salt Coast')).toBeTruthy();
    // Narrow to a tag; the server returns nothing for it.
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [] });
    fireEvent.click(screen.getByRole('button', { name: 'frontier' }));
    expect(await screen.findByText(/No maps match those filters/i)).toBeTruthy();
    // Both chips survive — the vocabulary derived from the unfiltered batch.
    expect(screen.getByRole('button', { name: 'coastal' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'frontier' })).toBeTruthy();
  });
});

// ── Settlements-tab PARITY: the maps tab's search + sort + result count ───────
describe('the maps-tab topbar (search + sort + count, Settlements-tab parity)', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [] });
  });

  test('the result-count chip reports the shared-map count', async () => {
    mocks.galleryApi.fetchGalleryMaps.mockResolvedValue({ items: [MAP_TILE] });
    render(<GalleryMaps onNavigate={vi.fn()} />);
    expect(await screen.findByText('Salt Coast')).toBeTruthy();
    expect(screen.getByText('1 shared map')).toBeTruthy();
  });

  test('changing the sort refetches with the server sort key (kind narrowing intact)', async () => {
    render(<GalleryMaps onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared maps yet/i)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Sort maps'), { target: { value: 'most_viewed' } });
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({ sort: 'most_viewed', filters: expect.objectContaining({ kind: ['map'] }) }),
    ));
  });

  test('typing a search refetches (debounced) with the query and the kind narrowing', async () => {
    render(<GalleryMaps onNavigate={vi.fn()} />);
    expect(await screen.findByText(/No shared maps yet/i)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Search maps'), { target: { value: 'salt' } });
    await waitFor(() => expect(mocks.galleryApi.fetchGalleryMaps).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: 'salt', filters: expect.objectContaining({ kind: ['map'] }) }),
    ), { timeout: 1500 });
  });
});
