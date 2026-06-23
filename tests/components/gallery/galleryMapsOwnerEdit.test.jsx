/**
 * @vitest-environment jsdom
 *
 * galleryMapsOwnerEdit.test.jsx — owner EDIT side of the gallery Maps tab.
 *
 * The gallery RPCs anonymize every tile (no user_id / campaign id), so the
 * Edit affordance is gated entirely client-side: it shows only on a tile whose
 * slug matches one of the signed-in user's own currently-public campaigns
 * (ownedCampaignBySlug). These tests pin two behaviors that the unit tests
 * cannot reach through the rendered component:
 *
 *   1. Affordance gate — Edit renders only on the owned tile, never the foreign
 *      one (anonymizing preserved, strict ownership).
 *   2. Save wiring — opening the editor and clicking Save calls shareMap with
 *      the OWNED campaign id (the saved_maps row id), not the slug, carrying the
 *      edited description + tags and preserving the publish kind.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';

afterEach(cleanup);

// Two public maps in the gallery; the user owns only the first.
const GALLERY_ITEMS = [
  { slug: 'owned-slug', name: 'Coastal Realm', kind: 'map', description: 'old desc', tags: ['old'], backdrop_kind: 'fmg', published_at: '2026-01-02T00:00:00Z', view_count: 3 },
  { slug: 'foreign-slug', name: 'Someone Else', kind: 'map', description: 'theirs', tags: [], backdrop_kind: 'fmg', published_at: '2026-01-01T00:00:00Z', view_count: 9 },
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
}));

const renameCampaign = vi.fn();

// The signed-in user owns one campaign, published under 'owned-slug'.
const storeState = {
  auth: { tier: 'premium', role: 'user' },
  campaigns: [
    { id: 'campaign-1', name: 'Coastal Realm', isPublic: true, publicSlug: 'owned-slug', shareKind: 'map', galleryDescription: 'old desc', galleryTags: ['old'] },
  ],
  renameCampaign,
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

const { default: GalleryMaps } = await import('../../../src/components/gallery/GalleryMaps.jsx');

describe('GalleryMaps owner edit affordance', () => {
  test('Edit shows only on the owned tile, never the foreign tile', async () => {
    render(<GalleryMaps />);
    // Both tiles render once the maps load.
    await waitFor(() => expect(screen.getByText('Coastal Realm')).toBeTruthy());
    expect(screen.getByText('Someone Else')).toBeTruthy();

    // Exactly one Edit affordance — strict gate keyed on the owned campaign.
    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    expect(editButtons).toHaveLength(1);
  });

  test('Save calls shareMap with the owned campaign id, edited description and tags', async () => {
    render(<GalleryMaps />);
    await waitFor(() => expect(screen.getByText('Coastal Realm')).toBeTruthy());

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    const desc = screen.getByLabelText('Map description');
    fireEvent.change(desc, { target: { value: 'a windswept shore' } });
    const tags = screen.getByLabelText('Map tags');
    fireEvent.change(tags, { target: { value: 'coastal, trade' } });

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(shareMap).toHaveBeenCalled());
    expect(shareMap).toHaveBeenCalledWith('campaign-1', {
      kind: 'map',
      description: 'a windswept shore',
      tags: ['coastal', 'trade'],
      // The owner edit also forwards the import opt-in (migration 072); the tile
      // seeds it off, and the checkbox wasn't toggled in this case.
      importable: false,
    });
    // No rename submitted (name unchanged), and a post-action refetch ran.
    expect(renameCampaign).not.toHaveBeenCalled();
    expect(fetchGalleryMaps).toHaveBeenCalled();
  });
});
