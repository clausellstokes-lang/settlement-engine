/** @vitest-environment jsdom */
/**
 * tests/components/mapOverlayThumbContract.test.jsx — pins the stringly-typed
 * contract between mapThumb.serializeOverlaySvg and MapOverlay.
 *
 * captureCampaignThumb composites the settlement-markers overlay onto the terrain
 * raster by calling `document.querySelector('[data-map-overlay-svg]')`
 * (serializeOverlaySvg) and drawing the serialized SVG on top. That selector's
 * only target is the `data-map-overlay-svg` attribute MapOverlay tags onto its
 * root <svg>. The pairing is stringly-typed and had NO test: on a sibling branch
 * lineage the attribute was silently lost in a merge, so serializeOverlaySvg
 * returned null and every campaign thumb composited bare terrain — latent,
 * because a null overlay is a documented best-effort fallback (the share still
 * succeeds). These tests pin both ends of the pairing so a future merge that
 * drops the attribute fails loudly here instead of shipping empty thumbnails.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import MapOverlay from '../../src/components/MapOverlay.jsx';
import { serializeOverlaySvg } from '../../src/lib/mapThumb.js';
import { MAP_MODES } from '../../src/store/mapSlice.js';

// The mount store. MapOverlay reads mapMode / annotateTool / mapState.layers /
// isDraggingOver / updateLabel / updateMarker / pushMapUndo / mapState.customBackdrop.
// bridge={null} makes the viewport-sync effect no-op and customBackdrop:null keeps
// image mode off, so neither useStore.getState() path (viewport fit, schedulePersist)
// ever fires — getState is stubbed to STORE only as a belt-and-braces guard.
let STORE = {
  mapMode: MAP_MODES.VIEW,
  annotateTool: null,
  isDraggingOver: false,
  mapState: { layers: {}, customBackdrop: null, placements: {} },
  updateLabel: vi.fn(),
  updateMarker: vi.fn(),
  pushMapUndo: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  const useStore = selector => selector(STORE);
  useStore.getState = () => STORE;
  return { useStore };
});
vi.mock('../../src/store', () => {
  const useStore = selector => selector(STORE);
  useStore.getState = () => STORE;
  return { useStore };
});

// Isolate the mount to MapOverlay's own root-<svg> contract: every child layer
// component it imports from src/components/map/ is stubbed to render nothing.
vi.mock('../../src/components/map/RelationshipEdges.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/ChainEdges.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/RegionalCausalityLayer.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/WarFaithMapOverlay.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/RoadsLayer.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/LabelsLayer.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/MarkersLayer.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/ForestsLayer.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/HitLayer.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/TreeSymbols.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/map/PlacementsLayer.jsx', () => ({ default: () => null }));

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('MapOverlay ↔ mapThumb overlay-serialization contract', () => {
  test('mounting MapOverlay exposes the [data-map-overlay-svg] querySelector target', () => {
    render(<MapOverlay bridge={null} />);
    const node = document.querySelector('[data-map-overlay-svg]');
    expect(node).not.toBeNull();
    expect(node.tagName.toLowerCase()).toBe('svg');
  });

  test('serializeOverlaySvg returns a sized SVG data URL for the mounted overlay', () => {
    render(<MapOverlay bridge={null} />);
    const url = serializeOverlaySvg(480, 270);
    expect(typeof url).toBe('string');
    expect(url.startsWith('data:image/svg+xml')).toBe(true);
    const xml = decodeURIComponent(url.slice(url.indexOf(',') + 1));
    expect(xml).toContain('width="480"');
    expect(xml).toContain('height="270"');
    expect(xml).toContain('http://www.w3.org/2000/svg');
  });

  test('serializeOverlaySvg returns null when no overlay is mounted (best-effort fallback)', () => {
    // Negative control: with nothing mounted, the querySelector target is absent,
    // so serialization degrades to the documented null fallback rather than throwing.
    cleanup();
    expect(document.querySelector('[data-map-overlay-svg]')).toBeNull();
    expect(serializeOverlaySvg(10, 10)).toBeNull();
  });
});
