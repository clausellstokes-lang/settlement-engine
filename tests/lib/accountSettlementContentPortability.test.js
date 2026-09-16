import { describe, expect, test } from 'vitest';

import {
  makeCampaignContentBinding,
} from '../../src/domain/content/contentEnvironment.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  admitSettlementContentProvenance,
  buildSettlementContentProvenance,
} from '../../src/domain/content/settlementContentProvenance.js';
import {
  accountCampaignBindingDestinations,
  remapAccountSettlementContentProvenance,
} from '../../src/lib/accountSettlementContentPortability.js';
import {
  buildImportedAccountArchiveIdentityMap,
} from '../../src/lib/accountContentPortability.js';

function sourceFixture() {
  const sourceItem = {
    name: 'Archive Hall',
    localUid: 'lu_archive_hall',
    definitionId: 'source-hall',
    revisionId: 'source-hall-r3',
  };
  const sourceBinding = makeCampaignContentBinding({
    institutions: [sourceItem],
  }, {
    environmentId: 'source-environment',
    environmentRevisionId: 'source-environment-r3',
  });
  const sourceProvenance = buildSettlementContentProvenance({
    institutions: [{
      name: sourceItem.name,
      source: 'custom',
      customDefinitionId: sourceItem.definitionId,
    }],
  }, {
    institutions: [{
      ...sourceItem,
      contentHash: sourceBinding.resolvedDefinitions[0].contentHash,
    }],
  }, {
    scope: 'campaign',
    environment: sourceBinding.environment,
    bindingHash: sourceBinding.bindingHash,
  });
  const destinationHash = contentRevisionHash('institutions', {
    name: sourceItem.name,
    localUid: 'lu_received_hall',
  });
  const destinationBinding = makeCampaignContentBinding({
    institutions: [{
      name: sourceItem.name,
      localUid: 'lu_received_hall',
      definitionId: 'received-hall',
      revisionId: 'received-hall-r1',
    }],
  }, {
    source: sourceBinding.environment.source,
    environmentId: 'received-environment',
    environmentRevisionId: 'received-environment-r3',
    packVersions: sourceBinding.environment.packVersions,
    tunables: sourceBinding.environment.tunables,
    visualSelection: sourceBinding.environment.visualSelection,
  });
  const destinationEnvironmentHash =
    destinationBinding.environment.environmentHash;
  const receipt = {
    definitionIds: [{
      sourceId: 'source-hall',
      destinationId: 'received-hall',
    }],
    revisionIds: [{
      sourceId: 'source-hall-r3',
      destinationId: 'received-hall-r1',
      destinationContentHash: destinationHash,
    }],
    localUids: [{
      sourceId: 'lu_archive_hall',
      destinationId: 'lu_received_hall',
    }],
    packIds: [],
    environmentIds: [{
      sourceId: 'source-environment',
      destinationId: 'received-environment',
    }],
    environmentRevisionIds: [{
      sourceId: 'source-environment-r3',
      destinationId: 'received-environment-r3',
      destinationEnvironmentHash,
    }],
  };
  const joined = buildImportedAccountArchiveIdentityMap({
    namespace: 'account-content:test',
    identityMap: receipt,
  });
  return {
    sourceBinding,
    sourceProvenance,
    destinationHash,
    destinationEnvironmentHash,
    identityMap: joined.identityMap,
  };
}

describe('account settlement content provenance portability', () => {
  test('rebuilds definition, revision, local uid, hash, environment, and binding joins', () => {
    const fixture = sourceFixture();
    const bindingDestinations = accountCampaignBindingDestinations(
      [{ contentBinding: fixture.sourceBinding }],
      fixture.identityMap,
    );

    const remapped = remapAccountSettlementContentProvenance(
      fixture.sourceProvenance,
      fixture.identityMap,
      bindingDestinations,
    );

    expect(remapped.ok).toBe(true);
    expect(admitSettlementContentProvenance(remapped.provenance).ok).toBe(true);
    const destinationBinding = bindingDestinations.get(
      fixture.sourceBinding.bindingHash,
    );
    expect(remapped.provenance).toMatchObject({
      scope: 'campaign',
      bindingHash: destinationBinding.bindingHash,
      environment: {
        environmentId: destinationBinding.environment.environmentId,
        environmentRevisionId:
          destinationBinding.environment.environmentRevisionId,
        environmentHash: destinationBinding.environment.environmentHash,
      },
      materializedDefinitions: [{
        definitionId: 'received-hall',
        revisionId: 'received-hall-r1',
        localUid: 'lu_received_hall',
        contentHash: fixture.destinationHash,
      }],
    });
    expect(remapped.provenance.receiptHash)
      .not.toBe(fixture.sourceProvenance.receiptHash);
  });

  test('clears a detached campaign hash while retaining receipt-backed exact joins', () => {
    const fixture = sourceFixture();
    const remapped = remapAccountSettlementContentProvenance(
      fixture.sourceProvenance,
      fixture.identityMap,
    );

    expect(remapped).toMatchObject({
      ok: true,
      provenance: {
        scope: 'standalone',
        bindingHash: null,
        environment: {
          environmentId: 'received-environment',
          environmentRevisionId: 'received-environment-r3',
          environmentHash: fixture.destinationEnvironmentHash,
        },
      },
    });
  });

  test('refuses to preserve source ids when the archive receipt is incomplete', () => {
    const fixture = sourceFixture();
    const empty = buildImportedAccountArchiveIdentityMap({
      namespace: 'account-content:test',
      identityMap: {
        definitionIds: [],
        revisionIds: [],
        localUids: [],
        packIds: [],
        environmentIds: [],
        environmentRevisionIds: [],
      },
    });

    expect(remapAccountSettlementContentProvenance(
      fixture.sourceProvenance,
      empty.identityMap,
    )).toMatchObject({
      ok: false,
      code: 'settlement_content_provenance_identity_incomplete',
    });
  });

  test('refuses to erase an environment join when only that receipt map is incomplete', () => {
    const fixture = sourceFixture();
    const incompleteEnvironment = {
      ...fixture.identityMap,
      environmentIds: new Map(),
      environmentRevisionIds: new Map(),
      environmentHashes: new Map(),
    };

    expect(remapAccountSettlementContentProvenance(
      fixture.sourceProvenance,
      incompleteEnvironment,
    )).toMatchObject({
      ok: false,
      code: 'settlement_content_provenance_environment_incomplete',
    });
  });
});
