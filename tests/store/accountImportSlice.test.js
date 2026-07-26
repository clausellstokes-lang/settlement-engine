/**
 * tests/store/accountImportSlice.test.js — the WRITE half of "Import my data".
 *
 * Exercises the CLIENT contract of importAccountData over the server-authoritative
 * add-save seam (mocked savesService.save mints fresh ids; the real 014 trigger
 * is the authoritative gate in production):
 *   • rejects a malformed / wrong-version file (fail-closed, no writes)
 *   • IGNORES an embedded foreign user_id — ownership is remapped (no owner field
 *     ever reaches the imported save envelope)
 *   • mints FRESH ids per record → additive, never clobbers an existing save
 *   • respects the save cap (partial-with-notice)
 *   • premium-gates campaign import
 *   • attempts same-owner cleanup after a mid-batch save failure and reports
 *     any rows it could not remove
 *   • round-trip: a buildAccountExport snapshot imports back under the new user
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Fresh, monotonic server ids — proves no collision with existing saves and that
// the importer never reuses an embedded id.
let idSeq = 0;
const saveMock = vi.fn(() => Promise.resolve(`fresh-${++idSeq}`));
const deleteMock = vi.fn(() => Promise.resolve());
vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    save: (...a) => saveMock(...a),
    delete: (...a) => deleteMock(...a),
    update: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { createAccountImportSlice } from '../../src/store/accountImportSlice.js';
import { buildAccountExport, ACCOUNT_EXPORT_VERSION } from '../../src/lib/accountData.js';
import {
  makeCampaignContentBinding,
  makeContentEnvironmentRevision,
} from '../../src/domain/content/contentEnvironment.js';
import {
  buildCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  buildSettlementContentProvenance,
} from '../../src/domain/content/settlementContentProvenance.js';

/** Minimal store: import slice + the auth/library/campaign seams it reads. */
function makeStore(extra = {}) {
  return create(immer((set, get, api) => ({
    auth: { user: { id: 'IMPORTER-ID' }, tier: 'premium', role: 'user' },
    campaignSessionGeneration: 0,
    savedSettlements: [],
    campaigns: [],
    customContent: { institutions: [] },
    canSave: () => true,
    canUseCustomContent: () => true,
    maxSaves: () => Infinity,
    applyCustomContentCommand: vi.fn(async request => ({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
      perEntry: request.entries.map((entry, index) => ({
        definitionId: `definition-${index}`,
        revisionId: `revision-${index}`,
        status: 'created',
        category: entry.category,
        packEntryId: entry.packEntryId,
      })),
    })),
    importCustomContentArchive: vi.fn(async archive => ({
      ok: true,
      status: 'applied',
      persistence: {
        state: 'confirmed',
        authority: 'supabase-transaction',
      },
      counts: {
        definitions: archive.ledger.definitions.length,
        revisions: archive.ledger.revisions.length,
      },
      identityMap: {
        definitionIds: archive.ledger.definitions.map((definition, index) => ({
          sourceId: definition.id,
          destinationId: `definition-${index}`,
        })),
        revisionIds: archive.ledger.revisions.map((revision, index) => ({
          sourceId: revision.id,
          destinationId: `revision-${index}`,
          destinationContentHash: contentRevisionHash(
            revision.category,
            {
              ...revision.data,
              localUid: `lu_import_${archive.ledger.definitions.findIndex(
                definition => definition.id === revision.definitionId,
              )}`,
            },
          ),
        })),
        localUids: archive.ledger.definitions.map((definition, index) => ({
          sourceId: definition.localUid,
          destinationId: `lu_import_${index}`,
        })),
        packIds: [],
        environmentIds: [],
        environmentRevisionIds: [],
      },
    })),
    // The production action persists the final imported envelope before
    // exposing it. This isolated slice mock keeps the same receipt contract.
    createImportedCampaign: vi.fn(async (name, initial = {}) => {
      const id = `camp-${++idSeq}`;
      set(state => {
        state.campaigns.unshift({
          id,
          name,
          settlementIds: [...(initial.settlementIds || [])],
          contentBinding: initial.contentBinding || null,
          contentBindingHistory: initial.contentBindingHistory || [],
        });
      });
      return {
        ok: true,
        status: 'applied',
        campaignId: id,
        persistence: { state: 'confirmed' },
      };
    }),
    ...createAccountImportSlice(set, get, api),
    ...extra,
  })));
}

const fileFor = (over = {}) => JSON.stringify({
  version: ACCOUNT_EXPORT_VERSION,
  exportedAt: 'now',
  profile: { displayName: 'Hostile Exporter', tier: 'premium' },
  settlements: [],
  campaigns: [],
  ...over,
});

const SETTLEMENT = (name = 'Old Harbor') => ({
  id: 'EMBEDDED-OLD-ID',
  user_id: 'SOMEONE-ELSES-USER-ID',
  name,
  tier: 'town',
  settlement: { name, tier: 'town' },
});

function fullContentArchive(currentContent, historicalContent) {
  const definitionId = currentContent.definitionId;
  const currentData = {
    name: currentContent.name,
    localUid: currentContent.localUid,
  };
  const historicalData = {
    name: historicalContent.name,
    localUid: historicalContent.localUid,
  };
  const currentHash = contentRevisionHash('institutions', currentData);
  const historicalHash = contentRevisionHash(
    'institutions',
    historicalData,
  );
  const archivedData = {
    name: 'Archived Toll House',
    localUid: 'lu_archived_toll_house',
  };
  const archivedHash = contentRevisionHash('institutions', archivedData);
  const environment = makeContentEnvironmentRevision({
    environmentId: 'source-environment',
    environmentRevisionId: 'source-environment-r1',
    source: 'account',
    directDefinitions: [{
      definitionId,
      revisionId: currentContent.revisionId,
      contentHash: currentHash,
      category: 'institutions',
    }],
    tunables: { priorityEconomy: 63 },
    visualSelection: {},
    createdAt: '2026-07-25T00:00:00.000Z',
  });
  return buildCustomContentArchive({
    schemaVersion: 1,
    definitions: {
      [definitionId]: {
        id: definitionId,
        category: 'institutions',
        localUid: currentContent.localUid,
        headRevisionId: currentContent.revisionId,
        archivedAt: null,
        createdAt: '2026-07-24T00:00:00.000Z',
        updatedAt: '2026-07-25T00:00:00.000Z',
      },
      'z-source-archived-toll-house': {
        id: 'z-source-archived-toll-house',
        category: 'institutions',
        localUid: archivedData.localUid,
        headRevisionId: 'z-source-archived-toll-house-r1',
        archivedAt: '2026-07-25T00:00:00.000Z',
        createdAt: '2026-07-23T00:00:00.000Z',
        updatedAt: '2026-07-25T00:00:00.000Z',
      },
    },
    revisions: {
      [historicalContent.revisionId]: {
        id: historicalContent.revisionId,
        definitionId,
        category: 'institutions',
        revisionNumber: 1,
        parentRevisionId: null,
        contentHash: historicalHash,
        data: historicalData,
        createdAt: '2026-07-24T00:00:00.000Z',
      },
      [currentContent.revisionId]: {
        id: currentContent.revisionId,
        definitionId,
        category: 'institutions',
        revisionNumber: 2,
        parentRevisionId: historicalContent.revisionId,
        contentHash: currentHash,
        data: currentData,
        createdAt: '2026-07-25T00:00:00.000Z',
      },
      'z-source-archived-toll-house-r1': {
        id: 'z-source-archived-toll-house-r1',
        definitionId: 'z-source-archived-toll-house',
        category: 'institutions',
        revisionNumber: 1,
        parentRevisionId: null,
        contentHash: archivedHash,
        data: archivedData,
        createdAt: '2026-07-23T00:00:00.000Z',
      },
    },
    packs: {},
    activePacks: {},
    packEntryDefinitions: {},
    packVersionEntries: {},
    environments: {
      [environment.environmentRevisionId]: environment,
    },
    activeEnvironmentRevisionId: environment.environmentRevisionId,
    commandReceipts: {
      'source-command-1': {
        fingerprint: 'a'.repeat(64),
        receipt: { status: 'applied', reason: null },
      },
    },
  }, {
    sourceKey: 'USER-A',
    sourceType: 'cloud',
    exportedAt: '2026-07-25T00:00:00.000Z',
  });
}

beforeEach(() => {
  idSeq = 0;
  saveMock.mockReset();
  saveMock.mockImplementation(() => Promise.resolve(`fresh-${++idSeq}`));
  deleteMock.mockReset();
  deleteMock.mockResolvedValue();
});

describe('importAccountData — gating + fail-closed', () => {
  test('blocks anon / no-save tiers outright', async () => {
    const store = makeStore({ auth: { user: null }, canSave: () => false });
    const res = await store.getState().importAccountData(fileFor({ settlements: [SETTLEMENT()] }));
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/sign in or upgrade/i);
    expect(saveMock).not.toHaveBeenCalled();
  });

  test('rejects a malformed file with no writes', async () => {
    const store = makeStore();
    const res = await store.getState().importAccountData('not json {');
    expect(res.ok).toBe(false);
    expect(saveMock).not.toHaveBeenCalled();
  });

  test('rejects a newer-version file with no writes', async () => {
    const store = makeStore();
    const res = await store.getState().importAccountData(fileFor({ version: ACCOUNT_EXPORT_VERSION + 1 }));
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/newer version/i);
    expect(saveMock).not.toHaveBeenCalled();
  });
});

describe('importAccountData — ownership + fresh ids', () => {
  test('ignores embedded foreign user_id / id; no owner field reaches save', async () => {
    const store = makeStore();
    await store.getState().importAccountData(fileFor({ settlements: [SETTLEMENT(), SETTLEMENT('Far Reach')] }));

    expect(saveMock).toHaveBeenCalledTimes(2);
    for (const [entry] of saveMock.mock.calls) {
      expect(entry).not.toHaveProperty('id');
      expect(entry).not.toHaveProperty('user_id');
      expect(JSON.stringify(entry)).not.toMatch(/SOMEONE-ELSES-USER-ID|EMBEDDED-OLD-ID/);
    }
  });

  test('an A to B switch mid-batch cannot write later rows or land A rows in B state', async () => {
    let resolveFirst;
    saveMock.mockImplementationOnce(() => new Promise(resolve => {
      resolveFirst = resolve;
    }));
    deleteMock.mockRejectedValueOnce(
      Object.assign(new Error('owner mismatch'), { code: 'auth_session_changed' }),
    );
    const store = makeStore();
    const importing = store.getState().importAccountData(fileFor({
      settlements: [SETTLEMENT('A One'), SETTLEMENT('A Two')],
      campaigns: [{ id: 'realm-a', name: 'A Realm', settlementIds: ['EMBEDDED-OLD-ID'] }],
    }));

    await vi.waitFor(() => expect(saveMock).toHaveBeenCalledTimes(1));
    const [, saveOptions] = saveMock.mock.calls[0];
    expect(saveOptions.expectedOwnerId).toBe('IMPORTER-ID');

    store.setState({
      auth: { user: { id: 'OWNER-B' }, tier: 'premium', role: 'user' },
      campaignSessionGeneration: 1,
    });
    expect(saveOptions.isSessionCurrent()).toBe(false);
    resolveFirst('fresh-a-1');

    const res = await importing;
    expect(res.ok).toBe(false);
    expect(res).toMatchObject({
      previousAccountSaveCount: 1,
      error: expect.stringMatching(/remains? in the previous account/i),
    });
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(deleteMock).not.toHaveBeenCalled();
    expect(store.getState().savedSettlements).toEqual([]);
    expect(store.getState().campaigns).toEqual([]);
  });

  test('mints fresh ids — additive, never clobbers an existing save', async () => {
    const store = makeStore({ savedSettlements: [{ id: 'pre-existing', name: 'Existing' }] });
    const res = await store.getState().importAccountData(fileFor({ settlements: [SETTLEMENT(), SETTLEMENT('Far Reach')] }));

    expect(res.ok).toBe(true);
    expect(res.settlementsImported).toBe(2);
    const ids = store.getState().savedSettlements.map(s => s.id);
    // Pre-existing save still present; new ones are distinct (no collision).
    expect(ids).toContain('pre-existing');
    expect(new Set(ids).size).toBe(ids.length);
    expect(store.getState().savedSettlements).toHaveLength(3);
  });
});

describe('importAccountData — tier / save-limit gate', () => {
  test('imports up to the remaining slots and skips the rest (partial-with-notice)', async () => {
    const store = makeStore({
      auth: { user: { id: 'IMPORTER-ID' }, tier: 'free', role: 'user' },
      savedSettlements: [{ id: 'a' }, { id: 'b' }], // 2 used of 3
      maxSaves: () => 3,
    });
    const res = await store.getState().importAccountData(fileFor({
      settlements: [SETTLEMENT('One'), SETTLEMENT('Two'), SETTLEMENT('Three')],
    }));

    expect(res.ok).toBe(true);
    expect(res.overLimit).toBe(true);
    expect(res.settlementsImported).toBe(1); // only 1 slot remained
    expect(res.settlementsSkipped).toHaveLength(2);
    expect(res.settlementsSkipped.every(s => /limit/i.test(s.reason))).toBe(true);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  test('surfaces a server cap error and rolls back this batch', async () => {
    const store = makeStore();
    // First insert succeeds; the second throws the server cap message.
    saveMock
      .mockResolvedValueOnce('fresh-1')
      .mockRejectedValueOnce(new Error('save limit reached for your plan'));
    const res = await store.getState().importAccountData(fileFor({
      settlements: [SETTLEMENT('One'), SETTLEMENT('Two')],
    }));

    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/save limit reached/i);
    // The mocked same-owner cleanup removed the one landed row.
    expect(deleteMock).toHaveBeenCalledWith('fresh-1', 'IMPORTER-ID');
    expect(store.getState().savedSettlements).toHaveLength(0);
  });
});

describe('importAccountData — campaigns', () => {
  test('premium remaps settlementIds through oldId→newId', async () => {
    const store = makeStore();
    const res = await store.getState().importAccountData(fileFor({
      settlements: [{ ...SETTLEMENT('Member A'), id: 'old-a' }, { ...SETTLEMENT('Member B'), id: 'old-b' }],
      campaigns: [{ id: 'old-camp', name: 'My Realm', settlementIds: ['old-a', 'old-b', 'not-imported'] }],
    }));

    expect(res.ok).toBe(true);
    expect(res.campaignsImported).toBe(1);
    const camp = store.getState().campaigns[0];
    expect(camp.name).toMatch(/imported/i);
    // Remapped to the fresh ids; the un-imported member is dropped.
    expect(camp.settlementIds).toHaveLength(2);
    expect(camp.settlementIds.every(id => id.startsWith('fresh-'))).toBe(true);
  });

  test('non-premium skips campaigns with a notice', async () => {
    const store = makeStore({
      auth: { user: { id: 'IMPORTER-ID' }, tier: 'free', role: 'user' },
    });
    const res = await store.getState().importAccountData(fileFor({
      settlements: [SETTLEMENT()],
      campaigns: [{ id: 'c', name: 'Realm', settlementIds: [] }],
    }));

    expect(res.ok).toBe(true);
    expect(res.campaignsImported).toBe(0);
    expect(res.campaignsSkipped).toHaveLength(1);
    expect(res.campaignsSkipped[0].reason).toMatch(/premium/i);
  });

  test('re-namespaces a valid portable campaign binding and its history', async () => {
    const priorBinding = makeCampaignContentBinding({
      institutions: [{
        name: 'Old Glassworks',
        localUid: 'lu_glassworks_old',
      }],
    });
    const contentBinding = makeCampaignContentBinding({
      institutions: [{
        name: 'Haunted Glassworks',
        localUid: 'lu_glassworks',
      }],
    });
    const store = makeStore();
    const res = await store.getState().importAccountData(fileFor({
      campaigns: [{
        id: 'old-camp',
        name: 'Bound Realm',
        settlementIds: [],
        contentBinding,
        contentBindingHistory: [priorBinding],
      }],
    }));

    expect(res.ok).toBe(true);
    expect(res.campaignContentWarnings).toEqual([]);
    const imported = store.getState().campaigns[0];
    expect(imported.contentBinding.bindingHash)
      .not.toBe(contentBinding.bindingHash);
    expect(imported.contentBindingHistory[0].bindingHash)
      .not.toBe(priorBinding.bindingHash);
    expect(imported.contentBinding.resolvedDefinitions[0].data.name)
      .toBe('Haunted Glassworks');
    expect(imported.contentBindingHistory[0].resolvedDefinitions[0].data.name)
      .toBe('Old Glassworks');
    expect(JSON.stringify({
      current: imported.contentBinding.environment.directDefinitions,
      history: imported.contentBindingHistory[0].environment.directDefinitions,
    })).not.toMatch(/lu_glassworks(?:_old)?|legacy-revision/);
  });
});

describe('importAccountData — export→import round-trip', () => {
  test('a buildAccountExport snapshot restores under the new user', async () => {
    const currentContent = {
      name: 'Haunted Glassworks',
      localUid: 'lu_glassworks',
      definitionId: 'source-definition-glassworks',
      revisionId: 'source-revision-glassworks-2',
    };
    const historicalContent = {
      ...currentContent,
      name: 'Old Glassworks',
      revisionId: 'source-revision-glassworks-1',
    };
    const historicalBinding = makeCampaignContentBinding({
      institutions: [historicalContent],
    });
    const currentBinding = makeCampaignContentBinding({
      institutions: [currentContent],
    });
    const customContentArchive = fullContentArchive(
      currentContent,
      historicalContent,
    );
    const harborSettlement = {
      name: 'Harbor',
      tier: 'town',
      institutions: [{
        name: currentContent.name,
        source: 'custom',
        customDefinitionId: currentContent.definitionId,
      }],
    };
    harborSettlement.customContentProvenance =
      buildSettlementContentProvenance(
        harborSettlement,
        {
          institutions: [{
            ...currentContent,
            contentHash:
              currentBinding.resolvedDefinitions[0].contentHash,
          }],
        },
        {
          scope: 'campaign',
          environment: currentBinding.environment,
          bindingHash: currentBinding.bindingHash,
        },
      );
    // Author "user A"'s export, then import it as "user B".
    const exported = buildAccountExport({
      auth: { user: { id: 'USER-A', email: 'a@x.test' }, displayName: 'A', tier: 'premium' },
      savedSettlements: [
        { id: 'a-1', user_id: 'USER-A', name: 'Harbor', tier: 'town', settlement: harborSettlement },
        { id: 'a-2', user_id: 'USER-A', name: 'Ridge', tier: 'village', settlement: { name: 'Ridge', tier: 'village' } },
      ],
      campaigns: [{
        id: 'a-camp',
        name: 'Saga',
        settlementIds: ['a-1', 'a-2'],
        contentBinding: currentBinding,
        contentBindingHistory: [historicalBinding],
      }],
      customContent: {
        institutions: [currentContent],
      },
      customContentArchive,
    });

    const store = makeStore(); // importer = "user B" (IMPORTER-ID)
    const res = await store.getState().importAccountData(JSON.stringify(exported));

    expect(res.ok).toBe(true);
    expect(res.settlementsImported).toBe(2);
    expect(res.campaignsImported).toBe(1);
    expect(res.customContentImported).toBe(2);
    expect(store.getState().importCustomContentArchive).toHaveBeenCalledWith(
      expect.objectContaining({
        archiveFingerprint: customContentArchive.archiveFingerprint,
        ledger: expect.objectContaining({
          definitions: expect.arrayContaining([
            expect.objectContaining({
              id: 'z-source-archived-toll-house',
              archivedAt: expect.any(String),
            }),
          ]),
          revisions: expect.arrayContaining([
            expect.objectContaining({
              id: 'source-revision-glassworks-1',
            }),
            expect.objectContaining({
              id: 'source-revision-glassworks-2',
            }),
          ]),
          environments: [
            expect.objectContaining({
              environmentRevisionId: 'source-environment-r1',
              tunables: { priorityEconomy: 63 },
            }),
          ],
          activeEnvironmentRevisionId: 'source-environment-r1',
          commandReceipts: [
            expect.objectContaining({ commandId: 'source-command-1' }),
          ],
        }),
      }),
      { purpose: 'account-import' },
    );
    expect(
      store.getState().importCustomContentArchive.mock.invocationCallOrder[0],
    ).toBeLessThan(saveMock.mock.invocationCallOrder[0]);
    expect(store.getState().applyCustomContentCommand).not.toHaveBeenCalled();
    // Data restored, but under fresh ids owned by the importer — no USER-A leak.
    const names = store.getState().savedSettlements.map(s => s.name);
    expect(names).toEqual(expect.arrayContaining(['Harbor', 'Ridge']));
    expect(JSON.stringify(store.getState().savedSettlements)).not.toMatch(/USER-A|a-1|a-2/);
    const camp = store.getState().campaigns[0];
    expect(camp.settlementIds).toHaveLength(2);
    expect(camp.settlementIds.every(id => id.startsWith('fresh-'))).toBe(true);
    expect(camp.contentBinding.resolvedDefinitions[0]).toMatchObject({
      definitionId: 'definition-0',
      revisionId: 'revision-1',
      data: { name: 'Haunted Glassworks' },
    });
    expect(camp.contentBindingHistory[0].resolvedDefinitions[0]).toMatchObject({
      definitionId: 'definition-0',
      data: { name: 'Old Glassworks' },
    });
    expect(camp.contentBindingHistory[0].resolvedDefinitions[0].revisionId)
      .toBe('revision-0');
    expect(JSON.stringify({
      active: camp.contentBinding.environment.directDefinitions,
      history: camp.contentBindingHistory[0].environment.directDefinitions,
    })).not.toMatch(
      /source-definition-glassworks|source-revision-glassworks/,
    );
    const harbor = store.getState().savedSettlements.find(
      settlement => settlement.name === 'Harbor',
    );
    expect(harbor.settlement.customContentProvenance).toMatchObject({
      scope: 'campaign',
      bindingHash: camp.contentBinding.bindingHash,
      environment: {
        environmentId: camp.contentBinding.environment.environmentId,
        environmentRevisionId:
          camp.contentBinding.environment.environmentRevisionId,
        environmentHash: camp.contentBinding.environment.environmentHash,
      },
      materializedDefinitions: [{
        definitionId: 'definition-0',
        revisionId: 'revision-1',
        localUid: 'lu_import_0',
        contentHash:
          camp.contentBinding.resolvedDefinitions[0].contentHash,
      }],
    });
    expect(harbor.settlement.customContentProvenance.receiptHash)
      .not.toBe(harborSettlement.customContentProvenance.receiptHash);
  });

  test('stops before dependent writes when the archive command is not confirmed', async () => {
    const currentContent = {
      name: 'Unlanded Hall',
      localUid: 'lu_unlanded_hall',
      definitionId: 'source-unlanded-hall',
      revisionId: 'source-unlanded-hall-r2',
    };
    const historicalContent = {
      ...currentContent,
      name: 'Earlier Unlanded Hall',
      revisionId: 'source-unlanded-hall-r1',
    };
    const binding = makeCampaignContentBinding({
      institutions: [currentContent],
    });
    const settlement = {
      name: 'Detached Harbor',
      tier: 'town',
      institutions: [{
        name: currentContent.name,
        source: 'custom',
        customDefinitionId: currentContent.definitionId,
      }],
    };
    settlement.customContentProvenance =
      buildSettlementContentProvenance(
        settlement,
        {
          institutions: [{
            ...currentContent,
            contentHash: binding.resolvedDefinitions[0].contentHash,
          }],
        },
        {
          scope: 'campaign',
          environment: binding.environment,
          bindingHash: binding.bindingHash,
        },
      );
    const exported = buildAccountExport({
      auth: {
        user: { id: 'USER-A', email: 'a@x.test' },
        tier: 'premium',
      },
      savedSettlements: [{
        id: 'source-save',
        name: settlement.name,
        tier: settlement.tier,
        settlement,
      }],
      campaigns: [],
      customContent: { institutions: [currentContent] },
      customContentArchive: fullContentArchive(
        currentContent,
        historicalContent,
      ),
    });
    const store = makeStore({
      importCustomContentArchive: vi.fn().mockResolvedValue({
        ok: false,
        status: 'reconcile-required',
        reason: 'archive_response_ambiguous',
      }),
    });

    const result =
      await store.getState().importAccountData(JSON.stringify(exported));

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(
      /archive_response_ambiguous.*no dependent settlements or campaigns were imported/i,
    );
    expect(result.customContentSkipped).toEqual([
      expect.objectContaining({ reason: 'archive_response_ambiguous' }),
    ]);
    expect(saveMock).not.toHaveBeenCalled();
    expect(store.getState().savedSettlements).toEqual([]);
    expect(store.getState().campaigns).toEqual([]);
  });
});
