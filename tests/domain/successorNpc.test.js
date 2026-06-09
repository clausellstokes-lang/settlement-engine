import { describe, it, expect } from 'vitest';
import { successorNpc, replaceOustedNpcs } from '../../src/domain/worldPulse/successorNpc.js';
import { isCorruptibleFlaw } from '../../src/domain/corruption.js';
import { createPRNG } from '../../src/generators/prng.js';

const ousted = () => ({
  name: 'Captain Vex', role: 'Captain of the Watch', category: 'military',
  factionAffiliation: 'City Watch', institutionId: 'inst_watch', importance: 'key',
  corrupt: true, timesExposed: 2, goal: { short: 'skim', long: 'rule the docks' },
});

describe('successorNpc — Phase 1b-ii-c', () => {
  it('inherits the seat but is a clean, non-corruptible newcomer', () => {
    const succ = successorNpc(ousted(), createPRNG('s').fork('succ'));
    expect(succ.factionAffiliation).toBe('City Watch'); // same seat
    expect(succ.role).toBe('Captain of the Watch');
    expect(succ.importance).toBe('key');
    expect(succ.corrupt).toBe(false);
    expect(succ.timesExposed).toBe(0);
    expect(succ.replacedNpc).toBe('Captain Vex');
    expect(succ.name).not.toBe('Captain Vex'); // a different person
    expect(isCorruptibleFlaw(succ.personality.flaw)).toBe(false); // won't instantly relapse
  });

  it('is deterministic for a given seed', () => {
    const a = successorNpc(ousted(), createPRNG('seed').fork('x'));
    const b = successorNpc(ousted(), createPRNG('seed').fork('x'));
    expect(a.name).toBe(b.name);
    expect(a.id).toBe(b.id);
  });

  it('replaceOustedNpcs swaps named NPCs for successors, same-ref when none match', () => {
    const settlement = { npcs: [ousted(), { name: 'Bystander' }] };
    const next = replaceOustedNpcs(settlement, ['Captain Vex'], createPRNG('r').fork('r'));
    expect(next.npcs.find((n) => n.name === 'Captain Vex')).toBeUndefined();
    expect(next.npcs.find((n) => n.replacedNpc === 'Captain Vex')).toBeTruthy();
    expect(next.npcs.find((n) => n.name === 'Bystander')).toBeTruthy(); // untouched
    expect(replaceOustedNpcs(settlement, [], createPRNG('r').fork('r'))).toBe(settlement);
  });
});
