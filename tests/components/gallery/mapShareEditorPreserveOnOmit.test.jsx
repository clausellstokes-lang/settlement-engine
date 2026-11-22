/**
 * @vitest-environment jsdom
 *
 * mapShareEditorPreserveOnOmit.test.jsx edit-after-publish PRESERVE-ON-OMIT
 * guards in MapShareEditor for two fields the campaign-load SELECT never carries.
 *
 * The per-page campaign-load SELECT omits the 088 gallery columns, so on first
 * mount the editor cannot trust its props as the persisted truth: a dedicated
 * async fetch (fetchCampaignGalleryFields) seeds the real values, and member
 * settlements hydrate separately. A Save fired BEFORE those land must not silently
 * overwrite the persisted state. These tests REPRODUCE two such races:
 *
 *   1. Import opt-in a save before the seed resolves must NOT include
 *      gallery_importable (so a persisted importable:true is not flipped to false).
 *   2. World snapshot a save from a stale campaign-share mount (members not yet
 *      loaded) must NOT include the world trio (so the living world is not nulled).
 *
 * Both assert on the metadata bag handed to updateMapGalleryMetadata: a preserved
 * field is one OMITTED from the bag (galleryMapMetadataPatch writes a column only
 * when its key is present, so an absent key keeps the prior value).
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

// Capture the edit-after-publish metadata bag. The seed fetch resolves to null so
// the async importable seed never lands during the test window (modelling the race
// where the owner saves before the seed resolves).
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

// The cover-seed captures are irrelevant here (no bridge is passed), so stub them
// to no-op resolved values in case the guard ever changes.
vi.mock('../../../src/lib/mapThumb.js', () => ({
  captureMapThumb: vi.fn().mockResolvedValue(null),
  captureCampaignThumb: vi.fn().mockResolvedValue(null),
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

// Open the published-state details form and click Save, returning the metadata bag
// handed to updateMapGalleryMetadata.
async function saveAndCaptureBag() {
  fireEvent.click(screen.getByRole('button', { name: /Gallery details/i }));
  const saveBtn = await screen.findByRole('button', { name: /Save gallery details/i });
  fireEvent.click(saveBtn);
  await waitFor(() => expect(updateMapGalleryMetadata).toHaveBeenCalled());
  return updateMapGalleryMetadata.mock.calls[0][1];
}

describe('MapShareEditor import opt-in PRESERVE-ON-OMIT', () => {
  // REPRODUCING: campaign-load omits gallery_importable, the prop defaults false,
  // and the seed has not resolved a Save in that window must omit importable so
  // the patch cannot flip a persisted importable:true to false.
  test('a save before the seed resolves does NOT include gallery_importable', async () => {
    render(
      <MapShareEditor
        campaign={{ id: CAMPAIGN_ID, name: 'Coastal Realm', isPublic: true, publicSlug: 'slug-1', shareKind: 'map' }}
        members={[]}
        bridge={null}
        ownerId="user-1"
        galleryImportable={false}
      />,
    );
    await waitFor(() => expect(screen.getByText('Public')).toBeTruthy());

    const bag = await saveAndCaptureBag();
    expect(bag).not.toHaveProperty('importable');
  });

  test('once the owner toggles it, the save DOES include importable', async () => {
    render(
      <MapShareEditor
        campaign={{ id: CAMPAIGN_ID, name: 'Coastal Realm', isPublic: true, publicSlug: 'slug-1', shareKind: 'map' }}
        members={[]}
        bridge={null}
        ownerId="user-1"
        galleryImportable={false}
      />,
    );
    await waitFor(() => expect(screen.getByText('Public')).toBeTruthy());

    fireEvent.click(screen.getByRole('button', { name: /Gallery details/i }));
    const checkbox = await screen.findByLabelText(/Allow others to import this map/i);
    fireEvent.click(checkbox); // concrete owner choice → a real boolean is written
    fireEvent.click(screen.getByRole('button', { name: /Save gallery details/i }));
    await waitFor(() => expect(updateMapGalleryMetadata).toHaveBeenCalled());

    expect(updateMapGalleryMetadata.mock.calls[0][1].importable).toBe(true);
  });
});

describe('MapShareEditor world snapshot PRESERVE-ON-OMIT', () => {
  // REPRODUCING: a persisted map_with_campaign share mounts before its member
  // settlements hydrate. canShareCampaign is false (empty member list), so kind is
  // forced to 'map' and buildShareOpts would emit shareWorld:false / [] / null. A
  // Save from that stale mount must omit the world trio so the living world is kept.
  test('a stale campaign-share mount does NOT null the world fields', async () => {
    render(
      <MapShareEditor
        campaign={{ id: CAMPAIGN_ID, name: 'Coastal Realm', isPublic: true, publicSlug: 'slug-1', shareKind: 'map_with_campaign' }}
        members={[]}
        bridge={null}
        ownerId="user-1"
      />,
    );
    await waitFor(() => expect(screen.getByText('Public')).toBeTruthy());

    const bag = await saveAndCaptureBag();
    expect(bag).not.toHaveProperty('shareWorld');
    expect(bag).not.toHaveProperty('worldSections');
    expect(bag).not.toHaveProperty('worldSnapshot');
  });

  // CONTROL: when members ARE loaded the editor reconstructs the campaign share, so
  // the world trio IS written (the guard preserves only on the unloaded stale mount).
  test('with members loaded, a campaign share DOES write the world fields', async () => {
    render(
      <MapShareEditor
        campaign={{ id: CAMPAIGN_ID, name: 'Coastal Realm', isPublic: true, publicSlug: 'slug-1', shareKind: 'map_with_campaign' }}
        members={[{ name: 'Harborwatch', tier: 'town', settlement: { name: 'Harborwatch' } }]}
        worldState={{}}
        regionalGraph={{}}
        bridge={null}
        ownerId="user-1"
      />,
    );
    await waitFor(() => expect(screen.getByText('Public')).toBeTruthy());

    const bag = await saveAndCaptureBag();
    expect(bag).toHaveProperty('shareWorld');
    expect(bag).toHaveProperty('worldSections');
    expect(bag).toHaveProperty('worldSnapshot');
  });
});
