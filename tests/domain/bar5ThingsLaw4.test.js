// THE GUARD OF LAW 4, THE PEOPLE'S LINES (BAR5-THINGS, BRIEF-BAR5 amendment L4, 2026-11-16): THE PAGE NAMES NO THING THE TOWN
// LACKS: the notary, the weeks, the patron, the kilns.
//
// THE DETECTOR (`law4ThingsFindings`, below) reads a born town's own printed strings (every string of the record: its ties,
// its secrets, its hooks, its arrival scene) against the town's roster, read by its OWN tests, never by the facts the cure
// made (so that a fact gone wrong cannot certify itself):
//   notary   a notary named where no house of written law stands (a court, a hall that registers deeds, a scribe) and no
//            person of the town is one (the audit's `4n-notary`, widened to the halls the catalogue gives a registry: below);
//   weeks    a secret of the siege that counts more weeks than the siege's own age the record prints ("The siege has entered
//            its second week");
//   patron   a hook giving "their post", owed to a patron, to the household elder, whose every description says nobody named
//            them;
//   kilns    fired clay or fresh pots where no potter or brickmaker stands; charcoal smoke where no charcoal burner does.
// Over the census's 720 (CENSUS-3 seeds.txt's rule, born in seedcfg.mjs's shape) it must find NOTHING, and on records made
// from the read's own rows (REVIEW-BAR-5 C44306, C2000, C30295, C15951) it MUST fire: it cannot go blind.
//
// THE DETECTOR'S LEGAL HOUSE is the audit's own (`tests/helpers/pageLaws/law4.mjs :: LEGAL_HOUSE`): a widening to the halls
// (a Town hall's "Record filing", a City hall's "Contract witnessing") was measured and withdrawn: the audit's precision draw
// judged the notary line STANDS in three towns whose only such house is a Town hall.
//
// The counts before and after, over the sixty, the 720 and the fresh 300 (the audit's runner over the census's dumps), are in
// docs/chair/2026-11-16/bar5/BAR5-THINGS-HANDBACK.md.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { ARRIVAL_SENSES } from '../../src/data/arrivalProse.js';
import { INSTITUTION_IDENTITY } from '../../src/domain/display/institutionVocabulary.js';
import { LEGAL_HOUSES, legalHouseOf } from '../../src/domain/facts/legalHouse.js';
import { UNAPPOINTED_HOUSES, appointedPostOf } from '../../src/domain/facts/appointedPost.js';
import { KILN_KINDS, TRADE_HOUSES, tradeAtWorkOf } from '../../src/domain/facts/tradeAtWork.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset',
  'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** The census's 720, by its own rule. */
const SEEDS = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISES.flatMap((crisis) => SIZES.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${crisis}-${size}-${i}`))),
];

/** CENSUS-3 seedcfg.mjs's r2r-/r2s- arms, verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  throw new Error(`a guard seed is a census seed: ${seed}`);
}

/** Every string of a value, flattened. @param {unknown} v @param {string[]} out @returns {string[]} */
const stringsOf = (v, out = []) => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) for (const x of v) stringsOf(x, out);
  else if (v && typeof v === 'object') for (const x of Object.values(v)) stringsOf(x, out);
  return out;
};

// ── THE DETECTOR: its own tests of the roster, never the facts the cure made ──
const NOTARY = /\bnotar(?:y|ies)\b/i;
const LEGAL_NAME = /notar|scribe|court|magistrat|lawyer|advocate|registr|clerk|chancer|justic/i;
const AGO = /\b(two|three|four|five|six|seven|eight|nine|ten|\d+) (weeks|months) ago\b/i;
const SIEGE_WORD = /besieg|\bsiege\b|blockad/i;
const SIEGE_AGE = /\bsiege has entered its (first|second|third|fourth|fifth|sixth) week\b/i;
const NUM = /** @type {Record<string, number>} */ ({ two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6 });
const PATRON = /\bowes? (?:their|his|her) (?:post|position|office|seat|appointment) to a patron\b/i;
const CLAY_WORDS = /\bfired clay\b|\bfresh pots\b|\bcrates of pots\b/i;
const CLAY_HOUSE = /potter|brick|tile|ceramic/i;
const CHARCOAL_WORDS = /\bcharcoal smoke\b|\bcharcoal clamps\b/i;

/**
 * The record's printed strings, LESS the chains' outputs: NAMED EXCLUSION (the audit's own, `law4.mjs`'s "a chain's rungs are
 * LAW 3's"): a chain's output label ("Civil disputes · Criminal trials · Notary services" where only a Town hall stands) is a
 * chain printed over a house it lacks, LAW 3's and BAR5-CHAINS's (`computeActiveChains.js`), not a line naming a thing.
 * @param {any} town @returns {string[]}
 */
const printedStringsOf = (town) => stringsOf({ ...town, economicState: { ...(town?.economicState || {}), activeChains: [] } });

/** @param {any} town */
const namesOf = (town) => (Array.isArray(town?.institutions) ? town.institutions : []).map((/** @type {any} */ i) => String(i?.name || '')).filter((n) => !/^access to\b/i.test(n));

/**
 * Every instance of LAW 4's four things in one town. @param {any} town @param {string[]} [lines] the printed strings
 * @returns {Array<{ thing: string, line: string, why: string }>}
 */
export function law4ThingsFindings(town, lines = printedStringsOf(town)) {
  /** @type {Array<{ thing: string, line: string, why: string }>} */ const out = [];
  const names = namesOf(town);
  // notary — NAMED EXCLUSION: a person of the town whose own role or title is a notary's is a notary
  const notaryPerson = (Array.isArray(town?.npcs) ? town.npcs : []).some((/** @type {any} */ n) => NOTARY.test(`${n?.role ?? ''} ${n?.title ?? ''}`));
  const notaryOffered = /notar/i.test(JSON.stringify(town?.availableServices || {})); // the audit's own reading of the offered services
  if (!names.some((n) => LEGAL_NAME.test(n)) && !notaryPerson && !notaryOffered) {
    for (const l of lines) if (NOTARY.test(l)) out.push({ thing: 'notary', line: l, why: 'no house of written law, no notary among the people' });
  }
  // weeks
  const age = lines.map((l) => SIEGE_AGE.exec(l)).find(Boolean);
  if (age) {
    const weeks = NUM[age[1].toLowerCase()];
    for (const l of lines) {
      const m = AGO.exec(l);
      if (!m || !SIEGE_WORD.test(l)) continue;
      const n = /^\d+$/.test(m[1]) ? Number(m[1]) : NUM[m[1].toLowerCase()];
      if ((m[2].toLowerCase() === 'months' ? n * 4 : n) > weeks) out.push({ thing: 'weeks', line: l, why: `the siege is in its ${age[1]} week` });
    }
  }
  // patron
  for (const n of Array.isArray(town?.npcs) ? town.npcs : []) {
    if (!/^household elder$/i.test(String(n?.institution?.key ?? ''))) continue;
    for (const h of stringsOf(n?.plotHooks)) if (PATRON.test(h)) out.push({ thing: 'patron', line: h, why: `${n?.name}: the household elder, whom nobody named` });
  }
  // kilns
  const scene = String(town?.arrivalScene || '');
  if (CLAY_WORDS.test(scene) && !names.some((n) => CLAY_HOUSE.test(n))) out.push({ thing: 'kilns', line: scene, why: 'fired clay or pots; no potter or brickmaker' });
  if (CHARCOAL_WORDS.test(scene) && !names.some((n) => /charcoal/i.test(n))) out.push({ thing: 'kilns', line: scene, why: 'charcoal smoke; no charcoal burner' });
  return out;
}

/** @type {Map<string, any>} */
const BORN = new Map();

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of SEEDS) BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
}, 1800000);

describe('LAW 4, the people\'s lines: no line names a notary, a count of weeks, a patron\'s post or fired clay the town lacks', () => {
  it('the census\'s 720 are 720', () => {
    expect(SEEDS.length).toBe(720);
    expect(new Set(SEEDS).size).toBe(720);
  });

  it('the detector finds no instance in any of the 720 (a finding names the thing, the line and the state)', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const town = BORN.get(seed);
      if (!town) throw new Error(`${seed}: not born`);
      const found = law4ThingsFindings(town);
      if (found.length) throw new Error(found.map((f) => `${f.thing}: "${f.line.slice(0, 160)}" (${f.why})`).join(' | '));
    });
    expectNoSeedFailures(failures, 'LAW 4 (the people\'s lines) over the census 720');
  });

  it('POSITIVE CONTROL: the read\'s own rows, on a town made to lack each thing, every thing fires', () => {
    const base = BORN.get('r2s-under_siege-thorp-0');
    const town = {
      ...base,
      institutions: [{ name: 'Household elder' }, { name: 'Charcoal burner' }, { name: 'Dwellings (1-8)' }],
      npcs: [{ name: "Treasa O'Brien", role: 'the household elder', title: 'the household elder', institution: { key: 'Household elder' },
        plotHooks: ['They owe their post to a patron who has started asking for repayment in favours they cannot grant openly.'] }], // C30295
      arrivalScene: 'Kiln smoke hangs over Ioannochorion, and the dust of fired clay is on everything.', // C15951
    };
    const lines = [...printedStringsOf(town),
      'Haruto Lin (the stable keeper) has written down what Dan Li owes and left a copy with a notary.', // C44306
      'The siege has entered its second week; the council controls the rationing and the gates.',
      "Secret: Passed information about the settlement's water supply to someone in the besieging camp three weeks ago"]; // C2000
    const things = new Set(law4ThingsFindings(town, lines).map((f) => f.thing));
    expect([...things].sort()).toEqual(['kilns', 'notary', 'patron', 'weeks']);
  });
});

describe('the three facts the cure made, pinned to the catalogue they copy', () => {
  it('the legal houses are the catalogue\'s houses named for a court or a scribe, both ways (a city\'s "Multiple courthouses" too)', () => {
    /** @type {Set<string>} */ const names = new Set();
    const walk = (/** @type {any} */ o, depth = 0) => { if (o && typeof o === 'object' && depth < 4) for (const [k, v] of Object.entries(o)) if (v && typeof v === 'object' && !Array.isArray(v)) { if (depth === 2) names.add(k); walk(v, depth + 1); } };
    walk(institutionalCatalog);
    const named = [...names].filter((n) => LEGAL_NAME.test(n)).map((n) => n.toLowerCase()).sort();
    expect(named.length).toBeGreaterThan(0);
    expect([...LEGAL_HOUSES].sort()).toEqual(named);
    expect(legalHouseOf({ institutions: [{ name: 'Courthouse' }] })).toBe(true);
    expect(legalHouseOf({ institutions: [{ name: 'Multiple courthouses' }] })).toBe(true);
    expect(legalHouseOf({ institutions: [{ name: 'Village scribe' }] })).toBe(true);
    expect(legalHouseOf({ institutions: [{ name: 'Town hall' }, { name: 'Village elder' }, { name: 'Barracks' }] })).toBe(false); // the precision draw's STANDS
    expect(legalHouseOf({ institutions: [{ name: 'Town hall' }], availableServices: { legal: [{ name: 'Notary services', institution: 'Town hall' }] } })).toBe(true); // the record offers one
  });

  it('the house of no appointment is one whose own description denies it', () => {
    for (const h of UNAPPOINTED_HOUSES) {
      const key = Object.keys(INSTITUTION_IDENTITY).find((k) => k.toLowerCase() === h);
      expect(key, h).toBeTruthy();
      expect(String(/** @type {Record<string, unknown>} */ (INSTITUTION_IDENTITY)[/** @type {string} */ (key)])).toMatch(/no formal appointment/);
    }
    expect(appointedPostOf({ institutions: [{ name: 'Household elder' }] })).toBe(false);
    expect(appointedPostOf({ institutions: [{ name: 'Village elder' }] })).toBe(true);
  });

  it('the kiln kinds part the kilns\' house words, and a kind no house of which stands is unanswered', () => {
    for (const words of Object.values(KILN_KINDS)) for (const w of words) expect(TRADE_HOUSES.kilns).toContain(w);
    const charcoal = { institutions: [{ name: 'Charcoal burner' }] };
    expect(tradeAtWorkOf(charcoal, 'clay kilns')).toBeUndefined();
    expect(tradeAtWorkOf(charcoal, 'charcoal kilns')).toBe(true);
    expect(tradeAtWorkOf({ institutions: [{ name: 'Potter' }] }, 'clay kilns')).toBe(true);
    expect(tradeAtWorkOf(charcoal, 'kilns')).toBe(true);
  });

  it('the fired-clay scene and its twin are refused where only a charcoal burner fires a kiln; the charcoal line is admitted', () => {
    const pool = /** @type {any} */ (ARRIVAL_SENSES.find((s) => s.key === 'kilns'));
    const facts = factsOf({ institutions: [{ name: 'Charcoal burner' }], tier: 'hamlet' });
    const admits = (/** @type {RegExp} */ re, /** @type {any[]} */ rows) => {
      const row = rows.find((l) => re.test(String(typeof l.text === 'function' ? l.text('{name}') : l.text)));
      expect(row, String(re)).toBeTruthy();
      return declarationAdmits(declarationOf(row), /** @type {any} */ (facts), { crisisScoped: false }).admitted;
    };
    expect(admits(/dust of fired clay/, pool.dominant)).toBe(false);
    expect(admits(/^Old kiln dust/, pool.dominant)).toBe(false);
    expect(admits(/^Fresh pots/, pool.lines)).toBe(false);
    expect(admits(/^Drying boards/, pool.lines)).toBe(false);
    expect(admits(/^Charcoal smoke lingers/, pool.lines)).toBe(true);
    expect(admits(/^A thread of kiln smoke/, pool.lines)).toBe(true);
  });
});
