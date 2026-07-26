/**
 * Adversarial corpus for the custom-content extension wall.
 *
 * These cases pin the product doctrine at hostile-input boundaries: authored
 * imagination may be broad, but persisted meaning remains bounded JSON,
 * registered fields, registered tunables, and reviewed fingerprints. None of
 * these checks depends on the UI having behaved correctly.
 */

import { describe, expect, it } from 'vitest';

import {
  admitCampaignContentBinding,
  admitContentEnvironmentRevision,
  makeCampaignContentBinding,
  makeContentEnvironmentRevision,
} from '../../src/domain/content/contentEnvironment.js';
import {
  CUSTOM_CONTENT_COMMAND_KIND,
  previewCustomContentCommand,
  verifyCustomContentPreview,
} from '../../src/domain/content/customContentCommands.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  fingerprintContent,
} from '../../src/domain/content/contentFingerprint.js';
import {
  buildContentPack,
  parseContentPack,
  prepareImport,
} from '../../src/lib/contentPacks.js';

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

describe('custom-content hostile JSON admission', () => {
  it('rejects dangerous object keys without mutating global prototypes', () => {
    const pack = cloneJson(buildContentPack({
      institutions: [{ name: 'Safe Foundry', localUid: 'lu_safe' }],
    }));
    pack.authorship = JSON.parse('{"__proto__":{"polluted":"yes"}}');

    const parsed = parseContentPack(pack);

    expect(parsed).toMatchObject({ ok: false });
    expect(parsed.error).toMatch(/__proto__.*not allowed/i);
    expect({}.polluted).toBeUndefined();
  });

  it('rejects cycles, excessive depth, and oversized object or string inputs', () => {
    const cyclic = cloneJson(buildContentPack({
      institutions: [{ name: 'Cyclic Hall', localUid: 'lu_cycle' }],
    }));
    cyclic.source = {};
    cyclic.source.self = cyclic.source;
    expect(parseContentPack(cyclic).error).toMatch(/serializable json/i);

    const deep = cloneJson(buildContentPack({
      institutions: [{ name: 'Deep Hall', localUid: 'lu_deep' }],
    }));
    let cursor = {};
    deep.source = cursor;
    for (let index = 0; index < 45; index += 1) {
      cursor.next = {};
      cursor = cursor.next;
    }
    expect(parseContentPack(deep).error).toMatch(/depth limit/i);

    const oversized = cloneJson(buildContentPack({
      institutions: [{ name: 'Large Hall', localUid: 'lu_large' }],
    }));
    oversized.description = 'x'.repeat((2 * 1024 * 1024) + 1);
    expect(parseContentPack(oversized).error).toMatch(/2 mib import limit/i);
    expect(parseContentPack(JSON.stringify(oversized)).error)
      .toMatch(/2 mib import limit/i);
  });

  it('detects duplicate pack identities and both entry and manifest tampering', () => {
    const duplicate = buildContentPack({
      institutions: [
        { name: 'First Hall', packEntryId: 'shared-entry' },
        { name: 'Second Hall', packEntryId: 'shared-entry' },
      ],
    });
    expect(parseContentPack(duplicate).error).toMatch(/duplicate packentryid/i);

    const original = buildContentPack({
      institutions: [{ name: 'Sealed Hall', localUid: 'lu_sealed' }],
    });
    const entryTamper = cloneJson(original);
    entryTamper.content.institutions[0].name = 'Rewritten Hall';
    expect(parseContentPack(entryTamper).error).toMatch(/content hash mismatch/i);

    const manifestTamper = cloneJson(original);
    manifestTamper.description = 'A description added after signing.';
    expect(parseContentPack(manifestTamper).error).toMatch(/manifest hash/i);
  });

  it('retains unsupported creative fields only as rejected authorial requests', () => {
    const pack = buildContentPack({
      institutions: [{
        name: 'Unbounded Observatory',
        localUid: 'lu_observatory',
        meshUrl: 'https://untrusted.invalid/observatory.glb',
        shader: 'void main() { execute_arbitrary_code(); }',
        formula: 'economy = Infinity',
      }],
    });
    const parsed = parseContentPack(pack);
    expect(parsed.ok).toBe(true);

    const prepared = prepareImport(parsed.pack);
    expect(prepared.items).toEqual([]);
    expect(prepared.diagnostics.atomic).toBe(false);
    expect(prepared.rejected[0].errors).toEqual(expect.arrayContaining([
      'meshUrl: unregistered_field',
      'shader: unregistered_field',
      'formula: unregistered_field',
    ]));
  });
});

describe('custom-content command and environment admission', () => {
  it('rejects duplicate stable identities before local or cloud execution', () => {
    expect(() => previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.MASS_UPDATE,
      entries: [
        {
          definitionId: '11111111-1111-4111-8111-111111111111',
          category: 'institutions',
          data: { name: 'First Hall', localUid: 'lu_first' },
        },
        {
          definitionId: '11111111-1111-4111-8111-111111111111',
          category: 'services',
          data: { name: 'Second Hall', localUid: 'lu_second' },
        },
      ],
    })).toThrow(/repeats definitionId/);

    expect(() => previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT,
      pack: {
        packId: 'pack:duplicate-entry',
        packVersion: '1.0.0',
        name: 'Duplicate Entry',
        manifestHash: 'a'.repeat(64),
      },
      entries: [
        {
          category: 'institutions',
          packEntryId: 'same-entry',
          data: { name: 'First Hall', localUid: 'lu_pack_first' },
        },
        {
          category: 'services',
          packEntryId: 'same-entry',
          data: { name: 'Second Hall', localUid: 'lu_pack_second' },
        },
      ],
    })).toThrow(/repeats packEntryId/);

    expect(() => previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.MASS_UPDATE,
      entries: [
        {
          definitionId: '22222222-2222-4222-8222-222222222222',
          category: 'institutions',
          data: { name: 'First Hall', localUid: 'lu_duplicate' },
        },
        {
          definitionId: '33333333-3333-4333-8333-333333333333',
          category: 'services',
          data: { name: 'Second Hall', localUid: 'lu_duplicate' },
        },
      ],
    })).toThrow(/repeats data.localUid/);
  });

  it('admits only integer tunables so browser and PostgreSQL hashes agree', () => {
    expect(() => makeContentEnvironmentRevision({
      environmentId: 'unsafe-decimal',
      environmentRevisionId: 'unsafe-decimal:v1',
      tunables: { priorityEconomy: 0.0000001 },
    })).toThrow(/tunables contains unsupported values/i);
  });

  it('canonicalizes durable local identities before fingerprinting', () => {
    const preview = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
      entries: [{
        category: 'institutions',
        data: {
          name: 'Canonical Hall',
          localUid: '  canonical-hall  ',
        },
      }],
    });

    expect(preview.plan.entries[0].data.localUid).toBe('canonical-hall');
    expect(() => previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
      entries: [{
        category: 'institutions',
        data: {
          name: 'Identityless Hall',
          localUid: '   ',
        },
      }],
    })).toThrow(/localUid: invalid_system_field/);
  });

  it('rejects unregistered or out-of-range tunables at environment construction', () => {
    expect(() => makeContentEnvironmentRevision({
      environmentId: 'environment:test',
      environmentRevisionId: 'environment:test:v1',
      tunables: { pulsePhysicsMultiplier: 99 },
    })).toThrow(/unsupported values.*pulsePhysicsMultiplier/i);

    expect(() => makeContentEnvironmentRevision({
      environmentId: 'environment:test',
      environmentRevisionId: 'environment:test:v1',
      tunables: { priorityEconomy: 101 },
    })).toThrow(/unsupported values.*priorityEconomy/i);
  });

  it('rejects environment fields that would be stored but ignored at runtime', () => {
    const environment = makeContentEnvironmentRevision({
      environmentId: 'environment:strict',
      environmentRevisionId: 'environment:strict:v1',
      packVersions: [{
        packId: 'pack:strict',
        packVersionId: '1.0.0',
        manifestHash: 'a'.repeat(64),
      }],
    });
    const topLevelExtra = cloneJson(environment);
    topLevelExtra.unreviewedPolicy = { formula: 'priorityEconomy = Infinity' };
    expect(admitContentEnvironmentRevision(topLevelExtra)).toMatchObject({
      ok: false,
      reason: 'content_environment_shape_mismatch',
    });

    const nestedExtra = cloneJson(environment);
    nestedExtra.packVersions[0].unreviewedLoader = 'https://untrusted.invalid';
    expect(admitContentEnvironmentRevision(nestedExtra)).toMatchObject({
      ok: false,
      reason: 'content_environment_invalid',
    });

    const unsupportedVersion = cloneJson(environment);
    unsupportedVersion.schemaVersion = 2;
    expect(admitContentEnvironmentRevision(unsupportedVersion)).toMatchObject({
      ok: false,
      reason: 'content_environment_version_unsupported',
    });
  });

  it('requires canonical hashes and registered categories in environment references', () => {
    expect(() => makeContentEnvironmentRevision({
      environmentId: 'environment:bad-pack-hash',
      environmentRevisionId: 'environment:bad-pack-hash:v1',
      packVersions: [{
        packId: 'pack:bad-hash',
        packVersionId: '1.0.0',
        manifestHash: 'claimed-but-not-a-hash',
      }],
    })).toThrow(/sha-256 fingerprint/i);

    expect(() => makeContentEnvironmentRevision({
      environmentId: 'environment:bad-definition',
      environmentRevisionId: 'environment:bad-definition:v1',
      directDefinitions: [{
        definitionId: 'definition:one',
        revisionId: 'revision:one',
        contentHash: 'b'.repeat(64),
        category: 'executableShaders',
      }],
    })).toThrow(/category is unsupported/i);
  });

  it('bounds command batches and makes reviewed previews tamper-evident', () => {
    const entry = {
      category: 'institutions',
      data: { name: 'Review Hall' },
    };
    expect(() => previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.MASS_UPDATE,
      entries: Array.from({ length: 1_001 }, () => entry),
    })).toThrow(/at most 1000/i);

    const preview = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
      entries: [entry],
    });
    expect(verifyCustomContentPreview(preview.plan, preview.fingerprint)).toBe(true);
    expect(verifyCustomContentPreview({
      ...preview.plan,
      entries: [{
        ...preview.plan.entries[0],
        data: { name: 'Changed After Review' },
      }],
    }, preview.fingerprint)).toBe(false);
  });

  it('fingerprints authored pack meaning independently of installation state', () => {
    const packId = 'pack:semantic-identity';
    const packVersion = '1.0.0';
    const packEntryId = 'entry:semantic-hall';
    const makeInput = ({
      name,
      definitionId,
      expectedHeadRevisionId,
      expectedActivePackVersion = null,
      expectedActiveManifestHash = null,
    }) => {
      const manifest = buildContentPack({
        institutions: [{
          name,
          localUid: 'semantic-hall',
          packEntryId,
        }],
      }, {
        packId,
        packVersion,
        name: 'Semantic Identity',
      });
      const prepared = prepareImport(manifest);
      expect(prepared.rejected).toEqual([]);
      return {
        pack: {
          packId,
          packVersion,
          name: manifest.name,
          manifestHash: manifest.manifestHash,
          manifest,
          expectedActivePackVersion,
          expectedActiveManifestHash,
        },
        entries: [{
          definitionId,
          expectedHeadRevisionId,
          category: prepared.items[0].bucket,
          packEntryId,
          data: prepared.items[0].item,
        }],
      };
    };
    const initial = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT,
      ...makeInput({ name: 'Semantic Hall' }),
    });
    const installed = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT,
      ...makeInput({
        name: 'Semantic Hall',
        definitionId: '11111111-1111-4111-8111-111111111111',
        expectedHeadRevisionId:
          '22222222-2222-4222-8222-222222222222',
        expectedActivePackVersion: '1.0.0',
        expectedActiveManifestHash: initial.plan.pack.manifestHash,
      }),
    });
    const changed = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT,
      ...makeInput({
        name: 'Semantically Changed Hall',
        definitionId: '11111111-1111-4111-8111-111111111111',
        expectedHeadRevisionId:
          '22222222-2222-4222-8222-222222222222',
        expectedActivePackVersion: '1.0.0',
        expectedActiveManifestHash: initial.plan.pack.manifestHash,
      }),
    });

    expect(installed.plan.pack.importPlanHash)
      .toBe(initial.plan.pack.importPlanHash);
    expect(changed.plan.pack.importPlanHash)
      .not.toBe(initial.plan.pack.importPlanHash);
  });

  it('fails campaign bindings closed when frozen definition content is altered', () => {
    const binding = makeCampaignContentBinding({
      institutions: [{
        name: 'Pinned Foundry',
        definitionId: 'definition:pinned-foundry',
        revisionId: 'revision:pinned-foundry:1',
      }],
    });
    const tampered = cloneJson(binding);
    tampered.resolvedDefinitions[0].data.name = 'Silently Reinterpreted Foundry';

    expect(admitCampaignContentBinding(tampered)).toMatchObject({
      ok: false,
      reason: 'content_binding_invalid',
    });
  });

  it('rejects duplicate portable reference identities across definitions', () => {
    expect(() => makeCampaignContentBinding({
      institutions: [
        {
          name: 'First Hall',
          definitionId: 'definition:first-hall',
          revisionId: 'revision:first-hall:1',
          localUid: 'lu_shared_reference',
        },
        {
          name: 'Second Hall',
          definitionId: 'definition:second-hall',
          revisionId: 'revision:second-hall:1',
          localUid: 'lu_shared_reference',
        },
      ],
    })).toThrow(/duplicate resolved localUid/i);

    const binding = makeCampaignContentBinding({
      institutions: [
        {
          name: 'First Hall',
          definitionId: 'definition:first-hall',
          revisionId: 'revision:first-hall:1',
          localUid: 'lu_first_reference',
        },
        {
          name: 'Second Hall',
          definitionId: 'definition:second-hall',
          revisionId: 'revision:second-hall:1',
          localUid: 'lu_second_reference',
        },
      ],
    });
    const tampered = cloneJson(binding);
    const second = tampered.resolvedDefinitions[1];
    second.data.localUid = 'lu_first_reference';
    second.contentHash = contentRevisionHash(second.category, second.data);
    tampered.environment = makeContentEnvironmentRevision({
      ...tampered.environment,
      directDefinitions: tampered.resolvedDefinitions.map(definition => ({
        definitionId: definition.definitionId,
        revisionId: definition.revisionId,
        contentHash: definition.contentHash,
        category: definition.category,
      })),
    });
    tampered.bindingHash = fingerprintContent({
      schemaVersion: tampered.schemaVersion,
      source: tampered.source,
      environment: tampered.environment,
      resolvedDefinitions: tampered.resolvedDefinitions,
    });

    expect(admitCampaignContentBinding(tampered)).toMatchObject({
      ok: false,
      reason: 'content_binding_invalid',
    });
  });

  it('rejects a re-hashed binding whose frozen data violates the manifest', () => {
    const binding = makeCampaignContentBinding({
      institutions: [{
        name: 'Bounded Hall',
        localUid: 'bounded-hall',
        definitionId: 'definition:bounded-hall',
        revisionId: 'revision:bounded-hall:1',
      }],
    });
    const tampered = cloneJson(binding);
    const resolved = tampered.resolvedDefinitions[0];
    resolved.data.shader = 'arbitrary-shader-source';
    resolved.contentHash = contentRevisionHash(
      resolved.category,
      resolved.data,
    );
    tampered.environment = makeContentEnvironmentRevision({
      ...tampered.environment,
      directDefinitions: [{
        definitionId: resolved.definitionId,
        revisionId: resolved.revisionId,
        contentHash: resolved.contentHash,
        category: resolved.category,
      }],
    });
    tampered.bindingHash = fingerprintContent({
      schemaVersion: tampered.schemaVersion,
      source: tampered.source,
      environment: tampered.environment,
      resolvedDefinitions: tampered.resolvedDefinitions,
    });

    expect(admitCampaignContentBinding(tampered)).toMatchObject({
      ok: false,
      reason: 'content_binding_invalid',
    });
  });

  it('rejects ignored fields even when the binding hash still matches its known core', () => {
    const binding = makeCampaignContentBinding({
      institutions: [{
        name: 'Strictly Pinned Hall',
        definitionId: 'definition:strict-hall',
        revisionId: 'revision:strict-hall:1',
      }],
    });
    const tampered = cloneJson(binding);
    tampered.resolvedDefinitions[0].runtimePlugin = 'unreviewed';

    // The legacy implementation hashed only the reconstructed known core, so
    // the original hash still matched and the extra field silently vanished.
    expect(admitCampaignContentBinding(tampered)).toMatchObject({
      ok: false,
      reason: 'content_binding_shape_mismatch',
    });
  });
});
