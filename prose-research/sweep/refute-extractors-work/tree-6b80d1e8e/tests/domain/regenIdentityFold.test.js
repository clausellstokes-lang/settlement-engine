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

import { foldRegenIdentity, npcStatesAfterRosterReroll, npcLadderAfterRosterReroll } from '../../src/domain/npc/regenIdentityFold.js';
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

// ── ENC-6 THE FIFTH MAP: the ladder's two grains ───────────────────────────────

/** A bond/grudge mark. `foreignSid` is what makes a mark CROSS-BORDER and therefore
 *  vulnerable to the far town's reroll; a domestic mark carries none. */
const mark = (foreignSid) => (foreignSid
  ? { sev: 0.5, week: 10, kind: 'friendship', foreignSid }
  : { sev: 0.5, week: 10, kind: 'friendship' });

/** A world whose ladder holds TOWN's three standings and one rung list, plus a record in
 *  OTHER carrying a cross-border bond INTO TOWN and a domestic bond that must not move. */
function seededLadder() {
  return {
    tick: 5,
    spatialLedgers: {
      npcLadder: {
        [TOWN]: {
          npcs: {
            [`${TOWN}:npc_1`]: { stock: 3, stigma: null, grudges: {} },
            [`${TOWN}:npc_2`]: { stock: 7, stigma: { sev: 0.4, week: 3, tick: 3 }, grudges: {} },
            [`${TOWN}:npc_3`]: { stock: 4, stigma: null, grudges: {} },
          },
          factions: { guild: { rungs: [`${TOWN}:npc_2`, `${TOWN}:npc_1`, `${TOWN}:npc_3`], week: 10 } },
        },
        [OTHER]: {
          npcs: {
            [`${OTHER}:npc_1`]: {
              stock: 5, stigma: null,
              bonds: {
                [`${TOWN}:npc_2`]: mark(TOWN),           // a keeper who MOVES
                [`${TOWN}:npc_3`]: mark(TOWN),           // a stranger's slot ⇒ DROPPED
                [`${OTHER}:npc_9`]: mark(null),          // domestic ⇒ untouched
              },
              grudges: { [`${TOWN}:npc_1`]: { sev: 0.3, week: 8, foreignSid: TOWN } },
            },
          },
          factions: { court: { rungs: [`${OTHER}:npc_1`] } },
        },
      },
    },
  };
}

const KEEPER = [{ fromId: 'npc_2', id: 'npc_3', name: 'Two' }];

describe('ENC-6 the ladder fold — GRAIN 1, the record key in the rerolled town', () => {
  test('a moved keeper carries his whole standing, and everybody replaced is dropped', () => {
    // The grain a first reading misses. Before this fold a reroll handed a man's stock,
    // his stigma, his grudges and every mark he held to the stranger who took his slot.
    const out = npcLadderAfterRosterReroll(seededLadder(), TOWN, KEEPER);
    expect(out.changed).toBe(true);
    const rec = out.worldState.spatialLedgers.npcLadder[TOWN];
    expect(rec.npcs[`${TOWN}:npc_3`].stock).toBe(7);                 // the keeper's own stock
    expect(rec.npcs[`${TOWN}:npc_3`].stigma.sev).toBe(0.4);          // and his own stigma
    expect(rec.npcs[`${TOWN}:npc_2`]).toBeUndefined();
    expect(rec.npcs[`${TOWN}:npc_1`]).toBeUndefined();               // replaced ⇒ dropped
    expect(out.moved).toEqual([`${TOWN}:npc_2`]);
    expect(out.dropped.sort()).toEqual([`${TOWN}:npc_1`, `${TOWN}:npc_3`].sort());
  });

  test('the RUNG LIST follows the same two verdicts — a seat is not handed to a stranger', () => {
    // A rungs array is a list of the same keys, so leaving it alone would re-seat the
    // rerolled cast by arithmetic: index 0 would name whoever now holds that slot.
    const out = npcLadderAfterRosterReroll(seededLadder(), TOWN, KEEPER);
    expect(out.worldState.spatialLedgers.npcLadder[TOWN].factions.guild.rungs).toEqual([`${TOWN}:npc_3`]);
  });

  test('an UNLOCKED reroll preserves nobody, so the town keeps no standing at all', () => {
    const out = npcLadderAfterRosterReroll(seededLadder(), TOWN, null);
    expect(out.changed).toBe(true);
    expect(out.worldState.spatialLedgers.npcLadder[TOWN].npcs).toEqual({});
    expect(out.worldState.spatialLedgers.npcLadder[TOWN].factions.guild.rungs).toEqual([]);
  });
});

describe('ENC-6 the ladder fold — GRAIN 2, the cross-border mark held elsewhere', () => {
  test('a mark pointing at a keeper is RE-KEYED, and one pointing at a stranger is DROPPED', () => {
    // Without this half a magistrate in one town goes on holding a friendship with a name
    // that now belongs to somebody else — the same rebind, one border away.
    const out = npcLadderAfterRosterReroll(seededLadder(), TOWN, KEEPER);
    const held = out.worldState.spatialLedgers.npcLadder[OTHER].npcs[`${OTHER}:npc_1`];
    expect(held.bonds[`${TOWN}:npc_3`]).toBeTruthy();     // the keeper's mark followed him
    expect(held.bonds[`${TOWN}:npc_2`]).toBeUndefined();  // off the old key
    expect(out.marksRekeyed).toEqual([`${OTHER}|${OTHER}:npc_1|${TOWN}:npc_2`]);
    // TWO drops, and the second is the point: the GRUDGE on npc_1 is a cross-border mark
    // too, and a fold that only walked bonds would have left it pointing at a stranger.
    expect(out.marksDropped).toEqual([
      `${OTHER}|${OTHER}:npc_1|${TOWN}:npc_1`,
      `${OTHER}|${OTHER}:npc_1|${TOWN}:npc_3`,
    ]);
  });

  test('GRUDGES take the same fold as bonds — the roads ransom bond is cured by this entry', () => {
    const out = npcLadderAfterRosterReroll(seededLadder(), TOWN, KEEPER);
    const held = out.worldState.spatialLedgers.npcLadder[OTHER].npcs[`${OTHER}:npc_1`];
    expect(held.grudges[`${TOWN}:npc_1`]).toBeUndefined(); // npc_1 was replaced
  });

  test('a DOMESTIC mark is never touched — foreignSid is what makes a mark vulnerable', () => {
    const out = npcLadderAfterRosterReroll(seededLadder(), TOWN, KEEPER);
    const held = out.worldState.spatialLedgers.npcLadder[OTHER].npcs[`${OTHER}:npc_1`];
    expect(held.bonds[`${OTHER}:npc_9`]).toBeTruthy();
    expect(out.worldState.spatialLedgers.npcLadder[OTHER].factions.court.rungs).toEqual([`${OTHER}:npc_1`]);
  });
});

describe('ENC-6 the ladder fold — the dormancy and totality contracts', () => {
  test('a world with NO ladder ledger is returned by REFERENCE (no durable write burned)', () => {
    const ws = { tick: 5, npcStates: {} };
    const out = npcLadderAfterRosterReroll(ws, TOWN, KEEPER);
    expect(out.changed).toBe(false);
    expect(out.worldState).toBe(ws);
  });

  test('a reroll that moves nobody and drops nobody is also a no-op by reference', () => {
    const ws = seededLadder();
    const all = [
      { fromId: 'npc_1', id: 'npc_1' }, { fromId: 'npc_2', id: 'npc_2' }, { fromId: 'npc_3', id: 'npc_3' },
    ];
    const out = npcLadderAfterRosterReroll(ws, TOWN, all);
    expect(out.changed).toBe(false);
    expect(out.worldState).toBe(ws);
  });

  test('garbage is survived: no worldState, no settlement id, a non-object ledger', () => {
    expect(npcLadderAfterRosterReroll(null, TOWN, KEEPER).changed).toBe(false);
    expect(npcLadderAfterRosterReroll(seededLadder(), '', KEEPER).changed).toBe(false);
    expect(npcLadderAfterRosterReroll({ spatialLedgers: { npcLadder: 7 } }, TOWN, KEEPER).changed).toBe(false);
  });

  test('THE BRIDGE folds the ladder alongside npcStates in the one step', () => {
    const ws = { ...seededStates(), ...seededLadder() };
    const out = foldRegenIdentity({ worldState: ws, settlementId: TOWN, preserved: KEEPER });
    expect(out.changed).toBe(true);
    expect(out.npcStatesMoved).toEqual([`${TOWN}:npc_2`]);
    expect(out.ladderMoved).toEqual([`${TOWN}:npc_2`]);
    expect(out.ladderMarksRekeyed).toEqual([`${OTHER}|${OTHER}:npc_1|${TOWN}:npc_2`]);
    expect(out.ladderMarksDropped).toEqual([
      `${OTHER}|${OTHER}:npc_1|${TOWN}:npc_1`,
      `${OTHER}|${OTHER}:npc_1|${TOWN}:npc_3`,
    ]);
    // Both maps really moved on the SAME pass, which is the bridge's whole claim.
    expect(out.worldState.npcStates[`${TOWN}:npc_3`].marker).toBe('two');
    expect(out.worldState.spatialLedgers.npcLadder[TOWN].npcs[`${TOWN}:npc_3`].stock).toBe(7);
  });
});
