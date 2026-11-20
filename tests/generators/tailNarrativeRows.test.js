/**
 * tests/generators/tailNarrativeRows.test.js — TAIL-NARRATIVE (READ-ALL 2026-11-14, the group NARRATIVE's worklist), one
 * collected guard a batch. Each row is a census town (born exactly as the census borns it) and a sentence the reader
 * flagged there, read false against that town's own record; each KEEP row is a true sibling that must still print.
 *
 * BATCH 1 — `narrativeText.js` (PRESSURE_SENTENCES, POLITICAL_FLAVOR, famineFoodIsPower) and the pressure detail's
 * roster flags (`narrativeGenerator.js :: genPressureDetail`: hasWarehouse, hasCivicHall, hasForce, millExports).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { PRESSURE_SENTENCES, POLITICAL_FLAVOR } from '../../src/generators/narrativeText.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { founderAgrees } from '../../src/generators/narrative/foundingRowAdmits.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own configuration for its two seed families (CENSUS-3 seedcfg.mjs, r2r- and r2s-). @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  m = /** @type {RegExpMatchArray} */ (seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/));
  return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
};
/** @type {Map<string, any>} */
const births = new Map();
/** @param {string} seed @returns {any} */
const born = (seed) => {
  if (!births.has(seed)) births.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return births.get(seed);
};
/** @param {any} s @param {'pressure'|'history'} where @returns {string} */
const read = (s, where) => String(where === 'pressure' ? s.pressureSentence : s.history?.historicalCharacter);

describe('B1 the narrative text rows read the town (TAIL-NARRATIVE batch 1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  /** [id, seed, where, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, string, 'pressure'|'history', RegExp, RegExp]>} */ ([
    ['00053', 'r2s-under_siege-town-2', 'history', /nobody expects it/, /^The Siege /],
    ['B00096', 'r2r-thorp-9', 'history', /^"?Little has happened here/, /^"?Apart from the Uprising, little has happened/],
    ['20438', 'r2r-hamlet-36', 'pressure', /built for quieter years/, /^Three farmsteads/],
    ['20439', 'r2s-monster_pressure-hamlet-3', 'pressure', /built for quieter years/, /^Three farmsteads/],
    ['00338', 'r2s-politically_fractured-thorp-1', 'pressure', /Three powers in/, /^The powers of Mayanek are each waiting for the other to slip/],
    ['00172', 'r2s-monster_pressure-thorp-1', 'pressure', /Three farmsteads/, /^The bounty /],
    ['B00101', 'r2r-hamlet-8', 'history', /Nothing has ever forced/, /^"?It came through the Purge/],
    ['01333', 'r2r-hamlet-33', 'pressure', /paints its civic buildings/, /still keeps up its appearances/],
    // RE-KEYED BY IDENTITY 2026-11-18 (BAR8-SCENES-3, BR25 (4)): the anchor was "It has come through the Iron Dispute and the Great Fire,
    // …" (the stable pool's long-and-steady row, the pool's argmax where the drawn row is refused); BAR8-SCENES (K's 12c) refused
    // that row under a famine, and this thorp is under one, so the argmax moved to the row that names all four of its record's
    // events, by name and in order (a twin answers only for the DRAWN row: `drawDeclared.js`). The same claim on that line
    ['00138', 'r2r-thorp-46', 'history', /made its name in trade/, /^"?A settlement shaped by the accumulated weight of The Succession Crisis, The Iron Dispute, The Great Fire and The Trade Collapse: /],
    ['11487', 'r2r-thorp-22', 'pressure', /sends to enforce/, /has no one to send who would be obeyed/],
    ['20366', 'r2s-indebted-thorp-3', 'pressure', /a warehouse here/, /\(a field here, a right of way there\)/],
    ['07115', 'r2s-insurgency-thorp-2', 'pressure', /power leader/, /whoever first offers something better/],
    ['01722', 'r2s-politically_fractured-thorp-2', 'pressure', /all three powers/, /the only person every power here will still speak to/],
    ['00010', 'r2r-thorp-59', 'history', /practitioners who work here/, /is still discussed here, carefully\./],
    ['20149', 'r2s-insurgency-thorp-3', 'pressure', /its own officials/, /comes from inside: dues held back/],
    ['11478', 'r2s-slave_revolt-thorp-1', 'pressure', /timber that made it/, /without destroying what made it worth holding/],
    ['00708', 'r2s-monster_pressure-village-3', 'pressure', /a mill standing idle/, /\(fields left unworked, a mill kept turning for its buyers\)/],
    ['01079', 'r2s-wartime-city-1', 'pressure', /is prospering on the right side/, /^Jalalserai is at war and, for now, on the right side of it/],
    ['03831', 'r2s-indebted-metropolis-0', 'pressure', /a distinction that has not gone unnoticed/, /took the loans and is now repaying them/],
    ['B17142', 'r2s-famine-town-1', 'pressure', /at least three powers/, /its strongest powers are each watching who holds/],
    ['B04491', 'r2r-city-37', 'pressure', /nor keep them fed/, /nor find them all work/],
    ['B01841', 'r2s-politically_fractured-metropolis-2', 'pressure', /all three powers/, /the only person every power here will still speak to/],
  ]);

  it('the flagged sentence no longer prints, and its slot says what the town bears (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([id, seed, where, gone, instead]) => {
      const text = read(born(seed), where);
      expect(text, `${id} ${seed}: what prints instead`).toMatch(instead);
      // anchored: the line above asserts the slot printed its true line
      expect(text, `${id} ${seed}: the flagged sentence`).not.toMatch(gone);
    }), 'the flagged sentence no longer prints');
  });

  /** [id, seed, where, still prints] — a true sibling of each cured shape */
  const KEEP = /** @type {Array<[string, string, 'pressure'|'history', RegExp]>} */ ([
    ['00053', 'r2r-hamlet-37', 'history', /^"?Every plan made here now allows for the Siege happening again; nobody expects it/],
    ['00014', 'r2r-town-14', 'history', /the local clergy and the civic authority/],
    ['20438', 'r2r-hamlet-10', 'pressure', /were built for quieter years than these/],
    ['00338', 'r2r-village-53', 'pressure', /^Three powers in /],
    ['00172', 'r2s-monster_pressure-hamlet-1', 'pressure', /^Three farmsteads have been abandoned/],
    ['01333', 'r2s-indebted-city-1', 'pressure', /still paints its civic buildings/],
    ['00138', 'r2r-town-38', 'history', /made its name in trade, not war/],
    ['11487', 'r2s-insurgency-hamlet-3', 'pressure', /sends to enforce either turn back or turn coat/],
    ['20366', 'r2s-indebted-metropolis-1', 'pressure', /\(a warehouse here, a toll right there\)/],
  ]);

  it('the true sibling still prints where the record bears it out (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([id, seed, where, kept]) => {
      expect(read(born(seed), where), `${id} ${seed} keeps its line`).toMatch(kept);
    }), 'the true sibling still prints');
  });

  it('the branches without a birth: one power in both slots, the powers counted, a quiet history beside no great event', () => {
    const indebted = PRESSURE_SENTENCES.indebted({ name: 'X', topFaction: 'Old Council', govFaction: 'New Council' });
    expect(String(indebted[1])).toContain('The Old Council took the loans and the New Council is repaying them'); // NAMES-1 (CN1): the article
    const fractured = (/** @type {number} */ n) => PRESSURE_SENTENCES.politically_fractured({ name: 'X', powerCount: n, topNPCName: 'A', topNPCRole: 'elder' });
    expect(String(fractured(3)[1])).toContain('Three powers in X are each waiting for one of the others to slip');
    expect(String(fractured(3)[2])).toContain('the only person all three powers will still speak to');
    expect(String(fractured(5)[1])).toContain('The powers of X are each waiting for one of the others to slip');
    const quiet = [{ name: 'The Market Fair', severity: 'minor', type: 'economic' }];
    expect(/** @type {any} */ (POLITICAL_FLAVOR.stable[8])(quiet)).toMatch(/^Little has happened here worth writing down/);
    expect(/** @type {any} */ (POLITICAL_FLAVOR.stable[7])(quiet)).toMatch(/^Nothing has ever forced this place to change much/);
  });
});

/**
 * FA — A FOUNDER AND AN ORIGIN ROW THAT CANNOT BOTH BE (the chair's ruling (N3); RECORD-MEASURE-1 class a, 154 of 720):
 * an Origin row that names the GROUP that began the place (herders, fishers, a military post, a religious settlement, a
 * fair's traders) stands only beside a founder of that kind (`foundingRowAdmits.js :: ORIGIN_AGENT_KINDS`); a refused
 * row resolves draw-free onward to a row of its pool that agrees, else no Origin row (silence, the rule's own answer).
 */
describe('B2 the Origin row\'s group agrees with the founder (TAIL-NARRATIVE FA)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** [seed, the founder refused beside the row, the refused row, the founder now, the row now (null: no Origin row)]
   * TAIL-NARRATIVE-4 (FB, ruling N17) re-keyed BY IDENTITY: the same towns and the same refused pairs; where the tier's
   * table holds a founder that agrees, the FOUNDER now resolves (the drawn Origin row kept), else FA moves the row. */
  const CURED = /** @type {Array<[string, RegExp, RegExp, RegExp, RegExp | null]>} */ ([
    ['r2r-thorp-2', /^a healer who stopped/, /customs post/, /^a discharged soldier/, /customs post where trade roads crossed/],
    ['r2r-town-9', /^merchants recognising/, /frontier outpost/, /^a noble granted lands/, /frontier outpost/],
    ['r2s-famine-town-3', /^religious authorities/, /toll collection point/, /^merchants recognising/, /toll collection point/],
    ['r2s-under_siege-village-2', /^refugees fleeing war/, /two rival mining operations/, /^a community of tradespeople/, /two rival mining operations/],
    ['r2s-occupied-hamlet-0', /^a household that settled first/, /defensive stronghold/, /^a household that settled first/, /mining camp that became permanent/],
    ['r2s-monster_pressure-metropolis-3', /^the slow accretion/, /defensive stronghold/, /^imperial decree/, /defensive stronghold/],
    ['r2s-politically_fractured-thorp-2', /^a discharged soldier/, /herders gathered/, /^a discharged soldier/, null],
    ['r2r-city-36', /^a merchant coalition/, /sacred grove/, /^a merchant coalition/, null],
  ]);
  it('the founder and the row that cannot both be never print together; the slot holds an agreeing pair or no row (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([seed, refusedFounder, refusedRow, founder, now]) => {
      const f = born(seed).history?.founding || {};
      expect(String(f.foundedBy), `${seed}: the founder`).toMatch(founder);
      if (now) expect(String(f.reason), `${seed}: the row now`).toMatch(now);
      else expect(f.reason ?? null, `${seed}: no Origin row`).toBeNull();
      expect(refusedFounder.test(String(f.foundedBy)) && refusedRow.test(String(f.reason)), `${seed}: the refused pair`).toBe(false);
    }), 'the founder and the row that cannot both be never print together');
  });
  const KEEP = /** @type {Array<[string, RegExp, RegExp]>} */ ([
    ['r2r-thorp-37', /^a pair of siblings/, /herders gathered/],
    ['r2r-town-18', /^a noble granted lands/, /naval base/],
    ['r2r-thorp-33', /^a single extended family/, /sacred grove/],
    ['r2r-village-50', /^escaped serfs/, /mining camp that became permanent/],
  ]);
  it('a group row beside a founder of its kind still prints (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, founder, kept]) => {
      const f = born(seed).history?.founding || {};
      expect(String(f.foundedBy), `${seed}: the founder`).toMatch(founder);
      expect(String(f.reason), `${seed} keeps its row`).toMatch(kept);
    }), 'a group row beside a founder of its kind still prints');
  });
});

/**
 * BATCH 3 — `settlementOriginProse.js :: ORIGIN_POOLS` (TAIL-NARRATIVE-2; the chair's ruling (N6): the origin pools as
 * TAIL-NARRATIVE verified and proposed; READ-ALL's tabs rows and the exports' rows (X9) of the same writer). The origin
 * line (`settlementReason[0]`) says WHERE the place stands and what the record holds; the founding CAUSE is the History's
 * (`history.founding.reason`, drawn after it): no row claims a cause ("founded for", "because", "exists because", "on
 * the reasoning that", "meant to trade by water"); a shortfall says "must make do with", never that it gets by; a
 * channel is said to ease the gap, never to meet or close it; the seasonal path is the tracks, not caravans that come.
 */
describe('B3 the origin line says where the place stands and what the record holds (TAIL-NARRATIVE-2 batch 3)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed @returns {string} */
  const origin = (seed) => String(born(seed).settlementReason?.[0]);
  /** [id, seed, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, string, RegExp, RegExp]>} */ ([
    ['B20939', 'r2s-plague_onset-thorp-0', /most of what it owns arrived/, /^Built beside the road in the forest; what the place sells goes out along it, and what it buys comes in\.$/], // BAR2-PLACES (PL2, 2026-11-15): re-keyed by its text (no generations claimed); re-keyed by identity at PEOPLE-2 B3 (2026-11-20): the town prints a road wording on its own facts (src/data/settlementReasonVariants.js),
    ['09370', 'r2s-famine-city-3', /^Founded at a junction/, /^It stands where roads cross out on the open plain\.$/], // re-keyed by identity at PEOPLE-2 B3 (2026-11-20): a crossroads wording on the town's own terrain
    ['11941', 'r2r-metropolis-14', /^It exists because travellers/, /^It stands where the roads meet, on ground travellers stopped at long before anyone built here\.$/],
    ['09398', 'r2s-famine-town-2', /for the shelter of its anchorage/, /^Built on the coast around the shelter of its anchorage, and the sea has set the terms/],
    ['B20803', 'r2s-under_siege-metropolis-1', /The sea gives the settlement its living/, /the sea has set the terms of its living ever since\.$/],
    ['B13256', 'r2s-under_siege-city-0', /Most of what it eats/, /; most of its trade has always gone by sea\.$/],
    ['15081', 'r2s-wartime-thorp-2', /gets by on/, /Nothing comes in from outside; it must make do with what it produces itself\.$/],
    ['15101', 'r2s-succession_void-thorp-1', /gets by on/, /every season it must make do with what it produces itself\.$/],
    ['22030', 'r2s-under_siege-thorp-2', /gets by on/, /The siege has closed the roads; it must make do with what it produces itself\.$/],
    ['14593', 'r2r-thorp-38', /gets by on|does not quite feed it/, /does not fully feed it\. No food reaches it from outside, and it must make do with/],
    ['11943', 'r2s-under_siege-town-2', /gets by on/, /It must make do with what it has in store and what it produces itself\.$/],
    ['17926', 'r2s-under_siege-town-2', /does not quite feed it/, /^Set apart from the trade roads, on ground that does not fully feed it, and now cut off by a siege\./],
    ['22014', 'r2s-famine-village-3', /The shortfall is met through/, /For what it lacks it looks to carts from the country around it or the tracks in a good season\. Every season the terms/],
    ['18781', 'r2r-town-54', /caravans that still come/, /Survival here rests on carriage by magic, the tracks in a good season, or the favour of a patron/],
    ['deficit[1]', 'r2s-mass_migration-town-2', /The gap is closed through/, /To close the gap it turns to the tracks in a good season — at a price/],
    ['22398', 'r2s-famine-hamlet-3', /on the reasoning that/, /before anyone built here; a road that old is not soon abandoned\.$/], // BAR2-PLACES (PL2, 2026-11-15): re-keyed by its text (no age in years),
    ['22397', 'r2s-under_siege-hamlet-2', /because the river was the only road/, /^Sited at the water's edge, where the river was the only road worth having/],
    ['22375', 'r2r-hamlet-28', /meant to trade by water/, /^Built on the shore; its trade has always gone by water\.$/],
    ['22396', 'r2r-thorp-9', /The distance is why it was founded/, /^Set apart from the trade roads\. The distance has kept it small and whole\.$/],
  ]);
  it('the flagged origin line no longer prints, and the slot says what the record bears (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([id, seed, gone, instead]) => {
      const text = origin(seed);
      expect(text, `${id} ${seed}: what prints instead`).toMatch(instead);
      expect(text, `${id} ${seed}: the flagged line`).not.toMatch(gone); // anchored: the line above asserts the slot printed
    }), 'the flagged origin line no longer prints');
  });
  /** [the struck or untouched row, seed, the true line that must still print] */
  const KEEP = /** @type {Array<[string, string, RegExp]>} */ ([
    // re-keyed by identity (BAR5-WORLD, 2026-11-16): the same row (ORIGIN_POOLS.road[2]) reworded to tell no founding (LAW 4:
    // the founding is the History's); the town and the pick unchanged
    ['09400 struck: a place, not a cause', 'r2r-thorp-40', /^Built beside the road out on the open plain; what the place sells goes out along it/], // re-keyed by identity at PEOPLE-2 B3 (2026-11-20): a road wording on the town's own facts (src/data/settlementReasonVariants.js); no cause, as the row
    ['22374 struck: trade on every road, no siege', 'r2s-famine-town-0', /^It stands where roads cross out on the open plain\.$/], // re-keyed by identity at PEOPLE-2 B3 (2026-11-20): a crossroads wording on the town's own terrain
    ['port.coastal[1]', 'r2r-town-51', /^A seaport\. The tide sets the working day/],
    ['unsupplied[0] at an 8% gap', 'r2r-thorp-23', /^Isolated from major trade routes\. The settlement cannot fully feed itself, and no food comes in from outside: /],
    ['the magic path the receipt holds', 'r2r-town-12', /through carriage by magic or the tracks in a good season — or not at all\.$/],
    // the row's TITLE names the path by its key in settlementOriginProse.js (TAIL-CLOSE-TESTS-C): the old title quoted the
    // generator's phrase, which the drawn-anchor walker aligned against DS-GEN-3 by coincidence; the assertion is unchanged
    ['the hinterland path (carts)', 'r2r-village-0', /through carts from the country around it or the tracks in a good season — or not at all\.$/],
  ]);
  it('the true sibling still prints where the record bears it out (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([id, seed, kept]) => {
      expect(origin(seed), `${id} ${seed}`).toMatch(kept);
    }), 'the true sibling still prints');
  });
});

/**
 * BATCH 3, the chair's ruling (N9) — `narrativeText.js :: POLITICAL_FLAVOR.political_heavy`: "Authority here has a
 * provisional quality …" (B00042: 4 towns, false in the 2 whose public legitimacy is Approved; the fact it needs is not
 * an atom) LEFT THE POOL; its one pick re-draws inside the pool. Its inheritors read: "… but not whether they deserve it,
 * and the powers are still arguing the second point" was false in all 4 towns that print it (Approved or Endorsed in
 * three, one power in the fourth): reworded to claim neither a contested right nor a plurality of powers.
 */
describe('B3 (N9) the political flavour claims no legitimacy the record lacks (TAIL-NARRATIVE-2 batch 3)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** [id, seed, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, string, RegExp, RegExp]>} */ ([
    ['B00042', 'r2r-town-57', /provisional quality/, /The current governing arrangements are a compromise nobody fully chose: shaped more by the Succession Crisis/],
    ['B00042', 'r2s-infiltrated-metropolis-1', /provisional quality/, /The current governing arrangements are a compromise nobody fully chose/],
    ['B00042', 'r2r-metropolis-34', /provisional quality|not whether they deserve it/, /The Land Dispute decided who holds power here, and every household still tells it the way its own side remembers it/],
    ['B00042', 'r2s-insurgency-hamlet-3', /provisional quality|the powers are still arguing/, /The Interregnum decided who holds power here, and every household still tells it/],
    ['political_heavy[4]', 'r2r-city-16', /not whether they deserve it/, /decided who holds power here, and every household still tells it the way its own side remembers it/],
    ['political_heavy[4]', 'r2r-metropolis-46', /not whether they deserve it/, /decided who holds power here, and every household still tells it the way its own side remembers it/],
  ]);
  it('the line that left the pool prints nowhere it printed; the slot holds a line of the same pool (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([id, seed, gone, instead]) => {
      const text = read(born(seed), 'history');
      expect(text, `${id} ${seed}: what prints instead`).toMatch(instead);
      expect(text, `${id} ${seed}: the flagged line`).not.toMatch(gone); // anchored: the line above asserts the slot printed
    }), 'the political flavour claims no legitimacy the record lacks');
  });
  const KEEP = /** @type {Array<[string, string, RegExp]>} */ ([
    ['27424 struck: a Legitimacy Crisis', 'r2s-succession_void-town-3', /The offices here are filled and the seals are real, but people still ask in private/],
    ['political_heavy[1]', 'r2r-metropolis-36', /People here still argue about the Succession Crisis, and every family still teaches its children/],
  ]);
  it('the true siblings still print (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([id, seed, kept]) => {
      expect(read(born(seed), 'history'), `${id} ${seed}`).toMatch(kept);
    }), 'the true siblings still print');
  });
});

/**
 * BATCH 4 — the chair's READ-ALL-4 faults in new lines (`narrativeText.js`): `famineFoodIsPower` said the powers "are
 * fighting over the stores" where the record's only quarrel is not over the food: the powers are each watching who
 * holds the food; `monster_pressure[3]` said the town traded "the harvest it needs" beside a 17% surplus: it gives up
 * its outlying ground. Rewordings inside their rows; no draw moved.
 */
describe('B4 the new lines claim no fight and no need the record lacks (TAIL-NARRATIVE-2 batch 4)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** [seed, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, RegExp, RegExp]>} */ ([
    ['r2s-famine-town-1', /are fighting over/, /^Since the harvest failed, whoever holds the food in .+ holds the power, and its strongest powers are each watching who holds /],
    ['r2s-famine-metropolis-1', /are fighting over/, /^Since the fishing failed, .+ its strongest powers are each watching who holds /],
    ['r2s-famine-metropolis-2', /are fighting over/, /^Since the herds failed, .+ its strongest powers are each watching who holds /],
    ['r2s-monster_pressure-village-3', /trading the harvest it needs/, /a mill kept turning for its buyers\) giving up its outlying ground for a perimeter the able-bodied can actually hold\.$/],
    ['r2s-monster_pressure-village-1', /it needs for a perimeter/, /a mill standing idle\) giving up its outlying ground for a perimeter/],
    ['r2s-monster_pressure-town-2', /it needs for a perimeter/, /giving up its outlying ground for a perimeter the watch can actually hold\.$/],
    ['r2s-monster_pressure-metropolis-0', /it needs for a perimeter/, /giving up its outlying ground for a perimeter the garrison can actually hold\.$/],
  ]);
  it('the flagged line no longer prints, and the slot says what the record bears (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([seed, gone, instead]) => {
      const text = read(born(seed), 'pressure');
      expect(text, `${seed}: what prints instead`).toMatch(instead);
      expect(text, `${seed}: the flagged line`).not.toMatch(gone); // anchored: the line above asserts the slot printed
    }), 'the new lines claim no fight and no need');
  });
  const KEEP = /** @type {Array<[string, RegExp]>} */ ([
    ['r2r-thorp-17', /^Since the hunt failed, food is power in .+, and every household is watching what the others eat\.$/],
    ['r2s-monster_pressure-city-3', /outlying farms are being hit one after another/],
  ]);
  it('the true siblings still print (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, kept]) => {
      expect(read(born(seed), 'pressure'), seed).toMatch(kept);
    }), 'the true siblings still print');
  });
});

/**
 * BATCH 5 (TAIL-NARRATIVE-3, ruling (N13)) — `src/data/narrativeData.js` (STRESS_NOTES, STRESS_DESCS, ARRIVAL_SCENES) and
 * `src/data/stressInstitutionEffects.js` (the crisis secrets): each line names only what the record holds. The founding
 * note claimed the founders' purpose, trust or kind ("founded by people who agreed on its purpose", "a few families who
 * trusted each other", "chosen for trade, water and good ground") beside a founder or a reason that denies it: it now
 * speaks of the settlement and its people, never of why or by whom it was founded. The arrival lines named streets,
 * quarters, warehouses, a crossroads or a waterfront the town lacks; the secrets named patrols, a crackdown, an archive,
 * grain reserves, a slave market, a supply, and a family gone out of a besieged town. Every cure is a rewording inside
 * its row (the same pool, the same slots, every keyword `getStressHistory` reads kept): no draw moved.
 */
const note = (/** @type {any} */ s) => String(s.history?.founding?.stressNote);
const arrival = (/** @type {any} */ s) => JSON.stringify(s.arrivalScene ?? '');
const secrets = (/** @type {any} */ s) => (s.npcs || []).map((/** @type {any} */ n) => `${n.secret?.what ?? ''} | ${n.secret?.stakes ?? ''}`).join(' || ');
const READ5 = { note, arrival, secrets };
describe('B5 the founding notes, the arrival lines and the secrets name only what the record holds (TAIL-NARRATIVE-3 batch 5)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** [id, seed, where, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, string, 'note'|'arrival'|'secrets', RegExp, RegExp]>} */ ([
    ['21981', 'r2s-politically_fractured-thorp-1', 'note', /agreed on its purpose/, /^The people of the settlement no longer agree on what it is for/],
    ['03015', 'r2s-politically_fractured-thorp-3', 'note', /shared purpose held the founders/, /^Every power here tells the settlement's story its own way/], // re-keyed by identity (TAIL-NARRATIVE-5: the style law's word)
    ['pf[1]', 'r2r-hamlet-45', 'note', /pulled together in one direction/, /^Its people work as hard as they ever did/],
    ['21980', 'r2s-recently_betrayed-thorp-1', 'note', /few families who trusted/, /^The settlement runs on trust between its households/],
    ['22973', 'r2r-thorp-51', 'note', /promise between a few families/, /^Life here rests on promises kept between neighbours/],
    ['rb[2]', 'r2s-recently_betrayed-thorp-2', 'note', /survived by trusting/, /^People here trusted each other without thinking about it/],
    ['09482', 'r2s-slave_revolt-thorp-2', 'note', /From its first season/, /^For years this place has run on enslaved hands/],
    ['sr[0]', 'r2s-slave_revolt-thorp-1', 'note', /was built by slaves/, /^The settlement ran on slaves/],
    ['sr[2]', 'r2s-slave_revolt-thorp-3', 'note', /The founders built with slaves/, /^Its masters worked it with slaves/],
    ['20558', 'r2r-thorp-32', 'note', /founders built a place to trade/, /and pays what the army thinks fair\.$/],
    ['war[0]', 'r2r-thorp-56', 'note', /founded for trade and quiet growth/, /^The settlement grew up in quieter years/],
    ['war[1]', 'r2r-hamlet-5', 'note', /chosen for peace/, /the bill grows every season\.$/],
    ['22064', 'r2s-under_siege-thorp-2', 'note', /chosen for trade, water/, /^Whatever the site was chosen for matters little/],
    ['siege[0]', 'r2r-thorp-58', 'note', /chose this place for its trade/, /^Whatever the settlement was built for, it is under siege now/],
    ['21761', 'r2s-plague_onset-village-1', 'note', /roads and river/, /the sickness found its way here all the same\.$/],
    ['plague[0]', 'r2r-village-50', 'note', /its roads and water/, /^The sickness came in the way everything else here comes in/],
    ['plague[2]', 'r2s-plague_onset-thorp-1', 'note', /picked so trade could reach/, /^The sickness reached it as easily as news does/],
    ['01626', 'r2s-occupied-thorp-1', 'arrival', /street signs/, /notices are posted in two languages now/],
    ['18689', 'r2s-occupied-hamlet-0', 'arrival', /where the roads meet/, /stand about in the middle of/],
    ['01080', 'r2s-wartime-village-3', 'arrival', /prosperous in a way|the warehouses are full/, /is busy in a way that feels wrong for a place this poor\. The forge fires burn past dark/], // re-keyed by identity (TAIL-NARRATIVE-5, N18 (1)): a struggling town takes the twin
    ['00340', 'r2s-religious_conversion-village-3', 'arrival', /in different quarters/, /forming at opposite ends of the settlement/],
    ['B21058', 'r2r-thorp-35', 'arrival', /working waterfront/, /the particular mud of a bank that people use every day/],
    ['21748', 'r2r-thorp-14', 'arrival', /becomes a street/, /becomes part of the settlement at a point/],
    ['01529', 'r2s-slave_revolt-thorp-0', 'arrival', /field gangs/, /field hands work without overseers today/],
    ['17390', 'r2s-insurgency-hamlet-2', 'secrets', /Ordered a crackdown/, /Named people who had nothing to do with the insurgency as its ringleaders/],
    ['17123', 'r2r-thorp-10', 'secrets', /patrol schedules|hit patrols/, /selling information about who travels the roads and when/],
    ['22818', 'r2s-monster_pressure-thorp-3', 'secrets', /sent a patrol/, /They sent a party into that territory/],
    ['17102', 'r2s-succession_void-hamlet-3', 'secrets', /archive/, /removing records that would complicate the succession/],
    ['17522', 'r2r-thorp-17', 'secrets', /grain reserves|at peak price/, /Sold off the settlement's emergency stores/],
    ['22572', 'r2s-under_siege-thorp-3', 'secrets', /family left last week|loading the cart/, /Their family is packed and waiting for the first gap in the lines/],
    ['17204', 'r2r-thorp-38', 'secrets', /supply disruption/, /Helped cause the original shortfall that triggered the famine/],
    ['17408', 'r2s-slave_revolt-village-0', 'secrets', /slave market/, /Owned a share in the slaves worked here/],
  ]);
  it('the flagged line no longer prints, and the slot says what the record bears (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([id, seed, where, gone, instead]) => {
      const text = READ5[where](born(seed));
      expect(text, `${id} ${seed}: what prints instead`).toMatch(instead);
      expect(text, `${id} ${seed}: the flagged line`).not.toMatch(gone); // anchored: the line above asserts the slot printed
    }), 'the batch-5 lines name only what the record holds');
  });
  /** [seed, where, a true sibling that must still print] */
  const KEEP = /** @type {Array<[string, 'note'|'arrival'|'secrets', RegExp]>} */ ([
    ['r2s-under_siege-thorp-1', 'note', /^These walls were built in case they were ever needed\. They are needed now\.$/], // re-keyed by identity (TAIL-NARRATIVE-5, N18 (2)): the walls kept, the founders not claimed
    ['r2r-village-9', 'note', /^The founding generation is gone, and nobody agrees who should lead now\.$/],
    ['r2r-thorp-26', 'note', /^A place this size still trusts faces it knows/],
    ['r2s-insurgency-town-0', 'secrets', /Is the insurgency's contact inside the council/],
    ['r2s-famine-city-0', 'secrets', /Is receiving grain shipments through a covert route/],
  ]);
  it('the true siblings still print (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, where, kept]) => {
      expect(READ5[where](born(seed)), seed).toMatch(kept);
    }), 'the true siblings still print');
  });
});

/**
 * BATCH FB — `foundingRowAdmits.js :: founderForOrigin` (TAIL-NARRATIVE-4; the chair's ruling (N17): THE FOUNDER AGAINST
 * THE ORIGIN; RECORD-MEASURE-1's candidate FB, FA's table turned the other way). The founder row that names THIS
 * CROSSROADS stands only where the route is one; a founder that states its own founding purpose (a refuge beyond reach, a
 * religious centre or community, a fortification) does not stand beside an Origin row that states another (a trading
 * port, a harbour or a deposit worked, a market, a waystation, a mill); the founder resolves draw-free onward through its
 * tier's table to one that agrees, the drawn Origin row kept.
 */
describe('B6 the founder agrees with the Origin row in place and purpose (TAIL-NARRATIVE-4 FB)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** [seed, the founder that cannot be, the founder now, the Origin row now] */
  const CURED = /** @type {Array<[string, RegExp, RegExp, RegExp]>} */ ([
    ['r2s-famine-metropolis-3', /this crossroads/, /^the slow accretion/, /important river ford/], // the worklist's 09374 town, under a famine
    ['r2r-metropolis-11', /this crossroads/, /^the slow accretion/, /riverside mill settlement/], // the smallest it reached (16,770)
    ['r2r-metropolis-13', /this crossroads/, /^the slow accretion/, /natural harbour that fish seemed to prefer/], // the largest (328,486)
    ['r2s-wartime-metropolis-1', /this crossroads/, /^the slow accretion/, /ferry crossing that became the first bridge/],
    ['r2s-under_siege-metropolis-0', /this crossroads/, /^a great trade house/, /exploit rich mineral deposits/], // re-keyed by identity (TAIL-NARRATIVE-5, N18 (5)): the accretion was not founded at a stroke; the tier's next founder
    ['r2r-hamlet-4', /^a small religious community/, /^three or four families/, /exploit the natural harbour/],
    ['r2r-town-52', /^religious authorities/, /^a noble granted lands/, /naval base protecting the coast/],
    ['r2r-city-20', /^a military command/, /^a military command/, /strategic mountain pass/], // no city founder agrees with the mine: FA moves the row
    ['r2s-plague_onset-city-3', /^a military command/, /^a military command/, /strategic mountain pass/],
    ['r2s-monster_pressure-city-3', /^a military command/, /^royal decree/, /riverside mill settlement/],
    ['r2s-mass_migration-village-2', /^escaped serfs/, /^a community of tradespeople/, /waystation for travelers/],
  ]);
  it('the founder and the Origin row agree; the founder that could not be is gone or its row moved (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([seed, refused, founder, row]) => {
      const f = born(seed).history?.founding || {};
      expect(String(f.foundedBy), `${seed}: the founder now`).toMatch(founder);
      // anchored: the line above asserts this same foundedBy prints the founder now
      if (refused.source !== founder.source) expect(String(f.foundedBy), `${seed}: the refused founder`).not.toMatch(refused);
      expect(String(f.reason), `${seed}: the Origin row now`).toMatch(row);
      expect(founderAgrees(f.reason ?? null, String(f.foundedBy)), `${seed}: the pair agrees`).toBe(true);
    }), 'the founder and the Origin row agree');
  });
  it('the pair read tonight (escaped serfs beside a coastal trading port) is refused by the table', () => {
    expect(founderAgrees('was founded as a coastal trading port', 'escaped serfs seeking a place beyond the reach of their former masters')).toBe(false);
    expect(founderAgrees('was founded as a coastal trading port', 'a group of settlers seeking new opportunities')).toBe(true);
  });
  const KEEP = /** @type {Array<[string, RegExp, RegExp]>} */ ([
    ['r2s-religious_conversion-metropolis-0', /this crossroads/, /intersection of two major trade routes/],
    ['r2s-occupied-metropolis-2', /this crossroads/, /market metropolis where merchants could meet/],
    ['r2r-village-50', /^escaped serfs/, /mining camp that became permanent/],
  ]);
  it('a founder beside a row it agrees with still prints (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, founder, row]) => {
      const f = born(seed).history?.founding || {};
      expect(String(f.foundedBy), `${seed}: the founder`).toMatch(founder);
      expect(String(f.reason), `${seed}: the row`).toMatch(row);
    }), 'a founder beside a row it agrees with still prints');
  });
});

/**
 * BATCH 6 — the chair's ruling (N18): WHAT THE BAR'S READERS MET in this group's files (TAIL-NARRATIVE-5). (1) The
 * wartime arrival line whose coin moves needs a prosperity not below moderate; a poorer town takes its declared twin,
 * reached only by resolution (`STRESS_DESCS.wartime`). (2) A founding note claims nothing of why or by whom the place was
 * founded where the record's founder or Origin row may deny it (`STRESS_NOTES` occupied, infiltrated, mass migration,
 * famine, the siege's walls; the departures set alike). (5) The slow accretion of three settlements is not founded at a
 * stroke: beside an Origin row founded or established it resolves draw-free onward to its tier's next founder (FB's table).
 */
describe('B7 the notes, the wartime arrival and the accretion read the founding and the purse (TAIL-NARRATIVE-5, N18)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** [id, seed, where, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, string, 'note'|'arrival', RegExp, RegExp]>} */ ([
    ['occ[1]', 'r2s-occupied-thorp-1', 'note', /far from other people's rule/, /^Nobody here chose the people who rule it now/], // siblings beside a mountain pass
    ['occ[1]', 'r2s-occupied-town-2', 'note', /far from other people's rule/, /^Nobody here chose the people who rule it now/], // merchants
    ['occ[0]', 'r2s-occupied-city-0', 'note', /The founders governed themselves/, /^The settlement's own rulers used to give the orders/], // royal decree
    ['occ[2]', 'r2s-occupied-metropolis-0', 'note', /The founders assumed/, /always made its own decisions, or believed it did/], // imperial decree
    ['inf[0]', 'r2s-infiltrated-town-0', 'note', /The founders all knew each other/, /^The settlement has always trusted familiar faces/], // a merchant consortium
    ['inf[2]', 'r2s-infiltrated-city-1', 'note', /founding families could name/, /^The settlement still believes it knows who lives inside its walls/], // a merchant coalition
    ['mm[0]', 'r2s-mass_migration-metropolis-1', 'note', /few families who knew each other/, /^The settlement was never built for this many/], // imperial decree
    ['mm[1]', 'r2r-city-3', 'note', /families that founded it/, /laid out for the people it used to hold/], // a military command
    ['mm[2]', 'r2s-mass_migration-city-1', 'note', /The founders knew every name/, /^The settlement once knew the faces inside its walls/], // royal decree
    ['fam[0]', 'r2s-famine-village-1', 'note', /settlers chose this land/, /^This place has fed its people well enough in other years/], // a noble's grant
    ['fam[1]', 'r2s-famine-town-2', 'note', /fed the founders/, /^Whatever fed the settlement in other years has failed it/], // a coastal trading port
    ['fam[2]', 'r2s-famine-hamlet-2', 'note', /drew the first families/, /^The country around the settlement looks the same as ever/], // a coastal trading port
    ['siege[2]', 'r2s-under_siege-city-3', 'note', /The founders built walls/, /^These walls were built in case they were ever needed/], // royal decree
    ['war-desc', 'r2s-wartime-village-3', 'arrival', /the coin is moving/, /busy in a way that feels wrong for a place this poor/], // struggling
  ]);
  it('the flagged line no longer prints, and the slot says what the record bears (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([id, seed, where, gone, instead]) => {
      const text = READ5[where](born(seed));
      expect(text, `${id} ${seed}: what prints instead`).toMatch(instead);
      // anchored: the line above asserts this same text prints what stands instead
      expect(text, `${id} ${seed}: the flagged line`).not.toMatch(gone);
    }), 'the batch-6 lines claim no founding and no purse the record lacks');
  });
  /** [seed, the Origin row now (the drawn row at a stroke, kept; or, where no founder of the tier agrees, FA's move)] */
  const STROKE = /** @type {Array<[string, RegExp]>} */ ([
    ['r2r-metropolis-10', /^grew from a fishing village into a maritime hub/], // drew the coastal trading port; no metropolis founder agrees here, so FA moves the row
    ['r2s-occupied-metropolis-3', /market metropolis where merchants could meet/],
    ['r2r-metropolis-12', /waystation for travelers/], ['r2r-metropolis-46', /local stone cuts cleanly/],
    ['r2r-metropolis-52', /exploit the natural harbour/], ['r2s-famine-metropolis-2', /river became navigable/],
  ]);
  it('the accretion never stands beside a row founded at a stroke; the founder or the row resolves and the pair agrees (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(STROKE, ([seed, row]) => {
      const f = born(seed).history?.founding || {};
      expect(String(f.reason), `${seed}: the Origin row now`).toMatch(row);
      // anchored: the line above asserts this same reason prints the Origin row now
      if (/slow accretion/.test(String(f.foundedBy))) expect(String(f.reason), `${seed}: the accretion beside a row at a stroke`).not.toMatch(/^(was founded|was established)/);
      expect(founderAgrees(f.reason ?? null, String(f.foundedBy)), `${seed}: the pair agrees`).toBe(true);
    }), 'the accretion beside no row founded at a stroke');
  });
  /** [seed, where, a true sibling that must still print] */
  const KEEP = /** @type {Array<[string, 'note'|'arrival'|'founder', RegExp]>} */ ([
    ['r2s-wartime-metropolis-1', 'arrival', /is busy in a way that feels wrong\. The forge fires burn past dark, the coin is moving/], // prosperous
    ['r2r-metropolis-11', 'founder', /^the slow accretion/], // beside "began as a riverside mill settlement"
    ['r2r-metropolis-44', 'founder', /^the slow accretion/], // beside "grew from a logging camp"
    ['r2s-famine-metropolis-1', 'founder', /^the slow accretion/], // beside "started as a seasonal camp"
  ]);
  it('the true siblings still print (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, where, kept]) => {
      const s = born(seed);
      expect(where === 'founder' ? String(s.history?.founding?.foundedBy) : READ5[where](s), seed).toMatch(kept);
    }), 'the true siblings still print');
  });
});
