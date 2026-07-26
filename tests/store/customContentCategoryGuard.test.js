/**
 * tests/store/customContentCategoryGuard.test.js — B11-store finding #9.
 *
 * Unknown categories once created arbitrary buckets on demand. That behavior
 * made a typo an undeclared extension point. The canonical manifest now fails
 * such writes closed while keeping the caller-facing compatibility methods
 * total (no throw and no mutation).
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

describe('customContent mutators fail closed on an unknown category', () => {
  beforeEach(() => installLocalStorage());

  it('addCustomItem refuses the bucket without throwing or mutating state', async () => {
    const store = makeStore();
    // async since the de-eager lane — a rejection would fail this await, which
    // is the same no-throw pin the sync wrapper used to assert.
    const result = await store.getState().addCustomItem(
      'totallyNewBucket',
      { name: 'X' },
    );
    expect(result).toBeNull();
    expect(store.getState().customContent.totallyNewBucket).toBeUndefined();
    expect(store.getState().customContentError).toMatch(/unregistered_bucket/);
  });

  it('updateCustomItem on an unknown category is a safe no-op', async () => {
    const store = makeStore();
    const result = await store.getState().updateCustomItem(
      'phantomBucket',
      'id-1',
      { name: 'Y' },
    );
    expect(result).toBeNull();
    expect(store.getState().customContent.phantomBucket).toBeUndefined();
  });

  it('deleteCustomItem on an unknown category returns a failed receipt', async () => {
    const store = makeStore();
    const receipt = await store.getState().deleteCustomItem(
      'ghostBucket',
      'id-1',
    );
    expect(receipt).toMatchObject({ ok: false });
    expect(store.getState().customContent.ghostBucket).toBeUndefined();
  });

  it('known buckets are unaffected (regression guard)', async () => {
    const store = makeStore();
    await store.getState().addCustomItem('institutions', { name: 'Grand Hall' });
    expect(store.getState().customContent.institutions[0].name).toBe('Grand Hall');
  });
});
