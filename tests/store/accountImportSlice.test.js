/**
 * tests/store/accountImportSlice.test.js — the WRITE half of "Import my data".
 *
 * Exercises the CLIENT contract of importAccountData over the server-authoritative
 * add-save seam (mocked savesService.save mints fresh ids; the real 014 trigger
 * is the authoritative gate in production):
 *   • rejects a malformed / wrong-version file (fail-closed, no writes)
 *   • IGNORES an embedded foreign user_id — ownership is remapped (no owner field
 *     ever passed to save)
 *   • mints FRESH ids per record → additive, never clobbers an existing save
 *   • respects the save cap (partial-with-notice)
 *   • premium-gates campaign import
 *   • rolls back this batch's inserts on a mid-batch save failure
 *   • round-trip: a buildAccountExport snapshot imports back under the new user
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Fresh, monotonic server ids — proves no collision with existing saves and that
// the importer never reuses an embedded id.
let idSeq = 0;
const saveMock = vi.fn(() => Promise.resolve(`fresh-${++idSeq}`));
const deleteMock = vi.fn(() => Promise.resolve());
vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    save: (...a) => saveMock(...a),
    delete: (...a) => deleteMock(...a),
    update: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { createAccountImportSlice } from '../../src/store/accountImportSlice.js';
import { buildAccountExport, ACCOUNT_EXPORT_VERSION } from '../../src/lib/accountData.js';

/** Minimal store: import slice + the auth/library/campaign seams it reads. */
function makeStore(extra = {}) {
  return create(immer((set, get, api) => ({
    auth: { user: { id: 'IMPORTER-ID' }, tier: 'premium', role: 'user' },
    savedSettlements: [],
    campaigns: [],
    canSave: () => true,
    maxSaves: () => Infinity,
    // Stubbed createCampaign so the campaign path is exercisable in isolation.
    createCampaign: (name) => {
      const id = `camp-${++idSeq}`;
      set(state => { state.campaigns.unshift({ id, name, settlementIds: [] }); });
      return id;
    },
    ...createAccountImportSlice(set, get, api),
    ...extra,
  })));
}

const fileFor = (over = {}) => JSON.stringify({
  version: ACCOUNT_EXPORT_VERSION,
  exportedAt: 'now',
  profile: { displayName: 'Hostile Exporter', tier: 'premium' },
  settlements: [],
  campaigns: [],
  ...over,
});

const SETTLEMENT = (name = 'Old Harbor') => ({
  id: 'EMBEDDED-OLD-ID',
  user_id: 'SOMEONE-ELSES-USER-ID',
  name,
  tier: 'town',
  settlement: { name, tier: 'town' },
});

beforeEach(() => {
  idSeq = 0;
  saveMock.mockReset();
  saveMock.mockImplementation(() => Promise.resolve(`fresh-${++idSeq}`));
  deleteMock.mockReset();
  deleteMock.mockResolvedValue();
});

describe('importAccountData — gating + fail-closed', () => {
  test('blocks anon / no-save tiers outright', async () => {
    const store = makeStore({ auth: { user: null }, canSave: () => false });
    const res = await store.getState().importAccountData(fileFor({ settlements: [SETTLEMENT()] }));
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/sign in or upgrade/i);
    expect(saveMock).not.toHaveBeenCalled();
  });

  test('rejects a malformed file with no writes', async () => {
    const store = makeStore();
    const res = await store.getState().importAccountData('not json {');
    expect(res.ok).toBe(false);
    expect(saveMock).not.toHaveBeenCalled();
  });

  test('rejects a newer-version file with no writes', async () => {
    const store = makeStore();
    const res = await store.getState().importAccountData(fileFor({ version: ACCOUNT_EXPORT_VERSION + 1 }));
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/newer version/i);
    expect(saveMock).not.toHaveBeenCalled();
  });
});

describe('importAccountData — ownership + fresh ids', () => {
  test('ignores embedded foreign user_id / id; no owner field reaches save', async () => {
    const store = makeStore();
    await store.getState().importAccountData(fileFor({ settlements: [SETTLEMENT(), SETTLEMENT('Far Reach')] }));

    expect(saveMock).toHaveBeenCalledTimes(2);
    for (const [entry] of saveMock.mock.calls) {
      expect(entry).not.toHaveProperty('id');
      expect(entry).not.toHaveProperty('user_id');
      expect(JSON.stringify(entry)).not.toMatch(/SOMEONE-ELSES-USER-ID|EMBEDDED-OLD-ID/);
    }
  });

  test('mints fresh ids — additive, never clobbers an existing save', async () => {
    const store = makeStore({ savedSettlements: [{ id: 'pre-existing', name: 'Existing' }] });
    const res = await store.getState().importAccountData(fileFor({ settlements: [SETTLEMENT(), SETTLEMENT('Far Reach')] }));

    expect(res.ok).toBe(true);
    expect(res.settlementsImported).toBe(2);
    const ids = store.getState().savedSettlements.map(s => s.id);
    // Pre-existing save still present; new ones are distinct (no collision).
    expect(ids).toContain('pre-existing');
    expect(new Set(ids).size).toBe(ids.length);
    expect(store.getState().savedSettlements).toHaveLength(3);
  });
});

describe('importAccountData — tier / save-limit gate', () => {
  test('imports up to the remaining slots and skips the rest (partial-with-notice)', async () => {
    const store = makeStore({
      auth: { user: { id: 'IMPORTER-ID' }, tier: 'free', role: 'user' },
      savedSettlements: [{ id: 'a' }, { id: 'b' }], // 2 used of 3
      maxSaves: () => 3,
    });
    const res = await store.getState().importAccountData(fileFor({
      settlements: [SETTLEMENT('One'), SETTLEMENT('Two'), SETTLEMENT('Three')],
    }));

    expect(res.ok).toBe(true);
    expect(res.overLimit).toBe(true);
    expect(res.settlementsImported).toBe(1); // only 1 slot remained
    expect(res.settlementsSkipped).toHaveLength(2);
    expect(res.settlementsSkipped.every(s => /limit/i.test(s.reason))).toBe(true);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  test('surfaces a server cap error and rolls back this batch', async () => {
    const store = makeStore();
    // First insert succeeds; the second throws the server cap message.
    saveMock
      .mockResolvedValueOnce('fresh-1')
      .mockRejectedValueOnce(new Error('save limit reached for your plan'));
    const res = await store.getState().importAccountData(fileFor({
      settlements: [SETTLEMENT('One'), SETTLEMENT('Two')],
    }));

    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/save limit reached/i);
    // Rollback deleted the one that landed; nothing left in the library.
    expect(deleteMock).toHaveBeenCalledWith('fresh-1');
    expect(store.getState().savedSettlements).toHaveLength(0);
  });
});

describe('importAccountData — campaigns', () => {
  test('premium remaps settlementIds through oldId→newId', async () => {
    const store = makeStore();
    const res = await store.getState().importAccountData(fileFor({
      settlements: [{ ...SETTLEMENT('Member A'), id: 'old-a' }, { ...SETTLEMENT('Member B'), id: 'old-b' }],
      campaigns: [{ id: 'old-camp', name: 'My Realm', settlementIds: ['old-a', 'old-b', 'not-imported'] }],
    }));

    expect(res.ok).toBe(true);
    expect(res.campaignsImported).toBe(1);
    const camp = store.getState().campaigns[0];
    expect(camp.name).toMatch(/imported/i);
    // Remapped to the fresh ids; the un-imported member is dropped.
    expect(camp.settlementIds).toHaveLength(2);
    expect(camp.settlementIds.every(id => id.startsWith('fresh-'))).toBe(true);
  });

  test('non-premium skips campaigns with a notice', async () => {
    const store = makeStore({
      auth: { user: { id: 'IMPORTER-ID' }, tier: 'free', role: 'user' },
    });
    const res = await store.getState().importAccountData(fileFor({
      settlements: [SETTLEMENT()],
      campaigns: [{ id: 'c', name: 'Realm', settlementIds: [] }],
    }));

    expect(res.ok).toBe(true);
    expect(res.campaignsImported).toBe(0);
    expect(res.campaignsSkipped).toHaveLength(1);
    expect(res.campaignsSkipped[0].reason).toMatch(/premium/i);
  });
});

describe('importAccountData — export→import round-trip', () => {
  test('a buildAccountExport snapshot restores under the new user', async () => {
    // Author "user A"'s export, then import it as "user B".
    const exported = buildAccountExport({
      auth: { user: { id: 'USER-A', email: 'a@x.test' }, displayName: 'A', tier: 'premium' },
      savedSettlements: [
        { id: 'a-1', user_id: 'USER-A', name: 'Harbor', tier: 'town', settlement: { name: 'Harbor', tier: 'town' } },
        { id: 'a-2', user_id: 'USER-A', name: 'Ridge', tier: 'village', settlement: { name: 'Ridge', tier: 'village' } },
      ],
      campaigns: [{ id: 'a-camp', name: 'Saga', settlementIds: ['a-1', 'a-2'] }],
    });

    const store = makeStore(); // importer = "user B" (IMPORTER-ID)
    const res = await store.getState().importAccountData(JSON.stringify(exported));

    expect(res.ok).toBe(true);
    expect(res.settlementsImported).toBe(2);
    expect(res.campaignsImported).toBe(1);
    // Data restored, but under fresh ids owned by the importer — no USER-A leak.
    const names = store.getState().savedSettlements.map(s => s.name);
    expect(names).toEqual(expect.arrayContaining(['Harbor', 'Ridge']));
    expect(JSON.stringify(store.getState().savedSettlements)).not.toMatch(/USER-A|a-1|a-2/);
    const camp = store.getState().campaigns[0];
    expect(camp.settlementIds).toHaveLength(2);
    expect(camp.settlementIds.every(id => id.startsWith('fresh-'))).toBe(true);
  });
});
