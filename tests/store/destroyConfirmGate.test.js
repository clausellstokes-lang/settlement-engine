/**
 * destroyConfirmGate.test.js — Wave R-1 (atlas queue #4 / VI.10 #148): confirm-gate
 * parity across the THREE settlement-terminal-death lanes.
 *
 *   Lane a (composer DESTROY_SETTLEMENT): type-the-name gate in the UI
 *     (ApplyControls §9c — pinned component-side in destroyConfirmSurfaces).
 *   Lane b (destroySavedSettlement, registry-reachable only): had NO gate. It now
 *     demands the settlement's exact name (`confirmName`) at the action boundary —
 *     the operations/command registry is this lane's only surface.
 *   Lane c (realm proposal FORCE_ABANDON): staged-proposal review IS its gate —
 *     the manifest pins it to the proposal lane, never direct apply.
 *
 * Recovery honesty rides along: the refusal envelope repeats the registry's
 * "one-way canon act" truth (undoState:'irreversible'), and the destroy path's
 * behavior (status flip + flat DESTROY_SETTLEMENT log row) is unchanged once
 * confirmed — the gate adds consent, not new capability.
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { realmVerbs } from '../../src/domain/events/realmManifest.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

function seedSave(store, { id = 'save-x', name = 'Doomed', settlementName = 'Testford' } = {}) {
  store.setState(s => {
    s.savedSettlements = [{
      id, name,
      settlement: { name: settlementName, tier: 'town', institutions: [], npcs: [] },
    }];
  });
}

describe('lane b — destroySavedSettlement demands type-the-name (Wave R-1)', () => {
  let store;
  beforeEach(() => { store = makeStore(); seedSave(store); });

  test('unconfirmed dispatch is refused and nothing changes', () => {
    const result = store.getState().destroySavedSettlement('save-x', 'meteor');
    expect(result.ok).toBe(false);
    expect(result.userMessage).toMatch(/one-way canon act/i);
    expect(result.userMessage).toMatch(/confirmName/);
    const save = store.getState().savedSettlements[0];
    expect(save.settlement.status).toBeUndefined();
    expect(save.campaignState?.eventLog ?? []).toEqual([]);
  });

  test('a wrong name is refused; the save row name alone is NOT the settlement name', () => {
    for (const wrong of ['testford', 'Doomed', ' Test ford ', '']) {
      const result = store.getState().destroySavedSettlement('save-x', 'meteor', { confirmName: wrong });
      expect(result.ok, `"${wrong}" must not confirm`).toBe(false);
    }
    expect(store.getState().savedSettlements[0].settlement.status).toBeUndefined();
  });

  test('the exact settlement name confirms — same destruction, now consented', () => {
    const result = store.getState().destroySavedSettlement('save-x', 'meteor', { confirmName: 'Testford' });
    expect(result.ok).toBe(true);
    const save = store.getState().savedSettlements[0];
    expect(save.settlement.status).toBe('destroyed');
    expect(save.settlement.destroyedReason).toBe('meteor');
    const log = save.campaignState.eventLog;
    expect(log[log.length - 1].type).toBe('DESTROY_SETTLEMENT');
    expect(result.receipts.length).toBeGreaterThan(0);
  });

  test('surrounding whitespace is forgiven, case is not', () => {
    const ok = store.getState().destroySavedSettlement('save-x', 'meteor', { confirmName: '  Testford  ' });
    expect(ok.ok).toBe(true);
  });

  test('a nameless save falls back to the save id (never fails open)', () => {
    store.setState(s => { s.savedSettlements = [{ id: 'save-n', settlement: {} }]; });
    const refused = store.getState().destroySavedSettlement('save-n', 'flood', { confirmName: '' });
    expect(refused.ok).toBe(false);
    const confirmed = store.getState().destroySavedSettlement('save-n', 'flood', { confirmName: 'save-n' });
    expect(confirmed.ok).toBe(true);
  });

  test('an unknown save id keeps the existing not-found refusal shape', () => {
    const result = store.getState().destroySavedSettlement('ghost', 'why', { confirmName: 'anything' });
    expect(result.ok).toBe(false);
    expect(result.action).toBe('destroySavedSettlement');
  });
});

describe('lane c — the realm death verb stages, never applies directly', () => {
  test('FORCE_ABANDON is pinned to the proposal lane with terminal-death authority', () => {
    const abandon = realmVerbs().find(v => v.verb === 'FORCE_ABANDON');
    expect(abandon).toBeTruthy();
    expect(abandon.lane).toBe('proposal');
    expect(abandon.candidateType).toBe('settlement_terminal_death');
    expect(abandon.authority).toBe('settlement_terminal_death');
  });
});
