/**
 * conflictTouched.test.js — THE TOUCHED POWERS ARE NAMED (COHERENCE-QUARREL cure 3; the chair's
 * charter `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §3).
 *
 * An issue can reach a kind of power that is not one of the two parties: a quarrel over
 * conscripting guild apprentices touches the craft guilds even when the soldiers and the council
 * are the ones quarrelling. Where such a power exists in the town and is not a party, the
 * quarrel's description says so in one clause, composed from the town's own powers.
 */
import { describe, expect, test } from 'vitest';

import { generateConflicts } from '../../src/generators/powerGenerator.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';

const CONSCRIPTION = 'Military conscription of guild apprentices';
const seeded = (seed, body) => {
  const previous = setActiveRng(createPRNG(seed));
  try { return body(); } finally { clearActiveRng(previous); }
};

/** The first conscription quarrel the pair draws over a run of seeds. */
function conscriptionQuarrel(powers, rels, cast) {
  for (let i = 0; i < 400; i++) {
    const found = seeded(`touched-${i}`, () => generateConflicts(powers, rels, {}, [{ name: 'Weavers Guild', category: 'Crafts' }], cast))
      .find((conflict) => conflict.issue === CONSCRIPTION);
    if (found) return found;
  }
  return null;
}

describe('a quarrel names the power its issue touches', () => {
  const cast = [
    { id: 'm', name: 'Mara', memberships: [{ power: 'Military/Guard', rank: 1 }] },
    { id: 'a', name: 'Ada', memberships: [{ power: 'Town Council', rank: 1 }] },
  ];
  const rels = [{ from: 'm', to: 'a', type: 'rival' }];

  test('the craft guilds are named in a conscription quarrel between the soldiers and the council', () => {
    const powers = [
      { faction: 'Town Council', category: 'government', isGoverning: true },
      { faction: 'Military/Guard', category: 'military' },
      { faction: 'Merchant Guilds', category: 'economy' },
      { faction: 'Craft Guilds', category: 'economy' },
    ];
    const quarrel = conscriptionQuarrel(powers, rels, cast);
    // anchored: the pair draws conscription somewhere in the run, so the clause is measured on a real quarrel
    expect(quarrel).not.toBeNull();
    // the crafts are reached first: the apprentices are theirs, though the merchants stand earlier
    expect(quarrel.desc).toContain('It reaches Craft Guilds too');
    // anchored: the quarrel exists (not null above) and names its two parties
    expect(quarrel.parties).not.toContain('Craft Guilds');
  });

  test('a town with no such power gets no clause', () => {
    const powers = [
      { faction: 'Town Council', category: 'government', isGoverning: true },
      { faction: 'Military/Guard', category: 'military' },
    ];
    const quarrel = conscriptionQuarrel(powers, rels, cast);
    expect(quarrel).not.toBeNull();
    expect(quarrel.desc).toBe(`Military/Guard and Town Council are in moderate conflict over ${CONSCRIPTION.toLowerCase()}. The stakes are labor control.`.replace('Military/Guard and Town Council', `${quarrel.parties[0]} and ${quarrel.parties[1]}`));
  });
});
