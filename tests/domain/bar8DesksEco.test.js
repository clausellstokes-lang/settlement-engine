/**
 * bar8DesksEco.test.js — BAR8-DESKS-ECO (the sixth chair's round BAR8, 2026-11-17; `docs/chair/2026-11-17/sixth/briefs/
 * BRIEF-BAR8.md` on the chair's lane, section DESKS-ECO). THE ECONOMY'S AND THE GENERAL DESK'S LINES READ THE NEED LIST, THE
 * IMPORTS AND THE FOOD BAND: each cured line is absent where its premise is false, and its twin stands there.
 *
 *   12d (K)   DS-ECO-8 POOR v1 "covers what it must … Every essential is accounted for" declares `food: ≥ secure` (the
 *             existing food band, the page's own); v5 its twin where the food falls short.
 *   11c (J)   DS-ECO-12 "CRITICAL IMPORT: a house needs what the land lacks" v2 "must come from elsewhere" declares the NEW
 *             atom `critical import brought in` (`facts/criticalImportBroughtIn.js`); v4 its twin where none is brought in.
 *             The atom's leaf is a second home of the page's reading, held EQUAL here to the desk's row and the need list's
 *             matching on every town this file births.
 *   item 5    the brewer's secret "Thins the ale … charges the taverns" needs `institution: tavern`.
 *   item 6    DS-GEN-3 Import-Dependent: the lines that say the food is bought or brought in declare it (`food: =
 *             importDependent`), the two by road no siege; v7 the twin where nothing comes in. v4 STANDS IN ITS PLACE, never
 *             admitted (`food: ≥ secure`): restored 2026-11-18 by BAR8-DESKS-2 under the chair's ruling BR28 (2).
 *
 * THE ANCHORS (rule N7): the desk lines over a CONSTRUCTED record (the facts of one fixed born town on no road, one premise
 * atom set each way: a negative beside a positive); the atom over born towns of the seventh read's thirty that printed the
 * line false at the base (bar0-city-wartime-rand-47's copper ore, bar0-town-calm-rand-46's failed venture's clay) beside one
 * that bears it (bar0-metropolis-calm-rand-45's iron ore, brought in). Every loop collects every failure. THE SHARED PAGE
 * (rule N4): the record, its public projection and the share veil read the new atom alike.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { atomHolds, declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { criticalImportRow } from '../../src/domain/display/stateProse/economyStateProse.js';
import { importsAsPrinted, needMetBy } from '../../src/domain/display/tradeListDisplay.js';
import { criticalImportBroughtInOf, criticalImportGoodOf } from '../../src/domain/facts/criticalImportBroughtIn.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { TITLE_LINE_DECLARATIONS } from '../../src/data/people/titleSecretsPresentations.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';

const DESKS = /** @type {Record<string, any>} */ ({ general: DOSSIER_STATE_PROSE_GENERAL, economy: DOSSIER_STATE_PROSE_ECONOMY });

/** a seed of the bar's reads (`bar0-<tier>-<crisis or calm>-rand-<n>`), born as PAGE-COPY births it (`seedcfg.mjs`, its bar0 arm) */
function bornBar(/** @type {string} */ seed) {
  const m = seed.match(/^bar0-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-rand-\d+$/);
  if (!m) throw new Error(`not a bar seed: ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true }), null, { seed, customContent: {} });
}

/** the census's own dials (PAGE-COPY `seedcfg.mjs`, the SECOND-WAVE-CENSUS births), so a seed is the town the census read */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** a census seed (`r2r-<tier>-<n>`, `r2s-<crisis>-<tier>-<n>`), born as the census births it */
function bornCensus(/** @type {string} */ seed) {
  const r = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const c = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (!r && !c) throw new Error(`not a census seed: ${seed}`);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [/** @type {RegExpMatchArray} */ (c)[1]], selectedStressesRandom: false, settType: /** @type {RegExpMatchArray} */ (c)[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
/** the brewers of the census's 720 that held the tavern secret with no tavern-kind house at the base (measured at f1ca75555) */
const BREWER_NO_TAVERN = Object.freeze(['r2r-village-16', 'r2s-insurgency-village-0']);
/** a brewer beside a tavern that holds it (the thirty, at the base and the tip) */
const BREWER_TAVERN = 'bar0-metropolis-calm-rand-47';

/** the towns of the seventh read's thirty: two that printed "must come from elsewhere" false at the base, one that bears it */
const NOT_BROUGHT = Object.freeze([
  ['bar0-city-wartime-rand-47', 'copper ore'], // "Needed, and not brought in: … copper ore." (11c.needed)
  ['bar0-town-calm-rand-46', 'clay'], // the potter is failing: no clay lies near and none is brought in (11c.venture)
]);
const BROUGHT = Object.freeze([['bar0-metropolis-calm-rand-45', 'iron ore']]); // "Iron ore (local iron mines exhausted)"
/** the births the leaf is held equal to the page's reading on (the thirty's ten shapes, one seed each, and the three above) */
const EQUAL_SEEDS = Object.freeze([
  'bar0-thorp-calm-rand-45', 'bar0-hamlet-calm-rand-45', 'bar0-hamlet-under_siege-rand-45', 'bar0-village-calm-rand-45',
  'bar0-village-famine-rand-45', 'bar0-town-calm-rand-45', 'bar0-town-occupied-rand-45', 'bar0-city-wartime-rand-45',
  'bar0-city-under_siege+famine-rand-45', 'bar0-metropolis-calm-rand-45', 'bar0-city-wartime-rand-47', 'bar0-town-calm-rand-46',
  'bar0-town-occupied-rand-47', 'bar0-metropolis-calm-rand-46', 'bar0-village-calm-rand-47', 'bar0-town-calm-rand-47',
]);

/** @type {any} */ let anchor;
/** @type {any} */ let anchorFacts;
/** @type {Map<string, any>} */ const born = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  // A town on no road (`isolated`): no seat of this round lifts its marks, and nothing below reads its draw.
  anchor = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'town', tradeRouteAccess: 'isolated', selectedStressesRandom: false, selectedStresses: [] }), null, { seed: 'bar8-desks-eco-anchor-town', customContent: {} });
  anchorFacts = factsOf(anchor);
  for (const seed of [...EQUAL_SEEDS, BREWER_TAVERN]) born.set(seed, bornBar(seed));
  for (const seed of BREWER_NO_TAVERN) born.set(seed, bornCensus(seed));
}, 600_000);

/** the anchor's facts with the given readings set (a constructed record: one premise atom, each way) */
const over = (/** @type {Record<string, unknown>} */ o, base = anchorFacts) => {
  const f = Object.create(base);
  for (const [k, v] of Object.entries(o)) Object.defineProperty(f, k, { value: typeof v === 'function' ? v(base) : v });
  return f;
};
const band = (/** @type {string} */ shown, raw = shown) => ({ famine: { band: raw, shownBand: shown } });
// FAULTS-NEED item 4 (2026-11-18, 12d's need-list half, the chair's amendment): POOR v1 also declares `no need not brought in:
// any`; the anchor (a town on no road) holds a need, so v1's food-band readings hold the need atom met, as one premise each way
const NO_NEED = Object.freeze({ luxury: false, spice: false, silk: false, precious: false, salt: false, fuel: false, livestock: false, any: false });
const bandMet = (/** @type {string} */ shown, raw = shown) => ({ ...band(shown, raw), needNotBroughtIn: NO_NEED });
const siege = (/** @type {any} */ b) => ({ active: true, has: (/** @type {string} */ k) => k === 'under_siege' || k === 'hunger' || k === 'threat' || b.crisis.has(k) });

/** @returns {{ line: any, twin: any, admits: (v: any, f: any) => boolean }} */
function deskLine(/** @type {string} */ desk, /** @type {string} */ block, /** @type {string} */ pool, /** @type {number} */ vid, /** @type {number} */ twinVid) {
  const b = DESKS[desk]?.[block];
  const vs = b?.pools?.[pool] || [];
  const scoped = b?.poolMeta?.[pool]?.crisisScoped === true;
  return {
    line: vs.find((/** @type {any} */ v) => v.vid === vid) ?? null,
    twin: vs.find((/** @type {any} */ v) => v.vid === twinVid) ?? null,
    admits: (v, f) => !!v && declarationAdmits(variantFactDeclaration(v), f, { crisisScoped: scoped }).admitted,
  };
}

/** [line, desk, block, pool, the cured vid, its twin's vid, readings where the premise holds, readings where it fails] */
const DESK_LINES = /** @type {Array<[string, string, string, string, number, number, Record<string, unknown>, Record<string, unknown>]>} */ ([
  ['12d · every essential is accounted for', 'economy', 'DS-ECO-8', 'POOR', 1, 5, bandMet('secure'), bandMet('pressured')],
  // 2026-11-18 (BAR8-DESKS-2, ruling BR28 (5)): the twin v5's band is narrowed to Pressured alone, so the two rows that held v5
  // as the twin under `importDependent` and `deficit` move to the arm below (v1 and v5 are both refused there).
  ['11c · must come from elsewhere', 'economy', 'DS-ECO-12', 'CRITICAL IMPORT: a house needs what the land lacks', 2, 4, { criticalImportBroughtIn: true }, { criticalImportBroughtIn: false }],
  ['6 · buys the rest', 'general', 'DS-GEN-3', 'foodSecurity.label: Import-Dependent', 1, 7, band('importDependent'), band('deficit', 'importDependent')],
  ['6 · comes up the road', 'general', 'DS-GEN-3', 'foodSecurity.label: Import-Dependent', 2, 7, band('importDependent'), band('deficit', 'importDependent')],
  // the label re-worded 2026-11-18 (BAR8-DESKS-2, ruling BR28 (4)): it quoted the line (`proseDrawnAnchors.walker`)
  ['6 · the threshold line, v6', 'general', 'DS-GEN-3', 'foodSecurity.label: Import-Dependent', 6, 7, band('importDependent'), band('deficit', 'importDependent')],
]);

describe('BAR8-DESKS-ECO · the desk lines: absent where the premise is false, the twin there', () => {
  // BAR8-DESKS-2 (2026-11-18, ruling BR28 (5), vetoable): DS-ECO-8 POOR v5 keeps its words and is admitted at the food band
  // Pressured alone; as declared (`food: ≤ pressured`) it stood under a deficit and a famine, beside "cannot grow or buy enough".
  it('POOR v5 is admitted at Pressured alone; under Import-Dependent, Deficit and Famine neither v1 nor v5 (BR28 (5))', () => {
    const { line, twin, admits } = deskLine('economy', 'DS-ECO-8', 'POOR', 1, 5);
    expect([line?.vid, twin?.vid, twin?.marks]).toEqual([1, 5, ['crisis: any', 'food: = pressured']]);
    const BANDS = ['famine', 'deficit', 'importDependent', 'pressured', 'secure', 'surplus'];
    expect(BANDS.map((b) => [b, admits(line, over(bandMet(b))), admits(twin, over(bandMet(b)))])).toEqual([
      ['famine', false, false], ['deficit', false, false], ['importDependent', false, false],
      ['pressured', false, true], ['secure', true, false], ['surplus', true, false],
    ]);
  });
  it('where the premise fails the line is refused and its twin admitted; where it holds, the line and not the twin (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(DESK_LINES, ([name, desk, block, pool, vid, twinVid, yes, no]) => {
      const { line, twin, admits } = deskLine(desk, block, pool, vid, twinVid);
      expect(line, `${name}: ${block} ${pool} v${vid}`).toBeTruthy();
      expect(twin, `${name}: ${block} ${pool} has its twin v${twinVid}`).toBeTruthy();
      expect(admits(line, over(no)), `${name}: v${vid} where its premise is false`).toBe(false);
      expect(admits(twin, over(no)), `${name}: the twin v${twinVid} where the premise is false`).toBe(true);
      expect(admits(line, over(yes)), `${name}: v${vid} where its premise holds (the positive anchor)`).toBe(true);
      expect(admits(twin, over(yes)), `${name}: the twin v${twinVid} where the premise holds`).toBe(false);
    }), 'each cured desk line and its twin');
  });

  // RE-KEYED BY IDENTITY (2026-11-18, BAR8-DESKS-2, ruling BR28 (2)): v4 is NOT retired. A row is not removed from the middle
  // of a pool (the kernel's law 6: a pool's ids are its annex rows) and the ledger `docs/census/declarations/DS-GEN-3.json`
  // names vid 4, so it went back exactly as it stood on the line, `food: ≥ secure`: never admitted under the key's own band.
  it('item 6: no Import-Dependent line says the food comes by road or is bought under a siege; v4 stands in its place and is never admitted', () => {
    const pool = DOSSIER_STATE_PROSE_GENERAL['DS-GEN-3'].pools['foodSecurity.label: Import-Dependent'];
    expect(pool.map((/** @type {any} */ v) => v.vid)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    const v4 = pool.find((/** @type {any} */ v) => v.vid === 4);
    expect([/eats well/.test(v4.text), v4.marks], 'v4 as it stood on the line').toEqual([true, ['no crisis: hunger', 'crisis: any', 'food: ≥ secure']]);
    const sieged = over({ ...band('importDependent'), crisis: siege });
    const { admits } = deskLine('general', 'DS-GEN-3', 'foodSecurity.label: Import-Dependent', 1, 7);
    expect([admits(v4, over(band('importDependent'))), admits(v4, over(band('deficit', 'importDependent')))], 'v4 under the key\'s own band, brought in or not').toEqual([false, false]);
    expectNoSeedFailures(collectSeedFailures(pool.filter((/** @type {any} */ v) => v.vid !== 7), (/** @type {any} */ v) => {
      expect(admits(v, sieged), `v${v.vid} "${v.text}" under a siege`).toBe(false);
      expect(admits(v, over(band('deficit', 'importDependent'))), `v${v.vid} where nothing is brought in`).toBe(false);
    }), 'every Import-Dependent line that says the food comes in');
  });
});

describe('BAR8-DESKS-ECO · 11c: `critical import brought in`, one reading with the page', () => {
  it('the towns that printed "must come from elsewhere" false hold the atom false; the town whose good is brought in holds it true', () => {
    expectNoSeedFailures(collectSeedFailures([...NOT_BROUGHT.map((r) => [...r, false]), ...BROUGHT.map((r) => [...r, true])], ([seed, good, want]) => {
      const s = born.get(String(seed));
      expect(criticalImportGoodOf(s), `${seed}: the lens's good`).toBe(good);
      expect(criticalImportBroughtInOf(s), `${seed}: ${good} brought in`).toBe(want);
      expect(atomHolds('critical import brought in', factsOf(s)), `${seed}: the atom through factsOf`).toBe(want);
      const { line, twin, admits } = deskLine('economy', 'DS-ECO-12', 'CRITICAL IMPORT: a house needs what the land lacks', 2, 4);
      expect(admits(line, factsOf(s)), `${seed}: v2 "must come from elsewhere"`).toBe(want);
      expect(admits(twin, factsOf(s)), `${seed}: v4 "none of it is brought in"`).toBe(!want);
    }), 'the anchors of 11c');
  });

  it('THE SECOND HOME HELD EQUAL: the leaf\'s good is the desk\'s row\'s, and "brought in" is the need list\'s matching (every born town)', () => {
    let rows = 0;
    expectNoSeedFailures(collectSeedFailures(EQUAL_SEEDS, (seed) => {
      const s = born.get(seed);
      const row = criticalImportRow(s.resourceAnalysis?.imports);
      const good = criticalImportGoodOf(s);
      expect(good, `${seed}: the leaf's good is the desk's (${JSON.stringify(row)})`).toBe(row?.institution ? row.good : '');
      if (!good) { expect(criticalImportBroughtInOf(s), `${seed}: no good, no answer`).toBe(undefined); return; }
      rows += 1;
      const page = importsAsPrinted(s).arriving.some((imp) => imp.toLowerCase().includes(good.toLowerCase()) || needMetBy(good, imp));
      expect(criticalImportBroughtInOf(s), `${seed}: "${good}" brought in, as the need list reads the arriving imports`).toBe(page);
    }), 'the leaf against the page');
    expect(rows, 'towns with a house-required critical import').toBeGreaterThan(5);
  });

  it('THE SHARED PAGE (N4): the record, its public projection and the share veil read the atom alike (every born town)', () => {
    expectNoSeedFailures(collectSeedFailures(EQUAL_SEEDS, (seed) => {
      const s = born.get(seed);
      const pub = toPublicSafe(structuredClone(s));
      const veil = projectShareVeil(toPublicSafe(structuredClone(s)), null);
      const want = atomHolds('critical import brought in', factsOf(s));
      expect(atomHolds('critical import brought in', factsOf(pub)), `${seed}: the public form`).toBe(want);
      expect(atomHolds('critical import brought in', factsOf(veil)), `${seed}: the share veil`).toBe(want);
    }), 'one reading on all three forms');
  });
});

describe('BAR8-DESKS-ECO · item 5: the brewer\'s tavern secret', () => {
  const SECRET = 'Thins the ale with water after it is sold by the barrel and charges the taverns for full strength';
  it('needs a tavern-kind house: refused where none stands, admitted where one does', () => {
    const d = TITLE_LINE_DECLARATIONS.secret[SECRET];
    expect(d, 'the secret declares').toBeTruthy();
    const decl = declarationOf({ needs: d?.needs || [], excludes: d?.excludes || [] });
    const withTavern = (/** @type {boolean} */ yes) => over({ hasInstitution: (/** @type {any} */ b) => (/** @type {string} */ k) => (k === 'tavern' ? yes : b.hasInstitution(k)) });
    expect(declarationAdmits(decl, withTavern(false)).admitted, 'no tavern-kind house').toBe(false);
    expect(declarationAdmits(decl, withTavern(true)).admitted, 'a tavern stands').toBe(true);
  });
  it('the census brewers with no tavern-kind house hold it no more; the brewer beside a tavern keeps it (every town)', () => {
    const brewers = (/** @type {any} */ s) => (s.npcs || []).filter((/** @type {any} */ c) => c?.title === 'the brewer');
    expectNoSeedFailures(collectSeedFailures([...BREWER_NO_TAVERN, BREWER_TAVERN], (seed) => {
      const s = born.get(seed);
      const tavern = seed === BREWER_TAVERN;
      expect(factsOf(s).hasInstitution?.('tavern'), `${seed}: a tavern-kind house`).toBe(tavern);
      expect(brewers(s).length, `${seed}: a brewer stands`).toBeGreaterThan(0);
      expect(brewers(s).some((/** @type {any} */ c) => c.secret?.what === SECRET), `${seed}: the tavern secret`).toBe(tavern);
    }), 'the brewers');
  });
});

// ---------------------------------------------------------------------------------------------------------------- 15e
// BAR8-DESKS-2 (2026-11-18, the chair's ruling BR34; vetoable new vocabulary): DS-ECO-8 POOR v3 "… and nothing new goes up"
// declares `no trade at work: building` (`tradeAtWork.js :: BUILDING_HOUSE_IDS`, by catalogue id): refused where a building
// house stands and is not short; the atom FALSE, never unanswered, where none stands. The anchors: bar0-city-wartime-rand-38
// (K's 15e of the 150: its Carpenters (5-15)) and bar0-town-occupied-rand-47 (the thirty's: its Brickmaker, whose own card
// "knows every new wall going up"), beside two towns of the thirty and the 150 with no building house.
describe('BAR8-DESKS-2 · 15e: `trade at work: building`, read the same on every form', () => {
  it('the building towns refuse "nothing new goes up"; the towns with none admit it; never unanswered', () => {
    const { line: v3, admits } = deskLine('economy', 'DS-ECO-8', 'POOR', 3, 0);
    expect(v3?.marks).toContain('no trade at work: building');
    // `over` calls a function with the base facts, so the keyed reader is handed as a function that returns it
    expect([admits(v3, over({ tradeAtWork: () => () => false })), admits(v3, over({ tradeAtWork: () => (/** @type {string} */ k) => k === 'building' }))]).toEqual([true, false]);
    const CASES = /** @type {Array<[string, boolean]>} */ ([['bar0-city-wartime-rand-38', true], ['bar0-town-occupied-rand-47', true], ['bar0-town-occupied-rand-45', false], ['bar0-town-calm-rand-31', false]]);
    expectNoSeedFailures(collectSeedFailures(CASES, ([seed, building]) => {
      const s = bornBar(seed);
      for (const [form, r] of /** @type {Array<[string, any]>} */ ([['record', s], ['public', toPublicSafe(structuredClone(s))], ['the share veil', projectShareVeil(toPublicSafe(structuredClone(s)), null)]])) {
        const f = factsOf(r);
        expect(f.tradeAtWork('building'), `${seed} (${form}): a building house at work`).toBe(building);
        expect(admits(v3, f), `${seed} (${form}): v3`).toBe(!building);
      }
    }), 'the building towns and the towns with none');
  }, 240_000);
});

// ---------------------------------------------------------------------------------------------------------- 11c, the family
// BAR8-DESKS-2 (2026-11-18; DESKS-ECO's second reader, M1; the chair's ruling BR28 (6)): THE FIVE TOWNS OF THE THIRTY AND THE
// 150 WHOSE ATOM HOLDS ONLY BY THE FAMILY MATCH (no arriving import names the good: "iron ore" beside "Iron", "gold/silver ore"
// beside "Precious metals"), measured at the base 4446aecb5 over the 180 births (41 more of the 720). The leaf's family table is
// a COPY of the need list's (`tradeListDisplay.js :: NEED_FAMILY_WORDS`), so it is held equal here IMPORT BY IMPORT to the page's
// own `needMetBy`, and the counterfactual (the family imports struck) turns the atom false.
const FAMILY_ONLY = Object.freeze(['bar0-town-occupied-rand-27', 'bar0-city-wartime-rand-32', 'bar0-city-wartime-rand-34', 'bar0-town-occupied-rand-35', 'bar0-city-wartime-rand-37']);
describe('BAR8-DESKS-2 · 11c: the import leaf\'s family match, held to the need list\'s', () => {
  it('the five towns hold the atom by the family alone, the leaf agrees with `needMetBy` on every import, and striking the family imports turns it false', () => {
    expectNoSeedFailures(collectSeedFailures(FAMILY_ONLY, (seed) => {
      const s = /** @type {any} */ (bornBar(seed));
      const good = criticalImportGoodOf(s);
      const imports = /** @type {string[]} */ ([...(s.economicState?.primaryImports || [])]).map(String);
      expect(good, `${seed}: the lens names a good`).toBeTruthy();
      expect(imports.some((i) => i.toLowerCase().includes(good.toLowerCase())), `${seed}: no import names "${good}"`).toBe(false);
      expect(criticalImportBroughtInOf(s), `${seed}: brought in, by the family`).toBe(true);
      const withImports = (/** @type {string[]} */ list) => ({ ...s, economicState: { ...s.economicState, primaryImports: list } });
      for (const imp of imports) {
        expect(criticalImportBroughtInOf(withImports([imp])), `${seed}: "${good}" met by "${imp}"`).toBe(needMetBy(good, imp));
      }
      const family = imports.filter((imp) => needMetBy(good, imp));
      expect(family.length, `${seed}: an import of the family`).toBeGreaterThan(0);
      expect(criticalImportBroughtInOf(withImports(imports.filter((imp) => !family.includes(imp)))), `${seed}: the family struck`).toBe(false);
    }), 'the family match');
  }, 240_000);
});
