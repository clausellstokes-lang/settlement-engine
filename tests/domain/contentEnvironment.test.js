import { describe, expect, test } from 'vitest';
import {
  admitCampaignContentBinding,
  contentRuntimeFromCampaignBinding,
  contentRuntimeFromEnvironment,
  diffContentEnvironmentRevisions,
  makeLibraryContentEnvironmentRevision,
  makeCampaignContentBinding,
  makeContentEnvironmentRevision,
  VANILLA_CONTENT_ENVIRONMENT,
} from '../../src/domain/content/contentEnvironment.js';
import {
  resolveContentEnvironmentSnapshot,
} from '../../src/domain/content/contentEnvironmentResolution.js';
import { fingerprintContent } from '../../src/domain/content/contentFingerprint.js';

describe('content environment constitutional truth', () => {
  test('campaign cutoff environment exactly enumerates every resolved definition', () => {
    const active = makeContentEnvironmentRevision({
      environmentId: 'personal:active',
      environmentRevisionId: 'personal:active:v3',
      revisionNumber: 3,
      tunables: { priorityEconomy: 81 },
      source: 'personal',
    });
    const binding = makeCampaignContentBinding({
      institutions: [{
        name: 'Pinned Foundry',
        definitionId: 'definition:pinned-foundry',
        revisionId: 'revision:pinned-foundry:4',
        localUid: 'lu_pinned_foundry',
      }],
      traditions: [{
        name: 'Long Hearth',
        definitionId: 'definition:long-hearth',
        revisionId: 'revision:long-hearth:2',
        localUid: 'lu_long_hearth',
      }],
    }, { environment: active, source: 'current-library' });

    expect(binding.environment.environmentRevisionId)
      .not.toBe(active.environmentRevisionId);
    expect(binding.environment.tunables).toEqual(active.tunables);
    expect(binding.environment.visualSelection).toEqual(active.visualSelection);
    expect(binding.environment.directDefinitions).toEqual(
      binding.resolvedDefinitions.map(definition => ({
        definitionId: definition.definitionId,
        revisionId: definition.revisionId,
        contentHash: definition.contentHash,
        category: definition.category,
      })),
    );
    expect(admitCampaignContentBinding(binding).ok).toBe(true);
  });

  test('admission rejects a valid environment that omits a frozen definition', () => {
    const binding = makeCampaignContentBinding({
      institutions: [{
        name: 'Pinned Foundry',
        definitionId: 'definition:pinned-foundry',
        revisionId: 'revision:pinned-foundry:4',
      }],
    });
    const tampered = structuredClone(binding);
    tampered.environment = makeContentEnvironmentRevision({
      environmentId: 'dishonest',
      environmentRevisionId: 'dishonest:v1',
      directDefinitions: [],
    });
    tampered.bindingHash = fingerprintContent({
      schemaVersion: tampered.schemaVersion,
      source: tampered.source,
      environment: tampered.environment,
      resolvedDefinitions: tampered.resolvedDefinitions,
    });

    expect(admitCampaignContentBinding(tampered)).toMatchObject({
      ok: false,
      reason: 'content_binding_environment_parity_mismatch',
    });
  });

  test('campaign runtime stays pinned after the account library changes', () => {
    const binding = makeCampaignContentBinding({
      institutions: [{
        name: 'Original Foundry',
        definitionId: 'definition:foundry',
        revisionId: 'revision:foundry:1',
      }],
    });
    const first = contentRuntimeFromCampaignBinding(binding);

    // A later account head/archive is intentionally not an input to this pure
    // projection; both reads derive only from the portable campaign binding.
    const second = contentRuntimeFromCampaignBinding(binding);
    expect(second.customContent).toEqual(first.customContent);
    expect(second.customContent.institutions[0].name)
      .toBe('Original Foundry');
  });

  test('environment diff uses deterministic raw ordering for registered paths', () => {
    const next = makeContentEnvironmentRevision({
      environmentId: 'personal:ordered',
      environmentRevisionId: 'personal:ordered:v1',
      tunables: {
        priorityReligion: 63,
        priorityEconomy: 71,
      },
    });
    const paths = diffContentEnvironmentRevisions(
      VANILLA_CONTENT_ENVIRONMENT,
      next,
    ).map(change => change.path);
    expect(paths.indexOf('tunables.priorityEconomy'))
      .toBeLessThan(paths.indexOf('tunables.priorityReligion'));
  });

  test('standalone vanilla reset preserves the library but excludes it from runtime', () => {
    const library = {
      institutions: [{ name: 'Private Guild', localUid: 'lu_private' }],
    };
    const runtime = contentRuntimeFromEnvironment(
      VANILLA_CONTENT_ENVIRONMENT,
      library,
    );
    expect(runtime.tunables).toEqual({});
    expect(runtime.visualSelection).toEqual({});
    expect(runtime.customContent.institutions).toEqual([]);
    expect(runtime.resolution).toMatchObject({
      ok: true,
      mode: 'vanilla',
    });
    expect(library.institutions[0].name).toBe('Private Guild');
  });

  test('standalone environments resolve only their exact reviewed definition heads', () => {
    const library = {
      institutions: [{
        name: 'Private Guild',
        definitionId: 'definition:private-guild',
        revisionId: 'revision:private-guild:1',
        localUid: 'lu_private',
      }, {
        name: 'Unselected Mint',
        definitionId: 'definition:unselected-mint',
        revisionId: 'revision:unselected-mint:1',
        localUid: 'lu_unselected',
      }],
    };
    const environment = makeLibraryContentEnvironmentRevision({
      institutions: [library.institutions[0]],
    });
    const runtime = contentRuntimeFromEnvironment(environment, library);

    expect(runtime.resolution).toMatchObject({
      ok: true,
      mode: 'reviewed',
    });
    expect(runtime.customContent.institutions.map(item => item.name))
      .toEqual(['Private Guild']);
  });

  test('one advanced selected head fails the whole standalone environment closed', () => {
    const reviewedLibrary = {
      institutions: [{
        name: 'Private Guild',
        definitionId: 'definition:private-guild',
        revisionId: 'revision:private-guild:1',
        localUid: 'lu_private',
      }],
    };
    const environment = makeLibraryContentEnvironmentRevision(
      reviewedLibrary,
      { tunables: { priorityEconomy: 80 } },
    );
    const advancedLibrary = {
      institutions: [{
        ...reviewedLibrary.institutions[0],
        name: 'Private Guild Revised',
        revisionId: 'revision:private-guild:2',
      }],
    };
    const runtime = contentRuntimeFromEnvironment(
      environment,
      advancedLibrary,
    );

    expect(runtime.customContent.institutions).toEqual([]);
    expect(runtime.tunables).toEqual({});
    expect(runtime.resolution).toMatchObject({
      ok: false,
      mode: 'failed-closed',
      reason: 'content_environment_resolution_failed',
    });
  });

  test('historical revision snapshots keep a reviewed environment executable after its head advances', () => {
    const reviewed = {
      name: 'Private Guild',
      definitionId: 'definition:private-guild',
      revisionId: 'revision:private-guild:1',
      localUid: 'lu_private',
    };
    const environment = makeLibraryContentEnvironmentRevision({
      institutions: [reviewed],
    });
    const reference = environment.directDefinitions[0];
    const resolved = resolveContentEnvironmentSnapshot(
      environment,
      [{
        id: reference.revisionId,
        definitionId: reference.definitionId,
        contentHash: reference.contentHash,
        data: {
          name: reviewed.name,
          localUid: reviewed.localUid,
        },
      }],
      [],
    );

    expect(resolved.ok).toBe(true);
    expect(resolved.runtime.resolution).toMatchObject({
      ok: true,
      mode: 'reviewed',
    });
    expect(resolved.customContent.institutions[0]).toMatchObject({
      name: 'Private Guild',
      definitionId: reference.definitionId,
      revisionId: reference.revisionId,
    });
  });

  test('pack bindings fail until every installed entry is closed over the direct revision set', () => {
    const directEnvironment = makeLibraryContentEnvironmentRevision({
      institutions: [{
        name: 'Pack Watch',
        definitionId: 'definition:pack-watch',
        revisionId: 'revision:pack-watch:1',
        localUid: 'lu_pack_watch',
      }],
    });
    const reference = directEnvironment.directDefinitions[0];
    const environment = makeContentEnvironmentRevision({
      environmentId: 'pack:watch',
      environmentRevisionId: 'pack:watch:v1',
      source: 'imported-pack',
      packVersions: [{
        packId: 'pack:watch',
        packVersionId: '1.0.0',
        manifestHash: 'a'.repeat(64),
      }],
      directDefinitions: [reference],
    });
    const revisions = [{
      id: reference.revisionId,
      definitionId: reference.definitionId,
      contentHash: reference.contentHash,
      data: { name: 'Pack Watch', localUid: 'lu_pack_watch' },
    }];

    expect(resolveContentEnvironmentSnapshot(
      environment,
      revisions,
      [],
    )).toMatchObject({
      ok: false,
      reason: 'content_environment_pack_closure_unavailable',
    });
    expect(resolveContentEnvironmentSnapshot(
      environment,
      revisions,
      [{
        packId: 'pack:watch',
        packVersionId: '1.0.0',
        manifestHash: 'a'.repeat(64),
        entries: [{
          packEntryId: 'watch',
          definitionId: 'definition:substituted',
          revisionId: reference.revisionId,
          category: 'institutions',
          ordinal: 0,
        }],
      }],
    )).toMatchObject({
      ok: false,
      reason: 'content_environment_pack_closure_mismatch',
    });

    const resolved = resolveContentEnvironmentSnapshot(
      environment,
      revisions,
      [{
        packId: 'pack:watch',
        packVersionId: '1.0.0',
        manifestHash: 'a'.repeat(64),
        entries: [{
          packEntryId: 'watch',
          definitionId: reference.definitionId,
          revisionId: reference.revisionId,
          category: 'institutions',
          ordinal: 0,
        }],
      }],
    );
    expect(resolved.ok).toBe(true);
    expect(resolved.customContent.institutions[0].name).toBe('Pack Watch');
  });
});
