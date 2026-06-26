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
 *   2. Editor wiring — opening the editor mounts the shared MapShareEditor for
 *      the OWNED campaign. Because that campaign is public, the editor opens in
 *      its published state (Public badge + Unshare), proving GalleryMaps wires
 *      the owned campaign through rather than the foreign tile. The editor owns
 *      its own publish / details / unshare flow (covered by its own surface), so
 *      this test no longer reaches into a per-field save form.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';

afterEach(cleanup);

// Two public maps in the gallery; the user owns only the first. The owned map is
// NOT importable (owner hasn't opted in → editor seeds importable:false); the
// foreign map IS importable (migration 072 facet → its tile offers Import).
const GALLERY_ITEMS = [
  { slug: 'owned-slug', name: 'Coastal Realm', kind: 'map', description: 'old desc', tags: ['old'], backdrop_kind: 'fmg', published_at: '2026-01-02T00:00:00Z', view_count: 3, importable: false },
  { slug: 'foreign-slug', name: 'Someone Else', kind: 'map', description: 'theirs', tags: [], backdrop_kind: 'fmg', published_at: '2026-01-01T00:00:00Z', view_count: 9, importable: true },
];

const shareMap = vi.fn().mockResolvedValue('owned-slug');
const unshareMap = vi.fn().mockResolvedValue(undefined);
const fetchGalleryMaps = vi.fn().mockResolvedValue({ items: GALLERY_ITEMS });
const fetchGalleryMap = vi.fn().mockResolvedValue(null);

const updateMapGalleryMetadata = vi.fn().mockResolvedValue(undefined);
// The editor seeds its edit-after-publish draft from this dedicated fetch on mount;
// null ⇒ no persisted seed available, so the draft keeps its defaults.
const fetchCampaignGalleryFields = vi.fn().mockResolvedValue(null);

vi.mock('../../../src/lib/gallery.js', () => ({
  shareMap: (...a) => shareMap(...a),
  unshareMap: (...a) => unshareMap(...a),
  updateMapGalleryMetadata: (...a) => updateMapGalleryMetadata(...a),
  fetchCampaignGalleryFields: (...a) => fetchCampaignGalleryFields(...a),
  fetchGalleryMaps: (...a) => fetchGalleryMaps(...a),
  fetchGalleryMap: (...a) => fetchGalleryMap(...a),
}));

// The signed-in user owns one campaign, published under 'owned-slug'. auth.user
// is present so the MapShareEditor (which self-gates anonymous users) renders.
const storeState = {
  auth: { tier: 'premium', role: 'user', user: { id: 'user-1' } },
  campaigns: [
    // A real UUID id so MapShareEditor's canSync gate (UUID_RE) passes and the
    // editor opens in its full published state rather than the "save first" hint.
    { id: '11111111-2222-4333-8444-555555555555', name: 'Coastal Realm', isPublic: true, publicSlug: 'owned-slug', shareKind: 'map', galleryDescription: 'old desc', galleryTags: ['old'] },
  ],
  importGalleryMap: vi.fn(),
  importGalleryMapWithCampaign: vi.fn(),
  setActiveCampaign: vi.fn(),
  updateSavedCampaign: vi.fn(),
  savedSettlements: [],
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

  test('Edit opens the MapShareEditor for the owned campaign (published state)', async () => {
    render(<GalleryMaps />);
    await waitFor(() => expect(screen.getByText('Coastal Realm')).toBeTruthy());

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    // The shared editor mounts. The owned campaign is public, so the editor opens
    // in its published state: a Public badge plus an Unshare control. This proves
    // GalleryMaps threaded the OWNED campaign through (a foreign / unsynced one
    // would show the "save first" hint instead). The editor owns publish/unshare
    // internally, so we assert the integration, not a per-field save form.
    await waitFor(() => expect(screen.getByText('Public')).toBeTruthy());
    expect(screen.getByRole('button', { name: /Unshare/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Close editor/i })).toBeTruthy();
  });

  test('Import is gated on the owner opt-in (migration 072): importable tile offers Import, non-importable shows view-only', async () => {
    render(<GalleryMaps />);
    await waitFor(() => expect(screen.getByText('Someone Else')).toBeTruthy());
    // The importable foreign map offers an Import action (premium user).
    expect(screen.getByRole('button', { name: 'Import' })).toBeTruthy();
    // The non-importable owned map shows a view-only status in the import slot,
    // never an enabled Import — no dead-end button.
    expect(screen.getByText('View-only')).toBeTruthy();
  });
});
