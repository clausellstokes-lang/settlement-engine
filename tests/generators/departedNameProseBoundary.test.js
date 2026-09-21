/**
 * departedNameProseBoundary.test.js — the PREFIX-COLLISION pin for the departed-name
 * prose repair (kernel-generators review, 2026-07-30).
 *
 * THE DEFECT this pins closed: the repair rewrote a departed character's name out of
 * the roster's prose with `text.split(from).join(to)`, a raw substring swap. Full
 * names collide by prefix inside a single culture's draw window — east_asian
 * 'Wei Li' / 'Wei Lin' / 'Wei Liang', south_asian 'Bhat' / 'Bhatt' at every tier
 * (src/data/namingData.js, sliced by npcGenerator's tier window) — so displacing
 * 'Wei Li' rewrote the SURVIVING 'Wei Lin' into 'Kara Vossn' wherever the prose named
 * them together. Corrupted prose about a character who is still in the cast.
 *
 * THE CURE both repair lanes share: the pipeline's swapNames goes through
 * substituteWholeWord (src/lib/narrativeMutations.js), which fires only on a name
 * flanked by non-word characters (Unicode-aware — `\b` is ASCII-only and cannot see
 * 'Weiß'). A name that does not collide is rewritten exactly as the substring swap
 * rewrote it, which the last test holds.
 *
 * ⛔ WHERE THE CURE IS PINNED NOW, AND WHY IT MOVED (owner orders 2026-09-17, "remove the
 * other padlocks"). This file used to drive the fixture through the full-generate roster
 * carry (`carryLockedRosterThroughGenerate`) with the keeper LOCKED, because a lock was the
 * only lever that could seat an authored prefix pair in a fresh roster. The roster-row
 * padlock is retired and the read side reads no lock, so that carry sits at its dormancy
 * gate for every stored map: the first test pins exactly that on this fixture.
 *
 * ⛔ THE CURE ITSELF IS STILL LIVE, on the SECTION-REROLL path, and losing the carry almost
 * lost its only pipeline-level pin. `regenNPCsPipeline` merges an AUTHORED keeper (no lock
 * needed) and then repairs the prose through `refreshRosterProse → swapNames →
 * substituteWholeWord` (generateSettlementPipeline.js). Nothing else in the estate drives
 * that chain, so a revert of `swapNames` to `out.split(from).join(to)` — the exact defect
 * above — would have passed every test. The PIPELINE arm below closes that: it merges the
 * fixture with the real `mergePreservedNpcs` on an `_authored` keeper and repairs it with
 * the pipeline's own lane. The three sentence arms after it stay at the shared leaf, where
 * they can enumerate the boundary cases cheaply.
 *
 * @enforced-by this test
 */
import { describe, test, expect } from 'vitest';
import {
  carryLockedRosterThroughGenerate,
  refreshRosterProse,
} from '../../src/generators/generateSettlementPipeline.js';
import { mergePreservedNpcs } from '../../src/domain/regenerationPreservation.js';
import { substituteWholeWord } from '../../src/lib/narrativeMutations.js';

/** Serialization boundary: kills every in-memory alias the fixtures could share. */
const reloaded = (value) => JSON.parse(JSON.stringify(value));

/** The character who used to take the departed smuggler's slot. */
const KEEPER = { id: 'npc_9', name: 'Kara Voss', role: 'Smuggler', category: 'crime' };

/**
 * A fresh town whose roster holds a prefix pair: 'Wei Li' (the smuggler the keeper
 * would displace, by role match) and 'Wei Lin' (an elder who survives).
 */
function freshTown() {
  return {
    npcs: [
      {
        id: 'npc_1',
        name: 'Wei Lin',
        role: 'Elder',
        category: 'civic',
        secret: {
          what: `Wei Lin owes Wei Li a silent debt.`,
          stakes: `Wei Li's ledger would cost Wei Lin the ward.`,
        },
      },
      { id: 'npc_2', name: 'Wei Li', role: 'Smuggler', category: 'crime' },
    ],
    pressureSentence: `Wei Lin and Wei Li circle the same warehouse.`,
    prominentRelationship: {
      npc1: 'Wei Lin',
      npc2: 'Wei Li',
      full: `Wei Lin distrusts Wei Li.`,
    },
  };
}

/** The departed-name swap the repair performs, one whole word at a time. */
const swap = (text) => substituteWholeWord(text, 'Wei Li', 'Kara Voss');

describe('a departed name that prefixes a survivor cannot corrupt the survivor', () => {
  test('the stored lock that used to seat the keeper carries nobody (owner orders 2026-09-17)', () => {
    const fresh = reloaded(freshTown());
    const out = carryLockedRosterThroughGenerate(reloaded({ npcs: [KEEPER] }), fresh, { npcs: [KEEPER.id] });
    expect(out.settlement, 'a stored per-character lock rebuilt the fresh town').toBe(fresh);
    expect(Object.prototype.hasOwnProperty.call(out, '_preservation')).toBe(false);
    expect(out.settlement.npcs.map((npc) => npc.name)).toEqual(['Wei Lin', 'Wei Li']);
  });

  test('THE PIPELINE LANE: an authored keeper displaces Wei Li and the survivor stays Wei Lin', () => {
    const fresh = reloaded(freshTown());
    // The reroll path's own merge, on the lever that survived the padlock removal:
    // `_authored` canon, no lock anywhere in the call.
    const authoredKeeper = { ...KEEPER, _authored: true };
    const { npcs: merged, preserved, displacements } = mergePreservedNpcs(
      reloaded([authoredKeeper]),
      fresh.npcs,
      { mode: 'rebalance' },
    );
    // Non-vacuity: the merge really displaced the smuggler, or the repair below
    // would be proving nothing.
    expect(displacements, 'the authored keeper displaced nobody').toEqual([
      { from: 'Wei Li', to: 'Kara Voss' },
    ]);
    expect(merged.map((npc) => npc.name)).toEqual(['Wei Lin', 'Kara Voss']);

    const repaired = refreshRosterProse(
      merged, displacements, new Set(preserved.map((entry) => entry.id)),
    );
    const survivor = repaired.find((npc) => npc.id === 'npc_1');
    // Under the substring swap this read 'Kara Vossn owes Kara Voss a silent debt.'
    expect(survivor.secret.what).toBe(`Wei Lin owes Kara Voss a silent debt.`);
    expect(survivor.secret.stakes).toBe(`Kara Voss's ledger would cost Wei Lin the ward.`);
    // The keeper's own prose is canon and the merge does not edit it.
    expect(repaired.find((npc) => npc.name === 'Kara Voss').secret).toBeUndefined();
  });

  test('NPC secret prose keeps Wei Lin whole while rewriting Wei Li', () => {
    const { secret } = freshTown().npcs[0];
    // Under the substring swap these read 'Kara Vossn owes Kara Voss …'.
    expect(swap(secret.what)).toBe(`Wei Lin owes Kara Voss a silent debt.`);
    // The possessive still rewrites: an apostrophe is not a word character.
    expect(swap(secret.stakes)).toBe(`Kara Voss's ledger would cost Wei Lin the ward.`);
  });

  test('settlement-level prose carriers keep Wei Lin whole too', () => {
    const town = freshTown();
    expect(swap(town.pressureSentence)).toBe(`Wei Lin and Kara Voss circle the same warehouse.`);
    expect(swap(town.prominentRelationship.full)).toBe(`Wei Lin distrusts Kara Voss.`);
    expect(swap(town.prominentRelationship.npc1)).toBe('Wei Lin');
    expect(swap(town.prominentRelationship.npc2)).toBe('Kara Voss');
  });

  test('a non-colliding departed name is still rewritten everywhere it appears', () => {
    // The over-rewrite cure must not become an under-rewrite: with no prefix
    // relation, the repair does exactly what the substring swap always did.
    expect(swap(`Halda Brenn owes Wei Li a silent debt.`)).toBe(`Halda Brenn owes Kara Voss a silent debt.`);
    expect(swap(`Wei Li would ruin Halda Brenn.`)).toBe(`Kara Voss would ruin Halda Brenn.`);
    expect(swap(`Halda Brenn and Wei Li circle the same warehouse.`)).toBe(`Halda Brenn and Kara Voss circle the same warehouse.`);
    expect(swap(`Wei Li watches Halda Brenn.`)).toBe(`Kara Voss watches Halda Brenn.`);
  });
});
