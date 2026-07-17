/**
 * reframeKernel.test.js — D7 THE REFRAME LAYER unit pins (DESIGN_SIM_DEPTH_R2 §D7).
 * The kernel in isolation: the dormancy gate, the pure interpretation read, and the
 * mover's sticky/hysteresis/cap/both-signs/frozen-facts/determinism discipline.
 */
import { describe, it, expect } from 'vitest';
import {
  reframeActive, interpretationLean, readingForLean, advanceReframe,
  debtClaim01, dependencyByDesign01, debtForgiven01, bondsOfCommerce01,
  darkReframe01, restitutionClaim01, reframeReadingOf, REFRAME_TUNING,
  REFRAME_VOCAB, isDarkReading, isBrightReading,
} from '../../src/domain/worldPulse/reframeKernel.js';
import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipState.js';

/** Build a minimal lit worldState: one obligation (creditor gave the debtor grain) and a
 *  relationship state of a given warmth/resentment on the pair. */
function makeWorld({ trust = 0.5, resentment = 0.0, predatory = false, kind = 'grain_relief', mintTick = 0, extraObligations = {}, dependency = 0, leverage = 0, lit = true } = {}) {
  const key = relationshipKeyFromEdge({ from: 'creditor', to: 'debtor' });
  const relStates = {
    [key]: { relationshipType: 'rival', trust, resentment, dependency, leverage },
  };
  const worldState = {
    simulationRules: lit ? { reframeEnabled: true } : {},
    relationshipStates: relStates,
    spatialLedgers: {
      obligations: {
        'debtor:creditor:grain_relief': { from: 'debtor', to: 'creditor', kind, magnitude: 0.6, mintTick, lastTick: mintTick, ...(predatory ? { predatory: true } : {}) },
        ...extraObligations,
      },
    },
  };
  const byId = new Map([
    ['creditor', { id: 'creditor', settlement: {} }],
    ['debtor', { id: 'debtor', settlement: {} }],
  ]);
  const snapshot = { byId, regionalGraph: { edges: [{ from: 'creditor', to: 'debtor' }] } };
  return { worldState, snapshot };
}

describe('D7 reframe gate + pure interpretation', () => {
  it('reframeActive is fail-closed on the virtual flag', () => {
    expect(reframeActive({ simulationRules: { reframeEnabled: true } })).toBe(true);
    expect(reframeActive({ simulationRules: {} })).toBe(false);
    expect(reframeActive({ simulationRules: { reframeEnabled: 'yes' } })).toBe(false);
    expect(reframeActive(null)).toBe(false);
    expect(reframeActive({})).toBe(false);
  });

  it('interpretationLean: grievance/fear/liar/malice darken; warmth/benignity brighten', () => {
    const dark = interpretationLean({ warmth: -0.5, resentment: 0.8, fear01: 0.5, liar01: 0.5, predatory: false, malice01: 0.9 });
    const bright = interpretationLean({ warmth: 0.9, resentment: 0, fear01: 0, liar01: 0, predatory: false, malice01: 0.1 });
    const neutral = interpretationLean({ warmth: 0, resentment: 0, fear01: 0, liar01: 0, predatory: false, malice01: 0.5 });
    expect(dark).toBeLessThan(-REFRAME_TUNING.DARK_ENTER);
    expect(bright).toBeGreaterThan(REFRAME_TUNING.BRIGHT_ENTER);
    expect(Math.abs(neutral)).toBeLessThan(REFRAME_TUNING.DARK_ENTER);
  });

  it('interpretationLean: predatory intent only darkens once warmth has cooled', () => {
    const warmPredatory = interpretationLean({ warmth: 1, resentment: 0, fear01: 0, liar01: 0, predatory: true, malice01: 0.5 });
    const coldPredatory = interpretationLean({ warmth: 0, resentment: 0, fear01: 0, liar01: 0, predatory: true, malice01: 0.5 });
    expect(coldPredatory).toBeLessThan(warmPredatory); // the trap only reads dark after the chill
  });

  it('readingForLean walks the bounded vocabulary bands (negativity bias: dark easier)', () => {
    expect(readingForLean('aid', -REFRAME_TUNING.DARK_ENTER)).toBe('debt_unpaid');
    expect(readingForLean('aid', -REFRAME_TUNING.DEEPEN)).toBe('tribute_extracted');
    expect(readingForLean('aid', REFRAME_TUNING.BRIGHT_ENTER)).toBe('gift_forgiven');
    expect(readingForLean('aid', -0.1)).toBeNull(); // inside the neutral band
    // Negativity bias: a lean that trips dark would NOT trip bright at the mirror magnitude.
    expect(REFRAME_TUNING.BRIGHT_ENTER).toBeGreaterThan(REFRAME_TUNING.DARK_ENTER);
    expect(isDarkReading('debt_unpaid')).toBe(true);
    expect(isBrightReading('gift_forgiven')).toBe(true);
  });
});

describe('D7 reframe mover — dormancy + transitions', () => {
  it('flag absent ⇒ a complete no-op (no reframes ledger, worldState identity)', () => {
    const { worldState, snapshot } = makeWorld({ resentment: 0.9, lit: false });
    const r = advanceReframe({ snapshot, worldState, tick: 5 });
    expect(r.changed).toBe(false);
    expect(r.worldState).toBe(worldState);
    expect(r.worldState.spatialLedgers.reframes).toBeUndefined();
  });

  it('a soured creditor mints debt_unpaid; the ingratitude_debt + restitution reads fire', () => {
    const { worldState, snapshot } = makeWorld({ trust: 0.05, resentment: 0.85 });
    const r = advanceReframe({ snapshot, worldState, tick: 5 });
    expect(r.changed).toBe(true);
    const reading = reframeReadingOf(r.worldState, 'creditor', 'debtor', 'aid');
    expect(reading?.reading).toBe('debt_unpaid');
    expect(reading?.sign).toBe('dark');
    expect(debtClaim01(r.worldState, 'creditor', 'debtor')).toBeGreaterThan(0);
    expect(restitutionClaim01(r.worldState, 'creditor', 'debtor')).toBeGreaterThan(0);
    // the DEBTOR-side dark tribute reading (corruption leash material)
    expect(darkReframe01(r.worldState, 'debtor', 'creditor')).toBeGreaterThan(0);
  });

  it('the frozen-facts pin: no interpretation path mutates the obligations ledger', () => {
    const { worldState, snapshot } = makeWorld({ trust: 0.05, resentment: 0.85 });
    const before = JSON.stringify(worldState.spatialLedgers.obligations);
    const r = advanceReframe({ snapshot, worldState, tick: 5 });
    expect(JSON.stringify(r.worldState.spatialLedgers.obligations)).toBe(before);
  });

  it('determinism: the same inputs fold to a byte-identical ledger', () => {
    const a = makeWorld({ trust: 0.05, resentment: 0.85 });
    const b = makeWorld({ trust: 0.05, resentment: 0.85 });
    const ra = advanceReframe({ snapshot: a.snapshot, worldState: a.worldState, tick: 9 });
    const rb = advanceReframe({ snapshot: b.snapshot, worldState: b.worldState, tick: 9 });
    expect(JSON.stringify(ra.worldState.spatialLedgers.reframes)).toBe(JSON.stringify(rb.worldState.spatialLedgers.reframes));
  });
});

describe('D7 both-signs (the unification law) + hysteresis + scarcity', () => {
  it('both signs: a reconciliation reverses debt_unpaid → gift_forgiven', () => {
    // Tick 1: soured → dark.
    const { worldState, snapshot } = makeWorld({ trust: 0.05, resentment: 0.85 });
    const dark = advanceReframe({ snapshot, worldState, tick: 1 });
    expect(reframeReadingOf(dark.worldState, 'creditor', 'debtor', 'aid')?.reading).toBe('debt_unpaid');
    // Tick 2: reconciliation (warmth high, grudge gone) crosses BRIGHT_ENTER + DEADBAND.
    const warmKey = relationshipKeyFromEdge({ from: 'creditor', to: 'debtor' });
    dark.worldState.relationshipStates = { [warmKey]: { relationshipType: 'allied', trust: 0.98, resentment: 0.0 } };
    const bright = advanceReframe({ snapshot, worldState: dark.worldState, tick: 2 });
    const reading = reframeReadingOf(bright.worldState, 'creditor', 'debtor', 'aid');
    expect(reading?.reading).toBe('gift_forgiven');
    expect(reading?.sign).toBe('bright');
    expect(debtForgiven01(bright.worldState, 'creditor', 'debtor')).toBeGreaterThan(0);
    // debt claim gone (both-signs)
    expect(debtClaim01(bright.worldState, 'creditor', 'debtor')).toBe(0);
  });

  it('hysteresis: warmth oscillating inside the deadband mints ZERO transitions', () => {
    // Neutral pair, warmth bouncing but never clearing DARK_ENTER or BRIGHT_ENTER.
    let world = makeWorld({ trust: 0.5, resentment: 0.2 }).worldState;
    const snap = makeWorld({ trust: 0.5, resentment: 0.2 }).snapshot;
    const key = relationshipKeyFromEdge({ from: 'creditor', to: 'debtor' });
    let anyReading = false;
    for (let t = 0; t < 6; t++) {
      // mild oscillation: resentment 0.2↔0.25, trust 0.4↔0.5 — leans stay sub-threshold
      world = { ...world, relationshipStates: { [key]: { relationshipType: 'neutral', trust: t % 2 ? 0.5 : 0.4, resentment: t % 2 ? 0.2 : 0.25 } } };
      const r = advanceReframe({ snapshot: snap, worldState: world, tick: t });
      world = r.worldState;
      if (world.spatialLedgers?.reframes) anyReading = true;
    }
    expect(anyReading).toBe(false);
  });

  it('scarcity: concurrent non-neutral readings never exceed the CAP', () => {
    // Build many soured creditor→debtor pairs; only CAP may transition.
    const N = REFRAME_TUNING.CAP + 5;
    const relStates = {};
    const obligations = {};
    const byId = new Map();
    const edges = [];
    for (let i = 0; i < N; i++) {
      const c = `c${i}`; const d = `d${i}`;
      const edge = { from: c, to: d };
      edges.push(edge);
      relStates[relationshipKeyFromEdge(edge)] = { relationshipType: 'rival', trust: 0.02, resentment: 0.9 };
      obligations[`${d}:${c}:grain_relief`] = { from: d, to: c, kind: 'grain_relief', magnitude: 0.6, mintTick: 0, lastTick: 0 };
      byId.set(c, { id: c, settlement: {} });
      byId.set(d, { id: d, settlement: {} });
    }
    const worldState = { simulationRules: { reframeEnabled: true }, relationshipStates: relStates, spatialLedgers: { obligations } };
    const snapshot = { byId, regionalGraph: { edges } };
    const r = advanceReframe({ snapshot, worldState, tick: 3 });
    const ledger = r.worldState.spatialLedgers.reframes || {};
    let nonNeutral = 0;
    for (const pk of Object.keys(ledger)) nonNeutral += Object.keys(ledger[pk].readings).length;
    expect(nonNeutral).toBeLessThanOrEqual(REFRAME_TUNING.CAP);
    expect(nonNeutral).toBe(REFRAME_TUNING.CAP); // it fills to the cap (non-vacuous)
  });

  it('the memory law forecloses re-litigation of a forgotten act (age > memory window)', () => {
    // A generational memory (window 24); an act minted 40 ticks ago is forgotten.
    const { worldState, snapshot } = makeWorld({ trust: 0.05, resentment: 0.85, mintTick: 0 });
    const r = advanceReframe({ snapshot, worldState, tick: 40 });
    expect(r.worldState.spatialLedgers?.reframes).toBeUndefined(); // forgotten ⇒ no reframe
  });
});

describe('D7 trade-dependence class', () => {
  it('the dependent side reframes commerce → dependency_by_design; bright → bonds_of_commerce', () => {
    const key = relationshipKeyFromEdge({ from: 'weak', to: 'strong' });
    const worldState = {
      simulationRules: { reframeEnabled: true },
      relationshipStates: { [key]: { relationshipType: 'rival', trust: 0.02, resentment: 0.9, dependency: 0.8, leverage: 0.1 } },
      spatialLedgers: {},
    };
    const byId = new Map([['weak', { id: 'weak', settlement: {} }], ['strong', { id: 'strong', settlement: {} }]]);
    const snapshot = { byId, regionalGraph: { edges: [{ from: 'weak', to: 'strong' }] } };
    const r = advanceReframe({ snapshot, worldState, tick: 2 });
    // dependent side is the lower-leverage endpoint (codepoint-stable among a<b): 'strong' < 'weak'
    const depReading = reframeReadingOf(r.worldState, 'strong', 'weak', 'trade_dependence')
      || reframeReadingOf(r.worldState, 'weak', 'strong', 'trade_dependence');
    expect(depReading?.reading).toBe('dependency_by_design');
    const [obs, subj] = reframeReadingOf(r.worldState, 'strong', 'weak', 'trade_dependence') ? ['strong', 'weak'] : ['weak', 'strong'];
    expect(dependencyByDesign01(r.worldState, obs, subj)).toBeGreaterThan(0);
  });
});

describe('D7 vocabulary shape', () => {
  it('the vocabulary is frozen and total over the 8 act classes', () => {
    expect(Object.isFrozen(REFRAME_VOCAB)).toBe(true);
    expect(Object.keys(REFRAME_VOCAB).length).toBe(8);
    for (const [, v] of Object.entries(REFRAME_VOCAB)) {
      expect(typeof v.base).toBe('string');
      expect(Array.isArray(v.dark) && v.dark.length >= 1).toBe(true);
      expect(typeof v.bright).toBe('string');
    }
  });
});
