/**
 * customContentSlice — deity bucket authoring (Feature D / R1).
 *
 * Pins: the deities bucket creates immutable revisions and archives without
 * deleting history; manifest validation rejects bad/missing axes before the
 * command writer; and the local immutable ledger remains an honest offline
 * authority when cloud persistence is not configured.
 */

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

function makeStore({ premium = true } = {}) {
  return create(immer((...a) => ({
    auth: { user: { id: 'user_d' }, tier: premium ? 'premium' : 'free' },
    canUseCustomContent: () => premium,
    ...createCustomContentSlice(...a),
  })));
}

const VALID_DEITY = {
  name: 'Vael, the Iron Dawn',
  alignmentAxis: 'good',
  temperamentAxis: 'warlike',
  rankAxis: 'major',
  domain: 'war and renewal',
};

describe('customContentSlice — deities bucket', () => {
  beforeEach(() => installLocalStorage());

  test('the EMPTY state seeds a deities bucket', () => {
    const store = makeStore();
    expect(Array.isArray(store.getState().customContent.deities)).toBe(true);
    expect(store.getState().customContent.deities).toEqual([]);
  });

  test('create → list → archive keeps immutable history', async () => {
    const store = makeStore();

    const created = await store.getState().addCustomItem(
      'deities',
      VALID_DEITY,
    );
    const listed = store.getState().getCustomItems('deities');
    expect(listed).toHaveLength(1);
    expect(listed[0]).toMatchObject({
      name: 'Vael, the Iron Dawn',
      alignmentAxis: 'good',
      temperamentAxis: 'warlike',
      rankAxis: 'major',
      definitionId: created.definitionId,
      revisionId: created.revisionId,
      revisionNumber: 1,
    });
    expect(listed[0].localUid).toBeTruthy();
    expect(listed[0].isCustom).toBe(true);
    expect(
      store.getState().customContentLastCommandReceipt.persistence.state,
    ).toBe('confirmed');

    const archiveReceipt = await store.getState().deleteCustomItem(
      'deities',
      listed[0].definitionId,
    );
    expect(archiveReceipt).toMatchObject({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
    });
    expect(store.getState().getCustomItems('deities')).toHaveLength(0);

    const archived = await store.getState().loadArchivedCustomContent();
    expect(archived.deities[0]).toMatchObject({
      definitionId: created.definitionId,
      revisionId: created.revisionId,
      name: VALID_DEITY.name,
    });
    const history = await store.getState().listCustomContentRevisions(
      created.definitionId,
    );
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      id: created.revisionId,
      revisionNumber: 1,
      isHead: true,
    });
  });

  test('validation rejects a bad alignment axis', async () => {
    const store = makeStore();
    const res = await store.getState().addCustomItem('deities', { ...VALID_DEITY, alignmentAxis: 'lawful' });
    expect(res).toBeNull();
    expect(store.getState().getCustomItems('deities')).toHaveLength(0);
    expect(store.getState().customContentError).toMatch(/alignmentAxis/);
  });

  test('validation rejects a bad temperament axis and a bad rank axis', async () => {
    const store = makeStore();
    await store.getState().addCustomItem('deities', { ...VALID_DEITY, temperamentAxis: 'sleepy' });
    expect(store.getState().getCustomItems('deities')).toHaveLength(0);

    await store.getState().addCustomItem('deities', { ...VALID_DEITY, rankAxis: 'demigod' });
    expect(store.getState().getCustomItems('deities')).toHaveLength(0);
  });

  test('validation rejects a deity with no name', async () => {
    const store = makeStore();
    await store.getState().addCustomItem('deities', { ...VALID_DEITY, name: '   ' });
    expect(store.getState().getCustomItems('deities')).toHaveLength(0);
  });

  test('updating a deity to a bad axis is rejected and leaves the row intact', async () => {
    const store = makeStore();
    await store.getState().addCustomItem('deities', VALID_DEITY);
    const { id } = store.getState().getCustomItems('deities')[0];

    const res = await store.getState().updateCustomItem('deities', id, { rankAxis: 'archgod' });
    expect(res).toBeNull();
    const after = store.getState().getCustomItems('deities')[0];
    expect(after.rankAxis).toBe('major'); // unchanged
  });

  test('a valid update is applied', async () => {
    const store = makeStore();
    const created = await store.getState().addCustomItem(
      'deities',
      VALID_DEITY,
    );

    const revised = await store.getState().updateCustomItem(
      'deities',
      created.definitionId,
      { rankAxis: 'cult' },
    );
    expect(revised).toMatchObject({
      definitionId: created.definitionId,
      rankAxis: 'cult',
      revisionNumber: 2,
    });
    expect(revised.revisionId).not.toBe(created.revisionId);
    const history = await store.getState().listCustomContentRevisions(
      created.definitionId,
    );
    expect(history.map(revision => revision.revisionNumber)).toEqual([2, 1]);
    expect(history.map(revision => revision.isHead)).toEqual([true, false]);
  });

  test('rollback appends forward, and archive → restore preserves every revision', async () => {
    const store = makeStore();
    const created = await store.getState().addCustomItem(
      'deities',
      VALID_DEITY,
    );
    const revised = await store.getState().updateCustomItem(
      'deities',
      created.definitionId,
      { rankAxis: 'cult' },
    );

    const rollback = await store.getState().rollbackCustomItem(
      'deities',
      created.definitionId,
      created.revisionId,
      revised.revisionId,
    );
    expect(rollback).toMatchObject({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
    });
    const rolledBackHead = store.getState().getCustomItems('deities')[0];
    expect(rolledBackHead).toMatchObject({
      definitionId: created.definitionId,
      revisionNumber: 3,
      rankAxis: 'major',
    });
    expect(rolledBackHead.revisionId).not.toBe(created.revisionId);
    expect(rolledBackHead.revisionId).not.toBe(revised.revisionId);

    let history = await store.getState().listCustomContentRevisions(
      created.definitionId,
    );
    expect(history.map(revision => revision.revisionNumber)).toEqual([3, 2, 1]);
    expect(history.map(revision => revision.isHead)).toEqual(
      [true, false, false],
    );

    const archived = await store.getState().deleteCustomItem(
      'deities',
      created.definitionId,
    );
    expect(archived).toMatchObject({ ok: true, status: 'applied' });
    expect(store.getState().getCustomItems('deities')).toEqual([]);
    expect(
      (await store.getState().loadArchivedCustomContent()).deities[0],
    ).toMatchObject({
      definitionId: created.definitionId,
      revisionId: rolledBackHead.revisionId,
      rankAxis: 'major',
    });

    const restored = await store.getState().restoreCustomItem(
      'deities',
      created.definitionId,
      rolledBackHead.revisionId,
    );
    expect(restored).toMatchObject({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
    });
    expect(store.getState().getCustomItems('deities')[0]).toMatchObject({
      definitionId: created.definitionId,
      revisionId: rolledBackHead.revisionId,
      revisionNumber: 3,
    });
    expect(
      (await store.getState().loadArchivedCustomContent()).deities,
    ).toEqual([]);

    history = await store.getState().listCustomContentRevisions(
      created.definitionId,
    );
    expect(history.map(revision => revision.revisionNumber)).toEqual([3, 2, 1]);
    expect(history[0]).toMatchObject({
      id: rolledBackHead.revisionId,
      isHead: true,
      definitionArchivedAt: null,
    });
  });

  test('a non-premium owner never claims cloud sync for its offline revision', async () => {
    // The normal unit environment has no Supabase authority. Grandfathered
    // authoring can still produce a local immutable revision, while the
    // entitlement predicate prevents cloud hydration or migration.
    const free = makeStore({ premium: false });
    expect(free.getState().canUseCustomContent()).toBe(false);
    const created = await free.getState().addCustomItem(
      'deities',
      VALID_DEITY,
    );
    expect(created.revisionNumber).toBe(1);
    expect(free.getState().getCustomItems('deities')).toHaveLength(1);
    expect(free.getState().customContentSyncedAt).toBeNull();
    await free.getState().loadCustomContentFromCloud();
    expect(free.getState().customContentSyncedAt).toBeNull();

    const premium = makeStore({ premium: true });
    expect(premium.getState().canUseCustomContent()).toBe(true);
  });
});
