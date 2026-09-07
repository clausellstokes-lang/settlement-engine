/**
 * setActiveSaveId — the wizard-save identity stamp (finding
 * components-shell-commerce-2, W-R2-TRUST).
 *
 * THE BUG THIS CATCHES: SaveToLibraryButton and BuyThisDossier's "save it first"
 * rung both called savesService.save() directly and never told the store the
 * draft was now a saved row. activeSaveId stayed null, so:
 *   • GenerateWizard.requestExit (gated on `!activeSaveId`) kept warning "this
 *     settlement hasn't been saved yet" AFTER a successful save — for every
 *     signed-in wizard saver; and
 *   • the $2.99 durable-purchase rung stayed 'unsaved', so a second save-first
 *     click re-ran the save and inserted ANOTHER row (supabaseSave enforces no
 *     service-level cap).
 *
 * THE FIX binds the returned id via this minimal action (kept minimal on purpose:
 * the slice ships eager in the first-paint closure, whose byte ratchet has a ~80 B
 * margin — a full savedSettlements cache upsert would blow it; the saved row still
 * surfaces on the next library hydration).
 *
 * THE PINS: setActiveSaveId stamps activeSaveId, no-ops on null/undefined, and
 * never mutates savedSettlements (identity stamp only).
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const stubSlice = () => ({
  auth: { user: { id: 'u1' }, tier: 'wanderer', loading: false },
  config: { settType: 'town' },
  canSave: () => true,
  maxSaves: () => 3,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

describe('setActiveSaveId — wizard save identity stamp', () => {
  let store;
  beforeEach(() => { store = makeStore(); });

  test('stamps activeSaveId from null', () => {
    expect(store.getState().activeSaveId).toBe(null);
    store.getState().setActiveSaveId('s-1');
    expect(store.getState().activeSaveId).toBe('s-1');
  });

  test('re-stamping to a different id moves activeSaveId', () => {
    store.getState().setActiveSaveId('s-1');
    store.getState().setActiveSaveId('s-2');
    expect(store.getState().activeSaveId).toBe('s-2');
  });

  test('no-ops on null / undefined (never clears a real id)', () => {
    store.getState().setActiveSaveId('s-1');
    store.getState().setActiveSaveId(null);
    store.getState().setActiveSaveId(undefined);
    expect(store.getState().activeSaveId).toBe('s-1');
  });

  test('does not mutate savedSettlements (identity stamp only)', () => {
    store.getState().setActiveSaveId('s-1');
    expect(store.getState().savedSettlements).toEqual([]);
  });
});
