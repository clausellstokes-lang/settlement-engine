/**
 * doctrineCourses.test.js — D3 (DESIGN_SIM_DEPTH_R2 D3) pins: momentum binds religion; the
 * last free reconsideration ends.
 *
 * Design pins: (1) dormancy — a doctrine deposit is byte-identical when the momentum ∧ beliefs
 * ∧ faith intersection is not lit; (2) an imposition deposits a doctrine course; (3) the reversal
 * is priced exactly once (the generic crack + the synod=mediation off-ramp); (4) succession
 * re-rolls the doctrine cliff (emergent — the cliff is a course-agnostic entityThreshold read).
 */
import { describe, it, expect } from 'vitest';

import {
  COURSE_KINDS, courseKeyOf, parseCourseKey, commitmentDepositsFor,
  climbDownConsequence, faceSavingReliefOf, cliffStockFor, MOMENTUM_TUNING,
} from '../../src/domain/worldPulse/momentum.js';

// ── The bounded taxonomy ─────────────────────────────────────────────────────
describe('D3 — the doctrine course kind', () => {
  it('doctrine joins the closed taxonomy and round-trips through the generic key shape', () => {
    expect(COURSE_KINDS).toContain('doctrine');
    expect(courseKeyOf({ kind: 'doctrine', target: 'sol' })).toBe('doctrine:sol');
    expect(courseKeyOf({ kind: 'doctrine' })).toBeNull(); // no target ⇒ no course (closed taxonomy)
    expect(parseCourseKey('doctrine:sol')).toEqual({ kind: 'doctrine', target: 'sol', side: null });
  });
});

// ── The deposit source (imposed cults) ───────────────────────────────────────
const litRules = { infoMode: 'perfect_delayed', momentumEnabled: true, faithSpreadEnabled: true };
function worldWith({ rules = litRules, deities } = {}) {
  return {
    spatialCanonVersion: 1,
    simulationRules: rules,
    religionStates: { townA: { patronRef: 'sol', deities } },
  };
}
const imposed = { deityRef: 'sol', heresyStain: 0.45, suppressed: false, snapshot: { name: 'Sol' } };

describe('D3 — the imposition deposit', () => {
  it('PIN 2: an imposed cult (heresyStain) deposits a doctrine course at the seat', () => {
    const deposits = commitmentDepositsFor(worldWith({ deities: { sol: imposed } }));
    const doctrine = deposits.find((d) => d.courseKey === 'doctrine:sol');
    expect(doctrine).toBeTruthy();
    expect(doctrine.actorId).toBe('townA');
    expect(doctrine.kind).toBe('imposition');
    expect(doctrine.magnitude01).toBeCloseTo(MOMENTUM_TUNING.LOUD_IMPOSITION, 6);
  });

  it('PIN 1 (dormancy, faith-DARK): momentum lit but faith off ⇒ NO doctrine deposit', () => {
    const darkFaith = commitmentDepositsFor(worldWith({
      rules: { infoMode: 'perfect_delayed', momentumEnabled: true }, // faithSpread absent ⇒ dark
      deities: { sol: imposed },
    }));
    expect(darkFaith.some((d) => String(d.courseKey).startsWith('doctrine:'))).toBe(false);
  });

  it('PIN 1 (dormancy, momentum-DARK): faith lit but momentum off ⇒ NO deposits at all', () => {
    const darkMomentum = commitmentDepositsFor(worldWith({
      rules: { infoMode: 'perfect_delayed', faithSpreadEnabled: true }, // momentumEnabled absent ⇒ momentumActive false
      deities: { sol: imposed },
    }));
    expect(darkMomentum).toEqual([]);
  });

  it('a NON-imposed (heresyStain 0) or SUPPRESSED cult never deposits (only an imposed faith is a commitment)', () => {
    const organic = commitmentDepositsFor(worldWith({ deities: { sol: { ...imposed, heresyStain: 0 } } }));
    expect(organic.some((d) => String(d.courseKey).startsWith('doctrine:'))).toBe(false);
    const dead = commitmentDepositsFor(worldWith({ deities: { sol: { ...imposed, suppressed: true } } }));
    expect(dead.some((d) => String(d.courseKey).startsWith('doctrine:'))).toBe(false);
  });

  it('references only ACTIVATED deityRefs (law 3): the course target is the religionStates cult key', () => {
    const deposits = commitmentDepositsFor(worldWith({ deities: { sol: imposed, vorn: { ...imposed, deityRef: 'vorn' } } }));
    const targets = deposits.filter((d) => String(d.courseKey).startsWith('doctrine:')).map((d) => parseCourseKey(d.courseKey).target).sort();
    expect(targets).toEqual(['sol', 'vorn']); // both imposed, activated cults; latent pantheon never appears
  });
});

// ── The crack (priced once) + succession cliff ───────────────────────────────
describe('D3 — the doctrine reversal (pin 3) is priced exactly once via the generic crack', () => {
  it('a full reversal is priced; the synod (mediation off-ramp) reduces it exactly once, never to zero', () => {
    const full = climbDownConsequence({ actorId: 'townA', lawfulness01: 0.5, exitKind: '' });
    const synod = climbDownConsequence({ actorId: 'townA', lawfulness01: 0.5, exitKind: 'mediation' });
    // The synod is the doctrine crack's face-saving off-ramp (reused verbatim = mediation relief).
    expect(faceSavingReliefOf('mediation')).toBeGreaterThan(0);
    expect(synod.price01).toBeLessThan(full.price01); // priced once, reduced by the off-ramp
    expect(synod.price01).toBeGreaterThan(0);          // never censored to zero
    // The crack machinery is course-generic — the SAME climbDownConsequence a war reversal reaches.
    expect(full.credibilityDelta.kind).toBe('climb_down');
  });
});

describe('D3 — succession re-rolls the doctrine cliff (pin 4, emergent)', () => {
  it('the reconsideration cliff is a course-AGNOSTIC ruler read: a proud crown holds, a pragmatic heir cracks', () => {
    // cliffStockFor is what entityThreshold feeds every course — including doctrine. A new ruler's
    // temperament yields a new cliff each tick (no doctrine-specific code — the emergence is free).
    const proud = cliffStockFor({ temperament: 0.8 });
    const pragmatic = cliffStockFor({ temperament: -0.5 });
    expect(proud).toBeGreaterThan(pragmatic); // the proud crown's imposed faith holds longer
    // A fragile new seat doubles down hardest (higher cliff) — the read is live, so succession moves it.
    expect(cliffStockFor({ temperament: 0, legitimacyFragility01: 0.9 })).toBeGreaterThan(cliffStockFor({ temperament: 0, legitimacyFragility01: 0 }));
  });
});
