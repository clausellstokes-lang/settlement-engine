/**
 * @vitest-environment jsdom
 *
 * tests/components/mapToolbarControlHelp.test.jsx — the map-title tranche.
 *
 * WorldMapToolbar's teaching titles used to live only in native title= OS
 * tooltips (hover-only, foreign chrome, unreachable on touch). They migrated to
 * an in-theme "?" control-reference panel (the GUIDE-2b house pattern:
 * IconButton "?" + a role=note panel). This pins the migration:
 *   (a) the "?" affordance is present and is NOT itself a native tooltip
 *       (its accessible name is an aria-label, so it does not re-inflate the
 *       shrink-only title= census the tranche exists to lower);
 *   (b) toggling it reveals a role=note panel carrying the migrated teaching
 *       (the destructive/effect copy that a bare visible label does not convey);
 *   (c) the migrated controls no longer carry a native title= attribute, while
 *       the Undo affordance — pinned + interval-folding — keeps its own.
 */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

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
  activeCampaign: { id: 'c1', name: 'Realm', worldState: {}, mapState: {} },
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
  canUndoPulse: true,
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
  activePresetId: null,
  handleApplyPreset: vi.fn(),
};

describe('WorldMapToolbar — in-theme control reference (map-title tranche)', () => {
  test('(a) the "?" affordance exists and carries an aria-label, not a native title', () => {
    render(<WorldMapToolbar {...BASE} />);
    const help = screen.getByRole('button', { name: 'About the map controls' });
    expect(help).toBeTruthy();
    // The migration must not re-inflate the census it lowers: the trigger's
    // accessible name is the aria-label, so it has NO native title= tooltip.
    expect(help.getAttribute('title')).toBeNull();
  });

  test('(b) toggling "?" reveals a role=note panel with the migrated teaching', () => {
    render(<WorldMapToolbar {...BASE} />);
    // Closed by default — comprehension-first, shown on demand.
    expect(screen.queryByRole('note')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'About the map controls' }));

    const panel = screen.getByRole('note');
    expect(panel).toBeTruthy();
    // The teaching that a bare label cannot convey now lives in-theme: the Undo
    // session-only caveat and the Clear-Image effect were title-only before.
    expect(panel.textContent).toMatch(/current session only/);
    expect(panel.textContent).toMatch(/returns to the generated terrain/);

    // Toggling again hides it.
    fireEvent.click(screen.getByRole('button', { name: 'About the map controls' }));
    expect(screen.queryByRole('note')).toBeNull();
  });

  test('(c) migrated controls dropped their native title; Undo keeps its pinned one', () => {
    render(<WorldMapToolbar {...BASE} />);
    // A representative migrated control: Advance Realm no longer has a tooltip.
    const advance = screen.getByText('Advance Realm').closest('button');
    expect(advance.getAttribute('title')).toBeNull();
    // Undo Advance keeps its native title (interval-folding + test-pinned).
    const undo = screen.getByText('Undo Advance').closest('button');
    expect(undo.getAttribute('title')).toMatch(/current session only/);
  });
});
