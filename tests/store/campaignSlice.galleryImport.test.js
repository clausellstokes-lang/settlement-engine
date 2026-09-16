/**
 * tests/store/campaignSlice.galleryImport.test.js — W4c import premium gate.
 *
 * importGallerySettlement clones a public, owner-opted-in dossier into the
 * caller's library. It is PREMIUM-GATED client-side (a clean message + no wasted
 * round-trip; the import_gallery_dossier RPC is the server-authoritative gate).
 * This pins the client gate: anon and free tiers are refused BEFORE any fetch,
 * and premium is allowed through to the (mocked) fetch + save path.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// The import save path goes through savesService.save; stub it so a premium
// import resolves without a real backend. The gallery fetch is mocked per-test.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { save: vi.fn(() => Promise.resolve('new-save-id')), isConfigured: false },
}));
vi.mock('../../src/lib/gallery.js', () => ({
  fetchDossierForImport: vi.fn(),
}));

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { fetchDossierForImport } from '../../src/lib/gallery.js';
import { isSubsystemActive } from '../../src/domain/worldPulse/subsystemActivation.js';
import {
  LIVING_CONTENT_LAW_CONFIG_KEY,
  materializesLivingContent,
} from '../../src/domain/content/livingContentLawVersion.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

function makeStore(auth) {
  return create(immer((...a) => ({
    savedSettlements: [],
    auth,
    // premium tier => unlimited slots; free => a finite cap so the pre-flight
    // isn't what refuses (the tier gate must fire first).
    maxSaves: () => (auth?.tier === 'premium' ? Infinity : 3),
    ...createCampaignSlice(...a),
  })));
}

describe('importGallerySettlement — premium gate', () => {
  beforeEach(() => {
    installLocalStorage();
    vi.clearAllMocks();
  });

  test('refuses an anonymous caller (sign-in gate) before fetching', async () => {
    const store = makeStore({ user: null });
    await expect(store.getState().importGallerySettlement('slug')).rejects.toThrow(/sign in/i);
    expect(fetchDossierForImport).not.toHaveBeenCalled();
  });

  test('refuses a free-tier caller (premium gate) before fetching', async () => {
    const store = makeStore({ user: { id: 'u1' }, tier: 'free' });
    await expect(store.getState().importGallerySettlement('slug')).rejects.toThrow(/premium/i);
    expect(fetchDossierForImport).not.toHaveBeenCalled();
  });

  test('allows a premium caller through to the import fetch + save + push', async () => {
    fetchDossierForImport.mockResolvedValueOnce({
      id: 'src', name: 'Riverwatch', tier: 'town',
      settlement: { name: 'Riverwatch', tier: 'town', config: { culture: 'norse' } },
    });
    const store = makeStore({ user: { id: 'u1' }, tier: 'premium' });
    const newId = await store.getState().importGallerySettlement('slug-abc');
    expect(fetchDossierForImport).toHaveBeenCalledWith('slug-abc');
    expect(newId).toBe('new-save-id');
    const saves = store.getState().savedSettlements;
    expect(saves).toHaveLength(1);
    expect(saves[0].name).toMatch(/imported/i);
    // Provenance stamped; the imported clone arrives as a fresh draft.
    expect(saves[0].settlement.importedFrom.slug).toBe('slug-abc');
    expect(saves[0].campaignState.phase).toBe('draft');
  });

  test('strips cultDeitySnapshots + every deity/faith embed so the import arrives DORMANT (store-4)', async () => {
    fetchDossierForImport.mockResolvedValueOnce({
      id: 'src', name: 'Culthaven', tier: 'town',
      settlement: {
        name: 'Culthaven', tier: 'town',
        config: {
          culture: 'norse',
          // A source with DM-imposed cults + an active patron + its faith projection.
          cultDeitySnapshots: [{ name: 'Foreign Cult', deityRef: 'deity:acct-9:x' }],
          primaryDeitySnapshot: { name: 'Foreign Patron' },
          primaryDeityRef: 'deity:acct-9:sol',
          faithProfile: { piety: 0.9 },
        },
      },
    });
    const store = makeStore({ user: { id: 'u1' }, tier: 'premium' });
    await store.getState().importGallerySettlement('slug-cult');

    const imported = store.getState().savedSettlements[0].settlement;
    const cfg = imported.config || {};
    // Every deity/faith embed is gone (previously cultDeitySnapshots survived here —
    // the religion subsystem activated with a foreign pantheon the importer never authored).
    expect(cfg.cultDeitySnapshots).toBeUndefined();
    expect(cfg.primaryDeitySnapshot).toBeUndefined();
    expect(cfg.primaryDeityRef).toBeUndefined();
    expect(cfg.faithProfile).toBeUndefined();
    // The religion subsystem gate stays CLOSED for the imported settlement.
    expect(isSubsystemActive({ settlements: [{ settlement: imported }] }, 'religion')).toBe(false);
  });

  test('⛔ DEF-1: a foreign scope record never lands in the importer\'s library', async () => {
    // The mirror of the account-import boundary, at the one import path the
    // living-content work had never enumerated. A gallery dossier is another
    // account's world: its roster and provenance receipt are keyed on the SOURCE
    // account's ledger, this boundary has no archive to resolve them against, and
    // the public projection already dropped the roster — so keeping the law marker
    // would import a world claiming a scope record it does not have.
    fetchDossierForImport.mockResolvedValueOnce({
      id: 'src', name: 'Borrowed', tier: 'town',
      settlement: {
        name: 'Borrowed', tier: 'town',
        config: { culture: 'norse', [LIVING_CONTENT_LAW_CONFIG_KEY]: 2 },
        customContentRoster: {
          schemaVersion: 1,
          buckets: { deities: [{ localUid: 'src-lu-1', customDefinitionId: 'src-secret-def' }] },
        },
        customContentProvenance: {
          schemaVersion: 1,
          materializedDefinitions: [{ definitionId: 'src-secret-def', revisionId: 'src-rev-1' }],
        },
      },
    });
    const store = makeStore({ user: { id: 'u1' }, tier: 'premium' });
    await store.getState().importGallerySettlement('slug-borrowed');

    const imported = store.getState().savedSettlements[0].settlement;
    // Liveness: the clone really is the source world, so a green here cannot mean
    // "nothing was imported at all".
    expect(imported.name).toBe('Borrowed');
    expect(imported.config.culture).toBe('norse');

    expectAbsentWithAnchor(Object.keys(imported), 'customContentRoster', 'name', 'gallery ingest');
    expectAbsentWithAnchor(Object.keys(imported), 'customContentProvenance', 'tier', 'gallery ingest');
    expectAbsentWithAnchor(
      Object.keys(imported.config), LIVING_CONTENT_LAW_CONFIG_KEY, 'culture', 'gallery ingest config',
    );
    // The imported world reads as v1 — it says what it is.
    expect(materializesLivingContent(imported.config)).toBe(false);
    // …and the row the save service was handed carries none of it either (the
    // in-memory push and the persisted envelope are the same object here).
    expectAbsentWithAnchor(
      JSON.stringify(store.getState().savedSettlements[0]),
      'src-secret-def',
      'Borrowed',
      'gallery ingest persisted row',
    );
  });

  test('a developer role passes the gate for testing', async () => {
    fetchDossierForImport.mockResolvedValueOnce({
      id: 'src', name: 'Riverwatch', tier: 'town', settlement: { name: 'Riverwatch' },
    });
    const store = makeStore({ user: { id: 'u1' }, role: 'developer' });
    await expect(store.getState().importGallerySettlement('slug')).resolves.toBe('new-save-id');
  });
});
