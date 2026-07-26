import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import {
  makeCampaignContentBinding,
} from '../../src/domain/content/contentEnvironment.js';
import { fingerprintContent } from '../../src/domain/content/contentFingerprint.js';
import { campaigns } from '../../src/lib/campaigns.js';

const originalNavigator = Object.getOwnPropertyDescriptor(
  globalThis,
  'navigator',
);

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

describe('campaign persistence service', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
    localStorage.removeItem('sf_campaigns:user_a');
    localStorage.removeItem('sf_campaigns:user_b');
  });

  afterEach(() => {
    if (originalNavigator) {
      Object.defineProperty(globalThis, 'navigator', originalNavigator);
    } else {
      delete globalThis.navigator;
    }
    vi.restoreAllMocks();
  });

  test('local cache path upserts, lists, and deletes campaigns', async () => {
    if (campaigns.isConfigured) return;
    await campaigns.upsert({ id: 'camp-local', name: 'Local Campaign', settlementIds: [] });
    expect(await campaigns.list()).toHaveLength(1);

    await campaigns.upsert({ id: 'camp-local', name: 'Renamed Campaign', settlementIds: ['a'] });
    expect(await campaigns.list()).toEqual([
      expect.objectContaining({ id: 'camp-local', name: 'Renamed Campaign', settlementIds: ['a'] }),
    ]);

    await campaigns.delete('camp-local');
    expect(await campaigns.list()).toEqual([]);
  });

  test('local campaign cache is scoped by owner id', () => {
    campaigns.cache([{ id: 'a', name: 'A' }], 'user_a');
    campaigns.cache([{ id: 'b', name: 'B' }], 'user_b');
    campaigns.cache([{ id: 'anon', name: 'Anon' }]);

    expect(campaigns.loadCached('user_a')).toEqual([expect.objectContaining({ id: 'a' })]);
    expect(campaigns.loadCached('user_b')).toEqual([expect.objectContaining({ id: 'b' })]);
    expect(campaigns.loadCached()).toEqual([expect.objectContaining({ id: 'anon' })]);
  });

  test('a reserved delete fails closed against a later whole-row upsert', async () => {
    if (campaigns.isConfigured) return;
    campaigns.reserveDelete('camp-delete-race');

    await expect(
      campaigns.upsert({ id: 'camp-delete-race', name: 'Stale Rewrite', settlementIds: [] }),
    ).rejects.toMatchObject({ code: 'campaign_delete_in_flight' });
    expect(await campaigns.list()).toEqual([]);

    campaigns.releaseDelete('camp-delete-race');
    await campaigns.upsert({ id: 'camp-delete-race', name: 'Retryable', settlementIds: [] });
    expect(await campaigns.list()).toEqual([
      expect.objectContaining({ id: 'camp-delete-race', name: 'Retryable' }),
    ]);
  });

  test('recordTombstone appends a per-owner, deduped deletion record', () => {
    campaigns.recordTombstone('camp-1', 'user_a');
    campaigns.recordTombstone('camp-2', 'user_a');
    campaigns.recordTombstone('camp-1', 'user_a'); // re-delete: keep one, freshest

    const tombs = campaigns.loadTombstones('user_a');
    expect(tombs.map(t => t.id).sort()).toEqual(['camp-1', 'camp-2']);
    expect(tombs.every(t => typeof t.deletedAt === 'string')).toBe(true);
  });

  test('tombstones are scoped by owner id and default to empty', () => {
    campaigns.recordTombstone('only-a', 'user_a');

    expect(campaigns.loadTombstones('user_a').map(t => t.id)).toEqual(['only-a']);
    expect(campaigns.loadTombstones('user_b')).toEqual([]);
    expect(campaigns.loadTombstones()).toEqual([]);
  });

  test('writeTombstones replaces the stored list', () => {
    campaigns.recordTombstone('camp-1', 'user_a');
    campaigns.writeTombstones([{ id: 'kept', deletedAt: '2024-01-01T00:00:00Z' }], 'user_a');
    expect(campaigns.loadTombstones('user_a').map(t => t.id)).toEqual(['kept']);
  });

  test('serializes local binding CAS across browser documents', async () => {
    if (campaigns.isConfigured) return;
    const request = vi.fn(async (_name, _options, criticalSection) => (
      criticalSection()
    ));
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { locks: { request } },
    });
    const current = makeCampaignContentBinding({}, {
      source: 'test',
      tunables: { magicExists: false },
    });
    const target = makeCampaignContentBinding({}, {
      source: 'test',
      tunables: { magicExists: true },
    });
    const campaign = {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      name: 'Content Realm',
      settlementIds: [],
      contentBinding: current,
      contentBindingHistory: [],
    };
    campaigns.cache([campaign], 'user_a');

    const receipt = await campaigns.compareAndSwapContentBinding({
      ...campaign,
      contentBinding: target,
      contentBindingHistory: [current, target],
    }, {
      expectedBindingHash: current.bindingHash,
      previewFingerprint: fingerprintContent({ review: 'local-cas-lock' }),
    }, 'user_a');

    expect(receipt).toMatchObject({
      ok: true,
      status: 'applied',
      bindingHash: target.bindingHash,
    });
    expect(request).toHaveBeenCalledWith(
      'settlementforge:campaign-cache:user_a',
      { mode: 'exclusive' },
      expect.any(Function),
    );
  });

  test('a stale cache projection cannot overwrite a newer binding', async () => {
    if (campaigns.isConfigured) return;
    const original = makeCampaignContentBinding({}, {
      source: 'test',
      tunables: { priorityEconomy: 20 },
    });
    const staleProjection = makeCampaignContentBinding({}, {
      source: 'test',
      tunables: { priorityEconomy: 40 },
    });
    const newer = makeCampaignContentBinding({}, {
      source: 'test',
      tunables: { priorityEconomy: 60 },
    });
    const id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
    campaigns.cache([{
      id,
      contentBinding: newer,
      contentBindingHistory: [original, newer],
      mapState: { marker: 'newer-tab' },
    }], 'user_a');

    await expect(campaigns.cacheContentBindingProjection({
      id,
      contentBinding: staleProjection,
      contentBindingHistory: [original, staleProjection],
      contentBindingStatus: 'pinned',
    }, [original.bindingHash], 'user_a')).resolves.toBe(false);

    expect(campaigns.loadCached('user_a')[0]).toMatchObject({
      contentBinding: { bindingHash: newer.bindingHash },
      mapState: { marker: 'newer-tab' },
    });
  });
});
