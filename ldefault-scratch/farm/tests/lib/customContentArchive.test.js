import {
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';

import {
  makeContentEnvironmentRevision,
} from '../../src/domain/content/contentEnvironment.js';
import {
  CUSTOM_CONTENT_COMMAND_KIND,
  previewCustomContentCommand,
} from '../../src/domain/content/customContentCommands.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  fingerprintContent,
} from '../../src/domain/content/contentFingerprint.js';
import {
  buildCustomContentArchive,
  validateCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  prepareCustomContentArchiveImport,
} from '../../src/lib/customContentArchiveImport.js';
import {
  buildContentPack,
} from '../../src/lib/contentPacks.js';
import {
  executeLocalCustomContentCommand,
  exportLocalCustomContentArchive,
  importLocalCustomContentArchive,
} from '../../src/lib/customContentLocalLedger.js';
import {
  localPackEntryKey,
} from '../../src/lib/customContentLocalPackKeys.js';
import {
  makeCustomContentArchiveFixture,
} from '../fixtures/customContentArchiveFixtures.js';

function installLocalStorage() {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(String(key)) ?? null,
    setItem: (key, value) => values.set(String(key), String(value)),
    removeItem: key => values.delete(String(key)),
    clear: () => values.clear(),
  };
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function resignArchive(value) {
  const archive = cloneJson(value);
  archive.source.ledgerFingerprint = fingerprintContent(archive.ledger);
  archive.archiveFingerprint = fingerprintContent({
    format: archive.format,
    formatVersion: archive.formatVersion,
    source: archive.source,
    ledger: archive.ledger,
    auditProvenance: archive.auditProvenance,
  });
  return archive;
}

function sourceLedger() {
  const definitionId = 'source-definition';
  const revisionId = 'source-revision';
  const category = 'institutions';
  const data = {
    name: 'Glassworkers Hall',
    localUid: 'lu_glassworkers',
  };
  const contentHash = contentRevisionHash(category, data);
  const packId = 'pack:glass';
  const packVersion = '1.0.0';
  const manifest = buildContentPack({
    institutions: [{
      ...data,
      packEntryId: 'glassworkers',
      definitionId,
      revisionId,
    }],
  }, {
    packId,
    packVersion,
    name: 'Glass',
  });
  const importPlanHash = fingerprintContent({
    schemaVersion: 1,
    packId,
    packVersion,
    entries: [{
      packEntryId: 'glassworkers',
      category,
      data,
    }],
  });
  const environment = makeContentEnvironmentRevision({
    environmentId: 'personal:glass',
    environmentRevisionId: 'personal:glass:v1',
    revisionNumber: 1,
    packVersions: [{
      packId,
      packVersionId: packVersion,
      manifestHash: manifest.manifestHash,
      order: 0,
    }],
    directDefinitions: [{
      definitionId,
      revisionId,
      contentHash,
      category,
    }],
    tunables: { magicExists: true },
    visualSelection: {},
    source: 'personal',
  });
  return {
    schemaVersion: 1,
    definitions: {
      [definitionId]: {
        id: definitionId,
        category,
        localUid: data.localUid,
        headRevisionId: revisionId,
        archivedAt: '2026-01-02T00:00:00.000Z',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
        legacyContentId: null,
      },
    },
    revisions: {
      [revisionId]: {
        schemaVersion: 1,
        id: revisionId,
        definitionId,
        category,
        revisionNumber: 1,
        parentRevisionId: null,
        contentHash,
        data,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    },
    packEntryDefinitions: {
      [localPackEntryKey(packId, 'glassworkers')]: definitionId,
    },
    packEntryRevisions: {
      [localPackEntryKey(packId, 'glassworkers')]: revisionId,
    },
    packs: {
      [`${packId}@${packVersion}`]: {
        packId,
        packVersion,
        name: 'Glass',
        manifestHash: manifest.manifestHash,
        importPlanHash,
        manifest,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    },
    packVersionEntries: {
      [`${packId}@${packVersion}`]: [{
        packEntryId: 'glassworkers',
        definitionId,
        revisionId,
        category,
        ordinal: 0,
      }],
    },
    activePacks: {
      [packId]: {
        packVersion,
        manifestHash: manifest.manifestHash,
      },
    },
    environments: {
      [environment.environmentRevisionId]: environment,
    },
    activeEnvironmentRevisionId: environment.environmentRevisionId,
    commandReceipts: {
      'source-command': {
        fingerprint: 'c'.repeat(64),
        receipt: {
          ok: true,
          status: 'applied',
          signedMeaning: 'must remain semantically exact',
        },
      },
    },
    archiveImports: {},
  };
}

describe('canonical custom-content archive', () => {
  beforeEach(installLocalStorage);

  test('proves the complete graph and deterministically remaps every identity', () => {
    const archive = buildCustomContentArchive(sourceLedger(), {
      sourceKey: 'device-a:anon',
      exportedAt: null,
    });
    const admission = validateCustomContentArchive(archive);
    expect(admission.ok).toBe(true);
    expect(admission.counts).toMatchObject({
      definitions: 1,
      revisions: 1,
      packs: 1,
      packVersions: 1,
      packEntries: 1,
      environments: 1,
      commandReceipts: 1,
    });

    const first = prepareCustomContentArchiveImport(archive, {
      destinationOwnerId: '11111111-1111-4111-8111-111111111111',
    });
    const second = prepareCustomContentArchiveImport(archive, {
      destinationOwnerId: '11111111-1111-4111-8111-111111111111',
    });
    expect(second.identityMap).toEqual(first.identityMap);
    expect(first.identityMap.definitionIds[0].destinationId)
      .toMatch(/^[0-9a-f-]{36}$/);
    expect(first.transfer.environments[0].directDefinitions[0]).toMatchObject({
      definitionId: first.identityMap.definitionIds[0].destinationId,
      revisionId: first.identityMap.revisionIds[0].destinationId,
    });
    expect(first.transfer.environments[0].tunables)
      .toEqual({ magicExists: true });
    expect(() => prepareCustomContentArchiveImport(archive, {
      destinationOwnerId: '11111111-1111-4111-8111-111111111111',
      sourceKey: 'unsealed-alternate-namespace',
    })).toThrow(/must match the sealed archive source/i);
  });

  test('rejects a pack version whose immutable closure is empty', () => {
    const ledger = sourceLedger();
    ledger.packVersionEntries['pack:glass@1.0.0'] = [];
    ledger.packs['pack:glass@1.0.0'].importPlanHash = fingerprintContent({
      schemaVersion: 1,
      packId: 'pack:glass',
      packVersion: '1.0.0',
      entries: [],
    });
    expect(() => buildCustomContentArchive(ledger, {
      sourceKey: 'device-a:anon',
      exportedAt: null,
    })).toThrow(/nonempty contiguous closure/);
  });

  test('rejects an unsupported source category instead of sealing a lossy subset', () => {
    const ledger = sourceLedger();
    ledger.definitions['source-definition'].category = 'futureType';
    ledger.revisions['source-revision'].category = 'futureType';

    expect(() => buildCustomContentArchive(ledger, {
      sourceKey: 'device-a:anon',
      exportedAt: null,
    })).toThrow(/unsupported category "futureType".*losslessly/i);
  });

  test('rejects dangling source graph edges instead of filtering them', () => {
    const danglingRevision = sourceLedger();
    danglingRevision.revisions['orphan-revision'] = {
      ...danglingRevision.revisions['source-revision'],
      id: 'orphan-revision',
      definitionId: 'missing-definition',
    };
    expect(() => buildCustomContentArchive(danglingRevision, {
      sourceKey: 'device-a:anon',
      exportedAt: null,
    })).toThrow(/revision "orphan-revision" references missing definition/i);

    const danglingMapping = sourceLedger();
    danglingMapping.packEntryDefinitions[
      localPackEntryKey('pack:glass', 'glassworkers')
    ] =
      'missing-definition';
    expect(() => buildCustomContentArchive(danglingMapping, {
      sourceKey: 'device-a:anon',
      exportedAt: null,
    })).toThrow(/pack mapping.*references missing definition/i);

    const danglingEntry = sourceLedger();
    danglingEntry.packVersionEntries['pack:glass@1.0.0'][0].definitionId =
      'missing-definition';
    expect(() => buildCustomContentArchive(danglingEntry, {
      sourceKey: 'device-a:anon',
      exportedAt: null,
    })).toThrow(/pack entry.*references missing definition/i);

    const danglingActivation = sourceLedger();
    danglingActivation.activePacks['pack:glass'].packVersion = '9.9.9';
    expect(() => buildCustomContentArchive(danglingActivation, {
      sourceKey: 'device-a:anon',
      exportedAt: null,
    })).toThrow(/active local pack.*unavailable version/i);
  });

  test('keeps source receipts as nested provenance after local restore', async () => {
    const archive = buildCustomContentArchive(sourceLedger(), {
      sourceKey: 'device-a:anon',
      exportedAt: null,
    });
    const receipt = await importLocalCustomContentArchive(archive, {
      ownerId: 'receiving-owner',
    });
    expect(receipt).toMatchObject({
      ok: true,
      status: 'applied',
      result: {
        counts: {
          definitions: 1,
          revisions: 1,
          environments: 1,
        },
      },
    });
    const reexported = await exportLocalCustomContentArchive({
      ownerId: 'receiving-owner',
      exportedAt: null,
    });
    expect(reexported.auditProvenance[0].commandReceipts[0].receipt)
      .toEqual(archive.ledger.commandReceipts[0].receipt);
  });

  test('round-trips the complete multi-generation graph without flattening', async () => {
    const archive = makeCustomContentArchiveFixture();
    expect(validateCustomContentArchive(archive)).toMatchObject({
      ok: true,
      counts: {
        definitions: 2,
        revisions: 4,
        packs: 1,
        packVersions: 2,
        packEntries: 4,
        environments: 2,
      },
    });
    expect(archive.ledger.definitions).toEqual(expect.arrayContaining([
      expect.objectContaining({ archivedAt: null }),
      expect.objectContaining({ archivedAt: expect.any(String) }),
    ]));
    expect(archive.ledger.activeEnvironmentRevisionId)
      .toBe('environment:glass:v1');
    expect(archive.ledger.packVersions[0].manifest).toMatchObject({
      authorship: { name: 'Fixture Guild' },
      license: 'CC0-1.0',
      tunables: { magicExists: true },
    });

    const receipt = await importLocalCustomContentArchive(archive, {
      ownerId: 'roundtrip-owner',
      activationPolicy: 'adopt-if-empty',
    });
    expect(receipt.result).toMatchObject({
      activationAdopted: true,
      counts: {
        definitions: 2,
        revisions: 4,
        packVersions: 2,
        environments: 2,
      },
    });
    const reexported = await exportLocalCustomContentArchive({
      ownerId: 'roundtrip-owner',
      exportedAt: null,
    });
    expect(reexported.ledger).toMatchObject({
      activeEnvironmentRevisionId:
        receipt.identityMap?.environmentRevisionIds?.[0]?.destinationId
        || receipt.result.identityMap.environmentRevisionIds[0].destinationId,
    });
    expect(reexported.auditProvenance[0].auditProvenance)
      .toEqual(archive.auditProvenance);
    expect(reexported.ledger.packVersions).toHaveLength(2);
  });

  test('imports into a populated destination without replacing its activation', async () => {
    const first = buildCustomContentArchive(sourceLedger(), {
      sourceKey: 'device:first',
      exportedAt: null,
    });
    const second = buildCustomContentArchive(sourceLedger(), {
      sourceKey: 'device:second',
      exportedAt: null,
    });
    const firstReceipt = await importLocalCustomContentArchive(first, {
      ownerId: 'activation-owner',
      activationPolicy: 'adopt-if-empty',
    });
    const secondReceipt = await importLocalCustomContentArchive(second, {
      ownerId: 'activation-owner',
      activationPolicy: 'adopt-if-empty',
    });
    const firstMap = firstReceipt.result.identityMap;
    const secondMap = secondReceipt.result.identityMap;
    const firstPackId = firstMap.packIds[0].destinationId;
    const secondPackId = secondMap.packIds[0].destinationId;

    expect(firstReceipt.result.activationAdopted).toBe(true);
    expect(secondReceipt.result.activationAdopted).toBe(false);
    const exported = await exportLocalCustomContentArchive({
      ownerId: 'activation-owner',
      exportedAt: null,
    });
    expect(exported.ledger.activeEnvironmentRevisionId).toBe(
      firstMap.environmentRevisionIds[0].destinationId,
    );
    expect(exported.ledger.packs.find(
      pack => pack.packId === firstPackId,
    )).toMatchObject({
      activePackVersion: '1.0.0',
    });
    expect(exported.ledger.packs.find(
      pack => pack.packId === secondPackId,
    )).toMatchObject({
      activePackVersion: null,
    });

    const localLedger = JSON.parse(localStorage.getItem(
      'sf_custom_content_revision_ledger_v1:activation-owner',
    ));
    expect(localLedger.activePacks).toEqual({
      [firstPackId]: expect.objectContaining({ packVersion: '1.0.0' }),
    });
    expect(localLedger.packEntryRevisions).toHaveProperty(
      localPackEntryKey(firstPackId, 'glassworkers'),
      firstMap.revisionIds[0].destinationId,
    );
    expect(localLedger.packEntryRevisions).not.toHaveProperty(
      localPackEntryKey(secondPackId, 'glassworkers'),
    );
  });

  test('does not overwrite a locally changed lifecycle while fast-forwarding', async () => {
    const generationTwo = makeCustomContentArchiveFixture({
      generation: 2,
      sourceKey: 'device:lifecycle',
    });
    const firstReceipt = await importLocalCustomContentArchive(generationTwo, {
      ownerId: 'lifecycle-owner',
    });
    const definitionId = firstReceipt.result.identityMap.definitionIds.find(
      mapping => mapping.sourceId === 'definition:glass-hall',
    ).destinationId;
    const revisionId = firstReceipt.result.identityMap.revisionIds.find(
      mapping => mapping.sourceId === 'revision:glass-hall:2',
    ).destinationId;
    const archived = await executeLocalCustomContentCommand(
      previewCustomContentCommand({
        kind: CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE,
        definitionId,
        expectedHeadRevisionId: revisionId,
      }),
      {
        ownerId: 'lifecycle-owner',
        commandId: 'local:lifecycle:archive',
      },
    );
    expect(archived).toMatchObject({
      ok: true,
      status: 'applied',
    });

    const generationThree = makeCustomContentArchiveFixture({
      generation: 3,
      sourceKey: 'device:lifecycle',
    });
    await expect(importLocalCustomContentArchive(generationThree, {
      ownerId: 'lifecycle-owner',
    })).rejects.toMatchObject({
      code: 'custom_content_archive_identity_conflict',
      message: expect.stringMatching(/locally changed lifecycle/i),
    });

    const exported = await exportLocalCustomContentArchive({
      ownerId: 'lifecycle-owner',
      exportedAt: null,
    });
    expect(exported.ledger.definitions.find(
      definition => definition.id === definitionId,
    )).toMatchObject({
      headRevisionId: revisionId,
      archivedAt: expect.any(String),
    });
  });

  test('fast-forwards an unchanged authorable lineage without reviewed lifecycle state', async () => {
    const sourceKey = 'device:authorable-fast-forward';
    const generationTwo = makeCustomContentArchiveFixture({
      generation: 2,
      sourceKey,
    });
    const firstReceipt = await importLocalCustomContentArchive(generationTwo, {
      ownerId: 'authorable-fast-forward-owner',
    });
    const definitionId = firstReceipt.result.identityMap.definitionIds.find(
      mapping => mapping.sourceId === 'definition:glass-hall',
    ).destinationId;

    const generationThree = makeCustomContentArchiveFixture({
      generation: 3,
      sourceKey,
    });
    const secondReceipt = await importLocalCustomContentArchive(
      generationThree,
      { ownerId: 'authorable-fast-forward-owner' },
    );
    const revisionId = secondReceipt.result.identityMap.revisionIds.find(
      mapping => mapping.sourceId === 'revision:glass-hall:3',
    ).destinationId;

    expect(secondReceipt).toMatchObject({
      ok: true,
      status: 'applied',
      result: {
        counts: {
          definitions: 2,
          revisions: 4,
        },
      },
    });
    const exported = await exportLocalCustomContentArchive({
      ownerId: 'authorable-fast-forward-owner',
      exportedAt: null,
    });
    const importedDefinition = exported.ledger.definitions.find(
      definition => definition.id === definitionId,
    );
    expect(importedDefinition).toMatchObject({
      category: 'institutions',
      headRevisionId: revisionId,
      updatedAt: '2026-01-03T00:00:00.000Z',
    });
    expect(importedDefinition).not.toHaveProperty(
      'reviewedLifecycleVersion',
    );
    expect(exported.auditProvenance).toHaveLength(2);
    const sharedAncestors = exported.auditProvenance.map(
      provenance => provenance.auditProvenance[0],
    );
    expect(sharedAncestors[0]).toEqual(sharedAncestors[1]);
    expect(sharedAncestors[0].archiveFingerprint).toMatch(/^[0-9a-f]{64}$/);
  });

  test('rejects divergent meanings behind one provenance fingerprint', () => {
    const sharedAncestor =
      makeCustomContentArchiveFixture().auditProvenance[0];
    const conflictingAncestor = cloneJson(sharedAncestor);
    conflictingAncestor.source.key = 'cloud:conflicting-source';

    expect(() => buildCustomContentArchive(sourceLedger(), {
      sourceKey: 'device:provenance-conflict',
      exportedAt: null,
      auditProvenance: [sharedAncestor, conflictingAncestor],
    })).toThrow(/audit provenance conflicts/i);
  });

  test('deduplicates transport variants of one source-ledger provenance', async () => {
    const ledger = sourceLedger();
    const first = buildCustomContentArchive(ledger, {
      sourceKey: 'device:stable',
      exportedAt: '2026-02-01T00:00:00.000Z',
    });
    const second = buildCustomContentArchive(ledger, {
      sourceKey: 'device:stable',
      exportedAt: '2026-02-02T00:00:00.000Z',
    });
    const transportVariants = [
      second,
      ...[3, 4, 5, 6].map(day => buildCustomContentArchive(ledger, {
        sourceKey: 'device:stable',
        exportedAt: `2026-02-0${day}T00:00:00.000Z`,
      })),
    ];
    const enriched = buildCustomContentArchive(ledger, {
      sourceKey: 'device:stable',
      exportedAt: '2026-02-07T00:00:00.000Z',
      auditProvenance: [{
        archiveFingerprint: fingerprintContent({
          nestedArchive: 'newly-observed',
        }),
        source: {
          type: 'browser-local',
          key: 'device:nested',
          exportedAt: null,
          ledgerFingerprint: fingerprintContent({
            nestedLedger: 'newly-observed',
          }),
        },
        commandReceipts: [],
        auditProvenance: [],
      }],
    });
    expect(second.archiveFingerprint).not.toBe(first.archiveFingerprint);
    expect(second.source.ledgerFingerprint)
      .toBe(first.source.ledgerFingerprint);

    await importLocalCustomContentArchive(first, {
      ownerId: 'provenance-owner',
    });
    for (const variant of transportVariants) {
      const preparedVariant = prepareCustomContentArchiveImport(variant, {
        destinationOwnerId: 'provenance-owner',
      });
      const receipt = await importLocalCustomContentArchive(variant, {
        ownerId: 'provenance-owner',
      });
      expect(receipt).toMatchObject({
        ok: true,
        commandId: preparedVariant.commandId,
        fingerprint: preparedVariant.fingerprint,
        replayed: true,
        semanticReplay: true,
      });
    }

    const localLedger = JSON.parse(localStorage.getItem(
      'sf_custom_content_revision_ledger_v1:provenance-owner',
    ));
    expect(Object.values(localLedger.archiveImports)).toEqual([
      expect.objectContaining({
        archiveFingerprint: first.archiveFingerprint,
        source: expect.objectContaining({
          key: 'device:stable',
          ledgerFingerprint: first.source.ledgerFingerprint,
        }),
      }),
    ]);
    expect(Object.keys(localLedger.commandReceipts)).toHaveLength(1);
    const exported = await exportLocalCustomContentArchive({
      ownerId: 'provenance-owner',
      exportedAt: null,
    });
    expect(exported.auditProvenance).toHaveLength(1);
    expect(exported.auditProvenance[0].archiveFingerprint)
      .toBe(first.archiveFingerprint);

    await importLocalCustomContentArchive(enriched, {
      ownerId: 'provenance-owner',
    });
    const enrichedExport = await exportLocalCustomContentArchive({
      ownerId: 'provenance-owner',
      exportedAt: null,
    });
    expect(enrichedExport.auditProvenance).toHaveLength(2);
    expect(enrichedExport.auditProvenance.map(
      provenance => provenance.archiveFingerprint,
    )).toEqual(expect.arrayContaining([
      first.archiveFingerprint,
      enriched.archiveFingerprint,
    ]));
    const enrichedLedger = JSON.parse(localStorage.getItem(
      'sf_custom_content_revision_ledger_v1:provenance-owner',
    ));
    expect(Object.keys(enrichedLedger.commandReceipts)).toHaveLength(2);
  });

  test('rejects re-signed unknown fields, invalid receipts, and weak lineage', () => {
    const archive = makeCustomContentArchiveFixture();
    const unknown = cloneJson(archive);
    unknown.ledger.definitions[0].unexpected = true;
    expect(validateCustomContentArchive(resignArchive(unknown)).ok).toBe(false);

    const duplicateReceipt = cloneJson(archive);
    duplicateReceipt.ledger.commandReceipts.push(
      cloneJson(duplicateReceipt.ledger.commandReceipts[0]),
    );
    expect(validateCustomContentArchive(
      resignArchive(duplicateReceipt),
    ).ok).toBe(false);

    const invalidReceiptFingerprint = cloneJson(archive);
    invalidReceiptFingerprint.ledger.commandReceipts[0].fingerprint =
      'not-a-sha256-fingerprint';
    expect(validateCustomContentArchive(
      resignArchive(invalidReceiptFingerprint),
    ).ok).toBe(false);

    const invalidNestedReceiptFingerprint = cloneJson(archive);
    invalidNestedReceiptFingerprint.auditProvenance[0]
      .commandReceipts[0].fingerprint = 'A'.repeat(64);
    expect(validateCustomContentArchive(
      resignArchive(invalidNestedReceiptFingerprint),
    ).ok).toBe(false);

    const gap = cloneJson(archive);
    const second = gap.ledger.revisions.find(row => (
      row.id === 'revision:glass-hall:2'
    ));
    second.revisionNumber = 4;
    expect(validateCustomContentArchive(resignArchive(gap)).ok).toBe(false);

    const nonMaximumHead = cloneJson(archive);
    nonMaximumHead.ledger.definitions.find(row => (
      row.id === 'definition:glass-hall'
    )).headRevisionId = 'revision:glass-hall:2';
    expect(validateCustomContentArchive(
      resignArchive(nonMaximumHead),
    ).ok).toBe(false);
  });

  test('rejects manifest, ledger-fingerprint, and SQL-bound timestamp tampering', () => {
    const archive = makeCustomContentArchiveFixture();
    const manifest = cloneJson(archive);
    manifest.ledger.packVersions[0].manifest.description = 'Unsigned change';
    expect(validateCustomContentArchive(resignArchive(manifest)).ok).toBe(false);

    const ledgerFingerprint = cloneJson(archive);
    ledgerFingerprint.ledger.definitions[0].archivedAt =
      '2026-01-04T00:00:00.000Z';
    ledgerFingerprint.archiveFingerprint = fingerprintContent({
      format: ledgerFingerprint.format,
      formatVersion: ledgerFingerprint.formatVersion,
      source: ledgerFingerprint.source,
      ledger: ledgerFingerprint.ledger,
      auditProvenance: ledgerFingerprint.auditProvenance,
    });
    expect(validateCustomContentArchive(ledgerFingerprint).ok).toBe(false);

    const timestamp = cloneJson(archive);
    timestamp.ledger.definitions[0].updatedAt = 'next Tuesday';
    expect(validateCustomContentArchive(resignArchive(timestamp)).ok)
      .toBe(false);
  });
});
