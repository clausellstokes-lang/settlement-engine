// THE GUARD OF FAULTS-NEED (the sixth chair's BRIEF-FAULTS, section FAULTS-NEED, 2026-11-18): WHAT THE PAGE'S OWN NEED LIST SAYS,
// AS ONE FACT THE GENERATORS AND THE DESKS CAN READ. Each item held on a constructed record (a negative beside its positive) and on
// the fixed towns the base printed it in (the seventh read's thirty, the 150, the census's 720); the counts before and after over
// the whole populations are in docs/chair/2026-11-18/faults/FAULTS-NEED-HANDBACK.md.
//   item 0   the need list never drops a need, by a live house's printed service row (J-INCOME-2's `NEED_DEALT_ROWS`), for a
//            good a live house of the town is marked short of (`crisisStoppedRow.js :: rowShortOf`, the page's own mark): the
//            Dairy farmer's "Short of livestock." beside a shepherd's "Livestock management" (bar0-village-calm-rand-29,
//            r2r-village-47) keeps "Needed, and not brought in: livestock.".
// THE DETECTORS are the page's own readers (the need list, the mark) and the record's own rows; none reads the table the cure changed.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { importsAsPrinted, needMetBy } from '../../src/domain/display/tradeListDisplay.js';
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
