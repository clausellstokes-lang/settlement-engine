import { describe, expect, it } from 'vitest';

import {
  inspectSceneOverrideOrphans,
  relinkSceneOverrideOrphan,
  removeSceneOverrideOrphan,
  sceneOverrideTargets,
} from '../../src/domain/townMap/sceneOverrideOrphans.js';

const manifest = {
  buildings: [
    {
      id: 'building:guild',
      semanticId: 'building:guild',
      anchorKey: 'institution:guild',
    },
    {
      id: 'building:market',
      semanticId: 'building:market',
      anchorKey: 'institution:market',
    },
  ],
  semantics: [
    { sceneId: 'building:guild', label: 'Masons Guild' },
    { sceneId: 'building:market', label: 'Covered Market' },
  ],
};

describe('scene override orphan handling', () => {
  it('reports missing anchors without mutating the saved overlay', () => {
    const edits = {
      layoutVariant: 2,
      sceneOverrides: [
        { anchor: 'institution:market', skinId: 'stoneAshlar' },
        { anchor: 'institution:gone', skinId: 'timberVillage', headingOffsetStep: 17 },
        { anchor: 'institution:invalid', skinId: 'not-a-skin' },
      ],
    };
    const before = structuredClone(edits);

    expect(sceneOverrideTargets(manifest)).toEqual([
      {
        anchor: 'institution:market',
        sceneId: 'building:market',
        label: 'Covered Market',
      },
      {
        anchor: 'institution:guild',
        sceneId: 'building:guild',
        label: 'Masons Guild',
      },
    ]);
    expect(inspectSceneOverrideOrphans(edits, manifest)).toEqual({
      orphans: [{
        anchor: 'institution:gone',
        override: {
          anchor: 'institution:gone',
          skinId: 'timberVillage',
          headingOffsetStep: 1,
        },
      }],
      targets: sceneOverrideTargets(manifest),
      availableTargets: [{
        anchor: 'institution:guild',
        sceneId: 'building:guild',
        label: 'Masons Guild',
      }],
    });
    expect(edits).toEqual(before);
  });

  it('removes only a still-orphaned override and preserves unrelated map edits', () => {
    const edits = {
      layoutVariant: 2,
      sceneOverrides: [
        { anchor: 'institution:gone', skinId: 'timberVillage' },
        { anchor: 'institution:market', headingOffsetStep: 3 },
      ],
    };

    expect(removeSceneOverrideOrphan(
      edits,
      manifest,
      'institution:market',
    )).toMatchObject({
      ok: false,
      reason: 'not-orphan',
      edits,
    });
    expect(removeSceneOverrideOrphan(
      edits,
      manifest,
      'institution:gone',
    )).toEqual({
      ok: true,
      edits: {
        layoutVariant: 2,
        sceneOverrides: [{
          anchor: 'institution:market',
          headingOffsetStep: 3,
        }],
      },
    });
  });

  it('relinks atomically to an explicit unoccupied canonical target', () => {
    const edits = {
      pins: [{ anchor: 'district:market', dx: 4, dy: -2 }],
      sceneOverrides: [
        {
          anchor: 'institution:gone',
          variantId: 'mirror',
          skinId: 'timberVillage',
          headingOffsetStep: -2,
        },
        { anchor: 'institution:market', skinId: 'stoneAshlar' },
      ],
    };

    expect(relinkSceneOverrideOrphan(
      edits,
      manifest,
      'institution:gone',
      'institution:market',
    )).toMatchObject({
      ok: false,
      reason: 'target-occupied',
    });
    expect(relinkSceneOverrideOrphan(
      edits,
      manifest,
      'institution:gone',
      'institution:missing',
    )).toMatchObject({
      ok: false,
      reason: 'missing-target',
    });

    const result = relinkSceneOverrideOrphan(
      edits,
      manifest,
      'institution:gone',
      'institution:guild',
    );
    expect(result).toEqual({
      ok: true,
      target: {
        anchor: 'institution:guild',
        sceneId: 'building:guild',
        label: 'Masons Guild',
      },
      edits: {
        pins: [{ anchor: 'district:market', dx: 4, dy: -2 }],
        sceneOverrides: [
          {
            anchor: 'institution:guild',
            variantId: 'mirror',
            skinId: 'timberVillage',
            headingOffsetStep: -2,
          },
          { anchor: 'institution:market', skinId: 'stoneAshlar' },
        ],
      },
    });
    expect(edits.sceneOverrides[0].anchor).toBe('institution:gone');
  });
});
