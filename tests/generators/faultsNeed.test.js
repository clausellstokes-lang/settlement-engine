// THE GUARD OF FAULTS-NEED (the sixth chair's BRIEF-FAULTS, section FAULTS-NEED, 2026-11-18): WHAT THE PAGE'S OWN NEED LIST SAYS,
// AS ONE FACT THE GENERATORS AND THE DESKS CAN READ. Each item held on a constructed record (a negative beside its positive) and on
// the fixed towns the base printed it in (the seventh read's thirty, the 150, the census's 720); the counts before and after over
// the whole populations are in docs/chair/2026-11-18/faults/FAULTS-NEED-HANDBACK.md.
//   item 0   the need list never drops a need, by a live house's printed service row (J-INCOME-2's `NEED_DEALT_ROWS`), for a
//            good a live house of the town is marked short of (`crisisStoppedRow.js :: rowShortOf`, the page's own mark): the
//            Dairy farmer's "Short of livestock." beside a shepherd's "Livestock management" (bar0-village-calm-rand-29,
//            r2r-village-47) kept "Needed, and not brought in: livestock." (re-keyed by FR24 (1), 2026-11-18: the commons prove
//            those pastures; the claim on r2r-town-54's Butchers and, after FR24 (2), bar0-town-calm-rand-29's Potter).
//   item 1   THE ATOM (FR2): `domain/facts/needNotBroughtIn.js` states the need list in the record's own words, held EQUAL here to
//            `importsAsPrinted(record).needed`, label by label, on every town this file births (the seventh read's thirty and the
//            fixed towns of the other items) and on a constructed record for each branch of the page's reader; its copied tables
//            are held to their homes; `need not brought in: <family>` reads it through `factsOf`, the public page and the veil alike.
//            NEED-ATOM (CLOSE-8's cure 3b, 2026-11-25): the atom's copy of the page's "short" reads the houses that stand and
//            the mark the page reads (r2r-town-54's Butchers, short of livestock with no gap row): `HOUSE_STOCK_COPY` and
//            `GOOD_HAD_COPY` held to their homes and to the page itself, ground by ground and branch by branch.
//   item 2   11e.wantBuy: a card's SUPPLY dependency goal ("Buy {resource} at the market …", "Secure a steady supply of {resource}
//            …") is dealt only where its good is brought in or had: never where the need list names it (C8867,
//            bar0-city-wartime-rand-45's "Buy stone and iron and grain …" beside "Needed, and not brought in: stone, …").
//   item 4   12d's need-list half (the chair's amendment, 2026-11-18 06:55 UTC): DS-ECO-8 POOR v1 ("covers what it must … Every
//            essential is accounted for") declares `no need not brought in: any` (a good the page lists as needed and not brought
//            in is not accounted for); its twin v6, v1's angle and bands, `need not brought in: any`. r2r-hamlet-21 (salt),
//            r2s-religious_conversion-town-3 (stone, copper ore, …) and bar0-town-occupied-rand-35 (luxury goods, copper ore).
// THE DETECTORS are the page's own readers (the need list, the mark) and the record's own rows; none reads the table the cure changed.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { importsAsPrinted, needMetBy, NEED_DEALT_ROWS, MARKS } from '../../src/domain/display/tradeListDisplay.js';
import { FAILED_FOOD_COPY, GOOD_HAD_COPY, famineInForceOf, HOUSE_STOCK_COPY, MARK_RES, NEED_DEALT_ROWS_COPY, NEED_KEYS, WORKING_CHAIN_STATUSES_COPY, goodNeededNotBroughtIn, needListOf, needNotBroughtInOf } from '../../src/domain/facts/needNotBroughtIn.js';
import { FACT_DIMENSIONS, atomHolds, declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { GOAL_FAMILY_LINES } from '../../src/data/people/goalFamilies.js';
import { WORKING_CHAIN_STATUSES } from '../../src/domain/facts/chainWorking.js';
import { rowShortOf } from '../../src/domain/display/crisisStoppedRow.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { HOUSE_NEED_INPUT, HOUSE_TRADE_INPUT, INPUT, houseDependenceOf } from '../../src/data/crisisDependence.js';
import { CHAIN_INPUTS } from '../../src/domain/facts/houseInputAtHand.js';
import { RESOURCE_DATA } from '../../src/data/goods/identity.js';
import { commoditiesShown } from '../../src/domain/display/commoditiesShown.js';
import { FOOD_SOURCE_GROUND } from '../../src/domain/facts/tradeAtWork.js';
import { CRISIS_KINDS, crisisOf } from '../../src/domain/facts/crisisKind.js';
import { GEN_TO_PULSE_TYPE } from '../../src/domain/stressorPicker.js';

/** The towns each item is held in, with the items each one holds (the controls beside them). */
const TOWNS = Object.freeze({
  // RE-KEYED BY IDENTITY (FAULTS-BIRTH, the chair's ruling FR24 (1), 2026-11-18): the Common grazing land now proves the pasture of
  // bar0-village-calm-rand-29 and r2r-village-47 (FR21 (2)), so no house there is short of livestock. The same claim on towns of the
  // 900 that bear it at the merged line, each anchor with its own house, good and the label its need list prints (`SHORT`, below).
  // WHAT THESE ANCHORS NO LONGER PROVE (the second reader READ-BIRTH's M1 at the landing, written by the chair's hand, 2026-11-18):
  // item 0's cure is one line of `tradeListDisplay.js :: dealtInHere` (a dealing row never drops a need a live house is short
  // of), and neither anchor holds a dealing row (r2r-town-54 has no livestock service row; the Potter's clay no row can drop):
  // with that line removed, this sample stays green. No town of the 900 still bears the old claim (a dealing row beside a
  // house short of livestock), so the cure itself is guarded by the constructed record of item 0 alone; these anchors hold
  // only that a short good stands on the printed need list. A weaker claim on real towns, named as such, not the same one.
  'r2r-town-54': ['short'], // the 720: the Butchers (3-8) short of livestock; the list prints "Livestock for meat and draft"
  // FR24 (2) (2026-11-18): bar0-village-famine-rand-41's common now proves the pasture whose hides feed its Tannery; the 150's anchor
  // re-keyed by identity to a house short of its good beside that good's printed label: the Potter of bar0-town-calm-rand-29
  'bar0-town-calm-rand-29': ['short'], // the 150: the Potter short of clay; the list prints "clay"
  'r2r-city-43': ['dealt'], // the 720: a fair's livestock auction, no house short of livestock (the need stays dropped)
  'r2r-metropolis-12': ['dealt'],
  'r2r-metropolis-19': ['dealt'],
  'r2r-metropolis-25': ['dealt'],
  // RE-KEYED BY IDENTITY at the landing of FAULTS-BIRTH (the chair's hand, ruling FR21, 2026-11-18): r2r-hamlet-27's dairy
  // is at work once the supply rule's second ring proves its pasture, so it holds no failed venture any more; the same claim
  // (the failed venture's own material stays on the need list) is held on a venture the merged line still bears.
  'r2r-hamlet-57': ['venture'], // the 720: the failed venture (Carpenter (part-time)) and its own timber (the need stays)
  'r2r-hamlet-21': ['poor'], // the 720: a food-secure POOR town whose need list names salt (12d)
  'r2s-religious_conversion-town-3': ['poor'], // the 720: v1 beside "Needed, and not brought in: stone, copper ore, …" (the amendment)
  'bar0-town-occupied-rand-35': ['poor'], // the 150: v1 beside "luxury goods, copper ore" (the amendment)
  // the seventh read's thirty (`seeds.bar7.txt`): the atom held equal on each
  ...Object.fromEntries([45, 46, 47].flatMap((n) => ['thorp-calm', 'hamlet-calm', 'hamlet-under_siege', 'village-famine', 'village-calm', 'town-calm',
    'town-occupied', 'city-under_siege+famine', 'city-wartime', 'metropolis-calm'].map((k) => [`bar0-${k}-rand-${n}`, ['thirty']]))),
  'bar0-city-wartime-rand-45': ['thirty', 'wantBuy'], // C8867: a dependency on stone beside "Needed, and not brought in: stone" (refused at the deal)
});

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** CENSUS-3 seedcfg.mjs's arms (the census's r2r-/r2s- and the bar's bar0-), verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (m) {
    const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    return { ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true };
  }
  throw new Error(`a guard seed is a census or a read seed: ${seed}`);
}

/** @type {Map<string, any>} */
const BORN = new Map();
beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of Object.keys(TOWNS)) BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
}, 600000);

const seedsOf = (/** @type {string} */ rule) => Object.entries(TOWNS).filter(([, r]) => r.includes(rule)).map(([s]) => s);
/** The nouns the page marks a live house short of (`rowShortOf`, the mark the Services and Institutions tabs print). @param {any} s */
const markedNouns = (s) => liveInstitutions(s).map((i) => rowShortOf(s, 'house', i)).filter((m) => typeof m === 'string' && m && !/failed venture/.test(m));
/** The need list with no service row read: what the dealt-in rule may drop. @param {any} s */
const neededWithoutRows = (s) => importsAsPrinted({ ...s, availableServices: {} }).needed;

describe('FAULTS-NEED item 0: the need list keeps a need a live house is marked short of', () => {
  const town = (/** @type {Record<string, unknown>} */ over) => ({
    institutions: [{ name: 'Shepherd' }, { name: 'Dairy farmer' }],
    economicState: { primaryImports: [], primaryExports: [], localProduction: [], activeChains: [] },
    resourceAnalysis: { imports: { critical: ['livestock', 'iron ore'] }, gaps: [] },
    availableServices: { economy: [{ name: 'Livestock management', institution: 'Shepherd' }] },
    ...over,
  });
  it('a constructed record: the shepherd\'s row answers livestock where no house is short of it; a dairy short of livestock keeps the need', () => {
    // the dealt-in rule stands where nothing is marked short (the positive) ...
    expectAbsentWithAnchor(importsAsPrinted(town({})).needed, 'livestock', 'iron ore', 'the shepherd\'s row answers livestock, and no other need');
    // ... and yields where a live house is marked short of the good (the cure)
    const gaps = [{ chain: 'livestock', institution: 'Dairy farmer', kind: 'missing', impact: 'No livestock reaches the dairy farmer.' }];
    const s = town({ resourceAnalysis: { imports: { critical: ['livestock', 'iron ore'] }, gaps } });
    expect(markedNouns(s), 'the constructed dairy is marked short of livestock by the page\'s own mark').toContain('livestock');
    expect(importsAsPrinted(s).needed).toContain('livestock');
    // a house short of ANOTHER good leaves the dealt-in rule standing
    const other = town({ resourceAnalysis: { imports: { critical: ['livestock', 'iron ore'] }, gaps: [{ chain: 'iron ore', institution: 'Dairy farmer', kind: 'missing', impact: 'No iron ore reaches the dairy farmer.' }] } });
    expectAbsentWithAnchor(importsAsPrinted(other).needed, 'livestock', 'iron ore', 'a house short of another good leaves the row\'s answer standing');
  });
  it('the towns of the sample: no need is dropped by a service row where a live house is marked short of its good; the others stay dropped', () => {
    expectNoSeedFailures(collectSeedFailures(Object.keys(TOWNS), (seed) => {
      const s = BORN.get(seed);
      const nouns = markedNouns(s);
      const needed = importsAsPrinted(s).needed;
      const dropped = neededWithoutRows(s).filter((n) => !needed.includes(n));
      expect(dropped.filter((n) => nouns.some((noun) => needMetBy(n, noun))), `${seed}: a need dropped beside a house marked short of it`).toEqual([]);
    }));
    // FR24 (1): each anchor's own house, the good its mark names and the label its need list prints, asserted exactly
    const SHORT = /** @type {Record<string, { house: string, good: string, label: string }>} */ ({
      'r2r-town-54': { house: 'Butchers (3-8)', good: 'livestock', label: 'Livestock for meat and draft' },
      'bar0-town-calm-rand-29': { house: 'Potter', good: 'clay', label: 'clay' },
    });
    expectNoSeedFailures(collectSeedFailures(seedsOf('short'), (seed) => {
      const s = BORN.get(seed);
      const { house, good, label } = SHORT[seed];
      const inst = liveInstitutions(s).find((i) => i?.name === house);
      expect(inst && rowShortOf(s, 'house', inst), `${seed}: the ${house} is marked short of ${good} (the page's own mark)`).toBe(good);
      expect(importsAsPrinted(s).needed, `${seed}: "${label}" stands on the need list beside it`).toContain(label);
      expect(needMetBy(label, good), `${seed}: the label names the good`).toBe(true);
    }));
    expectNoSeedFailures(collectSeedFailures(seedsOf('dealt'), (seed) => {
      const s = BORN.get(seed);
      expect(neededWithoutRows(s).filter((n) => /\blivestock\b/i.test(n)).length, `${seed} still holds a livestock need a row may drop`).toBeGreaterThan(0);
      expect(importsAsPrinted(s).needed.filter((n) => /\blivestock\b/i.test(n)), seed).toEqual([]);
    }));
  });
});

describe('FAULTS-NEED item 1: the atom `need not brought in` (FR2) states the page\'s need list', () => {
  const town = (/** @type {Record<string, unknown>} */ over) => ({
    tier: 'town',
    institutions: [{ name: 'Smelter' }, { name: 'Shepherd' }, { name: 'Dairy farmer' }],
    economicState: { primaryImports: [], primaryExports: [], localProduction: [], activeChains: [] },
    resourceAnalysis: { imports: { critical: ['iron ore', 'luxury goods', 'livestock', 'salt', 'Toll income', 'spices'] }, gaps: [] },
    availableServices: {},
    ...over,
  });
  /** the leaf beside the page, label by label @param {any} s */
  const same = (s) => expect(needListOf(s), 'the leaf\'s list is the page\'s').toEqual(importsAsPrinted(s).needed);
  it('its copied tables are their homes\' own, and its keys are the vocabulary\'s', () => {
    expect([...WORKING_CHAIN_STATUSES_COPY]).toEqual([...WORKING_CHAIN_STATUSES]);
    // FR15: the leaf reads the luxury pool through the kernel's door (each row's own declaration), so its band is the home's;
    // the old arm "every row needs exactly tier: ≥ village" is answered by the leaf's equality to the page on every town
    expect(MARK_RES.map(String)).toEqual(MARKS.map((m) => String(m.re)));
    expect(NEED_DEALT_ROWS_COPY.map(([g, re]) => [g, String(re)])).toEqual(NEED_DEALT_ROWS.map(([g, re]) => [g, String(re)]));
    expect([...(FACT_DIMENSIONS['need not brought in'].keys || [])]).toEqual([...NEED_KEYS]);
    // NEED-ATOM: the copy of the houses whose stock a row deals in is the dependence table's own, each through the page's gate
    const dealtGood = (/** @type {string} */ key) => NEED_DEALT_ROWS_COPY.map(([g]) => g).find((g) => needMetBy(g, String(CHAIN_INPUTS[key]?.noun ?? key)));
    const want = Object.fromEntries(Object.entries(HOUSE_NEED_INPUT).filter(([, key]) => dealtGood(key)).map(([id, key]) => [id, dealtGood(key)]));
    expect({ ...HOUSE_STOCK_COPY }).toEqual(want);
    expect(Object.keys(HOUSE_STOCK_COPY).length, 'the copy holds a row (the butchers)').toBeGreaterThan(0);
    expect(Object.entries(HOUSE_TRADE_INPUT).filter(([, key]) => dealtGood(key)), 'no trade house\'s good is one a row deals in').toEqual([]);
    for (const id of Object.keys(HOUSE_STOCK_COPY)) expect(houseDependenceOf({ catalogId: id }), `${id} passes rowShortOf's gate`).toContain(INPUT);
    expect(Object.keys(GOOD_HAD_COPY).sort()).toEqual([...new Set(Object.values(HOUSE_STOCK_COPY))].sort());
    // RULING-R (the eleventh chair, 2026-11-27), R8 luxury: the failed food's copy is the Resources tab's own marks, source by source
    expect(Object.keys(FAILED_FOOD_COPY).sort()).toEqual(Object.keys(FOOD_SOURCE_GROUND).sort());
    const every = [...new Set(Object.values(FAILED_FOOD_COPY).flatMap((f) => [...f.grounds, ...f.goods.map((g) => g.replace(/ /g, '_'))]))];
    for (const [source, f] of Object.entries(FAILED_FOOD_COPY)) {
      expect([...f.grounds], `${source}: the grounds`).toEqual([.../** @type {any} */ (FOOD_SOURCE_GROUND)[source]]);
      const rec = { stress: [{ type: 'famine' }], resourceAnalysis: { availableResources: every }, economicState: { foodSecurity: { foodRecord: { failedSource: source } } } };
      expect(commoditiesShown(rec).filter((c) => c.failed).map((c) => c.key).sort(), `${source}: the marked chips`)
        .toEqual(every.filter((k) => f.grounds.includes(k) || f.goods.includes(k.replace(/_/g, ' '))).sort());
    }
  });
  // FIX-123 (the eleventh chair's ruling 123-J-1, STOP 1): the leaf's famine in force is its home's (`crisisOf(record).has('famine')`),
  // read in the record's words because that home is pinned lazy; held equal on a record for each crisis kind (as the record's
  // kind and as its pulse type, in each carrier of the container), on records with none, and on every town this file births
  it('its famine in force is `crisisOf`\'s answer: each crisis kind and none, and every town of the sample', () => {
    const home = (/** @type {any} */ r) => crisisOf(r).has('famine');
    /** @type {any[]} */
    const records = [{}, { stress: [] }, { stressors: [], stress: [{ type: 'famine' }] }, { stressors: null, stress: null }, { activeConditions: [{ archetype: 'famine' }] }];
    for (const kind of CRISIS_KINDS) {
      for (const type of new Set([kind, /** @type {any} */ (GEN_TO_PULSE_TYPE)[kind] ?? kind])) {
        records.push({ stressors: [{ type }], stress: [{ type }] }, { stress: [{ type }] }, { stresses: [{ type }] }, { stressors: { type } }, { stress: { type } },
          { stressors: [{ type: 'wartime' }, { type }] });
      }
    }
    const held = records.filter(home).length;
    expect(held, 'the famine is among the kinds').toBeGreaterThan(0);
    expect(records.length - held, 'and records without it beside').toBeGreaterThan(0);
    for (const r of records) expect(famineInForceOf(r), JSON.stringify(r)).toBe(home(r));
    expectNoSeedFailures(collectSeedFailures(Object.keys(TOWNS), (seed) => {
      const s = BORN.get(seed);
      expect(famineInForceOf(s), seed).toBe(home(s));
    }));
    expect(Object.keys(TOWNS).some((seed) => home(BORN.get(seed))), 'the sample holds a famine').toBe(true);
    expect(Object.keys(TOWNS).some((seed) => !home(BORN.get(seed))), 'and a town without').toBe(true);
  });
  // NEED-ATOM: a butcher (its stock livestock), a fair's livestock auction, no house that proves a pasture: the page's mark decides
  const stockTown = (/** @type {Record<string, unknown>} */ over = {}, /** @type {Record<string, unknown>} */ eco = {}) => ({
    tier: 'town', config: { tradeRouteAccess: 'road', nearbyResources: [], nearbyResourcesDepleted: [], stressTypes: [] },
    institutions: [{ name: 'Butchers (3-8)', catalogId: 'butchers_3_8', tags: ['food'] }, { name: 'Annual fair', catalogId: 'annual_fair' }],
    economicState: { primaryImports: [], primaryExports: [], localProduction: [], activeChains: [], ...eco },
    resourceAnalysis: { imports: { critical: ['Livestock for meat and draft', 'salt'] }, gaps: [] },
    availableServices: { economy: [{ name: 'Livestock auction', institution: 'Annual fair' }] },
    ...over,
  });
  const LABEL = 'Livestock for meat and draft';
  it('a constructed record: each branch of the page\'s reader, the leaf beside it', () => {
    const base = town({});
    same(base);
    // the category error leaves; the luxury below its band leaves (a hamlet), stays at a town
    expectAbsentWithAnchor(needListOf(base), 'Toll income', 'iron ore', 'a category error leaves the list');
    expect(needListOf(base)).toContain('luxury goods');
    same(town({ tier: 'hamlet' }));
    expectAbsentWithAnchor(needListOf(town({ tier: 'hamlet' })), 'luxury goods', 'iron ore', 'a luxury below its band leaves the list');
    // an arriving import meets a need under another name
    const iron = town({ economicState: { primaryImports: ['Iron'], primaryExports: [], localProduction: [], activeChains: [] } });
    same(iron);
    expectAbsentWithAnchor(needListOf(iron), 'iron ore', 'salt', 'Iron meets iron ore');
    // a worked good meets no raw need
    same(town({ economicState: { primaryImports: ['Iron tools'], primaryExports: [], localProduction: [], activeChains: [] } }));
    expect(needListOf(town({ economicState: { primaryImports: ['Iron tools'], primaryExports: [], localProduction: [], activeChains: [] } }))).toContain('iron ore');
    // an export wins
    const exp = town({ economicState: { primaryImports: [], primaryExports: ['Salt'], localProduction: [], activeChains: [] } });
    same(exp);
    expectAbsentWithAnchor(needListOf(exp), 'salt', 'iron ore', 'an export is made here');
    // a working chain makes it; an impaired one does not
    const chain = (/** @type {string} */ status) => town({ economicState: { primaryImports: [], primaryExports: [], localProduction: [], activeChains: [{ chainId: 'salt', label: 'Salt works', status, resource: 'salt', outputs: ['Salt'], processingInstitutions: ['Salt works'] }] } });
    same(chain('running'));
    expectAbsentWithAnchor(needListOf(chain('running')), 'salt', 'iron ore', 'a working chain makes salt');
    same(chain('broken'));
    expect(needListOf(chain('broken'))).toContain('salt');
    // a gap row of kind imported answers its need, and no other kind
    const gap = (/** @type {string} */ kind) => town({ resourceAnalysis: { imports: { critical: ['iron ore', 'salt'] }, gaps: [{ chain: 'iron ore', institution: 'Smelter', kind, impact: 'Smelter runs on imported iron ore' }] } });
    same(gap('imported'));
    expectAbsentWithAnchor(needListOf(gap('imported')), 'iron ore', 'salt', 'the gap row answers iron ore');
    same(gap('missing'));
    expect(needListOf(gap('missing'))).toContain('iron ore');
    // a live house's printed service row deals in the good; another house's, or a dead one's, not; a house marked short keeps it
    const rows = (/** @type {string} */ house, /** @type {unknown[]} */ gaps = []) => town({
      availableServices: { economy: [{ name: 'Livestock management', institution: house }] },
      resourceAnalysis: { imports: { critical: ['livestock', 'salt'] }, gaps } });
    same(rows('Shepherd'));
    expectAbsentWithAnchor(needListOf(rows('Shepherd')), 'livestock', 'salt', 'the shepherd\'s row deals in livestock');
    same(rows('A fold long gone'));
    expect(needListOf(rows('A fold long gone'))).toContain('livestock');
    const shortGaps = [{ chain: 'livestock', institution: 'Dairy farmer', kind: 'missing', impact: 'No livestock reaches the dairy farmer.' }];
    same(rows('Shepherd', shortGaps));
    expect(needListOf(rows('Shepherd', shortGaps))).toContain('livestock');
    // NEED-ATOM: the stock good had or not (`HOUSE_STOCK_COPY`, `GOOD_HAD_COPY`), the leaf beside the page, branch by branch
    same(stockTown());
    expect(needListOf(stockTown()), 'r2r-town-54\'s shape: the butchers stand short of livestock, the auction answers nothing').toContain(LABEL);
    const fed = stockTown({}, { foodSecurity: { foodRecord: { foodSources: ['livestock'] } } });
    same(fed);
    expectAbsentWithAnchor(needListOf(fed), LABEL, 'salt', 'the food record\'s livestock feeds the butchers: the auction answers the need');
    const made = stockTown({}, { localProduction: ['Livestock'] });
    same(made);
    expectAbsentWithAnchor(needListOf(made), LABEL, 'salt', 'the town\'s own livestock');
    // a house of another stock, a dead butcher, a custom one, or one the record's gap rows speak of: not read by the copy
    for (const butcher of [{ name: 'Butchers (3-8)', catalogId: 'butchers_3_8', status: 'ruined' }, { name: 'Butchers (3-8)', catalogId: 'butchers_3_8', custom: true }]) {
      const s = stockTown({ institutions: [butcher, { name: 'Annual fair', catalogId: 'annual_fair' }] });
      same(s);
      expectAbsentWithAnchor(needListOf(s), LABEL, 'salt', 'no standing native butcher: the auction answers the need');
    }
    const gapped = stockTown({ resourceAnalysis: { imports: { critical: [LABEL, 'salt'] }, gaps: [{ chain: 'grain', institution: 'Butchers (3-8)', kind: 'imported', impact: 'Butchers (3-8) runs on imported grain' }] } });
    same(gapped);
    const unnamed = stockTown({ resourceAnalysis: { imports: { critical: ['salt'] }, gaps: [] } });
    same(unnamed);
    for (const imp of ['Livestock', 'Game and hides (local hunting grounds exhausted)', 'Raw hides and animal products', 'Livestock equipment', 'Carved livestock figures', 'Animal fat', 'Hides']) {
      const s = stockTown({}, { primaryImports: [imp] });
      expect(needListOf(s), imp).toEqual(importsAsPrinted(s).needed);
    }
    expectAbsentWithAnchor(needListOf(stockTown({}, { primaryImports: ['Game and hides (local hunting grounds exhausted)'] })), LABEL, 'salt', 'game stocks the butchers\' counters');
    expect(needListOf(stockTown({}, { primaryImports: ['Livestock equipment'] }))).toContain(LABEL);
    /** @type {string[]} */
    const gives = [];
    for (const key of Object.keys(RESOURCE_DATA)) {
      const live = stockTown({ config: { tradeRouteAccess: 'road', nearbyResources: [key], nearbyResourcesDepleted: [], stressTypes: [] } });
      expect(needListOf(live), `${key} live`).toEqual(importsAsPrinted(live).needed);
      if (!needListOf(live).includes(LABEL)) gives.push(key);
      const spent = stockTown({ config: { tradeRouteAccess: 'road', nearbyResources: [key], nearbyResourcesDepleted: [key], stressTypes: [] } });
      expect(needListOf(spent), `${key} used up`).toEqual(importsAsPrinted(spent).needed);
      expect(needListOf(spent), `${key} used up gives nothing`).toContain(LABEL);
    }
    expect(gives.sort(), 'the copy\'s grounds are the ones the page reads as giving livestock').toEqual([...GOOD_HAD_COPY.livestock.grounds].sort());
    // a ground a house implies (a shepherd's pasture) is there: the page and the leaf alike
    const shepherd = stockTown({ institutions: [...stockTown().institutions, { name: 'Shepherd', catalogId: 'shepherd' }] });
    same(shepherd);
    expectAbsentWithAnchor(needListOf(shepherd), LABEL, 'salt', 'the shepherd proves the pasture');
    // RULING-R (R8 luxury): a commodity the place's own resources give meets its need (the gemstones' "luxury"); a chip of the
    // food a famine failed meets none
    const luxury = town({ resourceAnalysis: { imports: { critical: ['luxury goods', 'salt'] }, gaps: [], availableResources: ['luxury'] } });
    same(luxury);
    expectAbsentWithAnchor(needListOf(luxury), 'luxury goods', 'salt', 'the place\'s own luxury meets the need');
    const grain = (/** @type {unknown[]} */ stress) => town({ stress, economicState: { primaryImports: [], primaryExports: [], localProduction: [], activeChains: [], foodSecurity: { foodRecord: { failedSource: 'grain' } } },
      resourceAnalysis: { imports: { critical: ['Bulk grain and flour', 'salt'] }, gaps: [], availableResources: ['grain', 'grain_fields'] } });
    same(grain([]));
    expectAbsentWithAnchor(needListOf(grain([])), 'Bulk grain and flour', 'salt', 'its own grain meets the need');
    same(grain([{ type: 'famine' }]));
    expect(needListOf(grain([{ type: 'famine' }])), 'the famine failed the grain: the need stands').toContain('Bulk grain and flour');
    // no resource analysis: no list, no answer
    expect(needListOf({})).toEqual([]);
    expect(needNotBroughtInOf({})).toBeUndefined();
  });
  it('the keys: a need of the family holds its key, and no other', () => {
    const read = needNotBroughtInOf(town({}));
    expect(read).toEqual({ luxury: true, spice: true, silk: false, precious: false, salt: true, fuel: false, livestock: true, any: true });
    const none = needNotBroughtInOf(town({ resourceAnalysis: { imports: { critical: [] }, gaps: [] } }));
    expect(Object.values(/** @type {object} */ (none)).every((v) => v === false)).toBe(true);
    const silk = needNotBroughtInOf(town({ resourceAnalysis: { imports: { critical: ['Silk', 'gold/silver ore', 'charcoal'] }, gaps: [] } }));
    expect(silk).toEqual({ luxury: true, spice: false, silk: true, precious: true, salt: false, fuel: true, livestock: false, any: true });
  });
  it('the towns of the sample: the leaf is the page\'s list, label by label, and the atom reads it through factsOf, the public page and the veil alike', () => {
    expectNoSeedFailures(collectSeedFailures(Object.keys(TOWNS), (seed) => {
      const s = BORN.get(seed);
      expect(needListOf(s), seed).toEqual(importsAsPrinted(s).needed);
      const facts = factsOf(s);
      const pub = toPublicSafe(structuredClone(s));
      const veil = projectShareVeil(toPublicSafe(structuredClone(s)), null);
      for (const key of NEED_KEYS) {
        const atom = `need not brought in: ${key}`;
        const want = /** @type {Record<string, boolean>} */ (needNotBroughtInOf(s))[key];
        expect(atomHolds(atom, facts), `${seed} ${key}`).toBe(want);
        expect(atomHolds(atom, factsOf(pub)), `${seed} ${key} public`).toBe(want);
        expect(atomHolds(atom, factsOf(veil)), `${seed} ${key} veil`).toBe(want);
      }
    }));
    // the negatives beside the positives: the sample holds towns with a need of a key and towns without
    const held = NEED_KEYS.filter((key) => Object.keys(TOWNS).some((seed) => /** @type {any} */ (needNotBroughtInOf(BORN.get(seed)))?.[key]));
    expect(held.length, 'the sample holds a need of some key').toBeGreaterThan(0);
    expect(Object.keys(TOWNS).some((seed) => needListOf(BORN.get(seed)).length === 0), 'and a town with none').toBe(true);
    expectNoSeedFailures(collectSeedFailures(seedsOf('venture'), (seed) => {
      expect(needListOf(BORN.get(seed)), `${seed}: the failed venture's own material stays`).toContain('timber');
    }));
  });
});

describe('FAULTS-NEED item 2 (11e.wantBuy): a dependency goal presumes a supply only of a good that is brought in or had', () => {
  /** each dependency line as a matcher, its `{resource}` captured (the other slots any words) */
  const DEP = Object.values(GOAL_FAMILY_LINES.SUPPLY.dependency).flatMap((cell) => /** @type {any[]} */ (cell))
    .map((l) => String(typeof l === 'string' ? l : l.line))
    .map((t) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{resource\\\}/g, '(.+?)').replace(/\\\{[a-z]+\\\}/g, '.+?')}$`));
  /** @param {any} s @returns {Array<{ card: string, text: string, resource: string }>} */
  const depGoals = (s) => (s.npcs || []).flatMap((c) => ['short', 'long'].map((v) => ({ card: String(c.name), text: String(c.goal?.[v] ?? '') })))
    .map((g) => { const m = DEP.map((re) => re.exec(g.text)).find(Boolean); return m ? { ...g, resource: m[1] } : null; }).filter(Boolean);
  it('the matchers read the cell (the lines carry their slot)', () => {
    expect(DEP.length).toBe(12);
    expect(DEP.some((re) => re.test('Buy stone and iron and grain at the market in bulk this season, while the price is still fair.'))).toBe(true);
  });
  it('a good the need list names refuses; a good brought in, or one of another family, not', () => {
    const s = { tier: 'city', institutions: [], economicState: { primaryImports: ['Iron'], primaryExports: [], localProduction: [], activeChains: [] },
      resourceAnalysis: { imports: { critical: ['stone', 'copper ore', 'iron ore'] }, gaps: [] }, availableServices: {} };
    expect(goodNeededNotBroughtIn(s, 'Stone + iron + grain')).toBe(true);
    expect(goodNeededNotBroughtIn(s, 'Stone')).toBe(true);
    expect(goodNeededNotBroughtIn(s, 'Iron ore')).toBe(false); // the iron comes in: the need leaves the list
    expect(goodNeededNotBroughtIn(s, 'Metal ore + fuel')).toBe(false); // a wide word asks nothing: the smith's metal is had
    expect(goodNeededNotBroughtIn(s, 'Raw wool')).toBe(false);
    expect(goodNeededNotBroughtIn(s, '')).toBe(false);
  });
  it('the towns of the sample: no card wants a supply of a good the page says is needed and not brought in; dependency goals still deal', () => {
    expectNoSeedFailures(collectSeedFailures(Object.keys(TOWNS), (seed) => {
      const s = BORN.get(seed);
      expect(depGoals(s).filter((g) => goodNeededNotBroughtIn(s, g.resource)).map((g) => `${g.card}: ${g.text}`), seed).toEqual([]);
    }));
    // the negative beside it: a dependency goal on a good that is had still deals in the sample
    expect(Object.keys(TOWNS).some((seed) => depGoals(BORN.get(seed)).length > 0), 'a dependency goal deals somewhere').toBe(true);
    // the control's town still holds the dependency the cure refuses
    expectNoSeedFailures(collectSeedFailures(seedsOf('wantBuy'), (seed) => {
      const s = BORN.get(seed);
      const deps = (s.economicState?.tradeDependencies || []).map((/** @type {any} */ d) => String(d?.resource ?? ''));
      expect(deps.filter((r) => goodNeededNotBroughtIn(s, r)).length, `${seed} still holds a dependency on a good not brought in`).toBeGreaterThan(0);
    }));
  });
});

describe('FAULTS-NEED item 4 (12d, as amended): DS-ECO-8 POOR v1 is refused wherever the need list is not empty; its twin v6 there', () => {
  const block = /** @type {any} */ (DOSSIER_STATE_PROSE_ECONOMY)['DS-ECO-8'];
  const vid = (/** @type {number} */ n) => block.pools.POOR.find((/** @type {any} */ v) => v.vid === n);
  const v1 = vid(1); const v6 = vid(6);
  const scoped = block.poolMeta?.POOR?.crisisScoped === true;
  const admits = (/** @type {any} */ v, /** @type {any} */ f) => declarationAdmits(variantFactDeclaration(v), f, { crisisScoped: scoped }).admitted;
  /** the town's own facts, the need atom's answer replaced @param {any} facts @param {Record<string, boolean> | undefined} need */
  const withNeed = (facts, need) => Object.create(facts, { needNotBroughtIn: { value: need } });
  const none = Object.fromEntries(NEED_KEYS.map((k) => [k, false]));
  it('v1 declares `no need not brought in: any`; v6 is its twin: v1\'s angle and bands, the atom held, nothing of "every essential"', () => {
    expect(v1.text).toMatch(/^\{settlement\} covers what it must and nothing beyond\. Every essential is accounted for/);
    expect(v1.marks).toEqual(['crisis: any', 'food: ≥ secure', 'no need not brought in: any']);
    expect(v6.angle).toBe(v1.angle);
    expect(v6.marks).toEqual(['crisis: any', 'food: ≥ secure', 'need not brought in: any']);
    expect(/essential/i.test(v6.text), 'v6 says nothing of every essential').toBe(false);
    expect(/essential/i.test(v1.text), 'the anchor: v1 does').toBe(true);
    expect(block.pools.POOR.map((/** @type {any} */ v) => v.vid)).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it('the towns: v1 refused and v6 admitted where the list holds a need; the same facts with the list empty, v1 and not v6', () => {
    expectNoSeedFailures(collectSeedFailures(seedsOf('poor'), (seed) => {
      const s = BORN.get(seed);
      const facts = factsOf(s);
      expect(needListOf(s).length, `${seed} still holds a need`).toBeGreaterThan(0);
      expect(admits(v1, facts), `${seed}: v1 refused`).toBe(false);
      expect(admits(v6, facts), `${seed}: v6 admitted`).toBe(true);
      expect(admits(v1, withNeed(facts, none)), `${seed}: v1 admitted where nothing is needed (the food band holds)`).toBe(true);
      expect(admits(v6, withNeed(facts, none)), `${seed}: v6 refused there`).toBe(false);
    }));
  });
});
