import { beforeEach, describe, expect, test } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  makeLibraryContentEnvironmentRevision,
  makeContentEnvironmentRevision,
  VANILLA_CONTENT_ENVIRONMENT,
} from '../../src/domain/content/contentEnvironment.js';
import { createCustomContentSlice } from '../../src/store/customContentSlice.js';

function installLocalStorage() {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(String(key)) ?? null,
    setItem: (key, value) => values.set(String(key), String(value)),
    removeItem: key => values.delete(String(key)),
    clear: () => values.clear(),
  };
}

function makeStore() {
  return create(immer((...args) => ({
    auth: { user: { id: 'environment-owner' }, tier: 'premium' },
    canUseCustomContent: () => true,
    pinLegacyCampaignContentBindings: () => false,
    ...createCustomContentSlice(...args),
  })));
}

describe('custom content environment activation', () => {
  beforeEach(() => installLocalStorage());

  test('previews, activates, rolls back, and explicitly resets to vanilla', async () => {
    const store = makeStore();
    const first = makeContentEnvironmentRevision({
      environmentId: 'personal:table',
      environmentRevisionId: 'personal:table:v1',
      revisionNumber: 1,
      tunables: { priorityEconomy: 70 },
      source: 'personal',
    });
    const second = makeContentEnvironmentRevision({
      environmentId: 'personal:table',
      environmentRevisionId: 'personal:table:v2',
      revisionNumber: 2,
      tunables: { priorityEconomy: 85, magicExists: false },
      source: 'personal',
    });

    const reviewed = await store.getState()
      .previewCustomContentEnvironmentMigration(first);
    expect(reviewed).toMatchObject({
      ok: true,
      previewFingerprint: expect.stringMatching(/^[0-9a-f]{64}$/),
    });
    expect(reviewed.changes.map(change => change.path))
      .toContain('tunables.priorityEconomy');

    const activated = await store.getState()
      .migrateCustomContentEnvironment(first, {
        previewFingerprint: reviewed.previewFingerprint,
      });
    expect(activated).toMatchObject({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
    });
    expect(store.getState().getActiveCustomContentRuntime().tunables)
      .toEqual({ priorityEconomy: 70 });

    await store.getState().migrateCustomContentEnvironment(second);
    expect(store.getState().activeContentEnvironment.environmentRevisionId)
      .toBe(second.environmentRevisionId);

    const rolledBack = await store.getState()
      .rollbackCustomContentEnvironment(first.environmentRevisionId);
    expect(rolledBack.ok).toBe(true);
    expect(store.getState().activeContentEnvironment.environmentRevisionId)
      .toBe(first.environmentRevisionId);

    const reset = await store.getState()
      .resetCustomContentEnvironmentToVanilla();
    expect(reset.ok).toBe(true);
    expect(store.getState().activeContentEnvironment.environmentRevisionId)
      .toBe(VANILLA_CONTENT_ENVIRONMENT.environmentRevisionId);
    // Resetting to vanilla preserves the authored library in the Compendium but
    // excludes every authored definition from generation.
    expect(store.getState().getActiveCustomContentRuntime().customContent)
      .toMatchObject({
        institutions: [],
        resources: [],
      });
    expect(store.getState().customContent).toBeTruthy();
  });

  test('rejects a stale reviewed environment fingerprint before persistence', async () => {
    const store = makeStore();
    const environment = makeContentEnvironmentRevision({
      environmentId: 'personal:stale',
      environmentRevisionId: 'personal:stale:v1',
      tunables: { priorityMilitary: 65 },
    });
    const receipt = await store.getState()
      .migrateCustomContentEnvironment(environment, {
        previewFingerprint: '0'.repeat(64),
      });
    expect(receipt).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'content_environment_preview_stale',
    });
    expect(store.getState().activeContentEnvironment.environmentRevisionId)
      .toBe(VANILLA_CONTENT_ENVIRONMENT.environmentRevisionId);
  });

  test('rejects a reviewed migration after another environment becomes active', async () => {
    const store = makeStore();
    const reviewedTarget = makeContentEnvironmentRevision({
      environmentId: 'personal:reviewed',
      environmentRevisionId: 'personal:reviewed:v1',
      tunables: { priorityMilitary: 65 },
    });
    const concurrentTarget = makeContentEnvironmentRevision({
      environmentId: 'personal:concurrent',
      environmentRevisionId: 'personal:concurrent:v1',
      tunables: { priorityEconomy: 75 },
    });
    const reviewed = await store.getState()
      .previewCustomContentEnvironmentMigration(reviewedTarget);
    await store.getState().migrateCustomContentEnvironment(concurrentTarget);

    const stale = await store.getState()
      .migrateCustomContentEnvironment(reviewedTarget, {
        previewFingerprint: reviewed.previewFingerprint,
      });

    expect(stale).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'content_environment_preview_stale',
    });
    expect(store.getState().activeContentEnvironment.environmentRevisionId)
      .toBe(concurrentTarget.environmentRevisionId);
  });

  test('rolls back to the exact historical definition revision after the library head advances', async () => {
    const store = makeStore();
    const firstHead = await store.getState().addCustomItem(
      'institutions',
      {
        name: 'Old Guildhall',
        description: 'The reviewed first edition.',
      },
    );
    const firstEnvironment = makeLibraryContentEnvironmentRevision(
      store.getState().customContent,
      { source: 'personal' },
    );
    expect((await store.getState().migrateCustomContentEnvironment(
      firstEnvironment,
    )).ok).toBe(true);

    const secondHead = await store.getState().updateCustomItem(
      'institutions',
      firstHead.definitionId,
      {
        name: 'New Guildhall',
        description: 'A later account-library head.',
      },
    );
    expect(secondHead.revisionId).not.toBe(firstHead.revisionId);
    const secondEnvironment = makeLibraryContentEnvironmentRevision(
      store.getState().customContent,
      { source: 'personal' },
    );
    expect((await store.getState().migrateCustomContentEnvironment(
      secondEnvironment,
    )).ok).toBe(true);

    const rolledBack = await store.getState()
      .rollbackCustomContentEnvironment(
        firstEnvironment.environmentRevisionId,
      );
    expect(rolledBack).toMatchObject({
      ok: true,
      status: 'applied',
    });
    expect(store.getState().customContent.institutions[0].name)
      .toBe('New Guildhall');
    expect(
      store.getState()
        .getActiveCustomContentRuntime()
        .customContent
        .institutions[0],
    ).toMatchObject({
      name: 'Old Guildhall',
      revisionId: firstHead.revisionId,
    });
  });
});
