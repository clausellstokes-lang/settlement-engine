/**
 * patronContest.test.js — the seeded top-three patron contest fired by a rival in
 * the patron's own niche (a DM-imposed cult / schism). Covers: the contested trigger,
 * a strong-legitimacy patron holding and suppressing the upstart, a weak patron being
 * toppled by a legitimate/popular rival, determinism, and the uncontested no-op.
 */
import { describe, it, expect } from 'vitest';
import { resolvePatronContest, RELIGION_TUNING } from '../../src/domain/worldPulse/religionState.js';
import { createPRNG } from '../../src/generators/prng.js';

const ref = (x) => `custom:lu_${x.toLowerCase()}`;
const dEntry = (name, niche, share, legitimacy, standing = 'cult') => ({
  deityRef: ref(name), snapshot: { _deityRef: ref(name), name }, niche, share, standing,
  legitimacy, tenure: standing === 'ascendant' ? 20 : 0, heresyStain: 0, suppressed: false,
});

// Patron Korl + contestant Vorr SHARING the warlike:evil niche (the schism).
const contested = ({ patronLegit, cultLegit, cultShare = 20 }) => ({
  deities: {
    [ref('Korl')]: dEntry('Korl', 'warlike:evil', 100 - cultShare, patronLegit, 'ascendant'),
    [ref('Vorr')]: dEntry('Vorr', 'warlike:evil', cultShare, cultLegit, 'cult'),
  },
  patronRef: ref('Korl'), patronChallengeTicks: 0, contestedTicks: 0, capacity: 3,
});

// runs the contest for N ticks with a fixed seed, returns the final state
function siege(state, seed, ticks = 60) {
  for (let t = 0; t < ticks; t++) {
    const rng = createPRNG(`${seed}::${t}`);
    resolvePatronContest(state, rng);
  }
  return state;
}

describe('resolvePatronContest — the schism contest', () => {
  it('a rival in the patron niche makes the seat contested (handled, not the deterministic flip)', () => {
    const s = contested({ patronLegit: 0.6, cultLegit: 0.1 });
    expect(resolvePatronContest(s, createPRNG('seed::0'))).toBe(true);
  });

  it('an uncontested pantheon is a no-op (the caller runs selectPatron)', () => {
    const s = {
      deities: {
        [ref('Korl')]: dEntry('Korl', 'warlike:evil', 80, 0.6, 'ascendant'),
        [ref('Sael')]: dEntry('Sael', 'peaceful:good', 20, 0.2, 'cult'),  // DIFFERENT niche
      },
      patronRef: ref('Korl'), patronChallengeTicks: 0, capacity: 3,
    };
    expect(resolvePatronContest(s, createPRNG('seed::0'))).toBe(false);
  });

  it('a strong, legitimate patron holds and eventually SUPPRESSES the upstart cult', () => {
    const s = siege(contested({ patronLegit: 0.92, cultLegit: 0.05, cultShare: 15 }), 'hold');
    expect(s.patronRef).toBe(ref('Korl'));                        // patron held
    expect(s.deities[ref('Vorr')].suppressed).toBe(true);         // heresy crushed
  });

  it('a WEAK patron is toppled by a legitimate, popular rival', () => {
    const s = siege(contested({ patronLegit: 0.08, cultLegit: 0.85, cultShare: 45 }), 'topple');
    expect(s.patronRef).toBe(ref('Vorr'));                        // the rival seized the seat
    expect(s.deities[ref('Korl')].suppressed).toBe(true);         // the old patron displaced
  });

  it('is deterministic — same seed gives the same resolution', () => {
    const a = siege(contested({ patronLegit: 0.08, cultLegit: 0.85, cultShare: 45 }), 'rep');
    const b = siege(contested({ patronLegit: 0.08, cultLegit: 0.85, cultShare: 45 }), 'rep');
    expect(a.patronRef).toBe(b.patronRef);
    expect(a.deities[ref('Korl')].suppressed).toBe(b.deities[ref('Korl')].suppressed);
  });

  it('requires a SUSTAINED winner — one lucky roll does not flip the seat', () => {
    const s = contested({ patronLegit: 0.08, cultLegit: 0.85, cultShare: 45 });
    resolvePatronContest(s, createPRNG('once::0'));               // a single tick
    // After one tick the siege has at most 1 win; PATRON_FLIP_TICKS (>1) is required.
    expect(RELIGION_TUNING.PATRON_FLIP_TICKS).toBeGreaterThan(1);
    expect(s.patronSiegeTicks).toBeLessThanOrEqual(1);
  });
});
