/** @vitest-environment jsdom */
/**
 * tests/ui/worldMapInWords.test.jsx — SB5 (bar 9): the world map has a text
 * equivalent, and the third-party FMG editor is not a focus/SR destination.
 *
 * The FMG iframe is a visual, pointer-driven editor whose DOM the product does
 * not manage: tabbing into it stranded a keyboard user inside an unlabeled
 * third-party tool, and it exposed nothing readable to a screen reader. The
 * fix pair pinned here: (1) the iframe is out of the Tab order and the a11y
 * tree; (2) an sr-only "world map, in words" summary inside the map container
 * carries the map's factual content — which settlements stand on the world —
 * resolved through the SAME saves list the palette renders.
 */
import React, { createRef } from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

let mockState;
vi.mock('../../src/store/index.js', () => ({ useStore: (sel) => sel(mockState) }));

import { WorldMapStage } from '../../src/components/map/WorldMapStage.jsx';

afterEach(cleanup);

const baseState = () => ({
  mapState: { placements: {}, customBackdrop: null },
  isDraggingOver: false,
  mapMode: 'explore',
  mapReady: true,
  mapError: null,
  setMapMode: vi.fn(),
});

const stageProps = (over = {}) => ({
  showingWizardNews: false,
  showingWorldPulse: false,
  showingPantheon: false,
  activeCampaign: null,
  activeSaves: [],
  mapContainerRef: createRef(),
  handleDragOver: vi.fn(),
  handleDragLeave: vi.fn(),
  handleDrop: vi.fn(),
  iframeRef: createRef(),
  mapFrameUrl: 'http://localhost/map/index.html?parentOrigin=http%3A%2F%2Flocalhost',
  bridgeReady: false,
  bridgeRef: { current: null },
  overlayTransformRef: { current: null },
  onNavigate: vi.fn(),
  showLayersPanel: false,
  setShowLayersPanel: vi.fn(),
  mapReloadKey: 0,
  onReloadMap: vi.fn(),
  onCreateCampaign: vi.fn(),
  onSelectCampaign: vi.fn(),
  hasCampaigns: false,
  ...over,
});

describe('world map, in words (SB5 — bar 9 equivalence)', () => {
  it('the FMG iframe is removed from the Tab order and the accessibility tree', () => {
    mockState = baseState();
    const { container } = render(<WorldMapStage {...stageProps()} />);
    const iframe = container.querySelector('iframe[title="Fantasy Map"]');
    expect(iframe).not.toBeNull();
    expect(iframe.getAttribute('tabindex')).toBe('-1');
    expect(iframe.getAttribute('aria-hidden')).toBe('true');
  });

  it('loads the exact runtime-resolved cross-origin frame URL', () => {
    mockState = baseState();
    const mapFrameUrl = 'https://map.settlementforge.com/map/index.html'
      + '?v=sfdrop16&parentOrigin=https%3A%2F%2Fsettlementforge.com';
    const { container } = render(
      <WorldMapStage {...stageProps({ mapFrameUrl })} />,
    );

    expect(container.querySelector('iframe[title="Fantasy Map"]').src).toBe(mapFrameUrl);
  });

  it('the sr-only summary lists the placed settlements by name', () => {
    mockState = baseState();
    mockState.mapState.placements = {
      b1: { settlementId: 's1', x: 10, y: 20 },
      b2: { settlementId: 's2', x: 30, y: 40 },
    };
    render(
      <WorldMapStage {...stageProps({
        activeSaves: [
          { id: 's1', name: 'Ironhold', settlement: { name: 'Ironhold' } },
          { id: 's2', name: 'Elmspire', settlement: { name: 'Elmspire' } },
          { id: 's3', name: 'Unplaced Vale', settlement: { name: 'Unplaced Vale' } },
        ],
      })} />,
    );
    const words = screen.getByTestId('world-map-in-words');
    expect(words.className).toContain('sr-only');
    expect(words.textContent).toContain('2 settlements placed');
    expect(words.textContent).toContain('Ironhold');
    expect(words.textContent).toContain('Elmspire');
    // Only PLACED settlements appear — the palette lists the rest.
    expect(words.textContent).not.toContain('Unplaced Vale');
  });

  it('with nothing placed, the summary is a designed empty state, not silence', () => {
    mockState = baseState();
    render(<WorldMapStage {...stageProps()} />);
    const words = screen.getByTestId('world-map-in-words');
    expect(words.textContent).toContain('no settlements placed yet');
  });
});
