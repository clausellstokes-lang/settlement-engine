/**
 * tests/store/userEdits.actions.test.js — Tier 5.4 store integration.
 *
 * Verifies the applyUserEditAction / revertUserEditAction wiring on
 * settlementSlice:
 *   - applies edits to the right entity at the right path
 *   - reverts cleanly
 *   - gates by EDITABLE_FIELDS (rejects unregistered paths silently)
 *   - tolerates missing entities / settlement
 *   - the selectors (countSettlementEdits / isSettlementEdited) reflect
 *     the live store state
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';

// Minimal companion slices — same pattern as settlementSlice.test.js
const stubSlice = (_set, _get) => ({
  auth: { user: null, tier: 'premium', loading: false },
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

function fixture() {
  return {
    tier: 'town',
    name: 'Bridgeford',
    population: 1500,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    arrivalScene: 'A stone bridge across the river.',
    pressureSentence: 'The guild squeezes the dockers.',
    institutions: [
      { id: 'inst.market', name: 'Market', desc: 'A bustling daily market.' },
    ],
    powerStructure: {
      factions: [
        { id: 'fac.guild', name: 'Merchant Guild', desc: 'Old money behind every door.' },
      ],
      conflicts: [],
    },
    npcs: [
      { id: 'npc.aldis', name: 'Aldis', role: 'Guildmaster',
        secret: { what: 'Embezzles dues.' },
        goal:   { short: 'Tighten control.' } },
    ],
    history: {
      historicalCharacter: 'Resilient',
      historicalEvents: [{ name: 'Flood Year', description: 'River broke.' }],
      currentTensions: [{ type: 'economic', description: 'Toll dispute' }],
    },
  };
}

describe('applyUserEditAction', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = fixture(); });
  });

  test('applies an edit to a settlement-root path', () => {
    store.getState().applyUserEditAction('settlement', -1, 'arrivalScene', 'Hand-written arrival.');
    expect(store.getState().settlement.arrivalScene).toBe('Hand-written arrival.');
    expect(store.getState().settlement._userEdits.arrivalScene.value).toBe('Hand-written arrival.');
  });

  test('applies an edit to an NPC field at the right index', () => {
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'New secret.');
    const npc = store.getState().settlement.npcs[0];
    expect(npc.secret.what).toBe('New secret.');
    expect(npc._userEdits['secret.what'].value).toBe('New secret.');
    expect(npc._authored).toBe(true);
  });

  test('applies an edit to a faction at the right path', () => {
    store.getState().applyUserEditAction('faction', 0, 'desc', 'Hand-written.');
    expect(store.getState().settlement.powerStructure.factions[0].desc).toBe('Hand-written.');
  });

  test('applies an edit to an institution at the right path', () => {
    store.getState().applyUserEditAction('institution', 0, 'desc', 'Hand-written.');
    expect(store.getState().settlement.institutions[0].desc).toBe('Hand-written.');
  });

  test('captures the original value on the first edit', () => {
    const before = store.getState().settlement.npcs[0].secret.what;
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'New.');
    expect(store.getState().settlement.npcs[0]._userEdits['secret.what'].originalValue).toBe(before);
  });

  test('preserves the original across subsequent edits to the same path', () => {
    const before = store.getState().settlement.npcs[0].secret.what;
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'first');
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'second');
    expect(store.getState().settlement.npcs[0]._userEdits['secret.what'].originalValue).toBe(before);
    expect(store.getState().settlement.npcs[0]._userEdits['secret.what'].value).toBe('second');
  });

  test('SILENTLY REJECTS unregistered paths (registry gate)', () => {
    store.getState().applyUserEditAction('npc', 0, 'name', 'Renamed Aldis');
    // Name didn't change — registry doesn't allow it.
    expect(store.getState().settlement.npcs[0].name).toBe('Aldis');
    expect(store.getState().settlement.npcs[0]._userEdits).toBeUndefined();
  });

  test('SILENTLY REJECTS edits to structural settlement fields', () => {
    const before = store.getState().settlement.population;
    store.getState().applyUserEditAction('settlement', -1, 'population', 9999);
    expect(store.getState().settlement.population).toBe(before);
  });

  test('SILENTLY REJECTS edits to unknown entity kinds', () => {
    store.getState().applyUserEditAction('dragon', 0, 'lairLocation', 'X');
    expect(store.getState().settlement._userEdits).toBeUndefined();
  });

  test('tolerates a missing entity (out-of-bounds index)', () => {
    expect(() => {
      store.getState().applyUserEditAction('npc', 99, 'secret.what', 'X');
    }).not.toThrow();
    // No edit landed.
    expect(store.getState().settlement.npcs[0]._userEdits).toBeUndefined();
  });

  test('no-op when settlement is null', () => {
    store.setState(s => { s.settlement = null; });
    expect(() => {
      store.getState().applyUserEditAction('npc', 0, 'secret.what', 'X');
    }).not.toThrow();
  });

  test('multiple edits on the same entity coexist', () => {
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'A');
    store.getState().applyUserEditAction('npc', 0, 'goal.short',  'B');
    store.getState().applyUserEditAction('npc', 0, 'personality', 'C');
    const npc = store.getState().settlement.npcs[0];
    expect(Object.keys(npc._userEdits).sort()).toEqual(['goal.short', 'personality', 'secret.what']);
  });

  test('multiple edits across entity kinds all land', () => {
    store.getState().applyUserEditAction('settlement', -1, 'arrivalScene', 'A');
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'B');
    store.getState().applyUserEditAction('faction', 0, 'desc', 'C');
    store.getState().applyUserEditAction('institution', 0, 'desc', 'D');
    expect(store.getState().countSettlementEdits()).toBe(4);
  });

  test('applies edit to historicalEvent description', () => {
    store.getState().applyUserEditAction('historicalEvent', 0, 'description', 'Refined event.');
    expect(store.getState().settlement.history.historicalEvents[0].description).toBe('Refined event.');
  });

  test('applies edit to currentTension description', () => {
    store.getState().applyUserEditAction('currentTension', 0, 'description', 'New tension prose.');
    expect(store.getState().settlement.history.currentTensions[0].description).toBe('New tension prose.');
  });
});

describe('revertUserEditAction', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = fixture(); });
  });

  test('restores the original value', () => {
    const before = store.getState().settlement.npcs[0].secret.what;
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'Edited');
    store.getState().revertUserEditAction('npc', 0, 'secret.what');
    expect(store.getState().settlement.npcs[0].secret.what).toBe(before);
  });

  test('clears _userEdits and _authored when no edits remain', () => {
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'X');
    store.getState().revertUserEditAction('npc', 0, 'secret.what');
    expect(store.getState().settlement.npcs[0]._userEdits).toBeUndefined();
    expect(store.getState().settlement.npcs[0]._authored).toBeUndefined();
  });

  test('keeps _authored when OTHER edits still exist', () => {
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'A');
    store.getState().applyUserEditAction('npc', 0, 'goal.short',  'B');
    store.getState().revertUserEditAction('npc', 0, 'secret.what');
    expect(store.getState().settlement.npcs[0]._authored).toBe(true);
  });

  test('is a no-op on a path that was never edited', () => {
    expect(() => {
      store.getState().revertUserEditAction('npc', 0, 'secret.what');
    }).not.toThrow();
  });

  test('is a no-op on a missing entity', () => {
    expect(() => {
      store.getState().revertUserEditAction('npc', 99, 'secret.what');
    }).not.toThrow();
  });

  test('reverts a settlement-root edit', () => {
    const before = store.getState().settlement.arrivalScene;
    store.getState().applyUserEditAction('settlement', -1, 'arrivalScene', 'Edited.');
    store.getState().revertUserEditAction('settlement', -1, 'arrivalScene');
    expect(store.getState().settlement.arrivalScene).toBe(before);
  });
});

describe('selectors', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = fixture(); });
  });

  test('countSettlementEdits starts at 0', () => {
    expect(store.getState().countSettlementEdits()).toBe(0);
  });

  test('countSettlementEdits increments per edit', () => {
    store.getState().applyUserEditAction('settlement', -1, 'arrivalScene', 'A');
    expect(store.getState().countSettlementEdits()).toBe(1);
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'B');
    expect(store.getState().countSettlementEdits()).toBe(2);
  });

  test('countSettlementEdits decrements on revert', () => {
    store.getState().applyUserEditAction('settlement', -1, 'arrivalScene', 'A');
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'B');
    store.getState().revertUserEditAction('npc', 0, 'secret.what');
    expect(store.getState().countSettlementEdits()).toBe(1);
  });

  test('isSettlementEdited flips to true on first edit, back to false on full revert', () => {
    expect(store.getState().isSettlementEdited()).toBe(false);
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'X');
    expect(store.getState().isSettlementEdited()).toBe(true);
    store.getState().revertUserEditAction('npc', 0, 'secret.what');
    expect(store.getState().isSettlementEdited()).toBe(false);
  });

  test('selectors return safely with null settlement', () => {
    store.setState(s => { s.settlement = null; });
    expect(store.getState().countSettlementEdits()).toBe(0);
    expect(store.getState().isSettlementEdited()).toBe(false);
  });
});

describe('integration with canonStatus + AI grounding', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = fixture(); });
  });

  test('an edit promotes the entity to canonStatus user', async () => {
    const { tagEntityCanon } = await import('../../src/domain/canonStatus.js');
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'X');
    const npc = store.getState().settlement.npcs[0];
    const tag = tagEntityCanon(npc);
    expect(tag.source).toBe('user');
    expect(tag.locked).toBe(true);
  });

  test('an edit shows up in buildAiGroundingPayload.userEdits', async () => {
    const { buildAiGroundingPayload } = await import('../../src/domain/aiGrounding.js');
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'CANARY');
    const payload = buildAiGroundingPayload(store.getState().settlement);
    expect(Array.isArray(payload.userEdits)).toBe(true);
    expect(payload.userEdits.some(e => e.value === 'CANARY')).toBe(true);
  });

  test('an edit appears in forbiddenChanges as a MUST PRESERVE line', async () => {
    const { forbiddenChanges } = await import('../../src/domain/aiGrounding.js');
    store.getState().applyUserEditAction('settlement', -1, 'arrivalScene', 'Hand-written.');
    const lines = forbiddenChanges(store.getState().settlement);
    expect(lines.some(l => l.includes('user-edited field') && l.includes('arrivalScene'))).toBe(true);
  });
});
