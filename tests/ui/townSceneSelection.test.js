import { describe, expect, it, vi } from 'vitest';

import { mirrorTownSceneSelection } from '../../src/components/townMap/townSceneSelection.js';

const wrapper = {
  getBoundingClientRect: () => ({
    left: 20,
    top: 30,
    width: 400,
    height: 300,
  }),
};

function baseInput(overrides = {}) {
  return {
    sceneIdOrSemantic: null,
    explicitSemantic: null,
    model: {
      buildings: [],
      districts: [],
      overlays: { conditions: [], hazards: [] },
    },
    settlement: {},
    wrapper,
    districtPayload: vi.fn((district) => ({ mapDistrict: district })),
    setPinned: vi.fn(),
    ...overrides,
  };
}

describe('TownScene selection bridge', () => {
  it('clears the shared inspector when the scene clears selection', () => {
    const input = baseInput();

    mirrorTownSceneSelection(input);

    expect(input.setPinned).toHaveBeenCalledWith(null);
  });

  it('keeps scene-only fabric addressable without inventing a 2D entity', () => {
    const semantic = {
      sceneId: 'building:fabric:market:4',
      entityKind: 'building',
      anchorKey: 'fabric:market:4',
      canonicalRef: { kind: 'district', id: 'market' },
      districtId: 'market',
      label: 'Market Ward dwelling',
    };
    const input = baseInput({
      sceneIdOrSemantic: semantic.sceneId,
      explicitSemantic: semantic,
    });

    mirrorTownSceneSelection(input);

    expect(input.setPinned).toHaveBeenCalledWith({
      kind: 'scene',
      sceneId: semantic.sceneId,
      payload: semantic,
      anchor: { x: 220, y: 180 },
    });
  });

  it('mirrors a district semantic through the established district card model', () => {
    const district = { id: 'market', name: 'Market Ward' };
    const semantic = {
      sceneId: 'district:market',
      entityKind: 'district',
      anchorKey: 'district:market',
      canonicalRef: { kind: 'district', id: 'market' },
      districtId: 'market',
      label: district.name,
    };
    const input = baseInput({
      sceneIdOrSemantic: semantic.sceneId,
      explicitSemantic: semantic,
      model: {
        buildings: [],
        districts: [district],
        overlays: { conditions: [], hazards: [] },
      },
    });

    mirrorTownSceneSelection(input);

    expect(input.districtPayload).toHaveBeenCalledWith(district);
    expect(input.setPinned).toHaveBeenCalledWith({
      kind: 'district',
      sceneId: semantic.sceneId,
      payload: { mapDistrict: district },
      anchor: { x: 220, y: 180 },
    });
  });

  it('preserves a generic road semantic for the Portrait inspector', () => {
    const semantic = {
      sceneId: 'road:approach-east',
      entityKind: 'road',
      anchorKey: 'road:approach-east',
      canonicalRef: { kind: 'road', id: 'approach-east' },
      label: 'Eastern approach',
    };
    const input = baseInput({
      sceneIdOrSemantic: semantic.sceneId,
      explicitSemantic: semantic,
    });

    mirrorTownSceneSelection(input);

    expect(input.setPinned).toHaveBeenCalledWith(expect.objectContaining({
      kind: 'scene',
      sceneId: semantic.sceneId,
      payload: semantic,
    }));
  });
});
