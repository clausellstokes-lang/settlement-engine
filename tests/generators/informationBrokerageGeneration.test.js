/**
 * informationBrokerageGeneration.test.js — [W-I INFORMATION BROKERAGES] I1, the
 * generation half (docs/DESIGN_INFORMATION_BROKERAGES.md §3, §0b).
 *
 * The catalog half (tests/data/informationBrokerageCatalog.test.js) proves the DATA is
 * shaped right. This file proves the four entries are actually LIVE in the pipeline: that
 * each one generates inside its tier band, that none of them ever appears below it, that
 * the route gate genuinely suppresses the licensed house where nothing arrives, that the
 * existing subsumption pass collapses each guild form's minor form, and that the declared
 * capability keys survive generation and a JSON round trip into persisted state.
 *
 * SEED FAMILY, NOT A SINGLE SEED. Every restriction claim below is evaluated over a whole
 * corpus through collectSeedFailures, so a red reports the true count rather than the
 * first casualty. A single-seed restriction pin proves nothing about a probabilistic
 * catalog.
 *
 * WHAT IS DELIBERATELY NOT PINNED HERE. I1 is inert catalog data. The design's Rookery
 * precondition ("requires a criminal-organization power present") and its rumour-source
 * presence weighting are POWER-STRUCTURE reads, and assembleInstitutions walks the catalog
 * BEFORE generatePower runs, so neither can be a catalog field. Both ship as authored
 * predicates in data/informationBrokerageTuning.js and are pinned there; wiring them into
 * the roster belongs to the slice that owns patron binding. Asserting a roster rule that
 * the engine does not yet enforce would be a pin that lies.
 */
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { applySubsumption } from '../../src/generators/steps/subsumptionPass.js';
import {
  brokerageServiceKeys,
  brokerageFormOf,
  brokerageLegalityOf,
  isInformationBrokerage,
  rumorSourceCensus,
  RUMOR_SOURCE_INSTITUTIONS,
} from '../../src/data/informationBrokerageTuning.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const LISTENING_POST = 'Listening post';
const EXCHANGE = "Chroniclers' exchange";
const ROOKERY = 'Rookery';
const WHISPER_MARKET = 'Whisper market';
const ALL_FOUR = Object.freeze([LISTENING_POST, EXCHANGE, ROOKERY, WHISPER_MARKET]);

/** 40 seeds: enough that each entry's authored band chance lands several times, so a
 *  reachability pin measures reachability rather than luck. */
const SEEDS = Object.freeze(Array.from({ length: 40 }, (_, i) => `ib-i1-${i}`));
/** Absence is a much stronger per-world signal than presence, so the below-band sweep
 *  needs fewer worlds to be conclusive. */
const BELOW_BAND_SEEDS = Object.freeze(SEEDS.slice(0, 12));

const BASE = Object.freeze({
  culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized',
});

/** Generate one settlement and return its native institution roster. */
function rosterFor(config, seed) {
  const world = generateSettlementPipeline({ ...config, _seed: seed });
  return (world.institutions || []).map((institution) => institution.name);
}

/** Corpora are built once and shared: the pipeline is the expensive part, not the pins. */
function corpus(config, seeds = SEEDS) {
  return seeds.map((seed) => ({ seed, roster: rosterFor(config, seed) }));
}

const TOWN_ROAD = corpus({ ...BASE, settType: 'town' });
const CITY_ROAD = corpus({ ...BASE, settType: 'city' });
const METROPOLIS_ROAD = corpus({ ...BASE, settType: 'metropolis' });
const TOWN_ISOLATED = corpus({ ...BASE, settType: 'town', terrainOverride: 'forest', tradeRouteAccess: 'isolated' });

/** How many worlds in a corpus carry `name`. */
const countIn = (rows, name) => rows.filter((row) => row.roster.includes(name)).length;

describe('[W-I I1] the four houses generate inside their tier bands', () => {
  it('the minor forms reach town rosters, and the guild forms do not', () => {
    expect(countIn(TOWN_ROAD, LISTENING_POST), 'Listening post never generated at town').toBeGreaterThan(0);
    expect(countIn(TOWN_ROAD, ROOKERY), 'Rookery never generated at town').toBeGreaterThan(0);
    const failures = collectSeedFailures(TOWN_ROAD, ({ roster }) => {
      // Anchored by a sibling drawn from the SAME roster: a world that generated nothing
      // reds on the anchor rather than passing these exclusions for free.
      expectAbsentWithAnchor(roster, EXCHANGE, roster[0], 'guild form below its band');
      expectAbsentWithAnchor(roster, WHISPER_MARKET, roster[0], 'covert guild below its band');
    });
    expectNoSeedFailures(failures, 'no town roster carries a city-band guild form');
  });

  it('all four reach city rosters', () => {
    for (const name of ALL_FOUR) {
      expect(countIn(CITY_ROAD, name), `${name} never generated at city`).toBeGreaterThan(0);
    }
  });

  it('all four reach metropolis rosters through the city catalog merge', () => {
    for (const name of ALL_FOUR) {
      expect(countIn(METROPOLIS_ROAD, name), `${name} never generated at metropolis`).toBeGreaterThan(0);
    }
  });

  it('NONE of the four ever appears below the town band', () => {
    const rows = ['thorp', 'hamlet', 'village'].flatMap((settType) => corpus(
      { ...BASE, settType }, BELOW_BAND_SEEDS,
    ).map((row) => ({ ...row, settType })));
    const failures = collectSeedFailures(rows, ({ roster, settType }) => {
      for (const name of ALL_FOUR) {
        expectAbsentWithAnchor(roster, name, roster[0], `${name} at ${settType}`);
      }
    });
    expectNoSeedFailures(failures, 'no sub-town settlement carries an information brokerage');
  });
});

describe('[W-I I1] information follows roads (the licensed pair is route-gated)', () => {
  it('an isolated town never seats a Listening post, while a road town does', () => {
    // The positive half IS the anchor for the negative half: the same entry, the same
    // tier, the same config family, differing only in the route. Without it, "absent on
    // isolated" would also be true if the entry had been deleted outright.
    expect(countIn(TOWN_ROAD, LISTENING_POST), 'the road corpus must produce the entry').toBeGreaterThan(0);
    const failures = collectSeedFailures(TOWN_ISOLATED, ({ roster }) => {
      expectAbsentWithAnchor(roster, LISTENING_POST, roster[0], 'listening post on an isolated route');
    });
    expectNoSeedFailures(failures, 'no isolated town seats a licensed information house');
  });

  it('the covert loft is NOT route-gated: it still appears where nothing arrives', () => {
    // The illegal family's precondition is a criminal power, not a road. If someone ever
    // copies the route gate onto it, this reds.
    expect(countIn(TOWN_ISOLATED, ROOKERY), 'Rookery never generated on an isolated town').toBeGreaterThan(0);
  });
});

describe('[W-I I1] each guild form subsumes its minor form (the existing pass)', () => {
  const instance = (name, extra = {}) => ({ name, category: 'Economy', source: 'generated', ...extra });

  it('the licensed guild absorbs the licensed house through applySubsumption', () => {
    const roster = [instance('Blacksmith'), instance(LISTENING_POST), instance(EXCHANGE)];
    const before = roster.map((i) => i.name);
    applySubsumption(roster);
    const after = roster.map((i) => i.name);
    expectPresentThenAbsent(before, after, LISTENING_POST, 'exchange subsumes post');
    expect(after).toContain(EXCHANGE);
    expect(after).toContain('Blacksmith');
  });

  it('the covert guild absorbs the covert loft through applySubsumption', () => {
    const roster = [instance('Blacksmith'), instance(ROOKERY, { category: 'Criminal' }), instance(WHISPER_MARKET, { category: 'Criminal' })];
    const before = roster.map((i) => i.name);
    applySubsumption(roster);
    const after = roster.map((i) => i.name);
    expectPresentThenAbsent(before, after, ROOKERY, 'market subsumes rookery');
    expect(after).toContain(WHISPER_MARKET);
    expect(after).toContain('Blacksmith');
  });

  it('the two families do not cross-absorb', () => {
    const roster = [instance(LISTENING_POST), instance(WHISPER_MARKET, { category: 'Criminal' })];
    applySubsumption(roster);
    expect(roster.map((i) => i.name).sort()).toEqual([LISTENING_POST, WHISPER_MARKET].sort());
    const other = [instance(ROOKERY, { category: 'Criminal' }), instance(EXCHANGE)];
    applySubsumption(other);
    expect(other.map((i) => i.name).sort()).toEqual([EXCHANGE, ROOKERY].sort());
  });

  it('no real city or metropolis roster ever carries both members of a pair', () => {
    const rows = [...CITY_ROAD, ...METROPOLIS_ROAD];
    // Liveness first: the guild forms genuinely land in this corpus, so the co-occurrence
    // exclusion below is measuring collapse rather than a catalog that never fired.
    expect(countIn(rows, EXCHANGE)).toBeGreaterThan(0);
    expect(countIn(rows, WHISPER_MARKET)).toBeGreaterThan(0);
    const failures = collectSeedFailures(rows, ({ roster }) => {
      if (roster.includes(EXCHANGE)) {
        expectAbsentWithAnchor(roster, LISTENING_POST, EXCHANGE, 'post survived its guild');
      }
      if (roster.includes(WHISPER_MARKET)) {
        expectAbsentWithAnchor(roster, ROOKERY, WHISPER_MARKET, 'loft survived its guild');
      }
    });
    expectNoSeedFailures(failures, 'a guild form never stands beside the house it subsumes');
  });
});

describe('[W-I I1] declared capability survives generation and persistence', () => {
  /** The first generated instance of `name` across a corpus, as the pipeline emitted it. */
  function instanceOf(config, name) {
    for (const seed of SEEDS) {
      const world = generateSettlementPipeline({ ...config, _seed: seed });
      const found = (world.institutions || []).find((institution) => institution.name === name);
      if (found) return { world, found };
    }
    return { world: null, found: null };
  }

  it('a generated brokerage carries its closed service keys, and they survive a JSON round trip', () => {
    const failures = collectSeedFailures(ALL_FOUR, (name) => {
      const { world, found } = instanceOf({ ...BASE, settType: 'metropolis' }, name);
      expect(found, `${name} never generated in the metropolis corpus`).toBeTruthy();
      expect(isInformationBrokerage(found), name).toBe(true);
      expect(brokerageServiceKeys(found).length, name).toBeGreaterThanOrEqual(2);

      const revived = JSON.parse(JSON.stringify(world));
      const persisted = revived.institutions.find((institution) => institution.name === name);
      expect(persisted, `${name} did not survive the JSON round trip`).toBeTruthy();
      expect(brokerageServiceKeys(persisted), name).toEqual(brokerageServiceKeys(found));
      expect(brokerageFormOf(persisted), name).toBe(brokerageFormOf(found));
      expect(brokerageLegalityOf(persisted), name).toBe(brokerageLegalityOf(found));
    });
    expectNoSeedFailures(failures, 'every brokerage keeps its capability keys through persistence');
  });

  it('ordinary institutions never read as brokerages (whole-roster control)', () => {
    // Derived from a real roster rather than a named literal: an upgrade-chain collapse
    // can rename any particular control ('Blacksmith' becomes 'Blacksmiths (3-10)' at
    // city), and a control that silently stops generating is a control that proves
    // nothing. Every non-brokerage on the roster has to answer false.
    const world = generateSettlementPipeline({ ...BASE, settType: 'city', _seed: SEEDS[0] });
    const ordinary = (world.institutions || []).filter((institution) => !ALL_FOUR.includes(institution.name));
    expect(ordinary.length, 'the control roster must be populated').toBeGreaterThan(5);
    const failures = collectSeedFailures(ordinary, (institution) => {
      expect(isInformationBrokerage(institution), institution.name).toBe(false);
      expect(brokerageFormOf(institution), institution.name).toBeNull();
    });
    expectNoSeedFailures(failures, 'no ordinary institution declares a brokerage capability');
  });
});

describe('[W-I I1] the rumour-source census over real rosters (design §0b)', () => {
  it('finds talk houses in city rosters and reports only tagged names', () => {
    const failures = collectSeedFailures(CITY_ROAD, ({ roster }) => {
      const census = rumorSourceCensus(roster);
      expect(census.total).toBeGreaterThan(0);
      for (const source of census.sources) {
        expect(roster, 'a censused source must be on the roster it came from').toContain(source);
        expect(Object.prototype.hasOwnProperty.call(RUMOR_SOURCE_INSTITUTIONS, source), source).toBe(true);
      }
      expect(Object.values(census.byLane).reduce((a, b) => a + b, 0)).toBe(census.total);
    });
    expectNoSeedFailures(failures, 'every city roster censuses its rumour sources consistently');
  });

  it('a brokerage on the roster is never counted as a rumour source (the roles stay distinct)', () => {
    const rows = [...CITY_ROAD, ...METROPOLIS_ROAD].filter(
      ({ roster }) => ALL_FOUR.some((name) => roster.includes(name)),
    );
    expect(rows.length, 'no corpus world carried a brokerage; the exclusion would be vacuous').toBeGreaterThan(0);
    const failures = collectSeedFailures(rows, ({ roster }) => {
      const census = rumorSourceCensus(roster);
      const present = ALL_FOUR.filter((name) => roster.includes(name));
      for (const name of present) {
        // Anchored by the census's own first source: the roster demonstrably contains
        // tagged talk houses, so the brokerage's absence from `sources` is a role
        // distinction rather than an empty census.
        expectAbsentWithAnchor(census.sources, name, census.sources[0], `${name} counted as a rumour source`);
      }
    });
    expectNoSeedFailures(failures, 'no brokerage is ever censused as a rumour source');
  });
});
