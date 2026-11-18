// THE GUARD OF FAULTS-NEED (the sixth chair's BRIEF-FAULTS, section FAULTS-NEED, 2026-11-18): WHAT THE PAGE'S OWN NEED LIST SAYS,
// AS ONE FACT THE GENERATORS AND THE DESKS CAN READ. Each item held on a constructed record (a negative beside its positive) and on
// the fixed towns the base printed it in (the seventh read's thirty, the 150, the census's 720); the counts before and after over
// the whole populations are in docs/chair/2026-11-18/faults/FAULTS-NEED-HANDBACK.md.
//   item 0   the need list never drops a need, by a live house's printed service row (J-INCOME-2's `NEED_DEALT_ROWS`), for a
//            good a live house of the town is marked short of (`crisisStoppedRow.js :: rowShortOf`, the page's own mark): the
//            Dairy farmer's "Short of livestock." beside a shepherd's "Livestock management" (bar0-village-calm-rand-29,
//            r2r-village-47) keeps "Needed, and not brought in: livestock.".
//   item 1   THE ATOM (FR2): `domain/facts/needNotBroughtIn.js` states the need list in the record's own words, held EQUAL here to
//            `importsAsPrinted(record).needed`, label by label, on every town this file births (the seventh read's thirty and the
//            fixed towns of the other items) and on a constructed record for each branch of the page's reader; its copied tables
//            are held to their homes; `need not brought in: <family>` reads it through `factsOf`, the public page and the veil alike.
// THE DETECTORS are the page's own readers (the need list, the mark) and the record's own rows; none reads the table the cure changed.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { importsAsPrinted, needMetBy, NEED_DEALT_ROWS } from '../../src/domain/display/tradeListDisplay.js';
import { LUXURY_CLASS, NOT_A_GOOD } from '../../src/data/tradeListDeclarations.js';
import { NEED_DEALT_ROWS_COPY, NEED_KEYS, LUXURY_LABELS_COPY, NOT_A_GOOD_COPY, needListOf, needNotBroughtInOf } from '../../src/domain/facts/needNotBroughtIn.js';
import { FACT_DIMENSIONS, atomHolds } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { rowShortOf } from '../../src/domain/display/crisisStoppedRow.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';

/** The towns each item is held in, with the items each one holds (the controls beside them). */
const TOWNS = Object.freeze({
  'bar0-village-calm-rand-29': ['short'], // the 150: the Dairy farmer short of livestock, a shepherd's livestock management
  'r2r-village-47': ['short'], // the 720: the same
  'r2r-city-43': ['dealt'], // the 720: a fair's livestock auction, no house short of livestock (the need stays dropped)
  'r2r-metropolis-12': ['dealt'],
  'r2r-metropolis-19': ['dealt'],
  'r2r-metropolis-25': ['dealt'],
  'r2r-hamlet-27': ['venture'], // the 720: the failed venture's own livestock beside a shepherd (the need stays)
  // the seventh read's thirty (`seeds.bar7.txt`): the atom held equal on each
  ...Object.fromEntries([45, 46, 47].flatMap((n) => ['thorp-calm', 'hamlet-calm', 'hamlet-under_siege', 'village-famine', 'village-calm', 'town-calm',
    'town-occupied', 'city-under_siege+famine', 'city-wartime', 'metropolis-calm'].map((k) => [`bar0-${k}-rand-${n}`, ['thirty']]))),
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
    expect(importsAsPrinted(other).needed).not.toContain('livestock');
  });
  it('the towns of the sample: no need is dropped by a service row where a live house is marked short of its good; the others stay dropped', () => {
    expectNoSeedFailures(collectSeedFailures(Object.keys(TOWNS), (seed) => {
      const s = BORN.get(seed);
      const nouns = markedNouns(s);
      const needed = importsAsPrinted(s).needed;
      const dropped = neededWithoutRows(s).filter((n) => !needed.includes(n));
      expect(dropped.filter((n) => nouns.some((noun) => needMetBy(n, noun))), `${seed}: a need dropped beside a house marked short of it`).toEqual([]);
    }));
    expectNoSeedFailures(collectSeedFailures(seedsOf('short'), (seed) => {
      const s = BORN.get(seed);
      expect(markedNouns(s), `${seed} still marks a house short of livestock`).toContain('livestock');
      expect(importsAsPrinted(s).needed, seed).toContain('livestock');
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
    expect([...NOT_A_GOOD_COPY]).toEqual([...NOT_A_GOOD]);
    expect([...LUXURY_LABELS_COPY]).toEqual(LUXURY_CLASS.map((r) => r.text));
    expect(LUXURY_CLASS.every((r) => r.needs.length === 1 && r.needs[0] === 'tier: ≥ village')).toBe(true);
    expect(NEED_DEALT_ROWS_COPY.map(([g, re]) => [g, String(re)])).toEqual(NEED_DEALT_ROWS.map(([g, re]) => [g, String(re)]));
    expect([...(FACT_DIMENSIONS['need not brought in'].keys || [])]).toEqual([...NEED_KEYS]);
  });
  it('a constructed record: each branch of the page\'s reader, the leaf beside it', () => {
    const base = town({});
    same(base);
    // the category error leaves; the luxury below its band leaves (a hamlet), stays at a town
    expect(needListOf(base)).not.toContain('Toll income');
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
    // no resource analysis: no list, no answer
    expect(needListOf({})).toEqual([]);
    expect(needNotBroughtInOf({})).toBeUndefined();
  });
  it('the keys: a need of the family holds its key, and no other', () => {
    const read = needNotBroughtInOf(town({}));
    expect(read).toEqual({ luxury: true, spice: true, silk: false, precious: false, salt: true, fuel: false, livestock: true });
    const none = needNotBroughtInOf(town({ resourceAnalysis: { imports: { critical: [] }, gaps: [] } }));
    expect(Object.values(/** @type {object} */ (none)).every((v) => v === false)).toBe(true);
    const silk = needNotBroughtInOf(town({ resourceAnalysis: { imports: { critical: ['Silk', 'gold/silver ore', 'charcoal'] }, gaps: [] } }));
    expect(silk).toEqual({ luxury: true, spice: false, silk: true, precious: true, salt: false, fuel: true, livestock: false });
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
      expect(needListOf(BORN.get(seed)), `${seed}: the failed venture's own material stays`).toContain('livestock');
    }));
  });
});
