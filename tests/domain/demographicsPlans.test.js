/**
 * demographicsPlans.test.js — WAVE P3, THE VALVES AND THE PLANS.
 *
 * P1 bounded the realm, P1a let a dying town die, P2 made the two tails meet. None of
 * them ever asked a settlement what it INTENDED to do about its own crowding, and none
 * of them founded anything. This file is where the answers are measured rather than
 * asserted.
 *
 * WHAT EACH SECTION PROVES, and the executed control that makes it non-vacuous:
 *
 *   1. COMPETITION BEATS   a half-empty reachable viable village absorbs the overflow
 *      FOUNDING            and NO satellite is founded. The CONTROL removes the one
 *                          village and changes nothing else: the identical town now
 *                          founds. This is the review's own defect, made a test.
 *   2. NO FLAPPING         two hundred ticks of oscillating pressure produce ONE plan.
 *                          The CONTROL removes the persistence — the plan is dropped
 *                          from the ledger every tick — and the same run churns.
 *   3. THE PROXIMITY BAND  a founding never lands inside MIN_SEPARATION of ANY
 *                          settlement (tier-PAIR banded: the same ground is legal
 *                          beside a town and refused beside a metropolis) and never
 *                          beyond MAX_REACH of its nearest. The user exception is
 *                          total on both ends. The CONTROL flattens the band to one
 *                          number and the tier-pair distinction vanishes.
 *   4. SATURATION          a realm with no legal ground founds NOTHING and the
 *                          founding lane leaves the menu by name; pressure resolves up
 *                          the EXISTING ladder instead, and the valve lane writes not
 *                          one person. The CONTROL restores the ground and the same
 *                          realm founds again.
 *   5. FOUNDING CONSERVES  the parent loses exactly what the child gains, JSON
 *                          round-tripped, and the capital is raised and spent exactly.
 *   6. DORMANCY            dark is a no-op by OBJECT IDENTITY.
 *   7. THE OWNER'S THREE   the design's three sentences fall out of the weights rather
 *      SENTENCES           than out of a special case.
 *   8. DISCIPLINE          closed vocabularies, zero new PRNG streams, replay, and a
 *                          seed family rather than one lucky realm.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import { buildSpatialDigest } from '../../src/domain/spatial/spatialDigest.js';
import { calibration } from '../../src/domain/spatial/distanceRead.js';
import { advanceDemographics } from '../../src/domain/worldPulse/demographicsKernel.js';
import {
  advanceSettlementLifecycle,
  satellitesOf,
  satellitesLedgerOf,
  SETTLEMENT_LIFECYCLE_TUNING,
} from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import { routeEdge, routeEdgeId } from '../../src/domain/worldPulse/routeNetworkLedger.js';
import {
  MIN_SEPARATION_BANDS,
  PLACEMENT_EVIDENCE,
  PLACEMENT_REFUSALS,
  SPATIAL_LAW_TUNING,
  TIER_ELBOW,
  countryReachOf,
  frontierMapOf,
  legalFoundingSites,
  occupiedCellsOf,
  realmScaleOf,
  siteLegality,
} from '../../src/domain/worldPulse/demographicsLand.js';
import {
  OVERFLOW_BANDS,
  RESPONSES,
  RESPONSE_REFUSALS,
  RESPONSE_WEIGHTS,
  overflowBandOf,
  scoreResponses,
  selectResponse,
} from '../../src/domain/worldPulse/demographicsResponses.js';
import {
  PLAN_OUTCOMES,
  PLAN_STATES,
  PLAN_TUNING,
  activePlanOf,
  plansLedgerOf,
} from '../../src/domain/worldPulse/demographicsPlans.js';
import { WORKS_KINDS, worksOf } from '../../src/domain/worldPulse/demographicsWorks.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const T = PLAN_TUNING;
const L = SPATIAL_LAW_TUNING;
const NOW = '2026-01-01T00:00:00.000Z';
const PLANS_MODULE = '../../src/domain/worldPulse/demographicsPlans.js';
const LAND_MODULE = '../../src/domain/worldPulse/demographicsLand.js';

// ── FIXTURES ─────────────────────────────────────────────────────────────────
/** A settlement with real food physics and nothing exotic. */
function place({
  id, tier = 'town', population, dailyProduction, storageMonths = 1,
  deficitPct = 0, named = 0, terrain = 'plains', importDependency = 0,
  prosperity = 'Prosperous',
} = {}) {
  return {
    population, tier, name: id, culture: 'germanic',
    config: { tier, settType: tier, terrainType: terrain, tradeRouteAccess: 'road' },
    economicState: {
      prosperity,
      foodSecurity: {
        dailyNeed: population * 2, dailyProduction, deficitPct, surplusPct: 0,
        importDependency, storageMonths, resilienceScore: 60,
      },
    },
    powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
    activeConditions: [], populationHistory: [], institutions: [],
    npcs: Array.from({ length: named }, (_, i) => ({ id: `${id}_npc_${i}` })),
  };
}

/** A world with a lived road network and the demographic engine LIT. */
function litWorld(edges = [], extra = {}) {
  const network = { edges: {}, corridor: {} };
  for (const [a, b, grade = 'road'] of edges) {
    network.edges[routeEdgeId(a, b, 'land')] = routeEdge({
      a, b, grade, mode: 'land', provenance: 'generated', flavor: 'genesis', tick: 0,
    });
  }
  return {
    rngSeed: 'p3',
    simulationRules: { demographicsEnabled: true, routeLifecycleEnabled: true, ...(extra.rules || {}) },
    ...(edges.length ? { spatialLedgers: { routeNetwork: network } } : {}),
    ...(extra.rest || {}),
  };
}

/** @param {Array<{ saveId: string, settlement: Record<string, unknown> }>} updates */
function snapOf(updates, causalById = {}) {
  return {
    settlements: updates.map((u) => ({
      id: u.saveId, name: u.saveId, settlement: u.settlement,
      ...(causalById[u.saveId] ? { causal: { scores: causalById[u.saveId] } } : {}),
    })),
  };
}

const CAPS = /** @type {Record<string, number>} */ (SETTLEMENT_LIFECYCLE_TUNING.SATELLITE_CAPS);

/** Run the whole demographic step (rates, homeostat AND valves) for `ticks`. */
function run({
  updates, worldState, ticks, causal = {}, seed = 'p3', laneLit = true, digest = null,
  advance = advanceDemographics,
}) {
  let live = updates;
  let ws = worldState;
  const planReceipts = [];
  const intents = [];
  const planAccounts = [];
  for (let t = 1; t <= ticks; t += 1) {
    const r = advance({
      snapshot: snapOf(live, causal), worldState: ws, settlementUpdates: live,
      rng: createPRNG(`${seed}::${t}`), tick: t,
      satelliteLaneLit: laneLit, digest, satelliteCaps: CAPS,
    });
    ws = r.worldState;
    live = r.settlementUpdates;
    planReceipts.push(...r.planReceipts);
    intents.push(...r.foundIntents.map((i) => ({ tick: t, ...i })));
    planAccounts.push(r.planAccounting);
  }
  return { live, worldState: ws, planReceipts, intents, planAccounts };
}

const opened = (receipts) => receipts.filter((r) => r.kind === 'demographic_plan_opened');
const closed = (receipts) => receipts.filter((r) => r.kind === 'demographic_plan_closed');
/** Every episode that was DECIDED this run, whichever way it resolved. `send` is
 *  finished the moment it is chosen (the homeostat already moved those people), so it
 *  closes without ever opening a persisted plan; both shapes carry the menu. */
const episodes = (receipts) => receipts.filter((r) => Array.isArray(r.considered));
const sumOf = (rows, key) => rows.reduce((s, a) => s + a[key], 0);

// ── THE MAP (mirrors the wave-E fixture builder: h / biome / r / p / c) ───────
function bandPack({ cols, rows, ground }) {
  const n = cols * rows;
  const h = new Array(n); const biome = new Array(n);
  const r = new Array(n); const p = new Array(n); const c = new Array(n);
  const idx = (col, row) => row * cols + col;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const i = idx(col, row);
      const g = ground(col, row);
      h[i] = g.h; biome[i] = g.biome; r[i] = g.river ? 1 : 0;
      p[i] = [col * 40, row * 40];
      const nb = [];
      if (col > 0) nb.push(idx(col - 1, row));
      if (col < cols - 1) nb.push(idx(col + 1, row));
      if (row > 0) nb.push(idx(col, row - 1));
      if (row < rows - 1) nb.push(idx(col, row + 1));
      c[i] = nb;
    }
  }
  return { cells: { h, biome, r, p, c } };
}
const GRASS = { h: 40, biome: 4 };

/** A digest over an all-grass map with settlements seated at named cells. */
function grassDigest({ cols = 24, rows = 8, seats }) {
  return buildSpatialDigest({
    pack: bandPack({ cols, rows, ground: () => GRASS }),
    placements: Object.entries(seats).map(([id, cellId]) => ({ id, cellId })),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
describe('1. DESTINATION COMPETITION BEATS FOUNDING (acceptance claim 6)', () => {
  // A town packed past its walls, with room to spare in its granaries, beside a
  // viable village with plenty of room. The town WANTS to shed people; the question
  // is whether the realm's existing empty houses answer before its frontier does.
  const crowdedTown = () => ({
    saveId: 'Crowdhold',
    settlement: place({ id: 'Crowdhold', tier: 'town', population: 9500, dailyProduction: 40000 }),
  });
  const emptyVillage = () => ({
    saveId: 'Emptyvale',
    settlement: place({ id: 'Emptyvale', tier: 'village', population: 200, dailyProduction: 3000, prosperity: 'Stable' }),
  });
  const causal = { Crowdhold: { economic_capacity: 85, trade_connectivity: 80 } };

  test('the village absorbs the overflow, the founding lane leaves the menu by name, and NOTHING is founded', () => {
    const out = run({
      updates: [crowdedTown(), emptyVillage()],
      worldState: litWorld([['Crowdhold', 'Emptyvale']]),
      ticks: 30, causal,
    });
    // The homeostat moved people, and moved ALL of the ones who wanted to go.
    const village = out.live.find((u) => u.saveId === 'Emptyvale');
    expect(village.settlement.population, 'nobody reached the village at all').toBeGreaterThan(200);

    const opens = episodes(out.planReceipts);
    expect(opens.length, 'the town never even considered a response').toBeGreaterThan(0);
    // AND THE ANSWER WAS TO SEND THEM. The homeostat had already placed everyone, so
    // the episode resolves the same tick with no plan to persist.
    expect(opens.map((o) => o.response)).toContain('send');
    // THE CLAIM: the founding lane is not merely out-weighed, it is REFUSED, and the
    // refusal names the reason.
    for (const o of opens) {
      expect(o.refused, `${o.line}`).toContain('satellite:absorbed');
      // ANCHORED: the considered menu must be LIVE — it still carries the deepening
      // responses — before its missing founding entry means anything. A bare
      // not.toContain here would pass just as happily if the menu had drifted to empty.
      expectAbsentWithAnchor(o.considered, 'satellite', 'infrastructure', 'the absorbed menu');
    }
    expect(out.intents, 'a steading was founded over a realm with empty houses in it').toEqual([]);
  });

  test('NEGATIVE CONTROL: remove the one village and the identical town founds', () => {
    // The SAME town, the same tick count. The only difference in the whole world is
    // that there is nowhere for its people to go. Measured across a seed FAMILY rather
    // than one realm, because the response is a weighted race and not a decree: what
    // the law guarantees is that the founding lane is on the MENU here and off it
    // there, and what the weights then make likely is that some of these realms
    // actually break ground.
    const withoutVillage = Array.from({ length: 12 }, (_, i) => run({
      updates: [crowdedTown()],
      worldState: { ...litWorld(), rngSeed: `alone-${i}` },
      ticks: 60, causal, seed: `alone-${i}`,
    }));
    const withVillage = Array.from({ length: 12 }, (_, i) => run({
      updates: [crowdedTown(), emptyVillage()],
      worldState: { ...litWorld([['Crowdhold', 'Emptyvale']]), rngSeed: `alone-${i}` },
      ticks: 60, causal, seed: `alone-${i}`,
    }));

    // ON THE MENU vs OFF IT — the structural half, true in EVERY realm of the family.
    for (const out of withoutVillage) {
      for (const o of episodes(out.planReceipts)) {
        expect(o.considered, 'the lane was refused even with nowhere to send anyone').toContain('satellite');
      }
    }
    for (const out of withVillage) {
      for (const o of episodes(out.planReceipts)) {
        expect(o.refused).toContain('satellite:absorbed');
      }
    }
    // AND THE OUTCOME — the behavioural half. Not one founding across the realms that
    // had somewhere to send people; real foundings across the realms that did not.
    const foundedAlone = withoutVillage.filter((o) => o.intents.length > 0).length;
    const foundedBeside = withVillage.filter((o) => o.intents.length > 0).length;
    expect(foundedBeside, 'a steading was founded over a realm with empty houses in it').toBe(0);
    expect(foundedAlone, 'no realm in the family broke ground even with nowhere to send anyone')
      .toBeGreaterThan(0);
  });

  test('RESTORE: the village back, the founding gone again', () => {
    const out = run({
      updates: [crowdedTown(), emptyVillage()],
      worldState: litWorld([['Crowdhold', 'Emptyvale']]),
      ticks: 30, causal,
    });
    expect(out.intents).toEqual([]);
  });

  test('a settlement that raised NO column is not "absorbed": the frontier stays an honest answer', () => {
    // Nobody wanted to leave (no column, so nothing was placed and nothing left over).
    // That is not the realm answering; it is the realm never being asked.
    const scored = scoreResponses({
      readings: {
        foodKnown: true, foodFlowRatio: 2.1, foodFlowBand: 'ample', reserveCoverage: 0.1,
        reserveBand: 'bare', urbanLoadRatio: 1.1, urbanLoadBand: 'overspilled',
        population: 9500, foodCapacity: 20000, densityCeiling: 8625, bound: 8625, binding: 'walls',
      },
      pressure01: 1.1, tier: 'town', prosperity01: 0.85, connectivity01: 0.8,
      homeostat: { placed: 0, unplaced: 0, considered: 0 },
      ground: { applicable: false, saturated: false, sites: 0 },
      satelliteLaneLit: true, satelliteCap: 2,
    });
    const satellite = scored.find((s) => s.response === 'satellite');
    expect(satellite.available).toBe(true);
    expect(satellite.refusal).toBe('available');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('2. NO FLAPPING — the plan, not the reroll (§5c, acceptance claim 5)', () => {
  // Pressure that crosses the demand rung over and over. A lane that redrew every
  // tick would produce a new intention every week and a chronicle nobody can follow.
  const oscillating = () => [{
    saveId: 'Tidehold',
    settlement: place({ id: 'Tidehold', tier: 'town', population: 8300, dailyProduction: 40000 }),
  }];
  const causal = { Tidehold: { economic_capacity: 85, trade_connectivity: 80 } };

  /** Push the head count up and down across the `pressed` threshold every few ticks. */
  function oscillate(live, t) {
    const swing = (t % 20) < 10 ? 8300 : 7400;
    return [{ ...live[0], settlement: { ...live[0].settlement, population: swing } }];
  }

  function runOscillating({ advance = advanceDemographics } = {}) {
    let live = oscillating();
    let ws = litWorld();
    const receipts = [];
    for (let t = 1; t <= 200; t += 1) {
      live = oscillate(live, t);
      const r = advance({
        snapshot: snapOf(live, causal), worldState: ws, settlementUpdates: live,
        rng: createPRNG(`flap::${t}`), tick: t,
        satelliteLaneLit: true, digest: null, satelliteCaps: CAPS,
      });
      ws = r.worldState;
      live = r.settlementUpdates;
      receipts.push(...r.planReceipts);
    }
    return { receipts, worldState: ws };
  }

  test('two hundred ticks of oscillating pressure produce ONE plan', () => {
    const { receipts } = runOscillating();
    const opens = opened(receipts);
    expect(opens.length, `opened ${opens.length}: ${opens.map((o) => o.response).join(', ')}`).toBe(1);
    // And it is a real commitment with a real cost, not a token.
    expect(opens[0].duration).toBeGreaterThan(0);
    expect(opens[0].startupCost).toBeGreaterThan(0);
  });

  test('NEGATIVE CONTROL: drop the persistence and the identical run churns', async () => {
    vi.resetModules();
    vi.doMock(PLANS_MODULE, async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        // The ONE property under test: a settlement's plan never survives the tick, so
        // every tick the lane finds no active plan and the band reads as freshly
        // crossed. This is exactly the "reroll" §5c was written to forbid.
        advanceDemographicPlans: (args) => actual.advanceDemographicPlans({
          ...args,
          worldState: { ...args.worldState, spatialLedgers: undefined },
        }),
      };
    });
    const churny = await import('../../src/domain/worldPulse/demographicsKernel.js');
    const { receipts } = runOscillating({ advance: churny.advanceDemographics });
    vi.doUnmock(PLANS_MODULE);
    vi.resetModules();

    const opens = opened(receipts);
    expect(opens.length, 'the control did not churn at all').toBeGreaterThan(10);
  });

  test('RESTORE: the persistence back, one plan again', () => {
    const { receipts } = runOscillating();
    expect(opened(receipts).length).toBe(1);
  });

  test('a plan is abandoned only on a band-crossing MAGNITUDE, never on drift', () => {
    expect(T.ABANDON_BAND_DROP).toBeGreaterThanOrEqual(2);
    // Drift inside one rung, and one rung down, must both leave the plan standing;
    // the vocabulary itself is what the reconsideration threshold is measured in.
    expect(OVERFLOW_BANDS.length).toBe(4);
    expect(overflowBandOf(0.0)).toBe('easy');
    expect(overflowBandOf(1.5)).toBe('overflowing');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('3. THE PROXIMITY BAND — any-settlement on BOTH ends (§5b, J-P6, J-P6b, J-P8)', () => {
  // Two settlements, close together on open grass. The pair's cost IS the realm's
  // median primary hop, so every band below is read in the realm's own units and
  // nothing here is a hardcoded distance.
  const pairDigest = () => grassDigest({ seats: { alpha: 26, beta: 32 } });

  function readingFor(digest, parentId, cell, neighbourTier) {
    return siteLegality({
      digest, parentId, cell, newTier: 'thorp',
      tierOf: (id) => (id === parentId ? 'town' : neighbourTier),
      frontier: frontierMapOf(digest, parentId),
      country: countryReachOf(digest, parentId),
      occupied: new Set(),
      scale: realmScaleOf(digest),
    });
  }

  test('the SAME ground is legal beside a town and refused beside a metropolis (the tier PAIR is the law)', () => {
    const digest = pairDigest();
    const frontier = frontierMapOf(digest, 'alpha');
    expect(frontier.size, 'the fixture recorded no gate at all').toBeGreaterThan(0);
    const cell = [...frontier.keys()][0];

    const besideTown = readingFor(digest, 'alpha', cell, 'town');
    const besideMetropolis = readingFor(digest, 'alpha', cell, 'metropolis');

    expect(besideTown.legal, `${JSON.stringify(besideTown)}`).toBe(true);
    expect(besideMetropolis.legal).toBe(false);
    expect(besideMetropolis.refusal).toBe('too_close');
    // And the reason is the band, derived from the live table rather than restated.
    const scale = realmScaleOf(digest);
    expect(besideMetropolis.reach).toBeLessThan(MIN_SEPARATION_BANDS.thorp.metropolis * scale);
    expect(besideTown.reach).toBeGreaterThanOrEqual(MIN_SEPARATION_BANDS.thorp.town * scale);
  });

  test('NEGATIVE CONTROL: flatten the band to one number and the tier-pair distinction vanishes', () => {
    // J-P6's VETO, executed: "VETO flattens to one number." The identical candidate,
    // the identical realm, the identical code path — only the table changes.
    const digest = pairDigest();
    const frontier = frontierMapOf(digest, 'alpha');
    const cell = [...frontier.keys()][0];
    const flat = Object.fromEntries(Object.keys(MIN_SEPARATION_BANDS).map((a) => [
      a, Object.fromEntries(Object.keys(MIN_SEPARATION_BANDS[a]).map((b) => [b, 0.2])),
    ]));
    const one = (tier, bands) => siteLegality({
      digest, parentId: 'alpha', cell, newTier: 'thorp',
      tierOf: (id) => (id === 'alpha' ? 'town' : tier),
      frontier, country: countryReachOf(digest, 'alpha'),
      occupied: new Set(), scale: realmScaleOf(digest), bands,
    });

    // Banded, the metropolis refuses and the town does not — that is the pin above.
    expect(one('town', undefined).legal).toBe(true);
    expect(one('metropolis', undefined).legal).toBe(false);
    // FLATTENED: the metropolis is treated exactly like the town, and J-P6's whole
    // distinction is gone. The assertion above is therefore the band's doing.
    expect(one('town', flat).legal).toBe(true);
    expect(one('metropolis', flat).legal).toBe(true);
  });

  test('RESTORE: the banded table back, the metropolis refuses again', () => {
    const digest = pairDigest();
    const frontier = frontierMapOf(digest, 'alpha');
    expect(readingFor(digest, 'alpha', [...frontier.keys()][0], 'metropolis').legal).toBe(false);
  });

  test('the MAX end: a settlement whose country runs far past the realm\'s reach is refused for BEYOND_REACH', () => {
    // Two neighbours close together set the median primary hop; the third sits far
    // out. Its own country is wider than the realm's reach, so its hinterland is the
    // deep wild and §5b refuses to sprawl into it.
    const digest = grassDigest({ cols: 40, rows: 8, seats: { alpha: 40, beta: 42, gamma: 78 } });
    const scale = realmScaleOf(digest);
    const country = countryReachOf(digest, 'gamma');
    expect(country.primaryCount, 'gamma has no neighbour to be measured against').toBeGreaterThan(0);
    expect(country.radius, 'the fixture did not put gamma out past the reach law')
      .toBeGreaterThan(L.MAX_REACH * scale);

    // A HINTERLAND cell (not a recorded gate) of gamma's country.
    const ground = legalFoundingSites({
      digest, worldState: {}, parentId: 'gamma', newTier: 'thorp', tierOf: () => 'town',
    });
    expect(ground.refusals.beyond_reach, 'nothing was refused for reach').toBeGreaterThan(0);
  });

  test('THE USER EXCEPTION IS TOTAL (J-P8): the sovereign hand is never refused, on either end', () => {
    const digest = pairDigest();
    const frontier = frontierMapOf(digest, 'alpha');
    const cell = [...frontier.keys()][0];
    const engine = readingFor(digest, 'alpha', cell, 'metropolis');
    const user = siteLegality({
      digest, parentId: 'alpha', cell, newTier: 'metropolis',
      tierOf: () => 'metropolis',
      frontier, country: countryReachOf(digest, 'alpha'),
      // Occupied, too close, and the largest possible tier pair: every band would
      // refuse this. The exception is read BEFORE any of them.
      occupied: new Set([cell]), scale: realmScaleOf(digest),
      provenance: 'user',
    });
    expect(engine.legal).toBe(false);
    expect(user.legal).toBe(true);
    expect(user.exempt).toBe(true);
    expect(user.refusal).toBe('none');
  });

  test('occupancy is REALM-WIDE, not just the parent\'s own orbit', () => {
    // Wave E hands `orbitAnnulus` only the parent's steadings. §5b measures against
    // the whole realm, so a cell another parent's steading holds is not open ground.
    const held = occupiedCellsOf({
      spatialLedgers: {
        satellites: {
          alpha: { steadings: { 'steading.alpha.1': { site: { cell: 11 } } } },
          beta: { steadings: { 'steading.beta.1': { site: { cell: 22 } } } },
        },
      },
    });
    expect([...held].sort((a, b) => a - b)).toEqual([11, 22]);
  });

  test('an ASPATIAL world has no land ledger: the law is INAPPLICABLE, never saturated', () => {
    const ground = legalFoundingSites({
      digest: null, worldState: {}, parentId: 'alpha', newTier: 'thorp', tierOf: () => 'town',
    });
    expect(ground.applicable).toBe(false);
    expect(ground.saturated, 'an aspatial realm was declared saturated and would found nothing').toBe(false);
    expect(ground.refusals.aspatial).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('4. SATURATION — the ladder takes over (§5b, J-P7, acceptance claim 8)', () => {
  test('an empty filtered candidate set IS the signal, discovered per attempt', () => {
    const digest = grassDigest({ seats: { alpha: 26, beta: 32 } });
    // Every cell of alpha's country already held. Nothing is precomputed and no census
    // is stored: the answer is the filter coming back empty.
    const territory = digest.territory;
    const mine = territory.map((t, i) => [t, i]).filter(([t]) => t === digest.settlementIds.indexOf('alpha')).map(([, i]) => i);
    const worldState = {
      spatialLedgers: {
        satellites: {
          alpha: {
            steadings: Object.fromEntries(mine.map((cell, i) => [`steading.alpha.${i}`, { site: { cell } }])),
          },
        },
      },
    };
    const ground = legalFoundingSites({
      digest, worldState, parentId: 'alpha', newTier: 'thorp', tierOf: () => 'town',
    });
    expect(ground.sites.length).toBe(0);
    expect(ground.saturated).toBe(true);
    expect(ground.applicable).toBe(true);
  });

  test('at saturation the founding lane leaves the menu BY NAME and the deepening leans rise', () => {
    const base = {
      readings: {
        foodKnown: true, foodFlowRatio: 0.85, foodFlowBand: 'short', reserveCoverage: 0.3,
        reserveBand: 'thin', urbanLoadRatio: 1.05, urbanLoadBand: 'packed',
        population: 9000, foodCapacity: 9200, densityCeiling: 8625, bound: 8625, binding: 'walls',
      },
      pressure01: 1.05, tier: 'town', prosperity01: 0.8, connectivity01: 0.8,
      homeostat: { placed: 0, unplaced: 40, considered: 1 },
      satelliteLaneLit: true, satelliteCap: 2,
    };
    const open = scoreResponses({ ...base, ground: { applicable: true, saturated: false, sites: 6 } });
    const shut = scoreResponses({ ...base, ground: { applicable: true, saturated: true, sites: 0 } });

    const satOpen = open.find((s) => s.response === 'satellite');
    const satShut = shut.find((s) => s.response === 'satellite');
    expect(satOpen.available).toBe(true);
    expect(satShut.available).toBe(false);
    expect(satShut.refusal).toBe('no_ground');
    expect(satShut.weight).toBe(0);

    // A SATURATED REALM STOPS SPRAWLING AND STARTS DEEPENING. Every response that
    // carries the saturation term gains weight, and they are the deepening ones.
    for (const response of ['imports', 'infrastructure', 'promotion']) {
      const before = open.find((s) => s.response === response).weight;
      const after = shut.find((s) => s.response === response).weight;
      expect(after, `${response} did not deepen at saturation`).toBeGreaterThan(before);
    }
  });

  test('NEGATIVE CONTROL: restore the ground and the identical realm founds again', () => {
    const digest = grassDigest({ seats: { alpha: 26, beta: 32 } });
    const ground = legalFoundingSites({
      digest, worldState: {}, parentId: 'alpha', newTier: 'thorp', tierOf: () => 'town',
    });
    expect(ground.saturated).toBe(false);
    expect(ground.sites.length).toBeGreaterThan(0);
  });

  test('the valve lane writes NOT ONE PERSON: the tier ladder stays the existing conserved path', () => {
    // A saturated, pressed town over a long window. Whatever the plan lane does, the
    // realm's head count must be explained entirely by births, deaths and migration —
    // the plan lane's own outcomeIds must never appear on a populationHistory row.
    const out = run({
      updates: [{
        saveId: 'Deepdelve',
        settlement: place({ id: 'Deepdelve', tier: 'town', population: 8300, dailyProduction: 40000 }),
      }],
      worldState: litWorld(),
      ticks: 120,
      causal: { Deepdelve: { economic_capacity: 85, trade_connectivity: 80 } },
      laneLit: false,          // wave E dark: the founding lane does not exist at all
    });
    const rows = out.live[0].settlement.populationHistory || [];
    // THE LIVENESS ANCHOR: the history must be a LIVE record of a settlement whose head
    // count really moved, and the movement must be attributed to the lanes that are
    // allowed to move it. Without this, "no plan row" would pass on an empty history.
    expect(rows.length, 'the fixture wrote no population history at all').toBeGreaterThan(0);
    const owners = rows.map((r) => String(r.outcomeId || '').split('.')[1]);
    expect(owners, 'no demographic lane wrote a row, so the absence below is vacuous')
      .toContain(out.live[0].saveId);
    const planRows = rows.filter((r) => /^demographics\.plan\./.test(String(r.outcomeId || '')));
    expect(planRows, 'the valve lane moved people directly').toEqual([]);
    // And with the lane dark, the founding response is refused by name rather than
    // silently unavailable.
    for (const o of opened(out.planReceipts)) {
      expect(o.refused).toContain('satellite:lane_dark');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('5. FOUNDING CONSERVES — people AND capital (acceptance claim 7)', () => {
  /**
   * Drive the REAL host seam, BOTH flags lit, over a spatial world — the owner's farm
   * town: fields that make a genuine surplus, open ground, ordinary means, and roads
   * that reach nobody, so the homeostat has nowhere to send anyone and the frontier is
   * an honest answer. 24 x 8 = 192 cells, so both seats must be inside that range: an
   * out-of-range seat is silently skipped by the digest builder and the parent then has
   * no country at all, which is how the first draft of this fixture founded nothing.
   */
  function foundThroughTheLane(seed) {
    const digest = grassDigest({ seats: { Brimhold: 26, Farvale: 160 } });
    let live = [
      { saveId: 'Brimhold', settlement: place({ id: 'Brimhold', tier: 'town', population: 9500, dailyProduction: 40000, prosperity: 'Stable' }) },
      { saveId: 'Farvale', settlement: place({ id: 'Farvale', tier: 'village', population: 900, dailyProduction: 2000, prosperity: 'Stable' }) },
    ];
    let ws = {
      rngSeed: seed,
      tick: 0,
      simulationRules: { demographicsEnabled: true, settlementLifecycleEnabled: true },
      spatialCanonVersion: 1,
      spatialDigest: digest,
    };
    const founded = [];
    for (let t = 1; t <= 80; t += 1) {
      const r = advanceSettlementLifecycle({
        snapshot: snapOf(live, { Brimhold: { economic_capacity: 45, trade_connectivity: 20 } }),
        worldState: ws, settlementUpdates: live,
        pIndex: null, rng: createPRNG(`${seed}::${t}`), tick: t, now: NOW,
      });
      for (const rec of r.receipts) if (rec.kind === 'satellite_founded') founded.push({ tick: t, ...rec });
      ws = r.worldState;
      live = r.settlementUpdates;
    }
    return { live, worldState: ws, founded, digest };
  }

  test('a plan-driven founding lands through the ONE mint, and the parent pays for it exactly', () => {
    // A seed FAMILY, because which response wins is a weighted race and not a decree.
    // What must hold in EVERY realm that founds is the conservation; what must hold
    // across the family is that founding happens at all.
    const family = Array.from({ length: 8 }, (_, i) => foundThroughTheLane(`found-${i}`));
    const withFoundings = family.filter((o) => o.founded.some((f) => f.sources && f.sources.plan === true));
    expect(withFoundings.length, 'no realm in the family founded through a plan').toBeGreaterThan(0);

    for (const out of withFoundings) {
      const planDriven = out.founded.filter((f) => f.sources && f.sources.plan === true);
      for (const first of planDriven) {
        // The receipt proves it came through the DELIBERATED path, carrying the plan's
        // own identity and the reasons that won the race.
        expect(first.planId).toMatch(/^plan\.Brimhold\./);
        expect(Array.isArray(first.because)).toBe(true);
        expect(first.provisionSpent).toBe(T.STARTUP.satellite);

        // JSON ROUND-TRIPPED, because a satellite is a serialized ledger record and an
        // in-memory-only equality would not prove the child survives a save.
        const reloaded = JSON.parse(JSON.stringify(out.worldState));
        const child = satellitesOf(satellitesLedgerOf(reloaded), 'Brimhold').find((s) => s.id === first.satId);
        expect(child, 'the founded steading did not survive a JSON round trip').toBeTruthy();

        // CONSERVATION: the parent's own history carries a debit of exactly the
        // founders, and the child received exactly that.
        const parent = out.live.find((u) => u.saveId === 'Brimhold');
        const debit = (parent.settlement.populationHistory || [])
          .filter((r) => String(r.outcomeId || '') === `lifecycle.found.${first.satId}`)
          .reduce((s, r) => s + r.delta, 0);
        // populationHistory keeps only the last twelve rows, so a debit that has
        // scrolled off is not evidence of a missing debit; when it is still there it
        // must be exact.
        if (debit !== 0) expect(debit, 'the parent did not pay for the child').toBe(-first.founders);
        expect(child.population, 'the child did not receive what the parent paid')
          .toBeGreaterThanOrEqual(first.founders);
        // AND THE GROUND IT STANDS ON WAS THE LAW'S, not a re-pick: the plan chose the
        // site at proposal and the mint used it verbatim.
        expect(child.site, 'the founded steading sampled no ground at all').toBeTruthy();
      }
    }
  });

  test('the CAPITAL is raised and spent exactly: nothing is minted and nothing vanishes unnamed', () => {
    const out = run({
      updates: [{
        saveId: 'Coffers',
        settlement: place({ id: 'Coffers', tier: 'town', population: 8300, dailyProduction: 40000 }),
      }],
      worldState: litWorld(),
      ticks: 60,
      causal: { Coffers: { economic_capacity: 85, trade_connectivity: 80 } },
    });
    const raised = sumOf(out.planAccounts, 'provisionRaised');
    const spent = sumOf(out.planAccounts, 'provisionSpent');
    const forfeited = sumOf(out.planAccounts, 'provisionForfeited');
    const held = Object.values(plansLedgerOf(out.worldState))
      .reduce((s, row) => s + (row.plan ? row.plan.provision : 0), 0);

    expect(raised, 'no capital was raised at all').toBeGreaterThan(0);
    // Every unit raised is either in a completed undertaking, forfeited with a named
    // outcome, or still sitting in an open plan. There is no fourth place for it to be.
    const closedRows = closed(out.planReceipts);
    const accountedRaised = closedRows.reduce((s, r) => s + r.provisionRaised, 0) + held;
    expect(accountedRaised, 'capital went somewhere the accounting cannot name').toBe(raised);
    expect(spent + forfeited).toBeLessThanOrEqual(raised);
  });

  test('a completed WORK raises a bound and mints nobody', () => {
    const before = worksOf({}, 'anywhere');
    expect(before).toEqual({ emigration: 0, imports: 0, infrastructure: 0 });
    const after = worksOf({
      spatialLedgers: { demographicPlans: { anywhere: { works: { infrastructure: 2 } } } },
    }, 'anywhere');
    expect(after.infrastructure).toBe(2);
    // Capped, so the ceiling cannot be walked upward forever.
    const overflowed = worksOf({
      spatialLedgers: { demographicPlans: { anywhere: { works: { infrastructure: 99 } } } },
    }, 'anywhere');
    expect(overflowed.infrastructure).toBe(3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('6. DORMANCY — dark is a no-op by OBJECT IDENTITY', () => {
  const dark = () => ({ simulationRules: {}, rngSeed: 'dark' });
  const updates = () => [{
    saveId: 'Stillhold',
    settlement: place({ id: 'Stillhold', tier: 'town', population: 9500, dailyProduction: 40000 }),
  }];

  test('the SAME references come back: zero keys, zero receipts, zero intents', () => {
    const live = updates();
    const ws = dark();
    const r = advanceDemographics({
      snapshot: snapOf(live), worldState: ws, settlementUpdates: live,
      rng: createPRNG('dark'), tick: 40,
      satelliteLaneLit: true, digest: grassDigest({ seats: { Stillhold: 26, other: 32 } }), satelliteCaps: CAPS,
    });
    expect(r.worldState).toBe(ws);
    expect(r.settlementUpdates).toBe(live);
    expect(r.changed).toBe(false);
    expect(r.planReceipts).toEqual([]);
    expect(r.foundIntents).toEqual([]);
    expect(ws.spatialLedgers).toBeUndefined();
  });

  test('NEGATIVE CONTROL for the identity pin: lit, the SAME call allocates and writes', () => {
    const live = updates();
    const ws = { ...dark(), simulationRules: { demographicsEnabled: true } };
    const r = advanceDemographics({
      snapshot: snapOf(live, { Stillhold: { economic_capacity: 85 } }),
      worldState: ws, settlementUpdates: live,
      rng: createPRNG('dark'), tick: 40,
      satelliteLaneLit: true, digest: null, satelliteCaps: CAPS,
    });
    expect(r.worldState).not.toBe(ws);
    expect(r.planReceipts.length).toBeGreaterThan(0);
  });

  test('drop-when-empty: a realm whose plans have all closed carries no key', () => {
    // One tick at easy pressure writes nothing worth keeping.
    const live = [{
      saveId: 'Quiethold',
      settlement: place({ id: 'Quiethold', tier: 'town', population: 3000, dailyProduction: 40000 }),
    }];
    const ws = litWorld();
    const r = advanceDemographics({
      snapshot: snapOf(live), worldState: ws, settlementUpdates: live,
      rng: createPRNG('quiet'), tick: 1,
      satelliteLaneLit: true, digest: null, satelliteCaps: CAPS,
    });
    expect(plansLedgerOf(r.worldState)).toEqual({});
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('7. THE OWNER\'S THREE SENTENCES fall out of the weights', () => {
  const readings = (over) => ({
    foodKnown: true, foodFlowRatio: 1.4, foodFlowBand: 'ample', reserveCoverage: 0.5,
    reserveBand: 'stocked', urbanLoadRatio: 1.0, urbanLoadBand: 'packed',
    population: 9000, foodCapacity: 30000, densityCeiling: 8625, bound: 8625, binding: 'walls',
    ...over,
  });
  const heaviest = (scored) => scored.slice().sort((a, b) => b.weight - a.weight)[0].response;

  test('a wealthy centralized trade town BECOMES A CITY', () => {
    const scored = scoreResponses({
      readings: readings({ population: 7900, foodCapacity: 60000 }),
      pressure01: 0.95, tier: 'town', prosperity01: 0.95, connectivity01: 0.95,
      homeostat: { placed: 0, unplaced: 5, considered: 0 },
      ground: { applicable: true, saturated: false, sites: 1 },
      satelliteLaneLit: true, satelliteCap: 2,
    });
    expect(heaviest(scored)).toBe('promotion');
  });

  test('a farm town with OPEN LAND spins off steadings', () => {
    const scored = scoreResponses({
      readings: readings({ foodFlowRatio: 1.8, foodCapacity: 30000, population: 8800 }),
      pressure01: 1.02, tier: 'town', prosperity01: 0.35, connectivity01: 0.25,
      homeostat: { placed: 0, unplaced: 120, considered: 0 },
      ground: { applicable: true, saturated: false, sites: 8 },
      satelliteLaneLit: true, satelliteCap: 2,
    });
    expect(heaviest(scored)).toBe('satellite');
  });

  test('a walled metropolis with NO GROUND imports and intensifies', () => {
    const scored = scoreResponses({
      readings: readings({
        // WAVE P4 FIXTURE CORRECTION (not a behaviour change): `bound` was left at the
        // helper's town-scale default of 8625 while this metropolis declared a food
        // capacity of 130000 and a density ceiling of 161000, so the reading was
        // internally inconsistent. Nothing read `bound` before P4, so the inconsistency
        // was invisible; the §7b ladder gate does read it, and an 8625 bound under the
        // metropolis population floor of 25001 correctly grades the place nonviable.
        // min(130000, 161000) is what demographicReadings would actually produce here.
        binding: 'granary', foodFlowRatio: 0.72, foodCapacity: 130000,
        population: 150000, densityCeiling: 161000, bound: 130000,
      }),
      pressure01: 1.15, tier: 'metropolis', prosperity01: 0.8, connectivity01: 0.9,
      homeostat: { placed: 0, unplaced: 600, considered: 0 },
      ground: { applicable: true, saturated: true, sites: 0 },
      satelliteLaneLit: true, satelliteCap: 6,
    });
    const top = scored.slice().sort((a, b) => b.weight - a.weight).map((s) => s.response);
    expect(top.slice(0, 2).sort()).toEqual(['imports', 'infrastructure']);
    expect(scored.find((s) => s.response === 'promotion').refusal).toBe('no_next_tier');
    expect(scored.find((s) => s.response === 'satellite').refusal).toBe('no_ground');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('8. DISCIPLINE — vocabularies, streams, replay, and a seed FAMILY', () => {
  test('every vocabulary is closed and codepoint-ordered', () => {
    for (const list of [RESPONSES, RESPONSE_REFUSALS, PLAN_STATES, PLACEMENT_REFUSALS, PLACEMENT_EVIDENCE, WORKS_KINDS]) {
      expect(list.slice().sort()).toEqual([...list]);
      expect(new Set(list).size).toBe(list.length);
    }
    // Every response carries authored weights, and every weighted reason is named.
    for (const response of RESPONSES) {
      expect(Object.keys(RESPONSE_WEIGHTS[response]).length).toBeGreaterThan(0);
    }
    // The tier-pair band is TOTAL over the ladder, and both grades pay their elbow.
    for (const a of Object.keys(TIER_ELBOW)) {
      for (const b of Object.keys(TIER_ELBOW)) {
        expect(MIN_SEPARATION_BANDS[a][b]).toBeCloseTo(TIER_ELBOW[a] + TIER_ELBOW[b], 6);
      }
    }
  });

  test('THE LANE OPENS NO STREAM: P1\'s exactly-two-draws pin still holds with the valves lit', () => {
    // A counting rng: every fork and every draw is recorded, so a lane that quietly
    // took one would be visible here rather than in a soak six weeks from now.
    const forks = [];
    const counting = {
      fork: (key) => {
        const row = { key, draws: 0 };
        forks.push(row);
        return { random: () => { row.draws += 1; return 0.5; } };
      },
    };
    const live = [{
      saveId: 'Countinghouse',
      settlement: place({ id: 'Countinghouse', tier: 'town', population: 9500, dailyProduction: 40000 }),
    }];
    advanceDemographics({
      snapshot: snapOf(live, { Countinghouse: { economic_capacity: 85 } }),
      worldState: litWorld(), settlementUpdates: live,
      rng: counting, tick: 40,
      satelliteLaneLit: true, digest: null, satelliteCaps: CAPS,
    });
    expect(forks.map((f) => f.key)).toEqual(['demographics:Countinghouse']);
    expect(forks[0].draws, 'the valve lane took a draw of its own').toBe(2);
  });

  test('the response race is INDEPENDENT of the order the responses are considered in', () => {
    const scored = scoreResponses({
      readings: {
        foodKnown: true, foodFlowRatio: 1.2, foodFlowBand: 'ample', reserveCoverage: 0.4,
        reserveBand: 'stocked', urbanLoadRatio: 1.0, urbanLoadBand: 'packed',
        population: 9000, foodCapacity: 30000, densityCeiling: 8625, bound: 8625, binding: 'walls',
      },
      pressure01: 1.0, tier: 'town', prosperity01: 0.6, connectivity01: 0.6,
      homeostat: { placed: 0, unplaced: 50, considered: 0 },
      ground: { applicable: true, saturated: false, sites: 4 },
      satelliteLaneLit: true, satelliteCap: 2,
    });
    const forward = selectResponse({ scored, realmId: 'r', settlementId: 's', episode: '7:pressed' });
    const backward = selectResponse({
      scored: scored.slice().reverse(), realmId: 'r', settlementId: 's', episode: '7:pressed',
    });
    expect(backward.response).toBe(forward.response);
    // And an unrelated candidate appearing cannot move the winner's own draw: dropping
    // a LOSING response leaves the winner exactly where it was.
    const loser = scored.find((s) => s.available && s.response !== forward.response);
    const without = selectResponse({
      scored: scored.filter((s) => s !== loser), realmId: 'r', settlementId: 's', episode: '7:pressed',
    });
    expect(without.response).toBe(forward.response);
  });

  test('replay is exact, and a SEED FAMILY rather than one lucky realm', () => {
    const once = (seed) => run({
      updates: [{
        saveId: 'Replayhold',
        settlement: place({ id: 'Replayhold', tier: 'town', population: 9500, dailyProduction: 40000 }),
      }],
      worldState: { ...litWorld(), rngSeed: seed },
      ticks: 40, seed,
      causal: { Replayhold: { economic_capacity: 85, trade_connectivity: 80 } },
    });
    const a = once('family-1');
    const b = once('family-1');
    expect(JSON.stringify(a.planReceipts)).toBe(JSON.stringify(b.planReceipts));
    expect(JSON.stringify(a.worldState)).toBe(JSON.stringify(b.worldState));

    // ACROSS THE FAMILY: every realm opens a plan, every plan names a response from
    // the closed vocabulary, and none of them flaps.
    const failures = collectSeedFailures(
      Array.from({ length: 12 }, (_, i) => `family-${i}`),
      (seed) => {
        const out = once(seed);
        const opens = opened(out.planReceipts);
        if (!opens.length) return 'no episode opened at all';
        if (opens.length > 1) return `flapped: ${opens.length} episodes in 40 ticks`;
        if (!RESPONSES.includes(opens[0].response)) return `unknown response ${opens[0].response}`;
        return null;
      },
    );
    expectNoSeedFailures(failures);
  });

  test('every declared outcome word is REACHABLE (no unreachable predicate)', () => {
    // A closed vocabulary carrying a word nothing can emit is the unreachable-predicate
    // shape this tree has been bitten by: the dead entry reads as coverage and is not.
    // Each word below is traced to the branch that emits it in the live source.
    const src = readFileSync(join(ROOT, 'src/domain/worldPulse/demographicsPlans.js'), 'utf8');
    for (const outcome of PLAN_OUTCOMES) {
      const emitted = new RegExp(`close\\(\\s*'${outcome}'`).test(src);
      expect(emitted, `${outcome} is declared but no branch emits it`).toBe(true);
    }
  });

  test('a plan is one of the five states and never a sixth', () => {
    const out = run({
      updates: [{
        saveId: 'Statehold',
        settlement: place({ id: 'Statehold', tier: 'town', population: 9500, dailyProduction: 40000 }),
      }],
      worldState: litWorld(),
      ticks: 40,
      causal: { Statehold: { economic_capacity: 85, trade_connectivity: 80 } },
    });
    for (const row of Object.values(plansLedgerOf(out.worldState))) {
      if (row.plan) expect(PLAN_STATES).toContain(row.plan.state);
    }
    for (const rec of closed(out.planReceipts)) expect(PLAN_STATES).toContain(rec.state);
    const live = activePlanOf(out.worldState, 'Statehold');
    if (live) expect(['proposed', 'underway']).toContain(live.state);
  });
});
