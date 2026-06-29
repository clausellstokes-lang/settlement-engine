/** @vitest-environment jsdom */
/**
 * tests/components/tierShiftControl.test.jsx — the DM "Settlement Size" promote/demote UI.
 * Pins that the control, against the REAL settlement slice, forces a one-step tier change
 * end to end (store action shiftTier → applyEvent → SHIFT_TIER handler → tier + population
 * rewrite), and that the cap/floor are no-ops.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';

function settlementAt(tier, population) {
  return {
    id: 's1', tier, name: 'Ashford', population,
    config: { tier, settType: tier, monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [], economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [], conflicts: [] }, npcs: [], activeConditions: [],
  };
}

const stubSlice = () => ({
  auth: { user: null, tier: 'premium', loading: false },
  customContent: {}, setPurchaseModalOpen: () => {}, canUseCustomContent: () => true,
});

let store;
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => store(selector) }));

import TierShiftControl from '../../src/components/settlement/TierShiftControl.jsx';

beforeEach(() => { store = create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) }))); });
afterEach(cleanup);

describe('TierShiftControl — force promote / demote', () => {
  test('promote dispatches SHIFT_TIER, moves up a tier, and rebands population', () => {
    store.setState((s) => { s.settlement = settlementAt('town', 2000); });
    render(<TierShiftControl />);
    fireEvent.click(screen.getByText(/Promote to City/));
    expect(store.getState().settlement.tier).toBe('city');
    expect(store.getState().settlement.population).toBeGreaterThanOrEqual(5001);
  });

  test('demote dispatches SHIFT_TIER and moves down a tier', () => {
    store.setState((s) => { s.settlement = settlementAt('town', 2000); });
    render(<TierShiftControl />);
    fireEvent.click(screen.getByText(/Demote to Village/));
    expect(store.getState().settlement.tier).toBe('village');
  });

  test('the cap (metropolis) makes promotion a no-op, labeled accordingly', () => {
    store.setState((s) => { s.settlement = settlementAt('metropolis', 50000); });
    render(<TierShiftControl />);
    fireEvent.click(screen.getByText(/At the largest tier/));
    expect(store.getState().settlement.tier).toBe('metropolis');   // unchanged
  });

  test('the floor (thorp) makes demotion a no-op, labeled accordingly', () => {
    store.setState((s) => { s.settlement = settlementAt('thorp', 40); });
    render(<TierShiftControl />);
    fireEvent.click(screen.getByText(/At the smallest tier/));
    expect(store.getState().settlement.tier).toBe('thorp');         // unchanged
  });
});
