// BAR5-MAGIC · ONE READING OF HOW FAR THE TOWN RELIES ON MAGIC, GUARDED (BRIEF-BAR5 Amendment L, L4; LAW 1 rule 1a of the
// audit, docs/chair/2026-11-16/bar5/AUDIT/BAR5-AUDIT-A-HANDBACK.md): the audit's own detector (`tests/helpers/pageLaws/law1.mjs
// :: law1a`) read over the census's 720 and the sixty read towns, every sentence about reliance against the word the page
// prints.
//
//   THE FACT MADE ONE: the record's reading (`magicReliance.js :: deriveMagicReliance`, stored as
//     `defenseProfile.magicDependency`) and the page's word (`magicProvisionShown.js :: relianceReadingShown`) were two
//     readings; the DS-DEF-9 desk read the first, the Magic tab's word and role lines the second. Every sentence about
//     reliance now reads the word the page prints (`relianceShownOf`): the desk's key, and the `magic reliance` atom the two
//     narrative lines of `POLITICAL_FLAVOR.magical_heavy` declare.
//   THE ZERO: every town born as the census bears it, its page's reliance word (`deriveMagicRelianceView`, the word the Magic
//     tab and Foundations print), the DS-DEF-9 desk as the owner's page and the player's page draw it, and the stored
//     historical character (Overview, History): law1a finds no instance. Red at 600b7683a by the audit's count: 23 census towns
//     (22 by the desk, 1 by the narrative line) and 5 of the sixty (C17061 C29831 C9617 C33713 C43125); a plant of the desk alone back on
//     the record's reading reds this guard in 29 of 780 (it reads no role row, so the four Present towns the audit spared count).
//   THE POSITIVE CONTROL: the read's own rows, cured here, as constructed pages: the detector must still fire on each.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { law1a, MAGIC_DEPENDS } from '../helpers/pageLaws/law1.mjs';
import { CRISIS_KIND_WORDS, FACT_DIMENSIONS, MAGIC_RELIANCE_WORDS, TIER_WORDS, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { MAGIC_RELIANCE_READINGS, MAGIC_RELIANCE_WORD } from '../../src/domain/magicReliance.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { POLITICAL_FLAVOR } from '../../src/generators/narrativeText.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { magicRoleBandShown } from '../../src/domain/display/magicProvisionShown.js';

/** A narrative row's text, filled over one named event (its closure picks the event: seeded here). @param {any} r @returns {string} */
function filled(r) {
  const prev = setActiveRng(createPRNG('bar5-magic'));
  try { return r.text([{ type: 'magical', name: 'Arcane Incident' }]); } finally { clearActiveRng(prev); }
}

/** THE CENSUS'S 720, by its rule (CENSUS-3 seeds.txt). */
const CENSUS = [
  ...TIER_WORDS.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISIS_KIND_WORDS.flatMap((crisis) => TIER_WORDS.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${crisis}-${size}-${i}`))),
];
/** THE SIXTY READ TOWNS (REVIEW-BAR-4 and REVIEW-BAR-5: the bar's ten shapes, rand-21 to rand-26). */
const SHAPES = ['thorp-calm', 'hamlet-calm', 'hamlet-under_siege', 'village-famine', 'village-calm', 'town-occupied', 'town-calm',
  'city-under_siege+famine', 'city-wartime', 'metropolis-calm'];
const SIXTY = [21, 22, 23, 24, 25, 26].flatMap((n) => SHAPES.map((shape) => `bar0-${shape}-rand-${n}`));

/** CENSUS-3 seedcfg.mjs's r2r-, r2s- and bar0- arms, verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  m = seed.match(/^bar0-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  if (m) return { ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true };
  throw new Error(`a guard seed is a census or a read seed: ${seed}`);
}

/** Every string a desk's answer carries (the rung's sentence and its pieces). @param {unknown} v @returns {string[]} */
const stringsOf = (v) => (typeof v === 'string' ? [v] : v && typeof v === 'object' ? Object.values(v).flatMap(stringsOf) : []);

/** @type {Map<string, {tabs: Record<string, string[]>, word: string|null}>} */
const PAGES = new Map();

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { magicDeskRead } = await import('../../src/components/new/magicDeskRead.js');
  const { deriveMagicRelianceView } = await import('../../src/domain/display/dossierViewModel.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of [...CENSUS, ...SIXTY]) {
    const town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} });
    const view = deriveMagicRelianceView(town);
    const word = view.shown ? view.word : null;
    /** @type {string[]} */ const desk = [];
    for (const playerView of [false, true]) {
      try { desk.push(...stringsOf(magicDeskRead(town, { publicDossier: false, playerView }))); } catch { /* a desk that throws prints nothing */ }
    }
    const tabs = {
      'Systems/Magic': [...(word ? [`Reliance on magic: ${word}`] : []), ...desk],
      'World/History': [String(town?.history?.historicalCharacter ?? '')],
    };
    PAGES.set(seed, { tabs, word });
  }
}, 2400000);

describe('THE ZERO: no sentence about reliance asserts more than the word the page prints (the 720 and the sixty)', () => {
  it('every census town and every read town reads zero instances of rule 1a', () => {
    const failures = collectSeedFailures([...CENSUS, ...SIXTY], (seed) => {
      const page = PAGES.get(seed);
      expect(page, `${seed} was born`).toBeDefined();
      expect(law1a({ record: {}, tabs: page?.tabs || {}, town: seed }).map((i) => `${i.law} :: ${i.line}`), `the instances at ${seed}`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'rule 1a reads zero');
  });
  it('the census holds every page word, so the zero is read under each (none, present, relied upon, integral)', () => {
    const words = new Set([...PAGES.values()].map((p) => p.word));
    for (const r of MAGIC_RELIANCE_READINGS) expect(words.has(MAGIC_RELIANCE_WORD[r]), MAGIC_RELIANCE_WORD[r]).toBe(true);
  });
});

/** The DS-DEF-9 line of a pool, filled as the desk fills it. @param {string} poolKey @param {number} vid @param {Record<string,string>} slots */
function deskLine(poolKey, vid, slots) {
  const v = /** @type {any} */ (DOSSIER_STATE_PROSE_DEFENSE)['DS-DEF-9'].pools[poolKey].find((/** @type {any} */ x) => x.vid === vid);
  return String(v.text).replace(/\{(\w+)\}/g, (_, k) => slots[k] ?? `{${k}}`);
}

/** The narrative line of C17061 and C29831, filled as the history fills it. */
const RELIES = POLITICAL_FLAVOR.magical_heavy.map(filled).find((t) => /relies on arcane workings/.test(t));

describe('THE POSITIVE CONTROL: the read\'s own rows, cured here, as constructed pages: the detector must still fire', () => {
  const ROWS = [
    { row: 'C9617', town: 'bar0-city-wartime-rand-24', word: 'None', line: deskLine('magicDependency true, with a NAMED dependent chain', 3, { settlement: 'Ingines' }).replace("town's", "city's") },
    { row: 'C33713', town: 'bar0-town-calm-rand-25', word: 'None', line: deskLine('magicDependency true, with a NAMED dependent chain', 3, { settlement: 'Padmavalli' }) },
    { row: 'C43125', town: 'bar0-village-famine-rand-25', word: 'None', line: deskLine('magicDependency true, with a NAMED dependent chain', 3, { settlement: 'Bjorney' }).replace("town's", "village's") },
    { row: 'C17061', town: 'bar0-hamlet-under_siege-rand-24', word: 'None', line: RELIES },
    { row: 'C29831', town: 'bar0-thorp-calm-rand-24', word: 'None', line: RELIES },
    // constructed (no read row): the widened arm, the plain pool's v1 under Present with no role line held
    { row: 'constructed', town: 'r2r-town-0', word: 'Present', line: deskLine('magicDependency true', 1, { settlement: 'Ingines' }) },
  ];
  for (const r of ROWS) {
    it(`${r.row} (${r.town}): "${String(r.line).slice(0, 60)}…" under "Reliance on magic: ${r.word}"`, () => {
      const found = law1a({ record: {}, tabs: { 'Systems/Magic': [`Reliance on magic: ${r.word}`, String(r.line)] }, town: r.town });
      expect(found.map((i) => i.law)).toEqual([r.word === 'None' ? '1a-depends/None' : '1a-depends/Present']);
    });
  }
  it('the same line under the word that bears it out is no instance (Relied upon)', () => {
    const found = law1a({ record: {}, tabs: { 'Systems/Magic': ['Reliance on magic: Relied upon', String(ROWS[0].line)] }, town: ROWS[0].town });
    expect(found).toEqual([]);
  });
  it('every line of the two "magicDependency true" pools is read by the detector (none slips past by its wording)', () => {
    for (const key of ['magicDependency true', 'magicDependency true, with a NAMED dependent chain']) {
      for (const v of /** @type {any} */ (DOSSIER_STATE_PROSE_DEFENSE)['DS-DEF-9'].pools[key]) {
        const line = deskLine(key, v.vid, { settlement: 'Ingines', good: 'salted fish' });
        expect(MAGIC_DEPENDS.some((re) => re.test(line)), `${key} v${v.vid}: ${line}`).toBe(true);
      }
    }
  });
});

describe('THE ATOM: `magic reliance` reads the word the page prints, and the two narrative lines declare it', () => {
  it('the ladder is the reading\'s own, in its order', () => {
    expect([...MAGIC_RELIANCE_WORDS]).toEqual([...MAGIC_RELIANCE_READINGS]);
    expect(FACT_DIMENSIONS['magic reliance'].home).toBe('magicRelianceShown');
  });
  it('the two lines that assert a dependence, and only they, declare `magic reliance: ≥ relied-upon`', () => {
    const declared = POLITICAL_FLAVOR.magical_heavy.filter((r) => (r.needs || []).some((a) => parseAtom(a).dimension === 'magic reliance' && parseAtom(a).value === 'relied-upon'));
    const texts = declared.map(filled);
    expect(texts.some((t) => /more dependent on arcane resources/.test(t))).toBe(true);
    expect(texts.some((t) => /relies on arcane workings/.test(t))).toBe(true);
    expect(declared).toHaveLength(2);
    for (const r of declared) expect(r.needs).toContain('magic reliance: ≥ relied-upon');
  });
  it('the pool-mate that names the magic-workers declares a practitioner (`magic reliance: ≥ present`): the page\'s None has none', () => {
    const workers = POLITICAL_FLAVOR.magical_heavy.filter((r) => /magic-workers/.test(filled(r)));
    expect(workers).toHaveLength(1);
    expect(workers[0].needs).toContain('magic reliance: ≥ present');
  });
});

describe('THE ROLE ROW: no role prints "integral" under a reliance word that says nothing depends on magic', () => {
  const PRESENT = { tier: 'city', config: { magicLevel: 40 }, institutions: [{ name: "Mages' guild", category: 'Magic', tags: ['arcane'] }], npcs: [], economicState: { activeChains: [] } };
  it('under Present the integral band prints "common"; the other bands are the profile\'s', () => {
    for (const role of ['economic', 'infrastructure']) {
      expect(magicRoleBandShown(PRESENT, role, 'integral'), role).toBe('common');
      expect(magicRoleBandShown(PRESENT, role, 'occasional'), role).toBe('occasional'); // the profile's word, untouched
    }
  });
});
