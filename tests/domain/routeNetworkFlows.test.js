/**
 * routeNetworkFlows.test.js — W-J slice J2, THE FLOW LEDGER
 * (docs/DESIGN_ROUTE_LIFECYCLE.md §4, and §3's bounded candidate law).
 *
 * The four claims J2 has to survive, and the reason each one is a pin rather than
 * a comment:
 *
 *   1. ATTRIBUTION. Each class credits ONLY its own movers. The fixture fires all
 *      three at once precisely because a single-class fixture cannot catch a
 *      cross-credit: with only migration running, a bug that credited migration to
 *      `goods` would still show a populated ledger and a plausible band.
 *   2. THE BOUNDED CANDIDATE LAW. Flow is evidence, and evidence may not mint
 *      unbounded state. The fixture deliberately fires a traversal across a pair
 *      the candidate set excludes, so the refusal is measured rather than assumed.
 *   3. RECEIPTS-FIRST. §4 says every band step names its contributing flows. A band
 *      above `none` with an empty receipt list is the failure this checks for, over
 *      every class of every record, not over a sampled one.
 *   4. DORMANCY AND ROUND-TRIP. Dark returns the input object BY REFERENCE, and a
 *      persisted ledger rebuilds byte-identically.
 *
 * THE FIXTURE is aspatial and seven-seated on purpose. Aspatial keeps the digest
 * out of the reading (this file is about counting, not geometry), and seven seats
 * is the smallest membership where the k-nearest candidate set is a PROPER subset
 * of all pairs (13 of 21 here), which is what makes the bounded-law probe real
 * instead of vacuous.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  accrueRouteFlows,
  admissibleCorridors,
  edgeIdForPair,
  emptyFlowAccrual,
  flowBand,
  flowClassOfSource,
  flowMembersFromSnapshot,
  militaryTraversals,
  populationTraversals,
  withFlowStep,
  ROUTE_FLOW_BANDS,
  ROUTE_FLOW_SOURCES,
  ROUTE_FLOW_TUNING,
} from '../../src/domain/worldPulse/routeNetworkFlows.js';
import {
  ROUTE_FLOW_CLASSES,
  corridorId,
  readCorridors,
  readRouteEdges,
  readRouteNetwork,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { ensureGenesisRouteNetwork } from '../../src/domain/worldPulse/routeNetworkGenesis.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const SEATS = [
  ['ashfen', 'crossroads', ['iron'], ['grain']],
  ['brackwater', 'road', ['grain'], ['iron']],
  ['coldhollow', 'mountain_pass', ['grain'], ['timber']],
  ['dunmoor', 'isolated', ['grain'], []],
  ['eastmarch', 'road', ['timber'], ['grain']],
  ['fallowmere', 'isolated', [], ['wool']],
  ['greyhythe', 'road', ['wool'], ['grain']],
];

/** The snapshot shape the pulse hands this layer: `{ id, settlement }`. */
const SNAPSHOT = SEATS.map(([id, access, imports, exports]) => ({
  id,
  settlement: {
    config: { tradeRouteAccess: access },
    economicState: { primaryImports: imports, primaryExports: exports },
  },
}));

const MEMBERS = flowMembersFromSnapshot(SNAPSHOT);

/** A world in the two flag states, with the genesis network already derived. */
function worldFor(lit) {
  const base = {
    simulationRules: lit ? { routeLifecycleEnabled: true } : {},
    tick: 0,
    campaignId: 'route-flows',
  };
  return ensureGenesisRouteNetwork(base, MEMBERS.map(m => ({ id: m.id, config: m.config })), 0);
}

/**
 * THE THREE MOVERS, ALL FIRING AT ONCE. Each row is a ledger some existing mover
 * wrote for its own reasons; nothing here is a route-lifecycle invention.
 *   - `ashfen -> dunmoor` is ADMISSIBLE with NO EDGE (dunmoor was founded isolated,
 *     so the genesis ladder minted it no road), which is the corridor case.
 *   - `ashfen -> brackwater` CARRIES an edge, which is the usage case.
 *   - `ashfen -> eastmarch` is OUTSIDE the candidate set, which is the refusal case.
 */
function withMovers(world) {
  return {
    ...world,
    spatialLedgers: {
      ...(world.spatialLedgers || {}),
      migration: {
        'col.a': { originId: 'ashfen', destId: 'dunmoor', arrivals: 640 },
        'col.b': { originId: 'ashfen', destId: 'brackwater', arrivals: 12 },
        'col.c': { originId: 'ashfen', destId: 'eastmarch', arrivals: 90 },
      },
      roads: {
        missions: {
          'm.1': { homeId: 'greyhythe', destId: 'coldhollow', path: ['greyhythe', 'eastmarch', 'coldhollow'] },
        },
      },
      armyTransit: {
        greyhythe: { originId: 'greyhythe', destId: 'coldhollow', path: ['greyhythe', 'eastmarch', 'coldhollow'] },
      },
      supplyShipments: {
        'l.1': { settlementId: 'brackwater', sourceId: 'ashfen', input: 'grain', arrivalTick: 6, starving: false },
        'l.2': { settlementId: 'coldhollow', sourceId: '', input: 'grain', arrivalTick: -1, starving: true },
      },
    },
    deployments: {
      brackwater: { targetId: 'coldhollow' },
    },
  };
}

const LIT = withMovers(worldFor(true));
const ACCRUED = accrueRouteFlows({ worldState: LIT, members: MEMBERS, tick: 9 });
const ADMISSIBLE = admissibleCorridors({
  members: MEMBERS, worldState: LIT, network: readRouteNetwork(LIT),
});

/** Every accrual record on a world, corridors and edge usage alike. */
function everyAccrual(world) {
  /** @type {Array<{ where: string, accrual: Record<string, unknown> }>} */
  const rows = [];
  for (const [id, corridor] of Object.entries(readCorridors(world))) {
    rows.push({ where: id, accrual: corridor });
  }
  for (const [id, edge] of Object.entries(readRouteEdges(world))) {
    if (edge.usage) rows.push({ where: id, accrual: edge.usage });
  }
  return rows;
}

describe('J2 the fixture really fires all three classes (anti-vacuity)', () => {
  it('accrues, and names all three classes in one pulse', () => {
    expect(ACCRUED.changed).toBe(true);
    expect(Object.keys(ACCRUED.byClass).sort()).toEqual(['goods', 'military', 'population']);
    for (const flowClass of ROUTE_FLOW_CLASSES) {
      expect(ACCRUED.byClass[flowClass], `${flowClass} never fired`).toBeGreaterThan(0);
    }
  });

  it('writes both a corridor and an edge usage record, so neither path is untested', () => {
    expect(ACCRUED.corridorsTouched).toBeGreaterThan(0);
    expect(ACCRUED.edgesTouched).toBeGreaterThan(0);
    expect(everyAccrual(ACCRUED.worldState).length)
      .toBe(ACCRUED.corridorsTouched + ACCRUED.edgesTouched);
  });
});

describe('J2 attribution: a class credits only its own movers', () => {
  it('the source table is closed, total, and maps only into the three named classes', () => {
    const sources = Object.keys(ROUTE_FLOW_SOURCES).sort();
    const weights = Object.keys(
      /** @type {Record<string, number>} */ (ROUTE_FLOW_TUNING.SOURCE_WEIGHT),
    ).sort();
    // Manifest pin: a source with no weight accrues nothing forever, and a weight
    // with no source is a tuning band nothing reads. They must move together.
    expect(sources).toEqual(weights);
    for (const source of sources) {
      expect(ROUTE_FLOW_CLASSES, `${source} maps outside the three named classes`)
        .toContain(ROUTE_FLOW_SOURCES[source]);
    }
  });

  it('every receipt on every record names only sources of that record\'s own class', () => {
    const rows = everyAccrual(ACCRUED.worldState);
    expect(rows.length).toBeGreaterThan(0);
    /** @type {Array<string>} */
    const crossCredits = [];
    for (const row of rows) {
      const receipts = /** @type {Record<string, Array<string>>} */ (row.accrual.receipts);
      for (const [flowClass, sources] of Object.entries(receipts)) {
        for (const source of sources) {
          if (flowClassOfSource(source) !== flowClass) {
            crossCredits.push(`${row.where}: ${source} credited ${flowClass}`);
          }
        }
      }
    }
    expect(crossCredits, `a mover credited a class it does not own: ${crossCredits.join('; ')}`)
      .toEqual([]);
  });

  it('the population extractor emits population sources and nothing else', () => {
    const sources = new Set(populationTraversals(LIT, new Set(MEMBERS.map(m => m.id)))
      .map(t => t.source));
    expect(sources.size).toBeGreaterThan(0);
    for (const source of sources) expect(ROUTE_FLOW_SOURCES[source]).toBe('population');
  });

  it('the military extractor emits military sources and nothing else', () => {
    const sources = new Set(militaryTraversals(LIT, new Set(MEMBERS.map(m => m.id)))
      .map(t => t.source));
    expect(sources.size).toBeGreaterThan(0);
    for (const source of sources) expect(ROUTE_FLOW_SOURCES[source]).toBe('military');
  });

  it('an unknown mover is refused rather than landing in whichever class is first', () => {
    const stepped = withFlowStep(emptyFlowAccrual(), 'sightseeing', 9);
    expect(flowClassOfSource('sightseeing')).toBe(null);
    expect(stepped.tally).toEqual({});
    // anchored: the assertion above proves the SAME call shape populates nothing for
    // an unknown source, and the next line proves a known source populates it, so the
    // empty tally measures a refusal rather than a helper that never writes at all.
    expect(withFlowStep(emptyFlowAccrual(), 'migration', 9).tally).toEqual({ population: 9 });
  });

  it('a goods mover cannot move the population tally (the cross-credit, executed)', () => {
    const goods = withFlowStep(emptyFlowAccrual(), 'shipment', 40);
    expect(goods.tally.goods).toBe(40);
    expectAbsentWithAnchor(
      Object.keys(goods.tally), 'population', 'goods',
      'a shipment credited the population class, which means attribution stopped'
      + ' reading ROUTE_FLOW_SOURCES',
    );
  });
});

describe('J2 the bounded candidate law holds under flow-driven corridors', () => {
  it('the candidate set is a PROPER subset of all pairs (the probe is real)', () => {
    const allPairs = (MEMBERS.length * (MEMBERS.length - 1)) / 2;
    expect(ADMISSIBLE.pairs.size).toBeLessThan(allPairs);
    expect(ADMISSIBLE.pairs.size).toBeGreaterThan(0);
  });

  it('every corridor the accrual wrote is an admissible pair', () => {
    const written = Object.keys(readCorridors(ACCRUED.worldState));
    expect(written.length).toBeGreaterThan(0);
    for (const id of written) {
      expect(ADMISSIBLE.pairs.has(id), `${id} is not in the bounded candidate set`).toBe(true);
    }
  });

  it('the corridor ledger can never exceed the structural bound', () => {
    expect(Object.keys(readCorridors(ACCRUED.worldState)).length)
      .toBeLessThanOrEqual(ADMISSIBLE.bound);
  });

  it('an off-network traversal is REFUSED and counted, never silently dropped', () => {
    const offPair = corridorId('ashfen', 'eastmarch');
    expect(ADMISSIBLE.pairs.has(offPair)).toBe(false);
    expect(ACCRUED.offNetwork).toBeGreaterThan(0);
    expectAbsentWithAnchor(
      Object.keys(readCorridors(ACCRUED.worldState)), offPair,
      corridorId('ashfen', 'dunmoor'),
      'an inadmissible pair entered the corridor ledger, which is the unbounded'
      + ' all-pairs growth the B1 quadratic lesson forbids',
    );
  });

  it('the refusal count and the accrual count together explain every traversal', () => {
    expect(ACCRUED.accrued + ACCRUED.offNetwork).toBe(ACCRUED.traversals);
  });
});

describe('J2 routing: corridors are for pairs with no road, usage for pairs with one', () => {
  it('an admissible pair with NO edge accrues onto the corridor', () => {
    const id = corridorId('ashfen', 'dunmoor');
    expect(edgeIdForPair(readRouteNetwork(LIT), 'ashfen', 'dunmoor')).toBe(null);
    const corridor = readCorridors(ACCRUED.worldState)[id];
    expect(corridor).toBeTruthy();
    expect(corridor.tally.population).toBeGreaterThan(0);
    expect(corridor.sinceTick).toBe(9);
    // J2 measures and J3 evaluates: the cursor must not move here, or the charter
    // pass would believe a corridor had been considered when nothing considered it.
    expect(corridor.lastCharterEval).toBe(9);
  });

  it('a pair that CARRIES an edge accrues onto the edge, not into a corridor', () => {
    const edgeId = edgeIdForPair(readRouteNetwork(LIT), 'ashfen', 'brackwater');
    expect(edgeId).toBe('route.ashfen.brackwater.land');
    const edge = readRouteEdges(ACCRUED.worldState)[edgeId];
    expect(edge.usage).toBeTruthy();
    expect(edge.usage.lastTick).toBe(9);
    expectAbsentWithAnchor(
      Object.keys(readCorridors(ACCRUED.worldState)), corridorId('ashfen', 'brackwater'),
      corridorId('ashfen', 'dunmoor'),
      'a pair with a road accrued corridor DEMAND, which would let an existing edge'
      + ' be chartered a second time',
    );
  });

  it('usage is a CONDITIONAL key: absent at genesis, present only once flow walks', () => {
    // The transition, not the absence: the genesis network is the honest before-state,
    // and the after-state below proves the same function can write the key at all.
    const born = readRouteEdges(LIT);
    expect(Object.keys(born).length).toBeGreaterThan(0);
    for (const [id, edge] of Object.entries(born)) {
      expect('usage' in edge, `${id} carried usage before a single flow ran`).toBe(false);
    }
    expect(Object.values(readRouteEdges(ACCRUED.worldState)).filter(e => e.usage).length)
      .toBeGreaterThan(0);
  });

  it('an edge nobody walked keeps NO usage key while its neighbour gains one', () => {
    // One mover, one pair: brackwater marches on coldhollow and nothing else moves.
    const lonely = { ...worldFor(true), deployments: { brackwater: { targetId: 'coldhollow' } } };
    const out = accrueRouteFlows({ worldState: lonely, members: MEMBERS, tick: 3 });
    const edges = readRouteEdges(out.worldState);
    const walked = Object.entries(edges).filter(([, edge]) => edge.usage).map(([id]) => id);
    expect(walked).toEqual(['route.brackwater.coldhollow.land']);
    const unwalked = Object.entries(edges).filter(([, edge]) => !edge.usage);
    expect(unwalked.length).toBeGreaterThan(0);
    for (const [id, edge] of unwalked) {
      expect('usage' in edge, `${id} grew a usage key without being walked`).toBe(false);
    }
  });
});

describe('J2 receipts-first: no band step without its contributing flows (§4)', () => {
  it('every class present carries a positive tally, a real band, and named sources', () => {
    const rows = everyAccrual(ACCRUED.worldState);
    expect(rows.length).toBeGreaterThan(0);
    /** @type {Array<string>} */
    const silent = [];
    for (const row of rows) {
      const flows = /** @type {Record<string, string>} */ (row.accrual.flows);
      const tally = /** @type {Record<string, number>} */ (row.accrual.tally);
      const receipts = /** @type {Record<string, Array<string>>} */ (row.accrual.receipts);
      expect(Object.keys(flows).sort()).toEqual(Object.keys(tally).sort());
      for (const [flowClass, band] of Object.entries(flows)) {
        expect(ROUTE_FLOW_BANDS).toContain(band);
        if (band === 'none') silent.push(`${row.where}.${flowClass} persisted a none band`);
        if (tally[flowClass] <= 0) silent.push(`${row.where}.${flowClass} banded a zero tally`);
        if (!receipts[flowClass] || receipts[flowClass].length === 0) {
          silent.push(`${row.where}.${flowClass} moved a band with no receipt`);
        }
        if (band !== flowBand(tally[flowClass])) {
          silent.push(`${row.where}.${flowClass} band disagrees with its own tally`);
        }
      }
    }
    expect(silent, silent.join('; ')).toEqual([]);
  });

  it('a goods flow names the GOOD it moved, in the catalog vocabulary', () => {
    const rows = everyAccrual(ACCRUED.worldState)
      .filter(row => /** @type {Record<string, number>} */ (row.accrual.tally).goods > 0);
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      const goods = /** @type {Array<string>} */ (row.accrual.reasonGoods || []);
      expect(goods.length, `${row.where} counted goods with no good named`).toBeGreaterThan(0);
    }
  });

  it('a military-only record names no goods at all (drop-when-empty)', () => {
    const rows = everyAccrual(ACCRUED.worldState).filter((row) => {
      const tally = /** @type {Record<string, number>} */ (row.accrual.tally);
      return !tally.goods && (tally.military || 0) > 0;
    });
    expect(rows.length, 'no military-only record exists, so the drop is untested')
      .toBeGreaterThan(0);
    for (const row of rows) expect('reasonGoods' in row.accrual).toBe(false);
  });
});

describe('J2 dormancy: a dark world is the input world (Law 7)', () => {
  it('returns the INPUT object by reference, not an equal copy', () => {
    const dark = withMovers(worldFor(false));
    const out = accrueRouteFlows({ worldState: dark, members: MEMBERS, tick: 9 });
    expect(out.worldState).toBe(dark);
    expect(out.changed).toBe(false);
  });

  it('counts nothing at all on a dark world', () => {
    const dark = withMovers(worldFor(false));
    const out = accrueRouteFlows({ worldState: dark, members: MEMBERS, tick: 9 });
    expect(out).toMatchObject({ traversals: 0, accrued: 0, corridorsTouched: 0, edgesTouched: 0 });
    // anchored: the lit fixture above runs the SAME movers through the SAME function
    // and accrues, so these zeros measure the gate rather than an empty ledger set.
    expect(ACCRUED.accrued).toBeGreaterThan(0);
  });

  it('a dark world grows no route ledger even with every mover populated', () => {
    const dark = withMovers(worldFor(false));
    const out = accrueRouteFlows({ worldState: dark, members: MEMBERS, tick: 9 });
    expect(readRouteNetwork(out.worldState)).toBe(null);
  });
});

describe('J2 the layer takes no entropy and no clock (§1 Law 7, structural)', () => {
  const LEAVES = [
    'routeNetworkFlows.js',
    'routeNetworkFlowsMaterial.js',
    'routeNetworkFlowsObjective.js',
    'routeNetworkFlowsSelfSufficiency.js',
  ];

  it.each(LEAVES)('%s reaches for no ambient anything', (leaf) => {
    const src = readFileSync(join(ROOT, 'src', 'domain', 'worldPulse', leaf), 'utf8');
    // Comments are stripped first, because this file's own prose discusses RNG and a
    // scan that read its documentation would be measuring the wrong thing.
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/[^\n]*/g, '$1');
    for (const forbidden of ['Math.random', 'Date.now', 'new Date', 'performance.now']) {
      expect(code.includes(forbidden), `${leaf} reaches for ${forbidden}`).toBe(false);
    }
    // anchored: comment-stripping is the step that could silently empty this scan, so
    // the surviving code must still carry real exports. A clean reading therefore
    // cannot be a file that failed to load or a regex that ate the whole body.
    expect((code.match(/export function/g) || []).length).toBeGreaterThan(1);
  });

  /**
   * A PROPERTY STATEMENT, and its limits are stated because a green that proves
   * nothing is worse than no test. Removing either the extractor's key sort or the
   * accrual's traversal sort leaves this passing, and that was MEASURED, not
   * assumed. The reason is that the accrual is COMMUTATIVE by construction: every
   * step is an integer add, every band is re-derived from the running total rather
   * than from the step, the receipt lists are sets, and the reasonGoods cap keeps
   * the codepoint-lowest members of everything ever seen, which is order-free by
   * induction. The record is then written through sortedRecord, so even key order
   * is normalized.
   *
   * So what this pin actually guards is the FUTURE: J3 adds charter evaluation and
   * decay, and the first step that reads "the previous traversal" or takes a seeded
   * draw per traversal breaks commutativity and reds here. The sorts stay because
   * they are what makes that break loud instead of silent.
   */
  it('the same movers in a DIFFERENT ledger key order produce the identical ledger', () => {
    const reversed = Object.entries(LIT.spatialLedgers.migration).reverse();
    // anti-vacuity: the shuffle has to have actually shuffled something.
    expect(reversed.map(([key]) => key))
      .not.toEqual(Object.keys(LIT.spatialLedgers.migration));
    const shuffled = {
      ...LIT,
      spatialLedgers: { ...LIT.spatialLedgers, migration: Object.fromEntries(reversed) },
    };
    const out = accrueRouteFlows({ worldState: shuffled, members: MEMBERS, tick: 9 });
    expect(JSON.stringify(readRouteNetwork(out.worldState)))
      .toBe(JSON.stringify(readRouteNetwork(ACCRUED.worldState)));
  });

  it('the ledger serializes in codepoint key order, so a reload cannot reorder it', () => {
    const network = readRouteNetwork(ACCRUED.worldState);
    expect(Object.keys(network.corridor)).toEqual([...Object.keys(network.corridor)].sort());
    expect(Object.keys(network.edges)).toEqual([...Object.keys(network.edges)].sort());
  });

  it('and the same world accrued twice from the same start lands identically', () => {
    const again = accrueRouteFlows({ worldState: LIT, members: MEMBERS, tick: 9 });
    expect(JSON.stringify(readRouteNetwork(again.worldState)))
      .toBe(JSON.stringify(readRouteNetwork(ACCRUED.worldState)));
  });
});

describe('J2 the ledger survives persistence (§11)', () => {
  const roundTripped = JSON.parse(JSON.stringify(ACCRUED.worldState));

  it('corridors and edge usage rebuild identically from JSON', () => {
    expect(readCorridors(roundTripped)).toEqual(readCorridors(ACCRUED.worldState));
    expect(readRouteEdges(roundTripped)).toEqual(readRouteEdges(ACCRUED.worldState));
  });

  it('a second pulse over the RELOADED world lands where it lands over the live one', () => {
    const fromLive = accrueRouteFlows({
      worldState: withMovers(ACCRUED.worldState), members: MEMBERS, tick: 10,
    });
    const fromSave = accrueRouteFlows({
      worldState: withMovers(roundTripped), members: MEMBERS, tick: 10,
    });
    expect(JSON.stringify(readRouteNetwork(fromSave.worldState)))
      .toBe(JSON.stringify(readRouteNetwork(fromLive.worldState)));
  });

  it('accrual ACCUMULATES across pulses rather than replacing (the alias trap)', () => {
    const second = accrueRouteFlows({
      worldState: withMovers(ACCRUED.worldState), members: MEMBERS, tick: 10,
    });
    const id = corridorId('ashfen', 'dunmoor');
    const before = readCorridors(ACCRUED.worldState)[id].tally.population;
    const after = readCorridors(second.worldState)[id].tally.population;
    expect(after).toBe(before * 2);
    // The corridor remembers when it was FIRST walked, not when it was last.
    expect(readCorridors(second.worldState)[id].sinceTick).toBe(9);
  });
});
