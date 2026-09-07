/**
 * roadsKnownWorld.test.js — THE KNOWN PICTURE (R-2a): omniscient ⇒ truth; otherwise a decay-
 * weighted fold of the observer's danger rumours; silence ⇒ calm. DESIGN_THE_ROADS.md §5.
 */
import { describe, it, expect } from 'vitest';
import { knownEmbattlementView } from '../../src/domain/roads/knownWorld.js';
import { embattlementLevel } from '../../src/domain/spatial/embattlement.js';

// A spatial worldState (marker present) with a real (TRUTH) embattlement at 'd', and a
// rumour ledger observed by 'h'.
function mkWorld({ infoMode, rumors = {}, tick = 30 }) {
  return {
    tick,
    spatialCanonVersion: 1,
    simulationRules: { infoMode },
    spatialLedgers: {
      embattlement: { d: { level: 0.9, phase: 'embattled', sinceTick: 1, lastTick: tick } },
      rumorLedgers: { h: rumors },
    },
  };
}

describe('knownEmbattlementView — the beliefsActive seam (§5)', () => {
  it('omniscient ⇒ returns the REAL worldState (known ≡ true, same reference)', () => {
    const ws = mkWorld({ infoMode: 'omniscient' });
    expect(knownEmbattlementView(ws, 'h')).toBe(ws);
    // routing over it reads TRUTH — d is dangerous.
    expect(embattlementLevel(knownEmbattlementView(ws, 'h'), 'd')).toBeCloseTo(0.9, 6);
  });

  it('no spatial marker ⇒ returns the real worldState (aspatial byte-identical)', () => {
    const ws = { tick: 10, simulationRules: { infoMode: 'unreliable' }, spatialLedgers: {} };
    expect(knownEmbattlementView(ws, 'h')).toBe(ws);
  });
});

describe('knownEmbattlementView — SILENCE DECAYS TOWARD CALM (§5, the stale-intel core)', () => {
  it('unreliable + NO danger rumour about d ⇒ believed CALM (level 0) — the envoy walks in blind', () => {
    const view = knownEmbattlementView(mkWorld({ infoMode: 'unreliable', rumors: {} }), 'h');
    expect(view).not.toBe(undefined);
    expect(embattlementLevel(view, 'd'), 'silence ⇒ believed calm despite the TRUE danger').toBe(0);
  });

  it('unreliable + a FRESH grave danger rumour about d ⇒ believed elevated', () => {
    const rumors = { 'trade:evt1': { arrivalTick: 29, content: { what: 'siege', whereId: 'd', magnitude: 3, partyIds: ['d'] } } };
    const view = knownEmbattlementView(mkWorld({ infoMode: 'unreliable', rumors, tick: 30 }), 'h');
    // age 1 ⇒ near-full magnitude (3/3 ≈ 1.0 × decay ~0.96).
    expect(embattlementLevel(view, 'd')).toBeGreaterThan(0.8);
  });

  it('an OLD rumour (age > SILENCE_CALM_WEEKS) has decayed to calm', () => {
    const rumors = { 'trade:evt1': { arrivalTick: 1, content: { what: 'siege', whereId: 'd', magnitude: 3, partyIds: ['d'] } } };
    const view = knownEmbattlementView(mkWorld({ infoMode: 'unreliable', rumors, tick: 40 }), 'h'); // age 39 > 26
    expect(embattlementLevel(view, 'd'), 'a stale rumour decays toward calm').toBe(0);
  });

  it('a RELIEF rumour (siege_lifted) is not treated as danger', () => {
    const rumors = { 'trade:evt1': { arrivalTick: 29, content: { what: 'siege_lifted', whereId: 'd', magnitude: 2, partyIds: ['d'] } } };
    const view = knownEmbattlementView(mkWorld({ infoMode: 'unreliable', rumors, tick: 30 }), 'h');
    expect(embattlementLevel(view, 'd')).toBe(0);
  });

  it('a non-danger rumour (a market stir) is ignored', () => {
    const rumors = { 'trade:evt1': { arrivalTick: 29, content: { what: 'import_shortage', whereId: 'd', magnitude: 2, partyIds: ['d'] } } };
    const view = knownEmbattlementView(mkWorld({ infoMode: 'unreliable', rumors, tick: 30 }), 'h');
    expect(embattlementLevel(view, 'd')).toBe(0);
  });

  it('an in-transit rumour (arrivalTick > now) is not yet known', () => {
    const rumors = { 'trade:evt1': { arrivalTick: 45, content: { what: 'siege', whereId: 'd', magnitude: 3, partyIds: ['d'] } } };
    const view = knownEmbattlementView(mkWorld({ infoMode: 'unreliable', rumors, tick: 30 }), 'h');
    expect(embattlementLevel(view, 'd')).toBe(0);
  });
});
