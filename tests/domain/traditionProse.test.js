/**
 * traditionProse.test.js — THE TRADITIONS wave (T-5). The news + plot-hook prose pools
 * obey the eventProse laws (canonical-at-zero, no calamity substrings), and the seeded
 * selectors are deterministic + canonical when seedless.
 */
import { describe, it, expect } from 'vitest';
import {
  TRAD_OUTCOME_PHRASE, TRAD_HELD_SUMMARY, TRAD_CANCELLED_SUMMARY, TRAD_HOOKS,
} from '../../src/data/traditionProse.js';
import { traditionBeatProse, traditionHook, traditionHookCondition } from '../../src/domain/traditions/prose.js';

const CALAMITY = /flood|fire|quake|storm/i;
const INTERP = { town: 'Ashford', name: 'The Harvest Feast', phrase: 'was well kept', ownerBit: '', owner: 'The Guild' };

/** Every string a pool can produce (resolving function variants). */
function poolStrings(pool) {
  return pool.map((v) => (typeof v === 'function' ? v(INTERP) : v));
}
function allPools() {
  return [
    ...Object.values(TRAD_OUTCOME_PHRASE),
    TRAD_HELD_SUMMARY, TRAD_CANCELLED_SUMMARY,
    ...Object.values(TRAD_HOOKS),
  ];
}

describe('traditionProse — bucket-neutrality (no calamity substrings)', () => {
  it('no pool string contains flood/fire/quake/storm', () => {
    const offenders = allPools().flatMap(poolStrings).filter((s) => CALAMITY.test(s));
    expect(offenders).toEqual([]);
  });
});

describe('traditionProse — canonical-at-zero', () => {
  it('every pool index 0 is a non-empty string (functions resolve to one)', () => {
    for (const pool of allPools()) {
      expect(Array.isArray(pool)).toBe(true);
      expect(pool.length).toBeGreaterThan(0);
      const zero = typeof pool[0] === 'function' ? pool[0](INTERP) : pool[0];
      expect(typeof zero).toBe('string');
      expect(zero.length).toBeGreaterThan(0);
    }
  });
  it('the outcome phrase index 0 preserves the pre-existing canonical strings', () => {
    expect(TRAD_OUTCOME_PHRASE.triumph[0]).toBe('was a triumph');
    expect(TRAD_OUTCOME_PHRASE.good[0]).toBe('was well kept');
    expect(TRAD_OUTCOME_PHRASE.modest[0]).toBe('was modestly kept');
    expect(TRAD_OUTCOME_PHRASE.troubled[0]).toBe('passed under a shadow');
    expect(TRAD_OUTCOME_PHRASE.failure[0]).toBe('failed');
    expect(TRAD_OUTCOME_PHRASE.cancelled[0]).toBe('was set aside');
  });
});

describe('traditionProse — traditionBeatProse selector', () => {
  it('seedless ⇒ canonical (byte-identical to the pre-existing beat)', () => {
    const held = traditionBeatProse({ outcome: 'triumph', name: 'The Feast', town: 'Ashford', ownerBit: '', seed: null });
    expect(held.phrase).toBe('was a triumph');
    expect(held.summary).toBe(
      "In Ashford, The Feast was a triumph this year. A settlement's traditions carry its identity forward; each holding — or failing — is a mark on the year.",
    );
    const cancelled = traditionBeatProse({ outcome: 'cancelled', name: 'The Feast', town: 'Ashford', ownerBit: '', seed: null });
    expect(cancelled.summary).toContain('was set aside this year — hardship left no room');
  });
  it('is deterministic for a given seed and varies across seeds', () => {
    const a = traditionBeatProse({ outcome: 'good', name: 'X', town: 'T', ownerBit: '', seed: 'tradition.good.a.5' });
    const b = traditionBeatProse({ outcome: 'good', name: 'X', town: 'T', ownerBit: '', seed: 'tradition.good.a.5' });
    expect(a).toEqual(b);
    // the ownerBit threads through unchanged (semantics never drift)
    const owned = traditionBeatProse({ outcome: 'good', name: 'X', town: 'T', ownerBit: ' Kept by the Guild.', seed: 'tradition.good.a.5' });
    expect(owned.summary.endsWith(' Kept by the Guild.')).toBe(true);
  });
});

describe('traditionProse — plot-hook conditions', () => {
  const rec = (over) => ({ id: 't.x', name: 'The Rite', lastOutcome: null, suppressedBy: null, adoptedFrom: null, mutationLog: [], ...over });

  it('precedence: suppressed > restored > adopted > failure > cancelled > triumph', () => {
    expect(traditionHookCondition(rec({ suppressedBy: { overlordId: 'b' }, lastOutcome: 'failure' })).condition).toBe('suppressed');
    expect(traditionHookCondition(rec({ mutationLog: [{ kind: 'restoration' }], lastOutcome: 'triumph' })).condition).toBe('restored');
    expect(traditionHookCondition(rec({ adoptedFrom: 'origin', lastOutcome: 'cancelled' })).condition).toBe('adopted');
    expect(traditionHookCondition(rec({ lastOutcome: 'failure' })).condition).toBe('failure');
    expect(traditionHookCondition(rec({ lastOutcome: 'cancelled' })).condition).toBe('cancelled');
    expect(traditionHookCondition(rec({ lastOutcome: 'triumph' })).condition).toBe('triumph');
  });
  it('a quiet rite (no outcome, no relation) raises no hook', () => {
    expect(traditionHookCondition(rec({ lastOutcome: 'good' }))).toBeNull();
    expect(traditionHook(rec({ lastOutcome: 'modest' }), { town: 'Ashford' })).toBeNull();
  });
  it('a matching rec yields deterministic, town-interpolated hook text', () => {
    const h = traditionHook(rec({ lastOutcome: 'failure', name: 'The Harvest Feast' }), { town: 'Ashford' });
    expect(h).not.toBeNull();
    expect(h.condition).toBe('failure');
    expect(h.priority).toBe(8);
    expect(h.source).toBe('The Harvest Feast');
    expect(h.text).toContain('The Harvest Feast');
    // deterministic
    expect(traditionHook(rec({ lastOutcome: 'failure', name: 'The Harvest Feast' }), { town: 'Ashford' }).text).toBe(h.text);
  });
});
