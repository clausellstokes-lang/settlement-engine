/** @vitest-environment jsdom */
/**
 * tests/components/cultPicker.test.jsx — the DM "Impose a cult" UI.
 *
 * Pins that the CultPicker, against the REAL settlement slice, imposes a cult-level
 * deity beneath the patron end to end (store action imposeCult → applyEvent →
 * IMPOSE_CULT → config.cultDeitySnapshots), and that the Remove control reverses it.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { customRefIdFromItem } from '../../src/lib/customRegistry.js';

const VAEL = { id: 'd_vael', localUid: 'lu_vael', name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major', domain: 'war', isCustom: true };
const SAEL = { id: 'd_sael', localUid: 'lu_sael', name: 'Sael', alignmentAxis: 'good', temperamentAxis: 'peaceful', rankAxis: 'cult', domain: 'harvest', isCustom: true };

function settlementWithPatron() {
  return {
    id: 's1', tier: 'town', name: 'Ashford', population: 2000,
    config: {
      monsterThreat: 'safe', tradeRouteAccess: 'road',
      primaryDeityRef: customRefIdFromItem(VAEL),
      primaryDeitySnapshot: { _deityRef: customRefIdFromItem(VAEL), name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major', lawAxis: 'neutral', domain: 'war' },
    },
    institutions: [], economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [], conflicts: [] }, npcs: [], activeConditions: [],
  };
}

const stubSlice = () => ({
  auth: { user: null, tier: 'premium', loading: false },
  customContent: { deities: [VAEL, SAEL] },
  setPurchaseModalOpen: () => {},
  canUseCustomContent: () => true,
});

let store;
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => store(selector) }));

import CultPicker from '../../src/components/settlement/CultPicker.jsx';

beforeEach(() => {
  store = create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
  store.setState(s => { s.settlement = settlementWithPatron(); });
});
afterEach(cleanup);

describe('CultPicker — impose a cult beneath the patron', () => {
  test('imposing a cult dispatches IMPOSE_CULT and embeds the snapshot', () => {
    render(<CultPicker />);
    const saelRef = customRefIdFromItem(SAEL);
    fireEvent.change(screen.getByLabelText('Impose a cult'), { target: { value: saelRef } });

    const cults = store.getState().settlement.config.cultDeitySnapshots;
    expect(cults).toHaveLength(1);
    expect(cults[0]).toMatchObject({ _deityRef: saelRef, name: 'Sael', rankAxis: 'cult' });
  });

  test('the patron is not offered as a cult option', () => {
    render(<CultPicker />);
    const select = screen.getByLabelText('Impose a cult');
    const optionValues = Array.from(select.querySelectorAll('option')).map(o => o.value).filter(Boolean);
    expect(optionValues).toEqual([customRefIdFromItem(SAEL)]);   // Vael (patron) filtered out
  });

  test('Remove reverses the imposition (cult key cleared)', () => {
    render(<CultPicker />);
    const saelRef = customRefIdFromItem(SAEL);
    fireEvent.change(screen.getByLabelText('Impose a cult'), { target: { value: saelRef } });
    expect(store.getState().settlement.config.cultDeitySnapshots).toHaveLength(1);

    fireEvent.click(screen.getByLabelText('Remove cult of Sael'));
    expect('cultDeitySnapshots' in store.getState().settlement.config).toBe(false);
  });
});
