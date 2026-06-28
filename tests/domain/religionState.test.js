/**
 * religionState.test.js — the per-settlement pantheon core (religion rework).
 * Covers: legacy migration, share renorm to 100, the three entry paths
 * (open-slot cult / same-niche push-out / capacity-full cross-niche eviction),
 * forced (occupation) override, gradual share movement + patron buffer, and the
 * patron incumbency hysteresis (brief challenger held off, sustained lead flips).
 */
import { describe, it, expect } from 'vitest';
import {
  nicheOf, capacityForTier, ensureReligionState, renormShares,
  attemptEntry, advanceShares, selectPatron, patronSnapshot, RELIGION_TUNING,
} from '../../src/domain/worldPulse/religionState.js';

const d = (name, temper = 'neutral', align = 'neutral', rank = 'minor') =>
  ({ _deityRef: `custom:lu_${name.toLowerCase()}`, name, temperamentAxis: temper, alignmentAxis: align, rankAxis: rank });
const ref = (x) => `custom:lu_${x.toLowerCase()}`;

describe('religionState — niche + capacity', () => {
  it('niche = temperament:alignment; capacity scales with tier', () => {
    expect(nicheOf(d('Korl', 'warlike', 'evil'))).toBe('warlike:evil');
    expect(capacityForTier('thorp')).toBe(1);
    expect(capacityForTier('metropolis')).toBeGreaterThan(capacityForTier('village'));
  });
});

describe('religionState — migration + renorm', () => {
  it('seeds the legacy single patron as patron at 100%', () => {
    const settlement = { config: { primaryDeitySnapshot: d('Aurum', 'peaceful', 'good', 'major') } };
    const s = ensureReligionState(null, settlement, 'town');
    expect(s.patronRef).toBe(ref('Aurum'));
    expect(s.deities[ref('Aurum')].share).toBe(100);
    expect(patronSnapshot(s).name).toBe('Aurum');
  });

  it('renormShares makes active shares sum to exactly 100', () => {
    const deities = {
      a: { share: 33.3, suppressed: false }, b: { share: 33.3, suppressed: false },
      c: { share: 33.3, suppressed: false }, z: { share: 0, suppressed: true },
    };
    renormShares(deities);
    const sum = ['a', 'b', 'c'].reduce((t, k) => t + deities[k].share, 0);
    expect(sum).toBe(100);
    expect(Number.isInteger(deities.a.share)).toBe(true);
  });
});

describe('religionState — entry paths', () => {
  function townWith(...entries) {
    const deities = {};
    for (const [dd, share] of entries) deities[String(dd._deityRef)] = { deityRef: String(dd._deityRef), snapshot: dd, niche: nicheOf(dd), share, standing: 'established', standingHeld: 0, suppressed: false };
    return { deities, patronRef: entries[0] ? String(entries[0][0]._deityRef) : null, patronHeld: 0, patronChallengeTicks: 0, capacity: 3 };
  }

  it('open niche + free slot → enters as a cult', () => {
    const s = townWith([d('Aurum', 'peaceful', 'good'), 100]);
    const r = attemptEntry(s, d('Korl', 'warlike', 'evil'), 0.5);
    expect(r.entered).toBe(true);
    expect(r.path).toBe('open_slot');
    expect(s.deities[ref('Korl')].standing).toBe('cult');
  });

  it('same-niche incumbent → strong newcomer pushes it out (incumbent suppressed)', () => {
    const s = townWith([d('Vael', 'warlike', 'evil'), 60]);                 // weak-ish incumbent
    const r = attemptEntry(s, d('Korl', 'warlike', 'evil'), 0.8);           // claim 80 > 60×1.1
    expect(r.entered).toBe(true);
    expect(r.path).toBe('same_niche_pushout');
    expect(s.deities[ref('Vael')].suppressed).toBe(true);
  });

  it('same-niche weak newcomer is held off', () => {
    const s = townWith([d('Vael', 'warlike', 'evil'), 80]);
    const r = attemptEntry(s, d('Korl', 'warlike', 'evil'), 0.3);           // claim 30 < 80×1.1
    expect(r.entered).toBe(false);
    expect(r.path).toBe('niche_held');
  });

  it('capacity full + open niche → strong newcomer evicts the weakest (harder bar)', () => {
    const s = townWith([d('Aurum', 'peaceful', 'good'), 60], [d('Vael', 'warlike', 'neutral'), 30], [d('Mara', 'neutral', 'good'), 10]);
    expect(Object.keys(s.deities).length).toBe(3);                          // at capacity
    const r = attemptEntry(s, d('Korl', 'warlike', 'evil'), 0.6);          // niche open; claim 60 > weakest 10×1.5
    expect(r.entered).toBe(true);
    expect(r.path).toBe('cross_niche_eviction');
    expect(r.evicted).toBe(ref('Mara'));
    expect(s.deities[ref('Mara')].suppressed).toBe(true);
  });

  it('capacity full + open niche + weak newcomer → blocked', () => {
    const s = townWith([d('Aurum', 'peaceful', 'good'), 50], [d('Vael', 'warlike', 'neutral'), 30], [d('Mara', 'neutral', 'good'), 20]);
    const r = attemptEntry(s, d('Korl', 'warlike', 'evil'), 0.2);          // claim 20 < weakest 20×1.5
    expect(r.entered).toBe(false);
    expect(r.path).toBe('capacity_full');
  });

  it('forced (occupation) entry overrides the capacity cap', () => {
    const s = townWith([d('Aurum', 'peaceful', 'good'), 50], [d('Vael', 'warlike', 'neutral'), 30], [d('Mara', 'neutral', 'good'), 20]);
    const r = attemptEntry(s, d('Korl', 'warlike', 'evil'), 0.1, { force: true });
    expect(r.entered).toBe(true);
    expect(r.path).toBe('forced_overflow');
  });
});

describe('religionState — gradual growth + patron buffer', () => {
  function two(aShare, bShare) {
    const A = d('Aurum', 'peaceful', 'good'), B = d('Korl', 'warlike', 'evil');
    return {
      deities: {
        [A._deityRef]: { deityRef: A._deityRef, snapshot: A, niche: nicheOf(A), share: aShare, standing: 'ascendant', standingHeld: 0, suppressed: false },
        [B._deityRef]: { deityRef: B._deityRef, snapshot: B, niche: nicheOf(B), share: bShare, standing: 'established', standingHeld: 0, suppressed: false },
      },
      patronRef: A._deityRef, patronHeld: 0, patronChallengeTicks: 0, contestedTicks: 0, capacity: 5,
    };
  }

  it('shares move gradually toward strengths and stay summed to 100', () => {
    const s = two(60, 40);
    advanceShares(s, { [ref('Aurum')]: 0.2, [ref('Korl')]: 0.8 });         // B much stronger now
    const sum = s.deities[ref('Aurum')].share + s.deities[ref('Korl')].share;
    expect(sum).toBe(100);
    expect(s.deities[ref('Korl')].share).toBeGreaterThan(40);              // B rose
    expect(s.deities[ref('Aurum')].share).toBeLessThan(60);                // A fell
    expect(60 - s.deities[ref('Aurum')].share).toBeLessThanOrEqual(RELIGION_TUNING.SHARE_STEP_MAX); // gradual
  });

  it('the patron resists losing adherents (buffer) vs a non-patron in the same spot', () => {
    const asPatron = two(60, 40);
    const notPatron = two(60, 40); notPatron.patronRef = ref('Korl');         // A is NOT patron here
    // compound several ticks so the per-tick buffer survives integer-share rounding.
    for (let t = 0; t < 5; t++) {
      advanceShares(asPatron, { [ref('Aurum')]: 0.2, [ref('Korl')]: 0.8 });
      advanceShares(notPatron, { [ref('Aurum')]: 0.2, [ref('Korl')]: 0.8 });
    }
    expect(asPatron.deities[ref('Aurum')].share).toBeGreaterThan(notPatron.deities[ref('Aurum')].share);
  });
});

describe('religionState — patron incumbency hysteresis', () => {
  it('a brief challenger does NOT flip the patron; a sustained decisive lead does', () => {
    const A = d('Aurum', 'peaceful', 'good'), B = d('Korl', 'warlike', 'evil');
    const s = {
      deities: {
        [A._deityRef]: { deityRef: A._deityRef, snapshot: A, niche: nicheOf(A), share: 40, standing: 'ascendant', suppressed: false },
        [B._deityRef]: { deityRef: B._deityRef, snapshot: B, niche: nicheOf(B), share: 60, standing: 'ascendant', suppressed: false },
      },
      patronRef: A._deityRef, patronChallengeTicks: 0, capacity: 5,
    };
    // B leads by 20 (≥ margin). First two selections: A holds (buffer).
    expect(selectPatron(s)).toBe(ref('Aurum'));
    expect(selectPatron(s)).toBe(ref('Aurum'));
    // third consecutive tick of decisive lead → flip.
    expect(selectPatron(s)).toBe(ref('Korl'));
  });

  it('challenge resets if the lead lapses below the flip margin', () => {
    const A = d('Aurum', 'peaceful', 'good'), B = d('Korl', 'warlike', 'evil');
    const s = {
      deities: {
        [A._deityRef]: { deityRef: A._deityRef, snapshot: A, niche: nicheOf(A), share: 48, standing: 'ascendant', suppressed: false },
        [B._deityRef]: { deityRef: B._deityRef, snapshot: B, niche: nicheOf(B), share: 52, standing: 'ascendant', suppressed: false },
      },
      patronRef: A._deityRef, patronChallengeTicks: 2, capacity: 5,           // B leads by only 4 (< margin 6)
    };
    expect(selectPatron(s)).toBe(ref('Aurum'));
    expect(s.patronChallengeTicks).toBe(0);                                   // reset
  });
});

describe('religionState — patron selection stays share-driven (organic turnover)', () => {
  it('the top-share active creed takes the seat (legitimacy governs the schism, not this flip)', () => {
    // Even a low-legitimacy faith holds on adherents alone — legitimacy weighting here
    // froze faith change; it lives in resolvePatronContest instead.
    const A = d('A', 'warlike', 'evil'); const B = d('B', 'peaceful', 'good');
    const deities = {
      [ref('A')]: { deityRef: ref('A'), snapshot: A, niche: nicheOf(A), share: 70, standing: 'ascendant', legitimacy: 0.1, suppressed: false },
      [ref('B')]: { deityRef: ref('B'), snapshot: B, niche: nicheOf(B), share: 30, standing: 'cult', legitimacy: 0.95, suppressed: false },
    };
    expect(selectPatron({ deities, patronRef: null, capacity: 3 })).toBe(ref('A'));   // 70% share wins despite lower legit
  });
});
