/**
 * @vitest-environment jsdom
 *
 * settlementDetailMapToggle.test.jsx — the [Dossier | Map] lens toggle is RETIRED.
 *
 * The town map moved from a sibling Segmented toggle into a first-class TAB inside
 * OutputContainer (Summary / Systems / World / Map / Notes, order W2-c), which also
 * makes it reachable from the wizard draft flow. This test now guards the
 * retirement: SettlementDetail renders the dossier body with NO sibling Dossier/Map
 * toggle and NO sibling map pane (the map is mounted inside OutputContainer, mocked
 * here, so the pane never mounts in this test). We reuse the proven
 * settlementdetail.smoke store mock + stub the heavy bodies. Reverting the W2-c
 * commit restores the sibling toggle — one revert away.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

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

describe('SettlementDetail — map toggle retired; map is a dossier tab (W2-c)', () => {
  test('renders the dossier body, with NO sibling [Dossier | Map] toggle or map pane', async () => {
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

    // The dossier body renders. The town map now lives as a TAB inside
    // OutputContainer (mocked here), so the sibling map pane is never mounted.
    expect(await screen.findByTestId('dossier-body')).toBeTruthy();
    expect(screen.queryByTestId('map-body')).toBeNull();

    // The retired [Dossier | Map] segmented toggle is gone — neither segment button
    // exists on the detail surface any more.
    expect(screen.queryByRole('button', { name: 'Map' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Dossier' })).toBeNull();
  });
});
