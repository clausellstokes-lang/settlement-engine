/**
 * roadsKernel.test.js — THE ROADS mover seam (R-1b skeleton): the dormancy gate, the
 * spatial-canon gate, and the composed-chain pass-through. DESIGN_THE_ROADS.md §1/§16.
 *
 * The lit body is a structural no-op under R-1 (genesis lands in R-2), so these pins prove
 * the GATES + the SEAM, not yet mission behaviour (the roads dormancy golden's lit
 * anti-vacuity block covers that once genesis exists).
 */
import { describe, it, expect } from 'vitest';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';

const litSpatial = (extraRules = {}) => ({
  simulationRules: { roadsEnabled: true, ...extraRules },
  spatialCanonVersion: 1,
  spatialDigest: { distanceMatrix: { a: { a: 0 } } },
});

describe('roads mover — the dormancy gate (§1 law 2)', () => {
  it('flag absent ⇒ a complete no-op (same references, changed:false)', () => {
    const worldState = { simulationRules: { warLayerEnabled: true } };
    const updates = [{ saveId: 's', settlement: {} }];
    const r = advanceRoads({ worldState, settlementUpdates: updates, tick: 3, now: null });
    expect(r.changed).toBe(false);
    expect(r.worldState).toBe(worldState);
    expect(r.settlementUpdates).toBe(updates);
    expect(r.newsEntries).toEqual([]);
  });
});

describe('roads mover — the spatial-canon gate (aspatial/teleport dormant, §16)', () => {
  it('flag lit but NO spatial digest ⇒ dormant no-op (byte-identical)', () => {
    const worldState = { simulationRules: { roadsEnabled: true } }; // no spatialCanonVersion
    const updates = [{ saveId: 's', settlement: {} }];
    const r = advanceRoads({ worldState, settlementUpdates: updates, tick: 3, now: null });
    expect(r.changed).toBe(false);
    expect(r.settlementUpdates).toBe(updates);
    expect(r.newsEntries).toEqual([]);
  });
});

describe('roads mover — the R-1 skeleton (lit + spatial ⇒ genesis lands in R-2)', () => {
  it('lit + spatial ⇒ the lit path runs and is a structural no-op (changed:false)', () => {
    const worldState = litSpatial();
    const updates = [{ saveId: 's', settlement: {} }];
    const r = advanceRoads({ snapshot: { settlements: [] }, worldState, settlementUpdates: updates, graph: {}, tick: 3, now: null });
    expect(r.changed).toBe(false);
    expect(r.newsEntries).toEqual([]);
  });
  it('tolerates a null/garbage args object without throwing', () => {
    expect(() => advanceRoads(null)).not.toThrow();
    expect(advanceRoads(null).changed).toBe(false);
    expect(advanceRoads({}).changed).toBe(false);
  });
});
