/**
 * @vitest-environment jsdom
 *
 * tests/ui/mapPresentationControlledSeam.test.jsx — TC-0, the pane's OPTIONAL
 * controlled-presentation seam (DESIGN_TOWN_CARTOGRAPHY.md §12 / J-TC-8).
 *
 * The Map tab's sub-tab shell can only be ONE tab system if the pane's own
 * projection state can be handed over. `useTownMapPresentation` grew two optional
 * inputs for that, and this file pins both halves of the contract:
 *
 *   • UNCONTROLLED (every existing mount: the public gallery dossier, the library
 *     hero) behaves exactly as before — the hook owns the view and notifies
 *     nobody. Absent this half the whole seam could be a silent regression for
 *     three surfaces that never asked for it.
 *   • CONTROLLED — the supplied view WINS, a junk value degrades to the internal
 *     state rather than rendering an unknown projection, and EVERY path that
 *     changes the view from below reports up. The silent scene fallback is the
 *     one that matters: without the notifier the strip would keep claiming a
 *     Portrait the pane had already abandoned.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';

const h = vi.hoisted(() => ({ capability: { available: true, reason: null } }));

vi.mock('../../src/lib/townScene/viewPolicy.js', async (importOriginal) => ({
  ...(await importOriginal()),
  detectTownSceneCapability: () => h.capability,
}));

const { useTownMapPresentation } = await import('../../src/components/townMap/useTownMapPresentation.js');
const { default: SettlementMapPresentation } = await import('../../src/components/townMap/SettlementMapPresentation.jsx');

const SETTLEMENT = { id: 'alderport', name: 'Alderport', tier: 'town', population: 900 };

/** A headless probe: it renders nothing, it just publishes the hook's output. */
function Probe({ out, ...input }) {
  const api = useTownMapPresentation({
    sourceSettlement: SETTLEMENT,
    audience: 'dm',
    canEdit: false,
    desktop: true,
    saveId: 'save-1',
    worldState: null,
    regionalGraph: null,
    applyMapEdit: null,
    ...input,
  });
  out.current = api;
  return null;
}

function mount(input = {}) {
  const out = { current: null };
  const utils = render(<Probe out={out} {...input} />);
  return { out, ...utils };
}

beforeEach(() => {
  h.capability = { available: true, reason: null };
  localStorage.clear();
});
afterEach(cleanup);

describe('TC-0 seam — UNCONTROLLED is byte-for-byte the old behaviour', () => {
  test('the hook owns the view and opens on the plan', () => {
    const { out } = mount();
    expect(out.current.presentedViewMode).toBe('plan');
  });

  test('selectView moves the hook\'s own view and records the device-local sidecar', () => {
    const { out } = mount();
    act(() => { out.current.selectView('panorama', 'ink'); });
    expect(out.current.presentedViewMode).toBe('panorama');
    expect(JSON.parse(localStorage.getItem('sf.lastMapView.save-1'))).toEqual({ view: 'panorama', lens: 'ink' });
  });

  test('a portrait selection is refused outright on an incapable machine', () => {
    h.capability = { available: false, reason: 'webgl2-unavailable' };
    const { out } = mount();
    let accepted = null;
    act(() => { accepted = out.current.selectView('portrait3d', 'ink'); });
    expect(accepted).toBe(false);
    expect(out.current.presentedViewMode).toBe('plan');
    expect(out.current.sceneSelectable).toBe(false);
  });
});

describe('TC-0 seam — CONTROLLED hands the projection to the shell', () => {
  test('the supplied view wins over the hook\'s internal state', () => {
    const { out } = mount({ controlledView: 'panorama' });
    expect(out.current.presentedViewMode).toBe('panorama');
  });

  test('a junk controlled view degrades to the internal state, never to an unknown projection', () => {
    // Shape-guarded, not trusted: `player` is a real sub-tab id but NOT a
    // projection, and it must never reach the pane as one.
    expect(mount({ controlledView: 'player' }).out.current.presentedViewMode).toBe('plan');
    cleanup();
    expect(mount({ controlledView: 'illustrated' }).out.current.presentedViewMode).toBe('plan');
    cleanup();
    expect(mount({ controlledView: 7 }).out.current.presentedViewMode).toBe('plan');
  });

  test('a controlled portrait still falls back when the machine cannot show it', () => {
    h.capability = { available: false, reason: 'webgl2-unavailable' };
    const { out } = mount({ controlledView: 'portrait3d' });
    expect(out.current.presentedViewMode).toBe('plan');
  });

  test('an explicit selection is reported up', () => {
    const onControlledViewChange = vi.fn();
    const { out } = mount({ controlledView: 'plan', onControlledViewChange });
    act(() => { out.current.selectView('panorama', 'ink'); });
    expect(onControlledViewChange).toHaveBeenCalledWith('panorama');
  });

  test('THE SILENT SCENE FALLBACK is reported up too', () => {
    // handleSceneFallback with a runtime reason routes through fallbackToPlan,
    // which does NOT go through selectView. That is exactly the path a notifier
    // wired only into selectView would miss, leaving the strip lying.
    const onControlledViewChange = vi.fn();
    const { out } = mount({ controlledView: 'portrait3d', onControlledViewChange });
    expect(out.current.presentedViewMode).toBe('portrait3d');
    act(() => { out.current.handleSceneFallback({ reason: 'scene_chunk_error' }, 'ink'); });
    expect(onControlledViewChange).toHaveBeenCalledWith('plan');
  });

  test('the reader\'s own "Use 2D plan" choice is reported up as a real preference', () => {
    const onControlledViewChange = vi.fn();
    const { out } = mount({ controlledView: 'portrait3d', onControlledViewChange });
    act(() => { out.current.handleSceneFallback({ reason: 'user-selected-plan' }, 'ink'); });
    expect(onControlledViewChange).toHaveBeenCalledWith('plan');
    // A direct choice IS a preference, so it also reaches the device sidecar.
    expect(JSON.parse(localStorage.getItem('sf.lastMapView.save-1'))).toEqual({ view: 'plan', lens: 'ink' });
  });
});

describe('TC-0 seam — ONE tab system: the pane stands its own switch down', () => {
  const presentationProps = {
    viewMode: 'plan',
    onViewModeChange: () => {},
    sceneEnabled: false,
    panoramaOps: null,
    background: '#fff',
    settlementName: 'Alderport',
  };

  test('the projection switch renders by default, so every other mount is unchanged', () => {
    render(<SettlementMapPresentation {...presentationProps} />);
    expect(screen.getByRole('group', { name: 'Map view' })).toBeTruthy();
  });

  test('showSwitch={false} removes it, so the shell strip is the only view control', () => {
    const { container } = render(<SettlementMapPresentation {...presentationProps} showSwitch={false} />);
    // Non-vacuous: the component really rendered (its overlay wrapper survives),
    // it simply carries no second view control.
    expect(container.querySelector('[data-town-view-toggle]')).toBe(null);
    expect(screen.queryByRole('group', { name: 'Map view' })).toBe(null);
  });
});
