/**
 * updateSavedCampaignPatchValidation.test.js — Wave R-3 shapeless-patch
 * validation (atlas VI.12 #163b, lane B).
 *
 * updateSavedCampaign now validates patch keys against
 * SAVED_CAMPAIGN_PATCH_KEYS — the CLOSED surface from the R-3 caller census
 * (AutonomyPanel standing instructions + MapShareEditor gallery cache stamps).
 * These pins prove:
 *   1. every censused caller patch shape applies, persists, and bumps
 *      updatedAt;
 *   2. ANY unknown key refuses the WHOLE patch (atomic) — structural row
 *      fields (id, settlementIds, worldState, chronicles, ...) can no longer
 *      be clobbered through this door, and a refused patch changes nothing;
 *   3. missing/destroyed campaigns and non-object patches return typed
 *      results without writing;
 *   4. the allowlist itself matches the census exactly — growing it is a
 *      deliberate, reviewed edit.
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

beforeAll(() => {
  if (typeof globalThis.localStorage === 'undefined') {
    const data = new Map();
    globalThis.localStorage = {
      getItem: (k) => data.get(String(k)) ?? null,
      setItem: (k, v) => { data.set(String(k), String(v)); },
      removeItem: (k) => { data.delete(String(k)); },
      clear: () => data.clear(),
    };
  }
});

const { createCampaignSlice, SAVED_CAMPAIGN_PATCH_KEYS } = await import(
  '../../src/store/campaignSlice.js'
);

const CAMPAIGN_ID = '33333333-3333-4333-8333-333333333333';
const STAMP = '2026-01-01T00:00:00.000Z';

function makeStore() {
  const store = create(immer((set, get) => ({
    auth: { user: null, tier: 'premium', loading: false },
    savedSettlements: [],
    ...createCampaignSlice(set, get),
  })));
  store.setState(state => {
    state.campaigns = [
      {
        id: CAMPAIGN_ID,
        name: 'Realm',
        accessState: 'active',
        settlementIds: [],
        updatedAt: STAMP,
      },
      {
        id: '44444444-4444-4444-8444-444444444444',
        name: 'Fallen Realm',
        accessState: 'destroyed',
        settlementIds: [],
        updatedAt: STAMP,
      },
    ];
  });
  return store;
}

let store;
let errorSpy;
beforeEach(() => {
  store = makeStore();
  // vi.spyOn returns the SAME spy when console.error is already wrapped, so
  // call history would otherwise accumulate across tests.
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  errorSpy.mockClear();
});

const row = () => store.getState().campaigns.find(c => c.id === CAMPAIGN_ID);

describe('R-3 — every censused caller patch shape applies', () => {
  it('AutonomyPanel: writes the versioned standing-instructions record', () => {
    const record = { text: 'Favor the coastal factions.', version: 1, updatedAt: STAMP };
    const result = store.getState().updateSavedCampaign(CAMPAIGN_ID, {
      surveyorInstructions: record,
    });
    expect(result).toEqual({ ok: true, campaignId: CAMPAIGN_ID });
    expect(row().surveyorInstructions).toEqual(record);
    expect(row().updatedAt).not.toBe(STAMP);
  });

  it('AutonomyPanel: clears instructions with an undefined-valued key (JSON persist drops it)', () => {
    store.getState().updateSavedCampaign(CAMPAIGN_ID, {
      surveyorInstructions: { text: 'x', version: 1, updatedAt: STAMP },
    });
    const result = store.getState().updateSavedCampaign(CAMPAIGN_ID, {
      surveyorInstructions: undefined,
    });
    expect(result).toEqual({ ok: true, campaignId: CAMPAIGN_ID });
    // The persist path is a JSON clone; an undefined value leaves no key.
    const persisted = JSON.parse(JSON.stringify(row()));
    expect('surveyorInstructions' in persisted).toBe(false);
  });

  it('MapShareEditor publish: kind + description + tags + public stamps', () => {
    const result = store.getState().updateSavedCampaign(CAMPAIGN_ID, {
      shareKind: 'map_with_campaign',
      galleryDescription: 'A living realm.',
      galleryTags: ['coastal', 'war'],
      isPublic: true,
      publicSlug: 'living-realm',
    });
    expect(result).toEqual({ ok: true, campaignId: CAMPAIGN_ID });
    expect(row().shareKind).toBe('map_with_campaign');
    expect(row().galleryTags).toEqual(['coastal', 'war']);
    expect(row().publicSlug).toBe('living-realm');
  });

  it('MapShareEditor save-details: description + tags only (preserve-on-omit shape)', () => {
    const result = store.getState().updateSavedCampaign(CAMPAIGN_ID, {
      galleryDescription: 'Updated.',
      galleryTags: [],
    });
    expect(result).toEqual({ ok: true, campaignId: CAMPAIGN_ID });
    expect(row().galleryDescription).toBe('Updated.');
  });

  it('MapShareEditor unshare: isPublic false', () => {
    const result = store.getState().updateSavedCampaign(CAMPAIGN_ID, { isPublic: false });
    expect(result).toEqual({ ok: true, campaignId: CAMPAIGN_ID });
    expect(row().isPublic).toBe(false);
  });
});

describe('R-3 — unknown keys refuse the whole patch (atomic)', () => {
  it('a mixed patch with one unknown key applies NOTHING', () => {
    const before = JSON.parse(JSON.stringify(row()));
    const result = store.getState().updateSavedCampaign(CAMPAIGN_ID, {
      isPublic: true,
      worldState: { hacked: true },
    });
    expect(result).toEqual({
      ok: false,
      reason: 'unknown_campaign_patch_keys',
      unknownKeys: ['worldState'],
      campaignId: CAMPAIGN_ID,
    });
    expect(JSON.parse(JSON.stringify(row()))).toEqual(before);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('structural row fields are refused by name', () => {
    for (const patch of [
      { id: 'evil' },
      { settlementIds: [] },
      { chronicles: [] },
      { wizardNews: null },
      { contentBinding: {} },
      { updatedAt: STAMP },
    ]) {
      const result = store.getState().updateSavedCampaign(CAMPAIGN_ID, patch);
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('unknown_campaign_patch_keys');
    }
    expect(row().id).toBe(CAMPAIGN_ID);
    expect(row().updatedAt).toBe(STAMP);
  });
});

describe('R-3 — typed no-ops for bad targets and bad patches', () => {
  it('missing campaign id returns campaign_not_found', () => {
    const result = store.getState().updateSavedCampaign('nope', { isPublic: true });
    expect(result).toEqual({ ok: false, reason: 'campaign_not_found', campaignId: 'nope' });
  });

  it('a destroyed campaign is not patchable (active-only contract holds)', () => {
    const destroyedId = '44444444-4444-4444-8444-444444444444';
    const result = store.getState().updateSavedCampaign(destroyedId, { isPublic: true });
    expect(result).toEqual({
      ok: false,
      reason: 'campaign_not_found',
      campaignId: destroyedId,
    });
    const destroyed = store.getState().campaigns.find(c => c.id === destroyedId);
    expect(destroyed.isPublic).toBeUndefined();
    expect(destroyed.updatedAt).toBe(STAMP);
  });

  it('non-object patches are refused typed', () => {
    for (const bad of [null, undefined, 'isPublic', 7, [{ isPublic: true }]]) {
      expect(store.getState().updateSavedCampaign(CAMPAIGN_ID, bad)).toEqual({
        ok: false,
        reason: 'invalid_campaign_patch',
        campaignId: CAMPAIGN_ID,
      });
    }
    expect(row().updatedAt).toBe(STAMP);
  });
});

describe('R-3 — the allowlist matches the caller census exactly', () => {
  it('holds exactly the six censused keys', () => {
    expect([...SAVED_CAMPAIGN_PATCH_KEYS].sort()).toEqual([
      'galleryDescription',
      'galleryTags',
      'isPublic',
      'publicSlug',
      'shareKind',
      'surveyorInstructions',
    ]);
  });
});
