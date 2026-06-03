import { beforeEach, describe, expect, test } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createCustomContentSlice } from '../../src/store/customContentSlice.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

function makeStore(userId = null) {
  return create(immer((...a) => ({
    auth: { user: userId ? { id: userId } : null, tier: userId ? 'premium' : 'anon' },
    canUseCustomContent: () => false,
    ...createCustomContentSlice(...a),
  })));
}

describe('customContentSlice local cache scoping', () => {
  beforeEach(() => installLocalStorage());

  test('writes signed-in custom content to a user-scoped cache key', () => {
    const storeA = makeStore('user_a');
    const storeB = makeStore('user_b');

    storeA.getState().addCustomItem('institutions', { name: 'A Hall' });
    storeB.getState().addCustomItem('institutions', { name: 'B Hall' });

    expect(JSON.parse(localStorage.getItem('sf_custom_content:user_a')).institutions[0].name).toBe('A Hall');
    expect(JSON.parse(localStorage.getItem('sf_custom_content:user_b')).institutions[0].name).toBe('B Hall');
    expect(localStorage.getItem('sf_custom_content')).toBeNull();
  });

  test('clearCloudCustomContent returns to the anonymous cache only', () => {
    localStorage.setItem('sf_custom_content', JSON.stringify({ institutions: [{ id: 'anon', name: 'Anon Hall' }] }));
    localStorage.setItem('sf_custom_content:user_a', JSON.stringify({ institutions: [{ id: 'a', name: 'A Hall' }] }));
    const store = makeStore('user_a');

    store.getState().clearCloudCustomContent();

    expect(store.getState().customContent.institutions[0].name).toBe('Anon Hall');
  });
});
