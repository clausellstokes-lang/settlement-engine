import { describe, expect, test } from 'vitest';

import {
  makeContentEnvironmentRevision,
} from '../../src/domain/content/contentEnvironment.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  buildCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  prepareCustomContentArchiveImport,
} from '../../src/lib/customContentArchiveImport.js';
import {
  mergeCustomContentArchives,
} from '../../src/lib/customContentArchiveMerge.js';

function ledgerFor({
  definitionId,
  revisionId,
  category,
  data,
  environmentId = null,
}) {
  const contentHash = contentRevisionHash(category, data);
  const environment = environmentId
    ? makeContentEnvironmentRevision({
        environmentId,
        environmentRevisionId: `${environmentId}:r1`,
        directDefinitions: [{
          definitionId,
          revisionId,
          contentHash,
          category,
        }],
        source: 'personal',
      })
    : null;
  return {
    schemaVersion: 1,
    definitions: {
      [definitionId]: {
        id: definitionId,
        category,
        localUid: data.localUid,
        headRevisionId: revisionId,
        archivedAt: null,
        createdAt: null,
        updatedAt: null,
      },
    },
    revisions: {
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
    },
    packs: {},
    activePacks: {},
    packEntryDefinitions: {},
    packVersionEntries: {},
    environments: environment
      ? { [environment.environmentRevisionId]: environment }
      : {},
    activeEnvironmentRevisionId:
      environment?.environmentRevisionId || null,
    commandReceipts: {},
  };
}

function archiveFor(ledger, sourceKey) {
  return buildCustomContentArchive(ledger, {
    sourceKey,
    exportedAt: null,
  });
}

describe('custom-content local archive merge', () => {
  test('uses one destination namespace for dependencies crossing local owners', () => {
    const anonymous = archiveFor(ledgerFor({
      definitionId: 'anonymous-ore',
      revisionId: 'anonymous-ore-r1',
      category: 'resources',
      data: { name: 'Star Ore', localUid: 'lu_star_ore' },
    }), 'local:anon');
    const owner = archiveFor(ledgerFor({
      definitionId: 'owner-forge',
      revisionId: 'owner-forge-r1',
      category: 'institutions',
      data: {
        name: 'Star Forge',
        localUid: 'lu_star_forge',
        requires: ['custom:lu_star_ore'],
      },
    }), 'local:owner');

    const merged = mergeCustomContentArchives([anonymous, owner], {
      sourceKey: 'browser-cutover:owner',
      exportedAt: null,
      activeEnvironmentRevisionId: null,
    });
    const prepared = prepareCustomContentArchiveImport(merged, {
      destinationOwnerId: 'receiving-owner',
    });
    const mappedOreUid = prepared.identityMap.localUids.find(
      mapping => mapping.sourceId === 'lu_star_ore',
    ).destinationId;
    const forgeRevision = prepared.transfer.revisions.find(
      revision => revision.data.name === 'Star Forge',
    );

    expect(forgeRevision.data.requires).toEqual([
      `custom:${mappedOreUid}`,
    ]);
    expect(merged.auditProvenance.map(entry => entry.archiveFingerprint))
      .toEqual([
        anonymous.archiveFingerprint,
        owner.archiveFingerprint,
      ]);
  });

  test('rejects a shared local uid that names two different definitions', () => {
    const first = archiveFor(ledgerFor({
      definitionId: 'first-definition',
      revisionId: 'first-revision',
      category: 'resources',
      data: { name: 'First', localUid: 'lu_collision' },
    }), 'local:first');
    const second = archiveFor(ledgerFor({
      definitionId: 'second-definition',
      revisionId: 'second-revision',
      category: 'resources',
      data: { name: 'Second', localUid: 'lu_collision' },
    }), 'local:second');

    expect(() => mergeCustomContentArchives([first, second], {
      activeEnvironmentRevisionId: null,
    })).toThrow(/local uid.*conflicts/i);
  });

  test('requires an explicit activation choice when source ledgers disagree', () => {
    const anonymous = archiveFor(ledgerFor({
      definitionId: 'anon-hall',
      revisionId: 'anon-hall-r1',
      category: 'institutions',
      data: { name: 'Anon Hall', localUid: 'lu_anon_hall' },
      environmentId: 'environment:anon',
    }), 'local:anon');
    const owner = archiveFor(ledgerFor({
      definitionId: 'owner-hall',
      revisionId: 'owner-hall-r1',
      category: 'institutions',
      data: { name: 'Owner Hall', localUid: 'lu_owner_hall' },
      environmentId: 'environment:owner',
    }), 'local:owner');

    expect(() => mergeCustomContentArchives([anonymous, owner]))
      .toThrow(/explicit activeEnvironmentRevisionId/i);
    const merged = mergeCustomContentArchives([anonymous, owner], {
      activeEnvironmentRevisionId: 'environment:owner:r1',
      exportedAt: null,
    });
    expect(merged.ledger.activeEnvironmentRevisionId)
      .toBe('environment:owner:r1');
  });
});
