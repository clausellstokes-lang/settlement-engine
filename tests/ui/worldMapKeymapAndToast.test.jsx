/**
 * @vitest-environment jsdom
 *
 * tests/ui/worldMapKeymapAndToast.test.jsx — 5th-layer review fixes.
 *
 * Two reproducing tests for WorldMap.jsx:
 *
 *  (1) Toast timer cleanup on unmount. showToast() arms a setTimeout that calls
 *      setToast(null). Without an unmount teardown, that trailing timer fires
 *      after the component is gone (a setState-on-unmounted warning + dangling
 *      timer). The fix adds a teardown useEffect clearing toastTimerRef. The test
 *      mounts, fires a toast (via the F-key → handleFit path is bridge-gated, so
 *      we drive it through a real interaction that calls showToast), unmounts,
 *      advances fake timers, and asserts no console.error/warn fired.
 *
 *  (2) Keymap guards. The 'p'/'t'/'a'/'r' keys switch map mode. They must NOT
 *      fire when a <select> is focused (its own arrow/letter navigation), nor
 *      when a modal ([role="dialog"][aria-modal="true"]) is open. The test
 *      dispatches keydown with a <select> target and with a modal mounted, and
 *      asserts setMapMode was not called; a plain key on a neutral target still
 *      switches mode (proving the guard isn't a blanket off-switch).
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

// ── Mocks (mirrors worldMap.smoke.test.jsx so the mount path stays quiet) ──
vi.mock('../../src/lib/mapBridge.js', () => ({
  createBridgeSingleton: () => ({
    on: () => () => {},
    call: () => Promise.resolve(),
    destroy: () => {},
    isReady: false,
  }),
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: { list: vi.fn(() => Promise.resolve([])) },
}));

vi.mock('../../src/lib/roadNetwork.js', () => ({
  computeRoadEdges: () => [],
}));

const setMapMode = vi.fn();
const storeState = {
  mapMode: 'view',
  setMapMode,
  mapReady: false,
  mapLoading: false,
  mapError: null,
  setMapReady: vi.fn(),
  setMapLoading: vi.fn(),
  setMapError: vi.fn(),
  setSelectedBurgId: vi.fn(),
  setDraggingOver: vi.fn(),
  isDraggingOver: false,
  addPlacement: vi.fn(),
  removePlacementLocal: vi.fn(),
  clearAllPlacementsLocal: vi.fn(),
  replaceAllPlacements: vi.fn(),
  replaceMapState: vi.fn(),
  resetMapState: vi.fn(),
  setMapSnapshot: vi.fn(),
  bumpGeometryVersion: vi.fn(),
  setMapBackdrop: vi.fn(),
  clearMapBackdrop: vi.fn(),
  mapState: {
    placements: {},
    labels: [],
    markers: [],
    forests: [],
    customBackdrop: null,
    layers: { nativeStateBorders: false, nativeCultureRegions: false, nativeBiomes: false },
    seed: null,
    viewport: { scale: 1 },
  },
  savedSettlements: [],
  savedSettlementsLoaded: true,
  setSavedSettlements: vi.fn(),
  auth: { tier: 'anon', user: null },
  isElevated: () => false,
  campaigns: [],
  activeCampaignId: null,
  setActiveCampaign: vi.fn(),
  saveCampaignMap: vi.fn(),
  clearCampaignMap: vi.fn(),
  getCampaignMapState: vi.fn(() => null),
  advanceCampaignWorld: vi.fn(),
  undoLastPulse: vi.fn(),
  pulseUndoStack: [],
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

function dispatchKey(key, target) {
  const evt = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  // jsdom KeyboardEvent ignores a `target` option; force e.target via defineProperty.
  if (target) Object.defineProperty(evt, 'target', { value: target, configurable: true });
  window.dispatchEvent(evt);
}

describe('WorldMap keymap guards', () => {
  beforeEach(() => { setMapMode.mockClear(); });

  test('a plain key on a neutral target switches map mode (control — guard is not a blanket off-switch)', async () => {
    const mod = await import('../../src/components/WorldMap.jsx');
    const WorldMap = mod.default;
    render(<WorldMap onNavigate={() => {}} />);

    dispatchKey('t', document.body);
    expect(setMapMode).toHaveBeenCalled();
  });

  test('keymap does NOT fire when a <select> is focused', async () => {
    const mod = await import('../../src/components/WorldMap.jsx');
    const WorldMap = mod.default;
    render(<WorldMap onNavigate={() => {}} />);

    const select = document.createElement('select');
    document.body.appendChild(select);
    dispatchKey('a', select);
    expect(setMapMode).not.toHaveBeenCalled();
    select.remove();
  });

  test('keymap does NOT fire while a modal ([role=dialog][aria-modal]) is open', async () => {
    const mod = await import('../../src/components/WorldMap.jsx');
    const WorldMap = mod.default;
    render(<WorldMap onNavigate={() => {}} />);

    const modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    document.body.appendChild(modal);

    dispatchKey('p', document.body); // neutral target, but a modal owns focus
    expect(setMapMode).not.toHaveBeenCalled();

    modal.remove();
    // Sanity: with the modal gone, the same key resumes switching.
    dispatchKey('p', document.body);
    expect(setMapMode).toHaveBeenCalled();
  });
});

describe('WorldMap toast timer cleanup on unmount', () => {
  test('the armed toast timer is cleared on unmount (clearTimeout called with the toast id)', async () => {
    // Capture the toast timer id (the one armed at the 2600ms toast delay) and
    // assert it is cleared on unmount. clearTimeout spy is the precise signal —
    // independent of unrelated map timers (debounced autosave etc.).
    const setSpy = vi.spyOn(globalThis, 'setTimeout');
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');

    const mod = await import('../../src/components/WorldMap.jsx');
    const WorldMap = mod.default;
    const { container, unmount } = render(<WorldMap onNavigate={() => {}} />);

    // The map container is the drag-drop target (a div with a 2px border). A drop
    // with no active campaign synchronously calls
    // showToast('info', 'Select a campaign…'), which arms setTimeout(setToast(null), 2600).
    const dropDiv = Array.from(container.querySelectorAll('div'))
      .find(el => /2px solid/.test(el.getAttribute('style') || ''));
    expect(dropDiv).toBeTruthy();

    setSpy.mockClear();
    const dataTransfer = { dropEffect: '', getData: () => JSON.stringify({ id: 'set-1', name: 'Testburg' }) };
    const dropEvt = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(dropEvt, 'dataTransfer', { value: dataTransfer });
    dropDiv.dispatchEvent(dropEvt);

    // The toast timer id = the most recent setTimeout armed at the 2600ms toast
    // delay. Its presence proves the drop reached showToast and armed the timer.
    const toastCall = [...setSpy.mock.results.map((r, i) => ({ id: r.value, delay: setSpy.mock.calls[i][1] }))]
      .reverse()
      .find(c => c.delay === 2600);
    expect(toastCall, 'toast timer (2600ms) should have been armed by the drop').toBeTruthy();
    const toastTimerId = toastCall.id;

    clearSpy.mockClear();
    unmount();

    // With the teardown useEffect, the toast timer is cleared on unmount. Pre-fix,
    // it survives and would fire setToast(null) against an unmounted tree.
    const clearedIds = clearSpy.mock.calls.map(args => args[0]);
    expect(clearedIds).toContain(toastTimerId);
  });
});
