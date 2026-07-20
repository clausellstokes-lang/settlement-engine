/**
 * factionPairLedger.test.js — DEEP COUPLINGS D-7c pins (design §10.5, owner-commissioned).
 *
 * THE FACTION-PAIR LEDGER — the wave's one new persisted shape (owner-visible): a SYMMETRIC
 * pairwise record carrying BOTH signs (trust AND resentment) + a bounded ring of typed decaying
 * incidents, canonically keyed, decayed on the D5-band clock via the faction relax pass. ADDITIVE
 * + ABSENT-WHEN-DARK (no migration): a world that never lit a pair carries no factionPairStates.
 */
import { describe, it, expect } from 'vitest';
import {
  FACTION_PAIR_TUNING, factionPairKey, factionPairOf, mintFactionPairIncident, decayFactionPairStates,
} from '../../src/domain/worldPulse/factionPairLedger.js';
import { relaxFactionStates } from '../../src/domain/worldPulse/factionCompetition.js';

const T = FACTION_PAIR_TUNING;

describe('D-7c factionPairKey — canonical, orientation-free', () => {
  it('sorts the pair codepoint-stably (same key either way)', () => {
    expect(factionPairKey('b', 'a')).toBe('a|b');
    expect(factionPairKey('a', 'b')).toBe('a|b');
  });
});

describe('D-7c mintFactionPairIncident — symmetric deposit, bounded ring', () => {
  it('creates a pair record with both signs + a typed incident (a NEW worldState)', () => {
    const ws = { factionPairStates: {} };
    const next = mintFactionPairIncident(ws, { a: 'guild', b: 'crown', type: 'coalition_betrayal', resentmentDelta: 0.3, sev: 0.5, tick: 40, weeks: 40 });
    const rec = factionPairOf(next, 'crown', 'guild'); // orientation-free read
    expect(rec.resentment).toBe(0.3);
    expect(rec.trust).toBe(0);
    expect(rec.incidents.at(-1)).toEqual({ tick: 40, type: 'coalition_betrayal', sev: 0.5 });
    expect(ws.factionPairStates).toEqual({}); // purity
  });
  it('accumulates BOTH signs independently (standing-together builds trust; betrayal feeds resentment)', () => {
    let ws = { factionPairStates: {} };
    ws = mintFactionPairIncident(ws, { a: 'x', b: 'y', type: 'stood_together', trustDelta: 0.4, tick: 10, weeks: 10 });
    ws = mintFactionPairIncident(ws, { a: 'x', b: 'y', type: 'coalition_betrayal', resentmentDelta: 0.5, tick: 20, weeks: 20 });
    const rec = factionPairOf(ws, 'x', 'y');
    expect(rec.trust).toBe(0.4);
    expect(rec.resentment).toBe(0.5);
    expect(rec.incidents.length).toBe(2);
  });
  it('bounds the incident ring at MAX_INCIDENTS (the ≤8 idiom) and clamps signs to 0..1', () => {
    let ws = { factionPairStates: {} };
    for (let i = 0; i < 12; i += 1) ws = mintFactionPairIncident(ws, { a: 'x', b: 'y', type: `e${i}`, resentmentDelta: 0.2, tick: i, weeks: i });
    const rec = factionPairOf(ws, 'x', 'y');
    expect(rec.incidents.length).toBe(T.MAX_INCIDENTS);
    expect(rec.resentment).toBe(1); // clamped, not 2.4
  });
  it('a self-pair or missing id is a byte-safe no-op', () => {
    const ws = { factionPairStates: {} };
    expect(mintFactionPairIncident(ws, { a: 'x', b: 'x', type: 'e', tick: 1, weeks: 1 })).toBe(ws);
    expect(mintFactionPairIncident(ws, { a: '', b: 'y', type: 'e', tick: 1, weeks: 1 })).toBe(ws);
  });
});

describe('D-7c decayFactionPairStates — D5-band decay of both signs, drop-when-empty', () => {
  it('decays both signs on the half-life and prunes a fully-spent pair (key drops)', () => {
    let ws = mintFactionPairIncident({ factionPairStates: {} }, { a: 'x', b: 'y', type: 'e', trustDelta: 1, resentmentDelta: 1, sev: 1, tick: 0, weeks: 0 });
    // One half-life later ⇒ both ~0.5.
    const half = decayFactionPairStates(ws, T.HALF_LIFE_WEEKS);
    const rec = factionPairOf(half, 'x', 'y');
    expect(rec.trust).toBeCloseTo(0.5, 2);
    expect(rec.resentment).toBeCloseTo(0.5, 2);
    // Many half-lives later ⇒ pruned ⇒ the whole ledger drops (byte-identical to never-lit).
    const gone = decayFactionPairStates(ws, T.HALF_LIFE_WEEKS * 30);
    expect('factionPairStates' in gone).toBe(false);
  });
  it('an ABSENT ledger is a byte-safe no-op (the dormancy path)', () => {
    const ws = { tick: 5 };
    expect(decayFactionPairStates(ws, 5)).toBe(ws);
  });
});

describe('D-7c relaxFactionStates — the pair decay rides the same pass, dormancy-safe', () => {
  it('a memoryWeave-dark world (no factionPairStates) relaxes byte-identically', () => {
    const ws = { factionStates: { f1: { momentum: 0.5 } }, calendar: { elapsedWeeks: 100 } };
    const out = relaxFactionStates(ws);
    expect('factionPairStates' in out).toBe(false); // no key introduced
    expect(out.factionStates.f1.momentum).toBeCloseTo(0.425, 3); // momentum still relaxes (×0.85)
  });
  it('a lit pair decays through the relax pass', () => {
    let ws = mintFactionPairIncident({ factionStates: {}, calendar: { elapsedWeeks: 0 } }, { a: 'x', b: 'y', type: 'e', resentmentDelta: 1, sev: 1, tick: 0, weeks: 0 });
    ws = { ...ws, calendar: { elapsedWeeks: T.HALF_LIFE_WEEKS } };
    const out = relaxFactionStates(ws);
    expect(factionPairOf(out, 'x', 'y').resentment).toBeCloseTo(0.5, 2);
  });
});
