/**
 * institutionEcology.test.js — W-C3 item 2: institutional ecology + propagation.
 *
 * (2a) TRADE NORMALIZES tolerance — slow, capped, mass-weighted asymmetry, byte-identical
 *      when absent. (2c) EMBARGO AS CONSCIENCE — a buyer's tolerance abhors a supplier's
 *      institutions. (2b) FAITH PRESCRIBES — a foreign patron presses a convert's
 *      institutions over the faith carriers. Neutrality/dormancy pinned throughout.
 */

import { describe, it, expect } from 'vitest';
import {
  patronConviction, toleranceOffsetOf, effectiveToleranceOf, effectiveMoralLean,
  institutionConscience, advanceInstitutionTolerance, TOLERANCE_TUNING,
} from '../../src/domain/worldPulse/institutionTolerance.js';
import { buildFaithReach } from '../../src/domain/worldPulse/religiousContest.js';
import { evaluateMoralInstitutionPressure } from '../../src/domain/worldPulse/moralInstitutionPressure.js';

const GOOD_LAWFUL = { name: 'The Lawgiver', alignmentAxis: 'good', lawAxis: 'lawful' };
const EVIL_LAWFUL = { name: 'The Ledger', alignmentAxis: 'evil', lawAxis: 'lawful' };
const EVIL_CHAOTIC = { name: 'The Maw', alignmentAxis: 'evil', lawAxis: 'chaotic' };
const NEUTRAL = { name: 'The Still', alignmentAxis: 'neutral', lawAxis: 'neutral' };
const slaveMarket = { name: 'Slave market', status: 'active' };

const settle = (id, patron, tier = 'town') => ({ id, name: id, settlement: { tier, config: patron ? { primaryDeitySnapshot: patron } : {} } });
const tradeEdge = (a, b) => ({ id: `e.${a}.${b}`, from: a, to: b, relationshipType: 'trade_partner' });

function driveTolerance(settlements, edges, ticks) {
  let ws = {};
  for (let t = 0; t < ticks; t++) {
    const r = advanceInstitutionTolerance({ snapshot: { settlements, regionalGraph: { edges } }, worldState: ws });
    ws = r.institutionToleranceByCid ? { institutionTolerance: r.institutionToleranceByCid } : {};
  }
  return ws.institutionTolerance || {};
}

// ── 2a. trade normalizes tolerance ─────────────────────────────────────────────
describe('trade normalizes tolerance', () => {
  it('baseline tolerance is the patron conviction; absent ledger ⇒ effective === baseline', () => {
    expect(patronConviction(GOOD_LAWFUL)).toEqual({ cruelty: -1, disorder: -1 });
    expect(patronConviction(EVIL_CHAOTIC)).toEqual({ cruelty: 1, disorder: 1 });
    expect(patronConviction(NEUTRAL)).toEqual({ cruelty: 0, disorder: 0 });
    expect(patronConviction(null)).toEqual({ cruelty: 0, disorder: 0 });
    expect(toleranceOffsetOf(null, 'x')).toEqual({ cruelty: 0, disorder: 0 });
    expect(effectiveToleranceOf(settle('a', GOOD_LAWFUL).settlement, null, 'a')).toEqual({ cruelty: -1, disorder: -1 });
  });

  it('no trade ⇒ no drift (null ledger, byte-identical)', () => {
    const r = advanceInstitutionTolerance({ snapshot: { settlements: [settle('a', GOOD_LAWFUL), settle('b', EVIL_CHAOTIC)], regionalGraph: { edges: [] } }, worldState: {} });
    expect(r.institutionToleranceByCid).toBeNull();
  });

  it('all-neutral planes ⇒ no drift even with trade (byte-identical)', () => {
    const r = advanceInstitutionTolerance({ snapshot: { settlements: [settle('a', NEUTRAL), settle('b', NEUTRAL)], regionalGraph: { edges: [tradeEdge('a', 'b')] } }, worldState: {} });
    expect(r.institutionToleranceByCid).toBeNull();
  });

  it('a good town trading with an evil one grows MORE tolerant of cruelty (toward its partner)', () => {
    const led = driveTolerance([settle('a', GOOD_LAWFUL), settle('b', EVIL_CHAOTIC)], [tradeEdge('a', 'b')], 30);
    expect(led.a.cruelty).toBeGreaterThan(0);   // good town drifts up toward the evil partner
    expect(led.b.cruelty).toBeLessThan(0);      // evil town drifts down toward the good partner
    // capped: it normalizes what it tolerates but never fully converts.
    expect(Math.abs(led.a.cruelty)).toBeLessThanOrEqual(TOLERANCE_TUNING.CAP + 1e-9);
    // and its ACTUAL plane (baseline) is untouched — trade moves tolerance, not conviction.
    expect(patronConviction(GOOD_LAWFUL).cruelty).toBe(-1);
  });

  it('a metropolis norms a hamlet MORE than the reverse (mass asymmetry)', () => {
    const led = driveTolerance(
      [settle('metro', EVIL_CHAOTIC, 'metropolis'), settle('ham', GOOD_LAWFUL, 'hamlet')],
      [tradeEdge('metro', 'ham')], 20,
    );
    // the hamlet's tolerance shifts substantially; the metropolis's is negligible (so tiny
    // it may drop below EPS and never materialize) — a metropolis norms a hamlet, not vice versa.
    const hamShift = Math.abs(led.ham?.cruelty || 0);
    const metroShift = Math.abs(led.metro?.cruelty || 0);
    expect(hamShift).toBeGreaterThan(0.05);
    expect(metroShift).toBeLessThan(hamShift / 3);
  });

  it('severing trade relaxes a prior offset back toward baseline', () => {
    const led = driveTolerance([settle('a', GOOD_LAWFUL), settle('b', EVIL_CHAOTIC)], [tradeEdge('a', 'b')], 20);
    const relaxed = advanceInstitutionTolerance({ snapshot: { settlements: [settle('a', GOOD_LAWFUL), settle('b', EVIL_CHAOTIC)], regionalGraph: { edges: [] } }, worldState: { institutionTolerance: led } });
    expect(Math.abs(relaxed.institutionToleranceByCid.a.cruelty)).toBeLessThan(Math.abs(led.a.cruelty));
  });
});

// ── 2c. embargo as conscience ──────────────────────────────────────────────────
describe('embargo as conscience', () => {
  it('a good buyer abhors a slave market; an evil-chaotic buyer tolerates it', () => {
    const goodMult = institutionConscience(patronConviction(GOOD_LAWFUL), [slaveMarket]).mult;
    const evilMult = institutionConscience(patronConviction(EVIL_CHAOTIC), [slaveMarket]).mult;
    expect(goodMult).toBeLessThan(0.4);           // the plane objects to the flesh market
    expect(goodMult).toBeLessThan(evilMult);      // conscience scales with abhorrence
    expect(evilMult).toBe(1);                     // a cruel plane tolerates cruelty ⇒ no penalty
  });

  it('no morally-loaded institution ⇒ mult exactly 1 (the neutrality interlock)', () => {
    const consc = institutionConscience(patronConviction(GOOD_LAWFUL), [{ name: 'Bakers (5-15)', status: 'active' }]);
    expect(consc.mult).toBe(1);
    expect(consc.worst).toBeNull();
  });

  it('names the worst offending institution for the receipt', () => {
    const consc = institutionConscience(patronConviction(GOOD_LAWFUL), [{ name: 'Bakers (5-15)', status: 'active' }, slaveMarket]);
    expect(consc.worst).toBe('Slave market');
    expect(consc.abhorrence).toBeGreaterThan(0);
  });

  it('conscience reads a founded institution via its stamped moral lean (effectiveMoralLean)', () => {
    const founded = { name: 'Fighting pit', status: 'active', moralLean: { cruelty: 0.55, disorder: 0.85 } };
    expect(effectiveMoralLean(founded)).toEqual({ cruelty: 0.55, disorder: 0.85 });
    expect(institutionConscience(patronConviction(GOOD_LAWFUL), [founded]).mult).toBeLessThan(1);
  });
});

// ── 2b. faith prescribes ───────────────────────────────────────────────────────
describe('faith prescribes over the carriers', () => {
  it('deity-free world ⇒ empty reach (byte-identical)', () => {
    expect(buildFaithReach({ settlements: [settle('a', null), settle('b', null)], regionalGraph: { edges: [tradeEdge('a', 'b')] } }).size).toBe(0);
  });

  it('a patroned bearer reaches a trade neighbour at bounded, mass-attenuated strength', () => {
    const snapshot = {
      settlements: [settle('a', GOOD_LAWFUL), settle('b', null)],
      byId: new Map([['a', settle('a', GOOD_LAWFUL)], ['b', settle('b', null)]]),
      regionalGraph: { edges: [tradeEdge('a', 'b')] },
    };
    const reach = buildFaithReach(snapshot);
    const toB = reach.get('b');
    expect(toB).toBeTruthy();
    expect(toB[0].patron).toBe(GOOD_LAWFUL);
    expect(toB[0].strength).toBeGreaterThan(0);
    expect(toB[0].strength).toBeLessThanOrEqual(1);
  });

  it('a good foreign faith slowly abolishes a patron-less convert\'s slave market', () => {
    const settlement = { institutions: [slaveMarket], config: {} };   // NO local patron
    const snapshot = { settlements: [{ id: 'b', name: 'Briar', settlement }] };
    const faithReach = new Map([['b', [{ patron: GOOD_LAWFUL, strength: 0.5 }]]]);
    let ws = { tick: 0, simulationRules: {}, settlementTickStates: {} };
    let fired = null;
    for (let t = 0; t < 80 && !fired; t++) {
      const out = evaluateMoralInstitutionPressure({ ...ws, tick: t }, snapshot, { tick: t, faithReach });
      ws = out.worldState;
      if (out.candidates.length) fired = out.candidates[0];
    }
    expect(fired).toBeTruthy();
    expect(fired.institutionPatch.action).toBe('abolish');
    expect(fired.institutionPatch.name).toBe('Slave market');
    // the receipt names the reaching (prescribing) foreign patron.
    expect(fired.reasons.join(' ')).toMatch(/Lawgiver/);
  });

  it('no reach ⇒ a patron-less settlement is untouched (byte-identical, local-only lane)', () => {
    const settlement = { institutions: [slaveMarket], config: {} };
    const snapshot = { settlements: [{ id: 'b', name: 'Briar', settlement }] };
    let ws = { tick: 0, simulationRules: {}, settlementTickStates: {} };
    for (let t = 0; t < 80; t++) {
      const out = evaluateMoralInstitutionPressure({ ...ws, tick: t }, snapshot, { tick: t });   // no faithReach
      ws = out.worldState;
      expect(out.candidates).toEqual([]);
    }
    expect(ws.settlementTickStates.b?.moralViability).toBeFalsy();   // nothing materialized
  });
});
