/**
 * tests/domain/bar7DesksLines.test.js — BAR7-DESKS's guard (BRIEF-BAR7, section BAR7-DESKS; 2026-11-17; vetoable by the
 * owner). A LAW OVER FIXED SEEDS: the sixth read's thirty towns (`bar0-<shape>-rand-<42..44>`), each line of the economy,
 * defence and power desks this seat declared read against the state that denies it, in every one of the thirty; and the
 * twelve slash labels, each planted in the economy desk's `{institution}` slot. It fails at the seat's base (5e81f0622):
 * the lines declared no such band, the `rival rings` atom did not exist and the labels printed with their slashes.
 *
 *   item 1  DS-ECO-8 COMFORTABLE v3 ("past subsistence" struck; "the stores are more than the season needs") needs three
 *           months of stores; its twin takes the towns it is refused in (C18905);
 *   item 2  DS-DEF-12 "CAPACITY: ample" v1 and v3 ("more than enough to get through a hard year") need the food word
 *           Secure or better and no hunger; their twins take Pressured (C41011); the static half's other strong food
 *           lines declare their band (DS-ECO-2 v1, DS-ECO-8 full stores v1 and v4) or name the trade they mean (DS-ECO-3);
 *   item 3  the ledger line says money ("purse", "money laid by") and keeps "closes every year ahead" (C12371, C27960);
 *   item 4  DS-ECO-9's one-source line is drawn only where the printed foodways line names its source first (C41850);
 *   item 5  DS-ECO-10's entrepôt line reads the printed import list (C32912);
 *   item 6  DS-DEF-4's turf war needs rival rings (the new atom), no occupation and a law below Surplus (C23038, C39691);
 *   item 7  the twelve free-seat lines of the power desk are refused under an occupation (C40850);
 *   item 8  a slash label takes its prose form in `{institution}`, and the verb and the pronoun agree (C25601).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
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

beforeAll(async () => { await loadGenerationLawPayloads(); for (const seed of THIRTY) town(seed); }, 600_000);

describe('items 1 and 2 · the plenty lines declare the band that denies them, over the thirty', () => {
  test('COMFORTABLE v3 ("the stores are more than the season needs") is refused under three months of stores; it no longer says "past subsistence"', () => {
    const v3 = theLine(ECO, /the stores are more than the season needs\.$/);
    expect(v3.pool).toBe('COMFORTABLE');
    expect(v3.v.text).not.toMatch(/past subsistence/);
    const twin = theLine(ECO, /though nobody here keeps more in store than the coming season needs\.$/);
    let short = 0;
    for (const seed of THIRTY) {
      const f = factsOf(town(seed));
      if (typeof f.storesMonths === 'number' && f.storesMonths < 3) { short += 1; expect(admits(v3, town(seed)), seed).toBe(false); }
      // the twin takes exactly the towns v3 is refused in by its stores (never beside v3: one of the two)
      expect(admits(v3, town(seed)) && admits(twin, town(seed)), seed).toBe(false);
    }
    expect(short).toBeGreaterThan(0);
  });
  test('DS-DEF-12 ample v1 and v3 are refused where the food word is Pressured or a hunger holds; the twins take Pressured', () => {
    const v1 = theLine(DEF, /it keeps itself supplied with room to spare, even in a bad year\.$/);
    const v3 = theLine(DEF, /the town has more than enough to get through a hard year\.$/);
    const tw = DEF.filter((x) => x.pool === 'CAPACITY: ample' && (x.v.marks || []).includes('food: pressured'));
    expect(tw.length).toBe(2);
    let pressured = 0;
    for (const seed of THIRTY) {
      const s = town(seed);
      const f = factsOf(s);
      const band = f.famine?.shownBand ?? f.famine?.band;
      if (band === 'pressured' || f.crisis?.has?.('under_siege') || f.crisis?.has?.('famine')) {
        expect(admits(v1, s), seed).toBe(false);
        expect(admits(v3, s), seed).toBe(false);
      }
      if (band === 'pressured') { pressured += 1; for (const t of tw) expect(admits(t, s), seed).toBe(true); }
    }
    expect(pressured).toBeGreaterThan(0);
    expect(admits(v3, town('bar0-town-occupied-rand-44'))).toBe(false); // C41011
  });
  test('the static half\'s other strong food lines declare their band, or name the trade they mean', () => {
    expect(theLine(ECO, /eats well below what it raises\./).v.marks).toContain('no hunger');
    expect(theLine(ECO, /^Full stores help \{settlement\}'s fortunes\./).v.marks).toContain('food surplus');
    expect(theLine(ECO, /grows more food than it eats, and what it sells of the surplus/).v.marks).toContain('food surplus');
    expect(ECO.some((x) => /^Plenty passes here\./.test(x.v.text))).toBe(false);
    theLine(ECO, /^Plenty of trade passes here\. Not much of it stops\.$/);
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
  test.each([['bar0-city-wartime-rand-42'], ['bar0-metropolis-calm-rand-43']])('%s (the negatives C12371, C27960) still prints it', (seed) => {
    const s = town(seed);
    const out = economyStateProse(s, { exportPosture: deriveExportPosture(s) }, { seed: String(s._seed ?? s.id ?? '') });
    expect(JSON.stringify(out.prosperityRung)).toMatch(/purse closes every year ahead/);
  });
});

describe('items 4 and 5 · the economy desk reads the lines the page prints, over the thirty', () => {
  const SOURCE_FIRST = /comes first of all from its (\w+)/;
  test('no one-source line names a first source the printed foodways line does not name first (C41850)', () => {
    const v42 = town('bar0-village-calm-rand-42');
    expect(foodwaysLineOf(v42)).toMatch(/^Its own fields give it grain/);
    for (const seed of THIRTY) {
      const s = town(seed);
      const said = JSON.stringify(economyStateProse(s, { exportPosture: deriveExportPosture(s) }, { seed: String(s._seed ?? s.id ?? '') }).foodSources ?? '');
      const m = SOURCE_FIRST.exec(said);
      if (!m) continue;
      const printed = foodwaysLineOf(s) || '';
      expect(/^Its own fields give it grain/.test(printed), `${seed}: "${m[0]}" beside "${printed}"`).toBe(false);
    }
  });
  test('no entrepôt line says goods entered as imports where the printed import list holds none (C32912)', () => {
    let seen = 0;
    for (const seed of THIRTY) {
      const s = town(seed);
      if (tradeListsAsPrinted(s).imports.length > 0) continue;
      const said = JSON.stringify(economyStateProse(s, { exportPosture: deriveExportPosture(s) }, { seed: String(s._seed ?? s.id ?? '') }).exportPosture ?? '');
      if (deriveExportPosture(s).status === 'entrepot') seen += 1;
      expect(said, seed).not.toMatch(/sells on goods it never made|entered it as imports/);
    }
    expect(seen).toBeGreaterThan(0);
  });
});

describe('item 6 · the turf war declares the rings it asserts (the new atom `rival rings`)', () => {
  test('the atom reads `corruption.js :: rivalRingsOf` on every one of the thirty', () => {
    for (const seed of THIRTY) {
      const s = town(seed);
      expect(factsOf(s).rivalRings, seed).toBe(rivalRingsOf(s.powerStructure?.factions, s.institutions));
    }
  });
  test('"Rival crews ... are fighting over who runs the streets" is refused with no rings, under an occupation, beside a Surplus law', () => {
    const v3 = theLine(DEF, /^Rival crews at \{settlement\} are fighting over who runs the streets/);
    for (const seed of THIRTY) {
      const s = town(seed);
      const f = factsOf(s);
      if (!f.rivalRings || f.crisis?.has?.('occupied') || f.lawBand === 'surplus') expect(admits(v3, s), seed).toBe(false);
    }
    expect(admits(v3, town('bar0-metropolis-calm-rand-42'))).toBe(false); // C23038: rings, Very Safe, law Surplus
    expect(admits(v3, town('bar0-town-occupied-rand-43'))).toBe(false); // C39691: a lone gambling den, under a curfew
  });
  test('exactly one of the line and its three twins stands in each village or larger town keyed semi-organised', () => {
    const four = DEF.filter((x) => x.block === 'DS-DEF-4' && x.pool === 'structure semi-organized' && x.v.vid >= 3);
    expect(four.length).toBe(4);
    for (const seed of THIRTY) {
      const s = town(seed);
      if (factsOf(s).crime !== 'semi-organized' || ['thorp', 'hamlet'].includes(s.tier)) continue;
      expect(four.filter((x) => admits(x, s)).length, seed).toBe(1);
    }
  });
});

describe('item 7 · the twelve free-seat lines of the power desk are refused under an occupation', () => {
  const FREE = /\b(one audience with the \{seat\} gets a decision|the answer comes quickly|can plan a season ahead on its word|knows who decides, and nobody expects that to change|Every decision about \{settlement\} is taken by|what it decides carries in most quarters|make an unpopular decision and still be obeyed|there is nobody else to be sent to|decides things the way a business does|what the hall decides is decided by that combination|Soldiers carry out the \{seat\}'s orders|rules by its faith: every decision)\b/;
  test('twelve lines, each declaring no occupation, each refused in the three occupied towns (C40850)', () => {
    const free = POW.filter((x) => FREE.test(x.v.text) && !(x.v.marks || []).includes('dm-only'));
    expect(free.length).toBe(12);
    for (const line of free) {
      expect(line.v.marks, line.v.text).toContain('no crisis: occupied');
      for (const n of [42, 43, 44]) expect(admits(line, town(`bar0-town-occupied-rand-${n}`)), line.v.text).toBe(false);
    }
  });
  test('the occupation twins say what the Power tab says', () => {
    const twins = POW.filter((x) => (x.v.marks || []).includes('crisis: occupied') && /carries out what the occupiers decide|carry out the occupiers' orders/.test(x.v.text));
    expect(twins.length).toBe(6);
    for (const n of [42, 43, 44]) for (const t of twins.filter((x) => !(x.v.marks || []).some((m) => m === 'garrison'))) {
      expect(admits(t, town(`bar0-town-occupied-rand-${n}`)), t.v.text).toBe(true);
    }
  });
});

describe('item 8 · a slash label takes its prose form in {institution}', () => {
  const LABELS = ['Weavers/Textile workers', 'Palace/government complex', 'Small prison/stocks', 'Colosseum/arena', 'Docks/port facilities',
    'Sage/library', 'Spa/healing house', 'Hot Springs / Healing Waters', 'Livestock / game', 'Wool / flax', 'Desert/Arid', 'Monster Hunters / Adventurers'];
  test.each(LABELS.map((l) => [l]))('planted: %s', (label) => {
    const out = economyStateProse({ name: 'Plantford', economicState: {} }, { impairedInstitution: label }, { seed: 'bar7-desks' });
    const said = JSON.stringify(out.impairedService ?? '');
    expect(said).toMatch(/Plantford's [A-Z]/);
    expect(said).not.toMatch(/\//);
    // every form is singular: the desk's own singular verbs and "its" agree with it
    expect(said).not.toMatch(/Plantford's [A-Z][^"]*?s (?:is|can|does|still) /);
  });
  test('the sixth read\'s town prints the house\'s form (C25601)', () => {
    const s = town('bar0-metropolis-calm-rand-43');
    const out = economyStateProse(s, { exportPosture: deriveExportPosture(s), impairedInstitution: 'Weavers/Textile workers' }, { seed: String(s._seed ?? s.id ?? '') });
    expect(JSON.stringify(out.impairedService ?? '')).toMatch(/Weaving house/);
  });
});
