/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, renderHook } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  createBridgeSingleton: vi.fn(),
  readMapRuntimeConfig: vi.fn(),
}));

vi.mock('../../src/lib/mapBridge.js', () => ({
  createBridgeSingleton: mocks.createBridgeSingleton,
}));

vi.mock('../../src/lib/mapRuntimeConfig.js', () => ({
  readMapRuntimeConfig: mocks.readMapRuntimeConfig,
}));

vi.mock('../../src/lib/spatialCaptureRegistry.js', () => ({
  registerSpatialCaptureBridge: vi.fn(),
  unregisterSpatialCaptureBridge: vi.fn(),
}));

import { useMapBridge } from '../../src/hooks/useMapBridge.js';

const FRAME_URL = 'https://map.settlementforge.com/map/index.html'
  + '?v=sfdrop16&parentOrigin=https%3A%2F%2Fsettlementforge.com';
const FRAME_ORIGIN = 'https://map.settlementforge.com';

function bridgeDouble() {
  return {
    on: vi.fn(() => vi.fn()),
    destroy: vi.fn(),
  };
}

function hookProps(overrides = {}) {
  return {
    enabled: true,
    iframeRef: { current: { contentWindow: {} } },
    bridgeRef: { current: null },
    reloadKey: 0,
    setMapReady: vi.fn(),
    setMapLoading: vi.fn(),
    setMapError: vi.fn(),
    setBridgeReady: vi.fn(),
    setMapSnapshot: vi.fn(),
    setMapTemplates: vi.fn(),
    setSelectedBurgId: vi.fn(),
    addPlacement: vi.fn(),
    removePlacementLocal: vi.fn(),
    clearAllPlacementsLocal: vi.fn(),
    showToast: vi.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.readMapRuntimeConfig.mockReturnValue({
    frameUrl: FRAME_URL,
    frameOrigin: FRAME_ORIGIN,
    configurationError: null,
  });
  mocks.createBridgeSingleton.mockReturnValue(bridgeDouble());
});

afterEach(cleanup);

describe('useMapBridge origin wiring', () => {
  it('returns the resolved frame URL and constructs the bridge with its exact origin', () => {
    const props = hookProps();
    const { result, unmount } = renderHook(() => useMapBridge(props));

    expect(result.current).toBe(FRAME_URL);
    expect(mocks.createBridgeSingleton).toHaveBeenCalledTimes(1);
    expect(mocks.createBridgeSingleton.mock.calls[0][1]).toEqual({
      targetOrigin: FRAME_ORIGIN,
    });
    expect(props.setMapLoading).toHaveBeenCalledWith(true);
    unmount();
  });

  it('fails closed and surfaces the configuration error without constructing a bridge', () => {
    const configurationError = 'The terrain engine is not securely configured.';
    mocks.readMapRuntimeConfig.mockReturnValue({
      frameUrl: null,
      frameOrigin: null,
      configurationError,
    });
    const props = hookProps();
    const { result } = renderHook(() => useMapBridge(props));

    expect(result.current).toBeNull();
    expect(mocks.createBridgeSingleton).not.toHaveBeenCalled();
    expect(props.setMapReady).toHaveBeenCalledWith(false);
    expect(props.setBridgeReady).toHaveBeenCalledWith(false);
    expect(props.setMapLoading).toHaveBeenCalledWith(false);
    expect(props.setMapError).toHaveBeenCalledWith(configurationError);
  });
});
