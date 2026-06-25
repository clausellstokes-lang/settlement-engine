/**
 * @vitest-environment jsdom
 *
 * tests/components/advanceMultiTickToolbar.test.jsx — Advance-scaling Stage 4 toolbar
 * affordances. Pins:
 *   (d) the determinate progress shows "Advancing N of Y" while a multi-tick advance
 *       is running, with a role=progressbar carrying aria-valuenow/min/max.
 *   (c) the resume chip appears for a persisted paused state and, when clicked, calls
 *       onResumeAdvance.
 *   (e) FLAG-OFF: neither the progress bar nor the resume chip renders, even when the
 *       same session/paused props are passed — the toolbar is unchanged off-flag.
 */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

// The toolbar reads a few store-derived values directly; a single mutable object
// backs every selector.
const storeState = {
  mapMode: 'view',
  setMapMode: vi.fn(),
  mapLoading: false,
  mapError: null,
  mapState: { customBackdrop: null },
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  return { useStore };
});

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { WorldMapToolbar } from '../../src/components/map/WorldMapToolbar.jsx';

afterEach(cleanup);

const BASE = {
  canManageCampaigns: true,
  activeCampaign: { id: 'c1', name: 'Realm', worldState: {} },
  activeCampaignId: 'c1',
  handleSelectCampaign: vi.fn(),
  activeCampaigns: [{ id: 'c1', name: 'Realm' }],
  handleSaveMapToCampaign: vi.fn(),
  handleClearMapFromCampaign: vi.fn(),
  savingMap: false,
  setShowSimulationRules: vi.fn(),
  showSimulationRules: false,
  worldPulseInterval: 'one_year',
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
  unreviewedCount: 0,
};

describe('WorldMapToolbar — Stage 4 multi-tick affordances', () => {
  test('(d) running session shows a determinate "Advancing N of Y" progressbar', () => {
    render(
      <WorldMapToolbar
        {...BASE}
        worldPulseBusy
        multiTickOn
        advanceSession={{ phase: 'running', ticksDone: 3, ticksTotal: 48 }}
        pausedAdvance={null}
        onResumeAdvance={vi.fn()}
      />,
    );
    expect(screen.getByText('Advancing 3 of 48')).toBeTruthy();
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('3');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('48');
  });

  test('(c) a persisted paused state renders the resume chip; clicking it resumes', () => {
    const onResumeAdvance = vi.fn();
    render(
      <WorldMapToolbar
        {...BASE}
        multiTickOn
        advanceSession={{ phase: 'idle', ticksDone: 0, ticksTotal: 0 }}
        pausedAdvance={{ ticksDone: 5, ticksTotal: 48, pendingMajors: [{ id: 'm1' }] }}
        onResumeAdvance={onResumeAdvance}
      />,
    );
    // The chip names the remaining work and is keyboard/SR operable.
    const chip = screen.getByRole('button', { name: /Advance paused\. Resume advancing, 43 of 48 steps remaining\./ });
    expect(chip).toBeTruthy();
    fireEvent.click(chip);
    expect(onResumeAdvance).toHaveBeenCalledWith({});
  });

  test('(e) FLAG-OFF: neither the progress bar nor the resume chip renders', () => {
    render(
      <WorldMapToolbar
        {...BASE}
        worldPulseBusy
        multiTickOn={false}
        advanceSession={{ phase: 'running', ticksDone: 3, ticksTotal: 48 }}
        pausedAdvance={{ ticksDone: 5, ticksTotal: 48, pendingMajors: [{ id: 'm1' }] }}
        onResumeAdvance={vi.fn()}
      />,
    );
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.queryByText(/Advancing 3 of 48/)).toBeNull();
    expect(screen.queryByText(/Advance paused/)).toBeNull();
  });
});
