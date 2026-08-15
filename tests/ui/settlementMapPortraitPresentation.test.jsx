/**
 * @vitest-environment jsdom
 *
 * The dimensional portrait is an optional projection above the canonical plan.
 * This test pins the presentation boundary itself: the choice only exists when
 * policy admits it, the viewer stays lazy until selected, and a viewer fallback
 * returns control to the parent without removing the 2D path.
 */

import React from 'react';
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

vi.mock('../../src/components/townMap/scene3d/SettlementScene3D.jsx', () => ({
  default: function FakeSettlementScene3D({ onFallback, forceFailure = false }) {
    if (forceFailure) throw new Error('portrait chunk fixture failed');
    return (
      <div data-testid="portrait-viewer">
        <button
          type="button"
          onClick={() => onFallback?.({ reason: 'test-fallback', recoverable: true })}
        >
          Simulate fallback
        </button>
      </div>
    );
  },
}));

import SettlementMapPresentation from '../../src/components/townMap/SettlementMapPresentation.jsx';

afterEach(cleanup);

function renderPresentation(overrides = {}) {
  const props = {
    viewMode: 'plan',
    onViewModeChange: vi.fn(),
    sceneEnabled: false,
    background: 'transparent',
    onSceneFallback: vi.fn(),
    ...overrides,
  };
  return {
    props,
    ...render(<SettlementMapPresentation {...props} />),
  };
}

describe('SettlementMapPresentation — 3D portrait boundary', () => {
  it('does not expose Portrait when capability policy withholds it', () => {
    renderPresentation();

    expect(screen.queryByRole('button', { name: 'Portrait' })).toBeNull();
    expect(screen.queryByTestId('portrait-viewer')).toBeNull();
  });

  it('offers Portrait when admitted without loading the viewer in Plan mode', () => {
    const { props } = renderPresentation({ sceneEnabled: true });

    expect(screen.getByRole('button', { name: 'Portrait' })).toBeTruthy();
    expect(screen.queryByTestId('portrait-viewer')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Portrait' }));
    expect(props.onViewModeChange).toHaveBeenCalledWith('portrait3d');
  });

  it('mounts the lazy portrait and delegates runtime recovery', async () => {
    const { props, container } = renderPresentation({
      viewMode: 'portrait3d',
      sceneEnabled: true,
    });

    expect(await screen.findByTestId('portrait-viewer')).toBeTruthy();
    expect(container.querySelector('[data-town-scene-overlay]').style.overflow).toBe('auto');
    expect(container.querySelector('[data-town-scene-overlay]').style.touchAction).toBe('pan-y');
    fireEvent.click(screen.getByRole('button', { name: 'Simulate fallback' }));
    expect(props.onSceneFallback).toHaveBeenCalledWith({
      reason: 'test-fallback',
      recoverable: true,
    });
  });

  it('returns keyboard focus to the surviving Plan control after runtime fallback', async () => {
    renderPresentation({
      viewMode: 'portrait3d',
      sceneEnabled: true,
    });

    const fallback = await screen.findByRole('button', {
      name: 'Simulate fallback',
    });
    const plan = screen.getByRole('button', { name: 'Plan' });
    fallback.focus();
    expect(document.activeElement).toBe(fallback);

    fireEvent.click(fallback);
    await waitFor(() => expect(document.activeElement).toBe(plan));
  });

  it('marks the loading/error action as an explicit persisted Plan choice', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { props } = renderPresentation({
        viewMode: 'portrait3d',
        sceneEnabled: true,
        sceneProps: { forceFailure: true },
      });

      const usePlan = await screen.findByRole('button', { name: 'Use 2D plan' });
      await waitFor(() => expect(props.onSceneFallback).toHaveBeenCalledWith(
        expect.objectContaining({ reason: 'scene_chunk_error' }),
      ));
      props.onSceneFallback.mockClear();
      fireEvent.click(usePlan);
      expect(props.onSceneFallback).toHaveBeenCalledWith({
        reason: 'user-selected-plan',
        recoverable: true,
      });
    } finally {
      consoleError.mockRestore();
    }
  });
});
