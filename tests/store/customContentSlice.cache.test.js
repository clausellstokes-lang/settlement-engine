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

describe('customContentSlice offline owner mirror scoping', () => {
  beforeEach(() => installLocalStorage());

  test('mirrors only confirmed revisions into each signed-in owner scope', async () => {
    const storeA = makeStore('user_a');
    const storeB = makeStore('user_b');

    const itemA = await storeA.getState().addCustomItem(
      'institutions',
      { name: 'A Hall' },
    );
    const itemB = await storeB.getState().addCustomItem(
      'institutions',
      { name: 'B Hall' },
    );

    expect(
      storeA.getState().customContentLastCommandReceipt.persistence.state,
    ).toBe('confirmed');
    expect(
      storeB.getState().customContentLastCommandReceipt.persistence.state,
    ).toBe('confirmed');
    expect(
      JSON.parse(localStorage.getItem('sf_custom_content:user_a'))
        .institutions[0],
    ).toMatchObject({
      name: 'A Hall',
      definitionId: itemA.definitionId,
      revisionId: itemA.revisionId,
    });
    expect(
      JSON.parse(localStorage.getItem('sf_custom_content:user_b'))
        .institutions[0],
    ).toMatchObject({
      name: 'B Hall',
      definitionId: itemB.definitionId,
      revisionId: itemB.revisionId,
    });
    expect(
      JSON.parse(
        localStorage.getItem('sf_custom_content_revision_ledger_v1:user_a'),
      ).definitions[itemA.definitionId].headRevisionId,
    ).toBe(itemA.revisionId);
    expect(
      JSON.parse(
        localStorage.getItem('sf_custom_content_revision_ledger_v1:user_b'),
      ).definitions[itemB.definitionId].headRevisionId,
    ).toBe(itemB.revisionId);
    expect(localStorage.getItem('sf_custom_content')).toBeNull();
  });

  test('clearCloudCustomContent returns to the anonymous mirror only', () => {
    localStorage.setItem('sf_custom_content', JSON.stringify({ institutions: [{ id: 'anon', name: 'Anon Hall' }] }));
    localStorage.setItem('sf_custom_content:user_a', JSON.stringify({ institutions: [{ id: 'a', name: 'A Hall' }] }));
    const store = makeStore('user_a');

    store.getState().clearCloudCustomContent();

    expect(store.getState().customContent.institutions[0].name).toBe('Anon Hall');
  });
});
