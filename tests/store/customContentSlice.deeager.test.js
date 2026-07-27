/**
 * customContentSlice — lazy admission, durable projection, and registry seam.
 *
 * The manifest and immutable command stack are intentionally absent from the
 * eager store closure. Every authored entry awaits that lazy admission wall,
 * then the slice projects only a confirmed writer receipt. The compatibility
 * local cache remains an owner-scoped offline mirror, never write authority.
 */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const h = vi.hoisted(() => {
  let calls = 0;
  let revisionSequence = 0;
  const definitions = new Map();

  function confirmed(commandId, items, perEntry) {
    return {
      ok: true,
      status: 'applied',
      commandId,
      reason: null,
      persistence: {
        state: 'confirmed',
        authority: 'test-transaction',
      },
      result: { items },
      perEntry,
    };
  }

  return {
    service: {
      isConfigured: true,
      executeCommand: async (preview, options) => {
        calls += 1;
        const items = [];
        const perEntry = [];
        for (const entry of preview.plan.entries) {
          const existing = definitions.get(entry.definitionId);
          if (
            existing
            && entry.expectedHeadRevisionId !== existing.revisionId
          ) {
            return {
              ok: false,
              status: 'stale',
              commandId: options.commandId,
              reason: 'definition_head_changed',
              persistence: {
                state: 'not-required',
                authority: 'test-transaction',
              },
              result: null,
              perEntry: [],
            };
          }
          const revisionId = `revision_${++revisionSequence}`;
          const projected = {
            ...entry.data,
            id: entry.definitionId,
            definitionId: entry.definitionId,
            revisionId,
            revisionNumber: (existing?.revisionNumber || 0) + 1,
            localUid: entry.data.localUid || existing?.localUid
              || `lu_test_${revisionSequence}`,
            isCustom: true,
          };
          definitions.set(entry.definitionId, {
            ...projected,
            category: entry.category,
          });
          items.push(projected);
          perEntry.push({
            definitionId: entry.definitionId,
            revisionId,
            status: existing ? 'updated' : 'created',
            category: entry.category,
          });
        }
        return confirmed(options.commandId, items, perEntry);
      },
      list: () => Promise.reject(new Error('offline')),
      listContentEnvironmentRevisions: () => Promise.resolve([]),
      loadActiveContentEnvironment: () => Promise.resolve(null),
      resolveContentEnvironment: () => Promise.resolve({
        ok: true,
        customContent: {},
      }),
    },
    callCount() {
      return calls;
    },
    reset() {
      calls = 0;
      revisionSequence = 0;
      definitions.clear();
    },
  };
});

vi.mock('../../src/lib/customContent.js', () => ({
  customContentService: h.service,
}));

const { createCustomContentSlice } = await import(
  '../../src/store/customContentSlice.js'
);
import {
  invalidateCustomDepsIfLoaded,
  setCustomContentSource,
} from '../../src/lib/customContentSource.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => {
      data.set(String(key), String(value));
    },
    removeItem: key => {
      data.delete(String(key));
    },
    clear: () => {
      data.clear();
    },
  };
}

function makeStore(userId = 'user_rt') {
  return create(immer((...args) => ({
    auth: { user: { id: userId }, tier: 'premium' },
    canUseCustomContent: () => true,
    ...createCustomContentSlice(...args),
  })));
}

const VALID_DEITY = {
  name: 'Ostara of the Long Field',
  alignmentAxis: 'good',
  temperamentAxis: 'peacelike',
  rankAxis: 'minor',
  lawAxis: 'lawful',
};

const VALID_TRADITION = {
  name: 'The Greening Vigil',
  motifElement: 'greening',
  motifAct: 'vigil',
};

describe('lazy authoring round trip and offline owner mirror', () => {
  beforeEach(() => {
    installLocalStorage();
    h.reset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('rehydrates a confirmed deity from the owner mirror and validates revisions', async () => {
    const firstStore = makeStore();
    const created = await firstStore.getState().addCustomItem(
      'deities',
      VALID_DEITY,
    );

    expect(created).toMatchObject({
      name: VALID_DEITY.name,
      revisionNumber: 1,
    });
    expect(
      firstStore.getState().customContentLastCommandReceipt.persistence.state,
    ).toBe('confirmed');

    const persisted = JSON.parse(
      localStorage.getItem('sf_custom_content:user_rt'),
    );
    expect(persisted.deities[0]).toMatchObject({
      name: VALID_DEITY.name,
      definitionId: created.definitionId,
      revisionId: created.revisionId,
    });

    // A signed-in store deliberately starts from the anonymous bucket. When
    // the cloud is unreachable, load restores only this owner's confirmed
    // projection and reports stale-but-available state without an error.
    const offlineStore = makeStore();
    expect(offlineStore.getState().getCustomItems('deities')).toEqual([]);
    await offlineStore.getState().loadCustomContentFromCloud();
    const [hydrated] = offlineStore.getState().getCustomItems('deities');
    expect(hydrated).toMatchObject({
      definitionId: created.definitionId,
      revisionId: created.revisionId,
      name: VALID_DEITY.name,
    });
    expect(offlineStore.getState().customContentError).toBeNull();

    const callsBeforeInvalidEdit = h.callCount();
    const rejected = await offlineStore.getState().updateCustomItem(
      'deities',
      hydrated.definitionId,
      { rankAxis: 'archgod' },
    );
    expect(rejected).toBeNull();
    expect(h.callCount()).toBe(callsBeforeInvalidEdit);
    expect(
      offlineStore.getState().getCustomItems('deities')[0],
    ).toMatchObject({
      rankAxis: 'minor',
      revisionId: created.revisionId,
    });
    expect(offlineStore.getState().customContentError).toMatch(/rankAxis/);

    const revised = await offlineStore.getState().updateCustomItem(
      'deities',
      hydrated.definitionId,
      { rankAxis: 'cult' },
    );
    expect(revised).toMatchObject({
      rankAxis: 'cult',
      revisionNumber: 2,
    });
    expect(revised.revisionId).not.toBe(created.revisionId);
    expect(
      JSON.parse(localStorage.getItem('sf_custom_content:user_rt'))
        .deities[0].rankAxis,
    ).toBe('cult');
  });

  test('hydrates the anonymous confirmed projection synchronously on store creation', async () => {
    const makeAnonStore = () => create(immer((...args) => ({
      auth: { user: null, tier: 'anon' },
      canUseCustomContent: () => false,
      ...createCustomContentSlice(...args),
    })));
    const firstStore = makeAnonStore();
    await firstStore.getState().addCustomItem('deities', VALID_DEITY);

    const freshStore = makeAnonStore();
    expect(freshStore.getState().getCustomItems('deities')[0]).toMatchObject({
      name: VALID_DEITY.name,
      revisionNumber: 1,
    });
  });

  test('round-trips traditions through the same manifest and command walls', async () => {
    const firstStore = makeStore();
    await firstStore.getState().addCustomItem(
      'traditions',
      VALID_TRADITION,
    );

    const offlineStore = makeStore();
    await offlineStore.getState().loadCustomContentFromCloud();
    const [row] = offlineStore.getState().getCustomItems('traditions');
    expect(row.motifElement).toBe('greening');

    const callsBeforeRejections = h.callCount();
    expect(
      await offlineStore.getState().updateCustomItem(
        'traditions',
        row.definitionId,
        { motifAct: 'sacrifice' },
      ),
    ).toBeNull();
    expect(
      await offlineStore.getState().addCustomItem(
        'traditions',
        { name: 'Unknown Rite', motifElement: 'not-a-key' },
      ),
    ).toBeNull();
    expect(h.callCount()).toBe(callsBeforeRejections);
    expect(offlineStore.getState().getCustomItems('traditions')).toHaveLength(1);
  });
});

describe('lazy admission is atomic before command persistence', () => {
  beforeEach(() => {
    installLocalStorage();
    h.reset();
  });

  test('an invalid write never reaches the writer or appears transiently', async () => {
    const store = makeStore();
    const pending = store.getState().addCustomItem('deities', {
      ...VALID_DEITY,
      alignmentAxis: 'zesty',
    });

    expect(store.getState().getCustomItems('deities')).toEqual([]);
    expect(await pending).toBeNull();
    expect(store.getState().getCustomItems('deities')).toEqual([]);
    expect(store.getState().customContentError).toMatch(/alignmentAxis/);
    expect(h.callCount()).toBe(0);
  });

  test('back-to-back valid writes commit while a rejected peer remains absent', async () => {
    const store = makeStore();
    const first = store.getState().addCustomItem('deities', {
      ...VALID_DEITY,
      name: 'First God',
    });
    const second = store.getState().addCustomItem('deities', {
      ...VALID_DEITY,
      name: 'Second God',
    });
    const rejected = store.getState().addCustomItem('deities', {
      ...VALID_DEITY,
      name: 'Broken God',
      rankAxis: 'nope',
    });

    expect(store.getState().getCustomItems('deities')).toEqual([]);
    await Promise.all([first, second, rejected]);

    expect(
      store.getState().getCustomItems('deities').map(item => item.name),
    ).toEqual(['Second God', 'First God']);
    expect(await rejected).toBeNull();
    expect(h.callCount()).toBe(2);
  });

  test('rejects a mixed batch before persisting any entry', async () => {
    const store = makeStore();
    const receipt = await store.getState().applyCustomContentCommand({
      kind: 'content.definition.create-revision',
      entries: [
        {
          category: 'deities',
          item: { ...VALID_DEITY, name: 'Admissible God' },
        },
        {
          category: 'deities',
          item: { ...VALID_DEITY, name: 'Broken God', rankAxis: 'nope' },
        },
      ],
      source: { type: 'manual', ref: 'mixed-batch-test' },
    });

    expect(receipt).toMatchObject({
      ok: false,
      status: 'failed',
      persistence: { state: 'not-required' },
    });
    expect(receipt.reason).toMatch(/rankAxis/);
    expect(h.callCount()).toBe(0);
    expect(store.getState().getCustomItems('deities')).toEqual([]);
    expect(localStorage.getItem('sf_custom_content:user_rt')).toBeNull();
  });

  test('non-axis categories use the same lazy manifest wall and confirmed receipt', async () => {
    const store = makeStore();
    const pending = store.getState().addCustomItem(
      'institutions',
      { name: 'Quick Hall' },
    );
    expect(store.getState().getCustomItems('institutions')).toEqual([]);

    const item = await pending;
    expect(item.name).toBe('Quick Hall');
    expect(store.getState().getCustomItems('institutions')[0].name)
      .toBe('Quick Hall');
    expect(h.callCount()).toBe(1);
  });
});

describe('lazy dependency-registry invalidation seam', () => {
  beforeEach(() => installLocalStorage());

  test('invalidation before registry load is a safe no-op', () => {
    expect(() => invalidateCustomDepsIfLoaded()).not.toThrow();
  });

  test('rewiring a loaded source rebuilds equal-sized registry content', async () => {
    const { customDeps } = await import('../../src/lib/dependencyEngine.js');
    setCustomContentSource(() => ({
      deities: [{ localUid: 'lu_seam_a', name: 'Seam God A' }],
    }));
    expect(
      customDeps.registry().listCustom('deities').map(entry => entry.name),
    ).toEqual(['Seam God A']);

    // Count and update timestamps are intentionally identical. The eager seam,
    // rather than the registry's shape cache, must make this replacement live.
    setCustomContentSource(() => ({
      deities: [{ localUid: 'lu_seam_b', name: 'Seam God B' }],
    }));
    expect(
      customDeps.registry().listCustom('deities').map(entry => entry.name),
    ).toEqual(['Seam God B']);

    setCustomContentSource(null);
    invalidateCustomDepsIfLoaded();
  });
});
