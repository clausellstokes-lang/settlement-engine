/**
 * allyIntelSharing.test.js — Phase 5.5 M9b, component (4): ALLY-INTEL / BETRAYAL
 * (design §4g round 11 + round 15A intel STYLES).
 *
 * The binding contract:
 *   - a DELIBERATE high-confidence sharing channel: allies pool intel ⇒ a receiver's
 *     belief about a third party CONVERGES toward a well-informed ally's (misjudgment
 *     falls);
 *   - ALIGNMENT STYLES the handling — lawful FAITHFUL (preserved), evil DECEPTIVE-
 *     OUTWARD (feeds FALSE high-confidence intel), chaotic NOISY (garbled/low-conf);
 *   - the COMPROMISED-ALLY LEAK: sharing with a presumed ally that has TURNED /
 *     is compromised relays the sharer's intel to its REAL ENEMY (belief-map alliance
 *     ACCURACY becomes load-bearing);
 *   - OPT-IN: disabled ⇒ advanceBeliefMaps is BYTE-IDENTICAL to the M9a advance.
 */
import { describe, it, expect } from 'vitest';

import {
  applyAllyIntelSharing, advanceBeliefMaps, settlementCompromised,
  ALLY_INTEL_TUNING, GOVERNING_SEAT_KEY,
} from '../../src/domain/worldPulse/beliefMap.js';

const belief = (over = {}) => ({
  readiness: 0.25, strengthBand: 2, allianceLabel: 'neutral', faithLabel: null,
  confidence01: 0.85, lastUpdateTick: 3, ...over,
});
const item = (id, factions = []) => ({
  id, name: id.toUpperCase(),
  settlement: { name: id, tier: 'town', population: 2000, config: { primaryDeitySnapshot: { name: 'Sol' } }, powerStructure: { factions } },
});
const LAWFUL_GOOD = { lawfulness01: 0.9, malice01: 0.1 };
const EVIL = { lawfulness01: 0.5, malice01: 0.9 };
const CHAOTIC = { lawfulness01: 0.1, malice01: 0.3 };
// neighbours: observer → Map(subject → trueType).
const neigh = (rows) => new Map(Object.entries(rows).map(([o, m]) => [o, new Map(Object.entries(m))]));

describe('ally-intel — high-confidence sharing (convergence)', () => {
  it('a lawful ally shares a confident belief about a third party ⇒ the receiver ADOPTS it (faithful)', () => {
    // 's' believes 'r' an ally and holds a CONFIDENT belief about 't'; 'r' has none.
    const maps = { s: { [GOVERNING_SEAT_KEY]: {
      r: belief({ allianceLabel: 'allied', confidence01: 0.8 }),
      t: belief({ strengthBand: 4, readiness: 1, confidence01: 0.9 }),
    } } };
    const ctx = { byId: new Map([['s', item('s')], ['r', item('r')], ['t', item('t')]]), pressureIdx: null, worldState: {} };
    const out = applyAllyIntelSharing({ maps, ctx, neighbours: neigh({ s: { r: 'allied', t: 'neutral' } }), alignmentOf: () => LAWFUL_GOOD, now: 5 });
    const rBelief = out.r?.[GOVERNING_SEAT_KEY]?.t;
    expect(rBelief).toBeTruthy();
    expect(rBelief.strengthBand).toBe(4);           // faithful relay
    expect(rBelief.allianceLabel).toBe('neutral');  // preserved (not distorted)
    expect(rBelief.confidence01).toBeGreaterThan(0.7); // high-fidelity
  });

  it('a WEAKER shared telling does NOT overwrite a receiver’s more-confident belief', () => {
    const maps = { s: { [GOVERNING_SEAT_KEY]: {
      r: belief({ allianceLabel: 'allied', confidence01: 0.8 }),
      t: belief({ strengthBand: 4, confidence01: 0.62 }),         // just above the share floor
    } }, r: { [GOVERNING_SEAT_KEY]: { t: belief({ strengthBand: 1, confidence01: 0.95 }) } } };
    const ctx = { byId: new Map([['s', item('s')], ['r', item('r')], ['t', item('t')]]), pressureIdx: null, worldState: {} };
    const out = applyAllyIntelSharing({ maps, ctx, neighbours: neigh({ s: { r: 'allied' } }), alignmentOf: () => LAWFUL_GOOD, now: 5 });
    expect(out.r[GOVERNING_SEAT_KEY].t.strengthBand).toBe(1);     // its own confident belief holds
  });
});

describe('ally-intel — alignment STYLES the handling (round 15A)', () => {
  const baseMaps = () => ({ s: { [GOVERNING_SEAT_KEY]: {
    r: belief({ allianceLabel: 'allied', confidence01: 0.8 }),
    t: belief({ allianceLabel: 'trade_partner', readiness: 0.1, strengthBand: 3, confidence01: 0.9 }),
  } } });
  const ctx = () => ({ byId: new Map([['s', item('s')], ['r', item('r')], ['t', item('t')]]), pressureIdx: null, worldState: {} });
  const nb = neigh({ s: { r: 'allied', t: 'neutral' } });

  it('an EVIL sharer DECEIVES — a peaceful third party is relayed as a MOBILIZING enemy (false high-confidence intel)', () => {
    const out = applyAllyIntelSharing({ maps: baseMaps(), ctx: ctx(), neighbours: nb, alignmentOf: () => EVIL, now: 5 });
    const rt = out.r[GOVERNING_SEAT_KEY].t;
    expect(rt.allianceLabel).toBe('hostile');                     // painted as an enemy
    expect(rt.readiness).toBeCloseTo(ALLY_INTEL_TUNING.DECEIT_READINESS, 6); // "they're mobilizing"
    expect(rt.confidence01).toBeGreaterThan(0.7);                 // presented as FACT
  });

  it('a CHAOTIC sharer is NOISY — the relayed belief loses confidence', () => {
    const out = applyAllyIntelSharing({ maps: baseMaps(), ctx: ctx(), neighbours: nb, alignmentOf: () => CHAOTIC, now: 5 });
    const rt = out.r[GOVERNING_SEAT_KEY].t;
    expect(rt.confidence01).toBeLessThan(0.9 * ALLY_INTEL_TUNING.NOISE_DAMP + 0.001);
    expect(rt.allianceLabel).toBe('trade_partner');               // honest (not evil) — label kept
  });
});

describe('ally-intel — the COMPROMISED-ALLY LEAK (betrayal)', () => {
  // 's' believes 'r' an ally, but 'r' has TRULY turned hostile to 's'; 's' has a real enemy 'e'.
  const maps = () => ({ s: { [GOVERNING_SEAT_KEY]: {
    r: belief({ allianceLabel: 'allied', confidence01: 0.85 }),
  } } });
  const ctx = () => ({
    byId: new Map([['s', item('s')], ['r', item('r')], ['e', item('e')]]),
    pressureIdx: null, worldState: { warPosture: { s: { state: 'mobilized' } } },
  });

  it('a TURNED believed-ally leaks the sharer’s SELF intel to its REAL enemy (accurate, war-tipping)', () => {
    // s believes r allied; truth: s↔r hostile (turned), s↔e hostile (the real enemy).
    const out = applyAllyIntelSharing({
      maps: maps(), ctx: ctx(),
      neighbours: neigh({ s: { r: 'hostile', e: 'hostile' }, e: { s: 'hostile' } }),
      alignmentOf: () => LAWFUL_GOOD, now: 5,
    });
    const eKnowsS = out.e?.[GOVERNING_SEAT_KEY]?.s;
    expect(eKnowsS).toBeTruthy();
    expect(eKnowsS.confidence01).toBeCloseTo(ALLY_INTEL_TUNING.LEAK_CONFIDENCE, 6);
    expect(eKnowsS.readiness).toBeGreaterThan(0.5);   // e learns s is mobilized (accurate)
  });

  it('belief-map ACCURACY is load-bearing: if the sharer CORRECTLY reads the ally as hostile, it does NOT share ⇒ no leak', () => {
    const accurateMaps = { s: { [GOVERNING_SEAT_KEY]: { r: belief({ allianceLabel: 'hostile', confidence01: 0.85 }) } } };
    const out = applyAllyIntelSharing({
      maps: accurateMaps, ctx: ctx(),
      neighbours: neigh({ s: { r: 'hostile', e: 'hostile' }, e: { s: 'hostile' } }),
      alignmentOf: () => LAWFUL_GOOD, now: 5,
    });
    expect(out.e?.[GOVERNING_SEAT_KEY]?.s).toBeFalsy();  // no share (r not believed an ally) ⇒ no leak
  });

  it('a COMPROMISED believed-ally (roster corruption) also leaks — even at peace', () => {
    const compromisedR = item('r', [{ faction: 'Syndicate', category: 'criminal', power: 60, isGoverning: true, impairments: [{ type: 'corruption' }] }]);
    expect(settlementCompromised(compromisedR)).toBe(true);
    const byId = new Map([['s', item('s')], ['r', compromisedR], ['e', item('e')]]);
    const out = applyAllyIntelSharing({
      maps: maps(), ctx: { byId, pressureIdx: null, worldState: { warPosture: { s: { state: 'mobilized' } } } },
      neighbours: neigh({ s: { r: 'allied', e: 'hostile' }, e: { s: 'hostile' } }),
      alignmentOf: () => LAWFUL_GOOD, now: 5,
    });
    expect(out.e?.[GOVERNING_SEAT_KEY]?.s).toBeTruthy();  // leaked to the real enemy
  });
});

describe('ally-intel — OPT-IN byte-identity via advanceBeliefMaps', () => {
  const snapshot = {
    settlements: [item('a'), item('b'), item('c')],
    byId: new Map([['a', item('a')], ['b', item('b')], ['c', item('c')]]),
    regionalGraph: { edges: [{ id: 'e.ab', from: 'a', to: 'b', relationshipType: 'allied' }, { id: 'e.bc', from: 'b', to: 'c', relationshipType: 'rival' }] },
  };
  const prior = { a: { [GOVERNING_SEAT_KEY]: { b: belief({ allianceLabel: 'allied', confidence01: 0.8 }), c: belief({ strengthBand: 4, confidence01: 0.9 }) } } };
  const ws = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' }, relationshipStates: {}, spatialLedgers: { beliefMaps: prior } };

  it('disabled (or absent) allyIntel ⇒ identical to the M9a advance', () => {
    const off = advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: ws, tick: 6 });
    const disabled = advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: ws, tick: 6, allyIntel: { enabled: false } });
    expect(JSON.stringify(disabled.next)).toBe(JSON.stringify(off.next));
  });

  it('enabled ⇒ the ally pools intel (a converges toward its ally b about c is n/a here; a shares WITH b)', () => {
    const on = advanceBeliefMaps({
      snapshot, pressureIdx: null, worldState: ws, tick: 6,
      allyIntel: { enabled: true, alignmentOf: () => LAWFUL_GOOD },
    });
    // 'a' believes 'b' an ally and knows 'c' confidently ⇒ b now holds a belief about c.
    expect(on.next.b?.[GOVERNING_SEAT_KEY]?.c).toBeTruthy();
  });
});
