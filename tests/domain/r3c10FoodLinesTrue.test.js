/**
 * A LINE THAT NAMES WHERE THE FOOD COMES FROM READS THE FOOD RECORD (R3-CODE-C-10; the chair's rulings in
 * docs/chair/2026-11-14/briefs/BRIEF-R3-CODE-C-10.md on the chair's lane, vetoable by the owner; the ninth seat's
 * FOR THE JOIN 4, 5 and 7 in docs/chair/2026-11-13/R3-CODE-C-HANDBACK.md).
 *
 * (a) THE HERDING LINE · "herding" is a livestock word (domain/foodways.js :: SOURCE_WORDS.livestock): the culture's
 *   sentence "Herding and mixed farming produce a strongly seasonal food calendar." is drawn into the foodways line only
 *   where the food record holds a herd. r2r-city-1 (a city of 13,260 fed by its grain alone): "Most meals start from the
 *   field grain. Herding and mixed farming produce a strongly seasonal food calendar." (124 of the 1,722 births).
 *
 * (b) THE FISHED-OUT WATER · a foodways line names no catch from a water the record calls depleted
 *   (`resourceAnalysis.resourceConditions`: the fishing grounds or the river fishery `depleted`, the fact the Economy tab
 *   prints beside it, "there is nothing left worth taking"; the economy's chains carry the same condition, and the reader
 *   reads them): where every fish water the town has is fished out, the one reader (domain/foodways.js ::
 *   foodwaysLineOf) takes the catch out as it takes out a source a famine failed, on every surface and the identity record.
 *   r2r-metropolis-6 (216,641, its river fishery depleted): "Most meals start from the day's catch." (98 of 1,722).
 *   Whether such a water still feeds the town is the food home's arithmetic (generators/foodLand.js), not moved here.
 *
 * (c) THE FAMINE LINE'S HALF · crisisSummaryForSurface (domain/crisis/crisisSummaryVantage.js) takes an OPTIONAL fourth
 *   argument, the record's facts; for a famine, where the facts hold no grain (the vocabulary's `grain` atom, read by
 *   `atomHolds`), the Tonight official line and the Overview official line print the no-grain twin in the Crisis tab's
 *   own words (generators/stressNarrative.js :: RENDERERS.famine, the r2-code-b lane's): "{name} has gone short of food
 *   for a second season. ..." in place of "{name} has lost a second harvest. ...", and "{name} has gone short of food,
 *   and its leaders are rationing ..." in place of "The harvest in {name} has failed, and its leaders are rationing
 *   ...". With no facts handed it prints as before (every caller on this lane: the pages do not move). The callers'
 *   half (tonightSheet.js, viewModel.js pass the facts) is the r2-code-b lane's; the two meet at the join.
 *   rr3-metropolis-under_siege+famine-rand-1 (88,895, fed by its fish): "... has lost a second harvest." (55 of the 58
 *   Tonight lines on the 1,722; the Overview's 52 of 54).
 *
 * (d) THE HOUSE BY WHAT IT IS (the chair's message of 2026-11-14, 11:36 UTC) · a line that names a house the town lacks
 *   reads the roster by what the house is, never by one spelling of its name: a partial chain's missing houses
 *   (generators/resourceGenerator.js :: evaluateInstitutionChain; the page's "Work on the timber here stops half-way: no
 *   sawmill or carpenters' guild finishes it.") are those no house of the same kind stands for. rr3-city-infiltrated-
 *   rand-5 (12,842): that line beside 'Sawmill (commercial)' and 'Carpenters (5-15)'.
 *
 * The towns are born as the reader's probes bear them (REVIEW-R3-CODE-C births.mjs :: cfgFor), as the ninth seat's guard
 * (tests/domain/r3c9ReaderLinesTrue.test.js) bears them. Each arm collects first and asserts on the collection, and
 * asserts that it saw the culture whose line it watches (a guard that never meets its line proves nothing).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CULTURE_PROFILES } from '../../src/data/cultureProfiles.js';
import { foodwaysLineOf, sourcesNamedIn } from '../../src/domain/foodways.js';
import { crisisSummaryForSurface } from '../../src/domain/crisis/crisisSummaryVantage.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { atomHolds } from '../../src/domain/facts/factVocabulary.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZES = '(thorp|hamlet|village|town|city|metropolis)';
/** The reader's cfgFor (r2r-, r2s-, rr3-, rr3p-), in effect verbatim. @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZES}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = seed.match(new RegExp(`^rr3p-${SIZES}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (m) {
    const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), monsterThreat: 'plagued', priorityMilitary: 10 + (Number(m[4]) % 3) * 10 });
  }
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^rr3-${SIZES}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
};
/** @param {string} seed */
const bear = (seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });

const FISH_WATERS = ['fishing_grounds', 'river_fish'];
/** @param {any} s the record's fish waters and which of them it calls depleted */
const fishWatersOf = (s) => (s.resourceAnalysis?.resourceConditions || []).filter((/** @type {any} */ c) => FISH_WATERS.includes(c.key));
/** @param {string} line */
const namesCatch = (line) => sourcesNamedIn(line).includes('fish');

const HERDING = /\bherding\b/i;
/** @param {any} s the culture the town's foodways line drew from */
const cultureHerds = (s) => (CULTURE_PROFILES[/** @type {keyof typeof CULTURE_PROFILES} */ (s.config?.cultureProfileKey)]?.foodways || [])
  .some((/** @type {any} */ line) => HERDING.test(typeof line === 'string' ? line : String(line?.text || '')));
/** @param {any} s every copy of the line: the one reader's (every surface), the food record's, the identity record's */
const copiesOf = (s) => [foodwaysLineOf(s) || '', String(s.economicState.foodSecurity.foodRecord.foodwaysLine || ''), String(s.culturalIdentity?.foodways || '')];

/**
 * (a)'s towns, whose culture speaks of herding and whose food record holds no herd: a thorp of 28 under a famine with no
 * source of its own, the smallest (a thorp of 6 whose catch failed), a hamlet on its catch, a village on its mill and
 * game, a village whose grain failed, a city on its grain, a metropolis on its fish.
 */
const NO_HERD_TOWNS = ['r2s-famine-thorp-2', 'rr3p-thorp-famine-rand-0', 'r2r-hamlet-18', 'r2r-village-42', 'r2s-famine-village-0', 'r2r-city-1', 'r2r-metropolis-11'];
/** Towns of the same culture whose record holds a herd: the sentence stands. */
const HERD_TOWNS = ['r2r-thorp-36', 'r2r-village-6'];

/**
 * (b)'s towns, every fish water fished out: a village under siege and famine (its herds failed), a city under siege and
 * famine (its herds failed), the smallest it reaches (a hamlet of 63 on its catch alone), a hamlet, a village on the
 * river, a town on grain and the river, a city on grain, herds and the sea, the largest (a metropolis of 216,641). (The two of the 98 whose fished-out water
 * no chain row works, r2s-plague_onset-thorp-2 and rr3-thorp-monster_pressure-rand-2, are the join's: the reader's
 * callers hand it the economy, not the resource analysis.)
 */
const FISHED_OUT_TOWNS = ['rr3-village-under_siege+famine-rand-3', 'rr3-city-under_siege+famine-rand-0', 'r2s-indebted-hamlet-1', 'r2r-hamlet-10', 'r2r-village-35', 'r2r-town-29', 'r2r-city-14', 'r2r-metropolis-6'];
/** Towns whose fish water stands: the catch is still named, and the line is the record's own. */
const LIVE_WATER_TOWNS = ['r2r-thorp-12', 'r2r-town-15', 'r2r-metropolis-10'];

/**
 * (c)'s towns, each under a famine. Tonight's official line, no grain grown: the smallest (a thorp of 8 on its game, under
 * siege), a thorp of 9 on its catch, a town of 737 with no source of its own, the largest (a metropolis of 88,895 on
 * its fish, under siege). The Overview's: a thorp of 5 under siege, a village of 193 on herds, catch and a mill, the
 * largest (a metropolis of 97,340 on its fish).
 */
const TONIGHT_NO_GRAIN = ['rr3-thorp-under_siege-rand-3', 'rr3-thorp-famine-port-1', 'r2s-famine-town-3', 'rr3-metropolis-under_siege+famine-rand-1'];
const OVERVIEW_NO_GRAIN = ['rr3-thorp-under_siege+famine-rand-2', 'rr3-village-famine-rand-3', 'rr3-metropolis-famine-port-1'];
/** Famines in towns that grow grain: the harvest line stands. */
const TONIGHT_GRAIN = ['rr3-hamlet-under_siege+famine-rand-2', 'rr3-town-famine-rand-0'];
const OVERVIEW_GRAIN = ['r2s-famine-town-1', 'rr3-metropolis-famine-rand-4'];

/** (d)'s towns: a commercial sawmill beside a partial timber chain (the smallest, a town of 1,299; a city; the largest, a
 * metropolis of 169,385), and towns whose tanners, weavers or apothecary stand beside a partial chain (one under famine). */
const KIND_TOWNS = ['r2r-town-56', 'rr3-city-infiltrated-rand-5', 'rr3-metropolis-recently_betrayed-rand-4', 'r2s-religious_conversion-city-0', 'r2s-politically_fractured-city-0', 'rr3-town-famine-isolated-1'];
/** A house name's kind, as resourceGenerator.js :: houseHead reads it. @param {unknown} name */
const kindOf = (name) => (String(name || '').toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[\s/]+/).find(Boolean) || '').replace(/['’]/g, '').replace(/s$/, '').replace(/y$/, '');

/** @type {Array<any>} */ let kindTowns = [];
/** @type {Array<any>} */ let famineTowns = [];
/** @type {Array<any>} */ let fishedOutTowns = [];
/** @type {Array<any>} */ let liveWaterTowns = [];
/** @type {Array<any>} */ let noHerdTowns = [];
/** @type {Array<any>} */ let herdTowns = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  noHerdTowns = NO_HERD_TOWNS.map(bear);
  herdTowns = HERD_TOWNS.map(bear);
  fishedOutTowns = FISHED_OUT_TOWNS.map(bear);
  liveWaterTowns = LIVE_WATER_TOWNS.map(bear);
  kindTowns = KIND_TOWNS.map(bear);
  famineTowns = [...TONIGHT_NO_GRAIN, ...OVERVIEW_NO_GRAIN, ...TONIGHT_GRAIN, ...OVERVIEW_GRAIN].map((seed) => ({ seed, s: bear(seed) }));
}, 180000);

describe('(a) the herding line: a culture sentence that claims herding is drawn only where the food record holds a herd', () => {
  it('no copy of the foodways line claims herding where no herd feeds the town', () => {
    const seen = noHerdTowns.map((s) => ({ town: s.name, culture: cultureHerds(s), sources: s.economicState.foodSecurity.foodRecord.foodSources, herding: copiesOf(s).filter((line) => HERDING.test(line)) }));
    // The arm met the culture it watches, in towns with no herd.
    expect(seen.map((t) => [t.culture, t.sources.includes('livestock')])).toEqual(NO_HERD_TOWNS.map(() => [true, false]));
    expect(seen.filter((t) => t.herding.length)).toEqual([]);
  });

  it('where the record holds a herd, the sentence still stands on every copy', () => {
    const seen = herdTowns.map((s) => ({ town: s.name, herds: s.economicState.foodSecurity.foodRecord.foodSources.includes('livestock'), herding: copiesOf(s).every((line) => HERDING.test(line)) }));
    expect(seen.map((t) => [t.herds, t.herding])).toEqual(HERD_TOWNS.map(() => [true, true]));
  });
});

describe('(b) the fished-out water: a foodways line names no catch from a water the record calls depleted', () => {
  it('where every fish water is depleted, the line every surface prints names no catch, and names what still feeds the town', () => {
    const seen = fishedOutTowns.map((s) => {
      const record = s.economicState.foodSecurity.foodRecord;
      const waters = fishWatersOf(s);
      const line = foodwaysLineOf(s) || '';
      const failed = record.failedSource === 'grain' || record.failedSource === 'mill' ? ['grain', 'mill'] : [record.failedSource];
      return { town: s.name, line, fishedOut: waters.length > 0 && waters.every((/** @type {any} */ c) => c.condition === 'depleted'),
        storedNamesCatch: namesCatch(record.foodwaysLine), namesCatch: namesCatch(line) || namesCatch(String(s.culturalIdentity?.foodways || '')),
        stillFed: record.foodSources.filter((/** @type {string} */ src) => src !== 'fish' && !failed.includes(src)) };
    });
    // The arm met its fished-out waters, each beside a stored line that names the catch.
    expect(seen.map((t) => [t.fishedOut, t.storedNamesCatch])).toEqual(FISHED_OUT_TOWNS.map(() => [true, true]));
    expect(seen.filter((t) => t.namesCatch)).toEqual([]);
    const fedStill = seen.filter((t) => t.stillFed.length);
    expect(fedStill.length).toBeGreaterThanOrEqual(2);
    expect(fedStill.filter((t) => !sourcesNamedIn(t.line).some((src) => t.stillFed.includes(src)))).toEqual([]);
  });

  it('where a fish water stands, the catch is named and the line is the record\'s own', () => {
    const seen = liveWaterTowns.map((s) => ({ town: s.name, live: fishWatersOf(s).some((/** @type {any} */ c) => c.condition !== 'depleted'),
      catch: namesCatch(foodwaysLineOf(s) || ''), same: foodwaysLineOf(s) === s.economicState.foodSecurity.foodRecord.foodwaysLine.trim() }));
    expect(seen.map((t) => [t.live, t.catch, t.same])).toEqual(LIVE_WATER_TOWNS.map(() => [true, true, true]));
  });
});

/** @param {string} seed @param {'tonight'|'overview'} surface @param {boolean} withFacts */
const famineLine = (seed, surface, withFacts) => {
  const { s } = /** @type {{ s: any }} */ (famineTowns.find((t) => t.seed === seed));
  const entry = [].concat(s.stress || []).find((/** @type {any} */ e) => e?.type === 'famine');
  return { town: s.name, grain: atomHolds('grain', factsOf(s)), line: String(withFacts ? crisisSummaryForSurface(entry, s.name, surface, factsOf(s)) : crisisSummaryForSurface(entry, s.name, surface)) };
};
const HARVEST = { tonight: /has lost a second harvest\./, overview: /^The harvest in .+ has failed, and its leaders are rationing/ };
const SHORT = { tonight: /^.+ has gone short of food for a second season\. Its leaders have begun rationing, while the families who can afford it hoard what they have\.$/,
  overview: /^.+ has gone short of food, and its leaders are rationing what is left while they decide whom to feed first\.$/ };

describe("(c) the famine line's half: handed the record's facts, the official line presumes no harvest the town does not grow", () => {
  it('handed the facts, a town that grows no grain is told it has gone short of food, on Tonight and on the Overview', () => {
    const seen = [...TONIGHT_NO_GRAIN.map((seed) => ({ surface: /** @type {'tonight'} */ ('tonight'), ...famineLine(seed, 'tonight', true), before: famineLine(seed, 'tonight', false).line })),
      ...OVERVIEW_NO_GRAIN.map((seed) => ({ surface: /** @type {'overview'} */ ('overview'), ...famineLine(seed, 'overview', true), before: famineLine(seed, 'overview', false).line }))];
    // The arm met the harvest line it watches, in towns whose record grows no grain.
    expect(seen.map((t) => [t.grain, HARVEST[t.surface].test(t.before)])).toEqual(seen.map(() => [false, true]));
    expect(seen.filter((t) => !SHORT[t.surface].test(t.line) || !t.line.startsWith(t.surface === 'tonight' ? t.town : `${t.town} `))).toEqual([]);
  });

  it('handed the facts, a town that grows grain keeps the harvest line; handed none, every town prints as before', () => {
    const grain = [...TONIGHT_GRAIN.map((seed) => ({ surface: /** @type {'tonight'} */ ('tonight'), ...famineLine(seed, 'tonight', true) })),
      ...OVERVIEW_GRAIN.map((seed) => ({ surface: /** @type {'overview'} */ ('overview'), ...famineLine(seed, 'overview', true) }))];
    expect(grain.map((t) => [t.grain, HARVEST[t.surface].test(t.line)])).toEqual(grain.map(() => [true, true]));
    const bare = [...TONIGHT_NO_GRAIN.map((seed) => ({ surface: /** @type {'tonight'} */ ('tonight'), ...famineLine(seed, 'tonight', false) })),
      ...OVERVIEW_NO_GRAIN.map((seed) => ({ surface: /** @type {'overview'} */ ('overview'), ...famineLine(seed, 'overview', false) }))];
    expect(bare.filter((t) => !HARVEST[t.surface].test(t.line))).toEqual([]);
  });
});

describe('(d) a partial chain names as missing no house whose kind stands on the roster', () => {
  it('no partial gap names a house the town holds by another spelling; a house no kind of stands is still named', () => {
    const seen = kindTowns.map((s) => {
      const names = (s.institutions || []).map((/** @type {any} */ i) => String(i?.name || ''));
      const partial = (s.resourceAnalysis?.gaps || []).filter((/** @type {any} */ g) => /limited to intermediate/.test(String(g?.impact || '')));
      const named = partial.flatMap((/** @type {any} */ g) => g.missing || []);
      return { town: s.name, sawmill: names.includes('Sawmill (commercial)'), named,
        held: named.filter((/** @type {string} */ m) => names.some((n) => kindOf(n) === kindOf(m))) };
    });
    // The arm met its commercial sawmills.
    expect(seen.slice(0, 3).map((t) => t.sawmill)).toEqual([true, true, true]);
    expect(seen.filter((t) => t.held.length)).toEqual([]);
    // A house no kind of stands is still named (the line is not emptied wholesale).
    expect(seen.filter((t) => t.named.length).length).toBeGreaterThanOrEqual(3);
  });
});
