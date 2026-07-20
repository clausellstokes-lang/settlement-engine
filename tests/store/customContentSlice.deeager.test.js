/**
 * tests/store/customContentSlice.deeager.test.js — the DE-EAGER LANE's
 * lifecycle round-trip pins (2026-07-19).
 *
 * The schema validators load LAZILY at the slice's validation chokepoint
 * (validationErrorsFor: an axis-bearing write AWAITS the import — never skips),
 * and the registry cache is invalidated through the eager seam
 * (lib/customContentSource.js). Each persisted-path lifecycle leg the
 * conversion touched gets an executed proof here:
 *
 *   1. AUTHOR → PERSIST → REHYDRATE → EDIT → VALIDATE (deities + traditions).
 *   2. THE RACE — writes issued back-to-back without awaiting, while the
 *      schema may still be loading: the invalid write NEVER lands (not even
 *      transiently — no optimistic insert precedes validation), the valid
 *      writes land in call order.
 *   3. IMPORT → VALIDATE — the content-pack lane (prepareImport → the async
 *      addCustomItem commit loop, invalid deity refused at BOTH walls).
 *   4. THE SEAM — invalidate-before-load is a safe no-op; a source re-wire
 *      AFTER the registry loaded rebuilds the registry from the new source
 *      (the stale-cache hazard the old direct customDeps.invalidate covered).
 *
 * NOT covered here, deliberately: canonize — no canonize path writes or
 * validates custom content (verified 2026-07-19: canonizeWorldState /
 * canonizeSavedSettlement / campaignSpatialCanonize operate on worldState and
 * saves only); hydration-time validation — loadAll() never validated and still
 * does not (migrateCustomContent is shape-healing, import-free, synchronous).
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// A configured-but-OFFLINE cloud service: add/update/delete resolve benignly
// (echoing a cloud id), list() REJECTS — which forces loadCustomContentFromCloud
// down the owner-scoped LOCAL MIRROR restore branch, the real premium
// rehydration leg this lane touched (its registry invalidate now rides the
// seam). Slice creation itself hydrates the ANON bucket by design; a signed-in
// owner's content comes back through this path.
vi.mock('../../src/lib/customContent.js', () => ({
  customContentService: {
    isConfigured: true,
    add: (_category, entry) => Promise.resolve({ ...entry, id: `cloud_${entry.localUid || 'x'}` }),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve(),
    list: () => Promise.reject(new Error('offline')),
  },
}));

const { createCustomContentSlice } = await import('../../src/store/customContentSlice.js');
import {
  setCustomContentSource,
  invalidateCustomDepsIfLoaded,
} from '../../src/lib/customContentSource.js';
import { prepareImport } from '../../src/lib/contentPacks.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

function makeStore(userId = 'user_rt') {
  return create(immer((...a) => ({
    auth: { user: { id: userId }, tier: 'premium' },
    canUseCustomContent: () => true,
    ...createCustomContentSlice(...a),
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

describe('de-eager round trip — author → persist → rehydrate → edit → validate', () => {
  beforeEach(() => installLocalStorage());

  test('a deity authored on store A rehydrates on store B and still validates edits', async () => {
    const a = makeStore();
    await a.getState().addCustomItem('deities', VALID_DEITY);
    expect(a.getState().getCustomItems('deities')).toHaveLength(1);

    // PERSIST: the optimistic write reached the owner-scoped local mirror.
    const persisted = JSON.parse(localStorage.getItem('sf_custom_content:user_rt'));
    expect(persisted.deities[0].name).toBe(VALID_DEITY.name);
    expect(persisted.deities[0].localUid).toBeTruthy();

    // REHYDRATE: a fresh signed-in store starts from the (empty) anon bucket,
    // then loadCustomContentFromCloud finds the cloud unreachable and restores
    // the owner-scoped mirror — the premium offline path, whose registry
    // invalidate now goes through the seam (no eager registry import). No data
    // loss, no error surfaced (stale-but-available contract).
    const b = makeStore();
    await b.getState().loadCustomContentFromCloud();
    const hydrated = b.getState().getCustomItems('deities');
    expect(hydrated).toHaveLength(1);
    expect(hydrated[0].localUid).toBe(persisted.deities[0].localUid);
    expect(b.getState().customContentError).toBeNull();

    // EDIT → VALIDATE on the rehydrated row: bad axis refused, row intact…
    const bad = await b.getState().updateCustomItem('deities', hydrated[0].id, { rankAxis: 'archgod' });
    expect(bad).toBeNull();
    expect(b.getState().getCustomItems('deities')[0].rankAxis).toBe('minor');
    expect(b.getState().customContentError).toMatch(/rankAxis/);
    // …valid edit applied and re-persisted.
    await b.getState().updateCustomItem('deities', hydrated[0].id, { rankAxis: 'cult' });
    expect(b.getState().getCustomItems('deities')[0].rankAxis).toBe('cult');
    expect(JSON.parse(localStorage.getItem('sf_custom_content:user_rt')).deities[0].rankAxis).toBe('cult');
  });

  test('the ANON lane hydrates synchronously at store creation (validation-free by design)', async () => {
    const anon = create(immer((...a) => ({
      auth: { user: null, tier: 'anon' },
      canUseCustomContent: () => false,
      ...createCustomContentSlice(...a),
    })));
    await anon.getState().addCustomItem('deities', VALID_DEITY);
    // Fresh anon store: creation-time loadAll('anon') reads it straight back —
    // the synchronous hydration leg, deliberately untouched by the conversion
    // (loadAll never validated; migrateCustomContent is import-free healing).
    const anon2 = create(immer((...a) => ({
      auth: { user: null, tier: 'anon' },
      canUseCustomContent: () => false,
      ...createCustomContentSlice(...a),
    })));
    expect(anon2.getState().getCustomItems('deities')[0].name).toBe(VALID_DEITY.name);
  });

  test('a tradition round-trips the same lane; a bad motif is refused at the chokepoint', async () => {
    const a = makeStore();
    await a.getState().addCustomItem('traditions', VALID_TRADITION);
    const b = makeStore();
    await b.getState().loadCustomContentFromCloud();
    const [row] = b.getState().getCustomItems('traditions');
    expect(row.motifElement).toBe('greening');

    expect(await b.getState().updateCustomItem('traditions', row.id, { motifAct: 'sacrifice' })).toBeNull();
    expect(b.getState().getCustomItems('traditions')[0].motifAct).toBe('vigil');
    expect(await b.getState().addCustomItem('traditions', { name: 'X', motifElement: 'not-a-key' })).toBeNull();
    expect(b.getState().getCustomItems('traditions')).toHaveLength(1);
  });
});

describe('de-eager race — validate-before-schema-loaded resolves correctly', () => {
  beforeEach(() => installLocalStorage());

  test('an invalid write racing the schema load never lands, not even transiently', async () => {
    const store = makeStore();
    // Fire WITHOUT awaiting — the schema import may still be in flight.
    const pending = store.getState().addCustomItem('deities', { ...VALID_DEITY, alignmentAxis: 'zesty' });
    // BEFORE the promise settles: nothing was optimistically inserted — the
    // write happens strictly AFTER validation resolves (the chokepoint law).
    expect(store.getState().getCustomItems('deities')).toHaveLength(0);
    expect(await pending).toBeNull();
    expect(store.getState().getCustomItems('deities')).toHaveLength(0);
    expect(store.getState().customContentError).toMatch(/alignmentAxis/);
  });

  test('back-to-back un-awaited writes apply in call order (FIFO through the lazy load)', async () => {
    const store = makeStore();
    const p1 = store.getState().addCustomItem('deities', { ...VALID_DEITY, name: 'First God' });
    const p2 = store.getState().addCustomItem('deities', { ...VALID_DEITY, name: 'Second God' });
    const p3 = store.getState().addCustomItem('deities', { ...VALID_DEITY, name: 'Bad God', rankAxis: 'nope' });
    await Promise.all([p1, p2, p3]);
    const names = store.getState().getCustomItems('deities').map(d => d.name);
    // unshift ⇒ newest first; the invalid third write is absent.
    expect(names).toEqual(['Second God', 'First God']);
    expect(await p3).toBeNull();
  });

  test('non-axis buckets never touch the schema and still write atomically', async () => {
    const store = makeStore();
    const pending = store.getState().addCustomItem('institutions', { name: 'Quick Hall' });
    await pending;
    expect(store.getState().getCustomItems('institutions')[0].name).toBe('Quick Hall');
  });
});

describe('de-eager import lane — prepareImport → async addCustomItem commit', () => {
  beforeEach(() => installLocalStorage());

  test('a pack with one valid and one invalid deity lands exactly the valid one', async () => {
    const pack = {
      format: 'settlementforge.content-pack',
      version: 1,
      name: 't',
      content: {
        deities: [
          { ...VALID_DEITY, localUid: 'lu_pack_1' },
          { name: 'Broken God', alignmentAxis: 'sideways', temperamentAxis: 'warlike', rankAxis: 'major', localUid: 'lu_pack_2' },
        ],
      },
    };
    // Wall 1: prepareImport re-validates deities (sync, pure — lazy chunk in app).
    const { items, rejected } = prepareImport(pack);
    expect(items).toHaveLength(1);
    expect(rejected).toHaveLength(1);

    // Wall 2 (belt-and-suspenders): the async store commit re-validates.
    const store = makeStore();
    let added = 0;
    for (const { bucket, item } of items) {
      if ((await store.getState().addCustomItem(bucket, item)) !== null) added += 1;
    }
    expect(added).toBe(1);
    expect(store.getState().getCustomItems('deities')).toHaveLength(1);
    // And pushing the rejected shape straight at the store is refused too.
    expect(await store.getState().addCustomItem('deities', { ...VALID_DEITY, alignmentAxis: 'sideways' })).toBeNull();
  });
});

describe('de-eager seam — invalidation without an eager registry import', () => {
  beforeEach(() => installLocalStorage());

  test('invalidateCustomDepsIfLoaded before the registry ever loads is a safe no-op', () => {
    expect(() => invalidateCustomDepsIfLoaded()).not.toThrow();
  });

  test('a source re-wire AFTER the registry loaded rebuilds it from the new source', async () => {
    // Load the (lazy-in-app) registry module for real — it self-registers its
    // invalidator on the seam at module load.
    const { customDeps } = await import('../../src/lib/dependencyEngine.js');
    setCustomContentSource(() => ({ deities: [{ localUid: 'lu_seam_a', name: 'Seam God A' }] }));
    expect(customDeps.registry().listCustom('deities').map(e => e.name)).toEqual(['Seam God A']);
    // Re-wire to a DIFFERENT source with the SAME count and no updatedAt — the
    // exact swap the (count:latest) cache key cannot see. The seam's re-wire
    // invalidation is what forces the rebuild.
    setCustomContentSource(() => ({ deities: [{ localUid: 'lu_seam_b', name: 'Seam God B' }] }));
    expect(customDeps.registry().listCustom('deities').map(e => e.name)).toEqual(['Seam God B']);
    // Restore the default empty source so no other test observes this wiring.
    setCustomContentSource(null);
    invalidateCustomDepsIfLoaded();
  });
});
