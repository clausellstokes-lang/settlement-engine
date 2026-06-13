/**
 * tests/store/customContentSlice.race.test.js
 *
 * The optimistic-local-id vs cloud-uuid race. add() round-trips to mint the
 * real id; an update/delete issued before it resolves must target the cloud id,
 * not the throwaway local id (which would no-op and resurrect the item on the
 * next cloud load). customContentService is mocked so add() can be held open.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const h = vi.hoisted(() => {
  const cloud = new Map();   // cloudId -> body (the cloud table)
  let queue = [];            // pending add() resolvers
  let counter = 0;
  const service = {
    isConfigured: true,
    add: (category, entry) => new Promise(resolve => {
      queue.push(() => {
        const id = `cloud_${++counter}`;
        cloud.set(id, { ...entry, id });
        resolve({ ...entry, id });
      });
    }),
    update: (id, body) => {
      if (cloud.has(id)) cloud.set(id, { ...body, id });
      return Promise.resolve({ id, updatedAt: '2026-01-01T00:00:00Z' });
    },
    delete: (id) => { cloud.delete(id); return Promise.resolve(); },
  };
  return {
    service, cloud,
    flushAdds() { const q = queue; queue = []; q.forEach(fn => fn()); },
    reset() { cloud.clear(); queue = []; counter = 0; },
  };
});

vi.mock('../../src/lib/customContent.js', () => ({ customContentService: h.service }));

const { createCustomContentSlice } = await import('../../src/store/customContentSlice.js');

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

const flush = async () => { await new Promise(r => setTimeout(r, 0)); await new Promise(r => setTimeout(r, 0)); };

function makeStore() {
  return create(immer((...a) => ({
    auth: { user: { id: 'user_a' }, tier: 'premium' },
    canUseCustomContent: () => true,
    ...createCustomContentSlice(...a),
  })));
}

describe('customContentSlice add/update/delete cloud-id race', () => {
  beforeEach(() => {
    installLocalStorage();
    h.reset();
  });

  test('delete issued before add() resolves removes the freshly-added cloud row', async () => {
    const store = makeStore();
    store.getState().addCustomItem('institutions', { name: 'Doomed Hall' });
    const localId = store.getState().customContent.institutions[0].id;

    // Delete while add() is still in flight — old bug deleted the local id (a
    // no-op against the cloud) and the row resurrected.
    store.getState().deleteCustomItem('institutions', localId);
    expect(store.getState().customContent.institutions).toHaveLength(0);

    h.flushAdds();      // add() resolves -> cloud insert happens now
    await flush();      // chained delete on the real cloud id runs

    expect(h.cloud.size).toBe(0);   // no resurrection
  });

  test('update issued before add() resolves reaches the cloud and survives the id swap', async () => {
    const store = makeStore();
    store.getState().addCustomItem('institutions', { name: 'Original' });
    const localId = store.getState().customContent.institutions[0].id;

    store.getState().updateCustomItem('institutions', localId, { name: 'Edited' });
    expect(store.getState().customContent.institutions[0].name).toBe('Edited');

    h.flushAdds();
    await flush();

    const item = store.getState().customContent.institutions[0];
    expect(item.id.startsWith('cloud_')).toBe(true);   // adopted the cloud id
    expect(item.name).toBe('Edited');                  // local edit preserved through the swap
    expect([...h.cloud.values()][0].name).toBe('Edited'); // and pushed to the cloud
  });

  test('delete after add() resolves targets the cloud id directly', async () => {
    const store = makeStore();
    store.getState().addCustomItem('institutions', { name: 'Hall' });
    h.flushAdds();
    await flush();

    const cloudId = store.getState().customContent.institutions[0].id;
    expect(cloudId.startsWith('cloud_')).toBe(true);
    expect(h.cloud.size).toBe(1);

    store.getState().deleteCustomItem('institutions', cloudId);
    await flush();

    expect(store.getState().customContent.institutions).toHaveLength(0);
    expect(h.cloud.size).toBe(0);
  });
});
