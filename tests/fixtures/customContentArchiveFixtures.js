import {
  makeContentEnvironmentRevision,
} from '../../src/domain/content/contentEnvironment.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  fingerprintContent,
} from '../../src/domain/content/contentFingerprint.js';
import {
  buildCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  buildContentPack,
  contentPackManifestHash,
} from '../../src/lib/contentPacks.js';

const CREATED = '2026-01-01T00:00:00.000Z';
const SECOND = '2026-01-02T00:00:00.000Z';
const THIRD = '2026-01-03T00:00:00.000Z';

function fixedManifest(content, options) {
  const built = buildContentPack(content, options);
  const core = {
    ...built,
    exportedAt: CREATED,
  };
  return {
    ...core,
    manifestHash: contentPackManifestHash(core),
  };
}

function revision(id, definitionId, category, number, parent, data, createdAt) {
  return {
    schemaVersion: 1,
    id,
    definitionId,
    category,
    revisionNumber: number,
    parentRevisionId: parent,
    contentHash: contentRevisionHash(category, data),
    data,
    createdAt,
  };
}

function importPlanHash(packId, packVersion, entries, revisions) {
  return fingerprintContent({
    schemaVersion: 1,
    packId,
    packVersion,
    entries: entries.map(entry => ({
      packEntryId: entry.packEntryId,
      category: entry.category,
      data: revisions[entry.revisionId].data,
    })),
  });
}

export function makeCustomContentArchiveLedger({ generation = 3 } = {}) {
  const hallDefinitionId = 'definition:glass-hall';
  const sandDefinitionId = 'definition:sand-pit';
  const hallOne = 'revision:glass-hall:1';
  const hallTwo = 'revision:glass-hall:2';
  const hallThree = 'revision:glass-hall:3';
  const sandOne = 'revision:sand-pit:1';
  const hallDataOne = {
    name: 'Glassworkers Hall',
    description: 'The founding charter.',
    localUid: 'lu_glass_hall',
    requires: ['custom:lu_sand_pit'],
  };
  const hallDataTwo = {
    ...hallDataOne,
    description: 'The expanded furnace charter.',
  };
  // Rollback is itself a forward revision. Meaning returns to the first
  // charter without rewriting either historical row.
  const hallDataThree = {
    ...hallDataOne,
    description: 'The founding charter.',
  };
  const sandData = {
    name: 'White Sand Pit',
    localUid: 'lu_sand_pit',
  };
  const revisions = {
    [hallOne]: revision(
      hallOne,
      hallDefinitionId,
      'institutions',
      1,
      null,
      hallDataOne,
      CREATED,
    ),
    [hallTwo]: revision(
      hallTwo,
      hallDefinitionId,
      'institutions',
      2,
      hallOne,
      hallDataTwo,
      SECOND,
    ),
    [sandOne]: revision(
      sandOne,
      sandDefinitionId,
      'resources',
      1,
      null,
      sandData,
      CREATED,
    ),
  };
  if (generation >= 3) {
    revisions[hallThree] = revision(
      hallThree,
      hallDefinitionId,
      'institutions',
      3,
      hallTwo,
      hallDataThree,
      THIRD,
    );
  }

  const packId = 'pack:glass-economy';
  const versionOne = '1.0.0';
  const versionTwo = '2.0.0';
  const closureOne = [{
    packEntryId: 'glass-hall',
    definitionId: hallDefinitionId,
    revisionId: hallOne,
    category: 'institutions',
    ordinal: 0,
  }, {
    packEntryId: 'sand-pit',
    definitionId: sandDefinitionId,
    revisionId: sandOne,
    category: 'resources',
    ordinal: 1,
  }];
  const closureTwo = [{
    ...closureOne[0],
    revisionId: hallTwo,
  }, closureOne[1]];
  const manifestOne = fixedManifest({
    institutions: [{
      ...hallDataOne,
      packEntryId: 'glass-hall',
      definitionId: hallDefinitionId,
      revisionId: hallOne,
    }],
    resources: [{
      ...sandData,
      packEntryId: 'sand-pit',
      definitionId: sandDefinitionId,
      revisionId: sandOne,
    }],
  }, {
    packId,
    packVersion: versionOne,
    name: 'Glass Economy',
    authorship: { name: 'Fixture Guild' },
    license: 'CC0-1.0',
    source: { catalog: 'archive-fixture' },
    tunables: { magicExists: true },
  });
  const manifestTwo = fixedManifest({
    institutions: [{
      ...hallDataTwo,
      packEntryId: 'glass-hall',
      definitionId: hallDefinitionId,
      revisionId: hallTwo,
    }],
    resources: [{
      ...sandData,
      packEntryId: 'sand-pit',
      definitionId: sandDefinitionId,
      revisionId: sandOne,
    }],
  }, {
    packId,
    packVersion: versionTwo,
    name: 'Glass Economy',
    authorship: { name: 'Fixture Guild' },
    license: 'CC0-1.0',
    source: { catalog: 'archive-fixture' },
    tunables: { magicExists: true },
  });

  const environmentOne = makeContentEnvironmentRevision({
    environmentId: 'environment:glass',
    environmentRevisionId: 'environment:glass:v1',
    revisionNumber: 1,
    source: 'fixture',
    packVersions: [{
      packId,
      packVersionId: versionOne,
      manifestHash: manifestOne.manifestHash,
    }],
    directDefinitions: closureOne.map(entry => ({
      definitionId: entry.definitionId,
      revisionId: entry.revisionId,
      contentHash: revisions[entry.revisionId].contentHash,
      category: entry.category,
    })),
    tunables: { magicExists: true },
    visualSelection: {},
    createdAt: CREATED,
  });
  const environmentTwo = makeContentEnvironmentRevision({
    environmentId: 'environment:glass',
    environmentRevisionId: 'environment:glass:v2',
    revisionNumber: 2,
    source: 'fixture',
    packVersions: [{
      packId,
      packVersionId: versionTwo,
      manifestHash: manifestTwo.manifestHash,
    }],
    directDefinitions: closureTwo.map(entry => ({
      definitionId: entry.definitionId,
      revisionId: entry.revisionId,
      contentHash: revisions[entry.revisionId].contentHash,
      category: entry.category,
    })),
    tunables: { magicExists: true },
    visualSelection: {},
    createdAt: SECOND,
  });

  return {
    schemaVersion: 1,
    definitions: {
      [hallDefinitionId]: {
        id: hallDefinitionId,
        category: 'institutions',
        localUid: hallDataOne.localUid,
        headRevisionId: generation >= 3 ? hallThree : hallTwo,
        archivedAt: null,
        createdAt: CREATED,
        updatedAt: generation >= 3 ? THIRD : SECOND,
        legacyContentId: null,
      },
      [sandDefinitionId]: {
        id: sandDefinitionId,
        category: 'resources',
        localUid: sandData.localUid,
        headRevisionId: sandOne,
        archivedAt: SECOND,
        createdAt: CREATED,
        updatedAt: SECOND,
        legacyContentId: null,
      },
    },
    revisions,
    packEntryDefinitions: {
      [`${packId}\u0000glass-hall`]: hallDefinitionId,
      [`${packId}\u0000sand-pit`]: sandDefinitionId,
    },
    packEntryRevisions: {
      [`${packId}\u0000glass-hall`]: hallTwo,
      [`${packId}\u0000sand-pit`]: sandOne,
    },
    packs: {
      [`${packId}@${versionOne}`]: {
        packId,
        packVersion: versionOne,
        name: manifestOne.name,
        manifestHash: manifestOne.manifestHash,
        importPlanHash: importPlanHash(
          packId,
          versionOne,
          closureOne,
          revisions,
        ),
        manifest: manifestOne,
        createdAt: CREATED,
      },
      [`${packId}@${versionTwo}`]: {
        packId,
        packVersion: versionTwo,
        name: manifestTwo.name,
        manifestHash: manifestTwo.manifestHash,
        importPlanHash: importPlanHash(
          packId,
          versionTwo,
          closureTwo,
          revisions,
        ),
        manifest: manifestTwo,
        createdAt: SECOND,
      },
    },
    packVersionEntries: {
      [`${packId}@${versionOne}`]: closureOne,
      [`${packId}@${versionTwo}`]: closureTwo,
    },
    activePacks: {
      [packId]: {
        packVersion: versionTwo,
        manifestHash: manifestTwo.manifestHash,
      },
    },
    environments: {
      [environmentOne.environmentRevisionId]: environmentOne,
      [environmentTwo.environmentRevisionId]: environmentTwo,
    },
    // The later environment exists, but the active pointer intentionally pins
    // historical v1 to prove activation is a separate fact from max revision.
    activeEnvironmentRevisionId: environmentOne.environmentRevisionId,
    commandReceipts: {
      'source-command:create': {
        fingerprint: fingerprintContent({ command: 'create' }),
        receipt: {
          ok: true,
          status: 'applied',
          signedMeaning: 'canonically exact source JSON',
        },
      },
    },
    archiveImports: {},
  };
}

export function makeCustomContentArchiveFixture({
  generation = 3,
  sourceKey = 'fixture:device-a',
} = {}) {
  const nestedSource = {
    type: 'cloud-account',
    key: 'cloud:nested-source',
    exportedAt: null,
    ledgerFingerprint: fingerprintContent({ nested: 'ledger' }),
  };
  const nestedProvenance = {
    archiveFingerprint: fingerprintContent({ nested: 'archive' }),
    source: nestedSource,
    commandReceipts: [{
      commandId: 'nested-command',
      fingerprint: fingerprintContent({ nested: 'command' }),
      receipt: { ok: true, status: 'applied' },
    }],
    auditProvenance: [],
  };
  return buildCustomContentArchive(
    makeCustomContentArchiveLedger({ generation }),
    {
      sourceKey,
      sourceType: 'browser-local',
      exportedAt: null,
      auditProvenance: [nestedProvenance],
    },
  );
}

