/**
 * dispatchEV.integration.test.js — M6c THE DISPATCH EV, wired through the M6a
 * commodity-flow orchestrator (advanceCommodityFlow). The pure decision math is proven
 * in dispatchEV.test.js; THIS drives it through the real dispatch/arrival loop:
 *   - EV present but PEACEFUL (danger 0) ⇒ dispatch BYTE-IDENTICAL to ev-absent (M6a),
 *     and NO appetite / willingness ledger materializes;
 *   - danger beats premium ⇒ the caravan REFUSES, the shortage PERSISTS (evRefused —
 *     the M7 unmet-demand seam), and a willingness latch materializes;
 *   - a DEEP shortage + a bold merchant runs even a siege (the blockade-runner);
 *   - a RISKY delivery that ARRIVES emboldens its origin; a RISKY caravan CUT cows it;
 *   - an EXTRACTIVE occupier DAMPENS (trade flows), a siege refuses — at equal premium;
 *   - the belief-gated deterrent (a STALE siege belief refuses a recovered town);
 *   - a multi-year soak: appetite stays BOUNDED, a cut-off town gets INTERMITTENT bold
 *     runs (no dispatch deadlock), deterministic.
 */
import { describe, it, expect } from 'vitest';
import { advanceCommodityFlow, commodityLinkKey } from '../../src/domain/spatial/commodityFlow.js';
import { believedDestinationDanger, DISPATCH_TUNING, occupationDangerTerm } from '../../src/domain/spatial/dispatchEV.js';
import { rankSupplySources } from '../../src/domain/spatial/supplyShipments.js';

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

function directDigest(ids = ['P', 'C']) {
  const [p, c] = ids;
  return {
    spatialCanonVersion: 1, settlementIds: ids,
    gates: [{ between: [p, c], cost: 150 }],
    distanceMatrix: { [p]: { [c]: 150 }, [c]: { [p]: 150 } },
    tiers: { [p]: { [c]: 1 }, [c]: { [p]: 1 } },
  };
}

const worldOn = (extra = {}) => ({ spatialCanonVersion: 1, simulationRules: { commodityFlowEnabled: true }, ...extra });
const KEY = commodityLinkKey('C', 'smithy', 'iron');
const linkFor = (digest) => ({ institutionId: 'smithy', institutionName: 'the smithy', settlementId: 'C', input: 'iron',
  rankedSources: rankSupplySources(digest, 'C', ['P']), bufferWeeks: 0, critical: false });
const producersFor = () => [{ settlementId: 'P', good: 'iron', rate: 8, cap: 48 }];
// A flat EV context (constant reads) — the orchestrator wiring under test.
const evCtx = ({ danger = 0, caution = 1, baseline = 1, override = null }) => ({
  believedDanger: () => danger, caution: () => caution, baseline: () => baseline,
  override: () => override,
});

describe('M6c integration — PEACEFUL is byte-identical to M6a (the gate)', () => {
  it('danger 0 everywhere ⇒ the SAME dispatch as ev-absent, and no EV ledgers', () => {
    const digest = directDigest();
    const seed = () => worldOn({ spatialLedgers: { commodityStocks: { C: { iron: 1 }, P: { iron: 48 } } } }); // C short enough to draw a caravan
    const args = { producers: producersFor(), links: [linkFor(digest)], digest, tick: 0, rng: forkRng(), consumesGood: () => false };
    const m6a = advanceCommodityFlow({ ...args, worldState: seed() });                       // no ev (M6a path)
    const m6c = advanceCommodityFlow({ ...args, worldState: seed(), ev: evCtx({ danger: 0 }) }); // ev, peaceful
    expect(JSON.stringify(m6c.nextStocks)).toBe(JSON.stringify(m6a.nextStocks));
    expect(JSON.stringify(m6c.nextShipments)).toBe(JSON.stringify(m6a.nextShipments));
    expect(m6c.nextAppetite).toBeNull();      // baseline everywhere, no risky history ⇒ absent
    expect(m6c.nextWillingness).toBeNull();   // always willing ⇒ absent
    // The caravan DID dispatch (peaceful ⇒ dispatch whenever short).
    expect(m6c.nextShipments?.[KEY]?.carried).toBeGreaterThan(0);
  });
});

describe('M6c integration — refusal, the M7 seam, and the blockade-runner', () => {
  it('danger beats premium ⇒ REFUSE: no caravan, the shortage persists, willingness latches', () => {
    const digest = directDigest();
    // A cautious town with a weak guild (low baseline) starves under a siege rather than
    // run it — even a deep shortage's premium does not beat the near-absolute danger.
    const out = advanceCommodityFlow({
      producers: producersFor(), links: [linkFor(digest)],
      worldState: worldOn({ spatialLedgers: { commodityStocks: { C: { iron: 0 }, P: { iron: 48 } } } }),
      digest, tick: 0, rng: forkRng(), consumesGood: () => false,
      ev: evCtx({ danger: DISPATCH_TUNING.DANGER_SIEGE, baseline: 0.5 }),
    });
    expect(out.nextShipments?.[KEY]).toBeUndefined();        // the caravan did NOT go
    expect(out.outcomes[KEY].evRefused).toBe(true);          // the M7 unmet-demand signal
    expect(out.outcomes[KEY].believedDanger).toBeCloseTo(DISPATCH_TUNING.DANGER_SIEGE, 5);
    expect(out.outcomes[KEY].stock).toBeLessThan(out.outcomes[KEY].target); // unmet demand persists
    expect(out.outcomes[KEY].band).toBe('shortage');          // the shortage PERSISTS
    expect(out.nextWillingness?.[KEY]?.phase).toBe('refusing');
  });

  it('BLOCKADE-RUNNER: a deep shortage + a bold merchant runs even a siege', () => {
    const digest = directDigest();
    const out = advanceCommodityFlow({
      producers: producersFor(), links: [linkFor(digest)],
      worldState: worldOn({ spatialLedgers: { commodityStocks: { C: { iron: 0 }, P: { iron: 48 } } } }), // C cut off
      digest, tick: 0, rng: forkRng(), consumesGood: () => false,
      ev: evCtx({ danger: DISPATCH_TUNING.DANGER_SIEGE, baseline: DISPATCH_TUNING.APPETITE_CEIL }),
    });
    expect(out.nextShipments?.[KEY]?.carried).toBeGreaterThan(0); // the boldest merchant runs the blockade
    expect(out.nextShipments[KEY].ranDanger).toBeGreaterThanOrEqual(DISPATCH_TUNING.RISKY_DANGER_FLOOR);
  });
});

describe('M6c integration — the dynamic appetite reacts to real outcomes', () => {
  it('a RISKY delivery that ARRIVES emboldens its origin (receipted event + ledger)', () => {
    const digest = directDigest();
    const ws = worldOn({ spatialLedgers: {
      commodityStocks: { C: { iron: 0 }, P: { iron: 48 } },
      supplyShipments: { [KEY]: { institutionId: 'smithy', settlementId: 'C', input: 'iron', sourceId: 'P', arrivalTick: 0, carried: 8, starving: false, ranDanger: 0.9 } },
    } });
    const out = advanceCommodityFlow({
      producers: producersFor(), links: [linkFor(digest)], worldState: ws, digest, tick: 0, rng: forkRng(),
      consumesGood: () => false, ev: evCtx({ danger: 0.9 }),
    });
    expect(out.emboldenEvents).toContainEqual({ originId: 'P', destId: 'C' });
    expect(out.nextAppetite?.P?.level).toBeGreaterThan(1.0);   // emboldened above baseline
  });

  it('a RISKY caravan CUT cows its origin (loss aversion)', () => {
    const digest = directDigest();
    const ws = worldOn({ spatialLedgers: {
      commodityStocks: { C: { iron: 4 }, P: { iron: 48 } },
      supplyShipments: { [KEY]: { institutionId: 'smithy', settlementId: 'C', input: 'iron', sourceId: 'P', arrivalTick: 5, carried: 8, starving: false, ranDanger: 0.9 } },
    } });
    const out = advanceCommodityFlow({
      producers: producersFor(), links: [linkFor(digest)], worldState: ws, digest, tick: 0, rng: forkRng(),
      consumesGood: () => false, ev: evCtx({ danger: 0.9 }),
      sourceSeveredFor: (_d, s) => s === 'P', // the source is besieged ⇒ the caravan is CUT
    });
    expect(out.emboldenEvents).toHaveLength(0);
    expect(out.nextAppetite?.P?.level).toBeLessThan(1.0);      // cowed below baseline by the loss
  });
});

describe('M6c integration — extractive dampens; the belief-gated deterrent', () => {
  it('an EXTRACTIVE occupier DAMPENS (trade flows) where a siege REFUSES — same premium', () => {
    const digest = directDigest();
    const seed = () => worldOn({ spatialLedgers: { commodityStocks: { C: { iron: 4 }, P: { iron: 48 } } } });
    const base = { producers: producersFor(), links: [linkFor(digest)], digest, tick: 0, rng: forkRng(), consumesGood: () => false };
    const extractive = advanceCommodityFlow({ ...base, worldState: seed(), ev: evCtx({ danger: occupationDangerTerm('extractive') }) });
    const siege = advanceCommodityFlow({ ...base, worldState: seed(), ev: evCtx({ danger: DISPATCH_TUNING.DANGER_SIEGE }) });
    expect(extractive.nextShipments?.[KEY]?.carried).toBeGreaterThan(0); // dampened ⇒ the caravan still runs
    expect(siege.nextShipments?.[KEY]).toBeUndefined();                  // near-absolute ⇒ it refuses
    expect(siege.outcomes[KEY].evRefused).toBe(true);
  });

  it('a STALE siege belief REFUSES a recovered town; a fresh-safe belief dispatches', () => {
    const digest = directDigest();
    // The believed danger is read through the REAL belief selector (origin P about dest C).
    const mkWs = (rec) => worldOn({ simulationRules: { commodityFlowEnabled: true, infoMode: 'perfect_delayed' },
      spatialLedgers: { commodityStocks: { C: { iron: 4 }, P: { iron: 48 } }, beliefMaps: { P: { seat: { C: rec } } } } });
    const staleSiege = { readiness: 1, strengthBand: 3, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 0.9, lastUpdateTick: 0 };
    const freshSafe = { readiness: 0, strengthBand: 2, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 0.9, lastUpdateTick: 0 };
    const evFor = (ws) => ({ believedDanger: (o, d) => believedDestinationDanger(o, d, ws, { besieged: false }), caution: () => 1, baseline: () => 1 });
    const base = { producers: producersFor(), links: [linkFor(digest)], digest, tick: 0, rng: forkRng(), consumesGood: () => false };
    const wsStale = mkWs(staleSiege);
    const wsFresh = mkWs(freshSafe);
    const stale = advanceCommodityFlow({ ...base, worldState: wsStale, ev: evFor(wsStale) });
    const fresh = advanceCommodityFlow({ ...base, worldState: wsFresh, ev: evFor(wsFresh) });
    expect(stale.nextShipments?.[KEY]).toBeUndefined();          // the stale rumor deters
    expect(fresh.nextShipments?.[KEY]?.carried).toBeGreaterThan(0); // the recovered truth trades
  });
});

describe('M6c integration — the multi-year trade-under-danger soak', () => {
  it('appetite stays BOUNDED; a cut-off town gets INTERMITTENT bold runs (no deadlock); deterministic', () => {
    const digest = directDigest();
    const run = () => {
      let ws = worldOn({ spatialLedgers: { commodityStocks: { C: { iron: 8 }, P: { iron: 48 } } } });
      let dispatches = 0;
      const levels = [];
      for (let tick = 0; tick < 120; tick++) {
        const prevShip = ws.spatialLedgers?.supplyShipments?.[KEY]?.carried > 0;
        const out = advanceCommodityFlow({
          producers: producersFor(), links: [linkFor(digest)], worldState: ws, digest, tick, rng: forkRng(),
          consumesGood: () => false,
          // A persistent believed siege at a deeply-needy town — the emergent tension.
          ev: evCtx({ danger: 0.9, baseline: 1.0 }),
        });
        const nowShip = out.nextShipments?.[KEY]?.carried > 0;
        if (nowShip && !prevShip) dispatches += 1;             // a NEW caravan set out this tick
        const lvl = out.nextAppetite?.P?.level;
        if (lvl != null) levels.push(lvl);
        ws = worldOn({ spatialLedgers: {
          ...(out.nextStocks ? { commodityStocks: out.nextStocks } : {}),
          ...(out.nextShipments ? { supplyShipments: out.nextShipments } : {}),
          ...(out.nextAppetite ? { merchantAppetite: out.nextAppetite } : {}),
          ...(out.nextWillingness ? { dispatchWillingness: out.nextWillingness } : {}),
        } });
      }
      return { dispatches, levels };
    };
    const a = run();
    const b = run();
    // INTERMITTENT — the cut-off town is neither perpetually starved (deadlock) nor
    // trivially fed every tick: some bold runs get through.
    expect(a.dispatches).toBeGreaterThan(0);
    expect(a.dispatches).toBeLessThan(120);
    // BOUNDED — every persisted appetite scalar sits within the envelope.
    for (const lvl of a.levels) {
      expect(lvl).toBeGreaterThanOrEqual(DISPATCH_TUNING.APPETITE_FLOOR);
      expect(lvl).toBeLessThanOrEqual(DISPATCH_TUNING.APPETITE_CEIL);
    }
    // DETERMINISTIC — the whole soak replays identically.
    expect(a.dispatches).toBe(b.dispatches);
    expect(JSON.stringify(a.levels)).toBe(JSON.stringify(b.levels));
  });
});
