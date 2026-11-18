// THE GUARD OF BAR8 J-INCOME (the sixth chair's BRIEF-BAR8, section J-INCOME, 2026-11-17; the seat J-INCOME-2): THE INCOME LINES
// AND THE NEED LIST READ THE SUPPLY STORY. The rules of BAR8-AUDIT-J's hand-back (11a.imported, 11b's rites income line, 11e.offer's
// need-list half) and BAR8-AUDIT-K's 15c, each held here on a constructed record (a negative beside its positive) and on the fixed
// towns the base printed it in (the seventh read's thirty, the 150, the census's 720); the counts before and after are in
// docs/chair/2026-11-17/bar8/BAR8-J-INCOME-HANDBACK.md.
//   item 1   the trade's ordinary income lines live in an import-free leaf (`domain/display/incomeOrdinaryLines.js`) the printed
//            export may read; `incomeLineSiblings.js` re-exports the same objects;
//   item 2   11b: where every fishery is fished out the income line asks the fish story first: the salted fish bought in, the
//            bought line; nothing bought, no sentence; never "rites keep the catch coming, and it is landed and sold here";
//   item 3   11a.imported: the need list drops a need a gap row of kind `imported` answers ("Smelter runs on imported iron ore");
//   item 4   11e.offer: the need list drops a good a live house's printed service row deals in (a fair's livestock auction, a
//            shepherd's livestock management), save the failed venture's own material;
//   item 5   15c: a chain card prints no monster hunting through a veteran's lodge, whose card offers armed escort only.
// THE DETECTORS are plain patterns of the printed words and the record's own rows; none reads the table the cure changed.
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import * as leaf from '../../src/domain/display/incomeOrdinaryLines.js';
import * as siblings from '../../src/generators/economy/incomeLineSiblings.js';
import { importsAsPrinted, chainOutputsShown } from '../../src/domain/display/tradeListDisplay.js';

const RITES = /\brites keep the catch coming\b/;
const BOUGHT = /^The fishery here is fished out; the fish sold now is salted and bought in\.$/;
const SALTED = /\bsalt(?:ed)? fish\b/i;

/** The towns the base printed each rule in, with the rule each one holds (the controls first). */
const TOWNS = Object.freeze({
  'bar0-metropolis-calm-rand-45': ['rites'], // C20963
  'bar0-village-calm-rand-47': ['rites', 'imported'], // C42801, C42813 (the tannery runs on imported livestock)
  'bar0-city-wartime-rand-47': ['rites'],
  'r2r-town-6': ['rites'], // BAR4-CORPUS-ECO's FS1 anchor, the story bought
  'r2r-metropolis-45': ['rites'], // the story idle
  'bar0-city-under_siege+famine-rand-45': ['imported'], // C0893
  'bar0-city-under_siege+famine-rand-27': ['imported'],
  'bar0-town-calm-rand-46': ['livestock'],
  'bar0-city-wartime-rand-33': ['livestock'],
  'bar0-town-calm-rand-47': ['hunt'], // C36003
  'bar0-town-calm-rand-30': ['hunt'],
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
const descs = (/** @type {any} */ s) => (s?.economicState?.incomeSources || []).map((/** @type {any} */ r) => String(r?.desc ?? ''));
const fishedOut = (/** @type {any} */ s) => (s?.config?.nearbyResourcesDepleted || []).some((/** @type {unknown} */ r) => /fish/.test(String(r)));

describe('BAR8 J-INCOME item 1: the ordinary income lines in an import-free leaf', () => {
  it('the leaf imports nothing, and the generator module re-exports its very objects', () => {
    const src = readFileSync(new URL('../../src/domain/display/incomeOrdinaryLines.js', import.meta.url), 'utf8');
    // the chair's ruling of 2026-11-18: the leaf's one import is the ruin filter (`institutionRoster.js`, itself import-free)
    expect([...src.matchAll(/^\s*import\b.*?from '([^']+)'/gm)].map((m) => m[1])).toEqual(['../institutions/institutionRoster.js']);
    const names = Object.keys(leaf);
    expect(names).toContain('ordinaryIncomeLineOf');
    for (const k of names) expect(/** @type {Record<string, unknown>} */ (siblings)[k], k).toBe(/** @type {Record<string, unknown>} */ (leaf)[k]);
    // the reading is the one it was: a short twin under no mark gives the trade's ordinary line; any other line, null
    expect(leaf.ordinaryIncomeLineOf(leaf.CLOTH_SHORT_LINE, { institutions: [{ name: 'Weavers guild' }] })).toBe(leaf.CLOTH_WORKED_LINE);
    expect(leaf.ordinaryIncomeLineOf(leaf.METAL_WORKED_LINE, { institutions: [] })).toBeNull();
  });
  it('the roster is read live: a ruined weavers\' house weaves nothing (the chair\'s ruling of 2026-11-18)', () => {
    const weavers = { name: 'Weavers guild' };
    // a fulling house stands at work beside it: the live roster still finishes cloth (the positive beside the negative)
    expect(leaf.ordinaryIncomeLineOf(leaf.CLOTH_SHORT_LINE, { institutions: [weavers, { name: 'Fuller' }] })).toBe(leaf.CLOTH_WORKED_LINE);
    expect(leaf.ordinaryIncomeLineOf(leaf.CLOTH_SHORT_LINE, { institutions: [{ ...weavers, _worldPulseInactive: true }] })).toBe('');
    expect(leaf.ordinaryIncomeLineOf(leaf.TIMBER_SHORT_LINE, { institutions: [{ name: 'Sawmill', _worldPulseInactive: true }] })).toBe(leaf.TIMBER_PLAIN_LINE);
  });
  it('BR33 (2): the metal arm asks the live roster too: a ruined forge works no metal (the reader\'s MED 2)', () => {
    const smiths = { name: 'Blacksmiths (3-10)' };
    expect(leaf.ordinaryIncomeLineOf(leaf.METAL_SHORT_LINE, { institutions: [smiths] })).toBe(leaf.METAL_WORKED_LINE);
    expect(leaf.ordinaryIncomeLineOf(leaf.METAL_SHORT_LINE, { institutions: [{ ...smiths, status: 'ruined' }] })).toBe('');
  });
});

describe('BAR8 J-INCOME item 2 (11b): the fished-out income line asks the fish story first', () => {
  const RITE_CHAIN = { chainId: 'fishing', resourceKey: 'fishing_grounds', status: 'operational', magicRecovery: 2 };
  const f = (/** @type {Record<string, unknown>} */ over) => ({ roster: ['fishermen'], besieged: false, imports: [], exports: [], chains: [RITE_CHAIN], top: false, fisheryExhausted: true, ...over });
  it('a constructed record: bought in, the bought line; nothing bought, no sentence; a live fishery keeps its line', () => {
    expect(siblings.trueIncomeDesc(siblings.FISH_EXPORT_LINE, f({ imports: ['Salted fish (local sea fisheries exhausted)'] }))).toBe(siblings.FISH_BOUGHT_LINE);
    expect(siblings.trueIncomeDesc(siblings.FISH_EXPORT_LINE, f({}))).toBe('');
    // the negative beside it: the live fishery's own line stands (the rule reads the fished-out ground only)
    expect(siblings.trueIncomeDesc(siblings.FISH_EXPORT_LINE, f({ fisheryExhausted: false, exports: ['Salted fish'] }))).toBe(siblings.FISH_EXPORT_LINE);
  });
  it('no town of the sample prints the rites line; where the salted fish is bought in at a town or larger, the bought line', () => {
    expectNoSeedFailures(collectSeedFailures(seedsOf('rites'), (seed) => {
      const s = BORN.get(seed);
      expect(fishedOut(s), `${seed} is still fished out`).toBe(true);
      expect(descs(s).filter((d) => RITES.test(d)), seed).toEqual([]);
      if (s.tier !== 'village' && (s.economicState?.primaryImports || []).slice(0, 10).some((/** @type {unknown} */ x) => SALTED.test(String(x)))) {
        expect(descs(s).some((d) => BOUGHT.test(d)), `${seed} prints the bought line`).toBe(true);
      }
    }));
  });
});

describe('BAR8 J-INCOME items 3 and 4: the need list reads the gap rows and the houses that deal in a good', () => {
  const town = (/** @type {Record<string, unknown>} */ over) => ({
    institutions: [{ name: 'Annual fair' }, { name: 'Smelter' }],
    economicState: { primaryImports: [], primaryExports: [], localProduction: [], activeChains: [] },
    resourceAnalysis: { imports: { critical: ['iron ore', 'copper ore', 'livestock'] }, gaps: [] },
    availableServices: {},
    ...over,
  });
  it('a constructed record: a gap row of kind imported answers its need, and no other', () => {
    const gaps = [{ chain: 'iron ore', institution: 'Smelter', kind: 'imported', impact: 'Smelter runs on imported iron ore' }];
    expect(importsAsPrinted(town({})).needed).toContain('iron ore');
    const needed = importsAsPrinted(town({ resourceAnalysis: { imports: { critical: ['iron ore', 'copper ore', 'livestock'] }, gaps } })).needed;
    expectAbsentWithAnchor(needed, 'iron ore', 'copper ore', 'the gap row answers iron ore, and no other need');
    // a gap row of another kind says nothing is brought in
    expect(importsAsPrinted(town({ resourceAnalysis: { imports: { critical: ['iron ore'] }, gaps: [{ ...gaps[0], kind: 'missing' }] } })).needed).toContain('iron ore');
  });
  it('a constructed record: a live house\'s livestock auction answers "livestock"; no row, or another house\'s, not', () => {
    const auction = { economy: [{ name: 'Livestock auction', institution: 'Annual fair' }] };
    expect(importsAsPrinted(town({})).needed).toContain('livestock');
    expectAbsentWithAnchor(importsAsPrinted(town({ availableServices: auction })).needed, 'livestock', 'iron ore', 'the auction answers livestock, and no other need');
    expect(importsAsPrinted(town({ availableServices: { economy: [{ name: 'Livestock auction', institution: 'A fair long gone' }] } })).needed).toContain('livestock');
    expect(importsAsPrinted(town({ availableServices: { economy: [{ name: 'Seasonal trading', institution: 'Annual fair' }] } })).needed).toContain('livestock');
  });
  it('the towns of the sample: no need the record\'s own gap rows or service rows say is brought in or dealt in', () => {
    expectNoSeedFailures(collectSeedFailures(seedsOf('imported'), (seed) => {
      const s = BORN.get(seed);
      const gapGoods = (s.resourceAnalysis?.gaps || []).filter((/** @type {any} */ g) => g?.kind === 'imported').map((/** @type {any} */ g) => String(g.chain).toLowerCase());
      expect(gapGoods.length, `${seed} still holds a gap row of kind imported`).toBeGreaterThan(0);
      expect(importsAsPrinted(s).needed.filter((n) => gapGoods.includes(String(n).toLowerCase())), seed).toEqual([]);
    }));
    expectNoSeedFailures(collectSeedFailures(seedsOf('livestock'), (seed) => {
      const s = BORN.get(seed);
      const rows = Object.values(s.availableServices || {}).flat().filter((/** @type {any} */ r) => /^livestock (?:auctions?|management)$/i.test(String(r?.name ?? '')));
      expect(rows.length, `${seed} still prints a livestock service row`).toBeGreaterThan(0);
      expect(importsAsPrinted(s).needed.filter((n) => /\blivestock\b/i.test(String(n))), seed).toEqual([]);
    }));
  });
});

describe('BAR8 J-INCOME item 5 (K\'s 15c): a chain card\'s outputs are the ones a listed house bears out', () => {
  const chain = (/** @type {string} */ house) => ({ chainId: 'adventuring_escort', label: 'Adventuring & Escort', status: 'operational', resourceInputKey: null, entrepot: false,
    processingInstitutions: [house], outputs: ['Armed escort', 'Monster hunting services', 'Dungeon clearance'] });
  const at = (/** @type {string} */ house) => ({ institutions: [{ name: house }], economicState: { activeChains: [chain(house)] } });
  it('a veteran\'s lodge bears out armed escort only; an adventurers\' guild, its monster hunting too', () => {
    expect(chainOutputsShown(chain("Veteran's lodge"), at("Veteran's lodge"))).toEqual(['Armed escort']);
    expect(chainOutputsShown(chain("Adventurers' guild"), at("Adventurers' guild"))).toEqual(['Armed escort', 'Monster hunting services', 'Dungeon clearance']);
  });
  it('the towns of the sample: no card through a veteran\'s lodge alone prints monster hunting or dungeon clearance', () => {
    expectNoSeedFailures(collectSeedFailures(seedsOf('hunt'), (seed) => {
      const s = BORN.get(seed);
      const cards = (s.economicState?.activeChains || []).filter((/** @type {any} */ c) => c?.chainId === 'adventuring_escort');
      expect(cards.length, `${seed} still works the escort chain`).toBeGreaterThan(0);
      for (const c of cards) {
        const via = (c.processingInstitutions || []).filter((/** @type {string} */ h) => (s.institutions || []).some((/** @type {any} */ i) => i?.name === h));
        if (via.every((/** @type {string} */ h) => /veteran/i.test(h))) expect(chainOutputsShown(c, s).filter((o) => /monster|dungeon/i.test(o)), seed).toEqual([]);
        expect(chainOutputsShown(c, s), `${seed} keeps its armed escort`).toContain('Armed escort');
      }
    }));
  });
});
