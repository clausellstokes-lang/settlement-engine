/**
 * @vitest-environment jsdom
 *
 * mapShareEditorCachedShareKind.test.jsx — the CACHED-ROW half of the world
 * PRESERVE-ON-OMIT guard, plus the cover-seed capture race.
 *
 * handleSaveDetails already omits the world trio when a persisted campaign share
 * mounts before its members hydrate (see mapShareEditorPreserveOnOmit.test.jsx).
 * But the guard keys off the CACHED campaign row's shareKind — and cachePatch()
 * used to stamp the stale draft kind ('map') onto that row, which
 * updateSavedCampaign persists. The NEXT save would then read shareKind:'map',
 * skip the guard, and null the published living world. These tests REPRODUCE:
 *
 *   1. World wipe — a stale-mount details save must NOT downgrade the cached
 *      shareKind; a re-save off the patched cache must still omit the world trio.
 *   2. Publish control — shareMap DOES write share_kind (p_kind), so the publish
 *      path must still stamp the cached shareKind.
 *   3. Cover race — an auto-capture already in flight when the persisted cover
 *      seed lands must not clobber the persisted cover (fills empty slots only).
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor, act } from '@testing-library/react';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const updateMapGalleryMetadata = vi.fn().mockResolvedValue(undefined);
const fetchCampaignGalleryFields = vi.fn().mockResolvedValue(null);
const shareMap = vi.fn().mockResolvedValue('slug-1');
const unshareMap = vi.fn().mockResolvedValue(undefined);

vi.mock('../../../src/lib/gallery.js', () => ({
  shareMap: (...a) => shareMap(...a),
  unshareMap: (...a) => unshareMap(...a),
  updateMapGalleryMetadata: (...a) => updateMapGalleryMetadata(...a),
  fetchCampaignGalleryFields: (...a) => fetchCampaignGalleryFields(...a),
}));

// Controllable capture mocks: the cover-race test swaps in a deferred promise so
// the capture can resolve AFTER the persisted-cover seed lands.
const captureMapThumb = vi.fn().mockResolvedValue(null);
const captureCampaignThumb = vi.fn().mockResolvedValue(null);

vi.mock('../../../src/lib/mapThumb.js', () => ({
  captureMapThumb: (...a) => captureMapThumb(...a),
  captureCampaignThumb: (...a) => captureCampaignThumb(...a),
}));

const storeState = {
  auth: { tier: 'premium', role: 'user', user: { id: 'user-1' } },
  updateSavedCampaign: vi.fn(),
};

vi.mock('../../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

const { default: MapShareEditor } = await import('../../../src/components/gallery/MapShareEditor.jsx');

const CAMPAIGN_ID = '11111111-2222-4333-8444-555555555555';

// Open the published-state details form and click Save.
async function openAndSave() {
  fireEvent.click(screen.getByRole('button', { name: /Gallery details/i }));
  const saveBtn = await screen.findByRole('button', { name: /Save gallery details/i });
  fireEvent.click(saveBtn);
}

describe('MapShareEditor cached shareKind PRESERVE-ON-OMIT', () => {
  // REPRODUCING the world wipe: a stale-mount save (members not hydrated) used to
  // stamp shareKind:'map' onto the cached campaign row, so the NEXT save read the
  // downgraded kind, skipped the world PRESERVE-ON-OMIT guard, and nulled the
  // published living world. updateMapGalleryMetadata never writes share_kind, so
  // a details save must never change the cached shareKind either.
  test('edit-while-unhydrated then re-save: the published world survives', async () => {
    const campaign = { id: CAMPAIGN_ID, name: 'Coastal Realm', isPublic: true, publicSlug: 'slug-1', shareKind: 'map_with_campaign' };
    const { unmount } = render(
      <MapShareEditor campaign={campaign} members={[]} bridge={null} ownerId="user-1" />,
    );
    await waitFor(() => expect(screen.getByText('Public')).toBeTruthy());

    await openAndSave();
    await waitFor(() => expect(updateMapGalleryMetadata).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(storeState.updateSavedCampaign).toHaveBeenCalled());

    // The cache patch must NOT downgrade the persisted campaign-share kind.
    const patch = storeState.updateSavedCampaign.mock.calls[0][1];
    expect(patch).not.toHaveProperty('shareKind');

    // Re-save off the patched cached row (what a remount reads after
    // persistCampaignState): the world trio must STILL be omitted.
    unmount();
    render(
      <MapShareEditor campaign={{ ...campaign, ...patch }} members={[]} bridge={null} ownerId="user-1" />,
    );
    await waitFor(() => expect(screen.getByText('Public')).toBeTruthy());
    await openAndSave();
    await waitFor(() => expect(updateMapGalleryMetadata).toHaveBeenCalledTimes(2));

    const bag = updateMapGalleryMetadata.mock.calls[1][1];
    expect(bag).not.toHaveProperty('shareWorld');
    expect(bag).not.toHaveProperty('worldSections');
    expect(bag).not.toHaveProperty('worldSnapshot');
  });

  // CONTROL: shareMap DOES write share_kind server-side (p_kind), so the publish
  // path must keep stamping the cached shareKind — the omit is details-save only.
  test('publish still stamps shareKind onto the cached row', async () => {
    render(
      <MapShareEditor
        campaign={{ id: CAMPAIGN_ID, name: 'Coastal Realm', isPublic: false, shareKind: null }}
        members={[]}
        bridge={null}
        ownerId="user-1"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Share to gallery/i }));
    await waitFor(() => expect(storeState.updateSavedCampaign).toHaveBeenCalled());

    const patch = storeState.updateSavedCampaign.mock.calls[0][1];
    expect(patch.shareKind).toBe('map');
    expect(patch.isPublic).toBe(true);
    expect(patch.publicSlug).toBe('slug-1');
  });
});

describe('MapShareEditor cover-seed capture race', () => {
  // REPRODUCING: the editor mounts with no cover, the auto-capture takes flight,
  // and the persisted-cover seed lands while it is airborne. The seedKeyRef guard
  // stops FUTURE captures but cannot recall this one — its resolution must not
  // clobber the persisted cover (the capture only fills an empty slot).
  test('an in-flight capture cannot overwrite the persisted cover', async () => {
    let resolveCapture;
    captureMapThumb.mockImplementationOnce(() => new Promise(resolve => { resolveCapture = resolve; }));
    fetchCampaignGalleryFields.mockResolvedValueOnce({
      imageUrl: 'https://cdn.example.com/persisted-cover.png',
      imageAlt: '',
      importable: true,
      worldSections: null,
    });

    render(
      <MapShareEditor
        campaign={{ id: CAMPAIGN_ID, name: 'Coastal Realm', isPublic: true, publicSlug: 'slug-1', shareKind: 'map' }}
        members={[]}
        bridge={{ isReady: true }}
        ownerId="user-1"
      />,
    );
    await waitFor(() => expect(captureMapThumb).toHaveBeenCalledTimes(1));

    // The persisted seed lands while the capture is still in flight.
    fireEvent.click(screen.getByRole('button', { name: /Gallery details/i }));
    const img = await screen.findByRole('img');
    expect(img.getAttribute('src')).toBe('https://cdn.example.com/persisted-cover.png');

    // Now the stale capture resolves — it must NOT replace the persisted cover.
    await act(async () => { resolveCapture({ imageUrl: 'https://cdn.example.com/stale-capture.png' }); });
    expect(screen.getByRole('img').getAttribute('src')).toBe('https://cdn.example.com/persisted-cover.png');

    // And the saved metadata bag carries the persisted cover, not the stale one.
    fireEvent.click(screen.getByRole('button', { name: /Save gallery details/i }));
    await waitFor(() => expect(updateMapGalleryMetadata).toHaveBeenCalled());
    expect(updateMapGalleryMetadata.mock.calls[0][1].imageUrl).toBe('https://cdn.example.com/persisted-cover.png');
  });
});
