/**
 * tests/store/customContentCategoryGuard.test.js — B11-store finding #9.
 *
 * addCustomItem / updateCustomItem / deleteCustomItem assumed the category
 * bucket already existed. A category not present in EMPTY (a typo, a UI bucket
 * added before EMPTY, or a cloud row with an unexpected category) made
 * state.customContent[category] undefined, so .unshift/.findIndex/.filter threw
 * INSIDE the Immer producer and aborted the action with an uncaught error.
 *
 * The fix lazily initialises the bucket. These tests pin that no throw occurs
 * and the item lands.
 */
import { describe, it, expect, beforeEach } from 'vitest';
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

function makeStore() {
  return create(immer((...a) => ({
    auth: { user: null, tier: 'anon' },
    canUseCustomContent: () => false,
    ...createCustomContentSlice(...a),
  })));
}

describe('customContent mutators guard an unknown category (finding #9)', () => {
  beforeEach(() => installLocalStorage());

  it('addCustomItem creates the bucket instead of throwing', () => {
    const store = makeStore();
    expect(() => store.getState().addCustomItem('totallyNewBucket', { name: 'X' }))
      .not.toThrow();
    expect(store.getState().customContent.totallyNewBucket).toHaveLength(1);
    expect(store.getState().customContent.totallyNewBucket[0].name).toBe('X');
  });

  it('updateCustomItem on an unknown category is a safe no-op', () => {
    const store = makeStore();
    expect(() => store.getState().updateCustomItem('phantomBucket', 'id-1', { name: 'Y' }))
      .not.toThrow();
    expect(store.getState().customContent.phantomBucket).toEqual([]);
  });

  it('deleteCustomItem on an unknown category is a safe no-op', () => {
    const store = makeStore();
    expect(() => store.getState().deleteCustomItem('ghostBucket', 'id-1'))
      .not.toThrow();
    expect(store.getState().customContent.ghostBucket).toEqual([]);
  });

  it('known buckets are unaffected (regression guard)', () => {
    const store = makeStore();
    store.getState().addCustomItem('institutions', { name: 'Grand Hall' });
    expect(store.getState().customContent.institutions[0].name).toBe('Grand Hall');
  });
});
