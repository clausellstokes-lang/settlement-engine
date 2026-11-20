// BAR6-HOUSES (BRIEF-BAR6, THE CHAIR'S RULING SV1 of 2026-11-16; vetoable by the owner): THE SOVEREIGN WORDS HAVE ONE ATOM, and the
// houses' own lines that name a lord, a crown or a monarch declare it or take a twin naming none. The guard, in three arms:
// (a) THE ATOM (`src/domain/facts/sovereign.js`), through the vocabulary's own door, on constructed records;
// (b) THE DECLARING LINES: every late set that declares it has a twin naming no sovereign; every service that declares it is
//     its own house's, and that house's name gives the sovereign wherever the menu is drawn;
// (c) THE DETECTOR ON THE RECORD (6e's own reading, `tests/helpers/pageLaws/law6.mjs :: SOV_FACT`, against the houses' stored
//     descriptions and services): ZERO in the census towns where the cured lines printed beside no sovereign at afa46d644, and a
//     POSITIVE CONTROL, a free village built here whose market holds the charter line, on which it MUST fire. The rows: the
//     census's r2r-village-2 and r2r-village-6 (the market's charter "from crown or lord" in a village no lord, crown or war
//     governs), r2r-metropolis-34 (the Speaking Stones "held only by the crown"), each red at afa46d644; KEEP r2r-village-1 and
//     r2r-metropolis-41, where a sovereign stands and the original prints. And LAW 5 WIDENED's one twin of these files: the
//     butcher's "Beef, pork, mutton" under a siege (the hunger family), r2s-under_siege-town-0, red at afa46d644; KEEP r2r-town-1.
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { SOV_FACT } from '../helpers/pageLaws/law6.mjs';
import { SOVEREIGN_CRISES, SOVEREIGN_WORDS, sovereignOf } from '../../src/domain/facts/sovereign.js';
import * as V from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { LEAVES } from '../../src/domain/facts/factLayers.js';
import { resolveSibling } from '../../src/domain/facts/drawDeclared.js';
import { liveInstitutionNames } from '../../src/domain/facts/liveInstitutionNames.js';
import { canonStressors } from '../../src/domain/canonicalAccessors.js';
import { DESC_LATE_SIBLINGS } from '../../src/data/institutionDescVariants.js';
import { INSTITUTION_SERVICES, SERVICE_DESC_SIBLINGS } from '../../src/data/institutionServices.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { resolveServiceCatalogKey } from '../../src/generators/services/institutionServices.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** the census's dials (CENSUS-3 :: seedcfg.mjs, verbatim) */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** the census's r2r- and r2s- shapes (CENSUS-3 :: seedcfg.mjs) @param {string} seed */
function born(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  let cfg = m ? { ...DEFAULT_CONFIG, ...DIALS, settType: m[1] } : null;
  if (!cfg && (m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`)))) cfg = { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  if (!cfg && (m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`)))) {
    cfg = { ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true };
  }
  if (!cfg) throw new Error(`no shape for ${seed}`);
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

/** the late sets that declare the atom (found by their own declaration, never by a literal) */
const LATE = Object.entries(DESC_LATE_SIBLINGS).filter(([, set]) => set.some((/** @type {any} */ l) => (l.needs || []).includes('sovereign')));
/** the service definitions that declare it: [menu key, service name, desc] */
const SERVICES = Object.entries(INSTITUTION_SERVICES).flatMap(([key, menu]) => Object.entries(/** @type {Record<string, any>} */ (menu))
  .filter(([, d]) => Array.isArray(d?.needs) && d.needs.includes('sovereign')).map(([name, d]) => [key, name, String(d.desc)]));
/** the butcher's hunger set (LAW 5 WIDENED), found by its declaration */
const HUNGER = Object.entries(SERVICE_DESC_SIBLINGS).filter(([, set]) => set.some((/** @type {any} */ l) => (l.excludes || []).includes('crisis: hunger')));

/** 6e ON THE RECORD: a house's stored description or service that names a sovereign where the record gives none (the page
 * law's own supply reading, `SOV_FACT` over the government, the powers, the houses, the people, the neighbour and the
 * founding; a war or an occupation supplies the realm's). @param {any} s @returns {string[]} */
function sovereignNamedWithout(s) {
  const ps = s?.powerStructure || {};
  const supply = [ps.governingName, ps.government && JSON.stringify(ps.government), ...(ps.factions || []).map((/** @type {any} */ f) => f.faction),
    ...(s?.institutions || []).map((/** @type {any} */ i) => i.name), ...(s?.npcs || []).flatMap((/** @type {any} */ n) => [n?.role, n?.title]),
    JSON.stringify(s?.neighborRelationship || ''), JSON.stringify(s?.history?.founding || '')].join(' | ');
  if (SOV_FACT.test(supply) || sovereignOf(s) === true) return [];
  const texts = [...(s?.institutions || []).map((/** @type {any} */ i) => i?.desc), ...JSON.stringify(s?.availableServices ?? '').match(/"desc":"[^"]*"/g)?.map((x) => x.slice(8, -1)) ?? []];
  return texts.filter((t) => typeof t === 'string' && /\b(crown|lord'?s?|liege|overlord|monarch)\b/.test(t) && !/\bno (higher )?(lord|overlord|liege|crown)|crown or town|lord or municipality/i.test(t));
}

/** a free village: no lord, crown, noble or war anywhere in the record */
const FREE = { institutions: [{ name: 'Weekly market' }, { name: 'Village elder' }], powerStructure: { government: 'Elder council', factions: [{ faction: 'Elder Council' }] }, npcs: [{ role: 'Elder', title: 'Elder' }], history: { founding: { reason: 'good water' } } };

const ROWS = Object.freeze(['r2r-village-2', 'r2r-village-6', 'r2r-metropolis-34']);
const KEEP = Object.freeze(['r2r-village-1', 'r2r-metropolis-41']);
const SIEGE = 'r2s-under_siege-town-0';
const CALM = 'r2r-town-1';
/** the wide read's C16139 (the brewery's "regional distribution" under a siege) and its KEEP under a war that closes no road */
const BREW_SIEGE = 'bar0-city-under_siege+famine-rand-33';
const BREW_WAR = 'bar0-city-wartime-rand-34';
/** the brewery's siege sets (found by their declaration and their good, never a literal) */
const BREWERY = Object.entries(DESC_LATE_SIBLINGS).filter(([k, set]) => /\bale\b/.test(k) && set.some((/** @type {any} */ l) => (l.excludes || []).includes('crisis: under_siege')));
/** @type {Record<string, any>} */ const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...ROWS, ...KEEP, SIEGE, CALM, BREW_SIEGE, BREW_WAR]) towns[seed] = born(seed);
}, 600000);

describe('(a) the atom: a sovereign the record gives, or a war or an occupation supplies', () => {
  it('reads the government, a power, a house, a person, the founding and the two crises; a free village reads none', () => {
    expect(sovereignOf(FREE)).toBe(false);
    expect(sovereignOf({ ...FREE, institutions: [...FREE.institutions, { name: "Lord's steward" }] })).toBe(true);
    expect(sovereignOf({ ...FREE, powerStructure: { factions: [{ faction: 'Noble House' }] } })).toBe(true);
    expect(sovereignOf({ ...FREE, npcs: [{ role: 'Baron', title: 'Baron' }] })).toBe(true);
    expect(sovereignOf({ ...FREE, history: { founding: { reason: 'lands granted by the crown' } } })).toBe(true);
    expect(SOVEREIGN_CRISES).toEqual(['wartime', 'occupied']);
    expect(sovereignOf({ ...FREE, stress: [{ type: 'wartime' }] })).toBe(true);
    expect(sovereignOf({ ...FREE, stress: [{ type: 'famine' }] })).toBe(false);
  });
  it('reads whole words ("making" holds no king) and is unanswered with no record', () => {
    expect(sovereignOf({ ...FREE, history: { founding: { reason: 'making salt' } } })).toBe(false);
    expect(sovereignOf(null)).toBeUndefined();
  });
  it('is a declarable presence atom, homed in factsOf and in the layer table (layer 4: the cast and the history)', () => {
    expect(V.assertDeclarable('sovereign').dimension).toBe('sovereign');
    expect(V.FACT_DIMENSIONS.sovereign).toMatchObject({ shape: 'presence', home: 'sovereign' });
    expect(LEAVES.sovereign).toMatchObject({ layer: 4 });
    expect(V.atomHolds('sovereign', factsOf(FREE))).toBe(false);
    expect(V.atomHolds('sovereign', factsOf({ ...FREE, institutions: [{ name: 'Royal seat' }] }))).toBe(true);
  });
});

/** THE HOMES' READING (the chair's ruling on EG1): the atom as its two homes would read it, `canonStressors` and
 * `liveInstitutionNames`; the leaf spells both inline (it imports nothing), and this holds the two equal. @param {any} r */
function byTheHomes(r) {
  if (!r || typeof r !== 'object') return undefined;
  if (canonStressors(r).some((/** @type {any} */ e) => !!e && typeof e === 'object' && ['wartime', 'occupied', 'occupation'].includes(String(e.type)))) return true;
  const ps = r.powerStructure && typeof r.powerStructure === 'object' ? r.powerStructure : {};
  const t = (/** @type {unknown} */ v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? JSON.stringify(v) : '');
  return [t(ps.government), t(ps.governingName), ...(Array.isArray(ps.factions) ? ps.factions.map((/** @type {any} */ f) => t(f?.faction)) : []),
    ...liveInstitutionNames(r), ...(Array.isArray(r.npcs) ? r.npcs.flatMap((/** @type {any} */ n) => [t(n?.role), t(n?.title)]) : []), t(r.history?.founding)]
    .some((x) => x !== '' && SOVEREIGN_WORDS.test(x));
}

describe('(a2) the inline readers equal their homes (the leaf imports nothing: EG1)', () => {
  const steward = { name: "Lord's steward" };
  const CASES = [
    FREE, { ...FREE, institutions: [steward] }, { ...FREE, institutions: [{ ...steward, status: 'ruined' }] },
    { ...FREE, institutions: [{ ...steward, status: 'Destroyed' }] }, { ...FREE, institutions: [{ ...steward, status: 'remnant' }] },
    { ...FREE, institutions: [{ ...steward, status: 'removed' }] }, { ...FREE, institutions: [{ ...steward, _worldPulseInactive: true }] },
    { ...FREE, institutions: [{ ...steward, isCustom: true }] }, { ...FREE, institutions: [{ ...steward, source: 'custom' }] },
    { ...FREE, institutions: [{ ...steward, customDefinitionId: 'x' }] }, { ...FREE, institutions: [{ ...steward, custom: true }] },
    { ...FREE, institutions: [{ ...steward, customDefinitionCategory: 'x' }] }, { ...FREE, institutions: [null, 'Royal seat', steward] },
    { ...FREE, stressors: [{ type: 'occupation' }] }, { ...FREE, stress: { type: 'wartime' } }, { ...FREE, stressors: { type: 'occupied' } },
    { ...FREE, stresses: [{ type: 'wartime' }] }, { ...FREE, stressors: [], stress: [{ type: 'wartime' }] }, { ...FREE, stress: [null, { type: 'famine' }] },
  ];
  it('on every branch of the two readers, built here', () => {
    for (const [i, r] of CASES.entries()) expect({ i, atom: sovereignOf(r) }).toEqual({ i, atom: byTheHomes(r) });
  });
  it('on every census town this guard bears (the 720 and the fresh 300 were measured whole at the commit: equal in every town)', () => {
    const failures = collectSeedFailures(Object.keys(towns), (seed) => { expect(sovereignOf(towns[seed])).toBe(byTheHomes(towns[seed])); });
    expectNoSeedFailures(failures, 'the leaf reads as its homes do');
  });
});

describe('(b) the declaring lines', () => {
  it('every late set that needs a sovereign has one twin that excludes it and names none', () => {
    expect(LATE.length).toBeGreaterThanOrEqual(2);
    for (const [key, set] of LATE) {
      const twin = set.find((/** @type {any} */ l) => l.twinOf === key);
      expect(twin?.excludes).toEqual(['sovereign']);
      expect(SOVEREIGN_WORDS.test(String(twin?.text))).toBe(false);
      expect(resolveSibling(key, DESC_LATE_SIBLINGS, { facts: factsOf(FREE), poolId: 'bar6', surface: 'institutions', drawKind: 'H' })).toBe(twin?.text);
      expect(resolveSibling(key, DESC_LATE_SIBLINGS, { facts: factsOf({ ...FREE, stress: [{ type: 'occupied' }] }), poolId: 'bar6', surface: 'institutions', drawKind: 'H' })).toBe(key);
    }
  });
  it('every service that declares it is its own house\'s, and every house drawn with that menu names the sovereign', () => {
    expect(SERVICES.length).toBe(8);
    const keys = new Set(SERVICES.map(([k]) => k));
    for (const k of keys) expect(SOVEREIGN_WORDS.test(k)).toBe(true);
    const drawnWith = Object.values(institutionalCatalog).flatMap((shelves) => Object.values(/** @type {Record<string, any>} */ (shelves)).flatMap((rows) => Object.keys(rows)))
      .filter((name) => keys.has(String(resolveServiceCatalogKey(name))));
    expect(drawnWith.length).toBeGreaterThan(0);
    for (const name of drawnWith) expect({ name, gives: SOVEREIGN_WORDS.test(name) }).toEqual({ name, gives: true });
  });
  it('the butcher\'s meats declare the hunger family, and the twin names no meat the siege or the famine denies', () => {
    expect(HUNGER.length).toBe(1);
    const [key, set] = HUNGER[0];
    const twin = set.find((/** @type {any} */ l) => l.twinOf === key);
    expect(twin?.crisis).toEqual(['hunger']);
    expect(/\b(beef|pork|mutton)\b/i.test(String(twin?.text))).toBe(false);
  });
});

describe('(c) the detector on the record: 6e of the houses', () => {
  it('POSITIVE CONTROL: a free village whose market holds the charter line fires; with a lord\'s steward it does not', () => {
    const [charter] = LATE.map(([k]) => k).filter((k) => /charter/.test(k));
    expect(sovereignNamedWithout({ ...FREE, institutions: [{ name: 'Weekly market', desc: charter }] })).toEqual([charter]);
    expect(sovereignNamedWithout({ ...FREE, institutions: [{ name: 'Weekly market', desc: charter }, { name: "Lord's steward" }] })).toEqual([]);
  });
  it('THE ZERO: no house names a sovereign beside none in the towns where it printed at afa46d644, and the twin prints in its place', () => {
    const late = new Map(LATE.map(([key, set]) => [key, set.find((/** @type {any} */ l) => l.twinOf === key).text]));
    const failures = collectSeedFailures([...ROWS], (seed) => {
      const s = towns[seed];
      expect(sovereignNamedWithout(s)).toEqual([]);
      const descs = (s.institutions || []).map((/** @type {any} */ i) => String(i.desc));
      expect(descs.some((d) => [...late.values()].includes(d))).toBe(true);
    });
    expectNoSeedFailures(failures, '6e of the houses: zero where it printed at afa46d644');
  });
  it('KEEP: where a sovereign stands the original prints', () => {
    const failures = collectSeedFailures([...KEEP], (seed) => {
      const s = towns[seed];
      expect(sovereignOf(s)).toBe(true);
      expect((s.institutions || []).some((/** @type {any} */ i) => LATE.some(([k]) => k === i.desc))).toBe(true);
    });
    expectNoSeedFailures(failures, 'the originals stand under a sovereign');
  });
  it(`the butcher under a siege (${SIEGE}) sells what meat can be had; in a calm town (${CALM}) the three meats`, () => {
    const [key, set] = HUNGER[0];
    const twin = set.find((/** @type {any} */ l) => l.twinOf === key).text;
    const descsOf = (/** @type {any} */ s) => JSON.stringify(s?.availableServices ?? '').match(/"desc":"[^"]*"/g)?.map((x) => x.slice(8, -1)) ?? [];
    expectAbsentWithAnchor(descsOf(towns[SIEGE]), key, twin, `${SIEGE}: the twin prints, and no beef, pork and mutton`);
    expect(descsOf(towns[CALM])).toContain(key);
  });
});

describe('LAW 5 WIDENED: the brewery sends nothing out through a siege (the wide read\'s C16139)', () => {
  it(`${BREW_SIEGE}: the twin is stored where the original stood at afa46d644; under a war (${BREW_WAR}) the original stands`, () => {
    expect(BREWERY.length).toBe(2);
    const twins = BREWERY.map(([k, set]) => set.find((/** @type {any} */ l) => l.twinOf === k).text);
    const descs = (/** @type {any} */ s) => (s.institutions || []).map((/** @type {any} */ i) => String(i.desc));
    const [original] = BREWERY.map(([k]) => k).filter((k) => descs(towns[BREW_WAR]).includes(k));
    expect(original).toBeTypeOf('string');
    expectAbsentWithAnchor(descs(towns[BREW_SIEGE]), original, twins[BREWERY.findIndex(([k]) => k === original)], `${BREW_SIEGE}: the twin, not the original`);
  });
});

describe('LAW 5 WIDENED: the reviewed reasons of these files are live (no stale row)', () => {
  it('every row of G.exclusions.HOUSES.json is a text of its own file', () => {
    const rows = JSON.parse(readFileSync(new URL('../../docs/chair/2026-11-16/bar6/AUDIT/tables/G.exclusions.HOUSES.json', import.meta.url), 'utf8'));
    expect(rows.length).toBeGreaterThan(200);
    const src = /** @type {Record<string, string>} */ ({});
    const stale = rows.filter((/** @type {any} */ r) => !(src[r.file] ??= readFileSync(new URL(`../../${r.file}`, import.meta.url), 'utf8')).includes(r.text.slice(0, 60).replace(/'/g, "\\'")) && !src[r.file].includes(r.text.slice(0, 60)));
    expect(stale).toEqual([]);
    for (const r of rows) expect(typeof r.reason === 'string' && r.reason.length > 20).toBe(true);
  });
});
