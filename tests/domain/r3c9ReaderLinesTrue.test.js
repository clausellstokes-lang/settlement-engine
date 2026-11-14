/**
 * THE BAR'S ROWS LEFT TO THIS LANE, HELD TRUE WHERE THEY PRINT (R3-CODE-C-9; the chair's lane
 * docs/chair/2026-11-14/bar-0-rows/BAR-0-ROWS-r3c.json, rows n80, n240, n299 and n15; the chair's rulings in
 * docs/chair/2026-11-14/briefs/BRIEF-R3-CODE-C-9.md, vetoable by the owner).
 *
 * n80 · A LINE THAT NAMES WHERE THE FOOD COMES FROM READS THE FOOD RECORD: a source a famine failed
 *   (`foodRecord.failedSource`; the mill grinds the grain, so grain and the mill fail together, as the food record's
 *   one type and resourceGenerator.js :: FAILED_SOURCE_CHAIN read them) is not named as feeding the town. The line's one
 *   reader (domain/foodways.js :: foodwaysLineOf) gives the sources that still feed it, or, where none does, the
 *   composer's own claimless sentence. Agiospolis (bar0-city-under_siege+famine-rand-1): "The table rests on fish from
 *   the local waters." beside `failedSource: "fish"`.
 *
 * n240 · the faith's subordinate line ("{faith} answers to {hall}. Its priests look after their flocks and have no say
 *   in the hall.", factionDynamics.js) reads the faith's standing the same record prints: World/Faith gives the strongest
 *   religious power a voice in the town's affairs (faithReading.js :: factionLine: a small voice, a voice, real weight)
 *   wherever it stands, so the line is not drawn. Gortfell (bar0-town-calm-rand-1): beside "Clergy and church
 *   institutions exercise meaningful civic influence ..." and "A voice in the town's affairs belongs to the Religious
 *   Authorities."
 *
 * The towns are born as the reader's probes bear them (REVIEW-R3-CODE-C births.mjs :: cfgFor; the bar's towns by
 * REVIEW-BAR-0 render.bar0.jsx :: cfgFor, the rr pattern). Each arm collects first and asserts on the collection, and
 * asserts that it saw its line print (a guard that never sees its line proves nothing).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { foodwaysLineOf, sourcesNamedIn } from '../../src/domain/foodways.js';
import { faithLinesOf, faithReadingOf } from '../../src/domain/dossier/faithReading.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZES = '(thorp|hamlet|village|town|city|metropolis)';
/** The reader's cfgFor (r2r-, r2s-, rr3-, rr3p-) and the bar's (bar0-, the rr pattern), in effect verbatim. @param {string} seed */
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
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^(?:rr3|bar0)-${SIZES}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
};
/** @param {string} seed */
const bear = (seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });

/**
 * n80's towns, each under a famine: Agiospolis (siege and famine, fish failed), a thorp of 6 (fish), a city whose grain
 * failed beside its herds, a metropolis whose grain failed beside fish and a mill, a village under siege and famine
 * (herds failed beside fish), and a city whose grain and mill both stop.
 */
const FAMINE_TOWNS = ['bar0-city-under_siege+famine-rand-1', 'rr3p-thorp-famine-rand-0', 'r2s-famine-city-3', 'r2s-famine-metropolis-3', 'rr3-village-under_siege+famine-rand-3', 'rr3-city-under_siege+famine-rand-5'];
/** Towns with no famine: their line is the record's, untouched. */
const CALM_TOWNS = ['r2r-village-35', 'bar0-town-calm-rand-1'];

/** n240's towns: Gortfell, villages, towns and cities whose faith stood below half the hall, under siege and occupation. */
const FAITH_TOWNS = ['bar0-town-calm-rand-1', 'r2r-village-12', 'r2r-village-15', 'r2s-occupied-town-1', 'rr3-town-under_siege-rand-0', 'rr3-city-under_siege-rand-2', 'r2r-metropolis-0'];
const NO_SAY = 'have no say in the hall';

/** The sources a famine's failure stops: the failed one; grain and the mill together (the mill grinds the grain). @param {unknown} failed */
const stoppedBy = (failed) => (failed === 'grain' || failed === 'mill' ? ['grain', 'mill'] : failed ? [String(failed)] : []);

/** @type {Array<any>} */ let famineTowns = [];
/** @type {Array<any>} */ let calmTowns = [];
/** @type {Array<any>} */ let faithTowns = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  famineTowns = FAMINE_TOWNS.map(bear);
  calmTowns = CALM_TOWNS.map(bear);
  faithTowns = FAITH_TOWNS.map(bear);
}, 180000);

describe('n80: the foodways line names no source the famine failed', () => {
  it('every surface\'s line (the one reader, and the identity record it stores) names only what still feeds the town', () => {
    const seen = famineTowns.map((s) => {
      const record = s.economicState.foodSecurity.foodRecord;
      const stopped = stoppedBy(record.failedSource);
      const line = foodwaysLineOf(s) || '';
      const identity = String(s.culturalIdentity?.foodways || '');
      return {
        town: s.name, failed: record.failedSource, line,
        namesFailed: sourcesNamedIn(line).filter((src) => stopped.includes(src)),
        identityNamesFailed: sourcesNamedIn(identity).filter((src) => stopped.includes(src)),
        stillFed: record.foodSources.filter((/** @type {string} */ src) => !stopped.includes(src)),
      };
    });
    // The arm saw its famines and its lines.
    expect(seen.every((t) => t.failed && t.line.length > 0)).toBe(true);
    expect(seen.filter((t) => t.namesFailed.length || t.identityNamesFailed.length)).toEqual([]);
    // Where a source still feeds the town, the line names it (it says what still feeds it, not only what does not).
    const fedStill = seen.filter((t) => t.stillFed.length);
    expect(fedStill.length).toBeGreaterThanOrEqual(2);
    expect(fedStill.filter((t) => !sourcesNamedIn(t.line).some((src) => t.stillFed.includes(src)))).toEqual([]);
  });

  it('a town with no famine keeps the record\'s own line, unchanged', () => {
    const seen = calmTowns.map((s) => ({ town: s.name, failed: s.economicState.foodSecurity.foodRecord.failedSource, same: foodwaysLineOf(s) === s.economicState.foodSecurity.foodRecord.foodwaysLine.trim() }));
    expect(seen.map((t) => [t.failed, t.same])).toEqual(CALM_TOWNS.map(() => [null, true]));
  });
});

describe('n240: the faith is not said to have no say in the hall where the record gives it a voice', () => {
  it('no relationship line says it beside the World/Faith voice the same town prints', () => {
    const seen = faithTowns.map((s) => {
      const voice = faithLinesOf(faithReadingOf(s)).find((line) => /voice in|political weight/.test(line)) || '';
      const rows = (s.powerStructure?.factionRelationships || []).filter((/** @type {any} */ r) => String(r.narrative || '').includes(NO_SAY));
      return { town: s.name, voice, noSay: rows.map((/** @type {any} */ r) => r.narrative) };
    });
    // The arm saw the faith's voice print in every town it reads.
    expect(seen.filter((t) => !t.voice)).toEqual([]);
    expect(seen.filter((t) => t.noSay.length)).toEqual([]);
  });

  it('the faith and the hall still stand in each town (the arm reads the pair it means)', () => {
    const pairs = faithTowns.map((s) => {
      const ps = s.powerStructure || {};
      const gov = (ps.factions || []).find((/** @type {any} */ f) => f.isGoverning);
      const faith = (ps.factions || []).find((/** @type {any} */ f) => f.category === 'religious' && !f.isGoverning);
      return Boolean(gov && faith && faith.power / Math.max(1, gov.power) < 0.5);
    });
    expect(pairs).toEqual(FAITH_TOWNS.map(() => true));
  });
});
