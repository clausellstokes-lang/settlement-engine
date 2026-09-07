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
import { regenHistoryPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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

/**
 * [generators-pipeline-5] — the history reroll's minted seed, end to end.
 *
 * The pipeline minted a seed, used it, and dropped it, so a PERSISTED history
 * reroll was unreproducible: the settlement still carried its original `_seed`,
 * which by then reproduced a different history. This boots the real slice over the
 * real generator and proves the three things the fix has to hold together — the
 * seed lands at the settlement ROOT (not inside `history`), the durable copy
 * carries it, and the recorded seed actually replays the persisted history.
 *
 * The root spelling is load-bearing: the DM-share gallery strip is a TOP-LEVEL key
 * list (`- '_seed' - '_regenSeed' - '_config'`, migration 121, mirrored by
 * publicSafe.js), so a sibling key would have leaked a seed that replays the
 * unsanitized settlement. The last case joins the real writer to the real strip.
 */
describe('regenSection(\'history\') records the seed it rerolled with', () => {
  test('the seed lands at the settlement root, in state and in the saved copy', async () => {
    const store = makeStore();
    await store.getState().generateSettlement('regen-history-seed-store');
    store.setState(s => {
      s.phase = 'draft';
      s.activeSaveId = 'save-H';
      s.savedSettlements = [{
        id: 'save-H',
        settlement: s.settlement,
        campaignState: { phase: 'draft', eventLog: [] },
      }];
    });

    await store.getState().regenSection('history');

    const live = store.getState().settlement;
    expect(typeof live._regenSeed, 'the reroll recorded its seed').toBe('string');
    expect(live._regenSeed.length).toBeGreaterThan(0);
    // Never `history._regenSeed`: it would read as a field OF the history and the
    // top-level gallery strip would not cover it. `historicalEvents` anchors the
    // check as a sibling written by the same fold.
    expectAbsentWithAnchor(Object.keys(live.history), '_regenSeed', 'historicalEvents', 'folded history');

    // The durable half — an in-memory-only record ghosts on reload, which is the
    // exact shape of the defect this closes.
    expect(store.getState().savedSettlements[0].settlement._regenSeed).toBe(live._regenSeed);
  });

  test('the recorded seed replays the persisted history byte for byte', async () => {
    const store = makeStore();
    await store.getState().generateSettlement('regen-history-replay-store');
    store.setState(s => { s.phase = 'draft'; });
    // JSON round-trip: replay must run against the settlement as it PERSISTS, not
    // against the live in-memory object (the alias/serialization gap is where
    // reload-only bugs hide).
    const pre = JSON.parse(JSON.stringify(store.getState().settlement));

    await store.getState().regenSection('history');
    const after = store.getState().settlement;

    const replay = regenHistoryPipeline(pre, pre.config || store.getState().config, {
      seed: after._regenSeed,
    });
    expect(JSON.stringify(replay.history)).toBe(JSON.stringify(after.history));

    // Non-vacuous: the settlement's ORIGINAL seed does not reproduce the reroll, so
    // the equality above measures the recorded seed rather than a history that
    // would have come back the same whatever seed it was handed.
    const stale = regenHistoryPipeline(pre, pre.config || store.getState().config, {
      seed: pre._seed,
    });
    expect(JSON.stringify(stale.history)).not.toBe(JSON.stringify(after.history));
  });

  test('a rerolled-history settlement leaks no _regenSeed through the DM-share projection', async () => {
    const store = makeStore();
    await store.getState().generateSettlement('regen-history-strip-store');
    store.setState(s => { s.phase = 'draft'; });
    await store.getState().regenSection('history');

    const settlement = store.getState().settlement;
    const recorded = settlement._regenSeed;
    expect(recorded, 'the writer produced a seed for the strip to remove').toBeTruthy();

    // full: true is the DM-share (owner opt-in) projection — the one that skips the
    // recursive denylist and so leaked hardest before the seed strip landed.
    const shared = toPublicSafe(settlement, { full: true });
    expect(shared._regenSeed).toBeUndefined();
    expectAbsentWithAnchor(JSON.stringify(shared), recorded, settlement.name, 'DM-share full');

    // …and the default (anonymous) projection, whose top-level allowlist fails closed.
    const anon = toPublicSafe(settlement);
    expect(anon._regenSeed).toBeUndefined();
    expectAbsentWithAnchor(JSON.stringify(anon), recorded, settlement.name, 'public');
  });
});
