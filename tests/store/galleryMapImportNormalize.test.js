/**
 * galleryMapImportNormalize.test.js — SB1 store-lifecycle.
 *
 * importGalleryMapWithCampaign clones each shared member into the importer's
 * library. It used to build the member settlement RAW ({ ...src, … }) with NO
 * normalizeSettlement — unlike the standalone gallery-settlement import
 * (galleryImportSettlement.js) and the account import, which BOTH normalize to
 * migrate legacy shapes forward. So a legacy-shape member arrived un-canonicalized
 * and downstream dossier / deriveSystemState could read `undefined` for fields the
 * migration chain would have backfilled. This pins that the member clone is now
 * routed through normalizeSettlement, at parity with the other import paths.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    save: vi.fn(() => Promise.resolve('new-save-id')),
    update: vi.fn(() => Promise.resolve()),
    delete: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

vi.mock('../../src/lib/campaigns.js', () => ({
  campaigns: {
    loadCached: vi.fn(() => []),
    list: vi.fn(() => Promise.resolve([])),
    cache: vi.fn(),
    isConfigured: false,
  },
  isCampaignActive: () => true,
}));

const fetchGalleryMap = vi.fn();
vi.mock('../../src/lib/gallery.js', () => ({
  fetchGalleryMap: (...a) => fetchGalleryMap(...a),
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { saves as savesService } from '../../src/lib/saves.js';

function makeStore() {
  return create(immer((set, get, api) => ({
    auth: { user: { id: 'u1' }, tier: 'premium', role: 'user' },
    savedSettlements: [],
    maxSaves: () => Infinity,
    ...createCampaignSlice(set, get, api),
  })));
}

beforeEach(() => {
  vi.clearAllMocks();
  fetchGalleryMap.mockReset();
  savesService.save.mockResolvedValue('new-save-id');
  savesService.update.mockResolvedValue();
});
afterEach(() => { delete global.fetch; });

describe('importGalleryMapWithCampaign normalizes each member clone (SB1)', () => {
  test('a legacy-shape member (stress alias, no schemaVersion) arrives normalized', async () => {
    fetchGalleryMap.mockResolvedValue({
      kind: 'map_with_campaign',
      name: 'Legacy Realm',
      members: [{
        old_id: 'm1',
        name: 'Old Town',
        tier: 'town',
        // A pre-migration shape: the legacy `stress` alias (normalizeSettlement
        // unifies it to `stressors`) and NO schemaVersion (normalizeSettlement
        // stamps one). Both are the migration-chain's job — the raw clone skipped it.
        settlement: { name: 'Old Town', tier: 'town', stress: [{ type: 'famine', label: 'Famine', severity: 0.4 }] },
      }],
      mapState: { placements: {} },
    });

    const store = makeStore();
    const id = await store.getState().importGalleryMapWithCampaign('legacy');
    expect(id).toBeTruthy();

    const saved = store.getState().savedSettlements.find(s => s.id === 'new-save-id');
    expect(saved).toBeTruthy();
    // normalizeSettlement ran: schemaVersion is stamped and the legacy `stress`
    // alias is unified into the canonical `stressors` field.
    expect(saved.settlement.schemaVersion).toBeDefined();
    expect(Array.isArray(saved.settlement.stressors)).toBe(true);
    expect(saved.settlement.stressors.map(s => s.type)).toContain('famine');
    // The cross-settlement refs are still stripped (the clone contract is intact).
    expect(saved.settlement.neighbourNetwork).toEqual([]);
  });

  test('a member config carrying a foreign pantheon arrives DORMANT (cycle-3 scrub)', async () => {
    fetchGalleryMap.mockResolvedValue({
      kind: 'map_with_campaign',
      name: 'Contested Realm',
      members: [{
        old_id: 'm1',
        name: 'Zealot Town',
        tier: 'town',
        settlement: {
          name: 'Zealot Town',
          tier: 'town',
          // The author's activated religion embeds — the exact keys the
          // single-writer scrub drops. Without the scrub these live-activate the
          // IMPORTER's premium religion subsystem with a foreign pantheon.
          config: {
            settlementType: 'town',
            primaryDeityRef: 'deity:acct:war-god',
            primaryDeitySnapshot: { name: 'The War God', evil01: 0.9, chaos01: 0.8 },
            cultDeitySnapshots: [{ name: 'The Hidden Flame' }],
            faithProfile: { piety: 0.7 },
            _seed: 424242,
          },
        },
      }],
      mapState: { placements: {} },
    });

    const store = makeStore();
    await store.getState().importGalleryMapWithCampaign('contested');
    const saved = store.getState().savedSettlements.find(s => s.id === 'new-save-id');
    expect(saved).toBeTruthy();
    // Every faith/deity embed is gone; the config is dormant.
    expect(saved.config).toBeTruthy();
    expect(saved.config.settlementType).toBe('town');
    expect(saved.config.primaryDeityRef).toBeUndefined();
    expect(saved.config.primaryDeitySnapshot).toBeUndefined();
    expect(saved.config.cultDeitySnapshots).toBeUndefined();
    expect(saved.config.faithProfile).toBeUndefined();
    expect(saved.config._seed).toBeUndefined();
  });

  test('remaps parentRef only when both shared campaign members land', async () => {
    savesService.save
      .mockResolvedValueOnce('new-parent-id')
      .mockResolvedValueOnce('new-child-id');
    const sourceRef = {
      version: 1,
      parentId: 'old-parent-id',
      sourceSatelliteId: 'satellite-gallery',
      foundedTick: 30,
      graduatedTick: 48,
      birthId: 'birth-gallery',
      futureEvidence: { seal: 'blue' },
    };
    fetchGalleryMap.mockResolvedValue({
      kind: 'map_with_campaign',
      name: 'Lineage Realm',
      members: [
        {
          old_id: 'old-parent-id',
          name: 'Parent',
          tier: 'town',
          settlement: { name: 'Parent', tier: 'town' },
        },
        {
          old_id: 'old-child-id',
          name: 'Child',
          tier: 'village',
          settlement: { name: 'Child', tier: 'village', parentRef: sourceRef },
        },
      ],
      mapState: { placements: {} },
    });

    const store = makeStore();
    const campaignId = await store.getState().importGalleryMapWithCampaign('lineage');
    const child = store.getState().savedSettlements.find(s => s.id === 'new-child-id');

    expect(child.settlement.parentRef).toEqual({ ...sourceRef, parentId: 'new-parent-id' });
    expect(savesService.update).toHaveBeenCalledWith(
      'new-child-id',
      { settlement: expect.objectContaining({ parentRef: { ...sourceRef, parentId: 'new-parent-id' } }) },
      expect.objectContaining({ expectedOwnerId: 'u1' }),
    );
    const campaign = store.getState().campaigns.find(c => c.id === campaignId);
    expect(campaign.regionalGraph?.edges || []).toEqual([]);
  });

  test('keeps parentRef as history when the shared parent is absent', async () => {
    const sourceRef = {
      version: 1,
      parentId: 'outside-this-share',
      sourceSatelliteId: 'satellite-gallery-orphan',
      foundedTick: 3,
      graduatedTick: 5,
      birthId: 'birth-gallery-orphan',
    };
    fetchGalleryMap.mockResolvedValue({
      kind: 'map_with_campaign',
      name: 'Historical Realm',
      members: [{
        old_id: 'old-child-id',
        name: 'Child',
        tier: 'village',
        settlement: { name: 'Child', tier: 'village', parentRef: sourceRef },
      }],
      mapState: { placements: {} },
    });

    const store = makeStore();
    await store.getState().importGalleryMapWithCampaign('historical-lineage');
    const child = store.getState().savedSettlements.find(s => s.id === 'new-save-id');

    expect(child.settlement.parentRef).toEqual(sourceRef);
    expect(savesService.update).not.toHaveBeenCalled();
  });
});
