/**
 * @vitest-environment jsdom
 *
 * tests/ui/mapOverlayTransformContract.test.jsx — regression lock for the
 * WorldMapStage ↔ MapOverlay transform-ref contract (finding components-dossier-1).
 *
 * THE BUG THIS CATCHES: WorldMapStage rendered `<MapOverlay onTransform={...} />`
 * while MapOverlay's signature reads `{ bridge, transformOut }` and writes
 * `transformOut.current = transformRef.current`. Two mismatches — a prop-name
 * rename (onTransform vs transformOut) AND callback-vs-ref semantics — meant the
 * parent's overlayTransformRef was NEVER written, so the custom-image-backdrop
 * drop handler's inverse projection always failed and settlement drops were
 * silently dead in image mode.
 *
 * This mounts WorldMapStage in image mode with the REAL MapOverlay behind it and
 * asserts the parent-visible transform ref is populated after the fit effect. If
 * the prop name drifts on EITHER side, or MapOverlay stops writing `.current`,
 * `ref.current` stays null and this fails.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { createRef } from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';

afterEach(cleanup);

// One superset store drives every selector WorldMapStage + MapOverlay read.
// `getState()` is used by MapOverlay's image-mode effects (viewport restore +
// persist). Built via vi.hoisted so the vi.mock factory (hoisted to top) can see it.
const { useStore } = vi.hoisted(() => {
  const noop = () => {};
  const storeState = {
    // WorldMapStage selectors
    mapReady: true,
    mapError: null,
    setMapMode: noop,
    // shared
    mapMode: 'view',
    isDraggingOver: false,
    mapState: {
      placements: {},
      layers: {},
      // Custom image backdrop present ⇒ imageMode true on both components: the
      // FMG iframe is skipped and MapOverlay owns pan/zoom + the transform write.
      customBackdrop: { imageUrl: 'blob:test-image', w: 800, h: 600 },
      viewport: null,
    },
    // MapOverlay selectors
    annotateTool: null,
    updateLabel: noop,
    updateMarker: noop,
    pushMapUndo: noop,
    setMapViewport: noop,
  };
  const store = (selector) => selector(storeState);
  store.getState = () => storeState;
  return { useStore: store };
});

vi.mock('../../src/store/index.js', () => ({ useStore }));
vi.mock('../../src/store/mapSlice.js', () => ({
  MAP_MODES: { VIEW: 'view', TERRAIN: 'terrain', ANNOTATE: 'annotate', ROUTES: 'routes' },
}));

// WorldMapStage's own lazy children — stub so the mount stays self-contained.
const nullStub = { default: () => null };
vi.mock('../../src/components/map/PlacementDetailCard.jsx', () => nullStub);
vi.mock('../../src/components/map/QuickInspector.jsx', () => nullStub);
vi.mock('../../src/components/map/LayersPanel.jsx', () => nullStub);
vi.mock('../../src/components/map/SettlementPalette.jsx', () => nullStub);
vi.mock('../../src/components/map/MapLegend.jsx', () => nullStub);

// MapOverlay's SVG layer children — stub so we exercise the transform plumbing,
// not every layer's store surface.
vi.mock('../../src/components/map/RelationshipEdges.jsx', () => nullStub);
vi.mock('../../src/components/map/ChainEdges.jsx', () => nullStub);
vi.mock('../../src/components/map/RegionalCausalityLayer.jsx', () => nullStub);
vi.mock('../../src/components/map/WarFaithMapOverlay.jsx', () => nullStub);
vi.mock('../../src/components/map/RoadsLayer.jsx', () => nullStub);
vi.mock('../../src/components/map/LabelsLayer.jsx', () => nullStub);
vi.mock('../../src/components/map/MarkersLayer.jsx', () => nullStub);
vi.mock('../../src/components/map/ForestsLayer.jsx', () => nullStub);
vi.mock('../../src/components/map/HitLayer.jsx', () => nullStub);
vi.mock('../../src/components/map/TreeSymbols.jsx', () => nullStub);
vi.mock('../../src/components/map/PlacementsLayer.jsx', () => nullStub);
vi.mock('../../src/components/primitives/Dialog.jsx', () => ({
  TextInputDialog: () => null,
  default: () => null,
}));

import { WorldMapStage } from '../../src/components/map/WorldMapStage.jsx';

describe('WorldMapStage ↔ MapOverlay transform-ref contract', () => {
  test('image-mode overlay writes the parent transform ref after the fit effect', async () => {
    // jsdom returns a zero box by default; MapOverlay's fit effect requires a
    // real layout (W,H > 1) to commit a camera, so stub a concrete rect.
    const rectSpy = vi
      .spyOn(Element.prototype, 'getBoundingClientRect')
      .mockReturnValue({ width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600, x: 0, y: 0 });
    // jsdom has no ResizeObserver; MapOverlay observes the wrapper for viewBox sizing.
    const priorRO = global.ResizeObserver;
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    const overlayTransformRef = createRef();
    try {
      render(
        <WorldMapStage
          showingWizardNews={false}
          showingWorldPulse={false}
          showingPantheon={false}
          activeCampaign={null}
          activeSaves={[]}
          mapContainerRef={{ current: null }}
          handleDragOver={() => {}}
          handleDragLeave={() => {}}
          handleDrop={() => {}}
          iframeRef={{ current: null }}
          bridgeReady={false}
          bridgeRef={{ current: null }}
          overlayTransformRef={overlayTransformRef}
          onNavigate={() => {}}
          showLayersPanel={false}
          setShowLayersPanel={() => {}}
        />,
      );

      // The real (lazy) MapOverlay resolves, runs its image-mode fit effect, and
      // must publish its live transform to the ref WorldMap owns.
      await waitFor(() => expect(overlayTransformRef.current).toBeTruthy());
      expect(typeof overlayTransformRef.current.scale).toBe('number');
      expect(typeof overlayTransformRef.current.tx).toBe('number');
      expect(typeof overlayTransformRef.current.ty).toBe('number');
      // A contained fit of an 800×600 image in an 800×600 box is scale 1.
      expect(overlayTransformRef.current.scale).toBeGreaterThan(0);
    } finally {
      rectSpy.mockRestore();
      global.ResizeObserver = priorRO;
    }
  });
});
