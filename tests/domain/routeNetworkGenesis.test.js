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
  readRouteEdges,
  routeEdgeId,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';
import {
  PORT_TOTALITY_GRADE,
  USER_ROUTE_GENESIS_GRADE,
  deriveGenesisRouteEdges,
  ensureGenesisRouteNetwork,
  genesisCandidatePairs,
  genesisMembersFromSnapshot,
  genesisPairGrade,
  genesisPairMode,
  portTotalityPairs,
  portsMissingWater,
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
    // The structural ceiling: S*k + P + U, every term linear.
    expect(candidates.all.length).toBeLessThanOrEqual(candidates.bound);
    expect(candidates.bound).toBeLessThanOrEqual(ids.length * 3 + ids.length + 0);
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
