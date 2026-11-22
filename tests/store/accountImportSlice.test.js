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
const updateMock = vi.fn(() => Promise.resolve());
vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    save: (...a) => saveMock(...a),
    delete: (...a) => deleteMock(...a),
    update: (...a) => updateMock(...a),
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
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
// DEF-4 drives the real UNDO writer rather than reasoning about it: this is the
// function that assigns and persists a snapshot's settlement.
import { revertToSnapshotAction } from '../../src/store/settlementVersionHistoryActions.js';

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
  updateMock.mockReset();
  updateMock.mockResolvedValue();
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

  test('keeps imported campaigns fresh instead of smuggling source-world envoy authority', async () => {
    const sourceWorldState = {
      tick: 91,
      simulationRules: {
        warLayerEnabled: true,
        warTerminationEnabled: true,
        peaceEngineEnabled: true,
        envoyDiplomacyEnabled: true,
        npcConsequencesEnabled: true,
        routeLifecycleEnabled: true,
      },
      relationshipStates: {
        'source-war-edge': { relationshipType: 'hostile' },
      },
      deployments: {
        'old-a': { targetId: 'old-b', sinceTick: 40, role: 'siege' },
      },
      envoyErrands: [{
        id: 'source-envoy-authority',
        npcId: 'source-npc',
        from: 'old-a',
        to: 'old-b',
        state: 'returning',
      }],
    };
    const store = makeStore();

    const res = await store.getState().importAccountData(fileFor({
      settlements: [
        { ...SETTLEMENT('Member A'), id: 'old-a' },
        { ...SETTLEMENT('Member B'), id: 'old-b' },
      ],
      campaigns: [{
        id: 'old-camp',
        name: 'Source War Realm',
        settlementIds: ['old-a', 'old-b'],
        worldState: sourceWorldState,
        regionalGraph: {
          edges: [{ id: 'source-war-edge', from: 'old-a', to: 'old-b' }],
        },
      }],
    }));

    expect(res.ok).toBe(true);
    expect(res.campaignsImported).toBe(1);
    const [, importedInitial] = store.getState().createImportedCampaign.mock.calls[0];
    expect(importedInitial.settlementIds).toEqual(['fresh-1', 'fresh-2']);
    expect(importedInitial).not.toHaveProperty('worldState');
    expect(importedInitial).not.toHaveProperty('regionalGraph');
    expect(JSON.stringify(store.getState().campaigns[0]))
      .not.toMatch(/source-envoy-authority|source-war-edge|source-npc/);
  });

  test('remaps a child parentRef when both campaign members import', async () => {
    const sourceRef = {
      version: 1,
      parentId: 'old-parent',
      sourceSatelliteId: 'satellite-11',
      foundedTick: 80,
      graduatedTick: 96,
      birthId: 'birth-11',
      futureEvidence: { charter: 'kept' },
    };
    const store = makeStore();
    const res = await store.getState().importAccountData(fileFor({
      settlements: [
        { ...SETTLEMENT('Parent'), id: 'old-parent' },
        {
          ...SETTLEMENT('Child'),
          id: 'old-child',
          settlement: { name: 'Child', tier: 'village', parentRef: sourceRef },
        },
      ],
      campaigns: [{ id: 'old-camp', name: 'Lineage Realm', settlementIds: ['old-parent', 'old-child'] }],
    }));

    expect(res.ok).toBe(true);
    const child = store.getState().savedSettlements.find(s => s.name === 'Child');
    expect(child.settlement.parentRef).toEqual({ ...sourceRef, parentId: 'fresh-1' });
    expect(updateMock).toHaveBeenCalledWith(
      'fresh-2',
      { settlement: expect.objectContaining({ parentRef: { ...sourceRef, parentId: 'fresh-1' } }) },
      expect.objectContaining({ expectedOwnerId: 'IMPORTER-ID' }),
    );
    const campaign = store.getState().campaigns[0];
    expect(campaign.regionalGraph?.edges || []).toEqual([]);
  });

  test('keeps an absent parent as historical provenance without fabricating a live member', async () => {
    const sourceRef = {
      version: 1,
      parentId: 'parent-not-imported',
      sourceSatelliteId: 'satellite-orphan',
      foundedTick: 8,
      graduatedTick: 13,
      birthId: 'birth-orphan',
    };
    const store = makeStore();
    const res = await store.getState().importAccountData(fileFor({
      settlements: [{
        ...SETTLEMENT('Historical Child'),
        id: 'old-child',
        settlement: { name: 'Historical Child', tier: 'village', parentRef: sourceRef },
      }],
      campaigns: [{ id: 'old-camp', name: 'Orphan History', settlementIds: ['old-child'] }],
    }));

    expect(res.ok).toBe(true);
    const child = store.getState().savedSettlements.find(s => s.name === 'Historical Child');
    expect(child.settlement.parentRef).toEqual(sourceRef);
    expect(updateMock).not.toHaveBeenCalled();
    expect(store.getState().campaigns[0].settlementIds).toEqual(['fresh-1']);
    expect(store.getState().campaigns[0].regionalGraph?.edges || []).toEqual([]);
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
      parentRef: {
        version: 1,
        parentId: 'a-2',
        sourceSatelliteId: 'satellite-export-round-trip',
        foundedTick: 10,
        graduatedTick: 22,
        birthId: 'birth-export-round-trip',
        futureEvidence: { charterSeal: 'green-wax' },
      },
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
    const ridge = store.getState().savedSettlements.find(
      settlement => settlement.name === 'Ridge',
    );
    expect(harbor.settlement.parentRef).toEqual({
      ...harborSettlement.parentRef,
      parentId: ridge.id,
    });
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

/**
 * §359.10 / §66.4 — "Import my data" is a RESTORE, not a reset.
 *
 * The file this path reads is the user's OWN exporter-produced estate, so their
 * lived history travels with it, admission-walled per field. These arms walk the
 * whole write lifecycle: export → import → the second-pass wiring re-address →
 * the store cache → re-export → import again.
 */
describe('importAccountData — restore semantics (§359.10)', () => {
  const LIVED_STATE = (over = {}) => ({
    phase: 'canon',
    eventLog: [{ id: 'ev-1', type: 'CUT_TRADE_ROUTE', at: '2026-02-02T00:00:00.000Z' }],
    systemState: { unrest: 3 },
    locks: { npcs: true },
    canonizedAt: '2026-01-15T00:00:00.000Z',
    ...over,
  });
  const LIVED = (name = 'Old Harbor', over = {}) => ({
    ...SETTLEMENT(name),
    aiData: { aiSettlement: { summary: `${name} is salt-cured and stubborn.` } },
    campaignState: LIVED_STATE(),
    versionHistory: [{ id: 'snap-1', label: 'Before the fire' }],
    ...over,
  });

  test('restores phase, event log, version history and AI prose byte-for-byte', async () => {
    const source = LIVED();
    const store = makeStore();
    const res = await store.getState().importAccountData(fileFor({ settlements: [source] }));

    expect(res.ok).toBe(true);
    expect(res.settlementRestoreNotices).toEqual([]);
    const [[entry]] = saveMock.mock.calls;
    expect(entry.campaignState).toEqual(source.campaignState);
    expect(entry.versionHistory).toEqual(source.versionHistory);
    expect(entry.aiData).toEqual(source.aiData);
    // The live cache carries the same restored state the write did.
    const cached = store.getState().savedSettlements[0];
    expect(cached.campaignState).toEqual(source.campaignState);
    expect(cached.versionHistory).toEqual(source.versionHistory);
    expect(cached.aiData).toEqual(source.aiData);
    // Ownership is still remapped; restore widened no identity surface.
    const keys = Object.keys(entry);
    for (const owned of ['id', 'user_id']) {
      expectAbsentWithAnchor(keys, owned, 'campaignState', `${owned} on the restore surface`);
    }
    const serialized = JSON.stringify(entry);
    for (const foreign of ['SOMEONE-ELSES-USER-ID', 'EMBEDDED-OLD-ID']) {
      expectAbsentWithAnchor(serialized, foreign, 'Old Harbor', 'source identity after restore');
    }
  });

  test('a tampered field resets ALONE, with a notice, while its siblings restore', async () => {
    const store = makeStore();
    const res = await store.getState().importAccountData(fileFor({
      settlements: [
        LIVED('Tampered', {
          campaignState: LIVED_STATE({ eventLog: ['not-an-event-object'] }),
        }),
        LIVED('Intact'),
      ],
    }));

    expect(res.ok).toBe(true);
    // Never a whole-file rejection for one bad field: BOTH settlements landed.
    expect(res.settlementsImported).toBe(2);
    expect(res.settlementsSkipped).toEqual([]);
    // ...and never a silent partial: the fallback is surfaced, named by row.
    expect(res.settlementRestoreNotices).toEqual([
      { name: 'Tampered', reason: expect.stringMatching(/event history/i) },
    ]);
    const [[tampered], [intact]] = saveMock.mock.calls;
    expect(tampered.campaignState.eventLog).toEqual([]);
    expect(tampered.campaignState.phase).toBe('canon');
    expect(tampered.versionHistory).toEqual([{ id: 'snap-1', label: 'Before the fire' }]);
    expect(intact.campaignState.eventLog).toHaveLength(1);
  });

  test('restores neighbour wiring only when both endpoints came from this file', async () => {
    const wired = (name, id, partnerId, partnerName) => ({
      ...LIVED(name),
      id,
      settlement: {
        name,
        tier: 'town',
        neighbourNetwork: [{
          id: partnerId,
          linkId: 'link_src-a_src-b',
          name: partnerName,
          neighbourName: partnerName,
          relationshipType: 'trade_partner',
          relationshipFrom: 'src-a',
          relationshipTo: 'src-b',
        }],
        interSettlementRelationships: [{
          linkId: 'link_src-a_src-b',
          npcName: 'Mira',
          partnerSettlement: partnerName,
        }],
      },
    });
    const store = makeStore();
    const res = await store.getState().importAccountData(fileFor({
      settlements: [
        wired('Harbor', 'src-a', 'src-b', 'Ford'),
        wired('Ford', 'src-b', 'src-a', 'Harbor'),
        // A third row pointing at a partner left behind in the source account.
        { ...wired('Orphan', 'src-c', 'src-missing', 'Gone'), id: 'src-c' },
      ],
    }));

    expect(res.ok).toBe(true);
    const byName = Object.fromEntries(
      store.getState().savedSettlements.map(s => [s.name, s]),
    );
    // Both sides of the intra-envelope edge point at the FRESH ids and agree on
    // one link id — the join the interSettlementRelationships rows ride on.
    const harborEdge = byName.Harbor.settlement.neighbourNetwork[0];
    const fordEdge = byName.Ford.settlement.neighbourNetwork[0];
    expect(harborEdge.id).toBe(byName.Ford.id);
    expect(fordEdge.id).toBe(byName.Harbor.id);
    expect(harborEdge.linkId).toBe(fordEdge.linkId);
    expect(harborEdge.relationshipFrom).toBe(byName.Harbor.id);
    expect(harborEdge.relationshipTo).toBe(byName.Ford.id);
    expect(byName.Harbor.settlement.interSettlementRelationships)
      .toEqual([{ linkId: harborEdge.linkId, npcName: 'Mira', partnerSettlement: 'Ford' }]);
    // The dangling endpoint rebuilds empty, and NO source id reached the store.
    expect(byName.Orphan.settlement.neighbourNetwork).toEqual([]);
    expect(byName.Orphan.settlement.interSettlementRelationships).toEqual([]);
    const library = JSON.stringify(store.getState().savedSettlements);
    for (const sourceId of ['src-a', 'src-b', 'src-c', 'src-missing', 'link_src-']) {
      expectAbsentWithAnchor(library, sourceId, 'Harbor', 'source ids after the re-address');
    }
    // neighborRelationship stays null: it is matched BY NAME at the save
    // boundary and would otherwise bind an import onto an unrelated save.
    for (const save of store.getState().savedSettlements) {
      expect(save.settlement.neighborRelationship).toBeNull();
    }
  });

  test('survives the SECOND lifecycle path: import, re-export, import again', async () => {
    const source = LIVED();
    const first = makeStore();
    expect((await first.getState().importAccountData(fileFor({ settlements: [source] }))).ok)
      .toBe(true);

    // Re-export the restored library exactly as the Data & Privacy section does,
    // then feed that file back through the importer under a second account.
    const reExported = buildAccountExport({
      auth: { user: { id: 'IMPORTER-ID', email: 'me@x.test' }, tier: 'premium' },
      savedSettlements: first.getState().savedSettlements,
      campaigns: [],
      customContent: {},
    });
    expect(reExported.version).toBe(ACCOUNT_EXPORT_VERSION);

    saveMock.mockClear();
    const second = makeStore();
    const res = await second.getState().importAccountData(JSON.stringify(reExported));

    expect(res.ok).toBe(true);
    expect(res.settlementRestoreNotices).toEqual([]);
    const [[entry]] = saveMock.mock.calls;
    expect(entry.campaignState).toEqual(source.campaignState);
    expect(entry.versionHistory).toEqual(source.versionHistory);
    expect(entry.aiData).toEqual(source.aiData);
    // The second generation is still ownership-clean: the first import's fresh
    // ids are not carried into the second account's rows.
    expectAbsentWithAnchor(
      Object.keys(entry), 'id', 'campaignState', 'id on the second crossing',
    );
    expectAbsentWithAnchor(
      JSON.stringify(entry), 'fresh-1', 'Old Harbor', 'first-generation ids on the second crossing',
    );
  });

  test('still ignores export-only service records on the restore surface', async () => {
    const store = makeStore();
    const res = await store.getState().importAccountData(fileFor({
      settlements: [LIVED()],
      serviceRecords: {
        schemaVersion: 1,
        importable: false,
        operatorMessages: [{ id: 'om-1', body: 'not portable' }],
        consentChanges: [{ id: 'cc-1', plane: 'research' }],
      },
    }));

    expect(res.ok).toBe(true);
    const [[entry]] = saveMock.mock.calls;
    expectAbsentWithAnchor(
      Object.keys(entry), 'serviceRecords', 'campaignState', 'serviceRecords on the restore surface',
    );
    const snapshot = JSON.stringify(store.getState());
    for (const record of ['om-1', 'cc-1', 'not portable']) {
      expectAbsentWithAnchor(snapshot, record, 'Old Harbor', 'service records in the store');
    }
  });
});

// ── O-11 PATH 2 — THE LIVING-CONTENT ROSTER ACROSS THE IMPORT BOUNDARY ───────
// The roster is minted beside the provenance receipt in the pipeline's last three
// lines and is treated alike here: resolve every identity through the
// archive-backed map, or drop the whole record and warn. Both lifecycle paths are
// exercised, because they differ in WHEN the identity map exists:
//   • a v3 ARCHIVE envelope populates the map in Phase 3, BEFORE the settlement
//     loop, so the remap resolves and the true record survives the move;
//   • a legacy content-PACK envelope leaves the map at its empty
//     archiveBacked:false default until Phase 8, AFTER the settlement loop, so
//     the remap resolves nothing and MUST degrade to drop-with-warning.
// ⚠ THIS COMMENT SAID "A settlement carrying a roster cannot occur while the dial
// is dormant", AND THE DIAL WAS LIT ON 2026-09-08 (lane LIGHT). The correction is
// not simply that it can occur now: the sentence named the wrong mechanism. What
// decides whether a world carries a roster is the run's REVIEWED ENVIRONMENT, not
// the dial. A lit world generated with no living-content definition writes no key
// at all (measured at the lighting: 0 of 525 golden rows, 0 of 768 RATE towns),
// and a DARK build could always meet a roster through an import FILE, which is
// this file's whole subject. These arms drive the shape explicitly, exactly as
// the law's own fixtures do, and that is unchanged by the dial in either
// position.
describe('importAccountData — the living-content roster (O-11 path 2)', () => {
  const sourceContent = {
    name: 'Haunted Glassworks',
    localUid: 'lu_glassworks',
    definitionId: 'source-definition-glassworks',
    revisionId: 'source-revision-glassworks-2',
  };
  const historicalContent = {
    ...sourceContent,
    name: 'Old Glassworks',
    revisionId: 'source-revision-glassworks-1',
  };

  function settlementWithRoster(binding) {
    return {
      name: 'Rosterton',
      tier: 'town',
      config: { settType: 'town', _livingContentLawVersion: 2 },
      customContentRoster: {
        schemaVersion: 1,
        buckets: {
          deities: [{
            source: 'custom',
            isCustom: true,
            customDefinitionCategory: 'deities',
            localUid: sourceContent.localUid,
            customDefinitionId: sourceContent.definitionId,
            customDefinitionRevisionId: sourceContent.revisionId,
            customDefinitionContentHash:
              binding.resolvedDefinitions[0].contentHash,
            customDefinitionFingerprint:
              binding.resolvedDefinitions[0].contentHash,
            name: 'Aster of the Kiln',
          }],
        },
      },
    };
  }

  test('a v3 ARCHIVE envelope remaps every roster identity into the receiving namespace', async () => {
    const currentBinding = makeCampaignContentBinding({
      institutions: [sourceContent],
    });
    const exported = buildAccountExport({
      auth: { user: { id: 'USER-A', email: 'a@x.test' }, displayName: 'A', tier: 'premium' },
      savedSettlements: [{
        id: 'a-1', user_id: 'USER-A', name: 'Rosterton', tier: 'town',
        settlement: settlementWithRoster(currentBinding),
      }],
      campaigns: [],
      customContent: { institutions: [sourceContent] },
      customContentArchive: fullContentArchive(sourceContent, historicalContent),
    });

    const store = makeStore();
    const res = await store.getState().importAccountData(JSON.stringify(exported));
    expect(res.ok).toBe(true);

    const imported = store.getState().savedSettlements
      .find(saved => saved.name === 'Rosterton');
    const row = imported.settlement.customContentRoster.buckets.deities[0];
    expect(row).toMatchObject({
      customDefinitionId: 'definition-0',
      customDefinitionRevisionId: 'revision-1',
      localUid: 'lu_import_0',
      // Authored + classification fields ride through verbatim.
      source: 'custom',
      isCustom: true,
      customDefinitionCategory: 'deities',
      name: 'Aster of the Kiln',
    });
    // THE ANCHOR THAT MAKES THE REMAP MEAN SOMETHING: not one source-account
    // identifier survives anywhere in the row.
    const sourceIds = [
      sourceContent.definitionId, sourceContent.revisionId, sourceContent.localUid,
      currentBinding.resolvedDefinitions[0].contentHash,
    ];
    for (const sourceId of sourceIds) {
      expect(
        Object.values(row).includes(sourceId),
        `the source identifier ${sourceId} survived the remap`,
      ).toBe(false);
    }
    // …and the fingerprint was re-derived from the DESTINATION hash rather than
    // left holding the source one under a second key.
    expect(row.customDefinitionFingerprint)
      .toBe(row.customDefinitionContentHash);
    expect(res.settlementContentWarnings || []).toEqual([]);
  });

  test('an envelope with NO archive-backed identity map drops the roster with a per-settlement warning', async () => {
    // ⚠ THE ORDERING THIS ARM EXISTS FOR. `contentIdentityMap` starts as the
    // empty archiveBacked:false join and is only REPLACED by a real one in
    // Phase 3 (a v3 archive) or Phase 8 (a legacy content pack). The settlement
    // loop is Phase 4 — between them — so on every envelope except the archive
    // one it is still empty here and the remap can resolve nothing. This
    // envelope carries no archive, which puts the map in exactly that state.
    const currentBinding = makeCampaignContentBinding({
      institutions: [sourceContent],
    });
    const exported = buildAccountExport({
      auth: { user: { id: 'USER-A', email: 'a@x.test' }, displayName: 'A', tier: 'premium' },
      savedSettlements: [{
        id: 'a-1', user_id: 'USER-A', name: 'Rosterton', tier: 'town',
        settlement: settlementWithRoster(currentBinding),
      }],
      campaigns: [],
      customContent: { institutions: [] },
    });

    const store = makeStore();
    const res = await store.getState().importAccountData(JSON.stringify(exported));
    expect(res.ok).toBe(true);

    const imported = store.getState().savedSettlements
      .find(saved => saved.name === 'Rosterton');
    expect(
      imported,
      'the settlement itself must still import — a foreign roster is a dropped'
      + ' record, never a refused world',
    ).toBeTruthy();
    expect(Object.hasOwn(imported.settlement, 'customContentRoster')).toBe(false);
    expect(res.settlementContentWarnings).toEqual([{
      name: 'Rosterton',
      reason: 'The archive receipt did not map every living-content roster identity.'
        + ' Its living-content roster was removed.',
    }]);
  });

  test('a settlement with NO roster is untouched and warns about nothing', async () => {
    // The control for both arms above: the block must be a no-op on the shape
    // every world the product mints today actually has.
    const exported = buildAccountExport({
      auth: { user: { id: 'USER-A', email: 'a@x.test' }, displayName: 'A', tier: 'premium' },
      savedSettlements: [{
        id: 'a-1', user_id: 'USER-A', name: 'Plainton', tier: 'town',
        settlement: { name: 'Plainton', tier: 'town' },
      }],
      campaigns: [],
      customContent: { institutions: [] },
    });
    const store = makeStore();
    const res = await store.getState().importAccountData(JSON.stringify(exported));
    expect(res.ok).toBe(true);
    expect(res.settlementContentWarnings || []).toEqual([]);
    const imported = store.getState().savedSettlements
      .find(saved => saved.name === 'Plainton');
    expect(Object.hasOwn(imported.settlement, 'customContentRoster')).toBe(false);
  });
});

// ── DEF-4 (lane L-MAT-FIX) — UNDO IS A WRITE PATH, AND IT WAS THE HOLE ────────
// The block above rewrites the LIVE settlement. `admitRestoredLifecycle` restores
// `versionHistory` verbatim, a snapshot is a WHOLE settlement, and
// `revertToSnapshotAction` assigns and PERSISTS `target.settlement`. So one revert
// after a correctly remapped import used to re-persist the SOURCE account's roster
// and provenance receipt — the create/read/persist/UNDO trace the lane's own
// promise proof claimed to have walked. Both envelopes are driven, because they
// differ in whether the remap can resolve anything at all.
describe('importAccountData — the roster inside version history (DEF-4)', () => {
  const sourceContent = {
    name: 'Haunted Glassworks',
    localUid: 'lu_glassworks',
    definitionId: 'source-definition-glassworks',
    revisionId: 'source-revision-glassworks-2',
  };
  const historicalContent = {
    ...sourceContent,
    name: 'Old Glassworks',
    revisionId: 'source-revision-glassworks-1',
  };

  function rosterFor(binding) {
    return {
      schemaVersion: 1,
      buckets: {
        deities: [{
          source: 'custom',
          isCustom: true,
          customDefinitionCategory: 'deities',
          localUid: sourceContent.localUid,
          customDefinitionId: sourceContent.definitionId,
          customDefinitionRevisionId: sourceContent.revisionId,
          customDefinitionContentHash: binding.resolvedDefinitions[0].contentHash,
          name: 'Aster of the Kiln',
        }],
      },
    };
  }

  function savedWithHistory(binding) {
    const settlement = {
      name: 'Rosterton',
      tier: 'town',
      config: { settType: 'town', _livingContentLawVersion: 2 },
      customContentRoster: rosterFor(binding),
    };
    return {
      id: 'a-1', user_id: 'USER-A', name: 'Rosterton', tier: 'town',
      settlement,
      versionHistory: [{
        id: 'snap-1',
        ts: 1750000000000,
        kind: 'manual',
        label: 'Before the fire',
        // A snapshot is the whole settlement minus its own timeline.
        settlement: { ...settlement, name: 'Rosterton (before)' },
      }],
    };
  }

  async function importAndRevert(exported) {
    const store = makeStore({ activeSaveId: null });
    const res = await store.getState().importAccountData(JSON.stringify(exported));
    expect(res.ok).toBe(true);
    const saved = store.getState().savedSettlements.find(s => s.name === 'Rosterton');
    expect(saved, 'the settlement must import — a foreign record is dropped, never a world').toBeTruthy();
    expect(
      saved.versionHistory,
      'the timeline did not survive the import — DEF-4\'s arm would prove nothing',
    ).toHaveLength(1);
    const reverted = revertToSnapshotAction(store.setState, store.getState, {
      saveId: saved.id,
      snapshotId: saved.versionHistory[0].id,
    });
    expect(reverted).toBeTruthy();
    const after = store.getState().savedSettlements.find(s => String(s.id) === String(saved.id));
    return { res, saved, after };
  }

  test('a v3 ARCHIVE envelope remaps the SNAPSHOT roster too, so a revert restores the destination record', async () => {
    const currentBinding = makeCampaignContentBinding({ institutions: [sourceContent] });
    const exported = buildAccountExport({
      auth: { user: { id: 'USER-A', email: 'a@x.test' }, displayName: 'A', tier: 'premium' },
      savedSettlements: [savedWithHistory(currentBinding)],
      campaigns: [],
      customContent: { institutions: [sourceContent] },
      customContentArchive: fullContentArchive(sourceContent, historicalContent),
    });

    const { res, saved, after } = await importAndRevert(exported);
    const snapshotRow = saved.versionHistory[0].settlement.customContentRoster
      .buckets.deities[0];
    expect(snapshotRow).toMatchObject({
      customDefinitionId: 'definition-0',
      customDefinitionRevisionId: 'revision-1',
      localUid: 'lu_import_0',
      name: 'Aster of the Kiln',
    });
    // THE WHOLE POINT: after the revert the world holds the DESTINATION record.
    const revertedRow = after.settlement.customContentRoster.buckets.deities[0];
    expect(revertedRow.customDefinitionId).toBe('definition-0');
    expect(after.settlement.name).toBe('Rosterton (before)');
    // Anchored on a field that travels the same remap: the world is live and
    // correctly keyed, and no source identifier rode back in on the undo.
    expectAbsentWithAnchor(
      JSON.stringify(after.settlement),
      sourceContent.definitionId,
      'Aster of the Kiln',
      'DEF-4 revert (archive)',
    );
    expect(res.settlementContentWarnings || []).toEqual([]);
  });

  test('with NO archive the snapshot roster is dropped and warned, so a revert restores nothing foreign', async () => {
    const currentBinding = makeCampaignContentBinding({ institutions: [sourceContent] });
    const exported = buildAccountExport({
      auth: { user: { id: 'USER-A', email: 'a@x.test' }, displayName: 'A', tier: 'premium' },
      savedSettlements: [savedWithHistory(currentBinding)],
      campaigns: [],
      customContent: { institutions: [] },
    });

    const { res, saved, after } = await importAndRevert(exported);
    expect(
      Object.hasOwn(saved.versionHistory[0].settlement, 'customContentRoster'),
      'the snapshot kept the source roster — a revert would re-persist it',
    ).toBe(false);
    expect(Object.hasOwn(after.settlement, 'customContentRoster')).toBe(false);
    expect(after.settlement.name).toBe('Rosterton (before)');
    // The timeline drop is REPORTED separately from the live one, and says how
    // many snapshots it touched rather than repeating itself per snapshot.
    expect(res.settlementContentWarnings).toEqual([
      {
        name: 'Rosterton',
        reason: 'The archive receipt did not map every living-content roster identity.'
          + ' Its living-content roster was removed.',
      },
      {
        name: 'Rosterton',
        reason: 'The archive receipt did not map the living-content roster held by '
          + '1 of its saved snapshots. That roster was removed from them, so reverting '
          + 'to one cannot restore a foreign roster.',
      },
    ]);
  });
});
