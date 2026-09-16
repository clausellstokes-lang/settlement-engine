/** @vitest-environment jsdom */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const state = {
    getCampaignForSettlement: vi.fn(),
    setActiveCampaign: vi.fn(),
    setSelectedSettlementId: vi.fn(),
  };
  return {
    state,
    navigate: vi.fn(),
    navigateToEntity: vi.fn(),
  };
});

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.state);
  useStore.getState = () => mocks.state;
  return { useStore };
});

vi.mock('../../src/hooks/useRoute.js', () => ({
  navigate: mocks.navigate,
}));

vi.mock('../../src/components/dossier/DossierEntityContext.jsx', () => ({
  useDossierEntities: () => ({
    index: null,
    navigateToEntity: mocks.navigateToEntity,
  }),
}));

import { readHeraldCommandSession } from '../../src/components/map/heraldCommandSession.js';
import { useTownScenePaneBridge } from '../../src/components/townMap/useTownScenePaneBridge.js';

function bridgeProps(overrides = {}) {
  return {
    settlement: { id: 'settlement-1' },
    mapEdits: null,
    worldState: null,
    regionalGraph: null,
    audience: 'dm',
    editing: true,
    commitEdits: vi.fn(),
    model: { buildings: [] },
    wrapperRef: { current: null },
    districtPayload: vi.fn(),
    setPinned: vi.fn(),
    authoringSaveId: 'save-1',
    selectView: vi.fn(() => true),
    activeLens: 'parchment',
    mapAnalytics: { fireOnce: vi.fn() },
    selectedNodeId: null,
    canUndoEdits: false,
    canRedoEdits: false,
    undoEdits: vi.fn(),
    redoEdits: vi.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  window.sessionStorage.clear();
  vi.clearAllMocks();
  mocks.state.getCampaignForSettlement.mockReturnValue({ id: 'campaign-1' });
});

describe('town-scene product bridge', () => {
  it('carries the exact selected scene, canonical record, causes, and action to the Herald', () => {
    const { result } = renderHook(() => useTownScenePaneBridge(bridgeProps()));
    const selection = {
      sceneId: 'building:market',
      semantic: {
        sceneId: 'building:market',
        entityKind: 'building',
        label: 'The Covered Market',
        canonicalRef: { kind: 'institution', id: 'market' },
        provenanceRefs: ['provenance:region'],
      },
      canonicalRef: { kind: 'institution', id: 'market' },
      provenanceRefs: ['provenance:region'],
      provenance: [{
        id: 'provenance:region',
        effect: 'regional-grain',
        family: 'region',
        sourceRef: 'river terrace',
        displayText: 'regional-grain: river terrace',
      }],
    };

    act(() => result.current.sceneProps.onOpenHerald(selection));

    expect(mocks.state.setSelectedSettlementId).toHaveBeenCalledWith('save-1');
    expect(mocks.state.setActiveCampaign).toHaveBeenCalledWith('campaign-1');
    expect(mocks.navigate).toHaveBeenCalledWith('realm');
    expect(readHeraldCommandSession('campaign-1')).toMatchObject({
      open: true,
      section: 'events',
      sceneContext: {
        action: 'inspect-scene-provenance',
        settlementId: 'save-1',
        sceneId: 'building:market',
        entityKind: 'building',
        label: 'The Covered Market',
        canonicalRef: { kind: 'institution', id: 'market' },
        provenanceRefs: ['provenance:region'],
        provenance: [{
          id: 'provenance:region',
          effect: 'regional-grain',
          family: 'region',
          sourceRef: 'river terrace',
          displayText: 'regional-grain: river terrace',
        }],
      },
    });
  });

  it('does not expose a broken Herald action for a settlement outside a campaign', () => {
    mocks.state.getCampaignForSettlement.mockReturnValue(null);
    const { result } = renderHook(() => useTownScenePaneBridge(bridgeProps()));

    expect(result.current.sceneProps.onOpenHerald).toBeNull();
  });

  it('preserves numeric store identities in the string-keyed session namespace', () => {
    mocks.state.getCampaignForSettlement.mockReturnValue({ id: 17 });
    const { result } = renderHook(() => useTownScenePaneBridge(bridgeProps({
      authoringSaveId: 42,
    })));

    act(() => result.current.sceneProps.onOpenHerald({
      sceneId: 'building:market',
      semantic: {
        entityKind: 'building',
        label: 'The Covered Market',
        canonicalRef: { kind: 'institution', id: 'market' },
        provenanceRefs: ['provenance:region'],
      },
      provenance: [{
        id: 'provenance:region',
        effect: 'regional-grain',
      }],
    }));

    expect(mocks.state.setSelectedSettlementId).toHaveBeenCalledWith(42);
    expect(mocks.state.setActiveCampaign).toHaveBeenCalledWith(17);
    expect(readHeraldCommandSession('17')?.sceneContext?.settlementId).toBe('42');
  });
});
