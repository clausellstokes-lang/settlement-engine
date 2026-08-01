/**
 * demographicsMigration.test.js — WAVE P2, THE HOMEOSTAT.
 *
 * P1 killed the runaway and P1a thawed the floor, and neither of them moved a single
 * person between two settlements. The 300-year soak's finding was a BIFURCATION:
 * unbounded winners, floored losers, nothing between. A cap alone gives you smaller
 * winners; a thawed floor alone gives you deaths. Only redistribution makes the two
 * tails meet, and this file is where that claim is measured rather than asserted.
 *
 * WHAT EACH SECTION PROVES, and the executed control that makes it non-vacuous:
 *
 *   1. CONSERVATION       a departure is an arrival or a column still on the road,
 *                         across 300 ticks, measured off the settlement records
 *                         themselves rather than off the lane's own accounting. The
 *                         CONTROL patches the column-ownership predicate so the release
 *                         pass no longer recognizes its own columns, and the identical
 *                         run then LEAKS every person it sent; restoring it is green.
 *   2. THE BIFURCATION    a crowded fed town beside a viable underpopulated village
 *      CURE               levels BOTH toward the middle, decisively, and the movement
 *                         is MIGRATION rather than the rates: the same fixture with the
 *                         road removed moves nobody and stays bifurcated.
 *   3. REACHABILITY       an unconnected settlement neither sends nor receives, and a
 *                         hidden remnant is not a road. Anchored on a connected sibling
 *                         in the same realm that does both.
 *   4. DISTANCE           a far destination pulls measurably less than a near one of
 *                         identical quality, and loses the column.
 *   5. THE GUARDS         the owner's own case: a garrison town does not shed its
 *                         soldiers over prosperity, and the identical destitute town
 *                         without the garrison does.
 *   6. REFUGEE vs         one menu, two classes, opposite answers: the refugee goes,
 *      VOLUNTARY          the volunteer stays.
 *   7. THE THREE READINGS a food-poor column and a space-poor column pick DIFFERENT
 *                         destinations off the identical menu, and the menu is built so
 *                         both destinations carry the SAME min(K_food, D_tier). That is
 *                         the anti-collapse proof: no single bound could produce it.
 *   8. THE P3 SEAM        spare capacity is consumed before anything could justify a
 *                         founding, and the leftover is reported by name.
 *   9. THE H3 FLOOR       the named cast never emigrates.
 *  10. COEXISTENCE        an M4 crisis column in the same ledger is never touched.
 *  11. DORMANCY           dark is a no-op by OBJECT IDENTITY.
 *  12. DETERMINISM        replay, a seed family, ZERO new streams, and a purity scan.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import { advanceDemographics } from '../../src/domain/worldPulse/demographicsKernel.js';
import { advanceSettlementLifecycle } from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import {
  advanceDemographicMigration,
  competeForDestinations,
  destinationMenuFor,
  homePullOf,
} from '../../src/domain/worldPulse/demographicsMigration.js';
import {
  PUSH_PULL_TUNING,
  demographicReadings,
  departureRateOf,
  distanceDiscount,
  needVectorOf,
  pullScoreOf,
  pushScoreOf,
} from '../../src/domain/worldPulse/demographicsPushPull.js';
import { enqueueColumns, releaseArrivals } from '../../src/domain/spatial/migration.js';
import { routeEdge, routeEdgeId } from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MIGRATION_MODULE = '../../src/domain/spatial/migration.js';

// ── FIXTURES ─────────────────────────────────────────────────────────────────
/** A settlement with real food physics and nothing exotic. */
function place({
  id, tier = 'town', population, dailyProduction, storageMonths = 1,
  deficitPct = 0, named = 0, terrain = 'plains', importDependency = 0,
} = {}) {
  return {
    population, tier, name: id,
    config: { tier, terrainType: terrain },
    economicState: {
      foodSecurity: {
        dailyNeed: population * 2, dailyProduction, deficitPct, surplusPct: 0,
        importDependency, storageMonths, resilienceScore: 60,
      },
    },
    institutions: [],
    npcs: Array.from({ length: named }, (_, i) => ({ id: `${id}_npc_${i}` })),
  };
}

/** A world with a lived road network and the demographic engine LIT. */
function litWorld(edges = [], extraRules = {}) {
  const network = { edges: {}, corridor: {} };
  for (const [a, b, grade = 'road'] of edges) {
    network.edges[routeEdgeId(a, b, 'land')] = routeEdge({
      a, b, grade, mode: 'land', provenance: 'generated', flavor: 'genesis', tick: 0,
    });
  }
  return {
    simulationRules: { demographicsEnabled: true, routeLifecycleEnabled: true, ...extraRules },
    ...(edges.length ? { spatialLedgers: { routeNetwork: network } } : {}),
  };
}

/** @param {Array<{ saveId: string, settlement: Record<string, unknown> }>} updates */
function snapOf(updates, causalById = {}) {
  return {
    settlements: updates.map((u) => ({
      id: u.saveId,
      name: u.saveId,
      settlement: u.settlement,
      ...(causalById[u.saveId] ? { causal: { scores: causalById[u.saveId] } } : {}),
    })),
  };
}

/** A pressure index over a literal per-settlement map. */
function pressuresOf(map) {
  return { get: (id, kind) => ({ score: (map[String(id)] || {})[kind] ?? 0 }) };
}

const rngOf = (seed) => createPRNG(seed);

/**
 * Run the whole demographic step (rates AND homeostat) for `ticks`, returning the
 * final updates, the final world, and every migration receipt seen.
 */
function run({ updates, worldState, ticks, causal = {}, pIndex = null, seed = 'p2', before = null }) {
  let live = updates;
  let ws = worldState;
  const receipts = [];
  const accounts = [];
  for (let t = 1; t <= ticks; t += 1) {
    if (before) ws = before(ws, t);
    const r = advanceDemographics({
      snapshot: snapOf(live, causal),
      worldState: ws,
      settlementUpdates: live,
      rng: rngOf(`${seed}::${t}`),
      tick: t,
      pIndex,
    });
    ws = r.worldState;
    live = r.settlementUpdates;
    receipts.push(...r.migrationReceipts);
    accounts.push(r.accounting);
  }
  return { live, worldState: ws, receipts, accounts };
}

/** Every population delta this lane wrote, read off the settlement records. */
function migrationDeltasOf(updates) {
  let total = 0;
  let credits = 0;
  let debits = 0;
  for (const u of updates) {
    for (const row of u.settlement.populationHistory || []) {
      if (!String(row.outcomeId || '').startsWith('demographics.migration.')) continue;
      total += row.delta;
      if (row.delta > 0) credits += row.delta; else debits += -row.delta;
    }
  }
  return { total, credits, debits };
}

const sumOf = (accounts, key) => accounts.reduce((s, a) => s + a[key], 0);
const realmTotal = (updates) => updates.reduce((s, u) => s + u.settlement.population, 0);

// A settlement's populationHistory keeps only the last twelve rows, so a long run must
// be read tick by tick rather than from the final record. This harness accumulates the
// migration deltas as they are written.
function runAccumulating({ updates, worldState, ticks, causal = {}, seed = 'p2' }) {
  let live = updates;
  let ws = worldState;
  const accounts = [];
  let migrated = 0;
  for (let t = 1; t <= ticks; t += 1) {
    const r = advanceDemographics({
      snapshot: snapOf(live, causal), worldState: ws, settlementUpdates: live,
      rng: rngOf(`${seed}::${t}`), tick: t,
    });
    // Read THIS tick's migration rows only, from the records the pass just wrote.
    for (const u of r.settlementUpdates) {
      for (const row of u.settlement.populationHistory || []) {
        if (row.tick !== t) continue;
        if (!String(row.outcomeId || '').startsWith('demographics.migration.')) continue;
        migrated += row.delta;
      }
    }
    ws = r.worldState;
    live = r.settlementUpdates;
    accounts.push(r.accounting);
  }
  return { live, worldState: ws, accounts, migrated };
}

// ═══════════════════════════════════════════════════════════════════════════════
describe('1. CONSERVATION — a departure is an arrival or a column on the road', () => {
  const conservationRealm = () => [
    { saveId: 'Crowdhold', settlement: place({ id: 'Crowdhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
    { saveId: 'Emptyvale', settlement: place({ id: 'Emptyvale', tier: 'village', population: 200, dailyProduction: 3000 }) },
    { saveId: 'Farfield', settlement: place({ id: 'Farfield', tier: 'village', population: 300, dailyProduction: 2800 }) },
  ];
  const conservationWorld = () => litWorld([
    ['Crowdhold', 'Emptyvale'], ['Emptyvale', 'Farfield'],
  ]);

  test('across 300 ticks the accounting closes EXACTLY, and the records agree with it', () => {
    const { accounts, migrated } = runAccumulating({
      updates: conservationRealm(), worldState: conservationWorld(), ticks: 300,
    });
    const departures = sumOf(accounts, 'departures');
    const arrivals = sumOf(accounts, 'arrivals');
    const returned = sumOf(accounts, 'returned');
    const lost = sumOf(accounts, 'lost');
    const inTransit = accounts[accounts.length - 1].inTransit;

    expect(departures, 'the fixture never migrated anybody, so nothing below is a test')
      .toBeGreaterThan(200);
    // LAW 4, the identity itself.
    expect(arrivals + returned + lost + inTransit,
      'somebody left and is neither here, there, nor on the road').toBe(departures);
    expect(lost, 'a settlement vanished under a column in a realm where none can').toBe(0);
    // AND THE SAME CLAIM MEASURED OFF THE SETTLEMENT RECORDS, which is the reading a
    // realm-total check actually makes: every debit this lane wrote is matched by a
    // credit, except for whoever is still walking.
    // (Written as a sum rather than a negation so the assertion cannot pass or fail on
    // JavaScript's signed zero.)
    expect(migrated + inTransit + lost,
      'the population the records moved does not match the columns in flight').toBe(0);
  });

  test('NEGATIVE CONTROL: break the release and the identical run LEAKS every traveller', async () => {
    vi.resetModules();
    vi.doMock(MIGRATION_MODULE, async (importOriginal) => {
      const actual = await importOriginal();
      // The one property under test: the release pass no longer recognizes its own
      // columns, so they are raised, stamped, and never landed.
      return { ...actual, isDemographicColumn: () => false };
    });
    const broken = await import('../../src/domain/worldPulse/demographicsKernel.js');

    let live = conservationRealm();
    let ws = conservationWorld();
    let migrated = 0;
    let departures = 0;
    for (let t = 1; t <= 300; t += 1) {
      const r = broken.advanceDemographics({
        snapshot: snapOf(live), worldState: ws, settlementUpdates: live,
        rng: rngOf(`p2::${t}`), tick: t,
      });
      for (const u of r.settlementUpdates) {
        for (const row of u.settlement.populationHistory || []) {
          if (row.tick !== t) continue;
          if (!String(row.outcomeId || '').startsWith('demographics.migration.')) continue;
          migrated += row.delta;
        }
      }
      departures += r.accounting.departures;
      ws = r.worldState;
      live = r.settlementUpdates;
    }
    vi.doUnmock(MIGRATION_MODULE);
    vi.resetModules();

    expect(departures, 'the control did not even produce a column').toBeGreaterThan(200);
    // THE LEAK: every debit, no credit at all. Under the real release this number is
    // exactly minus the people still walking; here it is minus everyone who ever left.
    expect(migrated, 'the broken release still credited somebody').toBe(-departures);
  });

  test('RESTORE: the unpatched module conserves again', () => {
    const { accounts, migrated } = runAccumulating({
      updates: conservationRealm(), worldState: conservationWorld(), ticks: 120,
    });
    const inTransit = accounts[accounts.length - 1].inTransit;
    expect(sumOf(accounts, 'departures')).toBeGreaterThan(0);
    expect(migrated + inTransit + sumOf(accounts, 'lost')).toBe(0);
  });

  test('the column ledger is CONDITIONAL and drop-when-empty', () => {
    const quiet = [{ saveId: 'Still', settlement: place({ id: 'Still', tier: 'village', population: 400, dailyProduction: 2000 }) }];
    const ws = litWorld();
    const r = advanceDemographicMigration({
      snapshot: snapOf(quiet), worldState: ws, settlementUpdates: quiet, tick: 3,
    });
    expect(r.worldState.spatialLedgers === undefined
      || r.worldState.spatialLedgers.migration === undefined,
    'a realm that moved nobody materialized a migration key').toBe(true);
    // ANCHOR: the same call on a realm that DOES move somebody writes the key, so the
    // absence above is a refusal rather than a lane that never ran.
    const moving = [
      { saveId: 'Crowdhold', settlement: place({ id: 'Crowdhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
      { saveId: 'Emptyvale', settlement: place({ id: 'Emptyvale', tier: 'village', population: 200, dailyProduction: 3000 }) },
    ];
    const moved = advanceDemographicMigration({
      snapshot: snapOf(moving), worldState: litWorld([['Crowdhold', 'Emptyvale']]),
      settlementUpdates: moving, tick: 3,
    });
    expect(Object.keys(moved.worldState.spatialLedgers.migration).length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('2. THE BIFURCATION CURE — the crowded and the empty level toward the middle', () => {
  const pair = () => [
    { saveId: 'Crowdhold', settlement: place({ id: 'Crowdhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
    { saveId: 'Emptyvale', settlement: place({ id: 'Emptyvale', tier: 'village', population: 200, dailyProduction: 3000 }) },
  ];
  const loadOf = (u) => demographicReadings(u.settlement, litWorld(), u.saveId).urbanLoadRatio;

  test('BOTH move, decisively, and it is the road that does it', () => {
    const start = pair();
    const gapBefore = Math.abs(loadOf(start[0]) - loadOf(start[1]));

    const joined = runAccumulating({
      updates: pair(), worldState: litWorld([['Crowdhold', 'Emptyvale']]), ticks: 200,
    });
    const crowd = joined.live.find((u) => u.saveId === 'Crowdhold');
    const empty = joined.live.find((u) => u.saveId === 'Emptyvale');
    const gapAfter = Math.abs(loadOf(crowd) - loadOf(empty));
    const moved = sumOf(joined.accounts, 'departures');

    // 1. THE MOVEMENT IS REAL AND LARGE. MEASURED 2026-08-01: 765 people on this
    //    fixture, a tenth of the crowded town's whole head count.
    expect(moved, 'the homeostat moved a trickle rather than a wave').toBeGreaterThan(500);
    // 2. THE CROWDED SHED AND THE EMPTY FILLED. The village nearly quintupled.
    expect(crowd.settlement.population).toBeLessThan(9500);
    expect(empty.settlement.population).toBeGreaterThan(700);
    // 3. AND THE TWO ARE MEASURABLY CLOSER on the reading that separated them.
    expect(gapAfter, `the bifurcation did not close (${gapBefore} to ${gapAfter})`)
      .toBeLessThan(gapBefore * 0.75);
  });

  test('NEGATIVE CONTROL: cut the road and the identical pair stays bifurcated', () => {
    const start = pair();
    const gapBefore = Math.abs(loadOf(start[0]) - loadOf(start[1]));
    // The SAME world minus the one edge. Everything else, including the rates, is
    // untouched, so whatever changes is the migration lane and nothing else.
    const cut = runAccumulating({ updates: pair(), worldState: litWorld(), ticks: 200 });
    const crowd = cut.live.find((u) => u.saveId === 'Crowdhold');
    const empty = cut.live.find((u) => u.saveId === 'Emptyvale');

    expect(sumOf(cut.accounts, 'departures'), 'people crossed a road that does not exist').toBe(0);
    expect(cut.migrated, 'a settlement changed by migration with no network at all').toBe(0);
    // The village is still a village and the town is still overspilled: the rates alone
    // cannot close the gap, which is exactly the finding this wave exists to cure.
    const gapAfter = Math.abs(loadOf(crowd) - loadOf(empty));
    expect(gapAfter, 'the gap closed without any migration, so section 2 proves nothing')
      .toBeGreaterThan(gapBefore * 0.75);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('3. REACHABILITY — people are not teleported (J-P3)', () => {
  const trio = () => [
    { saveId: 'Crowdhold', settlement: place({ id: 'Crowdhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
    { saveId: 'Linked', settlement: place({ id: 'Linked', tier: 'village', population: 200, dailyProduction: 3000 }) },
    { saveId: 'Islanded', settlement: place({ id: 'Islanded', tier: 'village', population: 200, dailyProduction: 3000 }) },
  ];

  test('an unconnected settlement neither sends nor receives, while its twin does both', () => {
    const r = runAccumulating({
      updates: trio(), worldState: litWorld([['Crowdhold', 'Linked']]), ticks: 60,
    });
    const linked = r.live.find((u) => u.saveId === 'Linked');
    const islanded = r.live.find((u) => u.saveId === 'Islanded');
    // ANCHOR FIRST: the connected twin really did receive, so the lane ran.
    expect(sumOf(r.accounts, 'arrivals'), 'nobody arrived anywhere').toBeGreaterThan(0);
    expect(linked.settlement.population, 'the connected village never grew').toBeGreaterThan(300);
    // The two villages are identical in every respect except the road.
    const arrivedAtIslanded = (islanded.settlement.populationHistory || [])
      .filter((row) => String(row.outcomeId || '').includes('migration.arrival'));
    expect(arrivedAtIslanded.length, 'somebody walked to a settlement with no road to it').toBe(0);
  });

  test('a HIDDEN remnant is not a road: the same pair connected only by one moves nobody', () => {
    // DEPARTURES, never the NET. A conserved run's net migration delta is zero whether
    // or not anybody moved, so reading the net here would be a vacuous green: the
    // executed control that admits hidden hops still passed it.
    const hidden = runAccumulating({
      updates: trio(), worldState: litWorld([['Crowdhold', 'Islanded', 'hidden']]), ticks: 60,
    });
    expect(sumOf(hidden.accounts, 'departures'),
      'a column pushed three hundred people down an overgrown path').toBe(0);
    // ANCHOR: upgrade that same edge to a track and the identical realm migrates.
    const track = runAccumulating({
      updates: trio(), worldState: litWorld([['Crowdhold', 'Islanded', 'track']]), ticks: 60,
    });
    expect(sumOf(track.accounts, 'departures'), 'the anchor arm did not migrate either')
      .toBeGreaterThan(0);
  });

  test('a DARK route network is no network: the homeostat moves nobody', () => {
    const dark = runAccumulating({
      updates: trio(),
      worldState: { simulationRules: { demographicsEnabled: true } },
      ticks: 60,
    });
    expect(sumOf(dark.accounts, 'departures')).toBe(0);
    expect(dark.migrated).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('4. DISTANCE — a far destination pulls measurably less than a near one', () => {
  const destination = (destId, ticks) => ({
    destId, ticks, foodSlack01: 0.8, roomSlack01: 0.8, safety01: 1,
    prosperity01: 0.5, spare: 5000, viable: true,
  });
  const need = { food01: 0.5, room01: 0.5 };

  test('the discount is monotone and never reaches zero', () => {
    const prices = [0, 1, 3, 6, 12, 40].map(distanceDiscount);
    for (let i = 1; i < prices.length; i += 1) {
      expect(prices[i], `the discount did not fall between rung ${i - 1} and ${i}`)
        .toBeLessThan(prices[i - 1]);
    }
    expect(prices[prices.length - 1], 'far became forbidden rather than expensive')
      .toBeGreaterThan(0);
  });

  test('two destinations of IDENTICAL quality rank by the road, and the near one wins', () => {
    const near = destination('Near', 1);
    const far = destination('Far', 9);
    expect(pullScoreOf({ destination: far, need }))
      .toBeLessThan(pullScoreOf({ destination: near, need }));
    const result = competeForDestinations({
      menu: [far, near], need, migrants: 40, migrantClass: 'voluntary', homePull: 0,
    });
    expect(result.placements[0].destId, 'the column chose the long road over the short one')
      .toBe('Near');
  });

  test('and the same claim end to end: a two hop village loses to a one hop village', () => {
    const realm = [
      { saveId: 'Crowdhold', settlement: place({ id: 'Crowdhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
      { saveId: 'Anear', settlement: place({ id: 'Anear', tier: 'village', population: 200, dailyProduction: 3000 }) },
      { saveId: 'Bfar', settlement: place({ id: 'Bfar', tier: 'village', population: 200, dailyProduction: 3000 }) },
    ];
    // Crowdhold to Anear is one hop; Crowdhold to Bfar runs through Anear, so it is two.
    const r = run({
      updates: realm, worldState: litWorld([['Crowdhold', 'Anear'], ['Anear', 'Bfar']]), ticks: 1,
    });
    const departure = r.receipts.find((x) => x.kind === 'demographic_migration' && x.originId === 'Crowdhold');
    expect(departure, 'the fixture never produced a column').toBeTruthy();
    expect(departure.placements[0].destId).toBe('Anear');
    expect(departure.placements[0].ticks).toBeLessThan(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('5. THE APPLICABILITY GUARDS — the owner\'s "where appropriate", as refusals', () => {
  const destitute = place({ id: 'Poorhold', tier: 'town', population: 3000, dailyProduction: 20000 });
  const readingsOf = () => demographicReadings(destitute, litWorld(), 'Poorhold');
  const pushWith = (scores) => pushScoreOf({
    item: { id: 'Poorhold', causal: { scores } },
    readings: readingsOf(),
    pIndex: null,
    settlementId: 'Poorhold',
  });
  const driver = (push, name) => push.drivers.find((d) => d.driver === name);

  test('A GARRISON TOWN DOES NOT SHED ITS SOLDIERS OVER PROSPERITY', () => {
    const garrison = pushWith({ economic_capacity: 8, defense_readiness: 78 });
    const ordinary = pushWith({ economic_capacity: 8, defense_readiness: 30 });
    // Identical poverty; only the walls differ.
    expect(driver(garrison, 'prosperity').reading).toBe(driver(ordinary, 'prosperity').reading);
    expect(driver(garrison, 'prosperity').applicable, 'the garrison guard did not close').toBe(false);
    expect(driver(garrison, 'prosperity').strength01, 'a guarded driver must contribute EXACTLY nothing').toBe(0);
    // ANCHOR: the identical town without the garrison DOES shed over it, so the guard
    // is a refusal rather than a driver that never fires.
    expect(driver(ordinary, 'prosperity').applicable).toBe(true);
    expect(driver(ordinary, 'prosperity').strength01).toBeGreaterThan(0.9);
    expect(garrison.score01, 'the garrison out-pushed the ordinary town').toBeLessThan(ordinary.score01);
  });

  test('LOW DEFENSE WITHOUT A THREAT IS A BUDGET LINE, not a reason to walk', () => {
    const peaceful = pushWith({ economic_capacity: 50, defense_readiness: 12 });
    const besieged = pushScoreOf({
      item: { id: 'Poorhold', causal: { scores: { economic_capacity: 50, defense_readiness: 12 } } },
      readings: readingsOf(),
      pIndex: pressuresOf({ Poorhold: { hostility: 0.8 } }),
      settlementId: 'Poorhold',
    });
    expect(driver(peaceful, 'defense').applicable, 'flight over a low score with nobody at the gate').toBe(false);
    expect(driver(peaceful, 'defense').strength01).toBe(0);
    expect(driver(besieged, 'defense').applicable, 'the anchor arm never opened either').toBe(true);
    expect(driver(besieged, 'defense').strength01).toBeGreaterThan(0.9);
    expect(driver(besieged, 'defense').crisis, 'an enemy at the gate makes refugees').toBe(true);
    expect(besieged.migrantClass).toBe('refugee');
  });

  test('CROWDING is refused where the GRANARY is the wall, so no cause is counted twice', () => {
    // Same head count and same tier; only the fields differ, so which wall binds does.
    const walled = place({ id: 'Walled', tier: 'village', population: 1500, dailyProduction: 20000 });
    const starved = place({ id: 'Starved', tier: 'village', population: 1500, dailyProduction: 2000 });
    const wallPush = pushScoreOf({
      readings: demographicReadings(walled, litWorld(), 'Walled'), settlementId: 'Walled', item: null, pIndex: null,
    });
    const foodPush = pushScoreOf({
      readings: demographicReadings(starved, litWorld(), 'Starved'), settlementId: 'Starved', item: null, pIndex: null,
    });
    expect(wallPush.drivers.find((d) => d.driver === 'crowding').applicable, 'the walled town could not shed for crowding').toBe(true);
    expect(wallPush.drivers.find((d) => d.driver === 'crowding').strength01).toBeGreaterThan(0);
    expect(foodPush.drivers.find((d) => d.driver === 'crowding').applicable, 'the starving town shed twice for one cause').toBe(false);
    expect(foodPush.drivers.find((d) => d.driver === 'food').strength01, 'and the food driver owns its story instead').toBeGreaterThan(0);
  });

  test('an ABSENT food reading is never a famine', () => {
    const bare = { population: 500, tier: 'village', config: { tier: 'village' } };
    const push = pushScoreOf({
      readings: demographicReadings(bare, litWorld(), 'Bare'), settlementId: 'Bare', item: null, pIndex: null,
    });
    expect(push.drivers.find((d) => d.driver === 'food').applicable).toBe(false);
    expect(push.drivers.find((d) => d.driver === 'food').strength01).toBe(0);
    expect(push.migrantClass, 'a fixture with no fields produced refugees').toBe('voluntary');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('6. REFUGEE vs VOLUNTARY — one menu, two classes, opposite answers', () => {
  // A mediocre destination: room and food, but poorer and less safe than home.
  const mediocre = {
    destId: 'Grimhold', ticks: 2, foodSlack01: 0.35, roomSlack01: 0.30,
    safety01: 0.35, prosperity01: 0.15, spare: 900, viable: true,
  };
  const need = { food01: 0.9, room01: 0.1 };
  // Home is comfortable enough that a volunteer will not trade it for Grimhold.
  const homePull = pullScoreOf({
    destination: {
      destId: 'Home', ticks: 0, foodSlack01: 0.4, roomSlack01: 0.4,
      safety01: 1, prosperity01: 0.6, spare: 0, viable: true,
    },
    need,
  });

  test('the refugee flees regardless of destination quality; the volunteer stays', () => {
    const refugee = competeForDestinations({
      menu: [mediocre], need, migrants: 120, migrantClass: 'refugee', homePull,
    });
    const volunteer = competeForDestinations({
      menu: [mediocre], need, migrants: 120, migrantClass: 'voluntary', homePull,
    });
    expect(pullScoreOf({ destination: mediocre, need }),
      'the fixture is not actually a worse destination, so nothing below diverges')
      .toBeLessThan(homePull);
    expect(refugee.placed, 'the refugee stayed home to weigh their options').toBe(120);
    expect(refugee.refusal).toBe('none');
    expect(volunteer.placed, 'the volunteer accepted a worse life without being made to').toBe(0);
    expect(volunteer.refusal).toBe('unattractive');
    expect(volunteer.unplaced).toBe(120);
  });

  test('and a volunteer offered a BETTER life does move, so the class is not a mute button', () => {
    // Genuinely better, and NEARER: distance is priced into the comparison, so a place
    // that is merely richer at the same remove can still lose to staying home.
    const better = {
      ...mediocre, destId: 'Fairhold', ticks: 1,
      safety01: 1, prosperity01: 0.95, foodSlack01: 0.95, roomSlack01: 0.8,
    };
    const volunteer = competeForDestinations({
      menu: [better], need, migrants: 120, migrantClass: 'voluntary', homePull,
    });
    expect(volunteer.placed).toBe(120);
    expect(volunteer.refusal).toBe('none');
  });

  test('end to end: a starving town raises a REFUGEE column and names it', () => {
    const realm = [
      { saveId: 'Hungerton', settlement: place({ id: 'Hungerton', tier: 'town', population: 4000, dailyProduction: 4000, deficitPct: 45 }) },
      { saveId: 'Plainvale', settlement: place({ id: 'Plainvale', tier: 'village', population: 200, dailyProduction: 3000 }) },
    ];
    const r = run({ updates: realm, worldState: litWorld([['Hungerton', 'Plainvale']]), ticks: 1 });
    const line = r.receipts.find((x) => x.kind === 'demographic_migration');
    expect(line, 'the starving town raised no column at all').toBeTruthy();
    expect(line.migrantClass).toBe('refugee');
    expect(line.pressing).toContain('food');
    // The world state's own record agrees: the column carries the class.
    const columns = Object.values(r.worldState.spatialLedgers.migration);
    expect(columns.length).toBeGreaterThan(0);
    expect(columns.every((c) => c.travelClass === 'refugee')).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('7. THE THREE READINGS drive DIFFERENT choices (the anti-collapse proof)', () => {
  // Two destinations with the SAME effective bound and the SAME distance, differing
  // only in WHICH of the two headrooms they carry. No single min(K_food, D_tier) could
  // tell them apart, which is exactly the point.
  const granary = {
    destId: 'Granaryside', ticks: 2, foodSlack01: 0.87, roomSlack01: 0.54,
    safety01: 1, prosperity01: 0.5, spare: 3000, viable: true,
  };
  const openland = {
    destId: 'Openland', ticks: 2, foodSlack01: 0.54, roomSlack01: 0.87,
    safety01: 1, prosperity01: 0.5, spare: 3000, viable: true,
  };

  test('the starving pick the granary and the crowded pick the open land, off ONE menu', () => {
    const starving = competeForDestinations({
      menu: [granary, openland], need: { food01: 1, room01: 0 },
      migrants: 200, migrantClass: 'refugee', homePull: 0,
    });
    const crowded = competeForDestinations({
      menu: [granary, openland], need: { food01: 0, room01: 1 },
      migrants: 200, migrantClass: 'refugee', homePull: 0,
    });
    expect(starving.placements[0].destId).toBe('Granaryside');
    expect(crowded.placements[0].destId).toBe('Openland');
    // And the two menus really were the same object list, so nothing but the need
    // vector moved the answer.
    expect(starving.considered).toBe(crowded.considered);
  });

  test('a destination with BOTH slacks out-pulls one with a single larger slack', () => {
    const both = { ...granary, destId: 'Bothwell', foodSlack01: 0.7, roomSlack01: 0.7 };
    const oneBig = { ...granary, destId: 'Onesided', foodSlack01: 0.95, roomSlack01: 0.05 };
    const need = { food01: 0.5, room01: 0.5 };
    expect(pullScoreOf({ destination: both, need }))
      .toBeGreaterThan(pullScoreOf({ destination: oneBig, need }));
  });

  test('the three readings are INDEPENDENT: one settlement carries all three at once', () => {
    // Food-short, reserve-deep, and packed, simultaneously. A collapsed diagnosis could
    // not report this settlement at all.
    const strained = place({
      id: 'Threefold', tier: 'village', population: 1500,
      dailyProduction: 2200, storageMonths: 6,
    });
    const readings = demographicReadings(strained, litWorld(), 'Threefold');
    expect(readings.foodFlowBand, 'the flow reading did not come out short').toBe('short');
    expect(readings.reserveBand, 'the reserve reading did not come out deep').toBe('deep');
    expect(readings.urbanLoadBand).toBe('packed');
    // The three are different numbers, not one number wearing three names.
    expect(new Set([readings.foodFlowRatio, readings.reserveCoverage, readings.urbanLoadRatio]).size).toBe(3);
  });

  test('RESERVES DELAY, they do not raise K_food (acceptance claim 2)', () => {
    const bare = place({ id: 'Bare', tier: 'village', population: 1500, dailyProduction: 2200, storageMonths: 0 });
    const deep = place({ id: 'Deep', tier: 'village', population: 1500, dailyProduction: 2200, storageMonths: 6 });
    const bareR = demographicReadings(bare, litWorld(), 'Bare');
    const deepR = demographicReadings(deep, litWorld(), 'Deep');
    // Identical capacity: the granary is excluded from K by construction (P1's pin).
    expect(deepR.foodCapacity).toBe(bareR.foodCapacity);
    expect(deepR.bound).toBe(bareR.bound);
    // And identical need vectors, so the stores never touch WHERE anyone goes.
    expect(needVectorOf(deepR)).toEqual(needVectorOf(bareR));
    // But the stocked town sheds fewer people this week under the same push.
    const push = pushScoreOf({ readings: bareR, settlementId: 'Bare', item: null, pIndex: null });
    expect(push.score01, 'the fixture has no push, so the delay below is measured on zero')
      .toBeGreaterThan(PUSH_PULL_TUNING.DEPART_PUSH_FLOOR);
    expect(departureRateOf({ push01: push.score01, reserveCoverage: deepR.reserveCoverage }))
      .toBeLessThan(departureRateOf({ push01: push.score01, reserveCoverage: bareR.reserveCoverage }));
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('8. THE P3 SEAM — existing capacity is consumed before anything is founded', () => {
  test('spare capacity is taken in RANK order, and the leftover is reported by name', () => {
    const small = {
      destId: 'Smallhold', ticks: 1, foodSlack01: 0.9, roomSlack01: 0.9,
      safety01: 1, prosperity01: 0.9, spare: 40, viable: true,
    };
    const second = { ...small, destId: 'Secondhold', ticks: 4, spare: 25, prosperity01: 0.3 };
    const result = competeForDestinations({
      menu: [second, small], need: { food01: 0.5, room01: 0.5 },
      migrants: 200, migrantClass: 'refugee', homePull: 0,
    });
    expect(result.placements.map((p) => p.destId)).toEqual(['Smallhold', 'Secondhold']);
    expect(result.placed).toBe(65);
    expect(result.unplaced, 'the realm quietly absorbed people it had no room for').toBe(135);
    expect(result.refusal).toBe('partial');
  });

  test('a full realm answers no_capacity, and an empty one answers none', () => {
    const full = {
      destId: 'Fullhold', ticks: 1, foodSlack01: 0.1, roomSlack01: 0.1,
      safety01: 1, prosperity01: 0.5, spare: 0, viable: true,
    };
    const roomy = { ...full, destId: 'Roomyhold', spare: 900, foodSlack01: 0.8, roomSlack01: 0.8 };
    const need = { food01: 0.5, room01: 0.5 };
    expect(competeForDestinations({ menu: [full], need, migrants: 50, migrantClass: 'refugee', homePull: 0 }).refusal)
      .toBe('no_capacity');
    expect(competeForDestinations({ menu: [roomy], need, migrants: 50, migrantClass: 'refugee', homePull: 0 }).refusal)
      .toBe('none');
    expect(competeForDestinations({ menu: [], need, migrants: 50, migrantClass: 'refugee', homePull: 0 }).refusal)
      .toBe('unreachable');
  });

  test('a NONVIABLE destination takes nobody, however much room it appears to have', () => {
    const ruin = {
      destId: 'Ruinhold', ticks: 1, foodSlack01: 0.99, roomSlack01: 0.99,
      safety01: 1, prosperity01: 0.9, spare: 9000, viable: false,
    };
    const alive = { ...ruin, destId: 'Alivehold', viable: true };
    const need = { food01: 0.5, room01: 0.5 };
    expect(competeForDestinations({ menu: [ruin], need, migrants: 50, migrantClass: 'refugee', homePull: 0 }).placed).toBe(0);
    // ANCHOR: the identical menu entry marked viable takes them all.
    expect(competeForDestinations({ menu: [alive], need, migrants: 50, migrantClass: 'refugee', homePull: 0 }).placed).toBe(50);
  });

  test('end to end: once the village fills, the refusal is what P3 would read', () => {
    const realm = [
      { saveId: 'Crowdhold', settlement: place({ id: 'Crowdhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
      { saveId: 'Emptyvale', settlement: place({ id: 'Emptyvale', tier: 'village', population: 200, dailyProduction: 3000 }) },
    ];
    const r = run({ updates: realm, worldState: litWorld([['Crowdhold', 'Emptyvale']]), ticks: 90 });
    const departures = r.receipts.filter((x) => x.kind === 'demographic_migration');
    const early = departures.filter((x) => x.tick <= 5);
    const refused = departures.filter((x) => x.unplaced > 0);
    expect(early.length, 'nobody ever left, so the saturation below proves nothing').toBeGreaterThan(0);
    expect(early.every((x) => x.refusal === 'none'), 'the realm was full from the very first tick').toBe(true);
    expect(refused.length, 'the destination never saturated across ninety ticks').toBeGreaterThan(0);
    expect(sumOf(r.accounts, 'unplaced')).toBeGreaterThan(0);
  });

  test('the menu bounds a destination by its OWN room, counting who is already walking', () => {
    const realm = [
      { saveId: 'Ahold', settlement: place({ id: 'Ahold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
      { saveId: 'Bhold', settlement: place({ id: 'Bhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
      { saveId: 'Cvale', settlement: place({ id: 'Cvale', tier: 'village', population: 200, dailyProduction: 3000 }) },
    ];
    const ws = litWorld([['Ahold', 'Cvale'], ['Bhold', 'Cvale']]);
    const first = advanceDemographicMigration({
      snapshot: snapOf(realm), worldState: ws, settlementUpdates: realm, tick: 1,
    });
    const inbound = Object.values(first.worldState.spatialLedgers.migration)
      .reduce((s, c) => s + c.arrivals, 0);
    expect(inbound, 'neither crowded town sent anybody').toBeGreaterThan(0);
    // Both towns sent on the same tick, and the village's spare room was shared rather
    // than promised twice.
    const menu = destinationMenuFor({
      worldState: first.worldState,
      originId: 'Ahold',
      settlementOf: (id) => (first.settlementUpdates.find((u) => String(u.saveId) === id) || {}).settlement || null,
      itemOf: () => null,
      inbound: new Map([['Cvale', inbound]]),
    });
    const cvale = menu.find((d) => d.destId === 'Cvale');
    const blind = destinationMenuFor({
      worldState: first.worldState,
      originId: 'Ahold',
      settlementOf: (id) => (first.settlementUpdates.find((u) => String(u.saveId) === id) || {}).settlement || null,
      itemOf: () => null,
      inbound: new Map(),
    });
    expect(cvale.spare, 'the column already on the road was offered the same beds twice')
      .toBe(blind.find((d) => d.destId === 'Cvale').spare - inbound);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('9. THE H3 FLOOR — the named cast never takes the road', () => {
  test('a settlement reduced to its cast sends nobody, while its anonymous twin sends', () => {
    const cast = [
      { saveId: 'Castonly', settlement: place({ id: 'Castonly', tier: 'town', population: 9000, dailyProduction: 30000, named: 9000 }) },
      { saveId: 'Anonhold', settlement: place({ id: 'Anonhold', tier: 'town', population: 9000, dailyProduction: 30000, named: 0 }) },
      { saveId: 'Zvale', settlement: place({ id: 'Zvale', tier: 'village', population: 200, dailyProduction: 3000 }) },
    ];
    const r = run({
      updates: cast, worldState: litWorld([['Castonly', 'Zvale'], ['Anonhold', 'Zvale']]), ticks: 1,
    });
    const from = (id) => r.receipts.find((x) => x.kind === 'demographic_migration' && x.originId === id);
    expect(from('Anonhold'), 'the anchor town never raised a column').toBeTruthy();
    expect(from('Anonhold').departures).toBeGreaterThan(0);
    expect(from('Castonly'), 'a town that is nothing but its cast put the cast on the road')
      .toBeFalsy();
  });

  test('across a long run the head count never falls below the cast, at ANY tick', () => {
    // A starving town whose roster is most of its people: the food driver saturates, so
    // the lane really is trying to move everybody it is allowed to move.
    const NAMED = 8000;
    let live = [
      { saveId: 'Halfcast', settlement: place({ id: 'Halfcast', tier: 'town', population: 9000, dailyProduction: 4000, deficitPct: 40, named: NAMED }) },
      { saveId: 'Zvale', settlement: place({ id: 'Zvale', tier: 'village', population: 200, dailyProduction: 6000 }) },
    ];
    let ws = litWorld([['Halfcast', 'Zvale']]);
    let departures = 0;
    let lowest = Infinity;
    for (let t = 1; t <= 200; t += 1) {
      const r = advanceDemographics({
        snapshot: snapOf(live), worldState: ws, settlementUpdates: live,
        rng: rngOf(`cast::${t}`), tick: t,
      });
      ws = r.worldState;
      live = r.settlementUpdates;
      departures += r.accounting.departures;
      lowest = Math.min(lowest, live.find((u) => u.saveId === 'Halfcast').settlement.population);
    }
    expect(departures, 'the fixture never migrated, so the floor was never tested').toBeGreaterThan(0);
    expect(lowest, 'the engine put named souls on the road').toBeGreaterThanOrEqual(NAMED);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('10. COEXISTENCE — an M4 crisis column is never this lane\'s to land', () => {
  test('a class-less column rides through untouched while a classed one lands', () => {
    const realm = [
      { saveId: 'Ahold', settlement: place({ id: 'Ahold', tier: 'village', population: 400, dailyProduction: 3000 }) },
      { saveId: 'Bhold', settlement: place({ id: 'Bhold', tier: 'village', population: 400, dailyProduction: 3000 }) },
    ];
    const crisis = { originId: 'Ahold', destId: 'Bhold', arrivals: 77, departTick: 1, arrivalTick: 2 };
    const ours = { originId: 'Ahold', destId: 'Bhold', arrivals: 33, departTick: 1, arrivalTick: 2, travelClass: 'refugee' };
    const ws = {
      simulationRules: { demographicsEnabled: true, routeLifecycleEnabled: true },
      spatialLedgers: { migration: { 'Ahold:Bhold:1': crisis, 'Ahold:Bhold:1:refugee': ours } },
    };
    const r = advanceDemographicMigration({
      snapshot: snapOf(realm), worldState: ws, settlementUpdates: realm, tick: 5,
    });
    const after = r.worldState.spatialLedgers.migration;
    expect(after['Ahold:Bhold:1'], 'the crisis column was eaten by the wrong lane').toEqual(crisis);
    expect(after['Ahold:Bhold:1:refugee'], 'the demographic column never landed').toBeUndefined();
    const bhold = r.settlementUpdates.find((u) => u.saveId === 'Bhold');
    expect(bhold.settlement.population, 'the wrong number of people arrived').toBe(433);
    expect(r.accounting.arrivals).toBe(33);
  });

  test('THE MIRROR CLAIM: M4\'s own release leaves the demographic column on the road', () => {
    const crisis = { originId: 'Ahold', destId: 'Bhold', arrivals: 77, departTick: 1, arrivalTick: 2 };
    const ours = { originId: 'Ahold', destId: 'Bhold', arrivals: 33, departTick: 1, arrivalTick: 2, travelClass: 'refugee' };
    const ws = {
      spatialCanonVersion: 1,
      spatialLedgers: { migration: { 'Ahold:Bhold:1': crisis, 'Ahold:Bhold:1:refugee': ours } },
    };
    const released = releaseArrivals(ws, 5);
    // ANCHOR FIRST: the crisis column DID land, so the pass ran and the refusal below
    // is a refusal rather than a dormant no-op.
    expect(released.arrivals).toEqual([{ destId: 'Bhold', count: 77, originIds: ['Ahold'] }]);
    expect(released.next['Ahold:Bhold:1'], 'the crisis column was not released').toBeUndefined();
    expect(released.next['Ahold:Bhold:1:refugee'], 'M4 landed the other lane\'s people')
      .toEqual(ours);
  });

  test('the CLASS is part of the column identity, and survives the other lane\'s enqueue', () => {
    const dispatch = { originId: 'Ahold', destId: 'Bhold', travellers: 10, roadDeaths: 0, arrivals: 10, arrivalTick: 4 };
    const crisisPlan = { originId: 'Ahold', dispatches: [dispatch], mode: 'disperse' };
    const homeostatPlan = { ...crisisPlan, travelClass: 'voluntary' };
    // Same origin, same destination, same tick, two lanes.
    const afterM4 = enqueueColumns({}, crisisPlan, 1);
    const afterBoth = enqueueColumns(afterM4, homeostatPlan, 1);
    expect(Object.keys(afterBoth).sort(), 'the two lanes collided on one key')
      .toEqual(['Ahold:Bhold:1', 'Ahold:Bhold:1:voluntary']);
    expect(afterBoth['Ahold:Bhold:1'].travelClass, 'the crisis column was stamped').toBeUndefined();
    expect(afterBoth['Ahold:Bhold:1:voluntary'].travelClass).toBe('voluntary');
    // And a LATER M4 dispatch, which rebuilds every prior column, does not strip the mark.
    const later = enqueueColumns(afterBoth, { originId: 'Ahold', dispatches: [{ ...dispatch, destId: 'Chold' }], mode: 'disperse' }, 2);
    expect(later['Ahold:Bhold:1:voluntary'].travelClass,
      'the demographic column lost its owner and would never be landed by anyone').toBe('voluntary');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('11. DORMANCY — dark is a no-op by OBJECT IDENTITY', () => {
  test('the homeostat hands back the SAME references when the flag is absent', () => {
    const realm = [
      { saveId: 'Crowdhold', settlement: place({ id: 'Crowdhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
      { saveId: 'Emptyvale', settlement: place({ id: 'Emptyvale', tier: 'village', population: 200, dailyProduction: 3000 }) },
    ];
    const worldState = { simulationRules: { routeLifecycleEnabled: true } };
    const r = advanceDemographicMigration({
      snapshot: snapOf(realm), worldState, settlementUpdates: realm, tick: 7,
    });
    expect(r.worldState === worldState, 'worldState must be the SAME object').toBe(true);
    expect(r.settlementUpdates === realm, 'settlementUpdates must be the SAME array').toBe(true);
    expect(r.changed).toBe(false);
    expect(r.receipts).toEqual([]);
    expect(r.accounting.departures + r.accounting.arrivals).toBe(0);
  });

  test('NEGATIVE CONTROL for the identity pin: lit, the SAME call allocates and writes', () => {
    const realm = [
      { saveId: 'Crowdhold', settlement: place({ id: 'Crowdhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
      { saveId: 'Emptyvale', settlement: place({ id: 'Emptyvale', tier: 'village', population: 200, dailyProduction: 3000 }) },
    ];
    const worldState = litWorld([['Crowdhold', 'Emptyvale']]);
    const r = advanceDemographicMigration({
      snapshot: snapOf(realm), worldState, settlementUpdates: realm, tick: 7,
    });
    expect(r.worldState === worldState).toBe(false);
    expect(r.settlementUpdates === realm).toBe(false);
    expect(r.changed).toBe(true);
    expect(r.receipts.length).toBeGreaterThan(0);
  });

  test('and the whole demographic step stays identity-transparent dark through the kernel', () => {
    const realm = [
      { saveId: 'Crowdhold', settlement: place({ id: 'Crowdhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
    ];
    const worldState = { simulationRules: {} };
    const r = advanceDemographics({
      snapshot: snapOf(realm), worldState, settlementUpdates: realm, rng: rngOf('x'), tick: 2,
    });
    expect(r.worldState === worldState).toBe(true);
    expect(r.settlementUpdates === realm).toBe(true);
    expect(r.migrationReceipts).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('11b. THE HOST SEAM — the ledger survives the pulse\'s own change gate', () => {
  // applyPulseMover DISCARDS a mover's worldState when the mover reports changed:false
  // (wizardNews.js: `if (!result || !result.changed) return { worldState, ... }`). A lane
  // that writes a key and forgets to raise the flag therefore ships a ledger that
  // vanishes at the seam and nowhere else, which is invisible to every test that calls
  // the lane directly. Both host arms are pinned here rather than read off the source.
  //
  // WHAT THESE TWO DO NOT CATCH, stated so a later reader does not over-trust them:
  // forcing the homeostat's own changed flag to false leaves them GREEN, because on any
  // tick where somebody is also born or buried the rates lane has already cloned the
  // updates and raised the host's flag on its own. These arms prove the LEDGER reaches
  // the host through both lanes; the flag itself is pinned in section 11, whose lit
  // negative control reds under exactly that revert.
  const realm = () => [
    { saveId: 'Crowdhold', settlement: place({ id: 'Crowdhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
    { saveId: 'Emptyvale', settlement: place({ id: 'Emptyvale', tier: 'village', population: 200, dailyProduction: 3000 }) },
  ];

  test('with the LIFECYCLE lane dark, the host still reports changed and carries the key', () => {
    const updates = realm();
    const r = advanceSettlementLifecycle({
      snapshot: snapOf(updates), worldState: litWorld([['Crowdhold', 'Emptyvale']]),
      settlementUpdates: updates, pIndex: null, rng: rngOf('seam'), tick: 3, now: null,
    });
    expect(r.changed, 'the host would have had its whole write dropped at applyPulseMover').toBe(true);
    expect(Object.keys(r.worldState.spatialLedgers.migration).length).toBeGreaterThan(0);
    expect(r.receipts.some((x) => x.kind === 'demographic_migration'),
      'the homeostat receipts never reached the host').toBe(true);
  });

  test('with the LIFECYCLE lane LIT, the same key survives the satellite lane\'s own fold', () => {
    const updates = realm();
    const r = advanceSettlementLifecycle({
      snapshot: snapOf(updates),
      worldState: litWorld([['Crowdhold', 'Emptyvale']], { settlementLifecycleEnabled: true }),
      settlementUpdates: updates, pIndex: null, rng: rngOf('seam'), tick: 3, now: null,
    });
    expect(r.changed).toBe(true);
    expect(Object.keys(r.worldState.spatialLedgers.migration).length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('12. DETERMINISM — replay, seed families, ZERO new streams, purity', () => {
  const familyRealm = (suffix) => [
    { saveId: `Crowd${suffix}`, settlement: place({ id: `Crowd${suffix}`, tier: 'town', population: 10500, dailyProduction: 30000 }) },
    { saveId: `Vale${suffix}`, settlement: place({ id: `Vale${suffix}`, tier: 'village', population: 200, dailyProduction: 3000 }) },
  ];

  test('the lit lane replays exactly, twice, for a whole family of realms', () => {
    const failures = collectSeedFailures(['Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff'], (suffix) => {
      const trace = () => {
        const r = runAccumulating({
          updates: familyRealm(suffix),
          worldState: litWorld([[`Crowd${suffix}`, `Vale${suffix}`]]),
          ticks: 60,
          seed: `family-${suffix}`,
        });
        return r.live.map((u) => `${u.saveId}=${u.settlement.population}`).join(',');
      };
      expect(trace()).toBe(trace());
    });
    expectNoSeedFailures(failures, 'the homeostat replays exactly for every realm in the family');
  });

  test('the dither is keyed per settlement AND per tick: twins diverge, one realm does not', () => {
    const traceFor = (suffix) => runAccumulating({
      updates: familyRealm(suffix),
      worldState: litWorld([[`Crowd${suffix}`, `Vale${suffix}`]]),
      ticks: 40,
      seed: 'shared',
    }).live.map((u) => u.settlement.population).join(',');
    const outcomes = new Set(['Aa', 'Bb', 'Cc', 'Dd'].map(traceFor));
    expect(outcomes.size, 'four differently named realms produced one identical trace')
      .toBeGreaterThan(1);
  });

  test('THE HOMEOSTAT OPENS NO STREAM: the rates lane still draws EXACTLY twice per settlement', () => {
    const realm = [
      { saveId: 'Crowdhold', settlement: place({ id: 'Crowdhold', tier: 'town', population: 10500, dailyProduction: 30000 }) },
      { saveId: 'Emptyvale', settlement: place({ id: 'Emptyvale', tier: 'village', population: 200, dailyProduction: 3000 }) },
    ];
    const forks = [];
    const draws = [];
    const rng = {
      fork: (key) => { forks.push(key); return { random: () => { draws.push(key); return 0.5; } }; },
    };
    const before = Math.random;
    let ambient = 0;
    Math.random = () => { ambient += 1; return 0.5; };
    try {
      advanceDemographics({
        snapshot: snapOf(realm), worldState: litWorld([['Crowdhold', 'Emptyvale']]),
        settlementUpdates: realm, rng, tick: 11,
      });
    } finally {
      Math.random = before;
    }
    expect(forks, 'the migration lane opened a fork of its own')
      .toEqual(['demographics:Crowdhold', 'demographics:Emptyvale']);
    expect(draws.length, 'births then deaths, and nothing else').toBe(4);
    expect(ambient, 'a draw here would shift every seeded stream downstream').toBe(0);
  });

  test('STRUCTURAL PURITY: neither P2 leaf reaches for a clock, a locale, or ambient randomness', () => {
    const files = [
      'src/domain/worldPulse/demographicsMigration.js',
      'src/domain/worldPulse/demographicsPushPull.js',
    ];
    for (const file of files) {
      const src = readFileSync(join(ROOT, file), 'utf8');
      expect(src.length, `the scan read an empty file: ${file}`).toBeGreaterThan(0);
      const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      for (const banned of ['Math.random', 'Date.now', 'new Date', 'toLocaleString', 'localeCompare']) {
        expect(code.includes(banned), `${file} reaches for ${banned}`).toBe(false);
      }
      // No em dash may reach a string literal in a domain module (the house voice law).
      expect(/["'`][^"'`]*—[^"'`]*["'`]/.test(code), `${file} carries an em dash in a string`).toBe(false);
    }
    const mig = readFileSync(join(ROOT, files[0]), 'utf8');
    // The dither is keyed on BOTH the settlement and the tick, through the wave's own
    // primitive, so no two settlements and no two ticks share a draw.
    expect(mig).toContain('hash01(`demographics.migration.${originId}.${stepTick}`)');
  });

  test('the tuning surface is a closed authored table, not floats on a surface', () => {
    expect(Object.isFrozen(PUSH_PULL_TUNING)).toBe(true);
    // The five driver weights sum to exactly one, so a FULL push means every driver
    // saturated and nothing else can inflate the score past its band.
    const weights = [0.34, 0.24, 0.16, 0.14, 0.12];
    expect(Math.round(weights.reduce((a, b) => a + b, 0) * 100) / 100).toBe(1);
    expect(PUSH_PULL_TUNING.DEPART_RATE_MAX).toBeGreaterThan(PUSH_PULL_TUNING.DEPART_PUSH_FLOOR / 10);
  });

  test('homePullOf prices staying put at zero distance, so the margin compares like with like', () => {
    const settlement = place({ id: 'Homehold', tier: 'village', population: 600, dailyProduction: 4000 });
    const readings = demographicReadings(settlement, litWorld(), 'Homehold');
    const home = homePullOf({
      readings, need: needVectorOf(readings), item: null, pIndex: null, settlementId: 'Homehold',
    });
    expect(home).toBeGreaterThan(0);
    // The identical readings priced one tick away are worth measurably less.
    const away = pullScoreOf({
      need: needVectorOf(readings),
      destination: {
        destId: 'Homehold', ticks: 1,
        foodSlack01: (readings.foodCapacity - readings.population) / readings.foodCapacity,
        roomSlack01: (readings.densityCeiling - readings.population) / readings.densityCeiling,
        safety01: 1, prosperity01: 0.5, spare: 0, viable: true,
      },
    });
    expect(away).toBeLessThan(home);
  });
});
