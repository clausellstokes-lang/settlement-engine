/**
 * @vitest-environment jsdom
 *
 * settlementDetailMapToggle.test.jsx — the SM-2 [Dossier | Map] lens toggle.
 *
 * The Segmented toggle switches the detail BODY between OutputContainer (dossier)
 * and SettlementMapPane (map). We reuse the proven settlementdetail.smoke store
 * mock (view mode, ~20 selectors) and stub the two heavy lazy bodies so the test
 * asserts the body FORK, not their internals. The map must render as a SIBLING of
 * OutputContainer, never both at once.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

afterEach(cleanup);

// Analytics is fire-and-forget; stub it so the mount path stays quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Stub the two heavy bodies with identifiable markers so the fork is observable.
vi.mock('../../src/components/OutputContainer.jsx', () => ({
  default: () => <div data-testid="dossier-body">DOSSIER_BODY</div>,
}));
vi.mock('../../src/components/townMap/SettlementMapPane.jsx', () => ({
  default: ({ settlement }) => <div data-testid="map-body">MAP_BODY:{settlement?.name}</div>,
}));

const storeState = {
  hydrateAiFromSave: vi.fn(),
  hydrateFromSave: vi.fn(),
  revertCurrentToRaw: vi.fn(() => Promise.resolve()),
  clearAiSettlement: vi.fn(),
  aiSettlement: null,
  aiDailyLife: null,
  phase: 'draft',
  editMode: false,
  toggleEditMode: vi.fn(),
  isSettlementEdited: () => false,
  countSettlementEdits: () => 0,
  auth: { tier: 'anon', user: null },
  isElevated: () => false,
  setPurchaseModalOpen: vi.fn(),
  setEditMode: vi.fn(),
  savedSettlements: [],
  systemState: {},
  eventLog: [],
  isFounder: () => false,
  requestNarrative: vi.fn(() => Promise.resolve()),
  markExported: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

const detail = {
  name: 'Stoneford',
  settlement: { name: 'Stoneford', npcs: [], factions: [], neighbourNetwork: [] },
  saveData: { id: 'save-1' },
  config: {},
  institutionToggles: {},
  categoryToggles: {},
};
const noop = () => {};

describe('SettlementDetail — Dossier/Map toggle', () => {
  test('defaults to the dossier body, and the Map segment swaps in the map pane', async () => {
    const { default: SettlementDetail } = await import('../../src/components/SettlementDetail.jsx');
    render(
      <SettlementDetail
        detail={detail}
        setDetail={noop}
        saves={[]}
        _setSaves={noop}
        linking={false}
        setLinking={noop}
        editNamesOpen={false}
        setEditNamesOpen={noop}
        handleLink={noop}
        removeNeighbour={noop}
        applyRename={noop}
        onLoad={noop}
      />,
    );

    // Default lens = dossier.
    expect(await screen.findByTestId('dossier-body')).toBeTruthy();
    expect(screen.queryByTestId('map-body')).toBeNull();

    // Click the "Map" segment.
    fireEvent.click(screen.getByRole('button', { name: 'Map' }));

    // Map pane swaps in; dossier body is gone (sibling fork, not both).
    expect(await screen.findByTestId('map-body')).toBeTruthy();
    expect(screen.queryByTestId('dossier-body')).toBeNull();

    // Back to Dossier restores the dossier body.
    fireEvent.click(screen.getByRole('button', { name: 'Dossier' }));
    expect(await screen.findByTestId('dossier-body')).toBeTruthy();
    expect(screen.queryByTestId('map-body')).toBeNull();
  });
});
