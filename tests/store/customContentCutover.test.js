/**
 * @vitest-environment jsdom
 */

import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const service = vi.hoisted(() => ({
  isConfigured: true,
  localExportArchive: vi.fn(),
  localClearArchivesAfterSnapshot: vi.fn(),
  importArchive: vi.fn(),
  bulkInsert: vi.fn(),
  add: vi.fn(),
}));

vi.mock('../../src/lib/customContent.js', () => ({
  customContentService: service,
}));

import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  buildCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  createCustomContentSlice,
} from '../../src/store/customContentSlice.js';

function archiveFor({
  ownerId,
  definitionId = null,
  revisionId = null,
  category = null,
  data = null,
}) {
  const hasDefinition = Boolean(
    definitionId && revisionId && category && data,
  );
  const contentHash = hasDefinition
    ? contentRevisionHash(category, data)
    : null;
  return buildCustomContentArchive({
    schemaVersion: 1,
    definitions: hasDefinition ? {
      [definitionId]: {
        id: definitionId,
        category,
        localUid: data.localUid,
        headRevisionId: revisionId,
        archivedAt: null,
        createdAt: null,
        updatedAt: null,
      },
    } : {},
    revisions: hasDefinition ? {
      [revisionId]: {
        id: revisionId,
        definitionId,
        category,
        revisionNumber: 1,
        parentRevisionId: null,
        contentHash,
        data,
        createdAt: null,
      },
    } : {},
    packs: {},
    activePacks: {},
    packEntryDefinitions: {},
    packVersionEntries: {},
    environments: {},
    activeEnvironmentRevisionId: null,
    commandReceipts: {},
  }, {
    sourceKey: `local:${ownerId}`,
    exportedAt: null,
  });
}

function makeStore(ownerId = 'owner-a') {
  return create(immer((set, get) => ({
    ...createCustomContentSlice(set, get),
    auth: {
      user: { id: ownerId },
      tier: 'premium',
      role: 'user',
    },
    canUseCustomContent: () => true,
    loadCustomContentFromCloud: vi.fn().mockResolvedValue(undefined),
  })));
}

describe('premium custom-content local-to-cloud cutover', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    service.isConfigured = true;
    service.localClearArchivesAfterSnapshot.mockResolvedValue(true);
    service.importArchive.mockResolvedValue({
      ok: true,
      status: 'applied',
      reason: null,
      persistence: {
        state: 'confirmed',
        authority: 'supabase-transaction',
      },
    });
  });

  test('imports one merged graph even after an earlier cutover checkpoint', async () => {
    const anonymous = archiveFor({
      ownerId: 'anon',
      definitionId: 'anon-ore',
      revisionId: 'anon-ore-r1',
      category: 'resources',
      data: { name: 'Star Ore', localUid: 'lu_star_ore' },
    });
    const owner = archiveFor({
      ownerId: 'owner-a',
      definitionId: 'owner-forge',
      revisionId: 'owner-forge-r1',
      category: 'institutions',
      data: {
        name: 'Star Forge',
        localUid: 'lu_star_forge',
        requires: ['custom:lu_star_ore'],
      },
    });
    service.localExportArchive.mockImplementation(({ ownerId }) => (
      Promise.resolve(ownerId === 'anon' ? anonymous : owner)
    ));
    localStorage.setItem('sf_custom_content_migrated:owner-a', '1');
    const store = makeStore();

    const result =
      await store.getState().migrateLocalCustomContentToCloud();

    expect(result).toMatchObject({ ok: true, status: 'applied' });
    expect(service.importArchive).toHaveBeenCalledTimes(1);
    const [merged, importOptions] = service.importArchive.mock.calls[0];
    expect(importOptions).toMatchObject({
      ownerId: 'owner-a',
      sourceKey: 'browser-cutover:owner-a',
      purpose: 'premium-cutover',
      activationPolicy: 'adopt-if-empty',
    });
    expect(merged.ledger.definitions).toHaveLength(2);
    expect(merged.auditProvenance.map(entry => entry.archiveFingerprint))
      .toEqual([
        anonymous.archiveFingerprint,
        owner.archiveFingerprint,
      ]);
    expect(service.localClearArchivesAfterSnapshot).toHaveBeenCalledWith([
      {
        ownerId: 'anon',
        ledgerFingerprint: anonymous.source.ledgerFingerprint,
      },
      {
        ownerId: 'owner-a',
        ledgerFingerprint: owner.source.ledgerFingerprint,
      },
    ]);
    expect(localStorage.getItem('sf_custom_content_migrated:owner-a'))
      .toBe('1');
    expect(store.getState().loadCustomContentFromCloud)
      .toHaveBeenCalledTimes(1);
    expect(service.bulkInsert).not.toHaveBeenCalled();
    expect(service.add).not.toHaveBeenCalled();
  });

  test('coalesces concurrent auth effects into one upload and one clear', async () => {
    const anonymous = archiveFor({
      ownerId: 'anon',
      definitionId: 'anon-hall',
      revisionId: 'anon-hall-r1',
      category: 'institutions',
      data: { name: 'Anon Hall', localUid: 'lu_anon_hall' },
    });
    const owner = archiveFor({ ownerId: 'owner-a' });
    service.localExportArchive.mockImplementation(({ ownerId }) => (
      Promise.resolve(ownerId === 'anon' ? anonymous : owner)
    ));
    let releaseImport;
    service.importArchive.mockImplementation(() => new Promise((resolve) => {
      releaseImport = () => resolve({
        ok: true,
        status: 'applied',
        persistence: {
          state: 'confirmed',
          authority: 'supabase-transaction',
        },
      });
    }));
    const store = makeStore();

    const first = store.getState().migrateLocalCustomContentToCloud();
    const second = store.getState().migrateLocalCustomContentToCloud();
    await vi.waitFor(() => {
      expect(service.importArchive).toHaveBeenCalledTimes(1);
    });
    releaseImport();
    await Promise.all([first, second]);

    expect(service.localExportArchive).toHaveBeenCalledTimes(2);
    expect(service.importArchive).toHaveBeenCalledTimes(1);
    expect(service.localClearArchivesAfterSnapshot).toHaveBeenCalledTimes(1);
  });

  test('keeps both local ledgers when the cloud command is ambiguous', async () => {
    const anonymous = archiveFor({
      ownerId: 'anon',
      definitionId: 'anon-hall',
      revisionId: 'anon-hall-r1',
      category: 'institutions',
      data: { name: 'Anon Hall', localUid: 'lu_anon_hall' },
    });
    const owner = archiveFor({ ownerId: 'owner-a' });
    service.localExportArchive.mockImplementation(({ ownerId }) => (
      Promise.resolve(ownerId === 'anon' ? anonymous : owner)
    ));
    service.importArchive.mockResolvedValue({
      ok: false,
      status: 'reconcile-required',
      reason: 'network_response_ambiguous',
      persistence: {
        state: 'unconfirmed',
        authority: 'supabase-transaction',
      },
    });
    const store = makeStore();

    const result =
      await store.getState().migrateLocalCustomContentToCloud();

    expect(result).toMatchObject({
      ok: false,
      status: 'reconcile-required',
    });
    expect(service.localClearArchivesAfterSnapshot).not.toHaveBeenCalled();
    expect(localStorage.getItem('sf_custom_content_migrated:owner-a'))
      .toBeNull();
    expect(store.getState().loadCustomContentFromCloud).not.toHaveBeenCalled();
  });

  test('does not mark completion when the all-owner snapshot CAS is stale', async () => {
    const anonymous = archiveFor({
      ownerId: 'anon',
      definitionId: 'anon-hall',
      revisionId: 'anon-hall-r1',
      category: 'institutions',
      data: { name: 'Anon Hall', localUid: 'lu_anon_hall' },
    });
    const owner = archiveFor({ ownerId: 'owner-a' });
    service.localExportArchive.mockImplementation(({ ownerId }) => (
      Promise.resolve(ownerId === 'anon' ? anonymous : owner)
    ));
    service.localClearArchivesAfterSnapshot.mockResolvedValue(false);
    const store = makeStore();

    const result =
      await store.getState().migrateLocalCustomContentToCloud();

    expect(result).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'custom_content_local_snapshot_changed',
    });
    expect(service.importArchive).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('sf_custom_content_migrated:owner-a'))
      .toBeNull();
  });

  test('an account switch after snapshot capture blocks upload and clearing', async () => {
    const anonymous = archiveFor({ ownerId: 'anon' });
    const owner = archiveFor({
      ownerId: 'owner-a',
      definitionId: 'owner-hall',
      revisionId: 'owner-hall-r1',
      category: 'institutions',
      data: { name: 'Owner Hall', localUid: 'lu_owner_hall' },
    });
    let releaseOwner;
    service.localExportArchive.mockImplementation(({ ownerId }) => (
      ownerId === 'anon'
        ? Promise.resolve(anonymous)
        : new Promise(resolve => { releaseOwner = () => resolve(owner); })
    ));
    const store = makeStore();
    const migrating =
      store.getState().migrateLocalCustomContentToCloud();
    await vi.waitFor(() => {
      expect(service.localExportArchive).toHaveBeenCalledTimes(2);
    });

    store.setState({
      auth: {
        user: { id: 'owner-b' },
        tier: 'premium',
        role: 'user',
      },
    });
    releaseOwner();
    const result = await migrating;

    expect(result).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'auth_session_changed',
    });
    expect(service.importArchive).not.toHaveBeenCalled();
    expect(service.localClearArchivesAfterSnapshot).not.toHaveBeenCalled();
  });
});
