/**
 * defenseInstitutionBucketsWork.test.js — GEN-SPEED cure 1 (2026-11-10): the defence partition
 * reads each institution's name ONCE per call, not once per keyword per bucket.
 *
 * `partitionDefenseInstitutions` is reached for every candidate line of every hook draw (through
 * `factsOf(record).guardPresence` → `defenceOf` → `standingDefenseForces`). Before the cure its
 * `matches` called `nativeSemanticName(inst).toLowerCase()` once PER KEYWORD per bucket, so the
 * work per institution grew with the keyword vocabulary (up to 34 reads); on the wizard's own
 * heaviest request it was a third of the CPU. This pin counts WORK, never time: the name read per
 * institution is bounded by a constant, whatever the vocabulary's size. The partition's answer is
 * pinned beside it, so the cure cannot buy the count with a different bucket.
 */
import { describe, expect, it } from 'vitest';
import {
  DEFENSE_BUCKET_KEYS, DEFENSE_BUCKET_KEYWORDS, partitionDefenseInstitutions,
} from '../../src/domain/institutions/defenseInstitutionBuckets.js';

/** An institution whose `name` read is counted. @param {string} name */
function counted(name) {
  const inst = { reads: 0 };
  Object.defineProperty(inst, 'name', { enumerable: true, get() { inst.reads += 1; return name; } });
  return inst;
}

describe('partitionDefenseInstitutions — one name reading per institution per call', () => {
  it('reads each name at most once, not once per keyword (a name in NO bucket is the worst case)', () => {
    const vocabulary = DEFENSE_BUCKET_KEYS.reduce((n, b) => n + DEFENSE_BUCKET_KEYWORDS[b].length, 0);
    expect(vocabulary, 'the vocabulary is large enough for the bound to mean something').toBeGreaterThan(10);
    const roster = ['Bakery', 'Massive Walls', 'Professional City Watch', 'Wizard Tower', 'Granary'].map(counted);
    partitionDefenseInstitutions(roster);
    for (const inst of roster) expect(inst.reads).toBeLessThanOrEqual(1);
  });

  it('answers what it answered: every bucket, in the vocabulary order, members by identity and roster order', () => {
    const roster = [
      { name: 'Professional City Watch' }, { name: 'Massive Walls' }, { name: 'Bakery' },
      { name: 'Alchemist' }, 'Citizen Militia', { name: 'Inner Citadel', isCustom: true }, null, { name: 'Garrison Barracks' },
    ];
    const buckets = partitionDefenseInstitutions(roster);
    expect(Object.keys(buckets)).toEqual([...DEFENSE_BUCKET_KEYS]);
    expect(buckets.walls).toEqual([roster[1]]);
    // UPKEEP-CAPACITY C2 (the chair's G1): the professional city watch is the watch only, no longer a garrison member.
    expect(buckets.garrison).toEqual([roster[7]]);
    expect(buckets.watch).toEqual([roster[0]]);
    expect(buckets.militia).toEqual([roster[4]]);
    expect(buckets.magicDef).toEqual([roster[3]]);
    expect(buckets.mercenary).toEqual([]);
    expect(buckets.charter).toEqual([]);
    expect(buckets.garrison[0]).toBe(roster[7]);
    expect(buckets.watch[0]).toBe(roster[0]);
    expect(partitionDefenseInstitutions(null)).toEqual(Object.fromEntries(DEFENSE_BUCKET_KEYS.map((k) => [k, []])));
  });
});
