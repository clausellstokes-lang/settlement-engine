/**
 * beliefAxes.test.js — D-1 (deep-couplings): THE BELIEF AXES leaf unit contract.
 *
 * Covers the pure fold/reconcile machinery (src/domain/worldPulse/beliefAxes.js):
 *   • beliefAxesActive — the virtual flag gate.
 *   • trendBandFromHistory — the ground-truth demographic band from the populationHistory ring.
 *   • observanceFromTraditions — the ground-truth cultural label (largest-scale motif:patron).
 *   • foldBeliefAxes — demographic (origin emptying / destination swelling, magnitude × fidelity)
 *     and cultural (fresh faithful beat ⇒ adopt current truth; else the stale rite survives), with
 *     the dot-robust migration direction recovery.
 */
import { describe, expect, it } from 'vitest';
import {
  beliefAxesActive,
  trendBandFromHistory,
  observanceFromTraditions,
  axisGroundTruth,
  foldBeliefAxes,
  AXIS_TUNING,
} from '../../src/domain/worldPulse/beliefAxes.js';

describe('beliefAxesActive — the virtual flag gate', () => {
  it('true only for exactly true', () => {
    expect(beliefAxesActive(undefined)).toBe(false);
    expect(beliefAxesActive({ simulationRules: {} })).toBe(false);
    expect(beliefAxesActive({ simulationRules: { beliefAxesEnabled: false } })).toBe(false);
    expect(beliefAxesActive({ simulationRules: { beliefAxesEnabled: 'true' } })).toBe(false);
    expect(beliefAxesActive({ simulationRules: { beliefAxesEnabled: true } })).toBe(true);
  });
});

describe('trendBandFromHistory — the demographic ground truth', () => {
  const hist = (deltas, pop) => deltas.map((d, i) => ({ delta: d, population: pop }));
  it('flat / empty history reads 0', () => {
    expect(trendBandFromHistory([])).toBe(0);
    expect(trendBandFromHistory(null)).toBe(0);
    expect(trendBandFromHistory(hist([0, 1, -1], 1000))).toBe(0);
  });
  it('a strong recent net loss reads −2, mild loss −1', () => {
    expect(trendBandFromHistory(hist([-100, -100], 1000))).toBe(-2); // −0.2 ratio
    expect(trendBandFromHistory(hist([-30, -30], 1000))).toBe(-1);   // −0.06 ratio
  });
  it('a strong recent net gain reads +2, mild gain +1', () => {
    expect(trendBandFromHistory(hist([120, 100], 1000))).toBe(2);
    expect(trendBandFromHistory(hist([30, 30], 1000))).toBe(1);
  });
  it('reads only the recent window', () => {
    const long = [...Array(20)].map(() => ({ delta: -500, population: 1000 }))
      .concat([...Array(AXIS_TUNING.TREND_WINDOW)].map(() => ({ delta: 60, population: 1000 })));
    expect(trendBandFromHistory(long)).toBe(2); // the recent window is all growth
  });
});

describe('observanceFromTraditions — the cultural ground truth', () => {
  it('null on empty', () => {
    expect(observanceFromTraditions([])).toBeNull();
    expect(observanceFromTraditions(null)).toBeNull();
  });
  it('the largest-scale tradition motif:patron wins', () => {
    const trads = [
      { coreMotif: { element: 'ember' }, scaleBand: 2, deityRef: 'deity.vael' },
      { coreMotif: { element: 'tide' }, scaleBand: 5, deityRef: 'deity.osh' },
    ];
    expect(observanceFromTraditions(trads)).toBe('tide:deity.osh');
  });
  it('a patronless rite reads motif:null', () => {
    expect(observanceFromTraditions([{ coreMotif: { element: 'harvest' }, scaleBand: 1, deityRef: null }])).toBe('harvest:null');
  });
});

describe('axisGroundTruth — the two fields from a snapshot item', () => {
  it('derives both from item.settlement', () => {
    const item = { settlement: {
      populationHistory: [{ delta: -200, population: 1000 }],
      traditions: [{ coreMotif: { element: 'ember' }, scaleBand: 3, deityRef: 'deity.vael' }],
    } };
    expect(axisGroundTruth(item)).toEqual({ populationTrendBand: -2, observanceLabel: 'ember:deity.vael' });
  });
  it('tolerates a bare/absent settlement', () => {
    expect(axisGroundTruth(null)).toEqual({ populationTrendBand: 0, observanceLabel: null });
    expect(axisGroundTruth({})).toEqual({ populationTrendBand: 0, observanceLabel: null });
  });
});

describe('foldBeliefAxes — the demographic axis', () => {
  const gt = { populationTrendBand: 0, observanceLabel: 'ember:null' };
  const flight = (parties, origin, dest, depart, mag, acc = 1, comp = 1) => ({
    accuracy01: acc, completeness01: comp,
    content: { what: 'migration_flight', magnitude: mag, partyIds: parties },
    eventRef: `migration.${origin}.${dest}.${depart}`,
  });

  it('the ORIGIN of a flight trends negative (emptying)', () => {
    const out = foldBeliefAxes({ prior: null, groundTruth: gt, reports: [flight(['x', 'y'], 'x', 'y', 5, 3)], subjectId: 'x' });
    expect(out.populationTrendBand).toBeLessThan(0);
  });
  it('the DESTINATION of a flight trends positive (swelling)', () => {
    const out = foldBeliefAxes({ prior: null, groundTruth: gt, reports: [flight(['x', 'y'], 'x', 'y', 5, 3)], subjectId: 'y' });
    expect(out.populationTrendBand).toBeGreaterThan(0);
  });
  it('degraded fidelity softens the pull (a garbled flight moves the belief less)', () => {
    const sharp = foldBeliefAxes({ prior: null, groundTruth: gt, reports: [flight(['x', 'y'], 'x', 'y', 5, 3, 1, 1)], subjectId: 'x' });
    const garbled = foldBeliefAxes({ prior: null, groundTruth: gt, reports: [flight(['x', 'y'], 'x', 'y', 5, 1, 0.3, 0.3)], subjectId: 'x' });
    expect(sharp.populationTrendBand).toBeLessThanOrEqual(garbled.populationTrendBand);
  });
  it('direction recovery is robust to dots in ids', () => {
    // origin 'a.b', dest 'a' — the naive prefix split would be ambiguous.
    const r = { accuracy01: 1, completeness01: 1, content: { what: 'migration_flight', magnitude: 3, partyIds: ['a', 'a.b'] }, eventRef: 'migration.a.b.a.5' };
    const asOrigin = foldBeliefAxes({ prior: null, groundTruth: gt, reports: [r], subjectId: 'a.b' });
    const asDest = foldBeliefAxes({ prior: null, groundTruth: gt, reports: [r], subjectId: 'a' });
    expect(asOrigin.populationTrendBand).toBeLessThan(0); // 'a.b' is the origin
    expect(asDest.populationTrendBand).toBeGreaterThan(0); // 'a' is the destination
  });
  it('no flight evidence ⇒ carries the prior band (or cold ground truth)', () => {
    const out = foldBeliefAxes({ prior: { populationTrendBand: 2, observanceLabel: 'x:null' }, groundTruth: gt, reports: [], subjectId: 'x' });
    expect(out.populationTrendBand).toBe(2);
  });
});

describe('foldBeliefAxes — the cultural axis (staleness is the feature)', () => {
  const gt = { populationTrendBand: 0, observanceLabel: 'tide:deity.new' };
  const beat = (acc) => ({ accuracy01: acc, completeness01: 1, content: { what: 'tradition_change', partyIds: ['s'] }, eventRef: 'trad.s' });

  it('a fresh faithful culture beat ADOPTS the current true rite', () => {
    const out = foldBeliefAxes({ prior: { observanceLabel: 'ember:deity.old', populationTrendBand: 0 }, groundTruth: gt, reports: [beat(0.9)], subjectId: 's' });
    expect(out.observanceLabel).toBe('tide:deity.new');
  });
  it('a low-fidelity beat does NOT overturn the settled rite', () => {
    const out = foldBeliefAxes({ prior: { observanceLabel: 'ember:deity.old', populationTrendBand: 0 }, groundTruth: gt, reports: [beat(0.3)], subjectId: 's' });
    expect(out.observanceLabel).toBe('ember:deity.old');
  });
  it('no culture beat ⇒ the OLD rite persists (the observer never heard of the rededication)', () => {
    const out = foldBeliefAxes({ prior: { observanceLabel: 'ember:deity.old', populationTrendBand: 0 }, groundTruth: gt, reports: [], subjectId: 's' });
    expect(out.observanceLabel).toBe('ember:deity.old');
  });
  it('cold-start (no prior) adopts the current ground-truth rite', () => {
    const out = foldBeliefAxes({ prior: null, groundTruth: gt, reports: [], subjectId: 's' });
    expect(out.observanceLabel).toBe('tide:deity.new');
  });
});
