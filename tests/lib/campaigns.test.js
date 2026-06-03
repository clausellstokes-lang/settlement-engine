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
});
