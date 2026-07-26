/**
 * Offline custom-content authority parity.
 *
 * The local ledger must preserve the same immutable identities and pack-update
 * conflict semantics as migration 185. Offline mode is not permission to
 * overwrite a historical pack/environment revision or an owner-authored head.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import {
  CUSTOM_CONTENT_COMMAND_KIND,
  previewCustomContentCommand,
} from '../../src/domain/content/customContentCommands.js';
import {
  makeContentEnvironmentRevision,
  VANILLA_CONTENT_ENVIRONMENT,
} from '../../src/domain/content/contentEnvironment.js';
import {
  fingerprintContent,
} from '../../src/domain/content/contentFingerprint.js';
import {
  validateCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  buildContentPack,
  prepareImport,
} from '../../src/lib/contentPacks.js';
import {
  executeLocalCustomContentCommand,
  exportLocalCustomContentArchive,
  listLocalCustomContent,
  resolveLocalContentEnvironment,
} from '../../src/lib/customContentLocalLedger.js';
import {
  localPackEntryKey,
} from '../../src/lib/customContentLocalPackKeys.js';
import {
  makeCustomContentArchiveLedger,
} from '../fixtures/customContentArchiveFixtures.js';

const manifestHashByToken = new Map();

function installLocalStorage() {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(String(key)) ?? null,
    setItem: (key, value) => values.set(String(key), String(value)),
    removeItem: key => values.delete(String(key)),
    clear: () => values.clear(),
  };
}

async function execute(commandId, preview) {
  return executeLocalCustomContentCommand(preview, {
    commandId,
    ownerId: 'offline-owner',
  });
}

function packPreview(
  version,
  manifestHash,
  description,
  {
    expectedActivePackVersion = null,
    expectedActiveManifestHash = null,
    definitionId = null,
    expectedHeadRevisionId = null,
  } = {},
) {
  const manifest = buildContentPack({
    institutions: [{
      name: 'Offline Guild',
      description,
      packEntryId: 'guild',
    }],
  }, {
    packId: 'pack:offline-conflict',
    packVersion: version,
    name: 'Offline Conflict',
    source: { testManifestToken: manifestHash },
  });
  manifestHashByToken.set(manifestHash, manifest.manifestHash);
  const prepared = prepareImport(manifest);
  return previewCustomContentCommand({
    kind: CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT,
    pack: {
      packId: 'pack:offline-conflict',
      packVersion: version,
      name: 'Offline Conflict',
      manifestHash: manifest.manifestHash,
      manifest,
      expectedActivePackVersion,
      expectedActiveManifestHash: expectedActiveManifestHash == null
        ? null
        : manifestHashByToken.get(expectedActiveManifestHash)
          || expectedActiveManifestHash,
    },
    entries: [{
      category: 'institutions',
      packEntryId: 'guild',
      definitionId,
      expectedHeadRevisionId,
      data: prepared.items[0].item,
    }],
  });
}

describe('local custom-content revision ledger', () => {
  beforeEach(() => {
    installLocalStorage();
    manifestHashByToken.clear();
  });

  it('normalizes dirty legacy identities deterministically during backfill', async () => {
    globalThis.localStorage.setItem(
      'sf_custom_content:offline-owner',
      JSON.stringify({
        institutions: [
          {
            id: 'legacy-first',
            name: 'First Hall',
            localUid: '  shared-uid  ',
          },
          {
            id: 'legacy-second',
            name: 'Second Hall',
            localUid: 'shared-uid',
          },
          {
            id: 'legacy-blank',
            name: 'Blank Hall',
            localUid: '   ',
          },
        ],
      }),
    );

    const grouped = await listLocalCustomContent({
      ownerId: 'offline-owner',
    });
    const localUids = grouped.institutions.map(item => item.localUid);

    expect(localUids).toContain('shared-uid');
    expect(new Set(localUids).size).toBe(localUids.length);
    expect(localUids.every(value => (
      value === value.trim()
      && value.length > 0
      && value.length <= 240
    ))).toBe(true);
    expect(localUids.filter(value => value.startsWith('bf_'))).toHaveLength(2);
  });

  it('preserves and surfaces a corrupt immutable ledger instead of backfilling over it', async () => {
    const key = 'sf_custom_content_revision_ledger_v1:offline-owner';
    const corrupt = '{"schemaVersion":1,"definitions":';
    localStorage.setItem(key, corrupt);
    localStorage.setItem(
      'sf_custom_content:offline-owner',
      JSON.stringify({ institutions: [{ name: 'Lossy mirror' }] }),
    );

    await expect(listLocalCustomContent({
      ownerId: 'offline-owner',
    })).rejects.toMatchObject({
      code: 'custom_content_local_ledger_corrupt',
    });
    expect(localStorage.getItem(key)).toBe(corrupt);
  });

  it('preserves an unknown ledger schema for explicit recovery', async () => {
    const key = 'sf_custom_content_revision_ledger_v1:offline-owner';
    const future = JSON.stringify({
      schemaVersion: 2,
      definitions: { future: { id: 'future' } },
    });
    localStorage.setItem(key, future);

    await expect(listLocalCustomContent({
      ownerId: 'offline-owner',
    })).rejects.toMatchObject({
      code: 'custom_content_local_ledger_schema_unsupported',
      actualSchemaVersion: 2,
    });
    expect(localStorage.getItem(key)).toBe(future);
  });

  it('quarantines a reviewed entry and drifted environment reference', async () => {
    const ownerId = 'legacy-reviewed-pack-owner';
    const ledgerKey =
      `sf_custom_content_revision_ledger_v1:${ownerId}`;
    const definitionId = 'legacy-reviewed-definition';
    const revisionId = 'legacy-reviewed-revision';
    const packId = 'pack:legacy-reviewed';
    const packVersion = '1.0.0';
    const versionKey = `${packId}@${packVersion}`;
    const legacyMappingKey = `${packId}\u0000reviewed-chain`;
    const environmentRevisionId = 'legacy-reviewed-environment:r1';
    const originalPack = {
      packId,
      packVersion,
      name: 'Legacy Reviewed Pack',
      manifestHash: 'a'.repeat(64),
      importPlanHash: 'b'.repeat(64),
      manifest: { legacy: true },
      createdAt: '2026-01-01T00:00:00.000Z',
    };
    localStorage.setItem(ledgerKey, JSON.stringify({
      schemaVersion: 1,
      definitions: {
        [definitionId]: {
          id: definitionId,
          category: 'supplyChains',
          localUid: 'legacy-reviewed-chain',
          headRevisionId: revisionId,
          archivedAt: null,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          legacyContentId: null,
        },
      },
      revisions: {
        [revisionId]: {
          schemaVersion: 1,
          id: revisionId,
          definitionId,
          category: 'supplyChains',
          revisionNumber: 1,
          parentRevisionId: null,
          contentHash: 'c'.repeat(64),
          data: { legacyReviewedGraph: true },
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      },
      packEntryDefinitions: {
        [legacyMappingKey]: definitionId,
      },
      packEntryRevisions: {
        [legacyMappingKey]: revisionId,
      },
      packs: { [versionKey]: originalPack },
      packVersionEntries: {
        [versionKey]: [{
          packEntryId: 'reviewed-chain',
          definitionId,
          revisionId,
          category: 'supplyChains',
          ordinal: 0,
        }],
      },
      activePacks: {
        [packId]: {
          packVersion,
          manifestHash: originalPack.manifestHash,
        },
      },
      environments: {
        [environmentRevisionId]: {
          environmentRevisionId,
          directDefinitions: [{
            // Legacy environment JSON had no database-style composite FK.
            // A mismatched definition id must not hide a reviewed revision.
            definitionId: 'drifted-definition-id',
            revisionId,
          }],
          packVersions: [],
        },
      },
      activeEnvironmentRevisionId: environmentRevisionId,
      commandReceipts: {},
      archiveImports: {},
    }));

    await listLocalCustomContent({ ownerId });
    const migratedText = localStorage.getItem(ledgerKey);
    const migrated = JSON.parse(migratedText);
    expect(migrated).toMatchObject({
      definitions: {},
      revisions: {},
      packEntryDefinitions: {},
      packEntryRevisions: {},
      packs: {},
      packVersionEntries: {},
      activePacks: {},
      environments: {},
      activeEnvironmentRevisionId: null,
    });
    const quarantine = Object.values(migrated.commandReceipts).find(
      record => record?.receipt?.reason
        === 'legacy_reviewed_supply_chain_generation_quarantined',
    );
    expect(quarantine.receipt.result.quarantine).toMatchObject({
      definition: { id: definitionId },
      revisions: [{ id: revisionId }],
      referencedPackState: {
        packs: { [versionKey]: originalPack },
        packVersionEntries: {
          [versionKey]: [expect.objectContaining({ definitionId })],
        },
      },
      referencedEnvironments: [{
        environmentRevisionId,
      }],
    });

    await listLocalCustomContent({ ownerId });
    expect(localStorage.getItem(ledgerKey)).toBe(migratedText);
    const archive = await exportLocalCustomContentArchive({
      ownerId,
      sourceKey: 'local:legacy-reviewed-pack-owner',
      exportedAt: null,
    });
    expect(validateCustomContentArchive(archive).ok).toBe(true);
  });

  it('quarantines only the affected pack version and environment suffix', async () => {
    const ownerId = 'legacy-reviewed-mixed-version-owner';
    const ledgerKey =
      `sf_custom_content_revision_ledger_v1:${ownerId}`;
    const ledger = makeCustomContentArchiveLedger({ generation: 3 });
    const packId = 'pack:glass-economy';
    const affectedVersionKey = `${packId}@1.0.0`;
    const survivingVersionKey = `${packId}@2.0.0`;
    const reviewedDefinitionId = 'legacy-reviewed-definition';
    const reviewedRevisionId = 'legacy-reviewed-revision';
    const reviewedEntryId = 'legacy-reviewed-chain';
    const reviewedMappingKey = `${packId}\u0000${reviewedEntryId}`;
    const survivingEnvironmentId = 'environment:glass-clean:v1';

    ledger.definitions[reviewedDefinitionId] = {
      id: reviewedDefinitionId,
      category: 'supplyChains',
      localUid: reviewedEntryId,
      headRevisionId: reviewedRevisionId,
      archivedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      legacyContentId: null,
    };
    ledger.revisions[reviewedRevisionId] = {
      schemaVersion: 1,
      id: reviewedRevisionId,
      definitionId: reviewedDefinitionId,
      category: 'supplyChains',
      revisionNumber: 1,
      parentRevisionId: null,
      contentHash: 'c'.repeat(64),
      data: { legacyReviewedGraph: true },
      createdAt: '2026-01-01T00:00:00.000Z',
    };
    ledger.packEntryDefinitions[reviewedMappingKey] =
      reviewedDefinitionId;
    ledger.packVersionEntries[affectedVersionKey].push({
      packEntryId: reviewedEntryId,
      definitionId: reviewedDefinitionId,
      revisionId: reviewedRevisionId,
      category: 'supplyChains',
      ordinal: 2,
    });
    const versionTwoEnvironment =
      ledger.environments['environment:glass:v2'];
    ledger.environments[survivingEnvironmentId] =
      makeContentEnvironmentRevision({
        environmentId: 'environment:glass-clean',
        environmentRevisionId: survivingEnvironmentId,
        revisionNumber: 1,
        source: 'fixture',
        packVersions: versionTwoEnvironment.packVersions,
        directDefinitions: versionTwoEnvironment.directDefinitions,
        tunables: versionTwoEnvironment.tunables,
        visualSelection: versionTwoEnvironment.visualSelection,
        createdAt: versionTwoEnvironment.createdAt,
      });
    ledger.activeEnvironmentRevisionId = survivingEnvironmentId;
    localStorage.setItem(ledgerKey, JSON.stringify(ledger));

    await listLocalCustomContent({ ownerId });
    const migratedText = localStorage.getItem(ledgerKey);
    const migrated = JSON.parse(migratedText);
    expect(migrated.definitions).not.toHaveProperty(reviewedDefinitionId);
    expect(migrated.revisions).not.toHaveProperty(reviewedRevisionId);
    expect(migrated.packs).not.toHaveProperty(affectedVersionKey);
    expect(migrated.packVersionEntries)
      .not.toHaveProperty(affectedVersionKey);
    expect(migrated.packs).toHaveProperty(survivingVersionKey);
    expect(migrated.packVersionEntries)
      .toHaveProperty(survivingVersionKey);
    expect(migrated.activePacks).toMatchObject({
      [packId]: { packVersion: '2.0.0' },
    });
    expect(migrated.environments)
      .not.toHaveProperty('environment:glass:v1');
    expect(migrated.environments)
      .not.toHaveProperty('environment:glass:v2');
    expect(migrated.environments).toHaveProperty(
      survivingEnvironmentId,
    );
    expect(migrated.activeEnvironmentRevisionId)
      .toBe(survivingEnvironmentId);

    const reviewedPortableKey = localPackEntryKey(
      packId,
      reviewedEntryId,
    );
    const hallPortableKey = localPackEntryKey(packId, 'glass-hall');
    expect(migrated.packEntryDefinitions)
      .not.toHaveProperty(reviewedPortableKey);
    expect(migrated.packEntryDefinitions).toHaveProperty(
      hallPortableKey,
      'definition:glass-hall',
    );
    expect(migrated.packEntryRevisions).toHaveProperty(
      hallPortableKey,
      'revision:glass-hall:2',
    );

    const quarantine = Object.values(migrated.commandReceipts).find(
      record => record?.receipt?.reason
        === 'legacy_reviewed_supply_chain_generation_quarantined',
    );
    expect(quarantine.receipt.result.quarantine).toMatchObject({
      referencedPackState: {
        packs: {
          [affectedVersionKey]: expect.objectContaining({
            packVersion: '1.0.0',
          }),
        },
        packVersionEntries: {
          [affectedVersionKey]: expect.arrayContaining([
            expect.objectContaining({
              definitionId: reviewedDefinitionId,
            }),
            expect.objectContaining({
              definitionId: 'definition:glass-hall',
            }),
          ]),
        },
        packEntryDefinitions: expect.objectContaining({
          [reviewedPortableKey]: reviewedDefinitionId,
          [hallPortableKey]: 'definition:glass-hall',
        }),
      },
      referencedEnvironments: [
        expect.objectContaining({
          environmentRevisionId: 'environment:glass:v1',
        }),
        expect.objectContaining({
          environmentRevisionId: 'environment:glass:v2',
        }),
      ],
    });

    await listLocalCustomContent({ ownerId });
    expect(localStorage.getItem(ledgerKey)).toBe(migratedText);
    const archive = await exportLocalCustomContentArchive({
      ownerId,
      sourceKey: 'local:legacy-reviewed-mixed-version-owner',
      exportedAt: null,
    });
    expect(validateCustomContentArchive(archive).ok).toBe(true);
    expect(archive.ledger.packVersions.map(
      version => version.packVersion,
    )).toEqual(['2.0.0']);
  });

  it('refuses a pack update after the installed definition was edited manually', async () => {
    const installed = await execute(
      'command:pack:v1',
      packPreview('1.0.0', 'a'.repeat(64), 'Installed edition.'),
    );
    const item = installed.result.items[0];
    const manual = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
      entries: [{
        definitionId: item.definitionId,
        expectedHeadRevisionId: item.revisionId,
        category: 'institutions',
        data: {
          name: item.name,
          localUid: item.localUid,
          description: 'Owner-authored edition.',
        },
      }],
    });
    const edited = await execute('command:manual-edit', manual);
    expect(edited.status).toBe('applied');

    const conflict = await execute(
      'command:pack:v2',
      packPreview(
        '2.0.0',
        'b'.repeat(64),
        'Pack edition two.',
        {
          expectedActivePackVersion: '1.0.0',
          expectedActiveManifestHash: 'a'.repeat(64),
        },
      ),
    );
    expect(conflict).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'pack_definition_head_changed',
    });
  });

  it('refuses a different payload for an existing pack version identity', async () => {
    await execute(
      'command:pack:immutable:first',
      packPreview('1.0.0', 'c'.repeat(64), 'First payload.'),
    );
    const conflict = await execute(
      'command:pack:immutable:second',
      packPreview(
        '1.0.0',
        'd'.repeat(64),
        'Different payload.',
        {
          expectedActivePackVersion: '1.0.0',
          expectedActiveManifestHash: 'c'.repeat(64),
        },
      ),
    );
    expect(conflict).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'pack_version_immutable',
    });
  });

  it('replays one immutable pack version only through its stable mapping', async () => {
    const first = await execute(
      'command:pack:replay:first',
      packPreview('1.0.0', '7'.repeat(64), 'Stable payload.'),
    );
    const installed = first.result.items[0];
    const reviewedState = {
      expectedActivePackVersion: '1.0.0',
      expectedActiveManifestHash: '7'.repeat(64),
      definitionId: installed.definitionId,
      expectedHeadRevisionId: installed.revisionId,
    };

    const replay = await execute(
      'command:pack:replay:second',
      packPreview(
        '1.0.0',
        '7'.repeat(64),
        'Stable payload.',
        reviewedState,
      ),
    );
    expect(replay).toMatchObject({
      ok: true,
      status: 'applied',
      result: {
        items: [expect.objectContaining({
          definitionId: installed.definitionId,
          revisionId: installed.revisionId,
        })],
      },
    });

    const mismatchedMapping = await execute(
      'command:pack:replay:mismatched-mapping',
      packPreview(
        '1.0.0',
        '7'.repeat(64),
        'Stable payload.',
        {
          ...reviewedState,
          definitionId: 'definition:substituted',
        },
      ),
    );
    expect(mismatchedMapping).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'pack_mapping_definition_changed',
    });
  });

  it('rejects an update whose reviewed active pack was replaced first', async () => {
    const first = await execute(
      'command:pack:race:v1',
      packPreview('1.0.0', 'e'.repeat(64), 'First reviewed edition.'),
    );
    const installed = first.result.items[0];
    const reviewedAgainstV1 = {
      expectedActivePackVersion: '1.0.0',
      expectedActiveManifestHash: 'e'.repeat(64),
      definitionId: installed.definitionId,
      expectedHeadRevisionId: installed.revisionId,
    };
    const second = packPreview(
      '2.0.0',
      'f'.repeat(64),
      'Second reviewed edition.',
      reviewedAgainstV1,
    );
    const staleThird = packPreview(
      '3.0.0',
      '1'.repeat(64),
      'Third edition reviewed before version two landed.',
      reviewedAgainstV1,
    );

    expect((await execute('command:pack:race:v2', second)).status)
      .toBe('applied');
    expect(await execute('command:pack:race:v3-stale', staleThird))
      .toMatchObject({
        ok: false,
        status: 'stale',
        reason: 'pack_preview_stale',
      });
  });

  it('rejects an empty pack closure even if a caller bypasses preview admission', async () => {
    const admitted = packPreview(
      '1.0.0',
      'empty-local',
      'Removed before local execution.',
    );
    const plan = structuredClone(admitted.plan);
    plan.entries = [];

    expect(await execute('command:pack:empty', {
      plan,
      fingerprint: fingerprintContent(plan),
    })).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'pack_version_empty',
    });
    expect(localStorage.getItem(
      'sf_custom_content_revision_ledger_v1:offline-owner',
    )).toBeNull();
  });

  it('requires pack closure and resolves historical revisions from the ledger', async () => {
    const installed = await execute(
      'command:pack:environment:v1',
      packPreview('1.0.0', '2'.repeat(64), 'Reviewed pack edition.'),
    );
    const item = installed.result.items[0];
    const inertEnvironment = makeContentEnvironmentRevision({
      environmentId: 'pack:offline-conflict',
      environmentRevisionId: 'pack:offline-conflict:inert',
      source: 'imported-pack',
      packVersions: [{
        packId: 'pack:offline-conflict',
        packVersionId: '1.0.0',
        manifestHash: manifestHashByToken.get('2'.repeat(64)),
      }],
    });
    const inertReceipt = await execute(
      'command:environment:inert-pack',
      previewCustomContentCommand({
        kind: CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE,
        environment: inertEnvironment,
        expectedActiveEnvironmentRevisionId:
          VANILLA_CONTENT_ENVIRONMENT.environmentRevisionId,
      }),
    );
    expect(inertReceipt).toMatchObject({
      ok: false,
      reason: 'content_environment_pack_closure_mismatch',
    });

    const environment = makeContentEnvironmentRevision({
      environmentId: 'pack:offline-conflict',
      environmentRevisionId: 'pack:offline-conflict:v1',
      source: 'imported-pack',
      packVersions: [{
        packId: 'pack:offline-conflict',
        packVersionId: '1.0.0',
        manifestHash: manifestHashByToken.get('2'.repeat(64)),
      }],
      directDefinitions: [{
        definitionId: item.definitionId,
        revisionId: item.revisionId,
        contentHash: item.contentHash,
        category: 'institutions',
      }],
    });
    expect((await execute(
      'command:environment:closed-pack',
      previewCustomContentCommand({
        kind: CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE,
        environment,
        expectedActiveEnvironmentRevisionId:
          VANILLA_CONTENT_ENVIRONMENT.environmentRevisionId,
      }),
    )).ok).toBe(true);

    const edited = await execute(
      'command:environment:later-head',
      previewCustomContentCommand({
        kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
        entries: [{
          definitionId: item.definitionId,
          expectedHeadRevisionId: item.revisionId,
          category: 'institutions',
          data: {
            name: item.name,
            localUid: item.localUid,
            description: 'A later owner-authored head.',
          },
        }],
      }),
    );
    expect(edited.result.items[0].revisionId).not.toBe(item.revisionId);

    const historical = await resolveLocalContentEnvironment(environment, {
      ownerId: 'offline-owner',
    });
    expect(historical.ok).toBe(true);
    expect(historical.customContent.institutions[0]).toMatchObject({
      description: 'Reviewed pack edition.',
      revisionId: item.revisionId,
    });
  });
});
