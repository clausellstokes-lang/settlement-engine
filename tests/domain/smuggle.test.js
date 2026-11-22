/**
 * smuggle.test.js — Phase 5.5 mover M7: CONTRABAND / SMUGGLE (the pure engine proof).
 *
 * Gates pinned here (the pure decision leaf):
 *   - CONTRABAND IS RELATIONAL: the SAME good is contraband at a good/lawful gate and
 *     legal at an evil/close one (cultureDistance + the gate's alignment decide);
 *   - THE PIPELINE ORDER IS LAW (§II.3-4-e): smuggle roll → (detected ∧ hostile) SEIZURE →
 *     (elif contraband) CONFISCATION → else TOLL — order-pinned;
 *   - ONE ROLL vs THE WORST GATE (§II.3-4-f): hostile > contraband > toll, deterministic;
 *   - the guild SATURATION-CAP brake: smuggleSuccessChance is HARD-CAPPED < 1 (no miracle);
 *   - SMUGGLE IS RISK-TOLERANCE-GATED: a cautious/lawful mover does not run contraband;
 *   - CORRUPTION IS THE HINGE: a leaky gate raises success;
 *   - CONSCIENCE gates the seizure TAKE (W-C2): a good/lawful seizer loots little;
 *   - the M6c EV-SPILL warrant (deep shortage × network × boldness).
 */
import { describe, it, expect } from 'vitest';
import {
  SMUGGLE_TUNING, CONTRABAND_TABLE, GATE_RANK,
  contrabandCategoryOf, isContraband, goodsResistance,
  criminalNetworkStrength, boldnessFromCaution, smuggleSuccessChance, smuggleDetected,
  smugglePipeline, worstGate, seizureTake, smuggleDispatchWarrant,
} from '../../src/domain/spatial/smuggle.js';

const T = SMUGGLE_TUNING;

// Culture-vector shorthands (the M4 CultureVector shape).
const good = { faithEvil01: 0.1, faithChaos01: 0.2, lawfulness01: 0.8, malice01: 0.1, economy01: 0.5, archetype: 'religious', governingName: 'Radiance' };
const evil = { faithEvil01: 0.9, faithChaos01: 0.8, lawfulness01: 0.2, malice01: 0.9, economy01: 0.5, archetype: 'criminal', governingName: 'The Chain' };
const slaverOrigin = { faithEvil01: 0.85, faithChaos01: 0.7, lawfulness01: 0.25, malice01: 0.85, economy01: 0.5, archetype: 'criminal', governingName: 'The Chain' };

describe('M7 — CONTRABAND classification + the RELATIONAL rule (§4d)', () => {
  it('contrabandCategoryOf: slaves flagship (category OR id); military/arcane; else null', () => {
    expect(contrabandCategoryOf('slaves', 'slaves')).toBe('slaves');
    expect(contrabandCategoryOf('other', 'chattel-labor')).toBe('slaves');     // the id hook
    expect(contrabandCategoryOf('military', 'iron-arms')).toBe('military');
    expect(contrabandCategoryOf('arcane', 'bound-relic')).toBe('arcane');
    expect(contrabandCategoryOf('food', 'grain')).toBe(null);                  // freely traded
    expect(contrabandCategoryOf('luxury', 'silk')).toBe(null);
    // The table is the whole data-driven vocabulary; slaves is present (the flagship).
    expect(Object.prototype.hasOwnProperty.call(CONTRABAND_TABLE, 'slaves')).toBe(true);
  });

  it('the SAME slaves good is CONTRABAND at a good/lawful gate but LEGAL at an evil/close gate', () => {
    const cat = 'slaves';
    // A morally-GOOD, lawful gate abolishes slavery ⇒ contraband.
    expect(isContraband({ category: cat, gateVector: good, originVector: slaverOrigin })).toBe(true);
    // The SAME cargo through an EVIL, culturally-CLOSE gate (same slaver overlord) ⇒ legal.
    expect(isContraband({ category: cat, gateVector: evil, originVector: slaverOrigin })).toBe(false);
  });

  it('a non-contraband category is NEVER contraband (freely traded everywhere)', () => {
    expect(isContraband({ category: null, gateVector: good, originVector: evil })).toBe(false);
    expect(isContraband({ category: 'food', gateVector: good, originVector: evil })).toBe(false);
  });

  it('a culturally-DISTANT gate bans what its neighbour trades freely (the culture ban)', () => {
    // military has no moral/law ban — only the culture-distance ban. A far gate bans it.
    const near = { ...evil, governingName: slaverOrigin.governingName }; // same overlord ⇒ close
    expect(isContraband({ category: 'military', gateVector: good, originVector: evil })).toBe(true);   // maximally distant
    expect(isContraband({ category: 'military', gateVector: near, originVector: evil })).toBe(false);  // culturally close
  });

  it('goodsResistance: bulky/valuable = harder; unknown ⇒ the modest default', () => {
    expect(goodsResistance('slaves')).toBeGreaterThan(goodsResistance('finished_good'));
    expect(goodsResistance('luxury')).toBeGreaterThan(goodsResistance('food'));
    expect(goodsResistance('nonsense')).toBeGreaterThan(0);
  });
});

describe('M7 — THE PIPELINE ORDER IS LAW (§II.3-4-e, order-pinned)', () => {
  it('detected ∧ hostile SEIZES before contraband CONFISCATION before TOLL', () => {
    // A hostile gate seizes even a legal cargo AND wins over a contraband one (precedence).
    expect(smugglePipeline({ detected: true, hostile: true, contraband: true })).toBe('seizure');
    expect(smugglePipeline({ detected: true, hostile: true, contraband: false })).toBe('seizure');
    // Not hostile but contraband ⇒ confiscation.
    expect(smugglePipeline({ detected: true, hostile: false, contraband: true })).toBe('confiscation');
    // Detected at a plain gate (neither) ⇒ just a toll.
    expect(smugglePipeline({ detected: true, hostile: false, contraband: false })).toBe('toll');
    // SLIPPED THROUGH (not detected) ⇒ ALWAYS toll (delivered — the trickle survives).
    expect(smugglePipeline({ detected: false, hostile: true, contraband: true })).toBe('toll');
    // The tier order matches the pipeline precedence.
    expect(GATE_RANK.hostile).toBeGreaterThan(GATE_RANK.contraband);
    expect(GATE_RANK.contraband).toBeGreaterThan(GATE_RANK.toll);
  });
});

describe('M7 — ONE ROLL vs THE WORST GATE (§II.3-4-f)', () => {
  it('worst by tier (hostile > contraband > toll), then danger, then codepoint id', () => {
    const gates = [
      { id: 'toll1', hostile: false, contraband: false, danger: 0.9 },
      { id: 'contra1', hostile: false, contraband: true, danger: 0.1 },
      { id: 'hostileA', hostile: true, contraband: false, danger: 0.3 },
      { id: 'hostileB', hostile: true, contraband: false, danger: 0.7 },
    ];
    const w = worstGate(gates);
    expect(w).not.toBeNull();
    expect(w.id).toBe('hostileB');   // hostile tier, higher danger
    expect(w.kind).toBe('hostile');
    // Contraband beats toll even at lower danger.
    expect(worstGate([{ id: 't', hostile: false, contraband: false, danger: 0.9 }, { id: 'c', hostile: false, contraband: true, danger: 0.0 }]).kind).toBe('contraband');
    // A pure-toll route has no seizure/confiscation gate (delivered).
    expect(worstGate([{ id: 't', hostile: false, contraband: false, danger: 0.5 }]).kind).toBe('toll');
    expect(worstGate([])).toBeNull();
  });

  it('same tier + same danger ⇒ deterministic codepoint tie-break', () => {
    const w = worstGate([
      { id: 'zeta', hostile: true, contraband: false, danger: 0.5 },
      { id: 'alpha', hostile: true, contraband: false, danger: 0.5 },
    ]);
    expect(w.id).toBe('alpha');
  });
});

describe('M7 — THE SMUGGLE NETWORK + the guild saturation-cap BRAKE', () => {
  it('criminalNetworkStrength is the stronger endpoint, bounded [0,1]', () => {
    expect(criminalNetworkStrength(0.3, 0.7)).toBe(0.7);
    expect(criminalNetworkStrength(0.9, 0.2)).toBe(0.9);
    expect(criminalNetworkStrength(5, -1)).toBe(1);   // clamped
    expect(criminalNetworkStrength(0, 0)).toBe(0);
  });

  it('smuggleSuccessChance rises with network + corruption, falls with resistance — HARD-CAPPED < 1', () => {
    const bold = 1;
    const lo = smuggleSuccessChance({ network: 0.1, corruption: 0.1, goodsResistance: 0.5, boldness: bold });
    const hiNet = smuggleSuccessChance({ network: 0.9, corruption: 0.1, goodsResistance: 0.5, boldness: bold });
    const hiCorr = smuggleSuccessChance({ network: 0.1, corruption: 0.9, goodsResistance: 0.5, boldness: bold });
    const hiResist = smuggleSuccessChance({ network: 0.9, corruption: 0.9, goodsResistance: 1, boldness: bold });
    expect(hiNet).toBeGreaterThan(lo);                    // a strong network leaks more
    expect(hiCorr).toBeGreaterThan(lo);                   // CORRUPTION IS THE HINGE
    expect(hiResist).toBeLessThan(smuggleSuccessChance({ network: 0.9, corruption: 0.9, goodsResistance: 0, boldness: bold }));
    // THE BRAKE: even max network + max corruption + zero resistance never guarantees passage.
    const maxed = smuggleSuccessChance({ network: 1, corruption: 1, goodsResistance: 0, boldness: 1 });
    expect(maxed).toBeLessThanOrEqual(T.SUCCESS_MAX);
    expect(maxed).toBeLessThan(1);
  });

  it('SMUGGLE IS RISK-TOLERANCE-GATED: a cautious/lawful mover does not run contraband', () => {
    expect(boldnessFromCaution(1)).toBe(0);              // fully lawful/cautious
    expect(boldnessFromCaution(0)).toBe(1);              // fully chaotic/bold
    // Below the attempt floor ⇒ zero smuggle regardless of a strong network + corrupt gate.
    const cautious = smuggleSuccessChance({ network: 1, corruption: 1, goodsResistance: 0, boldness: boldnessFromCaution(0.9) });
    expect(cautious).toBe(0);
    // A bold mover on the same gate DOES run it.
    const boldRun = smuggleSuccessChance({ network: 1, corruption: 1, goodsResistance: 0, boldness: boldnessFromCaution(0.1) });
    expect(boldRun).toBeGreaterThan(0);
  });

  it('smuggleDetected: a draw ≥ chance is caught; a draw < chance slips through', () => {
    expect(smuggleDetected(0.4, 0.99)).toBe(true);       // caught
    expect(smuggleDetected(0.4, 0.0)).toBe(false);       // slipped
    expect(smuggleDetected(0, 0)).toBe(true);            // zero chance ⇒ always caught
  });
});

describe('M7 — CONSCIENCE gates the seizure TAKE (W-C2)', () => {
  it('a good/lawful seizer loots little; an evil one takes near-all; bounded [0, carried]', () => {
    const takeEvil = seizureTake(10, 0);      // no conscience ⇒ max take
    const takeGood = seizureTake(10, 1);      // full conscience ⇒ ~nothing
    expect(takeGood).toBeLessThan(takeEvil);
    expect(takeGood).toBe(0);
    expect(takeEvil).toBeLessThanOrEqual(10);
    expect(takeEvil).toBeGreaterThan(0);
    // Monotone in conscience.
    expect(seizureTake(20, 0.2)).toBeGreaterThan(seizureTake(20, 0.8));
  });
});

describe('M7 — THE M6c EV-SPILL warrant (the tail of the greed curve)', () => {
  it('deep shortage × a real network × boldness runs a refused link; shallow/weak does not', () => {
    // Deep shortage, strong network, bold ⇒ the criminal channel runs it.
    expect(smuggleDispatchWarrant({ needPremium: 1, network: 0.6, boldness: 0.8 })).toBe(true);
    // A shallow shortage does not warrant the run.
    expect(smuggleDispatchWarrant({ needPremium: 0.1, network: 0.6, boldness: 0.8 })).toBe(false);
    // No criminal network ⇒ no run however deep the shortage.
    expect(smuggleDispatchWarrant({ needPremium: 1, network: 0.05, boldness: 0.8 })).toBe(false);
    // A cautious mover (below the attempt floor) does not run it.
    expect(smuggleDispatchWarrant({ needPremium: 1, network: 0.6, boldness: T.ATTEMPT_FLOOR })).toBe(false);
  });
});
