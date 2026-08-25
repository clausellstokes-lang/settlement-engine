import { beforeEach, describe, expect, test } from 'vitest';

import { campaigns } from '../../src/lib/campaigns.js';

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
});
