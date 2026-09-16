import { describe, test, expect } from 'vitest';
import {
  buildContentPack, parseContentPack, prepareImport,
  PACK_BUCKETS, CONTENT_PACK_FORMAT,
} from '../../src/lib/contentPacks.js';
import { validateDeity } from '../../src/domain/customContentSchema.js';

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

// ─────────────────────────────────────────────────────────────────────────────
// UX Phase 8 — content-pack export/import. The two hard guarantees on import:
//   (1) RE-VALIDATION through the canonical manifest before category-specific
//       checks, and
//   (2) STABLE PACK IDENTITY — deterministic localUids + dependency-ref rewrite
//       so an update targets the same pack-owned definition.
// ─────────────────────────────────────────────────────────────────────────────

describe('buildContentPack', () => {
  test('serializes only the authoring lanes and strips device-local metadata', () => {
    const cc = {
      institutions: [{ name: 'Foundry', localUid: 'lu_a', id: 'inst_1', createdAt: 'x', updatedAt: 'y', isCustom: true, _schemaVersion: 1 }],
      deities: [{ name: 'Mara', alignmentAxis: 'good', temperamentAxis: 'peacelike', rankAxis: 'major' }],
      // dead bucket — must NOT appear in the pack.
      powerPresets: [{ name: 'should not ship' }],
    };
    const pack = buildContentPack(cc);
    expect(pack.format).toBe(CONTENT_PACK_FORMAT);
    expect(Object.keys(pack.content).sort()).toEqual([...PACK_BUCKETS].sort());
    const inst = pack.content.institutions[0];
    expect(inst.name).toBe('Foundry');
    expect(inst.localUid).toBe('lu_a'); // localUid preserved for re-namespacing
    expect(inst.id).toBeUndefined();    // device-local metadata stripped
    expect(inst.createdAt).toBeUndefined();
    expect(inst._schemaVersion).toBeUndefined();
    // dead buckets never serialize
    expect(pack.content.powerPresets).toBeUndefined();
  });

  test('round-trips an immutable definition head without leaking store metadata', () => {
    const revisioned = {
      name: 'Revisioned Foundry',
      localUid: 'lu_revisioned_foundry',
      definitionId: 'definition:foundry',
      revisionId: 'revision:foundry:4',
      revisionNumber: 4,
      contentHash: 'sha256:store-projection',
      isCustom: true,
      _schemaVersion: 1,
    };
    const pack = buildContentPack({ institutions: [revisioned] });
    const exported = pack.content.institutions[0];

    expect(exported).not.toHaveProperty('definitionId');
    expect(exported).not.toHaveProperty('revisionId');
    expect(exported).not.toHaveProperty('revisionNumber');
    expect(exported.sourceDefinitionId).toBe(revisioned.definitionId);
    expect(exported.sourceRevisionId).toBe(revisioned.revisionId);

    const parsed = parseContentPack(pack);
    expect(parsed.ok).toBe(true);
    const imported = prepareImport(parsed.pack);
    expect(imported.rejected).toEqual([]);
    expect(imported.items[0].item).toMatchObject({
      name: revisioned.name,
    });
    expect(imported.items[0].item).not.toHaveProperty('definitionId');
    expect(imported.items[0].item).not.toHaveProperty('revisionId');
    expect(imported.items[0]).toMatchObject({
      sourceDefinitionId: revisioned.definitionId,
      sourceRevisionId: revisioned.revisionId,
      sourceContentHash: exported.contentHash,
    });
  });

  test('makes legacy source definition and revision identities explicit', () => {
    const pack = buildContentPack({
      institutions: [{
        name: 'Legacy Foundry',
        localUid: 'lu_legacy_foundry',
      }],
    });
    const entry = pack.content.institutions[0];

    expect(entry.sourceDefinitionId).toBe('lu_legacy_foundry');
    expect(entry.sourceRevisionId)
      .toBe(`legacy-revision:${entry.contentHash}`);
    const imported = prepareImport(parseContentPack(pack).pack).items[0];
    expect(imported).toMatchObject({
      sourceDefinitionId: entry.sourceDefinitionId,
      sourceRevisionId: entry.sourceRevisionId,
    });
  });

  test('falls back to stable portable entry identity and canonicalizes opaque local UIDs', () => {
    const content = {
      institutions: [{
        name: 'L’Observatoire des Étoiles / West',
        packEntryId: 'not a portable / identifier',
        localUid: '  opaque uid with spaces  ',
      }],
    };

    const first = buildContentPack(content);
    const second = buildContentPack(content);
    const firstEntry = first.content.institutions[0];

    expect(firstEntry.packEntryId).toMatch(
      /^entry:institutions:[a-f0-9]{32}$/,
    );
    expect(firstEntry.packEntryId)
      .toBe(second.content.institutions[0].packEntryId);
    expect(firstEntry.localUid).toBe('opaque uid with spaces');
    expect(parseContentPack(first)).toMatchObject({ ok: true });
  });

  test('rejects unresolved pack dependencies and bounds descriptive metadata', () => {
    expect(() => buildContentPack({}, {
      dependencies: [{ packId: 'pack:unresolved', version: '1.0.0' }],
    })).toThrow(/dependencies are not supported/i);
    expect(() => buildContentPack({}, {
      dependencies: 'pack:unresolved',
    })).toThrow(/dependencies must be an array/i);
    expect(() => buildContentPack({}, {
      name: 'x'.repeat(161),
    })).toThrow(/160-character limit/i);
    expect(() => buildContentPack({}, {
      description: 'x'.repeat(8_001),
    })).toThrow(/8000-character limit/i);
    expect(() => buildContentPack({}, {
      authorship: { biography: 'x'.repeat(4_001) },
    })).toThrow(/4000-character metadata limit/i);
  });
});

describe('parseContentPack', () => {
  test('rejects non-packs and accepts a real pack', () => {
    expect(parseContentPack('not json').ok).toBe(false);
    expect(parseContentPack({}).ok).toBe(false);
    expect(parseContentPack({ format: 'something-else', content: {} }).ok).toBe(false);
    const pack = buildContentPack({ institutions: [{ name: 'A', localUid: 'lu_x' }] });
    expect(parseContentPack(JSON.stringify(pack)).ok).toBe(true);
  });

  test('admits only the complete v2 manifest and exact compatibility vocabulary', () => {
    const source = buildContentPack({
      institutions: [{ name: 'Boundary Hall', localUid: 'lu_boundary' }],
    });

    const unknownTopLevel = cloneJson(source);
    unknownTopLevel.runtimePlugin = 'unreviewed';
    expect(parseContentPack(unknownTopLevel).error)
      .toMatch(/content pack contains unsupported fields: runtimePlugin/i);

    const missingTopLevel = cloneJson(source);
    delete missingTopLevel.license;
    expect(parseContentPack(missingTopLevel).error)
      .toMatch(/missing required fields: license/i);

    const unknownCompatibility = cloneJson(source);
    unknownCompatibility.compatibility.rendererVersion = 3;
    expect(parseContentPack(unknownCompatibility).error)
      .toMatch(/compatibility contains unsupported fields: rendererVersion/i);

    const missingCompatibility = cloneJson(source);
    delete missingCompatibility.compatibility.maxAppVersion;
    expect(parseContentPack(missingCompatibility).error)
      .toMatch(/compatibility is missing required fields: maxAppVersion/i);

    const nullTunables = cloneJson(source);
    nullTunables.tunables = null;
    expect(parseContentPack(nullTunables).error)
      .toMatch(/tunables must be an object/i);

    const nullVisualSelection = cloneJson(source);
    nullVisualSelection.visualSelection = null;
    expect(parseContentPack(nullVisualSelection).error)
      .toMatch(/visualSelection must be an object/i);
  });

  test('canonicalizes uploaded local UIDs before verifying entry and manifest hashes', () => {
    const pack = cloneJson(buildContentPack({
      institutions: [{
        name: 'Opaque Address Hall',
        localUid: 'opaque uid with spaces',
      }],
    }));
    pack.content.institutions[0].localUid = '  opaque uid with spaces  ';

    const parsed = parseContentPack(pack);

    expect(parsed).toMatchObject({ ok: true });
    expect(parsed.pack.content.institutions[0].localUid)
      .toBe('opaque uid with spaces');
  });

  test('rejects dependency claims and overlong text before manifest verification', () => {
    const dependencyClaim = cloneJson(buildContentPack({}));
    dependencyClaim.dependencies = [{ packId: 'pack:not-resolved' }];
    expect(parseContentPack(dependencyClaim).error)
      .toMatch(/dependencies are not supported/i);

    const longDescription = cloneJson(buildContentPack({}));
    longDescription.description = 'x'.repeat(8_001);
    expect(parseContentPack(longDescription).error)
      .toMatch(/8000-character limit/i);
  });

  test('keeps the bounded one-way v1 adapter and rejects duplicate JSON keys', () => {
    const legacy = {
      format: CONTENT_PACK_FORMAT,
      version: 1,
      name: 'Legacy Observatory Pack',
      exportedAt: '2026-01-02T03:04:05.000Z',
      content: {
        institutions: [{
          name: 'Legacy Observatory',
          packEntryId: 'invalid legacy / id',
          localUid: '  legacy opaque uid  ',
        }],
      },
    };

    const first = parseContentPack(legacy);
    const second = parseContentPack(cloneJson(legacy));

    expect(first).toMatchObject({
      ok: true,
      adaptedFromVersion: 1,
      warnings: [expect.stringMatching(/adapted to v2/i), expect.any(String)],
    });
    expect(first.pack.content.institutions[0].localUid)
      .toBe('legacy opaque uid');
    expect(first.pack.content.institutions[0].packEntryId)
      .toBe(second.pack.content.institutions[0].packEntryId);
    expect(first.pack.content.institutions[0].packEntryId)
      .toMatch(/^entry:institutions:[a-f0-9]{32}$/);

    const duplicateKeys = `{
      "format":"${CONTENT_PACK_FORMAT}",
      "format":"${CONTENT_PACK_FORMAT}",
      "version":1,
      "content":{}
    }`;
    expect(parseContentPack(duplicateKeys)).toMatchObject({ ok: false });
  });
});

describe('prepareImport — re-namespace + re-validate', () => {
  test('mints fresh localUids and rewrites intra-pack dependency refs (collision-free)', () => {
    // An institution that REQUIRES a custom resource in the same pack. The dep
    // value is the resource's custom refId — it must be rewritten to the
    // resource's NEW uid on import.
    const cc = {
      resources: [{ name: 'Iron Ore', localUid: 'lu_ore' }],
      institutions: [{ name: 'Foundry', localUid: 'lu_foundry', requires: ['custom:lu_ore', 'prebuilt:resources:timber'] }],
    };
    const pack = buildContentPack(cc);
    const { items, counts } = prepareImport(pack);

    const ore = items.find(i => i.item.name === 'Iron Ore').item;
    const foundry = items.find(i => i.item.name === 'Foundry').item;

    // Fresh uids — never the originals (collision-free re-import).
    expect(ore.localUid).not.toBe('lu_ore');
    expect(foundry.localUid).not.toBe('lu_foundry');

    // The intra-pack ref was rewritten to the resource's NEW uid…
    expect(foundry.requires).toContain(`custom:${ore.localUid}`);
    expect(foundry.requires).not.toContain('custom:lu_ore');
    // …and the prebuilt ref (globally stable) is kept verbatim.
    expect(foundry.requires).toContain('prebuilt:resources:timber');

    expect(counts.resources).toBe(1);
    expect(counts.institutions).toBe(1);
  });

  test('rejects a dangling custom dependency instead of silently changing meaning', () => {
    const pack = buildContentPack({
      institutions: [{ name: 'Orphan', localUid: 'lu_o', requires: ['custom:lu_missing', 'prebuilt:resources:timber'] }],
    });
    const result = prepareImport(pack);
    expect(result.items).toEqual([]);
    expect(result.rejected).toEqual([
      expect.objectContaining({
        name: 'Orphan',
        errors: expect.arrayContaining([
          expect.stringMatching(/not included in this pack/i),
        ]),
      }),
    ]);
    expect(result.diagnostics.atomic).toBe(false);
    expect(result.diagnostics.missingDependencies).toEqual([
      expect.objectContaining({ refId: 'custom:lu_missing' }),
    ]);
  });

  test('re-validates deity axes through the canonical manifest', () => {
    const pack = buildContentPack({
      deities: [
        { name: 'Valid', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major', localUid: 'lu_v' },
        { name: 'Bad', alignmentAxis: 'lawful-good', temperamentAxis: 'warlike', rankAxis: 'major', localUid: 'lu_b' },
      ],
    });
    const { items, rejected } = prepareImport(pack);
    expect(items.map(i => i.item.name)).toEqual(['Valid']);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].name).toBe('Bad');
    // The manifest is the pack admission authority for category semantics.
    expect(rejected[0].errors).toContain('alignmentAxis: invalid_value');
  });

  // ── B5: the 4th axis (lawAxis) in validateDeity ────────────────────────────
  test('validateDeity requires the first three axes; lawAxis is back-compat tolerant', () => {
    const threeAxis = { name: 'Old', alignmentAxis: 'good', temperamentAxis: 'neutral', rankAxis: 'minor' };
    // A legacy 3-axis deity (no lawAxis) STILL validates (tolerated as neutral).
    expect(validateDeity(threeAxis).ok).toBe(true);
    // A valid 4th axis is accepted.
    expect(validateDeity({ ...threeAxis, lawAxis: 'lawful' }).ok).toBe(true);
    expect(validateDeity({ ...threeAxis, lawAxis: 'chaotic' }).ok).toBe(true);
    expect(validateDeity({ ...threeAxis, lawAxis: 'neutral' }).ok).toBe(true);
    // A PRESENT-but-invalid lawAxis is rejected (a typo can't slip through).
    const bad = validateDeity({ ...threeAxis, lawAxis: 'orderly' });
    expect(bad.ok).toBe(false);
    expect(bad.errors.some(e => /lawAxis/.test(e))).toBe(true);
  });

  test('re-importing the same pack resolves the same pack-owned identity', () => {
    const pack = buildContentPack({ deities: [{ name: 'Mara', alignmentAxis: 'good', temperamentAxis: 'peacelike', rankAxis: 'minor', localUid: 'lu_m' }] });
    const first = prepareImport(pack).items[0].item.localUid;
    const second = prepareImport(pack).items[0].item.localUid;
    expect(first).toBe(second);
    expect(first).not.toBe('lu_m');
    expect(second).not.toBe('lu_m');
  });
});
