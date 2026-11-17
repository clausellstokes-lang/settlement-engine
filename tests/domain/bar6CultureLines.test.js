/**
 * bar6CultureLines.test.js — BAR6-CULTURE (BRIEF-BAR6 §BAR6-CULTURE; BRIEF-BAR5 Amendment L4): the culture, history and
 * faith rules of the seat, each kept by its auditor's own detector or by the one fact the cure made.
 *
 *   10g-span   one event has one length: the current tension copies its own past event's `{duration}`
 *              (`historyData.js :: ownEventDuration`, through `placedTensionTokens`); detector `law10.mjs :: law10g`.
 *   10g-legacy a line of rebuilding declares a calamity that destroyed something (the atom `legacy ruin`,
 *              `facts/legacyRuin.js`; DS-GEN-16 LEGACY-RECOVERED); detector `law10g`.
 *   6d-court   DS-GEN-17's "a hall of justice, a gaol" and its siblings declare `court` (and `prison`).
 *   6d-fields  the culture's foodways sentence credits fields only where grain feeds the place.
 *   6a         a culture's neighbourhoods are a town's; its street kitchens are not a hamlet's.
 *   9e.heresy  the Magic tab's "Religious acceptance" reads the heresy flag the Faith tab's line reads (ruling HR2,
 *              `facts/heresyStance.js`); detector `law9.mjs :: law9`.
 * Each rule has a POSITIVE CONTROL (a record built from the wide read's real row, on which the detector or the old reading
 * still fires) and THE ZERO over the census's 720 (CENSUS-3 seeds.txt), each read off the record and the desks' own
 * prose (`printProse.js :: buildPrintProse`).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { deriveMagicPosture } from '../../src/domain/display/dossierViewModel.js';
import { legacyRuinOf } from '../../src/domain/facts/legacyRuin.js';
import { heresyStanceOf, religiousAcceptanceUnderHeresy } from '../../src/domain/facts/heresyStance.js';
import { religiousAcceptanceShown } from '../../src/domain/display/magicProvisionShown.js';
import { ownEventDuration, placedTensionTokens } from '../../src/data/historyData.js';
import { architecturalDetailRefused } from '../../src/data/cultureProfiles.js';
import { sourcesNamedIn } from '../../src/domain/foodways.js';
import * as GENERAL from '../../src/data/dossierStateProse/general.generated.js';
import * as WARFAITH from '../../src/data/dossierStateProse/warFaith.generated.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { law10g } from '../helpers/pageLaws/law10.mjs';
import { law9 } from '../helpers/pageLaws/law9.mjs';
import { readTownC } from '../helpers/pageLaws/pageC.mjs';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs, its two census arms verbatim (as tests/domain/bar5LawBandFloor.test.js). @param {string} seed */
const cfgFor = (seed) => {
  const m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  const n = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`)));
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [n[1]], selectedStressesRandom: false, settType: n[2] });
};
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const STRESSES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset', 'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** THE CENSUS'S 720 (CENSUS-3 seeds.txt): r2r-<size>-0..59 and r2s-<stress>-<size>-0..3. */
const CENSUS_720 = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...STRESSES.flatMap((st) => SIZES.flatMap((size) => [0, 1, 2, 3].map((i) => `r2s-${st}-${size}-${i}`))),
];
const SMALL = new Set(['thorp', 'hamlet']);
const BELOW_TOWN = new Set(['thorp', 'hamlet', 'village']);

/** The desks' corpora, as generated from the annex. */
const corpusOf = (/** @type {Record<string, unknown>} */ mod, /** @type {string} */ block) => /** @type {any} */ (Object.values(mod).find((v) => v && typeof v === 'object' && !Array.isArray(v) && /** @type {any} */ (v)[block]))[block];
const DS_GEN_16 = corpusOf(GENERAL, 'DS-GEN-16');
const DS_GEN_17 = corpusOf(GENERAL, 'DS-GEN-17');
const DS_FTH_4 = corpusOf(WARFAITH, 'DS-FTH-4');
/** A variant's text with its slots filled. @param {{ text: string }} v @param {Record<string, string>} slots */
const filled = (v, slots) => v.text.replace(/\{(\w+)\}/g, (_, k) => slots[k] ?? `{${k}}`);
/** The variant of a pool whose marks hold a word. @param {any[]} pool @param {string} mark */
const marked = (pool, mark) => pool.find((v) => (v.marks || []).includes(mark));
/** Does the record admit a variant's own marks? @param {any} v @param {any} s */
const admits = (v, s) => declarationAdmits(variantFactDeclaration(v), factsOf(s)).admitted;

/** Every paragraph the desks print for the record, flattened. @param {any} s @returns {string[]} */
const proseOf = (s) => Object.values(buildPrintProse(s)).flatMap((mounts) => Object.values(/** @type {Record<string, string>} */ (mounts)));
const COURT_CLAIM = /\b(hall of justice|keeps its own court|takes? (?:their|its) quarrels there)\b/i;
const FIELD_FOODWAYS = /\b(intensive plots|terraces|raised fields|paddies|rice fields|grain fields|ploughed fields|tilled (fields|plots))\b/i;
const SIZE_TOWN = /\b(neighbou?rhoods?|districts?|quarters?)\b/i;

/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return towns.get(seed);
};

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

describe('BAR6-CULTURE: positive controls (the wide read\'s real rows, built as records)', () => {
  test('10g-span (C133674): the detector fires on a plague told for 2 seasons and for three; the tension copies its own length', () => {
    const events = [{ name: 'The Plague Years', templateType: 'plague_years', type: 'disaster', description: 'For 2 seasons a sickness worked through the settlement, emptying households and straining every institution past what it was built to bear' }];
    const tensions = [{ type: 'plague_years', description: 'A sickness moved through the settlement for three seasons, thinning families and testing every institution to its limit' }];
    const record = { history: { historicalEvents: events, currentTensions: tensions } };
    const tabs = { 'World/History': [events[0].description, tensions[0].description] };
    expect(law10g({ record, tabs, town: 'C133674' }).map((x) => x.rule), 'POSITIVE CONTROL: the base\'s two lengths are the rule\'s instance').toEqual(['10g-span']);
    expect(ownEventDuration('plague_years', events), 'the own event\'s length, read back').toBe('2');
    expect(placedTensionTokens({ '{duration}': 'three' }, 'plague_years', events)['{duration}'], 'the tension takes it').toBe('2');
  });

  test('10g-legacy (C55011): a rebuilding after the economic divide is refused; after a great fire it stands', () => {
    const rebuilt = marked(DS_GEN_16.pools['LEGACY-RECOVERED'], 'legacy ruin');
    const twin = marked(DS_GEN_16.pools['LEGACY-RECOVERED'], 'no legacy ruin');
    const line = filled(rebuilt, { settlement: 'Kaltenturm', calamity: 'economic divide', timeband_age: 'years old' });
    const divide = { history: { legacyAnnotations: [{ eventName: 'The Economic Divide' }], historicalEvents: [{ name: 'The Economic Divide', type: 'economic', templateType: 'economic_disparity' }] } };
    expect(law10g({ record: divide, tabs: { 'World/History': [line] }, town: 'C55011' }).map((x) => x.rule), 'POSITIVE CONTROL: the line is the rule\'s instance').toEqual(['10g-legacy']);
    expect(legacyRuinOf(divide), 'the economic divide destroyed nothing').toBe(false);
    const fire = { history: { legacyAnnotations: [{ eventName: 'The Great Fire' }], historicalEvents: [{ name: 'The Great Fire', type: 'disaster', templateType: 'great_fire' }] } };
    expect(legacyRuinOf(fire), 'a great fire did').toBe(true);
    expect(twin, 'the pool keeps a twin where nothing was destroyed').toBeTruthy();
  });

  test('6d-court (C161931): the visible-governance line declares the court the record keeps', () => {
    const pool = DS_GEN_17.pools.ADMINISTERED;
    const hall = pool.find((v) => /hall of justice/.test(v.text));
    expect(COURT_CLAIM.test(filled(hall, { settlement: 'The town' })), 'POSITIVE CONTROL: the line claims a court').toBe(true);
    expect(hall.marks, 'and declares it').toEqual(expect.arrayContaining(['court sits', 'prison']));
    expect(pool.some((v) => (v.marks || []).includes('no court sits')), 'a gaol without a court has a line of its own').toBe(true);
  });

  test('9e.heresy (C84616): the detector fires on the hunt beside "indifferent"; the row reads the flag', () => {
    const hunt = filled(DS_FTH_4.pools['FLAG: heresySuppression: hunted'].find((v) => /hunt it as such/.test(v.text)), { settlement: 'Raskot' });
    const record = { tier: 'hamlet', population: 40, economicState: { safetyProfile: { flags: { heresySuppression: true, heresyIntensity: 0.618 } } } };
    const page = (/** @type {string} */ word) => `== World/Faith ==\n${hunt}\n== Systems/Magic ==\nReligious acceptance · ${word}\n`;
    const hits = (/** @type {string} */ word) => law9(readTownC(page(word), record), 'C84616').filter((x) => x.rule === '9e.heresy').length;
    expect(hits('indifferent'), 'POSITIVE CONTROL: the base\'s page is the rule\'s instance').toBe(1);
    expect(heresyStanceOf(record), 'the flag').toBe('hunted');
    const shown = String(religiousAcceptanceUnderHeresy(record, 'indifferent'));
    expect(shown, 'the row reads it').toBe('hostile');
    expect(hits(shown), 'the page at the tip is no instance').toBe(0);
    expect(religiousAcceptanceUnderHeresy({ economicState: { safetyProfile: { flags: {} } } }, 'indifferent'), 'no flag: the envelope\'s word').toBe('indifferent');
  });
});

describe('BAR6-CULTURE: the zero over the census\'s 720', () => {
  test('no rule of the seat has an instance in any town', () => {
    const failures = collectSeedFailures(CENSUS_720, (seed) => {
      const s = town(seed);
      const h = s.history || {};
      const prose = proseOf(s);
      const historyLines = [...(h.historicalEvents || []).map((e) => e.description), ...(h.currentTensions || []).map((e) => e.description), ...prose];
      const g = law10g({ record: s, tabs: { 'World/History': historyLines }, town: seed }).filter((x) => x.rule === '10g-span' || x.rule === '10g-legacy');
      expect(g.map((x) => `${x.rule}: ${x.line}`), `${seed}: 10g`).toEqual([]);
      const f = factsOf(s);
      if (!f.courtSits) expect(prose.filter((p) => COURT_CLAIM.test(p)), `${seed}: a court claimed where none sits on the roster`).toEqual([]);
      const food = s.economicState?.foodSecurity?.foodRecord;
      if (food && !(food.foodSources || []).includes('grain')) expect(FIELD_FOODWAYS.test(String(food.foodwaysLine ?? '')) ? food.foodwaysLine : null, `${seed}: fields credited with no grain`).toBe(null);
      if (SMALL.has(s.tier)) expect(/street kitchens/i.test(String(food?.foodwaysLine ?? '')) ? food.foodwaysLine : null, `${seed}: a hamlet's street kitchens`).toBe(null);
      if (SMALL.has(s.tier)) expect(/Nobody in the street pays attention/.test(JSON.stringify(s.arrivalScene ?? '')) ? 'the street line' : null, `${seed}: a hamlet's street in its arrival`).toBe(null);
      const detail = String(s.culturalIdentity?.architecturalDetail ?? '');
      const key = String(s.culturalIdentity?.key ?? '');
      if (BELOW_TOWN.has(s.tier) && key !== 'mixed' && !architecturalDetailRefused(detail, key, () => f)) expect(SIZE_TOWN.test(detail) ? detail : null, `${seed}: a town's word in a ${s.tier}`).toBe(null);
      if (heresyStanceOf(s)) expect(String(religiousAcceptanceShown(s, religiousAcceptanceUnderHeresy(s, deriveMagicPosture(s).religiousAcceptance))), `${seed}: the faith hunts or preaches against magic`).toMatch(/^hostile/);
      const rebuilt = marked(DS_GEN_16.pools['LEGACY-RECOVERED'], 'legacy ruin');
      if (legacyRuinOf(s) === false) expect(admits(rebuilt, s), `${seed}: a rebuilding after a blow that destroyed nothing`).toBe(false);
      expect(sourcesNamedIn('Maize and other grain from intensive plots').includes('grain'), 'the fields\' sentence names its grain').toBe(true);
    });
    expectNoSeedFailures(failures);
  }, 1_500_000);
});
