/**
 * fortuneMeritSentence.test.js — FORTUNE U5b: THE MERIT'S SENTENCE IN THE GOVERNANCE PARAGRAPH, AND THE NEUTRAL READING
 * THAT NO LONGER CONTRADICTS IT (the seventh chair's ruling of 22:26 UTC 2026-11-20; the brief
 * `docs/chair/2026-11-20/content/fortune/briefs/U5b-BUILD.md`).
 *
 * ⭐ WHAT THIS FILE PROVES, on places born under the fortune law by the fixture arm
 * (`{ ...birthConfig(cfg), _fortuneLawVersion: 2 }` after `loadGenerationLawPayloads()`):
 *   (a) where `meritsOf` credits the record, the paragraph holds the pool's sentence for it (the kernel's rendezvous
 *       pick over `FORTUNE_MERIT_LINES` on each row's id, the time word the law's table gives the event's `yearsAgo`), DIRECTLY after the
 *       standing sentence, and nothing else of the paragraph moved (the same record forced to law 1 is the paragraph
 *       without it); both bands of `yearsAgo` are hit;
 *   (b) a law-1 birth, a law-2 birth without the merit and a record with no `publicLegitimacy` print none of the pool's
 *       sentences (the two-tree confinement proves the births themselves untouched);
 *   (c) visitor-city-14 (all four terms 0, the merit present): the neutral-baseline reading no longer prints beside its
 *       standing (`legitimacyReadingPoolKey`);
 *   (d) THE EIGHTEEN EQUALITIES: each wording with its time word, on each of the six places of PAGES.md, is one string on
 *       the owner's record, on `toPublicSafe(record)` and under the widest veil; and the six (wording, time word) pairs
 *       are all reached;
 *   (e) the sentence is printed once on the power page; each wording is reachable.
 *
 * Every expected sentence is COMPUTED from the pool, the law's table and the predicates (`meritsOf`,
 * `weatheredCatastrophe`); none is quoted.
 *
 * @enforced-by this test
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { governanceAccountOf, governanceStressTypesOf, powerNameInProse } from '../../src/domain/display/governanceAccount.js';
import { resolvePrimaryStress } from '../../src/generators/stressPriority.js';
import { rulingChainOf } from '../../src/domain/dossier/powerStrata.js';
import { meritsOf, weatheredCatastrophe } from '../../src/domain/fortune/fortuneMerits.js';
import { FORTUNE_LAW_CONFIG_KEY, FORTUNE_LAW_TUNING } from '../../src/domain/fortune/fortuneLaw.js';
import { pickRendezvous } from '../../src/kernel/proseHash.js';

/** The line's own id: the pick is the rendezvous on it (point 121, TAIL-PICKS). @param {any} l @returns {string} */
const idOfLine = (l) => l.id;
import { legitimacyReadingPoolKey, powerStateProse } from '../../src/domain/display/stateProse/powerStateProse.js';
import { governanceLedger } from '../../src/domain/governanceLedger.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { CARD_KINDS, GROUPING_REMOVERS, applyVeil, isHideable } from '../../src/domain/display/galleryVeil.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const STANDING = /** @type {any} */ (FORTUNE_LAW_TUNING.standing);
const TIMEOUT = 240_000;

/** The widest veil the registry admits (as tests/generators/fortuneLawMerits.test.js builds it). */
const WIDEST = [
  ...Object.keys(GROUPING_REMOVERS),
  ...Object.entries(CARD_KINDS).flatMap(([kind, k]) => Object.keys(k.fields).map((field) => `class:${kind}:${field}`)),
].filter((address) => isHideable(address));

/** The six places of PAGES.md (the ruled draft's instrument): [seed, size, dials]. */
const PLACES = [
  ['hxd-metropolis-73', 'metropolis', {}],
  ['visitor-thorp-71', 'thorp', { _randomizePriorities: true }],
  ['visitor-hamlet-21', 'hamlet', { _randomizePriorities: true }],
  ['visitor-village-8', 'village', { _randomizePriorities: true }],
  ['visitor-town-97', 'town', { _randomizePriorities: true }],
  ['visitor-city-14', 'city', { _randomizePriorities: true }],
];

/** @param {string} seed @param {string} size @param {object} dials @param {number|null} law the marker forced after birthConfig, or none */
const born = (seed, size, dials, law) => {
  const config = birthConfig({ ...DEFAULT_CONFIG, settType: size, ...dials });
  return /** @type {any} */ (generateSettlementPipeline(law === null ? config : { ...config, [FORTUNE_LAW_CONFIG_KEY]: law }, null, { seed, customContent: {} }));
};

/** @param {any} record */
const paragraphOf = (record) => governanceAccountOf(record, { primaryStress: resolvePrimaryStress(governanceStressTypesOf(record)) })?.text ?? '';

/** @param {any} record @param {number} law @returns {any} the same record, its law marker forced */
const withLaw = (record, law) => ({ ...record, config: { ...record.config, [FORTUNE_LAW_CONFIG_KEY]: law } });

/** @param {any} record @returns {'recent'|'generation'|null} the band of the merit's event by the law's table */
const bandOf = (record) => {
  const ev = weatheredCatastrophe(record);
  if (!ev || typeof ev.yearsAgo !== 'number') return null;
  if (ev.yearsAgo <= RECENT) return 'recent';
  return ev.yearsAgo <= STANDING.weatheredWithinYears ? 'generation' : null;
};

/**
 * The pool's line filled for this record, COMPUTED from the pool, the time words, the predicates and the paragraph's own
 * fills (`name`, `powerNameInProse` of the governing power); null where `meritsOf` credits none.
 * @param {any} pool @param {any} times @param {any} record @param {{ text: string }} line
 */
const fillOf = (pool, times, record, line) => {
  if (!meritsOf(record).includes('weathered')) return null;
  const ev = /** @type {any} */ (weatheredCatastrophe(record));
  const band = bandOf(record);
  if (!ev || !band) return null;
  /** @type {Record<string, string>} */
  const slots = {
    event: String(ev.name).trim(),
    place: String(record.name).trim(),
    seat: powerNameInProse(String(rulingChainOf(record).power?.name ?? '').trim()),
    ...times[band],
  };
  return line.text.replace(/\{(\w+)\}/g, (/** @type {string} */ _m, /** @type {string} */ k) => slots[k] ?? '');
};

/** @param {string} hay @param {string} needle */
const countOf = (hay, needle) => hay.split(needle).length - 1;

/** @type {any} */ let POOL = null;
/** @type {any} */ let TIMES = null;
/** @type {any} */ let RECENT = null;
/** @type {Array<{ seed: string, record: any }>} */ const SIX = [];
/** @type {any} */ let LAW1 = null;
/** @type {any} */ let UNMERITED = null;

beforeAll(async () => {
  // the pool is imported by its own door so that a tree without it reds BY TITLE, not as a load failure
  const lines = await import('../../src/data/fortuneMeritLines.js').catch(() => null);
  POOL = lines?.FORTUNE_MERIT_LINES ?? null;
  TIMES = lines?.FORTUNE_MERIT_TIME_WORDS ?? null;
  RECENT = lines?.FORTUNE_MERIT_RECENT_YEARS ?? null;
  await loadGenerationLawPayloads();
  for (const [seed, size, dials] of PLACES) SIX.push({ seed: /** @type {string} */ (seed), record: born(/** @type {string} */ (seed), /** @type {string} */ (size), /** @type {object} */ (dials), 2) });
  // the law-1 town FORCES law 1 in its own config (the flip, 2026-11-23: born markerless it was law 1 only while the dial was dark)
  LAW1 = born('hxd-metropolis-73', 'metropolis', {}, 1);
  for (let i = 0; i < 40 && !UNMERITED; i += 1) {
    const t = born(`visitor-town-${i}`, 'town', { _randomizePriorities: true }, 2);
    if (!meritsOf(t).length && t.powerStructure?.publicLegitimacy?.label) UNMERITED = t;
  }
}, TIMEOUT);

describe('U5b (a): the merit\'s sentence, directly after the standing', () => {
  it('the pool and the new cut-off are there: three wordings, two bands of time words, a recent cut-off under the generation', () => {
    expect(POOL).toHaveLength(3);
    expect(Object.keys(TIMES ?? {}).sort()).toEqual(['generation', 'recent']);
    expect(typeof RECENT).toBe('number');
    expect(RECENT).toBeLessThan(STANDING.weatheredWithinYears);
    // a wording threshold, not a law tuning (the chair, 01:48 UTC 2026-11-22): the law's table does not carry it
    expect(Object.keys(STANDING)).not.toContain('weatheredRecentYears'); // anchored: the same keys hold weatheredWithinYears, read one line above
  });

  it('every one of the six merited places prints the keyed pick, once, right after the standing; nothing else moved', () => {
    expect(POOL).toBeTruthy();
    const failures = collectSeedFailures(SIX, ({ seed, record }) => {
      expect(meritsOf(record).includes('weathered'), seed).toBe(true);
      const ev = /** @type {any} */ (weatheredCatastrophe(record));
      const picked = pickRendezvous(POOL, `${String(record.name).trim()}::${String(ev.name).trim()}::${ev.yearsAgo}`, idOfLine);
      const sentence = /** @type {string} */ (fillOf(POOL, TIMES, record, picked));
      // the first merit's own paragraph: the second merit's input taken away (U7b prints LASTING's line after this one)
      const merited = paragraphOf({ ...record, history: { ...record.history, age: undefined } });
      const law1 = paragraphOf(withLaw(record, 1));
      const bare = paragraphOf({ ...record, powerStructure: { ...record.powerStructure, publicLegitimacy: null } });
      expect(countOf(merited, sentence), `${seed}: ${merited}`).toBe(1);
      // the merit is the ONLY change: the law-1 paragraph with the sentence inserted at its place
      const at = merited.indexOf(` ${sentence}`);
      expect(at, seed).toBeGreaterThan(0);
      expect(merited, seed).toBe(`${law1.slice(0, at)} ${sentence}${law1.slice(at)}`);
      // and that place is the END of the standing: the paragraph without the standing is the law-1 one less the span
      // that ends exactly there (the standing and its one joining space)
      const span = law1.length - bare.length;
      expect(span, seed).toBeGreaterThan(1);
      expect(bare, seed).toBe(`${law1.slice(0, at - span)}${law1.slice(at)}`);
    });
    expectNoSeedFailures(failures, 'every merited place prints the keyed pick right after its standing');
  });

  it('both bands of the event\'s years are hit, each with the time word the law\'s table gives it', () => {
    const bands = new Set(SIX.map(({ record }) => bandOf(record)));
    expect([...bands].sort()).toEqual(['generation', 'recent']);
    const failures = collectSeedFailures(SIX, ({ seed, record }) => {
      const merited = paragraphOf(record);
      const band = /** @type {'recent'|'generation'} */ (bandOf(record));
      const other = band === 'recent' ? 'generation' : 'recent';
      const said = POOL.map((/** @type {any} */ line) => fillOf(POOL, TIMES, record, line)).filter((/** @type {string} */ s) => merited.includes(s));
      expect(said, seed).toHaveLength(1);
      expect(Object.values(TIMES[band]).some((w) => said[0].includes(/** @type {string} */ (w))), seed).toBe(true);
      expect(Object.values(TIMES[other]).some((w) => said[0].includes(/** @type {string} */ (w))), seed).toBe(false);
    });
    expectNoSeedFailures(failures, 'each place reads the time word of its band');
  });
});

describe('U5b (b): no merit, no sentence', () => {
  /** @param {any} record @returns {string[]} every sentence the pool could print for any catastrophe of the record */
  const anyFills = (record) => {
    const events = (record.history?.historicalEvents ?? []).filter((/** @type {any} */ e) => e && e.severity === STANDING.weatheredSeverity);
    const seat = powerNameInProse(String(rulingChainOf(record).power?.name ?? '').trim());
    return events.flatMap((/** @type {any} */ e) => POOL.flatMap((/** @type {any} */ line) => Object.values(TIMES).map((/** @type {any} */ w) => {
      /** @type {Record<string, string>} */
      const slots = { event: String(e.name).trim(), place: String(record.name).trim(), seat, ...w };
      return line.text.replace(/\{(\w+)\}/g, (/** @type {string} */ _m, /** @type {string} */ k) => slots[k] ?? '');
    })));
  };

  it('a law-1 birth (the law forced to 1), a law-2 birth without the merit and a record with no standing print none of it', () => {
    expect(POOL).toBeTruthy();
    expect(UNMERITED, 'a law-2 town without the merit among visitor-town-0..39').toBeTruthy();
    const record = SIX[0].record;
    const noStanding = { ...record, powerStructure: { ...record.powerStructure, publicLegitimacy: undefined } };
    for (const [name, r] of /** @type {Array<[string, any]>} */ ([['law 1', LAW1], ['law 2 unmerited', UNMERITED], ['no standing', noStanding]])) {
      expect(meritsOf(r), name).toEqual([]);
      const text = paragraphOf(r);
      expect(text.length, name).toBeGreaterThan(0);
      for (const fill of anyFills(r)) expect(text.includes(fill), `${name}: ${fill}`).toBe(false);
    }
  });
});

describe('U5b (c): the neutral reading no longer contradicts the merit (visitor-city-14)', () => {
  it('all four terms 0 and the merit present: the neutral-baseline reading does not print', () => {
    const record = SIX.find((p) => p.seed === 'visitor-city-14')?.record;
    const leg = record.powerStructure.publicLegitimacy;
    // the case itself (computed, not assumed)
    expect(['prosperity', 'safety', 'defense', 'food'].map((f) => leg.breakdown[f] ?? 0)).toEqual([0, 0, 0, 0]);
    expect(leg.breakdown.merits).toBeGreaterThan(0);
    expect(legitimacyReadingPoolKey(governanceLedger(record), leg)).toBeNull();
    // the line the neutral pool draws for this very place without its merit: printed there (the anchor), and not here
    const { merits: _merits, ...terms } = leg.breakdown;
    const unmerited = { ...record, powerStructure: { ...record.powerStructure, publicLegitimacy: { ...leg, breakdown: terms } } };
    expect(legitimacyReadingPoolKey(governanceLedger(unmerited), unmerited.powerStructure.publicLegitimacy)).toBe('neutral baseline (nothing pulling either way)');
    const opts = { seed: String(record._seed ?? record.id ?? ''), audience: /** @type {'dm'} */ ('dm') };
    const neutral = powerStateProse(unmerited, {}, opts).legitimacyReading?.sentence;
    expect(typeof neutral === 'string' && neutral.length > 0).toBe(true);
    expect(String(buildPrintProse(unmerited).power?.['power.criminalUnderside'] ?? '')).toContain(/** @type {string} */ (neutral));
    expect(powerStateProse(record, {}, opts).legitimacyReading).toBeNull();
    // anchored: the same sentence is asserted present on the unmerited copy's print above
    expect(String(buildPrintProse(record).power?.['power.criminalUnderside'] ?? '')).not.toContain(/** @type {string} */ (neutral));
  });
});

describe('U5b (d): the eighteen equalities (each wording, its time word, six places, three reads)', () => {
  it('each wording is one string on the owner\'s record, the shared read and the widest veil; all six pairs are reached', () => {
    expect(POOL).toBeTruthy();
    let equalities = 0;
    const pairs = new Set();
    const failures = collectSeedFailures(SIX, ({ seed, record }) => {
      const shared = toPublicSafe(record);
      const veiled = applyVeil(toPublicSafe(record), WIDEST);
      for (const line of POOL) {
        const own = fillOf(POOL, TIMES, record, line);
        expect(own, `${seed} ${line.id}`).toBeTruthy();
        expect(fillOf(POOL, TIMES, shared, line), `${seed} ${line.id} shared`).toBe(own);
        expect(fillOf(POOL, TIMES, veiled, line), `${seed} ${line.id} widest`).toBe(own);
        equalities += 1;
        pairs.add(`${line.id}:${bandOf(record)}`);
      }
      // and the paragraph prints the same one of them on all three reads (its key is served)
      const said = POOL.map((/** @type {any} */ line) => fillOf(POOL, TIMES, record, line)).filter((/** @type {string} */ s) => paragraphOf(record).includes(s));
      expect(said, seed).toHaveLength(1);
      expect(paragraphOf(shared), `${seed} shared`).toContain(said[0]);
      expect(paragraphOf(veiled), `${seed} widest`).toContain(said[0]);
    });
    expectNoSeedFailures(failures, 'each wording is one string on the three reads');
    expect(equalities).toBe(18);
    expect(pairs.size).toBe(6);
  });
});

describe('U5b (e): once on the page; every wording reachable', () => {
  it('the sentence is printed once on the whole power page (the desks and the paragraph)', () => {
    expect(POOL).toBeTruthy();
    const failures = collectSeedFailures(SIX, ({ seed, record }) => {
      const page = [...Object.values(buildPrintProse(record).power ?? {}), paragraphOf(record)].join(' ');
      const said = POOL.map((/** @type {any} */ line) => fillOf(POOL, TIMES, record, line)).filter((/** @type {string} */ s) => page.includes(s));
      expect(said, seed).toHaveLength(1);
      expect(countOf(page, said[0]), seed).toBe(1);
    });
    expectNoSeedFailures(failures, 'the sentence is printed once on the page');
  });

  it('each of the three wordings is reached (the same merited record under other names)', () => {
    expect(POOL).toBeTruthy();
    const record = SIX[0].record;
    const reached = new Set();
    for (let i = 0; i < 60 && reached.size < POOL.length; i += 1) {
      const renamed = { ...record, name: `Place ${i}` };
      const text = paragraphOf(renamed);
      for (const line of POOL) if (text.includes(/** @type {string} */ (fillOf(POOL, TIMES, renamed, line)))) reached.add(line.id);
    }
    expect([...reached].sort()).toEqual(POOL.map((/** @type {any} */ l) => l.id).sort());
  });
});

describe('U5b-WORDING: no wording says the event struck (the chair\'s ruling of 03:38 UTC 2026-11-22)', () => {
  /** @param {string} text @returns {string[]} the slots a wording names, sorted */
  const slotsOf = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
  /** @param {string} text @returns {string} the wording's opening clause (to its first ';' or ',') */
  const openingOf = (text) => text.split(/[;,]/)[0];
  /** @returns {any} wording B, the one the ruling left unchanged */
  const lineB = () => POOL?.find((/** @type {any} */ l) => l.id === 'B');

  it('every wording takes the opening wording B takes, and only the slots wording B takes', () => {
    expect(POOL).toHaveLength(3);
    const B = lineB();
    const off = POOL.filter((/** @type {any} */ l) => openingOf(l.text) !== openingOf(B.text)
      || slotsOf(l.text).join() !== slotsOf(B.text).join()).map((/** @type {any} */ l) => l.id);
    expect(off).toEqual([]);
  });

  it('each band keeps one time word, the one wording B takes', () => {
    const timeSlots = slotsOf(lineB().text).filter((k) => !['event', 'place', 'seat'].includes(k));
    expect(timeSlots).toHaveLength(1);
    for (const band of Object.keys(TIMES ?? {})) expect(Object.keys(TIMES[band]), band).toEqual(timeSlots);
  });
});
