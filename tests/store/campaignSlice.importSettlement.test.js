/**
 * importGallerySettlement — clone a public, importable dossier into the
 * importer's own library as a fresh draft.
 *
 * The server RPC (048) is the real importable + auth gate and returns only the
 * sanitized projection; this exercises the CLIENT contract: auth + save-slot
 * pre-flight, the clone envelope (cross-settlement refs stripped, every seed
 * scrubbed so the unsanitized original can't be regenerated, provenance
 * stamped, fresh draft), and the save-limit error passthrough.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const saveMock = vi.fn(() => Promise.resolve('new-save-id'));
vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    save: (...a) => saveMock(...a),
    update: vi.fn(() => Promise.resolve()),
    delete: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

const fetchDossierForImport = vi.fn();
vi.mock('../../src/lib/gallery.js', () => ({
  fetchDossierForImport: (...a) => fetchDossierForImport(...a),
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { createCampaignSlice } from '../../src/store/campaignSlice.js';

function makeStore(extra = {}) {
  return create(immer((set, get, api) => ({
    auth: { user: { id: 'u1' }, tier: 'free', role: 'user' },
    savedSettlements: [],
    maxSaves: () => 50,
    ...createCampaignSlice(set, get, api),
    ...extra,
  })));
}

const DOSSIER = {
  id: 'src-id',
  name: 'Old Harbor',
  tier: 'town',
  settlement: {
    name: 'Old Harbor',
    tier: 'town',
    institutions: [{ id: 'i1', name: 'Dock' }],
    neighbourNetwork: [{ id: 'n1', name: 'Elsewhere' }],
    neighborRelationship: { name: 'Elsewhere' },
    interSettlementRelationships: [{ partnerSettlement: 'Elsewhere' }],
    _seed: 'embedded-seed',
    config: { _seed: 'config-seed', terrain: 'coastal' },
  },
};

beforeEach(() => {
  saveMock.mockReset();
  saveMock.mockResolvedValue('new-save-id');
  fetchDossierForImport.mockReset();
});

describe('campaignSlice — importGallerySettlement', () => {
  test('requires auth', async () => {
    const store = makeStore({ auth: { user: null } });
    await expect(store.getState().importGallerySettlement('slug')).rejects.toThrow(/sign in/i);
    expect(fetchDossierForImport).not.toHaveBeenCalled();
    expect(saveMock).not.toHaveBeenCalled();
  });

  test('clones a fresh draft: refs stripped, every seed scrubbed, provenance stamped', async () => {
    fetchDossierForImport.mockResolvedValue(DOSSIER);
    const store = makeStore();
    const id = await store.getState().importGallerySettlement('old-harbor');

    expect(id).toBe('new-save-id');
    expect(fetchDossierForImport).toHaveBeenCalledWith('old-harbor');

    const entry = saveMock.mock.calls[0][0];
    expect(entry.name).toBe('Old Harbor (imported)');
    expect(entry.tier).toBe('town');
    expect(entry.seed).toBeNull();
    expect(entry.config).toBeNull();
    expect(entry.campaignState).toEqual({ phase: 'draft', eventLog: [] });
    expect(entry.aiData).toEqual({});
    // Cross-settlement refs neutralized (no back-link wiring into the importer's saves).
    expect(entry.settlement.neighbourNetwork).toEqual([]);
    expect(entry.settlement.neighborRelationship).toBeNull();
    expect(entry.settlement.interSettlementRelationships).toEqual([]);
    // EVERY seed scrubbed — no regenerate-to-unsanitized path.
    expect(entry.settlement._seed).toBeUndefined();
    expect(entry.settlement.config._seed).toBeUndefined();
    expect(entry.settlement.config.terrain).toBe('coastal'); // non-seed config preserved
    // Provenance.
    expect(entry.settlement.importedFrom.slug).toBe('old-harbor');
    expect(entry.settlement.importedFrom.sourceName).toBe('Old Harbor');
    // Landed in the library.
    expect(store.getState().savedSettlements.map(s => s.id)).toContain('new-save-id');
  });

  test('import lands DORMANT — primaryDeityRef + snapshot stripped (Feature D / R1)', async () => {
    // A source dossier that had an assigned deity must arrive with NO embedded
    // deity, so religion is dormant on import and no foreign pantheon resurrects.
    fetchDossierForImport.mockResolvedValue({
      ...DOSSIER,
      settlement: {
        ...DOSSIER.settlement,
        config: {
          _seed: 'config-seed',
          terrain: 'coastal',
          primaryDeityRef: 'custom:lu_foreign',
          primaryDeitySnapshot: { _deityRef: 'custom:lu_foreign', name: 'Foreign God', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major' },
        },
      },
    });
    const store = makeStore();
    await store.getState().importGallerySettlement('old-harbor');

    const entry = saveMock.mock.calls[0][0];
    expect(entry.settlement.config.primaryDeityRef).toBeUndefined();
    expect(entry.settlement.config.primaryDeitySnapshot).toBeUndefined();
    // Non-deity, non-seed config still preserved.
    expect(entry.settlement.config.terrain).toBe('coastal');
    expect(entry.settlement.config._seed).toBeUndefined();
  });

  test('surfaces the save-limit trigger error verbatim and adds nothing', async () => {
    fetchDossierForImport.mockResolvedValue(DOSSIER);
    saveMock.mockRejectedValueOnce(new Error('save limit reached for your plan'));
    const store = makeStore();
    await expect(store.getState().importGallerySettlement('s')).rejects.toThrow(/save limit reached/i);
    expect(store.getState().savedSettlements).toHaveLength(0);
  });

  test('rejects when the dossier is not importable / not found', async () => {
    fetchDossierForImport.mockResolvedValue(null);
    const store = makeStore();
    await expect(store.getState().importGallerySettlement('s')).rejects.toThrow(/not available to import/i);
    expect(saveMock).not.toHaveBeenCalled();
  });

  test('pre-flights the save-slot cap before even fetching', async () => {
    const store = makeStore({ maxSaves: () => 1, savedSettlements: [{ id: 'a' }] });
    await expect(store.getState().importGallerySettlement('s')).rejects.toThrow(/library is full/i);
    expect(fetchDossierForImport).not.toHaveBeenCalled();
  });
});
