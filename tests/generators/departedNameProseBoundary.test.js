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
 * THE CURE both lanes now share: swapNames goes through substituteWholeWord, which
 * fires only on a name flanked by non-word characters (Unicode-aware — `\b` is
 * ASCII-only and cannot see 'Weiß'). A name that does not collide is rewritten
 * exactly as the substring swap rewrote it, which the third test holds.
 *
 * FIXTURE, not the pipeline, and deliberately so: the collision needs two roster
 * members sharing a first name whose surnames stand in a prefix relation, plus a lock
 * on the shorter one — a conjunction no seed in the germanic corpus the sibling
 * locksSurviveFullGenerate.test.js runs can be steered into. The public entry point
 * (carryLockedRosterThroughGenerate) is called, so the whole merge → prose-repair
 * chain runs; only the roster is authored. Fixtures are JSON round-tripped before the
 * call: previous and fresh must not share object identity, or a mutation would read
 * as a repair.
 *
 * @enforced-by this test
 */
import { describe, test, expect } from 'vitest';
import { carryLockedRosterThroughGenerate } from '../../src/generators/generateSettlementPipeline.js';

/** Serialization boundary: kills every in-memory alias the fixtures could share. */
const reloaded = (value) => JSON.parse(JSON.stringify(value));

/** The locked character who takes the departed smuggler's slot. */
const KEEPER = { id: 'npc_9', name: 'Kara Voss', role: 'Smuggler', category: 'crime' };

/**
 * A fresh town whose roster holds a prefix pair: 'Wei Li' (the smuggler the keeper
 * displaces, by role match) and 'Wei Lin' (an elder who survives). Every prose field
 * names both, which is the only way the over-rewrite becomes visible.
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

/** Run the carry over round-tripped fixtures with the keeper locked. */
function carry(fresh) {
  return carryLockedRosterThroughGenerate(
    reloaded({ npcs: [KEEPER] }),
    reloaded(fresh),
    { npcs: [KEEPER.id] },
  );
}

describe('a departed name that prefixes a survivor cannot corrupt the survivor', () => {
  test('the fixture really does displace Wei Li — the substitution path ran', () => {
    const out = carry(freshTown());
    // Liveness anchor for the two tests below: if the merge preserved nobody, the
    // prose would be untouched and every "rewritten" assertion would be measuring
    // a no-op rather than a repair.
    expect(out._preservation?.preserved).toEqual([
      { id: 'npc_2', name: 'Kara Voss', fromId: 'npc_9' },
    ]);
    expect(out.settlement.npcs.map((npc) => npc.name)).toEqual(['Wei Lin', 'Kara Voss']);
  });

  test('NPC secret prose keeps Wei Lin whole while rewriting Wei Li', () => {
    const { settlement } = carry(freshTown());
    const survivor = settlement.npcs.find((npc) => npc.id === 'npc_1');
    // Under the substring swap these read 'Kara Vossn owes Kara Voss …'.
    expect(survivor.secret.what).toBe(`Wei Lin owes Kara Voss a silent debt.`);
    // The possessive still rewrites: an apostrophe is not a word character.
    expect(survivor.secret.stakes).toBe(`Kara Voss's ledger would cost Wei Lin the ward.`);
  });

  test('settlement-level prose carriers keep Wei Lin whole too', () => {
    const { settlement } = carry(freshTown());
    expect(settlement.pressureSentence).toBe(`Wei Lin and Kara Voss circle the same warehouse.`);
    expect(settlement.prominentRelationship).toEqual({
      npc1: 'Wei Lin',
      npc2: 'Kara Voss',
      full: `Wei Lin distrusts Kara Voss.`,
    });
  });

  test('a non-colliding departed name is still rewritten everywhere it appears', () => {
    // The over-rewrite cure must not become an under-rewrite: with no prefix
    // relation in the roster, the repair does exactly what it always did.
    const fresh = freshTown();
    fresh.npcs[0].name = 'Halda Brenn';
    fresh.npcs[0].secret = {
      what: `Halda Brenn owes Wei Li a silent debt.`,
      stakes: `Wei Li would ruin Halda Brenn.`,
    };
    fresh.pressureSentence = `Halda Brenn and Wei Li circle the same warehouse.`;
    fresh.prominentRelationship = { npc1: 'Halda Brenn', npc2: 'Wei Li', full: `Wei Li watches Halda Brenn.` };

    const { settlement } = carry(fresh);
    const survivor = settlement.npcs.find((npc) => npc.id === 'npc_1');
    expect(survivor.secret.what).toBe(`Halda Brenn owes Kara Voss a silent debt.`);
    expect(survivor.secret.stakes).toBe(`Kara Voss would ruin Halda Brenn.`);
    expect(settlement.pressureSentence).toBe(`Halda Brenn and Kara Voss circle the same warehouse.`);
    expect(settlement.prominentRelationship.full).toBe(`Kara Voss watches Halda Brenn.`);
  });
});
