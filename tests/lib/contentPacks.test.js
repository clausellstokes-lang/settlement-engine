import { describe, test, expect } from 'vitest';
import {
  buildContentPack, parseContentPack, prepareImport,
  PACK_BUCKETS, CONTENT_PACK_FORMAT,
} from '../../src/lib/contentPacks.js';
import { validateDeity } from '../../src/domain/customContentSchema.js';

// ─────────────────────────────────────────────────────────────────────────────
// UX Phase 8 — content-pack export/import. The two hard guarantees on import:
//   (1) RE-VALIDATION through validateDeity (the engine/store/DB check), and
//   (2) RE-NAMESPACING — fresh localUids + dependency-ref rewrite, collision-free.
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
});

describe('parseContentPack', () => {
  test('rejects non-packs and accepts a real pack', () => {
    expect(parseContentPack('not json').ok).toBe(false);
    expect(parseContentPack({}).ok).toBe(false);
    expect(parseContentPack({ format: 'something-else', content: {} }).ok).toBe(false);
    const pack = buildContentPack({ institutions: [{ name: 'A', localUid: 'lu_x' }] });
    expect(parseContentPack(JSON.stringify(pack)).ok).toBe(true);
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

  test('drops a custom dep ref that points outside the pack (cannot resolve)', () => {
    const pack = buildContentPack({
      institutions: [{ name: 'Orphan', localUid: 'lu_o', requires: ['custom:lu_missing', 'prebuilt:resources:timber'] }],
    });
    const { items } = prepareImport(pack);
    const orphan = items[0].item;
    expect(orphan.requires).toEqual(['prebuilt:resources:timber']); // dangling custom ref dropped
  });

  test('re-validates deities through validateDeity — a bad axis is rejected, valid ones accepted', () => {
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
    // The rejection IS validateDeity's verdict (single source).
    expect(rejected[0].errors).toEqual(validateDeity({ name: 'Bad', alignmentAxis: 'lawful-good', temperamentAxis: 'warlike', rankAxis: 'major' }).errors);
  });

  test('re-importing the SAME pack twice never produces colliding uids', () => {
    const pack = buildContentPack({ deities: [{ name: 'Mara', alignmentAxis: 'good', temperamentAxis: 'peacelike', rankAxis: 'minor', localUid: 'lu_m' }] });
    const first = prepareImport(pack).items[0].item.localUid;
    const second = prepareImport(pack).items[0].item.localUid;
    expect(first).not.toBe(second);
    expect(first).not.toBe('lu_m');
    expect(second).not.toBe('lu_m');
  });
});
