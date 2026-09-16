/**
 * updateSavedSettlementAllowlist.test.js — Wave R-3 lane A (atlas VI.12 #163b).
 *
 * updateSavedSettlement was a bare Object.assign patch writer validating no
 * key. The cure freezes the CENSUS of its 21 real call sites as an explicit
 * allowlist (SAVED_SETTLEMENT_PATCH_KEYS): settlementSlice lifecycle folds x6
 * (settlement/campaignState/timestamp/aiData), aiSlice narrative writes x9
 * (aiData), ShareToGallery share metadata x6 (is_public/public_slug/
 * visibility/unlisted_slug/gallery_*). Unknown keys are a typed refusal plus a
 * dev-mode console error, and the whole patch is refused (all-or-nothing) so a
 * partial write can never slip through beside a rejected key.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { SAVED_SETTLEMENT_PATCH_KEYS } from '../../src/store/settlementSliceHelpers.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

// The census, spelled out — if a call site's key leaves the allowlist this
// fails loudly here, and a NEW call-site key must be added to BOTH deliberately.
const CENSUS_KEYS = [
  'settlement', 'campaignState', 'timestamp', 'aiData',
  'is_public', 'public_slug', 'visibility', 'unlisted_slug',
  'gallery_description', 'gallery_title', 'gallery_image_url', 'gallery_image_alt',
  'gallery_tags', 'gallery_share_dm', 'gallery_share_narrated', 'gallery_importable',
  'gallery_member_overrides',
];

describe('updateSavedSettlement allowlist (VI.12 #163b)', () => {
  let store;
  let errorSpy;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => {
      s.savedSettlements = [{ id: 'save-1', name: 'Keep', settlement: { name: 'Keep' } }];
    });
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => { errorSpy.mockRestore(); });

  test('the allowlist IS the census, exactly', () => {
    expect([...SAVED_SETTLEMENT_PATCH_KEYS].sort()).toEqual([...CENSUS_KEYS].sort());
  });

  test('every census key still patches (the 21 real call sites keep working)', () => {
    for (const key of CENSUS_KEYS) {
      const sentinel = `patched:${key}`;
      store.getState().updateSavedSettlement('save-1', { [key]: sentinel });
      expect(store.getState().savedSettlements[0][key], key).toBe(sentinel);
    }
    expect(errorSpy).not.toHaveBeenCalled();
  });

  test('the applyEvent-shaped lifecycle fold passes as one patch', () => {
    const partial = {
      settlement: { name: 'Keep', status: 'fine' },
      campaignState: { phase: 'canon', eventLog: [] },
      timestamp: '2026-07-27T12:00:00.000Z',
      aiData: { aiSettlement: { summary: 'prose' } },
    };
    store.getState().updateSavedSettlement('save-1', partial);
    expect(store.getState().savedSettlements[0]).toMatchObject(partial);
  });

  test('an unknown key is a typed refusal, a dev error, and no write', () => {
    const result = store.getState().updateSavedSettlement('save-1', { bogusField: 1 });
    expect(result.ok).toBe(false);
    expect(result.action).toBe('updateSavedSettlement');
    expect(result.before).toMatchObject({
      id: 'save-1', reason: 'unknown_patch_keys', unknownKeys: ['bogusField'],
    });
    expect(store.getState().savedSettlements[0].bogusField).toBeUndefined();
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  test('a mixed patch is refused whole — the known key must not land beside the rejected one', () => {
    const result = store.getState().updateSavedSettlement('save-1', {
      timestamp: 'should-not-land', mystery: true,
    });
    expect(result.ok).toBe(false);
    expect(result.before.unknownKeys).toEqual(['mystery']);
    expect(store.getState().savedSettlements[0].timestamp).toBeUndefined();
  });

  test('a JSON-shaped proto key is refused like any other unknown key', () => {
    const partial = JSON.parse('{"__proto__": {"polluted": true}}');
    const result = store.getState().updateSavedSettlement('save-1', partial);
    expect(result.ok).toBe(false);
    expect(result.before.unknownKeys).toEqual(['__proto__']);
    expect({}.polluted).toBeUndefined();
  });

  test('an empty or missing patch stays a silent no-op', () => {
    expect(store.getState().updateSavedSettlement('save-1', {})?.ok).not.toBe(false);
    expect(store.getState().updateSavedSettlement('save-1', undefined)?.ok).not.toBe(false);
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
