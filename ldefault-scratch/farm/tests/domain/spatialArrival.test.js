/**
 * spatialArrival.test.js — Phase 5.5 MODULATION item 4, the propagation arrival
 * queue (park + drain), a PURE module.
 *
 * Proves the latency-queue properties the brief's gates name:
 *   - LOCAL (same-settlement) impacts are never delayed (pass through);
 *   - unmapped / unreachable pairs pass through (aspatial instant path);
 *   - a cross-settlement impact is parked at tick + hopWeeks and released when due;
 *   - drain application order is stable (codepoint by impact id);
 *   - parking + draining is deterministic across runs;
 *   - the ledger is bounded (SPATIAL_ARRIVAL_MAX), keeping the soonest arrivals.
 */
import { describe, expect, it } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { hopWeeks } from '../../src/domain/spatial/distanceRead.js';
import { parkArrivals, drainDueArrivals, enforceLimit, SPATIAL_ARRIVAL_MAX } from '../../src/domain/spatial/spatialArrival.js';

function fixtureDigest(count = 8) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  return buildSpatialDigest({ pack, placements: placeSettlements(pack, count) });
}

const impact = (id, source, target) => ({
  id, sourceSettlementId: source, targetSettlementId: target,
  kind: 'import_shortage', severity: 0.5, delayTicks: 1, status: 'queued',
});

describe('MODULATION — spatialArrival park/drain', () => {
  it('parks cross-settlement impacts at tick + hopWeeks; passes through local/unmapped', () => {
    const d = fixtureDigest();
    const [a, b] = d.settlementIds;
    const impacts = [
      impact('i.cross', a, b),          // cross-settlement ⇒ parked
      impact('i.local', a, a),          // same settlement ⇒ passthrough
      impact('i.unmapped', a, 'ghost'), // unmapped target ⇒ passthrough
    ];
    const { next, passthrough } = parkArrivals(undefined, impacts, { digest: d, tick: 10 });
    expect(passthrough.map((i) => i.id).sort()).toEqual(['i.local', 'i.unmapped']);
    expect(Object.keys(next)).toEqual(['i.cross']);
    expect(next['i.cross'].arrivalTick).toBe(10 + hopWeeks(d, a, b));
    expect(next['i.cross'].impact.delayTicks).toBe(0); // release-ready
  });

  it('drains only due arrivals, in codepoint id order', () => {
    const d = fixtureDigest();
    const [a, b, c] = d.settlementIds;
    let ledger = {};
    // Hand-place three arrivals at different ticks + ids (out of order).
    ledger = parkArrivals(ledger, [impact('z.first', a, b)], { digest: d, tick: 0 }).next;
    ledger['a.second'] = { arrivalTick: 5, targetId: c, sourceId: a, impact: impact('a.second', a, c) };
    ledger['m.future'] = { arrivalTick: 99, targetId: b, sourceId: a, impact: impact('m.future', a, b) };
    const drain = drainDueArrivals(ledger, 5);
    // Both z.first (arrival ≤ 5) and a.second (5) are due; m.future stays.
    expect(drain.due.map((i) => i.id)).toEqual(['a.second', 'z.first']); // codepoint order
    expect(Object.keys(drain.next)).toEqual(['m.future']);
  });

  it('is deterministic across identical runs', () => {
    const d = fixtureDigest();
    const [a, b, c] = d.settlementIds;
    const impacts = [impact('i2', a, c), impact('i1', a, b), impact('i0', b, c)];
    const run = () => {
      const parked = parkArrivals(undefined, impacts, { digest: d, tick: 3 });
      return JSON.stringify(parked.next);
    };
    expect(run()).toBe(run());
  });

  it('bounds the ledger to SPATIAL_ARRIVAL_MAX, keeping the soonest arrivals', () => {
    /** @type {Record<string, any>} */
    const big = {};
    for (let i = 0; i < SPATIAL_ARRIVAL_MAX + 20; i++) {
      big[`k${String(i).padStart(4, '0')}`] = { arrivalTick: i, targetId: 't', sourceId: 's', impact: { id: `k${i}` } };
    }
    const limited = enforceLimit(big);
    expect(Object.keys(limited).length).toBe(SPATIAL_ARRIVAL_MAX);
    // The farthest-arriving entries (highest arrivalTick) are dropped.
    expect(limited[`k${String(SPATIAL_ARRIVAL_MAX + 19).padStart(4, '0')}`]).toBeUndefined();
    expect(limited['k0000']).toBeDefined();
  });

  it('an empty park leaves nothing to materialize (dormancy)', () => {
    const d = fixtureDigest();
    const { next, passthrough } = parkArrivals(undefined, [], { digest: d, tick: 0 });
    expect(Object.keys(next)).toEqual([]);
    expect(passthrough).toEqual([]);
  });
});
