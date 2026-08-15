/**
 * hegemonyFear.test.js — D4(b) (DESIGN_SIM_DEPTH_R2 D4) pins for fear_of_dominance and
 * its distinct peace mirror balance_restored.
 *
 * Design pins: (1) no sphere ⇒ reason scores 0 everywhere (negative control);
 * (2) a 3-vassal center produces fear at FREE neighbours, NOT at vassals; (3) distance
 * monotonicity; (4) belief-side divergence (a fogged observer fears the empire it BELIEVES
 * in); (5) the read is pure (same input ⇒ identical output; zero writes).
 */
import { describe, it, expect } from 'vitest';

import {
  scoreFearOfDominance, scoreBalanceRestored, makeHegemonyFear,
} from '../../src/domain/worldPulse/hegemonyFear.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

// ── The PURE scorers (controlled sphere inputs) ──────────────────────────────
const sphere = (patch = {}) => ({
  centerId: 'C', centerName: 'Thornwall', strengthShare: 0.6,
  memberCount: 3, members: [{ id: 'v1' }, { id: 'v2' }, { id: 'v3' }],
  strain: { strainedCount: 0 }, ...patch,
});

describe('D4 — scoreFearOfDominance (pure)', () => {
  const spheres = [sphere()];

  it('PIN 2 (free vs vassal) + self exclusion', () => {
    // A free neighbour fears the sphere: share × distance.
    expect(scoreFearOfDominance({ observerId: 'free1', centerId: 'C', spheres, distanceWeight01: 1 }).score).toBeCloseTo(0.6, 6);
    // A VASSAL of C never fears its own overlord (balances, never bandwagons).
    expect(scoreFearOfDominance({ observerId: 'v1', centerId: 'C', spheres, distanceWeight01: 1 }).score).toBe(0);
    // Self never fears itself.
    expect(scoreFearOfDominance({ observerId: 'C', centerId: 'C', spheres, distanceWeight01: 1 }).score).toBe(0);
  });

  it('PIN 1 (negative control): no sphere at the center ⇒ 0', () => {
    expect(scoreFearOfDominance({ observerId: 'free1', centerId: 'Z', spheres, distanceWeight01: 1 }).score).toBe(0);
    expect(scoreFearOfDominance({ observerId: 'free1', centerId: 'C', spheres: [], distanceWeight01: 1 }).score).toBe(0);
  });

  it('PIN 3 (distance monotonicity): a farther observer fears less; a scoring pair carries a receipt', () => {
    const near = scoreFearOfDominance({ observerId: 'free1', centerId: 'C', spheres, distanceWeight01: 1 });
    const far = scoreFearOfDominance({ observerId: 'free1', centerId: 'C', spheres, distanceWeight01: 0.3 });
    expect(far.score).toBeLessThan(near.score);
    expect(near.receipt.length).toBeGreaterThan(0);
    expect(far.receipt.length).toBeGreaterThan(0);
  });
});

describe('D4 — scoreBalanceRestored (pure, the unification-law mirror)', () => {
  it('a FIRM feared sphere ⇒ 0 (fear rules); a CRUMBLING one ⇒ scores as its grip slips', () => {
    const spheresFirm = [sphere({ strain: { strainedCount: 0 } })];
    const spheresCrumbling = [sphere({ strain: { strainedCount: 3 } })]; // 3/3 ties strained
    expect(scoreBalanceRestored({ observerId: 'free1', centerId: 'C', spheres: spheresFirm, distanceWeight01: 1 }).score).toBe(0);
    const crumbling = scoreBalanceRestored({ observerId: 'free1', centerId: 'C', spheres: spheresCrumbling, distanceWeight01: 1 });
    expect(crumbling.score).toBeCloseTo(0.6, 6); // share(0.6) × near(1) × strainFrac(1)
    expect(crumbling.receipt.length).toBeGreaterThan(0);
    // A vassal / self never reads balance_restored either.
    expect(scoreBalanceRestored({ observerId: 'v1', centerId: 'C', spheres: spheresCrumbling, distanceWeight01: 1 }).score).toBe(0);
  });
});

// ── The INTEGRATION (makeHegemonyFear over a real treaty topology) ───────────
const item = (id, pop = 5000) => ({ id, name: id.toUpperCase(), settlement: { name: id, tier: 'town', population: pop, config: { primaryDeitySnapshot: { name: 'Sol' } } } });
const tributeTreaty = (key, victor, loser, parties) => ({ [key]: { victorId: victor, loserId: loser, parties: parties || [victor, loser], terms: [{ type: 'tribute', complianceState: 'honored' }] } });

/** A 3-vassal sphere centred on C, plus two non-sphere parties (other1/other2) to dilute the
 *  share so belief-side divergence is observable. */
function hegemonyWorld({ beliefMaps = null } = {}) {
  const ids = ['C', 'v1', 'v2', 'v3', 'other1', 'other2', 'free1', 'free2'];
  const digest = buildSpatialDigest({
    pack: makeGridPack({ cols: 24, rows: 18 }),
    placements: placeSettlements(makeGridPack({ cols: 24, rows: 18 }), ids.length).map((p, i) => ({ id: ids[i], cellId: p.cellId })),
  });
  const treaties = {
    ...tributeTreaty('t1', 'C', 'v1', ['C', 'v1', 'other1', 'other2']),
    ...tributeTreaty('t2', 'C', 'v2'),
    ...tributeTreaty('t3', 'C', 'v3'),
  };
  const worldState = {
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'perfect_delayed' },
    spatialDigest: digest,
    spatialLedgers: { treaties, ...(beliefMaps ? { beliefMaps } : {}) },
  };
  const snapshot = { settlements: ids.map((id) => item(id)), byId: new Map(ids.map((id) => [id, item(id)])) };
  return { worldState, snapshot };
}

describe('D4 — makeHegemonyFear integration', () => {
  it('PIN 1: no treaties ⇒ hasSphere false ⇒ fear/balance 0 everywhere', () => {
    const snapshot = { settlements: [item('a'), item('b')], byId: new Map([['a', item('a')], ['b', item('b')]]) };
    const fear = makeHegemonyFear({ worldState: { spatialCanonVersion: 1, simulationRules: {}, spatialLedgers: {} }, snapshot });
    expect(fear.hasSphere).toBe(false);
    expect(fear.fearOf('a', 'b').score).toBe(0);
    expect(fear.balanceRestoredOf('a', 'b').score).toBe(0);
  });

  it('PIN 2: a 3-vassal center ⇒ fear at a FREE neighbour, 0 at a vassal', () => {
    const { worldState, snapshot } = hegemonyWorld();
    const fear = makeHegemonyFear({ worldState, snapshot });
    expect(fear.hasSphere).toBe(true);
    expect(fear.fearOf('free1', 'C').score).toBeGreaterThan(0); // a free town fears the sphere
    expect(fear.fearOf('v1', 'C').score).toBe(0);                // its own vassal does not
    expect(fear.fearOf('C', 'C').score).toBe(0);                 // nor the center itself
    expect(fear.fearOf('free1', 'v1').score).toBe(0);            // v1 centres no sphere
  });

  it('PIN 4 (belief-side divergence): a fogged observer fears the empire it BELIEVES in', () => {
    // free1 BELIEVES the sphere members strong (band 4) and the others weak; free2 the reverse.
    const strong = { readiness: 0.5, strengthBand: 4, allianceLabel: 'neutral', faithLabel: null, confidence01: 1, lastUpdateTick: 5 };
    const weak = { readiness: 0.5, strengthBand: 0, allianceLabel: 'neutral', faithLabel: null, confidence01: 1, lastUpdateTick: 5 };
    const beliefMaps = {
      free1: { [GOVERNING_SEAT_KEY]: { C: strong, v1: strong, v2: strong, v3: strong, other1: weak, other2: weak } },
      free2: { [GOVERNING_SEAT_KEY]: { C: weak, v1: weak, v2: weak, v3: weak, other1: strong, other2: strong } },
    };
    const { worldState, snapshot } = hegemonyWorld({ beliefMaps });
    const fear = makeHegemonyFear({ worldState, snapshot });
    const believer = fear.fearOf('free1', 'C').score;
    const skeptic = fear.fearOf('free2', 'C').score;
    expect(believer).toBeGreaterThan(skeptic); // the empire you believe bigger frightens you more
    expect(skeptic).toBeGreaterThanOrEqual(0);
  });

  it('PIN 5 (purity): identical calls agree and the worldState is not mutated', () => {
    const { worldState, snapshot } = hegemonyWorld();
    const before = JSON.stringify(worldState);
    const fear = makeHegemonyFear({ worldState, snapshot });
    const a = fear.fearOf('free1', 'C');
    const b = makeHegemonyFear({ worldState, snapshot }).fearOf('free1', 'C');
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(JSON.stringify(worldState)).toBe(before); // zero writes
  });
});
