/**
 * THE FRESH READER'S THREE MEDIUM LINES OF THIS LANE, HELD TRUE WHERE THEY PRINT (R3-CODE-C-8; the reader's file
 * docs/chair/2026-11-14/REVIEW-R3-CODE-C-2026-11-14.md on lane/review-r3-code-c-2026-11-14, rows L01, L05, L14; the
 * chair's rulings (a), (b) and (c) of 2026-11-14 08:06 UTC, vetoable by the owner).
 *
 * L01 · "older than anyone living" (heraldCausalGrammar.js :: TIME_BANDS, the sixth band's predicate) is said only of
 *   what is ninety years old or more, older than every person the record holds; from sixty to ninety the band says
 *   "older than all but the oldest alive" (LIVING_FLOOR). Held against the ages the same town prints: each History-desk
 *   sentence that carries either predicate names an event (or the town, or its ruin) whose `yearsAgo` is read, and the
 *   oldest person of the record (`npcs[].physical.age`, the elder words) is read beside it.
 *
 * The towns are the reader's own, born as its probe births them (probes/REVIEW-R3-CODE-C/births.mjs :: cfgFor, the
 * census's r2r-/r2s- shape): r2r-city-44 (the siege 61 years gone), r2r-thorp-41, r2r-town-19 (the great fire, 68),
 * r2s-under_siege-village-2 and r2s-under_siege-metropolis-0. Each arm collects first and asserts on the collection,
 * and asserts that it saw its line print (a guard that never sees its line proves nothing).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { LIVING_FLOOR, TIME_BANDS, timeBandOf } from '../../src/domain/display/heraldCausalGrammar.js';
import { yearBand } from '../../src/domain/display/stateProse/generalStateProse.js';
import { RESOURCE_CHAINS } from '../../src/data/goods/chains.js';

const OLD_WORDS = 'older than anyone living';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The reader's cfgFor for its census-shaped seeds, verbatim in effect. @param {string} seed */
const cfgFor = (seed) => {
  const r = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (r) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r[1] });
  const c = /** @type {RegExpMatchArray} */ (seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/));
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [c[1]], selectedStressesRandom: false, settType: c[2] });
};
const READER_TOWNS = ['r2r-city-44', 'r2r-thorp-41', 'r2r-town-19', 'r2s-under_siege-village-2', 'r2s-under_siege-metropolis-0'];
/** L05's: the famine thorp, the reader's four other livestock towns, and towns whose rows keep the claim. */
const CHAIN_TOWNS = ['r2s-famine-thorp-1', 'r2r-thorp-37', 'r2r-thorp-14', 'r2r-town-29', 'r2r-city-11', 'r2s-famine-village-0', 'r2r-metropolis-0', 'r2r-city-0', 'r2r-metropolis-3', 'r2s-famine-city-3', 'r2s-infiltrated-thorp-3'];
/** The record's elder age words at their oldest year (npcData.js, the elder band). */
const ELDER_TOP = Object.freeze({ 'early sixties': 63, 'mid-sixties': 66, 'late sixties': 69, seventies: 79 });

/** @param {unknown} o @param {string[]} [acc] */
const strings = (o, acc = []) => {
  if (typeof o === 'string') acc.push(o);
  else if (o && typeof o === 'object') for (const v of Object.values(o)) strings(v, acc);
  return acc;
};

/** Each History-desk sentence carrying `phrase`, with the age of what it names and the record's oldest person. */
const agesNamed = (/** @type {any} */ s, /** @type {string} */ phrase) => {
  const desk = generalDeskLines(s, { stresses: [].concat(s.stress || []).map((x) => x?.type).filter(Boolean) });
  const sentences = [...new Set(strings(desk).flatMap((t) => t.split(/(?<=[.;!?])\s+/)).filter((t) => t.includes(phrase)))];
  const oldest = Math.max(0, ...(s.npcs || []).map((/** @type {any} */ n) => ELDER_TOP[/** @type {keyof typeof ELDER_TOP} */ (n?.physical?.age)] || 0));
  return sentences.map((sentence) => {
    const low = sentence.toLowerCase();
    const events = [...(s.history?.historicalEvents || []), ...(s.history?.currentTensions || [])]
      .filter((e) => e?.name && low.includes(String(e.name).toLowerCase().replace(/^the /, '')));
    const ruin = s.history?.ancientRuin;
    const yearsAgo = events.length ? Math.min(...events.map((e) => Number(e.yearsAgo) || 0))
      : ruin?.name && low.includes(String(ruin.name).toLowerCase()) ? Number(ruin.yearsAgo)
        : low.includes(`${String(s.name).toLowerCase()} is `) ? Number(s.history?.age) : null;
    return { town: s.name, yearsAgo, oldest, sentence };
  });
};

/** @type {Array<any>} */ let towns = [];
/** @type {Array<any>} */ let chainTowns = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  const bear = (/** @type {string} */ seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
  towns = READER_TOWNS.map(bear);
  chainTowns = CHAIN_TOWNS.map(bear);
}, 180000);

describe('L01: the sixth band says "older than anyone living" only past every living age', () => {
  it('the band keeps its id either side of the floor, and its predicate reads the floor', () => {
    expect([61, 75, 89.5, 90, 182].map((y) => [y, yearBand(y).id, yearBand(y).predicate])).toEqual([
      [61, 'older_than_bearers', LIVING_FLOOR.predicate],
      [75, 'older_than_bearers', LIVING_FLOOR.predicate],
      [89.5, 'older_than_bearers', LIVING_FLOOR.predicate],
      [90, 'older_than_bearers', OLD_WORDS],
      [182, 'older_than_bearers', OLD_WORDS],
    ]);
    expect(timeBandOf(60, 52).id).toBe('a_generation');
    expect(LIVING_FLOOR.floorWeeks).toBeGreaterThanOrEqual(52 * 90);
    expect(TIME_BANDS[TIME_BANDS.length - 1].predicate).toBe(OLD_WORDS);
  });

  it('on the reader\'s towns: every "older than anyone living" names what is ninety or more and older than the oldest person', () => {
    const printed = towns.flatMap((s) => agesNamed(s, OLD_WORDS));
    const wrong = printed.filter((p) => p.yearsAgo === null || p.yearsAgo < 90 || p.yearsAgo <= p.oldest);
    expect(wrong).toEqual([]);
  });

  it('on the reader\'s towns: the sixty-to-ninety years say what only the oldest remember, and print', () => {
    const printed = towns.flatMap((s) => agesNamed(s, LIVING_FLOOR.predicate));
    const wrong = printed.filter((p) => p.yearsAgo === null || p.yearsAgo <= 60 || p.yearsAgo >= 90);
    expect(wrong).toEqual([]);
    expect(printed.map((p) => p.town)).toEqual(expect.arrayContaining(['Kallition'])); // r2r-city-44: the siege, 61y ago
    expect(printed.length).toBeGreaterThanOrEqual(5); // the five reader towns each print it at the tip of this cure
  });
});

/** A roster house as a kind: its head word, lower case, no counts, possessives or plural/-y ending. @param {unknown} name */
const kind = (name) => (String(name || '').toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[\s/]+/).find(Boolean) || '')
  .replace(/['’]/g, '').replace(/s$/, '').replace(/y$/, '');
/** The chain a famine's failed source stops, read from the food record's own words. */
const STOPPED = { grain: 'grain', mill: 'grain', livestock: 'livestock', fish: 'fish' };

describe('L05: "Complete production chain in place" only where the chain\'s houses stand and its source is not failed', () => {
  it('on the reader\'s chain towns: every complete row has each house its chain names on the roster, and no failed source', () => {
    const rows = chainTowns.flatMap((s) => (s.resourceAnalysis?.exports || [])
      .filter((/** @type {any} */ e) => e.reason === 'Complete production chain in place')
      .map((/** @type {any} */ e) => {
        const [key, chain] = /** @type {[string, any]} */ (Object.entries(RESOURCE_CHAINS).find(([, c]) => c.rawResource === e.chain) || ['', {}]);
        const kinds = new Set((s.institutions || []).map((/** @type {any} */ i) => kind(i?.name)));
        const lacking = (chain.processingInstitutions || []).filter((/** @type {string} */ n) => !/^access to /i.test(n) && !kinds.has(kind(n)));
        const failed = s.economicState?.foodSecurity?.foodRecord?.failedSource;
        const named = (chain.processingInstitutions || []).filter((/** @type {string} */ n) => !/^access to /i.test(n)).length;
        return { town: s.name, chain: key, product: e.product, lacking, named, stopped: STOPPED[/** @type {keyof typeof STOPPED} */ (failed)] === key };
      }));
    expect(rows.filter((r) => r.lacking.length > 0 || r.named === 0 || r.stopped)).toEqual([]);
    expect(rows.length).toBeGreaterThan(0); // the claim still prints where it is true
  });

  it('r2s-famine-thorp-1: the failed herds feed no cheese and no preserved meat (the row is not listed)', () => {
    const thorp = chainTowns[0];
    expect(thorp.economicState?.foodSecurity?.foodRecord?.failedSource).toBe('livestock');
    expect((thorp.resourceAnalysis?.exports || []).filter((/** @type {any} */ e) => e.chain === 'livestock')).toEqual([]);
  });

  it('r2s-famine-city-3: its mills and bakers stand, but the grain failed: no bread, beer or animal feed is listed', () => {
    const city = chainTowns[CHAIN_TOWNS.indexOf('r2s-famine-city-3')];
    expect(city.economicState?.foodSecurity?.foodRecord?.failedSource).toBe('grain');
    const kinds = new Set((city.institutions || []).map((/** @type {any} */ i) => kind(i?.name)));
    expect(['mill', 'baker'].filter((k) => !kinds.has(k))).toEqual([]); // anchored: the houses stand, so only the failed source stops it
    expect((city.resourceAnalysis?.exports || []).filter((/** @type {any} */ e) => e.chain === 'grain')).toEqual([]);
  });

  it('r2s-infiltrated-thorp-3: the oasis dates name no house, so their row gives its goods without the claim', () => {
    const thorp = chainTowns[CHAIN_TOWNS.indexOf('r2s-infiltrated-thorp-3')];
    expect((thorp.resourceAnalysis?.exports || []).filter((/** @type {any} */ e) => e.chain === 'oasis_water'))
      .toEqual([expect.objectContaining({ product: 'dried dates, date wine, water rights', reason: '' })]);
  });
});
