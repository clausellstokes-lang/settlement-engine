/**
 * routeNetworkDormancy.test.js — W-J slice J1, THE FENCED DORMANCY GOLDEN
 * (docs/DESIGN_ROUTE_LIFECYCLE.md §1 Law 7, §13), ASPATIAL and SPATIAL.
 *
 * Law 7: `routeLifecycleEnabled` is virtual, and dark means BYTE-IDENTICAL. This
 * file fences that two ways over two realms:
 *
 *   1. IDENTITY. `ensureGenesisRouteNetwork` on a dark world returns the INPUT
 *      OBJECT, not an equal copy. Object identity is a stronger statement than
 *      deep equality and it is the one that makes wiring this into the connect
 *      seam provably byte-safe.
 *   2. THE GOLDEN. Four projections are hashed and frozen in
 *      tests/fixtures/route-network-dormancy-golden.json: the DARK worldState and
 *      the LIT genesis network, for an aspatial realm and for a spatially
 *      canonized port realm. The dark hashes are the tripwire — a future slice
 *      that wires genesis into the connect seam WITHOUT the gate moves them, and
 *      this file is what catches it. The lit hashes are the same-seed genesis
 *      golden: THE PROMISE says a seed is a world forever, and the network a realm
 *      is born with is part of that world.
 *
 * WHAT THIS GOLDEN DOES NOT CLAIM, said plainly: J1 is not yet called from the
 * pulse, so the dark hashes cannot move today. They are a fence built before the
 * wiring, which is the only time a dormancy fence can be built honestly — after
 * the wiring there is no clean before-state left to record.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/domain/routeNetworkDormancy.test.js
 * Re-recording requires a stated, field-level cause in the header, per the estate's
 * golden-movement law.
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placePortSettlements } from '../fixtures/spatialPackFixtures.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';
import { readRouteEdges, readRouteNetwork } from '../../src/domain/worldPulse/routeNetworkLedger.js';
import {
  deriveGenesisRouteEdges,
  ensureGenesisRouteNetwork,
} from '../../src/domain/worldPulse/routeNetworkGenesis.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'route-network-dormancy-golden.json');

/** THE ASPATIAL REALM: four members, mixed access, no spatial canon at all. */
const ASPATIAL_MEMBERS = [
  { id: 'ashfen', config: { tradeRouteAccess: 'crossroads' } },
  { id: 'brackwater', config: { tradeRouteAccess: 'road' } },
  { id: 'coldhollow', config: { tradeRouteAccess: 'mountain_pass' } },
  { id: 'dunmoor', config: { tradeRouteAccess: 'isolated' } },
];

/** THE SPATIAL REALM: the port grid, five ports and three landlocked seats. */
const SPATIAL_IDS = ['p000', 'p001', 'p002', 'p003', 'p004', 'p005', 'p006', 'p007'];
const SPATIAL_ACCESS = ['port', 'coastal', 'port', 'river', 'coastal', 'road', 'mountain_pass', 'isolated'];
const SPATIAL_MEMBERS = SPATIAL_IDS.map((id, i) => ({ id, config: { tradeRouteAccess: SPATIAL_ACCESS[i] } }));

const spatialDigest = (() => {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  return buildSpatialDigest({
    pack,
    placements: placePortSettlements(pack, { nCoastal: 3, nRiver: 2, nInland: 3 }),
    seaLanes: true,
  });
})();

/** A world in the two flag states. The digest is threaded only for the spatial realm. */
function worldFor(kind, lit) {
  const rules = lit ? { routeLifecycleEnabled: true } : {};
  const base = { simulationRules: rules, tick: 0, campaignId: 'route-genesis-golden' };
  return kind === 'spatial'
    ? { ...base, spatialCanonVersion: 1, spatialDigest }
    : base;
}

const membersFor = (kind) => (kind === 'spatial' ? SPATIAL_MEMBERS : ASPATIAL_MEMBERS);

/**
 * The projection the golden hashes. The digest itself is deliberately excluded:
 * it is frozen canon owned by the spatial layer, and hashing it here would make
 * this file red on any unrelated re-canonize.
 */
function project(world) {
  return {
    simulationRules: world.simulationRules,
    spatialCanonVersion: world.spatialCanonVersion || 0,
    spatialLedgers: world.spatialLedgers || null,
    edgeIds: Object.keys(readRouteEdges(world)),
    corridorIds: Object.keys((readRouteNetwork(world) || { corridor: {} }).corridor),
  };
}

const hash = (value) => createHash('sha256')
  .update(JSON.stringify(normalizeForDormancy(value))).digest('hex').slice(0, 32);

const CASES = ['aspatial', 'spatial'];

/** Every hash this file pins, computed from the live engine. */
function liveHashes() {
  /** @type {Record<string, string>} */
  const out = {};
  for (const kind of CASES) {
    const dark = worldFor(kind, false);
    out[`${kind}.dark`] = hash(project(ensureGenesisRouteNetwork(dark, membersFor(kind))));
    const lit = worldFor(kind, true);
    out[`${kind}.lit`] = hash(project(ensureGenesisRouteNetwork(lit, membersFor(kind))));
    out[`${kind}.edges`] = hash(deriveGenesisRouteEdges({
      members: membersFor(kind), worldState: lit,
    }));
  }
  return out;
}

const live = liveHashes();

if (process.env.UPDATE_GOLDEN === '1') {
  mkdirSync(dirname(MANIFEST), { recursive: true });
  writeFileSync(MANIFEST, `${JSON.stringify(live, null, 2)}\n`);
}

describe('J1 dormancy: the dark path is the input path (Law 7)', () => {
  it.each(CASES)('%s — a dark world comes back BY REFERENCE', (kind) => {
    const dark = worldFor(kind, false);
    expect(ensureGenesisRouteNetwork(dark, membersFor(kind))).toBe(dark);
  });

  it.each(CASES)('%s — a dark world grows no ledger key at all', (kind) => {
    const out = ensureGenesisRouteNetwork(worldFor(kind, false), membersFor(kind));
    // anchored: the two ANTI-VACUITY tests below write this key on these same fixtures through this same function, so an absent key here is the gate holding rather than a derivation that never runs.
    expect(out).not.toHaveProperty('spatialLedgers');
    expect(readRouteEdges(out)).toEqual({});
  });

  it('ANTI-VACUITY: the SPATIAL fixture lit really derives a network', () => {
    const litWorld = ensureGenesisRouteNetwork(worldFor('spatial', true), SPATIAL_MEMBERS);
    const ids = Object.keys(readRouteEdges(litWorld));
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.some(id => id.endsWith('.water'))).toBe(true);
  });

  it('ANTI-VACUITY: the ASPATIAL fixture lit really derives a network', () => {
    const litWorld = ensureGenesisRouteNetwork(worldFor('aspatial', true), ASPATIAL_MEMBERS);
    const ids = Object.keys(readRouteEdges(litWorld));
    expect(ids.length).toBeGreaterThan(0);
    // No geometry means no sea: an aspatial realm is all land, whatever its config
    // says about harbours.
    expect(ids.every(id => id.endsWith('.land'))).toBe(true);
  });

  it.each(CASES)('%s — dark and lit are genuinely different worlds', (kind) => {
    expect(live[`${kind}.lit`]).not.toBe(live[`${kind}.dark`]);
  });
});

describe('J1 the fenced dormancy + genesis golden', () => {
  it('the golden manifest is committed (it is a reviewed artifact, never self-written)', () => {
    expect(
      existsSync(MANIFEST),
      `missing ${MANIFEST}. Capture it with UPDATE_GOLDEN=1 and commit it.`,
    ).toBe(true);
  });

  const golden = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};

  it('pins every case, in both flag states, plus the raw edge derivation', () => {
    expect(Object.keys(golden).sort()).toEqual([
      'aspatial.dark', 'aspatial.edges', 'aspatial.lit',
      'spatial.dark', 'spatial.edges', 'spatial.lit',
    ]);
  });

  it.each(Object.keys(live).sort())('%s matches the frozen hash', (key) => {
    expect(
      live[key],
      `${key} moved. If this is the DARK half, a gate stopped holding and the`
      + ` dormancy law is broken. If it is the LIT half, the genesis derivation`
      + ` changed and THE PROMISE requires a stated, field-level cause in this`
      + ` file's header before the hash is re-recorded.`,
    ).toBe(golden[key]);
  });
});

describe('J1 the golden is a real fence (guard the guard)', () => {
  it('a network that materialized behind a dark gate would move the dark hash', () => {
    // Simulate the exact regression this fence exists to catch: a future wiring
    // that derives at connect WITHOUT consulting routeLifecycleActive.
    const dark = worldFor('spatial', false);
    const ungated = {
      ...dark,
      spatialLedgers: {
        routeNetwork: {
          edges: Object.fromEntries(
            deriveGenesisRouteEdges({ members: SPATIAL_MEMBERS, worldState: dark })
              .map(e => [`route.${e.a}.${e.b}.${e.mode}`, e]),
          ),
          corridor: {},
        },
      },
    };
    expect(Object.keys(readRouteEdges(ungated)).length).toBeGreaterThan(0);
    expect(hash(project(ungated))).not.toBe(live['spatial.dark']);
  });

  it('the projection actually reads the ledger (it is not hashing a constant)', () => {
    const lit = ensureGenesisRouteNetwork(worldFor('spatial', true), SPATIAL_MEMBERS);
    expect(project(lit).edgeIds.length).toBeGreaterThan(0);
    expect(project(worldFor('spatial', false)).edgeIds).toEqual([]);
  });
});
