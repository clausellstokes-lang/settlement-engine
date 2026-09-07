/**
 * trendLensClaimsParity.test.js — V-25e RADAR LENSES v1, THE TREND-NOT-PROPHECY LAW.
 *
 * The mirror of certificationClaimsParity applied to trend lenses: walk every reading and assert
 * (1) it uses NO forecast/prophecy vocabulary — a trend describes the past, never the future — and
 * (2) every claim traces to the ring computation (the band matches populationTrendBand, the
 * direction matches the band, and every number in the reading is the computed net / window). A
 * lens may state what HAS happened; it may never predict.
 */
import { describe, it, expect } from 'vitest';
import { buildTrendLenses, populationTrendBand } from '../../src/domain/display/trendLens.js';
import { AXIS_TUNING } from '../../src/domain/worldPulse/beliefAxes.js';

// A ring that grows hard, one that empties, one that holds flat.
const RINGS = {
  swelling: Array.from({ length: 6 }, (_, i) => ({ tick: i, delta: 60, population: 300 + i * 60 })),
  emptying: Array.from({ length: 6 }, (_, i) => ({ tick: i, delta: -70, population: 900 - i * 70 })),
  steady: Array.from({ length: 6 }, (_, i) => ({ tick: i, delta: 0, population: 500 })),
};
const settlementOf = (populationHistory) => ({ populationHistory });

// Forbidden forecast vocabulary — a trend lens must never say what WILL be.
const PROPHECY_VOCAB = /\b(will|shall|going to|gonna|expect\w*|predict\w*|forecast\w*|foretell\w*|prophec\w*|imminent|about to|likely to|projected|anticipat\w*|destin\w*|soon)\b/i;

describe('V-25e trend lens — trend, never prophecy', () => {
  it('no reading uses forecast/prophecy vocabulary (past & present only)', () => {
    for (const ring of Object.values(RINGS)) {
      for (const lens of buildTrendLenses({ settlement: settlementOf(ring) })) {
        expect(PROPHECY_VOCAB.test(lens.reading), `a trend reading forecasts the future: "${lens.reading}"`).toBe(false);
        // present-perfect framing — the reading says what HAS happened / HAS held.
        expect(/\bhas\b/.test(lens.reading), `reading not retrospective: "${lens.reading}"`).toBe(true);
      }
    }
  });

  it('claims-parity: the band/direction/number each trace to the ring computation', () => {
    for (const ring of Object.values(RINGS)) {
      const lens = buildTrendLenses({ settlement: settlementOf(ring) }).find((l) => l.id === 'population');
      const computed = populationTrendBand(ring);
      // (a) band is exactly the fold over the ring
      expect(lens.band).toBe(computed.band);
      // (b) direction bucket matches the band sign
      expect(lens.direction).toBe(lens.band > 0 ? 'rising' : lens.band < 0 ? 'falling' : 'steady');
      // (c) magnitude is the net change over the SAME window the band reads
      const win = ring.slice(-AXIS_TUNING.TREND_WINDOW);
      const net = Math.round(win[win.length - 1].population - win[0].population);
      expect(lens.magnitude).toBe(net);
      expect(computed.net).toBe(net);
      // (d) every number that appears in the reading is one the computation produced
      const nums = (lens.reading.match(/-?\d+/g) || []).map(Number);
      for (const num of nums) expect([net, lens.window].includes(num), `reading states an unbacked number ${num}: "${lens.reading}"`).toBe(true);
    }
  });

  it('the swelling ring rises, the emptying ring falls, the steady ring holds', () => {
    expect(buildTrendLenses({ settlement: settlementOf(RINGS.swelling) })[0].direction).toBe('rising');
    expect(buildTrendLenses({ settlement: settlementOf(RINGS.emptying) })[0].direction).toBe('falling');
    expect(buildTrendLenses({ settlement: settlementOf(RINGS.steady) })[0].direction).toBe('steady');
  });

  it('is coherent with the population arc for the plain-number ring format too', () => {
    // [1000, 950, 900] visibly declines — the lens must read "falling", never "level".
    const lens = buildTrendLenses({ settlement: settlementOf([1000, 950, 900]) })[0];
    expect(lens.direction).toBe('falling');
    expect(lens.magnitude).toBe(-100);
    expect(/held level|steady/i.test(lens.reading)).toBe(false);
  });

  it('fewer than two readings ⇒ no lenses; deterministic', () => {
    expect(buildTrendLenses({ settlement: { populationHistory: [] } })).toEqual([]);
    expect(buildTrendLenses({ settlement: { populationHistory: [500] } })).toEqual([]);
    expect(buildTrendLenses({ settlement: {} })).toEqual([]);
    expect(buildTrendLenses({})).toEqual([]);
    expect(buildTrendLenses()).toEqual([]);
    expect(JSON.stringify(buildTrendLenses({ settlement: settlementOf(RINGS.swelling) })))
      .toBe(JSON.stringify(buildTrendLenses({ settlement: settlementOf(RINGS.swelling) })));
  });
});
