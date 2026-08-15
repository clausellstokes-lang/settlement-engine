/**
 * smuggle.integration.test.js — Phase 5.5 mover M7: the commodityFlow ARRIVAL pipeline +
 * dispatch EV-spill. Proves the pure engine wired into the flow:
 *   - DORMANT byte-identity: smuggle absent ⇒ the M6 arrival + interception cut run verbatim;
 *   - the PER-GATE PIPELINE at arrival: SEIZURE (hostile) vs CONFISCATION (contraband) vs
 *     SMUGGLED-through (the trickle delivered) — the ONE roll vs the worst gate;
 *   - CORRUPTION IS THE HINGE: a corrupt (leaky) gate raises the trickle;
 *   - CONSCIENCE gates the seizure TAKE: an evil gate loots, a good one does not;
 *   - the BESIEGED TRICKLE envelope: a besieged town with smugglers gets SOME goods (starves
 *     slower) but never a full resupply (still starves);
 *   - the M6c EV-SPILL: a legally-refused link spills to the criminal channel (smuggle run);
 *   - THE GOODS-CONSERVATION INVARIANT holds through seizure/confiscation/loot.
 */
import { describe, it, expect } from 'vitest';
import {
  advanceCommodityFlow, commodityLinkKey, stockOf, assertGoodsConservation, COMMODITY_TUNING,
} from '../../src/domain/spatial/commodityFlow.js';
import { rankSupplySources } from '../../src/domain/spatial/supplyShipments.js';

const T = COMMODITY_TUNING;

/** Deterministic fork rng (a few LCG warm-up steps after the key hash so the FIRST draw is
 *  well-distributed — the 1-step form correlates the first output with the hash seed). */
function forkRng() {
  return {
    fork(key) {
      let s = 0;
      for (let i = 0; i < key.length; i++) s = (Math.imul(s, 31) + key.charCodeAt(i)) >>> 0;
      s = s || 1;
      for (let k = 0; k < 3; k++) s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return { random() { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; } };
    },
  };
}
/** A fork rng whose smuggle draw is FIXED (banditry gets a neutral pass). */
function fixedSmuggleRng(smuggleDraw) {
  return { fork: (key) => ({ random: () => (String(key).startsWith('smuggle:') ? smuggleDraw : 1) }) };
}

/** P—M—C line: the only road P→C passes THROUGH the gate M (route [P,M,C]). */
function lineDigestPMC() {
  return {
    spatialCanonVersion: 1,
    settlementIds: ['P', 'M', 'C'],
    gates: [{ between: ['P', 'M'], cost: 100 }, { between: ['M', 'C'], cost: 100 }],
    distanceMatrix: { P: { M: 100, C: 200 }, M: { P: 100, C: 100 }, C: { M: 100, P: 200 } },
    tiers: { P: { M: 1, C: 2 }, M: { P: 1, C: 1 }, C: { M: 1, P: 2 } },
  };
}

const worldOn = (extra = {}) => ({ spatialCanonVersion: 1, simulationRules: { commodityFlowEnabled: true }, ...extra });

// A permissive smuggle context (strong network, leaky corrupt gate, bold mover, evil gate
// conscience). Override per test. `contraband` toggles the relational contraband verdict.
function smuggleCtx(over = {}) {
  return {
    networkStrength: () => 0.8,
    corruptionOf: () => 0.6,
    conscienceOf: () => 0,        // an evil gate loots the full conscience-gated take
    boldnessOf: () => 0.9,        // bold ⇒ attempts the run
    isContrabandAt: () => false,
    categoryOf: () => 'raw_material',
    ...over,
  };
}

// An in-transit caravan P→C carrying `carried`, arriving THIS tick (tick 0).
function withInTransit(carried, extra = {}) {
  const key = commodityLinkKey('C', 'smithy', 'iron');
  return worldOn({ spatialLedgers: { supplyShipments: {
    [key]: { institutionId: 'smithy', settlementId: 'C', input: 'iron', sourceId: 'P', arrivalTick: 0, carried, starving: false, ...extra },
  } } });
}
const cLink = (digest) => ({ institutionId: 'smithy', institutionName: 'the smithy', settlementId: 'C', input: 'iron',
  rankedSources: rankSupplySources(digest, 'C', ['P']), bufferWeeks: 0, critical: false });
const KEY = commodityLinkKey('C', 'smithy', 'iron');

describe('M7 — DORMANT byte-identity (smuggle absent ⇒ M6 arrival + interception verbatim)', () => {
  it('a hostile gate CUTS the shipment when smuggle is absent (M2/M6 interception)', () => {
    const digest = lineDigestPMC();
    const ws = withInTransit(8);
    const out = advanceCommodityFlow({
      producers: [], links: [cLink(digest)], worldState: ws, digest, tick: 0, rng: forkRng(),
      hostileToDestinationFor: (_d, gate) => gate === 'M', consumesGood: () => false,
      // NO smuggle ctx ⇒ the M6 path: routeIntercepted cuts the caravan, nothing delivered.
    });
    expect(out.outcomes[KEY].arrived).toBe(false);
    expect(out.outcomes[KEY].smuggleBranch).toBeUndefined();   // M6 outcome shape (no M7 fields)
    expect(stockOf(out.nextStocks, 'M', 'iron', 0)).toBe(0);   // no loot without the smuggle layer
  });

  it('passing smuggle=null is identical to omitting it (peaceful delivery)', () => {
    const digest = lineDigestPMC();
    const base = { producers: [], links: [cLink(digest)], worldState: withInTransit(8), digest, tick: 0, rng: forkRng(), consumesGood: () => false };
    const a = advanceCommodityFlow(base);
    const b = advanceCommodityFlow({ ...base, worldState: withInTransit(8), smuggle: null });
    expect(JSON.stringify(a.nextStocks)).toBe(JSON.stringify(b.nextStocks));
    expect(a.outcomes[KEY].arrived).toBe(true);                // peaceful ⇒ delivered either way
  });
});

describe('M7 — THE PER-GATE PIPELINE at arrival (§II.3-4-e)', () => {
  it('SEIZURE at a hostile gate (detected) — denied to C, conscience-gated loot to M', () => {
    const digest = lineDigestPMC();
    const out = advanceCommodityFlow({
      producers: [], links: [cLink(digest)], worldState: withInTransit(8), digest, tick: 0,
      rng: fixedSmuggleRng(0.99),                              // draw ≥ chance ⇒ DETECTED
      hostileToDestinationFor: (_d, gate) => gate === 'M', consumesGood: () => false,
      smuggle: smuggleCtx({ conscienceOf: () => 0 }),          // evil gate ⇒ loots
    });
    expect(out.outcomes[KEY].smuggleBranch).toBe('seizure');
    expect(out.outcomes[KEY].arrived).toBe(false);            // C got nothing
    expect(out.outcomes[KEY].seizedTake).toBeGreaterThan(0);
    expect(stockOf(out.nextStocks, 'M', 'iron', 0)).toBe(out.outcomes[KEY].seizedTake); // the loot
    expect(assertGoodsConservation(out.accounting)).toBe(true);
  });

  it('CONSCIENCE gates the take: a GOOD gate seizes but loots NOTHING', () => {
    const digest = lineDigestPMC();
    const out = advanceCommodityFlow({
      producers: [], links: [cLink(digest)], worldState: withInTransit(8), digest, tick: 0,
      rng: fixedSmuggleRng(0.99), hostileToDestinationFor: (_d, gate) => gate === 'M', consumesGood: () => false,
      smuggle: smuggleCtx({ conscienceOf: () => 1 }),          // a good/lawful gate
    });
    expect(out.outcomes[KEY].smuggleBranch).toBe('seizure');
    expect(out.outcomes[KEY].seizedTake).toBeUndefined();     // conscience ⇒ no loot
    expect(stockOf(out.nextStocks, 'M', 'iron', 0)).toBe(0);
    expect(assertGoodsConservation(out.accounting)).toBe(true);
  });

  it('CONFISCATION at a contraband gate — freed/destroyed, no loot to the gate', () => {
    const digest = lineDigestPMC();
    const out = advanceCommodityFlow({
      producers: [], links: [cLink(digest)], worldState: withInTransit(8), digest, tick: 0,
      rng: fixedSmuggleRng(0.99),                              // detected
      hostileToDestinationFor: () => false,                   // M is NOT hostile…
      consumesGood: () => false,
      smuggle: smuggleCtx({ isContrabandAt: (gate) => gate === 'M' }), // …but the cargo is contraband here
    });
    expect(out.outcomes[KEY].smuggleBranch).toBe('confiscation');
    expect(out.outcomes[KEY].arrived).toBe(false);
    expect(stockOf(out.nextStocks, 'M', 'iron', 0)).toBe(0);  // confiscated goods are NOT looted
    expect(assertGoodsConservation(out.accounting)).toBe(true);
  });

  it('SMUGGLED THROUGH (roll succeeds) — the trickle DELIVERS despite the hostile gate', () => {
    const digest = lineDigestPMC();
    const out = advanceCommodityFlow({
      producers: [], links: [cLink(digest)], worldState: withInTransit(8), digest, tick: 0,
      rng: fixedSmuggleRng(0.0),                               // draw < chance ⇒ slips through
      hostileToDestinationFor: (_d, gate) => gate === 'M', consumesGood: () => false,
      smuggle: smuggleCtx(),
    });
    expect(out.outcomes[KEY].smuggleBranch).toBe('smuggled');
    expect(out.outcomes[KEY].arrived).toBe(true);             // the goods got through
    expect(stockOf(out.nextStocks, 'C', 'iron', 0)).toBeGreaterThan(T.STOCKPILE_TARGET - T.CONSUMPTION_RATE);
    expect(assertGoodsConservation(out.accounting)).toBe(true);
  });
});

describe('M7 — CORRUPTION IS THE HINGE (a leaky gate raises the trickle)', () => {
  it('a corrupt gate slips a shipment a tight honest gate would seize (same draw)', () => {
    const digest = lineDigestPMC();
    // A draw that sits BETWEEN the honest and corrupt success chances.
    const run = (corruption) => advanceCommodityFlow({
      producers: [], links: [cLink(digest)], worldState: withInTransit(8), digest, tick: 0,
      rng: fixedSmuggleRng(0.45), hostileToDestinationFor: (_d, gate) => gate === 'M', consumesGood: () => false,
      smuggle: smuggleCtx({ corruptionOf: () => corruption }),
    });
    const honest = run(0.0);   // low leak ⇒ seized
    const corrupt = run(1.0);  // high leak ⇒ slips
    expect(honest.outcomes[KEY].smuggleBranch).toBe('seizure');
    expect(corrupt.outcomes[KEY].smuggleBranch).toBe('smuggled');
  });
});

describe('M7 — THE BESIEGED TRICKLE envelope (§II.3-4-f: starves SLOWER, never not-at-all)', () => {
  it('a besieged town with smugglers gets SOME goods; without them, NONE', () => {
    const digest = lineDigestPMC();
    // A stocked producer P; C consumes iron; the gate M is hostile to C (the besieger).
    const producers = () => [{ settlementId: 'P', good: 'iron', rate: 6, cap: 36 }];
    const hostile = (_d, gate) => gate === 'M';
    const run = (smuggle) => {
      let ws = worldOn();
      let delivered = 0;
      let seizures = 0;
      for (let tick = 0; tick < 24; tick++) {
        const out = advanceCommodityFlow({
          producers: producers(), links: [cLink(digest)], worldState: ws, digest, tick, rng: forkRng(),
          hostileToDestinationFor: hostile, consumesGood: () => false, smuggle,
        });
        if (out.outcomes[KEY]?.arrived) delivered += 1;
        if (out.outcomes[KEY]?.smuggleBranch === 'seizure') seizures += 1;
        if (out.changed) ws = worldOn({ spatialLedgers: {
          ...(out.nextStocks ? { commodityStocks: out.nextStocks } : {}),
          ...(out.nextShipments ? { supplyShipments: out.nextShipments } : {}),
        } });
      }
      return { delivered, seizures };
    };
    const withSmuggle = run(smuggleCtx());
    const noSmuggle = run(null);
    // WITHOUT smugglers: the besieger cuts every road ⇒ nothing ever arrives.
    expect(noSmuggle.delivered).toBe(0);
    // WITH smugglers: a TRICKLE gets through (starves slower)…
    expect(withSmuggle.delivered).toBeGreaterThan(0);
    // …but it is PARTIAL — seizures still happen (never a full resupply; still starves).
    expect(withSmuggle.seizures).toBeGreaterThan(0);
  });
});

describe('M7 — THE M6c EV-SPILL (a refused legal link spills to the criminal channel)', () => {
  it('a clear route the legal EV REFUSES is run by smugglers (a marked smuggle dispatch)', () => {
    const digest = lineDigestPMC();
    // A clear, stocked producer P; C is deeply short (cold-start then drain). The legal EV
    // REFUSES (believedDanger high everywhere). The criminal channel spills into the gap.
    const producers = [{ settlementId: 'P', good: 'iron', rate: 6, cap: 36 }];
    const ev = {
      believedDanger: () => 0.95,                 // a besieged/deployed destination — refuse
      caution: () => 1,                           // fully reads the danger
      baseline: () => 1,
      override: () => null,
    };
    // A deeply-short consumer: start its stock near-empty so needPremium is high.
    const ws = worldOn({ spatialLedgers: { commodityStocks: { C: { iron: 4 } } } });
    const out = advanceCommodityFlow({
      producers, links: [cLink(digest)], worldState: ws, digest, tick: 5, rng: forkRng(),
      hostileToDestinationFor: () => false, consumesGood: () => false, ev,
      smuggle: smuggleCtx(),
    });
    // The legal EV refused (the M7 unmet-demand signal), and the criminal channel dispatched.
    expect(out.outcomes[KEY].evRefused).toBe(true);
    expect(out.outcomes[KEY].smuggleDispatched).toBe(true);
    // The dispatched caravan is MARKED a smuggle run (lights the criminal rumor carrier).
    expect(out.nextShipments[KEY]?.smuggle).toBe(true);
    expect(assertGoodsConservation(out.accounting)).toBe(true);
  });

  it('with NO smuggle context, a refused link just persists the shortage (M6c verbatim)', () => {
    const digest = lineDigestPMC();
    const producers = [{ settlementId: 'P', good: 'iron', rate: 6, cap: 36 }];
    const ev = { believedDanger: () => 0.95, caution: () => 1, baseline: () => 1, override: () => null };
    const ws = worldOn({ spatialLedgers: { commodityStocks: { C: { iron: 4 } } } });
    const out = advanceCommodityFlow({
      producers, links: [cLink(digest)], worldState: ws, digest, tick: 5, rng: forkRng(),
      hostileToDestinationFor: () => false, consumesGood: () => false, ev,   // no smuggle
    });
    expect(out.outcomes[KEY].evRefused).toBe(true);
    expect(out.outcomes[KEY].smuggleDispatched).toBeUndefined();
    expect(out.nextShipments?.[KEY]?.smuggle).toBeUndefined();
  });
});
