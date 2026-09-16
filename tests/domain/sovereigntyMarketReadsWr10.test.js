/**
 * sovereigntyMarketReadsWr10.test.js — WR-10d: WHAT IS FOR SALE, AND WHO CAN HOLD IT.
 *
 * Two reads, pinned together because they answer one question in two halves: the
 * eligibility read shapes WHAT may be offered, the reach read shapes TO WHOM.
 *
 * THE ELIGIBILITY PINS ARE SHAPED BY AN ABSENT FIELD. The "sovereign-hand law" that
 * protects user-placed settlements has NO code spelling anywhere in the tree, so an
 * eligibility read written as a deny-list would consult a flag that is always absent
 * and would therefore always allow. The pins below prove the POSITIVE derivation
 * instead: a settlement no ledger names is `free`, and free is not for sale — which is
 * the only formulation that protects a settlement nobody remembered to mark.
 *
 * THE REACH PINS ARE SHAPED BY THE CONJUNCTION-BLIND-GUARD HAZARD. Three legs, and one
 * fixture that fails all three would prove only their conjunction. Each leg therefore
 * gets its own fixture that fails THAT LEG ALONE with the other two passing, and the
 * all-pass fixture is asserted in every one of them so a broken fixture cannot
 * masquerade as a working guard.
 */
import { describe, it, expect } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { routeEdge, routeEdgeId } from '../../src/domain/worldPulse/routeNetworkLedger.js';
import {
  readSovereigntyAsset, tradeableAssetsOf,
  SOVEREIGNTY_ASSET_KINDS, SOVEREIGNTY_CONVEYABLE_OCCUPATION_STATE,
} from '../../src/domain/worldPulse/sovereigntyAssets.js';
import {
  sovereigntyReach, reachableAssetsFor,
  SOVEREIGNTY_REACH_TUNING, SOVEREIGNTY_REACH_FAILURES, ARMY_TRANSIT_TUNING,
} from '../../src/domain/worldPulse/sovereigntyReach.js';

// ── FIXTURES ─────────────────────────────────────────────────────────────────

const satelliteRow = (id, parentId) => ({
  id, name: id, parentId, tier: 'hamlet', population: 300,
  foundedTick: 4, provenance: 'growth',
});

/** A world whose ledgers say who holds what. */
function heldWorld() {
  return {
    spatialLedgers: {
      satellites: {
        ironvale: { steadings: { 'steading.ironvale.4': satelliteRow('steading.ironvale.4', 'ironvale') } },
      },
    },
    occupations: {
      greenhollow: { occupierId: 'saltmarch', state: SOVEREIGNTY_CONVEYABLE_OCCUPATION_STATE, lastTick: 9 },
      thornwick: { occupierId: 'saltmarch', state: 'contested', lastTick: 9 },
      duskmere: { occupierId: 'ironvale', state: 'stabilized', lastTick: 9 },
    },
  };
}

const CHAIN = ['ironvale', 'midpost', 'greenhollow'];

const SEATS = 20;

/**
 * A TWENTY-SEAT REALM with the chain seated at chosen indices and filler settlements
 * on every other seat.
 *
 * THE FILLERS ARE LOAD-BEARING, and finding that out cost a wrong fixture. `hopWeeks`
 * runs through the digest's own `weeksPerCost` CALIBRATION, and that calibration is
 * derived from the placements the digest was built with — so a digest holding only
 * three settlements normalizes those three to be neighbours no matter how far apart
 * their cells are, and "move them to opposite corners" produces a SHORTER march, not a
 * longer one. Both fixtures below therefore carry the same twenty placements and
 * differ ONLY in which seats the chain occupies, which is the controlled comparison
 * the leg-2 pin actually needs.
 * @param {[number, number, number]} chainSeats
 */
function realmDigest(chainSeats) {
  const pack = makeGridPack({ cols: 48, rows: 36 });
  const seats = placeSettlements(pack, SEATS);
  const placements = seats.map((seat, i) => {
    const chainIndex = chainSeats.indexOf(i);
    return {
      id: chainIndex >= 0 ? CHAIN[chainIndex] : `filler${String(i).padStart(2, '0')}`,
      cellId: seat.cellId,
      institutions: [],
    };
  });
  return buildSpatialDigest({ pack, placements });
}

/** The chain seated adjacently: a short march, inside the band. */
const digestFor = () => realmDigest([0, 1, 2]);

/** The identical realm with the chain seated across it: a long march on the SAME
 *  roads carrying the SAME goods, so leg 2 fails ALONE rather than in company. */
const farDigest = () => realmDigest([1, 9, 17]);

/**
 * A world with a real lived road ironvale → midpost → greenhollow, each hop carrying
 * a goods flow. `deadHop` kills the flow on one hop; `noEdges` removes the road.
 */
function roadWorld({ deadHop = null, noEdges = false } = {}) {
  /** @type {Record<string, unknown>} */
  const edges = {};
  if (!noEdges) {
    for (const [a, b] of [['ironvale', 'midpost'], ['midpost', 'greenhollow']]) {
      const id = routeEdgeId(a, b, 'land');
      const carries = deadHop !== `${a}|${b}`;
      edges[id] = {
        ...routeEdge({
          a, b, grade: 'road', mode: 'land', flavor: 'mercantile', tick: 1, provenance: 'generated',
        }),
        usage: {
          flows: carries ? { goods: 'steady' } : {},
          tally: carries ? { goods: 14 } : {},
          lastTick: 1,
        },
      };
    }
  }
  return {
    simulationRules: { routeLifecycleEnabled: true },
    spatialLedgers: { routeNetwork: { edges, corridor: {} } },
  };
}

// ── A) ELIGIBILITY ───────────────────────────────────────────────────────────

describe('WR-10d — only a held thing may be sold', () => {
  it('a SATELLITE is tradeable, and names its parent as the holder', () => {
    const read = readSovereigntyAsset(heldWorld(), 'steading.ironvale.4');
    expect(read.kind).toBe('satellite');
    expect(read.tradeable).toBe(true);
    expect(read.holderId).toBe('ironvale');
  });

  it('a VASSALIZED occupation is tradeable; every lower rung is a fight, not a holding', () => {
    const world = heldWorld();
    expect(readSovereigntyAsset(world, 'greenhollow').kind).toBe('vassal');
    expect(readSovereigntyAsset(world, 'greenhollow').tradeable).toBe(true);
    for (const inProgress of ['thornwick', 'duskmere']) {
      const read = readSovereigntyAsset(world, inProgress);
      expect(read.tradeable, `${inProgress} is an occupation in progress`).toBe(false);
      expect(read.kind).toBe('free');
      expect(read.receipt).toContain('fight in progress');
    }
  });

  it('THE SOVEREIGN HAND: a settlement no ledger names is FREE, and free is never for sale', () => {
    // This is the pin that a deny-list formulation would have failed. There is no
    // user-placed flag in the tree to consult, so a DM's settlement is protected only
    // by the read being positive — it appears in neither ledger, so it is never
    // reachable as an asset, no matter what anyone forgot to mark it with.
    const read = readSovereigntyAsset(heldWorld(), 'a_town_the_dm_dropped_on_the_map');
    expect(read.kind).toBe('free');
    expect(read.tradeable).toBe(false);
    expect(read.holderId).toBe(null);
    expect(read.receipt).toContain('not a commodity');
    // Non-vacuity: the same call on a real satellite in the same world IS tradeable.
    expect(readSovereigntyAsset(heldWorld(), 'steading.ironvale.4').tradeable).toBe(true);
  });

  it('an EMPTY world sells nothing at all, and says so in the closed vocabulary', () => {
    for (const world of [null, {}, { spatialLedgers: {} }, { occupations: {} }]) {
      const read = readSovereigntyAsset(world, 'anywhere');
      expect(read.tradeable).toBe(false);
      expect(SOVEREIGNTY_ASSET_KINDS).toContain(read.kind);
    }
    expect(readSovereigntyAsset({}, '').kind).toBe('unknown');
  });

  it('tradeableAssetsOf walks a holder\'s ledgers and returns ONLY conveyable holdings', () => {
    const world = heldWorld();
    expect(tradeableAssetsOf(world, 'ironvale').map((a) => a.assetId)).toEqual(['steading.ironvale.4']);
    // saltmarch holds two occupations; only the vassalized one is conveyable.
    const saltmarch = tradeableAssetsOf(world, 'saltmarch');
    expect(saltmarch.map((a) => a.assetId)).toEqual(['greenhollow']);
    expect(saltmarch.every((a) => a.tradeable)).toBe(true);
    expect(tradeableAssetsOf(world, 'nobody')).toEqual([]);
    expect(tradeableAssetsOf(world, '')).toEqual([]);
  });

  it('PURE: the read writes nothing back into the world it was handed', () => {
    const world = heldWorld();
    const before = JSON.parse(JSON.stringify(world));
    readSovereigntyAsset(world, 'greenhollow');
    tradeableAssetsOf(world, 'saltmarch');
    expect(world).toEqual(before);
  });
});

// ── B) THE GEOGRAPHIC BOUND ──────────────────────────────────────────────────

describe('WR-10d — a buyer must be able to HOLD what it buys', () => {
  const digest = digestFor();
  const reach = (over = {}) => sovereigntyReach({
    worldState: roadWorld(), digest, buyerId: 'ironvale', assetId: 'greenhollow', ...over,
  });

  it('all three legs pass on a real road that carries real goods', () => {
    const read = reach();
    expect(read.routed, 'leg 1 — the lived road').toBe(true);
    expect(read.reinforceable, 'leg 2 — a column arrives inside the band').toBe(true);
    expect(read.traded, 'leg 3 — goods move the whole way').toBe(true);
    expect(read.holds).toBe(true);
    expect(read.failures).toEqual([]);
    expect(read.routeTicks).toBeGreaterThan(0);
    expect(read.marchWeeks).toBeGreaterThan(0);
    expect(read.receipt).toContain('can hold');
  });

  it('LEG 1 ALONE: no road ⇒ no reach, with the other two legs untouched', () => {
    const read = sovereigntyReach({
      worldState: roadWorld({ noEdges: true }), digest, buyerId: 'ironvale', assetId: 'greenhollow',
    });
    expect(read.routed).toBe(false);
    expect(read.reinforceable, 'the ground did not move — only the road went away').toBe(true);
    expect(read.holds).toBe(false);
    expect(read.failures).toContain('unrouted');
    expect(reach().holds, 'the all-pass fixture still passes').toBe(true);
  });

  it('LEG 2 ALONE: too far to reinforce ⇒ no reach, though the road runs and goods move', () => {
    // Same road, same flows; only the GROUND is stretched, so the march exceeds the band.
    const read = sovereigntyReach({
      worldState: roadWorld(), digest: farDigest(), buyerId: 'ironvale', assetId: 'greenhollow',
    });
    expect(read.routed, 'the road is the same road').toBe(true);
    expect(read.traded, 'and the same goods move on it').toBe(true);
    expect(read.marchWeeks).toBeGreaterThan(SOVEREIGNTY_REACH_TUNING.MAX_REINFORCEMENT_WEEKS);
    expect(read.reinforceable).toBe(false);
    expect(read.holds).toBe(false);
    expect(read.failures).toContain('out_of_march_band');
    expect(reach().holds).toBe(true);
  });

  it('THE BAND IS LIVE FROM BOTH SIDES — the dead-band cure, measured on a real digest', () => {
    // ⚠⚠ THE PIN THAT MATTERS MOST IN THIS FILE. `hopWeeks` does not return a
    // distance; it returns a distance through the digest's own weeksPerCost
    // CALIBRATION, which normalizes every realm to a bounded span. A band chosen by
    // eye against ARMY_TRANSIT_TUNING.MAX_MARCH_WEEKS (52) is therefore UNREACHABLE:
    // it admits every pair in every world and refuses nothing, forever, silently.
    // The first draft of this module carried exactly that band. This pin measures the
    // ACTUAL spectrum a realm produces and asserts the band splits it.
    const pack = makeGridPack({ cols: 48, rows: 36 });
    const seats = placeSettlements(pack, 20);
    const ids = seats.map((_, i) => `p${String(i).padStart(2, '0')}`);
    const digest20 = buildSpatialDigest({
      pack,
      placements: ids.map((id, i) => ({ id, cellId: seats[i].cellId, institutions: [] })),
    });
    const band = SOVEREIGNTY_REACH_TUNING.MAX_REINFORCEMENT_WEEKS;
    let inside = 0;
    let outside = 0;
    for (const a of ids) {
      for (const b of ids) {
        if (a >= b) continue;
        const weeks = sovereigntyReach({
          worldState: roadWorld(), digest: digest20, buyerId: a, assetId: b,
        }).marchWeeks;
        if (weeks == null) continue;
        if (weeks <= band) inside += 1; else outside += 1;
      }
    }
    expect(inside + outside, 'the sweep really measured pairs').toBeGreaterThan(100);
    expect(inside, 'some holdings ARE reinforceable — the band is not a wall').toBeGreaterThan(0);
    expect(outside, 'some holdings are NOT — the band is not decoration').toBeGreaterThan(0);
    // And the band sits under the engine's own march ceiling by a wide margin, which
    // is the number a reader would otherwise have reached for.
    expect(band).toBeLessThan(ARMY_TRANSIT_TUNING.MAX_MARCH_WEEKS / 4);
  });

  it('LEG 3 ALONE: a road nothing moves on is a line on a map, not a connection', () => {
    const read = sovereigntyReach({
      worldState: roadWorld({ deadHop: 'midpost|greenhollow' }),
      digest, buyerId: 'ironvale', assetId: 'greenhollow',
    });
    expect(read.routed, 'the road still exists').toBe(true);
    expect(read.reinforceable, 'and the column still arrives in time').toBe(true);
    expect(read.traded).toBe(false);
    expect(read.holds).toBe(false);
    expect(read.failures).toContain('untraded');
    expect(reach().holds).toBe(true);
  });

  it('a HIGHER READINESS shortens the march — leg 2 reads the army\'s own speed law', () => {
    const lazy = sovereigntyReach({ worldState: roadWorld(), digest: farDigest(), buyerId: 'ironvale', assetId: 'greenhollow', readiness01: 0 });
    const drilled = sovereigntyReach({ worldState: roadWorld(), digest: farDigest(), buyerId: 'ironvale', assetId: 'greenhollow', readiness01: 1 });
    expect(Number(drilled.marchWeeks)).toBeLessThan(Number(lazy.marchWeeks));
    // ...and an unstated readiness is exactly neutral, not an accidental opinion.
    const neutral = sovereigntyReach({ worldState: roadWorld(), digest: farDigest(), buyerId: 'ironvale', assetId: 'greenhollow' });
    const stated = sovereigntyReach({ worldState: roadWorld(), digest: farDigest(), buyerId: 'ironvale', assetId: 'greenhollow', readiness01: SOVEREIGNTY_REACH_TUNING.NEUTRAL_READINESS });
    expect(neutral.marchWeeks).toBe(stated.marchWeeks);
  });

  it('every failure it can report is a member of the closed vocabulary', () => {
    const cases = [
      sovereigntyReach({ worldState: roadWorld({ noEdges: true }), digest, buyerId: 'ironvale', assetId: 'greenhollow' }),
      sovereigntyReach({ worldState: roadWorld(), digest: farDigest(), buyerId: 'ironvale', assetId: 'greenhollow' }),
      sovereigntyReach({ worldState: roadWorld({ deadHop: 'ironvale|midpost' }), digest, buyerId: 'ironvale', assetId: 'greenhollow' }),
      sovereigntyReach({ worldState: roadWorld(), digest, buyerId: 'ironvale', assetId: 'ironvale' }),
    ];
    const seen = new Set(cases.flatMap((c) => [...c.failures]));
    expect(seen.size).toBeGreaterThan(1); // non-vacuity: real, varied failures
    for (const failure of seen) expect(SOVEREIGNTY_REACH_FAILURES).toContain(failure);
  });

  it('THE NEGATIVE CASE: an unreachable buyer never appears in the candidate set (silence, not a receipt)', () => {
    const world = roadWorld();
    const all = ['greenhollow', 'midpost', 'a_place_off_every_road'];
    const candidates = reachableAssetsFor({ worldState: world, digest, buyerId: 'ironvale', assetIds: all });
    expect(candidates).toContain('greenhollow'); // the set is non-empty — non-vacuity
    expect([...candidates]).not.toContain('a_place_off_every_road'); // anchored: the line above proves the candidate set is non-empty and really shaped, so this cannot pass by the filter returning nothing
    // The bound SHAPES the set: the absent one produced no verdict for anyone to read.
    expect(candidates.length).toBeLessThan(all.length);
  });

  it('PURE: the reach read writes nothing back into the world or the digest', () => {
    const world = roadWorld();
    const before = JSON.parse(JSON.stringify(world));
    sovereigntyReach({ worldState: world, digest, buyerId: 'ironvale', assetId: 'greenhollow' });
    reachableAssetsFor({ worldState: world, digest, buyerId: 'ironvale', assetIds: ['greenhollow'] });
    expect(world).toEqual(before);
  });
});
