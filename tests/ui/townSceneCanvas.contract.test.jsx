/**
 * @vitest-environment jsdom
 *
 * Browser-event contracts for the deepest lazy canvas boundary. jsdom cannot
 * certify a GPU driver or a physical touchscreen; it can prove that the DOM
 * recovery and pointer paths call the runtime correctly.
 */

import React from 'react';
import {
  afterEach,
  beforeEach,
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

const createTownSceneRuntime = vi.hoisted(() => vi.fn());

vi.mock(
  '../../src/components/townMap/scene3d/threeSceneRuntime.js',
  () => ({ createTownSceneRuntime }),
);
vi.mock('three', () => ({ Scene: class Scene {} }));
vi.mock(
  'three/examples/jsm/controls/OrbitControls.js',
  () => ({ OrbitControls: class OrbitControls {} }),
);

import TownSceneCanvas from '../../src/components/townMap/scene3d/TownSceneCanvas.jsx';

const MANIFEST = Object.freeze({ kind: 'TownSceneManifest' });
const GEOMETRY = Object.freeze({
  kind: 'TownSceneGeometryBundle',
  manifestDigest: 'matrix',
});
const QUALITY = Object.freeze({ quality: 1, lodBias: 0 });

let runtime;

beforeEach(() => {
  runtime = {
    resize: vi.fn(),
    setSelected: vi.fn(),
    setPaused: vi.fn(),
    start: vi.fn(),
    setQuality: vi.fn(),
    pick: vi.fn(),
    zoomBy: vi.fn(),
    moveCamera: vi.fn(),
    dispose: vi.fn(),
    releaseContext: vi.fn(),
  };
  createTownSceneRuntime.mockReset();
  createTownSceneRuntime.mockReturnValue(runtime);
});

afterEach(cleanup);

function renderCanvas(overrides = {}) {
  const props = {
    manifest: MANIFEST,
    geometry: GEOMETRY,
    quality: QUALITY,
    onPick: vi.fn(),
    onReady: vi.fn(),
    onStatus: vi.fn(),
    onContextLost: vi.fn(),
    onContextRestored: vi.fn(),
    onFatal: vi.fn(),
    ...overrides,
  };
  return {
    props,
    ...render(<TownSceneCanvas {...props} />),
  };
}

function touchEvent(type, x, y) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });
  Object.defineProperty(event, 'pointerType', { value: 'touch' });
  return event;
}

describe('TownSceneCanvas browser contracts', () => {
  it('pauses on context loss, prevents browser teardown, and requests a rebuild on restore', async () => {
    const { props } = renderCanvas();
    const canvas = screen.getByLabelText(
      /Interactive three-dimensional settlement portrait/i,
    );
    await waitFor(() => expect(createTownSceneRuntime).toHaveBeenCalledOnce());
    runtime.setPaused.mockClear();

    const lost = new Event('webglcontextlost', {
      bubbles: true,
      cancelable: true,
    });
    canvas.dispatchEvent(lost);

    expect(lost.defaultPrevented).toBe(true);
    expect(runtime.setPaused).toHaveBeenCalledWith(true);
    expect(props.onStatus).toHaveBeenCalledWith(
      'The 3D portrait paused while its graphics context recovers.',
    );
    expect(props.onContextLost).toHaveBeenCalledOnce();

    canvas.dispatchEvent(new Event('webglcontextrestored', {
      bubbles: true,
    }));
    expect(props.onStatus).toHaveBeenCalledWith(
      'Graphics recovered. Rebuilding the settlement portrait.',
    );
    expect(props.onContextRestored).toHaveBeenCalledOnce();
  });

  it('treats a touch tap as selection, rejects drags/cancelled gestures, and keeps Escape available', async () => {
    const onPick = vi.fn();
    renderCanvas({ onPick });
    const canvas = screen.getByLabelText(
      /Interactive three-dimensional settlement portrait/i,
    );
    await waitFor(() => expect(createTownSceneRuntime).toHaveBeenCalledOnce());

    canvas.dispatchEvent(touchEvent('pointerdown', 24, 32));
    canvas.dispatchEvent(touchEvent('pointerup', 26, 34));
    expect(runtime.pick).toHaveBeenCalledWith(26, 34);

    runtime.pick.mockClear();
    canvas.dispatchEvent(touchEvent('pointerdown', 10, 10));
    canvas.dispatchEvent(touchEvent('pointerup', 40, 45));
    expect(runtime.pick).not.toHaveBeenCalled();

    canvas.dispatchEvent(touchEvent('pointerdown', 12, 12));
    canvas.dispatchEvent(touchEvent('pointercancel', 12, 12));
    canvas.dispatchEvent(touchEvent('pointerup', 12, 12));
    expect(runtime.pick).not.toHaveBeenCalled();

    fireEvent.keyDown(canvas, { key: 'Escape' });
    expect(onPick).toHaveBeenCalledWith(null);
    expect(canvas.style.touchAction).toBe('none');
    expect(canvas.getAttribute('aria-label')).toMatch(/companion list/i);
  });

  it('exposes imperative zoom/preset requests without requiring a gesture', async () => {
    const { rerender } = renderCanvas();
    await waitFor(() => expect(createTownSceneRuntime).toHaveBeenCalledOnce());

    rerender(
      <TownSceneCanvas
        manifest={MANIFEST}
        geometry={GEOMETRY}
        quality={QUALITY}
        cameraRequest={{ kind: 'zoom', scale: 0.78, nonce: 1 }}
      />,
    );
    expect(runtime.zoomBy).toHaveBeenCalledWith(0.78);

    const preset = { id: 'overview', target: [0, 0, 0] };
    rerender(
      <TownSceneCanvas
        manifest={MANIFEST}
        geometry={GEOMETRY}
        quality={QUALITY}
        cameraRequest={{ kind: 'preset', preset, nonce: 2 }}
      />,
    );
    expect(runtime.moveCamera).toHaveBeenCalledWith(preset);
  });

  it('preserves a same-node context across effect replay and releases it on permanent unmount', async () => {
    const { rerender, unmount } = renderCanvas();
    await waitFor(() => expect(createTownSceneRuntime).toHaveBeenCalledOnce());

    rerender(
      <TownSceneCanvas
        manifest={MANIFEST}
        geometry={GEOMETRY}
        quality={QUALITY}
        reducedMotion
      />,
    );
    expect(runtime.dispose).toHaveBeenCalledWith({ releaseContext: false });

    await new Promise((resolve) => globalThis.setTimeout(resolve, 5));
    expect(runtime.releaseContext).not.toHaveBeenCalled();

    await waitFor(() => expect(createTownSceneRuntime).toHaveBeenCalledTimes(2));
    unmount();
    await waitFor(() => expect(runtime.releaseContext).toHaveBeenCalledOnce());
  });
});
