/**
 * moralInstitutionFounding.test.js — W-C3 item 1: the MORAL FOUNDING lane.
 *
 * The mirror of the W-F8 abolition lane: new benevolent/exploitative institutions
 * RAISED by who holds the patron seat, weighted by the moral plane. Pins the founding
 * geometry (good planes found mercy, cruel planes found cruelty), the years-scale arc,
 * the dormancy/neutrality theorem (no patron / neutral / zero bleed ⇒ nothing), the
 * cause-chained receipt, and the 'found' apply path (moral lean stamped, remnant re-raise).
 */

import { describe, it, expect } from 'vitest';
import {
  foundingViabilityFit, stepFoundingViability, evaluateMoralInstitutionFounding,
  MORAL_PRESSURE_TUNING,
} from '../../src/domain/worldPulse/moralInstitutionPressure.js';
import { FOUNDING_INSTITUTIONS, foundingEntryByName } from '../../src/domain/worldPulse/foundingCatalog.js';
import { applyInstitutionLifecycleOutcome } from '../../src/domain/worldPulse/institutionLifecycle.js';

const GOOD_LAWFUL = { name: 'The Lawgiver', alignmentAxis: 'good', lawAxis: 'lawful' };
const EVIL_CHAOTIC = { name: 'The Red Maw', alignmentAxis: 'evil', lawAxis: 'chaotic' };
const NEUTRAL = { name: 'The Still', alignmentAxis: 'neutral', lawAxis: 'neutral' };

// A devout town record: moral/law bleed 0.6 drive the megaphone (the abolition-test shape).
const DEVOUT = { localMult: 1.6, realmMult: 1, composite: 1.6, moralMult: 1.6, dampener: { megaphoneLaw: 1 } };

const settlementWith = (patron, piety = DEVOUT, institutions = []) => ({
  institutions,
  config: { primaryDeitySnapshot: patron, faithProfile: { piety } },
});
const snapshotWith = (settlement, id = 's1') => ({ settlements: [{ id, name: id, settlement }] });

const almshouse = () => ({ ...foundingEntryByName('Almshouse') });
const fightingPit = () => ({ ...foundingEntryByName('Fighting pit') });
// clamp01 can yield −0 for a rejected (sign-opposed) fit; −0 is handled as no-accrual by
// the integrator (−0 > 0 is false) and never serializes. Math.abs normalizes it for the
// "no founding" assertions (Object.is distinguishes −0 from +0, but the geometry does not).
const noFit = (x) => Math.abs(x);

// ── 1. founding fit geometry ───────────────────────────────────────────────────
describe('founding fit geometry (the emergence weighting)', () => {
  it('a good plane embraces the benevolent set, rejects the exploitative set', () => {
    const bleed = 0.6;
    expect(foundingViabilityFit(almshouse().lean, GOOD_LAWFUL, bleed, bleed)).toBeGreaterThan(0); // found mercy
    expect(noFit(foundingViabilityFit(fightingPit().lean, GOOD_LAWFUL, bleed, bleed))).toBe(0);          // never cruelty
  });

  it('a cruel plane embraces the exploitative set, rejects the benevolent set', () => {
    const bleed = 0.6;
    expect(foundingViabilityFit(fightingPit().lean, EVIL_CHAOTIC, bleed, bleed)).toBeGreaterThan(0);
    expect(noFit(foundingViabilityFit(almshouse().lean, EVIL_CHAOTIC, bleed, bleed))).toBe(0);
  });

  it('neutrality theorem: neutral patron / zero bleed / no lean ⇒ fit 0', () => {
    expect(noFit(foundingViabilityFit(almshouse().lean, NEUTRAL, 0.6, 0.6))).toBe(0);
    expect(noFit(foundingViabilityFit(almshouse().lean, GOOD_LAWFUL, 0, 0))).toBe(0);
    expect(noFit(foundingViabilityFit(null, GOOD_LAWFUL, 0.6, 0.6))).toBe(0);
    expect(noFit(foundingViabilityFit(almshouse().lean, null, 0.6, 0.6))).toBe(0);
  });

  it('the integrator is a slow YEARS-scale arc: one tick never crosses the floor', () => {
    const one = stepFoundingViability(0, 1);                 // maximal fit
    expect(one).toBeLessThanOrEqual(MORAL_PRESSURE_TUNING.FOUNDING_STEP + 1e-9);
    expect(one).toBeLessThan(MORAL_PRESSURE_TUNING.FOUNDING_FLOOR);
    // strictly slower than abolition (raising is slower than tearing down).
    expect(MORAL_PRESSURE_TUNING.FOUNDING_STEP).toBeLessThan(MORAL_PRESSURE_TUNING.MAX_STEP);
    // a reversal (a new opposed patron) relaxes it.
    expect(stepFoundingViability(0.3, 0)).toBeLessThan(0.3);
  });
});

// ── 2. dormancy / neutrality (byte-identical) ──────────────────────────────────
describe('founding dormancy theorem', () => {
  it('no patron ⇒ NO candidates and NO state written (byte-identical without faith)', () => {
    const ws = { tick: 1, simulationRules: {}, settlementTickStates: {} };
    const out = evaluateMoralInstitutionFounding(ws, snapshotWith({ institutions: [], config: {} }), { tick: 1 });
    expect(out.candidates).toEqual([]);
    expect(out.worldState.settlementTickStates).toEqual({});   // nothing materialized
  });

  it('a neutral patron accrues nothing (fit 0 ⇒ no moralFounding sub-key)', () => {
    let ws = { tick: 0, simulationRules: {}, settlementTickStates: {} };
    for (let t = 0; t < 10; t++) {
      const out = evaluateMoralInstitutionFounding({ ...ws, tick: t }, snapshotWith(settlementWith(NEUTRAL)), { tick: t });
      ws = out.worldState;
    }
    expect(ws.settlementTickStates.s1?.moralFounding).toBeFalsy();
  });

  it('institutionLifecycle disabled ⇒ inert', () => {
    const out = evaluateMoralInstitutionFounding(
      { tick: 1, simulationRules: { institutionLifecycleEnabled: false }, settlementTickStates: {} },
      snapshotWith(settlementWith(GOOD_LAWFUL)), { tick: 1 },
    );
    expect(out.candidates).toEqual([]);
  });
});

// ── 3. the founding arc fires (years-scale, cause-chained) ─────────────────────
describe('the founding lane raises institutions by plane', () => {
  function driveUntilFounding(patron, maxTicks = 400) {
    const settlement = settlementWith(patron);
    let ws = { tick: 0, simulationRules: {}, settlementTickStates: {} };
    for (let t = 0; t < maxTicks; t++) {
      const out = evaluateMoralInstitutionFounding({ ...ws, tick: t }, snapshotWith(settlement), { tick: t });
      ws = out.worldState;
      if (out.candidates.length) return { fired: out.candidates[0], tick: t, ws };
    }
    return { fired: null, tick: maxTicks, ws };
  }

  it('a devout GOOD-LAWFUL town founds a BENEVOLENT institution, years-scale + cause-chained', () => {
    const { fired, tick } = driveUntilFounding(GOOD_LAWFUL);
    expect(fired).toBeTruthy();
    expect(fired.institutionPatch.action).toBe('found');
    expect(fired.candidateType).toBe('institution_founding');
    expect(fired.institutionPatch.set).toBe('benevolent');
    expect(fired.ruleId).toBe('institution_moral_founding_benevolent');
    // the founded set is a benevolent one, never exploitative.
    expect(FOUNDING_INSTITUTIONS.find((e) => e.name === fired.institutionPatch.name)?.set).toBe('benevolent');
    // the receipt names the patron and the cause (legibility law).
    expect(fired.reasons.join(' ')).toMatch(/Lawgiver/);
    expect(fired.summary).toMatch(/mercy demands it/);
    // the stamped lean rides the patch so the ecology can recognize it later.
    expect(fired.institutionPatch.moralLean.cruelty).toBeLessThan(0);
    // YEARS-scale: it took well over a year (52 weekly ticks) to break ground.
    expect(tick).toBeGreaterThan(52);
  });

  it('a devout EVIL-CHAOTIC town founds an EXPLOITATIVE institution', () => {
    const { fired } = driveUntilFounding(EVIL_CHAOTIC);
    expect(fired).toBeTruthy();
    expect(fired.institutionPatch.set).toBe('exploitative');
    expect(fired.institutionPatch.moralLean.cruelty).toBeGreaterThan(0);
    expect(fired.summary).toMatch(/cruelty/);
  });

  it('no candidate fires inside a short (golden-sized) window — the byte-identity guarantee', () => {
    const settlement = settlementWith(GOOD_LAWFUL);
    let ws = { tick: 0, simulationRules: {}, settlementTickStates: {} };
    let anyCandidate = false;
    for (let t = 0; t < 10; t++) {
      const out = evaluateMoralInstitutionFounding({ ...ws, tick: t }, snapshotWith(settlement), { tick: t });
      ws = out.worldState;
      if (out.candidates.length) anyCandidate = true;
    }
    expect(anyCandidate).toBe(false);   // years-scale ⇒ nothing in ~10 ticks (matches the 8-tick golden)
  });

  it('a settlement never founds what it already has standing (no duplicate)', () => {
    // give the town a STANDING almshouse; it must not accrue/found another.
    const withAlms = settlementWith(GOOD_LAWFUL, DEVOUT, [{ name: 'Almshouse', status: 'active' }]);
    let ws = { tick: 0, simulationRules: {}, settlementTickStates: {} };
    for (let t = 0; t < 200; t++) {
      const out = evaluateMoralInstitutionFounding({ ...ws, tick: t }, snapshotWith(withAlms), { tick: t });
      ws = out.worldState;
      for (const c of out.candidates) expect(c.institutionPatch.name).not.toBe('Almshouse');
    }
    expect(ws.settlementTickStates.s1?.moralFounding?.acc?.almshouse).toBeUndefined();
  });
});

// ── 4. the 'found' apply path ──────────────────────────────────────────────────
describe("the 'found' apply path", () => {
  const entry = foundingEntryByName('Hospice');
  const patch = {
    saveId: 's1', action: 'found', name: entry.name, category: entry.category,
    description: entry.desc, tags: [...entry.tags],
    moralLean: { ...entry.lean }, set: entry.set, reason: 'Founded under The Lawgiver: the plane\'s mercy demands it.',
  };
  const outcome = { id: 'o1', targetSaveId: 's1', institutionPatch: patch };

  it('raises a new institution with the moral lean stamped and a founded fate', () => {
    const after = applyInstitutionLifecycleOutcome({ institutions: [], tier: 'town' }, outcome);
    const inst = after.institutions.find((i) => i.name === 'Hospice');
    expect(inst).toBeTruthy();
    expect(inst.status).toBe('active');
    expect(inst._worldPulseFounded).toBe(true);
    expect(inst.moralLean).toEqual(entry.lean);
    expect(after.institutionHistory.at(-1).fate).toBe('founded');
  });

  it('is idempotent when the institution already stands (same-reference-ish no-op)', () => {
    const before = { institutions: [{ name: 'Hospice', status: 'active' }] };
    const after = applyInstitutionLifecycleOutcome(before, outcome);
    expect(after).toBe(before);   // no change ⇒ returned as-is
  });

  it('re-raises a shuttered remnant of the same name (rebuild, not duplicate)', () => {
    const before = { institutions: [{ name: 'Hospice', status: 'remnant', _worldPulseInactive: true }] };
    const after = applyInstitutionLifecycleOutcome(before, outcome);
    expect(after.institutions.length).toBe(1);              // re-raised, not duplicated
    expect(after.institutions[0].status).toBe('active');
    expect(after.institutions[0]._worldPulseFounded).toBe(true);
    expect(after.institutions[0].moralLean).toEqual(entry.lean);
  });
});
