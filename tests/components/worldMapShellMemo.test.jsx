/**
 * @vitest-environment jsdom
 *
 * tests/components/worldMapShellMemo.test.jsx — prop-drilling refactor lock-in.
 *
 * WorldMap.jsx used to prop-drill 20-40 values down to WorldMapToolbar and
 * WorldMapStage, and neither shell was memoized, so every parent render
 * (toast/drag/inspector churn) re-rendered both shells. The refactor:
 *
 *   (a) the shells now read their store-derived values (mapMode/mapLoading/
 *       mapError/imageMode for the toolbar; placements/isDraggingOver/mapMode/
 *       mapReady/imageMode for the stage) directly via useStore selectors
 *       instead of receiving them as props;
 *   (b) both shells are wrapped in React.memo;
 *   (c) the remaining callback props are stabilized in the parent.
 *
 * This test pins all three: the shells render the store-derived values even
 * though those are NOT passed as props (proving the direct reads work), and a
 * re-render with referentially-identical props does not re-invoke the inner
 * render (proving React.memo is in effect). It also asserts the public exports
 * are memo-wrapped components.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { createElement as h, useState } from 'react';

afterEach(cleanup);

// Analytics is fire-and-forget; keep the render path quiet (the stage imports it).
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Feature flags read during the stage render — default everything off.
vi.mock('../../src/lib/flags.js', () => ({ flag: () => false }));

// A single mutable store object drives every selector. The store-derived values
// the shells now read directly live here; the test mutates this object and the
// values surface in the rendered DOM, which would be impossible if the shells
// still depended on props for them.
const storeState = {
  mapMode: 'view',
  setMapMode: vi.fn(),
  mapReady: true,
  mapLoading: true,        // toolbar shows the "Loading…" status line off this
  mapError: null,
  isDraggingOver: false,
  mapState: {
    placements: {},
    customBackdrop: null,  // → imageMode === false
  },
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

import { WorldMapToolbar } from '../../src/components/map/WorldMapToolbar.jsx';
import { WorldMapStage } from '../../src/components/map/WorldMapStage.jsx';

// Minimal prop set: only the genuinely parent-owned props each shell still
// needs. Crucially this omits mapMode/mapLoading/mapError/imageMode/placements/
// isDraggingOver/mapReady — those must come from the store now.
function toolbarProps() {
  return {
    showingCampaignPanel: false,
    campaignHasPantheon: false,
    canManageCampaigns: false,       // collapses the campaign-controls branch
    activeCampaign: null,
    activeCampaignId: null,
    handleSelectCampaign: vi.fn(),
    activeCampaigns: [],
    handleSaveMapToCampaign: vi.fn(),
    handleClearMapFromCampaign: vi.fn(),
    setShowSimulationRules: vi.fn(),
    showSimulationRules: false,
    worldPulseInterval: 'one_month',
    setWorldPulseInterval: vi.fn(),
    handleAdvanceRealm: vi.fn(),
    worldPulseBusy: false,
    canUndoPulse: false,
    handleUndoRealm: vi.fn(),
    setShowLayersPanel: vi.fn(),
    showLayersPanel: false,
    setTourOpen: vi.fn(),
    handleClearImage: vi.fn(),
    handleImportImage: vi.fn(),
    handleShareMap: vi.fn(),
    sharingMap: false,
    mapTemplates: [],
    currentTemplate: '',
    handleTemplateChange: vi.fn(),
    handleFit: vi.fn(),
    handleRegenerate: vi.fn(),
    inspectorOpen: false,
    onToggleInspector: vi.fn(),
    openInspectorAt: vi.fn(),
    activePresetId: undefined,
    handleApplyPreset: vi.fn(),
  };
}

function stageProps() {
  return {
    showingWizardNews: false,
    showingWorldPulse: false,
    showingPantheon: false,
    activeCampaign: null,
    activeSaves: [],
    mapContainerRef: { current: null },
    handleDragOver: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDrop: vi.fn(),
    iframeRef: { current: null },
    bridgeReady: false,
    bridgeRef: { current: null },
    overlayTransformRef: { current: null },
    onNavigate: vi.fn(),
    showLayersPanel: false,
    setShowLayersPanel: vi.fn(),
  };
}

describe('WorldMap shell refactor — store-derived reads + React.memo', () => {
  test('both shells are wrapped in React.memo', () => {
    const memoTag = Symbol.for('react.memo');
    expect(WorldMapToolbar.$$typeof).toBe(memoTag);
    expect(WorldMapStage.$$typeof).toBe(memoTag);
  });

  test('toolbar renders store-derived values it no longer receives as props', () => {
    // mapLoading:true drives the "Loading…" status line — proof the toolbar
    // reads mapLoading from the store, since it is NOT in toolbarProps().
    const { container } = render(h(WorldMapToolbar, toolbarProps()));
    expect(container.textContent).toContain('Loading…');
    // mapError is null → no error text.
    expect(container.textContent).not.toContain('boom');
  });

  test('toolbar surfaces a store-only mapError without a prop', () => {
    storeState.mapError = 'boom';
    try {
      const { container } = render(h(WorldMapToolbar, toolbarProps()));
      expect(container.textContent).toContain('boom');
    } finally {
      storeState.mapError = null;
    }
  });

  test('stage reflects store-derived isDraggingOver via the map border highlight', () => {
    // isDraggingOver toggles the map container border to GOLD and (since mapMode
    // !== annotate) renders the dashed drop ring. Both are driven by the store,
    // not props.
    storeState.isDraggingOver = true;
    try {
      const { container } = render(h(WorldMapStage, stageProps()));
      // The dashed drop-ring overlay only renders while dragging.
      const dashed = Array.from(container.querySelectorAll('div')).some(
        el => (el.getAttribute('style') || '').includes('dashed'),
      );
      expect(dashed).toBe(true);
    } finally {
      storeState.isDraggingOver = false;
    }
  });

  test('React.memo skips re-render when only an unrelated parent state changes', () => {
    // Count how often the memoized toolbar's render actually runs by spying on a
    // store selector it invokes during render (mapMode is read every render).
    const selectorHits = vi.fn();
    // Render the toolbar inside a parent that holds its own unrelated state. The
    // toolbar's props object is created ONCE and reused across parent renders, so
    // memo's shallow-equal check should short-circuit the re-render.
    let bump;
    const stableProps = toolbarProps();
    // Wrap the selector so we can detect render invocations: useStore is mocked
    // to call selector(storeState); we tap mapMode reads as a render heartbeat.
    const origDescriptor = Object.getOwnPropertyDescriptor(storeState, 'mapMode');
    Object.defineProperty(storeState, 'mapMode', {
      configurable: true,
      get() { selectorHits(); return 'view'; },
    });
    try {
      function Parent() {
        const [, setTick] = useState(0);
        bump = () => setTick(t => t + 1);
        return h(WorldMapToolbar, stableProps);
      }
      render(h(Parent));
      const afterMount = selectorHits.mock.calls.length;
      expect(afterMount).toBeGreaterThan(0);
      // Unrelated parent re-render: same props object reference → memo blocks it.
      act(() => { bump(); });
      act(() => { bump(); });
      expect(selectorHits.mock.calls.length).toBe(afterMount);
    } finally {
      if (origDescriptor) Object.defineProperty(storeState, 'mapMode', origDescriptor);
    }
  });

  test('a changed prop reference DOES re-render the memoized toolbar (control)', () => {
    const selectorHits = vi.fn();
    const origDescriptor = Object.getOwnPropertyDescriptor(storeState, 'mapMode');
    Object.defineProperty(storeState, 'mapMode', {
      configurable: true,
      get() { selectorHits(); return 'view'; },
    });
    try {
      let bump;
      function Parent() {
        const [tick, setTick] = useState(0);
        bump = () => setTick(t => t + 1);
        // New onToggleInspector identity each render → memo cannot skip.
        return h(WorldMapToolbar, { ...toolbarProps(), onToggleInspector: () => tick });
      }
      render(h(Parent));
      const afterMount = selectorHits.mock.calls.length;
      act(() => { bump(); });
      expect(selectorHits.mock.calls.length).toBeGreaterThan(afterMount);
    } finally {
      if (origDescriptor) Object.defineProperty(storeState, 'mapMode', origDescriptor);
    }
  });
});
