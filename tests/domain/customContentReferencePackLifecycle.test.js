/**
 * Portable lifecycle certification for the canonical custom-content reference
 * pack.
 *
 * The generation matrix proves settlement behavior. This suite follows the
 * same eight-category fixture through the constitutional boundaries that keep
 * authored meaning stable over time: reviewed environment activation,
 * immutable campaign pinning, account-head advancement, rollback, and
 * archive/restore with destination identity remapping.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  eligibleCustomContent,
} from '../../src/domain/customContentSchema.js';
import {
  admitCampaignContentBinding,
  contentRuntimeFromCampaignBinding,
  makeCampaignContentBinding,
  makeLibraryContentEnvironmentRevision,
} from '../../src/domain/content/contentEnvironment.js';
import {
  resolveContentEnvironmentSnapshot,
} from '../../src/domain/content/contentEnvironmentResolution.js';
import {
  AUTHORABLE_CONTENT_BUCKETS,
} from '../../src/domain/content/customContentManifest.js';
import {
  validateCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  exportLocalCustomContentArchive,
  importLocalCustomContentArchive,
} from '../../src/lib/customContentLocalLedger.js';
import {
  createCustomContentSlice,
} from '../../src/store/customContentSlice.js';
import {
  generateSettlementPipeline,
} from '../../src/generators/generateSettlementPipeline.js';
import {
  customContentReferencePack,
  REFERENCE_PACK_NAMES,
} from '../fixtures/customContentReferencePack.js';

const SOURCE_OWNER = 'reference-pack-source';
const DESTINATION_OWNER = 'reference-pack-destination';

function installLocalStorage() {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(String(key)) ?? null,
    setItem: (key, value) => values.set(String(key), String(value)),
    removeItem: key => values.delete(String(key)),
    clear: () => values.clear(),
  };
}

function makeStore() {
  return create(immer((...args) => ({
    auth: { user: { id: SOURCE_OWNER }, tier: 'premium' },
    canUseCustomContent: () => true,
    pinLegacyCampaignContentBindings: () => false,
    ...createCustomContentSlice(...args),
  })));
}

function namesByCategory(customContent) {
  return Object.fromEntries(
    AUTHORABLE_CONTENT_BUCKETS
      .map(category => [
        category,
        (customContent[category] || [])
          .map(definition => definition.name)
          .sort(),
      ]),
  );
}

function identityTuple(category, definition) {
  return {
    category,
    definitionId: definition.definitionId,
    revisionId: definition.revisionId,
    contentHash: definition.contentHash,
    localUid: definition.localUid,
    name: definition.name,
  };
}

function compareIdentityTuple(left, right) {
  if (left.category < right.category) return -1;
  if (left.category > right.category) return 1;
  if (left.name < right.name) return -1;
  if (left.name > right.name) return 1;
  return 0;
}

function identityTuples(customContent) {
  return AUTHORABLE_CONTENT_BUCKETS
    .flatMap(category => (
      (customContent[category] || [])
        .map(definition => identityTuple(category, definition))
    ))
    .sort(compareIdentityTuple);
}

async function authorReferencePack(store) {
  const raw = customContentReferencePack();
  for (const [category, definitions] of Object.entries(raw)) {
    for (const definition of definitions) {
      const receipt = await store.getState().addCustomItem(
        category,
        definition,
      );
      expect(receipt).toMatchObject({
        definitionId: expect.any(String),
        revisionId: expect.any(String),
        contentHash: expect.stringMatching(/^[0-9a-f]{64}$/),
      });
    }
  }
  return store.getState().customContent;
}

describe('canonical reference-pack lifecycle', () => {
  beforeEach(installLocalStorage);

  it('preserves one reviewed meaning through migration, campaign pinning, rollback, and archive restore', async () => {
    const store = makeStore();
    const firstLibrary = await authorReferencePack(store);
    const expectedNames = namesByCategory(firstLibrary);
    const firstEnvironment = makeLibraryContentEnvironmentRevision(
      firstLibrary,
      {
        environmentId: 'personal:reference-pack',
        environmentRevisionId: 'personal:reference-pack:v1',
        revisionNumber: 1,
        source: 'reference-pack-test',
      },
    );

    const preview = await store.getState()
      .previewCustomContentEnvironmentMigration(firstEnvironment);
    expect(preview).toMatchObject({
      ok: true,
      previewFingerprint: expect.stringMatching(/^[0-9a-f]{64}$/),
    });
    const activated = await store.getState()
      .migrateCustomContentEnvironment(firstEnvironment, {
        previewFingerprint: preview.previewFingerprint,
      });
    expect(activated).toMatchObject({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
    });

    const firstRuntime = store.getState().getActiveCustomContentRuntime();
    expect(namesByCategory(firstRuntime.customContent)).toEqual(expectedNames);

    const binding = makeCampaignContentBinding(firstRuntime.customContent, {
      environment: firstEnvironment,
      source: 'reference-pack-test',
    });
    expect(admitCampaignContentBinding(binding)).toMatchObject({ ok: true });
    const pinnedBefore = contentRuntimeFromCampaignBinding(binding);

    const institution = firstLibrary.institutions.find(
      definition => definition.name === REFERENCE_PACK_NAMES.institution,
    );
    await store.getState().updateCustomItem(
      'institutions',
      institution.definitionId,
      {
        ...institution,
        name: `${REFERENCE_PACK_NAMES.institution} Revised`,
      },
    );
    const secondEnvironment = makeLibraryContentEnvironmentRevision(
      store.getState().customContent,
      {
        environmentId: 'personal:reference-pack',
        environmentRevisionId: 'personal:reference-pack:v2',
        revisionNumber: 2,
        source: 'reference-pack-test',
      },
    );
    expect((await store.getState().migrateCustomContentEnvironment(
      secondEnvironment,
    ))).toMatchObject({ ok: true, status: 'applied' });

    // A campaign binding is a frozen snapshot, not a live pointer to the
    // account library or active standalone environment.
    expect(contentRuntimeFromCampaignBinding(binding))
      .toEqual(pinnedBefore);
    expect(
      contentRuntimeFromCampaignBinding(binding)
        .customContent
        .institutions
        .some(definition => definition.name === REFERENCE_PACK_NAMES.institution),
    ).toBe(true);

    expect((await store.getState().rollbackCustomContentEnvironment(
      firstEnvironment.environmentRevisionId,
    ))).toMatchObject({ ok: true, status: 'applied' });
    expect(namesByCategory(
      store.getState().getActiveCustomContentRuntime().customContent,
    )).toEqual(expectedNames);

    const archive = await exportLocalCustomContentArchive({
      ownerId: SOURCE_OWNER,
      exportedAt: null,
    });
    expect(validateCustomContentArchive(archive)).toMatchObject({
      ok: true,
      counts: {
        definitions: 9,
        revisions: 10,
        environments: 2,
      },
    });

    const imported = await importLocalCustomContentArchive(archive, {
      ownerId: DESTINATION_OWNER,
      activationPolicy: 'adopt-if-empty',
    });
    expect(imported).toMatchObject({
      ok: true,
      status: 'applied',
      result: {
        activationAdopted: true,
        counts: {
          definitions: 9,
          revisions: 10,
          environments: 2,
        },
      },
    });
    expect(imported.result.identityMap.definitionIds.every(
      mapping => mapping.sourceId !== mapping.destinationId,
    )).toBe(true);

    const restored = await exportLocalCustomContentArchive({
      ownerId: DESTINATION_OWNER,
      exportedAt: null,
    });
    const activeEnvironment = restored.ledger.environments.find(
      environment => (
        environment.environmentRevisionId
        === restored.ledger.activeEnvironmentRevisionId
      ),
    );
    const restoredRuntime = resolveContentEnvironmentSnapshot(
      activeEnvironment,
      restored.ledger.revisions,
      restored.ledger.packVersions,
    );
    expect(restoredRuntime).toMatchObject({
      ok: true,
      runtime: {
        resolution: {
          ok: true,
          mode: 'reviewed',
        },
      },
    });
    expect(namesByCategory(restoredRuntime.customContent))
      .toEqual(expectedNames);

    const definitionIdMap = new Map(
      imported.result.identityMap.definitionIds.map(mapping => [
        mapping.sourceId,
        mapping.destinationId,
      ]),
    );
    const revisionMap = new Map(
      imported.result.identityMap.revisionIds.map(mapping => [
        mapping.sourceId,
        mapping,
      ]),
    );
    const localUidMap = new Map(
      imported.result.identityMap.localUids.map(mapping => [
        mapping.sourceId,
        mapping.destinationId,
      ]),
    );
    const expectedRestoredIdentities = identityTuples(
      firstRuntime.customContent,
    ).map((identity) => {
      const revision = revisionMap.get(identity.revisionId);
      return {
        ...identity,
        definitionId: definitionIdMap.get(identity.definitionId),
        revisionId: revision?.destinationId,
        contentHash: revision?.destinationContentHash,
        localUid: localUidMap.get(identity.localUid),
      };
    });
    expect(identityTuples(restoredRuntime.customContent))
      .toEqual(expectedRestoredIdentities);

    // Portability is not complete merely because the archive graph validates.
    // Execute the remapped reviewed runtime and require the generated entities
    // to report the destination owner's exact revision identities.
    const restoredTown = generateSettlementPipeline({
      settType: 'town',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'crossroads',
      monsterThreat: 'civilized',
    }, null, {
      seed: 'reference-pack-restored-runtime',
      customContent: eligibleCustomContent(
        restoredRuntime.customContent,
        { tier: 'town' },
      ),
    });
    const restoredByName = new Map(
      identityTuples(restoredRuntime.customContent)
        .map(identity => [identity.name, identity]),
    );
    const expectedMaterializedNames = [
      REFERENCE_PACK_NAMES.institution,
      REFERENCE_PACK_NAMES.resource,
      REFERENCE_PACK_NAMES.service,
      REFERENCE_PACK_NAMES.tradeGood,
    ];
    const expectedMaterializedIdentities = expectedMaterializedNames
      .map(name => restoredByName.get(name))
      .sort(compareIdentityTuple);
    const actualMaterializedIdentities = (
      restoredTown.customContentProvenance?.materializedDefinitions || []
    )
      .map(definition => identityTuple(definition.category, definition))
      .sort(compareIdentityTuple);
    expect(actualMaterializedIdentities)
      .toEqual(expectedMaterializedIdentities);
  });
});
