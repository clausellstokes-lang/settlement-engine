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
import { architecturalDetailRefused, CULTURE_PROFILES } from '../../src/data/cultureProfiles.js';
import { POWER_ROLES_BY_CATEGORY } from '../../src/data/historyData.js';
import { sovereignOf } from '../../src/domain/facts/sovereign.js';
import { classesOf as doorClassesOf } from '../lint/presumptionClasses.shared.mjs';
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
    // RE-KEYED BY IDENTITY (SEAM-CULTURE, 2026-11-17; S5 of BRIEF-BAR6-SEAM): v1 ("what it built in answer") now declares
    // `legacy ruin` too, so the first variant so marked is no longer v2; the control reads v2, the rebuilding it was written on.
    const rebuilt = DS_GEN_16.pools['LEGACY-RECOVERED'].find((v) => (v.marks || []).includes('legacy ruin') && /was built after/.test(v.text));
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
      // SEAM-CULTURE (2026-11-17): every rebuilding line of the pool (v1 and v2), not the first one marked.
      if (legacyRuinOf(s) === false) for (const rebuilt of DS_GEN_16.pools['LEGACY-RECOVERED'].filter((v) => (v.marks || []).includes('legacy ruin'))) expect(admits(rebuilt, s), `${seed}: a rebuilding after a blow that destroyed nothing`).toBe(false);
      seamCultureChecks(seed, s);
      expect(sourcesNamedIn('Maize and other grain from intensive plots').includes('grain'), 'the fields\' sentence names its grain').toBe(true);
    });
    expectNoSeedFailures(failures);
  }, 1_500_000);
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// SEAM-CULTURE (2026-11-17; BRIEF-BAR6-SEAM §SEAM-CULTURE, items 1 to 6): what the culture seat left, each held here.
//   item 1  the manor's role declares `sovereign`; wherever a person holds it, the leaf reads a sovereign
//   item 2  DS-GEN-13 ENTREPOT's "more than the town could ever use" declares the HUNGER FAMILY and a town's band; a twin for
//           the hungry town and one for a village; the pool keeps three lines (B7) wherever its base kept three
//   items 3 and 6  DS-GEN-16 LEGACY-RECOVERED: v1 declares `legacy ruin`; no line says "the town" under no size band; the
//           `no legacy ruin` side keeps three lines
//   item 4  the table's rows whose reasons did not hold leave it (120, 124, 40, 141 cured; 137 and 138 left by name)
//   item 5  the Maize line presumes no resource worked here (the build guard's lexicon) and still names its grain
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const ENTREPOT = /** @type {any[]} */ (Object.values(GENERAL).map((m) => /** @type {any} */ (m)).flatMap((m) => (m && typeof m === 'object' ? Object.values(m) : [])).map((b) => /** @type {any} */ (b)?.pools?.ENTREPOT).find(Boolean));
const RECOVERED = /** @type {any[]} */ (DS_GEN_16.pools['LEGACY-RECOVERED']);
/** a crisis-scoped pool's variant read as the desk reads it @param {any} v @param {any} s */
const admitsScoped = (v, s) => declarationAdmits(variantFactDeclaration(v), factsOf(s), { crisisScoped: true }).admitted;
/** "the town" said only under a band that begins at a town @param {any} v */
const townNounBanded = (v) => !/\bthe town\b/.test(v.text) || (v.marks || []).some((m) => /^tier: (≥|>=) ?(town|city|metropolis)$/.test(m));
/** the role rows of the catalogue that declare the sovereign */
const SOVEREIGN_ROLES = new Set(Object.values(POWER_ROLES_BY_CATEGORY).flat().filter((r) => (/** @type {any} */ (r).needs || []).includes('sovereign')).map((r) => r.role));
const MAIZE = /** @type {any} */ (CULTURE_PROFILES.mesoamerican.foodways.find((d) => typeof d === 'object' && /dense populations/.test(d.text)));

/** Over the census's 720 (called from the sweep above, on the same births). @param {string} seed @param {any} s */
function seamCultureChecks(seed, s) {
  // item 1: wherever a person holds a role that declares the sovereign, the leaf reads one
  for (const n of s.npcs || []) if (SOVEREIGN_ROLES.has(n?.role)) expect(sovereignOf(s), `${seed}: ${n.role} seated with no sovereign read`).toBe(true);
  // item 2: the entrepôt's plenty never under the hunger family; its pool keeps three lines where the base's did
  const crisis = /** @type {any} */ (factsOf(s).crisis);
  const shown = ENTREPOT.filter((v) => admitsScoped(v, s));
  const plenty = shown.some((v) => /could ever use; the difference/.test(v.text));
  if (crisis.has('hunger')) expect(plenty ? 'the plenty line' : null, `${seed}: the entrepôt's plenty under the hunger family`).toBe(null);
  // the pool is `{market}` (DS-GEN-13 speaks of the town's market): the floor is read where a market stands
  if (factsOf(s).market === true && !crisis.has('under_siege') && !crisis.has('plague_onset')) expect(shown.length, `${seed} (${crisis.kinds.join(', ')}): the entrepôt pool admits under three`).toBeGreaterThanOrEqual(3);
  // item 6: where nothing was destroyed, the recovered legacy keeps three lines
  if (legacyRuinOf(s) === false) expect(RECOVERED.filter((v) => admits(v, s)).length, `${seed}: the no-ruin side of LEGACY-RECOVERED`).toBeGreaterThanOrEqual(3);
}

describe('SEAM-CULTURE: the declarations the culture seat left', () => {
  test('item 2: the entrepôt line declares the hunger family and a town\'s band, with a twin for the hungry town and one for a village', () => {
    const plenty = ENTREPOT.find((v) => /more than the town could ever use/.test(v.text));
    expect(plenty.marks, 'the family, never one crisis').toContain('no crisis: hunger');
    expect(plenty.marks).toContain('tier: ≥ town');
    const hungry = ENTREPOT.find((v) => (v.marks || []).includes('crisis: hunger'));
    expect(hungry && !/\bthe town\b/.test(hungry.text) && !/could ever use; the difference/.test(hungry.text), 'the hungry town\'s twin claims no plenty').toBe(true);
    const village = ENTREPOT.find((v) => (v.marks || []).includes('tier: ≤ village'));
    expect(village && !/\bthe town\b/.test(village.text), 'the village twin says no "the town"').toBe(true);
    for (const v of [plenty, hungry, village]) expect(townNounBanded(v), `"the town" under no town band: ${v.text}`).toBe(true);
    // POSITIVE CONTROL (bar0-village-famine-rand-37, the wide read's 7c-plenty): the old line's marks admitted a famine village
    const famineVillage = { tier: 'village', stressors: [{ type: 'famine' }], institutions: [{ name: 'Market square' }] };
    expect(declarationAdmits(variantFactDeclaration({ vid: 1, marks: ['crisis: any', 'no crisis: under_siege', 'no crisis: plague_onset'] }), factsOf(famineVillage), { crisisScoped: true }).admitted, 'POSITIVE CONTROL: the base marks admit a famine village').toBe(true);
    expect(admitsScoped(plenty, famineVillage), 'the cured line is refused there').toBe(false);
    expect(ENTREPOT.filter((v) => admitsScoped(v, famineVillage)).length, 'and the pool still holds three there (B7)').toBeGreaterThanOrEqual(3);
    // the chair (2026-11-17 03:58): the village twin carries the siege mark its siblings carry, and no new line speaks under a siege
    expect(village.marks, 'v4 names the siege as v1, v2, v3 and v5 do').toContain('no crisis: under_siege');
    const besiegedVillage = { tier: 'village', stressors: [{ type: 'under_siege' }], institutions: [{ name: 'Market square' }] };
    expect(admitsScoped(village, besiegedVillage), 'v4 off a besieged village with a market').toBe(false);
    expect(admitsScoped(hungry, besiegedVillage), 'v5 off it too').toBe(false);
  });

  test('items 3 and 6: LEGACY-RECOVERED says "the town" under no unbanded line, v1 declares the ruin, the no-ruin side keeps three', () => {
    const answer = RECOVERED.find((v) => /built in answer/.test(v.text));
    expect(answer.marks, 'v1 declares the ruin it answers').toContain('legacy ruin');
    for (const v of RECOVERED) expect(townNounBanded(v), `"the town" under no size band: ${v.text}`).toBe(true);
    expect(RECOVERED.filter((v) => (v.marks || []).includes('no legacy ruin')).length, 'B7: three lines where nothing was destroyed').toBeGreaterThanOrEqual(3);
    // POSITIVE CONTROL (bar0-town-calm-rand-28: 10g-legacy-answer after the economic divide)
    const divide = { tier: 'town', history: { legacyAnnotations: [{ eventName: 'The Economic Divide' }], historicalEvents: [{ name: 'The Economic Divide', type: 'economic', templateType: 'economic_disparity' }] } };
    expect(declarationAdmits(variantFactDeclaration({ vid: 1, marks: [] }), factsOf(divide)).admitted, 'POSITIVE CONTROL: v1 as it stood (no marks) printed there').toBe(true);
    expect(admits(answer, divide), 'v1 is refused after a blow that destroyed nothing').toBe(false);
    expect(RECOVERED.filter((v) => admits(v, divide)).length).toBeGreaterThanOrEqual(3);
  });

  test('item 1: the manor\'s role declares the sovereign it names; the leaf reads a person who holds it', () => {
    expect([...SOVEREIGN_ROLES]).toContain('Lord/Lady of the Manor');
    const seated = { tier: 'village', institutions: [], npcs: [{ role: 'Lord/Lady of the Manor', title: 'noble' }] };
    expect(sovereignOf(seated)).toBe(true);
    expect(sovereignOf({ tier: 'village', institutions: [], npcs: [{ role: 'Mayor', title: 'mayor' }] }), 'POSITIVE CONTROL: a mayor gives none').toBe(false);
  });

  test('item 5: the Maize line presumes no resource worked here and still names its grain; item 4: row 120 declares its route', () => {
    expect(doorClassesOf(MAIZE.text), 'the build guard\'s lexicon reads no class in it').toEqual([]);
    expect(doorClassesOf('Maize and other grain from intensive plots, terraces, and raised fields, with tribute redistribution, support dense populations.'), 'POSITIVE CONTROL: the old line was a resource hit').toEqual(['resource']);
    expect(sourcesNamedIn(MAIZE.text)).toContain('grain');
    const yards = /** @type {any} */ (CULTURE_PROFILES.steppe.architecturalDetails.find((d) => typeof d === 'object' && /caravan yards/.test(d.text)));
    expect(yards.excludes).toEqual(['route: isolated']);
    expect(architecturalDetailRefused(yards.text, 'steppe', () => factsOf({ tier: 'town', config: { tradeRouteAccess: 'isolated' } })), 'no caravans reach an isolated place').toBe(true);
    expect(architecturalDetailRefused(yards.text, 'steppe', () => factsOf({ tier: 'town', config: { tradeRouteAccess: 'road' } }))).toBe(false);
  });

  test('item 4: no row of the reviewed table is one whose reason did not hold', async () => {
    const fs = await import('node:fs');
    const table = JSON.parse(fs.readFileSync('docs/chair/2026-11-16/bar6/AUDIT/tables/G.exclusions.BAR6-CULTURE.json', 'utf8'));
    const texts = new Set(table.map((/** @type {any} */ r) => r.text));
    for (const t of ['storehouses and caravan yards mark the boundary between settlement and seasonal encampment', 'Lord/Lady of the Manor']) expect(texts.has(t), t).toBe(false);
    for (const t of table.map((/** @type {any} */ r) => r.text)) expect(/rival lord/.test(t) ? t : null, 'a rival lord is left by name, not reasoned away').toBe(null);
  });
});
