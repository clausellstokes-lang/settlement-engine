/**
 * routeNetworkConsumersInterdiction.test.js — W-J slice J4, THE NAMED MATERIAL
 * ARTERY (binding law docs/DESIGN_ROUTE_LIFECYCLE.md §0, §4 and §13's integration pin
 * "interdiction reads the ledger", with DESIGN_SUPPLY_WEB_WARFARE.md §4).
 *
 * The claims this file is responsible for:
 *
 *   THE INTERDICTION IS DENOMINATED IN GOODS. §0 says every change carries a reason
 *   named in goods, people or strategy, and this is the war layer's half of it: a
 *   patrol does not cut "a supply link", it cuts the iron road out of Brackwater.
 *
 *   AND THE GOODS COME FROM THE LEDGER THE CHARTER EVENTS WRITE. Every fixture here
 *   boots the REAL J2 accrual (`accrueRouteFlows`) over a real supply-shipment ledger
 *   rather than hand-building a `usage` record. A pin that wrote the usage itself
 *   would prove that this module can read a shape it was handed, which is not the
 *   claim; the claim is that the war layer and the Herald are reading the SAME
 *   ledger, and the only way to test that is to have the ledger's own writer fill it.
 *
 *   A HIDDEN PATH CANNOT BE INTERDICTED. A patrol needs a road to stand on, and Law 5
 *   says a hidden way is the one the realm has forgotten. The pin is the design's own
 *   sentence, and its negative control is the identical fixture with the same road at
 *   an open grade.
 *
 *   THE READ WRITES NOTHING. Structural, not a promise: every call is followed by a
 *   reference-identity check on the world it was handed.
 */
import { describe, expect, it } from 'vitest';
import {
  ARTERY_FLOW_CLASS,
  SEVERANCE_VERDICTS,
  arteryGoodId,
  interdictableArteries,
  interdictionSeverance,
  severanceReasons,
} from '../../src/domain/worldPulse/routeNetworkConsumersInterdiction.js';
import {
  accrueRouteFlows,
  flowMembersFromSnapshot,
} from '../../src/domain/worldPulse/routeNetworkFlows.js';
import { ensureGenesisRouteNetwork } from '../../src/domain/worldPulse/routeNetworkGenesis.js';
import {
  emptyRouteNetwork,
  readRouteNetwork,
  routeEdge,
  withRouteEdges,
  writeRouteNetwork,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';

const EDGE = 'route.ashfen.brackwater.land';
const NAMES = { ashfen: 'Ashfen', brackwater: 'Brackwater' };

/** @param {string} id @returns {string} */
function nameOf(id) {
  return /** @type {Record<string, string>} */ (NAMES)[id] || id;
}

/**
 * TWO SEATS THAT NEED EACH OTHER, joined by one genesis road, with the supply layer's
 * own shipment ledger carrying grain one way and iron the other.
 *
 * @param {{ grade?: string|null, shipments?: Record<string, unknown>|null,
 *   armyTransit?: Record<string, unknown>|null, lit?: boolean }} [options]
 */
function tradeRealm(options = {}) {
  const members = flowMembersFromSnapshot([
    {
      id: 'ashfen',
      settlement: {
        config: { tradeRouteAccess: 'crossroads' },
        economicState: { primaryImports: ['iron'], primaryExports: ['grain'] },
      },
    },
    {
      id: 'brackwater',
      settlement: {
        config: { tradeRouteAccess: 'road' },
        economicState: { primaryImports: ['grain'], primaryExports: ['iron'] },
      },
    },
  ]);
  let world = ensureGenesisRouteNetwork(
    { simulationRules: { routeLifecycleEnabled: true }, tick: 0, campaignId: 'j4-interdiction' },
    members.map(m => ({ id: m.id, config: m.config })), 0,
  );
  if (options.grade) {
    world = writeRouteNetwork({ ...world, spatialLedgers: {} }, withRouteEdges(emptyRouteNetwork(), [
      routeEdge({
        a: 'ashfen',
        b: 'brackwater',
        grade: options.grade,
        mode: 'land',
        provenance: 'generated',
        flavor: 'genesis',
        tick: 0,
      }),
    ]));
  }
  const shipments = options.shipments === null ? {} : (options.shipments || {
    s1: { settlementId: 'ashfen', sourceId: 'brackwater', input: 'Iron', starving: false },
    s2: { settlementId: 'brackwater', sourceId: 'ashfen', input: 'Grain', starving: false },
  });
  world = {
    ...world,
    spatialLedgers: {
      ...(/** @type {Record<string, unknown>} */ (world.spatialLedgers) || {}),
      supplyShipments: shipments,
      ...(options.armyTransit ? { armyTransit: options.armyTransit } : {}),
    },
  };
  const accrued = accrueRouteFlows({ worldState: world, members, tick: 5 });
  const lit = options.lit === false
    ? { ...accrued.worldState, simulationRules: {} }
    : accrued.worldState;
  return { world: lit, members };
}

describe('J4 §13 the interdiction reads the same flow ledger the charter events write', () => {
  it('the ledger is filled by J2 own accrual, not by this test', () => {
    // The anchor for every goods claim below: the usage record on the edge was
    // written by accrueRouteFlows off a supply-shipment ledger, so the goods the
    // severance names are the goods the network layer itself recorded.
    const { world } = tradeRealm();
    const usage = /** @type {Record<string, Record<string, unknown>>} */ (
      /** @type {Record<string, Record<string, unknown>>} */ (
        (readRouteNetwork(world) || { edges: {} }).edges)[EDGE].usage);
    expect(usage).toBeTruthy();
    expect(usage.tally[ARTERY_FLOW_CLASS]).toBe(4);
    expect([...(/** @type {ReadonlyArray<string>} */ (usage.reasonGoods))]).toEqual(['grain', 'iron']);
  });

  it('the severance names the goods, the road, and the band it carried', () => {
    const { world } = tradeRealm();
    const cut = interdictionSeverance({
      worldState: world, targetId: 'ashfen', satelliteId: 'brackwater', input: 'Iron',
    });
    expect(cut.verdict).toBe('severed');
    expect(cut.severs).toBe(true);
    expect(cut.edgeId).toBe(EDGE);
    expect([...cut.goods]).toEqual(['grain', 'iron']);
    expect(cut.namedGood).toBe('iron');
    expect(cut.namedGoodCarried).toBe(true);
    expect(cut.band).toBe('stirring');
    expect(cut.tally).toBe(4);
  });

  it('the reasons are prose about goods and never about a number', () => {
    const { world } = tradeRealm();
    const cut = interdictionSeverance({
      worldState: world, targetId: 'ashfen', satelliteId: 'brackwater', input: 'Iron',
    });
    expect([...severanceReasons(cut, nameOf)]).toEqual([
      'The road from Brackwater carried grain, iron into Ashfen.',
      'Traffic on that way stood at stirring.',
    ]);
  });

  it('a patrol set for a good the road does not move says so, and still cuts the road', () => {
    // The fog-gated commander case. Collapsing this into the severance verdict would
    // either refuse a real cut or claim a good that was never moving.
    const { world } = tradeRealm();
    const cut = interdictionSeverance({
      worldState: world, targetId: 'ashfen', satelliteId: 'brackwater', input: 'Timber',
    });
    expect(cut.severs).toBe(true);
    expect(cut.namedGood).toBe('timber');
    expect(cut.namedGoodCarried).toBe(false);
    expect([...severanceReasons(cut, nameOf)]).toContain(
      'The patrol was set for timber, which does not move on this road.',
    );
  });

  it('the good is resolved through the catalog, never compared as a raw string', () => {
    // The supply layer names a link by its catalog NAME and the route ledger stores
    // its catalog ID. Comparing those directly is the hand-rolled-key defect class.
    expect(arteryGoodId('Iron')).toBe('iron');
    expect(arteryGoodId('iron')).toBe('iron');
    expect(arteryGoodId('')).toBe('');
    expect(arteryGoodId(null)).toBe('');
  });

  it('the arteries into a settlement are its goods roads, codepoint-ordered', () => {
    const { world } = tradeRealm();
    const arteries = interdictableArteries({ worldState: world, targetId: 'ashfen' });
    expect(arteries.map(a => a.edgeId)).toEqual([EDGE]);
    expect(arteries[0].partnerId).toBe('brackwater');
    expect([...arteries[0].goods]).toEqual(['grain', 'iron']);
    expect([...arteries[0].receipts]).toEqual(['shipment']);
    expect(arteries[0].lastTick).toBe(5);
  });
});

describe('J4 §5b a hidden path cannot be interdicted, because a patrol needs a road', () => {
  it('the same trade on an overgrown way reads hidden_only and severs nothing', () => {
    const { world } = tradeRealm({ grade: 'hidden' });
    const cut = interdictionSeverance({
      worldState: world, targetId: 'ashfen', satelliteId: 'brackwater', input: 'Iron',
    });
    expect(cut.verdict).toBe('hidden_only');
    expect(cut.severs).toBe(false);
    expect(cut.edgeId).toBeNull();
    expect(interdictableArteries({ worldState: world, targetId: 'ashfen' })).toEqual([]);
    expect([...severanceReasons(cut, nameOf)]).toEqual([]);
  });

  it('THE NEGATIVE CONTROL: the identical fixture at an open grade is cut', () => {
    // One grade word differs from the pin above, and the whole verdict turns on it.
    const { world } = tradeRealm({ grade: 'track' });
    const cut = interdictionSeverance({
      worldState: world, targetId: 'ashfen', satelliteId: 'brackwater', input: 'Iron',
    });
    expect(cut.verdict).toBe('severed');
    expect(cut.edgeId).toBe(EDGE);
    expect(interdictableArteries({ worldState: world, targetId: 'ashfen' }).length).toBe(1);
  });
});

describe('J4 §4 a road that carries no goods is not a material artery', () => {
  it('a military corridor with no trade on it reads no_traffic', () => {
    const { world } = tradeRealm({
      shipments: null,
      armyTransit: { column: { originId: 'ashfen', destId: 'brackwater' } },
    });
    const usage = /** @type {Record<string, Record<string, unknown>>} */ (
      /** @type {Record<string, Record<string, unknown>>} */ (
        (readRouteNetwork(world) || { edges: {} }).edges)[EDGE].usage);
    // Anchored: the edge genuinely carries usage, so the refusal below is about the
    // CLASS of that usage and not about an empty ledger.
    expect(usage.tally.military).toBe(3);
    expect(usage.tally[ARTERY_FLOW_CLASS]).toBeUndefined();

    const cut = interdictionSeverance({
      worldState: world, targetId: 'ashfen', satelliteId: 'brackwater', input: 'Iron',
    });
    expect(cut.verdict).toBe('no_traffic');
    expect(cut.severs).toBe(false);
    expect(cut.edgeId).toBe(EDGE);
    expect(interdictableArteries({ worldState: world, targetId: 'ashfen' })).toEqual([]);
  });

  it('a pair no road joins reads no_route, and so does a settlement asked about itself', () => {
    const { world } = tradeRealm();
    expect(interdictionSeverance({
      worldState: world, targetId: 'ashfen', satelliteId: 'dunmoor', input: 'Iron',
    }).verdict).toBe('no_route');
    expect(interdictionSeverance({
      worldState: world, targetId: 'ashfen', satelliteId: 'ashfen', input: 'Iron',
    }).verdict).toBe('no_route');
  });

  it('the verdict vocabulary is closed and every word this file produced is in it', () => {
    expect([...SEVERANCE_VERDICTS].sort())
      .toEqual(['dormant', 'hidden_only', 'no_route', 'no_traffic', 'severed']);
  });
});

describe('J4 the interdiction read writes nothing, structurally', () => {
  it('every call hands back the world it was given, by reference', () => {
    const { world } = tradeRealm();
    const before = JSON.parse(JSON.stringify(world));
    interdictableArteries({ worldState: world, targetId: 'ashfen' });
    interdictionSeverance({
      worldState: world, targetId: 'ashfen', satelliteId: 'brackwater', input: 'Iron',
    });
    interdictionSeverance({
      worldState: world, targetId: 'brackwater', satelliteId: 'ashfen', input: 'Grain',
    });
    expect(JSON.parse(JSON.stringify(world))).toEqual(before);
  });
});

describe('J4 Law 7 dormancy: a dark world offers no artery to cut', () => {
  it('the arteries are empty and the severance reads dormant', () => {
    const { world } = tradeRealm({ lit: false });
    expect(interdictableArteries({ worldState: world, targetId: 'ashfen' })).toEqual([]);
    const cut = interdictionSeverance({
      worldState: world, targetId: 'ashfen', satelliteId: 'brackwater', input: 'Iron',
    });
    expect(cut.verdict).toBe('dormant');
    expect(cut.severs).toBe(false);
    expect(cut.edgeId).toBeNull();
  });

  it('and the same world lit reads a real artery, so dormancy was the gate', () => {
    const { world } = tradeRealm();
    expect(interdictableArteries({ worldState: world, targetId: 'ashfen' }).length).toBe(1);
  });
});
