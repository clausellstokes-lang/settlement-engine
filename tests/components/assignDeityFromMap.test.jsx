/** @vitest-environment jsdom */
/**
 * tests/components/assignDeityFromMap.test.jsx — UX Phase 5 assign-deity steering.
 *
 * The ONE steering action in scope. Pins that assigning a deity FROM THE REALM
 * (pick a campaign settlement → the embedded PrimaryDeityPicker) dispatches the
 * SET_PRIMARY_DEITY canon event end to end, embedding a self-contained snapshot on
 * the right save, and that clearing it reverses cleanly (the assignment is
 * round-trippable — the event's deeper undo-stack round-trip is pinned by
 * tests/domain/events/undoRoundTrip.test.js).
 *
 * Uses the REAL settlement slice (a true store), so the path under test is the
 * production setPrimaryDeity → applyEvent → SET_PRIMARY_DEITY pipeline, not a stub.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { customRefIdFromItem } from '../../src/lib/customRegistry.js';

const DEITY = {
  id: 'deit_1', localUid: 'lu_vael', name: 'Vael',
  alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major', domain: 'war', isCustom: true,
};

function settlementFixture() {
  return {
    id: 's1', tier: 'town', name: 'Ashford', population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [{ id: 'institution.temple', name: 'Temple', category: 'religious', status: 'active' }],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}

const stubSlice = () => ({
  auth: { user: null, tier: 'premium', loading: false },
  config: { settType: 'town' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: { deities: [DEITY] },
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
  canUseCustomContent: () => true,
});

// The component reads the store via the shared `useStore` from src/store/index.js.
// Point that module at our real test store (a true zustand hook) so the component
// drives the genuine slice AND re-renders on store changes (so the picker appears
// after hydrateFromSave selects a settlement).
let store;
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => store(selector),
}));

import AssignDeityFromMap from '../../src/components/map/AssignDeityFromMap.jsx';

const SAVE = { id: 's1', name: 'Ashford', settlement: settlementFixture() };
const CAMPAIGN = { id: 'c1', name: 'The Reach', settlementIds: ['s1'] };

beforeEach(() => {
  store = create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
  store.setState(s => { s.savedSettlements = [SAVE]; });
});
afterEach(cleanup);

describe('AssignDeityFromMap — assign-deity steering (the one wired intervention)', () => {
  test('selecting a settlement + a deity dispatches SET_PRIMARY_DEITY and embeds the snapshot', () => {
    render(<AssignDeityFromMap campaign={CAMPAIGN} />);

    // 1. Pick the campaign settlement → hydrateFromSave loads it into the live slot.
    fireEvent.change(screen.getByLabelText('Settlement to assign a deity'), { target: { value: 's1' } });
    expect(store.getState().activeSaveId).toBe('s1');

    // 2. The embedded PrimaryDeityPicker is now live — pick the authored deity.
    const ref = customRefIdFromItem(DEITY);
    fireEvent.change(screen.getByLabelText('Primary deity'), { target: { value: ref } });

    // 3. SET_PRIMARY_DEITY landed: a self-contained snapshot is embedded on config.
    const config = store.getState().settlement.config;
    expect(config.primaryDeityRef).toBe(ref);
    expect(config.primaryDeitySnapshot).toMatchObject({ name: 'Vael', rankAxis: 'major' });
  });

  test('clearing the deity reverses the assignment (round-trippable)', () => {
    render(<AssignDeityFromMap campaign={CAMPAIGN} />);
    fireEvent.change(screen.getByLabelText('Settlement to assign a deity'), { target: { value: 's1' } });
    const ref = customRefIdFromItem(DEITY);
    fireEvent.change(screen.getByLabelText('Primary deity'), { target: { value: ref } });
    expect(store.getState().settlement.config.primaryDeitySnapshot).toBeTruthy();

    // Select "No primary deity (dormant)" → clears back to dormant (byte-identical).
    fireEvent.change(screen.getByLabelText('Primary deity'), { target: { value: '' } });
    const config = store.getState().settlement.config;
    expect('primaryDeityRef' in config).toBe(false);
    expect('primaryDeitySnapshot' in config).toBe(false);
  });

  test('the other steering interventions are surfaced as clearly-disabled (not half-wired)', () => {
    render(<AssignDeityFromMap campaign={CAMPAIGN} />);
    const declareWar = screen.getByText('Declare War');
    expect(declareWar.getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByText('Force Siege')).toBeTruthy();
    expect(screen.getByText('Trigger Trade War')).toBeTruthy();
    expect(screen.getByText('Sue for Peace')).toBeTruthy();
  });
});
