import { describe, expect, test } from 'vitest';
import {
  accountContentImportNamespace,
  buildImportedAccountArchiveIdentityMap,
  buildImportedAccountContentIdentityMap,
  inspectAccountContentReferences,
  remapAccountCampaignContentBinding,
  remapAccountCampaignContentBindingHistory,
} from '../../src/lib/accountContentPortability.js';
import {
  buildContentPack,
  parseContentPack,
  prepareImport,
} from '../../src/lib/contentPacks.js';
import {
  admitCampaignContentBinding,
  makeCampaignContentBinding,
} from '../../src/domain/content/contentEnvironment.js';
import {
  confirmCustomSupplyChainReview,
} from '../../src/domain/content/customSupplyChainReview.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  remapReviewedSupplyChain,
  reviewedSupplyChainContentHash,
} from '../../src/domain/content/reviewedSupplyChainPersistence.js';
import { inferSupplyChains } from '../../src/domain/inferSupplyChains.js';

function reviewedLibraryFixture() {
  const resource = {
    name: 'Account Resin',
    localUid: 'account-resin',
    category: 'forest',
    tierMax: 'metropolis',
    yields: ['custom:account-lacquer'],
    definitionId: 'source-account-resource',
    revisionId: 'source-account-resource:r1',
    revisionNumber: 1,
  };
  resource.contentHash = contentRevisionHash('resources', resource);
  const good = {
    name: 'Account Lacquer',
    localUid: 'account-lacquer',
    requiredResources: ['custom:account-resin'],
    definitionId: 'source-account-good',
    revisionId: 'source-account-good:r1',
    revisionNumber: 1,
  };
  good.contentHash = contentRevisionHash('tradeGoods', good);
  const authored = {
    resources: [resource],
    tradeGoods: [good],
  };
  const chain = confirmCustomSupplyChainReview(inferSupplyChains(authored)[0]);
  const reviewed = {
    ...chain,
    definitionId: 'source-account-reviewed-chain',
    revisionId: 'source-account-reviewed-chain:r1',
    revisionNumber: 1,
    contentHash: reviewedSupplyChainContentHash(chain),
    localUid: 'source-account-reviewed-chain',
  };
  return {
    resource,
    good,
    reviewed,
    library: {
      ...authored,
      supplyChains: [reviewed],
    },
  };
}

function preparedPack(customContent) {
  const pack = parseContentPack(buildContentPack(customContent)).pack;
  return { pack, prepared: prepareImport(pack) };
}

function receiptFor(prepared, idsByPackEntry) {
  return {
    ok: true,
    perEntry: prepared.items.map(item => ({
      packEntryId: item.packEntryId,
      definitionId: idsByPackEntry[item.packEntryId].definitionId,
      revisionId: idsByPackEntry[item.packEntryId].revisionId,
      category: item.bucket,
      status: 'created',
    })),
  };
}

describe('account custom-content identity portability', () => {
  test('joins pack source identity to durable receipt ids and rebuilds a valid binding', () => {
    const sourceItem = {
      name: 'Haunted Glassworks',
      localUid: 'lu_glassworks',
      definitionId: 'source-definition-glassworks',
      revisionId: 'source-revision-glassworks-4',
    };
    const sourceBinding = makeCampaignContentBinding({
      institutions: [sourceItem],
    });
    const { pack, prepared } = preparedPack({
      institutions: [sourceItem],
    });
    const entry = prepared.items[0];
    const receipt = receiptFor(prepared, {
      [entry.packEntryId]: {
        definitionId: 'imported-definition-glassworks',
        revisionId: 'imported-revision-glassworks-1',
      },
    });
    const namespace = accountContentImportNamespace(
      pack,
      [{ contentBinding: sourceBinding }],
    );
    const joined = buildImportedAccountContentIdentityMap({
      namespace,
      pack,
      prepared,
      receipt,
    });
    expect(joined.ok).toBe(true);

    const remapped = remapAccountCampaignContentBinding(
      sourceBinding,
      joined.identityMap,
    );

    expect(remapped.ok).toBe(true);
    expect(admitCampaignContentBinding(remapped.binding).ok).toBe(true);
    expect(remapped.binding.resolvedDefinitions[0]).toMatchObject({
      definitionId: 'imported-definition-glassworks',
      revisionId: 'imported-revision-glassworks-1',
      data: {
        name: sourceItem.name,
        localUid: entry.item.localUid,
      },
    });
    expect(remapped.binding.environment.directDefinitions[0]).toMatchObject({
      definitionId: 'imported-definition-glassworks',
      revisionId: 'imported-revision-glassworks-1',
    });
    expect(remapped.binding.bindingHash).not.toBe(sourceBinding.bindingHash);
  });

  test('keeps historical behavior but deterministically remaps historical revision ids and dependency refs', () => {
    const current = {
      resources: [{
        name: 'Moon-Iron',
        localUid: 'lu_moon_iron',
        definitionId: 'source-resource',
        revisionId: 'source-resource-r2',
      }],
      institutions: [{
        name: 'Moon Forge',
        localUid: 'lu_moon_forge',
        definitionId: 'source-forge',
        revisionId: 'source-forge-r2',
        requires: ['custom:lu_moon_iron'],
      }],
    };
    const historical = makeCampaignContentBinding({
      resources: [{
        ...current.resources[0],
        name: 'Unrefined Moon-Iron',
        revisionId: 'source-resource-r1',
      }],
      institutions: [{
        ...current.institutions[0],
        name: 'Old Moon Forge',
        revisionId: 'source-forge-r1',
      }],
    });
    const currentBinding = makeCampaignContentBinding(current);
    const { pack, prepared } = preparedPack(current);
    const idsByPackEntry = Object.fromEntries(prepared.items.map((item) => [
      item.packEntryId,
      {
        definitionId: `received-${item.bucket}`,
        revisionId: `received-${item.bucket}-r1`,
      },
    ]));
    const namespace = accountContentImportNamespace(pack, [{
      contentBinding: currentBinding,
      contentBindingHistory: [historical],
    }]);
    const joined = buildImportedAccountContentIdentityMap({
      namespace,
      pack,
      prepared,
      receipt: receiptFor(prepared, idsByPackEntry),
    });
    expect(joined.ok).toBe(true);

    const first = remapAccountCampaignContentBindingHistory(
      [historical],
      joined.identityMap,
    );
    const second = remapAccountCampaignContentBindingHistory(
      [historical],
      joined.identityMap,
    );

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(first.history[0].bindingHash).toBe(second.history[0].bindingHash);
    const resource = first.history[0].resolvedDefinitions.find(
      definition => definition.category === 'resources',
    );
    const forge = first.history[0].resolvedDefinitions.find(
      definition => definition.category === 'institutions',
    );
    expect(resource.definitionId).toBe('received-resources');
    expect(forge.definitionId).toBe('received-institutions');
    expect(resource.revisionId).toMatch(/^imported-revision:/);
    expect(forge.revisionId).toMatch(/^imported-revision:/);
    expect(forge.data.requires).toEqual([
      `custom:${resource.data.localUid}`,
    ]);
    expect(JSON.stringify(first.history[0].environment.directDefinitions))
      .not.toMatch(/source-resource|source-forge|-r1/);
  });

  test('preflight distinguishes receipt-mappable heads from embedded historical revisions', () => {
    const currentItem = {
      name: 'Current Hall',
      localUid: 'lu_hall',
      definitionId: 'source-hall',
      revisionId: 'source-hall-r2',
    };
    const current = makeCampaignContentBinding({
      institutions: [currentItem],
    });
    const historical = makeCampaignContentBinding({
      institutions: [{
        ...currentItem,
        name: 'Earlier Hall',
        revisionId: 'source-hall-r1',
      }],
    });
    const pack = buildContentPack({ institutions: [currentItem] });

    const inspected = inspectAccountContentReferences([{
      contentBinding: current,
      contentBindingHistory: [historical],
    }], pack);

    expect(inspected).toMatchObject({
      ok: true,
      bindings: 2,
      bindingRevisions: 2,
      packMappedRevisions: 1,
      embeddedRevisions: 1,
    });
  });

  test('preflight refuses reviewed bindings absent from the full ledger archive', () => {
    const fixture = reviewedLibraryFixture();
    const binding = makeCampaignContentBinding(fixture.library);
    const authorableOnlyPack = buildContentPack({
      resources: [fixture.resource],
      tradeGoods: [fixture.good],
    });

    const inspected = inspectAccountContentReferences([{
      contentBinding: binding,
    }], authorableOnlyPack);

    expect(inspected.ok).toBe(false);
    expect(inspected.errors).toContainEqual(expect.objectContaining({
      code: 'reviewed_supply_chain_archive_identity_required',
    }));
  });

  test('rejects a receipt whose pack-entry join is duplicate or incomplete', () => {
    const { pack, prepared } = preparedPack({
      institutions: [{
        name: 'Receipt Hall',
        localUid: 'lu_receipt_hall',
        definitionId: 'source-receipt-hall',
        revisionId: 'source-receipt-hall-r1',
      }],
    });
    const entry = prepared.items[0];
    const row = {
      packEntryId: entry.packEntryId,
      definitionId: 'received-receipt-hall',
      revisionId: 'received-receipt-hall-r1',
    };

    const joined = buildImportedAccountContentIdentityMap({
      namespace: accountContentImportNamespace(pack, []),
      pack,
      prepared,
      receipt: {
        perEntry: [
          row,
          { ...row },
          {
            packEntryId: 'unexpected-entry',
            definitionId: 'unexpected-definition',
            revisionId: 'unexpected-revision',
          },
        ],
      },
    });

    expect(joined).toMatchObject({
      ok: false,
      diagnostics: {
        errors: expect.arrayContaining([
          expect.objectContaining({
            code: 'content_identity_receipt_entry_duplicate',
          }),
          expect.objectContaining({
            code: 'content_identity_receipt_entry_unexpected',
          }),
        ]),
      },
    });
  });

  test('uses a full-archive identity receipt to remap campaign cutoffs', () => {
    const sourceBinding = makeCampaignContentBinding({
      institutions: [{
        name: 'Archive Hall',
        localUid: 'lu_archive_hall',
        definitionId: 'source-archive-hall',
        revisionId: 'source-archive-hall-r3',
      }],
    }, {
      environmentId: 'source-environment',
      environmentRevisionId: 'source-environment-r3',
      revisionNumber: 3,
      packVersions: [{
        packId: 'source-pack',
        packVersionId: '3.0.0',
        manifestHash: 'b'.repeat(64),
        order: 0,
      }],
      tunables: { priorityEconomy: 71 },
    });
    const expectedDestination = makeCampaignContentBinding({
      institutions: [{
        name: 'Archive Hall',
        localUid: 'lu_received_archive_hall',
        definitionId: 'received-archive-hall',
        revisionId: 'received-archive-hall-r1',
      }],
    }, {
      source: sourceBinding.environment.source,
      environmentId: 'received-environment',
      environmentRevisionId: 'received-environment-r3',
      revisionNumber: 3,
      packVersions: [{
        packId: 'received-pack',
        packVersionId: '3.0.0',
        manifestHash: 'b'.repeat(64),
        order: 0,
      }],
      tunables: { priorityEconomy: 71 },
    });
    const namespace = accountContentImportNamespace({
      format: 'settlementforge.custom-content-ledger',
      archiveFingerprint: 'a'.repeat(64),
    }, [{ contentBinding: sourceBinding }]);
    const joined = buildImportedAccountArchiveIdentityMap({
      namespace,
      identityMap: {
        definitionIds: [{
          sourceId: 'source-archive-hall',
          destinationId: 'received-archive-hall',
        }],
        revisionIds: [{
          sourceId: 'source-archive-hall-r3',
          destinationId: 'received-archive-hall-r1',
          destinationContentHash:
            expectedDestination.resolvedDefinitions[0].contentHash,
        }],
        localUids: [{
          sourceId: 'lu_archive_hall',
          destinationId: 'lu_received_archive_hall',
        }],
        packIds: [{
          sourceId: 'source-pack',
          destinationId: 'received-pack',
        }],
        environmentIds: [{
          sourceId: 'source-environment',
          destinationId: 'received-environment',
        }],
        environmentRevisionIds: [{
          sourceId: 'source-environment-r3',
          destinationId: 'received-environment-r3',
          destinationEnvironmentHash:
            expectedDestination.environment.environmentHash,
        }],
      },
    });

    expect(joined.ok).toBe(true);
    const remapped = remapAccountCampaignContentBinding(
      sourceBinding,
      joined.identityMap,
    );
    expect(remapped).toMatchObject({
      ok: true,
      binding: {
        environment: {
          revisionNumber: 3,
        },
        resolvedDefinitions: [{
          definitionId: 'received-archive-hall',
          revisionId: 'received-archive-hall-r1',
          data: {
            name: 'Archive Hall',
            localUid: 'lu_received_archive_hall',
          },
        }],
      },
    });
    expect(remapped.binding.environment).toMatchObject({
      environmentId: 'received-environment',
      environmentRevisionId: 'received-environment-r3',
      environmentHash: expectedDestination.environment.environmentHash,
      packVersions: [{
        packId: 'received-pack',
        packVersionId: '3.0.0',
        manifestHash: 'b'.repeat(64),
      }],
    });
    expect(remapped.diagnostics.environmentIdentity)
      .toBe('archive-receipt');
    const remappedHistory = remapAccountCampaignContentBindingHistory(
      [sourceBinding],
      joined.identityMap,
    );
    expect(remappedHistory.history[0].environment.packVersions[0])
      .toMatchObject({
        packId: 'received-pack',
        packVersionId: '3.0.0',
        manifestHash: 'b'.repeat(64),
      });

    expect(remapAccountCampaignContentBinding(sourceBinding, {
      ...joined.identityMap,
      revisionIds: new Map(),
    })).toMatchObject({
      ok: false,
      code: 'campaign_content_revision_identity_incomplete',
    });
    expect(remapAccountCampaignContentBinding(sourceBinding, {
      ...joined.identityMap,
      localUids: new Map(),
    })).toMatchObject({
      ok: false,
      code: 'campaign_content_local_identity_incomplete',
    });
    expect(remapAccountCampaignContentBinding(sourceBinding, {
      ...joined.identityMap,
      packIds: new Map(),
    })).toMatchObject({
      ok: false,
      code: 'campaign_content_pack_identity_incomplete',
    });
    expect(remapAccountCampaignContentBinding(sourceBinding, {
      ...joined.identityMap,
      environmentHashes: new Map([[
        'source-environment-r3',
        'f'.repeat(64),
      ]]),
    })).toMatchObject({
      ok: false,
      code: 'campaign_content_environment_hash_mismatch',
    });
  });

  test('remaps reviewed evidence only through a full archive receipt', () => {
    const fixture = reviewedLibraryFixture();
    const sourceBinding = makeCampaignContentBinding(fixture.library, {
      source: 'reviewed-account-source',
      revisionNumber: 3,
    });
    const destinationResource = {
      ...fixture.resource,
      localUid: 'received-account-resin',
      yields: ['custom:received-account-lacquer'],
    };
    const destinationGood = {
      ...fixture.good,
      localUid: 'received-account-lacquer',
      requiredResources: ['custom:received-account-resin'],
    };
    const resourceHash = contentRevisionHash(
      'resources',
      destinationResource,
    );
    const goodHash = contentRevisionHash('tradeGoods', destinationGood);
    const localUids = new Map([
      [fixture.resource.localUid, destinationResource.localUid],
      [fixture.good.localUid, destinationGood.localUid],
    ]);
    const definitionIds = new Map([
      [fixture.resource.definitionId, 'received-account-resource'],
      [fixture.good.definitionId, 'received-account-good'],
      [fixture.reviewed.definitionId, 'received-account-reviewed-chain'],
    ]);
    const revisionIds = new Map([
      [fixture.resource.revisionId, 'received-account-resource:r1'],
      [fixture.good.revisionId, 'received-account-good:r1'],
      [fixture.reviewed.revisionId, 'received-account-reviewed-chain:r1'],
    ]);
    const contentHashes = new Map([
      [fixture.resource.revisionId, resourceHash],
      [fixture.good.revisionId, goodHash],
    ]);
    const remappedChain = remapReviewedSupplyChain(fixture.reviewed, {
      localUids,
      definitionIds,
      revisionIds,
      revisionNumbers: new Map([
        [fixture.resource.revisionId, 1],
        [fixture.good.revisionId, 1],
      ]),
      contentHashes,
    });
    const reviewedHash = reviewedSupplyChainContentHash(remappedChain);
    const joined = buildImportedAccountArchiveIdentityMap({
      namespace: 'account-reviewed-round-trip',
      identityMap: {
        definitionIds: [...definitionIds].map(([sourceId, destinationId]) => ({
          sourceId,
          destinationId,
        })),
        revisionIds: [...revisionIds].map(([sourceId, destinationId]) => ({
          sourceId,
          destinationId,
          destinationContentHash:
            sourceId === fixture.resource.revisionId
              ? resourceHash
              : sourceId === fixture.good.revisionId
                ? goodHash
                : reviewedHash,
          destinationRevisionNumber: 1,
        })),
        localUids: [...localUids].map(([sourceId, destinationId]) => ({
          sourceId,
          destinationId,
        })),
        packIds: [],
        environmentIds: [],
        environmentRevisionIds: [],
      },
    });
    expect(joined.ok).toBe(true);

    const remapped = remapAccountCampaignContentBinding(
      sourceBinding,
      joined.identityMap,
    );
    expect(remapped.ok).toBe(true);
    expect(admitCampaignContentBinding(remapped.binding).ok).toBe(true);
    expect(remapped.binding.environment.revisionNumber).toBe(3);
    expect(remapped.binding.resolvedDefinitions.find(
      definition => definition.category === 'supplyChains',
    )).toMatchObject({
      definitionId: 'received-account-reviewed-chain',
      revisionId: 'received-account-reviewed-chain:r1',
      contentHash: reviewedHash,
    });
  });
});
