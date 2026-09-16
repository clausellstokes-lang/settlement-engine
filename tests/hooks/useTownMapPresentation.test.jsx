/**
 * @vitest-environment jsdom
 *
 * Presentation history belongs above both renderers. It stores normalized
 * map-edit snapshots only, so undo/redo can persist cosmetic changes without
 * turning the 3D scene into a second settlement model.
 */

import { act, renderHook } from '@testing-library/react';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

vi.mock('../../src/lib/flags.js', () => ({
  useFlag: vi.fn((name) => name === 'settlementScene3d'),
}));

vi.mock('../../src/lib/townScene/viewPolicy.js', async () => {
  const actual = await vi.importActual('../../src/lib/townScene/viewPolicy.js');
  return {
    ...actual,
    detectTownSceneCapability: vi.fn(() => ({
      available: true,
      reason: null,
    })),
  };
});

import { withSceneOverride } from '../../src/domain/townMap/mapEdits.js';
import { useTownMapPresentation } from '../../src/components/townMap/useTownMapPresentation.js';
import {
  readLastMapView,
  writeLastMapView,
} from '../../src/lib/lastMapView.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

function renderPresentation(sourceSettlement, applyMapEdit = vi.fn()) {
  const hook = renderHook(({ settlement }) => useTownMapPresentation({
    sourceSettlement: settlement,
    audience: 'dm',
    canEdit: true,
    desktop: true,
    saveId: 'save:portrait-history',
    worldState: null,
    regionalGraph: null,
    applyMapEdit,
  }), {
    initialProps: { settlement: sourceSettlement },
  });
  return { ...hook, applyMapEdit };
}

beforeEach(() => localStorage.clear());

describe('useTownMapPresentation — durable cosmetic history', () => {
  it('undoes and redoes through the same normalized persistence writer', () => {
    const settlement = makeTownFixture({
      tier: 'town',
      terrain: 'plains',
      seed: 'portrait-history',
    });
    const { result, applyMapEdit } = renderPresentation(settlement);
    const edited = withSceneOverride(
      result.current.mapEdits,
      'institution:market',
      { skinId: 'brickGuild', headingOffsetStep: 1 },
    );

    act(() => result.current.commitEdits(edited));
    expect(result.current.mapEdits).toEqual(edited);
    expect(result.current.canUndoEdits).toBe(true);
    expect(result.current.canRedoEdits).toBe(false);

    act(() => result.current.undoEdits());
    expect(result.current.mapEdits).toBeNull();
    expect(result.current.canUndoEdits).toBe(false);
    expect(result.current.canRedoEdits).toBe(true);

    act(() => result.current.redoEdits());
    expect(result.current.mapEdits).toEqual(edited);
    expect(result.current.canUndoEdits).toBe(true);
    expect(result.current.canRedoEdits).toBe(false);
    expect(applyMapEdit.mock.calls).toEqual([
      ['save:portrait-history', edited],
      ['save:portrait-history', null],
      ['save:portrait-history', edited],
    ]);
  });

  it('does not mint an undo step for a normalized no-op', () => {
    const settlement = makeTownFixture({
      tier: 'village',
      terrain: 'hills',
      seed: 'portrait-history-noop',
    });
    const { result, applyMapEdit } = renderPresentation(settlement);

    act(() => result.current.commitEdits(null));

    expect(result.current.canUndoEdits).toBe(false);
    expect(result.current.canRedoEdits).toBe(false);
    expect(applyMapEdit).not.toHaveBeenCalled();
  });
});

describe('useTownMapPresentation — Portrait fallback preference continuity', () => {
  it('keeps automatic recovery session-only and restores Portrait after remount', () => {
    const settlement = makeTownFixture({
      tier: 'town',
      terrain: 'plains',
      seed: 'portrait-runtime-fallback',
    });
    writeLastMapView('save:portrait-history', {
      view: 'portrait3d',
      lens: 'parchment',
    });
    const first = renderPresentation(settlement);
    expect(first.result.current.presentedViewMode).toBe('portrait3d');

    act(() => first.result.current.handleSceneFallback(
      { reason: 'webgl-context-timeout', recoverable: true },
      'parchment',
    ));
    expect(first.result.current.presentedViewMode).toBe('plan');
    expect(readLastMapView('save:portrait-history')).toEqual({
      view: 'portrait3d',
      lens: 'parchment',
    });

    first.unmount();
    const remounted = renderPresentation(settlement);
    expect(remounted.result.current.presentedViewMode).toBe('portrait3d');
    remounted.unmount();
  });

  it('persists an explicit Use 2D plan choice through the normal selector', () => {
    const settlement = makeTownFixture({
      tier: 'town',
      terrain: 'plains',
      seed: 'portrait-explicit-plan',
    });
    writeLastMapView('save:portrait-history', {
      view: 'portrait3d',
      lens: 'parchment',
    });
    const first = renderPresentation(settlement);

    act(() => first.result.current.handleSceneFallback(
      { reason: 'user-selected-plan', recoverable: true },
      'ink',
    ));
    expect(first.result.current.presentedViewMode).toBe('plan');
    expect(readLastMapView('save:portrait-history')).toEqual({
      view: 'plan',
      lens: 'ink',
    });

    first.unmount();
    const remounted = renderPresentation(settlement);
    expect(remounted.result.current.presentedViewMode).toBe('plan');
    remounted.unmount();
  });
});
