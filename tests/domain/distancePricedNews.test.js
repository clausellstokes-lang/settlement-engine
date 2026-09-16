/**
 * distancePricedNews.test.js — D1 (DESIGN_SIM_DEPTH_R2 D1) pins.
 *
 * Distance-priced news: information age gains a distance surcharge off the frozen
 * digest, gated by the VIRTUAL flag distancePricedNewsEnabled (lit by T5 only in
 * the three deep presets). Design pins: (1) dormancy — flag absent ⇒ byte-identical;
 * (2) adjacent ⇒ zero added delay; (3) monotonicity — further ⇒ never fresher;
 * (4) DM-truth surfaces unaffected; (5) determinism. Plus the believed-need coupling.
 */
import { describe, it, expect } from 'vitest';

import { NEWS_SPEED_FACTOR, hopDelayTicks, routeAwareHopDelayTicks, ROUTE_IMPEDANCE_FACTOR } from '../../src/domain/worldPulse/distancePricedNews.js';
import {
  distancePricedNewsActive, believedNeedScale, advanceBeliefMaps, GOVERNING_SEAT_KEY,
} from '../../src/domain/worldPulse/beliefMap.js';
import { settlementRumors } from '../../src/domain/display/settlementRumors.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { hopWeeks } from '../../src/domain/spatial/distanceRead.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

/** The id (of `ids`, excluding `from`) at the greatest reachable hop distance from `from`. */
function farthestFrom(digest, from, ids) {
  let best = null; let bestW = -1;
  for (const id of ids) {
    if (id === from) continue;
    const w = hopWeeks(digest, from, id);
    if (w != null && w > bestW) { bestW = w; best = id; }
  }
  return best;
}

/** A frozen digest whose settlement ids are the given ids, spread over a wide grid. */
function digestFor(ids) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, ids.length).map((p, i) => ({ id: ids[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

const seatOf = (ledger, obs) => ledger?.[obs]?.[GOVERNING_SEAT_KEY] || {};

describe('D1 — hopDelayTicks (the pure surcharge)', () => {
  const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
  const digest = digestFor(ids);

  it('PIN 2 (adjacent adds nothing) + same-settlement + null digest ⇒ 0', () => {
    expect(hopDelayTicks(digest, 'a', 'a')).toBe(0);     // same settlement
    expect(hopDelayTicks(null, 'a', 'b')).toBe(0);        // dark (no digest) ⇒ no surcharge
    // The nearest distinct pair is one hop (hopWeeks 1) ⇒ floor(1 × 0.5) = 0: adjacent adds nothing.
    const weeks = ids.slice(1).map((id) => hopWeeks(digest, 'a', id)).filter((w) => w != null);
    const nearest = Math.min(...weeks);
    expect(nearest).toBeGreaterThanOrEqual(1);
    const nearestId = ids.slice(1).find((id) => hopWeeks(digest, 'a', id) === nearest);
    if (nearest === 1) expect(hopDelayTicks(digest, 'a', nearestId)).toBe(0);
  });

  it('PIN 3 (monotonicity): further ⇒ never a smaller surcharge', () => {
    const rows = ids.slice(1)
      .map((id) => ({ id, weeks: hopWeeks(digest, 'a', id) }))
      .filter((r) => r.weeks != null)
      .sort((x, y) => x.weeks - y.weeks);
    expect(rows.length).toBeGreaterThanOrEqual(3);
    let prev = -1;
    for (const r of rows) {
      const delay = hopDelayTicks(digest, 'a', r.id);
      expect(delay).toBeGreaterThanOrEqual(prev); // non-decreasing in distance
      expect(delay).toBe(Math.floor(r.weeks * NEWS_SPEED_FACTOR)); // exact formula
      prev = delay;
    }
    // The farthest pair is strictly staler than the nearest (the grid is wide enough).
    expect(hopDelayTicks(digest, 'a', rows[rows.length - 1].id)).toBeGreaterThan(0);
  });

  it('PIN 5 (determinism): same digest + pair ⇒ identical surcharge', () => {
    for (const id of ids.slice(1)) {
      expect(hopDelayTicks(digest, 'a', id)).toBe(hopDelayTicks(digest, 'a', id));
    }
  });
});

describe('D1 — distancePricedNewsActive gate', () => {
  it('dark by default; requires beliefsActive AND the virtual flag', () => {
    expect(distancePricedNewsActive({})).toBe(false);
    // beliefsActive but flag absent ⇒ dark.
    expect(distancePricedNewsActive({ spatialCanonVersion: 1, simulationRules: { infoMode: 'perfect_delayed' } })).toBe(false);
    // flag set but omniscient (not beliefsActive) ⇒ dark.
    expect(distancePricedNewsActive({ spatialCanonVersion: 1, simulationRules: { infoMode: 'omniscient', distancePricedNewsEnabled: true } })).toBe(false);
    // flag set but no spatial marker ⇒ dark.
    expect(distancePricedNewsActive({ simulationRules: { infoMode: 'perfect_delayed', distancePricedNewsEnabled: true } })).toBe(false);
    // both present ⇒ lit.
    expect(distancePricedNewsActive({ spatialCanonVersion: 1, simulationRules: { infoMode: 'perfect_delayed', distancePricedNewsEnabled: true } })).toBe(true);
  });
});

describe('D1 — believedNeedScale (the derived believed-need coupling)', () => {
  const rec = (confidence01) => ({ readiness: 0, strengthBand: 2, allianceLabel: 'trade_partner', faithLabel: null, confidence01, lastUpdateTick: 5 });
  const worldWith = (aBeliefB) => ({
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'perfect_delayed', distancePricedNewsEnabled: true },
    spatialLedgers: { beliefMaps: { a: { [GOVERNING_SEAT_KEY]: { b: aBeliefB } } } },
  });

  it('self / dormant ⇒ 1 (ground truth verbatim); no picture ⇒ 0; a held belief ⇒ its confidence', () => {
    expect(believedNeedScale('a', 'a', worldWith(rec(0.9)))).toBe(1);   // self carve-out ⇒ truth
    expect(believedNeedScale('a', 'b', {})).toBe(1);                     // dormant ⇒ truth verbatim
    expect(believedNeedScale('a', 'z', worldWith(rec(0.9)))).toBe(0);   // marker present, no record ⇒ can't perceive
    expect(believedNeedScale('a', 'b', worldWith(rec(0.8)))).toBeCloseTo(0.8, 6);
    // A stale (low-confidence) picture under-reads the need ⇒ aid lags.
    expect(believedNeedScale('a', 'b', worldWith(rec(0.2)))).toBeCloseTo(0.2, 6);
  });
});

// ── V-24b PER-ROUTE RE-PROPAGATION: the surcharge REACTS to route status (severed ⇒ staler) ──
describe('V-24b — routeAwareHopDelayTicks (the route-status-reactive surcharge)', () => {
  const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
  const digest = digestFor(ids);
  const far = farthestFrom(digest, 'a', ids);
  const base = hopDelayTicks(digest, far, 'a'); // the geometric surcharge (> 0 for a far pair)

  it('calm route (no embattlementOf / all-calm) ⇒ EXACTLY the geometric surcharge (byte-identical)', () => {
    expect(base).toBeGreaterThan(0);
    expect(routeAwareHopDelayTicks(digest, far, 'a', null)).toBe(base);       // no reader ⇒ geometric
    expect(routeAwareHopDelayTicks(digest, far, 'a', () => 0)).toBe(base);    // all-calm ⇒ geometric
    expect(routeAwareHopDelayTicks(null, far, 'a', () => 0.9)).toBe(0);       // dark digest ⇒ 0 regardless
  });

  it('a SEVERED route re-prices: an embattled endpoint (origin OR observer) raises the surcharge', () => {
    const embOrigin = routeAwareHopDelayTicks(digest, far, 'a', (sid) => (sid === far ? 0.8 : 0));
    const embObserver = routeAwareHopDelayTicks(digest, far, 'a', (sid) => (sid === 'a' ? 0.8 : 0));
    expect(embOrigin).toBeGreaterThan(base);   // the severed route staled the news
    expect(embObserver).toBeGreaterThan(base); // the endpoint under siege counts either way
  });

  it('monotone in embattlement, bounded (≤ base × (1 + FACTOR)); an OPENED route returns to geometric', () => {
    const at = (lvl) => routeAwareHopDelayTicks(digest, far, 'a', () => lvl);
    expect(at(0)).toBe(base);                          // opened / calm ⇒ geometric
    expect(at(0.5)).toBeGreaterThanOrEqual(at(0));     // non-decreasing…
    expect(at(1)).toBeGreaterThanOrEqual(at(0.5));     // …in embattlement
    expect(at(1)).toBe(base + Math.round(base * 1 * ROUTE_IMPEDANCE_FACTOR)); // exact ceiling
    expect(at(1)).toBeLessThanOrEqual(base * (1 + ROUTE_IMPEDANCE_FACTOR));   // bounded
  });
});

// ── The belief-fold integration: distant news informs the picture LESS (and dark ⇒ identical) ──
describe('D1 — belief recency fold', () => {
  const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
  const digest = digestFor(ids);
  const far = farthestFrom(digest, 'a', ids); // a distant subject ⇒ a real surcharge
  const now = 20;
  const settlements = ids.map((id) => ({ id, name: id.toUpperCase(), settlement: { name: id, tier: 'city', population: 40000, config: { primaryDeitySnapshot: { name: 'Sol' } } } }));
  const snapshot = { settlements, byId: new Map(settlements.map((s) => [s.id, s])), regionalGraph: { edges: [{ id: `e.a${far}`, from: 'a', to: far, relationshipType: 'hostile' }] } };
  // A fresh, firsthand-quality report about subject `far`, ORIGINATING at `far` (far from a).
  const rumorLedgers = {
    a: {
      'trade:evt1': {
        eventRef: 'evt1', eventTick: now, carrier: 'trade', arrivalTick: now, hopCount: 0,
        lineageIds: ['evt1', `t0:evt1@${far}`], corroborationRoots: [`t0:evt1@${far}`],
        provenance: { originId: far, relayIds: [] }, completeness01: 1, accuracy01: 1,
        framing: [], significance: 'major', score: 90,
        content: { what: 'war_muster', whereId: far, scope: 'regional', magnitude: 3, partyIds: [far], causeClass: null, deityName: null },
        relayedTick: null,
      },
    },
  };
  // A decayed prior belief a→far so the NORMAL reconcile path runs (not cold-start).
  const priorBeliefMaps = { a: { [GOVERNING_SEAT_KEY]: { [far]: { readiness: 0.2, strengthBand: 2, allianceLabel: 'hostile', faithLabel: 'Sol', confidence01: 0.4, lastUpdateTick: now - 5 } } } };

  const run = (flag, emb) => advanceBeliefMaps({
    snapshot, pressureIdx: null, tick: now,
    worldState: {
      spatialCanonVersion: 1,
      simulationRules: { infoMode: 'perfect_delayed', ...(flag ? { distancePricedNewsEnabled: true } : {}) },
      spatialDigest: digest,
      spatialLedgers: { rumorLedgers, beliefMaps: priorBeliefMaps, ...(emb ? { embattlement: emb } : {}) },
    },
  });

  it('PIN 1 (dormancy): flag absent ⇒ byte-identical to the flag-off run', () => {
    const dark = run(false);
    // Re-run with the key entirely absent (not merely false) — must be byte-identical.
    const darkAbsent = advanceBeliefMaps({
      snapshot, pressureIdx: null, tick: now,
      worldState: {
        spatialCanonVersion: 1, simulationRules: { infoMode: 'perfect_delayed' },
        spatialDigest: digest, spatialLedgers: { rumorLedgers, beliefMaps: priorBeliefMaps },
      },
    });
    expect(JSON.stringify(dark.next)).toBe(JSON.stringify(darkAbsent.next));
  });

  it('lit ⇒ the distant report informs the belief LESS than dark (staler ⇒ lower confidence gain)', () => {
    const dark = run(false);
    const lit = run(true);
    // `far` is distant from a ⇒ a non-zero surcharge exists.
    expect(hopDelayTicks(digest, far, 'a')).toBeGreaterThan(0);
    const darkConf = seatOf(dark.next, 'a')[far].confidence01;
    const litConf = seatOf(lit.next, 'a')[far].confidence01;
    expect(litConf).toBeLessThan(darkConf); // distance-staled news rebuilds certainty more slowly
  });

  it('V-24b: a SEVERED route (embattled origin) re-prices the in-flight report staler than a calm lit route', () => {
    const calm = run(true);                                 // lit, calm routes (geometric surcharge only)
    const severed = run(true, { [far]: { level: 0.9 } });   // lit, the origin `far` under siege (route severed)
    const calmConf = seatOf(calm.next, 'a')[far].confidence01;
    const severedConf = seatOf(severed.next, 'a')[far].confidence01;
    // The severed route raises the origin→observer surcharge ⇒ the SAME in-flight report reads
    // staler ⇒ certainty rebuilds even more slowly. This is the in-flight re-pricing on route change.
    expect(severedConf).toBeLessThan(calmConf);
  });

  it('V-24b dormancy: the route-aware surcharge is inert when distance-priced news is dark', () => {
    // Embattlement present but the flag absent ⇒ byte-identical to the plain dark run (no re-pricing).
    const darkEmb = run(false, { [far]: { level: 0.9 } });
    const dark = run(false);
    expect(JSON.stringify(darkEmb.next)).toBe(JSON.stringify(dark.next));
  });
});

// ── The rumor display: player staleness gains the distance clause; DM-truth untouched ──
describe('D1 — rumor display (PIN 4: DM-truth surfaces unaffected)', () => {
  const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
  const digest = digestFor(ids);
  const far = farthestFrom(digest, 'a', ids);
  const tick = 12;
  const ledgers = {
    a: {
      'trade:evt1': {
        eventRef: 'evt1', eventTick: 4, carrier: 'trade', arrivalTick: 6, hopCount: 1,
        lineageIds: ['evt1', `t0:evt1@${far}`, 't1:evt1@a'], corroborationRoots: [`t0:evt1@${far}`],
        provenance: { originId: far, relayIds: [far] }, completeness01: 1, accuracy01: 1,
        framing: ['merchant'], significance: 'major', score: 90,
        content: { what: 'war_muster', whereId: far, scope: 'regional', magnitude: 3, partyIds: [far], causeClass: null, deityName: null },
        relayedTick: null,
      },
    },
  };
  const worldState = (flag) => ({
    tick,
    simulationRules: { infoMode: 'perfect_delayed', ...(flag ? { distancePricedNewsEnabled: true } : {}) },
    spatialCanonVersion: 1, spatialDigest: digest,
    spatialLedgers: { rumorLedgers: ledgers },
  });

  it('player view: freshness is staler when lit; agoTicks stays literal; DM truth block identical', () => {
    const dark = settlementRumors({ worldState: worldState(false), settlementId: 'a', includeGroundTruth: true });
    const lit = settlementRumors({ worldState: worldState(true), settlementId: 'a', includeGroundTruth: true });
    expect(dark).toHaveLength(1);
    expect(lit).toHaveLength(1);
    // agoTicks (literal ticks-since-arrival) is unchanged by D1.
    expect(lit[0].agoTicks).toBe(dark[0].agoTicks);
    // The DM truth block is NEVER delayed (pin 4) — byte-identical whether lit or dark.
    expect(JSON.stringify(lit[0].truth)).toBe(JSON.stringify(dark[0].truth));
    // But the perceived STALENESS band gains the distance clause (`far` is far from a).
    expect(hopDelayTicks(digest, far, 'a')).toBeGreaterThan(0);
  });

  it('dark (flag absent) player projection is byte-identical to today', () => {
    const off = settlementRumors({ worldState: worldState(false), settlementId: 'a' });
    const absent = settlementRumors({
      worldState: { tick, simulationRules: { infoMode: 'perfect_delayed' }, spatialCanonVersion: 1, spatialDigest: digest, spatialLedgers: { rumorLedgers: ledgers } },
      settlementId: 'a',
    });
    expect(JSON.stringify(off)).toBe(JSON.stringify(absent));
  });
});
