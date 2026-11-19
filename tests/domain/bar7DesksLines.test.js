/**
 * tests/domain/bar7DesksLines.test.js — BAR7-DESKS's guard (BRIEF-BAR7, section BAR7-DESKS; 2026-11-17; vetoable by the
 * owner). A LAW OVER FIXED SEEDS: the sixth read's thirty towns (`bar0-<shape>-rand-<42..44>`), each line of the economy,
 * defence and power desks this seat declared read against the state that denies it, in every one of the thirty; and the
 * twelve slash labels, each planted in the economy desk's `{institution}` slot. It fails at the seat's base (5e81f0622):
 * the lines declared no such band, the `rival rings` atom did not exist and the labels printed with their slashes.
 *
 *   item 1  DS-ECO-8 COMFORTABLE v3 ("past subsistence" struck; "the stores are more than the season needs") needs three
 *           months of stores; its twin takes the towns it is refused in (C18905);
 *   item 2  DS-DEF-12 "CAPACITY: ample" v1, v2 and v3 need the food word Secure or better and no hunger; their twins take
 *           Pressured and a hunger, each by its stores (C41011; the states no town holds are PLANTED); the static half's other strong food
 *           lines declare their band (DS-ECO-2 v1, DS-ECO-8 full stores v1 and v4) or name the trade they mean (DS-ECO-3, in no word of the plenty class);
 *   item 3  the ledger line says money ("purse", "money laid by") and keeps "closes every year ahead" (C12371, C27960);
 *   item 4  DS-ECO-9's one-source line is drawn only where the printed foodways line names its source first (C41850);
 *   item 5  DS-ECO-10's entrepôt line reads the printed import list (C32912);
 *   item 6  DS-DEF-4's turf war needs rival rings (the new atom, read as the crime key reads them), no occupation and a law
 *           below Surplus (C23038, C39691); its twins count no house and presume no curfew (the second reader);
 *   item 7  the twelve free-seat lines of the power desk are refused under an occupation (C40850);
 *   item 8  a slash label takes its prose form in `{institution}`, and the verb and the pronoun agree (C25601).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { eligibleVariants, variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { criminalStructureKeyOf, THIEVES_GUILD_HOUSE } from '../../src/domain/facts/criminalStructureKey.js';
import { economyStateProse } from '../../src/domain/display/stateProse/economyStateProse.js';
import { deriveExportPosture } from '../../src/domain/display/exportPosture.js';
import { tradeListsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { foodwaysLineOf } from '../../src/domain/foodways.js';
import { rivalRingsOf } from '../../src/domain/corruption.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** CENSUS-3 seedcfg.mjs, its bar0 arm verbatim (as `bar6CrimeOneReading.test.js` spells it). @param {string} seed */
const cfgFor = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
};
const SHAPES = ['thorp-calm', 'hamlet-calm', 'hamlet-under_siege', 'village-famine', 'village-calm', 'town-calm', 'town-occupied', 'city-under_siege+famine', 'city-wartime', 'metropolis-calm'];
/** The sixth read's thirty. */
const THIRTY = SHAPES.flatMap((s) => [42, 43, 44].map((n) => `bar0-${s}-rand-${n}`));
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return towns.get(seed);
};

/** Every variant of a desk with its block and pool. @param {Record<string, any>} desk */
const variantsOf = (desk) => Object.entries(desk).flatMap(([block, b]) => Object.entries(b?.pools || {})
  .flatMap(([pool, vs]) => (vs || []).map((/** @type {any} */ v) => ({ block, pool, v }))));
const ECO = variantsOf(DOSSIER_STATE_PROSE_ECONOMY);
const DEF = variantsOf(DOSSIER_STATE_PROSE_DEFENSE);
const POW = variantsOf(DOSSIER_STATE_PROSE_POWER);
/** The one variant of a desk whose text matches. @param {ReturnType<typeof variantsOf>} desk @param {RegExp} re */
const theLine = (desk, re) => {
  const hit = desk.filter((x) => re.test(x.v.text));
  expect(hit.length, `one line matches ${re}`).toBe(1);
  return hit[0];
};
/** Does the line's declaration admit the town? @param {{ v: any }} line @param {unknown} s */
const admits = (line, s) => declarationAdmits(variantFactDeclaration(line.v), /** @type {never} */ (factsOf(s))).admitted;
/** A PLANTED state: a real town's facts with some answers replaced (the states no town of the populations holds). @param {object} f @param {Record<string, unknown>} over */
const plant = (f, over) => Object.create(f, Object.fromEntries(Object.entries(over).map(([k, value]) => [k, { value }])));
/** Does the line admit the planted facts? @param {{ v: any }} line @param {object} f */
const admitsFacts = (line, f) => declarationAdmits(variantFactDeclaration(line.v), /** @type {never} */ (f)).admitted;

beforeAll(async () => { await loadGenerationLawPayloads(); THIRTY.forEach((seed) => town(seed)); }, 600_000); // seed-loop: births only, no assertion

describe('items 1 and 2 · the plenty lines declare the band that denies them, over the thirty', () => {
  test('COMFORTABLE v3 ("the stores are more than the season needs") is refused under three months of stores; it no longer says "past subsistence"', () => {
    const v3 = theLine(ECO, /the stores are more than the season needs\.$/);
    expect(v3.pool).toBe('COMFORTABLE');
    expect(v3.v.text).not.toMatch(/past subsistence/); // anchored: theLine found exactly this one variant's text
    const twin = theLine(ECO, /though nobody here keeps more in store than the coming season needs\.$/);
    let short = 0;
    expectNoSeedFailures(collectSeedFailures(THIRTY, (seed) => {
      const f = factsOf(town(seed));
      if (typeof f.storesMonths === 'number' && f.storesMonths < 3) { short += 1; expect(admits(v3, town(seed)), seed).toBe(false); }
      // the twin takes exactly the towns v3 is refused in by its stores (never beside v3: one of the two)
      expect(admits(v3, town(seed)) && admits(twin, town(seed)), seed).toBe(false);
    }), 'COMFORTABLE v3 refused under three months of stores, never beside its twin');
    expect(short).toBeGreaterThan(0);
  });
  test('DS-DEF-12 ample v1, v2 and v3 are refused where the food word is Pressured or a hunger holds; the Pressured twins read the stores', () => {
    const v1 = theLine(DEF, /it keeps itself supplied with room to spare, even in a bad year\.$/);
    const v2 = theLine(DEF, /has more put by than a bad year would take, so having no road costs it little\.$/);
    const v3 = theLine(DEF, /the town has more than enough to get through a hard year\.$/);
    // every Pressured line names its stores band; each is admitted exactly where the town's stores meet it
    const pressuredLines = DEF.filter((x) => x.pool === 'CAPACITY: ample' && (x.v.marks || []).includes('food: pressured'));
    const bandOf = (/** @type {any} */ x) => (x.v.marks || []).map((/** @type {string} */ m) => /^stores: (≥|<) (\d+)$/.exec(m)).find(Boolean);
    expect(pressuredLines.map((x) => [x.v.vid, bandOf(x)?.slice(1).join(' ')])).toEqual([[5, '≥ 1'], [6, '≥ 1'], [9, '≥ 2'], [10, '< 1']]);
    const meets = (/** @type {any} */ x, /** @type {number} */ months) => { const [, op, n] = bandOf(x); return op === '≥' ? months >= Number(n) : months < Number(n); };
    let pressured = 0;
    expectNoSeedFailures(collectSeedFailures(THIRTY, (seed) => {
      const s = town(seed);
      const f = factsOf(s);
      const band = f.famine?.shownBand ?? f.famine?.band;
      const want = [];
      const got = [];
      if (band === 'pressured' || f.crisis?.has?.('under_siege') || f.crisis?.has?.('famine')) { want.push(false, false, false); got.push(...[v1, v2, v3].map((v) => admits(v, s))); }
      if (band === 'pressured') {
        pressured += 1;
        want.push(...pressuredLines.map((x) => meets(x, Number(f.storesMonths))));
        got.push(...pressuredLines.map((x) => admits(x, s)));
      }
      expect(got, seed).toEqual(want);
    }), 'DS-DEF-12 ample: v1-v3 refused under Pressured or a hunger; the Pressured lines by their stores');
    expect(pressured).toBeGreaterThan(0);
    expect(admits(v3, town('bar0-town-occupied-rand-44'))).toBe(false); // C41011
  });
  // THE STATES NO TOWN OF THE THREE POPULATIONS HOLDS (the second reader, 2026-11-17): planted on a real town's facts.
  test('planted: Pressured with no stores, and Secure under a hunger with stores and without', () => {
    const calm = factsOf(town('bar0-town-occupied-rand-44')); // Pressured, 5.4 months of stores
    const siege = factsOf(town('bar0-hamlet-under_siege-rand-42')).crisis;
    const secure = { band: 'secure', shownBand: 'secure' };
    const ample = DEF.filter((x) => x.block === 'DS-DEF-12' && x.pool === 'CAPACITY: ample');
    const said = (/** @type {object} */ f) => ample.filter((x) => admitsFacts(x, f)).map((x) => x.v.vid).sort((a, b) => a - b);
    // THE TOTALITY TABLE (the second reader's third pass): every food band × hunger × stores cell keeps a line, and each line
    // claims no more than its floor bears (v2 cites the stores count: three months; v7 "more than it needed": three; v9
    // "can make up what its own food falls short by": two, a Pressured gap being up to 1.8 months of a year)
    expect(said(plant(calm, { storesMonths: 0.5 }))).toEqual([10]);
    expect(said(plant(calm, { storesMonths: 1.5 }))).toEqual([5, 6]);
    expect(said(plant(calm, { storesMonths: 4 }))).toEqual([5, 6, 9]);
    expect(said(plant(calm, { famine: secure, crisis: siege, storesMonths: 0.5 }))).toEqual([11]);
    expect(said(plant(calm, { famine: secure, crisis: siege, storesMonths: 1.5 }))).toEqual([8]);
    expect(said(plant(calm, { famine: secure, crisis: siege, storesMonths: 4 }))).toEqual([7, 8]);
    expect(said(plant(calm, { famine: secure, storesMonths: 1.5 }))).toEqual([1, 3]);
    expect(said(plant(calm, { famine: secure, storesMonths: 4 }))).toEqual([1, 2, 3]);
    expect(said(plant(calm, { famine: { band: 'deficit', shownBand: 'deficit' }, storesMonths: 4 }))).toEqual([4]);
  });
  test('planted: DS-ECO-2 FOOD surplus under a hunger draws its hunger lines and never v1', () => {
    const pool = DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-2'].pools['FOOD: surplus'];
    const f = factsOf(town('bar0-hamlet-under_siege-rand-42'));
    const under = eligibleVariants(pool, { dimensions: { hunger: 'hunger' }, facts: f, slots: { settlement: 'Plantford' } }).map((v) => v.vid).sort((a, b) => a - b);
    expect(under).toEqual([4, 5, 6]);
    const calm = eligibleVariants(pool, { dimensions: { hunger: 'no hunger' }, facts: factsOf(town('bar0-town-calm-rand-42')), slots: { settlement: 'Plantford' } }).map((v) => v.vid);
    expect(calm).toContain(1);
    expect(calm.some((vid) => [4, 5, 6].includes(vid))).toBe(false);
  });
  test('the static half\'s other strong food lines declare their band, or name the trade they mean', () => {
    expect(theLine(ECO, /eats well below what it raises\./).v.marks).toContain('no hunger');
    expect(theLine(ECO, /^Full stores help \{settlement\}'s fortunes\./).v.marks).toContain('food surplus');
    expect(theLine(ECO, /grows more food than it eats, and what it sells of the surplus/).v.marks).toContain('food surplus');
    expect(ECO.some((x) => /^Plenty passes here\./.test(x.v.text))).toBe(false);
    theLine(ECO, /^A great deal of trade passes here\. Not much of it stops\.$/);
  });
});

describe('item 3 · the ledger line says money and keeps its words', () => {
  test('"closes every year ahead" names the purse and the money laid by; its declaration is kept', () => {
    const v1 = theLine(ECO, /closes every year ahead\./);
    expect(v1.pool).toBe('COMFORTABLE');
    expect(v1.v.text).toMatch(/^\{settlement\}'s purse closes every year ahead\./);
    expect(v1.v.text).toMatch(/money laid by/);
    expect(v1.v.marks).toEqual(['no crisis: indebted']);
  });
  test('the negatives C12371 (bar0-city-wartime-rand-42) and C27960 (bar0-metropolis-calm-rand-43) still print it', () => {
    expectNoSeedFailures(collectSeedFailures([['bar0-city-wartime-rand-42'], ['bar0-metropolis-calm-rand-43']], ([seed]) => {
      const s = town(seed);
      const out = economyStateProse(s, { exportPosture: deriveExportPosture(s) }, { seed: String(s._seed ?? s.id ?? '') });
      expect(JSON.stringify(out.prosperityRung)).toMatch(/purse closes every year ahead/);
    }), 'every negative town still prints it');
  });
});

describe('items 4 and 5 · the economy desk reads the lines the page prints, over the thirty', () => {
  const SOURCE_FIRST = /comes first of all from its (\w+)/;
  test('no one-source line names a first source the printed foodways line does not name first (C41850)', () => {
    const v42 = town('bar0-village-calm-rand-42');
    expect(foodwaysLineOf(v42)).toMatch(/^Its own fields give it grain/);
    expectNoSeedFailures(collectSeedFailures(THIRTY, (seed) => {
      const s = town(seed);
      const said = JSON.stringify(economyStateProse(s, { exportPosture: deriveExportPosture(s) }, { seed: String(s._seed ?? s.id ?? '') }).foodSources ?? '');
      const m = SOURCE_FIRST.exec(said);
      if (!m) return;
      const printed = foodwaysLineOf(s) || '';
      expect(/^Its own fields give it grain/.test(printed), `${seed}: "${m[0]}" beside "${printed}"`).toBe(false);
    }), 'no one-source line beside a foodways line that names the fields first');
  });
  test('no entrepôt line says goods entered as imports where the printed import list holds none (C32912)', () => {
    let seen = 0;
    expectNoSeedFailures(collectSeedFailures(THIRTY, (seed) => {
      const s = town(seed);
      if (tradeListsAsPrinted(s).imports.length > 0) return;
      const said = JSON.stringify(economyStateProse(s, { exportPosture: deriveExportPosture(s) }, { seed: String(s._seed ?? s.id ?? '') }).exportPosture ?? '');
      // every no-import town of the thirty, entrepôt or not (the population of 748ec2db3); the entrepôt towns also hold
      // their posture printed, and the count below proves some stand
      if (deriveExportPosture(s).status === 'entrepot') { seen += 1; expect(said.length, seed).toBeGreaterThan(10); }
      expect(said, seed).not.toMatch(/sells on goods it never made|entered it as imports/); // anchored: entrepôt towns print a posture (checked above, counted below)
    }), 'no entrepôt line beside "No recorded imports."');
    expect(seen).toBeGreaterThan(0);
  });
});

describe('item 6 · the turf war declares the rings it asserts (the new atom `rival rings`)', () => {
  test('the atom reads the rings the crime key reads (`rivalRingsHere`), on every one of the thirty and planted', () => {
    // the key's own reading is private to its leaf: spelled here for the guard only, never in src
    const here = (/** @type {any} */ s) => rivalRingsOf(s.powerStructure?.factions, s.institutions)
      && !((s.powerStructure?.factions || []).some((/** @type {any} */ f) => f?.category === 'criminal' && (f?.isGoverning === true || f?.powerLabel === 'Dominant'))
        || (s.institutions || []).some((/** @type {any} */ i) => THIEVES_GUILD_HOUSE.test(String(i?.name ?? ''))));
    expectNoSeedFailures(collectSeedFailures(THIRTY, (seed) => {
      const s = town(seed);
      // no town of the thirty holds a ruined criminal house, so the live roster and the raw one agree here
      expect([factsOf(s).rivalRings, factsOf(s).rivalRings], seed)
        .toEqual([here(s), rivalRingsOf(s.powerStructure?.factions, s.institutions) && criminalStructureKeyOf(s) === 'semi-organized']);
    }), 'the atom reads the rings the crime key reads');
    const two = [{ name: 'Black Hand', category: 'criminal' }, { name: 'Red Knives', category: 'criminal' }];
    expect(factsOf({ powerStructure: { factions: two }, institutions: [] }).rivalRings).toBe(true);
    // one of them Dominant: one organisation rules, and the key is `organized`: no rival rings, though `rivalRingsOf` holds
    const dominant = [{ ...two[0], powerLabel: 'Dominant' }, two[1]];
    expect(rivalRingsOf(dominant, [])).toBe(true);
    expect(factsOf({ powerStructure: { factions: dominant }, institutions: [] }).rivalRings).toBe(false);
    expect(factsOf({ powerStructure: { factions: two }, institutions: [{ name: "Thieves' guild chapter" }] }).rivalRings).toBe(false);
    // a RUINED "Multiple criminal factions" is no ring (the ruin filter, `institutionRoster.js :: liveInstitutions`)
    expect(factsOf({ powerStructure: { factions: [] }, institutions: [{ name: 'Multiple criminal factions' }] }).rivalRings).toBe(true);
    expect(factsOf({ powerStructure: { factions: [] }, institutions: [{ name: 'Multiple criminal factions', status: 'ruined' }] }).rivalRings).toBe(false);
  });
  test('the twins count no house and presume no curfew', () => {
    const v4 = theLine(DEF, /no crew is contesting the streets with it\.$/);
    expect(v4.v.text).not.toMatch(/\bone house\b|fighting over who runs the streets/); // anchored: theLine found exactly this variant
    const v5 = theLine(DEF, /keep out of sight under the occupation, and their quarrel waits\.$/);
    expect(v5.v.text).not.toMatch(/curfew/); // anchored: theLine found exactly this variant
  });
  test('"Rival crews ... are fighting over who runs the streets" is refused with no rings, under an occupation, beside a Surplus law', () => {
    const v3 = theLine(DEF, /^Rival crews at \{settlement\} are fighting over who runs the streets/);
    expectNoSeedFailures(collectSeedFailures(THIRTY, (seed) => {
      const s = town(seed);
      const f = factsOf(s);
      if (!f.rivalRings || f.crisis?.has?.('occupied') || f.lawBand === 'surplus') expect(admits(v3, s), seed).toBe(false);
    }), 'the turf war refused with no rings, under an occupation, beside a Surplus law');
    expect(admits(v3, town('bar0-metropolis-calm-rand-42'))).toBe(false); // C23038: rings, Very Safe, law Surplus
    expect(admits(v3, town('bar0-town-occupied-rand-43'))).toBe(false); // C39691: a lone gambling den, under a curfew
  });
  // RE-KEYED BY IDENTITY (2026-11-18, BAR8-DESKS-2, ruling BR32 (1)): DESKS-DEF's 13f twin v7 ("No one boss runs the
  // crime at {settlement} …", `crime: ≤ semi-organized`) joined this pool, so the line and its twins are FIVE (v3 to v7,
  // was four: "three twins"); its second reader proved the per-town claim holds with five (exactly one of v3 to v7 stands
  // in each town of the key). The set is held by its vids, not by a count of whatever sits at vid ≥ 3.
  test('exactly one of the line and its four twins stands in each village or larger town keyed semi-organised', () => {
    const five = DEF.filter((x) => x.block === 'DS-DEF-4' && x.pool === 'structure semi-organized' && x.v.vid >= 3);
    expect(five.map((x) => x.v.vid)).toEqual([3, 4, 5, 6, 7]);
    expectNoSeedFailures(collectSeedFailures(THIRTY, (seed) => {
      const s = town(seed);
      if (factsOf(s).crime !== 'semi-organized' || ['thorp', 'hamlet'].includes(s.tier)) return;
      expect(five.filter((x) => admits(x, s)).length, seed).toBe(1);
    }), 'exactly one of the turf-war line and its twins');
  });
});

describe('item 7 · the twelve free-seat lines of the power desk are refused under an occupation', () => {
  const FREE = /\b(one audience with the \{seat\} gets a decision|the answer comes quickly|can plan a season ahead on its word|knows who decides, and nobody expects that to change|Every decision about \{settlement\} is taken by|what it decides carries in most quarters|make an unpopular decision and still be obeyed|there is nobody else to be sent to|decides things the way a business does|what the hall decides is decided by that combination|Soldiers carry out the \{seat\}'s orders|rules by its faith: every decision)\b/;
  test('twelve lines, each declaring no occupation, each refused in the three occupied towns (C40850)', () => {
    const free = POW.filter((x) => FREE.test(x.v.text) && !(x.v.marks || []).includes('dm-only'));
    expect(free.length).toBe(12);
    for (const line of free) {
      expect(line.v.marks, line.v.text).toContain('no crisis: occupied');
      expect([42, 43, 44].map((n) => admits(line, town(`bar0-town-occupied-rand-${n}`))), line.v.text).toEqual([false, false, false]);
    }
  });
  test('the occupation twins say what the Power tab says', () => {
    const twins = POW.filter((x) => (x.v.marks || []).includes('crisis: occupied') && /carries out what the occupiers decide|carry out the occupiers' orders/.test(x.v.text));
    expect(twins.length).toBe(6);
    for (const t of twins.filter((x) => !(x.v.marks || []).some((m) => m === 'garrison'))) {
      expect([42, 43, 44].map((n) => admits(t, town(`bar0-town-occupied-rand-${n}`))), t.v.text).toEqual([true, true, true]);
    }
  });
});

describe('item 8 · a slash label takes its prose form in {institution}', () => {
  const LABELS = ['Weavers/Textile workers', 'Palace/government complex', 'Small prison/stocks', 'Colosseum/arena', 'Docks/port facilities',
    'Sage/library', 'Spa/healing house', 'Hot Springs / Healing Waters', 'Livestock / game', 'Wool / flax', 'Desert/Arid', 'Monster Hunters / Adventurers'];
  test('planted: every slash label takes its prose form', () => {
    expectNoSeedFailures(collectSeedFailures(LABELS.map((l) => [l]), ([label]) => {
      const out = economyStateProse({ name: 'Plantford', economicState: {} }, { impairedInstitution: label }, { seed: 'bar7-desks' });
      const said = JSON.stringify(out.impairedService ?? '');
      expect(said).toMatch(/Plantford's [A-Z]/);
      expect(said).not.toMatch(/\//); // anchored: the line above holds the sentence printed
      // every form is singular: the desk's own singular verbs and "its" agree with it
      expect(said).not.toMatch(/Plantford's [A-Z][^"]*?s (?:is|can|does|still) /); // anchored: two lines above hold the sentence printed
    }), 'every slash label takes its prose form');
  });
  test('the sixth read\'s town prints the house\'s form (C25601)', () => {
    const s = town('bar0-metropolis-calm-rand-43');
    const out = economyStateProse(s, { exportPosture: deriveExportPosture(s), impairedInstitution: 'Weavers/Textile workers' }, { seed: String(s._seed ?? s.id ?? '') });
    expect(JSON.stringify(out.impairedService ?? '')).toMatch(/Weaving house/);
  });
});
