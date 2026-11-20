/**
 * TAIL-HISTORY batch 2 (2026-11-15; the chair's ruling Y5, READ-ALL's aftermath shape): a current tension whose own event
 * is not on the town's timeline printed the event's aftermath (a plague pit, the rebuilding after the fire, the rebels
 * who rose, the tyrant's records) in a town whose past holds no such event (135 tensions in the census's 720). Such a
 * tension now takes its template's `byMemory.unanchored` words (historyGenerator.js :: tensionByMemory): a live quarrel,
 * present tense, under the type's own label. The slot keeps its draw.
 *
 * THIS FILE REDS WHEN such a tension prints its event's aftermath again (the smallest and the largest census town of each
 * type), or when a tension whose own event IS on the timeline loses its own words (each KEEP).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};

/**
 * Per type: the template's own aftermath words (they must NOT print in an unanchored tension, and must in a KEEP), and a
 * phrase of the live quarrel that prints instead. The table is the test's own, so it reds on a base that has no twin.
 * @type {Record<string, { aftermath: RegExp, live: RegExp }>}
 */
const WORDS = {
  plague_years: { aftermath: /moved through the settlement|plague pit|Quarantine hardliners|The bereaved and the blamed|survivors remember/, live: /Fear of sickness runs through the settlement/ },
  great_fire: { aftermath: /consumed .* across whole districts|Rebuilders and profiteers|seeking someone to blame|Rebuilding uncovered|The fire spared/, live: /Fire is the settlement's standing fear/ },
  great_flood: { aftermath: /Waters rose with little warning|Displaced families|Those who profited from the redrawing|washed away/, live: /Rising water is the settlement's standing fear/ },
  popular_uprising: { aftermath: /rose against the ruling powers|Former rebels|The restored order|informed on the rebels|The uprising was funded/, live: /The common people are pressing those in charge/ },
  tyranny: { aftermath: /seized power through|Old loyalists|Those who suffered under the regime|The tyrant's private records|confiscated was never returned/, live: /Whether one person is taking more power than anyone granted/ },
  wild_magic: { aftermath: /left its mark on|The changed and their descendants|Scholars studying the residue|The surge was no accident|touched by the surge/, live: /Strange flares of magic come without warning/ },
  trade_collapse: { aftermath: /failed, and the wealth it once carried drained away|Displaced traders|profited from the diversion|swears the collapse was arranged/, live: /Whether the trade the settlement lives on is about to fail/ },
  market_crash: { aftermath: /collapsed almost overnight|Ruined speculators|Those who sold in time|survived the crash/, live: /Talk of a coming crash in/ },
  heresy_trial: { aftermath: /split the faithful and drew in|convicted the heretic|seized during the trial|condemned doctrine/, live: /An accusation of heresy against a prominent figure is splitting the faithful/ },
  pilgrimage_surge: { aftermath: /drew pilgrims in numbers|Temple beneficiaries|Overwhelmed old residents|The pilgrim trade made/, live: /A claimed miracle is splitting the settlement/ },
};

/** [seed, type]: the smallest and the largest census town holding the type's tension with no event of it on the timeline */
const UNANCHORED = [
  ['r2r-thorp-4', 'plague_years'], ['r2s-slave_revolt-metropolis-1', 'plague_years'],
  ['r2r-thorp-9', 'great_fire'], ['r2s-infiltrated-metropolis-3', 'great_fire'],
  ['r2r-thorp-15', 'great_flood'], ['r2s-famine-metropolis-2', 'great_flood'],
  ['r2r-thorp-23', 'popular_uprising'], ['r2s-insurgency-metropolis-1', 'popular_uprising'],
  ['r2r-thorp-20', 'tyranny'], ['r2s-succession_void-metropolis-2', 'tyranny'],
  ['r2s-occupied-thorp-0', 'wild_magic'], ['r2s-under_siege-city-1', 'wild_magic'],
  ['r2r-thorp-26', 'trade_collapse'], ['r2s-slave_revolt-metropolis-0', 'trade_collapse'],
  ['r2r-town-16', 'market_crash'], ['r2s-infiltrated-city-2', 'market_crash'],
  ['r2s-occupied-thorp-2', 'heresy_trial'], ['r2s-religious_conversion-city-2', 'heresy_trial'],
  ['r2r-hamlet-6', 'pilgrimage_surge'], ['r2s-monster_pressure-metropolis-1', 'pilgrimage_surge'],
];
/** [seed, type]: a census town holding the type's tension WITH its own event on the timeline (within living memory) */
const KEEP = [['r2r-thorp-7', 'plague_years'], ['r2r-city-52', 'great_fire'], ['r2s-infiltrated-village-0', 'tyranny'], ['r2s-under_siege-city-3', 'wild_magic'], ['r2s-famine-village-1', 'pilgrimage_surge']];

/** @param {any} town @param {string} type */
const tensionOf = (town, type) => (town.history?.currentTensions || []).find((/** @type {any} */ t) => t.type === type);
/** @param {any} t */
const wordsOf = (t) => JSON.stringify([t.description, t.factions, t.plotHooks]);

describe('TAIL-HISTORY batch 2 (Y5): a tension with no event of its own on the timeline is told as a live quarrel', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('the twenty: no aftermath of an event the timeline does not hold; the live quarrel prints instead', () => {
    expectNoSeedFailures(collectSeedFailures(UNANCHORED.map(([seed, type]) => `${seed}|${type}`), (key) => {
      const [seed, type] = key.split('|');
      const town = bornCensus(seed);
      expect((town.history?.historicalEvents || []).some((/** @type {any} */ e) => e.templateType === type), `${seed}: no ${type} on the timeline`).toBe(false);
      const t = tensionOf(town, type);
      expect(Boolean(t), `${seed} holds its ${type} tension (the draw is kept)`).toBe(true);
      expect(wordsOf(t), `${key}: its words carry the live quarrel`).toMatch(WORDS[type].live);
      // anchored: the same words are shown directly above to carry the live quarrel
      expect(wordsOf(t), key).not.toMatch(WORDS[type].aftermath);
      expect(t.description, key).toMatch(WORDS[type].live);
      expect(t.factions.length, `${key}: three parties`).toBe(3);
    }), 'the unanchored tensions tell a live quarrel');
  }, 900_000);

  test('KEEP: a tension whose own event is on the timeline keeps its own words', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map(([seed, type]) => `${seed}|${type}`), (key) => {
      const [seed, type] = key.split('|');
      const t = tensionOf(bornCensus(seed), type);
      expect(Boolean(t), `${seed} holds its ${type} tension`).toBe(true);
      expect(wordsOf(t), key).toMatch(WORDS[type].aftermath);
      expect(t.description, `${key}: the tension prints its description`).toMatch(/^[A-Z]/);
      // anchored: the same description is shown directly above to print (a sentence, not an empty string)
      expect(t.description, key).not.toMatch(WORDS[type].live);
    }), 'the anchored tensions keep their event');
  }, 300_000);
});
