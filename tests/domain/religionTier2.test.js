/**
 * religionTier2.test.js — the Tier-2 completeness mechanics:
 *   (a) ORGANIC low-legitimacy contests — a discredited patron is contestable by an
 *       established cross-niche rival, with no DM imposition (resolvePatronContest).
 *   (b) RELIGIOUS-INSTITUTION backing — temples lend creed-agnostic legitimacy to the
 *       faith that holds the seat, entrenching the incumbent (deityLegitimacyTarget).
 *   (c) OCCUPATION heresy stain — a force-installed faith carries the stain (attemptEntry).
 */
import { describe, it, expect } from 'vitest';
import { resolvePatronContest, attemptEntry, RELIGION_TUNING } from '../../src/domain/worldPulse/religionState.js';
import { institutionBackingOf, deityLegitimacyTarget } from '../../src/domain/worldPulse/religionLegitimacy.js';

const entry = (ref, niche, share, standing, legitimacy) => ({ deityRef: ref, snapshot: { name: ref, _deityRef: ref }, niche, share, standing, legitimacy, suppressed: false });
const pickFirst = { weightedPick: (items) => items[0] };

describe('(a) organic low-legitimacy patron contest', () => {
  it('a DISCREDITED patron is contested by an established cross-niche rival (no schism needed)', () => {
    const state = {
      patronRef: 'p', patronSiegeRef: null, patronSiegeTicks: 0, capacity: 3,
      deities: {
        p: entry('p', 'peaceful:good', 45, 'ascendant', 0.1),   // patron, legit 0.1 < 0.3 floor
        r: entry('r', 'warlike:evil', 40, 'ascendant', 0.8),    // a more-rightful rival, DIFFERENT niche
      },
    };
    // No same-niche rival, but the patron is discredited and out-weighed ⇒ organic contest fires.
    expect(resolvePatronContest(state, pickFirst)).toBe(true);
  });
  it('a LEGITIMATE patron with no same-niche rival is NOT organically contested', () => {
    const state = {
      patronRef: 'p', patronSiegeRef: null, patronSiegeTicks: 0, capacity: 3,
      deities: {
        p: entry('p', 'peaceful:good', 60, 'ascendant', 0.7),   // legit 0.7 > floor ⇒ no organic challenge
        r: entry('r', 'warlike:evil', 40, 'ascendant', 0.8),
      },
    };
    expect(resolvePatronContest(state, pickFirst)).toBe(false);  // falls through to the deterministic flip
  });
  it('a discredited patron with only a CULT-standing rival is not organically contested', () => {
    const state = {
      patronRef: 'p', patronSiegeRef: null, patronSiegeTicks: 0, capacity: 3,
      deities: {
        p: entry('p', 'peaceful:good', 80, 'ascendant', 0.1),
        r: entry('r', 'warlike:evil', 8, 'cult', 0.5),          // a cult is too weak to mount a challenge
      },
    };
    expect(resolvePatronContest(state, pickFirst)).toBe(false);
  });
});

describe('(b) religious-institution backing', () => {
  const RELIGIOUS = [{ tags: ['religious', 'church'] }, { tags: ['religious', 'monastery'] }, { tags: ['religious'] }];
  it('counts religious institutions (by tag / priorityCategory), scaled, saturated 0..1', () => {
    expect(institutionBackingOf({ institutions: [] })).toBe(0);
    expect(institutionBackingOf({ institutions: [{ tags: ['civic'] }] })).toBe(0);   // non-religious ignored
    expect(institutionBackingOf({ institutions: RELIGIOUS })).toBeGreaterThan(0.5);
    expect(institutionBackingOf({ institutions: [{ priorityCategory: 'religion' }] })).toBeGreaterThan(0);
  });

  const base = {
    settlement: { powerStructure: {}, npcs: [] }, snapshot: {}, worldState: {}, cid: 'c',
    deity: { temperamentAxis: 'peaceful', alignmentAxis: 'good' }, deityRef: 'd', neighbourIds: [],
    lens: { temper: 0.5, align: 0.5, power: 0.5, corrupt: 0, compromise: 0 }, deitySnapshotFor: () => null,
  };
  it('backing RAISES the legitimacy target of an established faith', () => {
    const e = { standing: 'ascendant', tenure: 6, legitimacy: 0.5, heresyStain: 0 };
    const withBacking = deityLegitimacyTarget({ ...base, entry: e, institutionBacking: 1 });
    const without = deityLegitimacyTarget({ ...base, entry: e, institutionBacking: 0 });
    expect(withBacking).toBeGreaterThan(without);
  });
  it('a fresh CULT benefits far less than an ascendant faith (temples back the seat, not newcomers)', () => {
    const ascendant = { standing: 'ascendant', tenure: 6, legitimacy: 0.5, heresyStain: 0 };
    const cult = { standing: 'cult', tenure: 0, legitimacy: 0.1, heresyStain: 0 };
    const ascGain = deityLegitimacyTarget({ ...base, entry: ascendant, institutionBacking: 1 }) - deityLegitimacyTarget({ ...base, entry: ascendant, institutionBacking: 0 });
    const cultGain = deityLegitimacyTarget({ ...base, entry: cult, institutionBacking: 1 }) - deityLegitimacyTarget({ ...base, entry: cult, institutionBacking: 0 });
    expect(cultGain).toBeLessThan(ascGain);
  });
});

describe('(c) occupation / forced-install heresy stain', () => {
  it('a FORCE-installed faith carries the heresy stain; an un-forced entry does not', () => {
    const mk = () => ({ patronRef: 'a', capacity: 3, deities: { a: { ...entry('a', 'peaceful:good', 100, 'ascendant', 0.6), tenure: 5, heresyStain: 0 } } });
    const newcomer = { _deityRef: 'b', name: 'B', temperamentAxis: 'warlike', alignmentAxis: 'evil' };

    const forced = mk();
    expect(attemptEntry(forced, newcomer, 0.5, { force: true }).entered).toBe(true);
    expect(forced.deities.b.heresyStain).toBe(RELIGION_TUNING.LEGIT_STAIN_IMPOSED);   // installed by the garrison

    const organic = mk();
    expect(attemptEntry(organic, newcomer, 0.9, {}).entered).toBe(true);              // open slot, earned entry
    expect(organic.deities.b.heresyStain).toBe(0);
  });
});
