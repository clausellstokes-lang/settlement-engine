/**
 * seasonalRoads.test.js — Phase 5.5 mover wave M3: SEASONS-B: WINTER ROADS.
 *
 * The reserved `seasonalOverlay` slot materializes as a per-season × per-terrain
 * cost LAW, applied MULTIPLICATIVELY at READ TIME over the FROZEN geometry. This
 * suite is the wave's proof (its binding contract):
 *   - the multiplier is MULTIPLICATIVE with terrain (winter × mountain ≫ winter × plains);
 *   - SLOW, NOT SEVER — cost stays FINITE at max winter × mountain, never infinite/cut;
 *   - winter LENGTHENS both M2 shipment arrivals (routeWeeks) and 3.5 rumor arrivals (hopWeeks);
 *   - winter reshapes route CHOICE by cost (campaign season emerges);
 *   - overlay-null ⇒ multiplier 1.0 ⇒ byte-identical (every pre-M3 digest / golden);
 *   - the SPRING-THAW news burst fires on the winter→spring transition + seeds the rumor ledger;
 *   - the hungry-gap × slow-roads composition is BOUNDED (a snowed-in famine town is
 *     rescuable by spring, not annihilated).
 */
import { describe, expect, it } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import {
  hopWeeks,
  pathCost,
  activeSeasonalOverlay,
  edgeSeasonMultiplier,
  pathSeasonMultiplier,
  seasonalPathCost,
  terrainBlendMultiplier,
  MAX_HOP_WEEKS,
} from '../../src/domain/spatial/distanceRead.js';
import {
  SEASON_TERRAIN_COST,
  SLOW_NOT_SEVER_MAX,
  SEASONAL_OVERLAY_VERSION,
  buildSeasonalOverlay,
} from '../../src/domain/spatial/spatialCost.js';
import { chooseRoute } from '../../src/domain/spatial/embattlement.js';
import { routeWeeks, stepSupplyLink, rankSupplySources } from '../../src/domain/spatial/supplyShipments.js';
import { advanceRumorLedgers, passesSignificanceGate, RUMOR_NOTABLE_SCORE_FLOOR } from '../../src/domain/spatial/rumorNetwork.js';
import { seasonalThawEntries } from '../../src/domain/worldPulse/seasons.js';

const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
// From the fixture: s003|s006 is a MOUNTAIN-dominated hop (ridge crossing); the
// s000..s001 hop is pure grassland (plains).
const MOUNTAIN_PAIR = ['s003', 's006'];
const PLAINS_PAIR = ['s000', 's001'];

function seasonDigest(count = 8) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  return buildSpatialDigest({ pack, placements: placeSettlements(pack, count), seasonalRoads: true, overlayVersion: 2 });
}
function plainDigest(count = 8) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  return buildSpatialDigest({ pack, placements: placeSettlements(pack, count) });
}

describe('SEASONS-B — the overlay is materialized + versioned', () => {
  it('opt-in lights the slot under the bumped overlayVersion; default stays dormant', () => {
    const d = seasonDigest();
    expect(d.overlayVersion).toBe(SEASONAL_OVERLAY_VERSION);
    expect(d.reserved.seasonalOverlay).toBeTruthy();
    expect(d.reserved.seasonalOverlay.version).toBe(SEASONAL_OVERLAY_VERSION);
    expect(activeSeasonalOverlay(d)).toBeTruthy();
    // The OTHER three reserved slots stay null (their own waves light them).
    expect(d.reserved.airField).toBeNull();
    expect(d.reserved.seaLanes).toBeNull();
    expect(d.reserved.teleportEdges).toBeNull();
    // The default (pre-M3) build carries no overlay ⇒ dormant.
    const d0 = plainDigest();
    expect(d0.overlayVersion).toBe(1);
    expect(d0.reserved.seasonalOverlay).toBeNull();
    expect(activeSeasonalOverlay(d0)).toBeNull();
  });
});

describe('SEASONS-B — MULTIPLICATIVE with terrain', () => {
  it('winter × mountain ≫ winter × plains (a mountain pass is near-impassable, plains merely slow)', () => {
    const d = seasonDigest();
    const winterMtn = edgeSeasonMultiplier(d, ...MOUNTAIN_PAIR, 'winter');
    const winterPlains = edgeSeasonMultiplier(d, ...PLAINS_PAIR, 'winter');
    expect(winterMtn).toBeGreaterThan(winterPlains);
    expect(winterMtn).toBeGreaterThan(3); // mountain reads near its winter factor (6)
    expect(winterPlains).toBeCloseTo(SEASON_TERRAIN_COST.winter.grassland, 6);
    // Summer is the baseline for land terrain: a plains hop is unmodulated.
    expect(edgeSeasonMultiplier(d, ...PLAINS_PAIR, 'summer')).toBeCloseTo(1, 6);
  });

  it('the blend is a cost-weighted average of the per-class factors (not a max/min)', () => {
    const overlay = buildSeasonalOverlay();
    // 3 parts mountain (6.0), 1 part grassland (1.5) in winter ⇒ (3·6 + 1·1.5)/4.
    const blend = terrainBlendMultiplier(overlay, { mountain: 300, grassland: 100 }, 'winter');
    const expected = (300 * SEASON_TERRAIN_COST.winter.mountain + 100 * SEASON_TERRAIN_COST.winter.grassland) / 400;
    expect(blend).toBeCloseTo(expected, 9);
  });

  it('every season × terrain factor is FINITE, ≥ 1, and ≤ SLOW_NOT_SEVER_MAX', () => {
    for (const s of SEASONS) {
      for (const cls of Object.keys(SEASON_TERRAIN_COST[s])) {
        const v = SEASON_TERRAIN_COST[s][cls];
        expect(Number.isFinite(v)).toBe(true);
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(SLOW_NOT_SEVER_MAX);
      }
    }
  });
});

describe('SEASONS-B — SLOW, NOT SEVER (finite at the worst case)', () => {
  it('at max winter × mountain the cost stays finite, never infinite/cut', () => {
    const d = seasonDigest();
    const winterCost = pathCost(d, ...MOUNTAIN_PAIR, 'winter');
    expect(Number.isFinite(winterCost)).toBe(true);
    expect(winterCost).toBeGreaterThan(0);
    // Cost inflates, but bounded by the finite table max — the pair is still REACHABLE.
    const base = pathCost(d, ...MOUNTAIN_PAIR);
    expect(winterCost).toBeGreaterThan(base);
    expect(winterCost).toBeLessThanOrEqual(base * SLOW_NOT_SEVER_MAX + 1);
    // hopWeeks stays finite and capped — a snowed-in hop is SLOW, never infinite.
    const w = hopWeeks(d, ...MOUNTAIN_PAIR, 'winter');
    expect(Number.isFinite(w)).toBe(true);
    expect(w).toBeLessThanOrEqual(MAX_HOP_WEEKS);
  });

  it('across EVERY mapped pair × season the multiplier is in [1, SLOW_NOT_SEVER_MAX] and cost finite', () => {
    const d = seasonDigest();
    const ids = d.settlementIds;
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < ids.length; j++) {
        if (i === j) continue;
        const base = pathCost(d, ids[i], ids[j]);
        if (base == null) continue; // unreachable pair — not our concern here
        for (const s of SEASONS) {
          const mult = pathSeasonMultiplier(d, [ids[i], ids[j]], s);
          expect(mult).toBeGreaterThanOrEqual(1);
          expect(mult).toBeLessThanOrEqual(SLOW_NOT_SEVER_MAX);
          const c = pathCost(d, ids[i], ids[j], s);
          expect(Number.isFinite(c)).toBe(true);
        }
      }
    }
  });
});

describe('SEASONS-B — winter lengthens arrivals (info + caravans run cold)', () => {
  it('3.5 rumor arrivals: hopWeeks winter ≥ summer everywhere, strictly greater over a mountain hop', () => {
    const d = seasonDigest();
    const ids = d.settlementIds;
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < ids.length; j++) {
        if (i === j) continue;
        const summer = hopWeeks(d, ids[i], ids[j], 'summer');
        const winter = hopWeeks(d, ids[i], ids[j], 'winter');
        if (summer == null || winter == null) continue;
        expect(winter).toBeGreaterThanOrEqual(summer);
      }
    }
    expect(hopWeeks(d, ...MOUNTAIN_PAIR, 'winter')).toBeGreaterThan(hopWeeks(d, ...MOUNTAIN_PAIR, 'summer'));
  });

  it('M2 shipment arrivals: routeWeeks off the season-chosen route lengthens in winter', () => {
    const d = seasonDigest();
    const ws = { spatialCanonVersion: 1, spatialDigest: d };
    const summerRoute = chooseRoute(d, ws, ...MOUNTAIN_PAIR, 0.6, 'summer');
    const winterRoute = chooseRoute(d, ws, ...MOUNTAIN_PAIR, 0.6, 'winter');
    expect(winterRoute.baseCost).toBeGreaterThan(summerRoute.baseCost);
    expect(routeWeeks(d, winterRoute.baseCost)).toBeGreaterThan(routeWeeks(d, summerRoute.baseCost));
  });

  it('a dispatched supply link arrives LATER in winter than in summer (same source/route)', () => {
    const d = seasonDigest();
    const ws = { spatialCanonVersion: 1, spatialDigest: d };
    const link = {
      institutionId: 'smithy', institutionName: 'The Smithy', settlementId: MOUNTAIN_PAIR[1],
      input: 'iron', rankedSources: [{ sourceId: MOUNTAIN_PAIR[0], cost: pathCost(d, ...MOUNTAIN_PAIR) }],
      bufferWeeks: 8, critical: true,
    };
    const ctx = (season) => ({
      digest: d, worldState: ws, tick: 100, tickWeeks: 1, riskTolerance: 0.6, season,
      sourceSevered: () => false, isHostileToDestination: () => false,
    });
    const summer = stepSupplyLink(link, null, ctx('summer'));
    const winter = stepSupplyLink(link, null, ctx('winter'));
    expect(summer.record).toBeTruthy();
    expect(winter.record).toBeTruthy();
    // Both arrive (finite arrivalTick), but the winter caravan is on the road longer.
    expect(winter.record.arrivalTick).toBeGreaterThan(summer.record.arrivalTick);
    expect(Number.isFinite(winter.record.arrivalTick)).toBe(true);
  });
});

describe('SEASONS-B — campaign season: route CHOICE emerges by cost', () => {
  it('winter picks a longer plains detour over a mountain pass that wins in summer', () => {
    const receipt = (a, b, cost, cls) => ({ between: [a, b].sort(), cost, byTerrain: { [cls]: cost } });
    const syn = {
      settlementIds: ['A', 'B', 'C', 'D'],
      distanceMatrix: { A: { B: 100, C: 90, D: 180 }, B: { A: 100, D: 100 }, C: { A: 90, D: 90 }, D: { A: 180, B: 100, C: 90 } },
      tiers: {},
      gates: [
        { between: ['A', 'B'], cost: 100 }, { between: ['B', 'D'], cost: 100 },
        { between: ['A', 'C'], cost: 90 }, { between: ['C', 'D'], cost: 90 },
      ],
      routeReceipts: {
        'A|B': receipt('A', 'B', 100, 'grassland'), 'B|D': receipt('B', 'D', 100, 'grassland'),
        'A|C': receipt('A', 'C', 90, 'mountain'), 'C|D': receipt('C', 'D', 90, 'mountain'),
      },
      reserved: { airField: null, seaLanes: null, teleportEdges: null, seasonalOverlay: buildSeasonalOverlay() },
    };
    const ws = { spatialCanonVersion: 1, spatialDigest: syn };
    expect(chooseRoute(syn, ws, 'A', 'D', 0.6, 'summer').path).toEqual(['A', 'C', 'D']); // cheap mountain road
    expect(chooseRoute(syn, ws, 'A', 'D', 0.6, 'winter').path).toEqual(['A', 'B', 'D']); // plains detour wins
  });
});

describe('SEASONS-B — DORMANCY: overlay-null ⇒ multiplier 1.0 ⇒ byte-identical', () => {
  it('a pre-M3 digest reads IDENTICALLY whether or not a season is threaded', () => {
    const d0 = plainDigest();
    const ids = d0.settlementIds;
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < ids.length; j++) {
        if (i === j) continue;
        const base = pathCost(d0, ids[i], ids[j]);
        for (const s of SEASONS) {
          expect(pathCost(d0, ids[i], ids[j], s)).toBe(base);
          expect(hopWeeks(d0, ids[i], ids[j], s)).toBe(hopWeeks(d0, ids[i], ids[j]));
          expect(pathSeasonMultiplier(d0, [ids[i], ids[j]], s)).toBe(1);
          expect(edgeSeasonMultiplier(d0, ids[i], ids[j], s)).toBe(1);
          expect(seasonalPathCost(d0, [ids[i], ids[j]], base ?? 0, s)).toBe(Math.max(0, base ?? 0));
        }
      }
    }
  });

  it('a season-aware digest with a NULL season reads geometric (season is opt-in)', () => {
    const d = seasonDigest();
    expect(pathCost(d, ...MOUNTAIN_PAIR, null)).toBe(pathCost(d, ...MOUNTAIN_PAIR));
    expect(hopWeeks(d, ...MOUNTAIN_PAIR, null)).toBe(hopWeeks(d, ...MOUNTAIN_PAIR));
  });

  it('the reads are pure — repeated seasonal reads are identical', () => {
    const d = seasonDigest();
    for (const s of SEASONS) {
      expect(pathCost(d, ...MOUNTAIN_PAIR, s)).toBe(pathCost(d, ...MOUNTAIN_PAIR, s));
      expect(hopWeeks(d, ...MOUNTAIN_PAIR, s)).toBe(hopWeeks(d, ...MOUNTAIN_PAIR, s));
    }
  });
});

describe('SEASONS-B — the SPRING-THAW news burst', () => {
  const window = (prevWeeks, weeks) => seasonalThawEntries({ prevWeeks, weeks, tick: weeks, now: '2026-01-01T00:00:00.000Z', settlementIds: ['s000', 's001'] });

  it('fires exactly once on the winter→spring crossing (week-of-year 52 → 53)', () => {
    // Weeks 40..51 are winter (year 1); week 52 rolls into spring wk1 (year 2).
    const entries = window(51, 53);
    expect(entries).toHaveLength(1);
    const e = entries[0];
    expect(e.kind).toBe('season_marker');
    expect(e.impactKind).toBe('spring_thaw');
    expect(e.scope).toBe('realm');
    expect(e.headline).toBe('The roads thaw');
    // Scored above the rumor notable floor so it SEEDS the ledger.
    expect(e.score).toBeGreaterThanOrEqual(RUMOR_NOTABLE_SCORE_FLOOR);
    expect(passesSignificanceGate(e)).toBe(true);
  });

  it('does NOT fire on a non-thaw window (summer → autumn)', () => {
    expect(window(24, 27)).toHaveLength(0); // summer into autumn — no spring crossing
    expect(window(0, 4)).toHaveLength(0);   // mid-spring, no fresh crossing
  });

  it('the thaw entry SEEDS the rumor ledger under a seasonal-overlay canon', () => {
    const d = seasonDigest();
    const graph = { edges: [], nodes: d.settlementIds.map((id) => ({ id })) };
    const ws = {
      spatialCanonVersion: 1, spatialDigest: d,
      simulationRules: { infoMode: 'perfect_delayed' },
      calendar: { elapsedWeeks: 53 },
      rulesetLog: [],
    };
    const thaw = seasonalThawEntries({ prevWeeks: 51, weeks: 53, tick: 53, now: '2026-01-01T00:00:00.000Z', settlementIds: d.settlementIds });
    expect(thaw).toHaveLength(1);
    const { next, changed } = advanceRumorLedgers({ worldState: ws, feedEntries: thaw, graph, tick: 53, season: 'spring' });
    expect(changed).toBe(true);
    expect(next).toBeTruthy();
    // The thaw is now a rumor at (at least one of) the realm's settlements.
    const seededSomewhere = Object.values(next).some((ledger) => Object.values(ledger).some((r) => String(r.eventRef).includes('spring_thaw')));
    expect(seededSomewhere).toBe(true);
  });
});

describe('SEASONS-B — hungry-gap × slow-roads composition is BOUNDED', () => {
  it('a snowed-in famine town is RESCUABLE by spring: winter relief is slow but finite (≤ a year)', () => {
    const d = seasonDigest();
    // On the mountain road ITSELF, winter is the harshest season yet the hop stays
    // FINITE, and spring RELIEVES it — the road is slow, never severed. (A supply
    // caravan may in fact REROUTE around the pass in winter — the campaign-season
    // emergence — so the unambiguous slow-not-sever bound is read on the hop.)
    const summerHop = hopWeeks(d, ...MOUNTAIN_PAIR, 'summer');
    const springHop = hopWeeks(d, ...MOUNTAIN_PAIR, 'spring');
    const winterHop = hopWeeks(d, ...MOUNTAIN_PAIR, 'winter');
    expect(Number.isFinite(winterHop)).toBe(true);
    expect(winterHop).toBeLessThanOrEqual(MAX_HOP_WEEKS); // slow, but bounded to within a year
    expect(winterHop).toBeGreaterThan(summerHop);         // winter is dear
    expect(springHop).toBeLessThan(winterHop);            // spring relieves — the town is rescuable

    // And a starving smithy on that road still gets a caravan DISPATCHED with a
    // finite arrival even in deep winter (the total-cut brake never annihilates it).
    const ws = { spatialCanonVersion: 1, spatialDigest: d };
    const link = {
      institutionId: 'smithy', institutionName: 'The Smithy', settlementId: MOUNTAIN_PAIR[1],
      input: 'iron', rankedSources: rankSupplySources(d, MOUNTAIN_PAIR[1], [MOUNTAIN_PAIR[0]]),
      bufferWeeks: 0, critical: true,
    };
    const priorStarving = { institutionId: 'smithy', settlementId: MOUNTAIN_PAIR[1], input: 'iron', sourceId: '', arrivalTick: -1, starving: true };
    const out = stepSupplyLink(link, priorStarving, {
      digest: d, worldState: ws, tick: 200, tickWeeks: 1, riskTolerance: 0.6, season: 'winter',
      sourceSevered: () => false, isHostileToDestination: () => false,
    });
    expect(out.record).toBeTruthy();
    expect(Number.isFinite(out.record.arrivalTick)).toBe(true);
    const winterWeeks = out.record.arrivalTick - 200;
    expect(winterWeeks).toBeGreaterThan(0);
    expect(winterWeeks).toBeLessThanOrEqual(52); // rescuable within a year, not annihilated
  });
});
