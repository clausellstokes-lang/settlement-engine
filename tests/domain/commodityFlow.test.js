/**
 * commodityFlow.test.js — Phase 5.5 mover M6a: COMMODITY CONTINUITY.
 *
 * The wave's proof. Gates pinned here:
 *   - FINITE ORIGIN STOCKS: a producer's stock DEPLETES as it ships and REPRODUCES
 *     at its rate; a depleted origin cannot supply until it reproduces;
 *   - QUANTITY STOCKPILES reconcile M2's time buffer (STOCKPILE_TARGET == BUFFER_WEEKS
 *     at CONSUMPTION_RATE 1) — one representation, no double-count;
 *   - EN-ROUTE DEPLETION: a consuming intermediary TAPS the caravan → the destination
 *     receives less;
 *   - THE GOODS-CONSERVATION INVARIANT — before + produced == after + consumed + lost,
 *     EXACT, every tick of a multi-tick run;
 *   - the qualitative BANDS (shortage / adequate / surplus), no numeric prices;
 *   - DORMANT byte-identity (marker absent OR opt-in off ⇒ the layer never runs).
 */
import { describe, it, expect } from 'vitest';
import {
  COMMODITY_TUNING, COMMODITY_BANDS,
  commodityFlowActive, commodityBand, productionRateFor, originStockCap,
  stockOf, assertGoodsConservation, advanceCommodityFlow, commodityLinkKey,
} from '../../src/domain/spatial/commodityFlow.js';
import { SUPPLY_TUNING, rankSupplySources } from '../../src/domain/spatial/supplyShipments.js';

const T = COMMODITY_TUNING;

/** Deterministic fork rng (matches the M2 test surface). */
function forkRng() {
  return {
    fork(key) {
      let s = 0;
      for (let i = 0; i < key.length; i++) s = (Math.imul(s, 31) + key.charCodeAt(i)) >>> 0;
      s = s || 1;
      return { random() { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; } };
    },
  };
}

/** A P—M—C line: producer P → intermediary M → consumer C (route [P,M,C]); plus a
 *  direct P—C alt is deliberately ABSENT so the only road passes through M. */
function lineDigestPMC() {
  return {
    spatialCanonVersion: 1,
    settlementIds: ['P', 'M', 'C'],
    gates: [{ between: ['P', 'M'], cost: 100 }, { between: ['M', 'C'], cost: 100 }],
    distanceMatrix: {
      P: { M: 100, C: 200 }, M: { P: 100, C: 100 }, C: { M: 100, P: 200 },
    },
    tiers: { P: { M: 1, C: 2 }, M: { P: 1, C: 1 }, C: { M: 1, P: 2 } },
  };
}

/** A simple P—C direct digest (no intermediary). */
function directDigest(ids = ['P', 'C']) {
  const [p, c] = ids;
  return {
    spatialCanonVersion: 1,
    settlementIds: ids,
    gates: [{ between: [p, c], cost: 150 }],
    distanceMatrix: { [p]: { [c]: 150 }, [c]: { [p]: 150 } },
    tiers: { [p]: { [c]: 1 }, [c]: { [p]: 1 } },
  };
}

const worldOn = (extra = {}) => ({ spatialCanonVersion: 1, simulationRules: { commodityFlowEnabled: true }, ...extra });

describe('M6a — the activation gate (marker + opt-in; the pre-M6a byte-identity seam)', () => {
  it('is LIVE only under the marker AND the commodity-flow opt-in', () => {
    expect(commodityFlowActive(null)).toBe(false);
    expect(commodityFlowActive({})).toBe(false);
    expect(commodityFlowActive({ spatialCanonVersion: 1 })).toBe(false);                       // marker, no opt-in ⇒ M2 path
    expect(commodityFlowActive({ spatialCanonVersion: 1, simulationRules: {} })).toBe(false);
    expect(commodityFlowActive({ simulationRules: { commodityFlowEnabled: true } })).toBe(false); // opt-in, no marker
    expect(commodityFlowActive(worldOn())).toBe(true);
  });
});

describe('M6a — the qualitative bands (no numeric prices)', () => {
  it('shortage below SHORTAGE_FRAC·target; surplus above SURPLUS_FRAC·target; else adequate', () => {
    const tgt = T.STOCKPILE_TARGET; // 8
    expect(commodityBand(0, tgt)).toBe(COMMODITY_BANDS.SHORTAGE);
    expect(commodityBand(T.SHORTAGE_FRAC * tgt - 0.1, tgt)).toBe(COMMODITY_BANDS.SHORTAGE);
    expect(commodityBand(tgt, tgt)).toBe(COMMODITY_BANDS.ADEQUATE);
    expect(commodityBand(T.SURPLUS_FRAC * tgt + 0.1, tgt)).toBe(COMMODITY_BANDS.SURPLUS);
    // The vocabulary is exactly the three bands — no price ever surfaces.
    expect(Object.values(COMMODITY_BANDS).sort()).toEqual(['adequate', 'shortage', 'surplus']);
  });
});

describe('M6a — production rate from activeChains (finite origin fountains)', () => {
  it('floors for a bare exporter; scales with producing-chain count', () => {
    expect(productionRateFor({})).toBe(T.PRODUCTION_FLOOR);
    expect(productionRateFor({ producingChainCount: 0 })).toBe(T.PRODUCTION_FLOOR);
    expect(productionRateFor({ producingChainCount: 2 })).toBe(2 * T.PRODUCTION_PER_CHAIN);
    expect(originStockCap(productionRateFor({ producingChainCount: 1 }))).toBeGreaterThan(0);
  });
});

describe('M6a — the time-buffer → quantity-stock reconciliation (no double-count)', () => {
  it('STOCKPILE_TARGET equals M2 BUFFER_WEEKS at CONSUMPTION_RATE 1 (the anchor)', () => {
    // The quantity IS the weeks-of-buffer at the reconciliation boundary.
    expect(T.STOCKPILE_TARGET).toBe(SUPPLY_TUNING.BUFFER_WEEKS);
    expect(T.CONSUMPTION_RATE).toBe(1);
  });

  it('a first-seen consumer cold-starts at its target and drains CONSUMPTION_RATE/tick', () => {
    const digest = directDigest();
    const link = { institutionId: 'smithy', institutionName: 'the smithy', settlementId: 'C', input: 'iron',
      rankedSources: rankSupplySources(digest, 'C', ['P']), bufferWeeks: 0, critical: true };
    const producers = [{ settlementId: 'P', good: 'iron', rate: T.PRODUCTION_FLOOR, cap: originStockCap(T.PRODUCTION_FLOOR) }];
    const out = advanceCommodityFlow({ producers, links: [link], worldState: worldOn(), digest, tick: 0, rng: forkRng(),
      consumesGood: () => false });
    // C cold-started at STOCKPILE_TARGET, drained CONSUMPTION_RATE this tick.
    expect(stockOf(out.nextStocks, 'C', 'iron', null)).toBe(T.STOCKPILE_TARGET - T.CONSUMPTION_RATE);
  });
});

describe('M6a — FINITE ORIGIN STOCKS: depletes on shipping, reproduces at its rate', () => {
  it('an origin below cap REPRODUCES toward the cap each tick (no shipping)', () => {
    const digest = directDigest();
    const producers = [{ settlementId: 'P', good: 'iron', rate: 3, cap: 18 }];
    // Seed P below cap; no consumers ⇒ pure reproduction.
    let ws = worldOn({ spatialLedgers: { commodityStocks: { P: { iron: 5 } } } });
    const out = advanceCommodityFlow({ producers, links: [], worldState: ws, digest, tick: 0, rng: forkRng() });
    expect(stockOf(out.nextStocks, 'P', 'iron', null)).toBe(8); // 5 + rate 3
  });

  it('a DEPLETED origin cannot supply a second buyer; the reproduced origin then can', () => {
    // One small-cap producer P (makes only enough for ONE caravan/tick) feeds two empty
    // buyers ca, cb (ca sorts first). ca drains the origin → cb gets NO caravan this tick,
    // only a starving latch (the depleted origin cannot supply it).
    const d3 = {
      spatialCanonVersion: 1, settlementIds: ['P', 'ca', 'cb'],
      gates: [{ between: ['P', 'ca'], cost: 100 }, { between: ['P', 'cb'], cost: 100 }],
      distanceMatrix: { P: { ca: 100, cb: 100 }, ca: { P: 100, cb: 200 }, cb: { P: 100, ca: 200 } },
      tiers: { P: { ca: 1, cb: 1 }, ca: { P: 1, cb: 2 }, cb: { P: 1, ca: 2 } },
    };
    const producers = [{ settlementId: 'P', good: 'iron', rate: 3, cap: 3 }]; // cap 3 ⇒ one caravan
    const mkLink = (sid, name) => ({ institutionId: 's', institutionName: name, settlementId: sid, input: 'iron',
      rankedSources: rankSupplySources(d3, sid, ['P']), bufferWeeks: 0, critical: false });
    const t0 = advanceCommodityFlow({ producers, links: [mkLink('ca', 'Smithy A'), mkLink('cb', 'Smithy B')],
      worldState: worldOn({ spatialLedgers: { commodityStocks: { ca: { iron: 0 }, cb: { iron: 0 }, P: { iron: 0 } } } }),
      digest: d3, tick: 0, rng: forkRng() });
    const carriesFrom = (out, sid) => (out.nextShipments || {})[commodityLinkKey(sid, 's', 'iron')]?.carried > 0;
    expect(carriesFrom(t0, 'ca')).toBe(true);   // ca sourced the origin's whole output
    expect(carriesFrom(t0, 'cb')).toBe(false);  // cb could not — the origin was depleted
    expect(stockOf(t0.nextStocks, 'P', 'iron', null)).toBe(0); // fully depleted by ca

    // With ca's demand elsewhere, the REPRODUCED origin (0 → rate) can supply cb.
    const tRepro = advanceCommodityFlow({ producers, links: [mkLink('cb', 'Smithy B')],
      worldState: worldOn({ spatialLedgers: { commodityStocks: { P: { iron: 0 }, cb: { iron: 0 } } } }),
      digest: d3, tick: 1, rng: forkRng() });
    expect(carriesFrom(tRepro, 'cb')).toBe(true); // once it reproduces, it ships
  });
});

describe('M6a — EN-ROUTE DEPLETION: a consuming intermediary taps the caravan', () => {
  function tapRun(intermediaryConsumes) {
    const digest = lineDigestPMC();
    const key = commodityLinkKey('C', 'smithy', 'iron');
    const links = [{ institutionId: 'smithy', institutionName: 'the smithy', settlementId: 'C', input: 'iron',
      rankedSources: rankSupplySources(digest, 'C', ['P']), bufferWeeks: 0, critical: true }];
    const producers = [{ settlementId: 'P', good: 'iron', rate: 3, cap: 18 }];
    // A caravan already in transit P→C, arriving THIS tick, carrying 8 units. Peaceful
    // (no danger ⇒ no banditry) so the ONLY delta is the intermediary tap.
    const ws = worldOn({ spatialLedgers: { supplyShipments: {
      [key]: { institutionId: 'smithy', settlementId: 'C', input: 'iron', sourceId: 'P', arrivalTick: 0, carried: 8, starving: false },
    } } });
    return advanceCommodityFlow({ producers, links, worldState: ws, digest, tick: 0, rng: forkRng(),
      // M (the route intermediary) consumes iron only in the tapping run.
      consumesGood: (sid, gid) => gid === 'iron' && (sid === 'C' || (intermediaryConsumes && sid === 'M')) });
  }

  it('the destination receives LESS when an intermediary on the route consumes the good', () => {
    const tapped = tapRun(true);
    const untapped = tapRun(false);
    const cTapped = stockOf(tapped.nextStocks, 'C', 'iron', null);
    const cUntapped = stockOf(untapped.nextStocks, 'C', 'iron', null);
    expect(cTapped).toBeLessThan(cUntapped);              // the caravan was tapped en route
    expect(cUntapped - cTapped).toBe(T.TAP_CAP);          // M took exactly its capped share
    // M's own stockpile GAINED the tapped goods (conservation — nothing vanished).
    expect(stockOf(tapped.nextStocks, 'M', 'iron', 0)).toBe(T.TAP_CAP);
  });
});

describe('M6a — THE GOODS-CONSERVATION INVARIANT (multi-tick, exact every tick)', () => {
  it('assertGoodsConservation catches an imbalance', () => {
    expect(assertGoodsConservation({ before: 10, produced: 5, after: 12, consumed: 3, lost: 0 })).toBe(true);
    expect(assertGoodsConservation({ before: 10, produced: 5, after: 12, consumed: 3, lost: 1 })).toBe(false);
    expect(assertGoodsConservation(null)).toBe(false);
  });

  it('before + produced == after + consumed + lost, EXACT, over a 24-tick war+trade loop', () => {
    // A P—M—C line under a mid-run severance (a besieged origin) so caravans get CUT
    // (their carried load → lost) — the invariant must still balance through it.
    const digest = lineDigestPMC();
    const producers = [{ settlementId: 'P', good: 'iron', rate: 4, cap: 24 }];
    const links = [
      { institutionId: 'smithy', institutionName: 'the smithy', settlementId: 'C', input: 'iron', rankedSources: rankSupplySources(digest, 'C', ['P']), bufferWeeks: 0, critical: false },
      { institutionId: 'mill', institutionName: 'the mill', settlementId: 'M', input: 'iron', rankedSources: rankSupplySources(digest, 'M', ['P']), bufferWeeks: 0, critical: false },
    ];
    let ws = worldOn();
    let initial = null;
    let sumProduced = 0, sumConsumed = 0, sumLost = 0;
    for (let tick = 0; tick < 24; tick++) {
      const out = advanceCommodityFlow({
        producers, links, worldState: ws, digest, tick, rng: forkRng(),
        // A besieged origin for a mid-run window (caravans in transit get cut → lost).
        sourceSeveredFor: (_d, s) => tick >= 6 && tick <= 10 && s === 'P',
        consumesGood: (sid, gid) => gid === 'iron' && (sid === 'C' || sid === 'M'),
      });
      // THE PER-TICK INVARIANT — exact, every tick.
      expect(assertGoodsConservation(out.accounting)).toBe(true);
      if (initial === null) initial = out.accounting.before; // the cold-start `initial` term
      sumProduced += out.accounting.produced;
      sumConsumed += out.accounting.consumed;
      sumLost += out.accounting.lost;
      ws = worldOn({ spatialLedgers: { commodityStocks: out.nextStocks, supplyShipments: out.nextShipments } });
    }
    // THE CUMULATIVE FORM (the spec's Σproduced == Σin-transit + Σconsumed + Σstockpiled,
    // with the initial-stock + loss sinks made explicit): read the final state.
    const finalStocks = (ws.spatialLedgers.commodityStocks) || {};
    const finalShip = (ws.spatialLedgers.supplyShipments) || {};
    let stockpiled = 0;
    for (const sid of Object.keys(finalStocks)) for (const gid of Object.keys(finalStocks[sid])) stockpiled += finalStocks[sid][gid];
    let inTransit = 0;
    for (const k of Object.keys(finalShip)) inTransit += Math.max(0, Math.floor(finalShip[k].carried || 0));
    expect(initial + sumProduced).toBe(stockpiled + inTransit + sumConsumed + sumLost);
  });

  it('is deterministic: two runs of the same fixture yield byte-identical ledgers', () => {
    const digest = lineDigestPMC();
    const producers = [{ settlementId: 'P', good: 'iron', rate: 4, cap: 24 }];
    const links = [{ institutionId: 'smithy', settlementId: 'C', input: 'iron', rankedSources: rankSupplySources(digest, 'C', ['P']), bufferWeeks: 0, critical: false }];
    const run = () => {
      let ws = worldOn();
      const snaps = [];
      for (let tick = 0; tick < 12; tick++) {
        const out = advanceCommodityFlow({ producers, links, worldState: ws, digest, tick, rng: forkRng(), consumesGood: (sid, gid) => gid === 'iron' && sid === 'C' });
        ws = worldOn({ spatialLedgers: { commodityStocks: out.nextStocks, supplyShipments: out.nextShipments } });
        snaps.push(JSON.stringify([out.nextStocks, out.nextShipments]));
      }
      return snaps.join('|');
    };
    expect(run()).toBe(run());
  });
});

describe('M6a — DORMANT byte-identity (the caller gate)', () => {
  it('commodityFlowActive is the sole switch; off ⇒ M2 path (never both)', () => {
    // The engine itself is pure; the DORMANT proof is that the kernel never invokes it
    // off the gate. Here we assert the gate predicate is the single source of truth.
    expect(commodityFlowActive({ spatialCanonVersion: 1 })).toBe(false);            // M2 path
    expect(commodityFlowActive({ spatialCanonVersion: 1, simulationRules: { commodityFlowEnabled: true } })).toBe(true); // M6a path
  });
});
