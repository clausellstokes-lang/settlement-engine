/**
 * routeNetworkGenesis.test.js — W-J slice J1, THE NETWORK IS BORN
 * (docs/DESIGN_ROUTE_LIFECYCLE.md §1 Law 2 / Law 6 / Law 7, §3, §8).
 *
 * What this file proves, each with an executed negative control recorded in the
 * slice report:
 *   - the GRADE LADDER reads the weaker endpoint, and isolation stays a fate;
 *   - the CANDIDATE SET is bounded (the anti-quadratic law, §3, measured against
 *     the complete graph at S=16 rather than asserted);
 *   - PORTS TOTALITY holds on a port realm, and the landlocked negative shows the
 *     checker can actually fail;
 *   - DETERMINISM: two passes agree, member order is irrelevant, and the WHOLE
 *     SEED FAMILY derives one identical network because the pass takes no entropy;
 *   - STRUCTURAL PURITY: neither leaf can reach a clock, an RNG, or a locale;
 *   - the USER-ROUTE ADOPTION SEAM: rows on config._userRoutes enter as provenance
 *     'user' and lifecycle-immune, and outrank any derivation for the same pair;
 *   - the DORMANT and ALREADY-CONNECTED no-ops return the input BY REFERENCE.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements, placePortSettlements } from '../fixtures/spatialPackFixtures.js';
import {
  PROVENANCE_GENERATED,
  PROVENANCE_USER,
  isLifecycleImmune,
  readGenesisLawVersion,
  readRouteEdges,
  readRouteNetwork,
  routeEdgeId,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';
import * as ledgerModule from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { seaLaneAdjacency } from '../../src/domain/spatial/distanceRead.js';
import {
  PORT_TOTALITY_GRADE,
  ROUTE_GENESIS_LAW_VERSION,
  USER_ROUTE_GENESIS_GRADE,
  deriveGenesisRouteEdges,
  ensureGenesisRouteNetwork,
  genesisCandidatePairs,
  genesisMembersFromSnapshot,
  genesisPairGrade,
  genesisPairMode,
  portTotalityPairs,
  portsMissingWater,
  urquhartPairs,
} from '../../src/domain/worldPulse/routeNetworkGenesis.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LIT = { routeLifecycleEnabled: true };

/** A member in this leaf's own contract shape. */
const member = (id, tradeRouteAccess, extra = {}) => ({ id, config: { tradeRouteAccess, ...extra } });

/** A spatially canonized world over the port grid (5 ports, 3 landlocked). */
function portWorld(rules = LIT) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placePortSettlements(pack, { nCoastal: 3, nRiver: 2, nInland: 3 });
  const digest = buildSpatialDigest({ pack, placements, seaLanes: true });
  return { simulationRules: { ...rules }, spatialCanonVersion: 1, spatialDigest: digest };
}

/** A spatially canonized world with NO sea lanes at all: every member landlocked. */
function landlockedWorld(count, rules = LIT) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, count);
  const digest = buildSpatialDigest({ pack, placements });
  return {
    world: { simulationRules: { ...rules }, spatialCanonVersion: 1, spatialDigest: digest },
    ids: placements.map(p => p.id),
  };
}

/** A REALM-SCALE landlocked world. NET-2's fourth key is a claim about realms
 *  large enough for a three-neighbour budget to run out, which the 24x18/S<=16
 *  fixtures above are deliberately not. */
function realmWorld(count, rules = LIT) {
  const pack = makeGridPack({ cols: 40, rows: 30 });
  const placements = placeSettlements(pack, count);
  const digest = buildSpatialDigest({ pack, placements });
  return {
    world: { simulationRules: { ...rules }, spatialCanonVersion: 1, spatialDigest: digest },
    ids: placements.map(p => p.id),
    digest,
  };
}

/** The unordered pair key this module canonicalizes on. */
const pk = (p) => (p[0] <= p[1] ? `${p[0]}::${p[1]}` : `${p[1]}::${p[0]}`);

const PORT_IDS = ['p000', 'p001', 'p002', 'p003', 'p004', 'p005', 'p006', 'p007'];
const portMembers = (access = 'road') => PORT_IDS.map(id => member(id, access));

describe('J1 the genesis grade ladder (Law 2)', () => {
  it.each([
    ['crossroads', 'port', 'highway'],
    ['port', 'crossroads', 'highway'],
    ['crossroads', 'road', 'road'],
    ['road', 'river', 'road'],
    ['coastal', 'road', 'road'],
    ['crossroads', 'mountain_pass', 'track'],
    ['mountain_pass', 'river', 'track'],
    ['mountain_pass', 'mountain_pass', 'track'],
  ])('%s + %s grades %s (the weaker end governs)', (a, b, grade) => {
    expect(genesisPairGrade(a, b)).toBe(grade);
    expect(genesisPairGrade(b, a)).toBe(grade);
  });

  it.each([
    ['isolated', 'crossroads'],
    ['crossroads', 'isolated'],
    ['isolated', 'isolated'],
    ['none', 'road'],
    [null, 'crossroads'],
    ['a_word_no_pool_rolls', 'crossroads'],
  ])('%s + %s earns NO land edge (isolation as fate, fail closed)', (a, b) => {
    expect(genesisPairGrade(a, b)).toBeNull();
  });

  it('an isolated settlement really is left out of a derived network', () => {
    const members = [member('a', 'road'), member('b', 'road'), member('c', 'isolated')];
    const edges = deriveGenesisRouteEdges({ members, worldState: { simulationRules: LIT } });
    const touched = new Set(edges.flatMap(e => [e.a, e.b]));
    // anchored: a and b ARE present, so the collection is live and correctly keyed;
    // c is the one endpoint the ladder correctly refused.
    expect([...touched].sort()).toEqual(['a', 'b']);
    expect(edges).toHaveLength(1);
  });
});

describe('J1 the bounded candidate set (§3, the anti-quadratic law)', () => {
  it('never enumerates all pairs: measured against the complete graph at S=16', () => {
    const { world, ids } = landlockedWorld(16);
    const members = ids.map(id => member(id, 'road'));
    const candidates = genesisCandidatePairs({ members, worldState: world });
    const complete = (ids.length * (ids.length - 1)) / 2;   // 120
    expect(complete).toBe(120);
    expect(candidates.all.length).toBeLessThan(complete);
    // The structural ceiling: S*k + P + U + the NET-2 Urquhart term, every one
    // linear. THE FOURTH TERM WAS ADDED DELIBERATELY AND THIS LINE MOVED WITH IT:
    // the old ceiling was S*k + P + U, and a fourth key that did not raise it
    // would have been a key that could never contribute anything.
    expect(candidates.all.length).toBeLessThanOrEqual(candidates.bound);
    expect(candidates.bound).toBe(
      candidates.knn.length + candidates.ports.length
      + candidates.user.length + candidates.urquhart.length,
    );
    // The new term's own ceiling is the FROZEN GATE SET — one entry per adjacent
    // territory pair — so it needs no geometric argument, only the digest's own
    // artifact. Measured here: 32 gates over 16 settlements.
    expect(candidates.urquhart.length)
      .toBeLessThanOrEqual(world.spatialDigest.gates.length);
    expect(candidates.bound).toBeLessThanOrEqual(
      ids.length * 3 + ids.length + 0 + world.spatialDigest.gates.length,
    );
  });

  it('grows LINEARLY, not quadratically, as the realm doubles', () => {
    const sizes = [4, 8, 16];
    const counts = sizes.map((n) => {
      const { world, ids } = landlockedWorld(n);
      return genesisCandidatePairs({ members: ids.map(id => member(id, 'road')), worldState: world })
        .all.length;
    });
    // A quadratic selection would grow by ~4x per doubling. The k-NN union grows
    // at most by ~2x plus the small-N completeness plateau.
    for (let i = 1; i < counts.length; i += 1) {
      expect(counts[i]).toBeLessThan(counts[i - 1] * 3);
    }
    expect(counts[0]).toBeGreaterThan(0);
  });

  it('reports its three sources separately, and the union is their dedupe', () => {
    const world = portWorld();
    const c = genesisCandidatePairs({ members: portMembers(), worldState: world });
    expect(c.knn.length).toBeGreaterThan(0);
    expect(c.ports.length).toBeGreaterThan(0);
    expect(c.user).toEqual([]);
    expect(c.all.length).toBeLessThanOrEqual(c.knn.length + c.ports.length + c.user.length);
    expect(c.all.length).toBeGreaterThanOrEqual(c.knn.length);
  });

  it('every candidate pair is codepoint ordered and drawn from the membership', () => {
    const world = portWorld();
    const c = genesisCandidatePairs({ members: portMembers(), worldState: world });
    for (const [a, b] of c.all) {
      expect(a < b).toBe(true);
      expect(PORT_IDS).toContain(a);
      expect(PORT_IDS).toContain(b);
    }
  });
});

describe('J1 PORTS TOTALITY (§6 owner law, §8)', () => {
  const world = portWorld();

  it('the fixture really carries ports and lanes (non-vacuous)', () => {
    expect(world.spatialDigest.reserved.seaLanes.ports).toEqual(['p000', 'p001', 'p002', 'p003', 'p004']);
    expect(portTotalityPairs(world.spatialDigest, PORT_IDS)).toEqual([
      ['p000', 'p001'], ['p001', 'p002'], ['p003', 'p004'],
    ]);
  });

  it('TOTALITY IS STRUCTURAL: every ports pair is in the candidate set, and water mints unconditionally', () => {
    // This is why there is no repair pass. ports subset-of all, and a water
    // candidate is never dropped by the land access ladder, so the invariant
    // cannot be missed by a code path rather than merely being repaired after.
    const c = genesisCandidatePairs({ members: portMembers('isolated'), worldState: world });
    const all = new Set(c.all.map(([a, b]) => `${a}::${b}`));
    for (const [a, b] of c.ports) {
      expect(all.has(`${a}::${b}`), `ports pair ${a}/${b} fell out of the candidate set`).toBe(true);
      expect(genesisPairMode(world.spatialDigest, a, b)).toBe('water');
    }
    expect(c.ports.length).toBeGreaterThan(0);
  });

  it('every port with a navigable counterpart carries a water edge', () => {
    const edges = deriveGenesisRouteEdges({ members: portMembers(), worldState: world });
    expect(portsMissingWater({ members: portMembers(), worldState: world, edges })).toEqual([]);
    const watered = new Set(edges.filter(e => e.mode === 'water').flatMap(e => [e.a, e.b]));
    expect([...watered].sort()).toEqual(['p000', 'p001', 'p002', 'p003', 'p004']);
  });

  it('GUARD THE GUARD: strip the water edges and the checker names every port', () => {
    const edges = deriveGenesisRouteEdges({ members: portMembers(), worldState: world });
    const stripped = edges.filter(e => e.mode !== 'water');
    expect(stripped.length).toBeGreaterThan(0);
    expect(portsMissingWater({ members: portMembers(), worldState: world, edges: stripped }))
      .toEqual(['p000', 'p001', 'p002', 'p003', 'p004']);
  });

  it('THE LANDLOCKED NEGATIVE: a realm with no sea lanes mints no water at all', () => {
    const { world: dry, ids } = landlockedWorld(6);
    const members = ids.map(id => member(id, 'road'));
    const edges = deriveGenesisRouteEdges({ members, worldState: dry });
    expect(edges.length).toBeGreaterThan(0);
    const modes = [...new Set(edges.map(e => e.mode))];
    // anchored: 'land' IS present, proving the derivation ran and produced edges;
    // 'water' is the one mode a landlocked realm correctly cannot reach.
    expect(modes).toEqual(['land']);
    expect(portTotalityPairs(dry.spatialDigest, ids)).toEqual([]);
  });

  it('the three landlocked members of the PORT realm get no water either', () => {
    const edges = deriveGenesisRouteEdges({ members: portMembers(), worldState: world });
    const watered = new Set(edges.filter(e => e.mode === 'water').flatMap(e => [e.a, e.b]));
    for (const inland of ['p005', 'p006', 'p007']) expect(watered.has(inland)).toBe(false);
  });

  it('a totality edge is a harbour at road grade, flavour genesis (§8)', () => {
    const edges = deriveGenesisRouteEdges({ members: portMembers('mountain_pass'), worldState: world });
    const water = edges.filter(e => e.mode === 'water');
    expect(water.length).toBeGreaterThan(0);
    for (const e of water) {
      expect(e.grade).toBe(PORT_TOTALITY_GRADE);
      expect(e.charter.flavor).toBe('genesis');
      expect(e.provenance).toBe(PROVENANCE_GENERATED);
    }
  });

  it('THE LAW OUTRANKS THE VOCABULARY: a port founded isolated still gets its harbour', () => {
    // Law 2 says genesis access and lived connectivity may diverge; §6 says ports
    // totality is an invariant, not a probability. So an isolated port keeps its
    // water edge and loses only its land ones.
    const members = PORT_IDS.map(id => member(id, 'isolated'));
    const edges = deriveGenesisRouteEdges({ members, worldState: world });
    expect(portsMissingWater({ members, worldState: world, edges })).toEqual([]);
    expect(edges.every(e => e.mode === 'water')).toBe(true);
  });

  it('portsMissingWater is silent on an aspatial world (no geometry, no claim)', () => {
    expect(portsMissingWater({ members: portMembers(), worldState: { simulationRules: LIT }, edges: [] }))
      .toEqual([]);
  });

  it('the mode a pair carries is the world\'s decision, not the caller\'s', () => {
    const d = world.spatialDigest;
    expect(genesisPairMode(d, 'p000', 'p001')).toBe('water');
    expect(genesisPairMode(d, 'p000', 'p003')).toBe('land');   // both ports, no lane between them
    expect(genesisPairMode(d, 'p000', 'p005')).toBe('land');   // one landlocked end
    expect(genesisPairMode(null, 'p000', 'p001')).toBe('land'); // aspatial: no sea to speak of
  });
});

describe('J1 determinism (THE PROMISE: a seed is a world, forever)', () => {
  const world = portWorld();

  it('two passes over the same realm are byte-identical', () => {
    const a = deriveGenesisRouteEdges({ members: portMembers(), worldState: world });
    const b = deriveGenesisRouteEdges({ members: portMembers(), worldState: world });
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
  });

  it('member arrival order changes nothing', () => {
    const forward = deriveGenesisRouteEdges({ members: portMembers(), worldState: world });
    const reversed = deriveGenesisRouteEdges({ members: [...portMembers()].reverse(), worldState: world });
    expect(JSON.stringify(reversed)).toBe(JSON.stringify(forward));
  });

  it('the edge list comes out in edge-id codepoint order', () => {
    const edges = deriveGenesisRouteEdges({ members: portMembers(), worldState: world });
    const ids = edges.map(e => routeEdgeId(e.a, e.b, e.mode));
    expect(ids).toEqual([...ids].sort());
  });

  // SEED-FAMILY TOTALITY. The pass takes no entropy at all, so the whole family
  // must land on ONE network. Registered per seed (vitest runs and reports every
  // case), never looped inside one it().
  const SEED_FAMILY = ['seed-1', 'seed-2', 'seed-3', 'seed-4', 'seed-5', 'seed-6', 'seed-7', 'seed-8'];
  const reference = JSON.stringify(deriveGenesisRouteEdges({ members: portMembers(), worldState: world }));
  it.each(SEED_FAMILY)('seed %s derives the identical network (no entropy is taken)', (seed) => {
    const seeded = { ...world, rngSeed: seed, simulationRules: { ...LIT, rngSeed: seed } };
    expect(JSON.stringify(deriveGenesisRouteEdges({ members: portMembers(), worldState: seeded })))
      .toBe(reference);
  });
});

describe('J1 structural purity (Law 7: no ambient anything)', () => {
  const LEAVES = [
    'src/domain/worldPulse/routeNetworkLedger.js',
    'src/domain/worldPulse/routeNetworkGenesis.js',
  ];
  const BANNED = [
    ['Math.random', /Math\s*\.\s*random/],
    ['Date.now', /Date\s*\.\s*now/],
    ['new Date', /new\s+Date\s*\(/],
    ['localeCompare', /localeCompare/],
    ['import.meta', /import\s*\.\s*meta/],
    ['an rng import', /from\s+['"][^'"]*prng(\.js)?['"]/],
  ];

  it.each(LEAVES)('%s reads clean and is really on disk', (rel) => {
    expect(existsSync(join(ROOT, rel))).toBe(true);
    expect(readFileSync(join(ROOT, rel), 'utf8').length).toBeGreaterThan(1000);
  });

  it.each(
    LEAVES.flatMap(rel => BANNED.map(([label, re]) => [rel, label, re])),
  )('%s cannot reach %s', (rel, _label, re) => {
    expect(re.test(readFileSync(join(ROOT, rel), 'utf8'))).toBe(false);
  });

  it('the scan can actually fail (guard the guard)', () => {
    for (const [, re] of BANNED) {
      expect(re.test('const x = Math.random() + Date.now(); new Date(); '
        + 'a.localeCompare(b); import.meta.env; import { createPRNG } from "../../kernel/prng.js";'))
        .toBe(true);
    }
  });
});

describe('J1 the user-route adoption seam (§3, §11)', () => {
  // The row vocabulary is the DESIGN DOC's convention (config._userRoutes, one row
  // per chartered route naming its endpoints and its mode). This fixture mirrors
  // the shape the directive-3 writer records, and the contract scan below is the
  // tripwire that reds if that writer's spelling ever moves.
  const userRow = (a, b, mode = 'land', createdTick = 7) => ({
    routeId: routeEdgeId(a, b, mode),
    atEventId: 'evt-1',
    atTimestamp: '2026-01-01T00:00:00.000Z',
    provenance: 'user',
    mode,
    createdTick,
    band: 'steady',
    a,
    b,
  });

  const withUserRoute = () => [
    member('p005', 'isolated', { _userRoutes: [userRow('p005', 'p006')] }),
    member('p006', 'isolated', { _userRoutes: [userRow('p005', 'p006')] }),
    member('p007', 'isolated'),
  ];

  it('adopts a hand-chartered route even where the access ladder mints nothing', () => {
    const edges = deriveGenesisRouteEdges({
      members: withUserRoute(), worldState: { simulationRules: LIT },
    });
    expect(edges).toHaveLength(1);
    const [edge] = edges;
    expect(edge.provenance).toBe(PROVENANCE_USER);
    expect(edge.charter.flavor).toBe('user');
    expect(edge.charter.tick).toBe(7);
    expect(edge.grade).toBe(USER_ROUTE_GENESIS_GRADE);
    expect(isLifecycleImmune(edge)).toBe(true);
  });

  it('records the pair ONCE though both endpoints carry the row', () => {
    const c = genesisCandidatePairs({
      members: withUserRoute(), worldState: { simulationRules: LIT },
    });
    expect(c.user).toEqual([['p005', 'p006']]);
  });

  it('a user charter OUTRANKS the derivation for the same pair', () => {
    const members = [
      member('a', 'crossroads', { _userRoutes: [userRow('a', 'b')] }),
      member('b', 'crossroads'),
    ];
    const edges = deriveGenesisRouteEdges({ members, worldState: { simulationRules: LIT } });
    expect(edges).toHaveLength(1);
    // The access ladder alone would have graded this pair 'highway' and marked it
    // generated; the DM's charter claimed the identity first.
    expect(genesisPairGrade('crossroads', 'crossroads')).toBe('highway');
    expect(edges[0].grade).toBe(USER_ROUTE_GENESIS_GRADE);
    expect(edges[0].provenance).toBe(PROVENANCE_USER);
  });

  it('a row naming a settlement this world does not carry is not a road', () => {
    const members = [
      member('a', 'isolated', { _userRoutes: [userRow('a', 'a-place-that-left')] }),
      member('b', 'isolated'),
    ];
    expect(deriveGenesisRouteEdges({ members, worldState: { simulationRules: LIT } })).toEqual([]);
  });

  it.each([
    ['not an array', { _userRoutes: {} }],
    ['rows that are not objects', { _userRoutes: ['x', null, 3] }],
    ['a row with no endpoints', { _userRoutes: [{ mode: 'land' }] }],
    ['a self-loop', { _userRoutes: [{ a: 'a', b: 'a', mode: 'land' }] }],
  ])('%s is skipped rather than trusted', (_label, config) => {
    const members = [member('a', 'isolated', config), member('b', 'isolated')];
    expect(deriveGenesisRouteEdges({ members, worldState: { simulationRules: LIT } })).toEqual([]);
  });

  it('an unrecognized mode falls back to land rather than minting a new vocabulary', () => {
    const members = [
      member('a', 'isolated', { _userRoutes: [{ a: 'a', b: 'b', mode: 'teleport' }] }),
      member('b', 'isolated'),
    ];
    const edges = deriveGenesisRouteEdges({ members, worldState: { simulationRules: LIT } });
    expect(edges.map(e => e.mode)).toEqual(['land']);
  });

  // THE CONTRACT SCAN. The coupling to the directive-3 lane is by CONVENTION, not
  // by import: neither lane may own the other. The design doc is the binding
  // channel and is asserted unconditionally; the writer-source scan is an extra
  // tripwire that runs whenever that lane is present in the tree, and is what
  // would catch the writer/reader spelling drift this estate has been bitten by.
  it('the design directive still names config._userRoutes as the provenance home', () => {
    const doc = readFileSync(join(ROOT, 'docs', 'DESIGN_REALM_DIRECTIVES.md'), 'utf8');
    expect(doc).toContain('config._userRoutes');
  });

  it('the directive-3 writer still spells the row keys this reader depends on', () => {
    const writer = join(ROOT, 'src', 'domain', 'events', 'mutateUserRoute.js');
    if (!existsSync(writer)) {
      // Not a skip: the convention above is the binding contract, and this branch
      // records that the extra tripwire had nothing to watch on this checkout.
      expect(existsSync(join(ROOT, 'docs', 'DESIGN_REALM_DIRECTIVES.md'))).toBe(true);
      return;
    }
    const src = readFileSync(writer, 'utf8');
    expect(src).toContain('_userRoutes');
    for (const key of ['provenance:', 'mode:', 'createdTick:', 'a:', 'b:']) {
      expect(src, `the user-route provenance row lost the ${key} key this reader depends on`)
        .toContain(key);
    }
  });
});

describe('J1 the world-connect entry point', () => {
  it('DORMANT returns the input world BY REFERENCE, not an equal copy', () => {
    const dark = portWorld({});
    expect(ensureGenesisRouteNetwork(dark, portMembers())).toBe(dark);
    const alsoDark = portWorld({ routeLifecycleEnabled: 'yes' });
    expect(ensureGenesisRouteNetwork(alsoDark, portMembers())).toBe(alsoDark);
  });

  it('ANTI-VACUITY: the same fixture LIT derives a real network', () => {
    const lit = portWorld();
    const connected = ensureGenesisRouteNetwork(lit, portMembers());
    expect(connected).not.toBe(lit);
    expect(Object.keys(readRouteEdges(connected)).length).toBeGreaterThan(0);
  });

  it('GENESIS HAPPENS ONCE: a connected world is returned by reference', () => {
    const connected = ensureGenesisRouteNetwork(portWorld(), portMembers());
    expect(ensureGenesisRouteNetwork(connected, portMembers())).toBe(connected);
  });

  it('a re-derivation cannot rewrite a lived network (Law 2)', () => {
    const connected = ensureGenesisRouteNetwork(portWorld(), portMembers('crossroads'));
    const before = JSON.stringify(readRouteEdges(connected));
    // The realm's members are re-read as merely passable; genesis is over.
    const again = ensureGenesisRouteNetwork(connected, portMembers('mountain_pass'));
    expect(JSON.stringify(readRouteEdges(again))).toBe(before);
  });

  it('derives nothing, and writes nothing, for a realm that earns no edges', () => {
    const lit = { simulationRules: { ...LIT } };
    const barren = [member('a', 'isolated'), member('b', 'isolated')];
    const out = ensureGenesisRouteNetwork(lit, barren);
    expect(out).toBe(lit);
    // anchored: the ANTI-VACUITY test above writes this key on a lit realm through this same function, so its absence here is a drop rather than a writer that never writes.
    expect(out).not.toHaveProperty('spatialLedgers');
  });

  it('a single-member realm has nobody to be connected to', () => {
    const lit = { simulationRules: { ...LIT } };
    expect(ensureGenesisRouteNetwork(lit, [member('a', 'crossroads')])).toBe(lit);
  });

  it('the corridor ledger is minted EMPTY at genesis (J2 owns the filling)', () => {
    const connected = ensureGenesisRouteNetwork(portWorld(), portMembers());
    expect(connected.spatialLedgers.routeNetwork.corridor).toEqual({});
  });
});

describe('J1 the one shape adapter (the writer/reader spelling cure)', () => {
  it('maps the world-connect snapshot shape onto this leaf\'s contract', () => {
    const snapshot = [
      { id: 'ashfen', name: 'Ashfen', settlement: { config: { tradeRouteAccess: 'road' } } },
      { id: 'brack', name: 'Brack', settlement: { config: { tradeRouteAccess: 'crossroads' } } },
    ];
    expect(genesisMembersFromSnapshot(snapshot)).toEqual([
      { id: 'ashfen', config: { tradeRouteAccess: 'road' } },
      { id: 'brack', config: { tradeRouteAccess: 'crossroads' } },
    ]);
  });

  it('an adapted snapshot derives the same network as the hand-built members', () => {
    const snapshot = PORT_IDS.map(id => ({ id, settlement: { config: { tradeRouteAccess: 'road' } } }));
    const world = portWorld();
    expect(JSON.stringify(deriveGenesisRouteEdges({
      members: genesisMembersFromSnapshot(snapshot), worldState: world,
    }))).toBe(JSON.stringify(deriveGenesisRouteEdges({ members: portMembers(), worldState: world })));
  });

  it.each([
    ['null', null],
    ['not an array', {}],
    ['members with no id', [{ settlement: { config: {} } }]],
    ['members with no settlement', [{ id: 'a' }]],
  ])('%s adapts without throwing', (_label, input) => {
    expect(Array.isArray(genesisMembersFromSnapshot(input))).toBe(true);
  });

  it('a member with no settlement still adapts, with an empty config', () => {
    expect(genesisMembersFromSnapshot([{ id: 'a' }])).toEqual([{ id: 'a', config: {} }]);
  });
});

// ── WEAVE NET-2 · the fourth candidate key ──────────────────────────────────
describe('NET-2 the Urquhart pass over the realm\'s own territory graph', () => {
  it('is a SUBSET of the frozen gate set, which is the whole of the bound argument', () => {
    // The pass reads `gateAdjacency`, so every pair it returns was already an
    // adjacent-territory crossing in the digest. That makes the anti-quadratic
    // claim a statement about an artifact this test can count rather than a
    // geometric theorem about a triangulation nobody has.
    const { world, ids, digest } = realmWorld(40);
    const pairs = urquhartPairs(digest, ids);
    const gateKeys = new Set(digest.gates.map(g => pk(g.between)));
    expect(pairs.length).toBeGreaterThan(0);
    for (const pair of pairs) expect(gateKeys.has(pk(pair))).toBe(true);
    expect(pairs.length).toBeLessThanOrEqual(digest.gates.length);
    // …and it really is a proper subset: the Urquhart RULE drops the longest side
    // of every triangle, so a pass that returned the whole gate set would not be
    // applying the rule at all.
    expect(pairs.length).toBeLessThan(digest.gates.length);
    expect(world.spatialDigest).toBe(digest);
  });

  it('DISCOVERS neighbour pairs the three-nearest budget misses — the arm that could have been vacuous', () => {
    // ⚠ THIS IS THE ANTI-VACUITY ARM AND IT IS THE POINT OF THE CAR. A fourth key
    // whose pairs the k-nearest key already held would be a key that changes
    // nothing, and the small fixtures elsewhere in this file would never have
    // shown it: J-D2's own note records that at S <= 4 the k-nearest graph IS the
    // complete graph, and the plateau reaches further than that on a small pack.
    // MEASURED at S = 8/12/16/24/32 on the 30x22 grid: the pass contributes
    // 0/1/0/5/3 new pairs — real, but small enough to mislead. At realm scale it
    // is unambiguous, and that is where a realm's roads actually live.
    const { world, ids, digest } = realmWorld(40);
    const members = ids.map(id => member(id, 'road'));
    const candidates = genesisCandidatePairs({ members, worldState: world });
    const older = new Set([...candidates.knn, ...candidates.ports, ...candidates.user].map(pk));
    const discovered = candidates.urquhart.filter(pair => !older.has(pk(pair)));
    expect(discovered.length).toBeGreaterThan(0);
    // 70 pairs from the three older keys; 85 with this one. Every discovered pair
    // is a real territory border, not a long-range guess.
    expect(candidates.all.length).toBe(older.size + discovered.length);
    const gateKeys = new Set(digest.gates.map(g => pk(g.between)));
    for (const pair of discovered) expect(gateKeys.has(pk(pair))).toBe(true);
    // …and the selection is still nowhere near the complete graph.
    expect(candidates.all.length).toBeLessThan((ids.length * (ids.length - 1)) / 2 / 4);
  });

  it('reads the access ladder like every other key: a geographic neighbour founded isolated earns no road', () => {
    // LAW 2 HAS NO BYPASS RUNG. Geography says two places border each other; the
    // frozen `tradeRouteAccess` says whether the world gave either of them a way
    // out, and the second question is not answered by the first. The pair under
    // test is chosen BY THE DERIVATION — the first pair only this key contributes
    // — so the test cannot drift onto a pair some other key would have supplied.
    const { world, ids } = realmWorld(40);
    const roadMembers = ids.map(id => member(id, 'road'));
    const candidates = genesisCandidatePairs({ members: roadMembers, worldState: world });
    const older = new Set([...candidates.knn, ...candidates.ports, ...candidates.user].map(pk));
    const [a, b] = candidates.urquhart.find(pair => !older.has(pk(pair)));
    expect(a).toBeTruthy();

    const idOf = (edge) => routeEdgeId(edge.a, edge.b, edge.mode);
    const withAccess = (overrides) => new Set(
      deriveGenesisRouteEdges({
        members: ids.map(id => member(id, overrides[id] || 'road')),
        worldState: world,
      }).map(idOf),
    );
    // With both ends on a road, the pair this key found becomes a road.
    expect(withAccess({}).has(routeEdgeId(a, b, 'land'))).toBe(true);
    // Founding ONE end isolated is enough — the ladder reads the WEAKER end.
    expect(withAccess({ [a]: 'isolated' }).has(routeEdgeId(a, b, 'land'))).toBe(false);
    expect(withAccess({ [b]: 'isolated' }).has(routeEdgeId(a, b, 'land'))).toBe(false);
  });

  it('mints no water of its own: every water edge is a frozen sea lane between two ports', () => {
    // The fourth key is a claim about LAND borders. It routes through the same
    // `genesisPairMode` gate as everything else, so a pair of its becomes a water
    // edge exactly when the frozen lane set already links both ends — never
    // because it arrived through this key. Where that does happen the §8 rung is
    // minted unconditionally, which is totality behaving as a FLOOR over a wider
    // candidate set rather than a new rule.
    const world = portWorld();
    const digest = world.spatialDigest;
    const lanes = seaLaneAdjacency(digest);
    const edges = deriveGenesisRouteEdges({ members: portMembers('port'), worldState: world });
    const water = edges.filter(e => e.mode === 'water');
    expect(water.length).toBeGreaterThan(0);           // anti-vacuity: water exists
    for (const e of water) {
      expect(genesisPairMode(digest, e.a, e.b)).toBe('water');
      expect(lanes.get(e.a)?.has(e.b)).toBe(true);
      expect(e.grade).toBe(PORT_TOTALITY_GRADE);
    }
  });

  it('an aspatial realm has no geographic neighbours, and says so', () => {
    // No canon, no territory graph, no borders. Returning nothing is the honest
    // answer rather than a degradation dodge — the same posture the k-nearest key
    // takes when it falls back to its codepoint line.
    expect(urquhartPairs(null, ['a', 'b', 'c'])).toEqual([]);
    const aspatial = { simulationRules: { ...LIT } };
    const candidates = genesisCandidatePairs({
      members: ['a', 'b', 'c'].map(id => member(id, 'road')), worldState: aspatial,
    });
    expect(candidates.urquhart).toEqual([]);
    expect(candidates.bound).toBe(candidates.knn.length);
  });

  it('is deterministic and order-free', () => {
    const { ids, digest } = realmWorld(40);
    const forward = urquhartPairs(digest, ids);
    const reversed = urquhartPairs(digest, [...ids].reverse());
    expect(JSON.stringify(reversed)).toBe(JSON.stringify(forward));
    expect(JSON.stringify(urquhartPairs(digest, ids))).toBe(JSON.stringify(forward));
    // Emitted in codepoint pair order, like every other key here.
    expect(forward.map(pk)).toEqual([...forward.map(pk)].sort());
  });
});

// ── WEAVE NET-2 · the genesis law stamp (volume §1.4, A1.1.3, owner row Q-W6) ──
describe('NET-2 the genesis law stamp', () => {
  it('stamps the law that derived the network, appended LAST, in the connect act', () => {
    const world = portWorld();
    const connected = ensureGenesisRouteNetwork(world, portMembers('port'), 0);
    expect(readGenesisLawVersion(connected)).toBe(ROUTE_GENESIS_LAW_VERSION);
    // KEY ORDER IS THE SHAPE CONTRACT: the stamp is LAST, so a wave that lights it
    // changes a value and never where anything else sits in the serialization.
    expect(Object.keys(readRouteNetwork(connected)))
      .toEqual(['edges', 'corridor', 'genesisLawVersion']);
    // It describes edges, so it is never written where there are none: genesis is
    // once, and a re-derivation over a lived network must not restamp it either.
    expect(ensureGenesisRouteNetwork(connected, portMembers('port'), 99)).toBe(connected);
  });

  it('a DARK world is untouched to the byte, stamp included', () => {
    // The raw-byte dormancy bar (§1.2 as amended by A1.2.7): not an equal world,
    // the SAME world, and the same bytes.
    const dark = portWorld({});
    const before = JSON.stringify(dark);
    const after = ensureGenesisRouteNetwork(dark, portMembers('port'), 0);
    expect(after).toBe(dark);
    expect(JSON.stringify(after)).toBe(before);
    expect(readGenesisLawVersion(after)).toBeNull();
  });

  it('a pre-stamp ledger round-trips with NO stamp — absent stays absent forever', () => {
    // Every world persisted before this key existed. Null is the truth about it
    // ("we do not know which law built this"), and a read that defaulted to 1
    // would be a fabricated claim about a realm nobody stamped.
    const world = portWorld();
    const connected = ensureGenesisRouteNetwork(world, portMembers('port'), 0);
    const legacy = JSON.parse(JSON.stringify(connected));
    delete legacy.spatialLedgers.routeNetwork.genesisLawVersion;
    const before = JSON.stringify(legacy);
    expect(readGenesisLawVersion(legacy)).toBeNull();
    const network = readRouteNetwork(legacy);
    expect(Object.keys(network)).toEqual(['edges', 'corridor']);
    expect(JSON.stringify(ledgerModule.writeRouteNetwork(legacy, network))).toBe(before);
  });

  it('a BARE network literal written onto a stamped world keeps the stamp — the writer preserves it, not the caller', () => {
    // ⛔ THE ARM A CONSUMER SUITE HAD TO FIND FOR ME, recorded so nobody re-learns
    // it. SIX modules outside the ledger build a network as a bare
    // `{ edges, corridor }` literal and hand it straight to `writeRouteNetwork` —
    // the decay sweep, the strategic-need writer, the lifecycle stepper, the
    // charter bypass, the flows objective. Routing the ledger's own four folds
    // through one constructor did nothing for any of them, and the first write
    // after genesis erased the stamp. Preservation therefore lives at the ONE
    // PERSISTENCE CHOKEPOINT, which is what this pins.
    const world = portWorld();
    const connected = ensureGenesisRouteNetwork(world, portMembers('port'), 0);
    const stamped = readRouteNetwork(connected);
    const bare = { edges: stamped.edges, corridor: stamped.corridor };
    expect(bare.genesisLawVersion).toBeUndefined();          // it really is bare
    const rewritten = ledgerModule.writeRouteNetwork(connected, bare);
    expect(readGenesisLawVersion(rewritten)).toBe(ROUTE_GENESIS_LAW_VERSION);

    // …AND A STAMP IS NEVER INVENTED. The same bare literal onto a world that
    // never had one stays unstamped: "we do not know which law built this" is the
    // truth about a pre-NET-2 realm and the writer must not improve on it.
    const virgin = ledgerModule.writeRouteNetwork(portWorld(), bare);
    expect(readGenesisLawVersion(virgin)).toBeNull();
    expect(Object.keys(readRouteNetwork(virgin))).toEqual(['edges', 'corridor']);
  });

  it('EVERY fold in the ledger preserves the stamp, and a fold this table has never seen REDS', () => {
    // ⛔ THE STRUCTURAL HALF, and the reason the four folders were routed through
    // one constructor. Each of them used to rebuild the record from an
    // `{ edges, corridor }` literal, so a key the record grew would have been
    // silently erased by whichever fold ran next — a value written on one
    // lifecycle path and dropped on another, which is this estate's most
    // expensive recurring bug. The manifest below is the ratchet: a FIFTH folder
    // added later fails the coverage assertion until it is listed here, and then
    // fails the preservation assertion unless it goes through the constructor.
    const world = portWorld();
    const connected = ensureGenesisRouteNetwork(world, portMembers('port'), 0);
    const stamped = readRouteNetwork(connected);
    const anEdgeId = Object.keys(stamped.edges)[0];
    const corridorRow = ledgerModule.corridorDemand({ a: 'p000', b: 'p007', sinceTick: 3 });

    // Each call must actually CHANGE the network, or the folder's early return
    // would hand back `base` and the assertion would pass without folding at all.
    const FOLDS = {
      withRouteEdges: (n) => ledgerModule.withRouteEdges(n, [ledgerModule.routeEdge({
        a: 'zzz0', b: 'zzz1', grade: 'track', mode: 'land',
        provenance: PROVENANCE_GENERATED, flavor: 'genesis', tick: 1, dominantFlowClass: null,
      })]),
      withCorridors: (n) => ledgerModule.withCorridors(n, { [ledgerModule.corridorId('p000', 'p007')]: corridorRow }),
      withoutCorridors: (n) => ledgerModule.withoutCorridors(
        ledgerModule.withCorridors(n, { [ledgerModule.corridorId('p000', 'p007')]: corridorRow }),
        [ledgerModule.corridorId('p000', 'p007')],
      ),
      withEdgeUsage: (n) => ledgerModule.withEdgeUsage(n, {
        [anEdgeId]: { goods: 1, population: 0, military: 0, lastTick: 4 },
      }),
      withGenesisLaw: (n) => ledgerModule.withGenesisLaw(n, ROUTE_GENESIS_LAW_VERSION),
    };

    // COVERAGE: the manifest names every fold this module exports.
    const exported = Object.keys(ledgerModule)
      .filter(name => name.startsWith('with') && typeof ledgerModule[name] === 'function')
      .sort();
    expect(exported).toEqual(Object.keys(FOLDS).sort());

    // PRESERVATION: each one carries the stamp through, and really did fold.
    for (const [name, fold] of Object.entries(FOLDS)) {
      const folded = fold(stamped);
      expect(`${name}: ${folded.genesisLawVersion}`)
        .toBe(`${name}: ${ROUTE_GENESIS_LAW_VERSION}`);
      if (name !== 'withGenesisLaw') expect(folded).not.toBe(stamped);
    }
  });
});
