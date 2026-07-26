/**
 * tests/store/regenPreservation.test.js — the reported defect, end to end.
 *
 * regenSection('npcs') rerolled the whole roster and then PERSISTED the result,
 * so a hand-written NPC was not merely lost from the view — the loss survived a
 * reload, while the Edit button promised the opposite. This boots the real slice
 * over the real generator and proves both halves: the edit survives in state,
 * and the copy written to the active save carries it too.
 *
 * The merge semantics are pinned in tests/domain/regenerationPreservation.test.js
 * and the generator join in tests/generators/regenPreservesUserCanon.test.js;
 * this file exists for the store path and its persist.
 */

import { describe, test, expect } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';

// Minimal companion slices — same pattern as settlementSlice.test.js.
const stubSlice = (set, get) => ({
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
  setCampaignRegionalGraph: () => {},
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

const AUTHORED = 'He sold the granary keys to the reeve.';
// userEdits stamps a wall-clock editedAt; pin it so the assertion cannot flap.
const EDITED_AT = '2026-01-01T00:00:00.000Z';

describe('regenSection(\'npcs\') and user canon', () => {
  test('a DRAFT reroll keeps the authored NPC, in state and in the saved copy', async () => {
    const store = makeStore();
    const generated = await store.getState().generateSettlement('regen-preserve-store');
    expect(generated).toBeTruthy();

    // Deliberately not npcs[0] — with the canon NPC first, a merge that ignored
    // the preservation predicate and kept the first N previous NPCs passed.
    const authoredName = store.getState().settlement.npcs[2].name;
    store.setState(s => {
      applyUserEdit(s.settlement.npcs[2], 'secret.what', AUTHORED, { editedAt: EDITED_AT });
      s.phase = 'draft';
      s.activeSaveId = 'save-P';
      s.savedSettlements = [{
        id: 'save-P',
        settlement: s.settlement,
        campaignState: { phase: 'draft', eventLog: [] },
      }];
    });

    await store.getState().regenSection('npcs');

    const live = store.getState().settlement.npcs.find(n => n.name === authoredName);
    expect(live, 'the authored NPC survived the reroll').toBeTruthy();
    expect(live._authored).toBe(true);
    expect(live._userEdits['secret.what'].value).toBe(AUTHORED);
    expect(live.secret.what).toBe(AUTHORED);

    // The durable half: before the fix this write is what made the loss
    // unrecoverable by reload.
    const persisted = store.getState().savedSettlements[0].settlement.npcs
      .find(n => n.name === authoredName);
    expect(persisted, 'the saved copy kept it too').toBeTruthy();
    expect(persisted._userEdits['secret.what'].value).toBe(AUTHORED);
  });

  test('the rerolled roster is still internally consistent', async () => {
    const store = makeStore();
    await store.getState().generateSettlement('regen-preserve-store-2');
    store.setState(s => {
      applyUserEdit(s.settlement.npcs[2], 'personality', 'Wry, and never sober.', {
        editedAt: EDITED_AT,
      });
      s.phase = 'draft';
    });

    await store.getState().regenSection('npcs');
    const s = store.getState().settlement;
    const ids = new Set(s.npcs.map(n => n.id));

    expect(ids.size).toBe(s.npcs.length);
    for (const rel of s.relationships || []) {
      expect(ids.has(rel.npc1Id)).toBe(true);
      expect(ids.has(rel.npc2Id)).toBe(true);
    }
    for (const faction of s.factions || []) {
      for (const member of faction.members || []) expect(ids.has(member.id)).toBe(true);
    }
  });

  test('a settlement with no authored NPC is unaffected by the preservation tail', async () => {
    const store = makeStore();
    await store.getState().generateSettlement('regen-preserve-store-3');
    const before = store.getState().settlement.npcs.map(n => n.name);

    await store.getState().regenSection('npcs');
    const after = store.getState().settlement.npcs.map(n => n.name);

    // Nothing was marked canon, so nothing is carried: the cast turns over.
    expect(after.filter(name => before.includes(name)).length).toBeLessThan(before.length);
  });
});
