/**
 * regenIdentityFold.test.js — the pure contract of the roster-reroll identity fold.
 *
 * tests/store/npcStateRegenRebind.test.js proves the WIRING against the real
 * pipeline: that the recon's own rebind scenario is cured end to end. This file
 * proves the ALGEBRA, including the shapes a store test cannot reach — garbage
 * input, the same-reference dormancy contract a change detector depends on, the
 * empty report, and cross-settlement isolation for both halves of the fold.
 *
 * WHY THE SAME-REFERENCE CONTRACT IS A TEST RATHER THAN A CONVENTION: the store
 * writes the campaign's world state (and persists the whole campaign array) only
 * when `changed` is true, so a fold that minted a fresh object on a no-op pass
 * would burn a durable write on every reroll in every campaign in the library.
 *
 * @enforced-by this test
 */
import { describe, expect, test } from 'vitest';

import { foldRegenIdentity, npcStatesAfterRosterReroll } from '../../src/domain/worldPulse/regenIdentityFold.js';
import { graduateNpc, npcLedgerOf } from '../../src/domain/worldPulse/npcLedger.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';

const TOWN = 'save.town';
const OTHER = 'save.other';

/** A world with rows for `TOWN`'s npc_1..npc_3 plus one row that lives elsewhere. */
function seededStates() {
  return {
    tick: 5,
    npcStates: {
      [`${TOWN}:npc_1`]: { marker: 'one' },
      [`${TOWN}:npc_2`]: { marker: 'two', rivalryTargets: [`${TOWN}:npc_1`, `${TOWN}:npc_3`] },
      [`${TOWN}:npc_3`]: { marker: 'three' },
      [`${OTHER}:npc_1`]: { marker: 'elsewhere' },
    },
  };
}

/** A lit world holding one graduated soul, and the id it was minted under. */
function graduatedIn(settlementId, rosterId, name, base = { tick: 5, simulationRules: { npcConsequencesEnabled: true } }) {
  const out = graduateNpc({
    worldState: base,
    settlementSeed: 'fold-seed',
    settlementId,
    rosterIdentity: { rosterId, name, role: 'Reeve' },
    tick: 5,
  });
  expect(out.wnpcId, `the fixture graduates ${name}`).toBeTruthy();
  return out;
}

describe('npcStates — the keeper is re-keyed, everybody replaced is dropped', () => {
  test('a moved keeper carries its row to the id it inherited', () => {
    const out = npcStatesAfterRosterReroll(seededStates(), TOWN, [{ fromId: 'npc_2', id: 'npc_3', name: 'Two' }]);
    expect(out.changed).toBe(true);
    expect(out.worldState.npcStates[`${TOWN}:npc_3`].marker).toBe('two');
    expect(out.worldState.npcStates[`${TOWN}:npc_2`]).toBeUndefined();
    expect(out.moved).toEqual([`${TOWN}:npc_2`]);
    expect(out.dropped.sort()).toEqual([`${TOWN}:npc_1`, `${TOWN}:npc_3`].sort());
  });

  test('a keeper whose slot did NOT move is kept, not dropped', () => {
    // `preserved` reports every survivor, moved or not, so an unmoved keeper's row
    // must survive on the strength of the report alone.
    const out = npcStatesAfterRosterReroll(seededStates(), TOWN, [{ fromId: 'npc_2', id: 'npc_2', name: 'Two' }]);
    expect(out.worldState.npcStates[`${TOWN}:npc_2`].marker).toBe('two');
    expect(out.moved).toEqual([]);
    expect(out.dropped.sort()).toEqual([`${TOWN}:npc_1`, `${TOWN}:npc_3`].sort());
  });

  test('NO REPORT means nobody survived, so every row for this town goes', () => {
    // regenNPCsPipeline OMITS `_preservation` entirely when it preserved nobody
    // (generateSettlementPipeline.js), so an absent report is a statement, not a
    // gap: a fully rerolled roster is a fully new cast.
    for (const report of [undefined, null, []]) {
      const out = npcStatesAfterRosterReroll(seededStates(), TOWN, report);
      expect(out.changed, `report ${JSON.stringify(report) ?? 'undefined'}`).toBe(true);
      expect(Object.keys(out.worldState.npcStates)).toEqual([`${OTHER}:npc_1`]);
    }
  });

  test('another settlement is carried verbatim, in its own order', () => {
    const out = npcStatesAfterRosterReroll(seededStates(), TOWN, [{ fromId: 'npc_2', id: 'npc_3', name: 'Two' }]);
    expect(out.worldState.npcStates[`${OTHER}:npc_1`]).toEqual({ marker: 'elsewhere' });
    // Ownership is decided by the key's START, not by containment. Two collisions
    // a looser match would take: an id that is a PREFIX of another (the trailing
    // colon catches this one) and an id that is a SUFFIX of another (only anchoring
    // at the start catches that one, and it would silently delete a whole town).
    const nested = { npcStates: { 'save:npc_1': { marker: 'short' }, 'save.long:npc_1': { marker: 'long' } } };
    expect(npcStatesAfterRosterReroll(nested, 'save', []).worldState.npcStates)
      .toEqual({ 'save.long:npc_1': { marker: 'long' } });
    const suffixed = { npcStates: { 'town:npc_1': { marker: 'mine' }, 'save.town:npc_1': { marker: 'not mine' } } };
    expect(npcStatesAfterRosterReroll(suffixed, 'town', []).worldState.npcStates)
      .toEqual({ 'save.town:npc_1': { marker: 'not mine' } });
  });

  test('rivalryTargets take the same two verdicts their subjects did', () => {
    const out = npcStatesAfterRosterReroll(seededStates(), TOWN, [
      { fromId: 'npc_2', id: 'npc_9', name: 'Two' },
      { fromId: 'npc_1', id: 'npc_4', name: 'One' },
    ]);
    // npc_1 moved to npc_4 (rewritten); npc_3 was replaced (stripped).
    expect(out.worldState.npcStates[`${TOWN}:npc_9`].rivalryTargets).toEqual([`${TOWN}:npc_4`]);
  });

  test('DORMANCY — nothing to rewrite returns the SAME worldState reference', () => {
    const empty = { tick: 1 };
    expect(npcStatesAfterRosterReroll(empty, TOWN, []).worldState).toBe(empty);
    const elsewhere = { npcStates: { [`${OTHER}:npc_1`]: { marker: 'elsewhere' } } };
    const out = npcStatesAfterRosterReroll(elsewhere, TOWN, []);
    expect(out.worldState).toBe(elsewhere);
    expect(out.changed).toBe(false);
    // An unmoved keeper set that covers the whole town is also a no-op.
    const one = { npcStates: { [`${TOWN}:npc_1`]: { marker: 'one' } } };
    expect(npcStatesAfterRosterReroll(one, TOWN, [{ fromId: 'npc_1', id: 'npc_1' }]).worldState).toBe(one);
  });

  test('TOTAL on garbage — no input shape can throw or invent a map', () => {
    for (const ws of [null, undefined, {}, { npcStates: null }, { npcStates: [] }, { npcStates: 'x' }]) {
      const out = npcStatesAfterRosterReroll(ws, TOWN, [{ fromId: 'a', id: 'b' }]);
      expect(out.changed).toBe(false);
      expect(out.worldState).toBe(ws);
    }
    // An empty settlement id would make the prefix ':' and match half the world.
    const states = seededStates();
    expect(npcStatesAfterRosterReroll(states, '', [{ fromId: 'npc_1', id: 'npc_2' }]).worldState).toBe(states);
  });

  test('THE KEY FORMAT PIN — the hand-spelled prefix is npcAgency\'s own', () => {
    // This leaf re-spells `${settlementId}:${npc.id}` rather than importing npcId,
    // whose module drags 79 files behind it. The re-spelling is only safe while it
    // agrees with the one writer, so the agreement is asserted rather than assumed.
    const npc = { id: 'npc_7', name: 'Someone' };
    expect(`${TOWN}:${npc.id}`).toBe(npcId(TOWN, npc, 0));
    const out = npcStatesAfterRosterReroll(
      { npcStates: { [npcId(TOWN, npc, 0)]: { marker: 'seven' } } },
      TOWN,
      [{ fromId: 'npc_7', id: 'npc_2', name: 'Someone' }],
    );
    expect(out.worldState.npcStates[npcId(TOWN, { id: 'npc_2' }, 0)].marker).toBe('seven');
  });
});

describe('the ledger half — one soul keeps one durable id, and nobody else is touched', () => {
  test('a moved keeper\'s originRef is refreshed to the slot it inherited', () => {
    const g = graduatedIn(TOWN, 'npc_2', 'Wolfhard');
    const out = foldRegenIdentity({
      worldState: g.worldState,
      settlementId: TOWN,
      preserved: [{ fromId: 'npc_2', id: 'npc_8', name: 'Wolfhard' }],
    });
    expect(out.changed).toBe(true);
    expect(out.originRefsRefreshed).toEqual([g.wnpcId]);
    expect(npcLedgerOf(out.worldState).roamers[g.wnpcId].originRef.rosterId).toBe('npc_8');
  });

  test('a graduate of ANOTHER settlement is never reached, however the slots line up', () => {
    const here = graduatedIn(TOWN, 'npc_2', 'Wolfhard');
    const away = graduatedIn(OTHER, 'npc_2', 'Wolfhard', here.worldState);
    const out = foldRegenIdentity({
      worldState: away.worldState,
      settlementId: TOWN,
      preserved: [{ fromId: 'npc_2', id: 'npc_8', name: 'Wolfhard' }],
    });
    // Same slot id, same name, different town — the fold must stop at the town line.
    expect(out.originRefsRefreshed).toEqual([here.wnpcId]);
    const ledger = npcLedgerOf(out.worldState);
    expect(ledger.roamers[here.wnpcId].originRef).toEqual({ settlementId: TOWN, rosterId: 'npc_8', name: 'Wolfhard' });
    expect(ledger.roamers[away.wnpcId].originRef).toEqual({ settlementId: OTHER, rosterId: 'npc_2', name: 'Wolfhard' });
  });

  test('a graduate who did NOT survive keeps their stale, harmless originRef', () => {
    const gone = graduatedIn(TOWN, 'npc_2', 'Departed');
    const out = foldRegenIdentity({
      worldState: gone.worldState,
      settlementId: TOWN,
      preserved: [{ fromId: 'npc_2', id: 'npc_8', name: 'Wolfhard' }],
    });
    // The slot matches; the NAME does not. Refreshing on the slot alone would hand
    // a departed soul's record the living keeper's slot — the ledger's one rebind.
    expect(out.originRefsRefreshed).toEqual([]);
    expect(npcLedgerOf(out.worldState).roamers[gone.wnpcId].originRef.rosterId).toBe('npc_2');
  });

  test('DARK — a world with no consequence economy is byte-identical after the fold', () => {
    const dark = { tick: 5, npcStates: { [`${OTHER}:npc_1`]: { marker: 'elsewhere' } } };
    const before = JSON.stringify(dark);
    const out = foldRegenIdentity({
      worldState: dark,
      settlementId: TOWN,
      preserved: [{ fromId: 'npc_2', id: 'npc_8', name: 'Wolfhard' }],
    });
    expect(out.worldState).toBe(dark);
    expect(out.changed).toBe(false);
    expect(JSON.stringify(out.worldState)).toBe(before);
  });

  test('the two halves compose — one pass moves the row AND the linkage', () => {
    const g = graduatedIn(TOWN, 'npc_2', 'Wolfhard');
    const seeded = { ...g.worldState, npcStates: seededStates().npcStates };
    const out = foldRegenIdentity({
      worldState: seeded,
      settlementId: TOWN,
      preserved: [{ fromId: 'npc_2', id: 'npc_8', name: 'Wolfhard' }],
    });
    expect(out.npcStatesMoved).toEqual([`${TOWN}:npc_2`]);
    expect(out.originRefsRefreshed).toEqual([g.wnpcId]);
    expect(out.worldState.npcStates[`${TOWN}:npc_8`].marker).toBe('two');
    expect(npcLedgerOf(out.worldState).roamers[g.wnpcId].originRef.rosterId).toBe('npc_8');
  });
});
