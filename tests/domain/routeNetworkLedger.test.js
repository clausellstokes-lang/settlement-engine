/**
 * routeNetworkLedger.test.js — W-J slice J1, THE NETWORK LEDGER model
 * (docs/DESIGN_ROUTE_LIFECYCLE.md §1 Law 7, §3, §11).
 *
 * Four things this file proves, each with an executed negative control recorded in
 * the slice report:
 *   1. EDGE IDENTITY is deterministic, codepoint-ordered, and argument-order free.
 *   2. THE ONE EDGE-ID LAW: the whole of src/domain spells the identity exactly one
 *      way. The user-route lane (directive 3) implements §3 independently and the
 *      two must never drift, so the agreement is a SOURCE SCAN rather than an
 *      import — neither lane may own the other, and neither may break the other by
 *      refactoring.
 *   3. DROP-WHEN-EMPTY: an emptied network leaves no key, and no namespace either
 *      when it was the last sub-ledger. That is the byte-identity half of Law 7.
 *   4. THE JSON ROUND TRIP (§11): the ledger survives persistence with every
 *      accessor answering identically, INCLUDING the user-route immunity mark.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  PROVENANCE_GENERATED,
  PROVENANCE_USER,
  ROUTE_CHARTER_FLAVORS,
  ROUTE_FLOW_CLASSES,
  ROUTE_GRADES,
  ROUTE_MODES,
  ROUTE_NETWORK_LEDGER,
  corridorId,
  emptyRouteNetwork,
  isLifecycleImmune,
  isRouteNetworkEmpty,
  orderedRouteEndpoints,
  readCorridors,
  readRouteEdges,
  readRouteNetwork,
  routeEdge,
  routeEdgeId,
  routeLifecycleActive,
  withRouteEdges,
  writeRouteNetwork,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const anEdge = (over = {}) => routeEdge({
  a: 'brackwater', b: 'ashfen', grade: 'road', mode: 'land',
  provenance: PROVENANCE_GENERATED, flavor: 'genesis', tick: 0, dominantFlowClass: null,
  ...over,
});

describe('J1 the dormancy gate (Law 7)', () => {
  it('reads routeLifecycleEnabled === true, defensively; absent is dormant', () => {
    expect(routeLifecycleActive({ simulationRules: { routeLifecycleEnabled: true } })).toBe(true);
    expect(routeLifecycleActive({ simulationRules: { routeLifecycleEnabled: 'true' } })).toBe(false);
    expect(routeLifecycleActive({ simulationRules: {} })).toBe(false);
    expect(routeLifecycleActive({})).toBe(false);
    expect(routeLifecycleActive(null)).toBe(false);
    expect(routeLifecycleActive(undefined)).toBe(false);
  });
});

describe('J1 edge identity (§3)', () => {
  it('is route.<a>.<b>.<mode> with the endpoints in codepoint order', () => {
    expect(routeEdgeId('ashfen', 'brackwater', 'land')).toBe('route.ashfen.brackwater.land');
  });

  it('is free of argument order: either way round gives one id', () => {
    expect(routeEdgeId('brackwater', 'ashfen', 'land'))
      .toBe(routeEdgeId('ashfen', 'brackwater', 'land'));
    expect(orderedRouteEndpoints('brackwater', 'ashfen')).toEqual(['ashfen', 'brackwater']);
  });

  it('orders by CODEPOINT, not by locale (uppercase sorts before lowercase)', () => {
    // A locale-aware comparison puts 'a' before 'B'; codepoint order puts 'B'
    // first. Pinning the codepoint answer is what makes the id machine-independent.
    expect(orderedRouteEndpoints('an-oak', 'Brine')).toEqual(['Brine', 'an-oak']);
    expect(routeEdgeId('an-oak', 'Brine', 'water')).toBe('route.Brine.an-oak.water');
  });

  it('separates the modes: the same pair carries a land and a water identity', () => {
    expect(routeEdgeId('a', 'b', 'land')).not.toBe(routeEdgeId('a', 'b', 'water'));
  });

  it('corridors are mode-free, because demand accrues between places not roads', () => {
    expect(corridorId('brackwater', 'ashfen')).toBe('corridor.ashfen.brackwater');
    expect(corridorId('ashfen', 'brackwater')).toBe(corridorId('brackwater', 'ashfen'));
  });

  it('numbers and strings resolve to one identity (a digest id may be either)', () => {
    expect(routeEdgeId(12, 3, 'land')).toBe(routeEdgeId('12', '3', 'land'));
  });
});

// ── THE ONE EDGE-ID LAW (cross-lane, source scan) ────────────────────────────
// The user-route lane spells §3's identity in its own module and its migration
// re-proves it server-side. Importing across the lanes would couple two programs
// that must ship independently; scanning the SOURCE holds them to one law without
// either owning the other. A new producer with a different spelling reds here.
describe('J1 the one edge-id law across src/domain', () => {
  const EDGE_ID_TEMPLATE = /`route\.\$\{[^`]+`/g;

  function walk(dir, out = []) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.js$/.test(entry)) out.push(p);
    }
    return out;
  }

  const producers = (() => {
    const found = [];
    for (const abs of walk(join(ROOT, 'src', 'domain'))) {
      const src = readFileSync(abs, 'utf8');
      for (const m of src.match(EDGE_ID_TEMPLATE) || []) found.push({ abs, template: m });
    }
    return found;
  })();

  it('the scan finds real producers (non-vacuous)', () => {
    expect(producers.length).toBeGreaterThan(0);
  });

  it('every producer spells the identity the same one way', () => {
    const spellings = [...new Set(producers.map(p => p.template))];
    expect(
      spellings,
      'a SECOND spelling of the route edge id entered src/domain. §3 fixes one law'
      + ' (route.<a>.<b>.<mode>, codepoint ordered) and the user-route lane, the ledger'
      + ' and migration 193 must all agree, or a hand-chartered road and its ledger'
      + ' entry become two different roads. Found: ' + JSON.stringify(spellings),
    ).toEqual(['`route.${low}.${high}.${mode}`']);
  });

  it('the binding design doc still states the law this scan enforces', () => {
    const doc = readFileSync(join(ROOT, 'docs', 'DESIGN_ROUTE_LIFECYCLE.md'), 'utf8');
    expect(doc).toContain('route.<a>.<b>.<mode>');
    expect(doc).toContain('codepoint-ordered');
  });
});

describe('J1 the edge factory (single writer)', () => {
  it('canonicalizes its endpoints, so either argument order gives one record', () => {
    expect(anEdge()).toEqual(anEdge({ a: 'ashfen', b: 'brackwater' }));
    expect(anEdge().a).toBe('ashfen');
    expect(anEdge().b).toBe('brackwater');
  });

  it('a generated edge carries NO immunity mark (conditional, drop-when-false)', () => {
    const edge = anEdge();
    // anchored: the exact-key assertion on the very next line proves this record is live and fully built, so an absent key here cannot mean an empty object.
    expect(edge).not.toHaveProperty('lifecycleImmune');
    expect(Object.keys(edge).sort()).toEqual(['a', 'b', 'charter', 'grade', 'mode', 'provenance']);
    expect(isLifecycleImmune(edge)).toBe(false);
  });

  it('a user edge carries the immunity mark, and provenance agrees with it', () => {
    const edge = anEdge({ provenance: PROVENANCE_USER, flavor: 'user' });
    expect(edge.lifecycleImmune).toBe(true);
    expect(edge.provenance).toBe(PROVENANCE_USER);
    expect(isLifecycleImmune(edge)).toBe(true);
  });

  it('omits the optional charter keys unless they were given', () => {
    const bare = anEdge();
    // anchored: the `rich` variant below carries BOTH keys off the same factory, so their absence here is a decision rather than a factory that builds nothing.
    expect(bare.charter).not.toHaveProperty('byPowerRef');
    // anchored: same anchor as the line above, the `rich` variant proves the factory does populate reasonGoods when asked.
    expect(bare.charter).not.toHaveProperty('reasonGoods');
    const rich = anEdge({ byPowerRef: 'crown', reasonGoods: ['grain'] });
    expect(rich.charter.byPowerRef).toBe('crown');
    expect(rich.charter.reasonGoods).toEqual(['grain']);
  });

  it('records a null dominant flow class rather than inventing one', () => {
    expect(anEdge().charter.dominantFlowClass).toBeNull();
  });
});

describe('J1 the closed vocabularies (§3, §4)', () => {
  it('are exactly the design\'s sets', () => {
    expect(ROUTE_GRADES).toEqual(['highway', 'road', 'track', 'hidden']);
    expect(ROUTE_MODES).toEqual(['land', 'water']);
    expect(ROUTE_CHARTER_FLAVORS)
      .toEqual(['mercantile', 'military', 'migration', 'genesis', 'user']);
    expect(ROUTE_FLOW_CLASSES).toEqual(['goods', 'population', 'military']);
  });
});

describe('J1 drop-when-empty (Law 7 byte identity)', () => {
  it('an empty network is never persisted, and the namespace goes with it', () => {
    const dark = { simulationRules: {}, tick: 3 };
    const written = writeRouteNetwork(dark, emptyRouteNetwork());
    // anchored: the sibling test below writes this same key through this same function, so an absent key here is a drop rather than a writer that never writes.
    expect(written).not.toHaveProperty('spatialLedgers');
    expect(written).toEqual(dark);
  });

  it('drops only its own key when a sibling sub-ledger is present', () => {
    const world = { spatialLedgers: { satellites: { s1: {} } } };
    const lit = writeRouteNetwork(world, withRouteEdges(emptyRouteNetwork(), [anEdge()]));
    expect(Object.keys(lit.spatialLedgers).sort()).toEqual(['routeNetwork', 'satellites']);
    const drained = writeRouteNetwork(lit, emptyRouteNetwork());
    expect(Object.keys(drained.spatialLedgers)).toEqual(['satellites']);
  });

  it('a drained world is deep-equal to the world before the network existed', () => {
    const before = { simulationRules: { routeLifecycleEnabled: true }, spatialLedgers: { satellites: {} } };
    const lit = writeRouteNetwork(before, withRouteEdges(emptyRouteNetwork(), [anEdge()]));
    expect(readRouteEdges(lit)).not.toEqual({});
    const drained = writeRouteNetwork(lit, emptyRouteNetwork());
    expect(drained).toEqual(before);
  });

  it('isRouteNetworkEmpty answers for every degenerate shape', () => {
    expect(isRouteNetworkEmpty(null)).toBe(true);
    expect(isRouteNetworkEmpty(undefined)).toBe(true);
    expect(isRouteNetworkEmpty({})).toBe(true);
    expect(isRouteNetworkEmpty(emptyRouteNetwork())).toBe(true);
    expect(isRouteNetworkEmpty({ edges: {}, corridor: { 'corridor.a.b': {} } })).toBe(false);
  });
});

describe('J1 the accessors read a never-connected world without throwing', () => {
  it.each([
    ['null', null],
    ['a bare world', {}],
    ['an empty namespace', { spatialLedgers: {} }],
    ['a foreign namespace', { spatialLedgers: { satellites: { s1: {} } } }],
    ['a malformed ledger', { spatialLedgers: { routeNetwork: 7 } }],
  ])('%s reads as absence, never as a throw', (_label, world) => {
    expect(readRouteEdges(world)).toEqual({});
    expect(readCorridors(world)).toEqual({});
  });

  it('a half-shaped ledger still answers with both containers', () => {
    const half = { spatialLedgers: { routeNetwork: { edges: { x: anEdge() } } } };
    expect(Object.keys(readRouteEdges(half))).toEqual(['x']);
    expect(readCorridors(half)).toEqual({});
  });
});

describe('J1 determinism of the written record', () => {
  it('keys are written in codepoint order whatever order the edges arrive in', () => {
    const forward = withRouteEdges(emptyRouteNetwork(), [
      anEdge({ a: 'a', b: 'z' }), anEdge({ a: 'a', b: 'b' }), anEdge({ a: 'a', b: 'm' }),
    ]);
    const backward = withRouteEdges(emptyRouteNetwork(), [
      anEdge({ a: 'a', b: 'm' }), anEdge({ a: 'z', b: 'a' }), anEdge({ a: 'b', b: 'a' }),
    ]);
    const world = (n) => writeRouteNetwork({}, n);
    expect(JSON.stringify(world(forward))).toBe(JSON.stringify(world(backward)));
    expect(Object.keys(world(forward).spatialLedgers.routeNetwork.edges))
      .toEqual(['route.a.b.land', 'route.a.m.land', 'route.a.z.land']);
  });

  it('withRouteEdges never overwrites an edge the world already lived through', () => {
    const lived = withRouteEdges(emptyRouteNetwork(), [anEdge({ grade: 'highway' })]);
    const rederived = withRouteEdges(lived, [anEdge({ grade: 'track' })]);
    expect(rederived).toBe(lived);
    expect(Object.values(rederived.edges)[0].grade).toBe('highway');
  });
});

describe('J1 the JSON round trip (§11 lifecycle paths)', () => {
  const built = () => {
    const network = withRouteEdges(emptyRouteNetwork(), [
      anEdge(),
      anEdge({ a: 'harborgate', b: 'saltmere', mode: 'water', grade: 'road' }),
      anEdge({ a: 'ashfen', b: 'harborgate', provenance: PROVENANCE_USER, flavor: 'user', tick: 12 }),
    ]);
    return writeRouteNetwork({ simulationRules: { routeLifecycleEnabled: true } }, network);
  };

  it('survives persistence byte-for-byte', () => {
    const world = built();
    const revived = JSON.parse(JSON.stringify(world));
    expect(JSON.stringify(revived)).toBe(JSON.stringify(world));
  });

  it('every accessor answers identically after the trip', () => {
    const world = built();
    const revived = JSON.parse(JSON.stringify(world));
    expect(readRouteNetwork(revived)).toEqual(readRouteNetwork(world));
    expect(Object.keys(readRouteEdges(revived))).toEqual([
      'route.ashfen.brackwater.land',
      'route.ashfen.harborgate.land',
      'route.harborgate.saltmere.water',
    ]);
  });

  it('USER-ROUTE IMMUNITY survives the trip (the write that must not ghost)', () => {
    const revived = JSON.parse(JSON.stringify(built()));
    const user = readRouteEdges(revived)['route.ashfen.harborgate.land'];
    expect(user.provenance).toBe(PROVENANCE_USER);
    expect(user.lifecycleImmune).toBe(true);
    expect(isLifecycleImmune(user)).toBe(true);
    // ...and the generated siblings did NOT acquire immunity in transit.
    expect(isLifecycleImmune(readRouteEdges(revived)['route.ashfen.brackwater.land'])).toBe(false);
  });

  it('the ledger key is the one the coverage manifest classifies', () => {
    expect(ROUTE_NETWORK_LEDGER).toBe('routeNetwork');
    expect(Object.keys(built().spatialLedgers)).toEqual(['routeNetwork']);
  });
});
