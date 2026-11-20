/**
 * TAIL-HISTORY-3 batch 3 (2026-11-15; the chair's ruling Y13, Y5 widened to every tension type): a current tension whose
 * own event is not on the town's timeline narrated that event in the past tense (a crime wave that "overwhelmed the
 * authorities" and the vigilantes who "began to form", rival guilds that "fought", a leader who "died or left", a debt the
 * settlement "owed") in a town whose past holds none of it (thirteen types; 626 tensions in the census's 720). Such a
 * tension now takes its template's `byMemory.unanchored` words (historyGenerator.js :: tensionByMemory): a live quarrel,
 * present tense, under the type's own label; the slot keeps its draw. A description the selection wrote for the town
 * (the scarcity's lead and its top issue) is kept: the twin replaces only the template's own words.
 *
 * THIS FILE REDS WHEN such a tension prints its event's past again (the smallest and the largest census town of each
 * type), when the scarcity's own lead is overwritten, or when a tension whose own event IS on the timeline loses its
 * own words (each KEEP).
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
 * Per type: the template's own past-tense words (they must NOT print in an unanchored tension), and a
 * phrase of the live quarrel that prints instead (and never in a KEEP). The table is the test's own, so it reds on a base that has no twin.
 * @type {Record<string, { past: RegExp, live: RegExp }>}
 */
const WORDS = {
  crime_wave: { past: /overwhelmed the authorities|vigilantes began to form|"Vigilantes"|The vigilantes have begun/, live: /Crime is rising faster than those in charge can answer it/ },
  resource_scarcity: { past: /became scarce, causing hoarding|Price regulators/, live: /A critical resource is running short/ },
  guild_conflict: { past: /Rival guilds fought|Established guilds|Upstart guilds|sabotaging both guilds/, live: /Guild and non-guild traders are fighting/ },
  legitimacy_crisis: { past: /was openly and widely questioned, and no one could agree/, live: /is openly and widely questioned, and no one can agree/ },
  outside_debt: { past: /settlement owed a significant debt|was preparing to collect|profited and escaped/, live: /owes a heavy debt to an outside power/ },
  external_threat: { past: /approaching danger divided the community/, live: /approaching danger divides the community/ },
  leadership_vacuum: { past: /The last strong leader died or left|The departed leader left|Multiple weak claimants/, live: /No one holds a firm grip on the leadership/ },
  succession_crisis: { past: /The ruler of the time was aging or ill|heirs jockeyed for position/, live: /Who will lead next is the quarrel of the day/ },
  magical_controversy: { past: /regulation of magic divided the community/, live: /regulation of magic divides the community/ },
  trade_dispute: { past: /soured into something that touched|Merchants tied to the old partner/, live: /is souring, and it touches every merchant/ },
  population_friction: { past: /population fell into sustained/, live: /are locked in sustained, low-level conflict/ },
  religious_tension: { past: /interpretations competed for influence/, live: /interpretations compete for influence/ },
  infiltration_fear: { past: /caused suspicion and denunciations/, live: /are stirring suspicion and denunciations/ },
};

/** [seed, type]: the smallest and the largest census town holding the type's tension with no event of it on the timeline */
const UNANCHORED = [
  ['r2r-thorp-16', 'crime_wave'], ['r2r-metropolis-8', 'crime_wave'],
  ['r2r-thorp-59', 'resource_scarcity'], ['r2r-metropolis-6', 'resource_scarcity'],
  ['r2r-town-43', 'guild_conflict'], ['r2s-occupied-metropolis-3', 'guild_conflict'],
  ['r2s-insurgency-thorp-2', 'legitimacy_crisis'], ['r2s-slave_revolt-metropolis-2', 'legitimacy_crisis'],
  ['r2s-indebted-thorp-2', 'outside_debt'], ['r2s-indebted-metropolis-1', 'outside_debt'],
  ['r2r-thorp-10', 'external_threat'], ['r2s-occupied-metropolis-3', 'external_threat'],
  ['r2s-politically_fractured-thorp-0', 'leadership_vacuum'], ['r2s-politically_fractured-metropolis-2', 'leadership_vacuum'],
  ['r2s-succession_void-thorp-3', 'succession_crisis'], ['r2r-metropolis-6', 'succession_crisis'],
  ['r2r-thorp-0', 'magical_controversy'], ['r2r-city-16', 'magical_controversy'],
  ['r2r-village-11', 'trade_dispute'], ['r2r-metropolis-13', 'trade_dispute'],
  ['r2r-thorp-42', 'population_friction'], ['r2s-plague_onset-city-1', 'population_friction'],
  ['r2s-infiltrated-thorp-3', 'religious_tension'], ['r2r-city-24', 'religious_tension'],
  ['r2r-thorp-12', 'infiltration_fear'], ['r2s-under_siege-city-1', 'infiltration_fear'],
];
/** [seed, type]: a census town holding the type's tension WITH its own event on the timeline */
const KEEP = [['r2r-thorp-57', 'resource_scarcity'], ['r2r-town-16', 'guild_conflict'], ['r2r-hamlet-23', 'outside_debt'], ['r2r-thorp-16', 'external_threat'], ['r2r-town-30', 'leadership_vacuum'], ['r2r-village-9', 'succession_crisis'], ['r2r-hamlet-1', 'magical_controversy'], ['r2r-thorp-13', 'population_friction'], ['r2r-hamlet-55', 'religious_tension'], ['r2r-thorp-36', 'infiltration_fear']];

/** @param {any} town @param {string} type */
const tensionOf = (town, type) => (town.history?.currentTensions || []).find((/** @type {any} */ t) => t.type === type);
/** @param {any} t */
const wordsOf = (t) => JSON.stringify([t.description, t.factions, t.plotHooks]);
/** @param {any} town @param {string} type */
const ownOnTimeline = (town, type) => (town.history?.historicalEvents || []).some((/** @type {any} */ e) => e.templateType === type);

describe('TAIL-HISTORY batch 3 (Y13): every tension type with no event of its own on the timeline is told as a live quarrel', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('the twenty-six: no past of an event the timeline does not hold; the live quarrel prints instead', () => {
    expectNoSeedFailures(collectSeedFailures(UNANCHORED.map(([seed, type]) => `${seed}|${type}`), (key) => {
      const [seed, type] = key.split('|');
      const town = bornCensus(seed);
      expect(ownOnTimeline(town, type), `${seed}: no ${type} on the timeline`).toBe(false);
      const t = tensionOf(town, type);
      expect(Boolean(t), `${seed} holds its ${type} tension (the draw is kept)`).toBe(true);
      expect(wordsOf(t), `${key}: its words carry the live quarrel`).toMatch(WORDS[type].live);
      // anchored: the same words are shown directly above to carry the live quarrel
      expect(wordsOf(t), key).not.toMatch(WORDS[type].past);
      expect(t.description, key).toMatch(WORDS[type].live);
      expect(t.factions.length, `${key}: its parties (two where the names fold together, as at the base)`).toBeGreaterThanOrEqual(2);
    }), 'the unanchored tensions tell a live quarrel');
  }, 900_000);

  test('KEEP: the scarcity a selection wrote for the town keeps its own lead (r2r-thorp-16: the levy)', () => {
    const t = tensionOf(bornCensus('r2r-thorp-16'), 'resource_scarcity');
    expect(t.description).toMatch(/^The levy has taken workers from the fields/);
  }, 300_000);

  test('KEEP: a tension whose own event is on the timeline keeps its own words', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map(([seed, type]) => `${seed}|${type}`), (key) => {
      const [seed, type] = key.split('|');
      const town = bornCensus(seed);
      expect(ownOnTimeline(town, type), `${seed}: its ${type} is on the timeline`).toBe(true);
      const t = tensionOf(town, type);
      expect(Boolean(t), `${seed} holds its ${type} tension`).toBe(true);
      // its own words: the template's or, where its past event printed them, an authored variant (apartFromOwnEvent)
      expect(wordsOf(t), `${key}: its words open on a printed description`).toMatch(/^\["[A-Z]/);
      // anchored: the same words are shown directly above to open on a printed description (not null, not empty)
      expect(wordsOf(t), key).not.toMatch(WORDS[type].live);
    }), 'the anchored tensions keep their event');
  }, 600_000);
});
