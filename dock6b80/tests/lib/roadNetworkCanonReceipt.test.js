/**
 * roadNetworkCanonReceipt.test.js — WEAVE SEAM-4, THE S4 COMPARISON RECEIPT
 * (docs/DESIGN_FMG_WEAVE.md §3 W-SEAM, A1.2.13's "home named at dispatch").
 *
 * ── WHAT THIS FILE IS, AND WHAT IT DELIBERATELY IS NOT ──────────────────────
 * THE REALM HAS TWO ROAD NETWORKS AND THEY ARE NOT THE SAME NETWORK.
 *
 *   · THE CANON TIER, frozen at canonize: `buildSpatialDigest` partitions the pack
 *     into one territory per settlement and records `gates` — the cheapest crossing
 *     between every pair of ADJACENT territories. Those are the realm's PRIMARY
 *     HOPS, and they are what the simulation travels: `pathCost`, `hopWeeks`, the
 *     distance matrix, every modulation seam that asks how far apart two places are.
 *   · THE RENDER TIER, derived per paint: `computeRoadEdges` draws a highway MST
 *     over the city+ seats, trade roads along relationships and supply chains,
 *     a country lane out of every unconnected placement, and NET-1's Urquhart
 *     supergraph over both node sets. Those are the roads a DM actually SEES.
 *
 * Nothing has ever compared them. Each tier is internally consistent and each has
 * its own suites, so a divergence between what the map draws and what the engine
 * travels is invisible from inside either one — the shape §710.6 records as a census
 * that asks whether a mark exists without asking whether it is on the thing it
 * means. This file is the receipt: ONE fixture pack, ONE set of placements, both
 * derivations, and the overlap counted.
 *
 * ⛔ IT ASSERTS NO INVARIANT, AND THAT IS DELIBERATE. The two tiers are ALLOWED to
 * disagree — they answer different questions, and a road network that drew every
 * territory border would be a Voronoi diagram rather than a map. So there is no
 * production rule here to guard and this file carries no enforcer nomenclature
 * (census/ratchet/walker/contract/…); it is a MEASUREMENT RECORD whose figures are
 * asserted so that a change in either tier has to be looked at rather than absorbed.
 * If a later wave promotes one of these numbers into a rule, the rename into the
 * enforcer vocabulary and its mutation-manifest bill ride that act.
 *
 * ── THE FINDING, FOR THE DOCKET ─────────────────────────────────────────────
 * The volume asks that the product-legend decision go to the docket "only if the
 * receipt finds divergence users would see". IT DOES. On a 40x30 realm with 40
 * seats: 92 primary hops, 67 drawn roads, and THIRTY-THREE PRIMARY HOPS CARRY NO
 * ROAD AT ALL — a third of the pairs the simulation treats as immediate neighbours
 * are pairs the map shows nothing between. Eight drawn roads are not primary hops,
 * which is the same gap in the other direction. A DM reading the map cannot tell
 * which places the engine considers next door, and no legend says so.
 *
 * ⭐ AND THE GAP IS ALREADY CLOSING, WHICH IS THE OTHER HALF OF THE RECEIPT: NET-1's
 * Urquhart pass takes hop coverage from 33% to 64% on that realm, roughly doubling
 * the share of the engine's neighbour graph the map actually draws. Recorded here
 * so the next wave has a number to move rather than an impression to argue with.
 */
import { describe, it, expect } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { computeRoadEdges } from '../../src/lib/roadNetwork.js';

/** The unordered pair key both tiers are compared on. */
const pk = (a, b) => (String(a) <= String(b) ? `${a}|${b}` : `${b}|${a}`);

/** The six tiers, cycled so the MST's city+ node set is non-empty and realistic. */
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

/**
 * ONE realm, read by BOTH tiers. The placements are the same objects in both
 * directions — the digest consumes `[{ id, cellId }]` and the render tier consumes
 * a burgId-keyed map of coordinates — so the two networks are derived from the same
 * geography and the same seats, which is the whole premise of the comparison.
 */
function realm(seats, { cols = 40, rows = 30 } = {}) {
  const pack = makeGridPack({ cols, rows });
  const placements = placeSettlements(pack, seats);
  const digest = buildSpatialDigest({ pack, placements });

  const saves = placements.map((p, i) => ({
    id: p.id,
    settlement: { tier: TIERS[i % TIERS.length], config: {}, institutions: [], neighbourNetwork: [] },
  }));
  /** @type {Record<string, { settlementId: string, x: number, y: number }>} */
  const mapPlacements = {};
  for (const p of placements) {
    const [x, y] = pack.cells.p[p.cellId];
    mapPlacements[p.id] = { settlementId: p.id, x, y };
  }
  const roads = computeRoadEdges(saves, mapPlacements);

  const primaryHops = new Set(digest.gates.map(g => pk(g.between[0], g.between[1])));
  const drawn = new Set(roads.map(e => pk(e.fromBurgId, e.toBurgId)));
  // The same render tier with NET-1's supergraph withheld — the pre-NET-1 map.
  const drawnBeforeNet1 = new Set(
    roads.filter(e => e.reason !== 'urquhart').map(e => pk(e.fromBurgId, e.toBurgId)),
  );
  const covered = (set) => [...primaryHops].filter(h => set.has(h)).length;

  return { pack, placements, digest, roads, primaryHops, drawn, drawnBeforeNet1, covered };
}

describe('WEAVE SEAM-4 — the S4 canon-vs-render comparison receipt', () => {
  it('both tiers really are reading the same realm (the premise, before any count)', () => {
    // ANTI-VACUITY FIRST. A receipt whose two sets were derived from different
    // geographies, or one of which was empty, would report a divergence that meant
    // nothing at all. Same pack, same seats, both networks populated, and the two
    // sets genuinely overlap rather than being disjoint vocabularies.
    const r = realm(24);
    expect(r.placements).toHaveLength(24);
    expect(r.digest.settlementIds).toEqual(r.placements.map(p => p.id));
    expect(r.primaryHops.size).toBeGreaterThan(0);
    expect(r.drawn.size).toBeGreaterThan(0);
    expect(r.covered(r.drawn)).toBeGreaterThan(0);
    // Both tiers key on the settlement id, so a pair from one is spellable in the
    // other. If this ever stopped holding, every figure below would silently read
    // zero overlap and look like total divergence.
    for (const hop of r.primaryHops) {
      const [a, b] = hop.split('|');
      expect(r.digest.settlementIds).toContain(a);
      expect(r.digest.settlementIds).toContain(b);
    }
  });

  it('THE RECEIPT: a third of the realm\'s primary hops carry no drawn road', () => {
    // ⛔ THE FIGURES ARE ASSERTED, NOT DESCRIBED. Prose drifts from the tree; an
    // integer cannot. A change in either derivation moves these and someone has to
    // look — which is the entire job of a comparison receipt.
    const small = realm(24);
    expect(small.primaryHops.size).toBe(41);
    expect(small.roads).toHaveLength(35);
    expect(small.covered(small.drawn)).toBe(23);          // 56% of the hops
    expect(small.primaryHops.size - small.covered(small.drawn)).toBe(18);

    const large = realm(40);
    expect(large.primaryHops.size).toBe(92);
    expect(large.roads).toHaveLength(67);
    expect(large.covered(large.drawn)).toBe(59);          // 64% of the hops
    expect(large.primaryHops.size - large.covered(large.drawn)).toBe(33);
  });

  it('and the gap runs the other way too: roads the canon does not call a border', () => {
    // The mirror of the count above, and the reason "every primary hop drawn or
    // documented" cannot be the whole contract: the render tier also draws pairs the
    // canon considers two hops apart — a highway MST edge between distant cities, a
    // supply-chain trade road, a country lane to a peer across someone else's
    // territory. Those are legitimate roads. They are recorded, not deprecated.
    const small = realm(24);
    const large = realm(40);
    const notAHop = (r) => [...r.drawn].filter(d => !r.primaryHops.has(d)).length;
    expect(notAHop(small)).toBe(12);
    expect(notAHop(large)).toBe(8);
    // Every one of them is a road some pass had a reason to draw — no road exists
    // without a typed reason, which is what makes "not a border" a documentation
    // problem rather than a correctness one.
    for (const e of large.roads) expect(typeof e.reason).toBe('string');
    expect(new Set(large.roads.map(e => e.reason.split(':')[0])))
      .toEqual(new Set(['mst', 'nearest', 'urquhart']));
  });

  it('⭐ NET-1\'s Urquhart pass roughly DOUBLES the share of the engine\'s neighbour graph the map draws', () => {
    // The credit half of the receipt, and the number the next wave gets to move.
    // Withholding the supergraph reproduces the pre-NET-1 map exactly (the pass runs
    // LAST and only ever appends, so its edges are separable by reason alone).
    const large = realm(40);
    expect(large.covered(large.drawnBeforeNet1)).toBe(30);   // 33% of 92
    expect(large.covered(large.drawn)).toBe(59);             // 64% of 92
    expect(large.covered(large.drawn)).toBeGreaterThan(large.covered(large.drawnBeforeNet1) * 1.9);

    const small = realm(24);
    expect(small.covered(small.drawnBeforeNet1)).toBe(14);   // 34% of 41
    expect(small.covered(small.drawn)).toBe(23);             // 56% of 41
    // Anti-vacuity: the withheld set is a PROPER subset, so the comparison above is
    // between two different maps and not the same one twice.
    expect(large.drawnBeforeNet1.size).toBeLessThan(large.drawn.size);
  });
});
