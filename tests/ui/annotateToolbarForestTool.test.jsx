/**
 * @vitest-environment jsdom
 *
 * tests/ui/annotateToolbarForestTool.test.jsx
 *
 * Regression net for the "unreachable FOREST tool" fix.
 *
 * The map annotate pipeline ships a full forest-brush path — HitLayer's brush
 * gate (`tool === ANNOTATE_TOOLS.FOREST`), addForest, FOREST_STYLES, and
 * deleteForest — plus a visible Forests toggle in LayersPanel. But the toolbar
 * tool selector only rendered Select / Text / Marker, so `annotateTool` could
 * never become FOREST and the entire brush path was dead.
 *
 * These guards hold that:
 *   1. A Forest tool button exists and is reachable (has an accessible name).
 *   2. Clicking it calls setAnnotateTool with ANNOTATE_TOOLS.FOREST — the one
 *      value that unlocks the brush in HitLayer.
 *   3. When FOREST is the active tool, its options (style / radius / density)
 *      render and wire to setAnnotateOption, so a user can actually tune the
 *      brush instead of being stuck on defaults.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { ANNOTATE_TOOLS, FOREST_STYLES } from '../../src/store/mapSlice.js';

// Drive the component off a controllable state object rather than standing up
// the full 15-slice store. AnnotateToolbar reads everything via
// `useStore(selector)`, so a selector-applying mock is a faithful stand-in.
let state;
const setAnnotateTool = vi.fn();
const setAnnotateOption = vi.fn();

vi.mock('../../src/store', () => ({
  useStore: (selector) => selector(state),
}));

import AnnotateToolbar from '../../src/components/map/AnnotateToolbar.jsx';

function baseState(overrides = {}) {
  return {
    annotateTool: ANNOTATE_TOOLS.SELECT,
    setAnnotateTool,
    annotateOptions: {
      labelFont: 'serif',
      labelSize: 16,
      labelColor: '#1c1409',
      markerIcon: 'pin',
      markerColor: '#a0762a',
      forestStyle: 'pine',
      forestRadius: 60,
      forestDensity: 0.4,
    },
    setAnnotateOption,
    selectedAnnotationId: null,
    selectedAnnotationKind: null,
    deleteLabel: vi.fn(),
    deleteMarker: vi.fn(),
    deleteForest: vi.fn(),
    mapUndo: vi.fn(),
    mapRedo: vi.fn(),
    mapUndoStack: [],
    mapRedoStack: [],
    ...overrides,
  };
}

beforeEach(() => {
  setAnnotateTool.mockClear();
  setAnnotateOption.mockClear();
  state = baseState();
});
afterEach(cleanup);

describe('AnnotateToolbar — FOREST tool reachability', () => {
  test('renders a reachable Forest tool button', () => {
    render(<AnnotateToolbar />);
    // Would have thrown before the fix: no control carried a Forest name.
    expect(screen.getByRole('button', { name: /forest/i })).toBeTruthy();
  });

  test('clicking Forest selects the FOREST tool (the value HitLayer gates on)', () => {
    render(<AnnotateToolbar />);
    fireEvent.click(screen.getByRole('button', { name: /forest/i }));
    expect(setAnnotateTool).toHaveBeenCalledWith(ANNOTATE_TOOLS.FOREST);
  });

  test('forest options (style/radius/density) render and wire when FOREST is active', () => {
    state = baseState({ annotateTool: ANNOTATE_TOOLS.FOREST });
    render(<AnnotateToolbar />);

    const styleSelect = screen.getByLabelText('Forest style');
    // Every catalog style is offered.
    for (const s of FOREST_STYLES) {
      expect(styleSelect.querySelector(`option[value="${s}"]`)).toBeTruthy();
    }
    fireEvent.change(styleSelect, { target: { value: 'oak' } });
    expect(setAnnotateOption).toHaveBeenCalledWith('forestStyle', 'oak');

    fireEvent.change(screen.getByLabelText('Radius'), { target: { value: '120' } });
    expect(setAnnotateOption).toHaveBeenCalledWith('forestRadius', 120);

    fireEvent.change(screen.getByLabelText('Density'), { target: { value: '0.7' } });
    expect(setAnnotateOption).toHaveBeenCalledWith('forestDensity', 0.7);
  });

  test('forest options stay hidden while a non-forest tool is active', () => {
    state = baseState({ annotateTool: ANNOTATE_TOOLS.MARKER });
    render(<AnnotateToolbar />);
    expect(screen.queryByLabelText('Forest style')).toBeNull();
  });
});
