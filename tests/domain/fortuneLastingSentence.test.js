/**
 * fortuneLastingSentence.test.js — FORTUNE U7b: THE SECOND MERIT'S (LASTING'S) SENTENCE IN THE GOVERNANCE PARAGRAPH (the
 * chair's words E57 and E57 amended, 2026-11-22 08:21 and 08:27 UTC; the brief
 * `docs/chair/2026-11-20/content/fortune/briefs/U7b-LASTING-SENTENCE.md`).
 *
 * ⭐ WHAT THIS FILE PROVES, on places born under the fortune law by the fixture arm
 * (`{ ...birthConfig(cfg), _fortuneLawVersion: 2 }` after `loadGenerationLawPayloads()`):
 *   (a) where `meritsOf` credits 'lasting' alone, the paragraph holds the pool's keyed pick among its drawn rows
 *       (`pickVariantMixed` keyed on `${place}::${age}`), its time word by `history.age` against the pool's own cut-off,
 *       DIRECTLY after the standing sentence, and nothing else of the paragraph moved (the same record with the merit's
 *       input taken away is the paragraph without it);
 *   (b) where both merits credit, the pool's ONE fixed row prints directly after the first merit's sentence, and none of
 *       the drawn rows does; the "It" opening prints only where the sentence before is one that opens on the place;
 *   (c) a law-1 birth, a law-2 birth without the merit and a record with no standing print none of the pool (the two-tree
 *       confinement proves the births themselves untouched);
 *   (d) THE EQUALITIES: each wording with its time word, on each place, is one string on the owner's record, on the
 *       read a share is served (`toPublicSafe` under its default veil) and under the widest veil (veil-probe.mjs ::
 *       widestOf); all eight (row, time word) pairs are reached. RE-STATED by the chair's RULING V3 (VEIL-53 UNIT A,
 *       2026-11-24), FAIL CLOSED: a veiled read carries no breakdown terms (`galleryWithholdAlways.js :: withholdAlways`),
 *       so its paragraph names no cause and every sentence is whole: the sentence opens on the place, never on "It" with
 *       a lost subject; the owner's record keeps its cause clause;
 *   (e) no sentence is printed twice in one place; each drawn wording is reachable.
 *
 * Every expected sentence is COMPUTED from the pool, its time words, its cut-off and the predicates (`meritsOf`,
 * `weatheredCatastrophe`); none is quoted.
 *
 * @enforced-by this test
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { governanceAccountOf, governanceStressTypesOf, legitimacyCausesOf, powerNameInProse } from '../../src/domain/display/governanceAccount.js';
import { resolvePrimaryStress } from '../../src/generators/stressPriority.js';
import { rulingChainOf } from '../../src/domain/dossier/powerStrata.js';
import { meritsOf, weatheredCatastrophe } from '../../src/domain/fortune/fortuneMerits.js';
import { FORTUNE_LAW_CONFIG_KEY, FORTUNE_LAW_TUNING } from '../../src/domain/fortune/fortuneLaw.js';
import { pickVariantMixed } from '../../src/kernel/proseHash.js';
import { FORTUNE_MERIT_LINES, FORTUNE_MERIT_RECENT_YEARS, FORTUNE_MERIT_TIME_WORDS } from '../../src/data/fortuneMeritLines.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { CARD_KINDS, GROUPING_REMOVERS, applyVeil, defaultVeilFor, resolveVeil } from '../../src/domain/display/galleryVeil.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const STANDING = /** @type {any} */ (FORTUNE_LAW_TUNING.standing);
const TIMEOUT = 240_000;

/** @param {any} v */
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
/** @param {any} s @param {string[]} path */
const listAt = (s, path) => { let v = s; for (const k of path) v = isRec(v) ? v[k] : undefined; return Array.isArray(v) ? v.filter(isRec) : []; };
/** @param {any} s @param {string} kind */
const cardsOf = (s, kind) => {
  const out = [];
  for (const path of /** @type {any} */ (CARD_KINDS)[kind].lists) {
    const star = path.indexOf('*');
    if (star < 0) { out.push(...listAt(s, path)); continue; }
    for (const owner of listAt(s, path.slice(0, star))) out.push(...listAt(owner, path.slice(star + 1)));
  }
  return out;
};
/** THE WIDEST VEIL (measures/lasting/veil-probe.mjs :: widestOf): every grouping, class switch, institution card and card field. @param {any} pub */
const widestOf = (pub) => {
  const a = [...Object.keys(GROUPING_REMOVERS),
    ...Object.entries(CARD_KINDS).flatMap(([kind, k]) => Object.keys(k.fields).map((f) => `class:${kind}:${f}`))];
  for (const [kind, k] of Object.entries(CARD_KINDS)) {
    for (const card of cardsOf(pub, kind)) {
      const id = /** @type {any} */ (k).idOf(card);
      if (!id) continue;
      if (kind === 'institution') a.push(`card:institution:${id}`);
      for (const f of Object.keys(k.fields)) a.push(`field:${kind}:${id}:${f}`);
    }
  }
  return a;
};

/**
 * The places: LASTING-RULED.md's three (Radhawadi lasting only; Albaminus both; Kabahchihua the captured hall under
 * Tolerated), Kilwood (both, under 200 years), and two places merited by LASTING alone whose standing opens on the place
 * (Bergstadt under 200 years, Tenoco over), found by seed search on the visitor pool. [seed, size].
 */
const PLACES = [
  ['visitor-thorp-52', 'thorp'],
  ['visitor-village-8', 'village'],
  ['visitor-hamlet-139', 'hamlet'],
  ['visitor-hamlet-31', 'hamlet'],
  ['visitor-hamlet-55', 'hamlet'],
  ['visitor-village-13', 'village'],
];

/** @param {string} seed @param {string} size @param {number|null} law the marker forced after birthConfig, or none */
const born = (seed, size, law) => {
  const config = birthConfig({ ...DEFAULT_CONFIG, settType: size, _randomizePriorities: true });
  return /** @type {any} */ (generateSettlementPipeline(law === null ? config : { ...config, [FORTUNE_LAW_CONFIG_KEY]: law }, null, { seed, customContent: {} }));
};

/** @param {any} record */
const paragraphOf = (record) => governanceAccountOf(record, { primaryStress: resolvePrimaryStress(governanceStressTypesOf(record)) })?.text ?? '';

/** @param {any} record @returns {any} the same record with LASTING's input taken away (no age: the merit cannot credit) */
const withoutAge = (record) => ({ ...record, history: { ...record.history, age: undefined } });

/** @param {any} record @returns {'alone'|'both'|null} the case `meritsOf` credits */
const caseOf = (record) => {
  const merits = meritsOf(record);
  if (!merits.includes('lasting')) return null;
  return merits.includes('weathered') ? 'both' : 'alone';
};

/** @param {any} record @returns {'generations'|'centuries'|null} the time word's band of `history.age` by the pool's cut-off */
const spanOf = (record) => {
  const age = record?.history?.age;
  if (typeof age !== 'number') return null;
  return age < CUT ? 'generations' : 'centuries';
};

/** @param {any} record @returns {Record<string, string>} the paragraph's own fills */
const slotsOf = (record) => ({
  place: String(record.name).trim(),
  seat: powerNameInProse(String(rulingChainOf(record).power?.name ?? '').trim()),
  ...TIMES[/** @type {string} */ (spanOf(record))],
});

/** @param {string} text @param {Record<string, string>} slots */
const fill = (text, slots) => text.replace(/\{(\w+)\}/g, (/** @type {string} */ _m, /** @type {string} */ k) => slots[k] ?? '');

/**
 * The pool's row filled for this record (the place's name opening it), COMPUTED; null where the row's case is not the
 * record's. @param {any} record @param {{ text: string, when: string }} line
 */
const fillOf = (record, line) => (caseOf(record) === line.when && spanOf(record) ? fill(line.text, slotsOf(record)) : null);

/** @param {string} sentence the row filled @returns {string} the same row opening on "It" */
const onIt = (sentence) => `It${sentence.slice(sentence.indexOf(' '))}`;

/** @param {string} hay @param {string} needle */
const countOf = (hay, needle) => hay.split(needle).length - 1;

/** @param {string} text @returns {string} the last sentence of a run of sentences */
const lastSentenceOf = (text) => text.split(/(?<=\.) /).pop() ?? '';

/** @param {any} record @returns {string} the first merit's sentence for this record, COMPUTED from its own pool */
const weatheredSentenceOf = (record) => {
  const ev = /** @type {any} */ (weatheredCatastrophe(record));
  const band = ev.yearsAgo <= FORTUNE_MERIT_RECENT_YEARS ? FORTUNE_MERIT_TIME_WORDS.recent : FORTUNE_MERIT_TIME_WORDS.generation;
  const place = String(record.name).trim();
  const picked = /** @type {any} */ (pickVariantMixed(FORTUNE_MERIT_LINES, `${place}::${String(ev.name).trim()}::${ev.yearsAgo}`));
  return fill(picked.text, { event: String(ev.name).trim(), place, seat: slotsOf(record).seat, ...band });
};

/** @type {any} */ let POOL = null;
/** @type {any} */ let DRAWN = null;
/** @type {any} */ let FIXED = null;
/** @type {any} */ let TIMES = null;
/** @type {any} */ let CUT = null;
/** @type {Array<{ seed: string, record: any }>} */ const SIX = [];
/** @type {any} */ let LAW1 = null;
/** @type {any} */ let UNMERITED = null;

beforeAll(async () => {
  // the pool is imported by its own door so that a tree without it reds BY TITLE, not as a load failure
  const lines = await import('../../src/data/fortuneLastingLines.js').catch(() => null);
  POOL = lines?.FORTUNE_LASTING_LINES ?? null;
  DRAWN = POOL?.filter((/** @type {any} */ l) => l.when === 'alone') ?? null;
  FIXED = POOL?.find((/** @type {any} */ l) => l.when === 'both') ?? null;
  TIMES = lines?.FORTUNE_LASTING_TIME_WORDS ?? null;
  CUT = lines?.FORTUNE_LASTING_CENTURIES_YEARS ?? null;
  await loadGenerationLawPayloads();
  for (const [seed, size] of PLACES) SIX.push({ seed, record: born(seed, size, 2) });
  // the law-1 town FORCES law 1 in its own config (the flip, 2026-11-23: born markerless it was law 1 only while the dial was dark)
  LAW1 = born('visitor-thorp-52', 'thorp', 1);
  for (let i = 0; i < 40 && !UNMERITED; i += 1) {
    const t = born(`visitor-town-${i}`, 'town', 2);
    if (!meritsOf(t).length && t.powerStructure?.publicLegitimacy?.label) UNMERITED = t;
  }
}, TIMEOUT);

/**
 * The sentence the paragraph prints for this record, COMPUTED: the keyed pick among the drawn rows where LASTING credits
 * alone (opening on "It" where the standing's last sentence opens on the place), the fixed row where both merits credit.
 * @param {any} record @param {string} standing the standing as the paragraph printed it
 */
const expectedOf = (record, standing) => {
  if (caseOf(record) === 'both') return fill(FIXED.text, slotsOf(record));
  const picked = /** @type {any} */ (pickVariantMixed(DRAWN, `${String(record.name).trim()}::${record.history.age}`));
  const sentence = fill(picked.text, slotsOf(record));
  return lastSentenceOf(standing).startsWith(`${String(record.name).trim()} `) ? onIt(sentence) : sentence;
};

/**
 * Where the merit's sentence sits: the paragraph without LASTING's input, the index the sentence is inserted at, and the
 * span before it (the standing, or the first merit's sentence where both credit).
 * @param {any} record
 */
const placementOf = (record) => {
  const without = paragraphOf(withoutAge(record));
  const bare = paragraphOf({ ...record, powerStructure: { ...record.powerStructure, publicLegitimacy: null } });
  return { without, bare };
};

describe('U7b (a): the LASTING sentence, directly after the standing, where LASTING credits alone', () => {
  it('the pool is there: four rows (three drawn, one fixed for both merits), two bands of time words, a wording cut-off not in the law\'s table', () => {
    expect(POOL).toHaveLength(4);
    expect(DRAWN?.map((/** @type {any} */ l) => l.id)).toEqual(['A', 'B', 'C']);
    expect(FIXED).toBeTruthy();
    expect(Object.keys(TIMES ?? {}).sort()).toEqual(['centuries', 'generations']);
    expect(typeof CUT).toBe('number');
    // a wording threshold beside its words (E57), never a law tuning: no key of the law's table holds its figure
    expect(Object.values(STANDING).includes(CUT)).toBe(false);
  });

  it('every place merited by LASTING alone prints the keyed pick, once, right after the standing; nothing else moved', () => {
    expect(DRAWN).toBeTruthy();
    const alone = SIX.filter(({ record }) => caseOf(record) === 'alone');
    expect(alone.map(({ seed }) => seed)).toEqual(['visitor-thorp-52', 'visitor-hamlet-139', 'visitor-hamlet-55', 'visitor-village-13']);
    const failures = collectSeedFailures(alone, ({ seed, record }) => {
      const merited = paragraphOf(record);
      const { without, bare } = placementOf(record);
      // the keyed pick, filled: printed once, in one of its two openings
      const picked = fill(/** @type {any} */ (pickVariantMixed(DRAWN, `${String(record.name).trim()}::${record.history.age}`)).text, slotsOf(record));
      const printed = [picked, onIt(picked)].filter((s) => merited.includes(s));
      expect(printed, `${seed}: ${merited}`).toHaveLength(1);
      expect(countOf(merited, printed[0]), seed).toBe(1);
      // the merit is the ONLY change: the paragraph without LASTING's input with the sentence inserted at its place
      const at = merited.indexOf(` ${printed[0]}`);
      expect(at, seed).toBeGreaterThan(0);
      expect(merited, seed).toBe(`${without.slice(0, at)} ${printed[0]}${without.slice(at)}`);
      // and that place is the END of the standing: the paragraph without the standing is the one without LASTING less the
      // span that ends exactly there (the standing and its one joining space)
      const span = without.length - bare.length;
      expect(span, seed).toBeGreaterThan(1);
      expect(bare, seed).toBe(`${without.slice(0, at - span)}${without.slice(at)}`);
      // and the opening is the one the standing calls for ("It" only after a standing whose last sentence opens on the place)
      expect(printed[0], seed).toBe(expectedOf(record, without.slice(at - span, at).trim()));
    });
    expectNoSeedFailures(failures, 'every place merited by LASTING alone prints the keyed pick right after its standing');
  });

  it('both bands of the age are hit, each with the time word its band gives', () => {
    expect(TIMES).toBeTruthy();
    const failures = collectSeedFailures(SIX, ({ seed, record }) => {
      const merited = paragraphOf(record);
      const band = /** @type {string} */ (spanOf(record));
      const other = band === 'generations' ? 'centuries' : 'generations';
      const lines = caseOf(record) === 'both' ? [FIXED] : DRAWN;
      const said = lines.map((/** @type {any} */ l) => /** @type {string} */ (fillOf(record, l)))
        .filter((/** @type {string} */ s) => merited.includes(s) || merited.includes(onIt(s)));
      expect(said, seed).toHaveLength(1);
      expect(said[0].includes(TIMES[band].span), seed).toBe(true);
      expect(said[0].includes(TIMES[other].span), seed).toBe(false);
    });
    expectNoSeedFailures(failures, 'each place reads the time word of its band');
    expect([...new Set(SIX.map(({ record }) => spanOf(record)))].sort()).toEqual(['centuries', 'generations']);
  });
});

describe('U7b (b): both merits, the fixed line; the "It" opening', () => {
  it('where both merits credit, the fixed line prints directly after the first merit\'s sentence, and no drawn row prints', () => {
    expect(FIXED).toBeTruthy();
    const both = SIX.filter(({ record }) => caseOf(record) === 'both');
    expect(both.map(({ seed }) => seed)).toEqual(['visitor-village-8', 'visitor-hamlet-31']);
    const failures = collectSeedFailures(both, ({ seed, record }) => {
      const merited = paragraphOf(record);
      const { without } = placementOf(record);
      const sentence = /** @type {string} */ (fillOf(record, FIXED));
      expect(countOf(merited, sentence), `${seed}: ${merited}`).toBe(1);
      const weathered = weatheredSentenceOf(record);
      const at = without.indexOf(weathered) + weathered.length;
      expect(at, seed).toBeGreaterThan(weathered.length);
      expect(merited, seed).toBe(`${without.slice(0, at)} ${sentence}${without.slice(at)}`);
      for (const line of DRAWN) {
        const drawn = fill(line.text, slotsOf(record));
        expect(merited.includes(drawn) || merited.includes(onIt(drawn)), `${seed} ${line.id}`).toBe(false);
      }
    });
    expectNoSeedFailures(failures, 'the fixed line prints where both merits credit, and no drawn row does');
  });

  it('where LASTING credits alone the fixed line never prints; "It" opens the sentence only after a standing that opens on the place', () => {
    expect(FIXED).toBeTruthy();
    let onItSeen = 0; let onPlaceSeen = 0;
    const failures = collectSeedFailures(SIX, ({ seed, record }) => {
      const merited = paragraphOf(record);
      const place = String(record.name).trim();
      const slots = slotsOf(record);
      expect(caseOf(record) === 'alone' && merited.includes(fill(FIXED.text, slots)), seed).toBe(false);
      const drawnIt = DRAWN.map((/** @type {any} */ l) => onIt(fill(l.text, slots))).filter((/** @type {string} */ s) => merited.includes(s));
      const fixedIt = onIt(fill(FIXED.text, slots));
      expect(merited.includes(fixedIt), seed).toBe(false);
      if (caseOf(record) === 'both') { expect(drawnIt, seed).toEqual([]); return; }
      const picked = fill(/** @type {any} */ (pickVariantMixed(DRAWN, `${place}::${record.history.age}`)).text, slots);
      const printed = merited.includes(onIt(picked)) ? onIt(picked) : picked;
      expect(countOf(merited, printed), `${seed}: ${merited}`).toBe(1);
      const opensOnPlace = lastSentenceOf(merited.slice(0, merited.indexOf(printed)).trim()).startsWith(`${place} `);
      expect(printed === onIt(picked), `${seed}: ${merited}`).toBe(opensOnPlace);
      expect(drawnIt.length, seed).toBe(opensOnPlace ? 1 : 0);
      if (opensOnPlace) onItSeen += 1; else onPlaceSeen += 1;
    });
    expectNoSeedFailures(failures, 'the "It" opening prints only after a standing that opens on the place');
    expect([onItSeen, onPlaceSeen]).toEqual([2, 2]);
  });

  it('where both merits credit but the first merit\'s sentence did not print (its event\'s stored name empty), the place takes a drawn row, not the fixed one', () => {
    expect(FIXED).toBeTruthy();
    const { seed, record } = /** @type {{ seed: string, record: any }} */ (SIX.find((p) => p.seed === 'visitor-village-8'));
    // the planted record: the weathered event's stored name emptied in a copy, the merits it credits unchanged
    const planted = structuredClone(record);
    const original = String(/** @type {any} */ (weatheredCatastrophe(record)).name).trim();
    /** @type {any} */ (weatheredCatastrophe(planted)).name = '';
    expect(String(/** @type {any} */ (weatheredCatastrophe(planted)).name), seed).toBe('');
    expect(meritsOf(planted), seed).toEqual(['weathered', 'lasting']);
    const merited = paragraphOf(planted);
    const place = String(planted.name).trim();
    const slots = slotsOf(planted);
    // not the fixed row, in either opening
    expect(merited.includes(fill(FIXED.text, slots)) || merited.includes(onIt(fill(FIXED.text, slots))), `${seed}: ${merited}`).toBe(false);
    // exactly one drawn row, and it is the keyed pick
    const said = DRAWN.flatMap((/** @type {any} */ l) => { const s = fill(l.text, slots); return [s, onIt(s)]; })
      .filter((/** @type {string} */ s) => merited.includes(s));
    const picked = fill(/** @type {any} */ (pickVariantMixed(DRAWN, `${place}::${planted.history.age}`)).text, slots);
    expect(said, `${seed}: ${merited}`).toHaveLength(1);
    expect([picked, onIt(picked)].includes(said[0]), `${seed}: ${merited}`).toBe(true);
    // in the opening the file's own rule gives: "It" only after a standing whose last sentence opens on the place
    const { without, bare } = placementOf(planted);
    const at = merited.indexOf(` ${said[0]}`);
    expect(at, seed).toBeGreaterThan(0);
    expect(merited, seed).toBe(`${without.slice(0, at)} ${said[0]}${without.slice(at)}`);
    const span = without.length - bare.length;
    const standing = without.slice(at - span, at).trim();
    expect(said[0], seed).toBe(lastSentenceOf(standing).startsWith(`${place} `) ? onIt(picked) : picked);
    // and no first-merit sentence, under the planted name or the stored one, in either band of time words
    for (const line of FORTUNE_MERIT_LINES) {
      for (const band of Object.values(FORTUNE_MERIT_TIME_WORDS)) {
        for (const event of ['', original]) {
          const s = fill(line.text, { event, place, seat: slots.seat, ...band });
          expect(merited.includes(s.trim()), `${seed} ${line.id}: ${s}`).toBe(false);
        }
      }
    }
  });
});

describe('U7b (c): no merit, no sentence', () => {
  /** @param {any} record @returns {string[]} every sentence the pool could print for the record, either time word, either opening */
  const anyFills = (record) => {
    const base = { place: String(record.name).trim(), seat: powerNameInProse(String(rulingChainOf(record).power?.name ?? '').trim()) };
    return POOL.flatMap((/** @type {any} */ line) => Object.values(TIMES).flatMap((/** @type {any} */ w) => {
      const sentence = fill(line.text, { ...base, ...w });
      return [sentence, onIt(sentence)];
    }));
  };

  it('a law-1 birth (the law forced to 1), a law-2 birth without the merit and a record with no standing print none of the pool', () => {
    expect(POOL).toBeTruthy();
    expect(UNMERITED, 'a law-2 town without a merit among visitor-town-0..39').toBeTruthy();
    const record = SIX[0].record;
    const noStanding = { ...record, powerStructure: { ...record.powerStructure, publicLegitimacy: undefined } };
    for (const [name, r] of /** @type {Array<[string, any]>} */ ([['law 1', LAW1], ['law 2 unmerited', UNMERITED], ['no standing', noStanding]])) {
      expect(meritsOf(r), name).toEqual([]);
      const text = paragraphOf(r);
      expect(text.length, name).toBeGreaterThan(0);
      for (const sentence of anyFills(r)) expect(text.includes(sentence), `${name}: ${sentence}`).toBe(false);
    }
  });
});

describe('U7b (d): the equalities (each wording, its time word, three reads), FAIL CLOSED on the veiled reads (RULING V3)', () => {
  /** @param {any} pub @returns {any} the read a share is served: its default veil, no delta */
  const servedOf = (pub) => applyVeil(pub, resolveVeil(defaultVeilFor(pub), []));
  /** @param {string} s */
  const capFirst = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
  /** @param {string} text @returns {string[]} */
  const sentencesOf = (text) => text.split(/(?<=\.) /);
  /** @param {any} record @returns {string[]} every cause word the composer can name for the record, either direction (COMPUTED) */
  const causeWordsOf = (record) => {
    const safetyLabel = record.economicState?.safetyProfile?.safetyLabel;
    const fields = Object.keys(record.powerStructure.publicLegitimacy.breakdown).filter((f) => f !== 'merits');
    const zero = Object.fromEntries(fields.map((f) => [f, 0]));
    return [...new Set(fields.flatMap((f) => [1, -1].flatMap((sign) => [true, false]
      .flatMap((adverse) => legitimacyCausesOf({ ...zero, [f]: sign }, adverse, safetyLabel)))))];
  };
  /** @param {any} record @returns {string} the owner's cause clause as it opens its sentence, '' where its breakdown names none */
  const clauseOf = (record) => {
    const pl = record.powerStructure.publicLegitimacy;
    const adverse = !!(pl.isLegitimacyCrisis || pl.isContested || pl.isTolerated);
    const causes = legitimacyCausesOf(pl.breakdown, adverse, record.economicState?.safetyProfile?.safetyLabel);
    return causes.length ? capFirst(causes.join(' and ')) : '';
  };

  it('each wording is one string on the owner\'s record, the served read and the widest veil; all eight pairs are reached', () => {
    expect(POOL).toBeTruthy();
    let equalities = 0;
    const pairs = new Set();
    const failures = collectSeedFailures(SIX, ({ seed, record }) => {
      const shared = servedOf(toPublicSafe(record));
      const veiled = applyVeil(toPublicSafe(record), widestOf(toPublicSafe(record)));
      const lines = POOL.filter((/** @type {any} */ l) => l.when === caseOf(record));
      expect(lines.length, seed).toBeGreaterThan(0);
      for (const line of lines) {
        const own = fillOf(record, line);
        expect(own, `${seed} ${line.id}`).toBeTruthy();
        expect(fillOf(shared, line), `${seed} ${line.id} shared`).toBe(own);
        expect(fillOf(veiled, line), `${seed} ${line.id} widest`).toBe(own);
        equalities += 1;
        pairs.add(`${line.id}:${spanOf(record)}`);
      }
    });
    expectNoSeedFailures(failures, 'each wording is one string on the three reads');
    expect(equalities).toBe(14);
    expect([...pairs].sort()).toEqual(POOL.flatMap((/** @type {any} */ l) => Object.keys(TIMES).map((t) => `${l.id}:${t}`)).sort());
  });

  it('the owner\'s record keeps its cause clause, on every place of the arm whose breakdown names one', () => {
    /** @type {string[]} */ const withClause = [];
    const failures = collectSeedFailures(SIX, ({ seed, record }) => {
      const clause = clauseOf(record);
      if (!clause) return;
      withClause.push(seed);
      const said = sentencesOf(paragraphOf(record)).filter((s) => s.startsWith(`${clause} `));
      expect(said, `${seed}: ${paragraphOf(record)}`).toHaveLength(1);
    });
    expectNoSeedFailures(failures, 'the owner\'s read keeps its cause clause');
    expect(withClause).toEqual(['visitor-thorp-52', 'visitor-village-8', 'visitor-hamlet-139']);
  });

  it('a veiled read (the served read, the widest veil) names no cause, and every sentence is whole: LASTING\'s opens on the place', () => {
    expect(POOL).toBeTruthy();
    let veiledReads = 0;
    const failures = collectSeedFailures(SIX, ({ seed, record }) => {
      const words = causeWordsOf(record);
      expect(words.length, seed).toBeGreaterThan(0);
      const lines = POOL.filter((/** @type {any} */ l) => l.when === caseOf(record));
      // the sentence the paragraph prints, opening on the place: the keyed pick where LASTING credits alone, the fixed row where both
      const placeForm = caseOf(record) === 'both' ? /** @type {string} */ (fillOf(record, FIXED))
        : fill(/** @type {any} */ (pickVariantMixed(DRAWN, `${String(record.name).trim()}::${record.history.age}`)).text, slotsOf(record));
      const pub = toPublicSafe(record);
      for (const [name, read] of /** @type {Array<[string, any]>} */ ([['widest', applyVeil(pub, widestOf(pub))], ['shared', servedOf(pub)]])) {
        expect(meritsOf(read), `${seed} ${name}`).toEqual(meritsOf(record));
        const paragraph = paragraphOf(read);
        const sentences = sentencesOf(paragraph);
        // no cause clause: no sentence opens on a cause word
        for (const word of words) expect(sentences.some((s) => s.startsWith(`${capFirst(word)} `)), `${seed} ${name} ${word}: ${paragraph}`).toBe(false);
        // LASTING's sentence, once, opening on the place; never its "It" form with the subject lost
        expect(placeForm.startsWith(`${String(record.name).trim()} `), seed).toBe(true);
        expect(countOf(paragraph, placeForm), `${seed} ${name}: ${paragraph}`).toBe(1);
        for (const line of lines) {
          for (const w of Object.values(TIMES)) {
            const s = fill(line.text, { ...slotsOf(record), .../** @type {any} */ (w) });
            expect(paragraph.includes(onIt(s)), `${seed} ${name} ${line.id}: ${paragraph}`).toBe(false);
          }
        }
        // every sentence whole: it opens on a capital and closes on its stop
        for (const s of sentences) expect(/^[A-Z].*\.$/.test(s), `${seed} ${name}: "${s}"`).toBe(true);
        veiledReads += 1;
      }
    });
    expectNoSeedFailures(failures, 'a veiled read names no cause, and LASTING\'s sentence opens on the place');
    expect(veiledReads).toBe(SIX.length * 2);
  });
});

describe('U7b (e): once in the place; every drawn wording reachable', () => {
  it('the sentence is printed once on the whole power page, and no sentence of the paragraph is printed twice', () => {
    expect(POOL).toBeTruthy();
    const failures = collectSeedFailures(SIX, ({ seed, record }) => {
      const paragraph = paragraphOf(record);
      const page = [...Object.values(buildPrintProse(record).power ?? {}), paragraph].join(' ');
      const said = POOL.flatMap((/** @type {any} */ l) => Object.values(TIMES).flatMap((/** @type {any} */ w) => {
        const s = fill(l.text, { ...slotsOf(record), ...w });
        return [s, onIt(s)];
      })).filter((/** @type {string} */ s) => page.includes(s));
      expect(said, seed).toHaveLength(1);
      expect(countOf(page, said[0]), seed).toBe(1);
      const sentences = paragraph.split(/(?<=\.) /);
      expect(sentences.length - new Set(sentences).size, `${seed}: ${paragraph}`).toBe(0);
    });
    expectNoSeedFailures(failures, 'the sentence is printed once in the place');
  });

  it('each of the three drawn wordings is reached (the same merited record under other names)', () => {
    expect(DRAWN).toBeTruthy();
    const record = SIX[0].record;
    const reached = new Set();
    for (let i = 0; i < 60 && reached.size < DRAWN.length; i += 1) {
      const renamed = { ...record, name: `Place ${i}` };
      const text = paragraphOf(renamed);
      for (const line of DRAWN) {
        const s = fill(line.text, slotsOf(renamed));
        if (text.includes(s) || text.includes(onIt(s))) reached.add(line.id);
      }
    }
    expect([...reached].sort()).toEqual(['A', 'B', 'C']);
  });
});
