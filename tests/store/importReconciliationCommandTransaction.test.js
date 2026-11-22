/**
 * Persistence/projection contract for structured-import application commands.
 *
 * Configured mode has exactly one writer (migration 184's RPC), offline mode
 * refuses without mutation, and local-only development is explicitly a
 * recoverable saga. These tests keep those authority claims from drifting.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';

const dependencies = vi.hoisted(() => ({
  backend: 'server',
  commit: vi.fn(),
  campaignCache: vi.fn(),
  campaignUpsert: vi.fn(),
  campaignWriteAll: vi.fn(),
  savesMutateBatch: vi.fn(),
}));

vi.mock('../../src/lib/importReconciliationCommandPersistence.js', () => ({
  IMPORT_COMMAND_BACKEND: Object.freeze({
    LOCAL_ONLY: 'local-only',
    OFFLINE: 'offline',
    SERVER: 'server',
  }),
  importReconciliationCommandBackend: () => dependencies.backend,
  commitImportReconciliationCommand: (...args) => dependencies.commit(...args),
}));

vi.mock('../../src/lib/campaigns.js', () => ({
  campaigns: {
    cache: (...args) => dependencies.campaignCache(...args),
    upsert: (...args) => dependencies.campaignUpsert(...args),
    writeAll: (...args) => dependencies.campaignWriteAll(...args),
  },
  admitSupabaseCampaignRows: rows => ({
    entries: rows,
    diagnostics: { rejected: 0 },
  }),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    mutateBatch: (...args) => dependencies.savesMutateBatch(...args),
  },
  admitSupabaseSavedSettlementRows: async rows => ({
    entries: rows,
    diagnostics: { rejected: 0 },
  }),
}));

import { runImportReconciliationCommandTransaction } from '../../src/store/importReconciliationCommandTransaction.js';

const OWNER = '11111111-1111-4111-8111-111111111111';
const OTHER_OWNER = '22222222-2222-4222-8222-222222222222';
const TARGET = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const OLD_CAMPAIGN = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const UNRELATED_CAMPAIGN = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
const SAVE = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const CREATED = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const CHECKSUM = 'sf-import-v1:source';

function stateFixture() {
  return {
    auth: { user: { id: OWNER } },
    campaignSessionGeneration: 7,
    savedSettlementsOwnerId: OWNER,
    savedSettlementsHydrationGeneration: 11,
    campaigns: [
      {
        id: TARGET,
        name: 'Target',
        settlementIds: [],
        worldState: { pendingEvents: [] },
        accessState: 'active',
      },
      {
        id: OLD_CAMPAIGN,
        name: 'Old',
        settlementIds: [SAVE],
        worldState: {
          pendingEvents: [
            { saveId: SAVE, kind: 'leave' },
            { saveId: 'another-save', kind: 'keep' },
          ],
        },
        accessState: 'active',
      },
      {
        id: UNRELATED_CAMPAIGN,
        name: 'Unrelated',
        settlementIds: [],
        worldState: { pendingEvents: [] },
        accessState: 'active',
      },
    ],
    savedSettlements: [{
      id: SAVE,
      name: 'Existing',
      settlement: { name: 'Existing', privateFact: 'preserve' },
      accessState: 'active',
    }],
  };
}

function harness(initial = stateFixture()) {
  let state = initial;
  return {
    get: () => state,
    set: (recipe) => {
      recipe(state);
    },
    read: () => state,
    replace: next => { state = next; },
  };
}

function attachCommand() {
  return {
    commandId: 'cmd:import-reconciliation:attach',
    kind: 'import.campaign.attach-existing',
    targets: { campaignId: TARGET, saveId: SAVE },
    expected: {
      sourceFingerprint: CHECKSUM,
      membershipCampaignIds: [OLD_CAMPAIGN],
    },
    correlation: { importSessionId: 'irs:source:target' },
    params: {
      membershipPolicy: 'exclusive-rehome',
      preserveExistingSettlement: true,
    },
    requestedAt: '2026-07-24T12:00:00.000Z',
  };
}

function createCommand() {
  return {
    commandId: 'cmd:import-reconciliation:create',
    kind: 'import.settlement.create-and-attach',
    targets: { campaignId: TARGET, saveId: CREATED },
    expected: {
      sourceFingerprint: CHECKSUM,
      membershipCampaignIds: [],
    },
    correlation: { importSessionId: 'irs:source:target' },
    params: {
      entry: {
        name: 'Imported',
        tier: 'town',
        settlement: {
          name: 'Imported',
          importedFrom: {
            source: 'account-export',
            sourceChecksum: CHECKSUM,
            sourceId: 'source-save',
          },
        },
        aiData: {},
        campaignState: { phase: 'draft', eventLog: [] },
        versionHistory: [],
      },
    },
    requestedAt: '2026-07-24T12:00:00.000Z',
  };
}

function remoteApplied(command) {
  const saveId = command.targets?.saveId || command.saveId;
  const campaignId = command.targets?.campaignId || command.campaignId;
  const entry = command.params?.entry || command.entry;
  return {
    status: 'applied',
    replayed: false,
    fingerprint: 'f'.repeat(64),
    saveRow: command.kind === 'import.settlement.create-and-attach'
      ? {
          ...entry,
          id: saveId,
          accessState: 'active',
        }
      : null,
    campaignRows: [
      {
        id: TARGET,
        name: 'Target',
        settlementIds: [saveId],
        accessState: 'active',
      },
      {
        id: OLD_CAMPAIGN,
        name: 'Old',
        settlementIds: [],
        accessState: 'active',
      },
    ],
    receipt: {
      membershipPolicy: 'exclusive-rehome',
      campaignId,
      saveId,
    },
  };
}

beforeEach(() => {
  dependencies.backend = 'server';
  dependencies.commit.mockReset();
  dependencies.campaignCache.mockReset();
  dependencies.campaignUpsert.mockReset();
  dependencies.campaignWriteAll.mockReset();
  dependencies.savesMutateBatch.mockReset();
  dependencies.campaignUpsert.mockResolvedValue(undefined);
  dependencies.campaignWriteAll.mockResolvedValue(undefined);
  dependencies.savesMutateBatch.mockResolvedValue(undefined);
});

describe('import reconciliation command transaction', () => {
  test('projects the atomic server result and never invokes legacy writers', async () => {
    const command = attachCommand();
    dependencies.commit.mockResolvedValue(remoteApplied(command));
    const store = harness();
    const beforeSave = structuredClone(store.read().savedSettlements[0]);

    const result = await runImportReconciliationCommandTransaction({
      set: store.set,
      get: store.get,
      command,
    });

    expect(result).toMatchObject({
      ok: true,
      status: 'applied',
      persistenceState: 'confirmed',
      result: { mode: 'server-atomic', projection: 'applied' },
    });
    expect(dependencies.commit).toHaveBeenCalledWith(expect.objectContaining({
      ownerId: OWNER,
      commandId: command.commandId,
      expectedMembershipCampaignIds: [OLD_CAMPAIGN],
      entry: null,
    }));
    expect(dependencies.campaignWriteAll).not.toHaveBeenCalled();
    expect(dependencies.campaignUpsert).not.toHaveBeenCalled();
    expect(dependencies.savesMutateBatch).not.toHaveBeenCalled();
    expect(store.read().savedSettlements[0]).toEqual(beforeSave);
    expect(store.read().campaigns.find(item => item.id === TARGET).settlementIds)
      .toEqual([SAVE]);
    expect(store.read().campaigns.find(item => item.id === OLD_CAMPAIGN).settlementIds)
      .toEqual([]);
  });

  test('refuses configured offline work without touching any authority', async () => {
    dependencies.backend = 'offline';
    const store = harness();
    const before = structuredClone(store.read());
    const result = await runImportReconciliationCommandTransaction({
      set: store.set,
      get: store.get,
      command: attachCommand(),
    });

    expect(result).toMatchObject({
      ok: false,
      reason: 'offline_authoritative_commit_required',
      persistenceState: 'not-committed',
    });
    expect(store.read()).toEqual(before);
    expect(dependencies.commit).not.toHaveBeenCalled();
    expect(dependencies.campaignWriteAll).not.toHaveBeenCalled();
    expect(dependencies.campaignUpsert).not.toHaveBeenCalled();
    expect(dependencies.savesMutateBatch).not.toHaveBeenCalled();
  });

  test('defers projection when the owner rotates after a confirmed server commit', async () => {
    let release;
    dependencies.commit.mockImplementation(command => new Promise((resolve) => {
      release = () => resolve(remoteApplied(command));
    }));
    const store = harness();
    const pending = runImportReconciliationCommandTransaction({
      set: store.set,
      get: store.get,
      command: attachCommand(),
    });
    store.read().auth.user.id = OTHER_OWNER;
    store.read().campaignSessionGeneration += 1;
    store.read().savedSettlementsOwnerId = OTHER_OWNER;
    store.read().savedSettlementsHydrationGeneration += 1;
    release();
    const result = await pending;

    expect(result).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      reason: 'local_projection_changed_after_commit',
      persistenceState: 'confirmed',
      result: { mode: 'server-atomic', projection: 'deferred' },
    });
    expect(store.read().campaigns.find(item => item.id === TARGET).settlementIds)
      .toEqual([]);
  });

  test('rejects a saved-settlement cache owned by another account before transport', async () => {
    const state = stateFixture();
    state.savedSettlementsOwnerId = OTHER_OWNER;
    const store = harness(state);
    const result = await runImportReconciliationCommandTransaction({
      set: store.set,
      get: store.get,
      command: attachCommand(),
    });

    expect(result).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'owner_session_changed',
    });
    expect(dependencies.commit).not.toHaveBeenCalled();
  });

  test('labels local-only create-and-attach as a recoverable saga', async () => {
    dependencies.backend = 'local-only';
    const command = createCommand();
    const store = harness();
    const result = await runImportReconciliationCommandTransaction({
      set: store.set,
      get: store.get,
      command,
    });

    expect(result).toMatchObject({
      ok: true,
      status: 'applied',
      persistenceState: 'local-confirmed',
      result: {
        mode: 'local-recoverable-saga',
        projection: 'applied',
      },
    });
    expect(dependencies.savesMutateBatch).toHaveBeenCalledWith({
      creates: [expect.objectContaining({ id: CREATED, name: 'Imported' })],
    }, expect.objectContaining({ expectedOwnerId: OWNER }));
    expect(dependencies.campaignWriteAll).not.toHaveBeenCalled();
    expect(dependencies.campaignUpsert).toHaveBeenCalledTimes(1);
    expect(dependencies.campaignUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ id: TARGET, settlementIds: [CREATED] }),
      OWNER,
      expect.any(Function),
    );
    expect(store.read().savedSettlements.some(save => save.id === CREATED))
      .toBe(true);
    expect(store.read().campaigns.find(item => item.id === TARGET).settlementIds)
      .toEqual([CREATED]);
  });

  test('preserves an unrelated campaign edited while a local save is created', async () => {
    dependencies.backend = 'local-only';
    let releaseSaveCreation;
    dependencies.savesMutateBatch.mockImplementationOnce(() => new Promise((resolve) => {
      releaseSaveCreation = resolve;
    }));
    const store = harness();
    let persistedCampaigns = structuredClone(store.read().campaigns);
    dependencies.campaignUpsert.mockImplementation(async (nextCampaign) => {
      persistedCampaigns = persistedCampaigns.map(campaign => (
        campaign.id === nextCampaign.id
          ? structuredClone(nextCampaign)
          : campaign
      ));
    });
    const pending = runImportReconciliationCommandTransaction({
      set: store.set,
      get: store.get,
      command: createCommand(),
    });

    const concurrentUnrelatedCampaign = {
      ...store.read().campaigns.find(
        campaign => campaign.id === UNRELATED_CAMPAIGN,
      ),
      name: 'Edited while importing',
      updatedAt: '2026-07-24T12:00:01.000Z',
    };
    store.read().campaigns = store.read().campaigns.map(campaign => (
      campaign.id === UNRELATED_CAMPAIGN
        ? concurrentUnrelatedCampaign
        : campaign
    ));
    persistedCampaigns = persistedCampaigns.map(campaign => (
      campaign.id === UNRELATED_CAMPAIGN
        ? structuredClone(concurrentUnrelatedCampaign)
        : campaign
    ));
    releaseSaveCreation();
    const result = await pending;

    expect(result).toMatchObject({
      ok: true,
      status: 'applied',
      result: {
        mode: 'local-recoverable-saga',
        projection: 'applied',
      },
    });
    expect(dependencies.campaignWriteAll).not.toHaveBeenCalled();
    expect(dependencies.campaignUpsert).toHaveBeenCalledTimes(1);
    expect(dependencies.campaignUpsert.mock.calls[0][0])
      .toMatchObject({ id: TARGET, settlementIds: [CREATED] });
    expect(dependencies.campaignUpsert.mock.calls[0][0].id)
      .not.toBe(UNRELATED_CAMPAIGN);
    expect(store.read().campaigns.find(
      campaign => campaign.id === UNRELATED_CAMPAIGN,
    )).toMatchObject({
      name: 'Edited while importing',
      updatedAt: '2026-07-24T12:00:01.000Z',
    });
    expect(persistedCampaigns.find(
      campaign => campaign.id === UNRELATED_CAMPAIGN,
    )).toMatchObject({
      name: 'Edited while importing',
      updatedAt: '2026-07-24T12:00:01.000Z',
    });
  });

  test('compensates a local create when campaign persistence fails', async () => {
    dependencies.backend = 'local-only';
    dependencies.campaignUpsert
      .mockRejectedValueOnce(new Error('campaign quota'))
      .mockResolvedValueOnce(undefined);
    const store = harness();

    await expect(runImportReconciliationCommandTransaction({
      set: store.set,
      get: store.get,
      command: createCommand(),
    })).rejects.toThrow(/campaign quota/i);
    expect(dependencies.savesMutateBatch).toHaveBeenNthCalledWith(
      2,
      { deletes: [CREATED] },
      expect.objectContaining({ expectedOwnerId: OWNER }),
    );
    expect(dependencies.campaignUpsert).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ id: TARGET, settlementIds: [] }),
      OWNER,
      expect.any(Function),
    );
    expect(dependencies.campaignWriteAll).not.toHaveBeenCalled();
    expect(store.read().savedSettlements.some(save => save.id === CREATED))
      .toBe(false);
  });
});
